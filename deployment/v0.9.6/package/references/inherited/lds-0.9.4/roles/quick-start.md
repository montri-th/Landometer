# Quick start · LDS 0.9.4 (v0.9.4-mp1) ใน 5 นาที

## สิ่งที่เปลี่ยนจาก 0.9.1 · what changed

| # | เรื่อง | ความหมายในงานประจำวัน | กฎ |
|---|---|---|---|
| 1 | สเกลสี 14 + 6 ตระกูล มีสีกลางผสม แบ่งสามโซน | เลือกตระกูลตาม "หน่วยหาร" ไม่ใช่หัวข้อ (ต่อพื้นที่ → density.area, ต่อคน → density.capita, ต่อครัวเรือน → density.household, จำนวนนับ → count) หนึ่ง surface ใช้ได้โซนละตระกูล | DATAVIZ-02 |
| 2 | dark theme ไม่ต้องเลือกสีเอง — คำนวณจาก light ทุกครั้ง | dark anchors ทุกค่ามาจากสูตร (OKLCH: low L .32 · mid L = 1.33 − L(light) · high L = 1.30 − L(light)); ตระกูลอุ่น (activity, density.area, heat, risk, price) ใช้สูตร warm lane ของ 0.9.4 (low .32/.018 · mid L .66) เพื่อไม่ให้ตกเป็นสีน้ำตาล; ต่างจากสูตรแม้ 1 ค่า = preflight ตก (ยกเว้น age dark mid ที่ประกาศเป็น exception); ปัญหา "สี drop ใน dark" ของ 0.9.1 ปิดที่ต้นทาง | DATAVIZ-03 |
| 2b | ห้ามสีน้ำตาลและสีม่วงในทุกค่าวิเคราะห์ (ใหม่ใน 0.9.4) | หน้าต่างสีที่ v0.9.0 ถอนแล้ว (earth: hue 30–100° · violet: hue 285–345°) เป็นเกตของ anchor ทุกตัวและ series ทุกช่องทั้งสองธีม; ห้ามตั้ง token ใหม่เพื่อเลี่ยงเกต; สีชมพูอุ่น (hue 350–20°) ใช้ได้ ("pink is fine, just no purple") | DATAVIZ-04 |
| 3 | ชุดสีหมวดหมู่ Dial 10 สองชั้น (fill สว่าง + ink เข้ม) · v7 | พื้นที่สีอ่อนแยกด้วยเส้นขอบ; ตัวหนังสือ เส้น จุดเล็กใช้ ink; default = soft; vivid เปิดได้เมื่อ surface นั้นไม่มี energy accent (ช่อง sky นับเป็น energy accent); slot 10 เป็นสีเขียว (ชุด rose เป็นทางเลือกที่ถูกกฎแต่ไม่ถูกเลือก); ink ของ slot 2 และ 3 ในธีมสว่างคือ `--text-primary` เพราะ hue อุ่นไม่มีรูปเข้มที่อ่านได้ | DATAVIZ-05 |
| 4 | ทุก release ต้องมีหลักฐานเกตสีทั้งสองธีม | `contrast-evidence.json` (PASS · undeclared 0 · declared exceptions 3 · warnings 5 · separation min light 10.2 / dark 9.7 · series ink min 5.24:1 · dark fill min 8.93:1) ต้องใหม่กว่า tokens และ CSS ที่มันรับรอง | GATE-01 |
| 5 | motif หกแบบจาก Motif Studio ใช้ได้ — แต่ทุกอันต้องมี "งาน" และ "จังหวะ" | dial · rings · layers · slice · cultivate · logo; ใส่ผ่าน MotifFrame เท่านั้น; ไม่เกิน 3 จังหวะต่อหน้า; ห้ามทับคำตอบแรก หลักฐานหลัก และปุ่มหลัก; bytes ต้องตรง hash | MOTIF-01…05 · MOTION-04 |
| 5b | motif วางได้เฉพาะบนพื้นที่วัดค่าแล้ว (ใหม่ใน r2) | full (หมึกน้ำเงิน) วางบนพื้นสว่างเรียบ · quiet (หมึก sky) วางบนพื้นเข้มรวม Brand Blue · ห้าม full บน Brand Blue หรือ atmosphere · ทุกการวางประกาศ `data-host-surface` · ลายอ่านไม่ออก = เปลี่ยนพื้น → variant → ขนาด → ถอดลาย ห้ามแก้สีลาย | MOTIF-06 |
| 6 | product sting เป็น overlay แยก | ijji (logo sting, four-beat), CityChat (conversation set) อนุมัติแล้วที่ bytes ปัจจุบัน; CityMETER/CityWiki pre-approved รอ Studio 1.4 ผลิต; ห้ามผสม overlay กับ motif กลางในล็อกอัพเดียว | MOTIF-05 |
| 7 | ทุกเว็บมีชุดไอคอน 6 ขนาด และ title `[หน้า] · [ผลิตภัณฑ์]` | ชุด portfolio อนุมัติแล้ว (`iconset.landometer.portfolio.symbol.01`); product tile ยังเปิด; ไม่มีไอคอน = งานยังไม่เสร็จ | FAVICON-01 |
| 8 | link preview 1200 × 630 เป็น target ที่สอง | เส้นสี่สี 8px · แผงน้ำเงิน · measure line · บอกว่าจะเห็นอะไรเมื่อเปิด · og:title ≤ 60 · og:description ≤ 155 · ภาพนิ่งเสมอ | SOCIALFMT-01 |
| 9 | ค่าว่าง ≠ ศูนย์ — ห้าสถานะ | `0` = สำรวจแล้วเป็นศูนย์ · `—` = ไม่มีข้อมูล (บอกเหตุผล + ค่าล่าสุด) · นอกขอบเขต · `‹5` ปิดค่า · `…` ยังไม่ถึงรอบ ห้าม N/A; ป้ายไม่วางบน hatch | EVID-05 |

## คำศัพท์ที่จะเจอ · vocabulary

- **release tuple** — 0.9.4 / 0.9.4-r2 / lds-rules-0.9.4 / v0.9.4-mp1; อ่านจาก `machine/release.json` เท่านั้น
- **color-srgb-07** — ชุดสีของรอบนี้ (id ใหม่: color-srgb-06 คือชุดของ candidate 0.9.3 ที่ถูกแทนที่ และ candidate 0.9.2 ที่ถูกถอนก็เคยใช้ id 06 ด้วย byte ต่างกัน — ดูที่ hash เสมอ); ใช้ `color-srgb-07.production.css` ในงานจริง ไฟล์ raw สองไฟล์เป็น provenance
- **hue window (DATAVIZ-04)** — ช่วงสีที่ถอนแล้ว: earth (hue 30–100°, C .035–.145, L ≤ .62) และ violet (hue 285–345°, C ≥ .04); เกต B-HUE-01/02 และ SC-17 ตรวจทุก anchor และทุก series; clay band (light) เตือน
- **warm lane** — ตระกูลที่ hue ของสีกลาง light อยู่ใน 30–100° (activity, density.area, heat, risk, price); dark ใช้สูตรเฉพาะและเกต D-STEP-03
- **derived dark** — dark anchor ที่คำนวณจาก light hex ที่ ship ด้วย `validate-dataviz-gates-0.9.4.mjs`; ไม่มีค่า dark ที่เลือกด้วยมืออีกต่อไป
- **fill / ink** — สองชั้นของสีหมวดหมู่: fill สำหรับพื้นที่ (สว่าง, แยกด้วยเส้น), ink สำหรับข้อความและเส้นบาง (≥ 4.5:1)
- **hue zone** — warm / green / blue; หนึ่ง surface ใช้ได้โซนละหนึ่งตระกูล
- **value state** — measured_zero · no_data · out_of_scope · suppressed · not_yet
- **EvidenceCard** — การ์ดหลักฐานย่อสำหรับฝังในคำตอบ AI หรือ link preview: ค่า + หน่วย + สถานะ + dataset/source/date/boundary/limitation + URL ถาวร + เลขใบรับ
- **motif · job · beat** — ลวดลายเคลื่อนไหวหกแบบ (dial, rings, layers, slice, cultivate, logo) แต่ละอันมีงานที่ทำได้ (เช่น orientation, handoff) และจังหวะ (opening / transition / closing); ทะเบียนอยู่ที่ `machine/motif-register.v0.9.4.json`
- **MotifFrame / MotionController** — กรอบที่ mount motif จาก runtime bytes ที่ hash ตรง และปุ่มหยุดระดับหน้าที่ทุกกรอบฟัง (แทน BrandMotion ของ candidate ที่ถอน)
- **joy budget** — ไม่เกิน 3 motion moments ต่อ route ยาว, 1 ต่อ task surface, ห้ามบน first_answer / primary_proof / primary_action
- **carrier · data-host-surface** — พื้นที่ลายวางอยู่ (เช่น `surface.card`, `brand.blue`); id ที่เปลี่ยนตามธีมถูกตรวจทุกธีม, `<id>@light` = พื้นสว่างคงที่ทั้งสองธีม; `data-variant-dark="quiet"` สลับ full เป็น quiet ในธีมมืด; ตารางอยู่ที่ `motif-register.v0.9.4.json#/carrierPolicy` (MOTIF-06)
- **product overlay** — sting ของผลิตภัณฑ์ (ijji, CityChat, CityMETER, CityWiki) ลงทะเบียนแยก มี fallback, ระยะเวลา และขนาดขั้นต่ำของตัวเอง
- **v0.9.4-mp1** — แพ็กเกจที่เซ็นแล้วและมีผลบังคับใช้ (เจ้าของอนุมัติ 17 กันยายน 2569 · เซ็น 23 กันยายน 2569) ตรวจลายเซ็นกับ `owner-trust/v0.9.4` (SPKI `0242a576a012482bdbced2992e143f219fbc4cfc47881acd2f4bb49fa89efcab`); v0.9.1-mp7 เป็นรุ่นก่อนหน้า ตรวจได้กับ `owner-trust/v0.9.1` เท่านั้น

## ที่อยู่ของของ · where things live

ในคู่มือชุดนี้ `machine/` หมายถึงไฟล์ของแพ็กเกจที่เซ็นแล้ว v0.9.4-mp1 (บน Drive: `Landometer_Design_System/v0.9.4/machine/v0.9.4/`) วางข้าง `build-kit/` (จาก `archives/LDS-0.9.4-candidate-rekey.zip`) วางแบบนี้แล้วคำสั่งตรวจทุกคำสั่งในคู่มือรันได้ตามที่เขียน

- กฎ (คน): `machine/Landometer Design System v0.9.4.md` — §8.6 motif (รวม MOTIF-06 พื้นที่วาง), §11.9 สีข้อมูล (DATAVIZ-02…05, GATE-01), §15 ประโยคและค่าที่เปลี่ยน (§15.5 = 26 ค่าของ delta), §20 บทบาท, §21 คำตัดสิน 17 กันยายน 2569 และงานที่เหลือ
- กฎ (เครื่อง): `machine/rule-catalog.json` (64 กฎ) · `machine/tokens.v0.9.4.json` · `machine/component-contracts.v0.9.4.json` · `machine/motif-register.v0.9.4.json`
- ของใช้: `build-kit/` (dev) · `roles/lds-0.9.4.tokens.dtcg.json` (designer) · `showcase/` (ดูภาพรวมสองธีม)
- ตัวตรวจ: `machine/validate-v0.9.4.mjs` กับ trust pair จาก `owner-trust/v0.9.4` (แพ็กเกจ) · `machine/validate-dataviz-gates-0.9.4.mjs` (เกตสี) · `build-kit/preflight-0.9.4.mjs <page.html>` (หน้าเว็บ) · `machine/contrast-evidence.json` (หลักฐาน)

## สามคำถามก่อนส่งงาน · three questions before you ship

1. ทุกสีมาจาก registry ของ release นี้ไหม (ไม่มี hex ที่คิดเอง, dark ไม่ได้เขียนเอง, สีกลางไม่ใช่ energy token, ไม่มีสีน้ำตาล/ม่วงในสเกลหรือ series)
2. ทุกค่าที่เป็น 0 หรือว่างมีสถานะและเหตุผลไหม
3. งานเว็บมีไอคอน 6 ขนาด, title ตาม pattern, OG 1200 × 630 และ (ถ้ามี motif) job + beat ครบ ไม่เกิน 3 จังหวะ bytes ตรง hash วางบนพื้นที่อนุญาตทั้งสองธีม และมีปุ่มหยุดไหม
