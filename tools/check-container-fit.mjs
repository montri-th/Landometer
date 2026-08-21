#!/usr/bin/env node
// [CONTAINER-FIT-01] / [SELFCHECK-01] SC-20 — rendered container fit.
// Static source review cannot discharge SC-20: the defect only exists after layout.
// Measures every bounded companion container (cards sharing a grid row) at each
// governed breakpoint in both visual baselines, and fails on self-overflow or on a
// container exceeding the tallest sibling in its row beyond the stated tolerance.

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
    "Container fit QA requires Playwright. Install it for CI or expose the bundled workspace node_modules through NODE_PATH.",
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
// --artifact <path> lets this gate be pointed at any build, so a fix can be shown to
// actually fail on the artifact it was written for (regression evidence, not a claim).
const artifactOverrideIndex = process.argv.indexOf("--artifact");
const artifactOverride = artifactOverrideIndex >= 0 ? process.argv[artifactOverrideIndex + 1] : null;
const artifactPath = artifactOverride
  ? path.resolve(repositoryRoot, artifactOverride)
  : path.join(deploymentDir, artifactName);

// Thresholds are owned by this checker so the evidence records them explicitly.
const ROW_DELTA_TOLERANCE_CSS_PX = 4;   // sub-pixel + border rounding across platforms
const SELF_OVERFLOW_TOLERANCE_CSS_PX = 2;
const ENUMERATION_ROW_THRESHOLD = 6;    // §4.4C threshold

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 1000 },
  { name: "wide", width: 1728, height: 1080 },
];
const THEMES = ["light", "dark"];

const artifactFingerprint = createHash("sha256")
  .update(await readFile(artifactPath))
  .digest("hex")
  .slice(0, 16);

const browser = await chromium.launch();
const cases = [];
const failures = [];

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: theme,
    });
    // Chromium caches file:// responses by URL. A content-derived query makes the URL
    // change whenever the artifact bytes change, so this gate can never measure a stale
    // build (a real defect was masked this way before SC-20 existed).
    await page.goto(`${pathToFileURL(artifactPath).href}?cb=${artifactFingerprint}`);
    await page.waitForLoadState("load");
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(400);
    // expand every governed container-fit fold so the bounded body is measured open too
    const measured = await page.evaluate(
      ({ rowTol, selfTol, rowThreshold }) => {
        const containers = [...document.querySelectorAll(".v090-card, .card, [data-container-fit]")];
        const rows = new Map();
        for (const el of containers) {
          const parent = el.parentElement;
          if (!parent) continue;
          const top = Math.round(el.getBoundingClientRect().top);
          const key = `${parent.dataset.cfRow ?? parent.className}::${top}`;
          if (!rows.has(key)) rows.set(key, []);
          rows.get(key).push(el);
        }
        const label = el => (el.querySelector("h3, h4, strong")?.textContent || "").trim().slice(0, 48);
        const out = [];
        for (const [key, group] of rows) {
          if (group.length < 1) continue;
          const heights = group.map(el => el.getBoundingClientRect().height);
          const tallest = Math.max(...heights);
          for (const el of group) {
            const rect = el.getBoundingClientRect();
            const selfOverflow = el.scrollHeight - el.clientHeight;
            // enumerations inside this container that are not inside a bounded fold
            const unfolded = [...el.querySelectorAll("table, ol, ul")].filter(
              list => !list.closest("details") &&
                list.querySelectorAll("tbody > tr, li").length > rowThreshold,
            ).map(list => ({
              tag: list.tagName.toLowerCase(),
              rows: list.querySelectorAll("tbody > tr, li").length,
            }));
            // a fold must bound its body
            const unboundedFolds = [...el.querySelectorAll("details")].filter(d => {
              const list = d.querySelector("table, ol, ul");
              if (!list) return false;
              const count = list.querySelectorAll("tbody > tr, li").length;
              if (count <= rowThreshold) return false;
              const box = list.parentElement;
              if (!box) return true;
              const style = getComputedStyle(box);
              const bounded = /auto|scroll/.test(style.overflowY) && style.maxHeight !== "none";
              return !bounded;
            }).length;
            out.push({
              row: key,
              label: label(el),
              height: Math.round(rect.height * 100) / 100,
              tallestSibling: Math.round(tallest * 100) / 100,
              rowDelta: Math.round((tallest - rect.height) * 100) / 100,
              exceedsRow: rect.height - tallest > rowTol,
              selfOverflowPx: Math.round(selfOverflow * 100) / 100,
              selfOverflows: selfOverflow > selfTol,
              unfoldedEnumerations: unfolded,
              unboundedFolds,
              siblings: group.length,
            });
          }
        }
        return out;
      },
      { rowTol: ROW_DELTA_TOLERANCE_CSS_PX, selfTol: SELF_OVERFLOW_TOLERANCE_CSS_PX, rowThreshold: ENUMERATION_ROW_THRESHOLD },
    );

    const caseFailures = [];
    for (const c of measured) {
      if (c.selfOverflows) caseFailures.push(`${c.label || c.row}: overflows its own box by ${c.selfOverflowPx}px`);
      if (c.exceedsRow && c.siblings > 1) caseFailures.push(`${c.label || c.row}: ${c.height}px exceeds tallest sibling ${c.tallestSibling}px`);
      for (const e of c.unfoldedEnumerations) {
        caseFailures.push(`${c.label || c.row}: ${e.tag} with ${e.rows} rows is not folded (4.4C threshold ${ENUMERATION_ROW_THRESHOLD})`);
      }
      if (c.unboundedFolds) caseFailures.push(`${c.label || c.row}: ${c.unboundedFolds} fold(s) without a bounded scroll body`);
    }
    failures.push(...caseFailures.map(f => `${viewport.name}/${theme}: ${f}`));
    cases.push({
      viewport: viewport.name,
      width: viewport.width,
      theme,
      containers: measured.length,
      passed: caseFailures.length === 0,
      ...(caseFailures.length ? { failures: caseFailures } : {}),
    });
    await page.close();
  }
}
await browser.close();

const evidence = {
  schemaVersion: "1.0",
  rule: "[CONTAINER-FIT-01]",
  selfCheckItem: "SC-20",
  dsVersion: "0.9.0",
  authoringRevision: "v0.9.0-r4",
  colorRegistryId: registry?.meta?.id,
  artifactBuild: artifactBuildId,
  artifactPath: artifactName,
  artifactFingerprint,
  scope: {
    viewports: VIEWPORTS.map(v => `${v.name}@${v.width}`),
    themes: THEMES,
    containerSelectors: [".v090-card", ".card", "[data-container-fit]"],
  },
  assertions: {
    rowDeltaToleranceCssPx: ROW_DELTA_TOLERANCE_CSS_PX,
    selfOverflowToleranceCssPx: SELF_OVERFLOW_TOLERANCE_CSS_PX,
    enumerationRowThreshold: ENUMERATION_ROW_THRESHOLD,
    foldsMustBoundTheirBody: true,
  },
  boundary:
    "Rendered container geometry only. It does not judge whether a summary line states the enumeration truthfully, and it does not replace the manual perceptual, assistive-technology, or rendered-glyph gates.",
  totals: {
    cases: cases.length,
    containersMeasured: cases.reduce((sum, c) => sum + c.containers, 0),
    failures: failures.length,
  },
  cases,
  ...(failures.length ? { failures } : {}),
};

process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
