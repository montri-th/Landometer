#!/usr/bin/env node
// Validate discovery and exact-asset binding, not rendered playback. Browser
// review remains required for lifecycle, readable layout and final geometry.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {motionDiscovery,motionKinds} from './lds097-motion-discovery.mjs';
const root=resolve(import.meta.dirname,'..'),site=join(root,'deployment/v0.9.7');
const {html,css,js}=motionDiscovery({root,site});
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
const doc=JSON.parse(readFileSync(join(site,'normative/Landometer-Design-System-v0.9.7.json'),'utf8'));
const assetRecords=doc.machine.assetFiles.filter(r=>r.path.includes('/build-kit/motif/'));
check(assetRecords.length===18,'18 packaged motion/runtime/fallback files');
for(const asset of assetRecords){const file=join(site,'package',asset.path);check(createHash('sha256').update(readFileSync(file)).digest('hex')===asset.sha256,'Packaged motion bytes '+asset.path);const served=join(site,'lds/motif',asset.path.split('/build-kit/motif/')[1]);check(createHash('sha256').update(readFileSync(served)).digest('hex')===asset.sha256,'Serving-copy motion bytes '+asset.path);}
check(motionKinds.length===6,'Six registered specimens');
check(new Set(motionKinds.map(k=>k.id)).size===6,'No duplicate motif kind');
for(const k of motionKinds){
 check(html.includes('data-motion-catalogue-kind="'+k.id+'"'),'Visible card '+k.id);
 for(const variant of ['full','quiet']){
  const rel='lds/motif/svg/'+k.id+'-'+variant+'.svg';
  check(html.includes('src="'+rel+'"'),'Visible exact '+rel);
  check(html.includes('href="'+rel+'" download='),'Download exact '+rel);
  const asset=assetRecords.find(a=>a.path.endsWith('/svg/'+k.id+'-'+variant+'.svg'));
  check(createHash('sha256').update(readFileSync(join(site,rel))).digest('hex')===asset.sha256,'Serving-copy parity '+rel);
 }
 check(k.cycle===(k.id==='logo'?6000:3000),'Registered finite cycle '+k.id);
}
check((html.match(/<button\b[^>]*class="lds-motion-pause"/g)||[]).length===1,'One page motion control in projection');
check(!html.includes('<lm-motif'),'No auto-mounted motion in initial HTML');
check(html.includes('data-preview-still="light"')&&html.includes('data-preview-still="dark"'),'No-JS final stills in both themes');
check(html.includes('id="identity-motion"'),'Stable motion section deep link');
check(html.includes('id="animated-logo-motifs"'),'Deep link alias for animated-logo/motif discovery');
check(html.includes('data-motion-discovery="0.9.7"><div class="container">'),'Full guide container retained');
check(html.includes('id="motif-preview"'),'Single preview target');
const appearanceSelect=html.match(/<select id="motif-variant">([\s\S]*?)<\/select>/)?.[1]||'';
check(JSON.stringify([...appearanceSelect.matchAll(/<option value="([^"]+)"/g)].map(m=>m[1]))===JSON.stringify(['auto','full','quiet']),'Explicit appearance dropdown exposes follow-theme, Full and Quiet');
check(html.includes('<label for="motif-variant">'),'Appearance dropdown has a visible associated label');
for(const kind of motionKinds)for(const variant of ['full','quiet'])check(html.includes('data-preview-motif="'+kind.id+'" data-preview-variant="'+variant+'"'),'Catalogue links exact kind and appearance '+kind.id+'/'+variant);
check(html.includes('id="motif-selected-download"'),'Selected rendition has a direct SVG download');
check(html.includes('§8.5–8.6'),'Current normative rule citation');
check(html.includes('four-beat motifs are static only'),'Current ijji restriction visible');
check(html.includes('exact artifact approval'),'CityChat artifact scope visible');
check(html.includes('Installation does not automatically animate every output'),'Installation boundary visible');
check(js.includes("window.LandometerMotifFrame.mount(frame)"),'Exact governed frame runtime used');
check(js.includes("window.LandometerMotifFrame.unmount(frame)"),'Previous preview unmounted before replacement');
check(js.includes("prefers-reduced-motion: reduce"),'System reduced motion respected');
check(js.includes("IntersectionObserver"),'No motion if visibility API absent');
check(js.includes('entry.intersectionRatio>=.14'),'Local exact 14% visibility gate');
check(js.includes('busy||reduce.checked||(mq&&mq.matches)'),'Reduced-motion first load keeps original still without freezing runtime');
check(js.includes('15000'),'Failed loading has a bounded retry path');
check(js.includes("'pageshow'"),'BFCache return refreshes actual visibility state');
check(css.includes('[data-motion="final"] lm-motif *{animation:none!important}'),'Paused/offscreen stage settles immediately');
check(css.includes('@media print'),'Printed delivery retains final still');
check(html.includes('id="motion-web-files"'),'Direct file handoff details');
for(const path of ['landometer-motifs.css','landometer-motifs.js','motion-controller.js','motif-frame.css','motif-frame.js','motif-library.json'])check(html.includes('href="lds/motif/'+path+'" download'),'Direct runtime download '+path);
check(html.includes('&lt;lm-motif kind="logo"'),'Usable integration snippet is escaped text');
if(process.argv.includes('--site')){
 const delivered=readFileSync(join(site,'index.html'),'utf8');
 check(delivered.includes(html),'Complete generated motion section is present in the delivered page');
 check(readFileSync(join(site,'motion-discovery.css'),'utf8')===css,'Delivered motion CSS equals reviewed generator');
 check(readFileSync(join(site,'motion-discovery.js'),'utf8')===js,'Delivered motion JavaScript equals reviewed generator');
 check((delivered.match(/<button\b[^>]*class="lds-motion-pause"/g)||[]).length===1,'Exactly one actual page-level motion control');
 check(delivered.includes('src="motion-discovery.js?build='),'Actual page loads the discovery module');
}
new vm.Script(js);checks++;
const runtimeCases=await exerciseMotionSelector({html,js,registry:doc.machine.contracts.motifRegister});
console.log(JSON.stringify({status:'PASS',checks,runtimeCases,coverage:'source contracts, exact bytes, explicit variant selection and playback-intent state; rendered browser motion and visual QA separate'},null,2));

// Execute the delivered selector with small DOM/event adapters. This tests user
// intent and the attributes sent to the governed runtime, not pixels or physics.
async function exerciseMotionSelector({html,js,registry}) {
 const decode=s=>s.replaceAll('&quot;','"').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>');
 class Element {
  constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.attrs={...attrs};this.children=[];this.listeners={};this.textContent='';this.checked=false;this.hidden='hidden' in attrs;this.disabled='disabled' in attrs;this.parentElement=null;this._value=undefined;}
  get value(){return this._value??this.attrs.value??(this.tagName==='SELECT'?this.querySelector('option')?.value:'')??'';}set value(v){this._value=String(v);}
  get className(){return this.attrs.class||'';}set className(v){this.attrs.class=v;}
  get src(){return this.getAttribute('src');}set src(v){this.setAttribute('src',v);}
  get href(){return this.getAttribute('href');}set href(v){this.setAttribute('href',v);}
  get download(){return this.getAttribute('download');}set download(v){this.setAttribute('download',v);}
  setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}hasAttribute(k){return k in this.attrs;}removeAttribute(k){delete this.attrs[k];}
  appendChild(el){el.parentElement=this;this.children.push(el);return el;}remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(el=>el!==this);this.parentElement=null;}
  matches(selector){if(selector.startsWith('#'))return this.attrs.id===selector.slice(1);if(selector.startsWith('.'))return this.className.split(/\s+/).includes(selector.slice(1));const m=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m?(m[2]===undefined?this.hasAttribute(m[1]):this.getAttribute(m[1])===m[2]):this.tagName.toLowerCase()===selector;}
  querySelectorAll(selector){const result=[];for(const child of this.children){if(child.matches(selector))result.push(child);result.push(...child.querySelectorAll(selector));}return result;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}dispatchEvent(event){return Promise.all((this.listeners[event.type]||[]).map(fn=>fn(event)));}
  focus(){this.focused=true;}scrollIntoView(){this.scrolled=true;}
 }
 function parse(){const dom=new Element('body');let stack=[dom];const tokens=html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g)||[];for(const token of tokens){if(token.startsWith('<!--'))continue;if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}if(token.startsWith('<')){const name=token.match(/^<([\w-]+)/)?.[1];if(!name)continue;const attrs={};for(const m of token.slice(name.length+1).matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[m[1]]=decode(m[2]??'');const el=new Element(name,attrs);stack.at(-1).appendChild(el);if(!/^(img|input|link|meta|br|hr|source)$/.test(name)&&!token.endsWith('/>'))stack.push(el);}else stack.at(-1).textContent+=decode(token);}return dom;}
 function harness({theme='light',systemReduced=false}={}){
  const dom=parse(),htmlElement=new Element('html',{'data-theme':theme,'data-lang':'en'});htmlElement.lang='en';
  const head=new Element('head'),assets=[],timers=new Map(),mutationCallbacks=[],visibilityObservers=[],windowEvents={},mediaEvents={};let timerId=0;
  const nodes=id=>dom.querySelector('#'+id),mounted=new Set(),mounts=[];
  const document={documentElement:htmlElement,head,visibilityState:'visible',getElementById:nodes,createElement:tag=>new Element(tag),addEventListener(type,fn){(windowEvents['document:'+type]??=[]).push(fn);},dispatchEvent(event){for(const fn of windowEvents['document:'+event.type]||[])fn(event);}};
  head.appendChild=el=>{assets.push(el);return el;};
  const controller={paused:true,subscribe(){},pause(){this.paused=true;for(const f of mounted)f.setAttribute('data-motion','final');},resume(){this.paused=false;for(const f of mounted)f.setAttribute('data-motion','playing');}};
  const frameRuntime={mount(frame){const kind=frame.getAttribute('data-kind'),variant=frame.getAttribute('data-variant'),carrier=frame.getAttribute('data-host-surface'),r=registry.sharedFamily.kinds[kind];check(Boolean(r),'Mounted kind is registered');check(r.allowedJobs.includes(frame.getAttribute('data-job')),'Mounted job belongs to selected kind');check(frame.getAttribute('data-beat')===r.beat,'Mounted beat belongs to selected kind');check(+frame.getAttribute('data-cycle-ms')===r.cycleMs,'Mounted cycle matches approved kind');const auto=frame.hasAttribute('data-variant-dark');if(auto){check(variant==='full'&&frame.getAttribute('data-variant-dark')==='quiet','Auto uses the governed full-to-quiet theme pairing');check(r.allowedCarriers.full.includes(carrier+'@light')&&r.allowedCarriers.quiet.includes(carrier+'@dark'),'Auto carrier supports its rendition in both themes');}else check(r.allowedCarriers[variant]?.includes(carrier),'Selected explicit variant has an approved fixed carrier in either page theme');const el=frame.querySelector('lm-motif');check(el?.getAttribute('kind')===kind,'Runtime kind matches frame kind');check(el.getAttribute('autoplay')==='false','Runtime cannot autoplay before explicit play');check(variant==='full'?el.getAttribute('ink')==='blue':(!el.hasAttribute('ink')||el.getAttribute('ink')==='sky'),'Runtime ink fits the exact selected rendition');frame.setAttribute('data-motif-state','mounted');frame.setAttribute('data-motion','final');mounted.add(frame);mounts.push(frame);},unmount(frame){mounted.delete(frame);}};
  const mq={matches:systemReduced,addEventListener(type,fn){mediaEvents[type]=fn;}};
  class IO{constructor(fn){this.fn=fn;this.targets=new Set();visibilityObservers.push(this);}observe(el){this.targets.add(el);}unobserve(el){this.targets.delete(el);}}
  class MO{constructor(fn){mutationCallbacks.push(fn);}observe(){}}
  const window={LandometerMotion:controller,LandometerMotifFrame:frameRuntime,customElements:{get(){return true;}},IntersectionObserver:IO,matchMedia:()=>mq,addEventListener(type,fn){(windowEvents[type]??=[]).push(fn);}};
  const context={window,document,customElements:window.customElements,IntersectionObserver:IO,MutationObserver:MO,Event:class{constructor(type){this.type=type;}},setTimeout(fn,ms){const id=++timerId;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);},console};
  vm.runInNewContext(js,context,{timeout:1000});
  return{nodes,dom,controller,mounts,mounted,mq,assets,htmlElement,async change(id,value){nodes(id).value=value;await nodes(id).dispatchEvent({type:'change'});},click(id){return nodes(id).dispatchEvent({type:'click'});},async flush(){for(let i=0;i<20;i++){while(assets.length)assets.shift().onload();await Promise.resolve();}for(const [id,timer]of timers){if(timer.ms===0){timers.delete(id);timer.fn();}}},visible(ratio=1){for(const observer of visibilityObservers)observer.fn([...observer.targets].map(target=>({target,isIntersecting:ratio>0,intersectionRatio:ratio})));},theme(value){htmlElement.setAttribute('data-theme',value);for(const fn of mutationCallbacks)fn([{type:'attributes',attributeName:'data-theme'}]);},language(value){htmlElement.lang=value;htmlElement.setAttribute('data-lang',value);for(const fn of mutationCallbacks)fn([{type:'attributes',attributeName:'lang'}]);},event(type){for(const fn of windowEvents[type]||[])fn();},systemReduced(value){mq.matches=value;mediaEvents.change?.();}};
 }
 const surface=(variant)=>variant==='quiet'?'surface.card@dark':'surface.card@light';
 function chosen(h,kind,variant){const stage=h.dom.querySelector('.lds097-motion-stage'),link=h.nodes('motif-selected-download'),expected='lds/motif/svg/'+kind+'-'+variant+'.svg';const auto=h.nodes('motif-variant').value==='auto';check(stage.getAttribute('data-effective-variant')===variant,'Effective appearance selects the intended CSS carrier and still');check(stage.getAttribute('data-host-surface')===(auto?'surface.card':surface(variant)),'Preview surface agrees with chosen '+kind+'/'+variant);check(link?.href===expected,'Selected download agrees with chosen '+kind+'/'+variant);const image=h.dom.querySelector('[data-preview-still="'+(variant==='quiet'?'dark':'light')+'"]');check(image.src===expected,'Selected final still agrees with chosen '+kind+'/'+variant);if(h.mounted.size){check(h.mounted.size===1,'Only one preview frame is mounted');const frame=[...h.mounted][0];const darkAuto=auto&&h.htmlElement.getAttribute('data-theme')==='dark';check(frame.getAttribute('data-kind')===kind&&frame.getAttribute(darkAuto?'data-variant-dark':'data-variant')===variant,'Mounted frame matches chosen '+kind+'/'+variant);check(frame.getAttribute(darkAuto?'data-fallback-src-dark':'data-fallback-src')===expected,'Runtime fallback is the selected approved SVG');check(frame.querySelector('noscript').textContent.includes('src="'+expected+'"'),'No-JS runtime fallback matches selected SVG');}}
 let cases=0;
 for(const theme of ['light','dark'])for(const kind of motionKinds)for(const variant of ['full','quiet']){
  const h=harness({theme});check(h.mounted.size===0,'Initial page does not mount or autoplay motion');await h.change('motif-kind',kind.id);await h.change('motif-variant',variant);chosen(h,kind.id,variant);const play=h.click('motif-start');await h.flush();await play;chosen(h,kind.id,variant);h.visible(.13);check(h.controller.paused,'Below 14% never plays');h.visible(.14);check(!h.controller.paused,'Explicit play starts at 14%');h.theme(theme==='light'?'dark':'light');chosen(h,kind.id,variant);const opposite=variant==='full'?'quiet':'full';await h.change('motif-variant',opposite);h.visible();chosen(h,kind.id,opposite);check(h.controller.paused,'Changing appearance settles until the next explicit play');cases++;
 }
 for(const theme of ['light','dark']){
  const h=harness({theme});check(h.nodes('motif-variant').value==='auto','Follow-theme is the initial selection');chosen(h,'logo',theme==='dark'?'quiet':'full');const p=h.click('motif-start');await h.flush();await p;h.visible();check(!h.controller.paused,'Auto variant plays after the explicit action');h.theme(theme==='light'?'dark':'light');chosen(h,'logo',theme==='light'?'quiet':'full');h.visible();check(!h.controller.paused,'Follow-theme retains an already enabled playback intent');h.language('th');check(h.nodes('motif-variant').querySelectorAll('option').every(option=>option.textContent===option.getAttribute('data-label-th')),'Appearance options use current Thai labels');h.language('en');check(h.nodes('motif-variant').querySelectorAll('option').every(option=>option.textContent===option.getAttribute('data-label-en')),'Appearance options use current English labels');cases++;
 }
 const shortcuts=harness();check(shortcuts.dom.querySelectorAll('[data-preview-motif]').length===12,'Catalogue has exactly twelve rendition-specific shortcuts');for(const button of shortcuts.dom.querySelectorAll('[data-preview-motif]')){await button.dispatchEvent({type:'click'});const kind=button.getAttribute('data-preview-motif'),variant=button.getAttribute('data-preview-variant');check(shortcuts.nodes('motif-kind').value===kind&&shortcuts.nodes('motif-variant').value===variant,'Catalogue shortcut selects its exact kind and appearance');chosen(shortcuts,kind,variant);check(shortcuts.mounted.size===0,'Catalogue selection remains a still until explicit play');cases++;}
 const loading=harness();const pending=loading.click('motif-start');check(loading.assets.length>0,'Loading fixture holds actual lazy asset requests');await loading.change('motif-variant','quiet');await loading.flush();await pending;loading.visible();chosen(loading,'logo','quiet');check(loading.controller.paused,'Changing variant during lazy load cancels the earlier playback intent');const replay=loading.click('motif-start');await loading.flush();await replay;loading.visible();check(!loading.controller.paused,'A fresh explicit play after cancelled loading works');cases++;
 for(const reduced of ['device','preview']){const h=harness({systemReduced:reduced==='device'});await h.change('motif-variant','quiet');if(reduced==='preview'){h.nodes('motif-final-state').checked=true;await h.nodes('motif-final-state').dispatchEvent({type:'change'});}await h.click('motif-start');chosen(h,'logo','quiet');check(h.mounted.size===0&&h.assets.length===0,'Reduced-motion first visit keeps exact chosen still without loading '+reduced);cases++;}
 const stopped=harness();const p=stopped.click('motif-start');await stopped.flush();await p;stopped.visible();stopped.event('beforeprint');check(stopped.controller.paused,'Print settles the explicit rendition');stopped.visible();check(stopped.controller.paused,'Print does not leave automatic playback intent');cases++;
 return cases;
}
