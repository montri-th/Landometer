# Landometer Design System v0.8.6 — Living Reference

Open the [working reference](https://montri-th.github.io/Landometer/).

## Public release · package revision 2

- [Public Specification](https://montri-th.github.io/Landometer/assets/downloads/landometer-design-system-v0.8.6-public.md)
- [Version-pinned AI skill ZIP](https://montri-th.github.io/Landometer/assets/downloads/apply-landometer-design-system-v0.8.6-public.2.zip)
- [Implementation starter ZIP](https://montri-th.github.io/Landometer/assets/downloads/landometer-ds-v0.8.6-starter.zip)
- [Release manifest](https://montri-th.github.io/Landometer/assets/downloads/landometer-public-release-v0.8.6.json)
- [Complete SHA-256 checksums](https://montri-th.github.io/Landometer/assets/downloads/SHA256SUMS.txt)
- [Download guide](https://montri-th.github.io/Landometer/assets/downloads/README.md)
- [Inspectable AI skill source](skill/apply-landometer-design-system-v0-8-6/)

## Structure

- `deployment/` — GitHub Pages root
- `deployment/assets/downloads/` — implementation starter, Public Specification, version-pinned AI skill, release manifest, checksums, and download guide
- `skill/apply-landometer-design-system-v0-8-6/` — inspectable source for the downloadable skill
- `deployment/adoption-demo/` — preserved legacy decision-demo derivative; not part of the public specification or AI skill
- `tools/` — deterministic generation, packaging, and release checks

## Integrity

The release manifest records every payload file. `SHA256SUMS.txt` covers every payload file plus the release manifest and intentionally excludes only itself.

## Public boundary

The Public Specification is a generated implementation projection, not the internal normative authority. It excludes internal product profiles, private ledgers/evidence paths, media, font binaries, datasets, credentials, connectors, and deployment authority. The downloadable skill is explicit-invocation only and stops before every external action. No standalone open-source/documentation license has been supplied; downloading does not grant rights to trademarks, logos, photography, fonts, datasets, product material, or third-party assets.

Generated Schema 6/preflight conformance remains pending.

## Validate

```bash
node tools/validate-release.mjs
sha256sum -c deployment/assets/downloads/SHA256SUMS.txt
```

## Run locally

```bash
python3 -m http.server 8000 --directory deployment
```

Then open http://localhost:8000/.
