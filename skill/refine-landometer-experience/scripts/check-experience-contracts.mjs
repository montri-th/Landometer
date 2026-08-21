#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Usage: check-experience-contracts.mjs <html-file>");
  process.exit(2);
}

const html = await readFile(file, "utf8");
const htmlDirectory = path.dirname(path.resolve(file));

function attributeOf(source, name) {
  return source.match(new RegExp(`\\b${name}="([^"]*)"`, "iu"))?.[1] ?? "";
}

function tagsNamed(source, tagName) {
  return [...source.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "giu"))]
    .map(match => match[0]);
}

function sha256(source) {
  return createHash("sha256").update(source).digest("hex");
}

async function readJsonBesideHtml(name) {
  try {
    return JSON.parse(await readFile(path.join(htmlDirectory, name), "utf8"));
  } catch {
    return null;
  }
}

function elementsWithClass(source, className) {
  return [...source.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/giu)]
    .filter(([, , attributes]) => {
      const classAttribute = attributes.match(/\bclass="([^"]*)"/iu)?.[1] ?? "";
      return classAttribute.split(/\s+/u).includes(className);
    })
    .map(match => match[0]);
}

function countClass(source, className) {
  return elementsWithClass(source, className).length;
}

function cssRules(source) {
  const styles = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/giu)]
    .map(match => match[1])
    .join("\n");
  return [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/gu)]
    .map(([, selector, declarations]) => ({
      selector: selector.trim(),
      declarations
    }));
}

const atlasStartMarker = "<!-- COLOR_ATLAS_START -->";
const atlasEndMarker = "<!-- COLOR_ATLAS_END -->";
const atlasStart = html.indexOf(atlasStartMarker);
const atlasEnd = html.indexOf(atlasEndMarker);
const atlasMarkersValid = atlasStart >= 0 && atlasEnd > atlasStart;
const atlasHtml = atlasMarkersValid
  ? html.slice(atlasStart + atlasStartMarker.length, atlasEnd)
  : "";
const scaleRecords = [...atlasHtml.matchAll(
  /<article class="atlas-scale-record"([^>]*)>([\s\S]*?)<\/article>/gu
)];
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
const scaleKeys = scaleRecords.map(([, attributes]) => {
  const scale = attributes.match(/\bdata-atlas-scale="([^"]+)"/u)?.[1] ?? "";
  const theme = attributes.match(/\bdata-atlas-theme="([^"]+)"/u)?.[1] ?? "";
  return `${scale}:${theme}`;
});
const atlasScaleCellElements = [
  ...elementsWithClass(atlasHtml, "atlas-lut-cell"),
  ...elementsWithClass(atlasHtml, "atlas-class-cell")
];
const samplerStartMarker = "<!-- COLOR_SCALE_SAMPLER_START -->";
const samplerEndMarker = "<!-- COLOR_SCALE_SAMPLER_END -->";
const samplerStart = html.indexOf(samplerStartMarker);
const samplerEnd = html.indexOf(samplerEndMarker);
const samplerMarkersValid = samplerStart >= 0 && samplerEnd > samplerStart;
const samplerHtml = samplerMarkersValid
  ? html.slice(samplerStart + samplerStartMarker.length, samplerEnd)
  : "";
const samplerElement = elementsWithClass(samplerHtml, "scale-sampler")[0] ?? "";
const samplerCards = [...samplerHtml.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/giu)]
  .filter(([, attributes]) =>
    attributeOf(attributes, "class").split(/\s+/u).includes("scale-family-card")
  )
  .map(([, attributes, body]) => ({ attributes, body }));
const samplerFamilies = new Map([
  ["growth", "sequential"],
  ["water", "sequential"],
  ["risk", "sequential"],
  ["activity", "sequential"],
  ["density", "sequential"],
  ["confidence", "sequential"],
  ["balance", "diverging"],
  ["delta", "diverging"],
  ["tradeoff", "diverging"]
]);
const samplerRows = samplerCards.flatMap(card =>
  [...card.body.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/giu)]
    .filter(([, attributes]) =>
      attributeOf(attributes, "class").split(/\s+/u).includes("scale-family-class-row")
    )
    .map(([, attributes, body]) => ({ card, attributes, body }))
);
const styleRules = cssRules(html);
const semanticDangerWarningRules = styleRules.filter(rule =>
  /(?:^|[\s.#:[_-])(?:danger|warning)(?:\b|[_-])/iu.test(rule.selector)
);
const seriesOutlierConsumers = styleRules.filter(rule =>
  /var\(--series-outlier\)/u.test(rule.declarations)
);
const scriptSource = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/giu)]
  .map(match => match[1])
  .join("\n");

let inventory = null;
try {
  inventory = JSON.parse(
    await readFile(
      path.join(htmlDirectory, "control-inventory.v0.9.0.json"),
      "utf8"
    )
  );
} catch {
  inventory = null;
}

const siteManifest = await readJsonBesideHtml("site-manifest.v0.9.0.json");
const scaleFixture = await readJsonBesideHtml("assets/data/scales.json");
const colorDelivery = await readJsonBesideHtml(
  "assets/data/color-delivery.v0.9.0.json"
);
const colorRegistryId = colorDelivery?.meta?.id ?? "";
const pinnedColorSetName =
  colorDelivery?.meta?.immutableColorBaseline ?? "";
const currentArtifactBuildId =
  colorDelivery?.meta?.currentArtifactBuild?.id ?? "";
const currentArtifactBuildName =
  colorDelivery?.meta?.currentArtifactBuild?.immutableStandalone ?? "";
let pinnedColorSetHtml = "";
let currentArtifactBuildHtml = "";
let tokenRegistrySource = "";
let scaleRegistrySource = "";
try {
  [
    pinnedColorSetHtml,
    currentArtifactBuildHtml,
    tokenRegistrySource,
    scaleRegistrySource
  ] =
    await Promise.all([
      readFile(path.join(htmlDirectory, pinnedColorSetName), "utf8"),
      readFile(path.join(htmlDirectory, currentArtifactBuildName), "utf8"),
      readFile(path.join(htmlDirectory, "assets/data/tokens.json"), "utf8"),
      readFile(path.join(htmlDirectory, "assets/data/scales.json"), "utf8")
    ]);
} catch {
  pinnedColorSetHtml = "";
  currentArtifactBuildHtml = "";
  tokenRegistrySource = "";
  scaleRegistrySource = "";
}
const scaleRecordsByKey = new Map(
  (scaleFixture?.scales ?? []).map(record => [
    `${record.scaleId}:${record.theme}`,
    record
  ])
);

const htmlTag = html.match(/<html\b[^>]*>/iu)?.[0] ?? "";
const linkTags = tagsNamed(html, "link");
const metaTags = tagsNamed(html, "meta");
const faviconLinks = linkTags.filter(tag =>
  attributeOf(tag, "rel").split(/\s+/u).includes("icon")
);
const browserTabIcon = siteManifest?.identity?.browserTabIcon ?? null;
const pendingFaviconValid =
  faviconLinks.length === 0 &&
  html.includes("<!-- FAVICON_PENDING_APPROVED_COMPACT_ASSET -->") &&
  browserTabIcon?.status === "pending_approved_compact_asset" &&
  browserTabIcon?.rendered === false;
const approvedFaviconLink = faviconLinks[0] ?? "";
const approvedFaviconDeclaredHref = attributeOf(approvedFaviconLink, "href");
const approvedFaviconHref = approvedFaviconDeclaredHref
  .split(/[?#]/u)[0];
const approvedFaviconStandaloneHref =
  "https://montri-th.github.io/Landometer/assets/images/landometer-symbol-transparent.png?v=35a1496f";
const currentArtifactFaviconLinks = tagsNamed(currentArtifactBuildHtml, "link")
  .filter(tag => attributeOf(tag, "rel").split(/\s+/u).includes("icon"));
const stableStandaloneFaviconValid =
  currentArtifactFaviconLinks.length === 1 &&
  attributeOf(currentArtifactFaviconLinks[0], "href") ===
    approvedFaviconStandaloneHref &&
  attributeOf(currentArtifactFaviconLinks[0], "type") === "image/png" &&
  attributeOf(currentArtifactFaviconLinks[0], "sizes") === "192x192" &&
  !/^data:/iu.test(attributeOf(currentArtifactFaviconLinks[0], "href"));
const approvedFaviconRecordText = JSON.stringify(browserTabIcon ?? {});
let approvedFaviconHash = "";
let approvedFaviconBytes = null;
let approvedFaviconSize = "";
if (
  approvedFaviconHref &&
  !/^(?:data:|https?:|\/\/)/iu.test(approvedFaviconHref)
) {
  try {
    approvedFaviconBytes = await readFile(
      path.resolve(htmlDirectory, approvedFaviconHref)
    );
    approvedFaviconHash = sha256(approvedFaviconBytes);
    if (
      approvedFaviconBytes.length >= 24 &&
      approvedFaviconBytes.subarray(0, 8).equals(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
      )
    ) {
      approvedFaviconSize = [
        approvedFaviconBytes.readUInt32BE(16),
        approvedFaviconBytes.readUInt32BE(20)
      ].join("x");
    }
  } catch {
    approvedFaviconHash = "";
    approvedFaviconBytes = null;
    approvedFaviconSize = "";
  }
}
const approvedFaviconValid =
  faviconLinks.length === 1 &&
  faviconLinks.every(tag =>
    !/(?:banner|lockup|wordmark|horizontal)/iu.test(attributeOf(tag, "href"))
  ) &&
  browserTabIcon?.status === "approved" &&
  browserTabIcon?.rendered === true &&
  approvedFaviconDeclaredHref === browserTabIcon?.href &&
  browserTabIcon?.href ===
    "assets/images/landometer-symbol-transparent.png?v=35a1496f" &&
  browserTabIcon?.standaloneHref === approvedFaviconStandaloneHref &&
  browserTabIcon?.cacheRevision === "35a1496f" &&
  [browserTabIcon?.path, browserTabIcon?.assetPath]
    .filter(Boolean)
    .includes(approvedFaviconHref) &&
  /^[a-f0-9]{64}$/u.test(browserTabIcon?.sha256 ?? "") &&
  approvedFaviconHash === browserTabIcon?.sha256 &&
  approvedFaviconBytes?.length === browserTabIcon?.bytes &&
  attributeOf(approvedFaviconLink, "type") === browserTabIcon?.mimeType &&
  approvedFaviconSize === browserTabIcon?.intrinsicSize &&
  browserTabIcon?.declaredSizes?.includes(
    attributeOf(approvedFaviconLink, "sizes")
  ) &&
  browserTabIcon?.transparentCanvas === true &&
  browserTabIcon?.transform === "none" &&
  /browser-tab favicon only/iu.test(browserTabIcon?.approvalScope ?? "") &&
  /same transparent RGBA bytes/iu.test(browserTabIcon?.themeStrategy ?? "") &&
  /no carrier[\s\S]*crop/iu.test(browserTabIcon?.themeStrategy ?? "") &&
  /(?:favicon|compact|symbol)/iu.test(approvedFaviconRecordText) &&
  /transparent/iu.test(approvedFaviconRecordText);
const browserTabIdentityPairValid =
  (pendingFaviconValid && currentArtifactFaviconLinks.length === 0) ||
  (approvedFaviconValid && stableStandaloneFaviconValid);

const robotsContent = attributeOf(
  metaTags.find(tag => attributeOf(tag, "name").toLowerCase() === "robots") ?? "",
  "content"
);
const descriptionContent = attributeOf(
  metaTags.find(tag => attributeOf(tag, "name").toLowerCase() === "description") ?? "",
  "content"
);
const canonicalHref = attributeOf(
  linkTags.find(tag =>
    attributeOf(tag, "rel").split(/\s+/u).includes("canonical")
  ) ?? "",
  "href"
);
const hreflangLinks = linkTags.filter(tag => attributeOf(tag, "hreflang"));
const openGraphTags = metaTags.filter(tag =>
  attributeOf(tag, "property").toLowerCase().startsWith("og:")
);
const twitterTags = metaTags.filter(tag =>
  attributeOf(tag, "name").toLowerCase().startsWith("twitter:")
);
const jsonLdBlocks = [...html.matchAll(
  /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu
)].map(match => match[1].trim());
const jsonLdValid = jsonLdBlocks.length > 0 &&
  jsonLdBlocks.every(block => {
    try {
      JSON.parse(block);
      return true;
    } catch {
      return false;
    }
  });
const requiredOpenGraph = [
  "og:site_name", "og:title", "og:description", "og:type", "og:url",
  "og:image"
];
const requiredTwitter = [
  "twitter:card", "twitter:title", "twitter:description", "twitter:image"
];
const manifestIndexable = siteManifest?.artifact?.indexable;
const htmlIndexable = attributeOf(htmlTag, "data-indexable") === "true";
const manifestCanonical =
  siteManifest?.artifact?.canonicalUrl ??
  siteManifest?.publication?.canonicalUrl ??
  "";
const sourceLimitedOrInternal =
  siteManifest?.artifact?.evidenceStatus !== "verified" ||
  siteManifest?.artifact?.delivery !== "deployable_public";
let sitemapPresent = false;
try {
  await readFile(path.join(htmlDirectory, "sitemap.xml"), "utf8");
  sitemapPresent = true;
} catch {
  sitemapPresent = false;
}
let llmsSource = "";
let llmsFilePresent = false;
try {
  llmsSource = await readFile(path.join(htmlDirectory, "llms.txt"), "utf8");
  llmsFilePresent = true;
} catch {
  llmsSource = "";
  llmsFilePresent = false;
}
const llmsAsset = siteManifest?.assets?.find(asset => asset.path === "llms.txt");
const manifestMachineDiscovery = siteManifest?.fixtureCapabilities?.machineDiscovery;
const manifestClaimsLlms =
  llmsAsset != null ||
  manifestMachineDiscovery?.path === "llms.txt" ||
  /\bllms\.txt\b/iu.test(siteManifest?.publication?.machineDiscoveryAid ?? "");
const htmlClaimsLlms =
  attributeOf(htmlTag, "data-machine-discovery") === "llms_navigation_aid" ||
  tagsNamed(html, "a").some(tag =>
    /(?:^|\/)llms\.txt(?:[?#].*)?$/iu.test(attributeOf(tag, "href"))
  );
const llmsBoundaryText = [
  llmsSource,
  JSON.stringify(llmsAsset ?? {}),
  JSON.stringify(manifestMachineDiscovery ?? {}),
  siteManifest?.publication?.machineDiscoveryAid ?? ""
].join("\n");
const llmsNegativeBoundariesValid =
  /not [^.\n]*\branking signal\b/iu.test(llmsBoundaryText) &&
  /not [^.\n]*\baccess(?:-control| control)\b/iu.test(llmsBoundaryText) &&
  /not [^.\n]*\bconformance claim\b/iu.test(llmsBoundaryText) &&
  /not [^.\n]*(?:agent-action )?permission|no bounded agent action|permission (?:for an agent )?to act/iu
    .test(llmsBoundaryText);
const llmsNavigationValid =
  (
    !llmsFilePresent &&
    !manifestClaimsLlms &&
    !htmlClaimsLlms
  ) ||
  (
    llmsFilePresent &&
    manifestClaimsLlms &&
    htmlClaimsLlms &&
    siteManifest?.capabilities?.agentReadable === false &&
    manifestMachineDiscovery?.agentReadableCapability === false &&
    manifestMachineDiscovery?.boundedAgentAction === false &&
    /navigation aid/iu.test(llmsSource) &&
    /^[a-f0-9]{64}$/u.test(llmsAsset?.sha256 ?? "") &&
    llmsAsset?.sha256 === sha256(llmsSource) &&
    llmsNegativeBoundariesValid
  );

const manualGatesPath = siteManifest?.qa?.manualGatesPath ?? "";
let manualGatesSource = "";
try {
  manualGatesSource = await readFile(
    path.resolve(htmlDirectory, manualGatesPath),
    "utf8"
  );
} catch {
  manualGatesSource = "";
}
const manualGatesRemainOpen =
  manualGatesPath.length > 0 &&
  /^# .*\bopen manual gates\b/imu.test(manualGatesSource) &&
  /\bgates remain open\b/iu.test(manualGatesSource) &&
  /does not claim package-level or artifact-level conformance/iu
    .test(manualGatesSource) &&
  siteManifest?.artifact?.machineValidation === "pending" &&
  siteManifest?.qa?.machineValidation === "pending" &&
  Array.isArray(siteManifest?.qa?.openManualGates) &&
  siteManifest.qa.openManualGates.length > 0;

function customPropertyOf(element, property) {
  const style = attributeOf(element, "style");
  return style.match(
    new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, "iu")
  )?.[1]?.trim() ?? "";
}

const samplerKindsValid =
  samplerCards.length === samplerFamilies.size &&
  new Set(
    samplerCards.map(card => attributeOf(card.attributes, "data-scale-family"))
  ).size === samplerFamilies.size &&
  samplerCards.every(card => {
    const family = attributeOf(card.attributes, "data-scale-family");
    return attributeOf(card.attributes, "data-scale-kind") ===
      samplerFamilies.get(family);
  }) &&
  samplerCards.filter(card =>
    attributeOf(card.attributes, "data-scale-kind") === "sequential"
  ).length === 6 &&
  samplerCards.filter(card =>
    attributeOf(card.attributes, "data-scale-kind") === "diverging"
  ).length === 3;

const samplerExactClassesValid =
  scaleFixture?.meta?.records === 18 &&
  samplerCards.every(card => {
    const family = attributeOf(card.attributes, "data-scale-family");
    const kind = attributeOf(card.attributes, "data-scale-kind");
    const light = scaleRecordsByKey.get(`${family}:light`);
    const dark = scaleRecordsByKey.get(`${family}:dark`);
    const rows = samplerRows.filter(row => row.card === card);
    if (
      !light ||
      !dark ||
      light.kind !== kind ||
      dark.kind !== kind ||
      attributeOf(card.attributes, "data-scale-version-light") !==
        light.scaleVersion ||
      attributeOf(card.attributes, "data-scale-version-dark") !==
        dark.scaleVersion ||
      rows.length !== 3
    ) {
      return false;
    }
    return [5, 7, 9].every(classCount => {
      const row = rows.find(item =>
        Number(attributeOf(item.attributes, "data-class-count")) === classCount
      );
      if (!row) return false;
      const cells = elementsWithClass(row.body, "scale-family-class-cell");
      const lightValues = cells.map(cell =>
        customPropertyOf(cell, "--scale-light")
      );
      const darkValues = cells.map(cell =>
        customPropertyOf(cell, "--scale-dark")
      );
      return cells.length === classCount &&
        JSON.stringify(lightValues) ===
          JSON.stringify(light.classes[String(classCount)]) &&
        JSON.stringify(darkValues) ===
          JSON.stringify(dark.classes[String(classCount)]);
    });
  });
const samplerCells = elementsWithClass(samplerHtml, "scale-family-class-cell");
const samplerCellsAreSolid = samplerCells.length === 189 &&
  samplerCells.every(cell =>
    /^#[A-F0-9]{6}$/iu.test(customPropertyOf(cell, "--scale-light")) &&
    /^#[A-F0-9]{6}$/iu.test(customPropertyOf(cell, "--scale-dark")) &&
    !/(?:linear|radial|conic)-gradient\s*\(/iu.test(cell)
  );
const requiredPillActionSelectors = [
  ".skip-link",
  ".primary-action",
  ".secondary-action",
  ".copy-button",
  ".pattern-button",
  ".cta-proof button",
  ".intent-form button",
  ".form-demo .button",
  ".interaction-sample .interaction-control",
  ".resource-grid .download-action",
  ".scale-sampler-foot a"
];
const pillActionRule = styleRules.find(rule => {
  const selectors = rule.selector.split(",").map(selector => selector.trim());
  return requiredPillActionSelectors.every(selector =>
    selectors.includes(selector)
  ) && /border-radius:\s*var\(--radius-pill\)/u.test(rule.declarations);
});
const pillActionSelectors = new Set(
  pillActionRule?.selector.split(",").map(selector => selector.trim()) ?? []
);
const excludedFromPillAction = [
  ".theme-cycle",
  ".language-cycle",
  ".segmented button",
  ".lens-list button",
  ".surface-list button",
  "input",
  "textarea",
  "select"
];
const quietUtilityRule = styleRules.find(rule => {
  const selectors = rule.selector.split(",").map(selector => selector.trim());
  return selectors.includes(".theme-cycle") &&
    selectors.includes(".language-cycle");
});
const componentGeometryExcluded =
  excludedFromPillAction.every(selector => !pillActionSelectors.has(selector)) &&
  [...pillActionSelectors].every(selector => !/(?:\bcard\b|\.card)/iu.test(selector)) &&
  styleRules.some(rule =>
    /\.segmented button/iu.test(rule.selector) &&
    /\.lens-list button/iu.test(rule.selector) &&
    /\.surface-list button/iu.test(rule.selector) &&
    /border-radius:\s*var\(--radius-xs\)/u.test(rule.declarations)
  ) &&
  styleRules.some(rule =>
    /^select$/u.test(rule.selector) &&
    /border-radius:\s*var\(--radius-sm\)/u.test(rule.declarations)
  ) &&
  styleRules.some(rule =>
    /\.intent-form input/iu.test(rule.selector) &&
    /border-radius:\s*var\(--radius-xs\)/u.test(rule.declarations)
  );
const fullAtlasDisclosures = elementsWithClass(html, "complete-color-atlas");
const fullAtlasRouteValid =
  fullAtlasDisclosures.length === 1 &&
  attributeOf(fullAtlasDisclosures[0], "id") === "complete-color-atlas" &&
  elementsWithClass(html, "color-route-card").some(element =>
    attributeOf(element, "href") === "#color-data-scales" &&
    attributeOf(element, "data-reveal-target") === "color-data-scales"
  ) &&
  elementsWithClass(samplerHtml, "scale-sampler-action").some(element =>
    attributeOf(element, "href") === "#atlas-dataviz-title" &&
    attributeOf(element, "data-reveal-target") === "atlas-dataviz-title"
  ) &&
  tagsNamed(html, "a").some(element =>
    attributeOf(element, "href") === "#complete-color-atlas" &&
    attributeOf(element, "data-reveal-target") === "complete-color-atlas"
  );

const checks = [
  [
    "protected Cultural activation keeps ‘with data’",
    /aria-label="Let us cultivate our city with data\."/u.test(html) &&
      /<span class="hero-line">Let us<\/span><span class="hero-line">cultivate<\/span><span class="hero-line">our city<\/span><span class="hero-line">with data\.<\/span>/u.test(html) &&
      !/aria-label="Let us cultivate our city\."/u.test(html) &&
      !html.includes("source_limited · authoring master r2 · 6 Aug 2026") &&
      html.includes("source_limited · authoring master r1 · approved 7 Aug 2026")
  ],
  ["before/after data", /\bbefore:\s*\{/u.test(html) && /\bafter:\s*\{/u.test(html)],
  ["governed surface owns metadata colors", /\.proof-preview\.has-brand-surface\s+\.proof-meta/u.test(html)],
  ["governed surface owns object color", /\.proof-preview\.has-brand-surface\s+\.proof-object/u.test(html)],
  [
    "Try fixture resolves DNA to Measure and Voice to Ground",
    /state\.lens\s*===\s*"dna"[\s\S]{0,80}\?\s*"measure"[\s\S]{0,120}state\.lens\s*===\s*"voice"[\s\S]{0,80}\?\s*"ground"/u.test(html)
  ],
  [
    "Thai technical labels have the packaged companion face",
    /--font-technical-th:[^;]*"IBM Plex Sans Thai"/u.test(html) &&
      /--font-technical:[^;]*"JetBrains Mono"[^;]*"IBM Plex Sans Thai"/u.test(html) &&
      /ibm-plex-sans-thai-thai-400-normal\.woff2/u.test(html) &&
      /jetbrains-mono-latin-400-normal\.woff2/u.test(html)
  ],
  [
    "Thai technical companion has conservative optical tuning",
    /size-adjust:\s*102%/u.test(html) &&
      /--tracking-technical-th:\s*\.008em/u.test(html) &&
      /--leading-technical-th:\s*1\.48/u.test(html)
  ],
  [
    "direct-file Safari delivery hands off safely and exposes font failure",
    !/<link\b[^>]*\brel="preload"[^>]*\bas="font"/iu.test(html) &&
      html.includes('location.protocol === "file:"') &&
      html.includes('root.dataset.standalone !== "true"') &&
      html.includes('new URL("landometer-design-system-v0.9.0-standalone.html", location.href)') &&
      html.includes("target.search = location.search") &&
      html.includes("target.hash = location.hash") &&
      html.includes('location.replace(target.href)') &&
      html.includes('!["http:", "https:"].includes(location.protocol)') &&
      html.includes('{ key: "bodyThai400", descriptor: \'400 16px "Bai Jamjuree"\'') &&
      html.includes('{ key: "bodyThai600", descriptor: \'600 16px "Bai Jamjuree"\'') &&
      html.includes('{ key: "technicalThai400", descriptor: \'400 16px "IBM Plex Sans Thai"\'') &&
      html.includes('{ key: "displayThai700", descriptor: \'700 16px "IBM Plex Sans Thai Looped"\'') &&
      html.includes('{ key: "technicalLatin400", descriptor: \'400 16px "JetBrains Mono"\'') &&
      html.includes('{ key: "editorialLatin700", descriptor: \'700 16px "Arvo"\'') &&
      html.includes('root.dataset.fontDelivery = "pending"') &&
      html.includes("Promise.race([loadFonts, fontTimeout])") &&
      html.includes('reject(new Error("font-timeout"))') &&
      html.includes('faceGroups[index].every(face => face.status === "loaded")') &&
      html.includes('setFontFailureState(error?.message === "font-timeout" ? "timeout" : "failed")') &&
      html.includes('setFontFailureState("unavailable")') &&
      attributeOf(
        currentArtifactBuildHtml.match(/<html\b[^>]*>/iu)?.[0] ?? "",
        "data-standalone"
      ) === "true" &&
      (currentArtifactBuildHtml.match(/src:\s*url\(["']?data:font\/woff2/giu) ?? []).length === 10 &&
      !/<link\b[^>]*\brel=["']preload["'][^>]*\bas=["']font["']/iu.test(currentArtifactBuildHtml)
  ],
  [
    "technical pair exposes only active 400 while display 700 remains separate",
    /--weight-technical:\s*400/u.test(html) &&
      !/jetbrains-mono-latin-(?:500|700)-normal\.woff2/u.test(html) &&
      !/ibm-plex-sans-thai-(?:thai|latin)-(?:500|700)-normal\.woff2/u.test(html) &&
      !/@font-face\s*\{[^{}]*font-family:\s*"JetBrains Mono"[^{}]*font-weight:\s*(?:500|700)/gu.test(html) &&
      !/@font-face\s*\{[^{}]*font-family:\s*"IBM Plex Sans Thai"[^{}]*font-weight:\s*(?:500|700)/gu.test(html) &&
      /ibm-plex-sans-thai-looped-thai-700-normal\.woff2/u.test(html) &&
      /font-family:\s*"IBM Plex Sans Thai Looped"/u.test(html) &&
      /font-synthesis:\s*none/u.test(html)
  ],
  [
    "text and mixed-label actions use the shared pill geometry",
    /--radius-pill:\s*999px/u.test(html) &&
      Boolean(pillActionRule) &&
      /white-space:\s*normal/u.test(pillActionRule?.declarations ?? "") &&
      /text-align:\s*center/u.test(pillActionRule?.declarations ?? "")
  ],
  [
    "quiet header utilities remain 44 by 44 circles",
    /width:\s*44px/u.test(quietUtilityRule?.declarations ?? "") &&
      /min-height:\s*44px/u.test(quietUtilityRule?.declarations ?? "") &&
      /padding:\s*0/u.test(quietUtilityRule?.declarations ?? "") &&
      /border-radius:\s*50%/u.test(quietUtilityRule?.declarations ?? "")
  ],
  [
    "tabs fields selectors and cards stay outside the action-pill rule",
    componentGeometryExcluded
  ],
  [
    "browser-tab identity uses approved compact asset or truthful pending state",
    browserTabIdentityPairValid
  ],
  [
    "standalone browser-tab identity uses the stable cache-revisioned production URL",
    browserTabIdentityPairValid
  ],
  [
    "metadata and canonical agree with the release manifest",
    typeof manifestIndexable === "boolean" &&
      htmlIndexable === manifestIndexable &&
      /^https:\/\//u.test(canonicalHref) &&
      !/[?#]/u.test(canonicalHref) &&
      canonicalHref === manifestCanonical &&
      /<title>[^<]+<\/title>/iu.test(html) &&
      descriptionContent.trim().length > 0
  ],
  [
    "indexing metadata is gated by delivery and evidence state",
    htmlIndexable
      ? !/\bnoindex\b/iu.test(robotsContent) &&
        sourceLimitedOrInternal === false &&
        requiredOpenGraph.every(name =>
          openGraphTags.some(tag =>
            attributeOf(tag, "property").toLowerCase() === name
          )
        ) &&
        requiredTwitter.every(name =>
          twitterTags.some(tag =>
            attributeOf(tag, "name").toLowerCase() === name
          )
        ) &&
        ["th", "en", "x-default"].every(locale =>
          hreflangLinks.some(tag =>
            attributeOf(tag, "hreflang").toLowerCase() === locale
          )
        ) &&
        jsonLdValid &&
        sitemapPresent &&
        siteManifest?.publication?.structuredData === true &&
        siteManifest?.publication?.sitemap === true
      : /\bnoindex\b/iu.test(robotsContent) &&
        (
          !sourceLimitedOrInternal ||
          (
            openGraphTags.length === 0 &&
            twitterTags.length === 0 &&
            jsonLdBlocks.length === 0 &&
            hreflangLinks.length === 0 &&
            siteManifest?.publication?.structuredData === false &&
            siteManifest?.publication?.sitemap === false
          )
        )
  ],
  [
    "optional llms discovery is absent without claims or a hashed bounded aid",
    llmsNavigationValid
  ],
  [
    "one Color Set identity spans the page, sampler, atlas, and manifest",
    colorRegistryId === "color-srgb-04" &&
      attributeOf(htmlTag, "data-color-registry") === colorRegistryId &&
      attributeOf(samplerElement, "data-color-registry") === colorRegistryId &&
      attributeOf(
        elementsWithClass(atlasHtml, "atlas-root")[0] ?? "",
        "data-color-registry"
      ) === colorRegistryId &&
      siteManifest?.colorDelivery?.registryId === colorRegistryId
  ],
  [
    "the Color Set baseline stays immutable and handoff links the current immutable UI build",
    pinnedColorSetName ===
      "landometer-design-system-v0.9.0-standalone.color-srgb-04.html" &&
      tagsNamed(html, "a").some(tag =>
        attributeOf(tag, "id") === "resource-standalone" &&
        attributeOf(tag, "href") === currentArtifactBuildName
      ) &&
      attributeOf(
        pinnedColorSetHtml.match(/<html\b[^>]*>/iu)?.[0] ?? "",
        "data-color-registry"
      ) === colorRegistryId &&
      attributeOf(
        pinnedColorSetHtml.match(/<html\b[^>]*>/iu)?.[0] ?? "",
        "data-build-channel"
      ) === "immutable-color-set"
  ],
  [
    "UI-only changes mint a separate append-only artifact build without rewriting the Color Set baseline",
    /^ui-\d{8}-\d{2}$/u.test(currentArtifactBuildId) &&
      currentArtifactBuildName ===
        `landometer-design-system-v0.9.0-standalone.color-srgb-04.${currentArtifactBuildId}.html` &&
      attributeOf(
        currentArtifactBuildHtml.match(/<html\b[^>]*>/iu)?.[0] ?? "",
        "data-color-registry"
      ) === colorRegistryId &&
      attributeOf(
        currentArtifactBuildHtml.match(/<html\b[^>]*>/iu)?.[0] ?? "",
        "data-artifact-build"
      ) === currentArtifactBuildId &&
      attributeOf(
        currentArtifactBuildHtml.match(/<html\b[^>]*>/iu)?.[0] ?? "",
        "data-build-channel"
      ) === "immutable-artifact-build"
  ],
  [
    "Color Set source hashes match the packaged token and scale registries",
    /^[a-f0-9]{64}$/u.test(
      colorDelivery?.sources?.tokenRegistry?.sha256 ?? ""
    ) &&
      colorDelivery?.sources?.tokenRegistry?.sha256 ===
        sha256(tokenRegistrySource) &&
      colorDelivery?.sources?.scaleRegistry?.sha256 ===
        sha256(scaleRegistrySource)
  ],
  [
    "manual-gate record exists and remains open, not behavior evidence",
    manualGatesRemainOpen
  ],
  [
    "dark color-role emphasis uses the runtime theme attribute",
    /html\[data-theme="dark"\]\s+\.color-role-map span:first-child/u.test(html) &&
      !/\[data-resolved-theme="dark"\]\s+\.color-role-map/u.test(html)
  ],
  [
    "scale route consumes its declared class count",
    /grid-template-columns:\s*repeat\(var\(--route-class-count,\s*3\)/u.test(html)
  ],
  [
    "deep routes transfer focus to the revealed target",
    /revealTarget\(target,\s*true\)/u.test(html) &&
      /focusTarget\?\.focus\(\{\s*preventScroll:\s*true\s*\}\)/u.test(html)
  ],
  ["semantic recipe uses structured ordered list", /class="recipe-steps"/u.test(html)],
  ["no tab-indented numbered recipe item", !/\n\t+\d+\.\s/u.test(html)],
  ["six color teaching plates", (html.match(/class="color-plate(?:\s|")/gu) || []).length >= 6],
  ["no runtime color mixing", !/color-mix\(/u.test(html)],
  [
    "nine-family scale sampler has generated source boundary",
    samplerMarkersValid &&
      attributeOf(samplerElement, "data-scale-source-version") ===
        scaleFixture?.meta?.version &&
      Number(attributeOf(samplerElement, "data-scale-records")) ===
        scaleFixture?.meta?.records &&
      /SOURCE_LIMITED\s*·\s*REFERENCE FIXTURE\s*·\s*MACHINE VALIDATION PENDING/u
        .test(samplerHtml)
  ],
  [
    "scale sampler has six sequential and three diverging families",
    samplerKindsValid
  ],
  [
    "all scale-sampler families use exact light/dark 5/7/9 classes and versions",
    samplerExactClassesValid
  ],
  [
    "scale sampler uses 189 solid paired-theme cells",
    samplerCellsAreSolid
  ],
  [
    "concise color router and sampler deep-link to the first-class full atlas",
    fullAtlasRouteValid
  ],
  ["complete color atlas generated boundary", atlasMarkersValid],
  [
    "complete atlas retains all eight governed role families",
    [
      "identity", "foundation", "semantic", "gradients",
      "categorical", "dataviz", "map", "depth"
    ].every(family =>
      elementsWithClass(atlasHtml, `atlas-family--${family}`).length === 1
    )
  ],
  ["14 identity and asset-only color records", countClass(atlasHtml, "atlas-token-card") === 14],
  ["17 foundation pairs", countClass(atlasHtml, "atlas-pair-card") === 17],
  ["seven semantic-state cards", countClass(atlasHtml, "atlas-state-card") === 7],
  [
    "ten shared and motif gradient cards",
    countClass(atlasHtml, "atlas-gradient-card") === 10 &&
      countClass(atlasHtml, "atlas-gradient-card--shared") === 6 &&
      countClass(atlasHtml, "atlas-gradient-card--rare") === 1 &&
      countClass(atlasHtml, "atlas-gradient-card--motif") === 3
  ],
  [
    "four product-scoped gradients with eight theme specimens",
    elementsWithClass(atlasHtml, "atlas-product-card").length === 4 &&
      elementsWithClass(atlasHtml, "atlas-product-card").every(card =>
        /\bdata-scope="product-identity"/u.test(card)
      ) &&
      countClass(atlasHtml, "atlas-gradient-theme") === 8
  ],
  ["ten categorical series cards", countClass(atlasHtml, "atlas-series-card") === 10],
  ["18 quantitative scale records", countClass(atlasHtml, "atlas-scale-record") === 18],
  ["738 build-time LUT cells", countClass(atlasHtml, "atlas-lut-cell") === 738],
  ["378 build-time class cells", countClass(atlasHtml, "atlas-class-cell") === 378],
  [
    "all nine scales have one light and one dark record",
    scaleKeys.length === expectedScaleKeys.length &&
      expectedScaleKeys.every(key => scaleKeys.includes(key)) &&
      new Set(scaleKeys).size === expectedScaleKeys.length
  ],
  [
    "every scale has 41 LUT cells",
    scaleRecords.every(([, , body]) => countClass(body, "atlas-lut-cell") === 41)
  ],
  [
    "every scale has exact 5/7/9 class strips",
    scaleRecords.every(([, , body]) => {
      const rows = [...body.matchAll(
        /<figure class="atlas-class-row">([\s\S]*?)<\/figure>/gu
      )].map(match => ({
        label: Number(match[1].match(/<figcaption><strong>(\d+)<\/strong>/u)?.[1]),
        cells: countClass(match[1], "atlas-class-cell")
      }));
      return rows.length === 3 &&
        [5, 7, 9].every(size =>
          rows.some(row => row.label === size && row.cells === size)
        );
    })
  ],
  ["eight map cards", countClass(atlasHtml, "atlas-map-card") === 8],
  ["eight opacity rows", countClass(atlasHtml, "atlas-opacity-row") === 8],
  ["six depth roles", countClass(atlasHtml, "atlas-depth-step") === 6],
  [
    "LUT and class cells are solid values, not CSS gradients",
    atlasScaleCellElements.every(element =>
      !/(?:linear|radial|conic)-gradient\s*\(/iu.test(element)
    ) &&
      styleRules
        .filter(rule => /\.atlas-(?:lut(?:-cell)?|class-(?:cells|cell))\b/u.test(rule.selector))
        .every(rule =>
          !/(?:linear|radial|conic)-gradient\s*\(/iu.test(rule.declarations)
        )
  ],
  [
    "source-limited generated-scale boundary",
    /SOURCE_LIMITED\s*·\s*REFERENCE FIXTURE\s*·\s*MACHINE VALIDATION PENDING/u.test(atlasHtml) &&
      /not a scale-gate-cleared dataviz\.tokens\.json package/iu.test(atlasHtml) &&
      /not to claim production conformance/iu.test(atlasHtml)
  ],
  [
    "atlas disclosure is present in inventory",
    inventory?.controls?.some(control => control.id === "complete-color-atlas-toggle") === true
  ],
  [
    "semantic states never consume series-outlier",
    semanticDangerWarningRules.every(rule =>
      !/var\(--series-outlier\)/u.test(rule.declarations)
    )
  ],
  [
    "series-outlier remains nominal chart styling",
    seriesOutlierConsumers.length > 0 &&
      seriesOutlierConsumers.every(rule =>
        /(?:dataviz|chart)[\s\S]*(?:is-)?outlier/iu.test(rule.selector)
      )
  ],
  [
    // The master (5.13) omits generic scroll reveal "unless it expresses a real reading or
    // decision order", and 5.13A [REVEAL-01] is the only entrance that qualifies. This check
    // previously banned the mechanism (IntersectionObserver, scroll listeners) outright, which
    // was stricter than the rule it enforces. It now bans decoration and requires that any
    // scroll mechanism present is the [REVEAL-01] contract with its reader guards intact.
    "no parallax or generic scroll-reveal engine",
    !/\bScrollTimeline\b|animation-timeline\s*:|scroll-timeline\s*:/iu.test(scriptSource) &&
      !/\b(?:data-parallax|class="[^"]*\bparallax\b|id="[^"]*\bparallax\b|data-scroll-reveal|class="[^"]*\bscroll-reveal\b)/iu.test(html) &&
      (
        !/\bIntersectionObserver\b|addEventListener\(\s*["']scroll["']/iu.test(scriptSource) ||
        (
          /data-riddim-reveal/u.test(html) &&
          /data-riddim-landed/u.test(html) &&
          /reducedMotionQuery\s*&&\s*reducedMotionQuery\.matches/u.test(scriptSource) &&
          /self\.unobserve\(entry\.target\)/u.test(scriptSource) &&
          /riddimLandReached/u.test(scriptSource) &&
          /details:not\(\[open\]\)/u.test(scriptSource)
        )
      )
  ],
  [
    // [REVEAL-01] rule 5: the hidden state is gated so reduce and no-JS never receive it.
    "reveal entrance is gated on script and reduced motion",
    /html\[data-reveal="on"\]\s*\[data-riddim-reveal\]/u.test(html) &&
      /prefers-reduced-motion:\s*reduce[\s\S]{0,400}data-riddim-reveal/u.test(html)
  ],
  [
    // [REVEAL-01] rule 4: opacity and transform only — no layout property may be animated.
    "reveal entrance moves nothing but opacity and transform",
    (() => {
      const block = html.match(/html\[data-reveal="on"\] \[data-riddim-reveal\] \{([\s\S]*?)\}/u);
      if (!block) return false;
      return !/\b(height|width|margin|padding|top|left|right|bottom|inset|display|position)\s*:/u.test(block[1]);
    })()
  ],
  ["opportunity cards receive visual flow", /decorateOpportunityCards\(\)/u.test(html)],
  ["rounded outline icon contract", /stroke-linecap:\s*round/u.test(html) && /stroke-linejoin:\s*round/u.test(html)]
];

let failed = 0;
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} · ${name}`);
  if (!pass) failed += 1;
}

if (failed) {
  console.error(`\n${failed} experience contract check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} experience contract checks passed.`);
