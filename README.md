# Landometer Design System v0.8.6 — Living Reference

The repository root deploys a practical design-system reference at https://montri-th.github.io/Landometer/.

## Structure

- `deployment/` — GitHub Pages root
- `deployment/adoption-demo/` — preserved decision-demo derivative
- `deployment/assets/downloads/` — implementation starter files
- `tools/` — deterministic token/scale generation and release checks

## Status

Provisional working reference. The generated v0.8.6 schema, preflight, and migration ledger remain pending, so this site does not claim machine schema/preflight conformance. Formal media permission records and the five-role findability study also remain open release gates.

## Run locally

```bash
python3 -m http.server 8000 --directory deployment
```

Then open http://localhost:8000/.

## Validate the release

```bash
node tools/validate-release.mjs deployment
```
