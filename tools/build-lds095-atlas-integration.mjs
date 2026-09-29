#!/usr/bin/env node
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
const root=resolve(import.meta.dirname,'..'),site=join(root,'deployment/v0.9.5');
const scope='.lds095-color-atlas';
const files=['package/assets/lds-0.9.5/machine/color-srgb-08.production.css','lds/lds-0.9.4-ext.css','lds/lds-0.9.4-components.css','app.css','candidate.css'];

// Parse balanced CSS blocks so nested media/supports and quoted data values
// retain their original bytes. Only selectors are scoped; colors never change.
function scopeCss(source){
  source=source.replace(/\/\*[\s\S]*?\*\//g,'');
  let result='',cursor=0;
  while(cursor<source.length){
    const open=source.indexOf('{',cursor);
    if(open<0){if(source.slice(cursor).trim())throw Error('Unexpected CSS tail');break;}
    const selector=source.slice(cursor,open).trim();
    let depth=1,quote=null,escaped=false,end=open+1;
    for(;end<source.length;end++){
      const c=source[end];
      if(escaped){escaped=false;continue;}
      if(c==='\\'){escaped=true;continue;}
      if(quote){if(c===quote)quote=null;continue;}
      if(c==='"'||c==="'"){quote=c;continue;}
      if(c==='{')depth++;
      else if(c==='}'&&--depth===0)break;
    }
    if(depth!==0)throw Error('Unbalanced CSS block');
    const body=source.slice(open+1,end);
    if(/^@(media|supports|container|layer)\b/.test(selector))result+=`${selector}{${scopeCss(body)}}\n`;
    else if(/^@(font-face|keyframes)\b/.test(selector))result+=`${selector}{${body}}\n`;
    else if(selector.startsWith('@'))throw Error(`Unsupported CSS rule ${selector}`);
    else{
      const selectors=selector.split(/,(?![^()]*\))/).map(s=>{
        s=s.trim();
        if(/^(?:html|body|:root)(?=[\s.[:#]|$)/.test(s))return s.replace(/^(?:html|body|:root)/,scope);
        if(/^\[data-theme[=\]]/.test(s))return scope+s;
        return `${scope} ${s}`;
      });
      result+=`${selectors.join(',')}{${body}}\n`;
    }
    cursor=end+1;
  }
  return result;
}
let css='/* Generated inline atlas styles. Exact values retained; selectors isolated from the full handbook. */\n';
for(const file of files)css+=`/* Source: ${file} */\n${scopeCss(readFileSync(join(site,file),'utf8'))}\n`;
css+=`${scope}{min-width:0;width:100%;height:auto;overflow-anchor:none}\n${scope} .wrap{width:100%;max-width:none}\n${scope} .section{scroll-margin-top:110px}\n`;
// body-level perception modes belong only to the atlas, never to the handbook.
css=css.replaceAll(`${scope} .vision-gray`,`${scope}.vision-gray`).replaceAll(`${scope} .vision-deuteranopia`,`${scope}.vision-deuteranopia`);
let js=readFileSync(join(site,'app.js'),'utf8');
const begin=js.indexOf(" const theme=document.getElementById('theme-choice');"),end=js.indexOf(' function update()');
if(begin<0||end<begin)throw Error('Standalone atlas theme hook changed');
js=js.slice(0,begin)+" const atlas=document.getElementById('lds095-color-atlas');\n"+js.slice(end);
js=js.replaceAll('document.body.classList','atlas.classList').replace("document.documentElement.dataset.previewReady='true'","atlas.dataset.previewReady='true'");
for(const [file,bytes] of [['scoped-atlas.css',css],['embedded-atlas.js',js]]){
 const path=join(site,file);
 if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==bytes)throw Error(`Stale ${file}`);}
 else writeFileSync(path,bytes);
}
console.log('Inline atlas CSS and runtime generated from approved standalone sources.');
