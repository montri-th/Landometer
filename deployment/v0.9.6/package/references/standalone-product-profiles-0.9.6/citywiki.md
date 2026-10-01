# CityWiki Add-on profile 1.0.0 — for LDS 0.9.6

**Required foundation:** [Landometer Design System 0.9.6 — complete base normative](https://montri-th.github.io/Landometer/v0.9.6/normative/Landometer-Design-System-v0.9.6.md). For a product Project Source, upload the base Markdown and this Add-on Markdown: two design files. Do not upload a duplicated combined product/base file.

## Charming Voice, Editorial Experience, Evidence, and Interface Profile

**Release:** `1.0.0`<br>
**Original profile prepared:** 12 July 2026<br>
**Foundation consolidation:** 30 September 2026 (`standalone-0.9.5-r2`)<br>
**Status:** CityWiki-specific normative profile<br>
**Parent design system:** Landometer Design System `0.9.6`<br>
**Parent manifest version:** `1.1`<br>
**CityWiki content operating specification:** CityWiki Prompt Attachment `2.4`<br>
**Applies to:** CityWiki public pages, portable CityWiki artifacts, CityWiki previews, CityWiki editorial components, CityWiki machine summaries, and CityWiki QA<br>
**Does not apply to:** Landometer main website, CityMETER, CityChat, ijji, campaign pages, decks, or non-CityWiki explainers<br>
**Audience:** Product, editorial, research, design, engineering, QA, and AI generation agents

---

# 0. How to use this document

This is the separate CityWiki design Add-on. Use it alongside the complete LDS 0.9.6 base normative, which owns the shared rules and exact shared machine values. This Add-on includes CityWiki-specific rules and product machine values only; it does not embed or replace the shared base. No older LDS master or predecessor CityWiki design document is required. The CityWiki product profile identity stays `1.0.0`; the foundation migration is a documented consolidation, not a silently invented CityWiki release. This chapter preserves CityWiki Charming voice, editorial, component and QA rules without weakening evidence. Prior design files and multi-file assembly instructions are superseded as active authoring guidance for new work.

The governing change is:

```text
Landometer shared public voice
= calm · clear · evidence-aware · civic-minded · action-capable

CityWiki public voice
= Charming
```

For CityWiki, clear, grounded, practical, safe, and citable are release conditions. They are not additional voice traits and must not flatten the writing into an analytical or corporate tone.

## 0.1 Release equation

```text
CityWiki Design System 1.0
= the separate complete LDS 0.9.6 visual and technical base normative
+ CityWiki Prompt Attachment 2.4 research, evidence, boundary, citation, and charm contracts
+ recurring patterns from the internal ten-sample human-quality reference set
+ prior CityWiki reader and writing-style reviews
- brand-wide voice leakage
- dashboard prose
- encyclopedic default structure
- decorative travel writing
- duplicated CityWiki production rules
```

## 0.2 What this profile overrides

When this document conflicts with the Landometer master, it overrides only these CityWiki concerns:

1. public communication voice;
2. CityWiki editorial hierarchy and narrative movement;
3. CityWiki-specific content components;
4. visual composition choices for a CityWiki reading experience;
5. CityWiki voice and charm QA;
6. CityWiki manifest extensions and named rules.

It does not override official logo rules, visual tokens, accessibility requirements, delivery-mode rules, source permissions, privacy, metadata safety, performance budgets, or machine/public parity.

## 0.3 Source precedence

Use this order when CityWiki instructions conflict:

1. current CityWiki production specification for mode, output type, evidence, boundary, citations, media, and publishing safety;
2. this CityWiki design-system profile for voice, editorial composition, CityWiki components, and CityWiki QA;
3. Landometer Design System `0.9.6` schemas and canonical tokens;
4. the selected delivery-mode contract;
5. current source and rights records;
6. approved CityWiki fixtures;
7. internal human-quality reference samples;
8. historical drafts and screenshots.

The human-quality samples are style references, not factual sources and not templates to copy sentence by sentence.

## 0.4 Normative language

| Term | Meaning |
|---|---|
| **MUST / MUST NOT** | Release requirement |
| **SHOULD / SHOULD NOT** | Expected unless a documented exception is approved |
| **MAY** | Optional when evidence and context support it |
| **EXAMPLE** | Illustration, never a new factual claim or token source |
| **INTERNAL ONLY** | Must not appear in public prose, HTML comments, metadata, schema, agent output, filenames, or analytics labels exposed to users |

## 0.5 Privacy of the human reference

The identity and private profile behind the internal human-quality reference are **INTERNAL ONLY**.

Public and machine-delivered CityWiki output MUST NOT include:

- the person’s name;
- private biography, CV, interview detail, personality analysis, or demographic profile;
- phrases such as “written in [person] style”;
- benchmark comparisons or internal quality labels;
- sample filenames or internal review notes.

Any neutral internal alias belongs only in restricted project documentation. Do not emit a benchmark alias or its identity into public artifacts or distribution metadata.

## 0.6 Evidence base and known source gap

The original CityWiki 1.0.0 profile reports an earlier project review of ten human-authored golden samples and a direct consolidation review of eight of them. Its source gap was two unavailable samples. The figures below are retained as historical evidence reported by that source; the LDS 0.9.5 consolidation did not claim to have independently repeated the sample review.

The original profile reported these consistent patterns across the eight inspected samples:

| Observable pattern | Result across eight available samples |
|---|---:|
| Quick answer | 8 / 8 |
| Explicit fit and misfit | 8 / 8 |
| “Why this place is worth your time” narrative | 8 / 8 |
| No-car or access guidance | 8 / 8 |
| Honest comfort / etiquette reading | 8 / 8 |
| Best time and duration | 8 / 8 |
| Nearby combination | 8 / 8 |
| Sources and limitations | 8 / 8 |
| Approximate word range | 1,728–2,047 English words |
| Median sentence length by page | 17–26 words |

These figures describe the reference set. They are not fixed output quotas. The rules below also preserve conclusions from the earlier ten-sample project review.

---

# Part A — CityWiki product and voice foundation

# 1. Product identity

Always use the exact name:

```text
CityWiki
```

CityWiki is Landometer’s public place-knowledge layer. It helps a reader understand what a place really is, decide whether it fits, plan a realistic way to experience it, notice what ordinary search results miss, and act with more respect for the place and the people who live there.

## 1.1 CityWiki promise

> **Understand a place well enough to feel curious, prepared, and respectful.**

This is a product promise, not a hero tagline that must appear on every page.

## 1.2 CityWiki is not

CityWiki is not:

- a generic destination list;
- a copied tourism article;
- an encyclopedia with warmer adjectives;
- a map with prose attached;
- a ranking engine for “best” places;
- a diary that implies first-hand experience without field evidence;
- a dashboard that exposes research machinery before the place;
- a vehicle for romanticizing hardship or treating residents as scenery.

## 1.3 Desired reader state

After the first screen, the reader should be able to say:

```text
I know what this place is.
I know why it may matter to me.
I know whether it fits my trip.
I know the main effort or friction.
I want to notice one thing I would otherwise have missed.
```

After the full page, add:

```text
I know how to approach the place.
I know what must be checked again.
I know how not to intrude.
I can explain what makes this place different without repeating a slogan.
```

# 2. The single CityWiki voice: Charming

## 2.1 Definition

```text
CityWiki charm
= grounded surprise
+ local specificity
+ reader care
+ human meaning
+ narrative restraint
```

A CityWiki page is charming when it feels written by someone who paid attention, understood what the reader is worried about, and found a true local detail worth carrying home.

Charm is earned through noticing. It is not added through prettier adjectives.

## 2.2 What “Charming” means in practice

| It means | It does not mean |
|---|---|
| Warm invitation | Promotional enthusiasm |
| Specific editorial judgment | Unsupported opinion |
| A quiet surprise that explains the place | A clickbait hook |
| Direct help with an actual trip decision | A long completeness checklist |
| Small true details | Decorative sensory invention |
| Respect for ordinary local life | Exoticizing residents |
| Honest friction | Repeated warnings |
| Varied, natural sentence rhythm | Forced informality |
| A memorable aftertaste | A generic inspirational ending |

## 2.3 The voice override rule

Do not score CityWiki public prose against separate “Clear,” “Grounded,” or “Energetic” tone targets.

Instead:

```text
Truth, boundary, source, practical usefulness, privacy, and accessibility
= hard gates

Charming
= the public editorial voice
```

A factual but dry page fails the CityWiki profile. A charming but weakly sourced page also fails.

## 2.4 Three working principles

1. **Warm before clever.** The reader should feel accompanied, not impressed by the writer.
2. **Specific before poetic.** Use a name, object, process, route, or action before an adjective.
3. **Practical before promotional.** Help the reader choose and plan; do not sell the destination.

## 2.5 The CityWiki editorial posture

Write as a thoughtful local-research companion who:

- answers quickly;
- has an informed point of view;
- distinguishes good fit from poor fit;
- notices ordinary things with care;
- is candid about heat, distance, access, timing, crowds, uneven paths, or limited transport;
- knows when a story is lore rather than fact;
- protects the dignity of residents, makers, worshippers, workers, and migrants;
- never pretends to have stood somewhere without field evidence.

The voice may be gently opinionated. It may not be careless.

# 3. The six moves of a charming CityWiki page

These are writing moves, not mandatory headings.

## 3.1 See the reader’s decision

Choose one primary reader and one secondary reader. State internally:

```yaml
primary_reader: ""
secondary_reader: ""
main_job: ""
main_anxiety: ""
main_decision: ""
main_action_after_reading: ""
```

The page MUST answer the primary reader’s decision. Do not average several audiences into generic prose.

## 3.2 Find the true local surprise

Look for one strong relationship that changes how the place is understood:

- a name that compresses history;
- a working place behind a famous image;
- an overlooked origin of something known elsewhere;
- a route that reveals why the settlement exists;
- a craft still made rather than merely displayed;
- a community choice that preserved or changed the place;
- an expectation that needs an honest reset.

This is the story thesis. It must survive fact-checking and boundary review.

## 3.3 Turn evidence into experience

For each major claim, move through:

```text
fact
→ local meaning
→ something the reader can notice or do
→ implication for the plan
→ confidence cap
```

Do not stop at “this temple was built in 1910.” Explain what that date makes legible in the route, building, ritual, or community—only when sources support the connection.

## 3.4 Make the plan feel possible

Practical guidance is part of the charm because it reduces anxiety.

Where relevant, give:

- a realistic arrival point;
- the no-car route, not only the driving route;
- the useful order of stops;
- a short and long version;
- likely duration;
- main friction;
- what requires a same-day check;
- return-transport risk;
- cash, footwear, heat, step-free access, or prayer-space considerations.

Never fabricate live details to make the plan feel complete.

## 3.5 Protect local dignity

Show people through public work, craft, food, ritual, institutions, routes, and documented community choices. Do not mine private lives for colour.

The reader should understand:

- where they are entering a living or sacred place;
- when to ask before photographing;
- how spending can support local makers without moral performance;
- what not to treat as a prop;
- why an ordinary scene matters without calling it “untouched.”

## 3.6 Leave a grounded aftertaste

The ending SHOULD make one earlier detail newly meaningful:

- a name now makes sense;
- an object becomes legible;
- a route explains the place;
- a craft feels more valuable;
- a famous neighbour looks different;
- the reader knows how to support or respect the place.

Do not end with “a journey you will never forget,” “something for everyone,” or another generic promise.

# 4. Language and rhythm

## 4.1 Diction

Prefer:

- plain verbs: `is`, `has`, `uses`, `makes`, `grew`, `changed`, `cross`, `walk`, `wait`, `buy`, `notice`;
- exact nouns: the local food, tool, material, pier, shrine, lane, tree, ferry, ritual, or craft name;
- concrete relations: across the river, behind the market, after the last ferry, beside the school, just outside the strict boundary;
- calibrated judgment: worth the detour for this reader, awkward without a car, quiet after the market closes, better as a morning walk.

Avoid:

- vague authority: `experts say`, `many believe`, `locals say` without a named source;
- inflated travel language: `breathtaking`, `magical`, `unforgettable`, `world-class`, `must-visit`;
- unearned authenticity: `real Thailand`, `untouched`, `timeless`, `hidden gem`, `off the beaten path`;
- AI filler: `rich tapestry`, `nestled`, `vibrant blend`, `delve into`, `offers a unique glimpse`, `whether you are...`;
- corporate language: `unlock`, `leverage`, `seamless`, `data-driven journey`, `actionable insight` in public destination prose;
- arbitrary synonym swapping when repeating the correct local word is clearer.

## 4.2 Sentence rhythm

The reference voice is not uniformly short. Across the available samples, median sentence length varies from 17 to 26 words, with occasional longer sentences used to connect history, place, and reader meaning.

Use:

- a short sentence for the expectation reset;
- a medium sentence for the explanation;
- an occasional longer sentence when several details form one real relationship;
- fragments only for labels, fit/misfit, or deliberate emphasis;
- paragraph breaks when the reader’s question changes.

Do not make every sentence the same length. Do not create rhythm by stacking one-line claims.

## 4.3 Direct address

Use `you` when it helps the reader picture a choice, movement, or practical consequence. The reference pages use direct address sparingly rather than conversationally throughout.

Good uses:

- what you see after crossing the bridge;
- whether you need a car;
- where to start;
- what to check before leaving;
- when to put the camera down.

Avoid pretending to know how the reader will feel.

## 4.4 First person

First-person field statements such as `I visited`, `we found`, `I could smell`, or `we recommend after trying it` require attributable field observation.

Without field evidence:

- write in the third person or direct second person;
- qualify repeated review, image, or video observations;
- never manufacture an on-the-ground narrator.

## 4.5 Sensory detail

Sensory detail is allowed only when supported by:

1. field observation;
2. an attributable description;
3. repeated review, image, or video evidence;
4. a stable physical property.

Name the evidence state internally. Do not infer smell, sound, temperature, crowd mood, or emotion from a single image.

## 4.6 Thai and English

Write naturally in each language. Do not translate sentence structure mechanically.

For Thai:

- use Thai place names and local terms exactly;
- favour spoken clarity without slang performance;
- keep official terms where precision matters, then explain them in ordinary Thai;
- avoid piling English labels into Thai prose;
- use paragraph rhythm suited to mobile reading;
- do not force English-style irony when it sounds unnatural.

For English:

- retain useful Thai names in Thai script and transliteration;
- explain a local term once, then reuse it consistently;
- write for a reader who may not know Thai geography, worship etiquette, transport conventions, or administrative hierarchy;
- do not make Thai life sound exotic for effect.

For both languages, charm should come from the same place truth, but the phrasing may differ.

# 5. Dry, decorative, and charming

| Input | Dry | Decorative | CityWiki charming |
|---|---|---|---|
| A ferry connects two banks | “A ferry service is available.” | “Glide across shimmering water on an enchanting local ferry.” | “The river interrupts the road, so the route continues by ferry; the crossing is not a side attraction but the hinge of the day.” |
| A market is beside a station | “The station is located next to a market.” | “A bustling market welcomes travellers with vibrant local life.” | “The train arrives inside the market’s working rhythm, which is why the station makes more sense as a starting point than a photo stop.” |
| A craft takes a week | “Production takes approximately seven days.” | “Each exquisite piece is lovingly handcrafted.” | “One piece takes about a week to make. That human-scale number is the reason to watch the process before deciding whether the price feels high.” |
| Public transport is weak | “Access by public transport is limited.” | “The secluded setting rewards adventurous travellers.” | “Without a car, the last stretch is the trip’s main difficulty. Arrange the return before setting out, especially if the area thins out after late afternoon.” |

These are structural examples, not publishable claims about a real destination.

---

# Part B — Research-to-charm system

# 6. CityWiki must earn the right to write

The CityWiki production order remains:

```text
normalize input
→ resolve entity
→ test the semantic feature
→ initialize boundary and spillover
→ define destination research profile
→ complete mandatory research rounds
→ recover sparse evidence when needed
→ build broad candidate pools
→ run Local Story Intelligence
→ grade claims, stories, and sources
→ select anchor portfolio
→ create experience inventory
→ create place-truth packet
→ set reader contract
→ trial story spines
→ trial hooks
→ build route spine
→ write one canonical public story
→ validate public and machine outputs
```

Do not write the opening and then search for facts that support it.

# 7. Place truth before prose

Before drafting, complete:

```yaml
literal_identity: ""
visitor_expectation: ""
expectation_correction: ""
deepest_local_system: ""
strongest_human_detail: ""
strongest_spatial_or_route_detail: ""
honest_drawback: ""
local_agency_or_dignity: ""
best_supported_charm_atoms: []
things_that_must_not_define_the_place: []
```

If the expectation correction is generic, research is not finished.

# 8. Charm-candidate discovery

Charm candidates are evidence-backed story material. They do not need to be map pins.

## 8.1 Candidate classes

Use at least four classes on a normal page:

```text
name_story
quiet_irony
expectation_reversal
object_story
process_detail
human_scale_number
living_ritual
food_lineage
community_choice
origin_story
local_term
historical_echo
route_quirk
ordinary_scene
respect_detail
counterpart_comparison
source_tension
anti_charm
```

`anti_charm` is a true friction or mismatch that prevents romanticized writing.

## 8.2 Minimum publishable material

A normal destination page SHOULD contain at least:

- three small true things;
- three sentences that become false if moved to another destination;
- one local term or name story;
- one object, process, or human-scale detail;
- one living action or recurring ritual;
- one honest tension;
- one local agency or dignity cue;
- one grounded aftertaste.

Mode A and Mode B SHOULD target five non-transferable sentences and six to ten publishable charm atoms. Mode C follows the available evidence and changes output type when a complete page would require invention.

## 8.3 Charm evidence object

```json
{
  "charmId": "",
  "class": "",
  "linkedAnchorIds": [],
  "claimOrStoryLead": "",
  "localTerm": "",
  "onlyHereReason": "",
  "humanMeaning": "",
  "readerValue": "",
  "storyRole": "hook | identity_proof | route_scene | texture | tension | aftertaste | respect",
  "sourceIds": [],
  "sourceIndependenceCount": 0,
  "storyEvidenceStatus": "",
  "freshnessRisk": "",
  "privacyRisk": "",
  "publishableWording": "",
  "verificationNeeded": ""
}
```

# 9. Story spine and hook

## 9.1 Story-spine trials

Create at least five competing spines for Mode A/B and four for Mode C.

Use different families:

- paradox;
- hidden in plain sight;
- name as compressed history;
- working version versus famous cousin;
- made here, known elsewhere;
- small place, large consequence;
- community choice;
- honest expectation reset;
- route as revelation;
- one motif across several layers.

Choose the spine with the best evidence fit, only-here specificity, explanatory compression, route compatibility, reader relevance, local dignity, and restraint.

Reject a spine that depends on a spillover, weak anecdote, unsupported superlative, romanticized hardship, or generic chronology.

## 9.2 Hook trials

Create at least six hooks for Mode A/B and four for Mode C. The winning hook MUST:

1. state or imply a true place-specific tension;
2. be understandable without project jargon;
3. matter to the chosen reader;
4. be proven in the next paragraph by a linked anchor, small detail, or local relationship;
5. avoid promising emotion.

Do not begin with a date unless the date itself is the present-day place truth.

# 10. Boundary is part of the story

CityWiki MUST distinguish:

- strict administrative or research extent;
- lived destination core;
- route extension;
- controlled spillover;
- excluded or commonly confused places.

Boundary explanation belongs in public prose only when it helps the reader avoid a real misunderstanding. Keep machine geometry and leakage logic in machine output.

A famous outside anchor may support the route. It may not silently define the destination.

# 11. Source and citation behavior

Every public anchor’s first substantive mention MUST link to a source page that supports the anchor.

Charm details follow the same claim rules as key facts:

- a memorable detail is not exempt from citation;
- local lore must be labelled as lore and attributed;
- a repeated tourism claim does not become a verified fact through repetition;
- a search result page is not a source;
- a social post may support a current or community claim only within its evidence cap;
- image captions and videos are discovery leads, not automatic proof of access, permission, or current condition.

The public story should feel readable, not footnoted to death. Place citations at the first substantive mention and use a source ledger for detail.

# 12. Caveat allocation

For a normal destination page:

- uncertainty-marker sentences SHOULD remain below 8% of public sentences;
- more than 12% requires revision or a different output type;
- never place more than two caution sentences consecutively;
- put access uncertainty in access;
- put timing uncertainty in timing;
- put comfort uncertainty in comfort;
- keep one compact trust line near the top;
- consolidate source limitations at the end;
- do not repeat the same caveat.

Weak evidence reduces certainty. It must not reduce research effort or curiosity.

---

# Part C — Public editorial architecture

# 13. One canonical story

Produce one human-facing narrative:

```text
public_story.md
```

Do not produce competing public versions such as `human_preview.md`, `public_page.md`, and `article.md`. Derived channels must use the same governed content object.

# 14. First-screen contract

The first 150–250 words MUST include:

1. a truthful identity hook;
2. one linked anchor or concrete local detail;
3. why the place matters;
4. who it fits;
5. who may not enjoy it;
6. likely trip shape or duration;
7. the main friction;
8. no more than one compact trust sentence.

Do not begin with mode, score, polygon, source shortage, indexing, methodology, or verification workflow.

## 14.1 Quick-answer form

A useful quick answer normally follows:

```text
what it is
→ why it is different
→ best trip shape
→ good fit
→ poor fit
→ main friction
```

This is a meaning sequence, not a sentence template.

# 15. Adaptive page structure

Use only modules supported by evidence and relevant to the reader.

```md
# [Destination]

[Compact trust line and last-verified date]

## Quick answer

## Why this place is worth your time

## How CityWiki defines this destination
[Only when boundary clarification changes the plan.]

## Best way to experience it

## The route and selected anchors
[Link every anchor on first substantive mention.]

## What to eat, buy, learn, or notice
[Use only the relevant nouns.]

## Local respect and comfort

## Best time, how long, and who should go

## Combine it with
[Label spillover clearly.]

## FAQ

## Sources and limitations

## Help improve this CityWiki page
```

The heading wording MAY change naturally by language and destination. The reader jobs must remain.

## 15.1 Evidence-triggered modules

Include only when supported:

- food;
- craft;
- stay overnight;
- accessibility;
- family;
- wildlife;
- business;
- property;
- civic services;
- festival;
- history;
- community contribution.

Omit a weak module. Do not fill it with generic advice.

# 16. Narrative movement

The page SHOULD move rather than catalogue:

```text
arrive
→ understand
→ notice
→ move
→ eat / learn / pause / participate
→ handle friction
→ respect
→ leave or extend
```

The route gives facts an order. It also prevents the page from becoming separate lists of attractions, food, and history.

# 17. Fit and misfit

Every destination page MUST say who it suits and who may prefer something else.

Good fit/misfit language:

- relates to the actual experience;
- helps the reader avoid a mismatch;
- does not insult the reader or place;
- includes access, pace, terrain, nightlife, crowds, scale, or desired activity only when relevant;
- avoids pretending the page can suit everyone.

Fit is editorial guidance, not a demographic stereotype.

# 18. Practical guidance

## 18.1 Access

When the primary reader may not drive, lead with the no-car route. If a car is genuinely the sensible option, say so plainly.

For each route, distinguish:

- stable route structure;
- approximate time;
- live schedule, fare, or service detail requiring recheck;
- final-mile difficulty;
- return plan;
- accessibility limits.

## 18.2 Safety and comfort

Do not promise safety. Describe observable planning conditions, ordinary precautions, verified advisories, and practical comfort.

Prefer `Local respect and comfort` to a generic fear-heavy safety block when the evidence supports only normal planning guidance.

## 18.3 Time and duration

Explain why a time of day or season fits the place: market rhythm, tide, worship, heat, light, ferry, harvest, work process, rain, or crowd pattern. Do not attach a “best time” to unsupported atmosphere.

## 18.4 Local spending

Where evidence permits, show the difference between buying from a maker, cooperative, community-run venue, ordinary stall, reseller, or chain. Do not guilt the reader or claim impact without evidence.

# 19. FAQ

FAQ questions MUST come from real reader uncertainty, search intent, page friction, or entity confusion.

Prioritize:

- what the place actually is;
- whether it matches a common expectation;
- how to arrive without a car;
- how long it takes;
- what must be checked live;
- what is inside or outside the destination;
- what behaviour matters;
- whether a common “only / first / best” claim is accurate.

Visible FAQ and FAQ structured data MUST match exactly.

---

# Part D — CityWiki component system

# 20. Composition principle

> **Let the story lead. Let components help.**

CityWiki MUST NOT become a wall of cards. Prose, images, maps, route structure, and small utility components should form one reading rhythm.

Use a component when it makes a decision, relationship, source, or action easier to understand. Do not componentize every paragraph.

# 21. Core CityWiki components

| Component | Purpose | Minimum contract |
|---|---|---|
| `StoryHero` | Establish identity and place truth | Exact name, location context, one dominant image/map/object, credit, no generic slogan |
| `QuickAnswer` | Answer before detail | Identity, difference, fit, misfit, trip shape, friction, compact trust line |
| `FitAndMisfit` | Prevent expectation mismatch | Evidence-based good fit and poor fit; no stereotypes |
| `BoundaryContext` | Clarify destination extent | Strict/lived distinction, spillover label, accessible map or text fallback |
| `RouteSpine` | Turn anchors into a usable sequence | Ordered stops, transitions, time shape, alternative route when needed |
| `AnchorStory` | Connect place, detail, action, and source | Linked first mention, why it matters, what to notice, evidence state |
| `LocalTerm` | Make a name or word legible | Local script, transliteration when useful, meaning, source |
| `SmallTrueThing` | Hold one charm atom | One detail, one meaning, one source; never trivia wallpaper |
| `HonestFriction` | State the main planning difficulty | What is hard, whom it affects, realistic workaround, freshness |
| `RespectCue` | Protect local dignity | Specific behaviour, reason, no moral theatre |
| `KeyFacts` | Present citable structured facts | Native table or accessible equivalent, source/date/scope |
| `CityMETERInsight` | Translate data into reader value | Signal, local meaning, implication, confidence; no raw metric dump |
| `SourceLedger` | Make evidence inspectable | Title, publisher, type, date, supported claim, limitation, link |
| `TrustBadge` | State publication posture | Matches status, index policy, and verification date |
| `Aftertaste` | Close the story loop | Reconnect to an earlier detail; no generic inspiration |
| `HelpImprove` | Ask for a useful contribution | Specific evidence gap, consent, working action, shown after value |

# 22. Component restraint

On a normal page:

- use one dominant first-screen object;
- keep the main narrative in a readable column;
- do not place more than three equal-priority cards in one row;
- avoid more than two consecutive card bands without prose or a meaningful visual transition;
- do not repeat the same claim in hero, quick answer, card, map caption, and FAQ;
- do not turn every charm atom into a coloured callout;
- reserve semantic warning styling for real caution, not “interesting facts.”

# 23. `SmallTrueThing` contract

```yaml
component: SmallTrueThing
detail: ""
placeMeaning: ""
readerMeaning: ""
sourceIds: []
evidenceStatus: ""
linkedAnchorIds: []
```

The detail MUST change understanding. If removing it changes nothing, keep it out.

# 24. `RouteSpine` contract

```yaml
component: RouteSpine
routeId: ""
readerType: ""
duration: ""
start: ""
steps:
  - order: 1
    anchorId: ""
    transition: ""
    notice: ""
    liveCheck: ""
finish: ""
alternativeRoute: ""
accessibilityNote: ""
```

Map markers, prose order, and machine route steps MUST agree.

# 25. `CityMETERInsight` contract

Use CityMETER only when a real layer or analysis is supplied.

```text
data signal
→ local meaning
→ reader implication
→ confidence cap
```

The component MUST show source class, period, boundary, and limitation when material. It MUST NOT interrupt the story with raw analytical language.

# 26. Contribution and sharing

Value must precede capture, contribution, save, watch, share, or invite prompts.

A contribution request should name the missing evidence:

- current official hours;
- step-free access check;
- reusable image permission;
- route closure;
- local name spelling;
- geometry correction;
- community-reviewed etiquette.

Do not ask vaguely for “more local stories.” Do not solicit private gossip or personal contact details.

---

# Part E — CityWiki visual profile

# 27. Visual inheritance

CityWiki inherits the exact official-logo, colour, typography, spacing, radius, elevation, motion, breakpoint, contrast, and accessibility tokens from Landometer Design System `0.9.6`.

No local near-match colour, font, shadow, radius, or breakpoint may be introduced to make a page feel “more editorial.” Product character comes from composition, imagery, hierarchy, and content—not token drift.

# 28. Visual character

The CityWiki visual character is:

```text
warm editorial canvas
+ documentary place evidence
+ clear route and boundary
+ small moments of visual delight
+ quiet Landometer identity
```

It is not:

- a tourism brochure;
- a dense BI dashboard;
- a magazine layout that hides practical answers;
- a collage of colourful cards;
- a large decorative meter motif competing with the place;
- an AI-generated postcard presented as evidence.

# 29. First-screen composition

Choose one dominant object:

1. documentary hero image when it proves the place truth;
2. boundary or route map when spatial misunderstanding is the main problem;
3. a public object, craft, or landscape detail when it carries the story thesis;
4. a split image/map only when both are necessary and remain legible on mobile.

The first screen MUST make the place—not Landometer—visually dominant. Brand identity remains clear through type, colour, signature, and motif restraint.

# 30. Editorial reading layout

- Main prose SHOULD remain within 64–72 English characters per line.
- Dense Thai prose SHOULD target about 60–66 characters where practical.
- Body copy SHOULD normally use `type.body` or `type.body-lg`, never caption sizing.
- Use generous space between question changes, not between every sentence.
- Keep source metadata close enough to the supported object to remain understandable.
- Let one image, map, route, or quotation-width detail interrupt long prose where it adds evidence or orientation.
- Keep sticky utilities from covering text or route controls at 390 px width.

# 31. Typography

Use the parent roles:

| Role | Font |
|---|---|
| English display | Arvo 700 |
| Thai display | IBM Plex Sans Thai Looped 700 |
| Thai and English body/UI | Bai Jamjuree 400 / 600 |
| Numbers and technical labels | JetBrains Mono 500 / 700 |

Arvo is a controlled display accent, not long-form body text. Technical mono labels should not leak into the public story.

# 32. Colour

Use the exact LDS 0.9.6 theme-resolved canvas and card surfaces as the reading foundation. Use `interaction.accent` and its matching theme/foreground/state contract for links and actions; use the declared map interaction roles for map selection and truthful semantic/provenance roles with labels for trust state. `brand.blue` remains an identity/expression role and is not a replacement for interaction or evidence tokens.

Categorical colours are for real categories. They are not decorative substitutes for charm.

Above the fold:

- warm and neutral surfaces remain the majority;
- one primary action with the governed interaction role is enough;
- more than three categorical colours require a real encoded distinction;
- trust status must use semantic tokens and text, never colour alone.

## 32.1 Current LDS 0.9.6 color and selection requirements

All density families use exact warm scales by denominator: `density.area` orange, `density.capita` rose, `density.household` scarlet, and `built` gold. Use the embedded theme-specific LUT/class values and explicit units, denominator, source, coverage, intervals and direction. Identity and atmosphere gradients never encode measurements. Dark categorical colors retain the approved0.9.5 values; keep stable category IDs, labels and non-color cues. Do not interpolate a gradient from endpoints or sample a screenshot.

Do not use decorative bracket-shaped selected states or colored edge rails on navigation, tabs, cards or callouts. Use restrained surface, type weight and spacing; retain visible keyboard focus and meaningful chart/table boundaries. Review actual Thai/English content at narrow and desktop widths for squeezed headings, collision and overlap.

# 33. Photography and media

Prefer imagery that shows:

- the defining spatial relationship;
- an ordinary action that explains the place;
- a documented process, object, food, craft, ritual, or route moment;
- scale and access honestly;
- people with dignity and appropriate permission.

Avoid:

- unrelated skyline or beach imagery;
- heavy colour grading that changes documentary meaning;
- portraits used without consent;
- images that imply access, endorsement, current condition, or safety not supported by evidence;
- a beautiful spillover image as the destination hero;
- unknown-rights images marked reusable.

Every displayed media asset needs source page URL, creator when known, rights or permission state, attribution, caption, alt text, and crop/edit record.

# 34. Maps and data visuals

A CityWiki map should answer a reader question:

- What does CityWiki mean by this destination?
- Where does the route begin?
- Which anchor is outside the strict boundary?
- Why is the final mile difficult?
- What nearby place can be combined without confusing it with the core?

Do not add a map merely because destination pages usually have one. Provide a text or table alternative for every critical relationship.

# 35. Motion

Motion should help the reader understand location, sequence, selection, or disclosure. It should not manufacture travel excitement.

Use the LDS 0.9.6 base motion roles, finite lifecycle and final-state fallbacks. Honour reduced motion, no JavaScript, observer failure and history restoration. Do not animate every map marker, metric, or charm card on page load.

---

# Part F — Machine identity, publication, and channel parity

# 36. Required classification

Before rendering, declare:

1. `product: CityWiki`;
2. `profile: citywiki.public`;
3. page or output type;
4. delivery mode;
5. language;
6. generation mode;
7. publication status;
8. index policy;
9. trust badge;
10. CityWiki voice profile;
11. Hook and network modes.

Generation mode, output type, trust badge, and index policy remain separate decisions.

# 37. CityWiki manifest extension

Every CityWiki page MUST extend the parent manifest with:

```json
{
  "manifestVersion": "1.1",
  "designSystem": "Landometer",
  "dsVersion": "0.9.6",
  "citywikiProfileVersion": "1.0.0",
  "citywikiContentSpecVersion": "2.4",
  "product": "CityWiki",
  "profile": "citywiki.public",
  "voiceProfile": "citywiki.charming",
  "pageKind": "destination_page",
  "generationMode": "A | B | C",
  "outputType": "destination_page | source_limited_planning_draft | entity_resolution_pack | field_verification_pack",
  "publicationStatus": "verified | provisional | source_limited | internal | private",
  "indexPolicy": "",
  "primaryReader": "",
  "primaryObjective": "understand_place_choose_plan_and_respect",
  "canonicalStoryId": "",
  "contentEvidence": {
    "placeTruthPacketId": "",
    "readerContractId": "",
    "storySpineId": "",
    "routeSpineId": "",
    "sourceLedgerId": "",
    "claimLedgerId": "",
    "anchorCitationMapId": "",
    "mediaPackageId": ""
  }
}
```

Do not include the internal human reference alias or private benchmark information.

Applicable HTML SHOULD expose:

```html
<html
  data-ds="landometer"
  data-ds-version="0.9.6"
  data-ds-profile="citywiki.public"
  data-citywiki-profile-version="1.0.0"
  data-citywiki-voice="charming">
```

# 38. Trust and indexing

Use the CityWiki production specification to set mode and output type. Use evidence and review state to set publication status and index policy.

| Publication status | Default index posture | Public treatment |
|---|---|---|
| `verified` | `index,follow` when deployable | Compact verified label and review date |
| `provisional` | `noindex,follow` until required review passes | Short human note; no internal mode language |
| `source_limited` | `noindex,follow` | Explain the material gap once |
| `internal` | `noindex,nofollow` | No public distribution |
| `private` | `noindex,nofollow` | Public exposure prohibited |

Portable single files and internal demos default to `noindex,nofollow` regardless of content quality.

# 39. Public and internal language

Public prose MUST NOT expose:

- Mode A/B/C;
- `output_type`;
- candidate, leakage, semantic core, claim cap, working polygon, research object, or quality score;
- internal benchmark names or profiles;
- private source notes;
- machine-only uncertainty codes.

Translate relevant meaning into ordinary language. Keep internal production detail in the machine package and QA report.

# 40. Channel parity

Human page, search summary, share card, PDF brief, and agent response may differ in length. They MUST agree on:

- entity and boundary;
- selected story thesis;
- anchor identity;
- material claims and confidence;
- route order where included;
- current publication status;
- material limitations;
- permitted source and media rights.

An agent summary must not become drier by discarding the place-specific detail that makes the public answer intelligible. It should preserve at least one sourced charm atom when space permits.

---

# Part G — Quality assurance and enforcement

# 41. Release gates

Run gates in this order:

1. entity and boundary truth;
2. source, claim, freshness, and citation safety;
3. privacy, dignity, defamation, and media rights;
4. practical reader usefulness;
5. charming voice and story coherence;
6. public/machine parity;
7. accessibility, resilience, metadata, and performance.

Passing a later gate cannot compensate for failure at an earlier gate.

# 42. CityWiki voice diagnostic — 100 points

This diagnostic supplements, but does not replace, the CityWiki overall 100-point score or Quality Max index.

| Dimension | Points | Full-credit evidence |
|---|---:|---|
| Local specificity | 25 | Several details and relationships could belong only to this place |
| Practical reader care | 20 | Fit, misfit, route, duration, friction, and live-check needs are useful |
| Evidence-safe charm | 20 | Memorable details are sourced and calibrated; no invented experience |
| Human warmth and dignity | 15 | Reader feels accompanied; residents and local work retain agency |
| Story coherence | 10 | Hook, route, details, and ending support one place truth |
| Natural, non-generic language | 10 | Plain verbs, varied rhythm, no filler or travel clichés |

Interpretation:

| Score | Meaning |
|---:|---|
| 90–100 | Strong CityWiki voice; release if all hard gates pass |
| 80–89 | Useful but needs a focused editorial pass |
| 70–79 | Generic, dry, over-cautious, or weakly shaped |
| Below 70 | Does not meet the CityWiki voice profile |

Do not publish the diagnostic score as a claim of destination quality.

# 43. Deterministic charm checks

A normal page fails CityWiki voice QA when any applicable requirement is absent:

```text
voice.profile.charming
reader.contract.present
quickAnswer.identity.present
quickAnswer.fit.present
quickAnswer.misfit.present
quickAnswer.friction.present
storySpine.trials.complete
hook.nextParagraph.proves
charm.smallTrueThings.minimum3
charm.nonTransferableSentences.minimum3
charm.localTermOrNameStory.present
charm.objectProcessOrHumanScale.present
charm.livingActionOrRitual.present
charm.honestTension.present
charm.dignityCue.present
story.aftertaste.grounded
route.practicalAndBoundarySafe
anchor.firstMention.linked
sensory.evidenceDeclared
firstPerson.fieldEvidenceRequired
public.internalLanguage.absent
benchmark.identity.noLeak
```

Mode A/B raises `charm.nonTransferableSentences.minimum3` to a target of five.

# 44. Synchronized score caps

Apply the CityWiki content specification’s caps:

| Failure | Maximum public score |
|---|---:|
| Strong evidence but Wikipedia-level dry story | 84 |
| No competing story-spine trials | 80 |
| Generic “history + attractions + food” spine | 80 |
| No micro-detail beyond basic facts | 78 |
| No living action, object, process, or human-scale detail | 78 |
| Fewer than three small true things | 80 |
| Fewer than three only-this-place sentences | 80 |
| Generic tourism hook | 80 |
| Hook not proved in the next paragraph | 78 |
| Unsupported lore as the spine | 65 |
| Unsupported `best / first / only` | 65 |
| Invented sensory or first-person experience | 60 |
| Boundary conflict | 55 |
| Harmful personal gossip | 50 and `noindex` |
| Fabricated source or link | 0; rebuild required |

# 45. Human editorial review

Read the page once without looking at the sources, then once with the claim ledger.

First read:

1. Do I understand what this place really is by the end of the quick answer?
2. Does the opening reveal a true tension rather than advertise?
3. Do I know whether it fits me?
4. Can I picture a realistic route without invented certainty?
5. Did I learn a small detail worth remembering?
6. Does the page respect ordinary life rather than turn it into scenery?
7. Does the ending pay off an earlier detail?
8. If the adjectives are removed, does the charm remain?

Second read:

1. Does every memorable claim have adequate evidence?
2. Is each public anchor linked on first substantive mention?
3. Does any outside anchor silently redefine the destination?
4. Are live facts clearly separated from stable facts?
5. Is lore labelled?
6. Is any sensory language stronger than its source?
7. Did public prose expose internal or private information?

# 46. Anti-pattern lint

Flag for human review when public prose contains:

```text
hidden gem
off the beaten path
untouched
timeless
authentic local life
vibrant tapestry
nestled
bustling hub
must-visit
breathtaking
magical
unforgettable
something for everyone
whether you are
delve into
offers a unique glimpse
rich cultural heritage
locals say
many believe
experts say
```

The lint is not a blind ban. A phrase may remain only when it is a sourced literal term or the sentence would lose precision. Document the exception.

# 47. Severity

## P0 — stop every release

- fabricated source, URL, quote, licence, field observation, or image;
- private benchmark identity or profile leak;
- harmful personal gossip or private-home exposure;
- wrong entity or boundary that changes the destination;
- public/private source-permission breach;
- critical accessibility or language-glyph failure;
- public and machine claims materially disagree.

## P1 — stop production release

- missing first-mention anchor citation;
- charming claim stronger than evidence;
- generic or dry public story below profile threshold;
- missing fit/misfit or main friction;
- route cannot be followed from the information given;
- hero depicts a spillover as the core;
- trust, status, robots, and manifest disagree;
- critical remote asset has no fallback;
- serious accessibility failure.

## P2 — warning and backlog

- weak paragraph rhythm;
- an overused adjective that does not change meaning;
- one optional charm class missing after minimums pass;
- secondary image lacks an ideal crop;
- optional comparison or contribution action is unavailable and honestly omitted.

---

# Part H — Implementation and migration

# 48. Canonical package

The CityWiki profile package SHOULD contain:

```text
citywiki-design-system/
  v1.0/
    README.md
    CHANGELOG.md
    profile/
      citywiki.public.json
      citywiki.voice.charming.json
    schemas/
      citywiki-manifest-extension.schema.json
      reader-contract.schema.json
      place-truth-packet.schema.json
      charm-candidate.schema.json
      route-spine.schema.json
      voice-qa.schema.json
    components/
      StoryHero.contract.md
      QuickAnswer.contract.md
      FitAndMisfit.contract.md
      BoundaryContext.contract.md
      RouteSpine.contract.md
      AnchorStory.contract.md
      LocalTerm.contract.md
      SmallTrueThing.contract.md
      HonestFriction.contract.md
      RespectCue.contract.md
      Aftertaste.contract.md
    templates/
      destination-page-en/
      destination-page-th/
      entity-resolution-seed/
      source-limited-draft/
    references/
      golden-internal/
      anti-patterns.md
    fixtures/
      micro-neighbourhood-en/
      municipality-th/
      rural-nature-th/
      source-limited-en/
    tests/
      citywiki-voice.test.mjs
      citywiki-charm-evidence.test.mjs
      citywiki-anchor-citations.test.mjs
      citywiki-boundary-story.test.mjs
      citywiki-public-internal-language.test.mjs
      citywiki-benchmark-privacy.test.mjs
      citywiki-channel-parity.test.mjs
```

Continue to import canonical visual tokens and common components from Landometer Design System `0.9.6`. Do not duplicate token values into a second machine source.

# 49. Migration from the master CityWiki profile

For an existing CityWiki page migrating to Landometer Design System `0.9.6`:

1. preserve correct entity, sources, media rights, accessibility, and working behaviour;
2. declare `citywikiProfileVersion: 1.0.0` and `voiceProfile: citywiki.charming`;
3. replace brand-wide voice scoring with the CityWiki voice diagnostic;
4. create or repair reader contract, place-truth packet, story-spine trials, and route spine;
5. rewrite the first screen around identity, fit, misfit, trip shape, and friction;
6. remove internal mode and QA language from public prose;
7. replace generic overview sections with evidence-backed small details and narrative movement;
8. add first-mention links for every public anchor;
9. consolidate repeated caveats;
10. close with a grounded aftertaste;
11. run full visual, accessibility, metadata, resilience, and channel-parity QA;
12. record content corrections separately from visual migration.

Do not redesign correct pages merely for novelty.

# 50. Small-team implementation order

## Phase 1 — Lock the profile

- approve this voice definition;
- add manifest extension;
- create `citywiki.voice.charming.json`;
- add private-benchmark leak rule;
- pin parent design-system version and CityWiki content-spec version.

## Phase 2 — Build the editorial template

- implement first-screen contract;
- implement canonical story structure;
- implement six essential components first: `QuickAnswer`, `FitAndMisfit`, `BoundaryContext`, `RouteSpine`, `AnchorStory`, `SourceLedger`;
- add `SmallTrueThing`, `HonestFriction`, `RespectCue`, and `Aftertaste` after the prose flow works.

## Phase 3 — Make charm testable

- store reader contract and place-truth packet;
- store charm candidates and selected charm atoms;
- implement non-transferable-sentence and banned-phrase review hooks;
- add manual voice QA form;
- connect score caps to existing CityWiki QA.

## Phase 4 — Build fixtures

- one English micro-neighbourhood;
- one Thai municipality;
- one rural or nature destination;
- one source-limited or entity-resolution artifact;
- mobile, desktop, reduced-motion, and blocked-third-party screenshots.

## Phase 5 — Migrate live CityWiki pages

- prioritize pages that are evidence-rich but dry;
- do not index source-limited pages during migration;
- measure completion, reading depth, route interaction, source opening, share after reward, and useful corrections;
- do not use engagement metrics as proof that a factual claim is true.

# 51. Definition of done

A CityWiki artifact is complete only when:

- it declares the CityWiki profile and Charming voice;
- the entity and boundary are stable enough for the chosen output type;
- the first screen answers identity, fit, misfit, trip shape, and friction;
- the story uses a selected place truth and route spine;
- charm comes from sourced local detail rather than adjectives;
- practical guidance addresses the primary reader’s real constraints;
- public anchors are linked on first substantive mention;
- lore, live facts, estimates, and inference are visibly calibrated;
- residents, makers, worshippers, workers, and migrants retain dignity;
- the ending resolves an earlier detail;
- internal benchmark identity is absent from every public and machine-delivered surface;
- manifest, trust badge, index policy, metadata, and robots agree;
- public, search, share, brief, and agent channels agree on material meaning;
- accessibility, glyphs, blocked-network resilience, and performance pass;
- no P0 or P1 issue remains.

---

# Appendix A — Compact generation instruction

Use this design/voice instruction with the actual approved CityWiki research records and evidence. The CityWiki content operating specification `2.4` still owns research modes, thresholds and output-type choices; a design-system consolidation does not invent factual research, permissions or live details:

```md
Write the CityWiki public story in the `citywiki.charming` voice.

Charming means the page noticed something true and local, understood the reader’s real decision, made the trip feel possible, and treated ordinary local life with dignity. Charm must come from a sourced name, object, process, route, food lineage, ritual, community choice, human-scale number, honest tension, or other place-specific relationship—not from decorative adjectives.

Before writing, select one primary reader, one place truth, one story spine, one hook, one route spine, and the supported charm atoms. In the first 150–250 words, explain what the place is, why it matters, good fit, poor fit, trip shape, and main friction. Link every public anchor on first substantive mention. Use plain verbs, exact local nouns, varied sentence rhythm, and direct practical guidance. Never invent first-person experience, sensory detail, access, safety, hours, prices, local quotes, lore, sources, URLs, images, or rights.

End by making an earlier name, object, route, craft, or local relationship newly meaningful. Do not expose internal mode, score, workflow, benchmark identity, or private profile information.
```

# Appendix B — Editorial pass checklist

```text
[ ] One primary reader and anxiety are explicit internally.
[ ] The opening is a true expectation reset, not promotion.
[ ] A linked detail proves the hook immediately.
[ ] Good fit and poor fit are useful and respectful.
[ ] The route begins at a realistic gateway.
[ ] No-car access is handled when relevant.
[ ] The main friction appears early and once.
[ ] Three small true things survive source review.
[ ] Three sentences cannot move to another destination.
[ ] One local term/name story is explained.
[ ] One object/process/human-scale detail appears.
[ ] One living action or ritual appears.
[ ] One local agency or dignity cue appears.
[ ] Sensory language has an evidence state.
[ ] Every public anchor has a first-mention source link.
[ ] Caveats are located, compact, and not repeated.
[ ] The ending pays off an earlier detail.
[ ] The page remains charming after weak adjectives are removed.
[ ] Internal and private information is absent.
```

# Appendix C — Release record

## C.1 Integrated sources

This consolidation uses the current shared LDS foundation and retains the product rules derived from the original CityWiki profile’s source record:

1. Landometer Design System `0.9.6`;
2. CityWiki Prompt Attachment `2.4` — integrated research, charm, citations, and media operating manual;
3. the CityWiki product brief, discovery product context, and reader journey material;
4. the original profile’s reported prior review of ten human-authored golden samples;
5. the original profile’s reported direct review of eight golden samples;
6. prior internal human-quality working-profile conclusions, including warm-before-clever, specific-before-poetic, practical-before-promotional, evidence safety, and privacy of the benchmark identity.

## C.2 Compatibility

- Parent Landometer visual and analytical tokens are the exact `0.9.6` / `color-srgb-09` payload embedded in the required complete LDS base.
- Parent manifest remains `1.1` with this profile’s extension.
- CityWiki generation mode and output-type definitions remain owned by CityWiki Prompt Attachment `2.4`.
- This file changes the CityWiki public voice and editorial composition; it does not change the evidence thresholds or indexing safety rules.

## C.3 Final normative statement

> **A CityWiki page is not charming because it praises a place. It is charming because it helps the reader notice something true, local, useful, and human—and knows when to stop talking.**
