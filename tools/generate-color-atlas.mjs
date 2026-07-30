#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, "..");
const SCALE_SOURCE = path.join(
  PROJECT_ROOT,
  "deployment",
  "assets",
  "data",
  "scales.json",
);
const COLOR_DELIVERY_SOURCE = path.join(
  PROJECT_ROOT,
  "deployment",
  "assets",
  "data",
  "color-delivery.v0.8.8.json",
);
const TOKEN_SOURCE = path.join(
  PROJECT_ROOT,
  "deployment",
  "assets",
  "data",
  "tokens.json",
);
const OUTPUT_PATH = path.join(
  tmpdir(),
  "landometer-color-atlas.fragment.html",
);
const INDEX_PATH = path.join(PROJECT_ROOT, "deployment", "index.html");
const START_MARKER = "<!-- COLOR_ATLAS_START -->";
const END_MARKER = "<!-- COLOR_ATLAS_END -->";
const SAMPLER_START_MARKER = "<!-- COLOR_SCALE_SAMPLER_START -->";
const SAMPLER_END_MARKER = "<!-- COLOR_SCALE_SAMPLER_END -->";

const identityColors = [
  {
    id: "brand.blue",
    value: "#1D4497",
    th: "อัตลักษณ์หลักของ Landometer",
    en: "Protected Landometer identity",
    group: "brand",
  },
  {
    id: "brand.beige",
    value: "#F2F1DF",
    th: "บริบทแบรนด์โทนอุ่น",
    en: "Warm brand context",
    group: "brand",
  },
  {
    id: "dark.brand.beige",
    value: "#D8CFB2",
    th: "จุดเน้นโทนอุ่นบนพื้นมืด ไม่ใช่สีข้อความหลัก",
    en: "Warm dark-theme accent, not default text",
    group: "brand",
  },
  {
    id: "energy.sky",
    value: "#59D2FE",
    th: "พลังมนุษย์และวัฒนธรรม",
    en: "Human and cultural expression",
    group: "energy",
  },
  {
    id: "energy.mint",
    value: "#0AD69C",
    th: "พลังมนุษย์และวัฒนธรรม",
    en: "Human and cultural expression",
    group: "energy",
  },
  {
    id: "energy.coral",
    value: "#FF5A5F",
    th: "พลังมนุษย์และวัฒนธรรม ต้องทดสอบสีตัวอักษร",
    en: "Human expression; test its foreground",
    group: "energy",
  },
  {
    id: "energy.yellow",
    value: "#FFBC1F",
    th: "พลังมนุษย์และวัฒนธรรม",
    en: "Human and cultural expression",
    group: "energy",
  },
];

const logoAssetColors = [
  ["logo.blue", "#1D4497"],
  ["logo.mint", "#0AD69C"],
  ["logo.sky", "#59D2FE"],
  ["logo.cyan", "#0194CA"],
  ["logo.yellow", "#FFBC1F"],
  ["logo.coral", "#FF5A5F"],
  ["logo.gray", "#757575"],
].map(([id, value]) => ({ id, value }));

const foundationPairs = [
  ["surface.canvas", "#F6F7F3", "#11191D"],
  ["surface.alt", "#EEF1EE", "#172126"],
  ["surface.card", "#FCFCFA", "#20292D"],
  ["surface.raised", "#FFFFFF", "#293337"],
  ["surface.soft", "#E5E9E6", "#2B3534"],
  ["surface.blueTint", "#E2E9ED", "#18333E"],
  ["surface.beigeTint", "#F2F1DF", "#2C2A22"],
  ["text.primary", "#182327", "#F1F4EF"],
  ["text.secondary", "#5F635A", "#C4CECA"],
  ["text.metadata", "#686354", "#A6B5B1"],
  ["text.muted", "#8B877A", "#8D9D99"],
  ["text.disabled", "#B6AD98", "#71817D"],
  ["border.hairline", "#DCE1DD", "#33403D"],
  ["border.default", "#C9D0CB", "#46524F"],
  ["border.emphasis", "#7D877F", "#7C8A84"],
  ["interaction.accent", "#176B82", "#68C4E2"],
  ["interaction.focus.ring", "#176B82", "#68C4E2"],
].map(([id, light, dark]) => ({ id, light, dark }));

const semanticPairs = [
  ["success", "#E2F4E5", "#126B49", "#17362D", "#72E8C4", "สำเร็จ", "Success", "source"],
  ["warning", "#FFF1D1", "#795300", "#3B2E16", "#F5C15C", "เตือน", "Warning", "micro"],
  ["danger", "#FCE5DF", "#B43A3A", "#3A1F21", "#FF7C72", "อันตราย", "Danger", "micro"],
  ["info", "#E8EEF0", "#176B82", "#18333E", "#68C4E2", "ข้อมูล", "Info", "source"],
  ["neutral", "#ECE4D2", "#5F635A", "#2B3534", "#C4CECA", "เป็นกลาง", "Neutral", "layers"],
  ["pending", "#F3EEDB", "#686354", "#2C2A22", "#D8CFB2", "รอดำเนินการ", "Pending", "calendar"],
  ["assisted", "#DFF3F1", "#176C67", "#163331", "#79D9D1", "มีตัวช่วย", "Assisted", "people"],
].map(([id, lightFill, lightInk, darkFill, darkInk, th, en, icon]) => ({
  id,
  lightFill,
  lightInk,
  darkFill,
  darkInk,
  th,
  en,
  icon,
}));

const sharedGradients = [
  {
    id: "signature.gradient.closing.light",
    theme: "light",
    css: "linear-gradient(135deg, #1D4497 0%, #176B82 54%, #08756F 100%)",
    stops: "#1D4497 0% · #176B82 54% · #08756F 100%",
    th: "ฉาก Measure และช่วงปิดงานบนธีมสว่าง",
    en: "Measure atmosphere and closing scene in light theme",
    job: "Measure · entry / orientation / closure",
    foreground: "glyph sampling → deterministic scrim or opaque panel when needed",
  },
  {
    id: "signature.gradient.closing.dark",
    theme: "dark",
    css: "linear-gradient(135deg, #68C4E2 0%, #15919A 52%, #08756F 100%)",
    stops: "#68C4E2 0% · #15919A 52% · #08756F 100%",
    th: "ฉาก Measure และช่วงปิดงานบนธีมมืด",
    en: "Measure atmosphere and closing scene in dark theme",
    job: "Measure · entry / orientation / closure",
    foreground: "glyph sampling → deterministic scrim or opaque panel when needed",
  },
];

const motifGradients = [
  {
    id: "motif.gradient.brandSignature",
    css: "linear-gradient(135deg, #1D4497 0%, #176B82 52%, #08756F 100%)",
    stops: "#1D4497 0% → #176B82 52% → #08756F 100%",
    th: "เฉพาะ motif asset ที่ผ่าน gate แล้ว",
    en: "Only for a separately approved motif asset",
    job: "asset-gated motif only",
    foreground: "not a general-purpose surface token",
  },
  {
    id: "motif.gradient.civicCool",
    css: "linear-gradient(135deg, #147A9F 0%, #3BD3CB 52%, #3BD19B 100%)",
    stops: "#147A9F 0% → #3BD3CB 52% → #3BD19B 100%",
    th: "Ground: เผยบริบทและทำให้หลักฐานเข้าใจง่ายขึ้น",
    en: "Ground: context reveal and evidence becoming understandable",
    job: "Ground · context reveal / transition",
    foreground: "sampled contrast → deterministic scrim or opaque panel",
  },
  {
    id: "motif.gradient.civicWarm",
    css: "linear-gradient(135deg, #C33F55 0%, #FF8A4C 52%, #F4C44E 100%)",
    stops: "#C33F55 0% → #FF8A4C 52% → #F4C44E 100%",
    th: "Cultivate: การลงมือทำ โมเมนตัม และความสำเร็จ",
    en: "Cultivate: action, credible momentum, and completion",
    job: "Cultivate · momentum / completion",
    foreground: "sampled contrast → deterministic scrim or opaque panel",
  },
];

const productGradientPairs = [
  ["citymeter", "#12669B", "#36BCE4", "#4C99D5", "#59C7E8", "CityMETER", "Light: ห้ามวางตัวอักษรเปล่า ใช้ opaque panel/scrim · Dark: mineral ≥5.22:1", "Light: no bare foreground; use an opaque panel/scrim · Dark: mineral ≥5.22:1"],
  ["citywiki", "#176B82", "#007E79", "#59C7E8", "#3BD3CB", "CityWiki", "Light: white ≥4.93:1 · Dark: mineral ≥8.22:1", "Light: white ≥4.93:1 · Dark: mineral ≥8.22:1"],
  ["citychat", "#007A58", "#007E79", "#3BD19B", "#3BD3CB", "CityChat", "Light: white ≥4.93:1 · Dark: mineral ≥8.24:1", "Light: white ≥4.93:1 · Dark: mineral ≥8.24:1"],
  ["ijji", "#C52C00", "#B23F74", "#FF8A4C", "#F06FA6", "ijji", "Light: white ≥5.45:1 · Dark: mineral ≥5.75:1", "Light: white ≥5.45:1 · Dark: mineral ≥5.75:1"],
].map(([id, lightStart, lightEnd, darkStart, darkEnd, label, foregroundTh, foregroundEn]) => ({
  id,
  label,
  foregroundTh,
  foregroundEn,
  light: {
    css: `linear-gradient(135deg, ${lightStart} 0%, ${lightEnd} 100%)`,
    stops: `${lightStart} → ${lightEnd}`,
  },
  dark: {
    css: `linear-gradient(135deg, ${darkStart} 0%, ${darkEnd} 100%)`,
    stops: `${darkStart} → ${darkEnd}`,
  },
}));

const categoricalSeries = [
  ["01", "Coral", "#C33F55", "#FF6B7F", "circle", "solid"],
  ["02", "Signal Orange", "#C52C00", "#FF8A4C", "square", "solid"],
  ["03", "Marigold", "#846100", "#F4C44E", "triangle", "solid"],
  ["04", "Lime", "#5D7400", "#B5E34E", "diamond", "solid"],
  ["05", "Green", "#007A58", "#3BD19B", "cross", "solid"],
  ["06", "Aqua", "#007E79", "#3BD3CB", "star", "solid"],
  ["07", "Sky", "#147A9F", "#59C7E8", "hexagon", "diagonal45"],
  ["08", "Ocean", "#1F629B", "#4C99D5", "ring", "diagonal135"],
  ["09", "Civic Slate", "#536B70", "#A9C4C7", "dash", "dot"],
  ["10", "Warm Pink", "#B23F74", "#F06FA6", "plus", "crosshatch"],
].map(([number, name, light, dark, shape, pattern]) => ({
  number,
  name,
  light,
  dark,
  shape,
  pattern,
}));

const mapPairs = [
  ["map.activeLayer", "#347DA8", "#65B6DB"],
  ["map.hover.stroke", "#347DA8", "#65B6DB"],
  ["map.hover.fill", "rgba(52,125,168,0.16)", "rgba(101,182,219,0.18)"],
  ["map.selected.stroke", "#176B82", "#68C4E2"],
  ["map.selected.fill", "rgba(23,107,130,0.18)", "rgba(104,196,226,0.22)"],
  ["map.focus.stroke", "#176B82", "#68C4E2"],
  ["marker.halo", "#FFFFFF", "#101318"],
  ["marker.stroke", "#182327", "#F1F4EF"],
].map(([id, light, dark]) => ({ id, light, dark }));

const opacityRoles = [
  ["opacity.solid", "1.00"],
  ["opacity.strong", "0.88"],
  ["opacity.medium", "0.72"],
  ["opacity.soft", "0.56"],
  ["opacity.subtle", "0.40"],
  ["opacity.ghost", "0.24"],
  ["opacity.watermark", "0.12"],
  ["opacity.trace", "0.06"],
].map(([id, value]) => ({ id, value }));

const depthRoles = [
  ["depth.base", "canvas", "ผืนงาน", "Canvas"],
  ["depth.context", "context", "บริบท", "Context"],
  ["depth.data", "evidence", "หลักฐาน", "Evidence"],
  ["depth.focus", "selection", "สิ่งที่เลือก", "Selection"],
  ["depth.action", "action", "การลงมือทำ", "Action"],
  ["depth.memory", "receipt/history", "ร่องรอยและประวัติ", "Receipt/history"],
].map(([id, short, th, en]) => ({ id, short, th, en }));

const scaleLabels = {
  growth: ["การเติบโต", "Growth"],
  water: ["น้ำ", "Water"],
  risk: ["ความเสี่ยง", "Risk"],
  activity: ["กิจกรรม", "Activity"],
  density: ["ความหนาแน่น", "Density"],
  confidence: ["ความเชื่อมั่น", "Confidence"],
  balance: ["สมดุล", "Balance"],
  delta: ["การเปลี่ยนแปลง", "Delta"],
  tradeoff: ["ทางเลือกที่ต้องแลก", "Trade-off"],
};

const expectedScaleAnchors = {
  growth: {
    light: ["#F2F1DF", "#55B8C2", "#126F68"],
    dark: ["#6F8984", "#53BDD0", "#86E0B8"],
  },
  water: {
    light: ["#F2F1DF", "#55B8C2", "#206C9A"],
    dark: ["#6C838C", "#55B8C2", "#68C4E2"],
  },
  risk: {
    light: ["#F2F1DF", "#E0B443", "#B74436"],
    dark: ["#85837A", "#D0A42F", "#FF8C7D"],
  },
  activity: {
    light: ["#F2F1DF", "#E86A8C", "#C52C00"],
    dark: ["#808A96", "#F079A1", "#FFB06A"],
  },
  density: {
    light: ["#F2F1DF", "#6797AF", "#225F78"],
    dark: ["#728C9A", "#47A6C4", "#9BE4F2"],
  },
  confidence: {
    light: ["#F2F1DF", "#85A5A2", "#08756F"],
    dark: ["#7C8B8C", "#95A9AA", "#D8E6E5"],
  },
  balance: {
    light: ["#C52C00", "#F2F1DF", "#186A9E"],
    dark: ["#FF8A4C", "#827C68", "#4FAFE0"],
  },
  delta: {
    light: ["#B74436", "#F2F1DF", "#007C78"],
    dark: ["#F28575", "#827C68", "#55C8BC"],
  },
  tradeoff: {
    light: ["#9E476F", "#F2F1DF", "#007E91"],
    dark: ["#E982AE", "#827C68", "#61C2D3"],
  },
};

const expectedScaleKinds = {
  growth: "sequential",
  water: "sequential",
  risk: "sequential",
  activity: "sequential",
  density: "sequential",
  confidence: "sequential",
  balance: "diverging",
  delta: "diverging",
  tradeoff: "diverging",
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Color atlas validation failed: ${message}`);
  }
}

function sameArray(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function gradientCss(angle, stops, interpolation = "") {
  assert(
    typeof angle === "string" &&
      Array.isArray(stops) &&
      stops.length >= 2 &&
      stops.every(
        (stop) =>
          Array.isArray(stop) &&
          stop.length === 2 &&
          /^#[0-9A-F]{6}$/.test(stop[0]) &&
          /^\d+(?:\.\d+)?%$/.test(stop[1]),
      ),
    "invalid gradient registry record",
  );
  const interpolationClause = interpolation ? ` ${interpolation}` : "";
  return `linear-gradient(${angle}${interpolationClause}, ${stops
    .map(([color, position]) => `${color} ${position}`)
    .join(", ")})`;
}

function withExplicitSrgb(css) {
  assert(
    /^linear-gradient\([^,]+, .+\)$/.test(css),
    `unsupported gradient syntax: ${css}`,
  );
  return css.replace(/^linear-gradient\(([^,]+), /, "linear-gradient($1 in srgb, ");
}

function gradientStyle(css) {
  const legacy = escapeHtml(css);
  const explicitSrgb = escapeHtml(withExplicitSrgb(css));
  return `--atlas-gradient:${legacy};background:${legacy};background:${explicitSrgb}`;
}

function validateColorDelivery(registry, scaleText, tokenText) {
  assert(registry?.meta?.id === "color-srgb-01", "unexpected color registry id");
  assert(
    registry?.meta?.immutableStandalone ===
      "landometer-design-system-v0.8.8-standalone.color-srgb-01.html",
    "unexpected immutable standalone filename",
  );
  assert(
    registry?.sources?.scaleRegistry?.sha256 === sha256(scaleText),
    "scales.json hash does not match the color registry",
  );
  assert(
    registry?.sources?.tokenRegistry?.sha256 === sha256(tokenText),
    "tokens.json hash does not match the color registry",
  );

  const surfaces = registry.surfaceGradients;
  assert(
    sharedGradients[0].css ===
      gradientCss(surfaces.measure.angle, surfaces.measure.light),
    "Measure light gradient drift",
  );
  assert(
    sharedGradients[1].css ===
      gradientCss(surfaces.measure.angle, surfaces.measure.dark),
    "Measure dark gradient drift",
  );

  const motifKeys = ["brandSignature", "civicCool", "civicWarm"];
  motifKeys.forEach((key, index) => {
    const record = registry.motifGradients?.[key];
    assert(
      motifGradients[index].css === gradientCss(record?.angle, record?.stops),
      `${key} motif gradient drift`,
    );
  });

  for (const product of productGradientPairs) {
    const record = registry.productIdentityGradients?.[product.id];
    for (const theme of ["light", "dark"]) {
      assert(
        product[theme].css ===
          gradientCss("135deg", [
            [record?.[theme]?.[0], "0%"],
            [record?.[theme]?.[1], "100%"],
          ]),
        `${product.id} ${theme} gradient drift`,
      );
    }
  }
}

function expectedClassIndices(count) {
  return Array.from({ length: count }, (_, index) =>
    Math.round((index * 40) / (count - 1)),
  );
}

function validateScaleSource(source) {
  assert(source?.meta?.records === 18, "scales.json meta.records must be 18");
  assert(source?.meta?.algorithm === "TOKEN-01 A6", "unexpected scale algorithm");
  assert(Array.isArray(source?.scales), "scales.json must contain a scales array");
  assert(source.scales.length === 18, "scales.json must contain 18 records");

  const expectedIds = Object.keys(expectedScaleAnchors);
  const seen = new Set();

  for (const record of source.scales) {
    const recordKey = `${record.scaleId}:${record.theme}`;
    assert(!seen.has(recordKey), `duplicate scale record ${recordKey}`);
    seen.add(recordKey);
    assert(expectedIds.includes(record.scaleId), `unknown scale ${record.scaleId}`);
    assert(["light", "dark"].includes(record.theme), `unknown theme in ${recordKey}`);
    assert(
      record.kind === expectedScaleKinds[record.scaleId],
      `wrong kind in ${recordKey}`,
    );
    assert(
      sameArray(record.anchors, expectedScaleAnchors[record.scaleId][record.theme]),
      `anchor mismatch in ${recordKey}`,
    );
    assert(sameArray(record.positions, [0, 20, 40]), `position mismatch in ${recordKey}`);
    assert(record.lut?.length === 41, `LUT must contain 41 cells in ${recordKey}`);
    assert(
      record.lut[0] === record.anchors[0] &&
        record.lut[20] === record.anchors[1] &&
        record.lut[40] === record.anchors[2],
      `LUT anchors are not fixed at 0/20/40 in ${recordKey}`,
    );

    for (const classCount of [5, 7, 9]) {
      const expectedClasses = expectedClassIndices(classCount).map(
        (index) => record.lut[index],
      );
      assert(
        sameArray(record.classes?.[String(classCount)], expectedClasses),
        `${classCount}-class strip mismatch in ${recordKey}`,
      );
    }

    const expectedNoData = record.theme === "light" ? "#D5DAD6" : "#404844";
    const expectedZero = record.theme === "light" ? "#7D877F" : "#A59A80";
    assert(record.noData === expectedNoData, `noData mismatch in ${recordKey}`);
    assert(record.zero === expectedZero, `zero mismatch in ${recordKey}`);
    assert(
      /^[0-9a-f]{64}$/.test(record.scaleVersion),
      `invalid scaleVersion in ${recordKey}`,
    );
  }

  for (const scaleId of expectedIds) {
    for (const theme of ["light", "dark"]) {
      assert(seen.has(`${scaleId}:${theme}`), `missing ${scaleId}:${theme}`);
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bilingual(th, en) {
  return `<span data-th lang="th">${escapeHtml(th)}</span><span data-en lang="en">${escapeHtml(en)}</span>`;
}

function renderTokenCard(record, extraClass = "") {
  const groupLabel =
    record.group === "energy"
      ? bilingual("สีสร้างพลัง", "Energy expression")
      : bilingual("สีอัตลักษณ์", "Identity");
  return `
          <figure class="atlas-token-card${extraClass ? ` ${extraClass}` : ""}">
            <span class="atlas-swatch" style="--atlas-color:${escapeHtml(record.value)};background:${escapeHtml(record.value)}" aria-hidden="true"></span>
            <figcaption class="atlas-token-caption">
              <code class="atlas-token-id">${escapeHtml(record.id)}</code>
              <strong class="atlas-token-value">${escapeHtml(record.value)}</strong>
              <span class="atlas-token-group">${groupLabel}</span>
              <small class="atlas-token-note">${bilingual(record.th, record.en)}</small>
            </figcaption>
          </figure>`;
}

function renderLogoCard(record) {
  return `
          <figure class="atlas-token-card atlas-token-card--asset">
            <span class="atlas-swatch" style="--atlas-color:${escapeHtml(record.value)};background:${escapeHtml(record.value)}" aria-hidden="true"></span>
            <figcaption class="atlas-token-caption">
              <code class="atlas-token-id">${escapeHtml(record.id)}</code>
              <strong class="atlas-token-value">${escapeHtml(record.value)}</strong>
              <small class="atlas-token-note">${bilingual(
                "อยู่ในไฟล์โลโก้ที่อนุมัติแล้วเท่านั้น",
                "Frozen inside approved logo artwork only",
              )}</small>
            </figcaption>
          </figure>`;
}

function renderPairCard(record) {
  return `
          <article class="atlas-pair-card">
            <code class="atlas-token-id">${escapeHtml(record.id)}</code>
            <div class="atlas-pair">
              <figure class="atlas-pair-cell">
                <span class="atlas-pair-swatch" style="--atlas-color:${escapeHtml(record.light)};background:${escapeHtml(record.light)}" aria-hidden="true"></span>
                <figcaption class="atlas-pair-label"><span>Light</span><strong>${escapeHtml(record.light)}</strong></figcaption>
              </figure>
              <figure class="atlas-pair-cell">
                <span class="atlas-pair-swatch" style="--atlas-color:${escapeHtml(record.dark)};background:${escapeHtml(record.dark)}" aria-hidden="true"></span>
                <figcaption class="atlas-pair-label"><span>Dark</span><strong>${escapeHtml(record.dark)}</strong></figcaption>
              </figure>
            </div>
          </article>`;
}

function renderSemanticCard(record) {
  return `
          <article class="atlas-state-card">
            <header class="atlas-state-head">
              <code class="atlas-token-id">semantic.${escapeHtml(record.id)}</code>
              <strong>${bilingual(record.th, record.en)}</strong>
            </header>
            <div class="atlas-state-pair">
              <figure class="atlas-state-sample" style="--atlas-fill:${escapeHtml(record.lightFill)};--atlas-ink:${escapeHtml(record.lightInk)};background:${escapeHtml(record.lightFill)};color:${escapeHtml(record.lightInk)}">
                <span class="atlas-state-icon" aria-hidden="true"><svg class="ui-icon"><use href="#icon-${escapeHtml(record.icon)}"></use></svg></span>
                <figcaption>
                  <strong>Light</strong>
                  <code>${escapeHtml(record.lightFill)} / ${escapeHtml(record.lightInk)}</code>
                </figcaption>
              </figure>
              <figure class="atlas-state-sample" style="--atlas-fill:${escapeHtml(record.darkFill)};--atlas-ink:${escapeHtml(record.darkInk)};background:${escapeHtml(record.darkFill)};color:${escapeHtml(record.darkInk)}">
                <span class="atlas-state-icon" aria-hidden="true"><svg class="ui-icon"><use href="#icon-${escapeHtml(record.icon)}"></use></svg></span>
                <figcaption>
                  <strong>Dark</strong>
                  <code>${escapeHtml(record.darkFill)} / ${escapeHtml(record.darkInk)}</code>
                </figcaption>
              </figure>
            </div>
          </article>`;
}

function renderGradientCard(record, variant) {
  return `
          <figure class="atlas-gradient-card atlas-gradient-card--${escapeHtml(variant)}">
            <span class="atlas-gradient-sample" style="${gradientStyle(record.css)}" aria-hidden="true"></span>
            <figcaption class="atlas-gradient-caption">
              <code class="atlas-token-id">${escapeHtml(record.id)}</code>
              <strong class="atlas-gradient-stops">${escapeHtml(record.stops)}</strong>
              <small>${bilingual(record.th, record.en)}</small>
              <span class="atlas-gradient-meta"><b>${escapeHtml(record.job)}</b><em>${escapeHtml(record.foreground)}</em><i>deletion test · keep only when comprehension improves</i></span>
            </figcaption>
          </figure>`;
}

function renderProductGradientCard(record) {
  const renderTheme = (theme) => `
              <figure class="atlas-gradient-theme">
                <span class="atlas-gradient-sample" style="${gradientStyle(record[theme].css)}" aria-hidden="true"></span>
                <figcaption>
                  <strong>${theme[0].toUpperCase()}${theme.slice(1)}</strong>
                  <code>${escapeHtml(record[theme].stops)}</code>
                </figcaption>
              </figure>`;

  return `
          <article class="atlas-product-card" data-scope="product-identity">
            <header class="atlas-product-head">
              <strong>${escapeHtml(record.label)}</strong>
              <code>product.${escapeHtml(record.id)}.gradient</code>
            </header>
            <div class="atlas-product-pair">
${renderTheme("light")}
${renderTheme("dark")}
            </div>
            <p class="atlas-scope-note">${bilingual(
              "ใช้บอกอัตลักษณ์ของผลิตภัณฑ์นี้เท่านั้น ห้ามใช้แทนข้อมูลหรือสถานะ",
              "Product identity only—never data magnitude or semantic state",
            )}</p>
            <p class="atlas-gradient-foreground">${bilingual(record.foregroundTh, record.foregroundEn)}</p>
          </article>`;
}

function renderSeriesCard(record) {
  const cue = `${record.shape} / ${record.pattern}`;
  return `
          <article class="atlas-series-card">
            <div class="atlas-series-identity">
              <span class="atlas-series-cue atlas-series-cue--${escapeHtml(record.shape)} atlas-series-cue--${escapeHtml(record.pattern)}" style="--atlas-light:${escapeHtml(record.light)};--atlas-dark:${escapeHtml(record.dark)}" aria-hidden="true"></span>
              <span>
                <code>series.${escapeHtml(record.number)}</code>
                <strong>${escapeHtml(record.name)}</strong>
              </span>
            </div>
            <div class="atlas-series-pair">
              <span class="atlas-series-color" style="--atlas-color:${escapeHtml(record.light)};background:${escapeHtml(record.light)}"><small>Light</small><b>${escapeHtml(record.light)}</b></span>
              <span class="atlas-series-color" style="--atlas-color:${escapeHtml(record.dark)};background:${escapeHtml(record.dark)}"><small>Dark</small><b>${escapeHtml(record.dark)}</b></span>
            </div>
            <p class="atlas-series-cue-label"><span>${escapeHtml(cue)}</span></p>
          </article>`;
}

function renderCells(colors, className, labelPrefix) {
  return colors
    .map(
      (color, index) =>
        `<i class="${className}" style="--atlas-color:${escapeHtml(color)};background:${escapeHtml(color)}" title="${escapeHtml(`${labelPrefix} ${index} · ${color}`)}" aria-hidden="true"></i>`,
    )
    .join("");
}

function renderScaleRecord(record) {
  const [labelTh, labelEn] = scaleLabels[record.scaleId];
  const anchorNames =
    record.kind === "sequential"
      ? bilingual("ต่ำ · กลาง · สูง", "Low · mid · high")
      : bilingual("ด้าน A · ค่ากลาง · ด้าน B", "Side A · neutral · side B");
  const classes = [5, 7, 9]
    .map((classCount) => {
      const colors = record.classes[String(classCount)];
      return `
                <figure class="atlas-class-row">
                  <figcaption><strong>${classCount}</strong><span>${bilingual(
                    `${classCount} ชั้น`,
                    `${classCount} classes`,
                  )}</span></figcaption>
                  <div class="atlas-class-cells" role="img" aria-label="${escapeHtml(
                    `${record.scaleId} ${record.theme} ${classCount}-class strip: ${colors.join(", ")}`,
                  )}">
                    ${renderCells(
                      colors,
                      "atlas-class-cell",
                      `${record.scaleId} ${record.theme} class`,
                    )}
                  </div>
                </figure>`;
    })
    .join("");

  return `
          <article class="atlas-scale-record" data-atlas-scale="${escapeHtml(record.scaleId)}" data-atlas-theme="${escapeHtml(record.theme)}" data-atlas-kind="${escapeHtml(record.kind)}">
            <header class="atlas-scale-head">
              <span>
                <strong>${bilingual(labelTh, labelEn)}</strong>
                <code>${escapeHtml(record.scaleId)} · ${escapeHtml(record.kind)} · ${escapeHtml(record.theme)}</code>
              </span>
              <span class="atlas-scale-theme">${escapeHtml(record.theme)}</span>
            </header>
            <figure class="atlas-anchor-row">
              <figcaption>${anchorNames}</figcaption>
              <div class="atlas-anchor-cells">
                ${record.anchors
                  .map(
                    (color) =>
                      `<span class="atlas-anchor-cell" style="--atlas-color:${escapeHtml(color)};background:${escapeHtml(color)}"><b>${escapeHtml(color)}</b></span>`,
                  )
                  .join("")}
              </div>
            </figure>
            <figure class="atlas-lut-figure">
              <figcaption>
                <strong>41-stop LUT</strong>
                <span>0 → 40 · OKLab · build-time</span>
              </figcaption>
              <div class="atlas-lut" role="img" aria-label="${escapeHtml(
                `${record.scaleId} ${record.theme} 41-stop lookup table from ${record.lut[0]} through ${record.lut[40]}`,
              )}">
                ${renderCells(
                  record.lut,
                  "atlas-lut-cell",
                  `${record.scaleId} ${record.theme} LUT`,
                )}
              </div>
              <div class="atlas-lut-index" aria-hidden="true"><span>0</span><span>20</span><span>40</span></div>
            </figure>
            <div class="atlas-class-stack">
${classes}
            </div>
            <footer class="atlas-scale-foot">
              <code>scaleVersion · ${escapeHtml(record.scaleVersion)}</code>
              <span>${bilingual(
                "domain และ threshold มาจากงานวิเคราะห์ที่นำไปใช้",
                "The consuming analysis supplies domain and thresholds",
              )}</span>
            </footer>
          </article>`;
}

function renderScaleSamplerCard(scaleId, lightRecord, darkRecord) {
  assert(lightRecord, `missing light sampler record for ${scaleId}`);
  assert(darkRecord, `missing dark sampler record for ${scaleId}`);
  assert(lightRecord.kind === darkRecord.kind, `sampler kind mismatch for ${scaleId}`);

  const [labelTh, labelEn] = scaleLabels[scaleId];
  const classes = [5, 7, 9]
    .map((classCount) => {
      const lightColors = lightRecord.classes[String(classCount)];
      const darkColors = darkRecord.classes[String(classCount)];
      assert(
        lightColors.length === darkColors.length,
        `sampler class length mismatch for ${scaleId}:${classCount}`,
      );
      const cells = lightColors
        .map(
          (lightColor, index) =>
            `<i class="scale-family-class-cell" style="--scale-light:${escapeHtml(lightColor)};--scale-dark:${escapeHtml(darkColors[index])}" title="${escapeHtml(`${scaleId} ${classCount} · light ${lightColor} · dark ${darkColors[index]}`)}" aria-hidden="true"></i>`,
        )
        .join("");

      return `
              <figure class="scale-family-class-row" data-class-count="${classCount}">
                <figcaption><strong>${classCount}</strong><span>${bilingual(
                  "ชั้น",
                  "classes",
                )}</span></figcaption>
                <div class="scale-family-class-cells" role="img" aria-label="${escapeHtml(
                  `${scaleId} ${lightRecord.kind} ${classCount} classes; light: ${lightColors.join(", ")}; dark: ${darkColors.join(", ")}`,
                )}">
                  ${cells}
                </div>
              </figure>`;
    })
    .join("");

  return `
          <article
            class="scale-family-card"
            data-scale-family="${escapeHtml(scaleId)}"
            data-scale-kind="${escapeHtml(lightRecord.kind)}"
            data-scale-version-light="${escapeHtml(lightRecord.scaleVersion)}"
            data-scale-version-dark="${escapeHtml(darkRecord.scaleVersion)}"
          >
            <header class="scale-family-head">
              <strong>${bilingual(labelTh, labelEn)}</strong>
              <code>${escapeHtml(scaleId)} · ${escapeHtml(lightRecord.kind)}</code>
            </header>
            <div class="scale-family-class-stack">
${classes}
            </div>
          </article>`;
}

function buildScaleSampler(scaleSource, colorDelivery) {
  const recordsById = new Map(
    Object.keys(expectedScaleAnchors).map((scaleId) => [
      scaleId,
      {
        light: scaleSource.scales.find(
          (record) => record.scaleId === scaleId && record.theme === "light",
        ),
        dark: scaleSource.scales.find(
          (record) => record.scaleId === scaleId && record.theme === "dark",
        ),
      },
    ]),
  );

  const renderGroup = (kind, scaleIds, headingTh, headingEn) => `
        <section class="scale-family-group" data-scale-kind="${escapeHtml(kind)}">
          <header class="scale-family-group-head">
            <strong>${bilingual(headingTh, headingEn)}</strong>
            <span>${scaleIds.length} families</span>
          </header>
          <div class="scale-family-grid">
${scaleIds
  .map((scaleId) => {
    const pair = recordsById.get(scaleId);
    return renderScaleSamplerCard(scaleId, pair?.light, pair?.dark);
  })
  .join("")}
          </div>
        </section>`;

  return `<!-- Generated by tools/generate-color-atlas.mjs. Do not hand-edit this sampler. -->
      <section
        class="scale-sampler"
        data-color-registry="${escapeHtml(colorDelivery.meta.id)}"
        data-scale-source-version="${escapeHtml(scaleSource.meta.version)}"
        data-scale-records="${scaleSource.scales.length}"
        aria-labelledby="scale-sampler-title"
      >
        <header class="scale-sampler-head">
          <div>
            <p class="scale-sampler-kicker">DATAVIZ-01 · 9 FAMILIES</p>
            <h6 id="scale-sampler-title">${bilingual(
              "เห็นทุกชุด ก่อนเลือกให้ตรงคำถาม",
              "See every family, then match it to the question",
            )}</h6>
            <p>${bilingual(
              "แต่ละชุดแสดง 5, 7 และ 9 ชั้นจาก LUT เดียวกัน สีบนจอจะสลับตามธีมที่กำลังใช้",
              "Each family shows 5, 7, and 9 classes from one LUT. The visible cells follow the active theme.",
            )}</p>
          </div>
          <span class="scale-sampler-theme" aria-label="Resolved theme">
            <span data-sampler-theme-light>LIGHT</span>
            <span data-sampler-theme-dark>DARK</span>
          </span>
        </header>

        <div class="scale-sampler-boundary" role="note">
          <strong>SOURCE_LIMITED · REFERENCE FIXTURE · MACHINE VALIDATION PENDING</strong>
          <p>${bilingual(
            "ชุดสีนี้สืบทอดจาก scales.json v0.8.6 เพื่อใช้เรียนรู้และตรวจแบบ ยังไม่ใช่ dataviz.tokens.json ที่ผ่าน scale gate ของ v0.8.8",
            "These families are carried from scales.json v0.8.6 for teaching and review. They are not a scale-gate-cleared v0.8.8 dataviz.tokens.json package.",
          )}</p>
        </div>

${renderGroup(
  "sequential",
  ["growth", "water", "risk", "activity", "density", "confidence"],
  "มาก–น้อย · Sequential",
  "Magnitude · Sequential",
)}

${renderGroup(
  "diverging",
  ["balance", "delta", "tradeoff"],
  "สองทิศทางรอบจุดกลาง · Diverging",
  "Two directions around a midpoint · Diverging",
)}

        <footer class="scale-sampler-foot">
          <p>${bilingual(
            "ชื่อชุดสีไม่ได้กำหนดความหมายของปลายสเกล งานวิเคราะห์ที่นำไปใช้ต้องระบุ domain, threshold, classification และ outlier policy เอง",
            "A family name does not define endpoint meaning. The consuming analysis still owns its domain, thresholds, classification, and outlier policy.",
          )}</p>
          <a class="secondary-action scale-sampler-action" href="#atlas-dataviz-title" data-reveal-target="atlas-dataviz-title">${bilingual(
            "เปิดดู 41 stops, exact values และ scaleVersion",
            "Open all 41 stops, exact values, and scaleVersion",
          )}</a>
        </footer>
      </section>`;
}

function renderMapPair(record) {
  return `
          <article class="atlas-map-card">
            <code class="atlas-token-id">${escapeHtml(record.id)}</code>
            <div class="atlas-map-pair">
              <figure class="atlas-map-cell atlas-map-cell--light">
                <span class="atlas-map-swatch" style="--atlas-color:${escapeHtml(record.light)};background:${escapeHtml(record.light)}" aria-hidden="true"></span>
                <figcaption><span>Light</span><strong>${escapeHtml(record.light)}</strong></figcaption>
              </figure>
              <figure class="atlas-map-cell atlas-map-cell--dark">
                <span class="atlas-map-swatch" style="--atlas-color:${escapeHtml(record.dark)};background:${escapeHtml(record.dark)}" aria-hidden="true"></span>
                <figcaption><span>Dark</span><strong>${escapeHtml(record.dark)}</strong></figcaption>
              </figure>
            </div>
          </article>`;
}

function renderOpacity(record) {
  return `
          <figure class="atlas-opacity-row">
            <span class="atlas-opacity-track"><i class="atlas-opacity-sample" style="--atlas-opacity:${escapeHtml(record.value)};opacity:${escapeHtml(record.value)}" aria-hidden="true"></i></span>
            <figcaption><code>${escapeHtml(record.id)}</code><strong>${escapeHtml(record.value)}</strong></figcaption>
          </figure>`;
}

function renderDepth(record, index) {
  return `
          <li class="atlas-depth-step">
            <span class="atlas-depth-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="atlas-depth-copy">
              <code>${escapeHtml(record.id)}</code>
              <strong>${bilingual(record.th, record.en)}</strong>
              <small>${escapeHtml(record.short)}</small>
            </span>
          </li>`;
}

function buildFragment(scaleSource, colorDelivery) {
  const groupedScaleRecords = Object.keys(expectedScaleAnchors)
    .flatMap((scaleId) =>
      ["light", "dark"].map((theme) =>
        scaleSource.scales.find(
          (record) => record.scaleId === scaleId && record.theme === theme,
        ),
      ),
    )
    .map(renderScaleRecord)
    .join("");

  return `<!-- Generated by tools/generate-color-atlas.mjs. Do not hand-edit this fragment. -->
<section class="atlas-root" aria-labelledby="atlas-title" data-color-registry="${escapeHtml(colorDelivery.meta.id)}" data-atlas-version="0.8.8" data-atlas-source-version="${escapeHtml(scaleSource.meta.version)}" data-atlas-records="${scaleSource.scales.length}">
  <header class="atlas-intro">
    <p class="atlas-kicker">TOKEN-01 · VIS-04 · SURFACE-01 · DATAVIZ-01 · MAP-01</p>
    <h4 class="atlas-title" id="atlas-title">${bilingual(
      "สมุดสีฉบับเต็ม—เห็นทุกบทบาทก่อนหยิบไปใช้",
      "The complete color atlas—see every role before using it",
    )}</h4>
    <p class="atlas-lede">${bilingual(
      "เปิดดูได้ตั้งแต่สีอัตลักษณ์ พื้นผิว สถานะ gradient ชุดข้อมูล แผนที่ ไปจนถึงการซ้อนชั้น โดยแยกหน้าที่ของแต่ละสีให้ชัด",
      "Inspect identity, surfaces, states, gradients, data scales, map layers, and depth—with every color kept in its governed role.",
    )}</p>
    <div class="atlas-boundary atlas-boundary--source" role="note">
      <strong>SOURCE_LIMITED · REFERENCE FIXTURE · MACHINE VALIDATION PENDING</strong>
      <p>${bilingual(
        "LUT ด้านล่างอ่านจาก scales.json ซึ่งเป็น reference fixture ที่สืบทอดเข้า v0.8.8 ไม่ใช่ dataviz.tokens.json ที่ผ่าน scale gate แล้ว จึงใช้เรียนรู้ ตรวจแบบ และเทียบค่าล่วงหน้าได้ แต่ห้ามอ้างว่า production conform จน hash, legend/renderer parity, contrast และ CVD gate ผ่านครบ",
        "The LUTs below come from the scales.json reference fixture carried into v0.8.8. They are not a scale-gate-cleared dataviz.tokens.json package. Use them to learn, review, and compare—not to claim production conformance until hash, legend/renderer parity, contrast, and CVD gates pass.",
      )}</p>
    </div>
    <div class="atlas-counts" aria-label="Atlas coverage">
      <span><strong>14</strong><small>identity + logo</small></span>
      <span><strong>17</strong><small>foundation pairs</small></span>
      <span><strong>7</strong><small>semantic states</small></span>
      <span><strong>13</strong><small>gradient records</small></span>
      <span><strong>10</strong><small>categorical pairs</small></span>
      <span><strong>18 × 41</strong><small>LUT cells</small></span>
      <span><strong>8</strong><small>map pairs</small></span>
    </div>
  </header>

  <section class="atlas-family atlas-family--identity" aria-labelledby="atlas-identity-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">01 · IDENTITY</p>
      <h5 id="atlas-identity-title">${bilingual(
        "สีแบรนด์ สีสร้างพลัง และสีที่อยู่ในไฟล์โลโก้เท่านั้น",
        "Brand, energy, and asset-only logo colors",
      )}</h5>
      <p>${bilingual(
        "ในหนึ่งฉากใช้ energy เพียง 1–2 สี และไม่ใช้แทนสีข้อมูล สถานะ แผนที่ โฟกัส หรือโลโก้",
        "Use only 1–2 energy colors in one scene; never alias them to data, state, map, focus, or logo roles.",
      )}</p>
    </header>
    <div class="atlas-token-grid">
${identityColors.map((record) => renderTokenCard(record)).join("")}
    </div>
    <div class="atlas-subfamily">
      <header class="atlas-subfamily-head">
        <h6>${bilingual("สเปกตรัมโลโก้แบบแช่แข็ง", "Frozen official-logo spectrum")}</h6>
        <p>${bilingual(
          "แสดงเพื่ออ้างอิงไฟล์ asset เท่านั้น ห้ามสร้างใหม่ recolor หรือยกไปเป็น UI token แม้รหัสสีจะตรงกับสีอื่น",
          "Asset reference only. Never rebuild, recolor, or promote these values into UI tokens—even when a hex value matches another role.",
        )}</p>
      </header>
      <div class="atlas-token-grid atlas-token-grid--asset">
${logoAssetColors.map(renderLogoCard).join("")}
      </div>
    </div>
  </section>

  <section class="atlas-family atlas-family--foundation" aria-labelledby="atlas-foundation-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">02 · FOUNDATION</p>
      <h5 id="atlas-foundation-title">${bilingual(
        "พื้นผิว ตัวอักษร เส้น และ interaction ครบทั้งสองธีม",
        "Every governed surface, text, border, and interaction pair",
      )}</h5>
      <p>${bilingual(
        "17 คู่ด้านล่างคือ active authoring subset ของ v0.8.8 เลือกตามบทบาท ไม่เลือกเพราะชอบรหัสสี",
        "These 17 light/dark pairs are the v0.8.8 active authoring subset. Choose by role, never by favorite hex.",
      )}</p>
    </header>
    <div class="atlas-pair-grid">
${foundationPairs.map(renderPairCard).join("")}
    </div>
  </section>

  <section class="atlas-family atlas-family--semantic" aria-labelledby="atlas-semantic-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">03 · SEMANTIC STATE</p>
      <h5 id="atlas-semantic-title">${bilingual(
        "สถานะต้องมาทั้งพื้น สีตัวอักษร คำ และสัญญาณประกอบ",
        "A state needs its fill, ink, word, and companion signal",
      )}</h5>
      <p>${bilingual(
        "สีสถานะห้ามทำงานลำพัง และ energy color ไม่ใช่ทางลัดไปยัง success, warning หรือ danger",
        "State color never works alone, and energy colors never stand in for success, warning, or danger.",
      )}</p>
    </header>
    <div class="atlas-state-grid">
${semanticPairs.map(renderSemanticCard).join("")}
    </div>
  </section>

  <section class="atlas-family atlas-family--gradients" aria-labelledby="atlas-gradients-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">04 · GRADIENT</p>
      <h5 id="atlas-gradients-title">${bilingual(
        "ทุก gradient มีงานเดียวที่ต้องทำ",
        "Every gradient has one declared job",
      )}</h5>
      <p>${bilingual(
        "หนึ่ง viewport มี gradient เด่นได้ไม่เกินหนึ่งผืน เก็บ stop order เดิม ตรวจคอนทราสต์ใต้ glyph จริง และลบทิ้งเมื่อไม่ได้ช่วยให้เข้าใจดีขึ้น",
        "Allow at most one dominant gradient per viewport, preserve stop order, test beneath real glyphs, and remove it when comprehension does not improve.",
      )}</p>
    </header>
    <div class="atlas-signature-support">
      <span class="atlas-swatch" style="--atlas-color:#68C4E2;background:#68C4E2" aria-hidden="true"></span>
      <span><code>dark.signature.sky</code><strong>#68C4E2</strong><small>${bilingual(
        "ใช้เป็นจุดเริ่มต้นของ closing signature บนธีมมืดเท่านั้น",
        "Approved dark closing-signature start only",
      )}</small></span>
    </div>
    <div class="atlas-gradient-grid atlas-gradient-grid--shared">
${sharedGradients.map((record) => renderGradientCard(record, "shared")).join("")}
${motifGradients.map((record) => renderGradientCard(record, "motif")).join("")}
    </div>
    <div class="atlas-boundary atlas-boundary--motif" role="note">
      <strong>MOTIF-01 · GATE STILL APPLIES</strong>
      <p>${bilingual(
        "ชื่อ motif gradient ที่เห็นไม่ได้อนุญาตให้วาดหรือ trace โลโก้ขึ้นใหม่ และใช้สีให้ motif asset ได้ต่อเมื่อ vector/hash gate ผ่านแล้วเท่านั้น",
        "A motif gradient ID does not authorize rebuilding or tracing the logo. It may color only a separately approved motif asset after its vector/hash gate passes.",
      )}</p>
    </div>
    <div class="atlas-subfamily">
      <header class="atlas-subfamily-head">
        <h6>${bilingual("Product identity—พื้นที่เฉพาะผลิตภัณฑ์", "Product identity—product scope only")}</h6>
        <p>${bilingual(
          "ตัวอย่างเหล่านี้บอกว่าอยู่ในผลิตภัณฑ์ใด ห้ามนำไปเข้ารหัสค่า สถานะ หรือเปรียบเทียบข้ามผลิตภัณฑ์",
          "These specimens identify product scope. Never use them to encode magnitude, state, or cross-product comparison.",
        )}</p>
      </header>
      <div class="atlas-product-grid">
${productGradientPairs.map(renderProductGradientCard).join("")}
      </div>
    </div>
  </section>

  <section class="atlas-family atlas-family--categorical" aria-labelledby="atlas-categorical-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">05 · VIVID CIVIC 10</p>
      <h5 id="atlas-categorical-title">${bilingual(
        "สีหมวดหมู่สิบคู่ พร้อมรูปทรงและลายประจำตัว",
        "Ten categorical pairs with stable shape and pattern cues",
      )}</h5>
      <p>${bilingual(
        "สีอย่างเดียวหยุดที่ 6 หมวด ตั้งแต่ 7–10 ต้องใช้รูปทรงหรือลายร่วมด้วย และมากกว่า 10 ให้จัดกลุ่ม กรอง ทำ small multiples หรือตาราง",
        "Color-only identification stops at six. From 7–10, add shape or pattern; above ten, group, filter, use small multiples, or use a table.",
      )}</p>
      <code class="atlas-registry-id">landometer-series-10-v5</code>
    </header>
    <div class="atlas-series-grid">
${categoricalSeries.map(renderSeriesCard).join("")}
    </div>
  </section>

  <section class="atlas-family atlas-family--dataviz" aria-labelledby="atlas-dataviz-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">06 · DATAVIZ LUT</p>
      <h5 id="atlas-dataviz-title">${bilingual(
        "ครบทั้ง 18 scale records—41 สีจริงและชุด 5/7/9 ชั้น",
        "All 18 scale records—every 41-cell LUT and 5/7/9-class strip",
      )}</h5>
      <p>${bilingual(
        "แต่ละช่องเป็นสีที่ generate ไว้ล่วงหน้า ไม่มี CSS gradient หรือการผสมสีตอน runtime การเลือก domain, threshold และความหมายของปลาย scale ยังเป็นหน้าที่ของงานวิเคราะห์ที่นำไปใช้",
        "Every cell is pre-generated: no CSS gradient and no runtime color mixing. The consuming analysis still owns domain, thresholds, and endpoint meaning.",
      )}</p>
    </header>
    <div class="atlas-scale-grid">
${groupedScaleRecords}
    </div>
    <div class="atlas-special-grid">
      <article class="atlas-special-card">
        <h6>No data</h6>
        <div class="atlas-special-pair">
          <span class="atlas-special-swatch atlas-special-swatch--nodata atlas-special-swatch--nodata-light" style="--atlas-color:#D5DAD6;background:#D5DAD6"><b>Light</b><code>#D5DAD6</code></span>
          <span class="atlas-special-swatch atlas-special-swatch--nodata atlas-special-swatch--nodata-dark" style="--atlas-color:#404844;background:#404844;color:#F1F4EF"><b>Dark</b><code>#404844</code></span>
        </div>
        <p>${bilingual(
          "อยู่นอก ramp มีลายทแยงและคำกำกับเสมอ ไม่ใช่ศูนย์",
          "Outside every ramp; pair with a diagonal pattern and a direct label. Never zero.",
        )}</p>
      </article>
      <article class="atlas-special-card">
        <h6>Zero</h6>
        <div class="atlas-special-pair">
          <span class="atlas-special-swatch atlas-special-swatch--zero atlas-special-swatch--zero-light" style="--atlas-color:#7D877F;border-color:#7D877F"><b>Light</b><code>#7D877F</code></span>
          <span class="atlas-special-swatch atlas-special-swatch--zero atlas-special-swatch--zero-dark" style="--atlas-color:#A59A80;border-color:#A59A80"><b>Dark</b><code>#A59A80</code></span>
        </div>
        <p>${bilingual(
          "ใช้เส้น outline เฉพาะเมื่อศูนย์เป็นข้อเท็จจริงที่ต้องแยก",
          "Use the outline only when zero is a distinct fact.",
        )}</p>
      </article>
    </div>
  </section>

  <section class="atlas-family atlas-family--map" aria-labelledby="atlas-map-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">07 · MAP + INTERFACE LAYERS</p>
      <h5 id="atlas-map-title">${bilingual(
        "สถานะบนแผนที่ต้องเห็นทั้งสี เส้น รูปทรง หรือคำกำกับ",
        "Map state pairs color with stroke, shape, or a direct label",
      )}</h5>
      <p>${bilingual(
        "ค่า rgba ด้านล่างคือ fill ที่กำหนดไว้จริง ไม่ใช่สีทึบใหม่ และต้องทดสอบผลการซ้อนบนแผนที่จริง",
        "The rgba values below are governed fills—not new solid colors—and their composites still need testing on the real map.",
      )}</p>
    </header>
    <div class="atlas-map-grid">
${mapPairs.map(renderMapPair).join("")}
    </div>
  </section>

  <section class="atlas-family atlas-family--depth" aria-labelledby="atlas-depth-title">
    <header class="atlas-family-head">
      <p class="atlas-family-index">08 · OPACITY + DEPTH</p>
      <h5 id="atlas-depth-title">${bilingual(
        "จัดชั้นให้เห็นลำดับ โดยไม่แต่งความหมายใหม่",
        "Organize depth without inventing new meaning",
      )}</h5>
      <p>${bilingual(
        "Opacity ไม่แบกความหมายสำคัญเพียงลำพัง และสีที่เกิดจากการซ้อนไม่ใช่ token ใหม่",
        "Opacity never carries critical meaning alone, and a blended result is not a new token.",
      )}</p>
    </header>
    <div class="atlas-depth-layout">
      <div class="atlas-opacity-list" aria-label="Canonical opacity registry">
${opacityRoles.map(renderOpacity).join("")}
      </div>
      <div class="atlas-depth-roles">
        <ol class="atlas-depth-flow">
${depthRoles.map(renderDepth).join("")}
        </ol>
        <div class="atlas-boundary atlas-boundary--depth" role="note">
          <strong>NO CANONICAL OPACITY OR Z-INDEX MAPPING</strong>
          <p>${bilingual(
            "ชื่อ depth บอกลำดับการรับรู้ canvas → context → evidence → selection → action → receipt/history เท่านั้น DS ไม่ได้กำหนดว่า depth ใดต้องใช้ opacity หรือ z-index ค่าใด",
            "Depth names describe the perceptual sequence canvas → context → evidence → selection → action → receipt/history. The DS does not map a depth role to an opacity or z-index value.",
          )}</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="atlas-footer">
    <p><strong>${bilingual(
      "จำง่ายๆ: เริ่มจากหน้าที่ แล้วค่อยหยิบสี",
      "One rule to remember: start with the role, then choose the color",
    )}</strong></p>
    <p>${bilingual(
      "ถ้าสีเดียวกำลังพยายามบอกทั้งแบรนด์ สถานะ ขนาดข้อมูล และสิ่งที่กดได้พร้อมกัน แปลว่าต้องแยกบทบาทก่อน",
      "When one color is trying to say brand, state, magnitude, and action at once, separate the roles before styling.",
    )}</p>
    <code>landometer-design-system@0.8.8 · active authoring subset · SOURCE_LIMITED</code>
  </footer>
</section>
`;
}

async function main() {
  const [scaleText, tokenText, colorDeliveryText] = await Promise.all([
    readFile(SCALE_SOURCE, "utf8"),
    readFile(TOKEN_SOURCE, "utf8"),
    readFile(COLOR_DELIVERY_SOURCE, "utf8"),
  ]);
  const scaleSource = JSON.parse(scaleText);
  const colorDelivery = JSON.parse(colorDeliveryText);
  validateScaleSource(scaleSource);
  validateColorDelivery(colorDelivery, scaleText, tokenText);

  const fragment = buildFragment(scaleSource, colorDelivery);
  const sampler = buildScaleSampler(scaleSource, colorDelivery);
  assert(!fragment.toLowerCase().includes("color-mix"), "runtime color mixing found");
  assert(!sampler.toLowerCase().includes("color-mix"), "sampler runtime color mixing found");
  assert(
    !/(?:linear|radial|conic)-gradient\s*\(/i.test(sampler),
    "sampler must use solid generated cells, not CSS gradients",
  );
  assert(
    (fragment.match(/class="atlas-lut-cell"/g) ?? []).length === 18 * 41,
    "fragment must contain 738 LUT cells",
  );
  assert(
    (fragment.match(/class="atlas-class-cell"/g) ?? []).length ===
      18 * (5 + 7 + 9),
    "fragment must contain all 5/7/9 class cells",
  );
  assert(
    (fragment.match(/class="atlas-scale-record"/g) ?? []).length === 18,
    "fragment must contain all 18 scale records",
  );
  assert(
    (sampler.match(/class="scale-family-card"/g) ?? []).length === 9,
    "sampler must contain all nine scale families",
  );
  assert(
    (sampler.match(/class="scale-family-class-cell"/g) ?? []).length ===
      9 * (5 + 7 + 9),
    "sampler must contain 189 exact paired class cells",
  );
  assert(
    /class="secondary-action scale-sampler-action"[^>]*href="#atlas-dataviz-title"/.test(
      sampler,
    ),
    "sampler must route to the complete atlas through the shared action family",
  );

  await writeFile(OUTPUT_PATH, fragment, "utf8");

  if (process.argv.includes("--inject") || process.argv.includes("--check-index")) {
    let indexHtml = await readFile(INDEX_PATH, "utf8");

    const inspectMarkedSection = (source, startMarker, endMarker, label) => {
      const start = source.indexOf(startMarker);
      const end = source.indexOf(endMarker);
      assert(start >= 0 && end > start, `index.html ${label} markers are missing or out of order`);
      const contentStart = start + startMarker.length;
      return {
        contentStart,
        end,
        embedded: source.slice(contentStart, end).trim(),
      };
    };

    const atlasSection = inspectMarkedSection(
      indexHtml,
      START_MARKER,
      END_MARKER,
      "color-atlas",
    );
    const samplerSection = inspectMarkedSection(
      indexHtml,
      SAMPLER_START_MARKER,
      SAMPLER_END_MARKER,
      "scale-sampler",
    );

    if (process.argv.includes("--check-index")) {
      assert(
        atlasSection.embedded === fragment.trim(),
        "embedded index.html atlas is not current",
      );
      assert(
        samplerSection.embedded === sampler.trim(),
        "embedded index.html scale sampler is not current",
      );
    }

    if (process.argv.includes("--inject")) {
      const replaceMarkedSection = (source, startMarker, endMarker, content, indent) => {
        const section = inspectMarkedSection(source, startMarker, endMarker, "generated");
        return `${source.slice(0, section.contentStart)}\n${content.trim()}\n${indent}${source.slice(section.end)}`;
      };
      indexHtml = replaceMarkedSection(
        indexHtml,
        START_MARKER,
        END_MARKER,
        fragment,
        "                  ",
      );
      indexHtml = replaceMarkedSection(
        indexHtml,
        SAMPLER_START_MARKER,
        SAMPLER_END_MARKER,
        sampler,
        "                    ",
      );
      await writeFile(INDEX_PATH, indexHtml, "utf8");
    }
  }

  process.stdout.write(
    `Wrote ${OUTPUT_PATH} (${scaleSource.scales.length} scale records; 738 LUT cells; 9-family sampler with 189 paired class cells)${process.argv.includes("--inject") ? " and injected deployment/index.html" : ""}\n`,
  );
}

await main();
