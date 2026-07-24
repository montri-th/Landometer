## Release

- Target: Landometer Design System `<version>`
- Base: `main`
- Pages root: `deployment/`
- Canonical URL: `https://montri-th.github.io/Landometer/`
- Profile: `<profile>`
- Manifest: `<manifest-version>`
- Token Schema: `<token-schema-version>`

## What changed

- Replaces `<current-version>` at the GitHub Pages entry point with `<target-version>`.
- Writes the final source tree directly to GitHub.
- Preserves approved repository binary assets unless listed below.
- Keeps shared Landometer architecture product-neutral and product-specific evidence/capabilities bounded.

## Intended files

```text
<exact allowlisted paths>
```

## Direct-write integrity

- `archiveUsed: false`
- `forcePushUsed: false`
- Every changed UTF-8 file was fetched from this branch after writing.
- Source byte length, SHA-256, Git blob/content SHA, and write commit are recorded in `<parity-evidence-path>`.
- Reused binary assets match their approved repository hashes.

## Validation

- Repository validator: `<pass/fail and command>`
- Static integrity: `<result>`
- Browser QA: `<matrix and result>`
- Control inventory: `<result>`
- No-JavaScript/reduced motion: `<result or N/A>`
- Accessibility: `<result/open scope>`
- Thai naturalness/parity: `<result/open scope>`
- Identity/media/privacy: `<result/open scope>`

## Truthful release state

```yaml
evidenceStatus: <verified|provisional|source_limited>
indexable: <true|false>
machineValidation: <pending|passed|failed>
```

Disabled capabilities:

```text
<share, persistence, telemetry, external effects, etc.>
```

Open manual gates:

```text
<exact gates; do not mark passed without evidence>
```

## Deployment and rollback

The existing GitHub Pages workflow validates the repository before uploading `deployment/`. If validation or deployment fails, the previous live release remains the rollback reference. No history rewrite is required.

Post-merge completion requires live endpoint verification of HTML, Manifest, critical assets, and enabled interactions with cache bypass and retry. Repository merge alone is not reported as publication success.
