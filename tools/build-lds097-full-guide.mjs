#!/usr/bin/env node
// Keep the complete, owner-selected 0.9.1 reading experience while projecting
// current 0.9.7 assets and identity. Historical source bytes are never rewritten.
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const site = join(root, 'deployment/v0.9.7');
const machine = join(root, 'plugins/landometer-design-system/assets/lds-0.9.7/machine');
const sourcePath = join(root, 'deployment/index.v0.9.1.html');
const source = readFileSync(sourcePath, 'utf8');
const sourceHash = createHash('sha256').update(source).digest('hex');
const expectedSourceHash = '1581689d4b0beee36eed53559f6df19f4cff74d06632d4ea2c878b94a7666e7b';
if (sourceHash !== expectedSourceHash) throw new Error(`Unexpected archived guide: ${sourceHash}`);
const release = JSON.parse(readFileSync(join(machine, 'release.json'), 'utf8'));
const registry = JSON.parse(readFileSync(join(machine, 'color-srgb-10.tokens.json'), 'utf8'));
const scales = JSON.parse(readFileSync(join(machine, 'color-srgb-10.scales.json'), 'utf8'));
const policy = JSON.parse(readFileSync(join(machine, 'policy.json'), 'utf8'));
const allTokens = JSON.parse(readFileSync(join(machine, 'tokens.v0.9.7.json'), 'utf8'));
const values = registry.values;
const build = 'ui-20261001-lds097-r1';
const packagePath = 'package/assets/lds-0.9.7';
const checkOnly = process.argv.includes('--check');
mkdirSync(site, {recursive: true});
const emit = (path, bytes) => {
  if (checkOnly) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== bytes) throw new Error(`Generated file is stale: ${path}`);
  } else writeFileSync(path, bytes);
};

function replaceRequired(text, search, replacement) {
  if (!text.includes(search)) throw new Error(`Missing source hook: ${search.slice(0, 100)}`);
  return text.replaceAll(search, replacement);
}
function between(text, start, end, replacement) {
  const a = text.indexOf(start), b = text.indexOf(end, a);
  if (a < 0 || b < 0) throw new Error(`Missing fragment ${start}`);
  return text.slice(0, a + start.length) + '\n' + replacement + '\n' + text.slice(b);
}
const bi = (th, en) => `<span data-th>${th}</span><span data-en>${en}</span>`;
const optFragment = (name, fallback) => {
  const path = join(site, 'guide-fragments', name);
  return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
};

// Explicit aliases bridge the retained demonstration's CSS vocabulary to the
// current exact registry. Ink is used by its colored text and thin marks; the
// explicit fill/vivid aliases remain available for larger shapes.
const aliasBlocks = ['/* Generated from color-srgb-10.tokens.json and exact analytical records. */'];
for (const [index, theme] of ['light', 'dark'].entries()) {
  const declarations = new Map();
  const put = (name, value) => declarations.set(name, value);
  for (const [key, pair] of Object.entries(values.foundation)) {
    const name = key === 'surface.canvas' ? 'canvas' : key === 'interaction.focus.ring' ? 'focus-ring' : key.replaceAll('.', '-').replace(/[A-Z]/g, x => '-' + x.toLowerCase());
    put(name, pair[index]);
  }
  for (const [name, state] of Object.entries(values.semantic)) {
    put(`${name}-fill`, state[theme][0]); put(`${name}-ink`, state[theme][1]);
  }
  for (const item of values.series.values) {
    const key = item.id.replace('.', '-');
    put(key, item[theme].ink);
    for (const role of ['fill', 'ink', 'vivid']) put(`${key}-${role}`, item[theme][role]);
  }
  for (const [name, series] of Object.entries({primary: '07', change: '05', outlier: '02'})) put(`series-${name}`, `var(--series-${series}-ink)`);
  put('dataviz-no-data', values.dataState.noData[theme]); put('dataviz-zero', values.dataState.zero[theme]);
  const confidence = scales.scales.find(x => x.scaleId === 'confidence' && x.theme === theme);
  const delta = scales.scales.find(x => x.scaleId === 'delta' && x.theme === theme);
  ['low', 'mid', 'high'].forEach((part, i) => put(`dataviz-seq-confidence-${part}`, confidence.classes['3'][i]));
  ['side-a', 'neutral', 'side-b'].forEach((part, i) => put(`dataviz-div-delta-${part}`, delta.classes['3'][i]));
  for (const [key, pair] of Object.entries(values.map)) put('map-' + key.replace(/[A-Z]/g, x => '-' + x.toLowerCase()), pair[index]);
  for (const [name, product] of Object.entries(values.product)) {
    const stops = product[theme].map((x, i, a) => `${x} ${i * 100 / (a.length - 1)}%`).join(', ');
    put(`product-${name}-legacy`, `linear-gradient(135deg, ${stops})`);
    put(`product-${name}-srgb`, `linear-gradient(135deg in srgb, ${stops})`);
  }
  // ijji is a separate product identity. Its previously approved cool recipe is
  // retained by BRAND.md, not inferred from an obsolete warm product alias.
  put('product-ijji-legacy', theme === 'light' ? 'var(--atmosphere-ground-mist-legacy)' : 'linear-gradient(135deg, #59C7E8 0%, #3BD3CB 100%)');
  put('product-ijji-srgb', theme === 'light' ? 'var(--atmosphere-ground-mist-srgb)' : 'linear-gradient(135deg in srgb, #59C7E8 0%, #3BD3CB 100%)');
  const selector = theme === 'light' ? ':root, html[data-theme="light"]' : 'html[data-theme="dark"]';
  aliasBlocks.push(`${selector} {\n${[...declarations].map(([name, value]) => `  --${name}: ${value};`).join('\n')}\n}`);
}
emit(join(site, 'guide-token-aliases.css'), aliasBlocks.join('\n\n') + '\n');

let html = source;
// Library disclosure layout belongs only to each group's own summary. The
// original descendant selector also restyled nested Atlas disclosures into the
// outer five-column grid, producing tall clipped content on narrow screens.
html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/g, (_match, attributes, css) =>
  `<style${attributes}>${css.replace(/(\.library-group(?:\[open\])?)\s+summary/g, '$1 > summary')}</style>`);
// Disable the old file redirect and latest-alias freshness checker. This guide
// has its own URL and site receipt; it must never navigate back to 0.9.1.
html = html.replace(/  <script>\s*\(\(\) => \{\s*const root = document\.documentElement;\s*if \(location\.protocol === "file:"[\s\S]*?<\/script>/, '');
html = html.replace(/  <script>\s*\(\(\) => \{\s*const root = document\.documentElement;\s*if \([\s\S]*?root\.dataset\.buildChannel !== "latest-alias"[\s\S]*?<\/script>/, '');
const attributes = {
  'data-ds-version': '0.9.7',
  'data-authoring-revision': '0.9.7-owner.1', 'data-ruleset': policy.schemaVersion,
  'data-machine-package-identity': release.release.releaseRef,
  'data-manifest-version': 'lds-public-site-1', 'data-token-schema-version': allTokens.schemaVersion,
  'data-motion-registry': allTokens.sets.motion,
  'data-color-registry': 'color-srgb-10', 'data-artifact-build': build,
  'data-build-channel': 'full-guide', 'data-machine-validation': 'bounded-checks-only',
};
html = html.replace(/<html\b[\s\S]*?>/, opening => {
  opening = opening.replace(/\s*data-build-card-version="[^"]*"/, '');
  for (const [key, value] of Object.entries(attributes)) opening = opening.replace(new RegExp(`${key}="[^"]*"`), `${key}="${value}"`);
  return opening.replace('>', '  data-retained-guide="0.9.1-ui-20260902-08"\n>');
});
for (const [name, value] of Object.entries({
  'ds-version': '0.9.7', 'authoring-revision': '0.9.7-owner.1', 'ruleset': policy.schemaVersion,
  'motion-set': allTokens.sets.motion,
  'machine-package-identity': release.release.releaseRef, 'color-set': 'color-srgb-10',
  'artifact-build': build, 'release-receipt': 'v0.9.7-owner.1 · unsigned owner distribution',
})) html = html.replace(new RegExp(`(<meta name="landometer:${name}" content=")[^"]*(")`), `$1${value}$2`);
html = html.replace('<title>Landometer Design System v0.9.1 · Implementation Playground</title>', '<title>Landometer Design System v0.9.7 · Implementation Playground</title>');
html = html.replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Landometer DS 0.9.7: คู่มือแบรนด์ ภาษา ภาพ ตัวอย่างการใช้งาน และ Color Atlas ฉบับเต็ม คงประสบการณ์ 0.9.1 พร้อมชุดสีและ assets ใหม่">');
html = html.replace('<link rel="canonical" href="https://montri-th.github.io/Landometer/">', '<link rel="canonical" href="https://montri-th.github.io/Landometer/v0.9.7/">');
html = html.replace('</head>', '  <link rel="stylesheet" href="guide-token-aliases.css">\n  <link rel="stylesheet" href="scoped-atlas.css">\n  <link rel="stylesheet" href="full-guide.css">\n</head>');

// Original asset paths stay truthful references to the unchanged deployed
// binaries. This is a new page one directory below the original guide.
html = html.replace(/((?:src|href)=")assets\//g, '$1../assets/');
html = html.replace(/url\((["']?)assets\//g, 'url($1../assets/');
for (const path of ['site-manifest.v0.9.1.json', 'build-card.v0.9.1.yml', 'implementation-notes.v0.9.1.md', 'control-inventory.v0.9.0.json', 'qa/v0.9.1-manual-gates.md', 'landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-08.html', 'llms.txt']) {
  html = html.replaceAll(`href="${path}"`, `href="../${path}"`);
}

// Preserve every original library group and all of its teaching content. The
// two obsolete analytical projections are replaced, not hidden in the DOM.
// Inline the complete static explorer, using a scoped stylesheet and scoped
// controls. Long nested browsing contexts caused mobile scrolling/paint issues;
// native sections preserve ordinary anchors, initial HTML and keyboard access.
const atlasSource = readFileSync(join(site, 'color-reference.html'), 'utf8');
const atlasMain = atlasSource.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
if (!atlasMain) throw new Error('Standalone color atlas is missing its main content');
const categoriesStart = atlasMain.indexOf('<section id="categories"');
if (categoriesStart < 0) throw new Error('Standalone color atlas is missing categories');
const atlasContent = atlasMain.slice(categoriesStart);
const colorVisionDefs = atlasSource.match(/<svg\b[^>]*>[\s\S]*?<filter id="deuteranopia"[\s\S]*?<\/svg>/)?.[0];
if (!colorVisionDefs) throw new Error('Standalone color atlas is missing its color-vision filter');
const atlas = `<div class="lds097-atlas-embed"><div class="lds097-atlas-intro"><p>${bi('สีชุด 0.9.7 ใช้งานอยู่ในคู่มือฉบับเต็มนี้ เลือกธีม หมวดหมู่ และตัวหารเพื่อดูค่าจริง', 'The approved 0.9.7 colors are part of this complete guide. Choose theme, category and denominator to inspect exact values.')}</p><p><a href="color-atlas.html">${bi('เปิด Color Atlas เต็มหน้าจอ', 'Open the Color Atlas on its own')}</a></p></div><div id="lds097-color-atlas" class="lds097-color-atlas" data-theme="light">${colorVisionDefs}${atlasContent}</div></div>`;
let completeAtlas = source.split('<!-- COLOR_ATLAS_START -->')[1].split('<!-- COLOR_ATLAS_END -->')[0];
completeAtlas = completeAtlas.replace(/<section class="atlas-family atlas-family--categorical"[\s\S]*?<\/section>/, `<section class="atlas-family atlas-family--categorical" aria-labelledby="atlas-categorical-title"><header class="atlas-family-head"><p class="atlas-family-index">05 · CATEGORICAL + ANALYTICAL · 0.9.7</p><h5 id="atlas-categorical-title">${bi('สีหมวดหมู่ ชุดข้อมูล และบรรยากาศครบตามรุ่นปัจจุบัน', 'Current categorical colors, analytical families and atmospheres')}</h5></header>${atlas}</section>`);
completeAtlas = completeAtlas.replace(/<section class="atlas-family atlas-family--dataviz"[\s\S]*?<\/section>/, `<section class="atlas-family atlas-family--dataviz" aria-labelledby="atlas-dataviz-title"><header class="atlas-family-head"><p class="atlas-family-index">06 · EXACT ANALYTICAL LUT</p><h5 id="atlas-dataviz-title">${bi('ครบ 20 ตระกูล × 2 ธีม · LUT 41 สี และชุด 3/5/7/9 ชั้น', '20 families × 2 themes · exact 41-sample LUT and 3/5/7/9 classes')}</h5><p>${bi('ตารางและตัวอย่างด้านบนอ่านจากชุดเดียวกับไฟล์สำหรับเครื่องมือ ระบุ metric หน่วย ตัวหาร เกณฑ์แบ่ง และสถานะไม่มีข้อมูลทุกครั้ง', 'The Atlas above uses the same registry as the machine files. Always declare metric, unit, denominator, thresholds and missing-data states.')}</p><p><a href="#library">${bi('ไปทุกตระกูลข้อมูลใน Atlas', 'Go to every analytical family in the Atlas')}</a> · <a href="${packagePath}/machine/color-srgb-10.scales.json">${bi('เปิดค่าจริงสำหรับเครื่องมือ', 'Open exact machine values')}</a></p></header></section>`);
completeAtlas = completeAtlas.replaceAll('data-atlas-version="0.9.1"', 'data-atlas-version="0.9.7"').replaceAll('data-atlas-source-version="0.8.6"', 'data-atlas-source-version="0.9.7"').replaceAll('data-atlas-records="18"', 'data-atlas-records="40"');
completeAtlas = completeAtlas.replaceAll('<strong>18 × 41</strong>', '<strong>40 × 41</strong>').replaceAll('categorical pairs', 'categorical slots · soft/vivid/ink');
completeAtlas = completeAtlas.replace(/<p><span data-th lang="th">LUT ด้านล่างอ่านจาก scales\.json[\s\S]*?<\/p>/, `<p>${bi('LUT ปัจจุบันอ่านจาก color-srgb-10.scales.json ของ v0.9.7-owner.1 ใช้เป็นชุดสีที่ตรวจสอบได้ ไม่ใช่หลักฐานของผลิตภัณฑ์ งานวิเคราะห์จริงต้อง bind schema, release, unit และ grain ที่เข้ากันก่อนใช้', 'Current LUTs come from color-srgb-10.scales.json in v0.9.7-owner.1. They are exact color assets, not product evidence. Real analysis must bind compatible schema, release, unit and grain before use.')}</p>`);
completeAtlas = completeAtlas.replaceAll('color-srgb-05 retained', 'color-srgb-10');
// Foundation/semantic/map and opacity/depth are unchanged registry values.
// Separate approved product recipes from role-pair illustrations; descriptive
// card labels do not invent product.*.gradient paths in the current registry.
completeAtlas = completeAtlas.replace('Product identity—พื้นที่เฉพาะผลิตภัณฑ์', 'สีผลิตภัณฑ์—สูตรอัตลักษณ์และตัวอย่างคู่สี')
  .replace('Product identity—product scope only', 'Product colors—identity recipes and pair previews')
  .replace('ตัวอย่างเหล่านี้บอกว่าอยู่ในผลิตภัณฑ์ใด ห้ามนำไปเข้ารหัสค่า สถานะ หรือเปรียบเทียบข้ามผลิตภัณฑ์', 'แยกสูตรอัตลักษณ์ที่อนุมัติแล้วออกจากตัวอย่างคู่สีตามป้ายกำกับแต่ละชุด ทุกชุดห้ามใช้เข้ารหัสค่า สถานะ หรือเปรียบเทียบข้ามผลิตภัณฑ์')
  .replace('These specimens identify product scope. Never use them to encode magnitude, state, or cross-product comparison.', 'Each card distinguishes an approved identity recipe from an illustrative color pairing. Never use either to encode magnitude, state, or cross-product comparison.');
completeAtlas = completeAtlas.replace(/<article class="atlas-product-card"[\s\S]*?<\/article>/g, card => {
  const match = card.match(/<code>product\.([^.]+)\.gradient<\/code>/);
  const product = match && values.product[match[1]];
  if (match) card = card.replace('data-scope="product-identity"', `data-scope="product-identity" data-product="${match[1]}"`);
  if (match?.[1] !== 'citywiki') card = card.replace(/<code>product\.[^.]+\.gradient<\/code>/, `<code>${bi('สูตรอัตลักษณ์ที่อนุมัติ', 'Approved identity recipe')}</code>`);
  if (!product) return card; // ijji's approved cool identity paints are retained exactly.
  if (match[1] === 'citymeter') {
    card = card.replace(/<p class="atlas-scope-note">[\s\S]*?<\/p>/, `<p class="atlas-scope-note">${bi('สูตรอัตลักษณ์ที่สืบทอดและอนุมัติไว้ สีตรงกับ primary / accent ปัจจุบัน ใช้เฉพาะอัตลักษณ์ผลิตภัณฑ์ ห้ามใช้แทนข้อมูล สถานะ หรือหลักฐาน', 'Retained approved identity recipe; its colors match the current primary/accent pair. Product identity only; never encode data, states or evidence.')} <a href="https://github.com/montri-th/Landometer/blob/main/normative-patches/landometer-design-system-v0.9.0-product-identity-gradients.approval.yml">${bi('บันทึกการอนุมัติ', 'Approval record')}</a> · <a href="../assets/data/color-delivery.v0.9.0.json">${bi('ทะเบียนสูตรที่สืบทอด', 'Retained recipe registry')}</a></p>`);
  }
  if (match[1] === 'citywiki') {
    card = card.replace('data-scope="product-identity"', 'data-scope="product-color-pair-preview"')
      .replace('<code>product.citywiki.gradient</code>', `<code>${bi('คู่สี primary / accent', 'Primary / accent pair')}</code>`)
      .replace(/<p class="atlas-scope-note">[\s\S]*?<\/p>/, `<p class="atlas-scope-note">${bi('ตัวอย่างแสดงสี primary และ accent ร่วมกัน LDS และ Add-on ปัจจุบันยังไม่มีสูตร gradient อัตลักษณ์ CityWiki ที่อนุมัติ ใช้เป็นอัตลักษณ์ได้เมื่อมีสูตรและขอบเขตที่อนุมัติใน Add-on เท่านั้น', 'Illustrative primary/accent pairing. Current LDS and Add-on files do not supply an approved CityWiki identity-gradient recipe. Identity use requires an approved recipe and scope in the Add-on.')}</p>`);
  }
  return card.replace(/<figure class="atlas-gradient-theme atlas-gradient-theme--pinned" data-theme-surface="(light|dark)">[\s\S]*?<\/figure>/g, (_figure, theme) => {
    const colors = product[theme];
    const stops = colors.map((color, i) => `${color} ${i * 100 / (colors.length - 1)}%`).join(', ');
    return `<figure class="atlas-gradient-theme atlas-gradient-theme--pinned" data-theme-surface="${theme}"><span class="atlas-gradient-sample" style="--atlas-gradient:linear-gradient(135deg, ${stops});background:linear-gradient(135deg, ${stops});background:linear-gradient(135deg in srgb, ${stops})" aria-hidden="true"></span><figcaption><strong>${theme === 'light' ? 'Light' : 'Dark'}</strong><code>${colors.join(' → ')}</code><span class="atlas-theme-surface-note">${bi('แสดงบนพื้นของธีมที่ระบุเสมอ', 'Pinned to the named theme surface')}</span></figcaption></figure>`;
  }).replace(/<p class="atlas-gradient-foreground">[\s\S]*?<\/p>/, `<p class="atlas-gradient-foreground">${bi('ใช้ opaque panel หรือ scrim สำหรับข้อความ และตรวจ contrast บนงานจริง', 'Use an opaque panel or scrim for text and check contrast in the actual artifact.')}</p>`);
});
html = between(html, '<!-- COLOR_ATLAS_START -->', '<!-- COLOR_ATLAS_END -->', completeAtlas);
const sampler = optFragment('sampler.html', `<section class="scale-sampler lds097-current-sampler" data-color-registry="color-srgb-10"><h6>${bi('20 ตระกูลข้อมูล · แยกตัวหารก่อนเลือกสี', '20 analytical families · choose the denominator first')}</h6><p>${bi('Density ทุกตัวหารเป็นโทนร้อน: ต่อพื้นที่สีส้ม ต่อประชากรกุหลาบ ต่อครัวเรือนแดง และพื้นที่ก่อสร้างเหลืองทอง ใช้ชุด 3/5/7/9 ระดับหรือ LUT 41 สีที่ให้มาครบ', 'Every density denominator has a distinct warm direction: area orange, per-capita rose, household scarlet and built-area gold. Use exact 3/5/7/9 classes or the complete 41-sample LUT.')}</p><a href="#complete-color-atlas" data-reveal-target="complete-color-atlas">${bi('เลือกดูสีและค่าจริงทุกตระกูล', 'Inspect exact colors and values for every family')}</a></section>`);
html = between(html, '<!-- COLOR_SCALE_SAMPLER_START -->', '<!-- COLOR_SCALE_SAMPLER_END -->', sampler);
html = html.replaceAll('data-color-registry="color-srgb-05"', 'data-color-registry="color-srgb-10"');
html = html.replaceAll('DS 0.9.1<br>COLOR SRGB-05', 'DS 0.9.7<br>COLOR SRGB-10');
html = html.replaceAll('Landometer Design System · v0.9.1', 'Landometer Design System · v0.9.7');
html = html.replaceAll('DS v0.9.1 · implementation in view', 'DS v0.9.7 · foundations from 0.9.1');
html = html.replaceAll('<span data-th>ตัวอย่าง v0.9.1</span><span data-en>v0.9.1 examples</span>', '<span data-th>หลักและตัวอย่าง</span><span data-en>Principles and examples</span>');
html = replaceRequired(html, 'สี บรรยากาศ ตัวอักษร และโครงสร้างที่พิสูจน์แล้วยังอยู่ครบ v0.9.1 ทำให้การวางทางนำ การเขียนปุ่ม การใช้ motion การเปิดเผยหลักฐาน และการส่งงานข้ามสื่อตรงกันมากขึ้น', 'คงคู่มือและกฎครบจาก 0.9.5 พร้อม gradient ทางเดียว 14 ชุดที่ใช้หัว–กลาง–ท้ายต่างเฉดชัดเจน เช่น ครีม → เขียว → ฟ้าในธีมสว่าง แต่ละธีมใช้ช่วงความสว่างของตน');
html = replaceRequired(html, 'The proven color, atmosphere, type, and layout foundations remain. v0.9.1 makes navigation, actions, motion, evidence, and cross-format handoff easier to apply consistently.', 'The complete 0.9.5 guide and rules continue here, with fourteen sequential families built from three distinct hue anchors. Light and dark tables share each metric’s meaning and class intervals.');
html = html.replaceAll('สีและพื้นฐานที่พิสูจน์แล้วยังคงเดิม รอบนี้เราเปลี่ยนกฎที่อ่านยาวให้เป็นตัวอย่างที่เห็นโครงสร้าง สถานะ และผลลัพธ์ได้ก่อน แล้วค่อยเปิดรายละเอียดเมื่อจำเป็น', 'คงเสียงแบรนด์ ภาพ ฟอนต์ identity และ motif/animation ตลอดจนสีหมวดหมู่ สเกลสองทาง และ gradient บรรยากาศจาก 0.9.5 ปรับเฉพาะ 14 สเกลทางเดียวให้สีกลางเป็นอีกเฉดชัดเจน โดยยังไล่ความสว่างทางเดียว');
html = html.replaceAll('The proven visual foundations remain. This revision turns long guidance into visible structures, states, and outcomes, with detail available when it is useful.', 'The 0.9.5 voice, visuals, fonts, identity, motif/animation, categorical colors, diverging scales and atmosphere recipes remain. Only the fourteen sequential families gain a distinct midpoint hue while preserving monotonic lightness.');
html = html.replaceAll('color-srgb-05 · atmosphere · type roles · spacing · one job · first AHA · evidence boundary', 'brand voice · visual foundations · fonts · 7 atmosphere recipes · one job · first AHA · evidence boundary');
html = html.replaceAll('navigation · outcome-led CTA · fail-open motion · initial/hydrated parity · cross-format equivalence', 'color-srgb-10 · 14 three-color sequential families · warm density · exact light/dark tables');
html = html.replaceAll('landometer-design-system@0.9.1', 'landometer-design-system@0.9.7');
html = html.replaceAll('Landometer Design System 0.9.1-r8', 'Landometer Design System 0.9.7-owner.1');
html = html.replaceAll('DS 0.9.1', 'DS 0.9.7');
html = html.replaceAll('0.9.7-owner.1 · 1 Sep 2026', '0.9.7-owner.1 · 1 Oct 2026');
html = html.replaceAll('คู่มืออ้างอิงที่เจ้าของอนุมัติ · 0.9.1-r8 · 1 ก.ย. 2569', 'ชุด 0.9.7 ที่เจ้าของอนุมัติ · 1 ต.ค. 2569 · ไม่มีลายเซ็นดิจิทัลใหม่');
html = html.replaceAll('Owner-approved reference · 0.9.1-r8 · 1 Sep 2026', 'Owner-approved 0.9.7 distribution · 1 Oct 2026 · unsigned');
html = html.replaceAll('SOURCE · 2026 · 0.9.1', 'SOURCE · 2026 · 0.9.7');
html = html.replaceAll('หลักเดิมที่ยังใช้ต่อใน v0.9.1', 'หลักเดิมที่ยังใช้ต่อใน v0.9.7');
html = html.replaceAll('Proven foundations carried into v0.9.1', 'Proven foundations carried into v0.9.7');
html = html.replaceAll('โดยกติกาปัจจุบันให้ยึด Landometer Design System 0.9.7-owner.1', 'โดยกติกาปัจจุบันให้ยึด Landometer Design System 0.9.7-owner.1 และใช้สี color-srgb-10');
html = html.replaceAll('คลังนี้นำตัวอย่างจาก Design System v0.9.1 มาให้ฝึกและอ้างอิงวิธีทำงาน', 'คลังนี้เก็บตัวอย่างจาก Design System v0.9.1 และใช้ assets ปัจจุบันของ v0.9.7 ให้ฝึกและอ้างอิงวิธีทำงาน');
html = html.replaceAll('These v0.9.1 Design System examples support training and implementation.', 'These retained v0.9.1 examples use current v0.9.7 assets to support training and implementation.');
html = html.replaceAll('หากต้องทำงานต่อในเครื่องมืออื่น ดาวน์โหลดต้นฉบับ v0.9.1 ไปวางข้างงานได้เลย', 'หากต้องทำงานต่อในเครื่องมืออื่น ดาวน์โหลดคู่มือและชุด assets v0.9.7 ไปวางข้างงานได้เลย');
html = html.replace(/(<a class="secondary-action" href=")[^"]*(" id="download-system")/, `$1normative/Landometer-Design-System-v0.9.7.md$2`);
html = html.replaceAll('ดาวน์โหลดคู่มือ Design System v0.9.1', 'ดาวน์โหลดคู่มือ Design System v0.9.7');
html = html.replaceAll('Download Design System v0.9.1', 'Download Design System v0.9.7');

// Keep the old receipt and checklist as an explicitly historical teaching
// example. Its old pass count is not current-site or package certification.
html = html.replaceAll('ตัวอย่างเหล่านี้คือฐานที่ยังทำงานอยู่—รูปทรง action, token-bound focus, evidence boundary, atmosphere และ color-srgb-05 โดย v0.9.1 ปรับกติกา icon, motion, navigation และการส่งข้ามสื่อให้ชัดขึ้น', 'ตัวอย่างเหล่านี้เก็บรูปทรง action, token-bound focus, evidence boundary, atmosphere และแนวทาง icon, motion, navigation กับการส่งข้ามสื่อจาก 0.9.1 ไว้ สีในตัวอย่างปัจจุบันใช้ color-srgb-10');
html = html.replaceAll('These live examples remain useful: action geometry, token-bound focus, evidence boundaries, atmosphere, and color-srgb-05. v0.9.1 clarifies icons, motion, navigation, and cross-format delivery.', 'These retained examples keep action geometry, token-bound focus, evidence boundaries, atmosphere, icons, motion, navigation and cross-format delivery. Current color demonstrations use color-srgb-10.');
html = html.replaceAll('ทุกหน้า publish ตอบได้ว่า “นี่ build ไหน” จาก meta ในตัวเอง — ค่าด้านล่างอ่านสดจากหน้านี้ ส่วน Color Set color-srgb-05 คงค่า normative เดิมจาก v0.9.0-r7', 'ทุกหน้า publish ตอบได้ว่า “นี่ build ไหน” จาก meta ในตัวเอง — ค่าด้านล่างอ่านสดจากหน้านี้ และสีปัจจุบันใช้ color-srgb-10 ของชุด v0.9.7-owner.1');
html = html.replaceAll('Every published page can answer “which build is this?” from its own metadata. The readout below is live, while Color Set color-srgb-05 retains its normative values from v0.9.0-r7.', 'Every published page can answer “which build is this?” from its own metadata. The readout below is live; current colors use color-srgb-10 from v0.9.7-owner.1.');
html = html.replaceAll('This preflight: 21 pass · 2 n/a · 0 fail', 'Historical 0.9.1 preflight example: 21 pass · 2 n/a · 0 fail — not a 0.9.7 result');
html = html.replaceAll('ผ่าน 21 · n/a 2 · fail 0', 'ตัวอย่างเดิม 0.9.1: ผ่าน 21 · n/a 2 · fail 0 — ไม่ใช่ผลตรวจ 0.9.7');
html = html.replace('<tbody id="v090-sc-body">', '<tbody id="v090-sc-body" data-evidence-scope="historical-0.9.1-example">');
html = html.replace('<details class="v090-sc-fold">', `<p class="v090-note" data-evidence-scope="historical-0.9.1-example">${bi('ตารางถัดไปเป็นหลักฐานตัวอย่างจากหน้า 0.9.1 เก็บเพื่ออธิบายวิธีตรวจเท่านั้น ผลตรวจ package และหน้า 0.9.7 ต้องอ่านจากบันทึกของรุ่นปัจจุบัน', 'The following table is retained evidence from the 0.9.1 page, showing how a checklist is recorded. Current package and 0.9.7 page results have their own receipts.')}</p><details class="v090-sc-fold">`);

// Adapt the cross-device lesson to the current delivery without pretending an
// archived standalone or old machine receipt contains new color values.
html = html.replaceAll('color-delivery.v0.9.1.json · color-srgb-05 retained', 'release.json · v0.9.7-owner.1 · color-srgb-10');
html = html.replaceAll('root, standalone และ Atlas ต้องอ้าง token/gradient ชุดเดียวกัน', 'คู่มือ Atlas และ package ต้องอ้าง token/gradient ชุดเดียวกัน');
html = html.replaceAll('Root, standalone, and Atlas must resolve the same token and gradient set.', 'Guide, Atlas, and package must resolve the same token and gradient set.');
html = html.replaceAll('<code>landometer-design-system-v0.9.1-standalone.color-srgb-05.ui-20260902-08.html</code>', `<code>v0.9.7-owner.1 · ${build}</code>`);
html = html.replaceAll('COLOR SET · SRGB-01', 'COLOR SET · SRGB-10');
html = html.replaceAll('data-color-registry="color-srgb-05"', 'data-color-registry="color-srgb-10"');
html = html.replaceAll('style="background:#89CEF6;', 'style="background:var(--series-08-fill);');
html = html.replaceAll('style="background:#EBC573;', 'style="background:var(--series-03-fill);');
html = html.replaceAll('style="background:#EB8182;', 'style="background:var(--series-01-fill);');
html = html.replaceAll('--signal-color:#FF8A4C', '--signal-color:var(--series-02-fill)');
html = html.replaceAll('--signal-color:#F4C44E', '--signal-color:var(--series-03-fill)');

// Supporting approach is optional. This guide keeps the original interactive
// motion labs but makes general reading static, instead of silently retaining
// the superseded once-only observer. The registered re-entry/motif contract is
// taught below; no claim is made that this page implements that adapter.
html = html.replace(/      const motionReduced = window\.matchMedia[\s\S]*?      const params = new URL\(location\.href\)\.searchParams;/, '      // Supporting content is static in this restored guide.\n      const params = new URL(location.href).searchParams;');
html = html.replace('      initRiddimReveal();', '      riddimLandAll(); // Static supporting content; manual labs remain interactive.');
// The retained localization pass runs after renderControls. Keep its source
// attributes current so it cannot overwrite the dynamic theme label with the
// original "follow device" label after a query-string or button selection.
html = replaceRequired(html,
  '        el("theme-cycle").setAttribute("aria-label", themeLabels[state.locale][state.theme]);',
  '        el("theme-cycle").setAttribute("data-l10n-aria-th", themeLabels.th[state.theme]);\n        el("theme-cycle").setAttribute("data-l10n-aria-en", themeLabels.en[state.theme]);\n        el("theme-cycle").setAttribute("aria-label", themeLabels[state.locale][state.theme]);');
const motionTextChanges = new Map([
  ['slow reveal ครั้งเดียว', 'supporting content แบบคงที่'],
  ['one slow reveal', 'static supporting content'],
  ['reveal / settle / direct / disclosure / static · 760/920ms · once only · reduced motion and observer failure = final state', 'reveal / settle / direct / disclosure / static · 760/920ms ceilings · optional approach replays on re-entry, never while stationary · this guide uses static supporting content'],
  ['แสดงงานและคำตอบหลักทันที แล้วใช้ motion เพียงครั้งเดียวเพื่อพาสายตาไปที่สถานะ ความหมาย และสิ่งที่ทำต่อ โหมด reduced motion และ no-JavaScript ต้องเห็นความหมายสุดท้ายครบตั้งแต่ต้น', 'คำตอบและหลักฐานเห็นได้ทันที Approach ของส่วนสนับสนุนอาจเล่นเมื่อเข้าจอและกลับเข้าจอ โดยไม่วนขณะอยู่นิ่ง; reduced motion, no-JavaScript และ runtime failure แสดงผลสุดท้ายทันที หน้านี้ใช้ supporting content แบบคงที่; motion lab เล่นเมื่อผู้ใช้สั่ง'],
  ['The object and answer remain immediate. Motion may then clarify status, meaning, and the next action once. Reduced-motion and no-JavaScript states expose the complete final meaning immediately.', 'Answers and evidence stay immediate. Supporting approach motion may replay on viewport re-entry, never while stationary; reduced motion, no JavaScript and runtime failure expose the final state immediately. Supporting content on this guide is static; the motion lab runs on request.'],
  ['<tr><td>Reveal</td><td>400ms</td>', '<tr><td>Reveal</td><td>640ms</td>'],
  ['เรียงหลักฐานหรือลำดับการอ่านหนึ่งครั้ง', 'จังหวะสนับสนุนตามสถานะจริง ไม่ซ่อนหลักฐาน'],
  ['Evidence or reading order, once', 'Supporting state change; never hide evidence'],
  ['ห้าม bounce, pulse ซ้ำ, shimmer, orbit, parallax, animation โลโก้/ภาพสารคดี, generic scroll reveal หรือเล่น hero ซ้ำเมื่อกลับมา', 'ห้าม motion อัตลักษณ์ที่ไม่อยู่ในทะเบียน, ambient loop ไร้ขอบเขต, parallax หรือการซ่อนหลักฐานไว้หลัง animation งาน identity และ motif ต้องใช้ runtime กับ lifecycle ที่อนุมัติไว้ใน MOTION-04 และ MOTIF-01…06'],
  ['No bounce, repeated pulse, shimmer, orbit, parallax, animated logo/documentary photo, generic scroll reveal, or replayed hero on return.', 'No unregistered identity animation, unbounded ambient loops, parallax, or evidence hidden behind animation. Identity and motifs follow the approved runtime and lifecycle in MOTION-04 and MOTIF-01…06.'],
]);
for (const [before, after] of motionTextChanges) html = replaceRequired(html, before, after);
const evidenceRows = [
  ['measured', 'ค่าที่วัดได้และไม่ใช่ศูนย์', 'Measured nonzero value', '12', '12'],
  ['measured_zero', 'วัดได้เป็นศูนย์', 'Measured zero', '0', '0'],
  ['no_data', 'ไม่มีข้อมูล', 'No data', 'null', '—'],
  ['out_of_scope', 'อยู่นอกขอบเขต', 'Out of scope', 'null', 'N/A'],
  ['suppressed', 'ปกปิดค่า', 'Suppressed', 'null', '•••'],
  ['not_yet', 'ยังไม่ถึงรอบข้อมูล', 'Not yet available', 'null', '…'],
];
const additions = `<section class="lds097-integration" id="v097-integration" aria-labelledby="v097-integration-title"><div class="container"><div class="section-heading"><p class="eyebrow">Integrated in 0.9.7</p><h2 id="v097-integration-title">${bi('สิ่งใหม่ทำงานร่วมกับหลักเดิม', 'New assets, the same complete foundations')}</h2><p>${bi('สเกลทางเดียว 14 ชุดใช้สีหัว–กลาง–ท้ายต่างเฉดใน Color Atlas; ธีมสว่างเริ่มด้วยครีม #F2F1DF ส่วนธีมมืดใช้ช่วงสว่างของตน สเกลสองทาง หมวดหมู่ แบรนด์ ภาษา ภาพ และ motif/animation สืบทอดจาก 0.9.5', 'Fourteen sequential families use distinct start, midpoint and end hues. Light themes begin with cream #F2F1DF; dark themes retain their own luminance range. Diverging scales, categories, brand, voice, visuals and motif/animation are retained from 0.9.5.')}</p></div>
<article class="lds097-integration__chapter lds097-integration__chapter--evidence" id="v097-evidence"><div class="lds097-integration__copy"><header><h3>${bi('ตัวเลขกับสถานะต้องตรงกันทั้งคนและเครื่องมือ', 'People and machines read the same value state')}</h3></header><p>${bi('ค่าตัวอย่างต่อไปนี้เป็น fixture สังเคราะห์ สองสถานะที่วัดได้มีตัวเลข ส่วนสถานะอื่นต้องมีค่า null เสมอ ห้ามซ่อนตัวเลขที่ปกปิดไว้ใน HTML หรือ JSON', 'The following synthetic fixtures separate measured numbers from null-valued states. Suppressed numeric values must never be hidden in HTML or JSON.')}</p></div><div class="matrix-wrap"><table class="state-table"><caption>${bi('สัญญาค่า 6 สถานะของ DS 0.9.7 · ตัวอย่างสังเคราะห์', 'DS 0.9.7 six-state value contract · synthetic fixtures')}</caption><thead><tr><th>State</th><th>${bi('ความหมายที่เห็น', 'Visible meaning')}</th><th>Machine value</th></tr></thead><tbody>${evidenceRows.map(([state, th, en, value, display]) => `<tr data-evidence-state="${state}" data-value="${value}"><th><code>${state}</code></th><td><strong>${display}</strong> · ${bi(th, en)}</td><td><code>${value}</code></td></tr>`).join('')}</tbody></table><p><a href="${packagePath}/machine/evidence-value.schema.json">${bi('เปิด schema และเงื่อนไขค่า', 'Open the value schema and conditions')}</a></p></div></article>
<article class="lds097-integration__chapter lds097-integration__chapter--motion" id="v097-motion"><div class="lds097-integration__copy"><header><h3>${bi('คงหลักฐานให้อ่านได้ และใช้ motion ตามหน้าที่', 'Keep evidence readable and give motion a job')}</h3></header><p>${bi('หน้านี้แสดง supporting content แบบคงที่ และให้ทดลอง motion เมื่อกดใน lab เท่านั้น Approach อาจเล่นซ้ำเมื่อกลับเข้าจอ แต่ไม่วนขณะอยู่นิ่ง; reduced motion, no-JavaScript และ failure เห็นผลสุดท้าย', 'This guide keeps supporting content static and lets the reader request motion in the lab. Optional approach motion may replay on re-entry, never while stationary; reduced motion, no JavaScript and failure expose final meaning.')}</p></div><div class="lds097-integration__copy"><p>${bi('Identity และ shared motif ใช้ finite plays ซ้ำเฉพาะขณะเห็นอย่างน้อย 14% ของวัตถุ รอบไม่น้อยกว่า 2,000ms (logo 6,000ms) หยุดเมื่อออกจอ และมีปุ่ม pause/resume ระดับหน้า คงไฟล์โลโก้ต้นฉบับไว้ ส่วน wordmark เปลี่ยนสีได้ตาม LOGO-01; product overlay เช่น ijji.logo-sting คง lifecycle ของตน', 'Identity and shared motifs use repeated finite plays while at least 14% visible, with cycles of at least 2,000ms (logo 6,000ms), stop offscreen and provide page-level pause/resume. Original logo files are retained; wordmark colour treatments are permitted by LOGO-01; product overlays such as ijji.logo-sting retain their own lifecycle.')}</p><a href="normative/Landometer-Design-System-v0.9.7.md">${bi('อ่านกฎ motion และ motif ในฉบับ 0.9.7', 'Read motion and motif rules in the complete 0.9.7 document')}</a></div></article></div></section>`;
html = html.replace('    <section class="playground" id="play"', additions + '\n    <section class="playground" id="play"');

// Existing resource records remain available with their original labels,
// checksums and versions. Add current entrypoints before the archived records.
const resourcesStart = html.indexOf('<details class="library-group" id="library-resources">');
const resourcesEnd = html.indexOf('</details>', resourcesStart);
let resources = html.slice(resourcesStart, resourcesEnd);
resources = resources.replace('คู่มือฉบับอ่านง่าย normative patch, skill ใช้ซ้ำ บันทึกการส่งมอบ SEO gate และตัวช่วยให้เครื่องค้นพบ', 'ไฟล์กติกาปัจจุบันสำหรับ Project Source คู่มือและ assets พร้อมบันทึก release และเอกสารเดิม');
resources = resources.replace('Human-readable master, normative patch, reusable skill, release records, SEO gate, and machine-discovery aid.', 'Current Project Source rules, guide and assets, release records, and preserved history.');
resources = resources.replace('<span class="library-count">10 records + gates</span>', `<span class="library-count">${bi('ปัจจุบัน + ประวัติ', 'Current + history')}</span>`);
resources = resources.replace(/<p class="library-content-intro" data-th>[\s\S]*?<\/p>/, `<p class="library-content-intro" data-th>งานปัจจุบันใช้ชุด v0.9.7-owner.1 ที่เจ้าของอนุมัติ พร้อม color-srgb-10 คู่มือแบรนด์และ assets ใช้งานจริง เอกสาร 0.9.1 ด้านล่างยังอยู่ครบในฐานะประวัติและรากฐาน ไม่ใช่ชุดสีปัจจุบัน ตัวอย่างในหน้าไม่ใช่หลักฐานของเมืองหรือผลิตภัณฑ์</p>`);
resources = resources.replace(/<p class="library-content-intro" data-en>[\s\S]*?<\/p>/, `<p class="library-content-intro" data-en>Current work uses the owner-approved v0.9.7-owner.1 distribution, color-srgb-10, brand guidance and ready assets. The complete 0.9.1 records remain below as history and foundations, not current color authority. Page examples are not city or product evidence.</p>`);
resources = resources.replace('<div class="resource-grid">', `<div class="resource-grid lds097-current-resources">
  <article><p class="resource-meta">CURRENT · DS 0.9.7 · ONE FILE</p><h5>${bi('Normative v0.9.7 ครบในไฟล์เดียว', 'Complete v0.9.7 normative in one file')}</h5><p>${bi('โครงเอกสาร 0.9.1 ที่อัปเดตทุกหมวดเป็น 0.9.7 รวมกฎแบรนด์ ภาพ motion ส่วนประกอบ และข้อมูลสำหรับเครื่องไว้ด้วยกัน เลือกไฟล์เดียวแล้วใช้ได้ทั้งคนและ AI', 'The 0.9.1 document structure, updated throughout to 0.9.7. Brand, visuals, motion, components and exact machine data are consolidated for people and AI.')}</p><a class="download-action" href="normative/Landometer-Design-System-v0.9.7.md" id="resource-project-sources" download>${bi('ดาวน์โหลด normative v0.9.7 · ไฟล์เดียว', 'Download v0.9.7 normative · one file')}</a><p><a href="normative/Landometer-Design-System-v0.9.7.json" download>${bi('JSON สำหรับเครื่อง', 'Machine JSON')}</a> · <a href="project-source-0.9.7.md">${bi('วิธีติดตั้ง LDS + Add-on', 'LDS + Add-on setup')}</a></p><p><a href="normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.7.md" download>ijji Add-on</a> · <a href="normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md" download>CityChat Add-on</a> · <a href="normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.7.md" download>CityWiki Add-on</a> ${bi('Add-on แยกไฟล์ · ใช้คู่กับ LDS ฉบับเต็ม', 'Separate Add-ons · use alongside the complete LDS')}</p></article>
  <article id="v097-identity-clarification"><p class="resource-meta">CURRENT · DS 0.9.7 · r1</p><h5>${bi('สี wordmark และพื้นหลังโลโก้', 'Wordmark colour and logo backgrounds')}</h5><p>${bi('Wordmark เปลี่ยนสีได้ รวมถึงตัวอักษรละสี โดยคงรูปทรงและสัดส่วน สีเทาเป็นตัวเลือก โลโก้ใช้ได้ทั้งพื้นสว่างและมืดเมื่อชื่อและสัญลักษณ์เห็นชัด ปัญหาบน Brand Blue ให้พิจารณาเฉพาะคู่นั้น กฎ full/quiet ของ motif ไม่ใช่ข้อห้ามพื้นมืดของโลโก้ทางการ', 'Wordmark colours may change, including per-letter colours, while preserving letterforms and proportions. Gray is optional. Official logos may appear on readable light or dark backgrounds. Assess Brand Blue for the actual pairing; motif full/quiet rules do not ban official logos on dark backgrounds.')}</p><p><a href="normative/Landometer-Design-System-v0.9.7.md">${bi('อ่าน LOGO-01 ใน normative ฉบับปัจจุบัน', 'Read LOGO-01 in the current normative')}</a></p></article>
  <article><p class="resource-meta">CURRENT · DS 0.9.7 · OWNER-APPROVED · UNSIGNED</p><h5>${bi('คู่มือและเสียงแบรนด์ปัจจุบัน', 'Current guide and brand voice')}</h5><p>${bi('เสียงแบรนด์ ภาพ และรายละเอียดที่สืบทอดรวมอยู่ใน normative ปัจจุบันแล้ว', 'Brand voice, visuals and retained detail are integrated into the current normative.')}</p><p><a href="normative/Landometer-Design-System-v0.9.7.md">${bi('อ่านกติกาแบรนด์ฉบับสมบูรณ์', 'Read the complete brand rules')}</a></p></article>
  <article><p class="resource-meta">CURRENT · MACHINE + ASSETS</p><h5>${bi('สี ฟอนต์ โลโก้ และชุดสร้างงาน', 'Colors, fonts, logos and build kit')}</h5><p><a href="${packagePath}/machine/release.json">Release identity</a> · <a href="${packagePath}/machine/color-srgb-10.tokens.json">Colors</a> · <a href="${packagePath}/machine/color-srgb-10.scales.json">Scales</a> · <a href="${packagePath}/machine/lds-0.9.7.tokens.dtcg.json">Design tokens</a> · <a href="${packagePath}/build-kit/lds-0.9.7.css">Web CSS</a></p></article>
  <article><p class="resource-meta">CURRENT · INSTALL + VERIFY</p><h5>${bi('ติดตั้งและส่งต่อให้ทีม', 'Install and share with the team')}</h5><p><a href="https://github.com/montri-th/Landometer/releases/tag/v0.9.7">${bi('ดาวน์โหลดแพ็กเกจที่ล็อกเวอร์ชัน', 'Download the pinned package')}</a> · <a href="team-setup.md">${bi('คู่มือเปิดใช้แต่ละแพลตฟอร์ม', 'Platform activation guide')}</a> · <a href="site-manifest.json">${bi('บันทึกไฟล์หน้าเว็บปัจจุบัน', 'Current site receipt')}</a></p><p>${bi('การติดตั้งของคนหนึ่งไม่ยืนยันว่าทั้งทีมเปิดใช้แล้ว', 'One installation does not establish activation for the whole team.')}</p></article>
</div><h4>${bi('เอกสารเดิมและประวัติจาก 0.9.1', 'Preserved 0.9.1 documents and history')}</h4><p>${bi('คงชื่อรุ่น วันที่ checksum และขอบเขตเดิมไว้ เพื่อให้ตรวจย้อนกลับได้', 'Original versions, dates, checksums and boundaries remain unchanged for traceability.')}</p><div class="resource-grid lds097-historical-resources" data-resource-scope="historical">`);
resources = resources.replaceAll('OWNER-APPROVED · MARKDOWN · 0.9.1-R8', 'HISTORICAL · OWNER-APPROVED · MARKDOWN · 0.9.1-R8');
resources = resources.replaceAll('MACHINE-READABLE · RELEASE CONTEXT', 'HISTORICAL · MACHINE-READABLE · 0.9.1 RELEASE CONTEXT');
resources = resources.replaceAll('ACCEPTED · ARTIFACT APPLICATION RECORD', 'HISTORICAL · ACCEPTED 0.9.1 APPLICATION RECORD');
resources = resources.replaceAll('PINNED BUILD · STANDALONE HTML', 'HISTORICAL · PINNED 0.9.1 STANDALONE');
resources = resources.replaceAll('งานใหม่ให้ยึด normative release 0.9.1-r8', 'งานใหม่ให้ยึดชุด v0.9.7-owner.1');
resources = resources.replaceAll('New work follows normative release 0.9.1-r8.', 'New work follows v0.9.7-owner.1.');
html = html.slice(0, resourcesStart) + resources + html.slice(resourcesEnd);

html = html.replaceAll('color-srgb-05 retained · artifact build ui-20260902-08', `color-srgb-10 · artifact build ${build}`);
html = html.replace('href="../site-manifest.v0.9.1.json" id="manifest-link">Manifest 2.1 · v0.9.1', 'href="site-manifest.json" id="manifest-link">Site receipt · v0.9.7');
html = html.replaceAll('owner-approved DS 0.9.7 · conceptual examples bounded', 'owner-approved DS 0.9.7 · unsigned distribution · conceptual examples bounded');
html = html.replaceAll('Landometer DS v0.9.1 reference · conceptual examples · ', 'Landometer DS v0.9.7 reference · conceptual examples · ');
html = html.replace('</body>', '  <script src="data.js"></script>\n  <script src="base-render.js"></script>\n  <script src="render.js"></script>\n  <script src="embedded-atlas.js"></script>\n  <script src="full-guide.js"></script>\n</body>');
// Opening/closing the fixed menu must not scroll the underlying section.
html = replaceRequired(html, 'firstControl.focus()', 'firstControl.focus({ preventScroll: true })');
html = replaceRequired(html, 'navMenuToggle.focus()', 'navMenuToggle.focus({ preventScroll: true })');
html = html.replace('href="full-guide.css"', 'href="full-guide.css?build='+build+'"');
html = '<!-- Generated by tools/build-lds097-full-guide.mjs from immutable 0.9.1 guide and verified 0.9.7 registries. -->\n' + html;
html = html.replace(/\n[ \t]+\n<!-- COLOR_ATLAS_END -->/, '\n\n<!-- COLOR_ATLAS_END -->');
html=html.replaceAll('ไม่มีการ mint Color Set ใหม่ใน UI revision นี้','รุ่นนี้ใช้ color-srgb-10 โดยปรับเฉพาะสเกลทางเดียว 14 ชุดจาก 0.9.5')
 .replaceAll('This UI revision does not mint a new Color Set.','This release introduces color-srgb-10, changing only the fourteen sequential families from 0.9.5.')
 .replaceAll('เปิด Color Atlas ที่คงเดิม','เปิด Color Atlas ฉบับปัจจุบัน')
 .replaceAll('Open the retained Color Atlas','Open the current Color Atlas');
// The owner's 0.9.7 choice retains original colour values on both themes.
// Replace superseded 0.9.6 release teaching after the retained guide is assembled.
const currentCopy = [
  ['คงคู่มือและกฎครบจาก 0.9.5 พร้อม gradient ทางเดียว 14 ชุดที่ใช้หัว–กลาง–ท้ายต่างเฉดชัดเจน เช่น ครีม → เขียว → ฟ้าในธีมสว่าง แต่ละธีมใช้ช่วงความสว่างของตน', 'คงคู่มือแบรนด์ ภาษา ภาพ และ motion ครบ เพิ่ม Story 17 สีเสริม สเกลข้อมูล 20 ตระกูล และ Location Intelligence ทั้งสองธีมใช้สีต้นฉบับเดียวกัน'],
  ['The complete 0.9.5 guide and rules continue here, with fourteen sequential families built from three distinct hue anchors. Light and dark tables share each metric’s meaning and class intervals.', 'The complete brand, voice, visual and motion handbook continues here, with 17 Story supporting colours, 20 analytical families and a separate Location Intelligence profile. Both themes use the same original colour values.'],
  ['คงเสียงแบรนด์ ภาพ ฟอนต์ identity และ motif/animation ตลอดจนสีหมวดหมู่ สเกลสองทาง และ gradient บรรยากาศจาก 0.9.5 ปรับเฉพาะ 14 สเกลทางเดียวให้สีกลางเป็นอีกเฉดชัดเจน โดยยังไล่ความสว่างทางเดียว', 'คงเสียงแบรนด์ ภาพ ฟอนต์ identity และ motif/animation ตลอดจนสีหมวดหมู่และ gradient บรรยากาศ ปรับสเกลข้อมูลตาม Story และใช้ HEX/LUT เดิมบนทั้งสองพื้นหลัง ไม่กลับทิศทางค่า'],
  ['The 0.9.5 voice, visuals, fonts, identity, motif/animation, categorical colors, diverging scales and atmosphere recipes remain. Only the fourteen sequential families gain a distinct midpoint hue while preserving monotonic lightness.', 'Voice, visuals, fonts, identity, motif/animation, categorical colours and atmosphere recipes remain. Story analytical scales use identical HEX/LUT values and value direction on both backgrounds.'],
  ['สเกลทางเดียว 14 ชุดใช้สีหัว–กลาง–ท้ายต่างเฉดใน Color Atlas; ธีมสว่างเริ่มด้วยครีม #F2F1DF ส่วนธีมมืดใช้ช่วงสว่างของตน สเกลสองทาง หมวดหมู่ แบรนด์ ภาษา ภาพ และ motif/animation สืบทอดจาก 0.9.5', 'Story มี 14 สเกลทางเดียวและ 6 สเกลสองทาง สีหัว–กลาง–ท้ายมีหน้าที่ชัดเจน ธีมมืดใช้สีเดิมทั้งหมดและคงทิศทางค่า ใช้ขอบ ป้ายชื่อ และพื้นรองเมื่อค่าสีใกล้พื้น'],
  ['Fourteen sequential families use distinct start, midpoint and end hues. Light themes begin with cream #F2F1DF; dark themes retain their own luminance range. Diverging scales, categories, brand, voice, visuals and motif/animation are retained from 0.9.5.', 'Story provides fourteen sequential and six diverging families with explicit anchor roles. Dark mode uses identical colours and value direction. Use boundaries, labels and backing surfaces where fills approach the background.'],
  ['รุ่นนี้ใช้ color-srgb-10 โดยปรับเฉพาะสเกลทางเดียว 14 ชุดจาก 0.9.5', 'รุ่นนี้ใช้ color-srgb-10 พร้อม Story และ Location Intelligence; สีข้อมูลเหมือนกันทั้งสองธีม'],
  ['This release introduces color-srgb-10, changing only the fourteen sequential families from 0.9.5.', 'This release introduces color-srgb-10, Story and Location Intelligence, with identical data colours on both themes.'],
  ['color-srgb-10 · 14 three-color sequential families · warm density · exact light/dark tables', 'color-srgb-10 · Story · Location Intelligence · exact theme-invariant colours'],
  ['built-area gold', 'built-form gold (declare footprint, height or coverage)']
];
for (const [before, after] of currentCopy) html = html.replaceAll(before, after);
const storyIntro = `<section class="lds097-integration" id="story-location-current"><div class="container"><div class="section-heading"><p class="eyebrow">STORY + LOCATION INTELLIGENCE · 0.9.7</p><h2>${bi('สีเดิมบนทุกพื้น ความหมายตรงกันทุกเครื่องมือ', 'The same colours on every background; consistent meaning across tools')}</h2><p>${bi('17 สีเสริม · 20 ตระกูลข้อมูล · 16 บทบาท Location · 12 metric scales · 4 SWOT evidence lenses ไม่มี gradient อัตโนมัติ', '17 supporting colours · 20 analytical families · 16 Location roles · 12 metric scales · 4 SWOT evidence lenses without automatic gradients')}</p><p><a href="color-atlas.html">${bi('เปิด Story Color Atlas', 'Open Story Color Atlas')}</a> · <a href="location/">${bi('เปิด Location Intelligence', 'Open Location Intelligence')}</a></p><p><a href="normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md" download>${bi('ดาวน์โหลด Location Profile ใช้คู่กับ LDS ฉบับเต็ม', 'Download the separate Location Profile to use with the full LDS base')}</a></p></div></div></section>`;
html = html.replace('<section class="lds097-integration"', storyIntro + '<section class="lds097-integration"');
emit(join(site, 'index.html'), html);
console.log(`Full DS 0.9.7 guide ${checkOnly ? 'matches deterministic build' : 'restored'} from ${sourceHash}; ${Buffer.byteLength(html)} bytes; ${scales.scales.length} current analytical records.`);
