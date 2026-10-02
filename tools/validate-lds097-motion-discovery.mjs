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
console.log(JSON.stringify({status:'PASS',checks,coverage:'source contracts, exact bytes and discovery links; rendered browser motion and visual QA separate'},null,2));
