import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const site = new URL('../deployment/v0.9.7/', import.meta.url);
const origin = 'https://montri-th.github.io/Landometer/v0.9.7/';
const registry = JSON.parse(readFileSync(new URL('icons/icon-set.json', site)));
const pages = {
 guide: {path:'', title:'Design System 0.9.7 · Landometer', description:'คู่มือแบรนด์ Story Color Atlas และ Location Intelligence · Landometer · 1 ต.ค. 2026 · ตัวอย่างข้อมูลสมมติ', image:'guide', alt:'Landometer Design System 0.9.7: Story 17 สี สเกลข้อมูล 20 ตระกูล และ Location Intelligence'},
 atlas: {path:'color-atlas.html', title:'Story Color Atlas 0.9.7 · Landometer', description:'17 สีเสริมและ 20 สเกลข้อมูล ใช้ HEX เดิมทั้งสองธีม · Landometer · 1 ต.ค. 2026 · ตัวอย่างข้อมูลสมมติ', image:'atlas', alt:'Story Color Atlas 0.9.7: 17 สีเสริม 14 สเกลทางเดียว 6 สเกลสองทาง'},
 reference: {path:'color-reference.html', title:'Colour Reference 0.9.7 · Landometer', description:'ชุดสี บทบาท และสเกลข้อมูล 20 ตระกูลของ LDS 0.9.7 · Landometer · 1 ต.ค. 2026 · ตัวอย่างข้อมูลสมมติ', image:'atlas', alt:'Story Color Atlas 0.9.7: 17 สีเสริม 14 สเกลทางเดียว 6 สเกลสองทาง'},
 location: {path:'location/', title:'Location Intelligence 0.9.7 · Landometer', description:'16 บทบาทสำหรับการเลือกทำเล พร้อม 12 สเกลและ SWOT · Landometer · 1 ต.ค. 2026 · ตัวอย่างข้อมูลสมมติ', image:'location', alt:'Location Intelligence 0.9.7: 16 บทบาท 12 metric scales และ 4 SWOT evidence lenses'}
};
const hash = p => createHash('sha256').update(readFileSync(new URL(p, site))).digest('hex').slice(0,12);
export function publicHead(html, key='guide', prefix='') {
 const page=pages[key];
 const image=`${origin}social/${page.image}-097.png?v=${hash(`social/${page.image}-097.png`)}`;
 const tags = [
  `<title>${page.title}</title>`, `<meta name="description" content="${page.description}">`,
  `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F6F7F3">`,
  `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#11191D">`,
  ...registry.files.map(f=>`<link rel="${f.role==='apple-touch'?'apple-touch-icon':'icon'}" type="image/png" sizes="${f.sizePx}x${f.sizePx}" href="${prefix}icons/${f.file}?v=${f.sha256.slice(0,12)}">`),
  `<link rel="manifest" href="${prefix}site.webmanifest">`,
  `<meta property="og:type" content="website">`, `<meta property="og:site_name" content="Landometer">`,
  `<meta property="og:url" content="${origin}${page.path}">`, `<meta property="og:locale" content="th_TH">`,
  `<meta property="og:title" content="${page.title}">`, `<meta property="og:description" content="${page.description}">`,
  `<meta property="og:image" content="${image}">`, `<meta property="og:image:type" content="image/png">`,
  `<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`, `<meta property="og:image:alt" content="${page.alt}">`,
  `<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:title" content="${page.title}">`,
  `<meta name="twitter:description" content="${page.description}">`, `<meta name="twitter:image" content="${image}">`, `<meta name="twitter:image:alt" content="${page.alt}">`
 ];
 const match=html.match(/<head>([\s\S]*?)<\/head>/);if(!match)throw Error('Missing head');
 const clean=match[1].replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta\b[^>]*(?:name="(?:description|theme-color|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g,'').replace(/<link\b[^>]*rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g,'');
 return html.replace(match[0],`<head>${clean.replace(/[ \t]+$/gm,'').replace(/\n[ \t]*\n+/g,'\n').trim()}\n  ${tags.join('\n  ')}\n</head>`);
}
