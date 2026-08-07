#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const toolName = path.basename(fileURLToPath(import.meta.url));
const deploymentDir = path.resolve(toolDir, "../deployment");
const sourcePath = path.join(deploymentDir, "index.html");
const outputPath = path.join(
  deploymentDir,
  "landometer-design-system-v0.8.9-standalone.html",
);
const colorDeliveryPath = path.join(
  deploymentDir,
  "assets/data/color-delivery.v0.8.9.json",
);
const publicBase = "https://montri-th.github.io/Landometer/";
const faviconPath = "assets/images/landometer-symbol-transparent.png";
const faviconSha256 =
  "35a1496f6e8c502cef82f0a46de5dacff98718ff9f5a6c07ccc3783d76e3ae85";
const faviconRevision = faviconSha256.slice(0, 8);
const publicFaviconUrl = new URL(
  `${faviconPath}?v=${faviconRevision}`,
  publicBase,
).href;
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function dataUrl(relativePath, mime) {
  const bytes = await readFile(path.join(deploymentDir, relativePath));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

async function readIfPresent(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function atomicWrite(filePath, contents) {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, contents, "utf8");
  await rename(temporaryPath, filePath);
}

let html = await readFile(sourcePath, "utf8");
const colorDelivery = JSON.parse(await readFile(colorDeliveryPath, "utf8"));
const colorBaselineName = colorDelivery?.meta?.immutableColorBaseline;
const currentArtifactBuild = colorDelivery?.meta?.currentArtifactBuild;
const artifactBuildId = currentArtifactBuild?.id;
const pinnedOutputName = currentArtifactBuild?.immutableStandalone;
assert(
  colorDelivery?.meta?.id === "color-srgb-02",
  "unexpected color-delivery registry id",
);
assert(
  colorBaselineName ===
    "landometer-design-system-v0.8.9-standalone.color-srgb-02.html",
  "color-delivery registry must preserve the original immutable Color Set baseline",
);
assert(
  /^ui-\d{8}-\d{2}$/.test(artifactBuildId ?? ""),
  "color-delivery registry must declare a safe append-only artifact-build id",
);
assert(
  /^landometer-design-system-v0\.8\.9-standalone\.color-srgb-02\.ui-\d{8}-\d{2}\.html$/.test(
    pinnedOutputName ?? "",
  ),
  "color-delivery registry must declare a safe immutable UI build filename",
);
const pinnedOutputPath = path.join(deploymentDir, pinnedOutputName);
const colorBaselinePath = path.join(deploymentDir, colorBaselineName);
const colorBaselineRecord = colorDelivery?.artifactBuilds?.find(
  (record) => record.path === colorBaselineName,
);
const currentArtifactRecord = colorDelivery?.artifactBuilds?.find(
  (record) => record.id === artifactBuildId && record.path === pinnedOutputName,
);
assert(
  colorBaselineRecord?.role === "immutable_color_baseline" &&
    ["prepared", "append_only"].includes(colorBaselineRecord?.status),
  "immutable Color Set baseline record is missing or has an invalid state",
);
assert(
  currentArtifactRecord?.role === "immutable_ui_build" &&
    ["prepared", "append_only"].includes(currentArtifactRecord?.status),
  "current immutable UI build record is missing or has an invalid state",
);

const committedColorBaseline = await readIfPresent(colorBaselinePath);
if (colorBaselineRecord.status === "append_only") {
  assert(committedColorBaseline !== null, `immutable Color Set baseline is missing: ${colorBaselineName}`);
  assert(
    Buffer.byteLength(committedColorBaseline) === colorBaselineRecord.bytes &&
      sha256(committedColorBaseline) === colorBaselineRecord.sha256,
    `immutable Color Set baseline changed: ${colorBaselineName}`,
  );
} else {
  assert(
    committedColorBaseline === null,
    `prepared Color Set baseline path already exists: ${colorBaselineName}. Finalize its registry record before rebuilding.`,
  );
}

html = html.replace(
  /\n\s*<link\s+rel="canonical"\s+href="[^"]+">\s*/i,
  "\n",
);

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

html = html.replace(
  'data-ds="landometer"',
  'data-ds="landometer"\n  data-standalone="true"',
);
html = html.replace(
  "<head>",
  "<head>\n  <!-- Self-contained noncanonical snapshot generated from deployment/index.html. Display fonts and page images are embedded; browser-tab identity and linked release records use stable production URLs. -->",
);

assert(html.includes('data-standalone="true"'), "standalone marker is missing");
assert(
  !/<link\b[^>]*\brel="preload"[^>]*\bas="font"/i.test(html),
  "standalone snapshot must not retain declarative font preloads",
);
assert(
  html.includes('location.protocol === "file:"') &&
    html.includes('root.dataset.standalone !== "true"') &&
    html.includes('location.replace(target.href)') &&
    html.includes('!["http:", "https:"].includes(location.protocol)'),
  "direct-file handoff and hosted-only font-preload guard are missing",
);
assert(
  (html.match(/data:font\/woff2;base64,/g) ?? []).length === 9,
  "standalone snapshot must embed exactly nine governed WOFF2 faces",
);
assert(
  html.includes('root.dataset.fontDelivery = "pending"') &&
    html.includes("Promise.race([loadFonts, fontTimeout])") &&
    html.includes('reject(new Error("font-timeout"))') &&
    html.includes('faceGroups[index].every(face => face.status === "loaded")') &&
    html.includes("thaiDisplayReady") &&
    html.includes("latinCompanionsReady") &&
    html.includes('setFontFailureState(error?.message === "font-timeout" ? "timeout" : "failed")'),
  "font readiness must cover all governed faces and expose pending, success, failure, timeout, and unavailable states",
);
assert(!/<link\s+rel="canonical"\b/i.test(html), "standalone snapshot must not claim a live canonical URL");
assert(
  html.includes(`href="${publicFaviconUrl}"`) &&
    !/<link\b[^>]*\brel="icon"[^>]*\bhref="data:/i.test(html),
  "standalone browser-tab icon must use the stable cache-revisioned production URL",
);
assert(!/(?:src|href)="assets\//.test(html), "relative display asset remains");
assert(!/url\(["']?assets\//.test(html), "relative CSS asset remains");
assert(
  (html.match(/class="atlas-scale-record"/g) ?? []).length === 18,
  "embedded color atlas does not contain 18 scale records",
);
assert(
  [...html.matchAll(/class="atlas-lut-cell"/g)].length === 18 * 41,
  "embedded color atlas does not contain 738 LUT cells",
);
assert(
  [...html.matchAll(/class="atlas-class-cell"/g)].length === 18 * (5 + 7 + 9),
  "embedded color atlas does not contain every 5/7/9 class cell",
);
assert(
  [...html.matchAll(/class="scale-family-card"/g)].length === 9,
  "embedded scale sampler does not contain all nine families",
);
assert(
  [...html.matchAll(/class="scale-family-class-cell"/g)].length === 9 * (5 + 7 + 9),
  "embedded scale sampler does not contain every paired 5/7/9 class cell",
);

const pinnedHtml = html.replace(
  'data-build-channel="latest-alias"',
  'data-build-channel="immutable-artifact-build"',
);
const colorBaselineHtml = html.replace(
  'data-build-channel="latest-alias"',
  'data-build-channel="immutable-color-set"',
);
assert(
  pinnedHtml.includes('data-color-registry="color-srgb-02"') &&
    pinnedHtml.includes(`data-artifact-build="${artifactBuildId}"`) &&
    pinnedHtml.includes('data-build-channel="immutable-artifact-build"'),
  "immutable UI artifact-build markers are missing",
);

const committedLatest = await readIfPresent(outputPath);
const committedPinned = await readIfPresent(pinnedOutputPath);

if (checkOnly) {
  assert(
    committedLatest === html,
    `latest standalone is stale; run ${toolName}`,
  );
  assert(
    committedPinned === pinnedHtml,
    `immutable UI artifact build is missing or stale: ${pinnedOutputName}`,
  );
  assert(
    committedColorBaseline === colorBaselineHtml,
    `immutable Color Set baseline is missing or stale: ${colorBaselineName}`,
  );
  process.stdout.write(
    `Standalone check passed for ${path.basename(outputPath)} and ${pinnedOutputName} (${artifactBuildId})\n`,
  );
} else {
  assert(
    committedPinned === null || committedPinned === pinnedHtml,
    `immutable UI artifact build already exists with different bytes: ${pinnedOutputName}. Preserve it and mint a new artifact-build id plus filename. Mint a new Color Set id only when governed color changes.`,
  );
  await atomicWrite(outputPath, html);
  if (committedColorBaseline === null) await atomicWrite(colorBaselinePath, colorBaselineHtml);
  if (committedPinned === null) await atomicWrite(pinnedOutputPath, pinnedHtml);
  process.stdout.write(
    `Wrote ${outputPath} (${Buffer.byteLength(html).toLocaleString("en-US")} bytes), ${committedColorBaseline === null ? "created" : "preserved"} ${colorBaselinePath}, and ${committedPinned === null ? "created" : "preserved"} ${pinnedOutputPath} (${Buffer.byteLength(pinnedHtml).toLocaleString("en-US")} bytes; ${artifactBuildId})\n`,
  );
}
