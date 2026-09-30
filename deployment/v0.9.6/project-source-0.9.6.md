# LDS v0.9.6 ฉบับเต็ม + Product Add-on

ใช้โครงเอกสารเดิมของ 0.9.1 โดยปรับกฎทุกหมวดเป็น 0.9.6 แล้ว พร้อม machine JSON ในไฟล์เดียว ไม่ต้องประกอบ 0.9.4 + overlay หรือชุด 8 ไฟล์อีก

**งานทั่วไปใช้ LDS ฉบับเต็มหนึ่งไฟล์ งานผลิตภัณฑ์ใช้ LDS ฉบับเต็มคู่กับ Add-on แยกไฟล์ รวมสองไฟล์** ijji ใช้ LDS + ijji Add-on; CityChat ใช้ LDS + CityChat Add-on; CityWiki ใช้ LDS + Add-on ของตน ไม่รวมกฎกลางซ้ำในไฟล์ผลิตภัณฑ์ ส่วน JSON เป็นทางเลือกของเอกสารแต่ละฉบับ ไม่ต้องอัปโหลดซ้ำกับ Markdown

| งาน | ดาวน์โหลดสำหรับคน + AI | ทางเลือกสำหรับเครื่อง | Bytes (.md) | SHA-256 (.md) |
|---|---|---|---:|---|
| Landometer Design System v0.9.6 | [ดาวน์โหลด .md](./normative/Landometer-Design-System-v0.9.6.md) | [JSON](./normative/Landometer-Design-System-v0.9.6.json) | 1,122,346 | `c2bed69f48a1fc3c23df1e8010684578bfcf5ef33701a819f65abf18542a3c91` |
| ijji Add-on v0.5.5 for LDS v0.9.6 | [ดาวน์โหลด .md](./normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.6.md) | [JSON](./normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.6.json) | 227,830 | `8b8fe59105252db5a25f0bcb1ef7c65eafe29220cba503697979a44661e467b2` |
| CityChat Add-on v0.9.2 for LDS v0.9.6 | [ดาวน์โหลด .md](./normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.6.md) | [JSON](./normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.6.json) | 24,010 | `ec4f443fd877b09160ec134a69e186e17c00463836c195cf7f5b35c1c260fed4` |
| CityWiki Add-on v1.0.0 for LDS v0.9.6 | [ดาวน์โหลด .md](./normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.6.md) | [JSON](./normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.6.json) | 64,342 | `e92e6778b300bb4111bda0bc2831cb545bc1e17be896b5a5f30cbe8859fc42f3` |

## ติดตั้งใน ChatGPT หรือ Claude Project

1. อัปโหลด LDS ฉบับเต็มเข้า Project Sources / Files / Knowledge แล้วเพิ่ม Add-on แยกไฟล์เฉพาะผลิตภัณฑ์ที่ทำงาน
2. ตั้ง Project Instructions ให้ LDS เป็นกฎกลางและ Add-on เป็นกฎเฉพาะผลิตภัณฑ์ตาม scope ไม่ต้องใช้ master 0.9.4 หรือ overlay รุ่นก่อน
3. ยกเลิกเอกสาร DS/add-on รุ่นก่อนและชุด 8 ไฟล์เดิมจากแหล่งกฎปัจจุบัน เก็บ brief, research, data, evidence และข้อกำหนดธุรกิจที่ไม่ถูกแทนที่ไว้ ประวัติที่ล็อกรุ่นใช้เฉพาะเมื่อผู้ใช้ระบุ
4. เปิด session ใหม่ ทดสอบ documentId, releaseRef, colorSetId และค่า density.capita dark 7 classes จาก LDS รวมทั้งกฎเฉพาะผลิตภัณฑ์จาก Add-on ตรวจว่าอ่านไฟล์จริงทั้งคู่ในงานผลิตภัณฑ์

Revision: `standalone-0.9.6-r1` · approved design values: `v0.9.6-owner.1 / color-srgb-09` · unsigned owner distribution. LDS ฉบับเต็มรวมกฎกลางและค่าจริงครบในหนึ่งไฟล์; Add-on แยกไฟล์ให้กฎเฉพาะผลิตภัณฑ์; font/logo/runtime binaries ใช้ assets จริงที่ระบุ URL และ hash ไว้ในเอกสาร ดาวน์โหลดชุดติดตั้งจาก [คู่มือทีม](./team-setup.md)
