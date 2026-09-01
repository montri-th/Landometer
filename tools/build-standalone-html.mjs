#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const toolName = path.basename(fileURLToPath(import.meta.url));
const deploymentDir = path.resolve(toolDir, "../deployment");
const sourcePath = path.join(deploymentDir, "index.html");
const registryPath = path.join(deploymentDir, "assets/data/color-delivery.v0.9.1.json");
const historicalRegistryPath = path.join(deploymentDir, "assets/data/color-delivery.v0.9.0.json");
const latestName = "landometer-design-system-v0.9.1-standalone.html";
const latestPath = path.join(deploymentDir, latestName);
const expectedArtifactBuild = "ui-20260901-01";
const expectedColorSet = "color-srgb-05";
const expectedImmutableName = "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260901-01.html";
const expectedHistoricalBaseline = "landometer-design-system-v0.9.0-standalone.color-srgb-05.html";
const publicBase = "https://montri-th.github.io/Landometer/";
const faviconPath = "assets/images/landometer-symbol-transparent.png";
const faviconSha256 = "35a1496f6e8c502cef82f0a46de5dacff98718ff9f5a6c07ccc3783d76e3ae85";
const publicFaviconUrl = new URL(`${faviconPath}?v=${faviconSha256.slice(0, 8)}`, publicBase).href;
const checkOnly = process.argv.includes("--check");

const embeddedAssets = [
  ["assets/fonts/arvo-latin-700-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-latin-400-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-latin-600-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-thai-400-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-thai-600-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-looped-latin-700-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-looped-thai-700-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-thai-400-normal.woff2", "font/woff2"],
  ["assets/fonts/jetbrains-mono-latin-400-normal.woff2", "font/woff2"],
  ["assets/images/landometer-logo-banner.png", "image/png"],
  ["assets/images/team-hero.jpg", "image/jpeg"],
];

function assert(condition, message) {
  if (!condition) throw new Error(`Standalone build failed: ${message}`);
}

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readIfPresent(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function dataUrl(relativePath, mime) {
  const bytes = await readFile(path.join(deploymentDir, relativePath));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

async function atomicWrite(filePath, contents) {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, contents, "utf8");
  await rename(temporaryPath, filePath);
}

const registry = JSON.parse(await readFile(registryPath, "utf8"));
const historicalRegistry = JSON.parse(await readFile(historicalRegistryPath, "utf8"));

assert(registry?.meta?.id === expectedColorSet, "v0.9.1 must retain Color Set color-srgb-05");
assert(registry?.meta?.designSystemVersion === "0.9.1", "unexpected design-system version in v0.9.1 color-delivery record");
assert(registry?.meta?.authoringRevision === "0.9.1-r8", "unexpected authoring revision in v0.9.1 color-delivery record");
assert(registry?.meta?.immutableColorBaseline === expectedHistoricalBaseline, "v0.9.1 must reference, not remint, the v0.9.0 color-srgb-05 baseline");
assert(registry?.meta?.currentArtifactBuild?.id === expectedArtifactBuild, "unexpected v0.9.1 artifact-build id");
assert(registry?.meta?.currentArtifactBuild?.immutableStandalone === expectedImmutableName, "unexpected v0.9.1 immutable standalone filename");
const currentArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === expectedArtifactBuild && record.path === expectedImmutableName,
);
assert(
  currentArtifactRecord?.role === "immutable_ui_build" &&
    currentArtifactRecord?.colorRegistryId === expectedColorSet &&
    (currentArtifactRecord?.status === "append_only" ||
      currentArtifactRecord?.status?.startsWith("prepared")),
  "the v0.9.1 immutable UI build record is missing or invalid",
);

const historicalBaselineRecord = historicalRegistry?.artifactBuilds?.find(
  (record) => record.path === expectedHistoricalBaseline,
);
assert(
  historicalBaselineRecord?.role === "immutable_color_baseline" &&
    historicalBaselineRecord?.colorRegistryId === expectedColorSet &&
    historicalBaselineRecord?.status === "append_only",
  "the frozen v0.9.0 color-srgb-05 baseline record is missing",
);
const historicalBaselinePath = path.join(deploymentDir, expectedHistoricalBaseline);
const historicalBaseline = await readFile(historicalBaselinePath);
assert(
  historicalBaseline.byteLength === historicalBaselineRecord.bytes &&
    sha256(historicalBaseline) === historicalBaselineRecord.sha256,
  `historical immutable baseline changed: ${expectedHistoricalBaseline}`,
);

let html = await readFile(sourcePath, "utf8");
assert(/data-ds-version=("|')0\.9\.1\1/.test(html), "index.html is not DS 0.9.1");
assert(/data-authoring-revision=("|')0\.9\.1-r8\1/.test(html), "index.html has the wrong authoring revision");
assert(/data-ruleset=("|')lds-rules-0\.9\.1\1/.test(html), "index.html has the wrong ruleset revision");
assert(/data-machine-package-identity=("|')v0\.9\.1-mp7\1/.test(html), "index.html has the wrong machine-package identity receipt");
assert(new RegExp(`data-color-registry=("|')${expectedColorSet}\\1`).test(html), "index.html does not retain color-srgb-05");
assert(new RegExp(`data-artifact-build=("|')${expectedArtifactBuild}\\1`).test(html), "index.html has the wrong artifact-build id");
assert(/data-build-channel=("|')latest-alias\1/.test(html), "index.html must be the latest alias channel");
assert(/data-evidence-status=("|')source_limited\1/.test(html), "index.html must preserve the downstream artifact evidence boundary");
assert(/data-machine-validation=("|')pending\1/.test(html), "index.html must not turn machine-package identity into an artifact validation claim");

html = html.replace(/\n\s*<link\s+rel="canonical"\s+href="[^"]+">\s*/i, "\n");

for (const [relativePath, mime] of embeddedAssets) {
  const encoded = await dataUrl(relativePath, mime);
  const matcher = new RegExp(escapeRegex(relativePath), "g");
  const matches = html.match(matcher)?.length ?? 0;
  assert(matches > 0, `display asset is not referenced: ${relativePath}`);
  html = html.replace(matcher, encoded);
}

html = html.replace(
  /href="(?!#|https?:|data:|mailto:|tel:)([^"]+)"/g,
  (_, relativeHref) => `href="${new URL(relativeHref, publicBase).href}"`,
);
html = html.replace('data-ds="landometer"', 'data-ds="landometer"\n  data-standalone="true"');
html = html.replace(
  "<head>",
  "<head>\n  <!-- Self-contained noncanonical snapshot generated from deployment/index.html. Display fonts and page images are embedded; browser-tab identity and linked release records use stable production URLs. -->",
);

assert(html.includes('data-standalone="true"'), "standalone marker is missing");
assert(!/<link\b[^>]*\brel="preload"[^>]*\bas="font"/i.test(html), "standalone must not retain declarative font preloads");
assert(!/<link\s+rel="canonical"\b/i.test(html), "standalone must not claim the live canonical URL");
assert(
  html.includes('location.protocol === "file:"') &&
    html.includes('root.dataset.standalone !== "true"') &&
    html.includes('location.replace(target.href)') &&
    html.includes('!["http:", "https:"].includes(location.protocol)'),
  "direct-file handoff or hosted-only font-preload guard is missing",
);
assert(
  html.includes(`href="${publicFaviconUrl}"`) &&
    !/<link\b[^>]*\brel="icon"[^>]*\bhref="data:/i.test(html),
  "standalone browser-tab icon must use the stable cache-revisioned production URL",
);
assert(!/(?:src|href)="assets\//.test(html), "relative display asset remains");
assert(!/url\(["']?assets\//.test(html), "relative CSS asset remains");
assert((html.match(/data:font\/woff2;base64,/g) ?? []).length === 10, "standalone must embed the nine text faces and Material Symbols subset");
assert((html.match(/class="atlas-scale-record"/g) ?? []).length === 18, "embedded atlas must retain 18 scale records");
assert((html.match(/class="atlas-lut-cell"/g) ?? []).length === 18 * 41, "embedded atlas must retain 738 LUT cells");
assert((html.match(/class="atlas-class-cell"/g) ?? []).length === 18 * (5 + 7 + 9), "embedded atlas must retain every 5/7/9 class cell");
assert((html.match(/class="scale-family-card"/g) ?? []).length === 9, "embedded sampler must retain all nine families");
assert((html.match(/class="scale-family-class-cell"/g) ?? []).length === 9 * (5 + 7 + 9), "embedded sampler must retain every paired 5/7/9 class cell");

const immutableHtml = html.replace(
  'data-build-channel="latest-alias"',
  'data-build-channel="immutable-artifact-build"',
);
assert(immutableHtml !== html, "immutable build-channel marker was not produced");
assert(
  immutableHtml.includes(`data-color-registry="${expectedColorSet}"`) &&
    immutableHtml.includes(`data-artifact-build="${expectedArtifactBuild}"`) &&
    immutableHtml.includes('data-build-channel="immutable-artifact-build"'),
  "immutable UI artifact markers are missing",
);

const immutablePath = path.join(deploymentDir, expectedImmutableName);
const committedLatest = await readIfPresent(latestPath);
const committedImmutable = await readIfPresent(immutablePath);
if (currentArtifactRecord.status === "append_only") {
  assert(committedImmutable !== null, `append-only immutable UI build is missing: ${expectedImmutableName}`);
  assert(
    Buffer.byteLength(committedImmutable) === currentArtifactRecord.bytes &&
      sha256(committedImmutable) === currentArtifactRecord.sha256,
    `append-only immutable UI build changed: ${expectedImmutableName}`,
  );
}

if (checkOnly) {
  assert(committedLatest === html, `latest standalone is stale; run ${toolName}`);
  assert(committedImmutable === immutableHtml, `immutable UI build is missing or stale: ${expectedImmutableName}`);
  process.stdout.write(`Standalone check passed for ${latestName} and ${expectedImmutableName} (${expectedArtifactBuild}); historical Color Set baseline preserved\n`);
} else {
  assert(
    committedImmutable === null || committedImmutable === immutableHtml,
    `immutable UI build already exists with different bytes: ${expectedImmutableName}. Preserve it and mint a new artifact-build id and filename.`,
  );
  await atomicWrite(latestPath, html);
  if (committedImmutable === null) await atomicWrite(immutablePath, immutableHtml);
  process.stdout.write(`Wrote ${latestPath} (${Buffer.byteLength(html).toLocaleString("en-US")} bytes) and ${committedImmutable === null ? "created" : "preserved"} ${immutablePath}; preserved ${historicalBaselinePath}\n`);
}
