# Landometer Design System v0.8.8 — Implementation clarifications

**Status:** Proposed artifact-level clarification
**Authority:** Non-normative until incorporated into an owner-approved Design System release
**Applies to:** The v0.8.8 Design Identity Playground implementation
**Preserves:** `[CORE-03]`, `[CORE-10]`, `[CTRL-01]`, `[STATE-01]`, `[REFERENCE-01]`, `[DELIVERY-01]`, `[SHARE-01]`, `[CONTEXT-01]`, `[PUB-01]`, and `[AGENT-OUT-01]`

This note makes eleven implementation clarifications explicit without changing the normative text or ordering of the whitespace-normalized v0.8.8 authoring master.

## IMPL-SURFACE-COLOR-01 — Preserve governed atmosphere and make color guidance findable

The Try fixture uses two teaching presets so each inspection lens opens with the intended visual character: Brand DNA resolves to Measure, with its dark-blue directional gradient; Brand Voice resolves to Ground, with the canonical cool gradient under the declared light scrim so it reads as muted light blue. Brand Visual remains the atmosphere playground and keeps the user-selected Measure, Ground, or Cultivate surface.

These presets belong to this teaching artifact. They do not create a normative rule that DNA must always use Measure or Voice must always use Ground in a product. Lens and atmosphere remain separate design decisions outside this fixture, and no lens may fall back to a generic flat light or dark card merely because it is not Brand Visual.

Keep the canonical gradient recipe intact. Repair readability through the surface-owned foreground contract:

1. choose the tested local foreground;
2. apply the deterministic Measure, Ground, or Cultivate scrim where declared;
3. place dense metadata on the declared opaque or near-opaque panel;
4. keep separators, cues, controls, and focus states inside the same local contrast contract;
5. test light, dark, system preference, reduced motion, narrow viewport, and zoom;
6. never use an atmosphere gradient to encode semantic state or data magnitude.

Color guidance is a first-class Implementation Library route. Start by naming the job—Brand, Interaction, Semantic, Atmosphere, Series, Scale, Map, or Depth—then choose among solids/states, gradients, sequential/diverging scales, categories, opacity/layers, and lines/strokes. The concise router leads to realistic fixtures first and the complete generated atlas second.

The artifact does not mint new colors, generate analytical ramps at runtime, or promote candidate stroke widths, dash conventions, or overlap formulas into normative tokens. Categorical capacity remains: color alone up to six; add stable shape or pattern for seven to ten; above ten, group, filter, use small multiples, or provide a table.

This corrects an artifact regression and improves discoverability. The existing v0.8.8 normative rules already require governed atmosphere, local contrast repair, role-separated color, generated scales, and redundant category encoding, so no normative patch is required for this change.

## IMPL-COLOR-SET-PARITY-01 — Prove the same build before judging device color

A report that two devices show a different Color Set is first a delivery-parity question, not evidence of a mere display shift. This artifact binds color delivery to `assets/data/color-delivery.v0.8.8.json` and registry ID `color-srgb-01`.

Color identity and UI-build identity are separate. The Color Set remains `color-srgb-01` while each UI-only change mints a new append-only `artifactBuild` ID and immutable filename. A governed color, gradient, token-source, or scale-source change requires a new Color Set ID; a responsive, accessibility, copy, or release-tool change does not.

The hosted root/latest alias, latest standalone alias, current immutable UI artifact build, Complete Color Atlas, Site Manifest, and Build Card must resolve one registry/build relationship. For this artifact, that relationship includes the Design System version, `data-color-registry`, `data-artifact-build`, token-registry path/version/SHA-256, scale-registry path/version/SHA-256, and the expected SHA-256 for each delivered artifact. Different packaging may have its own file hash, but the manifest and Build Card must bind every channel to the same source Color Set and UI build.

The immutable handoff URL is:

```text
https://montri-th.github.io/Landometer/landometer-design-system-v0.8.8-standalone.color-srgb-01.ui-20260731-01.html
```

That immutable artifact-build URL is the visual-QA and handoff authority for the current UI build. The earlier `landometer-design-system-v0.8.8-standalone.color-srgb-01.html` remains a byte-stable Color Set baseline and is not rewritten when UI code changes. `index.html` and `landometer-design-system-v0.8.8-standalone.html` are latest aliases. GitHub Pages currently serves latest aliases with `Cache-Control: max-age=600`, so two devices can temporarily receive different releases after publication. A latest-alias mismatch is classified as cache/build skew; do not describe it as color drift and do not use it as cross-device approval evidence.

Standalone generation is fail-closed. `tools/build-standalone-html.mjs --check` rebuilds in memory and compares committed latest and immutable UI artifacts without writing. A normal build preflights the original Color Set baseline and the target append-only artifact path before atomically replacing the mutable latest alias. CI must run the check mode from source; post-deploy verification must compare exact expected hashes after Pages completes, not merely detect a `0.8.8` marker.

After registry, build, and expected hashes match, pin the comparison theme explicitly to `light` or `dark` and record it. `system` is an adaptive user preference, not a reproducible visual-baseline state. Only then compare rendered color.

The artifact declares SDR `sRGB IEC 61966-2-1`, serializes governed solids as sRGB hex/rgba, and requests explicit sRGB gradient interpolation where supported with a legacy sRGB-compatible fallback. This explicit sRGB delivery is secondary renderer stabilization: it reduces avoidable interpolation ambiguity after parity is proven, but it cannot reconcile different cached builds, replace the registry/hash check, or guarantee identical physical output across displays and color-management stacks.

This is an artifact-level clarification and proposed delivery contract. It does not change the owner-approved v0.8.8 authoring master, mint a new raw color token, or promote the carried v0.8.6 token/scale registries to gated v0.8.8 package conformance.

## IMPL-SHARE-01 — Share by recipient value, never by repetition

Do not place a share button on every page, section, result, chart, card, or completion state.

A visible share or handoff action is allowed only when all of the following are true:

1. the source user has already received the promised AHA;
2. an exact governed object and version can be handed off;
3. its source, date, boundary, limitation, visibility, and safe recipient view remain attached;
4. the intended recipient and a useful recipient outcome are named;
5. permission, redaction, delivery, failure, revoke, and recovery behavior are implemented;
6. the current page has no unresolved decision or progress action that the network action would displace.

One page state promotes at most one network action. Additional destinations, when genuinely available, belong in one secondary menu.

The evidence ladder is:

```text
source AHA
→ exact-object handoff preview
→ delivery receipt
→ recipient lands on the same object/version and boundary
→ recipient AHA
→ recipient useful action
→ governed outcome observed
→ only then may a network outcome be claimed
```

A share click is not delivery. Sent is not received. Received or opened is not understood. A handoff receipt is not network effect. Raw share count, invite volume, reach, time-on-page, or viral coefficient is not success without a governed user or object outcome.

For the current playground, `network.mode` remains `reference_ready`, `share` remains `false`, and no live share control is rendered.

## IMPL-SEARCH-EXT-01 — Continue a visible intent into external search

Use an external-search action only when fresh outside context is useful to the current task and the query can be made public-safe.

Source Search finds source pages, records, or reporting that a person can inspect. It is distinct from asking an AI provider to synthesize or follow up on the same intent. Do not silently switch between the two.

### Label

The action label names the immediate consequence and destination.

- Thai: `ค้นคำนี้ต่อใน Google`
- English: `Continue this query in Google`

Do not use `See more`, `Explore`, or another destination-free label when the action opens an external search engine.

### Interaction contract

1. derive the query from the current governed context when the product has it;
2. preserve the active object or event name, public-safe place hierarchy, selected topic, current intent, and semantically useful active filters;
3. show the exact composed query, the context fields that supplied it, and the named search provider before any request;
4. let the user inspect or edit the query;
5. remove private filters, identities, notes, customer criteria, sensitive locations, restricted IDs, and filter values that are not safe or useful outside the product;
6. send the query only after an explicit user action;
7. keep the current work state available when the external result opens;
8. identify the external destination and provide a copyable-query fallback;
9. treat returned material as `discovery_only` until a person reviews it and records source, retrieval time, method, boundary, limitation, and allowed use;
10. preserve empty, timeout, cancellation, restricted, unsupported, and failure recovery.

Recommended composition:

```text
governed active object or event display name
+ active topic and user intent
+ public-safe filter labels that improve semantic relevance
+ place name → district → province when place is relevant
+ optional freshness/source terms owned by the product
→ visible editable query
→ explicit external-search action
```

For example, a CityMETER-specific Disaster view may compose the active event name, date, known cause, selected `ยอดผู้เสียชีวิต` field label, and current public place hierarchy into a news query. The product must take those values from its governed runtime context.

A design-system example may use a current public product record only when it keeps the product boundary visible, links the inspected source, records the retrieval date, and describes the item as a product record snapshot rather than independently verified ground truth. If the product endpoint omits provenance, say so. Omit numeric values whose geographic or methodological scope is unresolved; a visible field label may still be used to preserve the user’s search intent. A numeric value may appear only when its scope and source are inspectable and, for a material claim, independently corroborated.

The four current-record examples in this artifact were inspected in the public CityMETER API on 29 July 2026. They remain CityMETER-specific and `source_limited`; they do not establish a portfolio-wide Landometer fact or a superior-relevance outcome.

External search is not sharing and does not prove a network effect. It must not replace the primary decision or action, appear before the promised AHA, or silently broaden the governed object.

### Product boundary

The shared Landometer layer owns the visible-query, privacy, navigation, recovery, and evidence-promotion contract. Each product owns the supported entity × intent pairs, query construction, allowed providers, sensitivity rules, review workflow, and whether discovered material may be incorporated.

Relevance is an inspectable design hypothesis, not a superiority claim. Before claiming that contextual composition outperforms another approach, compare a declared baseline and assisted query on the same intent set, record top-result usefulness or another governed outcome, and keep irrelevant/counter-results visible.

## IMPL-AI-EXT-01 — Continue a visible intent into external AI synthesis

Offer AI synthesis or follow-up as a separate, explicitly named action only when a generated response is useful to the current task and the prompt can be made public-safe.

Before send:

1. show `AI synthesis` or `Ask AI` as the job rather than presenting it as source Search;
2. name the provider;
3. show the exact editable prompt and every current-context field used to compose it;
4. remove private identity, notes, restricted identifiers, sensitive locations, customer criteria, and unsafe or unnecessary filter values;
5. explain that the provider, signed-in account, prior history, and personalization may influence the response;
6. send only after explicit user activation;
7. open the provider in a new tab and keep the current work state available.

Treat every returned AI response as `discovery_only`, never as evidence by itself. Make cited sources openable. Before a material claim is incorporated into a governed object, open the cited source, verify the important claim against it, and record source, retrieval time, method, boundary, limitation, and allowed use. Missing, circular, inaccessible, or non-supporting citations remain visible limitations.

The current playground routes its Google AI action with `udm=50`. That parameter is an implementation-specific deep link, not a normative Landometer contract and not a guarantee that the provider will preserve the route. If the deep link is unavailable, keep the exact prompt copyable and offer the documented Google AI entry point at `https://www.google.com/ai`. Do not silently fall back to Google Search, another provider, or a different action.

The shared Landometer layer owns the distinction between Source Search and AI synthesis, visible prompt, provider disclosure, privacy removal, explicit activation, new-tab/state-preservation behavior, fallback, and evidence-promotion contract. Each product owns supported entity × intent pairs, prompt construction, allowed providers, sensitivity rules, and the workflow for reviewing and incorporating discovered material.

Provider URL parameters, including `udm=50`, are implementation-only. A product may use another documented provider route while preserving the same user-visible contract.

AI usefulness is an inspectable design hypothesis, not a superiority claim. Do not claim that contextual AI synthesis is better, more relevant, or more accurate than Source Search or another route without a same-intent study against a declared baseline, a governed usefulness or accuracy outcome, and visible irrelevant or counter-results.

## IMPL-TYPE-TH-01 — Keep Thai compact labels deterministic

The owner-approved v0.8.8 master assigns Bai Jamjuree 400/600 to Thai body and general UI. JetBrains Mono’s packaged files contain Latin glyphs only, so using a JetBrains-first stack for mixed Thai technical metadata otherwise allows the browser or operating system to choose an uncontrolled Thai fallback.

Following the owner’s implementation direction, this artifact uses a script-aware technical pair:

- JetBrains Mono 400 for Latin identifiers, numerals, and Latin technical labels;
- IBM Plex Sans Thai 400 for Thai glyphs in the same technical role;
- Bai Jamjuree 400/600 remains the continuous-reading body and general UI family.

The technical pair uses one active weight only: 400. The v0.8.8 playground does not declare, embed, or request JetBrains Mono 500/700 or IBM Plex Sans Thai 500 inside this role, and `font-synthesis: none` prevents faux bold. Display headings remain a separate role and continue to use Arvo 700 or IBM Plex Sans Thai Looped 700.

Both technical faces are self-hosted. The IBM Plex Sans Thai subset is recorded from `@fontsource/ibm-plex-sans-thai@5.3.0`, carries the SIL Open Font License 1.1 record, and has an exact SHA-256 entry in `font-assets.manifest.json`. The page preloads the Thai technical face and checks it explicitly after `document.fonts.ready`.

The pairing is optically compact rather than mechanically monospaced. The reference applies `size-adjust: 102%` to the Thai face, weight 400, `.008em` tracking, `1.48` line-height, and one additional pixel of vertical padding in the smallest technical pills. These values keep Thai marks readable and let the letterforms breathe while remaining visually close to JetBrains Mono’s compact rhythm, without forcing Thai clusters into fixed cells. IBM Plex Sans Thai remains proportionally spaced; any genuine fixed-cell requirement still needs a separately approved `font.code.th` role and font.

This is a documented artifact-level override and a proposed normative clarification, not a silent rewrite of the owner-approved v0.8.8 master. A future normative release should either adopt the companion role and its delivery record or replace it deliberately after cross-device review.

## IMPL-EXAMPLE-01 — Show the pattern through positive cases

Every important rule should be paired with varied, bounded design opportunities. Use this frame:

```text
Intent
→ useful AHA
→ design response
→ moment of value
→ evidence/privacy boundary
→ next useful action or clean completion
```

The v0.8.8 playground includes:

1. decision evidence — DecisionCard + SourceLedger + one evidence-check CTA;
2. contextual discovery — active event, field filter, and place hierarchy composed into a visible external-search query;
3. recipient value — exact-object preview, recipient AHA, useful action, and governed outcome ladder;
4. one rejected engagement-first case — described statically, never implemented as an operable dark pattern;
5. additional opportunity sketches across CityMETER, CityWiki, CityChat, ijji, bilingual meaning, cross-team parity, and human/machine delivery.

Guardrails are a runway: they preserve truth, privacy, and recovery while leaving interaction form, pacing, composition, language, atmosphere, and moments of value open to thoughtful invention.

## IMPL-DISCOVERY-01 — SEO and machine discovery remain release-gated

The current playground is `source_limited`, `internal_demo`, `indexable: false`, and `machineValidation: pending`. Its `noindex` state is therefore deliberate.

Keep four contracts separate:

1. **Machine-readable when opened** — semantic initial HTML, real headings and landmarks, direct links, visible status, and durable release records.
2. **Search-discoverable** — indexable delivery, stable crawlable URLs, localized initial metadata, canonical/hreflang correctness, and verified sitemap inclusion.
3. **AI-search-discoverable** — provider crawler access and eligibility remain provider-specific; there is no universal `ai-friendly` meta tag.
4. **Agent-readable/actionable** — bounded action, permission, parity, failure, and recovery remain governed by `[AGENT-OUT-01]`; readable content never grants permission to act.

Do not switch to indexable public delivery by changing `robots` alone. Promotion requires verified public visibility and permissions, stable pre-rendered Thai and English URLs, per-locale initial HTML and metadata, self-canonical URLs, reciprocal `hreflang`, an approved social-preview asset, truthful structured data, private-state stripping, and completed release gates. Add sitemap entries only for verified indexable self-canonical URLs.

The downloaded standalone is a portable snapshot, not a second hosted canonical page. Its builder removes the canonical link while keeping links to production release records.

An `llms.txt` file may provide a concise navigation aid to public-safe sources under an emerging convention. It is not a ranking signal, access-control rule, permission grant, conformance claim, host-root discovery guarantee, or substitute for semantic HTML and validated machine records.

## IMPL-BROWSER-IDENTITY-01 — Give the browser tab its own approved identity asset

The header lockup and browser-tab icon are different delivery contexts. The available `landometer-logo-banner.png` is a transparent horizontal mark-and-wordmark lockup. Do not crop, mask, reconstruct, recolor, apply a CSS filter, or place it on an invented carrier to make a favicon.

The current internal demo renders the separately approved transparent symbol at `assets/images/landometer-symbol-transparent.png` for browser-tab favicon duty only. The exact repository asset is a 192 × 192 RGBA PNG, 11,001 bytes, SHA-256 `35a1496f6e8c502cef82f0a46de5dacff98718ff9f5a6c07ccc3783d76e3ae85`, introduced for this context by repository main commit `ce785864e5341321e1957dce35a8326732764432`. Hosted HTML uses the unchanged same-origin asset with cache revision `?v=35a1496f`. The standalone snapshot uses the corresponding absolute production URL instead of a `data:` favicon because browser support and cache replacement for data-URL tab icons are inconsistent; this exception affects browser chrome only, not page content or offline meaning.

The release record names:

- the approved compact-symbol variant and browser-tab-only context;
- exact file path, MIME type, intrinsic dimensions, byte count, SHA-256, transparent canvas, alpha bounds, unchanged transform, and one transparent-canvas theme strategy;
- the still-open small-size checks in browser tabs, bookmarks, shortcuts, and supported themes;
- a separate approved social-preview/touch/maskable asset when those contexts are enabled.

Header lockup, favicon, social image, touch icon, and maskable application icon are not interchangeable. Search-result favicon selection is also hostname-level; a GitHub Pages project subpath cannot independently guarantee a distinct search-result favicon without host-root or dedicated-hostname coordination.

## IMPL-SCALE-TEACHING-01 — Show every governed scale family without synthesizing colors

The concise Scale route renders all six sequential families—Growth, Water, Risk, Activity, Density, and Confidence—and all three diverging families—Balance, Delta, and Tradeoff. Each family shows exact 5-, 7-, and 9-class strips for the active light or dark theme. The complete disclosure retains both theme records, every 41-stop LUT cell, exact `scaleVersion`, and the source boundary.

Every cell comes from `assets/data/scales.json`; CSS only switches between embedded light and dark values. Do not use a CSS gradient, `color-mix()`, interpolation, or opacity to manufacture analytical classes at runtime.

The carried scale source reports `meta.version: 0.8.6` and is `source_limited`; it is not the gated v0.8.8 `dataviz.tokens.json` package. The consuming analysis still owns endpoint meaning, domain, thresholds, classification, outlier policy, legend, missingness, unit, geography, period, and accessible table. Do not infer those decisions from a palette name.

## IMPL-ACTION-SHAPE-01 — Use capsule geometry for actions, not for every container

Text-labelled action buttons and action links in this playground use one capsule geometry with enough horizontal padding for Thai and English. Icon-only theme and language controls remain circular. A mixed icon-and-label action is still a capsule.

Do not apply the capsule token to cards, form fields, disclosures, tables, tooltips, or navigation rows merely because they are clickable. Tabs and segmented controls keep their own grouped-selection geometry; an individual tab is not restyled to impersonate a primary CTA. Shape reinforces semantic role, but label, hierarchy, focus, disabled state, and consequence remain the primary action contract.

This is an artifact-level consistency choice and a proposed semantic-geometry clarification. It does not retroactively declare every rounded rectangle across Landometer a button or change product-owned component contracts without product review.
