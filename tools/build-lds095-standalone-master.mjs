#!/usr/bin/env node
/** Deterministic in-place consolidation of the full LDS human master.
 * Never edits the immutable predecessor. Source authority and every replaced
 * range are recorded beside the generated human master for review.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = 'plugins/landometer-design-system';
const source = `${rel}/references/inherited/lds-0.9.4/machine/Landometer Design System v0.9.4.md`;
const inputs = `${rel}/references/standalone-master`;
const output = `${inputs}/Landometer-Design-System-v0.9.5.human.md`;
const sourceBytes = fs.readFileSync(path.join(root, source));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const expected = '8e6e89a52b6a1ba0dc3c39f4f51b6b82e84e1281811713bd14fd36ab0f2d1886';
if (sha(sourceBytes) !== expected) throw new Error('Frozen source differs from the reviewed master');
let text = sourceBytes.toString('utf8');
const operations = [];
const fragment = name => fs.readFileSync(path.join(root, inputs, `${name}.md`), 'utf8').trimEnd() + '\n\n';
function replaceRange(start, end, name) {
  const a = text.indexOf(start), b = end === null ? text.length : text.indexOf(end, a + start.length);
  if (a < 0 || b < 0 || text.indexOf(start, a + 1) >= 0) throw new Error(`Non-unique/missing range ${name}`);
  const old = text.slice(a, b), next = fragment(name);
  operations.push({type:'range',name,start,end,sourceSha256:sha(old),replacementSha256:sha(next)});
  text = text.slice(0, a) + next + text.slice(b);
}
function exact(old, next, label, all = false) {
  const count = text.split(old).length - 1;
  if (!count || (!all && count !== 1)) throw new Error(`Expected ${all?'at least one':'one'} match: ${label} (${count})`);
  text = all ? text.split(old).join(next) : text.replace(old,next);
  operations.push({type:'replacement',label,count,old,next});
}
replaceRange('# Landometer Design System v0.9.4','## 1. วิธีอ่านและบังคับใช้','release');
replaceRange('**EVID-05 —','**EvidenceCard**','evidence');
replaceRange('**COLOR-01 —','#### Canonical brand และ energy colors','color');
replaceRange('**DATAVIZ-02 —','**MAP-01 —','dataviz');
replaceRange('### 14.5 Release activation','## 15. Migration','activation');
replaceRange('## 15. Migration','## 16. Learning','migration');
replaceRange('## 17. Package inventory','### 17.1 Artifact manifest contract','inventory');
replaceRange('## 20. Roles:','## 21. คำตัดสิน','roles');
replaceRange('## 21. คำตัดสิน',null,'followups');

exact('ค่าทุกช่องต้องถือหนึ่งในห้าสถานะของ EVID-05 ด้านล่าง','ค่าทุกช่องต้องถือหนึ่งในหกสถานะของ EVID-05 ด้านล่าง','six-state introduction');
exact('ห้าสถานะของค่าตาม EVID-05 (`measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`)','หกสถานะของค่าตาม EVID-05 (`measured`, `measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`)','map six states');
exact('enum ห้าค่าของ EVID-05','enum หกค่าของ EVID-05','map enum');
exact('เพิ่ม prop `cellStates` enum ห้าค่า','prop `cellStates` uses all six EVID-05 states','component six-state enum');
exact('v0.9.4 เพิ่ม governed component contracts ห้ารายการ','Current governed component contracts ห้ารายการ','current component contract framing');
exact('Creative bytes MUST decode เป็น canvas 1080 × 1080 ตาม target profile ไม่ใช่เชื่อ metadata declaration อย่างเดียว','Creative bytes MUST decode เป็น canvas ตรง selected target profile: 1080 × 1080 สำหรับ square หรือ 1200 × 630 สำหรับ OG ไม่ใช่เชื่อ metadata declaration หรือ raster header อย่างเดียว','social two decoded targets');
exact('`social-sidecar.schema.json` v1.2','current `social-sidecar.schema.json` in `machine.schemas`','current social schema');
exact('15. dark anchors ที่ใช้ทุกค่าเท่ากับผลของสูตร DATAVIZ-03 และ `contrast-evidence.json` ที่ใหม่กว่า token/CSS ที่ ship (GATE-01)','15. LUT, class indices และ categorical values ตรง approved theme-specific records ทุกค่า; domain, denominator, thresholds และ outlier policy ตรง renderer/legend/accessible table/export; ตรวจทั้งสองธีมตาม GATE-01','AI analytical plan');
exact('| QG-12 data colour (GATE-01) | `contrast-evidence.json` ของ release ผ่านทุกเกตทั้งสองธีมโดยมีเฉพาะ exception ที่ประกาศ; dark override ในหน้าเท่ากับผลของสูตร DATAVIZ-03 (warm lane ใช้สูตรของ lane); ทุก `--scale-*`/`--series-*` ของหน้าอยู่นอกหน้าต่างสีที่ถอนแล้ว (DATAVIZ-04) |','| QG-12 data colour (GATE-01) | Exact LUT/class/series parity ทั้งสองธีม, 41 samples ต่อ family/theme, approved step/hue checks และ evidence ที่ bind hashes ของค่าที่ส่งจริง; ไม่มี runtime interpolation หรือ alias ที่ห้ามใช้; contrast/legend/CVD และขนาดจริงตรวจแยกใน artifact |','current QG12');
exact('- dataviz/data states (v0.9.4): dark anchors equal the DATAVIZ-03 derivation (warm lane by its own formula) or a declared exception, no analytical value inside a retired hue window (DATAVIZ-04), GATE-01 evidence current, scale family per zone, series variant vs energy accent on the same surface, five value states rendered and labelled, no 0/null without state in machine output','- dataviz/data states: exact approved theme LUTs and class indices, no analytical sample inside an applicable retired hue window, current GATE-01 evidence, scale family per analytical surface/zone, series variant versus energy accent, six labelled value states, and no numeric/null machine value without its state','current test matrix');
exact('14. (v0.9.4) every chart or map resolves its scale families per zone and its series variant, every 0 or empty value carries one of the five states, and no machine payload emits 0/null without a state','14. Every chart or map resolves its scale families per analytical surface/zone and series variant; every governed value carries one of the six EVID-05 states, with finite nonzero/zero/null machine values as defined.','current DoD values');
exact('every dark scale anchor equals its DATAVIZ-03 derivation (or a declared exception), no analytical anchor or series value sits in a retired hue window (DATAVIZ-04), and the release\'s GATE-01 evidence is newer than the tokens and CSS it covers','every delivered scale sample/class and series value equals the approved theme-specific record, no analytical value sits in an applicable retired hue window (DATAVIZ-04), and GATE-01 evidence binds the exact delivered asset hashes','current DoD color');
exact('- package ไม่ bundle trust anchor ที่ให้อำนาจตัวเอง `SHA256SUMS.txt` cover authoritative package files ทุกไฟล์ ยกเว้น checksum file เองและ detached `package-root.attestation.json` เพื่อหลีกเลี่ยง circular hash; validator MUST verify root signature ด้วย external `package_release` trust store + external caller-pinned policy ก่อนเชื่อ release หรือทำ downstream validation','- This release is an unsigned owner-approved distribution. Its package checksum and exact source parity MUST be verified when execution is available; these checks do not create a cryptographic signature or authorize artifact promotion. Historical signatures authenticate only their original subjects. A consumer requiring signed package authority MUST report that requirement unsatisfied for this distribution. The package MUST NOT create a trust anchor that authorizes itself.','unsigned current package boundary');
exact('Owner-recorded bilingual semantic review ของ release นี้เป็นคำตัดสิน authoritative ว่า Thai human rule และ English machine projection มี meaning เดียวกัน Validator ตรวจได้เฉพาะ rule ID, title และ acceptance-ID structure; ผลผ่านของ validator MUST NOT ถูกอ้างว่าได้ตรวจความหมายหรือคุณภาพภาษาแล้ว การแก้คำ normative ภาษาไทยหรืออังกฤษหลัง owner review—even เมื่อตั้งใจให้เป็น editorial—ทำให้ semantic review เดิมใช้ไม่ได้ และ MUST มี owner-recorded bilingual semantic review ใหม่ก่อน freeze/release','Owner-recorded bilingual semantic review applies only to the exact reviewed text and machine projection. This consolidated document preserves current obligations and records the source and changed ranges; generation or automated parity MUST NOT be presented as a fresh owner bilingual review. Validator ตรวจได้เฉพาะสิ่งที่รายงานว่าตรวจจริง; ผลผ่าน MUST NOT ถูกอ้างว่าได้ตรวจความหมายหรือคุณภาพภาษาแล้ว การเปลี่ยน normative meaning หลัง owner review ต้องมี owner-recorded review ใหม่ก่อนอ้าง semantic approval.','truthful parity review');
exact('**LAYOUT-01 — Layout preserves hierarchy across formats.** Composition MUST รักษา primary reading path, responsive/page-safe gutters, deliberate density และความสัมพันธ์ที่รับรู้ได้ระหว่าง question, evidence, interpretation และ next action','**LAYOUT-01 — Layout preserves hierarchy across formats.** Composition MUST รักษา primary reading path, responsive/page-safe gutters, deliberate density และความสัมพันธ์ที่รับรู้ได้ระหว่าง question, evidence, interpretation และ next action\n\nSelected navigation, tabs, cards and callouts MUST NOT use decorative bracket-shaped highlights or colored left-rail accents. Use restrained background, text weight and spacing. Keep visible keyboard focus outlines and meaningful chart/table borders. Review actual rendered Thai/English text at narrow and desktop widths, including every newly added section, for squeezed headings and overlapping siblings; token/hash checks do not establish readable composition.','owner visual preference');
exact('Browser runtime เท่านั้น: หนึ่ง document root ใช้ shared IntersectionObserver หนึ่งตัว; ตั้งแต่ v0.9.4 approach reveal เล่นซ้ำเมื่อ element กลับเข้า viewport (replay on re-entry ตาม OWNER-MOTION-01) แทน once-only unobserve แต่ไม่วนซ้ำขณะ element ยังอยู่นิ่งในจอ เพราะ content reveal ที่วนจะกลายเป็น perpetual flicker ซึ่ง OWNER-MOTION-01 ยังห้าม (เจ้าของยืนยันการตีความนี้เมื่อ 15 กันยายน 2569)','Browser runtime เท่านั้น: หนึ่ง document root ใช้ shared IntersectionObserver หนึ่งตัว; approach reveal เล่นซ้ำเมื่อ element กลับเข้า viewport (replay on re-entry ตาม OWNER-MOTION-01) และไม่วนซ้ำขณะ element ยังอยู่นิ่งในจอ เพราะ content reveal ที่วนจะกลายเป็น perpetual flicker ซึ่งยังห้ามอยู่','current replay lifecycle');
exact('ส่วน product tile ยังเปิดอยู่จนกว่าจะมี identity gradient ที่อนุมัติต่อผลิตภัณฑ์','ส่วน product tile ต้อง resolve identity gradient และ asset bytes ที่อนุมัติต่อผลิตภัณฑ์จาก Add-on แยกของผลิตภัณฑ์ปัจจุบัน ซึ่งใช้ร่วมกับ LDS ฉบับเต็มนี้','product identity conditional truth');
exact('ทั้งที่ `assets/citychat/asset-register.json` ใน repo motif ยังติดป้าย candidate — การอัปเดตป้ายใน repo นั้นเป็นงานตาม','โดยป้าย candidate ของทะเบียนต้นทางเป็นบันทึกประวัติ ณ วันที่รับ bytes ไม่ใช่ข้อสรุปสถานะเว็บปัจจุบัน; ใช้ approval/hash record ที่ส่งพร้อม Add-on แยกของผลิตภัณฑ์','CityChat source status is history');
exact('CityMETER และ CityWiki stings pre-approved รอผลิตใน Studio 1.4 (ยังไม่มี bytes จึงยังใช้ไม่ได้)','CityMETER และ CityWiki stings มี historical pre-approval; ใช้ได้ต่อเมื่อ current product registry มี approved bytes และ exact hash จริง','product sting conditional truth');
exact('Build Card schema ฉบับเต็มอยู่ใน `build-card.schema.json` และ canonical copyable fixture อยู่ใน `build-card.example.json` Human master นี้ตั้งใจไม่ทำสำเนา `schemaVersion`, version-qualified schema ID หรือ hash value เพราะค่าดังกล่าว MUST resolve จาก `release.json`, active schema และ bytes ของ binding ปัจจุบันเท่านั้น ไม่ใช่จาก prose','Build Card schema ฉบับเต็มอยู่ใน `machine.schemas["build-card.schema.json"]`; สร้าง record ของงานจาก schema ที่รวมไว้แล้ว Example fixture เมื่อมีเป็น optional reference เท่านั้นและไม่ใช่ product evidence ค่า `schemaVersion`, version-qualified schema ID และ hash MUST resolve จาก `machine.release`, embedded active schema และ bytes ของ binding ปัจจุบัน ไม่ใช่คัดจาก prose หรือ historical fixture','standalone Build Card schema');
exact('ใช้ schema identity ของ Artifact Manifest จาก `release.json.schemaIds` และใช้ `artifact-manifest.schema.json` bytes ปัจจุบันเป็น machine contract ห้ามคัดลอก version, schema ID หรือ hash จาก prose `artifact-manifest.example.json` เป็น canonical `package_validated` fixture; จะได้สถานะ pass เมื่อ validator รับรองเท่านั้น ตารางนี้เป็น human field map ไม่ใช่ copyable template','ใช้ schema identity และ contract ของ Artifact Manifest จาก `machine.schemas["artifact-manifest.schema.json"]` ห้ามคัดลอก version, schema ID หรือ hash จาก prose Example fixture เมื่อมีเป็น optional reference ไม่ให้สถานะ pass แก่งานใหม่ ตารางนี้เป็น human field map; สร้างและตรวจ record ของงานกับ embedded schema และ bytes ของงานจริง','standalone artifact schema');
exact('ใช้ `social-sidecar.example.json` เป็น shape เท่านั้น ไม่ใช่ข้อมูลอนุมัติสำหรับงานใหม่','สร้าง shape จาก embedded current social-sidecar schema; example เมื่อมีเป็น optional reference ไม่ใช่ข้อมูลอนุมัติสำหรับงานใหม่','standalone social schema');
exact('- LAYOUT-01-A — visual: reading order ชัดที่ minimum, nominal และ maximum target sizes','- LAYOUT-01-A — visual: reading order ชัดที่ minimum, nominal และ maximum target sizes; actual Thai/English narrow/desktop content has no squeezed heading or sibling overlap, including newly added sections','layout rendered acceptance');
exact('- LAYOUT-01-B — manual: essential content ไม่ clipped, orphaned, ซ่อนหลัง navigation หรือ split โดยไม่มี continuation cue','- LAYOUT-01-B — manual: essential content ไม่ clipped, orphaned, ซ่อนหลัง navigation หรือ split โดยไม่มี continuation cue; selected states contain no decorative brackets/colored left rails, while keyboard focus and meaningful chart/table borders remain visible','layout preference acceptance');

// File references denote embedded records, not additional uploads or old releases.
for (const [a,b] of Object.entries({
  'tokens.v0.9.4.json':'machine.tokens',
  'component-contracts.v0.9.4.json':'machine.contracts.componentContracts',
  'motif-register.v0.9.4.json':'machine.contracts.motifRegister',
  'rule-catalog.json':'machine.ruleCatalog',
  'format-packs.json':'machine.contracts.formatPacks',
  'format-kits.json':'machine.contracts.formatKits',
  'asset-registry.json':'machine.contracts.assetRegistry',
  'release.json.schemaIds':'machine.schemas',
  '`release.json`':'`machine.release`',
})) { if(text.includes(a)) exact(a,b,`embedded reference ${a}`,true); }
// These version labels described the active prose, not immutable schema identities.
for (const [a,b] of Object.entries({
  'Static social ใน v0.9.4':'Static social ใน v0.9.5',
  'v0.9.4 ไม่รับ exception':'v0.9.5 ไม่รับ exception',
  '### 14.4 No artifact exception channel in v0.9.4':'### 14.4 No artifact exception channel in v0.9.5',
  'ซึ่ง v0.9.4 ยังไม่ให้ exception path':'ซึ่ง v0.9.5 ยังไม่ให้ exception path',
  'sourceVersion: v0.9.4-mp1':'sourceVersion: v0.9.5-owner.1',
  'motion-riddim-approach-02':'motion-riddim-approach-03',
  'Navigation v0.9.4 มีสามระดับ':'Navigation มีสามระดับ',
  'parallax MUST remain disabled in v0.9.4':'parallax MUST remain disabled in v0.9.5',
  'v0.9.4 มี `reference_example` เจ็ดรายการ ครบหก primary formats (carried from v0.9.1-mp7; social static reference gains the OG target at freeze)':'The seven reference-example positions below cover six primary formats, including square and OG social targets. Example files are optional, non-normative learning aids; create the artifact record from the embedded format/target/schema contracts',
  '(v0.9.4)':'(v0.9.5)',
  'basis of the LUT interpolation and ΔE measurements':'basis of approved LUT construction and ΔE measurements; runtime uses exact samples',
  'หรือ series จาก `#/categoricalSeries`':'หรือ series จาก `machine.tokens#/categoricalSeries`',
})) { if(text.includes(a)) exact(a,b,`current prose ${a}`,true); }
exact('| ย้ายงานจาก v0.9.1-r8 | §15 | migration-ledger.json; ห้ามเดา rule ที่ไม่มี disposition; ตาราง sentence-level บอกว่าประโยคไหนถูกแทนด้วยอะไร |','| ย้ายงานจากรุ่นเดิม | §15 | ใช้ข้อกำหนดที่รวมแล้วในฉบับนี้; lineage เป็นหลักฐานประวัติ ไม่ใช่ไฟล์ที่ต้องอัปโหลดเพิ่ม |','migration shortcut');
exact('| ทำงานตามบทบาท (AI/agent, dev, designer, product, marketing, sales, ผู้อ่านทั่วไป) | §20 | คู่มือสั้นต่อบทบาทใน `roles/` พร้อมสิ่งที่ต้องโหลด ต้องรัน และต้องไม่ทำ |','| ทำงานตามบทบาท (AI/agent, dev, designer, product, marketing, sales, ผู้อ่านทั่วไป) | §20 | ทางเริ่มตามบทบาทและ embedded records ที่ต้องใช้ในไฟล์นี้ |','role shortcut');
exact('Registry ของ release นี้คือ `machine.tokens#/analyticalScales` (DATAVIZ-02; dark anchors ตาม DATAVIZ-03) และ `#/categoricalSeries` (DATAVIZ-05); ทุกค่าวิเคราะห์ทั้งสองธีมต้องอยู่นอกหน้าต่างสี earth และ violet ที่ v0.9.0 ถอนแล้ว (DATAVIZ-04); ผลเกตทั้งสองธีมอยู่ใน `contrast-evidence.json` (GATE-01)','Registry ของ release นี้คือ `machine.analyticalScales` (DATAVIZ-02; exact dark LUT ตาม DATAVIZ-03) และ `machine.tokens.categoricalSeries` (DATAVIZ-05); ทุกค่าวิเคราะห์ทั้งสองธีมต้องผ่านหน้าต่างสีที่กำหนดใน DATAVIZ-04; ผลตรวจ GATE-01 ต้อง bind ค่าปัจจุบันและ reported scope จริง','foundation analytical cross-reference');
exact('the two color-srgb-07 files, the two color-srgb-06 files of the superseded 0.9.3 candidate and the four color-srgb-05 files retained in v0.9.1-mp7','raw registries with internal provenance from any release; the standalone DS reference itself is purpose-scoped documentation, while ordinary product outputs emit only the necessary sanitized roles/values','artifact raw registry boundary');
exact('### 17.2 Current catalog coverage\n\nThe machine catalog includes and validates:','### 17.2 Current catalog coverage\n\nThe current machine catalog covers the following 64 stable rule IDs. Coverage is not an assertion that every final artifact has passed their applicable checks:','honest catalog coverage');

let escapedTablePipes=0;
text=text.split('\n').map(line=>line.startsWith('|')?line.replace(/`[^`]*`/g,code=>code.replace(/(?<!\\)\|/g,()=>{escapedTablePipes++;return '\\|';})):line).join('\n');
operations.push({type:'editorial',label:'escape literal pipes inside table code spans',count:escapedTablePipes});

const oldIds = [...sourceBytes.toString('utf8').matchAll(/^\*\*([A-Z][A-Z0-9-]*-\d{2}) —/gm)].map(x=>x[1]);
const contractKeys = ['componentContracts','formatPacks','formatKits','targetProfiles','motifRegister','assetRegistry'];
const contractReferences=[...new Set([...text.matchAll(/machine\.contracts\.([A-Za-z]+)/g)].map(m=>m[1]))].sort();
for(const key of contractReferences) if(!contractKeys.includes(key)) throw new Error(`Unresolved embedded contract key: ${key}`);
const newIds = [...text.matchAll(/^\*\*([A-Z][A-Z0-9-]*-\d{2}) —/gm)].map(x=>x[1]);
if (new Set(newIds).size!==newIds.length || JSON.stringify([...oldIds].sort())!==JSON.stringify([...newIds].sort())) throw new Error('Rule coverage differs');
const oldAccept = [...sourceBytes.toString('utf8').matchAll(/^- ([A-Z][A-Z0-9-]*-\d{2}-[A-Z]) —/gm)].map(x=>x[1]);
const newAccept = [...text.matchAll(/^- ([A-Z][A-Z0-9-]*-\d{2}-[A-Z]) —/gm)].map(x=>x[1]);
if (JSON.stringify([...oldAccept].sort())!==JSON.stringify([...newAccept].sort())) throw new Error('Acceptance ID coverage differs');
for(const banned of ['Every dark anchor is computed','D-DERIVE-01','one of five states','enum ห้าค่า','landometer-series-10-v7','color-srgb-07.production.css','self-contained product edition','Designated product editions','product edition ปัจจุบัน','standalone-0.9.5-r1']) if(text.includes(banned)) throw new Error(`Obsolete active clause: ${banned}`);
const dir=path.dirname(path.join(root,output));fs.mkdirSync(dir,{recursive:true});
text=text.trimEnd()+'\n';
fs.writeFileSync(path.join(root,output),text);
const receipt={documentId:'standalone-0.9.5-r2',releaseRef:'v0.9.5-owner.1',source:{path:source,sha256:expected},output:{path:output,sha256:sha(text),bytes:Buffer.byteLength(text)},ruleIds:newIds,acceptanceIds:newAccept,contractReferences,operations};
fs.writeFileSync(path.join(root,inputs,'consolidation-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({output,rules:newIds.length,acceptances:newAccept.length,bytes:Buffer.byteLength(text),sha256:sha(text)}));
