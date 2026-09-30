**DATAVIZ-02 — Sequential scales use exact approved samples and semantic families.** Select the family from the metric and its denominator, then the actual output theme. The authoritative analytical colors are the exact 41-sample sRGB lookup table in `machine.analyticalScales` for each family/theme; displayed anchors are summaries, not a recipe for recreating the table. Every intermediate knot and sample MUST remain exact. Do not interpolate a new palette at consumption, rebuild from endpoints/three anchors, or mix light and dark records.

Fourteen sequential families retain explicit meaning:

| Zone | Family | Select for |
|---|---|---|
| warm | `activity` | activity, transactions, usage |
| warm | `density.area` | per km² / per rai / other declared area denominator; orange |
| warm | `heat` | measured heat/temperature/hotspot quantity |
| warm | `risk` | source-supported hazard/risk quantity |
| warm | `density.household` | declared household denominator; scarlet |
| warm | `density.capita` | declared population/person denominator; rose |
| warm | `built` | governed built-form metrics; gold, including built-density measurements |
| green | `price` | price/appraisal/rent or other governed monetary quantity |
| green | `age` | elapsed building/business age |
| green | `growth` | cumulative index or growth rate |
| blue | `confidence` | stated estimate confidence/data quality |
| blue | `count` | totals such as population, firms or vehicles; not density |
| blue | `water` | governed water measurements |
| blue | `duration` | travel, waiting or inundation duration |

Density families are warm and visually distinct: area orange, people rose, households scarlet, built metrics gold. A topic alone does not choose a denominator. Legends MUST print the unit and denominator; never infer official population, eligibility, risk or behavior from the choice of color. Use the preserved `built` ID, not the ambiguous `density` alias.

One analytical surface uses at most one family per hue zone. Independently labelled panels with their own metric, legend and reading path are separate analytical surfaces. A reference color atlas intentionally compares families and is not a measurement overlay. These distinctions do not remove denominator labels or the need to make measurements distinguishable.

The six diverging families are `balance`, `delta`, `tradeoff`, `flow`, `sentiment`, `anomaly`. Their midpoint MUST be meaningful and named. Use their exact theme-specific table and preserve direction; do not assert equal brightness between arms. The neutral class generally spans a declared interval around the midpoint, not only an exact zero value.

Discrete classes use `n ∈ {3,5,7,9}` and exact indices `round(i × 40 / (n − 1))`, for integer `i = 0…n−1`. Prefer 5–7 for compact marks. Adjacent classes meet the approved 2.2 ΔE OKLab diagnostic threshold; the gold nine-class minimum is below the optional 3.0 aspiration, so review it at delivered size. This diagnostic is not a universal CVD-accessibility claim.

The consumer supplies domain, classification method, exact thresholds, unit, direction and outlier policy. A selector without a domain MUST NOT invent thresholds. Equal intervals may be generated only when explicitly labelled and appropriate to the analysis. Continuous intervals are `[lower, upper)` except the final closed interval. Values outside the domain need explicit rejection, approved extension or a declared end-bin; never silently clamp. Renderer, legend, accessible values/table and export MUST use identical thresholds and colors.

Acceptance:

- DATAVIZ-02-A — automated: selected family/theme resolves an exact current LUT with 41 samples; classes use only approved counts and exact sample indices; domain/unit/denominator/thresholds/outlier handling are declared and identical across renderer, legend, accessible data and export; one family per zone per analytical surface; no ambiguous density alias
- DATAVIZ-02-B — visual: the actual continuous ramp and selected classes are readable without band/hue reversal at their delivered sizes in each offered theme/print context; independent analytical panels preserve clear family/denominator labels and accessible non-color alternatives

**DATAVIZ-03 — Each theme uses its exact approved analytical table.** Every dark analytical sample MUST equal its approved `color-srgb-08` dark record. Dark records are independently approved deliverables; consumers MUST NOT derive them from the light anchors, substitute a light ramp, restrict warm families to mid→high, or introduce custom dark overrides. Preserve the full approved range and all intermediate knots in both themes. Sample parity is separate from actual contrast and readability on the artifact's surface.

Acceptance:

- DATAVIZ-03-A — automated: every dark LUT/class/override equals the exact approved family/theme record and sample index; no runtime light-to-dark derivation, truncated warm range or custom interpolation is used
- DATAVIZ-03-B — automated: sequential lightness direction and diverging-arm direction, approved class-step diagnostics, exact theme parity and applicable hue-window checks pass for all shipped records; results bind the actual delivered bytes
- DATAVIZ-03-C — visual: dark ramps are readable at actual size and on the intended surface; review low/high values and family distinction on the delivered screen, including low brightness when relevant, without claiming that numeric diagnostics replace this review

**GATE-01 — Data-colour gates run for both themes on every release.** Validate the current approved snapshot, exact token/LUT/production-CSS projections, all 20 families × 2 themes × 41 samples, categorical fill/ink and declared step/hue diagnostics. A mismatch or undeclared failure blocks package use. Save scoped, dated evidence bound to the exact files/hashes; historical gate reports do not certify new bytes. Package checks MUST NOT be described as complete artifact, native-language, CVD or account-installation validation.

The current package verifier checks immutable-source integrity, approved color snapshot parity, typed policy, complete assets and analytical mathematics. The artifact checker separately inspects supported delivered formats and reports its limits. Actual foreground/background contrast, gray/CVD usability, thresholds, native Thai/English composition, keyboard/zoom and export review remain artifact-specific. No new exception may be invented to bypass a failed MUST; any proposed normative change requires owner decision and the version policy in §0.2.

Acceptance:

- GATE-01-A — automated: current exact snapshot, token/LUT/CSS parity, 40 records/1,640 samples, approved class indices/steps and applicable hue checks pass with hash-bound evidence; failed or untested checks are not reported as pass
- GATE-01-B — manual: the release record accurately distinguishes owner approval, package diagnostics and artifact review; no new exception, signature, conformance level or platform activation is claimed without its actual authority/evidence

**DATAVIZ-04 — Analytical values stay out of the retired hue windows.** Every delivered analytical LUT sample, class, anchor and categorical fill/ink in both themes must satisfy the applicable retired-color gates. Earth: OKLCh H 30–100°, C .035–.145, L ≤ .62. Violet: H 285–345°, C ≥ .04. Light clay band H 22–100°, C .09–.145, L .62–.74 is a warning. Proximity to the eight retired earth/taupe values within a 20° hue lane must not be below ΔE 6. The ten exact retired values remain prohibited. Warm pink H 350–20° is allowed; no new token may be minted to escape a gate. The exact retired-value list and gate parameters are in the embedded machine contract.

The scope includes all 41 samples, not only three displayed anchors. Governed semantic states and approved image pixels keep their own role-specific contracts; the analytical ban does not authorize recoloring identity artwork or evidence media.

Acceptance:

- DATAVIZ-04-A — automated: all current analytical samples/classes and categorical values satisfy the applicable earth/violet/proximity/exact-retired-value gates; light clay warnings are recorded; overrides pass the same checks and do not invent escape tokens
- DATAVIZ-04-B — visual: delivered ramps/categories do not read as rejected brown, terracotta or violet; legal warm pink reads as intended in both offered themes on the actual screen/export

**DATAVIZ-05 — Categorical series are luminous and edge-separated.** Use `landometer-series-10-v8`, ten stable category IDs with exact theme-specific soft/vivid fill and ink roles. Current light values are retained; current dark soft/vivid/ink values are the approved redesigned set. Assignments persist by category ID through filtering and sorting. Default is soft; vivid is an explicit surface choice. Vivid charts and energy accents MUST NOT compete on the same surface. The governed sky energy-accent cue retains its surface constraints even in soft.

Fills need not reach 3:1 against canvas: adjacent areas require a ≥1px `border.default` edge or an ink outline; legend swatches require a hairline border. Text, lines and marks thinner than 3px use the ink tier, with ≥4.5:1 for normal text on its actual canvas/card. Where ink falls back to `text.primary`, category identity remains in fill plus cue. Preserve the ten cue assignments: circle, square, triangle, diamond, cross, star, hexagon, ring, dash, plus. Every use needs a non-color cue; slots 7–10 require their shape cue. Do not restore old v5 aliases or substitute old dark values.

Acceptance:

- DATAVIZ-05-A — automated: colors resolve the exact v8 category/theme/variant/ink records by stable category ID; normal ink reaches 4.5:1 on its actual surface; required edges/legend borders and shape cues are present; thin marks use ink; delivered variant agrees with the Build Card and does not share a surface with a forbidden energy accent
- DATAVIZ-05-B — visual: categories remain distinguishable at actual feed/print/dark sizes through labels/shapes/position as well as color; category-ID assignments do not change when filtered or sorted; no universal color-vision-accessibility claim is inferred from hue differences
