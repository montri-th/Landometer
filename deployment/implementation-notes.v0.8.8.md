# Landometer Design System v0.8.8 — Implementation clarifications

**Status:** Proposed artifact-level clarification  
**Authority:** Non-normative until incorporated into an owner-approved Design System release  
**Applies to:** The v0.8.8 Design Identity Playground implementation  
**Preserves:** `[CORE-03]`, `[CORE-10]`, `[CTRL-01]`, `[STATE-01]`, `[SHARE-01]`, `[CONTEXT-01]`, `[PUB-01]`, and `[AGENT-OUT-01]`

This note makes four implementation clarifications explicit without changing the byte-identical v0.8.8 authoring master.

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

### Label

The action label names the immediate consequence and destination.

- Thai: `ค้นคำนี้ต่อใน Google`
- English: `Continue this query in Google`

Do not use `See more`, `Explore`, or another destination-free label when the action opens an external search engine.

### Interaction contract

1. derive the query from the current governed context when the product has it;
2. preserve the active object or event name, public-safe place hierarchy, selected topic, current intent, and semantically useful active filters;
3. show the exact composed query and the context fields that supplied it before any request;
4. let the user inspect or edit the query;
5. remove private filters, identities, notes, customer criteria, sensitive locations, restricted IDs, and filter values that are not safe or useful outside the product;
6. send the query only after an explicit user action;
7. keep the current work state available when the external result opens;
8. identify the external destination and provide a copyable-query fallback when useful;
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

For example, a CityMETER-specific Disaster view may compose the active event name, the selected `ยอดผู้เสียชีวิต` field label, and the current public place hierarchy into a news query. The product must take those values from its governed runtime context. A design-system fixture uses synthetic event data and must not invent a real event, casualty value, or product capability.

When a synthetic event is paired with a real public place for training, the context snapshot and the outbound query must both say that the event is synthetic and not real. The fixture must not imply that an incident, fatality, or other outcome occurred in that place.

External search is not sharing and does not prove a network effect. It must not replace the primary decision or action, appear before the promised AHA, or silently broaden the governed object.

### Product boundary

The shared Landometer layer owns the visible-query, privacy, navigation, recovery, and evidence-promotion contract. Each product owns the supported entity × intent pairs, query construction, allowed providers, sensitivity rules, review workflow, and whether discovered material may be incorporated.

Relevance is an inspectable design hypothesis, not a superiority claim. Before claiming that contextual composition outperforms another approach, compare a declared baseline and assisted query on the same intent set, record top-result usefulness or another governed outcome, and keep irrelevant/counter-results visible.

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

Do not switch to indexable public delivery by changing `robots` alone. Promotion requires verified public visibility and permissions, reachable canonical locale URLs, per-locale initial HTML and metadata, an approved social-preview asset, truthful structured data, private-state stripping, and completed release gates.

An `llms.txt` file may provide a concise navigation aid to public-safe sources. It is not a ranking signal, access-control rule, permission grant, conformance claim, or substitute for semantic HTML and validated machine records.
