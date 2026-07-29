# Landometer Design System v0.8.8 — Experience Clarifications

**Status:** proposal only  
**Authority:** the integrated v0.8.8 authoring master remains authoritative until these changes receive owner approval, package generation, hashes, fixtures, and release evidence.  
**Scope:** shared Landometer authoring and adoption guidance; no product fact, dataset, score, workflow, or capability is promoted into the shared layer.

## Why this patch is proposed

Implementation review exposed five repeatable gaps:

1. a Brand DNA/Voice lens can appear to change only typography rather than meaning and usefulness;
2. fixed gradient surfaces can inherit theme-global text colors and fail contrast;
3. JetBrains Mono has no Thai glyphs in the six-face package, so an unqualified `monospace` fallback can vary by device;
4. color roles exist normatively but lack a required, complete worked reference;
5. v0.8.8 governs map strokes and connector meaning but does not define a universal chart stroke-width or overlap-compositing recipe.

## Proposed normative changes

### 1. Add `[VALUE-PROOF-01]` after `[BRAND-02]`

> A design-system adoption or training fixture that offers Before/After comparison MUST keep the same work object and evidence in both states. The After state shows at least one observable improvement for each selected lens. A Brand DNA proof demonstrates a clearer object or decision, a visible evidence boundary, and one useful next action. A Brand Voice proof demonstrates changed nouns, verbs, order, tone, and evidence boundary in complete copy—not only prohibited language. The Before state remains readable and accessible; failure is represented by missing or generic meaning, never by degraded typography, contrast, focus, or responsiveness.

### 2. Add component-owned foreground rules to `[SURFACE-01]` and `[A11Y-01]`

> A component rendered on a fixed flat, photographic, gradient, scrim, or opaque-panel surface owns a complete local foreground contract: primary text, secondary text, metadata, separator, icon, focus, and interactive states. It MUST NOT combine a fixed component background with theme-global foreground tokens that were not tested on that background. Nested panels either remain on the same local contrast contract or declare their own complete pair. Theme, locale, Before/After state, and mobile stacking MUST NOT change the pair accidentally.

Required rendered matrix for a three-surface adoption fixture:

| Theme | Measure | Ground | Cultivate |
|---|---:|---:|---:|
| Light | Before + After | Before + After | Before + After |
| Dark | Before + After | Before + After | Before + After |

### 3. Clarify Thai technical-label typography in `[TYPE-01]` and Appendix A11

Current A11 correctly packages JetBrains Mono for `scripts: [latin, numerals]`; it does not deliver Thai glyphs. The generic `monospace` fallback therefore cannot be treated as deterministic Thai typography.

Proposed semantic roles:

```css
:root {
  --font-technical-latin: "JetBrains Mono", var(--font-number-fallback);
  --font-technical-th: "Bai Jamjuree", var(--font-body-fallback);
  --font-technical: "JetBrains Mono", "Bai Jamjuree",
    "SFMono-Regular", Consolas, monospace;
}
```

Proposed wording:

> Use JetBrains Mono for Latin identifiers, numerals, and short Latin technical labels. Use the packaged Bai Jamjuree face for Thai technical labels unless fixed-cell alignment is functionally required. Never rely on a device-selected generic monospace face for Thai. Mixed-script labels use script-aware font fallback with both required faces packaged and verified after `document.fonts.ready`.

#### Genuine Thai monospace

`TlwgMono` is a true fixed-cell Thai font from the Thai Linux Working Group; all glyphs, including combining characters, use the same width. Its terminal-derived forms make it appropriate only for a real fixed-cell requirement, not as the default Thai UI voice.

If Landometer adopts it, approval must:

- add a new semantic role such as `font.code.th` rather than replace Thai body/UI;
- amend the exact six-face delivery contract and font manifest;
- package WOFF2, license, SHA-256, Thai/Latin coverage, and real metrics;
- review readability at 12–16 CSS px, Thai shaping, clipping, zoom, export, and cross-platform parity.

This implementation therefore fixes the current page with self-hosted Bai Jamjuree for Thai technical labels. It does **not** silently add TlwgMono as a seventh normative face.

Primary references used for the candidate assessment:

- Thai Linux Working Group Fonts-TLWG project and TlwgMono release;
- Debian’s TlwgMono package description, which identifies it as purely monospace;
- JetBrains Mono’s official project and the current v0.8.8 manifest, which scope the packaged faces to Latin/numerals.

### 4. Add worked color-reference coverage to `[REFERENCE-01]`

> A Full Living Reference color proof MUST include realistic, product-neutral fixtures for: surface/text hierarchy; semantic states; Brand Blue versus interaction accent; governed atmosphere recipes and contrast strategies; categorical/sequential/diverging data roles; no-data versus zero; canonical opacity with redundant meaning; map hover/selection/focus; and line/connector meaning. Every fixture marks whether it is normative, generated from a normative registry, or a candidate needing approval.

The reference MUST state:

- Brand Blue identifies Landometer and is not an interaction or data color.
- Filled Brand Blue actions are prohibited under the current interaction recipe.
- Product gradients identify their product only.
- Atmosphere gradients never encode data or status.
- Runtime color mixing does not replace the generated LUT and `scaleVersion`.
- Opacity never carries critical meaning alone.

### 5. Add visual-reference density to `[FLOW-04]` / `[REFERENCE-01]`

> A reference section explaining a visual, interaction, or quantitative rule SHOULD pair its primary explanation with a direct-labelled specimen, diagram, UI state, chart, map, or image. Use text for evidence, boundary, and rationale that the visual cannot carry. Detailed prose remains in a labelled disclosure. Icons never replace essential evidence or accessible text.

### 6. Keep stroke and overlap rules as explicit gaps

The following remain candidates, not v0.8.8 rules:

- universal chart axis/grid/data/focus stroke widths;
- solid/dashed/dotted conventions such as observed versus modelled;
- a general overlap compositing or blend algorithm;
- a fixed mapping from `depth.*` roles to `opacity.*` values.

Before promotion, an owner-approved patch must define named roles, exact values, theme behavior, accessibility floors, export parity, and generated package records. Until then:

- use the existing `map.*.stroke/fill` tokens for governed map states;
- name every connector’s endpoints and relationship under `[RELATION-01]`;
- label intersections directly and do not treat the blended hue as a new token;
- mark any illustrative line width as `candidate`.

## Implementation disposition for the current webpage

| Finding | Disposition |
|---|---|
| proof metadata and next-action contrast | artifact fix |
| malformed recipe item 4 indent | artifact fix + semantic ordered-list pattern |
| Brand DNA/Voice Before/After value | artifact fix + reusable skill |
| Thai device-dependent fallback | artifact fix now; normative clarification proposed |
| complete color teaching plates | artifact/reference fix; coverage rule proposed |
| universal stroke widths and overlap blending | remain candidate; no normative claim |

