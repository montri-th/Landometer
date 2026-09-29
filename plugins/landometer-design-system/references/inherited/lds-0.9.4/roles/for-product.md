# For product · LDS 0.9.4 (v0.9.4-mp1)

ใช้หน้านี้ตอนเขียน Build Card, spec หรือ review ของงานที่มีข้อมูล แผนที่ เว็บ motif หรือ product sting กติกาเต็มอยู่ใน master; หน้านี้แปลเป็นสิ่งที่ต้องกรอกและต้องถาม

## 1. ฟิลด์ที่ Build Card / capability config ต้องมี (Build Card 0.9.3.2 · capability config 1.5)

| ฟิลด์ | ค่า | ถามตัวเองว่า |
|---|---|---|
| `dataVisualization.scaleFamilies[]` / `map.scaleFamilies[]` | ตระกูลที่ใช้บน surface นั้น | หน่วยหารคืออะไร (จำนวนนับ / ต่อพื้นที่ / ต่อคน / ต่อครัวเรือน) → count / density.area / density.capita / density.household; ใช้โซนละไม่เกินหนึ่ง |
| `dataVisualization.seriesVariant` | `soft` (default) · `vivid` · `none` | surface นี้มี energy accent (hero, แผงน้ำเงิน, product card, ช่อง sky) ไหม ถ้ามี = soft |
| `dataVisualization.valueStates[]` / `map.dataStates[]` / `dataTable.cellStates[]` | subset ของ measured_zero · no_data · out_of_scope · suppressed · not_yet ที่เกิดจริง | ข้อมูลชุดนี้มีค่าปิด (n<5) ไหม พื้นที่นอกขอบเขตไหม รอบข้อมูลถัดไปเมื่อไร |
| dark theme | ไม่มีฟิลด์ให้เลือก | dark ทุกค่า derive จาก light โดยระบบ (DATAVIZ-03; ตระกูลอุ่นใช้สูตร warm lane ของ 0.9.4 จึงไม่เป็นสีน้ำตาลอีก); ถ้า dark "ดูไม่เหมือน light" ให้ทีมเปิด showcase สองธีมเทียบก่อนแจ้ง |
| สีในกราฟ/แผนที่ | ไม่มีฟิลด์ให้เลือก | ถ้าเห็นสีน้ำตาล ดินเผา หรือม่วงในสเกลหรือ series แปลว่าหลุดจาก registry — เกต DATAVIZ-04 ตีกลับ; ห้ามขอ token ใหม่เพื่อให้ผ่าน |
| `publication.discovery.iconSetId` | `iconset.landometer.portfolio.symbol.01` (portfolio, อนุมัติแล้ว) | product tile ต้องมี gradient ที่อนุมัติของผลิตภัณฑ์นั้นก่อน (open item) |
| `publication.discovery.titlePattern` | `[page] · [product]` | title ≤ 60 ตัวอักษร หน้าก่อน ผลิตภัณฑ์หลัง |
| `socialPreview.linkPreviewTargetRef` | `target.social.og.1200x630.01` | og:title/description ตาม template; ภาพนิ่งบอกว่าจะเห็นอะไรเมื่อเปิด |
| `experience.motionMoments[]` (≤ 3) | `{ kind, job, beat, variant, hostSurface, variantDark?, surfaceId }` (+ ค่าที่วัดจาก `carrierPolicy.measured`) | ลายวางบนพื้นอะไร และคู่นั้นอยู่ในตารางทั้งสองธีมไหม (MOTIF-06); motif แต่ละอันมีงานจริงไหม (orientation · opening · spatial_transition · section_orientation · layering · quiet_divider · action_closure · cultural_closure · handoff · animated_brand_opening); จังหวะไหน (Opening = logo/dial · Transition = rings/layers · Closing = slice/cultivate); ไม่ทับคำตอบแรก หลักฐานหลัก ปุ่มหลัก |
| `experience.staticMotifPlacements[]` | `{ kind, variant, hostSurface, format }` | ลายนิ่งในเด็ค/PDF/โพสต์วางบนพื้นที่อนุญาตไหม |
| `experience.productOverlayRefs[]` | id จาก `motif-register.v0.9.4.json#/productOverlays` | overlay นั้น owner_approved และมี bytes ไหม (ijji ×2, CityChat = ใช่; CityMETER/CityWiki = ยัง) |

## 2. EVID-05 เป็น acceptance criteria ของทุก data feature

- ค่าศูนย์ที่สำรวจแล้วต้องแสดงเป็น 0 พร้อมหน่วย ("ปี 2568 ไม่พบโรงงานใหม่ในตำบลนี้ (0 แห่ง)")
- ค่าที่ไม่มีต้องบอกเหตุผลและค่าล่าสุดที่มี ("ยังไม่มีข้อมูลปี 2568 — ล่าสุดคือปี 2567"); ป้ายไม่วางบน hatch
- พื้นที่นอกขอบเขตต้องมี scope statement ไม่ใช่สีขั้นต่ำ
- ค่าปิดต้องบอก threshold และระดับที่เปิดค่าได้
- ค่าที่ยังไม่ถึงรอบต้องบอกวันที่คาดและรอบของแหล่ง
- API/agent payload: `{ value: 0 | null }` ต้องมี `state` เสมอ — ทดสอบด้วย `preflight-0.9.4.mjs --json`

## 3. Motion เป็น requirement ที่นับได้ (MOTIF-04 joy budget)

- ต่อ route ยาว ≤ 3 จังหวะ; ต่อ task surface ≤ 1; ไม่มี motif บน first_answer / primary_proof / primary_action (หน้าเว็บต้องประกาศสามบริเวณนี้ด้วย `data-region` ไม่งั้น preflight ตก)
- motif ไม่ใช่หลักฐาน สถานะ loading ตัวชี้ความคืบหน้า ไอคอน หรือ identity ในแนวนำทาง — ถ้า spec ต้องการ "ให้ผู้ใช้รู้ว่ากำลังโหลด" นั่นคือ state-bound family ของผลิตภัณฑ์ (เช่น ijji four-beat) ที่ต้องมี status text และปุ่มยกเลิกจริง ไม่ใช่ motif กลาง
- ทุกหน้ามี motion ต้องมีปุ่มหยุดระดับหน้าหนึ่งปุ่ม และทำงานได้เมื่อปิด JavaScript / reduced motion (เฟรมสุดท้าย)

## 4. คำถาม review ที่ตัด defect ได้เร็ว

1. กราฟนี้ตอบคำถามอะไร หน่วยคืออะไร หน่วยหารอยู่ใน legend ไหม
2. surface นี้ใช้ตระกูลสีกี่ตระกูล โซนซ้ำไหม dark มาจาก registry ไหม
3. หมวดหมู่ผูกกับ id ไหม เรียงใหม่แล้วสีเปลี่ยนไหม ตั้งแต่หมวดที่ 7 มี shape cue ไหม
4. ทุก 0 คือศูนย์จริงหรือแค่ไม่มีข้อมูล
5. link preview บอกว่าจะเห็นอะไร มี source/date/limitation ไหม
6. motif แต่ละอันมี job และ beat ไหม รวมกันเกิน 3 ไหม อยู่นอกสามบริเวณต้องห้ามไหม และวางบนพื้นที่อนุญาตทั้งสองธีมไหม (ไม่มี full บน Brand Blue)
7. ถ้าปิด JavaScript หรือเปิด reduced motion หน้ายังครบไหม (เฟรมสุดท้าย, เนื้อหาไม่หาย)

## 5. ขอบเขตที่ product ต้องรักษา (Master Brand Brief v0.5.3)

- ป้ายสถานะผลิตภัณฑ์ใช้ชุดของ MBB §5.1 เท่านั้น: CityMETER และ CityChat = เข้าสู่ตลาดระยะแรก · ijji = กำลังสร้างตลาด · CityWiki = ลงทุนเชิงกลยุทธ์ · งานตามสัญญา/bespoke = สัญญาเดินอยู่ · ระบบข่าวกรองสินทรัพย์ = ดำเนินการจริงในเครือ
- LOI, ข้อเสนอ, test site, จำนวนผู้ทดลองใช้ ไม่ใช่ traction; ห้ามใส่ราคา สัญญา หรือ pipeline ในงานที่ออกนอกองค์กร
- SRI ไม่ใช่รายได้ · heatmap 7×24 เป็น daypart เชิงคุณภาพ · rating เป็น proxy ความนิยม · ราคาที่ดินไม่พิสูจน์รายได้ผู้อยู่อาศัย
- `locale_id` และ `venue_id` เป็น join key เดียว; ห้ามสรุป catchment จากชื่อ; ห้ามบวกค่าข้าม locale ก่อนมี geometry ที่ไม่ทับกัน

## 6. งานที่เหลือที่กระทบ roadmap (master §21)

ข้อที่เป็นของเจ้าของปิดแล้วเมื่อ 17 กันยายน 2569 (tolerance D-MID-01, exception duration, id MOTIF-01, ถ้อยคำ L3, layers บน canvas, ค่า density.area/age, LUT ของ warm lane) ที่เหลือ: product icon tiles รอ gradient ต่อผลิตภัณฑ์ · ทะเบียน CityChat ใน repo motif ยังติดป้าย candidate (DS อนุมัติที่ bytes commit a99f3c1e) · CityMETER/CityWiki stings รอ bytes จาก Studio 1.4 · การดูบนจอจริง (dark LUT, warm lane, slot 10 เขียว, motif บนพื้นจริง) · เรื่องที่ส่งกลับบอร์ด (LUT ของ warm lane ที่ผ่านหน้าต่าง earth ระหว่างขั้น, จำนวนค่าที่ audit 200 vs 180, ไฟล์จริงห้าไฟล์ของ delta, semantic.warning และ alias v5 ที่อยู่นอกขอบเขต DATAVIZ-04) · งานหลัง freeze (ลายเซ็น Ed25519 และ validator port เสร็จใน v0.9.4-mp1 แล้ว; ที่เหลือคือ semantic review สองภาษาของเจ้าของ, CityMETER Lab หัวข้อ 07, publish + ตรวจ live — `machine/release.json#/postApprovalFollowUps`) — งานที่พึ่งข้อใดข้อหนึ่งให้ระบุใน Build Card `assumptions` และ `blockingDependencyRefs`
