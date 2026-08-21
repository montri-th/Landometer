---
name: refine-landometer-experience
description: Orchestrate Landometer-specific experience audits and decide whether a finding is an artifact fix, reusable pattern, or normative proposal. Use for multi-area refinement of a Landometer design-system adoption interface, including value proof, humanized Thai or English learning, deterministic color and typography, action geometry, contrast, motion, contextual discovery, responsive behavior, identity metadata, or the Implementation Library. Preserve shared-versus-product evidence boundaries and do not publish without explicit authorization.
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
7. Test Thai/English, light/dark/system, 320/360/390/768/1024/1180/1440 widths, 130% Thai, 200% zoom, reduced motion, keyboard, blocked third-party font requests, hosted delivery, and portable direct-file delivery as applicable.

## Companion skills

Use the focused sibling skill when the task is mainly one of these reusable concerns, then apply this skill's Landometer-specific evidence and release adapter:

- `$build-complete-design-system-color-atlas` for a full color inventory, selection route, specimens, and analytical-scale reference;
- `$shape-inspiring-design-system-guidance` for problem-first value proof, humanized bilingual copy, visual-first teaching, and case design;
- `$govern-web-identity-and-discovery` for favicon and identity roles, SEO/social metadata, canonical routes, and bounded AI discovery.

Keep typography, capsule geometry, contextual Source Search or AI Mode, responsive label-and-mark geometry, and motion as focused references here. Do not split them into standalone skills until their trigger and authority are genuinely independent.

## Runtime prerequisite

- Use Node.js 18 or newer. Prefer the project-declared or pinned runtime, then resolve `node` from `PATH`; do not hardcode a machine-local absolute path.
- Confirm `node --version` before running the checker or generator and report a missing runtime as a prerequisite, not an interface failure.
- In a read-only audit, run the generator with `--check-index` only. After an authorized atlas change, run `--inject` and then the required `--check-index`.

## Route by task

- For **Brand DNA or Brand Voice value proof**, read [references/value-proof.md](references/value-proof.md).
- For **color, gradients, contrast, opacity, strokes, or technical Thai labels**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **device-to-device palette differences, build/color-set parity, cache suspicion, immutable QA URLs, or registry/hash comparison**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **typography, font weights, script coverage, fallback, self-hosting, preload, Safari direct-file behavior, portable standalone delivery, or font-manifest delivery**, read [references/color-surface-and-type.md](references/color-surface-and-type.md).
- For **sequential/diverging families, LUTs, or 5/7/9-class teaching**, read [references/data-scale-teaching.md](references/data-scale-teaching.md).
- For **logos, browser-tab icons, metadata, SEO, structured data, or AI discovery**, read [references/identity-and-discovery.md](references/identity-and-discovery.md).
- For **text-heavy reference sections or action geometry**, read [references/visual-first-library.md](references/visual-first-library.md).
- For **state transitions, motion, movement, reduced motion, scroll behavior, or parallax requests**, read [references/motion-and-behavior.md](references/motion-and-behavior.md).
- For **handoff, normative-gap classification, or publication**, read [references/release-gates.md](references/release-gates.md).

## Non-negotiable boundaries

- Preserve the Master Brand Brief v0.5.2 §1.1 Culture / Rally Cry exactly: `Let us cultivate our city with data.` Never remove `with data` or fall back to the historical shortened reconciliation.
- Keep shared Landometer guidance product-neutral across Land, Location, and Living.
- Keep product data, claims, voice, scores, models, and capabilities in their product-specific layer.
- Compare products, places, or cities only with a compatible schema/release or an explicit incompatibility notice.
- Keep official identity assets transparent and intact. Use the horizontal lockup for a normal header and only a separately approved compact/symbol asset for an app icon or favicon. Never crop or reconstruct one from the other.
- Keep metadata, robots, canonical routes, machine-discovery aids, manifests, visible status, and runtime effects in exact agreement. Treat `llms.txt` as navigation only, never permission, readiness, or evidence.
- Never demonstrate a design-system benefit by making the baseline illegible or inaccessible.
- Never present a candidate token, line width, overlap recipe, or font role as normative before approval.
- Never use motion, icons, gradients, or an inaccessible baseline to manufacture value that the information and workflow do not provide.
- Prefer self-hosted, script-complete fonts over device-dependent fallback.

## Output contract

Return:

1. the observed result or recommended improvement, depending on whether the task authorizes changes;
2. the preserved evidence boundary;
3. tested state combinations and remaining gaps;
4. reusable skill changes;
5. a separate normative patch proposal when authority must change.
