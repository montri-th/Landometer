(function(){
 const D=window.LDS_CANDIDATE,R=window.CandidateRender,B=window.PreviewRender;
 let family='density.capita',requested=7,lightVariant='soft';
 const atlas=document.getElementById('lds095-color-atlas');
 function update(){document.getElementById('scale-stage').innerHTML=R.stage(D,family,requested);document.getElementById('exact-colors').innerHTML=R.tables(D,family,requested);document.getElementById('scale-choice').value=family;document.querySelectorAll('[data-count]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.count===requested)));document.getElementById('selection-announcement').textContent=`${D.scales.find(s=>s.id===family).label} ${R.effective(D.scales.find(s=>s.id===family),requested)} ระดับ ทั้งสองธีม`;}
 document.getElementById('scale-choice').addEventListener('change',e=>{family=e.target.value;update();});
 document.querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{requested=+b.dataset.count;update();}));
 document.getElementById('family-library').addEventListener('click',e=>{const b=e.target.closest('[data-family]');if(!b)return;family=b.dataset.family;update();document.getElementById('scale-controls').scrollIntoView({behavior:'instant'});document.getElementById('scale-choice').focus({preventScroll:true});});
 document.querySelectorAll('[data-library-mode]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('family-library').innerHTML=R.library(D,b.dataset.libraryMode);document.querySelectorAll('[data-library-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
 document.querySelectorAll('[data-light-variant]').forEach(b=>b.addEventListener('click',()=>{lightVariant=b.dataset.lightVariant;document.getElementById('categories-stage').innerHTML=R.categories(D,lightVariant);document.getElementById('old-categories').innerHTML=R.categories(D,lightVariant,true);document.querySelectorAll('[data-light-variant]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
 document.getElementById('vision-choice').addEventListener('change',e=>{atlas.classList.remove('vision-gray','vision-deuteranopia');if(e.target.value!=='normal')atlas.classList.add('vision-'+e.target.value);document.getElementById('vision-note').textContent=e.target.value==='normal'?'สีปกติ · ป้ายและรูปทรงช่วยรักษาความหมายเมื่อมองสีแยกได้ยาก':e.target.value==='gray'?'ขาวดำ: อ่านชื่อ หมายเลข รูปทรง และระดับประกอบ':'การจำลอง deuteranopia โดยประมาณ ไม่ใช่การทดสอบกับผู้ใช้จริง';});
 document.querySelectorAll('[data-gradient]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('gradient-stage').innerHTML=B.gradient(D,b.dataset.gradient);document.querySelectorAll('[data-gradient]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
 atlas.dataset.previewReady='true';
})();
