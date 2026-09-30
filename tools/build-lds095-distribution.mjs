#!/usr/bin/env node
import {cpSync,rmSync,readFileSync,writeFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {resolve,relative,join,dirname,extname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const site=join(root,'deployment/v0.9.5');
const plugin=join(root,'plugins/landometer-design-system');
const normativeBuild=spawnSync(process.execPath,[join(root,'tools/build-lds095-standalone.mjs')],{cwd:root,stdio:'inherit'});
if(normativeBuild.status!==0)process.exit(normativeBuild.status??1);
rmSync(join(site,'package'),{recursive:true,force:true});
cpSync(plugin,join(site,'package'),{recursive:true});
const atlasBuild=spawnSync(process.execPath,[join(root,'tools/build-lds095-atlas-integration.mjs')],{cwd:root,stdio:'inherit'});
if(atlasBuild.status!==0)process.exit(atlasBuild.status??1);
const guideBuild=spawnSync(process.execPath,[join(root,'tools/build-lds095-full-guide.mjs')],{cwd:root,stdio:'inherit'});
if(guideBuild.status!==0)process.exit(guideBuild.status??1);
writeFileSync(join(site,'team-setup.md'),readFileSync(join(root,'docs/lds-0.9.5-team-activation.md'),'utf8').replaceAll('../plugins/landometer-design-system/','./package/').replaceAll('../deployment/v0.9.5/project-source-0.9.5.md','./project-source-0.9.5.md').replaceAll('../tools/install-lds095.py','https://github.com/montri-th/Landometer/blob/main/tools/install-lds095.py'));
// One complete normative file is the current Project Source entry point.
const normativeSource=join(plugin,'assets/lds-0.9.5/normative');
rmSync(join(site,'normative'),{recursive:true,force:true});
cpSync(normativeSource,join(site,'normative'),{recursive:true});
const schemaSource=JSON.parse(readFileSync(join(normativeSource,'Landometer-Design-System-v0.9.5.json'),'utf8')).machine.schemas;
rmSync(join(site,'standalone-0.9.5-r1'),{recursive:true,force:true});
const schemaDir=join(site,'standalone-0.9.5-r2/schemas');
for(const [name,schema] of Object.entries(schemaSource)){
 const file=join(schemaDir,name);
 // Embedded schema keys are the canonical filenames, not network dependencies.
 if(!name.endsWith('.json')||name.includes('..')||name.includes('/'))throw Error('Unsafe schema filename '+name);
 (await import('node:fs')).mkdirSync(schemaDir,{recursive:true});
 writeFileSync(file,JSON.stringify(schema,null,2)+'\n');
}
const documentSet=JSON.parse(readFileSync(join(normativeSource,'document-set.json'),'utf8'));
const documentRows=documentSet.documents.map(doc=>{
 const md=doc.files.find(file=>file.path.endsWith('.md'));
 const machine=doc.files.find(file=>file.path.endsWith('.json'));
 return `| ${doc.title} | [ดาวน์โหลด .md](./normative/${md.path}) | [JSON](./normative/${machine.path}) | ${md.bytes.toLocaleString('en-US')} | \`${md.sha256}\` |`;
}).join('\n');
writeFileSync(join(site,'project-source-0.9.5.md'),`# LDS v0.9.5 ฉบับเต็ม + Product Add-on\n\nใช้โครงเอกสารเดิมของ 0.9.1 โดยปรับกฎทุกหมวดเป็น 0.9.5 แล้ว พร้อม machine JSON ในไฟล์เดียว ไม่ต้องประกอบ 0.9.4 + overlay หรือชุด 8 ไฟล์อีก\n\n**งานทั่วไปใช้ LDS ฉบับเต็มหนึ่งไฟล์ งานผลิตภัณฑ์ใช้ LDS ฉบับเต็มคู่กับ Add-on แยกไฟล์ รวมสองไฟล์** ijji ใช้ LDS + ijji Add-on; CityChat ใช้ LDS + CityChat Add-on; CityWiki ใช้ LDS + Add-on ของตน ไม่รวมกฎกลางซ้ำในไฟล์ผลิตภัณฑ์ ส่วน JSON เป็นทางเลือกของเอกสารแต่ละฉบับ ไม่ต้องอัปโหลดซ้ำกับ Markdown\n\n| งาน | ดาวน์โหลดสำหรับคน + AI | ทางเลือกสำหรับเครื่อง | Bytes (.md) | SHA-256 (.md) |\n|---|---|---|---:|---|\n${documentRows}\n\n## ติดตั้งใน ChatGPT หรือ Claude Project\n\n1. อัปโหลด LDS ฉบับเต็มเข้า Project Sources / Files / Knowledge แล้วเพิ่ม Add-on แยกไฟล์เฉพาะผลิตภัณฑ์ที่ทำงาน\n2. ตั้ง Project Instructions ให้ LDS เป็นกฎกลางและ Add-on เป็นกฎเฉพาะผลิตภัณฑ์ตาม scope ไม่ต้องใช้ master 0.9.4 หรือ overlay รุ่นก่อน\n3. ยกเลิกเอกสาร DS/add-on รุ่นก่อนและชุด 8 ไฟล์เดิมจากแหล่งกฎปัจจุบัน เก็บ brief, research, data, evidence และข้อกำหนดธุรกิจที่ไม่ถูกแทนที่ไว้ ประวัติที่ล็อกรุ่นใช้เฉพาะเมื่อผู้ใช้ระบุ\n4. เปิด session ใหม่ ทดสอบ documentId, releaseRef, colorSetId และค่า density.capita dark 7 classes จาก LDS รวมทั้งกฎเฉพาะผลิตภัณฑ์จาก Add-on ตรวจว่าอ่านไฟล์จริงทั้งคู่ในงานผลิตภัณฑ์\n\nRevision: \`standalone-0.9.5-r2\` · approved design values: \`v0.9.5-owner.1 / color-srgb-08\` · unsigned owner distribution. LDS ฉบับเต็มรวมกฎกลางและค่าจริงครบในหนึ่งไฟล์; Add-on แยกไฟล์ให้กฎเฉพาะผลิตภัณฑ์; font/logo/runtime binaries ใช้ assets จริงที่ระบุ URL และ hash ไว้ในเอกสาร ดาวน์โหลดชุดติดตั้งจาก [คู่มือทีม](./team-setup.md)\n`);
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
const manifest={schema:'lds-public-site-1',designSystemVersion:'0.9.5',colorSetId:'color-srgb-08',packageId:'v0.9.5-owner.1',artifactBuildId:'ui-20260930-lds095-standalone-r2',approval:'owner-approved',cryptographicSignature:'not-claimed',indexable:false,evidenceStatus:'source_limited_with_synthetic_examples',artifactConformance:'bounded-checks-only',contentBaseline:'ui-20260902-08 (0.9.1 full handbook)',assets:files.map(p=>({path:relative(deployment,p),bytes:statSync(p).size,sha256:createHash('sha256').update(readFileSync(p)).digest('hex')}))};
writeFileSync(join(site,'site-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`DS 0.9.5 web distribution built: ${files.length} assets`);
