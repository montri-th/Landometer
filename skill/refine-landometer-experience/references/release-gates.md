# Release and normative-gap gates

## Classification

Fix in the artifact when the current source already determines the answer, including:

- inherited foreground on a component-owned surface;
- theme or locale leakage;
- malformed list indentation;
- device-dependent font fallback where a packaged face already exists;
- localized data labels whose fixed grid track is narrower than their rendered text; reserve intrinsic width and verify the text edge remains outside the adjacent chart or color strip;
- a Before/After switch that changes only styling;
- a wide/header lockup incorrectly used as a browser-tab icon;
- HTML metadata, robots, canonical, discovery state, or rendered effects that disagree with the Build Card or manifest.

Write a normative patch proposal when the source lacks an authoritative role or recipe, including:

- Thai fixed-cell font policy;
- universal chart stroke widths;
- dash meaning;
- overlap compositing;
- a universal mapping from interaction roles to pill, circle, field, tab, or card geometry;
- mandatory worked-example coverage;
- a compact/favicon asset role, exact approval record, or delivery recipe that the current identity source does not define.

Label every proposal `candidate` and state that the active authoring master remains authoritative until owner approval and package generation.

## Publication

- Preserve unrelated working-tree changes.
- Publish only explicit files.
- Validate HTML, controls, fonts, theme/locale state, deep links, and downloaded references.
- At narrow widths, measure rendered text bounds rather than only element boxes. Test EN and TH labels beside charts, scales, and color strips at 320/360/390 CSS pixels and 200% text zoom; require a visible gap and no horizontal scroll.
- Pin the immutable filename or release URL used for QA and handoff, and record its build ID plus color-registry hash. Treat mutable root, `current`, and `latest` aliases as convenience routes, not parity evidence.
- Open a pull request from a new branch, merge only after checks pass, and verify the exact production commit.
- Verify the named manual-gate record exists and state whether it remains open. Its static presence is not evidence that the behavior was exercised or passed.
- Record remaining machine or manual validation honestly.
