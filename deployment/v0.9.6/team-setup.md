# LDS 0.9.6 — เปิดใช้สำหรับทีม

ใช้ LDS ฉบับเต็ม 0.9.6 และ Color Set 09 ชุดเดียวกันทั้งทีม การเผยแพร่ไฟล์ไม่ได้อัปเดตสำเนาในทุกบัญชีโดยอัตโนมัติ

## ดาวน์โหลด

- [LDS ฉบับเต็ม .md](https://montri-th.github.io/Landometer/v0.9.6/normative/Landometer-Design-System-v0.9.6.md) — human + machine readable ในไฟล์เดียว
- [Product Add-ons แยกและรายการไฟล์](https://montri-th.github.io/Landometer/v0.9.6/project-source-0.9.6.md)
- [แพ็กเกจ assets + plugin](https://github.com/montri-th/Landometer/releases/tag/v0.9.6)
- [ดูคู่มือและสีจริง](https://montri-th.github.io/Landometer/v0.9.6/)

## ChatGPT และ Claude Projects

1. เพิ่ม `Landometer-Design-System-v0.9.6.md` เข้า Project Sources / Files / Knowledge
2. งาน ijji เพิ่ม `ijji-Add-on-v0.5.5-for-LDS-v0.9.6.md`; CityChat เพิ่ม `CityChat-Add-on-v0.9.2-for-LDS-v0.9.6.md`; CityWiki เพิ่ม `CityWiki-Add-on-v1.0.0-for-LDS-v0.9.6.md` เป็นสองไฟล์คู่กัน กฎผลิตภัณฑ์ยังเป็นรุ่นเดิม แต่ผูกกับ LDS base ใหม่
3. อัปเดต Instructions ให้ยึด LDS 0.9.6 เป็นกฎกลางและ Add-on เฉพาะผลิตภัณฑ์ ยกเลิกอำนาจของ DS/Add-on สำเนาก่อนหน้าที่ถูกแทนที่ เก็บ brief, research, data, evidence และข้อกำหนดธุรกิจไว้ ประวัติที่ล็อกรุ่นใช้เฉพาะเมื่อระบุ
4. เปิดแชตใหม่แล้วทดสอบให้อ้างไฟล์จริง: `lds-0.9.6-landometer-standalone-r1`, `v0.9.6-owner.1`, `color-srgb-09` และ count light anchors `#F2F1DF → #6FC25D → #005182` งานผลิตภัณฑ์ต้องอ่าน Add-on คู่กันด้วย

Markdown มี machine JSON ในตัวแล้ว ไม่ต้องเพิ่ม JSON ซ้ำ ไม่ต้องใช้ normative 0.9.4 หรือ 0.9.5 ประกอบ Binary fonts, logos และ runtime assets ใช้จากแพ็กเกจเต็มตาม URL/hash ที่อยู่ใน normative

## Codex / Claude Code ในเครื่อง

ใช้ repository ที่ tag `v0.9.6` และรัน:

```sh
python3 tools/install-lds096.py
python3 tools/install-lds096.py --apply
```

ตัวติดตั้งตรวจแพ็กเกจก่อน สำรองไฟล์ที่แทนที่ และติดตั้งเฉพาะ LDS skill กับส่วนคำแนะนำที่จัดการไว้ใน Codex/Claude Code ใช้ `--targets codex` หรือ `--targets claude` เพื่อเลือกเครื่องมือ รันใน `--home <isolated-directory>` เพื่อทดสอบก่อนใช้จริงได้

สำรองอยู่ที่ `~/.local/state/landometer-ds/backups/` และ receipt ที่ `~/.local/state/landometer-ds/install-0.9.6.json` การติดตั้งในเครื่องไม่ใช่การติดตั้ง ChatGPT workspace หรือ Claude Chat/Cowork ของบัญชี

## Plugin / Chat / Cowork / Design

ใช้ [คู่มือเปิดใช้แต่ละช่องทาง](./package/docs/activation-th.md) เพื่ออัปเดต plugin เดิมเป็น 0.9.6 และนำเข้าแหล่งกฎของ Design ด้วยไฟล์เดียวกัน ไม่มีการเปลี่ยนสิทธิ์จากไฟล์ marketplace โดยอัตโนมัติ ผู้ดูแลตรวจขอบเขตการติดตั้งของทีมตาม UI จริง

Claude Design ใช้ normative ฉบับเต็ม + Add-on ที่เกี่ยวข้อง พร้อม production CSS, font/logo และ assets จริง ตรวจค่าที่นำเข้าและแสดงผลก่อน publish library เดิมเป็นรุ่นปัจจุบัน

## ตรวจผลและขอบเขต

ทดสอบใน session ใหม่ของแต่ละช่องทาง บันทึก version/hash, อ่าน source ได้จริงหรือไม่ และชิ้นงานที่สร้าง การเห็นชื่อไฟล์เพียงอย่างเดียวไม่ยืนยันว่าทุกงานจะทำตามกฎ

ตรวจ gradient ทางเดียว 14 ชุดทั้ง light/dark, 3/5/7/9 classes, denominator, zero/no-data และกฎ voice/identity/motion ที่สืบทอด Package validation, runtime rendering และการเปิดใช้ในบัญชีเป็นคนละหลักฐาน ไม่อ้างการติดตั้งในบัญชีเพื่อนร่วมทีมที่ไม่ได้ตรวจ

## ย้อนกลับ

ปิด session ที่ใช้ชุดใหม่แล้วคืนเฉพาะไฟล์ตาม receipt จาก backup หรือเลือก 0.9.5 แบบล็อกรุ่นให้ชัดเจน ไม่ลบ skill root หรือ Project ทั้งก้อน ไม่แก้ immutable release เดิม
