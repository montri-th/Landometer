import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const project = resolve(import.meta.dirname, "..");
const root = resolve(project, "deployment");
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
const publicRelease = json("assets/downloads/landometer-public-release-v0.8.6.json");
const publicSpec = text("assets/downloads/landometer-design-system-v0.8.6-public.md");
const publicBuildCard = text("assets/downloads/build-card-template.yaml");
const skillZipPath = resolve(root, "assets/downloads/apply-landometer-design-system-v0.8.6-public.1.zip");

pass(manifest.artifact.normativeVersion === "0.8.6", "manifest normative version mismatch");
pass(manifest.artifact.machineValidation === "pending", "machine validation must remain pending");
pass(manifest.artifact.fullLivingReference === true, "fullLivingReference must be true");
pass(manifest.artifact.canonicalUrl === "https://montri-th.github.io/Landometer/", "canonical URL mismatch");
pass(/data-ds-version="0\.8\.6"/.test(html), "HTML ds version missing");
pass(/data-manifest-version="pending_0\.8\.6_generation"/.test(html), "HTML manifest boundary mismatch");
pass(/data-full-living-reference="true"/.test(html), "HTML full-reference identity missing");
pass(/<meta name="robots" content="noindex, nofollow, noarchive">/.test(html), "robots metadata mismatch");
pass(text("robots.txt") === "User-agent: *\nDisallow: /\n", "robots.txt mismatch");
pass(manifest.publicRelease?.id === "landometer-design-system-v0.8.6-public.1", "public release metadata missing");
pass(manifest.publicRelease?.normativeSourceSha256 === "d91fa8b84f557221ae9c507f2be0655765d7ae225ae5e70b0857c1e27bef3604", "public release source fingerprint mismatch");
pass(manifest.publicRelease?.skillInvocation === "explicit_only", "public skill must require explicit invocation");
pass(manifest.publicRelease?.machineSchemaConformance === "pending", "public release must keep machine conformance pending");
pass(manifest.adoptionRoleRegistry?.owner === "public release brief", "public role registry owner metadata mismatch");
pass(!/current user instruction/i.test(readFileSync(resolve(project, "tools/finalize-release.mjs"), "utf8")), "release generator exposes instruction provenance");
const publicAssetKeys = ["bytes", "downloadPackageIncluded", "path", "sha256", "usageClass"].sort();
for (const asset of manifest.assets) {
  pass(JSON.stringify(Object.keys(asset).sort()) === JSON.stringify(publicAssetKeys), `public asset record exposes non-public provenance: ${asset.path}`);
  pass(asset.downloadPackageIncluded === false, `site media must stay outside public download packages: ${asset.path}`);
}
const expectedPublicImages = {
  "landometer-logo-banner.png": "f6ed8748d32d11514c94ce6a639491120489ce8c3ab6fff073d7ca9638a87535",
  "team-hero.jpg": "50048eb0d0eeaf8b17e086bebc504389033bcc0673d453363c27581aa11579fb",
  "team-presenting.jpg": "3893f0da6816814bf7bbd0ab1f5635020f06b327e99033bd50cb5beba014f76f"
};
const publicImageNames = readdirSync(resolve(root, "assets/images")).sort();
pass(JSON.stringify(publicImageNames) === JSON.stringify(Object.keys(expectedPublicImages).sort()), "public image directory must contain exactly the three approved site images");
for (const [name, expected] of Object.entries(expectedPublicImages)) {
  pass(hash(`assets/images/${name}`) === expected, `approved public image hash mismatch: ${name}`);
}
// The legacy adoption demo is intentionally preserved byte-for-byte and sits
// outside this public package. Validate its presence below, but do not make a
// new release depend on rewriting legacy metadata that is not shipped in any
// downloadable archive.

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
const approvedMediaHashes = new Set(Object.values(expectedPublicImages));
for (const zipName of readdirSync(resolve(root, "assets/downloads")).filter(name => name.endsWith(".zip"))) {
  const zipPath = resolve(root, "assets/downloads", zipName);
  const entries = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).trim().split("\n").filter(entry => entry && !entry.endsWith("/"));
  for (const entry of entries) {
    const entryBytes = execFileSync("unzip", ["-p", zipPath, entry]);
    const entryHash = createHash("sha256").update(entryBytes).digest("hex");
    pass(!approvedMediaHashes.has(entryHash), `approved site image bytes leaked into download package: ${zipName}:${entry}`);
    pass(!/\.(?:avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp|woff2?|ttf|otf|eot)$/i.test(entry), `image or font asset found in download package: ${zipName}:${entry}`);
    if (/\.(?:css|json|md|txt|ts|ya?ml)$/i.test(entry)) {
      const entryText = entryBytes.toString("utf8");
      pass(!/(?:project_sources|\/workspace\/|\/root\/|IMG_\d|permissionRecordId|trackingTicket|06-IMG_8786|Brand Visual Guidelines|ownerOnlyHostedUrl|creatorCredit|authorizationSource|private handoff)/i.test(entryText), `internal path or provenance marker found in download package: ${zipName}:${entry}`);
      pass(!/(?:BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|Bearer\s+[A-Za-z0-9._~-]{20,}|api[_-]?key\s*[:=]\s*["'][^"']+)/i.test(entryText), `credential-like content found in download package: ${zipName}:${entry}`);
    }
  }
}
pass((html.match(/<a\b[^>]*\bdownload\b/gi) || []).length === 15, "HTML download control count must be 15");
for (const required of [
  "assets/downloads/landometer-design-system-v0.8.6-public.md",
  "assets/downloads/apply-landometer-design-system-v0.8.6-public.1.zip",
  "assets/downloads/SHA256SUMS.txt",
  "assets/downloads/landometer-public-release-v0.8.6.json",
  "assets/downloads/landometer-public-release-v0.8.6-changelog.md"
]) pass(manifest.downloads.some(file => file.path === required), `public download not recorded: ${required}`);

pass(publicRelease.release.designSystemVersion === "0.8.6", "public manifest version mismatch");
pass(publicRelease.release.publicPackageRevision === 1, "public package revision mismatch");
pass(publicRelease.release.machineSchemaConformance === "pending", "public manifest must keep machine conformance pending");
pass(publicRelease.release.normativeSourceSha256 === "d91fa8b84f557221ae9c507f2be0655765d7ae225ae5e70b0857c1e27bef3604", "public manifest source fingerprint mismatch");
pass(publicRelease.release.publicSpecificationSha256 === hash("assets/downloads/landometer-design-system-v0.8.6-public.md"), "public specification fingerprint mismatch");
for (const file of publicRelease.files) {
  pass(existsSync(resolve(root, file.path)), `public manifest file missing: ${file.path}`);
  pass(hash(file.path) === file.sha256, `public manifest hash mismatch: ${file.path}`);
}

pass(/^# Landometer Design System v0\.8\.6 — Public Implementation Specification/m.test(publicSpec), "public specification identity missing");
pass(publicSpec.includes("Public package revision:** 1"), "public specification revision missing");
pass(publicSpec.includes("d91fa8b84f557221ae9c507f2be0655765d7ae225ae5e70b0857c1e27bef3604"), "public specification source fingerprint missing");
pass(/machine (?:Schema 6\/preflight )?conformance pending/i.test(publicSpec), "public specification pending-machine boundary missing");
pass(publicSpec.includes("The shared Landometer layer is product-neutral"), "portfolio/product evidence boundary missing");
pass(publicSpec.includes("does not itself grant rights"), "public rights boundary missing");
pass(!/(?:project_sources|\/workspace\/|\/root\/|IMG_\d|permissionRecordId|trackingTicket|06-IMG_8786)/i.test(publicSpec), "private path, ledger field, or candidate asset leaked into public specification");
pass(!/(?:BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|AKIA[0-9A-Z]{16}|Bearer\s+[A-Za-z0-9._~-]{20,}|api[_-]?key\s*[:=]\s*["'][^"']+)/i.test(publicSpec), "credential-like content found in public specification");

pass(/delivery: internal_demo/.test(publicBuildCard), "public Build Card must default to internal_demo");
pass(/evidenceStatus: source_limited/.test(publicBuildCard), "public Build Card must default to source_limited");
pass(/visibility: private/.test(publicBuildCard) && /indexable: false/.test(publicBuildCard), "public Build Card must default private and non-indexable");
pass(/officialLogo: missing/.test(publicBuildCard) && /permissionStatus: unresolved/.test(publicBuildCard), "public Build Card must default assets unresolved");
pass(/sourceStatus: not_applicable/.test(publicBuildCard), "public Build Card must not default evidence to official");
pass(/externalSideEffect: false/.test(publicBuildCard) && /boundedAgentAction: false/.test(publicBuildCard) && /agentActionEffect: none/.test(publicBuildCard), "public Build Card external-effect defaults unsafe");

const zipEntries = execFileSync("unzip", ["-Z1", skillZipPath], { encoding: "utf8" }).trim().split("\n");
const zipFiles = zipEntries.filter(entry => !entry.endsWith("/"));
const expectedSkillFiles = [
  "apply-landometer-design-system-v0-8-6/SKILL.md",
  "apply-landometer-design-system-v0-8-6/agents/openai.yaml",
  "apply-landometer-design-system-v0-8-6/assets/build-card-template.yaml",
  "apply-landometer-design-system-v0-8-6/assets/landometer-tokens.css",
  "apply-landometer-design-system-v0-8-6/assets/landometer-tokens.json",
  "apply-landometer-design-system-v0-8-6/assets/landometer-tokens.ts",
  "apply-landometer-design-system-v0-8-6/assets/reference-fixtures.json",
  "apply-landometer-design-system-v0-8-6/references/component-recipes.md",
  "apply-landometer-design-system-v0-8-6/references/landometer-design-system-v0.8.6-public.md",
  "apply-landometer-design-system-v0-8-6/references/release-lock.json",
  "apply-landometer-design-system-v0-8-6/references/voice-recipes.md"
].sort();
pass(zipEntries.every(entry => !entry.startsWith("/") && !entry.split("/").includes("..") && !entry.includes("\\")), "unsafe skill ZIP path found");
pass(JSON.stringify([...zipFiles].sort()) === JSON.stringify(expectedSkillFiles), "skill ZIP contains missing or unexpected files");
pass(zipFiles.filter(entry => entry.endsWith("/SKILL.md")).length === 1, "skill ZIP must contain exactly one SKILL.md");
pass(!zipEntries.some(entry => /(?:^|\/)scripts\//.test(entry)), "public skill ZIP must be scriptless");
const zipDetails = execFileSync("unzip", ["-Z", "-l", skillZipPath], { encoding: "utf8" });
for (const line of zipDetails.split("\n").filter(line => /^[-dl][rwx-]{9}\s/.test(line))) {
  const mode = line.slice(0, 10);
  pass(!mode.startsWith("l"), "symlink found in public skill ZIP");
  if (mode.startsWith("-")) pass(!mode.includes("x"), "executable file found in public skill ZIP");
}
const zipRead = entry => execFileSync("unzip", ["-p", skillZipPath, entry]);
const bundledSpec = zipRead("apply-landometer-design-system-v0-8-6/references/landometer-design-system-v0.8.6-public.md");
pass(createHash("sha256").update(bundledSpec).digest("hex") === hash("assets/downloads/landometer-design-system-v0.8.6-public.md"), "skill ZIP public specification differs from website download");
const bundledSkill = zipRead("apply-landometer-design-system-v0-8-6/SKILL.md").toString("utf8");
const bundledAgent = zipRead("apply-landometer-design-system-v0-8-6/agents/openai.yaml").toString("utf8");
pass(/^name: apply-landometer-design-system-v0-8-6$/m.test(bundledSkill), "skill name/version lock missing");
pass(/Stop when the request names any other design-system version/.test(bundledSkill), "skill version-mismatch stop missing");
pass(/allow_implicit_invocation: false/.test(bundledAgent), "public skill implicit invocation must be disabled");
pass(!/^dependencies:/m.test(bundledAgent), "public skill must not declare tool dependencies");
const releaseLock = JSON.parse(zipRead("apply-landometer-design-system-v0-8-6/references/release-lock.json").toString("utf8"));
pass(releaseLock.designSystemVersion === "0.8.6" && releaseLock.publicPackageRevision === 1, "skill release lock mismatch");
for (const [file, expected] of Object.entries(releaseLock.files)) {
  const entry = `apply-landometer-design-system-v0-8-6/${file}`;
  pass(createHash("sha256").update(zipRead(entry)).digest("hex") === expected, `skill release-lock hash mismatch: ${file}`);
}
const sourceSkillRoot = resolve(project, "skill/apply-landometer-design-system-v0-8-6");
const walkFiles = (directory, prefix = "") => readdirSync(directory, { withFileTypes: true }).flatMap(item => {
  const relative = prefix ? `${prefix}/${item.name}` : item.name;
  return item.isDirectory() ? walkFiles(resolve(directory, item.name), relative) : [relative];
});
const expectedSourceSkillFiles = expectedSkillFiles.map(file => file.replace(/^apply-landometer-design-system-v0-8-6\//, "")).sort();
pass(JSON.stringify(walkFiles(sourceSkillRoot).sort()) === JSON.stringify(expectedSourceSkillFiles), "public skill source contains missing or unexpected files");
for (const relative of expectedSourceSkillFiles) {
  const sourceBytes = readFileSync(resolve(sourceSkillRoot, relative));
  const zipBytes = zipRead(`apply-landometer-design-system-v0-8-6/${relative}`);
  pass(sourceBytes.equals(zipBytes), `public skill source differs from downloadable ZIP: ${relative}`);
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
