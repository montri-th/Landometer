import { createHash } from "node:crypto";

const env = process.env;
const site = String(env.SITE_URL || "https://montri-th.github.io/Landometer/").replace(/\/?$/, "/");
const version = String(env.TARGET_VERSION || "").trim();
const manifestPath = String(env.MANIFEST_PATH || (version ? `site-manifest.v${version}.json` : "")).replace(/^\//, "");
const manifestVersion = String(env.EXPECTED_MANIFEST_VERSION || "2.0");
const tokenSchemaVersion = Number(env.EXPECTED_TOKEN_SCHEMA_VERSION || 6);
const expectedProfile = String(env.EXPECTED_PROFILE || "");
const expectedEvidenceStatus = String(env.EXPECTED_EVIDENCE_STATUS || "");
const expectedMachineValidation = String(env.EXPECTED_MACHINE_VALIDATION || "pending");
const expectedIndexable = String(env.EXPECTED_INDEXABLE || "false") === "true";
const attempts = Number(env.VERIFY_ATTEMPTS || 30);
const delayMs = Number(env.VERIFY_DELAY_MS || 10000);
const criticalAssets = String(env.CRITICAL_ASSETS || "")
  .split(",")
  .map(value => value.trim())
  .filter(Boolean);

if (!version) throw new Error("TARGET_VERSION is required.");
if (!manifestPath) throw new Error("MANIFEST_PATH is required when it cannot be derived from TARGET_VERSION.");
if (!Number.isInteger(attempts) || attempts < 1) throw new Error("VERIFY_ATTEMPTS must be a positive integer.");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = value => createHash("sha256").update(value).digest("hex");

function withCacheBust(url, attempt) {
  const value = new URL(url);
  value.searchParams.set("verify", `${env.GITHUB_SHA || "manual"}-${attempt}-${Date.now()}`);
  return value;
}

async function fetchBytes(url, attempt) {
  const response = await fetch(withCacheBust(url, attempt), {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
    headers: { "cache-control": "no-cache" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
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

  for (const [actual, expected, label] of checks) {
    if (actual !== expected) throw new Error(`${label} mismatch: expected ${expected}, observed ${actual}`);
  }
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    console.log(`Live verification attempt ${attempt}/${attempts}`);
    const htmlBytes = await fetchBytes(site, attempt);
    const manifestBytes = await fetchBytes(new URL(manifestPath, site), attempt);
    const html = htmlBytes.toString("utf8");
    const manifest = JSON.parse(manifestBytes.toString("utf8"));

    requireHtml(html);
    requireManifest(manifest);

    const assetResults = [];
    for (const path of criticalAssets) {
      const bytes = await fetchBytes(new URL(path.replace(/^\//, ""), site), attempt);
      assetResults.push({ path, bytes: bytes.length, sha256: sha256(bytes) });
    }

    console.log(JSON.stringify({
      ok: true,
      site,
      version,
      manifestPath,
      html: { bytes: htmlBytes.length, sha256: sha256(htmlBytes) },
      manifest: { bytes: manifestBytes.length, sha256: sha256(manifestBytes) },
      criticalAssets: assetResults,
      evidenceBoundary: {
        profile: expectedProfile || null,
        evidenceStatus: expectedEvidenceStatus || null,
        indexable: expectedIndexable,
        machineValidation: expectedMachineValidation,
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
