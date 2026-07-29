# Color, surface, contrast, and type

## Surface ownership

Give every component-owned surface its own foreground, secondary text, separator, focus, and metadata colors. Do not place a fixed gradient or panel behind text that still inherits theme-global ink.

Test at least:

- light + Measure;
- light + Ground/Cultivate;
- dark + Measure;
- dark + Ground/Cultivate;
- each pair in Before and After states;
- mobile stacked metadata.

Use deterministic scrims or opaque panels when sampled gradient contrast fails. Preserve canonical gradient stops.

## Complete color atlas

When complete color coverage is requested, use one bounded fixture and render all governed records:

1. 17 light/dark foundation pairs and 7 semantic states;
2. 2 shared gradients and 3 Measure/Ground/Cultivate motif gradients;
3. 4 product-gradient families as 8 light/dark specimens;
4. 10 light/dark categorical pairs with a redundant shape or pattern cue;
5. 18 analytical scale records with 41 exact LUT cells each (738 total) and exact 5/7/9 classes (378 cells total);
6. 8 light/dark map pairs, including no-data and measured-zero treatment;
7. 8 opacity values and 6 named depth roles;
8. Brand Blue versus interaction accent, line/stroke meaning, and every unresolved token gap.

Mark candidates explicitly. The current v0.8.8 source does not define a universal chart stroke-width scale, dash convention, or overlap compositing recipe.

Keep product gradients inside product-identity specimens. Never reuse them as shared atmosphere, data, map, interaction, or semantic-state colors.

Never mix canonical dataviz ramps at runtime. Render LUT and 5/7/9 class cells from the pre-generated source values.

Treat `deployment/assets/data/scales.json` as a carried `source_limited` reference because its `meta.version` is `0.8.6`. Do not call it the gated v0.8.8 `dataviz.tokens.json`, and do not claim v0.8.8 scale conformance until hash parity, renderer/legend/export parity, contrast, color-vision-deficiency, grayscale, and product implementation gates pass.

Verify the atlas in light and dark themes at 320 and 390 CSS pixels. Confirm that color-vision-deficiency simulation and grayscale preserve meaning through labels, shapes, patterns, measured-zero treatment, and no-data treatment.

Generate and check the deterministic atlas before release:

```sh
node tools/generate-color-atlas.mjs --inject
node tools/generate-color-atlas.mjs --check-index
```

## Thai technical labels

JetBrains Mono covers Latin and numerals in the v0.8.8 package; it is not a Thai face.

Use script-aware routing:

- JetBrains Mono for ASCII identifiers, numbers, and short Latin technical labels.
- Self-hosted IBM Plex Sans Thai 500 for Thai technical labels that do not require fixed cells.
- Bai Jamjuree 400/600 for continuous-reading Thai body and general UI; do not replace it globally when only the technical role changes.
- Self-hosted TlwgMono only when genuine Thai fixed-cell behavior is functionally required and its terminal-style forms pass readability review.

Never let a generic `monospace` fallback choose the Thai face by device. Package the selected face, license record, hashes, and Thai subset; verify computed family after `document.fonts.ready` with third-party requests blocked.

Treat IBM Plex Sans Thai as an optical companion, not a true monospace face. Start conservatively with weight 500, `size-adjust: 102%`, `.008em` tracking, `1.48` compact-label line-height, and enough vertical pill padding to protect Thai marks. Then review mixed-script baselines, combining marks, 12–16 CSS px labels, 130% Thai, 200% zoom, export, and all supported devices. Record any tuning as an implementation value until a normative release approves it.
