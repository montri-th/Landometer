#!/usr/bin/env node
// Static preservation checks complement, but do not replace, rendered interaction review.
import {readFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(join(root, path), 'utf8');
const original = read('deployment/index.v0.9.1.html');
const html = read('deployment/v0.9.7/index.html');
const standaloneAtlas = read('deployment/v0.9.7/color-reference.html');
const failures = [];
let checks = 0;
const check = (value, label) => { checks++; if (!value) failures.push(label); };
const hash = source => createHash('sha256').update(source).digest('hex');
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Deliberately pinned to the retained hosted ui-20260902-08 source. New guide
// builds may derive from it; an edit to the archive is never silently accepted.
check(hash(original) === '1581689d4b0beee36eed53559f6df19f4cff74d06632d4ea2c878b94a7666e7b', 'original v0.9.1 hosted source is byte-preserved');
const packageRelease = read('plugins/landometer-design-system/assets/lds-0.9.7/machine/release.json');
const packageIdentity = JSON.parse(packageRelease).release;
check(packageIdentity.dsVersion === '0.9.7' && packageIdentity.releaseRef === 'v0.9.7-owner.1' && packageIdentity.colorSetId === 'color-srgb-10', 'standalone packaging retains approved design/color identity');
check(packageIdentity.signatureStatus === 'unsigned' && packageIdentity.signedRelease === false, 'standalone packaging does not inherit a cryptographic signature');
check(read('deployment/v0.9.7/package/assets/lds-0.9.7/machine/release.json') === packageRelease, 'website serves exact current package metadata');

function element(source, id) {
  const start = new RegExp(`<([a-z][\\w:-]*)\\b[^>]*\\bid=["']${escape(id)}["'][^>]*>`, 'i').exec(source);
  return balancedElement(source, start);
}
function atlasFamily(source, family) {
  const start = new RegExp(`<(section)\\b[^>]*class="atlas-family atlas-family--${escape(family)}"[^>]*>`, 'i').exec(source);
  return balancedElement(source, start);
}
function balancedElement(source, start) {
  if (!start) return null;
  const tag = start[1];
  if (['input', 'img', 'link', 'meta', 'br', 'hr'].includes(tag.toLowerCase())) return start[0];
  const pattern = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  pattern.lastIndex = start.index + start[0].length;
  let depth = 1, match;
  while ((match = pattern.exec(source))) {
    depth += /^<\//.test(match[0]) ? -1 : /\/>$/.test(match[0]) ? 0 : 1;
    if (depth === 0) return source.slice(start.index, pattern.lastIndex);
  }
  return null;
}
function firstTagged(source, tag, predicate) {
  const start = [...(source ?? '').matchAll(new RegExp(`<(${tag})\\b[^>]*>`, 'gi'))].find(match => predicate(match[0]));
  return balancedElement(source ?? '', start);
}
function text(source) {
  return (source ?? '').replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([a-f\d]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}
const inlineHex = source => [...(source ?? '').matchAll(/style="([^"]*)"/g)]
  .map(match => match[1]).flatMap(value => value.match(/#[\da-f]{6}\b/gi) ?? []).map(value => value.toUpperCase());
function normalizePermittedIdentity(value) {
  // Only release receipts and copy-template dates may change inside preserved
  // lessons. Color modules, the hero, resource cards and historical QA labels
  // are tested separately rather than hidden behind broad text substitutions.
  return value.replace(/v?0\.9\.(?:1(?:-r8|-mp7)?|7(?:-owner\.1)?)/g, '<current-release>')
    .replace(/color-srgb-(?:05|10)/g, '<current-color-set>')
    .replace(/2026-(?:09-02|10-01)/g, '<release-date>')
    .replace(/(?:ui-20260902-08|ui-20261002-lds097-r6)/g, '<current-site-build>');
}
// Reviewed corrections to inherited motion policy and current source receipts.
// Apply only to the expected historical text. Applying these to both sides
// would accidentally accept a page that had kept the obsolete instructions.
const retainedTextCorrections = [
  ['Landometer Design System 0.9.1-r8 · 1 Sep 2026', 'Landometer Design System 0.9.7-owner.1 · 1 Oct 2026'],
  ['คู่มืออ้างอิงที่เจ้าของอนุมัติ · 0.9.1-r8 · 1 ก.ย. 2569', 'ชุด 0.9.7 ที่เจ้าของอนุมัติ · 1 ต.ค. 2569 · ไม่มีลายเซ็นดิจิทัลใหม่'],
  ['Owner-approved reference · 0.9.1-r8 · 1 Sep 2026', 'Owner-approved 0.9.7 distribution · 1 Oct 2026 · unsigned'],
  ['slow reveal ครั้งเดียว', 'supporting content แบบคงที่'],
  ['one slow reveal', 'static supporting content'],
  ['reveal / settle / direct / disclosure / static · 760/920ms · once only · reduced motion and observer failure = final state', 'reveal / settle / direct / disclosure / static · 760/920ms ceilings · optional approach replays on re-entry, never while stationary · this guide uses static supporting content'],
  ['แสดงงานและคำตอบหลักทันที แล้วใช้ motion เพียงครั้งเดียวเพื่อพาสายตาไปที่สถานะ ความหมาย และสิ่งที่ทำต่อ โหมด reduced motion และ no-JavaScript ต้องเห็นความหมายสุดท้ายครบตั้งแต่ต้น', 'คำตอบและหลักฐานเห็นได้ทันที Approach ของส่วนสนับสนุนอาจเล่นเมื่อเข้าจอและกลับเข้าจอ โดยไม่วนขณะอยู่นิ่ง; reduced motion, no-JavaScript และ runtime failure แสดงผลสุดท้ายทันที หน้านี้ใช้ supporting content แบบคงที่; motion lab เล่นเมื่อผู้ใช้สั่ง'],
  ['The object and answer remain immediate. Motion may then clarify status, meaning, and the next action once. Reduced-motion and no-JavaScript states expose the complete final meaning immediately.', 'Answers and evidence stay immediate. Supporting approach motion may replay on viewport re-entry, never while stationary; reduced motion, no JavaScript and runtime failure expose the final state immediately. Supporting content on this guide is static; the motion lab runs on request.'],
  ['Reveal 400ms', 'Reveal 640ms'],
  ['เรียงหลักฐานหรือลำดับการอ่านหนึ่งครั้ง', 'จังหวะสนับสนุนตามสถานะจริง ไม่ซ่อนหลักฐาน'],
  ['Evidence or reading order, once', 'Supporting state change; never hide evidence'],
  ['ห้าม bounce, pulse ซ้ำ, shimmer, orbit, parallax, animation โลโก้/ภาพสารคดี, generic scroll reveal หรือเล่น hero ซ้ำเมื่อกลับมา', 'ห้าม motion อัตลักษณ์ที่ไม่อยู่ในทะเบียน, ambient loop ไร้ขอบเขต, parallax หรือการซ่อนหลักฐานไว้หลัง animation งาน identity และ motif ต้องใช้ runtime กับ lifecycle ที่อนุมัติไว้ใน MOTION-04 และ MOTIF-01…06'],
  ['No bounce, repeated pulse, shimmer, orbit, parallax, animated logo/documentary photo, generic scroll reveal, or replayed hero on return.', 'No unregistered identity animation, unbounded ambient loops, parallax, or evidence hidden behind animation. Identity and motifs follow the approved runtime and lifecycle in MOTION-04 and MOTIF-01…06.']
];
const correctedHistoricalText = source => retainedTextCorrections.reduce((value, [before, after]) => value.replaceAll(before, after), text(source));

const requiredIds = [
  'main', 'top', 'hero-title', 'v091-additions', 'play', 'panel-dna', 'panel-voice', 'panel-visual',
  'align', 'takeaway', 'v090-additions', 'implementation-library', 'complete-color-atlas',
  'library-color', 'library-foundations', 'library-components', 'library-dataviz',
  'library-experience', 'library-products', 'library-resources',
  'v091-layers', 'v091-parity', 'v091-calm-nav', 'v091-format', 'v091-incompatibility', 'v091-rejected-motion',
  'work-select', 'view-baseline', 'view-assisted', 'lens-dna', 'lens-voice', 'lens-visual',
  'surface-measure', 'surface-ground', 'surface-cultivate', 'stage-select',
  'check-1', 'check-2', 'check-3', 'check-4', 'check-5', 'copy-recipe', 'recipe-text', 'copy-status',
  'theme-cycle', 'language-cycle', 'nav-menu-toggle', 'nav-panel',
  'foundation-opportunity-gallery-title', 'component-ensembles-title', 'citymeter-chart-gallery-title',
  'dataviz-opportunities-title', 'intent-cases-title', 'motion-pattern-title', 'cta-pattern-title',
  'ethical-loop-title', 'external-discovery-title', 'seo-ai-gate-title', 'closing-title'
];
for (const id of requiredIds) check(Boolean(element(html, id)), `retained guide section or control ${id}`);
// The new integration examples do not have the numbered badge/visual slots of
// v091-chapter. Reusing that named grid caused overlapping headings and copy.
const integration = element(html, 'v097-integration') ?? '';
check(Boolean(integration) && Boolean(element(integration, 'v097-integration-title')), 'integration section and heading remain present');
const integrationClasses = [...integration.matchAll(/\bclass="([^"]*)"/g)].flatMap(match => match[1].split(/\s+/));
check(!integrationClasses.some(name => /^v091-chapter(?:__|--|$)/.test(name)), 'integration examples cannot inherit the numbered v091 chapter grid');
for (const [id, kind, headings] of [
  ['v097-evidence', 'evidence', ['ตัวเลขกับสถานะต้องตรงกันทั้งคนและเครื่องมือ', 'People and machines read the same value state']],
  ['v097-motion', 'motion', ['คงหลักฐานให้อ่านได้ และใช้ motion ตามหน้าที่', 'Keep evidence readable and give motion a job']]
]) {
  const article = element(integration, id) ?? '';
  check(/^<article\b/.test(article) && article.includes(`lds097-integration__chapter--${kind}`), `integration ${kind} uses its independent article layout`);
  const heading = firstTagged(article, 'h3', () => true);
  check(headings.every(value => text(heading).includes(value)), `integration ${kind} retains both language headings`);
}
const evidenceRows = [...integration.matchAll(/<tr\b[^>]*data-evidence-state="([^"]+)"[^>]*data-value="([^"]+)"/g)];
check(evidenceRows.length === 6 && new Set(evidenceRows.map(row => row[1])).size === 6, 'integration retains six distinct evidence states');
for (const state of ['measured', 'measured_zero', 'no_data', 'out_of_scope', 'suppressed', 'not_yet']) {
  const row = evidenceRows.find(candidate => candidate[1] === state), value = row?.[2];
  check(state === 'measured' ? value !== undefined && Number.isFinite(Number(value)) && Number(value) !== 0 : state === 'measured_zero' ? value === '0' : value === 'null', `integration evidence value contract ${state}`);
}
// These bounded override checks guard the owner's selected-state preference.
// Actual cascade, focus visibility and narrow/desktop geometry are reviewed
// in the browser; this is deliberately not a CSS layout simulator.
const guideOverrides = read('deployment/v0.9.7/full-guide.css').replace(/\/\*[\s\S]*?\*\//g, '');
const identityClarification=element(html,'v097-identity-clarification');
check(text(identityClarification).includes('Wordmark เปลี่ยนสีได้ รวมถึงตัวอักษรละสี')&&text(identityClarification).includes('Official logos may appear on readable light or dark backgrounds.'),'current owner identity clarification is visible in Thai and English');
check(html.includes('href="full-guide.css?build=ui-20261002-lds097-r6"'), 'current guide loads navigation and integration overrides');
for (const state of ['page', 'location']) {
  const rules = [...guideOverrides.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(rule => rule[1].split(',').some(selector => selector.trim() === `.nav-panel a[aria-current="${state}"]`));
  const shadows = rules.flatMap(rule => [...rule[2].matchAll(/(?:^|;)\s*box-shadow\s*:\s*([^;]+)/g)].map(match => match[1].trim()));
  check(shadows.at(-1) === 'none', `current navigation ${state} has no decorative inset-shadow override`);
}
check(/@media\s*\(\s*min-width\s*:\s*981px\s*\)\s*\{\s*\.lens-list\s+button\[aria-selected="true"\]\s*\{[^}]*\bborder-left-width\s*:\s*0\s*(?:;|})/.test(guideOverrides), 'desktop selected lens removes the inherited left rail without changing mobile borders');
for (const group of ['color', 'foundations', 'components', 'dataviz', 'experience', 'products', 'resources']) {
  check(element(html, `library-${group}`)?.startsWith('<details') && Boolean(element(html, `library-${group}-toggle`)), `retained expandable library group ${group}`);
}
const exactTextIds = [
  'play', 'align', 'takeaway',
  'v091-layers', 'v091-parity', 'v091-calm-nav', 'v091-format', 'v091-incompatibility', 'v091-rejected-motion',
  'library-components', 'library-dataviz', 'library-experience', 'library-products'
];
for (const id of exactTextIds) {
  const before = normalizePermittedIdentity(correctedHistoricalText(element(original, id)));
  const after = normalizePermittedIdentity(text(element(html, id)));
  check(before.length > 100 && before === after, `preserved complete non-color lesson text ${id}`);
}
for (const phrase of ['Let us cultivate our city with data.', 'Measure What Matters. Make It Actionable.']) {
  check(text(html).includes(phrase) || html.includes(`aria-label="${phrase}"`), `protected brand wording ${phrase}`);
}
for (const lens of ['dna', 'voice', 'visual']) {
  check(element(html, `lens-${lens}`)?.includes(`aria-controls="panel-${lens}"`), `retained ${lens} tab relationship`);
  check(element(html, `panel-${lens}`)?.includes(`aria-labelledby="lens-${lens}"`), `retained ${lens} panel relationship`);
}
const rootTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
for (const [attribute, value] of [
  ['data-ds-version', '0.9.7'], ['data-machine-package-identity', 'v0.9.7-owner.1'],
  ['data-color-registry', 'color-srgb-10'], ['data-artifact-build', 'ui-20261002-lds097-r6']
]) check(rootTag.includes(`${attribute}="${value}"`), `current guide metadata ${attribute}`);
check(!/data-(?:ds-version|authoring-revision|ruleset|machine-package-identity|color-registry)="[^"]*(?:0\.9\.1|color-srgb-05)/.test(rootTag), 'historical source identity is not current page authority');
check(/<link\b[^>]*rel="canonical"[^>]*href="https:\/\/montri-th\.github\.io\/Landometer\/v0\.9\.7\/"/.test(html), 'current guide canonical URL');
const atlas = element(html, 'complete-color-atlas') ?? '';
for (const family of ['identity', 'foundation', 'semantic', 'map', 'depth']) {
  const before = atlasFamily(original, family), after = atlasFamily(html, family);
  check(Boolean(after), `complete atlas retains non-analytical role group ${family}`);
  check(Boolean(before) && normalizePermittedIdentity(text(before).replace('แสดงเพื่ออ้างอิงไฟล์ asset เท่านั้น ห้ามสร้างใหม่ recolor หรือยกไปเป็น UI token แม้รหัสสีจะตรงกับสีอื่น', 'สีในสัญลักษณ์คงตามไฟล์ที่อนุมัติ ไม่ยกไปเป็น UI token ส่วน wordmark เปลี่ยนสีได้ รวมถึงตัวอักษรละสี โดยคงรูปทรงและสัดส่วน และตรวจให้อ่านได้บนพื้นจริง ตาม LOGO-01').replace('Asset reference only. Never rebuild, recolor, or promote these values into UI tokens—even when a hex value matches another role.', 'Keep symbol colours in the approved artwork; do not promote them into UI tokens. LOGO-01 permits wordmark recolouring, including per-letter colour, with letterforms and proportions preserved and readability checked on the actual background.')) === normalizePermittedIdentity(text(after)), `complete atlas preserves role guidance ${family}`);
  check(JSON.stringify(inlineHex(before)) === JSON.stringify(inlineHex(after)), `complete atlas preserves explicit non-analytical swatches ${family}`);
}
const sharedGradients = source => (atlasFamily(source, 'gradients') ?? '').split('<div class="atlas-subfamily">')[0];
check(text(sharedGradients(original)).length > 100 && text(sharedGradients(original)) === text(sharedGradients(html)), 'complete atlas retains all seven shared gradient jobs and guidance');
check(JSON.stringify(inlineHex(sharedGradients(original))) === JSON.stringify(inlineHex(sharedGradients(html))), 'complete atlas retains exact shared gradient swatches');
const productCards = source => [...source.matchAll(/<(article)\b[^>]*class="atlas-product-card"[^>]*>/g)]
  .map(start => balancedElement(source, start));
const originalProducts = productCards(original), currentProducts = productCards(html);
check(currentProducts.length === 4, 'complete atlas retains all four product color cards');
const currentProductTokens = JSON.parse(read('plugins/landometer-design-system/assets/lds-0.9.7/machine/color-srgb-10.tokens.json')).values.product;
for (const [product, themes] of Object.entries(currentProductTokens)) {
  const card = currentProducts.find(value => value.includes(`data-product="${product}"`)) ?? '';
  if (product === 'citywiki') {
    check(card.includes('data-scope="product-color-pair-preview"') && !card.includes('product.citywiki.gradient') && !card.includes('Product identity only'), 'CityWiki pair preview does not invent a normative gradient token or identity approval');
    check(text(card).includes('Illustrative primary/accent pairing') && text(card).includes('ยังไม่มีสูตร gradient อัตลักษณ์ CityWiki ที่อนุมัติ'), 'CityWiki illustrative scope is explicit in both languages');
    check(text(card).includes('Identity use requires an approved recipe and scope in the Add-on'), 'CityWiki identity-gradient use routes to an actual approved Add-on record');
  } else check(card.includes('data-scope="product-identity"') && card.includes('Product identity only'), `product identity boundary ${product}`);
  for (const theme of ['light', 'dark']) {
    const start = new RegExp(`<(figure)\\b[^>]*data-theme-surface="${theme}"[^>]*>`).exec(card);
    const figure = balancedElement(card, start) ?? '';
    const stops = themes[theme].map((hex, i, all) => `${hex} ${i * 100 / (all.length - 1)}%`).join(', ');
    check(figure.includes(`--atlas-gradient:linear-gradient(135deg, ${stops})`), `current product gradient ${product}/${theme}`);
    check(text(figure).includes(themes[theme].join(' → ')), `current product gradient labels ${product}/${theme}`);
  }
}
const citymeterCard = currentProducts.find(value => value.includes('data-product="citymeter"')) ?? '';
const retainedCitymeter = JSON.parse(read('deployment/assets/data/color-delivery.v0.9.0.json')).productIdentityGradients.citymeter;
check(JSON.stringify(retainedCitymeter) === JSON.stringify(currentProductTokens.citymeter), 'CityMETER retained approved recipe matches both current theme pairs exactly');
check(read('normative-patches/landometer-design-system-v0.9.0-product-identity-gradients.approval.yml').includes('citymeter: unchanged') && citymeterCard.includes('product-identity-gradients.approval.yml') && text(citymeterCard).includes('Retained approved identity recipe'), 'CityMETER identity claim is explicitly tied to its retained owner record');
check(text(atlas).includes('Product colors—identity recipes and pair previews') && text(atlas).includes('แยกสูตรอัตลักษณ์ที่อนุมัติแล้วออกจากตัวอย่างคู่สี'), 'product section distinguishes approved recipes from illustrative pairings in both languages');
check(!currentProducts.some(card => /<code>product\.[^.]+\.gradient<\/code>/.test(card)), 'product card labels do not invent current registry token paths');
const citychatProfile = JSON.parse(read('plugins/landometer-design-system/references/standalone-product-profiles/citychat.json')).identityGradient;
check(['light', 'dark'].every(theme => JSON.stringify(citychatProfile[theme]) === JSON.stringify(currentProductTokens.citychat[theme])), 'CityChat approved current Add-on recipe matches both theme previews');
const originalIjji = originalProducts.find(value => value.includes('product.ijji.gradient'));
const currentIjji = currentProducts.find(value => value.includes('data-product="ijji"'));
check(Boolean(currentIjji) && text(originalIjji).replace('product.ijji.gradient', 'สูตรอัตลักษณ์ที่อนุมัติ Approved identity recipe') === text(currentIjji) && JSON.stringify(inlineHex(originalIjji)) === JSON.stringify(inlineHex(currentIjji)), 'ijji cool identity and product-specific boundary remain unchanged');
const inlineAtlas = element(atlas, 'lds097-color-atlas') ?? '';
check(html.includes('<script src="atlas-locale.js"></script>'), 'embedded atlas follows the handbook language with a scoped display-only locale runtime');
check(/^<div\b[^>]*class="[^"]*\blds097-color-atlas\b/.test(inlineAtlas), 'approved atlas is integrated inline in the retained complete-atlas location');
check(!/<iframe\b/i.test(inlineAtlas) && !/<iframe\b[^>]*id="lds097-color-atlas"/.test(atlas), 'atlas uses normal page content without a nested scrolling frame');
for (const id of ['categories', 'library', 'scale-lab', 'atmospheres', 'review-notes']) {
  const expected = element(standaloneAtlas, id), actual = element(inlineAtlas, id);
  check(Boolean(expected) && actual === expected, `inline atlas preserves complete approved static section ${id}`);
}
check(!element(inlineAtlas, 'start') && !/<main\b|<nav\b/.test(inlineAtlas), 'inline atlas does not duplicate page introduction or navigation');
const staticHtml = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
const domIds = [...staticHtml.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
check(new Set(domIds).size === domIds.length, 'integrated guide has no duplicate DOM IDs');
const guideStyles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(match => match[1]).join('\n');
check(!/\.library-group(?:\[open\])?\s+summary\b/.test(guideStyles), 'outer library summary styles cannot reach nested atlas disclosures');
check(guideStyles.includes('.library-group > summary') && guideStyles.includes('.library-group[open] > summary'), 'outer library retains direct-child disclosure styling');
const currentRegistry = JSON.parse(read('plugins/landometer-design-system/assets/lds-0.9.7/machine/color-registry.json'));
const learningScales = element(html, 'color-data-scales') ?? '';
check(text(learningScales).includes('fourteen sequential and six diverging families') && !text(learningScales).includes('six sequential and three diverging'), 'retained learning fixture reports current family inventory');
check(text(learningScales).includes('it is not a fourth denominator') && text(learningScales).includes('ไม่ใช่ตัวหารที่สี่'), 'retained learning fixture separates built form from density denominators in both languages');
check(text(element(inlineAtlas, 'library')).includes('20 ตระกูล · 14 ทางเดียว + 6 สองทาง'), 'classic library heading names both current scale kinds');
const currentAliases = read('deployment/v0.9.7/guide-token-aliases.css');
for (const [family, names] of [['confidence', ['dataviz-seq-confidence-low', 'dataviz-seq-confidence-mid', 'dataviz-seq-confidence-high']], ['delta', ['dataviz-div-delta-side-a', 'dataviz-div-delta-neutral', 'dataviz-div-delta-side-b']]]) {
  const scale = currentRegistry.scales.find(record => record.id === family);
  names.forEach((name, i) => {
    const declaration = new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'gi');
    const inlineValues = [...guideStyles.matchAll(declaration)].map(match => match[1].toUpperCase());
    const aliasValues = [...currentAliases.matchAll(declaration)].map(match => match[1].toUpperCase());
    check(inlineValues.length === 2 && aliasValues.length === 2 && [...inlineValues, ...aliasValues].every(value => value === scale.themes.light.anchors[i] && value === scale.themes.dark.anchors[i]), `retained fixture has exact097 inline and themed values: ${name}`);
  });
}
const paintedBackgrounds = source => [...(source ?? '').matchAll(/style="background:(#[\da-f]{6})"/gi)].map(match => match[1].toUpperCase());
for (const scale of currentRegistry.scales) {
  const card = element(inlineAtlas, `family-${scale.id.replaceAll('.', '-')}`);
  check(Boolean(card), `inline atlas has analytical family ${scale.id}`);
  for (const theme of ['light', 'dark']) {
    const panel = firstTagged(card, 'div', opening => opening.includes(`data-sample-theme="${theme}"`) && opening.includes(`data-color-owner="${scale.id}"`));
    const ramp = firstTagged(panel, 'div', opening => /class="[^"]*\bsmall-ramp\b/.test(opening));
    check(JSON.stringify(paintedBackgrounds(ramp)) === JSON.stringify(scale.themes[theme].lut), `inline static 41-stop paint ${scale.id}/${theme}`);
  }
}
for (const variant of ['soft', 'vivid', 'light']) {
  const panel = firstTagged(inlineAtlas, 'article', opening => opening.includes(`data-variant-panel="${variant}"`) && opening.includes('data-palette-state="candidate"'));
  const stripe = firstTagged(panel, 'div', opening => /class="[^"]*\bcategory-stripe\b/.test(opening));
  const theme = variant === 'light' ? 'light' : 'dark', role = variant === 'vivid' ? 'vivid' : 'fill';
  check(JSON.stringify(paintedBackgrounds(stripe)) === JSON.stringify(currentRegistry.series.map(series => series[theme][role])), `inline static categorical ${theme}/${variant}`);
}
check(!atlas.includes('color-srgb-05'), 'current atlas does not reintroduce old color authority');
check(!html.includes('Current implementation authority is Landometer Design System 0.9.1-r8'), 'retained guidance does not claim obsolete current authority');
check(html.includes('normative/Landometer-Design-System-v0.9.7.md'), 'complete current human and machine normative is linked');
for (const addon of ['ijji-Add-on-v0.5.5-for-LDS-v0.9.7.md', 'CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md', 'CityWiki-Add-on-v1.0.0-for-LDS-v0.9.7.md']) check(html.includes(`normative/${addon}`), `separate product Add-on download is linked: ${addon}`);
check(!/normative\/(?:ijji|CityChat|CityWiki)-LDS-v0\.9\.7-standalone\.md/.test(html), 'resources do not prescribe combined product DS editions');
check(html.includes('package/assets/lds-0.9.7/machine/release.json'), 'current machine release is linked');
check(/historical|archiv|ประวัติ|เดิม|ย้อนหลัง/i.test(text(element(html, 'library-resources'))), 'retained resource records are visibly distinguished as historical');
check(/historical|archiv|ประวัติ|ย้อนหลัง/i.test(text(element(html, 'v090-additions'))), 'retained preflight results are labeled historical');

if (failures.length) {
  console.error(`DS 0.9.7 full guide preservation FAIL (${failures.length}/${checks} checks)`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`DS 0.9.7 full guide preservation PASS (${checks} checks; browser, native-copy and accessibility review remain separate)`);
