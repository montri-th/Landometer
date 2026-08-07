# Analytical-scale teaching

## Teach the question before the palette

Use one product-neutral fixture and ask:

- **Which category?** Use categorical assignment with stable labels and a redundant shape or pattern.
- **How much?** Use a sequential family with an explicit low-to-high direction.
- **Which direction around what midpoint?** Use a diverging family with a named neutral value.

Do not use an atmosphere or product-identity gradient as a quantitative scale. Do not imply that negative/positive automatically means bad/good.

When the section claims broad analytical guidance, show three constructive questions—magnitude, meaningful direction around a midpoint, and category or map assignment—plus one rejected use with a visible repair. Name the fixture's source and product boundary for every case.

## Show complete family coverage

For the current carried reference fixture, show all nine families:

- sequential: `growth`, `water`, `risk`, `activity`, `density`, `confidence`;
- diverging: `balance`, `delta`, `tradeoff`.

Label these as `source_limited` records carried from `deployment/assets/data/scales.json` `meta.version: 0.8.6`. They are teaching and review fixtures, not a scale-gate-cleared v0.8.8 `dataviz.tokens.json` package.

For every family:

1. show its kind and intended analytical question;
2. show exact 5-, 7-, and 9-class subsets;
3. support both light and dark records;
4. keep the exact light/dark `scaleVersion`;
5. identify direction and, for diverging scales, the neutral midpoint;
6. keep no-data, measured zero, classification method, thresholds, and outlier policy outside the hue alone.

Keep one concise, directly labelled preview on the primary route. Put 41-stop LUTs, exact cells, hashes, source boundary, and parity evidence in the existing disclosure.

At narrow widths and text zoom, let each class row wrap as a unit: keep the localized class label intact and move the full color strip to the next line before either can overlap or shrink the strip below a useful minimum. Do not solve a collision by clipping, painting text over color, hiding cells, or changing the governed palette.

Apply the same label-and-mark rule to legends, mini charts, diagrams, and map keys elsewhere in the Implementation Library.

The accessible name follows the active locale and the actually rendered theme. A light-theme sampler must not announce the hidden dark values, and vice versa. A full Atlas record may announce its fixed record theme, class count, family, kind, and exact values.

## Preserve generated parity

Generate the sampler and complete atlas from the same source values. Never hand-copy cells, interpolate in the browser, use a continuous CSS gradient, or run a chart-library palette afterward.

Require:

- one light and one dark record per family;
- 41 solid LUT cells per record;
- exact 5/7/9 subsets from that LUT;
- renderer, legend, accessible alternative, and export parity;
- labels or redundant cues that survive grayscale and color-vision-deficiency review.

Reject stale or mismatched family, kind, version, class count, classification method, domain, threshold, no-data, zero, neutral, or outlier fields.

Generate and check before release:

```sh
# Read-only audit
node tools/generate-color-atlas.mjs --check-index

# Authorized atlas change
node tools/generate-color-atlas.mjs --inject
node tools/generate-color-atlas.mjs --check-index
node skill/refine-landometer-experience/scripts/check-experience-contracts.mjs deployment/index.html
```

Treat `--check-index` as required evidence for full-atlas exactness. Static HTML presence or a successful experience-contract check does not replace it.

For collision regression, use browser geometry rather than source-text matching: measure the rendered text range, strip bounds, horizontal overflow, and equal-width 5/7/9 cells across EN/TH, light/dark, required viewports, and representative 200% text zoom.
