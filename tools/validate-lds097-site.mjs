#!/usr/bin/env node
import {readFileSync, statSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root = resolve(import.meta.dirname, '..'), site = join(root, 'deployment/v0.9.7');
const read = p => readFileSync(join(site, p), 'utf8');
const manifest = JSON.parse(read('site-manifest.json')), html = read('index.html');
const atlas = read('color-reference.html');
const storyHtml = read('color-atlas.html'), locationHtml = read('location/index.html');
let checks = 0;
const failures = [];
const check = (value, label) => { checks++; if (!value) failures.push(label); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
check(manifest.designSystemVersion === '0.9.7' && manifest.colorSetId === 'color-srgb-10', 'release identity');
check(manifest.packageId === 'v0.9.7-owner.1', 'current approved package identity');
check(manifest.artifactBuildId === 'ui-20261002-lds097-r8', 'full-guide website build identity');
const rootEntry = readFileSync(join(root, 'deployment/index.html'), 'utf8');
check(manifest.entrypointBuildId === 'root-20261002-lds097-r8' && rootEntry.includes(`data-artifact-build="${manifest.entrypointBuildId}"`), 'separate root navigation build identity');
const rootRedirect = rootEntry.match(/<script>([\s\S]*?)<\/script>/)?.[1];
for (const [search, hash] of [
  ['', ''], ['', '#library-resources'], ['?lang=en&theme=dark', ''],
  ['?lang=th&theme=dark&work=screen&view=assisted&lens=visual&surface=cultivate&stage=frame', '#library-resources'],
  ['?lang=en&theme=light&family=water&n=7', '#complete-color-atlas'],
  ['?note=%E0%B8%AA%E0%B8%B5%20%26%20scope', '#top']
]) {
  let destination;
  if (rootRedirect) vm.runInNewContext(rootRedirect, {location: {search, hash, replace: value => { destination = value; }}}, {timeout: 1000});
  check(destination === `v0.9.7/${search}${hash}`, `root retains complete query and section ${search}${hash}`);
}
check(/<noscript>\s*<meta\b[^>]*http-equiv="refresh"[^>]*content="0;url=v0.9.7\/"[^>]*>\s*<\/noscript>/.test(rootEntry), 'default no-JavaScript route remains available');
check(!/<meta\b[^>]*http-equiv="refresh"/.test(rootEntry.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')), 'default meta refresh cannot race the state-preserving script');
check(manifest.cryptographicSignature === 'not-claimed', 'truthful signature boundary');
check(manifest.artifactConformance === 'bounded-checks-only', 'bounded conformance claim');
const manifestPaths = manifest.assets.map(asset => asset.path);
check(new Set(manifestPaths).size === manifestPaths.length, 'manifest paths are unique');
for (const required of ['index.html', 'llms.txt', 'v0.9.7/index.html', 'v0.9.7/color-atlas.html', 'v0.9.7/project-source-0.9.7.md', 'v0.9.7/data.js', 'v0.9.7/scoped-atlas.css', 'v0.9.7/embedded-atlas.js', 'v0.9.7/full-guide.js', 'v0.9.7/guide-token-aliases.css']) {
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
  check(source.includes('data-ds-version="0.9.7"') && source.includes('data-color-registry="color-srgb-10"'), `${label}: visible release metadata`);
  check(!source.includes('127.0.0.1'), `${label}: no local canonical URLs`);
}
for (const id of ['start', 'categories', 'library', 'scale-lab', 'atmospheres']) {
  check(atlas.includes(`id="${id}"`), `atlas retains static content ${id}`);
}
check(html.includes('id="lds097-color-atlas"') && html.includes('class="lds097-color-atlas"'), 'full guide integrates current approved color atlas inline');
check(html.includes('id="resource-project-sources"') && html.includes('href="project-source-0.9.7.md"'), 'current Project Source download is visible');
const projectSources = read('project-source-0.9.7.md');
const documentSet = JSON.parse(read('normative/document-set.json'));
check(same(documentSet.documents.map(doc => doc.product), ['landometer', 'ijji', 'citychat', 'citywiki']), 'shared LDS base and three separate product Add-ons');
check(projectSources.includes('one file') && projectSources.includes('two files') && projectSources.includes('three files'), 'Project Source setup distinguishes base, product and optional profile installations');
check(!/ฉบับ ijji, CityChat และ CityWiki รวม LDS ครบแล้ว|four one-file editions|ไม่ต้องเพิ่ม LDS อีกไฟล์|เลือกและอัปโหลดเพียงหนึ่งไฟล์/.test(projectSources), 'Project Source setup does not claim product Add-ons contain the base');
check(!/ijji-LDS-v0\.9\.6-standalone|CityChat-LDS-v0\.9\.6-standalone|CityWiki-LDS-v0\.9\.6-standalone/.test(projectSources+html+manifestPaths.join(' ')), 'current resource links do not serve retired combined product editions');
const baseDocument = documentSet.documents.find(doc => doc.product === 'landometer');
const baseFile = baseDocument.files.find(file => file.path.endsWith('.md'));
check(baseDocument.kind === 'base' && baseFile.path === 'Landometer-Design-System-v0.9.7.md' && /^[a-f0-9]{64}$/.test(baseFile.sha256) && hash(readFileSync(join(site, 'normative', baseFile.path))) === baseFile.sha256 && documentSet.revision === 'standalone-0.9.7-r1', 'current r1 base download matches declared exact bytes');
check(!/Landometer%20Design%20System%20v0\.9\.4\.md|\]\([^)]*GUIDE\.md\)|\]\([^)]*BRAND\.md\)/.test(projectSources), 'Project Source setup has no legacy multi-file normative dependencies');
for (const doc of [...documentSet.documents,...documentSet.profiles]) {
  check(doc.kind === (doc.product === 'landometer' ? 'base' : doc.product === 'location-intelligence' ? 'profile' : 'addon'), `${doc.product}: base/Add-on classification`);
  if (doc.kind === 'addon') {
    const projection = JSON.parse(read(`normative/${doc.files.find(file => file.path.endsWith('.json')).path}`));
    check(projection.document.documentKind === 'addon' && projection.document.requiredNormativeFiles === 2 && projection.machine.baseDocument.path === baseFile.path && projection.machine.baseDocument.sha256 === baseFile.sha256, `${doc.product}: separate Add-on binds exact shared base`);
  }
  check(doc.files.length === 2 && doc.files.some(file => file.path.endsWith('.md')) && doc.files.some(file => file.path.endsWith('.json')), `${doc.product}: human and machine alternatives`);
  for (const file of doc.files) {
    const bytes = readFileSync(join(site, 'normative', file.path));
    check(bytes.length === file.bytes && hash(bytes) === file.sha256, `${doc.product}: standalone download parity ${file.path}`);
    check(projectSources.includes(`./normative/${file.path}`), `${doc.product}: setup links exact ${file.path}`);
    check(manifestPaths.includes(`v0.9.7/normative/${file.path}`) && manifestPaths.includes(`v0.9.7/package/assets/lds-0.9.7/normative/${file.path}`), `${doc.product}: live manifest covers both distributed paths ${file.path}`);
    const packaged = readFileSync(join(site, 'package/assets/lds-0.9.7/normative', file.path));
    check(bytes.equals(packaged), `${doc.product}: direct and packaged download bytes match ${file.path}`);
    if (file.path.endsWith('.md')) check(html.includes(`href="normative/${file.path}"`), `${doc.product}: visible direct normative download`);
  }
}
check(manifestPaths.includes('v0.9.7/normative/document-set.json'), 'live manifest covers normative document inventory');
const context = {window: {}};
vm.runInNewContext(read('data.js'), context, {timeout: 5000});
const D = context.window.LDS_CANDIDATE;
const colors = JSON.parse(read('package/assets/lds-0.9.7/machine/color-registry.json'));
check(D.designSystemVersion === '0.9.7' && D.colorSetId === 'color-srgb-10', 'runtime release identity');
const previousContext={window:{}};
vm.runInNewContext(readFileSync(join(root,'deployment/v0.9.6/data.js'),'utf8'),previousContext,{timeout:5000});
const previous=previousContext.window.LDS_CANDIDATE;
check(same(D.baseline.scales,previous.scales)&&same(D.baseline.series,previous.series),'comparison uses exact historical 0.9.6 records');
check(!D.previousDensity,'obsolete prototype density comparison is absent');
check(same(D.gradients,previous.gradients)&&same(D.foundation,previous.foundation)&&same(D.series.map(({id,name,cue,light,dark})=>({id,name,cue,light,dark})),previous.series.map(({id,name,cue,light,dark})=>({id,name,cue,light,dark}))), 'foundation, categorical and atmosphere values retained from 0.9.6');
for(const count of [3,5,7,9])check(atlas.includes(`data-count="${count}"`),`classic atlas provides ${count}-class inspection`);
for(const scale of D.scales){
  check(same(scale.themes.light.lut,scale.themes.dark.lut),`original same LUT both backgrounds ${scale.id}`);
  for(const theme of ['light','dark'])check([0,20,40].every((index,i)=>scale.themes[theme].lut[index]===scale.themes[theme].anchors[i]),`three exact anchors ${scale.id}/${theme}`);
}
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
const tokens = JSON.parse(read('package/assets/lds-0.9.7/machine/color-srgb-10.tokens.json')).values;
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
const styleSources = ['package/assets/lds-0.9.7/machine/color-srgb-10.production.css', 'lds/lds-0.9.4-ext.css', 'lds/lds-0.9.4-components.css', 'app.css', 'candidate.css'];
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
      for (const part of selectorList(selector)) check(/^\.lds097-color-atlas(?:$|[\s.#:\[>+~])/.test(part), `atlas selector is isolated: ${part}`);
    }
    cursor = end + 1;
  }
}
checkScopedRules(stripComments(scopedCss));
for (const family of ['density.area', 'density.capita', 'density.household', 'built']) {
  check(D.scales.find(scale => scale.id === family)?.warm === true, `warm density family ${family}`);
}
// The modern Story and Location interfaces must consume the exact release bytes.
function data(file,key){const c={window:{}};vm.runInNewContext(read(file),c,{timeout:5000});return c.window[key];}
const story=data('story-data.js','COLOR_STUDY'),location=data('location/location-data.js','LOCATION_STUDY');
const flat=JSON.parse(read('package/assets/lds-0.9.7/machine/color-srgb-10.scales.json'));
const li=JSON.parse(read('package/assets/lds-0.9.7/machine/location-intelligence-0.9.7.json'));
check(same(story.candidate.scales,flat.scales),'Story UI consumes all exact current records');
check(same(story.candidate.supportingPalette,colors.supportingPalette)&&colors.supportingPalette.length===17,'Story UI exposes all17 supporting values');
check(new Set(colors.supportingPalette.map(c=>c.id)).size===17,'supporting IDs are unique');
check(new Set(colors.supportingPalette.map(c=>c.hex)).size===17,'supporting HEX values are unique');
check(li.roles.length===16&&li.scales.length===24,'Location has16 roles and12 metrics across two themes');
for(const role of li.roles){const shown=location.colors.roles.find(r=>r.id===role.id);check(shown?.light.hex===role.light.hex&&shown?.dark.hex===role.dark.hex&&role.light.hex===role.dark.hex,`Location same role HEX ${role.id}`);}
for(const row of li.scales){const shown=location.colors.scales.find(r=>r.scaleId===row.scaleId&&r.theme===row.theme);check(same(shown?.lut41,row.lut)&&same(shown?.classes,row.classes)&&same(shown?.anchors,row.anchors),`Location exact LUT, anchors and classes ${row.scaleId}/${row.theme}`);}
check(li.semantics.metrics.filter(m=>m.useScale==='none').length===4,'four SWOT lenses have no automatic gradients');
for(const id of li.semantics.metrics.filter(m=>m.useScale==='none').map(m=>m.id))check(!li.scales.some(s=>s.scaleId===id),`SWOT evidence only ${id}`);
for(const file of ['color-atlas.html','location/index.html']){const source=read(file);check(source.includes('data-ds-version="0.9.7"')&&source.includes('data-color-registry="color-srgb-10"'),`modern metadata ${file}`);check(!source.includes('127.0.0.1')&&!source.includes('CANDIDATE'),`current public framing ${file}`);}
check(storyHtml.includes('Original colours')&&locationHtml.includes('Original HEX and LUT'),'original colour policy is visible');
check(!read('location/location-app.js').includes('Higher values become lighter'),'Location has no reversed dark direction');
check(!locationHtml.includes('adapt lightness and chroma'),'Location does not teach retired derivation');
check(html.includes('Location-Intelligence-Profile-for-LDS-v0.9.7.md')&&html.includes('id="atlas-location-lab"'),'full handbook embeds Location lab and links separate normative profile');
check(atlas.includes('color-interpolation-filters="linearRGB"'),'classic CVD simulation uses linearRGB');
check(storyHtml.includes('color-interpolation-filters="linearRGB"')&&html.includes('color-interpolation-filters="linearRGB"'),'modern CVD simulations use linearRGB');
for(const path of ['v0.9.7/color-reference.html','v0.9.7/story-data.js','v0.9.7/location/index.html','v0.9.7/location/location-data.js','v0.9.7/normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md'])check(manifestPaths.includes(path),`manifest covers new surface ${path}`);
// A shared pre-integration URL must resolve to the same controls in the main guide.
const redirect=read('location/location-entry.js');
for(const [search,hash,expectedFamily,expectedN,expectedVision,expectedHash] of [
 ['?lang=th&theme=dark&family=li.demand&n=9&vision=normal','#lab','li.demand','9','normal','#atlas-location-lab'],
 ['?lang=en&theme=light&family=li.service_gap&n=41&vision=gray&work=screen','#lab','li.service_gap','41','gray','#atlas-location-lab'],
 ['','#roles','li.demand','41','normal','#atlas-location-roles'],
 ['?family=unknown&n=100&vision=unknown','#scales','li.demand','41','normal','#atlas-location-scales']
]) {
 let destination;vm.runInNewContext(redirect,{URLSearchParams,location:{search,hash,replace:value=>{destination=value;}}},{timeout:1000});
 const url=new URL(destination,'https://montri-th.github.io/Landometer/v0.9.7/location/');
 check(url.pathname==='/Landometer/v0.9.7/'&&url.hash===expectedHash,'legacy Location route joins main guide');
 check(url.searchParams.get('liFamily')===expectedFamily&&url.searchParams.get('liN')===expectedN&&url.searchParams.get('liVision')===expectedVision,'legacy Location retains explicit valid controls or defaults41');
 for(const key of ['lang','theme','work']){const wanted=new URLSearchParams(search).get(key);if(wanted)check(url.searchParams.get(key)===wanted,'legacy Location retains '+key);}
 check(!['family','n','vision'].some(key=>url.searchParams.has(key)),'legacy query names do not collide with other labs');
}
check(locationHtml.includes('location-entry.js')&&!locationHtml.includes('src="location-app.js"'),'legacy entry forwards rather than displaying a second lab');
check(!locationHtml.includes('http-equiv="refresh"'),'legacy entry has no racing fixed meta redirect');
check(locationHtml.includes('href="../?liN=41#atlas-location-lab"'),'legacy no-JavaScript link reaches static primary41');

if (failures.length) {
  console.error(`DS 0.9.7 site FAIL (${failures.length}/${checks} checks)`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`DS 0.9.7 full guide + color atlas distribution PASS (${checks} checks; bounded static and exact-data checks)`);
