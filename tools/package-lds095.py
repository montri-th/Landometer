#!/usr/bin/env python3
"""Build deterministic download archives outside the Git source tree."""
from pathlib import Path
import argparse,hashlib,json,zipfile
p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args()
repo=Path(__file__).resolve().parents[1];source=repo/'plugins/landometer-design-system'
out=a.out.resolve()
if repo==out or repo in out.parents: raise SystemExit('Archive output must be outside the repository')
out.mkdir(parents=True,exist_ok=True)
files=sorted(f for f in source.rglob('*') if f.is_file())
def archive(name,chosen):
 dest=out/name
 with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for f in chosen:
   info=zipfile.ZipInfo('landometer-design-system/'+f.relative_to(source).as_posix(),(2026,9,29,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,f.read_bytes())
 return {'file':name,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'files':len(chosen)}
all_package=archive('landometer-design-system-0.9.5-standalone-r2.zip',files)
# The exact same full package is the source for Design import. Its documented
# import checklist tells designers which guide/assets to select, without
# silently dropping dependencies from the portable source.
(out/'SHA256SUMS.txt').write_text(all_package['sha256']+'  '+all_package['file']+'\n')
(out/'download-manifest.json').write_text(json.dumps({'version':'0.9.5','package':'v0.9.5-owner.1','documentRevision':'standalone-0.9.5-r2','signed':False,'assets':[all_package]},indent=2)+'\n')
print(json.dumps(all_package,indent=2))
