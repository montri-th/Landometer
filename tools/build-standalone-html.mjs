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
const publicBase = "https://montri-th.github.io/Landometer/";

const embeddedAssets = [
  ["assets/fonts/arvo-latin-700-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-latin-400-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-latin-600-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-thai-400-normal.woff2", "font/woff2"],
  ["assets/fonts/bai-jamjuree-thai-600-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-looped-latin-700-normal.woff2", "font/woff2"],
  ["assets/fonts/ibm-plex-sans-thai-looped-thai-700-normal.woff2", "font/woff2"],
  ["assets/fonts/jetbrains-mono-latin-500-normal.woff2", "font/woff2"],
  ["assets/fonts/jetbrains-mono-latin-700-normal.woff2", "font/woff2"],
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

let html = await readFile(sourcePath, "utf8");

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
  "<head>\n  <!-- Self-contained snapshot generated from deployment/index.html. Display fonts and images are embedded. Linked release records remain canonical production URLs. -->",
);

assert(html.includes('data-standalone="true"'), "standalone marker is missing");
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

await writeFile(outputPath, html, "utf8");
process.stdout.write(
  `Wrote ${outputPath} (${Buffer.byteLength(html).toLocaleString("en-US")} bytes)\n`,
);
