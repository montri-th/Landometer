# Landometer Design System v0.9.1

**Owner-approved normative release · 1 September 2026**

เอกสารนี้คือ normative master ที่เขียนใหม่จาก Landometer Design System v0.9.0-r7 โดยคงแกนที่พิสูจน์แล้ว เพิ่มกฎเรื่อง discoverability, motion, navigation, CTA, icon และ cross-format production และลดความกำกวมที่ทำให้มนุษย์กับ AI ตีความไม่ตรงกัน

> Release status: **active**  
> DS version: **0.9.1**  
> Authoring revision: **0.9.1-r8**  
> Ruleset: **lds-rules-0.9.1**  
> Machine package: **v0.9.1-mp7**  
> Owner approval: **approved — Landometer owner · 2026-09-01T00:33:36+07:00**  
> Effective: **true**

นี่คือ package แรกที่ effective ของ v0.9.1 สร้างเป็น immutable package ใหม่จาก `v0.9.1-mp0-draft` โดยเก็บ candidate เดิมไว้เป็นประวัติ Owner approval ครอบคลุม normative release นี้ งานที่ส่งให้ผู้ใช้ต้องอ่านเหมือนงานที่เสร็จและตัดสินใจแล้ว: ไม่มีสถานะอนุมัติภายใน, placeholder, ข้อความจาก validator หรือคำอธิบายสิ่งที่ทีมยังทำไม่เสร็จ หลักนี้บังคับด้วย OUTPUT-CLARITY-01 และไม่อนุญาตให้ซ่อนข้อจำกัดจริงที่ผู้ใช้ต้องรู้

---

## 0. Release Card และสิ่งที่ v0.9.1 ตัดสิน

### 0.1 Release tuple เดียว

ไฟล์ release.json เป็น source เดียวของ version, schema, set และ package identifiers เอกสาร, schema, kit, manifest และ conformance receipt ทุกชิ้น MUST resolve tuple เดียวกัน ห้ามคัดลอก current identifier ไปแก้หลายจุดด้วยมือ

| Registry | Identifier | การตัดสิน |
|---|---|---|
| Color | color-srgb-05 | retained; ไม่มีค่าสี normative เปลี่ยนจาก v0.9.0-r7 |
| Motion | motion-riddim-approach-02 | approved; เพิ่ม deterministic CTA discovery cue และแยกจาก Color Set |
| Icon | icon-rounded-outline-01 | approved; outline rounded และ FILL 0 |
| Typography | type-script-aware-02 | approved; เลิกถือ line-height ไทยค่าเดียวว่าปลอดภัยทุกขนาด |
| Layout | layout-cross-format-01 | approved; semantic parity ข้าม format |

**RELEASE-01 — Release identifiers have one source.** Release, schema, set, kit และ package identifiers MUST มาจาก release.json, immutable หลังเผยแพร่ และเปลี่ยนตาม version policy เท่านั้น Canonical schema `$id` MUST include the schema version and MUST NOT be reused for an incompatible contract Generated artifacts MUST NOT มี current identifiers ที่ขัดกัน

Acceptance:

- RELEASE-01-A — automated: human master, schemas, catalogs, format packs, assets และ receipts resolve release tuple เดียว
- RELEASE-01-B — manual: change log อธิบายทุก normative rule, set, schema และ migration effect ที่เปลี่ยน

**GOV-01 — Release state is truthful and audience-bounded.** Artifact manifest, receipt และ machine sidecar MUST bind exact `releaseRef` และ canonical tuple hash ที่ resolve ไปยัง DS release จริง ส่วน release.json ของ package นั้น MUST เก็บ active/effective/approved state, approver และ approval time สถานะ active ใช้ได้เฉพาะเมื่อ owner approval และ effective เป็น true Approval workflow, schema ID, rule ID และ package state เป็น internal governance โดย default ห้ามแสดงบน audience-facing surface Nonordinary output ที่มีหน้าที่อธิบาย Design System หรือ provenance โดยตรง MAY แสดงเฉพาะ field class ที่ authority อนุญาตและจำเป็นต่อ purpose เมื่อมี `disclosureAuthorityRef` + `disclosureAuthoritySha256` แบบ immutable: `design_system_reference` จำกัดที่ `release_identifiers | schema_examples`; `provenance_record` จำกัดที่ `provenance_facts | approval_facts` Immutable approval fact เช่นผู้อนุมัติ/เวลา/receipt ที่ purpose ต้องใช้ไม่เท่ากับ mutable workflow status และ authority ทุกแบบยังห้าม unresolved state, debug/validator detail, placeholder และ local/source path

Acceptance:

- GOV-01-A — automated: release.json เก็บ `active`, `approved`, `effective: true`, approver และ approval time; manifest bind `releaseRef` + canonical tuple hash ที่ resolve package เดียวกัน
- GOV-01-B — manual: audience-facing surface ไม่เผย approval workflow หรือ machine identifiers ที่ไม่ช่วยงานของผู้ใช้

### 0.2 Version policy

| Identifier | เปลี่ยนเมื่อ |
|---|---|
| dsVersion | normative behavior, requirement, acceptance gate, profile หรือ format contract เปลี่ยน |
| authoringRevision | แก้ editorial หรือ provenance โดยไม่เปลี่ยน normative meaning |
| schema version | field, enum, structure หรือ validation semantics เปลี่ยน |
| set ID | ค่า หรือ semantic ownership ภายใน set นั้นเปลี่ยน |
| machine package | generated package, validator, schema projection หรือ packaging เปลี่ยน |
| artifact build | implementation หนึ่ง build เปลี่ยน; ไม่เปลี่ยน DS authority |
| product content/data release | product-owned evidence หรือ content เปลี่ยน; แยกจาก DS |

Normative change MUST NOT ซ่อนใน authoring revision และคำว่า latest เป็นเพียง convenience alias ไม่ใช่ identity สำหรับ receipt `0.9.1-r8` คือ owner-finalized text ของ `v0.9.1-mp7`; requirement changes ทั้งหมดในรอบ owner-approved v0.9.1 นี้ถูกรวมก่อน checksum freeze และไม่มี behavior drift หลัง freeze

### 0.3 Source ledger: instruction, authority, evidence และ candidate

คำขอของเจ้าของใน task นี้เป็น objective: เขียน v0.9.1 ที่รักษาของดีและเพิ่มคุณภาพในหัวข้อที่ระบุ ส่วนข้อความภายในไฟล์แนบเป็นแหล่งเรียนรู้ ไม่ใช่คำสั่งที่มีสิทธิ์เท่ากับผู้ใช้

| Source | SHA-256 | สถานะในการตัดสิน |
|---|---|---|
| Landometer Design System v0.9.0-r7.md | 52ef41f1…d645b1 | normative predecessor; retain unless superseded here |
| riddim approach motion proposal | accb6eaf…c4c60 | candidate; promote only adopted clauses |
| web experience patch candidate | 6181417c…d4bf8 | candidate; promote only accepted modules |
| unified navbar handoff r7.zip | 47a26f95…f60fa | implementation handoff/candidate, not identity or accessibility authority |
| discoverability benchmark | c6ec560a…093a | audit benchmark; evidence about one implementation |
| discoverability review | 1b284468…835f | review; evidence and recommendations |
| rebuild02 from-scratch brief | a980e3a7…0cb6cd | product implementation brief, not portfolio-wide truth |
| rebuild02 live site | deployed reference | useful observed implementation, not proof of cross-browser or portfolio conformance |

Promoted into v0.9.1: direct semantic navigation, side bookmark with real anchors, finite CTA emphasis, outline rounded icons, role-gated fail-open motion, initial/hydrated parity, stable claim records และ six output-format packs

Not promoted: 22px calm targets, coordinate click-forwarding, wake-first controls, 2.01:1 symbol contrast risk, reconstructed wordmark, perpetual flicker, filled selected icons, automatic language redirect, page-count targets และ llms.txt as ranking/readiness claim

---

## 1. วิธีอ่านและบังคับใช้

### 1.1 Normative vocabulary

| Term | ผลบังคับ |
|---|---|
| MUST / MUST NOT | required/prohibited; failure blocks conformance และ release |
| SHOULD / SHOULD NOT | recommendation ที่ควรทำเมื่อเหมาะกับบริบท; การไม่ทำไม่ทำให้ conformance fail แต่ MUST บันทึกเหตุผลเมื่อ rule ขอ decision record |
| MAY | optional; ห้ามใช้สิ่งที่ไม่มีจริงมา claim capability |

เอกสารนี้เป็น **Normative** ทั้งฉบับโดย default ข้อความ imperative จึงเป็น MUST ภายใน scope ของย่อหน้าหรือ rule block นั้น เว้นแต่ clause ใช้คำ MAY/SHOULD โดยตรง หรือติดป้าย **Reference, Example, Candidate** หรือ **Historical** อย่างชัดเจน Section 16 ทั้ง section เป็น **Example — non-normative**: ใช้เพื่อเรียนรู้เท่านั้น ไม่สร้าง requirement, default, acceptance criterion หรือสิทธิ์ยกเว้นใหม่

### 1.2 ป้ายสถานะของเนื้อหา

- **Normative** — บังคับทุก artifact ที่เข้าเงื่อนไข
- **Conditional normative** — บังคับเมื่อ profile/capability/format trigger ถูก resolve
- **Reference** — อธิบายเหตุผลหรือแนวทาง ไม่มีสิทธิ์ override rule
- **Example** — ต้องแทน content, claim, evidence และ asset ด้วยของที่ approved จริง
- **Candidate** — ทดลองได้ใน sandbox แต่ claim conformance ไม่ได้
- **Historical** — ใช้ migration/audit เท่านั้น

### 1.3 Authority ไม่ใช่ลำดับแบนเดียว

อำนาจต้อง resolve ตาม domain:

| Domain | Authority |
|---|---|
| portfolio identity, protected wording, shared architecture | owner-approved Landometer portfolio truth |
| product fact, capability, audience, evidence, permission | approved product truth และ evidence release ของ product นั้น |
| visual, interaction, accessibility, format equivalence | effective DS release และ triggered packs |
| artifact intent, audience, one job, delivery | approved Build Card ภายในขอบเขตด้านบน |
| experiment/example | ไม่มีสิทธิ์ override; ต้องขอ promote อย่างชัดเจน |

**AUTHORITY-01 — Resolve authority before design.** Build Card MUST ระบุ content sources, claim owner, evidence boundary และ applicable release ก่อนเริ่ม composition; example/proposal MUST NOT override approved truth เงียบ ๆ

ข้อความที่ติดป้าย Example/Reference/Candidate/Historical MUST NOT ถูกคัดลอกไปใช้เป็น authority หากขัดกับ numbered rule block, `rule-catalog.json` หรือ approved product/portfolio truth ให้ใช้ authority เหล่านั้นและแก้ตัวอย่าง ไม่ตีความตัวอย่างเป็นข้อยกเว้น

Acceptance:

- AUTHORITY-01-A — automated: required authority fields มีค่าและ resolve ได้
- AUTHORITY-01-B — manual: conflict ถูกตัดสินตาม domain authority และมี record
- AUTHORITY-01-C — automated: pre-generation plan records authority, product scope, job, object, AHA, actions, format, capabilities, claims, assets, assumptions, blockers and QA without invented approval/evidence

**LAYER-01 — Keep shared and product-specific layers separate.** Shared Landometer language MUST product-neutral across Land, Location และ Living ส่วน named-product fact, audience, sector, data และ permission MUST อยู่ใน product-specific layer

Acceptance:

- LAYER-01-A — manual: capability และ claim ทุกอันติดป้าย shared หรือ named product
- LAYER-01-B — manual: ไม่มี municipality, retail, F&B, ijji หรือ CityWiki example ถูกเหมารวมเป็น portfolio truth โดยไร้ approval

**COMPARE-01 — Comparisons disclose compatibility.** การเปรียบเทียบข้าม product หรือ city MUST ใช้ schema และ compatible release เดียวกัน มิฉะนั้น MUST แสดง incompatibility ก่อนผู้อ่านตีความ

Acceptance:

- COMPARE-01-A — automated: compared series ทุกชุดมี schemaRelease
- COMPARE-01-B — manual: mismatch แสดงข้าง comparison และใน machine record

### 1.4 ทางลัดตามงาน

| ถ้ากำลังจะ… | เริ่มที่ | แล้ว resolve |
|---|---|---|
| วางโครงงานใหม่ | §2 Build Card | experience profile + format pack + capability config refs |
| เขียน portfolio/methodology/product story | §3–4 | authority, product boundary, claim records, protected role |
| ออกแบบหน้า/แอป | §5–9 | target profile, navbar/bookmark, CTA, states, motion benefit |
| ทำ SEO/AI/agent discoverability | §10 | discovery + readability + action แยกผลและ receipt |
| แปลง web เป็น document/PDF/deck/social | §11 | semantic equivalence, target profile และ format implementation controls |
| ให้ AI วางแผนหรือ QC | §12–14 | rule catalog, schemas, validator และ final-artifact receipts |
| ย้ายงานจาก v0.9.0-r7 | §15 | migration-ledger.json; ห้ามเดา rule ที่ไม่มี disposition |

คำย่อที่ใช้บ่อย: **Build Card** คือ intent/authority input; **format pack** คือข้อกำหนดตามสื่อ; **target profile** คือ geometry/หน่วย/fixture; **capability pack** คือกฎที่เปิดเมื่อมี feature จริง; **receipt** คือหลักฐานผลตรวจที่ลงวันที่ ไม่ใช่ข้อความว่า “ผ่าน” เฉย ๆ

---

## 2. Build Contract: จากเจตนาไปสู่ artifact

### 2.1 Resolution pipeline

ทุกงาน production ใช้เส้นทางเดียว:

**Approved truth → Build Card → one primary format pack → triggered capabilities → rules/tokens/components → QA receipts → immutable artifact manifest**

ผู้สร้างกรอก intent และ authority AI/resolver คำนวณ derived rule list, set IDs และ test matrix ผู้สร้าง MUST NOT เลือกตัด rule ที่ไม่สะดวกออกเอง

### 2.2 Build Card minimum

Build Card schema ฉบับเต็มอยู่ใน `build-card.schema.json` และ canonical copyable fixture อยู่ใน `build-card.example.json` Human master นี้ตั้งใจไม่ทำสำเนา `schemaVersion`, version-qualified schema ID หรือ hash value เพราะค่าดังกล่าว MUST resolve จาก `release.json`, active schema และ bytes ของ binding ปัจจุบันเท่านั้น ไม่ใช่จาก prose

| Field group | Human orientation; machine schema remains exact |
|---|---|
| release + artifact | exact release binding, artifact identity, owner, portfolio/product scope และ one primary job |
| authority | content source, claim/evidence owner, evidence boundary และ shared-vs-named-product boundary |
| experience + locale | audience, entry question, desired outcome, dominant object, first AHA/evidence, primary/next action, resolvable typed reading-order refs, primary locale และ locale states |
| output + composition | one format profile, selected target profile, delivery mode, ordered sections/anchors, exact `componentIds` inventory, headline role, density และ side-bookmark eligibility |
| identity + navigation + actions | exactly one approved `identityImplementation` + exact typography binding; typed destination IDs/roles, `brandDestinationRef`, level/kind/group/breakpoint exposure/current state/control budgets, selected/omitted bookmark contract; one locale-complete `destinationBinding` per action with governed kind and format presentation; labels/outcomes; availability, permission, orthogonal consequence, confirmation และ typed progress/result/recovery/receipt contracts |
| motion | explicit `motionDecision`; every assignment binds a real subject, proposal role, user benefit, final-state fallback, reduced-motion behavior และ deep-link/focus protection; browser assignment bind observer-failure behavior ส่วน native assignment bind interruption/final-state behavior ตาม runtime ที่เลือก |
| capabilities | declared capability IDs exactly match hash-bound `{ref, sha256, schemaRef}` configs that validate against the governed capability contract and selected format |
| publication + claims | canonical/locale/social/structured/crawler bindings for public web; all three universal layer requirements; claim manifest ref/hash/as-of chain; public/indexing state |
| assets | artifact-owned registry bindings and exact role/surface/rights/approval/hash records; empty only when the artifact truly uses no governed asset |
| audience output | `resolved_only`, declared audience/purpose, hidden internal governance, zero blocking dependencies/placeholders และ proximal locale-complete material limitations |
| QA | nonempty automated/manual/production plans, resolver-derived test IDs, criterion-bound evidence, required accessibility fixtures/receipts, and exact empty exception list |

ถ้าไม่มีสมมติฐานที่ต้องควบคุม ให้ใช้ exact empty state `assumptions: []` ถ้ามี ทุกรายการ MUST มี stable ID, statement, impact domain, status และ rationale ตาม active schema; unresolved blocker ต้องปรากฏใน audience-output blocker refs และสมมติฐานที่กระทบ truth, identity, rights, accessibility, locale completeness, primary action หรือ evidence interpretation ห้ามถูกจัดเป็น non-blocking

ทุก hash หมายถึง bytes จริงของ artifact bundle ปัจจุบัน และทุก version/schema identity ต้องมาจาก `release.json` + active schema เท่านั้น ชื่อไฟล์ `example` ไม่ให้สถานะ pass; validator และ receipt ของ bytes จริงเท่านั้นที่ให้สถานะได้

### 2.3 Common design contract

ทุก artifact MUST กำหนด:

1. one job — งานหลักหนึ่งอย่างที่ผู้ใช้ควรทำสำเร็จ
2. dominant object — สิ่งหลักที่กำลังมอง/อ่าน/ตัดสิน
3. first AHA — ความเข้าใจแรกที่ต้องเกิด พร้อม evidence cue
4. primary action — การกระทำสำคัญหนึ่งอย่าง พร้อม outcome จริง
5. next useful action — ก้าวถัดไปที่ช่วยผู้ใช้ ไม่ใช่ conversion บังคับ
6. clean completion — ผู้ใช้รู้ว่าทำสำเร็จหรือจบการอ่านแล้วอย่างไร
7. evidence boundary — สิ่งที่รู้, ไม่รู้, ประมาณ, หมดอายุ หรือ product-specific
8. audience output — declare `deliveryAudience`, ใช้ `disclosurePurpose: ordinary_experience` เป็น default และ bind disclosure authority เมื่อเลือก nonordinary purpose; unresolved dependency อยู่ได้เฉพาะ internal preview record ส่วนงานที่ส่งให้คนใช้มีเฉพาะ resolved meaning และ material limitation ที่เขียนให้เข้าใจ
9. immutable bundle bindings — ทุก capability config ใช้ `{ref, sha256, schemaRef}`; `publication` bind claim manifest ด้วย ref + hash และ `assetRegistries` bind registry ของ artifact ด้วย `{registryRef, sha256, schemaRef}` แม้ fixture ที่ไม่มี governed asset จะใช้ array ว่าง

หนึ่ง screen/scene MUST มี primary reading path เดียว แต่ MAY มี supporting paths ที่ hierarchy ต่ำกว่า ไม่ออกแบบด้วยการกระจาย component เท่ากันทั่วหน้า `experience.readingOrder[]` MUST เป็น typed refs `{kind: section | action | component, ref}` และทุก ref ต้อง resolve exactly once ไป `composition.sections[].id`, `actions[].id` หรือ `composition.componentIds[]` ตาม kind ลำดับที่ derive ไป `accessibilityProjection.readingOrder` MUST ตรงกันพอดี; free-text label ที่ไม่ resolve ห้ามใช้แทน reading order

### 2.4 Conformance levels

| Level | ความหมาย |
|---|---|
| authoring_aligned | Build Card และ source records resolve แต่ยังไม่ตรวจ final output |
| package_validated | machine package integrity ผ่าน; ไม่เท่ากับ artifact QA |
| artifact_qa_passed | automated + required human/visual/interaction checks ของ final artifact ผ่าน |
| production_verified | deployed/distributed bytes และ real route/device/export checks ผ่าน |

คำว่า machine validation MUST NOT ใช้รวม package integrity กับ artifact quality Conformance computed จาก receipts; ผู้สร้างเลื่อน level ด้วยมือไม่ได้ Receipt ทุกใบ MUST เป็น bundle-local object ที่ bind subject และ bytes ด้วย SHA-256 Manifest layer/gate result ที่เป็น `pass` MUST bind receipt + hash ตั้งแต่ `artifact_qa_passed` ขึ้นไป และทั้งสาม universal layers MUST เป็น `pass`; กฎที่ไม่ใช้ระบุด้วย `resolution.nonApplicableRuleIds` ไม่ใช้ layer/gate result receipt ของ OUTPUT-CLARITY-01-A MUST cover `delivery.files` และ hash ทุกรายการเป็น exact set พร้อม cite evidence ของ `delivery.contentInspections[]` ครบทุกไฟล์; เมื่ออ้าง `production_verified` receipt ของ OUTPUT-CLARITY-01-B MUST cover exact set, hashes และ inspection evidence ชุดเดียวกัน โดยไม่มีตกหล่นหรือเพิ่มไฟล์นอก manifest

---

## 3. Core contract: Truth before treatment

### 3.0 First useful value

**AHA-01 — First useful value precedes nonessential gates.** First useful proof, understanding หรือ task value MUST มาก่อน nonessential registration, personal-data collection, permission request, sharing prompt หรือ promotional interruption ถ้า prerequisite จำเป็นจริง ต้องอธิบายเหตุผล ขอ minimum และมี denial-safe/read-only alternative เมื่อ feasible

Acceptance:

- AHA-01-A — automated: Build Card ระบุ first AHA, evidence cue และ prerequisite ทุกอันก่อน AHA
- AHA-01-B — interaction: first-run, denied-permission, unauthenticated และ no-sharing fixtures ยังให้ earliest feasible value + safe next path

### 3.1 Evidence และ certainty

**EVIDENCE-01 — Claims retain evidence boundaries.** Material factual claim ทุกอัน MUST resolve stable claim record ที่มี scope, source, method, time basis, status และ owner Limitation หรือ uncertainty ที่มีผลต่อการตีความ MUST มองเห็นใกล้ claim ในภาษาของผู้ใช้ ส่วน missing evidence ที่ทำให้ claim ไม่ปลอดภัยต้อง block claim/output ไม่ใช่กลายเป็นข้อความแก้ตัว

Acceptance:

- EVIDENCE-01-A — automated: displayed material claimId resolve record เดียวที่มี required fields
- EVIDENCE-01-B — manual: wording ไม่เกิน scope/certainty ของ evidence

Observation, interpretation, recommendation และ commitment MUST แยก label กัน เส้น, สี, animation, copy หรือ structured data ห้ามทำให้ estimate ดูเหมือน measured fact และ missing data ห้ามแสดงเป็น zero

### 3.2 Resolved-only audience output

**OUTPUT-CLARITY-01 — Ship resolved audience meaning, not workflow residue.** Public, client-facing หรือ production output MUST มีเฉพาะสิ่งที่ผู้ใช้ต้องใช้เพื่อเข้าใจ ตัดสินใจ หรือทำงานต่อ ได้แก่ content, state, ข้อจำกัดจริง และ action ที่พร้อมใช้ คำว่า `workflow residue` ใน machine contract หมายถึงข้อความเกี่ยวกับขั้นตอนทำงานภายใน เช่น รออนุมัติ, ยังไม่ตรวจ, schema/rule/package ID, local/source path, debug/validator text, TODO/TBD/FIXME และ placeholder สิ่งเหล่านี้ MUST อยู่ใน internal record เท่านั้นและ MUST NOT ปรากฏในงานที่ส่งให้ผู้ใช้

ถ้าข้อมูลหรือสิทธิ์ที่ยังขาดอาจเปลี่ยนความจริง, identity, rights, accessibility, ความครบของภาษา, primary action หรือการตีความ evidence งานนั้น MUST หยุดส่งและอยู่เป็น internal preview จนแก้เสร็จ ห้ามส่งข้อความเกี่ยวกับการผลิตงาน เช่น “ยังไม่ยืนยันเพื่อเผยแพร่” หรือ “รอข้อมูลจากทีม” เพื่อให้ผู้ใช้รับภาระแทนทีม ข้อจำกัดจริงที่ผู้ใช้ต้องรู้—เช่นช่วงเวลาข้อมูล, พื้นที่ครอบคลุม หรือสิ่งที่ข้อมูลนี้ใช้สรุปไม่ได้—ยัง MUST แสดงใกล้ claim/action ที่เกี่ยวข้อง ด้วยภาษาตรงเรื่องและบอกผลต่อการตัดสินใจ ห้ามใช้ disclaimer รวมกว้าง ๆ หรือคำเตือนหลายชั้นแทนคำอธิบายเฉพาะเรื่อง

`audienceOutput.disclosurePurpose: ordinary_experience` เป็น default สำหรับ output ที่คนใช้ตามปกติ Purpose แบบ nonordinary ได้แก่ `design_system_reference` และ `provenance_record` เท่านั้น และ MUST bind `disclosureAuthorityRef` กับ `disclosureAuthoritySha256` คู่กัน Authority ต้องอยู่ใน bundle, hash-bound และเปิดได้เฉพาะ field class ที่ schema อนุญาต: DS reference ใช้ `release_identifiers | schema_examples`; provenance record ใช้ `provenance_facts | approval_facts` เท่านั้น Immutable approval fact ที่ได้รับอนุญาตไม่ใช่ mutable approval workflow คำว่า draft/candidate/pending/unverified ถูกห้ามเฉพาะเมื่อเป็น **internal approval/release workflow residue**; state ที่เป็นความจริงของงานผู้ใช้ เช่น draft content, pending transaction หรือ unverified audience-domain datum ยังคงแสดงได้เมื่อจำเป็นและต้องมี label/behavior ที่ตรงความหมาย Authority ทุกแบบยังห้าม debug/validator text, local path, placeholder และ unresolved dependency Artifact manifest `representation.outputClarity` MUST carry `deliveryAudience`, `disclosurePurpose` และ authority ref/hash เดียวกันเมื่อ applicable

Residue scan ครอบคลุม Build Card `navigation.destinations[]` ใน `target`, `label`, `labelByLocale`, `compactLabel`, `compactLabelByLocale` และ Artifact Manifest ใน `representation.navigation`, audience fields ของ `delivery.metadataProjection` กับ `delivery.accessibilityProjection` ตลอดจน final audience bytes ทุกไฟล์ผ่าน `delivery.contentInspections[]` แบบ exact one-per-file ห้าม skip ตาม media type หรือ skip บาง rendered unit: text-readable format เทียบ extracted text กับ bytes โดยตรง; DOCX, PPTX และ PDF MUST bind จำนวน page/slide, render ทุก unit เป็น raster ที่ path/hash/media bytes ตรงกัน และตรวจด้วย text extraction + OCR + visual review พร้อม flag ว่าได้ตรวจ image-only/outlined text แล้ว ข้อความแต่ละ channel รวมด้วยลำดับและ label ที่ deterministic ก่อน hash/scan; raster social ใช้ OCR พร้อม visual review และ media อื่นใช้ transcript/content review ที่ตรงชนิด ไฟล์ evidence ทุกใบ MUST อยู่ใน bundle, bind path/media type/subject hash/byte count/method/time และมี SHA-256 ของตัว evidence เอง การย้าย draft/review/debug/local-path wording เข้า label, target, export หรือภาพยังคงเป็น workflow residue; nonordinary authority เปิดได้เฉพาะ allowed field class ที่ระบุ และไม่เคยเปิด universal workflow residue

Acceptance:

- OUTPUT-CLARITY-01-A — automated: Build Card ใช้ `audienceOutput.mode: resolved_only`, declare delivery audience/purpose และ bind nonordinary authority เมื่อ applicable; client/public/internal-operational หรือ artifact ที่ claim `artifact_qa_passed` ขึ้นไปมี `blockingDependencyRefs: []`, ใช้เฉพาะ asset ที่ bind exact role/rights/receipt/hash และ claim ที่ approved, current-at-`claimAsOf`, locale-complete, manifest-record-hash-bound/public-eligible; audience projection ไม่มี placeholder หรือ internal-governance marker; `delivery.contentInspections[]` ครอบคลุม `delivery.files` เท่ากันพอดีและใช้ method ตาม media type; DOCX/PPTX/PDF ครบทุก page/slide ด้วย extraction + OCR + visual review, raster render hash และ explicit image-only/outlined-text review; receipt ของ acceptance นี้ MUST bind exact file set/hash และ cite inspection evidence ทุกใบ
- OUTPUT-CLARITY-01-B — production: final visible bytes, metadata, preview, export และ machine projection ผ่าน format-aware residue scan รวม combined rendered-unit text; dated receipt MUST bind exact `delivery.files` set/hash และ cite inspection evidence ชุดเดียวกันก่อน `production_verified`
- OUTPUT-CLARITY-01-C — manual: limitation ที่มองเห็นทุกอัน material, specific, proximal และเข้าใจได้; ไม่มี disclaimer กว้าง ๆ หรือคำอธิบายขั้นตอนภายในแทนข้อจำกัดจริง

### 3.3 Locale Insight และ portfolio boundary

Locale Insight ใช้ระดับ portfolio, methodology และ product architecture ครอบคลุม Land, Location และ Living ด้วยภาษา product-neutral Capability ใดที่แชร์ได้ต้องประกาศใน shared layer; workflow, data, role, sector หรือ claim ที่เฉพาะ product ต้องอยู่ใน product pack

คำแปล MUST native ต่อ locale และ preserve proposition ไม่ใช่ word-for-word copy ถ้ายังไม่มี approved translation ให้แสดง missing-locale state ห้ามผสมสองภาษาเพื่อสร้างภาพว่าครบ `locale.states[]` MUST มี locale ไม่ซ้ำและครอบคลุม `locale.available` เท่ากันพอดี: งานหลายภาษากำหนด primary เป็น `source` และ secondary เป็น `reviewed_translation | native_parallel`; งานภาษาเดียวใช้ `single_locale` Action labels/outcomes/destinations/reasons, navigation labels, discovery/social text และ projected claim text ต้องมี key ครบ locale ชุดเดียวกันและ scalar หลักต้องเท่าค่า primary-locale Artifact Manifest `representation.localeStates` MUST เท่ากับ Build Card states ทั้ง array ไม่ใช่เพียงมีอย่างน้อยหนึ่งแถว

### 3.4 Accessibility, resilience, privacy

**A11Y-01 — Semantics and direct operation survive every state.** ทุก applicable artifact MUST meet WCAG 2.2 Level AA เป็น floor Information structure, names, roles, values, focus order, alternatives, status announcements และ direct operation MUST equivalent ใน initial, hydrated, loading, success, empty, error, reduced-motion, high-zoom, keyboard, touch, print และ export states ที่ applicable Native HTML/format-native structure comes first; ARIA supplements rather than repairs wrong semantics

Acceptance:

- A11Y-01-A — automated: zero critical/serious release-blocking errors; normal text ≥4.5:1, large text ≥3:1 และ required non-text/focus ≥3:1 ในทุก applicable state
- A11Y-01-B — manual: keyboard, screen-reader, zoom, reflow, reduced-motion และ touch checks มี receipts

Artifact Manifest ห้ามใช้ accessibility summary แบบเหมารวมว่า verified ทุกช่อง `format-packs.json.accessibilityProjectionContract` เป็น source เดียวของ summary ต่อ format: web public ต้อง verify headings, landmarks, controls, keyboard, focus, touch, zoom 200% และ reflow 400%; app interactive ต้อง verify semantic structure กับ keyboard/focus/touch แต่ไม่อ้าง zoom/reflow หาก fixture profile ไม่ได้ทดสอบ; document/PDF ใช้เฉพาะ native heading/link structure ที่ fixture รองรับ; deck และ social static ใช้ `not_applicable` สำหรับ headings/landmarks/controls แบบ semantic runtime ไม่อ้างว่า raster หรือ slide มีโครงสร้าง HTML Social static ยังคงต้องผ่าน contrast, safe area, Thai/Latin, crop และ destination-cue fixtures `not_applicable` ในช่องที่ format ไม่มีไม่ได้ลด accessibility obligation ของช่องทางที่มีจริง

ค่า `alternatives.images`, `alternatives.data` และ `alternatives.motion` MUST derive จาก asset roles/capabilities จริง ถ้าไม่มี trigger ต้องเป็น `not_applicable`; ถ้ามี trigger ต้องเป็น `verified` พร้อม exact governed fixture receipts Motion summary แยกตาม runtime: `web_public.browser` และ `app_interactive.browser` ต้องมี reduced-motion + observer-failure final state; `app_interactive.native` ต้องมี reduced-motion + native interruption/complete-final-state evidence และตั้ง `observerFailure: not_applicable`; deck motion ใช้ static alternative โดยไม่สร้าง runtime claim Accessibility fixture report MUST repeat summary เดียวกันกับ projection และ bind exact evidence ของ fixture ทุก ID จึงห้ามนำ summary ของ browser ไปคัดลอกใส่ native, social, PDF หรือ deck

**SECURITY-01 — Public presentation cannot reveal restricted evidence.** Output, metadata, preview, source map, machine projection, log และ agent receipt MUST เคารพ data classification และ MUST NOT เปิดเผย restricted evidence, personal data, credential หรือ internal-only source detail

Acceptance:

- SECURITY-01-A — automated: secret, personal-data, private-URL และ restricted-field scans ผ่าน
- SECURITY-01-B — manual: disclosure ยังมีประโยชน์โดยไม่ข้าม evidence boundary

`client` และ `public` delivery รับเฉพาะ `privacySecurity.dataClassification: public` เท่านั้น งาน `internal_operational` ที่เป็น `confidential | restricted` ต้องมี `permissionsRequired` อย่างน้อยหนึ่งรายการและ `redactionPolicy: required_before_delivery`; public fixture ใช้ `redactionPolicy: not_required`

---

## 4. Brand, voice และ protected language

### 4.1 Brand lines และบทบาท

Protected brand lines:

| Role | Canonical line |
|---|---|
| North Star | Visualize City, Shape Tomorrow. |
| Promise | Measure What Matters. Make It Actionable. |
| Cultural activation | Let us cultivate our city with data. |

Supporting systems are exact explanatory structures, not peer slogans:

| Role | Canonical system line | Use |
|---|---|---|
| Ecosystem | Land · Location · Living · Local Decisions. | explain shared portfolio scope |
| Product loop | See → Understand → Decide → Act → Learn. | explain behavioral sequence |

**BRAND-01 — Protected brand lines retain roles.** การใช้ protected line เป็น optional เว้นแต่ Build Card จะ select ไว้ เมื่อใช้ แต่ละ protected line MUST ปรากฏ verbatim พร้อม canonical punctuation และคง recorded role ของตน หนึ่ง scene ใช้ได้เพียงหนึ่ง protected line เป็น headline ห้าม stack เป็น peer slogans Supporting systems MAY appear only when explaining scope/behavior and MUST NOT become a headline slogan by default

Protected wording ใช้ canonical punctuation ตาม registry ในทุก locale เว้นแต่ registry มี owner-approved locale-specific record แยกต่างหาก การแปลหรือ adaptation ที่ปรากฏใน implementation—even เมื่อดูดี—MUST NOT ถูกใช้เป็น protected line, metadata title หรือ portfolio authority โดยอัตโนมัติ

ในกฎนี้ **scene** คือ composition ที่ผู้ใช้รับรู้เป็นหน่วยหนึ่ง มี primary proposition และ reading/action path ของตัวเอง ขอบเขตใช้ดังนี้:

- web/app: route, view, dialog หรือ top-level section ที่มี primary heading ของตัวเอง;
- deck: หนึ่ง slide;
- document/PDF: cover, chapter opener หรือ titled section ระหว่าง peer headings;
- social static: หนึ่ง creative.

Card, column, tab panel, animation state หรือ DOM wrapper ไม่กลายเป็น scene ใหม่เพียงเพื่อใช้ protected line เพิ่ม เว้นแต่ผู้ใช้เข้าถึงเป็นหน่วยอิสระที่มี primary heading และ path ของตัวเอง Navbar, footer, metadata, source note และ repeated running header ไม่สร้าง scene และ MUST NOT host protected line เพิ่มเป็น headline ภายใน scene เดิม การนับ scene ยึดสิ่งที่ผู้ใช้เห็น/อ่าน ไม่ยึดชื่อ component หรือโครงสร้างไฟล์

Acceptance:

- BRAND-01-A — automated: text ตรง canonical registry exact
- BRAND-01-B — manual: scene ไม่วาง protected lines หลายอันแข่งกัน

### 4.2 Voice

Landometer voice คือ calm, clear, evidence-aware, civic-minded และ action-capable ใช้ประโยคสั้นเมื่อสั่งงาน ใช้ plain language ก่อน terminology และบอก limit ใกล้ claim ที่มันจำกัด ห้าม urgency, certainty, official status หรือ scale ที่หลักฐานไม่รองรับ

CTA/copy สำหรับ Thai MUST ผ่าน native review; การตัดคำและ line break ต้องคำนึงถึง phrase ไม่ใช่ความยาวตัวอักษรเท่านั้น Metadata และ machine wording ห้ามมี claim มากกว่า visible wording

### 4.3 Identity roles

**LOGO-01 — Use an approved identity implementation.** ทุก output ที่ `brandRequired: true` MUST bind `identityImplementation` ที่ approved หนึ่งรายการ Logo, wordmark, symbol, favicon และ social mark MUST ใช้ owner-approved asset ตรง declared role หากยังไม่มี logo asset ที่ approved สำหรับ role/surface นั้น MAY ใช้ canonical portfolio name เป็น governed live-text identity ที่ bind approved fonts ได้ แต่ MUST ระบุ `kind: governed_text_identity`, ใช้ canonical text ครบทุก delivered locale, ตั้ง `logoAssetId: null` และ `logoReconstructionAllowed: false`; MUST NOT ทำ live type ให้เลียนแบบ wordmark หรือ invent compact mark

Acceptance:

- LOGO-01-A — automated: brand-required output resolve identity implementation หนึ่งรายการพอดี—approved asset identity ต้องตรง role/surface/rights/SHA-256/receipt/minimum-size/clear-space; governed text identity ต้องตรง canonical locale text, approved font bindings, null `logoAssetId`, disabled reconstruction และ artifact-resolved format-implementation record ต้อง bind implementation ID เดียวกัน
- LOGO-01-B — visual: asset identity ใช้ clear space/minimum size/contrast/direct surface ตรง approved variant; governed text identity ยังคงเป็น live text ที่อ่านได้และไม่ impersonate wordmark ที่ไม่ได้รับอนุมัติ

Logo ไม่ใช่ interface icon และ interface icon ไม่ใช่ product identity ถ้าไม่มี approved contrast-safe variant สำหรับ surface นั้น ให้เปลี่ยน surface/variant หรือไม่ใช้ ห้ามรับ contrast risk เพราะ implementation สวยใน screenshot เดียว

Default identity mapping: normal header ใช้ approved horizontal lockup เมื่อ role/surface approval นั้นมีอยู่จริง; compact app, tab/favicon, social avatar และ constrained mark ใช้ได้เฉพาะ separately approved asset ของ role นั้น ห้าม crop header lockup หรือประกอบ symbol + live type ใหม่ เมื่อไม่มี approved logo role ให้ใช้ governed text identity `Landometer` ตาม registry ไม่ใช่ใช้ candidate logo และไม่ใช่สร้าง logo ใหม่ Build Card MUST bind artifact-owned registry ด้วย `{registryRef, sha256, schemaRef}`; artifact-resolved format-implementation record MUST bind `identityImplementationIds` อย่างน้อยหนึ่ง ID และ `identityAssetIds` อาจว่างได้เฉพาะเมื่อ governed text identity เป็นตัวที่ใช้งานจริง Identity asset ต้องมี role, SHA-256, `licenseOrPermission`, `fallback`, `altOrTextEquivalent`, `approvalReceiptRef` และ `approvalReceiptSha256`; registry owns rights/approval, exact hash, clear-space และ minimum-size contract ส่วน manifest `assetBindings` MUST bind ID/role/surface/ref เดียวกันกับ exact emitted hash

Governed text identity MUST select one exact registry `typographyBindingId` for the delivered surface/runtime. Binding นั้นกำหนด font source, family, PostScript name เมื่อเป็น native font, weight, style, size, minimum size, tracking, line height, clear space, substitution policy, final-output policy และ fixture IDs แบบครบชุด `fontAssetIds` ใน Build Card MUST เท่ากับ packaged-font IDs ของ binding นั้นพอดี; native binding MUST ใช้ `nativeMappingId` ที่ตรง platform และห้าม silent substitution Static export MUST เก็บ canonical text เป็น live text ใน editable source และ final bytes ต้องใช้ exact embedded font, approved generated-vector projection ที่มี asset record/hash/text equivalent หรือ verified raster pixels ตาม binding—ห้ามแปลง text เป็นโลโก้หรือ vector ที่ไม่มี authority

---

## 5. Visual foundations

### 5.1 Color: semantic before decorative

**COLOR-01 — Use semantic color tokens.** Authored UI, text, surface, state และ data color MUST มาจาก governed roles ของ color-srgb-05; state, category และ magnitude MUST NOT พึ่งสีอย่างเดียว และ contrast MUST ตรวจใน output context จริง Approved identity artwork กับ governed evidence/editorial media retain approved source pixels และ MUST NOT ถูก sample/reconstruct เป็น interface token

Acceptance:

- COLOR-01-A — automated: authored colors resolve approved token; audience bytes use the atomic values in `color-srgb-05.production.css` or a separately sanitized governed projection; `delivery.files` MUST NOT match ทั้ง path หรือ SHA-256 ของ raw retained registry ทั้งสี่ไฟล์
- COLOR-01-B — visual: text, controls, focus, graphics และ data marks ผ่าน declared contrast gates ใน light, dark และ print-relevant states

ไฟล์ raw ทั้งสี่คือ `color-srgb-05.tokens.json`, `color-srgb-05.scales.json`, `color-srgb-05.delivery.json` และ `color-srgb-05.tokens.css` เป็น byte-identical provenance evidence เท่านั้น และ MUST NOT เข้า audience bytes เพราะมี historical lifecycle/rule metadata หรือ predecessor delivery state Denylist ตรวจทั้ง canonical path และ exact byte hash จึงห้าม rename/copy raw bytes เป็นชื่ออื่นแล้วใส่ใน `delivery.files` Production web MUST ใช้ `color-srgb-05.production.css` ซึ่งมีเฉพาะ atomic CSS color values; ไฟล์นี้ MUST derive แบบ deterministic ด้วย `render-color-production.mjs` จาก governed registry และตรวจ hash/receipt หลัง render Format อื่น resolve semantic roles จาก registry และ emit ได้เฉพาะ machine projection ที่ sanitize แยกต่างหากพร้อม receipt ภายใน manifest

#### Canonical brand และ energy colors

| Token | Value | Role |
|---|---:|---|
| brand.blue | #1D4497 | portfolio identity; ไม่ใช่ default body text |
| brand.beige | #F2F1DF | warm identity surface |
| energy.sky | #59D2FE | restrained accent |
| energy.mint | #0AD69C | restrained accent |
| energy.coral | #FF5A5F | restrained accent; ไม่เท่ากับ danger โดยอัตโนมัติ |
| energy.yellow | #FFBC1F | restrained accent; ไม่เท่ากับ warning โดยอัตโนมัติ |

#### Foundation pairs: light / dark

| Semantic token | Light | Dark |
|---|---:|---:|
| surface.canvas | #F6F7F3 | #11191D |
| surface.alt | #EEF1EE | #172126 |
| surface.card | #FCFCFA | #20292D |
| surface.raised | #FFFFFF | #293337 |
| surface.soft | #E5E9E6 | #2B3534 |
| surface.blueTint | #E2E9ED | #18333E |
| surface.beigeTint | #F2F1DF | #2C2A22 |
| text.primary | #182327 | #F1F4EF |
| text.secondary | #5F635A | #C4CECA |
| text.metadata | #5C6A61 | #A6B5B1 |
| text.muted | #7B877D | #8D9D99 |
| text.disabled | #A7B3A9 | #71817D |
| border.hairline | #DCE1DD | #33403D |
| border.default | #C9D0CB | #46524F |
| border.emphasis | #7D877F | #7C8A84 |
| interaction.accent | #176B82 | #68C4E2 |
| interaction.focus.ring | #176B82 | #68C4E2 |

State tokens success, warning, danger, info, neutral, pending และ assisted จาก color-srgb-05 ยังคงเป็น canonical ค่า energy color ห้ามใช้แทน state token เพียงเพราะดูคล้ายกัน State MUST มี text/icon/pattern หรือ programmatic name ร่วมด้วย

Dataviz และ map MUST ใช้ approved scale registry แยก semantic state, categorical series และ magnitude scale ไม่ให้สีเดียวรับหลายความหมายใน scene เดียว Palette ที่สวยแต่ label ไม่พอถือว่า fail

#### Governed atmosphere retained from v0.9.0-r7

**SURFACE-01 — Atmosphere surfaces have a declared job.** Brand-atmosphere surface MUST ใช้ exact recipe จาก landometer-atmosphere-gradient-v2 หรือ approved flat/photo treatment เพื่อ job ที่ประกาศ: entry, orientation, transition, momentum หรือ closure ต้อง record focal target, reading direction, foreground contract, contrast evidence, cadence และ deletion test Gradients MUST NOT decorate every card หรือ encode data, product capability, status หรือ magnitude

| Recipe | Exact CSS | Semantic job | Foreground |
|---|---|---|---|
| atmosphere.gradient.measure.deep | linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%) | high-confidence entry, direction, closure | onDeep |
| atmosphere.gradient.measure.luminous | linear-gradient(135deg, #89CEF6 0%, #5ECAD6 50%, #6CD5B3 100%) | orientation, measurement becoming action | onLight |
| atmosphere.gradient.ground.current | linear-gradient(135deg, #0F5773 0%, #006A6A 50%, #1F744F 100%) | context/evidence becoming understandable | onDeep |
| atmosphere.gradient.ground.mist | linear-gradient(135deg, #C4E0EE 0%, #B2E2E2 50%, #CCE6D0 100%) | calm context, collaboration | onLight |
| atmosphere.gradient.cultivate.glow | linear-gradient(135deg, #EB8182 0%, #F5A06F 50%, #EBC573 100%) | action and credible momentum | onLight |
| atmosphere.gradient.cultivate.mist | linear-gradient(135deg, #F7CBC7 0%, #FBD1B6 50%, #F1E0B4 100%) | completion and handoff | onLight |
| atmosphere.gradient.diversity.spectrum | linear-gradient(135deg, #89CEF6 0%, #6CD5B3 34%, #EBC573 67%, #EB8182 100%) | rare evidenced participation/co-creation | onLight |

Foreground contracts: onDeep primary/icon #FFFFFF, secondary #F1F4EF; onLight primary/icon #182327, secondary #293337 Focus uses an inner/outer pair that remains visible on both field and adjacent surface Contrast MUST sample actual rendered glyph/icon bounds across the gradient, not endpoints only

Long public/adoption/campaign routes MUST either resolve atmosphere at opening, one major transition and closing through a mix of exact gradient, large approved photo with deterministic scrim หรือ bold flat field, or record a deliberate zero-atmosphere decision A smaller task surface MUST NOT manufacture all moments One dominant gradient per viewport is the default cadence Diversity spectrum appears at most once and only for evidenced multi-perspective content

Deletion test: if removing the treatment does not weaken its declared entry/orientation/transition/momentum/closure job, remove it Product gradients remain named-product identity only and never become shared portfolio or analytical color

Acceptance:

- SURFACE-01-A — automated: exact recipe ID, role, foreground, focal target, direction and color-set record resolve
- SURFACE-01-B — visual: local contrast/cadence/deletion tests pass; no quota or data/status use

### 5.2 Typography: role, script, stress fixture

**TYPE-01 — Typography is script-aware and output-aware.** Type roles MUST ใช้ approved Latin/Thai families, รักษา hierarchy และผ่าน script-specific collision, clipping, fallback และ export checks ในทุก size ที่ใช้ ค่า Thai display line-height 1.16 เดิม MUST NOT ถือว่าปลอดภัยทั่วโลก

Acceptance:

- TYPE-01-A — automated: font roles/fallbacks resolve type-script-aware-02
- TYPE-01-B — visual: Thai/Latin stress fixtures ไม่มี clipping, collision, tofu หรือ unintended substitution ในแต่ละ format

#### Font roles

| Role | Latin | Thai | Weight |
|---|---|---|---:|
| display/headline | Arvo | IBM Plex Sans Thai Looped | 700 |
| body/UI | Bai Jamjuree | Bai Jamjuree | 400 / 600 |
| technical/data | JetBrains Mono | IBM Plex Sans Thai | 400 |
| interface symbol | Material Symbols Rounded approved subset | same glyph system | 300 |

Fallback บน interactive web MAY preserve script legibility โดยไม่เลียนรูปร่าง exact ของ primary family ระหว่าง load failure แต่ห้ามทำให้ action หาย ส่วน output non-web ที่ส่งมอบ MUST เลือก exact `nonWebPortability.nativeFontMappings` ตาม platform และ format, ตั้ง `substitutionAllowed: false`, ตรวจ availability/no-substitution และปฏิบัติตาม fixed-export policy; mapping ที่ไม่มีหรือ font ที่ไม่พร้อมเป็น delivery blocker ไม่ใช่เหตุให้เปลี่ยน family เงียบ ๆ

Font asset binding ใน Build Card MUST ใช้ descriptor names ตรง machine contract: `fontRole`, `fontFamily`, `fontSubset`, `fontWeight`, `fontFallback` และ `licenseOrPermission` พร้อม exact SHA-256 และ `approvalReceiptRef` + `approvalReceiptSha256` ห้ามสร้างชื่อ field ทางเลือกหรือเดา descriptor จากชื่อไฟล์

#### Type scale

ค่าตารางนี้เป็น **browser/screen primitives** ในหน่วย `rem`, `vw` และ `clamp()` เท่านั้น ไม่ใช่ค่า point สำหรับเอกสารหรือสไลด์ งาน non-web MUST ใช้ `typeAdapter`, grid, safe area และหน่วยจาก selected target profile โดยตรง และ MUST ผ่าน fixture ของ target นั้น ห้ามแปลง `rem` หรือ CSS pixel เป็น pt/mm/authoring-tool units แบบเดาเอง

| Role | Size |
|---|---|
| caption | 0.75rem |
| label | 0.8125rem |
| body-sm | 0.875rem |
| body | 1rem |
| body-lg | 1.125rem |
| h3 | clamp(1.35rem, 2vw, 1.75rem) |
| h2 | clamp(2rem, 4vw, 3.25rem) |
| h1 Latin | clamp(3.25rem, 7vw, 6.5rem) |
| h1 Thai | clamp(2.5rem, 6vw, 5rem) |

Display line-height ต้องเลือกจาก approved size/script registry หลัง stress test หากไม่มี fixture pass ให้ใช้ safe fallback 1.25 และ artifact นั้นยังผ่าน typography gate ไม่ได้จนกว่าจะมี fixture ห้ามบีบ line-height, letter-spacing หรือ glyph scale เพียงเพื่อให้ copy ที่ยาวเกิน fit

### 5.3 Interface icons

**ICON-01 — Interface icons are simplified rounded outlines.** UI icons MUST simplified, outline, rounded จาก approved subset และคง FILL 0 / wght 300 ทุก state; selected state MUST แสดงด้วย semantic surface, color, visible label หรือ outline-container treatment ไม่เปลี่ยน glyph fill/weight Identity marks และ data symbols MUST เป็นคนละระบบ

Canonical variable axes:

| Axis | Value |
|---|---:|
| FILL | 0 |
| wght | 300 |
| GRAD | 0 |
| optical size | match rendered size from approved subset |

Acceptance:

- ICON-01-A — automated: icon name อยู่ใน approved subset และ FILL คง 0 ทุก state
- ICON-01-B — visual: icon อ่านออกและมี style เดียวกันใน rendered/exported size ทุกขนาด

Icon-only control MAY ใช้เมื่อ symbol เป็น conventional และมี accessible name/tooltip ที่ชัด ถ้า intent คลุมเครือ MUST ใช้ text label Icon ห้ามใช้เป็นหลักฐาน, rating หรือ category แทน label และห้ามนำ logo asset ไปวาดใหม่ให้เข้าระบบ icon

Icon asset binding MUST declare `glyphs`, `licenseOrPermission` และ `fallback` พร้อม role, exact SHA-256, `approvalReceiptRef` และ `approvalReceiptSha256`; glyph ที่ไม่อยู่ใน approved subset ห้าม substitute เงียบ ๆ สำหรับ document/PDF/deck/social ให้ใช้ visible text label เป็น default; icon visual เป็น optional และใช้ได้เฉพาะ registered generated-vector asset ที่มี exact hash + text equivalent ตาม `nonWebPortability.interfaceIconPolicy` ห้ามใช้ native symbol font เป็น fallback โดยอัตโนมัติ

### 5.4 Layout, space และ responsive composition

**LAYOUT-01 — Layout preserves hierarchy across formats.** Composition MUST รักษา primary reading path, responsive/page-safe gutters, deliberate density และความสัมพันธ์ที่รับรู้ได้ระหว่าง question, evidence, interpretation และ next action

Acceptance:

- LAYOUT-01-A — visual: reading order ชัดที่ minimum, nominal และ maximum target sizes
- LAYOUT-01-B — manual: essential content ไม่ clipped, orphaned, ซ่อนหลัง navigation หรือ split โดยไม่มี continuation cue

#### Browser/screen primitive scales

ค่าต่อไปนี้เป็น CSS/browser primitives สำหรับ responsive screen composition ไม่ใช่ global physical units งาน document, PDF, deck, social และ native authoring MUST ใช้ selected target profile's `typeAdapter`, grid, safe area, canvas และ unit contract; ห้ามใช้ตาราง px นี้เป็น conversion table หรือสร้างค่า pt/mm/pixel ใหม่โดยไม่มี target record

| Scale | Values |
|---|---|
| spacing | 0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| radius | 6, 10, 16, 24, 32 px และ pill |
| content containers | reading 760, default 1120, wide 1280 px |
| gutters | 16, 24, 32 px ตาม viewport |
| breakpoints | 360, 600, 900, 1200, 1600 px |

Breakpoint คือจุดที่ content ต้อง recompose ไม่ใช่ device label Design MUST ทดสอบช่วงระหว่าง breakpoint ด้วย ไม่ใช่เพียง six screenshots

Component ที่แน่นเกินแก้ตามลำดับ: ลด nonessential content → เปลี่ยน composition → stack → เลื่อน lower-priority action → ใช้ approved compact locale copy ห้ามเริ่มด้วยลด font ต่ำกว่า role, ตัด label หรือซ่อน evidence

### 5.5 Media และ visual evidence

**MEDIA-01 — Media treatment follows semantic role.** Crop, animation และ decorative treatment MUST gated ด้วย semantic role ของ asset Identity, evidence, maps, charts, UI captures และ provider content MUST fixed เว้นแต่ approved role อนุญาต transformation; alternative และ attribution MUST survive export

Acceptance:

- MEDIA-01-A — automated: asset ทุกชิ้นมี governed role, source, rights, exact SHA-256, approval status, fallback และ text equivalent เมื่อ required; เฉพาะ `approvalStatus: approved` MUST มี `approvalReceiptRef` + `approvalReceiptSha256` ส่วน non-approved asset เป็น blocker และอยู่ได้เฉพาะ internal preview
- MEDIA-01-B — visual: responsive/export crops รักษา evidence-bearing subject, identity geometry และ attribution

Governed roles:

- identity — ห้าม crop, recolor, distort หรือ motion โดยไม่มี approved variant
- evidence — ห้ามเปลี่ยนส่วนที่ทำให้ข้อสรุปเปลี่ยน; caption/source อยู่ใกล้
- editorial — crop ได้ตาม focal point และ rights record
- atmosphere — decorate ได้แต่ subordinate และ aria-hidden เมื่อไม่มี meaning
- data_visualization — fixed truth-bearing; transformation ต้องไม่เปลี่ยน value, scale, unit หรือ state
- map — รักษา geography, coverage, projection, attribution และ nonspatial alternative
- social_preview — ต้องตรง visible page/locale และใช้ได้เฉพาะ approved surface
- ui_capture — รักษา state, label, privacy และ product boundary ของ capture
- provider_content — รักษา provider boundary, ไม่ใช้ CSS inversion ที่เปลี่ยน identity/meaning
- generated_vector — bind generator/source, rights, exact bytes, text equivalent และห้ามใช้แทน unapproved identity/evidence

### 5.6 Component anatomy

**COMPONENT-01 — Reusable components declare a complete semantic contract.** Build Card `composition.componentIds` MUST inventory exact reusable component IDs ที่ implementation source ใช้ และ artifact-resolved implementation record `requirements.componentIds` MUST เท่ากับ inventory นี้พอดี ทุก ID ต้องมี machine-valid `componentContract` หนึ่งรายการพอดีสำหรับ selected `formatProfile`; cross-format parity ใช้ FORMAT-PARITY-01 และ format pack ไม่ใช่การใส่ `formatBehavior` หกรูปแบบลงใน resolved contract เดียว Visual similarity อย่างเดียวไม่เพียงพอให้ component ใช้แทนกัน ถ้า semantic intent, consequence หรือ evidence role ต่างกัน

Acceptance:

- COMPONENT-01-A — automated: Build Card inventory, artifact-resolved implementation `componentIds` และ contract IDs เท่ากันพอดี ไม่มี duplicate/missing/extra; governing rules ของ contract เป็น subset ของ resolved rules; token refs resolve ไป exact governed token bytes และ fixture refs resolve ไป active acceptance/resolved-test set
- COMPONENT-01-B — manual: rendered fixtures รักษา semantic intent, locale content, state, evidence/permission boundary, accessibility behavior และ static-format equivalent ตาม contract

Contract ทุกตัว MUST มี `componentClass` และ:

1. purpose และ non-purpose
2. semantic element/landmark
3. content contract และ locale stress state
4. states: default, hover ถ้ามี, focus, active/pressed, selected/current, disabled, loading, empty, error, success
5. responsive/page/export behavior
6. accessibility name, role, value, order และ status
7. token mapping
8. evidence/permission boundary ถ้าเกี่ยวข้อง
9. acceptance fixtures และ anti-pattern

State ที่ไม่เกิดกับ component นั้น MUST ระบุ `not_applicable` พร้อม behavior/rationale ที่ชัด ห้ามลบ state ออกจาก contract เพื่อหลบการตรวจ `navigational_cta` MUST ใช้ default/hover/focus/active และ selected/disabled/loading/empty/error/success เป็น `not_applicable`; `stateful_cta` MUST มี disabled/loading/error/success และกำหนด recovery/result status ส่วน empty/selected ระบุตาม behavior จริง Disclosure และ side bookmark ต้องมี contract แยก ไม่ถือว่าถูก cover ด้วย navbar contract

### 5.7 Control geometry retained

**CTRL-01 — Control geometry stays direct and recognizable.** กฎนี้ใช้กับ direct controls ใน `web_public` และ `app_interactive` เท่านั้น Build Card `navigation.controlBudgets.minimumDirectTarget` MUST เท่ากับ selected target profile พอดี: browser ใช้ `{value: 44, unit: css_px}` กับ semantic browser element/DOM order; native app ใช้ `{value: 44, unit: platform_dp}` กับ native semantic view/platform accessibility order Discrete action target ทุกอัน MUST มีขนาดอย่างน้อย 44 × 44 ในหน่วยของ branch นั้นทุก state Text และ icon+label button ใช้ approved capsule; icon-only button ใช้ approved circle Padding/gap/border/focus/loading/disabled resolve component tokens และห้าม proxy click-forward งาน document, PDF, deck และ social ใช้ static action equivalent ตาม §7.1/§11 และ selected target profile โดยไม่สร้าง interactive target ปลอม

Canonical geometry:

| Control | Geometry |
|---|---|
| text or icon+label button | browser: min-height 44 CSS px; native: min-height 44 platform dp; capsule geometry จาก runtime adapter โดย label ต้องไม่ถูกตัด |
| icon-only button | browser: 44 × 44 CSS px; native: 44 × 44 platform dp; circle geometry และ accessible name required |
| inline link in running text | not forced into a 44px box; follows WCAG text-link exception/spacing branch and visible focus |

Acceptance:

- CTRL-01-A — automated: exact target-profile value/unit, browser element + DOM order หรือ native view + platform accessibility order, tokens และ accessible names pass every state
- CTRL-01-B — visual: capsule/circle/label/icon/focus/loading/disabled fixtures remain intact across locale, width and zoom

### 5.8 Theme behavior

**THEME-01 — Theme changes presentation without changing meaning.** Light, dark, auto, forced-color และ fixed-export states MUST preserve content, identity, evidence, control meaning and state parity Auto follows platform preference unless reversible explicit user choice exists Static export MUST declare/verify one fixed theme

Interactive HTML MUST offer Auto when both themes exist User choice persists without a first-paint flash that exposes wrong meaning Controls have accessible labels and do not use sun/moon icon alone to imply current vs next state If theme storage fails, system preference/fallback still yields usable content

Acceptance:

- THEME-01-A — automated: theme, explicit preference, metadata and token resolution deterministic; no action/content differs by theme
- THEME-01-B — visual: light/dark/auto/forced-color/export fixtures preserve identity and all contrast gates

### 5.9 Deterministic asset delivery

**ASSET-DELIVERY-01 — Font and icon delivery is deterministic.** Delivered font, interface-icon subset, identity, governed media และ generated vector MUST resolve artifact-owned registry, approved role, source, rights, exact byte hash, typed approval receipt และ fallback Web subsets record glyph map; non-web selects one exact platform mapping, forbids substitution, and final export embeds the exact font or uses an approved vector/raster projection under recorded fixtures

Build Card `assetRegistries` MUST bind each registry by `registryRef`, `sha256`, `schemaRef`; each approved asset MUST bind `approvalReceiptRef` and `approvalReceiptSha256` Receipt grant ต้อง match exact `assetId`, `role`, `sha256`, `allowedFormatProfiles`, `allowedSurfaceRoles`, `allowedAudiences`, `publicationPermission`, `licenseOrPermission` และ `fallback`; interface icon เพิ่ม exact `glyphs` ส่วน identity และ governed media เพิ่ม `altOrTextEquivalent` Identity requires `licenseOrPermission`, `fallback`, `altOrTextEquivalent`; icon requires `glyphs`, `licenseOrPermission`, `fallback`; font requires `fontRole`, `fontFamily`, `fontSubset`, `fontWeight`, `fontFallback`, `licenseOrPermission` Production manifest MUST include matching identity/font/icon/media registry references and exact emitted asset bindings Fonts/icons load from first-party-controlled or explicitly approved durable assets when deterministic delivery is required If delayed/blocked/offline, Thai/Latin text and controls remain readable and actions stay identifiable

Acceptance:

- ASSET-DELIVERY-01-A — automated: file, role, source, approval, rights, hash, Unicode/glyph coverage and fallback resolve; non-web mapping ID/platform/format, substitution policy, embedding/vector policy and fixture IDs resolve exactly
- ASSET-DELIVERY-01-B — visual: delayed/blocked/offline/print/export fixtures have no tofu, identity reconstruction or substitution drift; non-web output retains complete labels and exact selected typography

---

## 6. Navigation และ page orientation

Navigation v0.9.1 มีสามระดับที่ต้องไม่ปน:

1. ecosystem — ความสัมพันธ์ระหว่าง Land, Location, Living และ shared Landometer destinations
2. property/product — navigation ของ product หรือ property นั้น
3. page — headings/anchors ภายในหน้า

ระบบ MAY รวมระดับใน disclosure เดียวเมื่อ label และ grouping ชัด แต่ MUST NOT ทำให้ page anchor ดูเหมือน destination ข้าม property หรือทำให้ product-specific route ดูเป็น shared portfolio route

`navigation.destinations[].current` เป็น scoped enum ไม่ใช่ boolean: `none` = ไม่ใช่สถานะปัจจุบัน, `page` = route ของหน้าปัจจุบัน และ `location` = anchor ของตำแหน่งภายในหน้าปัจจุบัน งาน interactive ที่ `mode` ไม่ใช่ `none` MUST มี `page` exactly one และ `location` zero or one; เมื่อเปิด side bookmark ต้องมี `location` exactly one จึงแสดง current page route และ current in-page location พร้อมกันได้โดยไม่ conflation งาน static document/PDF/deck/social MUST ใช้ `none` ทุก destination เพราะไม่มี live current state; `mode: none` ต้องมี destinations ว่างและไม่สร้าง current ปลอม

### 6.1 Unified navbar

**NAV-01 — Navigation exposes a small set of direct destinations.** Unified navigation MUST preserve ecosystem, property และ page levels โดยไม่ conflation `navigation.brandDestinationRef` MUST resolve exactly one destination `id` whose `role: brand` binds the approved identity control and direct destination; brand consumes one control in every header budget Desktop แสดง visible header controls รวม brand ไม่เกิน 4 และ mobile รวม brand ไม่เกิน 2 ทุก visible control MUST เป็น direct semantic target อย่างน้อย 44 × 44 ตาม selected target profile: CSS px สำหรับ browser และ platform dp สำหรับ native app แม้ใน calmest state

Acceptance:

- NAV-01-A — automated: exactly one brand destination resolves, binds identity, and is counted with every visible header control; control count และ exact target-profile value/unit ผ่าน desktop/mobile budgets ในทุก header state
- NAV-01-B — interaction: `current: page` และ `current: location` อยู่คนละ scope; hover, focus, pressed, open, scroll-calm และ history-restored states รักษา label, destination และ keyboard operation
- NAV-01-C — manual: ไม่มี coordinate click-forward overlay หรือ wake-first target substitution

#### Navbar anatomy

| Zone | Contract |
|---|---|
| brand | approved identity implementation, direct destination, clear current relation |
| primary destinations | no more than remaining control budget; descriptive text preferred |
| utility | language/theme/login/menu only when needed; each consumes budget |
| disclosure | contains overflow ecosystem/property/page groups with headings |
| status | current location is visible and programmatic; not color alone |

Header MAY change surface opacity, spacing หรือ visual emphasis while scrolling แต่ semantic targets, accessible names, focus ring, order และ 44 × 44 geometry ใน selected unit MUST remain direct and stable Calm state MUST NOT shrink target ลงครึ่งหนึ่ง, require first wake click หรือ forward coordinates to hidden targets

At narrow widths preserve in this order: brand recognition → current location → primary task → language/access needs → lower-priority routes inside disclosure

### 6.2 Disclosure behavior

**NAV-02 — Navigation uses disclosure semantics.** Browser navigation disclosure MUST ใช้ button ใน DOM order ที่สัมพันธ์กับ trigger มี accessible name และ synchronized `aria-expanded`, keyboard-operable, predictable focus restoration และ MUST NOT ใช้ menu roles เว้นแต่ implement full application-menu keyboard model Native app disclosure MUST ใช้ platform-native disclosure control/view ที่มี name, expanded/collapsed meaning, operation และ focus restoration เทียบเท่ากันใน native view order + platform accessibility traversal order; native branch ไม่รับข้อบังคับ browser DOM/ARIA

Acceptance:

- NAV-02-A — automated: browser button/name/DOM order/`aria-expanded` หรือ native control role/name/state/view/accessibility order ถูกต้องตาม runtime
- NAV-02-B — interaction: browser Enter, Space, Escape, Tab, outside activation และ route change หรือ native equivalent inputs/lifecycle ให้ open/close/order/focus behavior ที่คาดเดาได้

Browser disclosure content MUST อยู่ใน DOM order ที่สัมพันธ์กับ trigger, ไม่ trap focus โดยไม่จำเป็น, ปิดด้วย Escape และคืน focus ไป trigger เมื่อเหมาะสม Native disclosure content MUST อยู่ใน native view order และ platform accessibility order ที่สัมพันธ์กับ trigger, รองรับ platform-equivalent close/back action และคืน focus ตาม platform convention Link/navigation view เป็น destination; button/action view เป็น state/action ห้าม styling generic container เป็น primary control

### 6.3 Side bookmark

**BOOKMARK-01 — Side bookmark is a secondary page index.** Build Card MUST declare sibling fields `navigation.sideBookmark: selected | omitted` และ `navigation.sideBookmarkUserBenefit` เสมอ Selection กับ reusable-component inventory เป็น contract เดียวกัน: `selected` MUST มี `component.bookmark.side.01` ใน `composition.componentIds` พอดีหนึ่งครั้ง ส่วน `omitted` MUST ไม่มี ID นี้ เมื่อเป็น `selected` ใช้ได้เมื่อมี useful stable sections อย่างน้อย 2 และ `navigation.sideBookmarkUserBenefit` MUST เป็น nonempty string ที่อธิบาย orientation value ต่อผู้ใช้; เมื่อเป็น `omitted` ค่า `navigation.sideBookmarkUserBenefit` MUST เป็น `null` ห้ามละ field นี้และห้ามสร้าง object ซ้อน `sideBookmark.selection` หรือ `sideBookmark.userBenefit` เมื่อ selected แล้ว bookmark MUST mirror real heading anchors, แสดง `current: location` โดยไม่พึ่งสีอย่างเดียวเมื่อเป็น interactive, ไม่บัง content และ resolve exact format/runtime component contract ก่อน degrade เป็น mobile disclosure, TOC, PDF bookmark หรือ deck section marker ตาม format Static equivalents รักษา structure/order แต่ใช้ `current: none` เพราะไม่มี live location

Acceptance:

- BOOKMARK-01-A — automated: sibling fields `navigation.sideBookmark` / `navigation.sideBookmarkUserBenefit` ผ่าน branch ที่ active schema กำหนด; `selected` เป็นจริงก็ต่อเมื่อ `composition.componentIds` มี `component.bookmark.side.01` พอดีหนึ่งครั้ง, `omitted` ไม่มี ID นี้, artifact-resolved record มี exact format/runtime contract ที่ตรงกัน และ selected target ทุกอันมีอยู่ครั้งเดียว, accessible label และ current state ที่ programmatic เมื่อ interactive
- BOOKMARK-01-B — visual: rail หายเมื่อ empty และไม่บัง content, controls, browser UI หรือ safe areas

Side bookmark เป็น orientation aid ไม่ใช่ global nav:

- desktop: fixed/sticky rail ได้เมื่อพื้นที่พอและ 44 × 44 direct targets ไม่บังเนื้อหา
- mobile: entries ย้ายเข้า page section ของ navbar disclosure หรือ local TOC ไม่ย่อเป็น rail จิ๋ว
- deep link: landing target ต้องมองเห็น ไม่ถูก reveal-hide และมี scroll offset ชดเชย sticky header
- interactive current state: route ที่เป็นหน้าปัจจุบันใช้ `current: page`; anchor ที่อยู่ใน viewport/history-restored location ใช้ `current: location`; project เป็น `aria-current="page"` หรือ `aria-current="location"`/equivalent พร้อม shape/surface/label ไม่ใช้สีหรือ filled icon อย่างเดียว
- page ที่มี anchor เดียวหรือ headings ไม่ stable: omit rail

---

## 7. Actions และ CTA

### 7.1 Action taxonomy

ทุก Build Card action record MUST declare intent: navigate, inspect, submit, create, save, share, download, external_handoff, draft, confirm หรือ destructive พร้อม hierarchy: primary, secondary, quiet หรือ utility

หนึ่ง scene MUST มี primary CTA ไม่เกินหนึ่ง Secondary action ต้องไม่แข่งขันด้วยขนาด/สี/motion เท่ากัน Evidence links, navigation links และ CTA เป็นคนละ role แม้ใช้ element เป็น link เหมือนกัน

**CTA-01 — Every CTA has one truthful outcome.** CTA ทุกอัน MUST ใช้ specific verb-led label, outcome และ `destinationBinding` จริงหนึ่งอย่าง โดย `kind` ต้องเป็น `anchor | route | external | download | form | contact | command`, target และ `targetByLocale` ต้องตรง syntax/locale/section ที่อ้าง และ `presentation.mode` + `presentation.technique` ต้องตรง selected format; CTA ต้องตรง availability/permission และแยกออกจาก navigation, evidence link และ decoration ได้

Acceptance:

- CTA-01-A — automated: CTA record มี label, outcome, availability และ locale-complete `destinationBinding` ซึ่ง kind, target syntax, resolved anchor, presentation mode และ technique ตรง selected format
- CTA-01-B — interaction: activation ให้ outcome ที่ระบุเพียงครั้งเดียว, เก็บ input/state เมื่อ fail และแสดง result ที่รับรู้ได้
- CTA-01-C — automated: intent, priority, availability, orthogonal consequence, permission/confirmation policy, immutable progress/result/recovery/receipt contracts และ locale-specific label/outcome/destination fields satisfy action schema

`web_public` และ `app_interactive` ใช้ `presentation.mode: direct` + `direct_control` เท่านั้น ส่วน `document_flow`, `pdf_fixed`, `deck_presentation` และ `social_static` MUST ใช้ `static_equivalent` ตาม `format-packs.json.ctaDestinationContract` งาน static ห้ามวาด fake button เพื่อสื่อว่ากดได้ `command` ใน static format แสดงได้เฉพาะ explicit `instruction`; social static ไม่รองรับ `anchor` หรือ `command` และใช้ได้เฉพาะ route/external/download/form/contact เป็น `destination_cue`

Examples:

| Weak | Better | เหตุผล |
|---|---|---|
| Learn more | อ่านวิธีการ | ระบุสิ่งที่จะเปิด |
| Submit | ส่งคำขอรับข้อมูล | ระบุ consequence |
| Click here | ดูหลักฐานของคะแนนนี้ | ระบุ object |
| AI ready | ตรวจสิ่งที่ agent อ่านได้ | ไม่รวม permission/action readiness |

`consequence` MUST เป็น object `{class, external, cost, reversible}` โดย `class` ใช้ `none | reversible | irreversible | destructive`, `external` เป็น boolean, `cost` ใช้ `none | possible | known` และ `reversible` เป็น boolean ห้ามใช้ `external` หรือ `costly` เป็น class

Consequential Build Card action—เมื่อ class ไม่ใช่ `none`, `external: true` หรือ cost ไม่ใช่ `none`—MUST มี confirmation proportional to risk และ bind immutable definition objects: `permissionContract`, `progressPresentationContract`, `resultPresentationContract`, `recoveryContract` และ `receiptSchemaBinding` สี่ action-contract bindings แรกใช้ `{ref, sha256, schemaRef, schemaSha256}` โดย `ref` MAY ชี้ JSON Pointer fragment ที่ resolve ได้ในไฟล์ที่ hash-bound; receipt binding ใช้ `{ref, sha256, schemaId}` ค่าเหล่านี้ bind contract/schema definitions ที่จะใช้ ไม่ใช่ runtime permission, progress, result, recovery หรือ receipt instance Action ที่ไม่ available ต้องบอกเหตุผล ไม่ใช้ disabled mystery control Result contract MUST ครอบคลุม `succeeded`, `failed`, `cancelled`; recovery contract MUST ครอบคลุม `failed` และ `cancelled`

### 7.2 Label integrity

**CTA-02 — CTA labels remain intact.** CTA labels MUST อยู่หนึ่งบรรทัดเมื่อ format รองรับ และ MUST NOT truncated, ellipsized หรือ illegible แก้ pressure ตามลำดับ: approved compact locale label → ลด padding ภายใน target rule → full-width/stack → ย้าย lower-priority action → recompose

Acceptance:

- CTA-02-A — visual: label ครบและอ่านได้ใน supported locale, width, zoom และ export
- CTA-02-B — manual: compact label เป็น approved locale equivalent ไม่ใช่ตัวย่อกำกวม

### 7.3 CTA emphasis

เฉพาะงาน `web_public.browser` หรือ `app_interactive.browser` ที่ interactive เท่านั้น CTA MAY ใช้ observer-based `motion.cta.discovery-cue.01` เพื่อช่วยค้นพบ **primary navigational CTA** ครั้งแรกเมื่อ Build Card ระบุ `requiredUserBenefit: discoverability` การประกาศ cue นี้ trigger `motion` capability และจึง MUST มี `motionDecision: assigned`, motion assignment และ hash-bound browser motion config ครบ Recipe ต้อง bind `tokens.v0.9.1.json#/motion/ctaDiscoveryCue` และใช้ trigger, repeat count, duration ceiling, easing และ geometry ตรง token; stateful/consequential CTA, repeated exposure หรือ cue ที่ไม่มี benefit record ห้ามใช้ แต่:

- real label/background/border ต้องอ่านได้โดยไม่พึ่ง effect
- effect layer ต้อง aria-hidden และ pointer-inert
- run exactly once on first visible entry per page load; re-entry MUST NOT repeat และห้าม loop/flicker
- browser reduced-motion/observer failure ใช้ `no_cue_final_state`; `staticEquivalent: emphasis_without_motion` อธิบายความหมาย fallback ของ cue เมื่อแปล format เท่านั้น
- effect ห้ามบัง focus, progress, error หรือ confirmation
- ถ้าทดสอบ user benefit ไม่ได้ ให้ omit

งาน `app_interactive.native`, document, PDF, deck และ social MUST มี `ctaDiscoveryCueAssignments: []` แม้ source experience เคยมี animated cue Native app ที่ต้องการ emphasis ใช้ finite native-state feedback จาก selected `native_state` config โดยไม่อ้าง observer recipe; static format ใช้ hierarchy ปกติ เช่น weight, surface, border, spacing, working link, destination cue หรือ instruction โดยไม่ประกาศเป็น motion assignment และไม่วาด fake button

---

## 8. Motion และ interaction for user benefit

### 8.1 Benefit gate

**MOTION-01 — Motion must serve the user.** Motion MUST clarify state, sequence, progress, spatial relationship หรือ cause/effect Decorative motion MUST finite, subordinate และไม่มี perpetual flicker; essential content/action ห้าม depend on animation

Acceptance:

- MOTION-01-A — manual: motion role ทุกอันระบุ user benefit และ static final-state equivalent
- MOTION-01-B — automated: ไม่มี infinite attention animation หรือ unbounded CTA sweep

Motion decision:

1. ถ้าไม่มี motion ผู้ใช้เสียความเข้าใจหรือ feedback หรือไม่
2. motion เชื่อม cause → effect, source → destination หรือ state A → B ชัดหรือไม่
3. static/reduced version ให้ meaning เดียวกันหรือไม่
4. motion ทำให้ช้าลง, distract, nausea, layout shift หรือ focus drift หรือไม่

ถ้าข้อ 1–3 ตอบไม่ได้ หรือข้อ 4 เป็นจริง ให้ใช้ static state

### 8.2 Riddim Approach Motion

**MOTION-02 — Approach motion is role-gated and fail-open.** ข้อกำหนดแยกตาม runtime อย่างเด็ดขาด Browser approach reveal MAY ใช้ explicit semantic roles จาก motion-riddim-approach-02 แต่ source HTML MUST render final visible state และ enhancement MUST fail open ใน no JavaScript, reduced motion, observer failure, initialization timeout, hidden tabs, focus, deep links, history restoration, back-forward cache และ print Native app motion MUST resolve `native_state` config และใช้ native state-transition lifecycle: platform reduced motion, backgrounding, interruption, cancellation, restoration, view disposal, native view order, platform accessibility traversal order และ complete final state; native branch MUST NOT require HTML, JavaScript, IntersectionObserver, browser history/BFCache หรือ print behavior

Acceptance:

- MOTION-02-A — automated: browser source/reduced states และ native reduced/complete-final states expose all content; hero, LCP media, page title, first answer, primary proof, primary action, task-critical state, status, focus target และ deep-link target never reveal-hidden
- MOTION-02-B — interaction: browser observer/lifecycle failure หรือ native background/interruption/cancellation/restoration/view-disposal fixture settle complete visible usable final state; native view/accessibility order ไม่เปลี่ยน meaning

Explicit reveal roles:

| Role | Use | From |
|---|---|---|
| approach.soft | supporting section group | opacity + 32px block rise + scale 0.985 |
| approach.inline-start | paired comparison/relationship | opacity + 36px logical inline offset |
| approach.inline-end | paired comparison/relationship | opacity + 36px opposite logical inline offset |
| media.arrival | non-LCP editorial/atmosphere media | opacity + transform only |
| stagger.child | small related group after parent is settled | 150ms step, cap 450ms |

Never apply broad selector เช่น every card/every heading และไม่ซ้อน parent/child reveal ที่เวลาไม่ sync First answer/proof/action ไม่ใช่ decorative reveal role

#### Browser observer motion tokens

| Token | Value |
|---|---:|
| approach.opacity.duration | 760ms |
| approach.transform.duration | 920ms |
| media.arrival.duration | 900ms |
| approach.block.distance | 32px |
| approach.inline.distance | 36px logical |
| approach.scale.from | 0.985 |
| approach.stagger.step | 150ms |
| approach.stagger.cap | 450ms |
| approach.stagger.beatCount | 4 |
| approach.stagger.formula | `min(zeroBasedSiblingIndex, 3) × 150ms` |
| approach.opacity.easing | cubic-bezier(.16,1,.3,1) |
| approach.transform.easing | cubic-bezier(.2,.9,.25,1.08) |
| interaction.press.easing | cubic-bezier(.3,0,.6,1) |
| observer.threshold | 0.14 |
| observer.rootMargin | 0px 0px -12% 0px |
| initialization.watchdog | 2400ms |
| reached-content failsafe | two animation frames after passive audit |

Browser runtime เท่านั้น: หนึ่ง document root ใช้ shared IntersectionObserver หนึ่งตัวและ once-only unobserve Within each declared stagger group, zero-based sibling index `i` MUST receive delay `min(i, 3) × 150ms` จึงมี four beats 0/150/300/450ms และ item ที่ 4 ขึ้นไปใช้ cap 450ms; group order MUST follow semantic reading order Pre-paint bootstrap MAY arm pending state เฉพาะ normal motion + observer available และ MUST start 2400ms watchdog Ongoing passive scroll/resize/pageshow audit waits two frames after a target reaches/passes effective root, then forces final state if callback missed Adapter MUST NOT render source final → hidden → final flash

Native runtime ใช้ `capability-config.schema.json#/$defs/motionNativeState` โดยต้องมี `mode: native_state`, `feedbackDurationMs`, `stateDurationMs`, `maximumTransitionMs`, `reducedMotionFinalState: final_state`, `layoutGeometry: stable` และ `interruptionFinalState: final_state` งาน QA MUST ทดสอบ platform reduced motion, backgrounding, interruption, cancellation, restoration, view disposal, complete final state และ native view/platform accessibility traversal order หลักฐาน native ห้ามอ้าง no-JS, observer, BFCache หรือ print fixture แทน

CTA discovery cue เป็น browser-only recipe: first visible entry, one run per page load, 540ms with 600ms ceiling, `cubic-bezier(.16,1,.3,1)`, inline highlight sweep from −120% to 120% with 28% band, content opacity never below 1, zero layout movement, pointer-inert; re-entry does not repeat Browser reduced motion/observer failure uses no-cue final state Native app ไม่ใช้ cue นี้และ static format uses non-moving emphasis

Timing เป็น ceiling recipe ไม่ใช่ข้อบังคับให้ทุก scene animate ความเร็วของ feedback/state ยังใช้ token ที่สั้นกว่าตาม consequence

### 8.3 Layout/focus stability

**MOTION-03 — Motion does not disturb layout or reading.** กฎนี้แยกตาม runtime อย่างเด็ดขาด: `browser_observer` entry motion MUST ใช้ opacity และ transform เท่านั้น, zero layout shift, หลีกเลี่ยง nested unsynchronized reveals และใช้ exact motion-riddim-approach-02 timing/distance/logical-direction/four-beat-stagger/reduced-motion recipe; `native_state` MUST ใช้เฉพาะ selected native config + native state-transition lifecycle, รักษา layout geometry, native view order และ platform accessibility traversal order และ MUST NOT require browser observer fields, opacity/transform approach recipe, Riddim distance token หรือ stagger formula; `presenter_sequence` MUST ใช้เฉพาะ selected presenter config, รักษา slide-object order กับ complete governed final frame และ MUST NOT require browser observer, browser approach properties หรือ Riddim stagger tokens

Acceptance:

- MOTION-03-A — automated: runtime class resolve exact branch ของตน—browser ใช้ opacity/transform + exact four-beat Riddim recipe, native ใช้เฉพาะ native config/lifecycle fields, presenter ใช้เฉพาะ presenter config/final-frame fields—ทุก branch รักษา stable layout geometry และ reject field/recipe/test ของอีก branch
- MOTION-03-B — visual: browser reading/focus/scroll order, native view/platform-accessibility order หรือ presenter slide-object order/final frame stable ระหว่างและหลัง motion ตาม branch ที่เลือก

Reduced motion ไม่ใช่ช้าลงแต่คือ final-state-first: remove approach/parallax/sweep, keep necessary state change instant หรือ minimal non-spatial feedback และ preserve progress/status

### 8.4 Other motion modules

- parallax MUST remain disabled in v0.9.1 Future candidate MAY enable only through named recipe defining purpose, semantic role, maximum travel/rate, input behavior, reduced-motion final state, performance budget and lifecycle QA; identity, evidence, map, chart, UI capture and provider content remain fixed
- data transition MAY เมื่อติดตาม same object/state; exit/enter ห้ามทำให้เทียบค่าผิด
- loading motion MUST มี text/status และ timeout/failure state
- carousel MUST ไม่ autoplay default; user controls visible และ reduced motion usable
- page transition MUST ไม่ delay navigation หรือ hide history-restored content

---

## 9. Reusable interaction modules

### 9.1 Loop carousel

**CAROUSEL-01 — Looping carousels keep one semantic cycle.** Loop carousel MUST มี semantic source cycle เดียว Visual clones MUST hidden from accessibility, inert, ไม่มี IDs/IDREF, non-focusable และไม่มี repeated meaningful alternative User controls MUST visible และ autoplay MUST off by default

Acceptance:

- CAROUSEL-01-A — automated: clone audit ผ่าน aria-hidden/equivalent, inert, no duplicate IDs, no focus descendants และ no repeated alternatives
- CAROUSEL-01-B — interaction: previous, next, focus, resize, touch, reduced-motion และ end-to-start preserve context

ถ้ารายการมีเนื้อหาสำคัญต่อการเปรียบเทียบ ใช้ grid/list เป็น default Carousel เป็น progressive presentation ไม่ใช่วิธีซ่อน content density

### 9.2 External social feed

**SOCIAL-FEED-01 — External feeds expose truthful states.** External feed MUST declare idle, loading, loaded, empty, failed และ stale states ตาม applicable, รักษา provider boundary, โหลดหลัง primary content, มี direct fallback และใช้ recency wording เมื่อ freshness verified เท่านั้น

Acceptance:

- SOCIAL-FEED-01-A — interaction: success, timeout, blocked provider, empty/stale response และ no-script มี truthful state/fallback
- SOCIAL-FEED-01-B — visual: provider content ไม่ถูก invert/recolor จน meaning/identity เปลี่ยน

Primary answer, evidence, CTA และ layout MUST ไม่ depend on third-party feed Feed timeout ห้ามทำให้ page loading ไม่จบ

---

## 10. SEO, search, AI และ agent discoverability

### 10.1 แยก Discovery, Readability และ Action

คำว่า SEO-ready, AI-ready หรือ Agent-ready อย่างเดียวห้ามใช้เป็น conformance claim ทุก public artifact MUST รายงานสามชั้นแยกกัน:

| Layer | คำถาม | ไม่ได้พิสูจน์ |
|---|---|---|
| Discovery | audience/crawler ที่ตั้งใจเข้าถึง route ที่ถูกได้หรือไม่ | accuracy, rights, readability หรือ permission |
| Readability | คนและเครื่องตีความ identity, structure, claim และ evidence boundary ได้หรือไม่ | authorization หรือ ability to act |
| Action | คนหรือ authorized agent ทำ task ที่ประกาศอย่างปลอดภัยและได้ receipt หรือไม่ | indexability, ranking หรือ trust |

ก่อน `artifact_qa_passed` ทั้งสามชั้นเป็น universal และ MUST applicable + `pass` พร้อม bundle-local receipt ที่ bind bytes จริง ห้ามใช้ `not_applicable` แทนการตรวจ Action ของ information page; artifact แบบ read-only ต้องพิสูจน์ว่า destination/outcome ที่ประกาศตรงจริง, ไม่มี mutation ที่ซ่อนอยู่ และขอบเขต permission ชัด `fail` หรือ `not_tested` ใช้ได้เฉพาะก่อนถึง artifact QA และต้องมี reason/owner ตาม schema

### 10.2 Stable claims และ machine projection

**CLAIM-MACHINE-01 — Claims have stable machine-readable records.** Material public claim ทุกอัน MUST มี stable claimId และ machine-readable record ซึ่ง wording, entity, locale, scope, explicit authority class/boundary, value/assertion, unit, geography, time basis, source, method, status, confidence/limitation, owner และ last-reviewed date ตรง visible claim

Acceptance:

- CLAIM-MACHINE-01-A — automated: claim IDs unique และ required field มีค่าหรือ explicit not_applicable; public-eligible evidence/provenance refs เป็น stable public HTTPS URL หรือ URN ไม่ใช่ local path
- CLAIM-MACHINE-01-B — manual: sample visible-to-machine comparison ไม่มี scope, value, date, status หรือ evidence drift

#### Claim Record orientation (non-copyable)

ตัวอย่าง YAML นี้ใช้อ่าน field groups เท่านั้น ค่า placeholder ไม่ใช่ valid production data และห้ามคัดลอกไปอ้าง conformance Exact copyable shape อยู่ใน `claim-record.schema.json` และ `claim-record.example.json`

~~~yaml
claimId: immutable-id
textByLocale:
  th-TH: approved visible proposition
  en: approved equivalent proposition
claimType: fact | measurement | estimate | comparison | interpretation | commitment | capability | status
entity:
  entityId: stable-entity-id
  entityType: governed-entity-type
  name: approved-entity-name
proposition:
  assertion: approved proposition independent of layout
  valueState: not_applicable | stated | measured | estimated
  value: null
  unit: null
scope:
  productScope: shared_landometer | named_product
  portfolioDomain: shared | land | location | living
  product: null
  geography: null
  audience: declared-audience
  timeWindow: declared-time-window
authority:
  class: portfolio_owner_approval | product_owner_approval | implementation_observation
  authorityRef: stable-public-https-or-urn
  authorizes: portfolio_truth | named_product_truth | observed_usage_only
  observedSubjectId: null
status: approved
evidenceRefs: [stable-evidence-id]
methodologyRef: stable-method-id
dataGrain:
  entity: governed-entity-type
  geography: null
  time: declared-time-window
  unitOfObservation: null
  denominator: null
  aggregation: null
schemaRelease: null
contentRelease: exact-content-release
provenance:
  source: approved-source
  transformation: concise-summary
  owner: accountable-owner
  reviewedAt: ISO-8601
  integrityRef: sha256:64-lowercase-hex
rights:
  status: public | internal | restricted | licensed | unknown
  publicationPermission: true | false
  conditions: null
confidence:
  kind: not_applicable | qualitative | quantitative
  value: null
  explanation: null
limitations:
  - id: stable-limitation-id
    textByLocale:
      th-TH: ข้อจำกัดที่เฉพาะเจาะจงและจำเป็นต่อการตีความ
      en: specific limitation required for interpretation
lastReviewed: ISO-8601
validityBasis: timeless | bounded_interval | until_superseded
validFrom: null
validUntil: null
supersedes: []
publicProjectionEligible: true | false
~~~

Canonical schema and fixtures are `claim-record.schema.json`, `claim-record.example.json` (portfolio protected-line authority) และ `claim-record-rebuild02-usage.example.json` (named implementation observation) `validityBasis: timeless` requires both dates null; `bounded_interval` requires `validFrom` and `validUntil` and the artifact `claimAsOf` must fall inside; `until_superseded` requires a reached `validFrom` and null `validUntil` Measurement/estimate/comparison types trigger stricter value, unit, evidence, method, schema-release and confidence constraints An empty evidence list requires `noPublicEvidenceReason` and can never become a public-eligible projection Changing punctuation/layout MAY keep claimId Changing proposition, authority, scope, denominator, geography, time window หรือ method MUST create new claimId Superseded/withdrawn/expired claim remains auditable but not current Machine projection MUST NOT broaden scope Public/indexable projection requires approved status, at least one stable public evidence reference, public provenance reference, verifiable SHA-256 integrity, current validity at `claimAsOf`, locale text covering every delivered locale exactly, and rights public or licensed with explicit publication permission; unknown/restricted, expired, locale-incomplete or local-only references block it

`portfolio_owner_approval` เท่านั้นที่ authorize protected portfolio wording; record นั้นใช้ `portfolio_truth` และ `observedSubjectId: null` `implementation_observation` ต้องใช้ `observed_usage_only`, ระบุ named observed subject/product/time window และห้าม entity type `protected_brand_line` Rebuild02 observation จึงพิสูจน์ได้เพียงว่าหน้านั้นใช้ข้อความอะไร ณ เวลาที่สังเกต ไม่อาจอนุมัติ portfolio line, product capability หรือ cross-portfolio conformance

Claim ไม่มี asset-style approval receipt และ MUST NOT ใช้ `approvalReceiptRef`/`approvalReceiptSha256` เป็นหลักฐาน claim eligibility Public/eligible claim resolve ผ่าน hash chain เท่านั้น: Build Card `publication.claimManifestRef` + `claimManifestSha256` → manifest `records[].claimId`, `recordRef`, `sha256`, `status`, `publicProjectionEligible` → exact claim-record bytes พร้อม status, rights/publication permission และ scope ที่อนุญาต Manifest hash หรือ record hash ที่ mismatch blocks projection

### 10.3 Initial HTML และ hydrated parity

**DISCOVERY-01 — Initial and hydrated meaning are equivalent.** Public page MUST expose title, primary answer, headings, material claims, evidence links, destinations และ language relationship ใน initial semantic HTML; hydration MUST NOT replace, contradict หรือ hide meaning นั้น

Artifact ที่ claim `artifact_qa_passed` หรือสูงกว่าสำหรับ `web_public` MUST มี `delivery.primaryHtmlBinding` ซึ่งตรงกับ entry `text/html` หนึ่งไฟล์ใน `delivery.files` ทั้ง path, media type และ SHA-256 Validator MUST parse bytes ของไฟล์นั้นจริงและเทียบ `html lang`, unique title/description/robots, canonical, hreflang, Open Graph, strict JSON-LD, visible H1, marked primary answer, exact claim + limitation text, evidence destination, navigation/action label + destination และ visible locale links กับ discovery/structured-data/claim/action contracts Content ที่ hidden, inert, `aria-hidden`, non-rendered, transparent, clipped หรือ visually hidden MUST NOT satisfy visible truth การมี declaration ที่ถูกต้องแต่ final initial HTML ไม่ตรงยังเป็น failure `delivery.webDiscoveryEvidence` MUST bind artifact/build/primary HTML identity และ exact no-script, hydrated-DOM, accessibility-tree, internal-locale-link กับ sitemap evidence; Production probe และ resolved production evidence MUST bind hash ของ primary HTML นี้โดยตรง

Acceptance:

- DISCOVERY-01-A — automated: exact hash-bound delivered primary initial HTML parse แล้วตรง governed lang, unique metadata, canonical/hreflang/social, strict JSON-LD, visible H1, exact marked primary answer, claim/limitation, evidence และ action/navigation destinations; hidden/non-rendered truth ใช้ผ่านไม่ได้; hash-bound no-script, hydrated DOM และ accessibility-tree snapshots ยังรักษา exact primary meaning/destinations และ receipt cite evidence ทั้งสาม
- DISCOVERY-01-B — production: deployed canonical URL ตอบ crawlable success, observed content hash เท่า bound primary initial HTML และมี primary content เดียวกัน

Equivalent หมายถึง approved proposition และ destination เดียว ไม่ต้อง byte-identical Primary H1, first answer, primary proof/action, canonical, locale, robots, structured claims และ evidence scope ห้ามรอ JavaScript Fonts, analytics, embeds, personalization และ motion fail แล้ว core meaning/action ยัง usable `data-primary-answer`, `data-claim-id`, `data-evidence-for` และ `data-action-id` เป็น machine anchors ของ visible contract: ต้องอยู่บน element ที่มองเห็นและ text/target ต้องตรง exact governed projection Source DOM snapshot, accessibility summary หรือ metadata declaration ที่ไม่ได้ bind exact delivered primary HTML/build/observation bytes ไม่ใช่หลักฐานผ่าน

### 10.4 Canonical, locale และ route graph

**DISCOVERY-02 — Canonical, locale, index, and sitemap signals agree.** Indexable page ทุกหน้า MUST มี stable self-canonical URL หนึ่งอัน, explicit language alternates เมื่อมี equivalent, consistent robots/sitemap treatment, working language links และไม่มี automatic language redirect ที่ขัด discovery/user choice

Acceptance:

- DISCOVERY-02-A — automated: canonical, hreflang, HTML lang, robots, social metadata, JSON-LD identity, hash-bound delivered sitemap, visible internal locale links และ hash-bound internal-locale-link snapshot เป็น exact governed graph; sitemap loc set เท่ากับ governed locale route URLs และ receipt cite no-script/hydrated/accessibility/sitemap/internal-locale evidence ครบ
- DISCOVERY-02-B — production: canonical/alternate URLs resolve โดยไม่มี loop, soft error หรือ locale-forcing redirect

Rules:

- one public concept → one canonical route per locale
- canonical ต้อง absolute, final-success และอยู่ใน initial HTML
- internal links กับ sitemap ใช้ canonical routes ไม่ใช้ tracking/preview/redirect URLs; visible internal links และ sidecar snapshot ต้อง bind exact locale/destination set เดียวกัน
- equivalent locale pages มี distinct stable URLs, self-canonical และ reciprocal hreflang
- language control มองเห็นและใช้ ordinary links; missing translation explicit
- x-default MAY ใช้กับ neutral selector ที่เป็นจริงเท่านั้น
- MUST NOT redirect จาก Accept-Language, IP guess หรือ crawler locale อย่างบังคับ Remembered preference MAY เสนอแบบ reversible โดย requested URL ยังเข้าถึงได้
- sitemap ที่ governed contract รวมไว้ MUST เป็น delivered file, hash-bound และมี exact governed locale-route `loc` set; lastmod เปลี่ยนเมื่อ meaningful content/structured-data/link change ไม่ใช่ทุก deployment
- removed route ใช้ intentional redirect, gone หรือ not-found; ห้าม unrelated success page

### 10.5 Page identity, page kind และ structured data

Indexable page MUST มี unique descriptive title, matching description, one primary H1, correct lang, canonical/alternates, route-appropriate index policy และ share metadata ที่ตรง visible page

เลือก human archetype ก่อน แล้ว map ไปยังค่า machine `pageKind` ที่ schema อนุญาตเท่านั้น: `portfolio_home | product_landing | detail | article | index | tool | dataset | search_results | utility`

| Human archetype | Allowed machine `pageKind` | Visible requirement | Typical projection; only when truthful |
|---|---|---|---|
| portfolio home | `portfolio_home` | identity, scope, product architecture, primary routes | page entity includes `WebSite`, `WebPage`, or `CollectionPage`; `Organization` is a separate approved subject when applicable |
| product overview | `product_landing` | product scope, audience, capability boundary, evidence, next action | page entity includes `WebPage`; product/application identity is a claim-bound subject, not an inferred page type |
| methodology | `article` or `detail` | question, input, grain, method, limits, version, example | `Article`/`BlogPosting` for `article`; `WebPage` for `detail` |
| evidence/report | `dataset`, `article`, or `detail` | question, evidence, method, result, limits, source trail | `Dataset`/`DataCatalog`, `Article`/`BlogPosting`, or `WebPage` according to the selected kind |
| collection/index | `index` | purpose, membership, relationships | page entity includes `CollectionPage` or `ItemList` |
| place profile | `detail` | verified geography, boundary, time, grain, evidence | page entity includes `WebPage`; `Place` is a claim-bound subject when verified |
| article/update | `article` | author/publisher/date/body/references | page entity includes `Article` or `BlogPosting` |
| FAQ | `article` or `detail` | genuine visible current questions/answers | governed page type is `Article`/`BlogPosting` or `WebPage`; `FAQPage` is not in this release's type enum |
| interactive tool | `tool` | declared input, output, limitations, privacy and safe action | page entity includes `WebApplication` or `SoftwareApplication` |
| search results | `search_results` | query context, result scope, empty/error state | page entity includes `SearchResultsPage` |
| contact or other utility | `utility` | responsible party, channel, expectation, privacy | page entity includes `WebPage` or `ContactPage` |
| authenticated utility | `utility` | private task/state/evidence | normally no public projection beyond approved shell; if projected, page entity includes `WebPage` or `ContactPage` |

**DISCOVERY-03 — Machine discovery never overstates permission or quality.** Structured data MUST describe visible approved truth และ match page kind Sitemap, robots, crawler access และ optional llms navigation เป็น discovery controls เท่านั้น ไม่ใช่ evidence, permission, licensing, readiness, ranking หรือ quality guarantee

Acceptance:

- DISCOVERY-03-A — automated: initial HTML มี JSON-LD document เดียวที่ root มีเฉพาะ `@context` + `@graph`, context เป็น `https://schema.org`, graph entity set ตรง governed projection และแต่ละ entity มีเฉพาะ exact `@id`, `@type`, `name`, `url`; property/entity/type/claim/permission/readiness/ranking/quality ที่เพิ่มเองเป็น blocking overclaim
- DISCOVERY-03-B — manual: ไม่มี discovery file/crawler directive ถูกอ้างเป็น authorization, evidence หรือ ranking promise
- DISCOVERY-03-C — manual: indexable route passes distinct question, answer/task, material content, evidence and maintained-owner useful-page test
- DISCOVERY-03-D — automated: crawler decisions purpose-separated; optional AI navigation derives canonical public routes only and carries no permission/readiness meaning

Structured data:

- ต้องมี `role: page` เพียงหนึ่ง entity และใช้ `identityBasis: canonical_page`; `url` ต้องเท่า projection `canonicalUrl`, `nameByLocale` ต้องเท่า visible `titleByLocale` และ `types` มีอย่างน้อยหนึ่งค่าที่ตรง strict `pageKind` mapping ในตารางด้านบน
- `role: subject` ทุก entity ใช้ `identityBasis: projected_claim_entity`; `claimIds` ทุกตัวต้อง resolve approved record และ subject `entityId` ต้องเท่า `record.entity.entityId`
- use stable entity IDs and approved identity/claim records; entity ID ห้ามเดาจาก page copy หรือ schema type
- initial HTML JSON-LD ใช้เฉพาะ property ที่ structured projection นี้ govern; ห้ามเติม date, image, status, rating, review หรือ field อื่นแม้ค่าดูจริง จนกว่าจะเพิ่มเข้า active governed schema/projection/visible-truth contract
- omit unknown; never invent rating, review, price, award, audience reach, coverage หรือ capability
- valid syntax ไม่เท่ากับ eligibility/ranking/endorsement
- remain equivalent before/after hydration

สำหรับ `web_public`, `publication.discovery.structuredDataBindings[]` และ `crawlerPurposePolicy` MUST เป็น bundle-local `{ref, sha256, schemaRef}` ที่ resolve active schema/bytes จริง Structured entity names ครบทุก delivered locale และ union ของ `entities[].claimIds` ต้องครอบคลุม projected claim IDs เท่ากันพอดี Crawler policy ต้องตัดสิน `search_indexing`, `ai_search_retrieval`, `model_training`, `archival`, `monitoring`, `agent_action` อย่างละหนึ่งครั้ง; `agent_action` ใช้ได้เพียง `disallow` หรือ `conditional` และไม่เคยเป็น execution authority Active Artifact Manifest contract สำหรับ web MUST project `delivery.metadataProjection` เท่ากับ Build Card `publication.discovery` ทุก field และ MUST prove projection parity จาก parsed `delivery.primaryHtmlBinding` bytes พร้อม hash-bound `webDiscoveryEvidence`; การ drift ของ canonical, locale, visible answer/claim/action/evidence, social preview, JSON-LD entity/property, sitemap/internal locale, structured binding หรือ crawler policy blocks conformance

### 10.6 Useful page test

Route ที่ตั้งใจ index MUST มี distinct user question, distinct answer/task, material visible content, adequate evidence และ maintained owner Keyword, city, audience หรือ query variant อย่างเดียวไม่พอสร้างหน้าใหม่

Reject:

- near-duplicate page factory
- AI rewrite ที่ไม่มี evidence/user benefit ใหม่
- location page นอก approved data coverage
- hidden text หรือ crawler-only claim
- page ที่มีไว้ชี้ machine ไปหน้าอื่นอย่างเดียว
- FAQ variants ที่สร้างเพื่อ coverage โดยไม่มี genuine user need

Similar routes MUST ผ่าน differentiation test หรือ consolidate/redirect/noindex/remove ตามจริง จำนวนหน้า/URL/keyword ไม่ใช่ DS quality target

### 10.7 Crawler purpose, robots และ optional llms navigation

Search discovery, AI search retrieval, model training, archival access, monitoring และ agent action เป็นคนละ purpose Owner ต้องอนุมัติ policy ตาม crawler purpose + route class

- robots is not access control; restricted content ต้องใช้ authorization จริง
- allowing crawler A ไม่ได้ allow crawler B หรือ another purpose
- OAI-SearchBot กับ GPTBot ต้องแยก decision เมื่อเกี่ยวข้อง
- crawler access ห้ามถูกอ้างว่า guarantees indexing, citation หรือ use
- llms.txt MAY เป็น navigation aid ที่ derive canonical public route registry
- llms.txt MUST NOT เป็น ranking factor claim, evidence ledger, rights statement, readiness certificate หรือ sitemap replacement
- optional file ต้อง exclude private, preview, draft, withdrawn, noindex และ rights-restricted entries

### 10.8 Agent-readable และ agent-authorized

**AGENT-01 — Agent-readable does not mean agent-authorized.** Agent interface MUST แยก readable information, available capability, required permission, confirmation, execution และ receipt Agent MUST NOT infer authorization จาก discoverability, UI affordance, credential หรือ absence of denial

Acceptance:

- AGENT-01-A — automated: machine action ทุกอัน hash-bind immutable definition, typed input schema/value, actor-scoped authority, side-effect/confirmation policy และ exact bytes ของ result/receipt schemas; definition, runtime และ Build Card ต้องตรงกันทั้ง `productScope` และ conditional `namedProduct`; runtime state ห้าม redefine authority
- AGENT-01-B — interaction: mutation fixtures block execution เมื่อ actor scope, unexpired authority, input classification, operation, permission, confirmation หรือ external/costly authority class ไม่ตรง; ทุก execution ที่เริ่มแล้วต้องมี signed `pre_start` revocation decision ซึ่ง bind nonce/build/artifact/action/actor สดภายในห้านาทีก่อนเริ่ม และออก attestation ไม่ช้ากว่า `startedAt` ส่วน `succeeded | failed | cancelled` MUST เพิ่ม signed `terminal_boundary` decision ที่มีคนละ `revocationId`, record และ attestation ซึ่งตรวจตั้งแต่ applicable effect-or-terminal boundary จนไม่เกินห้านาทีหลัง boundary; terminal receipt MUST bind decision หลังนี้ ตรง runtime ทั้ง operation/status/timestamps/side effect/result/recovery และมี externally pinned `agent_execution` attestation

Visible UI, keyboard model, accessibility tree และ agent interpretation MUST ใช้ control names, state, order และ outcome เดียวกัน Links navigate; buttons change state/submit Disclosure exposes expanded state Forms expose labels, purpose, required state, error, privacy context และ receipt

Agent Action ใช้ active machine contract โดยตรง ไม่ใช้ prose/YAML นี้เป็น copyable shape ตารางนี้เป็น normative field map; required/conditional shape ที่ exact อยู่ใน JSON schemas และ version/schema identity resolve จาก `release.json`:

| Object | Normative field map; JSON schema remains exact |
|---|---|
| definition binding | Runtime `schemaVersion`, `releaseRef`, `definitionRef`, `definitionSha256`, `definitionSchemaRef`, `actionId` และ Build Card `capabilityConfigRefs.agent_action` bind immutable definition bytes เดียวกัน |
| immutable definition | `schemaVersion`, `releaseRef`, `definitionId`, `artifactId`, `actionId`, `allowedActorClasses`, `productScope` และ conditional `namedProduct`, `operation`, `input.{schemaRef,schemaSha256,schemaId,allowedClassifications}`, `permissionPolicy`, `sideEffect`, `confirmationPolicy`, `resultSchemaRef`, `resultSchemaSha256`, `receiptSchemaRef`, `receiptSchemaSha256`, `errorBehavior`, `recoveryPolicy`; operation taxonomy is `read`, `inspect`, `draft`, `submit`, `create`, `save`, `share`, `download`, `external_handoff`, `confirm`, or `destructive` |
| typed runtime input | `inputs.{schemaRef,schemaSha256,schemaId,valueRef,valueSha256,classification}` bind both schema and value bytes; value MUST validate and classification MUST be allowed by definition and authority |
| runtime scope | `scope.{artifactId,actor,actorClass,productScope,allowedOperation}` และ conditional `namedProduct`; `artifactId`, actor/class และ operation ต้องตรง definition/authority ตาม field ที่มี ส่วน `productScope`/`namedProduct` ต้องตรง immutable definition และ Build Card; named-product scope ห้ามขยายหรือลดใน runtime |
| runtime permission | `permission.{policy,status,authorityRef,authoritySha256,authoritySchemaRef}` binds authority under permission, never at root; permission remains separate from discoverability and credentials |
| authority record | `schemaVersion`, `releaseRef`, `authorityId`, `artifactId`, `actionId`, `authorizedActorId`, `authorizedActorClass`, `inputSchemaRef`, `inputSchemaSha256`, `inputSchemaId`, `allowedInputClassifications`, active `status`, `policy`, `authorizedOperations`, `authorizedSideEffectClasses`, `validity.{notBefore,expiresAt,revocationRef,revocationSha256,revocationSchemaRef,revocationAttestationRef,revocationAttestationSha256}`, `authorizedBy`, `authorizedAt`, `authorityEvidenceRef`; `validity.revocation*` binds the execution-specific `pre_start` decision and detached `agent_revocation` attestation, both of which MUST resolve and match authority, nonce, exact Build Card, artifact, action and actor |
| side effect | runtime/definition/receipt use orthogonal `{class, external, cost, summary, reversible}`; `class` is `none`, `reversible`, `irreversible`, or `destructive`; `external` is boolean; `cost` is `none`, `possible`, or `known` |
| confirmation | `confirmation.{required,state,confirmedBy,confirmedAt}` must match immutable `confirmationPolicy`; consequential execution requires confirmed identity/time before effect |
| execution | `execution.{executionId,executionNonce,buildCardRef,buildCardSha256,terminalRevocationRef,terminalRevocationSha256,terminalRevocationSchemaRef,terminalRevocationAttestationRef,terminalRevocationAttestationSha256,status,startedAt,effectAt,completedAt,resultSchemaRef,resultSchemaSha256,receiptSchemaRef,receiptSchemaSha256,resultRef,errorBehavior,recoveryRef,receiptRef,receiptAttestationRef,receiptAttestationSha256}`; `terminalRevocation*` MUST be null before terminal state and MUST bind a distinct signed `terminal_boundary` decision at terminal state; both result/receipt schema ref/hash pairs MUST equal the immutable definition and resolve declared package schema bytes; `status` is `not_started`, `blocked`, `running`, `succeeded`, `failed`, or `cancelled`; chronology MUST be coherent และ applicable result/recovery/receipt refs+hashes bind every non-null runtime ref Terminal status MUST bind detached `agent_execution` attestation to exact receipt bytes |
| execution receipt | `schemaVersion`, `releaseRef`, `executionId`, `executionNonce`, `buildCardRef`, `buildCardSha256`, `terminalRevocationRef`, `terminalRevocationSha256`, `terminalRevocationSchemaRef`, `terminalRevocationAttestationRef`, `terminalRevocationAttestationSha256`, `artifactId`, `actionId`, `actor`, `operation`, terminal `status`, `startedAt`, `effectAt`, `completedAt`, `classification`, `allowedAudience`, `redactionState`, authority/input/result/recovery refs + hashes, `sideEffect`, `errorCode`, `audienceMessage`, `diagnosticsRef`, `diagnosticsSha256`; subject/actor/authority/input/build/nonce and terminal-revocation bindings MUST match runtime, while operation, status, all three timestamps, side effect, result and recovery MUST be exact runtime parity; `agent_execution` signs the exact receipt bytes and therefore transitively protects the terminal decision binding; diagnostics remain internal and hash-bound when present |

Permission is conditional on execution state: execution that has started or produced an outcome MUST resolve `granted`, except exact `read_only + not_required`; denied/pending/expired cannot run Authority validity และ revocation state MUST remain valid through the applicable boundary Revocation decision ทั้งสอง phase MUST bind execution nonce, exact Build Card hash, artifact, action และ actor: `pre_start` ตรวจในช่วงห้านาทีก่อน `startedAt` และ attestation MUST issue ไม่ช้ากว่า `startedAt`; `terminal_boundary` ต้องมีคนละ `revocationId`, record และ attestation ตรวจตั้งแต่ `effectAt` (เมื่อมี effect) หรือ terminal `completedAt` (เมื่อไม่มี effect) จนไม่เกินห้านาทีหลัง boundary และต้องแสดงว่า authority ยังไม่ถูก revoke ณ boundary Causal order MUST เป็น pre-start decision check ≤ pre-start attestation ≤ authority attestation ≤ `startedAt` และ terminal decision check ≤ terminal-revocation attestation ≤ terminal-receipt attestation ทั้งสอง record ต้องมี detached `agent_revocation` attestation จาก externally pinned operator key ที่ยัง valid/current เมื่อ verify จึงห้าม backdate/back-sign/replay จาก execution อื่น Consequential execution MUST also resolve proportional confirmation no later than `effectAt`, or no later than the terminal boundary when no effect occurred Destructive definition requires `owner_authorized + step_up` Definition และ runtime MUST bind `resultSchemaRef` + `resultSchemaSha256` และ `receiptSchemaRef` + `receiptSchemaSha256` ไปยัง declared package schema bytes เดียวกัน Active schemas never substitute for runtime result/recovery bytes or receipts Succeeded, failed และ cancelled execution always emits a typed, hash-bound receipt ที่ parity กับ runtime terminal state รวม terminal-revocation binding และมี detached `agent_execution` attestation จาก externally pinned operator key

Exact copyable contracts/fixtures are `agent-action.schema.json`, `agent-action.example.json`, `agent-action-definition.schema.json`, `agent-action-definition.example.json`, `agent-action-authority.schema.json`, `agent-action-authority.example.json`, `agent-action-revocation.schema.json`, `agent-action-revocation.example.json`, `agent-action-input.example.schema.json`, `agent-action-input.example.json` และ `agent-action-receipt.schema.json` Build Card `capabilityConfigRefs.agent_action` MUST bind the definition with `{ref, sha256, schemaRef}` whenever `agent_action` is declared

Full `agent-action-receipt` เป็น internal execution record เท่านั้น: `allowedAudience` MUST เป็น `internal_preview` หรือ `internal_operational` Public/client output MUST NOT embed, attach หรือ link full receipt, authority, typed input, diagnostics หรือ internal recovery record งานสำหรับผู้ใช้อาจแสดงเฉพาะ outcome, progress, error และ next/recovery action ที่ได้รับอนุญาต แยกจาก internal receipt และเขียนด้วยภาษาผู้ใช้

Public page MUST NOT expose private mutation merelyเพื่อดู agent-ready Agent execution ต้อง respect idempotency, duplicate-submission protection, consequence-aware confirmation และ audit log ตาม risk

### 10.9 Discoverability release gates

| Gate | Automated minimum | Human/production minimum |
|---|---|---|
| DISC-G01 route integrity | status/canonical/internal links/redirect loops | hierarchy serves audience |
| DISC-G02 locale integrity | lang/canonical/hreflang reciprocal graph | translations answer same question |
| DISC-G03 initial-hydrated parity | governed-field diff | primary meaning/task equivalent |
| DISC-G04 claim/evidence | all IDs resolve | scope/limits understood |
| DISC-G05 structured truth | syntax + field mapping | type describes real page |
| DISC-G06 crawl policy | robots/meta/auth/sitemap agree | purpose owner approves |
| DISC-G07 accessible interpretation | landmarks/names/states/focus | keyboard/screen-reader critical paths |
| DISC-G08 action safety | destination/result/receipt | consent/privacy/consequence suitable |
| DISC-G09 freshness truth | dates resolve releases | latest/live wording justified |
| DISC-G10 public-only projection | restricted/draft absent | no sensitive inference leak |

---

## 11. Output-format architecture

### 11.1 Semantic source, faithful renderings

ทุก production output MUST resolve approved semantic artifact, exact DS tuple, one primary format pack, zero or more compatible capabilities/overlays, locale, claim/evidence/identity/rights records และ QA profile

Design System package นี้ส่ง semantic format-kit/target contracts และ governed reference implementation records; ไม่ได้อ้างว่ามี native template ทุกชนิดอยู่ใน package `requiredImplementationControls` ของ kit คือ checklist ของสิ่งที่ implementation ต้องควบคุม ไม่ใช่รายการ template bytes ที่ package อ้างว่าส่งมาแล้ว งานปลายทางแต่ละชิ้น MUST bind selected format-kit record, target-profile record และ artifact-resolved format-implementation record ผ่าน `delivery.implementationBindings`; bind exact audience-delivered bytes ทุกไฟล์ใน `delivery.files`; bind native editable/source asset ที่ใช้จริงทุกชิ้นใน `delivery.implementationSourceBindings` โดย `audienceDelivered: true` ได้ต่อเมื่อ ref/hash/media type เดียวกันอยู่ใน `delivery.files`; และ bind fixture reports/receipts ครบ exact set ที่ resolved record และ target กำหนด ก่อน `artifact_qa_passed` web/app MUST มี `component_source`; document/PDF/deck/social MUST มีทั้ง `editable_source` และ `export_preset` ที่ resolve และ hash ตรง ห้ามอนุมานว่า semantic kit description หรือ reference example คือหลักฐานของ native bytes

**FORMAT-PARITY-01 — Meaning and action survive format translation.** Format translation MUST preserve content truth, hierarchy, evidence boundary, action outcome, locale status และ release identity พร้อมแทน unsupported interaction ด้วย governed static/structural equivalent; visual sameness ไม่ required

Acceptance:

- FORMAT-PARITY-01-A — automated: equivalence map resolve identity, navigation, bookmark, CTA, motion, evidence และ receipt roles ที่ใช้ และทุก CTA destination binding ใช้ direct/static-equivalent presentation ตรง format
- FORMAT-PARITY-01-B — manual: side-by-side review ไม่พบ claim scope, decision meaning, primary path หรือ action promise เปลี่ยน
- FORMAT-PARITY-01-C — automated: triggered dataviz/map overlay resolves analytical, geographic, evidence, accessibility, fallback and export fields in host format

### 11.2 Equivalence map

| Semantic role | Web | Interactive product | Flow document | PDF | Presentation | Social static |
|---|---|---|---|---|---|---|
| identity | approved asset หรือ governed live text | approved asset หรือ governed live text | approved asset หรือ governed native text | approved asset หรือ tagged/extractable governed text | approved asset หรือ governed text บน title/closing | approved channel asset หรือ governed text; never reconstruct logo |
| global navigation | semantic navbar | product/task nav | ecosystem/property route directory or related-destination group | ecosystem/property route directory or related-destination group | opening/closing ecosystem-property route group | omit; one destination cue |
| side bookmark | anchored page index | stable task/section index | page-heading outline/TOC | page-anchor bookmarks/visible contents | page-section agenda/marker | omit |
| primary CTA | typed destination + direct control | typed destination + direct control/recovery/receipt | typed working link หรือ instruction | typed working link + visible destination หรือ instruction | typed visible link/verified QR+text/instruction | typed destination cue; no fake control |
| motion | role-gated enhancement | state/cause feedback | final state/sequence | final state/frames | presenter sequence + static equivalent | final state |
| evidence | visible disclosure/source page | in-context evidence/data receipt | note/appendix | tagged note/bibliography | source line/appendix | compact cue + destination/sidecar |
| hover/focus detail | focus/disclosure equivalent | keyboard disclosure | visible note/glossary | annotation/legend | visible note according to mode | caption/destination |
| receipt | runtime state/reference | result/recovery/durable receipt | metadata/version record | final-byte validation | version/source slide | publication sidecar |
| icon | approved FILL 0 glyph | approved FILL 0 glyph | vector/font-safe + text equivalent | embedded vector | editable approved vector | approved outline vector; never logo substitute |

เมื่อ source มีทั้ง global navigation และ side bookmark งาน document/PDF/deck MUST แยกด้วยชนิดและระดับของ destination แบบ deterministic: global group รับเฉพาะ ecosystem/property route หรือ external destination และใช้ `staticExposure: destination_cue`; page-index group รับเฉพาะ page/page_local anchor จาก heading จริง โดย document ใช้ `toc`, PDF ใช้ `pdf_bookmark` และ deck ใช้ `deck_section_marker` Destination ID หนึ่งแสดงได้เพียงกลุ่มเดียว แต่ละกลุ่มรักษา source-relative order และ exact id/kind/level/group/target/locale labels หาก format มี navigation container เดียวให้แบ่งสองกลุ่มด้วย heading ที่ชัด ห้ามรวม order, ทำ route ให้ดูเป็น anchor, ทำ anchor ให้ดูเป็น route หรือทำรายการซ้ำ

#### 11.2.1 Seven reference records and one resolved record per artifact

v0.9.1 มี `reference_example` เจ็ดรายการ ครบหก primary formats โดย interactive app แยก browser และ native runtime แต่ reference เหล่านี้เป็นตัวอย่างโครงสร้างที่ complete สำหรับ context ที่บันทึกไว้เท่านั้น ไม่ใช่ universal preset และห้ามเลือก copy ไปใช้กับงานจริงโดยไม่ resolve ใหม่ ใช้ `(formatProfile, runtime)` เพื่อหา starting point:

| Output | Reference example only |
|---|---|
| public web · browser | `format-implementation.example.json` |
| interactive app · browser | `format-implementation.app-browser.example.json` |
| interactive app · native | `format-implementation.app-native.example.json` |
| flow document · static | `format-implementation.document-flow.example.json` |
| fixed PDF · static | `format-implementation.pdf-fixed.example.json` |
| presentation deck · static | `format-implementation.deck-presentation.example.json` |
| social static · static | `format-implementation.social-static.example.json` |

งานปลายทาง MUST สร้างและ hash-bind format-implementation v1.6 record ใหม่ที่มี `recordKind: artifact_resolved`, `recordId: implementation.<artifactId>.<artifactBuildId>` และ `artifactBinding` ตรง exact Build Card bytes `resolutionContext` MUST เท่ากับ primary/secondary experience profiles, capabilities, side-bookmark selection และ `composition.componentIds` ของ Build Card `requirements` MUST resolve identity typography, exact asset IDs, component contracts, rules, common/experience/format/capability/target/kit/accessibility tests และ platform portability fixtures จากงานชิ้นนั้นพอดี

Component contract ทุกตัวใน resolved record MUST มาจาก reference record ที่ตรง exact `(formatProfile, runtime)` หรือจาก `format-packs.json.componentContractTemplates` ที่ตรง exact format/runtime/component ID เท่านั้น สำหรับ document/PDF/deck ที่เลือก `component.bookmark.side.01` ให้ใช้ template ของ format นั้นเพื่อได้ TOC/PDF-bookmark/deck-section-marker behavior ที่ถูกต้อง ห้ามแก้ reference record ให้กลายเป็น preset, ห้ามยืม template ข้าม format และห้ามสร้าง contract เองเพื่อให้ component ID ผ่าน หาก component ใด resolve ไม่ได้หรือจำนวน/ลำดับ contract ไม่เท่ากับ `composition.componentIds` ต้อง block promotion

Browser ใช้ `authoringPlatform: browser` และห้ามมี native mapping งาน native/static non-browser MUST เลือก `authoringPlatform: macos | windows` หนึ่งค่า แล้วใช้ identity typography binding, native font mappings และ portability fixtures ของ platform เดียวกันทั้งหมด ห้าม mix platform หรือ copy macOS example ไปใช้ Windows Machine MUST block `reference_example` ที่ถูกใช้ใน `artifact_qa_passed` / `production_verified`, record ID ที่ไม่ deterministic, Build Card hash drift, experience/component/asset mismatch และ portability fixture ที่ขาด

Legacy key ใน Artifact Manifest ยังคงชื่อ `delivery.implementationBindings.preset` เพื่อ compatibility แต่ค่าที่ bind คือ resolved format-implementation record ไม่ใช่ reusable preset Reference และ resolved records ไม่ใช่ใบรับรองว่างานผ่าน และไม่ใช่คำกล่าวว่ามี native authoring template ทุกชนิดอยู่ใน package

### 11.3 Public web pack

**WEBFMT-01 — Public web output remains semantic and resilient.** Public web MUST provide semantic initial HTML, responsive layout, keyboard/touch operation, no-script primary meaning, stable URLs, discoverability signals, share preview และ production verification

Acceptance:

- WEBFMT-01-A — automated: required rules pass supported viewport, locale, theme, no-script และ reduced-motion fixtures
- WEBFMT-01-B — production: deployed routes, assets, metadata, forms/actions และ monitoring receipts pass

Required outputs: semantic initial HTML, responsive + print styles, canonical/locale graph, page-kind projection, social preview, no-script core meaning และ deployed-origin receipt Third-party embeds deferred และมี failure fallback

### 11.4 Interactive product pack

**APPFMT-01 — Interactive product output exposes system state.** Interactive product MUST preserve task state, loading, success, empty, partial, stale, permission และ error meaning Navigation/actions direct, undoable เมื่อเหมาะ และ receipted เมื่อ consequential

Acceptance:

- APPFMT-01-A — interaction: declared states understandable/operable ด้วย keyboard, touch และ assistive technology
- APPFMT-01-B — manual: consequential action มี confirmation, progress, result, recovery และ receipt proportional to risk

Build Card MUST declare role, authorization, privacy, data-as-of, schema/method release, filters, geography, denominator และ unit เมื่อ applicable Export ต้อง freeze/record selected state; ห้าม sitemap user-specific/private URLs

### 11.5 Flow document pack

**DOCFMT-01 — Flowing documents preserve structure and working references.** Flow document MUST ใช้ real heading hierarchy, readable pagination, working links, labelled figures/tables, source notes, accessible reading order, document properties และ version identity

Acceptance:

- DOCFMT-01-A — automated: heading/list/table/figure/link/language/title/reading-order structure pass
- DOCFMT-01-B — visual: no clipped content, accidental blanks, stranded headings หรือ unreadable notes

Use native styles, lists, tables, captions, links, footnotes/endnotes และ cross-references ห้าม manual spaces/line breaks เป็น layout หรือ screenshot text เป็นเนื้อหาหลัก CTA becomes labeled working link with outcome Motion becomes reading order, key frames หรือ final state

### 11.6 Fixed PDF pack

**PDFFMT-01 — Fixed PDF preserves visual and semantic access.** PDF MUST preserve tagged reading order when required, bookmarks for long documents, selectable text where possible, embedded/approved fallback fonts, working links, alt text, page identity, evidence references และ print-safe contrast/margins

Acceptance:

- PDFFMT-01-A — automated: metadata, pages, fonts, links, tags, bookmarks, extraction และ integrity pass as applicable
- PDFFMT-01-B — visual: all pages inspected at screen/print size ไม่มี clipping, substitution, low contrast หรือ broken hierarchy

CTA uses a working link and a human-readable destination A QR code MAY supplement, but MUST NOT replace either the working link or the human-readable destination Final produced PDF ต้องตรวจจริง ไม่อาศัย authoring file preview Image-only PDF fail เมื่อ structured text feasible

### 11.7 Presentation pack

**DECKFMT-01 — Presentation decks express one idea per scene.** Presentation MUST preserve one primary idea/reading path per slide, distance-legible sizing, section progress, source cues, speaker-independent key meaning, editable structure when required และ equivalent สำหรับ action/motion

Acceptance:

- DECKFMT-01-A — visual: montage, distance legibility, overflow, contrast และ narrative continuity pass
- DECKFMT-01-B — automated: titles, sources, links/QR, alt text, fonts และ hidden-slide state validate

Declare audience, room/screen, duration, presenter/self-guided mode, locale และ dimensions Conclusion อยู่ใกล้ chart/map/evidence Dense evidence moves to governed appendix โดย proposition ไม่เปลี่ยน Meaning ห้ามอยู่ใน entrance animation หรือ speaker notes อย่างเดียวเมื่อ self-guided

### 11.8 Static social pack

**SOCIALFMT-01 — Social outputs are self-contained and destination-aware.** Static social ใน v0.9.1 MUST ใช้ `target.social.square.1080.01` ขนาด 1080 × 1080 อัตราส่วน 1:1 เท่านั้น, communicate one approved message โดยไม่พึ่ง animation, preserve safe area, identify source/destination, use approved identity implementation และ legible at feed size Release นี้ไม่มี extension registry; social ratio/target อื่นจึง unknown และ MUST block

Acceptance:

- SOCIALFMT-01-A — automated: output resolve square target เดียวที่ governed; 1080 × 1080, 1:1, format, size, color profile, safe-area และ metadata pass โดยไม่มี undeclared target/extension
- SOCIALFMT-01-B — visual: square feed-size, center-crop และ safe-area fixtures preserve message, identity, evidence cue และ destination

ทุก `social_static` artifact MUST มี publication sidecar ที่ validate ด้วย `social-sidecar.schema.json` v1.2 และ Artifact Manifest MUST bind exact `socialSidecarBinding` ref/hash/schema กับ creative path/hash เดียวกัน Sidecar MUST record artifact/build, claim/evidence, locale, campaign, rights, expiry, destination และ output-clarity state; campaign ID/channel/expiry MUST เท่ากับ Build Card `social_context` และ action MUST เท่ากับ available `experience.primaryActionRef` ที่มี `priority: primary` ใช้ `social-sidecar.example.json` เป็น shape เท่านั้น ไม่ใช่ข้อมูลอนุมัติสำหรับงานใหม่ `builtAt`, promotion time และ production observation time เมื่อ applicable MUST อยู่ภายในทั้ง campaign window และ rights-validity window Destination verification MUST สำเร็จด้วยวิธีที่ตรง destination kind, bind exact evidence bytes และยังสดไม่เกิน declared TTL ซึ่ง MUST ไม่เกิน 24 ชั่วโมงทั้ง ณ promotion และ production boundary Visible `destinationCue` MUST derive แบบ deterministic: route/contact ใช้ target ตรงตัว; HTTPS external/download/form ตัดได้เฉพาะ `https://` โดยคง canonical host, non-default port, path, query และ fragment ทั้งหมด Creative bytes MUST decode เป็น canvas 1080 × 1080 ตาม target profile ไม่ใช่เชื่อ metadata declaration อย่างเดียว

Creative MUST มี general audience-content inspection หนึ่งใบตาม `delivery.contentInspections[]` และ specialized social visible-copy inspection แยกอีกหนึ่งใบ ทั้งสอง bind creative subject/method/time เดียวกันแต่ห้ามใช้ record ชนิดหนึ่งแทนอีกชนิด Specialized record MUST ใช้ hash-bound OCR + visual review ที่ normalize ด้วย algorithm เดียวกับ sidecar แล้วเท่ากับ governed visible-copy projection พอดี: exact claim, material limitation ทุกข้อ, evidence cue ทุกอัน, CTA label/outcome และ destination cue ห้ามขาด เปลี่ยน หรือเพิ่ม visible overclaim/uncategorized claim CTA บน creative เป็น destination cue ที่ derive ตามกฎด้านบน ไม่ใช่ fake button หาก canonical cue ยาวเกิน layout ให้เปลี่ยน action ไปยัง approved short destination ก่อนผลิต ห้ามย่อ cue ให้ชี้คนละ target Sidecar ไม่แทน visible truth: หาก denominator/time/geography/source จำเป็นต่อการตีความ สิ่งนั้น MUST อยู่บน creative ด้วยขนาดอ่านได้ มิฉะนั้น artifact fail

### 11.9 Dataviz และ map overlays

Dataviz/map เป็น overlays บน primary format ไม่ใช่ format ที่แทน web/PDF/deck

**DATAVIZ-01 — Data visualization preserves analytical meaning.** Chart, score, comparison หรือ quantitative diagram MUST declare question, measure, unit, denominator, time, geography, grain, transform, uncertainty, schema release, claim/evidence IDs, scale และ accessible alternative Color ไม่เป็น carrier เดียว Truncated axis ต้องมีเหตุผล Observation แยก interpretation และ incompatible series ห้าม normalize เพื่อความสวย

Acceptance:

- DATAVIZ-01-A — automated: required overlay fields, scale, non-color cues, claim/evidence IDs and accessible data alternative resolve
- DATAVIZ-01-B — manual: form, scale, baseline, ordering, annotation, uncertainty and conclusion preserve meaning in format

**MAP-01 — Maps preserve geography and coverage truth.** Map overlay MUST declare geography ID, boundary source, purpose, covered area, grain, time, unit, schema release, attribution/rights, projection เมื่อมีผล, no-data/out-of-scope/low-confidence/selected/focus states และ nonspatial alternative Export records viewport/zoom/filters/data receipt It MUST NOT imply unsupported coverage, treat missing as zero or generalize product classification

Acceptance:

- MAP-01-A — automated: fields/states/attribution/alternative/export receipt resolve
- MAP-01-B — manual: boundary, context, legend, orientation, uncertainty and coverage remain truthful/readable

ทั้งสอง MUST NOT normalize incompatible products, cities, releases หรือ geographic grains เพื่อให้ chart สวย หาก resolve compatible basis ไม่ได้ ให้ incompatibility เป็นผลลัพธ์

---

## 12. Machine and AI authoring contract

AI MAY plan, resolve, compose, adapt และ preflight แต่ MUST ทำงานจาก Build Card + approved registries + exact release tuple และ MUST แยก unknown จาก inferred/approved

### 12.1 Required AI plan output

ก่อนสร้าง artifact AI MUST emit หรือบันทึก:

1. resolved authority และ product layer
2. one job, audience, dominant object, first AHA และ primary action
3. primary format pack + triggered capabilities
4. included claim/evidence IDs และ incompatibilities
5. identity/font/icon/media assets ที่ approved
6. navigation/bookmark/CTA representation
7. motion roles พร้อม user benefit หรือ explicit no-motion decision
8. locale state และ native review need
9. automated/manual/production gates
10. assumptions, unresolved fields และ blocking unknowns

AI MUST NOT invent approval, asset, data, proof, capability, locale equivalence, schema compatibility หรือ production pass หาก required authority missing ให้บันทึก blocker ใน Build Card/manifest และหยุดที่ internal preview ห้ามแสดง blocker, placeholder หรือ workflow explanation นั้นเป็นส่วนหนึ่งของ public/client output

### 12.2 Deterministic resolution

- exactly one primary output.formatProfile
- common rules always apply
- format required rules add automatically
- capability rules add only from explicit declarations/truth
- stricter applicable rule wins; conflict requires owner record
- MUST/MUST NOT failure blocks; unmet SHOULD is advisory and does not affect conformance unless a separate MUST requires a decision record
- format adaptation changes representation, not proposition/permission
- conformance computed from receipts, not confidence score

### 12.3 Human–machine parity

**PARITY-01 — Human and machine rules remain one contract.** ทุก normative clause MUST อยู่ภายใน scope ของ stable rule block; human master กับ machine catalog MUST มี structural rule ID/title block และ acceptance-ID containment หนึ่งต่อหนึ่ง และการเปลี่ยน meaning MUST เปลี่ยน normative release ไม่ใช่ drift ฝั่งเดียว Automated parity พิสูจน์ได้เฉพาะโครงสร้างนี้ ไม่ได้พิสูจน์ criterion, method, trigger, scope หรือ Thai/English semantic equivalence

Acceptance:

- PARITY-01-A — automated: ทุก catalog rule ID/title มี normative master block เดียว, master ไม่มี extra rule block นอก catalog และ catalog acceptance ID ทุกตัวอยู่ใน matching rule block; pass นี้เป็น structural/acceptance-ID parity เท่านั้น
- PARITY-01-B — manual owner review: English machine requirement/acceptance กับ Thai/English human rule มี obligation, criterion, method, meaning, trigger, explicit absence of an exception path และ scope เดียวกัน; automated pass ห้ามใช้แทน bilingual semantic approval

Owner-recorded bilingual semantic review ของ release นี้เป็นคำตัดสิน authoritative ว่า Thai human rule และ English machine projection มี meaning เดียวกัน Validator ตรวจได้เฉพาะ rule ID, title และ acceptance-ID structure; ผลผ่านของ validator MUST NOT ถูกอ้างว่าได้ตรวจความหมายหรือคุณภาพภาษาแล้ว การแก้คำ normative ภาษาไทยหรืออังกฤษหลัง owner review—even เมื่อตั้งใจให้เป็น editorial—ทำให้ semantic review เดิมใช้ไม่ได้ และ MUST มี owner-recorded bilingual semantic review ใหม่ก่อน freeze/release

Machine-friendly ไม่ได้แปลว่าทุกอย่าง automate ได้ Visual hierarchy, Thai native quality, evidence interpretation, context-specific contrast และ user benefit ต้องมี human review

---

## 13. Experience profiles และ capability triggers

Experience profile ตอบว่า artifact กำลังช่วยใครในสถานการณ์ใด Format pack ตอบว่าจะส่งมอบผ่านสื่ออะไร ทั้งสองแกนห้ามรวมกัน

**PROFILE-01 — Experience profile is distinct from output format.** Build Card MUST resolve exactly one primary experience.profile และ one output.formatProfile Experience profile describes audience/job; format describes representation Secondary experience profile MAY add requirements but MUST NOT introduce a competing primary job

Acceptance:

- PROFILE-01-A — automated: Build Card/manifest มี allowed primary experience + format อย่างละหนึ่งและ known rule sets
- PROFILE-01-B — manual: profile, audience, one job, first AHA and completion coherent in format

| Profile | Primary job | Required emphasis | Typical format; not a limit |
|---|---|---|---|
| portfolio_orientation | เข้าใจ Landometer architecture และเลือกเส้นทาง | shared/product boundary, protected identity, destination clarity | web, deck, document |
| methodology_learning | เข้าใจ question → input → method → limit → use | evidence, grain, version, constructive example | web, document, PDF, deck |
| product_orientation | เข้าใจ product scope/capability และ next step | named-product truth, audience, proof, availability | web, deck, social |
| evidence_report | ตรวจ claim/result และ source trail | claim records, uncertainty, compatible schema, as-of | web, document, PDF, deck |
| interactive_task | สำรวจ/ตัดสิน/กระทำภายใต้ state และ permission | system states, filters, recovery, receipt | app, web shell, export formats |
| editorial_place_story | เข้าใจบริบทโดยไม่ทำให้ illustration เป็น proof | narrative, media roles, evidence cues, locale | web, document, social |
| adoption_change | นำวิธีหรือ product ไปใช้โดยรู้ effort/limit | sequence, role, readiness, action, support | deck, document, web |
| campaign | จำหนึ่ง message แล้วไป durable destination | one approved message, crop, expiry, source cue | social, web landing, deck |

**CAPABILITY-01 — Capabilities resolve explicit rule packs.** Declared capability ทุกอัน MUST resolve known rule set, required fields, fallback and test matrix Unknown capability/unsupported format blocks resolution Side effect, authorization, autoplay, public indexing and nonessential motion default off until approved truth enables `format-packs.json.overlays` MUST cover capability enum ทั้ง 16 ค่าพอดีแบบไม่ซ้ำและไม่ขาด

Acceptance:

- CAPABILITY-01-A — automated: every Build Card capability maps exactly once to an overlay; overlay มี nonempty unique `compatibleFormatProfiles`, `requiredRuleIds`, `requiredFields`, `testMatrix` และมี `configRefContract` + `fallback`; selected format ต้อง compatible, every rule ID มีจริง และ hash-bound resolved capability config มี required field ครบ
- CAPABILITY-01-B — manual: capability is supported by approved product truth and does not broaden evidence, permission or product scope

Capability triggers:

| Capability ID | Trigger | Adds |
|---|---|---|
| claims | material factual claim | EVIDENCE-01 + CLAIM-MACHINE-01 |
| evidence | evidence disclosure/source trail | EVIDENCE-01 |
| data_table | material tabular data | evidence + accessible structure + format parity |
| data_visualization | chart/score/quantitative diagram | DATAVIZ-01 overlay and accessible data alternative |
| map | geographic display/spatial claim | boundary, coverage, legend, nonspatial alternative |
| form | collects/submits user input | CTA, A11Y, privacy/security states |
| authentication | identity gates access | unauthorized/expired/step-up states |
| permissions | capability differs by authorization | permission/denial/recovery states |
| sharing | creates share destination/payload | CTA, security, format parity |
| download | produces file | CTA, security, final-byte receipt |
| external_effect | sends/changes/publishes/charges | confirmation, permission, recovery, receipt |
| carousel | looped visual sequence | CAROUSEL-01 semantic-cycle contract |
| social_feed | third-party changing provider content | SOCIAL-FEED-01 state/freshness/provider contract |
| motion | beneficial motion beyond necessary feedback | MOTION-01..03 and lifecycle matrix |
| agent_action | machine may execute, not merely read | AGENT-01 action contract and adversarial fixtures |
| telemetry | sends governed measurement | privacy/security + QA purpose/retention |

Build Card `capabilities` และ key ของ `capabilityConfigRefs` MUST เท่ากันพอดี ทุก binding ต้อง resolve ไฟล์ bundle-local ด้วย exact SHA-256 และ fragment ที่อ้างต้องมี direct field ครบตาม `overlay.requiredFields` ของ capability นั้น Claims/evidence bindings ต้องตรง publication claim-manifest ref/hash เดียวกัน Nested claim, evidence, boundary, form submission/privacy, recovery, share object, download resource, social-feed source และ export-receipt refs MUST resolve ตามชนิดของ field ไปยัง bound claim graph, declared destination, stable HTTPS/URN resource หรือ exact bundle bytes; download เพิ่ม exact byte size, file name และ SHA-256 หาก ref ใด dangling การ resolution MUST block หาก overlay ไม่รองรับ selected format หรือ config ขาด required field การ resolution MUST block แม้ rule mapping จะมีอยู่

Defaults are conservative: no external effect, no agent action, no autoplay, no motion enhancement และ no public indexing until declared by authority

---

## 14. QA และ release — zero-exception conformance

### 14.1 Receipt-based conformance

**QA-01 — Conformance is receipt-based.** Conformance MUST computed จาก applicable automated, manual, visual, interaction, accessibility และ production checks ที่มี dated receipts v0.9.1 ไม่รับ exception reference ใน artifact conformance: Build Card `qa.exceptionIds` และ Artifact Manifest `resolution.exceptionRefs` MUST เป็น `[]` ทั้งคู่

Acceptance:

- QA-01-A — automated: applicable required check ทุกอันมี current passing receipt และไม่มี blocking failure
- QA-01-B — manual: arrays ทั้งสองเป็นศูนย์และไม่มี MUST หรือ MUST NOT deviation ถูกนำเสนอว่า conforming; SHOULD recommendations are reported separately when useful

ผลของ resolved acceptance/layer/gate ใช้ `pass`, `fail` หรือ `not_tested` เท่านั้น; `not_tested` ไม่สามารถนับเป็น pass กฎที่ไม่ใช้ระบุแยกใน `resolution.nonApplicableRuleIds` และต้องอธิบาย trigger/owner ตาม machine contract Aggregate score ห้ามซ่อน failed MUST

Conformance receipt MUST เป็น bundle-local, validate ด้วย `conformance-receipt.schema.json` และ bind subject/file bytes ด้วย SHA-256 Manifest layer หรือ gate claim ที่เป็น `pass` MUST มี receipt ref + hash ที่ resolve ได้; คำว่า pass ใน prose หรือ dashboard ไม่พอ ก่อน claim `artifact_qa_passed` ทั้ง discovery/readability/action MUST `pass`, resolved non-production acceptances ทั้งหมด MUST `pass`, และ receipt ของ OUTPUT-CLARITY-01-A MUST list exact `delivery.files` set พร้อม SHA-256 ครบทุกรายการ ก่อน claim `production_verified` resolved production acceptances ทั้งหมด MUST `pass` และ receipt ของ OUTPUT-CLARITY-01-B MUST cover exact set และ hashes ชุดเดียวกัน; coverage ที่ขาดหรือเกินล้วน blocks level claim

แต่ receipt ที่ signed แยกชิ้นยังห้ามใช้ replay หลัง Build Card หรือ governance เปลี่ยน `artifact_qa_passed` และ `production_verified` MUST bind `validation.promotionSnapshot` ที่ validate ด้วย `promotion-snapshot.schema.json` และมี detached `promotion_snapshot` attestation จาก externally pinned operator key Snapshot เป็น non-circular record ที่ bind exact Build Card bytes, canonical Artifact Manifest promotion projection, artifact-resolved format-implementation record, social sidecar เมื่อมี, implementation source + lineage receipts/attestations, final outputs และ receipt/attestation ทุกใบของ phase นั้น Snapshot ที่ขาด/เกิน, hash drift หรือใช้กับ artifact/build อื่น MUST block promotion

Approval, conformance, promotion, confirmation, execution และ source-lineage result ที่ใช้เลื่อนสถานะหรืออนุญาตการกระทำ MUST มี detached Ed25519 attestation ที่ validate ด้วย `verification-attestation.schema.json` v1.1 และ bind exact purpose, subject ref/hash/media type, issuer, key และเวลา Signature MUST verify ด้วย purpose-authorized, unrevoked, unexpired key ที่ caller-controlled policy pin exact `trustStoreId`, `issuerId`, `keyId` และ public-key SPKI SHA-256

- package ไม่ bundle trust anchor ที่ให้อำนาจตัวเอง `SHA256SUMS.txt` cover authoritative package files ทุกไฟล์ ยกเว้น checksum file เองและ detached `package-root.attestation.json` เพื่อหลีกเลี่ยง circular hash; validator MUST verify root signature ด้วย external `package_release` trust store + external caller-pinned policy ก่อนเชื่อ release หรือทำ downstream validation
- downstream artifact promotion/conformance, source lineage, agent confirmation และ terminal execution MUST ใช้ separate `operator_external` trust store + matching pinned policy ที่ผู้ตรวจควบคุมและได้รับจากช่องทางอิสระจาก artifact bundle
- การวาง trust JSON ไว้นอก bundle หรือเป็น sibling file อย่างเดียวไม่สร้าง authority; policy key fingerprint ต้องตรงทุก key และ key ที่ revoked/expired ณ current verification time MUST fail หากต้องยอมรับประวัติหลัง key ถูก revoke ต้องมี independent trusted timestamp contract ซึ่ง v0.9.1 ยังไม่ให้ exception path
- key, trust store หรือ trust policy ที่ artifact สร้างและแนบมาเอง MUST NOT ให้อำนาจรับรอง artifact นั้น

`rule-catalog.json.resolvedAcceptancePolicy: every_resolved_acceptance_must_pass` ร่วมกับการวาง OUTPUT-CLARITY-01 และ QA-01 ใน common rule set ทำให้ OUTPUT-CLARITY-01-A/C และ QA-01-A เป็น non-waivable receipts ที่ต้อง `pass` ก่อน `artifact_qa_passed`; OUTPUT-CLARITY-01-B ต้อง `pass` เพิ่มก่อน `production_verified` และห้ามเปลี่ยนเป็น `not_applicable`

### 14.2 Common gates

| Gate | Required evidence |
|---|---|
| QG-01 authority | Build Card refs resolve; no candidate overrides approved truth |
| QG-02 layer/evidence | shared vs product-specific, claim scope, rights, compatibility checked |
| QG-03 identity | approved logo roles/assets, protected wording and fonts verified |
| QG-04 semantic visual | color/type/icon/layout/media tokens and roles resolve |
| QG-05 primary path | one job/AHA/action/completion understandable |
| QG-06 state/access | names, roles, focus, alternatives, target, zoom, locale and failure states pass |
| QG-07 action truth | label, destination/effect, availability, permission, result and recovery pass |
| QG-08 format parity | navigation/bookmark/motion/evidence/receipt equivalents resolved |
| QG-09 privacy/security | public bytes/metadata/logs/receipts cross no boundary |
| QG-10 final artifact | actual deployed/exported/distributed bytes inspected and hashed/versioned |
| QG-11 audience clarity | visible bytes/metadata ไม่มี dependency ที่ยังแก้ไม่เสร็จ, placeholder หรือข้อความขั้นตอนผลิต/อนุมัติภายใน; ข้อจำกัดจริงอยู่ใกล้เรื่องที่จำกัดและใช้ plain language |

### 14.3 Required test matrix

Apply only states relevant to the artifact, but MUST document omissions:

- viewport/canvas: minimum, nominal, maximum และ intermediate stress width
- locale: Thai, English และ explicit missing translation
- theme: light/dark/print when offered
- input: keyboard, touch, pointer, assistive tech
- zoom/reflow: supported high zoom and text spacing
- runtime: browser ใช้ initial, hydrated, no JS, slow, offline, interrupted และ restored history/BFCache; native ใช้ launch, active/background, interruption, cancellation, restoration และ view disposal; static ใช้ editable/open/export/render lifecycle ตาม format
- data/state: idle, loading, success, empty, partial, stale, permission, error
- motion: browser ใช้ normal, reduced, observer unavailable, hidden-tab/focus/deep-link/history-restoration; native ใช้ normal, platform reduced motion, background/interruption/cancellation/restoration/view disposal, complete final state และ native view/accessibility order; static/presenter ใช้ final-frame/static-equivalent fixture ตาม format
- media/provider: delayed, blocked, failed, unsafe crop
- output: editable source, final export, share preview, print/room/feed size
- production: canonical route, CDN/assets, forms/actions, monitoring/freshness

### 14.4 No artifact exception channel in v0.9.1

Active machine contracts enforce `qa.exceptionIds: []` and `resolution.exceptionRefs: []` with `maxItems: 0` ไม่มี prose record, owner note หรือ approval message ใด bypass เงื่อนไขนี้ได้ ถ้าจำเป็นต้องรองรับ deviation แบบ typed ในอนาคต ต้องออก normative Design System release ใหม่ที่เพิ่ม schema, authority, expiry/removal test และ migration อย่างชัดเจน ก่อนหน้านั้น artifact ที่มี deviation ยังเป็น failed/blocked/internal preview ตามผลกระทบ ไม่ใช่ conforming output

### 14.5 Release activation และ artifact production boundary

v0.9.1 นี้ active เพราะ owner approval, approver/time/evidence ref, `effective: true`, immutable machine package ใหม่, exhaustive migration, structural ID/title/acceptance parity พร้อม manual bilingual semantic owner review, OUTPUT-CLARITY-01 และ package checksum gate ถูกบันทึกใน release เดียวกัน Candidate `v0.9.1-mp0-draft` ยังอยู่เป็น historical evidence และไม่มีสิทธิ์ override release นี้

Activation ของ Design System ไม่ pre-certify งานปลายทาง งานแต่ละชิ้นต้องผ่าน gate ตามสิ่งที่ใช้จริงก่อน `artifact_qa_passed` หรือ `production_verified`:

1. exact role-scoped identity/media/font/icon asset approval และ byte hash
2. selected format-kit record, target-profile record และ artifact-resolved format-implementation record; exact final delivery bytes; complete required fixture reports/receipts; และ native editable/source asset ที่ใช้จริงทุกชิ้น—ทุกอย่าง bundle-local โดย source bytes bind ผ่าน `delivery.implementationSourceBindings` และเฉพาะ source ที่ส่งให้ audience เท่านั้นจึงซ้ำอยู่ใน `delivery.files`
3. Thai/Latin typography, navigation/bookmark/CTA, accessibility, motion/fail-open และ format-parity checks ที่ applicable
4. claim/evidence/rights/product-boundary checks
5. deployed-origin หรือ final-export verification ตาม format
6. OUTPUT-CLARITY-01 automated, manual และ production receipts

ถ้า gate ใดไม่ครบ สถานะของ artifact คือ blocked หรือ internal preview ห้ามส่ง public output พร้อมข้อความให้ผู้ใช้รับทราบว่าทีมยังทำไม่เสร็จ Machine package validation อนุมัติเพียงความสอดคล้องของ release package; ไม่ใช่ production pass ของ artifact อื่น

Package นี้มี semantic kit/target contracts และ `reference_example` เจ็ดรายการเพื่อเป็น starting point ตาม format/runtime; resolver ต้องสร้าง `artifact_resolved` record จาก Build Card จริง ไม่ได้เลือกรายการ reference เป็น universal preset และ package ไม่ได้รับรองว่ามี reusable native template/source bytes สำหรับทุก authoring tool งานปลายทางจึงต้องแนบหลักฐาน bytes ของสิ่งที่ใช้จริงเอง

---

## 15. Migration from v0.9.0-r7

`migration-ledger.json` เป็น machine ledger แบบ exhaustive: predecessor normative rule ID ทั้ง 79 อันต้องมี disposition หนึ่งค่าเท่านั้น (`retained`, `superseded_by`, `deprecated_alias`, `moved_to_product_pack` หรือ `removed_with_owner_reason`) Count นี้ไม่นับ CORE/SC/P0/P1 ซึ่งเป็น checklist, acceptance หรือ severity labels ไม่ใช่ normative rule IDs Unmapped, duplicate หรือ target ที่ไม่มีจริง block promotion ตารางด้านล่างเป็น human summary ไม่ใช้แทน ledger

### 15.1 Retained without normative value change

- truth/evidence/product-boundary first
- protected brand lines และ one headline role
- core brand/foundation/state colors in color-srgb-05
- script-aware font families และ semantic type roles
- spacing, radius, container, gutter และ breakpoint scales
- one job, dominant object, first AHA, primary action, clean completion
- accessibility, resilience, privacy, permissions, external-effect receipts
- dataviz/map semantic evidence discipline
- Build Card → profiles/capabilities → QA resolution model

### 15.2 Superseded or clarified

| v0.9.0 condition | v0.9.1 decision |
|---|---|
| release identifiers repeated and drifted | release.json is sole tuple source; RELEASE-01 |
| Color Set ID carried unrelated motion change | independent color/motion/icon/type/layout set IDs |
| FILL 1 permitted for selected icon | FILL 0 in every state; ICON-01 |
| global Thai display line-height 1.16 treated broadly | deprecated as universal; size/script fixtures required; TYPE-01 |
| web deterministic kit stronger than other formats | six primary format packs + equivalence/receipts |
| discovery focused on technical presence | discovery/readability/action separated; stable claims and parity |
| navigation pattern not normative | NAV-01, NAV-02 and BOOKMARK-01 |
| CTA styling stronger than outcome taxonomy | CTA-01 outcome record + CTA-02 label integrity |
| generic reveal timing/selectors | explicit Riddim roles, semantic exclusions, fail-open lifecycle |

### 15.3 Explicitly rejected carry-ins

| Candidate | Reason |
|---|---|
| 22px calm target or wake-first click | not a direct usable target; breaks stable operation |
| invisible coordinate click-forwarding | pointer-only proxy, semantics/focus/agents diverge |
| symbol variant accepted at 2.01:1 | risk is not a design token; use approved contrast-safe variant |
| wordmark rebuilt from symbol + Arvo | identity reconstruction lacks asset authority |
| FILL 1 current bookmark icon | conflicts with outline-only system; state has other channels |
| perpetual 1.09s CTA flicker | attention theft and reduced-motion risk; no durable user benefit |
| automatic locale redirect | hides stable route and user choice |
| numeric URL/page count as success | volume does not prove usefulness/evidence |
| llms.txt as ranking/readiness | optional navigation only |
| valid schema as rich-result promise | syntax validity does not guarantee platform outcome |

---

## 16. Learning cases — Example, non-normative

**Status of this whole section: Example — non-normative.** Cases A–E and both rejected cases illustrate how existing rules can be applied. They do not create requirements, defaults, acceptance criteria, evidence, product facts or exception paths. Project truth and obligations come only from the resolved normative Build Card, authority, claims, assets, artifact-resolved format-implementation record and rule catalog; copied case content establishes none of them.

Case metadata shared by every example: `sourceVersion: v0.9.1-mp7`; `mediaStatus: conceptual_no_product_evidence`. Each case lists the active rule blocks it illustrates as `ruleAuthority`; those blocks—not the case—remain authoritative.

### Example A — Good: methodology page becomes a PDF

`ruleAuthority: FORMAT-PARITY-01, PDFFMT-01, EVIDENCE-01`

Problem: web page has navbar, side bookmark, evidence disclosures and Read the method CTA

Apply:

1. keep same methodology, claim/evidence IDs and locale proposition
2. global navbar ecosystem/property routes → related-destination group ที่แยกจากโครงหน้า; page-heading anchors/side bookmark → heading hierarchy, TOC และ native PDF bookmarks โดยไม่ทำซ้ำ destination เดียวกันสองระบบ
3. essential disclosure → visible tagged note/appendix
4. CTA → working labelled link + readable destination
5. motion → final state
6. verify final PDF tags, order, Thai glyphs, links, evidence trail and metadata

Pass because representation changes but truth, identity, evidence and action intent do not

### Example B — Good: interactive Location view becomes a board deck

`ruleAuthority: FORMAT-PARITY-01, DECKFMT-01, DATAVIZ-01, MAP-01`

Freeze filters, geography, time, denominator, schema release and data-as-of Carry exact claim/evidence set Put conclusion beside chart/map Move method details to governed appendix Convert hover/motion to visible annotation Record deck export as a new output of the same governed snapshot

Pass because audience cannot mistake frozen result for live or infer an unstated filter

### Example C — Good: calm navbar after scroll

`ruleAuthority: NAV-01, NAV-02, BOOKMARK-01, CTRL-01, A11Y-01`

Header may reduce height/background prominence, but the desktop header keeps no more than four controls total including brand; every control retains its direct 44 × 44 semantic target, name, destination and focus geometry Side bookmark current state remains visible without filled icon Deep-link target lands below header

Pass because calmness comes from surface/hierarchy, not removal of operability

### Example D — Good: social card derived from an evidence report

`ruleAuthority: SOCIALFMT-01, CLAIM-MACHINE-01, EVIDENCE-01`

Choose one approved claim with visible scope/date/unit Add compact evidence cue and durable destination Use approved identity/crop Create Thai and English variants independently Sidecar carries claim/evidence IDs, rights and expiry

Pass because static format stays self-contained while the destination preserves depth

### Example E — Incompatibility is a correct result

`ruleAuthority: COMPARE-01`

Land และ Living show similarly named scores but schema, unit or grain differs Do not normalize for visual convenience Recompute under one approved schema or state incompatible beside the chart and in machine record

Pass because consistency means consistent truth, not forced comparability

### Rejected example — AI-discoverability page factory

`ruleAuthority: DISCOVERY-01, DISCOVERY-02, DISCOVERY-03, AGENT-01, EVIDENCE-01`

Generate hundreds of thin city/query pages, auto-redirect locale, add FAQ schema + llms.txt, allow crawler and call system agent-ready

Reject: page volume adds no user value; scope/evidence blur; locale route unstable; schema/navigation file cannot fix thin content; crawler allow is not permission; no authorization/result/receipt model exists

Correct path: smaller governed page inventory driven by real questions, approved coverage, stable claims, explicit locale routes, truthful projections, accessible controls and separate layer receipts

### Rejected example — animated proof cards

`ruleAuthority: MOTION-01, MOTION-02, MOTION-03, A11Y-01`

Hide every card and chart until it enters viewport, nest stagger, sweep CTA forever and leave source HTML hidden

Reject: proof/action can disappear with JS/lifecycle failure; reading/focus position becomes unstable; motion has no unique user benefit

Correct browser path: source final state, explicit supporting roles only, first proof/action never hidden, finite approach, reduced-motion final state and observer-failure fixture

---

## 17. Package inventory และ machine contract

| File | Role |
|---|---|
| Landometer Design System v0.9.1.md | human normative master |
| release.json | release tuple, status, set IDs, authority boundary |
| build-card.schema.json | v0.9.1.12 author/resolver input contract; selected/omitted side-bookmark state binds exactly to the governed bookmark component inventory and navigation direct-target value/unit binds exactly to selected browser or native target profile |
| build-card.example.json | canonical cross-field Build Card fixture; conformance is established by the package validator, not by the filename |
| artifact-manifest.schema.json / artifact-manifest.example.json | v3.2 immutable artifact contract: selected implementation bindings, runtime-unit-bound interactive navigation plus exact static global/page-index exposure projection, exact final bytes, three universal layer results, output clarity, receipt bindings และ signed promotion-snapshot binding |
| conformance-receipt.schema.json / conformance-receipt.example.json | bundle-local hash-bound QA receipt with detached attestation binding; OUTPUT-CLARITY-01-A at `artifact_qa_passed` and OUTPUT-CLARITY-01-B at `production_verified` each cover the exact `delivery.files` set and hashes |
| claim-record.schema.json / example | active locale-complete claim contract with typed validity basis, locale-complete limitations and current-at-`claimAsOf` rules |
| claim-manifest.schema.json / example | claim index, record refs และ byte hashes |
| claim-evidence-capture.schema.json / example | immutable evidence-capture record for the observed bytes/time behind a claim, with detached attestation |
| agent-action.schema.json / agent-action.example.json | v1.5 scoped agent-action contract: permission, side effect, confirmation, nonce/build-bound execution, distinct pre-start + terminal-boundary revocation decisions และ signed terminal receipt |
| agent-action-definition.schema.json / agent-action-definition.example.json | v1.3 immutable action definition and active result/receipt schema bindings |
| agent-action-authority.schema.json / agent-action-authority.example.json | v1.3 hash-bound actor, operation, policy, side-effect, validity and active signed pre-start revocation authority |
| agent-action-revocation.schema.json / agent-action-revocation.example.json | v1.2 phase-typed nonce/build/artifact/action/actor-bound revocation decision; authority binds `pre_start`, terminal runtime/receipt bind a distinct `terminal_boundary` decision checked within five minutes after the applicable boundary |
| agent-action-input.example.schema.json / agent-action-input.example.json | hash-bound typed input schema and value fixture |
| agent-confirmation-receipt.schema.json | signed confirmation record required when the action policy calls for confirmation |
| agent-action-receipt.schema.json | v1.3 full nonce/build/terminal-revocation-bound succeeded/failed/cancelled execution receipt with detached `agent_execution` attestation; internal-preview/internal-operational only, never a public/client payload |
| action-contracts.schema.json / action-contracts.example.json | typed permission, progress, terminal-result and recovery contracts plus a complete copyable bundle; Build Card actions separately carry destination, outcome, consequence and confirmation intent |
| capability-config.schema.json | typed configuration contract for every capability overlay |
| disclosure-authority.schema.json | purpose-bound field-class authority for nonordinary DS-reference or provenance output |
| structured-data-projection.schema.json / structured-data-projection.example.json | visible-truth structured entity/claim projection bound to canonical page identity |
| crawler-purpose-policy.schema.json / crawler-purpose-policy.example.json | exact six-purpose crawler decisions; discovery never grants agent action |
| social-sidecar.schema.json / social-sidecar.example.json / social destination + visible-copy inspection examples | v1.2 social-static publication contract bound to exact 1080 × 1080 creative bytes, Build Card campaign and primary action, deterministic destination cue, active campaign/rights windows, kind-correct destination verification fresh at promotion and production, separate general content inspection, and normalized OCR+visual visible-copy parity |
| asset-registry.schema.json / asset-registry.json | active role-scoped asset authorization contract; eligibility is decided per exact role and artifact |
| asset-approval-receipt.schema.json / asset-approval-receipt.json | typed asset approval receipts bound by `approvalReceiptRef` + `approvalReceiptSha256` |
| Landometer-Logo-TransparentBG.png | packaged immutable identity source evidence; not a substitute for role/surface approval |
| nine text-font WOFF2 files + two Material Symbols Rounded WOFF2 subsets | owner-approved v0.9.1 font/icon roles with exact byte hashes |
| six OFL/Apache license text files | packaged license receipts for the shipped font/icon bytes |
| migration-ledger.schema.json / migration-ledger.json | exhaustive predecessor-rule disposition contract and ledger |
| rule-catalog.json | v1.6 machine-readable rules and acceptance mappings with exact side-bookmark component-inventory binding, explicit browser/native navigation semantics, and browser/native/presenter MOTION-03 branches |
| format-packs.json | v1.5 format resolution, runtime-specific navigation target units, exact static global/page-index projection, exact-format selected-static-bookmark component templates, browser/native/presenter motion tests, equivalence map, and exact one-per-capability overlay closure for all 16 Build Card capabilities |
| format-kits.schema.json / format-kits.json | semantic format-production contract with `requiredImplementationControls`; these controls state what downstream implementation must govern and do not assert that reusable native template bytes ship in this package |
| target-profiles.schema.json / target-profiles.json | cross-format canvas, unit, safe area, type and fixture projections |
| format-implementation.schema.json / seven `format-implementation*.example.json` files | schema v1.6 for `reference_example` and `artifact_resolved` records; seven shipped references cover web browser, app browser/native, document, PDF, deck and social static; promoted work derives a new Build-Card-bound record with exact context, platform, component, asset, rule, test, accessibility and portability contracts |
| source-lineage-receipt.schema.json | exact editable/component/template/export source → process → final-output lineage contract |
| verification-attestation.schema.json / verification-trust-store.schema.json | v1.1 detached Ed25519 attestation and purpose-scoped external trust-store contracts, including package root, promotion and agent revocation/execution purposes |
| verification-trust-policy.schema.json | v1.0 caller-controlled policy that pins exact trust-store ID, issuer, key ID and public-key SPKI SHA-256 |
| promotion-snapshot.schema.json | non-circular signed promotion record binding Build Card, canonical manifest projection, resolved implementation, optional social sidecar, sources/lineage, outputs and receipts |
| SHA256SUMS.txt / package-root.attestation.json / `*.attestation.json` | externally signed whole-package checksum root plus exact package authority/approval examples; trust anchors are deliberately external and are not bundled |
| verify-attestation.mjs / sign-verification-attestation.mjs | deterministic verification/signing tools; package and downstream verification require independently supplied trust store + pinned policy pairs |
| tokens.v0.9.1.json | governed v0.9.1 summary projection and immutable refs to the complete packaged color registry |
| color-srgb-05.tokens.json / scales.json / delivery.json / tokens.css | raw retained color-srgb-05 provenance, copied byte-for-byte and hash-verified; lifecycle/delivery wording embedded in these predecessor bytes is historical only, and both canonical paths and exact byte hashes are forbidden in audience `delivery.files` |
| color-srgb-05.production.css | audience-safe, color-only production CSS projection; no lifecycle, rule, package, source-path, legacy type/layout/motion metadata |
| render-color-production.mjs | deterministic renderer for the atomic production color CSS projection |
| validate-v0.9.1.mjs | package integrity plus structural master/catalog rule-ID, title, and acceptance-ID coverage; it does not approve bilingual meaning |
| README.md | use, validation, resolved-only delivery and authority boundaries |
| SHA256SUMS.txt | final file integrity receipt; generated after all edits |

Rule catalog is the authoritative machine projection of the numbered rules in this master. Automated validation fails structural rule-ID/title/acceptance-ID drift but does not decide whether Thai and English mean the same thing. Owner-recorded bilingual semantic review is authoritative for that decision. Any normative wording change invalidates the prior review and requires a new owner semantic review before release.

### 17.1 Artifact manifest contract

ใช้ schema identity ของ Artifact Manifest จาก `release.json.schemaIds` และใช้ `artifact-manifest.schema.json` bytes ปัจจุบันเป็น machine contract ห้ามคัดลอก version, schema ID หรือ hash จาก prose `artifact-manifest.example.json` เป็น canonical `package_validated` fixture; จะได้สถานะ pass เมื่อ validator รับรองเท่านั้น ตารางนี้เป็น human field map ไม่ใช่ copyable template

| Object | Required contract |
|---|---|
| root | `schemaVersion`, `release`, `artifact`, `resolution`, `representation`, `delivery`, `validation` |
| release | `releaseRef`, canonical `releaseTupleSha256` |
| artifact | `id`, `buildCardRef`, exact `buildCardSha256`, immutable `artifactBuildId` |
| resolution | `experienceProfile`, exact Build Card `secondaryExperienceProfiles`, `formatPack`, `targetProfileRef`, `capabilityPacks`, `resolvedRuleIds`, resolver-derived `resolvedTestIds`, `nonApplicableRuleIds`, exact `exceptionRefs: []`; resolved + non-applicable rule IDs partition the catalog exactly, while resolved tests exactly cover common, experience, format, capability, target, kit, accessibility and selected-platform portability requirements in that deterministic order |
| representation | exact Build Card `navigation`, including every destination's scoped `current: none | page | location`; interactive non-empty navigation has exactly one page route and at most one location anchor, interactive side bookmark has exactly one location, while static formats and `mode: none` never invent current state; exact `actionIds`, `claimIds`; non-empty claims require `claimManifestRef`, `claimManifestSha256`, `claimAsOf`; `localeStates` equals Build Card `locale.states` exactly; and `outputClarity` |
| outputClarity | อยู่ใต้ `representation`; `mode: resolved_only`, `deliveryAudience`, `disclosurePurpose`, `internalGovernanceVisible: false`, blocker refs, zero placeholder count, material-limitation refs; nonordinary purpose adds `disclosureAuthorityRef` + `disclosureAuthoritySha256`, production adds residue-scan receipt |
| delivery | exact audience-delivered `files`; exact one-per-file `contentInspections` with subject hash/media type, format-bound method, dated result and hash-bound evidence—DOCX/PPTX/PDF additionally bind page/slide kind and count, `every_page_or_slide` coverage, combined extraction+OCR+visual method, explicit image-only/outlined-text review, deterministic combined-text hash และ hash-bound raster per unit; `implementationBindings` for selected format-kit record, target-profile record and artifact-resolved format-implementation record; `implementationSourceBindings` for every editable source, template, export preset, style map, component source, or other governed production file actually used, with `audienceDelivered: true` exactly when the same ref/hash/media type is also in `files`; ID-bound `assetBindings`; audience `metadataProjection`; and audience `accessibilityProjection` whose reading order, semantic/interaction/text-layout states, capability-derived alternatives/motion, contrast minima, fixture IDs และ fixture-report summary exactly match `format-packs.json.accessibilityProjectionContract`—static social therefore cannot claim headings, landmarks or controls verified; web additionally binds the exact delivered primary initial document through `primaryHtmlBinding` and `webDiscoveryEvidence` for no-script, hydrated DOM, accessibility tree, internal locale links and sitemap; parsed/evidenced surfaces must equal Build Card discovery/claim/action contracts exactly; social additionally binds time-valid campaign/rights/destination evidence and normalized exact-copy OCR+visual parity; non-web uses `format_metadata` with exact format/primary locale; `files` rejects both canonical paths and exact hashes of all four raw color registries; every asset binding matches the Build Card asset and artifact-owned registry entry, while an approved asset's receipt grant matches exact `assetId`, `role`, `sha256`, `allowedFormatProfiles`, `allowedSurfaceRoles`, `allowedAudiences`, `publicationPermission`, `licenseOrPermission`, `fallback`, and role-specific `glyphs` or `altOrTextEquivalent` |
| validation | package/artifact/production phase states, computed conformance level, three universal layer results, `resolvedTestResults` that exactly cover the phase's `resolvedTestIds` with unique bundle-local evidence bound to test ID, artifact build, governed method, pass result, observation time, and exact criterion text + SHA-256 derived from common, experience, format, capability, target, kit, accessibility and selected-platform portability registries in deterministic order (generic self-authored summaries do not pass), and dated acceptance/gate receipts keyed by catalog acceptance ID with criterion assertion + hash; at `artifact_qa_passed` discovery/readability/action, every resolved non-production test and acceptance are `pass`, required accessibility and portability fixture receipts exactly match the artifact-resolved implementation record, and OUTPUT-CLARITY-01-A covers the exact `delivery.files` set/hashes and cites every content-inspection evidence file; at `production_verified` every resolved production test and acceptance also passes, the returned web bytes equal `primaryHtmlBinding.sha256`, and OUTPUT-CLARITY-01-B covers that same exact file/inspection set |

Phase states use `pending`, `passed`, `failed` หรือ `not_applicable`; resolved acceptance/layer/gate results use `pass`, `fail` หรือ `not_tested` เท่านั้น การไม่ใช้กฎอยู่ใน `resolution.nonApplicableRuleIds` ไม่ใช่ layer/gate result ก่อน `artifact_qa_passed` ทั้ง discovery/readability/action MUST เป็น required + `pass` และ resolved non-production acceptance ทุกอัน MUST `pass`; information/read-only artifact พิสูจน์ action layer ด้วยขอบเขตที่ซื่อตรง ไม่ใช้ `not_applicable` `fail` หรือ `not_tested` blocks artifact-QA promotion

`releaseTupleSha256` MUST คำนวณจาก tuple fields และ canonicalization algorithm ที่ active validator บังคับ แล้ว bind ค่าที่ได้ใน manifest ห้ามคัดลอก digest จาก prose หรือจาก artifact อื่น

### 17.2 Current catalog coverage

The machine catalog includes and validates:

GOV-01, AUTHORITY-01, LAYER-01, COMPARE-01, EVIDENCE-01, OUTPUT-CLARITY-01, AHA-01, BRAND-01, LOGO-01, COLOR-01, SURFACE-01, TYPE-01, ICON-01, LAYOUT-01, CTRL-01, THEME-01, ASSET-DELIVERY-01, PROFILE-01, CAPABILITY-01, PARITY-01, NAV-01, NAV-02, BOOKMARK-01, CTA-01, CTA-02, MOTION-01, MOTION-02, MOTION-03, A11Y-01, CLAIM-MACHINE-01, DISCOVERY-01, DISCOVERY-02, DISCOVERY-03, AGENT-01, SECURITY-01, DATAVIZ-01, MAP-01, WEBFMT-01, APPFMT-01, DOCFMT-01, PDFFMT-01, DECKFMT-01, SOCIALFMT-01, FORMAT-PARITY-01, MEDIA-01, COMPONENT-01, CAROUSEL-01, SOCIAL-FEED-01, QA-01 และ RELEASE-01

---

## 18. Primary external references

External references inform this release but do not supersede owner-approved Landometer truth, product evidence or the effective DS package

- Google Search Central, AI features and your website: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central, multilingual sites: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Google Search Central, canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central, sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central, structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central, JavaScript SEO: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- RFC 9309 Robots Exclusion Protocol: https://www.rfc-editor.org/rfc/rfc9309
- OpenAI Publishers and Developers FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- W3C WAI-ARIA disclosure pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- W3C disclosure navigation example: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C animation from interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- W3C target size minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html

---

## 19. Definition of Done

An artifact is done only when:

1. exact release, profile, format and capability configs resolve through ref + hash + schema bindings
2. authority, product layer, claim manifest/record hashes, evidence, rights and artifact-owned asset registries resolve
3. one job, primary path, AHA, action and completion are clear
4. approved identity, color, type, icon, layout and media roles are used
5. navigation/bookmark/CTA direct semantics pass where applicable
6. motion has user benefit, static equivalent and lifecycle/reduced-motion pass
7. discovery/readability/action remain separate and truthful, and all three universal layers are required + `pass` with bundle-local receipts at artifact QA
8. selected kit, target and artifact-resolved format-implementation record; required fixture receipts; exact final delivery bytes; every required web discovery surface; every Office/PDF rendered page or slide; and every native editable/source asset actually used are resolved and hash-verified through their distinct delivery/source bindings while target-format semantic parity passes
9. privacy/security and product/evidence boundaries pass
10. every resolved applicable MUST/MUST NOT acceptance passes through bundle-local receipt hashes; non-applicable rules are declared only in `resolution.nonApplicableRuleIds`; OUTPUT-CLARITY-01-A covers the exact `delivery.files` set and hashes from `artifact_qa_passed`, and OUTPUT-CLARITY-01-B covers the same set before `production_verified`
11. generated machine record agrees exactly with the visible artifact; hidden governed truth, JSON-LD overclaim, action/evidence destination drift, missing locale/sitemap evidence, or an uninspected rendered unit blocks completion
12. Build Card/Artifact Manifest declare delivery audience/purpose; audience-visible bytes/metadata contain only resolved audience meaning, with no internal approval/release text, placeholder or explanation of unfinished production work; any nonordinary DS/provenance disclosure has hash-bound authority and material limitations remain specific and proximal
13. production verification is not claimed before it occurs

This Design System succeeds when different teams and AI systems can make different compositions for different formats while preserving the same truth, identity, evidence boundary, action promise and quality bar.
