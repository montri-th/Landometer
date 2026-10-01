#!/usr/bin/env node
// Landometer Design System 0.9.4 — deterministic renderer for the audience-safe
// atomic colour projection color-srgb-07.production.css. Reads only color-srgb-07.tokens.json.
// Output contains atomic colour values only: no lifecycle, rule, package, path, type, layout or motion metadata.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = dirname(fileURLToPath(import.meta.url));
const source = JSON.parse(readFileSync(join(packageDir, "color-srgb-07.tokens.json"), "utf8"));

function slug(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function declarations(tokenSource) {
  const output = new Map();
  const put = (name, value) => {
    if (typeof value !== "string" || !value.trim() || output.has(name)) throw new Error(`invalid or duplicate color declaration ${name}`);
    output.set(name, value);
  };
  const values = tokenSource.values ?? {};
  for (const family of ["brand", "energy"]) {
    for (const [name, value] of Object.entries(values[family] ?? {})) put(`ldm-${family}-${slug(name)}`, value);
  }
  for (const [name, pair] of Object.entries(values.foundation ?? {})) {
    if (!Array.isArray(pair) || pair.length !== 2) continue;
    put(`ldm-foundation-${slug(name)}-light`, pair[0]);
    put(`ldm-foundation-${slug(name)}-dark`, pair[1]);
  }
  for (const [state, themes] of Object.entries(values.semantic ?? {})) {
    for (const [theme, pair] of Object.entries(themes ?? {})) {
      if (!Array.isArray(pair) || pair.length !== 2) continue;
      put(`ldm-semantic-${slug(state)}-${slug(theme)}-background`, pair[0]);
      put(`ldm-semantic-${slug(state)}-${slug(theme)}-foreground`, pair[1]);
    }
  }
  for (const [name, value] of Object.entries(values.signature ?? {})) put(`ldm-signature-${slug(name)}`, value);
  for (const [product, themes] of Object.entries(values.product ?? {})) {
    for (const [theme, pair] of Object.entries(themes ?? {})) {
      if (!Array.isArray(pair) || pair.length !== 2) continue;
      put(`ldm-product-${slug(product)}-${slug(theme)}-primary`, pair[0]);
      put(`ldm-product-${slug(product)}-${slug(theme)}-accent`, pair[1]);
    }
  }
  // landometer-series-10-v6: default variant fill + shared ink, opt-in variant fill
  for (const series of values.series?.values ?? []) {
    const id = slug(series.id);
    for (const theme of ["light", "dark"]) {
      put(`ldm-${id}-fill-${theme}`, series[theme].fill);
      put(`ldm-${id}-ink-${theme}`, series[theme].ink);
      put(`ldm-${id}-${slug(series.altFill.variant)}-fill-${theme}`, series.altFill[theme]);
    }
  }
  // deprecated landometer-series-10-v5: the old names keep their 0.9.1 values intact so existing artifacts do not
  // change colour silently; new work binds the v6 fill/ink names and preflight warns on v5 names
  for (const series of values.seriesDeprecated?.values ?? []) {
    const id = slug(series.id);
    put(`ldm-${id}-light`, series.light);
    put(`ldm-${id}-dark`, series.dark);
  }
  for (const [scale, record] of Object.entries(values.scales ?? {})) {
    for (const theme of ["light", "dark"]) {
      for (const [index, color] of (record?.[theme] ?? []).entries()) put(`ldm-scale-${slug(scale)}-${theme}-anchor-${index + 1}`, color);
    }
  }
  // deprecated alias scale.density -> built
  for (const [alias, record] of Object.entries(values.scalesDeprecated ?? {})) {
    const target = values.scales?.[record.aliasTarget];
    if (!target) throw new Error(`alias target missing for ${alias}`);
    for (const theme of ["light", "dark"]) {
      for (const [index, color] of target[theme].entries()) put(`ldm-scale-${slug(alias)}-${theme}-anchor-${index + 1}`, color);
    }
  }
  for (const [state, record] of Object.entries(values.dataState ?? {})) {
    for (const theme of ["light", "dark"]) put(`ldm-data-state-${slug(state)}-${theme}`, record?.[theme]);
  }
  for (const [name, pair] of Object.entries(values.map ?? {})) {
    if (!Array.isArray(pair) || pair.length !== 2) continue;
    put(`ldm-map-${slug(name)}-light`, pair[0]);
    put(`ldm-map-${slug(name)}-dark`, pair[1]);
  }
  return output;
}

const lines = [
  "/* Landometer governed audience-safe atomic color projection. */",
  ":root {",
  ...[...declarations(source)].sort(([left], [right]) => left.localeCompare(right)).map(([name, value]) => `  --${name}: ${value};`),
  "}",
  ""
];

process.stdout.write(lines.join("\n"));
