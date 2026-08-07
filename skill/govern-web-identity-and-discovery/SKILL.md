---
name: govern-web-identity-and-discovery
description: Audit or implement browser and favicon identity, social and SEO metadata, canonical and hreflang routes, structured data, sitemap and robots behavior, and bounded AI-discovery metadata for a website. Use when tab icons, previews, indexing, llms.txt, hosted or standalone parity, cache revision, asset hashes, or host-level favicon ownership are in scope. Never manufacture unapproved identity variants or treat metadata as permission, evidence, readiness, or agent authority.
---

# Govern Web Identity And Discovery

Keep what people see in a tab, bookmark, shared link, search result, installed app, and machine-readable surface aligned with the same approved identity and truthful release state.

## Workflow

1. Resolve the page owner, product scope, canonical host and path, locale routes, release/build identity, visibility, indexability, evidence status, and machine-readability boundary.
2. Inventory the approved identity assets and their scopes. Read [references/identity-assets.md](references/identity-assets.md).
3. Map each delivery role separately: header lockup, favicon/tab icon, apple-touch icon, maskable or install icon, social preview, and any theme-specific variant. Do not assume one asset is approved for another role.
4. Implement deterministic asset delivery:
   - hosted pages use stable same-origin paths where possible;
   - portable standalone files use an approved embedded asset or an explicitly recorded stable absolute production URL when offline delivery is not promised;
   - revision asset URLs with a content-derived identifier when cache replacement matters;
   - record MIME, intrinsic dimensions, byte length, SHA-256, transparency, approval scope, and source version.
5. Match visible state, initial HTML, Build Card, manifest, robots, canonical, localized metadata, structured data, and runtime behavior. Read [references/metadata-and-machine-discovery.md](references/metadata-and-machine-discovery.md).
6. Verify source, built artifact, deployed response, redirects, final URL, media type, byte length, SHA-256, cache headers, and rendered tab/bookmark/share states.
7. Distinguish project-path control from host-level ownership. Search engines and browsers may select a hostname-level favicon or cached preview beyond a single subpath’s control.
8. Report missing approvals, unsafe metadata, conflicting release states, cache/build mismatch, and host-level limitations without inventing a workaround.

## Asset-role matrix

| Role | Typical shape | Must prove |
|---|---|---|
| Header identity | approved lockup | exact variant, proportions, clear space, transparent delivery, owned-surface contrast |
| Browser tab/favicon | approved compact or symbol | favicon approval, small-size recognition, MIME, dimensions, hash, cache revision |
| Apple touch | approved touch rendition | canvas, dimensions, platform scope, hash |
| Maskable/install | approved app rendition | safe zone, purpose, manifest parity, hash |
| Social preview | approved share image | dimensions, crop/safe area, public permission, locale, alt text, hash |

If the governing brand contract requires a transparent logo, preserve the transparent asset and change the owned background surface for contrast. Do not invent a white carrier, crop a wide lockup into a square, trace a symbol, or reconstruct a missing compact asset.

## Boundaries

- Keep shared identity architecture product-neutral. Product names, claims, screenshots, data, and preview content stay in their owning product layer.
- Do not leak private state, restricted identifiers, sensitive filters, provisional claims, or unsupported capabilities into public metadata.
- Do not turn `robots`, JSON-LD, a manifest, or `llms.txt` into a claim of permission, quality, evidence, conformance, or agent authority.
- Do not publish or change indexing without explicit authorization.
- Omit an identity role when no approved asset exists; record the missing approval instead of manufacturing a substitute.

## Output contract

Return:

1. the resolved page, host, locale, release, visibility, and indexability boundary;
2. the asset-role matrix with approval and exact file evidence;
3. metadata, canonical, robots, structured-data, and AI-discovery parity;
4. hosted and standalone delivery behavior;
5. source/build/live URL, MIME, byte, hash, cache, and rendered-state checks;
6. missing approvals, unsafe claims, and host-level limitations.
