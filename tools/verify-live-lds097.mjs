#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const deployment=resolve(import.meta.dirname,'../deployment');
const base=process.env.SITE_URL??'https://montri-th.github.io/Landometer/';
const path='v0.9.7/site-manifest.json';const expected=readFileSync(join(deployment,path));
const hash=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(expected);let ready=false;
for(let i=0;i<30;i++){
 const r=await fetch(new URL(path,base),{cache:'no-store'});
 if(r.ok&&hash(Buffer.from(await r.arrayBuffer()))===hash(expected)){ready=true;break;}
 await new Promise(r=>setTimeout(r,10000));
}
if(!ready)throw Error('Live manifest has not reached the exact deployed source');
const results=[];
for(let i=0;i<manifest.assets.length;i+=12){
 results.push(...await Promise.all(manifest.assets.slice(i,i+12).map(async a=>{
 const r=await fetch(new URL(a.path,base),{cache:'no-store'});const b=Buffer.from(await r.arrayBuffer());
 if(!r.ok||b.length!==a.bytes||hash(b)!==a.sha256)throw Error(`Live byte mismatch: ${a.path} (${r.status})`);
 return {path:a.path,bytes:b.length,sha256:hash(b),contentType:r.headers.get('content-type')};
 })));
}
console.log(JSON.stringify({status:'PASS',version:'0.9.7',manifestSha256:hash(expected),verifiedAssets:results.length,assets:results},null,2));
