#!/usr/bin/env node
import {readFileSync,existsSync,readdirSync,statSync,lstatSync,realpathSync} from 'node:fs';
import {resolve,dirname,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash,createPublicKey} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {toLab,dE,cr,hueVerdict} from '../references/inherited/lds-0.9.4/machine/validate-dataviz-gates-0.9.4.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..'),P=resolve(ROOT,'assets/lds-0.9.5'),B=resolve(ROOT,'references/inherited/lds-0.9.4');
const json=p=>JSON.parse(readFileSync(p,'utf8')),hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex'),eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const slug=s=>s.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase().replaceAll('.','-');
export function verifyPackage(){
 const checks=[],warnings=[],check=(id,pass,detail)=>checks.push({id,pass:!!pass,...(detail?{detail}:{})});
 const sums=readFileSync(resolve(P,'SHA256SUMS.txt'),'utf8').trim().split('\n');
 const listed=[];
 for(const line of sums){const m=line.match(/^([a-f0-9]{64})  (.+)$/);if(!m){check('checksum-line',false,line);continue;}const path=resolve(ROOT,m[2]);check('safe-path:'+m[2],path.startsWith(ROOT+sep)&&realpathSync(path).startsWith(realpathSync(ROOT)+sep)&&relative(ROOT,path).split(sep).every((_,i,a)=>!lstatSync(resolve(ROOT,...a.slice(0,i+1))).isSymbolicLink()));check('sha256:'+m[2],existsSync(path)&&hash(path)===m[1]);listed.push(m[2]);}
 const files=dir=>readdirSync(dir).flatMap(n=>{const p=resolve(dir,n);return statSync(p).isDirectory()?files(p):[relative(ROOT,p).split(sep).join('/')];});
 check('checksum-covers-all-assets',files(P).filter(p=>!p.endsWith('/SHA256SUMS.txt')).every(p=>listed.includes(p)));
 const source=resolve(ROOT,'references/approved-r2.1.json');check('approved-R2.1-exact',hash(source)==='ebe57188c0824577628f8913a62f1c0794d1522214c54af63703281dfb07e011');
 const approved=json(source),manifest=json(resolve(P,'machine/release.json')),tokens=json(resolve(P,'machine/tokens.v0.9.5.json')),registry=json(resolve(P,'machine/color-srgb-08.tokens.json')),scales=json(resolve(P,'machine/color-srgb-08.scales.json')).scales,base=json(resolve(B,'machine/tokens.v0.9.4.json')),policy=json(resolve(P,'machine/policy.json'));
 check('exact-identity',manifest.release.dsVersion==='0.9.5'&&manifest.release.releaseRef==='v0.9.5-owner.1'&&manifest.release.colorSetId==='color-srgb-08');
 check('honest-unsigned-status',manifest.release.signatureStatus==='unsigned'&&manifest.release.signedRelease===false&&policy.approval.cryptographicReleaseAttestation===false);
 check('inherited-release-pin',hash(resolve(B,'machine/release.json'))==='6231ccfa6c67dea65abd9bb9597f14448ddc9f285be949e4efa026978e1d4419');
 check('inherited-sums-pin',hash(resolve(B,'machine/SHA256SUMS.txt'))==='9a261eb4df7bf3be5cf1e23f7fb2bd7079c67ca481fc55dccc7049ac52d325cc');
 const trust=json(resolve(ROOT,'references/owner-trust/v0.9.4/package-release-trust-store.json'));const trusted=trust.keys.find(k=>k.keyId==='landometer.release.2026-09-23.01');const spki=createPublicKey(trusted.publicKeySpkiPem).export({type:'spki',format:'der'});check('base-public-key-SPKI-pin',createHash('sha256').update(spki).digest('hex')==='0242a576a012482bdbced2992e143f219fbc4cfc47881acd2f4bb49fa89efcab');
 const child=spawnSync(process.execPath,[resolve(B,'machine/validate-v0.9.4.mjs'),'--package-trust-store',resolve(ROOT,'references/owner-trust/v0.9.4/package-release-trust-store.json'),'--package-trust-policy',resolve(ROOT,'references/owner-trust/v0.9.4/package-release-trust-policy.json')],{cwd:resolve(B,'machine'),encoding:'utf8',maxBuffer:8e6});
 check('inherited-base-signed-validation',child.status===0&&/Validation passed: 5784 checks/.test(child.stdout),child.status===0?child.stdout.trim().split('\n').at(-1):(child.stderr||child.stdout).slice(-2000));
 for(const key of ['brand','atmosphere','foundation','semanticState','map','typography','icon','control','theme','layout','motion','constraints'])check('preserved:'+key,eq(tokens[key],base[key]));
 const brand=readFileSync(resolve(P,'brand/BRAND.md'),'utf8'),master=readFileSync(resolve(B,'machine/Landometer Design System v0.9.4.md'),'utf8');check('exact-brand-voice-and-protected-lines',brand.includes(master.slice(master.indexOf('## 4. Brand, voice'),master.indexOf('### 4.3 Identity roles'))));
 for(const file of readdirSync(resolve(P,'build-kit/assets'))){check('exact-inherited-asset:'+file,hash(resolve(P,'build-kit/assets',file))===hash(resolve(B,'machine',file)));}
 check('all40-theme-records',scales.length===40&&new Set(scales.map(s=>s.scaleId+'/'+s.theme)).size===40);
 const css=readFileSync(resolve(P,'machine/color-srgb-08.production.css'),'utf8'),declarations=Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
 let minClass=Infinity,minDark=Infinity;
 for(const s of scales){const id=s.scaleId+'/'+s.theme,src=approved.scales.find(x=>x.id===s.scaleId)?.themes[s.theme];check(id+':approved-LUT',eq(s.lut,src?.lut));check(id+':41-exact',s.lut.length===41&&s.lut.every(h=>/^#[0-9A-F]{6}$/.test(h)));
  const L=s.lut.map(h=>toLab(h)[0]),monotonic=(arr,dir)=>arr.slice(1).every((v,i)=>(v-arr[i])*dir>0);check(id+':lightness',s.kind==='sequential'?monotonic(L,s.theme==='light'?-1:1):monotonic(L.slice(0,21),s.theme==='light'?1:-1)&&monotonic(L.slice(20),s.theme==='light'?-1:1));
  const hue=s.lut.flatMap((h,i)=>hueVerdict(h,s.theme).findings.map(f=>({hex:h,index:i,...f})));check(id+':hue-windows',hue.every(x=>x.severity!=='fail'));warnings.push(...hue.filter(x=>x.severity==='warning').map(x=>({id,...x})));
  if(s.kind==='sequential'&&s.theme==='dark'){const c=cr(s.lut[0],s.canvas);minDark=Math.min(minDark,c);check(id+':dark-low-contrast',c>=3);}
  for(const n of [3,5,7,9]){const expected=Array.from({length:n},(_,i)=>s.lut[Math.round(i*40/(n-1))]),actual=s.classes[n];check(id+':classes-'+n,eq(expected,actual));const min=Math.min(...actual.slice(1).map((h,i)=>dE(h,actual[i])));minClass=Math.min(minClass,min);check(id+':class-separation-'+n,min>=2.2);for(const [i,h]of actual.entries())check(id+`:css-class-${n}-${i+1}`,declarations[`--ldm-scale-${slug(s.scaleId)}-${s.theme}-class-${n}-${i+1}`]===h);}
  s.lut.forEach((h,i)=>check(id+':css-lut-'+i,declarations[`--ldm-scale-${slug(s.scaleId)}-${s.theme}-lut-${String(i).padStart(2,'0')}`]===h));
 }
 const series=registry.values.series.values;check('ten-stable-series',series.length===10&&series.every((s,i)=>s.id===`series.${String(i+1).padStart(2,'0')}`));
 for(const s of series){const ap=approved.series.find(x=>x.id===s.id),old=base.categoricalSeries.values.find(x=>x.id===s.id);check(s.id+':approved-colors',eq(s.light,ap.light)&&eq(s.dark,ap.dark));check(s.id+':light-unchanged',s.light.fill===old.light.fill&&s.light.ink===old.light.ink&&s.light.vivid===old.altFill.light);check(s.id+':cue-preserved',s.cue===old.cue&&s.name===old.name);check(s.id+':dark-ink-contrast',cr(s.dark.ink,'#11191D')>=4.5);for(const theme of ['light','dark'])for(const tier of ['fill','ink','vivid'])check(s.id+`:${theme}-${tier}-css`,declarations[`--ldm-series-${s.id.slice(-2)}-${tier}-${theme}`]===s[theme][tier]);}
 check('no-deprecated-atomic-css',!Object.keys(declarations).some(k=>/^--ldm-series-\d+-(light|dark)$/.test(k)||k.startsWith('--ldm-product-ijji-')));
 const compact=json(resolve(P,'machine/color-registry.json'));check('compact-registry-parity',eq(compact.scales,approved.scales)&&eq(compact.series,series)&&eq(compact.gradients,approved.gradients)&&eq(compact.foundation,approved.foundation));
 const aliases=readFileSync(resolve(P,'build-kit/lds-0.9.5-ext.css'),'utf8'),vars=new Set([...aliases.matchAll(/(--[\w-]+):/g)].map(m=>m[1]));check('all-build-kit-aliases-resolve',[...aliases.matchAll(/var\((--[\w-]+)\)/g)].every(m=>vars.has(m[1])||Object.hasOwn(declarations,m[1])));
 const dtcg=json(resolve(P,'machine/lds-0.9.5.tokens.dtcg.json'));check('DTCG-parity',Object.entries(declarations).filter(([,v])=>/^#[0-9A-F]{6}$/.test(v)).every(([k,v])=>dtcg.colors[k.replace('--ldm-','')]?.$extensions?.landometer?.hex===v));
 const failed=checks.filter(x=>!x.pass);return {releaseRef:'v0.9.5-owner.1',status:failed.length?'FAIL':'PASS',checks:checks.length,passed:checks.length-failed.length,failed,warnings,minimumAdjacentClassDeltaE:minClass,minimumDarkSequentialLowContrast:minDark,signatureStatus:'unsigned-owner-approved',scope:'Package parity, inherited signed base, analytical math and CSS projection only. No artifact or team-installation conformance claim.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{const r=verifyPackage();console.log(process.argv.includes('--json')?JSON.stringify(r,null,2):`${r.status}: ${r.passed}/${r.checks} checks; DS0.9.5 / color-srgb-08 / v0.9.5-owner.1; unsigned owner distribution.\n${r.failed.map(f=>f.id+': '+(f.detail??'failed')).join('\n')}${r.warnings.length?`\nWarnings: ${r.warnings.length}`:''}`);process.exitCode=r.status==='PASS'?0:1;}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}}
