# Landometer Design System v0.8.8 — Experience Clarifications

**Status:** proposal only  
**Authority:** the integrated v0.8.8 authoring master remains authoritative until these changes receive owner approval, package generation, hashes, fixtures, and release evidence.  
**Scope:** shared Landometer authoring and adoption guidance; no product fact, dataset, score, workflow, or capability is promoted into the shared layer.

## Why this patch is proposed

Implementation review exposed ten repeatable gaps:

1. a Brand DNA/Voice lens can appear to change only typography rather than meaning and usefulness;
2. fixed gradient surfaces can inherit theme-global text colors and fail contrast;
3. JetBrains Mono has no Thai glyphs in the six-face package, so an unqualified `monospace` fallback can vary by device;
4. color roles exist normatively but lack a required, complete worked reference;
5. v0.8.8 governs map strokes and connector meaning but does not define a universal chart stroke-width or overlap-compositing recipe;
6. external contextual discovery does not yet distinguish source Search from AI synthesis or follow-up, including the different provider, disclosure, fallback, and evidence-promotion duties;
7. the header lockup can be incorrectly reused as a browser-tab icon even though favicon, social-preview, touch, and maskable contexts need separately approved assets;
8. “machine-readable,” search-discoverable, AI-search-discoverable, and agent-readable can be collapsed into one unsupported “AI-friendly” claim;
9. action controls lack one explicit semantic-geometry rule, allowing inconsistent rounded rectangles or indiscriminate pill shapes.
10. cross-device color review can compare different cached latest builds and mislabel registry/build skew as a display-rendering defect.

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

Current A11 packages JetBrains Mono 500 and 700 for `scripts: [latin, numerals]`; it does not deliver Thai glyphs. The generic `monospace` fallback therefore cannot be treated as deterministic Thai typography. The owner’s implementation direction replaces the two-weight technical treatment with one lighter active weight: 400.

Proposed semantic roles:

```css
:root {
  --font-technical-latin: "JetBrains Mono", var(--font-number-fallback);
  --font-technical-th: "IBM Plex Sans Thai", var(--font-body-fallback);
  --font-technical: "JetBrains Mono", "IBM Plex Sans Thai",
    "SFMono-Regular", Consolas, monospace;
}
```

Proposed wording:

> Use one technical weight: JetBrains Mono 400 for Latin identifiers, numerals, and short Latin technical labels, paired with IBM Plex Sans Thai 400 for Thai technical glyphs unless fixed-cell alignment is functionally required. Do not declare, package, request, or synthesize JetBrains Mono 500/700 or IBM Plex Sans Thai 500 inside the technical role. Never rely on a device-selected generic monospace face for Thai. Mixed-script labels use script-aware fallback with both required faces self-hosted, licensed, hashed, preloaded when critical, and verified after `document.fonts.ready`. Keep Bai Jamjuree 400/600 for continuous-reading body and general UI roles. Arvo 700 and IBM Plex Sans Thai Looped 700 remain separate display-heading roles.

Optical-companion guidance:

- match perceived size conservatively at the font-face or semantic-role level; this reference uses weight 400 and `size-adjust: 102%`;
- preserve Thai shaping with restrained tracking (`.008em` in this reference), never force each code point into a fixed cell;
- provide at least `1.48` line-height for compact Thai technical labels and add vertical padding where a pill or chip would otherwise clip marks;
- test mixed Thai/Latin baselines, combining marks, 12–16 CSS px labels, 130% Thai text, 200% zoom, export, and supported operating systems;
- record these values as implementation tuning, not universal font metrics, until multi-device review approves them.

#### Genuine Thai monospace

`TlwgMono` is a true fixed-cell Thai font from the Thai Linux Working Group; all glyphs, including combining characters, use the same width. Its terminal-derived forms make it appropriate only for a real fixed-cell requirement, not as the default Thai UI voice.

If Landometer adopts it, approval must:

- add a new semantic role such as `font.code.th` rather than replace Thai body/UI;
- amend the exact six-face delivery contract and font manifest;
- package WOFF2, license, SHA-256, Thai/Latin coverage, and real metrics;
- review readability at 12–16 CSS px, Thai shaping, clipping, zoom, export, and cross-platform parity.

This implementation therefore proposes replacing the JetBrains Mono 500/700 technical faces with JetBrains Mono 400 and self-hosted IBM Plex Sans Thai 400, keeping one 400-weight face per script in the technical pair. The active standalone package contains nine WOFF2 subset files and no JetBrains Mono 500/700 or IBM Plex Sans Thai 500 declaration or embedded payload inside this role. This does **not** replace Bai Jamjuree in body/general UI, alter the separately governed 700-weight display-heading families, claim that IBM Plex Sans Thai is fixed-cell, or silently add TlwgMono. The owner-approved v0.8.8 master remains unchanged until a future normative release incorporates this proposal and its delivery record.

Primary references used for the candidate assessment:

- Thai Linux Working Group Fonts-TLWG project and TlwgMono release;
- Debian’s TlwgMono package description, which identifies it as purely monospace;
- IBM Plex’s official repository, the `@fontsource/ibm-plex-sans-thai@5.3.0` package record, JetBrains Mono’s official project, and the current v0.8.8 manifest, which scopes packaged JetBrains Mono to Latin/numerals.

### 4. Add worked color-reference coverage to `[REFERENCE-01]`

> A Full Living Reference color proof MUST include realistic, product-neutral fixtures for: surface/text hierarchy; semantic states; Brand Blue versus interaction accent; governed atmosphere recipes and contrast strategies; categorical/sequential/diverging data roles; no-data versus zero; canonical opacity with redundant meaning; map hover/selection/focus; and line/connector meaning. Every fixture marks whether it is normative, generated from a normative registry, or a candidate needing approval.

> A quantitative-scale proof MUST expose every governed sequential and diverging family in every supported theme, show exact 5-, 7-, and 9-class derivations, preserve the source `scaleVersion`, and keep a route to the complete generated LUT. Class cells MUST come from the governed generated package or a clearly labelled carried reference fixture; the reference MUST NOT synthesize analytical colors with CSS gradients, runtime interpolation, opacity, or `color-mix()`.

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

### 7. Add source Search versus AI synthesis to `[CONTEXT-01]`

> An external contextual-discovery action MUST name which job it performs. **Source Search** finds source pages or records for a person to inspect. **AI synthesis or follow-up** asks a named provider to generate a response from a public-safe prompt. These are separate actions and MUST NOT silently substitute for one another.
>
> Before either request, show the named provider and the exact editable query or prompt, including the public-safe context fields used to compose it. Remove private identity, notes, restricted identifiers, sensitive locations, customer criteria, and unsafe filter values before display or transmission. Send only after explicit user activation, open the destination in a new tab or equivalent separate context, and preserve the current work state.
>
> An AI response is `discovery_only`, not evidence. Make cited sources openable and require important claims to be checked against those sources before incorporation into a governed object. Disclose that provider model behavior, signed-in account, prior history, and personalization may influence the response. Provider deep-link failure MUST preserve the user’s prompt and offer a copyable prompt plus a documented provider entry point; it MUST NOT silently switch to source Search, another provider, or another action.
>
> The shared Landometer layer owns action distinction, visible query/prompt, provider disclosure, privacy removal, explicit activation, state preservation, recovery, and evidence-promotion rules. Each product owns supported entity × intent pairs, context composition, allowed providers, sensitivity rules, and the review workflow for incorporating discovered material. Provider URL parameters are implementation details, not normative behavior.
>
> Contextual composition is a design hypothesis. Do not claim that source Search or AI synthesis is “better,” more relevant, or more accurate than another route without a same-intent study against a declared baseline, a governed usefulness or accuracy outcome, and visible irrelevant or counter-results.

### 8. Clarify browser identity under `[LOGO-SURFACE-01]` and `[PUB-01]`

> Header lockup, browser-tab icon, search-result favicon, social-preview image, touch icon, and maskable application icon are separate delivery contexts. Each enabled context MUST reference an explicitly approved asset variant with its intended context, MIME type, intrinsic dimensions, SHA-256, transparent-canvas or governed-background rule, clear space, minimum delivered size, theme strategy, and approval state.
>
> Do not crop, trim, mask, reconstruct, recolor, filter, or place an approved horizontal lockup on an invented carrier to create a compact icon. Declared icon sizes MUST match the delivered asset. When no approved compact or symbol asset exists, omit the icon declaration and record the production blocker rather than improvising one. Search-result favicon ownership and verification MUST be resolved at the served hostname level; a project subpath alone does not establish a distinct hostname favicon.

### 9. Separate discovery and action contracts under `[PUB-01]` and `[AGENT-OUT-01]`

> Publication records MUST report these states separately: **machine-readable when directly opened**, **search-discoverable**, **AI-search-discoverable**, and **agent-readable/actionable**. No generic `AI-friendly` label or metadata field may substitute for their evidence.
>
> A multilingual public candidate MUST provide stable crawlable locale URLs, localized initial HTML and metadata, self-canonical URLs, reciprocal `hreflang`, and real links between locale pages. Truthful structured data describes visible verified content; it does not create evidence. A sitemap contains only verified indexable self-canonical URLs. Crawler access is provider-specific. Optional `llms.txt` delivery is an emerging-convention navigation aid only—not ranking, access control, conformance, host-root discovery, or permission to act.
>
> A downloaded standalone snapshot MUST NOT claim the hosted canonical URL unless it is itself the canonical served resource. Machine readability never grants agent permission; bounded action, parity, failure, and recovery still require `[AGENT-OUT-01]`.

Suggested promotion matrix:

| State | Required discovery contract |
|---|---|
| `internal_demo` / `source_limited` / `noindex` | semantic initial HTML; visible status and boundary; no public SEO, social-preview, or agent-action claim |
| public SEO candidate | verified public rights and evidence; stable locale URLs; canonical/hreflang; localized metadata; approved browser/social assets; truthful JSON-LD; sitemap; completed release gates |
| agent-readable/actionable candidate | public-safe machine package; exact object/source/boundary parity; declared bounded actions, permission, failure, and recovery; independent validation |

### 10. Add semantic action geometry under `[CTRL-02]`

> Within one interface, text-labelled primary and secondary actions SHOULD form one consistent action family using an approved radius token; the Landometer reference uses `radius-pill`. Mixed icon-plus-label actions remain in that capsule family with sufficient inline padding for every supported locale. Icon-only utilities retain a 44 × 44 circular target. Labels may wrap without truncation, retain a minimum 44 px target, and stack or become full-width at narrow viewports. Shape MUST NOT replace visible intent, hierarchy, focus, disabled state, effect, or recovery.
>
> Cards, form fields, disclosures, table rows, tooltips, navigation rows, tabs, and segmented selectors retain their own semantic geometry even when interactive. Do not apply the action capsule indiscriminately to every clickable or rounded container. Product-specific component contracts remain product-owned and require review before adopting the shared action geometry.

### 11. Add Color Set/build parity under `[REFERENCE-01]`, `[DELIVERY-01]`, and `[PUB-01]`

> A cross-device color comparison, visual approval, or handoff MUST first prove that every compared channel resolves the same declared Color Set and source build. The hosted root/latest alias, latest standalone alias, immutable standalone, Complete Color Atlas, Site Manifest, and Build Card MUST carry one registry/build identity: Design System version, color-registry ID, token-registry path/version/SHA-256, scale-registry path/version/SHA-256, source-build relationship, and the expected SHA-256 for each delivered artifact. Channel-specific packaging MAY have a different file hash only when the manifest and Build Card record the derivation and bind it to that same source Color Set.
>
> The immutable standalone URL containing the Color Set ID is the visual-QA and handoff authority. Its bytes and SHA-256 MUST remain stable for that identity. The latest hosted root and latest standalone are mutable aliases, not approval authorities. When their delivery uses `Cache-Control: max-age=600`, different devices MAY temporarily receive different releases for up to that cache window. A mismatched registry, build, or expected artifact hash is build/cache skew; stop the visual comparison and resolve delivery parity before diagnosing rendering.
>
> After registry, build, and hashes match, every comparison MUST pin and record the same explicit `light` or `dark` theme. `system` MUST NOT serve as a visual baseline because it resolves from device preference. Only then may reviewers compare rendering and record device, operating system, browser, display, and color-management context.
>
> The governed delivery SHOULD serialize SDR colors in explicit sRGB and request explicit sRGB gradient interpolation where supported, with a tested sRGB-compatible fallback. Explicit sRGB is secondary renderer stabilization: it reduces avoidable interpolation ambiguity after parity is established, but it MUST NOT substitute for registry/build/hash proof, conceal stale delivery, or claim identical physical display output.

This candidate contract does not change the owner-approved v0.8.8 authoring master, mint new color tokens, or promote the carried v0.8.6 token/scale registries to gated v0.8.8 package conformance.

## Implementation disposition for the current webpage

| Finding | Disposition |
|---|---|
| proof metadata and next-action contrast | artifact fix |
| malformed recipe item 4 indent | artifact fix + semantic ordered-list pattern |
| Brand DNA/Voice Before/After value | artifact fix + reusable skill |
| Thai device-dependent fallback | artifact fix now; normative clarification proposed |
| complete color teaching plates | artifact/reference fix; coverage rule proposed |
| all nine sequential/diverging families at exact 5/7/9 classes | artifact/reference fix; generated-scale teaching rule proposed |
| universal stroke widths and overlap blending | remain candidate; no normative claim |
| source Search versus AI synthesis/follow-up | artifact fix + contextual-discovery contract proposed |
| header lockup used as favicon | artifact fix now uses the separately approved transparent compact symbol for browser-tab duty only; cross-context browser-identity record proposed |
| SEO/AI/agent metadata collapsed into one claim | artifact/release-record fix + discovery-state contract proposed |
| inconsistent button radii | artifact fix for action controls; semantic capsule/circle geometry proposed |
| cross-device Color Set mismatch described as display shift | artifact registry/build-parity clarification + immutable QA/handoff URL; normative delivery contract proposed |
