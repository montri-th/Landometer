#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const script of ['tools/build-lds097-distribution.mjs','plugins/landometer-design-system/scripts/verify.mjs','tools/validate-lds097-standalone.mjs','tools/validate-lds097-site.mjs','tools/validate-lds097-full-guide.mjs','tools/validate-lds097-color-discovery.mjs','tools/validate-lds097-motion-discovery.mjs','tools/validate-lds097-adoption-paths.mjs','tools/validate-lds097-starter.mjs','tools/validate-lds097-atlas-locale.mjs','tools/validate-v091-history.mjs','tools/validate-lds097-public-identity.mjs']){
 const r=spawnSync(process.execPath,[resolve(root,script),...(/validate-lds097-(color|motion)-discovery/.test(script)?['--site']:[])],{cwd:root,stdio:'inherit'});
 if(r.status!==0)process.exit(r.status??1);
}
console.log('LDS 0.9.7 release checks PASS; no universal artifact-conformance claim.');
