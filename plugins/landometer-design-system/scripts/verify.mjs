#!/usr/bin/env node
import {readFileSync,existsSync,readdirSync,statSync,lstatSync,realpathSync} from 'node:fs';
import {resolve,dirname,relative,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash,createPublicKey} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {toLab,dE,cr,hueVerdict,BANNED} from '../references/inherited/lds-0.9.4/machine/validate-dataviz-gates-0.9.4.mjs';
import {readNormative} from './read-normative.mjs';
import {validateSchema} from './schema-helpers.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..'),P=resolve(ROOT,'assets/lds-0.9.7'),B=resolve(ROOT,'references/inherited/lds-0.9.4');
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
  if(pluginPaths.every(file=>existsSync(file)))check('current-plugin-distribution',pluginPaths.map(json).every(m=>m.version==='0.9.7'&&m.description.includes('separate product Add-ons')&&!m.description.includes('product editions')));
 }
 const source=resolve(ROOT,'references/approved-0.9.7.json');check('approved-097-snapshot-exact',hash(source)==='a1f8d12b7efb4f782f04c19057cd95d424143b12c86c5c5991bd91b01e37ccb0');check('historical-R2.1-exact',hash(resolve(ROOT,'references/approved-r2.1.json'))==='ebe57188c0824577628f8913a62f1c0794d1522214c54af63703281dfb07e011');
 const approved=json(source),manifest=json(resolve(P,'machine/release.json')),tokens=json(resolve(P,'machine/tokens.v0.9.7.json')),registry=json(resolve(P,'machine/color-srgb-10.tokens.json')),scales=json(resolve(P,'machine/color-srgb-10.scales.json')).scales,base=json(resolve(B,'machine/tokens.v0.9.4.json')),policy=json(resolve(P,'machine/policy.json'));
 check('no-superseded-dark-narratives',scales.every(s=>!/The dark ramp follows|Dark high is luminous|increasing lightness/i.test(s.designNote)));
 check('exact-identity',manifest.release.dsVersion==='0.9.7'&&manifest.release.releaseRef==='v0.9.7-owner.1'&&manifest.release.colorSetId==='color-srgb-10');
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
 const css=readFileSync(resolve(P,'machine/color-srgb-10.production.css'),'utf8'),declarations=Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
 let minClass=Infinity,minDark=Infinity;
 for(const s of scales){const id=s.scaleId+'/'+s.theme,src=approved.scales.find(x=>x.id===s.scaleId)?.themes[s.theme];check(id+':approved-LUT',eq(s.lut,src?.lut));check(id+':41-exact',s.lut.length===41&&s.lut.every(h=>/^#[0-9A-F]{6}$/.test(h)));
  const L=s.lut.map(h=>toLab(h)[0]),monotonic=(arr,dir)=>arr.slice(1).every((v,i)=>(v-arr[i])*dir>0);check(id+':lightness',s.kind==='sequential'?monotonic(L,-1):monotonic(L.slice(0,21),1)&&monotonic(L.slice(20),-1));
  const hue=s.lut.flatMap((h,i)=>hueVerdict(h,s.theme).findings.map(f=>({hex:h,index:i,...f})));check(id+':hue-windows',hue.every(x=>x.severity!=='fail'));check(id+':truthful-hue-warning-metadata',eq(src.hueWarnings,hue.filter(x=>x.severity==='warning')));warnings.push(...hue.filter(x=>x.severity==='warning').map(x=>({id,...x})));
  if(s.theme==='dark')minDark=Math.min(minDark,...s.lut.map(h=>cr(h,s.canvas))); // Informational only: owner selected unchanged light HEX on dark.
  for(const n of [3,5,7,9]){const expected=Array.from({length:n},(_,i)=>s.lut[Math.round(i*40/(n-1))]),actual=s.classes[n];check(id+':classes-'+n,eq(expected,actual));const min=Math.min(...actual.slice(1).map((h,i)=>dE(h,actual[i])));minClass=Math.min(minClass,min);check(id+':class-separation-'+n,min>=2.2);for(const [i,h]of actual.entries())check(id+`:css-class-${n}-${i+1}`,declarations[`--ldm-scale-${slug(s.scaleId)}-${s.theme}-class-${n}-${i+1}`]===h);}
  s.lut.forEach((h,i)=>check(id+':css-lut-'+i,declarations[`--ldm-scale-${slug(s.scaleId)}-${s.theme}-lut-${String(i).padStart(2,'0')}`]===h));
 }
 const series=registry.values.series.values;check('ten-stable-series',series.length===10&&series.every((s,i)=>s.id===`series.${String(i+1).padStart(2,'0')}`));
 for(const s of series){const ap=approved.series.find(x=>x.id===s.id),old=base.categoricalSeries.values.find(x=>x.id===s.id);check(s.id+':approved-colors',eq(s.light,ap.light)&&eq(s.dark,ap.dark));check(s.id+':light-unchanged',s.light.fill===old.light.fill&&s.light.ink===old.light.ink&&s.light.vivid===old.altFill.light);check(s.id+':cue-preserved',s.cue===old.cue&&s.name===old.name);check(s.id+':dark-ink-contrast',cr(s.dark.ink,'#11191D')>=4.5);for(const theme of ['light','dark'])for(const tier of ['fill','ink','vivid'])check(s.id+`:${theme}-${tier}-css`,declarations[`--ldm-series-${s.id.slice(-2)}-${tier}-${theme}`]===s[theme][tier]);}
 check('no-deprecated-atomic-css',!Object.keys(declarations).some(k=>/^--ldm-series-\d+-(light|dark)$/.test(k)||k.startsWith('--ldm-product-ijji-')));
 const compact=json(resolve(P,'machine/color-registry.json'));check('compact-registry-parity',eq(compact.scales,approved.scales)&&eq(compact.series,series)&&eq(compact.gradients,approved.gradients)&&eq(compact.foundation,approved.foundation));
 const aliases=readFileSync(resolve(P,'build-kit/lds-0.9.7-ext.css'),'utf8'),vars=new Set([...aliases.matchAll(/(--[\w-]+):/g)].map(m=>m[1]));check('all-build-kit-aliases-resolve',[...aliases.matchAll(/var\((--[\w-]+)\)/g)].every(m=>vars.has(m[1])||Object.hasOwn(declarations,m[1])));
 const dtcg=json(resolve(P,'machine/lds-0.9.7.tokens.dtcg.json'));check('DTCG-parity',Object.entries(declarations).filter(([,v])=>/^#[0-9A-F]{6}$/.test(v)).every(([k,v])=>dtcg.colors[k.replace('--ldm-','')]?.$extensions?.landometer?.hex===v));
 // Installed plugins validate the shared standalone base and its separate product Add-ons.
 const documentSet=json(resolve(P,'normative/document-set.json'));
 check('standalone-base-and-three-addons',eq(documentSet.documents.map(d=>d.product),['landometer','ijji','citychat','citywiki']));
 const coreCatalog=json(resolve(B,'machine/rule-catalog.json'));
 const baseFile='Landometer-Design-System-v0.9.7.md',basePath=resolve(P,'normative',baseFile),baseHash=documentSet.documents.find(doc=>doc.product==='landometer')?.files.find(file=>file.path===baseFile)?.sha256;
 const addonFiles={ijji:'ijji-Add-on-v0.5.5-for-LDS-v0.9.7',citychat:'CityChat-Add-on-v0.9.2-for-LDS-v0.9.7',citywiki:'CityWiki-Add-on-v1.0.0-for-LDS-v0.9.7'};
 check('standalone-base-byte-identity',/^[a-f0-9]{64}$/.test(baseHash??'')&&hash(basePath)===baseHash);
 check('standalone-final-revision',documentSet.revision==='standalone-0.9.7-r1');
 for(const doc of documentSet.documents){
  const prefix='standalone:'+doc.product+':';
  check(prefix+'two-alternative-projections',doc.files.length===2&&doc.files.some(f=>f.path.endsWith('.md'))&&doc.files.some(f=>f.path.endsWith('.json')));
  for(const f of doc.files){const p=resolve(P,'normative',f.path);check(prefix+'file:'+f.path,!f.path.includes('/')&&existsSync(p)&&statSync(p).size===f.bytes&&hash(p)===f.sha256);}
  const md=doc.files.find(f=>f.path.endsWith('.md')),js=doc.files.find(f=>f.path.endsWith('.json'));
  const parsed=readNormative(resolve(P,'normative',md.path)),mirror=readNormative(resolve(P,'normative',js.path));
  const machine=parsed.machine;
  check(prefix+'lossless-human-machine-parity',eq(parsed,mirror));
  check(prefix+'document-identity',parsed.document.documentId===doc.documentId&&parsed.document.product===doc.product&&parsed.document.documentRevision==='standalone-0.9.7-r1'&&doc.kind===(doc.product==='landometer'?'base':'addon'));
  if(doc.product!=='landometer'){
   const binding=machine.baseDocument;
   check(prefix+'visible-current-revision',parsed.humanMarkdown.slice(0,3000).includes('**เอกสารปัจจุบัน / Current document revision:** `standalone-0.9.7-r1`')&&parsed.humanMarkdown.slice(0,3000).includes(parsed.document.documentId)&&parsed.humanMarkdown.includes('original consolidation history only'));
   check(prefix+'current-addon-id',parsed.document.documentId===doc.product+'-addon-'+parsed.document.productVersion+'-lds-0.9.7-r1');
   check(prefix+'separate-addon',parsed.document.documentKind==='addon'&&parsed.document.requiredNormativeFiles===2&&machine.release.normativeDependency===baseFile);
   check(prefix+'exact-filenames',md.path===addonFiles[doc.product]+'.md'&&js.path===addonFiles[doc.product]+'.json');
   check(prefix+'exact-base-binding',binding?.path===baseFile&&binding?.sha256===baseHash&&binding?.sha256===hash(basePath)&&binding?.documentId==='lds-0.9.7-landometer-standalone-r1');
   check(prefix+'current-identity',binding?.dsVersion==='0.9.7'&&binding?.releaseRef==='v0.9.7-owner.1'&&binding?.colorSetId==='color-srgb-10'&&machine.release.dsVersion==='0.9.7'&&machine.release.releaseRef==='v0.9.7-owner.1'&&machine.release.colorSetId==='color-srgb-10');
   check(prefix+'unsigned-boundary',machine.release.signatureStatus==='unsigned'&&machine.release.signedRelease===false);
   check(prefix+'no-base-duplication',['tokens','ruleCatalog','analyticalScales','colorRegistry','schemas','contracts','assetFiles'].every(key=>!Object.hasOwn(machine,key)));
   const profile=resolve(ROOT,'references/standalone-product-profiles-0.9.7',doc.product+'.md');
   check(prefix+'complete-product-profile',Boolean(machine.productProfile)&&machine.productProfile.document.sha256===hash(profile)&&parsed.humanMarkdown.endsWith(readFileSync(profile,'utf8').trimEnd()+'\n'));
   check(prefix+'product-provenance',Array.isArray(machine.productProfileSources)&&machine.productProfileSources.length===2);
   for(const source of machine.productProfileSources??[]){const p=resolve(ROOT,source.path);check(prefix+'product-source:'+source.path,p.startsWith(ROOT+sep)&&existsSync(p)&&hash(p)===source.sha256&&statSync(p).size===source.bytes);}
   continue;
  }
  check(prefix+'one-complete-base',md.path===baseFile&&parsed.document.documentId==='lds-0.9.7-landometer-standalone-r1'&&parsed.document.requiredNormativeFiles===1&&machine.release.normativeDependency==='none');
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
 // 0.9.7 scope: exact owner-approved LIGHT values on both themes, plus a separate Location profile.
 const storyPath=resolve(ROOT,'references/approved-story-r4.json'),locationPath=resolve(ROOT,'references/approved-location-r2.json'),semPath=resolve(ROOT,'references/approved-location-metrics.json'),previousPath=resolve(ROOT,'assets/lds-0.9.6');
 check('approved-story-R4-bytes',hash(storyPath)==='be696bc8f41520f85167678634407838ac5ed5c9bb9a802585146b0b2f36415f');
 check('approved-location-R2-bytes',hash(locationPath)==='0906c14107ef20a2a42a5d1c830ffa56c0a88caca34d54096dc58b346faba279');
 check('approved-location-semantics-bytes',hash(semPath)==='44ad44d254262932812b61a5ca9e7a4b27c6ec89c7bfdc7da9eb0bb081a387e7');
 const story=json(storyPath),locationSource=json(locationPath),semanticsSource=json(semPath),previousTokens=json(resolve(previousPath,'machine/tokens.v0.9.6.json')),previousRegistry=json(resolve(previousPath,'machine/color-srgb-09.tokens.json'));
 const luminance=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};
 for(const s of scales){const owner=story.scales.find(p=>p.scaleId===s.scaleId&&p.theme==='light'),other=scales.find(p=>p.scaleId===s.scaleId&&p.theme!==s.theme),id=s.scaleId+'/'+s.theme;
  for(const key of ['anchors','knots','positions','lut','classes'])check(id+':owner-light-exact-'+key,eq(s[key],owner[key]));
  for(const key of ['anchors','lut','classes'])check(id+':both-themes-exact-'+key,eq(s[key],other[key]));
  check(id+':explicit-three-anchors',eq(s.anchors,[s.lut[0],s.lut[20],s.lut[40]])&&eq(s.positions,[0,20,40]));
  const Y=s.lut.map(luminance),monotonic=(arr,dir)=>arr.slice(1).every((v,i)=>(v-arr[i])*dir>0);check(id+':relative-luminance-direction',s.kind==='sequential'?monotonic(Y,-1):monotonic(Y.slice(0,21),1)&&monotonic(Y.slice(20),-1));
  const projected=tokens.analyticalScales[s.scaleId];check(id+':token-anchor-parity',eq(projected[s.theme],s.anchors)&&projected.lutRef==='color-srgb-10.scales.json');
  s.anchors.forEach((h,i)=>check(id+':css-anchor-'+i,declarations[`--ldm-scale-${slug(s.scaleId)}-${s.theme}-anchor-${i+1}`]===h));
 }
 for(const key of ['brand','atmosphere','foundation','semanticState','dataState','map','typography','icon','control','theme','layout','motion','constraints','socialPreview','evidenceCard','categoricalSeries'])check('unchanged096:'+key,eq(tokens[key],previousTokens[key]));
 for(const [key,value]of Object.entries(previousRegistry.values))if(key!=='scaleRegistry')check('unchanged096-registry:'+key,eq(registry.values[key],value));
 const previousCss=Object.fromEntries([...readFileSync(resolve(previousPath,'machine/color-srgb-09.production.css'),'utf8').matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
 check('CSS-existing-non-analytical-declarations-unchanged',Object.entries(previousCss).filter(([k])=>!k.startsWith('--ldm-scale-')).every(([k,v])=>declarations[k]===v));
 const palette=registry.values.supportingPalette;check('supporting-palette-17-unique-IDs-and-HEX',palette.length===17&&new Set(palette.map(x=>x.id)).size===17&&new Set(palette.map(x=>x.hex)).size===17);check('supporting-original10-exact',eq(palette.slice(0,10),story.supportingPalette));check('supporting-seven-owner-accents',eq(palette.slice(10).map(x=>x.hex),locationSource.roles.filter(r=>r.baseVocabulary.kind==='location-extension').map(r=>r.light.hex)));
 for(const color of palette){check('story-css:'+color.id,declarations['--ldm-story-'+color.id]===color.hex);check('story-hue:'+color.id,!hueVerdict(color.hex,'light').findings.some(x=>x.severity==='fail'));}
 const li=json(resolve(P,'machine/location-intelligence-0.9.7.json')),liCss=Object.fromEntries([...readFileSync(resolve(P,'machine/location-intelligence-0.9.7.css'),'utf8').matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
 check('location-exact-base-binding',li.baseDocument?.sha256===baseHash&&li.baseDocument?.path===baseFile);
 check('location-16-metrics-preserved',eq(li.semantics.metrics,semanticsSource.metrics)&&li.roles.length===16&&li.scales.length===24);
 check('location-four-SWOT-no-gradients',li.semantics.metrics.filter(m=>m.useScale==='none').length===4&&li.scales.every(r=>li.semantics.metrics.find(m=>m.id===r.scaleId)?.useScale===r.kind));
 check('location-readiness-budget-and-intent',/ทั้งงบ/.test(li.semantics.metrics.find(m=>m.id==='li.spending_readiness').numerator)&&/เจตนาซื้อ/.test(li.semantics.metrics.find(m=>m.id==='li.spending_readiness').numerator));
 for(const role of li.roles){const original=locationSource.roles.find(r=>r.id===role.id);check('location-role-original-light:'+role.id,role.light.hex===original.light.hex&&role.dark.hex===original.light.hex&&!role.dark.formula);for(const theme of ['light','dark'])check('location-role-css:'+role.id+'/'+theme,liCss[`--ldm-${slug(role.id)}-${theme}`]===role[theme].hex);}
 for(const r of li.scales){const key=r.scaleId+'/'+r.theme,src=locationSource.scales.find(s=>s.scaleId===r.scaleId&&s.theme==='light');check('location-scale-owner-light:'+key,eq(r.anchors,src.anchors)&&eq(r.lut,src.lut41)&&eq(r.classes,src.classes));check('location-scale-hues:'+key,r.lut.every(h=>!hueVerdict(h,r.theme).findings.some(x=>x.severity==='fail')));warnings.push(...r.lut.flatMap((h,i)=>hueVerdict(h,r.theme).findings.filter(f=>f.severity==='warning').map(f=>({id:key,hex:h,index:i,...f}))));const ordered=(a,d)=>a.slice(1).every((v,i)=>(v-a[i])*d>0);for(const [space,values]of [['OKLab-L',r.lut.map(h=>toLab(h)[0])],['relative-Y',r.lut.map(luminance)]])check('location-direction:'+key+'/'+space,r.kind==='sequential'?ordered(values,-1):ordered(values.slice(0,21),1)&&ordered(values.slice(20),-1));check('location-three-exact-anchors:'+key,eq(r.anchors,[r.lut[0],r.lut[20],r.lut[40]]));for(const n of [3,5,7,9]){check('location-scale-classes:'+key+'/'+n,eq(r.classes[n],Array.from({length:n},(_,i)=>r.lut[Math.round(i*40/(n-1))])));const minimum=Math.min(...r.classes[n].slice(1).map((h,i)=>dE(h,r.classes[n][i])));check('location-class-separation:'+key+'/'+n,minimum>=2.2);minClass=Math.min(minClass,minimum);for(const [i,h]of r.classes[n].entries())check('location-class-css:'+key+'/'+n+'/'+i,liCss[`--ldm-location-scale-${slug(r.scaleId)}-${r.theme}-class-${n}-${i+1}`]===h);}if(r.theme==='dark')minDark=Math.min(minDark,...r.lut.map(h=>cr(h,'#11191D')));r.lut.forEach((h,i)=>check('location-lut-css:'+key+'/'+i,liCss[`--ldm-location-scale-${slug(r.scaleId)}-${r.theme}-lut-${String(i).padStart(2,'0')}`]===h));}
 for(const record of [...li.roles,...li.scales]){const match=record.semanticRef?.match(/^#\/semantics\/metrics\/(\d+)$/);check('location-delivered-semantic-reference:'+(record.id??record.scaleId)+'/'+(record.theme??'role'),Boolean(match)&&li.semantics.metrics[Number(match[1])]?.id===(record.id??record.scaleId));}
 const actualAliases=li.scales.flatMap(s=>scales.filter(b=>b.theme===s.theme&&eq(s.lut,b.lut)).map(b=>[s.scaleId,b.scaleId,s.theme]));check('location-intentional-aliases-complete',eq(li.intentionalVisualAliases.map(x=>[x.locationScale,x.storyScale,x.theme]),actualAliases));
 const profileEntry=documentSet.profiles?.[0];check('separate-location-profile',documentSet.profiles?.length===1&&profileEntry.product==='location-intelligence');
 if(profileEntry){for(const f of profileEntry.files)check('location-profile-file:'+f.path,hash(resolve(P,'normative',f.path))===f.sha256);const md=readNormative(resolve(P,'normative',profileEntry.files.find(f=>f.path.endsWith('.md')).path)),mirror=readNormative(resolve(P,'normative',profileEntry.files.find(f=>f.path.endsWith('.json')).path));check('location-profile-lossless',eq(md,mirror)&&eq(md.machine.locationProfile,li));check('location-profile-no-base-duplication',!md.machine.ruleCatalog&&!md.machine.tokens&&md.machine.baseDocument.sha256===baseHash);}
 for(const line of readFileSync(resolve(previousPath,'SHA256SUMS.txt'),'utf8').trim().split('\n')){const m=line.match(/^([a-f0-9]{64})  (assets\/lds-0\.9\.6\/.+)$/);if(m)check('historical096-asset:'+m[2],hash(resolve(ROOT,m[2]))===m[1]);}
 for(const [key,value]of Object.entries(declarations).filter(([,v])=>/^#[0-9A-F]{6}$/.test(v))){const token=dtcg.colors[key.replace('--ldm-','')];check('DTCG-components:'+key,token?.$value?.colorSpace==='srgb'&&token.$value.alpha===1&&eq(token.$value.components,[1,3,5].map(i=>parseInt(value.slice(i,i+2),16)/255)));}
 const density=['density.area','density.capita','density.household','built'];
 for(const theme of ['light','dark'])for(let i=0;i<density.length;i++)for(let j=i+1;j<density.length;j++){const a=scales.find(s=>s.scaleId===density[i]&&s.theme===theme).classes['9'],b=scales.find(s=>s.scaleId===density[j]&&s.theme===theme).classes['9'];const mean=a.reduce((n,h,k)=>n+dE(h,b[k]),0)/9;check(`density-nonidentical:${theme}:${density[i]}/${density[j]}`,!eq(a,b));if(mean<10)warnings.push({id:'density-family-similarity',theme,pair:[density[i],density[j]],meanDeltaE:mean,remedy:'Keep explicit denominator labels; color alone does not identify a metric.'});}
 for(const doc of documentSet.documents.filter(d=>d.kind==='addon')){const data=readNormative(resolve(P,'normative',doc.files.find(f=>f.path.endsWith('.md')).path)).machine;check('addon-current-required-foundation:'+doc.product,data.productProfile.externalDesignRuleDocumentsRequired.every(x=>x.role!=='shared_foundation'||x.dsVersion==='0.9.7'&&x.markdownUrl.includes('/v0.9.7/')));}
 const failed=checks.filter(x=>!x.pass);return {releaseRef:'v0.9.7-owner.1',status:failed.length?'FAIL':'PASS',checks:checks.length,passed:checks.length-failed.length,failed,warnings,minimumAdjacentClassDeltaE:minClass,minimumDarkAnalyticalCanvasContrast:minDark,signatureStatus:'unsigned-owner-approved',scope:'Package parity, theme-invariant Story and Location light values, inherited signed source, analytical math, CSS projection and standalone document/schema consistency only. No artifact or team-installation conformance claim.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{const r=verifyPackage();console.log(process.argv.includes('--json')?JSON.stringify(r,null,2):`${r.status}: ${r.passed}/${r.checks} checks; DS0.9.7 / color-srgb-10 / v0.9.7-owner.1; unsigned owner distribution.\n${r.failed.map(f=>f.id+': '+(f.detail??'failed')).join('\n')}${r.warnings.length?`\nWarnings: ${r.warnings.length}`:''}`);process.exitCode=r.status==='PASS'?0:1;}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}}
