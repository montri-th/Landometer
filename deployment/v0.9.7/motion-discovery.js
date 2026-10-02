(function(){
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
})();
