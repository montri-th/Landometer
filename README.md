# Landometer Design System 0.9.5

[Open the design system](https://montri-th.github.io/Landometer/v0.9.5/) · [Download 0.9.5](https://github.com/montri-th/Landometer/releases/tag/v0.9.5-standalone-r3) · [Team setup](docs/lds-0.9.5-team-activation.md)

DS 0.9.5 adopts the owner-approved R2.1 palette: ten improved dark categorical colors, twenty analytical families in both themes, and four distinct warm density families—orange for area, rose for population, scarlet for household and gold for built area. Light categorical colors, brand voice, visual foundations, fonts, logos and the seven shared atmosphere gradients are retained.

The package includes human guidance, machine JSON/DTCG tokens, production CSS, exact 41-stop lookup tables with 3/5/7/9 class selections, ready-to-use fonts and identity assets, and bounded validators. Historical 0.9.1 pages and signed 0.9.4 source bytes remain intact.

The website carries forward the complete 0.9.1 Implementation Playground: Brand DNA, Voice and Visual, work-object examples, handoff and checklist, foundations, components, data visualization, experience patterns and product adaptations. The approved 0.9.5 Color Atlas is integrated into that handbook. The preserved source is `deployment/index.v0.9.1.html`; `tools/build-lds095-full-guide.mjs` applies explicit current-release updates without rewriting that archive.

Website build `ui-20260930-lds095-r3` exposes the owner’s identity clarification in Thai and English: wordmark colours may vary (including per-letter colours), gray is optional, and official logos may appear on readable light or dark backgrounds. The earlier layout corrections remain. The new base and separate Add-ons bind revision r3; product rules, original assets, approved analytical colours and schema identities remain unchanged.

The current normative uses the complete 0.9.1 document structure updated in place to 0.9.5, including machine JSON. Use the full LDS base; for ijji, CityChat or CityWiki also use its separate Product Add-on. This replaces the old predecessor-master-plus-overlay/eight-file installation without duplicating LDS inside product files. Document revision `standalone-0.9.5-r3` records this consolidation while approved design values remain `v0.9.5-owner.1 / color-srgb-08`.

## Use it

- [One-file standalone normative — people and machines](plugins/landometer-design-system/assets/lds-0.9.5/normative/Landometer-Design-System-v0.9.5.md)
- [Separate Product Add-ons and Project Source setup](deployment/v0.9.5/project-source-0.9.5.md)
- [Brand voice and visual principles](plugins/landometer-design-system/assets/lds-0.9.5/brand/BRAND.md)
- [Machine release and exact entrypoints](plugins/landometer-design-system/assets/lds-0.9.5/machine/release.json)
- [Portable AI skill](plugins/landometer-design-system/skills/apply-landometer-design-system/SKILL.md)
- [ChatGPT, Codex, Claude Chat/Cowork/Code and Design activation](docs/lds-0.9.5-team-activation.md)

```sh
node plugins/landometer-design-system/scripts/verify.mjs --json
node plugins/landometer-design-system/scripts/select-scale.mjs --family density.capita --theme dark --count 7
python3 tools/install-lds095.py                 # dry-run
python3 tools/install-lds095.py --apply         # local Codex + Claude Code, with backups
node tools/validate-release.mjs                # package + site + retained history
```

The repository has ChatGPT/Codex and Claude marketplace manifests. Local installation does not activate account or team policies: use the linked administrator instructions, record the actual scope, and test in a new session. Claude Design needs a separate design-system import and default. Required CI checks enforce their measured scope; human brand review and rendered checks remain necessary.

## Release identity and authority

- Design System: **0.9.5**
- Color Set: **color-srgb-08**
- Package: **v0.9.5-owner.1**
- Web build: **ui-20260930-lds095-r3**
- Approval: Montri approved R2.1 for implementation and selected 0.9.5 on 29 September 2026.
- This is an owner-approved **unsigned distribution**, with exact hashes. The inherited signature authenticates 0.9.4 only; it does not sign 0.9.5. No private signing key is included or used.
- Package integrity, output conformance, visual accessibility, and account activation are separate evidence.

Examples use synthetic data. Density requires the correct denominator and does not establish population, eligibility, risk or behavior. Gold is preferably 5–7 classes for small marks; color-vision and device perception are not universally certified. Fonts retain their included licenses; logo/brand rights are not granted by downloading this repository.

## Source and publishing

`plugins/landometer-design-system/` is the source of truth for the portable package. The Pages build copies that source into `deployment/v0.9.5/package/` and hashes every served release asset. ZIP downloads are generated release assets, not source transport committed to Git.

`deployment/index.v0.9.1.html` and the earlier immutable standalones retain the original reference. Retained tests read that archived source and frozen workflow receipts; the current 0.9.5 validator independently checks its new package and served bytes. Public pages remain noindex.

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory deployment
```
