# Metadata and machine discovery

## Gate metadata by release state

For private, internal, provisional, source-limited, or non-indexable artifacts, keep page-level `noindex` behavior and remove public-readiness claims. Do not create public social previews, sitemaps, or discovery aids that reveal restricted state.

For an approved public indexable artifact, align:

- localized initial title and description;
- stable canonical and reciprocal locale routes;
- Open Graph and platform preview records;
- truthful JSON-LD using visible, supported facts;
- robots behavior and sitemap entries;
- visible author, publisher, date, version, evidence, and limitation where relevant;
- manifest and Build Card state.

Client-side mutation is not a substitute for crawlable localized initial HTML when indexable locale routes are promised.

## Bound AI discovery

Prefer semantic HTML and direct public-safe source links. An `llms.txt` file can provide navigation, but it is not:

- a crawler directive or ranking signal;
- access control, permission, or a license;
- proof of accuracy, freshness, or conformance;
- an agent-readable or bounded-action declaration;
- evidence that an AI system may act on the user’s behalf.

Keep discovery, evidence promotion, and action authority as separate records. If a discovery file exists, verify its path, content, hash, public safety, and navigation-only statement. If it is absent, remove claims that it is delivered.

## Review matrix

Check:

1. visible page versus initial HTML;
2. title, description, canonical, locale, and robots;
3. share previews and their approved assets;
4. structured data versus visible facts;
5. manifest, Build Card, evidence, indexability, and runtime effects;
6. sitemap and discovery files;
7. hosted root versus standalone artifact;
8. source build versus deployed bytes and cache state.
