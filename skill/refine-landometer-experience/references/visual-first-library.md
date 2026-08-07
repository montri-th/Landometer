# Visual-first Implementation Library

Use text to explain the decision that a visual cannot carry. Use visuals to reveal structure, comparison, state, and consequence.

## Conversion pattern

Convert long guidance into:

```text
one question
→ one realistic fixture
→ direct labels
→ one value moment
→ one visible boundary
→ detail on demand
```

Choose:

- outline icons with rounded joins for role recognition;
- before/after UI specimens for copy or interaction change;
- diagrams only for real sequence, dependency, causality, or handoff;
- charts for quantitative relationships;
- product-neutral fixtures for shared guidance;
- product-specific fixtures only when their evidence and release are named.

Keep accessible text alternatives and direct labels. Do not replace essential evidence with an icon.

## Case quartet

For a major principle or pattern family, pair the concise route with at least three constructive cases and one rejected case. Vary the intent, work object, or visual relationship—not just the color or icon. Keep the rejected example readable, name why it fails, and show the repair.

Each constructive case should reveal:

```text
Intent → Design move → AHA → Value → Boundary → Next action
```

Use at least one realistic rendered consumer for each major principle. An icon card can introduce it, but a UI specimen, diagram, chart, map, or approved image must show the behavior when the relationship is visual.

## Density

- Keep one focal question per plate.
- Put no more than three to five primary marks in a mini example.
- Keep long rationale inside the existing disclosure, not on the primary route.
- Add an icon-led `Intent → Design move → Value → Boundary` preview to concept cards; preserve the full text as supporting detail.
- Avoid identical icon cards for every principle. Vary the visual form according to the relationship being taught.
- Avoid decorative icon saturation. Every icon needs a distinct role, direct label, and accessible name when interactive.

## Responsive reflow

- Treat a localized label and its adjacent mark, chart, scale, legend, or diagram as one responsive unit.
- Keep the label intact and move the whole visual below it before text and color can overlap.
- Let cards and diagrams change layout at their own content-driven threshold; do not rely on one desktop breakpoint.
- Measure rendered text and mark bounds in Thai and English at 320/360/390 CSS pixels and representative 200% text zoom.
- Preserve reading order and focus order when the visual stacks.

## Action geometry

For Landometer v0.8.8-r2, text-labelled and icon-plus-label actions use the owner-approved capsule family and icon-only utilities remain circular. Cards, fields, disclosures, table/navigation rows, tooltips, tabs, and segmented selectors keep their own semantic geometry; never generalize the action capsule into a rule that every clickable container must be pill-shaped.

Use the existing `--radius-pill` token for actions whose visible content is text or an icon-and-text label. Let the pill contain the label naturally: keep at least the 44 CSS px target floor, allow wrapping, and do not force a fixed width.

Keep a quiet icon-only utility as a 44 × 44 CSS px circle. Preserve its accessible name, focus ring, and current-state announcement. Do not apply the text-action pill rule to:

- tabs, lens lists, segmented controls, or surface selectors;
- fields, text areas, selects, or filter inputs;
- cards, panels, status chips, tags, or data marks.

Choose geometry by interaction role, not by visual fashion. A component keeps its own governed radius and state contract when it is excluded from the action rule.
