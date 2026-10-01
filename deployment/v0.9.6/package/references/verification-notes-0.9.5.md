# DS0.9.5 package verification · 29September2026

`verification-0.9.5.json` records the final Node verifier result after the source package was frozen. The approvedR2.1 snapshot SHA256 is `ebe57188c0824577628f8913a62f1c0794d1522214c54af63703281dfb07e011`. The complete inherited signed0.9.4 package passes5784checks independently. DS0.9.5 remains owner-approved and unsigned.

Additional direct browser checks: **48PASS**. All10series colors match the exact registry in each of four combinations: light/soft, light/vivid, dark/soft, dark/vivid. The root theme and vivid buttons work; operating-system dark mode works; the no-data hatch is present; the example has no horizontal overflow at320,390,768and1440pixels. Tested in a fresh headless Chrome instance with the actual bundled stylesheet and local fonts. This does not certify full accessibility or every consumer artifact.

State/selector boundary checks: **11PASS**. Finite measured values, measured zero and null no-data are accepted. Nonzero values disguised as measured zero, hidden numeric suppressed values, and zero disguised as measured are rejected. Valid density selection and an explicitly centered diverging domain are accepted. Atmosphere-as-scale, unsupported class count8, and an omitted diverging midpoint are rejected.

Scope limits remain in `assets/lds-0.9.5/machine/policy.json`. In particular, palette parity is not evidence truth, metric validity, rendered contrast on every surface, complete format conformance, signed activation, or account/team installation.
