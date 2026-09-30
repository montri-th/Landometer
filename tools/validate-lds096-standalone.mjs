#!/usr/bin/env node
import {readFileSync, existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {readNormative} from '../plugins/landometer-design-system/scripts/read-normative.mjs';
import {rulesFromHumanMaster,assertMachineContracts} from './lds096-standalone-machine.mjs';
const root=resolve(import.meta.dirname,'..'),plugin=join(root,'plugins/landometer-design-system'),current=join(plugin,'assets/lds-0.9.6'),dir=join(current,'normative');
const json=p=>JSON.parse(readFileSync(p,'utf8')),sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const failures=[];let checks=0;
const check=(test,label)=>{checks++;if(!test)failures.push(label)};
const set=json(join(dir,'document-set.json'));
const originalCatalog=json(join(plugin,'references/inherited/lds-0.9.4/machine/rule-catalog.json'));
const approvedScales=json(join(current,'machine/color-srgb-09.scales.json'));
const approvedColors=json(join(current,'machine/color-srgb-09.tokens.json'));
const approvedTokens=json(join(current,'machine/tokens.v0.9.6.json'));
check(same(set.documents.map(x=>x.product),['landometer','ijji','citychat','citywiki']),'one shared base and three separate Add-ons');
const baseFile='Landometer-Design-System-v0.9.6.md',basePath=join(dir,baseFile);
const baseHash=set.documents.find(doc=>doc.product==='landometer')?.files.find(file=>file.path===baseFile)?.sha256;
const addonFiles={ijji:'ijji-Add-on-v0.5.5-for-LDS-v0.9.6',citychat:'CityChat-Add-on-v0.9.2-for-LDS-v0.9.6',citywiki:'CityWiki-Add-on-v1.0.0-for-LDS-v0.9.6'};
check(/^[a-f0-9]{64}$/.test(baseHash??'')&&sha(basePath)===baseHash,'complete LDS base matches declared current exact hash');
check(set.revision==='standalone-0.9.6-r1','current0.9.6-r1 document-set revision');
for(const doc of set.documents){
 const md=doc.files.find(f=>f.path.endsWith('.md')),js=doc.files.find(f=>f.path.endsWith('.json'));
 for(const file of doc.files){const p=join(dir,file.path);check(existsSync(p)&&readFileSync(p).length===file.bytes&&sha(p)===file.sha256,doc.product+': manifest bytes '+file.path)}
 const parsed=readNormative(join(dir,md.path)),mirror=readNormative(join(dir,js.path));
 check(same(parsed,mirror),doc.product+': Markdown/JSON lossless parity');
 const {document,humanMarkdown,machine}=parsed;
 check(doc.kind===(doc.product==='landometer'?'base':'addon'),doc.product+': correct document kind');
 check(machine.release.dsVersion==='0.9.6'&&machine.release.releaseRef==='v0.9.6-owner.1'&&machine.release.colorSetId==='color-srgb-09',doc.product+': current LDS identity');
 check(machine.release.signatureStatus==='unsigned'&&machine.release.signedRelease===false,doc.product+': truthful unsigned boundary');
 check(document.documentId===doc.documentId&&document.product===doc.product&&document.documentRevision==='standalone-0.9.6-r1',doc.product+': exact0.9.6-r1 document identity');
 check(!/read (?:the )?(?:full )?inherited master|ต้องอ่าน.*master 0\.9\.4|upload.*eight files/i.test(humanMarkdown),doc.product+': no superseded onboarding');
 check(!/\/Users\/|localhost|127\.0\.0\.1|github_pat_|ghp_[A-Za-z0-9]/.test(humanMarkdown+JSON.stringify(machine)),doc.product+': no local paths or credentials');
 if(doc.product!=='landometer'){
  check(document.documentKind==='addon'&&document.requiredNormativeFiles===2&&machine.release.normativeDependency===baseFile,doc.product+': base plus separate Add-on contract');
  check(md.path===addonFiles[doc.product]+'.md'&&js.path===addonFiles[doc.product]+'.json',doc.product+': exact separately versioned Add-on filenames');
  const binding=machine.baseDocument;
  check(binding?.path===baseFile&&binding?.sha256===baseHash&&binding?.sha256===sha(basePath)&&binding?.documentId==='lds-0.9.6-landometer-standalone-r1',doc.product+': exact base file and content binding');
  check(binding?.dsVersion==='0.9.6'&&binding?.releaseRef==='v0.9.6-owner.1'&&binding?.colorSetId==='color-srgb-09',doc.product+': base identity binding');
  check(['tokens','ruleCatalog','analyticalScales','colorRegistry','schemas','contracts','assetFiles'].every(key=>!Object.hasOwn(machine,key)),doc.product+': no duplicated LDS base');
  check(Boolean(machine.productProfile),doc.product+': product profile embedded');
  check(humanMarkdown.slice(0,3000).includes('**เอกสารปัจจุบัน / Current document revision:** `standalone-0.9.6-r1`')&&humanMarkdown.slice(0,3000).includes(document.documentId)&&humanMarkdown.includes('original consolidation history only'),doc.product+': current human revision and historical consolidation are distinct');
  const expectedProfile=json(join(plugin,'references/standalone-product-profiles-0.9.6',doc.product+'.json'));
  expectedProfile.parentDesignSystem.documentRevision='standalone-0.9.6-r1';
  expectedProfile.parentDesignSystem.publicationTag='v0.9.6';
  check(same(machine.productProfile,expectedProfile),doc.product+': source product rules/values unchanged; only current parent metadata rebound');
  const profilePath=join(plugin,'references/standalone-product-profiles-0.9.6',doc.product+'.md');
  check(machine.productProfile.document.sha256===sha(profilePath),doc.product+': exact product profile hash');
  check(humanMarkdown.endsWith(readFileSync(profilePath,'utf8').trimEnd()+'\n'),doc.product+': complete product prose embedded');
  check(Array.isArray(machine.productProfileSources)&&machine.productProfileSources.length===2,doc.product+': product source provenance');
  for(const source of machine.productProfileSources??[]){const path=join(plugin,source.path);check(existsSync(path)&&sha(path)===source.sha256&&readFileSync(path).length===source.bytes,doc.product+': exact product source '+source.path)}
  continue;
 }
 check(md.path===baseFile&&document.documentId==='lds-0.9.6-landometer-standalone-r1'&&document.requiredNormativeFiles===1&&machine.release.normativeDependency==='none','LDS base: complete without any historical normative dependency');
 const identity=machine.policy.identity;
 check(identity?.wordmark?.colourChangeAllowed===true&&identity.wordmark.perLetterColourAllowed===true&&identity.wordmark.grayRequired===false&&identity.wordmark.perColourApprovalRequired===false,'LDS base: owner-authorized flexible wordmark colour without per-colour approval');
 check(identity?.wordmark?.preserveLetterforms===true&&identity.wordmark.preserveProportions===true&&identity.officialLogo.lightBackgroundAllowed===true&&identity.officialLogo.darkBackgroundAllowed===true&&identity.officialLogo.blanketDarkBan===false&&identity.officialLogo.motifCarrierRulesApply===false&&identity.officialLogo.brandBlueAssessedPerPairing===true,'LDS base: official logo preserves form and permits both backgrounds independently of motif carriers');
 check(humanMarkdown.includes('Gray is an optional versatile default')&&humanMarkdown.includes('MOTIF-06 full/quiet carrier restrictions apply to registered motifs, not official logo PNGs.')&&!humanMarkdown.includes('identity — ห้าม crop, recolor, distort')&&!humanMarkdown.includes('identity PNG ไม่ถูก animate, recolor หรือ redraw'),'LDS base: no superseded blanket wordmark prohibition');
 check(machine.ruleCatalog.rules.find(r=>r.id==='LOGO-01').requirement.includes('different colour for each letter')&&machine.ruleCatalog.rules.find(r=>r.id==='MOTION-04').acceptance.find(a=>a.checkId==='MOTION-04-A').criterion.includes('wordmark colour changes ตาม LOGO-01 ใช้ได้'),'LDS base: colour permission reaches identity and motion machine checks');
 check(!/เลือก edition|product editions already include|product edition.*(?:already|complete LDS)|embedded named-product chapter|เลือกไฟล์เดียวตามผลิตภัณฑ์|ฉบับผลิตภัณฑ์.*(?:รวม LDS|ครบแล้ว)|ฉบับ ijji, CityChat และ CityWiki รวม LDS ครบแล้ว|ไม่ต้องเพิ่ม LDS อีกไฟล์|four one-file editions/i.test(humanMarkdown+JSON.stringify(machine.policy)), 'LDS base: no superseded combined-product installation guidance');
 for(const section of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21])check(new RegExp('^## '+section+'\\. ','m').test(humanMarkdown),doc.product+': retained master chapter '+section);
 check(same(machine.analyticalScales,approvedScales),doc.product+': every approved analytical value and threshold policy is exact');
 check(same(machine.colorRegistry,approvedColors),doc.product+': every approved categorical/foundation color is exact');
 for(const key of ['brand','atmosphere','foundation','semanticState','map','typography','icon','control','theme','layout'])check(same(machine.tokens[key],approvedTokens[key]),doc.product+': unchanged numeric/brand tokens '+key);
 check(machine.analyticalScales.scales.length===40&&machine.analyticalScales.scales.every(x=>x.lut.length===41),doc.product+': full 1640-color LUT');
 const basePart=humanMarkdown.split(/^## Product /m)[0];
 const humanRules=rulesFromHumanMaster(basePart);
 check(same(machine.ruleCatalog.rules.map(x=>x.id).sort(),originalCatalog.rules.map(x=>x.id).sort()),doc.product+': all stable rule IDs preserved');
 for(const rule of machine.ruleCatalog.rules){const hr=humanRules.get(rule.id);check(Boolean(hr)&&rule.requirement===hr.requirement&&same(rule.acceptance,hr.acceptance),doc.product+': exact human/machine rule '+rule.id)}
 assertMachineContracts({ruleCatalog:machine.ruleCatalog,contracts:machine.contracts,schemas:machine.schemas});
 for(const asset of machine.assetFiles)check(existsSync(join(plugin,asset.path))&&sha(join(plugin,asset.path))===asset.sha256,doc.product+': exact asset '+asset.path);
 for(const [name,ptr] of Object.entries(machine.resourceAliases)){let node=parsed;for(const key of ptr.slice(2).split('/'))node=node?.[key];check(node!==undefined,doc.product+': embedded alias resolves '+name)}
}
if(failures.length){console.error(JSON.stringify({status:'FAIL',checks,failures},null,2));process.exit(1)}
console.log(`Standalone LDS0.9.6 PASS: ${checks} checks; one complete LDS base and three separate Add-ons, lossless machine projections, complete rule IDs and exact approved colors/assets. Rendered artifacts and platform retrieval remain separate checks.`);
