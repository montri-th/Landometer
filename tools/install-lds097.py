#!/usr/bin/env python3
"""Install a verified LDS 0.9.7 filesystem skill. Dry-run unless --apply."""
from __future__ import annotations
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

VERSION = '0.9.7'
SKILL = 'apply-landometer-design-system'
START = '<!-- lds-current:start -->'
END = '<!-- lds-current:end -->'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def files_at(root):
    return {str(p.relative_to(root)): p.read_bytes() for p in root.rglob('*') if p.is_file()} if root.exists() else {}

def merge_block(existing, block):
    if existing.count(START) != existing.count(END) or existing.count(START) > 1 or (START in existing and existing.index(END) < existing.index(START)):
        raise ValueError('Ambiguous LDS routing block; preserve and resolve it before installation.')
    managed = START + '\n' + block.strip() + '\n' + END
    if START in existing:
        return re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: managed, existing, flags=re.S)
    return existing.rstrip() + ('\n\n' if existing.strip() else '') + managed + '\n'

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--apply', action='store_true', help='Apply the displayed scoped installation; default is dry-run')
    ap.add_argument('--home', type=Path, default=Path.home(), help='Home directory to install into (supports isolated validation)')
    ap.add_argument('--targets', default='codex,claude', help='Comma-separated local clients: codex,claude')
    ap.add_argument('--package', type=Path, default=Path(__file__).resolve().parents[1] / 'plugins/landometer-design-system')
    ap.add_argument('--json', action='store_true')
    args = ap.parse_args()
    targets = sorted(set(args.targets.split(',')))
    if not targets or any(t not in ['codex', 'claude'] for t in targets):
        ap.error('--targets must contain codex and/or claude')
    package = args.package.resolve()
    dest_home = args.home.expanduser().resolve()
    if dest_home == Path(dest_home.anchor):
        ap.error('--home must be a user or isolated staging directory, not a filesystem root')
    release_path = package / 'assets/lds-0.9.7/machine/release.json'
    if not release_path.is_file():
        ap.error('Complete 0.9.7 package missing: ' + str(release_path))
    release = json.loads(release_path.read_text())
    version = release.get('release', {}).get('dsVersion')
    if version != VERSION:
        ap.error('Package release version is not 0.9.7')
    node = shutil.which('node')
    if not node:
        ap.error('Node.js is required to verify package integrity before installation')
    result = subprocess.run([node, str(package / 'scripts/verify.mjs'), '--json'], capture_output=True, text=True)
    if result.returncode:
        print(result.stdout + result.stderr, file=sys.stderr)
        ap.error('Package verification failed; no installation changes made')
    source_skill = package / 'skills' / SKILL
    if not (source_skill / 'SKILL.md').is_file():
        ap.error('Package skill entry missing')
    payload = files_at(source_skill)
    payload['SKILL.md'] = payload['SKILL.md'].replace(b'../../', b'./').replace(b'The package root is two directories above this skill.', b'The package root is this skill directory.')
    for directory in ['assets', 'references', 'scripts', 'docs']:
        for relative, data in files_at(package / directory).items():
            payload[directory + '/' + relative] = data
    if not all(any(p.startswith(d + '/') for p in payload) for d in ['assets','references','scripts','docs']):
        ap.error('Self-contained package lacks required assets/references/scripts/docs')
    source_digest = sha(''.join(k + '\0' + sha(v) + '\n' for k, v in sorted(payload.items())).encode())
    writes = {}
    installs = []
    for target in targets:
        client = '.agents' if target == 'codex' else '.claude'
        destination = dest_home / client / 'skills' / SKILL
        installs.append((destination, payload))
        instruction_path = dest_home / ('.codex/AGENTS.md' if target == 'codex' else '.claude/CLAUDE.md')
        old = instruction_path.read_text() if instruction_path.exists() else ''
        block = f'''## Landometer design system — current release {VERSION}
For new Landometer / CityMETER branded design, writing and implementation, load the current skill at `{destination}/SKILL.md` and use its exact assets and checks. This routing applies to Landometer work; preserve an explicit user choice of another system. Preserve explicitly pinned historical releases unless migration is authorized. Verify the release and report actual coverage; local installation does not establish ChatGPT or Claude account/team activation.'''
        writes[instruction_path] = merge_block(old, block).encode()
    if 'codex' in targets:
        legacy_root = dest_home / '.agents/skills/landometer-design-assets'
        legacy_entry = legacy_root / 'SKILL.md'
        if legacy_entry.exists():
            old = legacy_entry.read_text()
            archived = legacy_root / 'legacy-0.9.4-SKILL.md'
            if not archived.exists():
                if 'lds097-managed-resolver' in old:
                    ap.error('Managed legacy resolver has no preserved original')
                writes[archived] = old.encode()
            writes[legacy_entry] = f'''---
name: landometer-design-assets
description: Resolve verified Landometer assets. New or authorized migrated work uses DS 0.9.7; explicit historical work retains its exact release and trust.
---
<!-- lds097-managed-resolver -->
# Landometer asset routing

For new work or an authorized migration, read `{dest_home}/.agents/skills/{SKILL}/SKILL.md` and use its self-contained DS 0.9.7 package. Verify that release before using assets. Do not apply the historical 0.9.4 version ceiling to current 0.9.7 work.

For an artifact explicitly pinned to 0.9.4, read [the preserved resolver](legacy-0.9.4-SKILL.md) and follow its original checks against the unchanged 0.9.4 assets. For 0.9.1 / ijji / CityChat historical receipts, retain the existing matching package and trust. Never relabel or edit signed historical bytes.

If a task selects another release, resolve that exact version; do not silently substitute current. Local filesystem installation covers this client only, not ChatGPT/Claude accounts or the team.
'''.encode()
            metadata = legacy_root / 'agents/openai.yaml'
            old_metadata = metadata.read_text() if metadata.exists() else ''
            metadata_updates = {'display_name': 'Landometer asset resolver', 'short_description': 'Resolve current 0.9.7 and pinned historical assets', 'default_prompt': 'Use $landometer-design-assets to resolve the verified release for this artifact.'}
            for key, value in metadata_updates.items():
                if re.search(r'^  ' + key + r':', old_metadata, re.M):
                    old_metadata = re.sub(r'^  ' + key + r':.*$', '  ' + key + ': ' + json.dumps(value), old_metadata, flags=re.M)
            if not old_metadata.strip():
                old_metadata = 'interface:\n' + ''.join('  ' + key + ': ' + json.dumps(value) + '\n' for key, value in metadata_updates.items())
            writes[metadata] = old_metadata.encode()
        historical = dest_home / '.agents/skills/apply-landometer-design-system-v0-9-4'
        metadata = historical / 'agents/openai.yaml'
        if (historical / 'SKILL.md').exists():
            old = metadata.read_text() if metadata.exists() else ''
            if re.search(r'^\s*allow_implicit_invocation:', old, re.M):
                new = re.sub(r'^(\s*)allow_implicit_invocation:.*$', r'\1allow_implicit_invocation: false', old, flags=re.M)
            elif re.search(r'^policy:\s*$', old, re.M):
                new = re.sub(r'^policy:\s*$', 'policy:\n  allow_implicit_invocation: false', old, count=1, flags=re.M)
            else:
                new = old.rstrip() + '\npolicy:\n  allow_implicit_invocation: false\n'
            writes[metadata] = new.encode()
    changes = []
    for path, data in writes.items():
        if path.is_symlink():
            ap.error('Refusing to replace symlink: ' + str(path))
        if not path.exists() or path.read_bytes() != data:
            changes.append({'path': str(path), 'operation': 'replace-with-backup' if path.exists() else 'create', 'sha256': sha(data), 'bytes': len(data)})
    changed_installs = []
    for path, content in installs:
        if path.is_symlink():
            ap.error('Refusing to replace symlink skill directory: ' + str(path))
        if files_at(path) != content:
            changed_installs.append((path, content))
            changes.append({'path': str(path), 'operation': 'replace-directory-with-backup' if path.exists() else 'create-directory', 'files': len(content), 'payloadDigest': source_digest})
    stamp = dt.datetime.now(dt.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    backup_root = dest_home / '.local/state/landometer-ds/backups' / stamp
    report = {'version': VERSION, 'mode': 'apply' if args.apply else 'dry-run', 'home': str(dest_home), 'targets': targets, 'source': str(package), 'manifestSha256': sha(release_path.read_bytes()), 'payloadDigest': source_digest, 'packageVerification': 'passed', 'changes': changes, 'backupRoot': str(backup_root) if changes else None, 'accountOrTeamActivation': 'not-performed'}
    if args.apply and changes:
        backup_root.mkdir(parents=True)
        for path, content in changed_installs:
            path.parent.mkdir(parents=True, exist_ok=True)
            with tempfile.TemporaryDirectory(prefix='.lds097-stage-', dir=path.parent) as staging:
                staged = Path(staging) / SKILL
                staged.mkdir()
                for relative, data in content.items():
                    out = staged / relative
                    out.parent.mkdir(parents=True, exist_ok=True)
                    out.write_bytes(data)
                checked = subprocess.run([node, str(staged / 'scripts/verify.mjs'), '--json'], capture_output=True, text=True)
                if checked.returncode:
                    raise RuntimeError('Flattened installation verification failed: ' + checked.stdout + checked.stderr)
                if path.exists():
                    backup = backup_root / path.relative_to(dest_home)
                    backup.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(path), str(backup))
                shutil.move(str(staged), str(path))
        for path, data in writes.items():
            if path.exists() and path.read_bytes() == data:
                continue
            path.parent.mkdir(parents=True, exist_ok=True)
            if path.exists():
                backup = backup_root / path.relative_to(dest_home)
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(path, backup)
            path.write_bytes(data)
        receipt = dest_home / '.local/state/landometer-ds/install-0.9.7.json'
        receipt.parent.mkdir(parents=True, exist_ok=True)
        report['installedAt'] = stamp
        report['receipt'] = str(receipt)
        receipt.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0

if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, RuntimeError) as error:
        print('Installation stopped: ' + str(error), file=sys.stderr)
        sys.exit(1)
