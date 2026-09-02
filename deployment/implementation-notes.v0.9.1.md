# Landometer Design System v0.9.1 — implementation notes

This is a non-normative application record for artifact build `ui-20260902-07`. The owner-approved authority is [`assets/downloads/landometer-design-system-v0.9.1.md`](assets/downloads/landometer-design-system-v0.9.1.md), authoring revision `0.9.1-r8`, ruleset `lds-rules-0.9.1`. Its SHA-256 is `64f5d6277b557176502285bc65890ecc4c81faf4b97946eb5e3a2ef2c0d90d19`.

The source identifies machine package `v0.9.1-mp7`. This repository records that release identity but does not publish or claim validation of those machine-package bytes. Design System approval does not pre-certify this downstream playground.

This build supersedes `ui-20260902-06` as the current presentation while preserving it, `ui-20260902-05`, `ui-20260902-04`, `ui-20260902-03`, `ui-20260902-02`, `ui-20260902-01`, and `ui-20260901-01` as append-only release evidence. It retains the ui-04 navbar, side-bookmark, and perceptual-motion work, the ui-05 handoff-link/receipt correction, and the ui-06 selected-outline-state correction without altering Design System `0.9.1`, authoring revision `0.9.1-r8`, ruleset `lds-rules-0.9.1`, evidence status `source_limited`, public `noindex` policy, artifact conformance status `not_claimed`, or Color Set `color-srgb-05`.

Three visible/current references in ui-04 still pointed to the older ui-03 immutable handoff: the Color Set stability code sample, the Implementation Library standalone resource link, and the footer artifact receipt. `ui-20260902-05` rebinds all three to its own immutable handoff. The ui-04 file is not rewritten and remains append-only evidence.

A pre-commit audit of ui-05 found that the selected side-bookmark icon changed from the governed `wght 300` to `wght 400`. That emphasis violated the fixed ICON-01 outline recipe even though `FILL 0` remained intact. `ui-20260902-06` restores the selected icon to `FILL 0, wght 300, GRAD 0, opsz 24`; selection continues to communicate through surface, border, shape, and label rather than glyph fill or weight. The ui-05 and ui-04 artifacts remain byte-frozen.

`ui-20260902-07` closes four artifact-level defects observed in Safari without changing the normative release or Color Set. First, calm navigation keeps the row full-width and every semantic target in the same position and dimensions as the prominent state; scaling now belongs to each complete inner visual surface, including its visible border and background, rather than splitting a control's chrome across scaled and unscaled layers. Second, Menu, Close, and all six side-bookmark symbols are inline outline SVG, so recognizable icon paint no longer depends on a webfont loading or mapping correctly. Third, the home-page Color Atlas preview is generated from the same seven Identity and Energy records used by the complete Atlas instead of showing a hand-authored categorical substitute. Fourth, the latest hosted alias performs a no-store Site Manifest freshness check and, only when its build is stale, makes one build-qualified reload; immutable and offline standalone files do not run that handshake. These are implementation and verification corrections, not new Design System rules.

The owner explicitly selected the non-normative `rebuild02-navbar-handoff-r7-candidate` as the artifact reference for this revision. The supplied archive is bound by SHA-256 `47a26f9546316856357040d7a716619a8fa5289484851b4d25bdbb9501ef60fa`; that binding proves the reference bytes, not Design System approval, identity approval, or downstream conformance. The implementation takes its navbar anatomy, grouped disclosure, bookmark orientation, and visual rhythm while preserving the DS safety floors described below.

## Why `ui-20260902-03` could pass and still look broken

The supplied quality audits were used as evidence, not as normative instructions. Where the later Claude re-audit added a stricter visible-quality finding beyond the earlier ChatGPT audit, that additional finding was carried into this hotfix without allowing either audit to override the Design System authority. Their shared findings explain three visible failures that the previous structural checks did not catch:

- **Blank menu icon:** the page called menu/close glyphs that were absent from its embedded icon subset, while the rendered check measured the 44 × 44 button box rather than verifying that a recognizable glyph was painted. This was an asset-coverage and QA-scope failure, not a rule requiring an empty icon.
- **Intermittent side bookmark:** rail visibility depended on whether the active observer target belonged to a short four-anchor list. It therefore disappeared before the first tracked anchor and across omitted long sections. This was an implementation-state error compounded by an incomplete bookmark contract.
- **Slow reveal that was technically covered but barely perceptible:** the runtime assigned a motion policy to many components, but one protected descendant could downgrade an entire container and the check counted policy labels rather than reading-journey cadence. This was primarily policy resolution and perceptual-QA coverage, not evidence that DS v0.9.1 requires every node to animate.

`ui-20260902-04` closed those gaps with rendered glyph checks, a stable six-anchor bookmark model, and eligible supporting-child reveal groups across the major reading territories. `ui-20260902-05` preserved those improvements and corrected the three stale current-handoff references. `ui-20260902-06` kept both revisions and restored the selected bookmark icon to the fixed outline recipe. `ui-20260902-07` keeps that history and removes the remaining calm-layout, icon-paint, preview-source, and latest-alias freshness failure modes described above. Critical content, evidence, identity, controls, focus/deep-link targets, and Color Atlas records remain visible immediately.

## What this build is for

The page is a bilingual Design System reference. Its job is to make the v0.9.1 implementation improvements concrete while preserving the strongest existing learning material, especially the complete Color Atlas.

The learning arc is:

1. recognize the retained principle;
2. inspect the improved implementation move;
3. see the resulting AHA or recovery behavior;
4. keep the evidence or compatibility boundary visible; and
5. open the relevant library or release record.

## Retained foundations

The build retains the v0.9.0-r7 principles that v0.9.1 explicitly carries forward:

- truth, evidence, and product boundaries first;
- protected brand wording and one headline role;
- the normative values and semantic ownership of Color Set `color-srgb-05`;
- script-aware font families and semantic type roles;
- spacing, radius, container, gutter, and breakpoint scales;
- one job, dominant object, first AHA, primary action, and clean completion;
- accessibility, resilience, privacy, permission, and external-effect boundaries;
- data-visualization and map evidence discipline; and
- the Build Card → profiles/capabilities → QA resolution model.

The current page keeps the hero invitation, before/assisted proof, handoff pattern, takeaway, Implementation Library, and full Color Atlas. Historical v0.9.0 records and immutable standalones remain versioned evidence and are not relabelled as v0.9.1.

## New visual chapters

Every new example is visibly labelled in Thai and English as a conceptual example, not product evidence. The cases use product-neutral Locale Insight framing across Land, Location, and Living. Product data, capabilities, permissions, models, scores, workflows, audiences, and claims remain in named-product layers.

The revision presents the examples as alternating copy-and-visual chapters. This sequencing is an artifact decision, not a new normative layout requirement.

### 1. One shared method, distinct product truths

The Locale Insight architecture specimen separates a shared method from distinct Land, Location, and Living packs. Shared architecture can describe the portfolio frame, methodology, and product architecture together; a named product must still own its facts, evidence, permissions, and capability claims.

### 2. One claim, consistent meaning for people and machines

The synthetic claim canvas preserves one meaning across an Initial HTML → Visible page → Hydrated state route. Discovery, readability, and action are shown as separate layers so a technical signal does not stand in for human clarity or a usable action.

### 3. Calm by hierarchy, not by hiding controls

The page header is the live example and an explicitly owner-selected artifact divergence:

- ecosystem/property/page destinations remain distinct;
- the prominent navbar uses Brand + CityMETER + CityWiki + Sign in + Menu on desktop and Brand + Menu on mobile;
- the desktop selection is five visible controls including brand, one over the NAV-01 budget of four; the owner-selected candidate divergence is recorded rather than silently described as normative, and artifact conformance remains `not_claimed`;
- the visual rhythm is 76px prominent on desktop and 68px prominent on mobile, calming to a 52px visual surface in both modes with a 560ms state transition;
- calm keeps the row full-width and the control cluster right-aligned, leaves every semantic target at its prominent-state position and size, scales each complete inner visual surface to `.82`, keeps content opacity at `1`, and uses an `88%` surface alpha;
- the mobile visible-control budget is no more than two including brand;
- mobile keeps the primary action, the same six page anchors, ecosystem routes, and utilities inside the grouped disclosure instead of deleting them;
- the prominent state is used at the page start, on upward-scroll intent, pointer intent, focus within the header, or while the menu is open;
- the calm state is eligible only during downward reading without pointer, focus, or an open menu;
- calm changes surface and visual emphasis, never link/button meaning or geometry;
- every direct interactive target remains at least 44 × 44 CSS pixels in both states;
- no wake-first click or coordinate-forwarding overlay is used;
- reduced motion stays in the stable prominent state;
- disclosure uses a button with `aria-expanded`, stable focus, and Escape recovery;
- page current state and in-page location current state use separate semantics;
- `navigation.sideBookmark: selected` is bound to `component.bookmark.side.01`; the desktop rail is stable before the first tracked section and the mobile disclosure mirrors the exact six anchors and order;
- the rail hides at widths of 600px or less, or at viewport heights of 560px or less, where the disclosure remains the orientation route;
- Menu, Close, and the six bookmark icons paint as inline rounded-outline SVG with non-scaling strokes, independent of webfont paint; and
- selected state uses surface, container, and label rather than filled glyphs.

The candidate's unsafe mechanics are not copied. Direct targets remain at least 44 × 44 CSS pixels, calm does not shrink or reposition semantic geometry, and there is no wake-first layer, coordinate forwarding, infinite attention cue, or filled selected icon. The r7 archive is not treated as identity authorization; the existing header identity remains subject to the open manual identity/contrast gate.

The cross-format CTA has one visible verb-led destination and a pointer-inert, `aria-hidden` highlight band. The band sweeps once from `translateX(-120%)` to `translateX(120%)` in `540ms`—below the `600ms` ceiling—with `cubic-bezier(.16,1,.3,1)`. It does not loop, move layout, or lower content opacity. Re-entry does not replay it; reduced motion or missing observer support receives the final no-cue state.

### 4. Change the format, preserve the promise

Web controls become native equivalents in PDF, deck, document, app, or social output. Navigation may become a TOC or native bookmark, disclosures may become visible notes, and motion becomes a final-frame equivalent. Truth, identity, evidence boundary, locale proposition, and action promise remain invariant.

### 5. Incompatibility is a valid result

The analytical specimen refuses to compare records when schema, release, unit, or grain differs. It either recomputes under one approved schema or shows incompatibility beside the comparison. Similar names are not evidence of compatible meaning.

### Rejected case and recovery

The rejected motion specimen shows why hiding proof cards until an observer fires is unsafe. The recovery uses source-visible final meaning and only the explicit supporting roles `approach.soft`, `approach.inline-start`, `approach.inline-end`, `media.arrival`, and `stagger.child`.

Every semantic component family is audited at runtime against one of eight policies: `reveal.supporting`, `settle.visible`, `state.direct`, `state.disclosure`, `static.critical`, `static.evidence`, `container.orchestrates`, or `contained.inherited`. Every major reading territory after the hero now has an eligible supporting reveal group or an explicit justified-static state. When a teaching container contains protected material, the runtime reveals only eligible supporting children instead of hiding the parent or downgrading all of its editorial content. Controls own direct state; disclosures animate only their surface; and critical, evidence, identity, chart, map, provider, and Color Atlas content stays immediate. Proof status/source/boundary/limitation and CTA receipt text never dim or translate; only supporting cues or a non-content surface may settle.

This is perceptual coverage across the reading journey, not a blanket “animate every component” rule. Broad every-card/every-heading assignment remains prohibited. The required slow-scroll screen recording is still an open manual gate; this record does not claim that the perceptual check has passed.

The exact artifact recipe is opacity `760ms`, transform `920ms`, media `900ms`, block distance `32px`, logical inline distance `36px`, scale from `.985`, stagger step `150ms` capped at `450ms` (four beats), enter easing `cubic-bezier(.16,1,.3,1)`, settle easing `cubic-bezier(.2,.9,.25,1.08)`, observer threshold `.14`, root margin `0px 0px -12% 0px`, and a `2400ms` reached-content safety audit after two animation frames. One shared observer unobserves each element after its first landing.

Hero and LCP media, H1, first answer, primary proof, primary action, task-critical state, status, focus targets, and deep-link targets are excluded from hidden entrances. Closed disclosures and hidden panels are not enrolled. Broad every-card/every-heading selectors, unsynchronized nested reveals, parallax, and motion applied to identity, evidence, maps, charts, UI captures, or provider content are excluded. Reduced motion, no JavaScript, missing observer support, initialization failure or timeout, hidden tabs, focus/deep-link/history/BFCache restoration, and print resolve to visible final meaning.

## Color delivery and the complete atlas

DS v0.9.1 retains `color-srgb-05`; no normative color value changes from v0.9.0-r7 and no new Color Set is minted. The artifact-level delivery record is [`assets/data/color-delivery.v0.9.1.json`](assets/data/color-delivery.v0.9.1.json).

The existing immutable Color Set baseline remains:

- path: `landometer-design-system-v0.9.0-standalone.color-srgb-05.html`
- bytes: `2141429`
- SHA-256: `0788b25be195307821ac7c26159d5011e840c4c0da385ba6c9237e90fbaf7f1a`
- status: preserved byte-for-byte

The complete Color Atlas remains a first-class route. It preserves 17 foundation pairs, 7 semantic states, 7 shared atmosphere gradients, 3 asset-only motif records, 4 product-gradient families with 8 theme specimens, 10 categorical pairs, 18 analytical scale records with 738 LUT cells and 378 class cells, 8 map pairs, 8 opacity values, and 6 depth roles.

The home-page preview is now a generator-owned projection of the complete Atlas's Identity and Energy family. It contains exactly `brand.blue` `#1D4497`, `brand.beige` `#F2F1DF`, `dark.brand.beige` `#D8CFB2`, `energy.sky` `#59D2FE`, `energy.mint` `#0AD69C`, `energy.coral` `#FF5A5F`, and `energy.yellow` `#FFBC1F`. Each swatch carries its token ID and value for verification. Categorical colors are still available in their governed Atlas family, but they no longer substitute for this Identity and Energy preview.

Analytical scale records stay bound to their recorded source/version. They are design-system reference material, not product or city evidence. A named product must supply a compatible schema, release, unit, grain, and evidence record before analytical use.

## Release identity and handoff

- Design System: `0.9.1`
- authoring revision: `0.9.1-r8`
- ruleset: `lds-rules-0.9.1`
- machine-package identity: `v0.9.1-mp7` — identity only in this repository
- Color Set: `color-srgb-05` — retained
- artifact build: `ui-20260902-07`
- supersedes UI artifact: `ui-20260902-06` — preserved as append-only release evidence
- earlier UI artifacts: `ui-20260902-05`, `ui-20260902-04`, `ui-20260902-03`, `ui-20260902-02`, `ui-20260902-01`, and `ui-20260901-01` — also preserved as append-only evidence
- latest standalone: `landometer-design-system-v0.9.1-standalone.html`
- immutable UI handoff: `landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-07.html`
- site manifest: `site-manifest.v0.9.1.json`
- Build Card: `build-card.v0.9.1.yml`
- QA record: `qa/v0.9.1-manual-gates.md`

Use the immutable UI handoff for cross-device comparison. Root and latest aliases are convenient routes and can briefly receive an older cached document after publication; the hosted latest alias now compares its build with a no-store Site Manifest request and performs at most one build-qualified reload when they differ. This freshness recovery does not alter immutable or offline standalone behavior.

The manual gates in `qa/v0.9.1-manual-gates.md` are an open execution protocol for these new immutable bytes. This record does not claim that those human checks have run or passed.

## Evidence boundary

This playground teaches a shared method; it does not establish a named product's capability, data quality, score, city fact, sector workflow, customer outcome, or permission. CityMETER, CityWiki, CityChat, ijji, municipality, retail, and F&B material remains product- or context-specific wherever it appears. Cross-product and cross-city comparisons require compatible schema and release; otherwise incompatibility must remain explicit.
