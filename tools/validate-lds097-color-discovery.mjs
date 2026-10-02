#!/usr/bin/env node
// Validate source-to-visible-colour parity, semantic coverage and navigation.
// This is not a browser layout or accessibility certificate.
import {readFileSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {colorDiscovery} from './lds097-color-discovery.mjs';

export function validateColorDiscovery(html, {root, site = join(root,'deployment/v0.9.7')}) {
  let checks = 0;
  const assert = (condition, message) => { checks++; if (!condition) throw new Error(message); };
  const machine=join(root,'plugins/landometer-design-system/assets/lds-0.9.7/machine');
  const registry=JSON.parse(readFileSync(join(machine,'color-registry.json'),'utf8'));
  const profile=JSON.parse(readFileSync(join(machine,'location-intelligence-0.9.7.json'),'utf8'));
  const metrics=profile.semantics.metrics.filter(metric=>metric.useScale!=='none');
  const swot=profile.semantics.metrics.filter(metric=>metric.useScale==='none');
  const all = (text, expression) => [...text.matchAll(expression)];
  const colours = text => all(text, /data-hex="(#[A-F0-9]{6})"/g).map(match=>match[1]);
  const equal = (left,right,message) => assert(JSON.stringify(left)===JSON.stringify(right),message);
  const sourceSwatches = all(html, /<li data-story-colour="([^"]+)">([\s\S]*?)<\/li>/g);
  equal(sourceSwatches.map(match=>match[1]),registry.supportingPalette.map(item=>item.id),'Story vocabulary must include each current source colour once, in source order');
  sourceSwatches.forEach(([whole,id,body])=>{
    const expected=registry.supportingPalette.find(item=>item.id===id);
    equal(colours(body),[expected.hex],`Story visual fill drift: ${id}`);
    assert(body.includes(`<code>${expected.hex}</code>`),`Story visible HEX missing: ${id}`);
    assert(whole.includes(`background:${expected.hex}`),`Story displayed fill mismatch: ${id}`);
  });
  const roleChips=all(html,/<li data-location-role="([^"]+)">([\s\S]*?)<\/li>/g);
  equal(roleChips.map(match=>match[1]),profile.roles.map(item=>item.id),'Location must display all sixteen role colours once');
  roleChips.forEach(([whole,id,body])=>{
    const role=profile.roles.find(item=>item.id===id);
    assert(role.light.hex===role.dark.hex,`Role source themes differ: ${id}`);
    assert(whole.includes(`background:${role.light.hex}`),`Role fill drift: ${id}`);
    assert(body.includes(`<code>${role.light.hex}</code>`),`Role visible HEX missing: ${id}`);
  });
  const cards=all(html,/<article class="lds097-discovery__scale" data-location-scale="([^"]+)" data-scale-kind="([^"]+)">([\s\S]*?)<\/article>/g);
  equal(cards.map(match=>match[1]),metrics.map(item=>item.id),'Location gallery must contain exactly twelve metric cards in semantic order');
  equal(cards.reduce((counts,[,id,kind])=>({...counts,[kind]:(counts[kind]||0)+1}),{}),{sequential:9,diverging:3},'Location kind counts must remain nine sequential and three diverging');
  for (const [whole,id,kind,body] of cards) {
    const row=profile.scales.find(item=>item.scaleId===id&&item.theme==='light');
    const dark=profile.scales.find(item=>item.scaleId===id&&item.theme==='dark');
    assert(kind===row.kind,`Semantic scale kind drift: ${id}`);
    equal(row.lut,dark.lut,`Theme LUT values differ: ${id}`);
    const lut=body.match(/<div class="lds097-discovery__bar" data-colour-strip="lut41" data-samples="41"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    const classes=body.match(/<div class="lds097-discovery__bar" data-colour-strip="classes5" data-samples="5"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    assert(Boolean(lut)&&Boolean(classes),`Both exact sample bars must be present: ${id}`);
    equal(colours(lut||''),row.lut,`41-stop visible order/values drift: ${id}`);
    equal(colours(classes||''),row.classes['5'],`Five-class visible order/values drift: ${id}`);
    const anchors=all(body,/<div data-anchor-index="(\d)" data-hex="(#[A-F0-9]{6})">([\s\S]*?)<\/div>/g);
    equal(anchors.map(match=>match[2]),row.anchors,`Anchor visible order/values drift: ${id}`);
    anchors.forEach(([full,index,hex])=>assert(full.includes(`background:${hex}`)&&full.includes(`<code>${hex}</code>`),`Anchor chip/text mismatch: ${id}/${index}`));
    const lab=body.match(/<a data-lds097-li-family="[^"]+" href="([^"]+)"/);
    assert(Boolean(lab),`Metric lab link missing: ${id}`);
    const url=new URL(lab[1].replaceAll('&amp;','&'),'https://montri-th.github.io/Landometer/v0.9.7/');
    assert(url.pathname==='/Landometer/v0.9.7/'&&url.searchParams.get('liFamily')===id&&url.searchParams.get('liN')==='41'&&url.hash==='#atlas-location-lab',`Metric link points to wrong controls: ${id}`);
    assert(!whole.includes('linear-gradient('),`The visible numerical strip must use supplied exact samples: ${id}`);
    if(kind==='diverging')assert(body.includes('Zero ='),`Diverging neutral reference is missing: ${id}`);
  }
  for (const metric of swot) {
    assert(!cards.some(card=>card[1]===metric.id),`SWOT evidence lens incorrectly rendered as numeric scale: ${metric.id}`);
    const chip=roleChips.find(chip=>chip[1]===metric.id);
    assert(Boolean(chip)&&chip[2].includes('Evidence lens · no numeric ramp'),`SWOT non-scalar role needs a visible label: ${metric.id}`);
  }
  for(const name of ['Location-Intelligence-Profile-for-LDS-v0.9.7.md','Location-Intelligence-Profile-for-LDS-v0.9.7.json']) {
    assert(html.includes(`href="normative/${name}" download`),`Profile download missing: ${name}`);
    assert(existsSync(join(site,'normative',name)),`Profile link target missing: ${name}`);
  }
  const previews=all(html,/<span class="lds097-discovery__bar" data-preview-family="([^"]+)"[^>]*>([\s\S]*?)<\/span>/g);
  equal(previews.map(match=>match[1]),['li.demand','li.supply','li.market_share'],'Representative previews must expose meaningful distinct tasks');
  for(const [,id,body]of previews)equal(colours(body),profile.scales.find(row=>row.scaleId===id&&row.theme==='light').lut,`Preview must use the exact 41-step set: ${id}`);
  for(const id of ['atlas-current-colours','atlas-story-vocabulary','atlas-location-scales','atlas-location-roles','atlas-location-gallery'])assert(all(html,new RegExp(`\\bid="${id}"`,'g')).length===1,`Discoverable anchor missing or duplicate: ${id}`);
  assert(html.includes('uploading JSON as well is unnecessary'),'Installation guide must distinguish alternative formats');
  assert(html.includes('complete LDS 0.9.7 base plus the Location Profile'),'Installation guide must name required base and separate profile');
  return {status:'PASS',checks,story:sourceSwatches.length,roles:roleChips.length,metrics:cards.length,swot:swot.length,scope:'Static exact-source colour parity, semantic coverage, numeric versus evidence-lens distinction and navigation. Browser and accessibility review remain separate.'};
}

if(import.meta.url===pathToFileURL(process.argv[1]||'').href){
  const root=resolve(import.meta.dirname,'..'),site=join(root,'deployment/v0.9.7');
  const rendered=process.argv.includes('--site')?readFileSync(join(site,'index.html'),'utf8'):colorDiscovery({root,site}).html;
  const result=validateColorDiscovery(rendered,{root,site});
  // A source mismatch must cause an actual failure, not merely increment a count.
  const changed=rendered.replace('data-colour-strip="lut41" data-samples="41"','data-colour-strip="lut41" data-samples="40"');
  let mutationRejected=false;try{validateColorDiscovery(changed,{root,site});}catch{mutationRejected=true;}
  if(!mutationRejected)throw new Error('Validator accepted a truncated LUT strip');
  console.log(JSON.stringify({...result,mutationRejected},null,2));
}
