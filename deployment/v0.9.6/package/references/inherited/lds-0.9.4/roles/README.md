# roles/ — ทางเข้าตามบทบาทของ Landometer Design System 0.9.4 (v0.9.4-mp1 · มีผลบังคับใช้ตั้งแต่เซ็น 23 กันยายน 2569)

กติกาเดียว หลายทางเข้า: แต่ละคู่มือยาวหนึ่งหน้า บอกว่าต้องโหลดอะไร ทำอะไร ตรวจด้วยอะไร และห้ามอะไร ไม่มีใครต้องอ่าน master ทั้ง 1,900 บรรทัดก่อนเริ่มงาน master ยังเป็น authority เสมอ; คู่มือเป็นทางลัดที่ชี้กลับไปที่กฎ

One ruleset, many doors. Each guide is one page: what to load, what to do, what checks you, what you must not do. Nobody needs to read the 1,900-line master to start; the master stays the authority and every guide points back to it.

| ใคร | ไฟล์ | เวลาอ่าน |
|---|---|---|
| ทุกคน · everyone | `quick-start.md` | 5 นาที |
| AI / agent (Claude, Codex, ChatGPT, agent ภายใน) | `for-ai-agents.md` | โหลดก่อนทุกงาน LDS |
| Developer | `for-developers.md` | ก่อนเริ่ม build |
| Designer | `for-designers.md` + `lds-0.9.4.tokens.dtcg.json` | ก่อนเปิด Figma |
| Product | `for-product.md` | ก่อนเขียน Build Card หรือ spec |
| Marketing (ใหม่ตั้งแต่ 0.9.3) | `for-marketing.md` | ก่อนทำ landing, โพสต์ หรือ creative |
| Sales | `for-sales.md` | ก่อนส่งอะไรออกนอกองค์กร |

release tuple: 0.9.4 / 0.9.4-r2 / lds-rules-0.9.4 / v0.9.4-mp1 · สถานะ: active และ effective — เจ้าของอนุมัติ 2026-09-17T10:30:13+07:00 (`owner-message:2026-09-17:0.9.4-approval`) โดยมีเงื่อนไขว่าเกตทั้งหมดผ่าน (ผ่านแล้ว) และ release operator เซ็นแพ็กเกจ `v0.9.4-mp1` เมื่อ 2026-09-23T15:46:08+07:00 ด้วยกุญแจ `landometer.release.2026-09-23.01` (`machine/release.json#/release/frozenBy`) · 0.9.4-r2 คือ master ฉบับ freeze ข้อความกฎเท่ากับ 0.9.4-r1 ที่อนุมัติ · v0.9.1-mp7 เป็นรุ่นก่อนหน้า · candidate 0.9.2 ถูกถอน และ candidate 0.9.3-r1/r2 (`v0.9.3-mp1-candidate`) ถูกแทนที่: 0.9.4 = 0.9.3-r2 + delta ของบอร์ด 17 กันยายน 2569 (หน้าต่างสีที่ v0.9.0 ถอนแล้วเป็นเกต DATAVIZ-04, dark ของ warm lane คำนวณด้วยสูตรเฉพาะ, series v7 ที่ slot 10 เป็นสีเขียว, 26 ค่าเปลี่ยน, color-srgb-07)

ในคู่มือชุดนี้ `machine/` หมายถึงไฟล์ของแพ็กเกจที่เซ็นแล้ว v0.9.4-mp1 (บน Drive: `Landometer_Design_System/v0.9.4/machine/v0.9.4/`) วางข้าง `build-kit/` (จาก `archives/LDS-0.9.4-candidate-rekey.zip`) วางแบบนี้แล้วคำสั่งตรวจทุกคำสั่งในคู่มือรันได้ตามที่เขียน

Here `machine/` means the files of the signed package v0.9.4-mp1 (Drive: `Landometer_Design_System/v0.9.4/machine/v0.9.4/`) placed beside `build-kit/` (from `archives/LDS-0.9.4-candidate-rekey.zip`); with that layout every command below runs as written.

roles ฉบับ mp1 (24 กันยายน 2569) แก้เฉพาะสถานะ release, ชื่อและรูปคำสั่งตรวจ และเลขกฎที่อ้างผิดหนึ่งจุดใน description ของ `lds-0.9.4.tokens.dtcg.json` — ไม่แตะกฎหรือค่า

"มีความสุข" ในการบังคับใช้ (master §20) วัดจากสามอย่าง: เริ่มงานได้ในหนึ่งหน้าโดยไม่ต้องถามว่าไฟล์ไหนจริง · สิ่งที่ต้องทำมีของให้คัดลอก · ตัวตรวจบอกจุดแก้ก่อนส่ง
