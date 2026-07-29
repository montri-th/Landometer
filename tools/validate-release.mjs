import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../deployment");
const errors = [];
const checks = [];

function pass(condition, message) {
  checks.push({ message, passed: Boolean(condition) });
  if (!condition) errors.push(message);
}

function text(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function json(path) {
  return JSON.parse(text(path));
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
}

function elementsWithClass(source, className) {
  return [...source.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)]
    .filter(([, , attributes]) => {
      const classAttribute = attributes.match(/\bclass="([^"]*)"/i)?.[1] ?? "";
      return classAttribute.split(/\s+/).includes(className);
    })
    .map(match => match[0]);
}

function countClass(source, className) {
  return elementsWithClass(source, className).length;
}

function attributeValue(element, attributeName) {
  const match = element.match(
    new RegExp(
      `\\b${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
      "i",
    ),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function openTagById(source, tagName, id) {
  return (
    source.match(
      new RegExp(
        `<${tagName}\\b(?=[^>]*\\bid=(?:"${id}"|'${id}'))[^>]*>`,
        "i",
      ),
    )?.[0] ?? ""
  );
}

function elementById(source, tagName, id) {
  return (
    source.match(
      new RegExp(
        `<${tagName}\\b(?=[^>]*\\bid=(?:"${id}"|'${id}'))[^>]*>[\\s\\S]*?<\\/${tagName}>`,
        "i",
      ),
    )?.[0] ?? ""
  );
}

function cssRules(source) {
  const styles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
    .map(match => match[1])
    .join("\n");
  return [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .map(([, selector, declarations]) => ({
      selector: selector.trim(),
      declarations
    }));
}

const html = text("index.html");
const standaloneHtml = text("landometer-design-system-v0.8.8-standalone.html");
const manifest = json("site-manifest.v0.8.8.json");
const inventory = json("control-inventory.v0.8.8.json");
const buildCard = text("build-card.v0.8.8.yml");
const fontManifest = json("font-assets.manifest.json");
const implementationNotes = text("implementation-notes.v0.8.8.md");
const machineDiscoveryAid = text("llms.txt");
const robotsRecord = text("robots.txt");

pass(/data-ds-version="0\.8\.8"/.test(html), "HTML exposes Design System 0.8.8");
pass(/data-build-card-version="0\.8\.8"/.test(html), "HTML exposes Build Card 0.8.8");
pass(/data-manifest-version="2\.0"/.test(html), "HTML exposes Manifest 2.0");
pass(/data-token-schema-version="6"/.test(html), "HTML exposes Token Schema 6");
pass(/data-ds-profile="brand\.public"/.test(html), "HTML exposes the brand.public profile");
pass(/data-delivery-mode="internal_demo"/.test(html), "HTML exposes the internal-demo delivery boundary");
pass(/data-full-living-reference="false"/.test(html), "Full Living Reference remains disabled");
pass(/data-evidence-status="source_limited"/.test(html), "HTML preserves source_limited status");
pass(/data-visibility="public"/.test(html), "HTML visibility enum matches the Build Card and manifest");
pass(/data-machine-validation="pending"/.test(html), "HTML preserves pending machine validation");
pass(/noindex,nofollow,noarchive/.test(html), "HTML preserves noindex metadata");

pass(manifest.artifact.version === "0.8.8", "Manifest version is 0.8.8");
pass(manifest.artifact.buildCardVersion === "0.8.8", "Manifest Build Card version is 0.8.8");
pass(manifest.artifact.manifestVersion === "2.0", "Manifest schema is 2.0");
pass(manifest.artifact.tokenSchemaVersion === 6, "Manifest token schema is 6");
pass(manifest.artifact.evidenceStatus === "source_limited", "Manifest preserves source_limited status");
pass(manifest.artifact.indexable === false, "Manifest preserves noindex state");
pass(manifest.artifact.machineValidation === "pending", "Manifest preserves pending validation");
pass(manifest.artifact.fullLivingReference === false, "Manifest keeps Full Living Reference disabled");
pass(manifest.artifact.profile === "brand.public", "Manifest selects the brand.public profile");
pass(manifest.artifact.delivery === "internal_demo", "Manifest preserves internal-demo delivery");
pass(manifest.artifact.deliveryConformance === "not_claimed", "Public projection does not claim internal-demo delivery conformance");
pass(manifest.artifact.deliveryVisibilityMismatch.includes("public GitHub Pages"), "Delivery and visibility mismatch is recorded explicitly");
pass(manifest.publication.robots === "noindex,nofollow,noarchive", "Manifest robots policy matches the HTML page");
pass(manifest.publication.indexPolicyScope.startsWith("html_page_only"), "Manifest limits noindex policy to the HTML page");
pass(manifest.publication.robotsFile?.authority === "project_path_non_authoritative", "Manifest records the project-path robots limitation");
pass(manifest.roleRegistry.status === "not_applicable", "Role registry is not claimed for the brand.public profile");
pass(Array.isArray(manifest.composition.connectors) && manifest.composition.connectors.length === 0, "No semantic connector is claimed");

for (const capability of [
  "motionEnhancement",
  "search",
  "fullLivingReference",
  "share",
  "agentReadable",
  "boundedAgentAction",
  "persistence",
  "authentication",
  "externalSideEffect",
  "map",
  "telemetry"
]) {
  pass(manifest.capabilities[capability] === false, `Capability ${capability} remains disabled`);
}
pass(manifest.capabilities.contextDiscovery === true, "Explicit user-triggered contextual discovery is declared");
pass(manifest.capabilities.externalNavigation === true, "Contextual discovery declares external navigation");
pass(
  manifest.capabilities.thirdPartyRequest ===
    "explicit_user_triggered_visible_query_plus_selected_route",
  "Third-party request is bounded to the visible confirmed query plus the explicitly selected route",
);
pass(manifest.capabilities.agentActionEffect === "none", "Manifest projects the no-agent-action effect");
pass(manifest.network?.mode === "reference_ready" && manifest.network?.action === "none", "Manifest projects the static network boundary");
pass(manifest.network?.networkAdvancesObjective === false, "Manifest does not claim a network objective");
pass(manifest.network?.recipientOutcome.startsWith("not_observed"), "Manifest does not claim an observed recipient outcome");
pass(manifest.capabilities.dataVisualization === true, "Synthetic data-visualization examples are declared");
pass(manifest.capabilities.analyticalEvidence === true, "Rendered dataviz is coupled to an explicit analytical-evidence fixture");
pass(manifest.fixtureCapabilities?.dataVisualization?.fixtureId === "DV-FIXTURE-0.1", "Dataviz capability is bounded to DV-FIXTURE-0.1");
pass(manifest.fixtureCapabilities?.dataVisualization?.mapResult === false, "Dataviz fixture does not claim a map result");
pass(manifest.fixtureCapabilities?.dataVisualization?.externalEffect === false, "Dataviz fixture has no external effect");
pass(manifest.fixtureCapabilities?.experiencePatterns?.fixtureId === "UX-FIXTURE-0.1", "Positive design examples are bounded to UX-FIXTURE-0.1");
pass(manifest.fixtureCapabilities?.experiencePatterns?.localStateOnly === true, "Experience examples remain local reference material");
pass(manifest.fixtureCapabilities?.motion?.fixtureId === "MOTION-FIXTURE-0.1", "Semantic motion is bounded to MOTION-FIXTURE-0.1");
pass(
  JSON.stringify(manifest.fixtureCapabilities?.motion?.sequence) === JSON.stringify(["object_immediate", "meaning_120ms", "action_320ms", "final"]),
  "Motion fixture records truthful settled timings"
);
pass(manifest.fixtureCapabilities?.motion?.reducedMotion === "final meaning immediately", "Motion fixture preserves immediate reduced-motion meaning");
pass(manifest.fixtureCapabilities?.motion?.externalEffect === false, "Motion fixture has no external effect");
pass(manifest.fixtureCapabilities?.recipientValue?.fixtureId === "NETWORK-FIXTURE-0.1", "Recipient-value ladder is bounded to NETWORK-FIXTURE-0.1");
pass(manifest.fixtureCapabilities?.recipientValue?.shareControl === false, "Recipient-value fixture renders no live share control");
pass(manifest.fixtureCapabilities?.recipientValue?.externalEffect === false, "Recipient-value fixture has no external effect");
pass(
  manifest.fixtureCapabilities?.recipientValue?.sequence?.includes("delivery_receipt") &&
    manifest.fixtureCapabilities?.recipientValue?.sequence?.includes("recipient_lands_same_object"),
  "Recipient-value fixture preserves delivery and landing as separate evidence stages"
);
pass(manifest.fixtureCapabilities?.contextualDiscovery?.fixtureId === "CONTEXT-FIXTURE-0.1", "Contextual discovery is bounded to CONTEXT-FIXTURE-0.1");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.resultStatus.startsWith("discovery_only"), "External search results remain discovery-only");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.activeFilter.includes("visible field label"), "Context fixture preserves the active visible field");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.thirdPartyRequest === true, "Context fixture declares the real third-party GET");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.remoteMutation === false, "Context fixture does not mutate a remote governed object");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.activeObject.includes("four CityMETER records"), "Context fixture declares four product-specific records");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.limitation.includes("no provenance"), "Context fixture keeps the source-provenance limitation explicit");
pass(manifest.fixtureCapabilities?.dataVisualization?.snapshotId === "CITYMETER-DV-SNAPSHOT-2026-07-29", "Dataviz declares the CityMETER snapshot fixture");
pass(manifest.fixtureCapabilities?.machineDiscovery?.status === "navigation_aid_only", "llms.txt remains a navigation aid only");
pass(manifest.fixtureCapabilities?.machineDiscovery?.agentReadableCapability === false, "Machine discovery does not claim agent-readable capability");
pass(manifest.fixtureCapabilities?.machineDiscovery?.boundedAgentAction === false, "Machine discovery grants no bounded agent action");
for (const fixtureId of [
  "DV-FIXTURE-0.1",
  "CITYMETER-DV-SNAPSHOT-2026-07-29",
  "UX-FIXTURE-0.1",
  "MOTION-FIXTURE-0.1",
  "NETWORK-FIXTURE-0.1",
  "CONTEXT-FIXTURE-0.1"
]) {
  pass(manifest.referenceFixtures?.some(fixture => fixture.id === fixtureId), `Reference fixture exists: ${fixtureId}`);
}
pass(
  manifest.referenceFixtures?.some(fixture =>
    fixture.id === "DV-FIXTURE-0.1" &&
    /not evidence about a real place/i.test(fixture.limitation)
  ),
  "Synthetic reference fixture has an explicit non-product evidence boundary"
);

pass(buildCard.includes("dsVersion: 0.8.8"), "Build Card version is 0.8.8");
pass(buildCard.includes("profile: brand.public"), "Build Card selects one brand.public profile");
pass(buildCard.includes("delivery: internal_demo"), "Build Card preserves internal-demo delivery");
pass(buildCard.includes("deliveryConformance: not_claimed"), "Build Card does not claim delivery conformance");
pass(buildCard.includes("deliveryVisibilityMismatch:"), "Build Card records the public-projection mismatch");
pass(buildCard.includes("fullLivingReference: false"), "Build Card keeps Full Living Reference disabled");
pass(buildCard.includes("search: false"), "Build Card keeps search disabled");
pass(buildCard.includes("machineValidation: pending"), "Build Card preserves pending validation");
pass(buildCard.includes("robots: noindex,nofollow,noarchive"), "Build Card robots policy matches the HTML page");
pass(buildCard.includes("indexPolicyScope: html_page_only"), "Build Card limits noindex policy to the HTML page");
pass(buildCard.includes("robotsFile: project-path non-authoritative"), "Build Card records the project-path robots limitation");
pass(buildCard.includes("ahaProvesPromise: true"), "Build Card ties the fixture AHA to the Brand Promise");
pass(buildCard.includes("connectors: []"), "Build Card declares no connector");
pass(buildCard.includes("dataVisualization: true"), "Build Card declares the synthetic dataviz examples");
pass(buildCard.includes("analyticalEvidence: true"), "Build Card couples dataviz to its reference fixture");
pass(buildCard.includes("fixtureId: DV-FIXTURE-0.1"), "Build Card names the synthetic dataviz fixture");
pass(buildCard.includes("snapshotId: CITYMETER-DV-SNAPSHOT-2026-07-29"), "Build Card names the CityMETER dataviz snapshot");
pass(buildCard.includes("fixtureId: UX-FIXTURE-0.1"), "Build Card names the positive-design reference fixture");
pass(buildCard.includes("fixtureId: MOTION-FIXTURE-0.1"), "Build Card names the semantic-motion reference fixture");
pass(buildCard.includes("fixtureId: NETWORK-FIXTURE-0.1"), "Build Card names the recipient-value reference fixture");
pass(buildCard.includes("fixtureId: CONTEXT-FIXTURE-0.1"), "Build Card names the contextual-discovery reference fixture");
pass(buildCard.includes("contextDiscovery: true"), "Build Card declares the explicit contextual-discovery action");
pass(
  buildCard.includes(
    "thirdPartyRequest: explicit_user_triggered_visible_query_plus_selected_route",
  ),
  "Build Card bounds the third-party request to the visible query plus selected route",
);
pass(
  JSON.stringify(manifest.fixtureCapabilities?.contextualDiscovery?.supportedModes) ===
    JSON.stringify(["source_search", "ai_synthesis"]) &&
    buildCard.includes("supportedModes: [source_search, ai_synthesis]"),
  "Manifest and Build Card distinguish source Search from AI synthesis",
);
pass(
  /not a source or evidence/i.test(
    manifest.fixtureCapabilities?.contextualDiscovery?.aiBoundary ?? "",
  ) &&
    /discovery_only/.test(
      manifest.fixtureCapabilities?.contextualDiscovery?.resultStatus ?? "",
    ),
  "Manifest keeps external AI synthesis discovery_only rather than evidence",
);
pass(
  /implementation detail/i.test(
    manifest.fixtureCapabilities?.contextualDiscovery?.providerRouting ?? "",
  ) &&
    /never silently switch/i.test(
      manifest.fixtureCapabilities?.contextualDiscovery?.fallback ?? "",
    ) &&
    implementationNotes.includes("https://www.google.com/ai"),
  "Provider routing stays implementation-specific with an explicit no-silent-switch fallback",
);
pass(buildCard.includes("agentReadable: false"), "Build Card does not claim agent-readable delivery");
pass(buildCard.includes("boundedAgentAction: false"), "Build Card grants no bounded agent action");
pass(buildCard.includes("shareControl: false"), "Build Card records that no live share control is rendered");
pass(buildCard.includes("delivery_receipt") && buildCard.includes("recipient_lands_same_object"), "Build Card preserves the complete recipient evidence ladder");
pass(buildCard.includes("recipientOutcome: not_observed"), "Build Card does not claim an observed recipient outcome");
pass(buildCard.includes("networkAdvancesObjective: false"), "Build Card does not claim a network objective");
pass(buildCard.includes("navigation aid only"), "Build Card preserves the llms.txt navigation-aid boundary");
pass(buildCard.includes("logoBackground: transparent_non_negotiable"), "Build Card makes the transparent logo background non-negotiable");
pass(buildCard.includes("releaseMetadataBackground: transparent"), "Build Card keeps release metadata transparent");
pass(buildCard.includes("single quiet icon button"), "Build Card records the one-button theme cycle");
pass(buildCard.includes("single quiet state button"), "Build Card records the one-button locale cycle");

pass((html.match(/<h1\b/g) || []).length === 1, "Page source contains exactly one H1");
pass(html.includes('aria-label="Let us cultivate our city."'), "Protected cultural invitation is exact");
pass(
  /<span class="hero-line">Let us<\/span><span class="hero-line">cultivate<\/span><span class="hero-line">our city\.<\/span>/.test(html),
  "Hero uses deliberate editorial line groups without mid-word breaks or an orphaned 'our'"
);
pass(html.includes("Measure What Matters. Make It Actionable."), "Protected Brand Promise is exact");
pass(html.includes("Clear") && html.includes("Grounded") && html.includes("Energetic"), "Brand DNA is present");
pass(html.includes("Brand Voice") && html.includes("Brand Visual"), "Voice and Visual lenses are present");
pass(html.includes("Land · Location · Living"), "Locale Insight covers Land, Location, and Living");
pass(html.includes("portfolio, methodology") && html.includes("product-architecture"), "Shared Locale Insight architecture boundary is present");
pass(html.includes("schema/release") && html.includes("compatible"), "Compatibility boundary is present");
pass(html.includes("partial ≠ complete") && html.includes("modelled ≠ observed") && html.includes("planned ≠ available"), "Truth-preserving handoff guards are present");
pass(html.includes("product-specific"), "Product-specific evidence boundary is explicit");
pass(html.includes("Implementation Library") && (html.match(/<details class="library-group"/g) || []).length === 7, "Seven progressive-disclosure implementation groups are present");
pass(html.includes("CityMETER") && html.includes("CityWiki") && html.includes("CityChat") && html.includes("ijji"), "Product-adaptation templates are present");
pass((html.match(/class="dataviz-pattern"/g) || []).length === 3, "Compare, Change, and Relationship dataviz examples are present");
pass((html.match(/class="dataviz-table"/g) || []).length === 3, "Every rendered dataviz example has a visible table alternative");
pass((html.match(/class="citymeter-chart-card"/g) || []).length === 9, "Nine CityMETER-derived dataviz treatments are present");
pass(html.includes("5,944.26 km²") && html.includes("TOYOTA") && html.includes("MERCEDES BENZ · 626"), "CityMETER public snapshot values are visibly represented");
pass((html.match(/class="opportunity-card"/g) || []).length === 15, "Fifteen positive opportunity sketches span foundations, components, and dataviz");
pass((html.match(/class="intent-case(?: is-rejected)?"/g) || []).length === 4, "Three positive Intent-to-AHA cases and one rejected case are present");
pass((html.match(/class="intent-case is-rejected"/g) || []).length === 1, "Exactly one rejected Intent-to-AHA case is present");
pass(html.includes("FOUNDATIONS IN ACTION · CREATIVE CONCEPT SKETCHES"), "Foundations expose creative application sketches");
pass(html.includes("four_component_ensembles") === false, "Internal manifest identifiers do not leak into reader-facing HTML");
pass(html.includes("Measured zero") && html.includes("No data"), "Dataviz distinguishes measured zero from no data");
pass(html.includes("Association does not establish cause"), "Relationship example does not imply causality");
pass(/data-data-visualization="fixtures_and_product_snapshots"/.test(html), "HTML distinguishes training fixtures from product snapshots");
pass(html.includes("TREATMENT SKETCH") && html.includes("do not claim the live product already conforms"), "Dataviz treatment sketches do not claim live-product conformance");

pass(!/Mission Lab|#7FA2F1|googleapis|gstatic|fonts\.google/i.test(html), "Forbidden legacy sub-brand, color, and font dependencies are absent");
pass(!/#[0-9a-f]{6}\b[^<]*(purple|violet|lavender|fuchsia)/i.test(html), "No forbidden purple-family token is declared");
pass(html.includes("#1D4497"), "Protected Brand Blue is exact");
pass(html.includes("linear-gradient(135deg, #C33F55 0%, #FF8A4C 52%, #F4C44E 100%)"), "Cultivate gradient stop order is exact");
pass(html.includes("linear-gradient(135deg, #147A9F 0%, #3BD3CB 52%, #3BD19B 100%)"), "Ground gradient stop order is exact");
pass(html.includes("linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)"), "Light Measure gradient is exact");
pass(html.includes("linear-gradient(135deg, #68C4E2 0%, #15919A 52%, #08756F 100%)"), "Dark Measure gradient is exact");
pass(
  /class="proof-preview has-brand-surface"/.test(html),
  "Try fixture owns its governed atmosphere independently of the selected inspection lens",
);
pass(
  !html.includes('classList.toggle("is-visual"') &&
    !html.includes(".proof-preview.is-visual"),
  "No Brand Visual-only class gate can flatten Brand DNA or Brand Voice surfaces",
);
pass(
  html.includes('.proof-preview.has-brand-surface[data-surface="measure"]') &&
    html.includes('.proof-preview.has-brand-surface[data-surface="ground"]') &&
    html.includes('.proof-preview.has-brand-surface[data-surface="cultivate"]') &&
    html.includes(".proof-preview.has-brand-surface .proof-meta"),
  "All three governed atmospheres carry one complete local foreground and metadata contract",
);
pass(
  html.includes('id="library-color"') &&
    html.includes('id="library-color-toggle"') &&
    (html.match(/class="color-route-card"/g) || []).length === 6,
  "First-class Color Library route exposes exactly six decision-first visual routes",
);
pass(
  html.includes("Brand</span>") &&
    html.includes("Interaction</span>") &&
    html.includes("Semantic</span>") &&
    html.includes("Atmosphere</span>") &&
    html.includes("Series</span>") &&
    html.includes("Scale</span>") &&
    html.includes("Map</span>") &&
    html.includes("Depth</span>"),
  "Color Library distinguishes all eight governed color jobs",
);
pass(
  html.includes('data-reveal-target="library-color-guide"') &&
    html.includes('data-reveal-target="complete-color-atlas"') &&
    html.includes('data-reveal-target="atlas-categorical-title"') &&
    html.includes('data-reveal-target="atlas-dataviz-title"'),
  "Color routes connect realistic examples, categorical guidance, quantitative classes, and the complete atlas",
);
pass(
  html.includes("Color alone stops at six") &&
    html.includes("add shape or pattern for 7–10") &&
    html.includes("above ten, group, filter, use small multiples, or use a table"),
  "Category-capacity guidance is visible before the exhaustive palette registry",
);
pass(
  html.includes("detailChain.unshift(ancestor)") &&
    html.includes("detailChain.forEach(details =>") &&
    html.includes("details.open = true"),
  "Deep color links open every closed ancestor disclosure before scrolling",
);
pass(
  html.includes('html[data-theme="dark"] .color-role-map span:first-child') &&
    !html.includes('[data-resolved-theme="dark"] .color-role-map'),
  "Dark color-role emphasis consumes the runtime theme state",
);
pass(
  html.includes("grid-template-columns: repeat(var(--route-class-count, 3), minmax(0, 1fr))") &&
    (html.match(/--route-class-count:3/g) || []).length === 2,
  "Sequential and diverging route previews fill exactly their three declared tracks",
);
pass(
  html.includes("revealTarget(target, true)") &&
    html.includes('focusTarget.setAttribute("tabindex", "-1")') &&
    html.includes("focusTarget?.focus({ preventScroll: true })"),
  "Deep color links move keyboard focus to the revealed target without reversing the scroll",
);

const atlasStartMarker = "<!-- COLOR_ATLAS_START -->";
const atlasEndMarker = "<!-- COLOR_ATLAS_END -->";
const atlasStart = html.indexOf(atlasStartMarker);
const atlasEnd = html.indexOf(atlasEndMarker);
const atlasMarkersValid = atlasStart >= 0 && atlasEnd > atlasStart;
const atlasHtml = atlasMarkersValid
  ? html.slice(atlasStart + atlasStartMarker.length, atlasEnd)
  : "";
pass(atlasMarkersValid, "Complete color atlas has one ordered generated-fragment boundary");
pass((html.match(/<!-- COLOR_ATLAS_START -->/g) || []).length === 1, "Complete color atlas has exactly one start marker");
pass((html.match(/<!-- COLOR_ATLAS_END -->/g) || []).length === 1, "Complete color atlas has exactly one end marker");
pass(
  html.includes('id="complete-color-atlas"') &&
    html.includes('id="complete-color-atlas-toggle"'),
  "Complete color atlas is available through one progressive-disclosure control"
);
pass(countClass(atlasHtml, "atlas-pair-card") === 17, "Color atlas contains exactly 17 foundation light/dark pairs");
pass(countClass(atlasHtml, "atlas-state-card") === 7, "Color atlas contains exactly seven semantic-state cards");
pass(
  countClass(atlasHtml, "atlas-gradient-card") === 5 &&
    countClass(atlasHtml, "atlas-gradient-card--shared") === 2 &&
    countClass(atlasHtml, "atlas-gradient-card--motif") === 3,
  "Color atlas contains exactly two shared and three motif gradient cards"
);
const productGradientCards = elementsWithClass(atlasHtml, "atlas-product-card");
pass(
  productGradientCards.length === 4 &&
    productGradientCards.every(card => /\bdata-scope="product-identity"/.test(card)),
  "Color atlas contains exactly four explicitly product-scoped gradient cards"
);
pass(countClass(atlasHtml, "atlas-gradient-theme") === 8, "Four product gradients expose exactly eight light/dark specimens");
pass(countClass(atlasHtml, "atlas-series-card") === 10, "Color atlas contains exactly ten categorical-series cards");
pass(countClass(atlasHtml, "atlas-scale-record") === 18, "Color atlas contains exactly 18 quantitative scale records");
pass(countClass(atlasHtml, "atlas-lut-cell") === 738, "Color atlas contains exactly 738 generated LUT cells");
pass(countClass(atlasHtml, "atlas-class-cell") === 378, "Color atlas contains exactly 378 generated 5/7/9 class cells");
pass(countClass(atlasHtml, "atlas-map-card") === 8, "Color atlas contains exactly eight map-state cards");
pass(countClass(atlasHtml, "atlas-opacity-row") === 8, "Color atlas contains exactly eight canonical opacity rows");
pass(countClass(atlasHtml, "atlas-depth-step") === 6, "Color atlas contains exactly six perceptual depth roles");

const expectedScaleKeys = [
  "growth:light", "growth:dark",
  "water:light", "water:dark",
  "risk:light", "risk:dark",
  "activity:light", "activity:dark",
  "density:light", "density:dark",
  "confidence:light", "confidence:dark",
  "balance:light", "balance:dark",
  "delta:light", "delta:dark",
  "tradeoff:light", "tradeoff:dark"
];
const scaleRecords = [...atlasHtml.matchAll(
  /<article class="atlas-scale-record"([^>]*)>([\s\S]*?)<\/article>/g
)];
const scaleKeys = scaleRecords.map(([, attributes]) => {
  const scale = attributes.match(/\bdata-atlas-scale="([^"]+)"/)?.[1] ?? "";
  const theme = attributes.match(/\bdata-atlas-theme="([^"]+)"/)?.[1] ?? "";
  return `${scale}:${theme}`;
});
pass(
  scaleKeys.length === expectedScaleKeys.length &&
    expectedScaleKeys.every(key => scaleKeys.includes(key)) &&
    new Set(scaleKeys).size === expectedScaleKeys.length,
  "Color atlas exposes one light and one dark record for all nine governed scales"
);
pass(
  scaleRecords.every(([, , body]) => countClass(body, "atlas-lut-cell") === 41),
  "Every quantitative scale record contains exactly 41 LUT cells"
);
pass(
  scaleRecords.every(([, , body]) => {
    const classRows = [...body.matchAll(
      /<figure class="atlas-class-row">([\s\S]*?)<\/figure>/g
    )].map(match => ({
      label: Number(match[1].match(/<figcaption><strong>(\d+)<\/strong>/)?.[1]),
      cells: countClass(match[1], "atlas-class-cell")
    }));
    return classRows.length === 3 &&
      [5, 7, 9].every(size =>
        classRows.some(row => row.label === size && row.cells === size)
      );
  }),
  "Every quantitative scale record contains exact 5-, 7-, and 9-class strips"
);

const atlasScaleCellElements = [
  ...elementsWithClass(atlasHtml, "atlas-lut-cell"),
  ...elementsWithClass(atlasHtml, "atlas-class-cell")
];
pass(
  atlasScaleCellElements.every(element => !/(?:linear|radial|conic)-gradient\s*\(/i.test(element)),
  "Atlas LUT and class cells use generated solid values, never CSS gradients"
);
const scaleRendererRules = cssRules(html).filter(rule =>
  /\.atlas-(?:lut(?:-cell)?|class-(?:cells|cell))\b/.test(rule.selector)
);
pass(
  scaleRendererRules.length > 0 &&
    scaleRendererRules.every(rule =>
      !/(?:linear|radial|conic)-gradient\s*\(/i.test(rule.declarations)
    ),
  "Atlas LUT and class renderer CSS does not synthesize gradients"
);
pass(!/color-mix\s*\(/i.test(atlasHtml), "Complete color atlas contains no runtime color mixing");
pass(
  /SOURCE_LIMITED\s*·\s*REFERENCE FIXTURE\s*·\s*MACHINE VALIDATION PENDING/.test(atlasHtml) &&
    /not a scale-gate-cleared dataviz\.tokens\.json package/i.test(atlasHtml) &&
    /not to claim production conformance/i.test(atlasHtml),
  "Color atlas preserves the source_limited, reference-fixture, and pending-validation boundary"
);
pass(
  inventory.controls.some(control => control.id === "complete-color-atlas-toggle"),
  "Complete color atlas toggle is recorded in the control inventory"
);

const projectRoot = resolve(root, "..");
const atlasGenerator = resolve(projectRoot, "tools/generate-color-atlas.mjs");
pass(existsSync(atlasGenerator), "Build-time color-atlas generator exists");
const atlasGeneratorCheck = existsSync(atlasGenerator)
  ? spawnSync(process.execPath, [atlasGenerator, "--check-index"], {
      cwd: projectRoot,
      encoding: "utf8"
    })
  : null;
pass(
  atlasGeneratorCheck?.status === 0,
  `Embedded color atlas matches its build-time generator${
    atlasGeneratorCheck?.status === 0
      ? ""
      : ` (${(atlasGeneratorCheck?.stderr || atlasGeneratorCheck?.stdout || "generator did not run").trim()})`
  }`
);

const styleRules = cssRules(html);
const semanticDangerWarningRules = styleRules.filter(rule =>
  /(?:^|[\s.#:[_-])(?:danger|warning)(?:\b|[_-])/i.test(rule.selector)
);
pass(
  semanticDangerWarningRules.every(rule => !/var\(--series-outlier\)/.test(rule.declarations)),
  "Semantic danger and warning selectors never consume the nominal series-outlier token"
);
const seriesOutlierConsumers = styleRules.filter(rule =>
  /var\(--series-outlier\)/.test(rule.declarations)
);
pass(
  seriesOutlierConsumers.length > 0 &&
    seriesOutlierConsumers.every(rule =>
      /(?:dataviz|chart)[\s\S]*(?:is-)?outlier/i.test(rule.selector)
    ),
  "Every series-outlier consumer remains in an explicitly nominal chart selector"
);

const scriptSource = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .join("\n");
pass(
  !/\bIntersectionObserver\b|\bScrollTimeline\b|animation-timeline\s*:|scroll-timeline\s*:|addEventListener\(\s*["']scroll["']/i.test(scriptSource),
  "Main-page scripts contain no parallax or generic scroll-reveal engine"
);
pass(
  !/\b(?:data-parallax|class="[^"]*\bparallax\b|id="[^"]*\bparallax\b|data-scroll-reveal|class="[^"]*\bscroll-reveal\b)/i.test(html),
  "Main-page markup declares no parallax or scroll-reveal behavior"
);

pass(html.includes("font-synthesis: none"), "Font synthesis is disabled");
pass(html.includes("--font-display-en-fallback: Georgia, Cambria, \"Times New Roman\", serif"), "English display fallback token is exact");
pass(html.includes("--font-display-th-fallback: \"Noto Sans Thai Looped\", \"Leelawadee UI\", Tahoma, sans-serif"), "Thai display fallback token is exact");
pass(html.includes("--font-body-fallback: \"Noto Sans Thai\", \"Leelawadee UI\", Tahoma, sans-serif"), "Body fallback token is exact");
pass(html.includes("--font-number-fallback: \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace"), "Number fallback token is exact");
pass(html.includes("document.fonts.ready"), "Font readiness is observed");
pass(html.includes('rel="preload" href="assets/fonts/bai-jamjuree-thai-400-normal.woff2"'), "Thai label font is preloaded from the self-hosted asset");
pass(html.includes('rel="preload" href="assets/fonts/ibm-plex-sans-thai-thai-500-normal.woff2"'), "Thai technical companion is preloaded from the self-hosted asset");
pass(
  html.includes('--font-technical-latin: "JetBrains Mono"') &&
    html.includes('--font-technical-th: "IBM Plex Sans Thai"') &&
    html.includes('--font-technical: "JetBrains Mono", "IBM Plex Sans Thai"'),
  "Technical typography uses one deterministic script-aware JetBrains Mono and IBM Plex Sans Thai pair",
);
pass(
  /font-family:\s*"IBM Plex Sans Thai";[\s\S]*?font-weight:\s*500;[\s\S]*?size-adjust:\s*102%;[\s\S]*?unicode-range:\s*U\+02D7,\s*U\+0303,\s*U\+0331,\s*U\+0E01-0E5B,\s*U\+200C-200D,\s*U\+25CC/.test(html),
  "IBM Plex Sans Thai 500 has the exact Thai subset and conservative optical size adjustment",
);
pass(
  html.includes("--font-label-th: var(--font-technical)") &&
    /html\[data-locale="th"\] \.control-label,[\s\S]*?font-family:\s*var\(--font-label-th\)[\s\S]*?font-weight:\s*500[\s\S]*?letter-spacing:\s*var\(--tracking-technical-th\)[\s\S]*?line-height:\s*var\(--leading-technical-th\)/.test(html),
  "Thai controls and handoff labels use the tuned technical pair rather than an operating-system fallback",
);
pass(
  html.includes("--leading-technical-th: 1.48") &&
    html.includes("--tracking-technical-th: .008em") &&
    /html\[data-locale="th"\] \.proof-state,[\s\S]*?padding-block:\s*5px/.test(html) &&
    /html\[data-locale="th"\] \.atlas-scale-theme\s*\{[\s\S]*?padding-block:\s*4px/.test(html),
  "Thai technical labels carry governed line-height, tracking, and compact-pill breathing room",
);
pass(
  html.includes('document.fonts.load(\'500 16px "IBM Plex Sans Thai"\'') &&
    html.includes("thaiBodyReady") &&
    html.includes("thaiTechnicalReady"),
  "Thai body and technical glyph readiness are checked independently",
);
pass(/body\s*\{[\s\S]*?font-family:\s*var\(--font-body\)/.test(html), "Body and UI use the governed Bai Jamjuree role");
pass(!/body,\s*\n\s*button[\s\S]*?font:\s*inherit/.test(html), "Body font is not overwritten by the form-control inheritance rule");
const anywhereWrapRules = cssRules(html).filter(rule =>
  /overflow-wrap:\s*anywhere/.test(rule.declarations)
);
pass(
  html.includes("overflow-wrap: break-word") &&
    anywhereWrapRules.length > 0 &&
    anywhereWrapRules.every(rule =>
      /(?:atlas-pair-label\s+strong|atlas-map-cell\s+figcaption\s+strong|atlas-scale-foot\s+code)/.test(rule.selector)
    ),
  "Prose avoids arbitrary mid-word breaks while constrained atlas values may wrap safely"
);
pass(html.includes("text-wrap: balance") && html.includes("text-wrap: pretty"), "Display and prose use balanced/pretty wrapping");
pass(/h5,\s*\n\s*h6\s*\{[\s\S]*?overflow-wrap:\s*normal/.test(html), "H6 pattern headings inherit smart non-arbitrary wrapping");
pass(/\.eyebrow\s*\{[\s\S]*?font-weight:\s*500/.test(html), "JetBrains Mono metadata uses the lightest packaged weight 500");
pass(/\.logo-surface\s*\{[\s\S]*?background:\s*transparent[\s\S]*?border:\s*0[\s\S]*?border-radius:\s*0/.test(html), "Logo has no background, border, radius, or carrier");
pass(/\.release-label\s*\{[\s\S]*?background:\s*transparent[\s\S]*?border:\s*0[\s\S]*?border-radius:\s*0/.test(html), "Release metadata has no background, border, radius, or carrier");
pass(/\.site-header::before\s*\{[\s\S]*?background:\s*#E2E9ED/.test(html), "Shared header surface owns logo and metadata contrast");
pass(/\.signature-specimen\s*\{[\s\S]*?background:\s*#E2E9ED/.test(html) && /\.logo-rule-surface\s*\{[\s\S]*?background:\s*transparent/.test(html), "Logo example moves contrast to the full specimen surface instead of a logo-only carrier");
pass(/\.hero\s*\{[\s\S]*?background:\s*var\(--measure-surface\)/.test(html), "Opening hero uses the Measure Brand Blue surface");
pass(/\.hero-copy::before\s*\{[\s\S]*?background:\s*rgba\(17,\s*25,\s*29,\s*\.52\)/.test(html), "Opening hero uses a deterministic dark contrast scrim");
pass(html.includes('id="theme-cycle"') && !html.includes('id="theme"'), "Theme uses one quiet cycling control instead of a select");
pass(html.includes('id="language-cycle"') && !html.includes('id="language"'), "Locale uses one quiet cycling control instead of a select");
pass(html.includes('const themes = ["system", "light", "dark"]'), "Theme cycle order is system → light → dark");
pass(/\.decision-demo h5,[\s\S]*?font-family:\s*var\(--font-ui-heading-th\)/.test(html) && /html\[data-locale="en"\] \.resource-grid h5[\s\S]*?font-family:\s*var\(--font-ui-heading-en\)/.test(html), "Component, dataviz, product, and resource titles use locale-specific Product UI heading roles");

pass(html.includes("--motion-duration-feedback: 120ms") && html.includes("--motion-duration-emphasis: 560ms"), "Canonical motion duration tokens are exposed");
pass(html.includes('id="motion-lab"') && html.includes('data-phase="final"'), "Motion fixture defaults to the complete final meaning");
pass(html.includes('id="motion-replay"') && html.includes('id="motion-show-final"'), "Motion fixture provides replay and pause/show-final controls");
pass(/\.motion-status\s*\{[\s\S]*?background:\s*var\(--surface-soft\)[\s\S]*?color:\s*var\(--text-metadata\)/.test(html), "source_limited uses neutral trust-state styling rather than success styling");
pass(
  html.includes('id="motion-log"') &&
    !/<ol class="motion-log"[^>]*aria-live=/i.test(html) &&
    /id="motion-announcement"[^>]*role="status"[^>]*aria-live="polite"/.test(html),
  "Visible motion history is quiet while a single polite status announces new events"
);
pass(html.includes('meaning: "120ms') && html.includes('action: "320ms'), "Motion log timings match settled visual phases");
pass(html.includes("reducedMotionQuery.matches") && html.includes('showMotionFinal("reduced")'), "Reduced-motion replay resolves immediately to the final meaning");
pass(html.includes('reducedMotionQuery.addEventListener("change"') && html.includes('if (event.matches) showMotionFinal("reduced")'), "A mid-sequence reduced-motion preference change resolves immediately");
pass(html.includes("html:not(.js) .js-only"), "No-JavaScript rendering removes controls that require JavaScript");
pass(html.includes("CTA INTEGRITY · CTRL-01 + STATE-01"), "CTA integrity matrix is present");
pass(
  html.includes('id="cta-eligibility"') &&
    html.includes('id="cta-execute"') &&
    html.includes('id="cta-reset"') &&
    html.includes('id="cta-receipt"'),
  "CTA proof exposes eligibility, execution, receipt, and recovery"
);
pass(html.includes("PENDING_LOCAL") && html.includes("COMPLETE_LOCAL_REFERENCE"), "CTA proof distinguishes pending from verifiable local completion");
pass(html.includes('if (ctaFixture.dataset.state !== "eligible") return') && html.includes("ctaExecute.disabled = !ready"), "CTA proof prevents ineligible and duplicate execution");
pass(html.includes("Ethical success loop") && html.includes("Continue or finish cleanly"), "Ethical value loop includes a clean completion");
pass(
  html.includes("Recipient value—not a share button") &&
    html.includes("Delivery receipt") &&
    html.includes("Recipient lands on the same object") &&
    html.includes("Observed governed outcome"),
  "Recipient-value ladder exposes every governed evidence stage"
);
pass(!/<(?:button|a)\b[^>]*(?:\bid="[^"]*(?:share|invite|send)|\bclass="[^"]*(?:share|invite|send))/i.test(html), "No live share, invite, or send control is rendered");
pass((html.match(/class="ui-icon"/g) || []).length >= 28, "Outline icons carry scanning work across the library and examples");
pass(/\.ui-icon\s*\{[\s\S]*?fill:\s*none[\s\S]*?stroke-linecap:\s*round[\s\S]*?stroke-linejoin:\s*round/.test(html), "Icon language is outline-only with rounded caps and joins");
const svgSymbolIds = [...html.matchAll(/<symbol\b[^>]*\bid="([^"]+)"/gi)]
  .map(match => match[1]);
pass(
  svgSymbolIds.length >= 30 && new Set(svgSymbolIds).size === svgSymbolIds.length,
  "The inline SVG sprite exposes at least 30 uniquely named outline symbols",
);

const contextForm =
  html.match(
    /<form\b(?=[^>]*\bid=(?:"context-search-form"|'context-search-form'))[^>]*>[\s\S]*?<\/form>/i,
  )?.[0] ?? "";
const contextFormTag = openTagById(contextForm, "form", "context-search-form");
const contextQueryTag = openTagById(contextForm, "input", "context-query");
const contextSearchButton = elementById(
  contextForm,
  "button",
  "context-search-google",
);
const contextSearchButtonTag = openTagById(
  contextSearchButton,
  "button",
  "context-search-google",
);
const contextAiButton = elementById(
  contextForm,
  "button",
  "context-search-google-ai",
);
const contextAiButtonTag = openTagById(
  contextAiButton,
  "button",
  "context-search-google-ai",
);
const contextQueryHelp =
  html.match(
    /<small\b(?=[^>]*\bid=(?:"context-query-help"|'context-query-help'))[^>]*>[\s\S]*?<\/small>/i,
  )?.[0] ?? "";
const contextRoutingHelp =
  html.match(
    /<p\b(?=[^>]*\bid=(?:"context-routing-help"|'context-routing-help'))[^>]*>[\s\S]*?<\/p>/i,
  )?.[0] ?? "";
const contextualDiscoverySection =
  html.match(
    /<section\b(?=[^>]*\baria-labelledby=(?:"external-discovery-title"|'external-discovery-title'))[^>]*>[\s\S]*?<\/section>/i,
  )?.[0] ?? "";

pass(
  attributeValue(contextFormTag, "action") ===
    "https://www.google.com/search" &&
    attributeValue(contextFormTag, "method")?.toLowerCase() === "get" &&
    attributeValue(contextFormTag, "target") === "_blank" &&
    /\bnoopener\b/i.test(attributeValue(contextFormTag, "rel") ?? "") &&
    /\bnoreferrer\b/i.test(attributeValue(contextFormTag, "rel") ?? "") &&
    /\bexternal\b/i.test(attributeValue(contextFormTag, "rel") ?? ""),
  "Contextual discovery names Google, uses an explicit GET, and preserves the current page",
);
pass(
  attributeValue(contextQueryTag, "name") === "q" &&
    attributeValue(contextQueryTag, "type")?.toLowerCase() === "search" &&
    (attributeValue(contextQueryTag, "aria-describedby") ?? "")
      .split(/\s+/)
      .includes("context-query-help") &&
    (attributeValue(contextQueryTag, "aria-describedby") ?? "")
      .split(/\s+/)
      .includes("context-routing-help") &&
    !/\b(?:hidden|readonly|disabled)\b/i.test(contextQueryTag) &&
    /<label\b[^>]*\bfor=(?:"context-query"|'context-query')[^>]*>/i.test(
      contextForm,
    ) &&
    html.includes("Editable, auto-composed query"),
  "One visible, labelled, editable q field is shared by both explicit Google routes",
);
pass(
  (contextForm.match(
    /<(?:input|button)\b[^>]*\bname=(?:"q"|'q')[^>]*>/gi,
  ) ?? []).length === 1,
  "The contextual form sends exactly one user-visible q value",
);
pass(
    attributeValue(contextAiButtonTag, "type")?.toLowerCase() === "submit" &&
    attributeValue(contextAiButtonTag, "name") === "udm" &&
    attributeValue(contextAiButtonTag, "value") === "50" &&
    /Synthesize|สังเคราะห์/i.test(contextAiButton) &&
    /AI\s*Mode|โหมด\s*AI/i.test(contextAiButton),
  "Google AI Mode is an explicit submitter route using udm=50",
);
pass(
  attributeValue(contextSearchButtonTag, "type")?.toLowerCase() === "submit" &&
    attributeValue(contextSearchButtonTag, "name") !== "udm" &&
    attributeValue(contextSearchButtonTag, "value") !== "50" &&
    !/\bname=(?:"udm"|'udm')/i.test(contextSearchButtonTag),
  "Ordinary Google Search remains available and never contributes udm",
);
pass(
  (contextForm.match(
    /<(?:input|button)\b[^>]*\bname=(?:"udm"|'udm')[^>]*>/gi,
  ) ?? []).length === 1 &&
    !/<input\b[^>]*(?:\btype=(?:"hidden"|'hidden')|\bhidden\b)[^>]*>/i.test(
      contextForm,
    ),
  "AI routing is carried only by the activated visible button; no hidden route or query is transmitted",
);
pass(
  /discovery_only/i.test(contextualDiscoverySection) &&
    /Landometer sends the visible q/i.test(
      contextQueryHelp,
    ) &&
    /AI Mode selector/i.test(contextQueryHelp) &&
    /no hidden prompt or context|ไม่มี prompt หรือ context ซ่อน/i.test(
      contextQueryHelp,
    ) &&
    /ตรวจ(?:แหล่ง|ข้อ)|open citations|verify sources?/i.test(contextQueryHelp) &&
    /same visible query|this visible query|คำค้น(?:เดียวกัน|ที่เห็นตรงนี้)/i.test(contextRoutingHelp) &&
    /no hidden prompt|ไม่มี prompt ซ่อน/i.test(contextRoutingHelp) &&
    /provider|model|รุ่นของบริการ/i.test(contextRoutingHelp) &&
    /personalization|ปรับให้เหมาะกับแต่ละคน/i.test(contextRoutingHelp),
  "The visible query disclosure keeps every Search and AI Mode result discovery_only pending source review",
);
pass(
  !/\.(?:requestSubmit|submit)\s*\(/.test(html) &&
    !/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*(?:\(|\b)/i.test(
      html,
    ),
  "No script can automatically submit or transmit the contextual query",
);
pass(
  ["tha-sai", "krok-phra", "bueng-lak", "na-to"].every(value => html.includes(`<option value="${value}">`)),
  "Contextual discovery exposes four current-record examples"
);
pass(
  html.includes("ปี 2567 อุทกภัย") &&
    html.includes("27 พฤศจิกายน 2567") &&
    html.includes("ยอดผู้เสียชีวิต") &&
    html.includes("หมู่บ้านท่าไทร") &&
    html.includes("องค์การบริหารส่วนตำบล เกาะยอ") &&
    html.includes("อำเภอเมืองสงขลา") &&
    html.includes("จังหวัดสงขลา"),
  "Default contextual query includes the event, date, active field, and full public place hierarchy"
);
pass(html.includes('id="context-source"') && html.includes("CityMETER public API · checked 29 Jul 2026"), "Every selected context keeps an inspectable product source");
pass(html.includes("public endpoint exposes no provenance") || html.includes("endpoint exposes no provenance"), "Current-record examples keep their evidence boundary visible");
pass(html.includes("discovery_only") && html.includes("<s>See more</s>"), "External discovery keeps its evidence status and corrects the ambiguous label");
pass(
  /Landometer sends the visible q/i.test(html) &&
    /AI Mode selector/i.test(html) &&
    /no hidden prompt or context|ไม่มี prompt หรือ context ซ่อน/i.test(html),
  "Third-party query disclosure is visible beside the fixture",
);
pass(!html.includes("user-provided, product-specific reference scenario"), "Conversational provenance is not exposed as product guidance");
pass(html.includes('id="resource-implementation-notes"') && html.includes('id="resource-llms"'), "Implementation clarification and machine-navigation aid are discoverable");
pass(!/<meta\s+property="og:/i.test(html), "Internal demo omits Open Graph promotion metadata");
pass(!/<script[^>]+type=["']application\/ld\+json["']/i.test(html), "Internal demo omits public structured-data claims");
pass(!/<link[^>]+rel=["']alternate["'][^>]+href=["']llms\.txt["']/i.test(html), "llms.txt is not misrepresented as an alternate page");

pass(!/<script[^>]+src=/i.test(html), "No external JavaScript dependency is present");
pass(!/<link[^>]+rel=["']stylesheet["']/i.test(html), "No external stylesheet dependency is present");
pass(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket/i.test(html), "No network or telemetry API is used");
pass(html.includes("navigator.clipboard") && html.includes("document.execCommand"), "Clipboard action has a local fallback");
pass(html.includes("prefers-reduced-motion: reduce"), "Reduced-motion behavior is present");
pass(html.includes("<noscript>"), "No-JavaScript guidance is present");
pass(html.includes("data-quiet-field"), "Perceptual quiet regions are annotated");

const allIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
pass(new Set(allIds).size === allIds.length, "All HTML IDs are unique");

const controlIds = [...html.matchAll(/<(?:a|button|input|select|textarea|summary)\b[^>]*\bid="([^"]+)"/g)]
  .map(match => match[1]);
const inventoryIds = inventory.controls.map(control => control.id);
pass(new Set(controlIds).size === controlIds.length, "All control IDs are unique");
pass(new Set(inventoryIds).size === inventoryIds.length, "All inventory IDs are unique");
pass(
  controlIds.length === 58 &&
    controlIds.includes("context-search-google-ai") &&
    controlIds.includes("open-color-library") &&
    controlIds.includes("library-color-toggle"),
  "HTML exposes the expected 58 controls including explicit AI Mode and color-library routes",
);
pass(
  inventoryIds.length === 58 &&
    inventoryIds.includes("context-search-google-ai") &&
    inventoryIds.includes("open-color-library") &&
    inventoryIds.includes("library-color-toggle"),
  "Control inventory records all 58 controls including AI Mode and color-library routes",
);
pass(
  controlIds.length === inventoryIds.length &&
    controlIds.every(id => inventoryIds.includes(id)) &&
    inventoryIds.every(id => controlIds.includes(id)),
  "Control inventory exactly matches visible/focusable source controls"
);
for (const control of inventory.controls) {
  pass(Boolean(control.accessibleName), `Inventory ${control.id} has an accessible name`);
  pass(Boolean(control.userJob), `Inventory ${control.id} has a user job`);
  pass(Boolean(control.effect), `Inventory ${control.id} has a real effect`);
  pass(Boolean(control.finalState), `Inventory ${control.id} has a final state`);
  pass(Boolean(control.failureRecovery), `Inventory ${control.id} has failure recovery`);
  pass(Boolean(control.browserTest), `Inventory ${control.id} has a browser test`);
}

for (const path of [
  "index.html",
  "site-manifest.v0.8.8.json",
  "build-card.v0.8.8.yml",
  "control-inventory.v0.8.8.json",
  "qa/v0.8.8-automated.json",
  "qa/v0.8.8-manual-gates.md",
  "implementation-notes.v0.8.8.md",
  "llms.txt",
  "robots.txt",
  "font-assets.manifest.json",
  "assets/downloads/landometer-design-system-v0.8.8.md",
  "landometer-design-system-v0.8.8-standalone.html",
  "assets/images/landometer-logo-banner.png",
  "assets/images/team-hero.jpg"
]) {
  pass(existsSync(resolve(root, path)), `Required path exists: ${path}`);
}

pass(
  sha256("assets/images/landometer-logo-banner.png") === "f6ed8748d32d11514c94ce6a639491120489ce8c3ab6fff073d7ca9638a87535",
  "Reused logo bytes match the existing approved-path record"
);
pass(
  sha256("assets/images/team-hero.jpg") === "50048eb0d0eeaf8b17e086bebc504389033bcc0673d453363c27581aa11579fb",
  "Reused opening photo bytes match the existing approved-path record"
);
pass(
  sha256("assets/downloads/landometer-design-system-v0.8.8.md") === "19d901fe76b7f50ffa16ae7c6d9b918c7de42718fad897448e6107793e146776",
  "Downloadable whitespace-normalized v0.8.8 authoring master matches the governed hash"
);
pass(
  readFileSync(resolve(root, "assets/downloads/landometer-design-system-v0.8.8.md")).byteLength === 227924,
  "Downloadable whitespace-normalized v0.8.8 authoring master has the governed byte count"
);
pass(
  sha256("landometer-design-system-v0.8.8-standalone.html") === "daf360c271ecbb91acf7609c94c62d91019dd5761446b910194b8671e659748d",
  "Standalone HTML hash matches the release record"
);
pass(
  readFileSync(resolve(root, "landometer-design-system-v0.8.8-standalone.html")).byteLength === 2192096,
  "Standalone HTML byte count matches the release record"
);
pass(
  manifest.assets?.some(asset =>
    asset.path === "landometer-design-system-v0.8.8-standalone.html" &&
    asset.bytes === 2192096 &&
    asset.sha256 === "daf360c271ecbb91acf7609c94c62d91019dd5761446b910194b8671e659748d"
  ),
  "Manifest records the exact standalone HTML"
);
pass(
  buildCard.includes("path: landometer-design-system-v0.8.8-standalone.html") &&
    buildCard.includes("sha256: daf360c271ecbb91acf7609c94c62d91019dd5761446b910194b8671e659748d"),
  "Build Card records the exact standalone HTML"
);
pass(/data-standalone="true"/.test(standaloneHtml), "Standalone HTML exposes its self-contained snapshot marker");
pass(
  (standaloneHtml.match(/src:\s*url\(["']?data:font\/woff2/g) ?? []).length === 10,
  "Standalone HTML embeds all ten display-font files"
);
pass(
  !/(?:src|href)="assets\//.test(standaloneHtml) && !/url\(["']?assets\//.test(standaloneHtml),
  "Standalone HTML has no display-critical relative asset"
);
pass(
  sha256("implementation-notes.v0.8.8.md") === "0e99e3fe323474a058a46f7213dd5427f03a091e96ba6898eb37ccf2f1b32181",
  "Implementation clarification hash matches the manifest record"
);
pass(
  readFileSync(resolve(root, "implementation-notes.v0.8.8.md")).byteLength === 14542,
  "Implementation clarification byte count matches the manifest record"
);
pass(
  sha256("llms.txt") === "ae84632111b69bf7b2a1c41024950b0fbbac51cce4af2feea9ad708caa69ee2e",
  "Machine-navigation aid hash matches the manifest record"
);
pass(
  readFileSync(resolve(root, "llms.txt")).byteLength === 3478,
  "Machine-navigation aid byte count matches the manifest record"
);
pass(
  manifest.assets?.some(asset =>
    asset.path === "implementation-notes.v0.8.8.md" &&
    asset.bytes === 14542 &&
    asset.sha256 === "0e99e3fe323474a058a46f7213dd5427f03a091e96ba6898eb37ccf2f1b32181"
  ),
  "Manifest records the exact implementation clarification"
);
pass(
  manifest.assets?.some(asset =>
    asset.path === "llms.txt" &&
    asset.bytes === 3478 &&
    asset.sha256 === "ae84632111b69bf7b2a1c41024950b0fbbac51cce4af2feea9ad708caa69ee2e"
  ),
  "Manifest records the exact machine-navigation aid"
);
pass(
  implementationNotes.includes("IMPL-SURFACE-COLOR-01") &&
    implementationNotes.includes("IMPL-SHARE-01") &&
    implementationNotes.includes("IMPL-SEARCH-EXT-01") &&
    implementationNotes.includes("IMPL-AI-EXT-01"),
  "Implementation clarification covers governed atmosphere, color guidance, recipient value, contextual source Search, and external AI synthesis"
);
pass(implementationNotes.includes("CityMETER-specific") && implementationNotes.includes("discovery_only"), "Implementation clarification preserves product and evidence boundaries");
pass(machineDiscoveryAid.includes("project-path llms.txt is a navigation aid only"), "llms.txt exposes its project-path discovery limitation");
pass(machineDiscoveryAid.includes("No bounded agent action is enabled"), "llms.txt grants no agent action");
pass(robotsRecord.includes("Project-path informational record only") && robotsRecord.includes("Allow: /"), "Project-path robots record cannot accidentally block host-root crawling");

for (const face of fontManifest.faces) {
  pass(existsSync(resolve(root, face.file)), `Font exists: ${face.file}`);
  pass(sha256(face.file) === face.sha256, `Font hash matches: ${face.file}`);
  pass(existsSync(resolve(root, face.licenseFile)), `Font license exists: ${face.licenseFile}`);
  pass(html.includes(face.file), `Font is packaged in the single-page HTML: ${face.file}`);
}
pass(
  fontManifest.faces.some(face =>
    face.family === "IBM Plex Sans Thai" &&
    face.subset === "thai" &&
    face.weight === 500 &&
    face.file === "assets/fonts/ibm-plex-sans-thai-thai-500-normal.woff2" &&
    face.sha256 === "7e01c133031aba4ca902d81930096f0224d83f808014c1232016b49e0a7ecff6" &&
    face.licenseFile === "assets/fonts/licenses/ibm-plex-sans-thai-OFL.txt" &&
    face.sourcePackage === "@fontsource/ibm-plex-sans-thai@5.3.0"
  ),
  "Font manifest records the exact licensed IBM Plex Sans Thai 500 technical companion",
);

pass(!existsSync(resolve(root, "site-manifest.json")), "Stale unversioned manifest is removed");
pass(!existsSync(resolve(root, "control-inventory.json")), "Stale unversioned control inventory is removed");

if (errors.length) {
  console.error(`v0.8.8 validation FAILED (${errors.length} of ${checks.length} checks)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `v0.8.8 validation PASSED · ${checks.length} static checks · ${controlIds.length} controls · machineValidation pending`
);
