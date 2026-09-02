# Landometer Design System v0.9.1 — implementation notes

This is a non-normative application record for artifact build `ui-20260902-03`. The owner-approved authority is [`assets/downloads/landometer-design-system-v0.9.1.md`](assets/downloads/landometer-design-system-v0.9.1.md), authoring revision `0.9.1-r8`, ruleset `lds-rules-0.9.1`. Its SHA-256 is `64f5d6277b557176502285bc65890ecc4c81faf4b97946eb5e3a2ef2c0d90d19`.

The source identifies machine package `v0.9.1-mp7`. This repository records that release identity but does not publish or claim validation of those machine-package bytes. Design System approval does not pre-certify this downstream playground.

This build supersedes `ui-20260902-02` as the current presentation while preserving it, `ui-20260902-01`, and `ui-20260901-01` as append-only release evidence. The change is an artifact-level navbar and motion revision: it does not alter Design System `0.9.1`, authoring revision `0.9.1-r8`, ruleset `lds-rules-0.9.1`, evidence status `source_limited`, public `noindex` policy, artifact conformance status `not_claimed`, or Color Set `color-srgb-05`.

The revision aligns the live navbar with the approved symbol-plus-wordmark anatomy and prominent/calm rhythm used by the public-site pattern while retaining the stricter DS v0.9.1 visible-control budget and direct target rules. It also gives every semantic component family an explicit motion policy, without hiding evidence, status, identity, Color Atlas records, focus targets, or deep-link targets.

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

The page header is the live example:

- ecosystem/property/page destinations remain distinct;
- the prominent navbar uses the approved symbol plus Arvo wordmark, with Brand + CityMETER + Sign in + Menu on desktop and Brand + Menu on mobile;
- the visual rhythm is 76px prominent and 29px calm on desktop, 68px prominent and 27px calm on mobile, with a 560ms state transition;
- the desktop visible-control budget is no more than four including brand;
- the mobile visible-control budget is no more than two including brand;
- the prominent state is used at the page start, on upward-scroll intent, pointer intent, focus within the header, or while the menu is open;
- the calm state is eligible only during downward reading without pointer, focus, or an open menu;
- calm changes surface and visual emphasis, never link/button meaning or geometry;
- every direct interactive target remains at least 44 × 44 CSS pixels in both states;
- no wake-first click or coordinate-forwarding overlay is used;
- reduced motion stays in the stable prominent state;
- disclosure uses a button with `aria-expanded`, stable focus, and Escape recovery;
- page current state and in-page location current state use separate semantics;
- icons stay Material Symbols Rounded at `FILL 0, wght 300, GRAD 0, opsz 24` in every state; and
- selected state uses surface, container, and label rather than filled glyphs.

The cross-format CTA has one visible verb-led destination and a pointer-inert, `aria-hidden` highlight band. The band sweeps once from `translateX(-120%)` to `translateX(120%)` in `540ms`—below the `600ms` ceiling—with `cubic-bezier(.16,1,.3,1)`. It does not loop, move layout, or lower content opacity. Re-entry does not replay it; reduced motion or missing observer support receives the final no-cue state.

### 4. Change the format, preserve the promise

Web controls become native equivalents in PDF, deck, document, app, or social output. Navigation may become a TOC or native bookmark, disclosures may become visible notes, and motion becomes a final-frame equivalent. Truth, identity, evidence boundary, locale proposition, and action promise remain invariant.

### 5. Incompatibility is a valid result

The analytical specimen refuses to compare records when schema, release, unit, or grain differs. It either recomputes under one approved schema or shows incompatibility beside the comparison. Similar names are not evidence of compatible meaning.

### Rejected case and recovery

The rejected motion specimen shows why hiding proof cards until an observer fires is unsafe. The recovery uses source-visible final meaning and only the explicit supporting roles `approach.soft`, `approach.inline-start`, `approach.inline-end`, `media.arrival`, and `stagger.child`.

Every semantic component family is audited at runtime against one of eight policies: `reveal.supporting`, `settle.visible`, `state.direct`, `state.disclosure`, `static.critical`, `static.evidence`, `container.orchestrates`, or `contained.inherited`. Supporting editorial sequences may reveal once; teaching cards remain readable while an outline settles; controls own direct state; disclosures animate only their surface; and critical, evidence, identity, chart, map, provider, and Color Atlas content stays immediate. Proof status/source/boundary/limitation and CTA receipt text never dim or translate; only supporting cues or a non-content surface may settle.

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

Analytical scale records stay bound to their recorded source/version. They are design-system reference material, not product or city evidence. A named product must supply a compatible schema, release, unit, grain, and evidence record before analytical use.

## Release identity and handoff

- Design System: `0.9.1`
- authoring revision: `0.9.1-r8`
- ruleset: `lds-rules-0.9.1`
- machine-package identity: `v0.9.1-mp7` — identity only in this repository
- Color Set: `color-srgb-05` — retained
- artifact build: `ui-20260902-03`
- supersedes UI artifact: `ui-20260902-02` — preserved as append-only release evidence
- earlier UI artifacts: `ui-20260902-01` and `ui-20260901-01` — also preserved as append-only evidence
- latest standalone: `landometer-design-system-v0.9.1-standalone.html`
- immutable UI handoff: `landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-03.html`
- site manifest: `site-manifest.v0.9.1.json`
- Build Card: `build-card.v0.9.1.yml`
- QA record: `qa/v0.9.1-manual-gates.md`

Use the immutable UI handoff for cross-device comparison. Root and latest aliases are convenient routes and may briefly be cache-stale after publication.

The manual gates in `qa/v0.9.1-manual-gates.md` are an open execution protocol for these new immutable bytes. This record does not claim that those human checks have run or passed.

## Evidence boundary

This playground teaches a shared method; it does not establish a named product's capability, data quality, score, city fact, sector workflow, customer outcome, or permission. CityMETER, CityWiki, CityChat, ijji, municipality, retail, and F&B material remains product- or context-specific wherever it appears. Cross-product and cross-city comparisons require compatible schema and release; otherwise incompatibility must remain explicit.
