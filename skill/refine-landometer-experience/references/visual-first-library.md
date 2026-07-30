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

## Density

- Keep one focal question per plate.
- Put no more than three to five primary marks in a mini example.
- Keep long rationale inside the existing disclosure, not on the primary route.
- Add an icon-led `Intent → Design move → Value → Boundary` preview to concept cards; preserve the full text as supporting detail.
- Avoid identical icon cards for every principle. Vary the visual form according to the relationship being taught.

## Action geometry

Treat this geometry mapping as an artifact/reference pattern pending owner approval, not as a normative Landometer rule.

Use the existing `--radius-pill` token for actions whose visible content is text or an icon-and-text label. Let the pill contain the label naturally: keep at least the 44 CSS px target floor, allow wrapping, and do not force a fixed width.

Keep a quiet icon-only utility as a 44 × 44 CSS px circle. Preserve its accessible name, focus ring, and current-state announcement. Do not apply the text-action pill rule to:

- tabs, lens lists, segmented controls, or surface selectors;
- fields, text areas, selects, or filter inputs;
- cards, panels, status chips, tags, or data marks.

Choose geometry by interaction role, not by visual fashion. A component keeps its own governed radius and state contract when it is excluded from the action rule.
