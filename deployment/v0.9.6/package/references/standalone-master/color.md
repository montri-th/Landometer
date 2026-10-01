**COLOR-01 — Use semantic color tokens.** Authored UI, text, surface, state and data colors MUST resolve governed roles in `color-srgb-08`. Use exact values from `machine.colorRegistry`, `machine.tokens` and `machine.analyticalScales`; do not approximate by eye. State, category and magnitude MUST NOT rely on color alone, and contrast MUST be checked in the actual output context. Approved identity artwork and governed evidence/editorial media retain their approved source pixels and MUST NOT be sampled/reconstructed as interface tokens.

Acceptance:

- COLOR-01-A — automated: authored colors resolve current approved roles or exact LUT/class records; ordinary audience output contains the sanitized values/assets it needs, not internal provenance or approval metadata; no forbidden old series/density/product alias is emitted
- COLOR-01-B — visual: text, controls, focus, graphics and data marks pass their declared contrast requirements in light, dark and print-relevant states at actual size

Production websites use the exact `lds-0.9.5.css` build-kit and its pinned dependencies or a separately verified equivalent projection of the embedded current roles. Charts use exact LUT samples rather than three-anchor interpolation. A DS-reference download such as this document intentionally contains rules and machine records; that purpose does not permit publishing its internal provenance as ordinary product UI. Seven atmosphere gradients are decorative identity assets and MUST NOT encode quantity, category or evidence state.

Forbidden aliases in current work: `--ldm-series-NN-light`, `--ldm-series-NN-dark`, ambiguous `--scale-density-*`, and retired warm `--ldm-product-ijji-*`. Use explicit series fill/ink roles and the denominator-specific analytical family. Approved ijji identity remains `ground.mist` in light and `#59C7E8 → #3BD3CB` in dark; other product identity requires its product-owned approval.
