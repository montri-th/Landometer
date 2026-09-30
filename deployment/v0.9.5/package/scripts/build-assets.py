#!/usr/bin/env python3
"""Deterministically project the exact owner-approved R2.1 records into DS 0.9.5. Never interpolate."""
import copy, hashlib, json, re, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'references/inherited/lds-0.9.4'
OUT=ROOT/'assets/lds-0.9.5'
for d in ['machine','build-kit/assets','brand']: (OUT/d).mkdir(parents=True,exist_ok=True)
load=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,obj):
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
D=load(ROOT/'references/approved-r2.1.json');B=load(BASE/'machine/tokens.v0.9.4.json');V=load(BASE/'machine/color-srgb-07.tokens.json')['values']
RID='v0.9.5-owner.1'; CID='color-srgb-08'
slug=lambda s:re.sub(r'([a-z])([A-Z])',r'\1-\2',s).lower().replace('.','-')
policy={
 'schemaVersion':'lds-0.9.5-policy-1','releaseRef':RID,'colorSetId':CID,
 'approval':{'authority':'Montri, owner instruction in this conversation','date':'2026-09-29','approvedVisualBuild':'lds-color-direction-20260929-r2-density-v2','signatureStatus':'unsigned-owner-approved','cryptographicReleaseAttestation':False},
 'precedence':['This versioned 0.9.5 policy and exact assets for explicitly adopted 0.9.5 work','Unchanged 0.9.4 master/rules, including brand and evidence boundaries','Historical packages apply only to artifacts pinned to those packages'],
 'sourceRules':{'COLOR-01':'Exact production CSS or exact class/LUT records in color-srgb-08 only. New literals are not allowed by visual approximation.','DATAVIZ-02':'41 exact approved sRGB samples per family/theme; select 3/5/7/9 classes at round(i*40/(n-1)). No runtime interpolation.','DATAVIZ-03':'Theme-specific approved LUTs replace the historical dark-anchor formula and temporary mid-to-high restriction. Preserve full ranges in both themes.','DATAVIZ-04':'Every delivered analytical sample must avoid the applicable earth and violet windows; pink is allowed. Domain, unit and redundant cues remain mandatory.','DATAVIZ-05':'Stable 10 IDs and cues; exact unchanged light values plus approved dark soft/vivid/ink. Deprecated v5 aliases prohibited.','EVID-05':'Six value states: measured, measured_zero, no_data, out_of_scope, suppressed, not_yet; finite nonzero, zero, or null respectively.','SOCIALFMT-01':'Full inherited sidecar contract admits square1080x1080 and OG1200x630 using the new schema; creative hash and dimensions required.','GOV-01/RELEASE-01':'This owner-approved distribution is unsigned. An artifact may pin this exact channel and report scoped checks, but MUST NOT fabricate or inherit a signed 0.9.5 receipt or call itself fully conformant from package verification.'},
 'analytical':{'families':20,'themes':['light','dark'],'samplesPerTheme':41,'classCounts':[3,5,7,9],'recommendedClassCounts':[5,7],'selection':'round(i * 40 / (n - 1))','minAdjacentClassDeltaEOK':2.2,'fixedLutRequired':True,'runtimeInterpolation':'forbidden','noDataSeparateFromZero':True,'domainAndThresholds':'consumer supplied; never silently normalized or clamped','outlierPolicy':'consumer must declare reject, extend with approved scale, or explicit end-bin; never silently clamp','divergingMidpoint':'must be meaningful and named; no equal-brightness arm claim','warmDensity':{'density.area':'orange','density.capita':'rose','density.household':'scarlet','built':'gold'},'semanticCuesRequired':['metric label','unit','denominator when density','legend','accessible values/table'],'dataRolesCannotUseAtmosphere':True},
 'categorical':{'stableIds':True,'bindBy':'category ID','nonColorCuesRequired':True,'darkInkMinContrastOnCanvas':4.5,'fillSeparation':'>=1px border.default or ink outline; do not imply all light fills meet3:1','vividAndEnergyAccentShareSurface':False},
 'forbiddenAliases':['--ldm-series-NN-light','--ldm-series-NN-dark','--ldm-product-ijji-*','--scale-density-*'],
 'brand':{'voice':['calm','clear','evidence-aware','civic-minded','action-capable'],'preserve':['protected lines and roles','brand core','foundation','semantic states','typography','logo assets','7 atmosphere recipes','layout and motion contracts'],'ijjiIdentity':'ground.mist for light; #59C7E8 to #3BD3CB for dark. Retired warm product aliases must not be used as identity.'},
 'verificationBounds':['Package parity and analytical math are automated.','Rendering, actual surface contrast, native Thai copy, source truth, threshold semantics, CVD/grayscale usability and each output format require artifact review.','No claim of signed0.9.5 release, complete conformance, universal platform enforcement or team installation.','Gold density nine-class minimum >=2.2 but below3.0; prefer5–7 for small marks.','Inherited open governance/product-icon/motif/signing follow-ups remain open unless specifically resolved here.']}
save(OUT/'machine/policy.json',policy)
# Approved records become normative; remove proposal-only comparison metadata.
series=[]
for s in D['series']:
 series.append({k:copy.deepcopy(s[k]) for k in ['id','name','cue','light','dark']})
scales=[]
for s in D['scales']:
 for theme in ['light','dark']:
  x=s['themes'][theme];lut=x['lut'];version=hashlib.sha256(json.dumps({'id':s['id'],'theme':theme,'lut':lut},separators=(',',':')).encode()).hexdigest()
  scales.append({'scaleId':s['id'],'kind':s['kind'],'theme':theme,'label':s['label'],'meaning':s['meaning'],'unitExample':s['unit'],'use':s['use'],'directionLabel':s['directionLabel'],'designNote':s['designNote'],'anchors':x['anchors'],'knots':x.get('knots'),'positions':[0,20,40],'interpolation':'none at consumption; exact approved 41-sample sRGB lookup table','lut':lut,'classes':{str(n):[lut[round(i*40/(n-1))] for i in range(n)] for n in [3,5,7,9]},'canvas':x['canvas'],'noData':B['dataState']['noData'][theme],'zeroOutline':B['dataState']['zero'][theme],'classificationMethod':'consumer supplied with exact thresholds and unit','outlierPolicy':'explicit; never silently clamp','scaleVersion':version})
save(OUT/'machine/color-srgb-08.scales.json',{'schemaVersion':'lds-scales-0.9.5-1','releaseRef':RID,'colorSetId':CID,'records':40,'families':{'sequential':14,'diverging':6},'lutSteps':41,'sourceSnapshotSha256':sha(ROOT/'references/approved-r2.1.json'),'scales':scales})
save(OUT/'machine/color-registry.json',{'schemaVersion':'lds-color-registry-0.9.5-1','releaseRef':RID,'colorSetId':CID,'scales':D['scales'],'series':series,'gradients':D['gradients'],'foundation':D['foundation']})
values={k:copy.deepcopy(V[k]) for k in ['brand','energy','foundation','semantic','signature','product','dataState','map','type','spacing','radius','container','breakpoint','motion']}
values['product'].pop('ijji',None)
values['series']={'registryId':'landometer-series-10-v8','values':series,'defaultVariant':'soft','variants':['soft','vivid'],'policyRef':'policy.json#/categorical'}
values['atmosphere']=copy.deepcopy(B['atmosphere']);values['scaleRegistry']='color-srgb-08.scales.json'
save(OUT/'machine/color-srgb-08.tokens.json',{'schemaVersion':'lds-colors-0.9.5-1','releaseRef':RID,'colorSetId':CID,'scope':'implementation registry; avoid embedding full raw registry in audience UI','values':values})
tokens={k:copy.deepcopy(B[k]) for k in ['brand','atmosphere','foundation','semanticState','dataState','map','typography','icon','control','theme','layout','motion','constraints','socialPreview','evidenceCard']}
tokens.update({'schemaVersion':'11-owner.1','releaseRef':RID,'status':'owner-approved-unsigned','sets':{**B['sets'],'color':CID},'projection':{'registry':'color-srgb-08.tokens.json','scales':'color-srgb-08.scales.json','productionCss':'color-srgb-08.production.css','policy':'policy.json','rawRegistryAudienceEmission':'forbidden'},'categoricalSeries':values['series'],'analyticalScales':{s['id']:{'kind':s['kind'],'light':s['themes']['light']['anchors'],'dark':s['themes']['dark']['anchors'],'use':s['use'],'lutRef':'color-srgb-08.scales.json','sampleCount':41} for s in D['scales']}})
states=tokens['dataState']['valueStates'];states['rule']='EVID-05 as amended in DS0.9.5: six states, never collapse missing into zero';states['states'].insert(0,{'id':'measured','th':'ค่าที่มีข้อมูล','en':'Measured value','glyph':None,'map':'appropriate analytical class with label and unit','table':'exact finite nonzero number with unit','requires':['unit','source','date','boundary','limitation']});states['agentContract']='Every governed numeric value carries measured (finite nonzero), measured_zero (0), or an exceptional state (null).'
# Old evidence-card restriction is explicitly superseded by the typed contract below.
tokens['evidenceCard']['valueStateContractRef']='evidence-value.schema.json'
save(OUT/'machine/tokens.v0.9.5.json',tokens)
# Keep all unaffected atomic declarations byte-equivalent; do not emit obsolete aliases.
css=(BASE/'machine/color-srgb-07.production.css').read_text();decl=dict(re.findall(r'(--[\w-]+):\s*([^;]+);',css))
kept={k:v for k,v in decl.items() if not k.startswith(('--ldm-scale-','--ldm-series-','--ldm-product-ijji-'))}
current=dict(kept)
for s in series:
 nn=s['id'].split('.')[-1]
 for theme in ['light','dark']:
  for tier in ['fill','ink','vivid']:current[f'--ldm-series-{nn}-{tier}-{theme}']=s[theme][tier]
for s in scales:
 k=slug(s['scaleId']);theme=s['theme']
 for i,c in enumerate(s['anchors'],1):current[f'--ldm-scale-{k}-{theme}-anchor-{i}']=c
 for i,c in enumerate(s['lut']):current[f'--ldm-scale-{k}-{theme}-lut-{i:02}']=c
 for n,arr in s['classes'].items():
  for i,c in enumerate(arr,1):current[f'--ldm-scale-{k}-{theme}-class-{n}-{i}']=c
for id,recipe in B['atmosphere']['recipes'].items():current['--ldm-'+slug(id)]=recipe
(OUT/'machine/color-srgb-08.production.css').write_text('/* Landometer DS0.9.5 / color-srgb-08 / v0.9.5-owner.1. Exact frozen sRGB projection. */\n:root {\n'+''.join(f'  {k}: {v};\n' for k,v in sorted(current.items()))+'}\n')
# Theme aliases bind to the projection, avoiding independently copied colour values.
def themed(theme):
 lines=[]
 for k in D['foundation']:lines.append(f'  --{slug(k)}: var(--ldm-foundation-{slug(k)}-{theme});')
 for k in V['semantic']:
  for tier in ['surface','content']:
   key=f'--ldm-semantic-{k}-{theme}-{"background" if tier=="surface" else "foreground"}'
   if key in current:lines.append(f'  --semantic-{k}-{"fill" if tier=="surface" else "ink"}: var({key});')
 lines.extend([f'  --dataviz-zero-outline: var(--ldm-data-state-zero-{theme});',f'  --data-no-data-fill: var(--ldm-data-state-no-data-{theme});'])
 for s in D['scales']:
  roles=['low','mid','high'] if s['kind']=='sequential' else ['neg','zero','pos'];key=slug(s['id'])
  for i,role in enumerate(roles,1):lines.append(f'  --scale-{key}-{role}: var(--ldm-scale-{key}-{theme}-anchor-{i});')
 for i,s in enumerate(series,1):
  nn=f'{i:02}'
  lines += [f'  --series-{i}-fill: var(--ldm-series-{nn}-fill-{theme});',f'  --series-{i}-ink: var(--ldm-series-{nn}-ink-{theme});',f'  --series-soft-{i}-fill: var(--ldm-series-{nn}-fill-{theme});',f'  --series-vivid-{i}-fill: var(--ldm-series-{nn}-vivid-{theme});']
 return '\n'.join(lines)
extra='''  --state-measured-zero-outline: var(--dataviz-zero-outline);
  --state-no-data-fill: var(--data-no-data-fill);
  --state-out-of-scope-fill: transparent;
  --state-suppressed-fill: var(--surface-soft);
  --state-not-yet-fill: var(--semantic-pending-fill);
  --state-label-ink: var(--text-metadata);
  --brand-blue: var(--ldm-brand-blue); --brand-beige: var(--ldm-brand-beige);
  --energy-sky: var(--ldm-energy-sky); --energy-mint: var(--ldm-energy-mint);
  --energy-coral: var(--ldm-energy-coral); --energy-yellow: var(--ldm-energy-yellow);
'''
ext='/* DS0.9.5 theme aliases. Root data-theme=light|dark; unset follows operating system. */\n:root {\n'+themed('light')+'\n'+extra+'}\n:root[data-theme="dark"] {\n'+themed('dark')+'\n}\n@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {\n'+themed('dark')+'\n} }\n:root[data-series="vivid"], :root [data-series="vivid"] {\n'+''.join(f'  --series-{i}-fill: var(--series-vivid-{i}-fill);\n' for i in range(1,11))+'}\n'
ext += (BASE/'build-kit/lds-0.9.4-ext.css').read_text().split('/* EVID-05 value-state treatments')[1].join(['/* EVID-05 value-state treatments',''])
(OUT/'build-kit/lds-0.9.5-ext.css').write_text(ext)
component=(BASE/'build-kit/lds-0.9.4-components.css').read_text(); component='/* Landometer DS0.9.5 components. Inherited0.9.4 style body; colors bind lds-0.9.5-ext.css and color-srgb-08.production.css. Six-state EVID-05 and current policy apply. */'+component[component.index('*/')+2:]; (OUT/'build-kit/lds-0.9.5-components.css').write_text(component)
for p in (BASE/'machine').iterdir():
 if p.suffix in ['.woff2','.png'] or p.name.endswith(('-OFL.txt','-2.0.txt')):shutil.copy2(p,OUT/'build-kit/assets'/p.name)
for folder in ['icons','motif']:
 if (BASE/'build-kit'/folder).exists():shutil.copytree(BASE/'build-kit'/folder,OUT/'build-kit'/folder,dirs_exist_ok=True)
fontmap=[('Arvo','arvo-latin-700-normal.woff2',700,''),('IBM Plex Sans Thai Looped','ibm-plex-sans-thai-looped-thai-700-normal.woff2',700,'U+0E00-0E7F'),('IBM Plex Sans Thai Looped','ibm-plex-sans-thai-looped-latin-700-normal.woff2',700,'U+0000-00FF'),('Bai Jamjuree','bai-jamjuree-thai-400-normal.woff2',400,'U+0E00-0E7F'),('Bai Jamjuree','bai-jamjuree-latin-400-normal.woff2',400,'U+0000-00FF'),('Bai Jamjuree','bai-jamjuree-thai-600-normal.woff2',600,'U+0E00-0E7F'),('Bai Jamjuree','bai-jamjuree-latin-600-normal.woff2',600,'U+0000-00FF'),('JetBrains Mono','jetbrains-mono-latin-400-normal.woff2',400,''),('IBM Plex Sans Thai','ibm-plex-sans-thai-thai-400-normal.woff2',400,'U+0E00-0E7F')]
(OUT/'build-kit/fonts.css').write_text('/* Exact inherited web-font bytes. Non-web applications require the governed platform mapping. */\n'+''.join('@font-face{font-family:"'+family+'";src:url("assets/'+file+'") format("woff2");font-weight:'+str(weight)+';font-style:normal;font-display:swap;'+('unicode-range:'+ur+';' if ur else '')+'}\n' for family,file,weight,ur in fontmap))
(OUT/'build-kit/lds-0.9.5.css').write_text('@import "../machine/color-srgb-08.production.css";\n@import "fonts.css";\n@import "lds-0.9.5-ext.css";\n@import "lds-0.9.5-components.css";\n')
# New schema identities make the prior unsigned repair explicit in0.9.5.
for src,dst in [('social-sidecar.repair.schema.json','social-sidecar.schema.json'),('evidence-value.repair.schema.json','evidence-value.schema.json')]:
 schema=load(ROOT/'references'/src);schema['$id']='https://montri-th.github.io/Landometer/v0.9.5/package/assets/lds-0.9.5/machine/'+dst;schema['title']='Landometer DS0.9.5 '+dst;schema['$comment']='Versioned owner-approved unsigned0.9.5 contract. The original signed0.9.4 schema is unchanged in inherited references.';save(OUT/'machine'/dst,schema)
# DTCG-compatible design-tool interchange (sRGB color object); includes exact theme/LUT/series roles.
dtcg={'$description':'Landometer DS0.9.5 exact sRGB colors. Consult policy.json for meaning; importing tokens is not compliance certification.','$extensions':{'landometer':{'releaseRef':RID,'colorSetId':CID}},'colors':{}}
for key,value in current.items():
 if re.fullmatch(r'#[0-9A-F]{6}',value):dtcg['colors'][key.removeprefix('--ldm-')]={'$type':'color','$value':{'colorSpace':'srgb','components':[int(value[i:i+2],16)/255 for i in [1,3,5]],'alpha':1},'$extensions':{'landometer':{'hex':value}}}
save(OUT/'machine/lds-0.9.5.tokens.dtcg.json',dtcg)
manifest={'schemaVersion':'lds-owner-distribution-1','release':{'dsVersion':'0.9.5','releaseRef':RID,'machinePackage':RID,'authoringRevision':'0.9.5-owner.1','colorSetId':CID,'status':'owner-approved','effectiveFor':'work explicitly adopting this owner distribution','signatureStatus':'unsigned','signedRelease':False,'ownerApproval':{'date':'2026-09-29','authority':'Montri','reference':'owner-message:2026-09-29:approve-r2.1-and-implement-ds0.9.5'}},'inherits':{'dsVersion':'0.9.4','machinePackage':'v0.9.4-mp1','path':'../../../references/inherited/lds-0.9.4','releaseSha256':sha(BASE/'machine/release.json'),'sumSha256':sha(BASE/'machine/SHA256SUMS.txt'),'trustPath':'../../../references/owner-trust/v0.9.4','signedBaseDoesNotSignThisDistribution':True},'approvalSource':{'path':'../../../references/approved-r2.1.json','sha256':sha(ROOT/'references/approved-r2.1.json'),'visualBuildId':D['buildId']},'entrypoints':{'human':'../GUIDE.md','brand':'../brand/BRAND.md','policy':'policy.json','tokens':'tokens.v0.9.5.json','colorRegistry':'color-srgb-08.tokens.json','scales':'color-srgb-08.scales.json','css':'color-srgb-08.production.css','webBuildKit':'../build-kit/lds-0.9.5.css','designTokens':'lds-0.9.5.tokens.dtcg.json'},'counts':{'families':20,'themes':2,'lutColors':1640,'categoricalSlots':10,'atmosphereRecipes':7},'verification':{'command':'node scripts/verify.mjs','scope':'immutable base, approved snapshot parity, typed policy, complete assets, analytical math and CSS projection; not artifact conformance'},'limitations':policy['verificationBounds']}
save(OUT/'machine/release.json',manifest)
# Brand sections byte-for-byte excerpt, preserving0.9.1 wording retained by0.9.4.
master=(BASE/'machine/Landometer Design System v0.9.4.md').read_text();start=master.index('## 4. Brand, voice');end=master.index('### 4.3 Identity roles',start)
(OUT/'brand/BRAND.md').write_text('# Brand contract retained in DS0.9.5\n\nThe following protected lines and voice are exact inherited0.9.4 master §4.1–4.2, unchanged from0.9.1. Data-color changes do not replace brand identity.\n\n'+master[start:end]+'\n## Visual assets and scope\n\nUse the exact logo and font files in `../build-kit/assets/`, and icons/motifs in the build kit. Read the full inherited master §4.3 for identity eligibility, contrast, minimum size and clear space. Do not redraw a logo or replace a missing product symbol with a portfolio mark. The seven atmosphere recipes in `../machine/tokens.v0.9.5.json` retain exact values and roles. Atmosphere is decorative; it must never encode data or state. Brand, foundation, semantic state, spacing, typography and motion contracts are inherited unless this0.9.5 guide names an explicit change.\n\nThe previously approved ijji identity uses ground.mist in light and #59C7E8 → #3BD3CB in dark. The obsolete warm `--ldm-product-ijji-*` aliases are not part of0.9.5 production delivery. Unresolved legacy ijji font/identity claims require the owning product evidence; this release does not invent replacements. WOFF2 files are web assets, not desktop-font installers.\n')
print('Built DS0.9.5 from exact approved R2.1 snapshot:',manifest['approvalSource']['sha256'])
