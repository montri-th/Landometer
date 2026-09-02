# Landometer Design System v0.9.1 Implementation Playground

The GitHub Pages root is `deployment/` and publishes a bilingual, product-neutral Design System reference at:

**https://montri-th.github.io/Landometer/**

The v0.9.1 page keeps the strongest parts of the existing playground—hero invitation, before/assisted proof, evidence-preserving handoff, takeaway, Implementation Library, and the complete Color Atlas—then presents the new implementation guidance as a deliberate visual story for navigation, action, motion, evidence, compatibility, and cross-format production.

## What is new in v0.9.1

Artifact build `ui-20260902-06` makes “retained principle → improved implementation → visible result” explicit through six alternating copy-and-visual chapters:

1. **One shared method, distinct product truths** — a shared Locale Insight frame with separate Land, Location, and Living packs;
2. **One claim, consistent meaning for people and machines** — one claim preserved across initial HTML, visible page, and hydrated state;
3. **Calm by hierarchy, not by hiding controls** — prominent and calm navigation states with the same direct targets;
4. **Change the format, preserve the promise** — Web, PDF, deck, and social representations that preserve semantic invariants;
5. **Incompatibility is a valid result** — parcel and neighbourhood fixtures that keep schema/release/unit/grain incompatibility visible; and
6. **Rejected: motion gates the proof** — a bounded static rejection storyboard with a visible source-to-final recovery.

Every new case is labelled as a conceptual example, not product evidence. Product data, capabilities, permissions, workflows, scores, models, audiences, and claims remain product-specific.

The shared Landometer layer covers portfolio framing, methodology, and product architecture across **Land · Location · Living**. Cross-product or cross-city comparison requires compatible schema, release, unit, and grain; otherwise incompatibility stays visible.

### UI artifact revision `ui-20260902-06`

This is an implementation-artifact revision, not a normative Design System change. It applies the owner-selected `rebuild02-navbar-handoff-r7-candidate`, bound to the supplied archive SHA-256 `47a26f9546316856357040d7a716619a8fa5289484851b4d25bdbb9501ef60fa`. That candidate is a non-normative artifact reference and is not identity approval.

The desktop header now follows the selected r7 anatomy: Brand + CityMETER + CityWiki + Sign in + Menu. Five visible controls including brand exceed the NAV-01 budget of four, so the divergence is explicit and artifact conformance remains `not_claimed`. Mobile keeps Brand + Menu while the grouped disclosure preserves the primary action, the same six page anchors, ecosystem routes, and utilities. Prominent height is 76px desktop and 68px mobile; calm is a 52px visual surface in both modes. The row remains full-width, controls stay right, only inner visuals scale to `.82`, content opacity stays `1`, and surface alpha is `88%`. Direct targets remain at least 44 × 44 CSS pixels; no wake-first click, coordinate-forwarding overlay, infinite cue, or `FILL 1` selected icon is used.

The selected side bookmark is bound to `component.bookmark.side.01`. Its desktop rail remains present before the first tracked section, exposes six real anchors in stable order, and mirrors the same list in the mobile disclosure. The earlier intermittent rail came from tying visibility to a short active-anchor observer list rather than the page-index contract.

Every semantic component family still declares a motion policy, but this revision adds perceptual cadence: each major reading territory after the hero has an eligible supporting reveal or a justified-static state. Containers with protected descendants split eligible supporting children instead of downgrading all editorial content. Critical/evidence/identity/Color Atlas content stays immediate. The entrance constants remain opacity `760ms`, transform `920ms`, media `900ms`, block distance `32px`, logical inline distance `36px`, scale from `.985`, stagger `150ms` capped at `450ms`, observer threshold `.14`, root margin `0px 0px -12% 0px`, and a `2400ms` safety audit. Hero/LCP media, H1, first answer, primary proof, primary action, task-critical state, status, focus targets, and deep-link targets are never hidden. Closed disclosures and hidden panels are not enrolled.

The blank menu icon in the prior build was an icon-subset coverage failure that escaped a size-only rendered check; this revision adds visible-glyph coverage. Continuous Thai/English slow-scroll review and header identity/contrast review remain open manual gates and are not claimed as passed.

`ui-20260902-05` preserved the complete ui-04 navbar, side-bookmark, icon-delivery, and perceptual-motion implementation, then closed a stale handoff-link/receipt defect. `ui-20260902-06` preserves both revisions and corrects a pre-commit finding: selected side-bookmark icons had changed from the governed `wght 300` to `wght 400`. The selected icon is now restored to `FILL 0, wght 300, GRAD 0, opsz 24`; selection remains visible through surface, border, shape, and label. The ui-05 and ui-04 files remain byte-frozen append-only evidence.

The cross-format CTA uses a pointer-inert highlight band that sweeps once from `-120%` to `120%` in `540ms` with `cubic-bezier(.16,1,.3,1)`. It does not loop, move layout, or reduce content opacity; reduced motion and missing observer support receive the final no-cue state.

Status, source, boundary, limitation, and CTA receipt text remain readable throughout semantic state changes; only supporting cues or a non-content surface settle. Print, no-JavaScript, reduced-motion, missing-observer, and observer-failure paths expose final meaning. The prior `ui-20260902-05`, `ui-20260902-04`, `ui-20260902-03`, `ui-20260902-02`, `ui-20260902-01`, and `ui-20260901-01` builds remain immutable release evidence.

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
- artifact build `ui-20260902-06` — preserves the ui-04 experience revision and ui-05 handoff-link correction while restoring selected bookmark icons to governed `wght 300`; Design System authority and Color Set are unchanged
- latest standalone `deployment/landometer-design-system-v0.9.1-standalone.html`
- immutable UI handoff `deployment/landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-06.html`
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
