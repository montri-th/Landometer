import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const repositoryRoot = resolve(import.meta.dirname, "..");
const deploymentRoot = resolve(repositoryRoot, "deployment");

const RELEASE = Object.freeze({
  version: "0.9.0",
  authoringRevision: "v0.9.0-r6",
  manifestVersion: "2.1",
  tokenSchemaVersion: 6,
  colorSetId: "color-srgb-05",
  gradientSchema: "landometer-atmosphere-gradient-v2",
  artifactBuildId: "ui-20260821-04",
  latest: "landometer-design-system-v0.9.0-standalone.html",
  baseline: "landometer-design-system-v0.9.0-standalone.color-srgb-05.html",
  immutableUi:
    "landometer-design-system-v0.9.0-standalone.color-srgb-05.ui-20260821-04.html",
  authoringMaster: "assets/downloads/landometer-design-system-v0.9.0.md",
  skillMaster:
    "skill/apply-landometer-design-system-v0-9-0/references/landometer-design-system-v0.9.0-authoring-master.md",
  proposal:
    "normative-patches/landometer-design-system-v0.9.0.proposal.md",
  approval:
    "normative-patches/landometer-design-system-v0.9.0.approval.yml",
  registry: "assets/data/color-delivery.v0.9.0.json",
  contrastEvidence: "qa/v0.9.0-gradient-contrast.json",
  scaleEvidence: "qa/v0.9.0-scale-geometry.json",
  containerFitEvidence: "qa/v0.9.0-container-fit.json",
  affordanceEvidence: "qa/v0.9.0-rendered-affordances.json",
  manifest: "site-manifest.v0.9.0.json",
  buildCard: "build-card.v0.9.0.yml",
});

const EXPECTED_GRADIENTS = Object.freeze({
  "atmosphere.gradient.measure.deep": {
    stops: [["#1D4497", "0%"], ["#176B82", "54%"], ["#08756F", "100%"]],
    contract: "surfaceForeground.onDeep",
  },
  "atmosphere.gradient.measure.luminous": {
    stops: [["#89CEF6", "0%"], ["#5ECAD6", "50%"], ["#6CD5B3", "100%"]],
    contract: "surfaceForeground.onLight",
  },
  "atmosphere.gradient.ground.current": {
    stops: [["#0F5773", "0%"], ["#006A6A", "50%"], ["#1F744F", "100%"]],
    contract: "surfaceForeground.onDeep",
  },
  "atmosphere.gradient.ground.mist": {
    stops: [["#C4E0EE", "0%"], ["#B2E2E2", "50%"], ["#CCE6D0", "100%"]],
    contract: "surfaceForeground.onLight",
  },
  "atmosphere.gradient.cultivate.glow": {
    stops: [["#EB8182", "0%"], ["#F5A06F", "50%"], ["#EBC573", "100%"]],
    contract: "surfaceForeground.onLight",
  },
  "atmosphere.gradient.cultivate.mist": {
    stops: [["#F7CBC7", "0%"], ["#FBD1B6", "50%"], ["#F1E0B4", "100%"]],
    contract: "surfaceForeground.onLight",
  },
  "atmosphere.gradient.diversity.spectrum": {
    stops: [["#89CEF6", "0%"], ["#6CD5B3", "34%"], ["#EBC573", "67%"], ["#EB8182", "100%"]],
    contract: "surfaceForeground.onLight",
  },
});

const EXPECTED_GRADIENT_ONLY_COLORS = Object.freeze([
  "#89CEF6", "#5ECAD6", "#6CD5B3",
  "#0F5773", "#006A6A", "#1F744F",
  "#C4E0EE", "#B2E2E2", "#CCE6D0",
  "#EB8182", "#F5A06F", "#EBC573",
  "#F7CBC7", "#FBD1B6", "#F1E0B4",
]);

const EXPECTED_DEFAULTS = Object.freeze({
  light: {
    measure: "atmosphere.gradient.measure.deep",
    ground: "atmosphere.gradient.ground.mist",
    cultivate: "atmosphere.gradient.cultivate.glow",
  },
  dark: {
    measure: "atmosphere.gradient.measure.luminous",
    ground: "atmosphere.gradient.ground.current",
    cultivate: "atmosphere.gradient.cultivate.mist",
  },
});

const failures = [];
let checkCount = 0;

function check(condition, id, detail = "") {
  checkCount += 1;
  if (!condition) failures.push(detail ? `${id}: ${detail}` : id);
}

function repoPath(path) {
  return resolve(repositoryRoot, path);
}

function deploymentPath(path) {
  return resolve(deploymentRoot, path);
}

function readAbsolute(path) {
  return readFileSync(path);
}

function readUtf8Absolute(path) {
  return readFileSync(path, "utf8");
}

function readDeployment(path) {
  return readUtf8Absolute(deploymentPath(path));
}

function readRepository(path) {
  return readUtf8Absolute(repoPath(path));
}

function readJsonAbsolute(path, id) {
  try {
    return JSON.parse(readUtf8Absolute(path));
  } catch (error) {
    check(false, id, error.message);
    return null;
  }
}

function sha256Absolute(path) {
  return createHash("sha256").update(readAbsolute(path)).digest("hex");
}

function fileRecordAbsolute(path) {
  return {
    bytes: statSync(path).size,
    sha256: sha256Absolute(path),
  };
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasAttribute(source, name, value) {
  return new RegExp(
    `\\b${escapeRegExp(name)}\\s*=\\s*(?:"${escapeRegExp(value)}"|'${escapeRegExp(value)}')`,
    "i",
  ).test(source);
}

function topLevelYamlBlock(source, key) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex(line => line === `${key}:`);
  if (start < 0) return "";
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() && line === line.trimStart()) break;
    end += 1;
  }
  return lines.slice(start, end).join("\n");
}

function yamlPathWindows(source, path, radius = 520) {
  const needle = `path: ${path}`;
  const windows = [];
  let offset = 0;
  while ((offset = source.indexOf(needle, offset)) >= 0) {
    windows.push(source.slice(offset, offset + radius));
    offset += needle.length;
  }
  return windows;
}

function yamlHasFileRecord(source, path, record) {
  return yamlPathWindows(source, path).some(window =>
    new RegExp(`\\bbytes:\\s*${record.bytes}\\b`).test(window) &&
    new RegExp(`\\bsha256:\\s*${record.sha256}\\b`).test(window),
  );
}

function manifestAsset(manifest, path) {
  return manifest?.assets?.find(asset => asset.path === path) ?? null;
}

function manifestAssetMatches(manifest, path, record) {
  const asset = manifestAsset(manifest, path);
  return Boolean(
    asset && asset.bytes === record.bytes && asset.sha256 === record.sha256,
  );
}

function normalizeBuildChannel(source) {
  return source.replace(
    /data-build-channel=("|')[^"']+("|')/,
    'data-build-channel="normalized"',
  );
}

function fontFaceBlocks(source) {
  return [...source.matchAll(/@font-face\s*\{([\s\S]*?)\}/g)].map(match => match[1]);
}

function faceWeight(block) {
  return Number(block.match(/font-weight:\s*(\d+)/)?.[1] ?? NaN);
}

function faceFamily(block) {
  return block.match(/font-family:\s*["']([^"']+)["']/)?.[1] ?? "";
}

function runNodeCheck(script, args, id) {
  const result = spawnSync(process.execPath, [resolve(repositoryRoot, script), ...args], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  check(result.status === 0, id, output.split(/\r?\n/).slice(-3).join(" | "));
}

const requiredRepositoryFiles = [
  "deployment/index.html",
  `deployment/${RELEASE.latest}`,
  `deployment/${RELEASE.baseline}`,
  `deployment/${RELEASE.immutableUi}`,
  `deployment/${RELEASE.authoringMaster}`,
  RELEASE.skillMaster,
  RELEASE.proposal,
  RELEASE.approval,
  `deployment/${RELEASE.registry}`,
  `deployment/${RELEASE.contrastEvidence}`,
  `deployment/${RELEASE.scaleEvidence}`,
  `deployment/${RELEASE.containerFitEvidence}`,
  `deployment/${RELEASE.affordanceEvidence}`,
  `deployment/${RELEASE.manifest}`,
  `deployment/${RELEASE.buildCard}`,
  "deployment/font-assets.manifest.json",
  "deployment/assets/fonts/ibm-plex-sans-thai-thai-400-normal.woff2",
  "deployment/assets/fonts/jetbrains-mono-latin-400-normal.woff2",
  "tools/build-standalone-html.mjs",
  "tools/check-gradient-contrast.mjs",
  "tools/generate-color-atlas.mjs",
];

for (const path of requiredRepositoryFiles) {
  check(existsSync(repoPath(path)), `required-file:${path}`);
}

if (failures.length > 0) {
  console.error(`v0.9.0 release validation FAIL (${failures.length}/${checkCount})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const html = readDeployment("index.html");
const latestHtml = readDeployment(RELEASE.latest);
const baselineHtml = readDeployment(RELEASE.baseline);
const immutableUiHtml = readDeployment(RELEASE.immutableUi);
const authoringMaster = readDeployment(RELEASE.authoringMaster);
const skillMaster = readRepository(RELEASE.skillMaster);
const proposal = readRepository(RELEASE.proposal);
const approval = readRepository(RELEASE.approval);
const registry = readJsonAbsolute(
  deploymentPath(RELEASE.registry),
  "parse:color-registry",
);
const contrast = readJsonAbsolute(
  deploymentPath(RELEASE.contrastEvidence),
  "parse:gradient-contrast",
);
const scaleEvidence = readJsonAbsolute(
  deploymentPath(RELEASE.scaleEvidence),
  "parse:scale-geometry",
);
const manifest = readJsonAbsolute(
  deploymentPath(RELEASE.manifest),
  "parse:site-manifest",
);
const fontManifest = readJsonAbsolute(
  deploymentPath("font-assets.manifest.json"),
  "parse:font-manifest",
);
const buildCard = readDeployment(RELEASE.buildCard);

// Release identity is repeated in every machine-consumed surface.
const baselineMintedWithBuild =
  registry?.artifactBuilds?.find(r => r.path === RELEASE.baseline)?.mintedWithArtifactBuild
  ?? RELEASE.artifactBuildId;
for (const [channel, source, expectedChannel, expectedBuild] of [
  ["hosted", html, "latest-alias", RELEASE.artifactBuildId],
  ["latest", latestHtml, "latest-alias", RELEASE.artifactBuildId],
  // the Color Set baseline keeps the build id it was minted with; a later UI-only
  // change mints a new artifact build without rewriting the baseline
  ["baseline", baselineHtml, "immutable-color-set", baselineMintedWithBuild],
  ["immutable-ui", immutableUiHtml, "immutable-artifact-build", RELEASE.artifactBuildId],
]) {
  check(hasAttribute(source, "data-ds-version", RELEASE.version), `identity:${channel}:version`);
  check(hasAttribute(source, "data-color-registry", RELEASE.colorSetId), `identity:${channel}:color-set`);
  check(hasAttribute(source, "data-atmosphere-gradient-registry", RELEASE.gradientSchema), `identity:${channel}:gradient-schema`);
  check(hasAttribute(source, "data-artifact-build", expectedBuild), `identity:${channel}:artifact-build`);
  check(hasAttribute(source, "data-build-channel", expectedChannel), `identity:${channel}:build-channel`);
  check(hasAttribute(source, "data-machine-validation", "pending"), `identity:${channel}:machine-validation`);
  check(hasAttribute(source, "data-evidence-status", "source_limited"), `identity:${channel}:evidence-status`);
}
check(hasAttribute(latestHtml, "data-standalone", "true"), "identity:latest:self-contained-marker");
check(hasAttribute(baselineHtml, "data-standalone", "true"), "identity:baseline:self-contained-marker");
check(hasAttribute(immutableUiHtml, "data-standalone", "true"), "identity:immutable-ui:self-contained-marker");

// The active master and the skill-bound master must be the same immutable bytes.
const masterRecord = fileRecordAbsolute(deploymentPath(RELEASE.authoringMaster));
check(Buffer.compare(readAbsolute(deploymentPath(RELEASE.authoringMaster)), readAbsolute(repoPath(RELEASE.skillMaster))) === 0, "normative:master-byte-parity");
check(masterRecord.sha256 === sha256Absolute(repoPath(RELEASE.skillMaster)), "normative:master-hash-parity");
check(authoringMaster.includes("**Release:** v0.9.0"), "normative:master-version");
check(authoringMaster.includes("**Authoring revision:** v0.9.0-r6"), "normative:master-revision");
check(authoringMaster.includes("Let us cultivate our city with data."), "normative:brand-line-with-data");

// Approval binds the exact proposal and integrated master while leaving artifact gates truthful.
const proposalRecord = fileRecordAbsolute(repoPath(RELEASE.proposal));
const approvedProposal = topLevelYamlBlock(approval, "approvedProposal");
const approvedMaster = topLevelYamlBlock(approval, "integratedAuthoringMaster");
check(/^decision:\s*approved_for_authoring_integration$/m.test(approval), "approval:decision");
check(/^publicationAuthorized:\s*true$/m.test(approval), "approval:publication-authorized");
check(/^artifactMachineValidation:\s*pending_until_artifact_gates_pass$/m.test(approval), "approval:artifact-boundary");
check(approvedProposal.includes(`path: ${RELEASE.proposal}`), "approval:proposal-path");
check(approvedProposal.includes(`bytes: ${proposalRecord.bytes}`), "approval:proposal-bytes");
check(approvedProposal.includes(`sha256: ${proposalRecord.sha256}`), "approval:proposal-hash");
check(approvedMaster.includes(`path: deployment/${RELEASE.authoringMaster}`), "approval:master-path");
check(approvedMaster.includes(`authoringRevision: ${RELEASE.authoringRevision}`), "approval:master-revision");
check(approvedMaster.includes(`bytes: ${masterRecord.bytes}`), "approval:master-bytes");
check(approvedMaster.includes(`sha256: ${masterRecord.sha256}`), "approval:master-hash");
for (const id of Object.keys(EXPECTED_GRADIENTS)) {
  check(proposal.includes(`\`${id}\``), `proposal:gradient:${id}`);
}
for (const color of EXPECTED_GRADIENT_ONLY_COLORS) {
  check(proposal.includes(`\`${color}\``), `proposal:gradient-only:${color}`);
}

// The registry is the only source for the shared atmosphere family.
check(registry?.meta?.id === RELEASE.colorSetId, "registry:color-set");
check(registry?.meta?.designSystemVersion === RELEASE.version, "registry:version");
check(registry?.meta?.authoringRevision === RELEASE.authoringRevision, "registry:revision");
check(registry?.meta?.currentArtifactBuild?.id === RELEASE.artifactBuildId, "registry:artifact-build");
check(registry?.meta?.immutableColorBaseline === RELEASE.baseline, "registry:baseline-path");
check(registry?.meta?.currentArtifactBuild?.immutableStandalone === RELEASE.immutableUi, "registry:immutable-ui-path");
check(registry?.gradientRegistry?.schema === RELEASE.gradientSchema, "registry:gradient-schema");
check(registry?.gradientRegistry?.runtimeGeneration === "prohibited", "registry:no-runtime-generation");
check(registry?.gradientRegistry?.newValuesSolidUse === "prohibited", "registry:no-solid-promotion");
check(Array.isArray(registry?.sharedAtmosphereGradients) && registry.sharedAtmosphereGradients.length === 7, "registry:seven-shared-gradients");

for (const [id, expected] of Object.entries(EXPECTED_GRADIENTS)) {
  const actual = registry?.sharedAtmosphereGradients?.find(item => item.id === id);
  check(Boolean(actual), `registry:gradient-present:${id}`);
  check(actual?.angle === "135deg", `registry:gradient-angle:${id}`);
  check(deepEqual(actual?.stops, expected.stops), `registry:gradient-stops:${id}`);
  check(actual?.foreground?.contract === expected.contract, `registry:foreground-contract:${id}`);
  check(actual?.foreground?.minimumContrast === 4.5, `registry:contrast-floor:${id}`);
}

const actualStopColors = registry?.gradientOnlyColors?.map(item => item.value) ?? [];
check(actualStopColors.length === 15, "registry:fifteen-gradient-only-colors");
check(deepEqual([...actualStopColors].sort(), [...EXPECTED_GRADIENT_ONLY_COLORS].sort()), "registry:exact-gradient-only-ledger");
check((registry?.gradientOnlyColors ?? []).every(item =>
  item.role === "gradient_stop_only" &&
  item.scope === "shared_atmosphere" &&
  item.solidUse === "prohibited"
), "registry:gradient-only-boundary");
check(deepEqual(registry?.atmosphereThemeDefaults, EXPECTED_DEFAULTS), "registry:exact-theme-defaults");
check(registry?.motifGradients?.brandSignature?.aliasOf === "atmosphere.gradient.measure.deep", "registry:brand-signature-alias");
check(registry?.deprecatedAliases?.["signature.gradient.closing.light"] === "atmosphere.gradient.measure.deep", "registry:closing-light-alias");
check(registry?.deprecatedAliases?.["signature.gradient.closing.dark"] === "atmosphere.gradient.measure.luminous", "registry:closing-dark-alias");
const motifCount = Object.keys(registry?.motifGradients ?? {}).length;
const productThemeRecordCount = Object.values(registry?.productIdentityGradients ?? {})
  .reduce((sum, product) => sum + Number(Array.isArray(product?.light)) + Number(Array.isArray(product?.dark)), 0);
check(motifCount === 3, "registry:three-motif-records");
check(productThemeRecordCount === 8, "registry:eight-product-theme-records");
check((registry?.sharedAtmosphereGradients?.length ?? 0) + motifCount + productThemeRecordCount === 18, "registry:eighteen-total-gradient-records");
check(registry?.rareUsage?.diversity?.maximumPerLongRoute === 1, "registry:diversity-once-per-long-route");

for (const source of ["authoringMaster", "tokenRegistry", "scaleRegistry"]) {
  const record = registry?.sources?.[source];
  if (!record?.path) {
    check(false, `registry:source:${source}`);
    continue;
  }
  const absolute = deploymentPath(record.path);
  check(existsSync(absolute), `registry:source-exists:${source}`);
  if (existsSync(absolute)) {
    check(record.sha256 === sha256Absolute(absolute), `registry:source-hash:${source}`);
    if (record.bytes !== undefined) check(record.bytes === statSync(absolute).size, `registry:source-bytes:${source}`);
  }
}

// Token-level contrast evidence must be bound to the exact registry bytes.
const registryRecord = fileRecordAbsolute(deploymentPath(RELEASE.registry));
check(contrast?.designSystemVersion === RELEASE.version, "contrast:version");
check(contrast?.authoringRevision === RELEASE.authoringRevision, "contrast:revision");
check(contrast?.colorRegistryId === RELEASE.colorSetId, "contrast:color-set");
check(contrast?.gradientRegistrySchema === RELEASE.gradientSchema, "contrast:gradient-schema");
check(contrast?.registryPath === RELEASE.registry, "contrast:registry-path");
check(contrast?.registrySha256 === registryRecord.sha256, "contrast:registry-hash");
check(contrast?.status === "passed", "contrast:passed-status");
check(contrast?.totals?.gradients === 7, "contrast:seven-gradients");
check(contrast?.totals?.contrastComparisons === 14014, "contrast:14014-comparisons");
check(contrast?.totals?.failures === 0, "contrast:zero-failures");
check(Array.isArray(contrast?.results) && contrast.results.length === 7, "contrast:seven-results");
check((contrast?.results ?? []).every(result =>
  result.passed === true &&
  result.sampleCount === 1001 &&
  result.primary?.minimumRatio >= 4.5 &&
  result.secondary?.minimumRatio >= 4.5
), "contrast:all-sampled-foregrounds-pass");
check(deepEqual(
  [...(contrast?.results ?? []).map(result => result.id)].sort(),
  [...Object.keys(EXPECTED_GRADIENTS)].sort(),
), "contrast:exact-gradient-coverage");

// Immutable build records bind bytes and hashes; aliases differ only by channel marker.
const artifactExpectations = [
  { path: RELEASE.baseline, id: "color-baseline-20260821", role: "immutable_color_baseline", colorSet: RELEASE.colorSetId },
  { path: RELEASE.immutableUi, id: RELEASE.artifactBuildId, role: "immutable_ui_build", colorSet: RELEASE.colorSetId },
  // frozen color-srgb-04 evidence: superseded by the token-source mint, never redefined
  { path: "landometer-design-system-v0.9.0-standalone.color-srgb-04.html", id: "color-baseline-20260820-02", role: "immutable_color_baseline", colorSet: "color-srgb-04" },
  { path: "landometer-design-system-v0.9.0-standalone.color-srgb-04.ui-20260821-02.html", id: "ui-20260821-02", role: "immutable_ui_build", colorSet: "color-srgb-04" },
  { path: "landometer-design-system-v0.9.0-standalone.color-srgb-04.ui-20260821-01.html", id: "ui-20260821-01", role: "immutable_ui_build", colorSet: "color-srgb-04" },
  { path: "landometer-design-system-v0.9.0-standalone.color-srgb-04.ui-20260820-02.html", id: "ui-20260820-02", role: "immutable_ui_build", colorSet: "color-srgb-04" },
  // frozen color-srgb-03 evidence: never redefined, still byte-verified against disk
  { path: "landometer-design-system-v0.9.0-standalone.color-srgb-03.html", id: "color-baseline-20260820", role: "immutable_color_baseline", colorSet: "color-srgb-03" },
  { path: "landometer-design-system-v0.9.0-standalone.color-srgb-03.ui-20260820-01.html", id: "ui-20260820-01", role: "immutable_ui_build", colorSet: "color-srgb-03" },
];
for (const expected of artifactExpectations) {
  const actualFile = fileRecordAbsolute(deploymentPath(expected.path));
  const record = registry?.artifactBuilds?.find(item => item.path === expected.path);
  check(Boolean(record), `artifact-record:${expected.path}`);
  check(record?.id === expected.id, `artifact-record-id:${expected.path}`);
  check(record?.role === expected.role, `artifact-record-role:${expected.path}`);
  check(record?.colorRegistryId === expected.colorSet, `artifact-record-color-set:${expected.path}`);
  check(record?.status === "append_only", `artifact-record-append-only:${expected.path}`);
  check(record?.bytes === actualFile.bytes, `artifact-record-bytes:${expected.path}`);
  check(record?.sha256 === actualFile.sha256, `artifact-record-hash:${expected.path}`);
}
check((registry?.artifactBuilds ?? []).length === 8, "artifact-record:six-frozen-plus-two-current");
check(normalizeBuildChannel(latestHtml) === normalizeBuildChannel(immutableUiHtml), "artifact-parity:latest-to-immutable-ui");
// A Color Set baseline is never rewritten for a later UI-only change, so it stays byte-identical
// to the UI build it was minted with — not to whatever the current build is.
{
  const baselineRecord = registry?.artifactBuilds?.find(r => r.path === RELEASE.baseline);
  const mintedWith = baselineRecord?.mintedWithArtifactBuild ?? RELEASE.artifactBuildId;
  check(typeof mintedWith === "string" && mintedWith.length > 0, "artifact-parity:baseline-minted-with-declared");
  if (mintedWith === RELEASE.artifactBuildId) {
    check(normalizeBuildChannel(baselineHtml) === normalizeBuildChannel(immutableUiHtml), "artifact-parity:baseline-to-immutable-ui");
  } else {
    const mintedPath = deploymentPath(`landometer-design-system-v0.9.0-standalone.${RELEASE.colorSetId}.${mintedWith}.html`);
    check(existsSync(mintedPath), "artifact-parity:baseline-minting-build-present");
    if (existsSync(mintedPath)) {
      check(
        normalizeBuildChannel(baselineHtml) === normalizeBuildChannel(readUtf8Absolute(mintedPath)),
        "artifact-parity:baseline-to-minting-ui-build",
      );
    }
  }
}
check(!latestHtml.includes('<link rel="canonical"'), "standalone:noncanonical-latest");
check(!immutableUiHtml.includes('<link rel="canonical"'), "standalone:noncanonical-immutable-ui");
check((latestHtml.match(/data:font\/woff2;base64,/g) ?? []).length >= 9, "standalone:embedded-fonts");
check(latestHtml.includes("data:image/png;base64,"), "standalone:embedded-png");
check(latestHtml.includes("data:image/jpeg;base64,"), "standalone:embedded-jpeg");

// Geometry evidence is bound to the current immutable artifact and remains fail-closed.
const immutableUiRecord = fileRecordAbsolute(deploymentPath(RELEASE.immutableUi));
check(scaleEvidence?.artifactPath === RELEASE.immutableUi, "geometry:artifact-path");
check(scaleEvidence?.artifactBuildId === RELEASE.artifactBuildId, "geometry:artifact-build");
check(scaleEvidence?.artifactSha256 === immutableUiRecord.sha256, "geometry:artifact-hash");
check(scaleEvidence?.totals?.cases === 36, "geometry:36-cases");
check(scaleEvidence?.totals?.rows === 2916, "geometry:2916-rows");
check(scaleEvidence?.totals?.failures === 0, "geometry:zero-failures");

// The manifest repeats release truth and reconciles every release-critical file.
check(manifest?.artifact?.version === RELEASE.version, "manifest:version");
check(manifest?.artifact?.buildCardVersion === RELEASE.version, "manifest:build-card-version");
check(manifest?.artifact?.manifestVersion === RELEASE.manifestVersion, "manifest:schema");
check(manifest?.artifact?.tokenSchemaVersion === RELEASE.tokenSchemaVersion, "manifest:token-schema");
check(manifest?.artifact?.artifactBuildId === RELEASE.artifactBuildId, "manifest:artifact-build");
check(manifest?.artifact?.evidenceStatus === "source_limited", "manifest:source-limited");
check(manifest?.artifact?.machineValidation === "pending", "manifest:machine-validation-pending");
check(manifest?.artifact?.indexable === false, "manifest:not-indexable");
check(manifest?.colorDelivery?.registryId === RELEASE.colorSetId, "manifest:color-set");
check(manifest?.colorDelivery?.atmosphereGradientRegistry?.id === RELEASE.gradientSchema, "manifest:gradient-schema");
check(manifest?.colorDelivery?.atmosphereGradientRegistry?.authoringRevision === RELEASE.authoringRevision, "manifest:revision");
check(manifest?.colorDelivery?.atmosphereGradientRegistry?.gradientStopOnlyValueCount === 15, "manifest:fifteen-gradient-colors");
check(manifest?.colorDelivery?.atmosphereGradientRegistry?.recordCoverage?.total === 18, "manifest:eighteen-gradient-records");
check(manifest?.colorDelivery?.atmosphereGradientRegistry?.contrastEvidencePath === RELEASE.contrastEvidence, "manifest:contrast-path");
check(manifest?.colorDelivery?.atmosphereGradientRegistry?.motifAlias?.includes("54% midpoint"), "manifest:motif-alias-boundary");
check(manifest?.qa?.gradientContrastEvidencePath === RELEASE.contrastEvidence, "manifest:qa-contrast-path");
check(manifest?.qa?.machineValidation === "pending", "manifest:qa-pending");

const manifestFilePaths = [
  RELEASE.authoringMaster,
  RELEASE.registry,
  RELEASE.latest,
  RELEASE.baseline,
  RELEASE.immutableUi,
  RELEASE.contrastEvidence,
  RELEASE.scaleEvidence,
];
for (const path of manifestFilePaths) {
  check(
    manifestAssetMatches(manifest, path, fileRecordAbsolute(deploymentPath(path))),
    `manifest:file-record:${path}`,
  );
}
// [CONTAINER-FIT-01] / SC-20 — rendered container-fit evidence must exist, be bound to
// THIS build and revision, and carry zero failures. Source review cannot discharge SC-20.
{
  const fit = readJsonAbsolute(deploymentPath(RELEASE.containerFitEvidence), "container-fit:parse");
  check(fit?.rule === "[CONTAINER-FIT-01]", "container-fit:rule");
  check(fit?.selfCheckItem === "SC-20", "container-fit:self-check-item");
  check(fit?.artifactBuild === RELEASE.artifactBuildId, "container-fit:artifact-build");
  check(fit?.colorRegistryId === RELEASE.colorSetId, "container-fit:color-set");
  check(fit?.authoringRevision === RELEASE.authoringRevision, "container-fit:revision");
  check(fit?.totals?.failures === 0, "container-fit:zero-failures");
  check((fit?.totals?.cases ?? 0) >= 8, "container-fit:breakpoint-and-theme-coverage");
  check((fit?.totals?.containersMeasured ?? 0) > 0, "container-fit:containers-measured");
  check(Array.isArray(fit?.scope?.themes) && fit.scope.themes.includes("light") && fit.scope.themes.includes("dark"), "container-fit:both-visual-baselines");
  check(typeof fit?.boundary === "string" && fit.boundary.length > 0, "container-fit:boundary-stated");
  // the master must actually carry the rule and the self-check item it claims
  check(authoringMaster.includes("[CONTAINER-FIT-01]"), "master:container-fit-rule-present");
  check(/\|\s*SC-20\s*\|/.test(authoringMaster), "master:sc-20-present");
  check(html.includes("SC-20 container fit"), "page:sc-20-row");
}
// [BTN-GEOM-01] SC-21 and [REVEAL-01] SC-22 — rendered evidence, bound to this build.
{
  const aff = readJsonAbsolute(deploymentPath(RELEASE.affordanceEvidence), "affordance:parse");
  check(Array.isArray(aff?.selfCheckItems) && aff.selfCheckItems.includes("SC-21") && aff.selfCheckItems.includes("SC-22"), "affordance:self-check-items");
  check(aff?.artifactBuild === RELEASE.artifactBuildId, "affordance:artifact-build");
  check(aff?.authoringRevision === RELEASE.authoringRevision, "affordance:revision");
  check(aff?.colorRegistryId === RELEASE.colorSetId, "affordance:color-set");
  check(aff?.totals?.failures === 0, "affordance:zero-failures");
  check(aff?.assertions?.minCapsuleInlinePaddingCssPx === 24, "affordance:capsule-padding-threshold");
  check(aff?.assertions?.entranceNeverWithholdsReachedContent === true, "affordance:reveal-never-withholds");
  check(aff?.assertions?.entranceAbsentUnderReducedMotionAndNoJavaScript === true, "affordance:reveal-reduce-and-nojs");
  check(aff?.assertions?.entranceLandsOnce === true, "affordance:reveal-lands-once");
  check(authoringMaster.includes("[REVEAL-01]"), "master:reveal-rule-present");
  check(/\|\s*SC-21\s*\|/.test(authoringMaster), "master:sc-21-present");
  check(/\|\s*SC-22\s*\|/.test(authoringMaster), "master:sc-22-present");
}
// Full assets[] sweep — verify-live.mjs byte-checks EVERY manifest asset record
// against the deployed site, so every record must match disk here first.
// (pages.yml run #24 failed post-deploy on a stale implementation-notes record
// that the named-path loop above did not cover.)
for (const asset of manifest?.assets ?? []) {
  const absolute = deploymentPath(asset.path);
  if (!existsSync(absolute) || !statSync(absolute).isFile()) continue; // directory entries (assets/fonts)
  if (typeof asset.bytes !== "number" && typeof asset.sha256 !== "string") continue;
  const record = fileRecordAbsolute(absolute);
  const bytesOk = typeof asset.bytes !== "number" || asset.bytes === record.bytes;
  const shaOk = typeof asset.sha256 !== "string" || asset.sha256 === record.sha256;
  check(bytesOk && shaOk, `manifest:asset-sweep:${asset.path}`);
}
// Marker fields on currentArtifactBuild must state the CURRENT identity —
// verify-live and human readers treat them as the live-HTML contract.
check(manifest?.colorDelivery?.immutableColorBaseline?.registryMarker === `data-color-registry="${RELEASE.colorSetId}"`, "manifest:baseline-registry-marker");
check(manifest?.colorDelivery?.currentArtifactBuild?.registryMarker === `data-color-registry="${RELEASE.colorSetId}"`, "manifest:current-build-registry-marker");
check(manifest?.colorDelivery?.currentArtifactBuild?.artifactBuildMarker === `data-artifact-build="${RELEASE.artifactBuildId}"`, "manifest:current-build-artifact-marker");
// pages.yml post-deploy gate must expect THIS release's identity and byte-check
// this release's pinned artifacts (run #25 failed on a stale ui-20260820-01 pin).
{
  const pagesWorkflow = readFileSync(repoPath(".github/workflows/pages.yml"), "utf8");
  check(pagesWorkflow.includes(`EXPECTED_ARTIFACT_BUILD: ${RELEASE.artifactBuildId}`), "pages-workflow:expected-artifact-build");
  check(pagesWorkflow.includes(`${RELEASE.immutableUi},`), "pages-workflow:critical-immutable-ui");
  check(pagesWorkflow.includes(`${RELEASE.baseline},`), "pages-workflow:critical-color-baseline");
  check(!/EXPECTED_ARTIFACT_BUILD: ui-20260820-01\b/.test(pagesWorkflow), "pages-workflow:no-stale-ui-01-expectation");
}
check(manifest?.colorDelivery?.immutableColorBaseline?.bytes === statSync(deploymentPath(RELEASE.baseline)).size, "manifest:baseline-bytes");
check(manifest?.colorDelivery?.immutableColorBaseline?.sha256 === sha256Absolute(deploymentPath(RELEASE.baseline)), "manifest:baseline-hash");
check(manifest?.colorDelivery?.currentArtifactBuild?.id === RELEASE.artifactBuildId, "manifest:immutable-ui-id");
check(manifest?.colorDelivery?.currentArtifactBuild?.bytes === statSync(deploymentPath(RELEASE.immutableUi)).size, "manifest:immutable-ui-bytes");
check(manifest?.colorDelivery?.currentArtifactBuild?.sha256 === sha256Absolute(deploymentPath(RELEASE.immutableUi)), "manifest:immutable-ui-hash");

// Build Card checks stay textual so this validator has no YAML package dependency.
check(/^landometerBuild:\s*$/m.test(buildCard), "build-card:root");
check(new RegExp(`^  dsVersion:\\s*${escapeRegExp(RELEASE.version)}$`, "m").test(buildCard), "build-card:version");
check(new RegExp(`^  authoringRevision:\\s*${escapeRegExp(RELEASE.authoringRevision)}$`, "m").test(buildCard), "build-card:revision");
check(new RegExp(`^    registryId:\\s*${escapeRegExp(RELEASE.colorSetId)}$`, "m").test(buildCard), "build-card:color-set");
check(buildCard.includes(`id: ${RELEASE.gradientSchema}`), "build-card:gradient-schema");
check(buildCard.includes("sharedAtmosphere: 7"), "build-card:seven-shared-gradients");
check(buildCard.includes("assetOnlyMotif: 3"), "build-card:three-motif-gradients");
check(buildCard.includes("productIdentityThemeSpecimens: 8"), "build-card:eight-product-theme-records");
check(buildCard.includes("totalGradientRecords: 18"), "build-card:eighteen-total-gradient-records");
check(buildCard.includes(`path: ${RELEASE.contrastEvidence}`), "build-card:contrast-path");
check(/contrastEvidence:\s*[\s\S]{0,180}?status:\s*passed\b/.test(buildCard), "build-card:contrast-status-passed");
check(/scrims:\s*\[\]/.test(buildCard), "build-card:no-default-scrims");
check(/passing standalone governed gradient remains (?:visible|unscreened)/i.test(buildCard), "build-card:no-blanket-scrim-policy");
check(!/v0\.9\.0-r[78]\b/.test(buildCard), "build-card:no-future-r7-r8");
for (const path of [
  "index.html",
  RELEASE.authoringMaster,
  RELEASE.registry,
  RELEASE.latest,
  RELEASE.baseline,
  RELEASE.immutableUi,
  RELEASE.contrastEvidence,
]) {
  const absolute = deploymentPath(path);
  check(yamlPathWindows(buildCard, path).length > 0, `build-card:path:${path}`);
  check(yamlHasFileRecord(buildCard, path, fileRecordAbsolute(absolute)), `build-card:file-record:${path}`);
}
check(/machineValidation:\s*pending\b/.test(buildCard), "build-card:machine-validation-pending");
check(/evidenceStatus:\s*source_limited\b/.test(buildCard), "build-card:source-limited");

// Technical typography is one self-hosted 400-weight pair; heavier display faces are separate.
const technicalFaces = fontManifest?.faces?.filter(face =>
  face.family === "IBM Plex Sans Thai" || face.family === "JetBrains Mono"
) ?? [];
check(technicalFaces.length === 2, "font:exact-technical-pair");
check(technicalFaces.every(face => face.weight === 400), "font:technical-pair-single-weight-400");
check(technicalFaces.some(face => face.family === "IBM Plex Sans Thai" && face.subset === "thai"), "font:ibm-plex-sans-thai-present");
check(technicalFaces.some(face => face.family === "JetBrains Mono" && face.subset === "latin"), "font:jetbrains-mono-present");
check(fontManifest?.fontSynthesis === false, "font:no-synthesis");
const technicalHtmlFaces = fontFaceBlocks(html).filter(block =>
  ["IBM Plex Sans Thai", "JetBrains Mono"].includes(faceFamily(block))
);
check(technicalHtmlFaces.length === 2, "font:html-exact-technical-pair");
check(technicalHtmlFaces.every(block => faceWeight(block) === 400), "font:html-technical-weight-400");
check(/font-family:\s*"IBM Plex Sans Thai";[\s\S]{0,360}?size-adjust:\s*102%/.test(html), "font:thai-size-adjust");
check(/--font-technical:\s*"JetBrains Mono",\s*"IBM Plex Sans Thai"/.test(html), "font:technical-stack-order");
check(/--weight-technical:\s*400/.test(html), "font:technical-token-400");
check(!/font-family:\s*"(?:JetBrains Mono|IBM Plex Sans Thai)";[\s\S]{0,220}?font-weight:\s*700/.test(html), "font:no-technical-700-face");

// Action controls share one capsule rule; quiet state controls remain circular capsules.
// The skip link left this rule in r5: Appendix E gives it --radius-sm — it is a link, not a button.
const capsuleRule = html.match(/\.primary-action,\s*\n\s*\.secondary-action,\s*\n\s*\.copy-button,\s*\n\s*\.pattern-button,[\s\S]*?\.scale-sampler-foot a\s*\{([\s\S]*?)\}/)?.[0] ?? "";
for (const selector of [
  ".primary-action",
  ".secondary-action",
  ".copy-button",
  ".pattern-button",
  ".cta-proof button",
  ".intent-form button",
  ".form-demo .button",
  ".interaction-sample .interaction-control",
  ".resource-grid .download-action",
  ".scale-sampler-foot a",
]) {
  check(capsuleRule.includes(selector), `capsule:${selector}`);
}
check(capsuleRule.includes("border-radius: var(--radius-pill)"), "capsule:pill-radius");
// [BTN-GEOM-01] kit anatomy — ui-20260821-02 shipped the box contract without it (SC-23)
check(capsuleRule.includes("display: inline-flex"), "capsule:anatomy-inline-flex");
check(capsuleRule.includes("align-items: center"), "capsule:anatomy-align");
check(capsuleRule.includes("justify-content: center"), "capsule:anatomy-justify");
check(capsuleRule.includes("gap: var(--space-2)"), "capsule:anatomy-gap");
check(!capsuleRule.includes(".skip-link"), "capsule:skip-link-not-a-button");
check(/\.skip-link\s*\{[\s\S]{0,700}?border-radius:\s*var\(--radius-sm\)/.test(html), "skip-link:kit-radius-sm");
check(/\.theme-cycle,\s*\n\s*\.language-cycle\s*\{[\s\S]{0,240}?border-radius:\s*50%/.test(html), "capsule:quiet-controls-circular");

// Browser identity and discovery metadata stay truthful for source_limited internal_demo.
check(/<meta\s+name="robots"\s+content="noindex,nofollow,noarchive">/.test(html), "discovery:noindex-meta");
check(/<link\s+rel="canonical"\s+href="https:\/\/montri-th\.github\.io\/Landometer\/">/.test(html), "discovery:hosted-canonical");
check(/<link\s+rel="icon"\s+type="image\/png"\s+href="assets\/images\/landometer-symbol-transparent\.png\?v=35a1496f"\s+sizes="192x192">/.test(html), "identity:favicon");
check(!/<meta\s+(?:property|name)="(?:og:|twitter:)/i.test(html), "discovery:no-unapproved-social-metadata");
check(!/<script\s+type="application\/ld\+json"/i.test(html), "discovery:no-premature-structured-data");
check(manifest?.publication?.robots === "noindex,nofollow,noarchive", "manifest:robots-parity");
check(manifest?.publication?.structuredData === false, "manifest:no-structured-data");
check(manifest?.publication?.sitemap === false, "manifest:no-sitemap-claim");
check(manifest?.publication?.socialPreviewMetadata?.includes("omitted"), "manifest:no-social-preview-claim");
check(manifest?.publication?.discoveryStates?.searchDiscoverable?.status === "not_claimed", "manifest:no-search-discovery-claim");
check(manifest?.publication?.discoveryStates?.aiSearchDiscoverable?.status === "not_claimed", "manifest:no-ai-search-discovery-claim");
check(manifest?.publication?.discoveryStates?.agentReadableOrActionable?.status === "not_claimed", "manifest:no-agent-action-claim");

// The generated atlas must carry every family and exact record counts.
check(html.includes("<!-- COLOR_ATLAS_START -->") && html.includes("<!-- COLOR_ATLAS_END -->"), "atlas:generated-boundaries");
for (const id of [
  "complete-color-atlas",
  "atlas-identity-title",
  "atlas-foundation-title",
  "atlas-semantic-title",
  "atlas-gradients-title",
  "atlas-categorical-title",
  "atlas-dataviz-title",
  "atlas-map-title",
  "atlas-depth-title",
]) {
  check(new RegExp(`\\bid="${escapeRegExp(id)}"`).test(html), `atlas:section:${id}`);
}
check(/data-atlas-version="0\.9\.0"/.test(html), "atlas:version");
check(/data-atlas-records="18"/.test(html), "atlas:eighteen-gradient-records");
check((html.match(/<figure class="atlas-gradient-card atlas-gradient-card--shared"/g) ?? []).length === 6, "atlas:six-tonal-shared-cards");
check((html.match(/<figure class="atlas-gradient-card atlas-gradient-card--rare"/g) ?? []).length === 1, "atlas:one-diversity-card");
check((html.match(/<figure class="atlas-gradient-card atlas-gradient-card--motif"/g) ?? []).length === 3, "atlas:three-motif-cards");
check((html.match(/data-atlas-scale=/g) ?? []).length === 18, "atlas:eighteen-scale-records");
check((html.match(/data-atlas-kind="sequential"/g) ?? []).length === 12, "atlas:twelve-sequential-theme-records");
check((html.match(/data-atlas-kind="diverging"/g) ?? []).length === 6, "atlas:six-diverging-theme-records");
check(html.includes("/* ATMOSPHERE_GRADIENT_CSS_START */") && html.includes("/* ATMOSPHERE_GRADIENT_CSS_END */"), "atlas:generated-gradient-css");
for (const [id, expected] of Object.entries(EXPECTED_GRADIENTS)) {
  const stopText = expected.stops.map(([color, position]) => `${color} ${position}`).join(", ");
  check(html.includes(stopText), `atlas:exact-gradient-css:${id}`);
}

// Active v0.9.0 surfaces are r6 (2026-08-21 rise refinement); r7/r8 would be drift.
for (const [name, source] of [
  ["html", html],
  ["manifest", JSON.stringify(manifest)],
  ["registry", JSON.stringify(registry)],
  ["proposal", proposal],
  ["approval", approval],
  ["master", authoringMaster],
]) {
  check(!/v0\.9\.0-r[78]\b/.test(source), `revision:no-future-r7-r8:${name}`);
}

// The Build Card deliveryIdentity block shipped stale (color-srgb-04 / ui-20260820-02 with
// old hashes) from r2 through r5 while currentArtifactBuild advanced. Pin it.
check(buildCard.includes(`  deliveryIdentity:\n    colorSetId: ${RELEASE.colorSetId}\n    artifactBuildId: ${RELEASE.artifactBuildId}`), "build-card:delivery-identity-current");
{
  const tokensSha = fileRecordAbsolute(deploymentPath("assets/data/tokens.json")).sha256;
  const shaMentions = (buildCard.match(new RegExp(tokensSha, "g")) ?? []).length;
  check(shaMentions >= 2, "build-card:token-registry-sha-current");
}
// README's release boundary shipped stale build ids twice; pin it to the release identity.
{
  const readmePath = repoPath("README.md");
  check(existsSync(readmePath), "readme:present");
  if (existsSync(readmePath)) {
    const readme = readUtf8Absolute(readmePath);
    check(readme.includes(RELEASE.authoringRevision), "readme:authoring-revision");
    check(readme.includes(RELEASE.artifactBuildId), "readme:artifact-build");
    check(readme.includes(RELEASE.colorSetId), "readme:color-set");
    check(readme.includes(RELEASE.immutableUi), "readme:immutable-filename");
  }
}

// llms.txt is a machine channel too: pin its release identity so it can never drift again
// (ui-20260821-02 shipped with llms.txt still declaring ui-20260821-01 as the release build).
{
  const llmsPath = deploymentPath("llms.txt");
  check(existsSync(llmsPath), "llms:present");
  if (existsSync(llmsPath)) {
    const llms = readUtf8Absolute(llmsPath);
    check(llms.includes(`Authoring revision: ${RELEASE.authoringRevision};`), "llms:authoring-revision");
    check(llms.includes(`Release build: ${RELEASE.artifactBuildId};`), "llms:release-build");
    check(llms.includes(`Immutable UI build \`${RELEASE.artifactBuildId}\`:`), "llms:immutable-ui-link");
    check(llms.includes(RELEASE.immutableUi), "llms:immutable-ui-filename");
    check(llms.includes(`the prepared UI artifact build \`${RELEASE.artifactBuildId}\``), "llms:parity-clause");
  }
}

// The skill release-lock shipped drifted in r3/r4 (stale artifactBuildId, r2-era authority
// hashes, and a falsified product-identity lineage revision). Pin it to the release identity.
{
  const lockPath = repoPath("skill/apply-landometer-design-system-v0-9-0/references/release-lock.json");
  check(existsSync(lockPath), "release-lock:present");
  if (existsSync(lockPath)) {
    const lock = JSON.parse(readUtf8Absolute(lockPath));
    check(lock?.releaseIdentity?.authoringRevision === RELEASE.authoringRevision, "release-lock:authoring-revision");
    check(lock?.releaseIdentity?.artifactBuildId === RELEASE.artifactBuildId, "release-lock:artifact-build");
    check(lock?.releaseIdentity?.immutableArtifactPath === `deployment/${RELEASE.immutableUi}`, "release-lock:immutable-path");
    const masterFile = fileRecordAbsolute(deploymentPath(RELEASE.authoringMaster));
    check(lock?.authority?.bytes === masterFile.bytes, "release-lock:authority-bytes");
    check(lock?.authority?.sha256 === masterFile.sha256, "release-lock:authority-hash");
    check(lock?.lineage?.v090ProductIdentityGradientAmendment?.authoringRevision === "v0.9.0-r2", "release-lock:lineage-history-not-rewritten");
    for (const entry of lock?.integrity ?? []) {
      const f = fileRecordAbsolute(repoPath(`skill/apply-landometer-design-system-v0-9-0/${entry.path}`));
      check(entry.bytes === f.bytes && entry.sha256 === f.sha256, `release-lock:integrity:${entry.path}`);
    }
  }
}

// Reuse deterministic generators/checkers instead of duplicating their derivation logic.
runNodeCheck("tools/check-gradient-contrast.mjs", ["--check"], "generator:gradient-contrast");
runNodeCheck("tools/generate-color-atlas.mjs", ["--check-index"], "generator:color-atlas");
runNodeCheck("tools/build-standalone-html.mjs", ["--check"], "generator:standalone");

if (failures.length > 0) {
  console.error(`v0.9.0 release validation FAIL (${failures.length}/${checkCount})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`v0.9.0 release validation PASS (${checkCount} checks)`);
