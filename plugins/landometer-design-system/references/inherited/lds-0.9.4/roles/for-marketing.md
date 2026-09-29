# For marketing · LDS 0.9.4 (v0.9.4-mp1) · บทบาทใหม่ตั้งแต่ 0.9.3

หน้านี้ตอบว่า "landing, โพสต์, creative และคลิปที่ออกจากทีมการตลาดต้องหน้าตาแบบไหน ใช้อะไรได้ และอะไรที่ระบบจะตีกลับ" ทีมการตลาดเป็นผู้ใช้ motif และ product sting มากที่สุด จึงเป็นบทบาทที่ MOTIF-01…06 เขียนถึงโดยตรง

## 1. Link preview และโพสต์ (SOCIALFMT-01)

- ทุกลิงก์ที่แชร์ต้องมี OG 1200 × 630: เส้นสี่สี 8px ขอบบน · แผง Brand Blue (หรือ atmosphere ที่ประกาศ) · measure line 3 × 5px · identity สูง ≤ 56px · ประโยค "จะเห็นอะไรเมื่อเปิด" · แหล่ง · วันที่ · ข้อจำกัด · destination cue ≥ 22px (ไม่ใช่ปุ่ม) — ต้นแบบ `build-kit/og-1200x630.template.html`
- og:title = `[สิ่งที่แสดง] [ช่วง/ขอบเขต] · [ผลิตภัณฑ์]` ≤ 60 · og:description = `[จะเห็นอะไร] · [แหล่ง · วันที่] · [ข้อจำกัด]` ≤ 155 · ไม่มี "!" ไม่มี "คลิกเลย" ไม่มี emoji ไม่มีตัวเลขไม่มีหน่วย
- โพสต์ feed ใช้ `target.social.square.1080.01`; ไม่มีสัดส่วนอื่นใน release นี้ (สัดส่วนอื่น = block ไม่ใช่ปรับเอง)
- creative ทุกชิ้นเป็นภาพนิ่งเฟรมสุดท้าย: ไม่มี motif เคลื่อนไหว ไม่มี product sting และไม่มีโลโก้ขยับใน OG หรือ feed (MOTIF-01 prohibitedJobs: favicon, official_navigation_identity, co_brand_lockup)

## 2. ตัวเลขทุกตัวเดินทางพร้อม EvidenceCard (EVID-05)

- ตัวเลขในโพสต์หรือ landing ต้องมีหน่วย แหล่ง วันที่ และข้อจำกัด — ในเว็บใช้ EvidenceCard (การ์ดที่มีลิงก์ถาวรและเลขใบรับ); ในโพสต์ที่วางการ์ดไม่ได้ ใช้ข้อความสำรองหนึ่งบรรทัด: `[ค่า] [หน่วย] · [สถานะ] · [dataset] · [แหล่ง] · [วันที่] · [ขอบเขต] · [ข้อจำกัด] · [URL ถาวร] · receipt [id]`
- ห้าสถานะ: 0 = สำรวจแล้วเป็นศูนย์ · — = ไม่มีข้อมูล (บอกค่าล่าสุด) · นอกขอบเขต · ‹5 ปิดค่า · … ยังไม่ถึงรอบ; ห้าม N/A; ห้ามแปลง "ไม่มีข้อมูล" เป็น "ไม่มี"
- ป้ายหลักฐานหกแบบ (Master Brand Brief v0.5.3 §3.7): ข้อเท็จจริงที่วัดได้ · การตีความเทียบ benchmark (บอกจักรวาลและขนาดกลุ่มเทียบ) · เจ้าของยืนยัน · ข้อสรุปของผู้เขียน · สมมติฐาน · หลักฐานจากหน้างาน — โพสต์ที่ผสมสองแบบต้องแยกให้เห็น

## 3. Motif ใช้อย่างไรให้ "มีความสุข" และไม่โดนตีกลับ (MOTIF-01…04, MOTIF-06)

| kind | จังหวะ | ใช้เมื่อ | งานที่ใส่ใน Build Card |
|---|---|---|---|
| logo | Opening | เปิดหน้า/คลิป ด้วยโลโก้ประกอบตัว (ทางเดียวที่โลโก้ขยับได้) | animated_brand_opening |
| dial | Opening | บอกว่า "กำลังวัดอะไร" ตอนเปิด | orientation · opening |
| rings | Transition | เปลี่ยนพื้นที่ / เปลี่ยนหัวข้อระหว่างส่วน | spatial_transition · section_orientation |
| layers | Transition | ซ้อนชั้นข้อมูล หรือคั่นเงียบ ๆ | layering · quiet_divider |
| slice | Closing | ปิดท้ายพร้อมการกระทำ (ไปที่ receipt, ดาวน์โหลด) | action_closure |
| cultivate | Closing | ปิดท้ายด้วยความหมาย "Let us cultivate our city" หรือส่งต่อ | cultural_closure · handoff |

- งบความสนุก (joy budget): ≤ 3 จังหวะต่อหน้า, 1 ต่อ task surface, ไม่ทับคำตอบแรก หลักฐานหลัก และปุ่มหลัก — บอกทีม dev ว่าจังหวะไหนอยู่ตรงไหน ทีม dev จะกรอก `motionMoments[]` และ preflight จะตรวจ
- พื้นที่วางได้ (MOTIF-06): full อยู่บนพื้นสว่างเรียบ (ขาว, beige, canvas); quiet อยู่บนพื้นเข้ม (แผง Brand Blue, พื้นมืด, ground.current/measure.deep) — **ห้ามวาง full บนแผงน้ำเงิน** เพราะส่วนสีน้ำเงินของลายจะหายไปทั้งชิ้น และห้ามแก้สีลายให้ "เห็นชัดขึ้น"; ลายนิ่งในโพสต์/เด็คใช้ตารางเดียวกัน

| variant | วางได้ (ทุกแบบ เว้นที่ระบุ) | ยกเว้น | ห้ามเด็ดขาด |
|---|---|---|---|
| `full` (หมึกน้ำเงิน · `ink="blue"`) | `brand.beige`, `surface.alt@light`, `surface.beigeTint@light`, `surface.blueTint@light`, `surface.canvas@light`, `surface.card@light`, `surface.raised@light`, `surface.soft@light` | layers: `surface.canvas@light`, `surface.card@light`, `surface.raised@light` | Brand Blue · พื้นธีมมืด · atmosphere ทุกชุด · ภาพถ่าย |
| `quiet` (หมึก sky สีเดียว) | `atmosphere.ground.current`, `atmosphere.measure.deep`, `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | layers: `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | พื้นสว่างทุกแบบ · `atmosphere.ground.mist` · `atmosphere.measure.luminous` · ภาพถ่าย |

- motif เล่นซ้ำขณะมองเห็นและหยุดเมื่อพ้นจอ (คำตัดสินเจ้าของ OWNER-MOTION-01); ทุกหน้ามีปุ่มหยุด; คนที่เปิด reduced motion เห็นเฟรมสุดท้าย — ห้ามขอ "ให้วนไปเรื่อย ๆ"
- motif ไม่ใช่ข้อมูล ไม่ใช่ตัวบอกความคืบหน้า ไม่ใช่ตัวบอกว่า "โหลดอยู่" และไม่ใช่ไอคอน: ใช้ประกอบเรื่อง ไม่ใช่ประกอบตัวเลข
- คลิป: motif และ logo ใช้ได้ใน format `video_owner_extension` ที่เจ้าของอนุมัติเป็นชิ้น ๆ; export จาก runtime เท่านั้น ห้ามวาดหรือ re-animate เอง

## 4. Product sting (MOTIF-05) — ใช้ได้เมื่อไร

| overlay | ผลิตภัณฑ์ | สถานะใน release นี้ | โหมด |
|---|---|---|---|
| ijji.logo-sting.r3 | ijji | owner_approved · 12 files | finite_once_logo_sting |
| ijji.four-beat.selected-3.r3 | ijji | owner_approved · 20 files | state_bound_only |
| citychat.conversation-set.1.0.1 | CityChat | owner_approved · 9 files | finite_once |
| citymeter.sting | CityMETER | pre_approved_pending_production · no bytes yet | — |
| citywiki.sting | CityWiki | pre_approved_pending_production · no bytes yet | — |

- ใช้ได้เฉพาะ overlay ที่ `owner_approved` และมี bytes; CityMETER/CityWiki ต้องรอ Studio 1.4 ผลิตแล้วลงทะเบียน (ไม่ต้องขออนุมัติซ้ำ ยกเว้น family ใหม่)
- ijji four-beat เป็น state-bound: ใช้ได้เฉพาะขณะมีงานคำนวณจริง พร้อม status text และปุ่มยกเลิก — ไม่ใช่ตัวประกอบโพสต์
- ห้ามผสม product sting กับ motif กลาง (dial/rings/…) ในล็อกอัพเดียว; ห้ามใช้ sting ของผลิตภัณฑ์หนึ่งกับผลิตภัณฑ์อื่น; identity ทางการยังเป็น PNG (motif logo กับ PNG มีค่าสีต่างกันเล็กน้อยที่เจ้าของยอมรับแล้ว — ห้าม "แก้ให้ตรง")
- สี meaning และ product facts ของ CityChat/ijji อยู่ใน DS Add-on ของผลิตภัณฑ์นั้น ไม่ใช่ทะเบียน motif

## 5. สิ่งที่ออกนอกองค์กรไม่ได้ (Master Brand Brief v0.5.3)

- ราคา สัญญา pipeline และ SWOT ภายใน · จำนวนผู้ทดลองใช้เป็น traction · LOI/ข้อเสนอ/test site เป็น "ลูกค้า" · ยื่นแล้วเป็น "อนุมัติแล้ว" · prototype เป็นผลลัพธ์สุดท้าย
- ป้ายสถานะผลิตภัณฑ์นอกชุด MBB §5.1: CityMETER, CityChat = เข้าสู่ตลาดระยะแรก · ijji = กำลังสร้างตลาด · CityWiki = ลงทุนเชิงกลยุทธ์ · งานตามสัญญา = สัญญาเดินอยู่ · ระบบข่าวกรองสินทรัพย์ = ดำเนินการจริงในเครือ
- SRI = รายได้ · heatmap = จำนวนคนเดิน · rating = ยอดขาย · ราคาที่ดิน = รายได้ผู้อยู่อาศัย · ทราฟฟิกสูง = โอกาสอาหารสูง
- คำว่า vibrant / robust / pivotal / transformative และ "!" ในข้อความ preview
- กราฟหรือแผนที่ที่มีสีน้ำตาล ดินเผา หรือม่วง (ไม่ได้มาจาก registry; เกต DATAVIZ-04 ตีกลับ) — ขอ creative ที่ทีม dev รัน preflight แล้ว

## 6. เช็คลิสต์ก่อนโพสต์หรือส่ง landing ขึ้น

1. OG/feed creative นิ่ง มีเส้นสี่สี แผงน้ำเงิน ประโยค "จะเห็นอะไร" แหล่ง วันที่ ข้อจำกัด ไหม
2. ตัวเลขทุกตัวมีหน่วย แหล่ง วันที่ และสถานะ (ไม่มี N/A) ไหม
3. motif ทุกอันมี job + beat, รวมไม่เกิน 3, ไม่ทับคำตอบแรก/หลักฐาน/ปุ่มหลัก, วางบนพื้นที่อนุญาตทั้งธีมสว่างและมืด (full ไม่อยู่บนแผงน้ำเงิน), และหน้ามีปุ่มหยุดไหม — ขอผล `preflight-0.9.4.mjs` จากทีม dev แนบไปกับงาน
4. product sting ที่ใช้ อยู่ในทะเบียนและ approved ไหม ไม่ได้ผสมกับ motif กลางไหม
5. ผลิตภัณฑ์ที่พูดถึงใช้ป้ายสถานะตาม MBB และไม่มีราคา/สัญญา/pipeline หลุดไหม
6. ถ้ายังไม่แน่ใจ ส่งเป็น internal preview ให้ทีมก่อน — งานที่ออกสู่สาธารณะต้องอ่านเหมือนงานที่เสร็จและตัดสินใจแล้ว
