import {readFileSync} from 'node:fs';
import {join} from 'node:path';

const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const english = {
  'li.demand': {unit:'Purchase occasions per month in the defined business category', numerator:'Relevant purchase occasions, separating observed quantities from estimates.', denominator:'The stated month; this is not implicitly population density.', meaning:'More total purchase occasions; not confirmed sales for a new branch.', evidence:'POIs, population, travel and Locale Insight can supply contextual proxies within their scope. They do not establish actual customer counts. State the category, target group, period and evidence.'},
  'li.supply': {unit:'Service occasions per month, or capacity units comparable with demand', numerator:'Operating capacity, distinguishing our network, competitors and unknown ownership; identify capacity estimates.', denominator:'The same period as demand; store count alone is not capacity.', meaning:'More available choices or service capacity; not necessarily stronger competition.', evidence:'POI counts do not establish capacity, utilization or market share. Resolve closed sites, duplicates, multiple tenants and unknown brands.'},
  'li.market_size': {unit:'Currency per stated period', numerator:'Total category spending in the defined market; estimates require supported purchase occasions and spending per occasion.', denominator:'A consistent period and market definition.', meaning:'A larger total category market; not the revenue a new branch will capture.', evidence:'Separate total, serviceable and obtainable markets. General income or population alone is not market size. Do not double-count overlapping catchments.'},
  'li.market_share': {unit:'Percent of sales or purchase volume in the same market', numerator:'Brand or network category sales or purchases in the defined market.', denominator:'All relevant market sales or purchases, using the same category, place, period and unit.', meaning:'A larger share of the defined market; not necessarily a larger market or better profit.', evidence:'Store counts are not sales market share. If the measure is share of outlets, rename it and identify its different proxy role.'},
  'li.spending_readiness': {unit:'Percent of eligible respondents meeting the readiness definition', numerator:'Respondent weight meeting BOTH category-budget and stated near-term purchase-intent criteria.', denominator:'All eligible target respondents with usable answers, with sample and coverage disclosed.', meaning:'More respondents meeting the stated readiness criteria; not guaranteed purchases.', evidence:'Income, property values or Locale Insight alone cannot establish readiness. Separate affordability, intent and observed spending, with sampling or model uncertainty.'},
  'li.demand_growth': {unit:'Percent change from the stated comparable baseline', numerator:'Current demand minus demand in the comparable baseline period.', denominator:'Baseline demand. If zero, report the absolute difference or not-defined; do not divide by zero.', meaning:'More positive change means greater demand growth; it does not establish profit or persistence.', evidence:'Keep category, geography, season and measurement comparable. Population growth is not demand growth for every category.', pivot:'No change from the stated baseline.'},
  'li.accessibility': {unit:'Percent of target demand reachable under stated travel conditions', numerator:'Target-demand weight reachable within the stated time, distance and network travel mode.', denominator:'All target-demand weight in the same reference area.', meaning:'More target demand reachable within the declared conditions.', evidence:'A radius circle is not a travel-time catchment. Declare network, time, mode, barriers and uncertainty; reachability does not prove people will visit.'},
  'li.competitive_pressure': {unit:'Competitor capacity relative to demand, percent; may exceed 100%', numerator:'Relevant rival capacity in units comparable with demand.', denominator:'Defined category demand in the same period and catchment.', meaning:'More rival capacity per unit of demand; not a directly measured probability of losing.', evidence:'Do not silently replace capacity with store count. State category, positioning and unknown capacity. A zero-demand denominator makes the ratio undefined.'},
  'li.service_gap': {unit:'Demand without matching capacity, percent; may be negative', numerator:'Demand minus supply in comparable units, period and geography.', denominator:'Demand in the same scope, strictly greater than zero.', meaning:'Positive values indicate a demand gap; negative values indicate excess capacity under this definition. Neither is universally good or bad.', evidence:'Do not subtract percentile scores or incompatible units. A gap does not establish capturable sales; examine substitutes, travel and price fit.', pivot:'Demand equals supply in comparable units.'},
  'li.cannibalization': {unit:'Percent of proposed-branch purchases transferred from our existing branches', numerator:'Purchases the model expects to transfer from our existing branches to the proposed branch.', denominator:'All modelled purchases for the proposed branch.', meaning:'A larger modelled transfer from the existing network; not new customers or already observed damage.', evidence:'Catchment overlap alone is an overlap proxy, not cannibalization. Declare choices, baseline, counterfactual assumptions and network-level effects.'},
  'li.occupancy_cost': {unit:'Occupancy cost relative to sales in the same period, percent', numerator:'Rent, common charges and other declared occupancy costs.', denominator:'Site sales for the same period, strictly greater than zero; distinguish observed from forecast.', meaning:'More revenue committed to occupancy; no universal pass/fail threshold is implied.', evidence:'Rent per square metre is a different measure. Do not treat projected sales as observed, or cheap rent as proof of a good site.'},
  'li.unit_economics': {unit:'Operating margin under the declared site cost scope, percent', numerator:'Revenue minus site operating costs in the declared cost scope.', denominator:'Revenue for the same period, strictly greater than zero.', meaning:'Positive values indicate more operating margin; negative values indicate revenue below the included costs.', evidence:'Do not call it net profit when capital, depreciation, finance, tax or head-office allocation remain excluded. Show sensitivity and uncertainty.', pivot:'Revenue equals the costs included in this definition.'}
};

/** Shared server/runtime renderer. Numerical fills come only from exact source arrays. */
export function renderLocationLab(data, state, language = 'both') {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t = (th,en) => language === 'both' ? `<span data-th>${esc(th)}</span><span data-en>${esc(en)}</span>` : esc(language === 'en' ? en : th);
  const attr = (th,en) => esc(language === 'th' ? th : en);
  const m = data.metrics.find(item => item.id === state.family) || data.metrics[0];
  const s = data.scales.find(item => item.scaleId === m.id);
  const count = [41,3,5,7,9].includes(+state.n) ? +state.n : 41;
  const colors = count === 41 ? s.lut : s.classes[String(count)];
  const e = data.english[m.id];
  const diverging = s.kind === 'diverging';
  const lower = diverging ? -100 : 0, extent = diverging ? 200 : 100;
  const number = value => String(Math.round(value * 100) / 100);
  const sampleValue = normalized => diverging ? normalized * 2 - 100 : normalized;
  const classIndex = value => Math.max(0,Math.min(count-1,Math.floor((value-lower) / extent * count)));
  const lightness = hex => hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((sum,c,i)=>sum+c*[0.2126,0.7152,0.0722][i],0);
  const ink = hex => lightness(hex)>0.179 ? '#000000' : '#FFFFFF';
  const values = [0,7,23,45,64,91,8,19,44,60,83,100,12,30,50,'no_data',86,96,3,'withheld',74,'not_applicable',99,'not_defined'];
  const statusLabels = {
    no_data:['ไม่มีข้อมูล','Missing'], withheld:['ไม่เปิดเผย','Withheld'], not_applicable:['ไม่เกี่ยวข้อง','Not applicable'], not_defined:['คำนวณไม่ได้','Undefined']
  };
  const statusSymbols = {no_data:'—',withheld:'W',not_applicable:'N/A',not_defined:'?'};
  const mapCells = values.map((entry,i) => {
    const numeric = typeof entry === 'number', value = numeric ? sampleValue(entry) : null;
    const index = numeric ? classIndex(value) : null, hex = numeric ? colors[index] : null;
    const x=4+(i%6)*56,y=4+Math.floor(i/6)*56;
    return `<g data-cell="${i}" data-value="${numeric?value:''}" data-status="${numeric?'observed-synthetic':entry}" data-class-index="${index===null?'':index}" data-fill="${hex||''}"><title>${attr('พื้นที่สมมติ','Illustrative area')} ${i+1}: ${numeric?value:attr(...statusLabels[entry])}</title><rect class="${numeric?'lds097-li__data':'lds097-li__status-cell'}" x="${x}" y="${y}" width="50" height="50" rx="3" fill="${hex||`url(#lds097-li-pattern-${entry})`}" stroke="var(--text-secondary)" stroke-width="${value===0?2.5:1}"/><text x="${x+25}" y="${y+30}" text-anchor="middle" fill="${hex?ink(hex):'var(--text-primary)'}">${numeric?value:statusSymbols[entry]}</text></g>`;
  }).join('');
  const barValues = [0,12,25,38,50,62,75,88,100];
  const bars = barValues.map((entry,i) => {
    const value=sampleValue(entry), index=classIndex(value),hex=colors[index], y=5+i*25;
    const base = diverging ? 166 : 34;
    const width = Math.abs(value)/100*(diverging?118:245);
    const x = value<0?base-width:base;
    return `<g data-bar="${i}" data-value="${value}" data-class-index="${index}" data-fill="${hex}"><title>${attr('ตัวอย่าง','Sample')} ${i+1}: ${value}</title><text x="2" y="${y+15}" fill="var(--text-secondary)">${String.fromCharCode(65+i)}</text>${value===0?`<circle class="lds097-li__data" cx="${base}" cy="${y+10}" r="3.5" fill="${hex}" stroke="var(--text-secondary)"/>`:`<rect class="lds097-li__data" x="${x}" y="${y}" width="${width}" height="19" rx="2" fill="${hex}" stroke="var(--text-secondary)" stroke-width=".8"/>`}<text x="310" y="${y+15}" text-anchor="end" fill="var(--text-primary)">${value}</text></g>`;
  }).join('');
  const strip = (list,id) => `<div class="lds097-li__strip" data-strip="${id}" data-count="${list.length}" aria-hidden="true">${list.map((hex,i)=>`<i class="lds097-li__data" data-bin-index="${i}" data-hex="${hex}" style="background:${hex}"></i>`).join('')}</div>`;
  const edge = (index) => lower + index * extent / count;
  const bins = colors.map((hex,i) => `<tr data-legend-bin="${i}" data-lower="${edge(i)}" data-upper="${edge(i+1)}" data-upper-inclusive="${i===count-1}"><th scope="row">${i+1}</th><td><i class="lds097-li__table-chip lds097-li__data" style="background:${hex}" aria-hidden="true"></i><code>${hex}</code></td><td>${number(edge(i))} ≤ x ${i===count-1?'≤':'&lt;'} ${number(edge(i+1))}</td></tr>`).join('');
  const exampleRows = values.map((entry,i) => {const numeric=typeof entry==='number',value=numeric?sampleValue(entry):null;return `<tr><th scope="row">${t('พื้นที่','Area')} ${i+1}</th><td>${numeric?value:t(...statusLabels[entry])}</td><td>${numeric?classIndex(value)+1:'—'}</td></tr>`;}).join('') + barValues.map((entry,i)=>{const value=sampleValue(entry);return `<tr><th scope="row">${t('แท่ง','Bar')} ${String.fromCharCode(65+i)}</th><td>${value}</td><td>${classIndex(value)+1}</td></tr>`;}).join('');
  const scaleLabel = count===41 ? t('41 ช่วง · CityMETER','41 intervals · CityMETER') : t(`${count} ระดับ · ตัวเลือกย่อ`,`${count} classes · compact option`);
  return `<div class="lds097-li__context"><p class="lds097-li__eyebrow">${t(diverging?'สเกลสองทาง':'สเกลทางเดียว',diverging?'Diverging scale':'Sequential scale')} · <code>${esc(m.id)}</code></p><h6>${t(m.labelTh,m.labelEn)}</h6><p>${t(m.highMeaning,e.meaning)}</p></div>
<div class="lds097-li__legend-head"><strong>${scaleLabel}</strong><span>${t('สีเดิมทั้งพื้นสว่างและพื้นมืด','The same colours on light and dark backgrounds')}</span></div>
${strip(colors,'classes')}
<div class="lds097-li__ticks"><span>${lower}</span><span>${diverging?0:50}</span><span>100</span></div>
<p class="lds097-li__small">${t(diverging?'ข้อมูลสมมติสำหรับดูสี · ปรับช่วง −100 ถึง +100 ไม่ใช่เกณฑ์ผ่าน/ไม่ผ่านจริง จุดศูนย์อยู่สีกลาง':'ข้อมูลสมมติสำหรับดูสี · ปรับช่วง 0–100 ไม่ใช่ค่าตลาดหรือทำเลจริง ค่ามากเข้มขึ้น',diverging?'Illustrative values rescaled to −100…+100; these are not actual pass/fail thresholds. Zero uses the middle colour.':'Illustrative values rescaled to 0…100, not actual market or site measurements. Higher values are darker.')}</p>
<div class="lds097-li__plots"><figure><figcaption>${t('ดูสีในพื้นที่ · แผนผังสมมติ','See colour by area · schematic map')}</figcaption><svg class="lds097-li__map" viewBox="0 0 340 228" role="img" aria-label="${attr('แผนผัง 24 พื้นที่สมมติ มีตัวเลข ศูนย์ และสถานะข้อมูลแยกกัน','24 illustrative areas with numeric values, zero and distinct data states')}">${mapCells}</svg></figure><figure><figcaption>${t('เทียบปริมาณ · ชุดข้อมูลสมมติ','Compare magnitude · illustrative series')}</figcaption><svg class="lds097-li__bars" viewBox="0 0 320 232" role="img" aria-label="${attr('กราฟแท่งค่าตัวอย่าง ใช้ชุดสีและการแบ่งช่วงเดียวกับแผนผัง','Illustrative bar chart using the same colours and bins as the map')}"><line x1="${diverging?166:34}" y1="0" x2="${diverging?166:34}" y2="230" stroke="var(--text-secondary)" stroke-width="1"/>${bars}</svg></figure></div>
<ul class="lds097-li__states"><li><b>0</b>${t('ศูนย์เป็นค่าจริงในตัวอย่าง','Zero is a numeric value')}</li>${Object.entries(statusLabels).map(([key,names])=>`<li><b>${statusSymbols[key]}</b>${t(...names)}</li>`).join('')}</ul>
<details class="lds097-li__details" id="lds097-li-example-values"><summary>${t('อ่านตัวเลขและสถานะในภาพตัวอย่าง','Read the numbers and states behind the examples')}</summary><div class="lds097-li__details-body"><p class="lds097-li__small">${t('พื้นที่ 1–24 เรียงจากซ้ายไปขวา บนลงล่าง ทุกค่าเป็นข้อมูลสมมติสำหรับดูสี','Areas 1–24 run left to right, then top to bottom. Every value is illustrative, for reviewing colours.')}</p><div class="lds097-li__table-wrap"><table><caption>${t('ข้อมูลสมมติในแผนผังและกราฟแท่ง','Illustrative map and bar-chart values')}</caption><thead><tr><th scope="col">${t('รายการ','Item')}</th><th scope="col">${t('ค่า / สถานะ','Value / state')}</th><th scope="col">${t('ช่วงสี','Colour bin')}</th></tr></thead><tbody>${exampleRows}</tbody></table></div></div></details>
<p class="lds097-li__small">${t('เปลี่ยนธีมจากเมนูหลักได้เลย สีข้อมูลและทิศทางคงเดิม การจำลองการมองเห็นช่วยตรวจเพิ่มเติม แต่ไม่ใช่ใบรับรองว่าสีแยกได้สำหรับทุกคน','Use the main theme control to compare canvases: data colours and direction stay unchanged. Vision simulation is a review aid, not a guarantee that everyone can distinguish every colour.')}</p>
<details class="lds097-li__details" id="lds097-li-definition"><summary>${t('อ่านนิยาม หน่วย ตัวหาร และขอบเขตหลักฐาน','Read the definition, unit, denominator and evidence boundary')}</summary><div class="lds097-li__details-body"><dl class="lds097-li__definition"><div><dt>${t('หน่วยเมื่อนำไปใช้จริง','Unit in actual work')}</dt><dd>${t(m.unit,e.unit)}</dd></div><div><dt>${t('ตัวตั้ง','Numerator')}</dt><dd>${t(m.numerator,e.numerator)}</dd></div><div><dt>${t('ตัวหาร / ขอบเขต','Denominator / scope')}</dt><dd>${t(m.denominator,e.denominator)}</dd></div>${m.pivot?`<div><dt>${t('จุดอ้างอิง 0','Zero reference')}</dt><dd>${t(m.pivot.meaningTh,e.pivot)}</dd></div>`:''}<div><dt>${t('ขอบเขตหลักฐาน','Evidence boundary')}</dt><dd>${t(m.evidenceBoundary,e.evidence)}</dd></div></dl><p>${t('ก่อนใช้จริง ระบุหน่วย แหล่งข้อมูล ช่วงเวลา พื้นที่ และเกณฑ์แบ่งช่วงของงานนั้น ตัวอย่างนี้ใช้ช่วงเท่ากันเพื่อดูสีเท่านั้น','Before use, declare the metric unit, source, period, geography and actual class boundaries. This demonstration uses equal intervals only to inspect colours.')}</p></div></details>
<details class="lds097-li__details" id="lds097-li-exact"><summary>${t('หยิบค่าสีไปใช้ · 3 สีหลัก ตาราง 41 สี และช่วงที่เลือก','Use the exact colours · three anchors, the 41-colour table and selected bins')}</summary><div class="lds097-li__details-body"><p>${t('สามสีหลักอธิบายเส้นทางสี ใช้ตารางที่ให้ครบทุกค่าในการแสดงผล ไม่สร้างสีระหว่างกลางขึ้นใหม่','The three anchors explain the colour route. Render with the supplied exact table; do not generate new intermediate colours.')}</p><dl class="lds097-li__anchors">${s.anchors.map((hex,i)=>`<div data-anchor-index="${i}" data-hex="${hex}"><dt><i class="lds097-li__data" style="background:${hex}" aria-hidden="true"></i>${diverging?t(...[['ด้านลบ','Negative'],['จุดอ้างอิง','Reference'],['ด้านบวก','Positive']][i]):t(...[['หัว · ค่าน้อย','Start · lower'],['กลาง · ไม่ใช่ศูนย์','Middle · not zero'],['ท้าย · ค่ามาก','End · higher']][i])}</dt><dd><code>${hex}</code></dd></div>`).join('')}</dl><p class="lds097-li__small">${t('ตารางหลัก 41 ค่าสีตามลำดับ','The full 41-colour lookup table, in order')}</p>${strip(s.lut,'lut41')}<label class="lds097-li__copy-label" for="lds097-li-colours">${t('ค่าสีของช่วงที่เลือก · เลือกข้อความเพื่อคัดลอกได้','Selected interval colours · select the text to copy')}</label><textarea id="lds097-li-colours" readonly rows="4" spellcheck="false">${colors.join(', ')}</textarea><div class="lds097-li__actions"><button type="button" data-li-action="copy" disabled>${t('คัดลอก HEX','Copy HEX')}</button><button type="button" data-li-action="download" disabled>${t('ดาวน์โหลดชุดที่เลือก · JSON','Download selected scale · JSON')}</button><a href="package/assets/lds-0.9.7/machine/location-intelligence-0.9.7.json" download>${t('ข้อมูลครบทั้ง 12 สเกล','All 12 scale definitions')}</a></div><p class="lds097-li__small">${t('ขอบช่วงในตารางนี้เป็นเพียงตัวอย่างที่ปัดแสดงสองตำแหน่ง JSON ของชุดที่เลือกเก็บตัวเลขเต็ม ไม่ใช่เกณฑ์ของข้อมูลจริง','These illustrative boundaries display up to two decimals. The selected-scale JSON keeps the full numeric values; these are not actual data thresholds.')}</p><div class="lds097-li__table-wrap"><table><caption>${scaleLabel} · ${t('ช่วงและ HEX ที่ใช้ในภาพด้านบน','Bins and HEX used in the diagrams above')}</caption><thead><tr><th scope="col">${t('ช่วง','Bin')}</th><th scope="col">HEX</th><th scope="col">${t('ค่าตัวอย่าง','Illustrative values')}</th></tr></thead><tbody>${bins}</tbody></table></div></div></details>`;
}

function bootLocationLab() {
  const host = document.getElementById('atlas-location-lab');
  const json = document.getElementById('lds097-li-data');
  if (!host || !json || host.dataset.ready === 'true') return;
  const data = JSON.parse(json.textContent);
  const family = host.querySelector('#lds097-li-family');
  const intervals = host.querySelector('#lds097-li-intervals');
  const vision = host.querySelector('#lds097-li-vision');
  const body = host.querySelector('[data-li-body]');
  const status = host.querySelector('[data-li-status]');
  const language = () => document.documentElement.lang.startsWith('en') ? 'en' : 'th';
  const text = (th,en) => language() === 'en' ? en : th;
  const modes = ['normal','deuteranopia','protanopia','gray'];
  let state = {family:'li.demand',n:41,vision:'normal'};
  const readURL = () => {
    const p = new URLSearchParams(location.search);
    state.family = data.metrics.some(m=>m.id===p.get('liFamily')) ? p.get('liFamily') : 'li.demand';
    state.n = [41,3,5,7,9].includes(+p.get('liN')) ? +p.get('liN') : 41;
    state.vision = modes.includes(p.get('liVision')) ? p.get('liVision') : 'normal';
  };
  const updateURL = () => {
    const url = new URL(location.href);
    url.searchParams.set('liFamily',state.family);
    url.searchParams.set('liN',String(state.n));
    url.searchParams.set('liVision',state.vision);
    history.replaceState(history.state,'',url);
  };
  const announce = message => {status.textContent=message;};
  const render = (announceChange=false) => {
    const open = [...body.querySelectorAll('details[open]')].map(d=>d.id);
    body.innerHTML = renderLocationLab(data,state,language());
    open.forEach(id=>{const detail=body.querySelector(`#${id}`);if(detail)detail.open=true;});
    family.innerHTML=data.metrics.map(m=>`<option value="${m.id}">${language()==='en'?m.labelEn:m.labelTh}</option>`).join('');
    family.value=state.family;
    intervals.value=String(state.n);
    intervals.querySelectorAll('option').forEach(option=>{option.textContent=option.value==='41'?text('41 ช่วง · CityMETER','41 intervals · CityMETER'):text(`${option.value} ระดับ · แบบย่อ`,`${option.value} classes · compact`);});
    [...vision.options].forEach((option,i)=>{option.textContent=[text('สีปกติ','Original colours'),text('จำลอง Deuteranopia','Simulate deuteranopia'),text('จำลอง Protanopia','Simulate protanopia'),text('จำลองขาวดำ','Simulate grayscale')][i];});
    vision.value=state.vision;
    host.dataset.family=state.family;
    host.dataset.count=String(state.n);
    host.dataset.vision=state.vision;
    host.querySelector('fieldset').disabled=false;
    body.querySelectorAll('[data-li-action]').forEach(button=>{button.disabled=false;});
    if(announceChange){const m=data.metrics.find(m=>m.id===state.family);announce(`${language()==='en'?m.labelEn:m.labelTh} · ${state.n} ${text('ช่วง','intervals')}`);}
  };
  family.addEventListener('change',()=>{state.family=family.value;render(true);updateURL();});
  intervals.addEventListener('change',()=>{state.n=+intervals.value;render(true);updateURL();});
  vision.addEventListener('change',()=>{state.vision=vision.value;host.dataset.vision=state.vision;updateURL();announce(text('เปลี่ยนภาพจำลองแล้ว ค่า HEX ที่คัดลอกยังเป็นต้นฉบับ','Simulation changed. Copied HEX values remain the originals.'));});
  body.addEventListener('click',async event=>{
    const button=event.target.closest('[data-li-action]');if(!button)return;
    if(button.dataset.liAction==='copy'){
      const area=body.querySelector('#lds097-li-colours');
      try{await navigator.clipboard.writeText(area.value);announce(text('คัดลอกค่าสีแล้ว','Colour values copied.'));}
      catch{area.focus();area.select();announce(text('เลือกข้อความให้แล้ว ใช้คำสั่งคัดลอกของเครื่องได้เลย','Text selected. Use your device’s copy command.'));}
    }
    if(button.dataset.liAction==='download'){
      const metric=data.metrics.find(m=>m.id===state.family),scale=data.scales.find(s=>s.scaleId===state.family);
      const colors=state.n===41?scale.lut:scale.classes[String(state.n)];
      const lower=scale.kind==='diverging'?-100:0,extent=scale.kind==='diverging'?200:100;
      const payload={dsVersion:data.release,profileId:data.profileId,themePolicy:data.themePolicy,metric,scaleId:scale.scaleId,scaleVersion:scale.scaleVersion,kind:scale.kind,anchors:scale.anchors,lut41:scale.lut,selectedCount:state.n,colors,simulationExported:false,example:{status:'synthetic-illustration-not-a-real-location',unit:'normalized demonstration value; not actual metric units',classification:'equal intervals for demonstration only',bins:colors.map((hex,i)=>({index:i,lower:lower+i*extent/state.n,upper:lower+(i+1)*extent/state.n,upperInclusive:i===state.n-1,hex}))}};
      const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download=`lds097-${state.family}-${state.n}-intervals.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce(text('เตรียมไฟล์ชุดสีที่เลือกแล้ว','Selected scale file prepared.'));
    }
  });
  // Explicitly reveal and scroll even when the destination hash is unchanged.
  // Viewport changes can move this long-page section far below its old position.
  const revealLab = () => {
    let ancestor=host.parentElement;
    while(ancestor){if(ancestor.tagName==='DETAILS')ancestor.open=true;ancestor=ancestor.parentElement;}
    const url=new URL(location.href);url.hash='atlas-location-lab';
    history.replaceState(history.state,'',url);
    const scroll = () => {
      const root=document.documentElement,previous=root.style.scrollBehavior;
      root.style.scrollBehavior='auto';
      host.scrollIntoView({behavior:'instant',block:'start'});
      family.focus({preventScroll:true});
      root.style.scrollBehavior=previous;
    };
    scroll();
    // The outer guide may reveal a parent or close its menu in the same click.
    requestAnimationFrame(scroll);
  };
  // Inline shortcuts may choose a metric without resetting main-page state.
  document.addEventListener('click',event=>{
    if(event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || (event.button!==undefined && event.button!==0))return;
    const link=event.target.closest('a[data-lds097-li-family],a[href="#atlas-location-lab"]');
    if(!link)return;
    const requested=link.dataset.lds097LiFamily;
    if(requested && !data.metrics.some(m=>m.id===requested))return;
    event.preventDefault();
    if(requested){state.family=requested;state.n=[41,3,5,7,9].includes(+link.dataset.lds097LiN)?+link.dataset.lds097LiN:41;render(true);updateURL();}
    revealLab();
  });
  let currentLanguage=language();
  new MutationObserver(()=>{if(language()!==currentLanguage){currentLanguage=language();render();}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.addEventListener('popstate',()=>{readURL();render();});
  window.addEventListener('hashchange',()=>{readURL();render();});
  readURL();render();host.dataset.ready='true';
}

export function locationLab({root,site,bi=(th,en)=>`<span data-th>${th}</span><span data-en>${en}</span>`}) {
  const profile=JSON.parse(readFileSync(join(root,'plugins/landometer-design-system/assets/lds-0.9.7/machine/location-intelligence-0.9.7.json'),'utf8'));
  const metrics=profile.semantics.metrics.filter(m=>m.useScale!=='none');
  const scales=metrics.map(m=>profile.scales.find(s=>s.scaleId===m.id&&s.theme==='light'));
  if(metrics.length!==12 || scales.some(s=>!s || s.lut.length!==41 || s.anchors.length!==3))throw Error('Unexpected Location profile coverage');
  for(const scale of scales){const dark=profile.scales.find(s=>s.scaleId===scale.scaleId&&s.theme==='dark');for(const field of ['anchors','lut','classes'])if(JSON.stringify(scale[field])!==JSON.stringify(dark?.[field]))throw Error(`Location theme mismatch ${scale.scaleId}/${field}`);}
  const data={release:'0.9.7',profileId:profile.profileId,themePolicy:profile.themePolicy,metrics,scales,roles:profile.roles.filter(r=>metrics.some(m=>m.id===r.id)),english};
  const text=(th,en)=>bi(htmlEscape(th),htmlEscape(en));
  const filters=`<svg class="lds097-li__filters" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="lds097-li-deuteranopia" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.367322 0.860646 -0.227968 0 0 0.280085 0.672501 0.047413 0 0 -0.011820 0.042940 0.968881 0 0 0 0 0 1 0"/></filter><filter id="lds097-li-protanopia" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="0.152286 1.052583 -0.204868 0 0 0.114503 0.786281 0.099216 0 0 -0.003882 -0.048116 1.051998 0 0 0 0 0 1 0"/></filter><pattern id="lds097-li-pattern-no_data" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="var(--surface-card)"/><path d="M0 8L8 0" stroke="var(--border-default)"/></pattern><pattern id="lds097-li-pattern-withheld" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="var(--surface-card)"/><path d="M0 4H8" stroke="var(--border-default)"/></pattern><pattern id="lds097-li-pattern-not_applicable" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="var(--surface-card)"/></pattern><pattern id="lds097-li-pattern-not_defined" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="var(--surface-card)"/><circle cx="2" cy="2" r="1" fill="var(--border-default)"/></pattern></defs></svg>`;
  const html=`<section id="atlas-location-lab" class="lds097-li" aria-labelledby="lds097-li-title" data-family="li.demand" data-count="41" data-vision="normal">
<header><p class="lds097-li__eyebrow">LOCATION INTELLIGENCE · CITYMETER</p><h6 id="lds097-li-title">${text('ลองสีบนแผนที่และกราฟ แล้วหยิบไปใช้','Try the colours on a map and chart, then use them')}</h6><p>${text('เริ่มด้วยตาราง 41 ช่วงที่ CityMETER ใช้เป็นหลัก เลือกตัวแปรเพื่อดูสี ความหมาย และไฟล์ใช้งานต่อเนื่องในหน้านี้ ตัวเลือก 3/5/7/9 ระดับมีไว้สำหรับงานที่ต้องการแบ่งช่วงให้น้อยลง','Start with CityMETER’s primary 41-interval table. Choose a metric to explore its colours, meaning and usable files right here. The 3/5/7/9-class options are available for work requiring fewer intervals.')}</p></header>
<fieldset class="lds097-li__controls" disabled><legend>${text('ปรับตัวอย่าง','Adjust the example')}</legend><label for="lds097-li-family"><span>${text('ตัวแปร','Metric')}</span><select id="lds097-li-family">${metrics.map(m=>`<option value="${m.id}">${htmlEscape(m.labelTh)} / ${htmlEscape(m.labelEn)}</option>`).join('')}</select></label><label for="lds097-li-intervals"><span>${text('จำนวนช่วงสี','Colour intervals')}</span><select id="lds097-li-intervals"><option value="41" selected>41 ช่วง · CityMETER</option>${[3,5,7,9].map(n=>`<option value="${n}">${n} ระดับ / classes</option>`).join('')}</select></label><label for="lds097-li-vision"><span>${text('การมองเห็น','Vision')}</span><select id="lds097-li-vision"><option value="normal">สีปกติ / Original</option><option value="deuteranopia">Deuteranopia</option><option value="protanopia">Protanopia</option><option value="gray">ขาวดำ / Grayscale</option></select></label></fieldset>
<noscript><p>${text('ตัวอย่างคงที่แสดง Demand 41 ช่วง เปิด JavaScript เพื่อสลับตัวแปร หรือเปิดดูครบ 12 สเกลด้านล่างและดาวน์โหลดไฟล์ได้ตามปกติ','This static example shows Demand in 41 intervals. Enable JavaScript to switch metrics, or browse all 12 scales below and download the source files.')}</p></noscript>
${filters}<div data-li-body>${renderLocationLab(data,{family:'li.demand',n:41,vision:'normal'},'both')}</div><p class="lds097-li__status" data-li-status role="status" aria-live="polite" aria-atomic="true"></p><script id="lds097-li-data" type="application/json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script></section>`;
  return {html,css:locationLabCSS,js:`/* Native LDS 0.9.7 Location lab. Exact source HEX; no analytical interpolation. */\n${renderLocationLab.toString()}\n(${bootLocationLab.toString()})();\n`,counts:{metrics:metrics.length,defaultIntervals:41,classes:[3,5,7,9],lutSamples:scales.reduce((n,s)=>n+s.lut.length,0)}};
}

export const locationLabCSS=`
.lds097-li{margin-block:26px 32px;padding-block:24px;border-block:1px solid var(--border-default);min-width:0;scroll-margin-top:120px;color:var(--text-primary)}
.lds097-li *{box-sizing:border-box}
.lds097-li header,.lds097-li__context{display:block;min-width:0}
.lds097-li h6{max-width:none;min-width:0;margin:0 0 12px;font-size:clamp(1.1rem,2vw,1.4rem);line-height:1.6;overflow-wrap:anywhere}
.lds097-li p{margin:0 0 16px;max-width:82ch;line-height:1.85}
.lds097-li__eyebrow{font-size:.76rem;font-weight:600;letter-spacing:.035em;color:var(--text-secondary)}
.lds097-li code{font-size:.8rem;white-space:normal;overflow-wrap:anywhere;background:none;padding:0;color:inherit}
.lds097-li__controls{display:grid;grid-template-columns:minmax(200px,1.6fr) minmax(150px,1fr) minmax(190px,1fr);gap:16px;border:0;padding:0;margin:22px 0 28px;min-width:0}
.lds097-li__controls legend{padding:0;margin-bottom:12px;font-weight:600;font-size:.9rem}
.lds097-li__controls label{display:flex;flex-direction:column;gap:6px;min-width:0;font-size:.86rem;line-height:1.7}
.lds097-li select,.lds097-li textarea{width:100%;min-width:0;max-width:100%;font:inherit;line-height:1.6;color:var(--text-primary);background:var(--surface-card);border:1px solid var(--border-default);border-radius:6px;padding:10px 12px;min-height:48px}
.lds097-li select{font-size:.9rem}
.lds097-li :is(select,textarea,button,a,summary):focus-visible{outline:2px solid var(--text-primary);outline-offset:4px}
.lds097-li__legend-head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:8px 20px;margin:20px 0 10px}
.lds097-li__legend-head strong{font-size:.95rem;line-height:1.7}
.lds097-li__legend-head>span{font-size:.8rem;color:var(--text-secondary)}
.lds097-li__strip{display:flex;width:100%;height:32px;overflow:hidden;border:1px solid var(--border-default);border-radius:3px}
.lds097-li__strip i{display:block;min-width:0;flex:1 1 0;height:100%}
.lds097-li__ticks{display:flex;justify-content:space-between;gap:8px;font-size:.76rem;margin:6px 0 12px;color:var(--text-secondary)}
.lds097-li .lds097-li__small{font-size:.84rem;line-height:1.8;color:var(--text-secondary)}
.lds097-li__plots{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:20px 0}
.lds097-li__plots figure{display:block;margin:0;padding:18px;min-width:0;border:1px solid var(--border-default);border-radius:8px;background:var(--surface-card)}
.lds097-li__plots figcaption{font-size:.9rem;font-weight:550;line-height:1.7;margin-bottom:16px;overflow-wrap:anywhere}
.lds097-li__plots svg{display:block;width:100%;height:auto;overflow:visible}
.lds097-li__plots text{font:600 12px var(--font-body,"Bai Jamjuree",sans-serif)}
.lds097-li__states{display:flex;flex-wrap:wrap;list-style:none;gap:12px 20px;padding:0;margin:12px 0 20px;font-size:.78rem;line-height:1.75}
.lds097-li__states li{display:flex;align-items:center;gap:8px;min-width:0}
.lds097-li__states b{display:inline-flex;justify-content:center;align-items:center;min-width:28px;min-height:28px;padding:2px 4px;border:1px solid var(--border-default);font-size:.74rem;font-weight:600;border-radius:3px}
.lds097-li__details{margin:16px 0;border:1px solid var(--border-default);border-radius:7px;background:var(--surface-card);min-width:0}
.lds097-li__details summary{display:list-item;list-style:disclosure-closed;cursor:pointer;min-height:52px;padding:16px 18px;line-height:1.8;font-size:.94rem;font-weight:600;overflow-wrap:anywhere}
.lds097-li__details[open]>summary{list-style:disclosure-open}
.lds097-li__details-body{padding:0 20px 20px;min-width:0}
.lds097-li__definition{display:grid;gap:16px;margin:6px 0 20px}
.lds097-li__definition>div{min-width:0}
.lds097-li__definition dt{font-size:.86rem;font-weight:600;line-height:1.7;margin-bottom:4px}
.lds097-li__definition dd{margin:0;font-size:.9rem;line-height:1.85;overflow-wrap:anywhere}
.lds097-li__anchors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:18px 0 24px}
.lds097-li__anchors>div{min-width:0}
.lds097-li__anchors dt{font-size:.8rem;line-height:1.7}
.lds097-li__anchors i{display:block;width:100%;height:30px;border:1px solid var(--border-default);border-radius:3px;margin-bottom:6px}
.lds097-li__anchors dd{margin:4px 0 0}
.lds097-li__copy-label{display:block;margin:20px 0 8px;font-size:.84rem;line-height:1.7}
.lds097-li textarea{font: .8rem/1.8 var(--font-number,"JetBrains Mono",monospace);resize:vertical;overflow-wrap:anywhere}
.lds097-li__actions{display:flex;flex-wrap:wrap;gap:10px 18px;margin:14px 0 20px;align-items:center}
.lds097-li__actions button{min-height:44px;padding:9px 14px;border:1px solid var(--border-default);border-radius:6px;background:var(--surface-card);color:var(--text-primary);font:inherit;font-size:.84rem;line-height:1.7;cursor:pointer}
.lds097-li__actions a{display:inline-flex;align-items:center;min-height:44px;font-size:.84rem;line-height:1.7;overflow-wrap:anywhere}
.lds097-li__table-wrap{max-width:100%;overflow:auto}
.lds097-li table{border-collapse:collapse;width:100%;min-width:0;table-layout:fixed;font-size:.78rem}
.lds097-li caption{text-align:left;line-height:1.7;margin-bottom:10px;font-weight:600}
.lds097-li th,.lds097-li td{padding:10px 6px;border-bottom:1px solid var(--border-default);vertical-align:top;text-align:left;line-height:1.7;overflow-wrap:anywhere;white-space:normal}
.lds097-li thead th:first-child{width:16%}
.lds097-li thead th:nth-child(2){width:39%}
.lds097-li__table-chip{display:inline-block;width:17px;height:17px;vertical-align:middle;border:1px solid var(--border-default);margin-right:7px}
.lds097-li .lds097-li__status{font-size:.84rem;min-height:0;margin:8px 0 0;color:var(--text-secondary)}
.lds097-li__status:empty{display:none}
.lds097-li__filters{position:absolute;overflow:hidden;pointer-events:none}
.lds097-li[data-vision=deuteranopia] .lds097-li__data{filter:url(#lds097-li-deuteranopia)}
.lds097-li[data-vision=protanopia] .lds097-li__data{filter:url(#lds097-li-protanopia)}
.lds097-li[data-vision=gray] .lds097-li__data{filter:grayscale(1)}
@media(max-width:850px){.lds097-li__controls{grid-template-columns:1fr 1fr}.lds097-li__controls label:first-of-type{grid-column:1/-1}}
@media(max-width:600px){.lds097-li__plots{grid-template-columns:1fr;gap:16px}.lds097-li__plots figure{padding:14px}.lds097-li__controls{grid-template-columns:1fr}.lds097-li__controls label:first-of-type{grid-column:auto}.lds097-li__details-body{padding-inline:12px}.lds097-li__details summary{padding-inline:12px}.lds097-li__anchors{gap:8px}.lds097-li__anchors dt{font-size:.73rem}.lds097-li__anchors code{font-size:.72rem}.lds097-li__table-chip{display:block;margin:0 0 4px}.lds097-li th,.lds097-li td{font-size:.72rem;padding-inline:4px}.lds097-li code{font-size:.72rem}.lds097-li__actions button{width:100%}.lds097-li__legend-head{display:block}.lds097-li__legend-head>span{display:block;margin-top:6px}}
@media print{.lds097-li__controls,.lds097-li__actions button{display:none}.lds097-li__data{filter:none!important}.lds097-li__plots{break-inside:avoid}.lds097-li__details{break-inside:auto}}
`;
