# Landometer Design System 0.9.7

[Full handbook](https://montri-th.github.io/Landometer/v0.9.7/) · [Story Color Atlas](https://montri-th.github.io/Landometer/v0.9.7/color-atlas.html) · [Location Intelligence](https://montri-th.github.io/Landometer/v0.9.7/#atlas-location-lab) · [Release downloads](https://github.com/montri-th/Landometer/releases/tag/v0.9.7)

LDS 0.9.7 introduces the approved Story supporting vocabulary: the original ten colours plus seven purposeful extensions, for seventeen generic colour values. Its twenty analytical families use three explicit anchors and exact 41-sample LUTs. **Both light and dark backgrounds use identical original analytical HEX values and the same value direction.** There are no automatic dark lightness/chroma adjustments. Use readable labels, boundaries and backing surfaces where data fills approach the background.

The separate **Location Intelligence Profile** defines sixteen named colour roles, twelve measured metrics and four qualitative SWOT evidence lenses. It is used alongside the complete LDS base; it does not turn every business concept into a gradient. Four visual routes intentionally reuse Story scales. Names, units, denominators, signs and evidence remain mandatory; the system does not promise colour-only distinction across every metric or viewer.

Brand Energy, brand voice, typography, identity, wordmark colour permission, shared motifs/animation, categorical colours and atmosphere recipes preserve their current contracts. The complete handbook retains the useful 0.9.1-origin teaching content and subsequent corrections, including the rejection of decorative bracket or left-rail highlights.

## Use it

- [Examples and files by task](https://montri-th.github.io/Landometer/v0.9.7/#use-lds097) — twelve routes covering voice, imagery, identity, typography, colours, evidence, components, experience, products, export, web and AI setup.
- [Story and Location inside the complete Atlas](https://montri-th.github.io/Landometer/v0.9.7/#atlas-current-colours)
- [Animated logo and motifs: preview, SVG and runtime](https://montri-th.github.io/Landometer/v0.9.7/#identity-motion)
- [Current online HTML starter](https://montri-th.github.io/Landometer/v0.9.7/examples/lds097-starter.html) — downloadable; requires online assets, with offline setup instructions.

- [Complete standalone LDS normative](plugins/landometer-design-system/assets/lds-0.9.7/normative/Landometer-Design-System-v0.9.7.md)
- [Separate Location Intelligence Profile](plugins/landometer-design-system/assets/lds-0.9.7/normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md)
- [Project Sources and product Add-ons](deployment/v0.9.7/project-source-0.9.7.md)
- [Platform and team setup](docs/lds-0.9.7-team-activation.md)
- [Discord announcement text](docs/lds-0.9.7-discord.md)

Use one complete base file for general work. Add only the separate Product Add-on and/or Location Profile needed for the task. Markdown is both human- and machine-readable; JSON is an alternative, not another mandatory upload. No previous master or overlay is required.

```sh
node plugins/landometer-design-system/scripts/verify.mjs --json
node plugins/landometer-design-system/scripts/select-scale.mjs --family water --theme dark --count 7
python3 tools/install-lds097.py            # review local plan
python3 tools/install-lds097.py --apply    # local clients, with backups
node tools/validate-release.mjs
```

Release identity: `0.9.7` · `color-srgb-10` · `v0.9.7-owner.1` · `standalone-0.9.7-r1` · website `ui-20261002-lds097-r7`.

This is an owner-approved unsigned distribution. Package integrity is separate from artifact conformance, accessibility, account activation and team adoption. Historical [0.9.6](https://montri-th.github.io/Landometer/v0.9.6/) and [0.9.5](https://montri-th.github.io/Landometer/v0.9.5/) pages and downloads remain byte-preserved for explicit historical pins. New work uses the current release; migration of existing work must be authorized.

`plugins/landometer-design-system/` is the portable source. The current web build copies it into generated `deployment/v0.9.7/package/` and hashes served assets. Historical versioned packages are frozen. ZIPs are release assets, not generated archives committed into source. CI retains its stable `validate-lds095` check name for branch protection while running current release checks. Handbook pages remain noindex; examples are synthetic.

The `ui-20261002-lds097-r7` website revision adds explicit Full/Quiet selection for all six animated-logo and motif examples, with matching carriers and downloads. It retains the integrated Location lab and primary 41 exact LUT steps in both analytical labs without changing normative, analytical values, approved artwork or release archives. No reinstall is required for an existing complete 0.9.7 installation. Rules do not automatically embed animation; use the linked runtime or static SVG for the output. The website starter supersedes the stale version references in the frozen package's `build-kit/example.html` for current learning; the package itself is not silently rewritten.
