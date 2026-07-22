# Landometer Design System v0.8.6 — Living Reference

The repository root deploys the working reference at https://montri-th.github.io/Landometer/.

## Structure

- `deployment/` — GitHub Pages root
- `deployment/assets/downloads/` — implementation starter, Public Specification, version-pinned AI skill, release manifest, and checksums
- `skill/apply-landometer-design-system-v0-8-6/` — inspectable source for the downloadable skill
- `deployment/adoption-demo/` — preserved legacy decision-demo derivative; not part of the public specification or AI skill
- `tools/` — deterministic generation and release checks

## Public boundary

The Public Specification is a generated implementation projection, not the internal normative authority. It excludes internal product profiles, private ledgers/evidence paths, media, font binaries, datasets, credentials, connectors, and deployment authority. The downloadable skill is explicit-invocation only and stops before every external action. No standalone open-source/documentation license has been supplied; downloading does not grant rights to trademarks, logos, photography, fonts, datasets, product material, or third-party assets.

Generated Schema 6/preflight conformance remains pending.

## Validate

```bash
node tools/validate-release.mjs
```

## Run locally

```bash
python3 -m http.server 8000 --directory deployment
```

Then open http://localhost:8000/.
