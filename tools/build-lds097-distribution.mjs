#!/usr/bin/env node
import {cpSync,rmSync,readFileSync,writeFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {resolve,relative,join,dirname,extname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {publicHead} from './lds097-public-head.mjs';
const root=resolve(import.meta.dirname,'..');
const site=join(root,'deployment/v0.9.7');
const plugin=join(root,'plugins/landometer-design-system');
const normativeBuild=spawnSync(process.execPath,[join(root,'tools/build-lds097-standalone.mjs')],{cwd:root,stdio:'inherit'});
if(normativeBuild.status!==0)process.exit(normativeBuild.status??1);
rmSync(join(site,'package'),{recursive:true,force:true});
cpSync(plugin,join(site,'package'),{recursive:true});
const atlasBuild=spawnSync(process.execPath,[join(root,'tools/build-lds097-atlas-integration.mjs')],{cwd:root,stdio:'inherit'});
if(atlasBuild.status!==0)process.exit(atlasBuild.status??1);
const studyBuild=spawnSync(process.execPath,[join(root,'tools/build-lds097-study-pages.mjs')],{cwd:root,stdio:'inherit'});
if(studyBuild.status!==0)process.exit(studyBuild.status??1);
writeFileSync(join(site,'color-reference.html'),publicHead(readFileSync(join(site,'color-reference.html'),'utf8'),'reference'));
writeFileSync(join(root,'deployment/index.html'),publicHead(readFileSync(join(root,'deployment/index.html'),'utf8').replaceAll('root-20261001-lds097-r2','root-20261001-lds097-r4'),'guide','v0.9.7/'));
const guideBuild=spawnSync(process.execPath,[join(root,'tools/build-lds097-full-guide.mjs')],{cwd:root,stdio:'inherit'});
if(guideBuild.status!==0)process.exit(guideBuild.status??1);
writeFileSync(join(site,'team-setup.md'),readFileSync(join(root,'docs/lds-0.9.7-team-activation.md'),'utf8').replaceAll('../plugins/landometer-design-system/','./package/').replaceAll('../deployment/v0.9.7/project-source-0.9.7.md','./project-source-0.9.7.md').replaceAll('../tools/install-lds097.py','https://github.com/montri-th/Landometer/blob/main/tools/install-lds097.py'));
cpSync(join(root,'docs/lds-0.9.7-chatgpt-resource-adapter.md'),join(site,'chatgpt-resource-adapter.md'));
// One complete normative file is the current Project Source entry point.
const normativeSource=join(plugin,'assets/lds-0.9.7/normative');
rmSync(join(site,'normative'),{recursive:true,force:true});
cpSync(normativeSource,join(site,'normative'),{recursive:true});
const schemaSource=JSON.parse(readFileSync(join(normativeSource,'Landometer-Design-System-v0.9.7.json'),'utf8')).machine.schemas;
rmSync(join(site,'standalone-0.9.7-r1'),{recursive:true,force:true});
const schemaDir=join(site,'standalone-0.9.7-r1/schemas'); // Current standalone schema projections.
for(const [name,schema] of Object.entries(schemaSource)){
 const file=join(schemaDir,name);
 // Embedded schema keys are the canonical filenames, not network dependencies.
 if(!name.endsWith('.json')||name.includes('..')||name.includes('/'))throw Error('Unsafe schema filename '+name);
 (await import('node:fs')).mkdirSync(schemaDir,{recursive:true});
 writeFileSync(file,JSON.stringify(schema,null,2)+'\n');
}
const documentSet=JSON.parse(readFileSync(join(normativeSource,'document-set.json'),'utf8'));
const documentRows=[...documentSet.documents,...(documentSet.profiles??[])].map(doc=>{
 const md=doc.files.find(file=>file.path.endsWith('.md'));
 const machine=doc.files.find(file=>file.path.endsWith('.json'));
 return `| ${doc.title??'Location Intelligence Profile'} | [ดาวน์โหลด .md](./normative/${md.path}) | [JSON](./normative/${machine.path}) | ${md.bytes.toLocaleString('en-US')} | \`${md.sha256}\` |`;
}).join('\n');
writeFileSync(join(site,'project-source-0.9.7.md'),`# LDS 0.9.7 · complete base, separate Add-ons and Location profile

Use the complete LDS base as one human + machine readable Markdown file. It preserves the original 0.9.1 handbook structure and consolidates current rules and exact data. No 0.9.4 master or earlier overlay is required.

| Work | Required current normative sources |
|---|---|
| General Landometer / CityMETER | Full LDS base: one file |
| ijji / CityChat / CityWiki | Full LDS base + matching separate product Add-on: two files |
| Location Intelligence | Full LDS base + Location Intelligence Profile: two files |
| Product work using Location Intelligence | Full LDS base + matching product Add-on + Location Intelligence Profile: three files |

Markdown contains the human rules and lossless machine contract. JSON is an alternative per document; do not upload both formats. The optional Location profile defines 16 roles, 12 measured metrics and four evidence-only SWOT lenses. It does not replace the base or a product Add-on.

| Document | Human + AI Markdown | Machine alternative | MD bytes | MD SHA-256 |
|---|---|---|---:|---|
${documentRows}

## Install in ChatGPT or Claude Projects

1. Upload the complete base and only the applicable separate Add-on/profile to Project Sources / Files / Knowledge.
2. Set Project Instructions: “Use the attached LDS 0.9.7 full base as current authority, with the matching product Add-on and Location Intelligence Profile when relevant. Read exact HEX/LUT/classes from the supplied sources. Use identical original analytical and role colours on light and dark backgrounds; preserve value direction. Keep evidence labels, units, denominators and meaningful zero.”
3. After verifying the replacement sources, retire superseded DS/Add-on rulebooks from active sources. Retain briefs, research, business requirements, data and evidence. Preserve explicitly pinned historical work.
4. Open a fresh session. Ask the tool to read documentId, releaseRef and colorSetId, then return water 7-class HEX for both themes: the arrays must match. If using the profile, check li.service_gap with zero meaning demand equals supply. Verify the file was actually read; an upload badge alone is not a runtime test.

Current identity: standalone-0.9.7-r1 · v0.9.7-owner.1 · color-srgb-10 · unsigned owner distribution.

The Story vocabulary has 17 supporting values and 20 analytical families. Original analytical and Location role HEX values are identical on both themes; no dark derivation, inversion or recolouring. Existing categorical, identity and motif theme rules remain in their own scope. Low mark/background contrast may need readable borders, labels or a neutral plot surface; this release does not certify every artefact or colour pair.

Download actual fonts, logos, CSS, LUT and plugin/skill archives through the [team installation guide](./team-setup.md) and [release assets](https://github.com/montri-th/Landometer/releases/tag/v0.9.7). Project uploads do not automatically update other tools, projects, accounts or team members.
`);
const walk=p=>readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
const deployment=join(root,'deployment');
const entrypointBuildId=readFileSync(join(deployment,'index.html'),'utf8').match(/data-artifact-build="([^"]+)"/)?.[1];
if(!entrypointBuildId)throw Error('Root entry point is missing its distinct build identity');
const filesSet=new Set([join(deployment,'index.html'),join(deployment,'llms.txt'),...walk(site)].filter(p=>!p.endsWith('/site-manifest.json')));
// The restored handbook reuses exact original fonts, logos and reference downloads.
// Include their bytes in live verification even when they live outside v0.9.7/.
const queue=[join(site,'index.html'),join(site,'color-atlas.html'),join(site,'color-reference.html'),join(site,'location/index.html')],seen=new Set();
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
  if(dep===join(site,'site-manifest.json'))continue;
  if(!existsSync(dep))throw Error(`Missing handbook dependency ${ref} in ${relative(deployment,file)}`);
  filesSet.add(dep);
  // Preserve linked historical records as records without traversing whole archived sites.
  if(extname(dep)==='.css'||dep.startsWith(site+'/'))queue.push(dep);
 }
}
const files=[...filesSet].sort();
const manifest={schema:'lds-public-site-1',designSystemVersion:'0.9.7',colorSetId:'color-srgb-10',packageId:'v0.9.7-owner.1',artifactBuildId:'ui-20261001-lds097-r4',entrypointBuildId,approval:'owner-approved',cryptographicSignature:'not-claimed',indexable:false,evidenceStatus:'source_limited_with_synthetic_examples',artifactConformance:'bounded-checks-only',contentBaseline:'ui-20260902-08 (0.9.1 full handbook)',assets:files.map(p=>({path:relative(deployment,p),bytes:statSync(p).size,sha256:createHash('sha256').update(readFileSync(p)).digest('hex')}))};
writeFileSync(join(site,'site-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`DS 0.9.7 web distribution built: ${files.length} assets`);
