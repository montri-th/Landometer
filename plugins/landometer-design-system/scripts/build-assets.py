#!/usr/bin/env python3
"""Build LDS 0.9.7 from pinned owner-approved light values; older assets remain immutable."""
import copy, hashlib, json, re, shutil, math, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; PREVIOUS=ROOT/'assets/lds-0.9.6'; OUT=ROOT/'assets/lds-0.9.7'; REF=ROOT/'references'
RID='v0.9.7-owner.1'; CID='color-srgb-10'
load=lambda p:json.loads(p.read_text()); sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,obj):
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def lab(h):
 rgb=[int(h[i:i+2],16)/255 for i in [1,3,5]];r,g,b=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
 l=(.4122214708*r+.5363325363*g+.0514459929*b)**(1/3);m=(.2119034982*r+.6806995451*g+.1073969566*b)**(1/3);s=(.0883024619*r+.2817188376*g+.6299787005*b)**(1/3)
 return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]
def de(a,b):return 100*math.sqrt(sum((x-y)**2 for x,y in zip(lab(a),lab(b))))
inputs={'approved-story-r4.json':'be696bc8f41520f85167678634407838ac5ed5c9bb9a802585146b0b2f36415f','approved-location-r2.json':'0906c14107ef20a2a42a5d1c830ffa56c0a88caca34d54096dc58b346faba279','approved-location-metrics.json':'44ad44d254262932812b61a5ca9e7a4b27c6ec89c7bfdc7da9eb0bb081a387e7'}
for f,h in inputs.items():assert sha(REF/f)==h,'Approved input bytes changed: '+f
C=load(REF/'approved-story-r4.json');LI=load(REF/'approved-location-r2.json');SEM=load(REF/'approved-location-metrics.json');D=load(REF/'approved-0.9.6.json')
owner={'authority':'Montri','date':'2026-10-01','reference':'owner-message:2026-10-01:release-0.9.7-original-light-hex-on-both-themes','decision':'Adopt Story r4 and Location r2 LIGHT colors. Use each exact light anchor/LUT/class and role HEX unchanged on dark, with the same data direction; no derived dark formulas. Existing categorical palettes and decorative gradients retain their own contracts.'}
scales=[]
for s in C['scales']:
 if s['theme']!='light':continue
 for theme in ['light','dark']:
  q=copy.deepcopy(s); q['theme']=theme
  for key in ['candidateOverrides','previewStatus','previewDesignNote','previewDesignNoteEn']:q.pop(key,None)
  q['designNote']=q['designNote'].replace('This proposes a cool-zone reassignment','This adopts a cool-zone reassignment').replace('within this candidate','in the approved light-source design')
  if q['scaleId']=='heat':q['designNote']='Sunlit yellow turns through orange to vermilion on both light and dark surfaces, with decreasing lightness as temperature increases. Temperature units and thresholds remain necessary; hue is not a warning classification.'
  if q['scaleId']=='risk':q['designNote']='Evidence-backed risk receives a coral-orange middle and clean red high on both themes; no wine, muddy brown or cheerful pink detour. Severity requires labelled thresholds, a distinct warning symbol and text. The unchanged high color needs actual-surface contrast review on dark backgrounds.'
  q.update(canvas='#F6F7F3' if theme=='light' else '#11191D',noData='#D5DAD6' if theme=='light' else '#3B4849',zeroOutline='#7D877F' if theme=='light' else '#BAC6C0',interpolation='none at consumption; exact approved 41-sample sRGB lookup table',themePolicy='identical-light-values-on-both-themes',designNote=q['designNote']+' Same approved light colors and value direction on both themes; use readable labels, boundaries or a neutral backplate without recoloring the data.')
  q['scaleVersion']=hashlib.sha256(json.dumps({'anchors':q['anchors'],'lut':q['lut']},separators=(',',':')).encode()).hexdigest();scales.append(q)
# Use the existing hue classifier to disclose review warnings, never a fabricated empty list.
hue_js='import {hueVerdict} from '+json.dumps((REF/'inherited/lds-0.9.4/machine/validate-dataviz-gates-0.9.4.mjs').as_uri())+';import fs from "node:fs";const rows=JSON.parse(fs.readFileSync(0,"utf8"));process.stdout.write(JSON.stringify(Object.fromEntries(rows.map(s=>[s.scaleId+"/"+s.theme,s.lut.flatMap((hex,index)=>hueVerdict(hex,s.theme).findings.filter(f=>f.severity==="warning").map(f=>({hex,index,...f})))]))));'
hue_warnings=json.loads(subprocess.run(['node','--input-type=module','-e',hue_js],input=json.dumps(scales),capture_output=True,text=True,check=True).stdout)
# Atlas projection retains the established shape. Do not reuse prototype dark formulas.
for family in D['scales']:
 light=next(s for s in scales if s['scaleId']==family['id'] and s['theme']=='light')
 family['directionLabel']=light['directionLabel'];family['designNote']=light['designNote']
 if family['id']=='activity':family['zone']='blue';family['warm']=False
 for theme in ['light','dark']:
  s=next(s for s in scales if s['scaleId']==family['id'] and s['theme']==theme);x=family['themes'][theme]
  x.update(lut=s['lut'],anchors=s['anchors'],knots=s.get('knots'),range='approved-full',canvas=s['canvas'])
  x['options']={n:{'hex':arr,'minStep':min(de(a,b) for a,b in zip(arr,arr[1:])),'separationPass':True} for n,arr in s['classes'].items()};x['hueWarnings']=hue_warnings[s['scaleId']+'/'+theme]
D.update(buildId='lds097-story-location-theme-invariant-r1',release='0.9.7',created='2026-10-01',status='owner-approved',baseRelease='v0.9.6-owner.1',approval={**owner,'inputs':inputs},notes=['All 20 analytical families adopt Story light values exactly in both themes.','Sequential values become darker as magnitude increases on both light and dark surfaces.','Labels, boundaries and neutral backplates maintain readability without recoloring data.','Existing categorical palettes, atmosphere, foundations, identity and motion remain unchanged.'])
D.pop('previousDensity',None)
# Generic supporting vocabulary: original ten plus seven approved additional light accents, without product metric rules.
palette=copy.deepcopy(C['supportingPalette']);extraIds=['teal','amber','azure','lime-leaf','scarlet','orange','pine']
extras=[r for r in LI['roles'] if r['baseVocabulary']['kind']=='location-extension'];assert len(extras)==7
for ident,r in zip(extraIds,extras):palette.append({'id':ident,'name':{'teal':'Teal / ทีล','amber':'Amber / อำพัน','azure':'Azure / ฟ้า','lime-leaf':'Lime leaf / เขียวอ่อน','pine':'Pine / เขียวสน','scarlet':'Scarlet / แดงส้ม','orange':'Orange / ส้ม'}[ident],'hex':r['light']['hex'],'role':'Supporting editorial accent; assignment requires a named context, not automatic metric meaning.'})
assert len(palette)==17 and len({p['hex'] for p in palette})==17 and len({p['id'] for p in palette})==17
D['supportingPalette']=palette;save(REF/'approved-0.9.7.json',D)
OUT.mkdir(parents=True,exist_ok=True)
for folder in ['build-kit','brand']:shutil.copytree(PREVIOUS/folder,OUT/folder,dirs_exist_ok=True)
for f in (OUT/'build-kit').glob('*0.9.6*'):
 dst=f.with_name(f.name.replace('0.9.6','0.9.7'));dst.write_text(f.read_text().replace('0.9.6','0.9.7').replace('color-srgb-09','color-srgb-10'));f.unlink()
example=OUT/'build-kit/example.html';example.write_text(example.read_text().replace('0.9.6','0.9.7').replace('color-srgb-09','color-srgb-10'))
policy=load(PREVIOUS/'machine/policy.json');policy.update(schemaVersion='lds-0.9.7-policy-1',releaseRef=RID,colorSetId=CID)
policy['approval']={**owner,'inputs':inputs,'signatureStatus':'unsigned-owner-approved','cryptographicReleaseAttestation':False}
policy['precedence']=['Complete standalone LDS 0.9.7 normative and exact assets for adopted 0.9.7 work','Separate applicable product Add-on or Location profile binds the exact current base','Historical packages apply only to explicitly pinned historical work']
policy['sourceRules'].update({'COLOR-01':'Use exact color-srgb-10 analytical tables and approved 17-value Story vocabulary. Original categorical and decorative roles remain separate.','DATAVIZ-02':'Three explicit anchors at 0/20/40; use exact approved 41 samples and classes 3/5/7/9. A sequential midpoint changes hue, not numerical direction. Start colors are semantic near-whites, not a compulsory universal cream.','DATAVIZ-03':'Analytical light and dark anchors, LUTs and classes are byte-for-byte equal in numerical values. Preserve value direction. No dark derivation, inversion, recoloring or theme-dependent numerical normalization. Use labels, borders and a neutral backplate for actual-surface contrast.'})
policy['sourceRules']['GOV-01/RELEASE-01']=policy['sourceRules']['GOV-01/RELEASE-01'].replace('0.9.5','0.9.7')
policy['analytical']['sequentialAnchors']={'count':3,'indices':[0,20,40],'start':'exact family-specific approved semantic near-white','middleHue':'distinct from the end hue, never merely its lighter tint','singleDirection':True,'lightness':'strictly decreasing on both themes','relativeLuminance':'strictly decreasing on both themes','approvalSourceSha256':inputs['approved-story-r4.json'],'constructionOnly':'authoring construction only; consumers use exact LUT samples','notDiverging':'The middle colour is a perceptual turn, not zero, balance or a second data direction.'}
policy['analytical']['themeInvariant']={'required':True,'sourceTheme':'light','anchorsEqual':True,'lutEqual':True,'classesEqual':True,'valueDirectionEqual':True,'darkDerivationForbidden':True,'contrastRemedy':'Keep data HEX; use labels, meaningful boundaries or a neutral backplate. Test actual surfaces and sizes. No automatic 3:1, CVD or full accessibility claim.'}
policy['analytical']['semanticZones']={'activity':'cool mint/blue','water':'aquatic blue/cyan','density':'warm with explicit denominators'}
policy['supportingPalette']={'name':'Story','count':17,'themeInvariant':True,'scope':'supporting editorial vocabulary; not 17 simultaneously distinguishable chart series','locationRules':'Optional separate Location Intelligence profile; not shared LDS business semantics'}
policy['verificationBounds']=[x.replace('signed0.9.6','signed 0.9.7') for x in policy['verificationBounds']]+['Dark numerical colors intentionally equal light values; actual-surface contrast and CVD usability are artifact checks, not universal package guarantees.']
save(OUT/'machine/policy.json',policy)
save(OUT/'machine/color-srgb-10.scales.json',{'schemaVersion':'lds-scales-0.9.7-1','releaseRef':RID,'colorSetId':CID,'records':40,'families':{'sequential':14,'diverging':6},'lutSteps':41,'sourceSnapshotSha256':sha(REF/'approved-0.9.7.json'),'approvedStorySourceSha256':inputs['approved-story-r4.json'],'themePolicy':policy['analytical']['themeInvariant'],'scales':scales})
registry=load(PREVIOUS/'machine/color-registry.json');registry.update(schemaVersion='lds-color-registry-0.9.7-1',releaseRef=RID,colorSetId=CID,scales=D['scales'],supportingPalette=palette);save(OUT/'machine/color-registry.json',registry)
colors=load(PREVIOUS/'machine/color-srgb-09.tokens.json');colors.update(schemaVersion='lds-colors-0.9.7-1',releaseRef=RID,colorSetId=CID);colors['values']['scaleRegistry']='color-srgb-10.scales.json';colors['values']['supportingPalette']=palette;save(OUT/'machine/color-srgb-10.tokens.json',colors)
tokens=load(PREVIOUS/'machine/tokens.v0.9.6.json');tokens.update(schemaVersion='13-owner.1',releaseRef=RID);tokens['sets']['color']=CID;tokens['supportingPalette']={'name':'Story','themeInvariant':True,'values':palette};tokens['projection']={k:v.replace('color-srgb-09','color-srgb-10') for k,v in tokens['projection'].items()}
for family,rec in tokens['analyticalScales'].items():
 rec['lutRef']='color-srgb-10.scales.json'
 for theme in ['light','dark']:rec[theme]=next(s['anchors'] for s in scales if s['scaleId']==family and s['theme']==theme)
save(OUT/'machine/tokens.v0.9.7.json',tokens)
css=(PREVIOUS/'machine/color-srgb-09.production.css').read_text();decl=dict(re.findall(r'(--[\w-]+):\s*([^;]+);',css));slug=lambda s:re.sub(r'([a-z])([A-Z])',r'\1-\2',s).lower().replace('.','-')
for s in scales:
 k=slug(s['scaleId']);theme=s['theme']
 for i,c in enumerate(s['anchors'],1):decl[f'--ldm-scale-{k}-{theme}-anchor-{i}']=c
 for i,c in enumerate(s['lut']):decl[f'--ldm-scale-{k}-{theme}-lut-{i:02}']=c
 for n,arr in s['classes'].items():
  for i,c in enumerate(arr,1):decl[f'--ldm-scale-{k}-{theme}-class-{n}-{i}']=c
for p in palette:decl['--ldm-story-'+p['id']]=p['hex']
(OUT/'machine/color-srgb-10.production.css').write_text('/* Landometer DS 0.9.7 / color-srgb-10. Same exact analytical values and direction on both themes. */\n:root {\n'+''.join(f'  {k}: {v};\n' for k,v in sorted(decl.items()))+'}\n')
dtcg=load(PREVIOUS/'machine/lds-0.9.6.tokens.dtcg.json');dtcg['$description']=dtcg['$description'].replace('0.9.6','0.9.7');dtcg['$extensions']['landometer'].update(releaseRef=RID,colorSetId=CID)
for key,value in decl.items():
 if re.fullmatch(r'#[0-9A-F]{6}',value):dtcg['colors'][key.removeprefix('--ldm-')]={'$type':'color','$value':{'colorSpace':'srgb','components':[int(value[i:i+2],16)/255 for i in [1,3,5]],'alpha':1},'$extensions':{'landometer':{'hex':value}}}
save(OUT/'machine/lds-0.9.7.tokens.dtcg.json',dtcg)
# Separate optional Location profile: complete definitions, categorical SWOT lenses, exact light values on both themes.
liScales=[]
for s in LI['scales']:
 if s['theme']!='light':continue
 for theme in ['light','dark']:
  q=copy.deepcopy(s);q['theme']=theme;q['canvas']='#F6F7F3' if theme=='light' else '#11191D';q['lut']=q.pop('lut41');q.pop('darkConstruction',None);q['themePolicy']='identical-light-values-on-both-themes';q['semanticRef']='#/semantics/metrics/'+str(next(i for i,m in enumerate(SEM['metrics']) if m['id']==q['scaleId']));liScales.append(q)
roles=[]
for r in LI['roles']:
 q={k:copy.deepcopy(v) for k,v in r.items() if k not in ['dark','rawLightOnDark']};q['dark']=copy.deepcopy(q['light']);q['themePolicy']='exact-original-light-HEX-in-both-themes';q['light'].pop('canvasContrast',None);q['dark'].pop('canvasContrast',None);q['semanticRef']='#/semantics/metrics/'+str(next(i for i,m in enumerate(SEM['metrics']) if m['id']==q['id']));roles.append(q)
sem=copy.deepcopy(SEM);sem.update(status='owner-approved-location-profile',baseStudy='LDS 0.9.7',scope='Separate optional Location Intelligence profile; quantitative business definitions do not override factual evidence, the complete LDS base, or other products.')
sem['sharedRules']['darkTheme']=policy['analytical']['themeInvariant']['contrastRemedy']+' The original light HEX and numerical direction are unchanged on both themes; no derived dark formula.'
profile={'schemaVersion':'lds-location-profile-0.9.7-1','releaseRef':RID,'colorSetId':CID,'profileId':'location-intelligence-0.9.7','status':'owner-approved','baseDocument':None,'semantics':sem,'semanticReferenceRoot':'JSON Pointer references resolve against this Location profile object, including when embedded as machine.locationProfile in the separate normative document.','roles':roles,'scales':liScales,'counts':{'roles':16,'quantitativeMetrics':12,'sequential':9,'diverging':3,'categoricalEvidenceLenses':4,'themeRecords':24},'themePolicy':policy['analytical']['themeInvariant'],'intentionalVisualAliases':LI.get('policy',{}).get('intentionalVisualAliases',[]),'approval':{**owner,'sourceHashes':inputs},'constraints':['No gradients for the four SWOT evidence lenses.','Spending readiness requires stated budget AND purchase intention, not spending power alone.','Role colors are not quantity scales; 16 unique HEX values are not a guarantee of 16 distinguishable hues.','Labels, metric definition, units, denominator and non-color cues remain mandatory.','Dark rendition formulas and their prototype contrast claims are superseded by the owner’s same-HEX decision.']}
# Discover exact aliases rather than retaining draft similarity claims.
profile['intentionalVisualAliases']=[{'locationScale':s['scaleId'],'storyScale':b['scaleId'],'theme':s['theme'],'relationship':'Exact visual reuse; metric definitions and evidence remain separate.'} for s in liScales for b in scales if s['theme']==b['theme'] and s['lut']==b['lut']]
save(OUT/'machine/location-intelligence-0.9.7.json',profile)
liDecl={}
for r in roles:
 for theme in ['light','dark']:liDecl[f'--ldm-{slug(r["id"])}-{theme}']=r[theme]['hex']
for s in liScales:
 for i,h in enumerate(s['lut']):liDecl[f'--ldm-location-scale-{slug(s["scaleId"])}-{s["theme"]}-lut-{i:02}']=h
 for n,arr in s['classes'].items():
  for i,h in enumerate(arr,1):liDecl[f'--ldm-location-scale-{slug(s["scaleId"])}-{s["theme"]}-class-{n}-{i}']=h
(OUT/'machine/location-intelligence-0.9.7.css').write_text('/* Optional Location Intelligence profile; exact light values on both themes. */\n:root {\n'+''.join(f'  {k}: {v};\n' for k,v in sorted(liDecl.items()))+'}\n')
for file in ['social-sidecar.schema.json','evidence-value.schema.json']:
 d=load(PREVIOUS/'machine'/file);d['$id']=d['$id'].replace('0.9.6','0.9.7');d['title']=d['title'].replace('0.9.6','0.9.7');d['$comment']='Current unsigned LDS 0.9.7 contract. Historical source bytes remain immutable.';save(OUT/'machine'/file,d)
manifest=load(PREVIOUS/'machine/release.json');manifest['release'].update(dsVersion='0.9.7',releaseRef=RID,machinePackage=RID,authoringRevision='0.9.7-owner.1',colorSetId=CID,ownerApproval=owner);manifest['predecessor']={'dsVersion':'0.9.6','releaseRef':'v0.9.6-owner.1','releaseSha256':sha(PREVIOUS/'machine/release.json'),'changedScope':'Story 20 analytical families; same light values and direction in both themes; generic 17-value supporting palette; separate optional Location profile. Existing categorical, atmosphere, identity and motion preserved.'};manifest['approvalSource']={'path':'../../../references/approved-0.9.7.json','sha256':sha(REF/'approved-0.9.7.json'),'visualBuildId':D['buildId'],'inputs':inputs,'ownerThemeOverride':owner};manifest['entrypoints']={k:v.replace('0.9.6','0.9.7').replace('color-srgb-09','color-srgb-10') for k,v in manifest['entrypoints'].items()};manifest['entrypoints']['locationProfile']='location-intelligence-0.9.7.json';manifest['entrypoints']['locationCSS']='location-intelligence-0.9.7.css';manifest['limitations']=policy['verificationBounds'];manifest['counts']['supportingPalette']=17;save(OUT/'machine/release.json',manifest)
brand=(PREVIOUS/'brand/BRAND.md').read_text().replace('0.9.6','0.9.7');(OUT/'brand/BRAND.md').write_text(brand)
(OUT/'GUIDE.md').write_text('# LDS 0.9.7 — Story and consistent analytical color\n\nUse `normative/Landometer-Design-System-v0.9.7.md`: the complete shared human and machine rules in one file. No predecessor master is required. Add only the separate applicable product Add-on or Location Intelligence profile.\n\nAll 20 analytical families use the approved Story LIGHT anchors, 41 samples and class values on both themes, with the same numerical direction. Never invert or derive dark colors. Use readable labels, boundaries and a neutral backplate without recoloring analytical values. Three anchors remain explicit. Density stays warm; activity is cool and water is aquatic.\n\nThe Story supporting vocabulary has 17 values. Existing categorical series, seven decorative gradients, foundations, brand voice, fonts, identity and motion contracts remain unchanged. This package does not claim universal color-only distinction, contrast or accessibility.\n')
print('Built LDS 0.9.7. Snapshot '+sha(REF/'approved-0.9.7.json'))
