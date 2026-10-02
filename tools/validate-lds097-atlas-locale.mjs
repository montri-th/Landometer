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
// Read only the retained translation surface. The modern modules render their
// own complete Thai/English copy and must not be run through the phrase table.
function legacyDisplayTexts(source){
 const result=[],stack=[],voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 const ignoredTags=new Set(['script','style','code','pre','kbd','samp','textarea']);
 for(const [token] of source.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>|[^<]+/gi)){
  if(token.startsWith('<!--'))continue;
  const closing=token.match(/^<\/([\w:-]+)/);
  if(closing){const index=stack.map(item=>item.tag).lastIndexOf(closing[1].toLowerCase());if(index>=0)stack.length=index;continue;}
  const opening=token.match(/^<([\w:-]+)/);
  if(opening){
   const tag=opening[1].toLowerCase(),blocked=Boolean(stack.at(-1)?.blocked)||ignoredTags.has(tag)||/\s(?:contenteditable|data-th|data-en)(?:\s|=|\/?[>])/.test(token)||/\sid=["']atlas-location-lab["']/.test(token);
   if(!blocked)for(const attribute of token.matchAll(/(?:aria-label|title|alt)="([^"]*)"/g))result.push(attribute[1]);
   if(!voidTags.has(tag)&&!token.endsWith('/>'))stack.push({tag,blocked});
  }else if(!stack.at(-1)?.blocked&&token.trim())result.push(token);
 }
 return result;
}
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
for(const text of legacyDisplayTexts(html.slice(start,end)))inspect(text,'static retained atlas');
for(const text of ['สีปกติ · ป้ายและรูปทรงช่วยรักษาความหมายเมื่อมองสีแยกได้ยาก','ขาวดำ: อ่านชื่อ หมายเลข รูปทรง และระดับประกอบ','การจำลอง deuteranopia โดยประมาณ ไม่ใช่การทดสอบกับผู้ใช้จริง'])inspect(text,'perception selector');
for(const family of D.scales)for(const count of [3,5,7,9,41])inspect(`${family.label} ${R.effective(family,count)} ระดับ ทั้งสองธีม`,'selection announcement');
check(JSON.stringify(D)===frozenData,'Localization modified canonical data');
check(translate('20 ตระกูล · 14 ทางเดียว + 6 สองทาง')==='20 families · 14 sequential + 6 diverging','Analytical inventory translation is incorrect');
check(translate('พื้นที่ก่อสร้าง')==='Built form','Built form must remain separate from density denominators');
check(translate('ความเชื่อมั่น')==='Confidence','Confidence meaning must be preserved');

// Execute the actual walker and attribute translator against nested fixtures.
// This catches accidentally excluding the whole discovery section as well as
// corrupting the new bilingual text or the Location lab's own live strings.
const elements=[],textNodes=[],observers=[];
function element(tag,attributes={},parent=null){
 const node={tagName:tag.toUpperCase(),attributes:new Map(Object.entries(attributes)),parentElement:parent,lang:'',
  hasAttribute(name){return this.attributes.has(name);},getAttribute(name){return this.attributes.get(name)??null;},setAttribute(name,value){this.attributes.set(name,String(value));},
  closest(selector){for(let item=this;item;item=item.parentElement)for(const part of selector.split(',')){if(part.startsWith('#')?item.getAttribute('id')===part.slice(1):part.startsWith('[')?item.hasAttribute(part.slice(1,-1)):item.tagName.toLowerCase()===part)return item;}return null;},
  querySelectorAll(){return elements.filter(item=>item!==this&&['aria-label','title','alt'].some(name=>item.hasAttribute(name))&&item.closest('#lds097-color-atlas')===this);}
 };elements.push(node);return node;
}
function content(parent,data){const node={parentElement:parent,data};textNodes.push(node);return node;}
const atlasFixture=element('div',{id:'lds097-color-atlas','aria-label':'ตระกูลข้อมูล'});
const discovery=element('section',{'data-colour-discovery':'0.9.7'},atlasFixture);
const sharedLab=element('section',{id:'scale-lab'},discovery);
const legacyLabel=element('label',{'aria-label':'ตระกูลข้อมูล',title:'จำนวนระดับ'},sharedLab);
const legacyText=content(legacyLabel,'ตระกูลข้อมูล');
const modernTH=element('span',{'data-th':''},discovery);
const modernEN=element('span',{'data-en':''},discovery);
const modernTHChild=element('strong',{'aria-label':'ความเชื่อมั่น'},modernTH);
const modernENChild=element('strong',{title:'จำนวนระดับ'},modernEN);
const modernTHText=content(modernTHChild,'สีเสริมสำหรับเล่าเรื่อง · ความเชื่อมั่น');
const modernENText=content(modernENChild,'Supporting colour · ความเชื่อมั่น');
const locationLab=element('section',{id:'atlas-location-lab','aria-label':'ตระกูลข้อมูล'},discovery);
const locationChild=element('label',{title:'จำนวนระดับ',alt:'ความเชื่อมั่น'},locationLab);
const locationText=content(locationChild,'จำนวนระดับ · ความเชื่อมั่น');
const code=element('code',{title:'จำนวนระดับ'},sharedLab),codeText=content(code,'ความเชื่อมั่น #213E70 41');
const protectedTexts=[modernTHText,modernENText,locationText,codeText].map(node=>[node,node.data]);
const protectedAttributes=[modernTHChild,modernENChild,locationLab,locationChild,code].map(node=>[node,JSON.stringify([...node.attributes])]);
const documentFixture={documentElement:{dataset:{locale:'en'}},getElementById:id=>id==='lds097-color-atlas'?atlasFixture:null,
 createTreeWalker(_root,_show,filter){let index=0;return {nextNode(){while(index<textNodes.length){const node=textNodes[index++];if(filter.acceptNode(node)===1)return node;}return null;}};}
};
const browserContext={document:documentFixture,NodeFilter:{SHOW_TEXT:4,FILTER_REJECT:2,FILTER_ACCEPT:1},MutationObserver:class{constructor(callback){this.callback=callback;observers.push(this);}observe(target){this.target=target;}}};
vm.runInNewContext(readFileSync(localePath,'utf8'),browserContext);
function assertProtected(){
 for(const [node,original]of protectedTexts)check(node.data===original,'Legacy localization changed modern-owned or code text');
 for(const [node,original]of protectedAttributes)check(JSON.stringify([...node.attributes])===original,'Legacy localization changed modern-owned or code attributes');
}
check(legacyText.data==='Analytical family','Shared analytical lab must still translate inside the modern discovery wrapper');
check(legacyLabel.getAttribute('aria-label')==='Analytical family'&&legacyLabel.getAttribute('title')==='Number of classes','Legacy shared-lab accessible attributes must translate');
assertProtected();
const dynamicLabel=element('label',{'aria-label':'ความเชื่อมั่น'},sharedLab),dynamicText=content(dynamicLabel,'ความเชื่อมั่น');
observers.find(observer=>observer.target===atlasFixture)?.callback();
check(dynamicText.data==='Confidence'&&dynamicLabel.getAttribute('aria-label')==='Confidence','Hydrated legacy content must translate through the mutation observer');
documentFixture.documentElement.dataset.locale='th';
observers.find(observer=>observer.target===documentFixture.documentElement)?.callback();
check(legacyText.data==='ตระกูลข้อมูล'&&dynamicText.data==='ความเชื่อมั่น','Language switching must restore legacy Thai exactly');
check(legacyLabel.getAttribute('aria-label')==='ตระกูลข้อมูล'&&legacyLabel.getAttribute('title')==='จำนวนระดับ','Language switching must restore accessible attributes exactly');
assertProtected();
documentFixture.documentElement.dataset.locale='en';browserContext.LDSAtlasLocale.apply();
check(legacyText.data==='Analytical family'&&atlasFixture.lang==='en','Repeated language switching must stay stable');
assertProtected();
console.log(JSON.stringify({status:'PASS',checks,generatedCases:cases.length,uniqueDisplayStrings:examined.size,families:D.scales.length,scope:'Static and generated display text, accessible labels, exact HEX/numeric preservation, bilingual and Location module isolation, and legacy hydration/locale round trips. Actual layout requires browser review.'},null,2));
