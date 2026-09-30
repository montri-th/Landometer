# เปิดใช้ Landometer Design System 0.9.5

ใช้ release เดียวกันทั้งทีม: คู่มือสำหรับคน + token/gradient + ฟอนต์/โลโก้ + skill + ตัวตรวจ ไม่ต้องคัดสีเอง คู่มือนี้อธิบายวิธีเปิดใช้ ไม่ใช่หลักฐานว่าทุกบัญชีติดตั้งแล้ว

## Project Source — LDS หนึ่งไฟล์ · งานผลิตภัณฑ์ใช้สองไฟล์คู่กัน

อัปโหลด `Landometer-Design-System-v0.9.5.md` ฉบับเต็มจาก [หน้าดาวน์โหลด normative](https://montri-th.github.io/Landometer/v0.9.5/project-source-0.9.5.md) เข้า Project Sources / Files / Knowledge ทุก Project ที่ใช้ LDS งาน ijji ให้เพิ่ม `ijji-Add-on-v0.5.5-for-LDS-v0.9.5.md`; งาน CityChat ให้เพิ่ม `CityChat-Add-on-v0.9.2-for-LDS-v0.9.5.md` เป็น **สองไฟล์คู่กัน** CityWiki ใช้ LDS คู่กับ Add-on ของตนเช่นกัน

LDS เป็นกฎกลางฉบับเต็มตามโครง 0.9.1 ที่อัปเดตเป็น 0.9.5; Add-on แยกเป็นกฎผลิตภัณฑ์ ไม่รวม LDS ซ้ำ ทั้งสองมีข้อมูลคนและเครื่อง ไม่ต้องใช้ master 0.9.4, overlay รุ่นก่อน หรือชุด 8 ไฟล์ JSON เป็นทางเลือกแทน Markdown ของเอกสารนั้น ไม่ต้องอัปโหลดทั้งสองรูปแบบ

ตั้ง Instructions ให้ยึด LDS ฉบับนี้และ Add-on ตาม scope แล้วลบหรือยกเลิก DS/add-on revision เก่าที่ถูกแทนที่ เก็บ brief, research, data, evidence และข้อกำหนดธุรกิจไว้ เปิดแชตใหม่ทดสอบให้อ่าน documentId, releaseRef, ค่าสีจริงจาก LDS และกฎ product/voice/motion จากเอกสารที่เกี่ยวข้อง พร้อมตรวจชิ้นงานจริงก่อนส่งมอบ

## เริ่มใช้ในเครื่อง — Codex และ Claude Code

ดาวน์โหลดหรือ clone repository ที่ tag `v0.9.5-standalone-r3-docs1` หรือ commit ที่ตรงกันของ DS 0.9.5 แล้วเปิดโฟลเดอร์นั้น ต้องมี Python 3 และ Node.js:

```sh
python3 tools/install-lds095.py
python3 tools/install-lds095.py --apply
```

คำสั่งแรกแสดงแผนโดยไม่แก้ไขไฟล์ คำสั่งที่สองตรวจ package แล้วติดตั้งสำเนาจากชุดเดียวกันใน `~/.agents/skills/apply-landometer-design-system` และ `~/.claude/skills/apply-landometer-design-system` พร้อมเพิ่มคำแนะนำให้เลือก 0.9.5 สำหรับงาน Landometer ใหม่ หากต้องการเฉพาะเครื่องมือเดียว ใช้ `--targets codex` หรือ `--targets claude` ได้

ตัวติดตั้งสำรองไฟล์ที่เปลี่ยนใน `~/.local/state/landometer-ds/backups/` เก็บ receipt ที่ `~/.local/state/landometer-ds/install-0.9.5.json` และเก็บชุด 0.9.4 / 0.9.1 ไว้ตรวจงานประวัติ ไม่แก้ signed asset ของรุ่นเก่า การรันซ้ำบนชุดเดิมไม่สร้างการเปลี่ยนแปลงใหม่

เปิด session ใหม่แล้วทดลอง prompt ด้านล่าง การติดตั้งในเครื่องไม่ครอบคลุม ChatGPT workspace หรือ Claude Cowork ซึ่งใช้การติดตั้งของบัญชีแยกกัน [ขอบเขต ChatGPT](https://learn.chatgpt.com/docs/enterprise/skills), [ขอบเขต Claude](https://code.claude.com/docs/en/skills)

## ChatGPT ของทีม — ผู้ดูแล workspace

1. เปิด **Admin → Plugins → Add → Import marketplace** ใช้ Source `https://github.com/montri-th/Landometer` โดย marketplace อยู่ที่ repository root (`.agents/plugins/marketplace.json`); ไม่ใส่ชื่อไฟล์ในช่อง Path
2. เลือก tag/commit ของ DS 0.9.5 ตรวจผล import แล้วตั้ง **Installation policy → Installed** ให้ role ที่ทำงาน Landometer
3. ทดสอบทั้ง Chat และ Work ใน session ใหม่ของสมาชิกจริง บันทึก version/hash และไฟล์ที่อ่านได้ หลังอัปเดตใช้ **Sync now** และทดสอบซ้ำ

นโยบายในไฟล์ repository ไม่ได้ตั้งค่า workspace ให้โดยอัตโนมัติ ผู้ดูแลต้องกำหนดนโยบายใน UI เอง [วิธีของ OpenAI](https://learn.chatgpt.com/docs/enterprise/plugin-management)

## Claude Chat / Cowork / Code ของทีม — Owner หรือผู้ดูแลที่ได้รับสิทธิ์

1. เปิด **Organization settings → Plugins & skills** อัปโหลด plugin ZIP ที่สร้างจากโฟลเดอร์ `plugins/landometer-design-system` ของ release นี้
2. ใน **Inventory → Default access → Install** เลือก **Required** สำหรับกลุ่มที่ต้องใช้
3. เปิด session ใหม่ ทดสอบ Chat, Cowork และ Code ที่เข้าบัญชีองค์กรเดียวกัน และบันทึกผลจริง

สำหรับ GitHub sync ขององค์กร marketplace repository ต้อง private/internal; ถ้าใช้ repository Landometer ที่เป็น public ให้ใช้ ZIP หรือ private marketplace ที่มีอยู่ [วิธีของ Anthropic](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization)

บัญชีส่วนตัวให้เพิ่ม skill/plugin ใน Claude account แล้วทดสอบ Cowork แยกต่างหาก การคัดลอก `~/.claude/skills` ใช้กับ Claude Code ในเครื่องเท่านั้น

## Claude Design — ผู้ดูแลแบรนด์

นำเข้า LDS normative ฉบับเต็มพร้อม Product Add-on ที่เกี่ยวข้องจาก `assets/lds-0.9.5/normative/` พร้อม `machine/color-srgb-08.production.css`, ฟอนต์/โลโก้จาก `build-kit/assets/` และ atlas ที่อนุมัติ ข้อมูล tokens, สี, scales และ schemas รวมอยู่ใน normative แล้ว ใช้ `scripts/read-normative.mjs` เพื่ออ่าน structured contracts ของฉบับปัจจุบัน จากภายใน plugin เดียวกัน

ตรวจค่าที่ Claude ดึงเข้า โดยเฉพาะ density ทั้ง 4 โทน, categorical พื้นมืด, ฟอนต์/โลโก้ และ gradient แบรนด์เดิม จากนั้น Publish และตั้งเป็น **organization default** ให้ผู้ดูแลแบรนด์รับผิดชอบการเปลี่ยนค่าเริ่มต้น Design System ต้องเปิดใช้แยกจาก plugin และค่าที่ดึงอัตโนมัติต้องตรวจเทียบไฟล์ต้นทาง [นำเข้า Design System](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design), [จัดการค่าเริ่มต้น](https://support.claude.com/en/articles/16994751-artifacts-admin-guide-for-team-and-enterprise-plans)

## ทดลองว่าอ่านของจริงได้

> ใช้ Landometer DS 0.9.5 สร้าง preview density 4 ตัวหารบนพื้นสว่างและมืด พร้อม categorical dark soft/vivid บอก release ID และ SHA-256 ของ release.json ที่อ่าน ใช้สีจาก lookup table โดยตรง แล้วรายงานว่าตรวจอัตโนมัติอะไรผ่านและอะไรยังต้องดูด้วยคน

ดูว่าเครื่องมืออ่านไฟล์ได้จริง ไม่ใช่เพียงจำชื่อรุ่น ทดสอบชิ้นงานด้วยตัวตรวจของ package และดูภาพตามขนาดใช้งานจริง เก็บ [แบบบันทึกผล](activation-receipt.template.json) แยกต่อบัญชี/ช่องทาง

## บังคับใช้ที่จุดส่งงาน

คำแนะนำและ Required/default ช่วยให้ทีมมีชุดเดียวกันพร้อมใช้ ส่วนความถูกต้องต้องตรวจที่ชิ้นงาน ให้ CI เรียกตัวตรวจ package และตัวตรวจ artifact ที่เกี่ยวข้องก่อน merge/release และให้ผู้ดูแล repository กำหนด checks ที่ต้องผ่านใน branch protection/ruleset การเขียน workflow ลง repository อย่างเดียวยังไม่พิสูจน์ว่าตั้ง required check แล้ว

Brand voice, ความหมายของข้อมูล, การเข้าถึงได้ และองค์ประกอบภาพต้องตรวจโดยคนประกอบ ไม่มีการตั้งค่าเดียวที่รับรองทุกคำตอบของทุกแพลตฟอร์มได้
