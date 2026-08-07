# Landometer Design System v0.8.9 — Harmonized Gradient Diversity

**Status:** owner-approved for authoring integration; generated package and artifact validation remain pending
**Authority:** Landometer owner instruction, 7 August 2026
**Scope:** shared Landometer atmosphere only; product identity, semantic state, categorical, analytical, map, interaction, and official-asset color remain separate

## Why this change is needed

The v0.8.8 authoring master deliberately added no raw color values. It reused the
asset-gated `motif.gradient.civicCool` and `motif.gradient.civicWarm` stop
sequences as the Ground and Cultivate surface recipes. It also serialized the
closing surface midpoint at `54%` and the nearly identical Brand Signature motif
midpoint at `52%`. The resulting system has three defects:

1. a two-percent midpoint difference implies precision that produces no useful
   perceptual or semantic distinction;
2. shared page atmosphere and asset-only motif color are coupled even though
   their permission and use boundaries differ;
3. Ground and Cultivate do not receive distinct light/dark recipes, which
   encourages heavy scrims that can wash the governed atmosphere back to an
   almost white or black surface.

v0.8.9 therefore introduces a harmonized atmosphere family with genuine tonal
and hue diversity while preserving one coherent Landometer lineage. The new
colors are owner-approved, frozen gradient-only values. They are not runtime
derivations of protected Brand Blue and are not reusable UI, data, state, map,
product, or logo colors.

## Release identity

- Design System: `0.8.9`
- Authoring revision: `v0.8.9-r1`
- Supersedes: `v0.8.8-r3`
- Gradient registry: `landometer-atmosphere-gradient-v2`
- Color Set: `color-srgb-02`
- Delivery: SDR, sRGB IEC 61966-2-1
- Canonical encoding: exact six-digit sRGB hex
- Canonical default angle: `135deg`
- Canonical interpolation: explicit `in srgb` when supported, with the exact
  legacy sRGB-compatible syntax as fallback

`color-srgb-01` and every immutable v0.8.8 artifact remain append-only historical
evidence. Implementations MUST NOT redefine their bytes, hashes, or meaning.

## New gradient-only color ledger

These fifteen values are new in v0.8.9. Their only shared role is as an exact
stop inside the governed atmosphere recipes below.

| Group | Exact values |
|---|---|
| Cool luminous | `#89CEF6`, `#5ECAD6`, `#6CD5B3` |
| Ground current | `#0F5773`, `#006A6A`, `#1F744F` |
| Ground mist | `#C4E0EE`, `#B2E2E2`, `#CCE6D0` |
| Cultivate glow | `#EB8182`, `#F5A06F`, `#EBC573` |
| Cultivate mist | `#F7CBC7`, `#FBD1B6`, `#F1E0B4` |

The family stays inside blue–cyan–green and coral–apricot–sun lineages. It does
not reopen violet, purple, periwinkle, lavender, plum, fuchsia, cool/electric
magenta, terracotta, brick, clay, rust, sienna, burnt-orange, earth-red, or
brown-orange roles. A raw-value match in another registry never grants role
aliasing.

## Governed shared atmosphere recipes

All stops and positions are exact. Product code and authoring tools MUST NOT
interpolate new stop values, substitute a nearby color, or create a local
variant.

| ID | Exact stops | Default use | Local foreground contract |
|---|---|---|---|
| `atmosphere.gradient.measure.deep` | `#1D4497 0% → #176B82 54% → #08756F 100%` | Measure in light theme; high-confidence entry or closure | `surfaceForeground.onDeep` |
| `atmosphere.gradient.measure.luminous` | `#89CEF6 0% → #5ECAD6 50% → #6CD5B3 100%` | Measure in dark theme; orientation and forward movement | `surfaceForeground.onLight` |
| `atmosphere.gradient.ground.current` | `#0F5773 0% → #006A6A 50% → #1F744F 100%` | Ground in dark theme; context and evidence becoming understandable | `surfaceForeground.onDeep` |
| `atmosphere.gradient.ground.mist` | `#C4E0EE 0% → #B2E2E2 50% → #CCE6D0 100%` | Ground in light theme; calm context and Brand Voice proof | `surfaceForeground.onLight` |
| `atmosphere.gradient.cultivate.glow` | `#EB8182 0% → #F5A06F 50% → #EBC573 100%` | Cultivate in light theme; action and credible momentum | `surfaceForeground.onLight` |
| `atmosphere.gradient.cultivate.mist` | `#F7CBC7 0% → #FBD1B6 50% → #F1E0B4 100%` | Cultivate in dark theme; completion and handoff | `surfaceForeground.onLight` |
| `atmosphere.gradient.diversity.spectrum` | `#89CEF6 0% → #6CD5B3 34% → #EBC573 67% → #EB8182 100%` | rare, theme-invariant scene with evidenced diverse participation or co-creation | `surfaceForeground.onLight` |

Theme defaults are exact aliases:

| Semantic recipe | Light | Dark |
|---|---|---|
| `surfaceAtmosphere.measure` | `atmosphere.gradient.measure.deep` | `atmosphere.gradient.measure.luminous` |
| `surfaceAtmosphere.ground` | `atmosphere.gradient.ground.mist` | `atmosphere.gradient.ground.current` |
| `surfaceAtmosphere.cultivate` | `atmosphere.gradient.cultivate.glow` | `atmosphere.gradient.cultivate.mist` |

An explicit fixed component-owned surface MAY use the paired alternate across
themes only when it records the exact recipe, pins its complete local foreground
contract, and passes the rendered contrast and deletion gates. Theme-global text
tokens MUST NOT leak into that component.

## Rare Diversity Spectrum

`atmosphere.gradient.diversity.spectrum` is not a generic rainbow, hero default,
or fourth semantic stage. It MAY appear at most once in a genuinely long route,
inside an existing Ground or Cultivate moment, when the visible content names
real different perspectives, contributors, or co-creation roles. Labels,
structure, people, and evidence carry that meaning; hue never carries it alone.

It MUST NOT identify a product, encode a category, magnitude, state, map layer,
or interaction, color an official logo, fill a routine button, animate through a
hue cycle, or appear merely to make a page more colorful. A neutral or worsened
deletion result removes it.

## Foreground contracts and contrast floor

```yaml
surfaceForeground.onDeep:
  primary: "#FFFFFF"
  secondary: "#F1F4EF"
  metadata: "#F1F4EF"
  icon: "#FFFFFF"
  meaningfulSeparator: "#F1F4EF"
  interactiveSurface: "#FFFFFF"
  interactiveInk: "#182327"
  focusRingInner: "#182327"
  focusRingOuter: "#FFFFFF"

surfaceForeground.onLight:
  primary: "#182327"
  secondary: "#293337"
  metadata: "#293337"
  icon: "#182327"
  meaningfulSeparator: "#182327"
  interactiveSurface: "#FFFFFF"
  interactiveInk: "#182327"
  focusRingInner: "#FFFFFF"
  focusRingOuter: "#182327"
```

Token-level preflight sampled 1,001 positions under sRGB interpolation. These
figures are acceptance floors for generated fixtures, not substitutes for
rendered glyph, alpha-stack, photographic-overlay, focus, export, or device QA.

| Recipe | Primary minimum | Secondary minimum |
|---|---:|---:|
| Measure Deep | `5.54:1` | `4.99:1` |
| Measure Luminous | `8.32:1` | `6.71:1` |
| Ground Current | `5.72:1` | `5.16:1` |
| Ground Mist | `11.36:1` | `9.16:1` |
| Cultivate Glow | `6.11:1` | `4.93:1` |
| Cultivate Mist | `10.94:1` | `8.82:1` |
| Diversity Spectrum | `6.11:1` | `4.93:1` |

A standalone governed gradient that passes its local foreground contract SHOULD
remain visible. Do not cover it with a blanket white or black scrim merely to
inherit page-global text. A deterministic scrim or opaque panel remains required
when a photograph, nested alpha layer, altered geometry, or actual glyph sample
fails. Meaningful lines use the opaque contract color; lower-opacity hairlines
remain decorative and carry no required distinction.

## Alias, deprecation, and motif separation

- `motif.gradient.brandSignature` becomes an exact semantic alias of the stop
  map for `atmosphere.gradient.measure.deep`, including the `54%` midpoint. It
  remains asset-gated and never authorizes a surface or reconstructed logo.
- `signature.gradient.closing.light` aliases
  `atmosphere.gradient.measure.deep` for one migration release.
- `signature.gradient.closing.dark` aliases
  `atmosphere.gradient.measure.luminous` for one migration release.
- The unthemed v0.8.8 Ground and Cultivate recipes are deprecated. Consumers
  migrate to the exact theme defaults above.
- `motif.gradient.civicCool` and `motif.gradient.civicWarm` remain exact,
  asset-only historical motif recipes until their vector/hash gate passes. They
  are no longer source values for shared atmosphere surfaces.
- `dark.signature.sky` is deprecated as a signature role when no active v0.8.9
  gradient references it. The same raw `#68C4E2` may remain governed in its
  independently named interaction role.

Product gradients remain product-owned and unchanged. Categorical, sequential,
diverging, semantic-state, map, and interaction registries remain unchanged and
MUST NOT consume any `atmosphere.*` value.

## Complete Color Atlas contract

The v0.8.9 Atlas MUST show:

1. a concise Measure / Ground / Cultivate router with both tonal recipes;
2. all seven shared recipes with exact stops, theme default, purpose,
   foreground contract, and contrast-floor badge;
3. the Diversity Spectrum in a separate rare/evidence-required specimen;
4. `motif.gradient.brandSignature` as an alias diagram rather than a duplicate
   almost-identical swatch;
5. motif and product gradients in separately labelled asset-only and
   product-only sections;
6. data/state/map color in their existing separate sections; and
7. responsive labels that move above the color strip before any text overlap.

The complete inventory is `7 shared atmosphere + 3 asset-only motif + 8 product
identity = 18 gradient records`. Hosted and standalone output MUST be generated
from the same registry records; the generator MUST NOT keep an independent
hand-copied gradient array.

## Preserved boundaries

- The Master Brand Brief remains the brand-level source of truth and the exact
  cultural invitation remains **Let us cultivate our city with data.**
- Protected Brand Blue remains exact and narrowly role-bound. New atmosphere
  values do not make it a general palette seed.
- Shared guidance stays product-neutral across Land, Location, and Living.
- Product-specific facts, datasets, scores, workflows, claims, and color remain
  in the owning product layer.
- `source_limited`, `internal_demo`, `noindex`, evidence, rights, readiness,
  machine-validation, and publication boundaries do not improve merely because
  the palette is approved.
- Publication authorization does not waive package generation, immutable hashes,
  manual visual/accessibility review, or post-deploy verification.
