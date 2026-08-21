#!/usr/bin/env node
// [SELFCHECK-01] SC-21 ([BTN-GEOM-01]) and SC-22 ([REVEAL-01]).
// Both are rendered contracts: the geometry and the entrance only exist after layout and
// after scripting runs, so source review cannot discharge either item.

import { createHash } from "node:crypto";
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
const registry = JSON.parse(
  await readFile(path.join(deploymentDir, "assets/data/color-delivery.v0.9.0.json"), "utf8"),
);
const artifactBuildId = registry?.meta?.currentArtifactBuild?.id;
const artifactName = registry?.meta?.currentArtifactBuild?.immutableStandalone;
if (!artifactBuildId || !artifactName) {
  throw new Error("color-delivery registry does not declare the current artifact build");
}
const artifactPath = path.join(deploymentDir, artifactName);
// Chromium caches file:// by URL; keying the URL to the bytes makes a stale read impossible.
const artifactFingerprint = createHash("sha256")
  .update(await readFile(artifactPath))
  .digest("hex")
  .slice(0, 16);
const artifactUrl = `${pathToFileURL(artifactPath).href}?cb=${artifactFingerprint}`;

// [BTN-GEOM-01]: --space-5 is the normative minimum inline padding for a capsule.
const MIN_CAPSULE_INLINE_PADDING_PX = 24;
const MIN_TARGET_PX = 44;
const PADDING_TOLERANCE_PX = 0.5;
const CENTRING_TOLERANCE_PX = 2;
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];

const failures = [];
const cases = [];
const browser = await chromium.launch();

// ---------- SC-21: rendered capsule action geometry ----------
for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(400);
  const measured = await page.evaluate(
    ({ minPad, minTarget, padTol, centreTol }) => {
      const results = [];
      const nodes = [...document.querySelectorAll("a, button, .button, [role='button']")];
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const style = getComputedStyle(node);
        const radius = parseFloat(style.borderTopLeftRadius) || 0;
        const isCapsule = radius >= rect.height / 2 - 1 && rect.width > rect.height + 4;
        if (!isCapsule) continue; // circles and other geometries are out of SC-21 scope
        const label = (node.textContent || "").trim();
        if (!label) continue; // icon-only actions are the circle rule, not this one
        const padLeft = parseFloat(style.paddingLeft) || 0;
        const padRight = parseFloat(style.paddingRight) || 0;
        const problems = [];
        if (padLeft + padTol < minPad || padRight + padTol < minPad) {
          problems.push(`inline padding ${padLeft}/${padRight}px below the ${minPad}px minimum`);
        }
        if (rect.height + 0.5 < minTarget) problems.push(`target height ${Math.round(rect.height)}px below ${minTarget}px`);
        const flexish = /flex|grid|inline-flex|inline-grid/.test(style.display);
        if (flexish) {
          if (!/center/.test(style.alignItems)) problems.push(`alignItems ${style.alignItems} does not centre the label`);
          if (!/center/.test(style.justifyContent) && style.textAlign !== "center") {
            problems.push(`justifyContent ${style.justifyContent} does not centre the label`);
          }
        } else if (style.textAlign !== "center" && style.display !== "inline") {
          problems.push(`display ${style.display} with textAlign ${style.textAlign} does not centre the label`);
        }
        if (node.scrollWidth - node.clientWidth > 1) problems.push("label overruns its own shape");
        results.push({ label: label.slice(0, 40), problems });
      }
      return results;
    },
    { minPad: MIN_CAPSULE_INLINE_PADDING_PX, minTarget: MIN_TARGET_PX, padTol: PADDING_TOLERANCE_PX, centreTol: CENTRING_TOLERANCE_PX },
  );
  const bad = measured.filter(entry => entry.problems.length);
  bad.forEach(entry => entry.problems.forEach(p => failures.push(`SC-21 ${viewport.name}: "${entry.label}" ${p}`)));
  cases.push({ item: "SC-21", viewport: viewport.name, capsulesMeasured: measured.length, passed: bad.length === 0 });
  await page.close();
}

// ---------- SC-22: entrance never withholds content ----------
const revealProbe = async (options, probe) => {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(artifactUrl);
  await page.waitForLoadState("load");
  await page.waitForTimeout(1600);
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
    return {
      marked: all.length,
      reachedInvisible: reached.filter(n => Number(getComputedStyle(n).opacity) < 0.99).length,
      insideClosedOrHidden: all.filter(n => n.closest("details:not([open])") || n.closest("[hidden]")).length,
    };
  });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
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
    return { invisible: all.filter(n => Number(getComputedStyle(n).opacity) < 0.99).length, total: all.length };
  });
  return { atRest, afterReturn, afterOpen };
});
if (normal.atRest.reachedInvisible > 0) failures.push(`SC-22 default: ${normal.atRest.reachedInvisible} reached group(s) left invisible`);
if (normal.atRest.insideClosedOrHidden > 0) failures.push(`SC-22 default: ${normal.atRest.insideClosedOrHidden} group(s) inside a closed disclosure or hidden panel carry the hidden state`);
if (normal.afterReturn.invisible > 0) failures.push(`SC-22 return-scroll: ${normal.afterReturn.invisible} group(s) re-hidden after scrolling away and back`);
if (normal.afterReturn.landed !== normal.afterReturn.total) failures.push("SC-22 return-scroll: a landed group did not stay landed");
if (normal.afterOpen.invisible > 0) failures.push(`SC-22 open-disclosure: ${normal.afterOpen.invisible} group(s) invisible after their section was opened`);

// 2. reduced motion and 3. no JavaScript: the hidden state must never be applied
const reduced = await revealProbe({ reducedMotion: "reduce" }, page => page.evaluate(() => ({
  revealAttr: document.documentElement.getAttribute("data-reveal"),
  marked: document.querySelectorAll("[data-riddim-reveal]").length,
  invisible: [...document.querySelectorAll(".v090-card, .value-contrast-card")]
    .filter(n => Number(getComputedStyle(n).opacity) < 0.99).length,
})));
if (reduced.revealAttr) failures.push("SC-22 reduced-motion: the entrance layer was enabled");
if (reduced.marked > 0) failures.push(`SC-22 reduced-motion: ${reduced.marked} group(s) carry the hidden state`);
if (reduced.invisible > 0) failures.push(`SC-22 reduced-motion: ${reduced.invisible} group(s) invisible`);

const noJs = await revealProbe({ javaScriptEnabled: false }, page => page.evaluate(() => ({
  revealAttr: document.documentElement.getAttribute("data-reveal"),
  marked: document.querySelectorAll("[data-riddim-reveal]").length,
  cards: document.querySelectorAll(".v090-card").length,
  visibleCards: [...document.querySelectorAll(".v090-card")]
    .filter(n => Number(getComputedStyle(n).opacity) > 0.99).length,
})));
if (noJs.revealAttr) failures.push("SC-22 no-JS: the entrance layer was enabled");
if (noJs.marked > 0) failures.push(`SC-22 no-JS: ${noJs.marked} group(s) carry the hidden state`);
if (noJs.cards && noJs.visibleCards !== noJs.cards) failures.push(`SC-22 no-JS: ${noJs.cards - noJs.visibleCards} card(s) not fully visible`);

cases.push({ item: "SC-22", mode: "default", detail: normal, passed: !failures.some(f => f.startsWith("SC-22 default") || f.startsWith("SC-22 return") || f.startsWith("SC-22 open")) });
cases.push({ item: "SC-22", mode: "reduced-motion", detail: reduced, passed: !failures.some(f => f.startsWith("SC-22 reduced")) });
cases.push({ item: "SC-22", mode: "no-javascript", detail: noJs, passed: !failures.some(f => f.startsWith("SC-22 no-JS")) });

await browser.close();

const evidence = {
  schemaVersion: "1.0",
  rules: ["[BTN-GEOM-01]", "[REVEAL-01]"],
  selfCheckItems: ["SC-21", "SC-22"],
  dsVersion: "0.9.0",
  authoringRevision: "v0.9.0-r4",
  colorRegistryId: registry?.meta?.id,
  artifactBuild: artifactBuildId,
  artifactPath: artifactName,
  artifactFingerprint,
  assertions: {
    minCapsuleInlinePaddingCssPx: MIN_CAPSULE_INLINE_PADDING_PX,
    minTargetCssPx: MIN_TARGET_PX,
    entranceNeverWithholdsReachedContent: true,
    entranceAbsentInsideClosedDisclosureOrHiddenPanel: true,
    entranceLandsOnce: true,
    entranceAbsentUnderReducedMotionAndNoJavaScript: true,
  },
  boundary:
    "Rendered geometry and entrance behaviour only. It does not judge whether an entrance is worth having, and it does not replace the manual perceptual, assistive-technology, or rendered-glyph gates.",
  totals: { cases: cases.length, failures: failures.length },
  cases,
  ...(failures.length ? { failures } : {}),
};

process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
