---
name: apply-landometer-design-system-v0-8-9
description: Apply or audit the owner-approved Landometer Design System v0.8.9-r1 human-readable authoring master in local design, content, presentation, data, and interface artifacts. Use when the user explicitly requests v0.8.9 or invokes this skill; require Build Card 0.8.9 and exactly one profile, preserve shared-versus-product evidence boundaries, and report package and artifact gates honestly. Do not claim generated machine-package conformance while its schemas, manifests, recipes, fixtures, hashes, rule ledgers, and preflight remain pending; do not publish or create external effects.
---

# Apply Landometer Design System v0.8.9

Use the bundled integrated authoring master as the only design-system authority supplied by this skill. It is owner-approved for human-readable authoring. It is not a completed generated machine package and cannot certify an artifact by itself.

## Start fail-closed

1. Read [references/release-lock.json](references/release-lock.json) completely.
2. Verify the SHA-256 values of every locked payload before using them. Stop on a mismatch.
3. Read [references/landometer-design-system-v0.8.9-authoring-master.md](references/landometer-design-system-v0.8.9-authoring-master.md) completely. Do not substitute memory, v0.8.6, v0.8.7, frozen v0.8.8, a webpage, or a proposal sidecar.
4. Accept only `dsVersion: 0.8.9`, Build Card `0.8.9`, Manifest `2.0`, and Token Schema `6`. Stop on another version rather than silently upgrading or downgrading.
5. For an authorized build or change, copy [assets/build-card-template.yaml](assets/build-card-template.yaml) into the work area and resolve it before generating the artifact. For a read-only audit, inspect the supplied Build Card in place; if it is absent, use the template only as a read-only checklist and report the unresolved fields. Do not create or modify a Build Card during an audit unless the user explicitly asks for that change.

## Resolve authority and scope

- Select exactly one Profile and load only the Trigger Packs activated by the resolved Build Card.
- Keep the shared Landometer layer product-neutral across Land, Location, and Living.
- Require a current approved Product Brief or Product Statement plus product-owned evidence before asserting product users, data, workflows, scores, models, permissions, availability, or outcomes.
- Compare products, places, or cities only under the same schema and release. Otherwise state the incompatibility and avoid false equivalence.
- Treat supplied identity, media, font, token, and approval records as hash- and scope-specific. Custody never grants permission or cross-context approval.

## Apply the approved v0.8.9-r1 authoring authority

Use the owning rules in the integrated master, especially:

- `[BRAND-01]`: preserve the exact Cultural activation from Master Brand Brief v0.5.2 §1.1 — `Let us cultivate our city with data.` Never remove `with data` or substitute the earlier shortened reconciliation.
- `[VALUE-PROOF-01]`: keep one work object and its evidence constant while making DNA, Voice, or Visual value observable; never make the baseline inaccessible to make the assisted state look better.
- `[SURFACE-01]` + `[A11Y-01]`: fixed flat, photo, gradient, scrim, and panel surfaces own complete local foreground contracts across theme, locale, state, and narrow layouts.
- `[TYPE-01]` + Appendix A11: use JetBrains Mono 400 for Latin/numerals and IBM Plex Sans Thai 400 for Thai technical glyphs; retain Bai Jamjuree for body/UI and the separate 700-weight display families.
- `[FLOW-04]` + `[REFERENCE-01]`: teach visual and quantitative rules with directly labelled specimens, then disclose evidence, boundaries, and rationale.
- `[REFERENCE-01]`: show complete role-labelled color coverage and every governed sequential/diverging family in both themes at exact 5/7/9 classes from a generated or explicitly carried LUT.
- `[CONTEXT-01]`: distinguish Source Search from named-provider AI synthesis/follow-up; preview the exact editable public-safe query or prompt and keep returned material `discovery_only` until sources are checked.
- `[LOGO-SURFACE-01]` + `[PUB-01]`: treat header, tab, search-result, social, touch, and maskable identity as separate approved contexts.
- `[PUB-01]` + `[AGENT-OUT-01]`: report direct machine readability, search discovery, AI-search discovery, and agent readability/action separately. Readability never grants permission to act.
- `[CTRL-02]`: use the approved capsule family for text-labelled and icon-plus-label actions, circles for icon-only utilities, and semantic geometry for cards, fields, tabs, segments, rows, and disclosures.
- `[DELIVERY-01]` + `[REFERENCE-01]`: prove Color Set, artifact build, token/scale registry hashes, artifact hashes, and explicit light/dark theme before cross-device color review.

## Preserve explicit gaps

Do not invent or present as v0.8.9:

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
4. Use exact Appendix A authoring values. Do not copy the carried v0.8.6 token/scale files and relabel them v0.8.9.
5. Verify responsive behavior, keyboard/focus, contrast, reduced motion, blocked-network fallback, local foreground contracts, identity context, and artifact/hash parity in proportion to the delivery.
6. Record every unresolved approval and manual gate. Never upgrade `source_limited`, `partial`, `modelled`, `planned`, `discovery_only`, or `machineValidation: pending` without the required evidence.

## Deliver

Return:

1. the completed Build Card or an exact list of unresolved fields;
2. the artifact or audit result;
3. applied Profile, Trigger Packs, and rule IDs;
4. shared/product evidence boundaries and incompatible comparisons;
5. automated checks, manual checks, and remaining P0/P1/P2 gates;
6. the explicit statement that generated v0.8.9 machine-package conformance remains unclaimed until the package listed in the release lock is regenerated and validated.

Stop before publishing, deployment, external messaging, remote mutation, analytics, or another external effect. A separate explicitly authorized workflow must perform those actions.
