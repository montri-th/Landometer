# LDS v0.9.5 ฉบับเต็ม + Product Add-on

ใช้โครงเอกสารเดิมของ 0.9.1 โดยปรับกฎทุกหมวดเป็น 0.9.5 แล้ว พร้อม machine JSON ในไฟล์เดียว ไม่ต้องประกอบ 0.9.4 + overlay หรือชุด 8 ไฟล์อีก

**งานทั่วไปใช้ LDS ฉบับเต็มหนึ่งไฟล์ งานผลิตภัณฑ์ใช้ LDS ฉบับเต็มคู่กับ Add-on แยกไฟล์ รวมสองไฟล์** ijji ใช้ LDS + ijji Add-on; CityChat ใช้ LDS + CityChat Add-on; CityWiki ใช้ LDS + Add-on ของตน ไม่รวมกฎกลางซ้ำในไฟล์ผลิตภัณฑ์ ส่วน JSON เป็นทางเลือกของเอกสารแต่ละฉบับ ไม่ต้องอัปโหลดซ้ำกับ Markdown

| งาน | ดาวน์โหลดสำหรับคน + AI | ทางเลือกสำหรับเครื่อง | Bytes (.md) | SHA-256 (.md) |
|---|---|---|---:|---|
| Landometer Design System v0.9.5 | [ดาวน์โหลด .md](./normative/Landometer-Design-System-v0.9.5.md) | [JSON](./normative/Landometer-Design-System-v0.9.5.json) | 1,116,504 | `164dbb5566107a4a0d09ebebbf8f00c1c0b89c53af3be6967e2fcd9caa95d4ee` |
| ijji Add-on v0.5.5 for LDS v0.9.5 | [ดาวน์โหลด .md](./normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.5.md) | [JSON](./normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.5.json) | 227,488 | `15342baba840fa1757551187bae9cab2ad325364ea98d472b14590ce2bd46512` |
| CityChat Add-on v0.9.2 for LDS v0.9.5 | [ดาวน์โหลด .md](./normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.5.md) | [JSON](./normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.5.json) | 23,658 | `0f4e375cfc761b238b77cbfcf75fc15f583b2cd5fee181714ae590c7897c12c8` |
| CityWiki Add-on v1.0.0 for LDS v0.9.5 | [ดาวน์โหลด .md](./normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.5.md) | [JSON](./normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.5.json) | 63,980 | `9e15b00debddeb0070ec5741a3a9cb1504d7cd6c79a5d1d7da3cacaf9daada51` |

## ติดตั้งใน ChatGPT หรือ Claude Project

1. อัปโหลด LDS ฉบับเต็มเข้า Project Sources / Files / Knowledge แล้วเพิ่ม Add-on แยกไฟล์เฉพาะผลิตภัณฑ์ที่ทำงาน
2. ตั้ง Project Instructions ให้ LDS เป็นกฎกลางและ Add-on เป็นกฎเฉพาะผลิตภัณฑ์ตาม scope ไม่ต้องใช้ master 0.9.4 หรือ overlay รุ่นก่อน
3. ยกเลิกเอกสาร DS/add-on รุ่นก่อนและชุด 8 ไฟล์เดิมจากแหล่งกฎปัจจุบัน เก็บ brief, research, data, evidence และข้อกำหนดธุรกิจที่ไม่ถูกแทนที่ไว้ ประวัติที่ล็อกรุ่นใช้เฉพาะเมื่อผู้ใช้ระบุ
4. เปิด session ใหม่ ทดสอบ documentId, releaseRef, colorSetId และค่า density.capita dark 7 classes จาก LDS รวมทั้งกฎเฉพาะผลิตภัณฑ์จาก Add-on ตรวจว่าอ่านไฟล์จริงทั้งคู่ในงานผลิตภัณฑ์

Revision: `standalone-0.9.5-r3` · approved design values: `v0.9.5-owner.1 / color-srgb-08` · unsigned owner distribution. LDS ฉบับเต็มรวมกฎกลางและค่าจริงครบในหนึ่งไฟล์; Add-on แยกไฟล์ให้กฎเฉพาะผลิตภัณฑ์; font/logo/runtime binaries ใช้ assets จริงที่ระบุ URL และ hash ไว้ในเอกสาร ดาวน์โหลดชุดติดตั้งจาก [คู่มือทีม](./team-setup.md)
