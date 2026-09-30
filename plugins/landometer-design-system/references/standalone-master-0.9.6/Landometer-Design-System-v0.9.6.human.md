# Landometer Design System v0.9.6

**Normative · Standalone · Human + Machine**

เอกสารฉบับนี้รวมข้อกำหนดปัจจุบันของ Landometer Design System 0.9.6 ไว้ในไฟล์เดียว ทั้งเนื้อหาสำหรับคน กฎสำหรับเครื่อง token และตารางสีจริง ใช้อัปโหลดเป็น Project Source ได้โดยไม่ต้องอ่าน master รุ่นก่อนหรือประกอบ patch เพิ่ม โครงสร้าง Brand, Visual foundations, Navigation, Actions, Motion, Evidence, Output formats และ QA สืบต่อจาก master เดิม โดยปรับข้อกำหนดที่เปลี่ยนไว้ในหัวข้อของมันแล้ว

| Identity | Exact value |
|---|---|
| DS version | `0.9.6` |
| Document ID | `lds-0.9.6-landometer-standalone-r1` |
| Release | `v0.9.6-owner.1` |
| Standalone document | `standalone-0.9.6-r1` |
| Color set | `color-srgb-09` |
| Categorical registry | `landometer-series-10-v8` |
| Approval | Owner-approved 1 October 2026 |
| Signature | Unsigned owner distribution; no cryptographic 0.9.6 release attestation |

เริ่มงาน: เลือกขอบเขต portfolio/product → บันทึก Build Card ตาม §2 → ใช้กฎของ format และ capability ที่มีจริง → อ่านค่าจาก machine payload ในไฟล์นี้ → ตรวจงานที่ส่งจริงตาม §14 และ §19. Brand voice, protected wording, official identity, typography, foundations และ atmosphere ทั้งเจ็ดสูตรยังอยู่ครบ งานที่ล็อกรุ่นเก่าไว้อย่างชัดเจนคงใช้รุ่นนั้นจนได้รับอนุญาตให้ย้าย

คำว่า `machine.*` ในเอกสารนี้อ้างถึง JSON payload ตอนท้าย **ของไฟล์เดียวกัน** ไม่ใช่ไฟล์ที่ต้องอัปโหลดเพิ่ม Schema references resolve ด้วย `$id` ที่อยู่ใน `machine.schemas`; immutable schema ID อาจสะท้อนรุ่นที่สร้าง schema นั้น โดยไม่ได้เปลี่ยน DS release ของงาน โลโก้ ฟอนต์ ไอคอน และ runtime เป็น binary/code assets: ใช้ URL, role และ SHA-256 จาก `machine.assetFiles` เพื่อรับ bytes จริงเมื่อผลิตงาน ห้ามสร้างภาพหรือฟอนต์แทนจากคำอธิบาย

ชื่อ `*.schema.json` ในหัวข้อต่อไปนี้หมายถึง schema ที่รวมอยู่ใน `machine.schemas` โดยตรง ชื่อ `*.example.json` หรือ reference-example ที่กล่าวถึงเป็น optional learning references: ไม่เป็นข้อกำหนดให้โหลดไฟล์เก่า ไม่เป็น evidence/approval และไม่จำเป็นต่อการสร้าง record จาก embedded schema งานจริงต้องใช้ค่ากับหลักฐานของงานนั้นเอง

เมื่อเครื่องมืออ่าน Source คืนข้อความเพียงบางส่วน ให้ค้นต่อด้วย stable rule ID ของข้อกำหนด หรือ `scaleId` + `theme` และ field path ที่ต้องใช้ เช่น `machine.analyticalScales.scales` → `density.capita` / `dark` → `classes["7"]`. ตรวจค่าจากผลค้นที่อ่านได้จริงและอ้างตำแหน่งนั้น; ห้ามอ้างว่าอ่านครบทั้งไฟล์จากผลที่ถูกตัด หรือเดาค่าในส่วนที่เครื่องมือยังไม่คืนมา

---

## 0. Release Card และข้อกำหนดของ v0.9.6

### 0.1 Release tuple เดียว

`machine.release` เป็น source ของ release identity; `machine.document` ระบุ identity และ provenance ของเอกสาร standalone นี้ กฎและค่าในหัวข้อปัจจุบัน resolve ไปยัง payload ที่รวมไว้แล้ว ผู้ใช้ไม่ต้องจัดลำดับ master กับ addendum เอง

| Registry | Identifier | Current contract |
|---|---|---|
| Color | `color-srgb-09` | exact approved per-theme LUTs, warm density families, current dark categorical values |
| Motion | `motion-riddim-approach-03` | approach timing + identity lifecycle + six motifs and measured carriers |
| Icon | `icon-rounded-outline-01` | interface icons; identity icon sets remain separate |
| Typography | `type-script-aware-02` | approved script-aware fonts and role scales |
| Layout | `layout-cross-format-01` | responsive/format composition and owner-selected visual constraints |

**RELEASE-01 — Release identifiers have one source.** Release, schema, set, kit และ package identifiers MUST resolve จาก `machine.release` และ embedded contracts; published identities are immutable. Canonical schema `$id` MUST include the schema version and MUST NOT be reused for an incompatible contract. Generated artifacts MUST NOT contain conflicting current release identifiers. This document uses DS `0.9.6`, release `v0.9.6-owner.1`, color set `color-srgb-09` and document `standalone-0.9.6-r1`; document consolidation does not relabel historical signed subjects.

Acceptance:

- RELEASE-01-A — automated: human master, embedded catalog/contracts, current tokens and artifact binding resolve the same release; unchanged schema `$id` identities remain exact and locally resolvable in the embedded schema collection
- RELEASE-01-B — manual: provenance/change record identifies each consolidated rule, schema or value projection and its migration effect without claiming an unperformed approval or signature

**GOV-01 — Release state is truthful and audience-bounded.** Artifact manifests, receipts and sidecars MUST bind exact `releaseRef` and a canonical tuple hash derived from the active contract. `machine.release` records owner-approved status, approver, date and unsigned signature status. Approval does not certify every artifact or activate every account. Internal approval workflow, rule/schema identifiers and package state MUST NOT appear on an ordinary audience-facing product surface. A DS-reference or provenance document MAY show only the identifiers/facts necessary for that purpose under its recorded disclosure authority; unresolved dependencies, debug details, placeholders and local/source paths remain prohibited on audience-facing output.

Acceptance:

- GOV-01-A — automated: release binding resolves `v0.9.6-owner.1`, owner/date, color set and `signedRelease: false`; artifact tuple/hash resolves that exact release, without inherited or fabricated 0.9.6 signing claims
- GOV-01-B — manual: ordinary audience-facing surfaces contain no internal approval workflow or irrelevant machine identifiers; DS/provenance disclosure stays within its declared purpose and actual evidence

### 0.2 Version policy

| Identifier | เปลี่ยนเมื่อ |
|---|---|
| DS version | normative behavior, requirement, acceptance gate, profile หรือ format contract เปลี่ยน |
| Document revision | consolidation/editorial/provenance packaging เปลี่ยนโดยไม่เปลี่ยน approved normative meaning |
| Schema version | field, enum, structure หรือ validation semantics เปลี่ยน |
| Set ID | ค่า หรือ semantic ownership ภายใน set เปลี่ยน |
| Machine package | generated package, validator, schema projection หรือ packaging เปลี่ยน |
| Artifact build | implementation ของงานหนึ่ง build เปลี่ยน |
| Product content/data release | product-owned evidence หรือ content เปลี่ยน แยกจาก DS |

Retained identity clarification from LDS 0.9.5: Revision r3 explicitly records the owner’s 30 September 2026 clarification: wordmark colour is flexible, including per-letter colours; gray is optional; the official logo is permitted on readable light and dark backgrounds. It corrects the inherited blanket recolour wording and prevents motif carrier restrictions from being misapplied to official logos. This is an owner-directed policy clarification, not an editorial-only or cryptographically signed change; DS 0.9.5, its approved colour sets, original assets and unchanged schema identities remain in place.

Normative change MUST NOT hide in an editorial revision. `latest` is a discovery convenience, never a receipt identity. Preserve exact published source bytes and their signatures; historical signatures apply only to their original subjects. Package integrity, final-artifact quality and account/team activation are distinct evidence.

### 0.3 One-file reading and source provenance

Read current rules in their normal chapters. The machine block contains current policies, the stable rule catalog, tokens, exact 41-stop LUTs, format/component/motif contracts and schema resources. Historical source hashes and the deterministic consolidation record are provenance in Appendix A, not extra reading or installation dependencies. The complete shared foundation is `Landometer-Design-System-v0.9.6.md`; it needs no earlier LDS master or overlay. For product-scoped work, load this same complete LDS foundation plus the separate current product Add-on. An Add-on contains product-specific rules and depends on the shared foundation; it does not duplicate or replace the complete LDS. Product facts, identity assets and permissions remain product-owned under LAYER-01. For new work adopting 0.9.6, replace earlier LDS Project Source normative/overlay copies with this complete file and the applicable separate 0.9.6-bound Add-on. Keep business evidence and explicitly pinned historical work. Do not load 0.9.5 or 0.9.4 as extra design authorities for a 0.9.6 artifact.

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

ข้อความที่ติดป้าย Example/Reference/Candidate/Historical MUST NOT ถูกคัดลอกไปใช้เป็น authority หากขัดกับ numbered rule block, `machine.ruleCatalog` หรือ approved product/portfolio truth ให้ใช้ authority เหล่านั้นและแก้ตัวอย่าง ไม่ตีความตัวอย่างเป็นข้อยกเว้น

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
| ย้ายงานจากรุ่นเดิม | §15 | ใช้ข้อกำหนดที่รวมแล้วในฉบับนี้; lineage เป็นหลักฐานประวัติ ไม่ใช่ไฟล์ที่ต้องอัปโหลดเพิ่ม |

| ทำงานตามบทบาท (AI/agent, dev, designer, product, marketing, sales, ผู้อ่านทั่วไป) | §20 | ทางเริ่มตามบทบาทและ embedded records ที่ต้องใช้ในไฟล์นี้ |
| วาง motif หรือโลโก้ขยับ | §8.5–8.6 | MotifFrame + MotionController, job จาก manifest, สามจังหวะ, joy budget ≤ 3 ต่อเส้นทาง, product overlay register |

คำย่อที่ใช้บ่อย: **Build Card** คือ intent/authority input; **format pack** คือข้อกำหนดตามสื่อ; **target profile** คือ geometry/หน่วย/fixture; **capability pack** คือกฎที่เปิดเมื่อมี feature จริง; **receipt** คือหลักฐานผลตรวจที่ลงวันที่ ไม่ใช่ข้อความว่า “ผ่าน” เฉย ๆ

---

## 2. Build Contract: จากเจตนาไปสู่ artifact

### 2.1 Resolution pipeline

ทุกงาน production ใช้เส้นทางเดียว:

**Approved truth → Build Card → one primary format pack → triggered capabilities → rules/tokens/components → QA receipts → immutable artifact manifest**

ผู้สร้างกรอก intent และ authority AI/resolver คำนวณ derived rule list, set IDs และ test matrix ผู้สร้าง MUST NOT เลือกตัด rule ที่ไม่สะดวกออกเอง

### 2.2 Build Card minimum

Build Card schema ฉบับเต็มอยู่ใน `machine.schemas["build-card.schema.json"]`; สร้าง record ของงานจาก schema ที่รวมไว้แล้ว Example fixture เมื่อมีเป็น optional reference เท่านั้นและไม่ใช่ product evidence ค่า `schemaVersion`, version-qualified schema ID และ hash MUST resolve จาก `machine.release`, embedded active schema และ bytes ของ binding ปัจจุบัน ไม่ใช่คัดจาก prose หรือ historical fixture

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

ทุก hash หมายถึง bytes จริงของ artifact bundle ปัจจุบัน และทุก version/schema identity ต้องมาจาก `machine.release` + active schema เท่านั้น ชื่อไฟล์ `example` ไม่ให้สถานะ pass; validator และ receipt ของ bytes จริงเท่านั้นที่ให้สถานะได้

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

Observation, interpretation, recommendation และ commitment MUST แยก label กัน เส้น, สี, animation, copy หรือ structured data ห้ามทำให้ estimate ดูเหมือน measured fact และ missing data ห้ามแสดงเป็น zero — ค่าทุกช่องต้องถือหนึ่งในหกสถานะของ EVID-05 ด้านล่าง

**EVID-05 — Zero is a fact; missing is a question.** Every governed value cell, map unit and machine field carries one of six states: `measured`, `measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`. `measured` carries a finite nonzero number; `measured_zero` carries numeric `0`; the four exceptional states carry `null`. Do not collapse missing, suppression or scope into zero. Suppressed underlying values MUST NOT leak through HTML attributes, JSON or hidden exports. Agents receive the explicit state with every governed numeric/null value.

| State | ป้ายไทย · English | Machine value | Visible / map treatment | Required context |
|---|---|---|---|---|
| `measured` | ค่าที่วัดได้ · Measured | finite nonzero number | exact value + unit; approved analytical class | unit, source, time, scope, denominator when relevant |
| `measured_zero` | ศูนย์ (สำรวจแล้ว) · Zero (measured) | `0` | numeral 0 + unit; lowest-class fill + `dataState.zero` outline 2px | unit, survey completeness |
| `no_data` | ไม่มีข้อมูล · No data | `null` | — + short reason; 135° hatch + `border.emphasis`; sort last | reason, latest available value when there is one |
| `out_of_scope` | นอกขอบเขตข้อมูล · Out of scope | `null` | scope text; bare basemap, no fill/hatch | scope statement |
| `suppressed` | ปิดค่า · Suppressed | `null` | `‹n` + threshold; `surface.soft` + dashed `border.emphasis` | threshold, aggregation level permitting disclosure |
| `not_yet` | ยังไม่ถึงรอบข้อมูล · Not yet available | `null` | … + expected date; pending surface + dotted pending ink | expected date, source cycle |

The exact typed contract is `machine.schemas["evidence-value.schema.json"]`; values/cues are in `machine.tokens.dataState.valueStates`. Labels use `text.metadata`, never disabled-hint `text.muted`, and must reach 4.5:1 on the actual label surface. Do not place labels directly over the no-data hatch; put them in a readable legend/table/caption. "N/A", a bare dash without explanation and rendering missing as 0 are prohibited. EvidenceCard's nonzero `data-value` must equal the exact visible number.

Sentences retain claim context: TH “ปี 2568 ไม่พบโรงงานใหม่ในตำบลนี้ (0 แห่ง)” / “ยังไม่มีข้อมูลปี 2568 — ล่าสุดคือปี 2567”; EN “No new factories were registered here in 2025 (0).” / “No 2025 figure — latest available is 2024.” These are examples, not product evidence.

Acceptance:

- EVID-05-A — automated: every governed value has exactly one of six states and the corresponding finite nonzero/zero/null type; no suppressed value appears in delivered bytes; no unlabelled N/A, bare dash or missing-as-zero; EvidenceCard visible/machine values agree and DataTable/MapLegend bindings resolve the same state contract
- EVID-05-B — visual: measured, zero and four exceptional states remain distinguishable through text, pattern, outline and labels in light, dark, print and static export; labels use `text.metadata` and pass 4.5:1 on their actual surface
- EVID-05-C — manual: visible copy communicates the state, reason and latest value or expected date when applicable in the user's language, with specific context instead of a generic disclaimer

**EvidenceCard** เป็น component ใหม่สำหรับฝังในคำตอบของ AI เจ้าอื่นและ link preview ที่ต้องพิสูจน์ที่มา: เส้นสี่สี 3px · TrustBadge · ค่า + หน่วย + state · dataset · source · date · boundary · limitation · measure line 3 × 3px · URL ถาวร · เลขใบรับ ไม่มีโลโก้ แผง หรือ gradient และมี text-only fallback หนึ่งบรรทัด สัญญาเต็มอยู่ใน `machine.contracts.componentContracts#component.evidence-card.01` ป้ายหลักฐานบนการ์ดใช้ชุดของ Master Brand Brief v0.5.3 §3.7 (Observed fact · Benchmark interpretation · Owner-stated · Inference · Hypothesis · Project evidence) ไม่ใช่ป้ายที่คิดขึ้นใหม่

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

Artifact Manifest ห้ามใช้ accessibility summary แบบเหมารวมว่า verified ทุกช่อง `machine.contracts.formatPacks.accessibilityProjectionContract` เป็น source เดียวของ summary ต่อ format: web public ต้อง verify headings, landmarks, controls, keyboard, focus, touch, zoom 200% และ reflow 400%; app interactive ต้อง verify semantic structure กับ keyboard/focus/touch แต่ไม่อ้าง zoom/reflow หาก fixture profile ไม่ได้ทดสอบ; document/PDF ใช้เฉพาะ native heading/link structure ที่ fixture รองรับ; deck และ social static ใช้ `not_applicable` สำหรับ headings/landmarks/controls แบบ semantic runtime ไม่อ้างว่า raster หรือ slide มีโครงสร้าง HTML Social static ยังคงต้องผ่าน contrast, safe area, Thai/Latin, crop และ destination-cue fixtures `not_applicable` ในช่องที่ format ไม่มีไม่ได้ลด accessibility obligation ของช่องทางที่มีจริง

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

**LOGO-01 — Use an approved identity implementation.** Landometer wordmark MAY change colour, including a different colour for each letter, while preserving its letterforms and proportions. Gray is an optional versatile default, not a required identity colour. This owner-authorized wordmark colour treatment does not require separate permission for each colour. The official logo MAY appear on light or dark backgrounds when the complete name and symbol remain legible at the actual size. Evaluate a Brand Blue visibility problem for that specific pairing; it does not prohibit dark backgrounds generally. MOTIF-06 full/quiet carrier restrictions apply to registered motifs, not official logo PNGs. This permission changes wordmark colour only; it does not authorize symbol recolouring, redrawing or distortion, or change interface/data colour contracts.

ทุก output ที่ `brandRequired: true` MUST bind `identityImplementation` ที่ approved หนึ่งรายการ Logo, wordmark, symbol, favicon และ social mark MUST ใช้ owner-approved asset ตรง declared role หากยังไม่มี logo asset ที่ approved สำหรับ role/surface นั้น MAY ใช้ canonical portfolio name เป็น governed live-text identity ที่ bind approved fonts ได้ แต่ MUST ระบุ `kind: governed_text_identity`, ใช้ canonical text ครบทุก delivered locale, ตั้ง `logoAssetId: null` และ `logoReconstructionAllowed: false`; MUST NOT ทำ live type ให้เลียนแบบ wordmark หรือ invent compact mark

Acceptance:

- LOGO-01-A — automated: brand-required output resolve identity implementation หนึ่งรายการพอดี—approved asset identity ต้องตรง role/surface/rights/SHA-256/receipt/minimum-size/clear-space; wordmark colour rendition ที่ LOGO-01 อนุญาตคง source provenance และบันทึก hash ของไฟล์ผลลัพธ์จริง ห้ามอ้าง hash เดิมแทนไฟล์ที่เปลี่ยน และไม่ต้องขอ approval ใหม่แยกต่อสี; governed text identity ต้องตรง canonical locale text, approved font bindings, null `logoAssetId`, disabled reconstruction และ artifact-resolved format-implementation record ต้อง bind implementation ID เดียวกัน
- LOGO-01-B — visual: asset identity ใช้ clear space/minimum size/contrast/direct surface ตรง approved variant และ wordmark colour permission ของ LOGO-01; light/dark ทั้งสองใช้ได้เมื่อชื่อและสัญลักษณ์อ่านได้ครบ ห้ามใช้ MOTIF-06 เป็น blanket dark-background ban ของ official logo; governed text identity ยังคงเป็น live text ที่อ่านได้และไม่ impersonate wordmark ที่ไม่ได้รับอนุมัติ

Logo ไม่ใช่ interface icon และ interface icon ไม่ใช่ product identity ถ้าไม่มี approved contrast-safe variant สำหรับ surface นั้น ให้เปลี่ยน surface/variant หรือไม่ใช้ ห้ามรับ contrast risk เพราะ implementation สวยใน screenshot เดียว

Default identity mapping: normal header ใช้ approved horizontal lockup เมื่อ role/surface approval นั้นมีอยู่จริง; compact app, tab/favicon, social avatar และ constrained mark ใช้ได้เฉพาะ separately approved asset ของ role นั้น (ชุดไอคอนของเว็บ resolve ผ่าน FAVICON-01) ห้าม crop header lockup หรือประกอบ symbol + live type ใหม่ เมื่อไม่มี approved logo role ให้ใช้ governed text identity `Landometer` ตาม registry ไม่ใช่ใช้ candidate logo และไม่ใช่สร้าง logo ใหม่ Build Card MUST bind artifact-owned registry ด้วย `{registryRef, sha256, schemaRef}`; artifact-resolved format-implementation record MUST bind `identityImplementationIds` อย่างน้อยหนึ่ง ID และ `identityAssetIds` อาจว่างได้เฉพาะเมื่อ governed text identity เป็นตัวที่ใช้งานจริง Identity asset ต้องมี role, SHA-256, `licenseOrPermission`, `fallback`, `altOrTextEquivalent`, `approvalReceiptRef` และ `approvalReceiptSha256`; registry owns rights/approval, exact hash, clear-space และ minimum-size contract ส่วน manifest `assetBindings` MUST bind ID/role/surface/ref เดียวกันกับ exact emitted hash

Governed text identity MUST select one exact registry `typographyBindingId` for the delivered surface/runtime. Binding นั้นกำหนด font source, family, PostScript name เมื่อเป็น native font, weight, style, size, minimum size, tracking, line height, clear space, substitution policy, final-output policy และ fixture IDs แบบครบชุด `fontAssetIds` ใน Build Card MUST เท่ากับ packaged-font IDs ของ binding นั้นพอดี; native binding MUST ใช้ `nativeMappingId` ที่ตรง platform และห้าม silent substitution Static export MUST เก็บ canonical text เป็น live text ใน editable source และ final bytes ต้องใช้ exact embedded font, approved generated-vector projection ที่มี asset record/hash/text equivalent หรือ verified raster pixels ตาม binding—ห้ามแปลง text เป็นโลโก้หรือ vector ที่ไม่มี authority

#### Icon set ของเว็บ

**FAVICON-01 — Every web build binds one approved icon set.** A web build ships one icon set chosen by property — portfolio: the symbol on transparent; product: the product's identity-gradient tile with the symbol in that gradient's foreground contract (`symbol-white` on onDeep, `symbol-color` on onLight). Six sizes: 16 · 32 · 48 · 180 (apple-touch) · 192 · 512 (maskable, safe zone 80%). Corners 25% at 16/32; maskable sizes ship full-square. The icon never changes per page and never signals status. `<title>` is `[page] · [product]`, ≤ 60 characters, page first. A missing icon set is a WEBFMT-01 blocker, not a caveat. Icon sets live in the asset register with hashes.

ชุดไอคอนเป็น identity asset role ใหม่ `icon_set` ใน `machine.contracts.assetRegistry#/iconSets` แต่ละไฟล์ต้องมี role ตามขนาด, exact SHA-256, `approvalReceiptRef` และ `approvalReceiptSha256` ตาม ASSET-DELIVERY-01 ชุด portfolio `iconset.landometer.portfolio.symbol.01` (generator deterministic จาก symbol PNG ทางการ `b818eeb6…`; 16/32/48/192 บนพื้นใส, 180/512 เป็น tile `brand.beige`; hash ทั้งหกไฟล์ใน `machine.contracts.assetRegistry#/iconSets`) ได้รับการอนุมัติ role `icon_set` จากเจ้าของเมื่อ 15 กันยายน 2569 (`owner-message:2026-09-15:0.9.3-answers`) ส่วน product tile ต้อง resolve identity gradient และ asset bytes ที่อนุมัติต่อผลิตภัณฑ์จาก Add-on แยกของผลิตภัณฑ์ปัจจุบัน ซึ่งใช้ร่วมกับ LDS ฉบับเต็มนี้ motif หรือ animated variant ห้ามใช้เป็นไอคอน (MOTION-04, MOTIF-02)

Acceptance:

- FAVICON-01-A — automated: initial HTML ของทุก route มี icon set ครบหกขนาดที่ resolve จาก asset registry ด้วย hash ตรง, web manifest ที่ประกาศ 192/512 (512 maskable), `theme-color` light/dark และ `<title>` ตาม pattern `[page] · [product]` ≤ 60 ตัวอักษร; ขาดข้อใดข้อหนึ่งเป็น WEBFMT-01 blocker
- FAVICON-01-B — visual: ไอคอน 16/32 อ่านออกที่ขนาดจริงบน light/dark tab strip, 180 บน iOS home, 192/512 maskable ไม่ถูกตัดใน safe zone 80% และไอคอนไม่เปลี่ยนตามหน้าหรือสถานะ

---

## 5. Visual foundations

### 5.1 Color: semantic before decorative

**COLOR-01 — Use semantic color tokens.** Authored UI, text, surface, state and data colors MUST resolve governed roles in `color-srgb-09`. Use exact values from `machine.colorRegistry`, `machine.tokens` and `machine.analyticalScales`; do not approximate by eye. State, category and magnitude MUST NOT rely on color alone, and contrast MUST be checked in the actual output context. Approved identity artwork and governed evidence/editorial media retain their approved source pixels and MUST NOT be sampled/reconstructed as interface tokens.

Acceptance:

- COLOR-01-A — automated: authored colors resolve current approved roles or exact LUT/class records; ordinary audience output contains the sanitized values/assets it needs, not internal provenance or approval metadata; no forbidden old series/density/product alias is emitted
- COLOR-01-B — visual: text, controls, focus, graphics and data marks pass their declared contrast requirements in light, dark and print-relevant states at actual size

Production websites use the exact `lds-0.9.6.css` build-kit and its pinned dependencies or a separately verified equivalent projection of the embedded current roles. Charts use exact LUT samples rather than three-anchor interpolation. A DS-reference download such as this document intentionally contains rules and machine records; that purpose does not permit publishing its internal provenance as ordinary product UI. Seven atmosphere gradients are decorative identity assets and MUST NOT encode quantity, category or evidence state.

Forbidden aliases in current work: `--ldm-series-NN-light`, `--ldm-series-NN-dark`, ambiguous `--scale-density-*`, and retired warm `--ldm-product-ijji-*`. Use explicit series fill/ink roles and the denominator-specific analytical family. Approved ijji identity remains `ground.mist` in light and `#59C7E8 → #3BD3CB` in dark; other product identity requires its product-owned approval.

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

Dataviz และ map MUST ใช้ approved scale registry แยก semantic state, categorical series และ magnitude scale ไม่ให้สีเดียวรับหลายความหมายใน scene เดียว Palette ที่สวยแต่ label ไม่พอถือว่า fail Registry ของ release นี้คือ `machine.analyticalScales` (DATAVIZ-02; exact dark LUT ตาม DATAVIZ-03) และ `machine.tokens.categoricalSeries` (DATAVIZ-05); ทุกค่าวิเคราะห์ทั้งสองธีมต้องผ่านหน้าต่างสีที่กำหนดใน DATAVIZ-04; ผลตรวจ GATE-01 ต้อง bind ค่าปัจจุบันและ reported scope จริง; energy color เป็น restrained accent เท่านั้น ห้ามเป็นสีกลางของสเกล และห้ามอยู่ร่วม surface กับ categorical chart แบบ vivid

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

Selected navigation, tabs, cards and callouts MUST NOT use decorative bracket-shaped highlights or colored left-rail accents. Use restrained background, text weight and spacing. Keep visible keyboard focus outlines and meaningful chart/table borders. Review actual rendered Thai/English text at narrow and desktop widths, including every newly added section, for squeezed headings and overlapping siblings; token/hash checks do not establish readable composition.

Acceptance:

- LAYOUT-01-A — visual: reading order ชัดที่ minimum, nominal และ maximum target sizes; actual Thai/English narrow/desktop content has no squeezed heading or sibling overlap, including newly added sections
- LAYOUT-01-B — manual: essential content ไม่ clipped, orphaned, ซ่อนหลัง navigation หรือ split โดยไม่มี continuation cue; selected states contain no decorative brackets/colored left rails, while keyboard focus and meaningful chart/table borders remain visible

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

- identity — ห้าม crop หรือ distort; เปลี่ยนสีเฉพาะ wordmark ได้ตาม LOGO-01 รวมถึงตัวอักษรละสี โดยคง letterforms/proportions; ข้อห้าม recolor ส่วนอื่นยังคงเดิม; ไฟล์อัตลักษณ์ทางการไม่เคลื่อนไหว ส่วน animated variant ของ mark มีทางเดียวคือ `motif.v3` kind `logo` ตาม MOTION-04 ซึ่งเป็น generated_vector ไม่ใช่ identity file
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

State ที่ไม่เกิดกับ component นั้น MUST ระบุ `not_applicable` พร้อม behavior/rationale ที่ชัด ห้ามลบ state ออกจาก contract เพื่อหลบการตรวจ `navigational_cta` MUST ใช้ default/hover/focus/active และ selected/disabled/loading/empty/error/success เป็น `not_applicable`; `stateful_cta` MUST มี disabled/loading/error/success และกำหนด recovery/result status ส่วน empty/selected ระบุตาม behavior จริง Disclosure และ side bookmark ต้องมี contract แยก ไม่ถือว่าถูก cover ด้วย navbar contract Current governed component contracts ห้ารายการใน `machine.contracts.componentContracts`: `component.evidence-card.01` (EvidenceCard ใหม่ตาม EVID-05), `component.motif-frame.01` (MotifFrame ใหม่ตาม MOTION-04 และ MOTIF-01…06: mount `<lm-motif kind="dial|rings|layers|slice|cultivate|logo">` จาก runtime bytes ที่ hash ตรง พร้อม final-state SVG ของ kind นั้นเป็น no-JS fallback, prop `job` ที่ต้องอยู่ใน allowedJobs ของ manifest, `beat`, `variant`, `data-host-surface` ที่ต้องอยู่ในตาราง carrier ของ MOTIF-06 พร้อม `data-variant-dark` ที่เลือกได้ และ observer contract ของ OWNER-MOTION-01) และ `component.motion-controller.01` (ปุ่ม pause/resume ระดับหน้าที่ MotifFrame ทุกตัวแชร์), `component.data-table.01` (prop `cellStates` uses all six EVID-05 states) และ `component.map-legend.01` (แสดง `noData`, `zero`, `outOfScope`, `suppressed`, `notYet` rows เมื่อมี) BrandSignature docstring อ้าง MOTION-04 แทนคำว่า never animated

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

Navigation มีสามระดับที่ต้องไม่ปน:

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

`web_public` และ `app_interactive` ใช้ `presentation.mode: direct` + `direct_control` เท่านั้น ส่วน `document_flow`, `pdf_fixed`, `deck_presentation` และ `social_static` MUST ใช้ `static_equivalent` ตาม `machine.contracts.formatPacks.ctaDestinationContract` งาน static ห้ามวาด fake button เพื่อสื่อว่ากดได้ `command` ใน static format แสดงได้เฉพาะ explicit `instruction`; social static ไม่รองรับ `anchor` หรือ `command` และใช้ได้เฉพาะ route/external/download/form/contact เป็น `destination_cue`

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

เฉพาะงาน `web_public.browser` หรือ `app_interactive.browser` ที่ interactive เท่านั้น CTA MAY ใช้ observer-based `motion.cta.discovery-cue.01` เพื่อช่วยค้นพบ **primary navigational CTA** ครั้งแรกเมื่อ Build Card ระบุ `requiredUserBenefit: discoverability` การประกาศ cue นี้ trigger `motion` capability และจึง MUST มี `motionDecision: assigned`, motion assignment และ hash-bound browser motion config ครบ Recipe ต้อง bind `machine.tokens#/motion/ctaDiscoveryCue` และใช้ trigger, repeat count, duration ceiling, easing และ geometry ตรง token; stateful/consequential CTA, repeated exposure หรือ cue ที่ไม่มี benefit record ห้ามใช้ แต่:

- real label/background/border ต้องอ่านได้โดยไม่พึ่ง effect
- effect layer ต้อง aria-hidden และ pointer-inert
- run exactly once on first visible entry per page load; re-entry MUST NOT repeat และห้าม loop/flicker — MOTION-04 และ MOTIF-04 ไม่เปลี่ยน cue นี้ เพราะเป็น motion เหนือ primary action ซึ่งยังห้ามเป็น ambience (เจ้าของยืนยัน 15 กันยายน 2569)
- browser reduced-motion/observer failure ใช้ `no_cue_final_state`; `staticEquivalent: emphasis_without_motion` อธิบายความหมาย fallback ของ cue เมื่อแปล format เท่านั้น
- effect ห้ามบัง focus, progress, error หรือ confirmation
- ถ้าทดสอบ user benefit ไม่ได้ ให้ omit

งาน `app_interactive.native`, document, PDF, deck และ social MUST มี `ctaDiscoveryCueAssignments: []` แม้ source experience เคยมี animated cue Native app ที่ต้องการ emphasis ใช้ finite native-state feedback จาก selected `native_state` config โดยไม่อ้าง observer recipe; static format ใช้ hierarchy ปกติ เช่น weight, surface, border, spacing, working link, destination cue หรือ instruction โดยไม่ประกาศเป็น motion assignment และไม่วาด fake button

---

## 8. Motion และ interaction for user benefit

### 8.1 Benefit gate

**MOTION-01 — Motion must serve the user.** Motion MUST clarify state, sequence, progress, spatial relationship หรือ cause/effect Decorative motion MUST เป็น finite play ที่ subordinate และไม่มี perpetual flicker; การเล่นซ้ำขณะมองเห็นตาม MOTION-04 ใช้ finite play ซ้ำเป็นรอบ ≥ 2,000 ms ไม่ใช่ `animation-iteration-count: infinite`; essential content/action ห้าม depend on animation

Acceptance:

- MOTION-01-A — manual: motion role ทุกอันระบุ user benefit และ static final-state equivalent
- MOTION-01-B — automated: ไม่มี `animation-iteration-count: infinite`, infinite attention animation หรือ unbounded CTA sweep; การเล่นซ้ำที่มีอยู่เป็น finite play ที่ผูกกับ viewport ตาม MOTION-04

Motion decision:

1. ถ้าไม่มี motion ผู้ใช้เสียความเข้าใจหรือ feedback หรือไม่
2. motion เชื่อม cause → effect, source → destination หรือ state A → B ชัดหรือไม่
3. static/reduced version ให้ meaning เดียวกันหรือไม่
4. motion ทำให้ช้าลง, distract, nausea, layout shift หรือ focus drift หรือไม่

ถ้าข้อ 1–3 ตอบไม่ได้ หรือข้อ 4 เป็นจริง ให้ใช้ static state

### 8.2 Riddim Approach Motion

**MOTION-02 — Approach motion is role-gated and fail-open.** ข้อกำหนดแยกตาม runtime อย่างเด็ดขาด Browser approach reveal MAY ใช้ explicit semantic roles จาก motion-riddim-approach-03 แต่ source HTML MUST render final visible state และ enhancement MUST fail open ใน no JavaScript, reduced motion, observer failure, initialization timeout, hidden tabs, focus, deep links, history restoration, back-forward cache และ print Native app motion MUST resolve `native_state` config และใช้ native state-transition lifecycle: platform reduced motion, backgrounding, interruption, cancellation, restoration, view disposal, native view order, platform accessibility traversal order และ complete final state; native branch MUST NOT require HTML, JavaScript, IntersectionObserver, browser history/BFCache หรือ print behavior

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

Browser runtime เท่านั้น: หนึ่ง document root ใช้ shared IntersectionObserver หนึ่งตัว; approach reveal เล่นซ้ำเมื่อ element กลับเข้า viewport (replay on re-entry ตาม OWNER-MOTION-01) และไม่วนซ้ำขณะ element ยังอยู่นิ่งในจอ เพราะ content reveal ที่วนจะกลายเป็น perpetual flicker ซึ่งยังห้ามอยู่ Within each declared stagger group, zero-based sibling index `i` MUST receive delay `min(i, 3) × 150ms` จึงมี four beats 0/150/300/450ms และ item ที่ 4 ขึ้นไปใช้ cap 450ms; group order MUST follow semantic reading order Pre-paint bootstrap MAY arm pending state เฉพาะ normal motion + observer available และ MUST start 2400ms watchdog Ongoing passive scroll/resize/pageshow audit waits two frames after a target reaches/passes effective root, then forces final state if callback missed Adapter MUST NOT render source final → hidden → final flash

Native runtime ใช้ `capability-config.schema.json#/$defs/motionNativeState` โดยต้องมี `mode: native_state`, `feedbackDurationMs`, `stateDurationMs`, `maximumTransitionMs`, `reducedMotionFinalState: final_state`, `layoutGeometry: stable` และ `interruptionFinalState: final_state` งาน QA MUST ทดสอบ platform reduced motion, backgrounding, interruption, cancellation, restoration, view disposal, complete final state และ native view/platform accessibility traversal order หลักฐาน native ห้ามอ้าง no-JS, observer, BFCache หรือ print fixture แทน

CTA discovery cue เป็น browser-only recipe: first visible entry, one run per page load, 540ms with 600ms ceiling, `cubic-bezier(.16,1,.3,1)`, inline highlight sweep from −120% to 120% with 28% band, content opacity never below 1, zero layout movement, pointer-inert; re-entry does not repeat Browser reduced motion/observer failure uses no-cue final state Native app ไม่ใช้ cue นี้และ static format uses non-moving emphasis

Timing เป็น ceiling recipe ไม่ใช่ข้อบังคับให้ทุก scene animate ความเร็วของ feedback/state ยังใช้ token ที่สั้นกว่าตาม consequence

### 8.3 Layout/focus stability

**MOTION-03 — Motion does not disturb layout or reading.** กฎนี้แยกตาม runtime อย่างเด็ดขาด: `browser_observer` entry motion MUST ใช้ opacity และ transform เท่านั้น, zero layout shift, หลีกเลี่ยง nested unsynchronized reveals และใช้ exact motion-riddim-approach-03 timing/distance/logical-direction/four-beat-stagger/reduced-motion recipe; `native_state` MUST ใช้เฉพาะ selected native config + native state-transition lifecycle, รักษา layout geometry, native view order และ platform accessibility traversal order และ MUST NOT require browser observer fields, opacity/transform approach recipe, Riddim distance token หรือ stagger formula; `presenter_sequence` MUST ใช้เฉพาะ selected presenter config, รักษา slide-object order กับ complete governed final frame และ MUST NOT require browser observer, browser approach properties หรือ Riddim stagger tokens

Acceptance:

- MOTION-03-A — automated: runtime class resolve exact branch ของตน—browser ใช้ opacity/transform + exact four-beat Riddim recipe, native ใช้เฉพาะ native config/lifecycle fields, presenter ใช้เฉพาะ presenter config/final-frame fields—ทุก branch รักษา stable layout geometry และ reject field/recipe/test ของอีก branch
- MOTION-03-B — visual: browser reading/focus/scroll order, native view/platform-accessibility order หรือ presenter slide-object order/final frame stable ระหว่างและหลัง motion ตาม branch ที่เลือก

Reduced motion ไม่ใช่ช้าลงแต่คือ final-state-first: remove approach/parallax/sweep, keep necessary state change instant หรือ minimal non-spatial feedback และ preserve progress/status

### 8.4 Other motion modules

- parallax MUST remain disabled in v0.9.6 (MOTIF-03 ห้าม parallax ใน motif ด้วย) Future candidate MAY enable only through named recipe defining purpose, semantic role, maximum travel/rate, input behavior, reduced-motion final state, performance budget and lifecycle QA; identity, evidence, map, chart, UI capture and provider content remain fixed
- data transition MAY เมื่อติดตาม same object/state; exit/enter ห้ามทำให้เทียบค่าผิด
- loading motion MUST มี text/status และ timeout/failure state
- carousel MUST ไม่ autoplay default; user controls visible และ reduced motion usable
- page transition MUST ไม่ delay navigation หรือ hide history-restored content

### 8.5 Identity motion และการเล่นซ้ำตาม OWNER-MOTION-01

**MOTION-04 — Identity motion uses the approved runtime and replays while visible.** The official artwork files never animate. The mark's parts may assemble only through `landometer.motif.v3` kind="logo" (montri-th/motif release 1.2.1; js SHA-256 `3a5caef7918a85885b61dd53e049ea8bf2b0a3cea508f587bb14970bfe6deaf2`, css `7cc2deb475a8d6e4af331407b2b4b741716c458a8ce885e2fb2859374b93912e`) with `logo-full.svg` / `logo-quiet.svg` as the final-state fallback. Bytes are never edited; the wedge stays token-derived (`color-mix(in lch, energy.sky 48%, brand.blue)`), never a sampled hex.

**Repetition (OWNER-MOTION-01, 11 September 2026, outranks every LDS version).** Every animation plays as soon as ≥ 14% of it is in the viewport and replays for as long as it stays visible; it stops when it leaves the viewport. Cycles are repeated finite plays (never `animation-iteration-count: infinite`), ≥ 2,000 ms; the logo cycle is 6,000 ms so its final state stays visible between plays. One page-level pause/resume control exists. `prefers-reduced-motion: reduce`, no-JavaScript and print routes render the final state and start no cycle. State-bound motifs (`motif.progress`) still appear only while the real state runs.

**Still prohibited.** Hue cycling, shape distortion, motion carrying evidence or meaning, motion over the first answer or the primary action, motifs in navigation, favicon or OG images (official identity files only).

ขอบเขตตามคำตัดสินของเจ้าของ 15 กันยายน 2569: กฎนี้ใช้กับ `web_public`, `app_interactive.browser` และ document/PDF/deck ที่ render ในเบราว์เซอร์; ไฟล์ static ที่ export แล้ว (PDF, PPTX, PNG, email) ใช้ final state เท่านั้น การเล่นซ้ำครอบคลุม decorative และ identity motion (motif runtime ทุก kind และ approach reveal เมื่อกลับเข้า viewport) ส่วน CTA discovery cue ยังคงเล่นครั้งเดียวต่อ page load ตาม §7.3 เพราะเป็น motion เหนือ primary action ซึ่งข้อห้ามของกฎนี้ยังคงอยู่ (ยืนยันแล้ว 15 กันยายน 2569) motif อีกห้าตัว (dial, rings, layers, slice, cultivate) และ product overlay อยู่ใต้ §8.6

Machine binding: `machine.tokens#/motion/identity` (runtime ids, hashes, cycle 6,000 ms, observer threshold 0.14 กับ rootMargin `0px 0px -8% 0px`, page control, reduced-motion และ no-JS behavior) และ `machine.contracts.componentContracts#component.motif-frame.01` MotifFrame wrapper ใช้ observer ของตัวเองแล้วเรียก `play()` ของ runtime ทุกรอบขณะมองเห็น (runtime ตั้ง `autoplay="false"`) จึงไม่แก้ byte ของ runtime และไม่พึ่ง attribute `loop` ซึ่งไม่ผูกกับ viewport เมื่อ autoplay ปิด; ปุ่ม pause/resume ระดับหน้าเป็นของ `component.motion-controller.01` ตัวเดียวที่ทุก MotifFrame บนหน้าแชร์

ความต่างที่เจ้าของยอมรับและบันทึกไว้ (15 กันยายน 2569): ไฟล์อัตลักษณ์ PNG มีลิ่ม `#0195CB` และหมุด `#1E4497` ส่วน motif v3 ใช้ลิ่ม token-derived ที่เบราว์เซอร์แสดง ≈ `#1F87CE` และหมุด `#1D4497` (token) รัศมีต่างกัน ≤ 0.6% ไฟล์ PNG ทางการยังเป็น identity of record; motif เป็น animated assembly reference ไม่ใช่ identity file และไม่มีการ re-export PNG

Acceptance:

- MOTION-04-A — automated: runtime js/css bytes ที่ deliver มี SHA-256 ตรงค่าข้างบน; fallback svg ตรง `governance/SHA256SUMS.txt` ของ motif 1.2.1 (`90e9543f…`, `5b6798cd…`); ไม่มี `animation-iteration-count: infinite` ใน delivered CSS; observer threshold/rootMargin/cycle ตรง token; page-level pause control มีอยู่; identity PNG ไม่ถูก animate หรือ redraw; wordmark colour changes ตาม LOGO-01 ใช้ได้ โดยคงรูปทรงและไม่เปลี่ยนสี symbol
- MOTION-04-B — interaction: เข้า viewport ≥ 14% แล้วเล่นทันทีและเล่นซ้ำทุก 6,000 ms ขณะยังมองเห็น; ออกจาก viewport แล้วหยุดค้าง final state; pause แสดง final state ครบ; reduced motion, no-JS และ print แสดง final state โดยไม่เริ่มรอบ
- MOTION-04-C — manual: motion ไม่ทับ first answer, primary action, navigation, favicon หรือ OG image และไม่ถือความหมาย หลักฐาน หรือสถานะใด ๆ

---
### 8.6 ระบบ motion identity: motif หกตัว, สามจังหวะ และ product overlay

กฎหกข้อนี้ถอด spirit ของ Motif Studio (montri-th/motif 1.2.1 · Studio 1.3.0) เป็นข้อบังคับ: motion แสดงวิธีทำงานของ Landometer ไม่ใช่การประดับ ทุก motif ประกาศ job จาก registry ของ manifest, ใช้ byte ตรง, มีฟิสิกส์ที่ร่าเริงแต่มีขอบ, วางตามจังหวะเรื่อง, แยกชั้นร่วมออกจาก product overlay และวางบนพื้นที่วัดค่าแล้วเท่านั้น ข้อความกฎของ MOTIF-01…05 เป็น verbatim จาก rule-drafts r2 ยกเว้นประโยคสุดท้ายของ MOTIF-04 ที่ย้ายไปเป็น MOTIF-06 ตามคำตัดสินของเจ้าของ 16 กันยายน 2569

**MOTIF-01 — Motion shows the method.** Landometer motion enacts the method: parts arrive in the order the work happens — the pin lands (place), the plates set (measure), the wedge points (act). Every motif declares one job from the registry (`orientation`, `opening`, `spatial_transition`, `section_orientation`, `layering`, `quiet_divider`, `action_closure`, `cultural_closure`, `handoff`, `animated_brand_opening`). Motion that enacts no registered job is not used.

Job ต่อ kind ตาม `assets/motif-library.json` (1.2.1, `77e81851…`): dial → orientation, opening · rings → spatial_transition, section_orientation · layers → layering, quiet_divider · slice → action_closure · cultivate → cultural_closure, handoff · logo → animated_brand_opening prohibitedJobs ของทุก kind (data_encoding, evidence, measured_state, loading_state, official_navigation_identity, favicon, co_brand_lockup) ใช้ตามตัวอักษร MotifFrame ปฏิเสธ `job` ที่ไม่อยู่ใน allowedJobs ของ kind นั้น (throw) และ preflight ตรวจซ้ำ

Acceptance:

- MOTIF-01-A — automated: ทุก `<lm-motif>` ที่ deliver อยู่ใน MotifFrame ที่ประกาศ `job` ซึ่งอยู่ใน allowedJobs ของ kind ใน `machine.contracts.motifRegister`; Build Card `motionMoments[]` ระบุ kind, job และ beat ของทุก moment
- MOTIF-01-B — manual: job ที่ประกาศตรงกับสิ่งที่ผู้ใช้ทำอยู่ตรงนั้น (orient, move, layer, close, hand off) ไม่ใช่การตกแต่ง

**MOTIF-02 — Exact bytes, exact landing.** Motifs and the animated mark exist only as registered runtime bytes (`landometer.motif.v3`, montri-th/motif ≥ 1.2.1) with a final-state SVG whose geometry equals the last frame. No redraw, recolor, crop, distortion or tracing from screenshots. `prefers-reduced-motion`, no-JavaScript, print, PDF, deck, email and social routes render the final state. Motion never carries evidence, data, measured state, completion or product capability (prohibitedJobs in the manifest apply verbatim).

Acceptance:

- MOTIF-02-A — automated: runtime js/css และ final-state SVG ทั้ง 12 ไฟล์ที่ deliver มี SHA-256 ตรง `machine.contracts.motifRegister` (ค่าจาก manifest 1.2.1 ตรวจกับไฟล์ใน repo แล้ว); ทุก MotifFrame มี `<noscript>` final-state SVG ของ kind และ variant เดียวกัน
- MOTIF-02-B — manual/visual: เฟรมสุดท้ายของ runtime ทับ SVG final state ได้พอดี; ไม่มีการ recolor หรือ crop

**MOTIF-03 — Joyful physics, bounded.** The motion vocabulary is physical and finite: drop with squash and stretch, pop-overshoot placement, four-beat stagger (0/150/300/450 ms), step-out-and-return finale, hop (product stings). Not permitted: hue cycling, identity morphing, geometry distortion, parallax, unbounded ambient loops, scale overshoot beyond 1.16. A motif runs 1.2–3.4 s; a cycle is ≥ 2,000 ms (logo 6,000 ms) under OWNER-MOTION-01; one page-level pause/resume control exists.

Acceptance:

- MOTIF-03-A — automated: ไม่มี `animation-iteration-count: infinite`; MotifFrame `data-cycle-ms` ≥ 2000 (logo 6000); MotionController หนึ่งตัวต่อหน้า; ไม่มี transform scale > 1.16 ใน CSS ที่ deliver นอก runtime bytes
- MOTIF-03-B — interaction: เข้าจอ ≥ 14% แล้วเล่นทันทีและเล่นซ้ำตามรอบ; พ้นจอแล้วหยุดค้าง final state; pause ค้าง final state; reduced motion/no-JS/print ไม่เริ่มรอบ

**MOTIF-04 — Three beats, three moments — the joy budget.** Motifs are placed at the story beats INTENT → AHA → NEXT ACTION, aligned with the BRAND rhythm's Opening / Transition / Closing: Opening = `logo` (animated brand opening) or `dial` (orientation); Transition = `rings` (spatial transition) or `layers` (layering / quiet divider); Closing = `slice` (action closure) or `cultivate` (cultural closure / handoff). A long route carries at most three motion moments; a task surface carries one. Motifs never sit on the first answer, the primary proof or the primary action. Where a motif may sit is governed by MOTIF-06.

Acceptance:

- MOTIF-04-A — automated: Build Card `motionMoments[]` ≤ 3 ต่อ route (≤ 1 ต่อ task surface) และแต่ละ moment มี beat ที่ตรงกับ kind ตามตารางข้างบน; ไม่มี MotifFrame ในบริเวณที่ทำเครื่องหมาย `data-region="first_answer|primary_proof|primary_action"`
- MOTIF-04-B — manual: จังหวะที่วางตรงกับเรื่อง (INTENT → AHA → NEXT ACTION); พื้นที่วางตรวจตาม MOTIF-06

**MOTIF-05 — Shared layer versus product overlay.** `landometer.motif.v3` is the product-neutral shared layer. Product animated identities are separately registered overlays with their own final fallback, duration, minimum size and host surface (`ijji.logo-sting.r3` exists: Hop → Bodies → Tagline → Hello → Hold, 9.0 s full / 6.4 s mark-only, ≥ 320 / 160 px). CityMETER, CityWiki and CityChat stings are produced in the Motif Studio under the same contract and enter the manifest with SHA-256 and owner approval before the DS references them. Families are never mixed in one lockup; navigation, favicon and OG images use official identity files, never motifs.

ทะเบียน product overlay ของ release นี้อยู่ใน `machine.contracts.motifRegister#/productOverlays` ตามคำตัดสินของเจ้าของ 15 กันยายน 2569: `ijji.logo-sting.r3` (runtime `1a1d1bc2…`, stills `bb1bc80e…` / `acac2c65…`) และ `ijji.four-beat.selected-3.r3` (state-bound: graph-b, rings-c, rotate-b; ใช้เฉพาะขณะมี pending operation จริง มี status text และปุ่ม cancel) อนุมัติแล้วใน manifest 1.2.1 · CityChat conversation set (SVG 7 ไฟล์ + `citychat-motif-motion.js/.css`) อนุมัติโดยเจ้าของตาม bytes ปัจจุบันของ repo (commit a99f3c1e) โดยป้าย candidate ของทะเบียนต้นทางเป็นบันทึกประวัติ ณ วันที่รับ bytes ไม่ใช่ข้อสรุปสถานะเว็บปัจจุบัน; ใช้ approval/hash record ที่ส่งพร้อม Add-on แยกของผลิตภัณฑ์ · CityMETER และ CityWiki stings มี historical pre-approval; ใช้ได้ต่อเมื่อ current product registry มี approved bytes และ exact hash จริง overlay ทุกตัวใช้ได้เฉพาะงานของผลิตภัณฑ์นั้น ไม่ผสมกับ shared motif ใน lockup เดียว และไม่สร้าง product fact ใด ๆ (สี ความหมาย ความสามารถของผลิตภัณฑ์อยู่ใน Product Brief/Add-on ของผลิตภัณฑ์นั้น)

Candidate briefs สำหรับ Studio 1.4 (ยังไม่ได้วาด ไม่ใช่ asset): `receipt` — closure เมื่อออกใบรับตัวเลข/decision log (job: handoff) · `compare` — transition ของสองพื้นที่เคียงกัน (job: spatial_transition) · `citymeter.pending` — ตระกูล state-bound (ต้องมี status text และ cancel ที่ทำงานจริง) · product stings ของ CityMETER / CityWiki / CityChat

Acceptance:

- MOTIF-05-A — automated: overlay ที่ deliver อยู่ใน `machine.contracts.motifRegister#/productOverlays` ด้วย hash ตรงและ `approval.status: owner_approved`; productScope ของ overlay ตรงกับ product layer ของ Build Card; ไม่มี overlay กับ shared motif ใน lockup เดียว
- MOTIF-05-B — manual: overlay ไม่ถูกใช้แทน official identity ใน navigation, favicon หรือ OG image และไม่สื่อความหมายเชิงหลักฐาน

**MOTIF-06 — Every motif sits on a measured carrier.** A motif's colours are fixed by its governed file, so its legibility is decided by the ground it sits on. Every placement — a MotifFrame or a static final-state image — declares that ground, and a placement is allowed only when `machine.contracts.motifRegister#/carrierPolicy` lists its kind × variant × carrier for every theme the output renders: every visible authored paint composites at 1.30:1 or more on the carrier (a gradient at its worst stop). `full` variants (Brand Blue ink) sit only on plain light carriers; `quiet` variants (one sky ink) sit only on deep carriers, Brand Blue included. A `full` variant never sits on Brand Blue, on a dark surface or on any atmosphere gradient. Runtime renditions keep the governed inks (`ink="blue"` for full, the default sky for quiet). A failing pair is fixed by changing the carrier, then the variant, then the size or spacing, then by removing the motif — never on the asset: no recolour, plate, scrim, new tint, or opacity carrying meaning.

ที่มา: `motif-quiet-fallback.json` (landometer-quiet-fallback/1.0) ที่เจ้าของอนุมัติ 11 กันยายน 2569 เป็น normative ของงานที่ใช้ Motif Library 1.2.1 และคำตัดสินของเจ้าของ 16 กันยายน 2569 ให้นำเข้า DS ในรอบนี้แทนประโยคพื้นของแพตช์ r2 ใน MOTIF-04 ซึ่งวัดแล้วขัดกับ bytes: SVG แบบ full ทั้งหกมี Brand Blue `#1D4497` อยู่ในตัว จึงเหลือ 1.00:1 บน Brand Blue (หมุดโลโก้ เส้นฐาน วงใน แผ่นฐาน ตัวพาย และต้นกล้าหายไป) และบน atmosphere ทั้งสี่ชุดมีบางส่วนต่ำกว่า 1.30:1 ส่วน quiet ใช้หมึก energy.sky `#59D2FE` สีเดียว บนพื้นสว่างทุกแบบส่วนที่เข้มที่สุดได้เพียง 1.23–1.74:1 แต่บนพื้นทึบธีมมืดได้ 3.37–10.23:1 และบน Brand Blue 2.74–5.19:1 ครบรูป ตัวเลขทุกค่าวัดใหม่จาก bytes ที่ hash ตรงด้วย `measure-motif-carriers-0.9.4.mjs` (composite 8-bit เหมือนที่จอแสดง) และตรงกับตารางของ ladder ทุกค่า

| variant | วางได้ (ทุก kind เว้นที่ระบุ) | ห้าม |
|---|---|---|
| `full` | `surface.canvas`, `surface.card`, `surface.raised`, `surface.alt`, `surface.soft`, `surface.blueTint`, `surface.beigeTint` ของธีมสว่าง และ `brand.beige` — `layers` ได้เฉพาะ canvas, card และ raised (แถวจางของมันได้ 1.21–1.26:1 บนพื้นสว่างอื่น และ 1.30:1 พอดีเกณฑ์บน canvas) | Brand Blue · พื้นธีมมืดทุกแบบ · atmosphere ทุกชุด · ภาพถ่าย · พื้นของ semantic state |
| `quiet` | `surface.*` ทุกตัวของธีมมืด, `brand.blue`, `atmosphere.ground.current`, `atmosphere.measure.deep` — `layers` ได้เฉพาะพื้นทึบ (บน atmosphere เข้มวงจางที่สุดได้ 1.27–1.28:1) | พื้นสว่างทุกแบบ · `atmosphere.ground.mist`, `atmosphere.measure.luminous` · gradient ของ cultivate, diversity และ product · ภาพถ่าย |

การประกาศ: ทุก MotifFrame และทุกภาพ motif แบบนิ่งบนเว็บ (`data-motif-static="<kind>-<variant>"`) มี `data-host-surface` เป็น carrier id จาก `carrierPolicy.carriers` — id ที่เปลี่ยนตามธีม (เช่น `surface.card`) ถูกตรวจแยกทุกธีมที่งานรองรับ (`<meta name="color-scheme">`; ไม่ประกาศ = ทั้งสองธีม), รูป `<id>@light` หรือ `<id>@dark` หมายถึงพื้นที่ทาค่าธีมนั้นคงที่ทั้งสองธีม และ id ที่ไม่เปลี่ยนตามธีม (`brand.beige`, `brand.blue`, `atmosphere.*`) ใช้ค่าเดียว · `data-variant` คือ variant ของธีมสว่าง และ `data-variant-dark="quiet"` สลับ frame แบบ full บนพื้นที่เปลี่ยนตามธีมให้เป็น quiet ในธีมมืด (MotifFrame สลับ attribute `quiet` ของ runtime และ `<noscript>` มี SVG ทั้งสองแบบใน wrapper `.lds-motif-noscript` ที่ติด `data-theme-variant="light|dark"` ซึ่งเลือกธีมแบบเดียวกับหน้า — `data-theme` ก่อน แล้วจึงค่าของระบบ; `<picture>` ที่ตามเฉพาะค่าของระบบใช้แทนไม่ได้) ซึ่งเป็นการสลับแบบเดียวที่ตารางวัดยอมรับ · MotifFrame ปฏิเสธคู่ที่ไม่อยู่ในทะเบียน พื้นที่ทาจริงที่ไม่ตรงกับที่ประกาศ และค่า `ink` ที่ไม่มีไฟล์รองรับ แล้วถอด frame ออกจากการแสดงผล (ขั้น L5) · งาน export แบบนิ่ง (PDF, deck, social, email) ใช้ตารางเดียวกันกับพื้นของหน้านั้น · Build Card `motionMoments[]` และ `staticMotifPlacements[]` บันทึก `hostSurface`, ค่าพื้นต่อธีม, คอนทราสต์ที่วัด, verdict และขั้นของ ladder ที่ใช้

ลำดับการแก้เมื่อคู่ไม่ผ่าน (ladder L1–L5 ของไฟล์ที่อนุมัติ): L1 วัดกับพื้นจริงที่ขนาดจริง · L2 ย้ายไปพื้นอื่นในตาราง · L3 เปลี่ยน variant (เป็นการเลือก record ไม่ใช่การเปลี่ยนสี) · L4 เพิ่มขนาดหรือระยะว่าง · L5 ถอดลายออก — ถ้าความจริงบนหน้าเปลี่ยนเมื่อถอดลาย แปลว่าลายกำลังทำงานที่ไม่ได้รับอนุญาต ถ้าต้องการ `full` บนพื้นเข้มหรือ Brand Blue ในอนาคต Motif Studio ต้องผลิต final-state record เฉพาะพื้นเข้มแล้วลงทะเบียนพร้อม hash ก่อน (แบบที่ `ijji.four-beat.selected-3.r3` มี record หกพื้น) โลโก้ทำแบบนี้ไม่ได้เพราะหมุดต้องเป็น `#1D4497`

Acceptance:

- MOTIF-06-A — automated: ทุก `.lds-motif-frame` และ `[data-motif-static]` มี `data-host-surface` ที่ resolve ได้ใน `machine.contracts.motifRegister#/carrierPolicy/carriers`; คู่ kind × variant × carrier ของทุกธีมที่งาน render อยู่ใน `carrierPolicy.allowed`; frame แบบ full มี `ink="blue"` และ frame แบบ quiet ไม่มี ink อื่นนอกจาก sky; frame ที่สลับธีมมี SVG ทั้งสองแบบใน `<noscript>` แยก wrapper ตามธีม; `measure-motif-carriers-0.9.4.mjs --register` วัด 12 ไฟล์ × 20 carrier ใหม่แล้วตรงกับทะเบียน; preflight PF-MOTIF-06-CARRIER ผ่าน
- MOTIF-06-B — interaction/visual: ในเบราว์เซอร์ทั้งธีมสว่างและธีมมืด สีพื้นที่ render จริงหลังทุก frame และทุกภาพนิ่งเท่ากับ carrier ที่ประกาศ และทุก paint ของ final-state SVG ได้ 1.30:1 ขึ้นไปบนพื้นนั้น; สลับธีมแล้ว variant เปลี่ยนตาม `data-variant-dark`; frame ที่ถูกปฏิเสธไม่แสดงผล
- MOTIF-06-C — manual: เมื่อคู่ไม่ผ่าน การแก้เดินตาม L1–L5 และบันทึก `quietFallbackRung` ใน Build Card; ไม่มีการ recolor, แผ่นรอง, scrim, สีใหม่ หรือ opacity ที่ถือความหมาย

Machine binding: `machine.tokens#/motion/motifs` (kinds, jobs, beats, cycle, vocabulary, joy budget) และ `#/motion/productOverlays`, `machine.contracts.motifRegister` (ทุกไฟล์พร้อม SHA-256 และสถานะอนุมัติ; `#/carrierPolicy` ถือ carrier, ตารางที่วัด 240 คู่, คู่ที่อนุญาต, ladder, agent fields และ hash ของ ladder กับหลักฐาน), `machine.tokens#/motion/motifs/carrierPolicy`, `measure-motif-carriers-0.9.4.mjs`, `machine.contracts.componentContracts#component.motif-frame.01` และ `#component.motion-controller.01`, `capability-config.schema.json` (`motion.motionMoments[]` พร้อม `hostSurface`, `staticMotifPlacements[]`), `build-kit/preflight-0.9.4.mjs` (job, budget, placement, carrier, hash)

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

Agent Action ใช้ active machine contract โดยตรง ไม่ใช้ prose/YAML นี้เป็น copyable shape ตารางนี้เป็น normative field map; required/conditional shape ที่ exact อยู่ใน JSON schemas และ version/schema identity resolve จาก `machine.release`:

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

The seven reference-example positions below cover six primary formats, including square and OG social targets. Example files are optional, non-normative learning aids; create the artifact record from the embedded format/target/schema contracts โดย interactive app แยก browser และ native runtime แต่ reference เหล่านี้เป็นตัวอย่างโครงสร้างที่ complete สำหรับ context ที่บันทึกไว้เท่านั้น ไม่ใช่ universal preset และห้ามเลือก copy ไปใช้กับงานจริงโดยไม่ resolve ใหม่ ใช้ `(formatProfile, runtime)` เพื่อหา starting point:

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

Component contract ทุกตัวใน resolved record MUST มาจาก reference record ที่ตรง exact `(formatProfile, runtime)` หรือจาก `machine.contracts.formatPacks.componentContractTemplates` ที่ตรง exact format/runtime/component ID เท่านั้น สำหรับ document/PDF/deck ที่เลือก `component.bookmark.side.01` ให้ใช้ template ของ format นั้นเพื่อได้ TOC/PDF-bookmark/deck-section-marker behavior ที่ถูกต้อง ห้ามแก้ reference record ให้กลายเป็น preset, ห้ามยืม template ข้าม format และห้ามสร้าง contract เองเพื่อให้ component ID ผ่าน หาก component ใด resolve ไม่ได้หรือจำนวน/ลำดับ contract ไม่เท่ากับ `composition.componentIds` ต้อง block promotion

Browser ใช้ `authoringPlatform: browser` และห้ามมี native mapping งาน native/static non-browser MUST เลือก `authoringPlatform: macos | windows` หนึ่งค่า แล้วใช้ identity typography binding, native font mappings และ portability fixtures ของ platform เดียวกันทั้งหมด ห้าม mix platform หรือ copy macOS example ไปใช้ Windows Machine MUST block `reference_example` ที่ถูกใช้ใน `artifact_qa_passed` / `production_verified`, record ID ที่ไม่ deterministic, Build Card hash drift, experience/component/asset mismatch และ portability fixture ที่ขาด

Legacy key ใน Artifact Manifest ยังคงชื่อ `delivery.implementationBindings.preset` เพื่อ compatibility แต่ค่าที่ bind คือ resolved format-implementation record ไม่ใช่ reusable preset Reference และ resolved records ไม่ใช่ใบรับรองว่างานผ่าน และไม่ใช่คำกล่าวว่ามี native authoring template ทุกชนิดอยู่ใน package

### 11.3 Public web pack

**WEBFMT-01 — Public web output remains semantic and resilient.** Public web MUST provide semantic initial HTML, responsive layout, keyboard/touch operation, no-script primary meaning, stable URLs, discoverability signals, share preview (square feed creative และ OG link preview 1200 × 630 ตาม SOCIALFMT-01), one approved icon set ตาม FAVICON-01, `<title>` ตาม pattern `[page] · [product]` และ production verification

Acceptance:

- WEBFMT-01-A — automated: required rules pass supported viewport, locale, theme, no-script และ reduced-motion fixtures; icon set หกขนาด, web manifest, theme-color และ title pattern resolve (FAVICON-01-A); OG image resolve `target.social.og.1200x630.01` และ og:title/og:description ตรง template ของ SOCIALFMT-01
- WEBFMT-01-B — production: deployed routes, assets, metadata, forms/actions และ monitoring receipts pass

Required outputs: semantic initial HTML, responsive + print styles, canonical/locale graph, page-kind projection, social preview (feed square + OG 1200 × 630), icon set หกขนาด + web manifest + theme-color, `<title>` ตาม pattern, optional `llms.txt` navigation aid ตาม §10.7, no-script core meaning และ deployed-origin receipt Third-party embeds deferred และมี failure fallback `build-kit/skeleton.html` ของ release นี้มี head block ที่ครบตามรายการนี้ให้คัดลอกได้ตรง

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

**SOCIALFMT-01 — Social outputs are self-contained and destination-aware.** Static social ใน v0.9.6 MUST ใช้หนึ่งในสอง governed targets: `target.social.square.1080.01` ขนาด 1080 × 1080 สำหรับ feed post และ `target.social.og.1200x630.01` ขนาด 1200 × 630 สำหรับ link preview ที่ผูกกับ `publication.discovery.social` ของหน้า, communicate one approved message โดยไม่พึ่ง animation, preserve safe area, identify source/destination, use approved identity implementation และ legible at feed size Release นี้ยังไม่มี extension registry; social ratio/target อื่นนอกสองรายการนี้จึง unknown และ MUST block

Acceptance:

- SOCIALFMT-01-A — automated: output resolve governed target หนึ่งรายการพอดี (square 1080 × 1080 1:1 หรือ og 1200 × 630 40:21); dimensions, format, size, color profile, safe-area และ metadata pass โดยไม่มี undeclared target/extension; OG creative มี recogniser ครบสามอย่างและ og:title ≤ 60 / og:description ≤ 155 ตาม template
- SOCIALFMT-01-B — visual: square feed-size, center-crop และ safe-area fixtures (1080) และ text-safe 1000 × 560, central 630 square (LINE) และ 2:1 crop (X) fixtures (1200 × 630) preserve message, identity, evidence cue และ destination cue ≥ 22px; OCR + visual review ครอบคลุม OG image

**Amendment — link-preview target.** `social_static` gains a second target `target.social.og.1200x630.01`, bound to the page's `publication.discovery.social`; 1080×1080 remains for feed posts. The 1200×630 image carries three recognisers: the 8px four-colour rule on the top edge, a Brand Blue panel or one declared atmosphere, and the 3×5px measure line; the symbol or lockup is ≤ 56px tall. Text on the image states what the reader will see when they open the link and a destination cue at ≥ 22px; source, date and limitation appear when needed to interpret. Safe areas: text within 1000×560, symbol and first title line within the central 630 square (LINE), 2:1 crop tolerant (X). `og:title` = `[object] [period/scope] · [product]` ≤ 60; `og:description` = `[what you will see] · [source · date] · [limitation]` ≤ 155; post copy = observation / question the reader can answer / verb + destination. No exclamation marks, no "click now", no emoji, no unitless numbers. OCR and visual review cover the OG image.

OG image เป็น `social_preview` asset ของหน้าที่มัน represent: bind ผ่าน `discovery.socialPreview.imageAssetId` พร้อม `imageAltByLocale` และต้องตรง visible page/locale ตาม MEDIA-01; ห้ามใช้ motif หรือ animated variant บน OG image (MOTION-04) แม่แบบ `build-kit/og-1200x630.template.html` ของ release นี้วาง recogniser ทั้งสามและ safe areas ไว้แล้ว

ทุก `social_static` artifact MUST มี publication sidecar ที่ validate ด้วย current `social-sidecar.schema.json` in `machine.schemas` และ Artifact Manifest MUST bind exact `socialSidecarBinding` ref/hash/schema กับ creative path/hash เดียวกัน Sidecar MUST record artifact/build, claim/evidence, locale, campaign, rights, expiry, destination และ output-clarity state; campaign ID/channel/expiry MUST เท่ากับ Build Card `social_context` และ action MUST เท่ากับ available `experience.primaryActionRef` ที่มี `priority: primary` สร้าง shape จาก embedded current social-sidecar schema; example เมื่อมีเป็น optional reference ไม่ใช่ข้อมูลอนุมัติสำหรับงานใหม่ `builtAt`, promotion time และ production observation time เมื่อ applicable MUST อยู่ภายในทั้ง campaign window และ rights-validity window Destination verification MUST สำเร็จด้วยวิธีที่ตรง destination kind, bind exact evidence bytes และยังสดไม่เกิน declared TTL ซึ่ง MUST ไม่เกิน 24 ชั่วโมงทั้ง ณ promotion และ production boundary Visible `destinationCue` MUST derive แบบ deterministic: route/contact ใช้ target ตรงตัว; HTTPS external/download/form ตัดได้เฉพาะ `https://` โดยคง canonical host, non-default port, path, query และ fragment ทั้งหมด Creative bytes MUST decode เป็น canvas ตรง selected target profile: 1080 × 1080 สำหรับ square หรือ 1200 × 630 สำหรับ OG ไม่ใช่เชื่อ metadata declaration หรือ raster header อย่างเดียว

Creative MUST มี general audience-content inspection หนึ่งใบตาม `delivery.contentInspections[]` และ specialized social visible-copy inspection แยกอีกหนึ่งใบ ทั้งสอง bind creative subject/method/time เดียวกันแต่ห้ามใช้ record ชนิดหนึ่งแทนอีกชนิด Specialized record MUST ใช้ hash-bound OCR + visual review ที่ normalize ด้วย algorithm เดียวกับ sidecar แล้วเท่ากับ governed visible-copy projection พอดี: exact claim, material limitation ทุกข้อ, evidence cue ทุกอัน, CTA label/outcome และ destination cue ห้ามขาด เปลี่ยน หรือเพิ่ม visible overclaim/uncategorized claim CTA บน creative เป็น destination cue ที่ derive ตามกฎด้านบน ไม่ใช่ fake button หาก canonical cue ยาวเกิน layout ให้เปลี่ยน action ไปยัง approved short destination ก่อนผลิต ห้ามย่อ cue ให้ชี้คนละ target Sidecar ไม่แทน visible truth: หาก denominator/time/geography/source จำเป็นต่อการตีความ สิ่งนั้น MUST อยู่บน creative ด้วยขนาดอ่านได้ มิฉะนั้น artifact fail

### 11.9 Dataviz และ map overlays

Dataviz/map เป็น overlays บน primary format ไม่ใช่ format ที่แทน web/PDF/deck

**DATAVIZ-01 — Data visualization preserves analytical meaning.** Chart, score, comparison หรือ quantitative diagram MUST declare question, measure, unit, denominator, time, geography, grain, transform, uncertainty, schema release, claim/evidence IDs, scale และ accessible alternative Color ไม่เป็น carrier เดียว Truncated axis ต้องมีเหตุผล Observation แยก interpretation และ incompatible series ห้าม normalize เพื่อความสวย

Acceptance:

- DATAVIZ-01-A — automated: required overlay fields, scale (family จาก `machine.tokens#/analyticalScales` หรือ series จาก `machine.tokens#/categoricalSeries`), Build Card `scaleFamilies[]` และ `seriesVariant`, non-color cues, value states ของ EVID-05, claim/evidence IDs and accessible data alternative resolve
- DATAVIZ-01-B — manual: form, scale, baseline, ordering, annotation, uncertainty and conclusion preserve meaning in format

**DATAVIZ-02 — Sequential scales use three distinct-hue anchors and exact approved samples.** Select the family from the metric and its denominator, then the actual output theme. The authoritative analytical colors are the exact 41-sample sRGB lookup table in `machine.analyticalScales` for each family/theme; displayed anchors are summaries, not a recipe for recreating the table. Every intermediate knot and sample MUST remain exact. Do not interpolate a new palette at consumption, rebuild from endpoints/three anchors, or mix light and dark records.

Every sequential family MUST have three explicit approved anchors at positions 0%, 50%, 100% (LUT indices 0, 20, 40). The middle anchor MUST take a visibly different hue from the end; it is not merely a paler version of the end colour. Light-theme ramps begin with brand beige `#F2F1DF` and travel through the distinct middle hue to the approved high colour, for example cream → green → blue. Dark ramps use their independently approved start/end and matching distinct middle hue. OKLab lightness and relative luminance remain strictly one-way: decreasing in light and increasing in dark. This middle hue is a perceptual turn within one numerical direction, not zero, balance, a target threshold or a diverging pivot. All density families remain warm.

The three anchors define the authoring construction; consumers MUST use the delivered exact 41-sample LUT, never reproduce interpolation in CSS, HSL, a design tool or the application. A two-colour endpoint average, including a middle that is only a lighter end colour, is not the 0.9.6 sequential design.

| Family | Light anchors: low → middle → high | Dark anchors: low → middle → high |
|---|---|---|
| `activity` | `#F2F1DF` → `#DEA800` → `#BA1F1C` | `#C1332C` → `#D6A200` → `#FEDBD6` |
| `density.area` | `#F2F1DF` → `#D3BB00` → `#DD5B00` | `#DF5D00` → `#D3BB00` → `#FFE8D4` |
| `heat` | `#F2F1DF` → `#FF8DBC` → `#9E122B` | `#B68100` → `#FF94BF` → `#FFE4E3` |
| `risk` | `#F2F1DF` → `#EA8400` → `#7F0322` | `#C12440` → `#E68100` → `#FED6D6` |
| `price` | `#F2F1DF` → `#00BAE0` → `#005729` | `#227C45` → `#00B6DD` → `#BDF0C9` |
| `age` | `#F2F1DF` → `#1BC8B6` → `#3B5B0A` | `#527626` → `#10C5B2` → `#E1EDA0` |
| `density.household` | `#F2F1DF` → `#F851AE` → `#7C0206` | `#D1000E` → `#FB54B1` → `#FFD6D0` |
| `growth` | `#F2F1DF` → `#60B9FF` → `#005E4D` | `#007B66` → `#51B3FF` → `#B4F5E2` |
| `confidence` | `#F2F1DF` → `#55C583` → `#24338D` | `#4860BE` → `#52C180` → `#DBE4FD` |
| `count` | `#F2F1DF` → `#6FC25D` → `#005182` | `#036EAE` → `#6CBF59` → `#CFE8FE` |
| `water` | `#F2F1DF` → `#89C963` → `#005A68` | `#037687` → `#80BF59` → `#BFEEF8` |
| `density.capita` | `#F2F1DF` → `#FC8E00` → `#9E0067` | `#C40181` → `#FF972E` → `#FFD8E9` |
| `built` | `#F2F1DF` → `#FFBAD4` → `#D2A700` | `#BB9C00` → `#FFA7C9` → `#FFF19B` |
| `duration` | `#F2F1DF` → `#6CB17B` → `#1D3C4B` | `#546D79` → `#70B47F` → `#D8E7F0` |

Fourteen sequential families retain explicit meaning:

| Zone | Family | Select for |
|---|---|---|
| warm | `activity` | activity, transactions, usage |
| warm | `density.area` | per km² / per rai / other declared area denominator; orange |
| warm | `heat` | measured heat/temperature/hotspot quantity |
| warm | `risk` | source-supported hazard/risk quantity |
| warm | `density.household` | declared household denominator; scarlet |
| warm | `density.capita` | declared population/person denominator; rose |
| warm | `built` | governed built-form metrics; gold, including built-density measurements |
| green | `price` | price/appraisal/rent or other governed monetary quantity |
| green | `age` | elapsed building/business age |
| green | `growth` | cumulative index or growth rate |
| blue | `confidence` | stated estimate confidence/data quality |
| blue | `count` | totals such as population, firms or vehicles; not density |
| blue | `water` | governed water measurements |
| blue | `duration` | travel, waiting or inundation duration |

Density families are warm and visually distinct: area orange, people rose, households scarlet, built metrics gold. A topic alone does not choose a denominator. Legends MUST print the unit and denominator; never infer official population, eligibility, risk or behavior from the choice of color. Use the preserved `built` ID, not the ambiguous `density` alias.

One analytical surface uses at most one family per hue zone. Independently labelled panels with their own metric, legend and reading path are separate analytical surfaces. A reference color atlas intentionally compares families and is not a measurement overlay. These distinctions do not remove denominator labels or the need to make measurements distinguishable.

The six diverging families are `balance`, `delta`, `tradeoff`, `flow`, `sentiment`, `anomaly`. Their midpoint MUST be meaningful and named. Use their exact theme-specific table and preserve direction; do not assert equal brightness between arms. The neutral class generally spans a declared interval around the midpoint, not only an exact zero value.

Discrete classes use `n ∈ {3,5,7,9}` and exact indices `round(i × 40 / (n − 1))`, for integer `i = 0…n−1`. Prefer 5–7 for compact marks. Adjacent classes meet the approved 2.2 ΔE OKLab diagnostic threshold; all approved 0.9.6 sequential class sets also exceed the optional 3.0 diagnostic aspiration, and still require review at delivered size. This diagnostic is not a universal CVD-accessibility claim.

The consumer supplies domain, classification method, exact thresholds, unit, direction and outlier policy. A selector without a domain MUST NOT invent thresholds. Equal intervals may be generated only when explicitly labelled and appropriate to the analysis. Continuous intervals are `[lower, upper)` except the final closed interval. Values outside the domain need explicit rejection, approved extension or a declared end-bin; never silently clamp. Renderer, legend, accessible values/table and export MUST use identical thresholds and colors.

Acceptance:

- DATAVIZ-02-A — automated: selected family/theme resolves an exact current LUT with 41 samples and its three approved anchors at 0/20/40; every sequential record matches the owner-approved distinct-middle-hue R2 source and both lightness/luminance remain one-way; classes use only approved counts and exact sample indices; domain/unit/denominator/thresholds/outlier handling are declared and identical across renderer, legend, accessible data and export; one family per zone per analytical surface; no ambiguous density alias
- DATAVIZ-02-B — visual: the actual continuous ramp and selected classes are readable without band/hue reversal at their delivered sizes in each offered theme/print context; independent analytical panels preserve clear family/denominator labels and accessible non-color alternatives

**DATAVIZ-03 — Each theme uses its exact approved analytical table.** Every dark analytical sample MUST equal its approved `color-srgb-09` dark record. Dark records are independently approved deliverables; consumers MUST NOT derive them from the light anchors, substitute a light ramp, restrict warm families to mid→high, or introduce custom dark overrides. Preserve the full approved range and all intermediate knots in both themes. Sample parity is separate from actual contrast and readability on the artifact's surface.

Acceptance:

- DATAVIZ-03-A — automated: every dark LUT/class/override equals the exact approved family/theme record and sample index; no runtime light-to-dark derivation, truncated warm range or custom interpolation is used
- DATAVIZ-03-B — automated: sequential lightness direction and diverging-arm direction, approved class-step diagnostics, exact theme parity and applicable hue-window checks pass for all shipped records; results bind the actual delivered bytes
- DATAVIZ-03-C — visual: dark ramps are readable at actual size and on the intended surface; review low/high values and family distinction on the delivered screen, including low brightness when relevant, without claiming that numeric diagnostics replace this review

**GATE-01 — Data-colour gates run for both themes on every release.** Validate the current approved snapshot, exact token/LUT/production-CSS projections, all 20 families × 2 themes × 41 samples, categorical fill/ink and declared step/hue diagnostics. A mismatch or undeclared failure blocks package use. Save scoped, dated evidence bound to the exact files/hashes; historical gate reports do not certify new bytes. Package checks MUST NOT be described as complete artifact, native-language, CVD or account-installation validation.

The current package verifier checks immutable-source integrity, approved color snapshot parity, typed policy, complete assets and analytical mathematics. The artifact checker separately inspects supported delivered formats and reports its limits. Actual foreground/background contrast, gray/CVD usability, thresholds, native Thai/English composition, keyboard/zoom and export review remain artifact-specific. No new exception may be invented to bypass a failed MUST; any proposed normative change requires owner decision and the version policy in §0.2.

Acceptance:

- GATE-01-A — automated: current exact snapshot, token/LUT/CSS parity, 40 records/1,640 samples, approved class indices/steps and applicable hue checks pass with hash-bound evidence; failed or untested checks are not reported as pass
- GATE-01-B — manual: the release record accurately distinguishes owner approval, package diagnostics and artifact review; no new exception, signature, conformance level or platform activation is claimed without its actual authority/evidence

**DATAVIZ-04 — Analytical values stay out of the retired hue windows.** Every delivered analytical LUT sample, class, anchor and categorical fill/ink in both themes must satisfy the applicable retired-color gates. Earth: OKLCh H 30–100°, C .035–.145, L ≤ .62. Violet: H 285–345°, C ≥ .04. Light clay band H 22–100°, C .09–.145, L .62–.74 is a warning. Proximity to the eight retired earth/taupe values within a 20° hue lane must not be below ΔE 6. The ten exact retired values remain prohibited. Warm pink H 350–20° is allowed; no new token may be minted to escape a gate. The exact retired-value list and gate parameters are in the embedded machine contract.

The scope includes all 41 samples, not only three displayed anchors. Governed semantic states and approved image pixels keep their own role-specific contracts; the analytical ban does not authorize recoloring identity artwork or evidence media.

Acceptance:

- DATAVIZ-04-A — automated: all current analytical samples/classes and categorical values satisfy the applicable earth/violet/proximity/exact-retired-value gates; light clay warnings are recorded; overrides pass the same checks and do not invent escape tokens
- DATAVIZ-04-B — visual: delivered ramps/categories do not read as rejected brown, terracotta or violet; legal warm pink reads as intended in both offered themes on the actual screen/export

**DATAVIZ-05 — Categorical series are luminous and edge-separated.** Use `landometer-series-10-v8`, ten stable category IDs with exact theme-specific soft/vivid fill and ink roles. Current light values are retained; current dark soft/vivid/ink values are the approved redesigned set. Assignments persist by category ID through filtering and sorting. Default is soft; vivid is an explicit surface choice. Vivid charts and energy accents MUST NOT compete on the same surface. The governed sky energy-accent cue retains its surface constraints even in soft.

Fills need not reach 3:1 against canvas: adjacent areas require a ≥1px `border.default` edge or an ink outline; legend swatches require a hairline border. Text, lines and marks thinner than 3px use the ink tier, with ≥4.5:1 for normal text on its actual canvas/card. Where ink falls back to `text.primary`, category identity remains in fill plus cue. Preserve the ten cue assignments: circle, square, triangle, diamond, cross, star, hexagon, ring, dash, plus. Every use needs a non-color cue; slots 7–10 require their shape cue. Do not restore old v5 aliases or substitute old dark values.

Acceptance:

- DATAVIZ-05-A — automated: colors resolve the exact v8 category/theme/variant/ink records by stable category ID; normal ink reaches 4.5:1 on its actual surface; required edges/legend borders and shape cues are present; thin marks use ink; delivered variant agrees with the Build Card and does not share a surface with a forbidden energy accent
- DATAVIZ-05-B — visual: categories remain distinguishable at actual feed/print/dark sizes through labels/shapes/position as well as color; category-ID assignments do not change when filtered or sorted; no universal color-vision-accessibility claim is inferred from hue differences

**MAP-01 — Maps preserve geography and coverage truth.** Map overlay MUST declare geography ID, boundary source, purpose, covered area, grain, time, unit, schema release, attribution/rights, projection เมื่อมีผล, หกสถานะของค่าตาม EVID-05 (`measured`, `measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`) รวมทั้ง low-confidence/selected/focus states และ nonspatial alternative Export records viewport/zoom/filters/data receipt It MUST NOT imply unsupported coverage, treat missing as zero or generalize product classification

Acceptance:

- MAP-01-A — automated: fields/states/attribution/alternative/export receipt resolve; `dataStates` ครอบคลุม enum หกค่าของ EVID-05 ที่เกิดจริงในข้อมูล และ MapLegend แสดง state rows ที่มี
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
11. scale families ต่อ surface (`scaleFamilies[]` ไม่เกินหนึ่งต่อโซน) และ `seriesVariant` เมื่อมี categorical chart
12. value state ของทุกค่าที่เป็น 0 หรือว่าง (EVID-05) และแหล่ง/วันที่ที่ EvidenceCard จะพิมพ์
13. icon set, `<title>` และ OG preview ของงานเว็บ; runtime hash และ pause control ของงานที่มี identity motion
14. motion moments ของเส้นทาง (`motionMoments[]`: kind, job จาก manifest, beat; ≤ 3 ต่อ route, ≤ 1 ต่อ task surface) และการยืนยันว่าไม่มี motif บน first answer, primary proof หรือ primary action; product overlay ที่ใช้ต้องอ้าง `machine.contracts.motifRegister` ด้วย hash
15. LUT, class indices และ categorical values ตรง approved theme-specific records ทุกค่า; domain, denominator, thresholds และ outlier policy ตรง renderer/legend/accessible table/export; ตรวจทั้งสองธีมตาม GATE-01

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

Owner-recorded bilingual semantic review applies only to the exact reviewed text and machine projection. This consolidated document preserves current obligations and records the source and changed ranges; generation or automated parity MUST NOT be presented as a fresh owner bilingual review. Validator ตรวจได้เฉพาะสิ่งที่รายงานว่าตรวจจริง; ผลผ่าน MUST NOT ถูกอ้างว่าได้ตรวจความหมายหรือคุณภาพภาษาแล้ว การเปลี่ยน normative meaning หลัง owner review ต้องมี owner-recorded review ใหม่ก่อนอ้าง semantic approval.

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

**CAPABILITY-01 — Capabilities resolve explicit rule packs.** Declared capability ทุกอัน MUST resolve known rule set, required fields, fallback and test matrix Unknown capability/unsupported format blocks resolution Side effect, authorization, autoplay, public indexing and nonessential motion default off until approved truth enables `machine.contracts.formatPacks.overlays` MUST cover capability enum ทั้ง 16 ค่าพอดีแบบไม่ซ้ำและไม่ขาด

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

**QA-01 — Conformance is receipt-based.** Conformance MUST computed จาก applicable automated, manual, visual, interaction, accessibility และ production checks ที่มี dated receipts v0.9.6 ไม่รับ exception reference ใน artifact conformance: Build Card `qa.exceptionIds` และ Artifact Manifest `resolution.exceptionRefs` MUST เป็น `[]` ทั้งคู่

Acceptance:

- QA-01-A — automated: applicable required check ทุกอันมี current passing receipt และไม่มี blocking failure
- QA-01-B — manual: arrays ทั้งสองเป็นศูนย์และไม่มี MUST หรือ MUST NOT deviation ถูกนำเสนอว่า conforming; SHOULD recommendations are reported separately when useful

ผลของ resolved acceptance/layer/gate ใช้ `pass`, `fail` หรือ `not_tested` เท่านั้น; `not_tested` ไม่สามารถนับเป็น pass กฎที่ไม่ใช้ระบุแยกใน `resolution.nonApplicableRuleIds` และต้องอธิบาย trigger/owner ตาม machine contract Aggregate score ห้ามซ่อน failed MUST

Conformance receipt MUST เป็น bundle-local, validate ด้วย `conformance-receipt.schema.json` และ bind subject/file bytes ด้วย SHA-256 Manifest layer หรือ gate claim ที่เป็น `pass` MUST มี receipt ref + hash ที่ resolve ได้; คำว่า pass ใน prose หรือ dashboard ไม่พอ ก่อน claim `artifact_qa_passed` ทั้ง discovery/readability/action MUST `pass`, resolved non-production acceptances ทั้งหมด MUST `pass`, และ receipt ของ OUTPUT-CLARITY-01-A MUST list exact `delivery.files` set พร้อม SHA-256 ครบทุกรายการ ก่อน claim `production_verified` resolved production acceptances ทั้งหมด MUST `pass` และ receipt ของ OUTPUT-CLARITY-01-B MUST cover exact set และ hashes ชุดเดียวกัน; coverage ที่ขาดหรือเกินล้วน blocks level claim

แต่ receipt ที่ signed แยกชิ้นยังห้ามใช้ replay หลัง Build Card หรือ governance เปลี่ยน `artifact_qa_passed` และ `production_verified` MUST bind `validation.promotionSnapshot` ที่ validate ด้วย `promotion-snapshot.schema.json` และมี detached `promotion_snapshot` attestation จาก externally pinned operator key Snapshot เป็น non-circular record ที่ bind exact Build Card bytes, canonical Artifact Manifest promotion projection, artifact-resolved format-implementation record, social sidecar เมื่อมี, implementation source + lineage receipts/attestations, final outputs และ receipt/attestation ทุกใบของ phase นั้น Snapshot ที่ขาด/เกิน, hash drift หรือใช้กับ artifact/build อื่น MUST block promotion

Approval, conformance, promotion, confirmation, execution และ source-lineage result ที่ใช้เลื่อนสถานะหรืออนุญาตการกระทำ MUST มี detached Ed25519 attestation ที่ validate ด้วย `verification-attestation.schema.json` v1.1 และ bind exact purpose, subject ref/hash/media type, issuer, key และเวลา Signature MUST verify ด้วย purpose-authorized, unrevoked, unexpired key ที่ caller-controlled policy pin exact `trustStoreId`, `issuerId`, `keyId` และ public-key SPKI SHA-256

- This release is an unsigned owner-approved distribution. Its package checksum and exact source parity MUST be verified when execution is available; these checks do not create a cryptographic signature or authorize artifact promotion. Historical signatures authenticate only their original subjects. A consumer requiring signed package authority MUST report that requirement unsatisfied for this distribution. The package MUST NOT create a trust anchor that authorizes itself.
- downstream artifact promotion/conformance, source lineage, agent confirmation และ terminal execution MUST ใช้ separate `operator_external` trust store + matching pinned policy ที่ผู้ตรวจควบคุมและได้รับจากช่องทางอิสระจาก artifact bundle
- การวาง trust JSON ไว้นอก bundle หรือเป็น sibling file อย่างเดียวไม่สร้าง authority; policy key fingerprint ต้องตรงทุก key และ key ที่ revoked/expired ณ current verification time MUST fail หากต้องยอมรับประวัติหลัง key ถูก revoke ต้องมี independent trusted timestamp contract ซึ่ง v0.9.6 ยังไม่ให้ exception path
- key, trust store หรือ trust policy ที่ artifact สร้างและแนบมาเอง MUST NOT ให้อำนาจรับรอง artifact นั้น

`machine.ruleCatalog.resolvedAcceptancePolicy: every_resolved_acceptance_must_pass` ร่วมกับการวาง OUTPUT-CLARITY-01 และ QA-01 ใน common rule set ทำให้ OUTPUT-CLARITY-01-A/C และ QA-01-A เป็น non-waivable receipts ที่ต้อง `pass` ก่อน `artifact_qa_passed`; OUTPUT-CLARITY-01-B ต้อง `pass` เพิ่มก่อน `production_verified` และห้ามเปลี่ยนเป็น `not_applicable`

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
| QG-12 data colour (GATE-01) | Exact LUT/class/series parity ทั้งสองธีม, 41 samples ต่อ family/theme, approved step/hue checks และ evidence ที่ bind hashes ของค่าที่ส่งจริง; ไม่มี runtime interpolation หรือ alias ที่ห้ามใช้; contrast/legend/CVD และขนาดจริงตรวจแยกใน artifact |
| QG-13 motion budget (MOTIF-01…06) | ทุก motif มี job ที่ลงทะเบียน, byte ตรง hash, moments ≤ 3 ต่อ route, ไม่มี motif บนบริเวณต้องห้าม, overlay ตรง product layer, ทุกการวางอยู่บนพื้นที่วัดแล้วในทุกธีมที่ render (MOTIF-06) |

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
- dataviz/data states: exact approved theme LUTs and class indices, no analytical sample inside an applicable retired hue window, current GATE-01 evidence, scale family per analytical surface/zone, series variant versus energy accent, six labelled value states, and no numeric/null machine value without its state
- web identity (v0.9.6): six icon sizes + manifest + theme-color, title pattern, OG 1200 × 630 recognisers and safe areas
- identity motion and motifs (v0.9.6): runtime and SVG hash parity, registered job per motif, ≤ 3 moments per route and none in forbidden regions, replay while ≥ 14% visible, stop off-screen, page pause, reduced-motion/no-JS/print final state, no infinite iteration

### 14.4 No artifact exception channel in v0.9.6

Active machine contracts enforce `qa.exceptionIds: []` and `resolution.exceptionRefs: []` with `maxItems: 0` ไม่มี prose record, owner note หรือ approval message ใด bypass เงื่อนไขนี้ได้ ถ้าจำเป็นต้องรองรับ deviation แบบ typed ในอนาคต ต้องออก normative Design System release ใหม่ที่เพิ่ม schema, authority, expiry/removal test และ migration อย่างชัดเจน ก่อนหน้านั้น artifact ที่มี deviation ยังเป็น failed/blocked/internal preview ตามผลกระทบ ไม่ใช่ conforming output

### 14.5 Release activation และ artifact production boundary

This document is the consolidated normative reference for owner-approved `v0.9.6-owner.1`. It is an unsigned distribution. Its package verifier checks the scope declared in `machine.release`; successful checks do not create a signature, a fresh bilingual approval or a final-artifact receipt. Preserve actual results and report unavailable checks as pending/not tested.

Each artifact still needs applicable evidence before claiming `artifact_qa_passed` or `production_verified`:

1. exact role-scoped identity/media/font/icon asset authority and byte hashes;
2. selected format kit, target profile and artifact-resolved implementation record, final delivery files, required fixture reports/receipts, and the actual editable/source assets used;
3. Thai/Latin typography, navigation/bookmark/CTA, accessibility, motion/fail-open and format-parity checks;
4. claim/evidence/rights/product-boundary checks;
5. deployed-origin or final-export verification for the selected format;
6. automated, manual and production OUTPUT-CLARITY-01 evidence.

Formal signed artifact promotion retains the operator trust/attestation obligations in QA-01. If that evidence is absent, report the concrete checks performed without assigning the formal conformance level. A package check, upload or successful generation is not artifact promotion.

Semantic kit/target records and reference examples are starting points. Resolve an `artifact_resolved` record from the real Build Card; examples are not universal templates or product evidence. Source assets actually used require their own exact bindings.

For ChatGPT/Claude Project Sources, upload this one-file edition and set project instructions to use its exact release for new relevant work. Open a new conversation and verify that it can identify the release, protected brand lines, six value states and exact requested scale samples from the file. For coding/design clients, load the same document or verified package plus the binary assets needed by that output. Upload success alone does not prove retrieval, tool use, account policy or team-wide installation. Each relevant project/client needs its own activation evidence.

## 15. Migration to v0.9.6

The only numerical colour change from 0.9.5 is the 28 sequential family/theme records: 14 light and 14 dark. Adopt all approved anchors, 41 samples and 3/5/7/9 classes together; replace the stylesheet/token import and pin `color-srgb-09`. The 12 diverging records, categorical values, atmosphere recipes, foundation, fonts, logo source files, brand voice and motif/animation contracts remain unchanged. A product Add-on remains separate and binds this complete base by exact hash. Historical 0.9.5 release files retain their identities and bytes.

### 15.1 Retained foundations

Retain approved brand voice, protected wording and roles, identity artwork, script-aware typography, foundations, semantic states, seven atmosphere recipes, layout, navigation, actions, truthful evidence, accessibility, output-format equivalence and motion lifecycle. The full current requirements remain in their chapters above; this migration section does not substitute for them.

### 15.2 Current replacements

| Area | Current v0.9.6 behavior |
|---|---|
| Analytical colors | exact approved 41-sample table per family/theme; no runtime palette reconstruction |
| Density | warm distinct area/orange, people/rose, households/scarlet and built/gold; denominator stays visible |
| Dark analytical theme | exact approved dark table; preserve the complete range |
| Category colors | v8 stable IDs/cues, retained light and redesigned dark soft/vivid/ink |
| Value states | measured finite nonzero, measured_zero numeric0, four exceptional states null |
| Social | decoded creative matches either square1080×1080 or OG1200×630; full sidecar/visible-copy obligations remain |
| Visual selection | restrained background/text/spacing; no decorative bracket or colored left rail; visible focus remains |
| Distribution | owner-approved unsigned0.9.6; exact checks reported separately from formal artifact certification |
| Project Source | one complete shared LDS normative file with embedded machine records; product-scoped work adds a separate current product Add-on; no earlier LDS master or overlay is required |

### 15.3 Migration procedure

Declare the migration in the artifact's Build Card and replace its current release binding, controlled color projection, LUTs, classes and state contract together. Remove old analytical aliases and duplicate current rules from the active instruction layer. Preserve exact historical sources for explicitly pinned artifacts and audit. Do not relabel old signed bytes, overwrite published registry identities or copy an old pass receipt to a new build.

Recheck actual Thai/English composition and every new section at narrow/desktop sizes in all offered themes. Revalidate analytical meaning, output format, accessibility, asset bytes and production routes. A token replacement does not prove that layout or meaning survived.

### 15.4 Historical provenance

Source and supersession records are in Appendix A and the document's embedded provenance. They explain how this edition was consolidated; they are not additional normative files or instructions to restore historical formulas, colors or signing claims.

## 16. Learning cases — Example, non-normative

**Status of this whole section: Example — non-normative.** Cases A–F and the three rejected cases illustrate how existing rules can be applied. They do not create requirements, defaults, acceptance criteria, evidence, product facts or exception paths. Project truth and obligations come only from the resolved normative Build Card, authority, claims, assets, artifact-resolved format-implementation record and rule catalog; copied case content establishes none of them.

Case metadata shared by every example: `sourceVersion: v0.9.6-owner.1`; `mediaStatus: conceptual_no_product_evidence`. Each case lists the active rule blocks it illustrates as `ruleAuthority`; those blocks—not the case—remain authoritative.

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

### Example F — Good: an EvidenceCard inside a third-party AI answer

`ruleAuthority: EVID-05, EVIDENCE-01, CLAIM-MACHINE-01, DATAVIZ-02`

A chat assistant quotes a Living figure "0 new factories registered in this sub-district in 2025" The card carries the 3px four-colour rule, TrustBadge, `0 แห่ง` with state `measured_zero`, dataset, source, date, boundary, the limitation "survey covers registered factories only", the 3 × 3px measure line, the permanent URL and the receipt id; the text-only fallback is one line with the same fields No logo, no panel, no gradient, no motion

Pass because the reader can tell zero from missing, can open the source, and nothing on the card claims more than the record

### Rejected example — vivid series beside an energy hero

`ruleAuthority: DATAVIZ-04, COLOR-01, SURFACE-01`

A product page places a `dial-vivid` categorical chart under a hero that uses `energy.mint` and `energy.sky` accents, and colours the sixth to tenth categories by hue only

Reject: vivid coral/yellow/mint/sky sit within ΔE 6 of the energy tokens, so accents and categories read as one system; slots 7–10 lose identification without shape cues

Correct path: `dial-soft` on that surface (or move the chart to a surface without energy accents), ink tier for labels and thin marks, shape cues from slot 7, hairline legend borders

---

## 17. Embedded machine contract และ asset delivery

The final standalone Markdown contains one parseable JSON object in its final labelled machine-data block. Read that object's fields directly; do not scrape approximate numbers from prose or load a predecessor master. A JSON edition, when supplied, is a generated projection of the same contract rather than a competing source.

| Payload key | Purpose |
|---|---|
| `document` | standalone identity, source provenance and consolidation metadata |
| `release` | exact owner-approved unsigned release identity |
| `policy` | current semantic/analytical/category/verification constraints |
| `ruleCatalog` | 64 stable rule IDs, triggers, methods and acceptance criteria corresponding to this human master |
| `tokens` | current brand, atmosphere, foundation, semantic/data state, typography, controls, layout, theme and motion roles |
| `colorRegistry` | exact current governed color roles |
| `analyticalScales` | all 20 families × 2 themes × 41 exact samples, class records, meaning/unit and outlier policy |
| `contracts.componentContracts` | EvidenceCard, MotifFrame, MotionController, DataTable and MapLegend |
| `contracts.formatPacks` / `formatKits` / `targetProfiles` | selected-format requirements, geometry, fixtures and implementation equivalence |
| `contracts.motifRegister` | exact shared/product registrations, jobs, beats, measured carrier restrictions and source hashes |
| `contracts.assetRegistry` | identity/font/icon/media roles, permissions, exact hashes and permitted delivery contexts |
| `schemas` | complete named schema resources and their exact canonical `$id` values |
| `assetFiles` | exact downloadable binary/code files with URLs, SHA-256 and sizes |

The document can stand alone as a normative Project Source. Real font/image/runtime bytes are delivered as assets because Markdown descriptions cannot replace them. Retrieve the exact bytes for the selected role/output, verify their hashes, and retain all required relative dependencies. A missing mandatory asset remains a missing dependency; do not draw an equivalent logo, synthesize a font or substitute a different product symbol.

Examples and historical provenance are labelled. They never supply product fact, evidence, permission, external trust authority or an artifact pass. Operators' private-key tools MUST NOT be run by an agent; the document does not grant signing authority.

### 17.1 Artifact manifest contract

ใช้ schema identity และ contract ของ Artifact Manifest จาก `machine.schemas["artifact-manifest.schema.json"]` ห้ามคัดลอก version, schema ID หรือ hash จาก prose Example fixture เมื่อมีเป็น optional reference ไม่ให้สถานะ pass แก่งานใหม่ ตารางนี้เป็น human field map; สร้างและตรวจ record ของงานกับ embedded schema และ bytes ของงานจริง

| Object | Required contract |
|---|---|
| root | `schemaVersion`, `release`, `artifact`, `resolution`, `representation`, `delivery`, `validation` |
| release | `releaseRef`, canonical `releaseTupleSha256` |
| artifact | `id`, `buildCardRef`, exact `buildCardSha256`, immutable `artifactBuildId` |
| resolution | `experienceProfile`, exact Build Card `secondaryExperienceProfiles`, `formatPack`, `targetProfileRef`, `capabilityPacks`, `resolvedRuleIds`, resolver-derived `resolvedTestIds`, `nonApplicableRuleIds`, exact `exceptionRefs: []`; resolved + non-applicable rule IDs partition the catalog exactly, while resolved tests exactly cover common, experience, format, capability, target, kit, accessibility and selected-platform portability requirements in that deterministic order |
| representation | exact Build Card `navigation`, including every destination's scoped `current: none \| page \| location`; interactive non-empty navigation has exactly one page route and at most one location anchor, interactive side bookmark has exactly one location, while static formats and `mode: none` never invent current state; exact `actionIds`, `claimIds`; non-empty claims require `claimManifestRef`, `claimManifestSha256`, `claimAsOf`; `localeStates` equals Build Card `locale.states` exactly; and `outputClarity` |
| outputClarity | อยู่ใต้ `representation`; `mode: resolved_only`, `deliveryAudience`, `disclosurePurpose`, `internalGovernanceVisible: false`, blocker refs, zero placeholder count, material-limitation refs; nonordinary purpose adds `disclosureAuthorityRef` + `disclosureAuthoritySha256`, production adds residue-scan receipt |
| delivery | exact audience-delivered `files`; exact one-per-file `contentInspections` with subject hash/media type, format-bound method, dated result and hash-bound evidence—DOCX/PPTX/PDF additionally bind page/slide kind and count, `every_page_or_slide` coverage, combined extraction+OCR+visual method, explicit image-only/outlined-text review, deterministic combined-text hash และ hash-bound raster per unit; `implementationBindings` for selected format-kit record, target-profile record and artifact-resolved format-implementation record; `implementationSourceBindings` for every editable source, template, export preset, style map, component source, or other governed production file actually used, with `audienceDelivered: true` exactly when the same ref/hash/media type is also in `files`; ID-bound `assetBindings`; audience `metadataProjection`; and audience `accessibilityProjection` whose reading order, semantic/interaction/text-layout states, capability-derived alternatives/motion, contrast minima, fixture IDs และ fixture-report summary exactly match `machine.contracts.formatPacks.accessibilityProjectionContract`—static social therefore cannot claim headings, landmarks or controls verified; web additionally binds the exact delivered primary initial document through `primaryHtmlBinding` and `webDiscoveryEvidence` for no-script, hydrated DOM, accessibility tree, internal locale links and sitemap; parsed/evidenced surfaces must equal Build Card discovery/claim/action contracts exactly; social additionally binds time-valid campaign/rights/destination evidence and normalized exact-copy OCR+visual parity; non-web uses `format_metadata` with exact format/primary locale; `files` rejects both canonical paths and exact hashes of every raw color registry file (raw registries with internal provenance from any release; the standalone DS reference itself is purpose-scoped documentation, while ordinary product outputs emit only the necessary sanitized roles/values); every asset binding matches the Build Card asset and artifact-owned registry entry, while an approved asset's receipt grant matches exact `assetId`, `role`, `sha256`, `allowedFormatProfiles`, `allowedSurfaceRoles`, `allowedAudiences`, `publicationPermission`, `licenseOrPermission`, `fallback`, and role-specific `glyphs` or `altOrTextEquivalent` |
| validation | package/artifact/production phase states, computed conformance level, three universal layer results, `resolvedTestResults` that exactly cover the phase's `resolvedTestIds` with unique bundle-local evidence bound to test ID, artifact build, governed method, pass result, observation time, and exact criterion text + SHA-256 derived from common, experience, format, capability, target, kit, accessibility and selected-platform portability registries in deterministic order (generic self-authored summaries do not pass), and dated acceptance/gate receipts keyed by catalog acceptance ID with criterion assertion + hash; at `artifact_qa_passed` discovery/readability/action, every resolved non-production test and acceptance are `pass`, required accessibility and portability fixture receipts exactly match the artifact-resolved implementation record, and OUTPUT-CLARITY-01-A covers the exact `delivery.files` set/hashes and cites every content-inspection evidence file; at `production_verified` every resolved production test and acceptance also passes, the returned web bytes equal `primaryHtmlBinding.sha256`, and OUTPUT-CLARITY-01-B covers that same exact file/inspection set |

Phase states use `pending`, `passed`, `failed` หรือ `not_applicable`; resolved acceptance/layer/gate results use `pass`, `fail` หรือ `not_tested` เท่านั้น การไม่ใช้กฎอยู่ใน `resolution.nonApplicableRuleIds` ไม่ใช่ layer/gate result ก่อน `artifact_qa_passed` ทั้ง discovery/readability/action MUST เป็น required + `pass` และ resolved non-production acceptance ทุกอัน MUST `pass`; information/read-only artifact พิสูจน์ action layer ด้วยขอบเขตที่ซื่อตรง ไม่ใช้ `not_applicable` `fail` หรือ `not_tested` blocks artifact-QA promotion

`releaseTupleSha256` MUST คำนวณจาก tuple fields และ canonicalization algorithm ที่ active validator บังคับ แล้ว bind ค่าที่ได้ใน manifest ห้ามคัดลอก digest จาก prose หรือจาก artifact อื่น

### 17.2 Current catalog coverage

The current machine catalog covers the following 64 stable rule IDs. Coverage is not an assertion that every final artifact has passed their applicable checks:

GOV-01, AUTHORITY-01, LAYER-01, COMPARE-01, EVIDENCE-01, EVID-05, OUTPUT-CLARITY-01, AHA-01, BRAND-01, LOGO-01, FAVICON-01, COLOR-01, SURFACE-01, TYPE-01, ICON-01, LAYOUT-01, CTRL-01, THEME-01, ASSET-DELIVERY-01, PROFILE-01, CAPABILITY-01, PARITY-01, NAV-01, NAV-02, BOOKMARK-01, CTA-01, CTA-02, MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTIF-01, MOTIF-02, MOTIF-03, MOTIF-04, MOTIF-05, MOTIF-06, A11Y-01, CLAIM-MACHINE-01, DISCOVERY-01, DISCOVERY-02, DISCOVERY-03, AGENT-01, SECURITY-01, DATAVIZ-01, DATAVIZ-02, DATAVIZ-03, DATAVIZ-04, DATAVIZ-05, GATE-01, MAP-01, WEBFMT-01, APPFMT-01, DOCFMT-01, PDFFMT-01, DECKFMT-01, SOCIALFMT-01, FORMAT-PARITY-01, COMPONENT-01, MEDIA-01, CAROUSEL-01, SOCIAL-FEED-01, QA-01 และ RELEASE-01

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
- montri-th/motif release 1.2.1 (runtime, final-state SVG, motif-library.json, OWNER-MOTION-01): https://github.com/montri-th/motif · https://montri-th.github.io/motif/
- Björn Ottosson, OKLab colour space (basis of approved LUT construction and ΔE measurements; runtime uses exact samples): https://bottosson.github.io/posts/oklab/
- Web app manifest, maskable icons: https://www.w3.org/TR/appmanifest/ · https://web.dev/articles/maskable-icon
- The Open Graph protocol: https://ogp.me/

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
14. Every chart or map resolves its scale families per analytical surface/zone and series variant; every governed value carries one of the six EVID-05 states, with finite nonzero/zero/null machine values as defined.
15. (v0.9.6) every web build binds one approved icon set, a pattern-conformant title and an OG 1200 × 630 preview; identity motion, when used, ships the exact runtime bytes, replays only while visible, stops off-screen, and holds the final state under reduced motion, no-JavaScript and print
16. (v0.9.6) every motif carries a registered job, a beat and a hash-exact final state; a route carries at most three motion moments and none on the first answer, the primary proof or the primary action; every motif placement declares its host surface and passes the measured carrier table in every theme it renders (MOTIF-06); every delivered scale sample/class and series value equals the approved theme-specific record, no analytical value sits in an applicable retired hue window (DATAVIZ-04), and GATE-01 evidence binds the exact delivered asset hashes

---

## 20. Roles: ใครใช้ release นี้อย่างไร

ทุกบทบาทใช้กติกาชุดเดียวในไฟล์นี้ เริ่มจากหัวข้อที่เกี่ยวข้อง แล้วเปิด machine records ตามงาน ไม่ต้องประกอบ master รุ่นเก่ากับส่วนเพิ่ม

| Role | Start | Use and verify |
|---|---|---|
| AI / agent | §0–3, §12–14 | resolve release/product/job; use exact embedded values; preserve evidence and product boundaries; never invent approvals, retrieval, installation or a test pass |
| Developer | §5–12, §17 | exact assets/build-kit and scale tables, current component/schema contracts; run available package/artifact checks and inspect actual runtime/output |
| Designer | §4–9, §11.9 | brand voice/identity, type/layout, exact current colors, six evidence states, measured motif carriers and actual-size visual review |
| Product | §2–3, §7, §11 | one job/first useful value/action, real capabilities and permissions, denominator/threshold/state requirements and truthful outcomes |
| Marketing | §3–5, §8.6, §11.8 | supported claims, approved protected wording, static social/OG safe areas, exact visible destination and current evidence |
| Sales | §3–4, §7 | EvidenceCard and claim/source/limitation, action promise and real product availability; no unsupported price, contract, pipeline or traction claim |
| Reader / project maintainer | §0, §15, §19 | add the complete shared LDS file to Project Sources; for product-scoped work also add the separate current product Add-on; retire superseded design instructions, then verify retrieval in a new conversation |

Product status and evidence labels come from the product's approved truth and the governed label set; tester counts are not traction, an LOI is not a contract, and candidate examples do not authorize external claims. The complete LDS is the common foundation for every product. Product-specific rules belong in a separate Add-on used alongside this foundation, with the ownership boundaries of LAYER-01; the Add-on does not reproduce the shared DS.

Successful adoption means a person or agent can identify the current shared source and any required product Add-on, use exact ready assets and learn from actionable check results. A local install does not establish ChatGPT or Claude organization activation. Verify each relevant project and client separately and report the actual coverage.

## 21. Release boundaries and recorded follow-ups

This edition consolidates the approved DS 0.9.6 contract without making the user load predecessor rules. Approved colors, category IDs, protected language, six value states and social targets are authoritative as printed and embedded here. It does not silently resolve unrelated product-asset, external-repository, source-reconstruction, key-revocation or artifact-specific governance work.

Product icons, stings and overlays require actual product-approved bytes and their role/hash record. A pre-approval without bytes is not a ready asset. Verify the separate current product Add-on and its approved asset records before using a product-specific identity; historical open-item wording is not a current claim that every product remains unfinished.

Automated structural parity is not native Thai/English semantic review. Numeric palette diagnostics are not actual-size, low-brightness, gray/CVD or assistive-technology review. A published file is not proof that every ChatGPT/Claude project or every team member is using it. Record each check and activation with its observed coverage.

The Design System succeeds when teams and AI systems can make different compositions for different formats while preserving the same truth, identity, evidence boundary, action promise and quality bar.

---

## Appendix A. Source lineage — Historical / Reference, non-normative

The full human master follows the established chapter structure. Its unchanged obligations come from the archived full successor of the 0.9.1 master; changed 0.9.6 obligations have been substituted inline. No predecessor document is a required reading dependency for this file.

| Source | Provenance role |
|---|---|
| archived `Landometer Design System v0.9.4.md` | full successor master carrying the retained 0.9.1 structure and rules; SHA-256 `8e6e89a52b6a1ba0dc3c39f4f51b6b82e84e1281811713bd14fd36ab0f2d1886` |
| DS 0.9.5 GUIDE / BRAND / policy / release | historical baseline: retained protected brand wording and non-gradient obligations; current release identity comes from 0.9.6 |
| DS 0.9.5 tokens / color-srgb-08 registries | historical baseline: unchanged diverging, categorical, atmosphere and foundation values; six-state contract and all other preserved tokens |
| Owner-approved sequential R2 / DS 0.9.6 color-srgb-09 | current 28 sequential records, three distinct-hue anchors, exact theme LUTs and class sets; approval source SHA-256 `0ae97bf20fe51521ddb71aed3f5ae99f5206cd934492eff4934e97a29765e4fa` |
| current evidence-value / social-sidecar schemas | typed nonzero/zero/null contract and square/OG output targets |
| owner instruction, 29–30 September 2026 | no decorative bracket/left-rail treatment; preserve full normative structure; consolidate one-file adoption |

Historical release signatures remain attached only to their original immutable subjects. They do not sign this document or the current owner distribution. The deterministic builder records every replaced range, exact source/output hashes, all 64 rule IDs and all acceptance IDs. That provenance supports audit and reproducibility; it does not claim a new cryptographic signature or an unperformed bilingual review.

The machine payload that follows is part of this same normative document. Its current fields implement the current chapters; historical source identities remain explicitly provenance.
