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

For a teaching artifact, lens-specific opening presets are allowed when they are documented as presets rather than universal brand rules. A useful reference pairing is Measure for Brand DNA and muted Ground for Brand Voice, while Brand Visual keeps the explicit atmosphere chooser. Keep the underlying lens and atmosphere concepts separate in product architecture.

## Build and color-set parity

When devices show a different palette or gradient set, establish build parity before diagnosing color science. Do not begin with display profiles, gamut, contrast tuning, or operating-system rendering.

Compare, in order:

1. the exact immutable build ID, commit, or release fingerprint;
2. the pinned HTML or standalone filename and artifact URL;
3. the color-registry version and exact registry/token/scale hash;
4. hosted-versus-standalone parity, then browser, CDN, Pages, and service-worker cache state.

For QA, review, screenshots, and handoff, use a pinned immutable filename or URL and record its build ID plus color-registry hash. A mutable root, `current`, or `latest` alias is a convenience route only: it can be cache-stale and is not evidence that two devices rendered the same artifact. Reloading or clearing cache is a diagnostic step, not proof of parity.

Only after build, registry, and hash parity passes should the investigation move to theme resolution, display profile, gamut, alpha/scrim composition, browser/OS rendering, color-vision-deficiency behavior, or other color-science causes. Never “fix” a version mismatch by changing canonical colors or removing records from the Complete Color Atlas.

## Complete color atlas

Preserve the complete color atlas as a first-class full disclosure. Never delete it, replace it with a few representative swatches, or compress away exact roles and values to simplify the primary route. Keep a concise visual router and scale sampler above it, with real deep links into the relevant full-atlas families.

When complete color coverage is requested, use one bounded fixture and render all governed records:

1. identity and asset-only logo roles;
2. 17 light/dark foundation pairs and 7 semantic states;
3. 2 shared gradients and 3 Measure/Ground/Cultivate motif gradients;
4. 4 product-gradient families as 8 light/dark specimens, with the product boundary visible;
5. 10 light/dark categorical pairs with a redundant shape or pattern cue;
6. all sequential and diverging families in light/dark, including 18 analytical scale records with 41 exact LUT cells each (738 total) and exact 5/7/9 classes (378 cells total);
7. 8 light/dark map pairs, including no-data and measured-zero treatment;
8. 8 opacity values and 6 named depth roles;
9. Brand Blue versus interaction accent, line/stroke meaning, and every unresolved token gap.

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
- Self-hosted IBM Plex Sans Thai 400 for Thai technical labels that do not require fixed cells.
- Bai Jamjuree 400/600 for continuous-reading Thai body and general UI; do not replace it globally when only the technical role changes.
- Self-hosted TlwgMono only when genuine Thai fixed-cell behavior is functionally required and its terminal-style forms pass readability review.

Never let a generic `monospace` fallback choose the Thai face by device. Package the selected face, license record, hashes, and Thai subset; verify computed family after `document.fonts.ready` with third-party requests blocked.

Treat IBM Plex Sans Thai as an optical companion, not a true monospace face. Use weight 400 with `size-adjust: 102%`, `.008em` tracking, `1.48` compact-label line-height, and enough vertical padding to protect Thai marks. Then review mixed-script baselines, combining marks, 12–16 CSS px labels, 130% Thai, 200% zoom, export, and all supported devices. Record any tuning as an implementation value until a normative release approves it.

Use one technical weight across the script-aware pair. For this reference that weight is 400: declare and embed only JetBrains Mono 400 and non-Looped IBM Plex Sans Thai 400 in the technical role. Do not request or package 500/700 for those two technical faces, and keep `font-synthesis: none` so emphasis comes from hierarchy, color, spacing, or wording rather than faux bold. The separately governed IBM Plex Sans Thai Looped 700 and Arvo 700 display roles remain valid.
