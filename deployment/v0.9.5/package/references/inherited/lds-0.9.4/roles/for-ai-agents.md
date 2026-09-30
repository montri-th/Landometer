# For AI and agents · LDS 0.9.4 (v0.9.4-mp1, effective)

Applies to Claude, Codex, ChatGPT and any internal agent producing or checking Landometer-family work. Read this before the first tool call; the master is the authority, this page is the entry. Here `machine/` means the files of the signed package v0.9.4-mp1 (Drive: `Landometer_Design_System/v0.9.4/machine/v0.9.4/`) placed beside `build-kit/` (from `archives/LDS-0.9.4-candidate-rekey.zip`); with that layout every command below runs as written.

## 1. Load in this order (never from memory)

1. Skill `landometer-design-assets` — resolves the current release and proves bytes by hash. The effective release is v0.9.4-mp1 (`SHA256SUMS.txt` = `9a261eb4df7bf3be5cf1e23f7fb2bd7079c67ca481fc55dccc7049ac52d325cc`); a skill that still points at v0.9.1-mp7 is stale — stop and report the conflict instead of using v0.9.1 values.
2. `machine/release.json` — the only source of the tuple (0.9.4 / 0.9.4-r2 / lds-rules-0.9.4 / v0.9.4-mp1; `#/release`), set ids, file map, `#/release/ownerApproval` (approved 2026-09-17T10:30:13+07:00), `#/release/frozenBy` (signed 2026-09-23 with `landometer.release.2026-09-23.01`), `#/release/ownerDecisions`, `#/release/boardDelta`, `#/release/supersededCandidates`, `#/release/withdrawnCandidate`, `#/frozenAtFreeze`, `#/postApprovalFollowUps`.
3. `machine/tokens.v0.9.4.json` — analytical scales (`#/analyticalScales`, dark = derived; `#/analyticalScalePolicy/bannedHue` and `/darkDerivation/warmLane`), categorical series (`#/categoricalSeries`, v7), value states (`#/dataState/valueStates`), motion (`#/motion/identity`, `#/motion/motifs`, `#/motion/productOverlays`), icon set (`#/icon/iconSet`), social preview (`#/socialPreview`).
4. `machine/rule-catalog.json` — 64 rules with acceptance ids · `machine/component-contracts.v0.9.4.json` — EvidenceCard, MotifFrame, MotionController, DataTable `cellStates`, MapLegend states · `machine/motif-register.v0.9.4.json` — six kinds × jobs × beats, allowed carriers (`#/carrierPolicy`, MOTIF-06), product overlays, boundaries.
5. `machine/color-srgb-07.production.css` — the only colour bytes an audience may receive · `machine/contrast-evidence.json` — GATE-01 evidence of this package.

Verify `sha256sum -c machine/SHA256SUMS.txt` before using any value. A mismatch stops the task; do not repair or guess. `color-srgb-07` is a fresh set id; `color-srgb-06` belongs to the superseded 0.9.3 candidate (and, with different bytes, to the withdrawn 0.9.2 candidate) — identify every registry by hash, never by id, and never redefine an id.

## 2. Plan output before generating anything (master §12.1)

Emit or record, in this order: authority and product layer · one job, audience, dominant object, first AHA, primary action · primary format pack and triggered capabilities · claim/evidence ids and incompatibilities · approved assets (identity, fonts, icons, icon set) · navigation/bookmark/CTA · motion roles with benefit or explicit no-motion · locale state and native review need · gates · assumptions and blockers · **scale families per surface (≤ 1 per zone) and series variant** · **value state of every 0 or empty value and the source/date the EvidenceCard will print** · **icon set, title, OG preview** · **motion moments: kind + job + beat + host surface per moment (≤ 3 per route, none on first_answer / primary_proof / primary_action; the kind × variant × carrier pair allowed in every rendered theme), static motif placements with their carriers, product overlay ids if any, runtime hash and pause control**.

## 3. Rules you apply on every dataviz or data answer

- Family by denominator: totals → `count` · per area → `density.area` · per person → `density.capita` · per household → `density.household`; the legend prints the denominator as the unit (DATAVIZ-02).
- One surface, at most one family per hue zone (warm / green / blue). Mids are never energy or brand tokens (GATE-01 L-MID-02: C ≤ .125, ΔE ≥ 5).
- Dark theme: use the registry dark anchors as they are; never write a dark hex. If you must derive (new family in a proposal), run `deriveSequentialDark` / `deriveDivergingDark` of `validate-dataviz-gates-0.9.4.mjs` (lane-aware: a light mid with hue 30–100° takes the warm-lane formula) and record the input light hex; the only value that is not its derivation is the declared exception age dark mid (DATAVIZ-03).
- Hue windows: no analytical value — anchor or series fill/ink, either theme — inside earth (H 30–100°, C .035–.145, L ≤ .62) or violet (H 285–345°, C ≥ .04), within ΔE 6 of the eight purged earth/taupe values in a 20° lane, or equal to a retired exact value; run `hueVerdict(hex, theme)` of `validate-dataviz-gates-0.9.4.mjs` on every override; never mint a token to escape the gate; warm pink H 350–20° is legal (DATAVIZ-04).
- Categorical: bind `categoricalSeries` (v7) by category id; `dial-soft` unless the Build Card says `seriesVariant: vivid` and the surface has no energy accent (the sky slot counts as one); ink tier for text, lines and marks under 3px (slots 2 and 3 use `--text-primary` in the light theme); shape cues from slot 7; slot 10 is green, the rose set is a recorded alternate (DATAVIZ-05).
- Every value cell and machine field carries one of `measured_zero | no_data | out_of_scope | suppressed | not_yet`. **Never emit a 0 or null without its state.** Never write N/A. The no-data label sits beside the hatch, never on it (EVID-05).
- Evidence labels on cards and answers use Master Brand Brief v0.5.3 §3.7 only: Observed fact · Benchmark interpretation (with universe and peer-group size) · Owner-stated · Inference · Hypothesis · Project evidence.

## 4. Rules you apply on every web, identity or motion output

- Icon set: six sizes from `asset-registry.json#/iconSets` (`iconset.landometer.portfolio.symbol.01`, approved) with matching hashes, manifest, theme-color light/dark; `<title>` = `[page] · [product]` ≤ 60. Missing = WEBFMT-01 blocker (FAVICON-01). A motif is never an icon.
- Link preview: `target.social.og.1200x630.01`; og:title `[object] [period/scope] · [product]` ≤ 60; og:description `[what you will see] · [source · date] · [limitation]` ≤ 155; no "!", no "click now", no emoji, no unitless number; a static final state, never a motif (SOCIALFMT-01).
- Motifs: only through `component.motif-frame.01` with `data-kind`, `data-job` (from the kind's allowedJobs), `data-beat`, `data-variant`; exact runtime bytes (js `3a5caef7…`, css `7cc2deb4…`, twelve final-state SVGs by hash), `autoplay="false"`, replay while ≥ 14% visible, stop off-screen, one page-level MotionController, final state under reduced motion / no-JS / print; never `animation-iteration-count: infinite`; never as favicon, OG image or navigation identity; ≤ 3 moments per route, 1 per task surface, none on the first answer, the primary proof or the primary action (MOTION-04, MOTIF-01…04). Official PNG files never animate.
- Motif carriers (MOTIF-06): every MotifFrame and every static motif image declares `data-host-surface`; resolve it per rendered theme and check `carrierPolicy.allowed[kind][variant]` — full variants only on plain light carriers, quiet only on deep carriers including Brand Blue, never full on Brand Blue, a dark surface or an atmosphere. A themed surface needs `data-variant-dark="quiet"` on a full frame. Full frames carry `ink="blue"`; quiet frames keep the default sky ink. If a pair fails, walk the ladder (carrier → variant → size → remove) and record `quietFallbackRung`; never recolour, plate, scrim or re-tint a motif. Record `hostSurface`, `hostSurfaceHex`, `measuredContrast` and `contrastVerdict` in the Build Card from `carrierPolicy.measured`.

| variant | allowed carriers (every kind unless listed) | exceptions | never |
|---|---|---|---|
| `full` (Brand Blue ink · `ink="blue"`) | `brand.beige`, `surface.alt@light`, `surface.beigeTint@light`, `surface.blueTint@light`, `surface.canvas@light`, `surface.card@light`, `surface.raised@light`, `surface.soft@light` | layers: `surface.canvas@light`, `surface.card@light`, `surface.raised@light` | Brand Blue · dark surfaces · every atmosphere · photographs |
| `quiet` (one sky ink) | `atmosphere.ground.current`, `atmosphere.measure.deep`, `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | layers: `brand.blue`, `surface.alt@dark`, `surface.beigeTint@dark`, `surface.blueTint@dark`, `surface.canvas@dark`, `surface.card@dark`, `surface.raised@dark`, `surface.soft@dark` | every light surface · `atmosphere.ground.mist` · `atmosphere.measure.luminous` · photographs |

- Product overlays: only ids registered in `motif-register.v0.9.4.json#/productOverlays` with `approval.status: owner_approved` and registered bytes (ijji.logo-sting.r3, ijji.four-beat.selected-3.r3 — state-bound only, citychat.conversation-set.1.0.1); CityMETER and CityWiki stings are pre-approved but have no bytes yet and therefore cannot ship; never mix an overlay with a shared motif in one lockup (MOTIF-05).

## 5. Check before you say "done"

```sh
node machine/validate-v0.9.4.mjs --package-trust-store <abs>/owner-trust/v0.9.4/package-release-trust-store.json --package-trust-policy <abs>/owner-trust/v0.9.4/package-release-trust-policy.json   # 5,784 checks with build-kit/ beside machine/: signatures, contracts, gates, motif register
node machine/validate-dataviz-gates-0.9.4.mjs machine/color-srgb-07.tokens.json build-kit/lds-0.9.4-ext.css   # GATE-01 on any registry or proposal (the CSS path is positional; there is no --css flag)
node build-kit/preflight-0.9.4.mjs <page.html> [--json payload.json]   # one page: icons, title, OG, motifs, states, dark parity, hex
```

"Done" means the deployed or exported bytes were inspected, not the local preview. Report the preflight result verbatim, including the follow-ups of master §21 that are outside this package (product icon tiles, CityChat repository label, CityMETER/CityWiki sting bytes, real-screen review of dark LUTs, the warm lane, slot 10 and motif placements; the board items — warm-lane LUT steps inside the earth window, the 200-vs-180 audited-value count, the five undelivered delta files, semantic.warning and the v5 alias outside the DATAVIZ-04 scope; and the post-freeze follow-ups in `machine/release.json#/postApprovalFollowUps`). Rule ids are keyed by releaseRef + ruleId: DATAVIZ-04 of the superseded 0.9.3 candidate is the series rule that is DATAVIZ-05 here, and MOTIF-01 differs from the v0.9.0 rule of that id.

## 6. Never

Invent a hex, a dark anchor, a threshold, an approval or an evidence date · copy values from prose instead of the machine files · pick a side silently when two sources conflict (report the conflict) · raise partial → complete, modelled → observed, LOI → contract, tester count → traction · give a motif a job it does not have, or use motion as evidence, state, loading or navigation · place a motif on a carrier the register does not allow, or change its colours to make it readable · use a brown, terracotta or purple inside the retired hue windows, or mint a token to escape the gate · put candidate/approval status, rule ids or paths on an audience-facing surface (OUTPUT-CLARITY-01) · edit `machine/` or the runtime bytes in place.

## 7. Copy-paste prompt block

```
$landometer-design-assets resolve the current release and verify SHA256SUMS. Then, for [artifact + format] on [runtime]
for [audience/job] in [TH/EN/bilingual] using only [approved sources/evidence release]:
- emit the plan of master §12.1 first (scale families per surface, series variant, value state of every 0/empty value,
  icon set, title, OG preview, motion moments as kind + job + beat ≤ 3 with placement, overlay ids, runtime hash + pause control);
- bind colours only from color-srgb-07.production.css; dark anchors from the registry (never written by hand);
  no analytical value inside the retired earth/violet hue windows (DATAVIZ-04); categorical by category id (series v7); families by denominator;
- every 0/null carries a value state; EvidenceCard fields come from the bound claim record;
- motifs only through MotifFrame with a registered job and a data-host-surface allowed in every rendered theme
  (motif-register.v0.9.4.json#/carrierPolicy); product stings only from motif-register.v0.9.4.json;
- run build-kit/preflight-0.9.4.mjs on the delivered HTML and paste its output;
- report blockers, open items and any schema/release incompatibility before claiming any level above internal preview.
```
