import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "../deployment");
const text = path => readFileSync(resolve(root, path), "utf8");
const json = path => JSON.parse(text(path));
const hash = path => createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
const errors = [];
const warnings = [];
const pass = (condition, message) => { if (!condition) errors.push(message); };

const html = text("index.html");
const css = text("styles.css");
const js = text("app.js");
const manifest = json("site-manifest.json");
const coverage = json("coverage-manifest.json");
const controls = json("control-inventory.json");
const tokens = json("assets/data/tokens.json");
const scales = json("assets/data/scales.json");
const fixtures = json("assets/data/fixtures.json");
const fonts = json("font-assets.manifest.json");

pass(manifest.artifact.normativeVersion === "0.8.6", "manifest normative version mismatch");
pass(manifest.artifact.machineValidation === "pending", "machine validation must remain pending");
pass(manifest.artifact.fullLivingReference === true, "fullLivingReference must be true");
pass(manifest.artifact.canonicalUrl === "https://montri-th.github.io/Landometer/", "canonical URL mismatch");
pass(/data-ds-version="0\.8\.6"/.test(html), "HTML ds version missing");
pass(/data-manifest-version="pending_0\.8\.6_generation"/.test(html), "HTML manifest boundary mismatch");
pass(/data-full-living-reference="true"/.test(html), "HTML full-reference identity missing");
pass(/<meta name="robots" content="noindex, nofollow, noarchive">/.test(html), "robots metadata mismatch");
pass(text("robots.txt") === "User-agent: *\nDisallow: /\n", "robots.txt mismatch");

for (const mode of ["start", "reference", "lab"]) pass(html.includes(`data-mode-panel="${mode}"`), `missing mode ${mode}`);
for (const layer of ["statement", "dna", "voice", "visual"]) pass(html.includes(`data-brand-layer="${layer}"`), `missing brand layer ${layer}`);
for (const section of coverage.sections) pass(new RegExp(`id="${section.anchor}"`).test(html), `coverage anchor missing: ${section.id} → ${section.anchor}`);
pass(coverage.sections.length === 16, `expected 16 governed source sections, found ${coverage.sections.length}`);
pass(coverage.requiredExamples.length === 17, `expected 17 required example records, found ${coverage.requiredExamples.length}`);

const requiredProofs = ["reward-before-request", "decision-quality", "private-by-default", "relevant-circle-coordination", "recovery-completeness", "cta-integrity", "transparent-learning", "voluntary-investment", "hook-without-dark-patterns", "cross-team-handoff"];
const fixtureIds = fixtures.referenceFixtures.map(item => item.id);
for (const proof of requiredProofs) pass(fixtureIds.includes(proof), `required proof fixture missing: ${proof}`);
pass(fixtures.referenceFixtures.filter(item => item.baselineAssisted).length >= 6, "fewer than six Baseline/Assisted fixtures");
pass(fixtures.referenceFixtures.every(item => item.localStateOnly === true && item.effect === "none"), "reference fixture effect boundary mismatch");

const expectedTokens = {
  "brand.blue": "#1D4497", "energy.sky": "#59D2FE", "energy.mint": "#0AD69C", "energy.coral": "#FF5A5F", "energy.yellow": "#FFBC1F",
  "surface.canvas.light": "#F6F7F3", "surface.canvas.dark": "#11191D", "interaction.accent.light": "#176B82", "interaction.accent.dark": "#68C4E2"
};
pass(tokens.brand.blue === expectedTokens["brand.blue"], "Brand Blue drift");
pass(tokens.energy.sky === expectedTokens["energy.sky"] && tokens.energy.mint === expectedTokens["energy.mint"] && tokens.energy.coral === expectedTokens["energy.coral"] && tokens.energy.yellow === expectedTokens["energy.yellow"], "energy token drift");
pass(tokens.foundation["surface.canvas"][0] === expectedTokens["surface.canvas.light"] && tokens.foundation["surface.canvas"][1] === expectedTokens["surface.canvas.dark"], "surface canvas drift");
pass(tokens.foundation["interaction.accent"][0] === expectedTokens["interaction.accent.light"] && tokens.foundation["interaction.accent"][1] === expectedTokens["interaction.accent.dark"], "interaction accent drift");
pass(!/#7FA2F1|periwinkle|lavender|terracotta/i.test(css + js), "forbidden controlled color/family appears in runtime CSS/JS");
pass(!/googleapis\.com|gstatic\.com|fonts\.google/i.test(css + js), "critical Google font request found");
pass(!/\b(?:pie|donut)\b/i.test(js), "pie/donut runtime implementation found");

pass(scales.meta.records === 18 && scales.scales.length === 18, "Scale Lab must have 18 light/dark LUTs");
for (const scale of scales.scales) {
  pass(scale.lut.length === 41, `${scale.scaleId}/${scale.theme} LUT is not 41 stops`);
  pass(scale.lut[0] === scale.anchors[0] && scale.lut[20] === scale.anchors[1] && scale.lut[40] === scale.anchors[2], `${scale.scaleId}/${scale.theme} anchor parity failed`);
  for (const n of [5, 7, 9]) pass(scale.classes[n].length === n, `${scale.scaleId}/${scale.theme} ${n}-class subset failed`);
  pass(/^[a-f0-9]{64}$/.test(scale.scaleVersion), `${scale.scaleId}/${scale.theme} scaleVersion invalid`);
}

pass(fonts.faces.length === 9, `expected nine packaged subset files for six semantic faces, found ${fonts.faces.length}`);
for (const face of fonts.faces) {
  pass(existsSync(resolve(root, face.file)), `missing font file: ${face.file}`);
  pass(hash(face.file) === face.sha256, `font hash mismatch: ${face.file}`);
  pass(existsSync(resolve(root, face.licenseFile)), `missing font license: ${face.licenseFile}`);
}

const localRefs = [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)].map(match => match[1]).filter(ref => !/^(?:https?:|mailto:|tel:|data:)/.test(ref));
for (const ref of localRefs) {
  const path = ref.endsWith('/') ? `${ref}index.html` : ref;
  pass(existsSync(resolve(root, path)), `broken local reference: ${ref}`);
}
for (const file of manifest.downloads) {
  pass(existsSync(resolve(root, file.path)), `manifest download missing: ${file.path}`);
  pass(hash(file.path) === file.sha256, `manifest download hash mismatch: ${file.path}`);
}
pass(existsSync(resolve(root, "adoption-demo/index.html")), "preserved adoption demo missing");

pass(controls.controls.length === 31, `control inventory group count changed: ${controls.controls.length}`);
pass(controls.controls.every(item => item.selector && item.accessibleName && item.userJob && item.finalState && item.failureRecovery && item.browserTest), "incomplete control inventory record");

const budgets = {
  htmlGzip: gzipSync(readFileSync(resolve(root, "index.html"))).length,
  cssGzip: gzipSync(readFileSync(resolve(root, "styles.css"))).length,
  jsGzip: gzipSync(readFileSync(resolve(root, "app.js"))).length,
  heroBytes: statSync(resolve(root, "assets/images/team-hero.jpg")).size,
  initialApproxBytes: ["index.html", "styles.css", "app.js", "assets/images/landometer-logo-banner.png", "assets/images/team-hero.jpg"].reduce((sum, file) => sum + statSync(resolve(root, file)).size, 0)
};
pass(budgets.htmlGzip + budgets.cssGzip <= 120 * 1024, `HTML + CSS gzip budget failed: ${budgets.htmlGzip + budgets.cssGzip}`);
pass(budgets.jsGzip <= 60 * 1024, `initial JS gzip budget failed: ${budgets.jsGzip}`);
pass(budgets.heroBytes <= 250 * 1024, `hero image budget failed: ${budgets.heroBytes}`);
pass(budgets.initialApproxBytes <= 750 * 1024, `approximate initial transfer budget failed: ${budgets.initialApproxBytes}`);

if (!/data-quiet-field/.test(html)) errors.push("quiet field markers missing");
if (!/data-motion-pattern="staggered_scroll_reveal"/.test(html)) errors.push("real motion specimen marker missing");
if (!/data-dataviz-matrix/.test(html)) errors.push("dataviz decision matrix marker missing");
if (!/data-chart-alternative="table"/.test(html)) errors.push("accessible chart alternative marker missing");
if (!/data-state-fixture="no-data"/.test(html) || !/data-state-fixture="zero"/.test(html)) errors.push("no-data/zero fixtures missing");

console.log(JSON.stringify({ status: errors.length ? "FAIL" : warnings.length ? "PASS_WITH_WARNINGS" : "PASS", errors, warnings, metrics: { governedSections: coverage.sections.length, requiredExamples: coverage.requiredExamples.length, proofFixtures: requiredProofs.length, baselineAssisted: fixtures.referenceFixtures.filter(item => item.baselineAssisted).length, scaleLuts: scales.scales.length, controlGroups: controls.controls.length, budgets } }, null, 2));
process.exitCode = errors.length ? 1 : 0;
