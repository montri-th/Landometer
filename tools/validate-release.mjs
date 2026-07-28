import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../deployment");
const errors = [];
const checks = [];

function pass(condition, message) {
  checks.push({ message, passed: Boolean(condition) });
  if (!condition) errors.push(message);
}

function text(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function json(path) {
  return JSON.parse(text(path));
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
}

const html = text("index.html");
const manifest = json("site-manifest.v0.8.8.json");
const inventory = json("control-inventory.v0.8.8.json");
const buildCard = text("build-card.v0.8.8.yml");
const fontManifest = json("font-assets.manifest.json");

pass(/data-ds-version="0\.8\.8"/.test(html), "HTML exposes Design System 0.8.8");
pass(/data-build-card-version="0\.8\.8"/.test(html), "HTML exposes Build Card 0.8.8");
pass(/data-manifest-version="2\.0"/.test(html), "HTML exposes Manifest 2.0");
pass(/data-token-schema-version="6"/.test(html), "HTML exposes Token Schema 6");
pass(/data-ds-profile="brand\.public"/.test(html), "HTML exposes the brand.public profile");
pass(/data-delivery-mode="internal_demo"/.test(html), "HTML exposes the internal-demo delivery boundary");
pass(/data-full-living-reference="false"/.test(html), "Full Living Reference remains disabled");
pass(/data-evidence-status="source_limited"/.test(html), "HTML preserves source_limited status");
pass(/data-machine-validation="pending"/.test(html), "HTML preserves pending machine validation");
pass(/noindex,nofollow,noarchive/.test(html), "HTML preserves noindex metadata");

pass(manifest.artifact.version === "0.8.8", "Manifest version is 0.8.8");
pass(manifest.artifact.buildCardVersion === "0.8.8", "Manifest Build Card version is 0.8.8");
pass(manifest.artifact.manifestVersion === "2.0", "Manifest schema is 2.0");
pass(manifest.artifact.tokenSchemaVersion === 6, "Manifest token schema is 6");
pass(manifest.artifact.evidenceStatus === "source_limited", "Manifest preserves source_limited status");
pass(manifest.artifact.indexable === false, "Manifest preserves noindex state");
pass(manifest.artifact.machineValidation === "pending", "Manifest preserves pending validation");
pass(manifest.artifact.fullLivingReference === false, "Manifest keeps Full Living Reference disabled");
pass(manifest.artifact.profile === "brand.public", "Manifest selects the brand.public profile");
pass(manifest.artifact.delivery === "internal_demo", "Manifest preserves internal-demo delivery");
pass(manifest.roleRegistry.status === "not_applicable", "Role registry is not claimed for the brand.public profile");
pass(Array.isArray(manifest.composition.connectors) && manifest.composition.connectors.length === 0, "No semantic connector is claimed");

for (const capability of [
  "motionEnhancement",
  "search",
  "fullLivingReference",
  "share",
  "persistence",
  "authentication",
  "externalSideEffect",
  "map",
  "dataVisualization",
  "analyticalEvidence",
  "telemetry"
]) {
  pass(manifest.capabilities[capability] === false, `Capability ${capability} remains disabled`);
}

pass(buildCard.includes("dsVersion: 0.8.8"), "Build Card version is 0.8.8");
pass(buildCard.includes("profile: brand.public"), "Build Card selects one brand.public profile");
pass(buildCard.includes("delivery: internal_demo"), "Build Card preserves internal-demo delivery");
pass(buildCard.includes("fullLivingReference: false"), "Build Card keeps Full Living Reference disabled");
pass(buildCard.includes("search: false"), "Build Card keeps search disabled");
pass(buildCard.includes("machineValidation: pending"), "Build Card preserves pending validation");
pass(buildCard.includes("ahaProvesPromise: true"), "Build Card ties the fixture AHA to the Brand Promise");
pass(buildCard.includes("connectors: []"), "Build Card declares no connector");

pass((html.match(/<h1\b/g) || []).length === 1, "Page source contains exactly one H1");
pass(html.includes("Let us cultivate our city."), "Protected cultural invitation is exact");
pass(html.includes("Measure What Matters. Make It Actionable."), "Protected Brand Promise is exact");
pass(html.includes("Clear") && html.includes("Grounded") && html.includes("Energetic"), "Brand DNA is present");
pass(html.includes("Brand Voice") && html.includes("Brand Visual"), "Voice and Visual lenses are present");
pass(html.includes("Land · Location · Living"), "Locale Insight covers Land, Location, and Living");
pass(html.includes("portfolio, methodology") && html.includes("product-architecture"), "Shared Locale Insight architecture boundary is present");
pass(html.includes("schema/release") && html.includes("compatible"), "Compatibility boundary is present");
pass(html.includes("partial ≠ complete") && html.includes("modelled ≠ observed") && html.includes("planned ≠ available"), "Truth-preserving handoff guards are present");
pass(html.includes("product-specific"), "Product-specific evidence boundary is explicit");

pass(!/Mission Lab|#7FA2F1|googleapis|gstatic|fonts\.google/i.test(html), "Forbidden legacy sub-brand, color, and font dependencies are absent");
pass(!/#[0-9a-f]{6}\b[^<]*(purple|violet|lavender|fuchsia)/i.test(html), "No forbidden purple-family token is declared");
pass(html.includes("#1D4497"), "Protected Brand Blue is exact");
pass(html.includes("linear-gradient(135deg, #C33F55 0%, #FF8A4C 52%, #F4C44E 100%)"), "Cultivate gradient stop order is exact");
pass(html.includes("linear-gradient(135deg, #147A9F 0%, #3BD3CB 52%, #3BD19B 100%)"), "Ground gradient stop order is exact");
pass(html.includes("linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)"), "Light Measure gradient is exact");
pass(html.includes("linear-gradient(135deg, #68C4E2 0%, #15919A 52%, #08756F 100%)"), "Dark Measure gradient is exact");
pass(html.includes("font-synthesis: none"), "Font synthesis is disabled");
pass(html.includes("--font-display-en-fallback: Georgia, Cambria, \"Times New Roman\", serif"), "English display fallback token is exact");
pass(html.includes("--font-display-th-fallback: \"Noto Sans Thai Looped\", \"Leelawadee UI\", Tahoma, sans-serif"), "Thai display fallback token is exact");
pass(html.includes("--font-body-fallback: \"Noto Sans Thai\", \"Leelawadee UI\", Tahoma, sans-serif"), "Body fallback token is exact");
pass(html.includes("--font-number-fallback: \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace"), "Number fallback token is exact");
pass(html.includes("document.fonts.ready"), "Font readiness is observed");

pass(!/<script[^>]+src=/i.test(html), "No external JavaScript dependency is present");
pass(!/<link[^>]+rel=["']stylesheet["']/i.test(html), "No external stylesheet dependency is present");
pass(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/i.test(html), "No network or telemetry API is used");
pass(html.includes("navigator.clipboard") && html.includes("document.execCommand"), "Clipboard action has a local fallback");
pass(html.includes("prefers-reduced-motion: reduce"), "Reduced-motion behavior is present");
pass(html.includes("<noscript>"), "No-JavaScript guidance is present");
pass(html.includes("data-quiet-field"), "Perceptual quiet regions are annotated");

const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
pass(new Set(allIds).size === allIds.length, "All HTML IDs are unique");

const controlIds = [...html.matchAll(/<(?:a|button|input|select|textarea)\b[^>]*\bid="([^"]+)"/g)]
  .map(match => match[1]);
const inventoryIds = inventory.controls.map(control => control.id);
pass(new Set(controlIds).size === controlIds.length, "All control IDs are unique");
pass(new Set(inventoryIds).size === inventoryIds.length, "All inventory IDs are unique");
pass(
  controlIds.length === inventoryIds.length &&
    controlIds.every(id => inventoryIds.includes(id)) &&
    inventoryIds.every(id => controlIds.includes(id)),
  "Control inventory exactly matches visible/focusable source controls"
);
for (const control of inventory.controls) {
  pass(Boolean(control.accessibleName), `Inventory ${control.id} has an accessible name`);
  pass(Boolean(control.userJob), `Inventory ${control.id} has a user job`);
  pass(Boolean(control.effect), `Inventory ${control.id} has a real effect`);
  pass(Boolean(control.finalState), `Inventory ${control.id} has a final state`);
  pass(Boolean(control.failureRecovery), `Inventory ${control.id} has failure recovery`);
  pass(Boolean(control.browserTest), `Inventory ${control.id} has a browser test`);
}

for (const path of [
  "index.html",
  "site-manifest.v0.8.8.json",
  "build-card.v0.8.8.yml",
  "control-inventory.v0.8.8.json",
  "qa/v0.8.8-automated.json",
  "qa/v0.8.8-manual-gates.md",
  "font-assets.manifest.json",
  "assets/images/landometer-logo-banner.png",
  "assets/images/team-hero.jpg"
]) {
  pass(existsSync(resolve(root, path)), `Required path exists: ${path}`);
}

pass(
  sha256("assets/images/landometer-logo-banner.png") === "f6ed8748d32d11514c94ce6a639491120489ce8c3ab6fff073d7ca9638a87535",
  "Reused logo bytes match the existing approved-path record"
);
pass(
  sha256("assets/images/team-hero.jpg") === "50048eb0d0eeaf8b17e086bebc504389033bcc0673d453363c27581aa11579fb",
  "Reused opening photo bytes match the existing approved-path record"
);

for (const face of fontManifest.faces) {
  pass(existsSync(resolve(root, face.file)), `Font exists: ${face.file}`);
  pass(sha256(face.file) === face.sha256, `Font hash matches: ${face.file}`);
  pass(existsSync(resolve(root, face.licenseFile)), `Font license exists: ${face.licenseFile}`);
  pass(html.includes(face.file), `Font is packaged in the single-page HTML: ${face.file}`);
}

pass(!existsSync(resolve(root, "site-manifest.json")), "Stale unversioned manifest is removed");
pass(!existsSync(resolve(root, "control-inventory.json")), "Stale unversioned control inventory is removed");

if (errors.length) {
  console.error(`v0.8.8 validation FAILED (${errors.length} of ${checks.length} checks)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `v0.8.8 validation PASSED · ${checks.length} static checks · ${controlIds.length} controls · machineValidation pending`
);
