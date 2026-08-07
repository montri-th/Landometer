#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolDir, "..");
const registryPath = path.join(
  repositoryRoot,
  "deployment/assets/data/color-delivery.v0.8.9.json",
);
const evidencePath = path.join(
  repositoryRoot,
  "deployment/qa/v0.8.9-gradient-contrast.json",
);
const SAMPLE_INTERVALS = 1000;

function assert(condition, message) {
  if (!condition) throw new Error(`Gradient contrast QA failed: ${message}`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function parseHex(value) {
  assert(/^#[0-9A-F]{6}$/.test(value), `invalid exact sRGB color ${value}`);
  return [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function formatHex(rgb) {
  return `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function relativeLuminance(hex) {
  const channels = parseHex(hex).map((channel) => {
    const encoded = channel / 255;
    return encoded <= 0.04045
      ? encoded / 12.92
      : ((encoded + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(left, right) {
  const a = relativeLuminance(left);
  const b = relativeLuminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function colorAt(stops, position) {
  const parsed = stops.map(([color, percent]) => ({
    color,
    rgb: parseHex(color),
    position: Number.parseFloat(percent) / 100,
  }));
  if (position <= parsed[0].position) return parsed[0].color;
  if (position >= parsed.at(-1).position) return parsed.at(-1).color;
  const rightIndex = parsed.findIndex((stop) => stop.position >= position);
  const left = parsed[rightIndex - 1];
  const right = parsed[rightIndex];
  const distance = right.position - left.position;
  const amount = distance === 0 ? 0 : (position - left.position) / distance;
  return formatHex(left.rgb.map((value, index) => value + (right.rgb[index] - value) * amount));
}

function minimumForInk(record, ink) {
  let minimum = { ratio: Number.POSITIVE_INFINITY, sample: 0, color: null };
  for (let sample = 0; sample <= SAMPLE_INTERVALS; sample += 1) {
    const position = sample / SAMPLE_INTERVALS;
    const color = colorAt(record.stops, position);
    const ratio = contrastRatio(color, ink);
    if (ratio < minimum.ratio) minimum = { ratio, sample, color };
  }
  return {
    ink,
    minimumRatio: Number(minimum.ratio.toFixed(4)),
    minimumAtPercent: Number(((minimum.sample / SAMPLE_INTERVALS) * 100).toFixed(1)),
    sampledBackground: minimum.color,
  };
}

const registryText = await readFile(registryPath, "utf8");
const registry = JSON.parse(registryText);
assert(registry.meta?.id === "color-srgb-02", "unexpected Color Set id");
assert(
  registry.delivery?.gradientRegistrySchema === "landometer-atmosphere-gradient-v2",
  "unexpected gradient registry schema",
);
assert(
  Array.isArray(registry.sharedAtmosphereGradients) &&
    registry.sharedAtmosphereGradients.length === 7,
  "expected seven shared atmosphere gradients",
);

const results = registry.sharedAtmosphereGradients.map((record) => {
  assert(record.angle === "135deg", `${record.id} angle is not canonical`);
  assert(record.foreground?.minimumContrast === 4.5, `${record.id} contrast floor drift`);
  const primary = minimumForInk(record, record.foreground.primary);
  const secondary = minimumForInk(record, record.foreground.secondary);
  const passed = [primary, secondary].every(
    (result) => result.minimumRatio >= record.foreground.minimumContrast,
  );
  return {
    id: record.id,
    family: record.family,
    variant: record.variant,
    foregroundContract: record.foreground.contract,
    requiredMinimum: record.foreground.minimumContrast,
    sampleCount: SAMPLE_INTERVALS + 1,
    interpolation: "sRGB encoded-channel interpolation",
    primary,
    secondary,
    passed,
  };
});

const failures = results.filter((result) => !result.passed);
const evidence = {
  schemaVersion: 1,
  designSystemVersion: "0.8.9",
  authoringRevision: "v0.8.9-r1",
  colorRegistryId: "color-srgb-02",
  gradientRegistrySchema: "landometer-atmosphere-gradient-v2",
  testedAt: "2026-08-07",
  registryPath: "assets/data/color-delivery.v0.8.9.json",
  registrySha256: sha256(registryText),
  method: {
    colorSpace: "sRGB IEC 61966-2-1",
    interpolation: "CSS Color 4 explicit in srgb; encoded-channel piecewise interpolation",
    positions: "0.0% through 100.0% inclusive",
    sampleCountPerGradient: SAMPLE_INTERVALS + 1,
    foregroundsPerGradient: 2,
    contrastFormula: "WCAG 2 relative luminance contrast ratio",
    acceptanceFloor: 4.5,
  },
  status: failures.length === 0 ? "passed" : "failed",
  totals: {
    gradients: results.length,
    contrastComparisons: results.length * (SAMPLE_INTERVALS + 1) * 2,
    failures: failures.length,
  },
  results,
  excludedInventories: [
    {
      registry: "motifGradients",
      reason: "asset-only recipes have no general-purpose bare-text foreground contract",
    },
    {
      registry: "productIdentityGradients",
      reason: "product-owned identity specimens are unchanged and retain product-specific foreground/panel contracts",
    },
    {
      registry: "scales.json",
      reason: "analytical scale QA is separate and remains source_limited",
    },
  ],
  boundary: "Token-level sampling does not replace rendered glyph, alpha-stack, photo-overlay, focus, export, CVD, or device QA. machineValidation remains pending.",
};

const serialized = `${JSON.stringify(evidence, null, 2)}\n`;
if (process.argv.includes("--check")) {
  const committed = await readFile(evidencePath, "utf8");
  assert(committed === serialized, "committed gradient contrast evidence is stale");
} else if (process.argv.includes("--write")) {
  await writeFile(evidencePath, serialized, "utf8");
} else {
  process.stdout.write(serialized);
}

if (failures.length) {
  process.stderr.write(`${failures.length} governed gradient contrast contract(s) failed.\n`);
  process.exitCode = 1;
} else {
  process.stderr.write(`Gradient contrast passed: ${results.length} gradients × ${SAMPLE_INTERVALS + 1} samples × 2 foregrounds.\n`);
}
