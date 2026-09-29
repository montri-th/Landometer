# Landometer DS 0.9.5 — Project Source files

Release `v0.9.5-owner.1` · color registry `color-srgb-08` · owner-approved unsigned distribution. These links resolve to exact files in this published package. Download the eight files individually and upload the extracted `.md` and `.json` files into a ChatGPT Project's **Project Sources** only when that project cannot already read the verified LDS 0.9.5 plugin/skill files. A link alone, or an uploaded ZIP alone, is not a verified source installation.

| Role | Download | Bytes | SHA-256 |
|---|---|---:|---|
| 0.9.5 overlay | [GUIDE.md](./package/assets/lds-0.9.5/GUIDE.md) | 8,479 | `b890cd7d8e7b109b505bb237ac191116af01d587c74a8b837b95b8467f17fa55` |
| Current brand/voice contract | [BRAND.md](./package/assets/lds-0.9.5/brand/BRAND.md) | 5,206 | `cfff35e3774c17779101abcf05a473f9b302e3c4e82eee8133bb316743592ca9` |
| Inherited full normative master | [Landometer Design System v0.9.4.md](./package/references/inherited/lds-0.9.4/machine/Landometer%20Design%20System%20v0.9.4.md) | 360,440 | `8e6e89a52b6a1ba0dc3c39f4f51b6b82e84e1281811713bd14fd36ab0f2d1886` |
| Release identity and entrypoints | [release.json](./package/assets/lds-0.9.5/machine/release.json) | 2,537 | `9a2725d21927a19b0d78d04455ad95ad0e7571ce2d45d74da21a17786cc9e829` |
| Rule precedence and policy | [policy.json](./package/assets/lds-0.9.5/machine/policy.json) | 4,591 | `9a91a74a726e259adba1908043b3e11b203420b1f9cc0130bb5692705f2c1949` |
| Current design-token roles | [tokens.v0.9.5.json](./package/assets/lds-0.9.5/machine/tokens.v0.9.5.json) | 53,938 | `460e70d6e7c10e3ecd484056c6ae54cf7dc8a99865011be633834b3ba8c1e98b` |
| Exact categorical/foundation colors | [color-srgb-08.tokens.json](./package/assets/lds-0.9.5/machine/color-srgb-08.tokens.json) | 11,865 | `6f9f1ea5f946bc566bd6b736f0c9369344a264ef15ef31afe53dd23a58be102b` |
| Exact analytical scales | [color-srgb-08.scales.json](./package/assets/lds-0.9.5/machine/color-srgb-08.scales.json) | 108,435 | `ee00c547a19d08ba50d7ddaf3af287b8c52551415fa57bda52b41249f98e501f` |

## วิธีใช้ใน ChatGPT Project

1. ดาวน์โหลดทั้ง 8 ไฟล์จากตารางและอัปโหลดไฟล์ `.md`/`.json` เข้า Project Sources ทีละไฟล์ เมื่อ Project นั้นยังอ่าน plugin/skill 0.9.5 ที่ตรวจแล้วไม่ได้ การวางลิงก์หรืออัปโหลด ZIP อย่างเดียวไม่ใช่การเปิดใช้ที่ตรวจได้
2. กำหนด Project instructions ให้งานใหม่ใช้ `v0.9.5-owner.1`: กฎส่วนเพิ่มใน GUIDE, policy, BRAND และค่าสี machine ปัจจุบันมีลำดับเหนือกฎเดิมที่เปลี่ยนแล้ว ส่วน normative master 0.9.4 ยังคงใช้กับกฎที่ไม่ถูกแก้ งานที่ระบุรุ่นเก่าไว้ชัดเจนคงรุ่นเดิม และงานผลิตภัณฑ์ต้องอ่าน Add-on ของผลิตภัณฑ์นั้นด้วย
3. เปิดแชตใหม่ ทดสอบให้อ่าน release ID, ลำดับกฎ และค่า `density.capita` พื้นมืดจากไฟล์จริงได้ ก่อนค่อยถอด Project Source 0.9.1 ที่ขัดกัน เก็บงานเก่าที่ล็อกรุ่นไว้ใน Project แยกหากยังต้องใช้

## Rule order and migration

1. Use the 0.9.5 GUIDE, policy, brand contract and exact machine colors/scales for all changed rules. The inherited 0.9.4 normative master supplies the unchanged rules. Do not substitute the historical 0.9.1 master as the current authority. The 0.9.4 signature does not sign 0.9.5.
2. After these files are present, set the project's instructions to route new Landometer work to `v0.9.5-owner.1`, apply this precedence, preserve explicitly pinned historical releases, and require product-specific Add-ons where applicable. Review stale 0.9.1 sources before removing them; preserve a separate historical project if old receipts still need that release.
3. Start a new chat and check that it can name the release ID, distinguish 0.9.5 from the inherited base, and read exact `density.capita` dark-theme scale values from the uploaded file. Record this result for each project.

Project Source text improves retrieval but does not install the plugin's fonts, logos, CSS, validators or design-tool assets and cannot establish ChatGPT, Codex or Claude account/team activation. Use the [full package and platform guide](./team-setup.md) for those surfaces.
