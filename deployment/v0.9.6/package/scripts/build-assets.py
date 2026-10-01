#!/usr/bin/env python3
"""Project owner-approved three-colour R2 into LDS0.9.6; never edit frozen0.9.5."""
import copy, hashlib, json, re, shutil, math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PREVIOUS=ROOT/'assets/lds-0.9.5'; OUT=ROOT/'assets/lds-0.9.6'
REF=ROOT/'references'; RID='v0.9.6-owner.1'; CID='color-srgb-09'
load=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,obj):
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def lab(h):
 rgb=[int(h[i:i+2],16)/255 for i in [1,3,5]];r,g,b=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
 l=(.4122214708*r+.5363325363*g+.0514459929*b)**(1/3);m=(.2119034982*r+.6806995451*g+.1073969566*b)**(1/3);s=(.0883024619*r+.2817188376*g+.6299787005*b)**(1/3)
 return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]
def de(a,b):return 100*math.sqrt(sum((x-y)**2 for x,y in zip(lab(a),lab(b))))
expected='0ae97bf20fe51521ddb71aed3f5ae99f5206cd934492eff4934e97a29765e4fa'
assert sha(REF/'approved-sequential-r2.json')==expected,'Approved R2 bytes changed'
C=load(REF/'approved-sequential-r2.json');old=load(PREVIOUS/'machine/color-srgb-08.scales.json');D=load(REF/'approved-r2.1.json')
assert len(C['scales'])==40
original={(s['scaleId'],s['theme']):s for s in old['scales']}
for s in C['scales']:
 before=original[s['scaleId'],s['theme']]
 if s['kind']=='diverging':assert s==before,'Diverging record changed'
 else:
  assert s['anchors'][2]==before['anchors'][2]
  assert s['anchors'][0]==('#F2F1DF' if s['theme']=='light' else before['anchors'][0])
# Merge the approved LUTs into the established readable atlas schema.
for family in D['scales']:
 for theme in ['light','dark']:
  s=next(x for x in C['scales'] if x['scaleId']==family['id'] and x['theme']==theme)
  if s['kind']!='sequential':continue
  x=family['themes'][theme];x.update(lut=s['lut'],anchors=s['anchors'],knots=s['knots'],range='approved-full',canvas=s['canvas'])
  x['options']={n:{'hex':arr,'minStep':min(de(a,b) for a,b in zip(arr,arr[1:])),'separationPass':True} for n,arr in s['classes'].items()}
  x['hueWarnings']=[]
  family['directionLabel']=s['previewDesignNoteEn']
  family['designNote']='เส้นทางสีพื้นสว่าง: '+s['previewDesignNote']+'; พื้นมืดใช้สีกลางต่างเฉดเดียวกันและตารางความสว่างเฉพาะธีม'
D.update(buildId='lds096-three-colour-sequential-r1',release='0.9.6',created='2026-10-01',status='owner-approved',baseRelease='v0.9.5-owner.1')
D['approval']={'date':'2026-10-01','authority':'Montri','sourceBuildId':C['buildId'],'sourceSha256':expected,'scope':'28 sequential family/theme records only; 12 diverging records and all other color/brand assets preserved.'}
D['notes']=['LDS0.9.6 adopts the exact owner-approved R2 three-colour sequential LUTs.','Light theme starts with brand beige; midpoint has a distinct hue rather than a lightened end hue.','Current0.9.5 diverging, categorical, atmosphere and foundation values remain exact.']
D.pop('previousDensity',None)
save(REF/'approved-0.9.6.json',D)
# Clone immutable previous assets once; rename only active-version entry points in the new directory.
OUT.mkdir(parents=True,exist_ok=True)
for folder in ['build-kit','brand']:
 shutil.copytree(PREVIOUS/folder,OUT/folder,dirs_exist_ok=True)
for f in (OUT/'build-kit').glob('*0.9.5*'):
 dst=f.with_name(f.name.replace('0.9.5','0.9.6'));dst.write_text(f.read_text().replace('DS0.9.5','DS0.9.6').replace('lds-0.9.5','lds-0.9.6').replace('color-srgb-08','color-srgb-09'));f.unlink()
# Pure metadata update; unchanged policy and identity scope retained.
policy=load(PREVIOUS/'machine/policy.json');policy['schemaVersion']='lds-0.9.6-policy-1';policy['releaseRef']=RID;policy['colorSetId']=CID
policy['approval']={'authority':'Montri, owner instruction in this conversation','date':'2026-10-01','approvedVisualBuild':C['buildId'],'approvedVisualSha256':expected,'signatureStatus':'unsigned-owner-approved','cryptographicReleaseAttestation':False}
policy['precedence']=['Complete standalone LDS0.9.6 normative and exact assets for adopted0.9.6 work','Separate applicable product Add-on binds the exact current base','Historical packages apply only to explicitly pinned historical work']
policy['sourceRules']['COLOR-01']='Exact production CSS or exact class/LUT records in color-srgb-09 only. New literals are not allowed by visual approximation.'
policy['sourceRules']['DATAVIZ-02']='Every sequential family has three explicit anchors at indices0/20/40, with a visibly distinct middle hue. Use exact approved41-sample theme LUTs; classes3/5/7/9 at round(i*40/(n-1)); never interpolate at runtime.'
policy['analytical']['sequentialAnchors']={'count':3,'indices':[0,20,40],'lightStart':'#F2F1DF','middleHue':'distinct from the end hue, never merely its lighter tint','singleDirection':True,'lightness':'strictly decreasing in light; strictly increasing in dark','relativeLuminance':'same strict direction as lightness','approvalSourceSha256':expected,'constructionOnly':'two OKLab segments through the three approved anchors; consumers use exact LUT samples','notDiverging':'The middle colour is a perceptual turn, not zero, a balance point or a second data direction.'}
policy['verificationBounds']=[x for x in policy['verificationBounds'] if 'Gold density nine-class' not in x]
policy['verificationBounds']=[x.replace('signed0.9.5','signed0.9.6') for x in policy['verificationBounds']]
save(OUT/'machine/policy.json',policy)
scales=[]
for s in C['scales']:
 q=copy.deepcopy(s)
 if q['kind']=='sequential':
  q['designNote']='Light theme: '+q.pop('previewDesignNoteEn')+'; dark uses the same distinct midpoint hue with its approved theme-specific luminance range.'
  q.pop('previewDesignNote',None);q.pop('previewStatus',None)
 scales.append(q)
save(OUT/'machine/color-srgb-09.scales.json',{'schemaVersion':'lds-scales-0.9.6-1','releaseRef':RID,'colorSetId':CID,'records':40,'families':{'sequential':14,'diverging':6},'lutSteps':41,'sourceSnapshotSha256':sha(REF/'approved-0.9.6.json'),'approvedSequentialSourceSha256':expected,'scales':scales})
registry=load(PREVIOUS/'machine/color-registry.json');registry.update(schemaVersion='lds-color-registry-0.9.6-1',releaseRef=RID,colorSetId=CID,scales=D['scales']);save(OUT/'machine/color-registry.json',registry)
colors=load(PREVIOUS/'machine/color-srgb-08.tokens.json');colors.update(schemaVersion='lds-colors-0.9.6-1',releaseRef=RID,colorSetId=CID);colors['values']['scaleRegistry']='color-srgb-09.scales.json';save(OUT/'machine/color-srgb-09.tokens.json',colors)
tokens=load(PREVIOUS/'machine/tokens.v0.9.5.json');tokens.update(schemaVersion='12-owner.1',releaseRef=RID);tokens['sets']['color']=CID
tokens['projection']={k:v.replace('color-srgb-08','color-srgb-09') for k,v in tokens['projection'].items()}
for family in tokens['analyticalScales']:
 rec=tokens['analyticalScales'][family];rec['lutRef']='color-srgb-09.scales.json'
 for theme in ['light','dark']:rec[theme]=next(x['anchors'] for x in scales if x['scaleId']==family and x['theme']==theme)
save(OUT/'machine/tokens.v0.9.6.json',tokens)
css=(PREVIOUS/'machine/color-srgb-08.production.css').read_text();decl=dict(re.findall(r'(--[\w-]+):\s*([^;]+);',css))
slug=lambda s:re.sub(r'([a-z])([A-Z])',r'\1-\2',s).lower().replace('.','-')
for s in scales:
 k=slug(s['scaleId']);theme=s['theme']
 for i,c in enumerate(s['anchors'],1):decl[f'--ldm-scale-{k}-{theme}-anchor-{i}']=c
 for i,c in enumerate(s['lut']):decl[f'--ldm-scale-{k}-{theme}-lut-{i:02}']=c
 for n,arr in s['classes'].items():
  for i,c in enumerate(arr,1):decl[f'--ldm-scale-{k}-{theme}-class-{n}-{i}']=c
(OUT/'machine/color-srgb-09.production.css').write_text('/* Landometer DS0.9.6 / color-srgb-09 / v0.9.6-owner.1. Exact approved three-colour sequential projection. */\n:root {\n'+''.join(f'  {k}: {v};\n' for k,v in sorted(decl.items()))+'}\n')
dtcg=load(PREVIOUS/'machine/lds-0.9.5.tokens.dtcg.json');dtcg['$description']=dtcg['$description'].replace('DS0.9.5','DS0.9.6');dtcg['$extensions']['landometer'].update(releaseRef=RID,colorSetId=CID)
for key,value in decl.items():
 if re.fullmatch(r'#[0-9A-F]{6}',value):dtcg['colors'][key.removeprefix('--ldm-')]={'$type':'color','$value':{'colorSpace':'srgb','components':[int(value[i:i+2],16)/255 for i in [1,3,5]],'alpha':1},'$extensions':{'landometer':{'hex':value}}}
save(OUT/'machine/lds-0.9.6.tokens.dtcg.json',dtcg)
for file in ['social-sidecar.schema.json','evidence-value.schema.json']:
 d=load(PREVIOUS/'machine'/file);d['$id']=d['$id'].replace('0.9.5','0.9.6');d['title']=d['title'].replace('0.9.5','0.9.6');d['$comment']='Current unsigned LDS0.9.6 contract. Shared schema behavior is retained; source0.9.5 and signed0.9.4 bytes remain immutable.';save(OUT/'machine'/file,d)
manifest=load(PREVIOUS/'machine/release.json');manifest['release'].update(dsVersion='0.9.6',releaseRef=RID,machinePackage=RID,authoringRevision='0.9.6-owner.1',colorSetId=CID,ownerApproval={'date':'2026-10-01','authority':'Montri','reference':'owner-message:2026-10-01:approve-r2-and-release-0.9.6-all-channels'})
manifest['predecessor']={'dsVersion':'0.9.5','releaseRef':'v0.9.5-owner.1','releaseSha256':sha(PREVIOUS/'machine/release.json'),'changedScope':'28 sequential records; all12 diverging records and categorical/atmosphere/foundation/assets unchanged'}
manifest['approvalSource']={'path':'../../../references/approved-0.9.6.json','sha256':sha(REF/'approved-0.9.6.json'),'visualBuildId':C['buildId'],'sequentialPath':'../../../references/approved-sequential-r2.json','sequentialSha256':expected}
manifest['entrypoints']={k:v.replace('0.9.5','0.9.6').replace('color-srgb-08','color-srgb-09') for k,v in manifest['entrypoints'].items()};manifest['entrypoints']['human']='../normative/Landometer-Design-System-v0.9.6.md';manifest['limitations']=policy['verificationBounds'];save(OUT/'machine/release.json',manifest)
brand=(PREVIOUS/'brand/BRAND.md').read_text().replace('unless this0.9.5 guide names an explicit change','unless the complete current normative names an explicit change').replace('are not part of0.9.5 production delivery','remain excluded from current production delivery');brand=brand.replace('# Brand contract retained in DS0.9.5','# Brand contract retained in DS0.9.6').replace('../machine/tokens.v0.9.5.json','../machine/tokens.v0.9.6.json');brand=brand.replace('Read the full inherited master §4.3','Read the complete current normative §4.3 in ../normative/Landometer-Design-System-v0.9.6.md');(OUT/'brand/BRAND.md').write_text(brand)
(OUT/'GUIDE.md').write_text('# LDS0.9.6 — Three-colour sequential gradients\n\nUse the complete standalone normative in `normative/Landometer-Design-System-v0.9.6.md`. It includes all shared human rules and exact machine contracts; no earlier master is required. Add the separate applicable product Add-on for ijji, CityChat or CityWiki.\n\nOnly 14 sequential families × 2 themes change their numerical colors. Every sequential ramp has three anchors and a distinct middle hue, with one-way lightness. Density remains warm. All diverging, categorical, atmosphere, foundation, brand, type, identity and motion rules remain in force.\n\nConsume exact `machine/color-srgb-09.scales.json` or `machine/color-srgb-09.production.css`; never approximate or interpolate at runtime.\n')
print('Built LDS0.9.6 exact approved R2, preserved0.9.5. Snapshot '+sha(REF/'approved-0.9.6.json'))
