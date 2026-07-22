import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../deployment");
const dataDir = resolve(root, "assets/data");
const downloadDir = resolve(root, "assets/downloads");
mkdirSync(dataDir, { recursive: true });
mkdirSync(downloadDir, { recursive: true });

const foundation = {
  "surface.canvas": ["#F6F7F3", "#11191D"],
  "surface.alt": ["#EEF1EE", "#172126"],
  "surface.card": ["#FCFCFA", "#20292D"],
  "surface.raised": ["#FFFFFF", "#293337"],
  "surface.soft": ["#E5E9E6", "#2B3534"],
  "surface.blueTint": ["#E2E9ED", "#18333E"],
  "surface.beigeTint": ["#F2F1DF", "#2C2A22"],
  "text.primary": ["#182327", "#F1F4EF"],
  "text.secondary": ["#5F635A", "#C4CECA"],
  "text.metadata": ["#686354", "#A6B5B1"],
  "text.muted": ["#8B877A", "#8D9D99"],
  "text.disabled": ["#B6AD98", "#71817D"],
  "border.hairline": ["#DCE1DD", "#33403D"],
  "border.default": ["#C9D0CB", "#46524F"],
  "border.emphasis": ["#7D877F", "#7C8A84"],
  "interaction.accent": ["#176B82", "#68C4E2"],
  "interaction.focus.ring": ["#176B82", "#68C4E2"]
};

const semantic = {
  success: { light: ["#E2F4E5", "#126B49"], dark: ["#17362D", "#72E8C4"] },
  warning: { light: ["#FFF1D1", "#795300"], dark: ["#3B2E16", "#F5C15C"] },
  danger: { light: ["#FCE5DF", "#B43A3A"], dark: ["#3A1F21", "#FF7C72"] },
  info: { light: ["#E8EEF0", "#176B82"], dark: ["#18333E", "#68C4E2"] },
  neutral: { light: ["#ECE4D2", "#5F635A"], dark: ["#2B3534", "#C4CECA"] },
  pending: { light: ["#F3EEDB", "#686354"], dark: ["#2C2A22", "#D8CFB2"] },
  assisted: { light: ["#DFF3F1", "#176C67"], dark: ["#163331", "#79D9D1"] }
};

const series = [
  ["series.01", "Coral", "#C33F55", "#FF6B7F", "circle / solid"],
  ["series.02", "Signal Orange", "#C52C00", "#FF8A4C", "square / solid"],
  ["series.03", "Marigold", "#846100", "#F4C44E", "triangle / solid"],
  ["series.04", "Lime", "#5D7400", "#B5E34E", "diamond / solid"],
  ["series.05", "Green", "#007A58", "#3BD19B", "cross / solid"],
  ["series.06", "Aqua", "#007E79", "#3BD3CB", "star / solid"],
  ["series.07", "Sky", "#147A9F", "#59C7E8", "hexagon / diagonal45"],
  ["series.08", "Ocean", "#1F629B", "#4C99D5", "ring / diagonal135"],
  ["series.09", "Civic Slate", "#536B70", "#A9C4C7", "dash / dot"],
  ["series.10", "Warm Pink", "#B23F74", "#F06FA6", "plus / crosshatch"]
].map(([id, name, light, dark, cue]) => ({ id, name, light, dark, cue }));

const scales = {
  growth: { kind: "sequential", light: ["#F2F1DF", "#55B8C2", "#126F68"], dark: ["#6F8984", "#53BDD0", "#86E0B8"] },
  water: { kind: "sequential", light: ["#F2F1DF", "#55B8C2", "#206C9A"], dark: ["#6C838C", "#55B8C2", "#68C4E2"] },
  risk: { kind: "sequential", light: ["#F2F1DF", "#E0B443", "#B74436"], dark: ["#85837A", "#D0A42F", "#FF8C7D"] },
  activity: { kind: "sequential", light: ["#F2F1DF", "#E86A8C", "#C52C00"], dark: ["#808A96", "#F079A1", "#FFB06A"] },
  density: { kind: "sequential", light: ["#F2F1DF", "#6797AF", "#225F78"], dark: ["#728C9A", "#47A6C4", "#9BE4F2"] },
  confidence: { kind: "sequential", light: ["#F2F1DF", "#85A5A2", "#08756F"], dark: ["#7C8B8C", "#95A9AA", "#D8E6E5"] },
  balance: { kind: "diverging", light: ["#C52C00", "#F2F1DF", "#186A9E"], dark: ["#FF8A4C", "#827C68", "#4FAFE0"] },
  delta: { kind: "diverging", light: ["#B74436", "#F2F1DF", "#007C78"], dark: ["#F28575", "#827C68", "#55C8BC"] },
  tradeoff: { kind: "diverging", light: ["#9E476F", "#F2F1DF", "#007E91"], dark: ["#E982AE", "#827C68", "#61C2D3"] }
};

const tokens = {
  meta: {
    designSystem: "Landometer",
    version: "0.8.6",
    tokenSchemaVersion: 6,
    machineValidation: "pending",
    status: "canonical active authoring subset; generated schema/preflight package pending",
    sourceRule: "TOKEN-01"
  },
  brand: { blue: "#1D4497", beige: "#F2F1DF", darkBeige: "#D8CFB2" },
  energy: { sky: "#59D2FE", mint: "#0AD69C", coral: "#FF5A5F", yellow: "#FFBC1F" },
  foundation,
  semantic,
  signature: {
    closingLight: "linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)",
    closingDark: "linear-gradient(135deg, #68C4E2 0%, #15919A 52%, #08756F 100%)"
  },
  product: {
    citymeter: { light: ["#12669B", "#36BCE4"], dark: ["#4C99D5", "#59C7E8"] },
    citywiki: { light: ["#176B82", "#007E79"], dark: ["#59C7E8", "#3BD3CB"] },
    citychat: { light: ["#007A58", "#007E79"], dark: ["#3BD19B", "#3BD3CB"] },
    ijji: { light: ["#C52C00", "#B23F74"], dark: ["#FF8A4C", "#F06FA6"] }
  },
  series: { registryId: "landometer-series-10-v5", values: series },
  scales: Object.fromEntries(Object.entries(scales).map(([id, value]) => [id, { ...value, sourceRule: "DATAVIZ-01 / TOKEN-01" }])),
  dataState: {
    noData: { light: "#D5DAD6", dark: "#404844", cue: "diagonal pattern + label" },
    zero: { light: "#7D877F", dark: "#A59A80", cue: "distinct outline only when zero is a fact" }
  },
  map: {
    activeLayer: ["#347DA8", "#65B6DB"],
    hoverStroke: ["#347DA8", "#65B6DB"],
    selectedStroke: ["#176B82", "#68C4E2"],
    focusStroke: ["#176B82", "#68C4E2"],
    markerHalo: ["#FFFFFF", "#101318"],
    markerStroke: ["#182327", "#F1F4EF"]
  },
  type: {
    caption: ".75rem", label: ".8125rem", bodySm: ".875rem", body: "1rem", bodyLg: "1.125rem",
    h3: "clamp(1.35rem, 2vw, 1.75rem)", h2: "clamp(2rem, 4vw, 3.25rem)",
    h1En: "clamp(3.25rem, 7vw, 6.5rem)", h1Th: "clamp(2.5rem, 6vw, 5rem)"
  },
  spacing: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128],
  radius: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, pill: 999 },
  container: { reading: 760, default: 1120, wide: 1280 },
  breakpoint: { xs: 360, sm: 600, md: 900, lg: 1200, xl: 1600 },
  motion: {
    durationFeedback: 120, durationState: 200, durationMap: 280, durationChart: 360,
    durationReveal: 400, durationEmphasis: 560, delayStagger: 60, delayStaggerCap: 240,
    distanceFeedback: 2, distanceReveal: 12,
    easeState: "cubic-bezier(.2,0,0,1)", easeEnter: "cubic-bezier(.16,1,.3,1)"
  }
};

function hexToRgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => v / 255);
}

function srgbToLinear(v) {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(v) {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * (v ** (1 / 2.4)) - 0.055;
}

function rgbToOklab(rgb) {
  const [r, g, b] = rgb.map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
}

function oklabToLinearRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ];
}

function inGamut(linear) {
  return linear.every(v => v >= -1e-9 && v <= 1 + 1e-9);
}

function gamutMap(lab) {
  let linear = oklabToLinearRgb(lab);
  if (inGamut(linear)) return linear;
  const [L, a, b] = lab;
  const C = Math.hypot(a, b);
  const h = Math.atan2(b, a);
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    const candidate = oklabToLinearRgb([L, Math.cos(h) * mid, Math.sin(h) * mid]);
    if (inGamut(candidate)) lo = mid;
    else hi = mid;
  }
  linear = oklabToLinearRgb([L, Math.cos(h) * lo, Math.sin(h) * lo]);
  return linear;
}

function toHex(linear) {
  return `#${linear.map(v => {
    const channel = Math.min(1, Math.max(0, linearToSrgb(v)));
    return Math.floor(channel * 255 + 0.5).toString(16).padStart(2, "0").toUpperCase();
  }).join("")}`;
}

function interpolate(a, b, t) {
  return a.map((v, i) => v + (b[i] - v) * t);
}

function makeLut(anchors) {
  const labs = anchors.map(hex => rgbToOklab(hexToRgb(hex)));
  const lut = [];
  for (let i = 0; i <= 40; i += 1) {
    const lab = i <= 20 ? interpolate(labs[0], labs[1], i / 20) : interpolate(labs[1], labs[2], (i - 20) / 20);
    lut.push(toHex(gamutMap(lab)));
  }
  lut[0] = anchors[0];
  lut[20] = anchors[1];
  lut[40] = anchors[2];
  return lut;
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
  return JSON.stringify(value);
}

const scaleRecords = [];
for (const [id, definition] of Object.entries(scales)) {
  for (const theme of ["light", "dark"]) {
    const lut = makeLut(definition[theme]);
    const classes = {};
    for (const n of [5, 7, 9]) {
      classes[n] = Array.from({ length: n }, (_, k) => lut[Math.round(k * 40 / (n - 1))]);
    }
    const parity = {
      scaleId: id,
      kind: definition.kind,
      theme,
      anchors: definition[theme],
      positions: [0, 20, 40],
      interpolation: "OKLab two-segment; preserve L/hue and reduce OKLCH chroma with 24 binary-search iterations when out of sRGB gamut",
      lut,
      classes,
      noData: theme === "light" ? "#D5DAD6" : "#404844",
      zero: theme === "light" ? "#7D877F" : "#A59A80",
      classificationMethod: "reference fixture; domain and thresholds supplied by consuming analysis",
      outlierPolicy: "explicit; never silently clamp a material outlier"
    };
    const scaleVersion = createHash("sha256").update(stable(parity)).digest("hex");
    scaleRecords.push({ ...parity, scaleVersion });
  }
}

const cssPairs = Object.entries(foundation).map(([id, [light, dark]]) => ({ id, light, dark }));
const css = `/* Landometer Design System v0.8.6 — active authoring subset\n   Machine schema/preflight validation remains pending. */\n:root {\n  --brand-blue: #1D4497;\n  --brand-beige: #F2F1DF;\n  --energy-sky: #59D2FE;\n  --energy-mint: #0AD69C;\n  --energy-coral: #FF5A5F;\n  --energy-yellow: #FFBC1F;\n${cssPairs.map(({ id, light }) => `  --${id.replaceAll(".", "-")}: ${light};`).join("\n")}\n  --type-caption: .75rem; --type-label: .8125rem; --type-body-sm: .875rem;\n  --type-body: 1rem; --type-body-lg: 1.125rem;\n  --type-h3: clamp(1.35rem, 2vw, 1.75rem);\n  --type-h2: clamp(2rem, 4vw, 3.25rem);\n  --type-h1-en: clamp(3.25rem, 7vw, 6.5rem);\n  --type-h1-th: clamp(2.5rem, 6vw, 5rem);\n  --space-0: 0; --space-1: 4px; --space-2: 8px; --space-3: 12px;\n  --space-4: 16px; --space-5: 24px; --space-6: 32px; --space-7: 48px;\n  --space-8: 64px; --space-9: 96px; --space-10: 128px;\n  --radius-xs: 6px; --radius-sm: 10px; --radius-md: 16px;\n  --radius-lg: 24px; --radius-xl: 32px; --radius-pill: 999px;\n  --container-reading: 760px; --container-default: 1120px; --container-wide: 1280px;\n  --gutter-mobile: 16px; --gutter-tablet: 24px; --gutter-desktop: 32px;\n  --motion-duration-feedback: 120ms; --motion-duration-state: 200ms;\n  --motion-duration-map: 280ms; --motion-duration-chart: 360ms;\n  --motion-duration-reveal: 400ms; --motion-duration-emphasis: 560ms;\n  --motion-delay-stagger: 60ms; --motion-delay-stagger-cap: 240ms;\n  --motion-distance-feedback: 2px; --motion-distance-reveal: 12px;\n  --motion-ease-state: cubic-bezier(.2,0,0,1);\n  --motion-ease-enter: cubic-bezier(.16,1,.3,1);\n}\n:root[data-theme=\"dark\"] {\n${cssPairs.map(({ id, dark }) => `  --${id.replaceAll(".", "-")}: ${dark};`).join("\n")}\n}\n`;

const components = {
  meta: { version: "0.8.6", sourceRule: "CTRL-02", machineValidation: "pending" },
  components: [
    { id: "BrandSignature", contract: ["approved asset", "intrinsic ratio", "no redraw/recolor/animation"] },
    { id: "Button", contract: ["native button", "intent label", "visible focus", "busy/disabled state", "44px target"] },
    { id: "Link", contract: ["real destination", "clear label", "visible focus", "external cue when useful"] },
    { id: "FormField", contract: ["label", "help", "associated error", "retained input", "recovery"] },
    { id: "DecisionCard", contract: ["object", "metric/status", "meaning", "evidence", "one action"] },
    { id: "SourceLedger", contract: ["source", "publisher", "date", "supported claim", "limitation"] },
    { id: "TrustBadge", contract: ["visible status matches publication and index policy"] },
    { id: "DataTable", contract: ["caption", "headers", "numeric alignment", "mobile strategy"] },
    { id: "MapLegend", contract: ["layer", "method", "units/classes", "no-data", "source/date", "limitation"] },
    { id: "EmptyState", contract: ["what is unavailable", "why", "honest next action"] },
    { id: "ErrorState", contract: ["what failed", "preserved state", "retry or alternative"] },
    { id: "Dialog", contract: ["name", "visible close", "focus containment/return", "Escape", "inert background"] },
    { id: "Toast", contract: ["non-blocking status only", "never sole critical message"] }
  ]
};

const proofIds = [
  "reward-before-request", "decision-quality", "private-by-default", "relevant-circle-coordination",
  "recovery-completeness", "cta-integrity", "transparent-learning", "voluntary-investment",
  "hook-without-dark-patterns", "cross-team-handoff"
];
const fixtures = {
  meta: { designSystem: "Landometer", version: "0.8.6", profile: "designsystem.adoption", effect: "none" },
  referenceFixtures: proofIds.map((id, index) => ({
    id,
    packs: id.includes("learning") || id.includes("investment") ? ["LEARN-01", "REFERENCE-01"] : ["REFERENCE-01"],
    demonstratedCapabilities: ["local_reference_state"],
    baselineAssisted: index < 6,
    localStateOnly: true,
    effect: "none"
  })).concat([
    { id: "scale-lab", packs: ["DATAVIZ-01", "REFERENCE-01"], demonstratedCapabilities: ["dataVisualization"], localStateOnly: true, effect: "none" },
    { id: "map-lab", packs: ["MAP-01", "DATAVIZ-01", "REFERENCE-01"], demonstratedCapabilities: ["map", "dataVisualization"], localStateOnly: true, effect: "none" },
    { id: "typography-lab", packs: ["TYPE-01", "REFERENCE-01"], demonstratedCapabilities: ["typography"], localStateOnly: true, effect: "none" },
    { id: "motion-lab", packs: ["MOTION-01", "REFERENCE-01"], demonstratedCapabilities: ["motionEnhancement"], localStateOnly: true, effect: "none" },
    { id: "state-lab", packs: ["STATE-01", "CTRL-02", "REFERENCE-01"], demonstratedCapabilities: ["component_states"], localStateOnly: true, effect: "none" }
  ])
};

const buildCardTemplate = `# Landometer Design System v0.8.6 — Build Card starter\n# Complete every required blank before writing UI.\nlandometerBuild:\n  dsVersion: 0.8.6\n  schemas:\n    buildCard: 0.8.6\n    manifest: pending_0.8.6_generation\n    tokens: 6\n  artifact:\n    name: \"\"\n    product: landometer\n    profile: designsystem.adoption\n    pageKind: \"\"\n    pageKindSourceRef: \"\"\n    delivery: deployable_public\n    language: th\n    additionalLanguages: [en]\n    generationMode: not_applicable\n    outputType: webpage\n  publication:\n    evidenceStatus: provisional\n    visibility: public\n    indexable: false\n    canonicalUrl: \"\"\n  audience:\n    primary: \"\"\n    role: \"\"\n  experience:\n    trigger: \"\"\n    oneJob: \"\"\n    promisedOutcome: \"\"\n    firstAha: \"\"\n    ahaEvidenceCue: \"\"\n    primaryAction: \"\"\n    nextUsefulAction: \"\"\n    nextTriggerOrCleanCompletion: \"\"\n    dominantObject: \"\"\n    channelParityKey: \"\"\n    brandSignatures: []\n    cleanCompletion: \"\"\n  brandAlignment:\n    productStatement: \"\"\n    proofObject: \"\"\n    ahaProvesPromise: false\n    networkAdvancesObjective: false\n  proof:\n    kind: brand\n    object: \"\"\n    sourceStatus: official\n    limitation: \"\"\n  theme:\n    mode: interactive_auto\n    support: dual\n    default: system\n    visibleOverride: true\n  motion:\n    intensity: guided\n  capabilities:\n    analyticalEvidence: false\n    motionEnhancement: true\n    search: false\n    share: false\n    map: false\n    dataVisualization: false\n    coCreation: false\n    persistence: false\n    externalSideEffect: false\n    authentication: false\n    permissions: false\n    contextDiscovery: false\n    agentReadable: false\n    boundedAgentAction: false\n    fullLivingReference: false\n  privacy:\n    personalData: false\n    sensitivity: public\n    redactedPublicProjection: false\n  telemetry:\n    enabled: false\n    scope: none\n  network:\n    mode: reference_ready\n    action: none\n    recipientOutcome: \"\"\n  qa:\n    evidencePath: \"\"\n    controlInventoryPath: \"control-inventory.json\"\n`;

const componentRecipes = `# Landometer component recipes v0.8.6\n\nMachine schema/preflight validation is pending. These recipes implement the human-readable normative master.\n\n## DecisionCard\n\nOrder: Object → status/metric → meaning → evidence/limit → one next useful action.\n\nRequired fields: object ID/version, truth status, source/date, limitation, next action or deliberate clean completion. Missing is never zero. Partial is never success.\n\n## SourceLedger\n\nShow source, publisher, date, supported claim, boundary, limitation, and allowed use. Keep material source/date/confidence beside the claim; disclose full method when requested.\n\n## Button\n\nUse a native button with one intent, 44px minimum target, visible focus, pending/disabled reason, authoritative receipt, duplicate-action protection, and failure recovery.\n\n## Empty and error states\n\nKeep the governed object and user input visible. Say what is unavailable, why, what remains possible, and how to retry or continue safely.\n\n## MapLegend\n\nKeep geometry, selected object, legend, readout, source/date, classification, limitation, and accessible table synchronized from one state.\n`;

const voiceRecipes = `# Landometer voice recipes v0.8.6\n\nUse specific nouns, active verbs, natural Thai or English, and a visible truth boundary. Lead with the object, result, question, or action.\n\n## Strong\n\n- Compare flood history for these two municipalities.\n- Updated 11 July 2026 from the named source.\n- This estimate excludes informal listings.\n- ลองกับงานของฉัน\n- ดูว่าอะไรเปลี่ยน และทีมถัดไปทำงานต่อง่ายขึ้นอย่างไร\n\n## Avoid\n\n- Unlock transformative data-driven insights.\n- Shared meaning creates room for brave work.\n- One governed decision language for every handoff.\n- X is not Y; it is Z.\n\n## Claim recipe\n\nObject + result/status + source/date + limitation + next safe action.\n\nExample: “ข้อมูลพื้นที่นี้ยังไม่พร้อมใช้ตัดสินใจ แหล่งข้อมูลยังไม่เชื่อมต่อ ตรวจสอบ Source Ledger ก่อนสรุปผล”\n`;

writeFileSync(resolve(dataDir, "tokens.json"), `${JSON.stringify(tokens, null, 2)}\n`);
writeFileSync(resolve(dataDir, "scales.json"), `${JSON.stringify({ meta: { version: "0.8.6", algorithm: "TOKEN-01 A6", records: 18 }, scales: scaleRecords }, null, 2)}\n`);
writeFileSync(resolve(dataDir, "components.json"), `${JSON.stringify(components, null, 2)}\n`);
writeFileSync(resolve(dataDir, "fixtures.json"), `${JSON.stringify(fixtures, null, 2)}\n`);
writeFileSync(resolve(downloadDir, "landometer-tokens.css"), css);
writeFileSync(resolve(downloadDir, "landometer-tokens.json"), `${JSON.stringify(tokens, null, 2)}\n`);
writeFileSync(resolve(downloadDir, "landometer-tokens.ts"), `export const landometerTokens = ${JSON.stringify(tokens, null, 2)} as const;\n`);
writeFileSync(resolve(downloadDir, "build-card-template.yaml"), buildCardTemplate);
writeFileSync(resolve(downloadDir, "component-recipes.md"), componentRecipes);
writeFileSync(resolve(downloadDir, "voice-recipes.md"), voiceRecipes);
writeFileSync(resolve(downloadDir, "reference-fixtures.json"), `${JSON.stringify(fixtures, null, 2)}\n`);

console.log(JSON.stringify({ tokenKeys: Object.keys(tokens).length, scaleRecords: scaleRecords.length, proofFixtures: proofIds.length }, null, 2));
