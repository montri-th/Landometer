#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import vm from 'node:vm';
const root=resolve(import.meta.dirname,'..'),site=join(root,'deployment/v0.9.6');
// Rebuild the published atlas from the approved 0.9.6 registry. The archived
// 0.9.5 HTML is a layout input only; current colors are never copied from it.
const checkOnly=process.argv.includes('--check');
const emit=(name,value)=>{const path=join(site,name);if(checkOnly){if(readFileSync(path,'utf8')!==value)throw Error(`Stale ${name}`);}else writeFileSync(path,value);};
const snapshot=JSON.parse(readFileSync(join(root,'plugins/landometer-design-system/references/approved-0.9.6.json'),'utf8'));
const previousContext={window:{}};
vm.runInNewContext(readFileSync(join(root,'deployment/v0.9.5/data.js'),'utf8'),previousContext);
const previous=previousContext.window.LDS_CANDIDATE;
const D={...snapshot,designSystemVersion:'0.9.6',colorSetId:'color-srgb-09',release:'v0.9.6-owner.1',buildId:'ui-20261001-lds096-r1',status:'owner-approved',baseline:{scales:previous.scales,series:previous.series}};
delete D.previousDensity;
emit('data.js','window.LDS_CANDIDATE='+JSON.stringify(D)+';\n');
const renderer={};
vm.runInNewContext(readFileSync(join(site,'render.js'),'utf8'),renderer);
const R=renderer.CandidateRender;
let atlas=readFileSync(join(root,'deployment/v0.9.5/color-atlas.html'),'utf8')
 .replaceAll('0.9.5','0.9.6').replaceAll('color-srgb-08','color-srgb-09')
 .replaceAll('ui-20260929-lds095-03','ui-20261001-lds096-r1');
function replaceContents(source,id,contents){
 const start=new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\bid="${id}"[^>]*>`).exec(source);
 if(!start)throw Error('Missing atlas container '+id);
 const bodyAt=start.index+start[0].length,tag=start[1];
 const scanner=new RegExp(`<\\/?${tag}\\b[^>]*>`,'g');scanner.lastIndex=bodyAt;
 let depth=1,match;
 while((match=scanner.exec(source))){depth+=match[0].startsWith('</')?-1:1;if(depth===0)return source.slice(0,bodyAt)+contents+source.slice(match.index);}
 throw Error('Unclosed atlas container '+id);
}
for(const [id,value] of Object.entries({
 'categories-stage':R.categories(D,'soft'),
 'old-categories':R.categories(D,'soft',true),
 'family-library':R.library(D),
 'scale-stage':R.stage(D,'count',7),
 'exact-colors':R.tables(D,'count',7)
}))atlas=replaceContents(atlas,id,value);
const tableMarker='<summary>ทุกขั้นสีของ DS 0.9.6 · 20 ตระกูล × 2 ธีม × 41 ขั้น</summary><div class="details-body">';
if(!atlas.includes(tableMarker))throw Error('Missing full atlas table marker');
atlas=atlas.replace(tableMarker,tableMarker.slice(0,-1)+' id="analytical-full-tables">');
atlas=replaceContents(atlas,'analytical-full-tables',R.fullTables(D));
atlas=replaceContents(atlas,'scale-choice',D.scales.map(s=>`<option value="${R.esc(s.id)}"${s.id==='count'?' selected':''}>${R.esc(s.label)} · ${R.esc(s.id)}</option>`).join(''));
const textChanges=[
 ['ลองแบ่ง 5 / 7 / 9 ระดับ','ลองแบ่ง 3 / 5 / 7 / 9 ระดับ'],
 ['ลองแบ่ง 5/7/9','ลองแบ่ง 3/5/7/9'],
 ['<button type="button" data-count="5"', '<button type="button" data-count="3" aria-pressed="false">3</button><button type="button" data-count="5"'],
 ['มืดอย่างมีสีสัน<br>ไล่ระดับอย่างเห็นความต่าง','สามสีหลัก<br>ไล่ระดับอย่างเห็นความต่าง'],
 ['ชุดสี R2.1 ที่ได้รับอนุมัติ · แยก density เป็นส้ม กุหลาบ แดง และเหลืองทอง<br>แยกบุคลิกของสเกลข้อมูล พร้อมเก็บสีหมวดหมู่พื้นสว่างและแกนแบรนด์เดิม','14 สเกลทางเดียว ใช้หัว–กลาง–ท้ายต่างเฉดชัดเจน เช่น ครีม → เขียว → ฟ้า<br>คงความสว่างทางเดียว และ density โทนร้อนครบทุกตัวหาร'],
 ['<strong>10 × 2</strong><span>สีหมวดหมู่มืด Soft + Vivid</span>','<strong>14 × 2</strong><span>สเกลทางเดียว · พื้นสว่างและมืด</span>'],
 ['เพิ่มความต่างทั้งในสเกลและระหว่างตระกูล','14 sequential ใหม่ · 6 diverging คงเดิม'],
 ['03 / Categorical ใหม่','03 / Categorical คงเดิม'],
 ['Soft ลดความพาสเทล · Vivid เพิ่มความสด · แยกเขียว มิ้นต์ teal และน้ำเงินให้ชัดขึ้น<br>ป้ายชื่อ หมายเลข และรูปทรงยังอยู่ครบ สีพื้นสว่างทุกค่าคงเดิม','สืบทอดสี Soft, Vivid และ Ink จาก 0.9.5 ทั้งพื้นสว่างและมืด<br>ป้ายชื่อ หมายเลข และรูปทรงคงเดิม'],
 ['เปิดเทียบกับชุดพื้นมืดก่อนปรับ','เปิดชุด 0.9.5 ที่สืบทอดโดยไม่เปลี่ยนสี'],
 ['Dark soft ใหม่','Dark soft'],['Dark vivid / ink ใหม่','Dark vivid / ink'],
 ['Density อุ่นทั้งหมด ตระกูลอื่นมีทางสีของตัวเอง','14 ชุดทางเดียว · สีกลางเป็นอีกเฉดชัดเจน'],
 ['ต่อพื้นที่ = ส้ม · ต่อประชากร = ชมพูกุหลาบ · ต่อครัวเรือน = แดง · สิ่งปลูกสร้าง = เหลืองทอง<br>จำนวนรวมยังแยกจากความหนาแน่น ต้องอ่านหน่วยและตัวหารก่อนเลือกสเกล','ธีมสว่างเริ่มจากครีม #F2F1DF ผ่านสีกลางที่ต่างจากสีท้าย ธีมมืดใช้ช่วงความสว่างของตน<br>Density ทั้งสี่คงโทนร้อน อ่านชื่อ หน่วย และตัวหารร่วมกับสีเสมอ'],
 ['ชุดก่อนหน้า</button>','DS 0.9.5</button>'],
 ['หมวดหมู่พื้นสว่างทุกค่า · ตัวหารและความหมายของข้อมูล · แกนแบรนด์และ gradient บรรยากาศเดิม','สเกลสองทางทั้ง 6 ตระกูล · Categorical ทั้งสองธีม · หน่วยและตัวหาร · แบรนด์ ภาษา identity และ motif/animation · gradient บรรยากาศ'],
 ['รอบ R2.1 ปรับเฉพาะ density 4 ตระกูล ให้มีโทนหลักของตัวเอง ส่วน Categorical และสเกลอีก 16 ตระกูลคงตาม R2','ปรับสเกลทางเดียว 14 ตระกูล × 2 ธีม ให้หัว–กลาง–ท้ายต่างเฉดชัดเจน และไล่ความสว่างทางเดียว ใช้ตาราง 41 ขั้นกับชุด 3/5/7/9 ระดับเดียวกันทุกเครื่องมือ'],
 ['เจ้าของอนุมัติให้ใช้เป็น DS 0.9.6 เมื่อ 29 กันยายน 2026 แพ็กเกจพร้อมใช้และมี checksum; รุ่นนี้ไม่อ้างลายเซ็นดิจิทัลของ 0.9.4 การเปิดใช้ใน workspace ของทีมต้องตั้งค่าผู้ดูแลแยก','เจ้าของอนุมัติให้ประกาศ DS 0.9.6 เมื่อ 1 ตุลาคม 2026 แพ็กเกจมี checksum และ normative ฉบับเต็ม standalone; รุ่นนี้ไม่อ้างลายเซ็นดิจิทัลใหม่ การติดตั้งและเปิดใช้ในแต่ละ workspace ต้องตรวจแยก'],
 ['29 September 2026','1 October 2026'],
 ['href="package/assets/lds-0.9.6/GUIDE.md"','href="normative/Landometer-Design-System-v0.9.6.md"']
];
for(const [a,b] of textChanges)atlas=atlas.replaceAll(a,b);
atlas=atlas.replace(/<meta\b[^>]*property="og:image(?::[^"]*)?"[^>]*>/g,'').replace('<meta name="twitter:card" content="summary_large_image">','<meta name="twitter:card" content="summary">');
emit('color-atlas.html',atlas);

const scope='.lds096-color-atlas';
const files=['package/assets/lds-0.9.6/machine/color-srgb-09.production.css','lds/lds-0.9.4-ext.css','lds/lds-0.9.4-components.css','app.css','candidate.css'];

// Parse balanced CSS blocks so nested media/supports and quoted data values
// retain their original bytes. Only selectors are scoped; colors never change.
function scopeCss(source){
  source=source.replace(/\/\*[\s\S]*?\*\//g,'');
  let result='',cursor=0;
  while(cursor<source.length){
    const open=source.indexOf('{',cursor);
    if(open<0){if(source.slice(cursor).trim())throw Error('Unexpected CSS tail');break;}
    const selector=source.slice(cursor,open).trim();
    let depth=1,quote=null,escaped=false,end=open+1;
    for(;end<source.length;end++){
      const c=source[end];
      if(escaped){escaped=false;continue;}
      if(c==='\\'){escaped=true;continue;}
      if(quote){if(c===quote)quote=null;continue;}
      if(c==='"'||c==="'"){quote=c;continue;}
      if(c==='{')depth++;
      else if(c==='}'&&--depth===0)break;
    }
    if(depth!==0)throw Error('Unbalanced CSS block');
    const body=source.slice(open+1,end);
    if(/^@(media|supports|container|layer)\b/.test(selector))result+=`${selector}{${scopeCss(body)}}\n`;
    else if(/^@(font-face|keyframes)\b/.test(selector))result+=`${selector}{${body}}\n`;
    else if(selector.startsWith('@'))throw Error(`Unsupported CSS rule ${selector}`);
    else{
      const selectors=selector.split(/,(?![^()]*\))/).map(s=>{
        s=s.trim();
        if(/^(?:html|body|:root)(?=[\s.[:#]|$)/.test(s))return s.replace(/^(?:html|body|:root)/,scope);
        if(/^\[data-theme[=\]]/.test(s))return scope+s;
        return `${scope} ${s}`;
      });
      result+=`${selectors.join(',')}{${body}}\n`;
    }
    cursor=end+1;
  }
  return result;
}
let css='/* Generated inline atlas styles. Exact values retained; selectors isolated from the full handbook. */\n';
for(const file of files)css+=`/* Source: ${file} */\n${scopeCss(readFileSync(join(site,file),'utf8'))}\n`;
css+=`${scope}{min-width:0;width:100%;height:auto;overflow-anchor:none}\n${scope} .wrap{width:100%;max-width:none}\n${scope} .section{scroll-margin-top:110px}\n`;
// body-level perception modes belong only to the atlas, never to the handbook.
css=css.replaceAll(`${scope} .vision-gray`,`${scope}.vision-gray`).replaceAll(`${scope} .vision-deuteranopia`,`${scope}.vision-deuteranopia`);
css=css.replace(/[ \t]+$/gm,'');
let js=readFileSync(join(site,'app.js'),'utf8');
const begin=js.indexOf(" const theme=document.getElementById('theme-choice');"),end=js.indexOf(' function update()');
if(begin<0||end<begin)throw Error('Standalone atlas theme hook changed');
js=js.slice(0,begin)+" const atlas=document.getElementById('lds096-color-atlas');\n"+js.slice(end);
js=js.replaceAll('document.body.classList','atlas.classList').replace("document.documentElement.dataset.previewReady='true'","atlas.dataset.previewReady='true'");
for(const [file,bytes] of [['scoped-atlas.css',css],['embedded-atlas.js',js]]){
 const path=join(site,file);
 if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==bytes)throw Error(`Stale ${file}`);}
 else writeFileSync(path,bytes);
}
console.log('Inline atlas CSS and runtime generated from approved standalone sources.');
