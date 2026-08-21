---
name: apply-landometer-design-system-v0-9-0
description: Apply or audit the owner-approved Landometer Design System v0.9.0-r6 human-readable authoring master in local design, content, presentation, data, and interface artifacts. Use when the user explicitly requests v0.9.0 or invokes this skill; require Build Card 0.9.0 and exactly one profile, copy the Appendix E Deterministic Build Kit bytes verbatim for web builds, run the [SELFCHECK-01] self-check before delivery, preserve shared-versus-product evidence boundaries, and report package and artifact gates honestly. Do not claim generated machine-package conformance while its schemas, manifests, recipes, fixtures, hashes, rule ledgers, and preflight remain pending; do not publish or create external effects.
---

# Apply Landometer Design System v0.9.0

Use the bundled integrated authoring master as the only design-system authority supplied by this skill. It is owner-approved for human-readable authoring (approved 20 August 2026, recorded in §C9). It is not a completed generated machine package and cannot certify an artifact by itself.

## Start fail-closed

1. Read [references/release-lock.json](references/release-lock.json) completely.
2. Verify the SHA-256 values of every locked payload before using them. Stop on a mismatch.
3. Read [references/landometer-design-system-v0.9.0-authoring-master.md](references/landometer-design-system-v0.9.0-authoring-master.md) completely. Do not substitute memory, v0.8.6, v0.8.7, frozen v0.8.8, frozen v0.8.9, a webpage, or a proposal sidecar.
4. Accept only `dsVersion: 0.9.0`, Build Card `0.9.0`, Manifest `2.1`, Token Schema `6`, and Color Set `color-srgb-04`. Stop on another version rather than silently upgrading or downgrading. Manifest 2.0 and Color Sets `color-srgb-03` / `color-srgb-02` / `color-srgb-01` stay readable historical evidence and MUST NOT be emitted as current conformance.
5. For an authorized build or change, copy [assets/build-card-template.yaml](assets/build-card-template.yaml) into the work area and resolve it before generating the artifact. For a read-only audit, inspect the supplied Build Card in place; if it is absent, use the template only as a read-only checklist and report the unresolved fields. Do not create or modify a Build Card during an audit unless the user explicitly asks for that change.

## Build deterministically

v0.9.0 exists because the same master produced materially different results per build and per builder. Determinism is normative, not a preference.

1. `[KIT-01]` Appendix E: for any web artifact, copy `lds-tokens.css`, `lds-base.css`, and `skeleton.html` **byte-for-byte** from Appendix E. Do not re-derive theme init, focus rings, button geometry, token names, or receipt markup by hand. Extend the kit only in a separate layer that never redefines a kit token or selector.
2. `[SELFCHECK-01]` §9.6 + Appendix E4: run the nineteen-row binary self-check before delivery and ship the result rows in the artifact manifest. Every row is pass or fail — never "partial". A failed row blocks the delivery claim, not the delivery description.
3. `[BTN-GEOM-01]` §6.2A: every activatable control resolves to exactly two shapes — a capsule for text or icon-plus-label actions, a 44 × 44 circle for icon-only utilities. A third action radius is a failure. Cards, fields, tabs, segments, rows, and disclosures keep their own semantic geometry.
4. `[ICON-01]` §5.7A: Material Symbols Rounded only, locked axes `FILL 0, wght 300, GRAD 0, opsz 24`. No second icon family, no inline decorative SVG icon, no sprite `<use>`. Subset and self-host for offline artifacts.
5. `[VIS-04]` §5.6: no decorative edge rail, bracket spine, or ornamental frame border. Carry structure with governed surface, spacing, and type scale.

## Resolve authority and scope

- Select exactly one Profile and load only the Trigger Packs activated by the resolved Build Card.
- Keep the shared Landometer layer product-neutral across Land, Location, and Living.
- Require a current approved Product Brief or Product Statement plus product-owned evidence before asserting product users, data, workflows, scores, models, permissions, availability, or outcomes.
- Compare products, places, or cities only under the same schema and release. Otherwise state the incompatibility and avoid false equivalence.
- Treat supplied identity, media, font, token, and approval records as hash- and scope-specific. Custody never grants permission or cross-context approval.

## Apply the approved v0.9.0-r6 authoring authority

v0.9.0-r6 inherits the complete v0.8.9-r1 rule set. No v0.8.9 rule is removed; the only rename is `[SEARCH-01]` → `[INTERNAL-SEARCH-01]` (§7.6), with the old ID a deprecated alias for one release. Use the owning rules in the integrated master, especially:

- `[BRAND-01]` §3.2: preserve the exact Cultural activation from Master Brand Brief v0.5.3 §1.1 (verified 2026-08-20 carried unchanged from v0.5.2 §1.1) — `Let us cultivate our city with data.` Never remove `with data` or substitute the earlier shortened reconciliation.
- `[VALUE-PROOF-01]`: keep one work object and its evidence constant while making DNA, Voice, or Visual value observable; never make the baseline inaccessible to make the assisted state look better.
- `[SURFACE-01]` + `[A11Y-01]`: fixed flat, photo, gradient, scrim, and panel surfaces own complete local foreground contracts across theme, locale, state, and narrow layouts. Governed atmosphere is default-present, not optional decoration.
- `[TYPE-01]` + Appendix A11: use JetBrains Mono 400 for Latin/numerals and IBM Plex Sans Thai 400 for Thai technical glyphs; retain Bai Jamjuree for body/UI and the separate 700-weight display families.
- `[MEDIA-LADDER-01]` §4.4A + `[DISCLOSURE-01]` §4.4B: lead with video, then image, then icon or symbol, then text. In a human-facing first view, show no caveat, caution, limitation, or `source_limited` prose before interaction — put every such statement behind an explicit disclosure the reader opens. The collapsed state must still answer the reader's question.
- `[LAYER-FIELD-01]` §5.6B: express problem complexity with named translucent overlapping fields, never with unlabelled decoration.
- `[CATEGORY-ID-01]` §5.6: give each category a persistent icon **and** color; the icon takes the category's `series.*` or pillar color while its label stays in the text role.
- `[COLOR-01]` §5.6 + §C9: the 2026-08-20 purge retires all purple and brown tones. Ten values are replaced and Color Set `color-srgb-03` is minted; the same-day owner amendment of the ijji/CityWiki product identity gradients then mints `color-srgb-04` (ijji light aliases `atmosphere.gradient.ground.mist`, CityWiki light aliases `atmosphere.gradient.cultivate.mist`, CityWiki dark adds `#E0B443`). Never reintroduce a retired value into a live token, LUT, class cell, gradient stop, or surface.
- `[FLOW-04]` + `[REFERENCE-01]`: teach visual and quantitative rules with directly labelled specimens, then disclose evidence, boundaries, and rationale.
- `[REFERENCE-01]`: show complete role-labelled color coverage and every governed sequential/diverging family in both themes at exact 5/7/9 classes from a generated or explicitly carried LUT.
- `[MOTION-01]`: use the named Riddim signature. Durations are unchanged from v0.8.9; only two easing tokens are new. Reduced motion lands the final meaning immediately.
- `[HOOK-01]` §7.16, `[XPRODUCT-01]` §7.17, `[WEB-DISCOVERY-01]` §7.18, `[TOOL-HANDOFF-01]` §7.19: growth packs are honest by construction. A hook must reward before it requests, a cross-product path must match stated intent, a free-tool handoff must preserve the truth label, and discoverability must not manufacture claims.
- `[ABUSE-INTEGRITY-01]` §7.4A: direct-send, post, invite, co-creation, and feedback-learning surfaces require the abuse and integrity gate before they ship.
- `[CONTEXT-01]`: distinguish Source Search from named-provider AI synthesis/follow-up; preview the exact editable public-safe query or prompt and keep returned material `discovery_only` until sources are checked.
- `[LOGO-SURFACE-01]` + `[PUB-01]`: treat header, tab, search-result, social, touch, and maskable identity as separate approved contexts. Ship the release receipt, per-page favicon truth, and per-destination social previews; test previews against the real destination URL, never a local render.
- `[PUB-01]` + `[AGENT-OUT-01]`: report direct machine readability, search discovery, AI-search discovery, and agent readability/action separately. Readability never grants permission to act.
- `[CTRL-02]`: use the approved capsule family for text-labelled and icon-plus-label actions, circles for icon-only utilities, and semantic geometry for cards, fields, tabs, segments, rows, and disclosures.
- `[DELIVERY-01]` + `[REFERENCE-01]`: prove Color Set, artifact build, token/scale registry hashes, artifact hashes, and explicit light/dark theme before cross-device color review.

## Preserve explicit gaps

Do not invent or present as v0.9.0:

- universal chart axis/grid/data/focus stroke widths;
- a universal solid/dashed/dotted evidence convention;
- a general overlap blend/compositing algorithm;
- a fixed depth-role-to-opacity-role mapping;
- a `TlwgMono` active role;
- universal optical tuning metrics or unapproved identity assets.

Use governed map tokens where applicable, declare connector meaning locally, label intersections directly, and mark illustrative widths or experimental mappings `candidate`.

## Build and audit

1. Preserve one dominant governed object, truth status, source/date, boundary, limitation, allowed use, and next useful action or clean completion.
2. Apply only the selected Profile and triggered rules; do not turn reference fixtures into product capabilities.
3. Keep Thai and English as sibling drafts from the same evidence, not word-for-word translations.
4. Use exact Appendix A authoring values and the Appendix E kit bytes. Do not copy the carried v0.8.6 token/scale files and relabel them v0.9.0.
5. Verify responsive behavior, keyboard/focus, contrast, reduced motion, blocked-network fallback, local foreground contracts, identity context, and artifact/hash parity in proportion to the delivery.
6. Record every unresolved approval and manual gate. Never upgrade `source_limited`, `partial`, `modelled`, `planned`, `discovery_only`, or `machineValidation: pending` without the required evidence.

## Deliver

Return:

1. the completed Build Card or an exact list of unresolved fields;
2. the artifact or audit result;
3. applied Profile, Trigger Packs, and rule IDs;
4. the `[SELFCHECK-01]` result rows, each pass or fail;
5. shared/product evidence boundaries and incompatible comparisons;
6. automated checks, manual checks, and remaining P0/P1/P2 gates;
7. the explicit statement that generated v0.9.0 machine-package conformance remains unclaimed until the package listed in the release lock is regenerated and validated.

Stop before publishing, deployment, external messaging, remote mutation, analytics, or another external effect. A separate explicitly authorized workflow must perform those actions.
