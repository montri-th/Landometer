#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import vm from 'node:vm';
const root=resolve(import.meta.dirname,'..');
const site=join(root,'deployment/v0.9.7');
const localePath=join(site,'atlas-locale.js');
const context={window:{}};
for(const name of ['data.js','render.js','base-render.js'])vm.runInNewContext(readFileSync(join(site,name),'utf8'),context);
const frozenData=JSON.stringify(context.window.LDS_CANDIDATE);
vm.runInNewContext(readFileSync(localePath,'utf8'),context);
const translate=context.LDSAtlasLocale?.translate;
if(typeof translate!=='function')throw Error('Atlas locale translator is missing');
const D=context.window.LDS_CANDIDATE,R=context.CandidateRender;
let checks=0;const examined=new Set();
function check(condition,message){checks++;if(!condition)throw Error(message);}
function texts(html){return [...html.matchAll(/>([^<>]*)<|(?:aria-label|title|alt)="([^"]*)"/g)].map(m=>m[1]??m[2]);}
function inspect(text,label){
 if(examined.has(text))return;examined.add(text);
 const rendered=translate(text);
 check(!/[\u0E00-\u0E7F]/.test(rendered),'Untranslated atlas text in '+label+': '+rendered);
 check(JSON.stringify(rendered.match(/#[0-9a-fA-F]{6}\b/g)??[])===JSON.stringify(text.match(/#[0-9a-fA-F]{6}\b/g)??[]),'Localization changed HEX values in '+label);
 check(JSON.stringify(rendered.match(/\d+(?:\.\d+)?/g)??[])===JSON.stringify(text.match(/\d+(?:\.\d+)?/g)??[]),'Localization changed numerical display in '+label);
 if(!/[\u0E00-\u0E7F]/.test(text))check(rendered===text,'Localization changed non-Thai text in '+label);
}
const cases=[];
for(const family of D.scales)for(const count of [3,5,7,9,41])cases.push([family.id+' '+count,R.stage(D,family.id,count)],['table '+family.id+' '+count,R.tables(D,family.id,count)]);
for(const mode of ['candidate','baseline'])cases.push(['library '+mode,R.library(D,mode)]);
for(const variant of ['soft','vivid'])for(const baseline of [false,true])cases.push(['categorical '+variant+' '+baseline,R.categories(D,variant,baseline)]);
cases.push(['all exact colors',R.fullTables(D)]);
for(const gradient of D.gradients)cases.push(['gradient '+gradient.id,context.PreviewRender.gradient(D,gradient.id)]);
for(const [name,html] of cases)for(const text of texts(html))inspect(text,name);
// Forty-one classes are the CityMETER primary view. They must use the
// complete approved LUT, regardless of compact-class spacing thresholds.
for(const family of D.scales){
 check(R.effective(family,41)===41,`The primary view was reduced: ${family.id}`);
 const stage=R.stage(D,family.id,41),table=R.tables(D,family.id,41);
 const panels=[...stage.matchAll(/<article class="theme-sample"[^>]*data-sample-theme="(light|dark)"[^>]*>([\s\S]*?)<\/article>/g)];
 check(panels.length===2,`Both primary-view themes are present: ${family.id}`);
 for(const [,theme,panel]of panels){
  const expected=family.themes[theme].lut;
  const strip=panel.match(/<div class="ramp visual-color class-ramp lut41-ramp"[^>]*>([\s\S]*?)<\/div>/)?.[1]||'';
  const actual=[...strip.matchAll(/background:(#[0-9A-Fa-f]{6})/g)].map(m=>m[1]);
  check(JSON.stringify(actual)===JSON.stringify(expected),`Full primary LUT parity: ${family.id}/${theme}`);
  check(panel.includes('<summary>ดูช่วงและสีครบ 41 ระดับ</summary>'),`Primary legend stays accessible without crowding: ${family.id}/${theme}`);
  const cells=[...panel.matchAll(/class="sample-cell" data-value="(-?\d+)" data-index="(\d+)" data-hex="(#[0-9A-Fa-f]{6})"/g)];
  check(cells.length===24,`Primary specimen retains all values: ${family.id}/${theme}`);
  for(const [,raw,index,hex]of cells){
   const normalized=family.kind==='diverging'?(Number(raw)+100)/200:Number(raw)/100;
   const expectedIndex=Math.min(40,Math.floor(normalized*41));
   check(Number(index)===expectedIndex&&hex===expected[expectedIndex],`Primary specimen matches its interval and LUT: ${family.id}/${theme}/${raw}`);
  }
 }
 const rows=[...table.matchAll(/<tr><th>[^<]*<\/th><td><code>(#[0-9A-Fa-f]{6})<\/code><\/td><td><code>(#[0-9A-Fa-f]{6})<\/code><\/td><\/tr>/g)];
 check(rows.length===41,`Primary exact table retains 41 intervals: ${family.id}`);
 for(const [index,theme]of ['light','dark'].entries())check(JSON.stringify(rows.map(row=>row[index+1]))===JSON.stringify(family.themes[theme].lut),`Exact table matches primary colours: ${family.id}/${theme}`);
}
const html=readFileSync(join(site,'index.html'),'utf8');
const start=html.indexOf('<div id="lds097-color-atlas"');
check(start>=0,'Embedded atlas is missing');
const scanner=/<\/?div\b[^>]*>/g;scanner.lastIndex=start;
let match,depth=0,end;
while((match=scanner.exec(html))){depth+=match[0].startsWith('</')?-1:1;if(depth===0){end=scanner.lastIndex;break;}}
check(end>start,'Embedded atlas is not balanced');
for(const text of texts(html.slice(start,end)))inspect(text,'static atlas');
for(const text of ['สีปกติ · ป้ายและรูปทรงช่วยรักษาความหมายเมื่อมองสีแยกได้ยาก','ขาวดำ: อ่านชื่อ หมายเลข รูปทรง และระดับประกอบ','การจำลอง deuteranopia โดยประมาณ ไม่ใช่การทดสอบกับผู้ใช้จริง'])inspect(text,'perception selector');
for(const family of D.scales)for(const count of [3,5,7,9,41])inspect(`${family.label} ${R.effective(family,count)} ระดับ ทั้งสองธีม`,'selection announcement');
check(JSON.stringify(D)===frozenData,'Localization modified canonical data');
check(translate('20 ตระกูล · 14 ทางเดียว + 6 สองทาง')==='20 families · 14 sequential + 6 diverging','Analytical inventory translation is incorrect');
check(translate('พื้นที่ก่อสร้าง')==='Built form','Built form must remain separate from density denominators');
check(translate('ความเชื่อมั่น')==='Confidence','Confidence meaning must be preserved');
console.log(JSON.stringify({status:'PASS',checks,generatedCases:cases.length,uniqueDisplayStrings:examined.size,families:D.scales.length,scope:'Static and generated display text, accessible labels, exact HEX and numeric text preservation. Actual locale switching and layout require browser review.'},null,2));
