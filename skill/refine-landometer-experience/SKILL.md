---
name: refine-landometer-experience
description: Audit and refine Landometer design-system adoption interfaces. Use for before/after value demonstrations, approved identity and favicon delivery, SEO or AI-discovery metadata parity, build/color-set parity, complete analytical-scale teaching, Thai/English typography routing, action geometry, theme and gradient-surface contrast defects, visual-first Implementation Library examples, mobile wrapping, or deciding whether implementation feedback belongs in code, a reusable pattern, or a normative patch.
---

# Refine Landometer Experience

Improve the interface without changing its evidence, inflating a product-specific fact into shared Landometer truth, or turning the reference into a wall of rules.

## Workflow

1. Resolve the work object, active locale, theme, viewport, lens, surface, product scope, delivery, visibility, evidence status, indexability, agent readability, and exact identity asset approval.
2. Reproduce the issue in the smallest state matrix that can expose it.
3. Classify each finding:
   - **artifact defect** — fix in the implementation;
   - **reusable pattern** — add to this skill or its references;
   - **normative gap** — write a proposal and keep it non-authoritative until owner approval.
4. Preserve one primary route. Put detailed rationale and complete galleries in labelled disclosures.
5. Show the improved behavior with a realistic, bounded fixture; keep the original facts unchanged.
6. Run `scripts/check-experience-contracts.mjs <html-file>` and the project release checks. For a complete color atlas, also run `tools/generate-color-atlas.mjs --check-index`.
7. Test Thai/English, light/dark/system, 320/360/390/768/1024/1180/1440 widths, 130% Thai, 200% zoom, reduced motion, keyboard, and blocked third-party font requests as applicable.

## Runtime prerequisite

- Use Node.js 18 or newer. Prefer the project-declared or pinned runtime, then resolve `node` from `PATH`; do not hardcode a machine-local absolute path.
- Confirm `node --version` before running the checker or generator and report a missing runtime as a prerequisite, not an interface failure.
- In a read-only audit, run the generator with `--check-index` only. After an authorized atlas change, run `--inject` and then the required `--check-index`.

## Route by task

- For **Brand DNA or Brand Voice value proof**, read [references/value-proof.md](references/value-proof.md).
- For **color, gradients, contrast, opacity, strokes, or technical Thai labels**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **device-to-device palette differences, build/color-set parity, cache suspicion, immutable QA URLs, or registry/hash comparison**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **typography, font weights, script coverage, fallback, self-hosting, preload, or font-manifest delivery**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **sequential/diverging families, LUTs, or 5/7/9-class teaching**, read [references/data-scale-teaching.md](references/data-scale-teaching.md).
- For **logos, browser-tab icons, metadata, SEO, structured data, or AI discovery**, read [references/identity-and-discovery.md](references/identity-and-discovery.md).
- For **text-heavy reference sections or action geometry**, read [references/visual-first-library.md](references/visual-first-library.md).
- For **handoff, normative-gap classification, or publication**, read [references/release-gates.md](references/release-gates.md).

## Non-negotiable boundaries

- Keep shared Landometer guidance product-neutral across Land, Location, and Living.
- Keep product data, claims, voice, scores, models, and capabilities in their product-specific layer.
- Compare products, places, or cities only with a compatible schema/release or an explicit incompatibility notice.
- Keep official identity assets transparent and intact. Use the horizontal lockup for a normal header and only a separately approved compact/symbol asset for an app icon or favicon. Never crop or reconstruct one from the other.
- Keep metadata, robots, canonical routes, machine-discovery aids, manifests, visible status, and runtime effects in exact agreement. Treat `llms.txt` as navigation only, never permission, readiness, or evidence.
- Never demonstrate a design-system benefit by making the baseline illegible or inaccessible.
- Never present a candidate token, line width, overlap recipe, or font role as normative before approval.
- Prefer self-hosted, script-complete fonts over device-dependent fallback.

## Output contract

Return:

1. the observed result or recommended improvement, depending on whether the task authorizes changes;
2. the preserved evidence boundary;
3. tested state combinations and remaining gaps;
4. reusable skill changes;
5. a separate normative patch proposal when authority must change.
