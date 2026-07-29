#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const file = process.argv[2];
if (!file) {
  console.error("Usage: check-experience-contracts.mjs <html-file>");
  process.exit(2);
}

const html = await readFile(file, "utf8");
const checks = [
  ["before/after data", /\bbefore:\s*\{/u.test(html) && /\bafter:\s*\{/u.test(html)],
  ["visual surface owns metadata colors", /\.proof-preview\.is-visual\s+\.proof-meta/u.test(html)],
  ["visual surface owns object color", /\.proof-preview\.is-visual\s+\.proof-object/u.test(html)],
  ["Thai technical labels have a packaged face", /--font-data-label:[^;]*"Bai Jamjuree"/u.test(html)],
  ["semantic recipe uses structured ordered list", /class="recipe-steps"/u.test(html)],
  ["no tab-indented numbered recipe item", !/\n\t+\d+\.\s/u.test(html)],
  ["six color teaching plates", (html.match(/class="color-plate(?:\s|")/gu) || []).length >= 6],
  ["no runtime color mixing", !/color-mix\(/u.test(html)],
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
