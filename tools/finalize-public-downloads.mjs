import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const project = resolve(here, "..");
const downloads = resolve(project, "deployment/assets/downloads");
const skillName = "apply-landometer-design-system-v0-8-6";
const skillRoot = resolve(project, "skill", skillName);
const releaseDate = "2026-07-23";
const publicPackageRevision = 2;
const releaseId = `landometer-design-system-v0.8.6-public.${publicPackageRevision}`;
const skillZip = `apply-landometer-design-system-v0.8.6-public.${publicPackageRevision}.zip`;
const starterZip = "landometer-ds-v0.8.6-starter.zip";
const releaseManifest = "landometer-public-release-v0.8.6.json";
const checksumFile = "SHA256SUMS.txt";
const fixedArchiveTime = new Date("2026-07-23T00:00:00Z");

const sha256 = value => createHash("sha256").update(value).digest("hex");
const hash = file => sha256(readFileSync(resolve(downloads, file)));
const record = file => ({
  path: `assets/downloads/${file}`,
  bytes: statSync(resolve(downloads, file)).size,
  sha256: hash(file)
});

const outerReadme = `# Landometer Design System v0.8.6 public downloads

**Release:** \`${releaseId}\`<br>
**Public package revision:** ${publicPackageRevision}<br>
**Generated:** 23 July 2026

This release has three separate layers:

1. **Implementation starter** — tokens, a public-safe Build Card, component and voice recipes, and synthetic fixtures.
2. **Public Specification** — shared Landometer implementation rules generated from the locked v0.8.6 source fingerprint. It is not the internal normative authority.
3. **Version-pinned AI skill** — explicit invocation only; no connectors, internal discovery, publishing, deployment, messaging, or external actions.

## Primary files

- [Public Specification](landometer-design-system-v0.8.6-public.md)
- [AI skill ZIP](${skillZip})
- [AI skill SHA-256 sidecar](${skillZip}.sha256)
- [Implementation starter ZIP](${starterZip})
- [Release manifest](${releaseManifest})
- [Complete checksums](${checksumFile})
- [Release notes and rights boundary](landometer-public-release-v0.8.6-changelog.md)
- [Inspectable AI skill source](https://github.com/montri-th/Landometer/tree/main/skill/${skillName})

## Starter files

- \`landometer-tokens.css|json|ts\` — canonical active token subset
- \`build-card-template.yaml\` — safe defaults: private, source-limited, non-indexable, assets unresolved
- \`component-recipes.md\` and \`voice-recipes.md\` — implementation guidance
- \`reference-fixtures.json\` — synthetic, local-only proof fixtures

## Integrity coverage

\`${releaseManifest}\` records every payload file and its SHA-256. \`${checksumFile}\` covers every payload file plus the release manifest. The checksum file intentionally excludes only itself to avoid self-reference.

The public files do not grant rights to trademarks, logos, photography, fonts, datasets, or product material. No standalone open-source/documentation license has been supplied. Generated Schema 6/preflight conformance remains pending; use does not certify production readiness.
`;

const starterReadme = `# Landometer Design System v0.8.6 implementation starter

**Release:** \`${releaseId}\`<br>
**Public package revision:** ${publicPackageRevision}

This archive contains exactly these eight files:

- \`README.md\`
- \`build-card-template.yaml\`
- \`component-recipes.md\`
- \`voice-recipes.md\`
- \`reference-fixtures.json\`
- \`landometer-tokens.css\`
- \`landometer-tokens.json\`
- \`landometer-tokens.ts\`

Start with \`build-card-template.yaml\`, then use the token files and only the recipes required by the selected profile. The fixtures are synthetic and local-only.

The Public Specification, AI skill, release manifest, and checksums are separate release files:

- Public Specification: https://montri-th.github.io/Landometer/assets/downloads/landometer-design-system-v0.8.6-public.md
- Release manifest: https://montri-th.github.io/Landometer/assets/downloads/${releaseManifest}
- Checksums: https://montri-th.github.io/Landometer/assets/downloads/${checksumFile}

This starter contains no image, logo, font binary, dataset, credential, connector, script, workflow, or deployment authority. Generated Schema 6/preflight conformance remains pending; this archive does not certify production readiness.
`;

const skillFiles = [
  "SKILL.md",
  "agents/openai.yaml",
  "assets/build-card-template.yaml",
  "assets/landometer-tokens.css",
  "assets/landometer-tokens.json",
  "assets/landometer-tokens.ts",
  "assets/reference-fixtures.json",
  "references/component-recipes.md",
  "references/landometer-design-system-v0.8.6-public.md",
  "references/release-lock.json",
  "references/voice-recipes.md"
].sort();

const lockFiles = skillFiles.filter(file => file !== "references/release-lock.json");
const releaseLock = {
  skillName,
  designSystemVersion: "0.8.6",
  publicPackageRevision,
  publicSpecStatus: "working-public-specification",
  machineSchemaConformance: "pending",
  normativeSourceSha256: "d91fa8b84f557221ae9c507f2be0655765d7ae225ae5e70b0857c1e27bef3604",
  files: Object.fromEntries(
    lockFiles.map(file => [file, sha256(readFileSync(resolve(skillRoot, file)))])
  )
};
writeFileSync(
  resolve(skillRoot, "references/release-lock.json"),
  `${JSON.stringify(releaseLock, null, 2)}\n`
);

const createArchive = ({ archiveName, rootName, sourceRoot, files, generatedFiles = {} }) => {
  const stage = mkdtempSync(join(tmpdir(), "landometer-release-"));
  const packageRoot = resolve(stage, rootName);
  const archivePath = resolve(downloads, archiveName);

  try {
    mkdirSync(packageRoot, { recursive: true });
    for (const file of files) {
      const target = resolve(packageRoot, file);
      mkdirSync(dirname(target), { recursive: true });
      if (Object.hasOwn(generatedFiles, file)) {
        writeFileSync(target, generatedFiles[file]);
      } else {
        copyFileSync(resolve(sourceRoot, file), target);
      }
      chmodSync(target, 0o644);
      utimesSync(target, fixedArchiveTime, fixedArchiveTime);
    }

    const directories = new Set([packageRoot]);
    for (const file of files) {
      let directory = dirname(resolve(packageRoot, file));
      while (directory.startsWith(packageRoot)) {
        directories.add(directory);
        if (directory === packageRoot) break;
        directory = dirname(directory);
      }
    }
    for (const directory of [...directories].sort().reverse()) {
      chmodSync(directory, 0o755);
      utimesSync(directory, fixedArchiveTime, fixedArchiveTime);
    }

    rmSync(archivePath, { force: true });
    execFileSync("zip", ["-X", "-q", "-r", archivePath, rootName], { cwd: stage });
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }
};

writeFileSync(resolve(downloads, "README.md"), outerReadme);

for (const obsolete of [
  "apply-landometer-design-system-v0.8.6-public.1.zip",
  "apply-landometer-design-system-v0.8.6-public.1.zip.sha256"
]) {
  rmSync(resolve(downloads, obsolete), { force: true });
}

createArchive({
  archiveName: skillZip,
  rootName: skillName,
  sourceRoot: skillRoot,
  files: skillFiles
});

const starterFiles = [
  "README.md",
  "build-card-template.yaml",
  "component-recipes.md",
  "landometer-tokens.css",
  "landometer-tokens.json",
  "landometer-tokens.ts",
  "reference-fixtures.json",
  "voice-recipes.md"
].sort();
createArchive({
  archiveName: starterZip,
  rootName: "landometer-ds-v0.8.6-starter",
  sourceRoot: downloads,
  files: starterFiles,
  generatedFiles: { "README.md": starterReadme }
});

const sidecar = `${skillZip}.sha256`;
writeFileSync(resolve(downloads, sidecar), `${hash(skillZip)}  ${skillZip}\n`);

const payloadFiles = [
  "landometer-design-system-v0.8.6-public.md",
  skillZip,
  sidecar,
  starterZip,
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
    id: releaseId,
    designSystemVersion: "0.8.6",
    publicPackageRevision,
    generated: releaseDate,
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
    name: skillName,
    invocation: "explicit_only",
    networkOrConnectors: false,
    publishingOrDeployment: false,
    externalEffects: false,
    conformanceClaim: "prohibited_while_machine_schema_preflight_pending"
  },
  integrity: {
    checksumFile: `assets/downloads/${checksumFile}`,
    checksumCoverage: "Every payload file plus this release manifest.",
    checksumExclusions: [`assets/downloads/${checksumFile}`],
    manifestCoverage: "Payload files only; the manifest and checksum file are excluded to avoid circular self-reference."
  },
  files: payloadFiles.map(record)
};

writeFileSync(resolve(downloads, releaseManifest), `${JSON.stringify(manifest, null, 2)}\n`);

const checksumFiles = [...payloadFiles, releaseManifest];
writeFileSync(
  resolve(downloads, checksumFile),
  `${checksumFiles.map(file => `${hash(file)}  ${file}`).join("\n")}\n`
);

console.log(JSON.stringify({
  release: manifest.release.id,
  payloadFiles: payloadFiles.length,
  checksumFiles: checksumFiles.length,
  publicSpecSha256: manifest.release.publicSpecificationSha256,
  skillZipSha256: hash(skillZip),
  starterZipSha256: hash(starterZip)
}, null, 2));
