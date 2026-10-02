# LDS 0.9.7 · complete base, separate Add-ons and Location profile

Use the complete LDS base as one human + machine readable Markdown file. It preserves the original 0.9.1 handbook structure and consolidates current rules and exact data. No 0.9.4 master or earlier overlay is required.

| Work | Required current normative sources |
|---|---|
| General Landometer / CityMETER | Full LDS base: one file |
| ijji / CityChat / CityWiki | Full LDS base + matching separate product Add-on: two files |
| Location Intelligence | Full LDS base + Location Intelligence Profile: two files |
| Product work using Location Intelligence | Full LDS base + matching product Add-on + Location Intelligence Profile: three files |

Markdown contains the human rules and lossless machine contract. JSON is an alternative per document; do not upload both formats. The optional Location profile defines 16 roles, 12 measured metrics and four evidence-only SWOT lenses. It does not replace the base or a product Add-on.

| Document | Human + AI Markdown | Machine alternative | MD bytes | MD SHA-256 |
|---|---|---|---:|---|
| Landometer Design System v0.9.7 | [ดาวน์โหลด .md](./normative/Landometer-Design-System-v0.9.7.md) | [JSON](./normative/Landometer-Design-System-v0.9.7.json) | 1,142,051 | `d3085cbc0a50195f1cbf0c77b1d77c0d19b84364daf2948eb367348d65432d96` |
| ijji Add-on v0.5.5 for LDS v0.9.7 | [ดาวน์โหลด .md](./normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.7.md) | [JSON](./normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.7.json) | 227,830 | `3c244db0b554f64b038e4660f649b31a2c16dd538a13c360080d03ef05f02453` |
| CityChat Add-on v0.9.2 for LDS v0.9.7 | [ดาวน์โหลด .md](./normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md) | [JSON](./normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.json) | 24,010 | `345ef4054d7a646a73a8b369549c58c8b11d3190e39de5aa0f59704d6a3223ad` |
| CityWiki Add-on v1.0.0 for LDS v0.9.7 | [ดาวน์โหลด .md](./normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.7.md) | [JSON](./normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.7.json) | 64,342 | `2d91851241bb3a345751f62c801431ce01f67a958a848612fee66dc99f520a7f` |
| Location Intelligence Profile | [ดาวน์โหลด .md](./normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md) | [JSON](./normative/Location-Intelligence-Profile-for-LDS-v0.9.7.json) | 123,685 | `5d4856041709735d3a04d4a510a88b551df86c211fdcab8a0707e8fe7c9efc3b` |

## Find examples and files for your task

Start with the [twelve-task index](./index.html#use-lds097) for brand voice, imagery, identity, typography, colour, evidence, components, experience, product Add-ons, static delivery, web and AI setup. Each route pairs an example with its current files. The [current HTML starter](./examples/lds097-starter.html) can be downloaded and opened with an internet connection; offline use requires the packaged assets.

### Colours and motion

- [Story: 17 supporting colours](./index.html#atlas-story-vocabulary) — the shared vocabulary for charts and supporting graphics, separate from Brand Energy.
- [Shared analytical scales](./index.html#library) — 14 sequential and 6 diverging families, with exact classes and LUT values.
- [Location scales and roles](./index.html#atlas-location-lab) — integrated 41-step lab, 12 measured scales plus four qualitative SWOT lenses; use the separate Location Intelligence Profile above.
- [Animated logo and motif examples](./index.html#identity-motion) — six shared motifs, full/quiet static SVGs, an opt-in preview and links to the exact runtime and wrapper.

The full LDS normative already includes MOTION-04 and MOTIF-01…06. You do not need an older DS document for shared motion rules. Uploading a normative file makes the rules available to the AI; it does not automatically add an animation to a website, design or generated output. For implementation, use the packaged SVG, runtime, CSS, controller and wrapper linked beside the preview. Static documents and reduced-motion output use the final SVG.

Product overlays still follow the matching current Add-on. ijji's four beat motifs are static in Add-on 0.5.5; its finite logo sting is a separate approved use. CityChat's conversation overlay follows Add-on 0.9.2. The gallery explains these differences before linking out to the Studios.

## Install in ChatGPT or Claude Projects

1. Upload the complete base and only the applicable separate Add-on/profile to Project Sources / Files / Knowledge.
2. Set Project Instructions: “Use the attached LDS 0.9.7 full base as current authority, with the matching product Add-on and Location Intelligence Profile when relevant. Read exact HEX/LUT/classes from the supplied sources. Use identical original analytical and role colours on light and dark backgrounds; preserve value direction. Keep evidence labels, units, denominators and meaningful zero.”
3. After verifying the replacement sources, retire superseded DS/Add-on rulebooks from active sources. Retain briefs, research, business requirements, data and evidence. Preserve explicitly pinned historical work.
4. Open a fresh session. Ask the tool to read documentId, releaseRef and colorSetId, then return water 7-class HEX for both themes: the arrays must match. If using the profile, check li.service_gap with zero meaning demand equals supply. Verify the file was actually read; an upload badge alone is not a runtime test.

The website revision ui-20261002-lds097-r7 adds explicit Full/Quiet motif preview selection and matching downloads. It does not change any normative document or release archive. Existing complete 0.9.7 installations need no reinstall for this website revision.

Current identity: standalone-0.9.7-r1 · v0.9.7-owner.1 · color-srgb-10 · unsigned owner distribution.

The Story vocabulary has 17 supporting values and 20 analytical families. Original analytical and Location role HEX values are identical on both themes; no dark derivation, inversion or recolouring. Existing categorical, identity and motif theme rules remain in their own scope. Low mark/background contrast may need readable borders, labels or a neutral plot surface; this release does not certify every artefact or colour pair.

Download actual fonts, logos, CSS, LUT and plugin/skill archives through the [team installation guide](./team-setup.md) and [release assets](https://github.com/montri-th/Landometer/releases/tag/v0.9.7). Project uploads do not automatically update other tools, projects, accounts or team members.
