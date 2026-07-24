# Landometer Design System v0.8.7 — Living Reference

The GitHub Pages root is `deployment/` and publishes the v0.8.7 public source-limited working reference at `https://montri-th.github.io/Landometer/`.

## Scope

- `Adopt` — Cultivate → Try → Align → Locale Insight → Culture → Reference takeaway
- `Reference` — searchable source-derived rules with one active rule at a time
- `Lab` — ten local-only proofs plus scale, polygon/heatmap, typography, motion, and coverage fixtures
- shared Landometer architecture remains product-neutral; product data, workflow, scores, models, claims, voice, and capabilities remain product-specific
- cross-city or cross-product comparison requires a compatible schema/release, otherwise incompatibility is shown

## Release boundary

- Design System `0.8.7`
- Manifest `2.0`
- Token Schema `6`
- profile `designsystem.adoption`
- evidence `source_limited`
- `noindex`
- `machineValidation: pending`
- no analytics, sharing, persistence, authentication, or external product effect

## Validate

```bash
node tools/validate-release.mjs
```

## Run locally

```bash
python3 -m http.server 8000 --directory deployment
```

The v0.8.6 implementation remains available in Git history as migration and compatibility evidence; it is not current authoring authority.

## Reusable skills

- [`apply-landometer-design-system-v0-8-6`](skill/apply-landometer-design-system-v0-8-6/SKILL.md) — frozen v0.8.6 public implementation skill retained for compatibility.
- [`publish-landometer-design-system-github-pages`](skill/publish-landometer-design-system-github-pages/SKILL.md) — direct GitHub source-write, parity, clean-branch, PR, merge, Pages, and live-endpoint verification workflow. It explicitly forbids ZIP/TAR release transport and force-pushing `main`.
