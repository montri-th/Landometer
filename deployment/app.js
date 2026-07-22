(() => {
  'use strict';

  const root = document.documentElement;
  const params = new URL(location.href).searchParams;
  const validModes = ['start', 'reference', 'lab'];
  const specimenOrder = ['proofs', 'theme', 'typography', 'states', 'charts', 'scales', 'map', 'motion', 'products', 'share', 'metadata'];
  const globalStatus = document.getElementById('global-status');
  let statusTimer;
  let scaleRegistry = null;
  let generatedBuildCard = '';
  let currentMode = validModes.includes(params.get('mode')) ? params.get('mode') : 'start';
  let currentRole = ['design', 'development', 'product', 'marketing', 'review'].includes(params.get('role')) ? params.get('role') : 'design';
  let currentRoleView = params.get('view') === 'baseline' ? 'baseline' : 'assisted';
  let currentSpecimen = specimenOrder.includes(params.get('specimen')) ? params.get('specimen') : 'proofs';
  let currentProof = params.get('proof') || 'reward-before-request';
  let currentProofView = params.get('proofView') === 'baseline' ? 'baseline' : 'assisted';
  let currentHandoff = 'marketing';
  let currentProduct = 'landometer';

  const roleData = {
    design: {
      job: 'Design · one job',
      titleTh: 'ทำให้สถานะ ขอบเขต และ recovery อ่านได้ในครั้งเดียว',
      titleEn: 'Make state, boundary, and recovery legible at a glance',
      outcomeTh: 'ผู้ใช้เห็นว่าไม่มีผลปัจจุบันก่อนกดหรือสรุปอะไรต่อ',
      outcomeEn: 'The user sees that there is no current result before acting or summarizing.',
      recipe: 'DecisionCard: Object → status → meaning → evidence/limit → one next action. Keep empty distinct from zero and show recovery.'
    },
    development: {
      job: 'Development · one job',
      titleTh: 'ผูกสถานะและสีเข้ากับ token ที่ทดสอบได้',
      titleEn: 'Bind state and color to testable canonical tokens',
      outcomeTh: 'โค้ดไม่สร้างสี สถานะ หรือความหมายชุดย่อยขึ้นเอง',
      outcomeEn: 'Code does not invent a local palette, state vocabulary, or meaning.',
      recipe: 'Consume canonical tokens; represent empty as state="empty"; assert sourceStatus and limitation; test keyboard, theme parity, and recovery.'
    },
    product: {
      job: 'Product · one job',
      titleTh: 'กำหนด readiness และขอบเขตความจริงก่อนเริ่ม build',
      titleEn: 'Define readiness and the truth boundary before build',
      outcomeTh: 'ทีมรู้ว่าอะไรคือ AHA, อะไรทำไม่ได้ และจบงานอย่างซื่อตรงได้อย่างไร',
      outcomeEn: 'The team knows the AHA, unavailable actions, and the honest completion path.',
      recipe: 'Build Card: oneJob + dominantObject + firstAha + evidence cue + one action + clean completion + profile + enabled capabilities.'
    },
    marketing: {
      job: 'Marketing · one job',
      titleTh: 'พูดประโยชน์พร้อมสถานะและข้อจำกัด โดยไม่ทำให้พร้อมเกินจริง',
      titleEn: 'State the benefit with status and limitation—without overstating readiness',
      outcomeTh: 'ข้อความดึงความสนใจได้และยังพาผู้อ่านไปตรวจหลักฐานต่อ',
      outcomeEn: 'The message earns attention while preserving a route to inspect evidence.',
      recipe: 'Claim recipe: concrete object + result/status + source/date + limitation + next safe action. Avoid hype and generic transformation language.'
    },
    review: {
      job: 'Review / QA · one job',
      titleTh: 'ย้อนจากตัวอย่างไปยังกฎ แหล่งที่มา และ release gate ได้',
      titleEn: 'Trace the specimen to its rule, source, and release gate',
      outcomeTh: 'ผู้ตรวจชี้ได้ว่าผ่านเพราะอะไร ขาดอะไร และ severity ระดับใด',
      outcomeEn: 'A reviewer can name why it passes, what is missing, and the severity.',
      recipe: 'Review trace: specimen → data-source-section → rule ID → acceptance → viewport/theme/state evidence → limitation or exception record.'
    }
  };

  const handoffData = {
    marketing: {
      role: 'Marketing',
      th: 'พูดประโยชน์โดยไม่ทำให้สถานะดูพร้อมกว่าความจริง',
      en: 'Communicate value without making readiness look better than it is',
      copyTh: '“ข้อมูลพื้นที่นี้ยังไม่มีผลปัจจุบัน ตรวจแหล่งข้อมูลก่อนนำไปใช้ตัดสินใจ”',
      copyEn: '“This place insight has no current result. Inspect the source before using it for a decision.”'
    },
    product: {
      role: 'Product',
      th: 'ล็อก AHA, boundary และ clean completion ใน Build Card',
      en: 'Lock the AHA, boundary, and clean completion in the Build Card',
      copyTh: 'AHA คือผู้ใช้เห็นว่าไม่มีผลปัจจุบันและรู้ว่าจะตรวจ Source Ledger หรือจบงานโดยไม่แต่งค่า',
      copyEn: 'The AHA is seeing that no current result exists and knowing to inspect the Source Ledger or finish without inventing a value.'
    },
    design: {
      role: 'Design',
      th: 'ทำให้ empty ต่างจาก zero และมองเห็น recovery',
      en: 'Make empty distinct from zero and keep recovery visible',
      copyTh: 'Status อยู่ข้างวัตถุ ข้อจำกัดอยู่ก่อน action และไม่ใช้สีเพียงอย่างเดียวสื่อความหมาย',
      copyEn: 'Status sits beside the object, limitation precedes action, and color is never the only cue.'
    },
    development: {
      role: 'Development',
      th: 'ผูก state, token และ test เข้ากับ object/version เดียวกัน',
      en: 'Bind state, tokens, and tests to the same object/version',
      copyTh: 'Renderer, accessible alternative และ manifest ต้องรายงาน empty / source-limited ตรงกัน',
      copyEn: 'Renderer, accessible alternative, and manifest must all report empty / source-limited.'
    },
    qa: {
      role: 'Evidence / QA',
      th: 'หยุด release เมื่อ channel ใด channel หนึ่งอัปเกรดความจริง',
      en: 'Stop release when any channel upgrades the truth',
      copyTh: 'partial ห้ามกลายเป็น complete; source-limited ห้ามกลายเป็น verified; handoff ห้ามกลายเป็น network effect',
      copyEn: 'Partial must not become complete; source-limited must not become verified; handoff must not become network effect.'
    }
  };

  const proofData = [
    {
      id: 'reward-before-request', baseline: true,
      label: 'Reward before request',
      th: ['เห็นข้อมูลพื้นที่ที่มีประโยชน์ก่อนถูกขอสมัครหรือบันทึก', 'หน้าแรกขอ email หรือ permission ก่อนแสดงผล', 'เปิด insight และข้อจำกัดก่อน แล้วค่อยเสนอ save เมื่อมีประโยชน์', 'ผู้ใช้รับคุณค่าและออกได้โดยไม่เสียอะไร', 'Timing trace: AHA precedes every investment control; pre-AHA prompt is blocked.'],
      en: ['See useful place insight before signup or save', 'The first screen asks for email or permission before value', 'Reveal the insight and limitation first; offer save only after value', 'The user receives value and may leave without penalty', 'Timing trace: AHA precedes every investment control; pre-AHA prompt is blocked.']
    },
    {
      id: 'decision-quality', baseline: true, label: 'Decision quality',
      th: ['เปรียบเทียบตัวเลือกโดยเห็นหลักฐาน ความไม่แน่นอน และ counter-signal', 'ranking แสดงคะแนนเดียวและซ่อนสมมติฐาน', 'แสดงสองตัวเลือก พร้อม supporting signal, counter-signal และ defer/reject', 'ผู้ใช้เลือก ชะลอ หรือปฏิเสธพร้อมเหตุผลที่ตรวจได้', 'Preserve assumptions and incomplete-evidence branch; warn when a plausible change reverses the result.'],
      en: ['Compare options with evidence, uncertainty, and a counter-signal', 'A ranking shows one score and hides assumptions', 'Show two options with supporting and counter-signals plus defer/reject', 'The user can select, defer, or reject with an inspectable rationale', 'Preserve assumptions and incomplete-evidence branch; warn when a plausible change reverses the result.']
    },
    {
      id: 'private-by-default', baseline: true, label: 'Private by default',
      th: ['สร้างงานส่วนตัวแล้วเลือกผู้รับอย่างชัดเจน', 'การสร้างวัตถุทำให้ทุกคนเห็นโดยปริยาย', 'เริ่ม private แสดง redaction preview แล้วเพิ่มผู้รับหนึ่งคน', 'ผู้ใช้รู้ว่าอะไรออกจาก private scope และยกเลิกได้', 'Evidence includes redaction preview, permission failure, and revoke path.'],
      en: ['Create privately, then choose the recipient explicitly', 'Creating the object makes it visible to everyone by default', 'Start private, show a redaction preview, then add one recipient', 'The user knows exactly what leaves private scope and can revoke it', 'Evidence includes redaction preview, permission failure, and revoke path.']
    },
    {
      id: 'relevant-circle-coordination', baseline: true, label: 'Relevant-circle coordination',
      th: ['ส่งวัตถุ/version เดียวกันให้บทบาทที่เกี่ยวข้อง', 'แชร์ลิงก์ทั่วไปโดยไม่ระบุผู้รับหรือ outcome', 'เลือกบทบาทผู้รับและ preview exact object ก่อน handoff', 'ผู้รับเห็นวัตถุเดียวกัน พร้อม limitation และ action ที่เหมาะกับบทบาท', 'Evidence includes recipient view, failed handoff, and safe fallback.'],
      en: ['Hand off the same object/version to the relevant role', 'A generic link is shared without recipient or outcome', 'Choose the recipient role and preview the exact object before handoff', 'The recipient sees the same object, limitation, and role-relevant action', 'Evidence includes recipient view, failed handoff, and safe fallback.']
    },
    {
      id: 'recovery-completeness', baseline: true, label: 'Recovery completeness',
      th: ['รู้ว่าอะไรล้มเหลว อะไรยังอยู่ และทำอะไรต่อได้', 'error ลบ input และเหลือข้อความ “ลองใหม่” อย่างเดียว', 'รักษาวัตถุ/input แสดง last known state และ retry/alternative', 'ผู้ใช้กลับมาทำงานต่อได้โดยไม่สร้างงานซ้ำ', 'Test default/loading/empty/partial/offline/error/restricted/retry with accessible announcements.'],
      en: ['Know what failed, what remains, and what can happen next', 'An error erases input and leaves only “Try again”', 'Preserve object/input, show last known state, and offer retry or an alternative', 'The user resumes without reconstructing the task', 'Test default/loading/empty/partial/offline/error/restricted/retry with accessible announcements.']
    },
    {
      id: 'cta-integrity', baseline: true, label: 'CTA integrity',
      th: ['เข้าใจ action, consequence, eligibility และ receipt ก่อนกด', 'label เดิมแม้ consequence หรือ eligibility เปลี่ยน', 'เปลี่ยน label/state/disabled reason พร้อม consequence', 'ผู้ใช้กด action ที่ตรงกับสิ่งที่จะเกิดขึ้นและไม่ยิงซ้ำ', 'Evidence covers failure, pending, authoritative receipt, and duplicate-action protection.'],
      en: ['Understand action, consequence, eligibility, and receipt before acting', 'The label stays unchanged when consequence or eligibility changes', 'Update label, state, and disabled reason with the consequence', 'The user triggers the intended effect once and receives the correct receipt', 'Evidence covers failure, pending, authoritative receipt, and duplicate-action protection.']
    },
    {
      id: 'transparent-learning', baseline: false, label: 'Transparent learning',
      th: ['รู้ว่า input ใดเปลี่ยน recommendation ในอนาคต', 'ระบบบอกว่า “เรียนรู้แล้ว” แต่ไม่ให้ดูหรือแก้', 'เปิด input, scope, benefit, retention และวิธี disable/delete', 'ผู้ใช้ตรวจ แก้ ปิด หรือถอนข้อมูลที่มีผลได้', 'Correction, opt-out, retention, and deletion remain inspectable.'],
      en: ['Know which input changes a future recommendation', 'The system says it “learned” but offers no inspection or correction', 'Expose input, scope, benefit, retention, and disable/delete routes', 'The user can inspect, correct, disable, or remove the influential input', 'Correction, opt-out, retention, and deletion remain inspectable.']
    },
    {
      id: 'voluntary-investment', baseline: false, label: 'Voluntary investment',
      th: ['เลือก save, outcome หรือ context หลังได้รับคุณค่า', 'บังคับ save หรือ share เพื่อไปต่อ', 'บอกประโยชน์และมี clean exit ที่ไม่มี penalty', 'ผู้ใช้ลงทุนเมื่อเห็นประโยชน์ หรือจบงานได้อย่างสมบูรณ์', 'Receipt, undo/delete, and absence of hidden personalization are verified.'],
      en: ['Choose save, outcome, or context investment after value', 'Save or share is required to continue', 'Name the benefit and provide a penalty-free clean exit', 'The user invests when useful or completes the task without pressure', 'Receipt, undo/delete, and absence of hidden personalization are verified.']
    },
    {
      id: 'hook-without-dark-patterns', baseline: false, label: 'Hook without dark patterns',
      th: ['ทำ trigger → action → reward ที่มาจากเป้าหมายจริงของผู้ใช้', 'ใช้ streak, guilt หรือ variable reward ดึงให้กลับมา', 'แสดง reward ที่ตรวจได้และ next action ที่สมัครใจ', 'loop ถัดไปเกิดเพราะช่วยงาน ไม่ใช่แรงกดดัน', 'Static anti-pattern explanation only; no operable dark-pattern simulation.'],
      en: ['Complete trigger → action → reward from the user’s real objective', 'Streaks, guilt, or variable reward pressure the return', 'Show an inspectable reward and a voluntary next action', 'The next loop happens because it helps the work—not because of pressure', 'Static anti-pattern explanation only; no operable dark-pattern simulation.']
    },
    {
      id: 'cross-team-handoff', baseline: false, label: 'Cross-team handoff',
      th: ['รักษาความหมายของ claim/object ผ่านทุกบทบาท', 'แต่ละทีมปรับคำจน status หรือ limitation เปลี่ยน', 'ใช้ object/version, source, boundary และ allowed use เดียวกัน', 'ทีมถัดไปตรวจได้ว่าความจริงไม่ถูกอัปเกรด', 'Mismatch branch names the owner and blocking evidence.'],
      en: ['Preserve claim/object meaning across every role', 'Each team rewrites until status or limitation changes', 'Use the same object/version, source, boundary, and allowed use', 'The next role can verify that truth was not upgraded', 'Mismatch branch names the owner and blocking evidence.']
    }
  ];

  const productData = {
    landometer: ['decision-led · human · ecosystem-aware', 'ข้อมูลพื้นที่นี้ยังไม่พร้อมใช้ตัดสินใจ', 'ตรวจแหล่งข้อมูลและข้อจำกัดก่อนสรุปผล', 'This place insight is not ready for a decision', 'Inspect source and limitation before drawing a conclusion.'],
    citymeter: ['map/data-first · source-rich · action-aware', 'พื้นที่นี้ยังไม่มีผลวิเคราะห์ปัจจุบัน', 'เลือกขอบเขตและตรวจ Source Ledger ก่อนรันหรือใช้ผล', 'This area has no current analytical result', 'Select the boundary and inspect the Source Ledger before running or using a result.'],
    citywiki: ['editorial · boundary-aware · practical', 'สิ่งที่ทราบและสิ่งที่ยังต้องตรวจของพื้นที่นี้', 'ข้อมูล fixture นี้ไม่มีแหล่งปัจจุบัน จึงยังอ้างเป็นข้อเท็จจริงของสถานที่ไม่ได้', 'What is known and what still needs checking', 'This fixture has no current source and cannot be cited as a place fact.'],
    citychat: ['calm · mobile-first · status-clear · consent-based', 'ยังไม่มีสถานะที่ยืนยันได้สำหรับพื้นที่นี้', 'เก็บรายละเอียดไว้และส่งต่อไปยังช่องทางตรวจสอบที่ปลอดภัย', 'No verified status is available for this area', 'Keep the details and continue through a safe verification route.'],
    ijji: ['friendly · low-jargon · progress-aware', 'ตอนนี้ยังไม่มีข้อมูลพอแนะนำทิศทางร้าน', 'เติมบริบทที่จำเป็นหรือจบไว้ก่อนโดยไม่เดาคำตอบ', 'There is not enough evidence for a business direction yet', 'Add the essential context or stop here without guessing.']
  };

  const stateData = {
    default: ['Default', 'ข้อมูลพื้นที่พร้อมให้ตรวจ', 'เลือกสถานะเพื่อดู copy, evidence, action และ recovery ที่ต้องเปลี่ยนพร้อมกัน', 'Inspect source'],
    loading: ['Loading', 'กำลังตรวจแหล่งข้อมูล', 'วัตถุและ input ยังอยู่ แสดง stage จริงแทน shimmer', 'Cancel'],
    empty: ['Empty', 'ยังไม่มีผลปัจจุบัน', 'ไม่ใช่ค่า 0 และห้ามใช้ตัดสินใจจริง', 'Inspect Source Ledger'],
    partial: ['Partial', 'ข้อมูลพร้อมเพียงบางส่วน', 'แสดงสิ่งที่มี สิ่งที่ขาด และสิ่งที่ยังทำได้อย่างปลอดภัย', 'Review missing evidence'],
    stale: ['Stale', 'ข้อมูลเก่ากว่าขอบเขตที่ยอมรับ', 'เก็บ last known result พร้อมวันที่และห้ามอ้างว่า current', 'Check for update'],
    offline: ['Offline', 'เชื่อมต่อแหล่งข้อมูลไม่ได้', 'วัตถุและผลล่าสุดยังอยู่ แต่สถานะใหม่ยังยืนยันไม่ได้', 'Use last known state'],
    error: ['Error', 'การตรวจแหล่งข้อมูลล้มเหลว', 'เก็บ input และ object ไว้ พร้อม retry หรือทางเลือกที่ปลอดภัย', 'Retry'],
    restricted: ['Restricted', 'ไม่มีสิทธิ์ดูแหล่งข้อมูลนี้', 'แสดงขอบเขตสิทธิ์และให้กลับไปใช้ข้อมูลสาธารณะที่ปลอดภัย', 'Use public source'],
    retrying: ['Retrying', 'กำลังลองใหม่', 'ป้องกันการยิงซ้ำและรักษา object/version เดิม', 'Cancel retry'],
    success: ['Success', 'ตรวจแหล่งข้อมูลสำเร็จ', 'receipt ต้องมาจาก authoritative state ไม่ใช่ timer หรือ toast', 'View receipt']
  };

  const chartData = {
    rank: { title: 'Which option ranks first? · score points · Q2 2026', rows: [['Area A', 78], ['Area B', 62], ['Area C', 41], ['Area D', 0], ['Area E', null]] },
    trend: { title: 'How did the value change? · index · Jan–Jun 2026', rows: [['Jan', 34], ['Feb', 41], ['Mar', 39], ['Apr', 53], ['May', 49], ['Jun', 64]] },
    composition: { title: 'How is the whole composed? · percent · Q2 2026', rows: [['Resident', 48], ['Visitor', 32], ['Commuter', 20]] },
    target: { title: 'Are we on target? · completed reviews · Q2 2026', rows: [['Actual', 72], ['Target', 80]] },
    uncertainty: { title: 'How uncertain is it? · estimated index ± interval · Q2 2026', rows: [['Option A', 58, 49, 67], ['Option B', 53, 47, 59], ['Option C', 42, 31, 54]] }
  };

  function locale() { return root.dataset.locale === 'en' ? 'en' : 'th'; }

  function announce(message) {
    clearTimeout(statusTimer);
    globalStatus.textContent = message;
    globalStatus.classList.add('is-visible');
    statusTimer = setTimeout(() => globalStatus.classList.remove('is-visible'), 2600);
  }

  function replaceParams(changes, push = false) {
    const url = new URL(location.href);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    history[push ? 'pushState' : 'replaceState']({}, '', url);
  }

  function applyLocale(nextLocale, persist = false) {
    const next = nextLocale === 'en' ? 'en' : 'th';
    root.dataset.locale = next;
    root.lang = next;
    document.querySelectorAll('[data-l10n-th][data-l10n-en]').forEach(node => {
      node.textContent = node.dataset[next === 'en' ? 'l10nEn' : 'l10nTh'];
    });
    document.querySelectorAll('[data-l10n-aria-th][data-l10n-aria-en]').forEach(node => {
      node.setAttribute('aria-label', node.dataset[next === 'en' ? 'l10nAriaEn' : 'l10nAriaTh']);
    });
    document.querySelectorAll('[data-l10n-placeholder-th][data-l10n-placeholder-en]').forEach(node => {
      node.placeholder = node.dataset[next === 'en' ? 'l10nPlaceholderEn' : 'l10nPlaceholderTh'];
    });
    document.querySelectorAll('option[data-th][data-en]').forEach(option => { option.textContent = option.dataset[next]; });
    document.querySelectorAll('[data-locale-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.localeChoice === next)));
    if (persist) {
      try { localStorage.setItem('landometer-locale', next); } catch (_) {}
      replaceParams({ lang: next });
    }
    updateRole();
    updateHandoff();
    updateProof();
    updateProduct();
    updateStateCard();
    renderSearch(document.getElementById('reference-search').value);
    root.classList.add('i18n-ready');
  }

  function resolveTheme(preference) {
    return preference === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preference;
  }

  function applyTheme(preference, persist = false) {
    const pref = ['system', 'light', 'dark'].includes(preference) ? preference : 'system';
    const resolved = resolveTheme(pref);
    root.dataset.themePreference = pref;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
    document.querySelector('meta[name="theme-color"]').content = resolved === 'dark' ? '#11191D' : '#F6F7F3';
    document.querySelectorAll('[data-theme-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === pref)));
    if (persist) {
      try {
        if (pref === 'system') localStorage.removeItem('landometer-theme');
        else localStorage.setItem('landometer-theme', pref);
      } catch (_) {}
    }
    if (scaleRegistry && currentSpecimen === 'scales') renderScale();
  }

  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  systemTheme.addEventListener?.('change', () => {
    if (root.dataset.themePreference === 'system') applyTheme('system');
  });

  function setMode(mode, push = true) {
    currentMode = validModes.includes(mode) ? mode : 'start';
    root.dataset.mode = currentMode;
    document.querySelectorAll('[data-mode-panel]').forEach(panel => {
      const active = panel.dataset.modePanel === currentMode;
      panel.toggleAttribute('inert', !active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    document.querySelectorAll('[data-route-mode]').forEach(control => {
      if (control.closest('.mode-menu')) control.setAttribute('aria-current', control.dataset.routeMode === currentMode ? 'page' : 'false');
    });
    const label = document.getElementById('current-mode-label');
    const names = locale() === 'en' ? { start: 'Start', reference: 'Reference', lab: 'Lab' } : { start: 'เริ่มต้น', reference: 'คู่มืออ้างอิง', lab: 'ห้องทดลอง' };
    label.textContent = names[currentMode];
    replaceParams({ mode: currentMode === 'start' ? null : currentMode }, push);
    document.title = currentMode === 'reference' ? 'Reference · Landometer Design System v0.8.6' : currentMode === 'lab' ? 'Specimen Lab · Landometer Design System v0.8.6' : 'Landometer Design System v0.8.6 — Living Reference';
    if (currentMode === 'lab') setSpecimen(currentSpecimen, false);
    const target = document.getElementById(`${currentMode}-mode`);
    if (push) target?.scrollIntoView({ block: 'start' });
  }

  function setSpecimen(specimen, push = true) {
    currentSpecimen = specimenOrder.includes(specimen) ? specimen : 'proofs';
    document.querySelectorAll('[data-lab-specimen]').forEach(panel => {
      const active = panel.dataset.labSpecimen === currentSpecimen;
      panel.classList.toggle('is-active', active);
      panel.toggleAttribute('inert', !active);
      panel.setAttribute('aria-hidden', String(!active));
    });
    document.getElementById('specimen-select').value = currentSpecimen;
    document.getElementById('specimen-position').textContent = `${specimenOrder.indexOf(currentSpecimen) + 1} / ${specimenOrder.length}`;
    replaceParams({ mode: 'lab', specimen: currentSpecimen, proof: currentSpecimen === 'proofs' ? currentProof : null }, push);
    if (currentSpecimen === 'motion') prepareMotionEntrance();
    if (currentSpecimen === 'scales') renderScale();
    if (push) document.querySelector(`[data-lab-specimen="${currentSpecimen}"]`)?.scrollIntoView({ block: 'start' });
  }

  document.querySelectorAll('[data-route-mode]').forEach(control => {
    control.addEventListener('click', () => {
      if (control.dataset.specimenTarget) currentSpecimen = control.dataset.specimenTarget;
      setMode(control.dataset.routeMode, true);
      if (control.dataset.specimenTarget) setSpecimen(control.dataset.specimenTarget, true);
      document.getElementById('site-menu')?.close();
    });
  });

  const menu = document.getElementById('site-menu');
  document.getElementById('open-menu').addEventListener('click', () => menu.showModal());
  document.getElementById('close-menu').addEventListener('click', () => menu.close());
  menu.addEventListener('click', event => { if (event.target === menu) menu.close(); });

  document.querySelectorAll('[data-locale-choice]').forEach(button => button.addEventListener('click', () => applyLocale(button.dataset.localeChoice, true)));
  document.querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice, true)));
  document.getElementById('reset-preferences').addEventListener('click', () => {
    try { localStorage.removeItem('landometer-theme'); localStorage.removeItem('landometer-locale'); } catch (_) {}
    const fallbackLocale = (navigator.languages || [navigator.language || 'th']).some(v => String(v).toLowerCase().startsWith('en')) ? 'en' : 'th';
    replaceParams({ lang: null });
    applyTheme('system', true);
    applyLocale(fallbackLocale, false);
    announce(locale() === 'en' ? 'Language and theme reset' : 'ล้างค่าภาษาและธีมแล้ว');
  });

  function updateRole() {
    const data = roleData[currentRole];
    if (!data) return;
    document.getElementById('role-select').value = currentRole;
    document.getElementById('role-job-label').textContent = data.job;
    document.getElementById('role-title').textContent = locale() === 'en' ? data.titleEn : data.titleTh;
    document.getElementById('role-outcome').textContent = locale() === 'en' ? data.outcomeEn : data.outcomeTh;
    const proof = document.getElementById('role-proof-card');
    proof.classList.toggle('baseline-view', currentRoleView === 'baseline');
    proof.classList.toggle('assisted-view', currentRoleView === 'assisted');
    document.querySelectorAll('[data-role-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.roleView === currentRoleView)));
    document.getElementById('active-takeaway').textContent = data.recipe;
  }

  document.getElementById('role-select').addEventListener('change', event => {
    currentRole = event.target.value;
    replaceParams({ role: currentRole }, true);
    updateRole();
  });
  document.querySelectorAll('[data-role-view]').forEach(button => button.addEventListener('click', () => {
    currentRoleView = button.dataset.roleView;
    replaceParams({ view: currentRoleView === 'assisted' ? null : currentRoleView });
    updateRole();
  }));

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    }
  }

  document.getElementById('copy-role-recipe').addEventListener('click', async () => {
    const ok = await copyText(roleData[currentRole].recipe);
    const status = document.getElementById('role-copy-status');
    status.textContent = ok ? (locale() === 'en' ? 'Recipe copied.' : 'คัดลอกสูตรแล้ว') : (locale() === 'en' ? 'Copy failed. Select the recipe above.' : 'คัดลอกไม่สำเร็จ กรุณาเลือกข้อความด้านบน');
  });

  function setupTablist(selector, callback) {
    const tabs = [...document.querySelectorAll(selector)];
    tabs.forEach(tab => {
      tab.addEventListener('click', () => callback(tab));
      tab.addEventListener('keydown', event => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const current = tabs.indexOf(tab);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : event.key === 'ArrowRight' ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
        tabs[next].focus();
        callback(tabs[next]);
      });
    });
  }

  function updateHandoff() {
    const data = handoffData[currentHandoff];
    document.getElementById('handoff-role').textContent = data.role;
    document.getElementById('handoff-headline').textContent = locale() === 'en' ? data.en : data.th;
    document.getElementById('handoff-copy').textContent = locale() === 'en' ? data.copyEn : data.copyTh;
    document.querySelectorAll('[data-handoff]').forEach(tab => {
      const selected = tab.dataset.handoff === currentHandoff;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }
  setupTablist('[data-handoff]', tab => { currentHandoff = tab.dataset.handoff; updateHandoff(); });

  function searchableTitle(section) {
    return section.querySelector('h2')?.textContent.trim() || section.id;
  }
  function renderSearch(rawQuery = '') {
    const query = rawQuery.trim().toLocaleLowerCase(root.lang);
    const items = [...document.querySelectorAll('[data-search-item]')];
    const matches = items.filter(item => {
      const haystack = `${searchableTitle(item)} ${item.dataset.searchKeywords || ''} ${item.textContent}`.toLocaleLowerCase(root.lang);
      return !query || haystack.includes(query);
    }).slice(0, query ? 12 : 0);
    const results = document.getElementById('search-results');
    results.replaceChildren();
    matches.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = searchableTitle(item);
      button.addEventListener('click', () => {
        item.scrollIntoView({ block: 'start' });
        replaceParams({ mode: 'reference', section: item.id, q: query || null });
      });
      results.append(button);
    });
    const count = document.getElementById('search-count');
    count.textContent = query ? (locale() === 'en' ? `${matches.length} matching sections` : `พบ ${matches.length} section`) : (locale() === 'en' ? 'Type to search rules, tokens, patterns, products, and fixtures.' : 'พิมพ์เพื่อค้นกฎ token pattern product และ fixture');
  }
  const searchInput = document.getElementById('reference-search');
  searchInput.value = params.get('q') || '';
  searchInput.addEventListener('input', () => { renderSearch(searchInput.value); replaceParams({ q: searchInput.value || null }); });

  document.querySelectorAll('.copy-link').forEach(button => button.addEventListener('click', async () => {
    const url = new URL(location.href);
    url.searchParams.set('mode', 'reference');
    url.searchParams.set('section', button.dataset.copyLink);
    url.hash = button.dataset.copyLink;
    const ok = await copyText(url.toString());
    announce(ok ? (locale() === 'en' ? 'Deep link copied' : 'คัดลอก deep link แล้ว') : (locale() === 'en' ? 'Copy failed' : 'คัดลอกไม่สำเร็จ'));
  }));
  document.querySelectorAll('[data-copy-value]').forEach(button => button.addEventListener('click', async () => {
    const ok = await copyText(button.dataset.copyValue);
    announce(ok ? `${button.dataset.copyValue} ${locale() === 'en' ? 'copied' : 'คัดลอกแล้ว'}` : (locale() === 'en' ? 'Copy failed' : 'คัดลอกไม่สำเร็จ'));
  }));

  function buildCardCapabilities() {
    return Object.fromEntries([...document.querySelectorAll('input[name="capability"]')].map(input => [input.value, input.checked]));
  }

  function validateBuildCard() {
    const errors = [];
    const name = document.getElementById('bc-name').value.trim();
    const pageKind = document.getElementById('bc-page-kind').value.trim();
    const job = document.getElementById('bc-job').value.trim();
    const aha = document.getElementById('bc-aha').value.trim();
    const action = document.getElementById('bc-action').value.trim();
    const product = document.getElementById('bc-product').value;
    const profile = document.getElementById('bc-profile').value;
    const delivery = document.getElementById('bc-delivery').value;
    const caps = buildCardCapabilities();
    if (!name || !pageKind || !job || !aha || !action) errors.push(locale() === 'en' ? 'Complete name, page kind/source, one job, first AHA, and primary action.' : 'กรอกชื่อ, page kind/source, หนึ่งงาน, first AHA และ primary action ให้ครบ');
    const compatibility = {
      landometer: ['designsystem.adoption', 'brand.public', 'product.app', 'data.explainer', 'campaign.public', 'social.static', 'presentation'],
      citymeter: ['citymeter.dataset', 'product.app', 'data.explainer', 'campaign.public', 'social.static', 'presentation'],
      citywiki: ['citywiki.public', 'product.app', 'data.explainer', 'campaign.public', 'social.static', 'presentation'],
      citychat: ['citychat.app', 'data.explainer', 'campaign.public', 'social.static', 'presentation'],
      ijji: ['ijji.app', 'data.explainer', 'campaign.public', 'social.static', 'presentation']
    };
    if (!compatibility[product]?.includes(profile)) errors.push(`${product} × ${profile}: incompatible PRODUCT-01 pair.`);
    if ((caps.map || caps.dataVisualization) && !caps.analyticalEvidence) errors.push('map/dataVisualization requires analyticalEvidence: true.');
    if (caps.map && !caps.dataVisualization) errors.push('map requires dataVisualization: true for the spatial visualization branch.');
    if (caps.fullLivingReference && (profile !== 'designsystem.adoption' || !caps.search)) errors.push('fullLivingReference requires designsystem.adoption + search: true.');
    if (caps.coCreation && (!caps.persistence || !caps.externalSideEffect)) errors.push('coCreation requires persistence + externalSideEffect.');
    if (delivery === 'static_export') errors.push(locale() === 'en' ? 'Static export needs the full canvas, safe-area, format, fixed-theme, and destination record; use the full template.' : 'Static export ต้องกรอก canvas, safe area, format, fixed theme และ destination ใน template ฉบับเต็ม');
    return { errors, name, pageKind, job, aha, action, product, profile, delivery, caps };
  }

  function buildYaml(values) {
    const capLines = Object.entries(values.caps).map(([key, value]) => `    ${key}: ${value}`).join('\n');
    const visibility = values.delivery === 'internal_demo' ? 'internal' : 'public';
    return `landometerBuild:\n  dsVersion: 0.8.6\n  schemas:\n    buildCard: 0.8.6\n    manifest: pending_0.8.6_generation\n    tokens: 6\n  artifact:\n    name: "${values.name.replaceAll('"', '\\"')}"\n    product: ${values.product}\n    profile: ${values.profile}\n    pageKind: "${values.pageKind.replaceAll('"', '\\"')}"\n    delivery: ${values.delivery}\n    language: ${locale()}\n    additionalLanguages: [${locale() === 'en' ? 'th' : 'en'}]\n    outputType: webpage\n  publication:\n    evidenceStatus: provisional\n    visibility: ${visibility}\n    indexable: false\n    canonicalUrl: ""\n  experience:\n    oneJob: "${values.job.replaceAll('"', '\\"')}"\n    firstAha: "${values.aha.replaceAll('"', '\\"')}"\n    primaryAction: "${values.action.replaceAll('"', '\\"')}"\n    dominantObject: "REPLACE_WITH_OBJECT_ID_VERSION"\n    nextUsefulAction: "REPLACE_WITH_NEXT_ACTION_OR_CLEAN_COMPLETION"\n    cleanCompletion: "REPLACE_WITH_CLEAN_COMPLETION"\n  theme:\n    mode: interactive_auto\n    support: dual\n    default: system\n    visibleOverride: true\n  capabilities:\n${capLines}\n  network:\n    mode: reference_ready\n    action: none\n  qa:\n    evidencePath: "REQUIRED_BEFORE_RELEASE"\n    controlInventoryPath: "control-inventory.json"\n`;
  }

  document.getElementById('build-card-form').addEventListener('submit', event => {
    event.preventDefault();
    const values = validateBuildCard();
    const errorBox = document.getElementById('build-card-errors');
    errorBox.classList.toggle('has-errors', values.errors.length > 0);
    errorBox.textContent = values.errors.join(' · ');
    if (values.errors.length) {
      generatedBuildCard = '';
      document.getElementById('build-card-output').textContent = locale() === 'en' ? '# Resolve the errors above before generating UI.' : '# แก้ข้อผิดพลาดด้านบนก่อนเริ่มสร้าง UI';
      errorBox.focus?.();
      return;
    }
    generatedBuildCard = buildYaml(values);
    document.getElementById('build-card-output').textContent = generatedBuildCard;
    announce(locale() === 'en' ? 'Starter Build Card generated' : 'สร้าง starter Build Card แล้ว');
  });

  document.getElementById('download-build-card').addEventListener('click', () => {
    if (!generatedBuildCard) document.getElementById('build-card-form').requestSubmit();
    if (!generatedBuildCard) return;
    const url = URL.createObjectURL(new Blob([generatedBuildCard], { type: 'text/yaml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'landometer-build-card.yaml';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  document.getElementById('previous-specimen').addEventListener('click', () => setSpecimen(specimenOrder[(specimenOrder.indexOf(currentSpecimen) - 1 + specimenOrder.length) % specimenOrder.length]));
  document.getElementById('next-specimen').addEventListener('click', () => setSpecimen(specimenOrder[(specimenOrder.indexOf(currentSpecimen) + 1) % specimenOrder.length]));
  document.getElementById('specimen-select').addEventListener('change', event => setSpecimen(event.target.value));

  const proofSelect = document.getElementById('proof-select');
  proofData.forEach(proof => {
    const option = document.createElement('option');
    option.value = proof.id;
    option.textContent = proof.label;
    proofSelect.append(option);
  });
  if (!proofData.some(proof => proof.id === currentProof)) currentProof = proofData[0].id;

  function updateProof() {
    const proof = proofData.find(item => item.id === currentProof) || proofData[0];
    const text = locale() === 'en' ? proof.en : proof.th;
    proofSelect.value = proof.id;
    document.getElementById('proof-goal').textContent = text[0];
    document.getElementById('proof-failure').textContent = text[1];
    document.getElementById('proof-try').textContent = text[2];
    document.getElementById('proof-outcome').textContent = text[3];
    document.getElementById('proof-evidence').textContent = text[4];
    document.getElementById('proof-receipt').textContent = '';
    const baseline = document.getElementById('proof-baseline');
    baseline.disabled = !proof.baseline;
    if (!proof.baseline) currentProofView = 'assisted';
    baseline.setAttribute('aria-pressed', String(currentProofView === 'baseline'));
    document.getElementById('proof-assisted').setAttribute('aria-pressed', String(currentProofView === 'assisted'));
    document.getElementById('proof-card').dataset.view = currentProofView;
  }
  proofSelect.addEventListener('change', event => {
    currentProof = event.target.value;
    currentProofView = proofData.find(item => item.id === currentProof).baseline ? currentProofView : 'assisted';
    replaceParams({ mode: 'lab', specimen: 'proofs', proof: currentProof, proofView: currentProofView === 'baseline' ? 'baseline' : null });
    updateProof();
  });
  document.getElementById('proof-baseline').addEventListener('click', () => { currentProofView = 'baseline'; replaceParams({ proofView: 'baseline' }); updateProof(); });
  document.getElementById('proof-assisted').addEventListener('click', () => { currentProofView = 'assisted'; replaceParams({ proofView: null }); updateProof(); });
  document.getElementById('run-proof').addEventListener('click', () => {
    const receipt = currentProofView === 'baseline' ? (locale() === 'en' ? 'Baseline path completed with the same authoritative result; assistance absent.' : 'Baseline จบด้วย authoritative result เดิม แต่ไม่มีตัวช่วย') : (locale() === 'en' ? 'Assisted path completed locally; same object, data, consequence, and authoritative result.' : 'Assisted path ทำงานในเครื่องนี้ วัตถุ ข้อมูล ผลตามมา และ authoritative result ไม่เปลี่ยน');
    document.getElementById('proof-receipt').textContent = receipt;
  });
  document.getElementById('reset-proof').addEventListener('click', updateProof);

  document.querySelectorAll('.theme-pair button').forEach(button => button.addEventListener('click', () => { setMode('reference'); document.getElementById('ref-visual').scrollIntoView({ block: 'start' }); }));

  function updateStateCard() {
    const select = document.getElementById('state-select');
    const state = select.value;
    const [label, titleTh, messageTh, action] = stateData[state];
    const titleEn = {
      default: 'Place evidence ready to inspect', loading: 'Checking the source', empty: 'No current result', partial: 'Only part of the evidence is ready', stale: 'Evidence is older than the accepted boundary', offline: 'The source is unavailable offline', error: 'Source check failed', restricted: 'You cannot access this source', retrying: 'Trying again', success: 'Source check completed'
    }[state];
    const messageEn = {
      default: 'Change state to see copy, evidence, action, and recovery update together.', loading: 'The object and input remain visible; show a real stage instead of shimmer.', empty: 'This is not zero and must not support a real decision.', partial: 'Show what exists, what is missing, and what remains safe.', stale: 'Keep the last known result and date; never label it current.', offline: 'Keep the object and last result; new state cannot be confirmed.', error: 'Preserve input and object; provide retry or a safe alternative.', restricted: 'Explain the permission boundary and offer a safe public source.', retrying: 'Prevent duplicate execution and preserve the object/version.', success: 'The receipt must come from authoritative state, not a timer or toast.'
    }[state];
    const card = document.getElementById('state-demo-card');
    card.dataset.state = state;
    const badge = document.getElementById('state-demo-badge');
    badge.textContent = label;
    badge.className = `status-badge ${['error'].includes(state) ? 'danger' : ['success'].includes(state) ? 'success' : ['partial', 'stale', 'empty'].includes(state) ? 'warning' : 'info'}`;
    document.getElementById('state-demo-title').textContent = locale() === 'en' ? titleEn : titleTh;
    document.getElementById('state-demo-message').textContent = locale() === 'en' ? messageEn : messageTh;
    document.getElementById('state-demo-action').textContent = action;
    document.getElementById('state-demo-status').textContent = '';
  }
  document.getElementById('state-select').addEventListener('change', updateStateCard);
  document.getElementById('state-demo-action').addEventListener('click', () => {
    const state = document.getElementById('state-select').value;
    const output = document.getElementById('state-demo-status');
    if (state === 'error') {
      document.getElementById('state-select').value = 'retrying'; updateStateCard();
      output.textContent = locale() === 'en' ? 'Local retry started; duplicate action blocked.' : 'เริ่ม local retry และป้องกันการกดซ้ำแล้ว';
      setTimeout(() => { document.getElementById('state-select').value = 'partial'; updateStateCard(); document.getElementById('state-demo-status').textContent = locale() === 'en' ? 'Retry completed with partial evidence—not success.' : 'Retry จบที่ partial evidence ไม่ใช่ success'; }, 650);
    } else if (['default', 'empty', 'partial', 'stale'].includes(state)) {
      setMode('reference'); document.getElementById('ref-data').scrollIntoView({ block: 'start' });
    } else {
      output.textContent = locale() === 'en' ? 'Local fixture action completed; no external effect.' : 'action ของ fixture จบในเครื่องนี้ ไม่มี external effect';
    }
  });

  function renderChart() {
    const kind = document.getElementById('chart-select').value;
    const data = chartData[kind];
    const stage = document.getElementById('chart-stage');
    const table = document.getElementById('chart-table');
    stage.dataset.chartType = { rank: 'horizontal-bar', trend: 'line', composition: '100-percent-stacked-bar', target: 'bullet', uncertainty: 'interval' }[kind];
    stage.dataset.chartDecision = { rank: 'compare_rank', trend: 'change_over_time', composition: 'whole_composition', target: 'actual_vs_target', uncertainty: 'uncertainty' }[kind];
    stage.innerHTML = `<p class="chart-title">${data.title}</p>`;
    if (kind === 'rank') {
      const chart = document.createElement('div'); chart.className = 'bar-chart';
      data.rows.forEach(([label, value]) => {
        const row = document.createElement('div'); row.className = 'bar-row';
        row.innerHTML = `<span>${label}</span><span class="bar-track">${value === null ? '<span class="no-data" style="display:block;height:100%;padding:0" aria-label="No data"></span>' : `<span class="bar-fill" style="width:${value}%"></span>`}</span><span class="bar-value">${value === null ? 'No data' : value}</span>`;
        chart.append(row);
      });
      const axis = document.createElement('div'); axis.className = 'chart-axis'; axis.innerHTML = '<span>0</span><span>50</span><span>100 points</span>';
      stage.append(chart, axis);
    } else if (kind === 'trend') {
      const points = data.rows.map(([, value], i) => [70 + i * 95, 260 - value * 2.6]);
      stage.insertAdjacentHTML('beforeend', `<svg class="line-chart" viewBox="0 0 620 300" role="img" aria-label="Line chart of synthetic monthly index"><path class="grid" d="M55 40H595M55 140H595M55 240H595"/><path class="axis" d="M55 20V260H600"/><polyline class="series-line" points="${points.map(p => p.join(',')).join(' ')}"/>${points.map(([x,y],i)=>`<circle class="point" cx="${x}" cy="${y}" r="5"/><text x="${x-12}" y="282">${data.rows[i][0]}</text><text x="${x-8}" y="${y-12}">${data.rows[i][1]}</text>`).join('')}</svg>`);
    } else if (kind === 'composition') {
      stage.insertAdjacentHTML('beforeend', `<div class="stacked-bar" role="img" aria-label="Resident 48 percent, Visitor 32 percent, Commuter 20 percent">${data.rows.map(([label,value],i)=>`<span class="stack-${['a','b','c'][i]}" style="width:${value}%">${label} ${value}%</span>`).join('')}</div><p>Use a 100% stacked bar for flat composition. Use a treemap only for a real hierarchy with drill/back.</p>`);
    } else if (kind === 'target') {
      stage.insertAdjacentHTML('beforeend', `<div class="bullet"><div class="bullet-track" role="img" aria-label="Actual 72 reviews, target 80"><span class="bullet-value" style="width:72%"></span><span class="bullet-target" style="left:80%"></span></div><p><strong>72</strong> actual · target marker <strong>80</strong> · scale 0–100 reviews</p></div>`);
    } else {
      stage.insertAdjacentHTML('beforeend', `<svg class="interval-chart" viewBox="0 0 620 300" role="img" aria-label="Interval estimates for three synthetic options"><path class="grid" d="M130 55H590M130 145H590M130 235H590"/><path class="axis" d="M130 270H590"/>${data.rows.map(([label,mid,low,high],i)=>{const y=65+i*90;const x=v=>130+v*5.4;return `<text x="20" y="${y+5}">${label}</text><line x1="${x(low)}" y1="${y}" x2="${x(high)}" y2="${y}" stroke="var(--interaction-accent)" stroke-width="6"/><line x1="${x(low)}" y1="${y-10}" x2="${x(low)}" y2="${y+10}" stroke="var(--interaction-accent)"/><line x1="${x(high)}" y1="${y-10}" x2="${x(high)}" y2="${y+10}" stroke="var(--interaction-accent)"/><circle cx="${x(mid)}" cy="${y}" r="7" fill="var(--surface-raised)" stroke="var(--interaction-accent)" stroke-width="4"/><text x="${x(mid)-10}" y="${y-18}">${mid}</text>`}).join('')}</svg>`);
    }
    const headers = kind === 'uncertainty' ? ['Option', 'Estimate', 'Low', 'High'] : ['Category', 'Value'];
    table.innerHTML = `<table><caption>${data.title} · accessible alternative</caption><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${data.rows.map(row=>`<tr>${row.map(value=>`<td>${value === null ? 'No data' : value}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  document.getElementById('chart-select').addEventListener('change', renderChart);

  function contrastClass(hex) {
    const rgb = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);
    const luminance = .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
    return luminance < .32 ? 'dark-ink' : '';
  }
  function renderScale() {
    if (!scaleRegistry) return;
    const id = document.getElementById('scale-select').value;
    const theme = document.getElementById('scale-theme').value;
    const count = document.getElementById('scale-classes').value;
    const record = scaleRegistry.scales.find(item => item.scaleId === id && item.theme === theme);
    if (!record) return;
    const labels = record.kind === 'diverging' ? ['Side A', 'Neutral', 'Side B'] : ['Low', 'Mid', 'High'];
    document.getElementById('scale-anchors').innerHTML = record.anchors.map((hex,index)=>`<div class="scale-anchor ${contrastClass(hex)}" style="background:${hex}"><strong>${labels[index]}</strong><span>${hex}</span></div>`).join('');
    document.getElementById('scale-lut').innerHTML = record.lut.map((hex,index)=>`<span style="background:${hex}" title="${index}: ${hex}"></span>`).join('');
    const classes = record.classes[count];
    const classRow = document.getElementById('scale-class-row');
    classRow.style.gridTemplateColumns = `repeat(${classes.length},1fr)`;
    classRow.innerHTML = classes.map((hex,index)=>`<span class="${contrastClass(hex)}" style="background:${hex}">${index+1}<br>${hex}</span>`).join('');
    document.getElementById('scale-version').textContent = `${id} · ${theme} · ${count} classes · scaleVersion ${record.scaleVersion}`;
  }
  ['scale-select','scale-theme','scale-classes'].forEach(id => document.getElementById(id).addEventListener('change', renderScale));
  fetch('assets/data/scales.json').then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }).then(data => { scaleRegistry = data; renderScale(); }).catch(() => {
    document.getElementById('scale-version').textContent = locale() === 'en' ? 'Scale registry failed to load; use the downloadable JSON as the safe fallback.' : 'โหลด scale registry ไม่สำเร็จ ใช้ JSON ที่ดาวน์โหลดเป็น fallback';
  });

  const mapData = {
    A: ['Area A', 'Reference class: low', 'Low'], B: ['Area B', 'Reference class: high', 'High'], C: ['Area C', 'No data—not zero', 'No data']
  };
  function selectMapArea(area) {
    document.querySelectorAll('.map-area').forEach(node => node.classList.toggle('is-selected', node.dataset.area === area));
    document.getElementById('map-area-title').textContent = mapData[area][0];
    document.getElementById('map-area-status').textContent = mapData[area][1];
    document.querySelectorAll('[data-map-row]').forEach(row => { row.cells[2].textContent = row.dataset.mapRow === area ? 'Selected' : '—'; });
  }
  document.querySelectorAll('.map-area').forEach(area => {
    area.addEventListener('click', () => selectMapArea(area.dataset.area));
    area.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectMapArea(area.dataset.area); } });
  });

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionObserver;
  function motionLog(message) {
    const item = document.createElement('li');
    item.textContent = `${Math.round(performance.now())} ms · ${message}`;
    document.getElementById('motion-log').append(item);
  }
  function showMotionFinal(label = 'final state shown') {
    const stage = document.getElementById('motion-stage');
    stage.classList.remove('is-pending'); stage.classList.add('is-running');
    motionLog(label);
  }
  function prepareMotionEntrance() {
    const badge = document.getElementById('motion-preference');
    badge.textContent = reduceMotion.matches ? 'Reduced motion · final state' : 'Motion enabled · 60ms stagger';
    const stage = document.getElementById('motion-stage');
    document.getElementById('motion-log').replaceChildren();
    if (reduceMotion.matches || !('IntersectionObserver' in window)) { showMotionFinal(reduceMotion.matches ? 'reduced motion: complete meaning shown immediately' : 'observer unavailable: safe final state'); return; }
    stage.classList.remove('is-running'); stage.classList.add('is-pending');
    motionObserver?.disconnect();
    motionObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        requestAnimationFrame(() => { stage.classList.remove('is-pending'); stage.classList.add('is-running'); motionLog('object → state → meaning → action entered once'); });
        motionObserver.disconnect();
      }
    }, { threshold: .12, rootMargin: '0px 0px -10% 0px' });
    motionObserver.observe(stage);
  }
  document.getElementById('replay-motion').addEventListener('click', prepareMotionEntrance);
  document.getElementById('pause-motion').addEventListener('click', () => { motionObserver?.disconnect(); showMotionFinal('pause/show final'); });
  reduceMotion.addEventListener?.('change', () => { if (currentSpecimen === 'motion') prepareMotionEntrance(); });

  function updateProduct() {
    const data = productData[currentProduct];
    document.getElementById('product-character').textContent = data[0];
    document.getElementById('product-title').textContent = locale() === 'en' ? data[3] : data[1];
    document.getElementById('product-copy').textContent = locale() === 'en' ? data[4] : data[2];
    const panel = document.getElementById('product-panel');
    panel.dataset.product = currentProduct;
    document.querySelectorAll('[data-product]').forEach(tab => { const selected = tab.dataset.product === currentProduct; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
  }
  setupTablist('[data-product]', tab => { currentProduct = tab.dataset.product; updateProduct(); });

  document.getElementById('prepare-preview').addEventListener('click', () => {
    const recipient = document.getElementById('recipient-role').value;
    const preview = document.getElementById('recipient-preview');
    preview.innerHTML = `<h3>${locale() === 'en' ? 'Recipient preview' : 'Preview ฝั่งผู้รับ'}</h3><p><strong>${recipient}</strong></p><p>demo.citymeter.place-insight.v1</p><p>${locale() === 'en' ? 'No current result · source not connected · do not use for a real decision.' : 'ยังไม่มีผลปัจจุบัน · แหล่งข้อมูลยังไม่เชื่อมต่อ · ห้ามใช้ตัดสินใจจริง'}</p><p class="status-badge success">${locale() === 'en' ? 'Local preview prepared' : 'เตรียม local preview แล้ว'}</p>`;
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      const checks = [
        ['.type-display-en strong', 'Arvo', '700'], ['.type-display-th strong', 'IBM Plex Sans Thai Looped', '700'],
        ['.type-body p', 'Bai Jamjuree', '400'], ['.type-number strong', 'JetBrains Mono', '700']
      ];
      const failures = checks.filter(([selector, family, weight]) => {
        const style = getComputedStyle(document.querySelector(selector));
        return !style.fontFamily.includes(family) || style.fontWeight !== weight;
      });
      document.getElementById('font-status').textContent = failures.length ? `Font role mismatch: ${failures.map(item => item[0]).join(', ')}` : 'Font roles loaded: Arvo 700 · IBM Plex Sans Thai Looped 700 · Bai Jamjuree 400/600 · JetBrains Mono 500/700.';
    });
  }

  window.addEventListener('popstate', () => {
    const next = new URL(location.href).searchParams;
    setMode(next.get('mode') || 'start', false);
    if (next.get('specimen')) setSpecimen(next.get('specimen'), false);
  });

  applyTheme(root.dataset.themePreference || 'system');
  applyLocale(root.dataset.locale || 'th');
  setMode(currentMode, false);
  updateRole();
  updateHandoff();
  updateProof();
  updateStateCard();
  updateProduct();
  renderChart();
  selectMapArea('A');
  renderSearch(searchInput.value);
  setSpecimen(currentSpecimen, false);

  const initialSection = params.get('section');
  if (currentMode === 'reference' && initialSection) requestAnimationFrame(() => document.getElementById(initialSection)?.scrollIntoView({ block: 'start' }));
})();
