# Release and normative-gap gates

## Classification

Fix in the artifact when the current source already determines the answer, including:

- inherited foreground on a component-owned surface;
- theme or locale leakage;
- malformed list indentation;
- device-dependent font fallback where a packaged face already exists;
- a Before/After switch that changes only styling.

Write a normative patch proposal when the source lacks an authoritative role or recipe, including:

- Thai fixed-cell font policy;
- universal chart stroke widths;
- dash meaning;
- overlap compositing;
- mandatory worked-example coverage.

Label every proposal `candidate` and state that the active authoring master remains authoritative until owner approval and package generation.

## Publication

- Preserve unrelated working-tree changes.
- Publish only explicit files.
- Validate HTML, controls, fonts, theme/locale state, deep links, and downloaded references.
- Open a pull request from a new branch, merge only after checks pass, and verify the exact production commit.
- Record remaining machine or manual validation honestly.
