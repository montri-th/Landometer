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
writeFileSync(join(site,'team-setup.md'),readFileSync(join(root,'docs/lds-0.9.5-team-activation.md'),'utf8').replaceAll('../plugins/landometer-design-system/','./package/').replaceAll('../tools/install-lds095.py','https://github.com/montri-th/Landometer/blob/main/tools/install-lds095.py'));
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
const manifest={schema:'lds-public-site-1',designSystemVersion:'0.9.5',colorSetId:'color-srgb-08',packageId:'v0.9.5-owner.1',artifactBuildId:'ui-20260929-lds095-02',approval:'owner-approved',cryptographicSignature:'not-claimed',indexable:false,evidenceStatus:'source_limited_with_synthetic_examples',artifactConformance:'bounded-checks-only',contentBaseline:'ui-20260902-08 (0.9.1 full handbook)',assets:files.map(p=>({path:relative(deployment,p),bytes:statSync(p).size,sha256:createHash('sha256').update(readFileSync(p)).digest('hex')}))};
writeFileSync(join(site,'site-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`DS 0.9.5 web distribution built: ${files.length} assets`);
