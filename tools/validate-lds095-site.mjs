#!/usr/bin/env node
import {readFileSync, statSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root = resolve(import.meta.dirname, '..'), site = join(root, 'deployment/v0.9.5');
const read = p => readFileSync(join(site, p), 'utf8');
const manifest = JSON.parse(read('site-manifest.json')), html = read('index.html');
const atlas = read('color-atlas.html');
let checks = 0;
const failures = [];
const check = (value, label) => { checks++; if (!value) failures.push(label); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
check(manifest.designSystemVersion === '0.9.5' && manifest.colorSetId === 'color-srgb-08', 'release identity');
check(manifest.packageId === 'v0.9.5-owner.1', 'unchanged approved package identity');
check(manifest.artifactBuildId === 'ui-20260930-lds095-r3-docs1', 'full-guide website build identity');
check(manifest.cryptographicSignature === 'not-claimed', 'truthful signature boundary');
check(manifest.artifactConformance === 'bounded-checks-only', 'bounded conformance claim');
const manifestPaths = manifest.assets.map(asset => asset.path);
check(new Set(manifestPaths).size === manifestPaths.length, 'manifest paths are unique');
for (const required of ['index.html', 'llms.txt', 'v0.9.5/index.html', 'v0.9.5/color-atlas.html', 'v0.9.5/project-source-0.9.5.md', 'v0.9.5/data.js', 'v0.9.5/scoped-atlas.css', 'v0.9.5/embedded-atlas.js', 'v0.9.5/full-guide.js', 'v0.9.5/guide-token-aliases.css']) {
  check(manifestPaths.includes(required), `manifest covers ${required}`);
}
for (const asset of manifest.assets) {
  const path = join(root, 'deployment', asset.path);
  check(!asset.path.startsWith('/') && !asset.path.split('/').includes('..'), `manifest path is local: ${asset.path}`);
  try {
    check(statSync(path).size === asset.bytes && hash(readFileSync(path)) === asset.sha256, `asset parity ${asset.path}`);
  } catch (error) { check(false, `missing asset ${asset.path}: ${error.message}`); }
}
for (const [label, source] of [['full guide', html], ['approved color atlas', atlas]]) {
  check(source.includes('data-ds-version="0.9.5"') && source.includes('data-color-registry="color-srgb-08"'), `${label}: visible release metadata`);
  check(!source.includes('127.0.0.1'), `${label}: no local canonical URLs`);
}
for (const id of ['start', 'categories', 'library', 'scale-lab', 'atmospheres']) {
  check(atlas.includes(`id="${id}"`), `atlas retains static content ${id}`);
}
check(html.includes('id="lds095-color-atlas"') && html.includes('class="lds095-color-atlas"'), 'full guide integrates current approved color atlas inline');
check(html.includes('id="resource-project-sources"') && html.includes('href="project-source-0.9.5.md"'), 'current Project Source download is visible');
const projectSources = read('project-source-0.9.5.md');
check(read('package/docs/activation-th.md').includes('LDS หนึ่งไฟล์ · งานผลิตภัณฑ์ใช้สองไฟล์คู่กัน') && !read('package/docs/activation-th.md').includes('ไฟล์เดียวต่อโปรเจกต์'), 'activation heading distinguishes base-only and product installations');
const documentSet = JSON.parse(read('normative/document-set.json'));
check(same(documentSet.documents.map(doc => doc.product), ['landometer', 'ijji', 'citychat', 'citywiki']), 'shared LDS base and three separate product Add-ons');
check(/(?:2|สอง)\s*ไฟล์/.test(projectSources) && /Add-on/.test(projectSources) && /(?:1|หนึ่ง)\s*ไฟล์/.test(projectSources), 'Project Source setup distinguishes one LDS file from LDS plus product Add-on');
check(!/ฉบับ ijji, CityChat และ CityWiki รวม LDS ครบแล้ว|four one-file editions|ไม่ต้องเพิ่ม LDS อีกไฟล์|เลือกและอัปโหลดเพียงหนึ่งไฟล์/.test(projectSources), 'Project Source setup does not claim product Add-ons contain the base');
check(!/ijji-LDS-v0\.9\.5-standalone|CityChat-LDS-v0\.9\.5-standalone|CityWiki-LDS-v0\.9\.5-standalone/.test(projectSources+html+manifestPaths.join(' ')), 'current resource links do not serve retired combined product editions');
const baseDocument = documentSet.documents.find(doc => doc.product === 'landometer');
const baseFile = baseDocument.files.find(file => file.path.endsWith('.md'));
check(baseDocument.kind === 'base' && baseFile.path === 'Landometer-Design-System-v0.9.5.md' && /^[a-f0-9]{64}$/.test(baseFile.sha256) && hash(readFileSync(join(site, 'normative', baseFile.path))) === baseFile.sha256 && documentSet.revision === 'standalone-0.9.5-r3', 'current r3 base download matches declared exact bytes');
check(!/Landometer%20Design%20System%20v0\.9\.4\.md|\]\([^)]*GUIDE\.md\)|\]\([^)]*BRAND\.md\)/.test(projectSources), 'Project Source setup has no legacy multi-file normative dependencies');
for (const doc of documentSet.documents) {
  check(doc.kind === (doc.product === 'landometer' ? 'base' : 'addon'), `${doc.product}: base/Add-on classification`);
  if (doc.product !== 'landometer') {
    const projection = JSON.parse(read(`normative/${doc.files.find(file => file.path.endsWith('.json')).path}`));
    check(projection.document.documentKind === 'addon' && projection.document.requiredNormativeFiles === 2 && projection.machine.baseDocument.path === baseFile.path && projection.machine.baseDocument.sha256 === baseFile.sha256, `${doc.product}: separate Add-on binds exact shared base`);
  }
  check(doc.files.length === 2 && doc.files.some(file => file.path.endsWith('.md')) && doc.files.some(file => file.path.endsWith('.json')), `${doc.product}: human and machine alternatives`);
  for (const file of doc.files) {
    const bytes = readFileSync(join(site, 'normative', file.path));
    check(bytes.length === file.bytes && hash(bytes) === file.sha256, `${doc.product}: standalone download parity ${file.path}`);
    check(projectSources.includes(`./normative/${file.path}`), `${doc.product}: setup links exact ${file.path}`);
    check(manifestPaths.includes(`v0.9.5/normative/${file.path}`) && manifestPaths.includes(`v0.9.5/package/assets/lds-0.9.5/normative/${file.path}`), `${doc.product}: live manifest covers both distributed paths ${file.path}`);
    const packaged = readFileSync(join(site, 'package/assets/lds-0.9.5/normative', file.path));
    check(bytes.equals(packaged), `${doc.product}: direct and packaged download bytes match ${file.path}`);
    if (file.path.endsWith('.md')) check(html.includes(`href="normative/${file.path}"`), `${doc.product}: visible direct normative download`);
  }
}
check(manifestPaths.includes('v0.9.5/normative/document-set.json'), 'live manifest covers normative document inventory');
const context = {window: {}};
vm.runInNewContext(read('data.js'), context, {timeout: 5000});
const D = context.window.LDS_CANDIDATE;
const colors = JSON.parse(read('package/assets/lds-0.9.5/machine/color-registry.json'));
check(D.designSystemVersion === '0.9.5' && D.colorSetId === 'color-srgb-08', 'runtime release identity');
check(D.scales.length === 20 && new Set(D.scales.map(scale => scale.id)).size === 20, 'twenty unique analytical families');
check(same(D.scales.map(scale => scale.id).sort(), colors.scales.map(scale => scale.id).sort()), 'runtime analytical family inventory');
for (const scale of D.scales) {
  const target = colors.scales.find(candidate => candidate.id === scale.id);
  check(Boolean(target), `known analytical family ${scale.id}`);
  if (!target) continue;
  for (const field of ['kind', 'unit', 'meaning', 'warm']) {
    check(same(scale[field], target[field]), `runtime metric semantics ${scale.id}/${field}`);
  }
  for (const theme of ['light', 'dark']) {
    const actualTheme = scale.themes[theme], expectedTheme = target.themes[theme];
    check(actualTheme.lut.length === 41 && same(actualTheme.lut, expectedTheme.lut), `runtime exact 41-stop LUT ${scale.id}/${theme}`);
    check(same(actualTheme.anchors, expectedTheme.anchors), `runtime exact anchors ${scale.id}/${theme}`);
    check(actualTheme.canvas === expectedTheme.canvas, `runtime canvas ${scale.id}/${theme}`);
    for (const count of [3, 5, 7, 9]) {
      const actual = actualTheme.options[count], expected = expectedTheme.options[count];
      check(actual?.hex?.length === count && same(actual?.hex, expected?.hex), `runtime exact ${count}-class colors ${scale.id}/${theme}`);
      check(actual?.minStep === expected?.minStep && actual?.separationPass === expected?.separationPass, `runtime ${count}-class separation evidence ${scale.id}/${theme}`);
    }
  }
}
const seriesValues = series => series.map(({id, name, cue, light, dark}) => ({id, name, cue, light, dark}));
check(D.series.length === 10 && same(seriesValues(D.series), seriesValues(colors.series)), 'runtime exact categorical IDs, cues and both theme values');
check(D.gradients.length === 7 && same(D.gradients, colors.gradients), 'runtime exact seven retained atmosphere gradients');
check(same(D.foundation, colors.foundation), 'runtime exact foundation values');
// The retained guide renders examples outside the atlas iframe. Its legacy
// variable names must resolve to current colors too, including thin-mark ink.
const aliasCss = read('guide-token-aliases.css');
const tokens = JSON.parse(read('package/assets/lds-0.9.5/machine/color-srgb-08.tokens.json')).values;
const foundationNames = {
  'surface.canvas': 'canvas', 'surface.alt': 'surface-alt', 'surface.card': 'surface-card',
  'surface.raised': 'surface-raised', 'surface.soft': 'surface-soft', 'surface.blueTint': 'surface-blue-tint',
  'surface.beigeTint': 'surface-beige-tint', 'text.primary': 'text-primary', 'text.secondary': 'text-secondary',
  'text.metadata': 'text-metadata', 'text.muted': 'text-muted', 'text.disabled': 'text-disabled',
  'border.hairline': 'border-hairline', 'border.default': 'border-default', 'border.emphasis': 'border-emphasis',
  'interaction.accent': 'interaction-accent', 'interaction.focus.ring': 'focus-ring'
};
for (const [index, theme] of ['light', 'dark'].entries()) {
  const block = [...aliasCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(match => match[1].includes(`data-theme="${theme}"`));
  check(Boolean(block), `guide alias theme ${theme}`);
  if (!block) continue;
  const declarations = [...block[2].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]);
  const aliases = new Map(declarations);
  check(aliases.size === declarations.length, `guide alias names unique ${theme}`);
  const alias = (name, value) => check(aliases.get(name) === value, `guide current alias ${theme}/${name}`);
  for (const [id, name] of Object.entries(foundationNames)) alias(name, colors.foundation[id][theme]);
  for (const series of colors.series) {
    const name = series.id.replace('.', '-');
    alias(name, series[theme].ink);
    for (const role of ['fill', 'ink', 'vivid']) alias(`${name}-${role}`, series[theme][role]);
  }
  for (const [name, state] of Object.entries(tokens.semantic)) {
    alias(`${name}-fill`, state[theme][0]); alias(`${name}-ink`, state[theme][1]);
  }
  alias('dataviz-no-data', tokens.dataState.noData[theme]);
  alias('dataviz-zero', tokens.dataState.zero[theme]);
  for (const [id, names] of [['confidence', ['seq-confidence-low', 'seq-confidence-mid', 'seq-confidence-high']], ['delta', ['div-delta-side-a', 'div-delta-neutral', 'div-delta-side-b']]]) {
    const classes = colors.scales.find(scale => scale.id === id).themes[theme].options[3].hex;
    names.forEach((name, i) => alias(`dataviz-${name}`, classes[i]));
  }
  for (const [name, values] of Object.entries(tokens.map)) alias(`map-${name.replace(/[A-Z]/g, character => '-' + character.toLowerCase())}`, values[index]);
  for (const [name, product] of Object.entries(tokens.product)) {
    const stops = product[theme].map((hex, i, all) => `${hex} ${i * 100 / (all.length - 1)}%`).join(', ');
    alias(`product-${name}-legacy`, `linear-gradient(135deg, ${stops})`);
    alias(`product-${name}-srgb`, `linear-gradient(135deg in srgb, ${stops})`);
  }
}
check(html.includes('href="guide-token-aliases.css"'), 'full guide loads current token aliases');
// The atlas is inline so its selectors and perception controls must not style
// the surrounding handbook or take ownership of the page's theme preference.
const scopedCss = read('scoped-atlas.css');
const embeddedApp = read('embedded-atlas.js');
const guideRuntime = read('full-guide.js');
check(html.includes('href="scoped-atlas.css"'), 'inline atlas loads isolated styles');
check(html.includes('src="embedded-atlas.js"'), 'inline atlas loads its own controls');
check(!/<script\b[^>]*src="app\.js"/.test(html), 'full guide does not load standalone global theme controls');
check(!embeddedApp.includes('document.body.classList') && !embeddedApp.includes('document.documentElement.dataset.theme') && !embeddedApp.includes('lds-preview-theme'), 'embedded controls cannot change global perception or theme preferences');
check(embeddedApp.includes('atlas.classList'), 'perception controls target only the inline atlas');
check(!guideRuntime.includes('contentDocument') && !guideRuntime.includes('contentWindow'), 'guide runtime does not depend on an iframe');
check(!/scrollTo\(|scrollIntoView\(|history\.pushState\(|history\.replaceState\(/.test(guideRuntime), 'guide helper preserves native page anchor behavior');
const stripComments = value => value.replace(/\/\*[\s\S]*?\*\//g, '');
const colorLiterals = value => stripComments(value).match(/#[\da-f]{3,8}\b/gi) ?? [];
const styleSources = ['package/assets/lds-0.9.5/machine/color-srgb-08.production.css', 'lds/lds-0.9.4-ext.css', 'lds/lds-0.9.4-components.css', 'app.css', 'candidate.css'];
check(same(colorLiterals(scopedCss), styleSources.flatMap(file => colorLiterals(read(file)))), 'scoped styles retain exact approved source color literals');
function selectorList(value) {
  const result = []; let begin = 0, depth = 0, quote = null;
  for (let i = 0; i < value.length; i++) {
    const character = value[i];
    if (quote) { if (character === quote && value[i - 1] !== '\\') quote = null; continue; }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (character === '(' || character === '[') depth++;
    else if (character === ')' || character === ']') depth--;
    else if (character === ',' && depth === 0) { result.push(value.slice(begin, i).trim()); begin = i + 1; }
  }
  result.push(value.slice(begin).trim()); return result;
}
function checkScopedRules(source) {
  let cursor = 0;
  while (cursor < source.length) {
    const open = source.indexOf('{', cursor);
    if (open < 0) { check(!source.slice(cursor).trim(), 'scoped CSS has no unexpected trailing rule'); return; }
    const selector = source.slice(cursor, open).trim();
    let depth = 1, quote = null, end = open + 1;
    for (; end < source.length; end++) {
      const character = source[end];
      if (quote) { if (character === quote && source[end - 1] !== '\\') quote = null; continue; }
      if (character === '"' || character === "'") { quote = character; continue; }
      if (character === '{') depth++;
      else if (character === '}' && --depth === 0) break;
    }
    check(depth === 0, 'scoped CSS blocks are balanced');
    if (depth !== 0) return;
    const body = source.slice(open + 1, end);
    if (/^@(media|supports|container|layer)\b/.test(selector)) checkScopedRules(body);
    else if (!/^@(font-face|keyframes)\b/.test(selector)) {
      for (const part of selectorList(selector)) check(/^\.lds095-color-atlas(?:$|[\s.#:\[>+~])/.test(part), `atlas selector is isolated: ${part}`);
    }
    cursor = end + 1;
  }
}
checkScopedRules(stripComments(scopedCss));
for (const family of ['density.area', 'density.capita', 'density.household', 'built']) {
  check(D.scales.find(scale => scale.id === family)?.warm === true, `warm density family ${family}`);
}
if (failures.length) {
  console.error(`DS 0.9.5 site FAIL (${failures.length}/${checks} checks)`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`DS 0.9.5 full guide + color atlas distribution PASS (${checks} checks; bounded static and exact-data checks)`);
