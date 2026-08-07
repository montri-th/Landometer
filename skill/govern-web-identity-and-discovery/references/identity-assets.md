# Identity asset governance

## Keep variants separate

An identity family can contain a horizontal lockup, stacked lockup, compact mark, favicon, app/touch icon, maskable icon, monochrome mark, and social preview. Similar appearance does not grant interchangeable approval.

For every used asset, record:

```yaml
role: ""
path: ""
variant: ""
approvalScope: ""
mime: ""
intrinsicWidth: 0
intrinsicHeight: 0
bytes: 0
sha256: ""
transparentCanvas: true
themeStrategy: ""
sourceVersion: ""
cacheRevision: ""
```

## Favicon delivery

- Prefer an approved compact or symbol that remains recognizable at small sizes.
- Declare an explicit MIME type and stable URL.
- Use a content-derived revision such as a short SHA-256 query or filename when the asset can change behind the same route.
- Keep hosted and standalone declarations consistent with their delivery promises.
- Verify the fetched body, final URL after redirects, media type, dimensions, bytes, hash, and visible tab/bookmark result.
- Test at least one cold-cache and one warm-cache path when replacement is part of the task.

Browsers and search engines can retain icons independently. A correct asset response does not guarantee immediate visual refresh. Record the exact build and asset revision before comparing devices.

## Contrast and transparency

Preserve the approved transparent canvas and mark colors. When contrast fails, change the component-owned surface, scrim, or placement according to the design system. Do not add an unapproved backing plate to the asset itself.

## Missing variants

When the required role lacks an approved asset:

1. omit the role if safe;
2. record a named pending approval;
3. specify the needed role, dimensions, canvas, theme, and recognition evidence;
4. keep any proposed rendition visibly non-authoritative.
