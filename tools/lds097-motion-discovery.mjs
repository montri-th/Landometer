// A discoverable, static-first projection of the unchanged LDS 0.9.7 motion
// contracts. This module never modifies or re-exports governed artwork.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';

export const motionKinds = [
  {id:'logo', name:'Logo assembly', th:'เปิดเรื่องด้วยจังหวะประกอบร่าง', en:'Open with the assembly sequence', beat:'opening', job:'animated_brand_opening', cycle:6000, purposeTh:'เปิดเรื่องของแบรนด์ ใช้เป็นภาพประกอบการเปิดเรื่อง ไม่แทนโลโก้ในเมนูหรือภาพแชร์', purposeEn:'Introduce the brand. This opening treatment does not replace the official logo in navigation or sharing.'},
  {id:'dial', name:'Dial', th:'ตั้งต้นให้เห็นทิศทาง', en:'Establish a direction', beat:'opening', job:'orientation', cycle:3000, purposeTh:'ช่วยตั้งต้นและชี้ทิศทางของเรื่อง โดยไม่ทำหน้าที่เป็นมาตรวัดข้อมูล', purposeEn:'Orient the reader at the start of a story. The dial does not measure data.'},
  {id:'rings', name:'Rings', th:'เชื่อมเรื่องกับพื้นที่', en:'Move between spatial contexts', beat:'transition', job:'spatial_transition', cycle:3000, purposeTh:'พาไปยังบริบทหรือพื้นที่ถัดไป ไม่แทนเขตบริการ รัศมีจริง หรือข้อมูลแผนที่', purposeEn:'Introduce the next place or context. The rings do not represent a service boundary, radius or mapped evidence.'},
  {id:'layers', name:'Layers', th:'คลี่เรื่องให้เห็นทีละชั้น', en:'Introduce another layer', beat:'transition', job:'layering', cycle:3000, purposeTh:'แบ่งและเชื่อมชั้นของเนื้อหา โดยไม่สื่อจำนวน ชั้นข้อมูลจริง หรือความคืบหน้า', purposeEn:'Separate and connect parts of a story, without encoding a count, actual data layers or progress.'},
  {id:'slice', name:'Slice', th:'ปิดเรื่องก่อนก้าวต่อ', en:'Close before the next step', beat:'closing', job:'action_closure', cycle:3000, purposeTh:'ช่วยปิดช่วงของเรื่องและส่งต่อไปยังขั้นถัดไป โดยเว้นพื้นที่ให้ปุ่มหลัก', purposeEn:'Close a story beat and lead into the next step while keeping the primary action clear.'},
  {id:'cultivate', name:'Cultivate', th:'ส่งต่อสิ่งที่เติบโตจากเรื่องนี้', en:'Close with a handoff', beat:'closing', job:'handoff', cycle:3000, purposeTh:'ปิดเรื่องและส่งต่อให้คนไปทำต่อ ไม่ใช้เป็นหลักฐานการเติบโตหรือความสำเร็จ', purposeEn:'Close and hand the work to the reader. The motif is not evidence of growth or success.'}
];

export function motionDiscovery({root, site, bi}) {
  const normative = JSON.parse(readFileSync(join(site,'normative/Landometer-Design-System-v0.9.7.json'),'utf8'));
  const records = normative.machine.assetFiles;
  const kitRoot = join(root,'plugins/landometer-design-system/assets/lds-0.9.7/build-kit/motif');
  for (const record of records.filter(r=>r.path.includes('/build-kit/motif/'))) {
    const path=record.path.split('/build-kit/motif/')[1];
    const bytes=readFileSync(join(kitRoot,path));
    if(createHash('sha256').update(bytes).digest('hex')!==record.sha256) throw Error(`Motion discovery received changed asset: ${path}`);
  }
  const b=bi||((th,en)=>`<span data-th>${th}</span><span data-en>${en}</span>`);
  const still=(kind,variant)=>`lds/motif/svg/${kind}-${variant}.svg`;
  const beats={opening:['เปิดเรื่อง','Opening'],transition:['เปลี่ยนบริบท','Transition'],closing:['ส่งต่อ','Closing']};
  const cards=motionKinds.map(k=>`<article class="lds097-motion-card" data-motion-catalogue-kind="${k.id}">
    <header><p class="resource-meta">${b(...beats[k.beat])} · ${k.name}</p><h4>${b(k.th,k.en)}</h4></header>
    <div class="lds097-motion-pair">
      <figure><div class="lds097-motion-still" data-host-surface="surface.card@light"><img src="${still(k.id,'full')}" alt="" aria-hidden="true" width="600" height="300" loading="lazy" data-motif-static="${k.id}-full" data-host-surface="surface.card@light"></div><figcaption>${b('Full · พื้นสว่าง','Full · light carrier')} <a href="${still(k.id,'full')}" download="landometer-${k.id}-full.svg">${b('ดาวน์โหลด SVG','Download SVG')}</a></figcaption></figure>
      <figure><div class="lds097-motion-still" data-host-surface="surface.card@dark"><img src="${still(k.id,'quiet')}" alt="" aria-hidden="true" width="600" height="300" loading="lazy" data-motif-static="${k.id}-quiet" data-host-surface="surface.card@dark"></div><figcaption>${b('Quiet · พื้นมืด','Quiet · dark carrier')} <a href="${still(k.id,'quiet')}" download="landometer-${k.id}-quiet.svg">${b('ดาวน์โหลด SVG','Download SVG')}</a></figcaption></figure>
    </div><p>${b(k.purposeTh,k.purposeEn)}</p>
    <button type="button" class="lds097-motion-preview-link" data-preview-motif="${k.id}" hidden>${b('ลองการเคลื่อนไหวนี้','Try this motion')}</button>
  </article>`).join('\n');
  const fullKit='https://github.com/montri-th/Landometer/releases/download/v0.9.7/landometer-design-system-0.9.7.zip';
  const webFiles=[['landometer-motifs.css','Runtime styles','รูปแบบการเคลื่อนไหว'],['landometer-motifs.js','Approved artwork runtime','runtime ของภาพต้นฉบับ'],['motion-controller.js','One page pause/resume control','ปุ่มหยุดและเล่นต่อร่วมกันทั้งหน้า'],['motif-frame.css','Frame and final-state styles','รูปแบบเฟรมและภาพสุดท้าย'],['motif-frame.js','Placement and playback lifecycle','กติกาพื้นที่วางและการเล่น'],['motif-library.json','Exact assets and hashes','รายการไฟล์และ hash ต้นฉบับ']];
  const snippet=`<!-- Keep the supplied lds/motif/ directory and svg/ files together. -->
<meta name="color-scheme" content="light dark">
<link rel="stylesheet" href="lds/motif/landometer-motifs.css">
<link rel="stylesheet" href="lds/motif/motif-frame.css">
<script defer src="lds/motif/landometer-motifs.js"></script>
<script defer src="lds/motif/motion-controller.js"></script>
<script defer src="lds/motif/motif-frame.js"></script>

<!-- One page-level control; use your page's current language. -->
<button type="button" class="lds-motion-pause" aria-pressed="false"
  data-label-pause="Pause motion" data-label-resume="Resume motion">
  Pause motion
</button>

<!-- Example: a full opening motif on a fixed, approved light carrier. -->
<div class="lds-motif-frame" data-kind="logo"
  data-job="animated_brand_opening" data-beat="opening"
  data-variant="full" data-host-surface="surface.card@light"
  data-cycle-ms="6000">
  <lm-motif kind="logo" ink="blue" autoplay="false"></lm-motif>
  <noscript><img src="lds/motif/svg/logo-full.svg" alt=""
    width="600" height="300"></noscript>
</div>`;
  const escapedSnippet=snippet.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const html=`<section class="lds097-motion-discovery" id="identity-motion" aria-labelledby="lds097-motion-title" data-motion-discovery="0.9.7"><div class="container"><span id="animated-logo-motifs" class="lds097-motion-anchor" aria-hidden="true"></span>
  <header class="lds097-motion-intro"><p class="eyebrow">ANIMATED LOGO + MOTIF · LDS 0.9.7</p><h3 id="lds097-motion-title">${b('ให้การเคลื่อนไหวช่วยเล่าเรื่อง','Give motion a part in the story')}</h3><p>${b('กฎ animated logo และ motif อยู่ใน LDS 0.9.7 ฉบับเต็มแล้ว เลือกหน้าที่ ดูตัวอย่าง แล้วหยิบไฟล์ชุดเดียวกันไปใช้ได้จากตรงนี้','Animated-logo and motif rules are already part of the complete LDS 0.9.7. Choose a purpose, try the example, and take the exact files from here.')}</p></header>
  <ol class="lds097-motion-beats"><li><strong>${b('01 · เปิดเรื่อง','01 · Opening')}</strong><span>Logo assembly / Dial</span><p>${b('ให้คนรู้ว่ากำลังเข้าสู่เรื่องอะไร','Help the reader enter the story.')}</p></li><li><strong>${b('02 · เปลี่ยนบริบท','02 · Transition')}</strong><span>Rings / Layers</span><p>${b('เชื่อมพื้นที่หรือชั้นของเรื่องเข้าด้วยกัน','Connect the next place or layer.')}</p></li><li><strong>${b('03 · ส่งต่อ','03 · Closing')}</strong><span>Slice / Cultivate</span><p>${b('จบช่วงของเรื่อง แล้วเปิดทางให้คนไปต่อ','Close the story beat and let people continue.')}</p></li></ol>
  <div class="lds097-motion-lab" id="motif-preview" data-task-surface="motion-example">
    <div class="lds097-motion-lab-copy"><h4>${b('เลือกหนึ่งจังหวะ แล้วลองดู','Choose one motion to try')}</h4><p>${b('ตัวอย่างเริ่มเป็นภาพนิ่ง กดเล่นเพื่อดูทีละแบบ สลับธีมของหน้าเพื่อดู full บนพื้นสว่างและ quiet บนพื้นมืด','The example starts as a still. Play one motif at a time; use the page theme to compare full on light and quiet on dark.')}</p>
      <div class="lds097-motion-controls" data-motion-controls hidden><label for="motif-kind">${b('รูปแบบ','Motif')}</label><select id="motif-kind">${motionKinds.map(k=>`<option value="${k.id}" data-label-th="${k.name} · ${k.th}" data-label-en="${k.name} · ${k.en}">${k.name} · ${k.th}</option>`).join('')}</select>
        <div class="lds097-motion-buttons"><button type="button" id="motif-start">${b('เล่นตัวอย่าง','Play example')}</button><button type="button" id="motif-pause" class="lds-motion-pause" aria-pressed="true" disabled>${b('หยุดชั่วคราว','Pause')}</button></div>
        <label class="lds097-motion-reduced"><input type="checkbox" id="motif-final-state">${b('ทดลองแบบลดการเคลื่อนไหว · แสดงภาพสุดท้าย','Try reduced motion · show the final still')}</label>
      </div>
      <p class="lds097-motion-status" id="motif-status" role="status" aria-live="polite">${b('ภาพสุดท้ายพร้อมใช้งาน แม้ไม่มี JavaScript','The final still is available even without JavaScript.')}</p>
      <p class="lds097-motion-rule">${b('เมื่อเล่น: เห็นอย่างน้อย 14% จึงเริ่ม รอบ logo 6 วินาที / motif อื่น 3 วินาที ออกนอกจอหรือกดหยุดจะเห็นภาพสุดท้าย การตั้งค่าลดการเคลื่อนไหวของเครื่องมีผลเสมอ','When enabled: play at 14% visibility; logo cycles every 6 seconds and other motifs every 3 seconds. Leaving the viewport or pausing shows the final still. Your device’s reduced-motion preference always applies.')}</p>
    </div>
    <div class="lds097-motion-stage" data-host-surface="surface.card"><div class="lds097-motion-stage-still"><img data-preview-still="light" src="${still('logo','full')}" alt="" aria-hidden="true" width="600" height="300"><img data-preview-still="dark" src="${still('logo','quiet')}" alt="" aria-hidden="true" width="600" height="300"></div><div id="motif-runtime-slot"></div><p class="lds097-motion-stage-caption"><strong id="motif-current-name">Logo assembly</strong><span id="motif-current-purpose">${b('ภาพประกอบการเปิดเรื่อง · ไม่ใช่ไฟล์โลโก้ทางการ','An opening treatment · separate from official logo artwork')}</span></p></div>
  </div>
  <p class="lds097-motion-boundary">${b('หน้าใช้งานจริงมีได้ไม่เกิน 3 จังหวะต่อเส้นทาง หรือ 1 จังหวะต่อพื้นที่ทำงาน ไม่วางทับคำตอบแรก หลักฐานหลัก หรือปุ่มหลัก ตัวอย่างทั้ง 6 ด้านล่างจึงแสดงเป็นภาพนิ่ง','A real route has at most three motion moments, or one per task surface. Keep the first answer, primary proof and primary action clear. The six specimens below remain still.')}</p>
  <div class="lds097-motion-catalogue">${cards}</div>
  <div class="lds097-motion-handoff"><div><h4>${b('หยิบใช้ให้ตรงกับงาน','Take what the work needs')}</h4><p>${b('ภาพนิ่งใช้ SVG จากตัวอย่างได้เลย งานเว็บที่เคลื่อนไหวใช้ runtime, MotifFrame, MotionController และ fallback ที่อยู่ในชุดเดียวกัน ห้ามวาดใหม่หรือเปลี่ยนสีของ motif','For a still, download its SVG above. For web motion, use the supplied runtime, MotifFrame, MotionController and fallback together. Do not redraw or recolour the motif.')}</p><ul><li><a href="${fullKit}">${b('ดาวน์โหลด LDS 0.9.7 พร้อม runtime และภาพนิ่ง','Download LDS 0.9.7 with runtimes and stills')}</a></li><li><a href="normative/Landometer-Design-System-v0.9.7.md">${b('กฎฉบับเต็ม §8.5–8.6 · human + machine readable','Complete rules §8.5–8.6 · human + machine readable')}</a></li><li><a href="https://montri-th.github.io/motif/#landometer-logo-assembly">${b('ดู Logo assembly ใน Motif Studio','View Logo assembly in Motif Studio')}</a></li></ul></div>
    <div><h4>${b('ติดตั้งแล้วมีผลอย่างไร','What installation gives you')}</h4><p>${b('Project Source ที่มี LDS 0.9.7 มีข้อกำหนดและรายการไฟล์แล้ว ไม่ต้องเพิ่มกฎจาก 0.9.4 ส่วนแพ็กเกจ skill มีไฟล์ motion พร้อมใช้ การติดตั้งไม่ได้ใส่ animation ให้ทุกชิ้นงานอัตโนมัติ ผู้สร้างยังต้องเลือกหน้าที่ วางไฟล์ และตรวจการเล่นจริง','A Project Source containing LDS 0.9.7 already has the rules and file references; no 0.9.4 rule document is needed. The skill package also includes motion files. Installation does not automatically animate every output: the author still selects a purpose, includes the files and checks playback.')}</p></div>
  </div>
  <details class="lds097-motion-products lds097-motion-files" id="motion-web-files"><summary>${b('ไฟล์สำหรับเว็บ และตัวอย่างการประกอบ','Web files and an integration example')}</summary><div class="lds097-motion-web-files"><p>${b('ดาวน์โหลดชุดเต็มแล้วคงโครงสร้างโฟลเดอร์ไว้ หรือตรวจไฟล์แต่ละรายการด้านล่าง ใช้ CSS และ JavaScript ต้นฉบับร่วมกับภาพนิ่งของชนิดที่เลือก','Download the complete kit and keep its folder structure, or inspect the individual files below. Pair the original CSS and JavaScript with the chosen motif’s final-state SVG.')}</p><ul>${webFiles.map(([file,en,th])=>`<li><a href="lds/motif/${file}" download><code>${file}</code></a><span>${b(th,en)}</span></li>`).join('')}</ul><p>${b('ตัวอย่างนี้แสดง logo assembly บนพื้นสว่างคงที่ แม้หน้าใช้ธีมมืด สำหรับการสลับ full/quiet ตามธีม ให้ใช้ MotifFrame ของตัวอย่างด้านบนและ SVG ทั้งสองแบบ ตรวจ viewport, pause, reduced motion, no-JavaScript และ print ในชิ้นงานจริงก่อนส่งต่อ','This example places logo assembly on a fixed light carrier, even when the page is dark. To switch full/quiet with the theme, use the preview’s MotifFrame pattern and both SVGs. Check visibility, pause, reduced motion, no JavaScript and print in the actual output before handoff.')}</p><pre tabindex="0" aria-label="Motion integration HTML"><code>${escapedSnippet}</code></pre></div></details>
  <details class="lds097-motion-products"><summary>${b('งาน ijji และ CityChat ใช้กฎใดเพิ่ม','What changes for ijji and CityChat')}</summary><div class="lds097-motion-product-grid"><article><h4>ijji</h4><p>${b('ใช้ LDS ฉบับเต็มคู่กับ ijji Add-on ปัจจุบัน ชุด four-beat ใช้ภาพนิ่งเท่านั้น ส่วน logo-sting ที่อนุมัติแยกเป็นภาพเปิดตัวของเว็บเฉพาะชิ้นงาน มี fallback และ lifecycle ของตัวเอง ตัวอย่างเคลื่อนไหวใน Studio ไม่ได้ขยายสิทธิ์ของ Add-on','Use the complete LDS with the current ijji Add-on. Its four-beat motifs are static only. A separately approved logo sting is an artifact-local website opening with its own fallback and lifecycle. Studio examples do not broaden the Add-on’s permissions.')}</p><a href="normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.7.md">ijji Add-on 0.5.5 · LDS 0.9.7</a></article><article><h4>CityChat</h4><p>${b('ใช้ conversation motif ตามไฟล์ พื้นที่วาง และบทบาทที่อนุมัติ การเคลื่อนไหว logo bubbles จำกัดเฉพาะบันทึกของชิ้นงานนั้น ไม่ใช่อนุญาตให้ขยับหรือวาดโลโก้ใหม่ทั่วไป','Use conversation motifs only with their approved files, carriers and roles. Logo-bubble motion remains limited to its exact artifact approval; it is not a general permission to animate or redraw the logo.')}</p><a href="normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md">CityChat Add-on 0.9.2 · LDS 0.9.7</a></article></div></details>
  <script type="application/json" id="motion-discovery-records">${JSON.stringify(motionKinds)}</script>
</div></section>`;
  return {html,css:motionCss,js:motionJs};
}

const motionCss=`/* Static-first motion discovery; exact governed artwork lives in lds/motif. */
.lds097-motion-discovery{margin-block:3rem;scroll-margin-top:7rem;min-width:0}
.lds097-motion-discovery *{box-sizing:border-box}
.lds097-motion-discovery h3,.lds097-motion-discovery h4,.lds097-motion-discovery p{max-width:none;word-break:normal;overflow-wrap:break-word}
.lds097-motion-discovery h3{font-size:clamp(1.65rem,3vw,2.45rem);line-height:1.4;margin:0 0 1rem}
.lds097-motion-discovery h4{font-size:1.15rem;line-height:1.55;margin:.4rem 0 .85rem}
.lds097-motion-discovery p{line-height:1.8;margin:0 0 1rem}
.lds097-motion-intro{max-width:76ch}.lds097-motion-beats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem;list-style:none;padding:0;margin:2rem 0}
.lds097-motion-beats strong,.lds097-motion-beats span{display:block}.lds097-motion-beats span{margin:.4rem 0;font-size:.9em}
.lds097-motion-lab{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:2rem;align-items:center;padding-block:2rem;border-block:1px solid var(--border-default);scroll-margin-top:7rem}
.lds097-motion-controls{display:grid;gap:.7rem}.lds097-motion-controls[hidden],.lds097-motion-discovery [hidden]{display:none!important}
.lds097-motion-discovery select,.lds097-motion-discovery button{font:inherit;min-height:44px;border:1px solid var(--border-default);background:var(--surface-card);color:var(--text-primary);border-radius:12px;padding:.65rem 1rem;max-width:100%}
.lds097-motion-discovery select{width:100%}.lds097-motion-discovery button{cursor:pointer}.lds097-motion-discovery button:disabled{cursor:default;opacity:.6}
.lds097-motion-discovery :is(button,select,input,a,summary):focus-visible{outline:2px solid var(--focus-ring);outline-offset:4px}
.lds097-motion-buttons{display:flex;flex-wrap:wrap;gap:.65rem}.lds097-motion-reduced{display:flex;align-items:flex-start;gap:.65rem;font-size:.9em;line-height:1.7}.lds097-motion-reduced input{width:20px;height:20px;flex:none;margin-top:.25rem}
.lds097-motion-status{font-weight:600;margin-top:1rem!important;min-height:1.8em}.lds097-motion-rule,.lds097-motion-boundary{font-size:.9em;color:var(--text-secondary)}
.lds097-motion-stage{min-width:0;padding:1.25rem;border-radius:16px;background:#FCFCFA!important;color:#182327;overflow:hidden;align-self:center}
html[data-theme="dark"] .lds097-motion-stage{background:#20292D!important;color:#F1F4EE}
.lds097-motion-stage-still{aspect-ratio:2/1;display:grid;place-items:center}.lds097-motion-stage-still img{display:block;width:100%;height:auto}
.lds097-motion-stage [data-preview-still="dark"]{display:none}html[data-theme="dark"] .lds097-motion-stage [data-preview-still="light"]{display:none}html[data-theme="dark"] .lds097-motion-stage [data-preview-still="dark"]{display:block}
.lds097-motion-stage[data-active="true"] .lds097-motion-stage-still{display:none}
.lds097-motion-stage .lds-motif-frame{width:100%;max-width:600px;margin-inline:auto;background:transparent;padding:0}
.lds097-motion-stage .lds-motif-frame[data-motion="final"] lm-motif *{animation:none!important}
.lds097-motion-stage-caption{display:grid;gap:.35rem;margin:1rem 0 0!important;font-size:.85rem;line-height:1.6!important}.lds097-motion-stage-caption strong{font-size:1rem}
.lds097-motion-boundary{margin-block:1.5rem!important}
.lds097-motion-catalogue{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem;margin-block:2rem}
.lds097-motion-card{min-width:0;padding-block:1.25rem;border-top:1px solid var(--border-default)}
.lds097-motion-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;margin-block:1rem}.lds097-motion-pair figure{margin:0;min-width:0}
.lds097-motion-still{aspect-ratio:2/1;display:grid;place-items:center;padding:10px!important;border-radius:12px!important}
.lds097-motion-still[data-host-surface="surface.card@light"],.lds097-motion-still img[data-host-surface="surface.card@light"]{background:#FCFCFA!important}
.lds097-motion-still[data-host-surface="surface.card@dark"],.lds097-motion-still img[data-host-surface="surface.card@dark"]{background:#20292D!important}
.lds097-motion-still img{display:block;width:100%;height:auto;padding:0!important;border-radius:0!important}
.lds097-motion-pair figcaption{line-height:1.6;font-size:.78em;margin-top:.5rem}.lds097-motion-pair figcaption a{display:block}
.lds097-motion-preview-link{font-size:.9em!important}.lds097-motion-handoff,.lds097-motion-product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem}
.lds097-motion-handoff{padding-block:1.5rem;border-top:1px solid var(--border-default)}.lds097-motion-handoff ul{padding-left:1.2rem;line-height:1.8}.lds097-motion-handoff li+li{margin-top:.5rem}
.lds097-motion-products{border-block:1px solid var(--border-default);padding-block:1rem}.lds097-motion-products>summary{display:list-item!important;cursor:pointer;font-weight:600;line-height:1.7;padding:.35rem 0}.lds097-motion-product-grid{padding-top:1.5rem}
.lds097-motion-web-files{padding-top:1.25rem}.lds097-motion-web-files ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.lds097-motion-web-files li{display:grid;gap:.3rem;min-width:0}.lds097-motion-web-files li span{font-size:.9em;line-height:1.7}.lds097-motion-web-files code{overflow-wrap:anywhere}.lds097-motion-web-files pre{max-width:100%;overflow:auto;white-space:pre;padding:1rem;background:var(--surface-card);border:1px solid var(--border-default);border-radius:12px;line-height:1.7;font-size:.8rem}.lds097-motion-web-files pre code{overflow-wrap:normal}
@media(max-width:760px){.lds097-motion-beats,.lds097-motion-lab,.lds097-motion-catalogue,.lds097-motion-handoff,.lds097-motion-product-grid{grid-template-columns:1fr}.lds097-motion-beats{gap:.75rem}.lds097-motion-beats li{padding-bottom:.5rem}.lds097-motion-lab{gap:1rem}.lds097-motion-stage{padding:1rem}.lds097-motion-catalogue{gap:1rem}.lds097-motion-pair{gap:.5rem}}
@media(max-width:540px){.lds097-motion-web-files ul{grid-template-columns:1fr}}
@media print{.lds097-motion-controls,.lds097-motion-preview-link,#motif-runtime-slot{display:none!important}.lds097-motion-stage-still{display:grid!important}.lds097-motion-catalogue{grid-template-columns:repeat(2,minmax(0,1fr))}.lds097-motion-card{break-inside:avoid}}
@media(prefers-reduced-motion:reduce){.lds097-motion-stage lm-motif *{animation:none!important}}
`;

const motionJs=`(function(){
'use strict';
var root=document.getElementById('identity-motion');if(!root)return;
var records=JSON.parse(document.getElementById('motion-discovery-records').textContent),kind=document.getElementById('motif-kind'),stage=root.querySelector('.lds097-motion-stage'),slot=document.getElementById('motif-runtime-slot'),start=document.getElementById('motif-start'),pause=document.getElementById('motif-pause'),reduce=document.getElementById('motif-final-state'),status=document.getElementById('motif-status'),current=document.getElementById('motif-current-name');
var mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null,active=false,busy=false,failed=false,frame=null,loadPromise=null,lastStatus='',requestedPlayback=false,inView=false,subscribed=false;
var visibilityGate=('IntersectionObserver' in window)?new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.target!==frame)return;inView=entry.isIntersecting&&entry.intersectionRatio>=.14;syncPlayback();});},{threshold:[0,.14],rootMargin:'0px 0px -8% 0px'}):null;
function english(){return document.documentElement.lang==='en'||document.documentElement.getAttribute('data-lang')==='en';}
function words(th,en){return english()?en:th;}
function record(){return records.find(function(r){return r.id===kind.value;})||records[0];}
function reflect(){
 var r=record();current.textContent=r.name;document.getElementById('motif-current-purpose').textContent=words(r.purposeTh,r.purposeEn);
 kind.querySelectorAll('option').forEach(function(o){o.textContent=o.getAttribute(english()?'data-label-en':'data-label-th');});
 var controller=window.LandometerMotion,limited=reduce.checked||!!(mq&&mq.matches),paused=!active||!requestedPlayback;
 pause.disabled=!active||limited;pause.textContent=paused?words('เล่นต่อ','Resume'):words('หยุด · ภาพสุดท้าย','Pause · final still');pause.setAttribute('aria-pressed',paused?'true':'false');
 var message=failed?words('โหลด motion ไม่สำเร็จ ภาพนิ่งและไฟล์ดาวน์โหลดยังใช้ได้ กดลองอีกครั้งได้','Motion could not load. Stills and downloads remain available; you can retry.'):busy?words('กำลังเตรียมไฟล์ต้นฉบับ ภาพสุดท้ายยังแสดงอยู่','Preparing the original files; the final still remains visible.'):limited?words('ลดการเคลื่อนไหว · แสดงภาพสุดท้ายโดยไม่เริ่มรอบ','Reduced motion · final still, no playback cycle.'):!active?words('พร้อมลอง · เริ่มจากภาพสุดท้าย','Ready to try · showing the final still.'):paused?words('หยุดแล้ว · แสดงภาพสุดท้าย','Paused · showing the final still.'):words('เล่นเมื่ออยู่ในจอ · ออกนอกจอแล้วหยุด','Playback enabled while visible · stops offscreen.');
 if(message!==lastStatus){status.textContent=message;lastStatus=message;}
 start.disabled=busy||limited;start.textContent=active?words('เล่นจากต้นอีกครั้ง','Replay from the start'):words('เล่นตัวอย่าง','Play example');
}
function syncPlayback(){var c=window.LandometerMotion;if(c){if(active&&requestedPlayback&&inView&&!reduce.checked&&!(mq&&mq.matches)&&document.visibilityState!=='hidden')c.resume();else c.pause();}reflect();}
function setStills(){var r=record();root.querySelector('[data-preview-still="light"]').src='lds/motif/svg/'+r.id+'-full.svg';root.querySelector('[data-preview-still="dark"]').src='lds/motif/svg/'+r.id+'-quiet.svg';reflect();}
function asset(path,style){return new Promise(function(resolve,reject){var el=document.createElement(style?'link':'script'),settled=false;var timer=setTimeout(function(){finish(Error('Timed out '+path));},15000);function finish(error){if(settled)return;settled=true;clearTimeout(timer);if(error){el.remove();reject(error);}else resolve();}if(style){el.rel='stylesheet';el.href=path;}else{el.src=path;el.async=false;}el.onload=function(){finish();};el.onerror=function(){finish(Error('Unavailable '+path));};document.head.appendChild(el);});}
function dependencies(){if(loadPromise)return loadPromise;loadPromise=(async function(){await Promise.all([asset('lds/motif/landometer-motifs.css',true),asset('lds/motif/motif-frame.css',true)]);if(!window.LandometerMotion)await asset('lds/motif/motion-controller.js');window.LandometerMotion.pause();if(!subscribed){window.LandometerMotion.subscribe(reflect);subscribed=true;}if(!customElements.get('lm-motif'))await asset('lds/motif/landometer-motifs.js');if(!window.LandometerMotifFrame)await asset('lds/motif/motif-frame.js');return true;})().catch(function(e){loadPromise=null;throw e;});return loadPromise;}
function removeFrame(){if(frame&&visibilityGate)visibilityGate.unobserve(frame);if(frame&&window.LandometerMotifFrame)window.LandometerMotifFrame.unmount(frame);if(frame)frame.remove();frame=null;inView=false;stage.removeAttribute('data-active');}
function mount(){
 removeFrame();var r=record();frame=document.createElement('div');frame.className='lds-motif-frame';
 Object.entries({'data-kind':r.id,'data-job':r.job,'data-beat':r.beat,'data-variant':'full','data-variant-dark':'quiet','data-host-surface':'surface.card','data-cycle-ms':String(r.cycle),'data-fallback-src':'lds/motif/svg/'+r.id+'-full.svg','data-fallback-src-dark':'lds/motif/svg/'+r.id+'-quiet.svg'}).forEach(function(p){frame.setAttribute(p[0],p[1]);});
 var el=document.createElement('lm-motif');el.setAttribute('kind',r.id);el.setAttribute('ink','blue');el.setAttribute('autoplay','false');frame.appendChild(el);
 var ns=document.createElement('noscript');ns.textContent='<span class="lds-motif-noscript" data-theme-variant="light"><img src="lds/motif/svg/'+r.id+'-full.svg" alt="" width="600" height="300"></span><span class="lds-motif-noscript" data-theme-variant="dark"><img src="lds/motif/svg/'+r.id+'-quiet.svg" alt="" width="600" height="300"></span>';frame.appendChild(ns);slot.appendChild(frame);window.LandometerMotifFrame.mount(frame);
 if(frame.getAttribute('data-motif-state')!=='mounted')throw Error('Preview could not mount');
 stage.setAttribute('data-active','true');
 if(visibilityGate)visibilityGate.observe(frame);
}
async function play(){if(busy||reduce.checked||(mq&&mq.matches)){syncPlayback();return;}if(!window.customElements||!visibilityGate){failed=true;reflect();return;}busy=true;failed=false;reflect();try{await dependencies();window.LandometerMotion.pause();mount();active=true;requestedPlayback=true;syncPlayback();}catch(e){removeFrame();active=false;requestedPlayback=false;failed=true;}finally{busy=false;reflect();}}
function select(){requestedPlayback=false;setStills();if(active){window.LandometerMotion.pause();try{mount();}catch(e){removeFrame();active=false;failed=true;}}syncPlayback();}
root.querySelector('[data-motion-controls]').hidden=false;root.querySelectorAll('[data-preview-motif]').forEach(function(b){b.hidden=false;b.addEventListener('click',function(){kind.value=b.getAttribute('data-preview-motif');select();document.getElementById('motif-preview').scrollIntoView({block:'start',behavior:'auto'});kind.focus({preventScroll:true});});});
start.addEventListener('click',play);kind.addEventListener('change',select);
pause.addEventListener('click',function(){requestedPlayback=!requestedPlayback;setTimeout(syncPlayback,0);});
reduce.addEventListener('change',function(){requestedPlayback=false;syncPlayback();});
if(mq&&mq.addEventListener)mq.addEventListener('change',function(){if(mq.matches)requestedPlayback=false;syncPlayback();});
new MutationObserver(function(){reflect();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang','data-lang','data-theme']});
document.addEventListener('visibilitychange',syncPlayback);
window.addEventListener('pagehide',function(){requestedPlayback=false;syncPlayback();});
window.addEventListener('pageshow',function(){document.dispatchEvent(new Event('visibilitychange'));});
window.addEventListener('beforeprint',function(){requestedPlayback=false;syncPlayback();});
setStills();
})();\n`;
