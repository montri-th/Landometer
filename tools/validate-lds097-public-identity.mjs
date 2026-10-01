import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root = new URL('../deployment/',import.meta.url);
const read=p=>readFileSync(new URL(p,root));
const hash=b=>createHash('sha256').update(b).digest('hex');
const icons=JSON.parse(read('v0.9.7/icons/icon-set.json'));
let checks=0;const check=(condition,label)=>{assert(condition,label);checks++};
for(const f of icons.files)check(hash(read(`v0.9.7/icons/${f.file}`))===f.sha256,`Approved icon bytes ${f.file}`);
for(const path of ['index.html','v0.9.7/index.html','v0.9.7/color-atlas.html','v0.9.7/color-reference.html','v0.9.7/location/index.html']){
 const html=read(path).toString();const head=html.match(/<head>([\s\S]*?)<\/head>/)[1];
 for(const f of icons.files)check(head.includes(`${f.file}?v=${f.sha256.slice(0,12)}`),`${path} binds icon ${f.sizePx}`);
 check((head.match(/<title>/g)||[]).length===1,`${path} one title`);
 check(head.match(/<title>(.*?)<\/title>/)[1].length<=60,`${path} title length`);
 check(head.includes('rel="manifest"'),`${path} manifest`);
 check(head.includes('noindex'),`${path} indexing boundary retained`);
 for(const name of ['og:title','og:description','og:url','og:image','og:image:alt','og:image:width','og:image:height'])check(head.includes(`property="${name}"`),`${path} ${name}`);
 check(head.includes('name="twitter:card" content="summary_large_image"'),`${path} Twitter card`);
 const image=head.match(/property="og:image" content="([^"]+)"/)[1];const url=new URL(image);const relative=url.pathname.replace('/Landometer/','');
 const bytes=read(relative);check(url.searchParams.get('v')===hash(bytes).slice(0,12),`${path} image revision`);
 check(bytes.readUInt32BE(16)===1200&&bytes.readUInt32BE(20)===630,`${path} PNG1200x630`);
}
check(JSON.parse(read('v0.9.7/site.webmanifest')).icons.find(f=>f.sizes==='512x512').purpose==='maskable','Approved maskable role');
check(read('index.html').toString().includes("location.search + location.hash"),'Root route preserves state');
const h=read('v0.9.7/index.html').toString();
check(h.includes('รากฐานจาก 0.9.1')&&h.includes('Foundations from 0.9.1'),'Comparison bilingual');
check(h.includes('14 sequential + 6 diverging')&&h.includes('Brand Energy'),'Current colour scope');
console.log(`Public identity: ${checks} bounded checks PASS; rendered and third-party cache verification are separate.`);
