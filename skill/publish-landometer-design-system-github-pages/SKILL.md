---
name: publish-landometer-design-system-github-pages
description: Publish a prepared Landometer Design System static release to montri-th/Landometer GitHub Pages by writing source files directly to GitHub, verifying exact content/blob parity, validating a clean release branch, merging through a pull request, and verifying the deployed HTML and manifest. Use only when the user explicitly asks to publish or replace the current Landometer GitHub Pages release. Never use ZIP/TAR as release transport, never force-push main, never merge scratch artifacts, and never upgrade evidence or machine-validation status without the applicable artifact gates.
---

# Publish Landometer Design System to GitHub Pages

This skill preserves the release method proven by the v0.8.7 publication. It is a publishing workflow, not a design-system authoring substitute.

## Fixed repository context

- Repository: `montri-th/Landometer`
- Default branch: `main`
- GitHub Pages root: `deployment/`
- Public URL: `https://montri-th.github.io/Landometer/`
- Deploy workflow: `.github/workflows/pages.yml`
- Repository validator: `node tools/validate-release.mjs`

Resolve these values from the repository before acting. Stop if the repository, default branch, Pages root, or deployment mechanism has changed materially.

## Authority and evidence boundary

1. Use the target release's approved Build Card, manifest, design-system source, asset records, and QA evidence as authority.
2. Keep shared Landometer architecture product-neutral. Product data, workflows, scores, models, claims, voice, permissions, and live capabilities remain product-specific.
3. Compare products, places, or cities only under compatible schema/release versions; otherwise state incompatibility.
4. Package validation never certifies an implementation by itself. Preserve the artifact's actual `evidenceStatus`, `indexable`, and `machineValidation` values until its applicable automated and manual gates pass.
5. Reuse existing approved binary assets only at their exact repository paths and hashes. A new rendition is a new asset and needs its own approval record.

## Non-negotiable release invariants

- Do not ask the user to upload a ZIP, TAR, TAR.XZ, or other archive into the repository.
- Do not expect GitHub Pages or GitHub Actions to unpack a release archive unless an explicit reviewed workflow owns that behavior.
- Do not transport UTF-8 source through chat attachments when GitHub's contents or Git Data API can write the source directly.
- Do not reuse a scratch branch for production. Create a clean release branch from the current `main` head.
- Do not force-push `main` or rewrite release history.
- Do not merge temporary chunks, `part-*`, `chunk-*`, `release-sources/`, local archives, debug files, or QA trigger markers.
- Do not claim that repository state proves the live website. Verify the deployed endpoint.
- Do not report success while the release PR, Pages deployment, or live verification is unresolved.

## Required inputs

Before writing, resolve:

```yaml
release:
  version: ""
  repository: montri-th/Landometer
  baseBranch: main
  releaseBranch: "release/design-system-<version>"
  siteRoot: deployment
  canonicalUrl: https://montri-th.github.io/Landometer/
  entryPoint: deployment/index.html
  manifestPath: ""
  validator: node tools/validate-release.mjs
  intendedFiles: []
  reusedBinaryAssets: []
  newBinaryAssets: []
  evidenceStatus: verified | provisional | source_limited
  indexable: false
  machineValidation: pending | passed | failed
  manualGatesOpen: []
```

Every `intendedFiles` record names path, operation (`create`, `replace`, `delete`, `preserve`), source, UTF-8/binary class, expected byte length, expected SHA-256, and why it belongs in the release.

## Execution workflow

### 1. Orient the repository

1. Read repository metadata and current `main` head.
2. Read `README.md`, `deployment/index.html`, the active manifest, `tools/validate-release.mjs`, and `.github/workflows/pages.yml`.
3. Identify the current live version and the exact replacement target.
4. Confirm that `deployment/` is still the artifact uploaded by Pages.
5. Record the current `main` commit as the release base.

### 2. Freeze the file allowlist

Create the intended-file table before any GitHub write. Separate:

- files replaced at the public entry point;
- new release identity/evidence files;
- validator/workflow changes;
- approved binary files reused unchanged;
- historical files intentionally preserved.

Unknown or convenience files are excluded. A release branch is not a staging bucket.

### 3. Create a clean release branch

Create `release/design-system-<version>` from the current `main` head. If that name exists, inspect it; do not silently overwrite it. Use a new clean name when needed.

Scratch branches may be used to test API behavior, but they are quarantined and never become the release PR head.

### 4. Write source directly to GitHub

Prefer one atomic Git Data commit when the connector supports it:

```txt
create_blob for every exact file
→ create_tree on the current base tree
→ create_commit with the current main commit as parent
→ update_ref for the clean release branch without force
```

Use the contents API as a safe fallback:

- existing UTF-8 file: `fetch_file` → capture current blob SHA → `update_file` with the complete replacement;
- new UTF-8 file: `create_file`;
- deletion: `fetch_file` → `delete_file` with the exact current blob SHA;
- never update/delete the same path in parallel;
- record the returned commit SHA and content blob SHA after every write.

For large text or a genuinely new binary, use the Git Data API directly with UTF-8 or base64 `create_blob`, then tree/commit/ref operations. Do not wrap it in an archive. If the available connector cannot write the required binary exactly, stop only that binary path and resolve a direct binary-capable route; do not invent a rendition or hide the missing asset.

### 5. Verify source/blob parity

After writing every path:

1. Fetch it from the release branch, not `main`.
2. Compare its decoded bytes with the prepared source.
3. Record source SHA-256, Git content/blob SHA, byte length, and write commit SHA.
4. For reused binaries, verify the repository file's exact approved hash against its manifest.
5. Treat truncation in a UI preview as insufficient evidence; fetch raw/blob content when necessary.

The parity record must prove `expected bytes = Git branch bytes`. An archive checksum is irrelevant because no archive is used.

### 6. Enforce branch hygiene

Compare `main...releaseBranch` and require:

- `behind_by: 0` or an explicitly resolved rebase/update;
- only allowlisted paths changed;
- no archive files;
- no temporary source chunks;
- no scratch workflow or QA marker;
- no accidental deletion of approved fonts, photos, logos, historical fixtures, or release evidence;
- validator, manifest, HTML identity, metadata, and rendered capabilities agree.

If the diff is noisy, create another clean branch from `main` and rewrite only the allowlist. Do not repair a polluted branch by rationalizing its extra files.

### 7. Validate before merge

Run the repository validator against the actual release files:

```bash
node tools/validate-release.mjs
```

Also run the artifact's browser QA, responsive checks, control inventory, no-JavaScript/reduced-motion behavior, and any applicable accessibility, asset, privacy, and language gates.

When operating connector-only, require a pull-request workflow that validates proposed source without requiring the not-yet-deployed target version. Source validation and post-deploy live verification are separate gates.

A validator failure blocks merge. An open manual gate remains open and is disclosed; it is not converted to `passed` for convenience.

### 8. Open a release pull request

Use the template in `templates/pr-body.md`. The PR must state:

- what replaces the current release;
- exact version/profile/schema boundary;
- intended changed files;
- direct-write and parity evidence;
- automated QA results;
- disabled capabilities and manual gates;
- rollback behavior;
- that no archive transport was used.

Re-read the PR until `mergeable: true`. Resolve conflicts and required checks before merge.

### 9. Merge without rewriting history

Use a normal merge or squash merge according to repository policy. Never force-update `main`.

Record:

- PR number and URL;
- release-branch head SHA;
- merge commit SHA;
- final `main` SHA.

The existing Pages workflow should validate before uploading `deployment/`. A failed deployment must leave the previous live release intact.

### 10. Verify the live endpoint

Repository merge is not completion. Verify the actual Pages endpoint with retry and cache bypass:

```txt
https://montri-th.github.io/Landometer/?verify=<merge-sha>-<attempt>
```

Check at minimum:

- HTTP success for HTML, manifest, CSS, JavaScript, logo, approved photos, and required fonts;
- HTML target version, Manifest 2.0, Token Schema 6, selected profile, evidence status, `indexable`, and `machineValidation`;
- deployed manifest values match the release Build Card and HTML identity;
- live HTML and manifest bytes match `main` when Pages serves them without transformation;
- no browser page errors, failed critical requests, dead controls, or horizontal overflow;
- Adopt/Reference/Lab, locale, theme, selected role/proof, and deep-link restoration when those capabilities are enabled.

Use `scripts/verify-live.mjs` or the workflow template in this skill. Fail closed when the endpoint does not converge. Do not phrase a queued workflow or stale CDN response as success.

### 11. Clean up verification artifacts

- Keep reusable validation workflows that add lasting value.
- Close QA-trigger-only PRs without merging their marker files.
- Leave experimental branches clearly separated or delete them when branch deletion is available and safe.
- Do not merge a marker merely to obtain a green check.

## Common failure patterns and corrections

| Failure | Correction |
|---|---|
| Send ZIP/TAR and ask the user to upload it | Write exact source files directly with contents/Git Data API |
| Assume GitHub will unpack an archive | Commit the final directory tree itself |
| Reuse a scratch branch | Create a clean release branch from current `main` |
| Many temporary chunks appear in the diff | Rebuild the release branch from the frozen allowlist |
| Repository shows the target version, so declare success | Verify the live Pages HTML, manifest, assets, and interactions |
| PR is initially non-mergeable | Re-read after GitHub computes mergeability; resolve checks/conflicts |
| Source validator is locked to the prior version | Update the validator intentionally and validate its own assertions |
| Live verifier runs before deployment | Separate source validation from post-merge live verification or dispatch it after Pages deploys |
| A QA marker PR is merged | Close it unmerged after the reusable workflow/check has served its purpose |
| New binary cannot be sent by text API | Use direct base64 Git blob/tree/commit; never hide it in an archive |
| Package checks pass, so set machine validation to passed | Preserve `pending` until all applicable artifact-level automated and manual gates pass |

## Completion report

Report only observed facts:

1. release version and boundary;
2. clean branch and allowlisted diff;
3. parity record status;
4. validator/browser QA results;
5. PR and merge SHAs;
6. Pages workflow result;
7. live endpoint verification and hashes;
8. preserved disabled capabilities and open manual gates;
9. confirmation that no archive transport or force-push was used.

## Definition of done

The publishing task is complete only when:

- the final source tree, not an archive, is on `main`;
- the release diff contains only intended files;
- validator and applicable artifact QA pass;
- the release PR is merged without rewriting history;
- GitHub Pages has deployed the merged source;
- the live HTML and manifest expose the intended release boundary;
- critical assets and interactions work on the live endpoint;
- evidence and machine-validation states remain truthful;
- all unresolved manual gates are explicitly recorded.
