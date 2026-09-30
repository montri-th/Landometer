---
name: apply-landometer-design-system
description: Create, revise or review Landometer and CityMETER artifacts using LDS 0.9.6 brand guidance, verified colors, fonts, logos and analytical scales. Use for branded design, dashboards, web, code, slides and documents; preserve an artifact’s explicitly pinned historical release.
---

# Apply Landometer DS 0.9.6

Use this package for new Landometer work and owner-authorized migrations. First inspect the artifact’s declared DS release. Preserve an explicitly pinned historical release unless the task authorizes migration; never relabel old signed assets. An explicit user-selected different design system remains authoritative for that task.

## Resolve before designing

The package root is two directories above this skill. Resolve relative paths from this file, not the current working directory.

1. Read [`release.json`](../../assets/lds-0.9.6/machine/release.json) and [`brand-and-visual.md`](../../docs/brand-and-visual.md). Run `node <package-root>/scripts/verify.mjs --json` when execution is available. Stop using package assets if integrity verification fails; preserve the diagnostic and resolve the mismatch.
2. Read the [complete standalone 0.9.6 normative](../../assets/lds-0.9.6/normative/Landometer-Design-System-v0.9.6.md). It contains all current human rules and exact machine contracts in one document. For ijji, CityChat or CityWiki work, read the matching separate Product Add-on in the same directory alongside the complete LDS base. The Add-on contains only product-specific rules and binds the exact base. Never replace LDS with an Add-on or duplicate LDS inside product files. Earlier master/overlay/fragmented sources are superseded for new work. Use the supplied fonts, official logo files, CSS and tokens directly. Do not recreate or approximate logo artwork, numerical colors, gradient stops or font binaries.
Landometer identity: wordmark colours may change, including per-letter colours, while keeping letterforms and proportions. Gray is optional. Official logos may appear on readable light and dark backgrounds; a Brand Blue visibility issue does not prohibit dark backgrounds generally. Do not apply MOTIF-06 full/quiet restrictions to official logo PNGs. This owner permission needs no additional per-colour approval and does not extend to symbol recolouring or analytical/UI colours. Read LOGO-01 and `machine.policy.identity` in the current normative.

3. Record version `0.9.6`, the actual release ID and manifest SHA-256 in the artifact handoff. Package integrity, artifact checks and human review are different evidence: report each truthfully. This owner-approved release is not a newly cryptographically signed machine package; the inherited 0.9.4 signed baseline remains immutable.

If the environment cannot execute the verifier, inspect the release and exact files available, label runtime verification as pending, and do not claim a full validation pass. If a required asset is absent, retrieve the same pinned package from the repository or report that missing dependency; do not invent an equivalent.

## Use the right color semantics

- Choose analytical family from the metric and denominator. All density families are warm and distinct: area **orange**, per-capita **rose**, household **scarlet**, built-area **gold**. Show the denominator in the legend. A density color alone never establishes population, eligibility, risk or behavior.
- Every sequential ramp has three explicit anchors, with a distinct middle hue rather than a lighter end hue. Light ramps start cream; dark ramps use their own one-way luminance range. The middle hue is not a numerical/diverging midpoint. Use all exact approved LUT samples.
- Use `node <package-root>/scripts/select-scale.mjs --family density.capita --theme dark --count 7` to obtain an exact family/theme/class set. Use the supplied 41-stop lookup table for continuous scales. Do not derive an analytical scale from only its end colors, borrow a different theme’s table, or restore deprecated v5 aliases.
- Use 5 or 7 classes for compact marks. Nine classes are available; review the selected class count at the intended size. Preserve units, direction, zero and class intervals. Missing, withheld and not-applicable values must not look like zero.
- Categorical IDs and cue assignments stay stable. Light categorical colors are retained; dark soft and vivid use the approved new values. Keep labels, symbols or position as additional cues. Distinct hues are not a claim of universal color-vision accessibility.
- Shared atmosphere gradients are decorative brand assets, separate from analytical measurement. Their seven recipes remain unchanged.

## Build for people and machines

Use the brand voice and visual foundations consolidated in the current standalone normative. Use calm, clear, evidence-aware, civic-minded, action-capable language. Preserve protected wording exactly, native Thai review, truthful evidence states, source/limitations near claims and product boundaries. Use visible focus and readable light/dark states; test the delivered format rather than assuming CSS tokens alone prove accessibility.

Use `node <package-root>/scripts/read-normative.mjs <standalone-file> --summary` to verify document identity; omit `--summary` for the lossless machine projection. Exact colors and the runtime selector share the same approved source.

For code or HTML, run `node <package-root>/scripts/check-artifact.mjs <artifact-file>` on the resulting supported artifact. Follow its declared coverage; a static color check is not a browser, accessibility, brand-voice or full design-system certificate. The host repository should require its release checks before merge. For slides, documents and design files, retain exact tokens and assets and review the rendered export alongside the human guide.

## Platform activation and delivery

Read [`activation-th.md`](../../docs/activation-th.md) when installing or distributing the package. Local filesystem skills cover local coding clients; ChatGPT workspaces, Claude Chat/Cowork and Claude Design require their own activation. Never report the whole team as installed from one local install or from a successful upload alone.

A useful handoff includes the artifact, pinned release/hash, actual automated results and any remaining human or runtime checks. Do not publish, send team messages or change account settings merely because this skill is loaded; follow the user’s authorization for the task.
