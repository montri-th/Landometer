#!/usr/bin/env node
// Scoped static gate. This is deliberately not a signed or full artifact conformance validator.
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyPackage} from './verify.mjs';
import {validateValueStates} from './value-state.mjs';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
try{
 const input=process.argv[2];if(!input||input.startsWith('--'))throw Error('Usage: node scripts/check-artifact.mjs page.html|style.css|governed-values.json [--json governed-values.json]');
 const pkg=verifyPackage();if(pkg.status!=='PASS')throw Error('Package validation failed: '+pkg.failed.map(f=>f.id).join(', '));
 const location=JSON.parse(readFileSync(resolve(ROOT,'assets/lds-0.9.7/machine/location-intelligence-0.9.7.json'),'utf8'));
 const locationColors=location.roles.flatMap(r=>[r.light.hex,r.dark.hex]).concat(location.scales.flatMap(r=>r.lut)).join(' ');
 const registeredScales=[...JSON.parse(readFileSync(resolve(ROOT,'assets/lds-0.9.7/machine/color-srgb-10.scales.json'),'utf8')).scales,...location.scales];
 const css=readFileSync(resolve(ROOT,'assets/lds-0.9.7/machine/color-srgb-10.production.css'),'utf8'),tokenText=readFileSync(resolve(ROOT,'assets/lds-0.9.7/machine/tokens.v0.9.7.json'),'utf8'),allowed=new Set((css+tokenText+locationColors).match(/#[0-9A-Fa-f]{6}\b/g).map(h=>h.toUpperCase()));
 const checked=new Set(),problems=[],warnings=[],colors=new Set();
 const inspect=path=>{path=resolve(path);if(checked.has(path))return;checked.add(path);if(!existsSync(path)){problems.push(`Missing referenced file: ${path}`);return;}const text=readFileSync(path,'utf8');
  for(const m of text.matchAll(/#[0-9a-fA-F]{3,8}\b/g)){let h=m[0].toUpperCase();if(h.length===4)h='#'+h.slice(1).split('').map(c=>c+c).join('');colors.add(h);if(!allowed.has(h))problems.push(`${path}: ungoverned color literal ${m[0]}`);}
  if(/--ldm-series-\d{1,2}-(?:light|dark)\b|--ldm-product-ijji-|--scale-density-(?:low|mid|high)\b/.test(text))problems.push(`${path}: prohibited legacy alias`);
  if(/\b(?:rgba?|hsla?|hwb|oklch|oklab|lab|lch|color|color-mix)\s*\(/i.test(text))problems.push(`${path}: unresolved color function; materialize an exact approved sRGB color or provide a separately governed compositing review`);
  if(/data-(?:lds-)?(?:scale|metric)[^>]*\batmosphere\b|data-(?:lds-)?(?:scale|metric)=["']atmosphere\./i.test(text))problems.push(`${path}: atmosphere is not a data scale`);
  if(/data-(?:lds-)?scale=["']([^"']+)["']/i.test(text)){for(const m of text.matchAll(/data-(?:lds-)?scale=["']([^"']+)["']/gi))if(!registeredScales.some(s=>s.scaleId===m[1]))problems.push(`${path}: unknown analytical family ${m[1]}`);}
  if(extname(path)==='.html'){const v=validateValueStates(text);problems.push(...v.problems.map(p=>`${path}: ${p}`));if(/<script\b/i.test(text))warnings.push(`${path}: scripts require rendered review; static scanning does not prove runtime color or accessible-alternative parity`);}
  const deps=[...text.matchAll(/<link\b[^>]*href=["']([^"']+\.css(?:\?[^"']*)?)["']/gi),...text.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/gi)];
  for(const m of deps){const target=m[1];if(/^(?:https?:|\/\/|data:)/.test(target))problems.push(`${path}: external stylesheet is not inspected (${target}); vendor and hash it locally`);else inspect(resolve(dirname(path),target.split(/[?#]/)[0]));}
 };
 inspect(input);
 const i=process.argv.indexOf('--json');let payload;if(extname(input)==='.json')payload=JSON.parse(readFileSync(input,'utf8'));else if(i>=0)payload=JSON.parse(readFileSync(process.argv[i+1],'utf8'));if(payload!==undefined)problems.push(...validateValueStates('',payload).problems);
 const r={releaseRef:'v0.9.7-owner.1',status:problems.length?'FAIL':'PASS',scope:'Static registered Story/Location literal-color, prohibited-alias, locally linked CSS and governed numeric-value state checks only. Full source truth, role correctness, actual contrast, dynamic rendering, layout and accessibility remain manual/rendered gates.',files:[...checked],uniqueColors:colors.size,problems:[...new Set(problems)],warnings:[...new Set(warnings)],fullConformance:false};console.log(JSON.stringify(r,null,2));process.exitCode=problems.length?1:0;
}catch(e){console.error('FAIL: '+e.message);process.exitCode=1;}
