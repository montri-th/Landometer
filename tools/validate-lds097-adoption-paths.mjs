#!/usr/bin/env node
// Validate that each promised route terminates in an actual example or file.
import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {adoptionPaths} from './lds097-adoption-paths.mjs';
const root = resolve(import.meta.dirname, '..');
const site = join(root, 'deployment/v0.9.7');
const bi = (th, en) => `<span data-th>${th}</span><span data-en>${en}</span>`;
const module = adoptionPaths({root, site, bi});
const page = readFileSync(join(site, 'index.html'), 'utf8');
const failures = [];
let checks = 0;
const check = (condition, label) => {checks++; if (!condition) failures.push(label);};
check(page.includes(module.html), 'adoption routes are emitted in the current guide');
check(readFileSync(join(site, 'adoption-paths.css'), 'utf8') === module.css, 'scoped route CSS is current');
check(module.counts.journeys === 12, 'twelve actual work journeys are covered');
const taskNav = module.html.match(/<nav class="lds097-use-nav"[\s\S]*?<\/nav>/)?.[0] ?? '';
check(module.counts.rows.every(id => taskNav.includes(`href="#${id}"`)), 'task navigation links directly to all twelve journeys');
check(!/<button|\brole="tab/.test(taskNav), 'task navigation uses ordinary links');
const localLinks = [...module.html.matchAll(/href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
for (const href of new Set(localLinks)) {
  if (/^https?:/.test(href)) {
    check(href === 'https://github.com/montri-th/Landometer/releases/download/v0.9.7/landometer-design-system-0.9.7.zip', `external link is the known pinned release: ${href}`);
    continue;
  }
  const url = new URL(href, 'https://guide.test/v0.9.7/index.html');
  const targetPath = resolve(root, 'deployment', '.' + url.pathname);
  const retainedTeamPhoto = join(root, 'deployment/assets/images/team-hero.jpg');
  check(targetPath.startsWith(site + '/') || targetPath === retainedTeamPhoto, `local link is current or the exact retained team photograph: ${href}`);
  check(existsSync(targetPath) && statSync(targetPath).isFile(), `link resolves to a file: ${href}`);
  if (url.hash && existsSync(targetPath)) {
    const target = readFileSync(targetPath, 'utf8');
    check(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `example anchor exists: ${href}`);
  }
}
for (const id of module.counts.rows) {
  const row = module.html.split(`id="${id}"`)[1]?.split('</article>')[0] ?? '';
  check(row.includes('lds097-use-example') && row.includes('lds097-use-files') && row.includes('lds097-use-scope'), `${id} pairs an example, files and a scope note`);
}
check(!module.html.includes('build-kit/example.html'), 'broken historical starter is not presented as current');
check(module.html.includes('not ready-made DOCX/PPTX templates'), 'native template availability is described honestly');
check(module.html.includes('not a complete executable widget library'), 'component behaviour is not falsely implied');
check(module.html.includes('needs a network connection'), 'downloadable online starter declares network dependency');
check(module.html.includes('does not activate every account or Project automatically'), 'installation scope is explicit');
check(module.html.includes('No 0.9.4 document is required'), 'current authority does not depend on an older master');
check(module.html.includes('team-culture role') && module.html.includes('not included in the downloadable package'), 'retained photograph role and package coverage are explicit');
check(!/border-(?:left|inline-start)\s*:|box-shadow/.test(module.css), 'no decorative selected rail or shadow is introduced');
check(!/<script|\bhidden\b/.test(module.html), 'adoption content and ordinary links do not depend on JavaScript');
console.log(`Adoption routes: ${checks - failures.length}/${checks} checks passed`);
if (failures.length) {console.error(failures.join('\n')); process.exitCode = 1;}
