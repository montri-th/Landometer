# Identity delivery and machine discovery

## Route identity by context

Use the exact approved variant for its declared context:

- use the transparent horizontal lockup in a normal header;
- use only a separately approved compact or symbol asset in an app-icon or favicon context;
- preserve the approved bytes, proportions, clear space, colors, canvas, and surface strategy;
- change the governed surrounding surface when header contrast fails.

Treat the header lockup, favicon/tab icon, apple-touch icon, maskable/install icon, and social preview as separate approval scopes. Record exact role, path, MIME, dimensions, byte length, SHA-256, transparent-canvas behavior, theme strategy, and source version for each used asset. Do not silently reuse one role for another.

Never crop, trace, reconstruct, recolor, filter, or place the horizontal lockup on an invented carrier to make a browser icon. Do not use a wide banner, wordmark, or header lockup as `rel="icon"`.

For a browser-tab icon, require an adjacent manifest record with:

- exact asset path, variant, MIME type, intrinsic size, and SHA-256;
- transparent-canvas and minimum-size evidence;
- explicit compact/favicon approval scope and theme strategy;
- rendered state matching the HTML.

When no approved compact asset exists, omit `rel="icon"` and record `pending_approved_compact_asset`; never manufacture a substitute. Treat search-result favicon selection as host-level behavior that a project subpath may not control.

Use a stable same-origin favicon URL for the hosted page when possible. A portable standalone may use an explicitly governed stable absolute production URL when offline identity delivery is not promised. Add a content-derived cache revision and verify source, built artifact, final response URL, media type, dimensions, bytes, SHA-256, cold/warm cache behavior, tab, and bookmark states before comparing devices.

## Match metadata to release state

Keep initial HTML, visible status, Build Card, adjacent manifest, robots, canonical URL, and runtime behavior equal.

| Release state | Required behavior |
|---|---|
| internal, private, provisional, or `source_limited` | keep `indexable: false`; emit a page-level `noindex`; do not imply public SEO, social-preview, structured-data, or agent readiness |
| verified `deployable_public` and indexable | render localized initial title/description; stable self-canonical locale URLs; reciprocal `hreflang`; public-safe Open Graph/Twitter records; truthful JSON-LD; sitemap; verified preview asset and permissions |

Do not promote a page by changing `robots` alone. Do not put private state, restricted identifiers, sensitive filters, or provisional claims into a title, description, canonical URL, social preview, structured data, sitemap, or discovery file.

For an indexable localized page:

- make each locale reachable without client-side mutation;
- keep canonical URLs parameter-free;
- keep visible entity, version, evidence status, dates, author/publisher, and structured data consistent;
- use an approved, reachable, public-safe social-preview asset with verified dimensions and alt text.

## Keep AI discovery bounded

Use semantic HTML and direct public-safe source links first. An `llms.txt` file may help a machine navigate public material; it is not:

- a ranking signal or crawler directive;
- access control, permission, or license;
- an `agentReadable` or bounded-action declaration;
- a conformance, accuracy, or freshness claim;
- a substitute for the manifest, evidence boundary, or visible page.

Keep `agentReadable`, bounded action, effects, and discovery-aid state separate in the manifest. If `llms.txt` exists, verify its path and hash and make its navigation-only boundary explicit.

Keep `llms.txt` optional. When it is absent, remove every HTML and manifest claim that it is delivered. When it is present, state explicitly that it is not a ranking signal, access control, conformance claim, permission, or agent-action declaration.

## Review matrix

Check:

1. header lockup versus compact/favicon context;
2. asset path/hash/approval versus rendered source;
3. locale and indexability in initial HTML;
4. robots/canonical/social/structured-data parity;
5. manifest, Build Card, visible trust/status, and runtime effects;
6. public-safe discovery links with no private-state leakage.
