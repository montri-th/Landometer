#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const deploymentDir = path.resolve(toolDir, "../deployment");
const sourcePath = path.join(deploymentDir, "index.html");
const outputPath = path.join(
  deploymentDir,
  "landometer-design-system-v0.8.8-standalone.html",
);
const colorDeliveryPath = path.join(
  deploymentDir,
  "assets/data/color-delivery.v0.8.8.json",
);
const publicBase = "https://montri-th.github.io/Landometer/";

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
  ["assets/images/landometer-symbol-transparent.png", "image/png"],
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

async function writePinnedColorSet(outputFile, contents) {
  try {
    const existing = await readFile(outputFile, "utf8");
    assert(
      existing === contents,
      `pinned Color Set already exists with different bytes: ${path.basename(outputFile)}. Preserve it and mint a new color-set id plus filename instead of overwriting it.`,
    );
    return "preserved";
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    await writeFile(outputFile, contents, "utf8");
    return "created";
  }
}

let html = await readFile(sourcePath, "utf8");
const colorDelivery = JSON.parse(await readFile(colorDeliveryPath, "utf8"));
const pinnedOutputName = colorDelivery?.meta?.immutableStandalone;
assert(
  colorDelivery?.meta?.id === "color-srgb-01",
  "unexpected color-delivery registry id",
);
assert(
  /^landometer-design-system-v0\.8\.8-standalone\.[a-z0-9-]+\.html$/.test(
    pinnedOutputName ?? "",
  ),
  "color-delivery registry must declare a safe immutable standalone filename",
);
const pinnedOutputPath = path.join(deploymentDir, pinnedOutputName);

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
  "<head>\n  <!-- Self-contained noncanonical snapshot generated from deployment/index.html. Display fonts and images are embedded; linked release records still point to canonical production files. -->",
);

assert(html.includes('data-standalone="true"'), "standalone marker is missing");
assert(!/<link\s+rel="canonical"\b/i.test(html), "standalone snapshot must not claim a live canonical URL");
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
  'data-build-channel="immutable-color-set"',
);
assert(
  pinnedHtml.includes('data-color-registry="color-srgb-01"') &&
    pinnedHtml.includes('data-build-channel="immutable-color-set"'),
  "immutable standalone color-set markers are missing",
);

await writeFile(outputPath, html, "utf8");
const pinnedDisposition = await writePinnedColorSet(pinnedOutputPath, pinnedHtml);
process.stdout.write(
  `Wrote ${outputPath} (${Buffer.byteLength(html).toLocaleString("en-US")} bytes) and ${pinnedDisposition} ${pinnedOutputPath} (${Buffer.byteLength(pinnedHtml).toLocaleString("en-US")} bytes)\n`,
);
