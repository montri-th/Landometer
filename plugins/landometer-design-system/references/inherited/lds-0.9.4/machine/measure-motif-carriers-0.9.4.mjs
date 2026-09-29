#!/usr/bin/env node
// Landometer Design System 0.9.3 candidate — MOTIF-06 carrier measurement (motif-register.v0.9.4.json#/carrierPolicy).
// Method of motif-quiet-fallback.json (landometer-quiet-fallback/1.0, owner-approved 11 September 2026): every visible
// authored paint of a governed motif SVG (fill and stroke, at the alpha the file authors) is composited over the carrier
// in sRGB, rounded to the 8-bit pixel a screen shows, and compared with the carrier by the WCAG 2.x luminance ratio; a
// gradient carrier is measured at every stop. The 8-bit step reproduces every value of the approved evidence
// (governance/attachment/quiet-contrast-evidence.json: 88 of 88; ladder table: 18 of 18).
// A placement keeps the motif's shape only when every visible paint reaches 1.30:1 (the ladder's invisible band is
// ≤ 1.29). Values are rounded to two decimals, half up. Nothing here changes a colour: a failing pair is solved by the
// ladder (carrier → variant → size → removal), never on the asset.
//
// Library use: import { measureSvg, carriersFromTokens, resolveCarrier, buildCarrierPolicy } from "./measure-motif-carriers-0.9.4.mjs"
// CLI:        node measure-motif-carriers-0.9.4.mjs [--tokens tokens.v0.9.4.json] [--svg-dir ../build-kit/motif/svg]
//                  [--register motif-register.v0.9.4.json]   (compare with the stored policy; exit 1 on any difference)

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const TOOL_ID = "measure-motif-carriers-0.9.4.mjs";
export const KINDS = ["dial", "rings", "layers", "slice", "cultivate", "logo"];
export const VARIANTS = ["full", "quiet"];
export const BANDS = { meaningCapableMin: 3.0, decorativeOnlyMin: 1.3, invisibleMax: 1.29 };
export const SOLID_SURFACES = ["surface.canvas", "surface.alt", "surface.card", "surface.raised", "surface.soft", "surface.blueTint", "surface.beigeTint"];
export const ATMOSPHERES = ["ground.mist", "measure.luminous", "ground.current", "measure.deep"];
export const THEMED_ATMOSPHERES = { "surfaceAtmosphere.ground": "ground", "surfaceAtmosphere.measure": "measure" };
export const PLACEMENT = {
  full: { carrierClasses: ["light_plain"], ink: "blue", inkNote: "runtime renditions keep the governed light-reference ink: <lm-motif ink=\"blue\">" },
  quiet: { carrierClasses: ["deep_plain", "deep_atmosphere"], ink: "sky", inkNote: "runtime default quiet ink (energy.sky); no other ink value has a governed file" }
};

export const round2 = x => Math.round(x * 100 + 1e-9) / 100;
const rgb = hex => { let h = String(hex).trim().replace("#", ""); if (h.length === 3) h = [...h].map(c => c + c).join(""); if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`not a hex colour: ${hex}`); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = c => "#" + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
export const luminance = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const contrast = (a, b) => { const x = luminance(Array.isArray(a) ? a : rgb(a)); const y = luminance(Array.isArray(b) ? b : rgb(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
export const composite = (inkHex, alpha, bgHex) => { const i = rgb(inkHex); const g = Array.isArray(bgHex) ? bgHex : rgb(bgHex); return i.map((v, k) => alpha * v + (1 - alpha) * g[k]); };
export const pixel = channels => channels.map(v => Math.round(v)); // what the screen shows: 8-bit sRGB
export const compositeRatio = (inkHex, alpha, bgHex) => contrast(pixel(composite(inkHex, alpha, bgHex)), bgHex);
export const band = r => (r >= BANDS.meaningCapableMin ? "meaningCapable" : r >= BANDS.decorativeOnlyMin ? "decorativeOnly" : "invisible");

// Every visible paint of an SVG: presentation attributes inherited from <g>, element opacity multiplied down the tree.
export function paintsOf(svgText) {
  const paints = []; let hidden = 0; const stack = [{ opacity: 1 }];
  const re = /<(\/?)(svg|g|path|rect|circle|ellipse|line|polyline|polygon)\b([^>]*?)(\/?)>/g; let m;
  const attrs = s => Object.fromEntries([...s.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)].map(x => [x[1], x[2]]));
  while ((m = re.exec(svgText))) {
    const [, close, tag, rest, selfClose] = m;
    if (close) { if (tag === "g" || tag === "svg") stack.pop(); continue; }
    const a = attrs(rest); const parent = stack[stack.length - 1]; const inh = { ...parent };
    for (const k of ["fill", "stroke", "fill-opacity", "stroke-opacity", "stroke-width"]) if (a[k] !== undefined) inh[k] = a[k];
    inh.opacity = parent.opacity * (a.opacity !== undefined ? Number(a.opacity) : 1);
    if (tag === "g" || tag === "svg") { if (!selfClose) stack.push(inh); continue; }
    if (inh.opacity === 0) { hidden++; continue; }
    const fill = inh.fill ?? "#000000";
    if (fill !== "none") paints.push({ element: tag, paint: "fill", ink: fill.toUpperCase(), alpha: inh.opacity * Number(inh["fill-opacity"] ?? 1) });
    if (inh.stroke && inh.stroke !== "none") paints.push({ element: tag, paint: `stroke ${inh["stroke-width"] ?? 1}`, ink: inh.stroke.toUpperCase(), alpha: inh.opacity * Number(inh["stroke-opacity"] ?? 1) });
  }
  for (const p of paints) if (!/^#[0-9A-F]{6}$/.test(p.ink)) throw new Error(`unsupported paint ${p.ink} (static motif files carry hex paints only)`);
  return { paints, hidden };
}

// Measure one SVG against a solid hex or a list of gradient stops.
export function measureSvg(svgText, carrier) {
  const { paints, hidden } = paintsOf(svgText);
  const stops = Array.isArray(carrier) ? carrier : [carrier];
  const perStop = stops.map(stop => {
    const values = paints.map(p => ({ ink: p.ink, alpha: round2(p.alpha), ratio: round2(compositeRatio(p.ink, p.alpha, stop)) }));
    const weakest = Math.min(...values.map(v => v.ratio)); const strongest = Math.max(...values.map(v => v.ratio));
    return { stop: String(stop).toUpperCase(), weakest, strongest, invisible: values.filter(v => v.ratio < BANDS.decorativeOnlyMin) };
  });
  const worst = perStop.reduce((a, b) => (b.strongest < a.strongest ? b : a));
  const weakest = Math.min(...perStop.map(s => s.weakest));
  const invisible = [...new Map(perStop.flatMap(s => s.invisible.map(v => [`${v.ink}@${v.alpha}`, { ink: v.ink, alpha: v.alpha, ratio: v.ratio, stop: s.stop }]))).values()]
    .sort((a, b) => a.ratio - b.ratio || a.ink.localeCompare(b.ink));
  return { paints: paints.length, hiddenElements: hidden, weakest, strongest: worst.strongest, worstStop: stops.length > 1 ? worst.stop : null, verdict: band(worst.strongest), shapeIntact: invisible.length === 0, invisible };
}

// Carriers from tokens.v0.9.4.json: themed solids, invariant brand solids, atmosphere recipes and themed atmosphere aliases.
export function carriersFromTokens(tokens) {
  const carriers = {};
  const pair = id => { const v = tokens.foundation?.[id]; if (!v) throw new Error(`foundation ${id} missing`); return Array.isArray(v) ? { light: v[0], dark: v[1] } : { light: v.light, dark: v.dark }; };
  for (const id of SOLID_SURFACES) { const p = pair(id); carriers[id] = { type: "solid", themed: true, light: p.light.toUpperCase(), dark: p.dark.toUpperCase(), tokenRef: `tokens.v0.9.4.json#/foundation/${id}` }; }
  carriers["brand.beige"] = { type: "solid", themed: false, value: tokens.brand.beige.toUpperCase(), tokenRef: "tokens.v0.9.4.json#/brand/beige" };
  carriers["brand.blue"] = { type: "solid", themed: false, value: tokens.brand.blue.toUpperCase(), tokenRef: "tokens.v0.9.4.json#/brand/blue" };
  const stopsOf = recipeId => { const r = tokens.atmosphere?.recipes?.[recipeId]; if (!r) throw new Error(`atmosphere recipe ${recipeId} missing`); return [...r.matchAll(/#[0-9A-Fa-f]{6}/g)].map(x => x[0].toUpperCase()); };
  for (const a of ATMOSPHERES) carriers[`atmosphere.${a}`] = { type: "gradient", themed: false, stops: stopsOf(`atmosphere.gradient.${a}`), tokenRef: `tokens.v0.9.4.json#/atmosphere/recipes/atmosphere.gradient.${a}` };
  for (const [alias, stem] of Object.entries(THEMED_ATMOSPHERES)) {
    const light = tokens.atmosphere?.surfaceAliases?.[`${alias}.light`]; const dark = tokens.atmosphere?.surfaceAliases?.[`${alias}.dark`];
    if (!light || !dark) throw new Error(`surface alias ${alias} missing`);
    carriers[alias] = { type: "gradient", themed: true, light: light.replace("atmosphere.gradient.", "atmosphere."), dark: dark.replace("atmosphere.gradient.", "atmosphere."), tokenRef: `tokens.v0.9.4.json#/atmosphere/surfaceAliases (${stem})` };
  }
  return carriers;
}

// A declaration is a carrier id ("surface.card"), a theme-fixed form of a themed solid ("surface.card@light"),
// or an invariant id ("brand.blue", "atmosphere.ground.current"). Returns the concrete key measured for that theme.
export function resolveCarrier(carriers, declaration, theme) {
  const [id, fixed] = String(declaration ?? "").split("@");
  const c = carriers[id];
  if (!c) return { ok: false, error: `unknown carrier "${declaration}"` };
  if (fixed && !["light", "dark"].includes(fixed)) return { ok: false, error: `unknown theme suffix in "${declaration}"` };
  if (fixed && !c.themed) return { ok: false, error: `"${id}" does not change with the theme; declare it without @${fixed}` };
  if (!c.themed) return { ok: true, key: id, value: c.type === "solid" ? c.value : c.stops, type: c.type };
  const t = fixed ?? theme;
  if (c.type === "solid") return { ok: true, key: `${id}@${t}`, value: c[t], type: "solid" };
  const target = carriers[c[t]];
  return { ok: true, key: c[t], value: target.stops, type: "gradient" };
}

export function concreteCarriers(carriers) {
  const out = {};
  for (const [id, c] of Object.entries(carriers)) {
    if (c.type === "solid" && c.themed) { out[`${id}@light`] = { value: c.light, type: "solid", class: "light_plain" }; out[`${id}@dark`] = { value: c.dark, type: "solid", class: "deep_plain" }; }
    else if (c.type === "solid") out[id] = { value: c.value, type: "solid", class: luminance(rgb(c.value)) > 0.18 ? "light_plain" : "deep_plain" };
    else if (!c.themed) { const worst = Math.min(...c.stops.map(s => luminance(rgb(s)))); out[id] = { value: c.stops, type: "gradient", class: worst > 0.18 ? "light_atmosphere" : "deep_atmosphere" }; }
  }
  return out;
}

export function buildCarrierPolicy({ tokens, svgText }) {
  const carriers = carriersFromTokens(tokens);
  const concrete = concreteCarriers(carriers);
  const classes = {};
  for (const [key, c] of Object.entries(concrete)) (classes[c.class] ??= []).push(key);
  for (const k of Object.keys(classes)) classes[k].sort();
  const measured = []; const allowed = {};
  for (const kind of KINDS) {
    allowed[kind] = {};
    for (const variant of VARIANTS) {
      const svg = svgText(kind, variant);
      const ok = [];
      for (const [key, c] of Object.entries(concrete)) {
        const r = measureSvg(svg, c.value);
        const classAllowed = PLACEMENT[variant].carrierClasses.includes(c.class);
        const allowedHere = classAllowed && r.shapeIntact;
        measured.push({ kind, variant, carrier: key, carrierClass: c.class, ...r, allowed: allowedHere, reason: allowedHere ? null : !classAllowed ? `${variant} never sits on a ${c.class.replace("_", " ")} carrier` : `paint ${r.invisible[0].ink} at alpha ${r.invisible[0].alpha} measures ${r.invisible[0].ratio}:1${r.invisible[0].stop && c.type === "gradient" ? ` on stop ${r.invisible[0].stop}` : ""}` });
        if (allowedHere) ok.push(key);
      }
      allowed[kind][variant] = ok.sort();
    }
  }
  return { carriers, concrete, classes, measured, allowed };
}

// Parity with the owner-approved ladder table (quiet ink at full alpha and at the authored .56 alpha).
export function ladderParity(ladder) {
  const rows = [...(ladder?.quietCarriers?.light ?? []), ...(ladder?.quietCarriers?.deep ?? [])].filter(c => /^#[0-9A-Fa-f]{6}$/.test(c.hex));
  const ink = ladder?.quietInk?.hex ?? "#59D2FE";
  const checks = rows.map(c => { const r100 = round2(compositeRatio(ink, 1, c.hex)); const r56 = round2(compositeRatio(ink, 0.56, c.hex)); return { id: c.id, hex: c.hex.toUpperCase(), ladder: [c.quietInkRatio, c.atAuthoredAlpha56], measured: [r100, r56], equal: r100 === c.quietInkRatio && r56 === c.atAuthoredAlpha56 }; });
  return { ink, compared: checks.length, equal: checks.filter(c => c.equal).length, checks };
}

// Can a declaration carry this kind in this theme's variant? (used by preflight, MotifFrame mirror and the validator)
export function checkPlacement(policy, { kind, declaration, variantLight, variantDark, themes }) {
  const problems = [];
  for (const theme of themes) {
    const variant = theme === "dark" ? (variantDark ?? variantLight) : variantLight;
    const r = resolveCarrier(policy.carriers, declaration, theme);
    if (!r.ok) { problems.push(r.error); continue; }
    if (!(policy.allowed[kind]?.[variant] ?? []).includes(r.key)) {
      const row = policy.measured.find(m => m.kind === kind && m.variant === variant && m.carrier === r.key);
      problems.push(`${kind}-${variant} on ${r.key} (${theme} theme) is not allowed: ${row?.reason ?? "no measurement"}`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------- CLI
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const here = dirname(fileURLToPath(import.meta.url));
  const args = process.argv.slice(2); const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  const tokens = JSON.parse(readFileSync(opt("--tokens") ?? join(here, "tokens.v0.9.4.json"), "utf8"));
  const svgDir = opt("--svg-dir") ?? join(here, "../build-kit/motif/svg");
  const policy = buildCarrierPolicy({ tokens, svgText: (k, v) => readFileSync(join(svgDir, `${k}-${v}.svg`), "utf8") });
  const keys = Object.keys(policy.concrete);
  for (const kind of KINDS) for (const variant of VARIANTS) console.log(`${`${kind}-${variant}`.padEnd(16)} allowed: ${policy.allowed[kind][variant].join(", ") || "—"}`);
  if (opt("--register")) {
    const reg = JSON.parse(readFileSync(opt("--register"), "utf8"));
    const stored = reg.carrierPolicy;
    const diffs = [];
    if (!stored) diffs.push("register has no carrierPolicy");
    else {
      if (JSON.stringify(stored.allowed) !== JSON.stringify(policy.allowed)) diffs.push("allowed pairs differ");
      if (JSON.stringify(stored.carriers) !== JSON.stringify(policy.carriers)) diffs.push("carrier values differ from tokens");
      for (const m of policy.measured) { const s = stored.measured.find(x => x.kind === m.kind && x.variant === m.variant && x.carrier === m.carrier); if (!s || s.weakest !== m.weakest || s.strongest !== m.strongest || s.allowed !== m.allowed) diffs.push(`${m.kind}-${m.variant} × ${m.carrier}`); }
    }
    console.log(diffs.length ? `MISMATCH (${diffs.length}): ${diffs.slice(0, 12).join("; ")}` : `register carrierPolicy equals a fresh measurement (${policy.measured.length} pairs × ${keys.length} carriers)`);
    process.exit(diffs.length ? 1 : 0);
  }
}
