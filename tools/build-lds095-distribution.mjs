#!/usr/bin/env node
import {cpSync,rmSync,readFileSync,writeFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {resolve,relative,join,dirname,extname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const site=join(root,'deployment/v0.9.5');
const plugin=join(root,'plugins/landometer-design-system');
rmSync(join(site,'package'),{recursive:true,force:true});
cpSync(plugin,join(site,'package'),{recursive:true});
const atlasBuild=spawnSync(process.execPath,[join(root,'tools/build-lds095-atlas-integration.mjs')],{cwd:root,stdio:'inherit'});
if(atlasBuild.status!==0)process.exit(atlasBuild.status??1);
const guideBuild=spawnSync(process.execPath,[join(root,'tools/build-lds095-full-guide.mjs')],{cwd:root,stdio:'inherit'});
if(guideBuild.status!==0)process.exit(guideBuild.status??1);
writeFileSync(join(site,'team-setup.md'),readFileSync(join(root,'docs/lds-0.9.5-team-activation.md'),'utf8').replaceAll('../plugins/landometer-design-system/','./package/').replaceAll('../deployment/v0.9.5/project-source-0.9.5.md','./project-source-0.9.5.md').replaceAll('../tools/install-lds095.py','https://github.com/montri-th/Landometer/blob/main/tools/install-lds095.py'));
// A Project Source is a text-only fallback for sessions without verified
// plugin/skill file access. Publish exact existing files and hashes, not a
// new merged authority or a copy of the historical 0.9.1 master.
const sourceFiles=[
  ['0.9.5 overlay','assets/lds-0.9.5/GUIDE.md'],
  ['Current brand/voice contract','assets/lds-0.9.5/brand/BRAND.md'],
  ['Inherited full normative master','references/inherited/lds-0.9.4/machine/Landometer Design System v0.9.4.md'],
  ['Release identity and entrypoints','assets/lds-0.9.5/machine/release.json'],
  ['Rule precedence and policy','assets/lds-0.9.5/machine/policy.json'],
  ['Current design-token roles','assets/lds-0.9.5/machine/tokens.v0.9.5.json'],
  ['Exact categorical/foundation colors','assets/lds-0.9.5/machine/color-srgb-08.tokens.json'],
  ['Exact analytical scales','assets/lds-0.9.5/machine/color-srgb-08.scales.json']
];
const sourceRows=sourceFiles.map(([role,path])=>{
  const file=join(site,'package',path),bytes=readFileSync(file);
  return `| ${role} | [${path.split('/').at(-1)}](./package/${encodeURI(path)}) | ${bytes.length.toLocaleString('en-US')} | \`${createHash('sha256').update(bytes).digest('hex')}\` |`;
}).join('\n');
writeFileSync(join(site,'project-source-0.9.5.md'),`# Landometer DS 0.9.5 — Project Source files\n\nRelease \`v0.9.5-owner.1\` · color registry \`color-srgb-08\` · owner-approved unsigned distribution. These links resolve to exact files in this published package. Download the eight files individually and upload the extracted \`.md\` and \`.json\` files into a ChatGPT Project's **Project Sources** only when that project cannot already read the verified LDS 0.9.5 plugin/skill files. A link alone, or an uploaded ZIP alone, is not a verified source installation.\n\n| Role | Download | Bytes | SHA-256 |\n|---|---|---:|---|\n${sourceRows}\n\n## วิธีใช้ใน ChatGPT Project\n\n1. ดาวน์โหลดทั้ง 8 ไฟล์จากตารางและอัปโหลดไฟล์ \`.md\`/\`.json\` เข้า Project Sources ทีละไฟล์ เมื่อ Project นั้นยังอ่าน plugin/skill 0.9.5 ที่ตรวจแล้วไม่ได้ การวางลิงก์หรืออัปโหลด ZIP อย่างเดียวไม่ใช่การเปิดใช้ที่ตรวจได้\n2. กำหนด Project instructions ให้งานใหม่ใช้ \`v0.9.5-owner.1\`: กฎส่วนเพิ่มใน GUIDE, policy, BRAND และค่าสี machine ปัจจุบันมีลำดับเหนือกฎเดิมที่เปลี่ยนแล้ว ส่วน normative master 0.9.4 ยังคงใช้กับกฎที่ไม่ถูกแก้ งานที่ระบุรุ่นเก่าไว้ชัดเจนคงรุ่นเดิม และงานผลิตภัณฑ์ต้องอ่าน Add-on ของผลิตภัณฑ์นั้นด้วย\n3. เปิดแชตใหม่ ทดสอบให้อ่าน release ID, ลำดับกฎ และค่า \`density.capita\` พื้นมืดจากไฟล์จริงได้ ก่อนค่อยถอด Project Source 0.9.1 ที่ขัดกัน เก็บงานเก่าที่ล็อกรุ่นไว้ใน Project แยกหากยังต้องใช้\n\n## Rule order and migration\n\n1. Use the 0.9.5 GUIDE, policy, brand contract and exact machine colors/scales for all changed rules. The inherited 0.9.4 normative master supplies the unchanged rules. Do not substitute the historical 0.9.1 master as the current authority. The 0.9.4 signature does not sign 0.9.5.\n2. After these files are present, set the project's instructions to route new Landometer work to \`v0.9.5-owner.1\`, apply this precedence, preserve explicitly pinned historical releases, and require product-specific Add-ons where applicable. Review stale 0.9.1 sources before removing them; preserve a separate historical project if old receipts still need that release.\n3. Start a new chat and check that it can name the release ID, distinguish 0.9.5 from the inherited base, and read exact \`density.capita\` dark-theme scale values from the uploaded file. Record this result for each project.\n\nProject Source text improves retrieval but does not install the plugin's fonts, logos, CSS, validators or design-tool assets and cannot establish ChatGPT, Codex or Claude account/team activation. Use the [full package and platform guide](./team-setup.md) for those surfaces.\n`);
const walk=p=>readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
const deployment=join(root,'deployment');
const filesSet=new Set([join(deployment,'index.html'),join(deployment,'llms.txt'),...walk(site)].filter(p=>!p.endsWith('/site-manifest.json')));
// The restored handbook reuses exact original fonts, logos and reference downloads.
// Include their bytes in live verification even when they live outside v0.9.5/.
const queue=[join(site,'index.html'),join(site,'color-atlas.html')],seen=new Set();
while(queue.length){
 const file=queue.shift();if(seen.has(file))continue;seen.add(file);
 if(!['.html','.css'].includes(extname(file)))continue;
 const content=readFileSync(file,'utf8');
 const refs=[...content.matchAll(/(?:href|src)=["']([^"']+)["']/g),...content.matchAll(/url\(\s*["']?([^\s)'";]+)["']?\s*\)/g)].map(m=>m[1]);
 for(const ref of refs){
  if(/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(ref)||ref.includes('${'))continue;
  const pathname=decodeURIComponent(ref.split(/[?#]/)[0]);if(!pathname)continue;
  let dep=resolve(dirname(file),pathname);
  if(!dep.startsWith(deployment+'/'))continue;
  if(existsSync(dep)&&statSync(dep).isDirectory())dep=join(dep,'index.html');
  if(!existsSync(dep))throw Error(`Missing handbook dependency ${ref} in ${relative(deployment,file)}`);
  if(dep===join(site,'site-manifest.json'))continue;
  filesSet.add(dep);
  // Preserve linked historical records as records without traversing whole archived sites.
  if(extname(dep)==='.css'||dep.startsWith(site+'/'))queue.push(dep);
 }
}
const files=[...filesSet].sort();
const manifest={schema:'lds-public-site-1',designSystemVersion:'0.9.5',colorSetId:'color-srgb-08',packageId:'v0.9.5-owner.1',artifactBuildId:'ui-20260930-lds095-04',approval:'owner-approved',cryptographicSignature:'not-claimed',indexable:false,evidenceStatus:'source_limited_with_synthetic_examples',artifactConformance:'bounded-checks-only',contentBaseline:'ui-20260902-08 (0.9.1 full handbook)',assets:files.map(p=>({path:relative(deployment,p),bytes:statSync(p).size,sha256:createHash('sha256').update(readFileSync(p)).digest('hex')}))};
writeFileSync(join(site,'site-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`DS 0.9.5 web distribution built: ${files.length} assets`);
