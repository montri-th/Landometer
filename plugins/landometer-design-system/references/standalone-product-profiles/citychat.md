# CityChat Add-on 0.9.2 — for LDS 0.9.5

**Required foundation:** [Landometer Design System 0.9.5 — complete base normative](https://montri-th.github.io/Landometer/v0.9.5/normative/Landometer-Design-System-v0.9.5.md). For a product Project Source, upload the base Markdown and this Add-on Markdown: two design files. Do not upload a duplicated combined product/base file.

**Product rule identity:** CityChat Add-on `0.9.2`. **Consolidation:** `standalone-0.9.5-r2`, 30 September 2026. All CityChat-specific design rules and product machine values are written inline in this Add-on. Use it alongside the separate complete LDS 0.9.5 base normative, which contains the shared foundation and exact shared machine values. This Add-on does not embed or replace that base. No older LDS master or predecessor CityChat Add-on is required. This consolidation does not change product version, rights, capabilities or evidence.

The current parent identity is LDS `0.9.5` / `v0.9.5-owner.1` / `color-srgb-08`, an unsigned owner-approved distribution. Old design files and eight-plus-one installation instructions are superseded for new work. Source hashes remain in the product metadata for audit only. An upload does not prove that every client, account, team or live artifact has passed installation or conformance checks.

This document governs **CityChat-specific** identity, voice, story, data-to-action patterns, and release constraints. The separate complete LDS 0.9.5 base normative governs shared color, type, controls, focus, icon axes, motion, navigation, accessibility, and analytical-scale roles. A product/data contract governs data claims; an authoritative service governs persistence and official status; an asset registry governs file rights and approved use. Dated owner instructions prevail. If a source is missing or conflicts with the relevant authority, report the conflict and block the affected claim or asset rather than inventing a substitute.

## 1. CityChat promise and scope

CityChat should show a living city quickly: **place → what is known → what people say → useful action → what changed**. Show the first meaningful place or story before requesting login or personal data. Ask one useful question and present no more than one primary action per scene. Explain what pressing it does. Remember a contribution only after the receiving system confirms it. Invite people back when the same matter changes materially, not to create engagement for its own sake.

Three connected surfaces may share a case but must not pretend to have the same authority:

| Surface | Job | Boundary |
|---|---|---|
| CityScan | Explore a place through three questions and inspect CityCells | Exploration is not a municipal determination or investment advice. |
| Public CityChat | Turn a selected place or CityCell into a human story and one possible contribution | A preview or local draft is not a submitted case. |
| Officer CityMETER | Review the same case, evidence, citizen account, and work to check | Official status and assignments require the owner system's confirmation. |

Carry the same `caseId`, `contextRef`, `snapshotRef` when data is shown, `topicId`, `responseVersion`, and place/time context across eligible surfaces. Preserve source, coverage, freshness, limitation, and object/version through any handoff. Access and disclosure follow the owning system's permissions.

## 2. CityChat identity and inherited work

- Keep CityChat's approved pin/meter mark, wordmark, conversation motif, graphic personality, local storytelling, and warm human voice. The CityChat lockup is locked artwork: use exact approved bytes for the permitted surface; never retype, crop, filter, recolor, mask, animate, or reconstruct it from a screenshot. Do not substitute a Landometer, ijji, or other product identity. An old exact-build approval does not automatically approve a new use.
- `ConversationMotif` represents a city in conversation on welcome, invitation, empty, receipt, or calm success surfaces. It is not a second logo, data evidence, functional icon, or proof of success. Meaningful text remains live text; decorative artwork has empty alt text.
- `TopicMark` communicates a content category with a visible label. It never encodes a score, magnitude, evidence quality, or official state by shape or color alone. Interface controls instead use the approved LDS Material Symbols Rounded subset with `FILL 0`, `wght 300`, `GRAD 0`; icon-only actions require accessible names. Add a missing glyph to the product-owned subset with its exact font bytes, role, and approval before use.
- One illustration family per release. Figma, Drive, screenshot, and archive files are design evidence, not production asset URLs or token authorities. For every runtime asset, record source, creator, rights, allowed modification and publication, adoption decision, exact repository bytes/hash, approved roles/surfaces, accessible treatment, and fallback. A `candidate` or `reference_only` item cannot be rendered as approved artwork.
- CityChat personas may preserve the original citizen/municipal-officer relationship only when their per-file rights and role records permit it. Do not change skin tones or turn participation art into a rank, badge, or evidence. Municipality seals require signed LOI scope, provenance, consistent normalized presentation, and truthful names. Partner marks use the rendition for the **actual surface**, not just the page theme.

Asset adoption decisions are `retain_exact`, `retain_principle`, `adapt_as_citychat_asset`, `rebuild_with_lds`, `reference_only`, or `retire`. Legacy palette, TapBlue, fixed-width controls, arbitrary shadows, stock-like images without rights, generic icons from old libraries, old UI screenshots as runtime UI, and old-version/archive screens are not current implementation references.

## 3. Voice and information architecture

Write like a person speaking to another person: short, clear, warm, place-first, and aware of what the evidence can support. One message has one main intent. Prefer **what/where/when → next useful action**. In Thai, examples of action labels include `ดูข้อมูลแถวนี้`, `เล่าให้เทศบาลรู้`, `เช็กข้อมูล`, and `ติดตามเรื่องนี้`. English is authored naturally, not translated word for word. Say what happens after an action and who can see a contribution before people submit it.

Keep the good LDS brand voice carried into 0.9.5: calm, clear, evidence-aware, civic-minded, and action-capable. Product copy must not expose internal terms such as `fixture`, `schema`, `claim ceiling`, `runtime`, `agent`, `confidence`, package hash, or QA code. Avoid claims such as “real-time,” “resolved,” or “received” unless the actual source/service confirms them. `ยังไม่มีข้อมูลส่วนนี้` means unavailable; it is not zero. A mock example must be visibly identified as an example, never styled as live municipal data.

Navigation shows CityChat identity and an understandable path to related Landometer products. Keep direct controls within the LDS budget (desktop at most four including brand; mobile at most two including brand), 44px interactive targets where the component calls for them, semantic disclosures, visible focus, Escape dismissal, and working destinations. A floating bookmark rail may remain on the **right** when justified, outside the backdrop-filtered nav. **Do not use decorative bracket-shaped selection highlights or colored left-rail accents** on selected navigation, tabs, cards, or callouts. Use restrained surface, type weight, and spacing; preserve meaningful chart/table borders and keyboard focus outlines.

## 4. CityScan and CityCell

CityScan has exactly these three entry intents, never a single CityScore:

| Topic ID | Thai question | Examples and limit |
|---|---|---|
| `daily_life` | **แถวนี้น่าอยู่ยังไง** | Nearby services, daily needs, nature, and activities. A place count does not prove access, quality, safety, or use. |
| `visitor_identity` | **น่าเที่ยวตรงไหน** | Food, accommodation, and places to visit. Reviews and listings describe their own source; hotel count is not visitor volume or occupancy. |
| `local_activity` | **น่าค้าขายอะไรดี** | Residents, households, workplaces, and schools are context, not customers or purchase intent. Visitor count remains unavailable unless evidenced. Never present an investment recommendation. |

Every CityCell has a stable ID, plain label, `presentationKind` (`observation`, `proxy`, `question`, `unavailable`), `valueState` (`observed`, `observed_zero`, `unknown`, `out_of_coverage`, `stale`, `not_applicable`, `suppressed_privacy`), source/evidence reference for a claim, public meaning, claim level, and forbidden claims. Differentiate unknown, zero, no-data, stale, suppressed, and outside scope with text and cues beyond color. A CityCell is a public meaning unit, not a spatial/H3 cell, metric, or evidence capsule. A StoryCell opened from it holds **one main signal, at most three verifiable facts, at most one meaningful question, and at most one allowed action**.

Use the exact LDS 0.9.5 machine color package for UI, semantic state, categorical, and analytical scales. Do not use identity or atmosphere color as a metric scale. For density, select the approved hot family by denominator: area **orange**, per population **rose**, per household **scarlet**, per building area **gold**. Legend states denominator, unit, source, and coverage; use the approved LUT/class set, not a visually improvised gradient. The current categorical-on-dark set is from 0.9.5; the light set is retained. Color does not prove a dataset's correctness or eligibility.

## 5. Patterns from a place to an outcome

| Pattern | Required content | Must not imply |
|---|---|---|
| `StoryInviteCard` | Matter, place, useful inviter/agency, date or freshness, one action and its result | Multiple competing CTAs or official status without source |
| `EvidenceConversationSwitch` | Same case/context for `ข้อมูล` and `ห้องแชท`; data side has source/freshness/unknown, people side labels contribution as a person's account | Citizen account equals official observation |
| `PlaceContextPicker` | Current location after explanation, confirmed map pin, or an actually saved area where supported; common visible place and `placeRef` | All location methods have equal precision |
| `CivicAction` | One allowed action, destination or result, and recovery | A dead CTA or hidden missing capability |
| `ContributionReceipt` | What persisted, when, who can see it, and a checkable reference | Illustration, animation, or a local draft proves submission |
| `ParticipationMilestone` | Contribution with authoritative receipt and a useful next step | Leaderboard or popularity sets civic priority |
| `OutcomeReturn` | Material change in the same matter and the next relevant action | Engagement notification without change |

The civic loop is **SEE → UNDERSTAND → ANSWER/ACT → KNOW THE RESULT → RETURN FOR CHANGE**. Preserve entered text on submission failure and provide a retry. The words `ส่งแล้ว`, `บันทึกแล้ว`, `รับเรื่องแล้ว`, `มอบหมายแล้ว`, or `ปิดแล้ว` are reserved for the corresponding authoritative confirmation. Scores, streaks, badges, and popularity cannot determine civic priority.

For signed municipal LOI stories, derive every municipality name, number, date, and KPI from the verified LOI analysis or newer authoritative record. A seal is shown only within its signed scope. A 12-month offer may state the five validated items (GIS datasets, dashboard, household/vulnerable-group location, risk/report location, and training) only while the offer/source remains current; do not reinsert a removed API/Open Data promise. Recompute remaining places from the verified signed-LOI count before publication. A product screenshot is `ui_capture`, with a caption that distinguishes shown location from observed real-world status.

## 6. LDS bindings and surface behavior

- Resolve shared UI values from the exact LDS 0.9.5 tokens, scales and CSS supplied by the machine payload and current build kit. Do not copy `color-srgb-05`, old build-kit paths, or arbitrary hex values into current roles. CityChat adds product roles without redefining LDS tokens.
- The **approved CityChat identity gradient** is light theme `#007A58 → #007E79` and dark theme `#3BD19B → #3BD3CB`. Its readable ink, line, focus, metadata, and lockup rendition follow the **actual gradient surface**. Do not use a canvas text token there or re-purpose this gradient as data encoding. LDS atmosphere gradients are separate and never represent a metric or status.
- LDS typography uses exact approved font assets and roles: Arvo / IBM Plex Sans Thai Looped for display, Bai Jamjuree for body/UI, JetBrains Mono / IBM Plex Sans Thai for technical data, and the approved Material Symbols Rounded subset for interface icons. Use build-kit roles for sizes and geometry; validate Thai marks, long words, 200% zoom, and English expansion in real renders.
- Keep first value, evidence, and the primary action readable in source HTML. Supporting approach motion may use LDS roles only where it helps orientation; never gate the hero, navigation, h1, truth label, or first action. Current LDS 0.9.5 permits replay after a full viewport exit, with lifecycle safeguards, or `none`. Reduced motion, no JavaScript, observer failure, deep-link focus, and history restore show the final content. Avoid parallax, count-up claims, ambient loops, and motion that implies live data.
- Historical `CC-EX-01` (looping CTA sweep/flicker) is **retired for new work**. Where a primary *navigational* CTA needs discovery, LDS `motion.cta.discovery-cue.01` is a single 540ms cue per page load, pointer-inert and removed by reduced motion. Do not use it for consequential submissions. `CC-EX-02` (logo bubbles) remains limited to the exact asset, build, role, and approval record; it grants no general logo-animation permission.
- A video must have controls, `muted`, `playsinline`, metadata preload, a supported delivered codec, and readable failure fallback. A missing video does not leave a blank box. Hero imagery loads eagerly; other media can load lazily.

## 7. Handoff record and release gate

A CityChat scene record extends the LDS Build Card. It must identify `sceneId`, audience/surface/job, `caseId`, `contextRef`, `placeRef`, time context, `snapshotRef` when showing data, `responseVersion`, `topicId`, LDS release and Add-on references, one first meaning, zero or one question, zero or one primary action, immediate consequence/result, receipt reference when claiming persistence, asset and component references, locale/content source, truth boundary, states, and `blockedReasons`. This is a **human field map**, not a claimed executable JSON Schema. Machine clients must not infer a token, glyph, metric, threshold, permission, or service state from a screenshot.

Before releasing, verify the LDS package exact bytes and hash; current CSS/font/asset closure; approved role and rights of each CityChat file; TH/EN voice and claims; both themes; narrow and desktop widths including 320, 390, 1024, 1280, and 1440px; 200% zoom; focus/keyboard; reduced motion; no-JavaScript final content; menu; CTA; media fallback; all new sections; download links; and authoritative receipt/LOI facts. Inspect **actual rendered** Thai and English for squeezed headings, overlapping text, horizontal overflow, bracket accents, and left rails. Automated tests and matching hashes are evidence, not full artifact conformance.

Record the exact build, scope, assets, tests, observed render, unresolved limitations, and any exception approval. The website is a product landing, not proof that a CityScan backend, official service, rights record, or team-wide AI client installation exists. Historical CityChat design documents are cancelled as active instructions for new work and retained only for audit. The retired looping CTA exception remains unavailable.
