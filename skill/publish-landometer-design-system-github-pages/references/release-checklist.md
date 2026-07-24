# Direct GitHub Pages release checklist

Use this checklist with `publish-landometer-design-system-github-pages`. A checked box means observed evidence exists; it is not a planning intention.

## A. Release identity

- [ ] Target version is explicit.
- [ ] Build Card version, Manifest version, Token Schema version, product, profile, delivery, evidence status, visibility, index policy, and machine-validation state are resolved.
- [ ] Canonical URL is the real reachable GitHub Pages URL.
- [ ] Current live version and current `main` SHA are recorded.
- [ ] Replacement target is `deployment/index.html` or another explicitly verified Pages entry point.

## B. Authority and boundary

- [ ] Target release source is the correct versioned authority.
- [ ] Shared Landometer content remains product-neutral.
- [ ] Product-specific claims have a current Product Brief/Product Statement and evidence authority.
- [ ] Cross-city/product comparison uses a compatible schema/release or declares incompatibility.
- [ ] Package validation is not represented as artifact certification.

## C. File allowlist

For every intended path, record:

```yaml
- path: ""
  operation: create | replace | delete | preserve
  class: utf8 | binary
  source: ""
  bytes: 0
  sha256: ""
  reason: ""
  approvalBoundary: ""
```

- [ ] All release paths are listed before writing.
- [ ] Existing logos, photos, fonts, historical fixtures, and approved downloads are marked `preserve` or intentionally changed.
- [ ] No ZIP, TAR, TAR.XZ, archive, `part-*`, `chunk-*`, or temporary transfer file is allowed.
- [ ] No scratch workflow or QA marker is allowed in the release diff.

## D. Clean branch

- [ ] Release branch was created from the current `main` head.
- [ ] Existing branch with the same name was inspected rather than overwritten.
- [ ] Scratch branches are not used as the PR head.
- [ ] Branch is not behind `main`, or the divergence is explicitly resolved.

## E. Direct writes

- [ ] UTF-8 files were written directly through GitHub contents or Git Data API.
- [ ] Existing files were fetched first and updated with their current blob SHA.
- [ ] Same-path writes were sequential.
- [ ] New binaries, when unavoidable, were written as direct base64 Git blobs—not archives.
- [ ] Every write returned and recorded a commit SHA and content/blob SHA.

## F. Source/blob parity

For every changed path:

```yaml
- path: ""
  expectedSha256: ""
  expectedBytes: 0
  gitBlobSha: ""
  writeCommitSha: ""
  branchFetchMatched: true
```

- [ ] Files were fetched from the release branch after writing.
- [ ] Decoded bytes match prepared source.
- [ ] Large/truncated previews were verified through raw/blob content.
- [ ] Reused binary hashes match their approved manifests.

## G. Branch hygiene

- [ ] `compare_commits main releaseBranch` is ahead and not unexpectedly behind.
- [ ] Changed filenames equal the allowlist.
- [ ] No accidental deletion of approved binary assets.
- [ ] HTML identity, manifest, Build Card, metadata, robots, validator, and actual controls agree.
- [ ] Old-version references remain only where intentionally historical or compatibility-bound.

## H. Pre-merge validation

- [ ] `node tools/validate-release.mjs` passes against the actual release source.
- [ ] Static integrity checks pass.
- [ ] Browser QA passes the declared viewport/theme/locale matrix.
- [ ] Every visible control is invoked and reaches its claimed state.
- [ ] No-JavaScript and reduced-motion behavior are checked where applicable.
- [ ] Accessibility, Thai naturalness, identity, media/privacy, and screen-reader gates are either passed or explicitly open.
- [ ] Open gates do not get converted to `passed`.

## I. Pull request

- [ ] PR uses the release branch and `main` base.
- [ ] PR body names changed files, release boundary, validation, disabled capabilities, open gates, rollback, and `archiveUsed: false`.
- [ ] PR diff contains only intended paths.
- [ ] PR is re-read until GitHub reports it mergeable.
- [ ] Required checks pass before merge.

## J. Merge and deployment

- [ ] Merge follows repository policy; no force-push or history rewrite.
- [ ] PR number, release head SHA, merge SHA, and final `main` SHA are recorded.
- [ ] GitHub Pages workflow validates before uploading `deployment/`.
- [ ] Failed deployment is not reported as a successful release.

## K. Live endpoint verification

- [ ] Live HTML responds successfully with cache-bypass query.
- [ ] Live HTML exposes target version, Manifest 2.0, Token Schema 6, selected profile, evidence state, index policy, and machine-validation state.
- [ ] Deployed manifest matches Build Card and HTML identity.
- [ ] CSS, JavaScript, logo, photos, fonts, and critical routes return successfully.
- [ ] Live HTML/manifest match `main` bytes when served without transformation.
- [ ] No critical browser request, page error, dead control, or horizontal overflow occurs.
- [ ] Enabled mode, locale, theme, role/proof, and deep-link behavior work.
- [ ] Retry exhausted without convergence is a failure, not a warning.

## L. Cleanup and report

- [ ] QA-trigger-only PRs are closed without merging marker files.
- [ ] Experimental branches remain isolated or are safely deleted.
- [ ] Reusable validation workflow is retained only when it adds ongoing value.
- [ ] Final report contains observed URLs/SHAs, tests, hashes, disabled capabilities, and open gates.
- [ ] Final report confirms `archiveUsed: false` and `forcePushUsed: false`.
