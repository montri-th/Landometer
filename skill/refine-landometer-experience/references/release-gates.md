# Release and normative-gap gates

## Classification

Fix in the artifact when the current source already determines the answer, including:

- inherited foreground on a component-owned surface;
- theme or locale leakage;
- malformed list indentation;
- device-dependent font fallback where a packaged face already exists;
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
- Pin the immutable filename or release URL used for QA and handoff, and record its build ID plus color-registry hash. Treat mutable root, `current`, and `latest` aliases as convenience routes, not parity evidence.
- Open a pull request from a new branch, merge only after checks pass, and verify the exact production commit.
- Verify the named manual-gate record exists and state whether it remains open. Its static presence is not evidence that the behavior was exercised or passed.
- Record remaining machine or manual validation honestly.
