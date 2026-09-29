#!/usr/bin/env python3
"""Release maintenance only. Run after reviewed source edits, never to hide verification failure."""
from pathlib import Path
import hashlib
root=Path(__file__).resolve().parents[1]
owned=['verify.mjs','select-scale.mjs','check-artifact.mjs','validate-social.mjs','value-state.mjs','schema-helpers.mjs','raster-dimensions.mjs','build-assets.py','checksums.py']
files=[p for folder in ['assets/lds-0.9.5','references/inherited/lds-0.9.4','references/owner-trust/v0.9.4'] for p in (root/folder).rglob('*') if p.is_file()]
files += [root/'references'/n for n in ['approved-r2.1.json','social-sidecar.repair.schema.json','evidence-value.repair.schema.json']]
files += [root/'scripts'/n for n in owned]
target=root/'assets/lds-0.9.5/SHA256SUMS.txt'
files=sorted(set(files)-{target})
target.write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(root))+'\n' for p in files))
print(len(files),'files pinned')
