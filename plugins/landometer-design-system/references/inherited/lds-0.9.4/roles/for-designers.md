# For designers · LDS 0.9.4 (v0.9.4-mp1)

นำ `roles/lds-0.9.4.tokens.dtcg.json` เข้าเครื่องมือ token ของ Figma (รูปแบบ W3C Design Tokens) แล้วใช้หน้านี้เป็นกติกาการเลือก ค่าทุกค่าใน export มาจาก `machine/tokens.v0.9.4.json` ไม่มีค่าที่พิมพ์เอง — รวมถึง dark ทุกค่าที่เป็นผลคำนวณจาก light (DATAVIZ-03)

## 1. สเกลสี 14 sequential + 6 diverging (DATAVIZ-02 · DATAVIZ-03)

| โซน | ตระกูล (light low → mid → high · dark ในวงเล็บ) |
|---|---|
| warm | activity #F2F1DF → #F49383 → #C52C00 (dark #3C302D → #D17465 → #FF977F) · density.area #F2F1DF → #EE9A69 → #A1182D (dark #3B302B → #CC7B4A → #FFB4B3) · heat #FBF1C6 → #E3A257 → #850E2E (dark #393129 → #C28336 → #FFD1D3) · risk #F2F1DF → #CEA856 → #B74436 (dark #373229 → #B18C39 → #FF9686) |
| green | price #F2F1DF → #CAAF59 → #135B42 (dark #363329 → #AA9038 → #A5E9CA) · age #F2F1DF → #B1B58A → #364D48 (dark #333515 → #717D55 → #B3ECDF) · density.household #F2F1DF → #93C089 → #0B5D2A (dark #253920 → #5A8450 → #A2ECB1) · growth #F2F1DF → #5BC19D → #126F68 (dark #153B2E → #229270 → #81D2C9) · confidence #F2F1DF → #85A5A2 → #08756F (dark #0A3B38 → #669490 → #75CDC6) |
| blue | count #F2F1DF → #55B8C2 → #236DAA (dark #083A3F → #26919B → #77BEFF) · water #E6F1F2 → #8FD3E0 → #0F6E8C (dark #0A3A41 → #2A6F7B → #78CAEA) · density.capita #F2F1DF → #6DB3E4 → #1E3E86 (dark #19364A → #3E85B3 → #CEDFFF) · built #F2F1DF → #6797AF → #225F78 (dark #133748 → #6A9AB2 → #99D5F2) · duration #F2F1DF → #A7B9BF → #275C76 (dark #0E3944 → #517B88 → #A0D6F4) |
| diverging | balance #C52C00 ↔ #186A9E (dark #FE8F75 ↔ #7AC5FE, zero #2D3438) · delta #B74436 ↔ #007C78 (dark #FD8C7B ↔ #68C7C2, zero #2D3438) · tradeoff #AB2E47 ↔ #007E91 (dark #FF9EA7 ↔ #60C1D5, zero #2D3438) · flow #D09B00 ↔ #1A8A51 (dark #DBA833 ↔ #65C98C, zero #2D3438) · sentiment #CB4453 ↔ #429C5A (dark #FD8A8F ↔ #6FC883, zero #2D3438) · anomaly #3578B8 ↔ #DC631E (dark #73B6FB ↔ #F99262, zero #2D3438) |

กติกาที่ต้องจำ: เลือกตระกูลตามหน่วยหาร (ต่อพื้นที่ / ต่อคน / ต่อครัวเรือน / จำนวนนับ) ไม่ใช่ตามหัวข้อ · หนึ่ง surface ใช้ได้โซนละหนึ่งตระกูล · สีกลางไม่ใช่ energy color · low คือ beige ยกเว้น water และ heat · ในเครื่องมือออกแบบใช้ 3 anchors (LUT 41 ขั้นผลิตโดยระบบ ไม่ต้องวาดเอง) · **dark ห้ามเลือกเอง**: ทุก dark anchor คือผลของสูตรเดียวจาก light (low L .32 C .05 · mid L = 1.33 − L(light) · high L = 1.30 − L(light) · diverging zero `#2D3438`) ตระกูลอุ่น (activity, density.area, heat, risk, price) ใช้สูตร warm lane ของ 0.9.4 (low L .32 C .018 · mid L .66 C ≤ .12) เพื่อไม่ให้ dark ตกเป็นสีน้ำตาล; age dark mid เป็น exception เดียวที่ประกาศ · ถ้าต้องการให้ dark เปลี่ยน ต้องเปลี่ยน light แล้วให้ระบบ derive ใหม่ · **หน้าต่างสีที่ถอนแล้ว (DATAVIZ-04)**: ไม่มีค่าวิเคราะห์ใดอยู่ในช่วง earth (hue 30–100°, C .035–.145, L ≤ .62) หรือ violet (hue 285–345°, C ≥ .04) — สีน้ำตาล ดินเผา ม่วง ลาเวนเดอร์ plum ไม่มีในสเกล; สีชมพูอุ่น (hue 350–20°) ใช้ได้ · หลักฐานเกต: `machine/contrast-evidence.json` (PASS · undeclared 0 · declared exceptions 3 · warnings 5 · separation min light 10.2 / dark 9.7 · series ink min 5.24:1 · dark fill min 8.93:1)

## 2. สีหมวดหมู่ Dial 10 · v7 (DATAVIZ-05)

| slot | ชื่อ · cue | soft fill | vivid fill | ink (light) | dark fill / ink |
|---|---|---|---|---|---|
| 1 | coral · circle | #D88381 | #F66C6D | #963538 | #F8A4A1 / #FFC8C5 |
| 2 | apricot · square | #E39B6E | #FF8A36 | #182327 | #F8B287 / #FFCBAC |
| 3 | yellow · triangle | #EAC578 | #FDC010 | #182327 | #F3D086 / #F6D389 |
| 4 | lime · diamond | #BECE7E | #BBD23C | #606E00 | #CBDA8E / #D1E195 |
| 5 | mint · cross | #7BD0A3 | #2ADB94 | #007047 | #8FDFB4 / #9BECC1 |
| 6 | sky · star · energy accent | #6ACCF0 | #36D0FF | #006580 | #7DD9FB / #9CE4FF |
| 7 | teal · hexagon (cue required) | #49C0BC | #00C4BF | #006967 | #6DD9D5 / #81EDE8 |
| 8 | blue · ring (cue required) | #6196D1 | #3295F6 | #0E599D | #88BCF6 / #BBDBFF |
| 9 | slate · dash (cue required) | #8AA4AA | #7FA6B0 | #355F6A | #A1C5CE / #BBDFE8 |
| 10 | green · plus (cue required) | #82AC79 | #71B262 | #34622A | #9AD78C / #B8E7AE |

- fill สำหรับพื้นที่: สว่าง ไม่ต้องผ่าน 3:1 แต่ต้องมีเส้นขอบ 1px (`border.default`) หรือ outline สี ink; legend swatch มีขอบ hairline
- ink สำหรับข้อความ เส้น และจุด < 3px (ทุกช่อง ≥ 5.24:1 บน canvas)
- default คือ soft; vivid ใช้เฉพาะ surface ที่ไม่มี energy accent (hero, แผงน้ำเงิน, product card ห้าม) — ช่อง sky ของทั้งสองแบบให้ถือว่าเป็น energy accent (คำตัดสินเจ้าของ 15 กันยายน 2569)
- ผูกสีกับ category id ไม่ใช่ตำแหน่ง; เรียงหมวดใหม่แล้วสีต้องไม่เปลี่ยน; ตั้งแต่ช่อง 7 ต้องมี shape cue เสมอ
- 0.9.4: slot 10 เปลี่ยนจาก rose เป็นสีเขียว (เจ้าของเลือกบนจอ 17 กันยายน 2569; ชุด rose ยังถูกกฎและบันทึกเป็นทางเลือกใน `categoricalSeries.slot10Alternates`); ink ของ slot 2 (apricot) และ 3 (yellow) ในธีมสว่างคือ `--text-primary` เพราะ hue อุ่นไม่มีรูปเข้มที่อ่านได้โดยไม่กลายเป็นสีน้ำตาล — การระบุหมวดอยู่ที่ fill + shape cue
- default bindings สำหรับ land use: commercial coral · residential apricot · agriculture yellow · park lime · forest mint · water sky · industry teal · institution blue · transport slate · tourism green

## 3. ห้าสถานะของค่า (EVID-05) — ภาษาภาพ

| สถานะ | อักขระ | แผนที่ | ตาราง/การ์ด |
|---|---|---|---|
| ศูนย์ (สำรวจแล้ว) · Zero (measured) | `0` | lowest class fill + --dataviz-zero-outline 2px | numeric 0 with unit |
| ไม่มีข้อมูล · No data | `—` | --data-no-data-pattern 135° hatch + --border-emphasis | — + short reason, sorted last |
| นอกขอบเขตข้อมูล · Out of scope | `นอกขอบเขต` | bare basemap (no fill, no hatch) | text label |
| ปิดค่า (n<5) · Suppressed (n<5) | `‹5` | --surface-soft + dashed --border-emphasis | ‹5 + rule |
| ยังไม่ถึงรอบข้อมูล · Not yet available | `…` | --semantic-pending-fill + dotted --semantic-pending-ink | … + expected date |

ป้ายใช้ `text.metadata` (#5C6A61 light / #A6B5B1 dark) บน legend หรือตาราง **ไม่วางบน hatch** (คำตัดสินเจ้าของ 15 กันยายน 2569 — hatch อยู่ที่กล่องอักขระ swatch หรือหน่วยแผนที่ ป้ายอยู่ข้าง ๆ บนพื้นเรียบ); `text.muted` ใช้กับ hint ที่ disabled เท่านั้น; ห้าม N/A

## 4. Motif หกแบบ (MOTIF-01…06) — ออกแบบด้วยเฟรมสุดท้าย บนพื้นที่วัดแล้ว

| kind | จังหวะ | งานที่ทำได้ | cycle | SVG full / quiet (hash) |
|---|---|---|---|---|
| dial | opening | orientation, opening | 3000 ms | 7ecfd116… / 2e624d80… |
| rings | transition | spatial_transition, section_orientation | 3000 ms | b50ec8fa… / d494be1f… |
| layers | transition | layering, quiet_divider | 3000 ms | a94a59a3… / e3e2bf65… |
| slice | closing | action_closure | 3000 ms | 8d0dfb62… / c72114d4… |
| cultivate | closing | cultural_closure, handoff | 3000 ms | ce494d79… / edf85381… |
| logo | opening | animated_brand_opening | 6000 ms | 90e9543f… / 5b6798cd… |

- วางได้ไม่เกิน 3 จังหวะต่อหน้า (Opening → Transition → Closing) และ 1 ต่อ task surface; ห้ามทับคำตอบแรก หลักฐานหลัก และปุ่มหลัก
- พื้นที่วางได้ (MOTIF-06 · ใหม่ใน r2): full มีหมึกน้ำเงินในตัวจึงอยู่บนพื้นสว่างเรียบเท่านั้น; quiet เป็นหมึก sky สีเดียวจึงอยู่บนพื้นเข้มเท่านั้น (รวม Brand Blue); พื้นที่เปลี่ยนตามธีมให้สลับ full ↔ quiet ตามธีม หรือใช้ tile ที่สีไม่เปลี่ยน

| variant | วางได้ (ทุกแบบ เว้นที่ระบุ) | ยกเว้น | ห้ามเด็ดขาด |
|---|---|---|---|
| `full` (หมึกน้ำเงิน · `ink="blue"`) | `brand.beige`, `surface.alt@light`, `surface.beigeTint@light`, `surface.blueTint@light`, `surface.canvas@light`, `surface.card@light`, `surface.raised@light`, `surface.soft@light` | layers: `surface.canvas@light`, `surface.card@light`, `surface.raised@light` | Brand Blue · พื้นธีมมืด · atmosphere ทุกชุด · ภาพถ่าย |
| `quiet` (หมึก sky สีเดียว) | `atmosphere.ground.current`, `atmosphere.measure.deep`, `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | layers: `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | พื้นสว่างทุกแบบ · `atmosphere.ground.mist` · `atmosphere.measure.luminous` · ภาพถ่าย |

เหตุผลเป็นตัวเลข: ไฟล์ full ทั้งหกมีสีน้ำเงิน `#1D4497` อยู่ในตัว บน Brand Blue ส่วนนั้นเหลือ 1.00:1 (หายไป) · quiet บนพื้นสว่างได้สูงสุดเพียง 1.23–1.74:1 · ตัวเลขทั้งหมดอยู่ใน `motif-register.v0.9.4.json#/carrierPolicy/measured` (วัดแบบเดียวกับ ladder ที่เจ้าของอนุมัติ 2026-09-11; ตรงกัน 18/18)

- ลายอ่านไม่ออกบนพื้นที่ต้องการ: เปลี่ยนพื้น → เปลี่ยน variant → เพิ่มขนาด/ระยะว่าง → ถอดลาย (ladder L1–L5) ห้ามเปลี่ยนสีลาย ห้ามวางแผ่นรอง ห้าม scrim และห้ามเลือกสีใหม่ ในไฟล์ Figma ให้เขียนชื่อ carrier กำกับทุก frame ที่มีลาย
- ออกแบบด้วยไฟล์เฟรมสุดท้ายใน `build-kit/motif/svg/` (ห้ามวาดใหม่ ห้ามแก้เส้น) animation มาจาก runtime ตอน build; ใน static (PDF, โพสต์, OG) ใช้เฟรมสุดท้ายเท่านั้น
- motif ไม่ใช่ข้อมูล หลักฐาน สถานะ loading ไอคอน หรือ identity ในแนวนำทาง; โลโก้เคลื่อนไหวคือ kind logo เท่านั้น (identity of record ยังเป็น PNG ทางการ)
- product sting (ijji, CityChat; CityMETER/CityWiki เมื่อ Studio 1.4 ผลิต) เป็น overlay แยก ห้ามผสมกับ motif กลางในล็อกอัพเดียว

## 5. EvidenceCard, ไอคอน, link preview

- EvidenceCard: กว้าง ≤ 520px · เส้นสี่สี 3px ขอบบน · TrustBadge · ค่าใหญ่ + หน่วย + สถานะ · dataset/source/date/boundary/limitation · measure line 3 × 3px · URL ถาวร · เลขใบรับ · ไม่มีโลโก้ ไม่มีแผง ไม่มี gradient ไม่มี motion ไม่มี motif
- ชุดไอคอน (FAVICON-01): `iconset.landometer.portfolio.symbol.01` อนุมัติแล้ว — 16/32/48 symbol บนพื้นใส · 180 และ 512 maskable เป็น tile `brand.beige` · 192 ใส · ไม่เปลี่ยนตามหน้า · ไม่ใช้ motif; product tile ยังเปิด (รอ gradient ต่อผลิตภัณฑ์)
- OG 1200 × 630 (SOCIALFMT-01): เส้นสี่สี 8px ขอบบน · แผง Brand Blue หรือ atmosphere ที่ประกาศ · measure line 3 × 5px · identity สูง ≤ 56px · ข้อความอยู่ใน 1000 × 560 · symbol + บรรทัดแรกของ title อยู่ในสี่เหลี่ยมกลาง 630 · destination cue ≥ 22px ไม่ใช่ปุ่ม · ภาพนิ่งเสมอ · ต้นแบบ `build-kit/og-1200x630.template.html?guides=1`

## 6. ห้าม

สร้างสีใหม่นอก registry · เลือก dark เอง · ใช้ energy color เป็นสีกลางของสเกล · สอง family โซนเดียวบน surface เดียว · vivid ร่วมกับ energy accent · วาดโลโก้ motif หรือ wordmark ใหม่ · ให้ motif ทำงานที่ไม่ใช่ของมัน · วาง full บน Brand Blue/พื้นมืด/atmosphere หรือ quiet บนพื้นสว่าง · แก้สีลายหรือวางแผ่นรองใต้ลาย · ไล่โทนม่วง/ลาเวนเดอร์/plum/fuchsia หรือ terracotta/brick/rust/brown ในสเกลหรือ series (เกต DATAVIZ-04 ตีกลับ; ชมพูอุ่นใช้ได้) · ตั้ง token ใหม่เพื่อเลี่ยงเกต
