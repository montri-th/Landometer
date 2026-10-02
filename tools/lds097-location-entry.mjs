// Compatibility entry for links shared before the Location lab joined the guide.
export function locationEntry(metricIds) {
  const js = `(() => {
  const params = new URLSearchParams(location.search);
  const families = ${JSON.stringify(metricIds)};
  const family = params.get('family') || params.get('liFamily');
  const count = Number(params.get('n') || params.get('liN'));
  const vision = params.get('vision') || params.get('liVision');
  params.set('liFamily', families.includes(family) ? family : 'li.demand');
  params.set('liN', String([41,3,5,7,9].includes(count) ? count : 41));
  params.set('liVision', ['normal','deuteranopia','protanopia','gray'].includes(vision) ? vision : 'normal');
  for (const key of ['family','n','vision']) params.delete(key);
  const section = location.hash === '#roles' ? 'atlas-location-roles' : location.hash === '#scales' ? 'atlas-location-scales' : 'atlas-location-lab';
  location.replace('../?' + params.toString() + '#' + section);
})();\n`;
  const html = `<!doctype html>
<html lang="th" data-ds-version="0.9.7" data-color-registry="color-srgb-10"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Location Intelligence · LDS 0.9.7</title><link rel="canonical" href="https://montri-th.github.io/Landometer/v0.9.7/"><link rel="stylesheet" href="../package/assets/lds-0.9.7/build-kit/lds-0.9.7.css"></head><body><main style="max-width:70ch;margin:8vh auto;padding:24px"><h1>Location อยู่ในคู่มือหลักแล้ว</h1><p>ทดลองสี 41 ช่วง ดูแผนที่ และหยิบไฟล์ไปใช้ได้ต่อเนื่องใน Color Atlas เดียวกัน</p><p>Location Intelligence is now part of the main handbook. Original HEX and LUT values are unchanged. Explore 41 steps, map examples and implementation files together.</p><p><a href="../?liN=41#atlas-location-lab">ไปชุดสี Location ในหน้าหลัก / Open Location in the main handbook</a></p><noscript><p>ลิงก์ด้านบนเปิดตัวอย่าง 41 ช่วงในคู่มือหลักได้โดยไม่ใช้ JavaScript / The link above opens the static 41-step example without JavaScript.</p></noscript></main><script src="location-entry.js"></script></body></html>\n`;
  return {html, js};
}
