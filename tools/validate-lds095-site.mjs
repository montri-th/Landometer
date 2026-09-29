#!/usr/bin/env node
import {readFileSync,statSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root=resolve(import.meta.dirname,'..'),site=join(root,'deployment/v0.9.5');
const read=p=>readFileSync(join(site,p),'utf8');
const manifest=JSON.parse(read('site-manifest.json')),html=read('index.html');
let n=0;const check=(v,s)=>{n++;if(!v)throw Error(s);};
check(manifest.designSystemVersion==='0.9.5'&&manifest.colorSetId==='color-srgb-08','release identity');
check(manifest.cryptographicSignature==='not-claimed','truthful signature boundary');
for(const a of manifest.assets){const p=join(root,'deployment',a.path);check(statSync(p).size===a.bytes&&createHash('sha256').update(readFileSync(p)).digest('hex')===a.sha256,`asset parity ${a.path}`);}
check(html.includes('data-ds-version="0.9.5"')&&html.includes('data-color-registry="color-srgb-08"'),'visible site metadata');
check(!html.includes('127.0.0.1'),'no local canonical URLs');
for(const id of ['start','categories','library','scale-lab','atmospheres'])check(html.includes(`id="${id}"`),`static content ${id}`);
check(html.includes('Let us cultivate our city with data.'),'retained rally cry');
const c={window:{}};vm.runInNewContext(read('data.js'),c);const D=c.window.LDS_CANDIDATE;
check(D.designSystemVersion==='0.9.5'&&D.colorSetId==='color-srgb-08'&&D.scales.length===20,'runtime identity and inventory');
const colors=JSON.parse(read('package/assets/lds-0.9.5/machine/color-registry.json'));
// Registry parity is mandatory; explicit fields are settled by the package contract.
for(const s of D.scales)for(const theme of ['light','dark']){
 const target=colors.scales.find(x=>x.id===s.id);
 check(JSON.stringify(s.themes[theme].lut)===JSON.stringify(target.themes[theme].lut),`runtime exact LUT ${s.id}/${theme}`);
}
const seriesValues=arr=>arr.map(({id,name,cue,light,dark})=>({id,name,cue,light,dark}));
check(JSON.stringify(seriesValues(D.series))===JSON.stringify(seriesValues(colors.series)),'runtime categorical parity');
console.log(`DS 0.9.5 site PASS (${n} checks)`);
