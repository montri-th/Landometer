# Landometer Design System v0.9.4 — owner trust anchor

This directory is intentionally external to the signed Design System package. It contains the public release-verification key and the caller-pinned policy for `v0.9.4-mp1`; it contains no private key.

Release key rotation: `v0.9.4-mp1` is signed with a new release operator key, `landometer.release.2026-09-23.01` (trust store `trust.landometer.release.2026-09-23.01`, policy `policy.landometer.release.2026-09-23.01`, valid from `2026-09-23T10:56:26+07:00`), generated with `freeze/make-release-key.mjs` on the release operator's own computer. The owner decided the rotation on 2026-09-23 (`owner-message:2026-09-23:release-key-rotation`). The key that signed v0.9.1-mp7, `landometer.release.2026-09-01.01`, is not used here: `owner-trust/v0.9.1` is unchanged and remains the only trust pair that verifies v0.9.1-mp7, and this pair verifies v0.9.4-mp1 only.

Governed files: `package-release-trust-store.json` SHA-256 `5d7babb85e6bedf7f4d8bd13189015dd0ac42c3e6e5f8d6bbfd4d6a2e47e9d98`, `package-release-trust-policy.json` SHA-256 `47915568793368b6a8189b4557938987ab32187771d1779f652f070d365b08d2`, `PINNED-SPKI-SHA256.txt` SHA-256 `234d188eaa481dc2eb8f36531fd6d1277df128177082df698dc2906d0a87517f`.

Pin this SPKI SHA-256 fingerprint through an independently controlled channel before accepting the package — the release operator's own record of the key-generation output is that channel:

`0242a576a012482bdbced2992e143f219fbc4cfc47881acd2f4bb49fa89efcab`

Use both JSON files when freezing or validating the release:

```sh
node validate-v0.9.4.mjs \
  --package-trust-store /absolute/path/to/package-release-trust-store.json \
  --package-trust-policy /absolute/path/to/package-release-trust-policy.json
```

The release must fail closed if either external file, the pinned fingerprint, the package-root signature, any of the nine detached attestation signatures, or any covered package byte differs. A package signed with any other key — including `landometer.release.2026-09-01.01` and the throwaway keys that `tools/test-freeze.sh` generates for the self-test — is rejected by this pair.
