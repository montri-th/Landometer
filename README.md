# Landometer Design Identity Playground v0.8.8

The GitHub Pages root is `deployment/` and publishes a product-neutral, source-limited internal team playground at:

**https://montri-th.github.io/Landometer/**

## What team members can do

The page turns the v0.8.8 authoring master into one short route:

1. **Cultivate** — begin with one screen, map, report, or message.
2. **Try** — compare the same object in Needs-revision and Assisted states.
3. **Inspect** — look through Brand DNA, Brand Voice, or Brand Visual one lens at a time.
4. **Align** — preserve object/version, status, source, boundary, limitation, and next action through handoff.
5. **Take away** — copy a 60-second preflight recipe into real work.

The shared Landometer layer covers portfolio, methodology, and product architecture across **Land · Location · Living**. Product data, workflows, scores, models, claims, voice, and capabilities remain product-specific. Cross-product or cross-city comparison requires a compatible schema/release; otherwise incompatibility must remain visible.

## Release boundary

- Design System `0.8.8` owner-approved authoring master
- Build Card `0.8.8`
- Manifest `2.0`
- Token Schema `6`
- profile `brand.public`
- delivery `internal_demo` in a public repository
- `fullLivingReference: false`
- evidence `source_limited`
- `noindex`
- `machineValidation: pending`
- no analytics, sharing, persistence, authentication, search, or external product effect
- regenerated public-safe machine package remains pending; no role-specific adoption proof is claimed

The page reuses the existing repository logo, team-photo, and packaged font bytes without alteration. Their current formal identity/media approval records remain an open manual gate, so this release does not claim package-level or artifact-level conformance.

## Validate

```bash
node tools/validate-release.mjs
```

## Run locally

```bash
python3 -m http.server 8000 --directory deployment
```

Historical v0.8.7 and v0.8.6 files remain versioned migration and compatibility evidence. They are not the current page authority.

## Publishing

The reusable direct publishing workflow is documented at [`skill/publish-landometer-design-system-github-pages/SKILL.md`](skill/publish-landometer-design-system-github-pages/SKILL.md). It requires a clean release branch, direct source writes, exact parity checks, a pull request, non-force merge, Pages verification, and no archive transport.
