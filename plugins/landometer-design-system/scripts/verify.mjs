#!/usr/bin/env node
import {readFileSync,existsSync,readdirSync,statSync,lstatSync,realpathSync} from 'node:fs';
import {resolve,dirname,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash,createPublicKey} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {toLab,dE,cr,hueVerdict,BANNED} from '../references/inherited/lds-0.9.4/machine/validate-dataviz-gates-0.9.4.mjs';
import {readNormative} from './read-normative.mjs';
import {validateSchema} from './schema-helpers.mjs';
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
 // A flattened filesystem skill intentionally omits plugin-manager manifests.
 const pluginPaths=['plugin.json','.codex-plugin/plugin.json','.claude-plugin/plugin.json'].map(file=>resolve(ROOT,file));
 const flattenedSkill=existsSync(resolve(ROOT,'SKILL.md'))&&!existsSync(resolve(ROOT,'skills/apply-landometer-design-system/SKILL.md'));
 if(flattenedSkill)check('flattened-skill-without-plugin-manager-metadata',pluginPaths.every(file=>!existsSync(file)));
 else{
  check('complete-plugin-manifests',pluginPaths.every(file=>existsSync(file)));
  if(pluginPaths.every(file=>existsSync(file)))check('current-plugin-distribution',pluginPaths.map(json).every(m=>m.version==='0.9.5+standalone.3.docs1'&&m.description.includes('separate product Add-ons')&&!m.description.includes('product editions')));
 }
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
 // Installed plugins validate the shared standalone base and its separate product Add-ons.
 const documentSet=json(resolve(P,'normative/document-set.json'));
 check('standalone-base-and-three-addons',eq(documentSet.documents.map(d=>d.product),['landometer','ijji','citychat','citywiki']));
 const coreCatalog=json(resolve(B,'machine/rule-catalog.json'));
 const baseFile='Landometer-Design-System-v0.9.5.md',basePath=resolve(P,'normative',baseFile),baseHash=documentSet.documents.find(doc=>doc.product==='landometer')?.files.find(file=>file.path===baseFile)?.sha256;
 const addonFiles={ijji:'ijji-Add-on-v0.5.5-for-LDS-v0.9.5',citychat:'CityChat-Add-on-v0.9.2-for-LDS-v0.9.5',citywiki:'CityWiki-Add-on-v1.0.0-for-LDS-v0.9.5'};
 check('standalone-base-byte-identity',/^[a-f0-9]{64}$/.test(baseHash??'')&&hash(basePath)===baseHash);
 check('standalone-final-revision',documentSet.revision==='standalone-0.9.5-r3');
 for(const doc of documentSet.documents){
  const prefix='standalone:'+doc.product+':';
  check(prefix+'two-alternative-projections',doc.files.length===2&&doc.files.some(f=>f.path.endsWith('.md'))&&doc.files.some(f=>f.path.endsWith('.json')));
  for(const f of doc.files){const p=resolve(P,'normative',f.path);check(prefix+'file:'+f.path,!f.path.includes('/')&&existsSync(p)&&statSync(p).size===f.bytes&&hash(p)===f.sha256);}
  const md=doc.files.find(f=>f.path.endsWith('.md')),js=doc.files.find(f=>f.path.endsWith('.json'));
  const parsed=readNormative(resolve(P,'normative',md.path)),mirror=readNormative(resolve(P,'normative',js.path));
  const machine=parsed.machine;
  check(prefix+'lossless-human-machine-parity',eq(parsed,mirror));
  check(prefix+'document-identity',parsed.document.documentId===doc.documentId&&parsed.document.product===doc.product&&parsed.document.documentRevision==='standalone-0.9.5-r3'&&doc.kind===(doc.product==='landometer'?'base':'addon'));
  if(doc.product!=='landometer'){
   const binding=machine.baseDocument;
   check(prefix+'visible-current-revision',parsed.humanMarkdown.slice(0,3000).includes('**เอกสารปัจจุบัน / Current document revision:** `standalone-0.9.5-r3`')&&parsed.humanMarkdown.slice(0,3000).includes(parsed.document.documentId)&&parsed.humanMarkdown.includes('original consolidation history only'));
   check(prefix+'separate-addon',parsed.document.documentKind==='addon'&&parsed.document.requiredNormativeFiles===2&&machine.release.normativeDependency===baseFile);
   check(prefix+'exact-filenames',md.path===addonFiles[doc.product]+'.md'&&js.path===addonFiles[doc.product]+'.json');
   check(prefix+'exact-base-binding',binding?.path===baseFile&&binding?.sha256===baseHash&&binding?.sha256===hash(basePath)&&binding?.documentId==='lds-0.9.5-landometer-standalone-r3');
   check(prefix+'current-identity',binding?.dsVersion==='0.9.5'&&binding?.releaseRef==='v0.9.5-owner.1'&&binding?.colorSetId==='color-srgb-08'&&machine.release.dsVersion==='0.9.5'&&machine.release.releaseRef==='v0.9.5-owner.1'&&machine.release.colorSetId==='color-srgb-08');
   check(prefix+'unsigned-boundary',machine.release.signatureStatus==='unsigned'&&machine.release.signedRelease===false);
   check(prefix+'no-base-duplication',['tokens','ruleCatalog','analyticalScales','colorRegistry','schemas','contracts','assetFiles'].every(key=>!Object.hasOwn(machine,key)));
   const profile=resolve(ROOT,'references/standalone-product-profiles',doc.product+'.md');
   check(prefix+'complete-product-profile',Boolean(machine.productProfile)&&machine.productProfile.document.sha256===hash(profile)&&parsed.humanMarkdown.endsWith(readFileSync(profile,'utf8').trimEnd()+'\n'));
   check(prefix+'product-provenance',Array.isArray(machine.productProfileSources)&&machine.productProfileSources.length===2);
   for(const source of machine.productProfileSources??[]){const p=resolve(ROOT,source.path);check(prefix+'product-source:'+source.path,p.startsWith(ROOT+sep)&&existsSync(p)&&hash(p)===source.sha256&&statSync(p).size===source.bytes);}
   continue;
  }
  check(prefix+'one-complete-base',md.path===baseFile&&parsed.document.documentId==='lds-0.9.5-landometer-standalone-r3'&&parsed.document.requiredNormativeFiles===1&&machine.release.normativeDependency==='none');
  check(prefix+'unsigned-boundary',machine.release.signatureStatus==='unsigned'&&machine.release.signedRelease===false);
  check(prefix+'all64-rules',eq(machine.ruleCatalog.rules.map(r=>r.id).sort(),coreCatalog.rules.map(r=>r.id).sort())&&machine.ruleCatalog.rules.length===64);
  check(prefix+'all139-acceptances',eq(machine.ruleCatalog.rules.flatMap(r=>r.acceptance.map(a=>a.checkId)).sort(),coreCatalog.rules.flatMap(r=>r.acceptance.map(a=>a.checkId)).sort()));
  check(prefix+'exact-approved-color-registry',eq(machine.colorRegistry,registry));
  check(prefix+'exact-approved-scales',eq(machine.analyticalScales.scales,scales));
  for(const key of ['brand','atmosphere','foundation','semanticState','dataState','map','typography','icon','control','theme','layout','categoricalSeries','analyticalScales'])check(prefix+'protected-token:'+key,eq(machine.tokens[key],tokens[key]));
  const banned=machine.policy.analytical.bannedHue;
  check(prefix+'exact-hue-gates',Object.entries(BANNED).every(([key,value])=>eq(banned[key],value)));
  check(prefix+'hue-pointer-resolves',machine.tokens.constraints.forbiddenHueWindows==='machine.policy.analytical.bannedHue'&&Boolean(banned));
  check(prefix+'no-derived-dark-formula',machine.policy.analytical.fixedLutRequired===true&&machine.policy.analytical.runtimeInterpolation==='forbidden'&&machine.tokens.constraints.runtimeDarkAnchorDerivationForbidden===true);
  for(const [name,key]of [['asset-registry.schema.json','assetRegistry'],['motif-register.schema.json','motifRegister'],['format-kits.schema.json','formatKits'],['target-profiles.schema.json','targetProfiles']]){const errors=validateSchema(machine.schemas[name],machine.contracts[key]);check(prefix+'registry-schema:'+key,errors.length===0,errors.slice(0,3).join('; '));}
  for(const [state,value,valid]of [['measured',3,true],['measured',-2,true],['measured',0,false],['measured',null,false],['measured_zero',0,true],['measured_zero',2,false],['no_data',null,true],['no_data',0,false],['out_of_scope',null,true],['suppressed',null,true],['not_yet',null,true]])check(prefix+`state:${state}/${value}`, (validateSchema(machine.schemas['evidence-value.schema.json'],{state,value}).length===0)===valid);
  const sidecar=machine.schemas['social-sidecar.schema.json'];
  const art={artifactId:'artifact-example',artifactBuildId:'build-example',builtAt:'2026-09-30T00:00:00Z',formatProfile:'social_static',targetProfileRef:'target.social.og.1200x630.01',buildCardRef:'build-card.json',buildCardSha256:'a'.repeat(64),creativePath:'og.png',creativeSha256:'b'.repeat(64),creativeMediaType:'image/png',creativeWidthPx:1200,creativeHeightPx:630};
  check(prefix+'og-valid',validateSchema(sidecar.properties.artifact,art,sidecar).length===0);
  check(prefix+'og-wrong-size-blocked',validateSchema(sidecar.properties.artifact,{...art,creativeWidthPx:1080},sidecar).length>0);
  check(prefix+'square-valid',validateSchema(sidecar.properties.artifact,{...art,targetProfileRef:'target.social.square.1080.01',creativeWidthPx:1080,creativeHeightPx:1080},sidecar).length===0);
  check(prefix+'scoped-check-never-full-conformance',machine.schemas['scoped-check-receipt.schema.json'].properties.fullArtifactConformance.const===false&&machine.schemas['conformance-receipt.schema.json'].required.includes('attestationRef'));
  check(prefix+'new-registry-does-not-claim-old-signature',machine.contracts.assetRegistry.approvalAttestationRef===null&&machine.contracts.assetRegistry.approvalAttestationSha256===null);
  const identity=machine.policy.identity;
  check(prefix+'wordmark-colour-permission',identity?.wordmark?.colourChangeAllowed===true&&identity.wordmark.perLetterColourAllowed===true&&identity.wordmark.grayRequired===false&&identity.wordmark.perColourApprovalRequired===false&&identity.wordmark.preserveLetterforms===true&&identity.wordmark.preserveProportions===true);
  check(prefix+'logo-background-scope',identity?.officialLogo?.lightBackgroundAllowed===true&&identity.officialLogo.darkBackgroundAllowed===true&&identity.officialLogo.blanketDarkBan===false&&identity.officialLogo.motifCarrierRulesApply===false&&identity.officialLogo.brandBlueAssessedPerPairing===true);
  check(prefix+'wordmark-human-machine-scope',machine.ruleCatalog.rules.find(r=>r.id==='LOGO-01').requirement.includes('different colour for each letter')&&machine.ruleCatalog.rules.find(r=>r.id==='MOTION-04').acceptance.find(a=>a.checkId==='MOTION-04-A').criterion.includes('wordmark colour changes ตาม LOGO-01 ใช้ได้')&&!parsed.humanMarkdown.includes('identity — ห้าม crop, recolor, distort'));
  check(prefix+'explicit-owner-visual-preference',machine.ruleCatalog.rules.find(r=>r.id==='LAYOUT-01').requirement.includes('bracket')&&machine.policy.sourceRules['LAYOUT-01'].includes('left'));
 }
 const failed=checks.filter(x=>!x.pass);return {releaseRef:'v0.9.5-owner.1',status:failed.length?'FAIL':'PASS',checks:checks.length,passed:checks.length-failed.length,failed,warnings,minimumAdjacentClassDeltaE:minClass,minimumDarkSequentialLowContrast:minDark,signatureStatus:'unsigned-owner-approved',scope:'Package parity, inherited signed source, analytical math, CSS projection and standalone document/schema consistency only. No artifact or team-installation conformance claim.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{const r=verifyPackage();console.log(process.argv.includes('--json')?JSON.stringify(r,null,2):`${r.status}: ${r.passed}/${r.checks} checks; DS0.9.5 / color-srgb-08 / v0.9.5-owner.1; unsigned owner distribution.\n${r.failed.map(f=>f.id+': '+(f.detail??'failed')).join('\n')}${r.warnings.length?`\nWarnings: ${r.warnings.length}`:''}`);process.exitCode=r.status==='PASS'?0:1;}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}}
