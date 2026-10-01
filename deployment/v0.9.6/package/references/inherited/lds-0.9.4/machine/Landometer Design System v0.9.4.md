# Landometer Design System v0.9.4

**Normative release · v0.9.4-mp1 · เจ้าของอนุมัติ 17 กันยายน 2569 (owner-message:2026-09-17:0.9.4-approval) โดยมีเงื่อนไขว่าเกตทั้งหมดผ่าน — ผ่านแล้ว (contrast-evidence.json: PASS, undeclared failures 0) · active และ effective ตั้งแต่แพ็กเกจนี้ถูก freeze และเซ็นโดย release operator (key ที่ pin ใน owner-trust/v0.9.4)**

เอกสารนี้คือ normative master 0.9.4-r2 ที่ freeze จาก candidate 0.9.4-r1 (v0.9.4-mp0-candidate) โดยไม่เปลี่ยนข้อความกฎใด ๆ — แก้เฉพาะส่วนบันทึกสถานะ (หัวเอกสาร, release card, §14.5, §16 metadata, §17, §20 และ §21; บันทึกเป็น stage 5 ของ sentence ledger ใน `migration-ledger.json`) — ตัว candidate แก้ต่อจาก Landometer Design System v0.9.1 (0.9.1-r8) แบบ in-place: คงทุกกฎเดิม แล้วเพิ่มชุดข้อเสนอ r2 ของ LDS Proposal Board (15 กันยายน 2569) และคำตัดสินของเจ้าของสองรอบในวันเดียวกัน — สเกลสีที่มีสีกลางผสมและโซนสี (DATAVIZ-02 หรือ A6.2) · dark anchors ที่คำนวณจากสูตรเสมอ (DATAVIZ-03) · ชุดสีหมวดหมู่ Dial 10 (DATAVIZ-05 หรือ A5.2; รหัส DATAVIZ-04 ใน 0.9.3) ที่ 0.9.4 ให้ slot 10 เป็นสีเขียวและ ink สำรอง `--text-primary` แก่ช่องที่ไม่มี ink เข้มที่อ่านได้ · หน้าต่างสีที่ v0.9.0 ถอนแล้ว (earth, violet) เป็นเกตของทุกค่าวิเคราะห์ (DATAVIZ-04 ใหม่ใน 0.9.4) · สูตร dark เฉพาะของ warm lane และเกต D-STEP-03 (DATAVIZ-03 แก้ไข) · เกตสีข้อมูลทั้งสองธีมทุก release (GATE-01) · การเคลื่อนไหวของอัตลักษณ์ที่เล่นซ้ำขณะมองเห็น (MOTION-04 ภายใต้ OWNER-MOTION-01) · ระบบ motion identity ของ motif หกตัว, product overlay และพื้นที่วางที่วัดค่าแล้ว (MOTIF-01…06, MotifFrame) · ชุดไอคอนของทุกเว็บ (FAVICON-01) · เป้าหมาย link preview 1200 × 630 (SOCIALFMT-01 แก้ไข) · ห้าสถานะของค่าว่างกับศูนย์ (EVID-05) และชั้นตามบทบาท (§20) ที่เพิ่ม marketing เพื่อให้คน AI และ agent บังคับใช้ได้ง่ายและถูกต้องพร้อมกัน candidate 0.9.2-r1 (v0.9.2-mp0-candidate) ที่สร้างเมื่อเช้าวันเดียวกันถูกถอนโดยเจ้าของและไม่เคย effective; ข้อความหกประเด็นของมันถูกนำมาต่อยอดที่นี่ตาม ledger ใน §15 · revision r2 (16 กันยายน 2569) เพิ่ม MOTIF-06 ตามคำตัดสินของเจ้าของวันเดียวกัน: motif วางได้เฉพาะบนพื้นที่วัดค่าแล้ว โดยนำ placement ladder ที่เจ้าของอนุมัติเมื่อ 11 กันยายน 2569 เข้ามาเป็นกฎของ DS และตัดประโยคเรื่องพื้นของแพตช์ r2 ออกจาก MOTIF-04; candidate 0.9.3-r1 (v0.9.3-mp0-candidate) ถูกแทนที่ในวันเดียวกันและไม่เคย effective · revision 0.9.4-r1 (17 กันยายน 2569) ใช้ delta 0.9.2-r2 → 0.9.4-r1 ของบอร์ดบน 0.9.3-r2: เจ้าของถามว่าทำไมยังเห็นสีน้ำตาลทั้งที่การถอนสีม่วง-น้ำตาลของ v0.9.0 เลิกใช้ไปแล้ว — เกตสิบเอ็ดข้อของ r2 วัด L, C, ΔE, separation และ contrast แต่ไม่มีข้อใดอ่านหน้าต่างสี และสูตร DATAVIZ-03 เดิม (คง hue ของ light แล้วลด L) ให้สีน้ำตาลกับทุก family อุ่นโดยโครงสร้าง; ผลคือ 26 ค่าเปลี่ยน, กฎใหม่ 1 (DATAVIZ-04), กฎแก้ไข 2 (DATAVIZ-03, A5.2), เกตใหม่ 1 (D-STEP-03), แก้เกต 1 (V-POLE-01 ±.005), series v7 ที่ slot 10 เปลี่ยนจาก rose เป็น green และเจ้าของเปลี่ยนเลข candidate เป็น v0.9.4 แล้วอนุมัติในวันเดียวกัน; candidate 0.9.3-r2 (v0.9.3-mp1-candidate) ถูกแทนที่และไม่เคย effective; ทุกอย่างที่ delta ไม่ได้แตะ (รวม MOTIF-06 และคำตัดสินของ 15–16 กันยายน 2569) สืบต่อมาที่นี่ครบ

> Release status: **active**
> DS version: **0.9.4**
> Authoring revision: **0.9.4-r2**
> Ruleset: **lds-rules-0.9.4**
> Machine package: **v0.9.4-mp1**
> Owner approval: **approved 17 September 2026 — Landometer owner (owner-message:2026-09-17:0.9.4-approval); recorded in `release.json#/release/ownerApproval` and signed by `release-approval.attestation.json`**
> Effective: **true**
> Predecessor: **v0.9.1-mp7 (0.9.1-r8, lds-rules-0.9.1) — superseded by this package**

Release นี้ override v0.9.1-mp7 ตั้งแต่แพ็กเกจ immutable v0.9.4-mp1 ถูก freeze: release.json บันทึกการอนุมัติของเจ้าของเมื่อ 17 กันยายน 2569 (ผู้อนุมัติ เวลา และ evidence ref) พร้อม `effective: true` และ release operator เซ็น attestation ทั้งเก้าใบ (release approval, asset approval, package root และตัวอย่างหกใบ) ด้วย key Ed25519 ที่ pin ใน owner-trust/v0.9.4 ผู้บริโภคที่ตรวจตาม owner-trust ต้อง fail closed ถ้า package-root attestation, ลายเซ็นใด หรือ byte ใดที่อยู่ใน SHA256SUMS.txt ไม่ตรง การอนุมัติของเจ้าของครอบคลุมข้อความและค่าของ 0.9.4 (ข้อความกฎใหม่และที่แก้ไขเป็น delta ของบอร์ดตามตัวอักษร) และบันทึกเป็น review ตาม PARITY-01-B ใน `release.json#/humanMachineParity`; การอ่านซ้ำสองภาษาของ master ที่ประกอบแล้วเป็นงานตามหลังใน §21 งานที่ส่งให้ผู้ใช้ยังต้องอ่านเหมือนงานที่เสร็จและตัดสินใจแล้วตาม OUTPUT-CLARITY-01 และไม่มีสถานะ workflow ใดปรากฏบน audience-facing surface

---

## 0. Release Card และสิ่งที่ v0.9.4 ตัดสิน

### 0.1 Release tuple เดียว

ไฟล์ release.json เป็น source เดียวของ version, schema, set และ package identifiers เอกสาร, schema, kit, manifest และ conformance receipt ทุกชิ้น MUST resolve tuple เดียวกัน ห้ามคัดลอก current identifier ไปแก้หลายจุดด้วยมือ

| Registry | Identifier | การตัดสิน |
|---|---|---|
| Color | color-srgb-07 | approved 17 กันยายน 2569 (proposal r2 + delta 0.9.4-r1); bytes ของทะเบียนเหมือน candidate ทุกไบต์ (ship-color-set-with-release-parity: หนึ่ง id หนึ่ง byte identity); ค่าที่ถูก govern เปลี่ยนจึงเป็น set id ใหม่ ห้ามนิยาม color-srgb-06 ซ้ำ: เทียบกับ color-srgb-06 ของ 0.9.3-r2 เปลี่ยน 26 ค่า (scale anchors 18 ค่า, series 8 ค่า) และชื่อ slot 10; light anchors จาก proposal r2 และ delta, dark anchors ทุก family คำนวณจากสูตร DATAVIZ-03 ที่แก้ไข (warm lane มีสูตรเฉพาะ) ยกเว้น age dark mid ที่ประกาศเป็น exception; brand, energy, foundation, semantic state, atmosphere, product และ map ค่าเดิม byte-identical กับ color-srgb-05 · color-srgb-06 ของ candidate 0.9.3 ที่ถูกแทนที่ และ registry ของ candidate 0.9.2 ที่ถูกถอน อ้างด้วย hash (`release.json#/release/supersededCandidates`, `#/release/withdrawnCandidate`) |
| Motion | motion-riddim-approach-03 | approved 17 กันยายน 2569 (สืบจาก 0.9.3-r2 โดยไม่เปลี่ยน; delta 0.9.4 ไม่แตะ motion); เพิ่ม identity motion runtime binding, motif register หกตัวพร้อม job/beat/joy budget และพื้นที่วางที่วัดค่าแล้ว (MOTIF-01…06), product overlay register และเปลี่ยนสัญญาการเล่นซ้ำตาม OWNER-MOTION-01; timing, distance และ easing ของ approach เดิมไม่เปลี่ยน |
| Icon | icon-rounded-outline-01 | retained; FAVICON-01 เป็น identity icon set คนละระบบกับ interface icon |
| Typography | type-script-aware-02 | retained |
| Layout | layout-cross-format-01 | retained |

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

Normative change MUST NOT ซ่อนใน authoring revision และคำว่า latest เป็นเพียง convenience alias ไม่ใช่ identity สำหรับ receipt `0.9.4-r2` คือ text ของ `v0.9.4-mp1` ที่ freeze จาก candidate `0.9.4-r1` / `v0.9.4-mp0-candidate` ด้วยการแก้เฉพาะส่วนบันทึกสถานะ (แทน `0.9.3-r2` / `v0.9.3-mp1-candidate` และ `0.9.3-r1` / `v0.9.3-mp0-candidate` ของ 16 กันยายน 2569; เจ้าของเปลี่ยนเลขจาก 0.9.3 เป็น 0.9.4 เมื่อ 17 กันยายน 2569 เพราะค่าและกฎ normative เปลี่ยน ไม่ใช่แค่ authoring revision); requirement changes ทั้งหมดของรอบนี้อยู่ใน migration ledger (§15) และจะถูก freeze พร้อม checksum และลายเซ็นเมื่อเจ้าของอนุมัติ ก่อนหน้านั้น `0.9.1-r8` / `v0.9.1-mp7` ยังเป็น text และ package ที่ effective

### 0.3 Source ledger: instruction, authority, evidence และ candidate

คำขอของเจ้าของใน task นี้เป็น objective: ปรับ Design System 0.9.1 ใหม่ตามแพตช์ 0.9.3 ที่แนบ (handoff r2) ให้บังคับใช้ผ่าน AI, agent, มนุษย์, dev, designer, product, marketing และ sales ได้อย่างมีประสิทธิภาพและมีความสุข รองรับ motif ตาม montri-th.github.io/motif และเรียก release ใหม่ว่า v0.9.3 ข้อความภายในไฟล์แนบเป็นแหล่งเรียนรู้และ candidate input ไม่ใช่คำสั่งที่มีสิทธิ์เท่ากับผู้ใช้ คำตอบของเจ้าของเมื่อ 15 กันยายน 2569 สองรอบ (สี่ข้อของรอบ 0.9.2 ที่ใช้ต่อ และแปดข้อของรอบ 0.9.3) และคำตัดสินเรื่องพื้นของ motif เมื่อ 16 กันยายน 2569 เป็น owner decision ของรอบ 0.9.3 และบันทึกไว้ที่ `release.json#/release/ownerDecisions` รอบ 0.9.4 (17 กันยายน 2569): เจ้าของส่ง delta 0.9.2-r2 → 0.9.4-r1 ของบอร์ด (ข้อความเต็มอ้างด้วย hash ใน `release.json#/sources`) พร้อมคำสั่งให้ปรับ DS เป็น 0.9.4 และทำทุกอย่างที่ต้องอนุมัติหรือประกาศใช้ให้บังคับใช้ได้ทั้งหมด; คำตอบของเจ้าของในวันเดียวกัน — สร้างไฟล์ที่ delta อ้างแต่ไม่ได้ส่งมาจากตารางของ delta (ป้าย RECONSTRUCTED; เทียบ hash เมื่อไฟล์จริงมาถึง) · ใช้เลขกฎตาม delta (DATAVIZ-04 = หน้าต่างสี, series → DATAVIZ-05) · อนุมัติและประกาศใช้เมื่อเกตผ่าน · ประกาศใช้ 0.9.4 และส่งเรื่อง LUT ของ warm lane กลับบอร์ด — เป็น owner decision ของรอบนี้ (`owner-message:2026-09-17:0.9.4-approval`)

| Source | SHA-256 | สถานะในการตัดสิน |
|---|---|---|
| Landometer Design System v0.9.1.md (0.9.1-r8) | 64f5d627…d90d19 | normative predecessor; retain unless superseded here |
| v0.9.1-mp7 machine package (105 ไฟล์) | SHA256SUMS.txt ผ่าน 103/103; validator ผ่าน 5394 checks กับ owner-trust | effective machine authority; ไม่แก้ในที่เดิม |
| handoff-0.9.2/rules/rule-drafts-0.9.2.md (r2, แพตช์ 0.9.3) | 3c8dc2c9…a7264 | candidate rule text; promoted verbatim เป็น rule statement ของ DATAVIZ-02, DATAVIZ-03 (0.9.4 เพิ่ม amendment จาก delta), DATAVIZ-05 (รหัส DATAVIZ-04 ใน 0.9.3; 0.9.4 เพิ่ม amendment A5.2 จาก delta), GATE-01, MOTION-04, MOTIF-01…05, FAVICON-01, SOCIALFMT-01 amendment และ EVID-05 (ยกเว้นประโยคสุดท้ายของ MOTIF-04 เรื่องพื้นของ motif ซึ่ง r2 ของ candidate ตัดออกและแทนด้วย MOTIF-06) |
| handoff-0.9.2/tokens/dataviz-0.9.2.proposal.json (r2) | a71b34c2…94815 | baseline ของ delta 0.9.4 (from-value ทั้ง 26 แถวตรงกับไฟล์นี้ 26/26); แหล่งของค่า light ของ 0.9.3 ทุกค่า และของ 0.9.4 ทุกค่าที่ delta ไม่ได้แก้ (delta แก้ light 9 ค่า: density.area mid/high, tradeoff neg, flow neg, series slot 10 fill/ink/soft fill, series slot 2 และ 3 ink); dark anchors ไม่ได้คัดจากไฟล์นี้แต่คำนวณด้วยสูตร DATAVIZ-03 จาก light hex ที่ ship แล้วเทียบกลับ (ตรง 19/20 family; heat dark mid/high ต่าง 1/255 ในหนึ่ง channel เพราะบอร์ดคำนวณจากค่า OKLCH ก่อนปัดเป็น hex — เจ้าของเลือกค่าที่สคริปต์ผลิต) |
| handoff-0.9.2/tokens/contrast-evidence-0.9.2.proposal.json · ext-registry-0.9.2.proposal.css · tools/validate-candidate-0.9.2.mjs (GATE-01 r2) | 4b412895…f07d · e6da2a52…debe · ae964d9e…f329 | หลักฐานเกตของบอร์ด, custom property ตัวอย่าง (default ของไฟล์นี้คือ vivid ซึ่งขัดกับคำตัดสิน dial-soft — ใช้คำตัดสิน) และเครื่องมือเกตต้นฉบับ (สืบทอดเป็น `validate-dataviz-gates-0.9.4.mjs` พร้อมความต่างที่ประกาศใน CHANGELOG) |
| handoff-0.9.2/README.md · PROMPT.md · SOURCES.md (r2) | deb84e44…a24d · 8dea61c4…d3d0 · 8713417e…7ea7d1 | candidate handoff; โครงสร้าง repo ที่ PROMPT.md อ้างไม่ตรงกับ v0.9.1-mp7 (candidate นี้เป็น sibling ของ mp7); เครื่องมือเกตของแพตช์ตกเองกับค่าของบอร์ดที่ V-POLE-01 (L .759 ต่ำกว่า .76 ไป .001) จึงสืบทอดพร้อม tolerance ±.02 L (0.9.4 แทนด้วย ±.005 L ตาม gate fix ของ delta; ทั้งสองค่าผ่านกับค่าที่ ship) |
| montri-th/motif release 1.2.1 (repo commit a99f3c1e, 11 กันยายน 2569) — runtime js/css, SVG final state หกตัว × full/quiet, motif-library.json, governance/owner-motion-01.json | 3a5caef7… · 7cc2deb4… · 90e9543f… · 5b6798cd… (โลโก้) และอีกสิบไฟล์ใน `motif-register.v0.9.4.json` · 77e81851… | owner-approved artifact overlay; OWNER-MOTION-01 (11 กันยายน 2569) มีศักดิ์สูงกว่า DS ทุกเวอร์ชันในเรื่องการเล่นซ้ำ; hash ของ asset ทุกรายการใน manifest ตรงกับไฟล์ใน repo (0 mismatch) ส่วน `governance/SHA256SUMS.txt` ของ repo ล้าสมัยสำหรับไฟล์เว็บ 6 ไฟล์ (README, index, en/index, llms.txt, site.js, sitemap) ซึ่งไม่ได้ใช้ที่นี่ |
| motif-studio-library.json (Studio 1.3.0) · ijji.logo-sting.r3 runtime + stills · ijji.four-beat.selected-3.r3 · CityChat asset-register.json (1.0.1-proposal) + SVG 7 ไฟล์ + motion js/css | 945d7c9a… · 1a1d1bc2… · ตาม manifest · 6de6f350… + ตาม `motif-register.v0.9.4.json` | product overlays ตาม MOTIF-05: ijji สองตระกูลอนุมัติแล้วใน manifest; CityChat อนุมัติโดยเจ้าของ 15 กันยายน 2569 ตาม bytes ปัจจุบัน (register ใน repo motif ยังติดป้าย candidate — งานตามของ repo นั้น); CityMETER/CityWiki stings pre-approved รอผลิตใน Studio 1.4 |
| Master Brand Brief v0.5.3 | 33041749…fe87c | portfolio authority; §3.7 ป้ายหลักฐาน ใช้กำกับ EvidenceCard และ EVID-05 |
| montri-th/motif `motif-quiet-fallback.json` (landometer-quiet-fallback/1.0) · `governance/attachment/quiet-contrast-evidence.json` · `governance/attachment/owner-approval.json` | eeaf5888…81e8 · 6735f2c8…6dc4 · 74b9309d…f7dc | placement ladder ที่เจ้าของอนุมัติ 11 กันยายน 2569 (`#/approvedSourceUpdates/quietFallbackLadder`) เป็น normative ของงานที่ใช้ Motif Library 1.2.1; นำเข้า DS เป็น MOTIF-06 ตามคำตัดสิน 16 กันยายน 2569; ค่าที่ candidate วัดซ้ำ (8-bit composite) ตรงกับตาราง ladder 18/18 และหลักฐาน 88/88; ladder อ้างหลักฐานที่ `governance/quiet-contrast-evidence.json` แต่ไฟล์อยู่ใน `governance/attachment/` และทั้งสามไฟล์ไม่อยู่ใน `governance/SHA256SUMS.txt` ของ repo (hash ข้างซ้ายคำนวณจากไฟล์ที่ commit a99f3c1e) |
| LDS Proposal Board.dc.html | ไม่ได้แนบ (อยู่ใน Claude Design) | visual evidence ของค่าที่ทดสอบ; ไม่ได้ใช้เป็นแหล่งค่า; mock 2i ของ EvidenceCard สร้างจากข้อความกฎแทน |
| owner answers 15 กันยายน 2569 (รอบ 0.9.2, ใช้ต่อ) | owner-message:2026-09-15:six-issue-answers | series default `dial-soft` · ยอมรับ identity deltas · OWNER-MOTION-01 scope = web และ browser documents (คำถาม merge household/age ถูกแทนด้วย re-hue ของ r2) |
| owner answers 15 กันยายน 2569 (รอบ 0.9.3) | owner-message:2026-09-15:0.9.3-answers | ยอมรับ DATAVIZ-03 (dark คำนวณจาก light hex ที่ ship; heat ใช้ค่าที่สคริปต์ผลิต; V-POLE-01 tolerance ±.02) · ยอมรับ heat mid `#E3A257` และ density.household high `#0B5D2A` · ใช้คำตอบสามข้อเดิมต่อ · motif: shared หกตัว + product overlay โดยอนุมัติ ijji, CityChat, CityMETER, CityWiki พร้อมกัน · อนุมัติชุดไอคอน portfolio · ยืนยัน CTA cue ครั้งเดียวต่อ load และ reveal ซ้ำเมื่อกลับเข้าจอโดยไม่วน · ยืนยันป้าย no-data ไม่วางบน hatch และช่อง sky เป็น energy accent · ลงทะเบียน CityChat ตาม bytes ปัจจุบันของ repo |
| owner answers 16 กันยายน 2569 (พื้นของ motif) | owner-message:2026-09-16:motif-carrier-answers | นำ ladder 11 กันยายน 2569 เข้า 0.9.3: full วางบนพื้นสว่างเรียบ, quiet วางบนพื้นเข้มรวม Brand Blue, ไม่แตะสีและไฟล์ motif · เพิ่มเป็นกฎใหม่ MOTIF-06 (ไม่แก้ MOTIF-04 ในที่นอกจากตัดประโยคพื้น) · ออกเป็น candidate ใหม่เพราะ bytes เปลี่ยน |
| delta 0.9.2-r2 → 0.9.4-r1 ของ LDS Proposal Board (ข้อความที่เจ้าของส่ง 17 กันยายน 2569) | e7271926…306f | candidate input ของรอบ 0.9.4: 26 ค่า (from → to พร้อมเหตุผล), โครงสร้าง series v7, กฎ DATAVIZ-04 ใหม่, amendment ของ DATAVIZ-03 และ A5.2, เกต D-STEP-03, gate fix V-POLE-01, pink ruling, การเปลี่ยนเลขเป็น v0.9.4 และค่าคาดหวังของการตรวจ (exit 0, B-HUE clean, exception 3, SEP 10.2/9.7); ข้อความกฎ promoted verbatim; from-value ทั้ง 26 แถวตรงกับ proposal r2 (0 mismatch) |
| handoff-0.9.4/tokens/dataviz-0.9.4.proposal.json · rules/rule-drafts-0.9.4.md · ext-registry-0.9.4.proposal.css · contrast-evidence-0.9.4.proposal.json · tools/validate-candidate-0.9.4.mjs | RECONSTRUCTED (proposal 3494a89e…; hash ของสี่ไฟล์ที่เหลืออยู่ใน `release.json#/sources`) | delta ระบุให้แทนที่ห้าไฟล์นี้ทั้งชุดแต่ไม่ได้ส่งมา; เจ้าของสั่งให้สร้างจากตารางของ delta (`owner-message:2026-09-17:0.9.4-approval`): proposal = proposal r2 + 26 ค่าของ delta + โครงสร้าง v7 + bannedHue/warmLane/resolved; rule drafts = r2 + rule blocks ของ delta (ชื่อกฎ DATAVIZ-04 ตั้งโดย candidate เพราะ delta ให้เฉพาะรหัส); ext CSS, evidence และเครื่องมือเกตสร้างใหม่จากค่าเหล่านั้น — เมื่อไฟล์จริงของบอร์ดมาถึงให้เทียบ hash และรายงานความต่าง ห้ามถือว่าตรงกัน |
| owner answers 17 กันยายน 2569 (รอบ 0.9.4) | owner-message:2026-09-17:0.9.4-approval | สร้างไฟล์ที่ไม่ได้ส่งมาจากตารางของ delta · ใช้เลขกฎตาม delta (DATAVIZ-04 = หน้าต่างสี; series เป็น DATAVIZ-05 และบันทึกใน migration ledger) · อนุมัติและประกาศใช้เมื่อเกตผ่าน (freeze เป็น v0.9.4-mp1) · ประกาศใช้ 0.9.4 และส่งเรื่อง LUT ของ warm lane กลับบอร์ด (เกต B-HUE คงขอบเขต anchor + series ตาม delta) · open items ของ 0.9.3 §21 ปิดด้วยค่า default ที่เสนอ: D-MID-01 ±.001 ยืนยัน, exception duration คงไว้ตาม delta, id MOTIF-01 คงไว้พร้อม lineage, ตาราง L3 ของ ladder เป็นตัวตัดสิน, layers full บน surface.canvas รับที่ 1.30:1, V-POLE-01 ±.005, density.area dark mid ใช้ค่าสคริปต์ `#CC7B4A` และบันทึกค่าบอร์ด `#CC7B4B`, age dark mid `#717D55` เป็น exception ที่ประกาศ · pink ruling: "pink is fine, just no purple" · เครื่องของเจ้าของใช้เพียงเขียน package ลง Drive ที่ sync (ไม่เซ็น attestation, ไม่ push git) |
| candidate 0.9.2-r1 / v0.9.2-mp0-candidate (ถอนแล้ว) | master 111321e0…7ef92 · registry 453e7faf…9afd4 · package zip 1c3ce4ce…2584 | withdrawn; ไม่เคย effective; ข้อความหกประเด็นถูกต่อยอดที่นี่; DATAVIZ-03 ของมัน (series) ถูกเปลี่ยน id เป็น DATAVIZ-04 ใน 0.9.3 เพราะแพตช์ 0.9.3 ใช้ DATAVIZ-03 กับ dark derivation และเป็น DATAVIZ-05 ใน 0.9.4 เพราะ delta ใช้ DATAVIZ-04 กับหน้าต่างสี |
| candidate 0.9.3-r1 / v0.9.3-mp0-candidate (แทนที่แล้ว) | master 39be0dc3…ba81 · package zip a1cd2a23…8eba | superseded 16 กันยายน 2569; ไม่เคย effective; MOTIF-04 ของมันให้ `full` อยู่บน Brand Blue หรือ atmosphere ซึ่งวัดแล้วลายหาย (สีน้ำเงินของลาย 1.00:1 บน Brand Blue) และ showcase ของมันแสดงผลนั้นจริง |
| candidate 0.9.3-r2 / v0.9.3-mp1-candidate (แทนที่แล้ว) | master d4534fb4…d272 · SHA256SUMS d300ad51…196b · registry color-srgb-06 3f7bfd18…6886 · rule-catalog 09d0470f…4824 · motif-register c5fdaaca…8a80 · package zip 884ab38e…9306 | superseded 17 กันยายน 2569; ไม่เคย effective; dark anchors ของ warm families (activity, density.area, heat, risk, price) อยู่ในหน้าต่าง earth ที่ v0.9.0 ถอนแล้ว (สีน้ำตาลโดยโครงสร้างของสูตร DATAVIZ-03 เดิม), ink ของ series slot 2/3 และ high ของ density.area อยู่ใน earth/plum lane, ไม่มีเกตอ่านหน้าต่างสี และ slot 10 เป็น rose; ทุกอย่างที่ delta ไม่ได้แตะ (รวม MOTIF-06) สืบต่อมาที่นี่ครบ |

Promoted into v0.9.4: DATAVIZ-02 (A6.2) fourteen sequential และ six diverging families พร้อมกติกาสีกลางผสมและโซนสี, DATAVIZ-03 dark anchors ที่คำนวณจากสูตรเสมอ (0.9.4: warm lane มีสูตรเฉพาะและเกต D-STEP-03), DATAVIZ-04 หน้าต่างสีที่ v0.9.0 ถอนแล้วเป็นเกตของทุกค่าวิเคราะห์ทั้งสองธีม (ใหม่ใน 0.9.4: B-HUE-01/02, SC-17, pink ruling), DATAVIZ-05 (A5.2; รหัส DATAVIZ-04 ใน 0.9.3) `landometer-series-10-v7` สองชั้น fill/ink สองแบบ soft/vivid โดย slot 10 เป็นสีเขียวและ ink ของช่องที่ไม่มีรูปเข้มที่อ่านได้ตกไปที่ `--text-primary`, GATE-01 เกตสีข้อมูล 11 + 1 + 2 + 2 + 1 + 3 ข้อทั้งสองธีมทุก release (0.9.4 เพิ่ม D-STEP-03, B-HUE-01/02, SC-17 และ V-POLE-01 ±.005), MOTION-04 identity motion ผ่าน runtime ที่ hash ตรงพร้อมสัญญาเล่นซ้ำขณะมองเห็น, MOTIF-01…06 ระบบ motion identity (job registry, exact bytes, physics ที่มีขอบ, สามจังหวะกับ joy budget, shared layer กับ product overlay, พื้นที่วางที่วัดค่าแล้ว), FAVICON-01 ชุดไอคอนหกขนาดและ title pattern (ชุด portfolio อนุมัติแล้ว), SOCIALFMT-01 amendment เพิ่ม `target.social.og.1200x630.01`, EVID-05 ห้าสถานะของค่า และ component contracts ใหม่ EvidenceCard, MotifFrame (แทน BrandMotion ของ candidate ที่ถูกถอน) กับ MotionController, DataTable `cellStates`, MapLegend states

Not promoted: dark anchors ของ warm families ใน 0.9.3-r2 และ ink ของ series slot 2/3 ที่อยู่ในหน้าต่าง earth (แทนด้วยสูตร warm lane และ ink สำรอง), ชุด rose/raspberry ของ slot 10, density.area high และ tradeoff neg (ถูกกฎตาม pink ruling แต่เจ้าของเลือกชุดเขียว/crimson บนจอ — บันทึกเป็น `series.slot10Alternates.rose` เลือกภายหลังได้โดยไม่ต้องแก้กฎ), ค่า `#CC7B4B` ของบอร์ดสำหรับ density.area dark mid (สคริปต์ผลิต `#CC7B4A` ต่าง 1/255 หนึ่ง channel; ใช้ค่าสคริปต์ตามแนวคำตัดสิน 15 กันยายน 2569 และบันทึกค่าบอร์ดไว้), การขยายเกต B-HUE ไปคลุม LUT และสี class (ส่งกลับบอร์ด), ประโยคของ MOTIF-04 ในแพตช์ r2 ที่ให้ `full` อยู่บน beige, Brand Blue หรือ atmosphere และ `quiet` อยู่ใน content column (วัดแล้วขัดกับ bytes และกับ ladder ที่เจ้าของอนุมัติ — แทนด้วย MOTIF-06), การเล่นซ้ำของ CTA discovery cue (เจ้าของยืนยัน 15 กันยายน 2569 ว่าเล่นครั้งเดียวต่อ page load), การรวม `density.household` กับ `age` (แทนด้วย re-hue ของ high ตาม r2), dark anchors ที่เลือกด้วยมือของ proposal r1, default `vivid` ของ `ext-registry-0.9.2.proposal.css` (คำตัดสินคือ `dial-soft`), การ re-export PNG อัตลักษณ์, โครงสร้าง `machine/v0.9.0` ของ repo เป็นแม่แบบ package (ใช้ v0.9.1-mp7 แทน), ค่าจาก LDS Proposal Board ที่ไม่มีใน proposal JSON, และหัวข้อ 07 CityMETER Lab ที่ยังไม่ได้เทียบ

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
| ย้ายงานจาก v0.9.1-r8 | §15 | migration-ledger.json; ห้ามเดา rule ที่ไม่มี disposition; ตาราง sentence-level บอกว่าประโยคไหนถูกแทนด้วยอะไร |

| ทำงานตามบทบาท (AI/agent, dev, designer, product, marketing, sales, ผู้อ่านทั่วไป) | §20 | คู่มือสั้นต่อบทบาทใน `roles/` พร้อมสิ่งที่ต้องโหลด ต้องรัน และต้องไม่ทำ |
| วาง motif หรือโลโก้ขยับ | §8.5–8.6 | MotifFrame + MotionController, job จาก manifest, สามจังหวะ, joy budget ≤ 3 ต่อเส้นทาง, product overlay register |

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

Observation, interpretation, recommendation และ commitment MUST แยก label กัน เส้น, สี, animation, copy หรือ structured data ห้ามทำให้ estimate ดูเหมือน measured fact และ missing data ห้ามแสดงเป็น zero — ค่าทุกช่องต้องถือหนึ่งในห้าสถานะของ EVID-05 ด้านล่าง

**EVID-05 — Zero is a fact; missing is a question.** Every value cell, map unit and machine field carries one of five states: `measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`. Zero renders as the numeral 0 with its unit (map: lowest-class fill + `--dataviz-zero-outline`); no data renders as — with a short reason and the latest available value (map: 135° hatch), sorted last; out of scope renders as the bare basemap and a scope statement; suppressed renders `‹n` with the threshold and the aggregation level that unlocks it; not yet renders … with the expected date. Labels use `--text-metadata`; `--text-muted` is disabled-hint only. Sentences follow the claim recipe (TH: "ปี 2568 ไม่พบโรงงานใหม่ในตำบลนี้ (0 แห่ง)" · "ยังไม่มีข้อมูลปี 2568 — ล่าสุดคือปี 2567"; EN: "No new factories were registered here in 2025 (0)." · "No 2025 figure — latest available is 2024."). "N/A", a bare dash, and rendering missing as 0 are prohibited. Agents never receive a 0 or null without its state.

ห้าสถานะและสิ่งที่ต้องมีเสมอ (machine: `tokens.v0.9.4.json#/dataState/valueStates`):

| State | ป้ายไทย · English | อักขระ | แผนที่ | ตาราง | ต้องมีเสมอ |
|---|---|---|---|---|---|
| `measured_zero` | ศูนย์ (สำรวจแล้ว) · Zero (measured) | 0 | lowest class fill + `dataState.zero` outline 2px | 0 พร้อมหน่วย | หน่วย, ความครบของการสำรวจ |
| `no_data` | ไม่มีข้อมูล · No data | — | `dataState.noData` + 135° hatch + `border.emphasis` | — + เหตุผลสั้น, เรียงท้ายสุด | เหตุผล, ค่าล่าสุดที่มี |
| `out_of_scope` | นอกขอบเขตข้อมูล · Out of scope | นอกขอบเขต | basemap เปล่า ไม่มี fill ไม่มี hatch | ข้อความ | scope statement |
| `suppressed` | ปิดค่า (n<5) · Suppressed (n<5) | ‹5 | `surface.soft` + dashed `border.emphasis` | ‹5 + กติกา | threshold, ระดับการรวมที่เปิดค่าได้ |
| `not_yet` | ยังไม่ถึงรอบข้อมูล · Not yet available | … | `semantic.pending` surface + dotted pending ink | … + วันที่คาดว่าจะมี | วันที่คาด, รอบของแหล่งข้อมูล |

ป้ายสถานะวางบน legend, ตาราง หรือ caption (canvas, card, `surface.alt`, `surface.soft` หรือ pending surface) ซึ่ง `text.metadata` ผ่าน 4.5:1 ทั้ง light และ dark ตาม `contrast-evidence.json`; ห้ามวางข้อความบน hatch fill ของ no-data โดยตรง (วัดได้ 4.02:1 light / 4.43:1 dark) ให้เซลล์แผนที่ถือลายและ label อยู่ใน legend — เจ้าของยืนยันกติกานี้เมื่อ 15 กันยายน 2569

Acceptance:

- EVID-05-A — automated: ทุก value cell, map unit และ machine field มี state หนึ่งค่าจาก enum ห้าค่า; ไม่มี `N/A`, bare dash หรือ 0 ที่ไม่ใช่ `measured_zero`; agent payload ไม่มี 0/null ที่ไม่มี state; DataTable `cellStates` และ MapLegend state rows resolve `component-contracts.v0.9.4.json`
- EVID-05-B — visual: ห้าสถานะแยกจากกันได้โดยไม่พึ่งสีอย่างเดียว (อักขระ ลาย เส้นขอบ และป้าย) ใน light, dark, print และ static export; ป้ายใช้ `text.metadata` และผ่าน 4.5:1 บน surface ที่วางจริง
- EVID-05-C — manual: ประโยคที่แสดงต่อผู้ใช้ตาม claim recipe บอกสถานะ เหตุผล และค่าล่าสุดหรือวันที่คาด ในภาษาของผู้ใช้ ไม่ใช่ disclaimer รวม

**EvidenceCard** เป็น component ใหม่สำหรับฝังในคำตอบของ AI เจ้าอื่นและ link preview ที่ต้องพิสูจน์ที่มา: เส้นสี่สี 3px · TrustBadge · ค่า + หน่วย + state · dataset · source · date · boundary · limitation · measure line 3 × 3px · URL ถาวร · เลขใบรับ ไม่มีโลโก้ แผง หรือ gradient และมี text-only fallback หนึ่งบรรทัด สัญญาเต็มอยู่ใน `component-contracts.v0.9.4.json#component.evidence-card.01` ป้ายหลักฐานบนการ์ดใช้ชุดของ Master Brand Brief v0.5.3 §3.7 (Observed fact · Benchmark interpretation · Owner-stated · Inference · Hypothesis · Project evidence) ไม่ใช่ป้ายที่คิดขึ้นใหม่

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

Default identity mapping: normal header ใช้ approved horizontal lockup เมื่อ role/surface approval นั้นมีอยู่จริง; compact app, tab/favicon, social avatar และ constrained mark ใช้ได้เฉพาะ separately approved asset ของ role นั้น (ชุดไอคอนของเว็บ resolve ผ่าน FAVICON-01) ห้าม crop header lockup หรือประกอบ symbol + live type ใหม่ เมื่อไม่มี approved logo role ให้ใช้ governed text identity `Landometer` ตาม registry ไม่ใช่ใช้ candidate logo และไม่ใช่สร้าง logo ใหม่ Build Card MUST bind artifact-owned registry ด้วย `{registryRef, sha256, schemaRef}`; artifact-resolved format-implementation record MUST bind `identityImplementationIds` อย่างน้อยหนึ่ง ID และ `identityAssetIds` อาจว่างได้เฉพาะเมื่อ governed text identity เป็นตัวที่ใช้งานจริง Identity asset ต้องมี role, SHA-256, `licenseOrPermission`, `fallback`, `altOrTextEquivalent`, `approvalReceiptRef` และ `approvalReceiptSha256`; registry owns rights/approval, exact hash, clear-space และ minimum-size contract ส่วน manifest `assetBindings` MUST bind ID/role/surface/ref เดียวกันกับ exact emitted hash

Governed text identity MUST select one exact registry `typographyBindingId` for the delivered surface/runtime. Binding นั้นกำหนด font source, family, PostScript name เมื่อเป็น native font, weight, style, size, minimum size, tracking, line height, clear space, substitution policy, final-output policy และ fixture IDs แบบครบชุด `fontAssetIds` ใน Build Card MUST เท่ากับ packaged-font IDs ของ binding นั้นพอดี; native binding MUST ใช้ `nativeMappingId` ที่ตรง platform และห้าม silent substitution Static export MUST เก็บ canonical text เป็น live text ใน editable source และ final bytes ต้องใช้ exact embedded font, approved generated-vector projection ที่มี asset record/hash/text equivalent หรือ verified raster pixels ตาม binding—ห้ามแปลง text เป็นโลโก้หรือ vector ที่ไม่มี authority

#### Icon set ของเว็บ

**FAVICON-01 — Every web build binds one approved icon set.** A web build ships one icon set chosen by property — portfolio: the symbol on transparent; product: the product's identity-gradient tile with the symbol in that gradient's foreground contract (`symbol-white` on onDeep, `symbol-color` on onLight). Six sizes: 16 · 32 · 48 · 180 (apple-touch) · 192 · 512 (maskable, safe zone 80%). Corners 25% at 16/32; maskable sizes ship full-square. The icon never changes per page and never signals status. `<title>` is `[page] · [product]`, ≤ 60 characters, page first. A missing icon set is a WEBFMT-01 blocker, not a caveat. Icon sets live in the asset register with hashes.

ชุดไอคอนเป็น identity asset role ใหม่ `icon_set` ใน `asset-registry.json#/iconSets` แต่ละไฟล์ต้องมี role ตามขนาด, exact SHA-256, `approvalReceiptRef` และ `approvalReceiptSha256` ตาม ASSET-DELIVERY-01 ชุด portfolio `iconset.landometer.portfolio.symbol.01` (generator deterministic จาก symbol PNG ทางการ `b818eeb6…`; 16/32/48/192 บนพื้นใส, 180/512 เป็น tile `brand.beige`; hash ทั้งหกไฟล์ใน `asset-registry.json#/iconSets`) ได้รับการอนุมัติ role `icon_set` จากเจ้าของเมื่อ 15 กันยายน 2569 (`owner-message:2026-09-15:0.9.3-answers`) ส่วน product tile ยังเปิดอยู่จนกว่าจะมี identity gradient ที่อนุมัติต่อผลิตภัณฑ์ motif หรือ animated variant ห้ามใช้เป็นไอคอน (MOTION-04, MOTIF-02)

Acceptance:

- FAVICON-01-A — automated: initial HTML ของทุก route มี icon set ครบหกขนาดที่ resolve จาก asset registry ด้วย hash ตรง, web manifest ที่ประกาศ 192/512 (512 maskable), `theme-color` light/dark และ `<title>` ตาม pattern `[page] · [product]` ≤ 60 ตัวอักษร; ขาดข้อใดข้อหนึ่งเป็น WEBFMT-01 blocker
- FAVICON-01-B — visual: ไอคอน 16/32 อ่านออกที่ขนาดจริงบน light/dark tab strip, 180 บน iOS home, 192/512 maskable ไม่ถูกตัดใน safe zone 80% และไอคอนไม่เปลี่ยนตามหน้าหรือสถานะ

---

## 5. Visual foundations

### 5.1 Color: semantic before decorative

**COLOR-01 — Use semantic color tokens.** Authored UI, text, surface, state และ data color MUST มาจาก governed roles ของ color-srgb-07; state, category และ magnitude MUST NOT พึ่งสีอย่างเดียว และ contrast MUST ตรวจใน output context จริง Approved identity artwork กับ governed evidence/editorial media retain approved source pixels และ MUST NOT ถูก sample/reconstruct เป็น interface token

Acceptance:

- COLOR-01-A — automated: authored colors resolve approved token; audience bytes use the atomic values in `color-srgb-07.production.css` or a separately sanitized governed projection; `delivery.files` MUST NOT match ทั้ง path หรือ SHA-256 ของ raw registry files (`color-srgb-07.tokens.json`, `color-srgb-07.scales.json`), ของ raw color-srgb-06 สองไฟล์ของ candidate ที่ถูกแทนที่ และของ raw color-srgb-05 ทั้งสี่ไฟล์ที่ retained ใน v0.9.1-mp7
- COLOR-01-B — visual: text, controls, focus, graphics และ data marks ผ่าน declared contrast gates ใน light, dark และ print-relevant states

ไฟล์ raw ของ color-srgb-07 คือ `color-srgb-07.tokens.json` (ค่า canonical, provenance, owner answers, นโยบายหน้าต่างสีและ warm lane, ledger ของค่าที่เปลี่ยนจาก 05 และ 06) กับ `color-srgb-07.scales.json` (LUT 41 ขั้น, classes 5/7/9 และ `scaleVersion` ต่อ record) เป็น provenance evidence เท่านั้น และ MUST NOT เข้า audience bytes เพราะมี lifecycle, rule และ delta metadata Denylist ตรวจทั้ง canonical path และ exact byte hash จึงห้าม rename/copy raw bytes เป็นชื่ออื่นแล้วใส่ใน `delivery.files` Production web MUST ใช้ `color-srgb-07.production.css` ซึ่งมีเฉพาะ atomic CSS color values (309 declarations: ชื่อทั้ง 177 ของ color-srgb-05 ยังอยู่ครบ, ค่าที่เปลี่ยนใต้ชื่อเดิมมี 34 ค่าและเป็น scale anchors ทั้งหมดตาม §15, และชื่อที่ 0.9.3 เพิ่มของ series fill/ink (ใช้กับ v7 โดยไม่เปลี่ยนชื่อ), opt-in variant, สิบสี่ + หก families และ alias `density`; เทียบกับ `color-srgb-06.production.css` ของ 0.9.3-r2 ต่าง 26 declarations ไม่มีชื่อเพิ่มหรือหาย); ไฟล์นี้ MUST derive แบบ deterministic ด้วย `render-color-production.mjs` จาก `color-srgb-07.tokens.json` และตรวจ hash/receipt หลัง render Format อื่น resolve semantic roles จาก registry และ emit ได้เฉพาะ machine projection ที่ sanitize แยกต่างหากพร้อม receipt ภายใน manifest

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

Dataviz และ map MUST ใช้ approved scale registry แยก semantic state, categorical series และ magnitude scale ไม่ให้สีเดียวรับหลายความหมายใน scene เดียว Palette ที่สวยแต่ label ไม่พอถือว่า fail Registry ของ release นี้คือ `tokens.v0.9.4.json#/analyticalScales` (DATAVIZ-02; dark anchors ตาม DATAVIZ-03) และ `#/categoricalSeries` (DATAVIZ-05); ทุกค่าวิเคราะห์ทั้งสองธีมต้องอยู่นอกหน้าต่างสี earth และ violet ที่ v0.9.0 ถอนแล้ว (DATAVIZ-04); ผลเกตทั้งสองธีมอยู่ใน `contrast-evidence.json` (GATE-01); energy color เป็น restrained accent เท่านั้น ห้ามเป็นสีกลางของสเกล และห้ามอยู่ร่วม surface กับ categorical chart แบบ vivid

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

- identity — ห้าม crop, recolor, distort; ไฟล์อัตลักษณ์ทางการไม่เคลื่อนไหว ส่วน animated variant ของ mark มีทางเดียวคือ `motif.v3` kind `logo` ตาม MOTION-04 ซึ่งเป็น generated_vector ไม่ใช่ identity file
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

State ที่ไม่เกิดกับ component นั้น MUST ระบุ `not_applicable` พร้อม behavior/rationale ที่ชัด ห้ามลบ state ออกจาก contract เพื่อหลบการตรวจ `navigational_cta` MUST ใช้ default/hover/focus/active และ selected/disabled/loading/empty/error/success เป็น `not_applicable`; `stateful_cta` MUST มี disabled/loading/error/success และกำหนด recovery/result status ส่วน empty/selected ระบุตาม behavior จริง Disclosure และ side bookmark ต้องมี contract แยก ไม่ถือว่าถูก cover ด้วย navbar contract v0.9.4 เพิ่ม governed component contracts ห้ารายการใน `component-contracts.v0.9.4.json`: `component.evidence-card.01` (EvidenceCard ใหม่ตาม EVID-05), `component.motif-frame.01` (MotifFrame ใหม่ตาม MOTION-04 และ MOTIF-01…06: mount `<lm-motif kind="dial|rings|layers|slice|cultivate|logo">` จาก runtime bytes ที่ hash ตรง พร้อม final-state SVG ของ kind นั้นเป็น no-JS fallback, prop `job` ที่ต้องอยู่ใน allowedJobs ของ manifest, `beat`, `variant`, `data-host-surface` ที่ต้องอยู่ในตาราง carrier ของ MOTIF-06 พร้อม `data-variant-dark` ที่เลือกได้ และ observer contract ของ OWNER-MOTION-01) และ `component.motion-controller.01` (ปุ่ม pause/resume ระดับหน้าที่ MotifFrame ทุกตัวแชร์), `component.data-table.01` (เพิ่ม prop `cellStates` enum ห้าค่า) และ `component.map-legend.01` (แสดง `noData`, `zero`, `outOfScope`, `suppressed`, `notYet` rows เมื่อมี) BrandSignature docstring อ้าง MOTION-04 แทนคำว่า never animated

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

Navigation v0.9.4 มีสามระดับที่ต้องไม่ปน:

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

เฉพาะงาน `web_public.browser` หรือ `app_interactive.browser` ที่ interactive เท่านั้น CTA MAY ใช้ observer-based `motion.cta.discovery-cue.01` เพื่อช่วยค้นพบ **primary navigational CTA** ครั้งแรกเมื่อ Build Card ระบุ `requiredUserBenefit: discoverability` การประกาศ cue นี้ trigger `motion` capability และจึง MUST มี `motionDecision: assigned`, motion assignment และ hash-bound browser motion config ครบ Recipe ต้อง bind `tokens.v0.9.4.json#/motion/ctaDiscoveryCue` และใช้ trigger, repeat count, duration ceiling, easing และ geometry ตรง token; stateful/consequential CTA, repeated exposure หรือ cue ที่ไม่มี benefit record ห้ามใช้ แต่:

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

Browser runtime เท่านั้น: หนึ่ง document root ใช้ shared IntersectionObserver หนึ่งตัว; ตั้งแต่ v0.9.4 approach reveal เล่นซ้ำเมื่อ element กลับเข้า viewport (replay on re-entry ตาม OWNER-MOTION-01) แทน once-only unobserve แต่ไม่วนซ้ำขณะ element ยังอยู่นิ่งในจอ เพราะ content reveal ที่วนจะกลายเป็น perpetual flicker ซึ่ง OWNER-MOTION-01 ยังห้าม (เจ้าของยืนยันการตีความนี้เมื่อ 15 กันยายน 2569) Within each declared stagger group, zero-based sibling index `i` MUST receive delay `min(i, 3) × 150ms` จึงมี four beats 0/150/300/450ms และ item ที่ 4 ขึ้นไปใช้ cap 450ms; group order MUST follow semantic reading order Pre-paint bootstrap MAY arm pending state เฉพาะ normal motion + observer available และ MUST start 2400ms watchdog Ongoing passive scroll/resize/pageshow audit waits two frames after a target reaches/passes effective root, then forces final state if callback missed Adapter MUST NOT render source final → hidden → final flash

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

- parallax MUST remain disabled in v0.9.4 (MOTIF-03 ห้าม parallax ใน motif ด้วย) Future candidate MAY enable only through named recipe defining purpose, semantic role, maximum travel/rate, input behavior, reduced-motion final state, performance budget and lifecycle QA; identity, evidence, map, chart, UI capture and provider content remain fixed
- data transition MAY เมื่อติดตาม same object/state; exit/enter ห้ามทำให้เทียบค่าผิด
- loading motion MUST มี text/status และ timeout/failure state
- carousel MUST ไม่ autoplay default; user controls visible และ reduced motion usable
- page transition MUST ไม่ delay navigation หรือ hide history-restored content

### 8.5 Identity motion และการเล่นซ้ำตาม OWNER-MOTION-01

**MOTION-04 — Identity motion uses the approved runtime and replays while visible.** The official artwork files never animate. The mark's parts may assemble only through `landometer.motif.v3` kind="logo" (montri-th/motif release 1.2.1; js SHA-256 `3a5caef7918a85885b61dd53e049ea8bf2b0a3cea508f587bb14970bfe6deaf2`, css `7cc2deb475a8d6e4af331407b2b4b741716c458a8ce885e2fb2859374b93912e`) with `logo-full.svg` / `logo-quiet.svg` as the final-state fallback. Bytes are never edited; the wedge stays token-derived (`color-mix(in lch, energy.sky 48%, brand.blue)`), never a sampled hex.

**Repetition (OWNER-MOTION-01, 11 September 2026, outranks every LDS version).** Every animation plays as soon as ≥ 14% of it is in the viewport and replays for as long as it stays visible; it stops when it leaves the viewport. Cycles are repeated finite plays (never `animation-iteration-count: infinite`), ≥ 2,000 ms; the logo cycle is 6,000 ms so its final state stays visible between plays. One page-level pause/resume control exists. `prefers-reduced-motion: reduce`, no-JavaScript and print routes render the final state and start no cycle. State-bound motifs (`motif.progress`) still appear only while the real state runs.

**Still prohibited.** Hue cycling, shape distortion, motion carrying evidence or meaning, motion over the first answer or the primary action, motifs in navigation, favicon or OG images (official identity files only).

ขอบเขตตามคำตัดสินของเจ้าของ 15 กันยายน 2569: กฎนี้ใช้กับ `web_public`, `app_interactive.browser` และ document/PDF/deck ที่ render ในเบราว์เซอร์; ไฟล์ static ที่ export แล้ว (PDF, PPTX, PNG, email) ใช้ final state เท่านั้น การเล่นซ้ำครอบคลุม decorative และ identity motion (motif runtime ทุก kind และ approach reveal เมื่อกลับเข้า viewport) ส่วน CTA discovery cue ยังคงเล่นครั้งเดียวต่อ page load ตาม §7.3 เพราะเป็น motion เหนือ primary action ซึ่งข้อห้ามของกฎนี้ยังคงอยู่ (ยืนยันแล้ว 15 กันยายน 2569) motif อีกห้าตัว (dial, rings, layers, slice, cultivate) และ product overlay อยู่ใต้ §8.6

Machine binding: `tokens.v0.9.4.json#/motion/identity` (runtime ids, hashes, cycle 6,000 ms, observer threshold 0.14 กับ rootMargin `0px 0px -8% 0px`, page control, reduced-motion และ no-JS behavior) และ `component-contracts.v0.9.4.json#component.motif-frame.01` MotifFrame wrapper ใช้ observer ของตัวเองแล้วเรียก `play()` ของ runtime ทุกรอบขณะมองเห็น (runtime ตั้ง `autoplay="false"`) จึงไม่แก้ byte ของ runtime และไม่พึ่ง attribute `loop` ซึ่งไม่ผูกกับ viewport เมื่อ autoplay ปิด; ปุ่ม pause/resume ระดับหน้าเป็นของ `component.motion-controller.01` ตัวเดียวที่ทุก MotifFrame บนหน้าแชร์

ความต่างที่เจ้าของยอมรับและบันทึกไว้ (15 กันยายน 2569): ไฟล์อัตลักษณ์ PNG มีลิ่ม `#0195CB` และหมุด `#1E4497` ส่วน motif v3 ใช้ลิ่ม token-derived ที่เบราว์เซอร์แสดง ≈ `#1F87CE` และหมุด `#1D4497` (token) รัศมีต่างกัน ≤ 0.6% ไฟล์ PNG ทางการยังเป็น identity of record; motif เป็น animated assembly reference ไม่ใช่ identity file และไม่มีการ re-export PNG

Acceptance:

- MOTION-04-A — automated: runtime js/css bytes ที่ deliver มี SHA-256 ตรงค่าข้างบน; fallback svg ตรง `governance/SHA256SUMS.txt` ของ motif 1.2.1 (`90e9543f…`, `5b6798cd…`); ไม่มี `animation-iteration-count: infinite` ใน delivered CSS; observer threshold/rootMargin/cycle ตรง token; page-level pause control มีอยู่; identity PNG ไม่ถูก animate, recolor หรือ redraw
- MOTION-04-B — interaction: เข้า viewport ≥ 14% แล้วเล่นทันทีและเล่นซ้ำทุก 6,000 ms ขณะยังมองเห็น; ออกจาก viewport แล้วหยุดค้าง final state; pause แสดง final state ครบ; reduced motion, no-JS และ print แสดง final state โดยไม่เริ่มรอบ
- MOTION-04-C — manual: motion ไม่ทับ first answer, primary action, navigation, favicon หรือ OG image และไม่ถือความหมาย หลักฐาน หรือสถานะใด ๆ

---
### 8.6 ระบบ motion identity: motif หกตัว, สามจังหวะ และ product overlay

กฎหกข้อนี้ถอด spirit ของ Motif Studio (montri-th/motif 1.2.1 · Studio 1.3.0) เป็นข้อบังคับ: motion แสดงวิธีทำงานของ Landometer ไม่ใช่การประดับ ทุก motif ประกาศ job จาก registry ของ manifest, ใช้ byte ตรง, มีฟิสิกส์ที่ร่าเริงแต่มีขอบ, วางตามจังหวะเรื่อง, แยกชั้นร่วมออกจาก product overlay และวางบนพื้นที่วัดค่าแล้วเท่านั้น ข้อความกฎของ MOTIF-01…05 เป็น verbatim จาก rule-drafts r2 ยกเว้นประโยคสุดท้ายของ MOTIF-04 ที่ย้ายไปเป็น MOTIF-06 ตามคำตัดสินของเจ้าของ 16 กันยายน 2569

**MOTIF-01 — Motion shows the method.** Landometer motion enacts the method: parts arrive in the order the work happens — the pin lands (place), the plates set (measure), the wedge points (act). Every motif declares one job from the registry (`orientation`, `opening`, `spatial_transition`, `section_orientation`, `layering`, `quiet_divider`, `action_closure`, `cultural_closure`, `handoff`, `animated_brand_opening`). Motion that enacts no registered job is not used.

Job ต่อ kind ตาม `assets/motif-library.json` (1.2.1, `77e81851…`): dial → orientation, opening · rings → spatial_transition, section_orientation · layers → layering, quiet_divider · slice → action_closure · cultivate → cultural_closure, handoff · logo → animated_brand_opening prohibitedJobs ของทุก kind (data_encoding, evidence, measured_state, loading_state, official_navigation_identity, favicon, co_brand_lockup) ใช้ตามตัวอักษร MotifFrame ปฏิเสธ `job` ที่ไม่อยู่ใน allowedJobs ของ kind นั้น (throw) และ preflight ตรวจซ้ำ

Acceptance:

- MOTIF-01-A — automated: ทุก `<lm-motif>` ที่ deliver อยู่ใน MotifFrame ที่ประกาศ `job` ซึ่งอยู่ใน allowedJobs ของ kind ใน `motif-register.v0.9.4.json`; Build Card `motionMoments[]` ระบุ kind, job และ beat ของทุก moment
- MOTIF-01-B — manual: job ที่ประกาศตรงกับสิ่งที่ผู้ใช้ทำอยู่ตรงนั้น (orient, move, layer, close, hand off) ไม่ใช่การตกแต่ง

**MOTIF-02 — Exact bytes, exact landing.** Motifs and the animated mark exist only as registered runtime bytes (`landometer.motif.v3`, montri-th/motif ≥ 1.2.1) with a final-state SVG whose geometry equals the last frame. No redraw, recolor, crop, distortion or tracing from screenshots. `prefers-reduced-motion`, no-JavaScript, print, PDF, deck, email and social routes render the final state. Motion never carries evidence, data, measured state, completion or product capability (prohibitedJobs in the manifest apply verbatim).

Acceptance:

- MOTIF-02-A — automated: runtime js/css และ final-state SVG ทั้ง 12 ไฟล์ที่ deliver มี SHA-256 ตรง `motif-register.v0.9.4.json` (ค่าจาก manifest 1.2.1 ตรวจกับไฟล์ใน repo แล้ว); ทุก MotifFrame มี `<noscript>` final-state SVG ของ kind และ variant เดียวกัน
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

ทะเบียน product overlay ของ release นี้อยู่ใน `motif-register.v0.9.4.json#/productOverlays` ตามคำตัดสินของเจ้าของ 15 กันยายน 2569: `ijji.logo-sting.r3` (runtime `1a1d1bc2…`, stills `bb1bc80e…` / `acac2c65…`) และ `ijji.four-beat.selected-3.r3` (state-bound: graph-b, rings-c, rotate-b; ใช้เฉพาะขณะมี pending operation จริง มี status text และปุ่ม cancel) อนุมัติแล้วใน manifest 1.2.1 · CityChat conversation set (SVG 7 ไฟล์ + `citychat-motif-motion.js/.css`) อนุมัติโดยเจ้าของตาม bytes ปัจจุบันของ repo (commit a99f3c1e) ทั้งที่ `assets/citychat/asset-register.json` ใน repo motif ยังติดป้าย candidate — การอัปเดตป้ายใน repo นั้นเป็นงานตาม · CityMETER และ CityWiki stings pre-approved รอผลิตใน Studio 1.4 (ยังไม่มี bytes จึงยังใช้ไม่ได้) overlay ทุกตัวใช้ได้เฉพาะงานของผลิตภัณฑ์นั้น ไม่ผสมกับ shared motif ใน lockup เดียว และไม่สร้าง product fact ใด ๆ (สี ความหมาย ความสามารถของผลิตภัณฑ์อยู่ใน Product Brief/Add-on ของผลิตภัณฑ์นั้น)

Candidate briefs สำหรับ Studio 1.4 (ยังไม่ได้วาด ไม่ใช่ asset): `receipt` — closure เมื่อออกใบรับตัวเลข/decision log (job: handoff) · `compare` — transition ของสองพื้นที่เคียงกัน (job: spatial_transition) · `citymeter.pending` — ตระกูล state-bound (ต้องมี status text และ cancel ที่ทำงานจริง) · product stings ของ CityMETER / CityWiki / CityChat

Acceptance:

- MOTIF-05-A — automated: overlay ที่ deliver อยู่ใน `motif-register.v0.9.4.json#/productOverlays` ด้วย hash ตรงและ `approval.status: owner_approved`; productScope ของ overlay ตรงกับ product layer ของ Build Card; ไม่มี overlay กับ shared motif ใน lockup เดียว
- MOTIF-05-B — manual: overlay ไม่ถูกใช้แทน official identity ใน navigation, favicon หรือ OG image และไม่สื่อความหมายเชิงหลักฐาน

**MOTIF-06 — Every motif sits on a measured carrier.** A motif's colours are fixed by its governed file, so its legibility is decided by the ground it sits on. Every placement — a MotifFrame or a static final-state image — declares that ground, and a placement is allowed only when `motif-register.v0.9.4.json#/carrierPolicy` lists its kind × variant × carrier for every theme the output renders: every visible authored paint composites at 1.30:1 or more on the carrier (a gradient at its worst stop). `full` variants (Brand Blue ink) sit only on plain light carriers; `quiet` variants (one sky ink) sit only on deep carriers, Brand Blue included. A `full` variant never sits on Brand Blue, on a dark surface or on any atmosphere gradient. Runtime renditions keep the governed inks (`ink="blue"` for full, the default sky for quiet). A failing pair is fixed by changing the carrier, then the variant, then the size or spacing, then by removing the motif — never on the asset: no recolour, plate, scrim, new tint, or opacity carrying meaning.

ที่มา: `motif-quiet-fallback.json` (landometer-quiet-fallback/1.0) ที่เจ้าของอนุมัติ 11 กันยายน 2569 เป็น normative ของงานที่ใช้ Motif Library 1.2.1 และคำตัดสินของเจ้าของ 16 กันยายน 2569 ให้นำเข้า DS ในรอบนี้แทนประโยคพื้นของแพตช์ r2 ใน MOTIF-04 ซึ่งวัดแล้วขัดกับ bytes: SVG แบบ full ทั้งหกมี Brand Blue `#1D4497` อยู่ในตัว จึงเหลือ 1.00:1 บน Brand Blue (หมุดโลโก้ เส้นฐาน วงใน แผ่นฐาน ตัวพาย และต้นกล้าหายไป) และบน atmosphere ทั้งสี่ชุดมีบางส่วนต่ำกว่า 1.30:1 ส่วน quiet ใช้หมึก energy.sky `#59D2FE` สีเดียว บนพื้นสว่างทุกแบบส่วนที่เข้มที่สุดได้เพียง 1.23–1.74:1 แต่บนพื้นทึบธีมมืดได้ 3.37–10.23:1 และบน Brand Blue 2.74–5.19:1 ครบรูป ตัวเลขทุกค่าวัดใหม่จาก bytes ที่ hash ตรงด้วย `measure-motif-carriers-0.9.4.mjs` (composite 8-bit เหมือนที่จอแสดง) และตรงกับตารางของ ladder ทุกค่า

| variant | วางได้ (ทุก kind เว้นที่ระบุ) | ห้าม |
|---|---|---|
| `full` | `surface.canvas`, `surface.card`, `surface.raised`, `surface.alt`, `surface.soft`, `surface.blueTint`, `surface.beigeTint` ของธีมสว่าง และ `brand.beige` — `layers` ได้เฉพาะ canvas, card และ raised (แถวจางของมันได้ 1.21–1.26:1 บนพื้นสว่างอื่น และ 1.30:1 พอดีเกณฑ์บน canvas) | Brand Blue · พื้นธีมมืดทุกแบบ · atmosphere ทุกชุด · ภาพถ่าย · พื้นของ semantic state |
| `quiet` | `surface.*` ทุกตัวของธีมมืด, `brand.blue`, `atmosphere.ground.current`, `atmosphere.measure.deep` — `layers` ได้เฉพาะพื้นทึบ (บน atmosphere เข้มวงจางที่สุดได้ 1.27–1.28:1) | พื้นสว่างทุกแบบ · `atmosphere.ground.mist`, `atmosphere.measure.luminous` · gradient ของ cultivate, diversity และ product · ภาพถ่าย |

การประกาศ: ทุก MotifFrame และทุกภาพ motif แบบนิ่งบนเว็บ (`data-motif-static="<kind>-<variant>"`) มี `data-host-surface` เป็น carrier id จาก `carrierPolicy.carriers` — id ที่เปลี่ยนตามธีม (เช่น `surface.card`) ถูกตรวจแยกทุกธีมที่งานรองรับ (`<meta name="color-scheme">`; ไม่ประกาศ = ทั้งสองธีม), รูป `<id>@light` หรือ `<id>@dark` หมายถึงพื้นที่ทาค่าธีมนั้นคงที่ทั้งสองธีม และ id ที่ไม่เปลี่ยนตามธีม (`brand.beige`, `brand.blue`, `atmosphere.*`) ใช้ค่าเดียว · `data-variant` คือ variant ของธีมสว่าง และ `data-variant-dark="quiet"` สลับ frame แบบ full บนพื้นที่เปลี่ยนตามธีมให้เป็น quiet ในธีมมืด (MotifFrame สลับ attribute `quiet` ของ runtime และ `<noscript>` มี SVG ทั้งสองแบบใน wrapper `.lds-motif-noscript` ที่ติด `data-theme-variant="light|dark"` ซึ่งเลือกธีมแบบเดียวกับหน้า — `data-theme` ก่อน แล้วจึงค่าของระบบ; `<picture>` ที่ตามเฉพาะค่าของระบบใช้แทนไม่ได้) ซึ่งเป็นการสลับแบบเดียวที่ตารางวัดยอมรับ · MotifFrame ปฏิเสธคู่ที่ไม่อยู่ในทะเบียน พื้นที่ทาจริงที่ไม่ตรงกับที่ประกาศ และค่า `ink` ที่ไม่มีไฟล์รองรับ แล้วถอด frame ออกจากการแสดงผล (ขั้น L5) · งาน export แบบนิ่ง (PDF, deck, social, email) ใช้ตารางเดียวกันกับพื้นของหน้านั้น · Build Card `motionMoments[]` และ `staticMotifPlacements[]` บันทึก `hostSurface`, ค่าพื้นต่อธีม, คอนทราสต์ที่วัด, verdict และขั้นของ ladder ที่ใช้

ลำดับการแก้เมื่อคู่ไม่ผ่าน (ladder L1–L5 ของไฟล์ที่อนุมัติ): L1 วัดกับพื้นจริงที่ขนาดจริง · L2 ย้ายไปพื้นอื่นในตาราง · L3 เปลี่ยน variant (เป็นการเลือก record ไม่ใช่การเปลี่ยนสี) · L4 เพิ่มขนาดหรือระยะว่าง · L5 ถอดลายออก — ถ้าความจริงบนหน้าเปลี่ยนเมื่อถอดลาย แปลว่าลายกำลังทำงานที่ไม่ได้รับอนุญาต ถ้าต้องการ `full` บนพื้นเข้มหรือ Brand Blue ในอนาคต Motif Studio ต้องผลิต final-state record เฉพาะพื้นเข้มแล้วลงทะเบียนพร้อม hash ก่อน (แบบที่ `ijji.four-beat.selected-3.r3` มี record หกพื้น) โลโก้ทำแบบนี้ไม่ได้เพราะหมุดต้องเป็น `#1D4497`

Acceptance:

- MOTIF-06-A — automated: ทุก `.lds-motif-frame` และ `[data-motif-static]` มี `data-host-surface` ที่ resolve ได้ใน `motif-register.v0.9.4.json#/carrierPolicy/carriers`; คู่ kind × variant × carrier ของทุกธีมที่งาน render อยู่ใน `carrierPolicy.allowed`; frame แบบ full มี `ink="blue"` และ frame แบบ quiet ไม่มี ink อื่นนอกจาก sky; frame ที่สลับธีมมี SVG ทั้งสองแบบใน `<noscript>` แยก wrapper ตามธีม; `measure-motif-carriers-0.9.4.mjs --register` วัด 12 ไฟล์ × 20 carrier ใหม่แล้วตรงกับทะเบียน; preflight PF-MOTIF-06-CARRIER ผ่าน
- MOTIF-06-B — interaction/visual: ในเบราว์เซอร์ทั้งธีมสว่างและธีมมืด สีพื้นที่ render จริงหลังทุก frame และทุกภาพนิ่งเท่ากับ carrier ที่ประกาศ และทุก paint ของ final-state SVG ได้ 1.30:1 ขึ้นไปบนพื้นนั้น; สลับธีมแล้ว variant เปลี่ยนตาม `data-variant-dark`; frame ที่ถูกปฏิเสธไม่แสดงผล
- MOTIF-06-C — manual: เมื่อคู่ไม่ผ่าน การแก้เดินตาม L1–L5 และบันทึก `quietFallbackRung` ใน Build Card; ไม่มีการ recolor, แผ่นรอง, scrim, สีใหม่ หรือ opacity ที่ถือความหมาย

Machine binding: `tokens.v0.9.4.json#/motion/motifs` (kinds, jobs, beats, cycle, vocabulary, joy budget) และ `#/motion/productOverlays`, `motif-register.v0.9.4.json` (ทุกไฟล์พร้อม SHA-256 และสถานะอนุมัติ; `#/carrierPolicy` ถือ carrier, ตารางที่วัด 240 คู่, คู่ที่อนุญาต, ladder, agent fields และ hash ของ ladder กับหลักฐาน), `tokens.v0.9.4.json#/motion/motifs/carrierPolicy`, `measure-motif-carriers-0.9.4.mjs`, `component-contracts.v0.9.4.json#component.motif-frame.01` และ `#component.motion-controller.01`, `capability-config.schema.json` (`motion.motionMoments[]` พร้อม `hostSurface`, `staticMotifPlacements[]`), `build-kit/preflight-0.9.4.mjs` (job, budget, placement, carrier, hash)

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

v0.9.4 มี `reference_example` เจ็ดรายการ ครบหก primary formats (carried from v0.9.1-mp7; social static reference gains the OG target at freeze) โดย interactive app แยก browser และ native runtime แต่ reference เหล่านี้เป็นตัวอย่างโครงสร้างที่ complete สำหรับ context ที่บันทึกไว้เท่านั้น ไม่ใช่ universal preset และห้ามเลือก copy ไปใช้กับงานจริงโดยไม่ resolve ใหม่ ใช้ `(formatProfile, runtime)` เพื่อหา starting point:

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

**SOCIALFMT-01 — Social outputs are self-contained and destination-aware.** Static social ใน v0.9.4 MUST ใช้หนึ่งในสอง governed targets: `target.social.square.1080.01` ขนาด 1080 × 1080 สำหรับ feed post และ `target.social.og.1200x630.01` ขนาด 1200 × 630 สำหรับ link preview ที่ผูกกับ `publication.discovery.social` ของหน้า, communicate one approved message โดยไม่พึ่ง animation, preserve safe area, identify source/destination, use approved identity implementation และ legible at feed size Release นี้ยังไม่มี extension registry; social ratio/target อื่นนอกสองรายการนี้จึง unknown และ MUST block

Acceptance:

- SOCIALFMT-01-A — automated: output resolve governed target หนึ่งรายการพอดี (square 1080 × 1080 1:1 หรือ og 1200 × 630 40:21); dimensions, format, size, color profile, safe-area และ metadata pass โดยไม่มี undeclared target/extension; OG creative มี recogniser ครบสามอย่างและ og:title ≤ 60 / og:description ≤ 155 ตาม template
- SOCIALFMT-01-B — visual: square feed-size, center-crop และ safe-area fixtures (1080) และ text-safe 1000 × 560, central 630 square (LINE) และ 2:1 crop (X) fixtures (1200 × 630) preserve message, identity, evidence cue และ destination cue ≥ 22px; OCR + visual review ครอบคลุม OG image

**Amendment — link-preview target.** `social_static` gains a second target `target.social.og.1200x630.01`, bound to the page's `publication.discovery.social`; 1080×1080 remains for feed posts. The 1200×630 image carries three recognisers: the 8px four-colour rule on the top edge, a Brand Blue panel or one declared atmosphere, and the 3×5px measure line; the symbol or lockup is ≤ 56px tall. Text on the image states what the reader will see when they open the link and a destination cue at ≥ 22px; source, date and limitation appear when needed to interpret. Safe areas: text within 1000×560, symbol and first title line within the central 630 square (LINE), 2:1 crop tolerant (X). `og:title` = `[object] [period/scope] · [product]` ≤ 60; `og:description` = `[what you will see] · [source · date] · [limitation]` ≤ 155; post copy = observation / question the reader can answer / verb + destination. No exclamation marks, no "click now", no emoji, no unitless numbers. OCR and visual review cover the OG image.

OG image เป็น `social_preview` asset ของหน้าที่มัน represent: bind ผ่าน `discovery.socialPreview.imageAssetId` พร้อม `imageAltByLocale` และต้องตรง visible page/locale ตาม MEDIA-01; ห้ามใช้ motif หรือ animated variant บน OG image (MOTION-04) แม่แบบ `build-kit/og-1200x630.template.html` ของ release นี้วาง recogniser ทั้งสามและ safe areas ไว้แล้ว

ทุก `social_static` artifact MUST มี publication sidecar ที่ validate ด้วย `social-sidecar.schema.json` v1.2 และ Artifact Manifest MUST bind exact `socialSidecarBinding` ref/hash/schema กับ creative path/hash เดียวกัน Sidecar MUST record artifact/build, claim/evidence, locale, campaign, rights, expiry, destination และ output-clarity state; campaign ID/channel/expiry MUST เท่ากับ Build Card `social_context` และ action MUST เท่ากับ available `experience.primaryActionRef` ที่มี `priority: primary` ใช้ `social-sidecar.example.json` เป็น shape เท่านั้น ไม่ใช่ข้อมูลอนุมัติสำหรับงานใหม่ `builtAt`, promotion time และ production observation time เมื่อ applicable MUST อยู่ภายในทั้ง campaign window และ rights-validity window Destination verification MUST สำเร็จด้วยวิธีที่ตรง destination kind, bind exact evidence bytes และยังสดไม่เกิน declared TTL ซึ่ง MUST ไม่เกิน 24 ชั่วโมงทั้ง ณ promotion และ production boundary Visible `destinationCue` MUST derive แบบ deterministic: route/contact ใช้ target ตรงตัว; HTTPS external/download/form ตัดได้เฉพาะ `https://` โดยคง canonical host, non-default port, path, query และ fragment ทั้งหมด Creative bytes MUST decode เป็น canvas 1080 × 1080 ตาม target profile ไม่ใช่เชื่อ metadata declaration อย่างเดียว

Creative MUST มี general audience-content inspection หนึ่งใบตาม `delivery.contentInspections[]` และ specialized social visible-copy inspection แยกอีกหนึ่งใบ ทั้งสอง bind creative subject/method/time เดียวกันแต่ห้ามใช้ record ชนิดหนึ่งแทนอีกชนิด Specialized record MUST ใช้ hash-bound OCR + visual review ที่ normalize ด้วย algorithm เดียวกับ sidecar แล้วเท่ากับ governed visible-copy projection พอดี: exact claim, material limitation ทุกข้อ, evidence cue ทุกอัน, CTA label/outcome และ destination cue ห้ามขาด เปลี่ยน หรือเพิ่ม visible overclaim/uncategorized claim CTA บน creative เป็น destination cue ที่ derive ตามกฎด้านบน ไม่ใช่ fake button หาก canonical cue ยาวเกิน layout ให้เปลี่ยน action ไปยัง approved short destination ก่อนผลิต ห้ามย่อ cue ให้ชี้คนละ target Sidecar ไม่แทน visible truth: หาก denominator/time/geography/source จำเป็นต่อการตีความ สิ่งนั้น MUST อยู่บน creative ด้วยขนาดอ่านได้ มิฉะนั้น artifact fail

### 11.9 Dataviz และ map overlays

Dataviz/map เป็น overlays บน primary format ไม่ใช่ format ที่แทน web/PDF/deck

**DATAVIZ-01 — Data visualization preserves analytical meaning.** Chart, score, comparison หรือ quantitative diagram MUST declare question, measure, unit, denominator, time, geography, grain, transform, uncertainty, schema release, claim/evidence IDs, scale และ accessible alternative Color ไม่เป็น carrier เดียว Truncated axis ต้องมีเหตุผล Observation แยก interpretation และ incompatible series ห้าม normalize เพื่อความสวย

Acceptance:

- DATAVIZ-01-A — automated: required overlay fields, scale (family จาก `tokens.v0.9.4.json#/analyticalScales` หรือ series จาก `#/categoricalSeries`), Build Card `scaleFamilies[]` และ `seriesVariant`, non-color cues, value states ของ EVID-05, claim/evidence IDs and accessible data alternative resolve
- DATAVIZ-01-B — manual: form, scale, baseline, ordering, annotation, uncertainty and conclusion preserve meaning in format

**DATAVIZ-02 — Sequential scales use blended mids and hue zones.** A three-anchor sequential scale has a low anchor (default `brand.beige #F2F1DF`), a **mid anchor whose hue lies between low and high on the OKLCH wheel and is a blended (tertiary) hue — never a primary hue and never an `energy.*` token** — and a saturated high anchor. Mids sit at OKLab L .73–.77 with chroma ≤ .12. Families belong to one of three hue zones — warm, green, blue — and **one surface may use at most one family per zone**. Two families whose mid+high OKLab ΔE×100 sum is below 8 must be merged. Two families may depart from the beige low anchor because their identity depends on it: `water` (`#E6F1F2`) and `heat` (`#FBF1C6`).

**Families (14).** warm: activity, density.area, heat, risk · green: price, age, density.household, growth, confidence · blue: count, water, density.capita, built (renamed from density), duration. Anchors: `tokens.v0.9.4.json#/analyticalScales`; LUT 41 ขั้นและ classes 5/7/9 ต่อ family ต่อ theme: `color-srgb-07.scales.json` (แต่ละ record มี `scaleVersion`; dark anchors ของทุก record คำนวณตาม DATAVIZ-03 เว้น age ที่ประกาศ exception)

**Denominator rule.** The family is chosen by the unit's denominator, not by the topic: totals → count · per area → density.area · per person → density.capita · per household → density.household. Legends always print the denominator as the unit.

Diverging families (6) คงรูปสาม anchor (−, 0 = beige, +): balance, delta, tradeoff (light เดิม) และ flow, sentiment, anomaly (ใหม่) Alias `density` ยังใช้ได้และชี้ไป `built` (light anchors เดิม) light ของ r2 แก้จาก r1 สองจุดตามคำตัดสินของเจ้าของ 15 กันยายน 2569: heat mid `#E7A04C` → `#E3A257` (chroma .120) และ density.household high `#0B5B57` → `#0B5D2A` (hue 185° → 150°) ทำให้ household กับ age แยกกันได้ (ระยะห่างต่ำสุด 10.8 light / 9.3 dark) โดยไม่ต้องรวม เกณฑ์ตัวเลขของสีกลางเป็นเกตของ GATE-01 (L-MID-01 L .66–.82 โดย .73–.77 เป็น target ที่เตือน, L-MID-02 chroma ≤ .125 และ ΔE ≥ 5 จาก energy/brand token) light ของ 0.9.4 แก้จาก 0.9.3-r2 สี่จุดตาม delta ที่เจ้าของเลือกบนจอ: density.area mid `#E79363` → `#EE9A69` (ยก L เป็น .76 พ้น clay band), density.area high `#A92963` → `#A1182D` (ค่าเดิมอยู่ใน plum lane ห่างค่าที่ถอน `#9E476F` เพียง ΔE 5.2; เจ้าของเลือก crimson), tradeoff neg `#B23F74` → `#AB2E47` (plum lane; crimson) และ flow neg `#AA7E00` → `#D09B00` (ochre เข้มในหน้าต่าง earth; ทองอิ่มพ้นเพดาน C ≤ .145) ค่าที่วัดจริงทุก family อยู่ใน `contrast-evidence.json`: ผ่านทุกเกตโดยมี exception ที่ประกาศสามรายการที่ถูกใช้ (water และ built · L-MID-01; age · D-DERIVE-01) และ warning ห้ารายการ (confidence .697, count .728, water .826, built .651, duration .774 นอก target) ไม่มีการปรับค่าเงียบ ๆ

Acceptance:

- DATAVIZ-02-A — automated: ทุก family ที่ใช้ resolve `analyticalScales` ด้วย id ตรง; สีกลางไม่เท่ากับ brand.* หรือ energy.* token, มี OKLab ΔE ≥ 5 จากทุก token เหล่านั้น และ OKLCH chroma ≤ .125 (L-MID-02); L ของสีกลางอยู่ใน .66–.82 (L-MID-01; .73–.77 เป็น target ที่เตือน); Build Card `scaleFamilies[]` ไม่มีสอง family จากโซนเดียวกันบน surface เดียว; คู่ family ใด ๆ มี mid+high ΔE sum ≥ 8 ทั้ง light และ dark (SEP-01); legend พิมพ์ denominator เป็นหน่วย
- DATAVIZ-02-B — visual: LUT 41 ขั้นของ family ที่ใช้ไล่ค่าต่อเนื่องไม่มี band หรือ hue flip; classes 5/7/9 แยกกันได้บน light, dark และ print; family จากคนละโซนบน surface เดียวอ่านแยกกันได้โดยไม่ต้องดู legend

**DATAVIZ-03 — Dark scale anchors are derived from light anchors — same status as DATAVIZ-02 (A6.2).** No dark-theme scale anchor is hand-picked. Every dark anchor is computed from its light twin in OKLCH and re-computed whenever the light anchor changes:

- **low** = OKLCH(L .32, C .05, hue of the light mid) — the first class sits near the dark canvas (#11191D, L .21; contrast 1.4:1) so "little" reads faint, and it already carries the family hue (never a shared gray);
- **mid** L = 1.33 − L(light mid), clamped .50–.66; C = light-mid C clamped .05–.12; same hue;
- **high** L = 1.30 − L(light high), clamped .78–.90; C = light-high C clamped .06–.14 (gamut-limited); same hue;
- **diverging zero** = OKLCH(.32, .012, canvas hue) = #2D3438 (near-canvas, mirroring beige in light); poles L = 1.30 − L(light pole) clamped .76–.86, C = light C clamped .08–.14.

Because the mapping mirrors each anchor's position along the low→high axis, the two themes stay within 1.4× ΔE compression of each other (r1 hand-picked darks were compressed 2.4×). A dark value that fails the derivation is a preflight blocker, not a caveat.

**Amendment (0.9.4, verbatim from the delta of 17 September 2026).** Warm lane (light-mid hue 30–100°) gets its own dark derivation: low OKLCH(.32, .018, hue of light mid) · mid OKLCH(.66, min(C light mid,.12), same hue) · high unchanged. D-LOW-02 requires C ≤ .03 there; D-MID-01 targets L .66; D-STEP-02 widens to 0.5–3.0.

**D-STEP-03 (new gate, verbatim).** Warm lane only: per-class step ≥ 2.2 ΔE at the declared class count (5), replacing D-STEP-01. No in-gamut dark warm ramp holds .72× parity once the mid clears the earth window; measured 6.0–12.9.

เหตุผลของ amendment: สูตรเดิมคง hue ของ light แล้วลด L ซึ่งสำหรับ hue อุ่น (30–100°) ที่ L .32–.60 พร้อม chroma คือสีน้ำตาลโดยโครงสร้าง (activity, density.area, heat, risk, price ของ 0.9.3-r2 ตกหน้าต่าง earth ทั้งหมด); ธีมสว่างรอดเพราะ `brand.beige` อยู่ที่ L .94 และอ่านเป็นครีม warm lane ของ 0.9.4 คือ activity, density.area, heat, risk และ price (ตัดสินจาก hue ของ light mid: 30.1°, 50.4°, 68.2°, 84.7°, 92.2°) ส่วน family อื่นและ diverging ใช้สูตรเดิมทุกข้อ ค่าที่วัดของ D-STEP-03 ใน candidate นี้ 6.0–12.9 ΔE ต่อ class ตรงกับที่ delta รายงาน

**Numeric targets (tested by GATE-01).** (ก) hue visible at low: C .04–.07, hue within 12° of the mid · (ข) low near canvas: L .29–.35, contrast vs canvas ≤ 2.0:1, mid vs low ≥ 2.0:1, high vs canvas ≥ 7:1 · (ค) no compression: ΔE(mid→high) dark ≥ 0.72 × light; step balance ΔE(low→mid)/ΔE(mid→high) within 0.5–2.0 · plus mirror tolerance ±.02 L on mid and high and nearest-family separation ≥ 8 in both themes. ใน warm lane (0.9.4): low C ≤ .03 (D-LOW-02), mid L .66 ±.02 และ C ≤ .12 (D-MID-01), step balance 0.5–3.0 (D-STEP-02) และ class step ≥ 2.2 ΔE ที่ 5 classes (D-STEP-03 แทน D-STEP-01)

คำตัดสินของเจ้าของ 15 กันยายน 2569 ยังใช้: input ของสูตรคือ light hex ที่ ship ในทะเบียน ไม่ใช่ค่า OKLCH ก่อนปัด สคริปต์ `tools/build-color-srgb-07.mjs` ผลิต dark ทั้ง 20 family ด้วยสูตรที่แก้ไขและเทียบกับค่าของ delta: ตรง hex 17 family; density.area dark mid ต่าง 1/255 ในหนึ่ง channel (`#CC7B4A` ของสคริปต์ กับ `#CC7B4B` ของบอร์ด) และ heat dark high ต่างแบบเดียวกัน (`#FFD1D3` ของสคริปต์ กับ `#FFD0D3` ของบอร์ด r2) — ใช้ค่าที่สคริปต์ผลิตทั้งสองจุดตามแนวคำตัดสิน 15 กันยายน 2569 และบันทึกค่าของบอร์ดไว้ใน `color-srgb-07.tokens.json#/values/darkDerivation`; age dark mid ที่สูตรให้ `#787C53` อยู่ห่างค่าที่ถอน `#827C68` เพียง ΔE 3.51 ในช่วง hue 20° (ตก B-HUE-02) บอร์ดจึงหมุน hue ออกจากช่วงโดยคง L และ C (113° → 122°) เป็น `#717D55` ซึ่งไม่มีสูตร deterministic ใดให้ hex นี้ candidate จึง ship ค่าของบอร์ดเป็น exception ที่ประกาศ (`age · D-DERIVE-01`, `color-srgb-07.tokens.json#/values/gateExceptions`) ตามคำตัดสิน 17 กันยายน 2569 ผลลัพธ์ที่วัดได้: อัตราบีบ light/dark ของ ΔE(mid→high) เฉลี่ย 1.29× (ขีด 1.4×; warm lane ใช้ D-STEP-03 แทน) และ low ของทุก family ถือ hue ของตระกูลตั้งแต่ขั้นแรก (C .05 นอก warm lane, C .018 ใน warm lane) แทนเทากลางร่วม tolerance ของเครื่องมือที่ประกาศใน CHANGELOG: V-POLE-01 ±.005 L (gate fix ของ delta 17 กันยายน 2569 แทน ±.02 ของ 15 กันยายน; pole ที่ derive ไป L .76 พอดีปัดเป็น .759 ใน hex; ทั้งสองค่าผ่านกับค่าที่ ship) และ D-MID-01 chroma ±.001 (quantisation ของ hex 8 บิต; เจ้าของยืนยัน 17 กันยายน 2569)

Acceptance:

- DATAVIZ-03-A — automated (D-DERIVE-01): dark anchor ทุกค่าใน `analyticalScales` เท่ากับผลของสูตร (สูตรเดิมนอก warm lane, สูตร warm lane ใน lane) จาก light anchor ของ family เดียวกันแบบ hex-exact ด้วย OKLab/gamut implementation เดียวกับ `color-srgb-07.scales.json` หรือเป็น exception ที่ประกาศใน `gateExceptions` พร้อมค่าที่ derive ได้และเหตุผล (0.9.4: age · dark mid); dark override ใด ๆ ในหน้า (`--scale-*` ใน `[data-theme="dark"]`) ต้องเท่ากับค่าที่ derive จาก light ของหน้านั้น
- DATAVIZ-03-B — automated (GATE-01 dark gates): D-LOW-01, D-LOW-02, D-MID-01, D-HIGH-01, D-STEP-01 (นอก warm lane), D-STEP-02, D-STEP-03 (warm lane), D-CR-01, V-ZERO-01, V-POLE-01 ผ่านทุก family หรือมี exception ที่ประกาศ
- DATAVIZ-03-C — visual: LUT dark 41 ขั้นไม่มี band หรือ hue flip; ขั้นต่ำสุดอ่านเป็น "น้อย" บนพื้นมืดและยังบอกตระกูลได้; ทดสอบบนจอจริง (OLED และความสว่างต่ำ) ก่อน freeze

**GATE-01 — Data-colour gates run for both themes on every release.** `tools/validate-candidate-0.9.2.mjs` (or its successor in `tools/`) runs against the token proposal and the shipped `lds-tokens.css` before any candidate is published; its output is stored as `guidelines/contrast-evidence.json` with the release. Eleven sequential gates (L-LOW-01 · L-MID-01 · L-MID-02 · D-LOW-01 · D-LOW-02 · D-MID-01 · D-HIGH-01 · D-STEP-01 · D-STEP-02 · D-CR-01 · SEP-01), two diverging gates (V-ZERO-01 · V-POLE-01), two series gates (S-INK-01 ≥ 4.5:1 both themes · S-FILL-01 dark fill ≥ 3:1) and the state-label gate (ST-INK-01 `--text-metadata` ≥ 4.5:1 on canvas/card/alt/soft, both themes). Dark gates have the same status as light gates. One undeclared failure = exit 1 = release blocked. Exceptions are declared only in `sequential.exceptions[]` with family, gate, value and reason, and appear in evidence as "excepted", never as "pass". Warnings (light mid outside the .73–.77 target band) are recorded, not gating.

ใน package นี้ successor คือ `validate-dataviz-gates-0.9.4.mjs` (รับทั้งทะเบียน `color-srgb-07.tokens.json` และ proposal JSON; เพิ่ม D-DERIVE-01, D-STEP-03 และเกตหน้าต่างสี B-HUE-01, B-HUE-02, SC-17 ของ DATAVIZ-04; D-LOW-02, D-MID-01, D-STEP-01/02 รู้จัก warm lane; V-POLE-01 ±.005 L) และหลักฐานเก็บที่ `contrast-evidence.json` (schema 1.2) ข้อยกเว้นที่ประกาศ (`color-srgb-07.tokens.json#/values/gateExceptions`): water · L-MID-01 (mid L .82; low ไม่ใช่เบจ) · built · L-MID-01 (ค่าสืบทอด 0.9.1, L .65) · duration · D-MID-01 (ประกาศไว้แต่ไม่ถูกใช้ เพราะ dark mid ที่ derive ผ่านเกต; delta ระบุให้คงไว้ เจ้าของยืนยัน 17 กันยายน 2569) · age · D-DERIVE-01 (dark mid ของบอร์ด `#717D55` แทนค่าที่ derive `#787C53` ซึ่งตก B-HUE-02; ใหม่ใน 0.9.4) ผลของ candidate นี้: PASS · undeclared failures 0 · declared exceptions 3 ที่ถูกใช้ (+ duration ที่ไม่ถูกใช้) · warnings 5 · B-HUE-01/02 clean 180 ค่า · separation ต่ำสุด light 10.2 / dark 9.7 (ตรงกับที่ delta คาดไว้; delta นับค่าที่ audit 200 — ความต่างของวิธีนับอยู่ใน §21)

Acceptance:

- GATE-01-A — automated: `contrast-evidence.json` ใหม่กว่า `color-srgb-07.tokens.json` และ `lds-0.9.4-ext.css` ที่ ship, สรุปผล PASS รวม B-HUE-01/02 และ SC-17 clean, และทุก exception ที่ปรากฏมีอยู่ใน `gateExceptions` พร้อม family, gate, value, reason
- GATE-01-B — manual: การเพิ่ม exception ใหม่มีลายเซ็นของเจ้าของใน release.json ก่อน freeze

**DATAVIZ-04 — Analytical values stay out of the retired hue windows.** The two OKLCh windows retired by the v0.9.0 purple-brown purge become a gate over every analytical value in both themes: earth H 30–100° · C .035–.145 · L ≤ .62 · violet H 285–345° · C ≥ .04 · clay band (light only, warning) H 22–100° · C .09–.145 · L .62–.74 · B-HUE-02 proximity ΔE < 6 from the eight earth/taupe purged values inside a 20° hue lane. Pink ruling (owner, 17 Sep 2026): warm pink H 350–20° is legal; the violet window stays closed. No new token may be minted to escape the gate. C > .145 at L ≤ .62 is a saturated red/vermilion/gold, not an earth tone.

ที่มา: delta 0.9.2-r2 → 0.9.4-r1 ของบอร์ด (17 กันยายน 2569) — ข้อความกฎเป็น verbatim; ชื่อกฎตั้งโดย candidate นี้เพราะ delta ให้เฉพาะรหัส กฎนี้เกิดจากคำถามของเจ้าของว่าทำไมยังเห็นสีน้ำตาลทั้งที่ v0.9.0 ถอนหน้าต่างสีม่วง-น้ำตาลไปแล้ว: เกตสิบเอ็ดข้อของ r2 วัด L, C, ΔE, separation และ contrast แต่ไม่มีข้อใดอ่านหน้าต่างสี และ `machine/v0.9.0/preflight.yml` ที่ถือหน้าต่างทั้งสองไม่เคยถูกดึงเข้าเครื่องมือของ candidate ขอบเขตของเกต ("ค่าวิเคราะห์") คือ anchor ทุกตัวของ 14 + 6 family ทั้งสองธีมและ fill/ink ของ series ทุกช่องทุก variant — 180 ค่าในทะเบียน (delta นับ 200; ความต่างของวิธีนับบันทึกใน §21) ค่าที่ถอนแบบ exact ของ v0.9.0 (SC-17) สิบค่า รวมสองค่าชมพูที่ถอนโดยชื่อ (`#9E476F`, `#E982AE`) ยังห้ามใช้ตรง ๆ แม้ pink ruling จะให้สีชมพูอุ่นถูกกฎ ผลของ candidate นี้: B-HUE-01/02 clean — 180 ค่า, fail 0, clay warning 0 LUT ที่ interpolate ของ warm lane ผ่านหน้าต่าง earth 110 จาก 1,640 ขั้น และสี class 37 ค่า — รายงานเป็นหลักฐานใน `contrast-evidence.json` ไม่ใช่เกต ตามคำตัดสินเจ้าของ 17 กันยายน 2569 ที่ให้ประกาศใช้ 0.9.4 และส่งเรื่อง LUT กลับบอร์ด (§21) ส่วน `color-srgb-07.production.css` มีสามค่านอกขอบเขตของกฎที่ตกหน้าต่าง earth (`--ldm-semantic-warning-dark-background #3B2E16`, `--ldm-semantic-warning-light-foreground #A64A00` และ alias v5 ที่ deprecated `--ldm-series-03-light #A87B00`) — บันทึกใน evidence และ §21 ไม่แก้เงียบ ๆ

Acceptance:

- DATAVIZ-04-A — automated (B-HUE-01, B-HUE-02, SC-17): ทุก anchor ของ `analyticalScales` และทุก fill/ink ของ `categoricalSeries` ทั้งสองธีมอยู่นอกหน้าต่าง earth และ violet, ไม่ใกล้ค่า earth/taupe ที่ถอนแปดค่าเกิน ΔE 6 ในช่วง hue 20°, และไม่เท่ากับค่าที่ถอนแบบ exact สิบค่า; clay band (light) บันทึกเป็น warning; `--scale-*` และ `--series-*` ที่หน้า override ต้องผ่านเกตเดียวกัน (preflight PF-DATAVIZ-04-HUE); ไม่มี token ใหม่ที่ตั้งขึ้นเพื่อเลี่ยงเกต
- DATAVIZ-04-B — visual: สเกลและ series ทั้งสองธีมไม่อ่านเป็นสีน้ำตาล ดินเผา หรือม่วงบนจอจริง; สีชมพูอุ่น (H 350–20°) เมื่อใช้อ่านเป็นชมพู ไม่ใช่ม่วง
**DATAVIZ-05 — Categorical series are luminous and edge-separated.** The series registry `landometer-series-10-v7` ("Dial 10") derives its ten hues from the dial of the mark (coral 22°, yellow 82°, mint 165°, sky 225°) and the pin (263°), with blended hues between them. Each slot has a **fill tier** at the hue's natural lightness (OKLab L .66–.84) and an **ink tier** (≥ 4.5:1 against canvas). **Fills need not reach 3:1 against the canvas**; instead every categorical area is separated by a ≥ 1px `--border-default` edge or an ink outline, legend swatches carry a hairline border, and text, lines and marks thinner than 3px use the ink tier. Colour-only identification stops at slot 6; slots 7–10 always carry their shape cue. Assignments persist by category ID. Two chroma variants (`vivid`, `soft`) share one ink tier; a Build Card names which variant a surface uses. **Energy accents and a vivid categorical chart do not share one surface.** The ink tier carries legibility, not identity. Where a slot hue has no legible dark form, the slot ink falls back to --text-primary #182327 and identification stays with fill + shape cue.

Default ของ release นี้คือ `dial-soft` (คำตัดสินของเจ้าของ 15 กันยายน 2569); `dial-vivid` เปิดใช้ต่อ surface ด้วย `[data-series="vivid"]` และต้องประกาศใน Build Card `seriesVariant` โครงสร้าง 0.9.4 ตาม delta: registry `landometer-series-10-v7` (จาก v6 ของ 0.9.3), slot 10 `rose` → `green` (hue 140°; fill soft `#82AC79` / vivid `#71B262`, ink `#34622A`; dark fill `#9AD78C`, ink `#B8E7AE`) เจ้าของเลือกบนจอ 17 กันยายน 2569, binding `landuse.tourism` → green, และชุด rose (`#F571A4` / `#DA88A4` / ink `#91355A`) บันทึกเป็น `categoricalSeries.slot10Alternates.rose` ซึ่งถูกกฎตาม pink ruling แต่ไม่ถูกเลือก — เลือกภายหลังได้โดยไม่ต้องแก้กฎ ink ของ slot 2 (apricot `#9B4900` — สีส้มไหม้ในหน้าต่าง earth ไม่มีรูปเข้มที่อ่านได้ของ hue อุ่นนี้) และ slot 3 (yellow `#896500` — ห่างค่าที่ถอน `#846100` เพียง ΔE 1.5) ในธีมสว่างตกไปที่ `--text-primary #182327` ตาม amendment (`categoricalSeries.inkFallback`); การระบุหมวดยังอยู่ที่ fill + shape cue ค่าที่วัดจริง (light ink ≥ 5.24:1 ทุกช่องบน canvas, dark fill ≥ 8.93:1, dark ink ≥ 12.13:1, light fill 1.53–2.88:1 โดยตั้งใจ) อยู่ใน `contrast-evidence.json`; ข้อสังเกตที่บันทึกไม่ใช่เกต: fill ของ slot 10 สีเขียวในธีมมืดห่างจาก slot 5 (mint) ΔE 4.8 และจาก slot 4 (lime) 6.1 — slot 7–10 ต้องมี shape cue อยู่แล้วตามกฎ กติกาที่เจ้าของยืนยัน 15 กันยายน 2569: fill ช่อง sky ของ soft (`#6ACCF0`) ห่างจาก `energy.sky` เพียง ΔE 2.3 จึงถือว่าช่อง sky ของทั้งสองแบบเป็น energy accent (`categoricalSeries.energyAccentSlots`) กติกาห้ามอยู่ร่วม surface กับ energy accent จึงใช้กับช่องนี้แม้ในแบบ soft ชุด `landometer-series-10-v5` เป็น deprecated alias: ชื่อ CSS เดิมยังให้ค่าเดิม (ไม่เปลี่ยนสีงานเก่าเงียบ ๆ; `--ldm-series-03-light #A87B00` ของ v5 จึงยังตกหน้าต่าง earth และถูกรายงานไว้ ไม่ใช่เกต) แต่งานใหม่ MUST bind fill/ink ของ v7 และ preflight เตือนเมื่อพบชื่อ v5; ชื่อ CSS ของ fill/ink ที่ 0.9.3 ตั้งไว้ใช้กับ v7 โดยไม่เปลี่ยน

Acceptance:

- DATAVIZ-05-A — automated: categorical colour resolve `categoricalSeries` v7 ด้วย category ID binding; ink ทุกช่องที่ใช้ ≥ 4.5:1 บน canvas และ card (ช่องที่ประกาศ `inkFallback` ใช้ `--text-primary`); text, line และ mark < 3px ใช้ ink tier; area ที่ติดกันมี edge ≥ 1px `border.default` หรือ ink outline; legend swatch มี hairline border; ช่อง 7–10 มี shape cue; Build Card `seriesVariant` ตรงกับ `[data-series]` ที่ deliver; surface ที่ประกาศ vivid ไม่มี energy accent
- DATAVIZ-05-B — visual: หมวดหมู่แยกกันได้ที่ feed size, print และ dark theme (slot 7–10 ด้วย shape cue); การเรียง slot ตาม category ID ไม่เปลี่ยนเมื่อ filter หรือ sort

**MAP-01 — Maps preserve geography and coverage truth.** Map overlay MUST declare geography ID, boundary source, purpose, covered area, grain, time, unit, schema release, attribution/rights, projection เมื่อมีผล, ห้าสถานะของค่าตาม EVID-05 (`measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`) รวมทั้ง low-confidence/selected/focus states และ nonspatial alternative Export records viewport/zoom/filters/data receipt It MUST NOT imply unsupported coverage, treat missing as zero or generalize product classification

Acceptance:

- MAP-01-A — automated: fields/states/attribution/alternative/export receipt resolve; `dataStates` ครอบคลุม enum ห้าค่าของ EVID-05 ที่เกิดจริงในข้อมูล และ MapLegend แสดง state rows ที่มี
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
14. motion moments ของเส้นทาง (`motionMoments[]`: kind, job จาก manifest, beat; ≤ 3 ต่อ route, ≤ 1 ต่อ task surface) และการยืนยันว่าไม่มี motif บน first answer, primary proof หรือ primary action; product overlay ที่ใช้ต้องอ้าง `motif-register.v0.9.4.json` ด้วย hash
15. dark anchors ที่ใช้ทุกค่าเท่ากับผลของสูตร DATAVIZ-03 และ `contrast-evidence.json` ที่ใหม่กว่า token/CSS ที่ ship (GATE-01)

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

**QA-01 — Conformance is receipt-based.** Conformance MUST computed จาก applicable automated, manual, visual, interaction, accessibility และ production checks ที่มี dated receipts v0.9.4 ไม่รับ exception reference ใน artifact conformance: Build Card `qa.exceptionIds` และ Artifact Manifest `resolution.exceptionRefs` MUST เป็น `[]` ทั้งคู่

Acceptance:

- QA-01-A — automated: applicable required check ทุกอันมี current passing receipt และไม่มี blocking failure
- QA-01-B — manual: arrays ทั้งสองเป็นศูนย์และไม่มี MUST หรือ MUST NOT deviation ถูกนำเสนอว่า conforming; SHOULD recommendations are reported separately when useful

ผลของ resolved acceptance/layer/gate ใช้ `pass`, `fail` หรือ `not_tested` เท่านั้น; `not_tested` ไม่สามารถนับเป็น pass กฎที่ไม่ใช้ระบุแยกใน `resolution.nonApplicableRuleIds` และต้องอธิบาย trigger/owner ตาม machine contract Aggregate score ห้ามซ่อน failed MUST

Conformance receipt MUST เป็น bundle-local, validate ด้วย `conformance-receipt.schema.json` และ bind subject/file bytes ด้วย SHA-256 Manifest layer หรือ gate claim ที่เป็น `pass` MUST มี receipt ref + hash ที่ resolve ได้; คำว่า pass ใน prose หรือ dashboard ไม่พอ ก่อน claim `artifact_qa_passed` ทั้ง discovery/readability/action MUST `pass`, resolved non-production acceptances ทั้งหมด MUST `pass`, และ receipt ของ OUTPUT-CLARITY-01-A MUST list exact `delivery.files` set พร้อม SHA-256 ครบทุกรายการ ก่อน claim `production_verified` resolved production acceptances ทั้งหมด MUST `pass` และ receipt ของ OUTPUT-CLARITY-01-B MUST cover exact set และ hashes ชุดเดียวกัน; coverage ที่ขาดหรือเกินล้วน blocks level claim

แต่ receipt ที่ signed แยกชิ้นยังห้ามใช้ replay หลัง Build Card หรือ governance เปลี่ยน `artifact_qa_passed` และ `production_verified` MUST bind `validation.promotionSnapshot` ที่ validate ด้วย `promotion-snapshot.schema.json` และมี detached `promotion_snapshot` attestation จาก externally pinned operator key Snapshot เป็น non-circular record ที่ bind exact Build Card bytes, canonical Artifact Manifest promotion projection, artifact-resolved format-implementation record, social sidecar เมื่อมี, implementation source + lineage receipts/attestations, final outputs และ receipt/attestation ทุกใบของ phase นั้น Snapshot ที่ขาด/เกิน, hash drift หรือใช้กับ artifact/build อื่น MUST block promotion

Approval, conformance, promotion, confirmation, execution และ source-lineage result ที่ใช้เลื่อนสถานะหรืออนุญาตการกระทำ MUST มี detached Ed25519 attestation ที่ validate ด้วย `verification-attestation.schema.json` v1.1 และ bind exact purpose, subject ref/hash/media type, issuer, key และเวลา Signature MUST verify ด้วย purpose-authorized, unrevoked, unexpired key ที่ caller-controlled policy pin exact `trustStoreId`, `issuerId`, `keyId` และ public-key SPKI SHA-256

- package ไม่ bundle trust anchor ที่ให้อำนาจตัวเอง `SHA256SUMS.txt` cover authoritative package files ทุกไฟล์ ยกเว้น checksum file เองและ detached `package-root.attestation.json` เพื่อหลีกเลี่ยง circular hash; validator MUST verify root signature ด้วย external `package_release` trust store + external caller-pinned policy ก่อนเชื่อ release หรือทำ downstream validation
- downstream artifact promotion/conformance, source lineage, agent confirmation และ terminal execution MUST ใช้ separate `operator_external` trust store + matching pinned policy ที่ผู้ตรวจควบคุมและได้รับจากช่องทางอิสระจาก artifact bundle
- การวาง trust JSON ไว้นอก bundle หรือเป็น sibling file อย่างเดียวไม่สร้าง authority; policy key fingerprint ต้องตรงทุก key และ key ที่ revoked/expired ณ current verification time MUST fail หากต้องยอมรับประวัติหลัง key ถูก revoke ต้องมี independent trusted timestamp contract ซึ่ง v0.9.4 ยังไม่ให้ exception path
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
| QG-12 data colour (GATE-01) | `contrast-evidence.json` ของ release ผ่านทุกเกตทั้งสองธีมโดยมีเฉพาะ exception ที่ประกาศ; dark override ในหน้าเท่ากับผลของสูตร DATAVIZ-03 (warm lane ใช้สูตรของ lane); ทุก `--scale-*`/`--series-*` ของหน้าอยู่นอกหน้าต่างสีที่ถอนแล้ว (DATAVIZ-04) |
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
- dataviz/data states (v0.9.4): dark anchors equal the DATAVIZ-03 derivation (warm lane by its own formula) or a declared exception, no analytical value inside a retired hue window (DATAVIZ-04), GATE-01 evidence current, scale family per zone, series variant vs energy accent on the same surface, five value states rendered and labelled, no 0/null without state in machine output
- web identity (v0.9.4): six icon sizes + manifest + theme-color, title pattern, OG 1200 × 630 recognisers and safe areas
- identity motion and motifs (v0.9.4): runtime and SVG hash parity, registered job per motif, ≤ 3 moments per route and none in forbidden regions, replay while ≥ 14% visible, stop off-screen, page pause, reduced-motion/no-JS/print final state, no infinite iteration

### 14.4 No artifact exception channel in v0.9.4

Active machine contracts enforce `qa.exceptionIds: []` and `resolution.exceptionRefs: []` with `maxItems: 0` ไม่มี prose record, owner note หรือ approval message ใด bypass เงื่อนไขนี้ได้ ถ้าจำเป็นต้องรองรับ deviation แบบ typed ในอนาคต ต้องออก normative Design System release ใหม่ที่เพิ่ม schema, authority, expiry/removal test และ migration อย่างชัดเจน ก่อนหน้านั้น artifact ที่มี deviation ยังเป็น failed/blocked/internal preview ตามผลกระทบ ไม่ใช่ conforming output

### 14.5 Release activation และ artifact production boundary

v0.9.4 นี้ active และ effective ตั้งแต่แพ็กเกจ immutable v0.9.4-mp1: release.json บันทึก owner approval ของ 17 กันยายน 2569 (approver, time, evidence ref) พร้อม `effective: true`, ลายเซ็น package-root และ release-approval ของ release operator, exhaustive migration ของ 50 predecessor rules (`migration-ledger.json`), structural ID/title/acceptance parity (64 rules) กับ review ตาม PARITY-01-B ที่บันทึกใน `release.json#/humanMachineParity`, OUTPUT-CLARITY-01 และ package checksum gate ถูกบันทึกใน release เดียวกัน `v0.9.1-mp7` เป็น predecessor ที่ถูกแทนที่ เครื่องมือของ package นี้: `validate-v0.9.4.mjs` (port ของ `validate-v0.9.1.mjs`; ต้องได้ external trust store + caller-pinned policy คู่กัน), `validate-dataviz-gates-0.9.4.mjs`, `measure-motif-carriers-0.9.4.mjs` และ `freeze-release.mjs` ที่ผลิตแพ็กเกจนี้จาก candidate ที่อนุมัติ; งานตามหลัง freeze ที่ไม่ขวางการมีผลบังคับใช้อยู่ใน §21 และ `release.json#/postApprovalFollowUps`

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

## 15. Migration from v0.9.1-r8

`migration-ledger.json` เป็น machine ledger แบบ exhaustive: predecessor normative rule ID ทั้ง 50 อันของ v0.9.1 ต้องมี disposition หนึ่งค่าเท่านั้น (`retained`, `amended_in_place`, `superseded_by`, `deprecated_alias`, `moved_to_product_pack` หรือ `removed_with_owner_reason`) รอบนี้เพิ่ม `amended_in_place` (schema 1.1) สำหรับกฎที่คง ID เดิมแต่ requirement หรือ acceptance เปลี่ยน Unmapped, duplicate หรือ target ที่ไม่มีจริง block promotion ตารางด้านล่างเป็น human summary ระดับประโยค: ประโยคเดิม → ประโยคใหม่ → เหตุผล → สิ่งที่กระทบ (machine copy: `migration-ledger.json#/sentenceLedger` สี่ stage: 0.9.1-r8 → 0.9.2-r1 → 0.9.3-r1 → 0.9.3-r2 → 0.9.4-r1) รอบ 0.9.4 เพิ่มการเปลี่ยนรหัสกฎ series DATAVIZ-04 → DATAVIZ-05 (`migration-ledger.json#/ruleIdReassignment`; ผู้บริโภคเครื่อง key ด้วย releaseRef + ruleId เสมอ) และตารางค่า 26 รายการของ delta ใน §15.5

### 15.1 Retained without normative value change

40 กฎจาก 50 คงเดิมทั้ง requirement และ acceptance ได้แก่ governance, authority, layer, comparison, output clarity, AHA, brand lines, surface, typography, interface icon, layout, control geometry, theme, asset delivery, profile, capability, parity, navigation, bookmark, CTA, approach motion lifecycle (MOTION-02 แก้เฉพาะประโยค once-only), layout stability, accessibility, claims, discovery, agent, security, format packs อื่นนอกจาก web และ social, component anatomy, carousel, social feed, QA และ release identifiers

### 15.2 Amended in place (10 กฎ) และกฎใหม่ (14 กฎ)

| Rule | ประโยคเดิม (0.9.1-r8) | ประโยคใหม่ (0.9.4-r1) | เหตุผล | กระทบ |
|---|---|---|---|---|
| EVIDENCE-01 | และ missing data ห้ามแสดงเป็น zero | … ค่าทุกช่องต้องถือหนึ่งในห้าสถานะของ EVID-05 | ศูนย์กับค่าว่างเคยเป็นสองสถานะ; ข้อมูลเมืองมี out-of-scope, suppressed, not-yet ที่ต้องแยก | DataTable, MapLegend, EvidenceCard, agent payload |
| LOGO-01 | tab/favicon … ใช้ได้เฉพาะ separately approved asset ของ role นั้น | เพิ่ม (ชุดไอคอนของเว็บ resolve ผ่าน FAVICON-01) | ให้ favicon มีกฎของตัวเองแทนการอนุมานจาก LOGO-01 | asset-registry iconSets |
| COLOR-01 | governed roles ของ color-srgb-05; production ใช้ color-srgb-05.production.css; raw สี่ไฟล์ | color-srgb-07 (06 ใน 0.9.3); production ใช้ color-srgb-07.production.css; raw สองไฟล์ + สองไฟล์ของ 06 + สี่ไฟล์เดิม | series, scales, data states เปลี่ยน → set ใหม่; 0.9.4 เปลี่ยนค่าที่ govern อีก 26 ค่า → set ใหม่อีกครั้ง (id ไม่ถูกนิยามซ้ำ) | ทุก artifact ที่ deliver CSS สี |
| MEDIA-01 | identity — ห้าม … motion โดยไม่มี approved variant | identity ไม่เคลื่อนไหว; animated variant มีทางเดียวคือ motif.v3 logo ตาม MOTION-04; product animated identity ผ่าน overlay ที่ลงทะเบียนตาม MOTIF-05 | ปิดช่องที่ approved variant ถูกอ่านเป็นการ animate ไฟล์อัตลักษณ์เอง | BrandSignature, MotifFrame, motif-register |
| MOTION-01 | Decorative motion MUST finite … ไม่มี perpetual flicker; -B ไม่มี infinite attention animation | finite play ซ้ำเป็นรอบ ≥ 2,000 ms ตาม MOTION-04; -B ห้าม infinite iteration และรับ finite replay | OWNER-MOTION-01 ใหญ่กว่า DS ในเรื่องการเล่นซ้ำ | ทุก motion role, preflight |
| MOTION-02 | once-only unobserve | replay on re-entry; ไม่วนขณะอยู่นิ่ง (เจ้าของยืนยัน 15 กันยายน 2569) | OWNER-MOTION-01 supersedes once-only reveal "for repetition only" | motion.approach.onceOnlyUnobserve → false |
| WEBFMT-01 | share preview และ production verification | + OG 1200 × 630, icon set หกขนาด, title pattern; -A ตรวจ icon set/manifest/theme-color/OG | ไม่มีไอคอน = blocker; link preview คือหน้าแรกที่คนเห็น | format-packs web pack, skeleton |
| SOCIALFMT-01 | square 1080 เท่านั้น; ratio อื่น block | สอง targets: square 1080 + og 1200 × 630; ratio อื่น block; recogniser/safe area/metadata template | link preview เป็นสื่อหลักที่แชร์จริง | target-profiles, format-kits, sidecar |
| DATAVIZ-01 | scale (ไม่ระบุ registry) | scale จาก analyticalScales/categoricalSeries + scaleFamilies[]/seriesVariant + value states | ผูกการใช้สีข้อมูลเข้ากับ registry ใหม่ | Build Card dataVisualization config |
| MAP-01 | no-data/out-of-scope/low-confidence/selected/focus states | ห้าสถานะ EVID-05 + low-confidence/selected/focus | ให้แผนที่กับตารางใช้ enum เดียวกัน | map.dataStates |
| DATAVIZ-02 (ใหม่, A6.2) | A6 ของ 0.9.1: 6 sequential + 3 diverging ไม่มีกติกาสีกลาง | 14 sequential + 6 diverging, สีกลางผสม, สามโซน, หนึ่ง family ต่อโซนต่อ surface, denominator rule | สีกลางเดิมชน energy token และครอบคลุมหน่วยไม่ครบ | tokens analyticalScales, color-srgb-07.scales.json |
| DATAVIZ-03 (ใหม่; แก้ไขใน 0.9.4) | dark anchors ของ A6 ใน 0.9.1 เลือกด้วยมือ (dark block ของ ext-registry) | dark anchor ทุกค่าคำนวณจาก light ด้วยสูตร OKLCH (low .32/.05 · mid 1.33−L · high 1.30−L · zero #2D3438); warm lane (light-mid hue 30–100°: activity, density.area, heat, risk, price) ใช้ low .32/.018 · mid L .66, C ≤ .12 · high เดิม และเกต D-STEP-03 (class step ≥ 2.2 ΔE) แทน D-STEP-01; hand-edit เป็น blocker; exception ที่ประกาศได้ (age dark mid) | r1 dark: low เป็นเทากลางร่วม L .58 C .03 และ mid→high บีบ 2.4×; 0.9.3-r2: สูตรเดิมให้สีน้ำตาล (หน้าต่าง earth) กับทุก family อุ่นโดยโครงสร้าง | tokens analyticalScales dark, LUT dark, preflight, build-color script, validate-dataviz-gates |
| DATAVIZ-04 (ใหม่ใน 0.9.4) | ไม่มีเกตหน้าต่างสี; หน้าต่าง earth/violet ที่ v0.9.0 ถอนอยู่ใน `machine/v0.9.0/preflight.yml` แต่ไม่ถูกดึงเข้าเครื่องมือของ candidate | ทุกค่าวิเคราะห์ทั้งสองธีมนอกหน้าต่าง earth (H 30–100°, C .035–.145, L ≤ .62) และ violet (H 285–345°, C ≥ .04); clay band (light) เตือน; B-HUE-02 ห้ามใกล้ค่า earth/taupe ที่ถอนแปดค่า ΔE < 6 ในช่วง hue 20°; SC-17 ห้ามค่าที่ถอนแบบ exact; pink H 350–20° ถูกกฎ; ห้ามตั้ง token ใหม่เพื่อเลี่ยงเกต | เจ้าของยังเห็นสีน้ำตาลใน 0.9.3-r2 ทั้งที่ถอนไปแล้ว; delta 17 กันยายน 2569 | validate-dataviz-gates (B-HUE-01/02, SC-17), contrast-evidence, preflight PF-DATAVIZ-04-HUE, tokens bannedHue |
| DATAVIZ-05 (ใหม่, A5.2; รหัส DATAVIZ-04 ใน 0.9.3 และ DATAVIZ-03 ใน candidate ที่ถูกถอน; แก้ไขใน 0.9.4) | series-10-v5: สีเข้มผ่าน 4.5:1 ทุกช่อง; "series fills reach 4.5:1 against canvas" | series-10-v7 fill สว่างแยกด้วยเส้น + ink ≥ 4.5:1; soft default, vivid opt-in; vivid ไม่อยู่ร่วม energy accent; ช่อง sky = energy accent; slot 10 green (rose เป็น alternate ที่ถูกกฎ); ink ของช่องที่ไม่มีรูปเข้มที่อ่านได้ตกไปที่ `--text-primary` (slot 2, 3 light) | fill เข้มทั้งสิบทำให้กราฟหนักและอ่านหมวดยาก; ink ของ slot 2/3 ใน v6 อยู่ในหน้าต่าง earth; slot 10 rose เปลี่ยนเป็นเขียวตามที่เจ้าของเลือกบนจอ 17 กันยายน 2569 | tokens categoricalSeries (v7, slot10Alternates, inkFallback), legend, preflight |
| GATE-01 (ใหม่; ชุดเกตขยายใน 0.9.4) | ไม่มีเกตสีข้อมูลที่รันทุก release; dark ไม่มีเกต | 11 + 2 + 2 + 1 เกตทั้งสองธีมทุก release ผ่านเครื่องมือ (0.9.3 เพิ่ม D-DERIVE-01; 0.9.4 เพิ่ม D-STEP-03, B-HUE-01/02, SC-17 และ V-POLE-01 ±.005 L); exception ประกาศได้ที่เดียว; หลักฐานเก็บกับ release | ค่าที่ผิดเกณฑ์เคยหลุดไปถึง candidate โดยไม่มีตัวขวาง | validate-dataviz-gates-0.9.4.mjs, contrast-evidence.json |
| MOTION-04 (ใหม่) | readme "The official logo never animates"; BrandSignature "never animated" | ไฟล์ทางการไม่เคลื่อนไหว แต่ mark ประกอบได้ผ่าน runtime motif.v3 ที่ hash ตรง; เล่นซ้ำขณะมองเห็น | คำตัดสินเจ้าของ 11 กันยายน 2569 | MotifFrame, tokens motion.identity |
| MOTIF-01 (ใหม่) | ไม่มี job registry ของ motion | ทุก motif ประกาศ job จาก registry สิบค่าของ manifest; ไม่มี job = ไม่ใช้ | motion ต้องแสดงวิธีทำงาน ไม่ใช่ประดับ | MotifFrame prop job, preflight |
| MOTIF-02 (ใหม่) | MEDIA-01 identity เท่านั้น | motif และ animated mark มีอยู่เฉพาะเป็น runtime bytes ที่ลงทะเบียน + final-state SVG ที่ geometry ตรงเฟรมสุดท้าย; ทุก static route แสดง final state | ห้ามวาดใหม่/trace | motif-register hashes, noscript fallback |
| MOTIF-03 (ใหม่) | MOTION-01 finite play ทั่วไป | vocabulary ฟิสิกส์ที่กำหนด; ห้าม hue cycling, morphing, distortion, parallax, loop ไม่มีขอบ, scale > 1.16; motif 1.2–3.4 s; cycle ≥ 2,000 ms | ขอบของความสนุก | preflight infinite/scale scan |
| MOTIF-04 (ใหม่) | BRAND-02 controlled rhythm ไม่มี mapping ของ motif | สามจังหวะ INTENT → AHA → NEXT ACTION = Opening/Transition/Closing; kind ต่อจังหวะ; ≤ 3 moments ต่อ route, 1 ต่อ task surface; ห้ามบน first answer/primary proof/primary action; ตำแหน่งบนพื้นอยู่ใน MOTIF-06 (r2 ตัดประโยค full บน beige/Brand Blue/atmosphere · quiet ใน content column ของแพตช์ออก) | joy budget | Build Card motionMoments[], preflight |
| MOTIF-05 (ใหม่) | ไม่มีชั้น product overlay | shared layer product-neutral; product animated identity เป็น overlay ที่ลงทะเบียนแยกพร้อม hash และ owner approval; ห้ามผสม family ใน lockup เดียว | รองรับ motif ทั้งไซต์ Motif Studio โดยไม่ให้ DS สร้าง product fact | motif-register productOverlays |
| MOTIF-06 (ใหม่ใน r2) | ไม่มี; แพตช์ r2 ให้ full อยู่บน beige/Brand Blue/atmosphere และ quiet ใน content column | ทุกการวางประกาศ `data-host-surface`; full บนพื้นสว่างเรียบเท่านั้น, quiet บนพื้นเข้มรวม Brand Blue; ทุก paint ≥ 1.30:1 ในทุกธีมที่ render; แก้ที่พื้น, variant, ขนาด หรือถอดลาย ไม่แก้ที่ลาย | SVG full มี `#1D4497` จึงหายบน Brand Blue (1.00:1); quiet บนพื้นสว่างได้ไม่เกิน 1.74:1; ladder ที่เจ้าของอนุมัติ 11 กันยายน 2569; คำตัดสิน 16 กันยายน 2569 | motif-register carrierPolicy, MotifFrame, preflight PF-MOTIF-06-CARRIER, Build Card, skeleton, showcase |
| FAVICON-01 (ใหม่) | ไม่มี | ชุดไอคอนหกขนาด, เลือกตาม property, title pattern | ไม่มีไอคอน = blocker ของ WEBFMT-01 | asset-registry iconSets, skeleton |
| EVID-05 (ใหม่) | A6 "no data vs measured zero"; DataTable noDataLabel; MapLegend noData/zero | enum ห้าสถานะ + ป้าย/อักขระ/สี/ลาย + สิ่งที่ต้องมี; cellStates; state rows; EvidenceCard | ค่าว่าง ≠ ศูนย์ | tokens valueStates, component contracts |

### 15.3 Token และ value changes ที่ต้องรู้เมื่อย้ายงาน

- `color-srgb-07.production.css` คงชื่อทั้ง 177 ของ color-srgb-05; ค่าที่เปลี่ยนใต้ชื่อเดิมมี 34 ค่าและเป็น scale anchors ทั้งหมด: light mid ของ activity, risk, growth และ water (low/mid/high), light neg ของ tradeoff (0.9.4), dark anchors ทั้งสาม (คำนวณตาม DATAVIZ-03; activity และ risk ตามสูตร warm lane ของ 0.9.4) ของ activity, risk, growth, confidence, water, density/built และของ diverging เดิม balance, delta, tradeoff ค่า foundation, semantic, brand, energy, product, map และ series v5 ไม่เปลี่ยน; งานที่ preview ด้วย 0.9.3-r2 ต้องรับค่าใหม่ 26 declarations ตาม §15.5 (ชื่อไม่เปลี่ยน)
- family ใหม่: density.area, heat, price, age, density.household, count, density.capita, duration, flow, sentiment, anomaly; `density` → alias ของ `built`
- categorical: bind `--ldm-series-NN-fill-*` และ `--ldm-series-NN-ink-*` (soft) หรือ `--ldm-series-NN-dial-vivid-fill-*` (vivid); ชื่อ `--ldm-series-NN-light/dark` ของ v5 ยังให้ค่าเดิมแต่ deprecated; registry `landometer-series-10-v7`: slot 10 = green (`landuse.tourism` → green; ชุด rose อยู่ใน `slot10Alternates`), ink light ของ slot 2 และ 3 = `--text-primary #182327` (`inkFallback`)
- motion: `motion.approach.onceOnlyUnobserve` true → false; เพิ่ม `motion.identity`, `motion.motifs` (หก kind, job, beat, joy budget, `allowedCarriers` ต่อ kind และ `carrierPolicy` ของ MOTIF-06 แทน `fullHost`/`quietHost` ของ r1) และ `motion.productOverlays`; set ID motion-riddim-approach-02 → 03; component BrandMotion ของ candidate ที่ถูกถอนกลายเป็น MotifFrame + MotionController
- schema: migration-ledger 1.0 → 1.1 (disposition `amended_in_place`), target-profiles 1.2 → 1.3 (OG target, `socialStaticScope: square_1080_and_og_1200x630`), format-packs 1.5 → 1.6, format-kits 1.2 → 1.3, asset-registry 1.8 → 1.9 (`iconSets`, `motifRegisterRef`), rule-catalog 1.6 → 1.9 (64 rules; 1.8 ใน 0.9.3-r2), capability-config 1.2 → 1.5 (`scaleFamilies`, `seriesVariant`, `valueStates`, `cellStates`, `motion.motionMoments[]` พร้อม `hostSurface`, `motion.staticMotifPlacements[]`; ไม่เปลี่ยนใน 0.9.4), token 7 → 10 (8 เป็นของ candidate ที่ถูกถอน, 9 ของ 0.9.3; 10 เพิ่ม `bannedHue`, `warmLane`, `derivationExceptions`, `slot10Alternates`, `inkFallback`, `forbiddenHueWindows`), component-contracts 1.2 (ไม่เปลี่ยน), contrast-evidence 1.1 → 1.2 (hue audit, warm lane, production-CSS scope report), motif-register 1.1 (ใหม่ใน 0.9.3; `carrierPolicy`; ไม่เปลี่ยน), migration-ledger 1.1 → 1.2 (`ruleIdReassignment`); Build Card 0.9.3.2 (ไม่เปลี่ยนใน 0.9.4): dataVisualization config เพิ่ม `scaleFamilies[]`, `seriesVariant`, `valueStates`; discovery เพิ่ม `iconSetId`, `titlePattern`; motion เพิ่ม `motionMoments[]` (ทุก moment มี `hostSurface`) และ `staticMotifPlacements[]`

### 15.4 Explicitly rejected carry-ins

| Candidate | Reason |
|---|---|
| CTA discovery cue เล่นซ้ำทุกรอบขณะมองเห็น | motion เหนือ primary action ยังถูกห้ามใน MOTION-04/MOTIF-04; ซ้ำกับ perpetual CTA flicker ที่ 0.9.1 ปฏิเสธ; เจ้าของยืนยัน 15 กันยายน 2569 |
| dark anchors ที่เลือกด้วยมือ (proposal r1 และ dark block ของ ext-registry 0.9.1) | DATAVIZ-03: dark ต้องคำนวณจาก light เสมอ; r1 มี low เทากลางร่วมและบีบ 2.4× |
| `--series-N-fill` = vivid โดย default ตาม `ext-registry-0.9.2.proposal.css` | คำตัดสินของเจ้าของคือ `dial-soft` default; kit ใช้ `[data-series="vivid"]` เป็น opt-in |
| id DATAVIZ-03 สำหรับกฎ series (candidate ที่ถูกถอน) และ id DATAVIZ-04 สำหรับกฎ series (0.9.3) | แพตช์ 0.9.3 ใช้ DATAVIZ-03 กับ dark derivation; delta 0.9.4 ใช้ DATAVIZ-04 กับหน้าต่างสี; series ใช้ DATAVIZ-05 (ไฟล์ชนะ; เจ้าของยืนยัน 17 กันยายน 2569) |
| dark anchors ของ warm families ใน 0.9.3-r2 (activity, density.area, heat, risk, price low/mid) และ ink light ของ series slot 2/3 | อยู่ในหน้าต่าง earth ที่ v0.9.0 ถอนแล้ว (สีน้ำตาลโดยโครงสร้างของสูตรเดิม); DATAVIZ-04 ห้าม; แทนด้วยสูตร warm lane และ ink สำรอง |
| slot 10 rose, density.area high `#A92963` และ tradeoff neg `#B23F74` เป็นค่าที่ ship | ถูกกฎตาม pink ruling (ผ่านเกต) แต่เจ้าของเปรียบเทียบบนจอแล้วเลือกชุดเขียว/crimson; ชุดชมพูบันทึกเป็น `slot10Alternates.rose` และ `resolved[]` — เลือกภายหลังได้โดยไม่ต้องแก้กฎ |
| token ใหม่ที่ตั้งขึ้นเพื่อให้ค่าในหน้าต่างสีผ่านเกต หรือ rename ค่าเดิมเป็นชื่ออื่น | DATAVIZ-04: no new token may be minted to escape the gate |
| ขยายเกต B-HUE ไปคลุม LUT 41 ขั้นและสี class ในรอบนี้ | ขอบเขตของ delta คือค่าวิเคราะห์ (anchor + series); LUT ของ warm lane ที่ interpolate ผ่านหน้าต่าง earth 110/1,640 ขั้นและสี class 37 ค่า รายงานเป็นหลักฐานและส่งกลับบอร์ด (คำตัดสิน 17 กันยายน 2569) |
| motif runtime หรือ demo ของ Studio ที่เล่นต่อเมื่อพ้นจอ | OWNER-MOTION-01/MOTIF-03 ให้ MotifFrame คุม viewport; หน้า demo ของ Studio เป็น inspection aid ไม่ใช่ production behaviour (manifest `showcaseBoundary`) |
| content reveal ที่วนซ้ำขณะอยู่นิ่งในจอ | เนื้อหาหายไปมาเป็น perpetual flicker และซ่อน proof; OWNER-MOTION-01 ยังห้าม |
| sampled hex `#1F87CE` หรือ `#0195CB` เป็น token ของลิ่ม | ลิ่ม token-derived เท่านั้น; ค่าที่บันทึกเป็น observation ไม่ใช่ token |
| ปรับค่าสีกลางให้เข้าเกณฑ์ L/chroma เงียบ ๆ | light ต้องมาจาก proposal JSON เท่านั้น (r2 แก้ heat และ household บนบอร์ดแล้วเจ้าของยอมรับ); dark ต้องมาจากสูตร; ความต่างที่วัดได้ประกาศเป็น exception หรือ warning ใน evidence |
| motif หรือ animated variant เป็น favicon/OG image | MOTION-04 และ motif-library prohibitedJobs ห้าม |
| โครงสร้าง `deployment/machine/v0.9.0` เป็นแม่แบบ package 0.9.3 | release ที่ effective ก่อนหน้าคือ v0.9.1-mp7; v0.9.4-mp1 เป็น sibling ของ mp7 ไม่ใช่ลูกของโครงสร้าง v0.9.0 |
| `N/A` หรือ dash เปล่าเป็นสถานะข้อมูล | EVID-05 ห้าม; ต้องมี state และเหตุผล |
| ประโยค MOTIF-04 ของแพตช์ r2: full บน beige, Brand Blue หรือ atmosphere · quiet ใน content column | วัดแล้วขัดกับ bytes (full หายบน Brand Blue 1.00:1 และเสียรูปบน atmosphere ทุกชุด; quiet บนพื้นสว่างได้ไม่เกิน 1.74:1) และขัดกับ ladder ที่เจ้าของอนุมัติ 11 กันยายน 2569; แทนด้วย MOTIF-06 ตามคำตัดสิน 16 กันยายน 2569 |
| full ที่ render ด้วย `ink="beige"` บนพื้นเข้มหรือ Brand Blue (runtime ทำได้) | ไม่มี final-state record ที่ลงทะเบียนสำหรับ rendition นี้ (fallback จะกลับเป็นหมึกน้ำเงินที่หายบนพื้นนั้น); ต้องให้ Motif Studio ผลิตและลงทะเบียน record เฉพาะพื้นเข้มก่อน; โลโก้ทำไม่ได้เพราะหมุดต้องเป็น `#1D4497` |
| แผ่นรอง, scrim หรือการปรับสี/ความทึบของลายเพื่อให้อ่านได้ | ladder ห้าม: ความล้มเหลวของคอนทราสต์แก้ที่พื้น, variant, ขนาด หรือถอดลายเท่านั้น |

### 15.5 Delta 0.9.3-r2 → 0.9.4-r1 (17 กันยายน 2569): ค่าที่เปลี่ยน 26 รายการ

ตารางนี้เป็น VERBATIM จาก delta ของบอร์ด (คอลัมน์ token · theme · from · to · why); ชื่อ token เป็นชื่อในไฟล์ proposal (`--scale-*`, `--series-*`) ซึ่ง map ไปยัง `--ldm-scale-<family>-<theme>-anchor-N` และ `--ldm-series-NN-*` ใน production CSS baseline ของ from-value คือ proposal r2 ซึ่งเท่ากับ 0.9.3-r2 ทุกค่า ยกเว้น heat dark mid ที่ 0.9.3-r2 ship `#A56810` (ค่าสคริปต์) ขณะที่บอร์ดถือ `#A56811` — ทั้งสองถูกแทนที่ด้วย `#C28336` ค่าที่ ship ของ density.area dark mid คือ `#CC7B4A` (สคริปต์) ไม่ใช่ `#CC7B4B` ของตาราง (บันทึกค่าบอร์ดไว้ตามคำตัดสิน 15 และ 17 กันยายน 2569)

| token | theme | from | to | why |
| --- | --- | --- | --- | --- |
| `--scale-activity-low` | dark | `#492923` | `#3C302D` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-activity-mid` | dark | `#B3594B` | `#D17465` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-density-area-low` | dark | `#472B1B` | `#3B302B` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-density-area-mid` | dark | `#B56635` | `#CC7B4B` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-heat-low` | dark | `#442E15` | `#393129` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-heat-mid` | dark | `#A56811` | `#C28336` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-risk-low` | dark | `#3F3112` | `#373229` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-risk-mid` | dark | `#99741A` | `#B18C39` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-price-low` | dark | `#3C3212` | `#363329` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-price-mid` | dark | `#8F7514` | `#AA9038` | earth window (brown by construction: warm hue at L .32–.60 with chroma) |
| `--scale-density-area-mid` | light | `#E79363` | `#EE9A69` | clay band — light mid lifted to L .76 |
| `--scale-density-area-high` | light | `#A92963` | `#A1182D` | plum lane (ΔE 5.2 from purged #9E476F); owner chose crimson on sight |
| `--scale-density-area-high` | dark | `#FF9ABD` | `#FFB4B3` | re-derived from the new light high under D-HIGH-01 |
| `--scale-age-mid` | dark | `#787C53` | `#717D55` | ΔE 3.5 from purged #827C68 inside a 20° hue lane — hue 113° → 122° |
| `--scale-tradeoff-neg` | light | `#B23F74` | `#AB2E47` | plum lane; owner chose crimson on sight |
| `--scale-tradeoff-neg` | dark | `#F689B5` | `#FF9EA7` | derived from the new light pole |
| `--scale-flow-neg` | light | `#AA7E00` | `#D09B00` | earth window (dark ochre) — saturated gold clears the C ≤ .145 ceiling |
| `--scale-flow-neg` | dark | `#D7AA46` | `#DBA833` | derived from the new light pole |
| `--series-10-fill` | light | `#F571A4` | `#71B262` | slot 10 rose → green 140° (owner choice on sight; rose stays legal) |
| `--series-10-ink` | light | `#91355A` | `#34622A` | slot 10 ink follows |
| `--series-10-fill` | dark | `#FFA5C4` | `#9AD78C` | slot 10 dark fill |
| `--series-10-ink` | dark | `#FFC5D7` | `#B8E7AE` | slot 10 dark ink |
| `--series-soft-10-fill` | light | `#DA88A4` | `#82AC79` | soft variant of slot 10 |
| `--series-soft-10-fill` | dark | `#FAA9C4` | `#9AD78C` | soft variant of slot 10, dark |
| `--series-2-ink` | light | `#9B4900` | `#182327` | burnt orange / sienna — no legible dark form for a warm slot hue (A5.2 ink amendment) |
| `--series-3-ink` | light | `#896500` | `#182327` | ΔE 1.5 from #846100, a value the v0.9.0 purge retired by name |

โครงสร้าง (จาก delta): series registry id `landometer-series-10-v6 (candidate)` → `landometer-series-10-v7 (candidate) — slot 10 green` · slot 10 name `rose` → `green` · landuse binding tourism `rose` → `green` · slot 10 alternate `—` → `series.slot10Alternates.rose — legal under the pink ruling, not selected` ไม่เปลี่ยนจาก r2 (ห้ามใช้ซ้ำ): sequential families อีก 9 ตระกูล, diverging balance · delta · sentiment · anomaly, series slot 1–9 fills และ slot 1, 4–10 inks, EVID-05, MOTION-04 · FAVICON-01 · SOCIALFMT-01 · MOTIF-01…05 และ exception สามรายการ (water · built · duration) — MOTIF-06 ของ 0.9.3-r2 ซึ่ง delta ไม่รู้จักสืบต่อมาด้วย ไม่ใช่การ re-apply

---

## 16. Learning cases — Example, non-normative

**Status of this whole section: Example — non-normative.** Cases A–F and the three rejected cases illustrate how existing rules can be applied. They do not create requirements, defaults, acceptance criteria, evidence, product facts or exception paths. Project truth and obligations come only from the resolved normative Build Card, authority, claims, assets, artifact-resolved format-implementation record and rule catalog; copied case content establishes none of them.

Case metadata shared by every example: `sourceVersion: v0.9.4-mp1`; `mediaStatus: conceptual_no_product_evidence`. Each case lists the active rule blocks it illustrates as `ruleAuthority`; those blocks—not the case—remain authoritative.

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

## 17. Package inventory และ machine contract

| File | Role |
|---|---|
| Landometer Design System v0.9.4.md | human normative master (0.9.4-r2, frozen from the approved candidate 0.9.4-r1 with provenance-only edits; the candidate master is carried by hash in `release.json#/release/frozenFrom`); byte-exact predecessor 0.9.1-r8, the withdrawn 0.9.2-r1 candidate and the superseded 0.9.3-r1 and 0.9.3-r2 candidates are carried by hash in release.json |
| release.json | release tuple, status, set IDs, authority boundary |
| build-card.schema.json | v0.9.3.2 author/resolver input contract (adds `dataVisualization.scaleFamilies[]`, `seriesVariant`, `valueStates`; `discovery.iconSetId`, `discovery.titlePattern`; `motion.motionMoments[]` with `hostSurface`, and `staticMotifPlacements[]`); selected/omitted side-bookmark state binds exactly to the governed bookmark component inventory and navigation direct-target value/unit binds exactly to selected browser or native target profile |
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
| asset-registry.schema.json / asset-registry.json | v1.9 role-scoped asset authorization contract with `iconSets` (FAVICON-01; portfolio set owner-approved 15 September 2026) and `motifRegisterRef`; eligibility is decided per exact role and artifact |
| motif-register.schema.json / motif-register.v0.9.4.json | v1.1 register of the shared motif family (six kinds × full/quiet SVG + runtime bytes, jobs, beats, allowed carriers) and the product overlays (ijji logo sting, ijji four-beat state-bound set, CityChat conversation set; CityMETER/CityWiki pre-approved without bytes) with SHA-256, approval status and source commit, plus `carrierPolicy` (MOTIF-06: carriers from the tokens, the twelve SVGs × twenty carriers measured, allowed pairs, ladder L1–L5, agent fields, and the hashes of the approved ladder, its evidence and its approval) |
| asset-approval-receipt.schema.json / asset-approval-receipt.json | typed asset approval receipts bound by `approvalReceiptRef` + `approvalReceiptSha256` |
| Landometer-Logo-TransparentBG.png | packaged immutable identity source evidence; not a substitute for role/surface approval |
| nine text-font WOFF2 files + two Material Symbols Rounded WOFF2 subsets | font/icon roles carried unchanged from v0.9.1-mp7 with exact byte hashes |
| six OFL/Apache license text files | packaged license receipts for the shipped font/icon bytes |
| migration-ledger.schema.json / migration-ledger.json | v1.1 exhaustive predecessor-rule disposition contract and ledger (50 v0.9.1 rules) plus the sentence-level ledger |
| rule-catalog.json | v1.9 machine-readable rules (64) and acceptance mappings with exact side-bookmark component-inventory binding, explicit browser/native navigation semantics, and browser/native/presenter MOTION-03 branches |
| format-packs.json | v1.6 format resolution (web pack requires icon set and OG preview; social pack binds two targets), runtime-specific navigation target units, exact static global/page-index projection, exact-format selected-static-bookmark component templates, browser/native/presenter motion tests, equivalence map, and exact one-per-capability overlay closure for all 16 Build Card capabilities |
| format-kits.schema.json / format-kits.json | semantic format-production contract with `requiredImplementationControls`; these controls state what downstream implementation must govern and do not assert that reusable native template bytes ship in this package |
| target-profiles.schema.json / target-profiles.json | v1.3 cross-format canvas, unit, safe area, type and fixture projections including `target.social.og.1200x630.01` |
| format-implementation.schema.json / seven `format-implementation*.example.json` files | schema v1.6 for `reference_example` and `artifact_resolved` records; seven shipped references cover web browser, app browser/native, document, PDF, deck and social static; promoted work derives a new Build-Card-bound record with exact context, platform, component, asset, rule, test, accessibility and portability contracts |
| source-lineage-receipt.schema.json | exact editable/component/template/export source → process → final-output lineage contract |
| verification-attestation.schema.json / verification-trust-store.schema.json | v1.1 detached Ed25519 attestation and purpose-scoped external trust-store contracts, including package root, promotion and agent revocation/execution purposes |
| verification-trust-policy.schema.json | v1.0 caller-controlled policy that pins exact trust-store ID, issuer, key ID and public-key SPKI SHA-256 |
| promotion-snapshot.schema.json | non-circular signed promotion record binding Build Card, canonical manifest projection, resolved implementation, optional social sidecar, sources/lineage, outputs and receipts |
| release-approval.attestation.json · asset-approval-receipt.attestation.json · package-root.attestation.json · six example attestations (claim approval, claim evidence capture, disclosure authority, agent authority, agent revocation, conformance receipt) | detached Ed25519 attestations (schema 1.1) signed by the release operator at the freeze; each names its subject file, the subject's SHA-256 and the signing time; `validate-v0.9.4.mjs` verifies every one against the external trust store and caller-pinned policy (`owner-trust/v0.9.4`) and fails closed |
| verify-attestation.mjs / sign-verification-attestation.mjs / freeze-release.mjs | deterministic verification/signing tools and the freezer that produced this package from the approved candidate (verifies the candidate by hash, rewrites the release literal, rebinds every embedded hash, signs the attestations, writes SHA256SUMS.txt and the package-root attestation); package and downstream verification require independently supplied trust store + pinned policy pairs |
| tokens.v0.9.4.json | governed v0.9.4 summary projection (token schema 10): analytical scales with derived dark anchors (warm-lane formula, the declared age exception), the DATAVIZ-04 hue windows and warm-lane policy, categorical series v7 (slot 10 green, rose alternate, ink fallback), value states, GATE-01 gate set (21 gates), identity motion, motif register summary with the MOTIF-06 carrier policy, product overlay policy, approved icon set, social preview recognisers and refs/hashes to color-srgb-07 (predecessor registry color-srgb-06 by hash) |
| color-srgb-07.tokens.json / color-srgb-07.scales.json | raw color-srgb-07 registry (light from proposal r2 plus the 0.9.4 delta, dark derived by the amended DATAVIZ-03 with the declared age exception, provenance, owner answers, gate exceptions, anchor deltas from color-srgb-05 and color-srgb-06, banned-hue and warm-lane policy, superseded-candidate note) and 40 LUT records with `scaleVersion`; provenance only, forbidden in audience `delivery.files`; color-srgb-06 raw files stay with the superseded 0.9.3-r2 candidate by hash and color-srgb-05 raw files in v0.9.1-mp7 by hash |
| color-srgb-07.production.css | audience-safe, color-only production CSS projection (309 declarations; 26 differ from color-srgb-06.production.css, no name added or removed); no lifecycle, rule, package, source-path, legacy type/layout/motion metadata |
| contrast-evidence.json | v1.2 GATE-01 results for both themes (gate rows incl. D-STEP-03, declared exceptions, warnings, D-DERIVE-01 with the warm-lane formula) plus the DATAVIZ-04 hue audit (anchors and series gated; LUT steps, class colours and the production CSS reported with their scope), measured WCAG contrast and OKLab distances for series, scales, value-state labels and diverging ends; failures are listed, never fixed silently |
| validate-dataviz-gates-0.9.4.mjs | GATE-01 successor tool (registry or proposal input; lane-aware D-LOW-02/D-MID-01/D-STEP-01/D-STEP-02, D-STEP-03, D-DERIVE-01 with declared exceptions, B-HUE-01/02 and SC-17 of DATAVIZ-04 with the LUT/class audit, V-POLE-01 ±.005 L; declared deltas from the r2 tool listed in CHANGELOG-0.9.4.md); exit 1 on an undeclared failure |
| measure-motif-carriers-0.9.4.mjs | MOTIF-06 measurement tool and library: composites every visible paint of the twelve governed SVGs over each carrier as an 8-bit pixel (gradients at every stop), derives the allowed pairs, reproduces the approved ladder table, and with `--register` re-measures and compares with the stored policy (exit 1 on a difference) |
| component-contracts.v0.9.4.json | v1.2 governed contracts for EvidenceCard, MotifFrame (with the MOTIF-06 host-surface, theme-swap and ground contract), MotionController, DataTable `cellStates` and MapLegend states in the format-implementation `componentContract` shape |
| build-kit/ (sibling folder) | skeleton.html with FAVICON-01 and OG head blocks, ext CSS custom properties (light + derived dark), MotifFrame (carrier, theme-swap and ground checks) + MotionController with exact runtime bytes and the twelve final-state SVGs, manifest copy for job validation, EvidenceCard/DataTable/MapLegend reference markup, OG template, llms.txt template, approved icon set, preflight-0.9.4.yml and runnable preflight |
| roles/ (sibling folder) | one short bilingual guide per role: AI/agent, human quick start, developer, designer (with DTCG token export), product, marketing, sales |
| render-color-production.mjs | deterministic renderer for the atomic production color CSS projection from color-srgb-07.tokens.json |
| validate-v0.9.4.mjs | package validator (port of `validate-v0.9.1.mjs`): closure and checksum receipt, the nine signed attestations against the external trust pair, schema pairs and canonical schema ids, release tuple, rule catalog (64) and format packs, tokens projection and color-srgb-07 parity, GATE-01 evidence recompute, DATAVIZ-04 hue gates, MOTIF-06 carrier re-measurement, migration ledger (50 predecessor rules, sentence-ledger stages 1–5), and adversarial self-tests on generated fixtures; the artifact-level 0.9.4 rules (FAVICON-01, the OG target, MOTION-04, MOTIF-01…06) are checked on artifact bytes by `build-kit/preflight-0.9.4.mjs`, which the validator does not replace; the candidate validator `validate-candidate-0.9.4.mjs` is carried by hash in `release.json#/release/frozenFrom` and is not part of this package |
| README.md | use, validation, resolved-only delivery and authority boundaries |
| SHA256SUMS.txt | checksum receipt of every declared file except itself and `package-root.attestation.json`; generated last by the freezer and signed by the package-root attestation |

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
| delivery | exact audience-delivered `files`; exact one-per-file `contentInspections` with subject hash/media type, format-bound method, dated result and hash-bound evidence—DOCX/PPTX/PDF additionally bind page/slide kind and count, `every_page_or_slide` coverage, combined extraction+OCR+visual method, explicit image-only/outlined-text review, deterministic combined-text hash และ hash-bound raster per unit; `implementationBindings` for selected format-kit record, target-profile record and artifact-resolved format-implementation record; `implementationSourceBindings` for every editable source, template, export preset, style map, component source, or other governed production file actually used, with `audienceDelivered: true` exactly when the same ref/hash/media type is also in `files`; ID-bound `assetBindings`; audience `metadataProjection`; and audience `accessibilityProjection` whose reading order, semantic/interaction/text-layout states, capability-derived alternatives/motion, contrast minima, fixture IDs และ fixture-report summary exactly match `format-packs.json.accessibilityProjectionContract`—static social therefore cannot claim headings, landmarks or controls verified; web additionally binds the exact delivered primary initial document through `primaryHtmlBinding` and `webDiscoveryEvidence` for no-script, hydrated DOM, accessibility tree, internal locale links and sitemap; parsed/evidenced surfaces must equal Build Card discovery/claim/action contracts exactly; social additionally binds time-valid campaign/rights/destination evidence and normalized exact-copy OCR+visual parity; non-web uses `format_metadata` with exact format/primary locale; `files` rejects both canonical paths and exact hashes of every raw color registry file (the two color-srgb-07 files, the two color-srgb-06 files of the superseded 0.9.3 candidate and the four color-srgb-05 files retained in v0.9.1-mp7); every asset binding matches the Build Card asset and artifact-owned registry entry, while an approved asset's receipt grant matches exact `assetId`, `role`, `sha256`, `allowedFormatProfiles`, `allowedSurfaceRoles`, `allowedAudiences`, `publicationPermission`, `licenseOrPermission`, `fallback`, and role-specific `glyphs` or `altOrTextEquivalent` |
| validation | package/artifact/production phase states, computed conformance level, three universal layer results, `resolvedTestResults` that exactly cover the phase's `resolvedTestIds` with unique bundle-local evidence bound to test ID, artifact build, governed method, pass result, observation time, and exact criterion text + SHA-256 derived from common, experience, format, capability, target, kit, accessibility and selected-platform portability registries in deterministic order (generic self-authored summaries do not pass), and dated acceptance/gate receipts keyed by catalog acceptance ID with criterion assertion + hash; at `artifact_qa_passed` discovery/readability/action, every resolved non-production test and acceptance are `pass`, required accessibility and portability fixture receipts exactly match the artifact-resolved implementation record, and OUTPUT-CLARITY-01-A covers the exact `delivery.files` set/hashes and cites every content-inspection evidence file; at `production_verified` every resolved production test and acceptance also passes, the returned web bytes equal `primaryHtmlBinding.sha256`, and OUTPUT-CLARITY-01-B covers that same exact file/inspection set |

Phase states use `pending`, `passed`, `failed` หรือ `not_applicable`; resolved acceptance/layer/gate results use `pass`, `fail` หรือ `not_tested` เท่านั้น การไม่ใช้กฎอยู่ใน `resolution.nonApplicableRuleIds` ไม่ใช่ layer/gate result ก่อน `artifact_qa_passed` ทั้ง discovery/readability/action MUST เป็น required + `pass` และ resolved non-production acceptance ทุกอัน MUST `pass`; information/read-only artifact พิสูจน์ action layer ด้วยขอบเขตที่ซื่อตรง ไม่ใช้ `not_applicable` `fail` หรือ `not_tested` blocks artifact-QA promotion

`releaseTupleSha256` MUST คำนวณจาก tuple fields และ canonicalization algorithm ที่ active validator บังคับ แล้ว bind ค่าที่ได้ใน manifest ห้ามคัดลอก digest จาก prose หรือจาก artifact อื่น

### 17.2 Current catalog coverage

The machine catalog includes and validates:

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
- Björn Ottosson, OKLab colour space (basis of the LUT interpolation and ΔE measurements): https://bottosson.github.io/posts/oklab/
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
14. (v0.9.4) every chart or map resolves its scale families per zone and its series variant, every 0 or empty value carries one of the five states, and no machine payload emits 0/null without a state
15. (v0.9.4) every web build binds one approved icon set, a pattern-conformant title and an OG 1200 × 630 preview; identity motion, when used, ships the exact runtime bytes, replays only while visible, stops off-screen, and holds the final state under reduced motion, no-JavaScript and print
16. (v0.9.4) every motif carries a registered job, a beat and a hash-exact final state; a route carries at most three motion moments and none on the first answer, the primary proof or the primary action; every motif placement declares its host surface and passes the measured carrier table in every theme it renders (MOTIF-06); every dark scale anchor equals its DATAVIZ-03 derivation (or a declared exception), no analytical anchor or series value sits in a retired hue window (DATAVIZ-04), and the release's GATE-01 evidence is newer than the tokens and CSS it covers

---

## 20. Roles: ใครใช้ release นี้อย่างไร (บังคับใช้ให้ง่ายและถูกต้องพร้อมกัน)

หลักคือ กติกาเดียว หลายทางเข้า: ทุกบทบาทอ่านเฉพาะสิ่งที่ต้องใช้ ได้ของที่คัดลอกไปใช้ได้ทันที และมีตัวตรวจที่บอกว่าต้องแก้อะไรก่อนส่ง ไม่มีบทบาทใดต้องอ่าน master ทั้งฉบับก่อนเริ่มงาน คู่มือเต็มอยู่ใน `roles/` (ไทย/อังกฤษ สั้น หนึ่งหน้า)

| บทบาท | เริ่มที่ | ได้อะไรไปใช้ | ตัวตรวจ | ห้าม |
|---|---|---|---|---|
| AI / agent | `roles/for-ai-agents.md` แล้วสกิล `landometer-design-assets` | release tuple, `tokens.v0.9.4.json`, `rule-catalog.json`, `component-contracts.v0.9.4.json`, `motif-register.v0.9.4.json`, contract ของ EvidenceCard/MotifFrame | `validate-v0.9.4.mjs`, `validate-dataviz-gates-0.9.4.mjs`, preflight, ป้ายหลักฐาน §3.7 ของ MBB | เดาค่าจาก prose, เขียน dark hex เอง, ส่ง 0/null ไม่มี state, วาง motif โดยไม่มี job หรือบนพื้นที่ไม่อยู่ในตาราง carrier, ใช้สีในหน้าต่าง earth/violet หรือตั้ง token ใหม่เพื่อเลี่ยงเกต, อ้างเสร็จโดยไม่ตรวจ bytes จริง |
| Developer | `roles/for-developers.md` | `build-kit/` (skeleton, ext CSS light + derived dark, MotifFrame ที่ตรวจพื้น + MotionController + 12 SVG + manifest, EvidenceCard, OG template, llms.txt, icon set, preflight) | `node build-kit/preflight-0.9.4.mjs <html>` | แก้ runtime bytes, dark hex เขียนเอง, `animation-iteration-count: infinite`, motif เกิน 3 ต่อ route หรือไม่มี job, full บน Brand Blue หรือพื้นมืด, quiet บนพื้นสว่าง, แก้สีลาย, hex นอก registry, สีน้ำตาล/ดินเผา/ม่วงใน `--scale-*`/`--series-*` override, ชื่อ v5 ในงานใหม่ |
| Designer | `roles/for-designers.md` + `roles/lds-0.9.4.tokens.dtcg.json` | token สี/สเกล/series แบบ DTCG นำเข้า Figma ได้ (dark เป็นค่าที่ derive แล้ว), ตารางโซนสี, ตัวอย่าง legend/state, ตาราง motif × job × beat และตารางพื้นที่วาง motif ได้ (MOTIF-06) | contrast-evidence.json, showcase | สีกลางเป็น energy token, dark เขียนเอง, vivid ร่วม energy accent, สอง family โซนเดียวบน surface เดียว, วาดโลโก้หรือ motif ใหม่, full บน Brand Blue หรือ atmosphere, แผ่นรองใต้ลาย, สีน้ำตาลหรือม่วงในสเกลและ series (DATAVIZ-04) |
| Product | `roles/for-product.md` | denominator rule, ทางเลือก soft/vivid, ห้าสถานะเป็น requirement, ฟิลด์ Build Card ใหม่รวม `motionMoments[]` และ overlay ของผลิตภัณฑ์ | checklist ใน Build Card review | ให้ tester count เป็น traction, N/A, LOI เป็นสัญญา (MBB §5.1), motion เกิน joy budget |
| Marketing | `roles/for-marketing.md` | link preview ที่ถูกกติกา, EvidenceCard ในโพสต์, motif ที่ใช้ได้ต่อจังหวะ (Opening/Closing) พร้อมพื้นที่วางได้ กับ product sting ที่ลงทะเบียน, ป้ายหลักฐานและป้ายสถานะผลิตภัณฑ์ | preflight ของหน้า landing, checklist ก่อนโพสต์ | motif เป็นหลักฐานหรือ favicon/OG, motif บนพื้นที่ไม่อยู่ในตาราง, ตัวเลขไม่มีหน่วยหรือไม่มีที่มา, ผสม overlay กับ shared motif, traction จากผู้ทดลองใช้ |
| Sales | `roles/for-sales.md` | EvidenceCard ที่พูดแทนได้, ประโยคตาม claim recipe, สิ่งที่ link preview ต้องมี | ป้ายสถานะผลิตภัณฑ์ MBB §5.1 | ราคา/สัญญา/pipeline ในงานภายนอก, ตัวเลขไม่มีหน่วย, "click now" |
| ผู้อ่านทั่วไป | `roles/quick-start.md` | สรุปการเปลี่ยนแปลงของ 0.9.4 ใน 5 นาที และคำศัพท์ | — | — |

การบังคับใช้ที่ "มีความสุข" วัดจากสามอย่าง: (1) คนหรือ agent เริ่มงานได้ในหนึ่งหน้าโดยไม่ต้องถามว่าไฟล์ไหนจริง (resolver + hash) (2) สิ่งที่ต้องทำมีของให้คัดลอก ไม่ต้องตีความ (kit + contracts) (3) ตัวตรวจบอกจุดแก้ก่อนส่ง ไม่ใช่หลังส่ง (preflight + evidence) ทั้งสามข้อเป็น release obligation ของ 0.9.4 ไม่ใช่เอกสารประกอบ

## 21. คำตัดสินของเจ้าของ ณ การอนุมัติ 17 กันยายน 2569 และงานที่เหลือ (บันทึก ณ freeze v0.9.4-mp1; ไม่มีข้อใดรอเจ้าของ)

ปิดแล้วเมื่อ 15 กันยายน 2569 (บันทึกใน `release.json#/release/ownerDecisions`): สีกลางนอกเกณฑ์ (ปิดด้วยเกต GATE-01 r2 และค่า light ที่แก้บนบอร์ด) · การตีความ CTA cue และ content reveal · ช่อง sky ของ soft · ป้ายบน hatch · ชุดไอคอน portfolio · dark anchors (ปิดด้วย DATAVIZ-03) · ขอบเขต OWNER-MOTION-01 · identity deltas · series default · ปิดแล้วเมื่อ 16 กันยายน 2569: พื้นที่วาง motif (MOTIF-06 นำ ladder 11 กันยายน 2569 เข้า DS; showcase ของ r1 วาง full บน Brand Blue จนลายหาย)

ปิดแล้วเมื่อ 17 กันยายน 2569 (`owner-message:2026-09-17:0.9.4-approval`; บันทึกใน `release.json#/release/ownerDecisions` และ `#/release/ownerApproval` ของแพ็กเกจนี้):

1. สีน้ำตาลที่ยังเห็นใน 0.9.3-r2 — ปิดด้วย delta ของบอร์ด: DATAVIZ-04 (หน้าต่างสีที่ถอนแล้วเป็นเกต), DATAVIZ-03 amendment (warm lane), D-STEP-03, A5.2 amendment (ink สำรอง), V-POLE-01 ±.005 และค่า 26 รายการ; เจ้าของเปลี่ยนเลข candidate เป็น v0.9.4
2. ไฟล์ห้าไฟล์ที่ delta อ้างแต่ไม่ได้ส่งมา — สร้างจากตารางของ delta (RECONSTRUCTED); เมื่อไฟล์จริงมาถึงให้เทียบ hash และรายงานความต่าง ไม่ถือว่าตรงกันจนกว่าจะเทียบ
3. รหัสกฎ — ตาม delta: DATAVIZ-04 = หน้าต่างสี; series เป็น DATAVIZ-05 (บันทึกใน `migration-ledger.json#/ruleIdReassignment`; ผู้บริโภคเครื่อง key ด้วย releaseRef + ruleId)
4. การอนุมัติ — อนุมัติและประกาศใช้เมื่อเกตทั้งหมดผ่าน: `ownerApproval` บันทึกใน release.json และแพ็กเกจนี้ freeze เป็น v0.9.4-mp1 (`effective: true`) พร้อมลายเซ็น Ed25519 ทั้งเก้าใบของ release operator (key ที่ pin ใน owner-trust/v0.9.4; private key ไม่อยู่ในเครื่องมือหรือแพ็กเกจใด และเครื่องมือ freeze ตรวจว่า key ตรงกับ trust store และ policy ที่ส่งมาแยกกัน)
5. LUT ของ warm lane — ประกาศใช้ 0.9.4 โดยเกต B-HUE คงขอบเขต anchor + series ตาม delta; การที่ LUT 41 ขั้นของ warm lane ที่ interpolate ระหว่าง low/mid/high ผ่านหน้าต่าง earth (110/1,640 ขั้น) และสี class 37 ค่า ส่งกลับบอร์ดพร้อมหลักฐานใน `contrast-evidence.json#/bannedHue`
6. tolerance D-MID-01 chroma ±.001 — ยืนยัน (ข้อ 5 เดิม) · exception `duration · D-MID-01` — คงไว้ตาม delta แม้ไม่ถูกใช้ (ข้อ 6 เดิม) · id `MOTIF-01` — คงไว้พร้อม lineage ใน `migration-ledger.json#/ruleIdReuse` (ข้อ 7 เดิม) · ถ้อยคำขั้น L3 ของ ladder — ตารางตัวเลขเป็นตัวตัดสิน (ข้อ 8 เดิม) · `layers` แบบ full บน `surface.canvas` — รับตามตารางที่ 1.30:1 (ข้อ 9 เดิม)
7. density.area dark mid — ship ค่าที่สคริปต์ผลิต `#CC7B4A` และบันทึก `#CC7B4B` ของบอร์ด (ต่าง 1/255 หนึ่ง channel; แนวเดียวกับ heat ของ 15 กันยายน 2569) · age dark mid — ship `#717D55` ของบอร์ดเป็น exception ที่ประกาศ (`age · D-DERIVE-01`) เพราะค่าที่ derive `#787C53` ตก B-HUE-02 และไม่มีสูตรที่ให้ hex ของบอร์ด
8. เครื่องของเจ้าของ — ใช้เพียงเขียน package เต็มชุดลงโฟลเดอร์ Drive ที่ sync; ไม่เซ็น attestation และไม่ push git จากที่นั่น

ยังเปิด (ไม่ขวางการมีผลบังคับใช้ของ 0.9.4; เป็นงานตามหลัง freeze ของ repo ภายนอก บอร์ด หรือ release operator — สำเนาเครื่องอยู่ที่ `release.json#/postApprovalFollowUps`):

1. product icon tiles: FAVICON-01 ต้องการ identity gradient ที่อนุมัติต่อผลิตภัณฑ์ (CityMETER, CityChat, ijji, CityWiki) ก่อนผลิต tile; จนกว่าจะมี เว็บของผลิตภัณฑ์ใช้ชุด portfolio ได้เฉพาะ internal preview หรือขอคำตัดสินเจ้าของต่อผลิตภัณฑ์
2. ทะเบียน CityChat ใน repo motif (`assets/citychat/asset-register.json`, 1.0.1-proposal) ยังติดป้าย candidate ทั้งที่เจ้าของอนุมัติแล้ว: ต้องอัปเดตป้ายและ `governance/SHA256SUMS.txt` ใน repo นั้น (ซึ่งล้าสมัยสำหรับไฟล์เว็บ 6 ไฟล์ด้วย) เพื่อให้สองแหล่งตรงกัน; DS บันทึกการอนุมัติที่ bytes ของ commit a99f3c1e · ใน repo เดียวกัน `motif-quiet-fallback.json` และ `governance/attachment/quiet-contrast-evidence.json` ยังไม่อยู่ใน `governance/SHA256SUMS.txt`, ladder อ้างหลักฐานที่ `governance/quiet-contrast-evidence.json` ซึ่งไม่มีอยู่จริง (ไฟล์อยู่ใน `governance/attachment/`), มี `owner-approval.json` สองไฟล์ที่เนื้อหาต่างกัน (คำอนุมัติ ladder อยู่เฉพาะใน `governance/attachment/`) และหน้า Contrast Lab ยังเรียก ladder ว่าแนวทางจากชุดส่งต่อที่ไม่ใช่กติกา DS — ปรับให้ตรงกับ 0.9.4 ที่ effective
3. CityMETER และ CityWiki stings: pre-approved แต่ไม่มี bytes จนกว่า Studio 1.4 จะผลิต; เมื่อผลิตแล้วให้เพิ่มเข้า `motif-register.v0.9.4.json` (release ถัดไป) ด้วย hash และ approval ref โดยไม่ต้องถามใหม่ ยกเว้น family อื่นที่ยังไม่ได้อนุมัติ
4. การดูด้วยตาบนจอจริง (OLED, ความสว่างต่ำ, ทั้งสองธีม) ของ LUT dark 41 ขั้น, warm lane ใหม่, slot 10 สีเขียว และ motif บนพื้นจริง — ตัวเลขผ่านทุกเกต แต่การตรวจด้วยตายังไม่ได้ทำ (DATAVIZ-02-B, DATAVIZ-03-C, DATAVIZ-04-B, DATAVIZ-05-B, MOTIF-06-B)
5. เรื่องที่ส่งกลับบอร์ด: (ก) LUT ของ warm lane ผ่านหน้าต่าง earth ระหว่างขั้น (110/1,640) และสี class 37 ค่า — จะขยายเกตหรือกำหนด interpolation ใหม่ (ข) จำนวนค่าที่ audit: delta รายงาน 200 ขณะที่ registry มี 180 ค่าวิเคราะห์ (120 anchors + 60 series fill/ink) — ขอ enumeration ของบอร์ด (ค) ไฟล์จริงห้าไฟล์ของ delta เพื่อเทียบกับฉบับ RECONSTRUCTED (ง) ค่านอกขอบเขตของกฎที่ตกหน้าต่าง earth ใน production CSS: `--ldm-semantic-warning-dark-background #3B2E16`, `--ldm-semantic-warning-light-foreground #A64A00` (semantic state ของ color-srgb-05 ที่ retained) และ alias v5 `--ldm-series-03-light #A87B00` — ต้องการคำตัดสินว่าจะขยาย DATAVIZ-04 ไปยัง semantic state ในรุ่นถัดไปหรือไม่; รุ่นนี้ไม่แก้เพราะอยู่นอกขอบเขตของ delta และ semantic state ไม่ใช่ค่าวิเคราะห์ (จ) fill ของ slot 10 สีเขียวในธีมมืดห่างจาก mint ΔE 4.8 — อยู่ในกติกา shape cue ของ slot 7–10 แต่ควรให้บอร์ดเห็น
6. งานของ release operator หลัง freeze: owner bilingual re-read ของ master ที่ประกอบแล้ว (PARITY-01-B; การอนุมัติ 17 กันยายน 2569 บันทึกไว้เป็น review ของ delta text และค่า), CityMETER Lab (หัวข้อ 07) เทียบกับข้อเสนอ, การเทียบ hash ของ runtime บนเว็บ montri-th.github.io/motif กับ manifest ผ่านช่องทางที่ดึง byte ตรงได้, การ publish แพ็กเกจนี้ไปยัง repo และ GitHub Pages แล้วตรวจ live URL ก่อนบอกว่า publish แล้ว, และการอัปเดต resolver skill `landometer-design-assets` ให้ชี้ v0.9.4-mp1 (ลายเซ็นทั้งเก้าใบและ port ของ validator เสร็จในแพ็กเกจนี้)

This Design System succeeds when different teams and AI systems can make different compositions for different formats while preserving the same truth, identity, evidence boundary, action promise and quality bar.
