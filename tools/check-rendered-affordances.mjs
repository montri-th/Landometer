#!/usr/bin/env node
// [SELFCHECK-01] SC-21 + SC-23 ([BTN-GEOM-01]), SC-22 ([REVEAL-01]),
// SC-24 (selected Rebuild02 navbar profile + [NAV-01], including the approved
// logo slot/art scale, stable calm targets, and finite intent-only CTA sweep), SC-25 (complete
// component motion-policy coverage), SC-26 (generated Color Atlas preview parity),
// and SC-27 (latest-alias freshness handshake). All are rendered contracts:
// geometry, target ownership, state changes, painted color, and runtime policy
// assignment cannot be discharged by source review alone.
// SC-23 exists because ui-20260821-02 passed SC-21 (label box centred) while an icon-bearing
// capsule still laid its glyph on the text baseline: 3px above the label centre, 0px gap.

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  throw new Error(
    "Rendered affordance QA requires Playwright. Install it for CI or expose the bundled workspace node_modules through NODE_PATH.",
  );
}

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolDir, "..");
const deploymentDir = path.join(repositoryRoot, "deployment");

function cliValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index < 0) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a deployment-relative path.`);
  }
  return value;
}

function deploymentInput(value, label) {
  if (path.isAbsolute(value)) {
    throw new Error(`${label} must be deployment-relative, not absolute: ${value}`);
  }
  const normalized = value.replaceAll("\\", "/").replace(/^deployment\//, "");
  const absolute = path.resolve(deploymentDir, normalized);
  if (absolute !== deploymentDir && !absolute.startsWith(`${deploymentDir}${path.sep}`)) {
    throw new Error(`${label} escapes deployment/: ${value}`);
  }
  return {
    absolute,
    relative: path.relative(deploymentDir, absolute).split(path.sep).join("/"),
  };
}

function htmlDataAttribute(source, name) {
  const match = source.match(new RegExp(`\\b${name}=(?:"([^"]+)"|'([^']+)')`, "i"));
  return match?.[1] ?? match?.[2] ?? null;
}

const registryInput = deploymentInput(
  cliValue("--registry") ?? "assets/data/color-delivery.v0.9.1.json",
  "--registry",
);
const registry = JSON.parse(
  await readFile(registryInput.absolute, "utf8"),
);
const declaredArtifactBuildId = registry?.meta?.currentArtifactBuild?.id;
const declaredArtifactName = registry?.meta?.currentArtifactBuild?.immutableStandalone;
if (!declaredArtifactBuildId || !declaredArtifactName) {
  throw new Error("color-delivery registry does not declare the current artifact build");
}
// Point both flags at a frozen predecessor to regression-test it without changing
// the checker. Registry and measured artifact identities must agree.
const artifactInput = deploymentInput(
  cliValue("--artifact") ?? declaredArtifactName,
  "--artifact",
);
const artifactBytes = await readFile(artifactInput.absolute);
const artifactSource = artifactBytes.toString("utf8");
const artifactBuildId = htmlDataAttribute(artifactSource, "data-artifact-build");
const artifactDsVersion = htmlDataAttribute(artifactSource, "data-ds-version");
const artifactColorRegistryId = htmlDataAttribute(artifactSource, "data-color-registry");
if (!artifactBuildId || !artifactDsVersion || !artifactColorRegistryId) {
  throw new Error("Measured artifact is missing DS version, Color Set, or artifact-build identity.");
}
if (
  artifactBuildId !== declaredArtifactBuildId ||
  artifactDsVersion !== registry?.meta?.designSystemVersion ||
  artifactColorRegistryId !== registry?.meta?.id
) {
  throw new Error(
    `Registry/artifact identity mismatch: registry ${registry?.meta?.designSystemVersion}/${registry?.meta?.id}/${declaredArtifactBuildId}, artifact ${artifactDsVersion}/${artifactColorRegistryId}/${artifactBuildId}.`,
  );
}
const artifactPath = artifactInput.absolute;
// Chromium caches file:// by URL; keying the URL to the bytes makes a stale read impossible.
const artifactSha256 = createHash("sha256").update(artifactBytes).digest("hex");
const artifactFingerprint = artifactSha256.slice(0, 16);
const artifactUrl = `${pathToFileURL(artifactPath).href}?cb=${artifactFingerprint}`;
const latestAliasSource = await readFile(path.join(deploymentDir, "index.html"), "utf8");
const navCtaMotionSourceStart = artifactSource.indexOf(".nav-cta__sweep");
const navCtaMotionSourceEnd = artifactSource.indexOf(".header-cta {", navCtaMotionSourceStart);
const navCtaMotionSource = navCtaMotionSourceStart >= 0 && navCtaMotionSourceEnd > navCtaMotionSourceStart
  ? artifactSource.slice(navCtaMotionSourceStart, navCtaMotionSourceEnd)
  : "";

// [BTN-GEOM-01]: --space-5 is the normative minimum inline padding for a capsule.
const MIN_CAPSULE_INLINE_PADDING_PX = 24;
const MIN_TARGET_PX = 44;
const PADDING_TOLERANCE_PX = 0.5;
const CENTRING_TOLERANCE_PX = 2;
// [BTN-GEOM-01] kit anatomy: gap is --space-2 and the icon centres with the label.
const ICON_CENTRE_TOLERANCE_PX = 1.5;
const ICON_GAP_TOLERANCE_LOW_PX = 2;   // below --space-2
const ICON_GAP_TOLERANCE_HIGH_PX = 4;  // above --space-2 (border-box rounding)
const VIEWPORTS = [
  {
    name: "mobile",
    width: 390,
    height: 844,
    prominentSurfacePx: 68,
    calmSurfacePx: 68,
    logoSlotPx: 45,
    visibleHeaderControls: 2,
  },
  {
    name: "desktop",
    width: 1440,
    height: 1000,
    prominentSurfacePx: 76,
    calmSurfacePx: 76,
    logoSlotPx: 54,
    visibleHeaderControls: 5,
  },
];
const NAV_GEOMETRY_TOLERANCE_PX = 1;
const NAV_CALM_OPACITY = 0.72;
const NAV_OPACITY_TOLERANCE = 0.03;
const NAV_CALM_VISUAL_SCALE = 0.82;
const NAV_VISUAL_SCALE_TOLERANCE = 0.025;
const NAV_CALM_SURFACE_ALPHA = 0.26;
const NAV_CALM_HAIRLINE_ALPHA = 0.20;
const NAV_ALPHA_TOLERANCE = 0.015;
const NAV_BRAND_ART_SCALE = 0.558;
const NAV_BRAND_ART_SCALE_TOLERANCE = 0.012;
const NAV_CTA_INTENT_DURATION_MS = 200;
const NAV_CTA_INTENT_EASING = "cubic-bezier(0.2, 0, 0, 1)";
const PAGE_BOOKMARK_ANCHORS = [
  "#top",
  "#v091-additions",
  "#play",
  "#implementation-library",
  "#complete-color-atlas",
  "#library-resources",
];
const ATLAS_PREVIEW_RECORDS = [
  { token: "brand.blue", value: "#1D4497" },
  { token: "brand.beige", value: "#F2F1DF" },
  { token: "dark.brand.beige", value: "#D8CFB2" },
  { token: "energy.sky", value: "#59D2FE" },
  { token: "energy.mint", value: "#0AD69C" },
  { token: "energy.coral", value: "#FF5A5F" },
  { token: "energy.yellow", value: "#FFBC1F" },
].map(record => ({
  ...record,
  computed: (() => {
    const hex = record.value.slice(1);
    return `rgb(${Number.parseInt(hex.slice(0, 2), 16)},${Number.parseInt(hex.slice(2, 4), 16)},${Number.parseInt(hex.slice(4, 6), 16)})`;
  })(),
}));

const failures = [];
const cases = [];
const requestedBrowserExecutable = process.env.LANDOMETER_BROWSER_EXECUTABLE || "";
let bundledBrowserExecutable = "";
try {
  bundledBrowserExecutable = chromium.executablePath();
} catch (_) {}
const systemChromeExecutable = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browserExecutable = requestedBrowserExecutable && existsSync(requestedBrowserExecutable)
  ? requestedBrowserExecutable
  : bundledBrowserExecutable && existsSync(bundledBrowserExecutable)
    ? ""
    : existsSync(systemChromeExecutable)
      ? systemChromeExecutable
      : "";
const browser = await chromium.launch({
  headless: true,
  ...(browserExecutable ? { executablePath: browserExecutable } : {}),
});

// ---------- SC-21 + SC-23: rendered capsule geometry and icon anatomy ----------
for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(400);
  const measured = await page.evaluate(
    ({ minPad, minTarget, padTol, iconCentreTol, gapLowTol, gapHighTol }) => {
      const visible = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).display !== "none";
      const space2 = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--space-2")) || 8;
      const results = [];
      const nodes = [...document.querySelectorAll("a, button, .button, [role='button']")];
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const style = getComputedStyle(node);
        const radius = parseFloat(style.borderTopLeftRadius) || 0;
        const isCircle = radius >= Math.min(rect.width, rect.height) / 2 - 1 && Math.abs(rect.width - rect.height) <= 2;
        const isCapsule = !isCircle && radius >= rect.height / 2 - 1 && rect.width > rect.height + 4;
        const hasNavigationSpecificGeometry = node.matches(".header-cta");
        const icon = [...node.querySelectorAll(".icon-symbol")].find(visible);
        const labelEl = [...node.querySelectorAll("span:not(.icon-symbol)")]
          .find(sp => visible(sp) && sp.textContent.trim());
        if (isCircle && icon) {
          // SC-23 also covers the icon-only circle: its glyph sits on the circle centre.
          const ir = icon.getBoundingClientRect();
          const offX = Math.abs((ir.left + ir.right) / 2 - (rect.left + rect.right) / 2);
          const offY = Math.abs((ir.top + ir.bottom) / 2 - (rect.top + rect.bottom) / 2);
          const p23 = [];
          if (offX > iconCentreTol || offY > iconCentreTol) {
            p23.push(`icon off the circle centre by ${offX.toFixed(1)}/${offY.toFixed(1)}px`);
          }
          results.push({ kind: "circle", label: (node.getAttribute("aria-label") || node.id || "circle").slice(0, 40), p21: [], p23 });
          continue;
        }
        if (!isCapsule || hasNavigationSpecificGeometry) continue;
        const label = (node.textContent || "").trim();
        if (!label) continue; // icon-only actions are the circle rule, not this one
        const padLeft = parseFloat(style.paddingLeft) || 0;
        const padRight = parseFloat(style.paddingRight) || 0;
        const p21 = [];
        if (padLeft + padTol < minPad || padRight + padTol < minPad) {
          p21.push(`inline padding ${padLeft}/${padRight}px below the ${minPad}px minimum`);
        }
        if (rect.height + 0.5 < minTarget) p21.push(`target height ${Math.round(rect.height)}px below ${minTarget}px`);
        const flexish = /flex|grid|inline-flex|inline-grid/.test(style.display);
        if (flexish) {
          if (!/center/.test(style.alignItems)) p21.push(`alignItems ${style.alignItems} does not centre the label`);
          if (!/center/.test(style.justifyContent) && style.textAlign !== "center") {
            p21.push(`justifyContent ${style.justifyContent} does not centre the label`);
          }
        } else if (style.textAlign !== "center" && style.display !== "inline") {
          p21.push(`display ${style.display} with textAlign ${style.textAlign} does not centre the label`);
        }
        if (node.scrollWidth - node.clientWidth > 1) p21.push("label overruns its own shape");
        // SC-23: an icon inside a labelled capsule centres with the label, sits inside the
        // capsule box, and keeps the kit gap (--space-2) to the label.
        const p23 = [];
        if (icon) {
          const ir = icon.getBoundingClientRect();
          if (ir.top < rect.top - 1 || ir.bottom > rect.bottom + 1) {
            p23.push("icon overflows the capsule box");
          }
          if (labelEl) {
            const lr = labelEl.getBoundingClientRect();
            const centreDelta = Math.abs((ir.top + ir.bottom) / 2 - (lr.top + lr.bottom) / 2);
            if (centreDelta > iconCentreTol) p23.push(`icon ${centreDelta.toFixed(1)}px off the label centre`);
            const gap = ir.left > lr.left ? ir.left - lr.right : lr.left - ir.right;
            if (gap < space2 - gapLowTol || gap > space2 + gapHighTol) {
              p23.push(`icon-label gap ${gap.toFixed(1)}px, not the --space-2 ${space2}px`);
            }
          } else {
            const off = Math.abs((ir.top + ir.bottom) / 2 - (rect.top + rect.bottom) / 2);
            if (off > iconCentreTol) p23.push(`icon ${off.toFixed(1)}px off the capsule centre`);
          }
        }
        results.push({ kind: "capsule", hasIcon: !!icon, label: label.slice(0, 40), p21, p23 });
      }
      return results;
    },
    {
      minPad: MIN_CAPSULE_INLINE_PADDING_PX,
      minTarget: MIN_TARGET_PX,
      padTol: PADDING_TOLERANCE_PX,
      iconCentreTol: ICON_CENTRE_TOLERANCE_PX,
      gapLowTol: ICON_GAP_TOLERANCE_LOW_PX,
      gapHighTol: ICON_GAP_TOLERANCE_HIGH_PX,
    },
  );
  for (const entry of measured) {
    entry.p21.forEach(p => failures.push(`SC-21 ${viewport.name}: "${entry.label}" ${p}`));
    entry.p23.forEach(p => failures.push(`SC-23 ${viewport.name}: "${entry.label}" ${p}`));
  }
  const capsules = measured.filter(e => e.kind === "capsule");
  const iconBearing = measured.filter(e => e.hasIcon || e.kind === "circle");
  cases.push({ item: "SC-21", viewport: viewport.name, capsulesMeasured: capsules.length, passed: !capsules.some(e => e.p21.length) });
  cases.push({ item: "SC-23", viewport: viewport.name, iconActionsMeasured: iconBearing.length, passed: !measured.some(e => e.p23.length) });
  await page.close();
}

// ---------- SC-24: owner-selected r7 navbar, glyph, menu, and bookmark contracts ----------
const measureNavbar = page => page.evaluate(() => {
  const header = document.querySelector(".site-header");
  const inner = document.querySelector(".site-header__inner");
  const row = document.querySelector(".site-header__row");
  const controls = document.querySelector(".site-header .header-nav");
  const surface = header ? getComputedStyle(header, "::before") : null;
  const visible = node => {
    if (!node || !node.getClientRects().length) return false;
    const style = getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01;
  };
  const paintedOutline = node => {
    if (!node) return false;
    const style = getComputedStyle(node);
    const stroke = style.stroke.replace(/\s+/gu, "").toLowerCase();
    let geometry = 1;
    try {
      if (typeof node.getTotalLength === "function") geometry = node.getTotalLength();
    } catch (_) {
      geometry = 0;
    }
    return geometry > 0 && parseFloat(style.strokeWidth || "0") > 0 &&
      stroke !== "none" && stroke !== "transparent" &&
      stroke !== "rgba(0,0,0,0)" && !stroke.endsWith(",0)");
  };
  const box = node => {
    const rect = node?.getBoundingClientRect();
    return rect ? { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } : null;
  };
  const colorAlpha = color => {
    if (!color || color === "transparent") return 0;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return Number.NaN;
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data[3] / 255;
  };
  const menuGlyph = () => {
    const rootMode = document.documentElement.dataset.navGlyphs || "unknown";
    const toggle = document.getElementById("nav-menu-toggle");
    const expanded = toggle?.getAttribute("aria-expanded") === "true";
    const icon = toggle?.querySelector(expanded ? ".nav-menu-icon__close" : ".nav-menu-icon__menu");
    const iconRect = icon?.getBoundingClientRect();
    const paths = icon ? [...icon.querySelectorAll("path, circle, rect, line, polyline, polygon")] : [];
    const paintedPaths = paths.filter(paintedOutline);
    return {
      mode: rootMode,
      state: expanded ? "close" : "menu",
      iconVisible: visible(icon) && (iconRect?.width || 0) >= 16 && (iconRect?.height || 0) >= 16,
      paintedPaths: paintedPaths.length,
      pathSignatures: paths.map(path => path.getAttribute("d") || path.outerHTML),
    };
  };
  const targetNodes = [
    document.querySelector(".site-header .brand"),
    ...document.querySelectorAll(".site-header .header-link"),
    ...document.querySelectorAll(".site-header .header-cta"),
    document.querySelector(".site-header .nav-menu-toggle"),
  ].filter(visible);
  const targets = targetNodes.map(node => {
    const rect = node.getBoundingClientRect();
    const visual = node.matches(".brand")
      ? node.querySelector(".brand__visual")
      : node.matches(".nav-menu-toggle")
        ? node.querySelector(".nav-menu-toggle__visual")
        : node.querySelector(".header-control-visual");
    const visualRect = visual?.getBoundingClientRect();
    const hit = document.elementFromPoint(
      Math.max(0, Math.min(innerWidth - 1, (rect.left + rect.right) / 2)),
      Math.max(0, Math.min(innerHeight - 1, (rect.top + rect.bottom) / 2)),
    );
    return {
      id: node.id || node.className || node.tagName,
      kind: node.matches(".brand") ? "brand"
        : node.matches(".header-link") ? "route"
          : node.matches(".header-cta") ? "cta" : "menu",
      href: node instanceof HTMLAnchorElement ? node.href : null,
      text: (node.textContent || "").replace(/\s+/gu, " ").trim(),
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      centerX: (rect.left + rect.right) / 2,
      centerY: (rect.top + rect.bottom) / 2,
      visual: visualRect ? {
        left: visualRect.left,
        right: visualRect.right,
        top: visualRect.top,
        bottom: visualRect.bottom,
        width: visualRect.width,
        height: visualRect.height,
        centerX: (visualRect.left + visualRect.right) / 2,
        centerY: (visualRect.top + visualRect.bottom) / 2,
        aspectRatio: visualRect.height ? visualRect.width / visualRect.height : 0,
        transform: getComputedStyle(visual).transform,
      } : null,
      directHit: !!hit && (hit === node || node.contains(hit)),
      pointerEvents: getComputedStyle(node).pointerEvents,
    };
  });
  const visual = document.querySelector(".site-header .brand__visual");
  const matrix = visual && getComputedStyle(visual).transform !== "none"
    ? new DOMMatrixReadOnly(getComputedStyle(visual).transform)
    : null;
  const brandSymbol = document.querySelector(".site-header .brand__symbol");
  const brandSymbolStyle = brandSymbol ? getComputedStyle(brandSymbol) : null;
  const brandSymbolRect = brandSymbol?.getBoundingClientRect();
  const brandSymbolMatrix = brandSymbolStyle && brandSymbolStyle.transform !== "none"
    ? new DOMMatrixReadOnly(brandSymbolStyle.transform)
    : null;
  const headerRect = header?.getBoundingClientRect();
  const main = document.querySelector("main");
  const rowRect = box(row);
  const innerRect = box(inner);
  const controlsRect = box(controls);
  const innerStyle = inner ? getComputedStyle(inner) : null;
  const innerPadLeft = parseFloat(innerStyle?.paddingLeft || "0") || 0;
  const innerPadRight = parseFloat(innerStyle?.paddingRight || "0") || 0;
  return {
    state: header?.dataset.navState ?? null,
    isCalm: header?.classList.contains("is-calm") ?? false,
    headerTop: headerRect?.top ?? 0,
    headerHeight: headerRect?.height ?? 0,
    surfaceHeight: parseFloat(surface?.height ?? "0"),
    surfaceBackground: surface?.backgroundColor ?? null,
    surfaceAlpha: colorAlpha(surface?.backgroundColor),
    hairlineColor: surface?.borderBottomColor ?? null,
    hairlineAlpha: colorAlpha(surface?.borderBottomColor),
    rowOpacity: Number(row ? getComputedStyle(row).opacity : 0),
    visualScale: matrix ? Math.hypot(matrix.a, matrix.b) : 1,
    brandSymbol: brandSymbol && brandSymbolRect ? {
      src: brandSymbol.getAttribute("src"),
      widthAttribute: brandSymbol.getAttribute("width"),
      heightAttribute: brandSymbol.getAttribute("height"),
      naturalWidth: brandSymbol.naturalWidth,
      naturalHeight: brandSymbol.naturalHeight,
      slotWidth: brandSymbol.offsetWidth,
      slotHeight: brandSymbol.offsetHeight,
      computedWidth: parseFloat(brandSymbolStyle?.width || "0"),
      computedHeight: parseFloat(brandSymbolStyle?.height || "0"),
      transform: brandSymbolStyle?.transform ?? null,
      transformScaleX: brandSymbolMatrix ? Math.hypot(brandSymbolMatrix.a, brandSymbolMatrix.b) : 1,
      transformScaleY: brandSymbolMatrix ? Math.hypot(brandSymbolMatrix.c, brandSymbolMatrix.d) : 1,
      paintedWidth: brandSymbolRect.width,
      paintedHeight: brandSymbolRect.height,
      paintedScaleX: brandSymbol.offsetWidth ? brandSymbolRect.width / brandSymbol.offsetWidth : 0,
      paintedScaleY: brandSymbol.offsetHeight ? brandSymbolRect.height / brandSymbol.offsetHeight : 0,
      centerX: (brandSymbolRect.left + brandSymbolRect.right) / 2,
      centerY: (brandSymbolRect.top + brandSymbolRect.bottom) / 2,
    } : null,
    visibleControls: targets.length,
    targets,
    menuGlyph: menuGlyph(),
    rowRect,
    innerRect,
    controlsRect,
    rowFillsInner: !!rowRect && !!innerRect &&
      Math.abs(rowRect.left - (innerRect.left + innerPadLeft)) <= 1 &&
      Math.abs(rowRect.right - (innerRect.right - innerPadRight)) <= 1,
    controlsRightAligned: !!rowRect && !!controlsRect && Math.abs(rowRect.right - controlsRect.right) <= 1,
    mainDocumentTop: main ? main.getBoundingClientRect().top + scrollY : null,
    hasIdentityCarrier: !!document.querySelector(".site-header .logo-surface, .site-header .brand-plate"),
  };
});

const glyphIsVisible = glyph => glyph?.mode === "inline-svg" &&
  glyph.iconVisible && glyph.paintedPaths > 0;

const measureNavbarCta = (page, selector) => page.evaluate(targetSelector => {
  const anchor = document.querySelector(targetSelector);
  const visual = anchor?.querySelector(".header-control-visual--cta");
  const label = visual?.querySelector(".nav-cta__label");
  const sweep = visual?.querySelector(".nav-cta__sweep");
  const windowNode = sweep?.querySelector(".nav-cta__sweep-window");
  const copy = windowNode?.querySelector(".nav-cta__sweep-copy");
  const rect = node => {
    const value = node?.getBoundingClientRect();
    return value ? {
      left: value.left,
      right: value.right,
      top: value.top,
      bottom: value.bottom,
      width: value.width,
      height: value.height,
      centerX: (value.left + value.right) / 2,
      centerY: (value.top + value.bottom) / 2,
    } : null;
  };
  const animation = node => {
    if (!node) return null;
    const style = getComputedStyle(node);
    return {
      name: style.animationName,
      duration: style.animationDuration,
      delay: style.animationDelay,
      iterationCount: style.animationIterationCount,
      easing: style.animationTimingFunction,
      direction: style.animationDirection,
      fillMode: style.animationFillMode,
      playState: style.animationPlayState,
      transform: style.transform,
    };
  };
  const anchorRect = rect(anchor);
  const hit = anchorRect ? document.elementFromPoint(anchorRect.centerX, anchorRect.centerY) : null;
  const sweepStyle = sweep ? getComputedStyle(sweep) : null;
  const windowStyle = windowNode ? getComputedStyle(windowNode) : null;
  const visualStyle = visual ? getComputedStyle(visual) : null;
  const normalize = node => (node?.innerText || "").replace(/\s+/gu, " ").trim();
  return {
    exists: !!anchor,
    visible: !!anchor && anchor.getClientRects().length > 0 && getComputedStyle(anchor).display !== "none",
    focusVisible: !!anchor && anchor.matches(":focus-visible"),
    anchorRect,
    visualRect: rect(visual),
    directHit: !!anchor && !!hit && (hit === anchor || anchor.contains(hit)),
    visualOverflow: visualStyle?.overflow ?? null,
    visualIsolation: visualStyle?.isolation ?? null,
    labelOpacity: label ? Number(getComputedStyle(label).opacity) : 0,
    labelText: normalize(label),
    copyText: normalize(copy),
    sweepInsideVisual: !!visual && !!sweep && visual.contains(sweep),
    sweepAriaHidden: sweep?.getAttribute("aria-hidden") ?? null,
    sweepPointerEvents: sweepStyle?.pointerEvents ?? null,
    sweepLeft: parseFloat(sweepStyle?.left || "0"),
    sweepRight: parseFloat(sweepStyle?.right || "0"),
    sweepMarginLeft: parseFloat(sweepStyle?.marginLeft || "0"),
    sweepMarginRight: parseFloat(sweepStyle?.marginRight || "0"),
    sweepPaddingTop: parseFloat(sweepStyle?.paddingTop || "0"),
    sweepPaddingRight: parseFloat(sweepStyle?.paddingRight || "0"),
    sweepPaddingBottom: parseFloat(sweepStyle?.paddingBottom || "0"),
    sweepPaddingLeft: parseFloat(sweepStyle?.paddingLeft || "0"),
    sweepRadius: parseFloat(sweepStyle?.borderTopLeftRadius || "0"),
    windowBackground: windowStyle?.backgroundColor ?? null,
    windowClipPath: windowStyle?.clipPath ?? null,
    windowAnimation: animation(windowNode),
    copyAnimation: animation(copy),
    animationEvents: [...(window.__navCtaAnimationEvents || [])],
    intersectionObserved: [...(window.__navCtaIoObserved || [])],
  };
}, selector);

const navbarRectStable = (before, after, tolerance = NAV_GEOMETRY_TOLERANCE_PX) =>
  !!before && !!after && ["left", "right", "top", "bottom", "width", "height", "centerX", "centerY"]
    .every(key => Math.abs(before[key] - after[key]) <= tolerance);

const probeNavbarCtaIntent = async (page, selector, mode) => {
  const locator = page.locator(selector);
  await page.evaluate(() => { window.__navCtaAnimationEvents = []; });
  const before = await measureNavbarCta(page, selector);
  if (mode === "hover") {
    await locator.hover();
  } else {
    await page.mouse.move(Math.max(1, Math.floor((await page.viewportSize()).width / 2)), 320);
    for (let index = 0; index < 24; index += 1) {
      const reached = await page.evaluate(targetSelector => document.activeElement === document.querySelector(targetSelector), selector);
      if (reached) break;
      await page.keyboard.press("Tab");
    }
  }
  await page.waitForTimeout(32);
  const during = await measureNavbarCta(page, selector);
  await page.waitForTimeout(NAV_CTA_INTENT_DURATION_MS + 80);
  const after = await measureNavbarCta(page, selector);
  await page.mouse.move(Math.max(1, Math.floor((await page.viewportSize()).width / 2)), 320);
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  await page.waitForTimeout(24);
  return { mode, before, during, after };
};

const validateNavbarCtaIntentProbe = (probe, navFailures, label) => {
  const { mode, before, during, after } = probe;
  if (!before.exists || !before.visible) {
    navFailures.push(`${label} CTA is not visible before its ${mode} intent probe`);
    return;
  }
  if (!before.sweepInsideVisual || before.sweepAriaHidden !== "true" || before.sweepPointerEvents !== "none") {
    navFailures.push(`${label} CTA sweep is not an aria-hidden, pointer-inert child of the complete inner visual`);
  }
  if (before.visualOverflow !== "hidden" || before.visualIsolation !== "isolate") {
    navFailures.push(`${label} CTA visual does not contain and isolate its sweep (${before.visualOverflow}/${before.visualIsolation})`);
  }
  if (!before.labelText || before.copyText !== before.labelText || before.labelOpacity < 0.999) {
    navFailures.push(`${label} CTA duplicate copy or always-readable real label is incomplete`);
  }
  if (Math.abs(before.sweepLeft - 24) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepRight - 24) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepMarginLeft + 5) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepMarginRight + 5) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepPaddingTop - 2) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepPaddingRight - 5) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepPaddingBottom - 2) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepPaddingLeft - 5) > PADDING_TOLERANCE_PX ||
      Math.abs(before.sweepRadius - 2) > PADDING_TOLERANCE_PX) {
    navFailures.push(`${label} CTA sweep no longer matches the selected Rebuild02 duplicate-label optical geometry`);
  }
  if (!/rgba?\(255,\s*188,\s*31(?:,\s*1)?\)/u.test(before.windowBackground || "") ||
      !/36%/u.test(before.windowClipPath || "")) {
    navFailures.push(`${label} CTA sweep is not the Energy Yellow 28% centre band (${before.windowBackground}/${before.windowClipPath})`);
  }
  if (before.windowAnimation?.name !== "none" || before.copyAnimation?.name !== "none" || before.animationEvents.length) {
    navFailures.push(`${label} CTA sweep autoplays before ${mode} intent`);
  }
  if (before.intersectionObserved.length) {
    navFailures.push(`${label} CTA sweep is incorrectly enrolled in IntersectionObserver (${before.intersectionObserved.join(", ")})`);
  }
  if (mode === "focus" && !during.focusVisible) {
    navFailures.push(`${label} CTA keyboard probe did not reach :focus-visible`);
  }
  for (const [track, animation, expectedName] of [
    ["window", during.windowAnimation, "nav-cta-yellow-sweep-window"],
    ["copy", during.copyAnimation, "nav-cta-yellow-sweep-copy"],
  ]) {
    if (!animation || animation.name !== expectedName || animation.duration !== `${NAV_CTA_INTENT_DURATION_MS / 1000}s` ||
        animation.delay !== "0s" || animation.iterationCount !== "1" ||
        animation.easing !== NAV_CTA_INTENT_EASING || animation.direction !== "normal" ||
        animation.fillMode !== "both" || animation.playState !== "running") {
      navFailures.push(`${label} CTA ${track} ${mode} animation contract is ${JSON.stringify(animation)}`);
    }
  }
  const starts = after.animationEvents.filter(event => event.type === "animationstart");
  const ends = after.animationEvents.filter(event => event.type === "animationend");
  const iterations = after.animationEvents.filter(event => event.type === "animationiteration");
  const cancels = after.animationEvents.filter(event => event.type === "animationcancel");
  if (starts.length !== 2 || ends.length !== 2 || iterations.length || cancels.length ||
      new Set(starts.map(event => event.name)).size !== 2) {
    navFailures.push(`${label} CTA ${mode} event lifecycle is not one finite window+copy sweep (${JSON.stringify(after.animationEvents)})`);
  }
  if (!before.directHit || !during.directHit || !after.directHit ||
      !navbarRectStable(before.anchorRect, during.anchorRect) ||
      !navbarRectStable(before.anchorRect, after.anchorRect) ||
      !navbarRectStable(before.visualRect, during.visualRect) ||
      !navbarRectStable(before.visualRect, after.visualRect)) {
    navFailures.push(`${label} CTA ${mode} sweep moves geometry or intercepts the direct anchor hit`);
  }
  if (during.labelOpacity < 0.999 || after.labelOpacity < 0.999) {
    navFailures.push(`${label} CTA real-label opacity drops during or after ${mode} intent`);
  }
};

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__navCtaAnimationEvents = [];
    window.__navCtaIoObserved = [];
    ["animationstart", "animationiteration", "animationcancel", "animationend"].forEach(type => {
      document.addEventListener(type, event => {
        const target = event.target;
        if (!(target instanceof Element) ||
            !target.matches(".nav-cta__sweep-window, .nav-cta__sweep-copy")) return;
        window.__navCtaAnimationEvents.push({
          type,
          name: event.animationName,
          target: target.className,
          elapsedTime: event.elapsedTime,
        });
      }, true);
    });
    if ("IntersectionObserver" in window) {
      const nativeObserve = IntersectionObserver.prototype.observe;
      IntersectionObserver.prototype.observe = function observe(target) {
        if (target instanceof Element &&
            (target.matches(".header-cta, .nav-cta__sweep, .nav-cta__sweep-window, .nav-cta__sweep-copy") ||
             target.closest(".header-cta"))) {
          window.__navCtaIoObserved.push(target.className || target.tagName);
        }
        return nativeObserve.call(this, target);
      };
    }
  });
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(700);

  const prominent = await measureNavbar(page);
  const navFailures = [];
  const ctaIntent = {
    selector: viewport.width <= 680
      ? ".nav-cta--mobile .header-cta"
      : ".nav-cta--header .header-cta",
    initial: null,
    probes: [],
  };
  ctaIntent.initial = await measureNavbarCta(page, ctaIntent.selector);
  if (!navCtaMotionSource || /\binfinite\b|@keyframes\s+lmFlick|@keyframes\s+lmSweep|IntersectionObserver/iu.test(navCtaMotionSource)) {
    navFailures.push("navbar CTA source contains autoplay, observer, infinite, or Rebuild02 flicker/sweep machinery");
  }
  if (!/:hover\s+\.nav-cta__sweep-window/iu.test(navCtaMotionSource) ||
      !/:focus-visible\s+\.nav-cta__sweep-window/iu.test(navCtaMotionSource)) {
    navFailures.push("navbar CTA yellow sweep is not gated exclusively by hover and focus-visible intent");
  }
  if (ctaIntent.initial.animationEvents.length || ctaIntent.initial.intersectionObserved.length ||
      ctaIntent.initial.windowAnimation?.name !== "none" || ctaIntent.initial.copyAnimation?.name !== "none") {
    navFailures.push(`navbar CTA has autoplay or observer activity before intent (${JSON.stringify(ctaIntent.initial)})`);
  }
  if (viewport.width > 680) {
    for (const mode of ["hover", "focus"]) {
      const probe = await probeNavbarCtaIntent(page, ctaIntent.selector, mode);
      ctaIntent.probes.push(probe);
      validateNavbarCtaIntentProbe(probe, navFailures, `${viewport.name} header`);
    }
  }
  if (prominent.state !== "prominent") navFailures.push(`initial state ${prominent.state}`);
  if (Math.abs(prominent.headerHeight - viewport.prominentSurfacePx) > NAV_GEOMETRY_TOLERANCE_PX) {
    navFailures.push(`header block ${prominent.headerHeight.toFixed(1)}px, expected ${viewport.prominentSurfacePx}px`);
  }
  if (Math.abs(prominent.surfaceHeight - viewport.prominentSurfacePx) > NAV_GEOMETRY_TOLERANCE_PX) {
    navFailures.push(`prominent surface ${prominent.surfaceHeight.toFixed(1)}px, expected ${viewport.prominentSurfacePx}px`);
  }
  if (prominent.visibleControls !== viewport.visibleHeaderControls) {
    navFailures.push(`${prominent.visibleControls} visible controls, expected ${viewport.visibleHeaderControls}`);
  }
  const prominentRouteHrefs = prominent.targets.filter(target => target.kind === "route").map(target => target.href);
  const expectedRouteHrefs = viewport.width <= 680
    ? []
    : ["https://montri-th.github.io/CityMETER/", "https://landometer.com/v3/citywiki"];
  if (JSON.stringify(prominentRouteHrefs) !== JSON.stringify(expectedRouteHrefs)) {
    navFailures.push(`header routes ${JSON.stringify(prominentRouteHrefs)}, expected ${JSON.stringify(expectedRouteHrefs)}`);
  }
  const visibleCtas = prominent.targets.filter(target => target.kind === "cta");
  if ((viewport.width <= 680 && visibleCtas.length) ||
      (viewport.width > 680 && (visibleCtas.length !== 1 || visibleCtas[0].href !== "https://landometer.com/auth"))) {
    navFailures.push(`header CTA anatomy is not the selected r7 breakpoint contract`);
  }
  if (!prominent.rowFillsInner || !prominent.controlsRightAligned) {
    navFailures.push("prominent row is not full-width with its control cluster aligned right");
  }
  if (!glyphIsVisible(prominent.menuGlyph) || prominent.menuGlyph.state !== "menu") {
    navFailures.push(`menu icon is not visibly rendered (${prominent.menuGlyph.mode}/${prominent.menuGlyph.state})`);
  }
  if (prominent.hasIdentityCarrier) navFailures.push("identity is enclosed by a carrier");
  if (!prominent.brandSymbol) {
    navFailures.push("approved brand symbol slot is missing");
  } else {
    const symbol = prominent.brandSymbol;
    if (Math.abs(symbol.slotWidth - viewport.logoSlotPx) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(symbol.slotHeight - viewport.logoSlotPx) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(symbol.computedWidth - viewport.logoSlotPx) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(symbol.computedHeight - viewport.logoSlotPx) > NAV_GEOMETRY_TOLERANCE_PX) {
      navFailures.push(`brand symbol slot ${symbol.slotWidth.toFixed(1)}x${symbol.slotHeight.toFixed(1)}px (computed ${symbol.computedWidth.toFixed(1)}x${symbol.computedHeight.toFixed(1)}px), expected ${viewport.logoSlotPx}px square`);
    }
    if (symbol.widthAttribute !== "192" || symbol.heightAttribute !== "192" ||
        symbol.naturalWidth !== 192 || symbol.naturalHeight !== 192) {
      navFailures.push(`brand symbol approved 192px source slot changed (${symbol.widthAttribute}x${symbol.heightAttribute}, natural ${symbol.naturalWidth}x${symbol.naturalHeight})`);
    }
    if (Math.abs(symbol.transformScaleX - NAV_BRAND_ART_SCALE) > NAV_BRAND_ART_SCALE_TOLERANCE ||
        Math.abs(symbol.transformScaleY - NAV_BRAND_ART_SCALE) > NAV_BRAND_ART_SCALE_TOLERANCE) {
      navFailures.push(`brand symbol computed art scale ${symbol.transformScaleX.toFixed(3)}/${symbol.transformScaleY.toFixed(3)}, expected ${NAV_BRAND_ART_SCALE}`);
    }
    if (Math.abs(symbol.paintedScaleX - NAV_BRAND_ART_SCALE) > NAV_BRAND_ART_SCALE_TOLERANCE ||
        Math.abs(symbol.paintedScaleY - NAV_BRAND_ART_SCALE) > NAV_BRAND_ART_SCALE_TOLERANCE ||
        Math.abs(symbol.paintedWidth - viewport.logoSlotPx * NAV_BRAND_ART_SCALE) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(symbol.paintedHeight - viewport.logoSlotPx * NAV_BRAND_ART_SCALE) > NAV_GEOMETRY_TOLERANCE_PX) {
      navFailures.push(`brand symbol painted footprint ${symbol.paintedWidth.toFixed(1)}x${symbol.paintedHeight.toFixed(1)}px (${symbol.paintedScaleX.toFixed(3)}/${symbol.paintedScaleY.toFixed(3)} of slot), expected CSS art scale ${NAV_BRAND_ART_SCALE}`);
    }
  }
  prominent.targets.forEach(target => {
    if (target.width + 0.5 < MIN_TARGET_PX || target.height + 0.5 < MIN_TARGET_PX) {
      navFailures.push(`${target.id} target ${target.width.toFixed(1)}x${target.height.toFixed(1)}px`);
    }
    if (!target.directHit || target.pointerEvents === "none") {
      navFailures.push(`${target.id} is not the direct hit-tested target`);
    }
    if (!target.visual) {
      navFailures.push(`${target.id} has no complete inner visual wrapper`);
    } else {
      const visualOffY = Math.abs(target.visual.centerY - target.centerY);
      const visualOffX = Math.abs(target.visual.centerX - target.centerX);
      if (visualOffY > 1.5 || (target.kind !== "brand" && visualOffX > 1.5)) {
        navFailures.push(`${target.kind} prominent inner visual is not aligned within its semantic target`);
      }
      if (target.kind === "brand" && Math.abs(target.visual.left - (target.centerX - target.width / 2)) > 1.5) {
        navFailures.push("brand prominent inner visual is not left-anchored in its semantic target");
      }
    }
  });

  await page.evaluate(() => {
    const limit = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    scrollTo(0, Math.min(1200, limit));
  });
  await page.waitForTimeout(700);
  const calm = await measureNavbar(page);
  if (calm.state !== "calm" || !calm.isCalm) navFailures.push(`down-scroll state ${calm.state}`);
  if (Math.abs(calm.surfaceHeight - viewport.calmSurfacePx) > NAV_GEOMETRY_TOLERANCE_PX) {
    navFailures.push(`calm surface ${calm.surfaceHeight.toFixed(1)}px, expected ${viewport.calmSurfacePx}px`);
  }
  if (Math.abs(calm.rowOpacity - NAV_CALM_OPACITY) > NAV_OPACITY_TOLERANCE) {
    navFailures.push(`calm row opacity ${calm.rowOpacity.toFixed(2)}, expected ${NAV_CALM_OPACITY}`);
  }
  if (!Number.isFinite(calm.surfaceAlpha) || Math.abs(calm.surfaceAlpha - NAV_CALM_SURFACE_ALPHA) > NAV_ALPHA_TOLERANCE) {
    navFailures.push(`calm surface alpha ${Number.isFinite(calm.surfaceAlpha) ? calm.surfaceAlpha.toFixed(3) : calm.surfaceBackground}, expected ${NAV_CALM_SURFACE_ALPHA}`);
  }
  if (!Number.isFinite(calm.hairlineAlpha) || Math.abs(calm.hairlineAlpha - NAV_CALM_HAIRLINE_ALPHA) > NAV_ALPHA_TOLERANCE) {
    navFailures.push(`calm hairline alpha ${Number.isFinite(calm.hairlineAlpha) ? calm.hairlineAlpha.toFixed(3) : calm.hairlineColor}, expected ${NAV_CALM_HAIRLINE_ALPHA}`);
  }
  if (!calm.rowFillsInner || !calm.controlsRightAligned) {
    navFailures.push("calm row is not full-width with its control cluster aligned right");
  }
  if (prominent.rowRect && calm.rowRect &&
      (Math.abs(prominent.rowRect.left - calm.rowRect.left) > NAV_GEOMETRY_TOLERANCE_PX ||
       Math.abs(prominent.rowRect.right - calm.rowRect.right) > NAV_GEOMETRY_TOLERANCE_PX)) {
    navFailures.push("calm row drifts horizontally instead of retaining the full row");
  }
  if (prominent.controlsRect && calm.controlsRect &&
      Math.abs(prominent.controlsRect.right - calm.controlsRect.right) > NAV_GEOMETRY_TOLERANCE_PX) {
    navFailures.push("calm control cluster drifts away from the right edge");
  }
  if (Math.abs(calm.headerHeight - prominent.headerHeight) > NAV_GEOMETRY_TOLERANCE_PX ||
      Math.abs((calm.mainDocumentTop ?? 0) - (prominent.mainDocumentTop ?? 0)) > NAV_GEOMETRY_TOLERANCE_PX) {
    navFailures.push("calm state shifts document layout");
  }
  calm.targets.forEach(target => {
    if (target.width + 0.5 < MIN_TARGET_PX || target.height + 0.5 < MIN_TARGET_PX) {
      navFailures.push(`${target.id} calm target ${target.width.toFixed(1)}x${target.height.toFixed(1)}px`);
    }
    if (!target.directHit) navFailures.push(`${target.id} calm target is covered by another layer`);
    const expectedCenterY = calm.headerTop + calm.surfaceHeight / 2;
    if (Math.abs(target.centerY - expectedCenterY) > 1.5) {
      navFailures.push(`${target.kind} calm target is not vertically centred in the calm surface`);
    }
  });
  prominent.targets.forEach((target, index) => {
    const calmTarget = calm.targets[index];
    if (!calmTarget || calmTarget.kind !== target.kind) {
      navFailures.push(`calm target order changed at ${target.kind}`);
      return;
    }
    if (Math.abs(target.left - calmTarget.left) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.right - calmTarget.right) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.top - calmTarget.top) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.bottom - calmTarget.bottom) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.centerX - calmTarget.centerX) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.centerY - calmTarget.centerY) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.width - calmTarget.width) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(target.height - calmTarget.height) > NAV_GEOMETRY_TOLERANCE_PX) {
      navFailures.push(`${target.kind} direct target box or centre moves during calm transition`);
    }
    if (!target.visual || !calmTarget.visual) {
      navFailures.push(`${target.kind} has no complete inner visual wrapper`);
      return;
    }
    if (Math.abs(target.visual.aspectRatio - calmTarget.visual.aspectRatio) > 0.03) {
      navFailures.push(`${target.kind} inner visual changes aspect ratio during calm transition`);
    }
    const widthScale = target.visual.width ? calmTarget.visual.width / target.visual.width : 0;
    const heightScale = target.visual.height ? calmTarget.visual.height / target.visual.height : 0;
    if (Math.abs(widthScale - NAV_CALM_VISUAL_SCALE) > NAV_VISUAL_SCALE_TOLERANCE ||
        Math.abs(heightScale - NAV_CALM_VISUAL_SCALE) > NAV_VISUAL_SCALE_TOLERANCE) {
      navFailures.push(`${target.kind} inner visual scale ${widthScale.toFixed(3)}/${heightScale.toFixed(3)}, expected ${NAV_CALM_VISUAL_SCALE}`);
    }
    if (Math.abs(calmTarget.visual.centerY - calmTarget.centerY) > 1.5 ||
        (target.kind !== "brand" && Math.abs(calmTarget.visual.centerX - calmTarget.centerX) > 1.5)) {
      navFailures.push(`${target.kind} calm inner visual is not centred in its semantic target`);
    }
    if (target.kind === "brand" && Math.abs(calmTarget.visual.left - (calmTarget.centerX - calmTarget.width / 2)) > 1.5) {
      navFailures.push("brand calm inner visual is not left-anchored in its semantic target");
    }
  });
  if (!calm.brandSymbol || !prominent.brandSymbol) {
    navFailures.push("brand symbol is unavailable for calm painted-footprint comparison");
  } else {
    const expectedCalmPaintedScale = NAV_BRAND_ART_SCALE * NAV_CALM_VISUAL_SCALE;
    if (Math.abs(calm.brandSymbol.slotWidth - prominent.brandSymbol.slotWidth) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(calm.brandSymbol.slotHeight - prominent.brandSymbol.slotHeight) > NAV_GEOMETRY_TOLERANCE_PX ||
        Math.abs(calm.brandSymbol.transformScaleX - NAV_BRAND_ART_SCALE) > NAV_BRAND_ART_SCALE_TOLERANCE ||
        Math.abs(calm.brandSymbol.transformScaleY - NAV_BRAND_ART_SCALE) > NAV_BRAND_ART_SCALE_TOLERANCE ||
        Math.abs(calm.brandSymbol.paintedScaleX - expectedCalmPaintedScale) > NAV_BRAND_ART_SCALE_TOLERANCE ||
        Math.abs(calm.brandSymbol.paintedScaleY - expectedCalmPaintedScale) > NAV_BRAND_ART_SCALE_TOLERANCE) {
      navFailures.push(`calm brand symbol does not preserve its ${viewport.logoSlotPx}px slot and ${NAV_BRAND_ART_SCALE} CSS art scale (painted ${calm.brandSymbol.paintedScaleX.toFixed(3)}/${calm.brandSymbol.paintedScaleY.toFixed(3)}, expected ${expectedCalmPaintedScale.toFixed(3)})`);
    }
  }

  // Headless Chromium starts its virtual pointer at (0, 0), which is already
  // inside the sticky header but does not dispatch an initial pointerenter.
  // Move outside first so this check measures a real entry intent consistently
  // across Linux CI and interactive desktop browsers.
  await page.mouse.move(Math.floor(viewport.width / 2), Math.min(viewport.height - 1, 320));
  await page.waitForTimeout(80);
  let navFragment = null;
  const menuBox = await page.locator("#nav-menu-toggle").boundingBox();
  if (!menuBox) {
    navFailures.push("menu target is not rendered");
  } else {
    await page.mouse.move(menuBox.x + menuBox.width / 2, menuBox.y + menuBox.height / 2);
    await page.waitForTimeout(700);
    const wake = await measureNavbar(page);
    if (!/^(?:prominent|waking)$/u.test(wake.state ?? "") || wake.isCalm) {
      navFailures.push(`pointer intent did not wake the header (${wake.state})`);
    }
    await page.locator("#nav-menu-toggle").click();
    await page.waitForTimeout(120);
    const menuOpen = await page.evaluate(expectedAnchors => {
      const panel = document.getElementById("nav-panel");
      const toggle = document.getElementById("nav-menu-toggle");
      const visible = node => {
        if (!node || !node.getClientRects().length) return false;
        const style = getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01;
      };
      const localLinks = [...document.querySelectorAll("#nav-panel .nav-panel-local [data-page-destination]")];
      const headings = [...document.querySelectorAll("#nav-panel .nav-panel-heading")]
        .filter(visible).map(node => (node.textContent || "").replace(/\s+/gu, " ").trim());
      const panelLinks = [...document.querySelectorAll("#nav-panel a[href]")];
      const visibleControls = [...document.querySelectorAll("#nav-panel a[href], #nav-panel button:not([disabled])")].filter(visible);
      const undersized = visibleControls.filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.width < 43.5 || rect.height < 43.5;
      }).map(node => node.id || node.className || node.textContent.trim());
      const mobileCta = document.querySelector("#nav-panel .nav-panel-mobile-cta .header-cta");
      const mobileCtaRect = mobileCta?.getBoundingClientRect();
      const menuIcon = toggle?.querySelector(".nav-menu-icon__close");
      const mode = document.documentElement.dataset.navGlyphs || "unknown";
      const iconRect = menuIcon?.getBoundingClientRect();
      const iconPaths = menuIcon
        ? [...menuIcon.querySelectorAll("path, circle, rect, line, polyline, polygon")]
        : [];
      const paintedPaths = iconPaths.filter(path => {
        const style = getComputedStyle(path);
        const stroke = style.stroke.replace(/\s+/gu, "").toLowerCase();
        let geometry = 1;
        try {
          if (typeof path.getTotalLength === "function") geometry = path.getTotalLength();
        } catch (_) {
          geometry = 0;
        }
        return geometry > 0 && parseFloat(style.strokeWidth || "0") > 0 &&
          stroke !== "none" && stroke !== "transparent" &&
          stroke !== "rgba(0,0,0,0)" && !stroke.endsWith(",0)");
      });
      const iconVisible = visible(menuIcon) && (iconRect?.width || 0) >= 16 && (iconRect?.height || 0) >= 16 && paintedPaths.length > 0;
      return {
        state: document.querySelector(".site-header")?.dataset.navState,
        expanded: toggle?.getAttribute("aria-expanded"),
        hidden: panel?.hidden,
        focusInside: !!panel && panel.contains(document.activeElement),
        ariaModal: panel?.getAttribute("aria-modal"),
        backdropVisible: visible(document.getElementById("nav-panel-backdrop")),
        headings,
        localHrefs: localLinks.map(link => link.getAttribute("href")),
        localOrderMatches: JSON.stringify(localLinks.map(link => link.getAttribute("href"))) === JSON.stringify(expectedAnchors),
        coreRoutes: {
          citymeter: panelLinks.some(link => link.href === "https://montri-th.github.io/CityMETER/"),
          citywiki: panelLinks.some(link => link.href === "https://landometer.com/v3/citywiki"),
          signIn: panelLinks.some(link => link.href === "https://landometer.com/auth"),
          landometer: panelLinks.some(link => link.getAttribute("aria-current") === "page" && link.getAttribute("href") === "#top"),
        },
        mobileCtaVisible: visible(mobileCta),
        mobileCtaHref: mobileCta?.href || null,
        mobileCtaSize: mobileCtaRect ? { width: mobileCtaRect.width, height: mobileCtaRect.height } : null,
        undersized,
        closeIcon: {
          mode,
          state: "close",
          iconVisible,
          paintedPaths: paintedPaths.length,
        },
      };
    }, PAGE_BOOKMARK_ANCHORS);
    if (menuOpen.state !== "menu_open" || menuOpen.expanded !== "true" || menuOpen.hidden || !menuOpen.focusInside) {
      navFailures.push("opening the menu does not keep prominence and transfer focus");
    }
    if (menuOpen.ariaModal !== "true" || !menuOpen.backdropVisible) {
      navFailures.push("open menu is not a modal disclosure with a visible hit-test backdrop");
    }
    if (!menuOpen.localOrderMatches) {
      navFailures.push(`panel bookmark order ${JSON.stringify(menuOpen.localHrefs)} does not match the six-anchor contract`);
    }
    if (!Object.values(menuOpen.coreRoutes).every(Boolean)) {
      navFailures.push(`panel is missing a core route: ${JSON.stringify(menuOpen.coreRoutes)}`);
    }
    if (!menuOpen.headings.some(label => /(?:ในหน้านี้|On this page)/iu.test(label)) ||
        !menuOpen.headings.some(label => /Landometer ecosystem/iu.test(label))) {
      navFailures.push(`panel group headings are incomplete: ${JSON.stringify(menuOpen.headings)}`);
    }
    if (viewport.width <= 680) {
      if (!menuOpen.mobileCtaVisible || menuOpen.mobileCtaHref !== "https://landometer.com/auth" ||
          !menuOpen.mobileCtaSize || menuOpen.mobileCtaSize.height < 43.5) {
        navFailures.push("mobile panel does not expose the 44px Sign in primary task");
      }
    } else if (menuOpen.mobileCtaVisible) {
      navFailures.push("mobile-only panel CTA is visible at the desktop breakpoint");
    }
    if (menuOpen.undersized.length) {
      navFailures.push(`panel contains undersized direct target(s): ${menuOpen.undersized.join(", ")}`);
    }
    const closeIconVisible = menuOpen.closeIcon.mode === "inline-svg" &&
      menuOpen.closeIcon.iconVisible && menuOpen.closeIcon.paintedPaths > 0;
    if (!closeIconVisible || menuOpen.closeIcon.state !== "close") {
      navFailures.push(`close icon is not visibly rendered (${menuOpen.closeIcon.mode}/${menuOpen.closeIcon.state})`);
    }
    if (viewport.width <= 680) {
      const mobileFocusProbe = await probeNavbarCtaIntent(page, ctaIntent.selector, "focus");
      ctaIntent.probes.push(mobileFocusProbe);
      validateNavbarCtaIntentProbe(mobileFocusProbe, navFailures, `${viewport.name} menu`);
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(80);
    const afterEscape = await page.evaluate(() => ({
      hidden: document.getElementById("nav-panel")?.hidden,
      expanded: document.getElementById("nav-menu-toggle")?.getAttribute("aria-expanded"),
      focusRestored: document.activeElement === document.getElementById("nav-menu-toggle"),
    }));
    if (!afterEscape.hidden || afterEscape.expanded !== "false" || !afterEscape.focusRestored) {
      navFailures.push("Escape does not close the menu and restore trigger focus");
    }
    await page.locator("#nav-menu-toggle").click();
    await page.waitForTimeout(80);
    await page.locator("#nav-panel a[href='#v091-additions']").click();
    await page.waitForTimeout(160);
    navFragment = await page.evaluate(() => ({
      hidden: document.getElementById("nav-panel")?.hidden,
      expanded: document.getElementById("nav-menu-toggle")?.getAttribute("aria-expanded"),
      focusTransferred: document.activeElement === document.getElementById("v091-additions"),
      hash: location.hash,
    }));
    if (!navFragment.hidden || navFragment.expanded !== "false" || !navFragment.focusTransferred || navFragment.hash !== "#v091-additions") {
      navFailures.push("fragment navigation does not close the menu and focus its destination");
    }
  }

  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  await page.mouse.move(Math.floor(viewport.width / 2), Math.min(viewport.height - 1, 320));
  await page.waitForTimeout(80);
  await page.evaluate(() => scrollTo(0, Math.min(1200, document.documentElement.scrollHeight - innerHeight)));
  await page.waitForTimeout(80);
  await page.evaluate(() => scrollBy(0, 240));
  await page.waitForTimeout(700);
  await page.evaluate(() => scrollBy(0, -240));
  await page.waitForTimeout(700);
  const upward = await measureNavbar(page);
  if (upward.isCalm || upward.state !== "prominent") {
    navFailures.push(`up-scroll did not restore prominence (${upward.state})`);
  }

  navFailures.forEach(problem => failures.push(`SC-24 ${viewport.name}: ${problem}`));
  cases.push({
    item: "SC-24",
    viewport: viewport.name,
    prominent,
    calm,
    ctaIntent,
    navFragment,
    upward,
    passed: navFailures.length === 0,
  });
  await context.close();
}

for (const viewport of [
  { name: "mobile-390", width: 390, height: 844, railExpected: false },
  { name: "mobile-boundary-600", width: 600, height: 900, railExpected: false },
  { name: "compact-desktop-900", width: 900, height: 900, railExpected: true },
  { name: "compact-height-desktop-900", width: 900, height: 540, railExpected: false },
]) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(500);
  const measureRail = () => page.evaluate(expectedAnchors => {
    const rail = document.querySelector(".side-bookmark");
    const visible = node => {
      if (!node || !node.getClientRects().length) return false;
      const style = getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.01;
    };
    const links = [...document.querySelectorAll(".side-bookmark a[data-page-destination]")];
    const panelLinks = [...document.querySelectorAll("#nav-panel .nav-panel-local a[data-page-destination]")];
    const hrefs = links.map(link => link.getAttribute("href"));
    const panelHrefs = panelLinks.map(link => link.getAttribute("href"));
    const items = links.map(link => {
      const rect = link.getBoundingClientRect();
      const icon = link.querySelector(".side-bookmark__icon[data-icon]");
      const iconRect = icon?.getBoundingClientRect();
      const shapes = icon ? [...icon.querySelectorAll("path, circle, rect, line, polyline, polygon")] : [];
      const paintedShapes = shapes.filter(shape => {
        const style = getComputedStyle(shape);
        const stroke = style.stroke.replace(/\s+/gu, "").toLowerCase();
        let geometry = 1;
        try {
          if (typeof shape.getTotalLength === "function") geometry = shape.getTotalLength();
        } catch (_) {
          geometry = 0;
        }
        return geometry > 0 && parseFloat(style.strokeWidth || "0") > 0 &&
          stroke !== "none" && stroke !== "transparent" &&
          stroke !== "rgba(0,0,0,0)" && !stroke.endsWith(",0)");
      });
      const hit = rect.width && rect.height
        ? document.elementFromPoint((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2)
        : null;
      return {
        href: link.getAttribute("href"),
        width: rect.width,
        height: rect.height,
        directHit: !!hit && (hit === link || link.contains(hit)),
        accessibleName: (link.textContent || "").replace(/\s+/gu, " ").trim(),
        iconName: icon?.dataset.icon || null,
        iconSignature: shapes.map(shape => shape.getAttribute("d") || shape.outerHTML).join("|"),
        iconPaintedShapes: paintedShapes.length,
        iconVisible: visible(icon) && (iconRect?.width || 0) >= 16 && (iconRect?.height || 0) >= 16 && paintedShapes.length > 0,
      };
    });
    const railRect = rail?.getBoundingClientRect();
    const railCurrent = links.filter(link => link.getAttribute("aria-current") === "location")
      .map(link => link.getAttribute("href"));
    const panelCurrent = panelLinks.filter(link => link.getAttribute("aria-current") === "location")
      .map(link => link.getAttribute("href"));
    return {
      railVisible: visible(rail),
      railRect: railRect ? { left: railRect.left, top: railRect.top, width: railRect.width, height: railRect.height } : null,
      hrefs,
      panelHrefs,
      exactOrder: JSON.stringify(hrefs) === JSON.stringify(expectedAnchors),
      mirroredOrder: JSON.stringify(hrefs) === JSON.stringify(panelHrefs),
      items,
      railCurrent,
      panelCurrent,
    };
  }, PAGE_BOOKMARK_ANCHORS);

  const initial = await measureRail();
  const bookmarkFailures = [];
  if (initial.railVisible !== viewport.railExpected) {
    bookmarkFailures.push(`rail visibility ${initial.railVisible}, expected ${viewport.railExpected}`);
  }
  if (!initial.exactOrder || initial.hrefs.length !== PAGE_BOOKMARK_ANCHORS.length) {
    bookmarkFailures.push(`rail anchors ${JSON.stringify(initial.hrefs)} do not match the exact ordered six-anchor set`);
  }
  if (!initial.mirroredOrder) {
    bookmarkFailures.push(`rail order ${JSON.stringify(initial.hrefs)} is not mirrored in the panel ${JSON.stringify(initial.panelHrefs)}`);
  }
  if (initial.railCurrent.length !== 1 || initial.panelCurrent.length !== 1 || initial.railCurrent[0] !== initial.panelCurrent[0]) {
    bookmarkFailures.push(`current location rail=${JSON.stringify(initial.railCurrent)}, panel=${JSON.stringify(initial.panelCurrent)}`);
  }
  if (viewport.railExpected) {
    initial.items.forEach(item => {
      if (Math.abs(item.width - MIN_TARGET_PX) > NAV_GEOMETRY_TOLERANCE_PX ||
          Math.abs(item.height - MIN_TARGET_PX) > NAV_GEOMETRY_TOLERANCE_PX) {
        bookmarkFailures.push(`${item.href} target ${item.width.toFixed(1)}x${item.height.toFixed(1)}px, expected 44x44px`);
      }
      if (!item.directHit) bookmarkFailures.push(`${item.href} is not the direct bookmark hit target`);
      if (!item.accessibleName) bookmarkFailures.push(`${item.href} has no accessible text`);
      if (!item.iconName || !item.iconSignature || !item.iconVisible || item.iconPaintedShapes < 1) {
        bookmarkFailures.push(`${item.href} has no visible named outline icon`);
      }
    });
    if (new Set(initial.items.map(item => item.iconSignature)).size !== PAGE_BOOKMARK_ANCHORS.length) {
      bookmarkFailures.push("bookmark icons are not six distinct SVG silhouettes");
    }

    await page.evaluate(() => {
      const target = document.getElementById("play");
      const root = document.documentElement;
      const prior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target?.scrollIntoView({ behavior: "instant", block: "start" });
      root.style.scrollBehavior = prior;
    });
    await page.waitForTimeout(350);
    const afterScroll = await measureRail();
    if (!afterScroll.railVisible || afterScroll.hrefs.length !== PAGE_BOOKMARK_ANCHORS.length) {
      bookmarkFailures.push("rail disappears or changes membership after scrolling");
    }
    if (afterScroll.railCurrent.length !== 1 || afterScroll.railCurrent[0] !== "#play" ||
        afterScroll.panelCurrent.length !== 1 || afterScroll.panelCurrent[0] !== "#play") {
      bookmarkFailures.push(`scrollspy did not select #play exactly once (rail=${JSON.stringify(afterScroll.railCurrent)}, panel=${JSON.stringify(afterScroll.panelCurrent)})`);
    }
    if (initial.railRect && afterScroll.railRect &&
        (Math.abs(initial.railRect.left - afterScroll.railRect.left) > NAV_GEOMETRY_TOLERANCE_PX ||
         Math.abs(initial.railRect.top - afterScroll.railRect.top) > NAV_GEOMETRY_TOLERANCE_PX)) {
      bookmarkFailures.push("rail position is not stable while reading");
    }
    initial.afterScroll = afterScroll;
  }

  bookmarkFailures.forEach(problem => failures.push(`SC-24 ${viewport.name} bookmark: ${problem}`));
  cases.push({
    item: "SC-24",
    mode: "page-bookmark",
    viewport: viewport.name,
    detail: initial,
    passed: bookmarkFailures.length === 0,
  });
  await context.close();
}

// ---------- SC-26: generated Color Atlas preview is the complete Atlas identity set ----------
const atlasPreviewCases = [
  { name: "light-desktop", theme: "light", width: 1200, height: 900 },
  { name: "dark-desktop", theme: "dark", width: 1200, height: 900 },
  { name: "light-narrow", theme: "light", width: 390, height: 844 },
  { name: "dark-narrow", theme: "dark", width: 390, height: 844 },
];
for (const atlasCase of atlasPreviewCases) {
  const context = await browser.newContext({
    viewport: { width: atlasCase.width, height: atlasCase.height },
  });
  const page = await context.newPage();
  const themedArtifactUrl = new URL(artifactUrl);
  themedArtifactUrl.searchParams.set("theme", atlasCase.theme);
  await page.goto(themedArtifactUrl.href);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts?.ready);
  const ribbonLocator = page.locator(".v091-atlas-ribbon");
  await ribbonLocator.scrollIntoViewIfNeeded();
  // The preview may be a descendant of a governed reveal group. Wait out the
  // 450ms stagger plus the 920ms slow transform before testing painted output.
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const atlas = document.getElementById("complete-color-atlas");
    if (atlas instanceof HTMLDetailsElement) atlas.open = true;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  const measured = await page.evaluate(() => {
    const normalizeColor = value => String(value || "").replace(/\s+/gu, "").toLowerCase();
    const elementVisible = node => {
      if (!node || !node.getClientRects().length) return false;
      for (let current = node; current instanceof Element; current = current.parentElement) {
        const style = getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.01) {
          return false;
        }
      }
      return true;
    };
    const ribbon = document.querySelector(".v091-atlas-ribbon[data-atlas-preview-family='identity-energy']");
    const ribbonRect = ribbon?.getBoundingClientRect();
    const preview = ribbon ? [...ribbon.querySelectorAll(":scope > .v091-atlas-ribbon__swatch")] : [];
    const previewRecords = preview.map(node => {
      const rect = node.getBoundingClientRect();
      const background = normalizeColor(getComputedStyle(node).backgroundColor);
      return {
        token: node.dataset.atlasToken || null,
        value: node.dataset.atlasValue || null,
        background,
        width: rect.width,
        height: rect.height,
        painted: elementVisible(node) && rect.width > 0 && rect.height > 0 &&
          background !== "transparent" && background !== "rgba(0,0,0,0)" && !background.endsWith(",0)"),
        contained: !!ribbonRect && rect.left >= ribbonRect.left - 1 && rect.right <= ribbonRect.right + 1 &&
          rect.top >= ribbonRect.top - 1 && rect.bottom <= ribbonRect.bottom + 1,
      };
    });
    const identityGrid = document.querySelector(".atlas-family--identity > .atlas-token-grid");
    const identityCards = identityGrid
      ? [...identityGrid.children].filter(node => node.matches(".atlas-token-card:not(.atlas-token-card--asset)"))
      : [];
    const completeRecords = identityCards.slice(0, 7).map(card => {
      const swatch = card.querySelector(".atlas-swatch");
      return {
        token: card.querySelector(".atlas-token-id")?.textContent?.trim() || null,
        value: card.querySelector(".atlas-token-value")?.textContent?.trim() || null,
        background: swatch ? normalizeColor(getComputedStyle(swatch).backgroundColor) : null,
      };
    });
    return {
      resolvedTheme: document.documentElement.dataset.theme || null,
      themePreference: document.documentElement.dataset.themePreference || null,
      family: ribbon?.dataset.atlasPreviewFamily || null,
      registry: ribbon?.dataset.colorRegistry || null,
      role: ribbon?.getAttribute("role") || null,
      previewRecords,
      completeIdentityRecordCount: identityCards.length,
      completeRecords,
      overflowPx: ribbon ? Math.max(0, ribbon.scrollWidth - ribbon.clientWidth) : null,
      viewportOverflowPx: ribbonRect
        ? Math.max(0, -ribbonRect.left, ribbonRect.right - innerWidth)
        : null,
    };
  });
  const atlasFailures = [];
  const expectedRecords = ATLAS_PREVIEW_RECORDS.map(({ token, value }) => ({ token, value }));
  const measuredPreviewRecords = measured.previewRecords.map(({ token, value }) => ({ token, value }));
  const measuredCompleteRecords = measured.completeRecords.map(({ token, value }) => ({ token, value }));
  if (measured.resolvedTheme !== atlasCase.theme || measured.themePreference !== atlasCase.theme) {
    atlasFailures.push(`resolved theme ${measured.themePreference}/${measured.resolvedTheme}, expected explicit ${atlasCase.theme}`);
  }
  if (measured.family !== "identity-energy" || measured.registry !== artifactColorRegistryId || measured.role !== "list") {
    atlasFailures.push(`preview authority ${measured.family}/${measured.registry}/${measured.role} is incomplete`);
  }
  if (measured.previewRecords.length !== ATLAS_PREVIEW_RECORDS.length ||
      JSON.stringify(measuredPreviewRecords) !== JSON.stringify(expectedRecords)) {
    atlasFailures.push(`preview order/value ${JSON.stringify(measuredPreviewRecords)} does not match the governed seven records`);
  }
  if (measured.completeIdentityRecordCount < ATLAS_PREVIEW_RECORDS.length ||
      JSON.stringify(measuredCompleteRecords) !== JSON.stringify(expectedRecords)) {
    atlasFailures.push(`complete Atlas identity order/value ${JSON.stringify(measuredCompleteRecords)} is not the governed source set`);
  }
  measured.previewRecords.forEach((record, index) => {
    const expected = ATLAS_PREVIEW_RECORDS[index];
    if (!expected) return;
    if (!record.painted || record.background !== expected.computed) {
      atlasFailures.push(`${expected.token} preview paint ${record.background || "missing"}, expected ${expected.computed}`);
    }
    if (!record.contained) atlasFailures.push(`${expected.token} escapes the preview ribbon`);
    const complete = measured.completeRecords[index];
    if (!complete || complete.background !== expected.computed || complete.background !== record.background) {
      atlasFailures.push(`${expected.token} preview paint is not equal to the complete Atlas (${complete?.background || "missing"})`);
    }
  });
  if ((measured.overflowPx ?? 1) > 1 || (measured.viewportOverflowPx ?? 1) > 1) {
    atlasFailures.push(`preview overflows by ${measured.overflowPx}/${measured.viewportOverflowPx}px`);
  }
  atlasFailures.forEach(problem => failures.push(`SC-26 ${atlasCase.name}: ${problem}`));
  cases.push({
    item: "SC-26",
    mode: "color-atlas-preview",
    viewport: atlasCase.name,
    detail: measured,
    passed: atlasFailures.length === 0,
  });
  await context.close();
}

// ---------- SC-27: hosted latest-alias build freshness, isolated from the network ----------
{
  const context = await browser.newContext({ viewport: { width: 900, height: 700 } });
  const page = await context.newPage();
  const qaOrigin = "https://landometer-freshness.invalid";
  const sourceBuild = htmlDataAttribute(latestAliasSource, "data-artifact-build") || "unknown";
  const nextBuild = `${sourceBuild}-freshness-probe`;
  let documentRequests = 0;
  let manifestRequests = 0;
  await page.route("**/*", async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== qaOrigin) {
      await route.abort("blockedbyclient");
      return;
    }
    if (url.pathname === "/site-manifest.v0.9.1.json") {
      manifestRequests += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "cache-control": "no-store" },
        body: JSON.stringify({ artifact: { artifactBuildId: nextBuild } }),
      });
      return;
    }
    if (url.pathname === "/") {
      if (request.resourceType() === "document") documentRequests += 1;
      await route.fulfill({ status: 200, contentType: "text/html", body: latestAliasSource });
      return;
    }
    await route.fulfill({ status: 404, contentType: "text/plain", body: "not found" });
  });
  const freshnessFailures = [];
  await page.goto(`${qaOrigin}/?theme=light`, { waitUntil: "domcontentloaded" });
  try {
    await page.waitForURL(url => url.searchParams.get("build") === nextBuild, { timeout: 4000 });
  } catch (_) {
    freshnessFailures.push("latest-alias page did not replace itself with the manifest build URL");
  }
  await page.waitForTimeout(300);
  const firstPass = await page.evaluate(({ sourceBuild, nextBuild }) => ({
    sourceBuild: document.documentElement.dataset.artifactBuild || null,
    buildParam: new URL(location.href).searchParams.get("build"),
    freshMarker: new URL(location.href).searchParams.get("_build_fresh"),
    refreshGuard: sessionStorage.getItem(`landometer-build-refresh:${sourceBuild}:${nextBuild}`),
  }), { sourceBuild, nextBuild });
  if (firstPass.sourceBuild !== sourceBuild || firstPass.buildParam !== nextBuild ||
      !firstPass.freshMarker || firstPass.refreshGuard !== "done") {
    freshnessFailures.push(`freshness state is incomplete: ${JSON.stringify(firstPass)}`);
  }
  const documentsBeforeReload = documentRequests;
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  const secondPassUrl = new URL(page.url());
  if (secondPassUrl.searchParams.get("build") !== nextBuild ||
      documentRequests !== documentsBeforeReload + 1) {
    freshnessFailures.push(`session guard allowed a reload loop (${documentRequests - documentsBeforeReload} document requests)`);
  }
  if (manifestRequests < 2) {
    freshnessFailures.push(`freshness manifest was not checked after both page shows (${manifestRequests})`);
  }
  const detail = {
    sourceBuild,
    nextBuild,
    firstPass,
    finalUrl: page.url(),
    documentRequests,
    manifestRequests,
  };
  freshnessFailures.forEach(problem => failures.push(`SC-27 latest-alias: ${problem}`));
  cases.push({
    item: "SC-27",
    mode: "isolated-latest-build-freshness",
    detail,
    passed: freshnessFailures.length === 0,
  });
  await context.close();
}

// ---------- SC-22: entrance never withholds content ----------
const revealProbe = async (options, probe) => {
  const { disableIntersectionObserver = false, fragmentHash = "", ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, ...contextOptions });
  const page = await context.newPage();
  if (disableIntersectionObserver) {
    await page.addInitScript(() => {
      try { delete window.IntersectionObserver; } catch (_) {}
      try { delete Window.prototype.IntersectionObserver; } catch (_) {}
    });
  }
  await page.goto(`${artifactUrl}${fragmentHash}`);
  await page.waitForLoadState("load");
  // v0.9.1 approach profile: stagger cap 450ms + transform 920ms; wait out
  // the longest path before measuring the resting state.
  await page.waitForTimeout(2600);
  const value = await probe(page);
  await context.close();
  return value;
};

// 1. default motion: nothing the reader has reached may be invisible; below-fold groups
//    keep a real entrance; opening a disclosure never exposes an empty container
const normal = await revealProbe({}, async page => {
  const atRest = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[data-riddim-reveal]")];
    const reached = all.filter(n => n.getBoundingClientRect().top < window.innerHeight);
    const semanticSelector = "main section, main article, main aside, main figure, main details, main form, main table, main [role='tabpanel'], main [role='tablist'], main [role='group']";
    const semantic = [...document.querySelectorAll(semanticSelector)];
    const policies = [...document.querySelectorAll("[data-motion-policy]")];
    const vocabulary = new Set([
      "reveal.supporting", "settle.visible", "state.direct", "state.disclosure",
      "static.critical", "static.evidence", "container.orchestrates", "contained.inherited",
    ]);
    const critical = [...document.querySelectorAll([
      ".hero-copy", ".hero-media", ".primary-action", "[role='status']", "[aria-live]",
      ".proof-preview", ".stage-output", ".truth-lock", ".handoff-record", ".recipe",
      ".closing-inner", ".site-footer",
    ].join(","))];
    const evidence = [...document.querySelectorAll([
      ".logo-rule-surface", ".brand-identity-sample", ".receipt-readout", ".sc-table",
      ".color-example-preview", ".color-route-card", ".color-plate", ".scale-family-card",
      ".dataviz-pattern", ".citymeter-chart-card", ".atlas-token-card", ".atlas-pair-card",
      ".atlas-state-card", ".atlas-gradient-card", ".atlas-product-card", ".atlas-series-card",
      ".atlas-scale-record", ".atlas-special-card", ".atlas-map-card", ".atlas-opacity-row",
      ".atlas-depth-layout",
    ].join(","))];
    const revealProtected = [...document.querySelectorAll([
      ".hero-copy", ".hero-media", ".primary-action", ".secondary-action", ".copy-button",
      ".download-action", "button", "input", "select", "textarea", "[role='status']", "[aria-live]",
      ".proof-preview", ".stage-output", ".truth-lock", ".handoff-record", ".recipe",
      ".closing-inner", ".site-footer",
    ].join(","))];
    const cadenceTerritories = ["v091-additions", "play", "align", "takeaway", "implementation-library"]
      .map(id => {
        const host = document.getElementById(id);
        const revealPolicies = host ? [...host.querySelectorAll("[data-motion-policy='reveal.supporting']")] : [];
        return {
          id,
          exists: !!host,
          revealPolicies: revealPolicies.length,
          enrolled: revealPolicies.filter(node => node.hasAttribute("data-riddim-reveal")).length,
          visible: revealPolicies.filter(node => node.getClientRects().length > 0 && !node.closest("[hidden], details:not([open])")).length,
        };
      });
    const settle = policies.filter(node => node.dataset.motionPolicy === "settle.visible");
    return {
      marked: all.length,
      reachedInvisible: reached.filter(n => Number(getComputedStyle(n).opacity) < 0.99).length,
      insideClosedOrHidden: all.filter(n => n.closest("details:not([open])") || n.closest("[hidden]")).length,
      coverage: document.documentElement.dataset.motionCoverage,
      coverageComponents: Number(document.documentElement.dataset.motionCoverageComponents || 0),
      coverageFamilies: Number(document.documentElement.dataset.motionCoverageFamilies || 0),
      semanticTotal: semantic.length,
      semanticMissingPolicy: semantic.filter(node => !node.dataset.motionPolicy).length,
      invalidPolicies: policies.filter(node => !vocabulary.has(node.dataset.motionPolicy)).length,
      missingFamilies: policies.filter(node => !node.dataset.motionFamily).length,
      criticalTotal: critical.length,
      criticalWrongPolicy: critical.filter(node => node.dataset.motionPolicy !== "static.critical").length,
      criticalAnimated: critical.filter(node => node.hasAttribute("data-riddim-reveal") || node.hasAttribute("data-motion-role")).length,
      protectedWithinReveal: revealProtected.filter(node => !!node.closest("[data-riddim-reveal]")).length,
      evidenceTotal: evidence.length,
      evidenceWrongPolicy: evidence.filter(node => node.dataset.motionPolicy !== "static.evidence").length,
      evidenceAnimated: evidence.filter(node => node.hasAttribute("data-riddim-reveal") || node.hasAttribute("data-motion-role")).length,
      evidenceWithinReveal: evidence.filter(node => !!node.closest("[data-riddim-reveal]")).length,
      revealWrongPolicy: all.filter(node => node.dataset.motionPolicy !== "reveal.supporting").length,
      cadenceTerritories,
      settleTotal: settle.length,
      settleContentMoved: settle.filter(node => {
        const style = getComputedStyle(node);
        return Number(style.opacity) < 0.99 || style.transform !== "none";
      }).length,
      detailsWrongPolicy: [...document.querySelectorAll("details")]
        .filter(node => node.dataset.motionPolicy !== "state.disclosure").length,
    };
  });
  const transitionProbe = await page.evaluate(() => {
    const territoryIds = ["v091-additions", "play", "align", "takeaway", "implementation-library"];
    const candidates = territoryIds.flatMap(id => {
      const host = document.getElementById(id);
      return host ? [...host.querySelectorAll("[data-riddim-reveal]:not([data-riddim-landed])")] : [];
    }).filter(node => {
      const rect = node.getBoundingClientRect();
      return rect.top > innerHeight * 1.05 && node.getClientRects().length > 0 && !node.closest("details:not([open]), [hidden]");
    });
    const node = candidates.sort((a, b) => {
      const aDelay = parseFloat(getComputedStyle(a).transitionDelay) || 0;
      const bDelay = parseFloat(getComputedStyle(b).transitionDelay) || 0;
      return aDelay - bDelay;
    })[0];
    if (!node) return { found: false };
    node.dataset.qaTransitionProbe = "true";
    const style = getComputedStyle(node);
    const seconds = value => value.split(",").map(part => {
      const token = part.trim();
      return token.endsWith("ms") ? parseFloat(token) : parseFloat(token) * 1000;
    });
    const properties = style.transitionProperty.split(",").map(part => part.trim());
    const durations = seconds(style.transitionDuration);
    const delays = seconds(style.transitionDelay);
    const durationFor = property => {
      const index = properties.indexOf(property);
      return index < 0 ? 0 : durations[index % durations.length];
    };
    const matrix = style.transform === "none" ? null : new DOMMatrixReadOnly(style.transform);
    return {
      found: true,
      territory: territoryIds.find(id => document.getElementById(id)?.contains(node)) || null,
      role: node.dataset.motionRole || null,
      initialOpacity: Number(style.opacity),
      initialDisplacement: matrix ? Math.hypot(matrix.e, matrix.f) : 0,
      opacityDurationMs: durationFor("opacity"),
      transformDurationMs: durationFor("transform"),
      delayMs: Math.max(0, ...delays),
      initialTransform: style.transform,
      initialLanded: node.hasAttribute("data-riddim-landed"),
    };
  });
  if (transitionProbe.found) {
    await page.evaluate(() => {
      const node = document.querySelector("[data-qa-transition-probe='true']");
      const root = document.documentElement;
      const prior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      node?.scrollIntoView({ behavior: "instant", block: "center" });
      root.style.scrollBehavior = prior;
    });
    await page.waitForTimeout(Math.min(700, transitionProbe.delayMs + 140));
    transitionProbe.mid = await page.evaluate(() => {
      const node = document.querySelector("[data-qa-transition-probe='true']");
      const style = node ? getComputedStyle(node) : null;
      const matrix = style && style.transform !== "none" ? new DOMMatrixReadOnly(style.transform) : null;
      return {
        opacity: Number(style?.opacity || 0),
        displacement: matrix ? Math.hypot(matrix.e, matrix.f) : 0,
        landed: !!node?.hasAttribute("data-riddim-landed"),
      };
    });
    await page.waitForTimeout(Math.max(1100, 1050 + transitionProbe.delayMs));
    transitionProbe.final = await page.evaluate(() => {
      const node = document.querySelector("[data-qa-transition-probe='true']");
      const style = node ? getComputedStyle(node) : null;
      const matrix = style && style.transform !== "none" ? new DOMMatrixReadOnly(style.transform) : null;
      return {
        opacity: Number(style?.opacity || 0),
        displacement: matrix ? Math.hypot(matrix.e, matrix.f) : 0,
        landed: !!node?.hasAttribute("data-riddim-landed"),
      };
    });
  }
  // Reach each enrolled supporting group and visible-settle component once. A single
  // jump to the footer can skip intermediate IntersectionObserver crossings and would
  // not represent reading through the component library.
  await page.evaluate(async () => {
    const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const nodes = new Set([
      ...document.querySelectorAll("[data-riddim-reveal]"),
      ...document.querySelectorAll("[data-motion-policy='settle.visible']"),
    ]);
    for (const node of nodes) {
      if (!node.getClientRects().length || node.closest("details:not([open])") || node.closest("[hidden]")) continue;
      node.scrollIntoView({ behavior: "instant", block: "center" });
      await nextFrame();
    }
    root.style.scrollBehavior = previousScrollBehavior;
  });
  // The final sibling may carry the full 450ms stagger plus a 920ms transform.
  // Let that governed maximum settle before testing the once-only return state.
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(120);
  const afterReturn = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[data-riddim-reveal]")];
    const probe = document.querySelector("[data-qa-transition-probe='true']");
    return { landed: all.filter(n => n.hasAttribute("data-riddim-landed")).length, total: all.length,
      invisible: all.filter(n => Number(getComputedStyle(n).opacity) < 0.99).length,
      probeStayedLanded: !!probe?.hasAttribute("data-riddim-landed"),
      probeOpacity: probe ? Number(getComputedStyle(probe).opacity) : null };
  });
  const afterOpen = await page.evaluate(async () => {
    document.querySelectorAll("details").forEach(d => { d.open = true; });
    await new Promise(r => setTimeout(r, 900));
    const all = [...document.querySelectorAll("[data-riddim-reveal]")];
    const openDetails = [...document.querySelectorAll("details[open]")];
    const visibleSettle = [...document.querySelectorAll("[data-motion-policy='settle.visible']")]
      .filter(node => node.getClientRects().length > 0 && !node.closest("[hidden]"));
    return {
      invisible: all.filter(n => Number(getComputedStyle(n).opacity) < 0.99).length,
      total: all.length,
      unlandedRoles: [...document.querySelectorAll("[data-motion-role]:not([data-riddim-landed])")]
        .filter(node => node.getClientRects().length > 0 && !node.closest("[hidden]")).length,
      visibleUnsettled: visibleSettle.filter(node => !node.hasAttribute("data-motion-settled")).length,
      disclosureWrongPolicy: openDetails.filter(node => node.dataset.motionPolicy !== "state.disclosure").length,
      disclosureInvisible: openDetails.flatMap(detail => [...detail.querySelectorAll("[data-motion-policy], [data-motion-role]")])
        .filter(node => node.getClientRects().length > 0 && Number(getComputedStyle(node).opacity) < 0.99).length,
    };
  });
  return { atRest, transitionProbe, afterReturn, afterOpen };
});
if (normal.atRest.reachedInvisible > 0) failures.push(`SC-22 default: ${normal.atRest.reachedInvisible} reached group(s) left invisible`);
if (normal.atRest.insideClosedOrHidden > 0) failures.push(`SC-22 default: ${normal.atRest.insideClosedOrHidden} group(s) inside a closed disclosure or hidden panel carry the hidden state`);
if (normal.afterReturn.invisible > 0) failures.push(`SC-22 return-scroll: ${normal.afterReturn.invisible} group(s) re-hidden after scrolling away and back`);
if (normal.afterReturn.landed !== normal.afterReturn.total) failures.push("SC-22 return-scroll: a landed group did not stay landed");
if (normal.transitionProbe.found && (!normal.afterReturn.probeStayedLanded || normal.afterReturn.probeOpacity < 0.99)) {
  failures.push("SC-22 return-scroll: the perceptual probe replayed or left its final state");
}
if (normal.afterOpen.invisible > 0) failures.push(`SC-22 open-disclosure: ${normal.afterOpen.invisible} group(s) invisible after their section was opened`);
const cadenceFailures = normal.atRest.cadenceTerritories
  .filter(territory => !territory.exists || territory.revealPolicies < 1 || territory.enrolled < 1 || territory.visible < 1);
if (cadenceFailures.length) {
  failures.push(`SC-25 cadence: missing explicit visible reveal in ${cadenceFailures.map(territory => territory.id).join(", ")}`);
}
if (!normal.transitionProbe.found) {
  failures.push("SC-22 perceptual: no below-fold reveal was available to measure");
} else {
  const transition = normal.transitionProbe;
  const changedMidFlight = !!transition.mid &&
    (transition.mid.opacity > transition.initialOpacity + 0.01 ||
      transition.mid.displacement < transition.initialDisplacement - 0.5);
  const reachedFinal = !!transition.final && transition.final.landed &&
    transition.final.opacity >= 0.99 && transition.final.displacement <= 0.5;
  if (transition.initialLanded || transition.initialOpacity > 0.1 || transition.initialDisplacement < 24 ||
      transition.opacityDurationMs < 700 || transition.transformDurationMs < 850 ||
      !changedMidFlight || !reachedFinal) {
    failures.push(`SC-22 perceptual: reveal is not a clear slow transition ${JSON.stringify(transition)}`);
  }
}
if (normal.atRest.coverage !== "complete" || normal.atRest.semanticMissingPolicy > 0 || normal.atRest.invalidPolicies > 0 || normal.atRest.missingFamilies > 0) {
  failures.push(`SC-25 coverage: runtime=${normal.atRest.coverage}, semantic missing=${normal.atRest.semanticMissingPolicy}, invalid=${normal.atRest.invalidPolicies}, family missing=${normal.atRest.missingFamilies}`);
}
if (normal.atRest.coverageComponents < normal.atRest.semanticTotal || normal.atRest.coverageFamilies < 9) {
  failures.push(`SC-25 coverage: ${normal.atRest.coverageComponents} audited components / ${normal.atRest.coverageFamilies} families is incomplete`);
}
if (normal.atRest.criticalWrongPolicy > 0 || normal.atRest.criticalAnimated > 0 || normal.atRest.protectedWithinReveal > 0) {
  failures.push(`SC-25 critical: wrong policy=${normal.atRest.criticalWrongPolicy}, enrolled=${normal.atRest.criticalAnimated}, within reveal=${normal.atRest.protectedWithinReveal}`);
}
if (normal.atRest.evidenceWrongPolicy > 0 || normal.atRest.evidenceAnimated > 0 || normal.atRest.evidenceWithinReveal > 0) {
  failures.push(`SC-25 evidence: wrong policy=${normal.atRest.evidenceWrongPolicy}, enrolled=${normal.atRest.evidenceAnimated}, within reveal=${normal.atRest.evidenceWithinReveal}`);
}
if (normal.atRest.revealWrongPolicy > 0 || normal.atRest.settleContentMoved > 0) {
  failures.push(`SC-25 policy: reveal wrong=${normal.atRest.revealWrongPolicy}, settle moved=${normal.atRest.settleContentMoved}`);
}
if (normal.atRest.detailsWrongPolicy > 0 || normal.afterOpen.disclosureWrongPolicy > 0 || normal.afterOpen.disclosureInvisible > 0) {
  failures.push(`SC-25 disclosure: policy before=${normal.atRest.detailsWrongPolicy}, policy after=${normal.afterOpen.disclosureWrongPolicy}, invisible=${normal.afterOpen.disclosureInvisible}`);
}
if (normal.afterOpen.unlandedRoles > 0 || normal.afterOpen.visibleUnsettled > 0) {
  failures.push(`SC-25 completion: visible unlanded=${normal.afterOpen.unlandedRoles}, visible unsettled=${normal.afterOpen.visibleUnsettled}`);
}

// 2. reduced motion and 3. no JavaScript: the hidden state must never be applied
const reduced = await revealProbe({ reducedMotion: "reduce" }, async page => {
  await page.evaluate(() => scrollTo(0, Math.min(1200, document.documentElement.scrollHeight - innerHeight)));
  await page.waitForTimeout(700);
  await page.locator(".nav-cta--header .header-cta").hover();
  await page.waitForTimeout(32);
  return page.evaluate(() => ({
    motionApproach: document.documentElement.getAttribute("data-motion-approach"),
    motionCoverage: document.documentElement.dataset.motionCoverage,
    marked: document.querySelectorAll("[data-riddim-reveal]").length,
    unlandedRoles: document.querySelectorAll("[data-motion-role]:not([data-riddim-landed])").length,
    unsettled: document.querySelectorAll("[data-motion-policy='settle.visible']:not([data-motion-settled])").length,
    invisible: [...document.querySelectorAll(".v090-card, .value-contrast-card")]
      .filter(n => Number(getComputedStyle(n).opacity) < 0.99).length,
    calmHeader: document.querySelector(".site-header")?.classList.contains("is-calm") ?? false,
    navState: document.querySelector(".site-header")?.dataset.navState,
    navCta: (() => {
      const anchor = document.querySelector(".nav-cta--header .header-cta");
      const label = anchor?.querySelector(".nav-cta__label");
      const sweep = anchor?.querySelector(".nav-cta__sweep");
      const rect = anchor?.getBoundingClientRect();
      const hit = rect ? document.elementFromPoint((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2) : null;
      return {
        sweepDisplay: sweep ? getComputedStyle(sweep).display : null,
        labelOpacity: label ? Number(getComputedStyle(label).opacity) : 0,
        directHit: !!anchor && !!hit && (hit === anchor || anchor.contains(hit)),
      };
    })(),
  }));
});
if (reduced.motionApproach) failures.push("SC-22 reduced-motion: the entrance layer was enabled");
if (reduced.marked > 0) failures.push(`SC-22 reduced-motion: ${reduced.marked} group(s) carry the hidden state`);
if (reduced.invisible > 0) failures.push(`SC-22 reduced-motion: ${reduced.invisible} group(s) invisible`);
if (reduced.motionCoverage !== "complete" || reduced.unlandedRoles > 0 || reduced.unsettled > 0) {
  failures.push(`SC-25 reduced-motion: coverage=${reduced.motionCoverage}, unlanded=${reduced.unlandedRoles}, unsettled=${reduced.unsettled}`);
}
if (reduced.calmHeader || reduced.navState !== "prominent") failures.push(`SC-24 reduced-motion: header state ${reduced.navState}`);
if (reduced.navCta.sweepDisplay !== "none" || reduced.navCta.labelOpacity < 0.999 || !reduced.navCta.directHit) {
  failures.push(`SC-24 reduced-motion: navbar CTA cue is not hidden with a readable, direct final state (${JSON.stringify(reduced.navCta)})`);
}

const noJs = await revealProbe({ javaScriptEnabled: false }, page => page.evaluate(() => ({
  motionApproach: document.documentElement.getAttribute("data-motion-approach"),
  marked: document.querySelectorAll("[data-riddim-reveal]").length,
  cards: document.querySelectorAll(".v090-card").length,
  visibleCards: [...document.querySelectorAll(".v090-card")]
    .filter(n => Number(getComputedStyle(n).opacity) > 0.99).length,
  sourceMotionInvisible: [...document.querySelectorAll("[data-motion-role]")]
    .filter(n => Number(getComputedStyle(n).opacity) < 0.99 || getComputedStyle(n).transform !== "none").length,
  noJsIndexVisible: !!document.querySelector(".no-js-page-index")?.getClientRects().length,
  requiredRoutes: [
    "https://montri-th.github.io/CityMETER/",
    "https://landometer.com/v3/citywiki",
    "https://landometer.com/auth",
  ].every(href => [...document.querySelectorAll(".no-js-page-index a")].some(link => link.href === href)),
  visibleJsOnly: [...document.querySelectorAll(".js-only")].filter(node => node.getClientRects().length > 0).length,
})));
if (noJs.motionApproach) failures.push("SC-22 no-JS: the entrance layer was enabled");
if (noJs.marked > 0) failures.push(`SC-22 no-JS: ${noJs.marked} group(s) carry the hidden state`);
if (noJs.cards && noJs.visibleCards !== noJs.cards) failures.push(`SC-22 no-JS: ${noJs.cards - noJs.visibleCards} card(s) not fully visible`);
if (noJs.sourceMotionInvisible > 0) failures.push(`SC-25 no-JS: ${noJs.sourceMotionInvisible} source motion node(s) are not in their final state`);
if (!noJs.noJsIndexVisible || !noJs.requiredRoutes || noJs.visibleJsOnly > 0) {
  failures.push(`SC-24 no-JS: index=${noJs.noJsIndexVisible}, routes=${noJs.requiredRoutes}, visible JS-only=${noJs.visibleJsOnly}`);
}

const ioFailure = await revealProbe({ disableIntersectionObserver: true }, page => page.evaluate(() => ({
  motionApproach: document.documentElement.getAttribute("data-motion-approach"),
  motionCoverage: document.documentElement.dataset.motionCoverage,
  marked: document.querySelectorAll("[data-riddim-reveal]").length,
  unlandedRoles: document.querySelectorAll("[data-motion-role]:not([data-riddim-landed])").length,
  unsettled: document.querySelectorAll("[data-motion-policy='settle.visible']:not([data-motion-settled])").length,
  invisible: [...document.querySelectorAll("[data-motion-role], [data-motion-policy='settle.visible']")]
    .filter(node => Number(getComputedStyle(node).opacity) < 0.99 || getComputedStyle(node).transform !== "none").length,
})));
if (ioFailure.motionApproach || ioFailure.marked > 0 || ioFailure.unlandedRoles > 0 || ioFailure.unsettled > 0 || ioFailure.invisible > 0) {
  failures.push(`SC-25 IO-failure: approach=${ioFailure.motionApproach}, marked=${ioFailure.marked}, unlanded=${ioFailure.unlandedRoles}, unsettled=${ioFailure.unsettled}, invisible=${ioFailure.invisible}`);
}
if (ioFailure.motionCoverage !== "complete") failures.push(`SC-25 IO-failure: coverage=${ioFailure.motionCoverage}`);

const fragment = await revealProbe({}, async page => {
  const targetId = await page.evaluate(() => {
    const link = [...document.querySelectorAll("[data-reveal-target]")]
      .find(candidate => document.getElementById(candidate.dataset.revealTarget)?.closest("details:not([open])"));
    if (!link) return null;
    link.click();
    return link.dataset.revealTarget;
  });
  await page.waitForTimeout(180);
  return page.evaluate(id => {
    const target = id ? document.getElementById(id) : null;
    const details = target?.closest("details");
    const hiddenMotionAncestor = target?.closest("[data-riddim-reveal]:not([data-riddim-landed])");
    const unsettledAncestor = target?.closest("[data-motion-policy='settle.visible']:not([data-motion-settled])");
    return {
      targetId: id,
      detailsOpen: !!details?.open,
      focusTransferred: !!target && (document.activeElement === target || target.contains(document.activeElement)),
      hiddenMotionAncestor: !!hiddenMotionAncestor,
      unsettledAncestor: !!unsettledAncestor,
      hash: location.hash,
    };
  }, targetId);
});
if (!fragment.targetId || !fragment.detailsOpen || !fragment.focusTransferred || fragment.hiddenMotionAncestor || fragment.unsettledAncestor || fragment.hash !== `#${fragment.targetId}`) {
  failures.push(`SC-25 fragment: target=${fragment.targetId}, open=${fragment.detailsOpen}, focus=${fragment.focusTransferred}, hidden=${fragment.hiddenMotionAncestor}, unsettled=${fragment.unsettledAncestor}, hash=${fragment.hash}`);
}

const initialDeepLink = await revealProbe({ fragmentHash: "#library-color-guide" }, page => page.evaluate(() => {
  const target = document.getElementById("library-color-guide");
  const details = target ? [...document.querySelectorAll("details")].filter(node => node.contains(target)) : [];
  const motionChain = target
    ? [target, ...target.querySelectorAll("[data-motion-role], [data-motion-policy]")]
    : [];
  const hiddenAncestor = target?.closest("[data-riddim-reveal]:not([data-riddim-landed])");
  const unsettledAncestor = target?.closest("[data-motion-policy='settle.visible']:not([data-motion-settled])");
  return {
    targetExists: !!target,
    hash: location.hash,
    containingDetails: details.length,
    closedDetails: details.filter(node => !node.open).length,
    hiddenAncestor: !!hiddenAncestor,
    unsettledAncestor: !!unsettledAncestor,
    nonFinalDescendants: motionChain.filter(node => {
      const style = getComputedStyle(node);
      return Number(style.opacity) < 0.99 || style.transform !== "none";
    }).length,
  };
}));
if (!initialDeepLink.targetExists || initialDeepLink.hash !== "#library-color-guide" ||
    initialDeepLink.closedDetails > 0 || initialDeepLink.hiddenAncestor || initialDeepLink.unsettledAncestor ||
    initialDeepLink.nonFinalDescendants > 0) {
  failures.push(`SC-25 deep-link: ${JSON.stringify(initialDeepLink)}`);
}

cases.push({ item: "SC-22", mode: "default", detail: normal, passed: !failures.some(f => f.startsWith("SC-22 default") || f.startsWith("SC-22 return") || f.startsWith("SC-22 open") || f.startsWith("SC-22 perceptual")) });
cases.push({ item: "SC-22", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-22 reduced")) });
cases.push({ item: "SC-22", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-22 no-JS")) });
cases.push({ item: "SC-24", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-24 reduced")) });
cases.push({ item: "SC-24", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-24 no-JS")) });
cases.push({ item: "SC-25", mode: "default", detail: normal, passed: !failures.some(f => f.startsWith("SC-25 coverage") || f.startsWith("SC-25 cadence") || f.startsWith("SC-25 critical") || f.startsWith("SC-25 evidence") || f.startsWith("SC-25 policy") || f.startsWith("SC-25 disclosure") || f.startsWith("SC-25 completion")) });
cases.push({ item: "SC-25", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-25 reduced")) });
cases.push({ item: "SC-25", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-25 no-JS")) });
cases.push({ item: "SC-25", mode: "intersection-observer-unavailable", detail: ioFailure, passed: !failures.some(f => f.startsWith("SC-25 IO-failure")) });
cases.push({ item: "SC-25", mode: "fragment-focus", detail: fragment, passed: !failures.some(f => f.startsWith("SC-25 fragment")) });
cases.push({ item: "SC-25", mode: "initial-deep-link", detail: initialDeepLink, passed: !failures.some(f => f.startsWith("SC-25 deep-link")) });

await browser.close();

const evidence = {
  schemaVersion: "1.4",
  rules: ["[BTN-GEOM-01]", "[REVEAL-01]", "[NAV-01]", "[MOTION-COVERAGE-01]", "[TOKEN-01]", "[VIS-04]", "[WEBFMT-01]"],
  selfCheckItems: ["SC-21", "SC-22", "SC-23", "SC-24", "SC-25", "SC-26", "SC-27"],
  dsVersion: artifactDsVersion,
  authoringRevision: registry?.meta?.authoringRevision,
  colorRegistryId: artifactColorRegistryId,
  registryPath: registryInput.relative,
  artifactBuild: artifactBuildId,
  artifactPath: artifactInput.relative,
  artifactSha256,
  artifactFingerprint,
  assertions: {
    minCapsuleInlinePaddingCssPx: MIN_CAPSULE_INLINE_PADDING_PX,
    minTargetCssPx: MIN_TARGET_PX,
    iconCentredWithLabelToleranceCssPx: ICON_CENTRE_TOLERANCE_PX,
    iconLabelGapIsSpace2ToleranceCssPx: { below: ICON_GAP_TOLERANCE_LOW_PX, above: ICON_GAP_TOLERANCE_HIGH_PX },
    entranceNeverWithholdsReachedContent: true,
    entranceAbsentInsideClosedDisclosureOrHiddenPanel: true,
    entranceLandsOnce: true,
    entranceAbsentUnderReducedMotionAndNoJavaScript: true,
    entrancePerceptualMinimum: {
      initialOpacityMaximum: 0.1,
      initialDisplacementCssPxMinimum: 24,
      opacityDurationMsMinimum: 700,
      transformDurationMsMinimum: 850,
    },
    entranceCadenceRequiredTerritories: ["v091-additions", "play", "align", "takeaway", "implementation-library"],
    navbarProminentSurfaceCssPx: { desktop: 76, mobile: 68 },
    navbarCalmSurfaceCssPx: { desktop: 76, mobile: 68 },
    navbarCalmSurfaceAlpha: NAV_CALM_SURFACE_ALPHA,
    navbarCalmHairlineAlpha: NAV_CALM_HAIRLINE_ALPHA,
    navbarCalmRowOpacity: NAV_CALM_OPACITY,
    navbarApprovedLogoSlotCssPx: { desktop: 54, mobile: 45 },
    navbarLogoCssArtScale: NAV_BRAND_ART_SCALE,
    navbarLogoPaintedFootprintMatchesArtScale: true,
    navbarVisibleControlBudgetIncludingBrand: { desktop: 5, mobile: 2 },
    navbarDesktopOwnerSelectedR7Routes: ["CityMETER", "CityWiki", "Sign in"],
    navbarMenuAndCloseHavePaintedInlineSvg: true,
    navbarPanelContainsAllCoreRoutesAndGroupedMobilePrimaryTask: true,
    navbarCalmKeepsDirectSemanticTargets: true,
    navbarCalmKeepsDirectTargetFullRectsAndCenters: true,
    navbarCalmRetainsFullWidthRightAlignedControlCluster: true,
    navbarReducedMotionRemainsProminent: true,
    navbarCtaYellowDuplicateSweepInsideInnerVisual: true,
    navbarCtaSweepIntentTriggers: ["hover", "focus-visible"],
    navbarCtaSweepDurationMs: NAV_CTA_INTENT_DURATION_MS,
    navbarCtaSweepEasing: NAV_CTA_INTENT_EASING,
    navbarCtaSweepIterationCount: 1,
    navbarCtaSweepAutoplay: false,
    navbarCtaSweepIntersectionObserver: false,
    navbarCtaSweepInfiniteOrFlicker: false,
    navbarCtaSweepReducedMotion: "hidden_static_final_state",
    navbarCtaSweepPreservesLayoutLabelAndDirectHit: true,
    pageBookmarkAnchorsInExactOrder: PAGE_BOOKMARK_ANCHORS,
    pageBookmarkMirroredInMobilePanel: true,
    pageBookmarkVisibleAbove600CssPxExceptShortViewport: true,
    pageBookmarkShortViewportFallbackMaxHeightCssPx: 560,
    pageBookmarkTargetsCssPx: MIN_TARGET_PX,
    pageBookmarkSingleCurrentLocation: true,
    colorAtlasPreviewRecords: ATLAS_PREVIEW_RECORDS.map(({ token, value }) => ({ token, value })),
    colorAtlasPreviewMatchesCompleteAtlasInExplicitThemes: ["light", "dark"],
    colorAtlasPreviewHasNoNarrowViewportOverflow: true,
    latestAliasFreshnessHandshakeIsOneTimeAndFailSafe: true,
    everySemanticComponentHasMotionPolicy: true,
    criticalAndEvidenceComponentsStayStatic: true,
    settleVisibleNeverWithholdsContent: true,
    disclosureAndFragmentTargetsReachFinalState: true,
    intersectionObserverFailureShowsFinalState: true,
  },
  boundary:
    "Rendered geometry, approved navbar logo-slot/art scale, calm transparency with stable direct-target rectangles, finite intent-only CTA sweep, inline-SVG paint, route presence, bookmark continuity, Color Atlas preview parity, an isolated latest-build freshness handshake, one representative slow transition, and motion-policy completion. It does not replace manual whole-journey perceptual review, assistive-technology review, native-Safari review, or transparent-surface contrast review.",
  totals: { cases: cases.length, failures: failures.length },
  cases,
  ...(failures.length ? { failures } : {}),
};

process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
