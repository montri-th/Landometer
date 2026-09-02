#!/usr/bin/env node
// [SELFCHECK-01] SC-21 + SC-23 ([BTN-GEOM-01]), SC-22 ([REVEAL-01]),
// SC-24 (selected Rebuild02 navbar profile + [NAV-01]), and SC-25 (complete
// component motion-policy coverage). All are rendered contracts: geometry, target
// ownership, state changes, and runtime policy assignment cannot be discharged by
// source review alone.
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
  cliValue("--registry") ?? "assets/data/color-delivery.v0.9.0.json",
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
    calmSurfacePx: 27,
    visibleHeaderControls: 2,
  },
  {
    name: "desktop",
    width: 1440,
    height: 1000,
    prominentSurfacePx: 76,
    calmSurfacePx: 29,
    visibleHeaderControls: 4,
  },
];
const NAV_GEOMETRY_TOLERANCE_PX = 1;
const NAV_CALM_OPACITY = 0.72;
const NAV_OPACITY_TOLERANCE = 0.03;

const failures = [];
const cases = [];
const requestedBrowserExecutable = process.env.LANDOMETER_BROWSER_EXECUTABLE || "";
const browser = await chromium.launch({
  headless: true,
  ...(requestedBrowserExecutable && existsSync(requestedBrowserExecutable)
    ? { executablePath: requestedBrowserExecutable }
    : {}),
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

// ---------- SC-24: selected Rebuild02 navbar anatomy with direct DS targets ----------
const measureNavbar = page => page.evaluate(() => {
  const header = document.querySelector(".site-header");
  const row = document.querySelector(".site-header__row");
  const surface = header ? getComputedStyle(header, "::before") : null;
  const visible = node => {
    if (!node || !node.getClientRects().length) return false;
    const style = getComputedStyle(node);
    return style.display !== "none" && style.visibility !== "hidden";
  };
  const targetNodes = [
    document.querySelector(".site-header .brand"),
    ...document.querySelectorAll(".site-header .header-link"),
    ...document.querySelectorAll(".site-header .header-cta"),
    document.querySelector(".site-header .nav-menu-toggle"),
  ].filter(visible);
  const targets = targetNodes.map(node => {
    const rect = node.getBoundingClientRect();
    const hit = document.elementFromPoint(
      Math.max(0, Math.min(innerWidth - 1, (rect.left + rect.right) / 2)),
      Math.max(0, Math.min(innerHeight - 1, (rect.top + rect.bottom) / 2)),
    );
    return {
      id: node.id || node.className || node.tagName,
      width: rect.width,
      height: rect.height,
      directHit: !!hit && (hit === node || node.contains(hit)),
      pointerEvents: getComputedStyle(node).pointerEvents,
    };
  });
  const visual = document.querySelector(".site-header .brand__symbol");
  const matrix = visual && getComputedStyle(visual).transform !== "none"
    ? new DOMMatrixReadOnly(getComputedStyle(visual).transform)
    : null;
  const headerRect = header?.getBoundingClientRect();
  const main = document.querySelector("main");
  return {
    state: header?.dataset.navState ?? null,
    isCalm: header?.classList.contains("is-calm") ?? false,
    headerHeight: headerRect?.height ?? 0,
    surfaceHeight: parseFloat(surface?.height ?? "0"),
    rowOpacity: Number(row ? getComputedStyle(row).opacity : 0),
    visualScale: matrix ? Math.hypot(matrix.a, matrix.b) : 1,
    visibleControls: targets.length,
    targets,
    mainDocumentTop: main ? main.getBoundingClientRect().top + scrollY : null,
    hasIdentityCarrier: !!document.querySelector(".site-header .logo-surface, .site-header .brand-plate"),
  };
});

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(700);

  const prominent = await measureNavbar(page);
  const navFailures = [];
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
  if (prominent.hasIdentityCarrier) navFailures.push("identity is enclosed by a carrier");
  prominent.targets.forEach(target => {
    if (target.width + 0.5 < MIN_TARGET_PX || target.height + 0.5 < MIN_TARGET_PX) {
      navFailures.push(`${target.id} target ${target.width.toFixed(1)}x${target.height.toFixed(1)}px`);
    }
    if (!target.directHit || target.pointerEvents === "none") {
      navFailures.push(`${target.id} is not the direct hit-tested target`);
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
  if (Math.abs(calm.visualScale - 0.5) > 0.03) {
    navFailures.push(`calm visual scale ${calm.visualScale.toFixed(2)}, expected 0.5`);
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
  });

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
    const menuOpen = await page.evaluate(() => {
      const panel = document.getElementById("nav-panel");
      const toggle = document.getElementById("nav-menu-toggle");
      return {
        state: document.querySelector(".site-header")?.dataset.navState,
        expanded: toggle?.getAttribute("aria-expanded"),
        hidden: panel?.hidden,
        focusInside: !!panel && panel.contains(document.activeElement),
      };
    });
    if (menuOpen.state !== "menu_open" || menuOpen.expanded !== "true" || menuOpen.hidden || !menuOpen.focusInside) {
      navFailures.push("opening the menu does not keep prominence and transfer focus");
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
    navFragment,
    upward,
    passed: navFailures.length === 0,
  });
  await context.close();
}

// ---------- SC-22: entrance never withholds content ----------
const revealProbe = async (options, probe) => {
  const { disableIntersectionObserver = false, ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, ...contextOptions });
  const page = await context.newPage();
  if (disableIntersectionObserver) {
    await page.addInitScript(() => {
      try { delete window.IntersectionObserver; } catch (_) {}
      try { delete Window.prototype.IntersectionObserver; } catch (_) {}
    });
  }
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  // rise profile: stagger cap 600ms + reveal 640ms; wait it out before measuring
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
      evidenceTotal: evidence.length,
      evidenceWrongPolicy: evidence.filter(node => node.dataset.motionPolicy !== "static.evidence").length,
      evidenceAnimated: evidence.filter(node => node.hasAttribute("data-riddim-reveal") || node.hasAttribute("data-motion-role")).length,
      revealWrongPolicy: all.filter(node => node.dataset.motionPolicy !== "reveal.supporting").length,
      settleTotal: settle.length,
      settleContentMoved: settle.filter(node => {
        const style = getComputedStyle(node);
        return Number(style.opacity) < 0.99 || style.transform !== "none";
      }).length,
      detailsWrongPolicy: [...document.querySelectorAll("details")]
        .filter(node => node.dataset.motionPolicy !== "state.disclosure").length,
    };
  });
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
  await page.waitForTimeout(160);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(900);
  const afterReturn = await page.evaluate(() => {
    const all = [...document.querySelectorAll("[data-riddim-reveal]")];
    return { landed: all.filter(n => n.hasAttribute("data-riddim-landed")).length, total: all.length,
      invisible: all.filter(n => Number(getComputedStyle(n).opacity) < 0.99).length };
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
  return { atRest, afterReturn, afterOpen };
});
if (normal.atRest.reachedInvisible > 0) failures.push(`SC-22 default: ${normal.atRest.reachedInvisible} reached group(s) left invisible`);
if (normal.atRest.insideClosedOrHidden > 0) failures.push(`SC-22 default: ${normal.atRest.insideClosedOrHidden} group(s) inside a closed disclosure or hidden panel carry the hidden state`);
if (normal.afterReturn.invisible > 0) failures.push(`SC-22 return-scroll: ${normal.afterReturn.invisible} group(s) re-hidden after scrolling away and back`);
if (normal.afterReturn.landed !== normal.afterReturn.total) failures.push("SC-22 return-scroll: a landed group did not stay landed");
if (normal.afterOpen.invisible > 0) failures.push(`SC-22 open-disclosure: ${normal.afterOpen.invisible} group(s) invisible after their section was opened`);
if (normal.atRest.coverage !== "complete" || normal.atRest.semanticMissingPolicy > 0 || normal.atRest.invalidPolicies > 0 || normal.atRest.missingFamilies > 0) {
  failures.push(`SC-25 coverage: runtime=${normal.atRest.coverage}, semantic missing=${normal.atRest.semanticMissingPolicy}, invalid=${normal.atRest.invalidPolicies}, family missing=${normal.atRest.missingFamilies}`);
}
if (normal.atRest.coverageComponents < normal.atRest.semanticTotal || normal.atRest.coverageFamilies < 9) {
  failures.push(`SC-25 coverage: ${normal.atRest.coverageComponents} audited components / ${normal.atRest.coverageFamilies} families is incomplete`);
}
if (normal.atRest.criticalWrongPolicy > 0 || normal.atRest.criticalAnimated > 0) {
  failures.push(`SC-25 critical: wrong policy=${normal.atRest.criticalWrongPolicy}, enrolled=${normal.atRest.criticalAnimated}`);
}
if (normal.atRest.evidenceWrongPolicy > 0 || normal.atRest.evidenceAnimated > 0) {
  failures.push(`SC-25 evidence: wrong policy=${normal.atRest.evidenceWrongPolicy}, enrolled=${normal.atRest.evidenceAnimated}`);
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
  }));
});
if (reduced.motionApproach) failures.push("SC-22 reduced-motion: the entrance layer was enabled");
if (reduced.marked > 0) failures.push(`SC-22 reduced-motion: ${reduced.marked} group(s) carry the hidden state`);
if (reduced.invisible > 0) failures.push(`SC-22 reduced-motion: ${reduced.invisible} group(s) invisible`);
if (reduced.motionCoverage !== "complete" || reduced.unlandedRoles > 0 || reduced.unsettled > 0) {
  failures.push(`SC-25 reduced-motion: coverage=${reduced.motionCoverage}, unlanded=${reduced.unlandedRoles}, unsettled=${reduced.unsettled}`);
}
if (reduced.calmHeader || reduced.navState !== "prominent") failures.push(`SC-24 reduced-motion: header state ${reduced.navState}`);

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

cases.push({ item: "SC-22", mode: "default", detail: normal, passed: !failures.some(f => f.startsWith("SC-22 default") || f.startsWith("SC-22 return") || f.startsWith("SC-22 open")) });
cases.push({ item: "SC-22", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-22 reduced")) });
cases.push({ item: "SC-22", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-22 no-JS")) });
cases.push({ item: "SC-24", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-24 reduced")) });
cases.push({ item: "SC-24", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-24 no-JS")) });
cases.push({ item: "SC-25", mode: "default", detail: normal, passed: !failures.some(f => f.startsWith("SC-25 coverage") || f.startsWith("SC-25 critical") || f.startsWith("SC-25 evidence") || f.startsWith("SC-25 policy") || f.startsWith("SC-25 disclosure") || f.startsWith("SC-25 completion")) });
cases.push({ item: "SC-25", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-25 reduced")) });
cases.push({ item: "SC-25", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-25 no-JS")) });
cases.push({ item: "SC-25", mode: "intersection-observer-unavailable", detail: ioFailure, passed: !failures.some(f => f.startsWith("SC-25 IO-failure")) });
cases.push({ item: "SC-25", mode: "fragment-focus", detail: fragment, passed: !failures.some(f => f.startsWith("SC-25 fragment")) });

await browser.close();

const evidence = {
  schemaVersion: "1.1",
  rules: ["[BTN-GEOM-01]", "[REVEAL-01]", "[NAV-01]", "[MOTION-COVERAGE-01]"],
  selfCheckItems: ["SC-21", "SC-22", "SC-23", "SC-24", "SC-25"],
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
    navbarProminentSurfaceCssPx: { desktop: 76, mobile: 68 },
    navbarCalmSurfaceCssPx: { desktop: 29, mobile: 27 },
    navbarVisibleControlBudgetIncludingBrand: { desktop: 4, mobile: 2 },
    navbarCalmKeepsDirectSemanticTargets: true,
    navbarReducedMotionRemainsProminent: true,
    everySemanticComponentHasMotionPolicy: true,
    criticalAndEvidenceComponentsStayStatic: true,
    settleVisibleNeverWithholdsContent: true,
    disclosureAndFragmentTargetsReachFinalState: true,
    intersectionObserverFailureShowsFinalState: true,
  },
  boundary:
    "Rendered geometry, navbar state, target ownership, and motion-policy completion only. It does not replace manual perceptual, assistive-technology, transparent-surface contrast, or rendered-glyph gates.",
  totals: { cases: cases.length, failures: failures.length },
  cases,
  ...(failures.length ? { failures } : {}),
};

process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
