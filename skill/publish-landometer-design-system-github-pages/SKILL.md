---
name: publish-landometer-design-system-github-pages
description: Publish, merge, and verify a prepared Landometer Design System release on montri-th/Landometer GitHub Pages. Use only after explicit publish, deploy, or merge authorization, including GitHub CLI authentication recovery during that release. Verify an allowlisted diff, required checks, exact deployed bytes and identity assets, immutable build and Color Set relationships, and remaining gates. Never force-push, discard unrelated work, merge scratch artifacts, or upgrade evidence status without applicable gates.
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

## Choose the execution route

Use one route deliberately:

- **Local Git + GitHub CLI** when a clean repository checkout is available. This is the preferred route for ordinary revisions because local tests, exact staging, CI-log inspection, and browser QA remain close to the source.
- **GitHub contents/Git Data API** when only a connector is available or exact remote writes are required. Keep the existing direct-write parity rules below.

For the local route:

1. Confirm `git` and `gh` exist.
2. Run `gh auth status -h github.com` and confirm the active account with `gh api user`. If unauthenticated, start browser/device login. An expired code means request a new code; never expose a token or log out unless intentionally changing accounts.
3. Inspect the current branch and dirty files. Preserve unrelated user work; do not auto-stash, hard reset, clean, or discard it.
4. Fetch current `origin/main` and create a fresh scoped branch from that exact commit. Detect already-merged or duplicate commits before replaying changes.
5. Stage only frozen allowlist paths with `git add -- <paths>`. Never use `git add -A` or `git add .`.
6. Review `git diff --cached --name-status` and `git diff --cached --check` before committing.
7. Push without force, open a draft pull request, monitor required checks, inspect failed-job logs, make the smallest targeted correction, and rerun the complete local validation set before pushing again.

Read [references/v0.8.8-release-lessons.md](references/v0.8.8-release-lessons.md) when authentication, branch divergence, CI repair, standalone delivery, favicon revision, or exact live parity is in scope.

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

### 4. Write exact source through the chosen route

For Local Git + GitHub CLI, edit only allowlisted paths, run the non-writing rebuild and validation checks before staging, and preserve generated/source parity. Use the explicit staging and draft-PR rules above.

For connector/API delivery, prefer one atomic Git Data commit when the connector supports it:

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

For a local branch, compare both the working tree and staged diff. A clean commit does not excuse unrelated uncommitted changes, and an apparently clean tree does not prove the commit allowlist.

### 7. Validate before merge

Run the repository validator against the actual release files:

```bash
node tools/validate-release.mjs
```

Also run the artifact's browser QA, responsive checks, control inventory, no-JavaScript/reduced-motion behavior, and any applicable accessibility, asset, privacy, and language gates.

When operating connector-only, require a pull-request workflow that validates proposed source without requiring the not-yet-deployed target version. Source validation and post-deploy live verification are separate gates.

A validator failure blocks merge. An open manual gate remains open and is disclosed; it is not converted to `passed` for convenience.

### 8. Open a draft release pull request and close CI

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

Keep the PR in draft while required validation is incomplete. On failure, inspect the exact failed job and log, make the smallest scoped fix, rerun every applicable local check, and push normally. Do not bypass branch protection or treat a retried green subset as evidence that the full set passed.

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
- live HTML and manifest bytes match the deployed commit when Pages serves them without transformation;
- each critical live asset matches both the deployed source bytes and its manifest byte count plus SHA-256;
- the live HTML and manifest expose the expected append-only artifact-build ID, not merely the same Design System version;
- no browser page errors, failed critical requests, dead controls, or horizontal overflow;
- Adopt/Reference/Lab, locale, theme, selected role/proof, and deep-link restoration when those capabilities are enabled.

Bind post-deploy verification to the exact commit deployed by the successful Pages run. Do not check out mutable `main` during a delayed `workflow_run`; use the workflow run head SHA. For manual verification, require an explicit source commit. Compare prepared bytes, staged Git blob, branch bytes, final merged-commit bytes, and live bytes for every critical path.

For critical assets, also verify the final response URL after redirects, media type, manifest dimensions when present, byte length, SHA-256, and cache revision. Include the approved favicon/symbol and open manual-gate evidence in the critical release set.

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
| GitHub device code expires | Start a fresh `gh auth login`; never reuse or expose the expired code |
| Stage everything for convenience | Stage only frozen allowlist paths and inspect the cached diff |
| Workflow verification checks mutable `main` | Check out the exact Pages run head SHA or an explicit manual source commit |
| Two devices show different palettes | Prove artifact build, Color Set/registry, commit, bytes, and hash parity before color-science diagnosis |

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
9. final URLs, MIME types, bytes, hashes, and cache revisions for critical identity assets;
10. confirmation that no archive transport, broad staging, force-push, or destructive worktree cleanup was used.

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
