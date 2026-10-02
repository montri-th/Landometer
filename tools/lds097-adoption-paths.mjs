// Website-only routes from the retained handbook to its exact current assets.
// This module does not amend the frozen normative or invent native templates.
export function adoptionPaths({root, site, bi}) {
  const base = 'package/assets/lds-0.9.7';
  const kit = `${base}/build-kit`;
  const master = 'normative/Landometer-Design-System-v0.9.7.md';
  const release = 'https://github.com/montri-th/Landometer/releases/download/v0.9.7/landometer-design-system-0.9.7.zip';
  const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const link = (href, th, en, kind = 'read') => `<a href="${esc(href)}"${kind === 'download' ? ' download' : ''}${href.startsWith('#') ? ` data-reveal-target="${esc(href.slice(1))}"` : href.startsWith('?') ? ' data-lds097-preserve-context' : ''}>${bi(th, en)}</a>`;
  const files = entries => `<ul class="lds097-use-files">${entries.map(([href, th, en, kind]) => `<li>${link(href, th, en, kind)}</li>`).join('')}</ul>`;
  const example = (href, th, en) => link(href, th, en);
  const fontFiles = [
    ['arvo-latin-700-normal.woff2', 'Arvo · Latin 700'],
    ['ibm-plex-sans-thai-looped-thai-700-normal.woff2', 'IBM Plex Sans Thai Looped · Thai 700'],
    ['ibm-plex-sans-thai-looped-latin-700-normal.woff2', 'IBM Plex Sans Thai Looped · Latin 700'],
    ['bai-jamjuree-thai-400-normal.woff2', 'Bai Jamjuree · Thai 400'],
    ['bai-jamjuree-latin-400-normal.woff2', 'Bai Jamjuree · Latin 400'],
    ['bai-jamjuree-thai-600-normal.woff2', 'Bai Jamjuree · Thai 600'],
    ['bai-jamjuree-latin-600-normal.woff2', 'Bai Jamjuree · Latin 600'],
    ['jetbrains-mono-latin-400-normal.woff2', 'JetBrains Mono · Latin 400'],
    ['ibm-plex-sans-thai-thai-400-normal.woff2', 'IBM Plex Sans Thai · Thai 400'],
  ];
  const fontDetail = `<details class="lds097-use-detail"><summary>${bi('ไฟล์เว็บฟอนต์ทั้ง 9 ไฟล์และใบอนุญาต', 'All nine web-font files and licences')}</summary><p>${bi('เก็บ WOFF2 ในโฟลเดอร์ assets ข้าง fonts.css ตามแพ็กเกจ ชุดนี้เป็นเว็บฟอนต์ งานเอกสารและสไลด์ต้องเลือก native font mapping ตาม §5.2 และ §11 ก่อนส่งออก', 'Keep WOFF2 files in the assets folder beside fonts.css, as packaged. These are web fonts. Documents and slides must resolve the native font mapping in §5.2 and §11 before export.')}</p>${files(fontFiles.map(([name, label]) => [`${kit}/assets/${name}`, label, label, 'download']))}<p>${bi('ใบอนุญาต OFL:', 'OFL licences:')} ${['arvo', 'ibm-plex-sans-thai-looped', 'bai-jamjuree', 'jetbrains-mono', 'ibm-plex-sans-thai'].map(name => link(`${kit}/assets/${name}-OFL.txt`, name, name)).join(' · ')}</p><p>${link(`${kit}/assets/material-symbols-rounded-nav-300.woff2`, 'ดาวน์โหลด UI icon subset · 300', 'Download the UI icon subset · 300', 'download')} · ${link(`${kit}/assets/material-symbols-rounded-open-in-new-300.woff2`, 'ดาวน์โหลด open-in-new subset', 'Download the open-in-new subset', 'download')} · ${link(`${kit}/assets/material-symbols-Apache-2.0.txt`, 'Apache 2.0', 'Apache 2.0')}</p><p>${bi('ใช้เฉพาะ glyph ที่อนุมัติ พร้อมชื่อปุ่มที่อ่านได้ ไม่แทนด้วยฟอนต์ไอคอนอื่นเงียบ ๆ', 'Use only approved glyphs with readable control names. Do not silently substitute another icon font.')}</p></details>`;
  const rows = [
    {
      id: 'voice', title: ['เขียนด้วยเสียงของแบรนด์', 'Write in the brand voice'],
      note: ['เริ่มจากสิ่งที่รู้ บอกขอบเขต แล้วพาไปทำต่อ', 'Start from what is known, name the limit and offer a useful next step.'],
      example: example('?work=screen&view=assisted&lens=voice#play', 'ลองข้อความก่อน–หลังใน Voice lens', 'Try the before/after Voice lens'),
      files: [[master, 'กฎภาษาและ protected lines · §4', 'Voice and protected lines · §4', 'download']],
      scope: ['ใช้เนื้อหาใน normative เป็นแหล่งอ้างอิง ไม่ต้องติดตั้งชุดสีเพิ่มเพื่อเขียนข้อความ', 'Use the normative as the writing source. Copywriting does not require a separate colour installation.'],
    },
    {
      id: 'visual', title: ['เลือกภาพและจัดบรรยากาศ', 'Choose imagery and set the atmosphere'],
      note: ['ให้ภาพเล่าเรื่องตรงบทบาท พร้อมพื้นที่ให้ข้อความและหลักฐาน', 'Give imagery a clear role and leave room for the message and its evidence.'],
      example: [example('#top', 'ดูภาพทีมพร้อมคำกำกับบทบาท', 'See the team photograph and its role caption'), example('?work=screen&view=assisted&lens=visual#play', 'ลอง Measure · Ground · Cultivate', 'Try Measure · Ground · Cultivate')].join(' · '),
      files: [['../assets/images/team-hero.jpg', 'เปิดไฟล์ภาพทีมที่ใช้ในตัวอย่าง', 'Open the team photograph used in this example'], [master, 'กฎ layout และภาพ · §5.4–5.5', 'Layout and media rules · §5.4–5.5', 'download'], [`${base}/machine/tokens.v0.9.7.json`, 'สูตรบรรยากาศและสัญญา layout · JSON', 'Atmosphere recipes and layout contracts · JSON', 'download']],
      scope: ['ภาพทีมนี้คงจากเว็บเดิมในบทบาท team culture ไม่ใช่หลักฐานผลลัพธ์ผลิตภัณฑ์และไม่รวมในแพ็กเกจดาวน์โหลด การนำภาพไปสื่ออื่นต้องอยู่ในขอบเขตสิทธิ์ของภาพนั้น', 'This retained website photograph has the team-culture role. It is not product-outcome evidence and is not included in the downloadable package. Reuse in another medium must stay within that image’s recorded rights.'],
    },
    {
      id: 'identity', title: ['เลือกโลโก้และ favicon', 'Choose the logo and favicon'],
      note: ['ใช้ไฟล์ตรงบทบาท และตรวจชื่อกับสัญลักษณ์บนพื้นจริง', 'Use the asset for its recorded role and check the complete identity on the actual background.'],
      example: example('#v097-identity-clarification', 'ดูสิทธิ์ปรับสี wordmark และพื้นหลัง', 'See wordmark colour and background guidance'),
      files: [[`${kit}/assets/Landometer-Logo-TransparentBG.png`, 'โลโก้โปร่งใส · PNG', 'Transparent logo · PNG', 'download'], [`${kit}/icons/icon-portfolio-32.png`, 'Favicon ของ portfolio · 32 px', 'Portfolio favicon · 32 px', 'download'], [`${kit}/icons/icon-set.json`, 'ทะเบียนไอคอนและขนาด 16–512 px', 'Icon register and 16–512 px sizes', 'download']],
      scope: ['Wordmark เปลี่ยนสีได้ตาม LOGO-01 โดยคงรูปทรงและสัดส่วน ไอคอนของ portfolio ไม่ใช่ไอคอนของทุกผลิตภัณฑ์', 'LOGO-01 permits wordmark colour changes while retaining letterforms and proportions. The portfolio favicon does not become every product’s icon.'],
      extra: `<details class="lds097-use-detail"><summary>${bi('ดาวน์โหลดไอคอน portfolio ครบทุกขนาด', 'Download every portfolio icon size')}</summary>${files([16, 32, 48, 180, 192, 512].map(size => [`${kit}/icons/icon-portfolio-${size}.png`, `PNG · ${size} × ${size} px`, `PNG · ${size} × ${size} px`, 'download']))}<p>${bi('เลือก role และพื้นหลังตาม icon-set.json ไม่ตัดโลโก้แนวนอนให้กลายเป็น favicon', 'Follow the roles and backgrounds in icon-set.json. Do not crop the horizontal logo to make a favicon.')}</p></details>`,
    },
    {
      id: 'type', title: ['วางตัวอักษรไทย–อังกฤษ', 'Set Thai and English type'],
      note: ['หัวเรื่อง เนื้อหา และข้อมูลมีฟอนต์คนละหน้าที่', 'Headlines, body copy and technical information have distinct font roles.'],
      example: example('#library-foundations', 'ดูบทบาทฟอนต์และลำดับข้อความ', 'See font roles and text hierarchy'),
      files: [[`${kit}/fonts.css`, 'ตัวเชื่อมเว็บฟอนต์ · fonts.css', 'Web-font declarations · fonts.css', 'download'], [master, 'กฎ typography และ UI icons · §5.2–5.3', 'Typography and UI icon rules · §5.2–5.3', 'download'], [`${base}/machine/tokens.v0.9.7.json`, 'บทบาทตัวอักษร ระยะ และ layout · JSON', 'Type roles, spacing and layout · JSON', 'download']],
      scope: ['fonts.css ต้องใช้พร้อมไฟล์ WOFF2 ที่อ้างถึง ดาวน์โหลดทั้งแพ็กเกจได้จากด้านบน', 'fonts.css requires its referenced WOFF2 files. The complete package above keeps them together.'], extra: fontDetail,
    },
    {
      id: 'colour', title: ['เลือกสีตามความหมายของงาน', 'Choose colour by the meaning of the work'],
      note: ['แยกสีแบรนด์ สีหมวดหมู่ สีวิเคราะห์ และสีบรรยากาศ', 'Separate brand, categorical, analytical and atmosphere colours.'],
      example: [example('#atlas-story-vocabulary', 'Story 17 สี', '17 Story colours'), example('#library', '20 สเกลข้อมูลเดิม', '20 shared analytical scales'), example('#atlas-location-scales', 'สเกล Location', 'Location scales')].join(' · '),
      files: [[`${base}/machine/color-srgb-10.tokens.json`, 'สีและบทบาท · JSON', 'Colours and roles · JSON', 'download'], [`${base}/machine/color-srgb-10.scales.json`, 'Anchors, classes และ LUT · JSON', 'Anchors, classes and LUT · JSON', 'download'], ['normative/Location-Intelligence-Profile-for-LDS-v0.9.7.md', 'Location Profile · เพิ่มเมื่อทำงานทำเล', 'Location Profile · add for location work', 'download']],
      scope: ['เลือกสีหมวดหมู่และสีข้อมูลจากไฟล์ตรงหน้าที่ ส่วนสเกล Location ใช้ Profile แยกคู่กับ LDS ฉบับเต็ม', 'Use the corresponding categorical or analytical records. Location scales require the separate Profile alongside the complete LDS base.'],
    },
    {
      id: 'evidence', title: ['ทำแผนที่ กราฟ และหลักฐาน', 'Build maps, charts and evidence'],
      note: ['ระบุหน่วย ตัวหาร ที่มา และสถานะค่าที่อ่านได้', 'Keep units, denominators, sources and value states visible.'],
      example: [example('#citymeter-chart-gallery-title', 'ดูกราฟ CityMETER 9 แบบ', 'Explore nine CityMETER chart forms'), example('#v097-evidence', 'ดูค่าทั้ง 6 สถานะ', 'See all six value states')].join(' · '),
      files: [[`${base}/machine/evidence-value.schema.json`, 'สัญญาค่า · evidence-value schema', 'Value contract · evidence-value schema', 'download'], [`${kit}/lds-0.9.7-components.css`, 'สไตล์ EvidenceCard, DataTable, MapLegend', 'EvidenceCard, DataTable and MapLegend styles', 'download']],
      scope: ['ตัวอย่างใช้ข้อมูลสังเคราะห์ ไม่ใช่ dataset ที่พร้อมตัดสินใจ สไตล์ต้องโหลดผ่าน CSS หลักเพื่อให้สีและฟอนต์ครบ', 'Examples use synthetic data, not decision-ready datasets. Load the styles through the main CSS entry point so tokens and fonts resolve.'],
    },
    {
      id: 'components', title: ['ประกอบหน้าจอและสถานะ', 'Compose screens and states'],
      note: ['เลือกส่วนประกอบจากสิ่งที่ผู้ใช้ต้องทำให้สำเร็จ', 'Choose components for the task the user needs to complete.'],
      example: example('#library-components', 'ดูปุ่ม ฟอร์ม การ์ด ตาราง และการแก้ error', 'See controls, forms, cards, tables and recovery'),
      files: [[`${kit}/lds-0.9.7.css`, 'CSS หลัก · โหลดสี ฟอนต์ และส่วนประกอบ', 'Main CSS · colours, fonts and components', 'download'], [`${kit}/lds-0.9.7-components.css`, 'CSS ส่วนประกอบที่มีในแพ็กเกจ', 'Packaged component CSS', 'download'], [master, 'กติกาองค์ประกอบและ actions · §5.6–§7', 'Component and action contracts · §5.6–§7', 'download']],
      scope: ['CSS ให้รูปแบบภาพ ผู้พัฒนายังต้องทำ semantics, state และพฤติกรรมของ control ให้ตรงงาน ไม่ใช่ไลบรารี widget ที่ทำงานครบทุกตัว', 'CSS supplies visual styles. Authors still implement the correct semantics, state and control behaviour; this is not a complete executable widget library.'],
    },
    {
      id: 'experience', title: ['ออกแบบการไปต่อและจังหวะของเรื่อง', 'Design the next step and the story rhythm'],
      note: ['แยก motion ของสถานะงานออกจาก animated logo และ motif', 'Distinguish task-state motion from animated identity and motifs.'],
      example: [example('#cta-pattern-title', 'ลอง CTA และการกลับมาแก้', 'Try the CTA and recovery flow'), example('#motion-lab', 'ลอง motion ของสถานะ', 'Try task-state motion'), example('#identity-motion', 'ดู animated logo และ motif', 'See animated logo and motifs')].join(' · '),
      files: [[master, 'กฎการไปต่อและ motion · §7–§8', 'Actions and motion rules · §7–§8', 'download']],
      scope: ['แกลเลอรี motif มี SVG, runtime และ wrapper อยู่ข้างตัวอย่างแต่ละแบบ ไม่ใช้ motif แทนข้อมูลหรือสถานะโหลด', 'The motif gallery places SVGs, runtime and wrapper beside the examples. Motifs do not replace data or loading states.'],
    },
    {
      id: 'products', title: ['ทำงานให้ตรงผลิตภัณฑ์', 'Apply the system to a product'],
      note: ['ใช้ LDS ฉบับเต็ม แล้วเพิ่ม Add-on ของผลิตภัณฑ์นั้น', 'Start with the complete LDS, then add the matching product Add-on.'],
      example: example('#library-products', 'ดูวิธีปรับใช้ของแต่ละผลิตภัณฑ์', 'See product adaptation examples'),
      files: [['normative/ijji-Add-on-v0.5.5-for-LDS-v0.9.7.md', 'ijji Add-on 0.5.5', 'ijji Add-on 0.5.5', 'download'], ['normative/CityChat-Add-on-v0.9.2-for-LDS-v0.9.7.md', 'CityChat Add-on 0.9.2', 'CityChat Add-on 0.9.2', 'download'], ['normative/CityWiki-Add-on-v1.0.0-for-LDS-v0.9.7.md', 'CityWiki Add-on 1.0.0', 'CityWiki Add-on 1.0.0', 'download']],
      scope: ['ตัวอย่างการปรับใช้ไม่ยืนยันว่าฟีเจอร์นั้นเปิดใช้ในผลิตภัณฑ์แล้ว งานทำเลเพิ่ม Location Profile อีกหนึ่งไฟล์', 'Adaptation examples do not establish deployed product features. Location work adds one separate Location Profile.'],
    },
    {
      id: 'formats', title: ['ส่งออกเอกสาร สไลด์ และภาพแชร์', 'Deliver documents, slides and social images'],
      note: ['เปลี่ยนสื่อโดยคงข้อสรุป ที่มา และความหมาย', 'Change the format while retaining the claim, source and meaning.'],
      example: example('?work=report&view=assisted&lens=dna#play', 'ลองรูปแบบรายงานใน Playground', 'Explore the report example in the Playground'),
      files: [[master, 'ข้อกำหนดหลายสื่อ · §11', 'Cross-format requirements · §11', 'download'], ['normative/Landometer-Design-System-v0.9.7.json', 'สัญญาสำหรับเครื่อง · formatPacks และ target profiles', 'Machine contracts · formatPacks and target profiles', 'download'], [`${base}/machine/social-sidecar.schema.json`, 'Schema คำกำกับภาพแชร์และปลายทาง', 'Social sidecar and destination schema', 'download']],
      scope: ['ชุดนี้ให้กติกาและ assets ยังไม่มี template DOCX/PPTX สำเร็จรูป แปลง motion เป็นภาพสุดท้ายและตรวจฟอนต์กับการตัดข้อความในไฟล์ส่งออกจริง', 'This distribution provides rules and assets, not ready-made DOCX/PPTX templates. Use final motion frames and check fonts and text clipping in the actual exported file.'],
    },
    {
      id: 'web', title: ['เริ่มหน้าเว็บจากไฟล์ที่เห็นผลได้', 'Start from a working web example'],
      note: ['เปิดตัวอย่าง แล้วดาวน์โหลด HTML ไปปรับต่อ', 'Open the example, then download the HTML to adapt it.'],
      example: example('examples/lds097-starter.html', 'เปิดตัวอย่างเว็บ 0.9.7', 'Open the 0.9.7 web example'),
      files: [['examples/lds097-starter.html', 'HTML ตัวอย่าง · ใช้ assets ออนไลน์', 'Example HTML · uses online assets', 'download'], [release, 'แพ็กเกจ LDS 0.9.7 · CSS + ฟอนต์ + assets', 'LDS 0.9.7 package · CSS, fonts and assets']],
      scope: ['HTML ตัวอย่างต้องเชื่อมต่อเครือข่าย งาน offline ให้ใช้ไฟล์ในแพ็กเกจครบตามโครงสร้างและเปลี่ยน path ให้ตรงที่ติดตั้ง', 'The example HTML needs a network connection. For offline work, keep the complete packaged file structure and update paths to the installed files.'],
    },
    {
      id: 'install', title: ['เริ่มใช้กับ AI และส่งต่อให้ทีม', 'Use with AI and share with the team'],
      note: ['แยก Project Source ออกจากชุดติดตั้งและไฟล์สร้างงาน', 'Distinguish Project Sources from tool installation and implementation files.'],
      example: example('project-source-0.9.7.md', 'ดูว่าต้องใช้เอกสารกี่ไฟล์ตามงาน', 'See which source documents your work needs'),
      files: [[master, 'LDS ฉบับเต็ม · Human + AI Markdown', 'Complete LDS · Human + AI Markdown', 'download'], ['team-setup.md', 'วิธีเปิดใช้ ChatGPT, Claude และ Codex', 'ChatGPT, Claude and Codex activation guide'], ['site-manifest.json', 'บันทึกไฟล์เว็บและ checksum', 'Website file and checksum receipt']],
      scope: ['การอัปโหลดกฎช่วยให้ AI อ้างอิงได้ การใช้ฟอนต์ โลโก้ หรือ motion ในชิ้นงานยังต้องใส่ไฟล์จริงและตรวจผล ไม่ได้เปิดใช้ให้ทุกบัญชีหรือทุก Project โดยอัตโนมัติ', 'Uploading rules makes them available as a reference. Fonts, logos and motion still need the actual files in the output and a result check. This does not activate every account or Project automatically.'],
    },
  ];
  const html = `<section id="use-lds097" class="lds097-use" aria-labelledby="use-lds097-title"><div class="container">
    <header class="section-heading"><p class="eyebrow">EXAMPLE → FILE → YOUR WORK · LDS 0.9.7</p><h2 id="use-lds097-title">${bi('เห็นตัวอย่าง แล้วหยิบไฟล์ไปใช้', 'See the example. Take the right files.')}</h2><p>${bi('เลือกจากงานที่กำลังทำ แต่ละเส้นทางพาไปยังตัวอย่างที่มีอยู่แล้ว พร้อมไฟล์ปัจจุบันและขอบเขตการใช้', 'Choose the job in front of you. Each path connects an existing example to the current files and their intended use.')}</p><p class="lds097-use-start">${link(release, 'ดาวน์โหลดชุดไฟล์ครบ · LDS 0.9.7', 'Download the complete LDS 0.9.7 package')} · ${link(master, 'ดาวน์โหลด normative ฉบับเต็ม', 'Download the complete normative', 'download')}</p></header>
    <p class="lds097-use-key">${bi('Normative บอกกติกา · Assets คือไฟล์ที่นำไปวางในชิ้นงาน · ตัวอย่างช่วยเลือกวิธีใช้', 'Normative documents define the rules. Assets are files placed in your output. Examples show how to choose and apply them.')}</p>
    <nav class="lds097-use-nav" aria-labelledby="use-lds097-nav-title"><h3 id="use-lds097-nav-title">${bi('เลือกงานของคุณ', 'Choose your task')}</h3><ul>${rows.map(row => `<li>${link(`#use-${row.id}`, ...row.title)}</li>`).join('')}</ul></nav>
    <div class="lds097-use-list">${rows.map((row, i) => `<article id="use-${row.id}" class="lds097-use-row"><div class="lds097-use-intent"><p class="lds097-use-number">${String(i + 1).padStart(2, '0')}</p><h3>${bi(...row.title)}</h3><p>${bi(...row.note)}</p></div><div class="lds097-use-example"><h4>${bi('ดูตัวอย่าง', 'See an example')}</h4><p>${row.example}</p></div><div class="lds097-use-delivery"><h4>${bi('หยิบไปใช้', 'Take the files')}</h4>${files(row.files)}<p class="lds097-use-scope">${bi(...row.scope)}</p>${row.extra ?? ''}</div></article>`).join('\n')}</div>
    <p class="lds097-use-closing">${bi('ไม่ต้องย้อนอ่าน 0.9.4 เริ่มจาก normative 0.9.7 ฉบับเต็ม แล้วเพิ่มเฉพาะ Add-on หรือ Location Profile ที่ตรงงาน เก็บเอกสารรุ่นเก่าไว้อ้างประวัติ แยกจาก Project Source ที่ใช้งานปัจจุบัน', 'No 0.9.4 document is required. Start with the complete 0.9.7 normative and add only the applicable product Add-on or Location Profile. Keep historical documents separate from active Project Sources.')}</p>
  </div></section>`;
  const css = `/* Scoped adoption routes: inherited foundations, no decorative rails. */
.lds097-use { padding-block:clamp(40px,6vw,80px); color:var(--text-primary); background:var(--surface-canvas); }
.lds097-use .section-heading { max-inline-size:76ch; }
.lds097-use a { color:var(--interaction-accent); text-underline-offset:.2em; overflow-wrap:anywhere; }
.lds097-use a:focus-visible,.lds097-use summary:focus-visible { outline:3px solid var(--focus-ring); outline-offset:4px; }
.lds097-use-start { display:flex; flex-wrap:wrap; gap:.35em .8em; }
.lds097-use-key { max-inline-size:85ch; color:var(--text-secondary); margin-block:24px 32px; }
.lds097-use-nav { margin-block:0 32px; }
.lds097-use-nav > h3 { font-family:"Bai Jamjuree",sans-serif; font-size:1rem; }
.lds097-use-nav > ul { list-style:none; margin:8px 0 0; padding:0; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:0 24px; }
.lds097-use-nav li { min-inline-size:0; }
.lds097-use-nav a { display:flex; align-items:center; min-block-size:44px; padding-block:8px; font-size:.85rem; line-height:1.6; }
.lds097-use-row { display:grid; grid-template-columns:minmax(0,.92fr) minmax(0,.8fr) minmax(0,1.35fr); gap:clamp(20px,3vw,40px); padding-block:28px; border-block-start:1px solid var(--border-default); }
.lds097-use-row > div { min-inline-size:0; }
.lds097-use-number { font-family:"JetBrains Mono",monospace; font-size:.82rem; color:var(--text-metadata); margin:0 0 8px; }
.lds097-use h3 { font-size:clamp(1.125rem,1.5vw,1.4rem); line-height:1.5; margin:0 0 8px; overflow-wrap:break-word; }
.lds097-use h4 { font-family:"Bai Jamjuree",sans-serif; font-size:.92rem; font-weight:600; line-height:1.5; margin:0 0 12px; color:var(--text-secondary); }
.lds097-use p { line-height:1.7; }
.lds097-use-intent > p:last-child { margin:0; }
.lds097-use-example > p { margin:0; }
.lds097-use-files { list-style:none; margin:0; padding:0; display:grid; gap:10px; }
.lds097-use-scope { color:var(--text-secondary); font-size:.9rem; margin-block:14px 0; }
.lds097-use-detail { margin-block-start:18px; padding-block-start:12px; border-block-start:1px solid var(--border-hairline); }
.lds097-use-detail > summary { cursor:pointer; font-weight:600; line-height:1.65; padding-block:4px; }
.lds097-use-detail[open] > summary { margin-block-end:12px; }
.lds097-use-detail p,.lds097-use-detail li { font-size:.9rem; overflow-wrap:anywhere; }
.lds097-use-closing { max-inline-size:90ch; padding-block-start:20px; border-block-start:1px solid var(--border-default); color:var(--text-secondary); }
@media(max-width:850px) { .lds097-use-row { grid-template-columns:1fr 1.35fr; }.lds097-use-intent { grid-column:1/-1; }.lds097-use-intent > p:last-child { max-inline-size:68ch; } }
@media(max-width:540px) { .lds097-use-row { grid-template-columns:minmax(0,1fr); gap:20px; }.lds097-use-intent { grid-column:auto; }.lds097-use h3 { font-size:1.2rem; }.lds097-use-start { display:block; }.lds097-use-nav > ul { grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 20px; }.lds097-use-nav > h3 { font-size:1rem; } }
@media print { .lds097-use-row { break-inside:avoid; }.lds097-use a { color:inherit; }.lds097-use-detail > summary { list-style:none; } }
`;
  return {html, css, counts: {journeys: rows.length, webFonts: fontFiles.length, rows: rows.map(row => `use-${row.id}`)}};
}
