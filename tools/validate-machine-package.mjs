#!/usr/bin/env node
// Package validator for the v0.9.0 public-safe machine specification package.
// Package-level validation means the specification, schemas, mappings, fixtures, approvals,
// and hashes are internally consistent — it never certifies a downstream artifact's
// production QA, and a downstream artifact still begins at machineValidation: pending.
// Writes machine/v0.9.0/validation-report.json; exits non-zero if any check fails.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Dependency-free JSON-Schema subset validator (type/properties/required/const/enum/pattern/
// items/minimum/minLength/additionalProperties) so this gate runs on bare CI runners. The
// schema documents themselves are standard draft 2020-12; consumers may run a full validator.
function subsetValidate(schema, data, pathStr = "$", errors = []) {
  if (schema === true || schema == null) return errors;
  if (schema.const !== undefined && JSON.stringify(data) !== JSON.stringify(schema.const))
    errors.push(`${pathStr}: expected const ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some(v => JSON.stringify(v) === JSON.stringify(data)))
    errors.push(`${pathStr}: not in enum`);
  const t = schema.type;
  if (t) {
    const actual = Array.isArray(data) ? "array" : data === null ? "null" : typeof data;
    const want = Array.isArray(t) ? t : [t];
    const okType = want.includes(actual) || (actual === "number" && want.includes("integer") && Number.isInteger(data));
    if (!okType) { errors.push(`${pathStr}: type ${actual}, want ${want.join("|")}`); return errors; }
  }
  if (typeof data === "string") {
    if (schema.pattern && !new RegExp(schema.pattern).test(data)) errors.push(`${pathStr}: pattern ${schema.pattern}`);
    if (schema.minLength != null && data.length < schema.minLength) errors.push(`${pathStr}: minLength`);
  }
  if (typeof data === "number" && schema.minimum != null && data < schema.minimum)
    errors.push(`${pathStr}: minimum ${schema.minimum}`);
  if (Array.isArray(data) && schema.items)
    data.forEach((v, i) => subsetValidate(schema.items, v, `${pathStr}[${i}]`, errors));
  if (data && typeof data === "object" && !Array.isArray(data)) {
    for (const r of schema.required ?? [])
      if (!(r in data)) errors.push(`${pathStr}: missing required ${r}`);
    for (const [k, sub] of Object.entries(schema.properties ?? {}))
      if (k in data) subsetValidate(sub, data[k], `${pathStr}.${k}`, errors);
    if (schema.additionalProperties === false)
      for (const k of Object.keys(data))
        if (!(k in (schema.properties ?? {}))) errors.push(`${pathStr}: unexpected property ${k}`);
  }
  return errors;
}

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(toolDir, "..");
const DEP = path.join(ROOT, "deployment");
const PKG = path.join(DEP, "machine", "v0.9.0");

const sha256 = buf => createHash("sha256").update(buf).digest("hex");
const readB = p => readFileSync(p);
const readT = p => readFileSync(p, "utf8");
const readJ = p => JSON.parse(readT(p));

const checks = [];
let failures = 0;
function check(ok, name, detail) {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  if (!ok) { failures++; console.error(`FAIL ${name}${detail ? " — " + detail : ""}`); }
}

// ---- 1. layout completeness (file listing from the authoring master's packaging section)
const LAYOUT = [
  "core.md", "build-card.schema.json", "manifest.schema.json", "surface-recipes.json",
  "connector.schema.json", "tokens.json", "tokens.css", "tokens.ts", "color-delivery.json",
  "font-assets.manifest.json", "media-assets.manifest.json", "identity-approvals.manifest.json",
  "components.json", "page-kinds.json", "voice-recipes.md", "thai-voice-fixtures-v0.8.7.json",
  "adapters/README.md", "preflight.yml", "fixtures.json",
  "build-kit/lds-tokens.css", "build-kit/lds-base.css", "build-kit/skeleton.html",
  "self-check.map.json", "growth.schema.json", "web-discovery.schema.json",
  "social-previews.schema.json",
  "v0.8.9-to-v0.9.0-rule-ledger.json", "v0.8.7-to-v0.8.9-rule-ledger.json",
  "v0.8.6-to-v0.8.7-rule-ledger.json", "v0.8.5-to-v0.8.6-rule-ledger.json",
  "package.json", "SHA256SUMS.txt",
];
for (const f of LAYOUT) check(existsSync(path.join(PKG, f)), `layout:${f}`);
const profileCount = readJ(path.join(PKG, "package.json")).files.filter(f => f.path.startsWith("profiles/")).length;
const packCount = readJ(path.join(PKG, "package.json")).files.filter(f => f.path.startsWith("packs/")).length;
check(profileCount === 11, "layout:profiles/*.json", `expected 11 profiles, found ${profileCount}`);
check(packCount >= 19, "layout:packs/*.json", `expected >=19 packs, found ${packCount}`);

// ---- 2. package manifest: identity + per-file hashes + SHA256SUMS
const pkg = readJ(path.join(PKG, "package.json"));
const registry = readJ(path.join(DEP, "assets/data/color-delivery.v0.9.0.json"));
check(pkg.dsVersion === "0.9.0", "package:ds-version");
check(pkg.packageRevision === "v0.9.0-mp1", "package:revision");
check(pkg.colorSetId === registry.meta.id, "package:color-set", `${pkg.colorSetId} vs ${registry.meta.id}`);
check(pkg.artifactBuildId === registry.meta.currentArtifactBuild.id, "package:artifact-build");
check(pkg.generatedAtAuthoringRevision === registry.meta.authoringRevision, "package:authoring-revision");
for (const f of pkg.files) {
  const p = path.join(PKG, f.path);
  const ok = existsSync(p) && readB(p).length === f.bytes && sha256(readB(p)) === f.sha256;
  check(ok, `package:file-hash:${f.path}`);
}
const sums = readT(path.join(PKG, "SHA256SUMS.txt")).trim().split("\n");
check(sums.length === pkg.files.length + 1, "package:sums-count");

// ---- 3. source fingerprint (true sources only)
for (const s of pkg.sourceFingerprint) {
  const p = path.join(DEP, s.path);
  const ok = existsSync(p) && readB(p).length === s.bytes && sha256(readB(p)) === s.sha256;
  check(ok, `fingerprint:${s.path}`);
}

// ---- 4. kit byte parity: package copies == master E-blocks == preflight hashes
const master = readT(path.join(DEP, "assets/downloads/landometer-design-system-v0.9.0.md"));
function extractKit(heading) {
  const i = master.indexOf(heading);
  const openF = master.indexOf("```", i);
  const openNl = master.indexOf("\n", openF) + 1;
  const closeF = master.indexOf("\n```", openNl);
  return master.slice(openNl, closeF + 1);
}
const preflight = readT(path.join(PKG, "preflight.yml"));
for (const [file, heading] of [
  ["lds-tokens.css", "## E1. `lds-tokens.css`"],
  ["lds-base.css", "## E2. `lds-base.css`"],
  ["skeleton.html", "## E3. `skeleton.html`"],
]) {
  const pkgBytes = readT(path.join(PKG, "build-kit", file));
  const masterBytes = extractKit(heading);
  const h = sha256(Buffer.from(masterBytes));
  check(pkgBytes === masterBytes, `kit:master-parity:${file}`);
  check(preflight.includes(`${file}: ${h}`), `kit:preflight-hash:${file}`);
}

// ---- 5. schemas compile; instances validate
const schemas = {};
for (const name of ["build-card.schema.json", "manifest.schema.json", "connector.schema.json",
                    "growth.schema.json", "web-discovery.schema.json", "social-previews.schema.json"]) {
  try {
    const doc = readJ(path.join(PKG, name));
    check(doc.$schema === "https://json-schema.org/draft/2020-12/schema", `schema:draft:${name}`);
    schemas[name] = data => subsetValidate(doc, data);
  } catch (e) { check(false, `schema:parse:${name}`, e.message); }
}
const manifest = readJ(path.join(DEP, "site-manifest.v0.9.0.json"));
{
  const errs = schemas["manifest.schema.json"](manifest);
  check(errs.length === 0, "instance:site-manifest", errs.slice(0, 3).join(" | "));
}
{
  const errs = schemas["connector.schema.json"]({ connectors: manifest.composition?.connectors ?? [] });
  check(errs.length === 0, "instance:connectors", errs.slice(0, 3).join(" | "));
}
// Build Card is YAML; convert via python3 (present locally and on CI runners).
try {
  const bcJson = execFileSync("python3", ["-c",
    "import json,sys,yaml; print(json.dumps(yaml.safe_load(open(sys.argv[1])), default=str))",
    path.join(DEP, "build-card.v0.9.0.yml")], { encoding: "utf8" });
  const bc = JSON.parse(bcJson);
  const errs = schemas["build-card.schema.json"](bc);
  check(errs.length === 0, "instance:build-card", errs.slice(0, 3).join(" | "));
} catch (e) { check(false, "instance:build-card", String(e).slice(0, 200)); }

// ---- 6. self-check map completeness vs the master ledger
const scMap = readJ(path.join(PKG, "self-check.map.json"));
const masterSc = [...master.matchAll(/^\| (SC-\d{2}) \| /gm)].map(m => m[1]);
check(scMap.items.length === 23, "selfcheck:23-items", String(scMap.items.length));
check(new Set(masterSc).size === scMap.items.length, "selfcheck:matches-master-ledger",
      `master ${new Set(masterSc).size} vs map ${scMap.items.length}`);

// ---- 7. migration ledger completeness vs the local v0.8.9 master
const v089 = readT(path.join(DEP, "assets/downloads/landometer-design-system-v0.8.9.md"));
const idsOf = t => new Set([...t.matchAll(/\[([A-Z][A-Z-]+-\d{2}[A-Z]?)\]/g)].map(m => m[1])
  .concat([...t.matchAll(/\bCORE-\d{2}\b/g)].map(m => m[0])));
const ledger = readJ(path.join(PKG, "v0.8.9-to-v0.9.0-rule-ledger.json"));
check(ledger.source.readSha256 === sha256(readB(path.join(DEP, "assets/downloads/landometer-design-system-v0.8.9.md"))),
      "ledger:source-hash");
const fromIds = new Set(ledger.rules.map(r => r.fromRule.replace(/[\[\]]/g, "")));
const missing = [...idsOf(v089)].filter(id => !fromIds.has(id));
check(missing.length === 0, "ledger:every-v089-rule-mapped", missing.slice(0, 5).join(","));
check(ledger.rules.length === ledger.ruleCount, "ledger:count-consistent");

// ---- 8. preflight enforcement: retired values absent from package token sources
const retired = [...preflight.matchAll(/^\s+- "(#[0-9A-F]{6})"/gm)].map(m => m[1]);
check(retired.length === 10, "preflight:ten-retired-values", String(retired.length));
const tokenText = readT(path.join(PKG, "tokens.json")) + readT(path.join(PKG, "tokens.css")) +
                  readT(path.join(PKG, "build-kit/lds-tokens.css"));
const leaked = retired.filter(v => tokenText.toUpperCase().includes(v));
check(leaked.length === 0, "preflight:retired-values-absent-from-tokens", leaked.join(","));
check(preflight.includes("hueDeg: [285, 345]") && preflight.includes("hueDeg: [45, 110]"),
      "preflight:both-banned-windows-encoded");
check(preflight.includes(`artifactBuildId: ${registry.meta.currentArtifactBuild.id}`), "preflight:build-id-current");

// ---- 9. tokens envelope provenance
const tokensPkg = readJ(path.join(PKG, "tokens.json"));
check(tokensPkg.meta.tokenSchemaVersion === 6, "tokens:schema-6");
check(tokensPkg.meta.provenance.sha256 === sha256(readB(path.join(DEP, "assets/data/tokens.json"))),
      "tokens:provenance-hash");
check(JSON.stringify(tokensPkg.values) === JSON.stringify(readJ(path.join(DEP, "assets/data/tokens.json"))),
      "tokens:values-match-source");

// ---- 10. Thai display leading stress fixture (approval condition for sign-off)
const thaiPath = path.join(DEP, "qa/v0.9.0-thai-leading.json");
check(existsSync(thaiPath), "thai-leading:evidence-present");
if (existsSync(thaiPath)) {
  const thai = readJ(thaiPath);
  check(thai.totals.cases >= 24, "thai-leading:case-coverage", String(thai.totals.cases));
  check(thai.totals.hardFailures === 0, "thai-leading:no-hard-failures", String(thai.totals.hardFailures));
  check(Array.isArray(thai.results) && thai.results.some(r => r.kind === "cross-pair"),
        "thai-leading:cross-pair-stress-present");
}

// ---- 11. boundary records stay honest
for (const f of ["v0.8.7-to-v0.8.9-rule-ledger.json", "v0.8.6-to-v0.8.7-rule-ledger.json",
                 "v0.8.5-to-v0.8.6-rule-ledger.json", "thai-voice-fixtures-v0.8.7.json"]) {
  check(readJ(path.join(PKG, f)).status === "not_regenerated_source_external", `boundary:${f}`);
}

// ---- report
const report = {
  schemaVersion: "1.0",
  packageRevision: pkg.packageRevision,
  dsVersion: pkg.dsVersion,
  colorSetId: pkg.colorSetId,
  artifactBuildId: pkg.artifactBuildId,
  validator: "tools/validate-machine-package.mjs",
  totals: { checks: checks.length, failures },
  result: failures === 0 ? "package_internally_consistent" : "failed",
  boundary: "Package-level validation means the specification, schemas, mappings, fixtures, "
            + "approvals, and hashes are internally consistent. It never certifies a downstream "
            + "artifact; artifacts begin at machineValidation: pending and earn passed only from "
            + "their own applicable generated preflight and manual evidence.",
  openItems: pkg.openItems,
  ownerFindingsCarried: "qa/v0.9.0-thai-leading.json#ownerFindings (cross-pair ink overlaps at leading 1.16)",
  approvalRef: "normative-patches/landometer-design-system-v0.9.0-machine-package.approval.yml",
  checks,
};
writeFileSync(path.join(PKG, "validation-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(`machine package validation ${report.result}: ${checks.length} checks, ${failures} failures`);
if (failures) process.exitCode = 1;
