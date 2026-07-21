# Landometer Design System v0.8.6 — Adoption Decision Demo

Interactive stakeholder demo for deciding whether to run a bounded two-week CityMETER pilot across Product, Design, Development, and Marketing.

## Repository structure

- `deployment/` — static website and packaged local assets
- `docs/product-statement.md` — decision and product contract
- `docs/qa-report.md` — release evidence and disclosed limitations
- `release/landometer-ds-adoption-v0.1.zip` — deployment package with `index.html` at ZIP root

## Release status

`PASS WITH DISCLOSED LIMITATIONS`

This remains an internal decision demo even though its source package is published in this public repository by the current user's instruction. It contains no live CityMETER data, records no approval, and does not establish production readiness or broad design-system adoption. Media ownership/credit/expiry and the official identity registry remain incomplete; publication here does not authorize reuse in another destination.

## Run locally

Serve `deployment/` with any static HTTP server. For example:

```bash
python3 -m http.server 8000 --directory deployment
```

Then open `http://localhost:8000`.

## GitHub Pages

The included workflow publishes only `deployment/`, leaving Product Statement, QA evidence, and the ZIP outside the hosted site. If Pages has not been enabled for this repository, select **GitHub Actions** under **Settings → Pages → Build and deployment → Source**.

