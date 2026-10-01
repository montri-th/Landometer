# ข้อความ Discord · LDS 0.9.7

ข้อความพร้อมคัดลอกแยกช่อง ใช้ส่งเมื่อ release และดาวน์โหลดเผยแพร่แล้ว ไม่ใช่หลักฐานว่าทุกบัญชีติดตั้งแล้ว

## LDS / CityMETER / ทีมกลาง

**ประกาศใช้ Landometer Design System 0.9.7 — Landometer Story**

ทีมที่ทำงาน Landometer / CityMETER ช่วยอัปเดตชุดที่ใช้ใน ChatGPT, Claude Chat / Cowork / Design และ Code เป็น 0.9.7 ครับ

รุ่นนี้ปรับสีข้อมูลทั้ง 20 ตระกูลให้มีบุคลิกและความหมายชัดขึ้น โดยคงสีหลักหัว–กลาง–ท้าย 3 สี เพิ่มชุดสีเสริม Story รวม 17 ค่า และมี **Location Intelligence Profile แยก** สำหรับ 16 บทบาท: 12 metric ที่วัดได้ และ 4 มุมมอง SWOT ซึ่งไม่สร้าง gradient อัตโนมัติ

**สีข้อมูลและสีบทบาทใช้ HEX เดียวกันทั้งพื้นสว่างและมืด คงทิศทางค่าเดิม** ไม่ปรับสีหรือกลับสเกลตามธีม อ่านค่าจาก LUT / classes ที่ให้มาโดยตรง ความต่างจากพื้นแก้ด้วยขอบ ป้ายชื่อ หรือพื้นรอง สีทุกคู่ไม่ได้รับประกันว่าแยกได้สำหรับทุกคน จึงต้องคงชื่อ หน่วย และสัญลักษณ์ประกอบ

Brand Energy, brand voice, ฟอนต์ โลโก้ และ motif/animation คงกฎเดิม ส่วน categorical และสีอัตลักษณ์ยังใช้กฎธีมเฉพาะของตน

**ติดตั้งใน Project Sources / Files**

• งานทั่วไป: **LDS 0.9.7 ฉบับเต็ม 1 ไฟล์**
• งาน ijji / CityChat / CityWiki: เพิ่ม **Add-on ของผลิตภัณฑ์ที่จับคู่ 0.9.7**
• งาน Location Intelligence: เพิ่ม **Location Intelligence Profile** คู่กับ LDS และ Add-on ถ้ามี
• Markdown รวมกฎคนอ่านและข้อมูลเครื่องอ่านแล้ว ไม่ต้องเพิ่ม JSON ซ้ำหรืออ้าง master 0.9.4
• หลังตรวจไฟล์ใหม่แล้ว ให้นำกฎ DS/Add-on ที่ถูกแทนที่ออกจากแหล่ง active เก็บ brief, research, data และหลักฐานธุรกิจเดิม

ตั้ง Instructions: “ใช้ LDS 0.9.7 ฉบับเต็มที่แนบเป็นกฎกลาง และ Add-on / Location Intelligence Profile ตามงาน อ่านสีจากค่าจริง ใช้ HEX และทิศทางข้อมูลเดียวกันทั้งสองธีม คงชื่อ หน่วย ตัวหาร จุดศูนย์ และสถานะหลักฐาน ตรวจชิ้นงานก่อนส่งมอบ”

**คู่มือและสี:** https://montri-th.github.io/Landometer/v0.9.7/
**Story Atlas:** https://montri-th.github.io/Landometer/v0.9.7/color-atlas.html
**Location Intelligence:** https://montri-th.github.io/Landometer/v0.9.7/location/
**ดาวน์โหลด normative ตามงาน:** https://montri-th.github.io/Landometer/v0.9.7/project-source-0.9.7.md
**ติดตั้ง / assets / plugin:** https://montri-th.github.io/Landometer/v0.9.7/team-setup.md

เปิด session ใหม่แล้วให้ AI อ่านรุ่นจากไฟล์จริงและคืน water 7 classes ทั้งสองธีม ค่า HEX ต้องตรงกัน Plugin / Cowork / Code / Design ต้องอัปเดตชุดติดตั้งหรือ library ของช่องทางนั้นด้วย การอัปเดต Project หนึ่งไม่อัปเดตทุกบัญชีให้เอง งานเก่าที่ล็อกรุ่นยังเก็บไว้ตรวจย้อนหลังได้

## ijji

**ทีม ijji: ใช้ LDS 0.9.7 + ijji Add-on 0.5.5 คู่กันครับ**

ดาวน์โหลด 2 ไฟล์นี้ใส่ Project Sources / Files ของ ChatGPT และ Claude:

1. **LDS 0.9.7 ฉบับเต็ม** — กฎกลางและสี Story
https://montri-th.github.io/Landometer/v0.9.7/normative/Landometer-Design-System-v0.9.7.md
2. **ijji Add-on 0.5.5 for LDS 0.9.7** — กฎผลิตภัณฑ์แยกที่ผูกกับฐานใหม่
https://montri-th.github.io/Landometer/v0.9.7/normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.7.md

ตั้ง Instructions: “ใช้ LDS 0.9.7 ฉบับเต็มคู่กับ ijji Add-on ที่แนบ อ่านค่าจริงจากทั้งสองไฟล์ คง voice, identity และ motion ของ ijji ตาม Add-on ใช้สีข้อมูล HEX เดียวกันทั้งสองธีมและคงทิศทางค่า”

อัปเดต plugin / skill สำหรับ Cowork / Code และ library สำหรับ Design ตามคู่มือ ตรวจไฟล์ใหม่ก่อนนำ DS/Add-on เก่าออกจากแหล่ง active; เก็บ brief และข้อมูลธุรกิจไว้ Identity และ motion ของ ijji คงเดิม

ถ้าทำ Location Intelligence ให้เพิ่ม Profile เป็นไฟล์ที่ 3 เฉพาะงานนั้น:
https://montri-th.github.io/Landometer/v0.9.7/normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md

เปิด session ใหม่และให้ AI ยืนยันว่าอ่าน base + Add-on ได้จริง การเพิ่มไฟล์ใน Project ไม่อัปเดตเครื่องมืออื่นให้อัตโนมัติ

**คู่มือติดตั้ง:** https://montri-th.github.io/Landometer/v0.9.7/team-setup.md
**คู่มือ ijji:** https://montri-th.github.io/ijji/ijji-TH.dc.html

## CityChat

**ทีม CityChat: ใช้ LDS 0.9.7 + CityChat Add-on 0.9.2 คู่กันครับ**

ดาวน์โหลด 2 ไฟล์นี้ใส่ Project Sources / Files ของ ChatGPT และ Claude:

1. **LDS 0.9.7 ฉบับเต็ม** — กฎกลางและสี Story
https://montri-th.github.io/Landometer/v0.9.7/normative/Landometer-Design-System-v0.9.7.md
2. **CityChat Add-on 0.9.2 for LDS 0.9.7** — กฎผลิตภัณฑ์แยกที่ผูกกับฐานใหม่
https://montri-th.github.io/Landometer/v0.9.7/normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md

ตั้ง Instructions: “ใช้ LDS 0.9.7 ฉบับเต็มคู่กับ CityChat Add-on ที่แนบ อ่านค่าจริงจากทั้งสองไฟล์ คง voice, identity และ motion ของ CityChat ตาม Add-on ใช้สีข้อมูล HEX เดียวกันทั้งสองธีมและคงทิศทางค่า”

อัปเดต plugin / skill สำหรับ Cowork / Code และ library สำหรับ Design ตามคู่มือ ตรวจไฟล์ใหม่ก่อนนำ DS/Add-on เก่าออกจากแหล่ง active; เก็บ brief และข้อมูลธุรกิจไว้ Identity และ motion ของ CityChat คงเดิม

ถ้าทำ Location Intelligence ให้เพิ่ม Profile เป็นไฟล์ที่ 3 เฉพาะงานนั้น:
https://montri-th.github.io/Landometer/v0.9.7/normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md

เปิด session ใหม่และให้ AI ยืนยันว่าอ่าน base + Add-on ได้จริง การเพิ่มไฟล์ใน Project ไม่อัปเดตเครื่องมืออื่นให้อัตโนมัติ

**คู่มือติดตั้ง:** https://montri-th.github.io/Landometer/v0.9.7/team-setup.md
**คู่มือ CityChat:** https://montri-th.github.io/CityChat/
