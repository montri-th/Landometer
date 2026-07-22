import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const downloads = resolve(here, "../deployment/assets/downloads");
const hash = file => createHash("sha256").update(readFileSync(resolve(downloads, file))).digest("hex");
const record = file => ({ path: `assets/downloads/${file}`, bytes: statSync(resolve(downloads, file)).size, sha256: hash(file) });

const skillZip = "apply-landometer-design-system-v0.8.6-public.1.zip";
const sidecar = `${skillZip}.sha256`;
writeFileSync(resolve(downloads, sidecar), `${hash(skillZip)}  ${skillZip}\n`);

const files = [
  "landometer-design-system-v0.8.6-public.md",
  skillZip,
  sidecar,
  "landometer-ds-v0.8.6-starter.zip",
  "build-card-template.yaml",
  "landometer-tokens.css",
  "landometer-tokens.json",
  "landometer-tokens.ts",
  "component-recipes.md",
  "voice-recipes.md",
  "reference-fixtures.json",
  "landometer-public-release-v0.8.6-changelog.md",
  "README.md"
];

const manifest = {
  release: {
    id: "landometer-design-system-v0.8.6-public.1",
    designSystemVersion: "0.8.6",
    publicPackageRevision: 1,
    generated: "2026-07-22",
    status: "working-public-implementation-projection",
    machineSchemaConformance: "pending",
    normativeSourceSha256: "d91fa8b84f557221ae9c507f2be0655765d7ae225ae5e70b0857c1e27bef3604",
    publicSpecificationSha256: hash("landometer-design-system-v0.8.6-public.md")
  },
  boundary: {
    included: ["shared brand and experience rules", "visual and semantic tokens", "components, states, and accessibility", "product-neutral evidence, map, dataviz, sharing, privacy, and AI boundaries", "public QA", "version-pinned explicit-invocation AI skill"],
    excluded: ["internal normative master", "internal product profiles and business assumptions", "role, permission, exception, telemetry, and release ledgers", "private evidence paths", "logos, photography, font binaries, datasets, credentials, connectors, and deployment workflows"],
    productRule: "Apply product-specific truth only from a current approved Product Brief or Product Statement supplied for that product.",
    comparisonRule: "Compare products or cities only under the same schema and release, or state the incompatibility.",
    rights: "No standalone open-source or documentation license has been supplied. Downloading does not grant rights to trademarks, logos, photographs, fonts, datasets, product material, or third-party assets."
  },
  skill: {
    name: "apply-landometer-design-system-v0-8-6",
    invocation: "explicit_only",
    networkOrConnectors: false,
    publishingOrDeployment: false,
    externalEffects: false,
    conformanceClaim: "prohibited_while_machine_schema_preflight_pending"
  },
  files: files.map(record)
};

writeFileSync(resolve(downloads, "landometer-public-release-v0.8.6.json"), `${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(resolve(downloads, "SHA256SUMS.txt"), `${files.map(file => `${hash(file)}  ${file}`).join("\n")}\n`);

console.log(JSON.stringify({ release: manifest.release.id, files: files.length, publicSpecSha256: manifest.release.publicSpecificationSha256, skillZipSha256: hash(skillZip) }, null, 2));
