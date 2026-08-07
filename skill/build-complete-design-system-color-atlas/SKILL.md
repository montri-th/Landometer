---
name: build-complete-design-system-color-atlas
description: Build or audit a complete design-system color atlas and analytical-scale reference. Use when documentation must show every governed solid, semantic, gradient, opacity, layer or depth, line or stroke, categorical, sequential, diverging, map, and light or dark color role with exact values, realistic specimens, responsive examples, accessibility cues, and source or hash parity. Do not invent missing normative tokens; label candidates and keep product palettes in their owning product layer.
---

# Build Complete Design System Color Atlas

Turn a color system into a complete, usable reference: a short visual route for choosing a family, followed by the exact full atlas for inspection, implementation, and QA.

## Workflow

1. Resolve the authoritative token, registry, scale, manifest, and release sources. Separate governed, candidate, deprecated, historical, and product-owned records before rendering.
2. Freeze the inventory. Include every applicable family rather than a hand-picked sample. Read [references/atlas-method.md](references/atlas-method.md).
3. Build two levels:
   - a concise selection route that starts with the design or analytical question;
   - a complete disclosure containing every exact record, state, value, source boundary, and implementation note.
4. Generate specimens from the same source records used by the product. Never hand-copy, visually approximate, or interpolate governed values at runtime.
5. Pair each family with at least one realistic use specimen. Show the visual result, a direct label, when to choose it, and one important boundary.
6. When categorical, sequential, diverging, or map color is present, read [references/analytical-color.md](references/analytical-color.md).
7. Verify light/dark, active themes, narrow widths, text zoom, reduced color perception, grayscale, contrast on the actual owned surface, and renderer/legend/accessible-alternative/export parity.
8. Bind the artifact to an immutable build ID, source version, registry or token hash, and generated-output hash. Treat device differences as build or registry mismatch until parity is proven.
9. Report unresolved roles as normative gaps. Do not fill them with plausible-looking values.

## Coverage contract

Inventory every applicable record in these groups:

- brand and identity-only color roles;
- foundation solids and semantic states;
- shared atmosphere gradients and product-owned gradients;
- interaction accent versus brand color;
- categorical assignments and redundant cues;
- sequential and diverging families, every governed class count, and full lookup tables when supplied;
- map values, boundaries, no-data, measured zero, uncertainty, and selection;
- opacity, scrim, overlay, depth, and overlapping-layer roles;
- line, divider, focus, boundary, grid, and chart stroke roles;
- light, dark, high-contrast, print, or export variants when governed.

If a group is absent from the source, mark it `not governed` or `candidate`; absence is not permission to invent it.

## Boundaries

- Keep shared design-system families product-neutral. Product identity, data, map, and analytical palettes stay in the owning product layer.
- Compare products or places only under a compatible schema and release, or name the incompatibility.
- Do not reuse a decorative or identity gradient as a quantitative scale.
- Do not encode state or category with color alone.
- Do not claim contrast from token pairs alone; measure the rendered foreground, alpha stack, and owned surface.
- Preserve exact values even when the primary route is simplified. Simplification changes navigation, not the registry.

## Output contract

Return:

1. source hierarchy, release identity, and inventory counts;
2. the concise selection route and complete atlas;
3. realistic specimens and accessible alternatives;
4. tested theme, viewport, zoom, and perception states;
5. source/output hashes and cross-device parity status;
6. candidate or missing normative roles, kept separate from governed records.
