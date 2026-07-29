# Color, surface, contrast, and type

## Surface ownership

Give every component-owned surface its own foreground, secondary text, separator, focus, and metadata colors. Do not place a fixed gradient or panel behind text that still inherits theme-global ink.

Test at least:

- light + Measure;
- light + Ground/Cultivate;
- dark + Measure;
- dark + Ground/Cultivate;
- each pair in Before and After states;
- mobile stacked metadata.

Use deterministic scrims or opaque panels when sampled gradient contrast fails. Preserve canonical gradient stops.

## Color teaching plates

Use one bounded fixture to show:

1. solid surface and semantic state roles;
2. Brand Blue versus interaction accent;
3. flat evidence versus Measure/Ground/Cultivate;
4. categorical versus sequential versus diverging scales;
5. no-data versus meaningful zero;
6. opacity and overlap with redundant labels/patterns;
7. line/stroke meaning and any unresolved token gap.

Mark candidates explicitly. The current v0.8.8 source does not define a universal chart stroke-width scale, dash convention, or overlap compositing recipe.

Never mix canonical dataviz ramps at runtime. Show exact anchors unless the generated LUT and `scaleVersion` are available.

## Thai technical labels

JetBrains Mono covers Latin and numerals in the v0.8.8 package; it is not a Thai face.

Use script-aware routing:

- JetBrains Mono for ASCII identifiers, numbers, and short Latin technical labels.
- Self-hosted Bai Jamjuree for Thai technical labels that do not require fixed cells.
- Self-hosted TlwgMono only when genuine Thai fixed-cell behavior is functionally required and its terminal-style forms pass readability review.

Never let a generic `monospace` fallback choose the Thai face by device. Package the selected face, license record, hashes, and Thai subset; verify computed family after `document.fonts.ready` with third-party requests blocked.
