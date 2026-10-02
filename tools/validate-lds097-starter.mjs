#!/usr/bin/env node
import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const deployment=join(root,'deployment');
const path=join(deployment,'v0.9.7/examples/lds097-starter.html');
const html=readFileSync(path,'utf8');
let checks=0;
const assert=(condition,message)=>{checks++;if(!condition)throw Error(message);};
const origin='https://montri-th.github.io/Landometer/';
const sourceUrl=`${origin}v0.9.7/examples/lds097-starter.html`;
const localPath=url=>{assert(url.startsWith(origin),`Unpinned external asset: ${url}`);const p=join(deployment,decodeURIComponent(new URL(url).pathname.slice('/Landometer/'.length)));assert(!relative(deployment,p).startsWith('..'),`Asset escapes deployment: ${url}`);return p;};
assert(html.includes('data-ds-version="0.9.7"'),'Starter must declare the current DS version');
assert(html.includes('data-color-registry="color-srgb-10"'),'Starter must declare the exact current colour registry');
assert(html.includes('<title>Starter HTML · LDS 0.9.7 · Requires online assets</title>'),'Starter must disclose the online dependency in its title');
assert(!/0\.9\.[456]/.test(html),'A current starter must not expose an obsolete version or stylesheet');
assert(html.includes('build-kit/lds-0.9.7.css'),'Current build-kit entrypoint missing');
assert(html.includes('preserve its asset folders'),'Offline instructions must retain dependency paths');
const stylesheet=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match=>match[1]);
assert(stylesheet.length===1,'Starter should have one governed stylesheet entrypoint');
assert(stylesheet[0]===`${origin}v0.9.7/package/assets/lds-0.9.7/build-kit/lds-0.9.7.css`,'The download must use an absolute version-pinned stylesheet URL');
const visited=new Map();
const readAsset=(url)=>{
  if(visited.has(url))return;
  const path=localPath(url);assert(existsSync(path),`Missing dependency: ${url}`);assert(statSync(path).isFile()&&statSync(path).size>0,`Empty dependency: ${url}`);
  visited.set(url,{path,bytes:statSync(path).size});
  if(!url.endsWith('.css'))return;
  const css=readFileSync(path,'utf8');
  for(const [,value]of css.matchAll(/@import\s+["']([^"']+)["']/g))readAsset(new URL(value,url).href);
  for(const [,value]of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))if(!value.startsWith('data:'))readAsset(new URL(value,url).href);
};
stylesheet.forEach(readAsset);
for(const [,href]of html.matchAll(/<link rel="icon"[^>]* href="([^"]+)"/g))readAsset(href);
const assets=[...visited.keys()];
assert(assets.some(url=>url.endsWith('/machine/color-srgb-10.production.css')),'Build kit must resolve the current production colours');
assert(assets.some(url=>url.endsWith('/build-kit/fonts.css')),'Build kit must load governed fonts');
assert(assets.some(url=>url.endsWith('/build-kit/lds-0.9.7-components.css')),'Component examples must bind the current component styles');
for(const font of ['arvo-latin-700-normal.woff2','ibm-plex-sans-thai-looped-thai-700-normal.woff2','bai-jamjuree-thai-400-normal.woff2','bai-jamjuree-latin-400-normal.woff2','jetbrains-mono-latin-400-normal.woff2'])assert(assets.some(url=>url.endsWith(font)),`Required typography dependency missing: ${font}`);
const allCss=assets.filter(url=>url.endsWith('.css')).map(url=>readFileSync(localPath(url),'utf8')).join('\n');
const inline=html.match(/<style>([\s\S]*?)<\/style>/)?.[1]||'';
const defined=new Set([...allCss.matchAll(/(--[\w-]+)\s*:/g)].map(match=>match[1]));
for(const name of new Set([...inline.matchAll(/var\((--[\w-]+)/g)].map(match=>match[1])))assert(defined.has(name),`Starter token is not defined by governed CSS: ${name}`);
assert(html.includes('class="lds-evidence-card" data-evidence="synthetic"'),'Evidence card must use its supplied class and declare synthetic evidence');
assert(html.includes('class="lds-table" data-evidence="synthetic"'),'Data table must use its supplied class and declare synthetic evidence');
for(const state of ['measured_zero','no_data'])assert(html.includes(`data-state="${state}"`),`Fixture must distinguish ${state}`);
assert(/data-state="measured_zero"[\s\S]*?class="lds-cell-glyph">0<\/span>/.test(html),'Explicit zero must remain visible');
assert(/data-state="no_data"[\s\S]*?No data/.test(html),'No data must have a textual label');
for(const id of ['language','theme'])assert(new RegExp(`<select id="${id}"`).test(html),`Accessible native ${id} selector missing`);
for(const lang of ['th','en'])assert((html.match(new RegExp(`lang="${lang}"`,'g'))||[]).length>=30,`Incomplete ${lang} presentation coverage`);
assert(html.includes('focus-visible'),'Keyboard focus must remain visible');
assert(!/<iframe|fetch\(|XMLHttpRequest|setInterval\(/.test(html),'Starter should remain a static document with optional presentation controls only');
for(const [,href]of html.matchAll(/<a[^>]*href="([^"]+)"/g)){
  const url=new URL(href,sourceUrl);
  if(url.href.startsWith(origin)&&!url.hash){const path=localPath(url.href);assert(existsSync(path.endsWith('/')?join(path,'index.html'):path),`Starter resource link missing: ${url.href}`);}
}
console.log(JSON.stringify({status:'PASS',checks,dependencyFiles:visited.size,fonts:assets.filter(url=>url.endsWith('.woff2')).length,scope:'Static current-version source, dependency closure, font and token resolution, bilingual content, explicit synthetic evidence and distinct zero/missing states. Render and browser behaviour require separate review.'},null,2));
