/* Display-only localization for the retained, embedded color atlas.
 * Canonical data, color declarations, selected controls and existing DOM remain intact. */
(function(){
 'use strict';
 const phrases=[
 ['ดูช่วงและสีครบ 41 ระดับ','Inspect all 41 intervals and colours'],
 ['ใช้สี LUT ครบ 41 ค่า ตามลำดับเดิม ไม่ลดจำนวนระดับอัตโนมัติ สีอย่างเดียวไม่รับรองการแยกแยะทุกช่วง','Use all 41 LUT values in their original order, without automatically reducing the count. Colour alone does not guarantee that every interval can be distinguished'],
 ['ดูช่วงสีเดิมเทียบกับชุดปรับ แล้วใช้ 41 ระดับสำหรับ CityMETER หรือเลือก 3 / 5 / 7 / 9 ระดับสำหรับงานขนาดเล็ก ตัวอย่างทั้งหมดเป็นข้อมูลสมมติ','Compare the earlier and current routes using 41 classes for CityMETER, or 3 / 5 / 7 / 9 classes for compact displays. All examples use illustrative data.'],
 ['ใช้ 41 ระดับใน CityMETER','Use 41 classes in CityMETER'],
 ['พื้นมืดมีน้ำหนัก สีไม่ซีดเท่ากันทั้งชุด','Color with presence on dark surfaces'],
 ['สืบทอดสี Soft, Vivid และ Ink จาก 0.9.5 ทั้งพื้นสว่างและมืด','Soft, Vivid and Ink colors retained from 0.9.5 on light and dark surfaces'],
 ['ป้ายชื่อ หมายเลข และรูปทรงคงเดิม','Labels, numbers and shapes are retained'],
 ['ตัวอย่างพื้นสว่าง','Light-surface preview'],['ชุดสีพื้นสว่าง','Light-surface palette'],
 ['Soft · สุขุมขึ้น','Soft · restrained'],['Vivid · สีชัดขึ้น','Vivid · pronounced'],['0.9.7 · คงเดิม','0.9.7 · retained'],
 ['ตัวอย่าง 10 หมวด · ข้อมูลสมมติ','10 sample categories · illustrative data'],
 ['ลดความซีดเท่ากันทั้งชุด ให้เขียว น้ำเงิน และ teal มีน้ำหนัก','Varied color presence gives green, blue and teal distinct weight'],
 ['เพิ่มความสด แยกสีอุ่น–เย็นชัดขึ้น พร้อมคงหมายเลขและรูปทรง','Vivid warm and cool colors, supported by numbers and shapes'],
 ['พื้นสว่าง · คงเดิม','Light surface · retained'],['คงค่า soft, vivid และสีเส้นทุกค่าเดิม','All Soft, Vivid and Ink values are retained'],
 ['เปิดชุด 0.9.6 ที่สืบทอดโดยไม่เปลี่ยนสี','Inspect the unchanged categorical colors inherited from 0.9.6'],
 ['รหัสสีหมวดหมู่ที่แสดงจริง','Exact displayed categorical color values'],['Light soft เดิม','Retained Light soft'],['Light vivid เดิม','Retained Light vivid'],['Light ink เดิม','Retained Light ink'],
 ['20 ตระกูล · 14 ทางเดียว + 6 สองทาง','20 families · 14 sequential + 6 diverging'],
 ['ทั้งสองธีมใช้ HEX และ LUT ต้นฉบับเดียวกัน คงทิศทางค่าต่ำ–สูง','Both themes use the same original HEX values and LUT, with the same low-to-high value direction'],
 ['Density 3 ตัวหารคงโทนร้อน: พื้นที่ ประชากร ครัวเรือน; สิ่งปลูกสร้างใช้พีช–ทองตามนิยาม ไม่ใช่ตัวหารที่สี่ อ่านชื่อ หน่วย และตัวหารร่วมกับสีเสมอ','3 density denominators keep warm colors: area, population and households. Built form uses peach–gold for its defined measure; it is not a fourth denominator. Always read the name, unit and denominator alongside color.'],
 ['เปรียบเทียบคลังสี','Compare color libraries'],['Density 3 ตัวหาร + สิ่งปลูกสร้างตามนิยาม','3 density denominators + defined built-form measures'],
 ['Density · ชุดก่อนปรับ','Density · previous colors'],['สีชุดเดิม 0.9.6','Previous 0.9.6 colors'],
 ['ดูระดับสีและเทียบของเดิม ↗','Inspect classes and compare earlier colors ↗'],
 ['กิจกรรม ความเข้ม และราคา','Activity, intensity and price'],['ปริมาณ อายุ และระยะ','Quantity, age and duration'],
 ['สองทิศทาง · ค่ากลางต้องมีความหมาย','Diverging · the pivot must have a defined meaning'],
 ['สเกลข้อมูลควรสื่อความหมายใกล้กันเป็นกลุ่ม แต่ไม่ควรใช้สีเพียงอย่างเดียวเพื่อบอกชื่อ metric ตระกูลที่ใกล้กันยังต้องมีชื่อ หน่วย และ legend ชัดเจน','Related analytical scales may share a hue family. Color alone must not identify the metric: provide a clear name, unit and legend, especially for nearby families.'],
 ['ทุกขั้นสีของ DS 0.9.7 · 20 ตระกูล × 2 ธีม × 41 ขั้น','Every DS 0.9.7 color step · 20 families × 2 themes × 41 steps'],
 ['ต่างกันทั้งบุคลิกและระยะภายในสเกล','Compare each route and the spacing within it'],
 ['ดูช่วงสีเดิมเทียบกับชุดปรับ แล้วลองแบ่ง 3 / 5 / 7 / 9 ระดับ ตัวอย่างทั้งหมดเป็นข้อมูลสมมติ','Compare the earlier and current routes, then try 3 / 5 / 7 / 9 classes. All examples use illustrative data.'],
 ['ตระกูลข้อมูล','Analytical family'],['จำนวนระดับ','Number of classes'],['ช่วยตรวจความหมายทั้งหน้า','Inspect color perception across the atlas'],
 ['จำลองการเห็นสีเขียวบกพร่อง','Simulate deuteranopia'],
 ['ก่อนหน้า · DS 0.9.6','Previous · DS 0.9.6'],['ปรับใหม่ · ช่วงเต็มของ DS 0.9.7','Current · full DS 0.9.7 route'],['สีที่อนุมัติ 0.9.7','Approved 0.9.7 colors'],['สีเดิม','Previous colors'],
 ['ตารางข้อมูลสมมติแสดงค่าตาม legend','Illustrative data grid with values keyed to the legend'],['ดัชนีสมมติ 0–100 · ตารางข้อมูล','Illustrative index 0–100 · data grid'],['ค่าต่างจากฐาน −100 ถึง +100','Deviation from the baseline, −100 to +100'],
 ['หัว–กลาง–ท้ายต่างเฉดชัดเจน โดยคงความสว่างและทิศทางน้อย → มาก; สีกลางไม่ใช่ค่าศูนย์','Distinct start, middle and end hues preserve monotonic lightness and the low-to-high direction; the middle hue does not represent zero'],
 ['แต่ละด้านไล่ระดับต่อเนื่องจากค่ากลาง อ่านเครื่องหมาย − / + ร่วมด้วย สีตรงกลางแทนช่วงรอบ 0 ตาม legend ไม่ใช่เฉพาะค่า 0','Each arm progresses continuously from the pivot. Read the − / + signs as well. The central color represents the interval around 0 defined by the legend, not 0 alone'],
 ['ตัวอย่างนี้ใช้ค่าจำนวนเต็ม และระบุขอบช่วงสำหรับจำนวนเต็ม','This example uses integer values and states integer class boundaries'],
 ['เกณฑ์ 2.2 ΔE เป็นเกณฑ์ตรวจระยะสี ไม่ใช่การรับรองการรับรู้สีของทุกคน','The 2.2 ΔE threshold screens color spacing; it does not certify perception for every viewer'],
 ['สีปกติ · ป้ายและรูปทรงช่วยรักษาความหมายเมื่อมองสีแยกได้ยาก','Normal color · labels and shapes preserve meaning when colors are difficult to distinguish'],
 ['ขาวดำ: อ่านชื่อ หมายเลข รูปทรง และระดับประกอบ','Grayscale: read names, numbers, shapes and classes together'],
 ['การจำลอง deuteranopia โดยประมาณ ไม่ใช่การทดสอบกับผู้ใช้จริง','Approximate deuteranopia simulation; not a test with actual users'],
 ['ดูสีและช่วงตัวเลขของตัวอย่างนี้','Inspect the colors and numeric intervals for this example'],['สีเดียวกับกราฟและ legend','The same colors used in the chart and legend'],['ช่วง / ระดับ','Interval / class'],
 ['Gradient แบรนด์ทั้ง 7 สูตรยังคงเดิม','All 7 brand gradient recipes are retained'],
 ['การปรับครั้งนี้อยู่ที่สีข้อมูล เสียงแบรนด์ ฟอนต์ โลโก้ พื้นผิว และ gradient บรรยากาศยังรักษาสิ่งที่ดีจาก 0.9.1','This update concerns analytical colors. Brand voice, fonts, logos, surfaces and atmospheric gradients retain the strengths of 0.9.1.'],
 ['เลือก gradient บรรยากาศ','Choose an atmospheric gradient'],['มองเห็นบริบท','Understand the context'],['ก่อนลงมือเปลี่ยนแปลง','before making a change'],['ใช้บรรยากาศช่วยเปิดเรื่องและจัดจังหวะ','Use atmosphere to introduce the story and set its rhythm'],['ให้ข้อมูลเป็นสิ่งที่ผู้อ่านเห็นชัดเสมอ','Keep the evidence clearly in view'],['ตัวอย่างพื้นผิว · ไม่ใช้เข้ารหัสข้อมูล','Surface example · does not encode data'],
 ['ทิศทาง 135° · คงสูตรเดิมจาก 0.9.1','Direction 135° · original 0.9.1 recipe retained'],['บรรยากาศและการจัดลำดับเนื้อหา ไม่ใช้แทนปริมาณหรือสถานะข้อมูล','Atmosphere and content hierarchy; never a substitute for data quantity or status'],
 ['ขอบเขตของรอบนี้','Scope of this release'],['ใช้งานจากแหล่งเดียว ตรวจเวอร์ชันได้','One source, with a verifiable version'],['สิ่งที่คงไว้','Retained'],['สิ่งที่เปลี่ยน','Updated'],
 ['Brand Energy · Categorical ทั้งสองธีม · หน่วยและตัวหาร · แบรนด์ ภาษา identity และ motif/animation · gradient บรรยากาศ','Brand Energy · categorical palettes in both themes · units and denominators · brand, voice, identity and motif/animation · atmospheric gradients'],
 ['Story มี 20 ตระกูลพร้อมสีเดิมและทิศทางค่าเดิมทั้งสองธีม ใช้ตาราง 41 ขั้นกับชุด 3/5/7/9 ระดับเดียวกันทุกเครื่องมือ','Story includes 20 families, using identical colors and value direction in both themes. Use the same 41-step lookup tables and 3/5/7/9-class sets in every tool.'],
 ['เจ้าของอนุมัติให้ประกาศ DS 0.9.7 เมื่อ 1 ตุลาคม 2026 แพ็กเกจมี checksum และ normative ฉบับเต็ม standalone; รุ่นนี้ไม่อ้างลายเซ็นดิจิทัลใหม่ การติดตั้งและเปิดใช้ในแต่ละ workspace ต้องตรวจแยก','The owner approved DS 0.9.7 for release on 1 October 2026. The package includes checksums and a complete standalone normative document. No new digital signature is claimed; installation and activation must be verified separately in each workspace.'],
 ['การจำลองการเห็นสีเป็นเพียงเครื่องมือประกอบ ไม่ใช่การรับรองว่าทุกคนหรือทุกจอแยกทุกสีได้ตรงกัน','Color-vision simulation is supporting evidence, not certification that every person or display can distinguish every color'],['เปิดหน้าอ้างอิง 0.9.1 ที่เก็บไว้','Open the archived 0.9.1 reference'],
 ['ปริมาณกิจกรรมในช่วงเวลาที่กำหนด','Activity volume over a defined time period'],['จำนวนต่อหน่วยพื้นที่ ต้องระบุหน่วยพื้นที่','Count per unit of area; state the area unit'],['ระดับความร้อนตามหน่วยที่กำหนด','Heat level in the stated unit'],['ใช้กับดัชนีความเสี่ยงที่มีหลักฐานและวิธีวัด','For risk indices with evidence and a stated measurement method'],['มูลค่าภายใต้หน่วยและช่วงเวลาเดียวกัน','Value measured in a consistent unit and time period'],['อายุหรือระยะเวลาตั้งแต่เกิดเหตุการณ์','Age or elapsed time since an event'],['ระบุตัวหารเป็นครัวเรือน','State households as the denominator'],['ปริมาณการเติบโตที่มีทิศทางเพิ่มขึ้น','Growth magnitude in the increasing direction'],['ระดับความเชื่อมั่นของแบบจำลองหรือหลักฐาน','Confidence in a model or evidence'],['จำนวนรวม ไม่ใช่อัตราหรือความหนาแน่น','Total count, not a rate or density'],['ปริมาณหรือระดับน้ำตามหน่วยที่ระบุ','Water quantity or level in the stated unit'],['ระบุตัวหารและฐานประชากร','State the denominator and population base'],['ความเข้มข้นของสิ่งปลูกสร้างตามนิยามชุดข้อมูล','Built-form intensity as defined by the dataset'],['ระยะเวลาตามหน่วยเดียวกัน','Duration in a consistent unit'],['ค่าลบและบวกรอบจุดสมดุลที่มีความหมาย','Negative and positive values around a meaningful balance point'],['ค่าลดลงและเพิ่มขึ้นจากฐานเดียวกัน','Decreases and increases from a shared baseline'],['สองทิศทางรอบค่ากลางที่ประกาศ','Two directions around the declared pivot'],['ขาออกและขาเข้ารอบค่าสุทธิศูนย์','Outflow and inflow around zero net flow'],['สองทิศทางรอบค่ากลางของวิธีวัด','Two directions around the neutral point defined by the method'],['ต่ำกว่าหรือสูงกว่าค่าอ้างอิง','Below or above the reference value'],
 ['ดัชนีตัวอย่าง ไม่ใช่การประเมินพื้นที่จริง','Illustrative index, not an assessment of a real location'],['ดัชนีกิจกรรมตัวอย่าง','Illustrative activity index'],['ดัชนีการเติบโตตัวอย่าง','Illustrative growth index'],['ระดับน้ำตัวอย่าง','Illustrative water level'],['การไหลสุทธิตัวอย่าง','Illustrative net flow'],['บาท / หน่วย ตัวอย่าง','Illustrative THB / unit'],['ค่าต่างจากจุดสมดุล 0','Difference from the 0 balance point'],['การเปลี่ยนแปลงจากฐาน 0','Change from the 0 baseline'],['ส่วนต่างจากฐาน 0','Deviation from the 0 reference'],['หน่วย / ครัวเรือน','Units / household'],['หน่วย / คน','Units / person'],['แห่ง / ตร.กม.','Locations / km²'],['คะแนนตัวอย่าง','Illustrative score'],['ดัชนีตัวอย่าง','Illustrative index'],['°C ตัวอย่าง','Illustrative °C'],['ค่ากลาง 0','Pivot at 0'],
 ['ความหนาแน่นต่อพื้นที่','Density per area'],['ต่อครัวเรือน','Per household'],['ต่อประชากร','Per capita'],['ระดับความเสี่ยง','Risk'],['ความเชื่อมั่น','Confidence'],['พื้นที่ก่อสร้าง','Built form'],['การเติบโต','Growth'],['การเปลี่ยนแปลง','Change'],['การแลกเปลี่ยน','Trade-off'],['การไหลสุทธิ','Net flow'],['ความคิดเห็น','Sentiment'],['ความผิดปกติ','Anomaly'],['จำนวนรวม','Total count'],['ระยะเวลา','Duration'],['ความร้อน','Heat'],['กิจกรรม','Activity'],['ราคา','Price'],['อายุ','Age'],['สมดุล','Balance'],['น้ำ','Water'],
 ['ทั้งสองธีมใช้ช่วงเดียวกัน','Both themes use the same range'],['ทั้งสองธีม','both themes'],['น้อย → มาก','Low → high'],['ต่ำกว่าฐาน','Below baseline'],['สูงกว่าฐาน','Above baseline'],['0 · ฐาน','0 · baseline'],['ΔE ต่ำสุด','Minimum ΔE'],['พื้นสว่าง','Light surface'],['พื้นมืด','Dark surface'],['สีปกติ','Normal color'],['ขาวดำ','Grayscale'],['ตารางข้อมูล','Data grid'],
 ['หัว','Start'],['กลาง','Middle'],['ท้าย','End'],['น้อย','Low'],['มาก','High'],['ตระกูล','families'],['ระดับ','classes'],['ขั้น','steps'],['แบ่ง','Split into'],['ช่วงสี','Color range'],['หมวด','Category'],['สถานะ','Status'],['แห่ง','Locations'],['นาที','Minutes'],['ปี','Years']
 ].sort((a,b)=>b[0].length-a[0].length);
 function translate(value){let text=String(value);if(!/[\u0E00-\u0E7F]/.test(text))return text;for(const [th,en]of phrases)text=text.split(th).join(en);return text;}
 const api={translate};globalThis.LDSAtlasLocale=api;
 if(typeof document==='undefined')return;
 const atlas=document.getElementById('lds097-color-atlas');if(!atlas)return;
 const textSource=new WeakMap(),attributeSource=new WeakMap();
 function rendition(cache,key,current,language){let source=cache.get(key);if(!source||current!==source.th&&current!==source.en){source={th:current,en:translate(current)};cache.set(key,source);}return source[language];}
 function apply(){
  const language=document.documentElement.dataset.locale==='en'?'en':'th';
  const walker=document.createTreeWalker(atlas,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement?.closest('script,style,code,pre,kbd,samp,textarea,[contenteditable]')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  let node;while((node=walker.nextNode())){const next=rendition(textSource,node,node.data,language);if(node.data!==next)node.data=next;}
  for(const element of [atlas,...atlas.querySelectorAll('[aria-label],[title],[alt]')]){
   if(element.closest('script,style,code,pre,kbd,samp,textarea,[contenteditable]'))continue;
   let cache=attributeSource.get(element);if(!cache){cache=new Map();attributeSource.set(element,cache);}
   for(const name of ['aria-label','title','alt'])if(element.hasAttribute(name)){const current=element.getAttribute(name),next=rendition(cache,name,current,language);if(current!==next)element.setAttribute(name,next);}
  }
  if(atlas.lang!==language)atlas.lang=language;
 }
 api.apply=apply;apply();
 new MutationObserver(apply).observe(document.documentElement,{attributes:true,attributeFilter:['data-locale']});
 new MutationObserver(apply).observe(atlas,{childList:true,subtree:true});
})();
