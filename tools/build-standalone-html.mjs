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
const expectedArtifactBuild = "ui-20260902-08";
const expectedColorSet = "color-srgb-05";
const expectedImmutableName = "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-08.html";
const expectedHistoricalBaseline = "landometer-design-system-v0.9.0-standalone.color-srgb-05.html";
const preservedUiBuilds = Object.freeze([
  {
    id: "ui-20260902-07",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-07.html",
    sha256: "7abf389bf53798dcd2618db33de6fcb51a1f3cabd210ae178e3e17437246c910",
  },
  {
    id: "ui-20260902-06",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-06.html",
    sha256: "3eb1866ec860f1cbfee998eb3155f9a1c4fa40b7a2881dda903e6c163d7d2d55",
  },
  {
    id: "ui-20260902-05",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-05.html",
    sha256: "8e25a5c8b0f39b8d96d433720681222ea06027862e8749922546678e355c05cf",
  },
  {
    id: "ui-20260902-04",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-04.html",
    sha256: "5e2f707b333e0424ea9035f7392022514e0e37bf4ca0aa4680617483889fe42a",
  },
  {
    id: "ui-20260902-03",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-03.html",
    sha256: "804f01102cd596d424acad6f3db23a00c5646fed04f6493fac89a88adb4ca332",
  },
  {
    id: "ui-20260902-02",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-02.html",
    sha256: "818f106d0b964c6fc5a0ace20e82de1a4918b0c84b261362e4b896a4b7a737ee",
  },
  {
    id: "ui-20260902-01",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-01.html",
    sha256: "a95f50caf4bd10ed73a8ade1ddf637d09e80a7e6e6c4c24421375e449c0f8dc1",
  },
  {
    id: "ui-20260901-01",
    path: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260901-01.html",
    sha256: "5a457f2440bb2f13622b11ab065d3ff2c9ebe5a0a903a3efc6a0dd7ef2190927",
  },
]);
const publicBase = "https://montri-th.github.io/Landometer/";
const faviconPath = "assets/images/landometer-symbol-transparent.png";
const checkOnly = process.argv.includes("--check");

const embeddedAssets = [
  [faviconPath, "image/png", `${faviconPath}?v=35a1496f`],
  ["assets/fonts/arvo-latin-700-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-latin-400-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-latin-600-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-thai-400-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-thai-600-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-looped-latin-700-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-looped-thai-700-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-thai-400-normal.woff2", "font/woff2"],
  ["assets/fonts/jetbrains-mono-latin-400-normal.woff2", "font/woff2"],
  ["assets/fonts/material-symbols-rounded-nav-300.woff2", "font/woff2"],
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
    currentArtifactRecord?.supersedes === preservedUiBuilds[0].id &&
    (currentArtifactRecord?.status === "append_only" ||
      currentArtifactRecord?.status?.startsWith("prepared")),
  "the v0.9.1 immutable UI build record is missing or invalid",
);

for (const preserved of preservedUiBuilds) {
  const record = registry?.artifactBuilds?.find(
    (candidate) => candidate.id === preserved.id && candidate.path === preserved.path,
  );
  assert(
    record?.role === "immutable_ui_build" &&
      record?.colorRegistryId === expectedColorSet &&
      record?.status === "append_only" &&
      record?.sha256 === preserved.sha256,
    `preserved immutable UI build record is missing or invalid: ${preserved.id}`,
  );
  const preservedPath = path.join(deploymentDir, preserved.path);
  const preservedBytes = await readFile(preservedPath);
  assert(
    preservedBytes.byteLength === record.bytes && sha256(preservedBytes) === preserved.sha256,
    `preserved immutable UI build changed: ${preserved.path}`,
  );
}

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

for (const [relativePath, mime, sourceReference = relativePath] of embeddedAssets) {
  const encoded = await dataUrl(relativePath, mime);
  const matcher = new RegExp(escapeRegex(sourceReference), "g");
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
  "<head>\n  <!-- Self-contained noncanonical snapshot generated from deployment/index.html. Display fonts, page images, and browser-tab identity are embedded; linked release records use stable production URLs. -->",
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
  /<link\b[^>]*\brel="icon"[^>]*\bhref="data:image\/png;base64,/i.test(html),
  "standalone browser-tab icon must be embedded for offline use",
);
assert(!/(?:src|href)="assets\//.test(html), "relative display asset remains");
assert(!/url\(["']?assets\//.test(html), "relative CSS asset remains");
assert((html.match(/data:font\/woff2;base64,/g) ?? []).length === 11, "standalone must embed the nine text faces and both Material Symbols subsets");
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
