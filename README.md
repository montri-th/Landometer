# Landometer Design System v0.9.1 Implementation Playground

The GitHub Pages root is `deployment/` and publishes a bilingual, product-neutral Design System reference at:

**https://montri-th.github.io/Landometer/**

The v0.9.1 page keeps the strongest parts of the existing playground—hero invitation, before/assisted proof, evidence-preserving handoff, takeaway, Implementation Library, and the complete Color Atlas—then presents the new implementation guidance as a deliberate visual story for navigation, action, motion, evidence, compatibility, and cross-format production.

## What is new in v0.9.1

Artifact build `ui-20260902-02` makes “retained principle → improved implementation → visible result” explicit through six alternating copy-and-visual chapters:

1. **One shared method, distinct product truths** — a shared Locale Insight frame with separate Land, Location, and Living packs;
2. **One claim, consistent meaning for people and machines** — one claim preserved across initial HTML, visible page, and hydrated state;
3. **Calm by hierarchy, not by hiding controls** — prominent and calm navigation states with the same direct targets;
4. **Change the format, preserve the promise** — Web, PDF, deck, and social representations that preserve semantic invariants;
5. **Incompatibility is a valid result** — parcel and neighbourhood fixtures that keep schema/release/unit/grain incompatibility visible; and
6. **Rejected: motion gates the proof** — a bounded static rejection storyboard with a visible source-to-final recovery.

Every new case is labelled as a conceptual example, not product evidence. Product data, capabilities, permissions, workflows, scores, models, audiences, and claims remain product-specific.

The shared Landometer layer covers portfolio framing, methodology, and product architecture across **Land · Location · Living**. Cross-product or cross-city comparison requires compatible schema, release, unit, and grain; otherwise incompatibility stays visible.

### UI artifact revision `ui-20260902-02`

This is an implementation-artifact revision, not a normative Design System change. The header can become visually calm while reading downward and returns to prominent at the page start, on upward intent, pointer intent, focus, or an open menu. Only surface and emphasis change: semantic link and button targets remain direct and at least 44 × 44 CSS pixels. No wake-first click or coordinate-forwarding overlay is used. Reduced motion keeps the stable prominent state.

The role-gated entrance recipe is explicit: `approach.soft`, `approach.inline-start`, `approach.inline-end`, `media.arrival`, and `stagger.child`; opacity `760ms`; transform `920ms`; media `900ms`; block distance `32px`; logical inline distance `36px`; scale from `.985`; stagger `150ms` capped at `450ms`; enter easing `cubic-bezier(.16,1,.3,1)`; settle easing `cubic-bezier(.2,.9,.25,1.08)`; observer threshold `.14`; root margin `0px 0px -12% 0px`; and a `2400ms` safety audit. Hero/LCP media, H1, first answer, primary proof, primary action, task-critical state, status, focus targets, and deep-link targets are excluded from hidden entrances. Closed disclosures and hidden panels are not enrolled.

The cross-format CTA uses a pointer-inert highlight band that sweeps once from `-120%` to `120%` in `540ms` with `cubic-bezier(.16,1,.3,1)`. It does not loop, move layout, or reduce content opacity; reduced motion and missing observer support receive the final no-cue state.

This final UI build also preserves keyboard focus when the language changes inside an open menu, uses one sticky-header offset for deep links, and embeds the approved favicon in standalone files for offline use. The reviewed `ui-20260902-01` candidate remains immutable release evidence.

## What remains

- the protected rally cry: **Let us cultivate our city with data.**
- one-job / first-AHA / primary-action / clean-completion discipline
- truth, evidence, accessibility, privacy, permission, and product boundaries
- shared component, data-visualization, map, and experience references
- Thai/English and Light/Dark/System support
- historical versioned evidence without relabelling
- the complete Color Atlas and Color Set `color-srgb-05`

DS v0.9.1 changes navigation, CTA, icon, typography, motion, discoverability, and cross-format behavior, but does not change normative color values. The earlier immutable `color-srgb-05` baseline remains byte-frozen; the new UI build receives a new artifact-build identity instead of a new Color Set.

## Color Atlas

The Color Atlas stays a first-class route. It preserves the role-based color router, all six sequential and three diverging families at exact 5/7/9 classes, Light/Dark records, 41-stop LUTs, map pairs, opacity, and depth.

The complete inventory includes 17 foundation pairs, 7 semantic states, 7 shared atmosphere gradients, 3 asset-only motif records, 4 product-gradient families/8 theme specimens, 10 categorical pairs, 18 analytical scale records/738 LUT cells/378 class cells, 8 map pairs, 8 opacity values, and 6 depth roles.

Analytical scale records remain bound to their recorded source/version. They are reference material, not a named product's evidence.

## Release boundary

- Design System `0.9.1`
- owner-approved authoring revision `0.9.1-r8`
- ruleset `lds-rules-0.9.1`
- machine-package identity `v0.9.1-mp7` — identity only; its package bytes are not published or claimed as validated by this repository
- Site Manifest `2.1`
- carried Token Schema projection `6`
- Color Set `color-srgb-05` — retained; no normative color value change from v0.9.0-r7
- artifact build `ui-20260902-02` — UI artifact revision; Design System authority and Color Set are unchanged
- latest standalone `deployment/landometer-design-system-v0.9.1-standalone.html`
- immutable UI handoff `deployment/landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-02.html`
- profile `brand.public`
- public, `noindex`, `source_limited`; artifact conformance is not claimed
- `fullLivingReference: false`

Download the exact owner-approved human-readable master at [`deployment/assets/downloads/landometer-design-system-v0.9.1.md`](deployment/assets/downloads/landometer-design-system-v0.9.1.md). Its SHA-256 is `64f5d6277b557176502285bc65890ecc4c81faf4b97946eb5e3a2ef2c0d90d19`.

Artifact choices remain separate from normative authority:

- [`deployment/build-card.v0.9.1.yml`](deployment/build-card.v0.9.1.yml)
- [`deployment/implementation-notes.v0.9.1.md`](deployment/implementation-notes.v0.9.1.md)
- [`deployment/assets/data/color-delivery.v0.9.1.json`](deployment/assets/data/color-delivery.v0.9.1.json)
- [`deployment/site-manifest.v0.9.1.json`](deployment/site-manifest.v0.9.1.json)
- [`deployment/qa/v0.9.1-manual-gates.md`](deployment/qa/v0.9.1-manual-gates.md)

Historical v0.9.0, v0.8.9, v0.8.8, v0.8.7, and v0.8.6 files remain frozen migration and compatibility evidence. They are not the current page authority and must not be silently relabelled as v0.9.1.

## Validate

```bash
node tools/validate-release.mjs
```

## Run locally

```bash
python3 -m http.server 8000 --directory deployment
```

## Publishing

The reusable publishing workflow is documented at [`skill/publish-landometer-design-system-github-pages/SKILL.md`](skill/publish-landometer-design-system-github-pages/SKILL.md). It requires a clean release branch, exact allowlist, pull request, non-force merge, Pages verification, and live byte parity.
