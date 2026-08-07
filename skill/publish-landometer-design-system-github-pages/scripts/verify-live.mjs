import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const env = process.env;
const site = String(env.SITE_URL || "https://montri-th.github.io/Landometer/").replace(/\/?$/, "/");
const version = String(env.TARGET_VERSION || "").trim();
const manifestPath = String(env.MANIFEST_PATH || (version ? `site-manifest.v${version}.json` : "")).replace(/^\//, "");
const manifestVersion = String(env.EXPECTED_MANIFEST_VERSION || "2.0");
const tokenSchemaVersion = Number(env.EXPECTED_TOKEN_SCHEMA_VERSION || 6);
const expectedProfile = String(env.EXPECTED_PROFILE || "");
const expectedEvidenceStatus = String(env.EXPECTED_EVIDENCE_STATUS || "");
const expectedMachineValidation = String(env.EXPECTED_MACHINE_VALIDATION || "pending");
const expectedArtifactBuild = String(env.EXPECTED_ARTIFACT_BUILD || "").trim();
const expectedSourceCommit = String(env.EXPECTED_SOURCE_COMMIT || env.GITHUB_SHA || "").trim();
const expectedIndexable = String(env.EXPECTED_INDEXABLE || "false") === "true";
const verifyExactSource = String(env.VERIFY_EXACT_SOURCE || "false") === "true";
const localDeploymentDir = path.resolve(
  env.LOCAL_DEPLOYMENT_DIR || "deployment",
);
const attempts = Number(env.VERIFY_ATTEMPTS || 30);
const delayMs = Number(env.VERIFY_DELAY_MS || 10000);
const criticalAssets = String(env.CRITICAL_ASSETS || "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);

if (!version) throw new Error("TARGET_VERSION is required.");
if (!manifestPath) throw new Error("MANIFEST_PATH is required when it cannot be derived from TARGET_VERSION.");
if (!Number.isInteger(attempts) || attempts < 1) throw new Error("VERIFY_ATTEMPTS must be a positive integer.");
if (verifyExactSource && !env.LOCAL_DEPLOYMENT_DIR) {
  throw new Error("LOCAL_DEPLOYMENT_DIR is required when VERIFY_EXACT_SOURCE=true.");
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = value => createHash("sha256").update(value).digest("hex");
const normalizeMime = value => String(value || "")
  .split(";", 1)[0]
  .trim()
  .toLowerCase();

function localPath(relativePath) {
  const cleanPath = relativePath.replace(/^\//, "");
  const resolved = path.resolve(localDeploymentDir, cleanPath);
  if (
    resolved !== localDeploymentDir &&
    !resolved.startsWith(`${localDeploymentDir}${path.sep}`)
  ) {
    throw new Error(`Critical asset escapes LOCAL_DEPLOYMENT_DIR: ${relativePath}`);
  }
  return resolved;
}

function requireExactBytes(actual, expected, label) {
  if (actual.equals(expected)) return;
  throw new Error(
    `${label} byte mismatch: expected ${expected.length} bytes / ${sha256(expected)}, observed ${actual.length} bytes / ${sha256(actual)}`,
  );
}

function withCacheBust(url, attempt) {
  const value = new URL(url);
  value.searchParams.set("verify", `${env.GITHUB_SHA || "manual"}-${attempt}-${Date.now()}`);
  return value;
}

async function fetchResource(url, attempt) {
  const response = await fetch(withCacheBust(url, attempt), {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
    headers: { "cache-control": "no-cache" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return {
    bytes: Buffer.from(await response.arrayBuffer()),
    finalUrl: response.url,
    mimeType: normalizeMime(response.headers.get("content-type")),
  };
}

function requireHtml(html) {
  const checks = [
    [`data-ds-version="${version}"`, "design-system version"],
    [`data-manifest-version="${manifestVersion}"`, "manifest version"],
    [`data-token-schema-version="${tokenSchemaVersion}"`, "token schema version"],
    [`Landometer Design System v${version}`, "document title/content"],
  ];
  if (expectedProfile) checks.push([`data-ds-profile="${expectedProfile}"`, "profile"]);
  if (expectedEvidenceStatus) checks.push([`data-evidence-status="${expectedEvidenceStatus}"`, "evidence status"]);
  if (expectedArtifactBuild) {
    checks.push([`data-artifact-build="${expectedArtifactBuild}"`, "artifact build"]);
  }
  checks.push([`data-indexable="${expectedIndexable}"`, "indexability"]);
  checks.push([`data-machine-validation="${expectedMachineValidation}"`, "machine validation"]);

  for (const [needle, label] of checks) {
    if (!html.includes(needle)) throw new Error(`Live HTML ${label} mismatch; missing ${needle}`);
  }
}

function requireManifest(value) {
  const artifact = value?.artifact;
  if (!artifact) throw new Error("Manifest artifact record is missing.");

  const checks = [
    [String(artifact.version), version, "artifact.version"],
    [String(artifact.manifestVersion), manifestVersion, "artifact.manifestVersion"],
    [Number(artifact.tokenSchemaVersion), tokenSchemaVersion, "artifact.tokenSchemaVersion"],
    [String(artifact.machineValidation), expectedMachineValidation, "artifact.machineValidation"],
    [Boolean(artifact.indexable), expectedIndexable, "artifact.indexable"],
  ];
  if (expectedProfile) checks.push([String(artifact.profile), expectedProfile, "artifact.profile"]);
  if (expectedEvidenceStatus) checks.push([String(artifact.evidenceStatus), expectedEvidenceStatus, "artifact.evidenceStatus"]);
  if (expectedArtifactBuild) {
    checks.push([
      String(artifact.artifactBuildId),
      expectedArtifactBuild,
      "artifact.artifactBuildId",
    ]);
  }

  for (const [actual, expected, label] of checks) {
    if (actual !== expected) throw new Error(`${label} mismatch: expected ${expected}, observed ${actual}`);
  }
}

const expectedLocal = verifyExactSource
  ? {
      html: await readFile(localPath("index.html")),
      manifest: await readFile(localPath(manifestPath)),
      assets: new Map(
        await Promise.all(
          criticalAssets.map(async assetPath => [
            assetPath,
            await readFile(localPath(assetPath)),
          ]),
        ),
      ),
    }
  : null;

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    console.log(`Live verification attempt ${attempt}/${attempts}`);
    const htmlResponse = await fetchResource(site, attempt);
    const manifestResponse = await fetchResource(new URL(manifestPath, site), attempt);
    const htmlBytes = htmlResponse.bytes;
    const manifestBytes = manifestResponse.bytes;
    const html = htmlBytes.toString("utf8");
    const manifest = JSON.parse(manifestBytes.toString("utf8"));

    requireHtml(html);
    requireManifest(manifest);
    if (expectedLocal) {
      requireExactBytes(htmlBytes, expectedLocal.html, "Live index.html");
      requireExactBytes(
        manifestBytes,
        expectedLocal.manifest,
        `Live ${manifestPath}`,
      );
    }

    const assetResults = [];
    for (const assetPath of criticalAssets) {
      const assetResponse = await fetchResource(
        new URL(assetPath.replace(/^\//, ""), site),
        attempt,
      );
      const bytes = assetResponse.bytes;
      const hash = sha256(bytes);
      const manifestRecord = manifest.assets?.find(
        record => record.path === assetPath,
      );
      if (
        !manifestRecord ||
        manifestRecord.bytes !== bytes.length ||
        manifestRecord.sha256 !== hash
      ) {
        throw new Error(
          `Manifest asset record mismatch for ${assetPath}: observed ${bytes.length} bytes / ${hash}`,
        );
      }
      if (
        manifestRecord.mimeType &&
        normalizeMime(manifestRecord.mimeType) !== assetResponse.mimeType
      ) {
        throw new Error(
          `Manifest media type mismatch for ${assetPath}: expected ${manifestRecord.mimeType}, observed ${assetResponse.mimeType || "missing"}`,
        );
      }
      if (expectedLocal) {
        requireExactBytes(
          bytes,
          expectedLocal.assets.get(assetPath),
          `Live ${assetPath}`,
        );
      }
      assetResults.push({
        path: assetPath,
        finalUrl: assetResponse.finalUrl,
        mimeType: assetResponse.mimeType || null,
        bytes: bytes.length,
        sha256: hash,
      });
    }

    console.log(JSON.stringify({
      ok: true,
      site,
      version,
      manifestPath,
      sourceCommit: expectedSourceCommit || null,
      exactSourceMatch: Boolean(expectedLocal),
      html: {
        finalUrl: htmlResponse.finalUrl,
        mimeType: htmlResponse.mimeType || null,
        bytes: htmlBytes.length,
        sha256: sha256(htmlBytes),
      },
      manifest: {
        finalUrl: manifestResponse.finalUrl,
        mimeType: manifestResponse.mimeType || null,
        bytes: manifestBytes.length,
        sha256: sha256(manifestBytes),
      },
      criticalAssets: assetResults,
      evidenceBoundary: {
        profile: expectedProfile || null,
        evidenceStatus: expectedEvidenceStatus || null,
        indexable: expectedIndexable,
        machineValidation: expectedMachineValidation,
        artifactBuildId: expectedArtifactBuild || null,
      },
    }, null, 2));
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Attempt ${attempt} failed: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}

throw new Error(`Live site did not converge to v${version}: ${lastError?.message || "unknown error"}`);
