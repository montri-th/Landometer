#!/usr/bin/env node
// validate-dataviz-gates-0.9.4.mjs — GATE-01 successor of validate-dataviz-gates-0.9.4.mjs (itself the successor of
// handoff-0.9.2/tools/validate-candidate-0.9.2.mjs, SHA-256 ae964d9efde3f0b4ea501091b052c22993c79888bccc27b68ff12887d7f3f329).
// Landometer DS 0.9.4: data-colour gates for BOTH themes (DATAVIZ-02 / DATAVIZ-03 amended / DATAVIZ-04 banned hue / DATAVIZ-05 series / GATE-01 / EVID-05).
// Usage: node validate-dataviz-gates-0.9.4.mjs <color-srgb-07.tokens.json | dataviz proposal.json> [lds-ext.css] [--json out.json]
// Exit 1 on any undeclared failure. Declared exceptions live in sequential.exceptions[] / values.gateExceptions[].
// Deltas from the r2 tool (both recorded in CHANGELOG-0.9.4.md):
//   1. V-POLE-01 applies the same ±.02 L mirror tolerance as D-MID-01 / D-HIGH-01 (the r2 proposal's own poles sit at the
//      clamp floor and quantise to L .759, which the r2 tool rejected by .001 on six poles);
//   2. D-DERIVE-01 (registry input only): every dark anchor equals the DATAVIZ-03 derivation of its light twin, hex-exact,
//      using the same OKLab/gamut code as color-srgb-06.scales.json;
//   3. D-MID-01 chroma bounds carry a ±.001 quantisation tolerance: a derived mid whose target chroma is .1199 can quantise
//      to an 8-bit hex measuring .1201, which is not a design departure (owner confirmed 2026-09-17).
// Deltas of 0.9.4 (delta 0.9.2-r2 → 0.9.4-r1, owner 2026-09-17; the delta's own validate-candidate-0.9.4.mjs was not delivered,
// so its gates are implemented here from the delta text):
//   4. warm lane (light-mid hue 30–100°): dark low OKLCH(.32, .018, hue of light mid), dark mid OKLCH(.66, min(C light mid, .12), same hue);
//      D-LOW-02 requires C ≤ .03 there, D-MID-01 targets L .66, D-STEP-02 widens to 0.5–3.0, D-STEP-03 (per-class step ≥ 2.2 ΔE at
//      class count 5) replaces D-STEP-01 in the lane;
//   5. V-POLE-01 tolerance is ±.005 L (quantisation) — the delta's gate fix; the ±.02 of 0.9.3 is withdrawn for poles;
//   6. B-HUE-01 (DATAVIZ-04): no analytical value in either theme sits in the earth window (H 30–100°, C .035–.145, L ≤ .62) or the
//      violet window (H 285–345°, C ≥ .04); the clay band (light only: H 22–100°, C .09–.145, L .62–.74) warns; SC-17 exact retired values fail;
//   7. B-HUE-02: no analytical value sits within ΔE < 6 of one of the eight earth/taupe values purged in v0.9.0 while inside a 20° hue lane of it;
//   8. B-HUE-LUT (reported, not a delta gate): the same windows are read over every step of the 41-step LUTs so a class colour that
//      falls in a window between two clean anchors is visible in the evidence.
import { readFileSync, writeFileSync } from "node:fs";

// ---- colour math (OKLab / OKLCH, WCAG contrast) — identical to the r2 tool and the registry builder ----
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const rgb = h => { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
export function toLab(h) {
  const [r, g, b] = rgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
}
export const lch = h => { const [L, a, b] = toLab(h); const C = Math.hypot(a, b); let H = Math.atan2(b, a) * 180 / Math.PI; if (H < 0) H += 360; return { L, C, H }; };
export const dE = (a, b) => { const A = toLab(a), B = toLab(b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]) * 100; };
const lum = h => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hueDiff = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
function labToLinear([L, a, b]) { const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3; return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]; }
const inGamut = v => v.every(x => x >= -1e-9 && x <= 1 + 1e-9);
function gamutMap(lab) { let linear = labToLinear(lab); if (inGamut(linear)) return linear; const [L, a, b] = lab; const C = Math.hypot(a, b); const h = Math.atan2(b, a); let lo = 0, hi = C; for (let i = 0; i < 24; i += 1) { const mid = (lo + hi) / 2; if (inGamut(labToLinear([L, Math.cos(h) * mid, Math.sin(h) * mid]))) lo = mid; else hi = mid; } return labToLinear([L, Math.cos(h) * lo, Math.sin(h) * lo]); }
const gam = v => v <= 0.0031308 ? 12.92 * v : 1.055 * (v ** (1 / 2.4)) - 0.055;
const toHex = linear => `#${linear.map(v => Math.floor(Math.min(1, Math.max(0, gam(v))) * 255 + 0.5).toString(16).padStart(2, "0").toUpperCase()).join("")}`;
export function lchToHex(L, C, H) { const h = H * Math.PI / 180; return toHex(gamutMap([L, Math.cos(h) * C, Math.sin(h) * C])); }

export const CANVAS = { light: "#F6F7F3", dark: "#11191D" };
export const BEIGE = "#F2F1DF";
export const ENERGY = { coral: "#FF5A5F", yellow: "#FFBC1F", mint: "#0AD69C", sky: "#59D2FE", brandBlue: "#1D4497" };
export const PIV = { lowL: [.29, .35], lowC: [.04, .07], mid: 1.33, midClamp: [.50, .66], high: 1.30, highClamp: [.78, .90], tol: .02, poleTol: .005, cTol: .001, hueMid: 12, hueHigh: 15, compression: .72, step: [.5, 2.0], sep: 8, poleClamp: [.76, .86], poleC: .08, zeroL: [.29, .35], zeroC: .02 };
export const DERIVE = { lowL: .32, lowC: .05, midC: [.05, .12], highC: [.06, .14], poleC: [.08, .14], zeroL: .32, zeroC: .012 };
// DATAVIZ-03 amended (0.9.4): the warm lane — light-mid hue 30–100° — derives its own dark low and mid.
export const WARM_LANE = { hue: [30, 100], lowL: .32, lowC: .018, midL: .66, midCMax: .12, lowCMax: .03, step: [.5, 3.0], classStepMin: 2.2, classCount: 5 };
export const isWarmLane = light => { const h = lch(light[1]).H; return h >= WARM_LANE.hue[0] && h <= WARM_LANE.hue[1]; };

export function deriveSequentialDark(light) {
  const lm = lch(light[1]); const lh = lch(light[2]);
  const high = lchToHex(clamp(PIV.high - lh.L, ...PIV.highClamp), clamp(lh.C, ...DERIVE.highC), lh.H);
  if (isWarmLane(light)) return [lchToHex(WARM_LANE.lowL, WARM_LANE.lowC, lm.H), lchToHex(WARM_LANE.midL, Math.min(lm.C, WARM_LANE.midCMax), lm.H), high];
  return [lchToHex(DERIVE.lowL, DERIVE.lowC, lm.H), lchToHex(clamp(PIV.mid - lm.L, ...PIV.midClamp), clamp(lm.C, ...DERIVE.midC), lm.H), high];
}

// DATAVIZ-02 LUT (identical to the registry builder): 41 steps, two OKLab segments; classes sample positions round(k·40/(n−1)).
const labInterp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
export function makeLut(anchors) {
  const labs = anchors.map(toLab); const lut = [];
  for (let i = 0; i <= 40; i += 1) { const lab = i <= 20 ? labInterp(labs[0], labs[1], i / 20) : labInterp(labs[1], labs[2], (i - 20) / 20); lut.push(toHex(gamutMap(lab))); }
  lut[0] = anchors[0]; lut[20] = anchors[1]; lut[40] = anchors[2];
  return lut;
}
export const classes = (anchors, n) => { const lut = makeLut(anchors); return Array.from({ length: n }, (_, k) => lut[Math.round(k * 40 / (n - 1))]); };

// DATAVIZ-04 (0.9.4): the retired hue windows of the v0.9.0 purple-brown purge, read as OKLCh windows over every analytical value.
export const BANNED = {
  earth: { hue: [30, 100], C: [.035, .145], Lmax: .62 },
  violet: { hue: [285, 345], Cmin: .04 },
  clay: { hue: [22, 100], C: [.09, .145], L: [.62, .74] },
  purgedEarthTaupe: ["#795300", "#846100", "#686354", "#8B877A", "#B6AD98", "#A59A80", "#827C68", "#85837A"],
  retiredExact: ["#795300", "#846100", "#686354", "#8B877A", "#B6AD98", "#A59A80", "#9E476F", "#E982AE", "#827C68", "#85837A"],
  proximity: { dE: 6, hueLane: 20 },
  pinkRuling: { hue: [350, 20], legal: true, decidedOn: "2026-09-17" }
};
const inHue = (H, [a, b]) => a <= b ? H >= a && H <= b : H >= a || H <= b;
export function hueVerdict(hex, theme) {
  const { L, C, H } = lch(hex); const findings = [];
  if (BANNED.retiredExact.includes(hex.toUpperCase())) findings.push({ gate: "SC-17", window: "retired exact value", severity: "fail" });
  if (inHue(H, BANNED.earth.hue) && C >= BANNED.earth.C[0] && C <= BANNED.earth.C[1] && L <= BANNED.earth.Lmax) findings.push({ gate: "B-HUE-01", window: "earth", severity: "fail" });
  if (inHue(H, BANNED.violet.hue) && C >= BANNED.violet.Cmin) findings.push({ gate: "B-HUE-01", window: "violet", severity: "fail" });
  if (theme === "light" && inHue(H, BANNED.clay.hue) && C >= BANNED.clay.C[0] && C <= BANNED.clay.C[1] && L >= BANNED.clay.L[0] && L <= BANNED.clay.L[1]) findings.push({ gate: "B-HUE-01", window: "clay", severity: "warning" });
  for (const p of BANNED.purgedEarthTaupe) { const d = dE(hex, p); const hd = hueDiff(H, lch(p).H); if (d < BANNED.proximity.dE && hd <= BANNED.proximity.hueLane) findings.push({ gate: "B-HUE-02", window: `proximity to purged ${p}`, severity: "fail", deltaE: +d.toFixed(2), hueDiff: +hd.toFixed(1) }); }
  return { hex, theme, L: +L.toFixed(3), C: +C.toFixed(3), H: +H.toFixed(1), findings };
}
export function deriveDivergingDark(light) {
  const l0 = lch(light[0]); const l2 = lch(light[2]); const canvasH = lch(CANVAS.dark).H;
  const pole = l => lchToHex(clamp(PIV.high - l.L, ...PIV.poleClamp), clamp(l.C, ...DERIVE.poleC), l.H);
  return [pole(l0), lchToHex(DERIVE.zeroL, DERIVE.zeroC, canvasH), pole(l2)];
}

// ---- normalise input: registry (color-srgb-06.tokens.json) or proposal (dataviz-0.9.2.proposal.json) ----
export function normalise(P) {
  if (P.values && P.values.scales) {
    const v = P.values;
    const fams = Object.entries(v.scales).filter(([, d]) => d.kind === "sequential").map(([id, d]) => ({ id, light: d.light, dark: d.dark }));
    const div = Object.entries(v.scales).filter(([, d]) => d.kind === "diverging").map(([id, d]) => ({ id, light: d.light, dark: d.dark }));
    const variants = {};
    const dv = v.series.defaultVariant; const ov = v.series.optInVariant;
    variants[dv] = { light: { fill: v.series.values.map(s => s.light.fill), ink: v.series.values.map(s => s.light.ink) }, dark: { fill: v.series.values.map(s => s.dark.fill), ink: v.series.values.map(s => s.dark.ink) } };
    variants[ov] = { light: { fill: v.series.values.map(s => s.altFill.light), ink: v.series.values.map(s => s.light.ink) }, dark: { fill: v.series.values.map(s => s.altFill.dark), ink: v.series.values.map(s => s.dark.ink) } };
    return { kind: "registry", status: P.meta?.status ?? "", fams, div, lowEx: v.lowAnchor?.exceptions ?? {}, exceptions: v.gateExceptions ?? [], variants };
  }
  return { kind: "proposal", status: P.status, fams: P.sequential.families, div: P.diverging.families, lowEx: P.sequential.lowExceptions || {}, exceptions: P.sequential.exceptions || [], variants: P.series.variants };
}

export function runGates(input, cssText = null) {
  const N = normalise(input);
  const fams = N.fams;
  const sepMap = key => Object.fromEntries(fams.map((f, i) => { let best = 99; fams.forEach((g, j) => { if (i === j) return; const d = dE(f[key][1], g[key][1]) + dE(f[key][2], g[key][2]); if (d < best) best = d; }); return [f.id, best]; }));
  const sepL = sepMap("light"), sepD = sepMap("dark");
  const GATES = [
    ["L-LOW-01", "light", "low is brand.beige unless declared in lowExceptions", f => f.light[0] === BEIGE || N.lowEx[f.id] === f.light[0]],
    ["L-MID-01", "light", "mid L .66–.82 (target .73–.77 warns)", f => { const m = lch(f.light[1]); return m.L >= .66 && m.L <= .82; }],
    ["L-MID-02", "light", "mid is a blend: C ≤ .125 and ΔE ≥ 5 from every energy token + brand.blue", f => { const m = lch(f.light[1]); return m.C <= .125 && Object.values(ENERGY).every(e => dE(f.light[1], e) >= 5); }],
    ["D-LOW-01", "dark", `low L ${PIV.lowL[0]}–${PIV.lowL[1]} (near dark canvas)`, f => { const l = lch(f.dark[0]); return l.L >= PIV.lowL[0] && l.L <= PIV.lowL[1]; }],
    ["D-LOW-02", "dark", `low C ${PIV.lowC[0]}–${PIV.lowC[1]} (warm lane: C ≤ ${WARM_LANE.lowCMax}), hue within ${PIV.hueMid}° of mid (hue visible, not gray)`, f => { const l = lch(f.dark[0]), m = lch(f.dark[1]); const cOk = isWarmLane(f.light) ? l.C <= WARM_LANE.lowCMax + 1e-6 : l.C >= PIV.lowC[0] - 1e-6 && l.C <= PIV.lowC[1]; return cOk && hueDiff(l.H, m.H) <= PIV.hueMid; }],
    ["D-MID-01", "dark", "mid L = 1.33 − L(light mid) clamp .50–.66 ±.02 (warm lane: L .66 ±.02) · C .05–.12 (±.001 quantisation; warm lane: ≤ .12) · hue within 12° of light mid", f => { const m = lch(f.dark[1]), lm = lch(f.light[1]); const target = isWarmLane(f.light) ? WARM_LANE.midL : clamp(PIV.mid - lm.L, ...PIV.midClamp); const cOk = isWarmLane(f.light) ? m.C <= WARM_LANE.midCMax + PIV.cTol : m.C >= .05 - PIV.cTol && m.C <= .12 + PIV.cTol; return Math.abs(m.L - target) <= PIV.tol && cOk && hueDiff(m.H, lm.H) <= PIV.hueMid; }],
    ["D-HIGH-01", "dark", "high L = 1.30 − L(light high) clamp .78–.90 ±.02 · C ≥ .045 · hue within 15° of light high", f => { const h = lch(f.dark[2]), lh = lch(f.light[2]); return Math.abs(h.L - clamp(PIV.high - lh.L, ...PIV.highClamp)) <= PIV.tol && h.C >= .045 && hueDiff(h.H, lh.H) <= PIV.hueHigh; }],
    ["D-STEP-01", "dark", "ΔE(mid→high) dark ≥ 0.72 × light (compression ≤ 1.4×) — outside the warm lane (D-STEP-03 replaces it there)", f => isWarmLane(f.light) || dE(f.dark[1], f.dark[2]) >= PIV.compression * dE(f.light[1], f.light[2])],
    ["D-STEP-02", "dark", "ΔE(low→mid)/ΔE(mid→high) within 0.5–2.0 (warm lane: 0.5–3.0)", f => { const r = dE(f.dark[0], f.dark[1]) / dE(f.dark[1], f.dark[2]); const [a, b] = isWarmLane(f.light) ? WARM_LANE.step : PIV.step; return r >= a && r <= b; }],
    ["D-STEP-03", "dark", `warm lane only: every class step ≥ ${WARM_LANE.classStepMin} ΔE at ${WARM_LANE.classCount} classes`, f => { if (!isWarmLane(f.light)) return true; const c = classes(f.dark, WARM_LANE.classCount); return c.slice(1).every((h, i) => dE(c[i], h) >= WARM_LANE.classStepMin); }],
    ["D-CR-01", "dark", "vs #11191D: low ≤ 2.0:1 · mid vs low ≥ 2.0:1 · high ≥ 7:1", f => cr(f.dark[0], CANVAS.dark) <= 2.0 && cr(f.dark[1], f.dark[0]) >= 2.0 && cr(f.dark[2], CANVAS.dark) >= 7],
    ["SEP-01", "both", "nearest family ΔE(mid)+ΔE(high) ≥ 8 in light AND dark", f => sepL[f.id] >= PIV.sep && sepD[f.id] >= PIV.sep]
  ];
  if (N.kind === "registry") GATES.push(["D-DERIVE-01", "dark", "dark anchors equal the DATAVIZ-03 derivation of the light anchors (hex-exact)", f => { const d = deriveSequentialDark(f.light); return d.every((h, i) => h === f.dark[i]); }]);
  const exceptions = new Map(N.exceptions.map(e => [e.family + "|" + e.gate, e.reason]));
  let hard = 0, declared = 0, warnings = 0;
  const rows = [];
  const unusedExceptions = new Set(exceptions.keys());
  for (const [id, scope, check, test] of GATES) {
    const fail = fams.filter(f => !test(f)).map(f => f.id);
    const undeclared = fail.filter(fid => !exceptions.has(fid + "|" + id));
    const excused = fail.filter(fid => exceptions.has(fid + "|" + id));
    for (const fid of excused) unusedExceptions.delete(fid + "|" + id);
    hard += undeclared.length; declared += excused.length;
    rows.push({ gate: id, scope, pass: fams.length - fail.length, fail: undeclared, excepted: excused, check });
  }
  const warnRows = [];
  for (const f of fams) { const m = lch(f.light[1]); if (m.L < .73 || m.L > .77) { warnings++; warnRows.push({ gate: "WARN-MID", scope: "light", family: f.id, midL: +m.L.toFixed(3), note: "outside target .73–.77 (recorded, not gating)" }); } }
  // diverging (V-POLE-01 with the ±.005 L quantisation tolerance of the 0.9.4 delta)
  const divRows = [];
  for (const f of N.div) {
    const z = lch(f.dark[1]); const okZero = f.light[1] === BEIGE && z.L >= PIV.zeroL[0] && z.L <= PIV.zeroL[1] && z.C <= PIV.zeroC;
    const poleDetail = [0, 2].map(i => { const d = lch(f.dark[i]), l = lch(f.light[i]); const target = clamp(PIV.high - l.L, ...PIV.poleClamp); return { anchor: i === 0 ? "neg" : "pos", L: +d.L.toFixed(3), target: +target.toFixed(3), C: +d.C.toFixed(3), hueDiff: +hueDiff(d.H, l.H).toFixed(1), ok: Math.abs(d.L - target) <= PIV.poleTol + 1e-9 && d.C >= PIV.poleC - 1e-6 && hueDiff(d.H, l.H) <= 15 }; });
    const poles = poleDetail.every(p => p.ok);
    const derive = N.kind === "registry" ? deriveDivergingDark(f.light).every((h, i) => h === f.dark[i]) : null;
    if (!okZero) hard++; if (!poles) hard++; if (derive === false) hard++;
    divRows.push({ family: f.id, "V-ZERO-01": okZero ? "pass" : "FAIL", "V-POLE-01": poles ? "pass" : "FAIL", "D-DERIVE-01": derive === null ? "n/a" : derive ? "pass" : "FAIL", poles: poleDetail, poleDeltaE: { light: +dE(f.light[0], f.light[2]).toFixed(1), dark: +dE(f.dark[0], f.dark[2]).toFixed(1) } });
  }
  // series
  const seriesRows = [];
  for (const [variant, def] of Object.entries(N.variants)) {
    for (const theme of ["light", "dark"]) {
      const inkMin = Math.min(...def[theme].ink.map(c => cr(c, CANVAS[theme])));
      const fillMin = Math.min(...def[theme].fill.map(c => cr(c, CANVAS[theme])));
      const inkOk = inkMin >= 4.5, fillOk = theme === "light" ? true : fillMin >= 3.0;
      if (!inkOk) hard++; if (!fillOk) hard++;
      seriesRows.push({ variant, theme, "S-INK-01": { min: +inkMin.toFixed(2), result: inkOk ? "pass" : "FAIL" }, "S-FILL-01": { min: +fillMin.toFixed(2), result: theme === "light" ? "recorded (edge-separated, DATAVIZ-04)" : fillOk ? "pass" : "FAIL" } });
    }
  }
  // state-label ink (needs the shipped ext CSS)
  const stateRows = [];
  if (cssText) {
    const di = cssText.indexOf('[data-theme="dark"]');
    const get = (block, n) => { const m = block.match(new RegExp("--" + n + "\\s*:\\s*(#[0-9A-Fa-f]{6})")); return m ? m[1].toUpperCase() : null; };
    for (const [theme, block] of [["light", cssText.slice(0, di)], ["dark", cssText.slice(di)]]) {
      const ink = get(block, "text-metadata");
      for (const s of ["surface-canvas", "surface-card", "surface-alt", "surface-soft"]) { const bg = get(block, s); if (!ink || !bg) { stateRows.push({ theme, surface: s, "ST-INK-01": "MISSING", ink, bg }); hard++; continue; } const val = cr(ink, bg); if (val < 4.5) hard++; stateRows.push({ theme, surface: s, ink, bg, contrast: +val.toFixed(2), "ST-INK-01": val >= 4.5 ? "pass" : "FAIL" }); }
    }
  }
  // DATAVIZ-04 — B-HUE-01 / B-HUE-02 / SC-17 over every analytical value (anchors of every family in both themes, series fills and inks of every variant)
  const audited = [];
  for (const f of fams) for (const theme of ["light", "dark"]) f[theme].forEach((h, i) => audited.push({ ...hueVerdict(h, theme), id: `${f.id}.${["low", "mid", "high"][i]}` }));
  for (const f of N.div) for (const theme of ["light", "dark"]) f[theme].forEach((h, i) => audited.push({ ...hueVerdict(h, theme), id: `${f.id}.${["neg", "zero", "pos"][i]}` }));
  for (const [variant, def] of Object.entries(N.variants)) for (const theme of ["light", "dark"]) { def[theme].fill.forEach((h, i) => audited.push({ ...hueVerdict(h, theme), id: `series.${String(i + 1).padStart(2, "0")}.fill.${variant}` })); if (variant === Object.keys(N.variants)[0]) def[theme].ink.forEach((h, i) => audited.push({ ...hueVerdict(h, theme), id: `series.${String(i + 1).padStart(2, "0")}.ink` })); }
  const hueFails = audited.filter(a => a.findings.some(x => x.severity === "fail"));
  const hueWarnings = audited.filter(a => a.findings.length && a.findings.every(x => x.severity === "warning"));
  hard += hueFails.length; warnings += hueWarnings.length;
  // B-HUE-LUT (reported): the same windows over every LUT step of every family in both themes
  const lutFindings = [];
  for (const f of [...fams, ...N.div]) for (const theme of ["light", "dark"]) { const lut = makeLut(f[theme]); lut.forEach((h, i) => { const v = hueVerdict(h, theme); const fails = v.findings.filter(x => x.severity === "fail"); if (fails.length) lutFindings.push({ family: f.id, theme, step: i, hex: h, L: v.L, C: v.C, H: v.H, windows: fails.map(x => x.window) }); }); }
  const lutClassFindings = [];
  for (const f of fams) for (const theme of ["light", "dark"]) for (const n of [5, 7, 9]) classes(f[theme], n).forEach((h, k) => { const fails = hueVerdict(h, theme).findings.filter(x => x.severity === "fail"); if (fails.length) lutClassFindings.push({ family: f.id, theme, classCount: n, classIndex: k + 1, hex: h, windows: fails.map(x => x.window) }); });
  const compression = +(fams.reduce((a, f) => a + dE(f.light[1], f.light[2]) / dE(f.dark[1], f.dark[2]), 0) / fams.length).toFixed(2);
  return { input: N.kind, status: N.status, sequential: fams.length, diverging: N.div.length, gates: rows, warnings: warnRows, divergingGates: divRows, seriesGates: seriesRows, stateLabelGates: stateRows, stateLabelChecked: !!cssText, bannedHue: { ruleId: "DATAVIZ-04", windows: BANNED, audited: audited.length, fails: hueFails, warnings: hueWarnings, lutSteps: { audited: (fams.length + N.div.length) * 2 * 41, findings: lutFindings }, lutClasses: { classCounts: [5, 7, 9], findings: lutClassFindings } }, separationMinimum: { light: +Math.min(...Object.values(sepL)).toFixed(1), dark: +Math.min(...Object.values(sepD)).toFixed(1), threshold: PIV.sep }, compressionLightOverDark: compression, undeclaredFailures: hard, declaredExceptions: declared, unusedDeclaredExceptions: [...unusedExceptions], warningCount: warnings, result: hard === 0 ? "PASS" : "FAIL" };
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (isMain) {
  const args = process.argv.slice(2); const jsonIdx = args.indexOf("--json"); let jsonOut = null; if (jsonIdx >= 0) { jsonOut = args[jsonIdx + 1]; args.splice(jsonIdx, 2); }
  const inputPath = args[0]; const cssPath = args[1] || null;
  if (!inputPath) { console.error("usage: node validate-dataviz-gates-0.9.4.mjs <registry|proposal.json> [ext.css] [--json out.json]"); process.exit(2); }
  const R = runGates(JSON.parse(readFileSync(inputPath, "utf8")), cssPath ? readFileSync(cssPath, "utf8") : null);
  console.log(`\nLandometer DS 0.9.4 — GATE-01 data-colour gates (${R.input}) · ${R.sequential} sequential · ${R.diverging} diverging\n`);
  console.table(R.gates.map(r => ({ gate: r.gate, scope: r.scope, pass: r.pass, fail: r.fail.join(",") || "—", excepted: r.excepted.join(",") || "—", check: r.check })));
  console.table(R.divergingGates.map(r => ({ family: r.family, "V-ZERO-01": r["V-ZERO-01"], "V-POLE-01": r["V-POLE-01"], "D-DERIVE-01": r["D-DERIVE-01"], poleDeltaE: `${r.poleDeltaE.light} light · ${r.poleDeltaE.dark} dark` })));
  console.table(R.seriesGates.map(r => ({ variant: r.variant, theme: r.theme, "S-INK-01": `${r["S-INK-01"].min} ${r["S-INK-01"].result}`, "S-FILL-01": `${r["S-FILL-01"].min} ${r["S-FILL-01"].result}` })));
  if (R.stateLabelGates.length) console.table(R.stateLabelGates); else console.log("ST-INK-01 skipped — pass the shipped ext CSS as the second argument.");
  for (const w of R.warnings) console.log(`WARN-MID ${w.family}: mid L ${w.midL} ${w.note}`);
  console.log(`[B-HUE-01/02] ${R.bannedHue.fails.length === 0 ? "clean" : "FAIL"} — ${R.bannedHue.audited} values audited · fails ${R.bannedHue.fails.length} · clay warnings ${R.bannedHue.warnings.length} · LUT steps in a window ${R.bannedHue.lutSteps.findings.length}/${R.bannedHue.lutSteps.audited} · class colours in a window ${R.bannedHue.lutClasses.findings.length}`);
  for (const f of R.bannedHue.fails) console.log(`  B-HUE fail ${f.id} ${f.hex} (${f.theme}) L ${f.L} C ${f.C} H ${f.H}: ${f.findings.map(x => x.gate + " " + x.window).join("; ")}`);
  console.log(`separation minimum: light ${R.separationMinimum.light} · dark ${R.separationMinimum.dark} (threshold ${R.separationMinimum.threshold}) · compression light/dark ΔE(mid→high) avg ${R.compressionLightOverDark}× (limit 1.4×)`);
  console.log(`\nresult: ${R.result} · undeclared failures ${R.undeclaredFailures} · declared exceptions ${R.declaredExceptions} (unused: ${R.unusedDeclaredExceptions.join(", ") || "none"}) · warnings ${R.warningCount}\n`);
  if (jsonOut) writeFileSync(jsonOut, `${JSON.stringify(R, null, 2)}\n`);
  process.exit(R.undeclaredFailures === 0 ? 0 : 1);
}
