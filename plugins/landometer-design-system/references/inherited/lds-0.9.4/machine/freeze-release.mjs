#!/usr/bin/env node
// Landometer Design System 0.9.4 — release freezer.
//
// Turns a byte-exact copy of the owner-approved candidate package v0.9.4-mp0-candidate into the immutable, active,
// effective machine package v0.9.4-mp1 and signs its nine detached Ed25519 attestations with the release operator's key.
// Everything the freezer does is deterministic: the same candidate bytes, the same kit, the same key and the same
// --issued-at give the same package bytes (Ed25519 signatures are deterministic). The private key is read from the path
// given on the command line and never copied, printed or written anywhere.
//
// Usage (run on the release operator's machine, never inside the canonical candidate folder):
//   cp -R <candidate machine folder> <new folder v0.9.4>
//   node freeze-release.mjs --package <new folder v0.9.4> --kit <freeze kit folder> \
//     --private-key <operator Ed25519 private key PEM> \
//     --package-trust-store <owner-trust/v0.9.4/package-release-trust-store.json> \
//     --package-trust-policy <owner-trust/v0.9.4/package-release-trust-policy.json> \
//     --issued-at 2026-09-17T18:00:00+07:00
//
// The freezer refuses to run when the package is not the approved candidate (checksum receipt hash pinned below), when
// the kit files do not match their pinned hashes, when the key does not match the independently supplied trust store
// and caller-pinned policy, or when --issued-at is before the owner approval or in the future.

import { createHash, createPrivateKey, createPublicKey, sign } from "node:crypto";
import { copyFileSync, existsSync, readFileSync, readdirSync, realpathSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ---------------------------------------------------------------------------------------------------------------------
// 0. Pinned facts of the approved candidate and of the kit (the kit's expected-hashes.json is itself pinned here)
// ---------------------------------------------------------------------------------------------------------------------
const OLD_REF = "v0.9.4-mp0-candidate";
const NEW_REF = "v0.9.4-mp1";
const DS_VERSION = "0.9.4";
const RULESET = "lds-rules-0.9.4";
const OLD_REV = "0.9.4-r1";
const NEW_REV = "0.9.4-r2";
const CANDIDATE_CHECKSUMS_SHA256 = "73cf596ee47abfc69793765651cd1dcd62255c32fb891c362516b6c4262c5c77";
const CANDIDATE_MASTER_SHA256 = "1aec523b854e6d126d01defbf9b35c15f39bbb3668610d1608c5a80bf2347773";
const CANDIDATE_VALIDATOR_SHA256 = "0748ba60034223503792a47217e7492e54a3eb61644ea8a71516db784b366da9";
const EXPECTED_HASHES_SHA256 = "63422194e0aa06a4e8afb661c31e2ba442999d8eb52bd24a78972d29c64e8444";
const ISSUER_ID = "landometer-release-operator";
const KEY_ID = "landometer.release.2026-09-23.01";
const OWNER_APPROVED_AT = "2026-09-17T10:30:13+07:00";
const OWNER_EVIDENCE_REF = "owner-message:2026-09-17:0.9.4-approval";
const RELEASE_DATE = "2026-09-17";
const MASTER = "Landometer Design System v0.9.4.md";
const KIT_FILES = [MASTER, "README.md", "CHANGELOG-0.9.4.md", "validate-v0.9.4.mjs", "sign-verification-attestation.mjs"];
const SELF = "freeze-release.mjs"; // copied into the package from the running file itself
const NOT_BLANKET_REWRITTEN = ["release.json", "migration-ledger.json"]; // identity fields are set structurally; their historical prose keeps the candidate literal
const KIT_LEDGER = "master-edit-ledger-0.9.4-freeze.json";
const REMOVED_AT_FREEZE = ["validate-candidate-0.9.4.mjs"];
const BYTE_IDENTICAL_AT_FREEZE = ["color-srgb-07.tokens.json", "color-srgb-07.scales.json", "color-srgb-07.production.css"];
const BINARY = /\.(woff2|png)$/u;
const STATUS_FLIP_DOCS = ["tokens.v0.9.4.json", "asset-registry.json", "component-contracts.v0.9.4.json", "contrast-evidence.json", "format-kits.json", "format-packs.json", "migration-ledger.json", "motif-register.v0.9.4.json", "rule-catalog.json", "target-profiles.json"];
const ATTESTATIONS = {
  claimApproval: { file: "claim-record.example.approval.attestation.json", id: "attestation.claim.protected-line.v0.9.4-mp1", purpose: "claim_approval", subject: "claim-record.example.json" },
  claimEvidence: { file: "claim-evidence-capture.example.attestation.json", id: "attestation.claim-evidence.protected-line.v0.9.4-mp1", purpose: "claim_evidence_capture", subject: "claim-evidence-capture.example.json" },
  disclosure: { file: "disclosure-authority.example.attestation.json", id: "attestation.disclosure.design-system-reference.v0.9.4-mp1", purpose: "disclosure_authority", subject: "disclosure-authority.example.json" },
  assetApproval: { file: "asset-approval-receipt.attestation.json", id: "attestation.asset.shared-foundations.v0.9.4-mp1", purpose: "asset_approval", subject: "asset-approval-receipt.json" },
  conformance: { file: "conformance-receipt.example.attestation.json", id: "attestation.conformance-receipt.example.v0.9.4-mp1", purpose: "automated_conformance", subject: "conformance-receipt.example.json" },
  agentRevocation: { file: "agent-action-revocation.example.attestation.json", id: "attestation.agent-revocation.inspect-claim.v0.9.4-mp1", purpose: "agent_revocation", subject: "agent-action-revocation.example.json" },
  agentAuthority: { file: "agent-action-authority.example.attestation.json", id: "attestation.agent-authority.inspect-claim.v0.9.4-mp1", purpose: "agent_authority", subject: "agent-action-authority.example.json" },
  releaseApproval: { file: "release-approval.attestation.json", id: "attestation.release.v0.9.4-mp1", purpose: "release_approval", subject: "release.json" },
  packageRoot: { file: "package-root.attestation.json", id: "attestation.package-root.v0.9.4-mp1", purpose: "package_root", subject: "SHA256SUMS.txt", mediaType: "text/plain" }
};
// release.files keys follow v0.9.1-mp7 (camelCase) so that the validator resolves files by role, not by spelling.
const FILE_KEYS = {
  "release.json": "release", [MASTER]: "normativeMaster", "CHANGELOG-0.9.4.md": "changelog", "README.md": "readme", "SHA256SUMS.txt": "checksums",
  "build-card.schema.json": "buildCardSchema", "build-card.example.json": "buildCardExample",
  "artifact-manifest.schema.json": "artifactManifestSchema", "artifact-manifest.example.json": "artifactManifestExample",
  "conformance-receipt.schema.json": "conformanceReceiptSchema", "conformance-receipt.example.json": "conformanceReceiptExample",
  "claim-record.schema.json": "claimRecordSchema", "claim-record.example.json": "claimRecordExample", "claim-record-rebuild02-usage.example.json": "claimRecordRebuild02UsageExample",
  "claim-manifest.schema.json": "claimManifestSchema", "claim-manifest.example.json": "claimManifestExample",
  "claim-evidence-capture.schema.json": "claimEvidenceCaptureSchema", "claim-evidence-capture.example.json": "claimEvidenceCaptureExample",
  "agent-action.schema.json": "agentActionSchema", "agent-action.example.json": "agentActionExample",
  "agent-action-definition.schema.json": "agentActionDefinitionSchema", "agent-action-definition.example.json": "agentActionDefinitionExample",
  "agent-action-authority.schema.json": "agentActionAuthoritySchema", "agent-action-authority.example.json": "agentActionAuthorityExample",
  "agent-action-revocation.schema.json": "agentActionRevocationSchema", "agent-action-revocation.example.json": "agentActionRevocationExample",
  "agent-action-receipt.schema.json": "agentActionReceiptSchema", "agent-confirmation-receipt.schema.json": "agentConfirmationReceiptSchema",
  "agent-action-input.example.schema.json": "agentActionInputExampleSchema", "agent-action-input.example.json": "agentActionInputExample",
  "crawler-purpose-policy.schema.json": "crawlerPurposePolicySchema", "crawler-purpose-policy.example.json": "crawlerPurposePolicyExample",
  "structured-data-projection.schema.json": "structuredDataProjectionSchema", "structured-data-projection.example.json": "structuredDataProjectionExample",
  "capability-config.schema.json": "capabilityConfigSchema", "action-contracts.schema.json": "actionContractsSchema", "action-contracts.example.json": "actionContractsExample",
  "format-implementation.schema.json": "formatImplementationSchema", "format-implementation.example.json": "formatImplementationExample",
  "format-implementation.app-browser.example.json": "formatImplementationAppBrowserExample", "format-implementation.app-native.example.json": "formatImplementationAppNativeExample",
  "format-implementation.document-flow.example.json": "formatImplementationDocumentFlowExample", "format-implementation.pdf-fixed.example.json": "formatImplementationPdfFixedExample",
  "format-implementation.deck-presentation.example.json": "formatImplementationDeckPresentationExample", "format-implementation.social-static.example.json": "formatImplementationSocialStaticExample",
  "asset-registry.schema.json": "assetRegistrySchema", "asset-registry.json": "assetRegistry", "asset-approval-receipt.schema.json": "assetApprovalReceiptSchema", "asset-approval-receipt.json": "assetApprovalReceipt",
  "disclosure-authority.schema.json": "disclosureAuthoritySchema", "disclosure-authority.example.json": "disclosureAuthorityExample",
  "source-lineage-receipt.schema.json": "sourceLineageReceiptSchema", "promotion-snapshot.schema.json": "promotionSnapshotSchema",
  "verification-attestation.schema.json": "verificationAttestationSchema", "verification-trust-store.schema.json": "verificationTrustStoreSchema", "verification-trust-policy.schema.json": "verificationTrustPolicySchema",
  "social-sidecar.schema.json": "socialSidecarSchema", "social-sidecar.example.json": "socialSidecarExample",
  "social-destination-verification.example.json": "socialDestinationVerificationExample", "social-visible-copy-inspection.example.json": "socialVisibleCopyInspectionExample",
  "migration-ledger.schema.json": "migrationLedgerSchema", "migration-ledger.json": "migrationLedger", "rule-catalog.json": "ruleCatalog", "format-packs.json": "formatPacks",
  "format-kits.schema.json": "formatKitsSchema", "format-kits.json": "formatKits", "target-profiles.schema.json": "targetProfilesSchema", "target-profiles.json": "targetProfiles",
  "tokens.v0.9.4.json": "tokens", "color-srgb-07.tokens.json": "colorRegistryTokens", "color-srgb-07.scales.json": "colorRegistryScales", "color-srgb-07.production.css": "colorRegistryProductionCss",
  "render-color-production.mjs": "colorProjectionRenderer", "contrast-evidence.json": "contrastEvidence", "validate-dataviz-gates-0.9.4.mjs": "dataVizGateTool",
  "component-contracts.v0.9.4.json": "componentContracts", "motif-register.schema.json": "motifRegisterSchema", "motif-register.v0.9.4.json": "motifRegister", "measure-motif-carriers-0.9.4.mjs": "motifCarrierTool",
  "Landometer-Logo-TransparentBG.png": "identitySourceHorizontal",
  "arvo-latin-700-normal.woff2": "fontArvoLatin700", "ibm-plex-sans-thai-looped-latin-700-normal.woff2": "fontIbmPlexThaiLoopedLatin700", "ibm-plex-sans-thai-looped-thai-700-normal.woff2": "fontIbmPlexThaiLoopedThai700",
  "bai-jamjuree-latin-400-normal.woff2": "fontBaiJamjureeLatin400", "bai-jamjuree-thai-400-normal.woff2": "fontBaiJamjureeThai400", "bai-jamjuree-latin-600-normal.woff2": "fontBaiJamjureeLatin600", "bai-jamjuree-thai-600-normal.woff2": "fontBaiJamjureeThai600",
  "jetbrains-mono-latin-400-normal.woff2": "fontJetbrainsMonoLatin400", "ibm-plex-sans-thai-thai-400-normal.woff2": "fontIbmPlexThaiThai400",
  "material-symbols-rounded-open-in-new-300.woff2": "iconMaterialSymbolsRoundedOpenInNew300", "material-symbols-rounded-nav-300.woff2": "iconMaterialSymbolsRoundedNav300",
  "arvo-OFL.txt": "licenseArvo", "ibm-plex-sans-thai-looped-OFL.txt": "licenseIbmPlexThaiLooped", "bai-jamjuree-OFL.txt": "licenseBaiJamjuree", "jetbrains-mono-OFL.txt": "licenseJetbrainsMono", "ibm-plex-sans-thai-OFL.txt": "licenseIbmPlexThai", "material-symbols-Apache-2.0.txt": "licenseMaterialSymbols",
  "validate-v0.9.4.mjs": "validator", "verify-attestation.mjs": "attestationVerifier", "sign-verification-attestation.mjs": "attestationSigner", "freeze-release.mjs": "releaseFreezer",
  "release-approval.attestation.json": "releaseApprovalAttestation", "asset-approval-receipt.attestation.json": "assetApprovalAttestation", "claim-record.example.approval.attestation.json": "claimApprovalAttestation",
  "claim-evidence-capture.example.attestation.json": "claimEvidenceAttestation", "disclosure-authority.example.attestation.json": "disclosureAuthorityAttestation", "agent-action-authority.example.attestation.json": "agentAuthorityAttestation",
  "agent-action-revocation.example.attestation.json": "agentRevocationAttestation", "conformance-receipt.example.attestation.json": "conformanceReceiptAttestation", "package-root.attestation.json": "packageRootAttestation"
};

// ---------------------------------------------------------------------------------------------------------------------
// 1. Arguments, key, trust store, policy, issued-at
// ---------------------------------------------------------------------------------------------------------------------
const optionValue = (name) => { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : null; };
const packageInput = optionValue("--package");
const kitInput = optionValue("--kit");
const privateKeyInput = optionValue("--private-key");
const trustStoreInput = optionValue("--package-trust-store");
const trustPolicyInput = optionValue("--package-trust-policy");
const issuedAt = optionValue("--issued-at");
if (!packageInput || !kitInput || !privateKeyInput || !trustStoreInput || !trustPolicyInput || !issuedAt) {
  throw new Error("Usage: node freeze-release.mjs --package <copy of the candidate package> --kit <freeze kit> --private-key <operator Ed25519 private key PEM> --package-trust-store <external package_release trust store JSON> --package-trust-policy <external caller-pinned policy JSON> --issued-at <RFC 3339 time with numeric offset>");
}
const packageDir = realpathSync(resolve(packageInput));
const kitDir = realpathSync(resolve(kitInput));
if (!statSync(packageDir).isDirectory() || !statSync(kitDir).isDirectory()) throw new Error("--package and --kit must be directories");
if (basename(packageDir) === OLD_REF) throw new Error(`Refusing to freeze in place: copy the candidate to a new folder first (the folder is named ${OLD_REF})`);
if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?[+-]\d{2}:\d{2}$/u.test(issuedAt) || Number.isNaN(Date.parse(issuedAt))) throw new Error("--issued-at must be an RFC 3339 time with a numeric UTC offset, e.g. 2026-09-17T18:00:00+07:00");
if (Date.parse(issuedAt) < Date.parse(OWNER_APPROVED_AT)) throw new Error(`--issued-at precedes the owner approval ${OWNER_APPROVED_AT}`);
if (Date.parse(issuedAt) > Date.now() + 300000) throw new Error("--issued-at is in the future (more than five minutes of clock skew)");

const assertExternalFile = (input, label) => {
  const path = realpathSync(resolve(input));
  if (!statSync(path).isFile()) throw new Error(`${label} must resolve to a regular file`);
  if (path === packageDir || path.startsWith(`${packageDir}/`)) throw new Error(`${label} must be external to the package directory`);
  return path;
};
const privateKeyPath = assertExternalFile(privateKeyInput, "--private-key");
const privateKey = createPrivateKey(readFileSync(privateKeyPath, "utf8"));
if (privateKey.asymmetricKeyType !== "ed25519") throw new Error("--private-key must be an Ed25519 key");
const publicKeySpkiPem = createPublicKey(privateKey).export({ type: "spki", format: "pem" }).toString();
const signingKeyFingerprint = createHash("sha256").update(createPublicKey(privateKey).export({ type: "spki", format: "der" })).digest("hex");
const packageTrustStorePath = assertExternalFile(trustStoreInput, "--package-trust-store");
const packageTrustPolicyPath = assertExternalFile(trustPolicyInput, "--package-trust-policy");
const packageTrustStore = JSON.parse(readFileSync(packageTrustStorePath, "utf8"));
const packageTrustPolicy = JSON.parse(readFileSync(packageTrustPolicyPath, "utf8"));
if (packageTrustStore.scope !== "package_release") throw new Error("--package-trust-store scope must be package_release");
if (packageTrustPolicy.scope !== "package_release") throw new Error("--package-trust-policy scope must be package_release");
if (packageTrustStore.schemaVersion !== "1.1" || packageTrustPolicy.schemaVersion !== "1.0") throw new Error("External package trust store must use schemaVersion 1.1 and caller-pinned policy must use schemaVersion 1.0");
const matchingStoreKeys = (packageTrustStore.keys ?? []).filter((key) => key.keyId === KEY_ID && key.issuerId === ISSUER_ID);
if (matchingStoreKeys.length !== 1 || (packageTrustStore.keys ?? []).length !== 1) throw new Error("The external package trust store must contain exactly one configured release signing key and no sibling keys");
const pinnedStoreKey = matchingStoreKeys[0];
if (pinnedStoreKey.algorithm !== "Ed25519") throw new Error("The configured package release key must use Ed25519");
const pinnedStoreFingerprint = createHash("sha256").update(createPublicKey(pinnedStoreKey.publicKeySpkiPem).export({ type: "spki", format: "der" })).digest("hex");
if (pinnedStoreFingerprint !== signingKeyFingerprint || createPublicKey(pinnedStoreKey.publicKeySpkiPem).export({ type: "spki", format: "pem" }).toString() !== publicKeySpkiPem) {
  throw new Error("The signing private key does not match the independently supplied package trust-store public key");
}
const requiredPackagePurposes = ["release_approval", "asset_approval", "disclosure_authority", "claim_approval", "claim_evidence_capture", "agent_authority", "agent_revocation", "automated_conformance", "package_root"];
if (JSON.stringify([...(pinnedStoreKey.allowedPurposes ?? [])].sort()) !== JSON.stringify([...requiredPackagePurposes].sort())) throw new Error("The package trust-store release key purpose allow-list must exactly match the governed package-release purposes");
const pinnedPolicyStore = (packageTrustPolicy.stores ?? []).find((entry) => entry.trustStoreId === packageTrustStore.trustStoreId);
const pinnedPolicyKey = pinnedPolicyStore?.keys?.find((key) => key.keyId === KEY_ID && key.issuerId === ISSUER_ID && key.publicKeySpkiSha256 === signingKeyFingerprint);
if (!pinnedPolicyKey) throw new Error("The caller-pinned package trust policy does not allow this trustStoreId/key fingerprint");
const trustStorePins = (packageTrustStore.keys ?? []).map((key) => {
  let fingerprint = null;
  try { fingerprint = createHash("sha256").update(createPublicKey(key.publicKeySpkiPem).export({ type: "spki", format: "der" })).digest("hex"); } catch { fingerprint = null; }
  return `${key.keyId}\u0000${key.issuerId}\u0000${fingerprint}`;
}).sort();
const policyPins = (pinnedPolicyStore?.keys ?? []).map((key) => `${key.keyId}\u0000${key.issuerId}\u0000${key.publicKeySpkiSha256}`).sort();
if ((packageTrustPolicy.stores ?? []).filter((entry) => entry.trustStoreId === packageTrustStore.trustStoreId).length !== 1 || JSON.stringify(policyPins) !== JSON.stringify(trustStorePins)) {
  throw new Error("The caller-pinned package trust policy and package trust-store key allow-lists must match exactly");
}
const signingTime = Date.parse(issuedAt);
const keyValidFrom = Date.parse(pinnedStoreKey.validFrom ?? "");
const keyValidUntil = pinnedStoreKey.validUntil === null ? Infinity : Date.parse(pinnedStoreKey.validUntil ?? "");
const keyRevokedAt = pinnedStoreKey.revokedAt === null ? Infinity : Date.parse(pinnedStoreKey.revokedAt ?? "");
if (!Number.isFinite(signingTime) || !Number.isFinite(keyValidFrom) || Number.isNaN(keyValidUntil) || Number.isNaN(keyRevokedAt) || signingTime < keyValidFrom || signingTime > keyValidUntil || signingTime >= keyRevokedAt) {
  throw new Error("The configured package release key is not valid and unrevoked at the release signing time");
}

// ---------------------------------------------------------------------------------------------------------------------
// 2. Helpers
// ---------------------------------------------------------------------------------------------------------------------
const { attestationSigningPayload, canonicalAttestationJson } = await import(pathToFileURL(join(packageDir, "verify-attestation.mjs")).href);
const jsonPath = (name) => join(packageDir, name);
const shaBytes = (bytes) => createHash("sha256").update(bytes).digest("hex");
const shaFile = (name) => shaBytes(readFileSync(jsonPath(name)));
const readText = (name) => readFileSync(jsonPath(name), "utf8");
const readJson = (name) => JSON.parse(readText(name));
const writeJson = (name, value) => writeFileSync(jsonPath(name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const writeText = (name, text) => writeFileSync(jsonPath(name), text, "utf8");
const listFiles = () => readdirSync(packageDir, { withFileTypes: true }).map((entry) => { if (!entry.isFile() || entry.isSymbolicLink()) throw new Error(`package closure: ${entry.name} is not a regular non-symlink file`); return entry.name; }).sort();
const log = [];
const note = (message) => { log.push(message); console.log(message); };

// ---------------------------------------------------------------------------------------------------------------------
// 3. The package must be the approved candidate, byte for byte; the kit must match its pinned hashes
// ---------------------------------------------------------------------------------------------------------------------
const candidateRelease = readJson("release.json");
if (candidateRelease.release?.status !== "candidate" || candidateRelease.release?.machinePackage !== OLD_REF || candidateRelease.release?.candidateOf?.effectiveRef !== NEW_REF) {
  throw new Error(`The package is not the candidate ${OLD_REF} awaiting its freeze to ${NEW_REF} (status ${candidateRelease.release?.status}, machinePackage ${candidateRelease.release?.machinePackage})`);
}
if (candidateRelease.release.ownerApproval?.status !== "approved" || candidateRelease.release.ownerApproval?.approvedAt !== OWNER_APPROVED_AT || candidateRelease.release.ownerApproval?.evidenceRef !== OWNER_EVIDENCE_REF) throw new Error("The candidate does not record the owner approval this freezer was built for");
if (shaFile("SHA256SUMS.txt") !== CANDIDATE_CHECKSUMS_SHA256) throw new Error(`SHA256SUMS.txt is not the approved candidate's (sha256 ${shaFile("SHA256SUMS.txt")}, expected ${CANDIDATE_CHECKSUMS_SHA256})`);
const candidateSums = readText("SHA256SUMS.txt").trim().split("\n").map((line) => { const match = line.match(/^([a-f0-9]{64})  (.+)$/u); if (!match) throw new Error(`SHA256SUMS.txt line is malformed: ${line}`); return [match[2], match[1]]; });
for (const [name, expected] of candidateSums) { if (!existsSync(jsonPath(name))) throw new Error(`candidate file missing: ${name}`); if (shaFile(name) !== expected) throw new Error(`candidate byte drift: ${name}`); }
const candidateDeclared = Object.values(candidateRelease.files);
const present = listFiles();
const expectedPresent = [...candidateDeclared, "release.json", "SHA256SUMS.txt"].sort();
if (JSON.stringify(present) !== JSON.stringify(expectedPresent)) throw new Error(`candidate closure differs from release.files (present ${present.length}, declared ${expectedPresent.length})`);
if (shaFile(MASTER) !== CANDIDATE_MASTER_SHA256) throw new Error("the candidate master is not the approved 0.9.4-r1 text");
if (shaFile("validate-candidate-0.9.4.mjs") !== CANDIDATE_VALIDATOR_SHA256) throw new Error("the candidate validator bytes drifted");
const expectedHashesText = readFileSync(join(kitDir, "expected-hashes.json"), "utf8");
if (shaBytes(Buffer.from(expectedHashesText, "utf8")) !== EXPECTED_HASHES_SHA256) throw new Error("freeze kit: expected-hashes.json does not match the hash pinned in freeze-release.mjs");
const expectedHashes = JSON.parse(expectedHashesText);
if (expectedHashes.candidate.checksumsSha256 !== CANDIDATE_CHECKSUMS_SHA256 || expectedHashes.candidate.masterSha256 !== CANDIDATE_MASTER_SHA256) throw new Error("freeze kit: candidate pins disagree with freeze-release.mjs");
const FROZEN_TEXT = [MASTER, "README.md", "CHANGELOG-0.9.4.md"]; // kept under <kit>/frozen-text/
const kitPath = (name) => join(kitDir, FROZEN_TEXT.includes(name) ? "frozen-text" : ".", name);
for (const name of [...KIT_FILES, KIT_LEDGER]) {
  const path = kitPath(name);
  if (!existsSync(path)) throw new Error(`freeze kit: missing ${name}`);
  const actual = shaBytes(readFileSync(path));
  if (actual !== expectedHashes.kit[name]) throw new Error(`freeze kit: ${name} sha256 ${actual} differs from the pinned ${expectedHashes.kit[name]}`);
}
const selfPath = fileURLToPath(import.meta.url);
if (basename(selfPath) !== SELF) throw new Error(`the freezer must be run as ${SELF}`);
const frozenFrom = { ref: OLD_REF, authoringRevision: OLD_REV, masterSha256: CANDIDATE_MASTER_SHA256, checksumsSha256: CANDIDATE_CHECKSUMS_SHA256, candidateValidator: { ref: "validate-candidate-0.9.4.mjs", sha256: CANDIDATE_VALIDATOR_SHA256, disposition: "removed at the freeze; it asserts the candidate state and is superseded by validate-v0.9.4.mjs" } };
note(`candidate ${OLD_REF} verified: ${candidateSums.length} checksummed files, master ${CANDIDATE_MASTER_SHA256.slice(0, 8)}…, SHA256SUMS ${CANDIDATE_CHECKSUMS_SHA256.slice(0, 8)}…`);

// ---------------------------------------------------------------------------------------------------------------------
// 4. Remove candidate-only files, copy the frozen texts and tools from the kit
// ---------------------------------------------------------------------------------------------------------------------
for (const name of [...REMOVED_AT_FREEZE, "SHA256SUMS.txt"]) unlinkSync(jsonPath(name));
for (const name of KIT_FILES) copyFileSync(kitPath(name), jsonPath(name));
copyFileSync(selfPath, jsonPath(SELF));
const freezeLedger = JSON.parse(readFileSync(kitPath(KIT_LEDGER), "utf8"));
if (freezeLedger.sourceSha256 !== CANDIDATE_MASTER_SHA256 || freezeLedger.outputSha256 !== shaFile(MASTER)) throw new Error("the freeze ledger does not describe the kit master (source/output hash mismatch)");
note(`kit applied: ${KIT_FILES.length + 1} files (master ${NEW_REV} ${shaFile(MASTER).slice(0, 8)}…, ${freezeLedger.edits.length} provenance-only edits), removed ${REMOVED_AT_FREEZE.join(", ")}`);

// ---------------------------------------------------------------------------------------------------------------------
// 5. Release-literal rewrite (text files), status flips, targeted prose, sentence-ledger stage 5
// ---------------------------------------------------------------------------------------------------------------------
const rewriteLiterals = (text) => text.split(OLD_REF).join(NEW_REF);
let rewritten = 0;
for (const name of listFiles()) {
  if (BINARY.test(name) || KIT_FILES.includes(name) || name === SELF || NOT_BLANKET_REWRITTEN.includes(name)) continue;
  const before = readText(name);
  if (BYTE_IDENTICAL_AT_FREEZE.includes(name)) { if (before.includes(OLD_REF)) throw new Error(`${name} must stay byte-identical but carries the candidate literal`); continue; }
  const occurrences = before.split(OLD_REF).length - 1;
  if (occurrences > 1) throw new Error(`${name} carries the candidate literal ${occurrences} times; only a single identity field is expected (historical prose belongs to release.json and migration-ledger.json, which are edited structurally)`);
  const after = rewriteLiterals(before);
  if (after !== before) { writeText(name, after); rewritten++; }
}
note(`release literal ${OLD_REF} → ${NEW_REF} rewritten in ${rewritten} text files; ${BYTE_IDENTICAL_AT_FREEZE.join(", ")} kept byte-identical`);
// targeted prose in schema text (text replacement keeps the hand formatting of the schema files)
const replaceOnce = (name, from, to) => { const text = readText(name); const count = text.split(from).length - 1; if (count !== 1) throw new Error(`${name}: expected exactly one occurrence of ${JSON.stringify(from)}, found ${count}`); writeText(name, text.replace(from, to)); };
replaceOnce("build-card.schema.json", "\"title\": \"Landometer Design System 0.9.4 candidate Build Card 0.9.3.2\"", "\"title\": \"Landometer Design System 0.9.4 Build Card 0.9.3.2\"");
replaceOnce("build-card.schema.json", "under the 0.9.4 candidate resolved-only audience contract (approved by the owner on 17 September 2026; effective from the frozen package v0.9.4-mp1)", "under the 0.9.4 resolved-only audience contract (approved by the owner on 17 September 2026; active and effective in the frozen package v0.9.4-mp1)");
replaceOnce("migration-ledger.schema.json", `"const": "${OLD_REV}"`, `"const": "${NEW_REV}"`);
// ---------------------------------------------------------------------------------------------------------------------
// 5b. Contract repairs found by the validator port (declared in release.json#/frozenAtFreeze/contractRepairs; no rule text changes)
// ---------------------------------------------------------------------------------------------------------------------
const contractRepairs = [];
{
  // (1) capability-config.schema.json 1.5: motionBrowserObserver is a closed object but tokens.motion.approach carries the three
  //     OWNER-MOTION-01 repetition fields adopted in 0.9.3 (reentryBehavior, cycleWhileStill, repetitionAuthority); the active motion
  //     token object must validate against #/$defs/motion, so the three properties are declared (values pinned where governed).
  const tokensDoc = readJson("tokens.v0.9.4.json");
  const approach = tokensDoc.motion.approach;
  if (approach.reentryBehavior !== "replay_on_reentry_while_visible" || approach.cycleWhileStill !== false || typeof approach.repetitionAuthority !== "string") throw new Error("tokens.motion.approach repetition fields differ from the governed OWNER-MOTION-01 values");
  replaceOnce("capability-config.schema.json",
    "        \"prePaintArmingRequiresNormalMotionAndObserver\": {\n          \"const\": true\n        },\n        \"motionMoments\": {",
    "        \"prePaintArmingRequiresNormalMotionAndObserver\": {\n          \"const\": true\n        },\n        \"reentryBehavior\": {\n          \"const\": \"replay_on_reentry_while_visible\"\n        },\n        \"cycleWhileStill\": {\n          \"const\": false\n        },\n        \"repetitionAuthority\": {\n          \"type\": \"string\",\n          \"minLength\": 1\n        },\n        \"motionMoments\": {");
  contractRepairs.push({ file: "capability-config.schema.json", change: "motionBrowserObserver declares reentryBehavior (const replay_on_reentry_while_visible), cycleWhileStill (const false) and repetitionAuthority (string) so that tokens.motion.approach — the motion capability configuration — validates against #/$defs/motion; additive, schema id 1.5 unchanged", foundBy: "validate-v0.9.4.mjs motion capability config check" });
  // (2) format-packs.json: the motion overlay listed motionMoments as a required field of the capability configuration, but that
  //     configuration is the release-wide tokens.motion.approach object; motion moments are a Build Card field (experience.motionMoments,
  //     MOTIF-04/06, checked by the preflight). The overlay's per-runtime-class field sets stay as they are.
  //     The packs also carried conditional triggers "identity_motion" and "motifs", which are not Build Card capabilities and could never
  //     fire; MOTION-04 and MOTIF-01…06 stay bound through capabilityRuleIds.motion and the motion overlay.
  const packs = readJson("format-packs.json");
  const motionOverlay = packs.overlays.find((overlay) => overlay.capability === "motion");
  if (JSON.stringify(motionOverlay.requiredFields) !== JSON.stringify(["mode", "motionMoments"])) throw new Error("format-packs motion overlay requiredFields differ from the candidate's");
  motionOverlay.requiredFields = ["mode"];
  let removedTriggers = 0;
  for (const pack of packs.packs) for (const trigger of ["identity_motion", "motifs"]) if (pack.conditionalRuleIds && Object.hasOwn(pack.conditionalRuleIds, trigger)) { delete pack.conditionalRuleIds[trigger]; removedTriggers++; }
  for (const id of ["MOTION-04", "MOTIF-01", "MOTIF-02", "MOTIF-03", "MOTIF-04", "MOTIF-05", "MOTIF-06"]) if (!packs.capabilityRuleIds.motion.includes(id) || !motionOverlay.requiredRuleIds.includes(id)) throw new Error(`${id} is not bound through the motion capability`);
  writeJson("format-packs.json", packs);
  contractRepairs.push({ file: "format-packs.json", change: `motion overlay requiredFields [mode, motionMoments] → [mode] (motion moments are a Build Card field, experience.motionMoments); ${removedTriggers} conditional-rule entries keyed by the non-capabilities identity_motion and motifs removed from the packs (the rules stay bound through capabilityRuleIds.motion and the motion overlay)`, foundBy: "validate-v0.9.4.mjs format-pack overlay and conditional-trigger checks" });
  // (3) asset-registry.json: the candidate carried approvalAttestationRef null (no attestation existed); the freeze binds the receipt attestation.
  const registry = readJson("asset-registry.json");
  registry.approvalAttestationRef = ATTESTATIONS.assetApproval.file;
  registry.approvalAttestationSha256 = "0".repeat(64); // rebound after signing
  writeJson("asset-registry.json", registry);
  // (4) artifact-manifest.schema.json 3.2: the web discovery projection must equal the Build Card discovery contract verbatim, which in
  //     0.9.4 carries iconSetId (FAVICON-01) and titlePattern; the closed discoveryProjection object declares both (additive, id unchanged).
  replaceOnce("artifact-manifest.schema.json",
    "        \"visibleTruthOnly\": { \"const\": true },\n        \"initialHtmlRequired\": { \"type\": \"boolean\" }\n      }",
    "        \"visibleTruthOnly\": { \"const\": true },\n        \"initialHtmlRequired\": { \"type\": \"boolean\" },\n        \"iconSetId\": { \"anyOf\": [{ \"$ref\": \"#/$defs/nonEmpty\" }, { \"type\": \"null\" }] },\n        \"titlePattern\": { \"const\": \"[page] · [product]\" }\n      }");
  contractRepairs.push({ file: "artifact-manifest.schema.json", change: "discoveryProjection declares iconSetId (id or null) and titlePattern (const \"[page] · [product]\") so that the web metadata projection can equal the 0.9.4 Build Card discovery contract verbatim; additive, schema id 3.2 unchanged", foundBy: "validate-v0.9.4.mjs artifact-manifest schema and projection checks" });
  // (5) render-color-production.mjs: header comment named the 0.9.3 candidate; tool logic unchanged
  replaceOnce("render-color-production.mjs", "// Landometer Design System 0.9.3 candidate — deterministic renderer", "// Landometer Design System 0.9.4 — deterministic renderer");
  contractRepairs.push({ file: "render-color-production.mjs", change: "header comment names 0.9.4 instead of the 0.9.3 candidate; no logic change", foundBy: "freeze review" });
}
note(`contract repairs: ${contractRepairs.length} (${contractRepairs.map((repair) => repair.file).join(", ")}); asset-registry.json now binds the asset-approval attestation`);

// ---------------------------------------------------------------------------------------------------------------------
// 5c. Resolution recompute — the reference implementation records and the artifact manifest example carry the rule and test
//     ids that the 0.9.4 packs resolve (v0.9.1-mp7's freezer did the same for its own packs)
// ---------------------------------------------------------------------------------------------------------------------
{
  const formatPacks = readJson("format-packs.json");
  const catalog = readJson("rule-catalog.json");
  const targetProfiles = readJson("target-profiles.json");
  const formatKits = readJson("format-kits.json");
  const assetRegistry = readJson("asset-registry.json");
  const ruleById = new Map(catalog.rules.map((rule) => [rule.id, rule]));
  const packByProfile = new Map(formatPacks.packs.map((pack) => [pack.formatProfile, pack]));
  const targetById = new Map(targetProfiles.profiles.map((target) => [target.id, target]));
  const kitById = new Map(formatKits.kits.map((kit) => [kit.id, kit]));
  const overlayByCapability = new Map(formatPacks.overlays.map((overlay) => [overlay.capability, overlay]));
  const allRuleIds = catalog.rules.map((rule) => rule.id);
  const indexed = (prefix, items = []) => items.map((_item, index) => `${prefix}.${String(index + 1).padStart(2, "0")}`);
  const pushUnique = (items, values = []) => { for (const value of values) if (!items.includes(value)) items.push(value); };
  const scopeApplies = (rule, card) => {
    const scopes = String(rule?.scope ?? "").split(",").map((value) => value.trim()).filter(Boolean);
    const caps = new Set(card.capabilities ?? []);
    return scopes.some((scope) => scope === "all" || scope === card.formatProfile ||
      (scope === "interactive" && ["web_public", "app_interactive"].includes(card.formatProfile)) ||
      (scope === "screen" && (["browser", "native"].includes(card.runtime) || card.formatProfile === "deck_presentation")) ||
      (scope === "public" && card.deliveryAudience === "public") || scope === "agent_readable" ||
      (scope === "agent_action" && caps.has("agent_action")) ||
      (scope === "data_visualization" && caps.has("data_visualization")) ||
      (scope === "map" && caps.has("map")));
  };
  const motionRuntimeClass = (card) => {
    if (card.runtime === "browser" && ["web_public", "app_interactive"].includes(card.formatProfile)) return "browser_observer";
    if (card.runtime === "native" && card.formatProfile === "app_interactive") return "native_state";
    if (card.runtime === "static" && card.formatProfile === "deck_presentation") return "presenter_sequence";
    return null;
  };
  const resolveRules = (card) => {
    const pack = packByProfile.get(card.formatProfile);
    const selected = new Set(formatPacks.commonRuleIds);
    for (const id of pack.requiredRuleIds ?? []) selected.add(id);
    for (const id of pack.requiredRuleIdsByRuntime?.[card.runtime] ?? []) selected.add(id);
    for (const id of formatPacks.experienceProfileRuleIds?.[card.experienceProfile] ?? []) selected.add(id);
    for (const profile of card.secondaryExperienceProfiles ?? []) for (const id of formatPacks.experienceProfileRuleIds?.[profile] ?? []) selected.add(id);
    for (const capability of card.capabilities ?? []) {
      const overlay = overlayByCapability.get(capability);
      for (const id of formatPacks.capabilityRuleIds?.[capability] ?? []) selected.add(id);
      for (const id of overlay?.requiredRuleIds ?? []) selected.add(id);
      if (capability === "motion") for (const id of overlay?.requiredRuleIdsByRuntimeClass?.[motionRuntimeClass(card)] ?? []) selected.add(id);
      for (const id of pack.conditionalRuleIds?.[capability] ?? []) selected.add(id);
    }
    if (card.sideBookmarkSelected) for (const id of pack.conditionalRuleIds?.side_bookmark ?? []) selected.add(id);
    return allRuleIds.filter((id) => selected.has(id) && scopeApplies(ruleById.get(id), card));
  };
  const resolveTests = (card, portabilityFixtureIds = []) => {
    const pack = packByProfile.get(card.formatProfile);
    const target = targetById.get(card.targetProfileRef);
    const kit = kitById.get(pack.kitRef);
    const tests = [];
    pushUnique(tests, indexed("common", formatPacks.commonTestMatrix));
    pushUnique(tests, indexed(`experience.${card.experienceProfile}`, formatPacks.experienceProfileTestMatrix[card.experienceProfile]));
    for (const profile of card.secondaryExperienceProfiles ?? []) pushUnique(tests, indexed(`experience.${profile}`, formatPacks.experienceProfileTestMatrix[profile]));
    pushUnique(tests, indexed(`format.${pack.id}`, pack.testMatrix));
    pushUnique(tests, indexed(`format.${pack.id}.runtime.${card.runtime}`, pack.testMatrixByRuntime?.[card.runtime]));
    for (const capability of card.capabilities ?? []) {
      const overlay = overlayByCapability.get(capability);
      pushUnique(tests, indexed(`capability.${overlay?.id}`, overlay?.testMatrix));
      if (capability === "motion") { const runtimeClass = motionRuntimeClass(card); pushUnique(tests, indexed(`capability.${overlay?.id}.runtime.${runtimeClass}`, overlay?.testMatrixByRuntimeClass?.[runtimeClass])); }
    }
    pushUnique(tests, target.requiredFixtures.map((fixture) => `${target.id}.fixture.${fixture}`));
    pushUnique(tests, indexed(`${kit.id}.control`, kit.requiredImplementationControls));
    pushUnique(tests, formatPacks.accessibilityFixtureIdsByConformanceVariant[`${card.formatProfile}.${card.runtime}`]);
    pushUnique(tests, portabilityFixtureIds);
    return tests;
  };
  const nativeMappingById = new Map((assetRegistry.nonWebPortability?.nativeFontMappings ?? []).map((mapping) => [mapping.id, mapping]));
  const identityTypographyBindingById = new Map((assetRegistry.textIdentityImplementations ?? []).flatMap((implementation) => (implementation.typographyBindings ?? []).map((binding) => [binding.id, binding])));
  const nonWebIconFixtureIds = ["portability.non-web.icon.visible-label", "portability.non-web.icon.no-glyph-substitution", "portability.non-web.icon.vector-hash-and-text-equivalent"];
  const referencePortabilityFixtureIds = (record) => {
    if (record.authoringPlatform === "browser") return [];
    const fixtureIds = [];
    for (const mappingId of record.requirements.nativeFontMappingIds ?? []) pushUnique(fixtureIds, nativeMappingById.get(mappingId)?.requiredFixtureIds ?? []);
    for (const bindingId of record.requirements.identityTypographyBindingIds ?? []) pushUnique(fixtureIds, identityTypographyBindingById.get(bindingId)?.requiredFixtureIds ?? []);
    pushUnique(fixtureIds, nonWebIconFixtureIds);
    return fixtureIds;
  };
  const build = readJson("build-card.example.json");
  const presetFiles = listFiles().filter((name) => /^format-implementation\..*example\.json$/u.test(name) || name === "format-implementation.example.json");
  let recomputed = 0;
  for (const name of presetFiles) {
    const preset = readJson(name);
    const context = preset.resolutionContext;
    const card = { formatProfile: preset.formatProfile, runtime: preset.runtime, targetProfileRef: preset.targetProfileRef, experienceProfile: context.experienceProfile, secondaryExperienceProfiles: context.secondaryExperienceProfiles ?? [], capabilities: context.capabilities ?? [], sideBookmarkSelected: context.sideBookmarkSelected === true, deliveryAudience: name === "format-implementation.example.json" ? build.audienceOutput?.deliveryAudience : "public" };
    const portability = name === "format-implementation.example.json" ? (preset.requirements.portabilityFixtureIds ?? []) : referencePortabilityFixtureIds(preset);
    const rules = resolveRules(card);
    const tests = resolveTests(card, portability);
    if (JSON.stringify(rules) !== JSON.stringify(preset.requirements.resolvedRuleIds) || JSON.stringify(tests) !== JSON.stringify(preset.requirements.resolvedTestIds)) recomputed++;
    preset.requirements.portabilityFixtureIds = portability;
    preset.requirements.resolvedRuleIds = rules;
    preset.requirements.resolvedTestIds = tests;
    preset.requirements.accessibilityFixtureIds = formatPacks.accessibilityFixtureIdsByConformanceVariant[`${preset.formatProfile}.${preset.runtime}`];
    writeJson(name, preset);
  }
  const webPreset = readJson("format-implementation.example.json");
  const manifest = readJson("artifact-manifest.example.json");
  manifest.delivery.metadataProjection = JSON.parse(JSON.stringify(build.publication.discovery)); // the manifest projects the Build Card discovery contract verbatim (0.9.4 adds iconSetId and titlePattern)
  manifest.resolution.resolvedRuleIds = [...webPreset.requirements.resolvedRuleIds];
  manifest.resolution.resolvedTestIds = [...webPreset.requirements.resolvedTestIds];
  manifest.resolution.nonApplicableRuleIds = allRuleIds.filter((id) => !manifest.resolution.resolvedRuleIds.includes(id));
  writeJson("artifact-manifest.example.json", manifest);
  note(`resolution recompute: ${presetFiles.length} reference records (${recomputed} changed) and the artifact manifest example resolve ${webPreset.requirements.resolvedRuleIds.length} rules / ${webPreset.requirements.resolvedTestIds.length} tests for the web reference; ${manifest.resolution.nonApplicableRuleIds.length} rules non-applicable`);
}

// top-level lifecycle status of the governed documents
for (const name of STATUS_FLIP_DOCS) {
  const doc = readJson(name);
  if (doc.status !== "candidate") throw new Error(`${name}: expected status candidate, found ${doc.status}`);
  doc.status = "active";
  if (name === "tokens.v0.9.4.json") {
    if (doc.projection?.canonicalColorRegistry?.embeddedMetadataRole !== "candidate_registry") throw new Error("tokens: unexpected embeddedMetadataRole");
    doc.projection.canonicalColorRegistry.embeddedMetadataRole = "historical_provenance_only";
  }
  if (name === "migration-ledger.json") {
    if (doc.releaseRef?.authoringRevision !== OLD_REV || doc.releaseRef?.machinePackage !== OLD_REF) throw new Error("migration ledger: unexpected release tuple");
    doc.releaseRef.authoringRevision = NEW_REV;
    doc.releaseRef.machinePackage = NEW_REF;
    const stage = `${OLD_REV} → ${NEW_REV} (freeze ${NEW_REF}; provenance-only edits, no rule text changed)`;
    for (const edit of freezeLedger.edits) {
      doc.sentenceLedger.push({ stage, editId: `S5-${String(edit.edit).padStart(2, "0")}`, rule: edit.rule ?? null, kind: edit.kind, superseded: null, oldText: edit.old ?? null, newText: edit.new, reason: edit.reason, affects: edit.affects ?? [] });
    }
  }
  writeJson(name, doc);
}
note(`status candidate → active in ${STATUS_FLIP_DOCS.length} governed documents; tokens embeddedMetadataRole → historical_provenance_only; sentence ledger stage 5 appended (${freezeLedger.edits.length} edits)`);

// ---------------------------------------------------------------------------------------------------------------------
// 6. release.json for the frozen package (final before any attestation is signed; no package hash is embedded here)
// ---------------------------------------------------------------------------------------------------------------------
const release = JSON.parse(JSON.stringify(candidateRelease)); // historical prose (owner decisions, carry-forward policy) keeps the candidate literal on purpose
const tuple = release.release;
release.carriedForward.policy = `${release.carriedForward.policy}; at the freeze the release literal ${OLD_REF} → ${NEW_REF} was rewritten the same way (one identity field per file) and every embedded hash binding was recomputed again from the frozen bytes`;
tuple.authoringRevision = NEW_REV;
tuple.machinePackage = NEW_REF;
tuple.status = "active";
tuple.effective = true;
tuple.ownerApproval = { ...tuple.ownerApproval, attestationRef: ATTESTATIONS.releaseApproval.file, scope: "approval of the 0.9.4 text and values, given on the condition that every gate passes (contrast-evidence.json: result PASS, 0 undeclared failures); active and effective through this frozen immutable package v0.9.4-mp1, whose release-approval attestation signs this record" };
delete tuple.candidateOf;
tuple.frozenFrom = frozenFrom;
tuple.frozenBy = { tool: "freeze-release.mjs", operator: ISSUER_ID, keyId: KEY_ID, note: "run by the release operator with the Ed25519 key pinned in owner-trust/v0.9.4; the private key never enters the package or the kit; every attestation's issuedAt is the operator's signing time passed as --issued-at" };
tuple.releaseDate = RELEASE_DATE;
tuple.releaseDateBasis = `owner approval and declaration of ${RELEASE_DATE} (${OWNER_EVIDENCE_REF}); the release operator's signing time is the issuedAt of the nine detached attestations`;
tuple.note = "First effective v0.9.4 release, frozen from the owner-approved candidate v0.9.4-mp0-candidate (0.9.4-r1) as 0.9.4-r2: the r2 handoff (DATAVIZ-02, DATAVIZ-03, GATE-01, MOTION-04, MOTIF-01…05, FAVICON-01, SOCIALFMT-01 amendment, EVID-05), the 0.9.3-r2 revision (MOTIF-06) and the board delta 0.9.2-r2 → 0.9.4-r1 (DATAVIZ-04 hue windows, DATAVIZ-03 warm lane + D-STEP-03, DATAVIZ-05 series v7 with the A5.2 ink amendment, V-POLE-01 fix, color-srgb-07). The owner-finalization condition is enforced by OUTPUT-CLARITY-01: unresolved workflow residue blocks public delivery instead of appearing as audience-visible caveats. This package supersedes v0.9.1-mp7 as the effective Design System release; 0.9.4-r2 changes no rule text (provenance-only edits recorded as sentence-ledger stage 5).";
release.sets.color = { ...release.sets.color, disposition: "new_approved", embeddedMetadataPrecedence: "The three color-srgb-07 registry files are byte-identical to the approved candidate's so that color-srgb-07 has exactly one byte identity (ship-color-set-with-release-parity); the lifecycle text embedded in them (status candidate, 0.9.4-r1) records their candidate provenance only. release.json is the sole authority for the current release lifecycle and package-validation state." };
release.sets.motion = { ...release.sets.motion, disposition: "new_approved" };
release.humanMachineParity = { automaticScope: release.humanMachineParity.automaticScope, semanticScope: release.humanMachineParity.semanticScope, semanticReview: "required_manual_owner_review", approvedBy: tuple.ownerApproval.approvedBy, approvedAt: tuple.ownerApproval.approvedAt, evidenceRef: tuple.ownerApproval.evidenceRef, scope: "the owner approved the 0.9.4 candidate text and values on 17 September 2026 (as the v0.9.1 approval of 1 September 2026 was recorded for v0.9.1-mp7); every new or amended rule sentence of 0.9.4 is the board delta verbatim; the freeze changes no rule text. A separate bilingual re-read of the assembled master by the owner is listed under postApprovalFollowUps and is not claimed here." };
release.files = {};
const filesAtFreeze = [...listFiles(), "release.json", "SHA256SUMS.txt", ...Object.values(ATTESTATIONS).map((a) => a.file)].filter((name, index, all) => all.indexOf(name) === index).sort();
for (const name of filesAtFreeze) { const key = FILE_KEYS[name]; if (!key) throw new Error(`no release.files key for ${name}`); if (release.files[key]) throw new Error(`duplicate release.files key ${key}`); release.files[key] = name; }
release.frozenAtFreeze = {
  attestations: Object.values(ATTESTATIONS).map((a) => a.file).sort(),
  tools: { validator: "validate-v0.9.4.mjs (port of validate-v0.9.1.mjs; the artifact-level 0.9.4 rules FAVICON-01, SOCIALFMT-01 OG target, MOTION-04 and MOTIF-01…06 are checked on artifact bytes by build-kit/preflight-0.9.4.mjs, which the validator does not replace)", releaseFreezer: "freeze-release.mjs", attestationSigner: "sign-verification-attestation.mjs" },
  removed: REMOVED_AT_FREEZE,
  byteIdenticalWithCandidate: BYTE_IDENTICAL_AT_FREEZE,
  contractRepairs,
  resolutionRecomputed: "reference format-implementation records and the artifact manifest example carry the rule and test ids resolved by the frozen packs"
};
release.postApprovalFollowUps = (release.pendingAtFreeze?.reviews ?? []).filter((item) => !/^Ed25519 signatures/u.test(item) && !/^owner bilingual semantic review/u.test(item));
release.postApprovalFollowUps.unshift("owner bilingual re-read of the assembled 0.9.4 master (PARITY-01-B); the approval of 17 September 2026 is recorded as the review of the delta text and values");
release.postApprovalFollowUps.push("validate-v0.9.4.mjs: extend the artifact-bundle fixtures and web initial-HTML checks to the 0.9.4 artifact rules (FAVICON-01, the OG target, MOTION-04, MOTIF-01…06), which build-kit/preflight-0.9.4.mjs checks on artifact bytes today");
delete release.pendingAtFreeze;
release.integrity = { algorithm: "sha256", receipt: "SHA256SUMS.txt", coverage: "Every authoritative filename declared in release.files except SHA256SUMS.txt and package-root.attestation.json; those two non-circular checksum/signature mechanics are excluded and the detached package-root attestation signs SHA256SUMS.txt.", pathPolicy: release.integrity.pathPolicy };
delete release.promotionGate.candidateStatus;
writeJson("release.json", release);
note(`release.json: ${NEW_REF} active/effective, ${Object.keys(release.files).length} files declared, owner approval ${tuple.ownerApproval.approvedAt}, release date ${RELEASE_DATE}`);

// ---------------------------------------------------------------------------------------------------------------------
// 7. Example chronology, attestation chain and embedded hash rebinding (deterministic, converging)
// ---------------------------------------------------------------------------------------------------------------------
const packageFile = (value) => { const f = String(value ?? "").split("#", 1)[0]; return f && !f.includes("/") && existsSync(jsonPath(f)) && statSync(jsonPath(f)).isFile() ? f : null; };
const schemaFileForUrl = (() => {
  const base = "https://landometer.org/design-system/0.9.4/";
  return (value) => { const match = String(value ?? "").match(new RegExp(`^${base.replace(/[.]/gu, "\\.")}([a-z0-9-]+)\\.schema\\.[0-9.]+\\.json(?:#.*)?$`, "u")); if (!match) return null; const name = `${match[1]}.schema.json`; return existsSync(jsonPath(name)) ? name : null; };
})();
const REBOUND_DOCS = () => listFiles().filter((name) => name.endsWith(".example.json") || name === "asset-registry.json" || name === "asset-approval-receipt.json" || name === "format-packs.json");
const rebindAll = (label) => {
  let total = 0; let pass = 0; let changedInPass = 1; const untouched = new Set();
  const rebindNode = (node, file) => {
    if (Array.isArray(node)) { node.forEach((n) => rebindNode(n, file)); return; }
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string" && /(^ref$|Ref$)/u.test(key)) {
        // Build Card assetRegistries entries pair registryRef with a plain sha256 (v0.9.1-mp7 shape); every other pair is <name>Ref / <name>Sha256
        const shaKey = key === "ref" || (key === "registryRef" && !Object.hasOwn(node, "registrySha256")) ? "sha256" : key.replace(/Ref$/u, "Sha256");
        if (!Object.hasOwn(node, shaKey) || typeof node[shaKey] !== "string") continue;
        const target = packageFile(value) ?? schemaFileForUrl(value);
        if (!target) { untouched.add(`${file}: ${key}=${value}`); continue; }
        if (target === file) continue;
        const digest = shaFile(target);
        if (node[shaKey] !== digest) { node[shaKey] = digest; total++; changedInPass++; }
      }
      rebindNode(value, file);
    }
  };
  while (changedInPass && pass < 8) {
    changedInPass = 0; pass++;
    for (const name of REBOUND_DOCS()) {
      const doc = readJson(name);
      if (name === "format-packs.json") {
        for (const overlay of doc.overlays ?? []) {
          const schema = ["claims", "evidence"].includes(overlay.capability) ? "claim-manifest.schema.json" : overlay.capability === "agent_action" ? "agent-action-definition.schema.json" : "capability-config.schema.json";
          const digest = shaFile(schema);
          if (overlay.configSchemaSha256 !== digest) { overlay.configSchemaSha256 = digest; total++; changedInPass++; }
        }
      } else rebindNode(doc, name);
      if (name === "artifact-manifest.example.json") {
        const tupleHash = shaBytes(Buffer.from(canonicalAttestationJson({ authoringRevision: NEW_REV, dsVersion: DS_VERSION, machinePackage: NEW_REF, rulesetId: RULESET }), "utf8"));
        if (doc.release?.releaseRef !== NEW_REF || doc.release?.releaseTupleSha256 !== tupleHash) { doc.release = { releaseRef: NEW_REF, releaseTupleSha256: tupleHash }; total++; changedInPass++; }
      }
      writeJson(name, doc);
    }
  }
  if (changedInPass) throw new Error(`hash rebind (${label}) did not converge`);
  note(`hash rebind (${label}): ${total} bindings recomputed in ${pass} pass(es); ${untouched.size} refs are not package files (bundle paths) and stay as declared`);
  return untouched;
};
function writeAttestation(entry) {
  const attestation = {
    schemaVersion: "1.1", releaseRef: NEW_REF, attestationId: entry.id, purpose: entry.purpose,
    subject: { ref: entry.subject, sha256: shaFile(entry.subject), mediaType: entry.mediaType ?? "application/json" },
    issuerId: ISSUER_ID, keyId: KEY_ID, issuedAt, expiresAt: null, signatureAlgorithm: "Ed25519", signatureEncoding: "base64", signature: ""
  };
  const payload = Buffer.from(canonicalAttestationJson(attestationSigningPayload(attestation)), "utf8");
  attestation.signature = sign(null, payload, privateKey).toString("base64");
  writeJson(entry.file, attestation);
  return attestation;
}
const assertAttestationFresh = (entry) => { const attestation = readJson(entry.file); if (attestation.subject.sha256 !== shaFile(entry.subject)) throw new Error(`${entry.file}: its subject ${entry.subject} changed after signing`); };

// 7a. the examples that are signed first are leaves: the claim record, the evidence capture (captures release.json), the
//     disclosure authority, the asset approval receipt and the conformance receipt example
const capture = readJson("claim-evidence-capture.example.json");
if (capture.contentRef !== "release.json") throw new Error("claim-evidence-capture.example.json: expected contentRef release.json");
capture.captureId = `capture.owner-approval.protected-line.${NEW_REF}`;
capture.sourceRef = OWNER_EVIDENCE_REF;
capture.capturedAt = issuedAt;
capture.contentSha256 = shaFile("release.json");
capture.contentByteCount = statSync(jsonPath("release.json")).size;
writeJson("claim-evidence-capture.example.json", capture);
const receipt = readJson("asset-approval-receipt.json");
if (receipt.releaseRef !== NEW_REF) throw new Error("asset-approval-receipt.json: releaseRef not rewritten");
writeJson("asset-approval-receipt.json", receipt);
const conformanceReceipt = readJson("conformance-receipt.example.json");
if (conformanceReceipt.attestationRef !== ATTESTATIONS.conformance.file) throw new Error("conformance-receipt.example.json: attestationRef drifted");
writeJson("conformance-receipt.example.json", conformanceReceipt);
for (const key of ["claimApproval", "claimEvidence", "disclosure", "assetApproval", "conformance"]) writeAttestation(ATTESTATIONS[key]);
note("signed the five leaf attestations (claim approval, claim evidence capture, disclosure authority, asset approval, conformance receipt example)");
// 7b. bind those attestations and every other embedded hash: claim manifest, asset registry, build card, artifact manifest …
rebindAll("after the leaf attestations");
// 7c. the pre-start revocation decision is checked at the signing time and signed; the authority binds it; the agent action binds the authority
const revocation = readJson("agent-action-revocation.example.json");
revocation.checkedAt = issuedAt;
writeJson("agent-action-revocation.example.json", revocation);
rebindAll("before the revocation attestation");
writeAttestation(ATTESTATIONS.agentRevocation);
rebindAll("after the revocation attestation");
writeAttestation(ATTESTATIONS.agentAuthority);
const untouched = rebindAll("after the authority attestation");
// 7d. nothing may move any more: every signed subject must still match, release.json must be untouched
for (const key of ["claimApproval", "claimEvidence", "disclosure", "assetApproval", "conformance", "agentRevocation", "agentAuthority"]) assertAttestationFresh(ATTESTATIONS[key]);
if (JSON.stringify(readJson("release.json")) !== JSON.stringify(release)) throw new Error("release.json changed during the rebind");
writeAttestation(ATTESTATIONS.releaseApproval);
note("signed the release-approval attestation over release.json");

// ---------------------------------------------------------------------------------------------------------------------
// 8. Hygiene: no candidate literal, no pending-signature wording, no orphan declarations
// ---------------------------------------------------------------------------------------------------------------------
// machine contracts carry the candidate literal only as recorded lineage: release.json (frozenFrom, owner decisions, carry-forward
// policy) and migration-ledger.json (superseded-candidate note, verbatim candidate sentences); every other contract names v0.9.4-mp1 only.
for (const name of listFiles()) {
  if (BINARY.test(name) || BYTE_IDENTICAL_AT_FREEZE.includes(name) || name === SELF || KIT_FILES.includes(name) || NOT_BLANKET_REWRITTEN.includes(name)) continue;
  if (readText(name).includes(OLD_REF)) throw new Error(`${name} still carries the candidate literal ${OLD_REF}`);
}
for (const name of ["rule-catalog.json", "tokens.v0.9.4.json", "asset-registry.json", "format-packs.json", "format-kits.json", "target-profiles.json", "component-contracts.v0.9.4.json", "motif-register.v0.9.4.json", "contrast-evidence.json"]) {
  if (readJson(name).releaseRef !== NEW_REF) throw new Error(`${name}: releaseRef is not ${NEW_REF}`);
}
{
  const declared = Object.values(release.files).sort();
  const presentNow = [...listFiles(), "SHA256SUMS.txt", ATTESTATIONS.packageRoot.file].filter((name, index, all) => all.indexOf(name) === index).sort();
  if (JSON.stringify(declared) !== JSON.stringify(presentNow)) throw new Error(`release.files and the package closure differ before the checksum receipt (declared ${declared.length}, present ${presentNow.length}): ${declared.filter((n) => !presentNow.includes(n)).join(", ")} | ${presentNow.filter((n) => !declared.includes(n)).join(", ")}`);
}

// ---------------------------------------------------------------------------------------------------------------------
// 9. Checksum receipt and the detached package-root attestation
// ---------------------------------------------------------------------------------------------------------------------
const checksumMechanics = new Set(["SHA256SUMS.txt", ATTESTATIONS.packageRoot.file]);
const checksumLines = Object.values(release.files).filter((name) => !checksumMechanics.has(name)).sort().map((name) => `${shaFile(name)}  ${name}`);
writeText("SHA256SUMS.txt", `${checksumLines.join("\n")}\n`);
writeAttestation(ATTESTATIONS.packageRoot);
const finalPresent = listFiles();
if (JSON.stringify(finalPresent) !== JSON.stringify([...Object.values(release.files)].sort())) throw new Error("Final package closure differs from release.files after package-root signing");
for (const entry of Object.values(ATTESTATIONS)) assertAttestationFresh(entry);
const receiptOut = {
  frozen: NEW_REF, dsVersion: DS_VERSION, authoringRevision: NEW_REV, rulesetId: RULESET, issuedAt,
  signingKeySpkiSha256: signingKeyFingerprint, issuerId: ISSUER_ID, keyId: KEY_ID,
  files: finalPresent.length, checksummedFiles: checksumLines.length, checksumsSha256: shaFile("SHA256SUMS.txt"), packageRootSubjectSha256: readJson(ATTESTATIONS.packageRoot.file).subject.sha256,
  releaseJsonSha256: shaFile("release.json"), masterSha256: shaFile(MASTER), frozenFrom,
  untouchedRefs: [...untouched].sort(), log
};
writeFileSync(join(dirname(packageDir), `FREEZE-RECEIPT-${NEW_REF}.json`), `${JSON.stringify(receiptOut, null, 2)}\n`, "utf8");
note(`Frozen ${finalPresent.length} declared files for ${NEW_REF}; SHA256SUMS.txt ${receiptOut.checksumsSha256}; signing key ${signingKeyFingerprint}; receipt written beside the package.`);
