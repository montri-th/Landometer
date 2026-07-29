#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Usage: check-experience-contracts.mjs <html-file>");
  process.exit(2);
}

const html = await readFile(file, "utf8");

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
      path.join(path.dirname(path.resolve(file)), "control-inventory.v0.8.8.json"),
      "utf8"
    )
  );
} catch {
  inventory = null;
}

const checks = [
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
      /ibm-plex-sans-thai-thai-500-normal\.woff2/u.test(html)
  ],
  [
    "Thai technical companion has conservative optical tuning",
    /size-adjust:\s*102%/u.test(html) &&
      /--tracking-technical-th:\s*\.008em/u.test(html) &&
      /--leading-technical-th:\s*1\.48/u.test(html)
  ],
  [
    "technical pair exposes one active 500 weight",
    !/jetbrains-mono-latin-700-normal\.woff2/u.test(html) &&
      !/@font-face\s*\{[^{}]*font-family:\s*"JetBrains Mono"[^{}]*font-weight:\s*700/gu.test(html) &&
      /font-synthesis:\s*none/u.test(html)
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
  ["complete color atlas generated boundary", atlasMarkersValid],
  ["17 foundation pairs", countClass(atlasHtml, "atlas-pair-card") === 17],
  ["seven semantic-state cards", countClass(atlasHtml, "atlas-state-card") === 7],
  [
    "five shared and motif gradient cards",
    countClass(atlasHtml, "atlas-gradient-card") === 5 &&
      countClass(atlasHtml, "atlas-gradient-card--shared") === 2 &&
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
    "no parallax or generic scroll-reveal engine",
    !/\bIntersectionObserver\b|\bScrollTimeline\b|animation-timeline\s*:|scroll-timeline\s*:|addEventListener\(\s*["']scroll["']/iu.test(scriptSource) &&
      !/\b(?:data-parallax|class="[^"]*\bparallax\b|id="[^"]*\bparallax\b|data-scroll-reveal|class="[^"]*\bscroll-reveal\b)/iu.test(html)
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
