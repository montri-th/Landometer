#!/usr/bin/env node

import { createHash, createPublicKey, generateKeyPairSync, sign as signSignature } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { deflateSync } from "node:zlib";
import { canonicalAttestationJson, verifyDetachedAttestation } from "./verify-attestation.mjs";

const packageDir = dirname(fileURLToPath(import.meta.url));
const cliUsage = "Usage: node validate-v0.9.4.mjs --package-trust-store <external-json> --package-trust-policy <external-json> [--bundle <dir> --build-card <relative> --artifact-manifest <relative> [--agent-action <relative>] [--trust-store <external-json> --trust-policy <external-json>]]";

function parseCliArguments(argv) {
  if (argv.length === 0) return { mode: "self", errors: [] };
  if (argv.length === 1 && ["--help", "-h"].includes(argv[0])) return { mode: "help", errors: [] };
  const names = new Map([
    ["--bundle", "bundle"],
    ["--build-card", "buildCard"],
    ["--artifact-manifest", "artifactManifest"],
    ["--agent-action", "agentAction"],
    ["--trust-store", "trustStore"],
    ["--trust-policy", "trustPolicy"],
    ["--package-trust-store", "packageTrustStore"],
    ["--package-trust-policy", "packageTrustPolicy"]
  ]);
  const result = { mode: "self", errors: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    const key = names.get(option);
    if (!key) {
      result.errors.push(`unknown option ${option}`);
      continue;
    }
    const value = argv[index + 1];
    if (typeof value !== "string" || value.length === 0 || value.startsWith("--")) {
      result.errors.push(`${option} requires a value`);
      continue;
    }
    if (Object.hasOwn(result, key)) result.errors.push(`${option} may be supplied only once`);
    else result[key] = value;
    index += 1;
  }
  const downstreamKeys = ["bundle", "buildCard", "artifactManifest", "agentAction", "trustStore", "trustPolicy"];
  if (downstreamKeys.some((key) => Object.hasOwn(result, key))) {
    result.mode = "downstream";
    for (const [option, key] of [["--bundle", "bundle"], ["--build-card", "buildCard"], ["--artifact-manifest", "artifactManifest"]]) {
      if (!Object.hasOwn(result, key)) result.errors.push(`${option} is required in downstream mode`);
    }
  }
  return result;
}

const cliRequest = parseCliArguments(process.argv.slice(2));
const downstreamMode = cliRequest.mode === "downstream";
const failures = [];
const warnings = [];
let checks = 0;
let adversarialChecks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function gatedDownstreamErrors(packageErrors, artifactErrors) {
  return [...new Set([
    ...(packageErrors ?? []).map((message) => `Active Design System package integrity: ${message}`),
    ...(artifactErrors ?? [])
  ])];
}

function textFile(filename) {
  try {
    return readFileSync(join(packageDir, filename), "utf8").replace(/^\uFEFF/, "");
  } catch (error) {
    failures.push(`${filename}: unreadable (${error.message})`);
    return "";
  }
}

function jsonFile(filename) {
  try {
    return JSON.parse(textFile(filename));
  } catch (error) {
    failures.push(`${filename}: invalid JSON (${error.message})`);
    return null;
  }
}

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function sha256File(filename) {
  return sha256Bytes(readFileSync(filename));
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

const fixtureExternalTrustStores = new Map();

function externalTrustStoresForRoot(root) {
  if (!isNonEmpty(root)) return [];
  return fixtureExternalTrustStores.get(resolve(root)) ?? [];
}

function createSignedAttestation({ purpose, subjectRef, subjectSha256, mediaType = "application/json", attestationId, issuedAt, expiresAt = null }, signer) {
  const attestation = {
    schemaVersion: "1.1",
    releaseRef: "v0.9.4-mp1",
    attestationId,
    purpose,
    subject: { ref: subjectRef, sha256: subjectSha256, mediaType },
    issuerId: signer.issuerId,
    keyId: signer.keyId,
    issuedAt,
    expiresAt,
    signatureAlgorithm: "Ed25519",
    signatureEncoding: "base64"
  };
  const signature = signSignature(null, Buffer.from(canonicalAttestationJson(attestation), "utf8"), signer.privateKey).toString("base64");
  return { ...attestation, signature };
}

function sameValue(left, right) {
  return canonicalJson(left) === canonicalJson(right);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmpty(value) {
  return typeof value === "string" && /\S/.test(value);
}

function unique(values) {
  return Array.isArray(values) && new Set(values.map(canonicalJson)).size === values.length;
}

function pointer(root, ref) {
  if (!ref.startsWith("#/")) throw new Error(`only local JSON Pointer refs are supported (${ref})`);
  let value = root;
  for (const raw of ref.slice(2).split("/")) {
    const key = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (!isObject(value) && !Array.isArray(value)) throw new Error(`unresolvable ref ${ref}`);
    value = value[key];
  }
  if (value === undefined) throw new Error(`unresolvable ref ${ref}`);
  return value;
}

function resolveJsonPointerFragment(document, fragment) {
  if (fragment === undefined || fragment === "") return document;
  if (!fragment.startsWith("/")) return null;
  try {
    return pointer(document, `#${fragment}`);
  } catch {
    return null;
  }
}

function typeMatches(value, type) {
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return isObject(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  return typeof value === type;
}

function validateSchema(schema, value, root = schema, instancePath = "$", schemaPath = "#") {
  const errors = [];
  const add = (message) => errors.push(`${instancePath}: ${message} (${schemaPath})`);

  if (schema === true) return errors;
  if (schema === false) {
    add("boolean schema rejects the value");
    return errors;
  }
  if (!isObject(schema)) {
    add("schema node is not an object or boolean");
    return errors;
  }

  if (schema.$ref) {
    try {
      errors.push(...validateSchema(pointer(root, schema.$ref), value, root, instancePath, schema.$ref));
    } catch (error) {
      add(error.message);
    }
  }

  if (Array.isArray(schema.allOf)) {
    schema.allOf.forEach((part, index) => errors.push(...validateSchema(part, value, root, instancePath, `${schemaPath}/allOf/${index}`)));
  }
  if (Array.isArray(schema.anyOf)) {
    const branches = schema.anyOf.map((part, index) => validateSchema(part, value, root, instancePath, `${schemaPath}/anyOf/${index}`));
    if (!branches.some((branch) => branch.length === 0)) add("does not satisfy anyOf");
  }
  if (Array.isArray(schema.oneOf)) {
    const passing = schema.oneOf.filter((part, index) => validateSchema(part, value, root, instancePath, `${schemaPath}/oneOf/${index}`).length === 0).length;
    if (passing !== 1) add(`must satisfy exactly one oneOf branch; satisfied ${passing}`);
  }
  if (schema.not && validateSchema(schema.not, value, root, instancePath, `${schemaPath}/not`).length === 0) add("matches prohibited not schema");
  if (schema.if) {
    const matches = validateSchema(schema.if, value, root, instancePath, `${schemaPath}/if`).length === 0;
    if (matches && schema.then) errors.push(...validateSchema(schema.then, value, root, instancePath, `${schemaPath}/then`));
    if (!matches && schema.else) errors.push(...validateSchema(schema.else, value, root, instancePath, `${schemaPath}/else`));
  }

  if (Object.hasOwn(schema, "const") && !sameValue(value, schema.const)) add(`must equal const ${JSON.stringify(schema.const)}`);
  if (Array.isArray(schema.enum) && !schema.enum.some((entry) => sameValue(value, entry))) add("is not in enum");

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => typeMatches(value, type))) {
      add(`must be ${types.join(" or ")}`);
      return errors;
    }
  }

  if (isObject(value)) {
    if (Number.isInteger(schema.minProperties) && Object.keys(value).length < schema.minProperties) add(`must have at least ${schema.minProperties} properties`);
    if (Number.isInteger(schema.maxProperties) && Object.keys(value).length > schema.maxProperties) add(`must have at most ${schema.maxProperties} properties`);
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) errors.push(`${instancePath}: missing required property ${required} (${schemaPath}/required)`);
    }
    const properties = schema.properties ?? {};
    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.hasOwn(value, key)) errors.push(...validateSchema(childSchema, value[key], root, `${instancePath}/${key}`, `${schemaPath}/properties/${key}`));
    }
    const patternProperties = schema.patternProperties ?? {};
    const compiledPatterns = [];
    for (const [pattern, childSchema] of Object.entries(patternProperties)) {
      try {
        compiledPatterns.push([new RegExp(pattern, "u"), childSchema, pattern]);
      } catch (error) {
        errors.push(`${instancePath}: invalid schema pattern ${pattern}: ${error.message}`);
      }
    }
    for (const [key, child] of Object.entries(value)) {
      const matchingPatterns = compiledPatterns.filter(([regex]) => regex.test(key));
      matchingPatterns.forEach(([, childSchema, pattern]) => errors.push(...validateSchema(childSchema, child, root, `${instancePath}/${key}`, `${schemaPath}/patternProperties/${pattern}`)));
      const declared = Object.hasOwn(properties, key) || matchingPatterns.length > 0;
      if (!declared && schema.additionalProperties === false) errors.push(`${instancePath}/${key}: undeclared property (${schemaPath}/additionalProperties)`);
      if (!declared && isObject(schema.additionalProperties)) errors.push(...validateSchema(schema.additionalProperties, child, root, `${instancePath}/${key}`, `${schemaPath}/additionalProperties`));
    }
  }

  if (Array.isArray(value)) {
    if (Number.isInteger(schema.minItems) && value.length < schema.minItems) add(`must contain at least ${schema.minItems} items`);
    if (Number.isInteger(schema.maxItems) && value.length > schema.maxItems) add(`must contain at most ${schema.maxItems} items`);
    if (schema.uniqueItems === true && !unique(value)) add("items must be unique");
    if (schema.items) value.forEach((item, index) => errors.push(...validateSchema(schema.items, item, root, `${instancePath}/${index}`, `${schemaPath}/items`)));
    if (schema.contains) {
      const matches = value.filter((item, index) => validateSchema(schema.contains, item, root, `${instancePath}/${index}`, `${schemaPath}/contains`).length === 0).length;
      const minimum = schema.minContains ?? 1;
      const maximum = schema.maxContains ?? Number.POSITIVE_INFINITY;
      if (matches < minimum || matches > maximum) add(`contains match count ${matches} is outside ${minimum}..${maximum}`);
    }
  }

  if (typeof value === "string") {
    const length = [...value].length;
    if (Number.isInteger(schema.minLength) && length < schema.minLength) add(`must have length at least ${schema.minLength}`);
    if (Number.isInteger(schema.maxLength) && length > schema.maxLength) add(`must have length at most ${schema.maxLength}`);
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern, "u").test(value)) add(`does not match pattern ${schema.pattern}`);
      } catch (error) {
        add(`invalid schema pattern ${schema.pattern}: ${error.message}`);
      }
    }
    if (schema.format === "date-time") {
      const looksLikeDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value);
      if (!looksLikeDateTime || Number.isNaN(Date.parse(value))) add("must be an RFC 3339 date-time");
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (typeof schema.minimum === "number" && value < schema.minimum) add(`must be >= ${schema.minimum}`);
    if (typeof schema.maximum === "number" && value > schema.maximum) add(`must be <= ${schema.maximum}`);
  }
  return errors;
}

function inspectSchemaDocument(schema, filename) {
  check(schema?.$schema === "https://json-schema.org/draft/2020-12/schema", `${filename}: must declare Draft 2020-12`);
  check(isNonEmpty(schema?.$id), `${filename}: $id is required`);
  const refs = [];
  const patterns = [];
  const walk = (node, schemaPath = "#") => {
    if (!isObject(node) && !Array.isArray(node)) return;
    if (isObject(node)) {
      if (typeof node.$ref === "string") refs.push([node.$ref, schemaPath]);
      if (typeof node.pattern === "string") patterns.push([node.pattern, `${schemaPath}/pattern`]);
      for (const [key, value] of Object.entries(node)) walk(value, `${schemaPath}/${key}`);
    } else node.forEach((value, index) => walk(value, `${schemaPath}/${index}`));
  };
  walk(schema);
  for (const [ref, schemaPath] of refs) {
    try {
      pointer(schema, ref);
      check(true, `${filename}: ${schemaPath} ref resolves`);
    } catch (error) {
      check(false, `${filename}: ${schemaPath} ${error.message}`);
    }
  }
  for (const [pattern, schemaPath] of patterns) {
    try {
      new RegExp(pattern, "u");
      check(true, `${filename}: ${schemaPath} regex compiles`);
    } catch (error) {
      check(false, `${filename}: ${schemaPath} invalid regex (${error.message})`);
    }
  }
}

const release = jsonFile("release.json");
if (!release) {
  console.error(failures.join("\n"));
  process.exit(1);
}

const tuple = release.release ?? {};
const releaseRef = tuple.machinePackage;
const protectedBrandLines = {
  north_star: "Visualize City, Shape Tomorrow.",
  promise: "Measure What Matters. Make It Actionable.",
  cultural_activation: "Let us cultivate our city with data."
};
const files = release.files ?? {};
const declaredNames = Object.values(files);
const checksumName = files.checksums;

check(isNonEmpty(tuple.dsVersion), "release.json: dsVersion is required");
check(release.schemaVersion === "1.5", "release.json: release-document schemaVersion must be 1.5");
check(isNonEmpty(tuple.authoringRevision), "release.json: authoringRevision is required");
check(isNonEmpty(tuple.rulesetId), "release.json: rulesetId is required");
check(isNonEmpty(releaseRef), "release.json: machinePackage is required");
check(tuple.status === "active", "release.json: this package must remain active");
check(tuple.effective === true, "release.json: active release must be effective");
check(tuple.ownerApproval?.status === "approved", "release.json: active release must record owner approval");
check(isNonEmpty(tuple.ownerApproval?.approvedBy), "release.json: active release approver is required");
check(isNonEmpty(tuple.ownerApproval?.approvedAt) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(tuple.ownerApproval.approvedAt) && !Number.isNaN(Date.parse(tuple.ownerApproval.approvedAt)), "release.json: active release approval time must be RFC 3339");
check(isNonEmpty(tuple.ownerApproval?.evidenceRef), "release.json: owner approval evidence ref is required");
check(tuple.ownerApproval?.conditionImplementedBy === "OUTPUT-CLARITY-01", "release.json: owner finalization condition must resolve OUTPUT-CLARITY-01");
check(release.promotionGate?.selfPromotionForbidden === true, "release.json: self-promotion must remain forbidden");
check(release.promotionGate?.unresolvedDependencyBehavior === "block_or_internal_preview", "release.json: unresolved dependencies must block or remain internal previews");
check(release.integrity?.algorithm === "sha256", "release.json: checksum algorithm must be sha256");
check(release.integrity?.receipt === checksumName, "release.json: integrity receipt must match release.files.checksums");
check(unique(declaredNames), "release.json: declared filenames must be unique");
for (const filename of declaredNames) {
  check(typeof filename === "string" && filename === basename(filename) && !filename.includes(".."), `release.json: unsafe or nested package filename ${String(filename)}`);
  check(existsSync(join(packageDir, filename)), `release.json: declared file ${filename} is missing`);
}

const packageEntries = readdirSync(packageDir, { withFileTypes: true });
for (const entry of packageEntries) check(entry.isFile() && !entry.isSymbolicLink(), `package closure: ${entry.name} is not a regular non-symlink file`);
const presentNames = packageEntries.map((entry) => entry.name).sort();
check(sameValue([...declaredNames].sort(), presentNames), `package closure: declared files and delivered files differ (declared ${declaredNames.length}, delivered ${presentNames.length})`);

const documents = new Map();
for (const filename of declaredNames.filter((name) => name.endsWith(".json"))) documents.set(filename, jsonFile(filename));
for (const [filename, document] of documents) {
  if (!document) continue;
  if (filename.endsWith(".schema.json")) inspectSchemaDocument(document, filename);
  else check(document.$schema !== "https://json-schema.org/draft/2020-12/schema", `${filename}: an instance must not claim the JSON Schema meta-schema as its own schema`);
}

const schemaPairs = [
  [files.buildCardSchema, files.buildCardExample],
  [files.artifactManifestSchema, files.artifactManifestExample],
  [files.conformanceReceiptSchema, files.conformanceReceiptExample],
  [files.claimRecordSchema, files.claimRecordExample],
  [files.claimManifestSchema, files.claimManifestExample],
  [files.agentActionSchema, files.agentActionExample],
  [files.agentActionDefinitionSchema, files.agentActionDefinitionExample],
  [files.agentActionAuthoritySchema, files.agentActionAuthorityExample],
  [files.agentActionRevocationSchema, files.agentActionRevocationExample],
  [files.agentActionInputExampleSchema, files.agentActionInputExample],
  [files.disclosureAuthoritySchema, files.disclosureAuthorityExample],
  [files.claimEvidenceCaptureSchema, files.claimEvidenceCaptureExample],
  [files.verificationAttestationSchema, files.releaseApprovalAttestation],
  [files.verificationAttestationSchema, files.assetApprovalAttestation],
  [files.verificationAttestationSchema, files.claimApprovalAttestation],
  [files.verificationAttestationSchema, files.claimEvidenceAttestation],
  [files.verificationAttestationSchema, files.disclosureAuthorityAttestation],
  [files.verificationAttestationSchema, files.agentAuthorityAttestation],
  [files.verificationAttestationSchema, files.agentRevocationAttestation],
  [files.verificationAttestationSchema, files.conformanceReceiptAttestation],
  [files.verificationAttestationSchema, files.packageRootAttestation],
  [files.crawlerPurposePolicySchema, files.crawlerPurposePolicyExample],
  [files.structuredDataProjectionSchema, files.structuredDataProjectionExample],
  [files.socialSidecarSchema, files.socialSidecarExample],
  [files.actionContractsSchema, files.actionContractsExample],
  [files.formatImplementationSchema, files.formatImplementationExample],
  [files.formatImplementationSchema, files.formatImplementationAppBrowserExample],
  [files.formatImplementationSchema, files.formatImplementationAppNativeExample],
  [files.formatImplementationSchema, files.formatImplementationDocumentFlowExample],
  [files.formatImplementationSchema, files.formatImplementationPdfFixedExample],
  [files.formatImplementationSchema, files.formatImplementationDeckPresentationExample],
  [files.formatImplementationSchema, files.formatImplementationSocialStaticExample],
  [files.assetRegistrySchema, files.assetRegistry],
  [files.assetApprovalReceiptSchema, files.assetApprovalReceipt],
  [files.targetProfilesSchema, files.targetProfiles],
  [files.formatKitsSchema, files.formatKits],
  [files.migrationLedgerSchema, files.migrationLedger]
];
for (const [schemaName, instanceName] of schemaPairs) {
  const schema = documents.get(schemaName);
  const instance = documents.get(instanceName);
  if (!schema || !instance) continue;
  const errors = validateSchema(schema, instance);
  check(errors.length === 0, `${instanceName}: schema validation failed${errors.length ? `\n  ${errors.slice(0, 12).join("\n  ")}` : ""}`);
}

const schemaIdentityPairs = [
  ["buildCard", files.buildCardSchema],
  ["artifactManifest", files.artifactManifestSchema],
  ["conformanceReceipt", files.conformanceReceiptSchema],
  ["claimRecord", files.claimRecordSchema],
  ["claimManifest", files.claimManifestSchema],
  ["agentAction", files.agentActionSchema],
  ["agentActionDefinition", files.agentActionDefinitionSchema],
  ["agentActionAuthority", files.agentActionAuthoritySchema],
  ["agentActionRevocation", files.agentActionRevocationSchema],
  ["agentActionReceipt", files.agentActionReceiptSchema],
  ["agentConfirmationReceipt", files.agentConfirmationReceiptSchema],
  ["crawlerPurposePolicy", files.crawlerPurposePolicySchema],
  ["structuredDataProjection", files.structuredDataProjectionSchema],
  ["socialSidecar", files.socialSidecarSchema],
  ["capabilityConfig", files.capabilityConfigSchema],
  ["actionContracts", files.actionContractsSchema],
  ["formatImplementation", files.formatImplementationSchema],
  ["assetRegistry", files.assetRegistrySchema],
  ["assetApprovalReceipt", files.assetApprovalReceiptSchema],
  ["disclosureAuthority", files.disclosureAuthoritySchema],
  ["sourceLineageReceipt", files.sourceLineageReceiptSchema],
  ["claimEvidenceCapture", files.claimEvidenceCaptureSchema],
  ["verificationAttestation", files.verificationAttestationSchema],
  ["verificationTrustStore", files.verificationTrustStoreSchema],
  ["verificationTrustPolicy", files.verificationTrustPolicySchema],
  ["promotionSnapshot", files.promotionSnapshotSchema],
  ["migrationLedger", files.migrationLedgerSchema],
  ["targetProfile", files.targetProfilesSchema],
  ["formatKit", files.formatKitsSchema]
];
const historicalIncompatibleSchemaIds = new Set([
  "https://landometer.org/design-system/0.9.1/build-card.schema.json",
  "https://landometer.org/design-system/0.9.1/artifact-manifest.schema.json",
  "https://landometer.org/design-system/0.9.1/claim-record.schema.json",
  "https://landometer.org/design-system/0.9.1/asset-registry.schema.json",
  "https://landometer.org/design-system/0.9.1/format-kits.schema.json"
]);
// every canonical id of the predecessor release and of the withdrawn/superseded candidates is retired for 0.9.4 contracts
const historicalIncompatibleSchemaIdPrefixes = ["https://landometer.org/design-system/0.9.0/", "https://landometer.org/design-system/0.9.1/", "https://landometer.org/design-system/0.9.2/", "https://landometer.org/design-system/0.9.3/"];
const currentSchemaIds = [];
for (const [name, filename] of schemaIdentityPairs) {
  const schemaId = documents.get(filename)?.$id;
  currentSchemaIds.push(schemaId);
  check(schemaId === release.schemaIds?.[name], `${filename}: canonical schema ID does not match release.json`);
  check(!historicalIncompatibleSchemaIds.has(schemaId) && !historicalIncompatibleSchemaIdPrefixes.some((prefix) => String(schemaId ?? "").startsWith(prefix)), `${filename}: incompatible active schema reuses a predecessor or candidate canonical ID`);
}
check(unique(currentSchemaIds), "release.json: canonical schema IDs must be unique");

const buildSchema = documents.get(files.buildCardSchema);
const build = documents.get(files.buildCardExample);
const catalog = documents.get(files.ruleCatalog);
const formatPacks = documents.get(files.formatPacks);
const tokens = documents.get(files.tokens);
const rawColorTokens = documents.get(files.colorRegistryTokens);
const targetProfiles = documents.get(files.targetProfiles);
const formatKits = documents.get(files.formatKits);
const targetProfilesSchema = documents.get(files.targetProfilesSchema);
const formatKitsSchema = documents.get(files.formatKitsSchema);
const assetRegistry = documents.get(files.assetRegistry);
const assetRegistrySchema = documents.get(files.assetRegistrySchema);
const migration = documents.get(files.migrationLedger);
const claimRecord = documents.get(files.claimRecordExample);
const claimManifest = documents.get(files.claimManifestExample);
const claimRecordSchema = documents.get(files.claimRecordSchema);
const claimManifestSchema = documents.get(files.claimManifestSchema);
const artifactManifest = documents.get(files.artifactManifestExample);
const conformanceReceiptSchema = documents.get(files.conformanceReceiptSchema);
const conformanceReceiptExample = documents.get(files.conformanceReceiptExample);
const agentAction = documents.get(files.agentActionExample);
const agentActionDefinition = documents.get(files.agentActionDefinitionExample);
const agentActionAuthority = documents.get(files.agentActionAuthorityExample);
const agentActionRevocation = documents.get(files.agentActionRevocationExample);
const agentActionDefinitionSchema = documents.get(files.agentActionDefinitionSchema);
const agentActionAuthoritySchema = documents.get(files.agentActionAuthoritySchema);
const agentActionRevocationSchema = documents.get(files.agentActionRevocationSchema);
const agentActionReceiptSchema = documents.get(files.agentActionReceiptSchema);
const agentActionInputSchema = documents.get(files.agentActionInputExampleSchema);
const agentActionInput = documents.get(files.agentActionInputExample);
const crawlerPurposePolicy = documents.get(files.crawlerPurposePolicyExample);
const crawlerPurposePolicySchema = documents.get(files.crawlerPurposePolicySchema);
const structuredDataProjection = documents.get(files.structuredDataProjectionExample);
const structuredDataProjectionSchema = documents.get(files.structuredDataProjectionSchema);
const capabilityConfigSchema = documents.get(files.capabilityConfigSchema);
const actionContractsSchema = documents.get(files.actionContractsSchema);
const actionContractsExample = documents.get(files.actionContractsExample);
const formatImplementationSchema = documents.get(files.formatImplementationSchema);
const formatImplementationExample = documents.get(files.formatImplementationExample);
const assetApprovalReceipt = documents.get(files.assetApprovalReceipt);
const assetApprovalReceiptSchema = documents.get(files.assetApprovalReceiptSchema);
const disclosureAuthoritySchema = documents.get(files.disclosureAuthoritySchema);
const disclosureAuthorityExample = documents.get(files.disclosureAuthorityExample);
const sourceLineageReceiptSchema = documents.get(files.sourceLineageReceiptSchema);
const claimEvidenceCaptureSchema = documents.get(files.claimEvidenceCaptureSchema);
const claimEvidenceCaptureExample = documents.get(files.claimEvidenceCaptureExample);
const verificationAttestationSchema = documents.get(files.verificationAttestationSchema);
const verificationTrustStoreSchema = documents.get(files.verificationTrustStoreSchema);
const verificationTrustPolicySchema = documents.get(files.verificationTrustPolicySchema);
const promotionSnapshotSchema = documents.get(files.promotionSnapshotSchema);
const socialSidecarSchema = documents.get(files.socialSidecarSchema);
const socialSidecarExample = documents.get(files.socialSidecarExample);
const socialDestinationVerificationExample = documents.get(files.socialDestinationVerificationExample);
const socialVisibleCopyInspectionExample = documents.get(files.socialVisibleCopyInspectionExample);
const master = textFile(files.normativeMaster);

function publicKeySpkiFingerprint(publicKeySpkiPem) {
  return sha256Bytes(createPublicKey(publicKeySpkiPem).export({ type: "spki", format: "der" }));
}

function loadPinnedTrustPair(storeInput, policyInput, expectedScope, forbiddenRoot, optionPrefix) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const storeOption = optionPrefix === "--package" ? "--package-trust-store" : "--trust-store";
  const policyOption = optionPrefix === "--package" ? "--package-trust-policy" : "--trust-policy";
  if (!isNonEmpty(storeInput)) errors.push(`${storeOption} is required`);
  if (!isNonEmpty(policyInput)) errors.push(`${policyOption} is required`);
  if (errors.length) return { errors, trustStores: [] };
  let storePath = null;
  let policyPath = null;
  try { storePath = realpathSync(resolve(storeInput)); if (!statSync(storePath).isFile()) storePath = null; } catch { storePath = null; }
  try { policyPath = realpathSync(resolve(policyInput)); if (!statSync(policyPath).isFile()) policyPath = null; } catch { policyPath = null; }
  add(Boolean(storePath), `${storeOption} must resolve to a readable JSON file`);
  add(Boolean(policyPath), `${policyOption} must resolve to a readable JSON file`);
  const forbidden = forbiddenRoot ? realpathSync(resolve(forbiddenRoot)) : null;
  if (storePath && forbidden) add(storePath !== forbidden && !storePath.startsWith(`${forbidden}${sep}`), `${storeOption} must be caller-controlled and external to the protected bundle`);
  if (policyPath && forbidden) add(policyPath !== forbidden && !policyPath.startsWith(`${forbidden}${sep}`), `${policyOption} must be caller-controlled and external to the protected bundle`);
  let trustStore = null;
  let trustPolicy = null;
  try { if (storePath) trustStore = JSON.parse(readFileSync(storePath, "utf8")); } catch (error) { errors.push(`${storeOption} is not valid JSON (${error.message})`); }
  try { if (policyPath) trustPolicy = JSON.parse(readFileSync(policyPath, "utf8")); } catch (error) { errors.push(`${policyOption} is not valid JSON (${error.message})`); }
  if (trustStore) {
    const schemaErrors = validateSchema(verificationTrustStoreSchema, trustStore);
    if (schemaErrors.length) errors.push(`${storeOption} does not satisfy verification-trust-store.schema.json: ${schemaErrors.join("; ")}`);
    add(trustStore.scope === expectedScope, `${storeOption} scope must be ${expectedScope}`);
  }
  if (trustPolicy) {
    const schemaErrors = validateSchema(verificationTrustPolicySchema, trustPolicy);
    if (schemaErrors.length) errors.push(`${policyOption} does not satisfy verification-trust-policy.schema.json: ${schemaErrors.join("; ")}`);
    add(trustPolicy.scope === expectedScope, `${policyOption} scope must be ${expectedScope}`);
  }
  if (trustStore && trustPolicy) {
    const matchingStores = (trustPolicy.stores ?? []).filter((entry) => entry.trustStoreId === trustStore.trustStoreId);
    add(matchingStores.length === 1, `${policyOption} does not pin exactly one matching trustStoreId`);
    const policyKeys = matchingStores[0]?.keys ?? [];
    for (const key of trustStore.keys ?? []) {
      let fingerprint = null;
      try { fingerprint = publicKeySpkiFingerprint(key.publicKeySpkiPem); } catch { fingerprint = null; }
      const matches = policyKeys.filter((pin) => pin.keyId === key.keyId && pin.issuerId === key.issuerId && pin.publicKeySpkiSha256 === fingerprint);
      add(matches.length === 1, `${policyOption} does not pin key ${key.keyId ?? "unknown"} by issuer and SPKI fingerprint`);
    }
    add(policyKeys.length === (trustStore.keys ?? []).length, `${policyOption} key allow-list and trust-store keys differ`);
  }
  return { errors, trustStores: trustStore && trustPolicy && errors.length === 0 ? [trustStore] : [] };
}

const packageTrustLoad = cliRequest.mode === "help"
  ? { errors: [], trustStores: [] }
  : loadPinnedTrustPair(cliRequest.packageTrustStore, cliRequest.packageTrustPolicy, "package_release", packageDir, "--package");
for (const error of packageTrustLoad.errors) check(false, error);
const packageReleaseTrustStores = packageTrustLoad.trustStores;

const packageAttestationChecks = [
  {
    binding: { ref: tuple.ownerApproval?.attestationRef },
    expectation: { label: "release approval", purpose: "release_approval", subjectRef: files.release, subjectSha256: sha256File(join(packageDir, files.release)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: assetRegistry?.approvalAttestationRef, sha256: assetRegistry?.approvalAttestationSha256 },
    expectation: { label: "asset approval", purpose: "asset_approval", subjectRef: files.assetApprovalReceipt, subjectSha256: sha256File(join(packageDir, files.assetApprovalReceipt)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: claimManifest?.records?.[0]?.approvalAttestationRef, sha256: claimManifest?.records?.[0]?.approvalAttestationSha256 },
    expectation: { label: "claim approval", purpose: "claim_approval", subjectRef: files.claimRecordExample, subjectSha256: sha256File(join(packageDir, files.claimRecordExample)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: claimManifest?.records?.[0]?.evidenceAttestationRef, sha256: claimManifest?.records?.[0]?.evidenceAttestationSha256 },
    expectation: { label: "claim evidence capture", purpose: "claim_evidence_capture", subjectRef: files.claimEvidenceCaptureExample, subjectSha256: sha256File(join(packageDir, files.claimEvidenceCaptureExample)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: build?.audienceOutput?.disclosureAttestationRef, sha256: build?.audienceOutput?.disclosureAttestationSha256 },
    expectation: { label: "disclosure authority", purpose: "disclosure_authority", subjectRef: files.disclosureAuthorityExample, subjectSha256: sha256File(join(packageDir, files.disclosureAuthorityExample)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: agentAction?.permission?.authorityAttestationRef, sha256: agentAction?.permission?.authorityAttestationSha256 },
    expectation: { label: "agent authority", purpose: "agent_authority", subjectRef: files.agentActionAuthorityExample, subjectSha256: sha256File(join(packageDir, files.agentActionAuthorityExample)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: conformanceReceiptExample?.attestationRef, sha256: sha256File(join(packageDir, files.conformanceReceiptAttestation)) },
    expectation: { label: "conformance receipt schema example", purpose: "automated_conformance", subjectRef: files.conformanceReceiptExample, subjectSha256: sha256File(join(packageDir, files.conformanceReceiptExample)), requiredStoreScope: "package_release" }
  },
  {
    binding: { ref: files.packageRootAttestation, sha256: sha256File(join(packageDir, files.packageRootAttestation)) },
    expectation: { label: "whole-package checksum root", purpose: "package_root", subjectRef: files.checksums, subjectSha256: sha256File(join(packageDir, files.checksums)), subjectMediaType: "text/plain", requiredStoreScope: "package_release" }
  }
];
for (const entry of packageAttestationChecks) {
  const attestationErrors = detachedAttestationBindingErrors(entry.binding, entry.expectation, packageDir, packageReleaseTrustStores);
  check(attestationErrors.length === 0, `${entry.expectation.label}: signed attestation validation failed${attestationErrors.length ? `\n  ${attestationErrors.join("\n  ")}` : ""}`);
}
check(socialSidecarExample?.publicationStatus === "example_only", "social-sidecar.example.json: reusable shape must not claim publication approval");
check(socialSidecarExample?.claimBinding?.claimManifestSha256 === sha256File(join(packageDir, files.claimManifestExample)), "social-sidecar.example.json: claim manifest hash drifts from its cited package bytes");
check(socialSidecarExample?.claimBinding?.claimRecordSha256 === sha256File(join(packageDir, files.claimRecordExample)), "social-sidecar.example.json: claim record hash drifts from its cited package bytes");
check(socialSidecarExample?.rights?.rightsSourceSha256 === sha256File(join(packageDir, socialSidecarExample?.rights?.rightsSourceRef)), "social-sidecar.example.json: rights source hash drifts from its cited package bytes");
check(socialSidecarExample?.actionBinding?.destinationVerification?.evidenceSha256 === sha256File(join(packageDir, files.socialDestinationVerificationExample)), "social-sidecar.example.json: destination verification evidence hash drifts from its cited package bytes");
check(socialSidecarExample?.visibleCopyInspection?.evidenceSha256 === sha256File(join(packageDir, files.socialVisibleCopyInspectionExample)), "social-sidecar.example.json: visible-copy inspection evidence hash drifts from its cited package bytes");
check(socialSidecarExample?.outputClarity?.audienceTextSha256 === sha256Bytes(canonicalJson(socialSidecarAudienceProjection(socialSidecarExample))), "social-sidecar.example.json: audience projection hash is not reproducible");
check(socialSidecarExample?.outputClarity?.visibleCopySha256 === sha256Bytes(canonicalJson(socialVisibleCopyProjection(socialSidecarExample))) && socialSidecarExample?.visibleCopyInspection?.normalizedProjectionSha256 === socialSidecarExample?.outputClarity?.visibleCopySha256, "social-sidecar.example.json: normalized visible-copy projection hash is not reproducible");
check(socialDestinationVerificationExample?.kind === "social_destination_verification" && socialDestinationVerificationExample?.result === "pass" && socialDestinationVerificationExample?.requestedDestination === socialSidecarExample?.actionBinding?.destination && socialDestinationVerificationExample?.observedDestination === socialSidecarExample?.actionBinding?.destinationVerification?.observedDestination && socialDestinationVerificationExample?.observedAt === socialSidecarExample?.actionBinding?.destinationVerification?.observedAt, "social-destination-verification.example.json: example is not a successful exact-destination observation");
check(socialVisibleCopyInspectionExample?.kind === "social_visible_copy_inspection" && socialVisibleCopyInspectionExample?.ocrPerformed === true && socialVisibleCopyInspectionExample?.visualReviewPerformed === true && sameValue(socialVisibleCopyInspectionExample?.normalizedOcrProjection, socialVisibleCopyProjection(socialSidecarExample)) && sameValue(socialVisibleCopyInspectionExample?.visualReviewProjection, socialVisibleCopyProjection(socialSidecarExample)) && socialVisibleCopyInspectionExample?.normalizedProjectionSha256 === socialSidecarExample?.outputClarity?.visibleCopySha256 && socialVisibleCopyInspectionExample?.unclassifiedVisibleText?.length === 0 && socialVisibleCopyInspectionExample?.extraClaimTexts?.length === 0, "social-visible-copy-inspection.example.json: OCR and visual-review example do not exactly match governed visible copy");

const instanceSchemaVersionChecks = [
  ["buildCard", build?.schemaVersion],
  ["artifactManifest", artifactManifest?.schemaVersion],
  ["conformanceReceipt", conformanceReceiptExample?.schemaVersion],
  ["claimRecord", claimRecord?.schemaVersion],
  ["claimManifest", claimManifest?.schemaVersion],
  ["agentAction", agentAction?.schemaVersion],
  ["agentActionDefinition", agentActionDefinition?.schemaVersion],
  ["agentActionAuthority", agentActionAuthority?.schemaVersion],
  ["agentActionRevocation", agentActionRevocation?.schemaVersion],
  ["crawlerPurposePolicy", crawlerPurposePolicy?.schemaVersion],
  ["structuredDataProjection", structuredDataProjection?.schemaVersion],
  ["socialSidecar", socialSidecarExample?.schemaVersion],
  ["actionContracts", actionContractsExample?.schemaVersion],
  ["formatImplementation", formatImplementationExample?.schemaVersion],
  ["assetRegistry", assetRegistry?.schemaVersion],
  ["assetApprovalReceipt", assetApprovalReceipt?.schemaVersion],
  ["disclosureAuthority", disclosureAuthorityExample?.schemaVersion],
  ["claimEvidenceCapture", claimEvidenceCaptureExample?.schemaVersion],
  ["verificationAttestation", documents.get(files.releaseApprovalAttestation)?.schemaVersion],
  ["migrationLedger", migration?.schemaVersion],
  ["targetProfile", targetProfiles?.schemaVersion],
  ["formatKit", formatKits?.schemaVersion],
  ["token", tokens?.schemaVersion],
  ["ruleCatalog", catalog?.schemaVersion],
  ["formatPack", formatPacks?.schemaVersion]
];
for (const [name, actual] of instanceSchemaVersionChecks) check(actual === release.schemas?.[name], `${name}: schemaVersion ${String(actual)} does not match release.json ${String(release.schemas?.[name])}`);

for (const [filename, document] of documents) {
  if (!document || filename === "release.json" || filename.endsWith(".schema.json")) continue;
  if (Object.hasOwn(document, "releaseRef") && typeof document.releaseRef === "string") check(document.releaseRef === releaseRef, `${filename}: releaseRef drift`);
  if (Object.hasOwn(document, "status")) check(document.status === tuple.status || ["approved", "draft", "reviewed", "not_revoked"].includes(document.status), `${filename}: unexpected status ${document.status}`);
}

const requiredAuthorityDomains = [
  "portfolioIdentityAndSharedArchitecture",
  "productFactsCapabilitiesEvidenceAndPermissions",
  "visualInteractionAccessibilityAndFormat",
  "artifactIntentAudienceAndDelivery",
  "experimentsExamplesAndCandidates"
];
requiredAuthorityDomains.forEach((domain) => check(isNonEmpty(release.authority?.domainResolution?.[domain]), `release.json: authority domain ${domain} is missing`));
check(release.sets?.color?.id === "color-srgb-07" && release.sets?.color?.disposition === "new_approved" && release.sets?.color?.predecessorSetId === "color-srgb-05", "release.json: color set must be color-srgb-07 (new_approved, predecessor color-srgb-05)");
check(release.sets?.motion?.id === "motion-riddim-approach-03" && release.sets?.motion?.disposition === "new_approved", "release.json: motion set must be motion-riddim-approach-03 (new_approved)");
check(release.sets?.color?.embeddedMetadataPrecedence?.includes("release.json is the sole authority"), "release.json: color metadata precedence is ambiguous");
check(isNonEmpty(tuple.frozenFrom?.ref) && /^[a-f0-9]{64}$/.test(tuple.frozenFrom?.masterSha256 ?? "") && /^[a-f0-9]{64}$/.test(tuple.frozenFrom?.checksumsSha256 ?? "") && tuple.frozenFrom?.ref !== releaseRef, "release.json: frozenFrom must name the approved candidate by ref, master hash and checksum-receipt hash");
check(isNonEmpty(tuple.releaseDate) && /^\d{4}-\d{2}-\d{2}$/.test(tuple.releaseDate) && tuple.releaseDate === String(tuple.ownerApproval?.approvedAt ?? "").slice(0, 10), "release.json: releaseDate must be the owner approval date");
check(Array.isArray(release.frozenAtFreeze?.attestations) && release.frozenAtFreeze.attestations.length === 9 && Array.isArray(release.postApprovalFollowUps) && release.postApprovalFollowUps.length > 0 && release.pendingAtFreeze === undefined, "release.json: the freeze must record its nine attestations and the post-approval follow-ups, and leave no pendingAtFreeze block");
for (const setName of ["motion", "icon", "typography", "layout"]) check(isNonEmpty(release.sets?.[setName]?.id), `release.json: ${setName} set is missing`);

const ruleIds = [];
const ruleIdSet = new Set();
const acceptanceIds = new Set();
const ruleById = new Map();
const acceptanceById = new Map();
if (catalog) {
  check(catalog.releaseRef === releaseRef, "rule-catalog.json: releaseRef drift");
  check(catalog.status === tuple.status, "rule-catalog.json: status drift");
  for (const [index, rule] of (catalog.rules ?? []).entries()) {
    const prefix = `rule-catalog.json rules[${index}]`;
    check(/^[A-Z][A-Z0-9-]*-\d{2}$/.test(rule.id ?? ""), `${prefix}: invalid rule ID`);
    check(!ruleIdSet.has(rule.id), `${prefix}: duplicate rule ID ${rule.id}`);
    ruleIdSet.add(rule.id);
    ruleIds.push(rule.id);
    ruleById.set(rule.id, rule);
    check(["MUST", "MUST_NOT", "SHOULD", "MAY"].includes(rule.normativeLevel), `${prefix}: invalid normative level`);
    check(isNonEmpty(rule.title) && isNonEmpty(rule.requirement), `${prefix}: title and requirement are required`);
    check(Array.isArray(rule.acceptance) && rule.acceptance.length > 0, `${prefix}: acceptance is required`);
    for (const acceptance of rule.acceptance ?? []) {
      check(isNonEmpty(acceptance.checkId), `${prefix}: acceptance checkId is required`);
      check(!acceptanceIds.has(acceptance.checkId), `${prefix}: duplicate acceptance ID ${acceptance.checkId}`);
      acceptanceIds.add(acceptance.checkId);
      acceptanceById.set(acceptance.checkId, { ...acceptance, ruleId: rule.id });
      check(["automated", "visual", "interaction", "accessibility", "manual", "production"].includes(acceptance.method), `${prefix}: invalid acceptance method ${acceptance.method}`);
      check(isNonEmpty(acceptance.criterion), `${prefix}: acceptance criterion is required`);
    }
  }
  for (const required of ["DISCOVERY-01", "DISCOVERY-02", "DISCOVERY-03", "MOTION-01", "MOTION-02", "MOTION-03", "NAV-01", "BOOKMARK-01", "CTA-01", "ICON-01", "LOGO-01", "PARITY-01", "FORMAT-PARITY-01", "COMPONENT-01", "OUTPUT-CLARITY-01", "DATAVIZ-02", "DATAVIZ-03", "DATAVIZ-04", "DATAVIZ-05", "GATE-01", "MOTION-04", "MOTIF-01", "MOTIF-02", "MOTIF-03", "MOTIF-04", "MOTIF-05", "MOTIF-06", "FAVICON-01", "EVID-05"]) {
    check(ruleIdSet.has(required), `rule-catalog.json: required v0.9.4 rule ${required} is missing`);
  }
  for (const required of catalog.requiredCoreRuleIds ?? []) check(ruleIdSet.has(required), `rule-catalog.json: unknown core rule ${required}`);
  check(catalog.resolvedAcceptancePolicy === "every_resolved_acceptance_must_pass", "rule-catalog.json: every resolved acceptance must pass without not-applicable bypass");
  check(sameValue(catalog.requiredCoreRuleIds, formatPacks?.commonRuleIds), "rule-catalog.json and format-packs.json: core/common rule lists must match exactly");
  check((catalog.rules ?? []).length === 64, "rule-catalog.json: 0.9.4 carries exactly 64 rules (50 predecessor rules + 14 new)");
  check(ruleById.get("DATAVIZ-04")?.title?.toLowerCase().includes("hue window") && ruleById.get("DATAVIZ-05")?.title?.toLowerCase().includes("categorical"), "rule-catalog.json: DATAVIZ-04 is the hue-window rule and DATAVIZ-05 the categorical series rule (owner decision 2026-09-17)");
}

const ruleBlockMatches = [...master.matchAll(/^\*\*([A-Z][A-Z0-9-]*-\d{2}) — ([^*]+)\*\*/gm)];
const masterBlocks = new Map();
for (let index = 0; index < ruleBlockMatches.length; index += 1) {
  const match = ruleBlockMatches[index];
  const id = match[1];
  const end = ruleBlockMatches[index + 1]?.index ?? master.length;
  check(!masterBlocks.has(id), `${files.normativeMaster}: duplicate rule block ${id}`);
  masterBlocks.set(id, { title: match[2].trim().replace(/\.$/, ""), body: master.slice(match.index, end) });
}
check(sameValue(catalog?.protectedBrandLines, protectedBrandLines), "rule-catalog.json: protected brand-line registry is missing or altered");
for (const [role, line] of Object.entries(protectedBrandLines)) {
  check(master.includes(line), `${files.normativeMaster}: protected ${role} line is missing or altered`);
  check(canonicalJson(catalog).includes(line), `rule-catalog.json: protected ${role} line is missing or altered`);
}
check(master.includes(tuple.status) && master.includes(releaseRef), `${files.normativeMaster}: release status or package ID is missing`);
check(master.includes("`buildCardRef`") && master.includes("`actionIds`") && master.includes("`claimIds`") && master.includes("`assetBindings`") && master.includes("`deliveryAudience`"), `${files.normativeMaster}: artifact-manifest field map drifts from required machine fields`);
check(!master.includes("claimObjects") && !master.includes("conformanceLevel: computed-only") && !master.includes("assetHashes"), `${files.normativeMaster}: deprecated artifact-manifest field guidance remains`);
check(master.includes("assumptions: []"), `${files.normativeMaster}: Build Card minimum cannot represent assumptions`);
for (const rule of catalog?.rules ?? []) {
  const block = masterBlocks.get(rule.id);
  check(Boolean(block), `${files.normativeMaster}: rule ${rule.id} has no normative heading block`);
  if (!block) continue;
  check(block.title === rule.title.trim().replace(/\.$/, ""), `${files.normativeMaster}: ${rule.id} title drifts from catalog`);
  for (const acceptance of rule.acceptance) check(block.body.includes(acceptance.checkId), `${files.normativeMaster}: ${acceptance.checkId} is not inside the ${rule.id} rule block`);
}
for (const id of masterBlocks.keys()) check(ruleIdSet.has(id), `${files.normativeMaster}: rule block ${id} is missing from catalog`);
const bookmarkRule = ruleById.get("BOOKMARK-01");
const bookmarkAcceptance = acceptanceById.get("BOOKMARK-01-A");
const bookmarkMasterBlock = masterBlocks.get("BOOKMARK-01")?.body ?? "";
check(
  /composition\.componentIds/.test(bookmarkRule?.requirement ?? "")
    && /component\.bookmark\.side\.01/.test(bookmarkRule?.requirement ?? "")
    && /selected MUST include/.test(bookmarkRule?.requirement ?? "")
    && /omitted MUST exclude/.test(bookmarkRule?.requirement ?? ""),
  "rule-catalog.json: BOOKMARK-01 must bind selected/omitted state to the exact governed bookmark component inventory"
);
check(
  /if and only if/.test(bookmarkAcceptance?.criterion ?? "")
    && /component\.bookmark\.side\.01/.test(bookmarkAcceptance?.criterion ?? "")
    && /artifact-resolved record/.test(bookmarkAcceptance?.criterion ?? ""),
  "rule-catalog.json: BOOKMARK-01-A must test the bidirectional inventory binding and exact artifact-resolved contract"
);
check(
  bookmarkMasterBlock.includes("`composition.componentIds`")
    && bookmarkMasterBlock.includes("`component.bookmark.side.01`")
    && bookmarkMasterBlock.includes("exact format/runtime component contract"),
  `${files.normativeMaster}: BOOKMARK-01 must explain the copyable component-inventory and resolver rule`
);

const allowedProfiles = buildSchema?.$defs?.output?.properties?.formatProfile?.enum ?? [];
const capabilityEnum = buildSchema?.$defs?.capability?.enum ?? [];
const experienceProfileEnum = buildSchema?.$defs?.experience?.properties?.profile?.enum ?? [];
const targetById = new Map((targetProfiles?.profiles ?? []).map((profile) => [profile.id, profile]));
const kitById = new Map((formatKits?.kits ?? []).map((kit) => [kit.id, kit]));
const packByProfile = new Map();
const overlayByCapability = new Map((formatPacks?.overlays ?? []).map((overlay) => [overlay.capability, overlay]));
const identityById = new Map((assetRegistry?.identity ?? []).map((asset) => [asset.id, asset]));
const textIdentityById = new Map((assetRegistry?.textIdentityImplementations ?? []).map((identity) => [identity.id, identity]));
const iconById = new Map((assetRegistry?.iconSubsets ?? []).map((asset) => [asset.id, asset]));
const registeredAssetById = new Map(
  [...(assetRegistry?.identity ?? []), ...(assetRegistry?.fonts ?? []), ...(assetRegistry?.iconSubsets ?? []), ...(assetRegistry?.media ?? [])]
    .map((asset) => [asset.id, asset])
);

function conformanceVariantKey(card) {
  const target = targetById.get(card?.output?.targetProfileRef);
  const formatProfile = card?.output?.formatProfile;
  const runtime = card?.output?.runtime ?? target?.runtime;
  return isNonEmpty(formatProfile) && isNonEmpty(runtime) ? `${formatProfile}.${runtime}` : null;
}

function motionRuntimeClass(card) {
  const variant = conformanceVariantKey(card);
  if (["web_public.browser", "app_interactive.browser"].includes(variant)) return "browser_observer";
  if (variant === "app_interactive.native") return "native_state";
  if (variant === "deck_presentation.static") return "presenter_sequence";
  return null;
}

function accessibilityFixtureIds(card) {
  const variant = conformanceVariantKey(card);
  return variant ? (formatPacks?.accessibilityFixtureIdsByConformanceVariant?.[variant] ?? []) : [];
}

function receiptEquivalenceErrors(packs) {
  const errors = [];
  const receipt = packs?.equivalenceMap?.receipt ?? {};
  if (!sameValue(Object.keys(receipt).sort(), [...allowedProfiles].sort())) errors.push("receipt equivalence must cover every format profile exactly once");
  for (const [profile, value] of Object.entries(receipt)) {
    if (!isNonEmpty(value)) errors.push(`${profile} receipt equivalence is blank`);
    if (/\bapproval(?: workflow| record| status)?\b/i.test(value)) errors.push(`${profile} exposes an internal approval record`);
  }
  return errors;
}

function identityEquivalenceErrors(packs) {
  const errors = [];
  const identity = packs?.equivalenceMap?.identity ?? {};
  if (!sameValue(Object.keys(identity).sort(), [...allowedProfiles].sort())) errors.push("identity equivalence must cover every format profile exactly once");
  for (const [profile, value] of Object.entries(identity)) {
    if (!isNonEmpty(value)) errors.push(`${profile} identity equivalence is blank`);
    if (!/approved[^.]{0,40}identity asset|governed (?:live-)?text identity/i.test(value)) errors.push(`${profile} identity equivalence omits the approved asset or governed text-identity path`);
    if (!/never reconstruct a logo|no approved logo role exists|native document text|tagged or extractable text|title and closing slides/i.test(value)) errors.push(`${profile} identity equivalence does not forbid or avoid unauthorized logo reconstruction`);
  }
  return errors;
}

function staticNavigationProjectionContractErrors(packs) {
  const contract = packs?.navigationContract?.staticProjectionContract;
  const expected = {
    applicableConformanceVariants: ["document_flow.static", "pdf_fixed.static", "deck_presentation.static"],
    outputGroupOrder: ["global_related_destinations", "page_index"],
    groups: {
      global_related_destinations: {
        selectors: [
          { kind: "route", levels: ["ecosystem", "property"] },
          { kind: "external", levels: ["ecosystem", "property", "page"] }
        ],
        requiredStaticExposure: "destination_cue",
        representationByFormatProfile: {
          document_flow: "related_destination_group",
          pdf_fixed: "related_destination_group",
          deck_presentation: "opening_or_closing_related_destination_group"
        }
      },
      page_index: {
        selectors: [{ kind: "anchor", levels: ["page"], groups: ["page_local"] }],
        requiredStaticExposureByFormatProfile: {
          document_flow: "toc",
          pdf_fixed: "pdf_bookmark",
          deck_presentation: "deck_section_marker"
        },
        representationByFormatProfile: {
          document_flow: "heading_derived_toc",
          pdf_fixed: "heading_derived_pdf_bookmarks",
          deck_presentation: "heading_derived_section_markers"
        }
      }
    },
    invariants: {
      eachDestinationExactlyOneGroup: true,
      preserveFields: ["id", "kind", "level", "group", "target", "label", "labelByLocale"],
      preserveRelativeOrderWithinGroup: true,
      duplicateDestinationIdsForbidden: true,
      duplicateTargetsForbidden: true,
      kindOrLevelConversionForbidden: true,
      headingAnchorResolutionRequired: true
    },
    unsupportedDestinationBehavior: "block"
  };
  const expectedVariants = {
    "web_public.browser": { allowedModes: ["none", "site", "product"], exposureField: "breakpointExposure", sideBookmarkExposure: { desktop: "side_bookmark", mobile: "disclosure" } },
    "app_interactive.browser": { allowedModes: ["none", "site", "product"], exposureField: "breakpointExposure", sideBookmarkExposure: { desktop: "side_bookmark", mobile: "disclosure" } },
    "app_interactive.native": { allowedModes: ["none", "site", "product"], exposureField: "breakpointExposure", sideBookmarkExposure: { desktop: "side_bookmark", mobile: "disclosure" } },
    "document_flow.static": { allowedModes: ["none", "document"], exposureField: "staticExposure", sideBookmarkExposure: "toc" },
    "pdf_fixed.static": { allowedModes: ["none", "document"], exposureField: "staticExposure", sideBookmarkExposure: "pdf_bookmark" },
    "deck_presentation.static": { allowedModes: ["none", "deck"], exposureField: "staticExposure", sideBookmarkExposure: "deck_section_marker" },
    "social_static.static": { allowedModes: ["none"], exposureField: "staticExposure", sideBookmarkExposure: null }
  };
  const errors = [];
  if (!sameValue(contract, expected)) errors.push("static navigation projection contract must exactly separate global related destinations from the heading-derived page index without conversion, duplication, or order drift");
  if (!sameValue(packs?.navigationContract?.variants, expectedVariants)) errors.push("navigation conformance variants must exactly bind allowed modes and browser or static exposure semantics");
  return errors;
}

function componentContractTemplateErrors(packs) {
  const errors = [];
  const registry = packs?.componentContractTemplates ?? {};
  const templates = registry.templates ?? [];
  const expectedKeys = [
    "deck_presentation.static.component.bookmark.side.01",
    "document_flow.static.component.bookmark.side.01",
    "pdf_fixed.static.component.bookmark.side.01"
  ];
  if (!isNonEmpty(registry.resolution) || registry.unknownComponentBehavior !== "block") errors.push("component contract template resolution must block unknown or caller-authored components");
  const keys = templates.map((entry) => `${entry.formatProfile}.${entry.runtime}.${entry.contract?.componentId}`);
  if (!unique(keys) || !sameValue([...keys].sort(), expectedKeys)) errors.push("component contract templates must cover each selected static side-bookmark format exactly once");
  for (const entry of templates) {
    const label = `${entry.formatProfile ?? "unknown"}.${entry.runtime ?? "unknown"}.${entry.contract?.componentId ?? "unknown"}`;
    if (entry.runtime !== "static" || !["document_flow", "pdf_fixed", "deck_presentation"].includes(entry.formatProfile)) errors.push(`component contract template ${label} has an unsupported format/runtime`);
    if (entry.contract?.formatBehavior?.formatProfile !== entry.formatProfile) errors.push(`component contract template ${label} format behavior drifts from its exact format`);
    if (entry.contract?.componentClass !== "side_bookmark" || entry.contract?.componentId !== "component.bookmark.side.01") errors.push(`component contract template ${label} is not the governed side-bookmark component`);
    for (const error of validateSchema(formatImplementationSchema?.$defs?.componentContract, entry.contract, formatImplementationSchema)) errors.push(`component contract template ${label}: ${error}`);
  }
  return errors;
}

function ctaDestinationContractErrors(packs) {
  const errors = [];
  const contract = packs?.ctaDestinationContract ?? {};
  const expectedKinds = ["anchor", "route", "external", "download", "form", "contact", "command"];
  if (!sameValue(contract.kinds, expectedKinds)) errors.push("CTA destination kinds must equal the governed seven-kind taxonomy");
  if (!sameValue(Object.keys(contract.profiles ?? {}).sort(), [...allowedProfiles].sort())) errors.push("CTA destination profiles must cover every format profile exactly once");
  for (const profile of allowedProfiles) {
    const entry = contract.profiles?.[profile];
    if (!entry) continue;
    const expectedMode = ["web_public", "app_interactive"].includes(profile) ? "direct" : "static_equivalent";
    if (entry.mode !== expectedMode) errors.push(`${profile} CTA destination mode must be ${expectedMode}`);
    if (!Array.isArray(entry.techniques) || entry.techniques.length === 0 || !unique(entry.techniques)) errors.push(`${profile} CTA techniques must be nonempty and unique`);
    if (!Array.isArray(entry.kinds) || entry.kinds.length === 0 || !unique(entry.kinds) || !entry.kinds.every((kind) => expectedKinds.includes(kind))) errors.push(`${profile} CTA kinds are missing, duplicated, or unknown`);
  }
  if (contract.commandStaticTechnique !== "instruction") errors.push("static command destinations must use the instruction technique");
  if (contract.unknownKindOrProfileBehavior !== "block") errors.push("unknown CTA destination kind or profile must block");
  return errors;
}

function expectedCapabilityOverlaySchema(capability) {
  if (["claims", "evidence"].includes(capability)) return {
    ref: release.schemaIds?.claimManifest,
    sha256: sha256File(join(packageDir, files.claimManifestSchema))
  };
  if (capability === "motion") return {
    ref: `${release.schemaIds?.capabilityConfig}#/$defs/motion`,
    sha256: sha256File(join(packageDir, files.capabilityConfigSchema))
  };
  if (capability === "agent_action") return {
    ref: release.schemaIds?.agentActionDefinition,
    sha256: sha256File(join(packageDir, files.agentActionDefinitionSchema))
  };
  if (capabilityEnum.includes(capability)) return {
    ref: release.schemaIds?.capabilityConfig,
    sha256: sha256File(join(packageDir, files.capabilityConfigSchema))
  };
  return null;
}

function capabilityOverlayContractErrors(packs) {
  const errors = [];
  const overlays = packs?.overlays ?? [];
  const overlayCapabilities = overlays.map((overlay) => overlay.capability);
  if (!unique(overlayCapabilities)) errors.push("capability overlays contain duplicate capabilities");
  if (!sameValue([...overlayCapabilities].sort(), [...capabilityEnum].sort())) errors.push("capability overlays must cover every Build Card capability exactly once");
  for (const overlay of overlays) {
    const label = overlay.id ?? overlay.capability ?? "unknown";
    if (!capabilityEnum.includes(overlay.capability)) errors.push(`overlay ${label} has an unknown capability`);
    const expectedSchema = expectedCapabilityOverlaySchema(overlay.capability);
    if (expectedSchema) {
      if (overlay.configSchemaRef !== expectedSchema.ref) errors.push(`overlay ${label} configSchemaRef does not equal the active capability schema`);
      if (overlay.configSchemaSha256 !== expectedSchema.sha256) errors.push(`overlay ${label} configSchemaSha256 does not match active schema bytes`);
    }
    if (!Array.isArray(overlay.compatibleFormatProfiles) || overlay.compatibleFormatProfiles.length === 0 || !unique(overlay.compatibleFormatProfiles)) errors.push(`overlay ${label} compatibleFormatProfiles must be nonempty and unique`);
    for (const profile of overlay.compatibleFormatProfiles ?? []) if (!allowedProfiles.includes(profile)) errors.push(`overlay ${label} has unknown compatible format profile ${profile}`);
    if (!Array.isArray(overlay.requiredRuleIds) || overlay.requiredRuleIds.length === 0 || !unique(overlay.requiredRuleIds)) errors.push(`overlay ${label} requiredRuleIds must be nonempty and unique`);
    for (const id of overlay.requiredRuleIds ?? []) if (!ruleIdSet.has(id)) errors.push(`overlay ${label} references unknown rule ${id}`);
    for (const id of packs?.capabilityRuleIds?.[overlay.capability] ?? []) if (!(overlay.requiredRuleIds ?? []).includes(id)) errors.push(`overlay ${label} omits mapped capability rule ${id}`);
    if (!Array.isArray(overlay.requiredFields) || overlay.requiredFields.length === 0 || !unique(overlay.requiredFields) || !(overlay.requiredFields ?? []).every(isNonEmpty)) errors.push(`overlay ${label} requiredFields must be nonempty and unique`);
    if (!Array.isArray(overlay.testMatrix) || overlay.testMatrix.length === 0 || !(overlay.testMatrix ?? []).every(isNonEmpty)) errors.push(`overlay ${label} testMatrix must be nonempty`);
    if (!unique(indexedTestIds(`capability.${label}`, overlay.testMatrix ?? []))) errors.push(`overlay ${label} generated test IDs are not unique`);
    if (overlay.capability === "motion") {
      const runtimeClasses = ["browser_observer", "native_state", "presenter_sequence"];
      if (!sameValue(Object.keys(overlay.requiredFieldsByRuntimeClass ?? {}).sort(), [...runtimeClasses].sort())) errors.push(`overlay ${label} requiredFieldsByRuntimeClass must cover every governed motion runtime class exactly`);
      if (!sameValue(Object.keys(overlay.requiredRuleIdsByRuntimeClass ?? {}).sort(), [...runtimeClasses].sort())) errors.push(`overlay ${label} requiredRuleIdsByRuntimeClass must cover every governed motion runtime class exactly`);
      if (!sameValue(Object.keys(overlay.testMatrixByRuntimeClass ?? {}).sort(), [...runtimeClasses].sort())) errors.push(`overlay ${label} testMatrixByRuntimeClass must cover every governed motion runtime class exactly`);
      for (const runtimeClass of runtimeClasses) {
        const runtimeTests = overlay.testMatrixByRuntimeClass?.[runtimeClass] ?? [];
        if (!Array.isArray(runtimeTests) || runtimeTests.length < 2 || !runtimeTests.every(isNonEmpty) || !unique(indexedTestIds(`capability.${label}.runtime.${runtimeClass}`, runtimeTests))) errors.push(`overlay ${label} ${runtimeClass} runtime tests must be nonempty, complete, and uniquely addressable`);
      }
      for (const runtimeClass of ["browser_observer", "native_state"]) if (!(overlay.requiredRuleIdsByRuntimeClass?.[runtimeClass] ?? []).includes("MOTION-02")) errors.push(`overlay ${label} ${runtimeClass} must resolve MOTION-02`);
      const expectedFields = {
        browser_observer: ["mode", "opacityDurationMs", "transformDurationMs", "mediaDurationMs", "blockDistancePx", "inlineDistancePx", "scaleFrom", "staggerStepMs", "staggerCapMs", "staggerBeatCount", "staggerDelayFormula", "opacityEasing", "transformEasing", "pressEasing", "observerThreshold", "observerRootMargin", "initializationWatchdogMs", "reachedContentFailsafeFrames", "finalHiddenFinalFlashForbidden", "observersPerDocumentRoot", "onceOnlyUnobserve", "prePaintArmingRequiresNormalMotionAndObserver"],
        native_state: ["mode", "feedbackDurationMs", "stateDurationMs", "maximumTransitionMs", "reducedMotionFinalState", "layoutGeometry", "interruptionFinalState"],
        presenter_sequence: ["mode", "sequencePurpose", "trigger", "stepDurationMs", "maximumSteps", "staticEquivalent", "finalFrameRequired"]
      };
      const expectedRules = {
        browser_observer: ["MOTION-02", "MOTION-03"],
        native_state: ["MOTION-02", "MOTION-03"],
        presenter_sequence: ["MOTION-03"]
      };
      if (!sameValue(overlay.requiredFieldsByRuntimeClass, expectedFields)) errors.push(`overlay ${label} runtime fields must exactly isolate browser observer, native state, and presenter sequence contracts`);
      if (!sameValue(overlay.requiredRuleIdsByRuntimeClass, expectedRules)) errors.push(`overlay ${label} runtime rules must exactly bind MOTION-03 to every branch and MOTION-02 only to browser and native branches`);
      const browserTests = (overlay.testMatrixByRuntimeClass?.browser_observer ?? []).join(" ").toLowerCase();
      const nativeTests = (overlay.testMatrixByRuntimeClass?.native_state ?? []).join(" ").toLowerCase();
      const presenterTests = (overlay.testMatrixByRuntimeClass?.presenter_sequence ?? []).join(" ").toLowerCase();
      if (!/opacity/.test(browserTests) || !/transform/.test(browserTests) || !/four-beat/.test(browserTests) || !/riddim/.test(browserTests)) errors.push(`overlay ${label} browser_observer tests must enforce opacity, transform, and the exact four-beat Riddim recipe`);
      if (!/native_state/.test(nativeTests) || !/native view order/.test(nativeTests) || !/accessibility traversal order/.test(nativeTests) || !/without browser/.test(nativeTests)) errors.push(`overlay ${label} native_state tests must enforce native lifecycle and stable native accessibility order without browser recipe leakage`);
      if (!/presenter_sequence/.test(presenterTests) || !/final frame/.test(presenterTests) || !/slide object order/.test(presenterTests) || !/without browser/.test(presenterTests)) errors.push(`overlay ${label} presenter_sequence tests must enforce presenter lifecycle, object order, and final frame without browser recipe leakage`);
    }
    if (!isNonEmpty(overlay.configRefContract) || !isNonEmpty(overlay.fallback)) errors.push(`overlay ${label} configRefContract and fallback are required`);
  }
  return errors;
}

function capabilityOverlayUseErrors(capability, formatProfile, overlays = overlayByCapability) {
  const errors = [];
  const overlay = overlays instanceof Map ? overlays.get(capability) : (overlays ?? []).find((entry) => entry.capability === capability);
  if (!overlay) errors.push(`${capability} capability lacks a governed overlay contract`);
  else if (!(overlay.compatibleFormatProfiles ?? []).includes(formatProfile)) errors.push(`${capability} capability is incompatible with format profile ${formatProfile}`);
  return errors;
}

function experienceProfileTestContractErrors(packs) {
  const errors = [];
  const matrix = packs?.experienceProfileTestMatrix ?? {};
  if (!sameValue(Object.keys(matrix).sort(), [...experienceProfileEnum].sort())) errors.push("experience profile test matrix must cover every profile exactly");
  for (const profile of experienceProfileEnum) {
    const tests = matrix[profile] ?? [];
    if (tests.length < 2 || !tests.every(isNonEmpty) || !unique(indexedTestIds(`experience.${profile}`, tests))) errors.push(`${profile} experience profile lacks stable usable tests`);
  }
  return errors;
}

function accessibilityProjectionContractErrors(packs) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const contract = packs?.accessibilityProjectionContract ?? {};
  const verified = { headings: "verified", landmarks: "verified", controls: "verified" };
  const semanticStatic = { headings: "not_applicable", landmarks: "not_applicable", controls: "not_applicable" };
  const interactionInteractive = { keyboard: "verified", focus: "verified", touch: "verified" };
  const interactionStatic = { keyboard: "not_applicable", focus: "not_applicable", touch: "not_applicable" };
  const textWeb = { zoom200: "verified", reflow400: "verified" };
  const textStatic = { zoom200: "not_applicable", reflow400: "not_applicable" };
  const motionInteractive = { alternative: "verified", reducedMotion: "verified", observerFailure: "final_state" };
  const expectedVariants = {
    "web_public.browser": { semanticStructure: verified, interaction: interactionInteractive, textLayout: textWeb, motionWithCapability: motionInteractive },
    "app_interactive.browser": { semanticStructure: verified, interaction: interactionInteractive, textLayout: textWeb, motionWithCapability: motionInteractive },
    "app_interactive.native": { semanticStructure: { headings: "verified", landmarks: "not_applicable", controls: "verified" }, interaction: interactionInteractive, textLayout: textStatic, motionWithCapability: { alternative: "verified", reducedMotion: "verified", observerFailure: "not_applicable" } },
    "document_flow.static": { semanticStructure: { headings: "verified", landmarks: "not_applicable", controls: "verified" }, interaction: interactionStatic, textLayout: textStatic, motionWithCapability: null },
    "pdf_fixed.static": { semanticStructure: { headings: "verified", landmarks: "not_applicable", controls: "verified" }, interaction: interactionStatic, textLayout: textStatic, motionWithCapability: null },
    "deck_presentation.static": { semanticStructure: semanticStatic, interaction: interactionStatic, textLayout: textStatic, motionWithCapability: { alternative: "verified", reducedMotion: "not_applicable", observerFailure: "not_applicable" } },
    "social_static.static": { semanticStructure: semanticStatic, interaction: interactionStatic, textLayout: textStatic, motionWithCapability: null }
  };
  add(contract.statusAtArtifactQa === "verified" && contract.readingOrder === "composition_sections_exact", "accessibility projection status or reading-order contract drift");
  add(sameValue(contract.contrast, { normalTextMin: 4.5, largeTextMin: 3, nonTextMin: 3 }), "accessibility projection contrast contract drift");
  add(sameValue(contract.motionWithoutCapability, { alternative: "not_applicable", reducedMotion: "not_applicable", observerFailure: "not_applicable" }), "accessibility projection no-motion summary drift");
  add(sameValue(contract.variants, expectedVariants), "accessibility projection conformance variants drift from the governed exact summaries");
  add(sameValue(contract.contentAlternativeTriggers?.images, {
    assetRoles: ["editorial", "evidence", "map", "social_preview", "ui_capture", "provider_content", "generated_vector"],
    whenPresent: "verified",
    whenAbsent: "not_applicable"
  }), "accessibility image-alternative trigger contract drift");
  add(sameValue(contract.contentAlternativeTriggers?.data, {
    capabilities: ["data_table", "data_visualization", "map"],
    whenPresent: "verified",
    whenAbsent: "not_applicable"
  }), "accessibility data-alternative trigger contract drift");
  return errors;
}

const identityImplementationById = new Map((assetRegistry?.textIdentityImplementations ?? []).map((implementation) => [implementation.id, implementation]));
const identityTypographyBindingById = new Map((assetRegistry?.textIdentityImplementations ?? []).flatMap((implementation) => (implementation.typographyBindings ?? []).map((binding) => [binding.id, { implementation, binding }])));
const nativeFontMappingById = new Map((assetRegistry?.nonWebPortability?.nativeFontMappings ?? []).map((mapping) => [mapping.id, mapping]));
const portabilityFixtureIdSet = new Set(Object.keys(assetRegistry?.portabilityFixtureCriteria ?? {}));
const nonWebIconPortabilityFixtureIds = [
  "portability.non-web.icon.visible-label",
  "portability.non-web.icon.no-glyph-substitution",
  "portability.non-web.icon.vector-hash-and-text-equivalent"
];
function orderedUniqueValues(...groups) {
  const values = [];
  for (const group of groups) for (const value of group ?? []) if (!values.includes(value)) values.push(value);
  return values;
}

if (formatPacks) {
  check(formatPacks.releaseRef === releaseRef && formatPacks.status === tuple.status, "format-packs.json: release tuple drift");
  check(formatPacks.resolution?.semanticParityRequired === true && formatPacks.resolution?.visualSamenessRequired === false, "format-packs.json: semantic parity policy drift");
  check(Array.isArray(formatPacks.commonTestMatrix) && formatPacks.commonTestMatrix.length >= 2 && formatPacks.commonTestMatrix.every(isNonEmpty), "format-packs.json: resolved-only common test matrix is required");
  check(formatPacks.testIdPolicy?.scheme === "scope_id_plus_one_based_matrix_index", "format-packs.json: stable test ID policy is missing");
  check(sameValue(formatPacks.navigationContract?.currentValues, ["none", "page", "location"]), "format-packs.json: navigation current semantics drift");
  check(sameValue(Object.keys(formatPacks.navigationContract?.currentMeaning ?? {}).sort(), ["location", "none", "page"]), "format-packs.json: navigation current meaning must cover none, page, and location exactly");
  check(sameValue(formatPacks.navigationContract?.currentCardinality, {
    interactiveFormatProfiles: ["web_public", "app_interactive"],
    interactiveNonEmptyMode: { page: "exactly_one", location: "zero_or_one" },
    interactiveSideBookmark: { location: "exactly_one" },
    staticFormatProfiles: ["document_flow", "pdf_fixed", "deck_presentation", "social_static"],
    static: { page: "zero", location: "zero" },
    noneMode: { destinations: "zero", page: "zero", location: "zero" }
  }), "format-packs.json: navigation current cardinality drift");
  const expectedNavigationControlBudgets = {
    "web_public.browser": {
      desktop: { brandRequired: true, maxControls: 4 },
      mobile: { brandRequired: true, maxControls: 2 },
      minimumDirectTarget: { value: 44, unit: "css_px" }
    },
    "app_interactive.browser": {
      desktop: { brandRequired: true, maxControls: 4 },
      mobile: { brandRequired: true, maxControls: 2 },
      minimumDirectTarget: { value: 44, unit: "css_px" }
    },
    "app_interactive.native": {
      desktop: { brandRequired: true, maxControls: 4 },
      mobile: { brandRequired: true, maxControls: 2 },
      minimumDirectTarget: { value: 44, unit: "platform_dp" }
    }
  };
  check(sameValue(formatPacks.navigationContract?.controlBudgetConformanceVariants, Object.keys(expectedNavigationControlBudgets)), "format-packs.json: navigation control-budget variants must identify the exact browser and native interactive branches");
  check(sameValue(formatPacks.navigationContract?.controlBudgetsByConformanceVariant, expectedNavigationControlBudgets), "format-packs.json: navigation control budgets must use exact browser css_px and native platform_dp branches");
  check(sameValue(Object.keys(formatPacks.testIdPolicy?.derivation ?? {}).sort(), ["accessibility", "capability", "common", "experience", "format", "kit", "portability", "target"]), "format-packs.json: test ID derivation must define every resolved test source, including platform portability");
  check(formatPacks.testIdPolicy?.derivation?.capability?.includes("runtime-class additions use capability."), "format-packs.json: capability test-ID derivation must include runtime-class motion tests");
  check(sameValue(formatPacks.testIdPolicy?.resolutionOrder, ["common", "primary_experience", "secondary_experience_in_declared_order", "format", "capability_in_declared_order", "target", "kit", "accessibility", "platform_portability"]), "format-packs.json: resolved test order is ambiguous or omits platform portability");
  const expectedConformanceVariants = [...new Set((targetProfiles?.profiles ?? []).map((target) => `${target.formatProfile}.${target.runtime}`))].sort();
  check(sameValue(Object.keys(formatPacks.accessibilityFixtureIdsByConformanceVariant ?? {}).sort(), expectedConformanceVariants), "format-packs.json: accessibility fixture map must cover every format/runtime conformance variant exactly");
  const declaredAccessibilityFixtureIds = Object.values(formatPacks.accessibilityFixtureIdsByConformanceVariant ?? {}).flat();
  check(unique(declaredAccessibilityFixtureIds), "format-packs.json: accessibility fixture IDs must be globally unique");
  check(sameValue(Object.keys(formatPacks.accessibilityFixtureCriteria ?? {}).sort(), [...declaredAccessibilityFixtureIds].sort()), "format-packs.json: accessibility criteria must cover every fixture ID exactly");
  check(Object.values(formatPacks.accessibilityFixtureCriteria ?? {}).every(isNonEmpty), "format-packs.json: every accessibility fixture requires a non-empty criterion");
  for (const variant of expectedConformanceVariants) {
    const fixtureIds = formatPacks.accessibilityFixtureIdsByConformanceVariant?.[variant] ?? [];
    check(fixtureIds.length > 0 && unique(fixtureIds) && fixtureIds.every((id) => id.startsWith("accessibility.")), `format-packs.json: ${variant} accessibility fixture IDs must be governed and unique`);
  }
  const receiptErrors = receiptEquivalenceErrors(formatPacks);
  check(receiptErrors.length === 0, `format-packs.json: receipt equivalence exposes governance residue${receiptErrors.length ? `\n  ${receiptErrors.join("\n  ")}` : ""}`);
  const identityErrors = identityEquivalenceErrors(formatPacks);
  check(identityErrors.length === 0, `format-packs.json: identity equivalence is incomplete${identityErrors.length ? `\n  ${identityErrors.join("\n  ")}` : ""}`);
  const staticNavigationErrors = staticNavigationProjectionContractErrors(formatPacks);
  check(staticNavigationErrors.length === 0, `format-packs.json: static navigation projection contract is incomplete${staticNavigationErrors.length ? `\n  ${staticNavigationErrors.join("\n  ")}` : ""}`);
  const componentTemplateErrors = componentContractTemplateErrors(formatPacks);
  check(componentTemplateErrors.length === 0, `format-packs.json: governed component contract templates are incomplete${componentTemplateErrors.length ? `\n  ${componentTemplateErrors.join("\n  ")}` : ""}`);
  const ctaErrors = ctaDestinationContractErrors(formatPacks);
  check(ctaErrors.length === 0, `format-packs.json: CTA destination contract is incomplete${ctaErrors.length ? `\n  ${ctaErrors.join("\n  ")}` : ""}`);
  const overlayErrors = capabilityOverlayContractErrors(formatPacks);
  check(overlayErrors.length === 0, `format-packs.json: capability overlay contract is incomplete${overlayErrors.length ? `\n  ${overlayErrors.join("\n  ")}` : ""}`);
  check(sameValue(Object.keys(formatPacks.capabilityRuleIds ?? {}).sort(), [...capabilityEnum].sort()), "format-packs.json: capability map keys must exactly equal Build Card capability enum");
  check(sameValue(Object.keys(formatPacks.experienceProfileRuleIds ?? {}).sort(), [...experienceProfileEnum].sort()), "format-packs.json: experience profile rule map must cover the Build Card profile enum exactly");
  check(sameValue(Object.keys(formatPacks.experienceProfileTestMatrix ?? {}).sort(), [...experienceProfileEnum].sort()), "format-packs.json: experience profile test matrix must cover the Build Card profile enum exactly");
  const experienceTestErrors = experienceProfileTestContractErrors(formatPacks);
  check(experienceTestErrors.length === 0, `format-packs.json: experience test contract is incomplete${experienceTestErrors.length ? `\n  ${experienceTestErrors.join("\n  ")}` : ""}`);
  const accessibilityContractErrors = accessibilityProjectionContractErrors(formatPacks);
  check(accessibilityContractErrors.length === 0, `format-packs.json: accessibility projection contract is incomplete${accessibilityContractErrors.length ? `\n  ${accessibilityContractErrors.join("\n  ")}` : ""}`);
  for (const profile of experienceProfileEnum) {
    const mappedRules = formatPacks.experienceProfileRuleIds?.[profile] ?? [];
    const tests = formatPacks.experienceProfileTestMatrix?.[profile] ?? [];
    check(mappedRules.length > 0 && unique(mappedRules), `format-packs.json: ${profile} experience rules must be nonempty and unique`);
    mappedRules.forEach((id) => check(ruleIdSet.has(id), `format-packs.json: ${profile} experience profile references unknown rule ${id}`));
    check(tests.length >= 2 && tests.every(isNonEmpty), `format-packs.json: ${profile} experience profile requires a usable test matrix`);
  }
  for (const [capability, mappedRules] of Object.entries(formatPacks.capabilityRuleIds ?? {})) {
    check(Array.isArray(mappedRules) && mappedRules.length > 0, `format-packs.json: ${capability} rule map must be non-empty`);
    mappedRules.forEach((id) => check(ruleIdSet.has(id), `format-packs.json: ${capability} references unknown rule ${id}`));
  }
  for (const [index, pack] of (formatPacks.packs ?? []).entries()) {
    check(!packByProfile.has(pack.formatProfile), `format-packs.json: duplicate format profile ${pack.formatProfile}`);
    packByProfile.set(pack.formatProfile, pack);
    check(allowedProfiles.includes(pack.formatProfile), `format-packs.json packs[${index}]: unknown format profile`);
    check(kitById.get(pack.kitRef)?.formatProfile === pack.formatProfile, `format-packs.json: ${pack.id} kitRef does not resolve to the same profile`);
    for (const targetRef of pack.targetProfileRefs ?? []) check(targetById.get(targetRef)?.formatProfile === pack.formatProfile, `format-packs.json: ${pack.id} target ${targetRef} does not resolve to the same profile`);
    for (const id of pack.requiredRuleIds ?? []) check(ruleIdSet.has(id), `format-packs.json: ${pack.id} references unknown rule ${id}`);
    for (const [trigger, ids] of Object.entries(pack.conditionalRuleIds ?? {})) {
      check(trigger === "side_bookmark" || capabilityEnum.includes(trigger), `format-packs.json: ${pack.id} has unknown conditional trigger ${trigger}`);
      for (const id of ids) check(ruleIdSet.has(id), `format-packs.json: ${pack.id}/${trigger} references unknown rule ${id}`);
    }
    check(Array.isArray(pack.requiredOutputs) && pack.requiredOutputs.length > 0 && Array.isArray(pack.testMatrix) && pack.testMatrix.length > 0, `format-packs.json: ${pack.id} outputs/tests are required`);
    check(unique(indexedTestIds(`format.${pack.id}`, pack.testMatrix)), `format-packs.json: ${pack.id} generated format test IDs are not unique`);
  }
  const knownFormatTestIds = (formatPacks.packs ?? []).flatMap((pack) => indexedTestIds(`format.${pack.id}`, pack.testMatrix));
  check((formatPacks.productionTestIds ?? []).length > 0 && unique(formatPacks.productionTestIds) && formatPacks.productionTestIds.every((id) => knownFormatTestIds.includes(id)), "format-packs.json: production test IDs must resolve to stable format tests");
  for (const target of targetProfiles?.profiles ?? []) {
    const profile = target.formatProfile;
    const representative = {
      output: { formatProfile: profile, runtime: target.runtime, targetProfileRef: target.id },
      experience: { profile: "portfolio_orientation", secondaryProfiles: [] },
      capabilities: []
    };
    const tests = resolvedTests(representative);
    check(tests.length > 0 && unique(tests) && !tests.some((id) => id.includes("undefined")), `format-packs.json: ${conformanceVariantKey(representative)} does not resolve a complete unambiguous test set`);
    for (const id of accessibilityFixtureIds(representative)) check(tests.includes(id), `format-packs.json: ${conformanceVariantKey(representative)} resolved tests omit accessibility fixture ${id}`);
  }
  const motionOverlay = overlayByCapability.get("motion");
  for (const variant of motionOverlay?.compatibleConformanceVariants ?? []) {
    const target = (targetProfiles?.profiles ?? []).find((entry) => `${entry.formatProfile}.${entry.runtime}` === variant);
    const representative = {
      output: { formatProfile: target?.formatProfile, runtime: target?.runtime, targetProfileRef: target?.id },
      experience: { profile: "interactive_task", secondaryProfiles: [] },
      capabilities: ["motion"]
    };
    const runtimeClass = motionRuntimeClass(representative);
    const expectedRuntimeTestIds = indexedTestIds(`capability.${motionOverlay?.id}.runtime.${runtimeClass}`, motionOverlay?.testMatrixByRuntimeClass?.[runtimeClass]);
    const resolved = resolvedTests(representative);
    check(Boolean(target) && isNonEmpty(runtimeClass), `format-packs.json: motion conformance variant ${variant} has no exact target/runtime class`);
    check(expectedRuntimeTestIds.length >= 2 && expectedRuntimeTestIds.every((id) => resolved.includes(id)), `format-packs.json: ${variant} motion resolution omits runtime-specific lifecycle tests`);
  }
  check(sameValue([...packByProfile.keys()].sort(), [...allowedProfiles].sort()), "format-packs.json: exactly one pack per allowed format profile is required");
}

check(targetProfiles?.unknownTargetBehavior === "block", "target-profiles.json: unknown targets must block");
check(targetProfiles?.extensionRegistry === null && targetProfiles?.socialStaticScope === "square_1080_and_og_1200x630", "target-profiles.json: 0.9.4 declares the square and the 1200 × 630 link-preview social scope with no extension registry");
check(unique((targetProfiles?.profiles ?? []).map((profile) => profile.id)), "target-profiles.json: profile IDs must be unique");
const socialTargets = (targetProfiles?.profiles ?? []).filter((profile) => profile.formatProfile === "social_static");
const governedSocialTargets = { "target.social.square.1080.01": { widthPx: 1080, heightPx: 1080, aspectRatio: "1:1" }, "target.social.og.1200x630.01": { widthPx: 1200, heightPx: 630, aspectRatio: "40:21" } };
const socialTargetsGoverned = (targets) => targets.length === 2 && sameValue(targets.map((target) => target?.id).sort(), Object.keys(governedSocialTargets).sort()) && targets.every((target) => sameValue(target?.canvas, governedSocialTargets[target?.id]) && !Object.hasOwn(target ?? {}, "channelSpecificOverride"));
check(socialTargetsGoverned(socialTargets), "target-profiles.json: social_static must resolve only the governed 1080 × 1080 square and 1200 × 630 link-preview targets");
check(unique((formatKits?.kits ?? []).map((kit) => kit.id)), "format-kits.json: kit IDs must be unique");
for (const kit of formatKits?.kits ?? []) {
  for (const ref of kit.targetProfileRefs ?? []) check(targetById.get(ref)?.formatProfile === kit.formatProfile, `format-kits.json: ${kit.id} target ${ref} profile mismatch`);
  check(Array.isArray(kit.requiredImplementationControls) && kit.requiredImplementationControls.length > 0 && unique(kit.requiredImplementationControls), `format-kits.json: ${kit.id} implementation controls are missing or duplicated`);
  check(isNonEmpty(kit.roleMap?.identity), `format-kits.json: ${kit.id} does not define an identity role`);
  check(isNonEmpty(kit.artifactProductionRequirement), `format-kits.json: ${kit.id} artifact production requirement is missing`);
}

const referenceImplementationFilesByVariant = new Map([
  ["web_public.browser", files.formatImplementationExample],
  ["app_interactive.browser", files.formatImplementationAppBrowserExample],
  ["app_interactive.native", files.formatImplementationAppNativeExample],
  ["document_flow.static", files.formatImplementationDocumentFlowExample],
  ["pdf_fixed.static", files.formatImplementationPdfFixedExample],
  ["deck_presentation.static", files.formatImplementationDeckPresentationExample],
  ["social_static.static", files.formatImplementationSocialStaticExample]
]);
check(sameValue([...referenceImplementationFilesByVariant.keys()].sort(), [...new Set((targetProfiles?.profiles ?? []).map((target) => `${target.formatProfile}.${target.runtime}`))].sort()), "format implementation reference records must cover every governed format/runtime variant exactly once");
function governedComponentContract(formatProfile, runtime, componentId) {
  const referenceFilename = referenceImplementationFilesByVariant.get(`${formatProfile}.${runtime}`);
  const referenceRecord = documents.get(referenceFilename);
  const fromReference = (referenceRecord?.requirements?.componentContracts ?? []).filter((entry) => entry.componentId === componentId);
  const fromTemplate = (formatPacks?.componentContractTemplates?.templates ?? [])
    .filter((entry) => entry.formatProfile === formatProfile && entry.runtime === runtime && entry.contract?.componentId === componentId)
    .map((entry) => entry.contract);
  const candidates = [...fromReference, ...fromTemplate];
  return candidates.length === 1 ? candidates[0] : null;
}
for (const entry of formatPacks?.componentContractTemplates?.templates ?? []) {
  check(sameValue(governedComponentContract(entry.formatProfile, entry.runtime, entry.contract?.componentId), entry.contract), `format-packs.json: component template ${entry.formatProfile}.${entry.runtime}.${entry.contract?.componentId ?? "unknown"} is missing, ambiguous, or shadowed by a reference record`);
}
const implementationRecordIds = [];
function implementationPlatformContractErrors(record) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const requirements = record?.requirements ?? {};
  const identityImplementationIds = requirements.identityImplementationIds ?? [];
  const bindingIds = requirements.identityTypographyBindingIds ?? [];
  add(identityImplementationIds.length === 1, "format implementation record must select exactly one identity implementation");
  add(bindingIds.length === 1, "format implementation record must select exactly one identity typography binding");
  const bindingEntry = identityTypographyBindingById.get(bindingIds[0]);
  add(Boolean(bindingEntry), "format implementation identity typography binding does not resolve");
  if (bindingEntry) {
    add(identityImplementationIds.includes(bindingEntry.implementation.id), "format implementation identity typography binding is outside the selected identity implementation");
    add(bindingEntry.binding.formatProfile === record.formatProfile, "format implementation identity typography binding format drifts");
    add(bindingEntry.binding.platform === record.authoringPlatform, "format implementation identity typography binding platform drifts");
    if (record.authoringPlatform === "browser") {
      add(bindingEntry.binding.renderingContext === "browser" && bindingEntry.binding.nativeMappingId === null, "browser implementation must use a browser typography binding without native mapping");
      add((bindingEntry.binding.fontAssetIds ?? []).every((id) => (requirements.fontAssetIds ?? []).includes(id)), "browser identity typography font assets are absent from the resolved assets");
    } else {
      add(bindingEntry.binding.nativeMappingId !== null && (requirements.nativeFontMappingIds ?? []).includes(bindingEntry.binding.nativeMappingId), "non-browser identity typography native mapping is absent from the implementation record");
    }
  }
  const mappings = (requirements.nativeFontMappingIds ?? []).map((id) => nativeFontMappingById.get(id));
  add(mappings.every(Boolean), "format implementation native font mapping does not resolve");
  add(mappings.filter(Boolean).every((mapping) => mapping.platform === record.authoringPlatform), "format implementation mixes authoring platforms in native font mappings");
  add(mappings.filter(Boolean).every((mapping) => (mapping.allowedFormatProfiles ?? []).includes(record.formatProfile)), "format implementation native font mapping does not authorize the selected format");
  add(unique(mappings.filter(Boolean).map((mapping) => mapping.role)), "format implementation selects more than one native font mapping for the same role");
  const expectedPortability = record.authoringPlatform === "browser" ? [] : orderedUniqueValues(
    ...mappings.filter(Boolean).map((mapping) => mapping.requiredFixtureIds),
    bindingEntry?.binding.requiredFixtureIds,
    nonWebIconPortabilityFixtureIds
  );
  add((requirements.portabilityFixtureIds ?? []).every((id) => portabilityFixtureIdSet.has(id)), "format implementation portability fixture criterion does not resolve");
  add(sameValue(requirements.portabilityFixtureIds ?? [], expectedPortability), "format implementation portability fixtures do not exactly match the selected platform mappings, identity typography, and icon policy");
  return errors;
}
function referenceImplementationCard(record) {
  const context = record.resolutionContext ?? {};
  return {
    output: { formatProfile: record.formatProfile, runtime: record.runtime, targetProfileRef: record.targetProfileRef },
    experience: { profile: context.experienceProfile, secondaryProfiles: context.secondaryExperienceProfiles ?? [] },
    capabilities: context.capabilities ?? [],
    navigation: { sideBookmark: context.sideBookmarkSelected ? "selected" : "not_applicable" },
    composition: { componentIds: context.componentIds ?? [] },
    audienceOutput: { deliveryAudience: "public" },
    assets: [],
    identityImplementation: null
  };
}
for (const [variant, filename] of referenceImplementationFilesByVariant) {
  const record = documents.get(filename);
  check(Boolean(record), `${filename}: governed reference implementation record is missing`);
  if (!record) continue;
  implementationRecordIds.push(record.recordId);
  check(record.recordKind === "reference_example" && !Object.hasOwn(record, "artifactBinding"), `${filename}: shipped implementation must be an unbound reference_example`);
  check(`${record.formatProfile}.${record.runtime}` === variant, `${filename}: format/runtime identity drifts from its governed variant`);
  const target = targetById.get(record.targetProfileRef);
  const kit = kitById.get(record.formatKitId);
  check(target?.formatProfile === record.formatProfile && target?.runtime === record.runtime, `${filename}: target profile does not match record format/runtime`);
  check(kit?.formatProfile === record.formatProfile && (kit?.targetProfileRefs ?? []).includes(record.targetProfileRef), `${filename}: format kit does not authorize the selected target`);
  check(record.tokenRef === files.tokens && record.tokenSha256 === sha256File(join(packageDir, files.tokens)), `${filename}: token binding differs from active package bytes`);
  for (const error of implementationPlatformContractErrors(record)) check(false, `${filename}: ${error}`);
  const referenceAssetIds = orderedUniqueValues(record.requirements?.identityAssetIds, record.requirements?.fontAssetIds, record.requirements?.iconAssetIds).sort();
  check(sameValue([...(record.requirements?.resolvedAssetIds ?? [])].sort(), referenceAssetIds), `${filename}: resolvedAssetIds must exactly cover the reference record's declared asset roles`);
  check(sameValue(record.requirements?.accessibilityFixtureIds, formatPacks?.accessibilityFixtureIdsByConformanceVariant?.[variant]), `${filename}: accessibility fixture set drifts from the governed variant`);
  const contracts = record.requirements?.componentContracts ?? [];
  check(unique(contracts.map((contract) => contract.componentId)), `${filename}: component contract IDs are not unique`);
  check(sameValue(contracts.map((contract) => contract.componentId), record.requirements?.componentIds ?? []), `${filename}: component contracts do not exactly cover componentIds in order`);
  check(sameValue(record.requirements?.componentIds ?? [], record.resolutionContext?.componentIds ?? []), `${filename}: componentIds drift from the declared reference resolution context`);
  check(sameValue([...new Set(contracts.flatMap((contract) => contract.governingRuleIds ?? []))].sort(), [...(record.requirements?.componentRuleIds ?? [])].sort()), `${filename}: component contracts do not exactly cover componentRuleIds`);
  for (const contract of contracts) {
    check(contract.formatBehavior?.formatProfile === record.formatProfile, `${filename}: ${contract.componentId ?? "unknown"} formatBehavior drifts from the selected format`);
    check((contract.tokenRefs ?? []).every((ref) => String(ref).split("#", 1)[0] === files.tokens && bundleSemanticReferenceResolves(ref, packageDir)), `${filename}: ${contract.componentId ?? "unknown"} token reference does not resolve`);
  }
  const referenceCard = referenceImplementationCard(record);
  check(sameValue(record.requirements?.resolvedRuleIds, resolvedRules(referenceCard)), `${filename}: resolvedRuleIds do not exactly equal the declared reference context`);
  check(sameValue(record.requirements?.resolvedTestIds, resolvedTests(referenceCard, record.requirements?.portabilityFixtureIds ?? [])), `${filename}: resolvedTestIds do not exactly equal the declared reference context and platform fixtures`);
}
check(unique(implementationRecordIds), "format implementation record IDs must be globally unique");

function regexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const universalWorkflowResiduePatterns = [
  /\b(?:approvalState|reviewState|debugState)\b/i,
  /\b(?:sourcePath|workspacePath|localPath|filesystemPath)\b/i,
  /\b(?:pending|awaiting) (?:owner|design system|DS|asset) approval\b/i,
  /\b(?:approval pending|pending review|awaiting review|under internal review)\b/i,
  /\b(?:design system|DS|release|asset) approval workflow\b/i,
  /(?:รอ(?:การ)?อนุมัติ|อยู่ระหว่าง(?:การ)?อนุมัติ|อยู่ระหว่างการตรวจสอบภายใน|ยังไม่(?:ได้)?ทดสอบ|ฉบับร่างภายใน|ข้อมูลชั่วคราว|ต้องรอ[^\s]{0,24}(?:อนุมัติ|ตรวจสอบ))/i,
  /\bnormative_candidate\b/i,
  /\b(?:internal|unpublished|approval|review)[ _-]?(?:draft|candidate|blocked)\b/i,
  /\b(?:draft|candidate|unapproved)[ _-]?(?:release|design[ _-]?system|schema|approval|build)\b/i,
  /\b(?:needs[ _-]?review|not[ _-]?verified)\s+(?:by owner|internally|before release)\b/i,
  /\bpackage_validated\b/i,
  /\bnot_tested\b/i,
  /\bfixture:/i,
  /\b(?:fixtureId|fixtureRef)\b/i,
  /(?:\.fixture(?:\.[a-z0-9_-]+)?\b)/i,
  /\b(?:TODO|TBD|FIXME|lorem|placeholder)\b/i,
  /\b(?:pending_owner_role_approval|unresolved_blocking|block_or_internal_preview|internal preview)\b/i,
  /\b(?:gateResults?|blockingDependencyRefs?)\b/i,
  /\b(?:validator (?:error|warning|output|failed)|debug (?:log|trace|output)|stack trace|assertion failed|schema validation failed)\b/i,
  /(?:^|[\s"'(])(?:work|sources|deliverables)\//i,
  /(?:localhost|file:\/\/|\/Users\/|\/home\/|\/private\/|\/tmp\/|\/var\/|[A-Za-z]:\\)/i
];

const approvalFactPatterns = [
  /\bownerApproval\b/i,
  /\b(?:approvalStatus|approvalDetail|approvedBy|approvedAt)\b/i,
  /\b(?:receiptRef|receiptSha256)\b/i
];

const schemaExamplePatterns = [/(?:\.example\.json\b)/i];

const releaseIdentifierPatterns = [
  /\b(?:releaseRef|schemaVersion|ruleId|machinePackage|rulesetId|authoringRevision|releaseTupleSha256|buildCardRef|buildCardSha256|artifactBuildId)\b/i,
  /https:\/\/landometer\.org\/design-system\/[^\s"')]+/i,
  /\b(?:build-card|artifact-manifest|conformance-receipt|asset-registry|claim-record|claim-manifest|format-kits|target-profiles)\.schema(?:\.[a-z0-9.-]+)?\.json\b/i,
  new RegExp(`\\b(?:${ruleIds.map(regexEscape).join("|")})\\b`, "i"),
  new RegExp(`\\b(?:${[tuple.machinePackage, tuple.rulesetId, tuple.authoringRevision].filter(isNonEmpty).map(regexEscape).join("|")})\\b`, "i")
];

function disclosureAllowsReferenceIdentifiers(disclosurePurpose) {
  return disclosurePurpose === "design_system_reference";
}

function workflowResidueHits(value, path = "$", options = {}) {
  const hits = [];
  const allowed = new Set(options.allowedFieldClasses ?? (options.allowReferenceIdentifiers ? ["release_identifiers", "schema_examples"] : []));
  const patterns = [...universalWorkflowResiduePatterns];
  if (!allowed.has("approval_facts")) patterns.push(...approvalFactPatterns);
  if (!allowed.has("schema_examples")) patterns.push(...schemaExamplePatterns);
  if (!allowed.has("release_identifiers")) patterns.push(...releaseIdentifierPatterns);
  if (Array.isArray(value)) {
    value.forEach((item, index) => hits.push(...workflowResidueHits(item, `${path}/${index}`, options)));
    return hits;
  }
  if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (patterns.some((pattern) => pattern.test(key))) hits.push(`${path}/${key}`);
      hits.push(...workflowResidueHits(child, `${path}/${key}`, options));
    }
    return hits;
  }
  if (typeof value === "string" && patterns.some((pattern) => pattern.test(value))) hits.push(path);
  return hits;
}

function exactLocaleMap(value, locales) {
  return isObject(value)
    && sameValue(Object.keys(value).sort(), [...locales].sort())
    && Object.values(value).every(isNonEmpty);
}

function boundJson(binding, root, label, expectedSchemaRef = null, schema = null) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(isObject(binding), `${label} binding is missing`);
  if (!isObject(binding)) return { errors, document: null, path: null };
  const filename = String(binding.ref ?? "").split("#")[0];
  const path = bundleFilePath(root, filename);
  add(Boolean(path), `${label} ref does not resolve inside the bundle`);
  add(/^[a-f0-9]{64}$/.test(binding.sha256 ?? ""), `${label} sha256 is invalid`);
  if (path) add(sha256File(path) === binding.sha256, `${label} hash does not match bytes`);
  if (expectedSchemaRef) add(binding.schemaRef === expectedSchemaRef, `${label} schemaRef is not the active schema`);
  if (!path) return { errors, document: null, path: null };
  let document;
  try {
    document = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`${label} is not valid JSON (${error.message})`);
    return { errors, document: null, path };
  }
  if (schema) {
    const schemaErrors = validateSchema(schema, document);
    add(schemaErrors.length === 0, `${label} does not satisfy its active schema`);
  }
  return { errors, document, path };
}

function detachedAttestationBindingErrors(binding, expectation, root, trustStores) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const label = expectation.label ?? expectation.purpose ?? "attestation";
  add(isObject(binding) && isNonEmpty(binding.ref), `${label} attestation binding is missing`);
  if (!isObject(binding) || !isNonEmpty(binding.ref)) return errors;
  const path = bundleFilePath(root, binding.ref);
  add(Boolean(path), `${label} attestation does not resolve inside the artifact bundle`);
  if (!path) return errors;
  const actualHash = sha256File(path);
  if (binding.sha256 !== undefined) add(actualHash === binding.sha256, `${label} attestation hash does not match bytes`);
  let attestation = null;
  try { attestation = JSON.parse(readFileSync(path, "utf8")); } catch (error) { errors.push(`${label} attestation is not valid JSON (${error.message})`); }
  if (!attestation) return errors;
  const schemaErrors = validateSchema(verificationAttestationSchema, attestation);
  add(schemaErrors.length === 0, `${label} attestation does not satisfy verification-attestation.schema.json`);
  errors.push(...verifyDetachedAttestation(attestation, {
    purpose: expectation.purpose,
    subjectRef: expectation.subjectRef,
    subjectSha256: expectation.subjectSha256,
    subjectMediaType: expectation.subjectMediaType ?? "application/json",
    checkedAt: expectation.checkedAt,
    operationAt: expectation.operationAt,
    maximumIssueDelayMs: expectation.maximumIssueDelayMs,
    latestIssueAt: expectation.latestIssueAt,
    verificationTime: expectation.verificationTime,
    maximumClockSkewMs: expectation.maximumClockSkewMs,
    requiredStoreScope: expectation.requiredStoreScope
  }, trustStores).map((message) => `${label}: ${message}`));
  return errors;
}

function boundAttestationIssuedAt(binding, root) {
  if (!isObject(binding) || !isNonEmpty(binding.ref)) return NaN;
  const path = bundleFilePath(root, binding.ref);
  if (!path) return NaN;
  try { return Date.parse(JSON.parse(readFileSync(path, "utf8")).issuedAt ?? ""); } catch { return NaN; }
}

function conformanceAttestationPurpose(method) {
  if (method === "automated") return "automated_conformance";
  if (method === "production") return "production_conformance";
  return "human_conformance";
}

function resolveDisclosureAuthority(card, artifactRoot) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const audience = card.audienceOutput ?? {};
  if (audience.disclosurePurpose === "ordinary_experience") return { errors, authority: null, allowedFieldClasses: [] };
  const binding = { ref: audience.disclosureAuthorityRef, sha256: audience.disclosureAuthoritySha256 };
  const resolved = boundJson(binding, artifactRoot, "disclosure authority", null, disclosureAuthoritySchema);
  errors.push(...resolved.errors);
  const authority = resolved.document;
  if (authority) {
    errors.push(...detachedAttestationBindingErrors({
      ref: audience.disclosureAttestationRef,
      sha256: audience.disclosureAttestationSha256
    }, {
      label: "disclosure authority",
      purpose: "disclosure_authority",
      subjectRef: audience.disclosureAuthorityRef,
      subjectSha256: audience.disclosureAuthoritySha256,
      requiredStoreScope: "package_release"
    }, artifactRoot, packageReleaseTrustStores));
    add(authority.releaseRef === releaseRef, "disclosure authority releaseRef drifts");
    add(authority.artifactId === card.artifact?.id, "disclosure authority artifactId drifts");
    add(authority.purpose === audience.disclosurePurpose, "disclosure authority purpose drifts");
    add(authority.status === "approved", "disclosure authority is not approved");
    const allowed = new Set(authority.allowedFieldClasses ?? []);
    if (authority.purpose === "design_system_reference") {
      add([...allowed].every((entry) => ["release_identifiers", "schema_examples"].includes(entry)), "design-system disclosure authority grants an unrelated field class");
      add(allowed.has("release_identifiers"), "design-system disclosure authority lacks release_identifiers");
    }
    if (authority.purpose === "provenance_record") {
      add([...allowed].every((entry) => ["provenance_facts", "approval_facts"].includes(entry)), "provenance disclosure authority grants an unrelated field class");
      add(allowed.has("provenance_facts"), "provenance disclosure authority lacks provenance_facts");
    }
  }
  return { errors, authority, allowedFieldClasses: authority?.allowedFieldClasses ?? [] };
}

function localeContractErrors(card) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const locales = card.locale?.available ?? [];
  const states = card.locale?.states ?? [];
  add(unique(locales) && locales.length > 0, "locale.available must be nonempty and unique");
  add(locales.includes(card.locale?.primary), "locale.primary is not available");
  add(unique(states.map((entry) => entry.locale)), "locale.states contains duplicate locales");
  add(sameValue(states.map((entry) => entry.locale).sort(), [...locales].sort()), "locale.states must cover available locales exactly");
  const primaryState = states.find((entry) => entry.locale === card.locale?.primary)?.status;
  if (locales.length === 1) add(primaryState === "single_locale", "single-locale primary state must be single_locale");
  else {
    add(primaryState === "source", "multi-locale primary state must be source");
    for (const entry of states.filter((item) => item.locale !== card.locale?.primary)) add(["reviewed_translation", "native_parallel"].includes(entry.status), `secondary locale ${entry.locale} has an invalid delivery state`);
  }
  for (const action of card.actions ?? []) {
    add(exactLocaleMap(action.labelByLocale, locales), `${action.id} labelByLocale must cover delivered locales exactly`);
    add(action.label === action.labelByLocale?.[card.locale?.primary], `${action.id} label must equal the primary-locale label`);
    add(exactLocaleMap(action.outcomeByLocale, locales), `${action.id} outcomeByLocale must cover delivered locales exactly`);
    add(action.outcome === action.outcomeByLocale?.[card.locale?.primary], `${action.id} outcome must equal the primary-locale outcome`);
    if (Object.hasOwn(action, "compactLabel") || Object.hasOwn(action, "compactLabelByLocale")) {
      add(isNonEmpty(action.compactLabel) && exactLocaleMap(action.compactLabelByLocale, locales), `${action.id} compact label contract is incomplete`);
      add(action.compactLabel === action.compactLabelByLocale?.[card.locale?.primary], `${action.id} compactLabel must equal its primary-locale value`);
    }
    add(exactLocaleMap(action.destinationBinding?.targetByLocale, locales), `${action.id} destination targetByLocale must cover delivered locales exactly`);
    add(action.destinationBinding?.target === action.destinationBinding?.targetByLocale?.[card.locale?.primary], `${action.id} destination target must equal its primary-locale value`);
    if (["planned", "unavailable"].includes(action.availability)) {
      add(exactLocaleMap(action.availabilityReasonByLocale, locales), `${action.id} availabilityReasonByLocale must cover delivered locales exactly`);
      add(action.availabilityReason === action.availabilityReasonByLocale?.[card.locale?.primary], `${action.id} availabilityReason must equal its primary-locale value`);
    }
  }
  for (const destination of card.navigation?.destinations ?? []) {
    add(exactLocaleMap(destination.labelByLocale, locales), `navigation ${destination.target ?? "unknown"} labelByLocale must cover delivered locales exactly`);
    add(destination.label === destination.labelByLocale?.[card.locale?.primary], `navigation ${destination.target ?? "unknown"} label must equal its primary-locale value`);
    if (Object.hasOwn(destination, "compactLabel") || Object.hasOwn(destination, "compactLabelByLocale")) {
      add(isNonEmpty(destination.compactLabel) && exactLocaleMap(destination.compactLabelByLocale, locales), `navigation ${destination.target ?? "unknown"} compact label contract is incomplete`);
      add(destination.compactLabel === destination.compactLabelByLocale?.[card.locale?.primary], `navigation ${destination.target ?? "unknown"} compactLabel must equal its primary-locale value`);
    }
  }
  add(unique((card.navigation?.destinations ?? []).map((entry) => entry.target)), "navigation destination targets must be unique");
  return errors;
}

function claimTemporalErrors(record, asOf, locales) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const at = Date.parse(asOf ?? "");
  add(Number.isFinite(at), "claimAsOf is invalid");
  add(exactLocaleMap(record?.textByLocale, locales), `claim ${record?.claimId ?? "unknown"} textByLocale must cover delivered locales exactly`);
  add(unique((record?.limitations ?? []).map((limitation) => limitation.id)), `claim ${record?.claimId ?? "unknown"} limitation IDs must be unique`);
  for (const limitation of record?.limitations ?? []) add(exactLocaleMap(limitation.textByLocale, locales), `claim ${record?.claimId ?? "unknown"} limitation ${limitation.id ?? "unknown"} must cover delivered locales exactly`);
  const reviewed = Date.parse(record?.lastReviewed ?? "");
  if (Number.isFinite(at)) add(Number.isFinite(reviewed) && reviewed <= at, `claim ${record?.claimId ?? "unknown"} was reviewed after claimAsOf`);
  if (record?.validityBasis === "timeless") add(record.validFrom === null && record.validUntil === null, `timeless claim ${record?.claimId ?? "unknown"} must have null validity bounds`);
  if (record?.validityBasis === "bounded_interval") {
    const from = Date.parse(record.validFrom ?? "");
    const until = Date.parse(record.validUntil ?? "");
    add(Number.isFinite(from) && Number.isFinite(until) && from <= at && at <= until, `bounded claim ${record?.claimId ?? "unknown"} is not valid at claimAsOf`);
  }
  if (record?.validityBasis === "until_superseded") {
    const from = Date.parse(record.validFrom ?? "");
    add(Number.isFinite(from) && from <= at && record.validUntil === null, `until-superseded claim ${record?.claimId ?? "unknown"} is not current at claimAsOf`);
  }
  if (record?.validUntil !== null && record?.validUntil !== undefined) add(Date.parse(record.validUntil) >= at, `claim ${record?.claimId ?? "unknown"} expired before claimAsOf`);
  return errors;
}

const pageKindStructuredTypes = {
  portfolio_home: ["WebSite", "WebPage", "CollectionPage"],
  product_landing: ["WebPage"],
  detail: ["WebPage"],
  article: ["Article", "BlogPosting"],
  index: ["CollectionPage", "ItemList"],
  tool: ["WebApplication", "SoftwareApplication"],
  dataset: ["Dataset", "DataCatalog"],
  search_results: ["SearchResultsPage"],
  utility: ["WebPage", "ContactPage"]
};

const claimEntityStructuredTypes = {
  protected_brand_line: ["CreativeWork"],
  organization: ["Organization"],
  website: ["WebSite"],
  web_page: ["WebPage"],
  article: ["Article", "BlogPosting"],
  dataset: ["Dataset"],
  data_catalog: ["DataCatalog"],
  tool: ["WebApplication", "SoftwareApplication"],
  place: ["Place"],
  product: ["Thing"],
  subject: ["Thing"]
};

function structuredAudienceResidueErrors(projection) {
  const audienceFields = {
    pageKind: projection?.pageKind,
    canonicalUrl: projection?.canonicalUrl,
    entities: (projection?.entities ?? []).map((entity) => ({
      entityId: entity.entityId,
      role: entity.role,
      identityBasis: entity.identityBasis,
      types: entity.types,
      nameByLocale: entity.nameByLocale,
      url: entity.url,
      claimIds: entity.claimIds
    }))
  };
  return workflowResidueHits(audienceFields, "$/structuredData");
}

function structuredEntityIdentityErrors(projection, card, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const entities = projection?.entities ?? [];
  const pageEntities = entities.filter((entity) => entity.role === "page");
  add(pageEntities.length === 1, "structured projection must contain exactly one canonical page entity");
  const allowedPageTypes = pageKindStructuredTypes[projection?.pageKind] ?? [];
  for (const entity of entities) {
    add(entity.url === projection?.canonicalUrl, `structured entity ${entity.entityId ?? "unknown"} URL must equal the projection canonical URL`);
    if (entity.role === "page") {
      add(entity.identityBasis === "canonical_page", `structured page entity ${entity.entityId ?? "unknown"} lacks canonical-page identity basis`);
      add((entity.types ?? []).length > 0 && (entity.types ?? []).every((type) => allowedPageTypes.includes(type)), `structured page entity ${entity.entityId ?? "unknown"} types do not match pageKind ${projection?.pageKind}`);
      add(sameValue(entity.nameByLocale, card.publication?.discovery?.titleByLocale), `structured page entity ${entity.entityId ?? "unknown"} names drift from visible page titles`);
    }
  }
  const subjectEntities = entities.filter((entity) => entity.role === "subject");
  if (subjectEntities.length > 0) {
    const claimResolution = resolveBoundClaimManifest(card, artifactRoot);
    errors.push(...claimResolution.errors);
    for (const entity of subjectEntities) {
      add(entity.identityBasis === "projected_claim_entity", `structured subject entity ${entity.entityId ?? "unknown"} lacks projected-claim identity basis`);
      for (const claimId of entity.claimIds ?? []) {
        const record = claimResolution.recordsById.get(claimId)?.record;
        add(Boolean(record), `structured subject entity ${entity.entityId ?? "unknown"} claim ${claimId} does not resolve`);
        if (record) {
          add(record.status === "approved" && record.entity?.entityId === entity.entityId, `structured subject entity ${entity.entityId ?? "unknown"} is not bound to the approved claim entity ${claimId}`);
          const allowedTypes = claimEntityStructuredTypes[record.entity?.entityType] ?? ["Thing"];
          add((entity.types ?? []).length > 0 && (entity.types ?? []).every((type) => allowedTypes.includes(type)), `structured subject entity ${entity.entityId ?? "unknown"} types overstate approved claim entity type ${record.entity?.entityType ?? "unknown"}`);
          const expectedNames = Object.fromEntries((card.locale?.available ?? []).map((locale) => [locale, record.entity?.name]));
          add(sameValue(entity.nameByLocale, expectedNames), `structured subject entity ${entity.entityId ?? "unknown"} names drift from approved claim entity ${claimId}`);
        }
      }
    }
  }
  const residue = structuredAudienceResidueErrors(projection);
  add(residue.length === 0, `structured data audience fields contain workflow residue at ${residue.join(", ")}`);
  return errors;
}

function discoveryErrors(card, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const profile = card.output?.formatProfile;
  const discovery = card.publication?.discovery;
  if (profile !== "web_public") {
    add(discovery === undefined, "non-web Build Card must not declare web discovery metadata");
    return errors;
  }
  add(isObject(discovery), "web_public Build Card lacks discovery metadata");
  if (!isObject(discovery)) return errors;
  const locales = card.locale?.available ?? [];
  for (const key of ["titleByLocale", "descriptionByLocale", "primaryHeadingByLocale", "primaryAnswerByLocale"]) add(exactLocaleMap(discovery[key], locales), `discovery.${key} must cover delivered locales exactly`);
  add(discovery.htmlLang === card.locale?.primary, "discovery htmlLang must equal the primary locale");
  add(/^https:\/\//.test(discovery.canonicalUrl ?? ""), "canonicalUrl must be HTTPS");
  add(discovery.visibleTruthOnly === true && discovery.initialHtmlRequired === true, "public discovery must project visible truth in initial HTML");
  add(discovery.robots?.index === (card.publication?.indexing === "index"), "robots.index and publication.indexing drift");
  add(discovery.sitemap?.included === (card.publication?.sitemapEligible === true), "sitemap inclusion and sitemapEligible drift");
  if (discovery.sitemap?.included) add(discovery.sitemap.loc === discovery.canonicalUrl, "sitemap loc must equal the canonical URL");
  const routes = discovery.localeRoutes ?? [];
  add(unique(routes.map((route) => route.locale)), "localeRoutes contains duplicate locales");
  add(unique(routes.map((route) => route.url)), "localeRoutes contains duplicate URLs");
  add(sameValue(routes.map((route) => route.locale).sort(), [...locales].sort()), "localeRoutes must cover delivered locales exactly");
  const expectedAlternates = routes.map((route) => ({ locale: route.locale, url: route.url })).sort((a, b) => a.locale.localeCompare(b.locale));
  for (const route of routes) {
    add(/^https:\/\//.test(route.url ?? "") && /^https:\/\//.test(route.canonicalUrl ?? ""), `locale route ${route.locale ?? "unknown"} must use HTTPS`);
    add(route.canonicalUrl === route.url, `locale route ${route.locale ?? "unknown"} must self-canonicalize`);
    add(unique((route.alternates ?? []).map((entry) => entry.locale)), `locale route ${route.locale ?? "unknown"} contains duplicate alternates`);
    const routeAlternates = (route.alternates ?? []).filter((entry) => entry.locale !== "x-default").sort((a, b) => a.locale.localeCompare(b.locale));
    add(sameValue(routeAlternates, expectedAlternates), `locale route ${route.locale ?? "unknown"} lacks reciprocal alternates`);
    for (const alternate of route.alternates ?? []) add(/^https:\/\//.test(alternate.url ?? ""), `locale route ${route.locale ?? "unknown"} alternate must use HTTPS`);
  }
  add(routes.find((route) => route.locale === card.locale?.primary)?.url === discovery.canonicalUrl, "primary locale route must equal canonicalUrl");
  const social = discovery.socialPreview ?? {};
  add(exactLocaleMap(social.titleByLocale, locales) && exactLocaleMap(social.descriptionByLocale, locales), "social preview localized text must cover delivered locales exactly");
  add(social.url === discovery.canonicalUrl, "social preview URL must equal canonicalUrl");
  if (social.imageAssetId !== null) {
    add(exactLocaleMap(social.imageAltByLocale, locales), "social preview image alt must cover delivered locales exactly");
    add((card.assets ?? []).some((asset) => asset.id === social.imageAssetId && asset.role === "social_preview" && asset.approvalStatus === "approved"), "social preview image is not an approved social_preview asset binding");
  }
  add(unique((discovery.structuredDataBindings ?? []).map((entry) => entry.ref)), "structured data bindings contain duplicate refs");
  const projectedClaimIds = [...new Set((card.composition?.sections ?? []).flatMap((section) => section.claimIds ?? []))];
  const structuredClaimIds = [];
  for (const [index, binding] of (discovery.structuredDataBindings ?? []).entries()) {
    const resolved = boundJson(binding, artifactRoot, `structured data binding ${index}`, release.schemaIds?.structuredDataProjection, structuredDataProjectionSchema);
    errors.push(...resolved.errors);
    const projection = resolved.document;
    if (!projection) continue;
    add(projection.releaseRef === releaseRef && projection.visibleTruthOnly === true, `structured data binding ${index} release or visible-truth contract drifts`);
    add(projection.pageKind === discovery.pageKind && projection.canonicalUrl === discovery.canonicalUrl, `structured data binding ${index} page identity drifts`);
    errors.push(...structuredEntityIdentityErrors(projection, card, artifactRoot));
    add(unique((projection.entities ?? []).map((entry) => entry.entityId)), `structured data binding ${index} contains duplicate entity IDs`);
    for (const entity of projection.entities ?? []) {
      add(exactLocaleMap(entity.nameByLocale, locales), `structured entity ${entity.entityId ?? "unknown"} names must cover delivered locales exactly`);
      add(/^https:\/\//.test(entity.url ?? ""), `structured entity ${entity.entityId ?? "unknown"} URL must be HTTPS`);
      add(unique(entity.claimIds ?? []), `structured entity ${entity.entityId ?? "unknown"} has duplicate claim IDs`);
      for (const claimId of entity.claimIds ?? []) {
        structuredClaimIds.push(claimId);
        add(projectedClaimIds.includes(claimId), `structured entity ${entity.entityId ?? "unknown"} references an unprojected claim ${claimId}`);
      }
    }
  }
  add(sameValue([...new Set(structuredClaimIds)].sort(), [...projectedClaimIds].sort()), "structured data claims must exactly cover projected claims");
  const crawler = boundJson(discovery.crawlerPurposePolicy, artifactRoot, "crawler purpose policy", release.schemaIds?.crawlerPurposePolicy, crawlerPurposePolicySchema);
  errors.push(...crawler.errors);
  if (crawler.document) {
    const decisions = crawler.document.decisions ?? [];
    const purposes = ["search_indexing", "ai_search_retrieval", "model_training", "archival", "monitoring", "agent_action"];
    add(crawler.document.releaseRef === releaseRef && crawler.document.routeClass === "public", "crawler purpose policy release or route class drifts");
    add(unique(decisions.map((entry) => entry.purpose)), "crawler purpose policy contains duplicate purposes");
    add(sameValue(decisions.map((entry) => entry.purpose).sort(), purposes.sort()), "crawler purpose policy must decide every purpose exactly once");
    const actionDecision = decisions.find((entry) => entry.purpose === "agent_action");
    add(actionDecision?.decision !== "allow", "crawler discoverability must not grant agent-action authority");
    if (actionDecision?.decision === "conditional") add(isNonEmpty(actionDecision.conditionRef), "conditional agent-action crawling lacks an authority condition ref");
  }
  return errors;
}

const genericCapabilityConfigIds = new Set([
  "data_table", "data_visualization", "map", "form", "authentication", "permissions",
  "sharing", "download", "external_effect", "carousel", "social_feed", "telemetry"
]);

function typedCapabilityActionContractErrors(card, configuration, field, kind, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const contractBinding = configuration?.[field];
  const label = `external_effect ${field}`;
  add(isObject(contractBinding), `${label} is not a typed hash-bound contract`);
  if (!isObject(contractBinding)) return errors;
  const expectedSchemaRef = `${release.schemaIds?.actionContracts}#/$defs/${kind}`;
  const normativeSchemaSha256 = sha256File(join(packageDir, files.actionContractsSchema));
  add(contractBinding.schemaRef === expectedSchemaRef, `${label} schemaRef is not the governed ${kind} contract`);
  add(contractBinding.schemaSha256 === normativeSchemaSha256, `${label} schema hash does not match governed action-contract bytes`);
  const [filename, fragment] = String(contractBinding.ref ?? "").split("#", 2);
  const valuePath = bundleFilePath(artifactRoot, filename);
  add(Boolean(valuePath), `${label} does not resolve inside the bundle`);
  if (!valuePath) return errors;
  add(sha256File(valuePath) === contractBinding.sha256, `${label} value hash mismatch`);
  let document = null;
  try { document = JSON.parse(readFileSync(valuePath, "utf8")); } catch { document = null; }
  add(Boolean(document), `${label} is not valid JSON`);
  if (!document) return errors;
  const value = resolveJsonPointerFragment(document, fragment);
  add(Boolean(value), `${label} fragment does not resolve`);
  if (!value) return errors;
  const schema = pointer(actionContractsSchema, `#/$defs/${kind}`);
  const schemaErrors = validateSchema(schema, value, actionContractsSchema);
  add(schemaErrors.length === 0, `${label} violates the governed ${kind} contract${schemaErrors.length ? `: ${schemaErrors.join("; ")}` : ""}`);
  add(value.kind === kind, `${label} kind drifts`);
  for (const key of ["messageByLocale", "fallbackByLocale", "denialRecoveryByLocale", "accessibleStatusByLocale"]) {
    if (value[key] && card) add(exactLocaleMap(value[key], card.locale?.available ?? []), `${label} ${key} must cover delivered locales exactly`);
  }
  return errors;
}

function capabilityReceiptSchemaBindingErrors(configuration, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const binding = configuration?.receiptSchemaBinding;
  add(isObject(binding), "external_effect receiptSchemaBinding is not a typed hash-bound schema");
  if (!isObject(binding)) return errors;
  add(binding.schemaId === release.schemaIds?.agentActionReceipt, "external_effect receipt schema ID is not the active agent-action receipt schema");
  const schemaPath = bundleFilePath(artifactRoot, binding.ref);
  add(Boolean(schemaPath), "external_effect receipt schema does not resolve inside the bundle");
  if (!schemaPath) return errors;
  add(sha256File(schemaPath) === binding.sha256, "external_effect receipt schema hash mismatch");
  add(binding.sha256 === sha256File(join(packageDir, files.agentActionReceiptSchema)), "external_effect receipt schema bytes differ from the active package schema");
  let schema = null;
  try { schema = JSON.parse(readFileSync(schemaPath, "utf8")); } catch { schema = null; }
  add(Boolean(schema) && schema.$id === binding.schemaId, "external_effect receipt schema $id drifts from its binding");
  return errors;
}

function bundleSemanticReferenceResolves(ref, artifactRoot = packageDir) {
  const [filename, fragment] = String(ref ?? "").split("#", 2);
  const path = bundleFilePath(artifactRoot, filename);
  if (!path) return false;
  if (fragment === undefined || fragment === "") return true;
  if (!fragment.startsWith("/")) return false;
  try {
    const document = JSON.parse(readFileSync(path, "utf8"));
    return Boolean(resolveJsonPointerFragment(document, fragment));
  } catch {
    return false;
  }
}

function semanticReferenceResolves(ref, card, artifactRoot = packageDir) {
  if (!isNonEmpty(ref)) return false;
  if (/^https:\/\/[^\s]+$/i.test(ref) || /^urn:[^\s]+$/i.test(ref)) return true;
  if (String(ref).startsWith("#")) return (card?.composition?.sections ?? []).some((section) => `#${section.id}` === ref);
  const declaredTargets = new Set([
    ...(card?.navigation?.destinations ?? []).map((destination) => destination.target),
    ...(card?.actions ?? []).map((action) => action.destinationBinding?.target).filter(isNonEmpty)
  ]);
  return declaredTargets.has(ref) || bundleSemanticReferenceResolves(ref, artifactRoot);
}

function capabilitySemanticReferenceErrors(capability, configuration, card, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  if (!configuration || !card) return errors;
  if (["data_table", "data_visualization"].includes(capability)) {
    const claimResolution = resolveBoundClaimManifest(card, artifactRoot);
    errors.push(...claimResolution.errors);
    const availableClaimIds = new Set(claimResolution.recordsById.keys());
    const availableEvidenceRefs = new Set([...claimResolution.recordsById.values()].flatMap(({ record }) => record?.evidenceRefs ?? []));
    for (const claimId of configuration.claimIds ?? []) add(availableClaimIds.has(claimId), `${capability} claimId ${claimId ?? "unknown"} does not resolve through the bound claim manifest`);
    for (const evidenceRef of configuration.evidenceIds ?? []) add(availableEvidenceRefs.has(evidenceRef) || semanticReferenceResolves(evidenceRef, card, artifactRoot), `${capability} evidence reference ${evidenceRef ?? "unknown"} does not resolve through a claim record, stable reference, or bundle file`);
  }
  if (capability === "map") {
    add(semanticReferenceResolves(configuration.boundarySource, card, artifactRoot), "map boundarySource does not resolve to a stable or bundle reference");
    add(bundleSemanticReferenceResolves(configuration.exportReceipt, artifactRoot), "map exportReceipt does not resolve inside the artifact bundle");
  }
  if (capability === "form") {
    add(semanticReferenceResolves(configuration.privacyNoticeRef, card, artifactRoot), "form privacyNoticeRef does not resolve to a declared destination or governed resource");
    add(semanticReferenceResolves(configuration.submission?.destinationRef, card, artifactRoot), "form submission.destinationRef does not resolve to a declared destination or governed resource");
  }
  if (capability === "authentication") add(semanticReferenceResolves(configuration.recoveryPath, card, artifactRoot), "authentication recoveryPath does not resolve to a declared destination or governed resource");
  if (capability === "sharing") add(semanticReferenceResolves(configuration.objectRef, card, artifactRoot), "sharing objectRef does not resolve to a governed resource");
  if (capability === "download") {
    const [filename, fragment] = String(configuration.resourceRef ?? "").split("#", 2);
    const path = fragment === undefined ? bundleFilePath(artifactRoot, filename) : null;
    add(Boolean(path), "download resourceRef must resolve to one complete bundle file");
    if (path) {
      add(sha256File(path) === configuration.integritySha256, "download resource integritySha256 does not match the referenced bytes");
      add(readFileSync(path).byteLength === configuration.byteSize, "download resource byteSize does not match the referenced bytes");
      add(configuration.fileName === filename.split("/").pop(), "download fileName drifts from resourceRef");
    }
  }
  if (capability === "social_feed") add(semanticReferenceResolves(configuration.source, card, artifactRoot), "social_feed source does not resolve to a stable or bundle reference");
  return errors;
}

function capabilityConfigurationContractErrors(capability, binding, configuration, artifactRoot = packageDir, card = null) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const fixedSchemas = {
    claims: release.schemaIds?.claimManifest,
    evidence: release.schemaIds?.claimManifest,
    motion: `${release.schemaIds?.capabilityConfig}#/$defs/motion`,
    agent_action: release.schemaIds?.agentActionDefinition
  };
  const expectedSchema = genericCapabilityConfigIds.has(capability) ? release.schemaIds?.capabilityConfig : fixedSchemas[capability];
  add(binding?.schemaRef === expectedSchema, `${capability} capability config schemaRef is not the active typed schema`);
  if (!configuration) return errors;
  if (genericCapabilityConfigIds.has(capability)) {
    const schemaErrors = validateSchema(capabilityConfigSchema, configuration);
    add(schemaErrors.length === 0, `${capability} capability config violates capability-config.schema.json${schemaErrors.length ? `: ${schemaErrors.join("; ")}` : ""}`);
    add(configuration.capability === capability, `${capability} capability discriminator drifts`);
    errors.push(...capabilitySemanticReferenceErrors(capability, configuration, card, artifactRoot));
    if (capability === "external_effect") {
      add(card ? exactLocaleMap(configuration.confirmationPolicy?.consequenceDisclosureByLocale, card.locale?.available ?? []) : true, "external_effect confirmation consequence disclosure must cover delivered locales exactly");
      add(card ? exactLocaleMap(configuration.confirmationPolicy?.confirmLabelByLocale, card.locale?.available ?? []) : true, "external_effect confirmation label must cover delivered locales exactly");
      errors.push(...typedCapabilityActionContractErrors(card, configuration, "permissionContract", "permission", artifactRoot));
      errors.push(...typedCapabilityActionContractErrors(card, configuration, "progressPresentationContract", "progress", artifactRoot));
      errors.push(...typedCapabilityActionContractErrors(card, configuration, "resultPresentationContract", "result", artifactRoot));
      errors.push(...typedCapabilityActionContractErrors(card, configuration, "recoveryContract", "recovery", artifactRoot));
      errors.push(...capabilityReceiptSchemaBindingErrors(configuration, artifactRoot));
    }
  } else if (["claims", "evidence"].includes(capability)) {
    const schemaErrors = validateSchema(claimManifestSchema, configuration);
    add(schemaErrors.length === 0, `${capability} capability config violates claim-manifest.schema.json`);
  } else if (capability === "agent_action") {
    const schemaErrors = validateSchema(agentActionDefinitionSchema, configuration);
    add(schemaErrors.length === 0, "agent_action capability config violates agent-action-definition.schema.json");
  } else if (capability === "motion") {
    const schemaErrors = validateSchema(pointer(capabilityConfigSchema, "#/$defs/motion"), configuration, capabilityConfigSchema);
    add(schemaErrors.length === 0, `motion capability config violates its typed schema${schemaErrors.length ? `: ${schemaErrors.join("; ")}` : ""}`);
    add(sameValue(configuration, tokens?.motion?.approach), "motion capability config does not equal the active motion token object");
  }
  return errors;
}

function capabilityConfigErrors(card, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const configs = card.capabilityConfigRefs ?? {};
  add(sameValue([...(card.capabilities ?? [])].sort(), Object.keys(configs).sort()), "capabilities and capabilityConfigRefs keys differ");
  for (const [capability, binding] of Object.entries(configs)) {
    add(capabilityEnum.includes(capability), `unknown capability config ${capability}`);
    errors.push(...capabilityOverlayUseErrors(capability, card.output?.formatProfile));
    add(isObject(binding), `${capability} capability config is not a hash-bound binding`);
    if (!isObject(binding)) continue;
    const overlay = overlayByCapability.get(capability);
    add(Boolean(overlay), `${capability} capability lacks an overlay schema contract`);
    if (overlay) add(binding.schemaRef === overlay.configSchemaRef, `${capability} capability binding schemaRef differs from overlay configSchemaRef`);
    const [filename, fragment] = String(binding.ref ?? "").split("#", 2);
    const path = bundleFilePath(artifactRoot, filename);
    add(Boolean(path), `${capability} capability config ref does not resolve inside the bundle`);
    if (path) add(sha256File(path) === binding.sha256, `${capability} capability config hash mismatch`);
    let configuration = null;
    if (path) {
      try {
        const document = JSON.parse(readFileSync(path, "utf8"));
        configuration = fragment?.startsWith("/") ? pointer(document, `#${fragment}`) : document;
      } catch (error) {
        errors.push(`${capability} capability config does not resolve (${error.message})`);
      }
    }
    errors.push(...capabilityConfigurationContractErrors(capability, binding, configuration, artifactRoot, card));
    if (configuration && overlay) for (const field of overlay.requiredFields ?? []) add(Object.hasOwn(configuration, field), `${capability} capability config is missing required field ${field}`);
  }
  if (configs.claims) add(configs.claims.ref === card.publication?.claimManifestRef && configs.claims.sha256 === card.publication?.claimManifestSha256, "claims capability binding and publication manifest binding differ");
  if (configs.evidence) add(configs.evidence.ref === card.publication?.claimManifestRef && configs.evidence.sha256 === card.publication?.claimManifestSha256, "evidence capability binding and publication manifest binding differ");
  return errors;
}

function agentSideEffectAuthorityErrors(authority, sideEffect) {
  const errors = [];
  const authorized = authority?.authorizedSideEffectClasses ?? [];
  if (!authorized.includes(sideEffect?.class)) errors.push("agent action side effect class is outside authority scope");
  if (sideEffect?.external === true && !authorized.includes("external")) errors.push("agent action external effect is outside authority scope");
  if (["possible", "known"].includes(sideEffect?.cost) && !authorized.includes("costly")) errors.push("agent action costly effect is outside authority scope");
  return errors;
}

function packageSchemaEntry(schemaRef) {
  return [...documents.entries()].find(([filename, document]) => filename.endsWith(".schema.json") && document?.$id === schemaRef) ?? null;
}

function packageSchemaBindingErrors(schemaRef, schemaSha256, label) {
  const errors = [];
  const entry = packageSchemaEntry(schemaRef);
  if (!entry) errors.push(`${label} schemaRef does not resolve to a declared package schema`);
  else if (sha256File(join(packageDir, entry[0])) !== schemaSha256) errors.push(`${label} schema hash does not match declared package schema bytes`);
  return errors;
}

function agentResultValueErrors(result, schemaRef) {
  const entry = packageSchemaEntry(schemaRef);
  if (!entry) return ["agent action result schema does not resolve"];
  return validateSchema(entry[1], result).map((error) => `agent action result violates its bound schema: ${error}`);
}

function agentDefinitionRuntimeScopeErrors(definition, runtime, card) {
  const errors = [];
  if (definition.artifactId !== card.artifact?.id) errors.push("agent action definition artifact scope drifts from Build Card");
  if (runtime.scope?.artifactId !== card.artifact?.id) errors.push("agent action runtime artifact scope drifts from Build Card");
  if (definition.artifactId !== runtime.scope?.artifactId) errors.push("agent action definition artifact scope drifts from runtime");
  if (definition.productScope !== runtime.scope?.productScope) errors.push("agent action definition product scope drifts from runtime");
  if ((definition.namedProduct ?? null) !== (runtime.scope?.namedProduct ?? null)) errors.push("agent action definition named product drifts from runtime");
  if (definition.productScope !== card.artifact?.productScope) errors.push("agent action definition product scope drifts from Build Card");
  if ((definition.namedProduct ?? null) !== (card.artifact?.namedProduct ?? null)) errors.push("agent action definition named product drifts from Build Card");
  if (definition.productScope === "shared_landometer" && Object.hasOwn(definition, "namedProduct")) errors.push("shared agent definition must not carry namedProduct");
  if (runtime.scope?.productScope === "shared_landometer" && Object.hasOwn(runtime.scope ?? {}, "namedProduct")) errors.push("shared agent runtime must not carry namedProduct");
  return errors;
}

function agentReceiptRuntimeErrors(receipt, runtime) {
  const errors = [];
  if (receipt.executionId !== runtime.execution?.executionId) errors.push("agent action receipt execution identity drifts from runtime");
  if (receipt.executionNonce !== runtime.execution?.executionNonce) errors.push("agent action receipt execution nonce drifts from runtime");
  if (receipt.buildCardRef !== runtime.execution?.buildCardRef || receipt.buildCardSha256 !== runtime.execution?.buildCardSha256) errors.push("agent action receipt Build Card binding drifts from runtime");
  if (receipt.terminalRevocationRef !== runtime.execution?.terminalRevocationRef
    || receipt.terminalRevocationSha256 !== runtime.execution?.terminalRevocationSha256
    || receipt.terminalRevocationSchemaRef !== runtime.execution?.terminalRevocationSchemaRef
    || receipt.terminalRevocationAttestationRef !== runtime.execution?.terminalRevocationAttestationRef
    || receipt.terminalRevocationAttestationSha256 !== runtime.execution?.terminalRevocationAttestationSha256) errors.push("agent action receipt terminal revocation binding drifts from runtime");
  if (receipt.operation !== runtime.scope?.allowedOperation) errors.push("agent action receipt operation drifts from runtime");
  if (receipt.status !== runtime.execution?.status) errors.push("agent action receipt status drifts from runtime");
  if (receipt.startedAt !== runtime.execution?.startedAt || receipt.effectAt !== runtime.execution?.effectAt || receipt.completedAt !== runtime.execution?.completedAt) errors.push("agent action receipt timestamps drift from runtime");
  if (!sameValue(receipt.sideEffect, runtime.sideEffect)) errors.push("agent action receipt side effect drifts from runtime");
  if (receipt.resultRef !== runtime.execution?.resultRef || receipt.resultSha256 !== (runtime.execution?.resultSha256 ?? null)) errors.push("agent action receipt result binding drifts from runtime");
  if (receipt.recoveryRef !== runtime.execution?.recoveryRef || receipt.recoverySha256 !== (runtime.execution?.recoverySha256 ?? null)) errors.push("agent action receipt recovery binding drifts from runtime");
  return errors;
}

function agentHasConsequence(sideEffect) {
  return sideEffect?.class !== "none" || sideEffect?.external === true || sideEffect?.cost !== "none";
}

function agentExecutionBoundary(runtime) {
  const execution = runtime?.execution ?? {};
  const terminal = ["succeeded", "failed", "cancelled"].includes(execution.status);
  const completedAt = Date.parse(execution.completedAt ?? "");
  const effectAt = Date.parse(execution.effectAt ?? "");
  const startedAt = Date.parse(execution.startedAt ?? "");
  if (terminal && Number.isFinite(completedAt)) return completedAt;
  if (Number.isFinite(effectAt)) return effectAt;
  if (Number.isFinite(startedAt)) return startedAt;
  return Date.parse(tuple.ownerApproval?.approvedAt ?? "");
}

function agentTerminalRevocationBoundary(runtime) {
  const execution = runtime?.execution ?? {};
  if (!["succeeded", "failed", "cancelled"].includes(execution.status)) return NaN;
  const effectAt = Date.parse(execution.effectAt ?? "");
  if (Number.isFinite(effectAt)) return effectAt;
  return Date.parse(execution.completedAt ?? "");
}

function agentChronologyErrors(runtime, authority) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const execution = runtime?.execution ?? {};
  const attempted = ["running", "succeeded", "failed", "cancelled"].includes(execution.status);
  const terminal = ["succeeded", "failed", "cancelled"].includes(execution.status);
  const startedAt = Date.parse(execution.startedAt ?? "");
  const effectAt = Date.parse(execution.effectAt ?? "");
  const completedAt = Date.parse(execution.completedAt ?? "");
  const authorizedAt = Date.parse(authority?.authorizedAt ?? "");
  const notBefore = Date.parse(authority?.validity?.notBefore ?? "");
  const expiresAt = authority?.validity?.expiresAt === null ? null : Date.parse(authority?.validity?.expiresAt ?? "");
  const boundary = agentExecutionBoundary(runtime);

  add(Number.isFinite(authorizedAt) && Number.isFinite(notBefore) && authorizedAt <= notBefore, "agent action authority validity begins before authorization");
  if (expiresAt !== null) add(Number.isFinite(expiresAt) && notBefore <= expiresAt, "agent action authority validity window is inverted");
  if (attempted) {
    add(Number.isFinite(startedAt), "agent action execution start time is invalid");
    add(authorizedAt <= startedAt, "agent action execution started before authorization");
    add(notBefore <= startedAt, "agent action authority is not yet valid at execution start");
  }
  if (execution.effectAt !== null && execution.effectAt !== undefined) {
    add(agentHasConsequence(runtime?.sideEffect), "agent action records an effect for a no-effect operation");
    add(Number.isFinite(effectAt) && Number.isFinite(startedAt) && startedAt <= effectAt, "agent action effect precedes execution start");
    if (terminal) add(effectAt <= completedAt, "agent action effect follows terminal completion");
  }
  if (terminal) add(Number.isFinite(startedAt) && Number.isFinite(completedAt) && startedAt <= completedAt, "agent action completion precedes its start time");
  if (expiresAt !== null) add(Number.isFinite(boundary) && boundary <= expiresAt, "agent action authority expired before the execution boundary");

  if (runtime?.confirmation?.required && runtime?.confirmation?.state === "confirmed") {
    const confirmedAt = Date.parse(runtime.confirmation.confirmedAt ?? "");
    const confirmationBoundary = Number.isFinite(effectAt) ? effectAt : terminal ? completedAt : startedAt;
    add(Number.isFinite(confirmedAt), "agent action confirmation time is invalid");
    add(authorizedAt <= confirmedAt, "agent action confirmation predates authorization");
    add(Number.isFinite(confirmationBoundary) && confirmedAt <= confirmationBoundary, "agent action confirmation occurred after the effect or execution boundary");
  }
  return errors;
}

function resolveAgentRecoveryContract(action, artifactRoot = packageDir) {
  const errors = [];
  const binding = action?.recoveryContract;
  if (!isObject(binding)) return { errors, states: [] };
  const [filename, fragment] = String(binding.ref ?? "").split("#", 2);
  const path = bundleFilePath(artifactRoot, filename);
  if (!path) return { errors: ["agent action recovery contract does not resolve inside the bundle"], states: [] };
  if (sha256File(path) !== binding.sha256) errors.push("agent action recovery contract hash mismatch");
  let document = null;
  try { document = JSON.parse(readFileSync(path, "utf8")); } catch { document = null; }
  if (!document) return { errors: [...errors, "agent action recovery contract is not valid JSON"], states: [] };
  let value = null;
  try { value = fragment?.startsWith("/") ? pointer(document, `#${fragment}`) : document; } catch { value = null; }
  if (!value || value.kind !== "recovery") return { errors: [...errors, "agent action recovery contract fragment is not a recovery contract"], states: [] };
  return { errors, states: Array.isArray(value.failureStates) ? value.failureStates : [] };
}

function agentRecoveryRequirementErrors(runtime, recoveryStates) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const consequential = agentHasConsequence(runtime?.sideEffect);
  if (consequential) add(recoveryStates.includes("failed") && recoveryStates.includes("cancelled"), "consequential agent action recovery contract must cover failed and cancelled terminal states");
  const status = runtime?.execution?.status;
  const recoveryRequired = recoveryStates.includes(status) || (["failed", "cancelled"].includes(status) && isNonEmpty(runtime?.execution?.effectAt));
  if (recoveryRequired) add(isNonEmpty(runtime?.execution?.recoveryRef) && /^[a-f0-9]{64}$/.test(runtime?.execution?.recoverySha256 ?? ""), "agent action terminal state requires a hash-bound recovery result");
  return errors;
}

function agentTerminalEvidenceErrors(runtime, receipt, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  for (const [refKey, hashKey] of [["resultRef", "resultSha256"], ["recoveryRef", "recoverySha256"]]) {
    const ref = runtime.execution?.[refKey];
    const hash = runtime.execution?.[hashKey];
    if (ref === null || ref === undefined) {
      add(hash === null || hash === undefined, `agent action ${refKey} is null but ${hashKey} is present`);
      continue;
    }
    add(/^[a-f0-9]{64}$/.test(hash ?? ""), `agent action ${refKey} lacks a paired hash`);
    const path = bundleFilePath(artifactRoot, ref);
    add(Boolean(path), `agent action terminal ${refKey} does not resolve inside the bundle`);
    if (!path) continue;
    add(sha256File(path) === hash, `agent action terminal ${refKey} hash mismatch`);
    if (refKey === "resultRef") {
      let result = null;
      try { result = JSON.parse(readFileSync(path, "utf8")); } catch { result = null; }
      add(result !== null, "agent action terminal result is not valid JSON");
      if (result !== null) errors.push(...agentResultValueErrors(result, runtime.execution?.resultSchemaRef));
    }
  }
  if (receipt) {
    const ref = receipt.diagnosticsRef;
    const hash = receipt.diagnosticsSha256;
    if (ref === null || ref === undefined) add(hash === null || hash === undefined, "agent action diagnosticsRef is null but diagnosticsSha256 is present");
    else {
      add(/^[a-f0-9]{64}$/.test(hash ?? ""), "agent action diagnosticsRef lacks a paired hash");
      const path = bundleFilePath(artifactRoot, ref);
      add(Boolean(path), "agent action diagnosticsRef does not resolve inside the bundle");
      if (path) add(sha256File(path) === hash, "agent action diagnostics hash mismatch");
    }
  }
  return errors;
}

function agentRevocationErrors(revocation, authority, runtime, card, expectedPhase = "pre_start") {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(revocation?.releaseRef === releaseRef, "agent action revocation record release drifts");
  add(revocation?.authorityId === authority?.authorityId, "agent action revocation record authority identity drifts");
  add(revocation?.decisionPhase === expectedPhase, `agent action revocation decision phase must be ${expectedPhase}`);
  add(revocation?.executionNonce === runtime.execution?.executionNonce, "agent action revocation decision execution nonce drifts");
  add(revocation?.buildCardRef === runtime.execution?.buildCardRef && revocation?.buildCardSha256 === runtime.execution?.buildCardSha256, "agent action revocation decision Build Card binding drifts");
  add(revocation?.artifactId === card.artifact?.id && revocation?.artifactId === runtime.scope?.artifactId, "agent action revocation decision artifact drifts");
  add(revocation?.actionId === runtime.actionId, "agent action revocation decision action drifts");
  add(revocation?.actorId === runtime.scope?.actor, "agent action revocation decision actor drifts");
  const startedAt = Date.parse(runtime.execution?.startedAt ?? "");
  const terminalBoundary = agentTerminalRevocationBoundary(runtime);
  const checkedAt = Date.parse(revocation?.checkedAt ?? "");
  const authorizedAt = Date.parse(authority?.authorizedAt ?? "");
  const notBefore = Date.parse(authority?.validity?.notBefore ?? "");
  add(Number.isFinite(checkedAt) && Number.isFinite(authorizedAt) && Number.isFinite(notBefore) && checkedAt >= Math.max(authorizedAt, notBefore), "agent action revocation decision predates authority authorization or validity");
  const attempted = ["running", "succeeded", "failed", "cancelled"].includes(runtime.execution?.status);
  const terminal = ["succeeded", "failed", "cancelled"].includes(runtime.execution?.status);
  if (expectedPhase === "pre_start" && attempted) {
    add(Number.isFinite(startedAt) && Number.isFinite(checkedAt) && checkedAt <= startedAt, "agent action revocation decision must be checked before execution starts");
    add(startedAt - checkedAt >= 0 && startedAt - checkedAt <= 300000, "agent action revocation decision is outside the five-minute pre-start freshness window");
  }
  if (expectedPhase === "terminal_boundary") {
    add(terminal, "agent action terminal revocation decision is only valid for a terminal execution");
    add(Number.isFinite(terminalBoundary) && Number.isFinite(checkedAt) && terminalBoundary <= checkedAt, "agent action terminal revocation decision must be checked at or after the effect or terminal boundary");
    add(checkedAt - terminalBoundary >= 0 && checkedAt - terminalBoundary <= 300000, "agent action terminal revocation decision is outside the five-minute post-boundary freshness window");
  }
  if (revocation?.status === "revoked") {
    const revokedAt = Date.parse(revocation.revokedAt ?? "");
    add(Number.isFinite(revokedAt) && Number.isFinite(checkedAt) && revokedAt <= checkedAt, "agent action revocation chronology is invalid");
    if (expectedPhase === "terminal_boundary") add(Number.isFinite(terminalBoundary) && revokedAt > terminalBoundary, "agent action authority was revoked at or before the effect or terminal execution boundary");
    else add(false, "agent action authority has been revoked before execution");
  } else add(revocation?.status === "not_revoked", "agent action revocation status is invalid");
  return errors;
}

function agentTerminalRevocationBindingErrors(runtime, authority, preStartDecision = null, terminalDecision = null) {
  const execution = runtime?.execution ?? {};
  const validity = authority?.validity ?? {};
  const bindingPairs = [
    [execution.terminalRevocationRef, validity.revocationRef],
    [execution.terminalRevocationSha256, validity.revocationSha256],
    [execution.terminalRevocationAttestationRef, validity.revocationAttestationRef],
    [execution.terminalRevocationAttestationSha256, validity.revocationAttestationSha256]
  ];
  const errors = [];
  if (!bindingPairs.every(([terminalValue, preStartValue]) => isNonEmpty(terminalValue) && terminalValue !== preStartValue)) errors.push("agent action terminal revocation decision and attestation must be distinct from the pre-start decision");
  if (preStartDecision && terminalDecision && preStartDecision.revocationId === terminalDecision.revocationId) errors.push("agent action terminal revocation decision must have a distinct logical revocationId");
  return errors;
}

function agentPreStartAttestationOrderErrors(runtime, authority, preStartAttestationIssuedAt, authorityAttestationIssuedAt) {
  if (!["running", "succeeded", "failed", "cancelled"].includes(runtime?.execution?.status)) return [];
  const errors = [];
  const authorizedAt = Date.parse(authority?.authorizedAt ?? "");
  if (!Number.isFinite(authorizedAt) || !Number.isFinite(authorityAttestationIssuedAt) || authorizedAt > authorityAttestationIssuedAt) errors.push("agent action authority attestation predates the authority record");
  if (!Number.isFinite(preStartAttestationIssuedAt) || !Number.isFinite(authorityAttestationIssuedAt) || preStartAttestationIssuedAt > authorityAttestationIssuedAt) errors.push("agent action pre-start revocation attestation must be issued no later than the authority attestation");
  return errors;
}

function agentTerminalAttestationOrderErrors(terminalRevocationAttestationIssuedAt, receiptAttestationIssuedAt) {
  return Number.isFinite(terminalRevocationAttestationIssuedAt)
    && Number.isFinite(receiptAttestationIssuedAt)
    && terminalRevocationAttestationIssuedAt <= receiptAttestationIssuedAt
    ? []
    : ["agent action terminal revocation attestation must be issued no later than the terminal execution receipt attestation"];
}

function agentActionCrossErrors(runtime, card, artifactRoot = packageDir, trustStores = externalTrustStoresForRoot(artifactRoot)) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const definition = boundJson({ ref: runtime.definitionRef, sha256: runtime.definitionSha256, schemaRef: runtime.definitionSchemaRef }, artifactRoot, "agent action definition", release.schemaIds?.agentActionDefinition, agentActionDefinitionSchema);
  const authority = boundJson({ ref: runtime.permission?.authorityRef, sha256: runtime.permission?.authoritySha256, schemaRef: runtime.permission?.authoritySchemaRef }, artifactRoot, "agent action authority", release.schemaIds?.agentActionAuthority, agentActionAuthoritySchema);
  const inputSchemaPath = bundleFilePath(artifactRoot, runtime.inputs?.schemaRef);
  const inputValuePath = bundleFilePath(artifactRoot, runtime.inputs?.valueRef);
  const runtimeBuildCardPath = bundleFilePath(artifactRoot, runtime.execution?.buildCardRef);
  const packageExample = resolve(artifactRoot) === resolve(packageDir);
  const authorityTrustStores = packageExample ? packageReleaseTrustStores : trustStores;
  const authorityStoreScope = packageExample ? "package_release" : "operator_external";
  const authorityAttestationBinding = {
    ref: runtime.permission?.authorityAttestationRef,
    sha256: runtime.permission?.authorityAttestationSha256
  };
  const authorityAttestationIssuedAt = boundAttestationIssuedAt(authorityAttestationBinding, artifactRoot);
  let preStartRevocationAttestationIssuedAt = NaN;
  let terminalRevocationAttestationIssuedAt = NaN;
  errors.push(...definition.errors, ...authority.errors);
  errors.push(...detachedAttestationBindingErrors(authorityAttestationBinding, {
    label: "agent action authority",
    purpose: "agent_authority",
    subjectRef: runtime.permission?.authorityRef,
    subjectSha256: runtime.permission?.authoritySha256,
    latestIssueAt: ["running", "succeeded", "failed", "cancelled"].includes(runtime.execution?.status) ? runtime.execution?.startedAt : undefined,
    requiredStoreScope: authorityStoreScope
  }, artifactRoot, authorityTrustStores));
  add(Boolean(runtimeBuildCardPath), "agent action execution Build Card does not resolve inside the bundle");
  if (runtimeBuildCardPath) {
    add(sha256File(runtimeBuildCardPath) === runtime.execution?.buildCardSha256, "agent action execution Build Card hash mismatch");
    let boundCard = null;
    try { boundCard = JSON.parse(readFileSync(runtimeBuildCardPath, "utf8")); } catch { boundCard = null; }
    add(Boolean(boundCard) && sameValue(boundCard, card), "agent action execution Build Card binding is not the supplied Build Card");
  }
  add(Boolean(inputSchemaPath), "agent action input schema does not resolve inside the bundle");
  add(Boolean(inputValuePath), "agent action input value does not resolve inside the bundle");
  if (inputSchemaPath) add(sha256File(inputSchemaPath) === runtime.inputs?.schemaSha256, "agent action input schema hash mismatch");
  if (inputValuePath) add(sha256File(inputValuePath) === runtime.inputs?.valueSha256, "agent action input value hash mismatch");
  let inputSchema = null;
  let inputValue = null;
  try { if (inputSchemaPath) inputSchema = JSON.parse(readFileSync(inputSchemaPath, "utf8")); } catch { inputSchema = null; }
  try { if (inputValuePath) inputValue = JSON.parse(readFileSync(inputValuePath, "utf8")); } catch { inputValue = null; }
  add(Boolean(inputSchema) && inputSchema.$id === runtime.inputs?.schemaId, "agent action input schema ID drifts");
  if (inputSchema && inputValue) add(validateSchema(inputSchema, inputValue).length === 0, "agent action input value violates its typed schema");
  const def = definition.document;
  const auth = authority.document;
  const buildAction = (card.actions ?? []).find((entry) => entry.id === runtime.actionId);
  const recoveryContract = resolveAgentRecoveryContract(buildAction, artifactRoot);
  add(Boolean(buildAction), "agent action runtime actionId is absent from the Build Card");
  if (def) {
    add(def.releaseRef === releaseRef && def.actionId === runtime.actionId && def.artifactId === runtime.scope?.artifactId, "agent action definition subject drifts from runtime");
    errors.push(...agentDefinitionRuntimeScopeErrors(def, runtime, card));
    add(def.allowedActorClasses.includes(runtime.scope?.actorClass), "agent action actor class is not allowed by definition");
    add(def.operation === runtime.scope?.allowedOperation, "agent action operation drifts from definition");
    add(def.input?.schemaRef === runtime.inputs?.schemaRef && def.input?.schemaSha256 === runtime.inputs?.schemaSha256 && def.input?.schemaId === runtime.inputs?.schemaId, "agent action typed-input contract drifts from definition");
    add(def.input?.allowedClassifications.includes(runtime.inputs?.classification), "agent action input classification is not allowed by definition");
    add(def.permissionPolicy === runtime.permission?.policy, "agent action permission policy drifts from definition");
    add(sameValue(def.sideEffect, runtime.sideEffect), "agent action side effect drifts from immutable definition");
    add(def.confirmationPolicy?.required === runtime.confirmation?.required, "agent action confirmation requirement drifts from definition");
    add(def.resultSchemaRef === runtime.execution?.resultSchemaRef && def.resultSchemaSha256 === runtime.execution?.resultSchemaSha256, "agent action result schema binding drifts from definition");
    add(def.receiptSchemaRef === runtime.execution?.receiptSchemaRef && def.receiptSchemaSha256 === runtime.execution?.receiptSchemaSha256, "agent action receipt schema binding drifts from definition");
    errors.push(...packageSchemaBindingErrors(def.resultSchemaRef, def.resultSchemaSha256, "agent action result"));
    errors.push(...packageSchemaBindingErrors(def.receiptSchemaRef, def.receiptSchemaSha256, "agent action receipt"));
    add(def.errorBehavior === runtime.execution?.errorBehavior, "agent action error behavior drifts from definition");
    if (buildAction) {
      const buildEffect = { ...runtime.sideEffect };
      delete buildEffect.summary;
      add(sameValue(buildAction.consequence, buildEffect), "Build Card action consequence drifts from immutable agent definition");
      add(buildAction.confirmation === def.confirmationPolicy?.mode, "Build Card action confirmation drifts from immutable agent definition");
      const intentOperation = { navigate: "read", inspect: "inspect", draft: "draft", submit: "submit", create: "create", save: "save", share: "share", download: "download", external_handoff: "external_handoff", confirm: "confirm", destructive: "destructive" };
      add(intentOperation[buildAction.intent] === def.operation, "Build Card action intent and agent operation differ");
    }
    const capabilityBinding = card.capabilityConfigRefs?.agent_action;
    add(capabilityBinding?.ref === runtime.definitionRef && capabilityBinding?.sha256 === runtime.definitionSha256 && capabilityBinding?.schemaRef === runtime.definitionSchemaRef, "Build Card agent_action capability does not bind the immutable runtime definition");
  }
  if (auth) {
    add(auth.releaseRef === releaseRef && auth.status === "active", "agent action authority release or status drifts");
    add(auth.artifactId === runtime.scope?.artifactId && auth.actionId === runtime.actionId, "agent action authority subject drifts from runtime");
    add(auth.authorizedActorId === runtime.scope?.actor && auth.authorizedActorClass === runtime.scope?.actorClass, "agent action actor is outside authority scope");
    add(auth.inputSchemaRef === runtime.inputs?.schemaRef && auth.inputSchemaSha256 === runtime.inputs?.schemaSha256 && auth.inputSchemaId === runtime.inputs?.schemaId, "agent action authority input schema drifts");
    add(auth.allowedInputClassifications.includes(runtime.inputs?.classification), "agent action authority does not allow the input classification");
    add(auth.policy === runtime.permission?.policy, "agent action authority policy drifts");
    add(auth.authorizedOperations.includes(runtime.scope?.allowedOperation), "agent action operation is outside authority scope");
    errors.push(...agentSideEffectAuthorityErrors(auth, runtime.sideEffect));
    errors.push(...agentChronologyErrors(runtime, auth));
    const revocation = boundJson(
      { ref: auth.validity?.revocationRef, sha256: auth.validity?.revocationSha256, schemaRef: auth.validity?.revocationSchemaRef },
      artifactRoot,
      "agent action revocation state",
      release.schemaIds?.agentActionRevocation,
      agentActionRevocationSchema
    );
    errors.push(...revocation.errors);
    if (revocation.document) {
      preStartRevocationAttestationIssuedAt = boundAttestationIssuedAt({ ref: auth.validity?.revocationAttestationRef }, artifactRoot);
      errors.push(...agentRevocationErrors(revocation.document, auth, runtime, card));
      errors.push(...detachedAttestationBindingErrors({
        ref: auth.validity?.revocationAttestationRef,
        sha256: auth.validity?.revocationAttestationSha256
      }, {
        label: "agent action revocation decision",
        purpose: "agent_revocation",
        subjectRef: auth.validity?.revocationRef,
        subjectSha256: auth.validity?.revocationSha256,
        operationAt: revocation.document.checkedAt,
        maximumIssueDelayMs: 300000,
        latestIssueAt: ["running", "succeeded", "failed", "cancelled"].includes(runtime.execution?.status) ? runtime.execution?.startedAt : undefined,
        requiredStoreScope: authorityStoreScope
      }, artifactRoot, authorityTrustStores));
    }
    errors.push(...agentPreStartAttestationOrderErrors(runtime, auth, preStartRevocationAttestationIssuedAt, authorityAttestationIssuedAt));
    if (["succeeded", "failed", "cancelled"].includes(runtime.execution?.status)) {
      const terminalRevocation = boundJson(
        {
          ref: runtime.execution?.terminalRevocationRef,
          sha256: runtime.execution?.terminalRevocationSha256,
          schemaRef: runtime.execution?.terminalRevocationSchemaRef
        },
        artifactRoot,
        "agent action terminal revocation state",
        release.schemaIds?.agentActionRevocation,
        agentActionRevocationSchema
      );
      errors.push(...terminalRevocation.errors);
      errors.push(...agentTerminalRevocationBindingErrors(runtime, auth, revocation.document, terminalRevocation.document));
      if (terminalRevocation.document) {
        terminalRevocationAttestationIssuedAt = boundAttestationIssuedAt({ ref: runtime.execution?.terminalRevocationAttestationRef }, artifactRoot);
        errors.push(...agentRevocationErrors(terminalRevocation.document, auth, runtime, card, "terminal_boundary"));
        errors.push(...detachedAttestationBindingErrors({
          ref: runtime.execution?.terminalRevocationAttestationRef,
          sha256: runtime.execution?.terminalRevocationAttestationSha256
        }, {
          label: "agent action terminal revocation decision",
          purpose: "agent_revocation",
          subjectRef: runtime.execution?.terminalRevocationRef,
          subjectSha256: runtime.execution?.terminalRevocationSha256,
          operationAt: terminalRevocation.document.checkedAt,
          maximumIssueDelayMs: 300000,
          requiredStoreScope: "operator_external"
        }, artifactRoot, trustStores));
      }
    }
  }
  const attempted = ["running", "succeeded", "failed", "cancelled"].includes(runtime.execution?.status);
  const consequential = agentHasConsequence(runtime.sideEffect);
  if (consequential) {
    errors.push(...recoveryContract.errors);
  }
  errors.push(...agentRecoveryRequirementErrors(runtime, recoveryContract.states));
  if (attempted) {
    add(["available", "requires_permission"].includes(buildAction?.availability), "agent action execution attempted while the Build Card action is unavailable or planned");
    add(runtime.permission?.status === "granted" || (runtime.permission?.policy === "read_only" && runtime.permission?.status === "not_required"), "agent action execution attempted without effective permission");
    if (runtime.confirmation?.required) add(runtime.confirmation?.state === "confirmed" && isNonEmpty(runtime.confirmation?.confirmedBy) && isNonEmpty(runtime.confirmation?.confirmedAt), "agent action execution attempted without required confirmation");
  }
  if (runtime.confirmation?.state === "confirmed") {
    const confirmationPath = bundleFilePath(artifactRoot, runtime.confirmation?.receiptRef);
    add(Boolean(confirmationPath), "agent action confirmation receipt does not resolve inside the bundle");
    let confirmation = null;
    if (confirmationPath) {
      add(sha256File(confirmationPath) === runtime.confirmation?.receiptSha256, "agent action confirmation receipt hash mismatch");
      try { confirmation = JSON.parse(readFileSync(confirmationPath, "utf8")); } catch (error) { errors.push(`agent action confirmation receipt is not valid JSON (${error.message})`); }
    }
    if (confirmation) {
      const confirmationSchema = documents.get(files.agentConfirmationReceiptSchema);
      add(validateSchema(confirmationSchema, confirmation).length === 0, "agent action confirmation receipt violates its active schema");
      add(confirmation.releaseRef === releaseRef && confirmation.artifactId === runtime.scope?.artifactId && confirmation.actionId === runtime.actionId, "agent action confirmation subject drifts");
      add(confirmation.actorId === runtime.scope?.actor && confirmation.confirmedBy === runtime.confirmation?.confirmedBy && confirmation.confirmedAt === runtime.confirmation?.confirmedAt, "agent action confirmation identity or time drifts");
      add(confirmation.inputRef === runtime.inputs?.valueRef && confirmation.inputSha256 === runtime.inputs?.valueSha256, "agent action confirmation input binding drifts");
      add(sameValue(confirmation.consequence, runtime.sideEffect), "agent action confirmation consequence drifts from runtime");
    }
    errors.push(...detachedAttestationBindingErrors({ ref: runtime.confirmation?.attestationRef, sha256: runtime.confirmation?.attestationSha256 }, {
      label: "agent action confirmation",
      purpose: "agent_confirmation",
      subjectRef: runtime.confirmation?.receiptRef,
      subjectSha256: runtime.confirmation?.receiptSha256,
      checkedAt: runtime.confirmation?.confirmedAt,
      requiredStoreScope: "operator_external"
    }, artifactRoot, trustStores));
  }
  let terminalReceipt = null;
  if (["succeeded", "failed", "cancelled"].includes(runtime.execution?.status)) {
    const receiptAttestationIssuedAt = boundAttestationIssuedAt({ ref: runtime.execution?.receiptAttestationRef }, artifactRoot);
    const receiptPath = bundleFilePath(artifactRoot, runtime.execution?.receiptRef);
    add(Boolean(receiptPath) && sha256File(receiptPath) === runtime.execution?.receiptSha256, "completed agent action lacks a valid hash-bound receipt");
    if (receiptPath) {
      let receipt = null;
      try { receipt = JSON.parse(readFileSync(receiptPath, "utf8")); } catch { receipt = null; }
      terminalReceipt = receipt;
      add(Boolean(receipt) && validateSchema(agentActionReceiptSchema, receipt).length === 0, "agent action receipt violates its active schema");
      if (receipt) {
        add(receipt.releaseRef === releaseRef && receipt.artifactId === runtime.scope?.artifactId && receipt.actionId === runtime.actionId && receipt.actor === runtime.scope?.actor, "agent action receipt subject drifts");
        add(receipt.authorityRef === runtime.permission?.authorityRef && receipt.authoritySha256 === runtime.permission?.authoritySha256, "agent action receipt authority binding drifts");
        add(receipt.inputRef === runtime.inputs?.valueRef && receipt.inputSha256 === runtime.inputs?.valueSha256, "agent action receipt input binding drifts");
        errors.push(...agentReceiptRuntimeErrors(receipt, runtime));
        if (["failed", "cancelled"].includes(receipt.status)) add(isNonEmpty(receipt.audienceMessage), "agent action failure or cancellation lacks an audience message");
        const audienceReceipt = { errorCode: receipt.errorCode, audienceMessage: receipt.audienceMessage };
        const residue = workflowResidueHits(audienceReceipt, "$/agentReceipt");
        add(residue.length === 0, `agent action audience receipt contains workflow residue at ${residue.join(", ")}`);
        add(["internal_preview", "internal_operational"].includes(receipt.allowedAudience), "full agent action receipt is exposed outside internal audiences");
      }
    }
    errors.push(...detachedAttestationBindingErrors({
      ref: runtime.execution?.receiptAttestationRef,
      sha256: runtime.execution?.receiptAttestationSha256
    }, {
      label: "agent action terminal execution",
      purpose: "agent_execution",
      subjectRef: runtime.execution?.receiptRef,
      subjectSha256: runtime.execution?.receiptSha256,
      operationAt: runtime.execution?.completedAt,
      maximumIssueDelayMs: 300000,
      requiredStoreScope: "operator_external"
    }, artifactRoot, trustStores));
    errors.push(...agentTerminalAttestationOrderErrors(terminalRevocationAttestationIssuedAt, receiptAttestationIssuedAt));
    errors.push(...agentTerminalEvidenceErrors(runtime, terminalReceipt, artifactRoot));
  }
  return errors;
}

function packageRefResolves(ref) {
  if (!isNonEmpty(ref)) return false;
  const refFile = ref.split("#")[0];
  return declaredNames.includes(refFile) && existsSync(join(packageDir, refFile));
}

function resolveBoundAsset(card, asset, artifactRoot) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const parts = String(asset.source ?? "").split("#");
  const registryRef = parts[0];
  const fragment = parts.length === 2 ? parts[1] : null;
  add(parts.length === 2 && fragment === asset.id, `asset ${asset.id ?? "unknown"} source must be registryRef#assetId`);
  const binding = (card.assetRegistries ?? []).find((entry) => entry.registryRef === registryRef);
  add(Boolean(binding), `asset ${asset.id ?? "unknown"} registry is absent from assetRegistries`);
  const registryPath = bundleFilePath(artifactRoot, registryRef);
  add(Boolean(registryPath), `asset ${asset.id ?? "unknown"} registry does not resolve inside the artifact bundle`);
  if (!binding || !registryPath) return { errors, registered: null, binding: binding ?? null, registry: null };
  add(sha256File(registryPath) === binding.sha256, `asset ${asset.id ?? "unknown"} registry hash mismatch`);
  add(binding.schemaRef === release.schemaIds?.assetRegistry, `asset ${asset.id ?? "unknown"} registry schemaRef is not the active asset-registry schema`);
  let registry;
  try {
    registry = JSON.parse(readFileSync(registryPath, "utf8"));
  } catch (error) {
    errors.push(`asset ${asset.id ?? "unknown"} registry is not valid JSON (${error.message})`);
    return { errors, registered: null, binding, registry: null };
  }
  const schemaErrors = validateSchema(assetRegistrySchema, registry);
  add(schemaErrors.length === 0, `asset ${asset.id ?? "unknown"} registry does not satisfy the active asset-registry schema`);
  const records = [...(registry.identity ?? []), ...(registry.fonts ?? []), ...(registry.iconSubsets ?? []), ...(registry.media ?? [])];
  add(unique(records.map((entry) => entry.id)), `asset ${asset.id ?? "unknown"} registry contains duplicate asset IDs`);
  for (const record of records) {
    const recordPath = bundleFilePath(artifactRoot, record.packageFile);
    add(Boolean(recordPath), `bound registry record ${record.id ?? "unknown"} bytes do not resolve inside the artifact bundle`);
    if (recordPath) {
      add(sha256File(recordPath) === record.sha256, `bound registry record ${record.id ?? "unknown"} hash does not match bytes`);
      add(statSync(recordPath).size === record.bytes, `bound registry record ${record.id ?? "unknown"} byte count does not match bytes`);
    }
  }
  for (const license of registry.licenseFiles ?? []) {
    const licensePath = bundleFilePath(artifactRoot, license.packageFile);
    add(Boolean(licensePath), `bound registry license ${license.id ?? "unknown"} bytes do not resolve inside the artifact bundle`);
    if (licensePath) {
      add(sha256File(licensePath) === license.sha256, `bound registry license ${license.id ?? "unknown"} hash does not match bytes`);
      add(statSync(licensePath).size === license.bytes, `bound registry license ${license.id ?? "unknown"} byte count does not match bytes`);
    }
  }
  const registered = records.find((entry) => entry.id === asset.id);
  add(Boolean(registered), `asset ${asset.id ?? "unknown"} is absent from its bound registry`);
  if (asset.approvalStatus === "approved") {
    const receiptRef = String(asset.approvalReceiptRef ?? "").split("#")[0];
    const receiptPath = bundleFilePath(artifactRoot, receiptRef);
    add(Boolean(receiptPath), `approved asset ${asset.id ?? "unknown"} approval receipt does not resolve inside the artifact bundle`);
    if (receiptPath) add(sha256File(receiptPath) === asset.approvalReceiptSha256, `approved asset ${asset.id ?? "unknown"} approval receipt hash mismatch`);
  }
  return { errors, registered, binding, registry };
}

function assetApprovalReceiptErrors(registry, receipt, receiptRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const schemaErrors = validateSchema(assetApprovalReceiptSchema, receipt);
  add(schemaErrors.length === 0, "asset approval receipt does not satisfy its active schema");
  add(receipt.releaseRef === releaseRef && receipt.status === "approved", "asset approval receipt release or status drifts");
  const approved = [...(registry.fonts ?? []), ...(registry.iconSubsets ?? []), ...(registry.identity ?? []), ...(registry.media ?? [])]
    .filter((entry) => entry.approvalStatus === "approved");
  add(unique((receipt.assets ?? []).map((entry) => entry.assetId)), "asset approval receipt contains duplicate asset IDs");
  add(sameValue(approved.map((entry) => entry.id).sort(), (receipt.assets ?? []).map((entry) => entry.assetId).sort()), "asset approval receipt must cover approved registry assets exactly");
  const receiptHash = sha256File(join(receiptRoot, files.assetApprovalReceipt));
  for (const record of approved) {
    const grant = (receipt.assets ?? []).find((entry) => entry.assetId === record.id);
    add(Boolean(grant), `approved registry asset ${record.id} lacks a receipt grant`);
    if (!grant) continue;
    const role = (registry.fonts ?? []).includes(record) ? "text_font"
      : (registry.iconSubsets ?? []).includes(record) ? "interface_icon"
        : record.role === "horizontal_lockup" || record.role === "vertical_lockup" || record.role === "symbol" ? "identity" : record.role;
    const fallback = role === "text_font"
      ? record.role === "display_latin" ? registry.fallbacks?.displayLatin
        : record.role === "display_thai" ? registry.fallbacks?.displayThai
          : ["body_ui", "body_ui_emphasis"].includes(record.role) ? registry.fallbacks?.body : registry.fallbacks?.technical
      : role === "interface_icon" ? registry.fallbacks?.interfaceIcon : record.fallback;
    add(grant.role === role, `asset grant ${record.id} role drifts from registry`);
    add(grant.sha256 === record.sha256, `asset grant ${record.id} hash drifts from registry`);
    add(grant.licenseOrPermission === (record.license ?? record.rights?.conditions), `asset grant ${record.id} license or permission drifts from registry`);
    add(grant.fallback === fallback, `asset grant ${record.id} fallback drifts from registry`);
    if (role === "interface_icon") add(sameValue([...(grant.glyphs ?? [])].sort(), [...(record.glyphs ?? [])].sort()), `asset grant ${record.id} glyph set drifts from registry`);
    if (!["text_font", "interface_icon"].includes(role)) add(grant.altOrTextEquivalent === record.altOrTextEquivalent, `asset grant ${record.id} text equivalent drifts from registry`);
    add(grant.publicationPermission === true && (grant.allowedAudiences ?? []).includes("public"), `approved asset grant ${record.id} does not authorize its declared public delivery`);
    add(grant.allowedFormatProfiles.every((profile) => allowedProfiles.includes(profile)), `asset grant ${record.id} contains an unknown format profile`);
    add(unique(grant.allowedFormatProfiles) && unique(grant.allowedSurfaceRoles) && unique(grant.allowedAudiences), `asset grant ${record.id} contains duplicate authorization values`);
    add(record.approvedBy === receipt.approvedBy && record.approvedAt === receipt.approvedAt, `asset ${record.id} approval identity/time drifts from receipt`);
    add(record.approvalReceiptRef === files.assetApprovalReceipt && record.approvalReceiptSha256 === receiptHash, `asset ${record.id} receipt binding drifts from approval receipt bytes`);
  }
  return errors;
}

function resolveBoundClaimManifest(card, artifactRoot, manifestOverride = null) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const manifestRef = card.publication?.claimManifestRef;
  const manifestPath = bundleFilePath(artifactRoot, manifestRef);
  add(Boolean(manifestPath), "claim manifest does not resolve inside the artifact bundle");
  if (!manifestPath) return { errors, manifest: null, recordsById: new Map() };
  add(sha256File(manifestPath) === card.publication?.claimManifestSha256, "claim manifest hash mismatch");
  let manifest = manifestOverride;
  if (!manifest) {
    try {
      manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    } catch (error) {
      errors.push(`claim manifest is not valid JSON (${error.message})`);
      return { errors, manifest: null, recordsById: new Map() };
    }
  }
  const manifestSchemaErrors = validateSchema(claimManifestSchema, manifest);
  add(manifestSchemaErrors.length === 0, "claim manifest does not satisfy the active claim-manifest schema");
  const recordsById = new Map();
  for (const entry of manifest.records ?? []) {
    const recordPath = bundleFilePath(artifactRoot, entry.recordRef);
    add(Boolean(recordPath), `claim ${entry.claimId ?? "unknown"} record does not resolve inside the artifact bundle`);
    if (!recordPath) continue;
    add(sha256File(recordPath) === entry.sha256, `claim ${entry.claimId ?? "unknown"} record hash mismatch`);
    let record;
    try {
      record = JSON.parse(readFileSync(recordPath, "utf8"));
    } catch (error) {
      errors.push(`claim ${entry.claimId ?? "unknown"} record is not valid JSON (${error.message})`);
      continue;
    }
    const recordSchemaErrors = validateSchema(claimRecordSchema, record);
    add(recordSchemaErrors.length === 0, `claim ${entry.claimId ?? "unknown"} record does not satisfy the active claim-record schema`);
    add(record.claimId === entry.claimId && record.status === entry.status && record.publicProjectionEligible === entry.publicProjectionEligible, `claim ${entry.claimId ?? "unknown"} manifest metadata drifts from its record`);
    errors.push(...detachedAttestationBindingErrors({ ref: entry.approvalAttestationRef, sha256: entry.approvalAttestationSha256 }, {
      label: `claim ${entry.claimId ?? "unknown"} approval`,
      purpose: "claim_approval",
      subjectRef: entry.recordRef,
      subjectSha256: entry.sha256,
      requiredStoreScope: "package_release"
    }, artifactRoot, packageReleaseTrustStores));
    const capturePath = bundleFilePath(artifactRoot, entry.evidenceCaptureRef);
    add(Boolean(capturePath), `claim ${entry.claimId ?? "unknown"} evidence capture does not resolve inside the artifact bundle`);
    let capture = null;
    if (capturePath) {
      add(sha256File(capturePath) === entry.evidenceCaptureSha256, `claim ${entry.claimId ?? "unknown"} evidence capture hash mismatch`);
      try { capture = JSON.parse(readFileSync(capturePath, "utf8")); } catch (error) { errors.push(`claim ${entry.claimId ?? "unknown"} evidence capture is not valid JSON (${error.message})`); }
    }
    if (capture) {
      add(validateSchema(claimEvidenceCaptureSchema, capture).length === 0, `claim ${entry.claimId ?? "unknown"} evidence capture does not satisfy its active schema`);
      add(capture.claimId === entry.claimId, `claim ${entry.claimId ?? "unknown"} evidence capture claimId drifts`);
      const capturedContentPath = bundleFilePath(artifactRoot, capture.contentRef);
      add(Boolean(capturedContentPath) && sha256File(capturedContentPath) === capture.contentSha256, `claim ${entry.claimId ?? "unknown"} evidence capture content bytes drift`);
    }
    errors.push(...detachedAttestationBindingErrors({ ref: entry.evidenceAttestationRef, sha256: entry.evidenceAttestationSha256 }, {
      label: `claim ${entry.claimId ?? "unknown"} evidence capture`,
      purpose: "claim_evidence_capture",
      subjectRef: entry.evidenceCaptureRef,
      subjectSha256: entry.evidenceCaptureSha256,
      requiredStoreScope: "package_release"
    }, artifactRoot, packageReleaseTrustStores));
    recordsById.set(entry.claimId, { entry, record });
  }
  add(unique((manifest.records ?? []).map((entry) => entry.claimId)), "claim manifest contains duplicate claim IDs");
  return { errors, manifest, recordsById };
}

function typedActionContractErrors(card, action, field, kind, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const binding = action?.[field];
  add(isObject(binding), `${action?.id ?? "action"} ${field} is not a typed hash-bound contract`);
  if (!isObject(binding)) return errors;
  const expectedSchemaRef = `${release.schemaIds?.actionContracts}#/$defs/${kind}`;
  const normativeSchemaSha256 = sha256File(join(packageDir, files.actionContractsSchema));
  add(binding.schemaRef === expectedSchemaRef, `${action.id} ${field} schemaRef is not the governed ${kind} contract`);
  add(binding.schemaSha256 === normativeSchemaSha256, `${action.id} ${field} schema hash does not match governed action-contract bytes`);
  const [filename, fragment] = String(binding.ref ?? "").split("#", 2);
  const valuePath = bundleFilePath(artifactRoot, filename);
  add(Boolean(valuePath), `${action.id} ${field} does not resolve inside the bundle`);
  if (!valuePath) return errors;
  add(sha256File(valuePath) === binding.sha256, `${action.id} ${field} value hash mismatch`);
  let document = null;
  try { document = JSON.parse(readFileSync(valuePath, "utf8")); } catch { document = null; }
  add(Boolean(document), `${action.id} ${field} is not valid JSON`);
  if (!document) return errors;
  const value = resolveJsonPointerFragment(document, fragment);
  add(Boolean(value), `${action.id} ${field} fragment does not resolve`);
  if (!value) return errors;
  const schema = pointer(actionContractsSchema, `#/$defs/${kind}`);
  const schemaErrors = validateSchema(schema, value, actionContractsSchema);
  add(schemaErrors.length === 0, `${action.id} ${field} violates the governed ${kind} contract${schemaErrors.length ? `: ${schemaErrors.join("; ")}` : ""}`);
  add(value.kind === kind, `${action.id} ${field} kind drifts`);
  for (const key of ["messageByLocale", "fallbackByLocale", "denialRecoveryByLocale", "accessibleStatusByLocale"]) {
    if (value[key]) add(exactLocaleMap(value[key], card.locale?.available ?? []), `${action.id} ${field} ${key} must cover delivered locales exactly`);
  }
  if (kind === "permission") add(value.artifactId === card.artifact?.id && value.actionId === action.id, `${action.id} permission contract subject drifts from Build Card`);
  return errors;
}

function typedReceiptSchemaBindingErrors(action, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const binding = action?.receiptSchemaBinding;
  add(isObject(binding), `${action?.id ?? "action"} receiptSchemaBinding is not a typed hash-bound schema`);
  if (!isObject(binding)) return errors;
  add(binding.schemaId === release.schemaIds?.agentActionReceipt, `${action.id} receipt schema ID is not the active agent-action receipt schema`);
  const schemaPath = bundleFilePath(artifactRoot, binding.ref);
  add(Boolean(schemaPath), `${action.id} receipt schema does not resolve inside the bundle`);
  if (!schemaPath) return errors;
  add(sha256File(schemaPath) === binding.sha256, `${action.id} receipt schema hash mismatch`);
  add(binding.sha256 === sha256File(join(packageDir, files.agentActionReceiptSchema)), `${action.id} receipt schema bytes differ from the active package schema`);
  let schema = null;
  try { schema = JSON.parse(readFileSync(schemaPath, "utf8")); } catch { schema = null; }
  add(Boolean(schema) && schema.$id === binding.schemaId, `${action.id} receipt schema $id drifts from its binding`);
  return errors;
}

function identityImplementationErrors(card, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const implementation = card.identityImplementation;
  const brandRequired = card.navigation?.controlBudgets?.desktop?.brandRequired === true || card.navigation?.controlBudgets?.mobile?.brandRequired === true;
  add(!brandRequired || isObject(implementation), "brandRequired output lacks an identity implementation");
  if (!isObject(implementation)) return errors;
  if (implementation.kind === "asset_identity") {
    const identityAsset = (card.assets ?? []).find((asset) => asset.id === implementation.assetId && asset.role === "identity");
    add(implementation.id === implementation.assetId, "asset identity implementation ID must equal its assetId");
    add(Boolean(identityAsset) && identityAsset.approvalStatus === "approved", `identity implementation ${implementation.id ?? "unknown"} does not bind an approved identity asset`);
    add(identityAsset?.surface === implementation.surface, `identity implementation ${implementation.id ?? "unknown"} surface drifts from its approved identity asset`);
    return errors;
  }
  add(implementation.kind === "governed_text_identity", `identity implementation ${implementation.id ?? "unknown"} has an unknown kind`);
  const registryBinding = (card.assetRegistries ?? []).find((entry) => entry.registryRef === implementation.registryRef);
  add(Boolean(registryBinding), `text identity ${implementation.id ?? "unknown"} registryRef is not bound by assetRegistries`);
  if (!registryBinding) return errors;
  const resolution = boundJson(
    { ref: registryBinding.registryRef, sha256: registryBinding.sha256, schemaRef: registryBinding.schemaRef },
    artifactRoot,
    `text identity ${implementation.id ?? "unknown"} registry`,
    release.schemaIds?.assetRegistry,
    assetRegistrySchema
  );
  errors.push(...resolution.errors);
  const record = (resolution.document?.textIdentityImplementations ?? []).find((entry) => entry.id === implementation.id);
  add(Boolean(record), `text identity ${implementation.id ?? "unknown"} does not resolve to the governed text-identity registry`);
  if (!record) return errors;
  add(record.approvalStatus === "approved", `text identity ${implementation.id} is not approved`);
  add(record.canonicalText === implementation.text, `text identity ${implementation.id} text drifts from the approved canonical text`);
  add(exactLocaleMap(implementation.textByLocale, card.locale?.available ?? []), `text identity ${implementation.id} textByLocale must cover delivered locales exactly`);
  add(Object.values(implementation.textByLocale ?? {}).every((value) => value === record.canonicalText), `text identity ${implementation.id} must preserve the canonical text in every locale`);
  add((record.allowedFormatProfiles ?? []).includes(card.output?.formatProfile), `text identity ${implementation.id} is not approved for ${card.output?.formatProfile}`);
  add((record.allowedSurfaces ?? []).includes(implementation.surface), `text identity ${implementation.id} is not approved for surface ${implementation.surface ?? "unknown"}`);
  add((record.allowedAudiences ?? []).includes(card.audienceOutput?.deliveryAudience), `text identity ${implementation.id} is not approved for audience ${card.audienceOutput?.deliveryAudience ?? "unknown"}`);
  if (card.audienceOutput?.deliveryAudience === "public") add(record.publicationPermission === true, `text identity ${implementation.id} lacks publication permission`);
  const boundFonts = new Map((card.assets ?? []).filter((asset) => asset.role === "text_font" && asset.approvalStatus === "approved").map((asset) => [asset.id, asset]));
  const typographyBinding = (record.typographyBindings ?? []).find((entry) => entry.id === implementation.typographyBindingId);
  const expectedFontAssetIds = typographyBinding?.fontAssetIds ?? [];
  add(Boolean(typographyBinding) && typographyBinding.surface === implementation.surface && typographyBinding.formatProfile === card.output?.formatProfile, `text identity ${implementation.id} typography binding does not authorize the selected surface and format`);
  add(sameValue(implementation.fontAssetIds ?? [], expectedFontAssetIds), `text identity ${implementation.id} fontAssetIds drift from its governed typography binding`);
  add(expectedFontAssetIds.every((id) => boundFonts.has(id)), `text identity ${implementation.id} must use only approved bound text fonts`);
  add(implementation.logoAssetId === null && implementation.logoReconstructionAllowed === false && record.logoAssetId === null && record.logoReconstructionAllowed === false, `text identity ${implementation.id} must not claim or reconstruct a logo asset`);
  return errors;
}

function destinationTargetMatches(kind, target) {
  if (!isNonEmpty(target)) return false;
  if (kind === "anchor") return /^#[a-z][a-z0-9-]*$/.test(target);
  if (kind === "route") return /^(?:\/|\.\/)(?!.*(?:^|\/)\.\.(?:\/|$))\S+$/.test(target);
  if (kind === "external") return /^https:\/\/[^\s]+$/.test(target);
  if (kind === "download") return /^https:\/\/[^\s]+$/.test(target) || /^(?:\/|\.\/)(?!.*(?:^|\/)\.\.(?:\/|$))\S+$/.test(target);
  if (kind === "form") return /^https:\/\/[^\s]+$/.test(target) || /^#[a-z][a-z0-9-]*$/.test(target) || /^(?:\/|\.\/)(?!.*(?:^|\/)\.\.(?:\/|$))\S+$/.test(target);
  if (kind === "contact") return /^(?:mailto:[^\s@]+@[^\s@]+|tel:\+?[0-9(). -]{6,})$/.test(target);
  if (kind === "command") return /^[a-z][a-z0-9.-]*$/.test(target);
  return false;
}

function actionDestinationErrors(card) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const profile = card.output?.formatProfile;
  const profileContract = formatPacks?.ctaDestinationContract?.profiles?.[profile];
  add(Boolean(profileContract), `CTA destination contract does not resolve format profile ${profile ?? "unknown"}`);
  const sectionIds = new Set((card.composition?.sections ?? []).map((section) => section.id));
  for (const action of card.actions ?? []) {
    const binding = action.destinationBinding;
    add(isObject(binding), `${action.id ?? "unknown"} lacks a typed destination binding`);
    if (!isObject(binding)) continue;
    add((profileContract?.kinds ?? []).includes(binding.kind), `${action.id} destination kind ${binding.kind ?? "unknown"} is incompatible with ${profile}`);
    add(binding.presentation?.mode === profileContract?.mode, `${action.id} destination presentation mode is incompatible with ${profile}`);
    add((profileContract?.techniques ?? []).includes(binding.presentation?.technique), `${action.id} destination presentation technique is incompatible with ${profile}`);
    if (profileContract?.mode === "static_equivalent") add(binding.presentation?.technique !== "direct_control", `${action.id} static format cannot simulate a direct control`);
    if (binding.kind === "command" && profileContract?.mode === "static_equivalent") add(binding.presentation?.technique === formatPacks?.ctaDestinationContract?.commandStaticTechnique, `${action.id} static command destination must be an explicit instruction`);
    add(destinationTargetMatches(binding.kind, binding.target), `${action.id} destination target does not match kind ${binding.kind ?? "unknown"}`);
    add(exactLocaleMap(binding.targetByLocale, card.locale?.available ?? []), `${action.id} destination targetByLocale must cover delivered locales exactly`);
    add(binding.target === binding.targetByLocale?.[card.locale?.primary], `${action.id} destination target must equal its primary-locale value`);
    for (const [locale, target] of Object.entries(binding.targetByLocale ?? {})) add(destinationTargetMatches(binding.kind, target), `${action.id} destination target for ${locale} does not match kind ${binding.kind ?? "unknown"}`);
    if (binding.kind === "anchor" || (binding.kind === "form" && String(binding.target).startsWith("#"))) add(sectionIds.has(String(binding.target).slice(1)), `${action.id} destination anchor ${binding.target} does not resolve to a composed section`);
  }
  return errors;
}

function actionIntentContractErrors(action) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const effect = action?.consequence ?? {};
  const consequential = effect.class !== "none" || effect.external === true || effect.cost !== "none";
  if (action?.intent === "destructive") {
    add(effect.class === "destructive" && effect.reversible === false, `${action.id} destructive intent must declare a destructive non-reversible consequence`);
    add(action.confirmation === "step_up", `${action.id} destructive intent requires step-up confirmation`);
    add(action.availability === "requires_permission", `${action.id} destructive intent requires a typed permission decision`);
  }
  if (effect.class === "destructive") add(action.intent === "destructive", `${action.id} destructive consequence requires destructive intent`);
  if (action?.intent === "external_handoff") add(effect.external === true, `${action.id} external_handoff intent must declare external consequence`);
  if (["submit", "create", "save", "share", "confirm", "external_handoff", "destructive"].includes(action?.intent)) add(consequential, `${action.id} ${action.intent} intent must declare a consequential effect`);
  return errors;
}

function staticNavigationProjectionGroups(destination) {
  const groups = formatPacks?.navigationContract?.staticProjectionContract?.groups ?? {};
  const matches = [];
  for (const [groupId, groupContract] of Object.entries(groups)) {
    const selected = (groupContract.selectors ?? []).some((selector) =>
      destination?.kind === selector.kind
      && (selector.levels ?? []).includes(destination?.level)
      && (!Array.isArray(selector.groups) || selector.groups.includes(destination?.group))
    );
    if (selected) matches.push(groupId);
  }
  return matches;
}

function navigationContractErrors(card) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const destinations = card.navigation?.destinations ?? [];
  const currentPages = destinations.filter((destination) => destination.current === "page");
  const currentLocations = destinations.filter((destination) => destination.current === "location");
  const interactiveProfiles = formatPacks?.navigationContract?.currentCardinality?.interactiveFormatProfiles ?? ["web_public", "app_interactive"];
  const staticProfiles = formatPacks?.navigationContract?.currentCardinality?.staticFormatProfiles ?? ["document_flow", "pdf_fixed", "deck_presentation", "social_static"];
  const interactive = interactiveProfiles.includes(card.output?.formatProfile);
  const staticOutput = staticProfiles.includes(card.output?.formatProfile);
  const mode = card.navigation?.mode;
  const variantContract = formatPacks?.navigationContract?.variants?.[conformanceVariantKey(card)];
  add(Boolean(variantContract), `navigation has no governed conformance variant for ${conformanceVariantKey(card) ?? "unknown"}`);
  if (variantContract) add((variantContract.allowedModes ?? []).includes(mode), `navigation mode ${mode ?? "unknown"} is incompatible with ${conformanceVariantKey(card)}`);
  add(unique(destinations.map((destination) => destination.id)), "navigation destination IDs must be unique");
  add(destinations.every((destination) => ["none", "page", "location"].includes(destination.current)), "navigation current must use none, page, or location semantics");
  for (const destination of destinations) {
    if (destination.current === "page") add(destination.kind === "route", `navigation current page ${destination.target ?? "unknown"} must be a route destination`);
    if (destination.current === "location") add(destination.kind === "anchor" && destination.level === "page" && destination.group === "page_local", `navigation current location ${destination.target ?? "unknown"} must be a page-local anchor`);
    if (destination.kind === "external") add(destination.current === "none", `external navigation destination ${destination.target ?? "unknown"} cannot be current`);
  }
  if (mode === "none") add(destinations.length === 0 && currentPages.length === 0 && currentLocations.length === 0, "navigation mode none must not declare destinations or current state");
  else if (interactive) {
    add(currentPages.length === 1, "interactive navigation must identify exactly one current page route");
    add(currentLocations.length <= 1, "interactive navigation may identify at most one current in-page location");
  } else if (staticOutput) {
    add(currentPages.length === 0 && currentLocations.length === 0 && destinations.every((destination) => destination.current === "none"), "static navigation must use current none and must not invent page or location state");
  }
  const sectionIds = new Set((card.composition?.sections ?? []).map((section) => section.id));
  const anchorDestinations = destinations.filter((destination) => destination.kind === "anchor");
  for (const destination of anchorDestinations) {
    const sectionId = String(destination.target ?? "").replace(/^#/, "");
    add(sectionIds.has(sectionId), `navigation anchor ${destination.target ?? "unknown"} does not resolve to a composed section`);
    add(destination.level === "page" && destination.group === "page_local", `navigation anchor ${destination.target ?? "unknown"} must remain page-local`);
  }
  const staticProjection = formatPacks?.navigationContract?.staticProjectionContract;
  const staticProjectionVariants = staticProjection?.applicableConformanceVariants ?? [];
  const staticProjectionApplies = staticProjectionVariants.includes(conformanceVariantKey(card));
  if (staticProjectionApplies) {
    const globalContract = staticProjection.groups?.global_related_destinations ?? {};
    const pageIndexContract = staticProjection.groups?.page_index ?? {};
    const expectedPageExposure = pageIndexContract.requiredStaticExposureByFormatProfile?.[card.output?.formatProfile];
    add(unique(destinations.map((destination) => destination.target)), "static navigation destination targets must be unique across projection groups");
    for (const destination of destinations) {
      const projectionGroups = staticNavigationProjectionGroups(destination);
      add(projectionGroups.length === 1, `static navigation destination ${destination.id ?? destination.target ?? "unknown"} must resolve to exactly one global-related or page-index group`);
      add(!Object.hasOwn(destination, "breakpointExposure"), `static navigation destination ${destination.id ?? destination.target ?? "unknown"} leaks browser breakpointExposure`);
      if (projectionGroups[0] === "global_related_destinations") {
        add(destination.staticExposure === globalContract.requiredStaticExposure, `static global destination ${destination.id ?? destination.target ?? "unknown"} must use staticExposure ${globalContract.requiredStaticExposure ?? "destination_cue"}`);
      }
      if (projectionGroups[0] === "page_index") {
        add(destination.staticExposure === expectedPageExposure, `static page-index destination ${destination.id ?? destination.target ?? "unknown"} must use staticExposure ${expectedPageExposure ?? "unknown"}`);
      }
    }
  }
  const sideBookmark = card.navigation?.sideBookmark ?? "not_applicable";
  const compatible = formatPacks?.navigationContract?.sideBookmarkCompatibleFormatProfiles ?? [];
  if (sideBookmark === "selected") {
    add(compatible.includes(card.output?.formatProfile), `side bookmark is incompatible with format profile ${card.output?.formatProfile ?? "unknown"}`);
    add(anchorDestinations.length >= 2, "side bookmark requires at least two page-anchor destinations");
    if (interactive) {
      add(currentLocations.length === 1, "interactive side bookmark requires exactly one current page-local location");
      const expectedInteractiveExposure = variantContract?.sideBookmarkExposure;
      add(anchorDestinations.every((destination) => sameValue(destination.breakpointExposure, expectedInteractiveExposure) && !Object.hasOwn(destination, "staticExposure")), "interactive side bookmark anchors require exact desktop side_bookmark and mobile disclosure exposure without static leakage");
    }
    if (staticOutput) {
      add(currentLocations.length === 0, "static side bookmark must not invent a current page-local location");
      const expectedStaticExposure = variantContract?.sideBookmarkExposure;
      add(isNonEmpty(expectedStaticExposure) && anchorDestinations.every((destination) => destination.staticExposure === expectedStaticExposure && !Object.hasOwn(destination, "breakpointExposure")), `static side bookmark anchors for ${card.output?.formatProfile ?? "unknown"} require exact ${expectedStaticExposure ?? "governed"} exposure without browser leakage`);
    }
  }
  if (card.navigation?.mode === "site") add(destinations.some((destination) => destination.kind === "route" && ["ecosystem", "property"].includes(destination.level)), "site navigation requires an ecosystem or property route, not page anchors alone");
  if (["web_public", "app_interactive"].includes(card.output?.formatProfile) && ["site", "product"].includes(card.navigation?.mode)) {
    const desktopHeader = destinations.filter((destination) => destination.breakpointExposure?.desktop === "header").length;
    const mobileHeader = destinations.filter((destination) => destination.breakpointExposure?.mobile === "header").length;
    const variant = conformanceVariantKey(card);
    const expectedBudget = formatPacks?.navigationContract?.controlBudgetsByConformanceVariant?.[variant];
    const target = targetById.get(card.output?.targetProfileRef);
    add(Boolean(expectedBudget), `navigation has no governed control-budget branch for ${variant ?? "unknown variant"}`);
    if (expectedBudget) {
      add(desktopHeader <= expectedBudget.desktop.maxControls && mobileHeader <= expectedBudget.mobile.maxControls, "navigation control budgets exceed the governed desktop/mobile limits");
      add(sameValue(card.navigation?.controlBudgets, expectedBudget), `navigation control budgets must exactly match the ${variant} value and unit contract`);
      add(target?.minimumDiscreteTarget === expectedBudget.minimumDirectTarget.value && target?.unit === expectedBudget.minimumDirectTarget.unit, `navigation minimum direct target must equal selected target profile ${card.output?.targetProfileRef ?? "unknown"} value and unit`);
    }
  }
  return errors;
}

function motionAssignmentErrors(card) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const assignments = card.experience?.motionAssignments ?? [];
  const ctaCueAssignments = card.experience?.ctaDiscoveryCueAssignments ?? [];
  const hasMotion = (card.capabilities ?? []).includes("motion");
  add(hasMotion ? card.experience?.motionDecision === "assigned" && assignments.length > 0 : card.experience?.motionDecision === "no_motion" && assignments.length === 0, "motion capability and artifact motion decision disagree");
  if (ctaCueAssignments.length > 0) {
    add(
      hasMotion
        && card.experience?.motionDecision === "assigned"
        && card.output?.interactive === true
        && card.output?.runtime === "browser"
        && ["web_public", "app_interactive"].includes(card.output?.formatProfile),
      "CTA discovery cue assignments are allowed only for an interactive browser-runtime web/app output with the motion capability and motionDecision assigned"
    );
    const actionById = new Map((card.actions ?? []).map((action) => [action.id, action]));
    for (const cue of ctaCueAssignments) {
      const action = actionById.get(cue.actionRef);
      add(cue.actionRef === card.experience?.primaryActionRef, `CTA discovery cue ${cue.actionRef ?? "unknown"} must resolve to primaryActionRef`);
      add(Boolean(action), `CTA discovery cue ${cue.actionRef ?? "unknown"} does not resolve to an action`);
      add(action?.priority === "primary", `CTA discovery cue ${cue.actionRef ?? "unknown"} must target a primary action`);
      add(["anchor", "route", "external"].includes(action?.destinationBinding?.kind), `CTA discovery cue ${cue.actionRef ?? "unknown"} must target a navigational destination`);
      add(action?.availability === "available", `CTA discovery cue ${cue.actionRef ?? "unknown"} cannot target an unavailable action`);
      add(action?.consequence?.class === "none" && action?.confirmation === "none", `CTA discovery cue ${cue.actionRef ?? "unknown"} cannot target a stateful or consequential action`);
    }
  }
  const subjects = new Set([
    ...(card.composition?.sections ?? []).map((section) => section.id),
    ...(card.actions ?? []).map((action) => action.id)
  ]);
  add(unique(assignments.map((assignment) => assignment.subject)), "motion assignment subjects must be unique");
  const deepLinkTargets = new Set((card.navigation?.destinations ?? []).filter((destination) => destination.kind === "anchor").map((destination) => String(destination.target).slice(1)));
  for (const assignment of assignments) {
    add(subjects.has(assignment.subject), `motion assignment subject ${assignment.subject ?? "unknown"} does not resolve to a section or action`);
    add((card.experience?.motionBenefit ?? []).includes(assignment.benefit), `motion assignment ${assignment.subject ?? "unknown"} benefit is absent from motionBenefit`);
    const commonFinalState = assignment.initialVisibility === "visible" && assignment.layoutGeometry === "stable" && assignment.staticFallback === "final_state";
    const runtimeClass = motionRuntimeClass(card);
    const lifecycleFinalState = runtimeClass === "browser_observer"
      ? assignment.reducedMotion === "final_state" && assignment.observerFailure === "final_state" && !Object.hasOwn(assignment, "nativeInterruption") && !Object.hasOwn(assignment, "presenterSkip")
      : runtimeClass === "native_state"
        ? assignment.reducedMotion === "final_state" && assignment.nativeInterruption === "final_state" && !Object.hasOwn(assignment, "observerFailure") && !Object.hasOwn(assignment, "presenterSkip")
        : runtimeClass === "presenter_sequence"
          ? assignment.presenterSkip === "final_state" && !Object.hasOwn(assignment, "reducedMotion") && !Object.hasOwn(assignment, "observerFailure") && !Object.hasOwn(assignment, "nativeInterruption")
          : false;
    add(commonFinalState && lifecycleFinalState, `motion assignment ${assignment.subject ?? "unknown"} must preserve the complete final state through the ${runtimeClass ?? "unsupported"} lifecycle without leaking fields from another runtime`);
    if (deepLinkTargets.has(assignment.subject)) add(assignment.protectedRole === "deep_link_target", `motion assignment ${assignment.subject} must identify its deep-link protected role`);
    if (assignment.subject === card.experience?.primaryActionRef) add(assignment.protectedRole === "primary_action", `motion assignment ${assignment.subject} must identify its primary-action protected role`);
  }
  return errors;
}

function buildCrossErrors(card, claimManifestDocument = null, artifactRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  errors.push(...localeContractErrors(card));
  errors.push(...identityImplementationErrors(card, artifactRoot));
  errors.push(...actionDestinationErrors(card));
  errors.push(...capabilityConfigErrors(card, artifactRoot));
  errors.push(...discoveryErrors(card, artifactRoot));
  errors.push(...navigationContractErrors(card));
  errors.push(...motionAssignmentErrors(card));
  const actionIds = (card.actions ?? []).map((action) => action.id);
  const sectionIds = (card.composition?.sections ?? []).map((section) => section.id);
  add(unique(actionIds), "action IDs are not unique");
  add(unique(sectionIds), "section IDs are not unique");
  const actionById = new Map((card.actions ?? []).map((action) => [action.id, action]));
  add(actionById.has(card.experience?.primaryActionRef), "primaryActionRef is dangling");
  add(actionById.get(card.experience?.primaryActionRef)?.priority === "primary", "primaryActionRef does not point to the primary action");
  add(actionById.has(card.experience?.nextUsefulActionRef), "nextUsefulActionRef is dangling");
  const secondaryProfiles = card.experience?.secondaryProfiles ?? [];
  add(!secondaryProfiles.includes(card.experience?.profile), "primary experience profile cannot be repeated as a secondary profile");
  add(secondaryProfiles.every((profile) => experienceProfileEnum.includes(profile)), "secondary experience profile is unknown");
  add((card.locale?.available ?? []).includes(card.locale?.primary), "locale.primary is not in locale.available");
  if ((card.locale?.available ?? []).length > 1) {
    for (const action of card.actions ?? []) {
      for (const locale of card.locale.available) {
        add(isNonEmpty(action.labelByLocale?.[locale]), `${action.id} labelByLocale misses ${locale}`);
        add(isNonEmpty(action.outcomeByLocale?.[locale]), `${action.id} outcomeByLocale misses ${locale}`);
        add(isNonEmpty(action.destinationBinding?.targetByLocale?.[locale]), `${action.id} destination targetByLocale misses ${locale}`);
      }
    }
  }
  const target = targetById.get(card.output?.targetProfileRef);
  add(Boolean(target), "targetProfileRef is unknown");
  add(target?.formatProfile === card.output?.formatProfile, "targetProfileRef format mismatch");
  add(packByProfile.has(card.output?.formatProfile), "format pack is unknown");
  const bookmark = card.navigation?.sideBookmark ?? "not_applicable";
  const bookmarkComponentCount = (card.composition?.componentIds ?? []).filter((componentId) => componentId === "component.bookmark.side.01").length;
  add(
    bookmark === "selected" ? bookmarkComponentCount === 1 : bookmarkComponentCount === 0,
    "side-bookmark selection and component inventory disagree: selected requires exactly one component.bookmark.side.01 and omitted forbids it"
  );
  if (bookmark === "selected") {
    add(card.composition?.sideBookmarkEligible === true, "bookmark selected without eligibility");
    add((card.composition?.sections ?? []).length >= 2, "bookmark selected with fewer than two sections");
  }
  if (card.publication?.public === false) {
    add(card.publication?.indexing !== "index", "non-public artifact cannot be indexable");
    add(card.publication?.sitemapEligible !== true, "non-public artifact cannot be sitemap eligible");
  }
  if (card.publication?.indexing === "index") {
    add(card.publication?.public === true, "indexable artifact must be public");
    add(card.publication?.canonicalPolicy !== "not_applicable", "indexable artifact needs canonical policy");
  }
  const audienceOutput = card.audienceOutput ?? {};
  const blockerRefs = audienceOutput.blockingDependencyRefs ?? [];
  const deliveryAudience = audienceOutput.deliveryAudience;
  const disclosurePurpose = audienceOutput.disclosurePurpose;
  const resolvedDelivery = ["internal_operational", "client", "public"].includes(deliveryAudience);
  const disclosureResolution = resolveDisclosureAuthority(card, artifactRoot);
  errors.push(...disclosureResolution.errors);
  add(audienceOutput.mode === "resolved_only", "audience output mode must be resolved_only");
  add(["internal_preview", "internal_operational", "client", "public"].includes(deliveryAudience), "delivery audience is invalid");
  add(["ordinary_experience", "design_system_reference", "provenance_record"].includes(disclosurePurpose), "disclosure purpose is invalid");
  add(audienceOutput.internalGovernanceVisibility === "hidden", "internal governance must be hidden from audience output");
  add(audienceOutput.unresolvedDependencyBehavior === "block_or_internal_preview", "unresolved dependency behavior must block or stay internal");
  add(audienceOutput.placeholderPolicy === "forbidden_in_resolved_delivery", "public placeholder policy drift");
  add(audienceOutput.materialLimitationPresentation === "proximate_plain_language", "material limitation presentation drift");
  if (disclosurePurpose === "ordinary_experience") {
    add(!Object.hasOwn(audienceOutput, "disclosureAuthorityRef") && !Object.hasOwn(audienceOutput, "disclosureAuthoritySha256"), "ordinary experience must not self-declare a disclosure authority exception");
  }
  add((deliveryAudience === "public") === (card.publication?.public === true), "deliveryAudience public and publication.public must agree");
  if (card.publication?.indexing === "index") add(deliveryAudience === "public", "indexable artifact must have public deliveryAudience");
  if (deliveryAudience !== "public") {
    add(card.publication?.public === false, `${deliveryAudience} artifact must remain non-public`);
    add(card.publication?.indexing !== "index" && card.publication?.sitemapEligible !== true, `${deliveryAudience} artifact cannot be indexed or enter a sitemap`);
  }
  if (resolvedDelivery) add(blockerRefs.length === 0, `${deliveryAudience} artifact has blocking dependency refs`);
  if (["client", "public"].includes(deliveryAudience)) add(card.privacySecurity?.dataClassification === "public", `${deliveryAudience} delivery cannot contain non-public data classification`);
  if (deliveryAudience === "internal_operational" && ["confidential", "restricted"].includes(card.privacySecurity?.dataClassification)) {
    add((card.privacySecurity?.permissionsRequired ?? []).length > 0, "confidential or restricted internal operation lacks explicit permissions");
    add(card.privacySecurity?.redactionPolicy === "required_before_delivery", "confidential or restricted internal operation must require redaction before delivery");
  }
  const registryRefs = (card.assetRegistries ?? []).map((entry) => entry.registryRef);
  const usedRegistryRefs = [...new Set([
    ...(card.assets ?? []).map((asset) => String(asset.source ?? "").split("#")[0]),
    ...(card.identityImplementation?.kind === "governed_text_identity" ? [card.identityImplementation.registryRef] : [])
  ])];
  add(unique(registryRefs), "asset registry refs are not unique");
  add(sameValue([...registryRefs].sort(), [...usedRegistryRefs].sort()), "assetRegistries must exactly cover the registries used by assets");
  for (const asset of card.assets ?? []) {
    const resolution = resolveBoundAsset(card, asset, artifactRoot);
    if (resolution.errors.length) errors.push(...resolution.errors);
    const registered = resolution.registered;
    add(asset.approvalStatus === registered?.approvalStatus, `asset ${asset.id ?? "unknown"} approval status drifts from registry`);
    add(asset.sha256 === registered?.sha256, `asset ${asset.id ?? "unknown"} hash drifts from registry`);
    const assetBlockerRef = `asset:${asset.id}`;
    if (asset.approvalStatus !== "approved") {
      add(deliveryAudience === "internal_preview", `unapproved asset ${asset.id ?? "unknown"} can exist only in internal_preview`);
      add(blockerRefs.includes(assetBlockerRef), `unapproved asset ${asset.id ?? "unknown"} is missing ${assetBlockerRef}`);
    } else {
      add(isNonEmpty(asset.approvedBy) && isNonEmpty(asset.approvedAt) && isNonEmpty(asset.approvalReceiptRef) && /^[a-f0-9]{64}$/.test(asset.approvalReceiptSha256 ?? "") && isNonEmpty(asset.sha256), `approved asset ${asset.id ?? "unknown"} lacks approval or hash evidence`);
      if (registered) {
        add(registered.approvalStatus === "approved", `approved asset ${asset.id ?? "unknown"} registry status is not approved`);
        add(asset.sha256 === registered.sha256 && asset.approvedBy === registered.approvedBy && asset.approvedAt === registered.approvedAt, `approved asset ${asset.id ?? "unknown"} approval or hash drifts from registry`);
        add(asset.approvalReceiptRef === registered.approvalReceiptRef && asset.approvalReceiptSha256 === registered.approvalReceiptSha256, `approved asset ${asset.id ?? "unknown"} receipt binding drifts from registry`);
      }
      const approvalPath = bundleFilePath(artifactRoot, String(asset.approvalReceiptRef ?? "").split("#")[0]);
      if (approvalPath) {
        let approval;
        try { approval = JSON.parse(readFileSync(approvalPath, "utf8")); } catch { approval = null; }
        add(Boolean(approval), `approved asset ${asset.id ?? "unknown"} receipt is not valid JSON`);
        if (approval) {
          add(validateSchema(assetApprovalReceiptSchema, approval).length === 0, `approved asset ${asset.id ?? "unknown"} receipt violates the approval schema`);
          const grants = (approval.assets ?? []).filter((entry) => entry.assetId === asset.id);
          add(grants.length === 1, `approved asset ${asset.id ?? "unknown"} must have exactly one receipt grant`);
          const grant = grants[0];
          if (grant) {
            add(grant.role === asset.role && grant.sha256 === asset.sha256, `approved asset ${asset.id ?? "unknown"} receipt role or hash drifts`);
            add(grant.allowedFormatProfiles.includes(card.output?.formatProfile), `approved asset ${asset.id ?? "unknown"} receipt does not allow ${card.output?.formatProfile}`);
            add(grant.allowedSurfaceRoles.includes(asset.surface), `approved asset ${asset.id ?? "unknown"} receipt does not allow surface ${asset.surface}`);
            add(grant.allowedAudiences.includes(deliveryAudience), `approved asset ${asset.id ?? "unknown"} receipt does not allow audience ${deliveryAudience}`);
            if (deliveryAudience === "public") add(grant.publicationPermission === true, `approved asset ${asset.id ?? "unknown"} receipt does not grant public publication`);
            add(grant.licenseOrPermission === asset.licenseOrPermission, `approved asset ${asset.id ?? "unknown"} receipt license or permission drifts`);
            if (asset.role === "text_font") add(grant.fallback === asset.fontFallback, `approved font ${asset.id ?? "unknown"} fallback drifts from receipt`);
            if (asset.role === "interface_icon") add(grant.fallback === asset.fallback && sameValue([...(grant.glyphs ?? [])].sort(), [...(asset.glyphs ?? [])].sort()), `approved icon ${asset.id ?? "unknown"} fallback or glyph set drifts from receipt`);
            if (["identity", "editorial", "evidence", "data_visualization", "map", "social_preview", "atmosphere", "ui_capture", "provider_content", "generated_vector"].includes(asset.role)) add(grant.fallback === asset.fallback && grant.altOrTextEquivalent === asset.altOrTextEquivalent, `approved asset ${asset.id ?? "unknown"} fallback or text equivalent drifts from receipt`);
          }
        }
      }
    }
    if (asset.role === "identity") {
      add((resolution.registry?.identity ?? []).some((entry) => entry.id === asset.id), `identity ${asset.id ?? "unknown"} does not resolve to the identity registry collection`);
      if (asset.approvalStatus === "approved") {
        add(asset.sha256 === registered?.sha256 && asset.approvedBy === registered?.approvedBy && asset.approvedAt === registered?.approvedAt, `identity ${asset.id ?? "unknown"} approval or hash drifts from registry`);
        add((registered?.allowedSurfaces ?? []).includes(asset.surface), `identity ${asset.id ?? "unknown"} is not approved for surface ${asset.surface ?? "unknown"}`);
        add(Array.isArray(registered?.minimumSize) && registered.minimumSize.length > 0 && isObject(registered?.clearSpace), `identity ${asset.id ?? "unknown"} lacks computable size or clear-space rules`);
      }
    }
    if (asset.role === "interface_icon") {
      add((resolution.registry?.iconSubsets ?? []).some((entry) => entry.id === asset.id), `interface icon ${asset.id ?? "unknown"} does not resolve to the icon registry collection`);
      if (asset.approvalStatus === "approved") add(asset.sha256 === registered?.sha256 && asset.approvedBy === registered?.approvedBy && asset.approvedAt === registered?.approvedAt && registered?.axes?.FILL === 0, `interface icon ${asset.id ?? "unknown"} is not the approved FILL 0 subset or its approval record drifts`);
    }
    if (asset.role === "text_font") {
      add((resolution.registry?.fonts ?? []).some((entry) => entry.id === asset.id), `text font ${asset.id ?? "unknown"} does not resolve to the font registry collection`);
      const fallbackKey = registered?.role === "display_latin" ? "displayLatin"
        : registered?.role === "display_thai" ? "displayThai"
          : ["body_ui", "body_ui_emphasis"].includes(registered?.role) ? "body"
            : "technical";
      add(asset.fontRole === registered?.role && asset.fontFamily === registered?.family && asset.fontSubset === registered?.subset && asset.fontWeight === registered?.weight, `text font ${asset.id ?? "unknown"} role, family, subset, or weight drifts from registry`);
      add(asset.fontFallback === resolution.registry?.fallbacks?.[fallbackKey], `text font ${asset.id ?? "unknown"} fallback drifts from registry`);
      add(asset.licenseOrPermission === registered?.license, `text font ${asset.id ?? "unknown"} license drifts from registry`);
    }
    if (["editorial", "evidence", "data_visualization", "map", "social_preview", "atmosphere", "ui_capture", "provider_content", "generated_vector"].includes(asset.role)) {
      add((resolution.registry?.media ?? []).some((entry) => entry.id === asset.id), `${asset.role} asset ${asset.id ?? "unknown"} does not resolve to the media registry collection`);
      add(registered?.role === asset.role, `${asset.role} asset ${asset.id ?? "unknown"} role drifts from its registry record`);
      if (asset.approvalStatus === "approved") {
        add((registered?.allowedSurfaces ?? []).includes(asset.surface), `${asset.role} asset ${asset.id ?? "unknown"} is not approved for surface ${asset.surface ?? "unknown"}`);
        add((registered?.rights?.allowedAudiences ?? []).includes(deliveryAudience), `${asset.role} asset ${asset.id ?? "unknown"} rights do not allow ${deliveryAudience}`);
        if (deliveryAudience === "public") add(registered?.rights?.publicationPermission === true && ["public", "licensed"].includes(registered?.rights?.status), `${asset.role} asset ${asset.id ?? "unknown"} lacks public or licensed publication permission`);
        add(asset.approvalReceiptRef === registered?.approvalReceiptRef, `${asset.role} asset ${asset.id ?? "unknown"} approval receipt drifts from registry`);
        add(isNonEmpty(asset.licenseOrPermission) && isNonEmpty(asset.altOrTextEquivalent), `${asset.role} asset ${asset.id ?? "unknown"} lacks rights or text-equivalent evidence`);
      }
    }
  }
  for (const blockerRef of blockerRefs.filter((ref) => ref.startsWith("asset:"))) {
    const id = blockerRef.slice("asset:".length);
    add((card.assets ?? []).some((asset) => asset.id === id && asset.approvalStatus !== "approved"), `asset blocker ${blockerRef} has no matching unapproved asset`);
  }
  if (blockerRefs.length > 0) {
    add(card.publication?.public === false, "artifact with blockers must remain non-public");
    add(card.publication?.indexing !== "index", "artifact with blockers cannot be indexable");
    add(card.publication?.sitemapEligible !== true, "artifact with blockers cannot enter a sitemap");
  }
  const assumptions = card.assumptions ?? [];
  const assumptionIds = assumptions.map((assumption) => assumption.id);
  add(unique(assumptionIds), "assumption IDs are not unique");
  const highImpactDomains = new Set(["truth", "identity", "rights", "accessibility", "locale_completeness", "primary_action", "evidence_interpretation"]);
  for (const assumption of assumptions) {
    const blockerRef = `assumption:${assumption.id}`;
    if (assumption.status === "validated") add(isNonEmpty(assumption.resolutionRef), `validated assumption ${assumption.id} lacks resolutionRef`);
    if (assumption.status === "bounded_non_blocking") add(assumption.impactDomain === "composition_only", `non-blocking assumption ${assumption.id} affects a governed outcome`);
    if (highImpactDomains.has(assumption.impactDomain) && assumption.status !== "validated") add(assumption.status === "unresolved_blocking", `high-impact assumption ${assumption.id} is neither validated nor blocking`);
    if (assumption.status === "unresolved_blocking") add(blockerRefs.includes(blockerRef), `blocking assumption ${assumption.id} is missing ${blockerRef}`);
    else add(!blockerRefs.includes(blockerRef), `resolved or non-blocking assumption ${assumption.id} still has a blocker ref`);
  }
  for (const blockerRef of blockerRefs.filter((ref) => ref.startsWith("assumption:"))) {
    const id = blockerRef.slice("assumption:".length);
    add(assumptions.some((assumption) => assumption.id === id && assumption.status === "unresolved_blocking"), `assumption blocker ${blockerRef} has no matching unresolved assumption`);
  }
  if ((card.capabilities ?? []).includes("claims")) {
    add(isNonEmpty(card.publication?.claimManifestRef), "claims capability requires claimManifestRef");
    add(/^[a-f0-9]{64}$/.test(card.publication?.claimManifestSha256 ?? ""), "claims capability requires claimManifestSha256");
    add(isNonEmpty(card.publication?.claimAsOf), "claims capability requires claimAsOf");
    const claimResolution = resolveBoundClaimManifest(card, artifactRoot, claimManifestDocument);
    if (claimResolution.errors.length) errors.push(...claimResolution.errors);
    const composedClaimIds = [...new Set((card.composition?.sections ?? []).flatMap((section) => section.claimIds ?? []))];
    const claimEntries = new Map((claimResolution.manifest?.records ?? []).map((entry) => [entry.claimId, entry]));
    add(sameValue([...composedClaimIds].sort(), [...claimEntries.keys()].sort()), "composition claim IDs must exactly match the bound claim manifest");
    for (const claimId of composedClaimIds) {
      const entry = claimEntries.get(claimId);
      const blockerRef = `claim:${claimId}`;
      add(Boolean(entry), `composed claim ${claimId} is absent from the claim manifest`);
      if (!entry || entry.status !== "approved") {
        add(deliveryAudience === "internal_preview", `unapproved claim ${claimId} can exist only in internal_preview`);
        add(blockerRefs.includes(blockerRef), `unapproved claim ${claimId} is missing ${blockerRef}`);
      } else {
        add(!blockerRefs.includes(blockerRef), `approved claim ${claimId} still has a blocker ref`);
        if (resolvedDelivery) add(entry.status === "approved", `${deliveryAudience} claim ${claimId} is not approved`);
        if (deliveryAudience === "public") add(entry.publicProjectionEligible === true, `public claim ${claimId} is not public-projection eligible`);
        const record = claimResolution.recordsById.get(claimId)?.record;
        add(Boolean(record), `approved claim ${claimId} record is unresolved`);
        if (record) {
          errors.push(...claimTemporalErrors(record, card.publication?.claimAsOf, card.locale?.available ?? []));
          if (resolvedDelivery) errors.push(...publicClaimProjectionErrors(record, deliveryAudience, disclosurePurpose).map((message) => `${claimId}: ${message}`));
        }
      }
    }
    for (const blockerRef of blockerRefs.filter((ref) => ref.startsWith("claim:"))) {
      const claimId = blockerRef.slice("claim:".length);
      const entry = claimEntries.get(claimId);
      add(composedClaimIds.includes(claimId) && entry?.status !== "approved", `claim blocker ${blockerRef} has no matching unresolved claim`);
    }
  } else {
    const composedClaimIds = [...new Set((card.composition?.sections ?? []).flatMap((section) => section.claimIds ?? []))];
    add(composedClaimIds.length === 0, "composition contains claims without the claims capability");
    add(!Object.hasOwn(card.publication ?? {}, "claimManifestRef") && !Object.hasOwn(card.publication ?? {}, "claimManifestSha256"), "claim manifest binding exists without the claims capability");
  }
  if (card.artifact?.productScope === "named_product") add(isNonEmpty(card.artifact?.namedProduct), "named product scope requires namedProduct");
  if (card.artifact?.productScope === "shared_landometer") add(!Object.hasOwn(card.artifact ?? {}, "namedProduct"), "shared Landometer scope must not carry namedProduct");
  for (const action of card.actions ?? []) {
    add(isNonEmpty(action.id) && isNonEmpty(action.label) && isNonEmpty(action.outcome), "action has blank identity/label/outcome");
    if (action.availability === "requires_permission") {
      errors.push(...typedActionContractErrors(card, action, "permissionContract", "permission", artifactRoot));
    }
    if (["planned", "unavailable"].includes(action.availability)) add(isNonEmpty(action.availabilityReason) && action.priority !== "primary", `${action.id} unavailable/planned contract invalid`);
    const effect = action.consequence ?? {};
    const consequential = effect.class !== "none" || effect.external === true || effect.cost !== "none";
    if (effect.class === "none") add(effect.reversible === true, `${action.id} none-class consequence must remain locally reversible`);
    if (effect.class === "reversible") add(effect.reversible === true, `${action.id} reversible consequence must be reversible`);
    if (["irreversible", "destructive"].includes(effect.class)) add(effect.reversible === false, `${action.id} irreversible/destructive consequence cannot claim reversibility`);
    if (!consequential) add(action.confirmation === "none", `${action.id} effect-free action must not request confirmation`);
    if (consequential) {
      add(["explicit", "step_up"].includes(action.confirmation), `${action.id} consequential action lacks explicit confirmation`);
      errors.push(...typedActionContractErrors(card, action, "progressPresentationContract", "progress", artifactRoot));
      errors.push(...typedActionContractErrors(card, action, "resultPresentationContract", "result", artifactRoot));
      errors.push(...typedActionContractErrors(card, action, "recoveryContract", "recovery", artifactRoot));
      errors.push(...typedReceiptSchemaBindingErrors(action, artifactRoot));
    }
    errors.push(...actionIntentContractErrors(action));
  }
  if (resolvedDelivery) {
    const navigationProjection = (card.navigation?.destinations ?? []).map((destination) => ({
      target: destination.target,
      label: destination.label,
      labelByLocale: destination.labelByLocale,
      compactLabel: destination.compactLabel,
      compactLabelByLocale: destination.compactLabelByLocale
    }));
    const navigationResidue = workflowResidueHits(navigationProjection, "$/navigation", {
      allowedFieldClasses: disclosureResolution.allowedFieldClasses
    });
    add(navigationResidue.length === 0, `audience navigation fields contain workflow residue at ${navigationResidue.join(", ")}`);
    const actionProjection = (card.actions ?? []).map((action) => ({
      label: action.label,
      compactLabel: action.compactLabel,
      labelByLocale: action.labelByLocale,
      compactLabelByLocale: action.compactLabelByLocale,
      outcome: action.outcome,
      outcomeByLocale: action.outcomeByLocale,
      destinationBinding: action.destinationBinding,
      availabilityReason: action.availabilityReason,
      availabilityReasonByLocale: action.availabilityReasonByLocale
    }));
    const actionResidue = workflowResidueHits(actionProjection, "$/actions", {
      allowedFieldClasses: disclosureResolution.allowedFieldClasses
    });
    add(actionResidue.length === 0, `audience action fields contain workflow residue at ${actionResidue.join(", ")}`);
  }
  for (const phase of ["automated", "manual", "production"]) add(Array.isArray(card.qa?.[phase]) && card.qa[phase].length > 0, `qa.${phase} must be non-empty`);
  return errors;
}

const buildCross = buildCrossErrors(build);
check(buildCross.length === 0, `build-card.example.json: cross-field validation failed${buildCross.length ? `\n  ${buildCross.join("\n  ")}` : ""}`);
const assetApprovalCross = assetApprovalReceiptErrors(assetRegistry, assetApprovalReceipt);
check(assetApprovalCross.length === 0, `asset approval receipt: cross-field validation failed${assetApprovalCross.length ? `\n  ${assetApprovalCross.join("\n  ")}` : ""}`);
if ((build.capabilities ?? []).includes("agent_action")) {
  const agentCross = agentActionCrossErrors(agentAction, build);
  check(agentCross.length === 0, `agent-action.example.json: cross-field validation failed${agentCross.length ? `\n  ${agentCross.join("\n  ")}` : ""}`);
}

function resolvedAcceptanceContracts(manifest, card = build) {
  const overrides = formatPacks?.acceptanceOverridesByConformanceVariant?.[conformanceVariantKey(card)] ?? {};
  return (manifest.resolution?.resolvedRuleIds ?? []).flatMap((ruleId) =>
    (ruleById.get(ruleId)?.acceptance ?? []).map((acceptance) => ({ ...acceptance, ...(overrides[acceptance.checkId] ?? {}), ruleId }))
  );
}

function bundleFilePath(root, ref) {
  if (!isNonEmpty(root) || !isNonEmpty(ref) || ref.includes("\u0000") || isAbsolute(ref) || /^(?:[a-z][a-z0-9+.-]*:|[\\/])/i.test(ref) || /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(ref)) return null;
  try {
    const realRoot = realpathSync(root);
    if (!statSync(realRoot).isDirectory()) return null;
    const candidate = join(realRoot, ref);
    if (!existsSync(candidate) || !statSync(candidate).isFile()) return null;
    const realCandidate = realpathSync(candidate);
    return realCandidate.startsWith(`${realRoot}${sep}`) ? realCandidate : null;
  } catch {
    return null;
  }
}

function downstreamBundleRoot(value) {
  if (!isNonEmpty(value) || value.includes("\u0000")) return null;
  try {
    const path = realpathSync(resolve(value));
    return statSync(path).isDirectory() ? path : null;
  } catch {
    return null;
  }
}

function downstreamJson(root, ref, label) {
  const errors = [];
  if (!isNonEmpty(ref) || ref.includes("#")) return { errors: [`${label} must be a fragment-free relative bundle path`], document: null, path: null };
  const path = bundleFilePath(root, ref);
  if (!path) return { errors: [`${label} does not resolve to a regular file inside the bundle`], document: null, path: null };
  try {
    return { errors, document: JSON.parse(readFileSync(path, "utf8")), path };
  } catch (error) {
    return { errors: [`${label} is not valid JSON (${error.message})`], document: null, path };
  }
}

const layerAcceptanceCriteria = {
  "LAYER-DISCOVERY": "The final artifact preserves truthful discovery identity, visible primary meaning, destinations, and machine projections.",
  "LAYER-READABILITY": "The final artifact preserves readable hierarchy, complete content, locale coverage, and material limitations.",
  "LAYER-ACTION": "The final artifact preserves truthful action labels, availability, consequence, permission, result, and recovery behavior."
};

function productionVerificationErrors(verification, manifest, builtAt, checkedAt) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const canonical = manifest.delivery?.metadataProjection?.canonicalUrl;
  const deliveredFiles = (manifest.delivery?.files ?? []).map(({ path, sha256, mediaType }) => ({ path, sha256, mediaType })).sort((left, right) => left.path.localeCompare(right.path));
  if (isNonEmpty(canonical)) {
    const primaryHtml = manifest.delivery?.primaryHtmlBinding;
    add(verification.kind === "production_probe" && verification.contentEquivalent === true, "production probe did not prove content equivalence");
    add(verification.observedUrl === canonical && verification.expectedCanonicalUrl === canonical, "production probe URL drifts from the canonical artifact URL");
    add(isObject(primaryHtml) && verification.returnedContentSha256 === primaryHtml.sha256 && verification.expectedContentSha256 === primaryHtml.sha256 && deliveredFiles.some((file) => file.path === primaryHtml.path && file.sha256 === primaryHtml.sha256), "production bytes do not equal the bound primary delivered initial HTML");
  } else {
    add(verification.kind === "delivery_probe" && verification.contentEquivalent === true, "final export or distribution probe did not prove content equivalence");
    const observedFiles = (verification.observedFiles ?? []).map(({ path, sha256, mediaType }) => ({ path, sha256, mediaType })).sort((left, right) => left.path.localeCompare(right.path));
    add(sameValue(observedFiles, deliveredFiles), "final export or distribution observed-file set differs from delivered artifact files");
  }
  add(Date.parse(verification.observedAt ?? "") >= builtAt && checkedAt >= Date.parse(verification.observedAt ?? ""), "production observation chronology is invalid");
  return errors;
}

function receiptBindingErrors(result, manifest, verificationRoot, expected = {}, trustStores = externalTrustStoresForRoot(verificationRoot)) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(isNonEmpty(result?.receiptRef) && /^[a-f0-9]{64}$/.test(result?.receiptSha256 ?? ""), `${expected.checkId ?? result?.checkId ?? "receipt"} lacks a hash-addressed receipt binding`);
  const receiptPath = bundleFilePath(verificationRoot, result?.receiptRef);
  add(Boolean(receiptPath), `${expected.checkId ?? result?.checkId ?? "receipt"} receipt file does not resolve inside the artifact bundle`);
  if (!receiptPath) return errors;
  add(sha256File(receiptPath) === result.receiptSha256, `${expected.checkId ?? result?.checkId ?? "receipt"} receipt hash does not match its bytes`);
  let receipt;
  try {
    receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
  } catch (error) {
    errors.push(`${expected.checkId ?? result?.checkId ?? "receipt"} receipt is not valid JSON (${error.message})`);
    return errors;
  }
  const schemaErrors = validateSchema(conformanceReceiptSchema, receipt);
  add(schemaErrors.length === 0, `${expected.checkId ?? result?.checkId ?? "receipt"} receipt does not satisfy conformance-receipt.schema.json`);
  add(receipt.attestationRef === result?.attestationRef, `${expected.checkId ?? result?.checkId ?? "receipt"} receipt attestationRef drifts from manifest`);
  errors.push(...detachedAttestationBindingErrors({ ref: result?.attestationRef, sha256: result?.attestationSha256 }, {
    label: `${expected.checkId ?? result?.checkId ?? "receipt"} conformance`,
    purpose: conformanceAttestationPurpose(receipt.method),
    subjectRef: result?.receiptRef,
    subjectSha256: result?.receiptSha256,
    checkedAt: receipt.checkedAt,
    requiredStoreScope: "operator_external"
  }, verificationRoot, trustStores));
  add(receipt.releaseRef === manifest.release?.releaseRef, `${expected.checkId ?? result?.checkId ?? "receipt"} receipt releaseRef drifts from manifest`);
  add(receipt.artifactId === manifest.artifact?.id && receipt.artifactBuildId === manifest.artifact?.artifactBuildId, `${expected.checkId ?? result?.checkId ?? "receipt"} receipt subject drifts from manifest artifact/build`);
  add(receipt.checkId === (expected.checkId ?? result?.checkId), `${expected.checkId ?? result?.checkId ?? "receipt"} receipt checkId mismatch`);
  if (expected.method ?? result?.method) add(receipt.method === (expected.method ?? result?.method), `${expected.checkId ?? result?.checkId ?? "receipt"} receipt method mismatch`);
  add(receipt.result === result?.result && receipt.owner === result?.owner && receipt.checkedAt === result?.checkedAt, `${expected.checkId ?? result?.checkId ?? "receipt"} receipt result, owner, or time drifts from manifest`);
  const catalogAcceptance = acceptanceById.get(receipt.checkId);
  const expectedCriterion = expected.criterion ?? catalogAcceptance?.criterion ?? layerAcceptanceCriteria[receipt.checkId];
  add(isNonEmpty(expectedCriterion), `${receipt.checkId ?? "receipt"} has no governed acceptance criterion`);
  if (isNonEmpty(expectedCriterion)) {
    add(receipt.assertion === expectedCriterion, `${receipt.checkId} receipt assertion does not equal its governed criterion`);
    add(receipt.criterionSha256 === sha256Bytes(expectedCriterion), `${receipt.checkId} criterion hash mismatch`);
  }
  add(receipt.protocolId === `lds-v0.9.4/${receipt.checkId}`, `${receipt.checkId ?? "receipt"} protocolId mismatch`);
  const builtAt = Date.parse(manifest.artifact?.builtAt ?? "");
  const checkedAt = Date.parse(receipt.checkedAt ?? "");
  add(Number.isFinite(builtAt) && Number.isFinite(checkedAt) && checkedAt >= builtAt, `${receipt.checkId ?? "receipt"} predates the artifact build`);
  add(unique((receipt.subjectFiles ?? []).map((subject) => subject.path)), `${receipt.checkId ?? "receipt"} subject file paths are not unique`);
  for (const subject of receipt.subjectFiles ?? []) {
    const subjectPath = bundleFilePath(verificationRoot, subject.path);
    add(Boolean(subjectPath), `${receipt.checkId ?? "receipt"} subject file does not resolve inside the artifact bundle: ${String(subject.path)}`);
    if (subjectPath) add(sha256File(subjectPath) === subject.sha256, `${receipt.checkId ?? "receipt"} subject file hash mismatch: ${subject.path}`);
  }
  add(unique((receipt.evidenceFiles ?? []).map((evidence) => evidence.path)), `${receipt.checkId ?? "receipt"} evidence file paths are not unique`);
  const evidencePaths = new Set((receipt.evidenceFiles ?? []).map((evidence) => evidence.path));
  for (const evidence of receipt.evidenceFiles ?? []) {
    const evidencePath = bundleFilePath(verificationRoot, evidence.path);
    add(Boolean(evidencePath), `${receipt.checkId ?? "receipt"} evidence file does not resolve inside the artifact bundle: ${String(evidence.path)}`);
    if (evidencePath) add(sha256File(evidencePath) === evidence.sha256, `${receipt.checkId ?? "receipt"} evidence file hash mismatch: ${evidence.path}`);
  }
  for (const ref of receipt.evidenceRefs ?? []) {
    add(evidencePaths.has(ref), `${receipt.checkId ?? "receipt"} evidenceRef is not hash-bound in evidenceFiles: ${ref}`);
  }
  add(unique((receipt.testCases ?? []).map((testCase) => testCase.id)), `${receipt.checkId ?? "receipt"} test case IDs are not unique`);
  for (const testCase of receipt.testCases ?? []) {
    add(testCase.result === "pass", `${receipt.checkId ?? "receipt"} has a non-passing test case ${testCase.id ?? "unknown"}`);
    for (const ref of testCase.evidenceRefs ?? []) add(evidencePaths.has(ref), `${receipt.checkId ?? "receipt"} test case ${testCase.id ?? "unknown"} cites unbound evidence ${ref}`);
  }
  const requiredEvidenceKind = receipt.method === "automated" ? "runner_report" : receipt.method === "production" ? "production_observation" : receipt.method === "visual" ? "screenshot" : receipt.method === "interaction" ? "interaction_log" : receipt.method === "accessibility" ? "accessibility_report" : "review_record";
  add((receipt.evidenceFiles ?? []).some((evidence) => evidence.kind === requiredEvidenceKind), `${receipt.checkId ?? "receipt"} lacks method-specific ${requiredEvidenceKind} evidence`);
  const reportKinds = new Set(["runner_report", "interaction_log", "accessibility_report", "review_record", "production_observation"]);
  for (const evidence of (receipt.evidenceFiles ?? []).filter((item) => reportKinds.has(item.kind))) {
    const evidencePath = bundleFilePath(verificationRoot, evidence.path);
    if (!evidencePath || !/json/i.test(evidence.mediaType ?? "")) continue;
    let report = null;
    try { report = JSON.parse(readFileSync(evidencePath, "utf8")); } catch { report = null; }
    add(Boolean(report), `${receipt.checkId ?? "receipt"} method evidence report is not valid JSON`);
    if (report) {
      add(report.checkId === receipt.checkId && report.method === receipt.method && report.protocolId === receipt.protocolId && report.result === receipt.result, `${receipt.checkId} method evidence report identity or result drifts`);
      add(sameValue([...(report.testCaseIds ?? [])].sort(), (receipt.testCases ?? []).map((testCase) => testCase.id).sort()), `${receipt.checkId} method evidence report test-case coverage drifts`);
    }
  }
  const verification = receipt.verification ?? {};
  if (receipt.method === "automated") {
    add(verification.kind === "automated_runner" && verification.exitCode === 0, `${receipt.checkId} automated verification did not complete successfully`);
    add(Date.parse(verification.startedAt ?? "") >= builtAt && Date.parse(verification.completedAt ?? "") >= Date.parse(verification.startedAt ?? "") && checkedAt >= Date.parse(verification.completedAt ?? ""), `${receipt.checkId} automated verification chronology is invalid`);
  } else if (receipt.method === "production") {
    errors.push(...productionVerificationErrors(verification, manifest, builtAt, checkedAt).map((message) => `${receipt.checkId} ${message}`));
  } else {
    add(verification.kind === "human_review" && verification.blockingFindingCount === 0, `${receipt.checkId} human verification has blocking findings`);
    add(Date.parse(verification.reviewedAt ?? "") >= builtAt && checkedAt >= Date.parse(verification.reviewedAt ?? ""), `${receipt.checkId} human review chronology is invalid`);
  }
  if (receipt.method === "production" || ["OUTPUT-CLARITY-01-A", "OUTPUT-CLARITY-01-B"].includes(receipt.checkId)) {
    for (const delivered of manifest.delivery?.files ?? []) {
      const subject = (receipt.subjectFiles ?? []).find((entry) => entry.path === delivered.path);
      add(Boolean(subject), `${receipt.checkId ?? "production receipt"} omits delivered file ${delivered.path}`);
      if (subject) add(subject.sha256 === delivered.sha256, `${receipt.checkId ?? "production receipt"} delivered-file hash drifts for ${delivered.path}`);
    }
    const receiptSubjects = (receipt.subjectFiles ?? []).map(({ path, sha256 }) => ({ path, sha256 })).sort((a, b) => a.path.localeCompare(b.path));
    const deliveredSubjects = (manifest.delivery?.files ?? []).map(({ path, sha256 }) => ({ path, sha256 })).sort((a, b) => a.path.localeCompare(b.path));
    add(sameValue(receiptSubjects, deliveredSubjects), `${receipt.checkId ?? "production receipt"} subject-file set must equal delivered files exactly`);
    if (["OUTPUT-CLARITY-01-A", "OUTPUT-CLARITY-01-B"].includes(receipt.checkId)) {
      for (const inspection of manifest.delivery?.contentInspections ?? []) {
        const evidence = (receipt.evidenceFiles ?? []).find((entry) => entry.path === inspection.evidenceRef);
        add(Boolean(evidence), `${receipt.checkId} omits audience-content inspection evidence ${inspection.evidenceRef}`);
        if (evidence) add(evidence.sha256 === inspection.evidenceSha256 && evidence.kind === "extracted_text", `${receipt.checkId} audience-content inspection evidence binding drifts for ${inspection.subjectPath}`);
        add(Date.parse(inspection.inspectedAt ?? "") <= checkedAt, `${receipt.checkId} predates audience-content inspection ${inspection.subjectPath}`);
      }
    }
  }
  if (["DISCOVERY-01-A", "DISCOVERY-02-A"].includes(receipt.checkId)) {
    const discoveryEvidence = manifest.delivery?.webDiscoveryEvidence;
    const requiredBindings = [discoveryEvidence?.noScript, discoveryEvidence?.hydratedDom, discoveryEvidence?.accessibilityTree];
    if (receipt.checkId === "DISCOVERY-02-A") {
      requiredBindings.push(discoveryEvidence?.internalLocaleLinks);
      if (discoveryEvidence?.sitemap) requiredBindings.push(discoveryEvidence.sitemap);
    }
    for (const binding of requiredBindings) {
      const evidence = (receipt.evidenceFiles ?? []).find((entry) => entry.path === binding?.ref);
      add(Boolean(evidence), `${receipt.checkId} omits governed web discovery evidence ${binding?.ref ?? "unknown"}`);
      if (evidence) add(evidence.sha256 === binding.sha256, `${receipt.checkId} web discovery evidence hash drifts for ${binding.ref}`);
    }
    add(Date.parse(discoveryEvidence?.observedAt ?? "") <= checkedAt, `${receipt.checkId} predates its web discovery evidence`);
  }
  return errors;
}

function projectedClaimRecords(manifest, card, verificationRoot) {
  const resolution = resolveBoundClaimManifest(card, verificationRoot);
  return {
    errors: resolution.errors,
    items: (manifest.representation?.claimIds ?? []).map((claimId) => {
      const resolved = resolution.recordsById.get(claimId);
      return { claimId, entry: resolved?.entry ?? null, record: resolved?.record ?? null };
    })
  };
}

function rawColorDeliveryErrors(manifest) {
  const errors = [];
  const registry = tokens?.projection?.canonicalColorRegistry ?? {};
  const forbiddenPaths = new Set([registry.tokensRef, registry.scalesRef, registry.deliveryRef, registry.rawCssRef].filter(isNonEmpty));
  const forbiddenHashes = new Set([registry.tokensSha256, registry.scalesSha256, registry.deliverySha256, registry.rawCssSha256].filter(isNonEmpty));
  for (const file of manifest.delivery?.files ?? []) {
    if (forbiddenPaths.has(file.path) || forbiddenHashes.has(file.sha256)) errors.push(`delivery file ${file.path} emits forbidden raw color-registry bytes`);
  }
  return errors;
}

function implementationBindingErrors(manifest, card, verificationRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const bindings = manifest.delivery?.implementationBindings ?? {};
  const definitions = [
    ["formatKit", release.schemaIds?.formatKit, formatKitsSchema],
    ["targetProfile", release.schemaIds?.targetProfile, targetProfilesSchema],
    ["preset", release.schemaIds?.formatImplementation, formatImplementationSchema]
  ];
  const documentsByKind = {};
  for (const [kind, schemaRef, schema] of definitions) {
    const binding = bindings[kind];
    const resolved = boundJson(binding, verificationRoot, `${kind} implementation binding`, schemaRef, schema);
    errors.push(...resolved.errors);
    documentsByKind[kind] = resolved.document;
  }
  const pack = packByProfile.get(card.output?.formatProfile);
  const formatKitDocument = documentsByKind.formatKit;
  const targetProfileDocument = documentsByKind.targetProfile;
  const preset = documentsByKind.preset;
  const promoted = ["artifact_qa_passed", "production_verified"].includes(manifest.validation?.conformanceLevel);
  const kit = (formatKitDocument?.kits ?? []).find((entry) => entry.id === bindings.formatKit?.id);
  const target = (targetProfileDocument?.profiles ?? []).find((entry) => entry.id === bindings.targetProfile?.id);
  add(bindings.formatKit?.sha256 === sha256File(join(packageDir, files.formatKits)), "format-kit implementation binding bytes differ from the active package registry");
  add(bindings.targetProfile?.sha256 === sha256File(join(packageDir, files.targetProfiles)), "target-profile implementation binding bytes differ from the active package registry");
  add(Boolean(kit) && kit.id === pack?.kitRef && kit.formatProfile === card.output?.formatProfile, "format-kit implementation binding does not resolve the selected pack kit");
  add(Boolean(target) && target.id === card.output?.targetProfileRef && target.formatProfile === card.output?.formatProfile && target.runtime === card.output?.runtime, "target-profile implementation binding does not resolve the selected format/runtime target");
  add(preset?.recordId === bindings.preset?.id && preset?.formatProfile === card.output?.formatProfile && preset?.runtime === card.output?.runtime && preset?.targetProfileRef === card.output?.targetProfileRef && preset?.formatKitId === pack?.kitRef, "format implementation record drifts from Build Card format, runtime, target, or format pack");
  if (preset) {
    add(!promoted || preset.recordKind === "artifact_resolved", "artifact QA requires an artifact_resolved format implementation record; a shipped reference_example is not selectable for promotion");
    if (preset.recordKind === "artifact_resolved") {
      const expectedRecordId = `implementation.${card.artifact?.id}.${manifest.artifact?.artifactBuildId}`;
      add(preset.recordId === expectedRecordId, "artifact-resolved format implementation recordId is not deterministically bound to the artifact and build");
      add(preset.artifactBinding?.artifactId === card.artifact?.id && preset.artifactBinding?.artifactBuildId === manifest.artifact?.artifactBuildId, "artifact-resolved format implementation subject drifts from the Artifact Manifest");
      add(preset.artifactBinding?.buildCardRef === manifest.artifact?.buildCardRef && preset.artifactBinding?.buildCardSha256 === manifest.artifact?.buildCardSha256, "artifact-resolved format implementation does not bind the exact Build Card bytes");
      const buildPath = bundleFilePath(verificationRoot, preset.artifactBinding?.buildCardRef);
      add(Boolean(buildPath) && sha256File(buildPath) === preset.artifactBinding?.buildCardSha256, "artifact-resolved format implementation Build Card binding is invalid");
    }
    const context = preset.resolutionContext ?? {};
    add(context.experienceProfile === card.experience?.profile, "format implementation experience profile drifts from the Build Card");
    add(sameValue(context.secondaryExperienceProfiles ?? [], card.experience?.secondaryProfiles ?? []), "format implementation secondary experience profiles drift from the Build Card");
    add(sameValue(context.capabilities ?? [], card.capabilities ?? []), "format implementation capabilities drift from the Build Card");
    add(context.sideBookmarkSelected === (card.navigation?.sideBookmark === "selected"), "format implementation side-bookmark selection drifts from the Build Card");
    add(sameValue(context.componentIds ?? [], card.composition?.componentIds ?? []), "format implementation resolution-context componentIds do not exactly equal the Build Card");
    for (const error of implementationPlatformContractErrors(preset)) errors.push(error);
    const expectedPlatform = expectedAuthoringPlatformForCard(card);
    add(isNonEmpty(expectedPlatform) && preset.authoringPlatform === expectedPlatform, "format implementation authoring platform drifts from the Build Card identity typography binding");
    const cardTypography = identityTypographyEntryForCard(card);
    add(Boolean(cardTypography) && cardTypography.implementation.id === card.identityImplementation?.id, "Build Card identity typography binding is outside its selected identity implementation");
    if (cardTypography) {
      add(cardTypography.binding.formatProfile === card.output?.formatProfile && cardTypography.binding.platform === expectedPlatform, "Build Card identity typography binding does not authorize the selected format/platform");
      add((card.identityImplementation?.nativeMappingId ?? null) === (cardTypography.binding.nativeMappingId ?? null), "Build Card identity native mapping drifts from its typography binding");
    }
    if (card.output?.runtime !== "browser") {
      for (const fontRole of [...new Set((card.assets ?? []).filter((asset) => asset.role === "text_font").map((asset) => asset.fontRole))]) {
        add([...nativeFontMappingById.values()].some((mapping) => mapping.platform === expectedPlatform && mapping.role === fontRole && (mapping.allowedFormatProfiles ?? []).includes(card.output?.formatProfile)), `Build Card text font role ${fontRole ?? "unknown"} has no exact native mapping for ${expectedPlatform ?? "unknown platform"}`);
      }
    }
    const tokenPath = bundleFilePath(verificationRoot, preset.tokenRef);
    add(Boolean(tokenPath) && sha256File(tokenPath) === preset.tokenSha256, "format implementation record token binding is invalid");
    add(preset.tokenRef === files.tokens && preset.tokenSha256 === sha256File(join(packageDir, files.tokens)), "format implementation record must bind the active package token bytes");
    const browserRuntime = card.output?.runtime === "browser";
    const expectedByRole = {
      identityAssetIds: (card.assets ?? []).filter((asset) => asset.role === "identity").map((asset) => asset.id).sort(),
      identityImplementationIds: [card.identityImplementation?.id].filter(isNonEmpty).sort(),
      identityTypographyBindingIds: [card.identityImplementation?.typographyBindingId].filter(isNonEmpty).sort(),
      fontAssetIds: browserRuntime ? (card.assets ?? []).filter((asset) => asset.role === "text_font").map((asset) => asset.id).sort() : [],
      iconAssetIds: browserRuntime ? (card.assets ?? []).filter((asset) => asset.role === "interface_icon").map((asset) => asset.id).sort() : [],
      resolvedAssetIds: (card.assets ?? []).map((asset) => asset.id).sort(),
      nativeFontMappingIds: expectedNativeFontMappingIdsForCard(card).sort(),
      portabilityFixtureIds: expectedPortabilityFixtureIdsForCard(card)
    };
    for (const [field, expected] of Object.entries(expectedByRole)) {
      const actual = preset.requirements?.[field] ?? [];
      add(field === "portabilityFixtureIds" ? sameValue(actual, expected) : sameValue([...actual].sort(), [...expected].sort()), `format implementation record ${field} does not exactly bind the Build Card, identity typography, or authoring platform`);
    }
    add((preset.requirements?.identityImplementationIds ?? []).length === 1, "format implementation record must bind exactly one approved identity implementation");
    add(preset.requirements?.layoutSetId === release.sets?.layout?.id, "format implementation record layout set drifts");
    add((preset.requirements?.componentRuleIds ?? []).every((id) => (manifest.resolution?.resolvedRuleIds ?? []).includes(id)), "format implementation record references an unresolved component rule");
    const componentContracts = preset.requirements?.componentContracts ?? [];
    add(unique(componentContracts.map((contract) => contract.componentId)), "format implementation component contract IDs must be unique");
    add(sameValue(preset.requirements?.componentIds ?? [], card.composition?.componentIds ?? []), "format implementation componentIds do not exactly equal the Build Card componentIds");
    add(sameValue(componentContracts.map((contract) => contract.componentId), card.composition?.componentIds ?? []), "format implementation component contracts do not exactly cover the Build Card componentIds in order");
    for (const contract of componentContracts) {
      const governedContract = governedComponentContract(card.output?.formatProfile, card.output?.runtime, contract.componentId);
      add(Boolean(governedContract) && sameValue(contract, governedContract), `component ${contract.componentId ?? "unknown"} contract differs from the exact governed format/runtime reference or component template`);
    }
    const coveredComponentRules = [...new Set(componentContracts.flatMap((contract) => contract.governingRuleIds ?? []))].sort();
    add(sameValue(coveredComponentRules, [...(preset.requirements?.componentRuleIds ?? [])].sort()), "format implementation component contracts must exactly cover componentRuleIds");
    const resolvedTestIds = new Set(manifest.resolution?.resolvedTestIds ?? []);
    for (const contract of componentContracts) {
      for (const ruleId of contract.governingRuleIds ?? []) add(ruleIdSet.has(ruleId) && (preset.requirements?.componentRuleIds ?? []).includes(ruleId), `component ${contract.componentId ?? "unknown"} governing rule ${ruleId ?? "unknown"} is not selected`);
      for (const tokenRef of contract.tokenRefs ?? []) {
        add(String(tokenRef).split("#", 1)[0] === files.tokens && bundleSemanticReferenceResolves(tokenRef, verificationRoot), `component ${contract.componentId ?? "unknown"} token ref ${tokenRef ?? "unknown"} does not resolve to the active token bytes`);
      }
      for (const fixtureId of contract.localeStressFixtureIds ?? []) add(resolvedTestIds.has(fixtureId), `component ${contract.componentId ?? "unknown"} locale stress fixture ${fixtureId ?? "unknown"} is not in the resolved test set`);
      for (const fixtureId of contract.acceptanceFixtureIds ?? []) add(acceptanceIds.has(fixtureId) || resolvedTestIds.has(fixtureId), `component ${contract.componentId ?? "unknown"} acceptance fixture ${fixtureId ?? "unknown"} does not resolve`);
    }
    add(sameValue(preset.requirements?.resolvedRuleIds, manifest.resolution?.resolvedRuleIds), "format implementation record resolvedRuleIds must exactly equal Artifact Manifest resolvedRuleIds");
    add(sameValue(preset.requirements?.resolvedTestIds, manifest.resolution?.resolvedTestIds), "format implementation record resolvedTestIds must exactly equal Artifact Manifest resolvedTestIds");
    add(sameValue(preset.requirements?.accessibilityFixtureIds, accessibilityFixtureIds(card)), "format implementation record accessibilityFixtureIds must exactly equal the governed format/runtime fixtures");
  }
  return errors;
}

function implementationSourceBindingErrors(manifest, card, verificationRoot = packageDir, trustStores = externalTrustStoresForRoot(verificationRoot)) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const sources = manifest.delivery?.implementationSourceBindings ?? [];
  add(unique(sources.map((source) => source.ref)), "implementation source refs must be unique");
  const promoted = ["artifact_qa_passed", "production_verified"].includes(manifest.validation?.conformanceLevel);
  if (promoted) {
    const requiredRolesByProfile = {
      web_public: ["component_source"],
      app_interactive: ["component_source"],
      document_flow: ["editable_source", "export_preset"],
      pdf_fixed: ["editable_source", "export_preset"],
      deck_presentation: ["editable_source", "export_preset"],
      social_static: ["editable_source", "export_preset"]
    };
    const requiredRoles = requiredRolesByProfile[card.output?.formatProfile] ?? [];
    add(sources.length > 0, "artifact QA requires hash-bound implementation source bytes");
    for (const role of requiredRoles) add(sources.some((source) => source.role === role), `${card.output?.formatProfile ?? "unknown"} artifact QA requires an ${role} implementation source binding`);
  }
  const deliveredFiles = manifest.delivery?.files ?? [];
  for (const source of sources) {
    add(!String(source.ref ?? "").includes("#"), `implementation source ${source.ref ?? "unknown"} must bind a complete file, not a fragment`);
    const sourcePath = bundleFilePath(verificationRoot, source.ref);
    add(Boolean(sourcePath), `implementation source ${source.ref ?? "unknown"} does not resolve inside the artifact bundle`);
    if (sourcePath) add(sha256File(sourcePath) === source.sha256, `implementation source ${source.ref} hash mismatch`);
    const delivered = deliveredFiles.find((file) => file.path === source.ref);
    add(source.audienceDelivered === Boolean(delivered), `implementation source ${source.ref ?? "unknown"} audienceDelivered state drifts from delivery.files`);
    if (delivered) add(delivered.sha256 === source.sha256 && delivered.mediaType === source.mediaType, `delivered implementation source ${source.ref} bytes or media type drift`);
    const lineagePath = bundleFilePath(verificationRoot, source.lineageReceiptRef);
    add(Boolean(lineagePath), `implementation source ${source.ref ?? "unknown"} lineage receipt does not resolve inside the artifact bundle`);
    let lineage = null;
    if (lineagePath) {
      add(sha256File(lineagePath) === source.lineageReceiptSha256, `implementation source ${source.ref ?? "unknown"} lineage receipt hash mismatch`);
      try { lineage = JSON.parse(readFileSync(lineagePath, "utf8")); } catch (error) { errors.push(`implementation source ${source.ref ?? "unknown"} lineage receipt is not valid JSON (${error.message})`); }
    }
    if (lineage) {
      add(validateSchema(sourceLineageReceiptSchema, lineage).length === 0, `implementation source ${source.ref ?? "unknown"} lineage receipt violates its active schema`);
      add(lineage.releaseRef === manifest.release?.releaseRef && lineage.artifactId === manifest.artifact?.id && lineage.artifactBuildId === manifest.artifact?.artifactBuildId, `implementation source ${source.ref ?? "unknown"} lineage subject drifts from artifact/build`);
      add(sameValue(lineage.source, { role: source.role, ref: source.ref, sha256: source.sha256, mediaType: source.mediaType }), `implementation source ${source.ref ?? "unknown"} lineage source bytes drift`);
      const expectedOutputs = deliveredFiles.map(({ path, sha256, mediaType }) => ({ path, sha256, mediaType })).sort((left, right) => left.path.localeCompare(right.path));
      const actualOutputs = (lineage.outputs ?? []).map(({ path, sha256, mediaType }) => ({ path, sha256, mediaType })).sort((left, right) => left.path.localeCompare(right.path));
      add(sameValue(actualOutputs, expectedOutputs), `implementation source ${source.ref ?? "unknown"} lineage outputs differ from delivery.files`);
    }
    errors.push(...detachedAttestationBindingErrors({ ref: source.lineageAttestationRef, sha256: source.lineageAttestationSha256 }, {
      label: `implementation source ${source.ref ?? "unknown"} lineage`,
      purpose: "source_lineage",
      subjectRef: source.lineageReceiptRef,
      subjectSha256: source.lineageReceiptSha256,
      checkedAt: lineage?.executedAt,
      requiredStoreScope: "operator_external"
    }, verificationRoot, trustStores));
  }
  return errors;
}

function socialSidecarAudienceProjection(sidecar) {
  return {
    campaign: {
      channel: sidecar?.campaign?.channel,
      name: sidecar?.campaign?.name,
      startsAt: sidecar?.campaign?.startsAt,
      expiresAt: sidecar?.campaign?.expiresAt
    },
    claim: {
      visibleText: sidecar?.claimBinding?.visibleText,
      visibleLimitations: sidecar?.claimBinding?.visibleLimitations
    },
    evidence: (sidecar?.evidenceBindings ?? []).map(({ visibleCue, evidenceKind }) => ({ visibleCue, evidenceKind })),
    action: {
      label: sidecar?.actionBinding?.label,
      outcome: sidecar?.actionBinding?.outcome,
      destination: sidecar?.actionBinding?.destination,
      destinationCue: sidecar?.actionBinding?.destinationCue
    }
  };
}

function normalizeSocialCopyText(value) {
  return String(value ?? "").normalize("NFC").replace(/\s+/gu, " ").trim();
}

function socialVisibleCopyProjection(sidecar) {
  return {
    claim: {
      text: normalizeSocialCopyText(sidecar?.claimBinding?.visibleText),
      limitations: (sidecar?.claimBinding?.visibleLimitations ?? []).map(({ limitationId, text }) => ({
        limitationId,
        text: normalizeSocialCopyText(text)
      }))
    },
    evidenceCues: (sidecar?.evidenceBindings ?? []).map(({ evidenceRef, claimId, visibleCue, evidenceKind }) => ({
      evidenceRef,
      claimId,
      cue: normalizeSocialCopyText(visibleCue),
      kind: evidenceKind
    })),
    action: {
      label: normalizeSocialCopyText(sidecar?.actionBinding?.label),
      outcome: normalizeSocialCopyText(sidecar?.actionBinding?.outcome),
      destinationCue: normalizeSocialCopyText(sidecar?.actionBinding?.destinationCue)
    }
  };
}

function timestampWithinWindow(value, startsAt, expiresAt) {
  const timestamp = Date.parse(value ?? "");
  const start = Date.parse(startsAt ?? "");
  const end = expiresAt === null ? Infinity : Date.parse(expiresAt ?? "");
  return Number.isFinite(timestamp) && Number.isFinite(start) && !Number.isNaN(end) && start <= timestamp && timestamp <= end;
}

function expectedSocialDestinationCue(kind, destination) {
  const value = normalizeSocialCopyText(destination);
  if (["external", "download", "form"].includes(kind) && /^https:\/\//u.test(value)) {
    try {
      const url = new URL(value);
      return `${url.hostname.toLowerCase()}${url.port ? `:${url.port}` : ""}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }
  if (["route", "download", "form", "contact"].includes(kind)) return value;
  return null;
}

function socialDestinationCueErrors(actionBinding) {
  const expected = expectedSocialDestinationCue(actionBinding?.destinationKind, actionBinding?.destination);
  return isNonEmpty(expected) && actionBinding?.destinationCue === expected
    ? []
    : ["social destination cue does not deterministically identify the governed destination"];
}

function rasterDimensions(path, mediaType) {
  let bytes;
  try { bytes = readFileSync(path); } catch { return null; }
  if (mediaType === "image/png") {
    if (bytes.length < 24 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || bytes.subarray(12, 16).toString("ascii") !== "IHDR") return null;
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (mediaType === "image/jpeg") {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
    let offset = 2;
    while (offset + 8 < bytes.length) {
      if (bytes[offset] !== 0xff) { offset += 1; continue; }
      const marker = bytes[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      if (offset + 4 > bytes.length) return null;
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2) return null;
      offset += 2 + length;
    }
    return null;
  }
  if (mediaType === "image/webp") {
    if (bytes.length < 30 || bytes.subarray(0, 4).toString("ascii") !== "RIFF" || bytes.subarray(8, 12).toString("ascii") !== "WEBP") return null;
    const chunk = bytes.subarray(12, 16).toString("ascii");
    if (chunk === "VP8X") return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
    if (chunk === "VP8L" && bytes[20] === 0x2f) {
      return { width: 1 + bytes[21] + ((bytes[22] & 0x3f) << 8), height: 1 + (bytes[22] >> 6) + (bytes[23] << 2) + ((bytes[24] & 0x0f) << 10) };
    }
    if (chunk === "VP8 " && bytes.subarray(23, 26).toString("hex") === "9d012a") {
      return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
    }
  }
  return null;
}

function socialSidecarBindingErrors(manifest, card, verificationRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const binding = manifest.delivery?.socialSidecarBinding;
  const social = card.output?.formatProfile === "social_static";
  if (!social) {
    add(binding === undefined, "non-social artifact carries a social publication sidecar");
    return errors;
  }
  const promoted = ["artifact_qa_passed", "production_verified"].includes(manifest.validation?.conformanceLevel);
  if (!binding) {
    if (promoted) add(false, "social_static artifact QA requires a hash-bound publication sidecar");
    return errors;
  }
  const resolution = boundJson({ ref: binding.ref, sha256: binding.sha256, schemaRef: binding.schemaRef }, verificationRoot, "social publication sidecar", release.schemaIds?.socialSidecar, socialSidecarSchema);
  errors.push(...resolution.errors);
  add(binding.schemaSha256 === sha256File(join(packageDir, files.socialSidecarSchema)), "social publication sidecar schema hash differs from active package bytes");
  const sidecar = resolution.document;
  if (!sidecar) return errors;
  if (promoted) add(sidecar.publicationStatus === "approved_for_publication", "promoted social publication sidecar is not approved_for_publication");
  add(sidecar.artifact?.artifactId === manifest.artifact?.id && sidecar.artifact?.artifactBuildId === manifest.artifact?.artifactBuildId, "social publication sidecar artifact/build identity drifts");
  add(sidecar.artifact?.formatProfile === card.output?.formatProfile && sidecar.artifact?.targetProfileRef === card.output?.targetProfileRef, "social publication sidecar format or target drifts from Build Card");
  add(card.output?.formatContext?.kind === "social_context" && sidecar.campaign?.campaignId === card.output.formatContext.campaignId && sidecar.campaign?.channel === card.output.formatContext.channel && sidecar.campaign?.expiresAt === card.output.formatContext.expiresAt, "social publication sidecar campaign identity, channel, or expiry drifts from the Build Card social context");
  add(sidecar.artifact?.buildCardRef === manifest.artifact?.buildCardRef && sidecar.artifact?.buildCardSha256 === manifest.artifact?.buildCardSha256, "social publication sidecar Build Card binding drifts");
  add(binding.sidecarId === sidecar.sidecarId && binding.artifactBuildId === sidecar.artifact?.artifactBuildId && binding.creativePath === sidecar.artifact?.creativePath && binding.creativeSha256 === sidecar.artifact?.creativeSha256, "Artifact Manifest social-sidecar summary drifts from sidecar bytes");
  const creative = (manifest.delivery?.files ?? []).find((file) => file.path === sidecar.artifact?.creativePath);
  add(Boolean(creative) && creative.sha256 === sidecar.artifact?.creativeSha256 && creative.mediaType === sidecar.artifact?.creativeMediaType, "social publication sidecar creative is not an exact delivered file");
  const creativePath = bundleFilePath(verificationRoot, sidecar.artifact?.creativePath);
  const dimensions = creativePath ? rasterDimensions(creativePath, sidecar.artifact?.creativeMediaType) : null;
  const targetCanvas = targetById.get(card.output?.targetProfileRef)?.canvas;
  add(Boolean(dimensions) && dimensions.width === targetCanvas?.widthPx && dimensions.height === targetCanvas?.heightPx, "social creative pixel dimensions do not equal the governed target canvas");
  add(sidecar.locale?.primary === card.locale?.primary, "social publication sidecar primary locale drifts from Build Card");
  const builtAt = Date.parse(manifest.artifact?.builtAt ?? "");
  const generatedAt = Date.parse(sidecar.generatedAt ?? "");
  const promotionCheckedAt = Date.parse(sidecar.promotionCheckedAt ?? "");
  const startsAt = Date.parse(sidecar.campaign?.startsAt ?? "");
  const expiresAt = sidecar.campaign?.expiresAt === null ? Infinity : Date.parse(sidecar.campaign?.expiresAt ?? "");
  add(Number.isFinite(builtAt) && sidecar.artifact?.builtAt === manifest.artifact?.builtAt, "social publication sidecar builtAt drifts from the Artifact Manifest");
  add(Number.isFinite(generatedAt) && Number.isFinite(promotionCheckedAt) && builtAt <= generatedAt && generatedAt <= promotionCheckedAt, "social publication sidecar build, generation, or promotion chronology is invalid");
  add(Number.isFinite(startsAt) && !Number.isNaN(expiresAt) && startsAt <= expiresAt, "social publication sidecar campaign chronology is invalid");
  add(timestampWithinWindow(manifest.artifact?.builtAt, sidecar.campaign?.startsAt, sidecar.campaign?.expiresAt), "social artifact builtAt is outside the campaign window");
  add(timestampWithinWindow(sidecar.promotionCheckedAt, sidecar.campaign?.startsAt, sidecar.campaign?.expiresAt), "social promotion check is outside the campaign window");
  const claimResolution = resolveBoundClaimManifest(card, verificationRoot);
  errors.push(...claimResolution.errors);
  const claimIds = manifest.representation?.claimIds ?? [];
  add(claimIds.length === 1 && sidecar.claimBinding?.claimId === claimIds[0], "social publication sidecar must bind the single projected claim exactly");
  const resolvedClaim = claimResolution.recordsById.get(sidecar.claimBinding?.claimId);
  const claimEntry = resolvedClaim?.entry;
  const claim = resolvedClaim?.record;
  if (claimEntry && claim) {
    add(sidecar.claimBinding?.claimManifestRef === card.publication?.claimManifestRef && sidecar.claimBinding?.claimManifestSha256 === card.publication?.claimManifestSha256, "social sidecar claim-manifest binding drifts");
    add(sidecar.claimBinding?.claimRecordRef === claimEntry.recordRef && sidecar.claimBinding?.claimRecordSha256 === claimEntry.sha256, "social sidecar claim-record binding drifts");
    add(sidecar.claimBinding?.claimAsOf === card.publication?.claimAsOf && sidecar.claimBinding?.validityBasis === claim.validityBasis && sidecar.claimBinding?.validUntil === claim.validUntil, "social sidecar claim time boundary drifts");
    add(sidecar.claimBinding?.visibleText === claim.textByLocale?.[card.locale?.primary], "social sidecar visible claim text drifts from the primary-locale claim");
    const expectedLimitations = (claim.limitations ?? []).map((limitation) => ({ limitationId: limitation.id, text: limitation.textByLocale?.[card.locale?.primary] }));
    add(sameValue(sidecar.claimBinding?.visibleLimitations ?? [], expectedLimitations), "social sidecar visible limitations drift from the claim record");
    add(sameValue((sidecar.evidenceBindings ?? []).map((entry) => entry.evidenceRef).sort(), [...(claim.evidenceRefs ?? [])].sort()), "social sidecar evidence bindings do not exactly cover claim evidence");
    add((sidecar.evidenceBindings ?? []).every((entry) => entry.claimId === claim.claimId), "social sidecar evidence binding claim identity drifts");
  }
  const action = (card.actions ?? []).find((entry) => entry.id === sidecar.actionBinding?.actionId);
  add(Boolean(action) && action.availability === "available", "social sidecar action does not resolve to an available Build Card action");
  add(Boolean(action) && action.id === card.experience?.primaryActionRef && action.priority === "primary", "social sidecar action must equal the Build Card primaryActionRef and carry primary priority");
  if (action) {
    add(sidecar.actionBinding?.availability === action.availability, "social sidecar action availability drifts from Build Card");
    add(sidecar.actionBinding?.label === action.labelByLocale?.[card.locale?.primary] && sidecar.actionBinding?.outcome === action.outcomeByLocale?.[card.locale?.primary], "social sidecar action label or outcome drifts from Build Card");
    add(sidecar.actionBinding?.destinationKind === action.destinationBinding?.kind && sidecar.actionBinding?.destination === action.destinationBinding?.targetByLocale?.[card.locale?.primary], "social sidecar action destination drifts from Build Card");
    add(sidecar.actionBinding?.presentation?.mode === "static_equivalent" && sidecar.actionBinding?.presentation?.technique === "destination_cue", "social sidecar action must use a truthful static destination cue");
  }
  errors.push(...socialDestinationCueErrors(sidecar.actionBinding));
  const destinationVerification = sidecar.actionBinding?.destinationVerification ?? {};
  const destinationVerificationMethodByKind = {
    route: "route_resolution",
    external: "http_head_or_get",
    download: "download_probe",
    form: "form_probe",
    contact: "contact_path_review"
  };
  const destinationObservedAt = Date.parse(destinationVerification.observedAt ?? "");
  const destinationTtlMs = Number(destinationVerification.freshnessTtlSeconds) * 1000;
  add(destinationVerification.method === destinationVerificationMethodByKind[sidecar.actionBinding?.destinationKind], "social destination verification method does not match the governed destination kind");
  add(destinationVerification.status === "passed" && destinationVerification.observedDestination === sidecar.actionBinding?.destination, "social destination verification did not successfully resolve the governed destination");
  add(Number.isFinite(destinationObservedAt) && Number.isFinite(destinationTtlMs) && destinationTtlMs > 0 && destinationObservedAt <= promotionCheckedAt && promotionCheckedAt - destinationObservedAt <= destinationTtlMs, "social destination verification is stale at promotion");
  const destinationEvidencePath = bundleFilePath(verificationRoot, destinationVerification.evidenceRef);
  add(Boolean(destinationEvidencePath), "social destination verification evidence does not resolve inside the artifact bundle");
  let destinationEvidence = null;
  if (destinationEvidencePath) {
    add(sha256File(destinationEvidencePath) === destinationVerification.evidenceSha256, "social destination verification evidence hash mismatch");
    try { destinationEvidence = JSON.parse(readFileSync(destinationEvidencePath, "utf8")); } catch { destinationEvidence = null; }
  }
  add(isObject(destinationEvidence), "social destination verification evidence is not valid JSON");
  if (isObject(destinationEvidence)) {
    add(destinationEvidence.kind === "social_destination_verification" && destinationEvidence.result === "pass", "social destination evidence is not a successful verification record");
    add(destinationEvidence.method === destinationVerification.method && destinationEvidence.requestedDestination === sidecar.actionBinding?.destination && destinationEvidence.observedDestination === destinationVerification.observedDestination && destinationEvidence.observedAt === destinationVerification.observedAt, "social destination evidence subject, method, destination, or time drifts");
    if (destinationVerification.method === "http_head_or_get") add(Number.isInteger(destinationEvidence.httpStatus) && destinationEvidence.httpStatus >= 200 && destinationEvidence.httpStatus < 400, "social destination HTTP verification was not successful");
  }
  const rightsPath = bundleFilePath(verificationRoot, sidecar.rights?.rightsSourceRef);
  add(Boolean(rightsPath) && sha256File(rightsPath) === sidecar.rights?.rightsSourceSha256, "social sidecar rights source binding is invalid");
  add(sidecar.rights?.publicationPermission === true && (sidecar.rights?.allowedLocales ?? []).includes(card.locale?.primary) && (sidecar.rights?.allowedChannels ?? []).includes(sidecar.campaign?.channel), "social sidecar rights do not authorize the declared locale and channel");
  add(timestampWithinWindow(manifest.artifact?.builtAt, sidecar.rights?.validFrom, sidecar.rights?.expiresAt), "social artifact builtAt is outside the rights validity window");
  add(timestampWithinWindow(sidecar.promotionCheckedAt, sidecar.rights?.validFrom, sidecar.rights?.expiresAt), "social promotion check is outside the rights validity window");
  const productionVerified = manifest.validation?.conformanceLevel === "production_verified";
  const declaredProductionTimes = [
    ...(manifest.validation?.resolvedTestResults ?? []).filter((entry) => entry.method === "production").map((entry) => entry.checkedAt),
    ...(manifest.validation?.gateResults ?? []).filter((entry) => entry.method === "production").map((entry) => entry.checkedAt)
  ];
  if (productionVerified) {
    add(isNonEmpty(sidecar.productionObservedAt) && declaredProductionTimes.includes(sidecar.productionObservedAt), "production-verified social sidecar lacks an evidence-bound productionObservedAt");
    add(Number.isFinite(Date.parse(sidecar.productionObservedAt ?? "")) && Date.parse(sidecar.productionObservedAt) >= promotionCheckedAt, "social production observation predates the promotion boundary");
    add(timestampWithinWindow(sidecar.productionObservedAt, sidecar.campaign?.startsAt, sidecar.campaign?.expiresAt), "social production observedAt is outside the campaign window");
    add(timestampWithinWindow(sidecar.productionObservedAt, sidecar.rights?.validFrom, sidecar.rights?.expiresAt), "social production observedAt is outside the rights validity window");
    const productionObservedAt = Date.parse(sidecar.productionObservedAt ?? "");
    add(Number.isFinite(destinationObservedAt) && Number.isFinite(destinationTtlMs) && destinationTtlMs > 0 && destinationObservedAt <= productionObservedAt && productionObservedAt - destinationObservedAt <= destinationTtlMs, "social destination verification is stale at production");
  } else {
    add(sidecar.productionObservedAt === null, "social sidecar must keep productionObservedAt null until production verification");
  }
  const visibleProjection = socialVisibleCopyProjection(sidecar);
  const visibleProjectionSha256 = sha256Bytes(canonicalJson(visibleProjection));
  add(sidecar.outputClarity?.visibleCopySha256 === visibleProjectionSha256 && sidecar.visibleCopyInspection?.normalizedProjectionSha256 === visibleProjectionSha256, "social visible-copy projection hash does not match the governed normalized projection");
  const visibleInspection = sidecar.visibleCopyInspection ?? {};
  add(visibleInspection.subjectPath === sidecar.artifact?.creativePath && visibleInspection.subjectSha256 === sidecar.artifact?.creativeSha256, "social visible-copy inspection subject drifts from the exact creative bytes");
  const inspectedAt = Date.parse(visibleInspection.inspectedAt ?? "");
  add(Number.isFinite(inspectedAt) && builtAt <= inspectedAt && inspectedAt <= promotionCheckedAt, "social visible-copy inspection is outside the build-to-promotion interval");
  const manifestInspection = (manifest.delivery?.contentInspections ?? []).find((inspection) => inspection.subjectPath === sidecar.artifact?.creativePath);
  if (promoted) {
    add(Boolean(manifestInspection), "promoted social creative lacks a hash-bound OCR and visual-review content inspection");
    if (manifestInspection) add(manifestInspection.subjectSha256 === sidecar.artifact?.creativeSha256 && manifestInspection.method === "ocr_visual_review" && manifestInspection.result === "pass" && manifestInspection.inspectedAt === visibleInspection.inspectedAt, "promoted social creative content inspection subject, method, result, or time drifts from the publication sidecar");
  }
  const visibleEvidencePath = bundleFilePath(verificationRoot, visibleInspection.evidenceRef);
  add(Boolean(visibleEvidencePath), "social visible-copy inspection evidence does not resolve inside the artifact bundle");
  let visibleEvidence = null;
  if (visibleEvidencePath) {
    add(sha256File(visibleEvidencePath) === visibleInspection.evidenceSha256, "social visible-copy inspection evidence hash mismatch");
    try { visibleEvidence = JSON.parse(readFileSync(visibleEvidencePath, "utf8")); } catch { visibleEvidence = null; }
  }
  add(isObject(visibleEvidence), "social visible-copy inspection evidence is not valid JSON");
  if (isObject(visibleEvidence)) {
    add(visibleEvidence.kind === "social_visible_copy_inspection" && visibleEvidence.method === "ocr_plus_visual_review" && visibleEvidence.result === "pass" && visibleEvidence.ocrPerformed === true && visibleEvidence.visualReviewPerformed === true, "social visible-copy evidence lacks a passing OCR plus visual review");
    add(visibleEvidence.subjectPath === sidecar.artifact?.creativePath && visibleEvidence.subjectSha256 === sidecar.artifact?.creativeSha256 && visibleEvidence.inspectedAt === visibleInspection.inspectedAt, "social visible-copy evidence subject or time drifts from the sidecar");
    add(visibleEvidence.normalizationAlgorithm === "unicode_nfc_trim_collapse_whitespace_v1" && visibleEvidence.normalizedProjectionSha256 === visibleProjectionSha256, "social visible-copy evidence normalization or projection hash drifts");
    add(sameValue(visibleEvidence.normalizedOcrProjection?.claim?.text, visibleProjection.claim.text), "social visible-copy OCR claim text differs from the governed projection");
    add(sameValue(visibleEvidence.normalizedOcrProjection?.claim?.limitations, visibleProjection.claim.limitations), "social visible-copy OCR projection omits or changes a material limitation");
    add(sameValue(visibleEvidence.normalizedOcrProjection?.evidenceCues, visibleProjection.evidenceCues), "social visible-copy OCR evidence cues differ from the governed projection");
    add(sameValue(visibleEvidence.normalizedOcrProjection?.action?.label, visibleProjection.action.label) && sameValue(visibleEvidence.normalizedOcrProjection?.action?.outcome, visibleProjection.action.outcome), "social visible-copy OCR action label or outcome differs from the governed projection");
    add(sameValue(visibleEvidence.normalizedOcrProjection?.action?.destinationCue, visibleProjection.action.destinationCue), "social visible-copy OCR destination cue differs from the governed projection");
    add(sameValue(visibleEvidence.normalizedOcrProjection, visibleProjection) && sameValue(visibleEvidence.visualReviewProjection, visibleProjection), "social OCR and visual-review projections do not exactly equal the governed visible copy");
    add(Array.isArray(visibleEvidence.unclassifiedVisibleText) && visibleEvidence.unclassifiedVisibleText.length === 0 && Array.isArray(visibleEvidence.extraClaimTexts) && visibleEvidence.extraClaimTexts.length === 0, "social creative contains unclassified visible text or an extra visible overclaim");
  }
  const audienceProjection = socialSidecarAudienceProjection(sidecar);
  add(sidecar.outputClarity?.audienceTextSha256 === sha256Bytes(canonicalJson(audienceProjection)), "social sidecar audience text hash does not match its resolved visible projection");
  const residue = workflowResidueHits(audienceProjection, "$/socialSidecarAudience");
  add(residue.length === 0, `social sidecar audience fields contain workflow residue at ${residue.join(", ")}`);
  return errors;
}

function expectedAccessibilityProjectionSummary(card) {
  const contract = formatPacks?.accessibilityProjectionContract;
  const profile = contract?.variants?.[conformanceVariantKey(card)];
  if (!contract || !profile) return null;
  const imageTrigger = contract.contentAlternativeTriggers?.images ?? {};
  const dataTrigger = contract.contentAlternativeTriggers?.data ?? {};
  const imageRequired = (card.assets ?? []).some((asset) => (imageTrigger.assetRoles ?? []).includes(asset.role));
  const dataRequired = (card.capabilities ?? []).some((capability) => (dataTrigger.capabilities ?? []).includes(capability));
  const motionRequired = (card.capabilities ?? []).includes("motion");
  const motionContract = motionRequired ? profile.motionWithCapability : contract.motionWithoutCapability;
  if (!motionContract) return null;
  return {
    readingOrder: (card.composition?.sections ?? []).map((section) => section.id),
    semanticStructure: structuredClone(profile.semanticStructure),
    alternatives: {
      images: imageRequired ? imageTrigger.whenPresent : imageTrigger.whenAbsent,
      data: dataRequired ? dataTrigger.whenPresent : dataTrigger.whenAbsent,
      motion: motionContract.alternative
    },
    interaction: structuredClone(profile.interaction),
    contrast: structuredClone(contract.contrast),
    textLayout: structuredClone(profile.textLayout),
    motion: {
      reducedMotion: motionContract.reducedMotion,
      observerFailure: motionContract.observerFailure
    }
  };
}

function accessibilitySummaryErrors(projection, card) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const expected = expectedAccessibilityProjectionSummary(card);
  add(Boolean(expected), `accessibility projection has no governed summary for format/capability combination ${card.output?.formatProfile ?? "unknown"}`);
  if (!expected) return errors;
  add(sameValue(projection.readingOrder, expected.readingOrder), "accessibility reading order must exactly equal the composed section order");
  add(sameValue(projection.semanticStructure, expected.semanticStructure), "accessibility semantic-structure summary drifts from the governed format profile");
  add(sameValue(projection.alternatives, expected.alternatives), "accessibility alternatives summary drifts from governed asset and capability triggers");
  add(sameValue(projection.interaction, expected.interaction), "accessibility interaction summary drifts from the governed format profile");
  add(sameValue(projection.contrast, expected.contrast), "accessibility contrast summary drifts from the governed format profile");
  add(sameValue(projection.textLayout, expected.textLayout), "accessibility text-layout summary drifts from the governed format profile");
  add(sameValue(projection.motion, expected.motion), "accessibility motion summary drifts from the governed format and motion capability");
  return errors;
}

function accessibilityProjectionErrors(manifest, card, verificationRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const projection = manifest.delivery?.accessibilityProjection ?? {};
  add(projection.status === "verified", "artifact QA requires a verified accessibility projection");
  if (projection.status !== "verified") return errors;
  add(projection.formatProfile === card.output?.formatProfile && projection.primaryLocale === card.locale?.primary, "accessibility projection format or primary locale drifts from Build Card");
  errors.push(...accessibilitySummaryErrors(projection, card));
  const presetBinding = manifest.delivery?.implementationBindings?.preset;
  const presetResolution = boundJson(presetBinding, verificationRoot, "accessibility format-implementation record binding", release.schemaIds?.formatImplementation, formatImplementationSchema);
  errors.push(...presetResolution.errors);
  const expectedFixtureIds = presetResolution.document?.requirements?.accessibilityFixtureIds ?? [];
  const reportPath = bundleFilePath(verificationRoot, projection.fixtureReportRef);
  add(Boolean(reportPath), "accessibility fixture report does not resolve inside the artifact bundle");
  if (reportPath) {
    add(sha256File(reportPath) === projection.fixtureReportSha256, "accessibility fixture report hash mismatch");
    let report = null;
    try { report = JSON.parse(readFileSync(reportPath, "utf8")); } catch { report = null; }
    add(isObject(report), "accessibility fixture report is not valid JSON");
    if (isObject(report)) {
      add(sameValue(report.fixtures, expectedFixtureIds), "accessibility fixture report fixtures must exactly equal the format-implementation record accessibilityFixtureIds");
      const fixtureResults = report.results ?? [];
      add(sameValue(fixtureResults.map((result) => result.fixtureId), expectedFixtureIds), "accessibility fixture report results must exactly cover every governed accessibility fixture");
      for (const fixtureResult of fixtureResults) {
        const resolvedResult = (manifest.validation?.resolvedTestResults ?? []).find((result) => result.testId === fixtureResult.fixtureId);
        add(fixtureResult.status === "passed" && Boolean(resolvedResult), `accessibility fixture ${fixtureResult.fixtureId ?? "unknown"} lacks a passing resolved test result`);
        if (resolvedResult) add(fixtureResult.evidenceRef === resolvedResult.evidenceRef && fixtureResult.evidenceSha256 === resolvedResult.evidenceSha256, `accessibility fixture ${fixtureResult.fixtureId} evidence drifts from its resolved test result`);
      }
      add(report.formatProfile === projection.formatProfile && report.primaryLocale === projection.primaryLocale, "accessibility fixture report format or primary locale drifts from projection");
      add(report.blockingFailureCount === projection.blockingFailureCount, "accessibility fixture report blockingFailureCount drifts from projection");
      const expectedSummary = expectedAccessibilityProjectionSummary(card);
      add(Boolean(expectedSummary) && sameValue(report.summary, expectedSummary), "accessibility fixture report summary drifts from governed format/capability projection");
    }
  }
  add(projection.blockingFailureCount === 0, "accessibility projection has blocking failures");
  return errors;
}

function resolvedTestMethod(testId) {
  if ((formatPacks.productionTestIds ?? []).includes(testId)) return "production";
  if (String(testId).startsWith("accessibility.")) return "accessibility";
  if (String(testId).startsWith("target.")) return "visual";
  return "manual";
}

function identityTypographyEntryForCard(card) {
  return identityTypographyBindingById.get(card?.identityImplementation?.typographyBindingId);
}

function expectedAuthoringPlatformForCard(card) {
  if (card?.output?.runtime === "browser") return "browser";
  return identityTypographyEntryForCard(card)?.binding?.platform ?? null;
}

function expectedNativeFontMappingIdsForCard(card) {
  const platform = expectedAuthoringPlatformForCard(card);
  if (!platform || platform === "browser") return [];
  const ids = [];
  const add = (id) => { if (isNonEmpty(id) && !ids.includes(id)) ids.push(id); };
  add(card?.identityImplementation?.nativeMappingId);
  for (const asset of card?.assets ?? []) {
    if (asset.role !== "text_font" || !isNonEmpty(asset.fontRole)) continue;
    const mapping = [...nativeFontMappingById.values()].find((entry) => entry.platform === platform && entry.role === asset.fontRole && (entry.allowedFormatProfiles ?? []).includes(card.output?.formatProfile));
    add(mapping?.id);
  }
  return ids;
}

function expectedPortabilityFixtureIdsForCard(card) {
  const platform = expectedAuthoringPlatformForCard(card);
  if (!platform || platform === "browser") return [];
  const mappings = expectedNativeFontMappingIdsForCard(card).map((id) => nativeFontMappingById.get(id)).filter(Boolean);
  const binding = identityTypographyEntryForCard(card)?.binding;
  return orderedUniqueValues(
    ...mappings.map((mapping) => mapping.requiredFixtureIds),
    binding?.requiredFixtureIds,
    nonWebIconPortabilityFixtureIds
  );
}

function resolvedTestCriteria(card) {
  const criteria = new Map();
  const addIndexed = (prefix, matrix = []) => matrix.forEach((criterion, index) => criteria.set(`${prefix}.${String(index + 1).padStart(2, "0")}`, criterion));
  const pack = packByProfile.get(card.output?.formatProfile);
  const target = targetById.get(card.output?.targetProfileRef);
  const kit = kitById.get(pack?.kitRef);
  addIndexed("common", formatPacks.commonTestMatrix);
  addIndexed(`experience.${card.experience?.profile}`, formatPacks.experienceProfileTestMatrix?.[card.experience?.profile]);
  for (const profile of card.experience?.secondaryProfiles ?? []) addIndexed(`experience.${profile}`, formatPacks.experienceProfileTestMatrix?.[profile]);
  addIndexed(`format.${pack?.id}`, pack?.testMatrix);
  addIndexed(`format.${pack?.id}.runtime.${card.output?.runtime}`, pack?.testMatrixByRuntime?.[card.output?.runtime]);
  for (const capability of card.capabilities ?? []) {
    const overlay = overlayByCapability.get(capability);
    addIndexed(`capability.${overlay?.id}`, overlay?.testMatrix);
    if (capability === "motion") {
      const runtimeClass = motionRuntimeClass(card);
      addIndexed(`capability.${overlay?.id}.runtime.${runtimeClass}`, overlay?.testMatrixByRuntimeClass?.[runtimeClass]);
    }
  }
  for (const fixture of target?.requiredFixtures ?? []) criteria.set(`${target.id}.fixture.${fixture}`, target?.fixtureCriteria?.[fixture]);
  (kit?.requiredImplementationControls ?? []).forEach((control, index) => criteria.set(`${kit.id}.control.${String(index + 1).padStart(2, "0")}`, `The downstream implementation contains and verifies the required "${control}" control against the final artifact bytes.`));
  for (const fixtureId of accessibilityFixtureIds(card)) criteria.set(fixtureId, formatPacks.accessibilityFixtureCriteria?.[fixtureId]);
  for (const fixtureId of expectedPortabilityFixtureIdsForCard(card)) criteria.set(fixtureId, assetRegistry?.portabilityFixtureCriteria?.[fixtureId]);
  return criteria;
}

function resolvedTestResultErrors(manifest, card, verificationRoot = packageDir, includeProduction = false) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const resolvedIds = resolvedTests(card);
  const expectedIds = resolvedIds.filter((id) => includeProduction || !(formatPacks.productionTestIds ?? []).includes(id));
  const results = manifest.validation?.resolvedTestResults ?? [];
  const criteria = resolvedTestCriteria(card);
  const resultIds = results.map((result) => result.testId);
  add(unique(resultIds), "resolved test result IDs must be unique");
  add(unique(results.map((result) => result.evidenceRef)), "resolved test evidence refs must be unique per artifact build");
  add(sameValue(resultIds, expectedIds), `${includeProduction ? "production_verified" : "artifact_qa_passed"} resolved test results must exactly cover the tests required at this phase`);
  const builtAt = Date.parse(manifest.artifact?.builtAt ?? "");
  for (const result of results) {
    add(result.result === "pass", `resolved test ${result.testId ?? "unknown"} did not pass`);
    add(result.method === resolvedTestMethod(result.testId), `resolved test ${result.testId ?? "unknown"} method drifts from the governed test definition`);
    const criterion = criteria.get(result.testId);
    add(isNonEmpty(criterion), `resolved test ${result.testId ?? "unknown"} has no governed criterion`);
    if (isNonEmpty(criterion)) {
      add(result.criterion === criterion, `resolved test ${result.testId} criterion drifts from the active registries`);
      add(result.criterionSha256 === sha256Bytes(criterion), `resolved test ${result.testId} criterion hash mismatch`);
    }
    const checkedAt = Date.parse(result.checkedAt ?? "");
    add(Number.isFinite(checkedAt) && checkedAt >= builtAt, `resolved test ${result.testId ?? "unknown"} predates the artifact build`);
    const evidencePath = bundleFilePath(verificationRoot, result.evidenceRef);
    add(Boolean(evidencePath), `resolved test ${result.testId ?? "unknown"} evidence does not resolve inside the artifact bundle`);
    if (!evidencePath) continue;
    add(sha256File(evidencePath) === result.evidenceSha256, `resolved test ${result.testId ?? "unknown"} evidence hash mismatch`);
    let evidence = null;
    try { evidence = JSON.parse(readFileSync(evidencePath, "utf8")); } catch { evidence = null; }
    add(isObject(evidence), `resolved test ${result.testId ?? "unknown"} evidence is not valid JSON`);
    if (!isObject(evidence)) continue;
    add(evidence.testId === result.testId, `resolved test ${result.testId ?? "unknown"} evidence subject drifts`);
    add(evidence.artifactBuildId === manifest.artifact?.artifactBuildId, `resolved test ${result.testId ?? "unknown"} evidence artifact build drifts`);
    add(evidence.result === "pass" && evidence.method === result.method && evidence.observedAt === result.checkedAt && isNonEmpty(evidence.summary), `resolved test ${result.testId ?? "unknown"} evidence is not a criterion-bound pass record`);
    if (isNonEmpty(criterion)) add(evidence.criterion === criterion && evidence.criterionSha256 === sha256Bytes(criterion), `resolved test ${result.testId} evidence criterion drifts from the active registries`);
    if (result.method === "production") {
      const canonical = manifest.delivery?.metadataProjection?.canonicalUrl;
      const expectedContentSha256 = isNonEmpty(canonical) ? manifest.delivery?.primaryHtmlBinding?.sha256 : null;
      add(evidence.kind === "production_observation" && evidence.contentEquivalent === true, `resolved production test ${result.testId} lacks a production observation`);
      add(evidence.observedUrl === canonical && evidence.expectedCanonicalUrl === canonical && evidence.httpStatus >= 200 && evidence.httpStatus < 300, `resolved production test ${result.testId} canonical observation drifts`);
      add(isNonEmpty(expectedContentSha256) ? evidence.contentSha256 === expectedContentSha256 : (manifest.delivery?.files ?? []).some((file) => file.sha256 === evidence.contentSha256), `resolved production test ${result.testId} does not bind the primary delivered bytes`);
    }
  }
  return errors;
}

const directlyReadableAudienceMedia = /^(?:text\/|application\/(?:json|ld\+json|javascript|xml|xhtml\+xml)|image\/svg\+xml)/i;
const directlyReadableAudienceExtension = /\.(?:html?|css|js|mjs|json|jsonld|xml|svg|md|txt|csv)$/i;

function requiredAudienceInspectionMethod(file) {
  const mediaType = String(file?.mediaType ?? "").toLowerCase();
  const filename = String(file?.path ?? "").toLowerCase();
  if (directlyReadableAudienceMedia.test(mediaType) || directlyReadableAudienceExtension.test(filename)) return "direct_text_scan";
  if (mediaType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || filename.endsWith(".docx")) return "office_text_extraction";
  if (mediaType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || filename.endsWith(".pptx")) return "office_text_extraction";
  if (mediaType === "application/pdf" || filename.endsWith(".pdf")) return "pdf_text_extraction";
  if (/^image\/(?:png|jpeg|webp|gif|avif|tiff|bmp)$/i.test(mediaType) || /\.(?:png|jpe?g|webp|gif|avif|tiff?|bmp)$/i.test(filename)) return "ocr_visual_review";
  if (/^(?:audio|video)\//i.test(mediaType)) return "media_transcript_review";
  return "binary_content_review";
}

function requiredRenderedUnitKind(file) {
  const mediaType = String(file?.mediaType ?? "").toLowerCase();
  const filename = String(file?.path ?? "").toLowerCase();
  if (mediaType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || filename.endsWith(".pptx")) return "slide";
  if (mediaType === "application/pdf" || filename.endsWith(".pdf") || mediaType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || filename.endsWith(".docx")) return "page";
  return null;
}

function detectedRasterMediaType(path) {
  let bytes = null;
  try { bytes = readFileSync(path); } catch { return null; }
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "image/webp";
  return null;
}

function deterministicCombinedRenderedUnitText(unit) {
  return [
    `[text-extraction]\n${String(unit?.extractedText ?? "")}`,
    `[ocr]\n${String(unit?.ocrText ?? "")}`,
    `[visual-review]\n${String(unit?.visualReviewText ?? "")}`
  ].join("\n");
}

function audienceContentInspectionErrors(manifest, verificationRoot = packageDir, allowedFieldClasses = []) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const deliveredFiles = manifest.delivery?.files ?? [];
  const inspections = manifest.delivery?.contentInspections ?? [];
  const deliveredPaths = deliveredFiles.map((file) => file.path).sort();
  const inspectedPaths = inspections.map((inspection) => inspection.subjectPath).sort();
  add(unique(inspectedPaths), "audience content inspection subject paths must be unique");
  add(sameValue(inspectedPaths, deliveredPaths), "audience content inspections must exactly cover every delivered file");
  const builtAt = Date.parse(manifest.artifact?.builtAt ?? "");
  for (const inspection of inspections) {
    const label = `audience content inspection ${inspection.subjectPath ?? "unknown"}`;
    const delivered = deliveredFiles.find((file) => file.path === inspection.subjectPath);
    add(Boolean(delivered), `${label} does not identify a delivered file`);
    if (!delivered) continue;
    add(inspection.subjectSha256 === delivered.sha256 && inspection.subjectMediaType === delivered.mediaType, `${label} subject hash or media type drifts from delivery.files`);
    const requiredMethod = requiredAudienceInspectionMethod(delivered);
    add(inspection.method === requiredMethod, `${label} method must be ${requiredMethod}`);
    add(inspection.result === "pass", `${label} did not pass`);
    const inspectedAt = Date.parse(inspection.inspectedAt ?? "");
    add(Number.isFinite(inspectedAt) && inspectedAt >= builtAt, `${label} predates the artifact build`);
    const subjectPath = bundleFilePath(verificationRoot, delivered.path);
    add(Boolean(subjectPath), `${label} subject does not resolve inside the artifact bundle`);
    if (subjectPath) {
      add(sha256File(subjectPath) === delivered.sha256, `${label} subject hash does not match delivered bytes`);
    }
    const evidencePath = bundleFilePath(verificationRoot, inspection.evidenceRef);
    add(Boolean(evidencePath), `${label} evidence does not resolve inside the artifact bundle`);
    if (!evidencePath) continue;
    add(sha256File(evidencePath) === inspection.evidenceSha256, `${label} evidence hash mismatch`);
    let evidence = null;
    try { evidence = JSON.parse(readFileSync(evidencePath, "utf8")); } catch { evidence = null; }
    add(isObject(evidence), `${label} evidence is not valid JSON`);
    if (!isObject(evidence)) continue;
    add(evidence.kind === "audience_content_inspection" && evidence.result === "pass", `${label} evidence is not a passing audience-content inspection`);
    add(evidence.subjectPath === delivered.path && evidence.subjectSha256 === delivered.sha256 && evidence.subjectMediaType === delivered.mediaType, `${label} evidence subject identity drifts from delivered bytes`);
    add(evidence.method === requiredMethod && evidence.inspectedAt === inspection.inspectedAt, `${label} evidence method or time drifts from the manifest binding`);
    add(evidence.sourceByteCount === (subjectPath ? statSync(subjectPath).size : -1), `${label} evidence byte count drifts from delivered bytes`);
    add(evidence.extractionComplete === true && typeof evidence.visibleText === "string" && isNonEmpty(evidence.summary), `${label} evidence lacks a complete visible-text/content inspection record`);
    if (requiredMethod === "direct_text_scan" && subjectPath) {
      let directText = null;
      try { directText = readFileSync(subjectPath, "utf8"); } catch { directText = null; }
      add(directText !== null && evidence.visibleText === directText, `${label} direct-text evidence does not equal the delivered bytes`);
    }
    if (["office_text_extraction", "pdf_text_extraction"].includes(requiredMethod)) {
      const requiredUnitKind = requiredRenderedUnitKind(delivered);
      add(inspection.renderedUnitKind === requiredUnitKind && Number.isInteger(inspection.renderedUnitCount) && inspection.renderedUnitCount > 0, `${label} lacks the governed rendered page/slide count`);
      add(inspection.renderedUnitCoverage === "every_page_or_slide" && inspection.combinedReviewMethod === "text_extraction_plus_ocr_plus_visual_review" && inspection.imageOnlyOrOutlinedTextReviewed === true, `${label} manifest does not require complete rendered-unit extraction, OCR, visual review, and image-only/outlined-text review`);
      add(evidence.textExtractionPerformed === true && evidence.ocrPerformed === true && evidence.visualReviewPerformed === true && evidence.imageOnlyOrOutlinedTextReviewed === true, `${label} lacks required combined extraction, OCR, visual-review, and image-only/outlined-text evidence`);
      add(evidence.renderedUnitKind === requiredUnitKind && evidence.sourceUnitCount === inspection.renderedUnitCount && evidence.renderedUnitCount === inspection.renderedUnitCount, `${label} rendered page/slide coverage drifts from the manifest count`);
      add(evidence.renderedUnitCoverage === "every_page_or_slide" && evidence.combinedReviewMethod === "text_extraction_plus_ocr_plus_visual_review", `${label} evidence does not declare the governed complete rendered-unit review protocol`);
      const renderedUnits = Array.isArray(evidence.renderedUnits) ? evidence.renderedUnits : [];
      add(Array.isArray(evidence.renderedUnits) && renderedUnits.length === inspection.renderedUnitCount, `${label} rendered-unit evidence does not cover every page or slide`);
      add(renderedUnits.every(isObject) && unique(renderedUnits.map((unit) => unit?.index)) && sameValue(renderedUnits.map((unit) => unit?.index).sort((a, b) => a - b), Array.from({ length: inspection.renderedUnitCount ?? 0 }, (_value, index) => index + 1)), `${label} rendered-unit indices must exactly cover 1..renderedUnitCount`);
      add(unique(renderedUnits.filter(isObject).map((unit) => unit.renderRef)), `${label} rendered-image refs must be unique per page or slide`);
      for (const unit of renderedUnits) {
        if (!isObject(unit)) {
          add(false, `${label} rendered-unit evidence entries must be objects`);
          continue;
        }
        const unitLabel = `${label} ${requiredUnitKind ?? "unit"} ${unit.index ?? "unknown"}`;
        add(unit.textExtractionPerformed === true && unit.ocrPerformed === true && unit.visualReviewPerformed === true && unit.imageOnlyOrOutlinedTextReviewed === true, `${unitLabel} lacks extraction, OCR, visual review, or image-only/outlined-text review`);
        add(typeof unit.extractedText === "string" && typeof unit.ocrText === "string" && typeof unit.visualReviewText === "string" && typeof unit.combinedVisibleText === "string", `${unitLabel} lacks deterministic extracted/OCR/visual/combined text fields`);
        add(unit.combinedVisibleText === deterministicCombinedRenderedUnitText(unit), `${unitLabel} combined visible text must equal the deterministic channel-labelled extraction/OCR/visual merge`);
        add(/^[a-f0-9]{64}$/.test(unit.renderSha256 ?? "") && /^image\/(?:png|jpeg|webp)$/i.test(unit.renderMediaType ?? ""), `${unitLabel} lacks a hash-bound rendered image`);
        const renderPath = bundleFilePath(verificationRoot, unit.renderRef);
        add(Boolean(renderPath), `${unitLabel} render does not resolve inside the artifact bundle`);
        if (renderPath) {
          add(sha256File(renderPath) === unit.renderSha256, `${unitLabel} rendered-image hash mismatch`);
          add(detectedRasterMediaType(renderPath) === unit.renderMediaType, `${unitLabel} rendered-image media type does not match its bytes`);
        }
      }
      const combinedVisibleText = renderedUnits.map((unit) => unit.combinedVisibleText ?? "").join("\n\f\n");
      add(evidence.visibleText === combinedVisibleText, `${label} visibleText must equal the deterministic combined rendered-unit text`);
      add(inspection.combinedVisibleTextSha256 === sha256Bytes(combinedVisibleText), `${label} combined visible-text hash mismatch`);
    }
    if (requiredMethod === "ocr_visual_review") {
      add(evidence.ocrPerformed === true && evidence.visualReviewPerformed === true, `${label} lacks required OCR and visual-review evidence`);
    }
    if (requiredMethod === "media_transcript_review") {
      add(evidence.transcriptReviewPerformed === true, `${label} lacks required transcript-review evidence`);
    }
    if (requiredMethod === "binary_content_review") {
      add(evidence.visualReviewPerformed === true, `${label} lacks required binary-content review evidence`);
    }
    const hits = workflowResidueHits(evidence.visibleText, `$/delivery/contentInspections/${inspection.subjectPath}/visibleText`, { allowedFieldClasses });
    if (hits.length) errors.push(`delivered audience content inspection contains workflow residue at ${hits.join(", ")}`);
  }
  return errors;
}

function decodeHtmlEntities(value) {
  return String(value ?? "")
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_match, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function normalizedAudienceText(value) {
  return decodeHtmlEntities(String(value ?? "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function htmlAttributes(tag) {
  const attributes = {};
  const body = String(tag).replace(/^<\s*\/?\s*[^\s/>]+/, "").replace(/\/?>\s*$/, "");
  for (const match of body.matchAll(/([^\s=<>\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attributes[String(match[1]).toLowerCase()] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

const htmlVoidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

function sortedCanonical(values) {
  return [...values].sort((left, right) => canonicalJson(left).localeCompare(canonicalJson(right)));
}

function htmlSurfaceProjection(html, { noscriptVisible = false } = {}) {
  let source = String(html ?? "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, " ")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template\s*>/gi, " ");
  source = noscriptVisible
    ? source.replace(/<\/?noscript\b[^>]*>/gi, " ")
    : source.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript\s*>/gi, " ");
  const stack = [];
  const visibleTextParts = [];
  const projection = { h1Texts: [], primaryAnswers: [], links: [], navLinks: [], actions: [], claims: [], evidenceLinks: [], localeLinks: [], visibleIds: [] };
  const isHidden = (tag, attrs, parentHidden) => {
    const style = String(attrs.style ?? "").toLowerCase();
    const className = String(attrs.class ?? "").toLowerCase();
    return parentHidden || Object.hasOwn(attrs, "hidden") || Object.hasOwn(attrs, "inert") || String(attrs["aria-hidden"] ?? "").toLowerCase() === "true"
      || (tag === "dialog" && !Object.hasOwn(attrs, "open")) || (tag === "details" && !Object.hasOwn(attrs, "open")) || Object.hasOwn(attrs, "popover")
      || String(attrs.type ?? "").toLowerCase() === "hidden"
      || /(?:^|;)\s*display\s*:\s*none(?:\s*!important)?\s*(?:;|$)/i.test(style)
      || /(?:^|;)\s*visibility\s*:\s*(?:hidden|collapse)(?:\s*!important)?\s*(?:;|$)/i.test(style)
      || /(?:^|;)\s*content-visibility\s*:\s*hidden(?:\s*!important)?\s*(?:;|$)/i.test(style)
      || /(?:^|;)\s*opacity\s*:\s*0(?:\.0+)?(?:\s*!important)?\s*(?:;|$)/i.test(style)
      || /(?:^|;)\s*(?:font-size\s*:\s*0(?:px|rem|em|%)?|color\s*:\s*transparent|text-indent\s*:\s*-\d{3,}(?:px|rem|em))(?:\s*!important)?\s*(?:;|$)/i.test(style)
      || /(?:^|;)\s*(?:clip-path\s*:\s*inset\s*\(\s*(?:100%|50%)\s*\)|transform\s*:\s*scale\s*\(\s*0(?:\.0+)?\s*\))(?:\s*!important)?\s*(?:;|$)/i.test(style)
      || /(?:^|\s)(?:hidden|is-hidden|visually-hidden|sr-only)(?:\s|$)/i.test(className);
  };
  const closeFrame = (frame) => {
    if (!frame || frame.hidden) return;
    const text = normalizedAudienceText(frame.textParts.join(" "));
    if (frame.tag === "h1") projection.h1Texts.push(text);
    if (Object.hasOwn(frame.attrs, "data-primary-answer")) projection.primaryAnswers.push(text);
    const href = frame.attrs.href;
    if (frame.tag === "a" && isNonEmpty(href)) {
      const link = { target: href, label: text, hreflang: frame.attrs.hreflang ?? null };
      projection.links.push(link);
      if (frame.inNav) projection.navLinks.push({ target: href, label: text });
      if (isNonEmpty(frame.attrs.hreflang)) projection.localeLinks.push({ locale: frame.attrs.hreflang, url: href });
      if (isNonEmpty(frame.attrs["data-evidence-for"])) projection.evidenceLinks.push({ claimId: frame.attrs["data-evidence-for"], ref: href });
    }
    if (isNonEmpty(frame.attrs["data-action-id"])) {
      projection.actions.push({ actionId: frame.attrs["data-action-id"], target: frame.attrs.href ?? frame.attrs["data-destination"] ?? null, label: text });
    }
    if (isNonEmpty(frame.attrs["data-claim-id"])) {
      for (const claimId of frame.attrs["data-claim-id"].split(/[\s,]+/).filter(Boolean)) projection.claims.push({ claimId, text });
    }
  };
  for (const token of source.match(/<\/?[A-Za-z][^>]*>|[^<]+/g) ?? []) {
    if (!token.startsWith("<")) {
      const frame = stack.at(-1);
      if (!frame?.hidden) visibleTextParts.push(token);
      for (const open of stack) if (!open.hidden) open.textParts.push(token);
      continue;
    }
    const closing = /^<\s*\//.test(token);
    const tag = token.match(/^<\s*\/?\s*([A-Za-z0-9:-]+)/)?.[1]?.toLowerCase();
    if (!tag) continue;
    if (closing) {
      let index = stack.length - 1;
      while (index >= 0 && stack[index].tag !== tag) index -= 1;
      if (index < 0) continue;
      while (stack.length > index) closeFrame(stack.pop());
      continue;
    }
    const attrs = htmlAttributes(token);
    const parent = stack.at(-1);
    const frame = { tag, attrs, hidden: isHidden(tag, attrs, parent?.hidden === true), inNav: tag === "nav" || parent?.inNav === true, textParts: [] };
    if (!frame.hidden && isNonEmpty(attrs.id)) projection.visibleIds.push(attrs.id);
    const selfClosing = /\/\s*>$/.test(token) || htmlVoidElements.has(tag);
    if (selfClosing) closeFrame(frame);
    else stack.push(frame);
  }
  while (stack.length) closeFrame(stack.pop());
  projection.visibleText = normalizedAudienceText(visibleTextParts.join(" "));
  return projection;
}

function webSurfaceContractErrors(html, expected, label, options = {}) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(`${label} ${message}`); };
  const projection = htmlSurfaceProjection(html, options);
  add(projection.h1Texts.length === 1 && projection.h1Texts[0] === expected.primaryHeading, "must expose exactly one visible governed H1");
  add(projection.primaryAnswers.length === 1 && projection.primaryAnswers[0] === expected.primaryAnswer, "must expose exactly one visible data-primary-answer whose text equals governed truth");
  add(sameValue(sortedCanonical(projection.navLinks), sortedCanonical(expected.navigation)), "visible navigation destinations or labels drift from the Build Card");
  add(unique(projection.actions.map((entry) => entry.actionId)) && sameValue(sortedCanonical(projection.actions), sortedCanonical(expected.actions)), "visible action IDs, labels, or destinations drift from the Build Card");
  add(unique(projection.claims.map((entry) => entry.claimId)) && sameValue(projection.claims.map((entry) => entry.claimId).sort(), expected.claims.map((entry) => entry.claimId).sort()), "visible data-claim-id coverage drifts from projected claims");
  for (const claim of expected.claims) {
    const visible = projection.claims.find((entry) => entry.claimId === claim.claimId);
    const exactText = normalizedAudienceText([claim.text, ...claim.limitations].join(" "));
    add(Boolean(visible) && visible.text === exactText, `visible claim ${claim.claimId} must equal governed text and material limitations exactly`);
  }
  add(sameValue(sortedCanonical(projection.evidenceLinks), sortedCanonical(expected.evidenceLinks)), "visible claim evidence links drift from governed evidence refs");
  add(sameValue(sortedCanonical(projection.localeLinks), sortedCanonical(expected.localeLinks)), "visible internal locale links drift from governed locale routes");
  const allowedTargets = new Set([...expected.navigation.map((entry) => entry.target), ...expected.actions.map((entry) => entry.target), ...expected.evidenceLinks.map((entry) => entry.ref), ...expected.localeLinks.map((entry) => entry.url)]);
  for (const link of projection.links) add(allowedTargets.has(link.target), `contains an ungoverned visible destination ${link.target}`);
  for (const target of [...expected.navigation.map((entry) => entry.target), ...expected.actions.map((entry) => entry.target)].filter((entry) => String(entry).startsWith("#"))) add(projection.visibleIds.includes(String(target).slice(1)), `anchor destination ${target} does not resolve to a visible element`);
  return { errors, projection };
}

function expectedWebSurfaceContract(manifest, card, verificationRoot) {
  const resolution = projectedClaimRecords(manifest, card, verificationRoot);
  const primaryLocale = card.locale?.primary;
  const claims = resolution.items.filter(({ record }) => Boolean(record)).map(({ claimId, record }) => ({
    claimId,
    text: record.textByLocale?.[primaryLocale],
    limitations: (record.limitations ?? []).map((limitation) => limitation.textByLocale?.[primaryLocale]),
    evidenceRefs: record.evidenceRefs ?? []
  }));
  return {
    errors: resolution.errors,
    primaryHeading: card.publication?.discovery?.primaryHeadingByLocale?.[primaryLocale],
    primaryAnswer: card.publication?.discovery?.primaryAnswerByLocale?.[primaryLocale],
    navigation: (card.navigation?.destinations ?? []).map((entry) => ({ target: entry.target, label: entry.labelByLocale?.[primaryLocale] ?? entry.label })),
    actions: (card.actions ?? []).filter((entry) => ["available", "requires_permission"].includes(entry.availability)).map((entry) => ({
      actionId: entry.id,
      target: entry.destinationBinding?.targetByLocale?.[primaryLocale] ?? entry.destinationBinding?.target,
      label: entry.labelByLocale?.[primaryLocale] ?? entry.label
    })),
    claims,
    evidenceLinks: claims.flatMap((claim) => claim.evidenceRefs.map((ref) => ({ claimId: claim.claimId, ref }))),
    localeLinks: (card.publication?.discovery?.localeRoutes ?? []).map((route) => ({ locale: route.locale, url: route.url }))
  };
}

function boundEvidenceBytes(binding, verificationRoot, label, expectedMediaType = null) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(`${label} ${message}`); };
  add(isObject(binding), "binding is missing");
  if (!isObject(binding)) return { errors, path: null, bytes: null };
  if (expectedMediaType) add(binding.mediaType === expectedMediaType, `mediaType must be ${expectedMediaType}`);
  const path = bundleFilePath(verificationRoot, binding.ref);
  add(Boolean(path), "does not resolve inside the artifact bundle");
  if (!path) return { errors, path: null, bytes: null };
  add(sha256File(path) === binding.sha256, "hash does not match evidence bytes");
  let bytes = null;
  try { bytes = readFileSync(path, "utf8"); } catch { bytes = null; }
  add(bytes !== null, "is not readable");
  return { errors, path, bytes };
}

function webDiscoveryEvidenceErrors(manifest, card, verificationRoot, expected) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const evidence = manifest.delivery?.webDiscoveryEvidence;
  const primary = manifest.delivery?.primaryHtmlBinding;
  add(isObject(evidence), "web artifact requires hash-bound no-script, hydrated-DOM, accessibility-tree, and sitemap evidence");
  if (!isObject(evidence)) return errors;
  add(evidence.artifactBuildId === manifest.artifact?.artifactBuildId, "web discovery evidence artifactBuildId drifts from the artifact");
  add(evidence.primaryHtmlPath === primary?.path && evidence.primaryHtmlSha256 === primary?.sha256, "web discovery evidence does not bind the primary initial HTML bytes");
  const observedAt = Date.parse(evidence.observedAt ?? "");
  add(Number.isFinite(observedAt) && observedAt >= Date.parse(manifest.artifact?.builtAt ?? ""), "web discovery evidence predates the artifact build");
  const noScript = boundEvidenceBytes(evidence.noScript, verificationRoot, "no-script snapshot", "text/html");
  const hydrated = boundEvidenceBytes(evidence.hydratedDom, verificationRoot, "hydrated-DOM snapshot", "text/html");
  const accessibility = boundEvidenceBytes(evidence.accessibilityTree, verificationRoot, "accessibility-tree snapshot", "application/json");
  const internalLocaleLinks = boundEvidenceBytes(evidence.internalLocaleLinks, verificationRoot, "internal-locale-link snapshot", "application/json");
  errors.push(...noScript.errors, ...hydrated.errors, ...accessibility.errors, ...internalLocaleLinks.errors);
  if (noScript.bytes !== null) errors.push(...webSurfaceContractErrors(noScript.bytes, expected, "no-script snapshot", { noscriptVisible: true }).errors);
  if (hydrated.bytes !== null) errors.push(...webSurfaceContractErrors(hydrated.bytes, expected, "hydrated-DOM snapshot", { noscriptVisible: false }).errors);
  if (accessibility.bytes !== null) {
    let report = null;
    try { report = JSON.parse(accessibility.bytes); } catch { report = null; }
    add(isObject(report), "accessibility-tree snapshot is not valid JSON");
    if (isObject(report)) {
      const expectedReport = {
        kind: "accessibility_tree_snapshot",
        artifactBuildId: manifest.artifact?.artifactBuildId,
        primaryHtmlSha256: primary?.sha256,
        observedAt: evidence.observedAt,
        rootRole: "document",
        primaryHeading: expected.primaryHeading,
        primaryAnswer: expected.primaryAnswer,
        navigation: expected.navigation,
        actions: expected.actions,
        claims: expected.claims,
        evidenceLinks: expected.evidenceLinks,
        localeLinks: expected.localeLinks
      };
      add(sameValue(report, expectedReport), "accessibility-tree snapshot does not exactly preserve governed visible meaning and destinations");
    }
  }
  if (internalLocaleLinks.bytes !== null) {
    let report = null;
    try { report = JSON.parse(internalLocaleLinks.bytes); } catch { report = null; }
    add(isObject(report), "internal-locale-link snapshot is not valid JSON");
    if (isObject(report)) {
      const expectedReport = {
        kind: "internal_locale_link_snapshot",
        artifactBuildId: manifest.artifact?.artifactBuildId,
        primaryHtmlSha256: primary?.sha256,
        observedAt: evidence.observedAt,
        links: expected.localeLinks
      };
      add(sameValue(report, expectedReport), "internal-locale-link snapshot does not exactly preserve governed locale destinations");
    }
  }
  const sitemapIncluded = card.publication?.discovery?.sitemap?.included === true;
  if (!sitemapIncluded) add(evidence.sitemap === null, "non-included sitemap must have a null evidence binding");
  else {
    const sitemap = boundEvidenceBytes(evidence.sitemap, verificationRoot, "sitemap evidence");
    errors.push(...sitemap.errors);
    if (isObject(evidence.sitemap)) add(["application/xml", "text/xml"].includes(evidence.sitemap.mediaType), "sitemap evidence mediaType must be XML");
    const delivered = (manifest.delivery?.files ?? []).find((file) => file.path === evidence.sitemap?.ref);
    add(Boolean(delivered) && delivered.sha256 === evidence.sitemap?.sha256 && delivered.mediaType === evidence.sitemap?.mediaType, "included sitemap must be an exact delivered file");
    if (sitemap.bytes !== null) {
      const locs = [...sitemap.bytes.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc\s*>/gi)].map((match) => normalizedAudienceText(match[1]));
      const expectedLocs = (card.publication?.discovery?.localeRoutes ?? []).map((route) => route.url);
      add(unique(locs) && sameValue([...locs].sort(), [...expectedLocs].sort()), "sitemap loc set must exactly equal governed locale route URLs");
      add(locs.includes(card.publication?.discovery?.sitemap?.loc), "sitemap omits the governed primary canonical loc");
    }
  }
  return errors;
}

function webInitialHtmlErrors(manifest, card, verificationRoot = packageDir) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  if (card.output?.formatProfile !== "web_public") {
    add(manifest.delivery?.primaryHtmlBinding === undefined, "non-web artifact must not declare primaryHtmlBinding");
    add(manifest.delivery?.webDiscoveryEvidence === undefined, "non-web artifact must not declare webDiscoveryEvidence");
    return errors;
  }
  const binding = manifest.delivery?.primaryHtmlBinding;
  add(isObject(binding), "web artifact requires a primary HTML binding");
  if (!isObject(binding)) return errors;
  const delivered = (manifest.delivery?.files ?? []).find((file) => file.path === binding.path);
  add(Boolean(delivered), "primary HTML binding path is not present in delivery.files");
  if (delivered) add(binding.sha256 === delivered.sha256 && binding.mediaType === delivered.mediaType && /^text\/html\b/i.test(delivered.mediaType), "primary HTML binding does not exactly match a delivered text/html file");
  const path = bundleFilePath(verificationRoot, binding.path);
  add(Boolean(path), "primary HTML binding does not resolve inside the artifact bundle");
  if (!path) return errors;
  add(sha256File(path) === binding.sha256, "primary HTML binding hash does not match delivered initial HTML bytes");
  let html = "";
  try { html = readFileSync(path, "utf8"); } catch { html = ""; }
  add(isNonEmpty(html), "primary delivered initial HTML is unreadable or empty");
  if (!isNonEmpty(html)) return errors;
  const discovery = card.publication?.discovery ?? {};
  const primaryLocale = card.locale?.primary;
  const expectedSurface = expectedWebSurfaceContract(manifest, card, verificationRoot);
  errors.push(...expectedSurface.errors);
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  add(htmlAttributes(htmlTag).lang === discovery.htmlLang, "delivered initial HTML lang drifts from discovery.htmlLang");
  const title = normalizedAudienceText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1]);
  add(title === discovery.titleByLocale?.[primaryLocale], "delivered initial HTML title drifts from the primary-locale discovery title");
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => htmlAttributes(match[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => htmlAttributes(match[0]));
  const metaValues = (attribute, name) => meta.filter((entry) => String(entry[attribute] ?? "").toLowerCase() === name.toLowerCase()).map((entry) => entry.content);
  const descriptionValues = metaValues("name", "description");
  add(descriptionValues.length === 1 && descriptionValues[0] === discovery.descriptionByLocale?.[primaryLocale], "delivered initial HTML meta description is missing, duplicated, or drifted");
  const robotsValues = metaValues("name", "robots");
  const robotTokens = new Set(String(robotsValues[0] ?? "").toLowerCase().split(/\s*,\s*|\s+/).filter(Boolean));
  add(robotsValues.length === 1 && robotTokens.size === 2 && robotTokens.has(discovery.robots?.index ? "index" : "noindex") && robotTokens.has(discovery.robots?.follow ? "follow" : "nofollow"), "delivered initial HTML robots meta is missing, duplicated, or drifts from discovery policy");
  const canonicalLinks = links.filter((entry) => String(entry.rel ?? "").toLowerCase().split(/\s+/).includes("canonical"));
  add(canonicalLinks.length === 1 && canonicalLinks[0].href === discovery.canonicalUrl, "delivered initial HTML canonical link is missing, duplicated, or drifted");
  const primaryRoute = (discovery.localeRoutes ?? []).find((route) => route.locale === primaryLocale);
  const expectedAlternates = (primaryRoute?.alternates ?? []).map(({ locale, url }) => ({ locale, url })).sort((left, right) => left.locale.localeCompare(right.locale));
  const actualAlternates = links
    .filter((entry) => String(entry.rel ?? "").toLowerCase().split(/\s+/).includes("alternate") && isNonEmpty(entry.hreflang))
    .map((entry) => ({ locale: entry.hreflang, url: entry.href }))
    .sort((left, right) => left.locale.localeCompare(right.locale));
  add(unique(actualAlternates.map((entry) => entry.locale)) && sameValue(actualAlternates, expectedAlternates), "delivered initial HTML hreflang links do not exactly match the primary locale route alternates");
  const socialMeta = [
    ["og:title", discovery.socialPreview?.titleByLocale?.[primaryLocale]],
    ["og:description", discovery.socialPreview?.descriptionByLocale?.[primaryLocale]],
    ["og:url", discovery.socialPreview?.url]
  ];
  for (const [name, expectedValue] of socialMeta) {
    const values = metaValues("property", name);
    add(values.length === 1 && values[0] === expectedValue, `delivered initial HTML ${name} is missing, duplicated, or drifts from social preview metadata`);
  }
  errors.push(...webSurfaceContractErrors(html, expectedSurface, "delivered initial HTML", { noscriptVisible: false }).errors);
  const governedEntities = [];
  for (const bindingEntry of discovery.structuredDataBindings ?? []) {
    const resolved = boundJson(bindingEntry, verificationRoot, "initial HTML structured data projection", release.schemaIds?.structuredDataProjection, structuredDataProjectionSchema);
    errors.push(...resolved.errors);
    governedEntities.push(...(resolved.document?.entities ?? []));
  }
  const ldEntities = [];
  const ldDocuments = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attrs = htmlAttributes(`<script ${match[1]}>`);
    if (String(attrs.type ?? "").toLowerCase() !== "application/ld+json") continue;
    let document = null;
    try { document = JSON.parse(match[2]); } catch { document = null; }
    add(document !== null, "delivered initial HTML contains invalid JSON-LD");
    if (document === null) continue;
    ldDocuments.push(document);
    const values = Array.isArray(document) ? document : Array.isArray(document?.["@graph"]) ? document["@graph"] : [document];
    ldEntities.push(...values.filter(isObject));
  }
  add(ldDocuments.length === 1 && isObject(ldDocuments[0]) && ldDocuments[0]["@context"] === "https://schema.org" && Array.isArray(ldDocuments[0]["@graph"]) && sameValue(Object.keys(ldDocuments[0]).sort(), ["@context", "@graph"]), "delivered initial HTML must contain one strict governed JSON-LD graph");
  add(ldEntities.length > 0, "delivered initial HTML lacks JSON-LD");
  add(unique(ldEntities.map((entity) => entity["@id"])), "delivered initial HTML JSON-LD contains duplicate entity IDs");
  add(sameValue(ldEntities.map((entity) => entity["@id"]).sort(), governedEntities.map((entity) => entity.entityId).sort()), "delivered initial HTML JSON-LD entity set drifts from governed structured-data projections");
  for (const governed of governedEntities) {
    const entity = ldEntities.find((entry) => entry["@id"] === governed.entityId);
    add(Boolean(entity), `delivered initial HTML JSON-LD omits governed entity ${governed.entityId}`);
    if (!entity) continue;
    add(sameValue(Object.keys(entity).sort(), ["@id", "@type", "name", "url"]), `delivered initial HTML JSON-LD contains ungoverned properties for ${governed.entityId}`);
    const actualTypes = Array.isArray(entity["@type"]) ? entity["@type"] : [entity["@type"]].filter(Boolean);
    add(sameValue([...actualTypes].sort(), [...(governed.types ?? [])].sort()), `delivered initial HTML JSON-LD types drift for ${governed.entityId}`);
    add(entity.url === governed.url, `delivered initial HTML JSON-LD URL drifts for ${governed.entityId}`);
    add(entity.name === governed.nameByLocale?.[primaryLocale], `delivered initial HTML JSON-LD name drifts from visible primary-locale truth for ${governed.entityId}`);
  }
  errors.push(...webDiscoveryEvidenceErrors(manifest, card, verificationRoot, expectedSurface));
  return errors;
}

function canonicalPromotionManifestProjection(manifest) {
  const validation = { ...(manifest.validation ?? {}) };
  delete validation.promotionSnapshot;
  return {
    schemaVersion: manifest.schemaVersion,
    release: manifest.release,
    artifact: manifest.artifact,
    resolution: manifest.resolution,
    representation: manifest.representation,
    delivery: manifest.delivery,
    validation
  };
}

function promotionReceiptBindings(manifest) {
  const receipts = [];
  for (const [layer, result] of Object.entries(manifest.validation?.layerResults ?? {})) {
    if (/^[a-f0-9]{64}$/.test(result?.receiptSha256 ?? "") && /^[a-f0-9]{64}$/.test(result?.attestationSha256 ?? "")) {
      receipts.push({ checkId: `LAYER-${layer.toUpperCase()}`, receiptRef: result.receiptRef, receiptSha256: result.receiptSha256, attestationRef: result.attestationRef, attestationSha256: result.attestationSha256 });
    }
  }
  for (const result of manifest.validation?.gateResults ?? []) {
    if (/^[a-f0-9]{64}$/.test(result?.receiptSha256 ?? "") && /^[a-f0-9]{64}$/.test(result?.attestationSha256 ?? "")) {
      receipts.push({ checkId: result.checkId, receiptRef: result.receiptRef, receiptSha256: result.receiptSha256, attestationRef: result.attestationRef, attestationSha256: result.attestationSha256 });
    }
  }
  return sortedCanonical(receipts);
}

function promotionSnapshotErrors(manifest, card, manifestRef, verificationRoot, trustStores) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const promoted = ["artifact_qa_passed", "production_verified"].includes(manifest.validation?.conformanceLevel);
  if (!promoted) {
    add(manifest.validation?.promotionSnapshot === null, "non-promoted artifact must not carry a promotion snapshot");
    return errors;
  }
  const binding = manifest.validation?.promotionSnapshot;
  add(isObject(binding), "promoted artifact lacks a promotion snapshot binding");
  if (!isObject(binding)) return errors;
  const resolved = boundJson(binding, verificationRoot, "promotion snapshot", release.schemaIds?.promotionSnapshot, promotionSnapshotSchema);
  errors.push(...resolved.errors);
  const snapshot = resolved.document;
  if (!snapshot) return errors;
  const preset = manifest.delivery?.implementationBindings?.preset;
  const sidecar = manifest.delivery?.socialSidecarBinding;
  const expectedSources = sortedCanonical((manifest.delivery?.implementationSourceBindings ?? []).map((source) => ({
    ref: source.ref,
    sha256: source.sha256,
    lineageReceiptRef: source.lineageReceiptRef,
    lineageReceiptSha256: source.lineageReceiptSha256,
    lineageAttestationRef: source.lineageAttestationRef,
    lineageAttestationSha256: source.lineageAttestationSha256
  })));
  const expectedOutputs = sortedCanonical((manifest.delivery?.files ?? []).map(({ path, sha256, mediaType }) => ({ path, sha256, mediaType })));
  add(snapshot.releaseRef === releaseRef && snapshot.conformanceLevel === manifest.validation?.conformanceLevel, "promotion snapshot release or conformance level drifts");
  add(snapshot.artifactId === manifest.artifact?.id && snapshot.artifactBuildId === manifest.artifact?.artifactBuildId, "promotion snapshot artifact identity drifts");
  add(snapshot.buildCard?.ref === manifest.artifact?.buildCardRef && snapshot.buildCard?.sha256 === manifest.artifact?.buildCardSha256, "promotion snapshot Build Card binding drifts");
  if (isNonEmpty(manifestRef)) add(snapshot.artifactManifest?.ref === manifestRef, "promotion snapshot Artifact Manifest ref does not equal the supplied manifest");
  add(snapshot.artifactManifest?.canonicalPromotionProjectionSha256 === sha256Bytes(canonicalJson(canonicalPromotionManifestProjection(manifest))), "promotion snapshot canonical Artifact Manifest projection hash drifts");
  add(snapshot.preset?.ref === preset?.ref && snapshot.preset?.sha256 === preset?.sha256, "promotion snapshot preset binding drifts");
  const expectedSidecar = sidecar ? { ref: sidecar.ref, sha256: sidecar.sha256 } : null;
  add(sameValue(snapshot.socialSidecar, expectedSidecar), "promotion snapshot social sidecar binding drifts");
  add(sameValue(sortedCanonical(snapshot.implementationSources ?? []), expectedSources), "promotion snapshot source and lineage bindings drift");
  add(sameValue(sortedCanonical(snapshot.outputs ?? []), expectedOutputs), "promotion snapshot output bindings drift");
  add(sameValue(sortedCanonical(snapshot.receipts ?? []), promotionReceiptBindings(manifest)), "promotion snapshot signed receipt bindings drift");
  errors.push(...detachedAttestationBindingErrors({ ref: binding.attestationRef, sha256: binding.attestationSha256 }, {
    label: "promotion snapshot",
    purpose: "promotion_snapshot",
    subjectRef: binding.ref,
    subjectSha256: binding.sha256,
    operationAt: snapshot.createdAt,
    maximumIssueDelayMs: 300000,
    requiredStoreScope: "operator_external"
  }, verificationRoot, trustStores));
  return errors;
}

function artifactNavigationProjectionErrors(manifest, card) {
  const expectedNavigation = {
    mode: card.navigation?.mode,
    brandDestinationRef: card.navigation?.brandDestinationRef,
    sideBookmark: card.navigation?.sideBookmark,
    sideBookmarkUserBenefit: card.navigation?.sideBookmarkUserBenefit,
    ...(isObject(card.navigation?.controlBudgets) ? { controlBudgets: card.navigation.controlBudgets } : {}),
    destinations: card.navigation?.destinations ?? []
  };
  return sameValue(manifest?.representation?.navigation, expectedNavigation) ? [] : ["artifact navigation projection differs from the Build Card"];
}

function artifactCrossErrors(manifest, card, verificationRoot = packageDir, trustStores = externalTrustStoresForRoot(verificationRoot), manifestRef = null) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const clarity = manifest.representation?.outputClarity ?? {};
  const deliveryAudience = card.audienceOutput?.deliveryAudience;
  const disclosurePurpose = card.audienceOutput?.disclosurePurpose;
  const disclosureResolution = resolveDisclosureAuthority(card, verificationRoot);
  errors.push(...disclosureResolution.errors);
  errors.push(...navigationContractErrors(card));
  errors.push(...implementationBindingErrors(manifest, card, verificationRoot));
  errors.push(...implementationSourceBindingErrors(manifest, card, verificationRoot, trustStores));
  errors.push(...socialSidecarBindingErrors(manifest, card, verificationRoot));
  errors.push(...promotionSnapshotErrors(manifest, card, manifestRef, verificationRoot, trustStores));
  const resolvedIds = manifest.resolution?.resolvedRuleIds ?? [];
  const resolvedTestIds = manifest.resolution?.resolvedTestIds ?? [];
  const nonApplicableIds = manifest.resolution?.nonApplicableRuleIds ?? [];
  add(manifest.resolution?.experienceProfile === card.experience?.profile, "artifact and Build Card primary experience profiles differ");
  add(sameValue(manifest.resolution?.secondaryExperienceProfiles ?? [], card.experience?.secondaryProfiles ?? []), "artifact and Build Card secondary experience profiles differ");
  add(unique(resolvedIds) && unique(nonApplicableIds), "resolved and non-applicable rule IDs must be unique");
  add(unique(resolvedTestIds), "resolved test IDs must be unique");
  add(sameValue(resolvedTestIds, resolvedTests(card)), "resolved test IDs must exactly cover common, experience, format, capability, target, kit, accessibility, and platform-portability tests");
  const projectedTestIds = (manifest.validation?.resolvedTestResults ?? []).map((result) => result.testId);
  add(unique(projectedTestIds) && projectedTestIds.every((id) => resolvedTestIds.includes(id)), "resolved test results contain duplicate or unresolved test IDs");
  add(resolvedIds.every((id) => !nonApplicableIds.includes(id)), "resolved and non-applicable rule sets overlap");
  add(sameValue([...resolvedIds, ...nonApplicableIds].sort(), [...ruleIds].sort()), "resolved and non-applicable rule sets must partition the catalog exactly");
  add((manifest.resolution?.exceptionRefs ?? []).length === 0, "v0.9.4 machine conformance does not accept exception refs");
  add(clarity.mode === "resolved_only", "outputClarity.mode must be resolved_only");
  add(clarity.deliveryAudience === deliveryAudience, "artifact and Build Card deliveryAudience differ");
  add(clarity.disclosurePurpose === disclosurePurpose, "artifact and Build Card disclosurePurpose differ");
  add(clarity.disclosureAuthorityRef === card.audienceOutput?.disclosureAuthorityRef && clarity.disclosureAuthoritySha256 === card.audienceOutput?.disclosureAuthoritySha256, "artifact and Build Card disclosure authority binding differ");
  add(clarity.internalGovernanceVisible === false, "internal governance is visible in the artifact projection");
  add(clarity.placeholderCount === 0, "artifact projection contains placeholders");
  add(sameValue(clarity.blockingDependencyRefs ?? [], card.audienceOutput?.blockingDependencyRefs ?? []), "artifact and Build Card blocker refs differ");
  add(manifest.representation?.claimManifestRef === card.publication?.claimManifestRef && manifest.representation?.claimManifestSha256 === card.publication?.claimManifestSha256, "artifact and Build Card claim-manifest binding differ");
  add(manifest.representation?.claimAsOf === card.publication?.claimAsOf, "artifact and Build Card claimAsOf differ");
  add(sameValue(manifest.representation?.localeStates, card.locale?.states), "artifact and Build Card locale states differ");
  errors.push(...artifactNavigationProjectionErrors(manifest, card));
  if (card.output?.formatProfile === "web_public") add(sameValue(manifest.delivery?.metadataProjection, card.publication?.discovery), "web artifact metadata projection differs from the Build Card discovery contract");
  else {
    const metadata = manifest.delivery?.metadataProjection ?? {};
    add(metadata.kind === "format_metadata" && metadata.formatProfile === card.output?.formatProfile && metadata.locale === card.locale?.primary, "non-web artifact metadata does not identify its format and primary locale");
  }
  if (["internal_operational", "client", "public"].includes(deliveryAudience)) add((clarity.blockingDependencyRefs ?? []).length === 0, `${deliveryAudience} artifact has blocking dependency refs`);
  const claimIds = new Set(manifest.representation?.claimIds ?? []);
  for (const ref of clarity.materialLimitationRefs ?? []) add(claimIds.has(ref), `material limitation ref does not resolve to a projected claim: ${ref}`);
  const projectedResolution = projectedClaimRecords(manifest, card, verificationRoot);
  errors.push(...projectedResolution.errors);
  const projectedClaims = projectedResolution.items;
  for (const { claimId, entry, record } of projectedClaims) {
    add(Boolean(entry), `projected claim ${claimId} is absent from the claim manifest`);
    add(Boolean(record), `projected claim ${claimId} recordRef does not resolve to a declared package record`);
    if (entry?.recordRef) {
      const recordPath = bundleFilePath(verificationRoot, entry.recordRef);
      add(Boolean(recordPath), `projected claim ${claimId} record file does not resolve`);
      if (recordPath) add(entry.sha256 === sha256File(recordPath), `projected claim ${claimId} record hash drifts from claim manifest`);
    }
    if (record && ["internal_operational", "client", "public"].includes(deliveryAudience)) {
      errors.push(...claimTemporalErrors(record, manifest.representation?.claimAsOf, card.locale?.available ?? []).map((message) => `${claimId}: ${message}`));
      const claimErrors = publicClaimProjectionErrors(record, deliveryAudience, disclosurePurpose);
      if (claimErrors.length) errors.push(...claimErrors.map((message) => `${claimId}: ${message}`));
    }
  }
  const materialClaimIds = projectedClaims
    .filter(({ record }) => Array.isArray(record?.limitations) && record.limitations.length > 0)
    .map(({ claimId }) => claimId)
    .sort();
  add(sameValue([...(clarity.materialLimitationRefs ?? [])].sort(), materialClaimIds), "materialLimitationRefs must exactly cover every projected claim with a nonempty limitation");
  const expectedLimitations = projectedClaims
    .filter(({ record }) => (record?.limitations ?? []).length > 0)
    .map(({ claimId, record }) => ({
      claimId,
      items: record.limitations.map((limitation) => ({
        id: limitation.id,
        text: limitation.textByLocale?.[card.locale?.primary],
        textByLocale: limitation.textByLocale
      }))
    }));
  add(sameValue(manifest.representation?.materialLimitations ?? [], expectedLimitations), "artifact material limitation projection must exactly match locale-complete claim limitations");
  for (const projection of manifest.representation?.materialLimitations ?? []) {
    add(unique((projection.items ?? []).map((item) => item.id)), `artifact limitation IDs are not unique for ${projection.claimId ?? "unknown"}`);
    for (const item of projection.items ?? []) {
      add(exactLocaleMap(item.textByLocale, card.locale?.available ?? []), `artifact limitation ${item.id ?? "unknown"} must cover delivered locales exactly`);
      add(item.text === item.textByLocale?.[card.locale?.primary], `artifact limitation ${item.id ?? "unknown"} text must equal the primary-locale value`);
    }
  }
  const metadata = manifest.delivery?.metadataProjection ?? {};
  const audienceMetadata = metadata.kind === "web_discovery" ? {
    titleByLocale: metadata.titleByLocale,
    descriptionByLocale: metadata.descriptionByLocale,
    primaryHeadingByLocale: metadata.primaryHeadingByLocale,
    primaryAnswerByLocale: metadata.primaryAnswerByLocale,
    socialTitleByLocale: metadata.socialPreview?.titleByLocale,
    socialDescriptionByLocale: metadata.socialPreview?.descriptionByLocale,
    socialImageAltByLocale: metadata.socialPreview?.imageAltByLocale
  } : {
    title: metadata.title,
    publicRevisionLabel: metadata.publicRevisionLabel,
    pageOrFrameLabel: metadata.pageOrFrameLabel
  };
  const audienceNavigation = (manifest.representation?.navigation?.destinations ?? []).map((destination) => ({
    target: destination.target,
    label: destination.label,
    labelByLocale: destination.labelByLocale,
    compactLabel: destination.compactLabel,
    compactLabelByLocale: destination.compactLabelByLocale
  }));
  const accessibility = manifest.delivery?.accessibilityProjection ?? {};
  const audienceAccessibility = accessibility.status === "verified" ? {
    readingOrder: accessibility.readingOrder,
    semanticStructure: accessibility.semanticStructure,
    alternatives: accessibility.alternatives,
    interaction: accessibility.interaction,
    textLayout: accessibility.textLayout,
    motion: accessibility.motion
  } : {};
  const residueHits = [
    ...workflowResidueHits(audienceNavigation, "$/representation/navigation", { allowedFieldClasses: disclosureResolution.allowedFieldClasses }),
    ...workflowResidueHits(audienceMetadata, "$/delivery/metadataProjection", { allowedFieldClasses: disclosureResolution.allowedFieldClasses }),
    ...workflowResidueHits(audienceAccessibility, "$/delivery/accessibilityProjection", { allowedFieldClasses: disclosureResolution.allowedFieldClasses })
  ];
  add(residueHits.length === 0, `audience projection contains workflow residue at ${residueHits.join(", ")}`);
  const assetBindings = manifest.delivery?.assetBindings ?? [];
  const bindingIds = assetBindings.map((binding) => binding.assetId);
  add(unique(bindingIds), "artifact asset binding IDs are not unique");
  add(sameValue([...bindingIds].sort(), (card.assets ?? []).map((asset) => asset.id).sort()), "artifact asset bindings do not exactly match Build Card assets");
  for (const asset of card.assets ?? []) {
    const binding = assetBindings.find((entry) => entry.assetId === asset.id);
    add(Boolean(binding), `artifact is missing asset binding ${asset.id}`);
    if (!binding) continue;
    add(binding.role === asset.role && binding.surface === asset.surface && binding.registryRef === asset.source && binding.approvalStatus === asset.approvalStatus, `artifact asset binding ${asset.id} drifts from Build Card role, surface, registry ref, or approval status`);
    add(binding.sha256 === asset.sha256, `artifact asset binding ${asset.id} hash drifts from Build Card`);
    const registryRef = String(asset.source ?? "").split("#")[0];
    const registryRecord = (card.assetRegistries ?? []).find((entry) => entry.registryRef === registryRef);
    add(binding.registrySha256 === registryRecord?.sha256, `artifact asset binding ${asset.id} registry hash drifts from Build Card`);
    const registryPath = bundleFilePath(verificationRoot, registryRef);
    add(Boolean(registryPath), `artifact asset binding ${asset.id} registry does not resolve inside the artifact bundle`);
    if (registryPath) add(binding.registrySha256 === sha256File(registryPath), `artifact asset binding ${asset.id} registry hash does not match registry bytes`);
    if (asset.approvalStatus === "approved") {
      add(binding.approvalReceiptRef === asset.approvalReceiptRef && binding.approvalReceiptSha256 === asset.approvalReceiptSha256, `artifact asset binding ${asset.id} approval receipt drifts from Build Card`);
      const receiptPath = bundleFilePath(verificationRoot, String(binding.approvalReceiptRef ?? "").split("#")[0]);
      add(Boolean(receiptPath), `artifact asset binding ${asset.id} approval receipt does not resolve inside the artifact bundle`);
      if (receiptPath) add(binding.approvalReceiptSha256 === sha256File(receiptPath), `artifact asset binding ${asset.id} approval receipt hash mismatch`);
    }
    if (asset.role === "text_font") {
      add(binding.fontRole === asset.fontRole && binding.fontFamily === asset.fontFamily && binding.fontSubset === asset.fontSubset && binding.fontWeight === asset.fontWeight && binding.fontFallback === asset.fontFallback, `artifact text font binding ${asset.id} descriptor drifts from Build Card`);
    }
    if (asset.role === "interface_icon") add(binding.licenseOrPermission === asset.licenseOrPermission && binding.fallback === asset.fallback && sameValue(binding.glyphs, asset.glyphs), `artifact icon binding ${asset.id} rights, fallback, or glyphs drift from Build Card`);
    if (["identity", "editorial", "evidence", "data_visualization", "map", "social_preview", "atmosphere", "ui_capture", "provider_content", "generated_vector"].includes(asset.role)) add(binding.licenseOrPermission === asset.licenseOrPermission && binding.fallback === asset.fallback && binding.altOrTextEquivalent === asset.altOrTextEquivalent, `artifact asset binding ${asset.id} rights, fallback, or text equivalent drift from Build Card`);
  }
  add(unique((manifest.delivery?.files ?? []).map((file) => file.path)), "delivery files contain duplicate paths");
  errors.push(...rawColorDeliveryErrors(manifest));
  const conformance = manifest.validation?.conformanceLevel;
  const conformanceOrder = ["authoring_aligned", "package_validated", "artifact_qa_passed", "production_verified"];
  const conformanceIndex = conformanceOrder.indexOf(conformance);
  const gateResults = manifest.validation?.gateResults ?? [];
  const gateIds = gateResults.map((gate) => gate.checkId);
  add(unique(gateIds), "gate result check IDs are not unique");
  const gates = new Map(gateResults.map((gate) => [gate.checkId, gate]));
  const expectedAcceptances = resolvedAcceptanceContracts(manifest, card);
  const expectedAcceptanceById = new Map(expectedAcceptances.map((acceptance) => [acceptance.checkId, acceptance]));
  for (const gate of gateResults) {
    const expected = expectedAcceptanceById.get(gate.checkId);
    add(Boolean(expected), `gate result ${gate.checkId} is unknown or does not belong to a resolved rule`);
    if (expected) add(gate.method === expected.method, `gate result ${gate.checkId} method drifts from the rule catalog`);
    if (gate.result === "pass") add(!/(?:fixture:|\bpending\b|\bnot[_-]?tested\b|\bplaceholder\b)/i.test(gate.receiptRef ?? ""), `gate result ${gate.checkId} uses a non-final receipt`);
  }
  if (conformanceIndex >= 1) add(manifest.validation?.packageValidation === "passed", `${conformance} requires packageValidation passed`);
  if (conformanceIndex >= 2) {
    add(deliveryAudience !== "internal_preview", `${conformance} cannot be claimed for internal_preview`);
    add((clarity.blockingDependencyRefs ?? []).length === 0, `${conformance} requires zero blocking dependency refs`);
    add(manifest.validation?.artifactAutomated === "passed", `${conformance} requires artifactAutomated passed`);
    add(manifest.validation?.artifactManual === "passed", `${conformance} requires artifactManual passed`);
    errors.push(...accessibilityProjectionErrors(manifest, card, verificationRoot));
    errors.push(...resolvedTestResultErrors(manifest, card, verificationRoot, conformanceIndex >= 3));
    errors.push(...audienceContentInspectionErrors(manifest, verificationRoot, disclosureResolution.allowedFieldClasses));
    errors.push(...webInitialHtmlErrors(manifest, card, verificationRoot));
    for (const layer of ["discovery", "readability", "action"]) {
      const layerResult = manifest.validation?.layerResults?.[layer];
      add(card.publication?.layerRequirements?.[layer] === "required", `${conformance} requires universal ${layer} layer applicability`);
      add(layerResult?.result === "pass", `${conformance} requires universal ${layer} layer passed`);
      errors.push(...receiptBindingErrors(layerResult ?? {}, manifest, verificationRoot, { checkId: `LAYER-${layer.toUpperCase()}` }, trustStores));
    }
    for (const acceptance of expectedAcceptances.filter((entry) => entry.method !== "production")) {
      const gate = gates.get(acceptance.checkId);
      add(Boolean(gate), `${conformance} is missing receipt ${acceptance.checkId} for ${acceptance.ruleId}`);
      if (gate) {
        add(gate.result === "pass", `${conformance} requires pass for resolved acceptance ${acceptance.checkId}`);
        if (gate.result === "pass") errors.push(...receiptBindingErrors(gate, manifest, verificationRoot, {
          checkId: acceptance.checkId,
          method: acceptance.method,
          criterion: acceptance.criterion
        }, trustStores));
      }
    }
    add((manifest.delivery?.files ?? []).length > 0, `${conformance} requires final artifact files`);
    for (const file of manifest.delivery?.files ?? []) {
      const deliveredPath = bundleFilePath(verificationRoot, file.path);
      add(Boolean(deliveredPath), `${conformance} delivered file does not resolve inside the artifact bundle: ${String(file.path)}`);
      if (deliveredPath) add(sha256File(deliveredPath) === file.sha256, `${conformance} delivered file hash mismatch: ${file.path}`);
    }
  }
  if (conformanceIndex >= 3) {
    add(manifest.validation?.productionVerification === "passed", "production_verified requires productionVerification passed");
    for (const acceptance of expectedAcceptances.filter((entry) => entry.method === "production")) {
      const gate = gates.get(acceptance.checkId);
      add(Boolean(gate), `production_verified is missing production receipt ${acceptance.checkId} for ${acceptance.ruleId}`);
      if (gate) {
        add(gate.result === "pass", `production_verified requires pass for resolved acceptance ${acceptance.checkId}`);
        if (gate.result === "pass") errors.push(...receiptBindingErrors(gate, manifest, verificationRoot, {
          checkId: acceptance.checkId,
          method: acceptance.method,
          criterion: acceptance.criterion
        }, trustStores));
      }
    }
    const clarityGate = gates.get("OUTPUT-CLARITY-01-B");
    add(clarityGate?.result === "pass", "production_verified requires passing OUTPUT-CLARITY-01-B");
    add(isNonEmpty(clarity.residueScanReceiptRef) && clarity.residueScanReceiptRef === clarityGate?.receiptRef, "production_verified residueScanReceiptRef must equal the OUTPUT-CLARITY-01-B receipt");
  }
  return errors;
}

function indexedTestIds(prefix, matrix = []) {
  return matrix.map((_criterion, index) => `${prefix}.${String(index + 1).padStart(2, "0")}`);
}

function resolvedTests(card, portabilityFixtureIds = null) {
  const pack = packByProfile.get(card.output?.formatProfile);
  const target = targetById.get(card.output?.targetProfileRef);
  const kit = kitById.get(pack?.kitRef);
  const selected = [];
  const add = (ids) => { for (const id of ids ?? []) if (!selected.includes(id)) selected.push(id); };
  add(indexedTestIds("common", formatPacks.commonTestMatrix));
  add(indexedTestIds(`experience.${card.experience?.profile}`, formatPacks.experienceProfileTestMatrix?.[card.experience?.profile]));
  for (const profile of card.experience?.secondaryProfiles ?? []) add(indexedTestIds(`experience.${profile}`, formatPacks.experienceProfileTestMatrix?.[profile]));
  add(indexedTestIds(`format.${pack?.id}`, pack?.testMatrix));
  add(indexedTestIds(`format.${pack?.id}.runtime.${card.output?.runtime}`, pack?.testMatrixByRuntime?.[card.output?.runtime]));
  for (const capability of card.capabilities ?? []) {
    const overlay = overlayByCapability.get(capability);
    add(indexedTestIds(`capability.${overlay?.id}`, overlay?.testMatrix));
    if (capability === "motion") {
      const runtimeClass = motionRuntimeClass(card);
      add(indexedTestIds(`capability.${overlay?.id}.runtime.${runtimeClass}`, overlay?.testMatrixByRuntimeClass?.[runtimeClass]));
    }
  }
  add((target?.requiredFixtures ?? []).map((fixture) => `${target.id}.fixture.${fixture}`));
  add(indexedTestIds(`${kit?.id}.control`, kit?.requiredImplementationControls));
  add(accessibilityFixtureIds(card));
  add(portabilityFixtureIds === null ? expectedPortabilityFixtureIdsForCard(card) : portabilityFixtureIds);
  return selected;
}

function ruleScopeApplies(rule, card) {
  const scopes = String(rule?.scope ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  const formatProfile = card?.output?.formatProfile;
  const runtime = card?.output?.runtime ?? targetById.get(card?.output?.targetProfileRef)?.runtime;
  const capabilities = new Set(card?.capabilities ?? []);
  const deliveryAudience = card?.audienceOutput?.deliveryAudience;
  return scopes.some((scope) =>
    scope === "all" ||
    scope === formatProfile ||
    (scope === "interactive" && ["web_public", "app_interactive"].includes(formatProfile)) ||
    (scope === "screen" && (["browser", "native"].includes(runtime) || formatProfile === "deck_presentation")) ||
    (scope === "public" && deliveryAudience === "public") ||
    scope === "agent_readable" ||
    (scope === "agent_action" && capabilities.has("agent_action")) ||
    (scope === "data_visualization" && capabilities.has("data_visualization")) ||
    (scope === "map" && capabilities.has("map"))
  );
}

function resolvedRules(card) {
  const pack = packByProfile.get(card.output.formatProfile);
  const selected = new Set(formatPacks.commonRuleIds ?? []);
  (pack.requiredRuleIds ?? []).forEach((id) => selected.add(id));
  (pack.requiredRuleIdsByRuntime?.[card.output?.runtime] ?? []).forEach((id) => selected.add(id));
  (formatPacks.experienceProfileRuleIds?.[card.experience?.profile] ?? []).forEach((id) => selected.add(id));
  for (const profile of card.experience?.secondaryProfiles ?? []) (formatPacks.experienceProfileRuleIds?.[profile] ?? []).forEach((id) => selected.add(id));
  for (const capability of card.capabilities ?? []) {
    const overlay = overlayByCapability.get(capability);
    (formatPacks.capabilityRuleIds?.[capability] ?? []).forEach((id) => selected.add(id));
    (overlay?.requiredRuleIds ?? []).forEach((id) => selected.add(id));
    if (capability === "motion") (overlay?.requiredRuleIdsByRuntimeClass?.[motionRuntimeClass(card)] ?? []).forEach((id) => selected.add(id));
    (pack.conditionalRuleIds?.[capability] ?? []).forEach((id) => selected.add(id));
  }
  if ((card.navigation?.sideBookmark ?? "not_applicable") !== "not_applicable") (pack.conditionalRuleIds?.side_bookmark ?? []).forEach((id) => selected.add(id));
  return ruleIds.filter((id) => selected.has(id) && ruleScopeApplies(ruleById.get(id), card));
}

const expectedResolvedRules = resolvedRules(build);
const expectedResolvedTests = resolvedTests(build);
const tupleHashInput = {
  authoringRevision: tuple.authoringRevision,
  dsVersion: tuple.dsVersion,
  machinePackage: tuple.machinePackage,
  rulesetId: tuple.rulesetId
};
const tupleHash = sha256Bytes(canonicalJson(tupleHashInput));

function loadDownstreamExternalTrustStore(request, bundleRoot) {
  if (!isNonEmpty(request.trustStore) && !isNonEmpty(request.trustPolicy)) return { errors: [], trustStores: [] };
  return loadPinnedTrustPair(request.trustStore, request.trustPolicy, "operator_external", bundleRoot, "");
}

function validateDownstreamBundle(request) {
  const errors = [...(request.errors ?? [])];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  if (errors.length) return { errors: [...new Set(errors)], root: null, buildCard: null, artifactManifest: null, agentAction: null };
  const root = downstreamBundleRoot(request.bundle);
  add(Boolean(root), "--bundle must resolve to a readable directory");
  const artifactSchema = documents.get(files.artifactManifestSchema);
  const runtimeSchema = documents.get(files.agentActionSchema);
  add(isObject(buildSchema), "active Build Card schema is unavailable");
  add(isObject(artifactSchema), "active Artifact Manifest schema is unavailable");
  add(isObject(formatPacks), "active format-pack contracts are unavailable");
  if (isObject(formatPacks)) {
    errors.push(...staticNavigationProjectionContractErrors(formatPacks).map((error) => `Active format-pack contract: ${error}`));
    errors.push(...componentContractTemplateErrors(formatPacks).map((error) => `Active format-pack contract: ${error}`));
    errors.push(...capabilityOverlayContractErrors(formatPacks).map((error) => `Active format-pack contract: ${error}`));
  }
  if (request.agentAction !== undefined) add(isObject(runtimeSchema), "active Agent Action runtime schema is unavailable");
  if (!root || !isObject(buildSchema) || !isObject(artifactSchema) || !isObject(formatPacks) || (request.agentAction !== undefined && !isObject(runtimeSchema))) {
    return { errors: [...new Set(errors)], root, buildCard: null, artifactManifest: null, agentAction: null };
  }
  const externalTrust = loadDownstreamExternalTrustStore(request, root);
  errors.push(...externalTrust.errors);

  const buildInput = downstreamJson(root, request.buildCard, "--build-card");
  const artifactInput = downstreamJson(root, request.artifactManifest, "--artifact-manifest");
  errors.push(...buildInput.errors, ...artifactInput.errors);
  const card = buildInput.document;
  const manifest = artifactInput.document;
  let cardSchemaValid = false;
  let manifestSchemaValid = false;
  if (card) {
    const schemaErrors = validateSchema(buildSchema, card);
    cardSchemaValid = schemaErrors.length === 0;
    errors.push(...schemaErrors.map((error) => `Build Card schema: ${error}`));
    if (cardSchemaValid) errors.push(...buildCrossErrors(card, null, root).map((error) => `Build Card contract: ${error}`));
  }
  if (manifest) {
    const schemaErrors = validateSchema(artifactSchema, manifest);
    manifestSchemaValid = schemaErrors.length === 0;
    errors.push(...schemaErrors.map((error) => `Artifact Manifest schema: ${error}`));
    if (["artifact_qa_passed", "production_verified"].includes(manifest.validation?.conformanceLevel)) {
      add(externalTrust.trustStores.length === 1, "--trust-store is required for signed artifact QA or production verification");
    }
  }

  if (cardSchemaValid && manifestSchemaValid) {
    const expectedPack = packByProfile.get(card.output?.formatProfile);
    const expectedRules = expectedPack ? resolvedRules(card) : [];
    const boundBuildPath = bundleFilePath(root, manifest.artifact?.buildCardRef);
    add(manifest.release?.releaseRef === releaseRef, "Artifact Manifest releaseRef differs from the active package");
    add(manifest.release?.releaseTupleSha256 === tupleHash, `Artifact Manifest release tuple hash must be ${tupleHash}`);
    add(manifest.artifact?.id === card.artifact?.id, "Artifact Manifest artifact ID differs from the Build Card");
    add(manifest.artifact?.buildCardRef === request.buildCard, "Artifact Manifest buildCardRef does not exactly equal --build-card");
    add(Boolean(boundBuildPath) && boundBuildPath === buildInput.path, "Artifact Manifest buildCardRef does not resolve to the supplied Build Card bytes");
    add(manifest.artifact?.buildCardSha256 === sha256File(buildInput.path), "Artifact Manifest buildCardSha256 does not match the supplied Build Card bytes");
    add(Boolean(expectedPack), "Build Card formatProfile has no active format pack");
    add(manifest.resolution?.experienceProfile === card.experience?.profile, "Artifact Manifest experience profile differs from the Build Card");
    add(sameValue(manifest.resolution?.secondaryExperienceProfiles ?? [], card.experience?.secondaryProfiles ?? []), "Artifact Manifest secondary experience profiles differ from the Build Card");
    add(manifest.resolution?.formatPack === expectedPack?.id, "Artifact Manifest format pack differs from the Build Card");
    add(manifest.resolution?.targetProfileRef === card.output?.targetProfileRef, "Artifact Manifest target profile differs from the Build Card");
    add(sameValue(manifest.resolution?.capabilityPacks, card.capabilities), "Artifact Manifest capability packs differ from the Build Card");
    add(sameValue(manifest.resolution?.resolvedRuleIds, expectedRules), "Artifact Manifest resolved rules differ from the active resolution for the Build Card");
    add(sameValue(manifest.resolution?.resolvedTestIds, resolvedTests(card)), "Artifact Manifest resolved tests differ from the active resolution for the Build Card");
    add(sameValue(manifest.representation?.actionIds, card.actions.map((action) => action.id)), "Artifact Manifest action IDs differ from the Build Card");
    const claimIds = [...new Set(card.composition.sections.flatMap((section) => section.claimIds ?? []))];
    add(sameValue(manifest.representation?.claimIds, claimIds), "Artifact Manifest claim IDs differ from the Build Card");
    errors.push(...artifactCrossErrors(manifest, card, root, externalTrust.trustStores, request.artifactManifest).map((error) => `Artifact Manifest contract: ${error}`));
  }

  let runtime = null;
  if (request.agentAction !== undefined) {
    add(externalTrust.trustStores.length === 1, "--trust-store and --trust-policy are required for Agent Action verification");
    const runtimeInput = downstreamJson(root, request.agentAction, "--agent-action");
    errors.push(...runtimeInput.errors);
    runtime = runtimeInput.document;
    if (runtime) {
      const schemaErrors = validateSchema(runtimeSchema, runtime);
      errors.push(...schemaErrors.map((error) => `Agent Action schema: ${error}`));
      if (schemaErrors.length === 0 && cardSchemaValid) errors.push(...agentActionCrossErrors(runtime, card, root, externalTrust.trustStores).map((error) => `Agent Action contract: ${error}`));
    }
  }
  return { errors: [...new Set(errors)], root, buildCard: card, artifactManifest: manifest, agentAction: runtime };
}

if (artifactManifest) {
  check(artifactManifest.release?.releaseRef === releaseRef, "artifact manifest: releaseRef drift");
  check(artifactManifest.release?.releaseTupleSha256 === tupleHash, `artifact manifest: release tuple hash must be ${tupleHash}`);
  check(artifactManifest.artifact?.id === build.artifact?.id, "artifact manifest: artifact ID drift");
  check(artifactManifest.artifact?.buildCardRef === files.buildCardExample, "artifact manifest: build card ref drift");
  check(artifactManifest.artifact?.buildCardSha256 === sha256File(join(packageDir, files.buildCardExample)), "artifact manifest: build card hash drift");
  check(artifactManifest.resolution?.experienceProfile === build.experience?.profile, "artifact manifest: experience profile drift");
  check(sameValue(artifactManifest.resolution?.secondaryExperienceProfiles ?? [], build.experience?.secondaryProfiles ?? []), "artifact manifest: secondary experience profile drift");
  check(artifactManifest.resolution?.formatPack === packByProfile.get(build.output?.formatProfile)?.id, "artifact manifest: format pack drift");
  check(artifactManifest.resolution?.targetProfileRef === build.output?.targetProfileRef, "artifact manifest: target profile drift");
  check(sameValue(artifactManifest.resolution?.capabilityPacks, build.capabilities), "artifact manifest: capability pack drift");
  check(sameValue(artifactManifest.resolution?.resolvedRuleIds, expectedResolvedRules), "artifact manifest: resolved rule list drift");
  check(sameValue(artifactManifest.resolution?.resolvedTestIds, expectedResolvedTests), "artifact manifest: resolved test list drift");
  check(sameValue(artifactManifest.representation?.actionIds, build.actions.map((action) => action.id)), "artifact manifest: action IDs drift");
  const buildClaimIds = [...new Set(build.composition.sections.flatMap((section) => section.claimIds ?? []))];
  check(sameValue(artifactManifest.representation?.claimIds, buildClaimIds), "artifact manifest: claim IDs drift");
  const artifactCross = artifactCrossErrors(artifactManifest, build);
  check(artifactCross.length === 0, `artifact-manifest.example.json: cross-field validation failed${artifactCross.length ? `\n  ${artifactCross.join("\n  ")}` : ""}`);
  for (const layer of ["discovery", "readability", "action"]) {
    const required = build.publication?.layerRequirements?.[layer] === "required";
    const result = artifactManifest.validation?.layerResults?.[layer]?.result;
    if (required && ["artifact_qa_passed", "production_verified"].includes(artifactManifest.validation?.conformanceLevel)) check(result === "pass", `artifact manifest: required ${layer} must pass at claimed conformance`);
  }
  if (artifactManifest.validation?.conformanceLevel === "production_verified") {
    check(artifactManifest.validation?.artifactAutomated === "passed" && artifactManifest.validation?.artifactManual === "passed" && artifactManifest.validation?.productionVerification === "passed", "artifact manifest: production_verified requires every validation phase passed");
  }
}

function publicClaimProjectionErrors(record, deliveryAudience = "public", disclosurePurpose = "ordinary_experience") {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const resolvedDelivery = ["internal_operational", "client", "public"].includes(deliveryAudience);
  if (resolvedDelivery) add(record?.status === "approved", `${deliveryAudience} claim is not approved`);
  if (deliveryAudience === "public") {
    add(record?.publicProjectionEligible === true, "public claim is not public-projection eligible");
    const publicRef = (value) => typeof value === "string" && (/^https:\/\//.test(value) || /^urn:[a-z0-9][a-z0-9-]*:/i.test(value));
    for (const ref of record.evidenceRefs ?? []) add(publicRef(ref), `public claim evidence ref is not a stable public reference: ${String(ref)}`);
    add(publicRef(record.provenance?.source), `public claim provenance source is not a stable public reference: ${String(record.provenance?.source)}`);
  }
  if (resolvedDelivery) {
    const audienceClaimFields = {
      claimId: record?.claimId,
      textByLocale: record?.textByLocale,
      claimType: record?.claimType,
      entity: record?.entity,
      proposition: record?.proposition,
      scope: record?.scope,
      evidenceRefs: record?.evidenceRefs,
      methodologyRef: record?.methodologyRef,
      dataGrain: record?.dataGrain,
      contentRelease: record?.contentRelease,
      rights: record?.rights,
      confidence: record?.confidence,
      limitations: record?.limitations,
      lastReviewed: record?.lastReviewed,
      validityBasis: record?.validityBasis,
      validFrom: record?.validFrom,
      validUntil: record?.validUntil
    };
    const residue = workflowResidueHits(audienceClaimFields, "$/claim", {
      allowReferenceIdentifiers: disclosureAllowsReferenceIdentifiers(disclosurePurpose)
    });
    add(residue.length === 0, `claim audience fields contain workflow residue at ${residue.join(", ")}`);
  }
  return errors;
}

if (claimManifest && claimRecord) {
  const entry = claimManifest.records?.find((record) => record.claimId === claimRecord.claimId);
  check(Boolean(entry), "claim manifest: example claim record is not indexed");
  check(entry?.recordRef === files.claimRecordExample, "claim manifest: recordRef drift");
  check(entry?.sha256 === sha256File(join(packageDir, files.claimRecordExample)), "claim manifest: claim record hash drift");
  check(entry?.status === claimRecord.status && entry?.publicProjectionEligible === claimRecord.publicProjectionEligible, "claim manifest: record status/public eligibility drift");
  const composedIds = [...new Set(build.composition.sections.flatMap((section) => section.claimIds ?? []))];
  check(sameValue(composedIds.sort(), claimManifest.records.map((record) => record.claimId).sort()), "claim manifest: composition and manifest claim IDs differ");
  const deliveryAudience = build.audienceOutput?.deliveryAudience;
  if (["internal_operational", "client", "public"].includes(deliveryAudience)) {
    for (const record of claimManifest.records) check(record.status === "approved", `claim manifest: ${deliveryAudience} claim ${record.claimId} is not approved`);
  }
  if (deliveryAudience === "public") {
    for (const record of claimManifest.records) check(record.publicProjectionEligible === true, `claim manifest: public claim ${record.claimId} is not eligible`);
  }
  const publicProjectionErrors = publicClaimProjectionErrors(claimRecord, deliveryAudience, build.audienceOutput?.disclosurePurpose);
  check(publicProjectionErrors.length === 0, `claim record: public projection contains an internal reference${publicProjectionErrors.length ? `\n  ${publicProjectionErrors.join("\n  ")}` : ""}`);
  const source = claimRecord.provenance?.source;
  if (isNonEmpty(source) && !/^https?:\/\//.test(source) && !/^urn:[a-z0-9][a-z0-9-]*:/i.test(source)) {
    const sourceFile = join(packageDir, source);
    check(declaredNames.includes(source) && existsSync(sourceFile), `claim record: non-public provenance source is not a declared package file (${source})`);
    if (existsSync(sourceFile)) check(claimRecord.provenance.integrityRef === `sha256:${sha256File(sourceFile)}`, "claim record: provenance integrity hash drift");
  }
}

if (agentAction) {
  const action = build.actions.find((entry) => entry.id === agentAction.actionId);
  check(Boolean(action), "agent action: actionId does not resolve to Build Card");
  check(agentAction.scope?.artifactId === build.artifact?.id, "agent action: artifact scope drift");
  const intentMap = { navigate: "read", inspect: "inspect", draft: "draft", submit: "submit", create: "create", save: "save", share: "share", download: "download", external_handoff: "external_handoff", confirm: "confirm", destructive: "destructive" };
  check(agentAction.scope?.allowedOperation === intentMap[action?.intent], "agent action: allowed operation drifts from action intent");
  check(agentAction.permission?.policy === build.privacySecurity?.agentActionPolicy, "agent action: permission policy drift");
  const consequential = agentAction.sideEffect?.class !== "none" || agentAction.sideEffect?.external === true || ["possible", "known"].includes(agentAction.sideEffect?.cost);
  const executionAttempted = ["running", "succeeded", "failed", "cancelled"].includes(agentAction.execution?.status);
  if (consequential && executionAttempted) check(agentAction.permission?.status === "granted" && agentAction.confirmation?.state === "confirmed", "agent action: consequential execution lacks permission/confirmation");
}

if (assetRegistry) {
  check(assetRegistry.productionEligibility === "per_asset_role" && assetRegistry.packageBytesIncluded === true, "asset registry: production eligibility must remain role-scoped and registered bytes must be packaged");
  check(isNonEmpty(assetRegistry.resolutionPolicy) && assetRegistry.resolutionPolicy.includes("OUTPUT-CLARITY-01"), "asset registry: resolved-only role policy is missing");
  check(isNonEmpty(assetRegistry.sourceProvenance?.identity) && isNonEmpty(assetRegistry.sourceProvenance?.fontsAndIcons) && !Object.hasOwn(assetRegistry, "workspaceSourceRoots"), "asset registry: source provenance must be portable and non-authoritative");
  const assetIds = [...(assetRegistry.identity ?? []), ...(assetRegistry.fonts ?? []), ...(assetRegistry.iconSubsets ?? []), ...(assetRegistry.media ?? [])].map((asset) => asset.id);
  check(unique(assetIds), "asset registry: asset IDs must be unique");
  for (const identity of assetRegistry.identity ?? []) {
    const packageFile = join(packageDir, identity.packageFile ?? "");
    check(isNonEmpty(identity.provenanceRef) && !Object.hasOwn(identity, "workspaceSource"), `asset registry: identity provenance is not portable ${identity.id}`);
    check(existsSync(packageFile), `asset registry: packaged identity missing ${identity.packageFile}`);
    if (existsSync(packageFile)) {
      check(identity.sha256 === sha256File(packageFile), `asset registry: packaged identity hash drift ${identity.id}`);
      check(identity.bytes === statSync(packageFile).size, `asset registry: packaged identity byte length drift ${identity.id}`);
    }
    check(identity.reconstructionAllowed === false && identity.cropAllowed === false, `asset registry: identity ${identity.id} must prohibit reconstruction/crop`);
  }
  for (const asset of [...(assetRegistry.fonts ?? []), ...(assetRegistry.iconSubsets ?? [])]) {
    const packageFile = join(packageDir, asset.packageFile ?? "");
    check(existsSync(packageFile), `asset registry: packaged font/icon missing ${asset.packageFile}`);
    if (existsSync(packageFile)) {
      check(asset.sha256 === sha256File(packageFile), `asset registry: packaged hash drift ${asset.id}`);
      check(asset.bytes === statSync(packageFile).size, `asset registry: packaged byte length drift ${asset.id}`);
    }
    check(asset.approvalStatus === "approved" && asset.approvedBy === assetApprovalReceipt?.approvedBy && asset.approvedAt === assetApprovalReceipt?.approvedAt && asset.approvalReceiptRef === files.assetApprovalReceipt && asset.approvalReceiptSha256 === sha256File(join(packageDir, files.assetApprovalReceipt)), `asset registry: approved font/icon record drift ${asset.id}`);
  }
  for (const asset of assetRegistry.media ?? []) {
    const packageFile = join(packageDir, asset.packageFile ?? "");
    check(existsSync(packageFile), `asset registry: packaged media missing ${asset.packageFile}`);
    if (existsSync(packageFile)) {
      check(asset.sha256 === sha256File(packageFile), `asset registry: packaged media hash drift ${asset.id}`);
      check(asset.bytes === statSync(packageFile).size, `asset registry: packaged media byte length drift ${asset.id}`);
    }
    if (asset.approvalStatus === "approved") {
      check(isNonEmpty(asset.approvedBy) && isNonEmpty(asset.approvedAt) && isNonEmpty(asset.approvalReceiptRef), `asset registry: approved media lacks approval evidence ${asset.id}`);
      check((asset.allowedSurfaces ?? []).length > 0 && (asset.rights?.allowedAudiences ?? []).length > 0, `asset registry: approved media lacks surface or audience rights ${asset.id}`);
    }
  }
  const licenseByFile = new Map((assetRegistry.licenseFiles ?? []).map((record) => [record.packageFile, record]));
  check(unique((assetRegistry.licenseFiles ?? []).map((record) => record.id)), "asset registry: license IDs must be unique");
  for (const license of assetRegistry.licenseFiles ?? []) {
    const packageFile = join(packageDir, license.packageFile ?? "");
    check(existsSync(packageFile), `asset registry: packaged license missing ${license.packageFile}`);
    if (existsSync(packageFile)) {
      check(license.sha256 === sha256File(packageFile), `asset registry: license hash drift ${license.id}`);
      check(license.bytes === statSync(packageFile).size, `asset registry: license byte length drift ${license.id}`);
    }
  }
  for (const asset of [...(assetRegistry.fonts ?? []), ...(assetRegistry.iconSubsets ?? [])]) check(licenseByFile.has(asset.licenseFileRef) && licenseByFile.get(asset.licenseFileRef)?.license === asset.license, `asset registry: license ref drift ${asset.id}`);
  for (const icon of assetRegistry.iconSubsets ?? []) check(icon.axes?.FILL === 0 && icon.axes?.wght === 300, `asset registry: icon subset ${icon.id} axes drift`);
  const receiptEvidence = assetApprovalReceipt?.authorityEvidenceRef;
  check(receiptEvidence === tuple.ownerApproval?.evidenceRef || receiptEvidence === "owner-message:2026-09-01:approve-v0.9.1", "asset registry: the approval receipt must cite the current or the predecessor release approval");
  check(assetApprovalReceipt?.approvedBy === tuple.ownerApproval?.approvedBy, "asset registry: the approval receipt approver must be the release approver");
  for (const set of assetRegistry.iconSets ?? []) check(set.approvalStatus === "approved" && set.approvalDetail?.status === "owner_approved" && isNonEmpty(set.approvalDetail?.evidenceRef) && isNonEmpty(set.approvalDetail?.decidedOn) && Array.isArray(set.sizesPx) && set.sizesPx.length === 6 && Array.isArray(set.files) && set.files.length === 6 && set.files.every((file) => /^[a-f0-9]{64}$/.test(file.sha256 ?? "") && Number.isInteger(file.bytes)), `asset registry: icon set ${set.id} must carry an owner decision and six hashed files (FAVICON-01)`);
  check(assetRegistry.motifRegisterRef?.ref === files.motifRegister && assetRegistry.motifRegisterRef?.sha256 === sha256File(join(packageDir, files.motifRegister)), "asset registry: motifRegisterRef must bind the packaged motif register by hash");
}

const expectedPredecessors = [
  "A11Y-01", "AGENT-01", "AHA-01", "APPFMT-01", "ASSET-DELIVERY-01", "AUTHORITY-01", "BOOKMARK-01", "BRAND-01", "CAPABILITY-01", "CAROUSEL-01", "CLAIM-MACHINE-01", "COLOR-01", "COMPARE-01", "COMPONENT-01", "CTA-01", "CTA-02", "CTRL-01", "DATAVIZ-01", "DECKFMT-01", "DISCOVERY-01", "DISCOVERY-02", "DISCOVERY-03", "DOCFMT-01", "EVIDENCE-01", "FORMAT-PARITY-01", "GOV-01", "ICON-01", "LAYER-01", "LAYOUT-01", "LOGO-01", "MAP-01", "MEDIA-01", "MOTION-01", "MOTION-02", "MOTION-03", "NAV-01", "NAV-02", "OUTPUT-CLARITY-01", "PARITY-01", "PDFFMT-01", "PROFILE-01", "QA-01", "RELEASE-01", "SECURITY-01", "SOCIAL-FEED-01", "SOCIALFMT-01", "SURFACE-01", "THEME-01", "TYPE-01", "WEBFMT-01"
]; // the 50 normative rule ids of v0.9.1-mp7 rule-catalog.json (the predecessor of 0.9.4)
if (migration) {
  const migratedIds = migration.entries?.map((entry) => entry.predecessorRuleId) ?? [];
  check(migration.expectedRuleCount === expectedPredecessors.length, "migration ledger: expectedRuleCount drift");
  check(migration.entries?.length === expectedPredecessors.length && unique(migratedIds), "migration ledger: count or uniqueness failure");
  check(sameValue([...migratedIds].sort(), [...expectedPredecessors].sort()), "migration ledger: predecessor coverage differs from the evidence-backed set");
  check(migration.predecessor?.sha256 === release.release?.predecessor?.sourceSha256 || migration.predecessor?.sha256 === release.sources?.find((source) => source.role === "normative_predecessor")?.sha256, "migration ledger: predecessor source hash drift");
  for (const entry of migration.entries ?? []) {
    check(["retained", "amended_in_place", "superseded_by", "deprecated_alias", "moved_to_product_pack", "removed_with_owner_reason"].includes(entry.disposition), `migration ledger: invalid disposition ${entry.predecessorRuleId}`);
    if (entry.disposition === "amended_in_place") check(sameValue(entry.targetRuleIds, [entry.predecessorRuleId]) && ruleIdSet.has(entry.predecessorRuleId), `migration ledger: amended_in_place ${entry.predecessorRuleId} must target itself in the active catalog`);
    check(isNonEmpty(entry.ownerRationale), `migration ledger: rationale missing ${entry.predecessorRuleId}`);
    for (const target of entry.targetRuleIds ?? []) check(ruleIdSet.has(target), `migration ledger: ${entry.predecessorRuleId} targets unknown rule ${target}`);
    if (entry.disposition === "moved_to_product_pack") check(isNonEmpty(entry.targetProductPackRef), `migration ledger: ${entry.predecessorRuleId} needs targetProductPackRef`);
  }
  // 0.9.4 lineage: the ledger names every new rule, the rule-id reassignment of the series rule, the withdrawn and superseded candidates,
  // the 26 value deltas of the board delta and the five sentence-ledger stages that end at this frozen text
  const newRuleIds = migration.newRuleIds ?? [];
  check(newRuleIds.length === 14 && newRuleIds.every((id) => ruleIdSet.has(id) && !expectedPredecessors.includes(id)) && ruleIds.filter((id) => !expectedPredecessors.includes(id)).every((id) => newRuleIds.includes(id)), "migration ledger: newRuleIds must be exactly the catalog rules that are not predecessor rules");
  check(Array.isArray(migration.ruleIdReassignment) && migration.ruleIdReassignment.length >= 1 && Array.isArray(migration.supersededCandidates) && migration.supersededCandidates.length === 2 && isObject(migration.withdrawnCandidate) && migration.valueDeltas?.rows?.length === 26, "migration ledger: rule-id reassignment, the two superseded candidates, the withdrawn candidate and the 26 value deltas must be recorded");
  const ledgerStages = [...new Set((migration.sentenceLedger ?? []).map((entry) => entry.stage))];
  check(ledgerStages.length === 5 && ledgerStages[ledgerStages.length - 1].startsWith(`0.9.4-r1 → ${tuple.authoringRevision}`), `migration ledger: the sentence ledger must carry five stages ending at ${tuple.authoringRevision}`);
  check(migration.releaseRef?.machinePackage === releaseRef && migration.releaseRef?.authoringRevision === tuple.authoringRevision && migration.releaseRef?.dsVersion === tuple.dsVersion && migration.releaseRef?.rulesetId === tuple.rulesetId, "migration ledger: release tuple drift");
  const freezeStage = (migration.sentenceLedger ?? []).filter((entry) => entry.stage === ledgerStages[ledgerStages.length - 1]);
  check(freezeStage.length > 0 && freezeStage.every((entry) => isNonEmpty(entry.newText) && isNonEmpty(entry.reason)), "migration ledger: the freeze stage must record every provenance edit with its text and reason");
}

function colorTokenSlug(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function expectedProductionColorDeclarations(tokenSource) {
  const expected = new Map();
  const put = (name, value) => {
    if (!isNonEmpty(name) || !isNonEmpty(value) || expected.has(name)) throw new Error(`invalid or duplicate production color declaration ${String(name)}`);
    expected.set(name, value);
  };
  const values = tokenSource?.values ?? {};
  for (const family of ["brand", "energy"]) {
    for (const [name, value] of Object.entries(values[family] ?? {})) put(`ldm-${family}-${colorTokenSlug(name)}`, value);
  }
  for (const [name, pair] of Object.entries(values.foundation ?? {})) {
    if (!Array.isArray(pair) || pair.length !== 2) continue;
    put(`ldm-foundation-${colorTokenSlug(name)}-light`, pair[0]);
    put(`ldm-foundation-${colorTokenSlug(name)}-dark`, pair[1]);
  }
  for (const [state, themes] of Object.entries(values.semantic ?? {})) {
    for (const [theme, pair] of Object.entries(themes ?? {})) {
      if (!Array.isArray(pair) || pair.length !== 2) continue;
      put(`ldm-semantic-${colorTokenSlug(state)}-${colorTokenSlug(theme)}-background`, pair[0]);
      put(`ldm-semantic-${colorTokenSlug(state)}-${colorTokenSlug(theme)}-foreground`, pair[1]);
    }
  }
  for (const [name, value] of Object.entries(values.signature ?? {})) put(`ldm-signature-${colorTokenSlug(name)}`, value);
  for (const [product, themes] of Object.entries(values.product ?? {})) {
    for (const [theme, pair] of Object.entries(themes ?? {})) {
      if (!Array.isArray(pair) || pair.length !== 2) continue;
      put(`ldm-product-${colorTokenSlug(product)}-${colorTokenSlug(theme)}-primary`, pair[0]);
      put(`ldm-product-${colorTokenSlug(product)}-${colorTokenSlug(theme)}-accent`, pair[1]);
    }
  }
  // landometer-series-10-v7: default variant fill + shared ink, opt-in variant fill (render-color-production.mjs)
  for (const series of values.series?.values ?? []) {
    const id = colorTokenSlug(series.id);
    for (const theme of ["light", "dark"]) {
      put(`ldm-${id}-fill-${theme}`, series?.[theme]?.fill);
      put(`ldm-${id}-ink-${theme}`, series?.[theme]?.ink);
      put(`ldm-${id}-${colorTokenSlug(series?.altFill?.variant)}-fill-${theme}`, series?.altFill?.[theme]);
    }
  }
  // deprecated landometer-series-10-v5 names keep their 0.9.1 values so existing artifacts do not change colour silently
  for (const series of values.seriesDeprecated?.values ?? []) {
    const id = colorTokenSlug(series.id);
    put(`ldm-${id}-light`, series.light);
    put(`ldm-${id}-dark`, series.dark);
  }
  for (const [scale, record] of Object.entries(values.scales ?? {})) {
    for (const theme of ["light", "dark"]) {
      for (const [index, color] of (record?.[theme] ?? []).entries()) put(`ldm-scale-${colorTokenSlug(scale)}-${theme}-anchor-${index + 1}`, color);
    }
  }
  // deprecated alias scale.density → its aliasTarget
  for (const [alias, record] of Object.entries(values.scalesDeprecated ?? {})) {
    const target = values.scales?.[record?.aliasTarget];
    if (!target) throw new Error(`alias target missing for ${alias}`);
    for (const theme of ["light", "dark"]) {
      for (const [index, color] of (target?.[theme] ?? []).entries()) put(`ldm-scale-${colorTokenSlug(alias)}-${theme}-anchor-${index + 1}`, color);
    }
  }
  for (const [state, record] of Object.entries(values.dataState ?? {})) {
    for (const theme of ["light", "dark"]) put(`ldm-data-state-${colorTokenSlug(state)}-${theme}`, record?.[theme]);
  }
  for (const [name, pair] of Object.entries(values.map ?? {})) {
    if (!Array.isArray(pair) || pair.length !== 2) continue;
    put(`ldm-map-${colorTokenSlug(name)}-light`, pair[0]);
    put(`ldm-map-${colorTokenSlug(name)}-dark`, pair[1]);
  }
  return expected;
}

function parseProductionColorDeclarations(css) {
  const declarations = new Map();
  const duplicates = [];
  for (const match of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const name = match[1].toLowerCase();
    const value = match[2].trim();
    if (declarations.has(name)) duplicates.push(name);
    declarations.set(name, value);
  }
  return { declarations, duplicates };
}

function colorDeclarationParityErrors(css, tokenSource = rawColorTokens) {
  const errors = [];
  let expected;
  try {
    expected = expectedProductionColorDeclarations(tokenSource);
  } catch (error) {
    return [error.message];
  }
  const { declarations, duplicates } = parseProductionColorDeclarations(css);
  if (duplicates.length) errors.push(`duplicate production color declarations: ${duplicates.join(", ")}`);
  for (const [name, value] of expected) {
    if (!declarations.has(name)) errors.push(`production color declaration omitted: --${name}`);
    else if (declarations.get(name) !== value) errors.push(`production color value drift: --${name}`);
  }
  for (const name of declarations.keys()) if (!expected.has(name)) errors.push(`unexpected production color declaration: --${name}`);
  for (const [name, value] of declarations) {
    const validValue = /^#[0-9a-f]{6}$/i.test(value) || /^linear-gradient\([^;{}\[\]'"]+\)$/i.test(value);
    if (!validValue) errors.push(`production color declaration is not a directly consumable CSS color or gradient: --${name}`);
  }
  return errors;
}

function colorProjectionErrors(tokenDocument, productionCssOverride = null) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  const registry = tokenDocument?.projection?.canonicalColorRegistry ?? {};
  add(registry.rawRegistryAudienceEmission === "forbidden", "the retained raw color registry is not forbidden from audience emission");
  add(registry.productionAudienceEmission === "allowed" && registry.productionCssScope === "governed_color_tokens_only", "production color CSS emission contract drift");
  const productionRef = registry.productionCssRef;
  add(isNonEmpty(productionRef) && declaredNames.includes(productionRef) && existsSync(join(packageDir, productionRef)), "production color CSS is not a declared package file");
  if (isNonEmpty(productionRef) && existsSync(join(packageDir, productionRef))) {
    add(registry.productionCssSha256 === sha256File(join(packageDir, productionRef)), "production color CSS hash drift");
    const css = productionCssOverride ?? textFile(productionRef);
    add(!/(?:--ldm-meta-|sourcerule|v0\.\d|machinevalidation|authoring subset|generated schema|--ldm-(?:motion|type|spacing|radius|container|breakpoint)-)/i.test(css), "production color CSS contains lifecycle, rule, or non-color legacy residue");
    const parityErrors = colorDeclarationParityErrors(css);
    if (parityErrors.length) errors.push(...parityErrors);
  }
  return errors;
}

if (tokens) {
  check(tokens.releaseRef === releaseRef && tokens.status === tuple.status, "tokens: release tuple drift");
  for (const [name, set] of Object.entries(release.sets ?? {})) check(tokens.sets?.[name] === set.id, `tokens: ${name} set drift`);
  check(tokens.projection?.type === "governed_summary" && tokens.projection?.standaloneCanonicalColorRegistry === false && tokens.projection?.packageIncludesCompleteColorRegistry === true && tokens.projection?.canonicalColorRegistry?.requireCompleteRegistryForProduction === true, "tokens: color projection boundary drift");
  const colorRegistry = tokens.projection?.canonicalColorRegistry ?? {};
  check(colorRegistry.embeddedMetadataRole === "historical_provenance_only" && colorRegistry.currentLifecycleAuthorityRef === files.release, "tokens: retained color lifecycle authority is ambiguous");
  check(colorRegistry.deliveryRef === null && colorRegistry.rawCssRef === null && colorRegistry.id === release.sets?.color?.id, "tokens: color-srgb-07 ships only the tokens and scales registries (no delivery or raw CSS file) under the declared set id");
  for (const [refKey, hashKey] of [["tokensRef", "tokensSha256"], ["scalesRef", "scalesSha256"]]) {
    const ref = colorRegistry[refKey];
    check(isNonEmpty(ref) && declaredNames.includes(ref) && existsSync(join(packageDir, ref)), `tokens: packaged color registry ref missing ${refKey}`);
    if (isNonEmpty(ref) && existsSync(join(packageDir, ref))) check(colorRegistry[hashKey] === sha256File(join(packageDir, ref)), `tokens: packaged color registry hash drift ${hashKey}`);
  }
  const colorErrors = colorProjectionErrors(tokens);
  check(colorErrors.length === 0, `tokens: audience-safe color projection failed${colorErrors.length ? `\n  ${colorErrors.join("\n  ")}` : ""}`);
  try {
    const rendered = execFileSync(process.execPath, [join(packageDir, files.colorProjectionRenderer)], { encoding: "utf8" });
    check(rendered === textFile(files.colorRegistryProductionCss), "color renderer output differs from delivered production CSS bytes");
  } catch (error) {
    check(false, `color projection renderer failed (${error.message})`);
  }
  check(tokens.brand?.logoCyan === "#0194CA" && tokens.brand?.logoGray === "#757575", "tokens: frozen logo colors drift");
  check(tokens.icon?.axes?.FILL === 0 && tokens.icon?.axes?.wght === 300 && tokens.constraints?.interfaceIconFillMayChangeByState === false, "tokens: outline icon invariant drift");
  check(tokens.layout?.directTargetMinCssPx?.width === 44 && tokens.layout?.directTargetMinCssPx?.height === 44, "tokens: direct target minimum drift");
  check(tokens.control?.textOrIconLabelButton?.shape === "capsule" && tokens.control?.iconOnlyButton?.shape === "circle", "tokens: control shape drift");
  const approach = tokens.motion?.approach ?? {};
  const approachExpected = {
    opacityDurationMs: 760, transformDurationMs: 920, mediaDurationMs: 900, blockDistancePx: 32, inlineDistancePx: 36,
    scaleFrom: 0.985, staggerStepMs: 150, staggerCapMs: 450, opacityEasing: "cubic-bezier(.16,1,.3,1)",
    transformEasing: "cubic-bezier(.2,.9,.25,1.08)", pressEasing: "cubic-bezier(.3,0,.6,1)", observerThreshold: 0.14,
    observerRootMargin: "0px 0px -12% 0px", observersPerDocumentRoot: 1, onceOnlyUnobserve: false,
    reentryBehavior: "replay_on_reentry_while_visible", cycleWhileStill: false,
    initializationWatchdogMs: 2400, reachedContentFailsafeFrames: 2, prePaintArmingRequiresNormalMotionAndObserver: true,
    finalHiddenFinalFlashForbidden: true
  };
  for (const [key, expected] of Object.entries(approachExpected)) check(sameValue(approach[key], expected), `tokens: motion.approach.${key} drift`);
  check(tokens.atmosphere?.gradientOnlyValues?.length === 15 && Object.keys(tokens.atmosphere?.recipes ?? {}).length === 7, "tokens: atmosphere registry summary drift");
  check(tokens.theme?.meaningParityRequired === true && tokens.theme?.staticExportRequiresFixedDeclaredTheme === true, "tokens: theme parity drift");
  check(tokens.constraints?.semanticParityAcrossFormatsRequired === true && tokens.constraints?.candidateMaySelfPromote === false && tokens.constraints?.publicWorkflowResidueAllowed === false && tokens.constraints?.unresolvedDependencyBehavior === "block_or_internal_preview", "tokens: package or audience-output constraint drift");
}

// ---------------------------------------------------------------------------------------------------------------------------
// 0.9.4 package contracts: colour registry and derivation (DATAVIZ-02/03), GATE-01 evidence, DATAVIZ-04 hue windows, categorical
// series v7 (DATAVIZ-05), value states (EVID-05), motif register and MOTIF-06 carriers, component contracts, icon set (FAVICON-01).
// Kit-side checks (ST-INK-01 on the shipped ext CSS, re-measurement of the twelve SVGs) run when a sibling build-kit/ folder is present.
// ---------------------------------------------------------------------------------------------------------------------------
let packageContractChecks094 = 0;
if (tokens && rawColorTokens) {
  const before094 = checks;
  const gates = await import(pathToFileURL(join(packageDir, files.dataVizGateTool)).href);
  const carriersLib = await import(pathToFileURL(join(packageDir, files.motifCarrierTool)).href);
  const kitDir = join(packageDir, "..", "build-kit");
  const kitPresent = existsSync(join(kitDir, "lds-0.9.4-ext.css")) && existsSync(join(kitDir, "motif", "svg"));
  const regValues = rawColorTokens.values ?? {};
  const scalesDoc = documents.get(files.colorRegistryScales);
  const evidence = documents.get(files.contrastEvidence);
  const register = documents.get(files.motifRegister);
  const registerSchema = documents.get(files.motifRegisterSchema);
  const contracts = documents.get(files.componentContracts);
  // registry identity
  check(rawColorTokens.meta?.colorSetId === release.sets?.color?.id && rawColorTokens.meta?.supersedes?.colorSetId === release.sets?.color?.supersededCandidateSetId && rawColorTokens.meta?.supersedes?.registrySha256 === release.sets?.color?.supersededCandidateRegistrySha256, "colour registry: meta.colorSetId and the superseded candidate set (id + hash) agree with release.json#/sets/color");
  check(tokens.projection?.canonicalColorRegistry?.predecessorRegistry?.id === release.sets?.color?.supersededCandidateSetId && tokens.projection?.canonicalColorRegistry?.predecessorRegistry?.tokensSha256 === release.sets?.color?.supersededCandidateRegistrySha256, "tokens: predecessorRegistry names the superseded candidate registry by id and hash");
  check(tokens.projection?.canonicalColorRegistry?.productionCssSha256 === sha256File(join(packageDir, files.colorRegistryProductionCss)), "tokens: productionCssSha256 binds the shipped production CSS");
  // analytical scales and the DATAVIZ-03 derivation
  const scales = tokens.analyticalScales ?? {};
  check(Object.keys(scales).length === 20 && Object.values(scales).filter((s) => s.kind === "sequential").length === 14 && Object.values(scales).filter((s) => s.kind === "diverging").length === 6, "tokens: 20 analytical families (14 sequential + 6 diverging)");
  for (const [id, family] of Object.entries(scales)) {
    const derived = family.kind === "sequential" ? gates.deriveSequentialDark(family.light) : gates.deriveDivergingDark(family.light);
    const exceptions = family.derivationExceptions ?? [];
    const ok = derived.every((hex, index) => family.dark?.[index] === hex || exceptions.some((entry) => entry.derived === hex && entry.shipped === family.dark?.[index]));
    check(ok, `DATAVIZ-03 D-DERIVE-01: ${id} dark anchors equal the derivation of the shipped light anchors or a declared exception`);
    check(sameValue(regValues.scales?.[id]?.light, family.light) && sameValue(regValues.scales?.[id]?.dark, family.dark), `tokens ↔ colour registry: ${id} anchors agree`);
    if (family.kind === "sequential") check(family.warmLane === gates.isWarmLane(family.light), `DATAVIZ-03: ${id} warmLane flag equals the hue test of its light mid`);
  }
  const exceptionFamilies = Object.entries(scales).filter(([, family]) => (family.derivationExceptions ?? []).length).map(([id]) => id);
  check(exceptionFamilies.every((id) => (regValues.gateExceptions ?? []).some((entry) => entry.family === id && entry.gate === "D-DERIVE-01")), "DATAVIZ-03: every derivation exception is declared in the registry gateExceptions (D-DERIVE-01)");
  check(Array.isArray(scalesDoc?.scales) && scalesDoc.scales.length === 40 && scalesDoc.scales.every((record) => record.lut?.length === 41 && record.lut[0] === record.anchors?.[0] && record.lut[20] === record.anchors?.[1] && record.lut[40] === record.anchors?.[2]), "colour registry scales: 40 LUT records of 41 steps anchored at 0/20/40");
  // categorical series v7 (DATAVIZ-05) and value states (EVID-05)
  const series = tokens.categoricalSeries ?? {};
  check(series.ruleId === "DATAVIZ-05" && series.registryId === "landometer-series-10-v7" && series.values?.length === 10 && series.defaultVariant === "dial-soft", "DATAVIZ-05: categorical series v7, ten slots, dial-soft default");
  check(series.values?.[9]?.name === "green" && series.slot10?.previous === "rose" && Boolean(series.slot10?.alternates?.rose) && series.defaultBindings?.landuse?.tourism === "green", "DATAVIZ-05: slot 10 is green with the rose alternate recorded and tourism bound to green (delta 0.9.4)");
  check(series.inkFallback?.value === "#182327" && sameValue(series.inkFallback?.slots, ["series.02", "series.03"]) && /--text-primary/.test(String(series.inkFallback?.rule ?? "")), "DATAVIZ-05 A5.2: the ink fallback is --text-primary #182327 for slots 02 and 03");
  for (const slot of series.values ?? []) {
    const record = (regValues.series?.values ?? []).find((entry) => entry.id === slot.id);
    check(Boolean(record) && sameValue(record.light, slot.light) && sameValue(record.dark, slot.dark) && sameValue(record.altFill, slot.altFill), `tokens ↔ colour registry: series ${slot.id} agrees`);
  }
  check(sameValue((tokens.dataState?.valueStates?.states ?? []).map((state) => state.id), ["measured_zero", "no_data", "out_of_scope", "suppressed", "not_yet"]) && /never on the no-data hatch/.test(String(tokens.dataState?.valueStates?.labelPlacement ?? "")), "EVID-05: five value states in order; the label is never on the hatch");
  // DATAVIZ-04 hue windows over every analytical anchor and series value, and the production CSS scope
  const failsOf = (hex, theme) => gates.hueVerdict(hex, theme).findings.filter((finding) => finding.severity === "fail").map((finding) => `${hex} (${theme}) ${finding.gate} ${finding.window}`);
  const anchorFails = Object.entries(scales).flatMap(([id, family]) => [...family.light.flatMap((hex) => failsOf(hex, "light")), ...family.dark.flatMap((hex) => failsOf(hex, "dark"))].map((finding) => `${id}: ${finding}`));
  const seriesFails = (series.values ?? []).flatMap((slot) => [slot.light.fill, slot.light.ink, slot.altFill.light].flatMap((hex) => failsOf(hex, "light")).concat([slot.dark.fill, slot.dark.ink, slot.altFill.dark].flatMap((hex) => failsOf(hex, "dark"))).map((finding) => `${slot.id}: ${finding}`));
  const auditedCount = Object.keys(scales).length * 6 + (series.values ?? []).length * 6;
  check(anchorFails.length === 0 && seriesFails.length === 0, `DATAVIZ-04 B-HUE-01/02 and SC-17 over ${auditedCount} analytical values${anchorFails.length + seriesFails.length ? `: ${[...anchorFails, ...seriesFails].join("; ")}` : ""}`);
  check(tokens.analyticalScalePolicy?.bannedHue?.ruleId === "DATAVIZ-04" && Boolean(tokens.analyticalScalePolicy.bannedHue.windows?.earth) && Boolean(tokens.analyticalScalePolicy.bannedHue.windows?.violet) && ["D-STEP-03", "B-HUE-01", "B-HUE-02", "SC-17"].every((gate) => (tokens.dataColourGates?.gateIds ?? tokens.dataColourGates?.gates ?? []).some((entry) => (typeof entry === "string" ? entry : entry?.id ?? entry?.gate) === gate)), "DATAVIZ-04: the banned-hue policy and the four 0.9.4 gates are declared in the tokens");
  const productionCss = textFile(files.colorRegistryProductionCss);
  const productionFindings = [...productionCss.matchAll(/(--ldm-[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{6})/g)].flatMap((match) => { const theme = /-dark(-|$)/.test(match[1]) ? "dark" : "light"; return failsOf(match[2].toUpperCase(), theme).map((finding) => `${match[1]} ${finding}`); });
  const analyticalNames = /^--ldm-(scale|series)-/;
  const inScope = productionFindings.filter((finding) => analyticalNames.test(finding) && !/--ldm-series-(0[1-9]|10)-(light|dark)\b/.test(finding));
  const outOfScope = productionFindings.filter((finding) => !inScope.includes(finding));
  check(inScope.length === 0, `DATAVIZ-04: production CSS analytical scope (scale anchors, series v7 fill/ink) is clear of the retired hue windows${inScope.length ? `: ${inScope.join("; ")}` : ""}`);
  check(outOfScope.length === (evidence?.summary?.bannedHue?.productionCssFindingsOutOfScope ?? -1), `DATAVIZ-04: the out-of-scope production-CSS findings (${outOfScope.length}) equal the stored evidence`);
  // GATE-01 evidence: bound to the current bytes and reproducible
  check(evidence?.schemaVersion === "1.2" && evidence?.ruleId === "GATE-01" && evidence?.releaseRef === releaseRef && evidence?.status === tuple.status, "contrast-evidence.json: schema 1.2 for GATE-01 under this release tuple");
  check(evidence?.result === "PASS" && evidence?.summary?.undeclaredFailures === 0, `GATE-01: stored result ${evidence?.result} with ${evidence?.summary?.undeclaredFailures} undeclared failures`);
  check(evidence?.subjects?.[0]?.ref === files.colorRegistryTokens && evidence?.subjects?.[0]?.sha256 === sha256File(join(packageDir, files.colorRegistryTokens)), "GATE-01: the evidence binds the shipped colour registry by hash");
  check(evidence?.tool?.ref === files.dataVizGateTool && evidence?.tool?.sha256 === sha256File(join(packageDir, files.dataVizGateTool)), "GATE-01: the evidence names the shipped gates tool by hash");
  check(evidence?.summary?.bannedHue?.fails === 0 && (evidence?.summary?.bannedHue?.audited ?? 0) >= 180 && ["B-HUE-01", "D-STEP-03"].every((gate) => (evidence?.summary?.gateIds ?? []).includes(gate)), "GATE-01: the evidence records a clean DATAVIZ-04 audit over at least 180 values and lists the 0.9.4 gates");
  for (const entry of evidence?.exceptions ?? []) check(["family", "gate", "value", "reason"].every((key) => isNonEmpty(String(entry?.[key] ?? ""))), `GATE-01: declared exception ${entry?.family} · ${entry?.gate} carries family, gate, value and reason`);
  check((evidence?.measured?.series ?? []).every((row) => row.soft?.inkOnCanvas >= 4.5) && (evidence?.measured?.series ?? []).filter((row) => row.theme === "dark").every((row) => row.soft?.fillOnCanvas >= 3 && row.vivid?.fillOnCanvas >= 3), "GATE-01: every series ink ≥ 4.5:1 and every dark fill ≥ 3:1 on the canvas (stored measurements)");
  try {
    const extCssPath = join(kitDir, "lds-0.9.4-ext.css");
    const rerun = gates.runGates(rawColorTokens, kitPresent ? readFileSync(extCssPath, "utf8") : null);
    check(rerun.result === "PASS" && rerun.undeclaredFailures === 0 && rerun.declaredExceptions === evidence?.summary?.declaredExceptions && (rerun.bannedHue?.fails ?? []).length === 0 && rerun.bannedHue?.audited === evidence?.summary?.bannedHue?.audited && rerun.warningCount === evidence?.summary?.warnings, `GATE-01: rerun on the shipped registry reproduces the stored evidence (result ${rerun.result}, undeclared ${rerun.undeclaredFailures}, declared ${rerun.declaredExceptions}, warnings ${rerun.warningCount}, hue audited ${rerun.bannedHue?.audited}, hue fails ${(rerun.bannedHue?.fails ?? []).length})`);
    if (kitPresent) {
      check(evidence?.subjects?.[1]?.ref === "lds-0.9.4-ext.css" && evidence?.subjects?.[1]?.sha256 === sha256File(extCssPath), "GATE-01: the evidence binds the shipped ext CSS by hash (kit present)");
      check(rerun.stateLabelChecked && (rerun.stateLabelGates ?? []).every((row) => row["ST-INK-01"] === "pass"), "GATE-01 ST-INK-01: text.metadata ≥ 4.5:1 on canvas, card, alt and soft in both themes (kit present)");
    } else warn("build-kit/ is not beside the package: ST-INK-01 on the shipped ext CSS and the ext-CSS hash of contrast-evidence.json were not re-verified here (they were verified at the freeze)");
  } catch (error) {
    check(false, `GATE-01 rerun failed (${error.message})`);
  }
  // motif register (MOTIF-01…06) ↔ tokens ↔ component contracts ↔ asset registry
  check(registerSchema && register ? validateSchema(registerSchema, register).length === 0 : false, "motif-register.v0.9.4.json validates against motif-register.schema.json");
  const kinds = Object.keys(register?.sharedFamily?.kinds ?? {});
  check(kinds.join() === "dial,rings,layers,slice,cultivate,logo" && Object.keys(tokens.motion?.motifs?.kinds ?? {}).join() === kinds.join(), "MOTIF-01: the six kinds in the register mirror tokens.motion.motifs");
  for (const [kind, definition] of Object.entries(register?.sharedFamily?.kinds ?? {})) {
    const mirror = tokens.motion?.motifs?.kinds?.[kind];
    check(Boolean(mirror) && mirror.beat === definition.beat && sameValue(mirror.allowedJobs, definition.allowedJobs) && mirror.variants?.full?.sha256 === definition.variants?.full?.sha256 && mirror.variants?.quiet?.sha256 === definition.variants?.quiet?.sha256, `MOTIF-01/02: kind ${kind} beat, jobs and variant hashes agree between register and tokens`);
  }
  const runtime = register?.sharedFamily?.runtime ?? [];
  check(runtime.find((entry) => entry.path.endsWith(".js"))?.sha256 === tokens.motion?.identity?.runtime?.js?.sha256 && runtime.find((entry) => entry.path.endsWith(".css"))?.sha256 === tokens.motion?.identity?.runtime?.css?.sha256, "MOTION-04: runtime hashes agree between the register and tokens.motion.identity");
  check(register?.joyBudget?.perLongRoute === 3 && register?.joyBudget?.perTaskSurface === 1 && sameValue(register?.joyBudget?.forbiddenRegions, ["first_answer", "primary_proof", "primary_action"]), "MOTIF-04: joy budget is three per route, one per task surface, with the three forbidden regions");
  for (const overlay of register?.productOverlays ?? []) check(overlay.approval?.status === "owner_approved" ? (overlay.assets?.length ?? 0) > 0 : overlay.approval?.status === "pre_approved_pending_production" && !(overlay.assets?.length), `MOTIF-05: overlay ${overlay.id} approval state is consistent with its registered bytes`);
  const contractIds = (contracts?.contracts ?? []).map((entry) => entry.contract?.componentId);
  check(contracts?.releaseRef === releaseRef && contracts?.status === tuple.status && ["component.evidence-card.01", "component.motif-frame.01", "component.motion-controller.01", "component.data-table.01", "component.map-legend.01"].every((id) => contractIds.includes(id)) && !contractIds.includes("component.brand-motion.01"), "component-contracts.v0.9.4.json: EvidenceCard, MotifFrame, MotionController, DataTable and MapLegend under this release tuple; BrandMotion is gone");
  const policy = register?.carrierPolicy;
  check(policy?.ruleId === "MOTIF-06" && policy?.authority?.decision?.evidenceRef === "owner-message:2026-09-16:motif-carrier-answers", "MOTIF-06: the register carries the carrier policy under the 2026-09-16 owner decision");
  check(/^[a-f0-9]{64}$/.test(policy?.authority?.ladder?.sha256 ?? "") && policy?.authority?.ladder?.approval?.pointer === "#/approvedSourceUpdates/quietFallbackLadder" && (release.sources ?? []).some((source) => source.sha256 === policy?.authority?.ladder?.sha256) && (release.sources ?? []).some((source) => source.sha256 === policy?.authority?.evidence?.sha256) && (release.sources ?? []).some((source) => source.sha256 === policy?.authority?.ladder?.approval?.sha256), "MOTIF-06: the approved ladder, its evidence and its approval are bound by hash in the policy and in release.json#/sources");
  check(policy?.ladderParity?.equal === policy?.ladderParity?.compared && (policy?.ladderParity?.compared ?? 0) >= 18 && policy?.ladderParity?.evidence?.equal === policy?.ladderParity?.evidence?.compared && (policy?.ladderParity?.evidence?.compared ?? 0) >= 88, "MOTIF-06: the stored measurement reproduces the approved ladder table and its evidence exactly");
  for (const [kind, definition] of Object.entries(register?.sharedFamily?.kinds ?? {})) check(sameValue(definition.allowedCarriers, policy?.allowed?.[kind]) && sameValue(tokens.motion?.motifs?.kinds?.[kind]?.allowedCarriers, policy?.allowed?.[kind]), `MOTIF-06: allowed carriers of ${kind} agree across the register kinds, the policy and the tokens`);
  const everyFull = Object.values(policy?.allowed ?? {}).flatMap((entry) => entry.full ?? []);
  const everyQuiet = Object.values(policy?.allowed ?? {}).flatMap((entry) => entry.quiet ?? []);
  check(!everyFull.includes("brand.blue") && !everyFull.some((carrier) => carrier.startsWith("atmosphere.") || carrier.endsWith("@dark")), "MOTIF-06: no full variant is allowed on Brand Blue, an atmosphere or a dark surface");
  check(!everyQuiet.some((carrier) => carrier.endsWith("@light") || carrier === "brand.beige" || carrier === "atmosphere.ground.mist" || carrier === "atmosphere.measure.luminous"), "MOTIF-06: no quiet variant is allowed on a light carrier");
  if (kitPresent) {
    try {
      const fresh = carriersLib.buildCarrierPolicy({ tokens, svgText: (kind, variant) => readFileSync(join(kitDir, "motif", "svg", `${kind}-${variant}.svg`), "utf8") });
      check(sameValue(fresh.carriers, policy?.carriers) && sameValue(fresh.allowed, policy?.allowed), "MOTIF-06: carriers and allowed pairs equal a fresh measurement of the governed SVGs (kit present)");
      const same = fresh.measured.filter((row) => (policy?.measured ?? []).some((stored) => stored.kind === row.kind && stored.variant === row.variant && stored.carrier === row.carrier && stored.weakest === row.weakest && stored.strongest === row.strongest && stored.allowed === row.allowed)).length;
      check(same === fresh.measured.length && (policy?.measured ?? []).length === fresh.measured.length, `MOTIF-06: the measured table equals a fresh measurement (${same}/${fresh.measured.length} pairs; kit present)`);
    } catch (error) {
      check(false, `MOTIF-06 re-measurement failed (${error.message})`);
    }
  } else warn("build-kit/ is not beside the package: the MOTIF-06 carrier table was not re-measured against the twelve SVGs here (it was at the freeze)");
  const frameContract = (contracts?.contracts ?? []).find((entry) => entry.contract?.componentId === "component.motif-frame.01")?.contract;
  check(Boolean(frameContract) && (frameContract.governingRuleIds ?? []).includes("MOTIF-06") && /data-host-surface/.test(String(frameContract.contentContract ?? "")) && (frameContract.acceptanceFixtureIds ?? []).includes("MOTIF-06-B"), "MOTIF-06: the MotifFrame contract carries the host-surface contract and the MOTIF-06-B fixture");
  check(buildSchema?.$defs?.motionMoment?.required?.includes("hostSurface") && Boolean(buildSchema?.$defs?.staticMotifPlacement), "MOTIF-06: Build Card motion moments require hostSurface and static motif placements are typed");
  const iconSet = (assetRegistry?.iconSets ?? [])[0];
  check(iconSet?.id === "iconset.landometer.portfolio.symbol.01" && iconSet?.approvalStatus === "approved" && iconSet?.approvalDetail?.status === "owner_approved", "FAVICON-01: the asset registry carries the approved portfolio icon set");
  packageContractChecks094 = checks - before094;
}

function expectedErrorMatches(errors, expected) {
  if (expected instanceof RegExp) return errors.some((error) => expected.test(error));
  if (typeof expected === "string") return errors.some((error) => error.includes(expected));
  if (typeof expected === "function") return expected(errors) === true;
  return false;
}

function expectRejected(label, baselineErrors, mutationErrors, expected) {
  adversarialChecks += 1;
  check(Array.isArray(baselineErrors) && baselineErrors.length === 0, `adversarial ${label}: clean baseline failed${baselineErrors?.length ? `\n  ${baselineErrors.join("\n  ")}` : ""}`);
  check(Array.isArray(mutationErrors) && mutationErrors.length > 0, `adversarial ${label}: mutation was incorrectly accepted`);
  check(Array.isArray(mutationErrors) && expectedErrorMatches(mutationErrors, expected), `adversarial ${label}: mutation failed for the wrong reason${mutationErrors?.length ? `\n  ${mutationErrors.join("\n  ")}` : ""}`);
}

function writeFixtureJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function fixturePng(width, height) {
  const crcTable = Array.from({ length: 256 }, (_, value) => {
    let crc = value;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    return crc >>> 0;
  });
  const chunk = (type, data) => {
    const typeBytes = Buffer.from(type, "ascii");
    const body = Buffer.concat([typeBytes, data]);
    let crc = 0xffffffff;
    for (const byte of body) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    const result = Buffer.alloc(12 + data.length);
    result.writeUInt32BE(data.length, 0);
    typeBytes.copy(result, 4);
    data.copy(result, 8);
    result.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 8 + data.length);
    return result;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 6, 0, 0, 0], 8);
  const row = Buffer.alloc(1 + width * 4);
  for (let x = 0; x < width; x += 1) row.set([1, 148, 202, 255], 1 + x * 4);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function escapeFixtureHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function artifactResolvedImplementationRecord(referenceRecord, card, artifactBuildId, buildCardRef, buildCardSha256) {
  const record = structuredClone(referenceRecord);
  const componentIds = [...(card.composition?.componentIds ?? [])];
  const sideBookmarkSelected = card.navigation?.sideBookmark === "selected";
  const bookmarkComponentCount = componentIds.filter((componentId) => componentId === "component.bookmark.side.01").length;
  if ((sideBookmarkSelected && bookmarkComponentCount !== 1) || (!sideBookmarkSelected && bookmarkComponentCount !== 0)) {
    throw new Error("artifact-resolved implementation cannot resolve an inconsistent side-bookmark selection/component inventory");
  }
  const componentContracts = componentIds.map((componentId) => structuredClone(governedComponentContract(card.output.formatProfile, card.output.runtime, componentId)));
  if (componentContracts.some((contract) => !contract)) {
    throw new Error("artifact-resolved implementation cannot omit an unresolved component contract");
  }
  record.recordKind = "artifact_resolved";
  record.recordId = `implementation.${card.artifact.id}.${artifactBuildId}`;
  record.authoringPlatform = expectedAuthoringPlatformForCard(card);
  record.artifactBinding = { artifactId: card.artifact.id, artifactBuildId, buildCardRef, buildCardSha256 };
  record.formatProfile = card.output.formatProfile;
  record.runtime = card.output.runtime;
  record.targetProfileRef = card.output.targetProfileRef;
  record.formatKitId = packByProfile.get(card.output.formatProfile)?.kitRef;
  record.resolutionContext = {
    experienceProfile: card.experience.profile,
    secondaryExperienceProfiles: card.experience.secondaryProfiles ?? [],
    capabilities: [...(card.capabilities ?? [])],
    sideBookmarkSelected,
    componentIds
  };
  const browserRuntime = card.output.runtime === "browser";
  record.requirements.resolvedAssetIds = (card.assets ?? []).map((asset) => asset.id).sort();
  record.requirements.identityAssetIds = (card.assets ?? []).filter((asset) => asset.role === "identity").map((asset) => asset.id).sort();
  record.requirements.identityImplementationIds = [card.identityImplementation?.id].filter(isNonEmpty);
  record.requirements.identityTypographyBindingIds = [card.identityImplementation?.typographyBindingId].filter(isNonEmpty);
  record.requirements.fontAssetIds = browserRuntime ? (card.assets ?? []).filter((asset) => asset.role === "text_font").map((asset) => asset.id).sort() : [];
  record.requirements.iconAssetIds = browserRuntime ? (card.assets ?? []).filter((asset) => asset.role === "interface_icon").map((asset) => asset.id).sort() : [];
  record.requirements.nativeFontMappingIds = expectedNativeFontMappingIdsForCard(card);
  record.requirements.nonWebIconPolicyId = browserRuntime ? null : "icon-policy.non-web.visible-label.01";
  record.requirements.portabilityFixtureIds = expectedPortabilityFixtureIdsForCard(card);
  record.requirements.componentIds = componentIds;
  record.requirements.componentContracts = componentContracts;
  record.requirements.componentRuleIds = [...new Set(record.requirements.componentContracts.flatMap((contract) => contract.governingRuleIds ?? []))];
  record.requirements.resolvedRuleIds = resolvedRules(card);
  record.requirements.resolvedTestIds = resolvedTests(card);
  record.requirements.accessibilityFixtureIds = accessibilityFixtureIds(card);
  return record;
}

function createConformanceFixture(conformanceLevel) {
  const root = mkdtempSync(join(tmpdir(), "lds-v094-conformance-"));
  const operatorRoot = mkdtempSync(join(tmpdir(), "lds-v094-operator-trust-"));
  mkdirSync(join(root, "receipts"));
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const signer = {
    issuerId: "fixture-artifact-qa-operator",
    keyId: `fixture.operator.${conformanceLevel}`,
    privateKey
  };
  const operatorTrustStore = {
    schemaVersion: "1.1",
    trustStoreId: `trust.fixture.operator.${conformanceLevel}`,
    controlledBy: "Independent artifact QA operator fixture",
    scope: "operator_external",
    keys: [{
      keyId: signer.keyId,
      issuerId: signer.issuerId,
      algorithm: "Ed25519",
      publicKeySpkiPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
      allowedPurposes: ["automated_conformance", "human_conformance", "production_conformance", "source_lineage", "promotion_snapshot", "agent_authority", "agent_revocation", "agent_confirmation", "agent_execution"],
      validFrom: "2026-09-01T00:00:00+07:00",
      validUntil: null,
      revokedAt: null
    }]
  };
  const operatorTrustStorePath = join(operatorRoot, "operator-trust-store.json");
  writeFixtureJson(operatorTrustStorePath, operatorTrustStore);
  const operatorTrustPolicy = {
    schemaVersion: "1.0",
    policyId: `policy.fixture.operator.${conformanceLevel}`,
    scope: "operator_external",
    stores: [{
      trustStoreId: operatorTrustStore.trustStoreId,
      keys: [{
        keyId: signer.keyId,
        issuerId: signer.issuerId,
        publicKeySpkiSha256: publicKeySpkiFingerprint(operatorTrustStore.keys[0].publicKeySpkiPem)
      }]
    }]
  };
  const operatorTrustPolicyPath = join(operatorRoot, "operator-trust-policy.json");
  writeFixtureJson(operatorTrustPolicyPath, operatorTrustPolicy);
  fixtureExternalTrustStores.set(resolve(root), [operatorTrustStore]);
  for (const filename of declaredNames) copyFileSync(join(packageDir, filename), join(root, filename));
  const discovery = build.publication.discovery;
  const primaryLocale = build.locale.primary;
  const primaryRoute = discovery.localeRoutes.find((route) => route.locale === primaryLocale);
  const artifactBuildId = `adversarial-${conformanceLevel}`;
  const resolvedImplementationRef = "format-implementation.artifact-resolved.json";
  const resolvedImplementation = artifactResolvedImplementationRecord(
    formatImplementationExample,
    build,
    artifactBuildId,
    files.buildCardExample,
    sha256File(join(root, files.buildCardExample))
  );
  writeFixtureJson(join(root, resolvedImplementationRef), resolvedImplementation);
  const structuredProjection = JSON.parse(readFileSync(join(root, files.structuredDataProjectionExample), "utf8"));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": structuredProjection.entities.map((entity) => ({
      "@id": entity.entityId,
      "@type": entity.types,
      url: entity.url,
      name: entity.nameByLocale[primaryLocale]
    }))
  };
  const navigationMarkup = (build.navigation?.destinations ?? []).map((entry) => `<a href="${escapeFixtureHtml(entry.target)}">${escapeFixtureHtml(entry.labelByLocale?.[primaryLocale] ?? entry.label)}</a>`).join("");
  const localeLinkMarkup = (discovery.localeRoutes ?? []).map((route) => `<a hreflang="${escapeFixtureHtml(route.locale)}" href="${escapeFixtureHtml(route.url)}">${escapeFixtureHtml(route.locale)}</a>`).join("");
  const actionMarkup = (build.actions ?? []).filter((entry) => ["available", "requires_permission"].includes(entry.availability)).map((entry) => {
    const target = entry.destinationBinding?.targetByLocale?.[primaryLocale] ?? entry.destinationBinding?.target;
    return `<a data-action-id="${escapeFixtureHtml(entry.id)}" href="${escapeFixtureHtml(target)}">${escapeFixtureHtml(entry.labelByLocale?.[primaryLocale] ?? entry.label)}</a>`;
  }).join("");
  const claimText = claimRecord.textByLocale?.[primaryLocale];
  const limitationMarkup = (claimRecord.limitations ?? []).map((limitation) => `<p>${escapeFixtureHtml(limitation.textByLocale?.[primaryLocale])}</p>`).join("");
  const evidenceLinkMarkup = (claimRecord.evidenceRefs ?? []).map((ref) => `<a data-evidence-for="${escapeFixtureHtml(claimRecord.claimId)}" href="${escapeFixtureHtml(ref)}">Evidence</a>`).join("");
  const finalHtml = [
    "<!doctype html>",
    `<html lang="${escapeFixtureHtml(discovery.htmlLang)}">`,
    "<head>",
    "<meta charset=\"utf-8\">",
    `<title>${escapeFixtureHtml(discovery.titleByLocale[primaryLocale])}</title>`,
    `<meta name="description" content="${escapeFixtureHtml(discovery.descriptionByLocale[primaryLocale])}">`,
    `<meta name="robots" content="${discovery.robots.index ? "index" : "noindex"},${discovery.robots.follow ? "follow" : "nofollow"}">`,
    `<link rel="canonical" href="${escapeFixtureHtml(discovery.canonicalUrl)}">`,
    ...(primaryRoute?.alternates ?? []).map((alternate) => `<link rel="alternate" hreflang="${escapeFixtureHtml(alternate.locale)}" href="${escapeFixtureHtml(alternate.url)}">`),
    `<meta property="og:title" content="${escapeFixtureHtml(discovery.socialPreview.titleByLocale[primaryLocale])}">`,
    `<meta property="og:description" content="${escapeFixtureHtml(discovery.socialPreview.descriptionByLocale[primaryLocale])}">`,
    `<meta property="og:url" content="${escapeFixtureHtml(discovery.socialPreview.url)}">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
    "</head>",
    "<body>",
    `<nav>${navigationMarkup}</nav>`,
    `<div aria-label="Language routes">${localeLinkMarkup}</div>`,
    `<div aria-label="Actions">${actionMarkup}</div>`,
    `<main><section id="question"><h1>${escapeFixtureHtml(discovery.primaryHeadingByLocale[primaryLocale])}</h1><p data-primary-answer>${escapeFixtureHtml(discovery.primaryAnswerByLocale[primaryLocale])}</p></section><section id="protected-line"><div data-claim-id="${escapeFixtureHtml(claimRecord.claimId)}"><p>${escapeFixtureHtml(claimText)}</p>${limitationMarkup}</div>${evidenceLinkMarkup}</section><section id="source"><p>Source route</p></section></main>`,
    "</body>",
    "</html>",
    ""
  ].join("\n");
  const sitemapXml = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ...(discovery.localeRoutes ?? []).map((route) => `<url><loc>${escapeFixtureHtml(route.url)}</loc></url>`),
    "</urlset>",
    ""
  ].join("\n");
  writeFileSync(join(root, "final.html"), finalHtml, "utf8");
  writeFileSync(join(root, "sitemap.xml"), sitemapXml, "utf8");
  writeFileSync(join(root, "receipts/no-script.html"), finalHtml, "utf8");
  writeFileSync(join(root, "receipts/hydrated-dom.html"), finalHtml, "utf8");
  writeFileSync(join(root, "component-source.html"), "<template data-artifact=\"landometer-protected-line\">Governed component source for the final artifact.</template>\n", "utf8");
  const finalContentSha256 = sha256File(join(root, "final.html"));
  const sitemapSha256 = sha256File(join(root, "sitemap.xml"));
  const deliveryFiles = [
    { path: "final.html", sha256: finalContentSha256, mediaType: "text/html" },
    ...(discovery.sitemap?.included === true ? [{ path: "sitemap.xml", sha256: sitemapSha256, mediaType: "application/xml" }] : [])
  ];
  const contentInspectionBindings = deliveryFiles.map((file, index) => {
    const evidenceRef = `receipts/audience-content-${index + 1}.json`;
    const visibleText = readFileSync(join(root, file.path), "utf8");
    writeFixtureJson(join(root, evidenceRef), {
      kind: "audience_content_inspection",
      subjectPath: file.path,
      subjectSha256: file.sha256,
      subjectMediaType: file.mediaType,
      method: "direct_text_scan",
      result: "pass",
      inspectedAt: "2026-09-01T00:55:00+07:00",
      sourceByteCount: statSync(join(root, file.path)).size,
      extractionComplete: true,
      visibleText,
      summary: `Every byte of ${file.path} was scanned for audience-visible workflow residue.`
    });
    return { subjectPath: file.path, subjectSha256: file.sha256, subjectMediaType: file.mediaType, method: "direct_text_scan", result: "pass", evidenceRef, evidenceSha256: sha256File(join(root, evidenceRef)), inspectedAt: "2026-09-01T00:55:00+07:00" };
  });
  const requiredTestIds = resolvedTests(build).filter((id) => conformanceLevel === "production_verified" || !(formatPacks.productionTestIds ?? []).includes(id));
  const requiredTestCriteria = resolvedTestCriteria(build);
  const resolvedTestResults = requiredTestIds.map((testId, index) => {
    const method = resolvedTestMethod(testId);
    const criterion = requiredTestCriteria.get(testId);
    const checkedAt = "2026-09-01T00:50:00+07:00";
    const evidenceRef = `receipts/resolved-test-${String(index + 1).padStart(2, "0")}.json`;
    const evidence = {
      kind: method === "production" ? "production_observation" : `${method}_record`,
      testId,
      artifactBuildId,
      result: "pass",
      method,
      observedAt: checkedAt,
      criterion,
      criterionSha256: sha256Bytes(criterion),
      summary: `Criterion-bound evidence for ${testId}`
    };
    if (method === "production") Object.assign(evidence, {
      observedUrl: build.publication.discovery.canonicalUrl,
      expectedCanonicalUrl: build.publication.discovery.canonicalUrl,
      httpStatus: 200,
      contentSha256: finalContentSha256,
      contentEquivalent: true
    });
    writeFixtureJson(join(root, evidenceRef), evidence);
    return { testId, method, result: "pass", criterion, criterionSha256: sha256Bytes(criterion), evidenceRef, evidenceSha256: sha256File(join(root, evidenceRef)), checkedAt };
  });
  const accessibilityFixtureIds = formatImplementationExample?.requirements?.accessibilityFixtureIds ?? [];
  const accessibilitySummary = expectedAccessibilityProjectionSummary(build);
  writeFixtureJson(join(root, "accessibility-fixtures.json"), {
    formatProfile: build.output.formatProfile,
    primaryLocale: build.locale.primary,
    summary: accessibilitySummary,
    fixtures: [...accessibilityFixtureIds],
    results: accessibilityFixtureIds.map((fixtureId) => {
      const result = resolvedTestResults.find((entry) => entry.testId === fixtureId);
      return { fixtureId, status: "passed", evidenceRef: result.evidenceRef, evidenceSha256: result.evidenceSha256 };
    }),
    blockingFailureCount: 0
  });
  const deliveryFile = deliveryFiles[0];
  const manifest = structuredClone(artifactManifest);
  manifest.artifact.artifactBuildId = artifactBuildId;
  manifest.artifact.builtAt = "2026-09-01T00:40:00+07:00";
  manifest.delivery.implementationBindings.preset = {
    ref: resolvedImplementationRef,
    sha256: sha256File(join(root, resolvedImplementationRef)),
    schemaRef: release.schemaIds.formatImplementation,
    id: resolvedImplementation.recordId
  };
  manifest.delivery.files = deliveryFiles;
  manifest.delivery.contentInspections = contentInspectionBindings;
  manifest.delivery.primaryHtmlBinding = { path: deliveryFile.path, sha256: deliveryFile.sha256, mediaType: deliveryFile.mediaType };
  const webObservedAt = "2026-09-01T00:56:00+07:00";
  const expectedSurface = expectedWebSurfaceContract(manifest, build, root);
  const accessibilityTreeRef = "receipts/accessibility-tree.json";
  writeFixtureJson(join(root, accessibilityTreeRef), {
    kind: "accessibility_tree_snapshot",
    artifactBuildId,
    primaryHtmlSha256: finalContentSha256,
    observedAt: webObservedAt,
    rootRole: "document",
    primaryHeading: expectedSurface.primaryHeading,
    primaryAnswer: expectedSurface.primaryAnswer,
    navigation: expectedSurface.navigation,
    actions: expectedSurface.actions,
    claims: expectedSurface.claims,
    evidenceLinks: expectedSurface.evidenceLinks,
    localeLinks: expectedSurface.localeLinks
  });
  const internalLocaleLinksRef = "receipts/internal-locale-links.json";
  writeFixtureJson(join(root, internalLocaleLinksRef), {
    kind: "internal_locale_link_snapshot",
    artifactBuildId,
    primaryHtmlSha256: finalContentSha256,
    observedAt: webObservedAt,
    links: expectedSurface.localeLinks
  });
  manifest.delivery.webDiscoveryEvidence = {
    artifactBuildId,
    primaryHtmlPath: deliveryFile.path,
    primaryHtmlSha256: deliveryFile.sha256,
    observedAt: webObservedAt,
    noScript: { ref: "receipts/no-script.html", sha256: sha256File(join(root, "receipts/no-script.html")), mediaType: "text/html" },
    hydratedDom: { ref: "receipts/hydrated-dom.html", sha256: sha256File(join(root, "receipts/hydrated-dom.html")), mediaType: "text/html" },
    accessibilityTree: { ref: accessibilityTreeRef, sha256: sha256File(join(root, accessibilityTreeRef)), mediaType: "application/json" },
    internalLocaleLinks: { ref: internalLocaleLinksRef, sha256: sha256File(join(root, internalLocaleLinksRef)), mediaType: "application/json" },
    sitemap: discovery.sitemap?.included === true ? { ref: "sitemap.xml", sha256: sitemapSha256, mediaType: "application/xml" } : null
  };
  const sourceBinding = {
    role: "component_source",
    ref: "component-source.html",
    sha256: sha256File(join(root, "component-source.html")),
    mediaType: "text/html",
    audienceDelivered: false,
    lineageReceiptRef: "receipts/component-source.lineage.json",
    lineageReceiptSha256: "",
    lineageAttestationRef: "receipts/component-source.lineage.attestation.json",
    lineageAttestationSha256: ""
  };
  const lineageReceipt = {
    schemaVersion: "1.0",
    releaseRef,
    receiptId: `lineage.component-source.${conformanceLevel}`,
    artifactId: manifest.artifact.id,
    artifactBuildId: manifest.artifact.artifactBuildId,
    source: { role: sourceBinding.role, ref: sourceBinding.ref, sha256: sourceBinding.sha256, mediaType: sourceBinding.mediaType },
    process: {
      processId: `fixture-render.${conformanceLevel}`,
      tool: "landometer-fixture-renderer",
      toolVersion: tuple.machinePackage,
      parametersSha256: sha256Bytes(canonicalJson({ formatProfile: build.output.formatProfile, runtime: build.output.runtime, conformanceLevel }))
    },
    outputs: deliveryFiles,
    executedAt: "2026-09-01T00:45:00+07:00"
  };
  writeFixtureJson(join(root, sourceBinding.lineageReceiptRef), lineageReceipt);
  sourceBinding.lineageReceiptSha256 = sha256File(join(root, sourceBinding.lineageReceiptRef));
  const lineageAttestation = createSignedAttestation({
    purpose: "source_lineage",
    subjectRef: sourceBinding.lineageReceiptRef,
    subjectSha256: sourceBinding.lineageReceiptSha256,
    attestationId: `attestation.lineage.component-source.${conformanceLevel}`,
    issuedAt: lineageReceipt.executedAt
  }, signer);
  writeFixtureJson(join(root, sourceBinding.lineageAttestationRef), lineageAttestation);
  sourceBinding.lineageAttestationSha256 = sha256File(join(root, sourceBinding.lineageAttestationRef));
  manifest.delivery.implementationSourceBindings = [sourceBinding];
  manifest.delivery.accessibilityProjection = {
    status: "verified",
    formatProfile: build.output.formatProfile,
    primaryLocale: build.locale.primary,
    ...accessibilitySummary,
    blockingFailureCount: 0,
    fixtureReportRef: "accessibility-fixtures.json",
    fixtureReportSha256: sha256File(join(root, "accessibility-fixtures.json"))
  };
  manifest.validation.conformanceLevel = conformanceLevel;
  manifest.validation.packageValidation = "passed";
  manifest.validation.artifactAutomated = "passed";
  manifest.validation.artifactManual = "passed";
  manifest.validation.productionVerification = conformanceLevel === "production_verified" ? "passed" : "pending";
  manifest.validation.resolvedTestResults = resolvedTestResults;
  manifest.validation.gateResults = [];

  const checkedAt = "2026-09-01T01:00:00+07:00";
  const owner = "qa-owner";
  const makeReceipt = (checkId, method, criterion) => {
    const receiptRef = `receipts/${checkId}.json`;
    const attestationRef = `receipts/${checkId}.attestation.json`;
    const testCaseId = `${checkId.toLowerCase()}.criterion`;
    const kind = method === "automated" ? "runner_report" : method === "production" ? "production_observation" : method === "visual" ? "screenshot" : method === "interaction" ? "interaction_log" : method === "accessibility" ? "accessibility_report" : "review_record";
    const evidenceRef = kind === "screenshot" ? `receipts/${checkId}.svg` : `receipts/${checkId}.evidence.json`;
    if (kind === "screenshot") {
      writeFileSync(join(root, evidenceRef), `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" role="img" aria-label="${checkId} reviewed fixture"><rect width="800" height="450" fill="#ffffff"/><text x="32" y="64" fill="#111111">${checkId} reviewed fixture</text></svg>\n`, "utf8");
    } else {
      writeFixtureJson(join(root, evidenceRef), { checkId, method, protocolId: `lds-v0.9.4/${checkId}`, result: "pass", testCaseIds: [testCaseId] });
    }
    const verification = method === "automated" ? {
      kind: "automated_runner", tool: "lds-artifact-validator", toolVersion: tuple.machinePackage, invocationId: `${checkId.toLowerCase()}.${conformanceLevel}`,
      startedAt: "2026-09-01T00:59:50+07:00", completedAt: "2026-09-01T00:59:55+07:00", exitCode: 0
    } : method === "production" ? {
      kind: "production_probe", probeId: `${checkId.toLowerCase()}.canonical`, environment: "production",
      observedUrl: build.publication.discovery.canonicalUrl, expectedCanonicalUrl: build.publication.discovery.canonicalUrl, httpStatus: 200, redirectChain: [], observedAt: "2026-09-01T00:59:55+07:00",
      returnedContentSha256: deliveryFile.sha256, expectedContentSha256: deliveryFile.sha256, contentEquivalent: true
    } : {
      kind: "human_review", reviewer: owner, reviewProtocolId: `lds-v0.9.4/${checkId}`, fixtureIds: [testCaseId], blockingFindingCount: 0, reviewedAt: "2026-09-01T00:59:55+07:00"
    };
    const evidenceFiles = [{ path: evidenceRef, sha256: sha256File(join(root, evidenceRef)), mediaType: kind === "screenshot" ? "image/svg+xml" : "application/json", kind }];
    const evidenceRefs = [evidenceRef];
    if (["OUTPUT-CLARITY-01-A", "OUTPUT-CLARITY-01-B"].includes(checkId)) {
      for (const inspection of contentInspectionBindings) {
        evidenceFiles.push({ path: inspection.evidenceRef, sha256: inspection.evidenceSha256, mediaType: "application/json", kind: "extracted_text" });
        evidenceRefs.push(inspection.evidenceRef);
      }
    }
    if (["DISCOVERY-01-A", "DISCOVERY-02-A"].includes(checkId)) {
      const bindings = [manifest.delivery.webDiscoveryEvidence.noScript, manifest.delivery.webDiscoveryEvidence.hydratedDom, manifest.delivery.webDiscoveryEvidence.accessibilityTree];
      if (checkId === "DISCOVERY-02-A") {
        bindings.push(manifest.delivery.webDiscoveryEvidence.internalLocaleLinks);
        if (manifest.delivery.webDiscoveryEvidence.sitemap) bindings.push(manifest.delivery.webDiscoveryEvidence.sitemap);
      }
      for (const binding of bindings) {
        evidenceFiles.push({ path: binding.ref, sha256: binding.sha256, mediaType: binding.mediaType, kind: "other" });
        evidenceRefs.push(binding.ref);
      }
    }
    const receipt = {
      schemaVersion: "1.2",
      releaseRef,
      receiptId: `receipt.${checkId.toLowerCase()}.${conformanceLevel}`,
      artifactId: manifest.artifact.id,
      artifactBuildId: manifest.artifact.artifactBuildId,
      checkId,
      method,
      result: "pass",
      assertion: criterion,
      criterionSha256: sha256Bytes(criterion),
      protocolId: `lds-v0.9.4/${checkId}`,
      owner,
      checkedAt,
      subjectFiles: deliveryFiles,
      evidenceFiles,
      evidenceRefs,
      testCases: [{ id: testCaseId, fixture: "Final hash-bound artifact and declared format fixtures", expected: criterion, actual: `No blocking deviation was observed for ${checkId}.`, result: "pass", evidenceRefs }],
      verification,
      attestationRef
    };
    const path = join(root, receiptRef);
    writeFixtureJson(path, receipt);
    const receiptSha256 = sha256File(path);
    const attestation = createSignedAttestation({
      purpose: conformanceAttestationPurpose(method),
      subjectRef: receiptRef,
      subjectSha256: receiptSha256,
      attestationId: `attestation.${checkId.toLowerCase()}.${conformanceLevel}`,
      issuedAt: checkedAt
    }, signer);
    writeFixtureJson(join(root, attestationRef), attestation);
    return { receiptRef, receiptSha256, attestationRef, attestationSha256: sha256File(join(root, attestationRef)), checkedAt, owner };
  };

  for (const layer of ["discovery", "readability", "action"]) {
    const checkId = `LAYER-${layer.toUpperCase()}`;
    const binding = makeReceipt(checkId, "automated", layerAcceptanceCriteria[checkId]);
    manifest.validation.layerResults[layer] = {
      result: "pass",
      reason: "Validated against the final applicable artifact bytes.",
      ...binding
    };
  }

  const includeProduction = conformanceLevel === "production_verified";
  for (const acceptance of resolvedAcceptanceContracts(manifest).filter((entry) => includeProduction || entry.method !== "production")) {
    const binding = makeReceipt(acceptance.checkId, acceptance.method, acceptance.criterion);
    manifest.validation.gateResults.push({
      checkId: acceptance.checkId,
      method: acceptance.method,
      result: "pass",
      reason: "Validated against the final applicable artifact bytes.",
      ...binding
    });
  }
  if (includeProduction) {
    manifest.representation.outputClarity.residueScanReceiptRef = manifest.validation.gateResults.find((gate) => gate.checkId === "OUTPUT-CLARITY-01-B")?.receiptRef;
  } else delete manifest.representation.outputClarity.residueScanReceiptRef;
  const promotionSnapshotRef = "receipts/promotion-snapshot.json";
  const promotionAttestationRef = "receipts/promotion-snapshot.attestation.json";
  const promotionSnapshot = {
    schemaVersion: "1.0",
    releaseRef,
    snapshotId: `promotion.${conformanceLevel}.${artifactBuildId}`,
    conformanceLevel,
    artifactId: manifest.artifact.id,
    artifactBuildId: manifest.artifact.artifactBuildId,
    buildCard: { ref: manifest.artifact.buildCardRef, sha256: manifest.artifact.buildCardSha256 },
    artifactManifest: {
      ref: "artifact-manifest.promoted.json",
      canonicalPromotionProjectionSha256: sha256Bytes(canonicalJson(canonicalPromotionManifestProjection(manifest)))
    },
    preset: { ref: manifest.delivery.implementationBindings.preset.ref, sha256: manifest.delivery.implementationBindings.preset.sha256 },
    socialSidecar: manifest.delivery.socialSidecarBinding ? { ref: manifest.delivery.socialSidecarBinding.ref, sha256: manifest.delivery.socialSidecarBinding.sha256 } : null,
    implementationSources: sortedCanonical(manifest.delivery.implementationSourceBindings.map((source) => ({
      ref: source.ref,
      sha256: source.sha256,
      lineageReceiptRef: source.lineageReceiptRef,
      lineageReceiptSha256: source.lineageReceiptSha256,
      lineageAttestationRef: source.lineageAttestationRef,
      lineageAttestationSha256: source.lineageAttestationSha256
    }))),
    outputs: sortedCanonical(manifest.delivery.files.map(({ path, sha256, mediaType }) => ({ path, sha256, mediaType }))),
    receipts: promotionReceiptBindings(manifest),
    createdAt: checkedAt
  };
  writeFixtureJson(join(root, promotionSnapshotRef), promotionSnapshot);
  const promotionSnapshotSha256 = sha256File(join(root, promotionSnapshotRef));
  const promotionAttestation = createSignedAttestation({
    purpose: "promotion_snapshot",
    subjectRef: promotionSnapshotRef,
    subjectSha256: promotionSnapshotSha256,
    attestationId: `attestation.promotion.${conformanceLevel}.${artifactBuildId}`,
    issuedAt: checkedAt
  }, signer);
  writeFixtureJson(join(root, promotionAttestationRef), promotionAttestation);
  manifest.validation.promotionSnapshot = {
    ref: promotionSnapshotRef,
    sha256: promotionSnapshotSha256,
    schemaRef: release.schemaIds.promotionSnapshot,
    attestationRef: promotionAttestationRef,
    attestationSha256: sha256File(join(root, promotionAttestationRef))
  };
  return { root, manifest, operatorRoot, operatorTrustStorePath, operatorTrustPolicyPath };
}

function withConformanceFixture(conformanceLevel, callback) {
  const fixture = createConformanceFixture(conformanceLevel);
  try {
    return callback(fixture);
  } finally {
    fixtureExternalTrustStores.delete(resolve(fixture.root));
    rmSync(fixture.root, { recursive: true, force: true });
    rmSync(fixture.operatorRoot, { recursive: true, force: true });
  }
}

function withPromotedFormatImplementationFixture(referenceRecord, callback) {
  const root = mkdtempSync(join(tmpdir(), "lds-v094-format-promotion-"));
  try {
    for (const filename of [files.tokens, files.formatKits, files.targetProfiles]) copyFileSync(join(packageDir, filename), join(root, filename));
    const bindingEntry = identityTypographyBindingById.get(referenceRecord.requirements.identityTypographyBindingIds[0]);
    const fontById = new Map((assetRegistry?.fonts ?? []).map((asset) => [asset.id, asset]));
    const iconById = new Map((assetRegistry?.iconSubsets ?? []).map((asset) => [asset.id, asset]));
    const assets = (referenceRecord.requirements.resolvedAssetIds ?? []).map((id) => {
      const font = fontById.get(id);
      if (font) return { id, role: "text_font", fontRole: font.role };
      if (iconById.has(id)) return { id, role: "interface_icon" };
      return { id, role: "identity" };
    });
    const variantSlug = `${referenceRecord.formatProfile}-${referenceRecord.runtime}`;
    const card = {
      artifact: { id: `fixture.${variantSlug}` },
      output: { formatProfile: referenceRecord.formatProfile, runtime: referenceRecord.runtime, targetProfileRef: referenceRecord.targetProfileRef },
      experience: { profile: referenceRecord.resolutionContext.experienceProfile, secondaryProfiles: referenceRecord.resolutionContext.secondaryExperienceProfiles ?? [] },
      capabilities: [...(referenceRecord.resolutionContext.capabilities ?? [])],
      navigation: { sideBookmark: referenceRecord.resolutionContext.sideBookmarkSelected ? "selected" : "not_applicable" },
      composition: { componentIds: [...referenceRecord.resolutionContext.componentIds] },
      audienceOutput: { deliveryAudience: "public" },
      assets,
      identityImplementation: {
        id: bindingEntry.implementation.id,
        typographyBindingId: bindingEntry.binding.id,
        nativeMappingId: bindingEntry.binding.nativeMappingId,
        fontAssetIds: [...(bindingEntry.binding.fontAssetIds ?? [])]
      }
    };
    const buildCardRef = `build-card.${variantSlug}.json`;
    writeFixtureJson(join(root, buildCardRef), card);
    const artifactBuildId = `promotion-${variantSlug}`;
    const record = artifactResolvedImplementationRecord(referenceRecord, card, artifactBuildId, buildCardRef, sha256File(join(root, buildCardRef)));
    const recordRef = `format-implementation.${variantSlug}.artifact-resolved.json`;
    writeFixtureJson(join(root, recordRef), record);
    const manifest = {
      artifact: { id: card.artifact.id, artifactBuildId, buildCardRef, buildCardSha256: sha256File(join(root, buildCardRef)) },
      resolution: { resolvedRuleIds: resolvedRules(card), resolvedTestIds: resolvedTests(card) },
      validation: { conformanceLevel: "artifact_qa_passed" },
      delivery: {
        implementationBindings: {
          formatKit: { ref: files.formatKits, sha256: sha256File(join(root, files.formatKits)), schemaRef: release.schemaIds.formatKit, id: record.formatKitId },
          targetProfile: { ref: files.targetProfiles, sha256: sha256File(join(root, files.targetProfiles)), schemaRef: release.schemaIds.targetProfile, id: record.targetProfileRef },
          preset: { ref: recordRef, sha256: sha256File(join(root, recordRef)), schemaRef: release.schemaIds.formatImplementation, id: record.recordId }
        }
      }
    };
    return callback({ root, card, manifest, record, recordRef });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function withPromotedSocialFixture(callback) {
  const root = mkdtempSync(join(tmpdir(), "lds-v094-social-promotion-"));
  const operatorRoot = mkdtempSync(join(tmpdir(), "lds-v094-social-operator-trust-"));
  try {
    mkdirSync(join(root, "receipts"));
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");
    const signer = { issuerId: "fixture-social-qa-operator", keyId: "fixture.operator.social-production", privateKey };
    const operatorTrustStore = {
      schemaVersion: "1.1",
      trustStoreId: "trust.fixture.operator.social-production",
      controlledBy: "Independent social artifact QA operator fixture",
      scope: "operator_external",
      keys: [{
        keyId: signer.keyId,
        issuerId: signer.issuerId,
        algorithm: "Ed25519",
        publicKeySpkiPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
        allowedPurposes: ["automated_conformance", "human_conformance", "production_conformance", "source_lineage", "promotion_snapshot"],
        validFrom: "2026-09-01T00:00:00+07:00",
        validUntil: null,
        revokedAt: null
      }]
    };
    writeFixtureJson(join(operatorRoot, "operator-trust-store.json"), operatorTrustStore);
    fixtureExternalTrustStores.set(resolve(root), [operatorTrustStore]);
    for (const filename of declaredNames) copyFileSync(join(packageDir, filename), join(root, filename));
    const card = structuredClone(build);
    card.artifact.title = "Landometer governed social creative fixture";
    card.output = {
      formatProfile: "social_static",
      runtime: "static",
      delivery: "screen",
      targetProfileRef: "target.social.square.1080.01",
      viewportOrPage: "1080 × 1080 px",
      interactive: false,
      offlineRequired: false,
      formatContext: {
        kind: "social_context",
        channel: "instagram.feed",
        campaignId: "campaign.social.promotion.fixture",
        expiresAt: "2026-09-01T02:00:00+07:00"
      }
    };
    const action = structuredClone(card.actions.find((entry) => entry.id === "open-live-source"));
    action.priority = "primary";
    action.destinationBinding.presentation = { mode: "static_equivalent", technique: "destination_cue" };
    card.actions = [action];
    card.experience.primaryActionRef = action.id;
    card.experience.nextUsefulActionRef = action.id;
    card.experience.readingOrder = [
      ...(card.composition.sections ?? []).map((section) => ({ kind: "section", ref: section.id })),
      { kind: "action", ref: action.id }
    ];
    card.experience.motionBenefit = [];
    card.experience.motionDecision = "no_motion";
    card.experience.motionAssignments = [];
    card.experience.ctaDiscoveryCueAssignments = [];
    card.experience.noMotionReason = "A static social creative must expose its final state immediately and cannot imply interaction through motion.";
    card.composition.componentIds = ["component.cta.primary-navigational.01"];
    card.composition.sideBookmarkEligible = false;
    card.navigation = { mode: "none", destinations: [], brandDestinationRef: null, sideBookmark: "omitted", sideBookmarkUserBenefit: null };
    card.identityImplementation.surface = "social_identity";
    card.identityImplementation.fontAssetIds = [];
    card.identityImplementation.typographyBindingId = "identity-typography.social.macos.01";
    card.identityImplementation.nativeMappingId = "fontmap.macos.identity-latin.georgia-bold.01";
    card.capabilities = ["claims", "evidence"];
    card.capabilityConfigRefs = {
      claims: structuredClone(card.capabilityConfigRefs.claims),
      evidence: structuredClone(card.capabilityConfigRefs.evidence)
    };
    delete card.publication.discovery;
    card.publication.indexing = "not_applicable";
    card.publication.canonicalPolicy = "not_applicable";
    card.publication.sitemapEligible = false;
    card.publication.llmsNavigation = "not_applicable";
    card.assets = [];
    const buildCardRef = "build-card.social-promoted.json";
    writeFixtureJson(join(root, buildCardRef), card);
    const creativePath = "social.png";
    writeFileSync(join(root, creativePath), fixturePng(1080, 1080));
    const creativeSha256 = sha256File(join(root, creativePath));
    const artifactBuildId = "social.promotion.fixture.20260901.01";
    const builtAt = "2026-09-01T00:40:00+07:00";
    const promotionCheckedAt = "2026-09-01T01:00:00+07:00";
    const productionObservedAt = "2026-09-01T01:05:00+07:00";
    const destinationEvidenceRef = "social-destination.json";
    const visibleEvidenceRef = "social-visible-copy.json";
    const audienceEvidenceRef = "social-audience-content.json";
    const sidecarRef = "social-sidecar.promoted.json";
    const sidecar = {
      schemaVersion: "1.2",
      releaseRef,
      kind: "social_static_publication_sidecar",
      sidecarId: "sidecar.social.promotion.fixture.20260901",
      publicationStatus: "approved_for_publication",
      generatedAt: "2026-09-01T00:58:00+07:00",
      promotionCheckedAt,
      productionObservedAt,
      artifact: {
        artifactId: "social.promotion.fixture",
        artifactBuildId,
        builtAt,
        formatProfile: "social_static",
        targetProfileRef: "target.social.square.1080.01",
        buildCardRef,
        buildCardSha256: sha256File(join(root, buildCardRef)),
        creativePath,
        creativeSha256,
        creativeMediaType: "image/png"
      },
      locale: { primary: card.locale.primary, languageDirection: "ltr" },
      campaign: {
        campaignId: "campaign.social.promotion.fixture",
        channel: "instagram.feed",
        name: "Landometer governed social fixture",
        startsAt: "2026-09-01T00:00:00+07:00",
        expiryBasis: "fixed_timestamp",
        expiresAt: "2026-09-01T02:00:00+07:00"
      },
      claimBinding: {
        claimId: claimRecord.claimId,
        claimManifestRef: card.publication.claimManifestRef,
        claimManifestSha256: card.publication.claimManifestSha256,
        claimRecordRef: files.claimRecordExample,
        claimRecordSha256: sha256File(join(root, files.claimRecordExample)),
        claimAsOf: card.publication.claimAsOf,
        validityBasis: claimRecord.validityBasis,
        validUntil: claimRecord.validUntil,
        visibleText: claimRecord.textByLocale[card.locale.primary],
        visibleLimitations: claimRecord.limitations.map((limitation) => ({ limitationId: limitation.id, text: limitation.textByLocale[card.locale.primary] }))
      },
      evidenceBindings: claimRecord.evidenceRefs.map((evidenceRef) => ({
        evidenceRef,
        claimId: claimRecord.claimId,
        visibleCue: "หลักฐาน: การอนุมัติข้อความระดับพอร์ตโฟลิโอ",
        evidenceKind: "owner_approval",
        observedAt: card.publication.claimAsOf
      })),
      actionBinding: {
        actionId: action.id,
        availability: "available",
        label: action.labelByLocale[card.locale.primary],
        outcome: action.outcomeByLocale[card.locale.primary],
        destinationKind: action.destinationBinding.kind,
        destination: action.destinationBinding.targetByLocale[card.locale.primary],
        presentation: { mode: "static_equivalent", technique: "destination_cue" },
        destinationCue: expectedSocialDestinationCue(action.destinationBinding.kind, action.destinationBinding.targetByLocale[card.locale.primary]),
        destinationVerification: {
          status: "passed",
          method: "http_head_or_get",
          observedDestination: action.destinationBinding.targetByLocale[card.locale.primary],
          observedAt: "2026-09-01T00:55:00+07:00",
          freshnessTtlSeconds: 900,
          evidenceRef: destinationEvidenceRef,
          evidenceSha256: "0".repeat(64)
        }
      },
      rights: {
        status: "public",
        publicationPermission: true,
        licenseOrPermission: "Owner-approved public portfolio cultural-activation wording.",
        rightsSourceRef: files.claimRecordExample,
        rightsSourceSha256: sha256File(join(root, files.claimRecordExample)),
        allowedChannels: ["instagram.feed"],
        allowedLocales: [card.locale.primary],
        validFrom: "2026-09-01T00:30:00+07:00",
        expiryBasis: "fixed_timestamp",
        expiresAt: "2026-09-01T02:00:00+07:00"
      },
      visibleCopyInspection: {
        subjectPath: creativePath,
        subjectSha256: creativeSha256,
        method: "ocr_plus_visual_review",
        result: "pass",
        inspectedAt: "2026-09-01T00:56:00+07:00",
        normalizationAlgorithm: "unicode_nfc_trim_collapse_whitespace_v1",
        normalizedProjectionSha256: "0".repeat(64),
        evidenceRef: visibleEvidenceRef,
        evidenceSha256: "0".repeat(64)
      },
      outputClarity: {
        mode: "resolved_only",
        workflowState: "resolved",
        blockingDependencyRefs: [],
        placeholderCount: 0,
        unresolvedWorkflowLanguagePresent: false,
        audienceProjectionId: "social_sidecar_audience_v2",
        audienceTextHashAlgorithm: "sha256_canonical_json_v1",
        audienceTextSha256: "0".repeat(64),
        visibleCopyProjectionId: "social_visible_copy_projection_v1",
        visibleCopyNormalization: "unicode_nfc_trim_collapse_whitespace_v1",
        visibleCopySha256: "0".repeat(64)
      }
    };
    const destinationEvidence = {
      kind: "social_destination_verification",
      result: "pass",
      method: sidecar.actionBinding.destinationVerification.method,
      requestedDestination: sidecar.actionBinding.destination,
      observedDestination: sidecar.actionBinding.destination,
      observedAt: sidecar.actionBinding.destinationVerification.observedAt,
      httpStatus: 200,
      redirectChain: [],
      summary: "The governed destination resolved successfully."
    };
    const visibleProjection = socialVisibleCopyProjection(sidecar);
    const visibleProjectionSha256 = sha256Bytes(canonicalJson(visibleProjection));
    sidecar.visibleCopyInspection.normalizedProjectionSha256 = visibleProjectionSha256;
    sidecar.outputClarity.visibleCopySha256 = visibleProjectionSha256;
    sidecar.outputClarity.audienceTextSha256 = sha256Bytes(canonicalJson(socialSidecarAudienceProjection(sidecar)));
    const visibleEvidence = {
      kind: "social_visible_copy_inspection",
      subjectPath: creativePath,
      subjectSha256: creativeSha256,
      subjectMediaType: "image/png",
      method: "ocr_plus_visual_review",
      result: "pass",
      inspectedAt: sidecar.visibleCopyInspection.inspectedAt,
      sourceByteCount: statSync(join(root, creativePath)).size,
      extractionComplete: true,
      ocrPerformed: true,
      visualReviewPerformed: true,
      normalizationAlgorithm: "unicode_nfc_trim_collapse_whitespace_v1",
      normalizedOcrProjection: structuredClone(visibleProjection),
      visualReviewProjection: structuredClone(visibleProjection),
      normalizedProjectionSha256: visibleProjectionSha256,
      unclassifiedVisibleText: [],
      extraClaimTexts: [],
      visibleText: canonicalJson(visibleProjection),
      summary: "OCR and visual review accounted for every visible copy item without extra claims."
    };
    const audienceEvidence = {
      kind: "audience_content_inspection",
      subjectPath: creativePath,
      subjectSha256: creativeSha256,
      subjectMediaType: "image/png",
      method: "ocr_visual_review",
      result: "pass",
      inspectedAt: sidecar.visibleCopyInspection.inspectedAt,
      sourceByteCount: statSync(join(root, creativePath)).size,
      extractionComplete: true,
      ocrPerformed: true,
      visualReviewPerformed: true,
      visibleText: canonicalJson(visibleProjection),
      summary: "OCR and visual review accounted for the complete audience-visible creative."
    };
    writeFixtureJson(join(root, destinationEvidenceRef), destinationEvidence);
    writeFixtureJson(join(root, visibleEvidenceRef), visibleEvidence);
    writeFixtureJson(join(root, audienceEvidenceRef), audienceEvidence);
    sidecar.actionBinding.destinationVerification.evidenceSha256 = sha256File(join(root, destinationEvidenceRef));
    sidecar.visibleCopyInspection.evidenceSha256 = sha256File(join(root, visibleEvidenceRef));
    writeFixtureJson(join(root, sidecarRef), sidecar);
    const resolvedImplementationRef = "format-implementation.social.artifact-resolved.json";
    const resolvedImplementation = artifactResolvedImplementationRecord(
      documents.get(files.formatImplementationSocialStaticExample),
      card,
      artifactBuildId,
      buildCardRef,
      sidecar.artifact.buildCardSha256
    );
    writeFixtureJson(join(root, resolvedImplementationRef), resolvedImplementation);
    const deliveryFiles = [{ path: creativePath, sha256: creativeSha256, mediaType: "image/png" }];
    const contentInspections = [{
      subjectPath: creativePath,
      subjectSha256: creativeSha256,
      subjectMediaType: "image/png",
      method: "ocr_visual_review",
      result: "pass",
      evidenceRef: audienceEvidenceRef,
      evidenceSha256: sha256File(join(root, audienceEvidenceRef)),
      inspectedAt: sidecar.visibleCopyInspection.inspectedAt
    }];
    const manifest = structuredClone(artifactManifest);
    manifest.artifact = {
      id: sidecar.artifact.artifactId,
      buildCardRef,
      buildCardSha256: sidecar.artifact.buildCardSha256,
      artifactBuildId,
      builtAt
    };
    const resolvedRuleIds = resolvedRules(card);
    const resolvedTestIds = resolvedTests(card);
    manifest.resolution = {
      experienceProfile: card.experience.profile,
      secondaryExperienceProfiles: card.experience.secondaryProfiles ?? [],
      formatPack: packByProfile.get(card.output.formatProfile).id,
      targetProfileRef: card.output.targetProfileRef,
      capabilityPacks: [...card.capabilities],
      resolvedRuleIds,
      resolvedTestIds,
      nonApplicableRuleIds: ruleIds.filter((ruleId) => !resolvedRuleIds.includes(ruleId)),
      exceptionRefs: []
    };
    manifest.representation.navigation = {
      mode: card.navigation.mode,
      brandDestinationRef: card.navigation.brandDestinationRef,
      sideBookmark: card.navigation.sideBookmark,
      sideBookmarkUserBenefit: card.navigation.sideBookmarkUserBenefit,
      destinations: []
    };
    manifest.representation.actionIds = [action.id];
    manifest.representation.claimIds = [claimRecord.claimId];
    manifest.representation.claimManifestRef = card.publication.claimManifestRef;
    manifest.representation.claimManifestSha256 = card.publication.claimManifestSha256;
    manifest.representation.claimAsOf = card.publication.claimAsOf;
    manifest.representation.localeStates = structuredClone(card.locale.states);
    manifest.delivery = {
      files: deliveryFiles,
      contentInspections,
      assetBindings: [],
      implementationBindings: {
        formatKit: {
          ref: files.formatKits,
          sha256: sha256File(join(root, files.formatKits)),
          schemaRef: release.schemaIds.formatKit,
          id: packByProfile.get(card.output.formatProfile).kitRef
        },
        targetProfile: {
          ref: files.targetProfiles,
          sha256: sha256File(join(root, files.targetProfiles)),
          schemaRef: release.schemaIds.targetProfile,
          id: card.output.targetProfileRef
        },
        preset: {
          ref: resolvedImplementationRef,
          sha256: sha256File(join(root, resolvedImplementationRef)),
          schemaRef: release.schemaIds.formatImplementation,
          id: resolvedImplementation.recordId
        }
      },
      implementationSourceBindings: [],
      metadataProjection: {
        kind: "format_metadata",
        formatProfile: card.output.formatProfile,
        title: card.artifact.title,
        locale: card.locale.primary,
        publicRevisionLabel: "Production-verified social fixture",
        pageOrFrameLabel: "1080 × 1080 feed creative"
      },
      accessibilityProjection: { status: "not_tested", reason: "Replaced below by the verified social accessibility projection." },
      socialSidecarBinding: {
        ref: sidecarRef,
        sha256: sha256File(join(root, sidecarRef)),
        mediaType: "application/json",
        schemaRef: release.schemaIds.socialSidecar,
        schemaSha256: sha256File(join(packageDir, files.socialSidecarSchema)),
        sidecarId: sidecar.sidecarId,
        artifactBuildId,
        creativePath,
        creativeSha256
      }
    };
    const requiredTestCriteria = resolvedTestCriteria(card);
    manifest.validation = {
      packageValidation: "passed",
      artifactAutomated: "passed",
      artifactManual: "passed",
      productionVerification: "passed",
      conformanceLevel: "production_verified",
      layerResults: {},
      resolvedTestResults: resolvedTestIds.map((testId, index) => {
        const method = resolvedTestMethod(testId);
        const criterion = requiredTestCriteria.get(testId);
        const checkedAt = method === "production" ? productionObservedAt : "2026-09-01T00:57:00+07:00";
        const evidenceRef = `receipts/social-resolved-test-${String(index + 1).padStart(2, "0")}.json`;
        const evidence = {
          kind: method === "production" ? "production_observation" : `${method}_record`,
          testId,
          artifactBuildId,
          result: "pass",
          method,
          observedAt: checkedAt,
          criterion,
          criterionSha256: sha256Bytes(criterion),
          summary: `Criterion-bound social artifact evidence for ${testId}`
        };
        if (method === "production") Object.assign(evidence, {
          httpStatus: 200,
          contentSha256: creativeSha256,
          contentEquivalent: true
        });
        writeFixtureJson(join(root, evidenceRef), evidence);
        return { testId, method, result: "pass", criterion, criterionSha256: sha256Bytes(criterion), evidenceRef, evidenceSha256: sha256File(join(root, evidenceRef)), checkedAt };
      }),
      gateResults: [],
      promotionSnapshot: null
    };

    const accessibilitySummary = expectedAccessibilityProjectionSummary(card);
    const accessibilityFixtureIds = resolvedImplementation.requirements.accessibilityFixtureIds;
    const accessibilityReportRef = "receipts/social-accessibility-fixtures.json";
    writeFixtureJson(join(root, accessibilityReportRef), {
      formatProfile: card.output.formatProfile,
      primaryLocale: card.locale.primary,
      summary: accessibilitySummary,
      fixtures: accessibilityFixtureIds,
      results: accessibilityFixtureIds.map((fixtureId) => {
        const result = manifest.validation.resolvedTestResults.find((entry) => entry.testId === fixtureId);
        return { fixtureId, status: "passed", evidenceRef: result.evidenceRef, evidenceSha256: result.evidenceSha256 };
      }),
      blockingFailureCount: 0
    });
    manifest.delivery.accessibilityProjection = {
      status: "verified",
      formatProfile: card.output.formatProfile,
      primaryLocale: card.locale.primary,
      ...accessibilitySummary,
      blockingFailureCount: 0,
      fixtureReportRef: accessibilityReportRef,
      fixtureReportSha256: sha256File(join(root, accessibilityReportRef))
    };

    const sourceDefinitions = [
      { role: "editable_source", ref: "social-editable-source.json", mediaType: "application/json", body: { kind: "social_editable_source", canvas: { widthPx: 1080, heightPx: 1080 }, creativePath } },
      { role: "export_preset", ref: "social-export-preset.json", mediaType: "application/json", body: { kind: "social_export_preset", format: "png", widthPx: 1080, heightPx: 1080, colorSpace: "sRGB" } }
    ];
    for (const [index, definition] of sourceDefinitions.entries()) {
      writeFixtureJson(join(root, definition.ref), definition.body);
      const binding = {
        role: definition.role,
        ref: definition.ref,
        sha256: sha256File(join(root, definition.ref)),
        mediaType: definition.mediaType,
        audienceDelivered: false,
        lineageReceiptRef: `receipts/social-source-${index + 1}.lineage.json`,
        lineageReceiptSha256: "",
        lineageAttestationRef: `receipts/social-source-${index + 1}.lineage.attestation.json`,
        lineageAttestationSha256: ""
      };
      const lineage = {
        schemaVersion: "1.0",
        releaseRef,
        receiptId: `lineage.social-source-${index + 1}.production-verified`,
        artifactId: manifest.artifact.id,
        artifactBuildId,
        source: { role: binding.role, ref: binding.ref, sha256: binding.sha256, mediaType: binding.mediaType },
        process: {
          processId: `fixture-social-export.${index + 1}`,
          tool: "landometer-social-fixture-renderer",
          toolVersion: tuple.machinePackage,
          parametersSha256: sha256Bytes(canonicalJson({ formatProfile: card.output.formatProfile, targetProfileRef: card.output.targetProfileRef, role: binding.role }))
        },
        outputs: deliveryFiles,
        executedAt: "2026-09-01T00:45:00+07:00"
      };
      writeFixtureJson(join(root, binding.lineageReceiptRef), lineage);
      binding.lineageReceiptSha256 = sha256File(join(root, binding.lineageReceiptRef));
      const lineageAttestation = createSignedAttestation({
        purpose: "source_lineage",
        subjectRef: binding.lineageReceiptRef,
        subjectSha256: binding.lineageReceiptSha256,
        attestationId: `attestation.lineage.social-source-${index + 1}.production-verified`,
        issuedAt: lineage.executedAt
      }, signer);
      writeFixtureJson(join(root, binding.lineageAttestationRef), lineageAttestation);
      binding.lineageAttestationSha256 = sha256File(join(root, binding.lineageAttestationRef));
      manifest.delivery.implementationSourceBindings.push(binding);
    }

    const owner = "social-qa-owner";
    const makeReceipt = (checkId, method, criterion) => {
      const receiptRef = `receipts/${checkId}.social.json`;
      const attestationRef = `receipts/${checkId}.social.attestation.json`;
      const evidenceRef = `receipts/${checkId}.social.evidence.json`;
      const testCaseId = `${checkId.toLowerCase()}.social-criterion`;
      const evidenceKind = method === "automated" ? "runner_report" : method === "production" ? "production_observation" : method === "visual" ? "screenshot" : method === "interaction" ? "interaction_log" : method === "accessibility" ? "accessibility_report" : "review_record";
      writeFixtureJson(join(root, evidenceRef), { checkId, method, protocolId: `lds-v0.9.4/${checkId}`, result: "pass", testCaseIds: [testCaseId] });
      const checkedAt = method === "production" ? productionObservedAt : promotionCheckedAt;
      const verification = method === "automated" ? {
        kind: "automated_runner", tool: "lds-artifact-validator", toolVersion: tuple.machinePackage, invocationId: `${checkId.toLowerCase()}.social`,
        startedAt: "2026-09-01T00:59:50+07:00", completedAt: "2026-09-01T00:59:55+07:00", exitCode: 0
      } : method === "production" ? {
        kind: "delivery_probe", probeId: `${checkId.toLowerCase()}.social-delivery`, environment: "final_export", channel: card.output.formatContext.channel,
        observedFiles: deliveryFiles, observedAt: productionObservedAt, contentEquivalent: true
      } : {
        kind: "human_review", reviewer: owner, reviewProtocolId: `lds-v0.9.4/${checkId}`, fixtureIds: [testCaseId], blockingFindingCount: 0, reviewedAt: "2026-09-01T00:59:55+07:00"
      };
      const evidenceFiles = [{ path: evidenceRef, sha256: sha256File(join(root, evidenceRef)), mediaType: "application/json", kind: evidenceKind }];
      const evidenceRefs = [evidenceRef];
      if (["OUTPUT-CLARITY-01-A", "OUTPUT-CLARITY-01-B"].includes(checkId)) {
        for (const inspection of contentInspections) {
          evidenceFiles.push({ path: inspection.evidenceRef, sha256: inspection.evidenceSha256, mediaType: "application/json", kind: "extracted_text" });
          evidenceRefs.push(inspection.evidenceRef);
        }
      }
      const receipt = {
        schemaVersion: "1.2",
        releaseRef,
        receiptId: `receipt.${checkId.toLowerCase()}.social-production`,
        artifactId: manifest.artifact.id,
        artifactBuildId,
        checkId,
        method,
        result: "pass",
        assertion: criterion,
        criterionSha256: sha256Bytes(criterion),
        protocolId: `lds-v0.9.4/${checkId}`,
        owner,
        checkedAt,
        subjectFiles: deliveryFiles,
        evidenceFiles,
        evidenceRefs,
        testCases: [{ id: testCaseId, fixture: "Final 1080 × 1080 hash-bound social creative", expected: criterion, actual: `No blocking deviation was observed for ${checkId}.`, result: "pass", evidenceRefs }],
        verification,
        attestationRef
      };
      writeFixtureJson(join(root, receiptRef), receipt);
      const receiptSha256 = sha256File(join(root, receiptRef));
      const attestation = createSignedAttestation({
        purpose: conformanceAttestationPurpose(method),
        subjectRef: receiptRef,
        subjectSha256: receiptSha256,
        attestationId: `attestation.${checkId.toLowerCase()}.social-production`,
        issuedAt: checkedAt
      }, signer);
      writeFixtureJson(join(root, attestationRef), attestation);
      return { receiptRef, receiptSha256, attestationRef, attestationSha256: sha256File(join(root, attestationRef)), checkedAt, owner };
    };
    for (const layer of ["discovery", "readability", "action"]) {
      const checkId = `LAYER-${layer.toUpperCase()}`;
      manifest.validation.layerResults[layer] = {
        result: "pass",
        reason: "Validated against the final social creative and its governed publication projection.",
        ...makeReceipt(checkId, "automated", layerAcceptanceCriteria[checkId])
      };
    }
    for (const acceptance of resolvedAcceptanceContracts(manifest, card)) {
      manifest.validation.gateResults.push({
        checkId: acceptance.checkId,
        method: acceptance.method,
        result: "pass",
        reason: "Validated against the final social creative and its governed publication projection.",
        ...makeReceipt(acceptance.checkId, acceptance.method, acceptance.criterion)
      });
    }
    manifest.representation.outputClarity.residueScanReceiptRef = manifest.validation.gateResults.find((gate) => gate.checkId === "OUTPUT-CLARITY-01-B")?.receiptRef;
    const promotionSnapshotRef = "receipts/social-promotion-snapshot.json";
    const promotionAttestationRef = "receipts/social-promotion-snapshot.attestation.json";
    const productionSnapshotCreatedAt = "2026-09-01T01:06:00+07:00";
    const promotionSnapshot = {
      schemaVersion: "1.0",
      releaseRef,
      snapshotId: `promotion.production-verified.${artifactBuildId}`,
      conformanceLevel: manifest.validation.conformanceLevel,
      artifactId: manifest.artifact.id,
      artifactBuildId,
      buildCard: { ref: manifest.artifact.buildCardRef, sha256: manifest.artifact.buildCardSha256 },
      artifactManifest: { ref: "artifact-manifest.social-promoted.json", canonicalPromotionProjectionSha256: sha256Bytes(canonicalJson(canonicalPromotionManifestProjection(manifest))) },
      preset: { ref: manifest.delivery.implementationBindings.preset.ref, sha256: manifest.delivery.implementationBindings.preset.sha256 },
      socialSidecar: { ref: manifest.delivery.socialSidecarBinding.ref, sha256: manifest.delivery.socialSidecarBinding.sha256 },
      implementationSources: sortedCanonical(manifest.delivery.implementationSourceBindings.map((source) => ({
        ref: source.ref,
        sha256: source.sha256,
        lineageReceiptRef: source.lineageReceiptRef,
        lineageReceiptSha256: source.lineageReceiptSha256,
        lineageAttestationRef: source.lineageAttestationRef,
        lineageAttestationSha256: source.lineageAttestationSha256
      }))),
      outputs: sortedCanonical(deliveryFiles),
      receipts: promotionReceiptBindings(manifest),
      createdAt: productionSnapshotCreatedAt
    };
    writeFixtureJson(join(root, promotionSnapshotRef), promotionSnapshot);
    const promotionSnapshotSha256 = sha256File(join(root, promotionSnapshotRef));
    const promotionAttestation = createSignedAttestation({
      purpose: "promotion_snapshot",
      subjectRef: promotionSnapshotRef,
      subjectSha256: promotionSnapshotSha256,
      attestationId: `attestation.promotion.production-verified.${artifactBuildId}`,
      issuedAt: productionSnapshotCreatedAt
    }, signer);
    writeFixtureJson(join(root, promotionAttestationRef), promotionAttestation);
    manifest.validation.promotionSnapshot = {
      ref: promotionSnapshotRef,
      sha256: promotionSnapshotSha256,
      schemaRef: release.schemaIds.promotionSnapshot,
      attestationRef: promotionAttestationRef,
      attestationSha256: sha256File(join(root, promotionAttestationRef))
    };
    const rewriteSidecar = () => {
      writeFixtureJson(join(root, sidecarRef), sidecar);
      manifest.delivery.socialSidecarBinding.sha256 = sha256File(join(root, sidecarRef));
    };
    const rewriteDestinationEvidence = () => {
      writeFixtureJson(join(root, destinationEvidenceRef), destinationEvidence);
      sidecar.actionBinding.destinationVerification.evidenceSha256 = sha256File(join(root, destinationEvidenceRef));
      rewriteSidecar();
    };
    const rewriteVisibleEvidence = () => {
      writeFixtureJson(join(root, visibleEvidenceRef), visibleEvidence);
      sidecar.visibleCopyInspection.evidenceSha256 = sha256File(join(root, visibleEvidenceRef));
      rewriteSidecar();
    };
    const evaluate = () => [
      ...validateSchema(buildSchema, card),
      ...buildCrossErrors(card, null, root),
      ...validateSchema(documents.get(files.artifactManifestSchema), manifest),
      ...validateSchema(socialSidecarSchema, sidecar),
      ...artifactCrossErrors(manifest, card, root, [operatorTrustStore])
    ];
    callback({ root, card, manifest, sidecar, destinationEvidence, visibleEvidence, audienceEvidence, rewriteSidecar, rewriteDestinationEvidence, rewriteVisibleEvidence, evaluate });
  } finally {
    fixtureExternalTrustStores.delete(resolve(root));
    rmSync(root, { recursive: true, force: true });
    rmSync(operatorRoot, { recursive: true, force: true });
  }
}

function referenceImplementationForPlatform(referenceRecord, authoringPlatform) {
  const projected = structuredClone(referenceRecord);
  projected.authoringPlatform = authoringPlatform;
  const selectedImplementation = identityImplementationById.get(projected.requirements.identityImplementationIds[0]);
  const binding = (selectedImplementation?.typographyBindings ?? []).find((entry) => entry.formatProfile === projected.formatProfile && entry.platform === authoringPlatform);
  projected.requirements.identityTypographyBindingIds = [binding?.id].filter(isNonEmpty);
  const mappingRoles = [...new Set((projected.requirements.nativeFontMappingIds ?? []).map((id) => nativeFontMappingById.get(id)?.role).filter(isNonEmpty))];
  projected.requirements.nativeFontMappingIds = mappingRoles.map((role) => [...nativeFontMappingById.values()].find((mapping) => mapping.platform === authoringPlatform && mapping.role === role && (mapping.allowedFormatProfiles ?? []).includes(projected.formatProfile))?.id).filter(isNonEmpty);
  const mappingRecords = projected.requirements.nativeFontMappingIds.map((id) => nativeFontMappingById.get(id)).filter(Boolean);
  projected.requirements.portabilityFixtureIds = orderedUniqueValues(
    ...mappingRecords.map((mapping) => mapping.requiredFixtureIds),
    binding?.requiredFixtureIds,
    nonWebIconPortabilityFixtureIds
  );
  return projected;
}

function withRenderedInspectionFixture({ filename = "opaque.pdf", mediaType = "application/pdf", unitKind = "page" } = {}, callback) {
  const root = mkdtempSync(join(tmpdir(), "lds-v094-rendered-inspection-"));
  try {
    mkdirSync(join(root, "renders"));
    mkdirSync(join(root, "receipts"));
    const subjectPath = join(root, filename);
    writeFileSync(subjectPath, Buffer.from(`opaque ${filename} fixture bytes\n`, "utf8"));
    const renderRef = `renders/${unitKind}-1.png`;
    const renderPath = join(root, renderRef);
    writeFileSync(renderPath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64"));
    const unit = {
      index: 1,
      renderRef,
      renderSha256: sha256File(renderPath),
      renderMediaType: "image/png",
      textExtractionPerformed: true,
      ocrPerformed: true,
      visualReviewPerformed: true,
      imageOnlyOrOutlinedTextReviewed: true,
      extractedText: "Extracted visible text.",
      ocrText: "OCR-visible text.",
      visualReviewText: "No additional image-only or outlined text was found.",
      combinedVisibleText: ""
    };
    unit.combinedVisibleText = deterministicCombinedRenderedUnitText(unit);
    const visibleText = unit.combinedVisibleText;
    const delivered = { path: filename, sha256: sha256File(subjectPath), mediaType };
    const inspectedAt = "2026-09-01T00:55:00+07:00";
    const evidenceRef = "receipts/audience-content-opaque.json";
    const evidencePath = join(root, evidenceRef);
    const method = filename.endsWith(".pdf") ? "pdf_text_extraction" : "office_text_extraction";
    const evidence = {
      kind: "audience_content_inspection",
      subjectPath: filename,
      subjectSha256: delivered.sha256,
      subjectMediaType: mediaType,
      method,
      result: "pass",
      inspectedAt,
      sourceByteCount: statSync(subjectPath).size,
      extractionComplete: true,
      textExtractionPerformed: true,
      ocrPerformed: true,
      visualReviewPerformed: true,
      imageOnlyOrOutlinedTextReviewed: true,
      renderedUnitKind: unitKind,
      sourceUnitCount: 1,
      renderedUnitCount: 1,
      renderedUnitCoverage: "every_page_or_slide",
      combinedReviewMethod: "text_extraction_plus_ocr_plus_visual_review",
      renderedUnits: [unit],
      visibleText,
      summary: "Every rendered unit was checked through extraction, OCR, and visual review, including image-only and outlined text."
    };
    writeFixtureJson(evidencePath, evidence);
    const inspection = {
      subjectPath: filename,
      subjectSha256: delivered.sha256,
      subjectMediaType: mediaType,
      method,
      result: "pass",
      evidenceRef,
      evidenceSha256: sha256File(evidencePath),
      inspectedAt,
      renderedUnitKind: unitKind,
      renderedUnitCount: 1,
      renderedUnitCoverage: "every_page_or_slide",
      combinedReviewMethod: "text_extraction_plus_ocr_plus_visual_review",
      imageOnlyOrOutlinedTextReviewed: true,
      combinedVisibleTextSha256: sha256Bytes(visibleText)
    };
    const manifest = { artifact: { builtAt: "2026-09-01T00:40:00+07:00" }, delivery: { files: [delivered], contentInspections: [inspection] } };
    const persistEvidence = () => {
      writeFixtureJson(evidencePath, evidence);
      inspection.evidenceSha256 = sha256File(evidencePath);
    };
    return callback({ root, manifest, inspection, evidence, evidencePath, renderPath, persistEvidence });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (!downstreamMode) {
if (build && buildSchema) {
  const evaluateBuild = (value) => [...validateSchema(buildSchema, value), ...buildCrossErrors(value)];
  const baseline = evaluateBuild(build);
  const probe = (label, mutate, expected) => {
    const mutated = structuredClone(build);
    mutate(mutated);
    expectRejected(label, baseline, evaluateBuild(mutated), expected);
  };
  probe("duplicate-action-id", (value) => { value.actions[1].id = value.actions[0].id; }, /action IDs are not unique/);
  probe("dangling-primary-action", (value) => { value.experience.primaryActionRef = "missing"; }, /primaryActionRef is dangling/);
  probe("locale-primary-mismatch", (value) => { value.locale.primary = "fr"; }, /locale\.primary is not available/);
  probe("unknown-target", (value) => { value.output.targetProfileRef = "target.unknown.01"; }, /targetProfileRef is unknown/);
  probe("capability-config-drift", (value) => { delete value.capabilityConfigRefs.motion; }, /capabilities and capabilityConfigRefs keys differ/);
  probe("nonpublic-indexable", (value) => { value.publication.public = false; }, /deliveryAudience public and publication\.public must agree/);
  probe("bookmark-without-eligibility", (value) => { value.composition.sideBookmarkEligible = false; }, /bookmark selected without eligibility/);
  probe("interactive-selected-bookmark-requires-governed-component", (value) => {
    value.composition.componentIds = value.composition.componentIds.filter((componentId) => componentId !== "component.bookmark.side.01");
  }, /component\.bookmark\.side\.01|side-bookmark selection and component inventory disagree|must contain at least 1 matching items/);
  {
    const interactiveOmittedBookmark = structuredClone(build);
    interactiveOmittedBookmark.navigation.sideBookmark = "omitted";
    interactiveOmittedBookmark.navigation.sideBookmarkUserBenefit = null;
    interactiveOmittedBookmark.composition.componentIds = interactiveOmittedBookmark.composition.componentIds.filter((componentId) => componentId !== "component.bookmark.side.01");
    const cleanInteractiveOmittedBookmark = evaluateBuild(interactiveOmittedBookmark);
    check(cleanInteractiveOmittedBookmark.length === 0, `interactive omitted bookmark with no governed bookmark component must pass the full Build Card contract${cleanInteractiveOmittedBookmark.length ? `\n  ${cleanInteractiveOmittedBookmark.join("\n  ")}` : ""}`);
    const interactiveOmittedWithComponent = structuredClone(interactiveOmittedBookmark);
    interactiveOmittedWithComponent.composition.componentIds.splice(2, 0, "component.bookmark.side.01");
    expectRejected(
      "interactive-omitted-bookmark-forbids-governed-component",
      cleanInteractiveOmittedBookmark,
      evaluateBuild(interactiveOmittedWithComponent),
      /component\.bookmark\.side\.01|side-bookmark selection and component inventory disagree|must NOT be valid/
    );
    const interactiveSelectedWithoutComponent = structuredClone(build);
    interactiveSelectedWithoutComponent.composition.componentIds = interactiveSelectedWithoutComponent.composition.componentIds.filter((componentId) => componentId !== "component.bookmark.side.01");
    const interactiveReference = documents.get(referenceImplementationFilesByVariant.get("web_public.browser"));
    let resolverBlockedIncompleteInteractiveBookmark = false;
    try {
      artifactResolvedImplementationRecord(interactiveReference, interactiveSelectedWithoutComponent, "selected-bookmark-missing-component", "build-card.invalid.json", "0".repeat(64));
    } catch (error) {
      resolverBlockedIncompleteInteractiveBookmark = /inconsistent side-bookmark selection\/component inventory/.test(String(error?.message ?? error));
    }
    check(resolverBlockedIncompleteInteractiveBookmark, "artifact resolver must block an interactive selected bookmark whose governed component contract is absent from the Build Card inventory");
  }
  probe("navigation-anchor-must-resolve-to-section", (value) => { value.navigation.destinations.find((destination) => destination.kind === "anchor").target = "#missing-section"; }, /does not resolve to a composed section/);
  probe("site-navigation-cannot-be-anchor-only", (value) => { value.navigation.destinations = value.navigation.destinations.filter((destination) => destination.kind === "anchor"); }, /site navigation requires an ecosystem or property route/);
  probe("social-static-cannot-require-side-bookmark", (value) => { value.output.formatProfile = "social_static"; }, /side bookmark is incompatible with format profile social_static/);
  probe("empty-qa", (value) => { value.qa.manual = []; }, /qa\.manual must be non-empty/);
  probe("brand-required-cannot-omit-identity", (value) => { delete value.identityImplementation; }, /identityImplementation|brandRequired output lacks an identity implementation/);
  probe("governed-text-identity-must-resolve", (value) => { value.identityImplementation.id = "identity.text.missing.01"; }, /does not resolve to the governed text-identity registry/);
  probe("governed-text-identity-cannot-reconstruct-logo", (value) => { value.identityImplementation.logoAssetId = "identity.landometer.horizontal.source-candidate.01"; }, /logoAssetId.*must be null|must not claim or reconstruct a logo asset/);
  probe("blank-destination", (value) => { value.actions[0].destinationBinding.target = " "; value.actions[0].destinationBinding.targetByLocale["th-TH"] = " "; }, /destination target does not match|must have length at least 1/);
  probe("destination-kind-target-drift", (value) => { value.actions[0].destinationBinding.kind = "external"; }, /destination target does not match kind external|must match pattern/);
  probe("destination-locale-kind-drift", (value) => { value.actions[1].destinationBinding.targetByLocale.en = "http:\/\/example.invalid"; }, /destination target for en does not match kind external/);
  probe("public-blocking-dependency", (value) => { value.audienceOutput.blockingDependencyRefs = ["dependency:identity-role"]; }, /public artifact has blocking dependency refs/);
  probe("public-candidate-asset", (value) => { value.assets = [{ id: "asset.unapproved.01", role: "identity", surface: "web_header", source: "asset-registry.json#asset.unapproved.01", approvalStatus: "candidate" }]; }, /unapproved asset .*only in internal_preview/);
  probe("self-declared-approved-identity", (value) => { value.assets = [{ id: "identity.fake.approved.01", role: "identity", surface: "web_header", source: "asset-registry.json#identity.fake.approved.01", approvalStatus: "approved" }]; }, /does not resolve inside the artifact bundle|does not resolve to the identity registry collection/);
  probe("public-governance-visible", (value) => { value.audienceOutput.internalGovernanceVisibility = "visible"; }, /internalGovernanceVisibility.*must equal const "hidden"/);
  probe("untracked-blocking-assumption", (value) => { value.assumptions = [{ id: "assumption.truth.01", statement: "Unverified claim is correct.", impactDomain: "truth", status: "unresolved_blocking", rationale: "Evidence is not yet available." }]; }, /blocking assumption .* is missing assumption:/);
  probe("high-impact-nonblocking-assumption", (value) => { value.assumptions = [{ id: "assumption.truth.01", statement: "Unverified claim is correct.", impactDomain: "truth", status: "bounded_non_blocking", rationale: "Incorrectly classified." }]; }, /non-blocking assumption .* affects a governed outcome|high-impact assumption/);
  probe("duplicate-assumption-id", (value) => { value.assumptions = [
    { id: "assumption.layout.01", statement: "A compact composition is sufficient.", impactDomain: "composition_only", status: "bounded_non_blocking", rationale: "No governed meaning changes." },
    { id: "assumption.layout.01", statement: "A wide composition is sufficient.", impactDomain: "composition_only", status: "bounded_non_blocking", rationale: "No governed meaning changes." }
  ]; }, /assumption IDs are not unique/);
  probe("duplicate-locale-state", (value) => { value.locale.states.push({ ...value.locale.states[0] }); }, /locale\.states contains duplicate locales/);
  probe("missing-action-locale", (value) => { delete value.actions[0].labelByLocale.en; }, /labelByLocale must cover delivered locales exactly|labelByLocale misses en/);
  probe("primary-action-label-drift", (value) => { value.actions[0].label = "Primary label drift"; }, /label must equal the primary-locale label/);
  probe("blank-navigation-locale", (value) => { value.navigation.destinations[0].labelByLocale.en = ""; }, /navigation .*labelByLocale must cover delivered locales exactly|must have length at least 1/);
  probe("duplicate-navigation-target", (value) => { value.navigation.destinations.push(structuredClone(value.navigation.destinations[0])); }, /navigation destination targets must be unique/);
  probe("interactive-navigation-requires-current-page", (value) => { value.navigation.destinations.find((destination) => destination.current === "page").current = "none"; }, /interactive navigation must identify exactly one current page route|must contain at least 1 matching items/);
  probe("interactive-navigation-rejects-second-current-page", (value) => {
    value.navigation.destinations.push({
      label: "อีกหน้าหนึ่ง",
      labelByLocale: { "th-TH": "อีกหน้าหนึ่ง", en: "Another page" },
      target: "./another-page",
      level: "property",
      kind: "route",
      group: "utility",
      breakpointExposure: { desktop: "disclosure", mobile: "disclosure" },
      current: "page"
    });
  }, /interactive navigation must identify exactly one current page route|must contain at most 1 matching items/);
  probe("side-bookmark-requires-current-location", (value) => { value.navigation.destinations.find((destination) => destination.current === "location").current = "none"; }, /interactive side bookmark requires exactly one current page-local location|must contain at least 1 matching items/);
  probe("interactive-navigation-rejects-second-current-location", (value) => { value.navigation.destinations.find((destination) => destination.target === "#question").current = "location"; }, /at most one current in-page location|must contain at most 1 matching items/);
  probe("current-page-cannot-be-an-anchor", (value) => { value.navigation.destinations.find((destination) => destination.kind === "anchor").current = "page"; }, /current page .* must be a route destination|must be equal to one of the allowed values/);
  probe("navigation-budget-counts-every-header-control", (value) => {
    for (let index = 1; index <= 4; index += 1) {
      value.navigation.destinations.push({
        label: `Utility ${index}`,
        labelByLocale: { "th-TH": `ยูทิลิตี ${index}`, en: `Utility ${index}` },
        target: `./utility-${index}`,
        level: "property",
        kind: "route",
        group: "utility",
        breakpointExposure: { desktop: "header", mobile: "disclosure" },
        current: "none"
      });
    }
  }, /navigation control budgets exceed/);
  probe("browser-navigation-rejects-native-unit", (value) => { value.navigation.controlBudgets.minimumDirectTarget.unit = "platform_dp"; }, /css_px|value and unit contract|selected target profile/);
  {
    const staticSelectedBookmarkCard = ({ formatProfile, targetProfileRef, mode, staticExposure }) => {
      const card = structuredClone(build);
      const identityByFormat = {
        document_flow: { surface: "document_identity", typographyBindingId: "identity-typography.document.macos.01", nativeMappingId: "fontmap.macos.identity-latin.georgia-bold.01" },
        pdf_fixed: { surface: "pdf_identity", typographyBindingId: "identity-typography.pdf.macos.01", nativeMappingId: "fontmap.macos.identity-latin.georgia-bold.01" },
        deck_presentation: { surface: "deck_identity", typographyBindingId: "identity-typography.deck.macos.01", nativeMappingId: "fontmap.macos.identity-latin.georgia-bold.01" }
      };
      card.output = {
        formatProfile,
        runtime: "static",
        delivery: "hybrid",
        targetProfileRef,
        viewportOrPage: formatProfile === "deck_presentation" ? "16:9 presentation" : "A4 portrait",
        interactive: false,
        offlineRequired: true
      };
      if (formatProfile === "deck_presentation") card.output.formatContext = {
        kind: "deck_context",
        audienceSituation: "in_room",
        roomType: "meeting_room",
        screenDiagonalInches: 65,
        viewingDistanceMeters: 5,
        durationMinutes: 12,
        presentationMode: "presenter_led"
      };
      card.navigation = {
        mode,
        brandDestinationRef: null,
        destinations: [
          {
            id: "destination.related.property",
            role: "primary",
            label: "พร็อพเพอร์ตี Landometer",
            labelByLocale: { "th-TH": "พร็อพเพอร์ตี Landometer", en: "Landometer property" },
            target: "./property",
            level: "property",
            kind: "route",
            group: "ecosystem",
            staticExposure: "destination_cue",
            current: "none"
          },
          {
            id: "destination.related.external",
            role: "utility",
            label: "แหล่งข้อมูลที่เกี่ยวข้อง",
            labelByLocale: { "th-TH": "แหล่งข้อมูลที่เกี่ยวข้อง", en: "Related source" },
            target: "https://example.com/related",
            level: "ecosystem",
            kind: "external",
            group: "utility",
            staticExposure: "destination_cue",
            current: "none"
          },
          ...["question", "protected-line", "source"].map((sectionId, index) => ({
            id: `destination.page.${sectionId}`,
            role: "page_local",
            label: `ส่วนที่ ${index + 1}`,
            labelByLocale: { "th-TH": `ส่วนที่ ${index + 1}`, en: `Section ${index + 1}` },
            target: `#${sectionId}`,
            level: "page",
            kind: "anchor",
            group: "page_local",
            staticExposure,
            current: "none"
          }))
        ],
        sideBookmark: "selected",
        sideBookmarkUserBenefit: "A heading-derived page index keeps three stable sections findable without mixing global destinations into it."
      };
      card.composition.componentIds = ["component.bookmark.side.01", "component.cta.primary-navigational.01"];
      card.composition.sideBookmarkEligible = true;
      card.identityImplementation.surface = identityByFormat[formatProfile].surface;
      card.identityImplementation.typographyBindingId = identityByFormat[formatProfile].typographyBindingId;
      card.identityImplementation.nativeMappingId = identityByFormat[formatProfile].nativeMappingId;
      card.identityImplementation.fontAssetIds = [];
      card.assets = [];
      const staticTechnique = formatProfile === "document_flow" ? "working_link" : "working_link_with_visible_destination";
      for (const action of card.actions) action.destinationBinding.presentation = { mode: "static_equivalent", technique: staticTechnique };
      card.capabilities = card.capabilities.filter((capability) => !["motion", "agent_action"].includes(capability));
      delete card.capabilityConfigRefs.motion;
      delete card.capabilityConfigRefs.agent_action;
      card.experience.motionDecision = "no_motion";
      card.experience.motionBenefit = [];
      card.experience.motionAssignments = [];
      card.experience.ctaDiscoveryCueAssignments = [];
      card.experience.noMotionReason = "The static artifact exposes the complete final structure without motion.";
      delete card.publication.discovery;
      card.publication.indexing = "not_applicable";
      card.publication.canonicalPolicy = "not_applicable";
      card.publication.sitemapEligible = false;
      card.publication.llmsNavigation = "not_applicable";
      return card;
    };
    const staticCases = [
      { formatProfile: "document_flow", targetProfileRef: "target.document.a4-portrait.01", mode: "document", staticExposure: "toc" },
      { formatProfile: "pdf_fixed", targetProfileRef: "target.pdf.a4-portrait.01", mode: "document", staticExposure: "pdf_bookmark" },
      { formatProfile: "deck_presentation", targetProfileRef: "target.deck.16x9.01", mode: "deck", staticExposure: "deck_section_marker" }
    ];
    for (const fixture of staticCases) {
      const staticCard = staticSelectedBookmarkCard(fixture);
      const cleanStaticNavigation = evaluateBuild(staticCard);
      check(cleanStaticNavigation.length === 0, `${fixture.formatProfile} selected static bookmark must pass the full Build Card schema and every cross-contract check${cleanStaticNavigation.length ? `\n  ${cleanStaticNavigation.join("\n  ")}` : ""}`);
      check(resolvedRules(staticCard).includes("BOOKMARK-01"), `${fixture.formatProfile} selected static bookmark must resolve BOOKMARK-01`);
      const referenceRecord = documents.get(referenceImplementationFilesByVariant.get(`${fixture.formatProfile}.static`));
      const resolvedImplementation = artifactResolvedImplementationRecord(referenceRecord, staticCard, `selected-bookmark-${fixture.formatProfile}`, `build-card.${fixture.formatProfile}.json`, "0".repeat(64));
      const resolvedImplementationErrors = validateSchema(formatImplementationSchema, resolvedImplementation);
      check(resolvedImplementationErrors.length === 0, `${fixture.formatProfile} selected static bookmark must resolve to a schema-valid artifact implementation record${resolvedImplementationErrors.length ? `\n  ${resolvedImplementationErrors.join("\n  ")}` : ""}`);
      check(sameValue(resolvedImplementation.requirements.componentIds, staticCard.composition.componentIds) && resolvedImplementation.requirements.componentContracts.length === staticCard.composition.componentIds.length, `${fixture.formatProfile} selected static bookmark resolver must cover every exact Build Card component in order`);
      check(resolvedImplementation.requirements.componentContracts.filter((contract) => contract.componentId === "component.bookmark.side.01").length === 1, `${fixture.formatProfile} selected static bookmark resolver must include exactly one governed bookmark component contract`);
      const projectedManifest = { representation: { navigation: structuredClone(staticCard.navigation) } };
      const cleanArtifactProjection = artifactNavigationProjectionErrors(projectedManifest, staticCard);
      check(cleanArtifactProjection.length === 0, `${fixture.formatProfile} Artifact Manifest must preserve the exact combined global/page-index navigation projection`);
      const driftedArtifactProjection = structuredClone(projectedManifest);
      driftedArtifactProjection.representation.navigation.destinations.find((destination) => destination.kind === "anchor").label = "Drifted page-index label";
      expectRejected(`${fixture.formatProfile}-artifact-navigation-projection-is-exact`, cleanArtifactProjection, artifactNavigationProjectionErrors(driftedArtifactProjection, staticCard), /artifact navigation projection differs/);

      const missingExposure = structuredClone(staticCard);
      delete missingExposure.navigation.destinations.find((destination) => destination.kind === "anchor").staticExposure;
      expectRejected(`${fixture.formatProfile}-static-bookmark-requires-exposure`, cleanStaticNavigation, [...validateSchema(buildSchema, missingExposure), ...navigationContractErrors(missingExposure)], /staticExposure|exact .* exposure/);

      const wrongExposure = structuredClone(staticCard);
      wrongExposure.navigation.destinations.find((destination) => destination.kind === "anchor").staticExposure = "destination_cue";
      expectRejected(`${fixture.formatProfile}-static-bookmark-rejects-wrong-exposure`, cleanStaticNavigation, [...validateSchema(buildSchema, wrongExposure), ...navigationContractErrors(wrongExposure)], /static page-index destination|static side bookmark anchors|must be equal to one of the allowed values/);

      const browserLeak = structuredClone(staticCard);
      browserLeak.navigation.destinations.find((destination) => destination.kind === "anchor").breakpointExposure = { desktop: "side_bookmark", mobile: "disclosure" };
      expectRejected(`${fixture.formatProfile}-static-bookmark-rejects-browser-exposure`, cleanStaticNavigation, [...validateSchema(buildSchema, browserLeak), ...navigationContractErrors(browserLeak)], /breakpointExposure|browser leakage|leaks browser/);

      const inventedCurrent = structuredClone(staticCard);
      inventedCurrent.navigation.destinations[0].current = "page";
      expectRejected(`${fixture.formatProfile}-static-navigation-rejects-invented-current`, cleanStaticNavigation, [...validateSchema(buildSchema, inventedCurrent), ...navigationContractErrors(inventedCurrent)], /static navigation must use current none|must be equal to constant/);

      const oneAnchor = structuredClone(staticCard);
      oneAnchor.navigation.destinations = oneAnchor.navigation.destinations.filter((destination) => destination.kind !== "anchor").concat(oneAnchor.navigation.destinations.find((destination) => destination.kind === "anchor"));
      expectRejected(`${fixture.formatProfile}-static-bookmark-requires-two-anchors`, cleanStaticNavigation, [...validateSchema(buildSchema, oneAnchor), ...navigationContractErrors(oneAnchor)], /at least two page-anchor destinations|must contain at least 2 matching items/);

      const duplicate = structuredClone(staticCard);
      duplicate.navigation.destinations[4].id = duplicate.navigation.destinations[3].id;
      duplicate.navigation.destinations[4].target = duplicate.navigation.destinations[3].target;
      expectRejected(`${fixture.formatProfile}-static-projection-rejects-duplicates`, cleanStaticNavigation, [...validateSchema(buildSchema, duplicate), ...navigationContractErrors(duplicate)], /IDs must be unique|targets must be unique|must match "then" schema/);

      const globalInPageIndex = structuredClone(staticCard);
      globalInPageIndex.navigation.destinations[0].staticExposure = fixture.staticExposure;
      expectRejected(`${fixture.formatProfile}-static-global-destination-cannot-enter-page-index`, cleanStaticNavigation, [...validateSchema(buildSchema, globalInPageIndex), ...navigationContractErrors(globalInPageIndex)], /static global destination .* destination_cue|must be equal to one of the allowed values/);

      const unsupportedSelector = structuredClone(staticCard);
      unsupportedSelector.navigation.destinations.push({
        id: "destination.unsupported.page-route",
        role: "utility",
        label: "Unsupported page route",
        labelByLocale: { "th-TH": "เส้นทางหน้าที่ไม่รองรับ", en: "Unsupported page route" },
        target: "./unsupported-page",
        level: "page",
        kind: "route",
        group: "utility",
        staticExposure: "destination_cue",
        current: "none"
      });
      expectRejected(`${fixture.formatProfile}-static-projection-rejects-unsupported-selector`, cleanStaticNavigation, [...validateSchema(buildSchema, unsupportedSelector), ...navigationContractErrors(unsupportedSelector)], /must resolve to exactly one global-related or page-index group/);

      const selectedWithoutBookmarkComponent = structuredClone(staticCard);
      selectedWithoutBookmarkComponent.composition.componentIds = selectedWithoutBookmarkComponent.composition.componentIds.filter((componentId) => componentId !== "component.bookmark.side.01");
      expectRejected(
        `${fixture.formatProfile}-selected-bookmark-requires-governed-component`,
        cleanStaticNavigation,
        evaluateBuild(selectedWithoutBookmarkComponent),
        /component\.bookmark\.side\.01|side-bookmark selection and component inventory disagree|must contain at least 1 matching items/
      );
      let resolverBlockedIncompleteStaticBookmark = false;
      try {
        artifactResolvedImplementationRecord(referenceRecord, selectedWithoutBookmarkComponent, `selected-bookmark-missing-component-${fixture.formatProfile}`, `build-card.invalid.${fixture.formatProfile}.json`, "0".repeat(64));
      } catch (error) {
        resolverBlockedIncompleteStaticBookmark = /inconsistent side-bookmark selection\/component inventory/.test(String(error?.message ?? error));
      }
      check(resolverBlockedIncompleteStaticBookmark, `${fixture.formatProfile} artifact resolver must block a selected bookmark whose governed component contract is absent from the Build Card inventory`);

      const omittedStaticBookmark = structuredClone(staticCard);
      omittedStaticBookmark.navigation.sideBookmark = "omitted";
      omittedStaticBookmark.navigation.sideBookmarkUserBenefit = null;
      omittedStaticBookmark.composition.componentIds = omittedStaticBookmark.composition.componentIds.filter((componentId) => componentId !== "component.bookmark.side.01");
      const cleanOmittedStaticBookmark = evaluateBuild(omittedStaticBookmark);
      check(cleanOmittedStaticBookmark.length === 0, `${fixture.formatProfile} omitted bookmark with no governed bookmark component must pass the full Build Card contract${cleanOmittedStaticBookmark.length ? `\n  ${cleanOmittedStaticBookmark.join("\n  ")}` : ""}`);
      const omittedStaticWithBookmarkComponent = structuredClone(omittedStaticBookmark);
      omittedStaticWithBookmarkComponent.composition.componentIds.unshift("component.bookmark.side.01");
      expectRejected(
        `${fixture.formatProfile}-omitted-bookmark-forbids-governed-component`,
        cleanOmittedStaticBookmark,
        evaluateBuild(omittedStaticWithBookmarkComponent),
        /component\.bookmark\.side\.01|side-bookmark selection and component inventory disagree|must NOT be valid/
      );
      let resolverBlockedOmittedStaticBookmarkComponent = false;
      try {
        artifactResolvedImplementationRecord(referenceRecord, omittedStaticWithBookmarkComponent, `omitted-bookmark-with-component-${fixture.formatProfile}`, `build-card.invalid-omitted.${fixture.formatProfile}.json`, "0".repeat(64));
      } catch (error) {
        resolverBlockedOmittedStaticBookmarkComponent = /inconsistent side-bookmark selection\/component inventory/.test(String(error?.message ?? error));
      }
      check(resolverBlockedOmittedStaticBookmarkComponent, `${fixture.formatProfile} artifact resolver must block an omitted bookmark that retains the governed bookmark component`);
    }
    const noneMode = staticSelectedBookmarkCard(staticCases[0]);
    noneMode.navigation = { mode: "none", brandDestinationRef: null, destinations: [], sideBookmark: "omitted", sideBookmarkUserBenefit: null };
    noneMode.composition.componentIds = ["component.cta.primary-navigational.01"];
    check(evaluateBuild(noneMode).length === 0, "static navigation mode none must pass the full Build Card contract without a fake current destination");
  }
  {
    const nativeMotionCard = structuredClone(build);
    nativeMotionCard.output.formatProfile = "app_interactive";
    nativeMotionCard.output.runtime = "native";
    nativeMotionCard.output.targetProfileRef = "target.app.native-responsive.360-1280.01";
    nativeMotionCard.output.viewportOrPage = "native responsive 360–1280 platform dp";
    nativeMotionCard.navigation.controlBudgets.minimumDirectTarget = { value: 44, unit: "platform_dp" };
    delete nativeMotionCard.publication.discovery;
    nativeMotionCard.experience.ctaDiscoveryCueAssignments = [];
    for (const assignment of nativeMotionCard.experience.motionAssignments) {
      delete assignment.observerFailure;
      assignment.nativeInterruption = "final_state";
    }
    const nativeSchemaBaseline = validateSchema(buildSchema, nativeMotionCard);
    const nativeNavigationBaseline = navigationContractErrors(nativeMotionCard);
    const nativeMotionBaseline = motionAssignmentErrors(nativeMotionCard);
    check(nativeSchemaBaseline.length === 0, `native motion Build Card must satisfy the active schema${nativeSchemaBaseline.length ? `\n  ${nativeSchemaBaseline.join("\n  ")}` : ""}`);
    check(nativeNavigationBaseline.length === 0, `native navigation must bind 44 platform_dp to its selected target profile${nativeNavigationBaseline.length ? `\n  ${nativeNavigationBaseline.join("\n  ")}` : ""}`);
    check(nativeMotionBaseline.length === 0, `native motion assignment must satisfy the native-state lifecycle${nativeMotionBaseline.length ? `\n  ${nativeMotionBaseline.join("\n  ")}` : ""}`);
    const nativeMotionConfig = {
      mode: "native_state",
      feedbackDurationMs: 120,
      stateDurationMs: 200,
      maximumTransitionMs: 360,
      reducedMotionFinalState: "final_state",
      layoutGeometry: "stable",
      interruptionFinalState: "final_state"
    };
    check(validateSchema(capabilityConfigSchema.$defs.motionNativeState, nativeMotionConfig, capabilityConfigSchema).length === 0, "native_state motion config must validate against the active capability schema");
    const nativeRuntimeTests = resolvedTests(nativeMotionCard).filter((id) => id.startsWith("capability.motion.approach.02.runtime.native_state."));
    check(nativeRuntimeTests.length === formatPacks.overlays.find((overlay) => overlay.capability === "motion")?.testMatrixByRuntimeClass?.native_state?.length && nativeRuntimeTests.length >= 3, "native motion resolver must include every native lifecycle and accessibility-order test");

    const wrongUnit = structuredClone(nativeMotionCard);
    wrongUnit.navigation.controlBudgets.minimumDirectTarget.unit = "css_px";
    expectRejected("native-navigation-rejects-browser-unit", [...nativeSchemaBaseline, ...nativeNavigationBaseline], [...validateSchema(buildSchema, wrongUnit), ...navigationContractErrors(wrongUnit)], /platform_dp|value and unit contract|selected target profile/);
    const legacyTargetField = structuredClone(nativeMotionCard);
    delete legacyTargetField.navigation.controlBudgets.minimumDirectTarget;
    legacyTargetField.navigation.controlBudgets.minimumDirectTargetCssPx = 44;
    expectRejected("navigation-rejects-legacy-untyped-target-field", [...nativeSchemaBaseline, ...nativeNavigationBaseline], [...validateSchema(buildSchema, legacyTargetField), ...navigationContractErrors(legacyTargetField)], /minimumDirectTarget|undeclared property|value and unit contract/);
    const browserLifecycleLeak = structuredClone(nativeMotionCard);
    delete browserLifecycleLeak.experience.motionAssignments[0].nativeInterruption;
    browserLifecycleLeak.experience.motionAssignments[0].observerFailure = "final_state";
    expectRejected("native-motion-rejects-browser-observer-lifecycle", [...nativeSchemaBaseline, ...nativeMotionBaseline], [...validateSchema(buildSchema, browserLifecycleLeak), ...motionAssignmentErrors(browserLifecycleLeak)], /nativeInterruption|observerFailure|native_state lifecycle/);
    const nativeCtaObserverCue = structuredClone(nativeMotionCard);
    nativeCtaObserverCue.experience.ctaDiscoveryCueAssignments = structuredClone(build.experience.ctaDiscoveryCueAssignments);
    expectRejected("native-runtime-rejects-observer-based-CTA-cue", [...nativeSchemaBaseline, ...nativeMotionBaseline], [...validateSchema(buildSchema, nativeCtaObserverCue), ...motionAssignmentErrors(nativeCtaObserverCue)], /runtime.*browser|browser-runtime/);
  }
  probe("primary-profile-cannot-repeat-as-secondary", (value) => { value.experience.secondaryProfiles = [value.experience.profile]; }, /primary experience profile cannot be repeated as a secondary profile/);
  probe("navigation-workflow-residue", (value) => { value.navigation.destinations[0].label = "Internal draft release"; value.navigation.destinations[0].labelByLocale["th-TH"] = "Internal draft release"; }, /audience navigation fields contain workflow residue/);
  probe("capability-hash-drift", (value) => { value.capabilityConfigRefs.motion.sha256 = "0".repeat(64); }, /motion capability config hash mismatch/);
  probe("capability-binding-schema-ref-must-match-overlay", (value) => { value.capabilityConfigRefs.motion.schemaRef = release.schemaIds.capabilityConfig; }, /motion capability binding schemaRef differs from overlay configSchemaRef/);
  probe("capability-required-field-gap", (value) => { value.capabilityConfigRefs.motion.ref = "tokens.v0.9.4.json#/motion"; }, /motion capability config is missing required field mode/);
  probe("motion-subject-must-resolve", (value) => { value.experience.motionAssignments[0].subject = "missing-subject"; }, /motion assignment subject missing-subject does not resolve/);
  probe("deep-link-motion-must-declare-protection", (value) => { value.experience.motionAssignments[0].protectedRole = "none"; }, /must identify its deep-link protected role/);
  probe("motion-cannot-hide-final-content", (value) => { value.experience.motionAssignments[0].initialVisibility = "hidden"; }, /initialVisibility.*must equal const "visible"|can hide content/);
  probe("CTA-discovery-cue-must-target-primary-action", (value) => { value.experience.ctaDiscoveryCueAssignments[0].actionRef = "open-live-source"; }, /must resolve to primaryActionRef|must target a primary action/);
  probe("CTA-discovery-cue-cannot-target-consequential-action", (value) => {
    value.actions[0].consequence = { class: "reversible", external: true, cost: "none", reversible: true };
    value.actions[0].confirmation = "explicit";
  }, /cannot target a stateful or consequential action/);
  {
    const staticCtaCard = structuredClone(build);
    staticCtaCard.output.formatProfile = "social_static";
    staticCtaCard.output.interactive = false;
    staticCtaCard.capabilities = staticCtaCard.capabilities.filter((capability) => capability !== "motion");
    delete staticCtaCard.capabilityConfigRefs.motion;
    staticCtaCard.experience.motionDecision = "no_motion";
    staticCtaCard.experience.motionBenefit = [];
    staticCtaCard.experience.motionAssignments = [];
    staticCtaCard.experience.noMotionReason = "The static output uses complete non-moving emphasis.";
    staticCtaCard.experience.ctaDiscoveryCueAssignments = [];
    const cleanStaticCta = motionAssignmentErrors(staticCtaCard);
    const illegalStaticCue = structuredClone(staticCtaCard);
    illegalStaticCue.experience.ctaDiscoveryCueAssignments = structuredClone(build.experience.ctaDiscoveryCueAssignments);
    expectRejected("static-format-cannot-carry-CTA-discovery-cue", cleanStaticCta, motionAssignmentErrors(illegalStaticCue), /allowed only for an interactive browser-runtime web\/app output/);
  }
  probe("immutable-agent-definition-hash-drift", (value) => { value.capabilityConfigRefs.agent_action.sha256 = "0".repeat(64); }, /agent_action capability config hash mismatch/);
  probe("discovery-locale-gap", (value) => { delete value.publication.discovery.titleByLocale.en; }, /discovery\.titleByLocale must cover delivered locales exactly/);
  probe("non-https-canonical", (value) => { value.publication.discovery.canonicalUrl = "http://example.invalid/page"; }, /canonicalUrl must be HTTPS/);
  probe("nonreciprocal-locale-routes", (value) => { value.publication.discovery.localeRoutes[0].alternates.pop(); }, /lacks reciprocal alternates/);
  probe("unbound-social-preview", (value) => { value.publication.discovery.socialPreview.imageAssetId = "asset.missing.social"; value.publication.discovery.socialPreview.imageAltByLocale = { "th-TH": "ภาพ", en: "Image" }; }, /social preview image is not an approved social_preview asset binding/);
  probe("structured-data-hash-drift", (value) => { value.publication.discovery.structuredDataBindings[0].sha256 = "0".repeat(64); }, /structured data binding 0 hash does not match bytes/);
  probe("crawler-policy-hash-drift", (value) => { value.publication.discovery.crawlerPurposePolicy.sha256 = "0".repeat(64); }, /crawler purpose policy hash does not match bytes/);
  probe("confidential-public-delivery", (value) => { value.privacySecurity.dataClassification = "confidential"; }, /public delivery cannot contain non-public data classification/);
  probe("uncontracted-external-effect", (value) => { value.actions[0].consequence.external = true; }, /progressPresentationContract|consequential action lacks explicit confirmation/);
  probe("inconsistent-none-consequence", (value) => { value.actions[0].consequence.reversible = false; }, /none-class consequence must remain locally reversible/);
  probe("unnecessary-confirmation", (value) => { value.actions[0].confirmation = "explicit"; }, /effect-free action must not request confirmation/);
  probe("destructive-intent-cannot-declare-no-effect", (value) => { value.actions[0].intent = "destructive"; }, /destructive intent must declare a destructive non-reversible consequence/);
  probe("destructive-effect-requires-destructive-intent", (value) => { value.actions[0].consequence = { class: "destructive", external: false, cost: "none", reversible: false }; value.actions[0].confirmation = "step_up"; }, /destructive consequence requires destructive intent/);
  probe("external-handoff-must-declare-external-axis", (value) => { value.actions[0].intent = "external_handoff"; value.actions[0].consequence = { class: "reversible", external: false, cost: "none", reversible: true }; value.actions[0].confirmation = "explicit"; }, /external_handoff intent must declare external consequence/);
  probe("untyped-build-exception", (value) => { value.qa.exceptionIds = ["exception.untyped.01"]; }, /exceptionIds.*must contain at most 0 items/);

  {
    const staticCard = structuredClone(build);
    staticCard.output.formatProfile = "social_static";
    staticCard.actions = staticCard.actions.map((action) => ({
      ...action,
      destinationBinding: {
        kind: "external",
        target: build.actions[1].destinationBinding.target,
        targetByLocale: structuredClone(build.actions[1].destinationBinding.targetByLocale),
        presentation: { mode: "static_equivalent", technique: "destination_cue" }
      }
    }));
    const staticBaseline = actionDestinationErrors(staticCard);
    const fakeControl = structuredClone(staticCard);
    fakeControl.actions[0].destinationBinding.presentation = { mode: "direct", technique: "direct_control" };
    expectRejected("static-format-cannot-simulate-direct-CTA", staticBaseline, actionDestinationErrors(fakeControl), /presentation mode is incompatible|presentation technique is incompatible|static format cannot simulate a direct control/);
    const commandWithoutStaticEquivalent = structuredClone(staticCard);
    commandWithoutStaticEquivalent.actions[0].destinationBinding = {
      kind: "command",
      target: "open.details",
      targetByLocale: { "th-TH": "open.details", en: "open.details" },
      presentation: { mode: "static_equivalent", technique: "destination_cue" }
    };
    expectRejected("social-static-command-has-no-fake-equivalent", staticBaseline, actionDestinationErrors(commandWithoutStaticEquivalent), /destination kind command is incompatible with social_static|static command destination must be an explicit instruction/);
  }

  const actionContractSchemaHash = sha256File(join(packageDir, files.actionContractsSchema));
  const actionContractValueHash = sha256File(join(packageDir, files.actionContractsExample));
  const actionContractCard = {
    artifact: { id: "example.external-effect.artifact" },
    locale: { available: ["th-TH", "en"] }
  };
  const actionContractFixture = {
    id: "commit-external-effect",
    permissionContract: { ref: `${files.actionContractsExample}#/permission`, sha256: actionContractValueHash, schemaRef: `${release.schemaIds.actionContracts}#/$defs/permission`, schemaSha256: actionContractSchemaHash },
    progressPresentationContract: { ref: `${files.actionContractsExample}#/progress`, sha256: actionContractValueHash, schemaRef: `${release.schemaIds.actionContracts}#/$defs/progress`, schemaSha256: actionContractSchemaHash },
    resultPresentationContract: { ref: `${files.actionContractsExample}#/result`, sha256: actionContractValueHash, schemaRef: `${release.schemaIds.actionContracts}#/$defs/result`, schemaSha256: actionContractSchemaHash },
    recoveryContract: { ref: `${files.actionContractsExample}#/recovery`, sha256: actionContractValueHash, schemaRef: `${release.schemaIds.actionContracts}#/$defs/recovery`, schemaSha256: actionContractSchemaHash }
  };
  const actionContractKinds = [
    ["permissionContract", "permission"],
    ["progressPresentationContract", "progress"],
    ["resultPresentationContract", "result"],
    ["recoveryContract", "recovery"]
  ];
  const evaluateActionContractFixture = (action) => actionContractKinds.flatMap(([field, kind]) => typedActionContractErrors(actionContractCard, action, field, kind));
  const actionContractBaseline = evaluateActionContractFixture(actionContractFixture);
  check(actionContractBaseline.length === 0, `shipped action-contract bundle fragments are not valid Build Card bindings: ${actionContractBaseline.join("; ")}`);
  let mutatedActionContract = structuredClone(actionContractFixture);
  mutatedActionContract.resultPresentationContract.ref = `${files.actionContractsExample}#/permission`;
  expectRejected("action-result-fragment-kind-drift", actionContractBaseline, evaluateActionContractFixture(mutatedActionContract), /violates the governed result contract|kind drifts/);
  mutatedActionContract = structuredClone(actionContractFixture);
  mutatedActionContract.recoveryContract.ref = `${files.actionContractsExample}#/missing`;
  expectRejected("action-contract-fragment-must-resolve", actionContractBaseline, evaluateActionContractFixture(mutatedActionContract), /fragment does not resolve/);
}

if (actionContractsExample && actionContractsSchema) {
  const baseline = validateSchema(actionContractsSchema, actionContractsExample);
  let mutated = structuredClone(actionContractsExample);
  mutated.result.states = mutated.result.states.filter((state) => state !== "cancelled");
  const resultSchema = pointer(actionContractsSchema, "#/$defs/result");
  const resultBaseline = validateSchema(resultSchema, actionContractsExample.result, actionContractsSchema);
  expectRejected("action-result-must-cover-cancelled", resultBaseline, validateSchema(resultSchema, mutated.result, actionContractsSchema), /states.*must contain|const "cancelled"/);
  mutated = structuredClone(actionContractsExample);
  mutated.recovery.failureStates = ["failed"];
  const recoverySchema = pointer(actionContractsSchema, "#/$defs/recovery");
  const recoveryBaseline = validateSchema(recoverySchema, actionContractsExample.recovery, actionContractsSchema);
  expectRejected("action-recovery-must-cover-failed-and-cancelled", recoveryBaseline, validateSchema(recoverySchema, mutated.recovery, actionContractsSchema), /failureStates.*must contain|const "cancelled"/);
  check(baseline.length === 0, `shipped action-contract bundle violates its schema: ${baseline.join("; ")}`);
}

if (claimRecord) {
  const claimSchema = documents.get(files.claimRecordSchema);
  const schemaBaseline = validateSchema(claimSchema, claimRecord);
  const schemaProbe = (label, mutate, expected) => {
    const mutated = structuredClone(claimRecord);
    mutate(mutated);
    expectRejected(label, schemaBaseline, validateSchema(claimSchema, mutated), expected);
  };
  schemaProbe("shared-scope-product-leak", (value) => { value.scope.product = "ijji"; }, /scope\/product.*must be null/);
  schemaProbe("measurement-state-mismatch", (value) => { value.claimType = "measurement"; }, /proposition\/valueState.*must equal const "measured"|methodologyRef.*must be string/);
  schemaProbe("public-claim-without-evidence", (value) => { value.evidenceRefs = []; }, /evidenceRefs.*must contain at least 1 items/);
  schemaProbe("placeholder-integrity", (value) => { value.provenance.integrityRef = "sha256:placeholder"; }, /integrityRef.*does not match pattern/);
  const projectionBaseline = publicClaimProjectionErrors(claimRecord);
  const localRef = structuredClone(claimRecord);
  localRef.evidenceRefs = ["work/internal-evidence.html#claim"];
  expectRejected("local-path-in-public-claim", projectionBaseline, publicClaimProjectionErrors(localRef), /stable public reference/);
  const temporalBaseline = claimTemporalErrors(claimRecord, build.publication.claimAsOf, build.locale.available);
  let mutated = structuredClone(claimRecord); delete mutated.textByLocale.en;
  expectRejected("claim-locale-gap", temporalBaseline, claimTemporalErrors(mutated, build.publication.claimAsOf, build.locale.available), /textByLocale must cover delivered locales exactly/);
  mutated = structuredClone(claimRecord); mutated.validityBasis = "bounded_interval"; mutated.validFrom = "2025-01-01T00:00:00Z"; mutated.validUntil = "2025-12-31T00:00:00Z";
  expectRejected("expired-claim", temporalBaseline, claimTemporalErrors(mutated, build.publication.claimAsOf, build.locale.available), /bounded claim .* is not valid at claimAsOf|expired before claimAsOf/);
  mutated = structuredClone(claimRecord); mutated.lastReviewed = "2027-01-01T00:00:00Z";
  expectRejected("future-reviewed-claim", temporalBaseline, claimTemporalErrors(mutated, build.publication.claimAsOf, build.locale.available), /reviewed after claimAsOf/);
  mutated = structuredClone(claimRecord); delete mutated.limitations[0].textByLocale.en;
  expectRejected("claim-limitation-locale-gap", temporalBaseline, claimTemporalErrors(mutated, build.publication.claimAsOf, build.locale.available), /limitation .* must cover delivered locales exactly/);
  const allowlistProbe = structuredClone(claimRecord); allowlistProbe.schemaRelease = "draft internal schema note";
  check(publicClaimProjectionErrors(allowlistProbe).length === 0, "claim audience allowlist incorrectly scans non-projected schema governance fields");
}

if (artifactManifest) {
  const artifactSchema = documents.get(files.artifactManifestSchema);
  const evaluateArtifact = (value, root = packageDir) => [...validateSchema(artifactSchema, value), ...artifactCrossErrors(value, build, root)];
  const baseline = evaluateArtifact(artifactManifest);
  const probe = (label, mutate, expected) => {
    const mutated = structuredClone(artifactManifest);
    mutate(mutated);
    expectRejected(label, baseline, evaluateArtifact(mutated), expected);
  };
  probe("resolved-rule-drift", (value) => { value.resolution.resolvedRuleIds.pop(); }, /rule sets must partition the catalog exactly/);
  probe("resolved-test-drift", (value) => { value.resolution.resolvedTestIds.pop(); }, /resolved test IDs must exactly cover/);
  probe("manifest-governance-visible", (value) => { value.representation.outputClarity.internalGovernanceVisible = true; }, /internalGovernanceVisible.*must equal const false|internal governance is visible/);
  probe("manifest-placeholder-count", (value) => { value.representation.outputClarity.placeholderCount = 1; }, /placeholderCount.*must equal const 0|contains placeholders/);
  probe("unresolved-material-limitation-ref", (value) => { value.representation.outputClarity.materialLimitationRefs = ["missing-claim"]; }, /material limitation ref does not resolve/);
  probe("false-package-validated-claim", (value) => { value.validation.packageValidation = "failed"; }, /package_validated requires packageValidation passed/);
  probe("overlapping-rule-partition", (value) => { value.resolution.nonApplicableRuleIds.push(value.resolution.resolvedRuleIds[0]); }, /rule sets overlap/);
  probe("incomplete-rule-partition", (value) => { value.resolution.nonApplicableRuleIds.pop(); }, /rule sets must partition the catalog exactly/);
  probe("untyped-artifact-exception", (value) => { value.resolution.exceptionRefs = ["exception.untyped.01"]; }, /exceptionRefs.*must contain at most 0 items|does not accept exception refs/);
  probe("artifact-locale-state-drift", (value) => { value.representation.localeStates[1].status = "source"; }, /artifact and Build Card locale states differ/);
  probe("artifact-navigation-drift", (value) => { value.representation.navigation.destinations[0].label = "Drift"; }, /artifact navigation projection differs/);
  {
    const staticArtifactCases = [
      { formatProfile: "document_flow", formatPack: "document.flow.01", targetProfileRef: "target.document.a4-portrait.01", mode: "document", staticExposure: "toc", semanticStructure: { headings: "verified", landmarks: "not_applicable", controls: "verified" } },
      { formatProfile: "pdf_fixed", formatPack: "pdf.fixed.01", targetProfileRef: "target.pdf.a4-portrait.01", mode: "document", staticExposure: "pdf_bookmark", semanticStructure: { headings: "verified", landmarks: "not_applicable", controls: "verified" } },
      { formatProfile: "deck_presentation", formatPack: "deck.presentation.01", targetProfileRef: "target.deck.16x9.01", mode: "deck", staticExposure: "deck_section_marker", semanticStructure: { headings: "not_applicable", landmarks: "not_applicable", controls: "not_applicable" } }
    ];
    for (const fixture of staticArtifactCases) {
      const value = structuredClone(artifactManifest);
      value.resolution.formatPack = fixture.formatPack;
      value.resolution.targetProfileRef = fixture.targetProfileRef;
      value.representation.navigation.mode = fixture.mode;
      delete value.representation.navigation.controlBudgets;
      value.representation.navigation.brandDestinationRef = null;
      for (const destination of value.representation.navigation.destinations) {
        destination.current = "none";
        delete destination.breakpointExposure;
        destination.staticExposure = destination.kind === "anchor" ? fixture.staticExposure : "destination_cue";
      }
      value.delivery.metadataProjection = { kind: "format_metadata", formatProfile: fixture.formatProfile, title: "Static navigation schema fixture", locale: "th-TH" };
      value.delivery.accessibilityProjection.formatProfile = fixture.formatProfile;
      value.delivery.accessibilityProjection.semanticStructure = fixture.semanticStructure;
      value.delivery.accessibilityProjection.interaction = { keyboard: "not_applicable", focus: "not_applicable", touch: "not_applicable" };
      value.delivery.accessibilityProjection.textLayout = { zoom200: "not_applicable", reflow400: "not_applicable" };
      const cleanStaticArtifactSchema = validateSchema(artifactSchema, value);
      check(cleanStaticArtifactSchema.length === 0, `${fixture.formatProfile} combined global/page-index Artifact Manifest must satisfy schema 3.2${cleanStaticArtifactSchema.length ? `\n  ${cleanStaticArtifactSchema.join("\n  ")}` : ""}`);

      const wrongMode = structuredClone(value);
      wrongMode.representation.navigation.mode = fixture.mode === "deck" ? "document" : "deck";
      expectRejected(`${fixture.formatProfile}-artifact-schema-rejects-wrong-navigation-mode`, cleanStaticArtifactSchema, validateSchema(artifactSchema, wrongMode), /mode: is not in enum|mode.*must be equal to one of the allowed values|must be equal to constant/);

      const browserLeak = structuredClone(value);
      browserLeak.representation.navigation.destinations.find((destination) => destination.kind === "anchor").breakpointExposure = { desktop: "side_bookmark", mobile: "disclosure" };
      expectRejected(`${fixture.formatProfile}-artifact-schema-rejects-browser-navigation-exposure`, cleanStaticArtifactSchema, validateSchema(artifactSchema, browserLeak), /breakpointExposure|matches prohibited not schema|must not validate against schema from "not"/);

      const missingStaticExposure = structuredClone(value);
      delete missingStaticExposure.representation.navigation.destinations.find((destination) => destination.kind === "anchor").staticExposure;
      expectRejected(`${fixture.formatProfile}-artifact-schema-requires-static-navigation-exposure`, cleanStaticArtifactSchema, validateSchema(artifactSchema, missingStaticExposure), /missing required property staticExposure|staticExposure.*is required/);
    }
    const interactiveStaticLeak = structuredClone(artifactManifest);
    interactiveStaticLeak.representation.navigation.destinations[0].staticExposure = "destination_cue";
    expectRejected("interactive-artifact-schema-rejects-static-navigation-exposure", validateSchema(artifactSchema, artifactManifest), validateSchema(artifactSchema, interactiveStaticLeak), /staticExposure|matches prohibited not schema|must not validate against schema from "not"/);
  }
  probe("duplicate-delivery-path", (value) => { value.delivery.files = [{ path: "final.html", sha256: "0".repeat(64), mediaType: "text/html" }, { path: "final.html", sha256: "1".repeat(64), mediaType: "text/html" }]; }, /delivery files contain duplicate paths/);
  probe("implementation-source-hash-drift", (value) => { value.delivery.implementationSourceBindings = [{ role: "component_source", ref: files.readme, sha256: "0".repeat(64), mediaType: "text/markdown", audienceDelivered: false }]; }, /implementation source README\.md hash mismatch/);
  probe("implementation-source-delivery-state-drift", (value) => { value.delivery.implementationSourceBindings = [{ role: "component_source", ref: files.readme, sha256: sha256File(join(packageDir, files.readme)), mediaType: "text/markdown", audienceDelivered: true }]; }, /audienceDelivered state drifts from delivery\.files/);
  probe("artifact-claim-as-of-drift", (value) => { value.representation.claimAsOf = "2020-01-01T00:00:00Z"; }, /artifact and Build Card claimAsOf differ/);
  probe("artifact-limitation-projection-drift", (value) => { value.representation.materialLimitations[0].items[0].textByLocale.en = "Different limitation"; }, /material limitation projection must exactly match locale-complete claim limitations/);

  for (const [variant, filename] of referenceImplementationFilesByVariant) {
    const referenceRecord = documents.get(filename);
    if (!referenceRecord) continue;
    const platformCases = [referenceRecord];
    if (referenceRecord.authoringPlatform === "macos") platformCases.push(referenceImplementationForPlatform(referenceRecord, "windows"));
    for (const platformRecord of platformCases) {
      withPromotedFormatImplementationFixture(platformRecord, ({ root, card, manifest }) => {
        const errors = implementationBindingErrors(manifest, card, root);
        check(errors.length === 0, `${variant}.${platformRecord.authoringPlatform}: artifact-resolved promoted implementation happy path failed${errors.length ? `\n  ${errors.join("\n  ")}` : ""}`);
      });
    }
  }

  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.artifactManual = "pending";
    expectRejected("false-artifact-qa-phase-claim", clean, evaluateArtifact(mutated, root), /artifact_qa_passed requires artifactManual passed/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const referenceRef = files.formatImplementationExample;
    const referenceRecord = JSON.parse(readFileSync(join(root, referenceRef), "utf8"));
    manifest.delivery.implementationBindings.preset = {
      ref: referenceRef,
      sha256: sha256File(join(root, referenceRef)),
      schemaRef: release.schemaIds.formatImplementation,
      id: referenceRecord.recordId
    };
    expectRejected("promoted-artifact-cannot-select-shipped-reference", clean, evaluateArtifact(manifest, root), /artifact QA requires an artifact_resolved format implementation record/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.resolutionContext.experienceProfile = "methodology_explanation";
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-rejects-mismatched-experience", clean, evaluateArtifact(manifest, root), /experience profile drifts from the Build Card/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.requirements.componentIds[0] = "component.fake.weak.01";
    record.resolutionContext.componentIds[0] = "component.fake.weak.01";
    record.requirements.componentContracts[0].componentId = "component.fake.weak.01";
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-rejects-self-authored-component", clean, evaluateArtifact(manifest, root), /componentIds do not exactly equal the Build Card|component contracts do not exactly cover the Build Card/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.authoringPlatform = "macos";
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-rejects-mismatched-platform", clean, evaluateArtifact(manifest, root), /authoringPlatform.*must be equal to constant "browser"|authoring platform drifts|typography binding platform drifts/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.formatProfile = "app_interactive";
    record.runtime = "native";
    record.authoringPlatform = "macos";
    record.targetProfileRef = "target.app.native-responsive.360-1280.01";
    record.formatKitId = "kit.app.base.01";
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-rejects-mismatched-runtime", clean, evaluateArtifact(manifest, root), /record drifts from Build Card format, runtime, target, or format pack/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.recordId = "implementation.attacker.self-authored.01";
    manifest.delivery.implementationBindings.preset.id = record.recordId;
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-id-is-derived", clean, evaluateArtifact(manifest, root), /recordId is not deterministically bound/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.artifactBinding.buildCardSha256 = "0".repeat(64);
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-binds-exact-build-card-bytes", clean, evaluateArtifact(manifest, root), /does not bind the exact Build Card bytes|Build Card binding is invalid/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.requirements.resolvedAssetIds.pop();
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-covers-exact-build-assets", clean, evaluateArtifact(manifest, root), /resolvedAssetIds does not exactly bind the Build Card/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const recordPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const record = JSON.parse(readFileSync(recordPath, "utf8"));
    record.requirements.identityTypographyBindingIds = ["identity-typography.app-header.browser.01"];
    writeFixtureJson(recordPath, record);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(recordPath);
    expectRejected("artifact-resolved-record-binds-exact-identity-typography", clean, evaluateArtifact(manifest, root), /identity typography binding format drifts|identityTypographyBindingIds does not exactly bind the Build Card/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.delivery.implementationSourceBindings = [];
    expectRejected("artifact-qa-requires-implementation-source", clean, evaluateArtifact(mutated, root), /implementationSourceBindings.*must contain at least 1 items|requires hash-bound implementation source bytes|requires an component_source/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.layerResults.discovery.result = "not_applicable";
    expectRejected("universal-layer-cannot-be-not-applicable", clean, evaluateArtifact(mutated, root), /result.*must be in enum|requires universal discovery layer passed/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const presetPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const preset = JSON.parse(readFileSync(presetPath, "utf8"));
    preset.requirements.resolvedRuleIds.pop();
    writeFixtureJson(presetPath, preset);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(presetPath);
    expectRejected("format-record-cannot-omit-resolved-rule", clean, evaluateArtifact(manifest, root), /record resolvedRuleIds must exactly equal Artifact Manifest resolvedRuleIds/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const presetPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const preset = JSON.parse(readFileSync(presetPath, "utf8"));
    preset.requirements.resolvedTestIds.pop();
    writeFixtureJson(presetPath, preset);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(presetPath);
    expectRejected("format-record-cannot-omit-resolved-test", clean, evaluateArtifact(manifest, root), /record resolvedTestIds must exactly equal Artifact Manifest resolvedTestIds/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const presetPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const preset = JSON.parse(readFileSync(presetPath, "utf8"));
    preset.requirements.componentContracts.pop();
    writeFixtureJson(presetPath, preset);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(presetPath);
    expectRejected("component-contracts-must-cover-selected-rules", clean, evaluateArtifact(manifest, root), /component contracts do not exactly cover the Build Card|component contracts must exactly cover componentRuleIds/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const presetPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const preset = JSON.parse(readFileSync(presetPath, "utf8"));
    preset.requirements.componentContracts[0].tokenRefs[0] = "tokens.v0.9.4.json#/missing-token";
    writeFixtureJson(presetPath, preset);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(presetPath);
    expectRejected("component-token-ref-must-resolve", clean, evaluateArtifact(manifest, root), /token ref .* does not resolve to the active token bytes/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const kitPath = bundleFilePath(root, manifest.delivery.implementationBindings.formatKit.ref);
    const kits = JSON.parse(readFileSync(kitPath, "utf8"));
    kits.note = `${kits.note} Mutated downstream copy.`;
    writeFixtureJson(kitPath, kits);
    manifest.delivery.implementationBindings.formatKit.sha256 = sha256File(kitPath);
    expectRejected("downstream-cannot-substitute-format-kit-registry", clean, evaluateArtifact(manifest, root), /format-kit implementation binding bytes differ from the active package registry/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const targetPath = bundleFilePath(root, manifest.delivery.implementationBindings.targetProfile.ref);
    const targets = JSON.parse(readFileSync(targetPath, "utf8"));
    targets.profiles.find((profile) => profile.id === build.output.targetProfileRef).safeArea = "mutated downstream safe area";
    writeFixtureJson(targetPath, targets);
    manifest.delivery.implementationBindings.targetProfile.sha256 = sha256File(targetPath);
    expectRejected("downstream-cannot-substitute-target-profile-registry", clean, evaluateArtifact(manifest, root), /target-profile implementation binding bytes differ from the active package registry/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const presetPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const preset = JSON.parse(readFileSync(presetPath, "utf8"));
    const tokenPath = bundleFilePath(root, preset.tokenRef);
    const tokenDocument = JSON.parse(readFileSync(tokenPath, "utf8"));
    tokenDocument.status = "mutated-copy";
    writeFixtureJson(tokenPath, tokenDocument);
    preset.tokenSha256 = sha256File(tokenPath);
    writeFixtureJson(presetPath, preset);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(presetPath);
    expectRejected("format-record-cannot-substitute-token-bytes", clean, evaluateArtifact(manifest, root), /record must bind the active package token bytes/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const presetPath = bundleFilePath(root, manifest.delivery.implementationBindings.preset.ref);
    const preset = JSON.parse(readFileSync(presetPath, "utf8"));
    preset.requirements.accessibilityFixtureIds = ["accessibility.fake.trivial"];
    writeFixtureJson(presetPath, preset);
    manifest.delivery.implementationBindings.preset.sha256 = sha256File(presetPath);
    expectRejected("format-record-rejects-arbitrary-accessibility-fixture", clean, evaluateArtifact(manifest, root), /accessibilityFixtureIds must exactly equal the governed format\/runtime fixtures/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const reportPath = bundleFilePath(root, manifest.delivery.accessibilityProjection.fixtureReportRef);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    report.fixtures.pop();
    writeFixtureJson(reportPath, report);
    manifest.delivery.accessibilityProjection.fixtureReportSha256 = sha256File(reportPath);
    expectRejected("accessibility-fixtures-must-match-format-record", clean, evaluateArtifact(manifest, root), /fixtures must exactly equal the format-implementation record accessibilityFixtureIds/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    manifest.delivery.accessibilityProjection.interaction.touch = "not_applicable";
    expectRejected("interactive-accessibility-summary-is-exact", clean, evaluateArtifact(manifest, root), /interaction summary drifts|must be equal to constant/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    manifest.delivery.accessibilityProjection.alternatives.images = "verified";
    expectRejected("accessibility-summary-cannot-overclaim-absent-image", clean, evaluateArtifact(manifest, root), /alternatives summary drifts/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const reportPath = bundleFilePath(root, manifest.delivery.accessibilityProjection.fixtureReportRef);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    report.summary.semanticStructure.controls = "not_applicable";
    writeFixtureJson(reportPath, report);
    manifest.delivery.accessibilityProjection.fixtureReportSha256 = sha256File(reportPath);
    expectRejected("accessibility-fixture-summary-cannot-drift", clean, evaluateArtifact(manifest, root), /fixture report summary drifts/);
  });
  {
    const staticCard = structuredClone(build);
    staticCard.output = {
      ...staticCard.output,
      formatProfile: "social_static",
      runtime: "static",
      targetProfileRef: "target.social.square.1080.01"
    };
    staticCard.capabilities = staticCard.capabilities.filter((capability) => capability !== "motion");
    const staticProjection = expectedAccessibilityProjectionSummary(staticCard);
    const cleanStaticSummary = accessibilitySummaryErrors(staticProjection, staticCard);
    check(cleanStaticSummary.length === 0, `social-static accessibility summary baseline failed${cleanStaticSummary.length ? `\n  ${cleanStaticSummary.join("\n  ")}` : ""}`);
    const falseSemanticClaim = structuredClone(staticProjection);
    falseSemanticClaim.semanticStructure = { headings: "verified", landmarks: "verified", controls: "verified" };
    expectRejected("social-static-cannot-claim-semantic-controls", cleanStaticSummary, accessibilitySummaryErrors(falseSemanticClaim, staticCard), /semantic-structure summary drifts/);
  }
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.resolvedTestResults.pop();
    expectRejected("resolved-tests-require-exact-phase-coverage", clean, evaluateArtifact(mutated, root), /resolved test results must exactly cover the tests required at this phase/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const result = manifest.validation.resolvedTestResults.find((entry) => entry.testId === "common.01");
    const evidencePath = bundleFilePath(root, result.evidenceRef);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.testId = "fake.trivial";
    writeFixtureJson(evidencePath, evidence);
    result.evidenceSha256 = sha256File(evidencePath);
    expectRejected("resolved-test-evidence-must-be-criterion-bound", clean, evaluateArtifact(manifest, root), /evidence subject drifts/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const result = manifest.validation.resolvedTestResults.find((entry) => entry.testId === "common.01");
    result.criterion = "A generic self-authored pass statement.";
    result.criterionSha256 = sha256Bytes(result.criterion);
    expectRejected("resolved-test-manifest-criterion-cannot-drift", clean, evaluateArtifact(manifest, root), /criterion drifts from the active registries/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const result = manifest.validation.resolvedTestResults.find((entry) => entry.testId === "common.01");
    const evidencePath = bundleFilePath(root, result.evidenceRef);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.criterion = "A generic self-authored pass statement.";
    evidence.criterionSha256 = sha256Bytes(evidence.criterion);
    writeFixtureJson(evidencePath, evidence);
    result.evidenceSha256 = sha256File(evidencePath);
    expectRejected("resolved-test-evidence-criterion-cannot-drift", clean, evaluateArtifact(manifest, root), /evidence criterion drifts from the active registries/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    const removed = mutated.validation.gateResults.pop();
    expectRejected("missing-resolved-rule-receipt", clean, evaluateArtifact(mutated, root), new RegExp(`missing receipt ${regexEscape(removed.checkId)}`));
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.gateResults.push(structuredClone(mutated.validation.gateResults[0]));
    expectRejected("duplicate-gate-check-id", clean, evaluateArtifact(mutated, root), /gate result check IDs are not unique/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const gate = manifest.validation.gateResults.find((entry) => entry.checkId === "OUTPUT-CLARITY-01-A");
    const receiptPath = join(root, gate.receiptRef);
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const evidence = receipt.evidenceFiles[0];
    receipt.subjectFiles = [{ path: evidence.path, sha256: evidence.sha256, mediaType: evidence.mediaType }];
    writeFixtureJson(receiptPath, receipt);
    gate.receiptSha256 = sha256File(receiptPath);
    expectRejected("output-clarity-a-must-cover-every-delivery-file", clean, evaluateArtifact(manifest, root), /OUTPUT-CLARITY-01-A omits delivered file final\.html/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    for (const [path, mediaType] of [
      ["opaque.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      ["opaque.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
      ["opaque.pdf", "application/pdf"],
      ["social.png", "image/png"]
    ]) {
      writeFileSync(join(root, path), `opaque fixture ${path}\n`, "utf8");
      manifest.delivery.files.push({ path, sha256: sha256File(join(root, path)), mediaType });
    }
    expectRejected("opaque-audience-files-cannot-skip-content-inspection", clean, evaluateArtifact(manifest, root), /audience content inspections must exactly cover every delivered file/);
  });
  withRenderedInspectionFixture({}, ({ root, manifest, evidence, persistEvidence }) => {
    const clean = audienceContentInspectionErrors(manifest, root);
    evidence.ocrPerformed = false;
    persistEvidence();
    expectRejected("pdf-rendered-inspection-requires-ocr", clean, audienceContentInspectionErrors(manifest, root), /lacks required combined extraction, OCR, visual-review/);
  });
  withRenderedInspectionFixture({}, ({ inspection }) => {
    const inspectionSchema = artifactSchema.properties.delivery.properties.contentInspections.items;
    const clean = validateSchema(inspectionSchema, inspection, artifactSchema);
    delete inspection.imageOnlyOrOutlinedTextReviewed;
    expectRejected("office-pdf-schema-requires-image-only-review-binding", clean, validateSchema(inspectionSchema, inspection, artifactSchema), /missing required property imageOnlyOrOutlinedTextReviewed/);
  });
  withRenderedInspectionFixture({}, ({ root, manifest, inspection }) => {
    const clean = audienceContentInspectionErrors(manifest, root);
    inspection.renderedUnitCount = 2;
    expectRejected("pdf-rendered-inspection-count-cannot-undercount", clean, audienceContentInspectionErrors(manifest, root), /rendered page\/slide coverage drifts|does not cover every page or slide/);
  });
  withRenderedInspectionFixture({}, ({ root, manifest, evidence, persistEvidence }) => {
    const clean = audienceContentInspectionErrors(manifest, root);
    evidence.renderedUnits[0].visualReviewText = "Outlined text that the combined output omits.";
    persistEvidence();
    expectRejected("pdf-combined-text-cannot-omit-visual-review", clean, audienceContentInspectionErrors(manifest, root), /combined visible text must equal the deterministic channel-labelled/);
  });
  withRenderedInspectionFixture({}, ({ root, manifest, evidence, persistEvidence }) => {
    const clean = audienceContentInspectionErrors(manifest, root);
    evidence.imageOnlyOrOutlinedTextReviewed = false;
    evidence.renderedUnits[0].imageOnlyOrOutlinedTextReviewed = false;
    persistEvidence();
    expectRejected("pdf-image-only-and-outlined-text-review-is-mandatory", clean, audienceContentInspectionErrors(manifest, root), /image-only\/outlined-text/);
  });
  withRenderedInspectionFixture({}, ({ root, manifest, evidence, renderPath, persistEvidence }) => {
    const clean = audienceContentInspectionErrors(manifest, root);
    writeFileSync(renderPath, "not a PNG", "utf8");
    evidence.renderedUnits[0].renderSha256 = sha256File(renderPath);
    persistEvidence();
    expectRejected("rendered-page-media-type-must-match-bytes", clean, audienceContentInspectionErrors(manifest, root), /rendered-image media type does not match its bytes/);
  });
  withRenderedInspectionFixture({ filename: "opaque.pptx", mediaType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", unitKind: "slide" }, ({ root, manifest, inspection, evidence, persistEvidence }) => {
    const clean = audienceContentInspectionErrors(manifest, root);
    inspection.renderedUnitKind = "page";
    evidence.renderedUnitKind = "page";
    persistEvidence();
    expectRejected("pptx-rendered-units-must-be-slides", clean, audienceContentInspectionErrors(manifest, root), /lacks the governed rendered page\/slide count/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const inspection = manifest.delivery.contentInspections[0];
    inspection.method = "pdf_text_extraction";
    expectRejected("content-inspection-method-is-format-bound", clean, evaluateArtifact(manifest, root), /method must be direct_text_scan/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    manifest.delivery.contentInspections[0].evidenceSha256 = "0".repeat(64);
    expectRejected("content-inspection-evidence-is-hash-bound", clean, evaluateArtifact(manifest, root), /content inspection .* evidence hash mismatch/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const inspection = manifest.delivery.contentInspections[0];
    const evidencePath = bundleFilePath(root, inspection.evidenceRef);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.visibleText = `${evidence.visibleText}\nTODO: approval pending`;
    writeFixtureJson(evidencePath, evidence);
    inspection.evidenceSha256 = sha256File(evidencePath);
    expectRejected("extracted-or-ocr-text-cannot-carry-workflow-residue", clean, evaluateArtifact(manifest, root), /content inspection contains workflow residue/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    delete manifest.delivery.primaryHtmlBinding;
    expectRejected("web-artifact-requires-primary-html-binding", clean, evaluateArtifact(manifest, root), /requires a primary HTML binding|primaryHtmlBinding.*required/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    delete manifest.delivery.webDiscoveryEvidence;
    expectRejected("web-artifact-requires-final-byte-discovery-evidence", clean, evaluateArtifact(manifest, root), /webDiscoveryEvidence.*required|requires hash-bound no-script/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const html = readFileSync(htmlPath, "utf8").replace("<h1>", "<h1 style=\"opacity:0\">");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("hidden-governed-heading-cannot-satisfy-discovery", clean, evaluateArtifact(manifest, root), /must expose exactly one visible governed H1/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const html = readFileSync(htmlPath, "utf8").replace("<p data-primary-answer>", "<p data-primary-answer hidden>");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("hidden-governed-answer-cannot-satisfy-discovery", clean, evaluateArtifact(manifest, root), /must expose exactly one visible data-primary-answer/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const html = readFileSync(htmlPath, "utf8").replace(manifest.delivery.metadataProjection.canonicalUrl, "https://example.invalid/drift");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("delivered-html-canonical-must-match-contract", clean, evaluateArtifact(manifest, root), /initial HTML canonical link is missing, duplicated, or drifted/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const html = readFileSync(htmlPath, "utf8").replace(/<link rel="alternate" hreflang="en"[^>]*>\n/, "");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("delivered-html-hreflang-must-match-contract", clean, evaluateArtifact(manifest, root), /hreflang links do not exactly match/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const route = build.publication.discovery.localeRoutes[0];
    const html = readFileSync(htmlPath, "utf8").replace(`<a hreflang="${escapeFixtureHtml(route.locale)}" href="${escapeFixtureHtml(route.url)}">${escapeFixtureHtml(route.locale)}</a>`, "");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("visible-internal-locale-links-are-mandatory", clean, evaluateArtifact(manifest, root), /visible internal locale links drift from governed locale routes/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const html = readFileSync(htmlPath, "utf8").replace("application/ld+json", "application/json");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("delivered-html-must-contain-governed-json-ld", clean, evaluateArtifact(manifest, root), /initial HTML lacks JSON-LD/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const governedUrl = structuredDataProjection.entities[0].url;
    const html = readFileSync(htmlPath, "utf8").replace(`"url":${JSON.stringify(governedUrl)}`, `"url":${JSON.stringify(governedUrl)},"description":"Unsupported best-in-class claim"`);
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("json-ld-cannot-add-ungoverned-overclaim", clean, evaluateArtifact(manifest, root), /JSON-LD contains ungoverned properties/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const answer = manifest.delivery.metadataProjection.primaryAnswerByLocale[build.locale.primary];
    const html = readFileSync(htmlPath, "utf8").replace(answer, "ข้อความอื่นที่ไม่ตรงกับสัญญา");
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("delivered-html-visible-answer-must-match-contract", clean, evaluateArtifact(manifest, root), /must expose exactly one visible data-primary-answer/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const claimText = escapeFixtureHtml(claimRecord.textByLocale?.[build.locale.primary]);
    const html = readFileSync(htmlPath, "utf8").replace(`<p>${claimText}</p>`, `<p>${claimText} Unsupported overclaim.</p>`);
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("visible-claim-cannot-exceed-governed-text", clean, evaluateArtifact(manifest, root), /visible claim .* must equal governed text and material limitations exactly/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const action = build.actions.find((entry) => ["available", "requires_permission"].includes(entry.availability));
    const target = action.destinationBinding?.targetByLocale?.[build.locale.primary] ?? action.destinationBinding?.target;
    const html = readFileSync(htmlPath, "utf8").replace(`data-action-id="${escapeFixtureHtml(action.id)}" href="${escapeFixtureHtml(target)}"`, `data-action-id="${escapeFixtureHtml(action.id)}" href="https://example.invalid/redirect"`);
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("visible-action-destination-must-match-contract", clean, evaluateArtifact(manifest, root), /visible action IDs, labels, or destinations drift/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const htmlPath = bundleFilePath(root, manifest.delivery.primaryHtmlBinding.path);
    const evidenceRef = claimRecord.evidenceRefs[0];
    const html = readFileSync(htmlPath, "utf8").replace(`data-evidence-for="${escapeFixtureHtml(claimRecord.claimId)}" href="${escapeFixtureHtml(evidenceRef)}"`, `data-evidence-for="${escapeFixtureHtml(claimRecord.claimId)}" href="https://example.invalid/unsupported"`);
    writeFileSync(htmlPath, html, "utf8");
    expectRejected("visible-evidence-destination-must-match-contract", clean, evaluateArtifact(manifest, root), /visible claim evidence links drift/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const binding = manifest.delivery.webDiscoveryEvidence.noScript;
    const snapshotPath = bundleFilePath(root, binding.ref);
    const html = readFileSync(snapshotPath, "utf8").replace(/ data-action-id="[^"]+"/, "");
    writeFileSync(snapshotPath, html, "utf8");
    binding.sha256 = sha256File(snapshotPath);
    expectRejected("no-script-snapshot-must-preserve-actions", clean, evaluateArtifact(manifest, root), /no-script snapshot visible action IDs, labels, or destinations drift/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const binding = manifest.delivery.webDiscoveryEvidence.hydratedDom;
    const snapshotPath = bundleFilePath(root, binding.ref);
    const html = readFileSync(snapshotPath, "utf8").replace("<p data-primary-answer>", "<p data-primary-answer hidden>");
    writeFileSync(snapshotPath, html, "utf8");
    binding.sha256 = sha256File(snapshotPath);
    expectRejected("hydration-cannot-hide-primary-answer", clean, evaluateArtifact(manifest, root), /hydrated-DOM snapshot must expose exactly one visible data-primary-answer/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const binding = manifest.delivery.webDiscoveryEvidence.accessibilityTree;
    const reportPath = bundleFilePath(root, binding.ref);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    report.actions.pop();
    writeFixtureJson(reportPath, report);
    binding.sha256 = sha256File(reportPath);
    expectRejected("accessibility-tree-must-preserve-action-destinations", clean, evaluateArtifact(manifest, root), /accessibility-tree snapshot does not exactly preserve governed visible meaning and destinations/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const binding = manifest.delivery.webDiscoveryEvidence.internalLocaleLinks;
    const reportPath = bundleFilePath(root, binding.ref);
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    report.links[0].url = "https://example.invalid/wrong-locale";
    writeFixtureJson(reportPath, report);
    binding.sha256 = sha256File(reportPath);
    expectRejected("internal-locale-evidence-must-match-governed-routes", clean, evaluateArtifact(manifest, root), /internal-locale-link snapshot does not exactly preserve governed locale destinations/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const sitemapPath = join(root, "sitemap.xml");
    const binding = { ref: "sitemap.xml", sha256: sha256File(sitemapPath), mediaType: "application/xml" };
    manifest.delivery.webDiscoveryEvidence.sitemap = binding;
    manifest.delivery.files.push({ path: binding.ref, sha256: binding.sha256, mediaType: binding.mediaType });
    expectRejected("non-indexed-artifact-cannot-deliver-sitemap", clean, evaluateArtifact(manifest, root), /non-included sitemap must have a null evidence binding/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const gate = manifest.validation.gateResults.find((entry) => entry.checkId === "DISCOVERY-02-A");
    const receiptPath = bundleFilePath(root, gate.receiptRef);
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const localeEvidenceRef = manifest.delivery.webDiscoveryEvidence.internalLocaleLinks.ref;
    receipt.evidenceFiles = receipt.evidenceFiles.filter((entry) => entry.path !== localeEvidenceRef);
    receipt.evidenceRefs = receipt.evidenceRefs.filter((ref) => ref !== localeEvidenceRef);
    receipt.testCases[0].evidenceRefs = receipt.testCases[0].evidenceRefs.filter((ref) => ref !== localeEvidenceRef);
    writeFixtureJson(receiptPath, receipt);
    gate.receiptSha256 = sha256File(receiptPath);
    expectRejected("discovery-receipt-must-bind-internal-locale-evidence", clean, evaluateArtifact(manifest, root), /DISCOVERY-02-A omits governed web discovery evidence/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const gate = manifest.validation.gateResults.find((entry) => entry.checkId === "OUTPUT-CLARITY-01-A");
    const receiptPath = bundleFilePath(root, gate.receiptRef);
    const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));
    const inspectionRef = manifest.delivery.contentInspections[0].evidenceRef;
    receipt.evidenceFiles = receipt.evidenceFiles.filter((entry) => entry.path !== inspectionRef);
    receipt.evidenceRefs = receipt.evidenceRefs.filter((ref) => ref !== inspectionRef);
    receipt.testCases[0].evidenceRefs = receipt.testCases[0].evidenceRefs.filter((ref) => ref !== inspectionRef);
    writeFixtureJson(receiptPath, receipt);
    gate.receiptSha256 = sha256File(receiptPath);
    expectRejected("output-clarity-receipt-must-bind-content-inspection", clean, evaluateArtifact(manifest, root), /OUTPUT-CLARITY-01-A omits audience-content inspection evidence/);
  });
  withConformanceFixture("production_verified", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.productionVerification = "pending";
    expectRejected("false-production-phase-claim", clean, evaluateArtifact(mutated, root), /production_verified requires productionVerification passed/);
  });
  withConformanceFixture("production_verified", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.gateResults = mutated.validation.gateResults.filter((entry) => entry.checkId !== "OUTPUT-CLARITY-01-B");
    expectRejected("missing-output-clarity-production-receipt", clean, evaluateArtifact(mutated, root), /missing production receipt OUTPUT-CLARITY-01-B|requires passing OUTPUT-CLARITY-01-B/);
  });
  withConformanceFixture("production_verified", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const mutated = structuredClone(manifest);
    mutated.validation.resolvedTestResults = mutated.validation.resolvedTestResults.filter((entry) => entry.testId !== "format.web.public.01.09");
    expectRejected("production-profile-test-cannot-be-omitted", clean, evaluateArtifact(mutated, root), /production_verified resolved test results must exactly cover/);
  });
  withConformanceFixture("production_verified", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const result = manifest.validation.resolvedTestResults.find((entry) => entry.testId === "format.web.public.01.09");
    const evidencePath = bundleFilePath(root, result.evidenceRef);
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.contentSha256 = "f".repeat(64);
    writeFixtureJson(evidencePath, evidence);
    result.evidenceSha256 = sha256File(evidencePath);
    expectRejected("production-profile-test-must-bind-delivered-bytes", clean, evaluateArtifact(manifest, root), /resolved production test .* does not bind the primary delivered bytes/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const gate = manifest.validation.gateResults[0];
    const attestationPath = bundleFilePath(root, gate.attestationRef);
    const attestation = JSON.parse(readFileSync(attestationPath, "utf8"));
    attestation.signature = `${attestation.signature.startsWith("A") ? "B" : "A"}${attestation.signature.slice(1)}`;
    writeFixtureJson(attestationPath, attestation);
    gate.attestationSha256 = sha256File(attestationPath);
    expectRejected("conformance-attestation-signature-cannot-be-forged", clean, evaluateArtifact(manifest, root), /attestation signature is invalid/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    const source = manifest.delivery.implementationSourceBindings[0];
    const lineagePath = bundleFilePath(root, source.lineageReceiptRef);
    const lineage = JSON.parse(readFileSync(lineagePath, "utf8"));
    lineage.outputs = [];
    writeFixtureJson(lineagePath, lineage);
    source.lineageReceiptSha256 = sha256File(lineagePath);
    expectRejected("source-lineage-cannot-drop-delivery-output", clean, evaluateArtifact(manifest, root), /lineage receipt violates its active schema|lineage outputs differ from delivery\.files/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest }) => {
    const clean = evaluateArtifact(manifest, root);
    let replayed = structuredClone(manifest);
    replayed.artifact.buildCardSha256 = "6".repeat(64);
    expectRejected("promotion-snapshot-rejects-build-card-and-receipt-replay", clean, evaluateArtifact(replayed, root), /promotion snapshot Build Card binding drifts|canonical Artifact Manifest projection hash drifts/);
    replayed = structuredClone(manifest);
    replayed.delivery.implementationBindings.preset.sha256 = "7".repeat(64);
    expectRejected("promotion-snapshot-rejects-preset-replay", clean, evaluateArtifact(replayed, root), /promotion snapshot preset binding drifts|canonical Artifact Manifest projection hash drifts/);
    replayed = structuredClone(manifest);
    replayed.delivery.implementationSourceBindings[0].lineageReceiptSha256 = "8".repeat(64);
    expectRejected("promotion-snapshot-rejects-source-lineage-replay", clean, evaluateArtifact(replayed, root), /promotion snapshot source and lineage bindings drift|canonical Artifact Manifest projection hash drifts/);
    replayed = structuredClone(manifest);
    replayed.validation.gateResults[0].receiptSha256 = "9".repeat(64);
    expectRejected("promotion-snapshot-rejects-signed-conformance-receipt-replay", clean, evaluateArtifact(replayed, root), /promotion snapshot signed receipt bindings drift|canonical Artifact Manifest projection hash drifts/);
  });
  withConformanceFixture("artifact_qa_passed", ({ root, manifest, operatorRoot, operatorTrustStorePath, operatorTrustPolicyPath }) => {
    const manifestRef = "artifact-manifest.promoted.json";
    writeFixtureJson(join(root, manifestRef), manifest);
    const request = { bundle: root, buildCard: files.buildCardExample, artifactManifest: manifestRef, trustStore: operatorTrustStorePath, trustPolicy: operatorTrustPolicyPath, errors: [] };
    const baseline = validateDownstreamBundle(request).errors;
    const withoutExternalTrust = validateDownstreamBundle({ ...request, trustStore: undefined }).errors;
    expectRejected("downstream-promoted-artifact-requires-external-trust-store", baseline, withoutExternalTrust, /--trust-store is required|operator-controlled trust stores/);
    const inBundleTrustPath = join(root, "operator-trust-store.json");
    copyFileSync(operatorTrustStorePath, inBundleTrustPath);
    const inBundleTrust = validateDownstreamBundle({ ...request, trustStore: inBundleTrustPath }).errors;
    expectRejected("downstream-rejects-in-bundle-trust-store", baseline, inBundleTrust, /caller-controlled and external to the protected bundle/);
    const unpinnedPolicy = JSON.parse(readFileSync(operatorTrustPolicyPath, "utf8"));
    unpinnedPolicy.stores[0].keys[0].publicKeySpkiSha256 = "0".repeat(64);
    const unpinnedPolicyPath = join(operatorRoot, "operator-trust-policy.unpinned.json");
    writeFixtureJson(unpinnedPolicyPath, unpinnedPolicy);
    const unpinnedTrust = validateDownstreamBundle({ ...request, trustPolicy: unpinnedPolicyPath }).errors;
    expectRejected("downstream-rejects-unpinned-sibling-trust-store", baseline, unpinnedTrust, /does not pin key/);
  });
}

if (assetRegistry) {
  const schema = documents.get(files.assetRegistrySchema);
  const baseline = validateSchema(schema, assetRegistry);
  const mutated = structuredClone(assetRegistry); mutated.identity[0].approvalStatus = "approved";
  expectRejected("approved-identity-without-role-contract", baseline, validateSchema(schema, mutated), /identity.*missing required property approvedBy|identity.*missing required property approvalReceiptRef/);
  const unapprovedTextIdentity = structuredClone(assetRegistry); unapprovedTextIdentity.textIdentityImplementations[0].approvalStatus = "candidate";
  expectRejected("text-identity-must-be-approved", baseline, validateSchema(schema, unapprovedTextIdentity), /approvalStatus.*must equal const "approved"/);
}

if (formatImplementationSchema && formatImplementationExample) {
  const baseline = validateSchema(formatImplementationSchema, formatImplementationExample);
  const noIdentity = structuredClone(formatImplementationExample); noIdentity.requirements.identityImplementationIds = [];
  expectRejected("format-record-cannot-omit-identity-implementation", baseline, validateSchema(formatImplementationSchema, noIdentity), /identityImplementationIds.*must contain at least 1 items/);
  const nativeReference = documents.get(files.formatImplementationAppNativeExample);
  if (nativeReference) {
    const nativeBaseline = [...validateSchema(formatImplementationSchema, nativeReference), ...implementationPlatformContractErrors(nativeReference)];
    const mixedPlatform = structuredClone(nativeReference);
    mixedPlatform.requirements.nativeFontMappingIds[0] = "fontmap.windows.identity-latin.georgia-bold.01";
    expectRejected("format-record-rejects-mixed-platform-native-mappings", nativeBaseline, [...validateSchema(formatImplementationSchema, mixedPlatform), ...implementationPlatformContractErrors(mixedPlatform)], /mixes authoring platforms in native font mappings/);
    const crossPlatformFixture = structuredClone(nativeReference);
    crossPlatformFixture.requirements.portabilityFixtureIds[0] = "portability.windows.identity-latin.availability";
    expectRejected("format-record-rejects-cross-platform-portability-fixture", nativeBaseline, [...validateSchema(formatImplementationSchema, crossPlatformFixture), ...implementationPlatformContractErrors(crossPlatformFixture)], /portability fixtures do not exactly match/);
  }
}

if (socialSidecarSchema && socialSidecarExample) {
  const destinationCueCases = [
    { destinationKind: "route", destination: "/portfolio/land?locale=th-TH#overview", destinationCue: "/portfolio/land?locale=th-TH#overview" },
    { destinationKind: "external", destination: "https://example.com/evidence/record?id=42", destinationCue: "example.com/evidence/record?id=42" },
    { destinationKind: "download", destination: "https://cdn.example.com/reports/latest.pdf", destinationCue: "cdn.example.com/reports/latest.pdf" },
    { destinationKind: "form", destination: "/contact/request-demo", destinationCue: "/contact/request-demo" },
    { destinationKind: "contact", destination: "mailto:hello@example.com", destinationCue: "mailto:hello@example.com" }
  ];
  for (const fixture of destinationCueCases) {
    check(socialDestinationCueErrors(fixture).length === 0, `social destination-cue contract does not accept the governed ${fixture.destinationKind} projection`);
    const wrongTarget = { ...fixture, destinationCue: `${fixture.destinationCue}.wrong-target` };
    check(socialDestinationCueErrors(wrongTarget).some((error) => /deterministically identify/.test(error)), `social destination-cue contract does not reject a wrong ${fixture.destinationKind} target`);
  }
  const socialAudienceHashErrors = (value) => {
    const expected = sha256Bytes(canonicalJson(socialSidecarAudienceProjection(value)));
    return value.outputClarity?.audienceTextSha256 === expected ? [] : ["social sidecar audience text hash mismatch"];
  };
  const baseline = [...validateSchema(socialSidecarSchema, socialSidecarExample), ...socialAudienceHashErrors(socialSidecarExample)];
  const legacySidecar = structuredClone(socialSidecarExample);
  legacySidecar.schemaVersion = "1.1";
  expectRejected("social-sidecar-v1.1-cannot-claim-v1.2-semantics", baseline, validateSchema(socialSidecarSchema, legacySidecar), /must equal const "1\.2"/);
  const mutated = structuredClone(socialSidecarExample);
  mutated.actionBinding.destinationCue = "different.example/path";
  expectRejected("social-sidecar-visible-copy-is-hash-bound", baseline, [...validateSchema(socialSidecarSchema, mutated), ...socialAudienceHashErrors(mutated)], /audience text hash mismatch/);
  withPromotedSocialFixture(({ evaluate }) => {
    const clean = evaluate();
    check(clean.length === 0, `promoted social happy path failed${clean.length ? `\n  ${clean.join("\n  ")}` : ""}`);
  });
  withPromotedSocialFixture(({ manifest, sidecar, evaluate }) => {
    const clean = evaluate();
    manifest.delivery.contentInspections[0].evidenceRef = sidecar.visibleCopyInspection.evidenceRef;
    manifest.delivery.contentInspections[0].evidenceSha256 = sidecar.visibleCopyInspection.evidenceSha256;
    expectRejected("social-specialized-copy-evidence-cannot-replace-file-content-inspection", clean, evaluate(), /not a passing audience-content inspection/);
  });
  withPromotedSocialFixture(({ sidecar, rewriteSidecar, evaluate }) => {
    const clean = evaluate();
    sidecar.campaign.expiresAt = "2026-09-01T00:39:59+07:00";
    rewriteSidecar();
    expectRejected("social-promotion-rejects-expired-campaign", clean, evaluate(), /artifact builtAt is outside the campaign window|production observedAt is outside the campaign window/);
  });
  withPromotedSocialFixture(({ sidecar, rewriteSidecar, evaluate }) => {
    const clean = evaluate();
    sidecar.rights.expiresAt = "2026-09-01T00:39:59+07:00";
    rewriteSidecar();
    expectRejected("social-promotion-rejects-expired-rights", clean, evaluate(), /artifact builtAt is outside the rights validity window|production observedAt is outside the rights validity window/);
  });
  withPromotedSocialFixture(({ sidecar, destinationEvidence, rewriteDestinationEvidence, evaluate }) => {
    const clean = evaluate();
    sidecar.actionBinding.destinationVerification.observedAt = "2026-09-01T00:40:00+07:00";
    sidecar.actionBinding.destinationVerification.freshnessTtlSeconds = 60;
    destinationEvidence.observedAt = sidecar.actionBinding.destinationVerification.observedAt;
    rewriteDestinationEvidence();
    expectRejected("social-promotion-rejects-stale-destination", clean, evaluate(), /destination verification is stale at promotion/);
  });
  withPromotedSocialFixture(({ sidecar, rewriteSidecar, evaluate }) => {
    const clean = evaluate();
    sidecar.actionBinding.destinationVerification.freshnessTtlSeconds = 599;
    rewriteSidecar();
    expectRejected("social-production-rejects-destination-fresh-at-promotion-but-stale-at-production", clean, evaluate(), /destination verification is stale at production/);
  });
  withPromotedSocialFixture(({ card, evaluate }) => {
    const clean = evaluate();
    card.actions[0].priority = "secondary";
    expectRejected("social-sidecar-cannot-bind-a-non-primary-action", clean, evaluate(), /must equal the Build Card primaryActionRef and carry primary priority/);
  });
  withPromotedSocialFixture(({ sidecar, rewriteSidecar, evaluate }) => {
    const clean = evaluate();
    sidecar.actionBinding.destinationCue = "wrong.example/rebuild02/Landometer-Home-TH.dc.html";
    rewriteSidecar();
    expectRejected("social-destination-cue-rejects-wrong-domain", clean, evaluate(), /does not deterministically identify the governed destination/);
  });
  withPromotedSocialFixture(({ sidecar, rewriteSidecar, evaluate }) => {
    const clean = evaluate();
    sidecar.actionBinding.destinationCue = "montri-th.github.io/rebuild02/wrong-target.html";
    rewriteSidecar();
    expectRejected("social-destination-cue-rejects-wrong-target", clean, evaluate(), /does not deterministically identify the governed destination/);
  });
  withPromotedSocialFixture(({ manifest, evaluate }) => {
    const clean = evaluate();
    manifest.delivery.implementationSourceBindings = manifest.delivery.implementationSourceBindings.filter((source) => source.role !== "export_preset");
    expectRejected("social-promoted-path-rejects-incomplete-source-lineage", clean, evaluate(), /requires an export_preset implementation source binding/);
  });
  withPromotedSocialFixture(({ root, sidecar, evaluate }) => {
    const clean = evaluate();
    writeFileSync(join(root, sidecar.artifact.creativePath), fixturePng(1, 1));
    expectRejected("social-promoted-path-rejects-wrong-pixel-target", clean, evaluate(), /pixel dimensions do not equal the governed target canvas/);
  });
  withPromotedSocialFixture(({ visibleEvidence, rewriteVisibleEvidence, evaluate }) => {
    const clean = evaluate();
    visibleEvidence.normalizedOcrProjection.claim.limitations = [];
    visibleEvidence.visualReviewProjection.claim.limitations = [];
    rewriteVisibleEvidence();
    expectRejected("social-visible-copy-rejects-missing-limitation", clean, evaluate(), /omits or changes a material limitation|do not exactly equal the governed visible copy/);
  });
  withPromotedSocialFixture(({ visibleEvidence, rewriteVisibleEvidence, evaluate }) => {
    const clean = evaluate();
    visibleEvidence.normalizedOcrProjection.action.destinationCue = "different.example/path";
    visibleEvidence.visualReviewProjection.action.destinationCue = "different.example/path";
    rewriteVisibleEvidence();
    expectRejected("social-visible-copy-rejects-changed-destination-cue", clean, evaluate(), /OCR destination cue differs|do not exactly equal the governed visible copy/);
  });
  withPromotedSocialFixture(({ visibleEvidence, rewriteVisibleEvidence, evaluate }) => {
    const clean = evaluate();
    visibleEvidence.unclassifiedVisibleText.push("Best city intelligence platform in the world");
    visibleEvidence.extraClaimTexts.push("Best city intelligence platform in the world");
    rewriteVisibleEvidence();
    expectRejected("social-visible-copy-rejects-extra-visible-overclaim", clean, evaluate(), /unclassified visible text or an extra visible overclaim/);
  });
}

{
  const releaseAttestation = documents.get(files.releaseApprovalAttestation);
  const expectation = {
    purpose: "release_approval",
    subjectRef: files.release,
    subjectSha256: sha256File(join(packageDir, files.release)),
    subjectMediaType: "application/json",
    requiredStoreScope: "package_release"
  };
  const baseline = verifyDetachedAttestation(releaseAttestation, expectation, packageReleaseTrustStores);
  const mutated = structuredClone(releaseAttestation);
  mutated.signature = `${mutated.signature.startsWith("A") ? "B" : "A"}${mutated.signature.slice(1)}`;
  expectRejected("package-approval-attestation-signature-cannot-be-forged", baseline, verifyDetachedAttestation(mutated, expectation, packageReleaseTrustStores), /attestation signature is invalid/);
}

{
  const rootAttestation = documents.get(files.packageRootAttestation);
  const checksumText = textFile(files.checksums);
  const expectation = {
    purpose: "package_root",
    subjectRef: files.checksums,
    subjectSha256: sha256Bytes(checksumText),
    subjectMediaType: "text/plain",
    requiredStoreScope: "package_release"
  };
  const baseline = verifyDetachedAttestation(rootAttestation, expectation, packageReleaseTrustStores);
  const masterHash = sha256File(join(packageDir, files.normativeMaster));
  const forgedMasterHash = sha256Bytes(Buffer.from(`${textFile(files.normativeMaster)}\nforged normative rule\n`, "utf8"));
  const signedChecksumEntries = new Map(checksumText.split(/\r?\n/).filter(Boolean).map((line) => {
    const match = /^([a-f0-9]{64})  ([^/]+)$/.exec(line);
    return match ? [match[2], match[1]] : [line, null];
  }));
  const staleChecksumErrors = signedChecksumEntries.get(files.normativeMaster) === forgedMasterHash
    ? []
    : [`${files.checksums}: hash mismatch for ${files.normativeMaster}`];
  expectRejected("downstream-rejects-active-package-byte-mutation-with-stale-signed-checksum", [], gatedDownstreamErrors(staleChecksumErrors, []), /Active Design System package integrity.*hash mismatch/s);
  const refreshedChecksumText = checksumText.replace(`${masterHash}  ${files.normativeMaster}`, `${forgedMasterHash}  ${files.normativeMaster}`);
  const replayErrors = verifyDetachedAttestation(rootAttestation, { ...expectation, subjectSha256: sha256Bytes(refreshedChecksumText) }, packageReleaseTrustStores);
  expectRejected("package-root-rejects-prose-mutation-even-when-checksum-line-is-refreshed", baseline, replayErrors, /attestation subject hash does not match/);
  expectRejected("downstream-cannot-ignore-active-package-root-failure", [], gatedDownstreamErrors(replayErrors, []), /Active Design System package integrity/);
}

if (targetProfiles && targetProfilesSchema) {
  const baseline = validateSchema(targetProfilesSchema, targetProfiles);
  const inventedExtension = structuredClone(targetProfiles); inventedExtension.extensionRegistry = "target-profile-extensions.json";
  expectRejected("social-target-extension-cannot-be-invented", baseline, validateSchema(targetProfilesSchema, inventedExtension), /extensionRegistry.*must be null/);
  const extraSocialTarget = structuredClone(targetProfiles); extraSocialTarget.profiles.push({ ...structuredClone(extraSocialTarget.profiles.find((profile) => profile.formatProfile === "social_static")), id: "target.social.story.1080x1920.01", canvas: { widthPx: 1080, heightPx: 1920, aspectRatio: "9:16" } });
  const socialErrors = [];
  const socials = extraSocialTarget.profiles.filter((profile) => profile.formatProfile === "social_static");
  if (!socialTargetsGoverned(socials)) socialErrors.push("social_static must resolve only the governed 1080 × 1080 square and 1200 × 630 link-preview targets");
  expectRejected("undeclared-social-ratio-blocks", [], socialErrors, /social_static must resolve only/);
}

if (formatPacks) {
  const baseline = receiptEquivalenceErrors(formatPacks);
  const mutated = structuredClone(formatPacks); mutated.equivalenceMap.receipt.document_flow = "document approval record";
  expectRejected("approval-record-in-receipt-equivalence", baseline, receiptEquivalenceErrors(mutated), /document_flow exposes an internal approval record/);
  const identityBaseline = identityEquivalenceErrors(formatPacks);
  const missingIdentityProfile = structuredClone(formatPacks); delete missingIdentityProfile.equivalenceMap.identity.social_static;
  expectRejected("identity-equivalence-must-cover-every-format", identityBaseline, identityEquivalenceErrors(missingIdentityProfile), /identity equivalence must cover every format profile exactly once/);
  const staticNavigationBaseline = staticNavigationProjectionContractErrors(formatPacks);
  const wrongPdfProjection = structuredClone(formatPacks); wrongPdfProjection.navigationContract.staticProjectionContract.groups.page_index.requiredStaticExposureByFormatProfile.pdf_fixed = "toc";
  expectRejected("static-navigation-contract-rejects-cross-format-page-index-exposure", staticNavigationBaseline, staticNavigationProjectionContractErrors(wrongPdfProjection), /static navigation projection contract must exactly separate/);
  const browserFieldLeak = structuredClone(formatPacks); browserFieldLeak.navigationContract.variants["pdf_fixed.static"].exposureField = "breakpointExposure";
  expectRejected("static-navigation-variant-rejects-browser-exposure-field", staticNavigationBaseline, staticNavigationProjectionContractErrors(browserFieldLeak), /navigation conformance variants must exactly bind/);
  const wrongVariantExposure = structuredClone(formatPacks); wrongVariantExposure.navigationContract.variants["pdf_fixed.static"].sideBookmarkExposure = "toc";
  expectRejected("static-navigation-variant-rejects-cross-format-bookmark-exposure", staticNavigationBaseline, staticNavigationProjectionContractErrors(wrongVariantExposure), /navigation conformance variants must exactly bind/);
  const componentTemplateBaseline = componentContractTemplateErrors(formatPacks);
  const fakeStaticBookmarkTemplate = structuredClone(formatPacks); fakeStaticBookmarkTemplate.componentContractTemplates.templates.find((entry) => entry.formatProfile === "pdf_fixed").contract.componentId = "component.fake.weak.01";
  expectRejected("static-bookmark-component-template-rejects-caller-authored-component", componentTemplateBaseline, componentContractTemplateErrors(fakeStaticBookmarkTemplate), /cover each selected static side-bookmark format exactly once|not the governed side-bookmark component/);
  const ctaBaseline = ctaDestinationContractErrors(formatPacks);
  const fakeStaticDirect = structuredClone(formatPacks); fakeStaticDirect.ctaDestinationContract.profiles.pdf_fixed.mode = "direct";
  expectRejected("static-CTA-contract-cannot-declare-direct-mode", ctaBaseline, ctaDestinationContractErrors(fakeStaticDirect), /pdf_fixed CTA destination mode must be static_equivalent/);
  const overlayBaseline = capabilityOverlayContractErrors(formatPacks);
  const incomplete = structuredClone(formatPacks); incomplete.overlays = incomplete.overlays.filter((overlay) => overlay.capability !== "telemetry");
  expectRejected("every-capability-requires-overlay", overlayBaseline, capabilityOverlayContractErrors(incomplete), /must cover every Build Card capability exactly once/);
  const ruleGap = structuredClone(formatPacks); ruleGap.overlays.find((overlay) => overlay.capability === "motion").requiredRuleIds = ruleGap.overlays.find((overlay) => overlay.capability === "motion").requiredRuleIds.filter((id) => id !== "MOTION-03");
  expectRejected("capability-overlay-cannot-drop-mapped-rule", overlayBaseline, capabilityOverlayContractErrors(ruleGap), /omits mapped capability rule MOTION-03/);
  const fakeSchemaRef = structuredClone(formatPacks); fakeSchemaRef.overlays.find((overlay) => overlay.capability === "data_table").configSchemaRef = "https://example.invalid/capability.schema.json";
  expectRejected("capability-overlay-rejects-fake-config-schema-ref", overlayBaseline, capabilityOverlayContractErrors(fakeSchemaRef), /configSchemaRef does not equal the active capability schema/);
  const fakeSchemaHash = structuredClone(formatPacks); fakeSchemaHash.overlays.find((overlay) => overlay.capability === "motion").configSchemaSha256 = "0".repeat(64);
  expectRejected("capability-overlay-rejects-fake-config-schema-hash", overlayBaseline, capabilityOverlayContractErrors(fakeSchemaHash), /configSchemaSha256 does not match active schema bytes/);
  const missingNativeMotionTests = structuredClone(formatPacks); missingNativeMotionTests.overlays.find((overlay) => overlay.capability === "motion").testMatrixByRuntimeClass.native_state = [];
  expectRejected("native-motion-runtime-requires-lifecycle-tests", overlayBaseline, capabilityOverlayContractErrors(missingNativeMotionTests), /native_state runtime tests must be nonempty/);
  const missingNativeMotionRule = structuredClone(formatPacks); missingNativeMotionRule.overlays.find((overlay) => overlay.capability === "motion").requiredRuleIdsByRuntimeClass.native_state = [];
  expectRejected("native-motion-runtime-must-resolve-MOTION-02", overlayBaseline, capabilityOverlayContractErrors(missingNativeMotionRule), /native_state must resolve MOTION-02/);
  const browserMotionFieldGap = structuredClone(formatPacks); browserMotionFieldGap.overlays.find((overlay) => overlay.capability === "motion").requiredFieldsByRuntimeClass.browser_observer = browserMotionFieldGap.overlays.find((overlay) => overlay.capability === "motion").requiredFieldsByRuntimeClass.browser_observer.filter((field) => field !== "staggerBeatCount");
  expectRejected("browser-MOTION-03-requires-exact-four-beat-fields", overlayBaseline, capabilityOverlayContractErrors(browserMotionFieldGap), /runtime fields must exactly isolate/);
  const nativeBrowserRecipeLeak = structuredClone(formatPacks); nativeBrowserRecipeLeak.overlays.find((overlay) => overlay.capability === "motion").requiredFieldsByRuntimeClass.native_state.push("opacityDurationMs");
  expectRejected("native-MOTION-03-rejects-browser-recipe-field", overlayBaseline, capabilityOverlayContractErrors(nativeBrowserRecipeLeak), /runtime fields must exactly isolate/);
  const presenterObserverLeak = structuredClone(formatPacks); presenterObserverLeak.overlays.find((overlay) => overlay.capability === "motion").requiredFieldsByRuntimeClass.presenter_sequence.push("observerThreshold");
  expectRejected("presenter-MOTION-03-rejects-browser-observer-field", overlayBaseline, capabilityOverlayContractErrors(presenterObserverLeak), /runtime fields must exactly isolate/);
  const compatibilityBaseline = capabilityOverlayUseErrors("motion", "web_public", formatPacks.overlays);
  const incompatible = structuredClone(formatPacks.overlays);
  incompatible.find((overlay) => overlay.capability === "motion").compatibleFormatProfiles = ["app_interactive", "deck_presentation"];
  expectRejected("active-capability-requires-compatible-format", compatibilityBaseline, capabilityOverlayUseErrors("motion", "web_public", incompatible), /motion capability is incompatible with format profile web_public/);
  const experienceBaseline = experienceProfileTestContractErrors(formatPacks);
  const missingExperienceTests = structuredClone(formatPacks); delete missingExperienceTests.experienceProfileTestMatrix.campaign;
  expectRejected("every-experience-profile-requires-stable-tests", experienceBaseline, experienceProfileTestContractErrors(missingExperienceTests), /must cover every profile exactly|campaign experience profile lacks stable usable tests/);
}

if (capabilityConfigSchema) {
  const typedDataTable = {
    capability: "data_table",
    question: "What should the reader compare?",
    columns: [{ id: "place", label: "Place" }],
    rows: [{ place: "Example" }],
    dataGrain: { row: "place" },
    claimIds: ["claim.example.01"],
    evidenceIds: ["evidence.example.01"],
    accessibleSummary: "One example place is listed.",
    cellStates: ["measured_zero", "no_data"]
  };
  const typedBinding = { schemaRef: release.schemaIds.capabilityConfig };
  const typedBaseline = capabilityConfigurationContractErrors("data_table", typedBinding, typedDataTable);
  const untypedBinding = { schemaRef: "https://example.invalid/anything.schema.json" };
  const allNull = Object.fromEntries(Object.keys(typedDataTable).map((key) => [key, key === "capability" ? "data_table" : null]));
  expectRejected("capability-config-rejects-unknown-schema-and-null-fields", typedBaseline, capabilityConfigurationContractErrors("data_table", untypedBinding, allNull), /schemaRef is not the active typed schema|violates capability-config\.schema\.json/);
  const wrongDiscriminator = { ...typedDataTable, capability: "map" };
  expectRejected("capability-config-discriminator-must-match-binding", typedBaseline, capabilityConfigurationContractErrors("data_table", typedBinding, wrongDiscriminator), /capability discriminator drifts|violates capability-config\.schema\.json/);

  const semanticTable = {
    ...typedDataTable,
    claimIds: [claimRecord.claimId],
    evidenceIds: [...claimRecord.evidenceRefs]
  };
  const semanticTableBaseline = capabilityConfigurationContractErrors("data_table", typedBinding, semanticTable, packageDir, build);
  const danglingTable = structuredClone(semanticTable);
  danglingTable.evidenceIds = ["evidence.missing.01"];
  expectRejected("capability-evidence-reference-must-resolve", semanticTableBaseline, capabilityConfigurationContractErrors("data_table", typedBinding, danglingTable, packageDir, build), /evidence reference .* does not resolve/);

  const downloadResourcePath = join(packageDir, files.readme);
  const downloadConfig = {
    capability: "download",
    resourceRef: files.readme,
    fileName: files.readme,
    mediaType: "text/markdown",
    byteSize: readFileSync(downloadResourcePath).byteLength,
    integritySha256: sha256File(downloadResourcePath),
    rights: { permission: "package documentation" },
    fallback: "Open the package README in place."
  };
  const downloadBaseline = capabilityConfigurationContractErrors("download", typedBinding, downloadConfig, packageDir, build);
  const danglingDownload = structuredClone(downloadConfig);
  danglingDownload.resourceRef = "missing-download.pdf";
  expectRejected("capability-download-resource-must-resolve", downloadBaseline, capabilityConfigurationContractErrors("download", typedBinding, danglingDownload, packageDir, build), /download resourceRef must resolve/);

  const formConfig = {
    capability: "form",
    purpose: "Request the governed source",
    fields: [{ id: "email", type: "email" }],
    validation: { email: "required" },
    submission: { destinationRef: "#source", method: "POST" },
    successState: "Request received",
    errorState: "Preserve input and retry",
    privacyNoticeRef: "#source"
  };
  const formBaseline = capabilityConfigurationContractErrors("form", typedBinding, formConfig, packageDir, build);
  const danglingForm = structuredClone(formConfig);
  danglingForm.submission.destinationRef = "#missing-section";
  expectRejected("capability-form-destination-must-resolve", formBaseline, capabilityConfigurationContractErrors("form", typedBinding, danglingForm, packageDir, build), /form submission\.destinationRef does not resolve/);

  const mapConfig = {
    capability: "map",
    geographyId: "example-geography",
    boundarySource: claimRecord.evidenceRefs[0],
    purpose: "Explain a bounded example geography",
    coveredArea: "Declared example boundary",
    dataGrain: { row: "area" },
    time: "2026-09-01",
    unit: "area",
    schemaRelease: "example.01",
    rightsAndAttribution: "Source-bound example",
    dataStates: ["no_data", "suppressed"],
    nonSpatialAlternative: "A labelled area summary.",
    exportReceipt: files.conformanceReceiptExample,
    scaleFamilies: ["density.area"]
  };
  const mapBaseline = capabilityConfigurationContractErrors("map", typedBinding, mapConfig, packageDir, build);
  const danglingMap = structuredClone(mapConfig);
  danglingMap.exportReceipt = "missing-map-receipt.json";
  expectRejected("capability-map-export-receipt-must-resolve", mapBaseline, capabilityConfigurationContractErrors("map", typedBinding, danglingMap, packageDir, build), /map exportReceipt does not resolve/);

  const root = mkdtempSync(join(tmpdir(), "lds-v094-external-effect-"));
  try {
    const contracts = {
      permission: {
        schemaVersion: "1.1", kind: "permission", contractId: "permission.external.01", artifactId: build.artifact.id, actionId: "external-effect-test",
        resource: "governed external resource", actorClasses: ["human_user"], allowedOperations: ["submit"], allowedClassifications: ["public"],
        decisionStates: ["allowed", "denied", "expired", "revoked", "unknown"], denialRecoveryByLocale: { "th-TH": "หยุดและขอสิทธิ์ที่ถูกต้อง", en: "Stop and request the correct authority." }
      },
      progress: {
        schemaVersion: "1.1", kind: "progress", contractId: "progress.external.01", states: ["idle", "running"],
        accessibleStatusByLocale: { "th-TH": "กำลังดำเนินการ", en: "The action is running." }, completionNotImpliedBeforeTerminal: true, cancellationPolicy: "Cancel before the external effect is committed."
      },
      result: {
        schemaVersion: "1.1", kind: "result", contractId: "result.external.01", states: ["succeeded", "failed", "cancelled"],
        messageByLocale: { "th-TH": "แสดงผลที่เกิดขึ้นจริง", en: "Show the actual terminal result." }, accessibleAnnouncement: "polite", receiptLinkPolicy: "Bind the terminal result to the same execution receipt."
      },
      recovery: {
        schemaVersion: "1.1", kind: "recovery", contractId: "recovery.external.01", failureStates: ["failed", "cancelled"], preservesInput: true,
        retryPolicy: "Retry only under fresh authority.", fallbackByLocale: { "th-TH": "เก็บข้อมูลและส่งให้ผู้มีสิทธิ์", en: "Preserve the input and hand off to an authorized owner." }, escalationPolicy: "Escalate after one governed retry."
      }
    };
    writeFixtureJson(join(root, "contracts.json"), contracts);
    copyFileSync(join(packageDir, files.agentActionReceiptSchema), join(root, files.agentActionReceiptSchema));
    const contractHash = sha256File(join(root, "contracts.json"));
    const contractSchemaHash = sha256File(join(packageDir, files.actionContractsSchema));
    const contractBinding = (kind) => ({ ref: `contracts.json#/${kind}`, sha256: contractHash, schemaRef: `${release.schemaIds.actionContracts}#/$defs/${kind}`, schemaSha256: contractSchemaHash });
    const externalEffect = {
      capability: "external_effect", effectClass: "reversible", external: true, cost: "none", reversible: true,
      confirmationPolicy: {
        mode: "explicit", beforeEffect: true,
        consequenceDisclosureByLocale: { "th-TH": "การทำงานนี้มีผลต่อระบบภายนอก", en: "This action changes an external system." },
        confirmLabelByLocale: { "th-TH": "ยืนยันและดำเนินการ", en: "Confirm and continue" }
      },
      permissionContract: contractBinding("permission"),
      progressPresentationContract: contractBinding("progress"),
      resultPresentationContract: contractBinding("result"),
      recoveryContract: contractBinding("recovery"),
      receiptSchemaBinding: { ref: files.agentActionReceiptSchema, sha256: sha256File(join(root, files.agentActionReceiptSchema)), schemaId: release.schemaIds.agentActionReceipt }
    };
    const externalBinding = { schemaRef: release.schemaIds.capabilityConfig };
    const externalBaseline = capabilityConfigurationContractErrors("external_effect", externalBinding, externalEffect, root, build);
    let mutated = structuredClone(externalEffect);
    mutated.permissionContract.schemaSha256 = "0".repeat(64);
    expectRejected("external-effect-requires-governed-contract-schema-hash", externalBaseline, capabilityConfigurationContractErrors("external_effect", externalBinding, mutated, root, build), /permissionContract schema hash does not match/);
    mutated = structuredClone(externalEffect);
    mutated.resultPresentationContract.ref = "contracts.json#/permission";
    expectRejected("external-effect-rejects-wrong-contract-kind", externalBaseline, capabilityConfigurationContractErrors("external_effect", externalBinding, mutated, root, build), /resultPresentationContract violates the governed result contract|resultPresentationContract kind drifts/);
    mutated = structuredClone(externalEffect);
    delete mutated.progressPresentationContract;
    mutated.progressPresentationRef = "contracts.json#/progress";
    expectRejected("external-effect-rejects-bare-contract-ref", externalBaseline, capabilityConfigurationContractErrors("external_effect", externalBinding, mutated, root, build), /violates capability-config\.schema\.json|progressPresentationContract is not a typed hash-bound contract/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

{
  const deliveredFile = { path: "final.pdf", sha256: "a".repeat(64), mediaType: "application/pdf" };
  const nonWebManifest = { delivery: { metadataProjection: { kind: "format_metadata", formatProfile: "pdf_fixed" }, files: [deliveredFile] } };
  const verification = {
    kind: "delivery_probe", probeId: "pdf.final-export.01", environment: "final_export", channel: "governed PDF export",
    observedAt: "2026-09-01T01:00:00+07:00", observedFiles: [deliveredFile], contentEquivalent: true
  };
  const builtAt = Date.parse("2026-09-01T00:40:00+07:00");
  const checkedAt = Date.parse("2026-09-01T01:05:00+07:00");
  const baseline = productionVerificationErrors(verification, nonWebManifest, builtAt, checkedAt);
  let mutated = structuredClone(verification);
  mutated.observedFiles[0].sha256 = "b".repeat(64);
  expectRejected("non-web-production-probe-binds-exact-delivery-bytes", baseline, productionVerificationErrors(mutated, nonWebManifest, builtAt, checkedAt), /observed-file set differs/);
  mutated = structuredClone(verification);
  mutated.kind = "production_probe";
  expectRejected("non-web-production-requires-final-export-probe", baseline, productionVerificationErrors(mutated, nonWebManifest, builtAt, checkedAt), /final export or distribution probe did not prove/);
}

if (claimManifest) {
  const bindingErrors = (value) => value.records[0].sha256 === sha256File(join(packageDir, files.claimRecordExample)) ? [] : ["claim record hash binding drift"];
  const mutated = structuredClone(claimManifest); mutated.records[0].sha256 = "0".repeat(64);
  expectRejected("claim-record-hash-drift", bindingErrors(claimManifest), bindingErrors(mutated), /claim record hash binding drift/);
}

if (assetApprovalReceipt) {
  const evaluateApproval = (value) => [...validateSchema(assetApprovalReceiptSchema, value), ...assetApprovalReceiptErrors(assetRegistry, value)];
  const baseline = evaluateApproval(assetApprovalReceipt);
  const probe = (label, mutate, expected) => {
    const mutated = structuredClone(assetApprovalReceipt);
    mutate(mutated);
    expectRejected(label, baseline, evaluateApproval(mutated), expected);
  };
  probe("duplicate-asset-grant", (value) => { value.assets.push(structuredClone(value.assets[0])); }, /duplicate asset IDs|items must be unique|exactly one approval grant/);
  probe("asset-grant-hash-drift", (value) => { value.assets[0].sha256 = "0".repeat(64); }, /asset grant .* hash drifts from registry/);
  probe("asset-grant-fallback-drift", (value) => { value.assets[0].fallback = "unapproved fallback"; }, /fallback drifts/);
  probe("broadened-asset-format-rights", (value) => { value.assets[0].allowedFormatProfiles.push("unknown_format"); }, /allowedFormatProfiles.*is not in enum/);
  probe("duplicate-asset-audience-grant", (value) => { value.assets[0].allowedAudiences.push("public"); }, /allowedAudiences.*items must be unique/);
}

if (agentAction) {
  const runtimeSchema = documents.get(files.agentActionSchema);
  const evaluateAgent = (value) => [...validateSchema(runtimeSchema, value), ...agentActionCrossErrors(value, build)];
  const baseline = evaluateAgent(agentAction);
  const probe = (label, mutate, expected) => {
    const mutated = structuredClone(agentAction);
    mutate(mutated);
    expectRejected(label, baseline, evaluateAgent(mutated), expected);
  };
  probe("agent-definition-binding-drift", (value) => { value.definitionSha256 = "0".repeat(64); }, /agent action definition hash does not match bytes/);
  probe("agent-actor-scope-drift", (value) => { value.scope.actor = "different-actor"; }, /agent action actor is outside authority scope/);
  probe("agent-input-value-hash-drift", (value) => { value.inputs.valueSha256 = "0".repeat(64); }, /agent action input value hash mismatch/);
  probe("agent-input-classification-escalation", (value) => { value.inputs.classification = "restricted"; }, /input classification is not allowed by definition|authority does not allow the input classification/);
  probe("agent-authority-hash-drift", (value) => { value.permission.authoritySha256 = "0".repeat(64); }, /agent action authority hash does not match bytes/);
  probe("agent-result-schema-hash-drift", (value) => { value.execution.resultSchemaSha256 = "0".repeat(64); }, /result schema binding drifts from definition/);
  probe("agent-receipt-schema-hash-drift", (value) => { value.execution.receiptSchemaSha256 = "0".repeat(64); }, /receipt schema binding drifts from definition/);
  probe("agent-execution-after-denial", (value) => { value.execution.status = "running"; value.execution.startedAt = "2026-09-01T01:00:00+07:00"; value.permission.status = "denied"; }, /execution attempted without effective permission/);
  probe("agent-runtime-redefines-side-effect", (value) => { value.sideEffect.class = "destructive"; value.sideEffect.reversible = false; }, /side effect drifts from immutable definition/);
  probe("agent-no-effect-cannot-record-effect", (value) => { value.execution.effectAt = "2026-09-01T01:00:00+07:00"; }, /effectAt.*must be null|records an effect for a no-effect operation/);
  probe("agent-success-without-receipt", (value) => { value.execution.status = "succeeded"; value.execution.startedAt = "2026-09-01T01:00:00+07:00"; value.execution.completedAt = "2026-09-01T01:00:01+07:00"; }, /completed agent action lacks a valid hash-bound receipt/);

  const runtimeSchemaBaseline = validateSchema(runtimeSchema, agentAction);
  const longRunningWithoutTerminalRevocation = structuredClone(agentAction);
  longRunningWithoutTerminalRevocation.execution.status = "succeeded";
  longRunningWithoutTerminalRevocation.execution.startedAt = "2026-09-01T01:00:00+07:00";
  longRunningWithoutTerminalRevocation.execution.completedAt = "2026-09-01T10:00:00+07:00";
  expectRejected("long-running-agent-cannot-terminally-reuse-only-pre-start-revocation", runtimeSchemaBaseline, validateSchema(runtimeSchema, longRunningWithoutTerminalRevocation), /terminalRevocationRef.*must be string|terminalRevocationSha256.*must be string|terminalRevocationAttestationRef.*must be string/);

  const namedScopeRuntime = structuredClone(agentAction);
  namedScopeRuntime.scope.productScope = "named_product";
  namedScopeRuntime.scope.namedProduct = "ijji";
  expectRejected("agent-named-product-scope-drift", agentDefinitionRuntimeScopeErrors(agentActionDefinition, agentAction, build), agentDefinitionRuntimeScopeErrors(agentActionDefinition, namedScopeRuntime, build), /product scope drifts from runtime|named product drifts from runtime/);
}

if (agentActionDefinition) {
  const baseline = validateSchema(agentActionDefinitionSchema, agentActionDefinition);
  const mutated = structuredClone(agentActionDefinition); mutated.permissionPolicy = "owner_authorized"; mutated.sideEffect.class = "destructive"; mutated.sideEffect.reversible = false; mutated.confirmationPolicy = { required: false, mode: "none" };
  expectRejected("destructive-definition-without-step-up", baseline, validateSchema(agentActionDefinitionSchema, mutated), /confirmationPolicy\/required.*must equal const true|confirmationPolicy\/mode.*is not in enum/);
}

if (agentActionDefinition && claimRecord) {
  const baseline = agentResultValueErrors(claimRecord, agentActionDefinition.resultSchemaRef);
  const mutated = structuredClone(claimRecord); delete mutated.claimId;
  expectRejected("agent-result-must-satisfy-bound-schema", baseline, agentResultValueErrors(mutated, agentActionDefinition.resultSchemaRef), /result violates its bound schema: .*missing required property claimId/);
}

if (claimRecord && agentActionDefinition) {
  const root = mkdtempSync(join(tmpdir(), "lds-v094-agent-terminal-"));
  try {
    writeFixtureJson(join(root, "failed-result.json"), claimRecord);
    writeFixtureJson(join(root, "recovery.json"), { next: "retry" });
    writeFixtureJson(join(root, "diagnostics.json"), { code: "EXAMPLE_FAILURE" });
    const runtime = {
      execution: {
        resultSchemaRef: agentActionDefinition.resultSchemaRef,
        resultRef: "failed-result.json",
        resultSha256: sha256File(join(root, "failed-result.json")),
        recoveryRef: "recovery.json",
        recoverySha256: sha256File(join(root, "recovery.json"))
      }
    };
    const receipt = { diagnosticsRef: "diagnostics.json", diagnosticsSha256: sha256File(join(root, "diagnostics.json")) };
    const baseline = agentTerminalEvidenceErrors(runtime, receipt, root);
    let mutated = structuredClone(runtime); mutated.execution.resultRef = "missing-result.json";
    expectRejected("failed-agent-result-ref-must-resolve", baseline, agentTerminalEvidenceErrors(mutated, receipt, root), /terminal resultRef does not resolve/);
    mutated = structuredClone(runtime); mutated.execution.recoveryRef = "missing-recovery.json";
    expectRejected("cancelled-agent-recovery-ref-must-resolve", baseline, agentTerminalEvidenceErrors(mutated, receipt, root), /terminal recoveryRef does not resolve/);
    const badReceipt = { diagnosticsRef: "missing-diagnostics.json", diagnosticsSha256: receipt.diagnosticsSha256 };
    expectRejected("agent-diagnostics-ref-must-resolve", baseline, agentTerminalEvidenceErrors(runtime, badReceipt, root), /diagnosticsRef does not resolve/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const authorityProbe = { authorizedSideEffectClasses: ["reversible"] };
const effectProbe = { class: "reversible", external: false, cost: "none", reversible: true };
let mutatedEffect = { ...effectProbe, external: true };
expectRejected("external-effect-requires-external-authority", agentSideEffectAuthorityErrors(authorityProbe, effectProbe), agentSideEffectAuthorityErrors(authorityProbe, mutatedEffect), /external effect is outside authority scope/);
mutatedEffect = { ...effectProbe, cost: "possible" };
expectRejected("possible-cost-requires-costly-authority", agentSideEffectAuthorityErrors(authorityProbe, effectProbe), agentSideEffectAuthorityErrors(authorityProbe, mutatedEffect), /costly effect is outside authority scope/);
mutatedEffect = { ...effectProbe, cost: "known" };
expectRejected("known-cost-requires-costly-authority", agentSideEffectAuthorityErrors(authorityProbe, effectProbe), agentSideEffectAuthorityErrors(authorityProbe, mutatedEffect), /costly effect is outside authority scope/);

{
  const authority = {
    authorityId: "authority.chronology.01",
    authorizedAt: "2026-09-01T00:30:00+07:00",
    validity: { notBefore: "2026-09-01T00:30:00+07:00", expiresAt: "2026-09-01T02:00:00+07:00" }
  };
  const runtime = {
    actionId: "inspect-claim",
    scope: { artifactId: build.artifact.id, actor: "example-reader" },
    sideEffect: { class: "reversible", external: true, cost: "none", summary: "Example effect.", reversible: true },
    confirmation: { required: true, state: "confirmed", confirmedBy: "example-reader", confirmedAt: "2026-09-01T00:59:59+07:00" },
    execution: { executionNonce: "nonce.chronology.execution.01", buildCardRef: files.buildCardExample, buildCardSha256: sha256File(join(packageDir, files.buildCardExample)), status: "succeeded", startedAt: "2026-09-01T01:00:00+07:00", effectAt: "2026-09-01T01:00:01+07:00", completedAt: "2026-09-01T01:00:02+07:00", recoveryRef: "recovery.json", recoverySha256: "1".repeat(64) }
  };
  const baseline = agentChronologyErrors(runtime, authority);
  let changedAuthority = structuredClone(authority); changedAuthority.authorizedAt = "2026-09-01T01:00:01+07:00";
  expectRejected("agent-cannot-start-before-authorization", baseline, agentChronologyErrors(runtime, changedAuthority), /validity begins before authorization|started before authorization/);
  let changedRuntime = structuredClone(runtime); changedRuntime.confirmation.confirmedAt = "2026-09-01T01:00:02+07:00";
  expectRejected("agent-confirmation-must-precede-effect", baseline, agentChronologyErrors(changedRuntime, authority), /confirmation occurred after the effect/);
  changedAuthority = structuredClone(authority); changedAuthority.validity.expiresAt = "2026-09-01T01:00:01+07:00";
  expectRejected("agent-authority-must-survive-terminal-boundary", baseline, agentChronologyErrors(runtime, changedAuthority), /expired before the execution boundary/);
  changedRuntime = structuredClone(runtime); changedRuntime.execution.effectAt = "2026-09-01T01:00:03+07:00";
  expectRejected("agent-effect-cannot-follow-completion", baseline, agentChronologyErrors(changedRuntime, authority), /effect follows terminal completion/);

  const revocation = {
    releaseRef,
    revocationId: "revocation.chronology.pre-start.01",
    authorityId: authority.authorityId,
    decisionPhase: "pre_start",
    executionNonce: runtime.execution.executionNonce,
    buildCardRef: runtime.execution.buildCardRef,
    buildCardSha256: runtime.execution.buildCardSha256,
    artifactId: runtime.scope.artifactId,
    actionId: runtime.actionId,
    actorId: runtime.scope.actor,
    status: "not_revoked",
    checkedAt: "2026-09-01T00:59:59+07:00",
    revokedAt: null
  };
  const revocationBaseline = agentRevocationErrors(revocation, authority, runtime, build);
  let changedRevocation = structuredClone(revocation); changedRevocation.checkedAt = "2026-09-01T00:54:59+07:00";
  expectRejected("agent-revocation-check-must-be-fresh-before-start", revocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build), /five-minute pre-start freshness/);
  const futureAuthority = structuredClone(authority);
  futureAuthority.authorizedAt = "2026-09-01T00:59:59.500+07:00";
  futureAuthority.validity.notBefore = "2026-09-01T00:59:59.500+07:00";
  expectRejected("agent-pre-start-revocation-cannot-predate-authority", revocationBaseline, agentRevocationErrors(revocation, futureAuthority, runtime, build), /predates authority authorization or validity/);
  changedRevocation = structuredClone(revocation); changedRevocation.executionNonce = "nonce.replayed.execution.02";
  expectRejected("agent-revocation-decision-cannot-replay-across-nonce", revocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build), /execution nonce drifts/);
  changedRevocation = structuredClone(revocation); changedRevocation.actorId = "different-actor";
  expectRejected("agent-revocation-decision-cannot-replay-across-actor", revocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build), /actor drifts/);
  changedRevocation = { ...revocation, status: "revoked", revokedAt: "2026-09-01T00:59:58+07:00" };
  expectRejected("agent-revoked-before-start", revocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build), /revoked before execution/);
  const backdatedAfterRevocation = { ...revocation, status: "revoked", checkedAt: "2026-09-01T01:00:04+07:00", revokedAt: "2026-09-01T01:00:03+07:00" };
  expectRejected("agent-revocation-decision-cannot-be-backdated-after-start", revocationBaseline, agentRevocationErrors(backdatedAfterRevocation, authority, runtime, build), /must be checked before execution starts|pre-start freshness/);

  const terminalRevocation = {
    ...revocation,
    revocationId: "revocation.chronology.terminal.01",
    decisionPhase: "terminal_boundary",
    checkedAt: "2026-09-01T01:00:02+07:00"
  };
  const terminalRevocationBaseline = agentRevocationErrors(terminalRevocation, authority, runtime, build, "terminal_boundary");
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.checkedAt = "2026-09-01T01:00:00.999+07:00";
  expectRejected("agent-terminal-revocation-cannot-precede-effect-boundary", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /must be checked at or after the effect or terminal boundary/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.checkedAt = "2026-09-01T01:05:01.001+07:00";
  expectRejected("agent-terminal-revocation-must-be-fresh-after-long-running-action", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /five-minute post-boundary freshness/);
  changedRevocation = { ...terminalRevocation, status: "revoked", revokedAt: "2026-09-01T01:00:00.500+07:00" };
  expectRejected("agent-revoked-during-execution-cannot-complete", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /revoked at or before the effect or terminal execution boundary/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.executionNonce = "nonce.replayed.terminal.02";
  expectRejected("agent-terminal-revocation-cannot-replay-across-nonce", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /execution nonce drifts/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.buildCardSha256 = "2".repeat(64);
  expectRejected("agent-terminal-revocation-cannot-replay-across-build", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /Build Card binding drifts/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.actionId = "different-action";
  expectRejected("agent-terminal-revocation-cannot-replay-across-action", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /action drifts/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.artifactId = "different-artifact";
  expectRejected("agent-terminal-revocation-cannot-replay-across-artifact", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /artifact drifts/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.actorId = "different-actor";
  expectRejected("agent-terminal-revocation-cannot-replay-across-actor", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /actor drifts/);
  changedRevocation = structuredClone(terminalRevocation); changedRevocation.decisionPhase = "pre_start";
  expectRejected("agent-pre-start-revocation-cannot-replay-as-terminal-decision", terminalRevocationBaseline, agentRevocationErrors(changedRevocation, authority, runtime, build, "terminal_boundary"), /decision phase must be terminal_boundary/);

  const bindingAuthority = structuredClone(authority);
  bindingAuthority.validity = {
    ...bindingAuthority.validity,
    revocationRef: "revocation.pre-start.json",
    revocationSha256: "3".repeat(64),
    revocationAttestationRef: "revocation.pre-start.attestation.json",
    revocationAttestationSha256: "4".repeat(64)
  };
  const terminalBindingRuntime = structuredClone(runtime);
  terminalBindingRuntime.execution.terminalRevocationRef = "revocation.terminal.json";
  terminalBindingRuntime.execution.terminalRevocationSha256 = "5".repeat(64);
  terminalBindingRuntime.execution.terminalRevocationAttestationRef = "revocation.terminal.attestation.json";
  terminalBindingRuntime.execution.terminalRevocationAttestationSha256 = "6".repeat(64);
  const terminalBindingBaseline = agentTerminalRevocationBindingErrors(terminalBindingRuntime, bindingAuthority, revocation, terminalRevocation);
  const replayedBinding = structuredClone(terminalBindingRuntime);
  replayedBinding.execution.terminalRevocationRef = bindingAuthority.validity.revocationRef;
  expectRejected("agent-pre-start-revocation-binding-cannot-be-reused-at-terminal", terminalBindingBaseline, agentTerminalRevocationBindingErrors(replayedBinding, bindingAuthority, revocation, terminalRevocation), /must be distinct from the pre-start decision/);
  const sameLogicalDecision = { ...terminalRevocation, revocationId: revocation.revocationId };
  expectRejected("agent-terminal-revocation-requires-distinct-logical-id", terminalBindingBaseline, agentTerminalRevocationBindingErrors(terminalBindingRuntime, bindingAuthority, revocation, sameLogicalDecision), /distinct logical revocationId/);

  const preStartOrderBaseline = agentPreStartAttestationOrderErrors(runtime, authority, Date.parse("2026-09-01T00:59:59+07:00"), Date.parse("2026-09-01T00:59:59.500+07:00"));
  expectRejected("agent-authority-attestation-cannot-predate-bound-pre-start-attestation", preStartOrderBaseline, agentPreStartAttestationOrderErrors(runtime, authority, Date.parse("2026-09-01T00:59:59+07:00"), Date.parse("2026-09-01T00:59:58+07:00")), /pre-start revocation attestation must be issued no later/);
  const terminalOrderBaseline = agentTerminalAttestationOrderErrors(Date.parse("2026-09-01T01:00:02+07:00"), Date.parse("2026-09-01T01:00:03+07:00"));
  expectRejected("agent-receipt-attestation-cannot-predate-terminal-revocation-attestation", terminalOrderBaseline, agentTerminalAttestationOrderErrors(Date.parse("2026-09-01T01:00:02+07:00"), Date.parse("2026-09-01T01:00:01+07:00")), /terminal revocation attestation must be issued no later/);

  const recoveryBaseline = agentRecoveryRequirementErrors(runtime, ["failed", "cancelled"]);
  changedRuntime = structuredClone(runtime); changedRuntime.execution.status = "failed"; changedRuntime.execution.recoveryRef = null; delete changedRuntime.execution.recoverySha256;
  expectRejected("failed-agent-must-bind-applicable-recovery", recoveryBaseline, agentRecoveryRequirementErrors(changedRuntime, ["failed", "cancelled"]), /requires a hash-bound recovery result/);
  expectRejected("consequential-agent-recovery-must-cover-cancellation", recoveryBaseline, agentRecoveryRequirementErrors(runtime, ["failed"]), /must cover failed and cancelled/);
}

{
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const signer = { issuerId: "fixture-agent-operator", keyId: "fixture.agent.execution.01", privateKey };
  const trustStore = {
    schemaVersion: "1.1",
    trustStoreId: "trust.fixture.agent.execution",
    controlledBy: "Independent agent execution operator fixture",
    scope: "operator_external",
    keys: [{
      keyId: signer.keyId,
      issuerId: signer.issuerId,
      algorithm: "Ed25519",
      publicKeySpkiPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
      allowedPurposes: ["agent_authority", "agent_execution", "agent_revocation"],
      validFrom: "2026-08-01T00:00:00+07:00",
      validUntil: null,
      revokedAt: null
    }]
  };
  const receipt = {
    executionId: "execution.signed.01",
    executionNonce: "nonce.signed.execution.01",
    buildCardRef: files.buildCardExample,
    buildCardSha256: sha256File(join(packageDir, files.buildCardExample)),
    terminalRevocationRef: "revocations/agent-terminal.json",
    terminalRevocationSha256: "7".repeat(64),
    terminalRevocationSchemaRef: release.schemaIds.agentActionRevocation,
    terminalRevocationAttestationRef: "revocations/agent-terminal.attestation.json",
    terminalRevocationAttestationSha256: "8".repeat(64),
    artifactId: build.artifact.id,
    actionId: "inspect-claim",
    actor: "example-reader",
    status: "succeeded",
    completedAt: "2026-09-01T01:00:02+07:00"
  };
  const receiptHash = sha256Bytes(canonicalJson(receipt));
  const attestation = createSignedAttestation({
    purpose: "agent_execution",
    subjectRef: "receipts/agent-execution.json",
    subjectSha256: receiptHash,
    attestationId: "attestation.agent-execution.fixture.01",
    issuedAt: receipt.completedAt
  }, signer);
  const expectation = {
    purpose: "agent_execution",
    subjectRef: "receipts/agent-execution.json",
    subjectSha256: receiptHash,
    subjectMediaType: "application/json",
    operationAt: receipt.completedAt,
    maximumIssueDelayMs: 300000,
    verificationTime: "2026-09-01T02:00:00+07:00",
    requiredStoreScope: "operator_external"
  };
  const baseline = verifyDetachedAttestation(attestation, expectation, [trustStore]);
  const forged = structuredClone(attestation);
  forged.signature = `${forged.signature.startsWith("A") ? "B" : "A"}${forged.signature.slice(1)}`;
  expectRejected("agent-terminal-execution-attestation-cannot-be-forged", baseline, verifyDetachedAttestation(forged, expectation, [trustStore]), /attestation signature is invalid/);
  const replayedReceipt = { ...receipt, executionNonce: "nonce.replayed.execution.02" };
  expectRejected("agent-terminal-attestation-cannot-replay-across-execution-nonce", baseline, verifyDetachedAttestation(attestation, { ...expectation, subjectSha256: sha256Bytes(canonicalJson(replayedReceipt)) }, [trustStore]), /attestation subject hash does not match/);
  const replayedBuild = { ...receipt, buildCardSha256: "5".repeat(64) };
  expectRejected("agent-terminal-attestation-cannot-replay-across-build", baseline, verifyDetachedAttestation(attestation, { ...expectation, subjectSha256: sha256Bytes(canonicalJson(replayedBuild)) }, [trustStore]), /attestation subject hash does not match/);
  const replayedTerminalRevocation = { ...receipt, terminalRevocationSha256: "9".repeat(64) };
  expectRejected("agent-terminal-attestation-covers-terminal-revocation-binding", baseline, verifyDetachedAttestation(attestation, { ...expectation, subjectSha256: sha256Bytes(canonicalJson(replayedTerminalRevocation)) }, [trustStore]), /attestation subject hash does not match/);
  const revokedStore = structuredClone(trustStore);
  revokedStore.keys[0].revokedAt = "2026-09-01T01:30:00+07:00";
  expectRejected("post-compromise-backdated-agent-attestation-is-rejected-at-verification-time", baseline, verifyDetachedAttestation(attestation, expectation, [revokedStore]), /revoked at verification time/);

  const terminalRevocationDecision = {
    schemaVersion: "1.2",
    releaseRef,
    revocationId: "revocation.signed.terminal.01",
    authorityId: "authority.signed.01",
    decisionPhase: "terminal_boundary",
    executionNonce: receipt.executionNonce,
    buildCardRef: receipt.buildCardRef,
    buildCardSha256: receipt.buildCardSha256,
    artifactId: receipt.artifactId,
    actionId: receipt.actionId,
    actorId: receipt.actor,
    status: "not_revoked",
    checkedAt: "2026-09-01T01:00:02+07:00",
    revokedAt: null,
    reason: null,
    decisionBy: "Fixture operator",
    evidenceRef: "fixture:terminal-revocation:01"
  };
  const terminalRevocationHash = sha256Bytes(canonicalJson(terminalRevocationDecision));
  const terminalRevocationAttestation = createSignedAttestation({
    purpose: "agent_revocation",
    subjectRef: receipt.terminalRevocationRef,
    subjectSha256: terminalRevocationHash,
    attestationId: "attestation.agent-revocation.terminal.fixture.01",
    issuedAt: terminalRevocationDecision.checkedAt
  }, signer);
  const terminalRevocationExpectation = {
    purpose: "agent_revocation",
    subjectRef: receipt.terminalRevocationRef,
    subjectSha256: terminalRevocationHash,
    subjectMediaType: "application/json",
    operationAt: terminalRevocationDecision.checkedAt,
    maximumIssueDelayMs: 300000,
    verificationTime: "2026-09-01T02:00:00+07:00",
    requiredStoreScope: "operator_external"
  };
  const terminalSignatureBaseline = verifyDetachedAttestation(terminalRevocationAttestation, terminalRevocationExpectation, [trustStore]);
  const forgedTerminalRevocation = structuredClone(terminalRevocationAttestation);
  forgedTerminalRevocation.signature = `${forgedTerminalRevocation.signature.startsWith("A") ? "B" : "A"}${forgedTerminalRevocation.signature.slice(1)}`;
  expectRejected("agent-terminal-revocation-attestation-cannot-be-forged", terminalSignatureBaseline, verifyDetachedAttestation(forgedTerminalRevocation, terminalRevocationExpectation, [trustStore]), /attestation signature is invalid/);
  const replayedTerminalDecision = { ...terminalRevocationDecision, actorId: "different-actor" };
  expectRejected("agent-terminal-revocation-attestation-cannot-replay-across-subject", terminalSignatureBaseline, verifyDetachedAttestation(terminalRevocationAttestation, { ...terminalRevocationExpectation, subjectSha256: sha256Bytes(canonicalJson(replayedTerminalDecision)) }, [trustStore]), /attestation subject hash does not match/);
  expectRejected("post-compromise-terminal-revocation-attestation-is-rejected-at-verification-time", terminalSignatureBaseline, verifyDetachedAttestation(terminalRevocationAttestation, terminalRevocationExpectation, [revokedStore]), /revoked at verification time/);

  const preStartAttestationExpectation = {
    purpose: "agent_revocation",
    subjectRef: "revocations/pre-start.signed.json",
    subjectSha256: "a".repeat(64),
    subjectMediaType: "application/json",
    operationAt: "2026-09-01T00:59:59+07:00",
    maximumIssueDelayMs: 300000,
    latestIssueAt: "2026-09-01T01:00:00+07:00",
    verificationTime: "2026-09-01T02:00:00+07:00",
    requiredStoreScope: "operator_external"
  };
  const timelyPreStartAttestation = createSignedAttestation({
    purpose: "agent_revocation",
    subjectRef: preStartAttestationExpectation.subjectRef,
    subjectSha256: preStartAttestationExpectation.subjectSha256,
    attestationId: "attestation.agent-revocation.pre-start.timely.01",
    issuedAt: "2026-09-01T00:59:59+07:00"
  }, signer);
  const preStartSignatureBaseline = verifyDetachedAttestation(timelyPreStartAttestation, preStartAttestationExpectation, [trustStore]);
  const lateSignedPreStartAttestation = createSignedAttestation({
    purpose: "agent_revocation",
    subjectRef: preStartAttestationExpectation.subjectRef,
    subjectSha256: preStartAttestationExpectation.subjectSha256,
    attestationId: "attestation.agent-revocation.pre-start.back-signed.01",
    issuedAt: "2026-09-01T01:04:58+07:00"
  }, signer);
  expectRejected("agent-pre-start-revocation-cannot-be-back-signed-after-execution-start", preStartSignatureBaseline, verifyDetachedAttestation(lateSignedPreStartAttestation, preStartAttestationExpectation, [trustStore]), /issued after the latest permitted time/);
  const authorityAttestationExpectation = {
    ...preStartAttestationExpectation,
    purpose: "agent_authority",
    subjectRef: "authorities/authority.signed.json",
    subjectSha256: "b".repeat(64)
  };
  const timelyAuthorityAttestation = createSignedAttestation({
    purpose: "agent_authority",
    subjectRef: authorityAttestationExpectation.subjectRef,
    subjectSha256: authorityAttestationExpectation.subjectSha256,
    attestationId: "attestation.agent-authority.timely.01",
    issuedAt: "2026-09-01T00:59:59.500+07:00"
  }, signer);
  const authoritySignatureBaseline = verifyDetachedAttestation(timelyAuthorityAttestation, authorityAttestationExpectation, [trustStore]);
  const lateSignedAuthorityAttestation = createSignedAttestation({
    purpose: "agent_authority",
    subjectRef: authorityAttestationExpectation.subjectRef,
    subjectSha256: authorityAttestationExpectation.subjectSha256,
    attestationId: "attestation.agent-authority.back-signed.01",
    issuedAt: "2026-09-01T01:00:01+07:00"
  }, signer);
  expectRejected("agent-authority-cannot-be-back-signed-after-execution-start", authoritySignatureBaseline, verifyDetachedAttestation(lateSignedAuthorityAttestation, authorityAttestationExpectation, [trustStore]), /issued after the latest permitted time/);

  const root = mkdtempSync(join(tmpdir(), "lds-v094-agent-terminal-revocation-"));
  try {
    for (const directory of ["authorities", "receipts", "revocations"]) mkdirSync(join(root, directory), { recursive: true });
    const fixtureCard = structuredClone(build);
    const definition = structuredClone(agentActionDefinition);
    definition.schemaVersion = release.schemas.agentActionDefinition;
    definition.receiptSchemaRef = release.schemaIds.agentActionReceipt;
    definition.receiptSchemaSha256 = sha256File(join(packageDir, files.agentActionReceiptSchema));
    writeFixtureJson(join(root, files.agentActionDefinitionExample), definition);
    fixtureCard.capabilityConfigRefs.agent_action = {
      ref: files.agentActionDefinitionExample,
      sha256: sha256File(join(root, files.agentActionDefinitionExample)),
      schemaRef: release.schemaIds.agentActionDefinition
    };
    writeFixtureJson(join(root, files.buildCardExample), fixtureCard);
    for (const filename of [files.agentActionInputExampleSchema, files.agentActionInputExample, files.claimRecordExample]) copyFileSync(join(packageDir, filename), join(root, filename));

    const fixtureNonce = "nonce.fixture.long-running.terminal.01";
    const fixtureBuildSha = sha256File(join(root, files.buildCardExample));
    const preStartDecision = {
      schemaVersion: release.schemas.agentActionRevocation,
      releaseRef,
      revocationId: "revocation.fixture.pre-start.01",
      authorityId: "authority.fixture.long-running.01",
      decisionPhase: "pre_start",
      executionNonce: fixtureNonce,
      buildCardRef: files.buildCardExample,
      buildCardSha256: fixtureBuildSha,
      artifactId: fixtureCard.artifact.id,
      actionId: "inspect-claim",
      actorId: "example-reader",
      status: "not_revoked",
      checkedAt: "2026-08-31T00:59:59+07:00",
      revokedAt: null,
      reason: null,
      decisionBy: "Fixture operator",
      evidenceRef: "fixture:revocation:pre-start:01"
    };
    const preStartRef = "revocations/pre-start.01.json";
    const preStartAttestationRef = "revocations/pre-start.01.attestation.json";
    writeFixtureJson(join(root, preStartRef), preStartDecision);
    const preStartAttestation = createSignedAttestation({
      purpose: "agent_revocation",
      subjectRef: preStartRef,
      subjectSha256: sha256File(join(root, preStartRef)),
      attestationId: "attestation.revocation.fixture.pre-start.01",
      issuedAt: preStartDecision.checkedAt
    }, signer);
    writeFixtureJson(join(root, preStartAttestationRef), preStartAttestation);

    const authority = structuredClone(agentActionAuthority);
    authority.schemaVersion = release.schemas.agentActionAuthority;
    authority.authorityId = preStartDecision.authorityId;
    authority.artifactId = fixtureCard.artifact.id;
    authority.inputSchemaSha256 = sha256File(join(root, files.agentActionInputExampleSchema));
    authority.validity = {
      notBefore: "2026-08-31T00:30:00+07:00",
      expiresAt: null,
      revocationRef: preStartRef,
      revocationSha256: sha256File(join(root, preStartRef)),
      revocationSchemaRef: release.schemaIds.agentActionRevocation,
      revocationAttestationRef: preStartAttestationRef,
      revocationAttestationSha256: sha256File(join(root, preStartAttestationRef))
    };
    authority.authorizedAt = authority.validity.notBefore;
    const authorityRef = "authorities/authority.fixture.01.json";
    const authorityAttestationRef = "authorities/authority.fixture.01.attestation.json";
    writeFixtureJson(join(root, authorityRef), authority);
    const authorityAttestation = createSignedAttestation({
      purpose: "agent_authority",
      subjectRef: authorityRef,
      subjectSha256: sha256File(join(root, authorityRef)),
      attestationId: "attestation.authority.fixture.01",
      issuedAt: "2026-08-31T00:59:59.500+07:00"
    }, signer);
    writeFixtureJson(join(root, authorityAttestationRef), authorityAttestation);

    const terminalDecision = {
      ...preStartDecision,
      revocationId: "revocation.fixture.terminal.01",
      decisionPhase: "terminal_boundary",
      checkedAt: "2026-08-31T10:00:01+07:00",
      evidenceRef: "fixture:revocation:terminal:01"
    };
    const terminalRef = "revocations/terminal.01.json";
    const terminalAttestationRef = "revocations/terminal.01.attestation.json";
    writeFixtureJson(join(root, terminalRef), terminalDecision);
    const terminalAttestation = createSignedAttestation({
      purpose: "agent_revocation",
      subjectRef: terminalRef,
      subjectSha256: sha256File(join(root, terminalRef)),
      attestationId: "attestation.revocation.fixture.terminal.01",
      issuedAt: terminalDecision.checkedAt
    }, signer);
    writeFixtureJson(join(root, terminalAttestationRef), terminalAttestation);

    const resultRef = files.claimRecordExample;
    const runtime = structuredClone(agentAction);
    runtime.schemaVersion = release.schemas.agentAction;
    runtime.definitionRef = files.agentActionDefinitionExample;
    runtime.definitionSha256 = sha256File(join(root, files.agentActionDefinitionExample));
    runtime.definitionSchemaRef = release.schemaIds.agentActionDefinition;
    runtime.scope.artifactId = fixtureCard.artifact.id;
    runtime.inputs.schemaSha256 = sha256File(join(root, files.agentActionInputExampleSchema));
    runtime.inputs.valueSha256 = sha256File(join(root, files.agentActionInputExample));
    runtime.permission.authorityRef = authorityRef;
    runtime.permission.authoritySha256 = sha256File(join(root, authorityRef));
    runtime.permission.authoritySchemaRef = release.schemaIds.agentActionAuthority;
    runtime.permission.authorityAttestationRef = authorityAttestationRef;
    runtime.permission.authorityAttestationSha256 = sha256File(join(root, authorityAttestationRef));
    runtime.execution = {
      executionId: "execution.fixture.long-running.01",
      executionNonce: fixtureNonce,
      buildCardRef: files.buildCardExample,
      buildCardSha256: fixtureBuildSha,
      terminalRevocationRef: terminalRef,
      terminalRevocationSha256: sha256File(join(root, terminalRef)),
      terminalRevocationSchemaRef: release.schemaIds.agentActionRevocation,
      terminalRevocationAttestationRef: terminalAttestationRef,
      terminalRevocationAttestationSha256: sha256File(join(root, terminalAttestationRef)),
      status: "succeeded",
      startedAt: "2026-08-31T01:00:00+07:00",
      effectAt: null,
      completedAt: "2026-08-31T10:00:00+07:00",
      resultSchemaRef: definition.resultSchemaRef,
      resultSchemaSha256: definition.resultSchemaSha256,
      receiptSchemaRef: definition.receiptSchemaRef,
      receiptSchemaSha256: definition.receiptSchemaSha256,
      resultRef,
      resultSha256: sha256File(join(root, resultRef)),
      errorBehavior: definition.errorBehavior,
      recoveryRef: null,
      receiptRef: "receipts/execution.fixture.01.json",
      receiptSha256: "0".repeat(64),
      receiptAttestationRef: "receipts/execution.fixture.01.attestation.json",
      receiptAttestationSha256: "0".repeat(64)
    };
    const terminalReceipt = {
      schemaVersion: release.schemas.agentActionReceipt,
      releaseRef,
      executionId: runtime.execution.executionId,
      executionNonce: runtime.execution.executionNonce,
      buildCardRef: runtime.execution.buildCardRef,
      buildCardSha256: runtime.execution.buildCardSha256,
      terminalRevocationRef: runtime.execution.terminalRevocationRef,
      terminalRevocationSha256: runtime.execution.terminalRevocationSha256,
      terminalRevocationSchemaRef: runtime.execution.terminalRevocationSchemaRef,
      terminalRevocationAttestationRef: runtime.execution.terminalRevocationAttestationRef,
      terminalRevocationAttestationSha256: runtime.execution.terminalRevocationAttestationSha256,
      artifactId: runtime.scope.artifactId,
      actionId: runtime.actionId,
      actor: runtime.scope.actor,
      operation: runtime.scope.allowedOperation,
      status: runtime.execution.status,
      startedAt: runtime.execution.startedAt,
      effectAt: runtime.execution.effectAt,
      completedAt: runtime.execution.completedAt,
      classification: runtime.inputs.classification,
      allowedAudience: "internal_operational",
      redactionState: "not_required",
      authorityRef: runtime.permission.authorityRef,
      authoritySha256: runtime.permission.authoritySha256,
      inputRef: runtime.inputs.valueRef,
      inputSha256: runtime.inputs.valueSha256,
      resultRef: runtime.execution.resultRef,
      resultSha256: runtime.execution.resultSha256,
      sideEffect: structuredClone(runtime.sideEffect),
      recoveryRef: null,
      recoverySha256: null,
      errorCode: null,
      audienceMessage: null,
      diagnosticsRef: null,
      diagnosticsSha256: null
    };
    writeFixtureJson(join(root, runtime.execution.receiptRef), terminalReceipt);
    runtime.execution.receiptSha256 = sha256File(join(root, runtime.execution.receiptRef));
    const receiptAttestation = createSignedAttestation({
      purpose: "agent_execution",
      subjectRef: runtime.execution.receiptRef,
      subjectSha256: runtime.execution.receiptSha256,
      attestationId: "attestation.execution.fixture.01",
      issuedAt: terminalDecision.checkedAt
    }, signer);
    writeFixtureJson(join(root, runtime.execution.receiptAttestationRef), receiptAttestation);
    runtime.execution.receiptAttestationSha256 = sha256File(join(root, runtime.execution.receiptAttestationRef));

    const runtimeSchema = documents.get(files.agentActionSchema);
    const integrationBaseline = [...validateSchema(runtimeSchema, runtime), ...agentActionCrossErrors(runtime, fixtureCard, root, [trustStore])];
    check(integrationBaseline.length === 0, `signed long-running terminal agent happy path failed${integrationBaseline.length ? `\n  ${integrationBaseline.join("\n  ")}` : ""}`);
    const reusedPreStartRuntime = structuredClone(runtime);
    reusedPreStartRuntime.execution.terminalRevocationRef = preStartRef;
    reusedPreStartRuntime.execution.terminalRevocationSha256 = sha256File(join(root, preStartRef));
    reusedPreStartRuntime.execution.terminalRevocationAttestationRef = preStartAttestationRef;
    reusedPreStartRuntime.execution.terminalRevocationAttestationSha256 = sha256File(join(root, preStartAttestationRef));
    expectRejected("signed-agent-terminal-cannot-reuse-pre-start-revocation", integrationBaseline, agentActionCrossErrors(reusedPreStartRuntime, fixtureCard, root, [trustStore]), /must be distinct from the pre-start decision|decision phase must be terminal_boundary/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

if (agentActionReceiptSchema) {
  const internalReceipt = {
    schemaVersion: "1.3", releaseRef, executionId: "execution.internal.01", executionNonce: "nonce.internal.execution.01", buildCardRef: files.buildCardExample, buildCardSha256: sha256File(join(packageDir, files.buildCardExample)),
    terminalRevocationRef: "revocations/terminal.internal.01.json", terminalRevocationSha256: "7".repeat(64), terminalRevocationSchemaRef: release.schemaIds.agentActionRevocation,
    terminalRevocationAttestationRef: "revocations/terminal.internal.01.attestation.json", terminalRevocationAttestationSha256: "8".repeat(64), artifactId: build.artifact.id,
    actionId: build.actions[0].id, actor: "example-user", operation: "read", status: "cancelled",
    startedAt: "2026-09-01T01:00:00+07:00", effectAt: null, completedAt: "2026-09-01T01:00:01+07:00",
    classification: "public", allowedAudience: "internal_operational", redactionState: "not_required",
    authorityRef: files.agentActionAuthorityExample, authoritySha256: sha256File(join(packageDir, files.agentActionAuthorityExample)),
    inputRef: files.agentActionInputExample, inputSha256: sha256File(join(packageDir, files.agentActionInputExample)),
    resultRef: null, resultSha256: null,
    sideEffect: { class: "none", external: false, cost: "none", summary: "No external state changed.", reversible: true },
    recoveryRef: null, recoverySha256: null, errorCode: null, audienceMessage: "Action cancelled.", diagnosticsRef: null, diagnosticsSha256: null
  };
  const baseline = validateSchema(agentActionReceiptSchema, internalReceipt);
  let mutated = structuredClone(internalReceipt); mutated.allowedAudience = "public";
  expectRejected("full-agent-receipt-cannot-be-public", baseline, validateSchema(agentActionReceiptSchema, mutated), /allowedAudience.*is not in enum/);
  mutated = structuredClone(internalReceipt); mutated.audienceMessage = null;
  expectRejected("cancelled-agent-receipt-needs-audience-message", baseline, validateSchema(agentActionReceiptSchema, mutated), /audienceMessage.*must be string/);

  const consequentialReceipt = structuredClone(internalReceipt);
  consequentialReceipt.sideEffect = { class: "reversible", external: true, cost: "none", summary: "Example effect.", reversible: true };
  consequentialReceipt.effectAt = "2026-09-01T01:00:00.500+07:00";
  consequentialReceipt.recoveryRef = "recovery.json";
  consequentialReceipt.recoverySha256 = "1".repeat(64);
  const consequentialBaseline = validateSchema(agentActionReceiptSchema, consequentialReceipt);
  mutated = structuredClone(consequentialReceipt); mutated.recoveryRef = null; mutated.recoverySha256 = null;
  expectRejected("cancelled-effect-receipt-needs-recovery", consequentialBaseline, validateSchema(agentActionReceiptSchema, mutated), /recoveryRef.*must be string|recoverySha256.*must be string/);
}

{
  const runtime = {
    scope: { allowedOperation: "inspect" },
    sideEffect: { class: "none", external: false, cost: "none", summary: "Read only.", reversible: true },
    execution: {
      executionId: "execution.test.01", executionNonce: "nonce.test.execution.01", buildCardRef: files.buildCardExample, buildCardSha256: sha256File(join(packageDir, files.buildCardExample)), status: "succeeded", startedAt: "2026-09-01T01:00:00+07:00", effectAt: null, completedAt: "2026-09-01T01:00:01+07:00",
      terminalRevocationRef: "revocations/terminal.test.01.json", terminalRevocationSha256: "7".repeat(64), terminalRevocationSchemaRef: release.schemaIds.agentActionRevocation,
      terminalRevocationAttestationRef: "revocations/terminal.test.01.attestation.json", terminalRevocationAttestationSha256: "8".repeat(64),
      resultRef: "result.json", resultSha256: "1".repeat(64), recoveryRef: null
    }
  };
  const receipt = {
    executionId: runtime.execution.executionId, executionNonce: runtime.execution.executionNonce, buildCardRef: runtime.execution.buildCardRef, buildCardSha256: runtime.execution.buildCardSha256,
    terminalRevocationRef: runtime.execution.terminalRevocationRef, terminalRevocationSha256: runtime.execution.terminalRevocationSha256, terminalRevocationSchemaRef: runtime.execution.terminalRevocationSchemaRef,
    terminalRevocationAttestationRef: runtime.execution.terminalRevocationAttestationRef, terminalRevocationAttestationSha256: runtime.execution.terminalRevocationAttestationSha256,
    operation: "inspect", status: "succeeded", startedAt: runtime.execution.startedAt, effectAt: runtime.execution.effectAt, completedAt: runtime.execution.completedAt,
    sideEffect: structuredClone(runtime.sideEffect), resultRef: "result.json", resultSha256: "1".repeat(64), recoveryRef: null, recoverySha256: null
  };
  const baseline = agentReceiptRuntimeErrors(receipt, runtime);
  let mutated = structuredClone(receipt); mutated.operation = "submit";
  expectRejected("agent-receipt-operation-drift", baseline, agentReceiptRuntimeErrors(mutated, runtime), /receipt operation drifts from runtime/);
  mutated = structuredClone(receipt); mutated.executionId = "execution.different.01";
  expectRejected("agent-receipt-execution-identity-drift", baseline, agentReceiptRuntimeErrors(mutated, runtime), /receipt execution identity drifts from runtime/);
  mutated = structuredClone(receipt); mutated.executionNonce = "nonce.different.execution.01";
  expectRejected("agent-receipt-execution-nonce-replay", baseline, agentReceiptRuntimeErrors(mutated, runtime), /execution nonce drifts/);
  mutated = structuredClone(receipt); mutated.buildCardSha256 = "4".repeat(64);
  expectRejected("agent-receipt-build-card-replay", baseline, agentReceiptRuntimeErrors(mutated, runtime), /Build Card binding drifts/);
  mutated = structuredClone(receipt); mutated.terminalRevocationSha256 = "9".repeat(64);
  expectRejected("agent-receipt-terminal-revocation-replay", baseline, agentReceiptRuntimeErrors(mutated, runtime), /terminal revocation binding drifts/);
  mutated = structuredClone(receipt); mutated.status = "failed";
  expectRejected("agent-receipt-status-drift", baseline, agentReceiptRuntimeErrors(mutated, runtime), /receipt status drifts from runtime/);
  mutated = structuredClone(receipt); mutated.sideEffect.external = true;
  expectRejected("agent-receipt-side-effect-drift", baseline, agentReceiptRuntimeErrors(mutated, runtime), /receipt side effect drifts from runtime/);
  mutated = structuredClone(receipt); mutated.resultSha256 = "2".repeat(64);
  expectRejected("agent-receipt-result-binding-drift", baseline, agentReceiptRuntimeErrors(mutated, runtime), /receipt result binding drifts from runtime/);
  mutated = structuredClone(receipt); mutated.recoveryRef = "recovery.json"; mutated.recoverySha256 = "3".repeat(64);
  expectRejected("agent-receipt-recovery-binding-drift", baseline, agentReceiptRuntimeErrors(mutated, runtime), /receipt recovery binding drifts from runtime/);
}

const safeResidueBaseline = workflowResidueHits({ note: "Audience-ready statement." });
for (const [label, value, expected] of [
  ["residue-source-path-key", { sourcePath: "src/private/review.json" }, /\/sourcePath$/],
  ["residue-review-state", { reviewState: "complete" }, /\/reviewState$/],
  ["residue-internal-draft", { note: "internal draft release" }, /^\$\/note$/],
  ["residue-needs-review", { note: "needs review by owner" }, /^\$\/note$/],
  ["residue-not-verified", { note: "not verified before release" }, /^\$\/note$/],
  ["residue-home-path", { note: "/home/worker/private.json" }, /^\$\/note$/],
  ["residue-tmp-path", { note: "/tmp/render.log" }, /^\$\/note$/],
  ["residue-var-path", { note: "/var/log/validator.log" }, /^\$\/note$/],
  ["residue-thai-workflow", { note: "อยู่ระหว่างการตรวจสอบภายใน" }, /^\$\/note$/]
]) expectRejected(label, safeResidueBaseline, workflowResidueHits(value), expected);
check(workflowResidueHits({ releaseRef }, "$", { allowedFieldClasses: ["release_identifiers"] }).length === 0, "authorized release identifier is incorrectly rejected");
check(workflowResidueHits({ approvedBy: "Landometer owner" }, "$", { allowedFieldClasses: ["approval_facts"] }).length === 0, "authorized approval fact is incorrectly rejected");
expectRejected("authority-does-not-allow-unresolved", workflowResidueHits({ note: "Audience-ready statement." }, "$", { allowedFieldClasses: ["release_identifiers", "schema_examples", "provenance_facts", "approval_facts"] }), workflowResidueHits({ note: "internal draft release" }, "$", { allowedFieldClasses: ["release_identifiers", "schema_examples", "provenance_facts", "approval_facts"] }), /^\$\/note$/);
check(workflowResidueHits({ label: "Draft report", outcome: "The provider is blocked; try the direct source." }).length === 0, "legitimate draft or blocked user-state copy is incorrectly rejected as workflow residue");

if (crawlerPurposePolicy) {
  const baseline = validateSchema(crawlerPurposePolicySchema, crawlerPurposePolicy);
  const mutated = structuredClone(crawlerPurposePolicy); mutated.decisions.find((entry) => entry.purpose === "agent_action").decision = "allow";
  expectRejected("crawler-policy-cannot-authorize-agent-action", baseline, validateSchema(crawlerPurposePolicySchema, mutated), /contains match count 0/);
}

if (structuredDataProjection) {
  const evaluateStructured = (value) => [...validateSchema(structuredDataProjectionSchema, value), ...structuredEntityIdentityErrors(value, build)];
  const baseline = evaluateStructured(structuredDataProjection);
  let mutated = structuredClone(structuredDataProjection);
  mutated.entities.find((entity) => entity.role === "page").types = ["WebPage", "SoftwareApplication"];
  expectRejected("structured-page-type-must-match-page-kind", baseline, evaluateStructured(mutated), /types do not match pageKind article/);
  mutated = structuredClone(structuredDataProjection);
  mutated.entities[0].url = "https://example.invalid/unbound";
  expectRejected("structured-entity-url-must-match-canonical", baseline, evaluateStructured(mutated), /URL must equal the projection canonical URL/);
  mutated = structuredClone(structuredDataProjection);
  mutated.entities.find((entity) => entity.role === "subject").entityId = "unapproved.entity";
  expectRejected("structured-subject-requires-approved-entity-binding", baseline, evaluateStructured(mutated), /is not bound to the approved claim entity/);
  mutated = structuredClone(structuredDataProjection);
  mutated.entities.find((entity) => entity.role === "subject").types = ["SoftwareApplication"];
  expectRejected("structured-subject-type-must-derive-from-claim-entity", baseline, evaluateStructured(mutated), /types overstate approved claim entity type protected_brand_line/);
  mutated = structuredClone(structuredDataProjection);
  mutated.entities.find((entity) => entity.role === "subject").nameByLocale.en = "Different entity";
  expectRejected("structured-subject-name-must-derive-from-claim-entity", baseline, evaluateStructured(mutated), /names drift from approved claim entity/);
  const residueBaseline = structuredAudienceResidueErrors(structuredDataProjection);
  mutated = structuredClone(structuredDataProjection);
  mutated.entities.find((entity) => entity.role === "subject").nameByLocale.en = "TODO internal review /tmp/private.json";
  expectRejected("structured-subject-workflow-residue", residueBaseline, structuredAudienceResidueErrors(mutated), /nameByLocale\/en$/);
  mutated = structuredClone(structuredDataProjection);
  mutated.entities[0].types = ["BestInClassAwardWinner"];
  expectRejected("structured-entity-type-must-be-governed", baseline, evaluateStructured(mutated), /types\/0.*is not in enum/);
}

if (artifactManifest && tokens) {
  const baseline = rawColorDeliveryErrors(artifactManifest);
  const mutated = structuredClone(artifactManifest);
  mutated.delivery.files = [{ path: "renamed-audience-colors.json", sha256: tokens.projection.canonicalColorRegistry.tokensSha256, mediaType: "application/json" }];
  expectRejected("raw-color-registry-cannot-enter-delivery", baseline, rawColorDeliveryErrors(mutated), /emits forbidden raw color-registry bytes/);
}

if (tokens) {
  const css = textFile(files.colorRegistryProductionCss);
  const baseline = colorProjectionErrors(tokens, css);
  let mutatedCss = css.replace(/\n  --[^;]+;/, "");
  expectRejected("omitted-production-color", baseline, colorProjectionErrors(tokens, mutatedCss), /production color declaration omitted/);
  mutatedCss = css.replace(/(\n  --[^:]+:\s*)#[0-9a-f]{6}/i, "$1#000000");
  expectRejected("changed-production-color", baseline, colorProjectionErrors(tokens, mutatedCss), /production color value drift/);
  mutatedCss = `${css}\n:root { --ldm-meta-release: v0.9.4; }\n`;
  expectRejected("color-lifecycle-residue", baseline, colorProjectionErrors(tokens, mutatedCss), /production color CSS contains lifecycle/);
}

if (catalog) {
  const brandErrors = (value) => sameValue(value.protectedBrandLines, protectedBrandLines) ? [] : ["protected brand line drift"];
  const mutated = structuredClone(catalog); mutated.protectedBrandLines.promise = "Measure things.";
  expectRejected("protected-brand-line-drift", brandErrors(catalog), brandErrors(mutated), /protected brand line drift/);
}

if (build && artifactManifest && buildSchema && documents.get(files.artifactManifestSchema)) {
  const request = { bundle: packageDir, buildCard: files.buildCardExample, artifactManifest: files.artifactManifestExample, errors: [] };
  const baseline = validateDownstreamBundle(request).errors;
  const root = mkdtempSync(join(tmpdir(), "lds-v094-downstream-"));
  try {
    for (const filename of declaredNames) if (existsSync(join(packageDir, filename))) copyFileSync(join(packageDir, filename), join(root, filename));
    const mutated = structuredClone(artifactManifest);
    mutated.artifact.buildCardSha256 = "0".repeat(64);
    writeFixtureJson(join(root, files.artifactManifestExample), mutated);
    const mutation = validateDownstreamBundle({ ...request, bundle: root }).errors;
    expectRejected("downstream-cli-rejects-build-card-hash-drift", baseline, mutation, /buildCardSha256 does not match the supplied Build Card bytes/);
    const escaped = validateDownstreamBundle({ ...request, buildCard: `..${sep}${files.buildCardExample}` }).errors;
    expectRejected("downstream-cli-rejects-path-escape", baseline, escaped, /--build-card does not resolve to a regular file inside the bundle/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
}

if (checksumName && existsSync(join(packageDir, checksumName))) {
  const checksumLines = textFile(checksumName).split(/\r?\n/).filter(Boolean);
  const entries = new Map();
  for (const line of checksumLines) {
    const match = /^([a-f0-9]{64})  ([^/]+)$/.exec(line);
    check(Boolean(match), `${checksumName}: malformed checksum line ${line}`);
    if (!match) continue;
    check(match[2] === basename(match[2]) && !match[2].includes(".."), `${checksumName}: unsafe checksum path ${match[2]}`);
    check(!entries.has(match[2]), `${checksumName}: duplicate checksum entry ${match[2]}`);
    entries.set(match[2], match[1]);
  }
  const expectedChecksumFiles = declaredNames.filter((name) => ![checksumName, files.packageRootAttestation].includes(name)).sort();
  check(sameValue([...entries.keys()].sort(), expectedChecksumFiles), `${checksumName}: coverage must exactly match all authoritative package files; only itself and its detached package-root signature are excluded as non-circular mechanics`);
  for (const filename of expectedChecksumFiles) {
    if (!existsSync(join(packageDir, filename))) continue;
    check(entries.get(filename) === sha256File(join(packageDir, filename)), `${checksumName}: hash mismatch for ${filename}`);
  }
}

if (cliRequest.mode === "help") {
  console.log(cliUsage);
} else if (downstreamMode) {
  const result = validateDownstreamBundle(cliRequest);
  const downstreamErrors = gatedDownstreamErrors(failures, result.errors);
  if (downstreamErrors.length) {
    console.error(`Downstream validation failed (${downstreamErrors.length} errors):`);
    downstreamErrors.forEach((message) => console.error(`- ${message}`));
    if (cliRequest.errors.length) console.error(cliUsage);
    process.exitCode = 1;
  } else {
    console.log(`Downstream validation passed: Build Card and Artifact Manifest${cliRequest.agentAction !== undefined ? ", plus Agent Action runtime" : ""}.`);
  }
} else {
  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.forEach((message) => console.log(`- ${message}`));
  }
  if (failures.length) {
    console.error(`Validation failed (${failures.length}/${checks} checks):`);
    failures.forEach((message) => console.error(`- ${message}`));
    process.exitCode = 1;
  } else {
    console.log(`Validation passed: ${checks} checks; ${ruleIds.length} rules, ${formatPacks?.packs?.length ?? 0} format packs, ${migration?.entries?.length ?? 0} migrations, ${schemaPairs.length} schema fixtures, ${adversarialChecks} adversarial mutations, ${packageContractChecks094} checks of the 0.9.4 package contracts.`);
  }
}
