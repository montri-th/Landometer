// Local repair; this does not change the signed LDS machine package.
export const REPAIR_ID = 'lds094-local-repair-20260929';
export const STATES = ['measured', 'measured_zero', 'no_data', 'out_of_scope', 'suppressed', 'not_yet'];
const has = (o, key) => Object.prototype.hasOwnProperty.call(o, key);
const decode = s => s.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&nbsp;/gi, ' ').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&');
const plain = s => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const attributes = s => Object.fromEntries([...s.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(m => [m[1].toLowerCase(), decode(m[2] ?? m[3] ?? m[4] ?? '')]));
function elements(html) {
  const markup = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const list = [], stack = [];
  const voids = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  for (const m of markup.matchAll(/<(\/)?([\w-]+)\b([^>]*)>/g)) {
    const name = m[2].toLowerCase();
    if (m[1]) {
      const index = stack.findLastIndex(e => e.name === name);
      if (index >= 0) { for (const el of stack.splice(index)) el.inner = markup.slice(el.start, m.index); }
    } else {
      const el = { name, a: attributes(m[3]), start: m.index + m[0].length, inner: '', ancestors: [...stack] };
      list.push(el);
      if (!voids.has(name) && !m[0].endsWith('/>')) stack.push(el);
    }
  }
  for (const el of stack) el.inner = markup.slice(el.start);
  return list;
}
const cls = (el, name) => (el.a.class ?? '').split(/\s+/).includes(name);
function displayedNumber(text) {
  text = text.replace(/[๐-๙]/g, c => String(c.charCodeAt(0) - 0x0e50)).replace(/−/g, '-');
  // Exact decimal followed by an optional unit; inequalities/ranges/abbreviations are unsupported.
  const m = text.match(/^([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(?:\s+[^\d]*|\s*[%฿])?$/u);
  return m ? Number(m[1].replaceAll(',', '')) : null;
}
function canonicalNumber(value) {
  return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value ?? '') && Number.isFinite(Number(value)) ? Number(value) : null;
}
function checkValue(el, text, label, requireState, problems) {
  const state = el.a['data-state'];
  const visible = displayedNumber(text);
  const canonical = has(el.a, 'data-value') ? canonicalNumber(el.a['data-value']) : null;
  if (/^n\/?a$/i.test(text)) problems.push(`${label}: N/A is prohibited; use an explicit exceptional state`);
  if (!state) {
    if (requireState || visible === 0 || /^(?:[—–-]|…)?$/.test(text)) problems.push(`${label}: missing data-state`);
    if (has(el.a, 'data-value') && (canonical === null || visible === null || canonical !== visible)) problems.push(`${label}: unstated normal display differs from its canonical data-value`);
    return;
  }
  if (!STATES.includes(state)) { problems.push(`${label}: unknown state ${state}`); return; }
  if (state === 'measured' || state === 'measured_zero') {
    if (state === 'measured' && !has(el.a, 'data-value')) problems.push(`${label}: measured requires a canonical data-value`);
    if (has(el.a, 'data-value') && canonical === null) problems.push(`${label}: data-value must be a finite decimal`);
    const value = canonical ?? visible;
    if (value === null) problems.push(`${label}: numeric state has no verifiable numeric value`);
    if (state === 'measured_zero' && value !== 0) problems.push(`${label}: measured_zero requires numeric zero`);
    if (state === 'measured' && value === 0) problems.push(`${label}: zero must use measured_zero`);
    if (visible === null) problems.push(`${label}: visible numeric value cannot be verified; use an exact decimal with optional unit`);
    if (canonical !== null && visible !== null && canonical !== visible) problems.push(`${label}: displayed ${visible} differs from data-value ${canonical}`);
  } else {
    if (has(el.a, 'data-value')) problems.push(`${label}: exceptional state must omit numeric data-value`);
    if (visible !== null) problems.push(`${label}: exceptional state cannot display a plain measured numeric value`);
    if (!text) problems.push(`${label}: exceptional state must have its visible glyph or label`);
  }
}
export function validateValueStates(html, payload) {
  const problems = [], list = elements(html);
  const cards = list.filter(e => e.name === 'figure' && cls(e, 'lds-evidence-card'));
  for (const [i, card] of cards.entries()) {
    const value = list.find(e => e.ancestors.includes(card) && cls(e, 'lds-evidence-card__value'));
    if (!value) problems.push(`EvidenceCard ${i + 1}: missing .lds-evidence-card__value`);
    checkValue(card, plain(value?.inner ?? ''), `EvidenceCard ${i + 1}`, true, problems);
  }
  for (const [i, cell] of list.filter(e => e.name === 'td').entries()) {
    const glyph = list.find(e => e.ancestors.includes(cell) && cls(e, 'lds-cell-glyph'));
    const text = plain(glyph?.inner ?? cell.inner);
    // Textual descriptive cells are not numeric value cells, but explicit states are always checked.
    if (cls(cell, 'num') || has(cell.a, 'data-state') || displayedNumber(text) !== null || /^(?:N\/?A|[—–-])$/i.test(text)) checkValue(cell, text, `table cell ${i + 1}`, false, problems);
  }
  if (payload !== undefined) {
    const walk = (o, path) => {
      if (Array.isArray(o)) o.forEach((v, i) => walk(v, `${path}[${i}]`));
      else if (o && typeof o === 'object') {
        if (has(o, 'state') && !has(o, 'value')) problems.push(`${path}: a governed state requires a value field (null for exceptional states)`);
        if (has(o, 'value') && (typeof o.value === 'number' || o.value === null || has(o, 'state'))) {
          if (!STATES.includes(o.state)) problems.push(`${path}: value requires a valid state`);
          else if (o.state === 'measured' && !(typeof o.value === 'number' && Number.isFinite(o.value) && o.value !== 0)) problems.push(`${path}: measured requires a finite nonzero number`);
          else if (o.state === 'measured_zero' && o.value !== 0) problems.push(`${path}: measured_zero requires numeric zero`);
          else if (!['measured', 'measured_zero'].includes(o.state) && o.value !== null) problems.push(`${path}: exceptional state requires value null`);
        }
        for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
      }
    };
    walk(payload, '$');
  }
  return { result: problems.length ? 'fail' : 'pass', cardsChecked: cards.length, problems: [...new Set(problems)] };
}
