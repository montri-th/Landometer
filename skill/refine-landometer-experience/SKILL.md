---
name: refine-landometer-experience
description: Audit and refine Landometer design-system adoption interfaces. Use for before/after value demonstrations, Thai/English typography routing, theme and gradient-surface contrast defects, visual-first Implementation Library examples, color-role teaching, mobile wrapping, or deciding whether implementation feedback belongs in code, a reusable pattern, or a normative patch.
---

# Refine Landometer Experience

Improve the interface without changing its evidence, inflating a product-specific fact into shared Landometer truth, or turning the reference into a wall of rules.

## Workflow

1. Resolve the work object, active locale, theme, viewport, lens, surface, and product scope.
2. Reproduce the issue in the smallest state matrix that can expose it.
3. Classify each finding:
   - **artifact defect** — fix in the implementation;
   - **reusable pattern** — add to this skill or its references;
   - **normative gap** — write a proposal and keep it non-authoritative until owner approval.
4. Preserve one primary route. Put detailed rationale and complete galleries in labelled disclosures.
5. Show the improved behavior with a realistic, bounded fixture; keep the original facts unchanged.
6. Run `scripts/check-experience-contracts.mjs <html-file>` and the project release checks.
7. Test Thai/English, light/dark/system, 320/360/390/768/1024/1180/1440 widths, 130% Thai, 200% zoom, reduced motion, keyboard, and blocked third-party font requests as applicable.

## Route by task

- For **Brand DNA or Brand Voice value proof**, read [references/value-proof.md](references/value-proof.md).
- For **color, gradients, contrast, opacity, strokes, or technical Thai labels**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **text-heavy reference sections**, read [references/visual-first-library.md](references/visual-first-library.md).
- For **handoff, normative-gap classification, or publication**, read [references/release-gates.md](references/release-gates.md).

## Non-negotiable boundaries

- Keep shared Landometer guidance product-neutral across Land, Location, and Living.
- Keep product data, claims, voice, scores, models, and capabilities in their product-specific layer.
- Compare products, places, or cities only with a compatible schema/release or an explicit incompatibility notice.
- Keep official logos transparent and intact; change the surrounding governed surface when contrast fails.
- Never demonstrate a design-system benefit by making the baseline illegible or inaccessible.
- Never present a candidate token, line width, overlap recipe, or font role as normative before approval.
- Prefer self-hosted, script-complete fonts over device-dependent fallback.

## Output contract

Return:

1. the user-visible improvement;
2. the preserved evidence boundary;
3. tested state combinations and remaining gaps;
4. reusable skill changes;
5. a separate normative patch proposal when authority must change.
