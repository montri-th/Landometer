#!/usr/bin/env node

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const deploymentRoot = resolve(repositoryRoot, "deployment");
const projectRoot = resolve(repositoryRoot, "../..");

const RELEASE = Object.freeze({
  version: "0.9.1",
  authoringRevision: "0.9.1-r8",
  rulesetRevision: "lds-rules-0.9.1",
  machinePackageIdentity: "v0.9.1-mp7",
  manifestVersion: "2.1",
  tokenSchemaVersion: 6,
  evidenceStatus: "source_limited",
  machineValidation: "pending",
  colorSetId: "color-srgb-05",
  gradientSchema: "landometer-atmosphere-gradient-v2",
  artifactBuildId: "ui-20260902-07",
  previousArtifactBuildId: "ui-20260902-06",
  earlierArtifactBuildId: "ui-20260902-05",
  initialArtifactBuildId: "ui-20260902-04",
  predecessorArtifactBuildId: "ui-20260902-03",
  originArtifactBuildId: "ui-20260902-02",
  legacyArtifactBuildId: "ui-20260902-01",
  oldestArtifactBuildId: "ui-20260901-01",
  latest: "landometer-design-system-v0.9.1-standalone.html",
  immutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-07.html",
  previousImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-06.html",
  earlierImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-05.html",
  initialImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-04.html",
  predecessorImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-03.html",
  originImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-02.html",
  legacyImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-01.html",
  oldestImmutableUi: "landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260901-01.html",
  historicalBaseline: "landometer-design-system-v0.9.0-standalone.color-srgb-05.html",
  authoringMaster: "assets/downloads/landometer-design-system-v0.9.1.md",
  registry: "assets/data/color-delivery.v0.9.1.json",
  historicalRegistry: "assets/data/color-delivery.v0.9.0.json",
  manifest: "site-manifest.v0.9.1.json",
  buildCard: "build-card.v0.9.1.yml",
  implementationNotes: "implementation-notes.v0.9.1.md",
  automatedQa: "qa/v0.9.1-automated.json",
  manualQa: "qa/v0.9.1-manual-gates.md",
  authoritySha256: "64f5d6277b557176502285bc65890ecc4c81faf4b97946eb5e3a2ef2c0d90d19",
  previousImmutableUiSha256: "3eb1866ec860f1cbfee998eb3155f9a1c4fa40b7a2881dda903e6c163d7d2d55",
  earlierImmutableUiSha256: "8e25a5c8b0f39b8d96d433720681222ea06027862e8749922546678e355c05cf",
  initialImmutableUiSha256: "5e2f707b333e0424ea9035f7392022514e0e37bf4ca0aa4680617483889fe42a",
  predecessorImmutableUiSha256: "804f01102cd596d424acad6f3db23a00c5646fed04f6493fac89a88adb4ca332",
  originImmutableUiSha256: "818f106d0b964c6fc5a0ace20e82de1a4918b0c84b261362e4b896a4b7a737ee",
  legacyImmutableUiSha256: "a95f50caf4bd10ed73a8ade1ddf637d09e80a7e6e6c4c24421375e449c0f8dc1",
  oldestImmutableUiSha256: "5a457f2440bb2f13622b11ab065d3ff2c9ebe5a0a903a3efc6a0dd7ef2190927",
  navFontSha256: "d7e283106ed2898726b24504c4e0f5ad524292984a90a4d29553c7dcf53b9657",
  navFontLicenseSha256: "58d1e17ffe5109a7ae296caafcadfdbe6a7d176f0bc4ab01e12a689b0499d8bd",
  historicalBaselineSha256: "0788b25be195307821ac7c26159d5011e840c4c0da385ba6c9237e90fbaf7f1a",
  historicalRegistrySha256: "aa6833b5286f6eb957925cb0c538c951d6822217fb83b051a71473ff2bdbd9c5",
  tokensSha256: "00863492782b2fb1f93e6229f644fa0c092bde0e8c5d1093619c3120d73a71fc",
  scalesSha256: "daf8e5219f1da9229d7fb474fdaba3957f37c0cfe18eef7527e551c37d88d235",
});

const EXPECTED_GRADIENTS = Object.freeze([
  "#1D4497 0%, #176B82 54%, #08756F 100%",
  "#89CEF6 0%, #5ECAD6 50%, #6CD5B3 100%",
  "#0F5773 0%, #006A6A 50%, #1F744F 100%",
  "#C4E0EE 0%, #B2E2E2 50%, #CCE6D0 100%",
  "#EB8182 0%, #F5A06F 50%, #EBC573 100%",
  "#F7CBC7 0%, #FBD1B6 50%, #F1E0B4 100%",
  "#89CEF6 0%, #6CD5B3 34%, #EBC573 67%, #EB8182 100%",
]);

const failures = [];
let checkCount = 0;

function check(condition, id, detail = "") {
  checkCount += 1;
  if (!condition) failures.push(detail ? `${id}: ${detail}` : id);
}

function repoPath(relativePath) {
  return resolve(repositoryRoot, relativePath);
}

function deploymentPath(relativePath) {
  return resolve(deploymentRoot, relativePath);
}

function readUtf8(absolutePath) {
  return readFileSync(absolutePath, "utf8");
}

function readDeployment(relativePath) {
  return readUtf8(deploymentPath(relativePath));
}

function readJson(absolutePath, id) {
  try {
    return JSON.parse(readUtf8(absolutePath));
  } catch (error) {
    check(false, id, error.message);
    return null;
  }
}

function sha256(absolutePath) {
  return createHash("sha256").update(readFileSync(absolutePath)).digest("hex");
}

function fileRecord(absolutePath) {
  return { bytes: statSync(absolutePath).size, sha256: sha256(absolutePath) };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasAttribute(source, name, value) {
  return new RegExp(`\\b${escapeRegExp(name)}\\s*=\\s*(?:"${escapeRegExp(value)}"|'${escapeRegExp(value)}')`, "i").test(source);
}

function manifestAsset(manifest, relativePath) {
  return manifest?.assets?.find((asset) => asset.path === relativePath) ?? null;
}

function manifestAssetMatches(manifest, relativePath) {
  const absolutePath = deploymentPath(relativePath);
  if (!existsSync(absolutePath)) return false;
  const expected = fileRecord(absolutePath);
  const actual = manifestAsset(manifest, relativePath);
  return Boolean(actual && actual.bytes === expected.bytes && actual.sha256 === expected.sha256);
}

function normalizeBuildChannel(source) {
  return source.replace(
    /data-build-channel=("|')[^"']+("|')/,
    'data-build-channel="normalized"',
  );
}

function visibleText(source) {
  return source
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<textarea\b[\s\S]*?<\/textarea>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, " ")
    .replace(/\s+/g, " ");
}

function walkFiles(root, prefix = "") {
  const output = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolutePath = resolve(root, entry.name);
    if (entry.isDirectory()) output.push(...walkFiles(absolutePath, relativePath));
    else output.push(relativePath);
  }
  return output;
}

function runNodeCheck(script, args, id) {
  const result = spawnSync(process.execPath, [repoPath(script), ...args], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  check(result.status === 0, id, output.split(/\r?\n/).slice(-4).join(" | "));
}

const requiredRepositoryFiles = [
  "deployment/index.html",
  `deployment/${RELEASE.latest}`,
  `deployment/${RELEASE.immutableUi}`,
  `deployment/${RELEASE.previousImmutableUi}`,
  `deployment/${RELEASE.earlierImmutableUi}`,
  `deployment/${RELEASE.initialImmutableUi}`,
  `deployment/${RELEASE.predecessorImmutableUi}`,
  `deployment/${RELEASE.originImmutableUi}`,
  `deployment/${RELEASE.legacyImmutableUi}`,
  `deployment/${RELEASE.oldestImmutableUi}`,
  `deployment/${RELEASE.historicalBaseline}`,
  `deployment/${RELEASE.authoringMaster}`,
  `deployment/${RELEASE.registry}`,
  `deployment/${RELEASE.historicalRegistry}`,
  `deployment/${RELEASE.manifest}`,
  `deployment/${RELEASE.buildCard}`,
  `deployment/${RELEASE.implementationNotes}`,
  `deployment/${RELEASE.automatedQa}`,
  `deployment/${RELEASE.manualQa}`,
  "deployment/assets/data/tokens.json",
  "deployment/assets/data/scales.json",
  "deployment/font-assets.manifest.json",
  "deployment/assets/fonts/material-symbols-rounded-nav-300.woff2",
  "deployment/assets/fonts/licenses/material-symbols-Apache-2.0.txt",
  "tools/build-standalone-html.mjs",
  "tools/check-gradient-contrast.mjs",
  "tools/generate-color-atlas.mjs",
  ".github/workflows/pages.yml",
  ".github/workflows/verify-v090.yml",
];

for (const relativePath of requiredRepositoryFiles) {
  check(existsSync(repoPath(relativePath)), `required-file:${relativePath}`);
}

if (failures.length > 0) {
  console.error(`v0.9.1 release validation FAIL (${failures.length}/${checkCount})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const html = readDeployment("index.html");
const latestHtml = readDeployment(RELEASE.latest);
const immutableHtml = readDeployment(RELEASE.immutableUi);
const previousImmutableHtml = readDeployment(RELEASE.previousImmutableUi);
const earlierImmutableHtml = readDeployment(RELEASE.earlierImmutableUi);
const initialImmutableHtml = readDeployment(RELEASE.initialImmutableUi);
const predecessorImmutableHtml = readDeployment(RELEASE.predecessorImmutableUi);
const originImmutableHtml = readDeployment(RELEASE.originImmutableUi);
const legacyImmutableHtml = readDeployment(RELEASE.legacyImmutableUi);
const oldestImmutableHtml = readDeployment(RELEASE.oldestImmutableUi);
const authoringMaster = readDeployment(RELEASE.authoringMaster);
const registry = readJson(deploymentPath(RELEASE.registry), "parse:color-registry-v091");
const historicalRegistry = readJson(deploymentPath(RELEASE.historicalRegistry), "parse:color-registry-v090");
const manifest = readJson(deploymentPath(RELEASE.manifest), "parse:site-manifest-v091");
const automatedQa = readJson(deploymentPath(RELEASE.automatedQa), "parse:automated-qa-v091");
const buildCard = readDeployment(RELEASE.buildCard);
const implementationNotes = readDeployment(RELEASE.implementationNotes);
const manualQa = readDeployment(RELEASE.manualQa);
const workflow = readUtf8(repoPath(".github/workflows/pages.yml"));
const renderedWorkflow = readUtf8(repoPath(".github/workflows/verify-v090.yml"));

// Current release identity. v0.9.1-mp7 is an identity receipt only: this web release
// deliberately does not claim to publish or validate those machine-package bytes.
for (const [channel, source, expectedChannel] of [
  ["hosted", html, "latest-alias"],
  ["standalone-latest", latestHtml, "latest-alias"],
  ["standalone-immutable", immutableHtml, "immutable-artifact-build"],
]) {
  check(hasAttribute(source, "data-ds-version", RELEASE.version), `identity:${channel}:version`);
  check(hasAttribute(source, "data-authoring-revision", RELEASE.authoringRevision), `identity:${channel}:authoring-revision`);
  check(hasAttribute(source, "data-ruleset", RELEASE.rulesetRevision), `identity:${channel}:ruleset-revision`);
  check(hasAttribute(source, "data-machine-package-identity", RELEASE.machinePackageIdentity), `identity:${channel}:machine-package-identity`);
  check(hasAttribute(source, "data-color-registry", RELEASE.colorSetId), `identity:${channel}:color-set`);
  check(hasAttribute(source, "data-artifact-build", RELEASE.artifactBuildId), `identity:${channel}:artifact-build`);
  check(hasAttribute(source, "data-build-channel", expectedChannel), `identity:${channel}:build-channel`);
  check(hasAttribute(source, "data-atmosphere-gradient-registry", RELEASE.gradientSchema), `identity:${channel}:gradient-schema`);
  check(hasAttribute(source, "data-evidence-status", RELEASE.evidenceStatus), `identity:${channel}:evidence-status`);
  check(hasAttribute(source, "data-machine-validation", RELEASE.machineValidation), `identity:${channel}:machine-validation`);
}
check(hasAttribute(latestHtml, "data-standalone", "true"), "identity:standalone-latest:marker");
check(hasAttribute(immutableHtml, "data-standalone", "true"), "identity:standalone-immutable:marker");
check(hasAttribute(previousImmutableHtml, "data-ds-version", RELEASE.version), "history:previous-v091-ui:version");
check(hasAttribute(previousImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:previous-v091-ui:authoring-revision");
check(hasAttribute(previousImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:previous-v091-ui:ruleset-revision");
check(hasAttribute(previousImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:previous-v091-ui:machine-package-identity");
check(hasAttribute(previousImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:previous-v091-ui:color-set");
check(hasAttribute(previousImmutableHtml, "data-artifact-build", RELEASE.previousArtifactBuildId), "history:previous-v091-ui:artifact-build");
check(hasAttribute(previousImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:previous-v091-ui:build-channel");
check(hasAttribute(previousImmutableHtml, "data-standalone", "true"), "history:previous-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.previousImmutableUi)) === RELEASE.previousImmutableUiSha256, "history:previous-v091-ui:known-hash");
check(hasAttribute(earlierImmutableHtml, "data-ds-version", RELEASE.version), "history:earlier-v091-ui:version");
check(hasAttribute(earlierImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:earlier-v091-ui:authoring-revision");
check(hasAttribute(earlierImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:earlier-v091-ui:ruleset-revision");
check(hasAttribute(earlierImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:earlier-v091-ui:machine-package-identity");
check(hasAttribute(earlierImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:earlier-v091-ui:color-set");
check(hasAttribute(earlierImmutableHtml, "data-artifact-build", RELEASE.earlierArtifactBuildId), "history:earlier-v091-ui:artifact-build");
check(hasAttribute(earlierImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:earlier-v091-ui:build-channel");
check(hasAttribute(earlierImmutableHtml, "data-standalone", "true"), "history:earlier-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.earlierImmutableUi)) === RELEASE.earlierImmutableUiSha256, "history:earlier-v091-ui:known-hash");
check(hasAttribute(initialImmutableHtml, "data-ds-version", RELEASE.version), "history:initial-v091-ui:version");
check(hasAttribute(initialImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:initial-v091-ui:authoring-revision");
check(hasAttribute(initialImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:initial-v091-ui:ruleset-revision");
check(hasAttribute(initialImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:initial-v091-ui:machine-package-identity");
check(hasAttribute(initialImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:initial-v091-ui:color-set");
check(hasAttribute(initialImmutableHtml, "data-artifact-build", RELEASE.initialArtifactBuildId), "history:initial-v091-ui:artifact-build");
check(hasAttribute(initialImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:initial-v091-ui:build-channel");
check(hasAttribute(initialImmutableHtml, "data-standalone", "true"), "history:initial-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.initialImmutableUi)) === RELEASE.initialImmutableUiSha256, "history:initial-v091-ui:known-hash");
check(hasAttribute(predecessorImmutableHtml, "data-ds-version", RELEASE.version), "history:predecessor-v091-ui:version");
check(hasAttribute(predecessorImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:predecessor-v091-ui:authoring-revision");
check(hasAttribute(predecessorImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:predecessor-v091-ui:ruleset-revision");
check(hasAttribute(predecessorImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:predecessor-v091-ui:machine-package-identity");
check(hasAttribute(predecessorImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:predecessor-v091-ui:color-set");
check(hasAttribute(predecessorImmutableHtml, "data-artifact-build", RELEASE.predecessorArtifactBuildId), "history:predecessor-v091-ui:artifact-build");
check(hasAttribute(predecessorImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:predecessor-v091-ui:build-channel");
check(hasAttribute(predecessorImmutableHtml, "data-standalone", "true"), "history:predecessor-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.predecessorImmutableUi)) === RELEASE.predecessorImmutableUiSha256, "history:predecessor-v091-ui:known-hash");
check(hasAttribute(originImmutableHtml, "data-ds-version", RELEASE.version), "history:origin-v091-ui:version");
check(hasAttribute(originImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:origin-v091-ui:authoring-revision");
check(hasAttribute(originImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:origin-v091-ui:ruleset-revision");
check(hasAttribute(originImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:origin-v091-ui:machine-package-identity");
check(hasAttribute(originImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:origin-v091-ui:color-set");
check(hasAttribute(originImmutableHtml, "data-artifact-build", RELEASE.originArtifactBuildId), "history:origin-v091-ui:artifact-build");
check(hasAttribute(originImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:origin-v091-ui:build-channel");
check(hasAttribute(originImmutableHtml, "data-standalone", "true"), "history:origin-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.originImmutableUi)) === RELEASE.originImmutableUiSha256, "history:origin-v091-ui:known-hash");
check(hasAttribute(legacyImmutableHtml, "data-ds-version", RELEASE.version), "history:legacy-v091-ui:version");
check(hasAttribute(legacyImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:legacy-v091-ui:authoring-revision");
check(hasAttribute(legacyImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:legacy-v091-ui:ruleset-revision");
check(hasAttribute(legacyImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:legacy-v091-ui:machine-package-identity");
check(hasAttribute(legacyImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:legacy-v091-ui:color-set");
check(hasAttribute(legacyImmutableHtml, "data-artifact-build", RELEASE.legacyArtifactBuildId), "history:legacy-v091-ui:artifact-build");
check(hasAttribute(legacyImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:legacy-v091-ui:build-channel");
check(hasAttribute(legacyImmutableHtml, "data-standalone", "true"), "history:legacy-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.legacyImmutableUi)) === RELEASE.legacyImmutableUiSha256, "history:legacy-v091-ui:known-hash");
check(hasAttribute(oldestImmutableHtml, "data-ds-version", RELEASE.version), "history:oldest-v091-ui:version");
check(hasAttribute(oldestImmutableHtml, "data-authoring-revision", RELEASE.authoringRevision), "history:oldest-v091-ui:authoring-revision");
check(hasAttribute(oldestImmutableHtml, "data-ruleset", RELEASE.rulesetRevision), "history:oldest-v091-ui:ruleset-revision");
check(hasAttribute(oldestImmutableHtml, "data-machine-package-identity", RELEASE.machinePackageIdentity), "history:oldest-v091-ui:machine-package-identity");
check(hasAttribute(oldestImmutableHtml, "data-color-registry", RELEASE.colorSetId), "history:oldest-v091-ui:color-set");
check(hasAttribute(oldestImmutableHtml, "data-artifact-build", RELEASE.oldestArtifactBuildId), "history:oldest-v091-ui:artifact-build");
check(hasAttribute(oldestImmutableHtml, "data-build-channel", "immutable-artifact-build"), "history:oldest-v091-ui:build-channel");
check(hasAttribute(oldestImmutableHtml, "data-standalone", "true"), "history:oldest-v091-ui:standalone-marker");
check(sha256(deploymentPath(RELEASE.oldestImmutableUi)) === RELEASE.oldestImmutableUiSha256, "history:oldest-v091-ui:known-hash");
check(/<title>[^<]*v0\.9\.1/i.test(html), "identity:document-title");
check(html.includes("Landometer Design System · v0.9.1"), "identity:visible-release-label");
check(html.includes("Let us") && html.includes("cultivate") && html.includes("with data."), "identity:protected-rally-cry");

// Owner source is copied byte-for-byte into the published download. Prefer the
// project mirror as an additional independent authority when it is available.
const downloadPath = deploymentPath(RELEASE.authoringMaster);
check(sha256(downloadPath) === RELEASE.authoritySha256, "authority:download-known-hash");
check(authoringMaster.includes("Authoring revision: **0.9.1-r8**"), "authority:authoring-revision");
check(authoringMaster.includes("Ruleset: **lds-rules-0.9.1**"), "authority:ruleset-revision");
check(authoringMaster.includes("Machine package: **v0.9.1-mp7**"), "authority:machine-package-identity");
const projectAuthorityPath = resolve(projectRoot, "sources/Landometer Design System v0.9.1.md");
if (existsSync(projectAuthorityPath)) {
  check(sha256(projectAuthorityPath) === RELEASE.authoritySha256, "authority:project-source-known-hash");
  check(Buffer.compare(readFileSync(projectAuthorityPath), readFileSync(downloadPath)) === 0, "authority:project-source-byte-parity");
} else {
  const authorityAsset = manifestAsset(manifest, RELEASE.authoringMaster);
  check(authorityAsset?.sha256 === RELEASE.authoritySha256, "authority:manifest-fallback-hash");
}

// Registry identity carries the unchanged Color Set into a new UI build while
// continuing to point at the frozen predecessor baseline.
check(registry?.meta?.id === RELEASE.colorSetId, "registry:color-set-retained");
check(registry?.meta?.designSystemVersion === RELEASE.version, "registry:design-system-version");
check(registry?.meta?.authoringRevision === RELEASE.authoringRevision, "registry:authoring-revision");
check((registry?.meta?.rulesetRevision ?? registry?.meta?.ruleset) === RELEASE.rulesetRevision, "registry:ruleset-revision");
check((registry?.meta?.machinePackageIdentity ?? registry?.meta?.machinePackage) === RELEASE.machinePackageIdentity, "registry:machine-package-identity-only");
check(registry?.meta?.immutableColorBaseline === RELEASE.historicalBaseline, "registry:historical-baseline-reference");
check(registry?.meta?.currentArtifactBuild?.id === RELEASE.artifactBuildId, "registry:current-artifact-build");
check(registry?.meta?.currentArtifactBuild?.immutableStandalone === RELEASE.immutableUi, "registry:immutable-ui-path");
check(
  html.includes(`href="${RELEASE.immutableUi}" id="resource-standalone"`),
  "handoff:download-points-to-current-immutable-ui",
);
check(
  html.includes(`<code>${RELEASE.immutableUi}</code>`),
  "handoff:visible-pinned-build-points-to-current-immutable-ui",
);
check(
  html.includes(`${RELEASE.colorSetId} retained · artifact build ${RELEASE.artifactBuildId}<br>`),
  "handoff:footer-receipt-points-to-current-artifact-build",
);
for (const [key, relativePath, expectedHash] of [
  ["authoringMaster", RELEASE.authoringMaster, RELEASE.authoritySha256],
  ["retainedColorRegistry", RELEASE.historicalRegistry, RELEASE.historicalRegistrySha256],
  ["tokenRegistry", "assets/data/tokens.json", RELEASE.tokensSha256],
  ["scaleRegistry", "assets/data/scales.json", RELEASE.scalesSha256],
]) {
  const sourceRecord = registry?.sources?.[key];
  check(sourceRecord?.path === relativePath, `registry:source-path:${key}`);
  check(sourceRecord?.sha256 === expectedHash, `registry:source-hash:${key}`);
  check(sourceRecord?.bytes === statSync(deploymentPath(relativePath)).size, `registry:source-bytes:${key}`);
}
const currentArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.artifactBuildId && record.path === RELEASE.immutableUi,
);
check(currentArtifactRecord?.role === "immutable_ui_build", "registry:current-record-role");
check(currentArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:current-record-color-set");
check(currentArtifactRecord?.status === "append_only", "registry:current-record-append-only");
check(currentArtifactRecord?.supersedes === RELEASE.previousArtifactBuildId, "registry:current-record-supersedes-previous-v091-ui");
check(currentArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.immutableUi)).size, "registry:current-record-bytes");
check(currentArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.immutableUi)), "registry:current-record-hash");
const previousArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.previousArtifactBuildId && record.path === RELEASE.previousImmutableUi,
);
check(previousArtifactRecord?.role === "immutable_ui_build", "registry:previous-v091-record-role");
check(previousArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:previous-v091-record-color-set");
check(previousArtifactRecord?.status === "append_only", "registry:previous-v091-record-append-only");
check(previousArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.previousImmutableUi)).size, "registry:previous-v091-record-bytes");
check(previousArtifactRecord?.sha256 === RELEASE.previousImmutableUiSha256, "registry:previous-v091-record-known-hash");
check(previousArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.previousImmutableUi)), "registry:previous-v091-record-file-hash");
const earlierArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.earlierArtifactBuildId && record.path === RELEASE.earlierImmutableUi,
);
check(earlierArtifactRecord?.role === "immutable_ui_build", "registry:earlier-v091-record-role");
check(earlierArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:earlier-v091-record-color-set");
check(earlierArtifactRecord?.status === "append_only", "registry:earlier-v091-record-append-only");
check(earlierArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.earlierImmutableUi)).size, "registry:earlier-v091-record-bytes");
check(earlierArtifactRecord?.sha256 === RELEASE.earlierImmutableUiSha256, "registry:earlier-v091-record-known-hash");
check(earlierArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.earlierImmutableUi)), "registry:earlier-v091-record-file-hash");
const initialArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.initialArtifactBuildId && record.path === RELEASE.initialImmutableUi,
);
check(initialArtifactRecord?.role === "immutable_ui_build", "registry:initial-v091-record-role");
check(initialArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:initial-v091-record-color-set");
check(initialArtifactRecord?.status === "append_only", "registry:initial-v091-record-append-only");
check(initialArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.initialImmutableUi)).size, "registry:initial-v091-record-bytes");
check(initialArtifactRecord?.sha256 === RELEASE.initialImmutableUiSha256, "registry:initial-v091-record-known-hash");
check(initialArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.initialImmutableUi)), "registry:initial-v091-record-file-hash");
const predecessorArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.predecessorArtifactBuildId && record.path === RELEASE.predecessorImmutableUi,
);
check(predecessorArtifactRecord?.role === "immutable_ui_build", "registry:predecessor-v091-record-role");
check(predecessorArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:predecessor-v091-record-color-set");
check(predecessorArtifactRecord?.status === "append_only", "registry:predecessor-v091-record-append-only");
check(predecessorArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.predecessorImmutableUi)).size, "registry:predecessor-v091-record-bytes");
check(predecessorArtifactRecord?.sha256 === RELEASE.predecessorImmutableUiSha256, "registry:predecessor-v091-record-known-hash");
check(predecessorArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.predecessorImmutableUi)), "registry:predecessor-v091-record-file-hash");
const originArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.originArtifactBuildId && record.path === RELEASE.originImmutableUi,
);
check(originArtifactRecord?.role === "immutable_ui_build", "registry:origin-v091-record-role");
check(originArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:origin-v091-record-color-set");
check(originArtifactRecord?.status === "append_only", "registry:origin-v091-record-append-only");
check(originArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.originImmutableUi)).size, "registry:origin-v091-record-bytes");
check(originArtifactRecord?.sha256 === RELEASE.originImmutableUiSha256, "registry:origin-v091-record-known-hash");
check(originArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.originImmutableUi)), "registry:origin-v091-record-file-hash");
const legacyArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.legacyArtifactBuildId && record.path === RELEASE.legacyImmutableUi,
);
check(legacyArtifactRecord?.role === "immutable_ui_build", "registry:legacy-v091-record-role");
check(legacyArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:legacy-v091-record-color-set");
check(legacyArtifactRecord?.status === "append_only", "registry:legacy-v091-record-append-only");
check(legacyArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.legacyImmutableUi)).size, "registry:legacy-v091-record-bytes");
check(legacyArtifactRecord?.sha256 === RELEASE.legacyImmutableUiSha256, "registry:legacy-v091-record-known-hash");
check(legacyArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.legacyImmutableUi)), "registry:legacy-v091-record-file-hash");
const oldestArtifactRecord = registry?.artifactBuilds?.find(
  (record) => record.id === RELEASE.oldestArtifactBuildId && record.path === RELEASE.oldestImmutableUi,
);
check(oldestArtifactRecord?.role === "immutable_ui_build", "registry:oldest-v091-record-role");
check(oldestArtifactRecord?.colorRegistryId === RELEASE.colorSetId, "registry:oldest-v091-record-color-set");
check(oldestArtifactRecord?.status === "append_only", "registry:oldest-v091-record-append-only");
check(oldestArtifactRecord?.bytes === statSync(deploymentPath(RELEASE.oldestImmutableUi)).size, "registry:oldest-v091-record-bytes");
check(oldestArtifactRecord?.sha256 === RELEASE.oldestImmutableUiSha256, "registry:oldest-v091-record-known-hash");
check(oldestArtifactRecord?.sha256 === sha256(deploymentPath(RELEASE.oldestImmutableUi)), "registry:oldest-v091-record-file-hash");
check(sha256(deploymentPath(RELEASE.historicalRegistry)) === RELEASE.historicalRegistrySha256, "history:v090-registry-byte-frozen");
check(sha256(deploymentPath(RELEASE.historicalBaseline)) === RELEASE.historicalBaselineSha256, "history:color-srgb-05-baseline-byte-frozen");
check(!existsSync(deploymentPath("landometer-design-system-v0.9.1-standalone.color-srgb-05.html")), "history:no-reminted-v091-color-baseline");
check(sha256(deploymentPath("assets/data/tokens.json")) === RELEASE.tokensSha256, "history:token-registry-byte-frozen");
check(sha256(deploymentPath("assets/data/scales.json")) === RELEASE.scalesSha256, "history:scale-registry-byte-frozen");

for (const record of historicalRegistry?.artifactBuilds ?? []) {
  const absolutePath = deploymentPath(record.path);
  check(existsSync(absolutePath), `history:artifact-present:${record.path}`);
  if (existsSync(absolutePath)) {
    check(record.status === "append_only", `history:artifact-append-only:${record.path}`);
    check(record.bytes === statSync(absolutePath).size, `history:artifact-bytes:${record.path}`);
    check(record.sha256 === sha256(absolutePath), `history:artifact-hash:${record.path}`);
  }
}
for (const relativePath of [
  "site-manifest.v0.9.0.json",
  "build-card.v0.9.0.yml",
  "implementation-notes.v0.9.0.md",
  "qa/v0.9.0-automated.json",
  "qa/v0.9.0-manual-gates.md",
]) {
  check(existsSync(deploymentPath(relativePath)), `history:release-record-present:${relativePath}`);
}

// The retained Color Atlas remains exact, complete, and generated from the frozen
// registries. The generator check below verifies every individual LUT/class value.
check(html.includes("<!-- COLOR_ATLAS_START -->") && html.includes("<!-- COLOR_ATLAS_END -->"), "atlas:generated-boundaries");
check(hasAttribute(html, "data-atlas-records", "18"), "atlas:eighteen-gradient-records-marker");
check(hasAttribute(html, "data-color-registry", RELEASE.colorSetId), "atlas:color-set-marker");
check((html.match(/class="atlas-scale-record"/g) ?? []).length === 18, "atlas:eighteen-scale-records");
check((html.match(/class="atlas-lut-cell"/g) ?? []).length === 18 * 41, "atlas:738-lut-cells");
check((html.match(/class="atlas-class-cell"/g) ?? []).length === 18 * (5 + 7 + 9), "atlas:378-class-cells");
check((html.match(/class="scale-family-card"/g) ?? []).length === 9, "atlas:nine-sampler-families");
check((html.match(/class="scale-family-class-cell"/g) ?? []).length === 9 * (5 + 7 + 9), "atlas:189-sampler-class-cells");
check((html.match(/<figure class="atlas-gradient-card atlas-gradient-card--shared"/g) ?? []).length === 6, "atlas:six-tonal-shared-gradients");
check((html.match(/<figure class="atlas-gradient-card atlas-gradient-card--rare"/g) ?? []).length === 1, "atlas:one-rare-diversity-gradient");
check((html.match(/<figure class="atlas-gradient-card atlas-gradient-card--motif"/g) ?? []).length === 3, "atlas:three-motif-gradients");
for (const gradient of EXPECTED_GRADIENTS) check(html.includes(gradient), `atlas:exact-gradient:${gradient}`);

// v0.9.1 implementation examples: four constructive visual chapters, one
// incompatibility result, and one bounded rejected/recovery storyboard. The
// section-level boundary and every case record keep synthetic fixtures separate
// from product truth.
const v091Start = html.indexOf('id="v091-additions"');
const v091End = html.indexOf('<section class="playground" id="play"', v091Start);
const v091Section = v091Start >= 0 && v091End > v091Start ? html.slice(v091Start, v091End) : "";
check(v091Section.length > 0, "examples:v091-section-present");
check(v091Section.includes('class="v091-story"'), "examples:visual-story-present");
for (const id of ["v091-layers", "v091-parity", "v091-calm-nav", "v091-format", "v091-incompatibility", "v091-rejected-motion"]) {
  check(new RegExp(`\\bid="${id}"`).test(v091Section), `examples:case:${id}`);
}
check((v091Section.match(/data-media-status="conceptual_no_product_evidence"/g) ?? []).length === 6, "examples:all-six-cases-evidence-labelled");
check(
  v091Section.includes("ตัวอย่างเชิงแนวคิดทั้งหมดด้านล่าง") &&
    v091Section.includes("All fixtures below are conceptual"),
  "examples:section-bilingual-evidence-boundary",
);
check(
  v091Section.includes("failure แบบคงที่") && v091Section.includes("failure is shown statically"),
  "examples:rejected-case-bilingual-boundary",
);
check(
  v091Section.includes("Locale Insight") &&
    /class="v091-domain-pack"><strong>Land<\/strong>/.test(v091Section) &&
    /class="v091-domain-pack"><strong>Location<\/strong>/.test(v091Section) &&
    /class="v091-domain-pack"><strong>Living<\/strong>/.test(v091Section),
  "examples:locale-insight-three-domains",
);
check(/product pack|product layer/.test(v091Section), "examples:shared-vs-product-specific-boundary");
check(v091Section.includes("Initial HTML") && v091Section.includes("Visible page") && v091Section.includes("Hydrated state"), "examples:initial-visible-hydrated-parity");
check(
  v091Section.includes('class="v091-claim-meta"') &&
    v091Section.includes("source · PRACTICE-01") &&
    v091Section.includes("period · Q2") &&
    v091Section.includes("limit · cause not established"),
  "examples:claim-source-period-limitation-parity",
);
for (const format of ["web", "pdf", "deck", "social"]) {
  check(v091Section.includes(`v091-format-canvas--${format}`), `examples:cross-format-canvas:${format}`);
}
check(v091Section.includes("schema, release, unit, or grain") && v091Section.includes("incompatibility visible"), "examples:incompatibility-is-valid-result");
check(
  v091Section.includes("v091-motion-frame--rejected") &&
    v091Section.includes("v091-motion-frame--final") &&
    v091Section.includes("Static storyboard"),
  "examples:bounded-rejected-and-recovery",
);
check(v091Section.includes('href="#complete-color-atlas"'), "examples:retained-atlas-linked");
check(v091Section.includes("พื้นที่ B เปลี่ยนมากที่สุดในชุดตัวอย่างนี้") && v091Section.includes("Area B changed most in this fixture"), "examples:parity-claim-bilingual");
check(v091Section.includes("หลักฐานรอ observer") && v091Section.includes("Proof waits for observer"), "examples:rejected-specimen-bilingual");
for (const [id, thaiName, englishName] of [
  ["examples-delta", "สิ่งที่คงไว้และสิ่งที่พัฒนาขึ้น", "What stays and what improves"],
  ["shared-product-layers", "ภาพสถาปัตยกรรม Locale Insight ที่เชื่อมสาม product packs โดยไม่รวมข้อมูล", "Locale Insight architecture linking three distinct product packs without merging their data"],
  ["calm-navigation", "กายวิภาค navigation สถานะเด่นและสงบที่คงเป้าตรงขนาด 44 พิกเซล", "Prominent and calm navigation anatomy preserving direct 44 pixel targets"],
  ["incompatibility", "เข้ากันไม่ได้", "Not compatible"],
  ["retained-color-atlas", "ตัวอย่างสีอัตลักษณ์และ Energy จาก Color Atlas", "Identity and Energy samples from the Color Atlas"],
]) {
  check(
    v091Section.includes(`data-l10n-aria-th="${thaiName}"`) &&
      v091Section.includes(`data-l10n-aria-en="${englishName}"`),
    `examples:locale-correct-accessible-name:${id}`,
  );
}
for (const [id, thaiName, englishName] of [
  ["comparison-controls", "เปรียบเทียบมุมมองที่ต้องแก้กับมุมมองที่ปรับตามหลักแล้ว", "Needs-revision and assisted comparison"],
  ["inspection-lenses", "เลนส์ตรวจแบรนด์", "Brand inspection lenses"],
  ["atmosphere-surfaces", "พื้นผิวบรรยากาศแบรนด์", "Brand atmosphere surfaces"],
]) {
  check(
    html.includes(`data-l10n-aria-th="${thaiName}"`) &&
      html.includes(`data-l10n-aria-en="${englishName}"`),
    `playground:locale-correct-accessible-name:${id}`,
  );
}

// Icon selection stays outlined at every state. The implementation must not hide
// critical content behind motion, even if JavaScript or IntersectionObserver fails.
check(!/['"]FILL['"]\s*1\b/.test(html), "icon:no-fill-axis-one");
check(!/\bFILL 1\b/.test(html), "icon:no-visible-fill-one-guidance");
check(/font-variation-settings:\s*['"]FILL['"] 0,\s*['"]wght['"] 300/.test(html), "icon:fill-zero-weight-300");
check(html.includes("v0.9.1 keeps the glyph outlined in every state"), "icon:implementation-example");
check(!v091Section.includes("data-riddim-reveal"), "motion:v091-critical-cases-visible-in-source");
const authoredMotionRoles = [...html.matchAll(/data-motion-role="([^"]+)"/g)].map((match) => match[1]);
check(authoredMotionRoles.length > 0, "motion:authored-supporting-roles-present");
check(
  authoredMotionRoles.every((role) => ["approach.soft", "approach.inline-start", "approach.inline-end", "media.arrival", "stagger.child"].includes(role)),
  "motion:only-governed-supporting-roles",
);
for (const policy of [
  "reveal.supporting",
  "settle.visible",
  "state.direct",
  "state.disclosure",
  "static.critical",
  "static.evidence",
  "container.orchestrates",
  "contained.inherited",
]) {
  check(html.includes(`"${policy}"`), `motion:policy-vocabulary:${policy}`);
}
for (const family of [
  "critical-content",
  "evidence-and-identity",
  "direct-interaction",
  "native-disclosure",
  "section-introduction",
  "v091-editorial-sequence",
  "teaching-card-sequence",
  "editorial-card-sequence",
  "visible-boundary-settle",
  "component-container",
  "semantic-component-audit",
]) {
  check(html.includes(`"${family}"`), `motion:component-family:${family}`);
}
check(
  html.includes('document.querySelectorAll("main section, main article, main aside, main figure, main details, main form, main table, main [role=\\"tabpanel\\"], main [role=\\"tablist\\"], main [role=\\"group\\"]")'),
  "motion:semantic-component-catchall",
);
check(
  html.includes('root.dataset.motionCoverage = invalid.length ? "invalid" : "complete"') &&
    html.includes("root.dataset.motionCoverageComponents") &&
    html.includes("root.dataset.motionCoverageFamilies") &&
    html.includes("root.dataset.motionCoverageReveal") &&
    html.includes("root.dataset.motionCoverageSettle"),
  "motion:runtime-coverage-receipt",
);
for (const selector of [
  "#takeaway .preflight-copy > h2",
  "#takeaway .preflight-copy > p:not(.preflight-count)",
  "#implementation-library > .container > .library-heading",
]) {
  check(html.includes(`"${selector}"`), `motion:explicit-reading-rhythm:${selector}`);
}
check(
  html.includes("MOTION_REVEAL_GUARD_SELECTOR") &&
    html.includes('node.dataset.motionPolicy = "container.orchestrates"') &&
    html.includes("-safe-child"),
  "motion:protected-descendant-safe-child-ownership",
);
const assignMotionCall = html.lastIndexOf("assignMotionPolicies();");
const initRiddimCall = html.lastIndexOf("initRiddimReveal();");
check(assignMotionCall > 0 && initRiddimCall > assignMotionCall, "motion:coverage-assigned-before-reveal-runtime");
for (const protectedSelector of [".hero-copy", ".hero-media", ".primary-action", "[role=\\\"status\\\"]", "[aria-live]", ".proof-preview", ".truth-lock", ".site-footer"]) {
  check(html.includes(protectedSelector), `motion:protected-critical-selector:${protectedSelector}`);
}
const riddimGroupMatch = html.match(/const RIDDIM_GROUPS\s*=\s*\[([\s\S]*?)\];/);
if (riddimGroupMatch) {
  const groups = riddimGroupMatch[1];
  for (const selector of [".v090-card", ".v091-case", ".atlas-product-card", ".atlas-gradient-card", ".opportunity-card", ".primary-action", "h1"]) {
    check(!groups.includes(selector), `motion:no-broad-or-critical-reveal:${selector}`);
  }
  check(groups.trim() === "" || groups.includes("data-motion-role"), "motion:role-gated-supporting-elements-only");
}
check(
  html.includes('document.querySelectorAll("[data-motion-role]").forEach') &&
    html.includes('node.setAttribute("data-riddim-landed", "")') &&
    html.includes('document.querySelectorAll("[data-motion-policy=\\"settle.visible\\"]").forEach') &&
    html.includes('node.setAttribute("data-motion-settled", "")') &&
    html.includes('root.removeAttribute("data-motion-approach")'),
  "motion:fail-open-lands-every-policy",
);
check(/if \(reducedMotionQuery && reducedMotionQuery\.matches\)\s*\{\s*riddimLandAll\(\)/.test(html), "motion:reduced-motion-fail-open");
check(/if \(!\("IntersectionObserver" in window\)\)\s*\{\s*riddimLandAll\(\)/.test(html), "motion:no-observer-fail-open");
check(/catch \(error\)\s*\{\s*riddimLandAll\(\)/.test(html), "motion:runtime-error-fail-open");
check(
  html.includes('!node.closest("details:not([open])")') &&
    html.includes('host.querySelectorAll("[data-motion-role]")') &&
    html.includes('host.querySelectorAll("[data-motion-policy=\\"settle.visible\\"]")'),
  "motion:disclosure-content-opens-readable",
);
check(html.includes('{ rootMargin: "0px 0px -12% 0px", threshold: 0.14 }'), "motion:governed-observer-window");
check(/@media\s+print[\s\S]*?\[data-motion-role\][\s\S]*?opacity:\s*1\s*!important[\s\S]*?transform:\s*none\s*!important/.test(html), "motion:print-final-state");
check(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\[data-motion-role\][\s\S]*?opacity:\s*1\s*!important[\s\S]*?transform:\s*none\s*!important/.test(html), "motion:reduced-motion-final-state");
check(html.includes("v091-cue") && html.includes("animation-iteration-count: 1"), "motion:finite-discovery-cue");

// Owner-selected r7 candidate: desktop exposes Brand + CityMETER + CityWiki +
// Sign in + Menu. This deliberately exceeds NAV-01's four-control normative cap,
// remains non-conformant, and keeps every direct target at least 44px. Mobile keeps
// Brand + Menu and restores every route plus the CTA inside the disclosure.
const headerStart = html.indexOf('<header class="site-header"');
const headerEnd = html.indexOf("</header>", headerStart);
const header = headerStart >= 0 && headerEnd > headerStart ? html.slice(headerStart, headerEnd) : "";
const headerNav = header.match(/<nav class="header-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
const headerMainLinksStart = header.indexOf('<span class="header-main-links">');
const headerMainLinksEnd = header.indexOf('<span class="nav-cta nav-cta--header">', headerMainLinksStart);
const headerMainLinks = headerMainLinksStart >= 0 && headerMainLinksEnd > headerMainLinksStart
  ? header.slice(headerMainLinksStart, headerMainLinksEnd)
  : "";
const desktopControlCount =
  (header.match(/<a\b[^>]*\bid="home-link"/g) ?? []).length +
  (headerMainLinks.match(/<a\b/g) ?? []).length +
  (headerNav.match(/<a\b[^>]*\bclass="header-cta"/g) ?? []).length +
  (headerNav.match(/<button\b[^>]*\bid="nav-menu-toggle"/g) ?? []).length;
check(header.length > 0, "navigation:site-header-present");
check(headerNav.length > 0, "navigation:header-nav-present");
check(desktopControlCount === 5, "navigation:r7-desktop-five-control-candidate");
check((headerMainLinks.match(/<a\b/g) ?? []).length === 2 && headerMainLinks.includes("CityMETER") && headerMainLinks.includes("CityWiki"), "navigation:r7-direct-product-destinations");
check(headerNav.includes('class="header-cta"') && headerNav.includes("Sign in"), "navigation:sign-in-single-direct-cta");
check(header.includes('class="nav-panel-links"') && header.includes("CityMETER") && header.includes("CityWiki"), "navigation:ecosystem-routes-in-panel");
check(header.includes('id="home-link"') && !/<a\b[^>]*id="home-link"[^>]*aria-current/.test(header), "navigation:brand-not-current-destination");
check(/<a\b[^>]*href="#top"[^>]*aria-current="page"/.test(header), "navigation:ecosystem-current-page-separate");
check(header.includes('class="brand__symbol"') && header.includes('class="brand__wordmark"'), "navigation:brand-symbol-and-wordmark");
check(header.includes('id="nav-menu-toggle"') && header.includes('aria-expanded="false"') && header.includes('aria-controls="nav-panel"'), "navigation:disclosure-button-contract");
check(/id="nav-panel"[^>]*\shidden(?:\s|>)/.test(header), "navigation:panel-source-state");
check(
  /@media\s*\(max-width:\s*680px\)[\s\S]*?\.header-main-links,[\s\S]*?\.nav-cta--header\s*\{\s*display:\s*none/.test(html) &&
    /@media\s*\(max-width:\s*680px\)[\s\S]*?\.nav-panel-mobile-cta\s*\{\s*display:\s*block/.test(html),
  "navigation:mobile-two-control-budget",
);
check(
  /\.brand,[\s\S]{0,180}?\.header-link,[\s\S]{0,180}?\.header-cta,[\s\S]{0,180}?\.nav-menu-toggle[\s\S]{0,180}?min-height:\s*44px/.test(html),
  "navigation:direct-targets-44px",
);
check(
    html.includes("--nav-block-prominent-desktop: 76px") &&
    html.includes("--nav-block-prominent-mobile: 68px") &&
    html.includes("--nav-visual-calm-desktop: 52px") &&
    html.includes("--nav-visual-calm-mobile: 52px") &&
    html.includes("--nav-content-calm-scale: .82") &&
    html.includes("--nav-content-calm-opacity: 1") &&
    html.includes("--nav-surface-calm-alpha: 88%") &&
    html.includes("--nav-state-duration: 560ms"),
  "navigation:r7-adapted-safe-state-anatomy",
);
check(header.includes("ในหน้านี้") && header.includes("Landometer ecosystem") && header.includes("nav-panel-utilities"), "navigation:r7-panel-group-anatomy");
check(header.includes("nav-panel-mobile-cta") && header.includes("https://landometer.com/auth"), "navigation:mobile-cta-restored-in-panel");
check(
  html.includes('data-nav-glyphs="inline-svg"') &&
    /nav-menu-icon__menu[^>]*>[\s\S]*?<path\b[^>]*d="M5 7h14M5 12h14M5 17h14"/.test(header) &&
    /nav-menu-icon__close[^>]*>[\s\S]*?<path\b[^>]*d="m6 6 12 12M18 6 6 18"/.test(header) &&
    html.includes('.nav-menu-toggle[aria-expanded="true"] .nav-menu-icon__close { display: block; }'),
  "navigation:menu-close-inline-svg",
);
check(/event\.key[\s\S]{0,24}?["']Escape["']/.test(html), "navigation:escape-closes-menu");
check(/navMenuToggle\.focus\(|menuToggle\.focus\(/.test(html), "navigation:focus-restored-to-trigger");
check(html.includes('aria-current", "location"') || html.includes("aria-current', 'location'"), "navigation:current-location-separate");
const sideBookmark = html.match(/<nav class="side-bookmark[\s\S]*?<\/nav>/)?.[0] ?? "";
const expectedBookmarkOrder = ["top", "v091-additions", "play", "implementation-library", "complete-color-atlas", "library-resources"];
const bookmarkOrder = [...sideBookmark.matchAll(/data-page-destination="([^"]+)"/g)].map(match => match[1]);
const panelLocal = header.match(/<section class="nav-panel-section nav-panel-local"[\s\S]*?<\/section>/)?.[0] ?? "";
const panelBookmarkOrder = [...panelLocal.matchAll(/data-page-destination="([^"]+)"/g)].map(match => match[1]);
check(JSON.stringify(bookmarkOrder) === JSON.stringify(expectedBookmarkOrder), "navigation:side-bookmark-real-ordered-anchors");
check(JSON.stringify(panelBookmarkOrder) === JSON.stringify(expectedBookmarkOrder), "navigation:mobile-toc-mirrors-side-bookmark");
check((sideBookmark.match(/aria-current="location"/g) ?? []).length === 1, "navigation:side-bookmark-one-source-current");
check(html.includes(".side-bookmark__icon") && html.includes(".side-bookmark__tooltip"), "navigation:side-bookmark-r7-icons-and-tooltips");
check(/\.side-bookmark a\s*\{[\s\S]*?width:\s*44px;[\s\S]*?height:\s*44px;/.test(html), "navigation:side-bookmark-direct-44px-targets");
check(
  (sideBookmark.match(/<svg\b[^>]*class="side-bookmark__icon"/g) ?? []).length === 6 &&
    (sideBookmark.match(/<path\b/g) ?? []).length >= 6 &&
    html.includes(".side-bookmark__icon * { vector-effect: non-scaling-stroke; }") &&
    /\.side-bookmark a\[aria-current="location"\] \.side-bookmark__icon\s*\{[\s\S]*?transform:\s*scale\(1\.08\)/.test(html),
  "navigation:side-bookmark-six-outline-svg-icons",
);
check(
  html.includes(".site-header.is-calm .site-header__row") &&
    html.includes("max-width: none") &&
    !html.includes(".site-header.is-calm .header-nav { gap:") &&
    html.includes(".header-control-visual--cta") &&
    html.includes(".nav-menu-toggle__visual"),
  "navigation:calm-stable-targets-complete-visual-wrappers",
);
check(
  html.includes('fetch(manifestUrl, { cache: "no-store" })') &&
    html.includes('window.addEventListener("pageshow", checkForFreshBuild)') &&
    html.includes('document.addEventListener("visibilitychange"'),
  "navigation:latest-build-freshness-handshake",
);
const atlasPreview = html.match(/<!-- COLOR_ATLAS_PREVIEW_START -->([\s\S]*?)<!-- COLOR_ATLAS_PREVIEW_END -->/)?.[1] ?? "";
const expectedAtlasPreview = [
  ["brand.blue", "#1D4497"],
  ["brand.beige", "#F2F1DF"],
  ["dark.brand.beige", "#D8CFB2"],
  ["energy.sky", "#59D2FE"],
  ["energy.mint", "#0AD69C"],
  ["energy.coral", "#FF5A5F"],
  ["energy.yellow", "#FFBC1F"],
];
check(
  (atlasPreview.match(/class="v091-atlas-ribbon__swatch"/g) ?? []).length === expectedAtlasPreview.length &&
    expectedAtlasPreview.every(([id, value]) => atlasPreview.includes(`data-atlas-token="${id}" data-atlas-value="${value}"`)) &&
    !atlasPreview.includes("--series-"),
  "color-atlas:front-preview-exact-identity-energy-registry",
);
check(/@media\s*\(max-width:\s*600px\),\s*\(max-height:\s*560px\)[\s\S]*?\.side-bookmark\s*\{\s*display:\s*none/.test(html), "navigation:side-bookmark-mobile-degradation");
check(!html.includes("sideBookmark.toggleAttribute(\"data-active\"") && !/\.side-bookmark\[data-active\]/.test(html), "navigation:side-bookmark-never-current-hidden");
check(html.includes('const railLinks = [...document.querySelectorAll(".side-bookmark [data-page-destination]")]'), "navigation:scrollspy-isolates-rail-links");
check(html.includes(".site-header.is-calm::before"), "navigation:calm-state-styled");
check(html.includes('siteHeader.classList.toggle("is-calm", Boolean(calm))'), "navigation:calm-state-runtime");
check(!header.includes("v091-cue"), "navigation:consequential-sign-in-has-no-discovery-sweep");
check(!html.includes("elementFromPoint") && !html.includes("elementsFromPoint"), "navigation:no-coordinate-click-forwarding");

// Output clarity: implementation-facing receipts remain in metadata and release
// records, not in audience-facing page copy.
const audienceText = visibleText(html).toLowerCase();
for (const residue of ["machinevalidation pending", "machine validation pending", "source_limited", "[exception-", "todo", "debug path"]) {
  check(!audienceText.includes(residue), `output-clarity:no-visible-workflow-residue:${residue}`);
}

// Manifest and release records bind every release-critical byte. Machine-package
// identity may be named, but no machine/v0.9.1 byte claim is allowed here.
check(manifest?.artifact?.version === RELEASE.version, "manifest:version");
check(manifest?.artifact?.buildCardVersion === RELEASE.version, "manifest:build-card-version");
check(manifest?.artifact?.manifestVersion === RELEASE.manifestVersion, "manifest:schema-version");
check(manifest?.artifact?.tokenSchemaVersion === RELEASE.tokenSchemaVersion, "manifest:token-schema-version");
check(manifest?.artifact?.authoringRevision === RELEASE.authoringRevision, "manifest:authoring-revision");
check((manifest?.artifact?.rulesetRevision ?? manifest?.artifact?.ruleset) === RELEASE.rulesetRevision, "manifest:ruleset-revision");
check((manifest?.artifact?.machinePackageIdentity ?? manifest?.artifact?.machinePackage) === RELEASE.machinePackageIdentity, "manifest:machine-package-identity-only");
check(manifest?.artifact?.artifactBuildId === RELEASE.artifactBuildId, "manifest:artifact-build");
check(manifest?.artifact?.evidenceStatus === RELEASE.evidenceStatus, "manifest:evidence-status");
check(manifest?.artifact?.machineValidation === RELEASE.machineValidation, "manifest:machine-validation");
check(manifest?.artifact?.indexable === false, "manifest:not-indexable");
check(manifest?.colorDelivery?.registryId === RELEASE.colorSetId, "manifest:color-set");
check(manifest?.colorDelivery?.registryPath === RELEASE.registry, "manifest:color-registry-path");
check(manifest?.colorDelivery?.immutableColorBaseline === RELEASE.historicalBaseline, "manifest:historical-color-baseline");

const manifestBoundFiles = [
  RELEASE.authoringMaster,
  RELEASE.registry,
  RELEASE.latest,
  RELEASE.immutableUi,
  RELEASE.previousImmutableUi,
  RELEASE.earlierImmutableUi,
  RELEASE.initialImmutableUi,
  RELEASE.predecessorImmutableUi,
  RELEASE.originImmutableUi,
  RELEASE.legacyImmutableUi,
  RELEASE.oldestImmutableUi,
  RELEASE.historicalBaseline,
  RELEASE.buildCard,
  RELEASE.implementationNotes,
  RELEASE.automatedQa,
  RELEASE.manualQa,
  "font-assets.manifest.json",
  "assets/fonts/material-symbols-rounded-nav-300.woff2",
  "assets/fonts/licenses/material-symbols-Apache-2.0.txt",
];
for (const relativePath of manifestBoundFiles) {
  check(manifestAssetMatches(manifest, relativePath), `manifest:file-record:${relativePath}`);
}
check(!(manifest?.assets ?? []).some((asset) => /^machine\/v0\.9\.1\//.test(asset.path)), "manifest:no-v091-machine-package-byte-claim");
check(!existsSync(deploymentPath("machine/v0.9.1")), "release:no-v091-machine-package-directory");
check(sha256(deploymentPath("assets/fonts/material-symbols-rounded-nav-300.woff2")) === RELEASE.navFontSha256, "font:approved-nav-subset-known-hash");
check(sha256(deploymentPath("assets/fonts/licenses/material-symbols-Apache-2.0.txt")) === RELEASE.navFontLicenseSha256, "font:approved-nav-subset-license-known-hash");
const fontManifest = readJson(deploymentPath("font-assets.manifest.json"), "parse:font-assets-manifest");
const navFontFace = fontManifest?.faces?.find(face => face.file === "assets/fonts/material-symbols-rounded-nav-300.woff2");
check(navFontFace?.sha256 === RELEASE.navFontSha256, "font:nav-subset-manifest-hash");
check(navFontFace?.licenseFile === "assets/fonts/licenses/material-symbols-Apache-2.0.txt", "font:nav-subset-license-binding");

for (const [name, source] of [
  ["build-card", buildCard],
  ["implementation-notes", implementationNotes],
  ["manual-qa", manualQa],
  ["automated-qa", JSON.stringify(automatedQa)],
]) {
  check(source.includes(RELEASE.version), `release-record:${name}:version`);
  check(source.includes(RELEASE.authoringRevision), `release-record:${name}:authoring-revision`);
  check(source.includes(RELEASE.artifactBuildId), `release-record:${name}:artifact-build`);
  check(source.includes(RELEASE.colorSetId), `release-record:${name}:color-set`);
}
check(buildCard.includes(RELEASE.rulesetRevision), "release-record:build-card:ruleset");
check(buildCard.includes(RELEASE.machinePackageIdentity), "release-record:build-card:machine-package-identity");

// Latest and immutable standalones differ only by their channel receipt. Embedded
// display assets, noncanonical behavior, and self-contained font delivery are fixed.
check(normalizeBuildChannel(latestHtml) === normalizeBuildChannel(immutableHtml), "standalone:latest-immutable-parity");
check(!/<link\s+rel="canonical"\b/i.test(latestHtml), "standalone:latest-noncanonical");
check(!/<link\s+rel="canonical"\b/i.test(immutableHtml), "standalone:immutable-noncanonical");
check((latestHtml.match(/data:font\/woff2;base64,/g) ?? []).length === 11, "standalone:eleven-embedded-font-faces");
check(latestHtml.includes("data:image/png;base64,"), "standalone:embedded-logo");
check(latestHtml.includes("data:image/jpeg;base64,"), "standalone:embedded-team-image");
check(/<link\b[^>]*\brel="icon"[^>]*\bhref="data:image\/png;base64,/i.test(latestHtml), "standalone:embedded-browser-tab-icon");
check(!/(?:src|href)="assets\//.test(latestHtml), "standalone:no-relative-display-assets");

// CI deploy and live-byte verification must point at this exact release. Every
// critical asset is both present and hash-bound in the release manifest.
check(workflow.includes('TARGET_VERSION: "0.9.1"'), "workflow:target-version");
check(workflow.includes("MANIFEST_PATH: site-manifest.v0.9.1.json"), "workflow:manifest-path");
check(workflow.includes(`EXPECTED_ARTIFACT_BUILD: ${RELEASE.artifactBuildId}`), "workflow:artifact-build");
check(workflow.includes("EXPECTED_EVIDENCE_STATUS: source_limited"), "workflow:evidence-status");
check(workflow.includes("EXPECTED_MACHINE_VALIDATION: pending"), "workflow:machine-validation");
const renderedArtifactFlag = `--artifact ${RELEASE.immutableUi}`;
check(
  (renderedWorkflow.match(new RegExp(escapeRegExp(renderedArtifactFlag), "g")) ?? []).length === 3,
  "workflow:rendered-checks-pin-current-immutable",
);
check(
  !renderedWorkflow.includes(`--artifact ${RELEASE.previousImmutableUi}`),
  "workflow:rendered-checks-do-not-pin-previous-immutable",
);
const criticalMatch = workflow.match(/CRITICAL_ASSETS:\s*>-([\s\S]*?)\n\s*run:/);
check(Boolean(criticalMatch), "workflow:critical-assets-present");
if (criticalMatch) {
  const critical = criticalMatch[1].split(",").map((item) => item.trim()).filter(Boolean);
  for (const required of manifestBoundFiles) check(critical.includes(required), `workflow:release-critical:${required}`);
  for (const relativePath of critical) {
    check(existsSync(deploymentPath(relativePath)), `workflow:critical-present:${relativePath}`);
    check(manifestAssetMatches(manifest, relativePath), `workflow:critical-manifest-record:${relativePath}`);
  }
  check(!critical.some((relativePath) => /^machine\/v0\.9\.1\//.test(relativePath)), "workflow:no-v091-machine-package-byte-claim");
}

// A release branch must not introduce temporary transport archives or
// interrupted atomic-write residue. These two versioned v0.8.6 downloads are
// retained public historical artifacts, so keep their exact paths explicit
// instead of weakening the archive rule for future files.
const retainedHistoricalArchives = new Set([
  "deployment/assets/downloads/apply-landometer-design-system-v0.8.6-public.2.zip",
  "deployment/assets/downloads/landometer-ds-v0.8.6-starter.zip",
]);
for (const relativePath of walkFiles(repositoryRoot)) {
  check(!/(?:^|\/)\.DS_Store$/.test(relativePath), `hygiene:no-ds-store:${relativePath}`);
  check(!/(?:\.tmp-\d+|\.swp|~)$/.test(relativePath), `hygiene:no-temp-file:${relativePath}`);
  check(
    retainedHistoricalArchives.has(relativePath) || !/\.(?:zip|tgz|7z|tar|tar\.gz)$/i.test(relativePath),
    `hygiene:no-transport-archive:${relativePath}`,
  );
}

// Reuse deterministic retained-color and standalone checks. The v0.9.0 machine
// package validator is intentionally not invoked: it requires an undeclared YAML
// dependency and is outside this v0.9.1 web-artifact release boundary.
runNodeCheck("tools/check-gradient-contrast.mjs", ["--check"], "generator:retained-gradient-contrast");
runNodeCheck("tools/generate-color-atlas.mjs", ["--check-index"], "generator:retained-color-atlas");
runNodeCheck("tools/build-standalone-html.mjs", ["--check"], "generator:v091-standalone");

if (failures.length > 0) {
  console.error(`v0.9.1 release validation FAIL (${failures.length}/${checkCount})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`v0.9.1 release validation PASS (${checkCount} checks)`);
