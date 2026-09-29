# For developers · LDS 0.9.4 (v0.9.4-mp1)

เป้าหมาย: ทำให้หน้าที่ถูกกติกาเป็นหน้าที่ "คัดลอกแล้วเติม" ไม่ใช่หน้าที่ต้องตีความ ทุกอย่างในหน้านี้อยู่ใน `build-kit/`

## 1. Install (copy, do not edit)

```
build-kit/
  skeleton.html                 ← head block + MotifFrame (opening + closing) + EvidenceCard + DataTable + MapLegend reference markup, regions declared
  lds-0.9.4-ext.css             ← --scale-* (light + DATAVIZ-03 dark, asserted at build), --series-N-fill/ink, --state-*; [data-theme] + prefers-color-scheme; generated from tokens
  lds-0.9.4-components.css      ← EvidenceCard, DataTable cellStates (hatch on the glyph box only), MapLegend states
  motif/                        ← landometer-motifs.js + .css (EXACT bytes, never edit), svg/ twelve final-state SVGs, motif-library.json (manifest copy),
                                   motion-controller.js (page-level pause), motif-frame.js (kind/job/beat/carrier validation, theme swap, ground check, replay, budget), motif-frame.css (carrier paint)
  og-1200x630.template.html     ← link-preview creative with recognisers and guides (?guides=1)
  site.webmanifest.template.json · llms.txt.template
  icons/                        ← approved portfolio icon set (16/32/48/180/192/512) + icon-set.json (hashes, head template)
  preflight-0.9.4.yml · preflight-0.9.4.mjs
```
Pair with `machine/color-srgb-07.production.css` (the governed colour bytes), `machine/motif-register.v0.9.4.json` (preflight reads it) and the packaged WOFF2 fonts from `machine/`.

## 2. Head block (FAVICON-01 · SOCIALFMT-01 · THEME-01)

Copy the head of `skeleton.html`: title `[page] · [product]` (≤ 60), six icon links (16/32/48 favicon, 180 apple-touch, 192/512 via manifest), `theme-color` for light and dark, OG block with `og:image` 1200 × 630 + `og:image:alt`, `twitter:card summary_large_image`. The icon never changes per page, never signals status and is never a motif. Theme: leave `<html>` un-stamped for auto (prefers-color-scheme); a reversible explicit choice sets `data-theme="light|dark"`.

## 3. Colour (COLOR-01 · DATAVIZ-02 · DATAVIZ-03 · DATAVIZ-04 · DATAVIZ-05)

- Use custom properties, never hex: `var(--scale-count-mid)`, `var(--series-3-fill)`, `var(--series-3-ink)`.
- Sequential: pick the family by the unit's denominator; mark the surface `data-surface="…" data-scale-family="count,activity"` — preflight fails if two families of one zone share a surface.
- Dark: never declare a dark scale value yourself. The ext CSS carries every dark anchor as the DATAVIZ-03 derivation (warm lane — activity, density.area, heat, risk, price — by its own formula; age dark mid is the one declared exception); a page override that differs from the derivation fails `PF-DATAVIZ-03-DARK`, and an ext CSS whose bytes differ from the kit fails too.
- Hue windows: every `--scale-*` and `--series-*` value on the page, in both themes, must sit outside the retired earth and violet windows and away from the purged earth/taupe values (`PF-DATAVIZ-04-HUE`); the kit CSS is asserted clean at build. Do not mint a new custom property to escape the check.
- Categorical (v7): `--series-N-fill` is soft by default; add `data-series="vivid"` on the chart container to switch (only on a surface without energy accents — slot 6 sky counts as one). Separate adjacent areas with a 1px `--border-default` edge (`.lds-series-area`), give legend swatches a hairline border (`.lds-legend-swatch`), use `--series-N-ink` for labels, lines and marks under 3px (`--series-2-ink` and `--series-3-ink` resolve `--text-primary` in the light theme by design). Slots 7–10 need a shape cue; slot 10 is green (`tourism` binds to it).
- Migration from 0.9.1: names `--ldm-series-NN-light/dark` (v5) still resolve their old values but are deprecated (preflight warns). `--ldm-scale-density-*` now aliases `built`. 34 scale-anchor values changed under existing names (light mids of activity, risk, growth; water low/mid/high; tradeoff light neg; every dark anchor of activity, risk, growth, confidence, water, density/built, balance, delta, tradeoff) — re-check dark-theme charts with the showcase. Migration from the 0.9.3-r2 preview: 27 production-CSS declarations change value under unchanged names (master §15.5; `color-srgb-07.tokens.json#/values/anchorDeltaFromColorSrgb06`); no name is added or removed.

## 4. Value states (EVID-05)

Every `<td>` that renders 0, blank, a dash or a suppressed/pending value carries `data-state="measured_zero|no_data|out_of_scope|suppressed|not_yet"` with a `.lds-cell-glyph` and a `.lds-state-label` (text.metadata #5C6A61 light / #A6B5B1 dark). For `no_data` the hatch fills the glyph box only; the label sits beside it on plain ground (`PF-EVID-05-LABEL` fails a hatch on the cell). `no_data` rows sort last. Never render "N/A". In JSON payloads every `{ value: 0 | null }` carries `state`. MapLegend shows one row per state present.

## 5. EvidenceCard (`component.evidence-card.01`)

`<figure class="lds-evidence-card" data-state="…">` with TrustBadge, value + unit + state, `dl` (dataset, source, date, boundary, limitation), measure line, permanent URL, receipt id, and the one-line `.lds-evidence-card__fallback`. No logo, panel, gradient, motion or motif (the card is the primary proof). Every field comes from the bound claim record.

## 6. MotifFrame + MotionController (MOTION-04 · MOTIF-01…06)

```html
<button class="lds-motion-pause" type="button" aria-pressed="false" data-label-pause="Pause motion" data-label-resume="Resume motion">Pause motion</button>
<h1 data-region="first_answer">…</h1> … <div data-region="primary_proof">…</div> … <a data-region="primary_action">…</a>
<!-- full on a ground that does not change with the theme: the frame paints brand.beige itself -->
<div class="lds-motif-frame" data-kind="logo" data-job="animated_brand_opening" data-beat="opening" data-variant="full" data-host-surface="brand.beige" data-cycle-ms="6000">
  <lm-motif kind="logo" ink="blue" autoplay="false"></lm-motif>
  <noscript><img src="/lds/motif/svg/logo-full.svg" alt="" width="600" height="300"></noscript>
</div>
<!-- on the page canvas (changes with the theme): full in light, quiet in dark; without JavaScript the wrappers follow data-theme, then the OS (never <picture>) -->
<div class="lds-motif-frame" data-kind="cultivate" data-job="handoff" data-beat="closing" data-variant="full" data-variant-dark="quiet" data-host-surface="surface.canvas" data-cycle-ms="3000">
  <lm-motif kind="cultivate" ink="blue" autoplay="false"></lm-motif>
  <noscript><span class="lds-motif-noscript" data-theme-variant="light"><img src="/lds/motif/svg/cultivate-full.svg" alt="" width="600" height="300"></span><span class="lds-motif-noscript" data-theme-variant="dark"><img src="/lds/motif/svg/cultivate-quiet.svg" alt="" width="600" height="300"></span></noscript>
</div>
<!-- a static final state (no motion) still declares its ground -->
<div data-motif-static="rings-quiet" data-host-surface="brand.blue"><img src="/lds/motif/svg/rings-quiet.svg" alt="" width="600" height="300"></div>
<script src="/lds/motif/landometer-motifs.js" defer></script>
<script src="/lds/motif/motion-controller.js" defer></script>
<script src="/lds/motif/motif-frame.js" defer></script>
```

| kind | beat | allowed jobs | default cycle | final-state SVG full / quiet |
|---|---|---|---|---|
| dial | opening | orientation, opening | 3000 ms | 7ecfd116… / 2e624d80… |
| rings | transition | spatial_transition, section_orientation | 3000 ms | b50ec8fa… / d494be1f… |
| layers | transition | layering, quiet_divider | 3000 ms | a94a59a3… / e3e2bf65… |
| slice | closing | action_closure | 3000 ms | 8d0dfb62… / c72114d4… |
| cultivate | closing | cultural_closure, handoff | 3000 ms | ce494d79… / edf85381… |
| logo | opening | animated_brand_opening | 6000 ms | 90e9543f… / 5b6798cd… |

The frame validates kind, job (a job outside the kind throws and the frame stays at its final state), beat and variant; owns replay (observer threshold 0.14, rootMargin `0px 0px -8% 0px`, cycle ≥ 2,000 ms, stop off-screen, final state under pause / reduced motion / hidden tab / no-JS / print); refuses a fourth moment, a second moment on one `[data-task-surface]`, a frame inside `[data-region="first_answer|primary_proof|primary_action"]`, and a frame inside `[data-product-overlay]`. Declare the three regions on every page with motion (preflight requires them). Do not use the runtime's `loop` or `replay` attributes and never touch the runtime bytes — preflight compares their SHA-256 and the twelve SVGs. If the runtime never loads, the frame shows the final-state SVG after 2 s. Verified in Chromium: `reports/motif-frame-fixture-report.json` in the candidate build.

Carriers (MOTIF-06): `data-host-surface` is required on every frame and static motif. The frame resolves it per theme the page renders (`<meta name="color-scheme">`, both when absent), refuses a pair outside `carrierPolicy.allowed` (`MOTIF-06-CARRIER`), a full frame without `ink="blue"` or a quiet frame with another ink (`MOTIF-06-INK`), a `data-variant-dark` other than `quiet` on a full frame (`MOTIF-06-SWAP`), and a painted ground that differs from the declaration (`MOTIF-06-GROUND`, checked at mount and after every theme change); a refused placement is not rendered. Invariant (`brand.beige`, `brand.blue`, `atmosphere.*`) and theme-fixed (`surface.card@light`) carriers are painted by `motif-frame.css`; themed carriers (`surface.canvas`) must be painted by the page with the matching `--surface-*` variable.

| variant | allowed carriers (every kind unless listed) | exceptions | never |
|---|---|---|---|
| `full` (Brand Blue ink · `ink="blue"`) | `brand.beige`, `surface.alt@light`, `surface.beigeTint@light`, `surface.blueTint@light`, `surface.canvas@light`, `surface.card@light`, `surface.raised@light`, `surface.soft@light` | layers: `surface.canvas@light`, `surface.card@light`, `surface.raised@light` | Brand Blue · dark surfaces · every atmosphere · photographs |
| `quiet` (one sky ink) | `atmosphere.ground.current`, `atmosphere.measure.deep`, `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | layers: `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | every light surface · `atmosphere.ground.mist` · `atmosphere.measure.luminous` · photographs |

Product stings (ijji, CityChat) use their own registered runtime under `[data-product-overlay="<id>"]`; never wrap them in a MotifFrame and never place a shared motif inside them.

## 7. Check before every commit

```sh
node build-kit/preflight-0.9.4.mjs dist/index.html --json dist/data.json --report preflight.json
```
Fails on: energy/brand mid or chroma > .125, two families per zone per surface, a dark anchor that is not the derivation, a scale or series value inside a retired hue window, stale or failed GATE-01 evidence, missing icon set or title pattern, OG off-template or a motif as OG/icon, `animation-iteration-count: infinite`, a motif outside a frame / without job / with the wrong beat / with drifted bytes / with loop or replay, more than three moments, a moment in a forbidden region or a second on one task surface, an unregistered or byte-less overlay, a mixed lockup, a motif on a carrier the register does not allow (or undeclared, or with the wrong ink), 0/blank/dash without state, a no-data label on the hatch, hex outside the governed projection. Warns on: vivid beside an energy accent, v5 names. Exit code 1 blocks the build. Add it to CI; keep the report with the artifact receipts. The check's own detection is proven by `tools/test-preflight-mutations.mjs` (74 mutations, `reports/preflight-mutation-report.json`).

## 8. Never

Hand-type a hex or a dark anchor · use a brown, terracotta or purple in a scale or series, or add a custom property to escape the hue gate · edit `landometer-motifs.js/.css` or an SVG · give a motif a job outside its kind · place full on Brand Blue or a dark ground, or quiet on a light ground · recolour a motif or put a plate under it · use a motif as favicon, OG image or navigation identity · render missing data as 0 · ship without the icon set · claim production verification from a local preview.
