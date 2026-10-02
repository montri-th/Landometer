/* Native LDS 0.9.7 Location lab. Exact source HEX; no analytical interpolation. */
function renderLocationLab(data, state, language = 'both') {
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
(function bootLocationLab() {
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
})();
