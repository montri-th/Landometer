#!/usr/bin/env node
import {cpSync,rmSync,mkdirSync,readFileSync,writeFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const site=join(root,'deployment/v0.9.5');
const plugin=join(root,'plugins/landometer-design-system');
rmSync(join(site,'package'),{recursive:true,force:true});
cpSync(plugin,join(site,'package'),{recursive:true});
writeFileSync(join(site,'team-setup.md'),readFileSync(join(root,'docs/lds-0.9.5-team-activation.md'),'utf8').replaceAll('../plugins/landometer-design-system/','./package/').replaceAll('../tools/install-lds095.py','https://github.com/montri-th/Landometer/blob/main/tools/install-lds095.py'));
const walk=p=>readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
const files=[join(root,'deployment/index.html'),join(root,'deployment/llms.txt'),...walk(site)].filter(p=>!p.endsWith('/site-manifest.json'));
const manifest={schema:'lds-public-site-1',designSystemVersion:'0.9.5',colorSetId:'color-srgb-08',packageId:'v0.9.5-owner.1',artifactBuildId:'ui-20260929-lds095-01',approval:'owner-approved',cryptographicSignature:'not-claimed',indexable:false,evidenceStatus:'synthetic-demonstration',artifactConformance:'bounded-checks-only',assets:files.map(p=>({path:relative(join(root,'deployment'),p),bytes:statSync(p).size,sha256:createHash('sha256').update(readFileSync(p)).digest('hex')}))};
writeFileSync(join(site,'site-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`DS 0.9.5 web distribution built: ${files.length} assets`);
