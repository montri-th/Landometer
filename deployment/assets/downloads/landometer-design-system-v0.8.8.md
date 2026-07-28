# Landometer Design System v0.8.8

**Release:** v0.8.8  
**Manifest version:** 2.0 — unchanged  
**Token schema version:** 6 — unchanged  
**Build Card schema version:** 0.8.8  
**Status:** Owner-approved simplified normative authoring master; the v0.8.8 public-safe machine package, release lock, source fingerprint, rule ledger, schemas, recipes, and preflight MUST be regenerated before package-level v0.8.8 conformance is claimed  
**Prepared:** 25 July 2026  
**Supersedes:** Landometer Design System v0.8.7 for human-readable authoring. The frozen v0.8.7 package and earlier packages remain read-only migration and compatibility evidence. v0.8.8 retains Manifest 2.0 and Token Schema 6, adds no raw color value, Profile, Trigger Pack, optional capability, menu, mode, or default-route scene, and introduces composition records for perceptual quiet, governed atmosphere surfaces, and semantic connectors. Package-level validation never certifies an individual implementation: every artifact must still pass its applicable Build Card, asset, evidence, browser, accessibility, privacy, composition, and effect gates.  
**Audience:** every Landometer function, including Product, Design, Engineering, Marketing, Content, Data/Evidence, QA, Sales/Business, Operations, and AI coding agents  
**Products:** Landometer, CityMETER, CityWiki, CityChat, and ijji  
**Primary outcome:** Make every Landometer experience unmistakably Landometer, easy to use, grounded in truth, and able to move a person from understanding to useful action without losing meaning between teams.

> **Active cultural invitation: Let us cultivate our city.**

This release keeps the simplified architecture introduced in v0.8.6 and the native-language and identity corrections integrated in v0.8.7. It corrects a visual interpretation failure exposed by the first v0.8.7 implementation: quiet was turned into a visible filler object, useful photography was reduced to a side card, governed gradient atmosphere disappeared, and connector lines implied relationships without explaining them. v0.8.8 defines quiet as a perceptual attention condition, allows dominant full-bleed media and deterministic gradient/scrim support, restores functional brand-atmosphere surfaces, and permits connectors only when they encode a real relationship.

Dense proof inventories, labs, schemas, release evidence, voice fixtures, identity evidence, surface recipes, and connector records remain available without becoming visible UI merely because the design system governs them.

Authority is domain-split, not one flat rank:

1. current owner amendments dated 21–25 July 2026 govern the amended outcome: simplify the active source, release unmistakable positive Landometer energy, use **Let us cultivate our city.**, write Thai from meaning and evidence rather than translated sentence structure, prefer an approved transparent logo directly on its governed surface, treat quiet as perceptual calm rather than a blank component, keep useful photography large, use governed gradient atmosphere to direct attention, and remove connector lines that do not encode a real relationship;
2. the current approved Master Brand Brief governs Brand Statement, DNA, Promise, Voice, and claim boundaries except where the amendment above is explicit;
3. the applicable approved Product Brief or Product Statement governs product-specific users, decisions, data, workflows, actions, limits, availability, and outcomes;
4. this v0.8.8 master governs how those truths become native-language communication, visual hierarchy, composition, interaction, accessibility, responsive behavior, tokens, states, profiles, schemas, and QA; it MUST NOT invent or override brand/product truth outside its explicit amendments;
5. approved official assets and their permission, variant, hash, and usage records govern the actual pixels/files;
6. Brand Visual Guidelines 2025 governs identity lineage, approved color origin, approved asset forms, minimum print width, and font-family lineage; v0.8.8 governs active semantic roles, logo–surface decision logic, perceptual quiet, governed atmosphere surfaces, relationship integrity, and supersedes its page-level color quota without approving a particular asset file by implication;
7. Onboarding supplies culture evidence for end-user focus, action, learning, collaboration, ownership, field truth, curiosity, commitment, and good energy;
8. Introduction, GTM, photographs, posters, and earlier work are contextual or historical evidence only. Earlier successful gradients MAY inform atmosphere only through the exact recipes and jobs governed here; earlier decorative connector lines create no current exception;
9. Landometer Design Systems v0.8.5, v0.8.6, and v0.8.7 are migration/reconciliation sources for retained intent and exact migrations, not simultaneous active configurations; any unmapped rule is a migration defect, not silently inherited runtime authority;
10. the v0.8.5 Mission Lab HTML remains a failed density/control regression fixture. The first v0.8.7 Living Reference implementation is a separate regression fixture for font delivery, locale display, literal quiet blocks, reduced photography, missing atmosphere, and non-semantic connectors; neither is a composition template.

The older Brand Visual Guidelines instruction to place at least three secondary colors on every page is superseded by semantic color ownership and perceptual quiet. Dense pages within Introduction and GTM, plus hiring-poster and pitch pages, preserve their original pixels as historical evidence; they do not create current density, copy, photo, palette, font-role, gradient, or connector exceptions. Their successful large color fields, photographic crops, and quieter milestone/phase pages MAY inform rhythm only when the current source, contrast, media, surface, and QA rules pass.

---

## 0. Why v0.8.8 exists

### 0.1 v0.8.7 foundation and remaining visual regressions

The v0.8.6 audit correctly found that source complexity contributed to the failed v0.8.5 page, but it was not the only cause. Its simplified architecture remains the foundation of v0.8.8, and v0.8.7 retained that architecture while correcting native-Thai authoring and logo–surface ambiguity.

| Evidence | Finding |
|---|---:|
| v0.8.5 normative master | 6,847 lines, 42,753 words, 397 headings, 154 fenced blocks, 709 table rows |
| v0.8.5 enforcement | hundreds of named preflight and evidence clauses; machine/release material occupied far more space than the default brand and product context |
| v0.8.5 HTML | 757,093 bytes; 6 main story sections; 4 role workbenches; 6 collaboration stages; 14 library patterns; 3 dialogs |
| First viewport | 18 interactive choices across header and hero before the reader received useful value |
| Static interface | 44 buttons and 13 links; roughly 84 buttons after dynamic panels rendered |
| Progressive disclosure | only 1 `details` element despite the amount of technical material |
| Localization | 604 exact-string translations and whole-DOM mutation, creating a fragile bilingual implementation |

The earlier master mixed brand story, product behavior, data governance, engagement, sharing, machine schemas, migration history, and release automation into one universal reading path. An AI generator treated every mechanism as independently visible and mandatory.

The v0.8.5 HTML then violated the source it claimed to demonstrate:

- changed protected Brand Blue from `#1D4497` to periwinkle `#7FA2F1` in dark mode;
- created unapproved hero and rainbow gradients;
- loaded critical fonts from Google in a portable single file;
- omitted design-system/profile attributes and source-coverage markers specified by its own schema;
- asked users to share before delivering the promised AHA;
- hid desktop navigation on mobile without a replacement;
- hid the critical “Next useful action” field below 470 px;
- exposed many routes and controls without restoring exact state in the URL;
- placed a technical card over a real team photograph, making people background decoration;
- invented “Mission Lab” as a sub-brand and led with abstract governance language.

v0.8.7 corrected two remaining source-level gaps:

- Thai copy could no longer pass merely by following English sentence structure, using abstract nouns, or compressing meaning to fit a layout;
- logo guidance separated the official asset, transparent canvas, surrounding surface, integral-background exception, and separately governed plate.

Its first implementation nevertheless exposed four connected composition regressions:

1. **Quiet became a visible object.** A tinted rounded column was inserted between copy and photography. It read as a third component instead of a calm attention field.
2. **Useful photography was made smaller.** The image was reduced to preserve a literal empty column even though crop, negative space, and a controlled overlay could keep it dominant.
3. **Governed gradient atmosphere disappeared.** Earlier successful large surfaces had established entry point, direction, rhythm, and brand recognition. Their removal weakened the reading start and made the page feel generic.
4. **Connector lines appeared without meaning.** Curves, dashed loops, and links implied sequence, data flow, or handoff without making the relationship understandable.

The correction is not to fill every surface with gradients or return to dense decorative pages. The correction is:

```text
perceptual quiet
+ dominant media at useful scale
+ governed gradient atmosphere
+ one clear reading path
+ connectors only when they encode a real relationship
```

### 0.2 Release response

v0.8.8 preserves the simplified architecture:

```txt
Build Card
→ Core Contract + Core Guidance (load in every build)
→ exactly one Profile
→ Trigger Packs only when their Build Card branch applies
→ Canonical Token Appendix
→ compact QA mapped to rule IDs
```

The ten Core rules remain written once. Detailed normative clauses are owned by the stable ID in their section heading; QA references those IDs instead of repeating prose. Optional capability defaults to `false`; an agent does not render a feature merely to prove that the design system knows about it. The full proof and coverage intent remains in the conditional Reference/Lab pack instead of crowding the adoption route.

v0.8.8 changes the composition decision order inside that architecture:

```txt
resolve the person, object, decision, evidence, and active language
→ write and review native-language copy
→ resolve exact logo, media, permissions, fonts, and surface pairing
→ preserve the subject; choose crop, focal position, and natural negative space
→ declare any quiet region, atmosphere surface, and semantic connector
→ compose the route and layout
→ load only applicable capabilities
→ run scoped truth, voice, identity, surface, relationship, accessibility, and delivery QA
```

It adds `[SURFACE-01]` and `[RELATION-01]`, replaces literal empty-space interpretation with perceptual quiet in `[SPACE-01]`, and adds composition records to Build Card 0.8.8. It adds no Profile, Trigger Pack, optional capability, raw color value, menu, mode, or default-route section. Manifest 2.0 and Token Schema 6 remain unchanged.

### 0.3 Normative language

Only these levels are used:

| Level | Meaning |
|---|---|
| **MUST / MUST NOT** | Release requirement. A failure blocks the applicable release. |
| **SHOULD / SHOULD NOT** | Expected quality. An exception needs an owner, reason, and expiry. |
| **MAY** | Optional. Omitting it is not a failure. |

`SHALL`, standalone “required,” and alternative normative vocabularies are retired. Within an applicable Rule, Trigger Pack, profile contract, cross-field gate, acceptance list, or QA gate, a direct imperative such as **Use**, **Show**, **Preserve**, **Strip**, **Record**, **Reject**, or **Prevent** inherits **MUST**. Descriptive examples and recommendations do not inherit it.

## 1. Build Card — complete this before vibe coding `[BUILD-01]`

An AI agent MUST receive a Build Card plus one selected Profile. Unknown optional capability resolves to `false`.

```yaml
landometerBuild:
  dsVersion: 0.8.8
  schemas:
    buildCard: 0.8.8
    manifest: 2.0
    tokens: 6
  legacyReadOnlyBaseline:
    authoringMasterVersion: 0.8.7
    manifestVersion: 2.0
    tokenSchemaVersion: 6
  artifact:
    name: ""
    product: landometer | citymeter | citywiki | citychat | ijji
    profile: designsystem.adoption | brand.public | citymeter.dataset | citywiki.public | product.app | citychat.app | ijji.app | data.explainer | campaign.public | social.static | presentation
    pageKind: ""
    pageKindSourceRef: ""
    delivery: deployable_public | portable_single_file | internal_demo | static_export
    language: th | en
    additionalLanguages: []
    generationMode: not_applicable | A | B | C
    outputType: webpage | application | dataset_view | explainer | campaign | social_asset | presentation | static_document | destination_page | source_limited_planning_draft | entity_resolution_pack | field_verification_pack
  export:
    platform: not_applicable
    canvasPx: not_applicable
    aspectRatio: not_applicable
    safeArea: not_applicable
    exportScale: not_applicable
    format: not_applicable
    altOrCaptionPackage: ""
    deliveredSizeTest: ""
  publication:
    evidenceStatus: verified | provisional | source_limited
    visibility: public | internal | private
    indexable: false
    canonicalUrl: ""
  destination:
    required: false
    url: ""
    readiness: not_applicable | reference_ready | share_ready
    publicSafe: false
    status: verified | provisional | unavailable
    qrOrLinkTest: ""
  audience:
    primary: ""
    role: ""
    adoptionRoleRegistry:
      owner: ""
      version: ""
      roles: []
  voice:
    applies: true | false
    locales:
      - locale: th | en
        ruleRefs: []
        normativeSourceRef: ""
        authoringBasisRef: ""
        fixtureSetRef: none | ""
        copyHash: ""
        naturalnessReviewRef: ""
        parityReviewRef: ""
  experience:
    trigger: ""
    oneJob: ""
    promisedOutcome: ""
    firstAha: ""
    ahaEvidenceCue: ""
    primaryAction: ""
    nextUsefulAction: ""
    nextTriggerOrCleanCompletion: ""
    dominantObject: ""
    channelParityKey: ""
    brandSignatures: []
    cleanCompletion: ""
  composition:
    quietRegions: []
    gradientSurfaces: []
    connectors: []
  brandAlignment:
    productStatement: ""
    proofObject: ""
    ahaProvesPromise: false
    networkAdvancesObjective: false
  investment:
    mode: none_no_honest_investment | session_intent | saved_object | comparison | watch | helpfulness | correction | outcome_report | relevant_role
    userBenefit: ""
  proof:
    kind: none | brand | documentary | analytical | operational
    object: ""
    sourceStatus: observed | official | calculated | proxy | modelled | recommendation | not_applicable
    limitation: ""
  assets:
    officialLogo: available | missing
    officialLogoAsset:
      id: ""
      variant: ""
      sha256: ""
      canvas: unresolved | transparent | exception_integral_background
      placement: unresolved | direct_surface | separate_plate
      surfacePairingRef: ""
      identityApproval:
        id: ""
        authorityRole: brand_identity_authority
        delegatedAuthorityRecordId: none | ""
        decision: unresolved | direct_surface | integral_background | separate_plate
        assetId: ""
        variant: ""
        sha256: ""
        canvas: unresolved | transparent | exception_integral_background
        placement: unresolved | direct_surface | separate_plate
        surfaceRef: ""
        themesOrBackdrops: []
        recordVersion: ""
        validFrom: ""
        expiresAt: null | ""
        evidenceRef: ""
    approvedPhotography: []
    approvedWorkProof: []
    mediaAssets:
      - assetId: ""
        variant: ""
        sha256: ""
        permissionRecordId: ""
        sourceOrOwner: ""
        creatorCredit: ""
        context: ""
        capturedAt: ""
        dimensionsPx: ""
        cropOrRedaction: ""
        altText: ""
        displayedCredit: ""
        privacyScreenReview: ""
        approvedUse: ""
    permissionRecords:
      - id: ""
        owner: ""
        assetIds: []
        permittedUse: ""
        variantsAndHashes: []
        expiry: ""
  theme:
    mode: interactive_auto | static_light | static_dark | exception_fixed
    support: dual | light_only | dark_only
    default: system | light | dark
    visibleOverride: true | false
    exception:
      ruleId: ""
      owner: ""
      approver: ""
      reason: ""
      createdAt: ""
      expiry: ""
      mitigation: ""
      evidencePath: ""
      trackingTicket: ""
  motion:
    intensity: guided | restrained | state_led | expressive_short | export_safe
  capabilities:
    analyticalEvidence: false
    motionEnhancement: false
    personalization: false
    search: false
    share: false
    map: false
    dataVisualization: false
    coCreation: false
    persistence: false
    externalSideEffect: false
    authentication: false
    permissions: false
    contextDiscovery: false
    agentReadable: false
    boundedAgentAction: false
    agentActionEffect: none | read_only | local_only | external
    fullLivingReference: false
  agentAction:
    targetObjects: []
    scope: ""
    boundary: ""
    confirmation: none | preview_then_confirm
    allowedEffects: []
  referenceFixtures: []
  privacy:
    personalData: false
    sensitivity: public | internal | confidential | restricted
    redactedPublicProjection: false
    governanceRecord:
      id: ""
      owner: ""
      collectionBasisAndMinimumFields: ""
      accessAndRetentionDeletion: ""
      redactionAndExportRules: ""
      reviewStatusAndDate: ""
  telemetry:
    enabled: false
    scope: none | internal | public_aggregate
    purpose: ""
    dataClasses: []
    retention: ""
    privacyBasis: ""
    governanceRecord:
      id: ""
      owner: ""
      accessCorrectionDeletion: ""
      reviewDate: ""
  network:
    mode: none | reference_ready | share_ready | relevant_circle | collaborative_object | co_creation_network | handoff_or_export | private_by_policy
    action: none | copy_draft | exact_link | direct_send | post | invite | export | handoff
    recipientOutcome: ""
    policyReason: ""
  qa:
    evidencePath: ""
    controlInventoryPath: ""
```

`composition.quietRegions`, `composition.gradientSurfaces`, and `composition.connectors` default to empty arrays. Add records only when the matching promoted scene, gradient surface, or connector actually renders. Placeholder records are invalid and MUST NOT create visible UI.

If `pageKind`, `trigger`, `oneJob`, `firstAha`, `ahaEvidenceCue`, `primaryAction`, `nextUsefulAction`, `nextTriggerOrCleanCompletion`, `dominantObject`, `cleanCompletion`, or `profile` is empty, the agent MUST stop before writing UI and resolve the missing field. The AHA names the governed object/result, why it matters, its immediately visible evidence cue, and the next action or legitimate clean completion; timing alone is not an AHA. A read-only, status, evidence, or completion scene MAY use `none_deliberate: <reason>` for an action field when its profile does not require an action; it renders zero control and agrees with `cleanCompletion`. A non-interactive `static_export` MAY instead use `not_applicable: <reason>`. `designsystem.adoption`, `campaign.public`, and action-bearing `brand.public` pages still require the real first-viewport action in `[FLOW-03]`; brand About/team, legal, privacy, accessibility, and utility-reference page kinds MAY use deliberate no-action. Empty values are never valid. The agent MUST NOT compensate with extra sections, cards, controls, or invented product language.

Cross-field validation:

| Condition | MUST resolve before build |
|---|---|
| Profile and product | pair is compatible with §8.3; exactly one profile is active |
| Page kind | `pageKindSourceRef` resolves to the applicable approved Product Brief/Product Statement, this master’s named profile rule, or a generated approved page-kind registry, and that source explicitly owns the page kind plus its action/no-action behavior. Agents MUST NOT mint a page kind or use a utility label to bypass `[FLOW-03]`; an unresolved source stops the build. |
| Profile and delivery | `designsystem.adoption`, `brand.public`, `product.app`, `citychat.app`, and `ijji.app` reject `static_export`; use a truthful derivative profile instead. `social.static` requires `delivery: static_export` and `outputType: social_asset`; it also inherits the static theme, locale, accessibility, and destination branches. |
| Static export record | `static_export` requires real `platform`, `canvasPx`, `aspectRatio`, `safeArea`, `exportScale`, `format`, alt/caption package, and delivered-size test; non-static work sets the six format/geometry fields to `not_applicable`. A static `campaign.public`, `social.static`, presentation, or document MUST NOT begin layout until this record is complete. |
| Language | every `additionalLanguages` item is `th` or `en`, the array is unique, and it excludes the active `language`; render a selector only when non-empty. `static_export` uses exactly one fixed locale and therefore requires `additionalLanguages: []`. Each language is authored independently from the same resolved Build Card and proof/evidence record; material meaning must match, but sentence structure and line count need not. |
| Voice | any string rendered, exported, announced, or otherwise exposed to a person sets `voice.applies: true` and has exactly one locale record for the active language plus each additional language. Each record’s `ruleRefs` includes `[VOICE-01]` and the selected approved product voice when one exists; `normativeSourceRef` resolves to stable authority; `authoringBasisRef` resolves to the same Build Card plus proof/evidence object; and `copyHash` binds review evidence to the exact copy. Thai public, product, adoption, campaign, social, and presentation work also references an approved Thai fixture set and completed naturalness review; multi-language work has a separate parity review against the canonical evidence record. Fixtures guide QA but never replace normative authority. `applies: false` is valid only when no human-facing string exists and requires `locales: []`. An adjective such as `warm`, `bold`, `human`, `charming`, or `energetic` is not authority. |
| Theme | `static_export` MUST use `static_light` or `static_dark`, its matching one-theme support/default, and `visibleOverride: false`; those modes are invalid elsewhere. Non-static delivery normally uses `interactive_auto` with `dual`, `default: system`, and `visibleOverride: true`. `exception_fixed` uses exactly one of `light_only/default: light` or `dark_only/default: dark`, sets `visibleOverride: false`, carries the complete exception record into HTML/manifest evidence, and cannot claim full v0.8.8 production conformance. |
| Motion intensity | Every `static_export` overrides profile defaults with `export_safe`. Otherwise `designsystem.adoption` and action-bearing `brand.public` use `guided`; `citywiki.public` uses `restrained`; `citymeter.dataset`, `product.app`, and `citychat.app` use `state_led`; `ijji.app` and `data.explainer` use `guided`; `campaign.public` uses `expressive_short`; and `social.static`/`presentation` use `export_safe`. `motionEnhancement: false` removes optional entrance/reveal but not necessary state feedback. |
| Brand signatures | adoption and long brand routes select exactly three approved names including at least one of Measure/Spectrum/Layer and at least one of Ground/Cultivate. Smaller task, campaign, social, utility, and product surfaces select one to three functional signatures for the job with no family quota; do not add decoration to reach a count. |
| Perceptual quiet | every promoted brand/adoption/campaign scene has one `composition.quietRegions` record per required viewport/canvas. The annotated region may contain one dominant message group or proof, but `secondaryUI` is false; area thresholds and manual low-detail review pass; the marker itself adds no visual style. |
| Brand-atmosphere surface | every rendered gradient has one `composition.gradientSurfaces` record. Role, recipe, exact source values, focal target, reading direction, foreground strategy, contrast evidence, cadence, and deletion test agree with `[SURFACE-01]`; `neutral` or `worsens` removes the gradient unless a narrow exception is recorded. |
| Connector integrity | every rendered line, arrow, curve, path, bracket, dashed route, or loop has one `composition.connectors` record with identifiable endpoints, a named relationship, style/arrow meaning, mobile behavior, accessible alternative, and `deletionTest: carries_meaning`. No connector record means no connector renders. |
| Brand trace | a public, adoption, or product profile names its product statement and inspectable proof; `ahaProvesPromise` is true; `networkAdvancesObjective` matches the declared honest network mode rather than forcing a control |
| Governed object | `experience.dominantObject` always references one canonical object ID/version. When `proof.kind` is non-none, `brandAlignment.proofObject` and `proof.object` reference that object or declare their explicit relationship/version boundary; when proof is none, both proof fields are empty. |
| Referenced assets | every photography/work-proof asset used by any profile has a matching per-asset `mediaAssets` entry whose `permissionRecordId` resolves to exactly one `permissionRecords` entry covering that asset ID and exact variant/hash, source/owner, creator credit, real context/date, dimensions, crop/redaction, alt, displayed credit, privacy/screen review, approved use, and unexpired term; unresolved, duplicate-ID, unrelated, generic, incomplete, or partial records do not pass |
| Adoption asset | `designsystem.adoption` has at least one approved real Landometer team/work/place photograph in `approvedPhotography`, with complete media and permission records. `approvedWorkProof` MAY support Try but cannot substitute for the opening photograph; an empty, expired, unhashed, or unapproved set blocks adoption release. |
| Adoption roles | `designsystem.adoption` has a current owner/version and non-empty approved company role roster. Every entry names `id`, `label`, `oneJob`, `proofOrRecipeId`, and `nextRoleOrRecipient`; agents MUST NOT invent organizational roles. |
| CityWiki | `citywiki.public` declares `generationMode: A \| B \| C` and uses only `destination_page`, `source_limited_planning_draft`, `entity_resolution_pack`, or `field_verification_pack`. Other profiles reject those four types unless a current Product Brief explicitly owns one. A/B/C semantics and type compatibility come from the current CityWiki production spec; the letter never implies evidence status or indexability. Every other profile uses `generationMode: not_applicable`. |
| Static destination | `social.static` and a `campaign.public` static export require a verified, public-safe, `share_ready` destination URL plus real QR/link evidence. The static artifact declares its own honest `handoff_or_export`/`export` path and renders no simulated share control. |
| Destination invariant | `destination.required: true` requires a non-empty reachable/testable URL or exact internal route, non-`not_applicable` readiness, non-`unavailable` status, and recorded link/QR/route test before its CTA renders. `required: false` requires no destination-dependent CTA, preview, QR, or delivery claim. |
| Evidence | universally, `proof.kind: none` iff `proof.object` is empty and `sourceStatus: not_applicable`; any other kind requires a non-empty object and non-`not_applicable` status. Public visibility and `designsystem.adoption`, `brand.public`, `citymeter.dataset`, `citywiki.public`, `product.app`, `citychat.app`, and `ijji.app` require the non-none branch. Analytical/operational proof, calculated/proxy/modelled/recommendation status, `citymeter.dataset`, `citywiki.public`, or `data.explainer` implies `analyticalEvidence: true`; map/dataviz also has a real source status and limitation. |
| Capability | every true capability loads its owning Trigger Pack; `map: true` or `dataVisualization: true` implies `analyticalEvidence: true`; a numeric, rank, forecast, recommendation, alert, or decision-result claim makes `analyticalEvidence: false` invalid |
| Spatial visualization | any choropleth, governed-area classification, or spatial-density visualization requires `analyticalEvidence: true`, `dataVisualization: true`, and `map: true`; it loads both `[DATAVIZ-01]` and `[MAP-01]`. |
| Co-creation | implies `persistence: true` and `externalSideEffect: true` |
| Personalization | implies `persistence: true`; learned use loads `[LEARN-01]` |
| Investment | any non-none mode has a user benefit, occurs after AHA, and loads `[LEARN-01]`; `saved_object`/`watch` implies persistence; a submitted `helpfulness`, `correction`, `outcome_report`, or `relevant_role` implies external effect and its applicable contribution/co-creation contract |
| Share/network | `none`, `private_by_policy`, or `reference_ready` requires `share: false` and `action: none`; private policy also has a non-empty reason. `none` is valid only for non-user-facing machine/QA fixtures; user-facing output declares at least `reference_ready`, `handoff_or_export`, `private_by_policy`, or its profile minimum without forcing a visible share control. `share_ready` requires `share: true`, a real canonical destination, public-safe metadata, and `exact_link`, `direct_send`, or `post` after AHA. `relevant_circle`, `collaborative_object`, and `co_creation_network` require `share: true`, an implemented `exact_link`, `direct_send`, `post`, or `invite`, plus recipient-side contracts. `copy_draft`, `export`, or `handoff` is valid only with `handoff_or_export`: export requires `share: false` and no share control; copy-draft/handoff requires `share: true`, a real user-visible action, `[SHARE-01]`, and a recipient outcome. Every other action/mode mismatch fails. `direct_send`, `post`, `invite`, or an externally delivered handoff implies external effect. |
| Network state | `share_ready` and every higher recipient mode has a non-empty `recipientOutcome`; handoff/export names the recipient or reader outcome. `collaborative_object` implies persistence, permissions, external effect, shared-state audit, and revoke/leave behavior. `co_creation_network` implies `coCreation: true`, provenance, moderation, and withdrawal. |
| Channel parity | whenever an object can appear in more than one human, agent, export, share, or recipient channel, `channelParityKey` is non-empty and stable; parity compares object/version, scope/boundary/time, leading result, supporting and counter-signals, missingness, source/update, confidence/limitations, allowed uses/actions, visibility, and authoritative state. |
| Publication/privacy | `[PUB-01]` loads for every artifact; public visibility requires public sensitivity or an explicitly redacted public projection; internal/private visibility sets `indexable: false` and forbids public metadata/analytics/sharing. `personalData: true`, confidential/restricted sensitivity, or a redacted public projection requires a complete privacy governance record. |
| Telemetry | disabled iff `scope: none`; enabled uses `internal` or `public_aggregate`, declares purpose, data classes, retention, privacy basis, a complete governance record, and loads `[TELEMETRY-01]` plus `[PUB-01]` review |
| Release evidence | `deployable_public` with public visibility has a reachable `canonicalUrl`. Every claimed production, adoption, or full-reference release has a non-empty `qa.evidencePath`; evidence contents are scoped by delivery and risk, never omitted because visibility is internal. |
| Internal demo | `internal_demo` requires internal/private visibility, `indexable: false`, and no public network claim |
| External effect | `externalSideEffect: true` loads `[EFFECT-01]`; no external control renders before that contract is complete. Any permission-changing control implies `permissions: true` and `externalSideEffect: true`. |
| Authentication/permission | a visible identity, sign-in, account, workspace, access, authorization-role, or permission control requires `[AUTH-01]`; a discipline/persona/content-route selector does not. Auth controls MUST NOT render as ornamental or simulated utility. |
| Context Discovery | `contextDiscovery: true` loads `[CONTEXT-01]`; a query preview MUST be public-safe before any external request |
| Agent output/action | `agentReadable: true` or `boundedAgentAction: true` loads `[AGENT-OUT-01]`. `boundedAgentAction: false` requires `agentActionEffect: none` and an empty action scope. True requires declared target objects, scope, boundary, allowed effects, and `read_only`, `local_only`, or `external`; `external` implies `externalSideEffect: true`, loads `[EFFECT-01]`, and requires `preview_then_confirm`. |
| Full reference | `fullLivingReference: true` is valid only for non-static `designsystem.adoption`, requires `search: true`, and loads `[REFERENCE-01]` plus `[SEARCH-01]`; its Proof Lab remains outside the default Adopt route. Every reference specimen has a `referenceFixtures` record naming ID, applicable packs, demonstrated capabilities, `localStateOnly: true`, and `effect: none`; fixture capabilities do not enable product capabilities or imply external effects in the top-level manifest. |
| Identity | `officialLogo: available` requires a non-empty approved asset ID, exact variant, SHA-256, resolved canvas/placement, `surfacePairingRef`, and a current `identityApproval` whose authority is the Brand identity authority or documented delegate. The approval repeats the exact asset/hash, decision branch, surface, themes/backdrops, validity, and evidence; `surfacePairingRef` resolves to the same surface as `identityApproval.surfaceRef`. `transparent + direct_surface` pairs only with `decision: direct_surface`; `exception_integral_background + direct_surface` pairs only with `decision: integral_background`; `transparent + separate_plate` pairs only with `decision: separate_plate`. Asset ownership, manifest registration, token existence, or registry membership never grants brand-use approval. The referenced manifest records `minPrintWidthMm >= 10`, approved minimum CSS width, clear-space unit, and pairing evidence. Missing, mismatched, expired, or out-of-scope approval blocks release. `officialLogo: missing` permits a labelled placeholder only for `internal_demo` with internal/private visibility and cannot pass production or adoption release. |
| Control inventory | any interactive artifact has a non-empty `qa.controlInventoryPath`; a non-interactive static export records `not_applicable: non-interactive` |
| Representation parity | the Build Card, HTML identity attributes, adjacent/embedded manifest, rendered capabilities, theme/locale state, `TrustBadge`, metadata, robots, and runtime effects agree exactly under §9.4; disagreement blocks release |

The v0.8.8 public-safe machine specification package MUST supply `build-card.schema.json`, `manifest.schema.json`, generated tokens, surface recipes, identity and voice records, rule ledgers, and preflight mappings before package-level v0.8.8 conformance is claimed. An artifact may report `machineValidation: passed` only after the package validator and every applicable artifact-level automated and manual gate run against that artifact. Package availability alone is not a pass.

### 1.1 Default capability rule

```txt
capability=false or unknown
→ no visible control
→ no simulated success
→ no placeholder CTA
→ explain the limitation only when the user needs to know it
```

A demo MAY simulate a capability only when the control is labelled **Demonstration only**, changes a complete local state, has recovery/reset, and cannot be mistaken for a real external effect.

---

## 2. Core Contract — load in every build

These rules are the default agent context. Conditional detail does not override them.

| ID | Level | Requirement | Acceptance |
|---|---|---|---|
| `CORE-01` | MUST | Use the official brand hierarchy and exact protected phrases. | North Star, Promise, and Cultural activation have distinct roles. |
| `CORE-02` | MUST | Give each scene and page state one user job, one dominant object, and at most one next useful action. | A reviewer can state the job/object and whether no action is deliberate. |
| `CORE-03` | MUST | Deliver a useful AHA before nonessential registration, data, permission, contribution, notification, or sharing. Only identity or permission intrinsic to the promised task MAY precede AHA under `[AHA-01]` and `[AUTH-01]`; request the minimum, explain purpose and consequence first, and preserve a denial-safe alternative. | The AHA is visible within the profile budget. |
| `CORE-04` | MUST | Render only working, necessary controls. | Zero dead, duplicate-intent, misleading, or inaccessible controls. |
| `CORE-05` | MUST | Preserve truth: state, source/date, boundary, confidence, limitation, and recovery when relevant. | The same object keeps the same meaning across roles and channels. |
| `CORE-06` | MUST | Use official assets, exact canonical tokens, semantic font roles, and one declared profile. | No local mini-design system or invented logo/sub-brand. |
| `CORE-07` | MUST | Keep essential content and action usable with keyboard, touch, 200% zoom, reduced motion, and no JavaScript where the profile permits. | Applicable QA matrix passes. |
| `CORE-08` | MUST | Make the work recognizably Landometer, not a generic AI/SaaS template. | The applicable recorded recognition protocol or approved-golden/substitution regression passes. |
| `CORE-09` | MUST | Use one active language at a time; author each locale from the same Build Card and evidence rather than translating rendered strings; theme and language utility MUST NOT compete with the task. | Locale is correct at first paint, native-language review and material parity pass, and state survives switching. |
| `CORE-10` | MUST | Treat sharing as a recipient-value capability, not a decorative CTA or network-effect claim. | Sharing appears only when enabled and after value; recipient outcome is measured separately. |

### 2.1 Decision order when rules compete

1. safety, privacy, truth, and accessibility;
2. clear user location and next action;
3. first AHA and current objective;
4. recovery, receipt, or resumable state;
5. recognizable Landometer character;
6. optional handoff or network action;
7. additional polish.

For `designsystem.adoption`, recognizable Landometer character is part of the first AHA, not late polish.

### 2.2 Universal decision test

Every user-facing component MUST answer at least one question:

1. What object or place is this?
2. What changed or matters?
3. Why should I trust it?
4. What can I do next?
5. What happens if this is incomplete or fails?

If it answers none, remove or demote it.

---

## 3. Core Guidance — brand foundation and positive energy

### 3.1 Brand Statement `[POSITION-01]`

**Who**  
Landometer is an AI-driven urban data company for organizations and people who need to understand places, people behavior, local context, risk, opportunity, and change before making a decision.

**What**  
Landometer turns fragmented urban and spatial information into clear, source-grounded intelligence that helps users see what matters, understand why it matters, decide, act, and learn from the outcome.

**Which**  
Unlike isolated GIS layers, map-only dashboards, one-off reports, generic AI answers, or disconnected communication tools, Landometer connects evidence, place context, explanation, decision, action, contribution, and learning.

**How**  
Landometer combines structured urban and geospatial data, spatial analysis, local and human context, visible evidence and limits, its product ecosystem, ethical co-creation, and relevant-circle coordination.

**Positioning**  
Landometer is the decision-intelligence layer between raw urban data and real local action.

### 3.2 Three protected brand lines `[BRAND-01]`

| Role | Exact line | Use |
|---|---|---|
| North Star | **Visualize City, Shape Tomorrow.** | Corporate direction and ambition |
| Brand Promise | **Measure What Matters. Make It Actionable.** | Product and work-quality test |
| Cultural activation | **Let us cultivate our city.** | Invitation to participate, collaborate, learn, and improve the city together |

Supporting systems are not slogans:

| System | Exact form | Use |
|---|---|---|
| Ecosystem | **Land · Location · Living · Local Decisions.** | Shared scope across the product family |
| Product loop | **See → Understand → Decide → Act → Learn.** | Repeated experience and outcome logic |

The Cultural activation line is an approved v0.8.6 amendment and supersedes the longer v0.8.5 closing form. The active form is exactly **“Let us cultivate our city.”** It MUST NOT be extended with “with data,” replaced with “a better city with data,” or treated as a generic footer slogan.

On an internal adoption or team-rally surface, Cultural activation MAY lead the first viewport. On a corporate page, the North Star normally leads. On a data/product task, the user’s job and proof lead; Cultural activation appears only where participation is real.

Only one protected brand line may be headline-level in one scene. An artifact MUST NOT stack North Star, Promise, Cultural activation, Ecosystem, and Product loop as peer slogans. Ecosystem and Product loop appear only when they explain scope or behavior. For `designsystem.adoption`, Cultural activation leads; the Promise becomes a work-quality proof; the North Star appears later as corporate context.

### 3.3 Brand DNA `[BRAND-02]`

| Trait | Content | Visual | Interaction |
|---|---|---|---|
| **Clear** | Plain words, concrete object, direct next step | One focal idea and readable hierarchy | Few necessary actions; current location is obvious |
| **Grounded** | Source, date, place, boundary, uncertainty, limitation | Real place, real people, stable evidence surfaces | Honest partial/error/recovery states |
| **Energetic** | Active verbs and forward movement without hype | Confident scale, purposeful spectrum, human momentum | Invite the next useful action and show cause → effect |

Energy is not a quota of gradients, slogans, exclamation marks, animation, or controls. A governed atmosphere surface MAY express energy when it creates a clear entry point, direction, transition, momentum, or closure under `[SURFACE-01]`. The underlying test remains whether real people can understand something, try something, learn, and move the work forward together.

### 3.4 Culture behavior `[CULTURE-01]`

The internal culture evidence is practical:

- ship early, learn fast;
- start with the real end user;
- own the problem;
- stay grounded in the field;
- collaborate across functions;
- grow curiosity through the work;
- deliver what was committed;
- bring good energy that helps others continue.

These ideas SHOULD appear through people, actions, examples, and work—not as a wall of value cards.

The preferred culture sequence is:

```txt
real end user → try real work → help the next role → learn and improve
```

`Explore → Execute → Elevate` MAY structure a real working sequence. It MUST NOT become three generic cards without real work, evidence, and outcome.

### 3.5 Brand-memory signatures `[BRAND-03]`

An adoption or long brand route MUST select exactly three signatures for the complete primary route. A smaller task, campaign, social, utility, or product surface selects one to three and MUST NOT add ornament merely to reach a count. Every primary scene MUST make at least one selected signature perceptible, and the first AHA MUST contain at least one functional signature. Selected signatures do not need to appear as separate visual devices. The default adoption set is **Measure · Ground · Cultivate**. Spectrum, Layer, and Move are conditional tools; omitting them is correct when they add no meaning.

The retained **Meter · Diversity · Depth** triad maps to **Measure · Spectrum · Layer**. For adoption and long routes, the selected set MUST include at least one of those structural signatures and at least one of **Ground · Cultivate**; motion alone cannot supply brand energy. A smaller one-signature surface selects the one functional cue that serves its job and MUST NOT add a second merely to satisfy a family quota.

| Signature | Meaning |
|---|---|
| **Measure** | metric, range, confidence, status, threshold, or progress |
| **Layer** | evidence and context revealed at the depth needed for the decision |
| **Spectrum** | disciplined, role-correct color showing diversity or category |
| **Move** | short state motion carrying attention from evidence to meaning to action |
| **Ground** | visible place, source, date, boundary, limitation, field or human context |
| **Cultivate** | a real action that helps a person, team, shared object, or city improve |

Repeating the logo, painting the page blue, adding abstract arcs, or using a rainbow gradient does not satisfy this rule.

### 3.6 Voice authority and native-language authoring `[VOICE-01]`

Truth, source, boundary, usefulness, privacy, and accessibility are hard gates, not a public voice.

`Clear · Grounded · Energetic` are outcome tests rather than prompt adjectives: the reader understands the object or action, sees its support and boundary, and can recognize credible progress or a next move.

Start from the resolved Build Card and the applicable proof/evidence record. Use only the steps material to the message:

```txt
real person, place, object, work, or decision
→ finding or change
→ consequence
→ evidence, status, and material limitation
→ next action or clean completion when one exists
```

Simplification MUST NOT erase who did the work, what changed, why it matters, or what remains at stake. A short CTA, invitation, state label, or clean completion need not display the whole sequence.

Write first in the active language. Additional languages are sibling drafts from the same resolved Build Card and canonical evidence record; structure and rhythm MAY differ while every governed value and material meaning remains the same.

CityWiki’s `Charming` voice remains CityWiki-specific. Its method of noticing true detail MAY inform a writer; its label, destination posture, and travel/editorial rules MUST NOT leak into shared Landometer or CityMETER voice.

### 3.7 Specific, valuable, non-generic copy `[COPY-01]`

Use exact nouns, direct verbs, and natural language. Lead with a person, place, object, result, question, or action—not the system that produced it.

For a claim, proof, result, or decision, prefer:

```text
คน พื้นที่ ชิ้นงาน หรือข้อมูลที่กำลังพูดถึง
→ สิ่งที่พบหรือสิ่งที่เปลี่ยนไป
→ สิ่งนี้มีผลต่อการตัดสินใจอย่างไร
→ หลักฐานที่รองรับ
→ ข้อจำกัดที่มีผลต่อการใช้
→ คนอ่านทำอะไรต่อได้
```

Rules:

- Name the reader’s actual decision before describing platform value.
- Prefer the most exact ordinary word; repeat it rather than swap in decoration.
- Preserve `CORE-05`; where analytical evidence triggers `[DATA-01]`, state verified facts directly, show every material uncertainty and limitation, and do not repeat non-material caveats as apology.
- Keep one main move per sentence while allowing natural paragraph rhythm.
- Do not average audiences or place abstract system language before the concrete object.
- Do not lead with `X is not Y; it is Z` or invent a sub-brand such as `Mission Lab`.
- Keep internal technical terms such as `governed object`, `claim boundary`, schema name, or parity score in Reference or evidence detail unless the task needs them; explain the job in ordinary Thai first.
- Do not revive historical hype, stack fragments to simulate energy, or force friendliness through slang, repeated `เรา`, exclamation marks, or assumed emotion.
- Apply the substitution test: if the logo and company name could be replaced and the copy would fit another AI/SaaS company unchanged, rewrite it.
- Automated lint MAY flag suspicious language; it MUST NOT rewrite or approve copy automatically.

The advisory Thai lint list, failure patterns, deletion tests, and fixtures live in Appendix D. They are reference-only and do not enter the default Core loading path.

### 3.8 Controlled brand rhythm `[BRAND-04]`

A long adoption route and a genuinely long action-bearing brand route retain exactly three **semantic promoted moments**:

1. **Opening — Direction and invitation**  
   Establish the profile-specific protected line, one real Landometer image or proof, and one start action. A governed atmosphere surface MAY support the opening, including a full-bleed photograph with a gradient/scrim.

2. **Transition — Measure → Ground → Act**  
   Turn one principle into visible meaning, evidence, and action. The transition MAY use a large gradient field, a proof surface, or a change in photographic/flat atmosphere. It MUST NOT rely on decorative connector lines.

3. **Closing — Shared action or useful reference**  
   Use one concise shared-purpose line, one active-role takeaway or reference action, and the approved Measure/signature gradient when it supports closure.

Gradient cadence and semantic rhythm are related but different:

- the route may use two to four major atmosphere surfaces;
- one semantic moment may use no gradient;
- one restrained transition gradient may appear between promoted moments;
- a gradient never creates an additional user job, scene, card, or control;
- at least one calm flat, photographic, or evidence-led scene separates two major gradient moments.

A smaller task surface uses only the moment and atmosphere needed by its one job. It MUST NOT manufacture all three semantic moments or add gradients to reach a visual quota.

The official logo never animates and never gains gradient approval by proximity.

## 4. Core Guidance — experience architecture and wayfinding

### 4.1 One route before many references `[FLOW-01]`

The default canvas MUST NOT combine brand story, role lab, technical reference, search application, share workflow, and QA sandbox.

When `fullLivingReference: true`, a design-system experience uses three modes with one visible at a time. When false, render Adopt only and omit inactive Reference/Lab controls:

| Mode | User question | Default visibility |
|---|---|---|
| `adopt` | Why should I join and how does this help my work? | Always; default |
| `reference` | What rule, token, or pattern applies? | Only when `fullLivingReference: true`; on request |
| `lab` | Does this state, motion, component, map, or chart work? | Only when `fullLivingReference: true`; on request |

The mode, role, pattern, and specimen state SHOULD be deep-linkable by URL or hash. A link to a pattern MUST restore the pattern, not only scroll near a closed card.

With `fullLivingReference: false`, Reference/Lab controls and DOM do not exist. With it true, only the active mode contributes layout, focus order, or accessibility-tree content; inactive modes are unloaded or correctly `hidden`/`inert`, never merely moved off-screen.

### 4.2 Adoption route `[FLOW-02]`

```txt
Cultivate
→ Try
→ Align
→ Reference
```

1. **Cultivate:** recognize Landometer and feel invited into shared work.
2. **Try:** choose one role and improve one real artifact within 30 seconds.
3. **Align:** see how that change helps the next role and keeps meaning intact.
4. **Reference:** open the exact rule or implementation detail only when needed.

This route retains the v0.8.5 story without reproducing its density:

| v0.8.5 intent | v0.8.6 location |
|---|---|
| Promise | Cultivate opening and one real proof |
| Principles | Try, with no more than one active role proof |
| How we ship | Align, using one governed cross-team handoff |
| Evidence and Changes | Reference; Changes remains last |
| Complete proof coverage | Lab, loaded only by `[REFERENCE-01]` |

### 4.3 First-viewport contract `[FLOW-03]`

For `designsystem.adoption`, non-static `campaign.public`, and action-bearing `brand.public` home/solution/product/proof/careers routes:

- one exact brand/rally line;
- for `designsystem.adoption`, one support sentence capped at 160 Thai characters or 30 English words and naming a concrete city/place/decision cue; `brand.public` and `campaign.public` MAY omit it when the proof itself supplies the cue;
- one dominant real photograph, city/product proof, or approved identity object;
- exactly one primary action;
- at most one quiet secondary text link;
- no share, invite, signup, contribution, role-chip row, technical state card, command palette, or pattern search;
- maximum four visible focusable targets across any sticky header and hero; logo/home links, navigation, locale, settings/menu, and primary/secondary controls all count; only the skip link is excluded;
- the one dominant visual appears above the fold and is not covered by a dashboard card; `designsystem.adoption` uses one approved real Landometer team/work/place photograph. A work-proof asset may support Try later but cannot replace this opening photograph or add a competing first-viewport visual;
- the dominant photograph or proof MAY be full-bleed and MAY sit behind the message. The message MAY occupy genuine negative space or a governed gradient/scrim region when `[SPACE-01]`, `[PHOTO-01]`, `[SURFACE-01]`, and `[A11Y-01]` pass. A separate photo column is not required. The implementation MUST NOT insert a third filler block between message and media merely to represent the quiet field;
- the first viewport passes at 390 × 844 and 1440 × 900.

At 320 × 568, the start action MAY require no more than one natural viewport scroll when browser chrome prevents an honest fit. Sticky UI MUST NOT cover it.

Recommended adoption hero:

```txt
Landometer logo + current release

Let us cultivate our city.

[One natural sentence naming the real work object and who uses it next]

[One immediate action]

[One dominant real Landometer team/work/place photograph,
 either full-bleed or beside the message]

[One perceptually quiet region created through composition,
 negative space, crop, or a governed atmosphere surface]
```

- The image MAY occupy `100%` of the scene surface when the subject remains unobscured.
- A gradient/scrim MAY sit between the image and text to establish hierarchy and contrast.
- The first viewport still contains no floating technical card and no UI over people or material evidence.
- Message, media/proof, and action resolve as no more than two visual groups; a quiet region is not a third group.

Supporting copy is illustrative; the headline is canonical.

The `160`-Thai-character adoption-support threshold is reviewed only after native Thai drafting and meaning review. It does not authorize automatic truncation, abbreviation, fragmenting, removal of the concrete object or action, or word-for-word compression from English. If reviewed Thai does not fit, simplify the idea or revise composition within `[SPACE-01]`; do not reduce the meaning.

A `brand.public` About/team, legal, privacy, accessibility, or utility-reference page instead MAY use `none_deliberate` with clean completion, one quiet reference route when useful, and zero promoted CTA. It still keeps one focal idea, proof/context, and the same focusable-target ceiling.

A static `campaign.public` export uses its declared canvas, aspect ratio, and safe area instead of browser viewport/focus rules. It contains one leading line, one proof object, one visible CTA/destination cue, a verified link or QR package, and a quiet field measured on the export canvas; no interactive control is simulated.

### 4.4 Scene density budget `[FLOW-04]`

The following are maximums, not a checklist:

- zero or one concise heading;
- zero or one support sentence;
- zero or one question/proof;
- zero to five labels/steps only when a sequence needs them;
- zero or one primary action in the active state;
- no more than two bounded panels, and only for a real comparison.

A scene MAY contain only a headline and one object/proof. Omission is correct when another element adds no meaning or action. The primary adoption route contains no more than five scenes.

Main explanatory copy per scene is no more than 40 language-aware words. For Thai, warn above 240 letters excluding whitespace and punctuation when `Intl.Segmenter` is unavailable. Detailed rationale, token tables, schemas, migration notes, complete galleries, and QA evidence belong in Reference, closed by default.

Cards are not the default unit of composition. Use open sections, shared grids, full-width evidence, real imagery, and direct labels. A card exists only when an object needs a boundary or interaction state.

Density budgets are evaluated with reviewed active-language copy. Thai and English do not need matching line counts. If native Thai exceeds the scene budget, simplify the message or revise layout while preserving the focal idea and quiet field; do not shrink type below the token, clip copy, or remove the object, consequence, evidence required by the claim, or useful action.

### 4.5 Perceptual quiet and dominant media `[SPACE-01]`

Quiet is an **attention condition**, not a mandatory blank rectangle and not a visible component.

A promoted scene MUST preserve one calm, contiguous visual region that helps the reader identify the dominant message, object, proof, or action without competing detail. That region MAY be:

1. an open flat surface;
2. genuine negative space inside a photograph;
3. a low-detail photographic region created by crop, position, focal depth, or restrained redaction;
4. a governed low-frequency gradient surface;
5. a photograph subdued by a deterministic tonal scrim or governed gradient overlay;
6. a continuous background field that spans behind the dominant message or proof.

A quiet region MUST NOT be implemented as a filler card, tinted slab, rounded empty column, placeholder panel, decorative block, or artificial gap merely to satisfy an area quota.

#### Dominant media

- A photograph or governed proof MAY occupy the complete scene background or span multiple grid tracks.
- An implementation MUST NOT reduce a useful photograph to a small card solely to preserve a separate empty column.
- Full-bleed media is encouraged when it improves context, recognition, emotional truth, or the reader’s entry into the scene.
- Crop and position the media first. Add a deterministic gradient/scrim only when needed for hierarchy or contrast. Add a separate opaque panel only when the first two methods cannot pass.
- A full-bleed image remains one dominant visual; it does not create an additional visual group merely because text is placed over a calm part of it.

#### What may appear inside the quiet region

A quiet region MAY contain **one dominant message group** or **one dominant proof/object** when the surrounding field remains calm. It MUST NOT contain secondary navigation, chip rows, multiple cards, floating utilities, decorative motifs, repeated badges, unrelated controls, or competing calls to action.

When the dominant message sits over the quiet region:

- the message group remains one visual group;
- its text and one primary action MAY occupy the region;
- the remaining field must still read as calm at delivered size;
- body copy, metadata, and secondary actions MUST NOT spread across the full region;
- the gradient/scrim MUST preserve a clear start point and sufficient text contrast;
- the region MUST NOT become a generic hero card over a photograph.

#### Media protection

Text and interface MAY sit over genuine negative space or a subdued non-evidence area. They MUST NOT cover:

- faces;
- hands that carry the meaning of the scene;
- product screens, maps, documents, or other material evidence;
- names, badges, or details needed to understand the real context;
- the focal action or relationship visible in the photograph.

#### Measurement

For responsive digital work:

- at `768px` and above, annotate one contiguous perceptually quiet region occupying at least `30%` of the visible promoted scene area;
- below `768px`, annotate one contiguous region occupying at least `20%`;
- neither annotated dimension may be less than `25%` of the scene’s matching visible dimension.

The annotated region MAY include the one dominant message group. Browser evidence records:

```yaml
quietField:
  sceneId: ""
  viewportOrCanvas: ""
  regionRect: { x: 0, y: 0, width: 0, height: 0 }
  sceneVisibleRect: { x: 0, y: 0, width: 0, height: 0 }
  regionAreaRatio: 0
  contentInside:
    dominantMessageGroup: true | false
    dominantProofObject: true | false
    secondaryUI: false
  backgroundType: flat | gradient | photo_negative_space | photo_scrim | mixed
  manualLowDetailReview: pass | fail | open
  focalObjectPreserved: true | false
  evidenceRef: ""
```

The geometric threshold is necessary but not sufficient. Manual review MUST confirm that the region is genuinely calm, not simply large.

#### Failure conditions

A promoted scene fails `[SPACE-01]` when:

- the “quiet field” is recognizable as a separate decorative block;
- the photograph or proof becomes materially smaller without improving meaning;
- the region contains multiple visual groups or secondary UI;
- the gradient creates a hotspot away from the intended entry point;
- a full-bleed image hides or falsifies its subject;
- adding or removing the quiet block leaves the reading path unchanged, showing that it was filler;
- reviewers cannot point to the intended calm region or disagree on what the scene asks them to notice first.

Mark the annotated region with `data-quiet-field`. The attribute identifies the QA region; it MUST NOT create visual styling by itself.

### 4.6 Navigation and utility budget `[FLOW-05]`

| Context | Rule |
|---|---|
| Top-level destinations | maximum 5; use fewer when the task is linear |
| Desktop header | maximum 4 visible controls/links after the logo |
| Mobile header | maximum 2 visible controls after the logo; remaining utilities in one labelled menu |
| Search | one mechanism only; omit unless the reference set genuinely needs search |
| Theme | when `visibleOverride: true`, one labelled settings control MAY expose declared themes; it MUST NOT show three peer buttons in the main header; when false, render no theme control |
| Language | one compact selector; render only when `additionalLanguages` is non-empty |
| Current location | visible in navigation, heading, or step state |
| Exit/back | one action from every modal, lab, or nested reference |

If desktop navigation collapses, a keyboard- and touch-usable replacement MUST exist. A dialog MUST have a visible Close control; “Press Esc” is not a mobile solution.

### 4.7 Mobile priority `[FLOW-06]`

Responsive design MUST NOT hide the user decision, first AHA, next useful action, recovery, or essential evidence to save space. Collapse supporting metadata into a labelled disclosure instead.

Production and full-reference work MUST NOT overflow at `320`, `360`, `390`, `768`, `1024`, `1180`, or `1440` CSS px, Thai at `130%`, or at `200%` zoom. A scoped internal mockup may test fewer declared combinations but MUST NOT claim production validation.

---

## 5. Core Guidance — recognizably Landometer visual system

### 5.1 Official identity `[VIS-01]`

- Use an approved full-color or approved outline-gray logo asset.
- Preserve intrinsic aspect ratio, clear space, and minimum size.
- The product MUST NOT redraw, trace, recolor, crop, distort, animate, mask, or reconstruct the logo.
- If the approved asset is missing, an `internal_demo` with internal/private visibility MAY show a labelled placeholder and MUST NOT create a text logo or AI approximation. A placeholder cannot pass production or `designsystem.adoption` release.
- Protected Brand Blue MUST remain exact `#1D4497`, including dark mode; it has no light/dark derivative.

### 5.2 Logo and surface pairing `[LOGO-SURFACE-01]`

1. After the exact asset ID, variant, and SHA-256 are registered and the current Brand identity authority or documented delegate approves the pairing, use the transparent horizontal lockup for a header, first encounter, or corporate signature unless that authority approves another exact variant.
2. Place the transparent asset directly on its governed surface only when `identityApproval.decision: direct_surface`, exact asset/surface/theme records, and actual-size recognition pass. Cream, beige, white, or another matte MUST NOT be baked into the logo file by an implementer.
3. `exception_integral_background` requires `identityApproval.decision: integral_background` for that exact artwork, asset, surface, and scope.
4. A separate plate is a layout component, not part of the logo. It requires `identityApproval.decision: separate_plate` and its exact opaque `surfaceRef`, preserves Brand-authority-confirmed clear space, and contains only the intact official logo. Status, version, environment label, tagline, CTA, icon, caption, border ornament, and other graphics stay outside the plate and clear space.
5. On a busy photograph, map, gradient, or data layer, use this order: move the signature to a clean approved adjacent surface; use an exact backdrop-specific variant only when the Brand identity authority approves it; otherwise use an approved full-colour or outline-gray asset on a separately approved opaque light plate. If no pairing is approved, block release.
6. Glass blur, frosted or semi-transparent tiles, backdrop filters, CSS `filter` or `invert()`, blend modes, runtime/CSS opacity treatment, altered alpha, recoloring, sampled brand colors, and reconstructed artwork MUST NOT rescue contrast. This prohibition does not remove the inherent alpha channel of an approved transparent file.
7. A dark/reversed or recoloured variant is unavailable unless a dated Brand-authority amendment approves that exact artwork, ID, variant, and SHA-256. Dark mode otherwise uses an approved clean-surface or plate pairing.
8. Use the symbol alone only in an approved compact, app-icon, or favicon context. A normal header uses the horizontal lockup.
9. Clear space surrounds the visible official artwork but uses only the Brand identity authority’s approved measurement for that asset. Do not crop, trim, clip, mask, or rewrite the approved file, including its transparent canvas. Excess canvas requires a separately approved trimmed variant with a new ID and hash.
10. The Brand Guidelines’ minimum print width remains `10 mm`. A production minimum CSS width comes from the approved asset manifest; an agent MUST NOT infer one from a screenshot.

Asset ownership, file custody, manifest registration, token existence, or registry membership never grants identity approval. Every approval record carries a version, validity window, evidence, exact scope, and all declared theme/backdrop pairings. A non-expiring approval records `expiresAt: null`; an omitted expiry is unresolved.

### 5.3 Positive-energy composition `[VIS-02]`

Across the primary route, the preferred visual character draws from:

- one bold flat field, one governed gradient atmosphere, or one full-bleed real image with a deterministic gradient/scrim;
- confident display type and a clear first reading point;
- real Landometer people, field work, product use, city context, or presentation evidence at a scale large enough to remain meaningful;
- asymmetry that creates direction without introducing filler blocks;
- one purposeful spectrum or atmosphere moment when it serves the route;
- visible measurement, layer, progress, or handoff when it is real;
- perceptual quiet around or behind the focal idea.

This is a route-level visual language, not a per-scene checklist. Each scene uses only what serves its one job; spectrum, atmosphere, measurement, and photography MAY be omitted when irrelevant.

- A dominant photograph SHOULD remain large enough to carry context and recognition. Do not shrink it merely to create a separate quiet column.
- The gradient surface MAY be the primary brand-memory device of a scene when its declared job passes `[SURFACE-01]`.
- Positive energy MAY come from a large color field and the direction of the composition, not only from small accent colors.
- The eye SHOULD begin at the intended message or proof, then move toward the next action. Surface color, image crop, and gradient direction work together to create this path.
- Use approved candid team images before generic stock. Show collaboration, curiosity, making, presenting, field observation, or a product in use. Historical hiring posters and decks are evidence of color and spirit, not density templates.
- Photography MUST keep its real context. An alt description or caption MUST NOT invent what people are doing. Institution/event logos visible in a photograph MUST NOT be treated as automatic proof of endorsement or partnership.

### 5.4 Human evidence and photography `[PHOTO-01]`

- `designsystem.adoption` MUST use an approved real Landometer team/work/place image in its opening route. Generic stock and AI documentary imagery are prohibited there.
- Choose photographs that show work, collaboration, presenting, field observation, product use, or a real shared moment. A posed group portrait MAY support identity; it does not replace work proof.
- Use at most one photograph per promoted scene; only the adoption opening requires one. The photograph MAY be full-bleed, span the complete scene, or sit beside the message. Keep faces, hands, product screens, maps, documents, and material evidence unobscured. Text/UI MAY sit in genuine negative space or over a deterministic governed gradient/scrim on a non-evidence region. It MUST NOT cover a person or convert the person into background decoration.

Use this decision order:

```txt
preserve subject and context
→ choose crop and focal position
→ use natural negative space
→ add governed gradient/scrim for hierarchy or contrast
→ use a separate opaque panel only when necessary
```

- A gradient overlay MUST NOT falsify the event, invent lighting, obscure context, or make privacy redaction look like cinematic treatment.
- A full-bleed image does not fail quiet-field requirements when a measured perceptually calm region remains and the focal subject is preserved.
- The generic-photo substitution test applies to the complete image/crop/overlay composition, not only to the source file.
- Crops preserve enough context to understand the scene. Do not use logo-shaped masks, circular headshot mosaics, synthetic depth blur, or a color treatment that falsifies the record.
- Record permission, context, date when material, crop/edit, alt text, and credit. Institution or event marks in a photo do not imply partnership or endorsement.
- Match every rendered photo/work image to its Build Card `mediaAssets` record. Source/owner, creator credit, context/date, dimensions, exact variant/hash, crop/redaction, alt, displayed credit, approved use, and privacy/screen review are release evidence rather than optional prose.
- Review visible screens, chats, documents, names, badges, locations, and personal data before use. Crop or redact private material and record the edit. Privacy redaction is a permitted exception to the ban on synthetic blur; decorative/fake depth blur remains prohibited.
- If replacing the photograph with a stock skyline or generic office scene preserves the same meaning, the photograph choice fails.

### 5.5 Anti-generic visual gate `[VIS-03]`

The following patterns fail when they are not needed by a real task:

- a floating dark dashboard card over a human photograph;
- endless rounded SaaS cards or a bento grid for unrelated ideas;
- pill clusters used as headings or decoration;
- glass blur, ungoverned gradient blobs, aurora fields, glow clouds, radial decoration, or shadows on every surface;
- a command palette on a small reference set;
- a gradient without a declared entry, orientation, transition, momentum, closure, or product-identity job;
- a visible “quiet block” that acts as a third decorative component;
- connector lines, loops, or arrows that do not encode a named sequence, direction, dependency, causality, or handoff;
- abstract governance metrics before a real Landometer proof;
- hover lift on a non-operable card;
- identical icon-card layouts for every principle;
- stock skyline or AI-generated city imagery when real evidence exists.
- literal plants, sprouts, city silhouettes, gauge fragments, flying particles, or growth metaphors used as the primary source of “cultivate” or energy.

`designsystem.adoption` fails release when the recorded five-reviewer recognition/substitution protocol in §10.2 misses its threshold.

Run a decoration-and-surface deletion check. Remove cards, badges, motifs, connector lines, glows, and gradients one class at a time.

- If comprehension or focus improves, remove the item.
- If a governed gradient clearly improves entry point, reading direction, transition, or closure, retain it and record its `[SURFACE-01]` role.
- If removing a connector does not change the understood relationship, remove it.

### 5.6 Color roles `[VIS-04]`

Use color by semantic ownership. Appendix A is the canonical active-authoring table; frozen compatibility-only IDs are handled by `[TOKEN-01]` and the generated package, never copied into a local palette.

| Role | Use | MUST NOT use for |
|---|---|---|
| `brand.*` | master-brand identity | data, status, generic focus |
| `energy.*` | controlled human/cultural brand expression | data, status, evidence state |
| `surface.*` / `text.*` | page hierarchy and readability | brand claim by itself |
| `interaction.*` | focus, selection, action | brand signature |
| `semantic.*` | success, warning, danger, info, pending | category identity |
| `product.*` | product identity beside product name/route | chart, map, status |
| `series.*` | nominal categories | magnitude or decoration |
| `dataviz.*` | continuous/diverging magnitude | product or status identity |
| `map.*` | hover, selection, focus | category or brand role |

v0.8.6 introduced the four exact 2025 accent values as separately governed `energy.*` expression tokens; v0.8.8 retains them unchanged. When a scene intentionally uses `energy.*`, it uses at most one or two and MUST NOT dump all four into a gradient. The v0.8.8 public-safe package MUST supply the generated Schema 6 values and provenance before package-level v0.8.8 release. Artifact conformance still requires applicable rendered contrast and role-use evidence. These roles MUST NOT sample, alias, or recolor official logo artwork.

Token Schema 6 also adds the missing light `interaction.accent` role at `#176B82`, paired with retained `dark.interaction.accent` at `#68C4E2`. Default links and primary actions use this role for label/border; hover/selected add the canonical `surface.blueTint`, active may use `surface.soft`, and focus remains the separate focus-ring token. This deterministic outline/surface recipe avoids inventing an inverse-text token or misusing Brand Blue; filled Brand Blue actions are not permitted.

Landometer-controlled UI, text, charts, maps, illustrations, motifs, previews, exports, presentations, social graphics, and agent-generated assets MUST NOT introduce violet, purple, periwinkle, lavender, iris, plum, orchid, fuchsia, cool/electric magenta, terracotta, brick, clay, rust, sienna, burnt orange, earth red, or brown-orange as a controlled accent, categorical, product-identity, dataviz, or motif family. Bright coral, Signal Orange, yellow, and Warm Pink MAY appear only through exact approved tokens and named roles. This policy does not remove Brand Beige, exact warm-neutral surface/semantic tokens in Appendix A, source photography, unalterable third-party marks, or clearly labelled historical evidence; none creates a reusable accent alias.

### 5.6A Brand-atmosphere surfaces `[SURFACE-01]`

A governed gradient MAY act as a large surface, photographic overlay, transition field, or focal proof surface when it improves one of these jobs:

1. **Entry:** make the intended first reading point obvious;
2. **Orientation:** distinguish a major route or brand moment;
3. **Transition:** carry attention from evidence to meaning or from meaning to action;
4. **Momentum:** make credible progress feel active without adding controls;
5. **Closure:** bring the route to one shared action or takeaway.

A gradient is not decoration by default. Every gradient surface MUST declare its job:

```yaml
gradientSurface:
  sceneId: ""
  role: entry | orientation | transition | momentum | closure | product_identity
  recipe: measure | ground | cultivate | product_specific
  sourceTokenRefs: []
  angle: ""
  focalTarget: ""
  readingDirection: ""
  foregroundStrategy: bare_tested | deterministic_scrim | opaque_panel
  logoPairing: none | separately_approved
  contrastEvidence: ""
  evidenceRef: ""
  deletionTest: improves | neutral | worsens
```

`deletionTest: neutral` or `worsens` removes the gradient unless an owner records a narrow exception.

#### Approved atmosphere recipes

These recipes introduce no new raw color values. They reuse exact Appendix A values carried into v0.8.8 and are implementation recipes rather than new color tokens.

| Recipe | Exact source | Intended job |
|---|---|---|
| **Measure** | `signature.gradient.closing.light` / `signature.gradient.closing.dark` | direction, measurement becoming action, route closure |
| **Ground** | stop sequence of `motif.gradient.civicCool`: `#147A9F → #3BD3CB → #3BD19B` | place/context reveal, collaboration, evidence becoming understandable |
| **Cultivate** | stop sequence of `motif.gradient.civicWarm`: `#C33F55 → #FF8A4C → #F4C44E` | human action, completion, credible momentum |
| **Product-specific** | the selected product gradient in Appendix A4 | product identity only; never shared Landometer atmosphere by implication |

The use of the Ground or Cultivate stop sequence as a **surface recipe** does not clear the `[MOTIF-01]` vector/hash gate and does not authorize an invented motif asset.

#### Allowed placements

A governed atmosphere recipe MAY be used as:

- a full-bleed scene background;
- an overlay over a full-bleed photograph;
- a large proof surface;
- a transition band between two major route phases;
- the closing shared-action surface;
- a product-identity field inside the correct product scope.

#### Cadence

A genuinely long adoption or brand route SHOULD use two to four major atmosphere moments. A short route SHOULD use zero to two. These are not quotas.

- One viewport has at most one dominant gradient surface.
- At least one restrained flat, photographic, or evidence-led scene separates two major gradient moments.
- A gradient MUST NOT appear on every card, every section, every button, or every proof.
- The three semantic promoted moments in `[BRAND-04]` remain exactly three; a gradient is a surface treatment, not a fourth meaning moment.
- Product gradients remain product-specific and MUST NOT become the shared master-brand background by convenience.

#### Reading direction

The gradient’s light, saturation, and directional movement SHOULD guide the eye toward the intended message, proof, or action. It MUST NOT create a brighter or more saturated destination that competes with the focal target.

The implementation records the intended reading direction and verifies it through first-glance review. Angle may adapt to the composition, but stop order and color values remain exact.

#### Contrast and photographic overlays

- Bare text over a gradient requires sampled contrast under the actual glyph bounds.
- When any sample fails, use a deterministic tonal scrim or an approved opaque panel; do not alter canonical gradient colors to rescue contrast.
- A photographic overlay MUST preserve context, skin tone, evidence, and the truthful appearance of the scene.
- A scrim MAY vary spatially to protect text while leaving the subject clear. It MUST NOT simulate depth, invent lighting, or make a documentary scene look like a different event.
- Official logos require their separately approved surface pairing. A gradient recipe does not grant logo approval.

#### Prohibited gradient behavior

The following fail:

- ungoverned rainbow or multi-family gradients;
- aurora blobs, glow clouds, radial decoration, or gradient noise used as generic AI/SaaS styling;
- using all `energy.*` colors in one gradient;
- using a product gradient outside its product identity;
- encoding analytical magnitude, status, or map state with a brand-atmosphere gradient;
- placing a gradient behind every card or section;
- a gradient whose removal improves comprehension;
- a gradient whose hotspot redirects attention away from the user’s job;
- using gradient as a substitute for evidence, interaction state, or a real next action.

### 5.7 Typography `[TYPE-01]`

| Role | Font | Weight |
|---|---|---:|
| English brand/display heading | Arvo | 700 |
| Thai brand/display heading and editorial subheading | IBM Plex Sans Thai Looped | 700 |
| English Product UI heading/card title | Arvo | 700 |
| Thai Product UI heading/card title | IBM Plex Sans Thai Looped | 700 |
| Thai and English body/UI, navigation, buttons, forms, labels, and compact controls | Bai Jamjuree | 400 / 600 |
| English editorial subheading/brand label | JetBrains Mono | 700 |
| Numbers and technical labels | JetBrains Mono | 500 / 700 |

This retains the explicit v0.8.5 locale-specific Product UI migration. A Thai brand, editorial, or Product UI heading uses IBM Plex Sans Thai Looped even on a mixed-language page; an English brand/Product UI heading uses Arvo and an English editorial subheading uses JetBrains Mono. Genuinely mixed headings mark language spans and retain one dominant heading language. JetBrains Mono MUST NOT be used for long prose. Body prose SHOULD remain within 72 characters per line; dense Thai prose SHOULD target about 60–66 characters where practical.

Fonts MUST follow the exact six-face delivery, fallback, and leading contract in Appendix A11. They MUST be packaged or self-hosted for production/portable delivery; a remote font host MUST NOT be the only critical source. Production/portable HTML QA waits for `document.fonts.ready`, verifies computed family/weight, line height, fallback, Thai/Latin glyph coverage, and passes with third-party requests blocked. Static export validates the exact packaged/embedded faces, weights, glyphs, line metrics, and absence of synthetic substitution in the authoring/export pipeline before capture.

### 5.8 Layout, radius, and depth `[LAYOUT-01]`

- Use the spacing, container, breakpoint, radius, and elevation tokens in Appendix A.
- Default content uses grid alignment and open surface rhythm.
- Default cards rely on surface and border; shadow indicates real elevation or overlay.
- Pills are for status, compact filters, or tags—not generic section decoration.
- A page MUST NOT create its own radius, breakpoint, shadow, or z-index system.
- Meaningful alignment comes from shared grid/plot tracks, not independent flex distribution or absolute offsets.
- A layout MUST NOT create a dedicated tinted or rounded “quiet column” solely to satisfy `[SPACE-01]`.
- Dominant media MAY span the full grid or sit behind the message when `[PHOTO-01]`, `[SURFACE-01]`, and `[A11Y-01]` pass.
- Use grid tracks, crop, overlap, and surface continuity to create hierarchy; do not insert filler objects between message and proof.
- Overlay is valid only when the overlaid item is the one dominant message/action group and does not obscure people or evidence.
- Relationship lines use `[RELATION-01]`; independent absolute paths are prohibited when shared grid alignment or ordered labels communicate the same meaning.

### 5.8A Connector and relationship integrity `[RELATION-01]`

A line, arrow, curve, path, bracket, dashed route, or loop is a semantic component. It MAY appear only when it helps the reader understand a real relationship.

Every connector MUST encode at least one:

- sequence;
- direction;
- dependency;
- cause and effect;
- transfer or handoff;
- shared object/version;
- feedback or return path;
- spatial or temporal relationship.

Every connector records:

```yaml
connector:
  id: ""
  from: ""
  to: ""
  relation: sequence | direction | dependency | cause_effect | handoff | shared_object | feedback | spatial | temporal
  label: ""
  lineStyleMeaning: ""
  arrowMeaning: ""
  mobileBehavior: preserve | simplify | replace_with_ordered_labels
  accessibleAlternative: ""
  deletionTest: carries_meaning | neutral | comprehension_improves_without
```

Rules:

- Both endpoints are identifiable.
- Direction is obvious without relying on color alone.
- Solid, dashed, dotted, and animated styles have declared meanings; they are not visual variety.
- A loop appears only when the return path matters to the user.
- A connector MUST NOT cross copy, controls, faces, evidence, or another relationship without a clear diagram convention.
- Mobile behavior preserves the meaning through a simpler path or ordered labels.
- A connector MUST NOT exist only to make separate cards feel related.
- If the same meaning is clearer through proximity, alignment, numbering, or a shared container, use that simpler method.
- If removing the connector leaves the relationship unchanged or improves comprehension, remove it.
- Decorative connector motion is prohibited. Motion may reveal order once under `[MOTION-01]`.

### 5.9 Motif status `[MOTIF-01]`

`outline-motif-v2` remains **asset-gated** until an approved production vector and content hash exist. An artifact MUST NOT trace the logo or invent arcs from memory. Until the gate clears, use real photography, system flow, grid, exact product gradients, and evidence objects.

### 5.10 Theme `[THEME-01]`

Theme behavior follows the Build Card. Every new or materially changed interactive HTML artifact MUST support `dual`, default to **Auto/system**, and provide one accessible visible override. `static_export` is exempt. Any other fixed-theme interactive output requires a named, owned, expiring exception and cannot claim full v0.8.8 production conformance.

- Resolve a stored explicit Light/Dark/Auto preference, then the declared default, before first paint; `system` is valid only for `dual` support. Auto follows subsequent system changes.
- Synchronize CSS `color-scheme`, the browser `theme-color`, initial HTML identity, and rendered theme before first paint. The labelled control exposes and announces the current Auto/Light/Dark choice rather than only an icon.
- Render a choice through one labelled control/settings menu only when `visibleOverride: true`; it MUST NOT appear as three peer header buttons.
- Persist the explicit preference across reload/return and preserve task, scroll, locale, and component state through changes. If storage is unavailable, keep the current-session choice, expose no false persistence claim, and retain a usable Auto/system fallback.
- Minimal theme/locale preference storage is utility state, not business-object persistence: allow only documented theme and locale keys, no identity/object/content payload, no cross-user learning, and a visible reset. It does not set `capabilities.persistence` or load `[EFFECT-01]`; every other saved state does.
- Brand Blue stays exact `#1D4497`. Resolve the approved logo asset, canvas type, placement, Brand identity approval, and surface pairing before first paint for every declared theme mode. Prefer the approved transparent asset directly on a clean governed surface. A separate opaque light plate is valid only when `identityApproval.decision: separate_plate` matches the exact asset, surface, theme/backdrop, scope, and validity; never recolor, invert, filter, or rebuild the artwork.
- Charts, maps, logos, focus, semantic states, and product accents MUST have theme parity.
- Print defaults to light unless dark export is explicitly selected.

### 5.11 Language `[LOCALE-01]`

Interactive HTML shows exactly one active language per viewport and resolves valid URL choice → stored explicit choice → browser locale → declared fallback; fallback copy matches `<html lang>`. Use keyed content such as `{ id, th, en }` or pre-rendered locale blocks. Localization MUST NOT translate the whole DOM with exact-sentence matching, regex replacement, or a MutationObserver. Hidden language contributes no layout and is absent from assistive technology.

A static export uses exactly the Build Card language, records it in sidecar/export metadata, packages the correct glyphs, and shows no selector or hidden alternate. Every applicable delivery tests Thai expansion, long labels, search/index terms where present, punctuation, glyph coverage, and legibility on its declared viewport or canvas.

- Locale visibility CSS MUST hide only inactive locale content. It MUST NOT restore active elements with `display: initial`, because that can turn paragraphs and block components into inline content and change reading/action flow. Active elements keep their native or component-defined display role.

Keyed locale objects are a storage and rendering mechanism, not a translation workflow. Character and line-count budgets apply only after native-language drafting and meaning review. They MUST NOT trigger automatic truncation, fragmenting, abbreviation, or word-for-word compression. If reviewed copy does not fit, simplify the idea or revise layout within the density and quiet-field rules. Thai and English do not need matching line counts.

### 5.12 Shared Thai authoring behavior `[LOCALE-TH-01]`

**Applies when:** `artifact.language: th` or `additionalLanguages` contains `th`.

This rule governs Thai authoring quality across Landometer products. It never replaces or overrides the approved voice of the selected product or Profile.

```text
เห็นสิ่งที่เกิดขึ้นจริง
+ บอกให้ชัดว่าใครทำอะไร งานชิ้นไหน พื้นที่ไหน และมีหลักฐานอะไร
+ บอกว่าสิ่งนี้มีผลต่อการตัดสินใจอย่างไร
+ บอกว่าทำอะไรต่อได้
+ ไม่พูดเกินหลักฐาน
```

Interpretation:

```text
ภาษาธรรมชาติ ≠ ภาษากันเองตลอดเวลา
ภาษาง่าย ≠ ลดความสำคัญของงาน
ความอบอุ่น ≠ พูดแทนความรู้สึกของคนอ่าน
ความระมัดระวัง ≠ ทำให้หลักฐานที่ยืนยันแล้วดูไม่มีน้ำหนัก
```

Requirements:

1. Write the Thai sibling independently from the resolved Build Card and proof/evidence record. Do not translate or mirror the English sibling.
2. Start with reader, object, decision, evidence, state, material limitation, consequence, and action.
3. Use natural Thai subject omission when the actor is already clear.
4. Prefer direct Thai verbs and ordinary nouns to translated abstract nouns.
5. Keep an official or technical term only when precision requires it; explain it once in ordinary Thai.
6. Do not pile English labels into Thai prose or mix languages to make the writing look technical.
7. Preserve material meaning across languages, not sentence order, punctuation, word count, or line breaks.
8. Read promoted and task-critical Thai copy aloud. Rewrite any sentence a Thai colleague would not naturally use to explain the same work.
9. A Thai reviewer reviews the Thai artifact without relying on the English version.
10. Machine scoring and lint are advisory and cannot replace Thai editorial judgment.

Cross-locale material parity covers:

- object ID/version and the same person, place, or governed entity;
- facts, quantities, dates, units, and truth state;
- source ID/version/date;
- method or calculation status;
- geography, time, population, and unit boundary;
- confidence and material limitation;
- permitted/prohibited use and safety boundary;
- consequence, available action, recovery, and receipt state.

Any conflict in those fields is P0. A Thai-only naturalness review occurs first; a separate bilingual parity review then compares every locale with the canonical Build Card and evidence record. English is not the authority. Sentence structure need not match, but identifiers, quantities, dates, legal/safety wording, protected lines, and other governed values remain exact where their authority requires exact wording.

### 5.13 Motion `[MOTION-01]`

Motion explains feedback, state, sequence, or cause → effect. It does not manufacture energy. When `motionEnhancement: false`, nonessential reveal/stagger motion is omitted; feedback and reduced-motion/no-JavaScript meaning still work.

- Primary proof is visible immediately.
- Use 2–5 items for a meaningful stagger, `60ms` apart, `240ms` maximum group delay.
- Default reveal duration is `400ms`, distance `12px`, and it runs once.
- State changes normally finish in `120–280ms`.
- Motion MUST NOT use bounce, repeated pulse, shimmer, orbit, map parallax, or decorative autoplay.
- No-JavaScript and reduced-motion states show the complete final meaning immediately.
- Returning loops reveal only what changed and MUST NOT replay the hero.

When enabled, one signature sequence MAY express:

```txt
object/answer visible
→ measured change
→ context/evidence reveal
→ action or receipt settles
```

The object is visible immediately; status/metric is immediate or within `160ms`; meaning appears within `240ms`; the primary action is visible and operable within `320ms`. Loading beyond `700ms` shows an honest stage/progress state. Every interaction distinguishes **Trigger → Feedback → Decision → Outcome → Recovery**; feedback never impersonates authoritative completion.

Motion MUST NOT fill a quiet field, animate the official logo or documentary photograph, literalize “cultivate” with decorative growth, or replay on return. Generic scroll reveal is omitted unless it expresses a real reading or decision order.

---

## 6. Core Guidance — controls, states, and accessibility

### 6.1 Functional-control gate `[CTRL-01]`

Every visible control MUST have:

1. one distinct user job;
2. a clear accessible name at every breakpoint;
3. keyboard and touch behavior;
4. visible focus;
5. a meaningful navigation, state change, or real effect;
6. feedback and recovery when failure is possible;
7. a test that invokes it.

A toast or label change alone does not prove a promised action. Unavailable buttons MUST be omitted. A disabled primary CTA MAY appear only when the user can see why and can complete the missing requirement.

An artifact MUST contain zero empty links, placeholder destinations, hidden mobile labels, missing dialog closes, dead menu items, duplicate role selectors, or unimplemented share actions.

Every interactive artifact, including a labelled demo, MUST ship a control inventory at `qa.controlInventoryPath`:

```yaml
control:
  id: ""
  accessibleName: ""
  userJob: ""
  navigationOrEffect: ""
  finalState: ""
  failureRecovery: ""
  browserTest: ""
```

Browser-visible controls and inventory entries MUST match exactly. Every entry is invoked and reaches its asserted final state; demonstration-only controls still need a complete local state machine and reset.

### 6.2 Core components `[CTRL-02]`

| Component | Minimum contract |
|---|---|
| `BrandSignature` | approved asset; internal-only placeholder only under `[VIS-01]` |
| `Button` | native button, intent label, focus, busy/disabled, 44px target |
| `Link` | real destination, clear label, focus, external cue when useful |
| `FormField` | label, help, error association, retained input, recovery |
| `DecisionCard` | object, metric/status, meaning, evidence, one action |
| `SourceLedger` | source, publisher, date, supported claim, limitation |
| `TrustBadge` | visible status matches publication/index policy |
| `DataTable` | caption, headers, numeric alignment, mobile strategy |
| `MapLegend` | layer, method, units/classes, no-data, source/date, limitation |
| `EmptyState` | what is unavailable, why, honest next action |
| `ErrorState` | what failed, preserved state, retry or alternative |
| `Dialog` | name, visible close, focus containment/return, Escape, inert background |
| `Toast` | non-blocking status only; MUST NOT be the sole critical message |

### 6.3 Truthful state vocabulary `[STATE-01]`

Applicable interactive components define:

```txt
default · hover · focus-visible · active · selected · disabled
loading · partial · stale · reconciling · success · warning · error · empty
offline · restricted · permission-denied · retrying · cancelled · conflict
```

`partial` is not `success`; `no-data` is not zero; `modelled` is not observed; `sent` is not received; `received` is not understood; `share click` is not network effect.

Every transactional, analytical, handoff, or form flow preserves the governed object and input, shows the last known authoritative state, names what failed, prevents duplicate action, offers retry/alternative where possible, announces status accessibly, and ends with a durable receipt or clean exit. Destructive reset requires a deliberate decision.

Every promoted CTA binds its label to the immediate action, consequence, eligibility, disabled reason, pending state, authoritative receipt, failure recovery, and duplicate-action protection. One page state has one primary CTA. A network CTA cannot displace an unresolved decision or progress CTA.

### 6.4 Accessibility baseline `[A11Y-01]`

Interactive/web work MUST have zero critical/serious automated violations; one H1, logical headings, landmarks, and correct language; native HTML before ARIA; a full keyboard route with visible focus; 44 × 44 px buttons, icon buttons, navigation controls, chips, map markers, and primary CTAs; inline links with at least a 24 px line box; meaningful alt; color-independent meaning; accessible chart/map alternatives; announced status/error with preserved input; deterministic media contrast; and no missing Thai/Latin glyphs or synthetic weights.

A static image/social/campaign export instead MUST pass text legibility at delivered size, contrast and color-independent meaning, safe-area/crop, an alt/caption package, verified QR/link destination, and a logical reading order in its delivery wrapper. PDF/static-document/presentation delivery MUST use tags, reading order, alt text, and working links where the format supports them. Static equivalents are tested; keyboard, focus, H1, and live-region checks are not falsely applied to a JPEG.

Contrast acceptance:

| Pair | Minimum |
|---|---:|
| Normal text | `4.5:1` |
| Large text (at least 24 CSS px, or 18.66 px bold) | `3:1` |
| Focus indicator, active control boundary, and meaningful non-text graphic | `3:1` against adjacent colors |

Disabled or decorative content is excluded only when it carries no instruction, fact, state, or available action. Text over photography/video MUST pass at its worst rendered frame or use a deterministic opaque/scrim surface.

---

## 7. Trigger Packs — load only the matching branch

### 7.1 Analytical evidence pack `[DATA-01]`

**Applies when:** `analyticalEvidence: true`; metrics, ranks, comparisons, estimates, forecasts, recommendations, alerts, and decision results require it.

Every result MUST declare:

```yaml
analysis:
  decisionQuestion: ""
  objectId: ""
  objectVersion: ""
  objectAndScope: ""
  boundaryVersion: ""
  periodOrValidTime: ""
  claimLabel: verified | current | estimate | forecast | user_report | ai_synthesis | planned
  signalClass: observed | official | calculated | proxy | modelled | recommendation
  sourceAndDate: ""
  methodOrRecipe: ""
  recipeVersion: ""
  confidence: ""
  limitation: ""
  missingness: ""
  supportingSignals: []
  strongestCounterSignal: ""
  assumptions: []
  sensitivity: ""
  materialReversalWarning: ""
  allowedUses: []
  publishability: public | internal | restricted
  nextSafeAction: ""
```

Claim-label evidence is conditional and MUST remain visible at the claim or in its immediately reachable evidence detail:

| `claimLabel` | Minimum evidence |
|---|---|
| `verified` | source and verification date |
| `current` | source plus last-checked time/date |
| `estimate` | method, assumptions, range, and uncertainty |
| `forecast` | model/source, issue time, horizon, confidence, and limitation |
| `user_report` | reporter-safe status and verification state |
| `ai_synthesis` | source basis and material human-review status |
| `planned` | explicit planned/pilot/prototype/unavailable label; never presented as live |

Signal-class evidence is also conditional:

| `signalClass` | Minimum evidence |
|---|---|
| `observed` | observation time and coverage |
| `official` | publisher, release date, and scope |
| `calculated` | method, unit, period, and material inputs |
| `proxy` | visible **Proxy** label, rationale, and known bias |
| `modelled` | model/version, confidence, and limitation |
| `recommendation` | supporting signals, strongest counter-signal, assumptions, sensitivity, limitation, and next safe action |

Interface order:

```txt
Object → status/metric → meaning → evidence/limit → next useful action
```

Keep material source/date/confidence beside the claim. Full method MAY be disclosed later.

Missing never becomes zero. An external-provider ID never becomes the master identity. Boundary, unit, time, method, version, `allowedUses`, license/retention, and sensitivity remain attached to the governed object across human UI, share/export, and agent output. `partial`, `stale`, `restricted`, and incompatible-boundary states are visible and never silently upgraded.

For every recommendation, ranking, or decision result, `supportingSignals`, `strongestCounterSignal`, `assumptions`, `limitation`, and `nextSafeAction` are non-empty and visible. Material sensitivity is visible; if a plausible assumption, evidence gap, or weight change reverses the result, `materialReversalWarning` is non-empty and appears beside the result before action. Hard constraints and exclusions remain separate from weighted scores and MUST NOT be silently converted into soft preferences. This applies to every product/profile, not only CityMETER.

Before a materially slow, quota-consuming, credit-consuming, or externally billed run, show scope, source classes, expected duration class, user-visible cost/credit effect, cache/reuse status, and cancellation/retention behavior. The final receipt records the object/recipe version and authoritative result state without exposing supplier credentials or confidential pricing.

An analysis, score, recommendation, or agent MUST NOT make or execute an automated decision that affects an individual’s rights, access, eligibility, employment, credit, housing, health, safety, public benefit, or another protected consequential outcome unless a separately approved governance record names the lawful purpose, accountable owner, validated method, appeal/correction route, and meaningful human review before effect. Lacking that approval, the output is decision support only and cannot trigger the consequential action.

### 7.2 Data-visualization pack `[DATAVIZ-01]`

**Applies when:** `dataVisualization: true`.

Start with the decision question:

| Question | Preferred form |
|---|---|
| Which is larger or ranks first? | sorted horizontal bar or dot plot |
| How did it change over time? | line, step line, or small multiples |
| What is the distribution? | histogram, box plot, strip/dot plot |
| Are two measures related? | scatterplot with labelled outliers |
| How is a whole composed? | 100% stacked bar; treemap only for a real hierarchy; table when precision matters |
| How does a value vary across governed areas? | choropleth with the real polygon/boundary plus a named three-anchor scale; also load `[MAP-01]` |
| What pattern exists in a matrix or justified continuous density/intensity field? | heatmap with explicit row/column or spatial-density meaning and a named three-anchor scale |
| Are we on target? | bullet/target bar or actual-versus-target dot |
| How uncertain is it? | interval/error bar or confidence band |

Charts MUST NOT use pie, donut, semi-donut, exploded pie, nested donut, circular gauge-as-composition, or circular part-to-whole forms.

A choropleth is not a heatmap. Governed-area polygons, a matrix, and a continuous density field are different objects and MUST NOT substitute for or prove one another.

Every chart shows units, period, source/basis, direct labels where practical, no-data and meaningful zero, and an accessible alternative. Use canonical values from Appendix A; product code MUST NOT generate local colors or runtime gradients.

Continuous scales use the canonical 41-stop build-time LUT and named 5/7/9-class subsets. Renderer, legend, accessible alternative, and export carry the same parity record: scale/LUT version, classification method, domain, thresholds/breaks, no-data, zero, neutral, and outlier policy. Any stale or mismatched field blocks rendering. All applicable scales pass light/dark, adjacent-anchor, grayscale, CVD, cross-scale confusion, 200% zoom, and accessible-table checks.

Product-pinned generated amCharts and CityMETER canvas adapters consume that same canonical registry. A chart library palette MUST NOT run after the Landometer theme. Adapter evidence covers accessibility, dispose/recreate without leaked state, reduced motion, theme change, and export parity; product code does not hand-copy colors or classification logic.

### 7.3 Map pack `[MAP-01]`

**Applies when:** `map: true`.

A map MUST read as a place. Include governed geometry plus useful road, water, transit, landmark, name, boundary, or orientation context. Selection updates geometry, legend, readout, evidence, next action, and accessible alternative from one state.

Hover, selected, focus, category, magnitude, semantic status, and no-data use separate token roles. A surface MUST NOT use arbitrary polygons as decorative “map proof.”

Loading, partial, stale, empty, error, offline/restricted, selected, focus, and recovery states are implemented only where the map can enter them. The map, legend, readout, source, accessible alternative, and `scaleVersion` remain synchronized.

### 7.4 Share and recipient-value pack `[SHARE-01]`

**Applies when:** `share: true` and a real public-safe object or permission-safe internal object exists.

```txt
AHA visible
→ user understands the object
→ one contextual share/handoff action
→ preview exact safe object + useful text + limitation + URL/route
→ delivery receipt
→ recipient lands on the same object
→ recipient AHA
→ recipient useful action
→ only then MAY a network outcome be claimed
```

Rules:

- A share/invite prompt MUST NOT appear before AHA.
- A page state MUST NOT promote more than one network action.
- Use one menu for additional destinations; share buttons MUST NOT appear on every section/card.
- Local preview with no public URL MUST NOT promise LINE, Facebook, or exact external sharing. Offer a clearly labelled draft-copy action only if useful.
- Show intended recipient, visibility, and current limitation.
- Strip private filters, notes, identities, permissions, sensitive locations, and restricted IDs.
- A send/copy success is a handoff receipt, not network effect.
- A destination package contains one accurate large image or permitted visual, useful text, the exact-object link/route, source/date/limitation, and a safe fallback. LINE, Facebook/public-web, native share, and generic-link adapters are versioned and verified against current platform behavior before use.
- Each enabled adapter records owner, platform, implementation version, last verified date, expiry/recheck date, exact-object fallback, and browser/device evidence. An expired or failing LINE, Facebook, native-share, or generic-link adapter is disabled rather than left as a dead destination.
- Public attribution MAY use non-identifying UTM values; canonical URLs remain parameter-free. Message content, recipient identity, contacts, clipboard content, private object data, and sensitive location MUST NOT enter telemetry.

### 7.5 Co-creation pack `[COCREATE-01]`

**Applies when:** `coCreation: true`.

A contribution prompt MUST NOT render until submission, moderation, receipt, correction/withdrawal/dispute, visibility, retention, sensitive-data control, and failure recovery work. Every contribution records governed object/version, contribution type, provenance, timestamp, moderation status, visibility, retention, and `impactClaim: none_until_verified`. Submission or acceptance MUST NOT be presented as verified impact before review. Show only the user benefit the implemented contribution path can support.

### 7.6 Search pack `[SEARCH-01]`

**Applies when:** `search: true` and the content set cannot be navigated clearly without it.

- Use one search mechanism.
- Index each locale directly; the system MUST NOT translate an English-only index with alias hacks.
- Use native input semantics or a complete combobox/listbox pattern.
- Show result count, current selection, keyboard instructions, empty state, and visible close on touch.
- Search results restore the exact route/state.
- When `fullLivingReference: true`, the index covers rule IDs, tokens, patterns, proofs, fixtures, products, evidence, and Changes, and every result restores the exact active mode/specimen rather than a nearby heading.

### 7.7 Publication and privacy pack `[PUB-01]`

**Applies when:** every artifact; execute only the matching public/internal/private, sensitivity, telemetry, and sharing branches.

- Rendered visibility, `TrustBadge`, metadata, canonical URL, indexing, telemetry/analytics, and sharing MUST match the Build Card.
- Public visibility requires `sensitivity: public` or `redactedPublicProjection: true`; a redacted projection MUST keep raw confidential/restricted fields out of client code, metadata, logs, and shared objects.
- Public metadata and previews MUST describe the reachable artifact and contain only public-safe assets/claims with permission. Canonical and public social-preview URLs are absolute HTTPS. A local or provisional file MUST NOT claim a live canonical URL.
- Internal/private output MUST set `indexable: false` and MUST NOT expose public metadata, public analytics, or public sharing. `noindex` is not an access-control mechanism.
- Enabled telemetry declares purpose, data classes, scope, retention, consent/legal basis when applicable, and deletion/access controls; disabled telemetry emits no tracking request.
- Personal, confidential, or restricted material requires declared collection basis, minimum fields, access, retention/deletion, redaction, export rules, and a visible current status before release.
- `source_limited` or provisional evidence MUST remain labelled at the claim and MUST NOT be upgraded by polished presentation.
- A public release MUST pass permission/license, private-state stripping, metadata, canonical-route, and blocked-third-party checks.
- `indexable: true` is valid only when delivery is `deployable_public`, visibility and sensitivity are public, evidence is `verified`, the canonical URL is reachable, and permission/license, metadata, and private-state checks pass. `provisional`, `source_limited`, internal, and private artifacts remain non-indexable.
- Public deployable HTML carries initial-HTML metadata agreeing with visible content: canonical, robots, title/description, Open Graph including `og:site_name` and `og:locale` when applicable, locale/hreflang, truthful structured data, and the exact preview asset. `noindex` is not access control.
- Public-web release evidence records exact title, description, canonical, robots, `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, preview width/height, preview alt, `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`/alt when that channel is enabled. The preview uses the required current platform dimensions for its destination and passes permission, safe-crop, filesize, and reachable-URL checks; no unverified dimensions are invented in this master.
- A static image/PDF/presentation export carries truthful sidecar, XMP, platform caption/alt, language, credit, and destination-link metadata where its format/channel supports them. Its separately verified destination—not the asset—owns canonical, robots, Open Graph, and JSON-LD. The asset MUST NOT invent HTML metadata.
- JSON-LD or other structured data MUST describe the same visible entity, status, dates, author/publisher, and canonical URL. Materially misleading structured data is a P0 truth failure, not a metadata polish defect.

### 7.8 Persistence and external-effect pack `[EFFECT-01]`

**Applies when:** `persistence: true` or `externalSideEffect: true`.

- Before a consequential action, show target, scope, visibility, permission, cost/commitment, and what will happen next.
- Send, publish, invite, overwrite, delete, payment, and permission changes require an explicit confirmation proportional to risk.
- The operation MUST prevent accidental duplicate execution, preserve input, expose pending/partial/failure, and return a durable receipt with target, status, timestamp, and retry/recovery path.
- Success MUST reflect the real system result, not a toast, timer, or optimistic label. Unknown delivery remains pending/unknown.
- Undo, revoke, withdraw, or correction MUST exist when the underlying effect permits it; otherwise the irreversible boundary is visible before confirmation.
- Collaborator notifications, public visibility, spend, and downstream automation count as effects and MUST be declared and tested.
- Before notification opt-in, declare trigger, frequency, channel, quiet/limit behavior, and unsubscribe or disable route. A notification receipt confirms scheduling/delivery state only, not that a recipient understood or acted.

Analysis completion, verification, permission, publication, moderation, issue resolution, payment, deletion, delivery, recipient AHA, and network outcome MUST NOT be reported optimistically. Feedback confirms only that an input was received; authoritative completion comes from the responsible system state.

### 7.9 Voluntary investment and transparent learning pack `[LEARN-01]`

**Applies when:** `personalization: true` or `investment.mode` is not `none_no_honest_investment`.

- The user receives the promised AHA before an investment prompt and MAY leave after value. One page state SHOULD contain at most one investment prompt.
- The prompt states the user benefit. If no honest benefit exists, use `none_no_honest_investment` and omit it.
- Learning that changes a future default, ranking, recommendation, notification, or aggregate benchmark MUST disclose the input, improvement, personal/workspace/aggregate scope, permission basis, retention, and how to inspect, correct, disable, or delete it.
- Analytics alone MUST NOT be described as learning. Sensitive records, identifiable citizen data, private municipal records, and restricted provider fields are excluded from learning by default.
- Saved objects, watch/follow, correction, outcome report, and role actions require the applicable persistence/effect/co-creation contract plus a visible receipt.
- A decision/outcome memory is private by default and records object/version, decision, rationale, outcome, date, owner/workspace, and correction path. Sharing, aggregation/learning, and retention are separate explicit choices; one never implies the others.
- Every loop has a legitimate clean completion and exit. No guilt, streak loss, forced reshare, hidden unsubscribe, variable reward detached from the user objective, or pressure to continue.
- An investment is justified only when it improves accuracy, context, relevance, coverage, timeliness, trust, coordination, or the user’s real objective; the benefit is named and later inspectable.

### 7.10 Delivery and resilience pack `[DELIVERY-01]`

**Applies when:** every delivery; use only the matching row.

| Delivery | Release budget |
|---|---|
| `deployable_public` | HTML + critical CSS ≤120 KB gzip; initial JS ≤60 KB gzip; LCP image ≤250 KB where practical; initial transfer before lazy content ≤750 KB; critical third-party font/image requests 0; LCP ≤2.5 s; INP ≤200 ms; CLS ≤0.1 |
| `portable_single_file` | total HTML ≤2 MB by default; duplicate embedded binary 0; critical external requests 0; missing glyphs/broken critical images in blocked-network mode 0 |
| `static_export` | no task-critical JavaScript; fixed declared theme/locale; fonts and critical media packaged; links/QR destinations verified |
| `internal_demo` | visible demo/provisional status; no public/index/network claim; critical path still works with optional third-party requests blocked |

Every delivery MUST be tested with all third-party runtime requests blocked. Critical text, glyphs, facts, source, primary action, intentional media fallback, and core layout remain usable. Public/adoption/CityWiki/explainer/campaign pages and portable references provide a real no-JavaScript content/route baseline. An intrinsically JavaScript-dependent application instead renders an honest non-operable fallback naming what is unavailable and a safe route; enhancement-only controls are absent. A budget exception needs an owner, reason, measured impact, and expiry.

### 7.11 Authentication and permission pack `[AUTH-01]`

**Applies when:** `authentication: true`, `permissions: true`, or a visible identity, account, workspace, authorization-role, access, or permission control exists. A discipline/persona/content-route selector such as Product, Design, Engineering, or Marketing is not an access-role control.

- Request identity or access only when intrinsic to the promised task; explain why before the request.
- Show current account/workspace/role, requested scope, consequence, denial, expiry, revoke/sign-out, and recovery.
- A permission denial preserves the object and offers the safest available alternative. A role change or access grant is an external effect and uses `[EFFECT-01]`.
- Sign-in, avatar, account menu, locked premium feature, and fake permission dialog MUST NOT appear as decorative product chrome.

### 7.12 Context Discovery pack `[CONTEXT-01]`

**Applies when:** `contextDiscovery: true` and the product needs current external context.

- Compose a visible public-safe query from governed entity × intent; let the user inspect or edit it before an external request when the query could expose context.
- Label external results, provider, retrieval time, confidence/limitation, and whether the result was incorporated into the governed object.
- External discovery remains `discovery_only` and MUST NOT change the governed object, evidence class, recommendation, or authoritative state until reviewed, provenance-recorded, permission-safe, and deliberately incorporated.
- Preserve current task state on open, return, timeout, cancellation, empty, restricted, and failure. Never place private filters, identities, internal notes, customer criteria, or restricted IDs in a URL, query, referrer, or log.
- Context Discovery is conditional utility, not a default search box or reason to add a command palette.
- Each product maintains a short typed entity × intent support matrix in Reference; unsupported pairs fail honestly instead of silently broadening the query or object.

### 7.13 Agent output and bounded action pack `[AGENT-OUT-01]`

**Applies when:** `agentReadable: true` or `boundedAgentAction: true`.

- Human, agent, export, and shared views derive from the same `channelParityKey` and governed object/version. They preserve scope/boundary/time, leading result, supporting and counter-signals, missingness, source/update, signal class, confidence, limitation, `allowedUses`, permitted actions, visibility, and authoritative state.
- Agent actions are typed, scoped, permission-checked, idempotent where possible, and bounded to declared objects. Persistence, notification, collaborator effects, spend, publication, deletion, or permission change requires a human-readable preview and confirmation proportional to risk.
- The agent MUST NOT upgrade `partial` to `complete`, `modelled` to `observed`, `planned` to `available`, or a handoff to network effect.
- Every action returns a durable receipt or explicit failure/unknown state plus recovery. Hidden autonomous expansion of scope is prohibited.
- Agent output cannot make or execute the protected consequential decisions prohibited by `[DATA-01]`; a preview or human click does not replace the separately approved governance and meaningful review required there.

### 7.14 Full Living Reference and Proof Lab pack `[REFERENCE-01]`

**Applies when:** `fullLivingReference: true` with `designsystem.adoption`.

The default Adopt route remains sparse. Reference and Lab are separate modes and show one active proof/specimen at a time. Deep links restore mode, proof, state, theme, and locale. Evidence is complete, searchable, and collapsed until requested; Changes remains last. Proof navigation uses tested tabs, a complete combobox/listbox, or Previous/Next with visible index plus direct menu; it announces active proof, position, and total, never auto-advances, never requires swipe, and never steals focus on change.

Required proof IDs:

```txt
reward-before-request · decision-quality · private-by-default
relevant-circle-coordination · recovery-completeness · cta-integrity
transparent-learning · voluntary-investment · hook-without-dark-patterns
cross-team-handoff
```

Each proof shows only **User goal → Common failure → Try → Observable outcome → Evidence**, with Evidence closed by default. Every proof supports **user action → feedback → decision-relevant change → authoritative outcome/receipt → recovery or clean completion**. At least six provide neutrally labelled **Baseline / Assisted** views while keeping task, object, data, geometry, copy/content, consequence, and authoritative result identical except for mechanism-required labels; only the named assistance mechanism changes, and every intentional variable is disclosed. “Bad/Good,” shame, or loaded framing is prohibited.

Proof-specific minimums preserve the original intent without entering the Adopt route:

| Proof | Minimum interaction and outcome | Recovery/evidence minimum |
|---|---|---|
| Reward before request | reveal useful area insight before any save/account/permission ask; user may leave with value | timing trace and blocked pre-AHA prompt |
| Decision quality | compare at least two real options with evidence, uncertainty, and counter-signal; select, defer, or reject with rationale | preserved assumptions and incomplete-evidence branch |
| Private by default | create privately, then add one recipient/role explicitly; show exactly what leaves private scope | redaction preview, revoke path, permission failure |
| Relevant-circle coordination | choose intended role and hand off the exact governed object/version | recipient view, failed handoff, safe fallback |
| Recovery completeness | enter default/loading/empty/partial/offline/error/restricted/retry states; always show what remains possible | input/state preservation and accessible announcement |
| CTA integrity | change consequence and eligibility; label, state, disabled reason, and next action stay aligned | failure and duplicate-action protection |
| Transparent learning | inspect and change/disable inputs that alter a future recommendation; show scope and benefit | correction, opt-out, retention/deletion where applicable |
| Voluntary investment | after value, choose save/outcome/context investment or clean exit; benefit explicit and exit penalty-free | receipt, undo/delete, no hidden personalization |
| Hook without dark patterns | complete trigger → useful action → visible reward from the user objective | static anti-pattern explanation; no operable dark-pattern simulation |
| Cross-team handoff | follow one claim/object through Marketing, Product, Design, Engineering, Data/Evidence, QA, and recipient | mismatch branch names owner and blocking evidence |

Because `fullLivingReference: true` is a conformance claim, Lab coverage MUST include all of the following canonical fixture families; absent capabilities are still represented by truthful reference fixtures, not product controls:

- Scale Lab for all nine named scales in light and dark, producing 18 LUTs, with synchronized data/geometry/legend/readout, 5/7/9 classes, and perceptual warnings;
- one recognizable choropleth/polygon investigation task and one separate heatmap matrix fixture; neither counts as the other;
- one contextual typography proof for English/Thai display, Product UI, body, control, number, fallback, and long-copy roles;
- motion sandbox with Replay, Pause/show final, and a visible timing/event log; it covers first loop, same-session resume, saved-state return, at least two observed semantic transitions plus final state, reduced motion, and real no-JavaScript browser runs. Simulated toggles never substitute for the real reduced-motion/no-JavaScript evidence;
- cross-team meaning parity for one object through Marketing → Product → Design → Engineering → Data/Evidence → QA → recipient;
- complete source-derived coverage ledger with expected, rendered, interactive, verified, and missing IDs. A heading or specimen count alone is not coverage.

Every Proof/Lab specimen has a matching Build Card `referenceFixtures` record, uses complete local state and reset, and is labelled as a reference or QA aid. Its demonstrated capabilities remain fixture-scoped and never enable or imply a live product save, message, learning, analysis, recipient effect, or top-level capability. Fixtures appear nowhere in Adopt mode. Assign one exact role-relevant findability task per registered role, use at least one reviewer per role and at least five total participants, require at least `80%` completion per role and median time `≤3 minutes`, and record locale, viewport, theme, path, time, errors, and missing vocabulary. No task requires sequential reading of the master.

### 7.15 Telemetry pack `[TELEMETRY-01]`

**Applies when:** `telemetry.enabled: true`.

- Instrument semantic state, never animation completion, DOM selector, hidden engagement score, or decorative click.
- Allowlisted families include `aha_delivered`, `meaningful_action_completed`, `engagement_receipt_delivered`, `network_handoff_completed`, `recipient_aha_delivered`, `recipient_useful_action_completed`, `network_outcome_observed`, correction/outcome status, and strictly necessary QA events.
- Deduplicate by governed object/version and loop state. Do not record share message, recipient identity, contacts, clipboard content, private object data, unnecessary exact location, or inferred sensitive attributes.
- Measure recipient AHA/useful action separately from send/open. Raw shares, invite volume, reach, time-on-page, and viral coefficient are not success without a governed user/object outcome.
- Analytics is not transparent learning. If telemetry changes future defaults or recommendations, `[LEARN-01]`, persistence, privacy, inspect/correct/disable/delete, and the named user benefit also apply.

---

## 8. Profiles — load exactly one `[PROFILE-01]`

| Profile | One job | First AHA | Character | Profile-implied trigger |
|---|---|---|---|---|
| `designsystem.adoption` | help every role believe, try, align, and adopt | role-specific before/after within 30 seconds | human, bold, encouraging, unmistakably Landometer | approved photo/work proof; analytical packs only for an analytical specimen |
| `brand.public` | understand Landometer fit and find the right proof/path | opening proof object at first paint; inspectable detail may continue in the second viewport | human, proof-first, confident | documentary/brand proof; share only when separately enabled |
| `citymeter.dataset` | inspect a spatial signal and decide what to check/do | selected place/result with source and limitation | map/data-first, measurable | `analyticalEvidence: true`; map/dataviz when used |
| `citywiki.public` | understand a place quickly and confidently | sourced one-minute answer | editorial, warm, boundary-aware | `analyticalEvidence: true` |
| `product.app` | complete a task and understand state/recovery | truthful result or status receipt | compact, task-led, state-complete | capability-dependent |
| `citychat.app` | report, verify, prioritize, coordinate, and follow up safely | acknowledgement, current status/route, and next step | calm, mobile-first, consent- and status-led | persistence/effect only when real |
| `ijji.app` | diagnose a local-business problem and start achievable progress | diagnosis plus a credible 7-day direction | friendly, low-jargon, progress- and outcome-aware | learning/persistence only when real |
| `data.explainer` | understand a decision and evidence | 30-second answer plus primary proof | answer-first, readable | `analyticalEvidence: true`; dataviz/map when used |
| `campaign.public` | understand one message and take one action | promised proof in first viewport | expressive-short | share only after proof and hosting |
| `social.static` | communicate one point and send to one destination | message is understood without zoom | platform-safe, concise | destination journey only |
| `presentation` | follow a narrative and make/understand a decision | answer and proof early in deck | presenter-readable | evidence as needed |

### 8.1 First-AHA budgets `[AHA-01]`

| Profile/product | Maximum meaningful actions before AHA | Target |
|---|---:|---:|
| `brand.public` | `0` | specific opening proof visible at first paint; usable within LCP target |
| `citywiki.public` with precomputed content | `0` | one-minute answer and why-it-matters visible immediately |
| `citymeter.dataset` with precomputed result | `0–1` | `≤3s` |
| `citymeter.dataset` with live analysis | `1` plus essential scope | meaningful partial `≤3s`; full stage/time shown honestly |
| `citychat.app` | up to `3` short essential inputs | `≤10s` |
| `ijji.app` | up to `3` short essential inputs | `≤15s` |
| `designsystem.adoption` | one start action | role benefit visible within `30s` |
| `campaign.public` or the destination of `social.static` | `0–1` | promised object/result in first viewport |

When full analysis takes longer, deliver a meaningful partial result with visible assumptions and limits. Account, email, notification, contribution, personalization, save, share, or invite does not precede the AHA unless intrinsic and explained before the action.

Minimum network readiness preserves the v0.8.5 outcome contract without forcing a loud or premature control. `reference_ready`/`share_ready` describe identity and destination readiness; a visible action still requires `share: true` and `[SHARE-01]`. A portable/internal/static artifact that cannot meet the deployed minimum declares the honest lower mode and does not claim deployed-profile conformance. When sensitivity, permission, contract, or safety makes recipient/public behavior unsafe, `private_by_policy` with a recorded `network.policyReason` is a conforming safety replacement for the profile minimum—especially for CityMETER or ijji—and MUST NOT be treated as a growth failure.

| Profile | Minimum deployed readiness |
|---|---|
| `brand.public` | `reference_ready`; home/proof SHOULD be `share_ready` |
| `citywiki.public` | `share_ready` |
| `citymeter.dataset` | `relevant_circle` |
| `citychat.app` | `collaborative_object` or `private_by_policy` |
| `ijji.app` | permission-safe `relevant_circle` or `collaborative_object` |
| `data.explainer` | `share_ready` |
| `product.app` | `collaborative_object` when multi-user; otherwise the honest task-specific mode |
| `campaign.public` | `share_ready` |
| `social.static` | destination is `share_ready` |
| `presentation` | source package is `reference_ready` |

### 8.2 `designsystem.adoption` contract `[ADOPT-01]`

This profile exists to correct the v0.8.5 failure.

Default story:

1. **Cultivate:** `Let us cultivate our city.` with real team/work evidence, one CTA, and perceptual quiet created through composition, negative space, crop, or a governed atmosphere surface;
2. **Try:** one active role and one invariant Baseline/Assisted proof;
3. **Align:** the same governed object moves to the next role without changing truth;
4. **Culture:** one real team/work moment showing learning, ownership, or collaboration;
5. **Reference:** when `fullLivingReference: true`, open the useful exact rule/recipe and keep Lab separate; when false, provide one static takeaway/recipe and omit inactive mode controls.

The three promoted `[BRAND-04]` moments do not add three more scenes: Cultivate is the opening; Try contains the functional transition; Align and Culture stay restrained; the final Reference scene contains the closing shared-action moment and routes.

Opening voice:

- `Let us cultivate our city.` remains the exact protected Cultural activation line. Do not translate it into another public slogan or stack it beside the North Star and Promise.
- The supporting Thai sentence names the actual map, report, dataset, place, decision, or other work object resolved in the Build Card and connects it to the person who will use it next. It includes only the finding, source, material limitation, state, or next action needed for that opening.
- A generic `ชิ้นงาน` fallback does not satisfy the concrete city/place/decision cue in `[FLOW-03]`. If the object is unresolved, stop instead of publishing abstract support copy.
- The CTA says what opens next. `[เลือกงานที่จะลอง]` is valid only when it opens a real work-object selection; otherwise use the exact immediate action.

Rules:

- The product MUST NOT be called “Mission Lab.”
- A technical object card MUST NOT appear in the hero.
- Role selection occurs once, after the hero.
- The selector is sourced from the approved `adoptionRoleRegistry`, not a hard-coded four-role demo. Every registered role has one 30-second benefit proof and one take-away recipe/rule within two minutes; render only the active role and keep a long roster inside one accessible selector rather than a chip wall.
- Use one representative object across roles; adapt the interface, not the truth.
- Show only the active role and active proof.
- Baseline/Assisted keeps task, object, data, geometry, copy meaning, consequence, and authoritative result invariant; it changes only the named design-system mechanism.
- Search, complete token catalog, full chart gallery, share workflow, and QA controls live in separate modes and remain absent until requested.
- Share appears only after the reader experiences role value and only if exact sharing works.
- A real person/team image is not covered by UI chrome.

Success checks:

| Time | Reader can... |
|---:|---|
| 5 seconds | identify Landometer and understand the invitation |
| 30 seconds | see a concrete benefit for their own role |
| 2 minutes | take a recipe, prompt, or rule into real work |

The Align proof preserves object ID/version, user decision, claim boundary, truth status, source/limitation, and authoritative state through Marketing → Product → Design → Engineering → Data/Evidence → QA → recipient. Wording may simplify by channel; `partial` MUST NOT become `complete`, `modelled` MUST NOT become `observed`, `planned` MUST NOT become `available`, and handoff MUST NOT become network effect.

When the full Reference is enabled, every registered role task also passes `[REFERENCE-01]` findability: at least `80%` completion and median `≤3 minutes`.

### 8.3 Product/profile alignment `[PRODUCT-01]`

| Product | Compatible primary profiles | Experience character |
|---|---|---|
| Landometer | `designsystem.adoption`, `brand.public`, `product.app`, `data.explainer`, `campaign.public`, `social.static`, `presentation` | start with the work or decision; keep evidence, boundary, and next user visible |
| CityMETER | `citymeter.dataset`, `product.app`, `data.explainer`, `campaign.public`, `social.static`, `presentation` | start with the selected area or question; keep dataset, source, boundary, and enabled next check visible |
| CityWiki | `citywiki.public`, `product.app`, `data.explainer`, `campaign.public`, `social.static`, `presentation` | editorial, boundary-aware, practical |
| CityChat | `citychat.app`, `data.explainer`, `campaign.public`, `social.static`, `presentation` | calm, mobile-first, status-clear, consent-based |
| ijji | `ijji.app`, `data.explainer`, `campaign.public`, `social.static`, `presentation` | friendly, low-jargon, progress- and outcome-aware |

#### Landometer shared voice `[LDM-VOICE-01]`

Shared Landometer copy starts with the work or decision, states what is known and from which source, names the boundary that affects use, and shows who can use it next and for what. It remains product-neutral: it MUST NOT imply that every product uses the same dataset, workflow, score, or outcome.

Default movement:

```text
งานหรือการตัดสินใจที่กำลังพูดถึง
→ สิ่งที่รู้
→ รู้จากไหน
→ รู้อะไรได้แค่ไหน
→ ใครต้องใช้ต่อ และใช้ทำอะไร
```

#### CityMETER voice `[CITYMETER-VOICE-01]`

CityMETER copy starts with the selected area or question, names the dataset, source, date, and boundary, states what the data supports and does not support, and offers only checks or actions enabled by the supplied Product Brief and evidence. Mention place context only when it exists in that evidence.

Default movement:

```text
พื้นที่ที่กำลังดู หรือคำถามที่ต้องการตอบ
→ สิ่งที่ข้อมูลแสดง
→ ที่มา วันที่ สถานะ และขอบเขต
→ ข้อมูลนี้บอกอะไรได้ และบอกไม่ได้
→ สิ่งที่ตรวจหรือทำต่อได้จริง
```

CityMETER copy MUST NOT sound like dashboard labels joined into a sentence, a government memo, consulting filler, an AI summary, or promotional certainty. Flood, municipality, retail, F&B, land valuation, and other use cases remain product-instance evidence rather than universal CityMETER truth.

The selected product voice remains active across every compatible `data.explainer`, `campaign.public`, `social.static`, and `presentation` Profile. The delivery Profile changes hierarchy, length, interaction, and canvas; it does not replace product voice or evidence boundaries.

Every product keeps official identity, See → Understand → Decide → Act → Learn logic, truthful states, one profile-specific first AHA, and shared truth, clarity, grounding, accessibility, brand behavior, evidence, and action-quality gates. Its approved product voice governs public prose and may change stylistic posture, but no product voice waives those shared gates.

`product.app` cannot bypass a specialized product profile. Operational CityChat uses `citychat.app`; operational ijji uses `ijji.app`. Campaign, explainer, social, and presentation profiles keep the product-specific truth/privacy boundary without inheriting operational controls. A persistent multi-user workspace branch of `product.app` sets authentication, permissions, persistence, and external-effect capabilities true; loads `[AUTH-01]` and `[EFFECT-01]`; shows current workspace, governed object/version, and authorization role; distinguishes unsaved, saving, saved, offline, conflict, and failed states; records material activity in an inspectable audit trail; and resolves concurrent edits explicitly. Silent last-write-wins is prohibited. A read-only or local single-user branch omits those unavailable states/controls and declares the honest narrower capability set.

`brand.public` answers: what Landometer is, what decision/problem it helps with, what inspectable evidence proves it, which need/product/team is relevant, and the smallest useful next action. Route by user need before product names. Put the opening real place/work/product proof at first paint; its inspectable detail MAY continue in the second viewport. Provide direct routes to method/provenance, limitations, privacy, accessibility, and accountable contact without forcing a lead form.

`citywiki.public` declares `generationMode: A | B | C` independently from publication/index status and declares its actual `outputType`. It gives place identity/trust, sourced one-minute answer, boundary context, citable facts, verified versus live-check items, SourceLedger, last checked date, one next action, and agent-readable summary when enabled. Its AHA requires zero action; a recipient opens the same section/object without an account.

`citymeter.dataset` shows exact object/boundary/time, what changed, what matters, why to trust it, and what to do next. It defaults to **provisional** until verified. Every core recipe has a provider-neutral fallback or explicit degraded state; provider attribution and grounding remain visible; evidence versions are immutable and new evidence never overwrites history. Rankings separate hard constraints from scores and show supporting signals, strongest counter-signal, missing/stale evidence, sensitivity, field verification, source ledger, and safe action. Opaque scores and guaranteed outcomes are prohibited. A first result uses visible editable assumptions rather than requiring full model configuration.

`data.explainer` leads with question, short answer, primary evidence, what the data does not prove, method/source date, and decision/action. `campaign.public` has one promise, one audience, one proof set, one primary CTA, and truthful eligibility, dates, availability, privacy, and expectations. Recruitment also names the real role, responsibilities, work environment, application destination, and accountable contact. `social.static` declares platform, aspect, safe area, language, destination, alt/caption, export scale, and verified QR/link. `presentation` uses context → evidence → implication → decision/action and keeps sources readable on the actual room/screen.

`citychat.app` asks only what is needed to route safely; location precision, identity, media, and contact permission are requested only when necessary and explained. Every report gets a visible receipt and resumable status. Public sharing is available only for a governed public-safe status.

`ijji.app` bases its direction on essential context, visible assumptions, and why the action matters. The first investment is choosing a mission or later reporting the outcome. A receipt preserves mission, date, scope, and check-in. Future recommendations learn from consented outcomes, never a hidden engagement score; private sales, cost, staffing, or competitive information is not public by default.

---

## 9. Vibe-coding agent contract `[AGENT-01]`

### 9.1 What the agent reads

For a normal build, load only:

1. Build Card;
2. Core Contract;
3. Core Guidance in §§3–6;
4. selected Profile plus only its selected product voice; `[LOCALE-TH-01]` loads only when Thai is active or additional;
5. `[PUB-01]`, the matching `[DELIVERY-01]` branch, and only other applicable Trigger Packs;
6. only the needed token rows from Appendix A;
7. compact QA in §10.

The audit in §0, agent recipe in §9, migration in §§11–12, and Appendices B–D are onboarding or reference material, not default build context.

An agent MUST NOT sequentially translate this entire document into visible UI, turn a quiet-region record into a visible filler block, or draw a connector merely because the schema supports one.

### 9.2 Build order

```txt
1. Validate Build Card, including oneJob, firstAha, dominantObject,
   primaryAction, active language, voice authority, and canonical evidence
2. Select exactly one Profile, its product voice, and applicable Trigger Packs
3. Write primary copy in the active language from reader, object, decision,
   and the applicable proof/evidence record
4. Review voice; author each additional language independently from the same
   Build Card and evidence; check governed-value and material semantic parity
5. Verify that reviewed copy preserves the job, AHA, dominant object,
   primary action, truth status, evidence boundary, and material limitation
6. Resolve official logo/surface approval, fonts, photography, and token source
7. Preserve the media subject; choose crop, focal position, natural negative space,
   any governed atmosphere surface, and any necessary semantic connector
8. Sketch the route and first viewport with reviewed active-language copy
9. Build semantic HTML and truthful static fallback
10. Apply theme and locale rendering; add only capabilities whose trigger is enabled
11. Test controls, states, voice, identity, perceptual quiet, atmosphere, connectors,
    responsive behavior, accessibility, and truth
```

### 9.3 Copy-paste build instruction

```md
Build this artifact with Landometer Design System v0.8.8.

Use the attached Build Card as authority. Load the Core Contract, exactly one
selected Profile, and only Trigger Packs whose declared branch applies.

Write in the active language before layout. For Thai, do not draft English copy
first and translate it. Preserve the value of the real people, work, places,
evidence, and decisions represented. Author additional languages from the same
resolved Build Card and evidence record; preserve governed values, material
meaning, and action rather than sentence structure.

Resolve the approved logo asset and Brand-authorized surface pairing before
first paint. When the exact registered approval confirms the transparent
signature, place it directly on its clean governed surface. A plate is a
separate opaque component and is used only under its matching identity approval.

Before coding, internally confirm one user job, one first AHA, one dominant
object, one primary action, declared theme/locale, enabled capabilities, and the
first-viewport control count. Planning prose MUST NOT appear in the artifact.

Use official assets and exact canonical tokens. Make the result recognizably
Landometer through real people/place/product evidence, purposeful color, clear
measurement, grounded truth, useful forward motion, and perceptual quiet. Keep useful
photography large. Use a governed gradient/scrim only when it improves entry,
direction, transition, momentum, or closure. Use connectors only when they encode
a relationship the reader can name. Treat every scene element as optional unless it adds meaning or action. The artifact MUST NOT use
generic AI/SaaS composition, invented sub-brands, dead controls, fake external effects, local
palettes, or documentation walls.

Deliver the smallest complete experience that passes the selected Profile and
QA. Omit optional features whose capability is false or unknown.
```

### 9.4 Output contract

Return:

- final artifact;
- embedded or adjacent Build Card/manifest plus the exact control inventory for interactive work;
- short QA summary mapped to rule IDs;
- known limitations and disabled capabilities;
- screenshots/evidence matched to delivery risk.

A portable mockup does not need a production release bundle. A production page adds its real manifest, asset hashes, metadata, browser matrix, accessibility result, and deployment checks.

Every web artifact exposes matching production identity in initial HTML. `data-manifest-version` and the adjacent manifest use Manifest 2.0; Manifest 1.6 remains historical compatibility evidence only. The following is an example only; every value is replaced from the validated Build Card:

```html
<html
  lang="th"
  data-ds="landometer"
  data-ds-version="0.8.8"
  data-build-card-version="0.8.8"
  data-manifest-version="2.0"
  data-token-schema-version="6"
  data-ds-profile="designsystem.adoption"
  data-delivery-mode="portable_single_file"
  data-evidence-status="source_limited"
  data-visibility="internal"
  data-indexable="false"
  data-theme="light"
  data-theme-preference="system">
```

The embedded/adjacent manifest repeats and matches at least design system/version, Build Card/version, manifest status/version, token schema, product, profile, page kind/source reference, generation/output type, delivery and static export record when applicable, language(s), per-locale voice rule/source/copy-hash/review references, audience and adoption-role registry version when applicable, publication/evidence status, visibility/index policy, canonical URL, verified destination readiness when applicable, theme support/default/preference/override, official logo asset/hash/canvas/placement/surface pairing/identity approval/clear-space and minimum-size records, motion intensity, enabled live capabilities, fixture-scoped reference capabilities, network mode, channel parity key, proof object/version, rendered media asset records, quiet-region evidence, every rendered gradient-surface record, every rendered connector record, and machine-validation status. HTML attributes, runtime state, metadata/robots, `TrustBadge`, rendered controls, and actual effects MUST agree with it. A static export places the same identity in its sidecar or export metadata. Generated preflight implements `manifest.html.match`; high-risk or ambiguous pairings still require the named manual review.

Outputs begin with `machineValidation: pending`. They may change to `passed` only when the generated v0.8.8 schemas, surface recipes, rule mappings, preflight, exact package revision, and every applicable manual gate validate the actual artifact. They report `failed` when any required P0/P1 gate fails.

### 9.5 Fail-closed versus graceful fallback

Fail every production/adoption release for false meaning, broken primary action, inaccessible critical path, missing official identity, token drift, privacy leak, or fake external capability. Only an `internal_demo` with internal/private visibility may use the labelled identity placeholder in `[VIS-01]`.

Use a graceful fallback for optional motion, storage, clipboard, share target, search enhancement, or noncritical media. Preserve content, input, state, and a useful alternative.

---

## 10. Compact QA and severity `[QA-01]`

### 10.1 P0 — stop every release

- false, unsafe, private, restricted, or unsupported claim/output, including any locale that changes a critical object/version, fact, quantity, date, unit, truth state, source/version/date, method status, geography/time/population boundary, confidence, limitation, permitted use, safety boundary, consequence, available action, recovery, or receipt;
- official logo distortion, reconstruction, unauthorized recolor/filter, crop, trim, clip, mask, runtime opacity/blend treatment, unauthorized integral matte/background, unapproved or mismatched plate/surface pairing, or presentation as official without the exact approved asset and current branch-specific Brand identity approval;
- essential user objective impossible to complete;
- essential meaning unavailable to keyboard/screen reader;
- critical data/status meaning represented incorrectly;
- public sharing leaks private state or sensitive identity.
- truncated/incomplete document, broken critical internal route, undecodable required asset, or false authoritative completion.
- missing declared-language glyphs, synthetic substitution that changes essential meaning, or unreadable Thai/Latin critical text;
- structured data, metadata, or agent output that materially misrepresents the visible entity, evidence status, availability, date, or canonical object.
- an automated analysis, score, recommendation, or agent makes or executes a rights-affecting or protected consequential decision without the separately approved governance and meaningful human review required by `[DATA-01]`.

### 10.2 P1 — stop applicable production or adoption release

Run only rows whose trigger applies. A non-applicable row is recorded as `N/A` with its Build Card field; it MUST NOT create a feature or block the release.

| Gate | Trigger | Rule IDs / acceptance |
|---|---|---|
| Brand hierarchy | all brand-visible work | `CORE-01`, `BRAND-01` |
| Landometer recognition | all public/adoption/campaign work | `CORE-08`, `BRAND-03`, `COPY-01`, `VIS-02`, `VIS-03` |
| Voice authority | human-facing copy | `[VOICE-01]`, `[COPY-01]`, `[PRODUCT-01]`; every locale record resolves its rule/source/basis references and copy hash; only the selected product voice loads; no CityWiki voice leakage |
| Thai naturalness | `th` active/additional | `[VOICE-01]`, `[COPY-01]`, `[LOCALE-TH-01]`; standalone Thai read-aloud and qualified Thai-reader review pass before bilingual comparison; no mechanical English-shaped primary copy |
| Value preservation | primary explanatory copy | `[VOICE-01]`, `[COPY-01]`; the reader can name the person/place/object/decision, evidence, consequence, and next action where applicable; simplification has not erased the stakes |
| Cross-locale meaning | multiple languages | `[VOICE-01]`, `[LOCALE-01]`, `[LOCALE-TH-01]`; every governed value and material boundary in the canonical evidence record matches; sentence structure need not match; protected and legally/safety-governed wording remains exact where required |
| First viewport | `designsystem.adoption`, non-static `campaign.public`, and action-bearing `brand.public`; utility `brand.public` uses its declared exception | `FLOW-03`; one primary action when required, otherwise deliberate no-action + clean completion; ≤4 counted targets; no pre-AHA ask |
| Character budget | constrained Thai hero/support/warning | `[FLOW-03]`, `[FLOW-04]`, `[LOCALE-TH-01]`; budget applied after native drafting; no automatic clipping, abbreviation, broken Thai rhythm, or loss of object, consequence, evidence, or action |
| Static campaign composition | static `campaign.public` | declared canvas/aspect/safe area; one line, proof, CTA/destination cue; measured quiet field; no simulated control |
| Emphasis and perceptual quiet | promoted brand/adoption/campaign scenes | `FLOW-04`, `[SPACE-01]`; one focal idea; calm region may be flat, gradient, image negative space, or photo/scrim; no filler quiet block; measured responsive or static-export evidence |
| Perceptual quiet and dominant media | promoted brand/adoption/campaign scene | `[SPACE-01]`, `[FLOW-03]`, `[PHOTO-01]`; quiet region is perceptually calm, not a filler block; dominant image/proof remains useful in scale; measured region and manual low-detail review pass at required viewports |
| Brand-atmosphere surface | governed gradient is rendered | `[SURFACE-01]`, `[VIS-02]`, `[VIS-03]`, `[A11Y-01]`; declared role/recipe/focal target, exact stops, one dominant gradient per viewport, contrast evidence, deletion test, no unauthorized logo pairing |
| Connector integrity | any connector renders | `[RELATION-01]`; identifiable endpoints, declared relationship/style, responsive and accessible alternative, deletion test proves the connector carries meaning |
| Human evidence | adoption and real-work photo use | `PHOTO-01`; complete per-asset media/permission record including screen/privacy review; no UI over people; photo-substitution test |
| Adoption role coverage | `designsystem.adoption` | approved registry owner/version; every registered role has a 30-second benefit proof and two-minute recipe; only one role/proof visible at a time |
| Wayfinding | interactive or multi-mode | `FLOW-01`, `FLOW-05`, `FLOW-06` |
| Controls/states | any interactive control exists, including internal demos | `CORE-04`, `CTRL-01`, `CTRL-02`, `STATE-01`; inventory equality and browser invocation for every control |
| Truth | proof/result/status exists | `CORE-05`, `DATA-01` when enabled |
| Assets/tokens | all rendered work | `CORE-06`, `VIS-01`, `VIS-04`, `TYPE-01`, `LAYOUT-01` |
| Logo/surface | logo rendered | `[VIS-01]`, `[LOGO-SURFACE-01]`, `[THEME-01]`; intact exact file; canvas/placement/surface and current Brand identity approval agree; clear-space and print/CSS minimums resolve; every declared theme/backdrop passes at delivered size with no wrong-asset first paint. The logo’s recognition protocol does not waive contrast for adjacent text, controls, or focus indicators. |
| Theme/locale | declared support/languages | `CORE-09`, `THEME-01`, `LOCALE-01`; only declared combinations |
| Accessibility | all user-facing work | `CORE-07`, `A11Y-01`. Production/full-reference evidence includes automated accessibility result, complete keyboard route, focus proof, desktop/mobile screen-reader matrix, accessible Scale Lab/polygon alternatives when applicable, contrast report, reduced-motion sequence, and Thai/English expansion plus zoom report; internal demos use a declared scoped subset. |
| Responsive | responsive non-static digital work | `FLOW-06`; declared viewports/zoom, no hidden essential action. Static exports instead pass declared canvas, safe-area, crop, and legibility checks. |
| Motion | motion or state transition exists | `MOTION-01`; reduced/no-JS final meaning, no delayed AHA. Production/full-reference QA harness records Replay, Pause/show final, timing/event trace, at least two observed semantic transitions and final state, plus real reduced-motion/no-JS runs. |
| Data/dataviz/map | matching capability is true | `DATA-01`, `DATAVIZ-01`, `MAP-01` as applicable |
| Search | `search: true` | `SEARCH-01`; locale-native index, one complete mechanism, empty state, close, and exact-state restoration |
| Co-creation | `coCreation: true` | `COCREATE-01`; provenance/moderation/retention, no impact before verification, correction/withdrawal/dispute, receipt, failure, and recovery |
| Motif | an approved motif asset is used | `MOTIF-01`; exact gated asset/vector/hash and allowed role; no trace or reconstructed logo geometry |
| Share/network | `share: true` or mode is `reference_ready`, `share_ready`, `relevant_circle`, `collaborative_object`, `co_creation_network`, `handoff_or_export`, or `private_by_policy` | `CORE-10`; `reference_ready` proves stable object/version, source/limitation, and reference route with no share control. `private_by_policy` proves the recorded safety reason and absence of public paths. Apply `SHARE-01` to an enabled action/recipient path and `PUB-01` to destination/metadata readiness. `handoff_or_export` proves exact object/version, limitation, recipient/readability or export receipt, failure, and recovery. |
| Static destination | `social.static` or static `campaign.public` | verified public-safe destination URL, `share_ready` readiness, QR/link test, export receipt, and no simulated share control |
| Publication/privacy | `[PUB-01]` trigger applies | `PUB-01`; visibility/index/metadata/permission match |
| Persistence/effects | matching capability is true | `EFFECT-01`; confirmation, receipt, failure, recovery |
| Investment/learning | `[LEARN-01]` trigger applies | `LEARN-01`; voluntary, disclosed, correctable |
| AHA budgets | product/profile row applies | `AHA-01`; action/time target, partial-result and clean-exit behavior |
| Auth/permissions | matching capability/control exists | `AUTH-01`; necessity, scope, denial, revoke, recovery |
| Context Discovery | `contextDiscovery: true` | `CONTEXT-01`; safe query preview, external label, no private leakage |
| Agent/channel parity | matching capability is true | `AGENT-OUT-01`; same object/version/truth/allowed uses, bounded confirmed effects |
| Full reference/lab | `fullLivingReference: true` | `REFERENCE-01`; ten proofs, labs, source-derived coverage, role findability; one active specimen |
| Telemetry | `telemetry.enabled: true` | `TELEMETRY-01`; purpose/scope/retention, semantic allowlist, no private content, recipient outcome separated |
| Delivery/resilience | every artifact; matching delivery only | `DELIVERY-01`; budget and blocked-third-party result |
| Document integrity | every artifact | complete file, valid anchors/routes, decoded assets, no broken state |

For `designsystem.adoption`, generic visual character, buried Cultural activation, missing real Landometer proof, or failed 5s/30s/2m test is P1.

Recorded recognition protocol is mandatory for `designsystem.adoption`, a new public profile template/campaign family, and a material public-brand redesign. Routine pages using an approved golden may use regression comparison plus a three-role substitution review unless they materially change the opening composition, copy hierarchy, proof model, or visual language.

1. use at least five reviewers from at least three company roles who have not seen the page;
2. show the unmasked first viewport for five seconds, then ask **Who is this? What is the invitation/job? What would you do next?**; at least four of five identify Landometer, urban/place decision intelligence, the same primary idea, and the next action;
3. show a logo/name/slogan-masked capture and a QA-only identity-neutralized copy in which recognizable colleagues, office details, badges, partner/event marks, and signage cannot reveal the company. At least four of five reject “generic AI/SaaS template” and cite two non-identity structural Landometer cues such as place-specific work, measurement/evidence, the evidence→action path, exact editorial typography, or grounded decision context. Familiar people/place/signage and color do not count;
4. during the masked-composition review, also ask **Which area did you look at first? What moved your eye from message to proof or action? Did any gradient feel generic, decorative, or unrelated to the task? Did any quiet region look like an empty component? Did any connector imply a relationship you could not explain?** A gradient or full-bleed image counts as a non-identity cue only when reviewers connect it to place, evidence, measurement, or action; “it is blue/green” does not count;
5. save viewport, captures, reviewer roles, answers, and result at `qa.evidencePath`.

Also run:

- **perceptual-quiet:** reviewers can point to one contiguous calm region at `390 × 844` and `1440 × 900`; it does not read as a filler block, and its QA outline is absent from the delivered design;
- **reading-start:** first-glance reviewers begin at the intended message or proof and can explain the path toward the action;
- **gradient-deletion:** removing a governed atmosphere surface weakens its declared entry/orientation/transition/momentum/closure job; otherwise remove it;
- **connector-deletion:** removing a connector materially reduces understanding of its named relationship; otherwise remove it;
- **template-substitution:** replacing Landometer with another AI/SaaS name without rewriting the object/copy feels false;
- **photo-substitution:** generic stock cannot replace the image without losing meaning;
- **decoration-and-surface deletion:** removing ornament does not improve comprehension; governed atmosphere remains only when its declared job becomes weaker without it;
- **culture:** within 30 seconds, the reader can state how their role improves and who benefits next;
- **literal-metaphor:** plants, gauge fragments, particles, or city silhouettes are not carrying the primary meaning of cultivate/energy.

### 10.3 P2 — resolve or record before the next material release

Severity interpretation:

- **P0:** wrong fact, evidence identity, state, boundary, safety meaning, permitted use, consequence, action, recovery/receipt, or unauthorized identity.
- **P1:** primary Thai is mechanical, generic, or awkward enough to reduce trust or make real work feel less valuable; the logo appears as a mismatched tile; a product voice leaks across boundaries; or a required review/approval is unresolved.
- **P2:** minor rhythm, terminology, or punctuation friction after meaning, value, voice, and identity already pass.

P2 does not justify clutter or a feature. Record owner and follow-up for near-budget spacing or perceptual-quiet drift, role vocabulary/findability friction, an optional pattern whose omission weakens comprehension, a noncritical visual regression, or a minor metadata inconsistency that does not misrepresent the artifact. Repeated P2 in one system area escalates to P1.

### 10.4 Browser/state matrix

For interactive/responsive artifacts, test applicable combinations:

- active language plus only declared `additionalLanguages`;
- only themes declared by `theme.support`, with the declared default at first paint;
- first visit and return state only when persistence/personalization exists;
- reduced motion and, where the profile/delivery permits, a no-JavaScript baseline;
- keyboard and touch. Production/full-reference work also records the complete critical keyboard route, focus evidence, and screen-reader results on one supported desktop and one supported mobile combination; a scoped internal mockup may use a declared spot check but cannot claim that matrix;
- 200% zoom;
- `320`, `360`, `390`, `768`, `1024`, `1180`, and `1440` CSS px for production/full reference; scoped internal matrices are declared;
- Thai and English at `130%`, and all content at `200%` zoom;
- only loading, partial, stale, empty, error, offline/restricted, and recovery states that the selected profile/capabilities can enter.


When photography or gradient atmosphere is present, record:

- `390 × 844` and `1440 × 900` first-viewport captures;
- the annotated quiet-region rectangle and visible-area ratio;
- text/foreground contrast sampled over the actual rendered gradient or photographic scrim;
- a capture with the quiet-region QA outline hidden, proving the outline is not part of the visual design;
- focal-subject visibility and evidence-obstruction review;
- gradient deletion comparison;
- first-glance reading-start result;
- connector deletion comparison and mobile simplification when connectors exist.

Static exports use `[A11Y-01]`, `[LOCALE-01]`, `[PUB-01]`, and their `[DELIVERY-01]` canvas/format branch instead: declared size/aspect, safe area, crop, packaged fonts/glyphs, reading order/alt/caption, link/QR, and delivered-size legibility. Browser-only state rows are not fabricated.

### 10.5 Visual review questions

1. Is it recognizable as Landometer before repeated logo reading?
2. Is one idea clearly in charge?
3. Where does the eye start, and is that the intended message or proof?
4. Is the calm region perceptually quiet rather than a visible filler component?
5. Has the photograph or proof remained large enough to carry context and meaning?
6. If text overlays media, are people and material evidence unobscured?
7. Does each gradient improve entry, orientation, transition, momentum, closure, or product identity?
8. Would removing the gradient weaken the reading path? If not, remove it.
9. Does every connector encode a relationship the reader can name? If not, remove it.
10. Can the user state where they are and what to do next?
11. Does every visible control work and deserve its space?
12. Does the page still make sense in every declared language/theme, mobile, reduced motion, and without optional enhancement?
13. Does the same governed object keep its truth and limitation across role, export, share, and agent channels?

### 10.6 Voice and identity review records

Thai review evidence binds the decision to the exact artifact, copy, and evidence:

```yaml
thaiVoiceReview:
  artifactId: ""
  artifactVersion: ""
  reviewedLocale: th
  localeCopyHash: ""
  canonicalEvidenceObjectId: ""
  canonicalEvidenceVersion: ""
  fixtureSetRef: ""
  naturalnessReviewerIds: []
  parityReviewerIds: []
  reviewerCompetenceRecordRefs: []
  naturalnessReviewedAt: ""
  parityReviewedAt: ""
  reviewedWithoutEnglishFirst: true
  readAloud: true
  governedValuesMatch: true
  objectDecisionActionClear: true
  valuePreserved: true
  limitationProportionate: true
  genericSubstitutionRejected: true
  decision: pass | fail | open
  approvalScope: ""
  openIssues: []
  resolvedIssueRefs: []
```

At least one qualified native-Thai reviewer performs the standalone naturalness review. A separate reviewer or review pass then checks parity against the canonical evidence record; the English copy is never the authority. Any copy-hash change invalidates the earlier review.

Every logo/surface branch also records:

```yaml
identitySurfaceReview:
  assetId: ""
  variant: ""
  sha256: ""
  identityApprovalId: ""
  surfaceRef: ""
  themesOrBackdrops: []
  deliveredSizesPx: []
  devicePixelRatios: []
  reviewerIds: []
  recognitionThreshold: four_of_five
  completeMarkRecognized: true
  wordmarkReadableWherePresent: true
  accidentalMatteAbsent: true
  adjacentControlContrastPassed: true
  wrongAssetFirstPaintAbsent: true
  decision: pass | fail | open
  evidenceRef: ""
```

Test the exact asset at its approved minimum CSS width and representative delivered sizes for each declared theme/backdrop at the supported pixel densities. At least four of five reviewers must recognize the complete Landometer signature; where a wordmark is present, it must remain readable. This recognition protocol does not exempt nearby labels, controls, or focus indicators from `[A11Y-01]`.

### 10.7 Exception policy `[EXCEPTION-01]`

An exception records rule ID, reason, owner, approver, creation date, expiry, mitigation, evidence, and tracking ticket. It is narrow, test-visible, and reviewed before expiry. It cannot waive a P0, falsify truth/status, weaken necessary privacy/access control, remove a required accessible alternative, bypass permission/license/legal terms, or silently create a parallel token/profile configuration.

---

## 11. v0.8.7 → v0.8.8 migration and earlier regression history

### 11.1 v0.8.7 → v0.8.8

v0.8.8 changes composition authority, Build Card composition records, and applicable QA without changing Manifest 2.0, Token Schema 6, raw color values, Profiles, Trigger Packs, optional capabilities, protected brand lines, product/evidence boundaries, or the default visible route.

| v0.8.7 interpretation or implementation | v0.8.8 disposition |
|---|---|
| quiet field must be visibly empty and separate | quiet is perceptual; it may be open surface, image negative space, a governed low-frequency gradient, or a photo/scrim region |
| photograph sits beside a dedicated quiet column | photograph may be full-bleed or span the scene; do not shrink useful media for a filler region |
| quiet field contains no copy under any condition | one dominant message group or proof may occupy a calm region; secondary UI remains prohibited |
| gradient is largely confined to closing or product identity | governed atmosphere recipes may support entry, orientation, transition, momentum, and closure |
| all gradient use risks being treated as generic decoration | gradient passes only with a declared job, exact recipe, focal target, contrast strategy, cadence, and deletion evidence |
| connector lines may make boxes feel related | connectors render only when they encode a named relationship and survive deletion testing |
| `data-quiet-field` may become the styled quiet object | it is a QA marker only and MUST NOT create visual styling |
| photo, gradient, and message were treated as three groups | a full-bleed photograph plus one message/action group remains no more than two visual groups; quiet is an attention condition, not a third component |
| incomplete font subsets could fall back silently | all required Thai/Latin semantic subsets and declared weights are packaged and tested; fallback remains failure behavior, not conformance |
| inactive/active locale CSS used `display: initial` | hide only inactive locale content; active blocks keep their semantic/component display so CTAs cannot flow inside prose |

The v0.8.7 public package remains frozen migration evidence. The v0.8.8 package is a separate version and MUST regenerate its release lock, source fingerprint, Build Card schema, surface recipes, rule ledger, preflight, fixtures/mappings, and validation report before package-level v0.8.8 claims.

### 11.2 v0.8.6 → v0.8.7

v0.8.7 changes authoring order, identity approval, and release QA without changing tokens, Profiles, Trigger Packs, optional capabilities, or the default visible route.

| v0.8.6 behavior | v0.8.7 disposition |
|---|---|
| active locale applied after component planning | active-language copy is written and reviewed before layout |
| “natural Thai” without a stable evidence-bound test | `[LOCALE-TH-01]`, per-locale copy hashes, standalone Thai review, read-aloud, and bilingual parity against the canonical evidence record |
| exact-looking bilingual symmetry could be mistaken for quality | material semantic parity; natural structure may differ while governed values remain exact |
| `Clear · Grounded · Energetic` could be used as style adjectives | retained as shared outcome tests; selected product voice governs prose |
| thin shared copy examples | replaced by `[VOICE-01]`, `[COPY-01]`, and reference-only fixtures |
| generic adoption Thai support/CTA | require the actual work object and immediate next action; unresolved object blocks publication |
| neutral logo plate or variant could be inferred from context | approved transparent asset on its approved direct surface is preferred; every direct, integral-background, or plate branch requires current Brand identity approval |
| accidental cream tile around the logo | fail logo/surface QA unless it is exact integral artwork approved for that asset and scope |
| Thai glyph/expansion QA only | add naturalness, value preservation, evidence-bound parity, and character-budget QA |
| logo asset record only | add canvas, placement, surface pairing, current Brand identity approval, clear space, minimum sizes, themes/backdrops, and actual-size recognition evidence |

The v0.8.6 public package remains frozen. The v0.8.7 package is a separate version with its own release lock, source fingerprint, Build Card schema, identity records, voice references, fixtures, rule ledgers, and preflight.

### 11.3 v0.8.5 → v0.8.6 historical regression migration

v0.8.6 is a presentation/context migration, not permission to roll back v0.8.5 token, typography, truth, evidence, accessibility, recipient, or channel contracts.

| v0.8.5 normative intent | v0.8.6 disposition |
|---|---|
| English/Thai Product UI headings use Arvo 700 / IBM Plex Sans Thai Looped 700; Thai editorial uses IBM 700; exact leading/fallback/six-face delivery | retained in `[TYPE-01]` and Appendix A11 |
| no-purple/periwinkle/terracotta; Signal Orange and Civic Slate series v5 | retained exactly in `[VIS-04]` and Appendix A |
| Token Schema 5 canonical IDs | generated Schema 6 preserves the compatibility registry and adds only `energy.*` plus the missing light `interaction.accent`; Appendix A lists the active authoring subset and exact retained IDs used by this master; no retained ID is renamed |
| dual theme, Auto default, persistent accessible override | retained in `[THEME-01]`; three peer header buttons superseded by one labelled control |
| first-AHA and product budgets | retained in `CORE-03`, `[MOTION-01]`, and `[AHA-01]` |
| ten proofs, six invariant comparisons, Scale Lab, polygon, typography, motion, coverage | moved to conditional `[REFERENCE-01]`; absent from default Adopt mode |
| three controlled brand moments | retained as `[BRAND-04]` rhythm with `[SPACE-01]` between them |
| cross-team meaning parity | retained in `[ADOPT-01]` and `[AGENT-OUT-01]` |
| Context Discovery and bounded agent/channel parity | retained as conditional `[CONTEXT-01]` and `[AGENT-OUT-01]` |
| recovery, CTA consequence, authoritative state | retained in `[STATE-01]` and `[EFFECT-01]` |
| exact-object recipient value and network-effect distinction | retained in `CORE-10` and `[SHARE-01]` |
| full production compliance bundle for every mockup | superseded by risk/profile-scoped evidence; production requirements remain complete |
| one restrained loading-only shimmer could be permitted | deliberately superseded: v0.8.6 uses honest static/progress state and forbids shimmer so loading does not add visual noise |

The v0.8.5 HTML implementation called Mission Lab MUST be rebuilt from the `designsystem.adoption` profile, not patched by adding more CSS or controls.

| v0.8.5 pattern | v0.8.6 action |
|---|---|
| “Mission Lab” sub-brand | remove; use the current Landometer Design System release |
| North Star plus two thesis paragraphs | lead with Cultural activation and one support sentence for adoption |
| 18 first-viewport choices | reduce to logo, compact utilities, one primary CTA |
| duplicate role selectors | one role selector after hero |
| technical AREA-BKK card over team photo | move proof below hero; leave people visible |
| four nav links + language + 3 theme buttons + search | compact route; utility menu; search only in Reference if needed |
| share prompt in hero and every section/card | remove; one post-value share action only when hosted and functional |
| `#7FA2F1` dark Brand Blue | remove; protected Brand Blue remains `#1D4497` |
| unapproved hero/rainbow gradients | replace with approved flat field, energy accents, product/signature gradient, or real image |
| Google Fonts as critical dependency | package/self-host approved font files |
| whole-DOM translation dictionary | keyed locale model or pre-rendered locale blocks |
| mobile nav disappearance | provide compact accessible replacement |
| hidden next action below 470px | MUST NOT hide essential action; disclose supporting metadata instead |
| role/pattern link without state restoration | encode mode/role/pattern in URL or hash |
| abstract governance copy first | concrete Landometer role/object/action first; technical terms in Reference |
| one long page containing story, lab, library, share flow | separate `adopt`, `reference`, and `lab` modes |

This regression fixture MUST fail v0.8.8 first-viewport, brand-specificity, control-necessity, token, font-delivery, mobile-wayfinding, native-language, identity-surface, and pre-AHA-sharing gates.

## 12. Definition of done `[DONE-01]`

An artifact is v0.8.8-ready when:

1. its Build Card is complete and matches the rendered behavior;
2. one profile and only applicable Trigger Packs are active;
3. the first AHA, primary action, route, and recovery are clear;
4. North Star, Promise, and Cultural activation are used in the correct role;
5. the work passes Landometer recognition and anti-generic review;
6. emphasis is unmistakable; `[SPACE-01]` preserves perceptual calm without shrinking useful media or creating a filler block; full-bleed photography and governed gradient/scrim treatments preserve people, context, evidence, and contrast;
7. every rendered gradient declares and passes a `[SURFACE-01]` job, exact recipe, contrast strategy, cadence, and deletion test;
8. every rendered line, arrow, path, loop, or handoff diagram passes `[RELATION-01]`; removing it would materially reduce understanding;
9. every human-facing locale follows `[VOICE-01]`, the selected product voice, and evidence-bound authoring; Thai passes `[LOCALE-TH-01]`;
10. material meaning and governed values remain consistent across languages, roles, exports, shares, and agent channels;
11. the exact official asset and Brand-authorized logo/surface branch pass clear-space, minimum-size, theme/backdrop, and actual-size recognition review;
12. font roles, script subsets, weights, and exact tokens are used without local drift or silent fallback;
13. active locale elements retain their semantic/component display role and no CTA or control overlaps or enters prose flow;
14. all visible controls work and every unavailable capability is omitted or honestly explained;
15. applicable responsive, theme, locale, motion, accessibility, state, voice, identity, quiet-region, atmosphere, connector, and delivery tests pass;
16. no share, contribution, persistence, or network effect is simulated as real;
17. when `fullLivingReference: true`, complete coverage remains available in Reference/Lab without entering the default Adopt route;
18. the output is complete, usable, and no more complex than the user’s job requires.

# Appendix A — Canonical tokens carried into v0.8.8 `[TOKEN-01]`

Appendix A is normative for the **active authoring subset** and exact values needed by this master. v0.8.8 makes no raw token-value change; it adds composition recipes derived from existing exact values. Human-readable **Token Schema 6** preserves the full v0.8.5 Schema 5 registry as frozen compatibility input and the v0.8.6 additions of separately governed `energy.*` expression roles plus the missing light `interaction.accent`. A Schema 5 ID not listed here is compatibility-only: new v0.8.8 authoring MUST NOT use it unless the generated Schema 6 package exposes and tests it. This keeps the normal agent context standalone without reproducing the legacy registry. Product code SHOULD consume the v0.8.8 generated token files and MUST NOT maintain local copies with changed values. Package-level token validation does not replace rendered contrast, font, theme, map, or data-visualization QA in an implementation.

## A1. Brand and energy

| Token | Value | Role |
|---|---:|---|
| `brand.blue` | `#1D4497` | protected master-brand identity |
| `brand.beige` | `#F2F1DF` | warm brand context |
| `dark.brand.beige` | `#D8CFB2` | warm accent on dark; not default text |
| `energy.sky` | `#59D2FE` | human/cultural brand expression |
| `energy.mint` | `#0AD69C` | human/cultural brand expression |
| `energy.coral` | `#FF5A5F` | human/cultural brand expression |
| `energy.yellow` | `#FFBC1F` | human/cultural brand expression |

Frozen official-logo spectrum, asset-only:

| Frozen asset color | Value |
|---|---:|
| `logo.blue` | `#1D4497` |
| `logo.mint` | `#0AD69C` |
| `logo.sky` | `#59D2FE` |
| `logo.cyan` | `#0194CA` |
| `logo.yellow` | `#FFBC1F` |
| `logo.coral` | `#FF5A5F` |
| `logo.gray` | `#757575` |

Official logo artwork retains these approved frozen colors and MUST NOT be runtime-recolored, sampled into local variables, or rebuilt from tokens. `energy.*` is a separate brand-expression role; identical hex values do not make it a logo alias, data, map, status, or focus palette.

Any solid or background use of `energy.*` MUST pass contrast in both themes. Prefer mineral ink on yellow, sky, or mint; coral requires a tested text color or scrim.

## A2. Foundation

In paired tables, the light ID is written as shown and the dark ID is `dark.<light-id>`; this notation is display shorthand only and does not rename the canonical v0.8.5 IDs. The focus pair is the explicit exception: `interaction.focus.ring` light maps to canonical `dark.focus.ring`. Retained Schema 5 `dark.interaction.accent` is the dark counterpart of the new Schema 6 light role.

| Role | Light | Dark |
|---|---:|---:|
| `surface.canvas` | `#F6F7F3` | `#11191D` |
| `surface.alt` | `#EEF1EE` | `#172126` |
| `surface.card` | `#FCFCFA` | `#20292D` |
| `surface.raised` | `#FFFFFF` | `#293337` |
| `surface.soft` | `#E5E9E6` | `#2B3534` |
| `surface.blueTint` | `#E2E9ED` | `#18333E` |
| `surface.beigeTint` | `#F2F1DF` | `#2C2A22` |
| `text.primary` | `#182327` | `#F1F4EF` |
| `text.secondary` | `#5F635A` | `#C4CECA` |
| `text.metadata` | `#686354` | `#A6B5B1` |
| `text.muted` | `#8B877A` | `#8D9D99` |
| `text.disabled` | `#B6AD98` | `#71817D` |
| `border.hairline` | `#DCE1DD` | `#33403D` |
| `border.default` | `#C9D0CB` | `#46524F` |
| `border.emphasis` | `#7D877F` | `#7C8A84` |
| `interaction.accent` | `#176B82` | `#68C4E2` |
| `interaction.focus.ring` | `#176B82` | `#68C4E2` |

`interaction.accent` label/border contrast is at least `4.94:1` across its allowed light surfaces and `6.36:1` across its allowed dark surfaces; generated contrast fixtures must reproduce or exceed these floors before machine conformance.

## A3. Semantic states

Each row expands to `semantic.<state>.fill`, `semantic.<state>.ink`, `dark.semantic.<state>.fill`, and `dark.semantic.<state>.ink`.

| State | Light fill / ink | Dark fill / ink |
|---|---|---|
| success | `#E2F4E5` / `#126B49` | `#17362D` / `#72E8C4` |
| warning | `#FFF1D1` / `#795300` | `#3B2E16` / `#F5C15C` |
| danger | `#FCE5DF` / `#B43A3A` | `#3A1F21` / `#FF7C72` |
| info | `#E8EEF0` / `#176B82` | `#18333E` / `#68C4E2` |
| neutral | `#ECE4D2` / `#5F635A` | `#2B3534` / `#C4CECA` |
| pending | `#F3EEDB` / `#686354` | `#2C2A22` / `#D8CFB2` |
| assisted | `#DFF3F1` / `#176C67` | `#163331` / `#79D9D1` |

## A4. Signature and product identity gradients

| Token | Exact CSS / stops |
|---|---|
| `dark.signature.sky` | `#68C4E2` — approved dark closing-signature start only |
| `signature.gradient.closing.light` | `linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)` |
| `signature.gradient.closing.dark` | `linear-gradient(135deg, #68C4E2 0%, #15919A 52%, #08756F 100%)` |
| `product.citymeter.gradient.start.light` / `.end.light` | `#12669B` / `#36BCE4` |
| `product.citymeter.gradient.start.dark` / `.end.dark` | `#4C99D5` / `#59C7E8` |
| `product.citywiki.gradient.start.light` / `.end.light` | `#176B82` / `#007E79` |
| `product.citywiki.gradient.start.dark` / `.end.dark` | `#59C7E8` / `#3BD3CB` |
| `product.citychat.gradient.start.light` / `.end.light` | `#007A58` / `#007E79` |
| `product.citychat.gradient.start.dark` / `.end.dark` | `#3BD19B` / `#3BD3CB` |
| `product.ijji.gradient.start.light` / `.end.light` | `#C52C00` / `#B23F74` |
| `product.ijji.gradient.start.dark` / `.end.dark` | `#FF8A4C` / `#F06FA6` |
| `motif.gradient.brandSignature` | `#1D4497 → #176B82 → #08756F` |
| `motif.gradient.civicCool` | `#147A9F → #3BD3CB → #3BD19B` |
| `motif.gradient.civicWarm` | `#C33F55 → #FF8A4C → #F4C44E` |

Product gradients use `135deg` and identify the product only. They MUST NOT encode data or state.

Motif gradient IDs remain canonical but do not clear the `[MOTIF-01]` vector/hash gate. They may color only a separately approved motif asset and never authorize reconstructing or tracing the official logo.

Foreground contrast is sampled beneath the actual glyph/icon bounds across the rendered gradient; every sample passes the applicable text or non-text ratio. Bare text MUST NOT span a gradient when any sample fails. Endpoint baselines are: CityMETER light has no bare foreground (`white 2.22:1`, mineral `2.60:1`) and requires an approved opaque panel or scrim; CityMETER dark uses mineral ink (`≥5.22:1`); CityWiki and CityChat use white in light (`≥4.93:1`) and mineral in dark (`≥8.22:1`/`8.24:1`); ijji uses white in light (`≥5.45:1`) and mineral in dark (`≥5.75:1`). Endpoint values are only a floor—fix a failed foreground surface, never the canonical gradient.

## A4.1 Surface-atmosphere recipes

This table adds authoring recipes only. It does not add raw color values or change Token Schema 6.

| Recipe ID | Source values | Theme behavior | Primary use |
|---|---|---|---|
| `surfaceAtmosphere.measure` | `signature.gradient.closing.light` / `.dark` | use the declared theme token | shared Landometer direction, Measure → Act, closure |
| `surfaceAtmosphere.ground` | `#147A9F → #3BD3CB → #3BD19B` | preserve exact stops; foreground uses sampled contrast, scrim, or panel | place/context reveal, collaboration, evidence becoming understandable |
| `surfaceAtmosphere.cultivate` | `#C33F55 → #FF8A4C → #F4C44E` | preserve exact stops; foreground uses sampled contrast, scrim, or panel | human action, credible momentum, completion |
| `surfaceAtmosphere.product` | the selected exact product gradient | only inside the correct product scope | product identity |

Generated implementation packages SHOULD expose these as composition recipes, for example in `surface-recipes.json` or equivalent. They MUST NOT duplicate or alter the canonical color registry.

A recipe MAY change angle to match reading direction only when:

- stop order remains exact;
- the angle is recorded;
- the focal target is declared;
- contrast and first-glance review pass;
- the result does not become a new gradient token or local palette.

## A5. Vivid Civic 10 categorical registry

Registry ID: `landometer-series-10-v5`. These are the exact v0.8.5 Signal Orange/Civic Slate identities; retired terracotta values remain historical only.

Light IDs are `series.01`…`series.10`; dark IDs are `dark.series.01`…`dark.series.10`.

| ID | Name | Light | Dark | Shape / pattern |
|---|---|---:|---:|---|
| `series.01` | Coral | `#C33F55` | `#FF6B7F` | circle / solid |
| `series.02` | Signal Orange | `#C52C00` | `#FF8A4C` | square / solid |
| `series.03` | Marigold | `#846100` | `#F4C44E` | triangle / solid |
| `series.04` | Lime | `#5D7400` | `#B5E34E` | diamond / solid |
| `series.05` | Green | `#007A58` | `#3BD19B` | cross / solid |
| `series.06` | Aqua | `#007E79` | `#3BD3CB` | star / solid |
| `series.07` | Sky | `#147A9F` | `#59C7E8` | hexagon / diagonal45 |
| `series.08` | Ocean | `#1F629B` | `#4C99D5` | ring / diagonal135 |
| `series.09` | Civic Slate | `#536B70` | `#A9C4C7` | dash / dot |
| `series.10` | Warm Pink | `#B23F74` | `#F06FA6` | plus / crosshatch |

Persist assignment by canonical category ID, not array position. Color-only identification stops at six. At 7–10 categories use shape/pattern; above 10 group/filter/small-multiple/table instead of generating more hues.

## A6. Data-visualization anchors

Each sequential anchor expands to `dataviz.seq.<scale>.low|mid|high` and `dark.dataviz.seq.<scale>.low|mid|high`. Each diverging anchor expands to `dataviz.div.<scale>.sideA|neutral|sideB` and its `dark.` counterpart. The paired tables do not collapse or rename those IDs.

### Sequential

| Scale | Light Low / Mid / High | Dark Low / Mid / High |
|---|---|---|
| growth | `#F2F1DF` / `#55B8C2` / `#126F68` | `#6F8984` / `#53BDD0` / `#86E0B8` |
| water | `#F2F1DF` / `#55B8C2` / `#206C9A` | `#6C838C` / `#55B8C2` / `#68C4E2` |
| risk | `#F2F1DF` / `#E0B443` / `#B74436` | `#85837A` / `#D0A42F` / `#FF8C7D` |
| activity | `#F2F1DF` / `#E86A8C` / `#C52C00` | `#808A96` / `#F079A1` / `#FFB06A` |
| density | `#F2F1DF` / `#6797AF` / `#225F78` | `#728C9A` / `#47A6C4` / `#9BE4F2` |
| confidence | `#F2F1DF` / `#85A5A2` / `#08756F` | `#7C8B8C` / `#95A9AA` / `#D8E6E5` |

### Diverging

| Scale | Light side A / neutral / side B | Dark side A / neutral / side B |
|---|---|---|
| balance | `#C52C00` / `#F2F1DF` / `#186A9E` | `#FF8A4C` / `#827C68` / `#4FAFE0` |
| delta | `#B74436` / `#F2F1DF` / `#007C78` | `#F28575` / `#827C68` / `#55C8BC` |
| tradeoff | `#9E476F` / `#F2F1DF` / `#007E91` | `#E982AE` / `#827C68` / `#61C2D3` |

Build the 41-stop LUT deterministically; runtime color mixing MUST NOT occur:

1. decode exact sRGB anchors with the standard D65 sRGB transfer and convert to OKLab;
2. for indices `0…20`, interpolate Low → Mid with `t=i/20`; for `21…40`, interpolate Mid → High with `t=(i-20)/20`;
3. interpolate `L`, `a`, and `b` linearly; when out of sRGB gamut, preserve `L` and hue and reduce OKLCH chroma with 24 binary-search iterations;
4. convert to sRGB, clamp only residual floating error, round channels half-up to 8-bit, serialize uppercase `#RRGGBB`, and force indices `0`, `20`, `40` to the exact anchors;
5. derive 5/7/9 classes with index `round(k×40/(n-1))`; store canonical RFC 8785 JSON containing scale ID, theme, anchors and positions, interpolation/gamut rules, ordered LUT/classes, class count, classification method, domain/thresholds, no-data, zero, neutral, and outlier policy, then publish its SHA-256 as `scaleVersion`. Renderer, legend, accessible alternative, and export reject any field/hash mismatch.

Production MUST NOT claim the scale gate until the generated `dataviz.tokens.json`, hash, legend/renderer parity fixture, and contrast/CVD review exist.

| Token | Light | Dark | Rule |
|---|---:|---:|---|
| `dataviz.noData.fill` | `#D5DAD6` | `#404844` | diagonal pattern + label; never part of a ramp |
| `dataviz.zero.outline` | `#7D877F` | `#A59A80` | only when zero is a distinct fact |

## A7. Map and interface layers

Each paired map row uses the shown light ID and the `dark.<id>` counterpart.

| Token | Light | Dark |
|---|---:|---:|
| `map.activeLayer` | `#347DA8` | `#65B6DB` |
| `map.hover.stroke` | `#347DA8` | `#65B6DB` |
| `map.hover.fill` | `rgba(52,125,168,0.16)` | `rgba(101,182,219,0.18)` |
| `map.selected.stroke` | `#176B82` | `#68C4E2` |
| `map.selected.fill` | `rgba(23,107,130,0.18)` | `rgba(104,196,226,0.22)` |
| `map.focus.stroke` | `#176B82` | `#68C4E2` |
| `marker.halo` | `#FFFFFF` | `#101318` |
| `marker.stroke` | `#182327` | `#F1F4EF` |

| Named z-index role | Value |
|---|---:|
| `base` | `0` |
| `raised` | `10` |
| `sticky` | `100` |
| `dropdown` | `200` |
| `overlay` | `400` |
| `modal` | `500` |
| `toast` | `600` |
| `tooltip` | `700` |

Map interactions MUST pair color with stroke/shape/label as appropriate. Components MUST consume these names from the generated `zIndex` registry and MUST NOT mint `layer.*`, local numeric aliases, or a separate `z-index` scale.

Canonical opacity registry:

| Token | Value |
|---|---:|
| `opacity.solid` | `1.00` |
| `opacity.strong` | `0.88` |
| `opacity.medium` | `0.72` |
| `opacity.soft` | `0.56` |
| `opacity.subtle` | `0.40` |
| `opacity.ghost` | `0.24` |
| `opacity.watermark` | `0.12` |
| `opacity.trace` | `0.06` |

Opacity never carries critical meaning alone. Named depth roles remain `depth.base`, `depth.context`, `depth.data`, `depth.focus`, `depth.action`, and `depth.memory`; they organize canvas → context → evidence → selection → action → receipt/history without creating local opacity or z-index values.

## A8. Type scale

```css
:root {
  --type-caption: .75rem;
  --type-label: .8125rem;
  --type-body-sm: .875rem;
  --type-body: 1rem;
  --type-body-lg: 1.125rem;
  --type-h3: clamp(1.35rem, 2vw, 1.75rem);
  --type-h2: clamp(2rem, 4vw, 3.25rem);
  --type-h1-en: clamp(3.25rem, 7vw, 6.5rem);
  --type-h1-th: clamp(2.5rem, 6vw, 5rem);
}
```

## A9. Spacing, radius, container, breakpoint, elevation

```css
:root {
  --space-0: 0; --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --space-7: 48px; --space-8: 64px; --space-9: 96px; --space-10: 128px;

  --radius-xs: 6px; --radius-sm: 10px; --radius-md: 16px;
  --radius-lg: 24px; --radius-xl: 32px; --radius-pill: 999px;

  --container-reading: 760px; --container-default: 1120px; --container-wide: 1280px;
  --gutter-mobile: 16px; --gutter-tablet: 24px; --gutter-desktop: 32px;

  --elevation-none: none;
  --elevation-xs: 0 1px 2px rgba(30,34,48,.08);
  --elevation-sm: 0 4px 12px rgba(30,34,48,.10);
  --elevation-md: 0 12px 32px rgba(30,34,48,.14);
  --elevation-lg: 0 24px 64px rgba(30,34,48,.18);
}
```

Breakpoints: `xs 360`, `sm 600`, `md 900`, `lg 1200`, `xl 1600`.

## A10. Motion

```css
:root {
  --motion-duration-feedback: 120ms;
  --motion-duration-state: 200ms;
  --motion-duration-map: 280ms;
  --motion-duration-chart: 360ms;
  --motion-duration-reveal: 400ms;
  --motion-duration-emphasis: 560ms;
  --motion-delay-stagger: 60ms;
  --motion-delay-stagger-cap: 240ms;
  --motion-distance-feedback: 2px;
  --motion-distance-reveal: 12px;
  --motion-ease-state: cubic-bezier(.2,0,0,1);
  --motion-ease-enter: cubic-bezier(.16,1,.3,1);
}
```

Semantic motion aliases preserve the exact Schema 5 meanings:

| Token | Canonical duration | Job |
|---|---:|---|
| `motion.meter.sweep` | `400ms` | one-time recalculation/measured-state reveal |
| `motion.meter.tickIn` | `200ms` | threshold or legend reveal |
| `motion.depth.focusIn` | `200ms` | selected object settles |
| `motion.depth.layerCrossfade` | `280ms` | comparable layer/state change |
| `motion.depth.receiptStack` | `400ms` | action becomes a visible receipt |
| `motion.cta.depthPress` | `120ms` | press acknowledgement |
| `motion.share.previewReveal` | `400ms` | governed share object becomes ready |
| `motion.hook.rewardReveal` | `200ms` | result and implication reveal |
| `motion.hook.nextActionCue` | `200ms` | one-shot cue after reward |
| `motion.hook.loopContinue` | `200ms` | preserve context into the next loop |

## A11. Typography delivery, leading, and fallback

Exact line-height and fallback tokens:

```css
:root {
  --leading-display-en: 1.02;
  --leading-display-th: 1.16;
  --leading-editorial-en: 1.15;
  --leading-ui-heading-en: 1.22;
  --leading-ui-heading-th: 1.32;
  --leading-body: 1.60;
  --leading-body-compact: 1.45;
  --leading-label: 1.35;
  --leading-number: 1.25;

  --font-display-en-fallback: Georgia, Cambria, "Times New Roman", serif;
  --font-display-th-fallback: "Noto Sans Thai Looped", "Leelawadee UI", Tahoma, sans-serif;
  --font-body-fallback: "Noto Sans Thai", "Leelawadee UI", Tahoma, sans-serif;
  --font-number-fallback: "SFMono-Regular", Consolas, "Liberation Mono", monospace;

  --font-display-en: "Arvo", var(--font-display-en-fallback);
  --font-display-th: "IBM Plex Sans Thai Looped", var(--font-display-th-fallback);
  --font-ui-heading-en: "Arvo", var(--font-display-en-fallback);
  --font-ui-heading-th: "IBM Plex Sans Thai Looped", var(--font-display-th-fallback);
  --font-body: "Bai Jamjuree", var(--font-body-fallback);
  --font-number: "JetBrains Mono", var(--font-number-fallback);
  font-synthesis: none;
}
```

The package MUST provide all six exact face records in `font-assets.manifest.json`:

```yaml
fontAssets:
  - { id: arvo-latin-700, family: Arvo, weight: 700, style: normal, scripts: [latin], file: required, sha256: required, licenseRecord: required }
  - { id: ibm-plex-sans-thai-looped-thai-latin-700, family: IBM Plex Sans Thai Looped, weight: 700, style: normal, scripts: [thai, latin], file: required, sha256: required, licenseRecord: required }
  - { id: bai-jamjuree-thai-latin-400, family: Bai Jamjuree, weight: 400, style: normal, scripts: [thai, latin], file: required, sha256: required, licenseRecord: required }
  - { id: bai-jamjuree-thai-latin-600, family: Bai Jamjuree, weight: 600, style: normal, scripts: [thai, latin], file: required, sha256: required, licenseRecord: required }
  - { id: jetbrains-mono-latin-500, family: JetBrains Mono, weight: 500, style: normal, scripts: [latin, numerals], file: required, sha256: required, licenseRecord: required }
  - { id: jetbrains-mono-latin-700, family: JetBrains Mono, weight: 700, style: normal, scripts: [latin, numerals], file: required, sha256: required, licenseRecord: required }
```

Real filenames, SHA-256 hashes, and license records come from packaged assets; documentation and agents MUST NOT invent them. Fallback keeps content readable but never satisfies compliance. Generated CSS SHOULD derive `size-adjust`, ascent/descent, and line-gap overrides from real font metrics; it MUST NOT guess them. Font-ready QA checks all semantic roles, Thai shaping, declared-language glyphs, synthetic faces, blocked-network behavior, and post-load CLS (`≤0.02` attributable to fonts) before capture/export.

---

# Appendix B — Machine alignment and future split `[MACHINE-01]`

The v0.8.8 Markdown remains the concise human front door. The v0.8.8 public-safe machine package MUST generate and validate the following machine-readable implementation projection before package-level v0.8.8 conformance is claimed:

```txt
core.md
build-card.schema.json
manifest.schema.json
surface-recipes.json
connector.schema.json
profiles/*.json
packs/*.json
tokens.json
tokens.css
tokens.ts
font-assets.manifest.json
media-assets.manifest.json
identity-approvals.manifest.json
components.json
page-kinds.json
voice-recipes.md
thai-voice-fixtures-v0.8.7.json
adapters/
preflight.yml
fixtures.json
v0.8.7-to-v0.8.8-rule-ledger.json
v0.8.6-to-v0.8.7-rule-ledger.json
v0.8.5-to-v0.8.6-rule-ledger.json
```

Appendix A and the manual cross-field/parity gates in §§1 and 9.4 remain normative. Generated tokens declare Token Schema 6, preserve the v0.8.5 IDs and v0.8.6 additions without new v0.8.8 raw values, and match Appendix A. Generated surface recipes reference canonical values without duplicating or altering the token registry; generated connector records validate relationship semantics rather than styling variety. Generated Manifest 2.0 and preflight implement `manifest.html.match`; every v0.8.8 rule ID maps back to this document, and all three migration ledgers retain their source boundary. Implementers MUST NOT emit Manifest 1.6 or Token Schema 5 as current v0.8.8 conformance and MUST NOT create another prose patch layer.

The v0.8.8 public-safe package MUST continue to exclude logo, photograph, poster, font, PDF, and other protected source binaries. Its identity and media manifests record approved exact hashes and use boundaries; its font manifest records the required faces and unresolved external asset records. An artifact cannot pass logo, media, or font gates until it supplies the exact permitted binaries and validates them. Package-level validation therefore means the specification, schemas, mappings, fixtures, approvals, and hashes are internally consistent—not that a downstream artifact has passed production QA.

The loader supplies:

```txt
validated Build Card
→ always-on shared Core (target ≤6,900 words)
→ locale-specific Core only when its locale is active/additional (target ≤650 words)
→ exactly one compact Profile plus its selected product voice (target ≤900 words)
→ only triggered packs (target ≤900 words each)
→ only referenced token rows
→ automatically derived applicable QA
```

Targets guide context size; meaning and safety are never cut to meet them. Unselected product voices, locale rules, fixtures, recipes, migration evidence, schemas, proofs, and QA controls remain unloaded and MUST NOT become visible UI merely because they exist.

The current migration ledger records every v0.8.7 rule and the older ledgers remain historical evidence:

```yaml
fromRule: "v0.8.7 rule or clause"
toRule: "v0.8.8 owning ID"
disposition: retained | profile | trigger_pack | reference_lab | superseded
predicate: "Build Card condition"
acceptance: automated | manual | both
reason: "required when superseded"
```

No unmapped rule may disappear silently. P0 truth, privacy, accessibility, official identity, and critical-object correctness cannot be waived.


The generated Build Card and Manifest projection also validate:

- every promoted-scene quiet-region record, threshold, background type, and manual low-detail evidence;
- every rendered atmosphere surface against its exact recipe, role, focal target, contrast evidence, cadence, and deletion result;
- every rendered connector against endpoints, named relationship, style/arrow meaning, mobile behavior, accessible alternative, and deletion result;
- absence of visual styling caused only by `data-quiet-field`;
- absence of local gradient values or connector styles that bypass the generated recipes/records.

Suggested package rule:

```txt
human intent lives here once
→ exact values live in generated machine source once
→ profile selects conditional rules
→ preflight tests rule IDs
→ examples and migration history remain reference-only
```

---

# Appendix C — Release record and boundaries

## C1. Intent retained from v0.8.5

- official identity and exact Brand Blue protection;
- no controlled purple/periwinkle/terracotta and exact series v5 migration;
- Auto/Light/Dark and one active language;
- locale-specific Arvo/IBM Plex Product UI heading roles and Bai Jamjuree body/control roles;
- Meter · Diversity · Depth and functional brand memory;
- first AHA before request;
- evidence/source/date/confidence/limitation and truthful states;
- accessible, mobile-first, reduced-motion and no-JS meaning;
- decision-led data visualization, deterministic three-anchor scales, and no pie/donut;
- map/legend/evidence synchronization;
- transparent learning, voluntary investment, privacy, consent, and relevant-circle coordination;
- exact-object sharing with recipient value;
- network effect only after observed recipient-side usefulness;
- role alignment and one governed meaning across products/channels;
- Context Discovery safety and bounded agent/channel parity;
- the ten-proof deck, Scale Lab, polygon task, contextual typography, motion, and coverage intent through conditional Reference/Lab;
- complete release QA without fabricated capability.

## C2. v0.8.6 amendments

- exact Cultural activation line: **Let us cultivate our city.**
- positive energy is a functional brand requirement for adoption/culture surfaces;
- human-readable and generated Token Schema 6 retain v0.8.5 IDs and add only `energy.*`, the four exact approved 2025 accent values as controlled expression roles, plus the missing light `interaction.accent`; rendered artifact contrast and role-use validation remain scoped to each implementation;
- `designsystem.adoption` becomes a separate profile;
- default story, Reference, and Lab are separate modes;
- measurable first-viewport, navigation, density, and control budgets;
- a protected quiet field occupying at least 30% of promoted tablet/desktop scene area and 20% on mobile, with a non-strip minimum dimension and measured visible intersection;
- zero dead or capability-less controls;
- all shimmer is removed, including the earlier loading-only exception, in favor of honest static/progress state;
- explicit anti-generic copy and composition gate;
- one compact theme/settings control replaces the requirement to expose three peer buttons at all times;
- Trigger Packs run only when their declared capability, publication, privacy, investment, or delivery branch applies;
- a portable mockup no longer inherits the full production evidence bundle;
- rule-ID architecture replaces repeated normative prose.

## C3. v0.8.7 amendments

- active-language copy is authored and reviewed before layout;
- `[VOICE-01]` and the replacement `[COPY-01]` protect the value of real people, work, evidence, places, and decisions from generic abstraction;
- `[LOCALE-TH-01]` adds native-Thai authoring, read-aloud, qualified Thai review, and evidence-bound parity without treating English as the source language;
- each human-facing locale records its rule authority, authoring basis, exact copy hash, naturalness review, and parity review;
- Landometer shared voice remains product-neutral, while CityMETER voice remains product-specific and evidence-bound;
- `[LOGO-SURFACE-01]` separates the official asset, transparent canvas, native surface, integral-background exception, and separate plate;
- every logo/surface branch requires a current exact Brand identity approval; asset custody, token existence, or manifest registration never grants approval;
- a transparent horizontal lockup directly on an approved clean surface is the preferred normal branch;
- Thai naturalness, value preservation, character budget, cross-locale meaning, and logo/surface gates join scoped QA;
- no Profile, Trigger Pack, optional capability, token, default-route scene, menu, mode, card, or control is added.

## C4. v0.8.8 amendments

- `[SPACE-01]` defines quiet as a perceptual attention condition rather than a mandatory blank rectangle or visible component;
- a quiet region may be open surface, photograph negative space, low-detail crop, governed gradient, photo/scrim, or a continuous field behind one dominant message/proof;
- useful photography may be full-bleed or span the scene and MUST NOT be reduced merely to preserve a filler quiet column;
- a deterministic gradient/scrim may support hierarchy and contrast while preserving people, context, skin tone, material evidence, and truthful documentary appearance;
- `[SURFACE-01]` restores Measure, Ground, Cultivate, and product-specific atmosphere recipes using only existing exact values and requires a declared job, focal target, reading direction, contrast strategy, cadence, and deletion test;
- `[BRAND-04]` keeps exactly three semantic promoted moments while allowing two to four major atmosphere moments on a genuinely long route without turning gradients into a quota;
- `[RELATION-01]` permits lines, arrows, curves, paths, brackets, and loops only when they encode a named sequence, direction, dependency, cause/effect, handoff, shared object, feedback, spatial, or temporal relationship;
- Build Card 0.8.8 adds composition records for quiet regions, gradient surfaces, and connectors; Manifest 2.0 and Token Schema 6 remain unchanged;
- font-family roles remain unchanged, while implementation must load all required Thai/Latin subsets and declared weights;
- locale rendering hides only inactive content and preserves the active element’s semantic/component display role; `display: initial` restoration is prohibited;
- QA adds reading-start, quiet-region, focal-subject, gradient deletion, connector deletion, rendered contrast, and delivered-composition evidence;
- no Profile, Trigger Pack, optional capability, raw color value, protected brand line, product truth, evidence boundary, menu, mode, or default-route scene is added.

## C5. Reconciliation record

This release integrates the owner-directed Perceptual Quiet, Brand Atmosphere Surface, Full-Bleed Media, and Connector Integrity patch into the v0.8.7 simplified integrated master. The patch is not required at authoring time because every amendment now lives in its owning rule, Build Card record, QA gate, migration section, or Appendix A recipe.

| Integration input | SHA-256 |
|---|---|
| `landometer_design_system_v0_8_7_simplified_integrated(1).md` | `e4c52ed9c596d0077f3f9aa4cd2643ece5c722827da71e20eba6c679c1306e22` |
| `landometer_design_system_v0_8_7_patch.md` | `b7987e9533a51e4c057dc940c7bad5bab64de911af18f40640eb861930e8106a` |

The reconciliation preserves the v0.8.5 Product UI heading migration, Signal Orange/Civic Slate series v5, ijji/activity/balance/tradeoff values, no-terracotta policy, dual-theme/Auto behavior, exact AHA budgets, recovery truth, channel parity, Context Discovery, bounded agent actions, ten-proof coverage, labs, role findability, v0.8.7 native-Thai authority, and v0.8.7 logo–surface approval logic. It adds no raw token value and does not promote any product-specific dataset, workflow, score, claim, or capability into the shared Landometer layer.

The owner instruction dated 25 July 2026 approves integration of the patch into this v0.8.8 authoring master. Existing v0.8.7 identity, media, font, and Thai fixture approvals remain hash- and scope-specific; they do not automatically approve a new crop, gradient-over-photo rendition, dark/busy logo pairing, third-party right, unreviewed visible screen, new product claim, deployment, or implementation that has not run its own v0.8.8 artifact QA.

The first v0.8.7 Living Reference implementation remains historical regression evidence for literal quiet blocks, reduced photography, missing atmosphere, incomplete font subsets, semantic-display locale errors, and non-semantic connector use. Its visual defects are not preserved as compatibility requirements.

## C6. Historical-source boundaries

- Brand Visual Guidelines 2025 governs logo lineage and records visual history, but its page-level three-color quota is superseded.
- The historical Brand Guidelines beige value is evidence of prior brand usage, not the current implementation token and not an automatic plate colour. Canonical `brand.beige` remains `#F2F1DF`; an approved plate uses only the exact `identityApproval.surfaceRef`.
- Onboarding supplies cultural evidence: real end user, action, field truth, collaboration, curiosity, commitment, learning, and good energy.
- Introduction and GTM supply product, people, progress, and narrative evidence; their dense pages and legacy hype are not templates.
- Supplied team/work photographs have owner permission records, exact hashes, conservative context descriptions, and use restrictions in `media-assets.manifest.json`. Public use still requires the recorded crop/screen/privacy/third-party checks for that exact rendition.
- New approved intent enters its owning v0.8.8 rule or Trigger Pack, never a runtime prose patch.

Approved source roles remain conditional on the recorded use boundary:

| File | Suitable role | Boundary |
|---|---|---|
| `11-IMG_9244.jpeg` | identity/opening support | posed team portrait; pair with separate work proof rather than treating the portrait as operational evidence |
| `06-IMG_8786.jpeg` | internal/team context; public opening only after screen review | crop/redact private meeting/chat content and record the exact public rendition |
| `05-IMG_5698.jpeg` | culture/identity support | no task/product is visibly identifiable; use as role proof only with a verified caption |
| `08-IMG_6520.jpeg` | culture/shared moment | supporting scene, not analytical proof |
| `10-MN8_6386_Original.jpeg`, `13-IMG_6145.jpeg`, `14-IMG_4412.jpeg` | evidence of event/product/institution context | use only with an exact caption; visible marks do not imply endorsement |
| 2026 hiring posters | historical visual-spirit evidence | underlying stock/third-party rights remain separate; dense poster composition is not a current layout template |

## C7. Package release-gate disposition

Owner approval closes the v0.8.8 authoring decision; generated records close only package-level machine gates after regeneration. The active disposition is:

| Gate | Disposition |
|---|---|
| Manifest and tokens | Manifest 2.0 and Token Schema 6 remain unchanged; no new raw color value is authorized |
| Build Card | schema advances to 0.8.8 to carry quiet-region, atmosphere-surface, and connector records |
| Surface recipes | Measure, Ground, Cultivate, and Product-specific recipes reference exact Appendix A values; generated recipes MUST NOT duplicate or alter the canonical token registry |
| Connector records | generated schema validates endpoints, relationship, style/arrow meaning, responsive behavior, accessible alternative, and deletion result; it does not create decorative connector presets |
| Exact identity assets and pairings | Existing approval remains only for the supplied hashes and recorded surfaces/contexts; a gradient recipe does not grant logo approval and direct dark/busy placement remains blocked unless separately approved |
| Media/crop/overlay | Existing source permissions remain scope-specific; every new crop, redaction, or gradient/scrim rendition requires exact variant/hash, context, privacy/screen review, and approved use |
| Native-Thai fixtures | `thai-voice-fixtures-v0.8.7-v1` remains the approved fixture set because v0.8.8 changes composition, not voice; a future fixture revision requires its own approval |
| Shared voice authority | `[LDM-VOICE-01]` and `[CITYMETER-VOICE-01]` remain owner-approved; product claims still require current Product Brief and evidence authority |
| Public and skill package alignment | v0.8.8 public specification, skill source, release lock, Build Card schema, Manifest schema, surface recipes, connector schema, fixtures, identity/media/font manifests, source fingerprint, tokens, adapters, and all three rule ledgers MUST be version-locked before package release |
| Package QA | structural, hash, rule-map, schema-fixture, surface-recipe, connector-record, Thai/English fixture, public-safe exclusion, and regression checks MUST pass before the release manifest is signed |
| Artifact QA | remains mandatory per Build Card; package validation cannot pre-pass browser, accessibility, responsive, privacy, asset-delivery, contrast, quiet-region, gradient, connector, or effect checks for an artifact |

No package-level P0/P1 may remain in the signed validation report. A downstream artifact begins at `machineValidation: pending` and earns `passed` only from its own applicable generated preflight and manual evidence.

## C8. Final normative statement

Landometer Design System v0.8.8 succeeds when it makes real people, work, evidence, places, and decisions easier to understand and use—without replacing their value with generic language, shrinking useful media to manufacture emptiness, using gradients without a job, or drawing relationships that are not real.

Quiet is the part of the composition that lets the reader notice what matters first.

A photograph may remain large.  
A gradient may create direction.  
Text may sit over genuine calm.  
A line may connect things only when the relationship is real.

> **Let us cultivate our city.**

# Appendix D — Reference-only Thai voice recipe and approved structural fixtures

**Reference ID:** `thai-voice-fixtures-v0.8.7-v1`  
**v0.8.8 disposition:** retained unchanged; v0.8.8 changes composition rather than voice  
**Status:** owner-approved structural fixture set; exact Thai/English siblings and review records live in `thai-voice-fixtures-v0.8.7.json`  
**Load behavior:** reference and QA only; never part of default Core, Profile, or visible UI  

These fixtures test structure and naturalness. Placeholders MUST resolve from the Build Card and canonical evidence record before use. Approval makes the structures usable as QA fixtures; it does not turn them into CityMETER claims, campaign copy, product availability, or evidence. The generated fixture file carries independently structured English siblings and the owner approval/parity record.

## D1. Thai lint and deletion tests

Flag for human review when these words appear without a named object and observable consequence:

```text
ขับเคลื่อน
ยกระดับ
ปลดล็อก
พลิกโฉม
ศักยภาพ
โซลูชัน
อินไซต์
ผลกระทบ
มีความหมาย
มีประสิทธิภาพ
อย่างชาญฉลาด
ไร้รอยต่อ
ตอบโจทย์
ครบวงจร
```

These words are not absolutely banned. The writer must show why each is more exact than an ordinary alternative.

Flag:

- English-shaped Thai;
- abstract-noun piles;
- bureaucratic passive voice without a responsible actor;
- repeated `ช่วยให้ / ทำให้ / เพื่อให้` chains;
- CTA labels that do not say what happens next;
- machine-translated symmetry between Thai and English;
- repeated caveats that make verified work sound untrustworthy;
- inspirational claims that could belong to any AI, SaaS, consultancy, or civic-tech company.

Deletion tests:

1. **Adjective deletion:** remove adjectives. If nothing specific remains, rewrite.
2. **Brand deletion:** remove the logo and company name. If the copy still fits any AI/SaaS company, rewrite.
3. **Value deletion:** ask who did what, what changed, what supports it, and who can act. If simplification removed those answers, restore them.

Fixture review asks:

- Would a Thai colleague say this to explain real work?
- Is there a visible person, object, place, decision, or consequence?
- Does the sentence give verified work its proper weight?
- Is the limitation specific and proportionate?
- Does the CTA describe what happens next?
- Could the line be pasted into any AI/SaaS website unchanged?

## D2. Approved native-Thai structures

| Context | Reject | Approved structure |
|---|---|---|
| Adoption CTA | `ลองกับงานของฉัน` | `เลือกงานที่จะลอง` — only when the action opens a real work-object selection |
| Adoption support | `ดูว่าอะไรเปลี่ยน และทีมถัดไปทำงานต่อง่ายขึ้นอย่างไร` | `เลือก [แผนที่/รายงาน/ข้อมูลพื้นที่ตาม Build Card] ที่กำลังทำ แล้วตรวจว่าคนที่รับงานต่อเห็นสิ่งที่พบ แหล่งข้อมูล ข้อจำกัด และขั้นตอนถัดไปครบหรือยัง` |
| Handoff receipt | `ส่งต่องานสำเร็จ` | `ส่ง [ชื่อชิ้นงาน] ฉบับที่ [เลข] พร้อมแหล่งข้อมูลและข้อจำกัดแล้ว` |
| Shared data explanation | `เปลี่ยนข้อมูลให้เป็นผลลัพธ์ที่มีความหมาย` | `จาก [ชุดข้อมูล/แหล่งข้อมูล/วันที่] พบว่า [สิ่งที่พบ] ภายใน [พื้นที่/ช่วงเวลา] ใช้ประกอบ [การตัดสินใจ] ได้เมื่อ [เงื่อนไข] และยังไม่ครอบคลุม [ข้อจำกัด]` |
| Shared work-artifact explanation | `สร้างความหมายร่วมให้ทุกการส่งต่อ` | `[ชื่อชิ้นงาน] สรุป [ข้อค้นพบ] จาก [แหล่งข้อมูล] และระบุสิ่งที่ [ผู้รับช่วงต่อ] ตรวจหรือทำต่อได้` |
| Decision framing | `ข้อมูลเมืองที่ขับเคลื่อนการตัดสินใจอย่างชาญฉลาด` | `เริ่มจากคำถามว่า ใครกำลังตัดสินใจเรื่องอะไร และยังต้องมีข้อมูลหรือหลักฐานอะไรเพิ่ม` |
| CityMETER map start | `สำรวจอินไซต์` | `เลือกพื้นที่บนแผนที่` — only when the control opens a real map selection |
| CityMETER result | `พื้นที่นี้มีความเสี่ยงสูง` | `ใน [ชื่อชุดข้อมูล] พบ [สิ่งที่พบ] ภายใน [พื้นที่] ช่วง [เวลา] จึงควรตรวจ [สิ่งต่อไป] ก่อนตัดสินใจเรื่อง [เรื่อง]` |
| Comparison | `พื้นที่ ก มีประสิทธิภาพดีกว่า` | `[ตัวชี้วัด/หน่วย] ของ [พื้นที่ ก] สูงกว่า [พื้นที่ ข] ในช่วง [เวลา] แต่ข้อมูลนี้ยังไม่บอกสาเหตุ ต้องตรวจ [ข้อมูลเพิ่ม] ก่อนสรุป` |
| Limitation | `ข้อมูลอาจไม่สมบูรณ์ โปรดใช้วิจารณญาณ` | `ข้อมูลชุดนี้อัปเดตถึง [วันที่] และยังไม่รวม [ขอบเขต] ใช้ดู [ประเด็น] ได้ แต่ยังใช้ยืนยัน [ข้อสรุป] ไม่ได้` |
| Provisional state | `ผลลัพธ์นี้เป็นเพียงค่าประมาณ` | `จาก [หลักฐาน] ผลเบื้องต้นชี้ว่า [ข้อ] แต่ [เรื่องที่ยังสรุปไม่ได้] ต้องตรวจเพิ่ม เพราะ [เหตุผล]` |
| Source note | `ตรวจสอบ Source Ledger ก่อนสรุปผล` | `ดูแหล่งข้อมูล วันที่อัปเดต วิธีคำนวณ และข้อจำกัดก่อนนำผลนี้ไปใช้` |
| Empty state | `ไม่พบอินไซต์ที่เกี่ยวข้อง` | `ยังไม่มีข้อมูลที่ตอบคำถามนี้ ลองขยายช่วงเวลา หรือเลือกชั้นข้อมูลอื่น` |
| Error and recovery | `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง` | `เปิด [ชื่อชุดข้อมูล] ไม่ได้ในตอนนี้ พื้นที่ที่เลือกไว้ยังอยู่ ลองอีกครั้งหรือเลือกดู [ทางเลือก]` |
| Boundary warning | `ขอบเขตอาจมีความคลาดเคลื่อน` | `เส้นเขตนี้มาจาก [แหล่งข้อมูล/วันที่] และอาจไม่ตรงกับขอบเขตที่ใช้หน้างาน` |
| Recommendation | `AI แนะนำให้ดำเนินการทันที` | `จากข้อมูลที่มี ควรตรวจ [จุด/เรื่อง] ต่อก่อน ข้อมูลนี้ยังยืนยัน [ผล] ไม่ได้` |
| Executive answer | `ข้อมูลแสดงอินไซต์ที่มีนัยสำคัญ` | `จาก [หลักฐานที่ยืนยันแล้ว] ตอนนี้สรุปได้ว่า [สิ่งที่พบ] ภายใน [ขอบเขต] ส่วน [เรื่อง] ยังต้องมี [ข้อมูลเพิ่ม] ก่อนตัดสินใจเรื่อง [เรื่อง]` |
| Correction | `ข้อมูลได้รับการอัปเดตแล้ว` | `แก้ไขเมื่อ [วันที่]: เปลี่ยน [ข้อความ/ค่า] เพราะตรวจพบว่า [สิ่งที่ผิด] เวอร์ชันก่อนยังเปิดดูย้อนหลังได้` |
| Recruitment | `ร่วมสร้างผลกระทบที่มีความหมายกับเรา` | `คุณจะได้ทำงานกับโจทย์เมืองจริง ตั้งแต่ตั้งคำถาม ตรวจข้อมูล ไปจนถึงทำชิ้นงานที่ทีมใช้ต่อได้` |

An approved fixture may use `ยืนยันได้` only when the governed truth state is explicitly verified. It MUST NOT convert provisional, modelled, proxy, or recommendation status into verified fact.
