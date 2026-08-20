# Normative patch proposal — Landometer Design System v0.9.0

- **Proposal date:** 2026-08-20
- **Prepared for:** owner approval per DS v0.9.0 §C9 and Master Brand Brief v0.5.3 §0.4
- **Predecessor:** Landometer Design System v0.8.9-r1 · SHA-256 `827f4d85381f980dba43c319cd74762e2745a522232936630fa65ed4b54679d6`
- **Proposed master:** `Landometer Design System v0.9.0.md` · SHA-256 `87e1996a9480f50e9d0e3982aa6b26386b98cfccc06d0de0a30b2962d92d0f48`
- **Status:** owner-approved for authoring integration on 2026-08-20 (`normative-patches/landometer-design-system-v0.9.0.approval.yml`, DS v0.9.0 §C9). v0.9.0-r1 replaces v0.8.9-r1 as the binding authoring master; generated package and artifact validation remain pending.

## 1. What is proposed

A determinism-and-growth release over the complete v0.8.9-r1 authoring authority. Every v0.8.9 rule ID is retained; the only rename is `[SEARCH-01]` → `[INTERNAL-SEARCH-01]` (deprecated alias for one release).

### 1.1 Determinism (owner amendment items 1–10)

| Addition | Rule |
|---|---|
| Deterministic Build Kit — canonical token CSS, base component CSS, page skeleton copied verbatim | `[KIT-01]` Appendix E |
| Binary, text-verifiable self-check (19 rows) whose results ship in the manifest | `[SELFCHECK-01]` §9.6 |
| Two-shape action geometry: capsule or 44px circle, no third shape | `[BTN-GEOM-01]` §6.2A |
| Named motion signature "Riddim" over unchanged v0.8.9 durations; two new easing tokens only | `[MOTION-01]` |
| Default-present governed atmosphere with a scene→recipe table | `[SURFACE-01]`, `[VIS-02]` |
| Honest growth packs: hook loop, friend invitation, cross-product paths, free-tool handoff, web/AI discoverability | `[HOOK-01]` `[XPRODUCT-01]` `[TOOL-HANDOFF-01]` `[WEB-DISCOVERY-01]` |
| Abuse/integrity gate for direct-send, post, invite, co-creation, feedback learning | `[ABUSE-INTEGRITY-01]` |
| Release receipt in delivered HTML; per-page favicon truth; per-destination social previews | `[PUB-01]` |

### 1.2 Visual identity (owner amendment items 11–16)

| Addition | Rule |
|---|---|
| Translucent overlapping named fields for problem complexity | `[LAYER-FIELD-01]` §5.6B |
| Icon set locked to Google Fonts **Material Symbols Rounded**, `FILL 0` / `wght 300`, self-hosted subset | `[ICON-01]` §5.7A |
| Category identity through persistent icon + color pairs | `[CATEGORY-ID-01]` |
| Media ladder video > image > icon > text, details on demand | `[MEDIA-LADDER-01]` §4.4A |
| Three disclosure layers; **zero caution prose in first views**; warnings at the decision moment | `[DISCLOSURE-01]` §4.4B |
| Purple and muddy-brown purge with OKLCh ban windows; ten token values replaced | `[VIS-04]` |
| Decorative edge rails and bracket spines prohibited | `[VIS-03]`, `[RELATION-01]` |
| Typography unchanged from v0.8.9 by explicit owner instruction | `[TYPE-01]` |

### 1.3 Color Set change

The purge replaces ten token positions and therefore mints **`color-srgb-03`**; `color-srgb-02` and `color-srgb-01` remain immutable. Six new raw values (`#A64A00` `#A87B00` `#5C6A61` `#7B877D` `#A7B3A9` `#93A398`) and four reassignments of existing registry values (`#B23F74` `#F06FA6` `#7C8A84` `#8D9D99`). Every gradient recipe, typography value, spacing value, and motion duration is unchanged. Full ledger in §C9 of the proposed master.

## 2. Evidence prepared with this proposal

- Contrast recomputed in sRGB for every replaced pair: source-status inks ≥4.75:1 on all canonical light surfaces, ≥7.24:1 on dark; focus ring ≥4.94:1 light / ≥6.37:1 dark.
- Analytical scales regenerated with the repository's own algorithm (`tools/generate-design-assets.mjs`, TOKEN-01 A6 OKLab two-segment, 24-iteration gamut mapping): four dark records change anchors (risk, balance, delta, tradeoff); all nine dark records mint a new `scaleVersion` because the dark `zero` anchor changed; all nine light records are byte-identical to `color-srgb-02`.
- A complete sample implementation was built to this draft and verified in Chromium: 176 icon slots on the locked axes, zero `svg use` remaining, two-shape audit clean, token-bound focus, zero console errors, all repository CI gates green while the root release stayed untouched.

## 3. What approval unblocks

Approval in §C9 permits the v0.9.0 root release described in `Landometer_v0.9.0_release_readiness_plan.md`: regeneration of the machine package, standalone artifacts, QA evidence and registries under `color-srgb-03`, retargeting of `tools/validate-release.mjs` and both workflows, and replacement of the published root page.

## 4. What approval does NOT grant

Approval records the authoring decision only. It does not certify package-level conformance, does not pre-pass artifact QA, does not approve any media, identity, or font asset, and does not raise any artifact's `evidenceStatus`, `indexable`, or `machineValidation` state.

## 5. Gradient registry carried unchanged into `color-srgb-03`

v0.9.0 changes no gradient. The seven shared atmosphere recipes of `landometer-atmosphere-gradient-v2` keep their exact stops, positions, theme defaults, and foreground contracts:

| Recipe | Foreground contract |
|---|---|
| `atmosphere.gradient.measure.deep` | `surfaceForeground.onDeep` |
| `atmosphere.gradient.measure.luminous` | `surfaceForeground.onLight` |
| `atmosphere.gradient.ground.current` | `surfaceForeground.onDeep` |
| `atmosphere.gradient.ground.mist` | `surfaceForeground.onLight` |
| `atmosphere.gradient.cultivate.glow` | `surfaceForeground.onLight` |
| `atmosphere.gradient.cultivate.mist` | `surfaceForeground.onLight` |
| `atmosphere.gradient.diversity.spectrum` | `surfaceForeground.onLight` |

The fifteen gradient-only stop values stay private to those recipes and remain prohibited as solids: `#89CEF6`, `#5ECAD6`, `#6CD5B3`, `#0F5773`, `#006A6A`, `#1F744F`, `#C4E0EE`, `#B2E2E2`, `#CCE6D0`, `#EB8182`, `#F5A06F`, `#EBC573`, `#F7CBC7`, `#FBD1B6`, `#F1E0B4`.

The Color Set is minted because ten **solid** token positions changed, not because any gradient moved.
