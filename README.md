# Landometer Design System 0.9.6

[Open the design system](https://montri-th.github.io/Landometer/v0.9.6/) · [Download 0.9.6](https://github.com/montri-th/Landometer/releases/tag/v0.9.6) · [Team setup](docs/lds-0.9.6-team-activation.md)

LDS 0.9.6 introduces three distinct hue anchors for all fourteen sequential analytical families in light and dark themes. For example, count on light surfaces moves from cream through green to blue. All light sequential scales start at brand beige; all high endpoints and dark low endpoints retain their 0.9.5 values. The midpoint is a designed hue transition, not a neutral or meaningful numeric pivot. Lightness remains sequential.

Six diverging families, categorical colors, atmosphere gradients, brand voice, typography, identity, motion and motif contracts retain their approved 0.9.5 values. Density remains warm and denominator-specific: area orange, population rose, household scarlet, built area gold. Preserve units, thresholds, direction, zero and exceptional value states.

The website retains the complete handbook inherited from 0.9.1 and developed in 0.9.5: Brand DNA, Voice and Visual, foundations, components, analytical color, motion/motifs, work examples, handoff and product adaptations. Only sequential analytical colors are revised in this release. The owner's wordmark color permission, readable light/dark logo use and rejection of decorative bracket/left-rail highlights remain in force.

## Use it

- [Complete standalone normative — people and machines](plugins/landometer-design-system/assets/lds-0.9.6/normative/Landometer-Design-System-v0.9.6.md)
- [Separate Product Add-ons and Project Sources](deployment/v0.9.6/project-source-0.9.6.md)
- [Current release and exact entrypoints](plugins/landometer-design-system/assets/lds-0.9.6/machine/release.json)
- [Portable AI skill](plugins/landometer-design-system/skills/apply-landometer-design-system/SKILL.md)
- [ChatGPT, Codex, Claude Chat/Cowork/Code and Design activation](docs/lds-0.9.6-team-activation.md)
- [Discord announcements](docs/lds-0.9.6-discord.md)

Use the full LDS base alone for general work. For ijji, CityChat or CityWiki, add its separate Product Add-on alongside the full base. Each Markdown file contains human guidance and exact machine JSON; its JSON projection is an alternative, not another required upload. No previous normative master is needed.

```sh
node plugins/landometer-design-system/scripts/verify.mjs --json
node plugins/landometer-design-system/scripts/select-scale.mjs --family count --theme light --count 7
python3 tools/install-lds096.py                 # review local install plan
python3 tools/install-lds096.py --apply         # Codex + Claude Code, with backups
node tools/validate-release.mjs
```

Use exact supplied 41-stop LUTs or 3/5/7/9-class selections. Do not regenerate colors from endpoints or runtime interpolation. Binary fonts, logos and runtime assets are in the complete package. Package verification does not certify every artifact or activate every team account.

## Release identity and history

- Design System: **0.9.6**
- Color Set: **color-srgb-09**
- Owner distribution: **v0.9.6-owner.1**
- Normative: **standalone-0.9.6-r1**
- Plugin: **0.9.6**
- Website build: **ui-20261001-lds096-r1**
- Owner approval: Montri selected preview R2 and authorized publication as 0.9.6 on 1 October 2026.

This is an owner-approved unsigned distribution. The inherited signature authenticates its original historical package only. No signature, universal accessibility certification, team-wide installation or complete artifact conformance is inferred from this release.

[0.9.5](https://montri-th.github.io/Landometer/v0.9.5/) remains available for explicitly pinned historical work. Its versioned pages, normative files and portable package bytes remain preserved; immutable 0.9.4 and 0.9.1 records are retained. New work uses 0.9.6; adoption of existing artifacts must be explicit.

## Source and publishing

`plugins/landometer-design-system/` is the current portable source. The build copies it into the generated `deployment/v0.9.6/package/` tree and hashes served assets. Historical `deployment/v0.9.5/package/` is a frozen source snapshot so previous download URLs remain stable. ZIP files are GitHub release downloads, not source archives committed to Git.

Required CI retains its stable `validate-lds095` check identifier for branch protection while running the current 0.9.6 validation matrix. Pages verifies the exact deployed bytes. Public handbook pages remain noindex and examples use synthetic data.
