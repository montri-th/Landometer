import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const project = resolve(here, "..");
const deployment = resolve(project, "deployment");
const hash = path => createHash("sha256").update(readFileSync(resolve(deployment, path))).digest("hex");
const fileRecord = path => ({ path, bytes: statSync(resolve(deployment, path)).size, sha256: hash(path) });

const controls = [
  { id: "menu.open", selector: "#open-menu", expectedCount: 1, accessibleName: "Open navigation, settings, language, and theme", userJob: "Open compact navigation/settings", finalState: "modal dialog open", failureRecovery: "Escape or visible Close", browserTest: "click + Enter" },
  { id: "menu.close", selector: "#close-menu", expectedCount: 1, accessibleName: "Close menu", userJob: "Close menu", finalState: "dialog closed and focus returned", failureRecovery: "Escape", browserTest: "click + Enter + Escape" },
  { id: "mode.routes", selector: "[data-route-mode]", expectedCount: 16, accessibleName: "Visible label per route", userJob: "Open Start, Reference, or Lab", finalState: "one active mode; URL restored", failureRecovery: "menu or footer routes", browserTest: "invoke every route" },
  { id: "locale.choice", selector: "[data-locale-choice]", expectedCount: 2, accessibleName: "ไทย / English", userJob: "Change active language", finalState: "one active locale; html lang and URL updated", failureRecovery: "reset preferences", browserTest: "switch both directions" },
  { id: "theme.choice", selector: "[data-theme-choice]", expectedCount: 3, accessibleName: "Auto / Light / Dark", userJob: "Change theme preference", finalState: "resolved theme and browser color updated", failureRecovery: "Auto or reset", browserTest: "Auto + Light + Dark" },
  { id: "preferences.reset", selector: "#reset-preferences", expectedCount: 1, accessibleName: "Reset language and theme", userJob: "Clear explicit utility preferences", finalState: "system theme and browser locale restored", failureRecovery: "choose settings again", browserTest: "click" },
  { id: "start.role", selector: "#start-role", expectedCount: 1, accessibleName: "Start with my role", userJob: "Reach role path", finalState: "role section focused in route", failureRecovery: "normal back/scroll", browserTest: "click + Enter" },
  { id: "role.select", selector: "#role-select", expectedCount: 1, accessibleName: "Role", userJob: "Choose role recipe", finalState: "one role proof and takeaway", failureRecovery: "choose another role", browserTest: "five options" },
  { id: "role.view", selector: "[data-role-view]", expectedCount: 2, accessibleName: "Baseline / Assisted", userJob: "Compare the same object with or without assistance", finalState: "view and URL updated", failureRecovery: "toggle back", browserTest: "both buttons" },
  { id: "role.copy", selector: "#copy-role-recipe", expectedCount: 1, accessibleName: "Copy recipe", userJob: "Copy role recipe", finalState: "clipboard receipt", failureRecovery: "select visible takeaway", browserTest: "click" },
  { id: "handoff.tabs", selector: "[data-handoff]", expectedCount: 5, accessibleName: "Marketing through Evidence/QA", userJob: "Inspect truth across roles", finalState: "one tabpanel updated", failureRecovery: "Arrow/Home/End", browserTest: "click + keyboard" },
  { id: "reference.search", selector: "#reference-search", expectedCount: 1, accessibleName: "Search the design system", userJob: "Find an exact rule/recipe", finalState: "matching section results", failureRecovery: "clear query", browserTest: "type + result click" },
  { id: "reference.deepLinks", selector: ".copy-link", expectedCount: 16, accessibleName: "Copy link", userJob: "Copy exact rule deep link", finalState: "clipboard receipt", failureRecovery: "native address copy", browserTest: "sample + count" },
  { id: "reference.swatches", selector: "[data-copy-value]", expectedCount: 5, accessibleName: "Token hex value", userJob: "Copy canonical value", finalState: "clipboard receipt", failureRecovery: "visible value remains", browserTest: "sample + count" },
  { id: "buildCard.fields", selector: "#build-card-form input:not([type=checkbox]), #build-card-form select", expectedCount: 8, accessibleName: "Associated field labels", userJob: "Define scoped build", finalState: "form values retained", failureRecovery: "edit and resubmit", browserTest: "required fields and selects" },
  { id: "buildCard.capabilities", selector: "#build-card-form input[type=checkbox]", expectedCount: 9, accessibleName: "Capability name", userJob: "Declare enabled branches", finalState: "validation uses selected capabilities", failureRecovery: "uncheck", browserTest: "conflict cases" },
  { id: "buildCard.generate", selector: "#build-card-form button[type=submit]", expectedCount: 1, accessibleName: "Validate and generate YAML", userJob: "Validate starter Build Card", finalState: "YAML or actionable errors", failureRecovery: "edit fields", browserTest: "valid + invalid" },
  { id: "buildCard.download", selector: "#download-build-card", expectedCount: 1, accessibleName: "Download this YAML", userJob: "Download generated Build Card", finalState: "local file download", failureRecovery: "copy code block / full template", browserTest: "click after valid generate" },
  { id: "downloads", selector: "a[download]", expectedCount: 11, accessibleName: "File-specific label", userJob: "Obtain implementation asset", finalState: "local file download", failureRecovery: "direct file URL", browserTest: "HEAD/local reference check" },
  { id: "reference.details", selector: "#reference-mode details", expectedCount: 5, accessibleName: "Visible summary", userJob: "Reveal exact contract/evidence", finalState: "detail expanded/collapsed", failureRecovery: "toggle again", browserTest: "keyboard sample + count" },
  { id: "lab.navigation", selector: "#previous-specimen, #specimen-select, #next-specimen", expectedCount: 3, accessibleName: "Previous / specimen / next", userJob: "Move among specimens", finalState: "one active specimen and URL", failureRecovery: "direct selector", browserTest: "previous + next + select" },
  { id: "proof.controls", selector: "#proof-select, #proof-baseline, #proof-assisted, #run-proof, #reset-proof", expectedCount: 5, accessibleName: "Proof-specific label", userJob: "Inspect and run a local proof", finalState: "local receipt or reset", failureRecovery: "reset proof", browserTest: "all ten proofs; six comparisons" },
  { id: "theme.inspect", selector: ".theme-pair button", expectedCount: 2, accessibleName: "Inspect source", userJob: "Open governing visual rule", finalState: "Reference visual section", failureRecovery: "Lab route", browserTest: "both panels" },
  { id: "state.controls", selector: "#state-select, #state-demo-action", expectedCount: 2, accessibleName: "Choose state / state action", userJob: "Inspect truthful state/recovery", finalState: "state-complete local fixture", failureRecovery: "choose default", browserTest: "all ten states + retry" },
  { id: "chart.select", selector: "#chart-select", expectedCount: 1, accessibleName: "What decision are you making?", userJob: "Choose chart from decision question", finalState: "one chart + accessible table", failureRecovery: "choose another question", browserTest: "five chart families" },
  { id: "scale.controls", selector: "#scale-select, #scale-theme, #scale-classes", expectedCount: 3, accessibleName: "Scale / Theme / Classes", userJob: "Inspect generated LUT and class subset", finalState: "anchors, LUT, classes, hash synchronized", failureRecovery: "choose defaults", browserTest: "nine scales × two themes × 5/7/9" },
  { id: "map.areas", selector: ".map-area", expectedCount: 3, accessibleName: "Select Area A/B/C", userJob: "Select governed area", finalState: "geometry/readout/table synchronized", failureRecovery: "select another area", browserTest: "click + Enter/Space" },
  { id: "motion.controls", selector: "#replay-motion, #pause-motion", expectedCount: 2, accessibleName: "Replay / Pause show final", userJob: "Inspect timing and safe final state", finalState: "event log and visible final meaning", failureRecovery: "Pause/show final", browserTest: "normal + reduced motion" },
  { id: "product.tabs", selector: "[data-product]", expectedCount: 5, accessibleName: "Product name", userJob: "Compare profile character with invariant truth", finalState: "one product tabpanel", failureRecovery: "Arrow/Home/End", browserTest: "click + keyboard" },
  { id: "recipient.controls", selector: "#recipient-role, #prepare-preview", expectedCount: 2, accessibleName: "Recipient / Prepare local preview", userJob: "Inspect a safe recipient handoff", finalState: "local exact-object preview", failureRecovery: "change recipient; no external send", browserTest: "all recipients" },
  { id: "footer.routes", selector: "footer nav button, footer nav a", expectedCount: 4, accessibleName: "Start / Reference / Lab / Adoption demo", userJob: "Navigate from page end", finalState: "selected route", failureRecovery: "browser back", browserTest: "all four" }
];

const coverageText = readFileSync(resolve(deployment, "index.html"), "utf8").match(/<script type="application\/json" id="design-system-coverage">\s*([\s\S]*?)\s*<\/script>/)?.[1];
if (!coverageText) throw new Error("Embedded coverage manifest not found");
const coverage = JSON.parse(coverageText);
writeFileSync(resolve(deployment, "coverage-manifest.json"), `${JSON.stringify(coverage, null, 2)}\n`);

const manifest = {
  artifact: {
    id: "landometer-design-system-v0.8.6-living-reference",
    title: "Landometer Design System v0.8.6 — Living Reference",
    releaseDate: "2026-07-22",
    status: "provisional working reference",
    normativeVersion: "0.8.6",
    buildCardVersion: "0.8.6",
    manifestVersion: "pending_0.8.6_generation",
    tokenSchemaVersion: 6,
    product: "landometer",
    profile: "designsystem.adoption",
    pageKind: "full_living_reference",
    pageKindSourceRef: "REFERENCE-01",
    delivery: "deployable_public",
    evidenceStatus: "provisional",
    visibility: "public",
    indexable: false,
    canonicalUrl: "https://montri-th.github.io/Landometer/",
    machineValidation: "pending",
    fullLivingReference: true
  },
  experience: {
    modes: ["start", "reference", "lab"],
    oneActiveAtATime: true,
    oneJob: "Find and apply the exact Landometer rule or recipe needed for the current role/task.",
    firstAha: "A role-specific recipe and invariant CityMETER reference object appear within 30 seconds.",
    dominantObject: "demo.citymeter.place-insight.v1",
    primaryAction: "Start with my role",
    nextUsefulAction: "Open the exact rule/recipe or test the specimen.",
    cleanCompletion: "Copy/download a scoped recipe and leave without any signup, save, share, or external effect.",
    brandSignatures: ["Measure", "Ground", "Cultivate"],
    locales: { fallback: "th", additional: ["en"], oneActiveAtATime: true, urlState: true },
    themes: { mode: "interactive_auto", support: "dual", default: "system", visibleOverride: true, explicitPreferenceStored: true },
    network: { mode: "reference_ready", action: "none" },
    channelParityKey: "demo.citymeter.place-insight.v1|source_limited|reference"
  },
  capabilities: {
    live: { search: true, fullLivingReference: true, motionEnhancement: true, analyticalEvidence: false, dataVisualization: false, map: false, share: false, persistence: false, externalSideEffect: false, telemetry: false },
    fixtureScoped: ["analyticalEvidence", "dataVisualization", "map", "share-preview", "component-states", "motion"],
    fixtureEffect: "none",
    fixtureState: "local browser state only"
  },
  adoptionRoleRegistry: {
    owner: "current user instruction to apply the five practical role acceptance tasks",
    version: "working-reference-2026-07-22-v1",
    status: "implementation roster; formal role-findability study pending",
    records: [
      { id: "design", oneJob: "copy a correct component recipe", nextRoleOrRecipient: "development" },
      { id: "development", oneJob: "obtain tokens, code, and test rules", nextRoleOrRecipient: "evidence/qa" },
      { id: "product", oneJob: "complete a scoped Build Card", nextRoleOrRecipient: "design" },
      { id: "marketing", oneJob: "produce a grounded claim recipe", nextRoleOrRecipient: "product" },
      { id: "review", oneJob: "trace specimen to source rule and gate", nextRoleOrRecipient: "release owner" }
    ]
  },
  governedObject: { id: "demo.citymeter.place-insight.v1", status: "no_current_result", sourceStatus: "source_limited", source: "not connected in reference fixture", limitation: "not for a real city or business decision", allowedUses: ["design-system education", "local QA"] },
  reference: {
    renderedSections: coverage.sections.length,
    requiredExamples: coverage.requiredExamples.length,
    proofIds: ["reward-before-request", "decision-quality", "private-by-default", "relevant-circle-coordination", "recovery-completeness", "cta-integrity", "transparent-learning", "voluntary-investment", "hook-without-dark-patterns", "cross-team-handoff"],
    scaleLuts: 18,
    chartFamilies: ["sorted horizontal bar", "line", "100% stacked bar", "bullet", "interval"],
    prohibitedCharts: ["pie", "donut", "semi-donut", "circular part-to-whole"],
    implementationDownloads: ["CSS", "JSON", "TypeScript", "Build Card YAML", "component recipes", "voice recipes", "fixture registry", "starter ZIP"]
  },
  assets: [
    { ...fileRecord("assets/images/landometer-logo-banner.png"), type: "official logo raster extracted from Brand Visual Guidelines 2025 page 4", dimensions: "3818x1048", transform: "none; intrinsic ratio preserved", approvalBoundary: "asset registry ID and formal permission record remain pending" },
    { ...fileRecord("assets/images/team-hero.jpg"), type: "photograph derivative", source: "user-supplied IMG_9244.jpeg", dimensions: "1200x900", transform: "resized and metadata stripped; no crop", displayedUse: "opening team identity; not product proof", permissionBoundary: "publication directed by user; formal owner/credit/expiry record pending" },
    { ...fileRecord("assets/images/team-presenting.jpg"), type: "photograph", source: "user-supplied IMG_5698.jpeg", dimensions: "466x573", transform: "none", displayedUse: "team-culture evidence only", permissionBoundary: "publication directed by user; context/date/owner/credit/expiry pending" }
  ],
  downloads: ["assets/downloads/landometer-tokens.css", "assets/downloads/landometer-tokens.json", "assets/downloads/landometer-tokens.ts", "assets/downloads/build-card-template.yaml", "assets/downloads/component-recipes.md", "assets/downloads/voice-recipes.md", "assets/downloads/reference-fixtures.json", "assets/downloads/landometer-ds-v0.8.6-starter.zip"].filter(path => { try { statSync(resolve(deployment, path)); return true; } catch { return false; } }).map(fileRecord),
  publication: { repository: "https://github.com/montri-th/Landometer", repositoryVisibility: "public", canonicalUrl: "https://montri-th.github.io/Landometer/", indexingSignal: "noindex", telemetry: "disabled", oldDemoRoute: "/Landometer/adoption-demo/" },
  qa: { controlInventoryPath: "control-inventory.json", coverageManifestPath: "coverage-manifest.json", status: "pending browser and deployment verification", machineValidation: "pending", knownBoundaries: ["generated schema/preflight package pending", "formal photo/logo permission registry pending", "formal five-role findability study pending"] }
};

writeFileSync(resolve(deployment, "control-inventory.json"), `${JSON.stringify({ version: "0.8.6", generated: "2026-07-22", controls }, null, 2)}\n`);
writeFileSync(resolve(deployment, "site-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(deployment, "robots.txt"), "User-agent: *\nDisallow: /\n");
writeFileSync(resolve(deployment, ".nojekyll"), "");

mkdirSync(resolve(project, "docs"), { recursive: true });
writeFileSync(resolve(project, "README.md"), `# Landometer Design System v0.8.6 — Living Reference\n\nThe repository root deploys a practical design-system reference at https://montri-th.github.io/Landometer/.\n\n## Structure\n\n- \`deployment/\` — GitHub Pages root\n- \`deployment/adoption-demo/\` — preserved decision-demo derivative\n- \`deployment/assets/downloads/\` — implementation starter files\n- \`tools/\` — deterministic token/scale generation and release checks\n- \`docs/\` — public-safe QA evidence\n\n## Status\n\nProvisional working reference. The generated v0.8.6 schema, preflight, and migration ledger remain pending, so this site does not claim machine schema/preflight conformance. Formal media permission records and the five-role findability study also remain open release gates.\n\n## Run locally\n\n\`\`\`bash\npython3 -m http.server 8000 --directory deployment\n\`\`\`\n\nThen open http://localhost:8000/.\n`);

console.log(JSON.stringify({ controls: controls.length, sections: coverage.sections.length, requiredExamples: coverage.requiredExamples.length, downloads: manifest.downloads.length }, null, 2));
