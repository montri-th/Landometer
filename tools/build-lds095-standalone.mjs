#!/usr/bin/env node
// A single readable document and its lossless JSON projection share one source.
import {readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, unlinkSync} from 'node:fs';
import {resolve, join, relative} from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {BANNED} from '../plugins/landometer-design-system/references/inherited/lds-0.9.4/machine/validate-dataviz-gates-0.9.4.mjs';
import {buildMachineContracts, assertMachineContracts, normalizeCurrentTokens} from './lds095-standalone-machine.mjs';

const root=resolve(import.meta.dirname,'..');
const plugin=join(root,'plugins/landometer-design-system');
const current=join(plugin,'assets/lds-0.9.5');
const dest=join(current,'normative');
const profileDir=join(plugin,'references/standalone-product-profiles');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const readableMachine=v=>{
 const compact=JSON.stringify(v);
 if(compact.length<=1000||v===null||typeof v!=='object')return compact;
 if(Array.isArray(v))return v.some(x=>x!==null&&typeof x==='object')?'[\n'+v.map(readableMachine).join(',\n')+'\n]':compact;
 return '{\n'+Object.entries(v).map(([k,x])=>JSON.stringify(k)+':'+readableMachine(x)).join(',\n')+'\n}';
};
const readJSON=p=>JSON.parse(readFileSync(p,'utf8'));
const currentJSON=name=>readJSON(join(current,'machine',name));
const sourceRecord=p=>({path:relative(plugin,p).replaceAll('\\','/'),bytes:statSync(p).size,sha256:sha(readFileSync(p))});
const walk=dir=>readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const baseBuild=spawnSync(process.execPath,[join(root,'tools/build-lds095-standalone-master.mjs')],{cwd:root,stdio:'inherit'});
if(baseBuild.status!==0)process.exit(baseBuild.status??1);
mkdirSync(dest,{recursive:true});
for(const ext of ['md','json']){const draft=join(dest,'Landometer-Design-System-v0.9.5-standalone.'+ext);if(existsSync(draft))unlinkSync(draft);}
const baseHuman=readFileSync(join(plugin,'references/standalone-master/Landometer-Design-System-v0.9.5.human.md'),'utf8').trimEnd()+'\n';
const resolved=buildMachineContracts({humanMaster:baseHuman});
assertMachineContracts(resolved);
for(const rule of resolved.ruleCatalog.rules){
 if(rule.fullText){rule.sourceTextSha256=sha(rule.fullText);rule.sourceRuleId=rule.id;delete rule.fullText;}
}
const originalRelease=currentJSON('release.json');
const policy=currentJSON('policy.json');
policy.schemaVersion='lds-standalone-policy-0.9.5-r1';
policy.precedence=[
 'The current standalone document supplies the complete LDS 0.9.5 normative rules and embedded exact machine contracts.',
 'A separate named-product Add-on applies alongside the complete LDS base, only to that product and its declared permitted scope.',
 'Content truth, source evidence, rights and action authority remain independent of visual design authority.',
 'Superseded design-system files are historical only. A historical release is used only when the user explicitly pins historical work.'
];
policy.sourceRules['LAYOUT-01']='No decorative bracket-shaped highlights or colored left rails for selected navigation, tabs, cards or callouts. Use restrained background, text weight and spacing. Preserve visible keyboard focus and meaningful data borders.';
policy.sourceRules['LOGO-01']="Landometer wordmark MAY change colour, including a different colour for each letter, while preserving its letterforms and proportions. Gray is an optional versatile default, not a required identity colour. This owner-authorized wordmark colour treatment does not require separate permission for each colour. The official logo MAY appear on light or dark backgrounds when the complete name and symbol remain legible at the actual size. Evaluate a Brand Blue visibility problem for that specific pairing; it does not prohibit dark backgrounds generally. MOTIF-06 full/quiet carrier restrictions apply to registered motifs, not official logo PNGs. This permission changes wordmark colour only; it does not authorize symbol recolouring, redrawing or distortion, or change interface/data colour contracts.";
policy.identity={scope:'Landometer official logo and wordmark',ownerDirection:{date:'2026-09-30',authority:'Montri',basis:'Current owner messages permit wordmark colour changes including per-letter colours and confirm the official logo on a dark background.',statements:['wordmark ผมให้เปลี่ยนสีได้นะ ไม่ซีเรียส จะเอาตัวอักษรละสีเลยก็ได้ไม่ติด ดูส่งเสริมความหลากหลายดี ที่เลือกสีเทาทีแรกเพราะจะได้ ใช้ได้ทั้ง background สว่างและมืดใน logo แบบเดียว','logo on dark background แสดงได้สิ มีปัญหาอะไรครับ']},wordmark:{colourChangeAllowed:true,perLetterColourAllowed:true,grayRequired:false,preserveLetterforms:true,preserveProportions:true,perColourApprovalRequired:false},officialLogo:{lightBackgroundAllowed:true,darkBackgroundAllowed:true,actualSizeLegibilityRequired:true,brandBlueAssessedPerPairing:true,blanketDarkBan:false,motifCarrierRulesApply:false},scopeBoundary:'Wordmark colour permission does not recolour the symbol or modify interface, analytical or registered motif colour contracts.'};
policy.sourceRules['QA-01']='Review actual rendered Thai and English content at narrow and desktop widths, including every new section, squeezed headings and sibling overlap. Exact package checks do not replace artifact review or prove signed conformance.';
policy.analytical ??= {};
policy.analytical.bannedHue={...structuredClone(BANNED),scope:'Every categorical and analytical color, including all 1640 fixed LUT entries in both themes.',earthRule:'Fail when hue, chroma and lightness simultaneously match the earth window, or within the declared proximity to a purged earth/taupe color.',violetRule:'Fail when hue and chroma simultaneously match the violet window.',clayRule:'Warning on light surfaces only; other earth/violet/proximity/exact-retired gates still apply in both themes.',retiredExactRule:'Fail any exact retired color match.',lutAudit:'All current fixed LUT entries are gates. Runtime HSL interpolation, lightness transforms or hue substitution are forbidden.'};
const binaryAndRuntime=walk(join(current,'build-kit')).concat(join(current,'machine/color-srgb-08.production.css'));
const assetFiles=binaryAndRuntime.map(p=>({...sourceRecord(p),url:'https://montri-th.github.io/Landometer/v0.9.5/package/'+relative(plugin,p).split('/').map(encodeURIComponent).join('/')}));
const sourceNames=['release.json','policy.json','tokens.v0.9.5.json','color-srgb-08.tokens.json','color-srgb-08.scales.json','evidence-value.schema.json','social-sidecar.schema.json'];
const sources=sourceNames.map(n=>sourceRecord(join(current,'machine',n)));
const common={
 release:{...originalRelease.release,documentRevision:'standalone-0.9.5-r3',normativeDependency:'none',consolidationApproval:{date:'2026-09-30',authority:'Montri',scope:'Consolidate the complete current normative into one v0.9.5 document using the v0.9.1 structure; retire conflicting prior Project Sources.'},identityClarification:policy.identity.ownerDirection},
 policy,resourceAliases:{'policy.json':'#/machine/policy','tokens.v0.9.5.json':'#/machine/tokens','rule-catalog.json':'#/machine/ruleCatalog','component-contracts.json':'#/machine/contracts/componentContracts','format-packs.json':'#/machine/contracts/formatPacks','format-kits.json':'#/machine/contracts/formatKits','target-profiles.json':'#/machine/contracts/targetProfiles','asset-registry.json':'#/machine/contracts/assetRegistry','motif-register.v0.9.5.json':'#/machine/contracts/motifRegister','color-srgb-08.tokens.json':'#/machine/colorRegistry','color-srgb-08.scales.json':'#/machine/analyticalScales',...Object.fromEntries(Object.keys(resolved.schemas).map(name=>[name,'#/machine/schemas/'+name]))},ruleCatalog:resolved.ruleCatalog,
 tokens:normalizeCurrentTokens(currentJSON('tokens.v0.9.5.json')),colorRegistry:currentJSON('color-srgb-08.tokens.json'),analyticalScales:currentJSON('color-srgb-08.scales.json'),
 contracts:resolved.contracts,schemas:resolved.schemas,assetFiles,
 provenance:{purpose:'Traceability only; these are not additional reading or installation dependencies.',sourceFiles:sources,contractSources:resolved.provenance,normalizationLog:resolved.normalizationLog},
 validationBoundary:{document:'Complete design rules and exact structured values in this file. Binary assets use the exact URLs and hashes in assetFiles.',package:'Unsigned owner distribution. A source signature does not sign this document.',artifact:'Content truth, rendered usability, accessibility, actual surfaces, native Thai copy and output formats require applicable artifact checks.',installation:'File availability, retrieval and correct use must be verified in each project and platform.'}
};
const variants=[{id:'landometer',name:'Landometer-Design-System-v0.9.5',title:'Landometer Design System v0.9.5',human:baseHuman}];
const output=[];
for(const variant of variants){
 const human=variant.human;
 const document={schemaVersion:'lds-standalone-document-1',documentId:`lds-0.9.5-${variant.id}-standalone-r3`,documentRevision:'standalone-0.9.5-r3',title:variant.title,dsVersion:'0.9.5',releaseRef:'v0.9.5-owner.1',colorSetId:'color-srgb-08',product:variant.id,structureBaseline:'Landometer Design System v0.9.1',humanSha256:sha(human),requiredNormativeFiles:1,supersedes:'Previous LDS Project Source masters, overlays and fragmented machine sources for new work in this scope.'};
 const machine={document,...structuredClone(common),...(variant.profile?{productProfile:variant.profile}:{}),...(variant.profileSources?{productProfileSources:variant.profileSources}:{})};
 // Record boundaries aid retrieval while preserving one exact JSON object.
 const markdown=human+'\n<!-- LDS_MACHINE_BEGIN -->\n```json\n'+readableMachine(machine)+'\n```\n<!-- LDS_MACHINE_END -->\n';
 const projection={document,humanMarkdown:human,machine};
 const json=JSON.stringify(projection,null,2)+'\n';
 writeFileSync(join(dest,variant.name+'.md'),markdown);
 writeFileSync(join(dest,variant.name+'.json'),json);
 output.push({kind:'base',requiredNormativeFiles:1,product:variant.id,title:variant.title,documentId:document.documentId,files:[{path:variant.name+'.md',bytes:Buffer.byteLength(markdown),sha256:sha(markdown),use:'One file for people, AI and Project Sources; includes complete machine JSON.'},{path:variant.name+'.json',bytes:Buffer.byteLength(json),sha256:sha(json),use:'Lossless machine projection, an alternative to Markdown; do not upload both.'}]});
}
// Product Add-ons remain separate and bind this exact complete LDS base.
const baseDocument={documentId:output[0].documentId,path:output[0].files[0].path,sha256:output[0].files[0].sha256,dsVersion:'0.9.5',releaseRef:'v0.9.5-owner.1',colorSetId:'color-srgb-08'};
for(const product of ['ijji','citychat','citywiki']){
 const md=join(profileDir,product+'.md'),meta=join(profileDir,product+'.json');
 if(!existsSync(md)||!existsSync(meta))throw Error('Missing reviewed product Add-on: '+product);
 const profile=readJSON(meta);
 // Rebind current foundation metadata only; source product rules and original consolidation provenance stay exact.
 profile.parentDesignSystem.documentRevision='standalone-0.9.5-r3';
 profile.parentDesignSystem.publicationTag='v0.9.5-standalone-r3';
 const display={ijji:'ijji',citychat:'CityChat',citywiki:'CityWiki'}[product];
 const version={ijji:'0.5.5',citychat:'0.9.2',citywiki:'1.0.0'}[product];
 const name=display+'-Add-on-v'+version+'-for-LDS-v0.9.5';
 const title=display+' Add-on v'+version+' for LDS v0.9.5';
 const productHuman=readFileSync(md,'utf8').trimEnd()+'\n';
 const human='# '+title+'\n\n**Product Add-on · Human + Machine**\n\nใช้คู่กับ **Landometer-Design-System-v0.9.5.md** ฉบับเต็ม รวมเป็นสองไฟล์สำหรับงาน '+display+' ไม่ต้องใช้ master 0.9.4 หรือ overlay รุ่นก่อน Add-on นี้มีเฉพาะข้อกำหนดผลิตภัณฑ์และ structured product records; กฎกลาง สี ฟอนต์ scales และ schemas ใช้จาก LDS 0.9.5 ฉบับเต็มตาม exact base binding ใน machine JSON ของไฟล์นี้\n\nAdd-on ใช้ได้เฉพาะ '+display+' และเฉพาะขอบเขตที่ระบุ ไม่แก้กฎกลางหรือสร้าง product fact / capability ใหม่ ข้อกำหนด shared rule IDs ทุกตัว resolve จาก ruleCatalog ของ base ที่ล็อกไว้ หากขัดกันนอกขอบเขต product override ให้รายงานความต่างก่อนใช้\n\n'+productHuman;
 const document={schemaVersion:'lds-standalone-document-1',documentId:product+'-addon-'+version+'-lds-0.9.5-r3',documentRevision:'standalone-0.9.5-r3',documentKind:'addon',title,dsVersion:'0.9.5',releaseRef:'v0.9.5-owner.1',colorSetId:'color-srgb-08',product,productVersion:version,humanSha256:sha(human),requiredNormativeFiles:2,supersedes:'Previous product design-rule Add-ons within this product scope. Requires the complete LDS 0.9.5 base, never a predecessor master.'};
 const machine={document,release:{dsVersion:'0.9.5',releaseRef:'v0.9.5-owner.1',colorSetId:'color-srgb-08',signatureStatus:'unsigned',signedRelease:false,normativeDependency:baseDocument.path},baseDocument,productProfile:profile,productProfileSources:[sourceRecord(md),sourceRecord(meta)],validationBoundary:{document:'Product-only Add-on. Read with the exact complete LDS 0.9.5 base identified above.',scope:'Product rules apply only within their declared scope. Shared LDS rules and exact machine values are not duplicated or redefined here.',foundationRebinding:'Only parentDesignSystem.documentRevision and publicationTag are updated from the source profile to the current r3 foundation; original consolidation provenance and all product rules/values are preserved.',evidence:'Keep approved product briefs, factual data and evidence separately. This design contract cannot establish product capability or artifact conformance.'}};
 const markdown=human+'\n<!-- LDS_MACHINE_BEGIN -->\n```json\n'+readableMachine(machine)+'\n```\n<!-- LDS_MACHINE_END -->\n';
 const projection={document,humanMarkdown:human,machine};
 const json=JSON.stringify(projection,null,2)+'\n';
 writeFileSync(join(dest,name+'.md'),markdown);writeFileSync(join(dest,name+'.json'),json);
 output.push({kind:'addon',requiredNormativeFiles:2,product,title,documentId:document.documentId,baseDocument,files:[{path:name+'.md',bytes:Buffer.byteLength(markdown),sha256:sha(markdown),use:'Product Add-on for people, AI and Project Sources; upload alongside the complete LDS 0.9.5 base.'},{path:name+'.json',bytes:Buffer.byteLength(json),sha256:sha(json),use:'Lossless machine alternative to this Add-on Markdown; do not upload both.'}]});
 // Unpublished combined editions were an incorrect interpretation, not releases.
 for(const ext of ['md','json']){const obsolete=join(dest,display+'-LDS-v0.9.5-standalone.'+ext);if(existsSync(obsolete))unlinkSync(obsolete);}
}
writeFileSync(join(dest,'document-set.json'),JSON.stringify({schemaVersion:'lds-standalone-document-set-1',revision:'standalone-0.9.5-r3',dsVersion:'0.9.5',releaseRef:'v0.9.5-owner.1',colorSetId:'color-srgb-08',installationModel:'one complete LDS base + the separate applicable product Add-on',documents:output},null,2)+'\n');
writeFileSync(join(dest,'source-policy.json'),JSON.stringify({schemaVersion:'lds-source-policy-1',documentRevision:'standalone-0.9.5-r3',status:'current',baseDocument,productAddons:output.filter(d=>d.kind==='addon').map(d=>({product:d.product,documentId:d.documentId,path:d.files[0].path,sha256:d.files[0].sha256,requiredNormativeFiles:2,requires:baseDocument})),supersededForNewWork:['Earlier standalone 0.9.5 document revisions r1/r2 and r2-docs1 packages','LDS 0.9.1 and 0.9.4 normative masters','LDS 0.9.5 overlay GUIDE.md and separate BRAND.md as mandatory inputs','Earlier eight-file LDS Project Source sets','Earlier product Add-on revisions whose rules are replaced by the applicable current Add-on'],preserve:['Business and product briefs','Factual evidence, research and datasets','Explicitly version-pinned historical work','Original immutable release records and cryptographic provenance'],machineAuthority:'The complete LDS 0.9.5 base supplies shared structured contracts. A separate applicable product Add-on supplies only product-specific rules. No predecessor master is required.'},null,2)+'\n');
console.log('Built complete LDS base plus separate product Add-ons: '+output.map(x=>x.product).join(', '));
