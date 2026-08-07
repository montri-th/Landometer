#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  throw new Error(
    "Scale geometry QA requires Playwright. Install it for CI or expose the bundled workspace node_modules through NODE_PATH.",
  );
}

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(toolDir, "..");
const deploymentDir = path.join(repositoryRoot, "deployment");
const registry = JSON.parse(
  await readFile(
    path.join(deploymentDir, "assets/data/color-delivery.v0.8.9.json"),
    "utf8",
  ),
);
const artifactBuildId = registry?.meta?.currentArtifactBuild?.id;
const artifactPath =
  registry?.meta?.currentArtifactBuild?.immutableStandalone;
if (!artifactBuildId || !artifactPath) {
  throw new Error("Current immutable UI artifact-build identity is missing.");
}

const artifactBytes = await readFile(path.join(deploymentDir, artifactPath));
const artifactSha256 = createHash("sha256")
  .update(artifactBytes)
  .digest("hex");
const artifactUrl = pathToFileURL(
  path.join(deploymentDir, artifactPath),
);

const widths = [320, 360, 390, 620, 621, 980, 981];
const locales = ["th", "en"];
const themes = ["light", "dark"];
const baseCases = widths.flatMap((width) =>
  locales.flatMap((locale) =>
    themes.map((theme) => ({ width, locale, theme, textScale: 1 })),
  ),
);
const zoomCases = [320, 390].flatMap((width) =>
  locales.flatMap((locale) =>
    themes.map((theme) => ({ width, locale, theme, textScale: 2 })),
  ),
);
const cases = [...baseCases, ...zoomCases];
const requestedBrowserExecutable =
  process.env.LANDOMETER_BROWSER_EXECUTABLE ||
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "");
const browser = await chromium.launch({
  headless: true,
  ...(requestedBrowserExecutable && existsSync(requestedBrowserExecutable)
    ? { executablePath: requestedBrowserExecutable }
    : {}),
});
const page = await browser.newPage();
const results = [];

try {
  for (const testCase of cases) {
    await page.setViewportSize({ width: testCase.width, height: 900 });
    const url = new URL(artifactUrl);
    url.searchParams.set("lang", testCase.locale);
    url.searchParams.set("theme", testCase.theme);
    url.hash = "color-data-scales";
    await page.goto(url.href, { waitUntil: "load" });
    await page.evaluate(async ({ textScale }) => {
      document.querySelectorAll("details").forEach((details) => {
        details.open = true;
      });
      if (textScale !== 1) {
        document.documentElement.style.fontSize = `${textScale * 100}%`;
      }
      if (document.fonts) await document.fonts.ready;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    }, testCase);

    const result = await page.evaluate(({ locale, theme, textScale }) => {
      const selectors = [
        [".scale-family-class-row", ".scale-family-class-cells", "sampler"],
        [".atlas-class-row", ".atlas-class-cells", "atlas"],
      ];
      const failures = [];
      const metrics = [];
      const tolerance = 0.6;

      for (const [rowSelector, stripSelector, scope] of selectors) {
        document.querySelectorAll(rowSelector).forEach((row, rowIndex) => {
          const caption = row.querySelector("figcaption");
          const strip = row.querySelector(stripSelector);
          if (!caption || !strip) {
            failures.push(`${scope}[${rowIndex}] missing caption or strip`);
            return;
          }

          const range = document.createRange();
          range.selectNodeContents(caption);
          const textRect = range.getBoundingClientRect();
          const stripRect = strip.getBoundingClientRect();
          const rowRect = row.getBoundingClientRect();
          const sameLine =
            stripRect.top < textRect.bottom - tolerance &&
            textRect.top < stripRect.bottom - tolerance;
          const inlineGap = sameLine ? stripRect.left - textRect.right : null;
          const blockGap = sameLine ? null : stripRect.top - textRect.bottom;
          const rootFontSize = Number.parseFloat(
            getComputedStyle(document.documentElement).fontSize,
          );
          const expectedMinimumStrip = Math.min(
            rootFontSize * 8,
            rowRect.width,
          );
          const cells = [...strip.children].map((cell) =>
            cell.getBoundingClientRect(),
          );
          const cellWidths = cells.map((cell) => cell.width);
          const maxCellDelta = cellWidths.length
            ? Math.max(...cellWidths) - Math.min(...cellWidths)
            : Number.POSITIVE_INFINITY;
          const overlap =
            textRect.left < stripRect.right - tolerance &&
            textRect.right > stripRect.left + tolerance &&
            textRect.top < stripRect.bottom - tolerance &&
            textRect.bottom > stripRect.top + tolerance;

          if (sameLine && inlineGap < 7.5) {
            failures.push(
              `${scope}[${rowIndex}] inline gap ${inlineGap.toFixed(2)}px`,
            );
          }
          if (!sameLine && blockGap < 7.5) {
            failures.push(
              `${scope}[${rowIndex}] block gap ${blockGap.toFixed(2)}px`,
            );
          }
          if (overlap) failures.push(`${scope}[${rowIndex}] text overlaps strip`);
          if (stripRect.width + tolerance < expectedMinimumStrip) {
            failures.push(
              `${scope}[${rowIndex}] strip ${stripRect.width.toFixed(2)}px below ${expectedMinimumStrip.toFixed(2)}px`,
            );
          }
          if (maxCellDelta > 1) {
            failures.push(
              `${scope}[${rowIndex}] unequal cells delta ${maxCellDelta.toFixed(2)}px`,
            );
          }
          if (caption.scrollWidth > caption.clientWidth + 1) {
            failures.push(`${scope}[${rowIndex}] caption clips`);
          }

          const label = strip.getAttribute("aria-label") || "";
          if (scope === "sampler") {
            const expected = strip.getAttribute(
              `data-scale-aria-${locale}-${theme}`,
            );
            if (!expected || label !== expected) {
              failures.push(
                `${scope}[${rowIndex}] accessible name does not match ${locale}/${theme}`,
              );
            }
          } else {
            const expected = strip.getAttribute(`data-l10n-aria-${locale}`);
            if (!expected || label !== expected) {
              failures.push(
                `${scope}[${rowIndex}] accessible name does not match ${locale}`,
              );
            }
          }

          metrics.push({
            scope,
            sameLine,
            inlineGap,
            blockGap,
            stripWidth: stripRect.width,
            expectedMinimumStrip,
            maxCellDelta,
          });
        });
      }

      for (const container of document.querySelectorAll(
        ".scale-sampler, .atlas-scale-record",
      )) {
        if (container.scrollWidth > container.clientWidth + 1) {
          const containerRect = container.getBoundingClientRect();
          const offender = [...container.querySelectorAll("*")].find((node) => {
            const rect = node.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.right > containerRect.right + 1 ||
                rect.left < containerRect.left - 1)
            );
          });
          failures.push(
            `${container.classList.contains("scale-sampler") ? "sampler" : `atlas ${container.dataset.atlasScale}/${container.dataset.atlasTheme}`} horizontal overflow ${container.scrollWidth}/${container.clientWidth}${offender ? ` at ${offender.tagName.toLowerCase()}.${offender.className || "(no-class)"} ${offender.scrollWidth}/${offender.clientWidth} “${(offender.textContent || "").trim().slice(0, 60)}”` : ""}`,
          );
          break;
        }
      }

      const protectedBrandLine = "Let us cultivate our city with data.";
      const protectedBrandLineRows = [
        "Let us",
        "cultivate",
        "our city",
        "with data.",
      ];
      const heroTitle = document.querySelector("#hero-title");
      const heroCopy = document.querySelector(".hero-copy");
      const heroLines = heroTitle
        ? [...heroTitle.querySelectorAll(".hero-line")]
        : [];
      const normalizedHeroText = (heroTitle?.innerText || "")
        .trim()
        .split(/\s+/u)
        .join(" ");
      const heroCopyRect = heroCopy?.getBoundingClientRect();
      const heroLineOverflows = heroLines.map((line) => {
        const rect = line.getBoundingClientRect();
        if (!heroCopyRect) return Number.POSITIVE_INFINITY;
        return Math.max(
          0,
          heroCopyRect.left - rect.left,
          rect.right - heroCopyRect.right,
        );
      });
      const heroMaxOverflow = heroLineOverflows.length
        ? Math.max(...heroLineOverflows)
        : Number.POSITIVE_INFINITY;

      if (normalizedHeroText !== protectedBrandLine) {
        failures.push("protected brand line text is not exact");
      }
      if (heroTitle?.getAttribute("aria-label") !== protectedBrandLine) {
        failures.push("protected brand line accessible name is not exact");
      }
      if (
        heroLines.length !== protectedBrandLineRows.length ||
        heroLines.some(
          (line, index) =>
            (line.textContent || "").trim() !== protectedBrandLineRows[index],
        )
      ) {
        failures.push("protected brand line does not preserve its four rows");
      }
      if (!heroCopyRect || heroMaxOverflow > 1) {
        failures.push(
          `protected brand line clips by ${Number.isFinite(heroMaxOverflow) ? heroMaxOverflow.toFixed(2) : "unknown"}px`,
        );
      }

      const fontReadiness = {
        fontsReady: document.documentElement.dataset.fontsReady || "missing",
        thaiBodyReady:
          document.documentElement.dataset.thaiBodyReady || "missing",
        thaiTechnicalReady:
          document.documentElement.dataset.thaiTechnicalReady || "missing",
        thaiDisplayReady:
          document.documentElement.dataset.thaiDisplayReady || "missing",
        latinCompanionsReady:
          document.documentElement.dataset.latinCompanionsReady || "missing",
        delivery:
          document.documentElement.dataset.fontDelivery || "missing",
      };
      if (
        fontReadiness.fontsReady !== "true" ||
        fontReadiness.thaiBodyReady !== "true" ||
        fontReadiness.thaiTechnicalReady !== "true" ||
        fontReadiness.thaiDisplayReady !== "true" ||
        fontReadiness.latinCompanionsReady !== "true" ||
        fontReadiness.delivery !== "ready"
      ) {
        failures.push(
          `embedded Thai font readiness is ${JSON.stringify(fontReadiness)}`,
        );
      }

      return {
        locale,
        theme,
        textScale,
        rowCount: metrics.length,
        inlineRows: metrics.filter((metric) => metric.sameLine).length,
        wrappedRows: metrics.filter((metric) => !metric.sameLine).length,
        minInlineGap: Math.min(
          ...metrics
            .filter((metric) => metric.inlineGap !== null)
            .map((metric) => metric.inlineGap),
          Number.POSITIVE_INFINITY,
        ),
        minBlockGap: Math.min(
          ...metrics
            .filter((metric) => metric.blockGap !== null)
            .map((metric) => metric.blockGap),
          Number.POSITIVE_INFINITY,
        ),
        minStripWidth: Math.min(
          ...metrics.map((metric) => metric.stripWidth),
        ),
        maxCellDelta: Math.max(
          ...metrics.map((metric) => metric.maxCellDelta),
        ),
        protectedBrandLine: normalizedHeroText,
        protectedBrandLineRows: heroLines.map((line) =>
          (line.textContent || "").trim(),
        ),
        protectedBrandLineMaxOverflow: heroMaxOverflow,
        fontReadiness,
        failures,
      };
    }, testCase);

    results.push({ width: testCase.width, ...result });
  }
} finally {
  await browser.close();
}

const failures = results.flatMap((result) =>
  result.failures.map((failure) => ({
    width: result.width,
    locale: result.locale,
    theme: result.theme,
    textScale: result.textScale,
    failure,
  })),
);
const evidence = {
  schemaVersion: 1,
  artifactBuildId,
  artifactPath,
  artifactSha256,
  matrix: {
    widths,
    locales,
    themes,
    baseCases: baseCases.length,
    textScale200Cases: zoomCases.length,
    totalCases: cases.length,
  },
  assertions: {
    minimumGapCssPx: 7.5,
    minimumStripRem: 8,
    maximumEqualCellDeltaCssPx: 1,
    localeAndResolvedThemeAccessibleNames: true,
    protectedCulturalActivationExactAndUnclipped: true,
    embeddedNineFaceFontReadiness: true,
  },
  totals: {
    cases: results.length,
    rows: results.reduce((sum, result) => sum + result.rowCount, 0),
    failures: failures.length,
  },
  cases: results.map(({ failures: caseFailures, ...result }) => ({
    ...result,
    passed: caseFailures.length === 0,
    ...(caseFailures.length ? { failures: caseFailures } : {}),
  })),
};

const writeEvidenceIndex = process.argv.indexOf("--write-evidence");
if (writeEvidenceIndex >= 0) {
  const requestedPath = process.argv[writeEvidenceIndex + 1];
  if (!requestedPath) {
    throw new Error("--write-evidence requires an output path.");
  }
  await writeFile(
    path.resolve(repositoryRoot, requestedPath),
    `${JSON.stringify(evidence, null, 2)}\n`,
    "utf8",
  );
}

process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
