#!/usr/bin/env python3
"""Build deterministic LDS 0.9.7 downloads outside the Git source tree."""
from pathlib import Path
import argparse, hashlib, json, zipfile
p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args()
repo=Path(__file__).resolve().parents[1];source=repo/'plugins/landometer-design-system';out=a.out.resolve()
if repo==out or repo in out.parents: raise SystemExit('Archive output must be outside the repository')
out.mkdir(parents=True,exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
def record(path,**extra):return {'file':path.name,'bytes':path.stat().st_size,'sha256':sha(path.read_bytes()),**extra}
def archive(name,payload):
 dest=out/name
 with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for name,data in sorted(payload.items()):
   info=zipfile.ZipInfo(name,(2026,10,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,data)
 return record(dest,files=len(payload))
files=sorted(f for f in source.rglob('*') if f.is_file())
assets=[archive('landometer-design-system-0.9.7.zip',{'landometer-design-system/'+f.relative_to(source).as_posix():f.read_bytes() for f in files})]
skill='apply-landometer-design-system'
payload={f.relative_to(source/'skills'/skill).as_posix():f.read_bytes() for f in (source/'skills'/skill).rglob('*') if f.is_file()}
payload['SKILL.md']=payload['SKILL.md'].replace(b'../../',b'./').replace(b'The package root is two directories above this skill.',b'The package root is this skill directory.')
for d in ['assets','references','scripts','docs']:
 for f in (source/d).rglob('*'):
  if f.is_file():payload[f.relative_to(source).as_posix()]=f.read_bytes()
assets.append(archive('apply-landometer-design-system-0.9.7.zip',{skill+'/'+k:v for k,v in payload.items()}))
for f in sorted((source/'assets/lds-0.9.7/normative').glob('*.md')):
 dest=out/f.name;dest.write_bytes(f.read_bytes());assets.append(record(dest))
manifest={'version':'0.9.7','package':'v0.9.7-owner.1','colorSetId':'color-srgb-10','documentRevision':'standalone-0.9.7-r1','pluginVersion':'0.9.7','signed':False,'assets':assets}
m=out/'download-manifest.json';m.write_text(json.dumps(manifest,indent=2)+'\n')
(out/'SHA256SUMS.txt').write_text(''.join(x['sha256']+'  '+x['file']+'\n' for x in assets+[record(m)]))
print(json.dumps(manifest,indent=2))
