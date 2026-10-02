#!/usr/bin/env node
// Check the inline teaching surface against the authoritative Location profile.
// This is a source/behaviour contract check; actual rendered review is separate.
import {readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import vm from 'node:vm';
import {locationLab, renderLocationLab} from './lds097-location-lab.mjs';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const matches = (text, expression) => [...text.matchAll(expression)];
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');

export function validateLocationLab({root, site=join(root, 'deployment/v0.9.7'), html, css, js, delivered=false}) {
  let checks=0;
  const check=(value, message)=>{checks++; if(!value) throw new Error(message);};
  const equal=(actual, expected, message)=>check(same(actual,expected),message);
  const authoritative=JSON.parse(readFileSync(join(root,'plugins/landometer-design-system/assets/lds-0.9.7/machine/location-intelligence-0.9.7.json'),'utf8'));
  const numeric=authoritative.semantics.metrics.filter(metric=>metric.useScale!=='none');
  const evidence=authoritative.semantics.metrics.filter(metric=>metric.useScale==='none');
  const match=html.match(/<script\b[^>]*\bid="lds097-li-data"[^>]*>([\s\S]*?)<\/script>/);
  check(Boolean(match),'Inline lab must carry its exact data without a network bootstrap');
  const data=JSON.parse(match[1]);
  equal(data.release,'0.9.7','Inline data release');
  equal(data.profileId,authoritative.profileId,'Exact Location profile identity');
  equal(data.themePolicy,authoritative.themePolicy,'Owner theme policy must remain intact');
  equal(data.metrics,numeric,'All twelve original metric definitions and evidence boundaries must remain intact');
  equal(data.scales,numeric.map(metric=>authoritative.scales.find(scale=>scale.scaleId===metric.id&&scale.theme==='light')),'Inline scales must equal all twelve authoritative original-light records in displayed metric order');
  equal(data.roles,authoritative.roles.filter(role=>numeric.some(metric=>metric.id===role.id)),'Numeric role accents and non-colour cues must equal the authoritative records');
  check(numeric.length===12 && evidence.length===4,'Twelve measured families and four distinct SWOT evidence lenses');
  check(data.scales.filter(scale=>scale.kind==='sequential').length===9,'Nine sequential Location scales');
  check(data.scales.filter(scale=>scale.kind==='diverging').length===3,'Three signed Location scales');
  for(const metric of numeric) {
    const light=authoritative.scales.find(scale=>scale.scaleId===metric.id&&scale.theme==='light');
    const dark=authoritative.scales.find(scale=>scale.scaleId===metric.id&&scale.theme==='dark');
    equal(light.anchors,dark.anchors,`Both themes preserve the anchors: ${metric.id}`);
    equal(light.lut,dark.lut,`Both themes preserve the complete LUT: ${metric.id}`);
    equal(light.classes,dark.classes,`Both themes preserve every class set: ${metric.id}`);
    check(light.lut.length===41,`Authoritative LUT must contain 41 entries: ${metric.id}`);
    equal([0,20,40].map(index=>light.lut[index]),light.anchors,`The three anchors retain their exact LUT positions: ${metric.id}`);
    for(const count of [3,5,7,9]) check(light.classes[count].length===count,`Authoritative class count ${metric.id}/${count}`);
  }
  const ids=matches(html,/\sid="([^"]+)"/g).map(item=>item[1]);
  check(new Set(ids).size===ids.length,'Inline surface has unique element IDs');
  check(ids.every(id=>id==='atlas-location-lab'||id.startsWith('lds097-li-')),'All inline IDs are scoped away from the host controls');
  for(const control of ['family','intervals','vision']) check(ids.includes('lds097-li-'+control),`Labelled local control exists: ${control}`);
  check(!/<iframe\b/i.test(html),'Lab is native content, not a separate page embedded in an iframe');
  check(!/<(?:html|body|main)\b/i.test(html),'Lab integrates within the retained document outline');
  check(!/\bfetch\s*\(/.test(js),'Exact inline data has no remote bootstrap requirement');
  check(!/document\.body\.(?:className|classList)/.test(js),'Vision simulation cannot alter the host page class');
  check(!/document\.documentElement\.(?:lang|dataset\.theme)\s*=/.test(js),'Language and theme belong to the existing page controls');
  check(!/searchParams\.(?:set|delete)\(['"](?:family|n|vision|lang|theme)['"]/.test(js),'Lab URL writes cannot overwrite global or old-page parameters');
  for(const parameter of ['liFamily','liN','liVision']) check(js.includes(parameter),`Inline share state has a scoped parameter: ${parameter}`);
  check(!/border-(?:left|inline-start)\s*:/.test(css),'No decorative left-rail highlight');
  new vm.Script(js); checks++;

  check(html.includes('data-family="li.demand" data-count="41"'),'Initial native content defaults to Demand with all 41 colours');
  check(html.includes('<option value="41" selected>'),'41 is the selected primary option before JavaScript runs');
  check(html.indexOf('<option value="41" selected>')<html.indexOf('<option value="3">'),'Compact choices follow the primary 41 interval choice');
  check(/<fieldset\b[^>]*\bdisabled>/.test(html),'Initial controls honestly remain disabled until they work');
  check(html.includes('<noscript>')&&html.includes('static example shows Demand in 41 intervals'),'No-JS explanation remains useful');
  const staticDemand=renderLocationLab(data,{family:'li.demand',n:41,vision:'normal'},'both');
  check(html.includes(staticDemand),'The complete 41-colour Demand view is present before hydration');

  const checkView=(rendered,metric,n,lang)=>{
    const row=authoritative.scales.find(scale=>scale.scaleId===metric.id&&scale.theme==='light');
    const selected=n===41?row.lut:row.classes[n];
    const context=`${metric.id}/${n}/${lang}`;
    const strips=matches(rendered,/<div class="lds097-li__strip" data-strip="([^"]+)" data-count="(\d+)"[^>]*>([\s\S]*?)<\/div>/g);
    equal(strips.map(item=>item[1]),['classes','lut41'],`Selected and full-table views are explicit: ${context}`);
    for(const [,kind,count,body]of strips){
      const expected=kind==='lut41'?row.lut:selected;
      check(+count===expected.length,`Visible strip length: ${context}/${kind}`);
      const swatches=matches(body,/<i\b[^>]*data-bin-index="(\d+)"[^>]*data-hex="(#[A-F0-9]{6})"[^>]*style="background:(#[A-F0-9]{6})"[^>]*>/g);
      equal(swatches.map(item=>+item[1]),expected.map((_,i)=>i),`All bin indices are present in order: ${context}/${kind}`);
      equal(swatches.map(item=>item[2]),expected,`The displayed HEX values match their exact source: ${context}/${kind}`);
      equal(swatches.map(item=>item[3]),expected,`The displayed fills match their exact source: ${context}/${kind}`);
    }
    const anchors=matches(rendered,/<div data-anchor-index="(\d)" data-hex="(#[A-F0-9]{6})">/g);
    equal(anchors.map(item=>item[2]),row.anchors,`All three anchors match source: ${context}`);
    const copy=rendered.match(/<textarea\b[^>]*id="lds097-li-colours"[^>]*>([\s\S]*?)<\/textarea>/)?.[1];
    equal(copy?.split(', '),selected,`Copyable colours exactly match the selected strip: ${context}`);
    const legend=matches(rendered,/<tr data-legend-bin="(\d+)" data-lower="([^"]+)" data-upper="([^"]+)" data-upper-inclusive="([^"]+)">([\s\S]*?)<\/tr>/g);
    equal(legend.map(item=>+item[1]),selected.map((_,i)=>i),`Legend includes each selected interval once: ${context}`);
    const lower=row.kind==='diverging'?-100:0,upper=100;
    check(+legend[0][2]===lower&&+legend.at(-1)[3]===upper,`Legend spans the entire demonstration domain: ${context}`);
    for(const [index,item]of legend.entries()) {
      check(+item[3]>+item[2],`Legend interval has positive width: ${context}/${index}`);
      if(index)check(+item[2]===+legend[index-1][3],`Legend has no gaps or overlaps: ${context}/${index}`);
      equal(item[4],String(index===n-1),`Only the final upper bound is inclusive: ${context}/${index}`);
      check(item[5].includes(`<code>${selected[index]}</code>`),`Legend HEX matches its strip: ${context}/${index}`);
    }
    const cells=matches(rendered,/<g data-cell="(\d+)" data-value="([^"]*)" data-status="([^"]+)" data-class-index="([^"]*)" data-fill="([^"]*)">([\s\S]*?)<\/g>/g);
    check(cells.length===24,`Synthetic map has 24 readable cells: ${context}`);
    equal(cells.filter(item=>item[3]!=='observed-synthetic').map(item=>item[3]),['no_data','withheld','not_applicable','not_defined'],`Missing, withheld, not applicable and undefined remain distinct: ${context}`);
    check(cells.some(item=>item[2]==='0'&&item[3]==='observed-synthetic'),`Zero remains a numeric observation: ${context}`);
    const bars=matches(rendered,/<g data-bar="(\d+)" data-value="([^"]+)" data-class-index="([^"]+)" data-fill="([^"]+)">([\s\S]*?)<\/g>/g);
    check(bars.length===9,`Chart contains all nine demonstration values: ${context}`);
    const numericMarks=[...cells.filter(item=>item[3]==='observed-synthetic').map(item=>({value:+item[2],index:+item[4],hex:item[5],body:item[6]})),...bars.map(item=>({value:+item[2],index:+item[3],hex:item[4],body:item[5]}))];
    for(const mark of numericMarks){
      const bin=legend.find(item=>mark.value>=+item[2]&&(mark.value<+item[3]||(item[4]==='true'&&mark.value===+item[3])));
      check(Boolean(bin)&&+bin[1]===mark.index,`Map/bar value belongs to its displayed interval: ${context}/${mark.value}`);
      equal(mark.hex,selected[mark.index],`Map/bar fill comes from the selected exact table: ${context}/${mark.value}`);
      check(mark.body.includes(`fill="${mark.hex}"`),`Map/bar actual fill equals declared colour: ${context}/${mark.value}`);
      if(row.kind==='diverging'&&mark.value===0)equal(mark.hex,row.anchors[1],`Signed zero uses the approved reference colour: ${context}`);
    }
    for(const item of cells.filter(item=>item[3]!=='observed-synthetic')){
      check(item[2]===''&&item[4]===''&&item[5]==='',`Non-numeric state is not converted to zero or a numeric colour: ${context}/${item[3]}`);
      check(item[6].includes(`url(#lds097-li-pattern-${item[3]})`),`Non-numeric state has its separate cue: ${context}/${item[3]}`);
    }
    const valueTable=rendered.match(/id="lds097-li-example-values">([\s\S]*?)<\/details>/)?.[1]||'';
    const valueRows=matches(valueTable,/<tr><th scope="row">[\s\S]*?<\/th><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/g);
    check(valueRows.length===33,`Map and chart retain a readable table with all values and states: ${context}`);
    for(const [index,cell]of cells.entries()) {
      if(cell[3]==='observed-synthetic')equal(valueRows[index].slice(1),[cell[2],String(+cell[4]+1)],`Readable table agrees with map value and bin: ${context}/${index}`);
      else check(valueRows[index][1].length>0&&valueRows[index][1]!=='0'&&valueRows[index][2]==='—',`Readable table retains the nonnumeric state: ${context}/${index}`);
    }
    for(const [index,bar]of bars.entries())equal(valueRows[index+24].slice(1),[bar[2],String(+bar[3]+1)],`Readable table agrees with chart value and bin: ${context}/${index}`);
    const plain=decode(rendered);
    for(const field of ['unit','numerator','denominator','evidenceBoundary']) {
      const value=lang==='th'?metric[field]:data.english[metric.id][field==='evidenceBoundary'?'evidence':field];
      check(Boolean(value)&&plain.includes(value),`Metric meaning and evidence remain near the example: ${context}/${field}`);
    }
    check(plain.includes(lang==='th'?'ข้อมูลสมมติ':'Illustrative values'),`Synthetic data is not presented as real measurements: ${context}`);
    check(!/linear-gradient\(/.test(rendered),`No invented intermediate analytical colours: ${context}`);
  };
  let renderedCases=0;
  for(const metric of numeric) for(const n of [41,3,5,7,9]) for(const lang of ['th','en']) {
    const rendered=renderLocationLab(data,{family:metric.id,n,vision:'normal'},lang);
    check(typeof rendered==='string'&&rendered.length>0,`Useful static content: ${metric.id}/${n}/${lang}`);
    checkView(rendered,metric,n,lang);
    renderedCases++;
  }
  equal(renderLocationLab(data,{family:'li.threat',n:6,vision:'normal'},'en'),renderLocationLab(data,{family:'li.demand',n:41,vision:'normal'},'en'),'Invalid/SWOT numeric selection falls back to the useful approved primary scale');
  check(!data.metrics.some(metric=>evidence.some(lens=>lens.id===metric.id)),'SWOT lenses cannot enter the numeric selector');

  const runtime=exerciseRuntime(js,data,check,equal);

  if(delivered) {
    const page=readFileSync(join(site,'index.html'),'utf8');
    check(page.includes(html),'Delivered main guide includes the complete reviewed inline lab');
    equal(readFileSync(join(site,'location-lab.css'),'utf8'),css,'Delivered inline CSS equals the reviewed generator');
    equal(readFileSync(join(site,'location-lab.js'),'utf8'),js,'Delivered inline runtime equals the reviewed generator');
    check(page.includes('src="location-lab.js?build='),'Main guide loads the inline lab runtime');
    for(const id of ids) check(matches(page,new RegExp(`\\sid="${id}"`,'g')).length===1,`Inline ID has no collision with the complete guide: ${id}`);
  }
  return {status:'PASS',checks,renderedCases,runtime,families:numeric.length,primarySamples:41,secondaryClasses:[3,5,7,9],scope:'Authoritative source parity, every static family/class rendering, meaningful interval assignments, no-JS usefulness, scoped URL state and source-to-site delivery. Rendered usability and accessibility are reviewed separately.'};
}

// Run the actual emitted runtime against small DOM adapters. This checks state
// transactions and exported data, not browser layout or native input rendering.
function exerciseRuntime(js,data,check,equal) {
  const createElement=(extra={})=>({dataset:{},value:'',innerHTML:'',textContent:'',events:{},focus(){this.focused=true;},addEventListener(type,handler){this.events[type]=handler;},querySelectorAll(){return[];},querySelector(){return null;},...extra});
  const family=createElement();
  const intervals=createElement({options:[41,3,5,7,9].map(value=>({value:String(value)})),querySelectorAll(selector){return selector==='option'?this.options:[];}});
  const vision=createElement({options:['normal','deuteranopia','protanopia','gray'].map(value=>({value}))});
  const body=createElement(),status=createElement(),fieldset={disabled:true};
  let scrolls=0;
  const ancestor={tagName:'DETAILS',open:false,parentElement:null};
  const host=createElement({parentElement:ancestor,scrollIntoView(){scrolls++;},querySelector(selector){return({'#lds097-li-family':family,'#lds097-li-intervals':intervals,'#lds097-li-vision':vision,'[data-li-body]':body,'[data-li-status]':status,fieldset})[selector]||null;}});
  const root={lang:'en',style:{scrollBehavior:'smooth'}};
  const documentEvents={},windowEvents={};
  let observerCallback,downloaded,clicked=false;
  let current=new URL('https://example.test/Landometer/v0.9.7/?lang=en&theme=dark&work=screen&view=assisted&lens=dna&surface=cultivate&stage=frame&family=count&n=7&liFamily=li.demand&liN=41&liVision=normal#atlas-location-lab');
  const originalParams=new URLSearchParams(current.search);
  const history={state:{retained:'guide-state'},replaceState(state,unused,url){equal(state,this.state,'Inline changes retain history state');current=new URL(url,current);}};
  const location={get href(){return current.href;},get search(){return current.search;},get hash(){return current.hash;},set hash(hash){current.hash=hash;}};
  class RuntimeURL extends URL {static createObjectURL(blob){downloaded=JSON.parse(blob.parts.join(''));return'blob:location-test';} static revokeObjectURL(){}}
  const document={documentElement:root,getElementById(id){return id==='atlas-location-lab'?host:id==='lds097-li-data'?{textContent:JSON.stringify(data)}:null;},addEventListener(type,handler){documentEvents[type]=handler;},createElement(){return{click(){clicked=true;}};}};
  const context={document,window:{addEventListener(type,handler){windowEvents[type]=handler;}},history,location,URL:RuntimeURL,URLSearchParams,Blob:class{constructor(parts){this.parts=parts;}},MutationObserver:class{constructor(callback){observerCallback=callback;}observe(){}},setTimeout(callback){callback();},requestAnimationFrame(callback){callback();},navigator:{clipboard:{writeText(){}}}};
  vm.runInNewContext(js,context,{timeout:3000});
  check(host.dataset.ready==='true'&&fieldset.disabled===false,'Actual runtime enables the native controls after rendering');
  check(host.dataset.count==='41'&&family.value==='li.demand','Actual runtime starts with the primary 41-level view');
  check(body.innerHTML.includes('data-strip="classes" data-count="41"'),'Actual runtime displays all 41 selected colours');
  family.value='li.service_gap';family.events.change();
  intervals.value='9';intervals.events.change();
  vision.value='gray';vision.events.change();
  equal(current.searchParams.get('liFamily'),'li.service_gap','Metric changes update only the scoped family');
  equal(current.searchParams.get('liN'),'9','Compact selection has its scoped share value');
  equal(current.searchParams.get('liVision'),'gray','Simulation has its scoped share value');
  for(const[key,value]of originalParams)if(!key.startsWith('li'))equal(current.searchParams.get(key),value,`Lab controls preserve host parameter ${key}`);
  equal(current.hash,'#atlas-location-lab','Adjusting controls does not discard the current anchor');
  check(host.dataset.vision==='gray','Simulation remains local to the lab');
  check(body.innerHTML.includes('data-strip="classes" data-count="9"'),'Selected interval count actually rerenders the view');
  root.lang='th';observerCallback();
  check(body.innerHTML.includes('ตัวหาร / ขอบเขต'),'Main-page language changes rerender the local explanatory content');
  check(host.dataset.family==='li.service_gap'&&host.dataset.count==='9'&&host.dataset.vision==='gray','Language changes retain chosen metric, interval count and simulation');
  body.events.click({target:{closest(){return{dataset:{liAction:'download'}};}}});
  check(clicked&&downloaded,'Actual download handler produces a usable JSON asset');
  const selected=data.scales.find(scale=>scale.scaleId==='li.service_gap');
  equal(downloaded.colors,selected.classes['9'],'Simulation never recolours the downloaded nine-class data');
  equal(downloaded.lut41,selected.lut,'Downloaded asset retains every original LUT entry');
  equal(downloaded.metric,data.metrics.find(metric=>metric.id==='li.service_gap'),'Downloaded data includes the metric definition and evidence boundary');
  check(downloaded.simulationExported===false&&downloaded.example.status==='synthetic-illustration-not-a-real-location','Download distinguishes simulation, original colours and synthetic thresholds');
  check(downloaded.example.bins.length===9,'Downloaded class boundaries match the selected count');
  current.searchParams.set('liFamily','li.threat');current.searchParams.set('liN','8');current.searchParams.set('liVision','unrecognised');windowEvents.popstate();
  check(host.dataset.family==='li.demand'&&host.dataset.count==='41'&&host.dataset.vision==='normal','Invalid URL values recover to the approved primary view');
  current.searchParams.set('liFamily','li.unit_economics');current.searchParams.set('liN','41');current.searchParams.set('liVision','normal');windowEvents.hashchange();
  check(host.dataset.family==='li.unit_economics'&&host.dataset.count==='41','Native deep links can switch to another metric at 41 levels');
  body.events.click({target:{closest(){return{dataset:{liAction:'download'}};}}});
  equal(downloaded.colors,data.scales.find(scale=>scale.scaleId==='li.unit_economics').lut,'The primary download contains all 41 exact colours, in order');
  check(downloaded.example.bins.length===41,'The primary download contains 41 full-precision demonstration intervals');
  let prevented=false;
  const plainAnchor={dataset:{}};
  const sameHash=current.href;
  documentEvents.click({button:0,target:{closest(){return plainAnchor;}},preventDefault(){prevented=true;}});
  check(prevented&&ancestor.open&&scrolls>0&&family.focused,'Same-hash navigation reveals the parent, scrolls and focuses the lab');
  equal(current.href,sameHash,'Same-hash navigation preserves the complete current selection and URL');
  equal(root.style.scrollBehavior,'smooth','Explicit scrolling restores the host scroll preference');
  const previousScrolls=scrolls;
  for(const modifiers of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1}]) {
    let preventedModified=false;
    documentEvents.click({button:0,...modifiers,target:{closest(){return{dataset:{lds097LiFamily:'li.supply'}};}},preventDefault(){preventedModified=true;}});
    check(!preventedModified&&scrolls===previousScrolls,'Modified/non-primary click retains native browser navigation');
    equal(current.href,sameHash,'Modified/non-primary click does not change the original tab');
  }
  const selectedLink={dataset:{lds097LiFamily:'li.supply',lds097LiN:'9'}};
  documentEvents.click({button:0,target:{closest(){return selectedLink;}},preventDefault(){}});
  check(host.dataset.family==='li.supply'&&host.dataset.count==='9','Metric shortcut selects its explicit valid metric and count');
  check(current.searchParams.get('theme')==='dark'&&current.searchParams.get('family')==='count'&&current.searchParams.get('n')==='7','Metric shortcut preserves the global theme and other lab state');
  return {scopedState:'PASS',languageContinuity:'PASS',downloadOriginalColours:'PASS',invalidStateFallback:'PASS',sameHashNavigation:'PASS',modifiedClick:'PASS',adapterOnly:true};
}

if(import.meta.url===pathToFileURL(process.argv[1]||'').href) {
  const root=resolve(import.meta.dirname,'..'),site=join(root,'deployment/v0.9.7');
  const projected=locationLab({root,site});
  const result=validateLocationLab({root,site,...projected,delivered:process.argv.includes('--site')});
  const embedded=projected.html.match(/<script\b[^>]*\bid="lds097-li-data"[^>]*>([\s\S]*?)<\/script>/)[1];
  const changed=JSON.parse(embedded);changed.scales[0].lut[1]='#000000';
  const mutations=[
    projected.html.replace(embedded,JSON.stringify(changed)),
    projected.html.replace('<option value="41" selected>','<option value="41">'),
    projected.html.replace('data-bin-index="0" data-hex=','data-bin-index="1" data-hex=')
  ];
  for(const html of mutations){let rejected=false;try{validateLocationLab({root,site,...projected,html});}catch{rejected=true;}if(!rejected)throw new Error('Location validator accepted a changed authoritative colour, reduced default or corrupted static strip');}
  console.log(JSON.stringify({...result,mutationRegressionsRejected:mutations.length},null,2));
}
