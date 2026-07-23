# Landometer Design System v0.8.6 public downloads

**Release:** `landometer-design-system-v0.8.6-public.2`<br>
**Public package revision:** 2<br>
**Generated:** 23 July 2026

This release has three separate layers:

1. **Implementation starter** — tokens, a public-safe Build Card, component and voice recipes, and synthetic fixtures.
2. **Public Specification** — shared Landometer implementation rules generated from the locked v0.8.6 source fingerprint. It is not the internal normative authority.
3. **Version-pinned AI skill** — explicit invocation only; no connectors, internal discovery, publishing, deployment, messaging, or external actions.

## Primary files

- [Public Specification](landometer-design-system-v0.8.6-public.md)
- [AI skill ZIP](apply-landometer-design-system-v0.8.6-public.2.zip)
- [AI skill SHA-256 sidecar](apply-landometer-design-system-v0.8.6-public.2.zip.sha256)
- [Implementation starter ZIP](landometer-ds-v0.8.6-starter.zip)
- [Release manifest](landometer-public-release-v0.8.6.json)
- [Complete checksums](SHA256SUMS.txt)
- [Release notes and rights boundary](landometer-public-release-v0.8.6-changelog.md)
- [Inspectable AI skill source](https://github.com/montri-th/Landometer/tree/main/skill/apply-landometer-design-system-v0-8-6)

## Starter files

- `landometer-tokens.css|json|ts` — canonical active token subset
- `build-card-template.yaml` — safe defaults: private, source-limited, non-indexable, assets unresolved
- `component-recipes.md` and `voice-recipes.md` — implementation guidance
- `reference-fixtures.json` — synthetic, local-only proof fixtures

## Integrity coverage

`landometer-public-release-v0.8.6.json` records every payload file and its SHA-256. `SHA256SUMS.txt` covers every payload file plus the release manifest. The checksum file intentionally excludes only itself to avoid self-reference.

The public files do not grant rights to trademarks, logos, photography, fonts, datasets, or product material. No standalone open-source/documentation license has been supplied. Generated Schema 6/preflight conformance remains pending; use does not certify production readiness.
