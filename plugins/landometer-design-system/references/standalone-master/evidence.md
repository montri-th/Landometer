**EVID-05 — Zero is a fact; missing is a question.** Every governed value cell, map unit and machine field carries one of six states: `measured`, `measured_zero`, `no_data`, `out_of_scope`, `suppressed`, `not_yet`. `measured` carries a finite nonzero number; `measured_zero` carries numeric `0`; the four exceptional states carry `null`. Do not collapse missing, suppression or scope into zero. Suppressed underlying values MUST NOT leak through HTML attributes, JSON or hidden exports. Agents receive the explicit state with every governed numeric/null value.

| State | ป้ายไทย · English | Machine value | Visible / map treatment | Required context |
|---|---|---|---|---|
| `measured` | ค่าที่วัดได้ · Measured | finite nonzero number | exact value + unit; approved analytical class | unit, source, time, scope, denominator when relevant |
| `measured_zero` | ศูนย์ (สำรวจแล้ว) · Zero (measured) | `0` | numeral 0 + unit; lowest-class fill + `dataState.zero` outline 2px | unit, survey completeness |
| `no_data` | ไม่มีข้อมูล · No data | `null` | — + short reason; 135° hatch + `border.emphasis`; sort last | reason, latest available value when there is one |
| `out_of_scope` | นอกขอบเขตข้อมูล · Out of scope | `null` | scope text; bare basemap, no fill/hatch | scope statement |
| `suppressed` | ปิดค่า · Suppressed | `null` | `‹n` + threshold; `surface.soft` + dashed `border.emphasis` | threshold, aggregation level permitting disclosure |
| `not_yet` | ยังไม่ถึงรอบข้อมูล · Not yet available | `null` | … + expected date; pending surface + dotted pending ink | expected date, source cycle |

The exact typed contract is `machine.schemas["evidence-value.schema.json"]`; values/cues are in `machine.tokens.dataState.valueStates`. Labels use `text.metadata`, never disabled-hint `text.muted`, and must reach 4.5:1 on the actual label surface. Do not place labels directly over the no-data hatch; put them in a readable legend/table/caption. "N/A", a bare dash without explanation and rendering missing as 0 are prohibited. EvidenceCard's nonzero `data-value` must equal the exact visible number.

Sentences retain claim context: TH “ปี 2568 ไม่พบโรงงานใหม่ในตำบลนี้ (0 แห่ง)” / “ยังไม่มีข้อมูลปี 2568 — ล่าสุดคือปี 2567”; EN “No new factories were registered here in 2025 (0).” / “No 2025 figure — latest available is 2024.” These are examples, not product evidence.

Acceptance:

- EVID-05-A — automated: every governed value has exactly one of six states and the corresponding finite nonzero/zero/null type; no suppressed value appears in delivered bytes; no unlabelled N/A, bare dash or missing-as-zero; EvidenceCard visible/machine values agree and DataTable/MapLegend bindings resolve the same state contract
- EVID-05-B — visual: measured, zero and four exceptional states remain distinguishable through text, pattern, outline and labels in light, dark, print and static export; labels use `text.metadata` and pass 4.5:1 on their actual surface
- EVID-05-C — manual: visible copy communicates the state, reason and latest value or expected date when applicable in the user's language, with specific context instead of a generic disclaimer
