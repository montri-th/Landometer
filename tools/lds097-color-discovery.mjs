import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const englishMeaning = {
  'li.demand': 'Purchase occasions in the defined business category and period; not confirmed sales for a new branch.',
  'li.supply': 'Available service capacity in units comparable with demand; a POI count alone is not capacity.',
  'li.market_size': 'Total category spending in the stated market and period; not the revenue a new branch will capture.',
  'li.market_share': 'Our category sales divided by total category sales in the same market and period; not store-count share.',
  'li.spending_readiness': 'Respondents meeting both available-budget and near-term purchase-intent criteria; income alone is insufficient.',
  'li.demand_growth': 'Change from a comparable demand baseline. Zero means unchanged; a zero baseline makes percentage growth undefined.',
  'li.accessibility': 'Target-demand weight reachable within the stated travel-time threshold, mode and network conditions.',
  'li.competitive_pressure': 'Comparable rival capacity relative to category demand; declare observed versus estimated capacity.',
  'li.service_gap': 'Demand minus comparable capacity, normalized by demand. Zero means balance; a gap is not guaranteed profit.',
  'li.cannibalization': 'Modelled sales transferred from our existing branches relative to proposed-branch sales; not observed behaviour.',
  'li.occupancy_cost': 'Occupancy cost relative to sales for the same site and period; distinguish observed and forecast inputs.',
  'li.unit_economics': 'Site operating margin under the stated cost scope. Zero means operating break-even, not an investment approval.'
};
const pivotEnglish = {
  'li.demand_growth': 'Zero = no change',
  'li.service_gap': 'Zero = demand equals capacity',
  'li.unit_economics': 'Zero = operating break-even'
};

/** A static, source-bound addition inside the retained Color Atlas.
 * No palette generation or interpolation is performed here. The parent page
 * may preserve active lang/theme on links marked data-lds097-preserve-context.
 */
export function colorDiscovery({root, site, labHtml = '', sharedHtml = '', bi = (th, en) => `<span data-th>${th}</span><span data-en>${en}</span>`}) {
  const machine = join(root, 'plugins/landometer-design-system/assets/lds-0.9.7/machine');
  const files = ['color-registry.json', 'location-intelligence-0.9.7.json'];
  const [registry, profile] = files.map(name => JSON.parse(readFileSync(join(machine, name), 'utf8')));
  const palette = registry.supportingPalette;
  const metrics = profile.semantics.metrics.filter(metric => metric.useScale !== 'none');
  const swot = profile.semantics.metrics.filter(metric => metric.useScale === 'none');
  if (palette.length !== 17 || metrics.length !== 12 || profile.roles.length !== 16 || swot.length !== 4) throw new Error('Unexpected current colour-discovery source coverage');
  const text = (th, en) => bi(escape(th), escape(en));
  const scale = id => profile.scales.find(record => record.scaleId === id && record.theme === 'light');
  const lab = id => `?liFamily=${escape(id)}&amp;liN=41&amp;liVision=normal#atlas-location-lab`;
  const context = 'data-lds097-preserve-context';
  const strip = (values, kind, labelTh, labelEn) => `<div class="lds097-discovery__bar-label">${text(labelTh, labelEn)}</div><div class="lds097-discovery__bar" data-colour-strip="${kind}" data-samples="${values.length}" aria-hidden="true">${values.map((hex, i) => `<i data-sample-index="${i}" data-hex="${hex}" style="background:${hex}"></i>`).join('')}</div>`;
  const title = metric => text(metric.labelTh, metric.labelEn);
  const roleChip = role => {
    const metric = profile.semantics.metrics.find(item => item.id === role.id);
    return `<li data-location-role="${escape(role.id)}"><i class="lds097-discovery__role-dot" style="background:${role.light.hex}" aria-hidden="true"></i><div><strong>${title(metric)}</strong><span>${text(metric.useScale === 'none' ? 'มุมมองหลักฐาน · ไม่มีสเกลตัวเลข' : 'ตัวแปรที่วัดได้', metric.useScale === 'none' ? 'Evidence lens · no numeric ramp' : 'Measured variable')}</span><code>${role.light.hex}</code></div></li>`;
  };
  const cards = metrics.map(metric => {
    const row = scale(metric.id), dark = profile.scales.find(record => record.scaleId === metric.id && record.theme === 'dark');
    if (!row || !dark || JSON.stringify(row.lut) !== JSON.stringify(dark.lut) || JSON.stringify(row.classes) !== JSON.stringify(dark.classes) || JSON.stringify(row.anchors) !== JSON.stringify(dark.anchors)) throw new Error(`Theme-invariant source mismatch: ${metric.id}`);
    const labels = row.kind === 'diverging' ? [['ด้านลบ','Negative side'], ['จุดอ้างอิง','Reference'], ['ด้านบวก','Positive side']] : [['ค่าน้อย','Lower'], ['ช่วงกลาง','Middle'], ['ค่ามาก','Higher']];
    const meaning = row.kind === 'diverging' ? text(`ศูนย์: ${metric.pivot.meaningTh}`, pivotEnglish[metric.id]) : text('หัว → กลาง → ท้าย: ค่าสูงเข้มขึ้น สีกลางไม่ใช่จุดศูนย์', 'Start → middle → end: higher values deepen; the middle hue is not zero.');
    return `<article class="lds097-discovery__scale" data-location-scale="${escape(metric.id)}" data-scale-kind="${row.kind}"><header><p class="lds097-discovery__kind">${text(row.kind === 'sequential' ? 'ทางเดียว' : 'สองทาง', row.kind === 'sequential' ? 'Sequential' : 'Diverging')}</p><h6>${title(metric)}</h6><code>${escape(metric.id)}</code></header><p class="lds097-discovery__meaning">${text(metric.highMeaning, englishMeaning[metric.id])}</p>${strip(row.lut, 'lut41', '41 ค่าสีที่กำหนดไว้', '41 exact colour samples')}<details class="lds097-discovery__class-option"><summary>${text('ตัวเลือกเสริม · 5 ระดับ', 'Optional · five classes')}</summary>${strip(row.classes['5'], 'classes5', 'ตัวอย่าง 5 ระดับ', 'Five-class example')}</details><dl class="lds097-discovery__anchors">${row.anchors.map((hex, i) => `<div data-anchor-index="${i}" data-hex="${hex}"><dt><i style="background:${hex}" aria-hidden="true"></i>${text(...labels[i])}</dt><dd><code>${hex}</code></dd></div>`).join('')}</dl><p class="lds097-discovery__pivot">${meaning}</p><a data-lds097-li-family="${escape(metric.id)}" href="${lab(metric.id)}">${text('ลองบนแผนที่และดูเกณฑ์ของตัวแปร', 'Try the map and read the metric definition')}</a></article>`;
  }).join('\n');
  const previews = ['li.demand','li.supply','li.market_share'].map(id => {
    const metric = metrics.find(item => item.id === id), row = scale(id);
    return `<a data-lds097-li-family="${escape(id)}" class="lds097-discovery__preview" href="${lab(id)}"><strong>${title(metric)}</strong><span class="lds097-discovery__bar" data-preview-family="${id}" aria-hidden="true">${row.lut.map(hex => `<i data-hex="${hex}" style="background:${hex}"></i>`).join('')}</span><span>${text('ทดลอง 41 ช่วงด้านล่าง ↓', 'Try 41 steps below ↓')}</span></a>`;
  }).join('');
  const html = `<section class="lds097-discovery" id="atlas-current-colours" aria-labelledby="atlas-current-colours-title" data-colour-discovery="0.9.7">
<header><p class="lds097-discovery__eyebrow">Every analytical family · LDS 0.9.7</p><h5 id="atlas-current-colours-title">${text('32 สเกลข้อมูล · Story + Location Intelligence', '32 analytical scales · Story + Location Intelligence')}</h5><p>${text('เลือกต่อเนื่องในที่เดียว: ข้อมูลทั่วไป 20 ตระกูล + Location 12 สเกล ใช้ 41 ช่วงเป็นหลักสำหรับ CityMETER พร้อม Story 17 สีสำหรับกราฟิกเสริม และ 16 บทบาท Location สีข้อมูลคง HEX และทิศทางค่าเดิมทั้งพื้นสว่างและมืด', 'Choose in one place: 20 shared families + 12 Location scales, with 41 steps as the primary CityMETER view. Explore 17 Story colours for supporting graphics and 16 Location roles alongside them. Data HEX values and value direction remain the same in both themes.')}</p><nav class="lds097-discovery__links" aria-label="Current colour collections"><a href="#atlas-shared-scales">${text('ข้อมูลทั่วไป · 20 ตระกูล', 'Shared data · 20 families')}</a><a href="#atlas-location-scales">${text('Location · 12 สเกล', 'Location · 12 scales')}</a><a href="#atlas-story-vocabulary">${text('Story · 17 สี', 'Story · 17 colours')}</a><a href="#atlas-location-roles">${text('16 บทบาท รวม SWOT', '16 roles including SWOT')}</a></nav></header>
<section id="atlas-story-vocabulary" aria-labelledby="atlas-story-vocabulary-title"><h6 id="atlas-story-vocabulary-title">${text('Story · สีเสริมสำหรับเล่าเรื่อง', 'Story · a supporting colour vocabulary')}</h6><p>${text('คง Brand Energy สำหรับงานหลักของแบรนด์ ชุดนี้มี Paper 1 สีและสีบทบาทอีก 16 สี ไม่ใช่คำแนะนำให้ใช้ 17 series พร้อมกันหรือแทนสีตามสถานะของระบบ', 'Keep Brand Energy for primary brand work. This set contains Paper plus 16 role colours; it is not a recommendation for 17 simultaneous chart series or a replacement for system-state colours.')}</p><ul class="lds097-discovery__palette">${palette.map(item => {const names=item.name.split(' / ');return `<li data-story-colour="${escape(item.id)}"><i class="lds097-discovery__swatch" data-hex="${item.hex}" style="background:${item.hex}" aria-hidden="true"></i><strong>${text(names[1] || names[0], names[0])}</strong><code>${item.hex}</code></li>`;}).join('')}</ul><a ${context} href="color-atlas.html?lang=th&amp;theme=light#story">${text('ดูการจัดชุด Story และเทียบสเกลเดิม', 'Explore Story combinations and analytical comparisons')}</a></section>
${sharedHtml}
<section id="atlas-location-scales" aria-labelledby="atlas-location-scales-title"><h6 id="atlas-location-scales-title">${text('Location Intelligence · 12 ตัวแปรที่มีสเกล', 'Location Intelligence · 12 measured scales')}</h6><p>${text('9 สเกลทางเดียว + 3 สเกลสองทาง ใช้ 41 ช่วงเป็นหลักสำหรับ CityMETER พร้อมสามสีหลักหัว–กลาง–ท้าย เลือกตัวแปรจากความหมาย หน่วย ตัวหาร และหลักฐาน แล้วดูผลบนแผนที่ด้านล่าง ชุด 3/5/7/9 ระดับเป็นตัวเลือกเสริม', 'Nine sequential and three diverging scales. CityMETER starts with all 41 steps and three start–middle–end anchors. Choose by meaning, unit, denominator and evidence, then try the map below. The 3/5/7/9-class sets are optional.')}</p><div class="lds097-discovery__previews">${previews}</div>${labHtml}<details class="lds097-discovery__details" id="atlas-location-gallery"><summary>${text('เปิดดูครบ 12 สเกล พร้อมสีหัว–กลาง–ท้าย', 'Show all 12 scales with start, middle and end anchors')}</summary><div class="lds097-discovery__scale-grid">${cards}</div></details><p class="lds097-discovery__note">${text('สีและทิศทางค่าไม่เปลี่ยนเมื่อสลับธีม บางเส้นทางใช้สีร่วมกับ Story อย่างตั้งใจ ต้องอ่านชื่อ หน่วย และคำอธิบายร่วมด้วย สีอย่างเดียวไม่รับรองว่าทุกคู่แยกออกได้สำหรับทุกคน', 'Theme changes preserve colours and value direction. Some routes intentionally reuse Story colours. Retain names, units and explanations; colour alone does not guarantee that every viewer can distinguish every pair.')}</p><div class="lds097-discovery__links"><a href="#atlas-location-lab">${text('กลับไปทดลอง 41 ช่วงด้านบน', 'Back to the 41-step lab above')}</a><a href="normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md" download>${text('ดาวน์โหลด Location Profile · MD', 'Download Location Profile · MD')}</a><a href="normative/Location-Intelligence-Profile-for-LDS-v0.9.7.json" download>${text('สำหรับเครื่องมือ · JSON', 'Machine alternative · JSON')}</a></div><p>${text('งานเลือกทำเลใช้ LDS 0.9.7 ฉบับเต็ม + Location Profile ถ้าเป็นงาน ijji หรือ CityChat ให้ใช้ Add-on ของผลิตภัณฑ์นั้นเพิ่มด้วย ไฟล์ MD รวมส่วนที่คนและเครื่องมืออ่านได้แล้ว ไม่ต้องอัปโหลด JSON ซ้ำ', 'For location work, use the complete LDS 0.9.7 base plus the Location Profile. Add the matching product Add-on for ijji or CityChat. The MD contains human and machine content; uploading JSON as well is unnecessary.')}</p></section>
<section id="atlas-location-roles" aria-labelledby="atlas-location-roles-title"><h6 id="atlas-location-roles-title">${text('16 บทบาท · แยกตัวแปรออกจากมุมมอง SWOT', '16 roles · distinguish measurements from SWOT lenses')}</h6><p>${text('Demand, Supply และอีก 10 ตัวแปรใช้สเกลด้านบน ส่วน Strength, Weakness, Opportunity, Threat เป็นมุมมองหลักฐาน ใช้ป้ายชื่อและสีประจำบทบาท ไม่มีคะแนนหรือ gradient อัตโนมัติ', 'Demand, Supply and ten other measurements use the scales above. Strength, Weakness, Opportunity and Threat are evidence lenses: use labels and role colours, without automatic scores or gradients.')}</p><details class="lds097-discovery__details"><summary>${text('เปิดสีประจำบทบาททั้ง 16 แบบ', 'Show all 16 role colours')}</summary><ul class="lds097-discovery__roles">${profile.roles.map(roleChip).join('')}</ul></details><p class="lds097-discovery__note">${text('สีไม่ยืนยันจำนวนลูกค้า พฤติกรรมจริง หรือผลตอบแทนของทำเล ต้องมีนิยามตัวแปร แหล่งข้อมูล ช่วงเวลา และความไม่แน่นอนกำกับเสมอ', 'Colour does not establish customer counts, actual behaviour or site returns. Always retain metric definitions, source, period and uncertainty.')}</p></section>
</section>`;
  return {html, css: colorDiscoveryCSS, counts:{story:palette.length,roles:profile.roles.length,metrics:metrics.length,sequential:metrics.filter(metric=>metric.useScale==='sequential').length,diverging:metrics.filter(metric=>metric.useScale==='diverging').length,swot:swot.length}, sourceFiles:files.map(name=>({path:join(machine,name),sha256:createHash('sha256').update(readFileSync(join(machine,name))).digest('hex')}))};
}

export const colorDiscoveryCSS = `
/* Exact source colours; layout only. Data fills remain identical in both themes. */
.lds097-discovery{min-width:0;margin-block:0;padding-block:0;color:var(--text-primary)}
.lds097-discovery *{box-sizing:border-box}
.lds097-discovery>header,.lds097-discovery>section{min-width:0}
.lds097-discovery>section{margin-top:40px;padding-top:28px;border-top:1px solid var(--border-hairline);scroll-margin-top:120px}
#atlas-shared-gallery>.lds097-shared-gallery-body{padding:0 20px 24px;min-width:0}
#atlas-shared-gallery .lds097-shared-comparison{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:8px 0 24px}
#atlas-shared-scales #scale-lab{padding-block:20px;margin-top:0}
#atlas-shared-scales>.section-head{display:block}
#atlas-shared-gallery .details-body{max-width:100%;overflow:auto}
.lds097-discovery h5,.lds097-discovery h6{max-width:none;min-width:0;margin:0 0 12px;line-height:1.55;word-break:normal;overflow-wrap:anywhere}
.lds097-discovery h5{font-size:clamp(1.35rem,2.5vw,1.85rem)}
.lds097-discovery h6{font-size:1.12rem}
.lds097-discovery p{margin:0 0 16px;max-width:82ch;line-height:1.85;word-break:normal}
.lds097-discovery__eyebrow,.lds097-discovery__kind{font-size:.8rem;font-weight:650;letter-spacing:.035em;color:var(--text-secondary)}
.lds097-discovery__links{display:flex;flex-wrap:wrap;gap:8px 24px;margin-block:14px 20px}
.lds097-discovery a{overflow-wrap:anywhere;text-underline-offset:.2em}
.lds097-discovery__links a,.lds097-discovery__scale>a{display:inline-flex;align-items:center;min-height:44px}
.lds097-discovery__palette{list-style:none;margin:20px 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:18px 14px}
.lds097-discovery__palette li{min-width:0;display:flex;flex-direction:column;gap:5px}
.lds097-discovery__palette strong{font-size:.84rem;font-weight:550;line-height:1.5}
.lds097-discovery code{font-size:.77rem;white-space:normal;overflow-wrap:anywhere;color:var(--text-secondary);background:none;padding:0}
.lds097-discovery__swatch{height:46px;width:100%;display:block;border:1px solid var(--border-default);border-radius:4px}
.lds097-discovery__previews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-block:24px}
.lds097-discovery__preview{display:flex;min-width:0;flex-direction:column;gap:10px;text-decoration:none}
.lds097-discovery__preview strong{font-size:1rem;line-height:1.7}
.lds097-discovery__preview>span:last-child{font-size:.85rem;text-decoration:underline}
.lds097-discovery__bar{display:flex;min-width:0;overflow:hidden;width:100%;height:28px;border:1px solid var(--border-default);border-radius:3px}
.lds097-discovery__bar i{display:block;min-width:0;flex:1 1 0;height:100%}
.lds097-discovery__bar-label{font-size:.8rem;line-height:1.7;margin-top:12px;margin-bottom:5px;color:var(--text-secondary)}
.lds097-discovery__details{margin-block:20px;border:1px solid var(--border-default);border-radius:8px;background:var(--surface-card)}
.lds097-discovery__details>summary{display:list-item;list-style:disclosure-closed;margin:0;padding:18px 20px;min-height:52px;font-weight:600;line-height:1.8;cursor:pointer;overflow-wrap:anywhere}
.lds097-discovery__details[open]>summary{list-style:disclosure-open}
.lds097-discovery__details>summary::marker{color:var(--text-secondary)}
.lds097-discovery__scale-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px 28px;padding:12px 24px 28px}
.lds097-discovery__scale{display:flex;flex-direction:column;min-width:0;padding-top:20px;border-top:1px solid var(--border-hairline)}
.lds097-discovery__scale header{min-width:0;display:block}
.lds097-discovery__scale header p{margin-bottom:4px}
.lds097-discovery__scale h6{font-size:1.05rem;line-height:1.75;margin-bottom:6px}
.lds097-discovery__scale .lds097-discovery__meaning{font-size:.86rem;line-height:1.8;margin-top:14px;margin-bottom:8px}
.lds097-discovery__anchors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:18px 0 14px}
.lds097-discovery__anchors>div{min-width:0}
.lds097-discovery__anchors dt{display:flex;flex-direction:column;gap:5px;font-size:.77rem;line-height:1.6;font-weight:500}
.lds097-discovery__anchors dt i{height:22px;width:100%;display:block;border:1px solid var(--border-default);border-radius:2px}
.lds097-discovery__anchors dd{margin:4px 0 0}
.lds097-discovery__anchors code{font-size:.71rem;white-space:nowrap;overflow-wrap:normal}
.lds097-discovery .lds097-discovery__pivot,.lds097-discovery .lds097-discovery__note{font-size:.84rem;color:var(--text-secondary);line-height:1.8}
.lds097-discovery__scale>a{margin-top:auto;font-size:.84rem;line-height:1.8}
.lds097-discovery__roles{list-style:none;margin:0;padding:8px 24px 24px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
.lds097-discovery__roles li{display:flex;align-items:flex-start;gap:10px;min-width:0}
.lds097-discovery__role-dot{display:block;flex:none;width:24px;height:24px;border-radius:50%;border:1px solid var(--border-default);margin-top:3px}
.lds097-discovery__roles strong,.lds097-discovery__roles span,.lds097-discovery__roles code{display:block;line-height:1.75}
.lds097-discovery__roles strong{font-size:.85rem;font-weight:600}
.lds097-discovery__roles div>span{font-size:.77rem;color:var(--text-secondary)}
.lds097-discovery :is(a,summary):focus-visible{outline:2px solid var(--focus-ring);outline-offset:5px}
@media(max-width:1100px){.lds097-discovery__scale-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lds097-discovery__roles{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:700px){.lds097-discovery__previews,.lds097-discovery__scale-grid{grid-template-columns:1fr}.lds097-discovery__previews{gap:20px}.lds097-discovery__scale-grid{padding:0 16px 22px;gap:24px}.lds097-discovery__roles{grid-template-columns:repeat(2,minmax(0,1fr));padding-inline:16px;gap:20px 12px}.lds097-discovery__details>summary{padding:15px 16px}.lds097-discovery__palette{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 10px}.lds097-discovery__anchors code{font-size:.77rem}}
@media print{.lds097-discovery__details>div,.lds097-discovery__details>ul{display:grid}.lds097-discovery__links{display:none}}
`;
