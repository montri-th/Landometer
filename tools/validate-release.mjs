import { createHash } from "node:crypto";
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

const html = text("index.html");
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
pass(manifest.capabilities.thirdPartyRequest === "explicit_user_triggered_visible_query_only", "Third-party request is bounded to the visible confirmed query");
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
pass(manifest.fixtureCapabilities?.contextualDiscovery?.activeFilter.includes("field label only"), "Context fixture excludes a real casualty value");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.thirdPartyRequest === true, "Context fixture declares the real third-party GET");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.remoteMutation === false, "Context fixture does not mutate a remote governed object");
pass(manifest.fixtureCapabilities?.contextualDiscovery?.activeObject.includes("not a real event"), "Context fixture explicitly marks the synthetic event as non-real");
pass(manifest.fixtureCapabilities?.machineDiscovery?.status === "navigation_aid_only", "llms.txt remains a navigation aid only");
pass(manifest.fixtureCapabilities?.machineDiscovery?.agentReadableCapability === false, "Machine discovery does not claim agent-readable capability");
pass(manifest.fixtureCapabilities?.machineDiscovery?.boundedAgentAction === false, "Machine discovery grants no bounded agent action");
for (const fixtureId of [
  "DV-FIXTURE-0.1",
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
pass(buildCard.includes("fixtureId: UX-FIXTURE-0.1"), "Build Card names the positive-design reference fixture");
pass(buildCard.includes("fixtureId: MOTION-FIXTURE-0.1"), "Build Card names the semantic-motion reference fixture");
pass(buildCard.includes("fixtureId: NETWORK-FIXTURE-0.1"), "Build Card names the recipient-value reference fixture");
pass(buildCard.includes("fixtureId: CONTEXT-FIXTURE-0.1"), "Build Card names the contextual-discovery reference fixture");
pass(buildCard.includes("contextDiscovery: true"), "Build Card declares the explicit contextual-discovery action");
pass(buildCard.includes("thirdPartyRequest: explicit_user_triggered_visible_query_only"), "Build Card bounds the third-party request");
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
pass(html.includes("Implementation Library") && (html.match(/<details class="library-group"/g) || []).length === 6, "Six progressive-disclosure implementation groups are present");
pass(html.includes("CityMETER") && html.includes("CityWiki") && html.includes("CityChat") && html.includes("ijji"), "Product-adaptation templates are present");
pass((html.match(/class="dataviz-pattern"/g) || []).length === 3, "Compare, Change, and Relationship dataviz examples are present");
pass((html.match(/class="dataviz-table"/g) || []).length === 3, "Every rendered dataviz example has a visible table alternative");
pass((html.match(/class="opportunity-card"/g) || []).length === 15, "Fifteen positive opportunity sketches span foundations, components, and dataviz");
pass((html.match(/class="intent-case(?: is-rejected)?"/g) || []).length === 4, "Three positive Intent-to-AHA cases and one rejected case are present");
pass((html.match(/class="intent-case is-rejected"/g) || []).length === 1, "Exactly one rejected Intent-to-AHA case is present");
pass(html.includes("FOUNDATIONS IN ACTION · CREATIVE CONCEPT SKETCHES"), "Foundations expose creative application sketches");
pass(html.includes("four_component_ensembles") === false, "Internal manifest identifiers do not leak into reader-facing HTML");
pass(html.includes("Measured zero") && html.includes("No data"), "Dataviz distinguishes measured zero from no data");
pass(html.includes("Association does not establish cause"), "Relationship example does not imply causality");
pass(/data-data-visualization="fixture_only"/.test(html), "HTML labels data visualization as fixture-only");

pass(!/Mission Lab|#7FA2F1|googleapis|gstatic|fonts\.google/i.test(html), "Forbidden legacy sub-brand, color, and font dependencies are absent");
pass(!/#[0-9a-f]{6}\b[^<]*(purple|violet|lavender|fuchsia)/i.test(html), "No forbidden purple-family token is declared");
pass(html.includes("#1D4497"), "Protected Brand Blue is exact");
pass(html.includes("linear-gradient(135deg, #C33F55 0%, #FF8A4C 52%, #F4C44E 100%)"), "Cultivate gradient stop order is exact");
pass(html.includes("linear-gradient(135deg, #147A9F 0%, #3BD3CB 52%, #3BD19B 100%)"), "Ground gradient stop order is exact");
pass(html.includes("linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)"), "Light Measure gradient is exact");
pass(html.includes("linear-gradient(135deg, #68C4E2 0%, #15919A 52%, #08756F 100%)"), "Dark Measure gradient is exact");
pass(html.includes("font-synthesis: none"), "Font synthesis is disabled");
pass(html.includes("--font-display-en-fallback: Georgia, Cambria, \"Times New Roman\", serif"), "English display fallback token is exact");
pass(html.includes("--font-display-th-fallback: \"Noto Sans Thai Looped\", \"Leelawadee UI\", Tahoma, sans-serif"), "Thai display fallback token is exact");
pass(html.includes("--font-body-fallback: \"Noto Sans Thai\", \"Leelawadee UI\", Tahoma, sans-serif"), "Body fallback token is exact");
pass(html.includes("--font-number-fallback: \"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace"), "Number fallback token is exact");
pass(html.includes("document.fonts.ready"), "Font readiness is observed");
pass(/body\s*\{[\s\S]*?font-family:\s*var\(--font-body\)/.test(html), "Body and UI use the governed Bai Jamjuree role");
pass(!/body,\s*\n\s*button[\s\S]*?font:\s*inherit/.test(html), "Body font is not overwritten by the form-control inheritance rule");
pass(html.includes("overflow-wrap: break-word") && !html.includes("overflow-wrap: anywhere"), "Text wrapping avoids arbitrary mid-word breaks");
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
pass(
  /<form[\s\S]*?id="context-search-form"[\s\S]*?action="https:\/\/www\.google\.com\/search"[\s\S]*?method="get"[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer external"/.test(html),
  "Contextual discovery names Google, uses an explicit GET, and preserves the current page"
);
pass(html.includes('id="context-query"') && html.includes('name="q"') && html.includes("Editable, auto-composed query"), "Contextual query is visible, editable, and sent as q");
pass(html.includes('data-event-name="CM-SYNTHETIC-DISASTER-001 ข้อมูลจำลอง ไม่ใช่เหตุการณ์จริง"'), "Contextual query carries a clearly non-real synthetic event label");
pass(html.includes('data-active-filter="ยอดผู้เสียชีวิต"'), "Contextual query includes the active user-visible field label");
pass(
  html.includes('data-place-name="เทศบาลเมืองแสนสุข"') &&
    html.includes('data-district-name="อำเภอเมืองชลบุรี"') &&
    html.includes('data-province-name="จังหวัดชลบุรี"'),
  "Contextual query includes the public place hierarchy"
);
pass(html.includes("discovery_only") && html.includes("<s>See more</s>"), "External discovery keeps its evidence status and corrects the ambiguous label");
pass(html.includes("Google receives the visible query only after activation"), "Third-party query disclosure is visible beside the fixture");
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
  sha256("assets/downloads/landometer-design-system-v0.8.8.md") === "8d763489eb7d6b553eeb625ceecace5a301208ef68ab7ac9711c1a2d091c4d48",
  "Downloadable v0.8.8 authoring master matches the supplied source bytes"
);
pass(
  readFileSync(resolve(root, "assets/downloads/landometer-design-system-v0.8.8.md")).byteLength === 227972,
  "Downloadable v0.8.8 authoring master has the governed byte count"
);
pass(
  sha256("implementation-notes.v0.8.8.md") === "bd48ef6a48b49214c61c8ac35647bce0b9dec9018b974706938442e8bff5f279",
  "Implementation clarification hash matches the manifest record"
);
pass(
  readFileSync(resolve(root, "implementation-notes.v0.8.8.md")).byteLength === 7367,
  "Implementation clarification byte count matches the manifest record"
);
pass(
  sha256("llms.txt") === "ba2690985e2ac814f14f6579ce140aa4c9d809498f85142bd927bd0b505c756d",
  "Machine-navigation aid hash matches the manifest record"
);
pass(
  readFileSync(resolve(root, "llms.txt")).byteLength === 2939,
  "Machine-navigation aid byte count matches the manifest record"
);
pass(
  manifest.assets?.some(asset =>
    asset.path === "implementation-notes.v0.8.8.md" &&
    asset.bytes === 7367 &&
    asset.sha256 === "bd48ef6a48b49214c61c8ac35647bce0b9dec9018b974706938442e8bff5f279"
  ),
  "Manifest records the exact implementation clarification"
);
pass(
  manifest.assets?.some(asset =>
    asset.path === "llms.txt" &&
    asset.bytes === 2939 &&
    asset.sha256 === "ba2690985e2ac814f14f6579ce140aa4c9d809498f85142bd927bd0b505c756d"
  ),
  "Manifest records the exact machine-navigation aid"
);
pass(implementationNotes.includes("IMPL-SHARE-01") && implementationNotes.includes("IMPL-SEARCH-EXT-01"), "Implementation clarification covers recipient value and contextual external search");
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
