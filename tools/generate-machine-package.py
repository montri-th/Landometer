#!/usr/bin/env python3
"""Generate the v0.9.0 public-safe machine specification package.

Layout and obligations come from the authoring master's packaging section
("The v0.9.0 public-safe machine specification package MUST supply ...") and its
package file listing. Every emitted file is derived deterministically from the
committed sources named in machine/v0.9.0/package.json#sourceFingerprint; curated
records (schemas, profiles, packs, core) live in this generator so regeneration
is reproducible. Protected binaries (logos, photographs, fonts, PDFs) are
excluded by design — their manifests record hashes and use boundaries only.

Run from the repository root:  python3 tools/generate-machine-package.py
Companion validator (CI):      node tools/validate-machine-package.mjs
"""
import hashlib, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEP = os.path.join(ROOT, "deployment")
OUT = os.path.join(DEP, "machine", "v0.9.0")
MASTER = os.path.join(DEP, "assets/downloads/landometer-design-system-v0.9.0.md")
V089 = os.path.join(DEP, "assets/downloads/landometer-design-system-v0.8.9.md")

PACKAGE_REVISION = "v0.9.0-mp1"

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

def write(rel, content):
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if isinstance(content, (dict, list)):
        content = json.dumps(content, ensure_ascii=False, indent=2) + "\n"
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return rel

master = read(MASTER)
master_lines = master.split("\n")
registry = json.load(open(os.path.join(DEP, "assets/data/color-delivery.v0.9.0.json"), encoding="utf-8"))
tokens_src = json.load(open(os.path.join(DEP, "assets/data/tokens.json"), encoding="utf-8"))
manifest = json.load(open(os.path.join(DEP, "site-manifest.v0.9.0.json"), encoding="utf-8"))

RELEASE = {
    "dsVersion": "0.9.0",
    "authoringRevision": registry["meta"]["authoringRevision"],
    "colorSetId": registry["meta"]["id"],
    "artifactBuildId": registry["meta"]["currentArtifactBuild"]["id"],
    "kitVersion": "lds-kit-0.9.0-r4",
    "manifestVersion": "2.1",
    "tokenSchemaVersion": 6,
    "buildCardSchemaVersion": "0.9.0",
    "packageRevision": PACKAGE_REVISION,
}

emitted = []

# ---------------------------------------------------------------- build-kit —
# E1/E2/E3 are canonical bytes; extract each fenced block verbatim from the
# master so package copies can never drift from the authoring authority.
def extract_kit_block(heading):
    i = master.index(heading)
    open_f = master.index("```", i)
    open_nl = master.index("\n", open_f) + 1
    close_f = master.index("\n```", open_nl)
    return master[open_nl:close_f + 1]

kit_tokens = extract_kit_block("## E1. `lds-tokens.css`")
kit_base = extract_kit_block("## E2. `lds-base.css`")
kit_skeleton = extract_kit_block("## E3. `skeleton.html`")
emitted.append(write("build-kit/lds-tokens.css", kit_tokens))
emitted.append(write("build-kit/lds-base.css", kit_base))
emitted.append(write("build-kit/skeleton.html", kit_skeleton))

# ------------------------------------------------------------ rule inventory —
def rule_ids_of(text):
    ids = set(re.findall(r"\[([A-Z][A-Z-]+-\d{2}[A-Z]?)\]", text))
    ids |= set(re.findall(r"\bCORE-\d{2}\b", text))
    return sorted(ids)

v090_rule_ids = rule_ids_of(master)

# ------------------------------------------------------------- self-check map —
sc_rows = []
for line in master_lines:
    m = re.match(r"\| (SC-\d{2}) \| (.+) \| (.+) \|\s*$", line)
    if m and m.group(1) not in [r["id"] for r in sc_rows]:
        owning = re.findall(r"`([^`]+)`|(§[\w.]+)", m.group(3))
        owning = [a or b for a, b in owning] or [m.group(3).strip()]
        sc_rows.append({
            "id": m.group(1),
            "requirement": m.group(2).strip(),
            "owningRules": owning,
            "acceptance": ("automated" if m.group(1) in
                           {"SC-01","SC-02","SC-03","SC-04","SC-05","SC-06","SC-07","SC-08","SC-09",
                            "SC-10","SC-14","SC-15","SC-16","SC-17","SC-20","SC-21","SC-22","SC-23"}
                           else "both"),
            "evidence": ({"SC-20": "qa/v0.9.0-container-fit.json",
                          "SC-21": "qa/v0.9.0-rendered-affordances.json",
                          "SC-22": "qa/v0.9.0-rendered-affordances.json",
                          "SC-23": "qa/v0.9.0-rendered-affordances.json"}
                         .get(m.group(1), "qa/v0.9.0-automated.json")),
        })
assert len(sc_rows) == 23, f"expected 23 self-check rows, parsed {len(sc_rows)}"
emitted.append(write("self-check.map.json", {
    "schemaVersion": "1.0", "ruleId": "[SELFCHECK-01]",
    "source": {"path": "assets/downloads/landometer-design-system-v0.9.0.md",
               "authoringRevision": RELEASE["authoringRevision"]},
    "items": sc_rows,
    "boundary": "Binary per-item outcomes; exceptions are recorded per item in the artifact "
                "(this page: SC-02/SC-03 [EXCEPTION-01], pre-Kit build upgraded in place).",
}))

# ------------------------------------------------------------------ preflight —
retired_values = ["#795300","#846100","#686354","#8B877A","#B6AD98","#A59A80",
                  "#9E476F","#E982AE","#827C68","#85837A"]
preflight = f"""# Landometer DS v0.9.0 machine preflight — generated, rule-ID keyed
# Source of authority: assets/downloads/landometer-design-system-v0.9.0.md ({RELEASE['authoringRevision']})
# Tests are keyed by rule ID; every entry maps back to the authoring master.
package:
  dsVersion: "0.9.0"
  packageRevision: {PACKAGE_REVISION}
  colorSetId: {RELEASE['colorSetId']}
  artifactBuildId: {RELEASE['artifactBuildId']}
  kitVersion: {RELEASE['kitVersion']}
  tokenSchemaVersion: 6
  manifestVersion: "2.1"

identityMarkers:   # [PROV-01] / SC-01 — required on the html root of every conforming page
  - attr: data-ds-version
    equals: "0.9.0"
  - attr: data-color-registry
    equals: {RELEASE['colorSetId']}
  - attr: data-artifact-build
    equals: {RELEASE['artifactBuildId']}
  - attr: data-build-channel
    oneOf: [latest-alias, immutable-color-set, immutable-artifact-build]

colorPurge:        # [VIS-04] 2026-08-20 owner amendment; SC-17
  retiredValues:   # exact v0.8.x values that MUST NOT appear anywhere
{chr(10).join(f'    - "{v}"' for v in retired_values)}
  bannedWindows:   # OKLCh; deterministic validation windows
    purple:
      hueDeg: [285, 345]
      chromaMin: 0.03
      note: banned at chroma >= 0.03
    muddyDarkPink:
      hueDeg: [345, 360]
      chromaMax: 0.14
      lightnessMax: 0.65
      note: muddy dark pinks banned; approved Warm Pink series.10 ("#B23F74"/"#F06FA6") sits outside
    brown:
      hueDeg: [45, 110]
      lightness: [0.25, 0.80]
      chromaMax: 0.115
      note: brown/tan/khaki/olive-brown/mustard/bronze banned; vivid golds chroma >= 0.115 stay approved
  exemptions:
    - approved Warm Pink series.10 "#B23F74" / "#F06FA6" (ijji identity)
    - vivid golds with chroma >= 0.115 (e.g. "#E0B443", "#F4C44E", "#F5C15C", "#A87B00")

kitBytes:          # [KIT-01] E0 rule 1 — copy verbatim; hashes bind package copies to the master blocks
  lds-tokens.css: {hashlib.sha256(kit_tokens.encode()).hexdigest()}
  lds-base.css: {hashlib.sha256(kit_base.encode()).hexdigest()}
  skeleton.html: {hashlib.sha256(kit_skeleton.encode()).hexdigest()}

manifestHtmlMatch: # §9.4 manifest.html.match — fields the embedded/adjacent manifest repeats and matches
  fields:
    - designSystemVersion
    - buildCardVersion
    - manifestVersion
    - tokenSchemaVersion
    - product
    - profile
    - pageKind + pageKindSourceRef
    - generation/outputType
    - delivery (+ static export record when applicable)
    - languages
    - per-locale voice rule/source/copy-hash/review references
    - publication/evidence status + four discovery states
    - visibility/index policy
    - canonicalUrl
    - theme support/default/preference/override
    - identity-delivery contexts (exact asset/hash/canvas/placement/surface/approval/size/URL)
    - motion intensity
    - capabilities (live + fixture-scoped)
    - network mode + channel parity key
    - proof object/version
    - quiet-region evidence + local foreground contracts + gradient-surface records
    - connector records
    - Context Discovery actions
    - Color Set / artifact-build / registry / artifact hashes
    - hook-loop, cross-product, tool-handoff, web-discovery, social-preview records (when triggered)
    - release receipt + conformance level + self-check results + machine-validation status

selfCheck:         # [SELFCHECK-01] — 23 binary items; map in self-check.map.json
  items: {len(sc_rows)}
  automatedEvidence:
    - qa/v0.9.0-automated.json
    - qa/v0.9.0-gradient-contrast.json
    - qa/v0.9.0-scale-geometry.json
    - qa/v0.9.0-container-fit.json
    - qa/v0.9.0-rendered-affordances.json
    - qa/v0.9.0-thai-leading.json
  manualGates: qa/v0.9.0-manual-gates.md

ruleIds:           # every v0.9.0 rule ID found in the authoring master; preflight tests key on these
{chr(10).join(f'  - "{r}"' for r in v090_rule_ids)}
"""
emitted.append(write("preflight.yml", preflight))

# --------------------------------------------------------------------- tokens —
tok_meta = {
    "tokenSchemaVersion": 6,
    "carriedVersion": tokens_src.get("version", "0.8.6"),
    "colorSetId": RELEASE["colorSetId"],
    "provenance": {
        "source": "assets/data/tokens.json",
        "sha256": sha256(os.path.join(DEP, "assets/data/tokens.json")),
        "authority": "Appendix A of the authoring master; values unchanged since v0.8.6 except "
                     "the 2026-08-20 purple/brown purge (ten colour positions) and the "
                     "2026-08-21 rise refinement (four motion values). Changing this source "
                     "changes the token source and MUST mint a new Color Set ID.",
    },
}
emitted.append(write("tokens.json", {"meta": tok_meta, "values": tokens_src}))

def flatten(prefix, obj, out_list):
    for k, v in obj.items():
        key = f"{prefix}-{k}" if prefix else k
        if isinstance(v, dict):
            flatten(key, v, out_list)
        else:
            out_list.append((key, v))

flat = []
flatten("", tokens_src, flat)
def css_name(k): return "--ldm-" + re.sub(r"[^a-zA-Z0-9]+", "-", k).strip("-").lower()
def css_val(k, v):
    if isinstance(v, (int, float)):
        lk = k.lower()
        if any(t in lk for t in ("duration", "delay")): return f"{v}ms"
        if any(t in lk for t in ("space", "radius", "distance", "breakpoint", "size", "width")) \
           and "ratio" not in lk and "line" not in lk and "weight" not in lk and "opacity" not in lk:
            return f"{v}px"
        return str(v)
    return str(v)
css = ["/* Landometer DS v0.9.0 — generated token custom properties (Token Schema 6).",
       f"   Package {PACKAGE_REVISION} · Color Set {RELEASE['colorSetId']} · generated from assets/data/tokens.json.",
       "   The canonical in-page token block remains build-kit/lds-tokens.css (copy verbatim);",
       "   this file is the machine-readable full-registry projection. */",
       ":root {"]
css += [f"  {css_name(k)}: {css_val(k, v)};" for k, v in flat if not k.startswith("version")]
css.append("}")
emitted.append(write("tokens.css", "\n".join(css) + "\n"))

ts = ["/** Landometer DS v0.9.0 — generated token export (Token Schema 6).",
      f" *  Package {PACKAGE_REVISION} · Color Set {RELEASE['colorSetId']} · source assets/data/tokens.json. */",
      "export const tokenSchemaVersion = 6 as const;",
      f"export const colorSetId = {json.dumps(RELEASE['colorSetId'])} as const;",
      "export const tokens = " + json.dumps(tokens_src, ensure_ascii=False, indent=2) + " as const;",
      "export type Tokens = typeof tokens;"]
emitted.append(write("tokens.ts", "\n".join(ts) + "\n"))

# ------------------------------------------------------------ registry copies —
emitted.append(write("color-delivery.json", registry))
for src, dst in [("font-assets.manifest.json", "font-assets.manifest.json"),
                 ("assets/data/components.json", "components.json"),
                 ("assets/data/fixtures.json", "fixtures.json")]:
    emitted.append(write(dst, read(os.path.join(DEP, src))))

# -------------------------------------------------------------- surface recipes —
def recipe_ref(section, rec):
    out = {"source": {"path": "color-delivery.json", "section": section}}
    for k in ("id", "role", "job", "theme", "surfaceRole", "lightAliasOf", "foregroundContract"):
        if isinstance(rec, dict) and k in rec:
            out[k] = rec[k]
    return out

recipes = {
    "schemaVersion": "1.0",
    "boundary": "Recipes REFERENCE canonical registry values; they never duplicate or alter the "
                "token registry (packaging rule). Exact stops, angles, and foreground contracts "
                "resolve through color-delivery.json in this package.",
    "colorSetId": RELEASE["colorSetId"],
    "sharedAtmosphereGradients": [recipe_ref("sharedAtmosphereGradients", r) if isinstance(r, dict) else r
                                   for r in (registry.get("sharedAtmosphereGradients") or [])] or
                                  {"resolve": "color-delivery.json#sharedAtmosphereGradients"},
    "motifGradients": {"resolve": "color-delivery.json#motifGradients"},
    "productIdentityGradients": {"resolve": "color-delivery.json#productIdentityGradients"},
    "atmosphereThemeDefaults": {"resolve": "color-delivery.json#atmosphereThemeDefaults"},
    "surfaceForegroundContracts": {"resolve": "color-delivery.json#surfaceForegroundContracts"},
    "contrastEvidence": "qa/v0.9.0-gradient-contrast.json (7 gradients x 1001 samples x 2 foregrounds)",
}
emitted.append(write("surface-recipes.json", recipes))

# ---------------------------------------------- identity / media approvals —
ident = manifest.get("identity", {})
emitted.append(write("identity-approvals.manifest.json", {
    "schemaVersion": "1.0",
    "boundary": "Records approved exact hashes and use boundaries only; the public-safe package "
                "excludes logo, photograph, poster, font, PDF, and other protected source binaries. "
                "An artifact cannot pass identity gates until it supplies the exact permitted "
                "binaries and validates them against these records.",
    "identity": ident,
    "status": "records mirror site-manifest.v0.9.0.json#identity for this artifact; formal "
              "identity/media approval records beyond those listed remain open (approval_missing "
              "entries stay honest).",
}))
media_assets = [a for a in manifest.get("assets", []) if a.get("path", "").startswith("assets/images/")
                or a.get("path", "").startswith("assets/fonts")]
emitted.append(write("media-assets.manifest.json", {
    "schemaVersion": "1.0",
    "boundary": "Hash-and-boundary records only; binaries excluded from the public-safe package.",
    "assets": media_assets,
}))

# -------------------------------------------------------------- voice recipes —
d_start = master.index("# Appendix D — Reference-only Thai voice recipe")
d_end = master.index("# Appendix E — Deterministic Build Kit")
emitted.append(write("voice-recipes.md",
    "<!-- Generated package copy — VERBATIM extraction of Appendix D from the authoring master\n"
    f"     ({RELEASE['authoringRevision']}); the master remains the authority. -->\n\n"
    + master[d_start:d_end].rstrip() + "\n"))

emitted.append(write("thai-voice-fixtures-v0.8.7.json", {
    "schemaVersion": "1.0",
    "status": "not_regenerated_source_external",
    "boundary": "The v0.8.7 Thai voice fixture set is frozen in the v0.8.7 package, which is not "
                "part of this repository. This record preserves the package slot and the source "
                "boundary without fabricating fixture content. Current Thai voice authority is "
                "Appendix D (voice-recipes.md in this package); rendered Thai display-leading "
                "stress evidence for this release is qa/v0.9.0-thai-leading.json.",
}))

# -------------------------------------------------------------- rule ledgers —
v089 = read(V089)
v089_ids = rule_ids_of(v089)
renames = {"SEARCH-01": "INTERNAL-SEARCH-01"}
ledger_rows = []
for rid in v089_ids:
    if rid in renames:
        ledger_rows.append({"fromRule": f"[{rid}]", "toRule": f"[{renames[rid]}]",
                            "disposition": "superseded", "predicate": "always",
                            "acceptance": "automated",
                            "reason": "renamed §7.6; old ID a deprecated alias for one release"})
    else:
        to = f"[{rid}]" if not rid.startswith("CORE") else rid
        ledger_rows.append({"fromRule": f"[{rid}]" if not rid.startswith("CORE") else rid,
                            "toRule": to, "disposition": "retained",
                            "predicate": "per owning profile/pack in the v0.9.0 master",
                            "acceptance": "both"})
emitted.append(write("v0.8.9-to-v0.9.0-rule-ledger.json", {
    "schemaVersion": "1.0",
    "source": {
        "readFrom": "assets/downloads/landometer-design-system-v0.8.9.md (baseline authoring master)",
        "readSha256": sha256(V089),
        "canonicalPredecessorSha256": "827f4d85381f980dba43c319cd74762e2745a522232936630fa65ed4b54679d6",
        "note": "The repository carries the baseline authoring master variant (recorded in the "
                "skill release-lock as lineage.baselineAuthoringMaster); the canonical predecessor "
                "document lives in the project store at the canonical sha above. Rule IDs are "
                "identical across the two variants.",
    },
    "authority": "v0.9.0 Supersedes clause: the complete v0.8.9 rule set is retained in place; "
                 "no v0.8.9 rule is removed; the only rename is [SEARCH-01] -> [INTERNAL-SEARCH-01].",
    "ruleCount": len(ledger_rows),
    "rules": ledger_rows,
}))
for name, note in [
    ("v0.8.7-to-v0.8.9-rule-ledger.json", "frozen in the v0.8.9 package"),
    ("v0.8.6-to-v0.8.7-rule-ledger.json", "frozen in the v0.8.7 package"),
    ("v0.8.5-to-v0.8.6-rule-ledger.json", "frozen in the v0.8.6 package"),
]:
    emitted.append(write(name, {
        "schemaVersion": "1.0", "status": "not_regenerated_source_external",
        "boundary": f"Historical migration ledger {note}; its source masters are not part of this "
                    "repository, so it is preserved as a boundary record rather than fabricated. "
                    "It remains historical evidence per the packaging rules.",
    }))

# ------------------------------------------------------------------- adapters —
emitted.append(write("adapters/README.md",
    "# Adapters — boundary record\n\n"
    f"No framework adapters are generated in package {PACKAGE_REVISION}. The canonical web "
    "implementation path is the Deterministic Build Kit (build-kit/, copied verbatim per E0 "
    "rule 1). An adapter added later must be generated into this directory by a normative "
    "release and recorded in the package manifest; nothing here is hand-authored per build.\n"))

print(f"part 1 emitted {len(emitted)} files")
json.dump({"emitted": emitted, "release": RELEASE, "scRows": len(sc_rows),
           "v089RuleIds": len(v089_ids), "v090RuleIds": len(v090_rule_ids)},
          open("/tmp/mp-part1.json", "w"), indent=1)

# ============================== PART 2 — schemas ==============================
S = "https://json-schema.org/draft/2020-12/schema"
def obj(props=None, req=None, extra=True, **kw):
    o = {"type": "object"}
    if props: o["properties"] = props
    if req: o["required"] = req
    if extra is False: o["additionalProperties"] = False
    o.update(kw); return o
def s(t, **kw): d = {"type": t}; d.update(kw); return d

file_record = obj({"path": s("string"), "bytes": s("integer", minimum=0),
                   "sha256": s("string", pattern="^[0-9a-f]{64}$")},
                  ["path"])

build_card_schema = {
    "$schema": S, "$id": "https://montri-th.github.io/Landometer/machine/v0.9.0/build-card.schema.json",
    "title": "Landometer Build Card 0.9.0",
    "description": "Validates the shipped Build Card projection (build-card.v0.9.0.yml). "
                   "Structural + identity validation; §9.4 cross-field/parity gates and manual "
                   "reviews remain normative on top of this schema.",
    **obj({"landometerBuild": obj({
        "dsVersion": {"const": "0.9.0"},
        "authoringRevision": s("string", pattern="^v0\\.9\\.0-r\\d+$"),
        "schemas": obj({"buildCard": {"const": "0.9.0"},
                        "manifest": {"enum": ["2.1", 2.1]},
                        "tokens": {"const": 6}}, ["buildCard", "manifest", "tokens"]),
        "colorDelivery": obj({
            "registryId": s("string", pattern="^color-srgb-\\d{2}$"),
            "registryPath": s("string"),
            "tokenRegistry": obj({"path": s("string"), "sha256": s("string", pattern="^[0-9a-f]{64}$")}, ["path", "sha256"]),
            "scaleRegistry": obj({"path": s("string"), "sha256": s("string", pattern="^[0-9a-f]{64}$")}, ["path", "sha256"]),
            "immutableColorBaseline": file_record,
            "currentArtifactBuild": obj({"id": s("string", pattern="^ui-\\d{8}-\\d{2}$"),
                                          "path": s("string"), "sha256": s("string")}, ["id", "path"]),
            "previousArtifactBuild": obj(),
        }, ["registryId", "tokenRegistry", "scaleRegistry", "immutableColorBaseline", "currentArtifactBuild"]),
        "deliveryIdentity": obj({
            "colorSetId": s("string", pattern="^color-srgb-\\d{2}$"),
            "artifactBuildId": s("string", pattern="^ui-\\d{8}-\\d{2}$"),
            "tokenRegistry": obj(), "scaleRegistry": obj(),
            "artifactHashes": s("array", items=obj({"channel": s("string"), "path": s("string"),
                                                     "bytes": s("integer"), "sha256": s("string"),
                                                     "colorSetId": s("string"), "artifactBuildId": s("string")},
                                                    ["channel", "path", "sha256"])),
        }, ["colorSetId", "artifactBuildId", "artifactHashes"]),
        "artifact": obj({"name": s("string"), "product": s("string"), "profile": s("string"),
                          "pageKind": s("string"), "pageKindSourceRef": s("string")},
                         ["name", "product", "profile", "pageKind"]),
        "publication": obj(), "audience": obj(), "voice": obj(), "experience": obj(),
        "composition": obj(), "brandAlignment": obj(), "proof": obj(), "theme": obj(),
        "localeControls": obj(), "motion": obj(), "capabilities": obj(),
        "fixtureCapabilities": obj(), "referenceFixtures": s("array"),
        "privacy": obj(), "telemetry": obj(), "network": obj(),
        "assets": obj(), "artifactIdentityEvidence": obj(), "referenceDocuments": s("array"), "qa": obj(),
    }, ["dsVersion", "authoringRevision", "schemas", "colorDelivery", "deliveryIdentity",
        "artifact", "publication", "voice", "experience", "composition", "capabilities",
        "network", "privacy", "qa"])}, ["landometerBuild"]),
}
emitted.append(write("build-card.schema.json", build_card_schema))

connector_record = obj({
    "id": s("string"),
    "from": s("string"), "to": s("string"),
    "relationship": s("string", minLength=1,
                      description="Named real relationship the connector encodes; decorative lines are prohibited"),
    "styleMeaning": s("string"), "arrowMeaning": s("string"),
    "mobileBehavior": s("string"),
    "accessibleAlternative": s("string"),
    "deletionResult": s("string",
                        description="What breaks if the connector is deleted; empty means the connector should not exist"),
}, ["relationship"])
connector_schema = {"$schema": S,
    "$id": "https://montri-th.github.io/Landometer/machine/v0.9.0/connector.schema.json",
    "title": "Landometer connector record",
    "description": "Connectors encode a real relationship or they do not render "
                   "(edge-rail/bracket-spine decoration is prohibited by owner amendment).",
    **obj({"connectors": s("array", items=connector_record)}, ["connectors"])}
emitted.append(write("connector.schema.json", connector_schema))

growth_schema = {"$schema": S,
    "$id": "https://montri-th.github.io/Landometer/machine/v0.9.0/growth.schema.json",
    "title": "Landometer growth records — [HOOK-01] / [XPRODUCT-01] / [TOOL-HANDOFF-01] / [ABUSE-INTEGRITY-01]",
    "description": "Honest growth surfaces: declared loops with every phase field non-empty, or an "
                   "explicit one-line disabledReason. LOI/experiments/test sites never count as "
                   "external users; handoff is never labelled a network effect.",
    **obj({
        "hookLoop": obj({"enabled": s("boolean"),
                          "matchedIntent": s("string"), "trigger": s("string"),
                          "action": s("string"), "reward": s("string"), "investment": s("string"),
                          "nextTrigger": s("string"), "disabledReason": s("string")},
                         ["enabled"]),
        "crossProductPaths": s("array", items=obj({"fromProduct": s("string"), "toProduct": s("string"),
                                                    "userBenefit": s("string"), "path": s("string")},
                                                   ["fromProduct", "toProduct", "userBenefit"])),
        "toolHandoffs": s("array", items=obj({"intent": s("string"), "destination": s("string"),
                                               "returnPath": s("string"), "benefit": s("string")},
                                              ["intent", "destination"])),
        "abuseIntegrity": obj({"contracts": s("array")},
                              description="Gated growth mechanics stay at ungated fallback until contracts exist"),
    })}
emitted.append(write("growth.schema.json", growth_schema))

web_discovery_schema = {"$schema": S,
    "$id": "https://montri-th.github.io/Landometer/machine/v0.9.0/web-discovery.schema.json",
    "title": "Landometer web discovery record — [WEB-DISCOVERY-01]",
    **obj({
        "status": s("string", enum=["intentionally_absent_internal", "declared", "verified"]),
        "indexable": s("boolean"),
        "canonicalUrl": s("string"),
        "discoverySet": obj({"title": s("boolean"), "canonical": s("boolean"), "robots": s("boolean"),
                              "openGraph": s("boolean"), "jsonLd": s("boolean"), "sitemap": s("boolean"),
                              "favicon": s("boolean")}),
        "observations": s("array", items=s("string")),
        "llmsTxt": obj({"present": s("boolean"), "boundary": s("string")}),
    }, ["status", "indexable"])}
emitted.append(write("web-discovery.schema.json", web_discovery_schema))

social_previews_schema = {"$schema": S,
    "$id": "https://montri-th.github.io/Landometer/machine/v0.9.0/social-previews.schema.json",
    "title": "Landometer social preview record",
    "description": "Share previews are destination-tested against the real reachable artifact; "
                   "public metadata contains only public-safe assets/claims with permission.",
    **obj({
        "status": s("string", enum=["not_applicable_no_promoted_destination", "declared", "destination_tested"]),
        "destinations": s("array", items=obj({"platform": s("string"), "canvasPx": s("string"),
                                               "tested": s("boolean"), "evidence": s("string")},
                                              ["platform"])),
        "canonicalUrl": s("string"),
    }, ["status"])}
emitted.append(write("social-previews.schema.json", social_previews_schema))

manifest_schema = {"$schema": S,
    "$id": "https://montri-th.github.io/Landometer/machine/v0.9.0/manifest.schema.json",
    "title": "Landometer Site Manifest 2.1",
    "description": "Validates the shipped Manifest 2.1 instance. manifest.html.match fields "
                   "(preflight.yml) must additionally agree with the rendered DOM; that parity is "
                   "enforced by generated preflight and verify-live, not by this schema alone.",
    **obj({
        "artifact": obj({
            "id": s("string"), "version": {"const": "0.9.0"},
            "buildCardVersion": {"const": "0.9.0"}, "manifestVersion": {"const": "2.1"},
            "tokenSchemaVersion": {"const": 6},
            "product": s("string"), "profile": s("string"),
            "pageKind": s("string"), "pageKindSourceRef": s("string"),
            "delivery": s("string"), "language": s("string"),
            "evidenceStatus": s("string"), "visibility": s("string"),
            "indexable": s("boolean"), "canonicalUrl": s("string"),
            "machineValidation": s("string", enum=["pending", "passed", "failed"]),
            "artifactBuildId": s("string", pattern="^ui-\\d{8}-\\d{2}$"),
        }, ["id", "version", "buildCardVersion", "manifestVersion", "tokenSchemaVersion",
            "product", "profile", "pageKind", "delivery", "language", "evidenceStatus",
            "visibility", "indexable", "canonicalUrl", "machineValidation", "artifactBuildId"]),
        "colorDelivery": obj({
            "registryId": s("string", pattern="^color-srgb-\\d{2}$"),
            "immutableColorBaseline": obj(), "currentArtifactBuild": obj(),
        }, ["registryId", "immutableColorBaseline", "currentArtifactBuild"]),
        "experience": obj(), "composition": obj({"connectors": s("array")}),
        "capabilities": obj(), "network": obj({"mode": s("string")}, ["mode"]),
        "identity": obj(), "fixtureCapabilities": obj(),
        "governedObject": obj(), "referenceFixtures": s("array"),
        "assets": s("array", items=file_record),
        "publication": obj(), "qa": obj(), "selfCheck": obj(),
    }, ["artifact", "colorDelivery", "experience", "composition", "capabilities",
        "network", "identity", "governedObject", "assets", "publication", "qa", "selfCheck"])}
emitted.append(write("manifest.schema.json", manifest_schema))

print(f"part 2 (schemas) — total emitted {len(emitted)}")

# ========================= PART 3 — profiles / packs / core ==================
MOTION = {"designsystem.adoption": "guided", "brand.public": "guided (action-bearing) / export_safe (static)",
          "citymeter.dataset": "state_led", "citywiki.public": "restrained", "product.app": "state_led",
          "citychat.app": "state_led", "ijji.app": "guided", "data.explainer": "guided",
          "campaign.public": "expressive_short", "social.static": "export_safe", "presentation": "export_safe"}
AHA_BUDGET = {"brand.public": {"maxActions": "0", "target": "opening proof visible at first paint; usable within LCP target"},
              "citywiki.public": {"maxActions": "0", "target": "one-minute answer visible immediately (precomputed)"},
              "citymeter.dataset": {"maxActions": "0-1 (precomputed) / 1 + essential scope (live)", "target": "<=3s; live shows honest stage/time"},
              "citychat.app": {"maxActions": "up to 3 short essential inputs", "target": "<=10s"},
              "ijji.app": {"maxActions": "up to 3 short essential inputs", "target": "<=15s"},
              "designsystem.adoption": {"maxActions": "one start action", "target": "role benefit within 30s"},
              "campaign.public": {"maxActions": "0-1", "target": "promised object/result in first viewport"},
              "social.static": {"maxActions": "0-1 (destination)", "target": "message understood without zoom"}}
PROFILES = [
  ("designsystem.adoption", "help every role believe, try, align, and adopt",
   "role-specific before/after within 30 seconds", "human, bold, encouraging, unmistakably Landometer",
   "approved photo/work proof"),
  ("brand.public", "understand Landometer fit and find the right proof/path",
   "opening proof object at first paint; inspectable detail may continue in the second viewport",
   "human, proof-first, confident", "documentary/brand proof; share only when separately enabled"),
  ("citymeter.dataset", "inspect a spatial signal and decide what to check/do",
   "selected place/result with source and limitation", "map/data-first, measurable",
   "analyticalEvidence: true; map/dataviz when used"),
  ("citywiki.public", "understand a place quickly and confidently", "sourced one-minute answer",
   "editorial, warm, boundary-aware", "analyticalEvidence: true"),
  ("product.app", "complete a task and understand state/recovery", "truthful result or status receipt",
   "compact, task-led, state-complete", "capability-dependent"),
  ("citychat.app", "report, verify, prioritize, coordinate, and follow up safely",
   "acknowledgement, current status/route, and next step", "calm, mobile-first, consent- and status-led",
   "persistence/effect packs when enabled"),
  ("ijji.app", "diagnose a local-business problem and start achievable progress",
   "diagnosis plus a credible 7-day direction", "friendly, low-jargon, progress- and outcome-aware",
   "learning/persistence when enabled"),
  ("data.explainer", "understand a decision and evidence", "30-second answer plus primary proof",
   "answer-first, readable", "analyticalEvidence: true; dataviz/map when used"),
  ("campaign.public", "understand one message and take one action", "promised proof in first viewport",
   "expressive-short", "share only after proof and hosting"),
  ("social.static", "communicate one point and send to one destination", "message is understood without zoom",
   "platform-safe, concise", "destination journey only"),
  ("presentation", "follow a narrative and make/understand a decision", "answer and proof early in deck",
   "presenter-readable", "evidence as needed"),
]
for pid, job, aha, character, trigger in PROFILES:
    rec = {"schemaVersion": "1.0", "id": pid, "ruleId": "[PROFILE-01]",
           "oneJob": job, "firstAha": aha, "character": character, "impliedTrigger": trigger,
           "motionIntensity": MOTION[pid],
           "ahaBudget": AHA_BUDGET.get(pid, {"maxActions": "per §8.1", "target": "per §8.1"}),
           "delivery": {"rejectsStaticExport": pid in {"designsystem.adoption", "brand.public",
                                                        "product.app", "citychat.app", "ijji.app"},
                        "requiresStaticExport": pid == "social.static"},
           "evidenceBranch": ("non-none proof required" if pid in
                              {"designsystem.adoption", "brand.public", "citymeter.dataset", "citywiki.public",
                               "product.app", "citychat.app", "ijji.app"} else "per capability declarations"),
           "source": {"path": "assets/downloads/landometer-design-system-v0.9.0.md",
                      "sections": ["§8 [PROFILE-01]", "§8.1 [AHA-01]", "Build Card gates §2"]},
           "boundary": "Exactly one profile loads per artifact; this record is a projection — "
                       "the master's profile clauses remain the authority."}
    emitted.append(write(f"profiles/{pid}.json", rec))

pack_headers = re.findall(r"^### (7\.\d+A?) (.+?) `\[([A-Z-]+\d{2})\]`", master, re.M)
PACK_TRIGGERS = {
  "DATA-01": "analyticalEvidence: true", "DATAVIZ-01": "dataVisualization: true", "MAP-01": "map: true",
  "SHARE-01": "share: true (network mode above none/private)", "ABUSE-INTEGRITY-01": "gated growth mechanics enabled",
  "COCREATE-01": "co-creation network mode", "INTERNAL-SEARCH-01": "search: true (formerly [SEARCH-01])",
  "PUB-01": "public visibility / publication states in play", "EFFECT-01": "persistence or external side effect",
  "LEARN-01": "voluntary investment / transparent learning enabled", "DELIVERY-01": "always for delivered artifacts",
  "AUTH-01": "authentication: true", "CONTEXT-01": "contextDiscovery: true",
  "AGENT-OUT-01": "agentReadable or boundedAgentAction", "REFERENCE-01": "fullLivingReference: true",
  "TELEMETRY-01": "telemetry declared", "HOOK-01": "hook.enabled declared (true loads the loop; false records disabledReason)",
  "XPRODUCT-01": "cross-product journey rendered", "WEB-DISCOVERY-01": "public indexable artifact or discovery set declared",
  "TOOL-HANDOFF-01": "free-tool handoff rendered",
}
for sec, title, rid in pack_headers:
    emitted.append(write(f"packs/{rid}.json", {
        "schemaVersion": "1.0", "id": f"[{rid}]", "section": f"§{sec}", "title": title.strip(),
        "triggeredWhen": PACK_TRIGGERS.get(rid, "see section"),
        "loadRule": "Trigger Packs load only the matching branch (§7); unloaded packs never become visible UI",
        "source": {"path": "assets/downloads/landometer-design-system-v0.9.0.md"},
        "boundary": "Machine pointer record; the master section is the authority for the pack's requirements."}))

emitted.append(write("page-kinds.json", {
    "schemaVersion": "1.0",
    "authority": "pageKindSourceRef resolves to the applicable approved Product Brief/Statement, a "
                 "named profile rule in the master, or this generated registry; agents MUST NOT mint "
                 "a page kind or use a utility label to bypass [FLOW-03].",
    "kinds": [
        {"id": "design-identity-playground", "profile": "designsystem.adoption",
         "actionPolicy": "real first-viewport action required ([FLOW-03])",
         "currentArtifact": manifest["artifact"].get("pageKind", "")},
        {"id": "brand-home-solution-product-proof-careers", "profile": "brand.public",
         "actionPolicy": "real first-viewport action required"},
        {"id": "brand-about-team", "profile": "brand.public", "actionPolicy": "none_deliberate allowed"},
        {"id": "legal", "profile": "brand.public", "actionPolicy": "none_deliberate allowed"},
        {"id": "privacy", "profile": "brand.public", "actionPolicy": "none_deliberate allowed"},
        {"id": "accessibility", "profile": "brand.public", "actionPolicy": "none_deliberate allowed"},
        {"id": "utility-reference", "profile": "brand.public", "actionPolicy": "none_deliberate allowed"},
        {"id": "campaign-landing", "profile": "campaign.public",
         "actionPolicy": "one visible CTA/destination; static export uses declared canvas"},
        {"id": "social-static-asset", "profile": "social.static",
         "actionPolicy": "destination journey only; no simulated control"},
        {"id": "presentation-deck", "profile": "presentation", "actionPolicy": "evidence as needed"},
        {"id": "product-task-surface", "profile": "product.app|citychat.app|ijji.app|citymeter.dataset|citywiki.public|data.explainer",
         "actionPolicy": "per product profile; product briefs own product-specific kinds"},
    ]}))

core = f"""# Landometer DS v0.9.0 — always-on shared Core (machine projection)

Package {PACKAGE_REVISION} · authoring {RELEASE['authoringRevision']} · Color Set {RELEASE['colorSetId']} ·
kit {RELEASE['kitVersion']} · Token Schema 6 · Manifest 2.1. This Core is a generated projection for
loaders (target <=6,900 words; this one is far under). Rule text lives in the authoring master —
every ID below maps back to it; nothing here overrides it.

## Identity and truth (P0 — never waived)
- Cultural activation, verbatim: **Let us cultivate our city with data.** (MBB v0.5.3 §1.1).
- Root markers required: data-ds-version / data-color-registry / data-artifact-build / data-build-channel (SC-01).
- Evidence labels on every claim path: Observed fact · Benchmark interpretation (universe + peer size) ·
  Owner-stated · Inference · Hypothesis · Project evidence (MBB §3.7).
- Never upgrade: partial→complete, modelled→observed, planned→available, sent→received,
  handoff→network effect, discovery→evidence, LOI→contract, prototype→final result.
- locale_id / venue_id are the only join keys; names are for search. No cross-locale aggregation
  without approved geometry + method. SRI is not revenue; 7x24 heatmap is qualitative daypart,
  not footfall; ratings are popularity proxy, not sales.

## Determinism
- Copy the Build Kit verbatim (E0 rule 1): build-kit/lds-tokens.css, lds-base.css, skeleton.html.
  Editing kit bytes in a build is token drift (CORE-06, [TOKEN-01]).
- One Build Card per artifact; empty identity/experience fields stop the build (§2).
- Run [SELFCHECK-01] (23 binary items; self-check.map.json) before delivery; record exceptions
  per item, never silently.
- Identity rule: any governed colour/gradient/token-source/scale-source change mints a new
  Color Set ID; a UI-only change mints a new append-only artifact-build ID; baselines are never
  rewritten (registry `mintedWithArtifactBuild`).

## Visual and interaction spine
- Two-shape actions [BTN-GEOM-01]: capsule (pill, >= --space-5 inline padding, kit anatomy
  inline-flex/center/gap --space-2) or 44px circle; icon centres with label (SC-21/SC-23).
- Governed atmosphere gradients only — exact recipes via surface-recipes.json; purple/brown
  banned windows in preflight.yml [VIS-04]; retired values never render (SC-17).
- Quiet is a perceptual attention condition [SPACE-01]; connectors only encode real
  relationships (connector.schema.json); no edge rails/bracket spines.
- Icons: Material Symbols Rounded, locked axes, self-hosted subset [ICON-01] (SC-19).
- Motion: one Riddim signature [MOTION-01]; entrance on approach per [REVEAL-01] —
  reveal 640ms / stagger 120ms capped 600ms / rise 20px; lands once; never withholds reached
  content; reduced-motion and no-JS get final state (SC-22).
- Enumerations in bounded containers fold past six rows per [CONTAINER-FIT-01] (SC-20).
- Disclosure: answer first, evidence one interaction deep [DISCLOSURE-01]; no caution prose in
  first views; media-first.

## Language
- Thai written from meaning and evidence, never translated sentence structure; Appendix D recipe
  (voice-recipes.md). Script-aware technical type: JetBrains Mono 400 + IBM Plex Sans Thai 400
  (102% size-adjust); Bai Jamjuree body.

## Loading
- Exactly one profile (profiles/*.json) + only triggered packs (packs/*.json) + referenced token
  rows; unloaded material never becomes visible UI.
- Outputs begin machineValidation: pending; passed only after generated schemas, recipes, rule
  mappings, preflight, exact package revision, and every applicable manual gate validate the
  artifact (§9.7). Package availability alone is never a pass.
"""
emitted.append(write("core.md", core))

print(f"part 3 — total emitted {len(emitted)} (packs: {len(pack_headers)})")

# ==================== PART 4 — fingerprint + package manifest ================
# True sources only — site-manifest and build-card are generated projections (validated by the
# package schemas instead); hashing them here would create a manifest<->package cycle.
fingerprint_sources = [
    "index.html",
    "assets/downloads/landometer-design-system-v0.9.0.md",
    "assets/downloads/landometer-design-system-v0.8.9.md",
    "assets/data/color-delivery.v0.9.0.json",
    "assets/data/tokens.json",
    "assets/data/scales.json",
    "font-assets.manifest.json",
]
source_fingerprint = [{"path": p, "bytes": os.path.getsize(os.path.join(DEP, p)),
                       "sha256": sha256(os.path.join(DEP, p))} for p in fingerprint_sources]

inventory = []
for rel in sorted(set(emitted)):
    p = os.path.join(OUT, rel)
    inventory.append({"path": rel, "bytes": os.path.getsize(p), "sha256": sha256(p)})

package_manifest = {
    "schemaVersion": "1.0",
    "id": "landometer-design-system-machine-package",
    "dsVersion": "0.9.0",
    "packageRevision": PACKAGE_REVISION,
    "generatedAtAuthoringRevision": RELEASE["authoringRevision"],
    "colorSetId": RELEASE["colorSetId"],
    "artifactBuildId": RELEASE["artifactBuildId"],
    "kitVersion": RELEASE["kitVersion"],
    "manifestVersion": "2.1",
    "tokenSchemaVersion": 6,
    "generator": "tools/generate-machine-package.py",
    "validator": "tools/validate-machine-package.mjs",
    "validationReport": "validation-report.json",
    "releaseLock": "skill/apply-landometer-design-system-v0-9-0/references/release-lock.json",
    "sourceFingerprint": source_fingerprint,
    "files": inventory,
    "boundaries": [
        "Public-safe: excludes logo, photograph, poster, font, PDF, and other protected source binaries; "
        "identity/media/font manifests record exact hashes and use boundaries instead.",
        "Package-level validation means the specification, schemas, mappings, fixtures, approvals, and "
        "hashes are internally consistent — it never certifies a downstream artifact's production QA.",
        "A downstream artifact begins at machineValidation: pending and earns passed only from its own "
        "applicable generated preflight and manual evidence.",
        "Historical rule ledgers before v0.8.9->v0.9.0 and the v0.8.7 Thai voice fixtures are preserved "
        "as boundary records; their sources are frozen in their own package versions outside this repository.",
    ],
    "openItems": [
        "machineValidation for the shipped playground remains pending: manual gates in "
        "qa/v0.9.0-manual-gates.md are open.",
        "Formal identity/media approvals beyond the recorded assets remain approval_missing.",
    ],
}
write("package.json", package_manifest)
sums = "\n".join(f"{f['sha256']}  {f['path']}" for f in inventory)
pkg_sha = hashlib.sha256((json.dumps(package_manifest, ensure_ascii=False, indent=2) + "\n").encode()).hexdigest()
write("SHA256SUMS.txt", sums + f"\n{pkg_sha}  package.json\n")
print(f"package {PACKAGE_REVISION}: {len(inventory)} files + package.json + SHA256SUMS.txt")
