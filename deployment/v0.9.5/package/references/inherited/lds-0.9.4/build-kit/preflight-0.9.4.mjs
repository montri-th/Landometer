#!/usr/bin/env node
// Landometer Design System 0.9.4 candidate — runnable preflight for one HTML file.
// Usage: node preflight-0.9.4.mjs <page.html> [--json <payload.json>] [--tokens <tokens.v0.9.4.json>] [--production-css <color-srgb-07.production.css>]
//        [--register <motif-register.v0.9.4.json>] [--gates <validate-dataviz-gates-0.9.4.mjs>] [--evidence <contrast-evidence.json>]
//        [--carriers <measure-motif-carriers-0.9.4.mjs>] [--report <out.json>]
// Exit code 1 when any check fails. Checks are the ones listed in preflight-0.9.4.yml; nothing here approves an artifact.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const htmlPath = args.find(a => a.endsWith(".html") || a.endsWith(".htm"));
if (!htmlPath) { console.error("usage: node preflight-0.9.4.mjs <page.html> [--json payload.json] [--tokens tokens.v0.9.4.json] [--production-css color-srgb-07.production.css] [--register motif-register.v0.9.4.json] [--gates validate-dataviz-gates-0.9.4.mjs] [--evidence contrast-evidence.json] [--report out.json]"); process.exit(2); }
const html = readFileSync(htmlPath, "utf8");
// markup = the document without script and style bodies: element checks must not read source code, comments or CSS as markup
const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "<script></script>").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "<style></style>");
const first = (...c) => c.filter(Boolean).find(existsSync) ?? null;
const tokensPath = opt("--tokens") ?? first(join(here, "../machine/tokens.v0.9.4.json"), join(here, "tokens.v0.9.4.json"));
const cssPath = opt("--production-css") ?? first(join(here, "../machine/color-srgb-07.production.css"), join(here, "color-srgb-07.production.css"));
const registerPath = opt("--register") ?? first(join(here, "../machine/motif-register.v0.9.4.json"), join(here, "motif-register.v0.9.4.json"));
const gatesPath = opt("--gates") ?? first(join(here, "../machine/validate-dataviz-gates-0.9.4.mjs"), join(here, "validate-dataviz-gates-0.9.4.mjs"));
const evidencePath = opt("--evidence") ?? first(join(here, "../machine/contrast-evidence.json"), join(here, "contrast-evidence.json"));
const carriersPath = opt("--carriers") ?? first(join(here, "../machine/measure-motif-carriers-0.9.4.mjs"), join(here, "measure-motif-carriers-0.9.4.mjs"));
const tokens = tokensPath ? JSON.parse(readFileSync(tokensPath, "utf8")) : null;
const productionCss = cssPath ? readFileSync(cssPath, "utf8") : "";
const scalesPath = first(join(here, "../machine/color-srgb-07.scales.json"), join(here, "color-srgb-07.scales.json"), cssPath ? join(dirname(cssPath), "color-srgb-07.scales.json") : "");
const lutHex = scalesPath ? JSON.parse(readFileSync(scalesPath, "utf8")).scales.flatMap(r => r.lut) : [];
const register = registerPath ? JSON.parse(readFileSync(registerPath, "utf8")) : null;
const gates = gatesPath ? await import(pathToFileURL(gatesPath).href).catch(() => null) : null;
const carriersLib = carriersPath ? await import(pathToFileURL(carriersPath).href).catch(() => null) : null;
const sha = p => createHash("sha256").update(readFileSync(p)).digest("hex");
const results = [];
const add = (id, rule, severity, ok, detail) => results.push({ id, rule, severity, result: ok ? "pass" : severity, detail });

// ---------- colour math (shared with the registry) ----------
const hexToRgb = hex => { const n = Number.parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(x => x / 255); };
const lin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklab(hex) { const [r, g, b] = hexToRgb(hex).map(lin); const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b); const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b); const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b); return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; }
const dE = (a, b) => { const x = oklab(a); const y = oklab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100; };
const chroma = hex => { const [, a, b] = oklab(hex); return Math.hypot(a, b); };

// ---------- helpers ----------
const attrs = tag => Object.fromEntries([...tag.matchAll(/([a-zA-Z:-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].filter(m => m[1] !== "" && !/^</.test(m[1])).map(m => [m[1].toLowerCase(), m[3] ?? m[4] ?? m[5] ?? ""]));
const tagsOf = name => [...markup.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(m => ({ raw: m[0], a: attrs(m[0].replace(new RegExp(`^<${name}\\b`, "i"), "")), index: m.index }));
const links = tagsOf("link"); const metas = tagsOf("meta");
const metaContent = (key, value) => metas.filter(m => (m.a.property ?? m.a.name ?? "").toLowerCase() === value).map(m => m.a.content ?? "");
const localPath = ref => resolve(dirname(htmlPath), ref.replace(/^\//, ""));
const resolveRef = (ref, ...fallbacks) => first(localPath(ref), ...fallbacks);
const localCssFiles = links.filter(l => (l.a.rel ?? "").toLowerCase().includes("stylesheet") && l.a.href && !/^https?:/.test(l.a.href)).map(l => ({ href: l.a.href, path: resolveRef(l.a.href, join(here, l.a.href.split("/").slice(-2).join("/")), join(here, l.a.href.split("/").pop())) })).filter(x => x.path);
const localCss = localCssFiles.map(x => readFileSync(x.path, "utf8"));
const inlineCss = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join("\n") + "\n" + [...html.matchAll(/style\s*=\s*"([^"]*)"/gi)].map(m => m[1]).join("\n");
const STATES = ["measured_zero", "no_data", "out_of_scope", "suppressed", "not_yet"];
// element tree (minimal): open/close tags with ancestor chain for the attributes the checks need
const elements = [];
{
  const stack = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g; let m;
  const voids = new Set(["meta", "link", "img", "br", "hr", "input", "source", "wbr"]);
  while ((m = re.exec(markup))) {
    const closing = m[0].startsWith("</"); const name = m[1].toLowerCase();
    if (closing) { for (let i = stack.length - 1; i >= 0; i--) if (stack[i].name === name) { stack.splice(i); break; } continue; }
    const a = attrs(m[2]); const el = { name, a, index: m.index, raw: m[0], ancestors: stack.slice() };
    elements.push(el);
    if (!voids.has(name) && !m[0].endsWith("/>")) stack.push(el);
  }
}
const ancestorWith = (el, attr, values) => el.ancestors.find(x => attr in x.a && (!values || values.includes(x.a[attr])));

// ---------- PF-DATAVIZ-02-MID ----------
if (tokens) {
  const avoid = { ...Object.fromEntries(Object.entries(tokens.brand ?? {}).filter(([, v]) => typeof v === "string").map(([k, v]) => [`brand.${k}`, v])), ...Object.fromEntries(Object.entries((tokens.atmosphere?.energy ?? tokens.energy ?? {})).filter(([, v]) => typeof v === "string").map(([k, v]) => [`energy.${k}`, v])) };
  if (!Object.keys(avoid).some(k => k.startsWith("energy."))) for (const [k, v] of Object.entries({ sky: "#59D2FE", mint: "#0AD69C", coral: "#FF5A5F", yellow: "#FFBC1F" })) avoid[`energy.${k}`] = v;
  const exceptions = tokens.analyticalScalePolicy?.gateExceptions ?? [];
  const excepted = (family, gate) => exceptions.some(e => e.family === family && e.gate === gate);
  const bad = [];
  for (const [id, def] of Object.entries(tokens.analyticalScales ?? {})) {
    if (def.kind !== "sequential") continue;
    const mid = def.light[1];
    const near = Object.entries(avoid).map(([k, v]) => ({ k, d: dE(mid, v) })).sort((a, b) => a.d - b.d)[0];
    const c = chroma(mid);
    if (Object.values(avoid).map(x => x.toUpperCase()).includes(mid.toUpperCase())) bad.push(`${id}: mid equals ${near.k}`);
    else if (near.d < 5 && !excepted(id, "L-MID-02")) bad.push(`${id}: mid ΔE ${near.d.toFixed(1)} from ${near.k}`);
    if (c > 0.125 && !excepted(id, "L-MID-02")) bad.push(`${id}: mid chroma ${c.toFixed(4)} > .125`);
  }
  const registryMids = new Set(Object.values(tokens.analyticalScales ?? {}).flatMap(d => [d.light[1], d.dark[1]]).map(h => h.toUpperCase()));
  const overrides = [...inlineCss.matchAll(/--scale-([a-z-]+)-mid\s*:\s*(#[0-9A-Fa-f]{6})/g)].filter(m => !registryMids.has(m[2].toUpperCase()));
  for (const m of overrides) { const hex = m[2].toUpperCase(); const near = Object.entries(avoid).map(([k, v]) => ({ k, d: dE(hex, v) })).sort((a, b) => a.d - b.d)[0]; if (near.d < 5) bad.push(`page override --scale-${m[1]}-mid ${hex}: ΔE ${near.d.toFixed(1)} from ${near.k}`); if (chroma(hex) > 0.125) bad.push(`page override --scale-${m[1]}-mid ${hex}: chroma > .125`); }
  add("PF-DATAVIZ-02-MID", "DATAVIZ-02", "fail", bad.length === 0, bad.length ? `registry or page mids outside the gate: ${bad.join("; ")}` : "all sequential mids clear of brand/energy tokens (ΔE ≥ 5 or declared exception) and chroma ≤ .125");
} else add("PF-DATAVIZ-02-MID", "DATAVIZ-02", "fail", false, "tokens.v0.9.4.json not found; pass --tokens");

// ---------- PF-DATAVIZ-02-ZONE ----------
{
  const zones = tokens?.analyticalScalePolicy?.hueZones ?? { warm: ["activity", "density.area", "heat", "risk"], green: ["price", "age", "density.household", "growth", "confidence"], blue: ["count", "water", "density.capita", "built", "duration"] };
  const zoneOf = f => Object.entries(zones).find(([, list]) => list.includes(f === "density" ? "built" : f))?.[0] ?? null;
  const problems = [];
  for (const el of elements.filter(e => "data-surface" in e.a)) {
    const fams = (el.a["data-scale-family"] ?? "").split(",").map(s => s.trim()).filter(Boolean);
    const seen = {};
    for (const f of fams) { const z = zoneOf(f); if (!z) { problems.push(`surface ${el.a["data-surface"]}: unknown family ${f}`); continue; } if (seen[z] && seen[z] !== f) problems.push(`surface ${el.a["data-surface"]}: ${seen[z]} and ${f} are both ${z} zone`); seen[z] = f; }
  }
  add("PF-DATAVIZ-02-ZONE", "DATAVIZ-02", "fail", problems.length === 0, problems.length ? problems.join("; ") : "at most one sequential family per hue zone on every declared surface");
}

// ---------- PF-DATAVIZ-03-DARK ----------
{
  const problems = []; const notes = [];
  const allCss = inlineCss + "\n" + localCss.join("\n");
  // dark blocks: [data-theme="dark"] selectors and prefers-color-scheme: dark media blocks
  const darkBlocks = [...allCss.matchAll(/(?:\[data-theme="dark"\][^{]*|@media[^{]*prefers-color-scheme:\s*dark[^{]*)\{([\s\S]*?)\}\s*\}?/g)].map(m => m[1]);
  const darkDecl = darkBlocks.join("\n");
  if (tokens && darkDecl.trim()) {
    const slug = s => s.replace(/\./g, "-");
    const keysOf = def => (def.kind === "sequential" ? ["low", "mid", "high"] : ["neg", "zero", "pos"]);
    for (const [id, def] of Object.entries(tokens.analyticalScales ?? {})) {
      const derived = gates ? (def.kind === "sequential" ? gates.deriveSequentialDark(def.light) : gates.deriveDivergingDark(def.light)) : def.dark;
      keysOf(def).forEach((k, i) => {
        const re = new RegExp(`--scale-${slug(id)}-${k}\\s*:\\s*(#[0-9A-Fa-f]{6})`, "g");
        for (const m of darkDecl.matchAll(re)) { const hex = m[1].toUpperCase(); if (hex !== derived[i].toUpperCase() && hex !== def.dark[i].toUpperCase()) problems.push(`--scale-${slug(id)}-${k} dark ${hex} ≠ derivation ${derived[i]}`); }
      });
    }
    if (!gates) notes.push("derivation module not found (pass --gates); compared against the registry dark values only");
  } else if (!darkDecl.trim()) notes.push("no dark scale declarations resolvable locally");
  // kit ext CSS parity
  const ext = localCssFiles.find(x => /lds-0\.9\.4-ext\.css$/.test(x.href));
  const kitExt = join(here, "lds-0.9.4-ext.css");
  if (ext && existsSync(kitExt) && sha(ext.path) !== sha(kitExt)) problems.push(`lds-0.9.4-ext.css bytes differ from the kit file (${sha(ext.path).slice(0, 12)}… vs ${sha(kitExt).slice(0, 12)}…)`);
  add("PF-DATAVIZ-03-DARK", "DATAVIZ-03", "fail", problems.length === 0, problems.length ? problems.join("; ") : `dark scale anchors equal the DATAVIZ-03 derivation${ext ? "; ext CSS bytes match the kit" : ""}${notes.length ? " · " + notes.join("; ") : ""}`);
}

// ---------- PF-GATE-01-EVIDENCE ----------
{
  if (!evidencePath) add("PF-GATE-01-EVIDENCE", "GATE-01", "fail", false, "contrast-evidence.json not found; pass --evidence");
  else {
    const ev = JSON.parse(readFileSync(evidencePath, "utf8"));
    const problems = [];
    if (ev.result !== "PASS") problems.push(`result ${ev.result}`);
    if ((ev.summary?.undeclaredFailures ?? ev.undeclaredFailures ?? 1) !== 0) problems.push(`undeclared failures ${ev.summary?.undeclaredFailures ?? "unknown"}`);
    const subjects = ev.subjects ?? (ev.subject ? [ev.subject] : []);
    for (const s of subjects) {
      const p = first(join(dirname(evidencePath), s.ref), join(here, s.ref), join(here, "../machine", s.ref), join(here, "../build-kit", s.ref));
      if (!p) { problems.push(`subject ${s.ref} not resolvable`); continue; }
      if (sha(p) !== s.sha256) problems.push(`subject ${s.ref} bytes changed after the evidence was measured (${sha(p).slice(0, 12)}… ≠ ${String(s.sha256).slice(0, 12)}…)`);
    }
    add("PF-GATE-01-EVIDENCE", "GATE-01", "fail", problems.length === 0, problems.length ? problems.join("; ") : `contrast-evidence.json PASS, 0 undeclared failures, ${subjects.length} subject hash(es) current (measured ${ev.measuredAt ?? "?"})`);
  }
}

// ---------- PF-DATAVIZ-04-HUE (retired hue windows over every --scale-*/--series-* value of the page, both themes) ----------
{
  const allCss = inlineCss + "\n" + localCss.join("\n");
  const darkBlocks = [...allCss.matchAll(/(?:\[data-theme="dark"\][^{]*|@media[^{]*prefers-color-scheme:\s*dark[^{]*)\{([\s\S]*?)\}\s*\}?/g)].map(m => m[1]).join("\n");
  const decls = text => [...text.matchAll(/(--(?:scale|series)-[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})/g)].map(m => ({ name: m[1], hex: m[2].toUpperCase() }));
  const darkDecls = decls(darkBlocks);
  const darkKeys = new Set(darkDecls.map(d => `${d.name}:${d.hex}`));
  const lightDecls = decls(allCss).filter(d => !darkKeys.has(`${d.name}:${d.hex}`));
  if (!gates?.hueVerdict) add("PF-DATAVIZ-04-HUE", "DATAVIZ-04", "fail", false, "hue-window module not found (pass --gates validate-dataviz-gates-0.9.4.mjs)");
  else {
    const fails = []; const warns = []; let audited = 0; const seen = new Set();
    for (const [theme, list] of [["light", lightDecls], ["dark", darkDecls]]) for (const d of list) {
      const key = `${theme}:${d.name}:${d.hex}`; if (seen.has(key)) continue; seen.add(key); audited++;
      const v = gates.hueVerdict(d.hex, theme);
      for (const f of v.findings) (f.severity === "fail" ? fails : warns).push(`${d.name} ${d.hex} (${theme}): ${f.gate} ${f.window}`);
    }
    add("PF-DATAVIZ-04-HUE", "DATAVIZ-04", "fail", fails.length === 0, fails.length ? `values inside a retired hue window: ${[...new Set(fails)].join("; ")}` : `${audited} scale/series value(s) outside the retired earth/violet windows, clear of the purged earth/taupe values and of the retired exact values${warns.length ? " · clay-band warnings: " + [...new Set(warns)].join("; ") : ""}`);
  }
}

// ---------- PF-DATAVIZ-05-VIVID-ENERGY + V5 ----------
{
  const warnings = [];
  const surfaces = [...markup.matchAll(/<section\b[^>]*data-surface="([^"]*)"[^>]*>[\s\S]*?<\/section>/gi)];
  for (const s of surfaces) { const block = s[0]; if (/data-series\s*=\s*"vivid"/i.test(block) && /(--energy-|\benergy-|#59D2FE|#0AD69C|#FF5A5F|#FFBC1F|--ldm-energy-)/i.test(block)) warnings.push(`surface ${s[1]}: vivid series shares the surface with an energy accent`); if (/data-series\s*=\s*"(vivid|soft)"/i.test(block) && /(--energy-sky|--ldm-energy-sky|#59D2FE)/i.test(block) && /--series-6-|series-06/i.test(block)) warnings.push(`surface ${s[1]}: sky slot next to energy.sky`); }
  add("PF-DATAVIZ-05-VIVID-ENERGY", "DATAVIZ-05", "warn", warnings.length === 0, warnings.length ? warnings.join("; ") : "no vivid series beside an energy accent");
  const v5 = [...(html + localCss.join("\n")).matchAll(/var\(\s*--ldm-series-(0[1-9]|10)-(light|dark)\s*\)/g)].map(m => m[0]);
  add("PF-DATAVIZ-05-V5", "DATAVIZ-05", "warn", v5.length === 0, v5.length ? `deprecated v5 names: ${[...new Set(v5)].join(", ")}` : "no deprecated series-10-v5 names");
}

// ---------- PF-FAVICON-01 ----------
{
  const icon = size => links.some(l => /\bicon\b/i.test(l.a.rel ?? "") && !/apple/i.test(l.a.rel ?? "") && (l.a.sizes ?? "") === `${size}x${size}`);
  const apple = links.some(l => /apple-touch-icon/i.test(l.a.rel ?? "") && (l.a.sizes ?? "") === "180x180");
  const manifest = links.some(l => /\bmanifest\b/i.test(l.a.rel ?? ""));
  const themeLight = metas.some(m => (m.a.name ?? "") === "theme-color" && /light/.test(m.a.media ?? ""));
  const themeDark = metas.some(m => (m.a.name ?? "") === "theme-color" && /dark/.test(m.a.media ?? ""));
  const motifIcon = links.some(l => /\bicon\b/i.test(l.a.rel ?? "") && /(dial|rings|layers|slice|cultivate|logo)-(full|quiet)\.svg|\/motif\//i.test(l.a.href ?? ""));
  const missing = [[16, icon(16)], [32, icon(32)], [48, icon(48)], ["180 apple-touch", apple], ["manifest", manifest], ["theme-color light", themeLight], ["theme-color dark", themeDark]].filter(([, ok]) => !ok).map(([k]) => k);
  if (motifIcon) missing.push("a motif SVG is used as an icon (MOTIF-01 prohibited job favicon)");
  add("PF-FAVICON-01-SET", "FAVICON-01", "fail", missing.length === 0, missing.length ? `missing or wrong: ${missing.join(", ")} (192/512 are declared by the manifest)` : "icon set 16/32/48/180 + manifest + theme-color light/dark present; no motif as icon");
  const title = (markup.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const okTitle = /^[^·]+ · [^·]+$/.test(title) && [...title].length <= 60;
  add("PF-FAVICON-01-TITLE", "FAVICON-01", "fail", okTitle, okTitle ? `title "${title}" (${[...title].length} chars)` : `title "${title}" must be "[page] · [product]" with one middle dot and ≤ 60 characters`);
}

// ---------- PF-SOCIALFMT-01-OG ----------
{
  const t = metaContent("property", "og:title")[0]; const d = metaContent("property", "og:description")[0]; const u = metaContent("property", "og:url")[0]; const img = metaContent("property", "og:image")[0];
  const w = metaContent("property", "og:image:width")[0]; const h = metaContent("property", "og:image:height")[0]; const alt = metaContent("property", "og:image:alt")[0];
  const problems = [];
  if (!t) problems.push("og:title missing"); else { if ([...t].length > 60) problems.push(`og:title ${[...t].length} > 60`); if (!t.includes(" · ")) problems.push("og:title lacks the · [product] segment"); }
  if (!d) problems.push("og:description missing"); else if ([...d].length > 155) problems.push(`og:description ${[...d].length} > 155`);
  if (!u) problems.push("og:url missing"); if (!img) problems.push("og:image missing"); if (w !== "1200" || h !== "630") problems.push("og:image:width/height must be 1200/630"); if (!alt) problems.push("og:image:alt missing");
  if (img && /(dial|rings|layers|slice|cultivate|logo)-(full|quiet)\.svg|\/motif\//i.test(img)) problems.push("og:image points at a motif asset (static final state creative required)");
  const copy = `${t ?? ""} ${d ?? ""}`;
  if (/!/.test(copy)) problems.push("exclamation mark in og copy"); if (/click now|กดเลย|คลิกเลย/i.test(copy)) problems.push("click-now wording in og copy"); if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(copy)) problems.push("emoji in og copy");
  add("PF-SOCIALFMT-01-OG", "SOCIALFMT-01", "fail", problems.length === 0, problems.length ? problems.join("; ") : "og:title/description/url/image 1200×630/alt present and within template limits");
}

// ---------- PF-MOTION-01-INFINITE ----------
{
  const all = inlineCss + "\n" + localCss.join("\n");
  const hits = [...all.matchAll(/animation-iteration-count\s*:\s*infinite|animation\s*:[^;]*\binfinite\b/gi)].map(m => m[0].slice(0, 60));
  add("PF-MOTION-01-INFINITE", "MOTION-01 / MOTIF-03", "fail", hits.length === 0, hits.length ? `infinite iteration found: ${hits.join(" | ")}` : "no infinite animation iteration");
}

// ---------- motif checks ----------
const KINDS = register?.sharedFamily?.kinds ?? { dial: { beat: "opening", allowedJobs: ["orientation", "opening"] }, rings: { beat: "transition", allowedJobs: ["spatial_transition", "section_orientation"] }, layers: { beat: "transition", allowedJobs: ["layering", "quiet_divider"] }, slice: { beat: "closing", allowedJobs: ["action_closure"] }, cultivate: { beat: "closing", allowedJobs: ["cultural_closure", "handoff"] }, logo: { beat: "opening", allowedJobs: ["animated_brand_opening"] } };
const PROHIBITED = register?.jobRegistry?.prohibitedJobs ?? register?.sharedFamily?.kinds?.dial?.prohibitedJobs ?? ["data_encoding", "evidence", "measured_state", "loading_state", "official_navigation_identity", "favicon", "co_brand_lockup"];
const frames = elements.filter(e => /(^|\s)lds-motif-frame(\s|$)/.test(e.a.class ?? ""));
const motifs = elements.filter(e => e.name === "lm-motif");
const frameOf = el => el.ancestors.find(x => /(^|\s)lds-motif-frame(\s|$)/.test(x.a.class ?? ""));
const motifInFrame = fr => motifs.find(m => frameOf(m) === fr);
const hasMotion = frames.length > 0 || motifs.length > 0;

// ---------- PF-MOTIF-01-JOB ----------
{
  const problems = [];
  for (const fr of frames) {
    const kind = fr.a["data-kind"]; const def = KINDS[kind];
    const label = `frame ${kind ?? "?"}/${fr.a["data-job"] ?? "?"}`;
    if (!def) { problems.push(`${label}: unknown kind`); continue; }
    const job = fr.a["data-job"];
    if (!job) problems.push(`${label}: data-job missing`);
    else if (PROHIBITED.includes(job)) problems.push(`${label}: prohibited job`);
    else if (!(def.allowedJobs ?? []).includes(job)) problems.push(`${label}: job outside allowedJobs of ${kind} (${(def.allowedJobs ?? []).join(", ")})`);
    if (fr.a["data-beat"] !== def.beat) problems.push(`${label}: data-beat ${fr.a["data-beat"] ?? "missing"} ≠ ${def.beat}`);
    if (!["full", "quiet", undefined].includes(fr.a["data-variant"])) problems.push(`${label}: data-variant must be full|quiet`);
    const m = motifInFrame(fr);
    if (m && m.a.kind !== kind) problems.push(`${label}: <lm-motif kind="${m.a.kind}"> differs from the frame`);
  }
  add("PF-MOTIF-01-JOB", "MOTIF-01", "fail", problems.length === 0, hasMotion ? (problems.length ? problems.join("; ") : `${frames.length} frame(s) carry a registered kind, an allowed job and the matching beat`) : "no motifs on this page");
}

// ---------- PF-MOTIF-02-BYTES ----------
// Theme-swap fallbacks live in .lds-motif-noscript wrappers (data-theme-variant="light|dark"), which follow data-theme and the OS
// preference exactly as MotifFrame and the kit CSS do; <picture><source media> follows only the OS preference and is not admitted.
const wrapperSegments = text => { const marks = [...text.matchAll(/data-theme-variant\s*=\s*"(light|dark)"/g)]; return marks.map((m, i) => ({ theme: m[1], text: text.slice(m.index, i + 1 < marks.length ? marks[i + 1].index : text.length) })); };
{
  const problems = [];
  if (hasMotion) {
    for (const m of motifs) if (!frameOf(m)) problems.push("<lm-motif> outside a MotifFrame");
    for (const m of motifs) if ((m.a.autoplay ?? "") !== "false") problems.push("lm-motif without autoplay=\"false\" (the frame owns replay)");
    if (!/motif-frame\.js/.test(html) && !/LandometerMotifFrame/.test(html)) problems.push("motif-frame.js not loaded");
    if (!/motion-controller\.js/.test(html) && !/LandometerMotion\b/.test(html)) problems.push("motion-controller.js not loaded");
    const pauseCount = elements.filter(e => /(^|\s)lds-motion-pause(\s|$)/.test(e.a.class ?? "")).length;
    if (pauseCount !== 1) problems.push(`${pauseCount} .lds-motion-pause control(s); exactly one is required`);
    const kitSha = file => { const p = first(join(here, "motif", "svg", file)); return p ? createHash("sha256").update(readFileSync(p, "utf8").trim()).digest("hex") : null; };
    for (const fr of frames) {
      const kind = fr.a["data-kind"]; const variant = fr.a["data-variant"] ?? "full"; const dark = fr.a["data-variant-dark"] ?? null;
      const variants = dark ? [variant, dark] : [variant];
      const end = markup.indexOf("</noscript>", fr.index);
      const block = markup.slice(fr.index, end > 0 ? end + 11 : fr.index + 4000);
      const ns = block.match(/<noscript>([\s\S]*?)<\/noscript>/i);
      if (!ns) { problems.push(`frame ${kind}: no <noscript> final-state SVG`); continue; }
      const refs = [...ns[1].matchAll(/\s(?:src|srcset)="([^"]+)"/g)].map(m => m[1].split("/").pop());
      const inline = [...ns[1].matchAll(/<svg\b[\s\S]*?<\/svg>/gi)].map(m => createHash("sha256").update(m[0].trim()).digest("hex"));
      if (refs.length) {
        for (const v of variants) if (!refs.includes(`${kind}-${v}.svg`)) problems.push(`frame ${kind}/${v}: noscript fallback lacks ${kind}-${v}.svg`);
        for (const r of refs) if (!variants.some(v => r === `${kind}-${v}.svg`)) problems.push(`frame ${kind}: noscript fallback ${r} is not ${variants.map(v => `${kind}-${v}.svg`).join(" or ")}`);
        if (dark) {
          const segs = wrapperSegments(ns[1]);
          const refsIn = th => segs.filter(x => x.theme === th).flatMap(x => [...x.text.matchAll(/\s(?:src|srcset)="([^"]+)"/g)].map(m => m[1].split("/").pop()));
          const sourceForm = new RegExp(`<source\\b[^>]*media="\\(prefers-color-scheme:\\s*dark\\)"[^>]*srcset="[^"]*${kind}-${dark}\\.svg"|<source\\b[^>]*srcset="[^"]*${kind}-${dark}\\.svg"[^>]*media="\\(prefers-color-scheme:\\s*dark\\)"`).test(ns[1]);
          if (sourceForm || /<picture\b/i.test(ns[1])) problems.push(`frame ${kind}: <picture>/<source media="(prefers-color-scheme: dark)"> follows only the OS preference, not the page's data-theme choice; put the two final states in .lds-motif-noscript wrappers with data-theme-variant="light|dark"`);
          else if (!segs.some(x => x.theme === "light") || !segs.some(x => x.theme === "dark")) problems.push(`frame ${kind}: theme-swap fallbacks need .lds-motif-noscript wrappers with data-theme-variant="light" (${kind}-${variant}.svg) and "dark" (${kind}-${dark}.svg)`);
          else {
            if (!(refsIn("light").length && refsIn("light").every(r => r === `${kind}-${variant}.svg`))) problems.push(`frame ${kind}: the data-theme-variant="light" wrapper must hold ${kind}-${variant}.svg only`);
            if (!(refsIn("dark").length && refsIn("dark").every(r => r === `${kind}-${dark}.svg`))) problems.push(`frame ${kind}: the data-theme-variant="dark" wrapper must hold ${kind}-${dark}.svg only`);
          }
        }
      } else if (inline.length) {
        for (const v of variants) { const k = kitSha(`${kind}-${v}.svg`); if (!k) problems.push(`frame ${kind}/${v}: inline noscript SVG cannot be compared (kit SVG not found)`); else if (!inline.includes(k)) problems.push(`frame ${kind}/${v}: no inline noscript SVG equals ${kind}-${v}.svg`); }
        const allowedShas = variants.map(v => kitSha(`${kind}-${v}.svg`)).filter(Boolean);
        if (inline.some(h => !allowedShas.includes(h))) problems.push(`frame ${kind}: an inline noscript SVG differs from the governed ${variants.map(v => `${kind}-${v}.svg`).join(" / ")}`);
        if (dark) {
          const segs = wrapperSegments(ns[1]);
          if (!segs.some(x => x.theme === "dark") || !segs.some(x => x.theme === "light")) problems.push(`frame ${kind}: inline theme-swap fallbacks need .lds-motif-noscript wrappers with data-theme-variant="light|dark"`);
          else {
            const shasIn = th => segs.filter(x => x.theme === th).flatMap(x => [...x.text.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)].map(m => createHash("sha256").update(m[0].trim()).digest("hex")));
            const kl = kitSha(`${kind}-${variant}.svg`); const kd = kitSha(`${kind}-${dark}.svg`);
            if (!(shasIn("light").length && shasIn("light").every(h => h === kl))) problems.push(`frame ${kind}: the data-theme-variant="light" wrapper must hold ${kind}-${variant}.svg only`);
            if (!(shasIn("dark").length && shasIn("dark").every(h => h === kd))) problems.push(`frame ${kind}: the data-theme-variant="dark" wrapper must hold ${kind}-${dark}.svg only`);
          }
        }
      } else problems.push(`frame ${kind}/${variant}: noscript carries neither an <img src> nor an inline <svg>`);
    }
    // byte parity for locally resolvable runtime and SVG files
    const expected = {};
    if (register) { for (const r of register.sharedFamily.runtime) expected[r.path.split("/").pop()] = r.sha256; for (const def of Object.values(register.sharedFamily.kinds)) for (const v of Object.values(def.variants)) expected[v.path.split("/").pop()] = v.sha256; }
    else Object.assign(expected, { "landometer-motifs.js": "3a5caef7918a85885b61dd53e049ea8bf2b0a3cea508f587bb14970bfe6deaf2", "landometer-motifs.css": "7cc2deb475a8d6e4af331407b2b4b741716c458a8ce885e2fb2859374b93912e" });
    for (const [file, expectedSha] of Object.entries(expected)) {
      const ref = [...html.matchAll(new RegExp(`(?:src|href)="([^"]*${file.replace(".", "\\.")})"`, "g"))][0]?.[1];
      if (!ref) continue;
      const p = first(localPath(ref), join(here, "motif", file), join(here, "motif", "svg", file));
      if (!p) { problems.push(`${file} referenced but not resolvable locally; verify the deployed bytes`); continue; }
      const actual = sha(p);
      if (actual !== expectedSha) problems.push(`${file} hash ${actual.slice(0, 12)}… ≠ governed ${expectedSha.slice(0, 12)}…`);
    }
    for (const file of ["motif-frame.js", "motion-controller.js"]) { const ref = [...html.matchAll(new RegExp(`src="([^"]*${file.replace(".", "\\.")})"`, "g"))][0]?.[1]; if (!ref) continue; const p = first(localPath(ref), join(here, "motif", file)); const kitFile = join(here, "motif", file); if (p && existsSync(kitFile) && sha(p) !== sha(kitFile)) problems.push(`${file} bytes differ from the kit file`); }
  }
  add("PF-MOTIF-02-BYTES", "MOTIF-02 / MOTION-04", "fail", problems.length === 0, hasMotion ? (problems.length ? problems.join("; ") : "every motif is framed, autoplay off, noscript fallback of the same kind/variant (both for a theme swap), controller + frame loaded, one pause control, resolvable bytes governed") : "no motifs on this page");
}

// ---------- PF-MOTIF-03-REPLAY ----------
{
  const problems = [];
  for (const m of motifs) { if ("loop" in m.a) problems.push("lm-motif with loop"); if (["enter", "hover"].includes(m.a.replay ?? "")) problems.push(`lm-motif with replay="${m.a.replay}"`); }
  for (const fr of frames) { const ms = parseInt(fr.a["data-cycle-ms"] ?? "", 10); if (fr.a["data-cycle-ms"] && (!ms || ms < 2000)) problems.push(`frame ${fr.a["data-kind"]}: data-cycle-ms ${fr.a["data-cycle-ms"]} < 2000`); }
  add("PF-MOTIF-03-REPLAY", "MOTIF-03", "fail", problems.length === 0, hasMotion ? (problems.length ? [...new Set(problems)].join("; ") : "no loop/replay attributes; every cycle ≥ 2000 ms") : "no motifs on this page");
}

// ---------- PF-MOTIF-04-BUDGET ----------
{
  const problems = [];
  if (hasMotion) {
    if (frames.length > 3) problems.push(`${frames.length} motion moments on one route (max 3)`);
    const perSurface = {};
    for (const fr of frames) { const s = ancestorWith(fr, "data-task-surface"); if (s) { const k = s.a["data-task-surface"]; perSurface[k] = (perSurface[k] ?? 0) + 1; } }
    for (const [k, n] of Object.entries(perSurface)) if (n > 1) problems.push(`${n} motifs on task surface "${k}" (max 1)`);
    for (const fr of frames) { const r = ancestorWith(fr, "data-region", ["first_answer", "primary_proof", "primary_action"]); if (r) problems.push(`frame ${fr.a["data-kind"]} inside the forbidden region ${r.a["data-region"]}`); }
    const declared = ["first_answer", "primary_proof", "primary_action"].filter(v => elements.some(e => e.a["data-region"] === v));
    const undeclared = ["first_answer", "primary_proof", "primary_action"].filter(v => !declared.includes(v));
    if (undeclared.length) problems.push(`regions not declared with data-region: ${undeclared.join(", ")} (declare them so the placement check is real)`);
  }
  add("PF-MOTIF-04-BUDGET", "MOTIF-04", "fail", problems.length === 0, hasMotion ? (problems.length ? problems.join("; ") : `${frames.length} moment(s) ≤ 3, one per task surface, outside the declared forbidden regions`) : "no motifs on this page");
}

// ---------- PF-MOTIF-05-OVERLAY ----------
{
  const problems = [];
  const overlays = elements.filter(e => "data-product-overlay" in e.a);
  for (const ov of overlays) {
    const id = ov.a["data-product-overlay"];
    const reg = register?.productOverlays?.find(o => o.id === id);
    if (!reg) problems.push(`overlay "${id}" is not in motif-register.v0.9.4.json`);
    else if (reg.approval?.status !== "owner_approved") problems.push(`overlay "${id}" status ${reg.approval?.status ?? "unknown"} — only owner_approved overlays with registered bytes may ship`);
    else if (!(reg.assets ?? []).length) problems.push(`overlay "${id}" has no registered bytes`);
    if (frames.some(fr => fr.ancestors.includes(ov))) problems.push(`overlay "${id}" contains a shared MotifFrame (mixed lockup)`);
  }
  for (const fr of frames) if (ancestorWith(fr, "data-product-overlay")) problems.push(`frame ${fr.a["data-kind"]} nested in a product overlay`);
  add("PF-MOTIF-05-OVERLAY", "MOTIF-05", "fail", problems.length === 0, overlays.length ? (problems.length ? [...new Set(problems)].join("; ") : `${overlays.length} overlay(s) registered, owner-approved, unmixed`) : "no product overlays on this page");
}

// ---------- PF-MOTIF-06-CARRIER ----------
{
  const problems = [];
  const policy = register?.carrierPolicy ?? null;
  const statics = elements.filter(e => "data-motif-static" in e.a);
  const placements = [
    ...frames.map(fr => ({ el: fr, kind: fr.a["data-kind"], light: fr.a["data-variant"] ?? "full", dark: fr.a["data-variant-dark"] ?? null, label: `frame ${fr.a["data-kind"] ?? "?"}`, isStatic: false })),
    ...statics.map(e => { const [kind, variant] = String(e.a["data-motif-static"] ?? "").split("-"); return { el: e, kind, light: variant, dark: null, label: `static ${e.a["data-motif-static"]}`, isStatic: true }; })
  ];
  // motif bytes placed without a declaration: inline SVGs equal to a governed final state, or <img> pointing at one (fallbacks inside a frame's noscript excluded)
  {
    const governed = {};
    if (register) for (const [kind, def] of Object.entries(register.sharedFamily.kinds)) for (const [variant, rec] of Object.entries(def.variants)) { const p = first(join(here, "motif", "svg", `${kind}-${variant}.svg`)); if (p) governed[createHash("sha256").update(readFileSync(p, "utf8").trim()).digest("hex")] = `${kind}-${variant}`; }
    const inNoscript = e => e.ancestors.some(x => x.name === "noscript");
    const declaredStatic = (e, id) => [e, ...e.ancestors].some(x => x.a["data-motif-static"] === id && "data-host-surface" in x.a) || e.ancestors.some(x => /(^|\s)lds-motif-frame(\s|$)/.test(x.a.class ?? ""));
    for (const e of elements.filter(x => x.name === "svg" && !inNoscript(x))) {
      const end = markup.indexOf("</svg>", e.index); if (end < 0) continue;
      const id = governed[createHash("sha256").update(markup.slice(e.index, end + 6).trim()).digest("hex")];
      if (id && !declaredStatic(e, id)) problems.push(`inline ${id}.svg placed without data-motif-static="${id}" and data-host-surface on it or an ancestor`);
    }
    for (const e of elements.filter(x => x.name === "img" && !inNoscript(x))) {
      const m = String(e.a.src ?? "").match(/(dial|rings|layers|slice|cultivate|logo)-(full|quiet)\.svg$/);
      if (m && !declaredStatic(e, `${m[1]}-${m[2]}`)) problems.push(`<img> ${m[0]} placed without data-motif-static="${m[1]}-${m[2]}" and data-host-surface on it or an ancestor`);
    }
  }
  const scheme = (metas.find(m => (m.a.name ?? "").toLowerCase() === "color-scheme")?.a.content ?? "").toLowerCase();
  const themes = ["light", "dark"].filter(t => new RegExp(`\\b${t}\\b`).test(scheme));
  const rendered = themes.length ? themes : ["light", "dark"];
  // governed variables → hex (production CSS) for inline paint checks
  const varHex = Object.fromEntries([...productionCss.matchAll(/(--ldm-[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})/g)].map(m => [m[1], m[2].toUpperCase()]));
  const kitVarToCarrier = { "--brand-beige": "brand.beige", "--brand-blue": "brand.blue", "--surface-canvas": "surface.canvas", "--surface-card": "surface.card", "--surface-alt": "surface.alt", "--surface-soft": "surface.soft", "--surface-raised": "surface.raised" };
  if (placements.length) {
    if (!policy || !carriersLib) problems.push("motif-register.v0.9.4.json (carrierPolicy) or measure-motif-carriers-0.9.4.mjs not found; pass --register and --carriers");
    else for (const p of placements) {
      const decl = p.el.a["data-host-surface"];
      if (!decl) { problems.push(`${p.label}: data-host-surface missing (MOTIF-06 needs the ground the motif sits on)`); continue; }
      if (!KINDS[p.kind] || !["full", "quiet"].includes(p.light)) { problems.push(`${p.label}: kind or variant is not registered`); continue; }
      if (p.dark !== null && !(p.dark === "quiet" && p.light === "full")) { problems.push(`${p.label}: data-variant-dark is admitted only as "quiet" on a full frame`); continue; }
      if (p.dark !== null && rendered.length === 1) { problems.push(`${p.label}: data-variant-dark on a page that renders only the ${rendered[0]} theme (<meta name="color-scheme">) — without JavaScript the swap would still follow the OS preference; remove it`); continue; }
      for (const x of carriersLib.checkPlacement(policy, { kind: p.kind, declaration: decl, variantLight: p.light, variantDark: p.dark ?? undefined, themes: rendered })) problems.push(`${p.label}: ${x}`);
      if (!p.isStatic) {
        const m = motifInFrame(p.el); const ink = m?.a.ink ?? null;
        const rendersFull = rendered.some(t => (t === "dark" && p.dark ? p.dark : p.light) === "full");
        if (rendersFull && ink !== "blue") problems.push(`${p.label}: a full frame needs ink="blue" on <lm-motif> (found ${ink === null ? "none" : `"${ink}"`}) — without it the runtime paints Brand Beige in the dark theme`);
        if (!rendersFull && ink !== null && ink !== "sky") problems.push(`${p.label}: a quiet frame renders with the default sky ink only (found "${ink}")`);
      }
      // an inline ground that contradicts the declaration
      const bg = (p.el.a.style ?? "").match(/background(?:-color)?\s*:\s*([^;]+)/i)?.[1]?.trim();
      if (bg) {
        const hexLit = bg.match(/^#[0-9A-Fa-f]{6}$/)?.[0]?.toUpperCase();
        const v = bg.match(/^var\((--[a-z0-9-]+)(?:\s*,\s*(#[0-9A-Fa-f]{6}))?\)$/);
        for (const t of rendered) {
          const r = carriersLib.resolveCarrier(policy.carriers, decl, t);
          if (!r.ok || r.type !== "solid") continue;
          const want = String(r.value).toUpperCase();
          if (hexLit && hexLit !== want) problems.push(`${p.label}: inline background ${hexLit} ≠ declared ${r.key} ${want} (${t} theme)`);
          if (v && varHex[v[1]] && varHex[v[1]] !== want) problems.push(`${p.label}: inline background ${v[1]} (${varHex[v[1]]}) ≠ declared ${r.key} ${want} (${t} theme)`);
          if (v && kitVarToCarrier[v[1]] && kitVarToCarrier[v[1]] !== decl.split("@")[0]) problems.push(`${p.label}: inline background ${v[1]} paints ${kitVarToCarrier[v[1]]}, but the declaration is ${decl}`);
        }
      }
    }
  }
  add("PF-MOTIF-06-CARRIER", "MOTIF-06", "fail", problems.length === 0, placements.length || problems.length ? (problems.length ? [...new Set(problems)].join("; ") : `${placements.length} placement(s) (${frames.length} frame(s), ${statics.length} static) on measured carriers in the ${rendered.join(" and ")} theme${rendered.length > 1 ? "s" : ""}; rendered grounds are checked in the browser (MOTIF-06-B)`) : "no motif placements on this page");
}

// ---------- PF-EVID-05-STATE ----------
{
  const problems = [];
  for (const m of markup.matchAll(/<figure\b[^>]*class="[^"]*\blds-evidence-card\b[^"]*"[^>]*>/gi)) if (!/data-state\s*=\s*"(measured_zero|no_data|out_of_scope|suppressed|not_yet)"/.test(m[0])) problems.push("EvidenceCard without a valid data-state");
  for (const m of markup.matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td>/gi)) {
    const a = attrs(m[1]); const text = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (/^n\/?a$/i.test(text)) problems.push(`N/A in a value cell`);
    const numeric = /\bnum\b/.test(a.class ?? "");
    if ((/^(0|—|-|–)$/.test(text) || (text === "" && numeric)) && !a["data-state"]) problems.push(`cell "${text || "blank"}" without data-state`);
    if (a["data-state"] && !STATES.includes(a["data-state"])) problems.push(`unknown data-state ${a["data-state"]}`);
  }
  add("PF-EVID-05-STATE", "EVID-05", "fail", problems.length === 0, problems.length ? [...new Set(problems)].join("; ") : "every EvidenceCard and every 0/blank/dash cell carries a state; no N/A");
}

// ---------- PF-EVID-05-LABEL ----------
{
  const problems = [];
  const css = inlineCss + "\n" + localCss.join("\n");
  // a rule whose selector targets a no_data container (not its glyph/swatch) and paints a hatch → the label inside would sit on the hatch
  for (const m of css.matchAll(/([^{}]+)\{([^}]*repeating-linear-gradient[^}]*)\}/g)) {
    const selector = m[1].trim();
    if (/no_data/.test(selector) && !/lds-cell-glyph|lds-legend-swatch|lds-map-unit|lds-state--no_data|::before|::after/.test(selector)) problems.push(`hatch painted on "${selector.slice(0, 60)}" which also holds the state label`);
  }
  for (const m of markup.matchAll(/<[a-z]+\b[^>]*class="[^"]*\blds-state-label\b[^"]*"[^>]*style="[^"]*repeating-linear-gradient[^"]*"/gi)) problems.push("inline hatch on a .lds-state-label");
  add("PF-EVID-05-LABEL", "EVID-05", "fail", problems.length === 0, problems.length ? [...new Set(problems)].join("; ") : "no no_data label sits on a hatch fill");
}

// ---------- PF-EVID-05-PAYLOAD ----------
if (opt("--json")) {
  const payload = JSON.parse(readFileSync(opt("--json"), "utf8"));
  const problems = [];
  const walk = (o, path) => { if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${path}[${i}]`)); else if (o && typeof o === "object") { if ("value" in o && (o.value === 0 || o.value === null) && !STATES.includes(o.state)) problems.push(`${path}.value is ${o.value} without a state`); for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`); } };
  walk(payload, "$");
  add("PF-EVID-05-PAYLOAD", "EVID-05", "fail", problems.length === 0, problems.length ? problems.slice(0, 20).join("; ") : "every 0/null value carries a state");
}

// ---------- PF-COLOR-01-HEX ----------
{
  const governed = new Set([...[...productionCss.matchAll(/#[0-9A-F]{6}/g)].map(m => m[0].toUpperCase()), ...lutHex.map(h => h.toUpperCase())]);
  // gradient-only values (tokens.atmosphere.gradientOnlyValues) are governed only inside their exact recipe strings
  const recipes = Object.values(tokens?.atmosphere?.recipes ?? {});
  const scanned = recipes.reduce((css, r) => css.split(r).join(" "), inlineCss);
  const recipeUses = recipes.reduce((n, r) => n + inlineCss.split(r).length - 1, 0);
  const used = [...new Set([...scanned.matchAll(/#[0-9A-Fa-f]{6}\b/g)].map(m => m[0].toUpperCase()))];
  const rogue = governed.size ? used.filter(h => !governed.has(h)) : [];
  add("PF-COLOR-01-HEX", "COLOR-01", "fail", rogue.length === 0, governed.size ? (rogue.length ? `hex outside the governed projection: ${rogue.join(", ")}${rogue.some(h => (tokens?.atmosphere?.gradientOnlyValues ?? []).includes(h)) ? " (gradient-only values are admitted only inside their exact atmosphere recipe)" : ""}` : `${used.length} inline hex values all resolve governed tokens${recipeUses ? `; ${recipeUses} exact atmosphere recipe use(s)` : ""}`) : "production CSS not found; pass --production-css");
}

// ---------- report ----------
const fails = results.filter(r => r.result === "fail"); const warns = results.filter(r => r.result === "warn");
for (const r of results) console.log(`${r.result.toUpperCase().padEnd(4)} ${r.id.padEnd(28)} ${r.detail}`);
console.log(`\n${fails.length} fail · ${warns.length} warn · ${results.length - fails.length - warns.length} pass — ${htmlPath}`);
if (opt("--report")) writeFileSync(opt("--report"), `${JSON.stringify({ release: register?.releaseRef ?? tokens?.releaseRef ?? "unknown", file: htmlPath, results }, null, 2)}\n`);
process.exit(fails.length ? 1 : 0);
