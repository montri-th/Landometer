# Complete atlas method

## Build the ledger first

Create one record per governed color role. Keep at least:

```yaml
id: ""
family: ""
scope: shared | product
status: governed | candidate | deprecated | historical
theme: light | dark | invariant
value: ""
format: hex | rgb | other-governed-format
sourceVersion: ""
sourcePath: ""
sourceHash: ""
purpose: ""
useWhen: ""
doNotUseFor: ""
redundantCue: ""
```

Record alpha, stop positions, interpolation space, layer order, blend mode, stroke width, dash, and export conversion only when the source governs them. A color without its role and boundary is not an implementation token.

## Use a two-level reference

The primary route answers “which family fits this question?” with compact, directly labelled specimens. The complete atlas answers “what exactly may I implement?” with every record and value.

Do not replace the complete atlas with representative swatches. Preserve deep links from the route into the full families.

## Teach selection, not decoration

Useful selection questions include:

| Need | Route to | Guardrail |
|---|---|---|
| Recognize the brand | approved identity role | keep data and state roles separate |
| Organize a neutral interface | foundation solid | measure contrast on the owned surface |
| Communicate a state | semantic role | add text, icon, or shape |
| Set atmosphere | governed shared gradient | never use it as a numerical scale |
| Distinguish categories | categorical family | keep assignment stable and add a redundant cue |
| Show magnitude | sequential family | state low-to-high direction and classification |
| Show two directions | diverging family | name the meaningful midpoint |
| Layer information | opacity or depth role | preserve stack order and test the composed color |
| Draw structure | line or stroke role | distinguish divider, grid, boundary, focus, and data |

## Show realistic consumers

For each family, show the smallest real consumer that reveals its job:

- a button or focus state for interaction;
- a status row for semantic color;
- a header or editorial panel for atmosphere;
- a legend plus chart or map for data color;
- a boundary, grid, route, or comparison line for strokes;
- a modal, scrim, tooltip, selected area, or uncertainty layer for alpha and overlap.

Keep exact labels and accessible text. An icon is an entry cue, not a substitute for evidence or color values.

## Preserve deterministic delivery

- Prefer explicit sRGB values when that is the governed delivery format.
- Use CSS Color 4, wide gamut, `color-mix()`, blend modes, or dynamic interpolation only when the system governs them and provides a deterministic fallback.
- Generate hosted and standalone specimens from the same registry.
- Pin the artifact build and registry hash for review. A mutable `latest` route is convenient but cannot prove parity.
- Verify source records, generated markup, manifest, and live bytes before diagnosing device color science.

## Responsive and accessibility gates

- At narrow widths, keep a label intact and move its whole mark, strip, or legend to the next row before overlap.
- Do not shrink a color strip until cells lose useful size, hide labels, or paint text over color.
- Test every owned surface after alpha and overlap composition.
- Keep meaning in labels, order, symbols, shapes, patterns, or direct annotation under grayscale and representative color-vision-deficiency simulation.
- Distinguish no-data from measured zero without relying on hue alone.
- Verify keyboard, focus, tooltip, legend, accessible alternative, print, and export behavior where applicable.
