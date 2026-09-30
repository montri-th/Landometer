# Landometer Design System v0.9.5

**Normative · Standalone · Human + Machine**

เอกสารฉบับนี้รวมข้อกำหนดปัจจุบันของ Landometer Design System 0.9.5 ไว้ในไฟล์เดียว ทั้งเนื้อหาสำหรับคน กฎสำหรับเครื่อง token และตารางสีจริง ใช้อัปโหลดเป็น Project Source ได้โดยไม่ต้องอ่าน master รุ่นก่อนหรือประกอบ patch เพิ่ม โครงสร้าง Brand, Visual foundations, Navigation, Actions, Motion, Evidence, Output formats และ QA สืบต่อจาก master เดิม โดยปรับข้อกำหนดที่เปลี่ยนไว้ในหัวข้อของมันแล้ว

| Identity | Exact value |
|---|---|
| DS version | `0.9.5` |
| Document ID | `lds-0.9.5-landometer-standalone-r3` |
| Release | `v0.9.5-owner.1` |
| Standalone document | `standalone-0.9.5-r3` |
| Color set | `color-srgb-08` |
| Categorical registry | `landometer-series-10-v8` |
| Approval | Owner-approved 29 September 2026 |
| Signature | Unsigned owner distribution; no cryptographic 0.9.5 release attestation |

เริ่มงาน: เลือกขอบเขต portfolio/product → บันทึก Build Card ตาม §2 → ใช้กฎของ format และ capability ที่มีจริง → อ่านค่าจาก machine payload ในไฟล์นี้ → ตรวจงานที่ส่งจริงตาม §14 และ §19. Brand voice, protected wording, official identity, typography, foundations และ atmosphere ทั้งเจ็ดสูตรยังอยู่ครบ งานที่ล็อกรุ่นเก่าไว้อย่างชัดเจนคงใช้รุ่นนั้นจนได้รับอนุญาตให้ย้าย

คำว่า `machine.*` ในเอกสารนี้อ้างถึง JSON payload ตอนท้าย **ของไฟล์เดียวกัน** ไม่ใช่ไฟล์ที่ต้องอัปโหลดเพิ่ม Schema references resolve ด้วย `$id` ที่อยู่ใน `machine.schemas`; immutable schema ID อาจสะท้อนรุ่นที่สร้าง schema นั้น โดยไม่ได้เปลี่ยน DS release ของงาน โลโก้ ฟอนต์ ไอคอน และ runtime เป็น binary/code assets: ใช้ URL, role และ SHA-256 จาก `machine.assetFiles` เพื่อรับ bytes จริงเมื่อผลิตงาน ห้ามสร้างภาพหรือฟอนต์แทนจากคำอธิบาย

ชื่อ `*.schema.json` ในหัวข้อต่อไปนี้หมายถึง schema ที่รวมอยู่ใน `machine.schemas` โดยตรง ชื่อ `*.example.json` หรือ reference-example ที่กล่าวถึงเป็น optional learning references: ไม่เป็นข้อกำหนดให้โหลดไฟล์เก่า ไม่เป็น evidence/approval และไม่จำเป็นต่อการสร้าง record จาก embedded schema งานจริงต้องใช้ค่ากับหลักฐานของงานนั้นเอง

เมื่อเครื่องมืออ่าน Source คืนข้อความเพียงบางส่วน ให้ค้นต่อด้วย stable rule ID ของข้อกำหนด หรือ `scaleId` + `theme` และ field path ที่ต้องใช้ เช่น `machine.analyticalScales.scales` → `density.capita` / `dark` → `classes["7"]`. ตรวจค่าจากผลค้นที่อ่านได้จริงและอ้างตำแหน่งนั้น; ห้ามอ้างว่าอ่านครบทั้งไฟล์จากผลที่ถูกตัด หรือเดาค่าในส่วนที่เครื่องมือยังไม่คืนมา

---

## 0. Release Card และข้อกำหนดของ v0.9.5

### 0.1 Release tuple เดียว

`machine.release` เป็น source ของ release identity; `machine.document` ระบุ identity และ provenance ของเอกสาร standalone นี้ กฎและค่าในหัวข้อปัจจุบัน resolve ไปยัง payload ที่รวมไว้แล้ว ผู้ใช้ไม่ต้องจัดลำดับ master กับ addendum เอง

| Registry | Identifier | Current contract |
|---|---|---|
| Color | `color-srgb-08` | exact approved per-theme LUTs, warm density families, current dark categorical values |
| Motion | `motion-riddim-approach-03` | approach timing + identity lifecycle + six motifs and measured carriers |
| Icon | `icon-rounded-outline-01` | interface icons; identity icon sets remain separate |
| Typography | `type-script-aware-02` | approved script-aware fonts and role scales |
| Layout | `layout-cross-format-01` | responsive/format composition and owner-selected visual constraints |

**RELEASE-01 — Release identifiers have one source.** Release, schema, set, kit และ package identifiers MUST resolve จาก `machine.release` และ embedded contracts; published identities are immutable. Canonical schema `$id` MUST include the schema version and MUST NOT be reused for an incompatible contract. Generated artifacts MUST NOT contain conflicting current release identifiers. This document uses DS `0.9.5`, release `v0.9.5-owner.1`, color set `color-srgb-08` and document `standalone-0.9.5-r3`; document consolidation does not relabel historical signed subjects.

Acceptance:

- RELEASE-01-A — automated: human master, embedded catalog/contracts, current tokens and artifact binding resolve the same release; unchanged schema `$id` identities remain exact and locally resolvable in the embedded schema collection
- RELEASE-01-B — manual: provenance/change record identifies each consolidated rule, schema or value projection and its migration effect without claiming an unperformed approval or signature

**GOV-01 — Release state is truthful and audience-bounded.** Artifact manifests, receipts and sidecars MUST bind exact `releaseRef` and a canonical tuple hash derived from the active contract. `machine.release` records owner-approved status, approver, date and unsigned signature status. Approval does not certify every artifact or activate every account. Internal approval workflow, rule/schema identifiers and package state MUST NOT appear on an ordinary audience-facing product surface. A DS-reference or provenance document MAY show only the identifiers/facts necessary for that purpose under its recorded disclosure authority; unresolved dependencies, debug details, placeholders and local/source paths remain prohibited on audience-facing output.

Acceptance:

- GOV-01-A — automated: release binding resolves `v0.9.5-owner.1`, owner/date, color set and `signedRelease: false`; artifact tuple/hash resolves that exact release, without inherited or fabricated 0.9.5 signing claims
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

Revision r3 explicitly records the owner’s 30 September 2026 clarification: wordmark colour is flexible, including per-letter colours; gray is optional; the official logo is permitted on readable light and dark backgrounds. It corrects the inherited blanket recolour wording and prevents motif carrier restrictions from being misapplied to official logos. This is an owner-directed policy clarification, not an editorial-only or cryptographically signed change; DS 0.9.5, its approved colour sets, original assets and unchanged schema identities remain in place.

Normative change MUST NOT hide in an editorial revision. `latest` is a discovery convenience, never a receipt identity. Preserve exact published source bytes and their signatures; historical signatures apply only to their original subjects. Package integrity, final-artifact quality and account/team activation are distinct evidence.

### 0.3 One-file reading and source provenance

Read current rules in their normal chapters. The machine block contains current policies, the stable rule catalog, tokens, exact 41-stop LUTs, format/component/motif contracts and schema resources. Historical source hashes and the deterministic consolidation record are provenance in Appendix A, not extra reading or installation dependencies. The complete shared foundation is `Landometer-Design-System-v0.9.5.md`; it needs no earlier LDS master or overlay. For product-scoped work, load this same complete LDS foundation plus the separate current product Add-on. An Add-on contains product-specific rules and depends on the shared foundation; it does not duplicate or replace the complete LDS. Product facts, identity assets and permissions remain product-owned under LAYER-01. In Project Sources, retire the superseded `Landometer-Design-System-v0.9.5-standalone.md` document revision r1 for new work; the active shared document is this r3 revision; supersede r2 and r2-docs1 Project Source copies for current work.
