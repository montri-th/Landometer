# Analytical color reference

## Start with the question

- **Which category?** Use a categorical assignment with stable labels and a redundant shape or pattern.
- **How much?** Use a sequential family with a declared low-to-high direction.
- **Which direction around what point?** Use a diverging family with a meaningful, named midpoint.

Do not let red/green silently imply bad/good. The meaning comes from the measured concept, domain, legend, and evidence boundary.

## Preserve the full source

For each governed family, retain:

- family ID, kind, theme, version, and exact values;
- domain, direction, classification method, thresholds, and outlier policy;
- no-data, measured zero, uncertainty, and neutral midpoint treatment;
- every governed class count;
- the full lookup table when one is supplied;
- renderer, legend, accessible-alternative, and export parity.

For a long lookup table, provide a machine-readable or table-form alternative containing every exact stop or class. Announcing only the family name and endpoint colors is not an equivalent alternative when intermediate values are implementation evidence.

Use solid generated cells for discrete classes. Do not substitute a continuous CSS gradient or let a chart library remap the palette.

## Teach with cases

Show at least three different analytical questions when the reference claims broad scale guidance:

1. a magnitude question using sequential color;
2. a meaningful two-direction question using diverging color;
3. a category or map question using stable assignments and non-color cues.

Add one rejected case that makes the failure visible, such as a decorative brand gradient used for magnitude or a diverging family without a real midpoint. Keep the baseline readable and explain the repair.

## Narrow-width contract

Treat each localized label and its color strip as one responsive unit. When the row cannot fit, move the complete strip below the intact label. Measure rendered text bounds, strip bounds, cell widths, and page overflow in every supported locale and at representative text zoom.
