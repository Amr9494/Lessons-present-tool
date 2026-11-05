/* Lectures Presenter — Video maker.
   Turns slides (from a lesson, or any pictures) into a video with motion (zoom / pan) and transitions
   (dip to black, cross-fade, slide, wipe, circle…). Everything is drawn on a canvas in the browser and
   recorded with MediaRecorder — nothing is uploaded. "Random" picks nice effects automatically. */
(() => {
'use strict';
const L = window.LPT; if (!L) return;
const { t, h, T, toast, busy, done, saveBlob, go } = L;

const STR = {
  en: {
    vm_title: 'Video maker', vm_desc: 'Turn slides or pictures into a video with zooms and smooth transitions. Choose the effects yourself, or press Random.',
    vm_fromLesson: 'Make video', vm_fromLessonHint: 'Turn this lesson’s slides into a video with transitions',
    vm_addPics: 'Add pictures', vm_clear: 'Clear', vm_empty: 'Add pictures here, or open a lesson and press “🎞 Make video”.',
    vm_random: 'Random', vm_randomHint: 'Pick nice motions and transitions for every slide automatically',
    vm_all: 'For all slides', vm_apply: 'Apply', vm_dur: 'Seconds', vm_motion: 'Motion', vm_trans: 'Transition to next', vm_tdur: 'Transition length',
    vm_caption: 'Caption (optional)', vm_size: 'Video size', vm_bg: 'Background', vm_black: 'Black', vm_white: 'White',
    vm_fadeIn: 'Fade in at the start and out at the end', vm_music: 'Background music (optional)', vm_volume: 'Music volume',
    vm_play: 'Play preview', vm_pause: 'Pause', vm_export: 'Make the video', vm_exporting: (a, b) => `Recording the video… ${a} / ${b}`,
    vm_exportNote: 'The video is recorded in real time — keep this tab open and in front until it finishes.', vm_ready: 'Video ready — downloaded',
    vm_unsupported: 'This browser cannot record video. Please use Chrome, Edge or Firefox on a computer.', vm_total: s => `Total length: ${s}`,
    vm_loading: (i, n) => `Preparing slide ${i} of ${n}…`, vm_stop: 'Stop',
    m_none: 'Still', m_zoomIn: 'Zoom in', m_zoomOut: 'Zoom out', m_panLeft: 'Pan left', m_panRight: 'Pan right', m_panUp: 'Pan up', m_panDown: 'Pan down', m_kenBurns: 'Ken Burns',
    x_cut: 'Cut', x_dipBlack: 'Dip to black', x_dipWhite: 'Dip to white', x_fade: 'Cross-fade', x_slideLeft: 'Slide left', x_slideRight: 'Slide right', x_slideUp: 'Slide up',
    x_wipe: 'Wipe', x_circle: 'Circle', x_zoom: 'Zoom through', x_blinds: 'Blinds'
  },
  ar: {
    vm_title: 'صانع الفيديو', vm_desc: 'حوّل الشرائح أو الصور إلى فيديو بتكبير وانتقالات ناعمة. اختر المؤثرات بنفسك أو اضغط «عشوائي».',
    vm_fromLesson: 'اصنع فيديو', vm_fromLessonHint: 'حوّل شرائح هذا الدرس إلى فيديو بانتقالات',
    vm_addPics: 'إضافة صور', vm_clear: 'مسح', vm_empty: 'أضف صورًا هنا، أو افتح درسًا واضغط «🎞 اصنع فيديو».',
    vm_random: 'عشوائي', vm_randomHint: 'اختيار حركات وانتقالات جميلة لكل شريحة تلقائيًا',
    vm_all: 'لكل الشرائح', vm_apply: 'تطبيق', vm_dur: 'ثوانٍ', vm_motion: 'الحركة', vm_trans: 'الانتقال إلى التالية', vm_tdur: 'مدة الانتقال',
    vm_caption: 'تعليق (اختياري)', vm_size: 'حجم الفيديو', vm_bg: 'الخلفية', vm_black: 'أسود', vm_white: 'أبيض',
    vm_fadeIn: 'ظهور تدريجي في البداية واختفاء في النهاية', vm_music: 'موسيقى/صوت خلفية (اختياري)', vm_volume: 'مستوى الصوت',
    vm_play: 'تشغيل المعاينة', vm_pause: 'إيقاف مؤقت', vm_export: 'اصنع الفيديو', vm_exporting: (a, b) => `جارٍ تسجيل الفيديو… ${a} / ${b}`,
    vm_exportNote: 'يُسجَّل الفيديو في الوقت الحقيقي — أبقِ هذا التبويب مفتوحًا وفي المقدمة حتى ينتهي.', vm_ready: 'الفيديو جاهز — تم التنزيل',
    vm_unsupported: 'هذا المتصفح لا يستطيع تسجيل الفيديو. استخدم Chrome أو Edge أو Firefox على الحاسوب.', vm_total: s => `المدة الكلية: ${s}`,
    vm_loading: (i, n) => `تجهيز الشريحة ${i} من ${n}…`, vm_stop: 'إيقاف',
    m_none: 'ثابت', m_zoomIn: 'تكبير', m_zoomOut: 'تصغير', m_panLeft: 'تحريك لليسار', m_panRight: 'تحريك لليمين', m_panUp: 'تحريك للأعلى', m_panDown: 'تحريك للأسفل', m_kenBurns: 'كين بيرنز',
    x_cut: 'قطع مباشر', x_dipBlack: 'تلاشٍ إلى الأسود', x_dipWhite: 'تلاشٍ إلى الأبيض', x_fade: 'مزج', x_slideLeft: 'انزلاق لليسار', x_slideRight: 'انزلاق لليمين', x_slideUp: 'انزلاق للأعلى',
    x_wipe: 'مسح', x_circle: 'دائرة', x_zoom: 'تكبير عبور', x_blinds: 'ستائر'
  },
  fi: {
    vm_title: 'Videontekijä', vm_desc: 'Tee dioista tai kuvista video zoomauksilla ja pehmeillä siirtymillä. Valitse efektit itse tai paina Satunnainen.',
    vm_fromLesson: 'Tee video', vm_fromLessonHint: 'Tee tämän oppitunnin dioista video siirtymineen',
    vm_addPics: 'Lisää kuvia', vm_clear: 'Tyhjennä', vm_empty: 'Lisää kuvia tähän tai avaa oppitunti ja paina ”🎞 Tee video”.',
    vm_random: 'Satunnainen', vm_randomHint: 'Valitse kauniit liikkeet ja siirtymät jokaiselle dialle automaattisesti',
    vm_all: 'Kaikille dioille', vm_apply: 'Käytä', vm_dur: 'Sekuntia', vm_motion: 'Liike', vm_trans: 'Siirtymä seuraavaan', vm_tdur: 'Siirtymän pituus',
    vm_caption: 'Teksti (valinnainen)', vm_size: 'Videon koko', vm_bg: 'Tausta', vm_black: 'Musta', vm_white: 'Valkoinen',
    vm_fadeIn: 'Häivytys alussa ja lopussa', vm_music: 'Taustamusiikki (valinnainen)', vm_volume: 'Musiikin voimakkuus',
    vm_play: 'Toista esikatselu', vm_pause: 'Tauko', vm_export: 'Tee video', vm_exporting: (a, b) => `Tallennetaan videota… ${a} / ${b}`,
    vm_exportNote: 'Video tallennetaan reaaliajassa — pidä tämä välilehti auki ja edessä, kunnes se valmistuu.', vm_ready: 'Video valmis — ladattu',
    vm_unsupported: 'Tämä selain ei voi tallentaa videota. Käytä Chromea, Edgeä tai Firefoxia tietokoneella.', vm_total: s => `Kokonaispituus: ${s}`,
    vm_loading: (i, n) => `Valmistellaan diaa ${i}/${n}…`, vm_stop: 'Pysäytä',
    m_none: 'Paikallaan', m_zoomIn: 'Zoomaa sisään', m_zoomOut: 'Zoomaa ulos', m_panLeft: 'Panoroi vasemmalle', m_panRight: 'Panoroi oikealle', m_panUp: 'Panoroi ylös', m_panDown: 'Panoroi alas', m_kenBurns: 'Ken Burns',
    x_cut: 'Leikkaus', x_dipBlack: 'Häivytys mustaan', x_dipWhite: 'Häivytys valkoiseen', x_fade: 'Ristihäivytys', x_slideLeft: 'Liuku vasemmalle', x_slideRight: 'Liuku oikealle', x_slideUp: 'Liuku ylös',
    x_wipe: 'Pyyhkäisy', x_circle: 'Ympyrä', x_zoom: 'Zoomaus läpi', x_blinds: 'Sälekaihtimet'
  }
};
for (const l of Object.keys(STR)) Object.assign(T[l], STR[l]);

const MOTIONS = ['none', 'zoomIn', 'zoomOut', 'panLeft', 'panRight', 'panUp', 'panDown', 'kenBurns'];
const TRANS = ['cut', 'dipBlack', 'dipWhite', 'fade', 'slideLeft', 'slideRight', 'slideUp', 'wipe', 'circle', 'zoom', 'blinds'];
const NICE_MOTIONS = ['zoomIn', 'zoomOut', 'panLeft', 'panRight', 'kenBurns', 'zoomIn', 'kenBurns'];
const NICE_TRANS = ['dipBlack', 'fade', 'fade', 'dipBlack', 'slideLeft', 'wipe', 'circle', 'zoom', 'dipWhite', 'blinds'];
const pickR = a => a[Math.floor(Math.random() * a.length)];
const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const V = { slides: [], size: 720, bg: '#000000', fades: true, music: null, musicName: '', volume: 0.6, all: { dur: 4, motion: 'zoomIn', trans: 'dipBlack', tdur: 0.8 }, title: 'video' };
let seq = 0;
const newSlide = (img, name) => ({ id: ++seq, img, name: name || '', dur: V.all.dur, motion: V.all.motion, trans: V.all.trans, tdur: V.all.tdur, caption: '', fx: .3 + Math.random() * .4, fy: .3 + Math.random() * .4 });

/* ── timeline ── */
function timeline() {
  const S = V.slides, tl = []; let t0 = 0;
  S.forEach((s, i) => {
    const tdPrev = i > 0 && S[i - 1].trans !== 'cut' ? Math.min(S[i - 1].tdur, S[i - 1].dur * .8, s.dur * .8) : 0;
    tl.push({ s, start: t0, end: t0 + s.dur, tdPrev });
    t0 += s.dur;
  });
  return { tl, total: t0 };
}
// motion progress of slide j at time T (starts when its incoming transition starts)
const mp = (e, T) => clamp((T - (e.start - e.tdPrev)) / (e.s.dur + e.tdPrev), 0, 1);

function drawImage(ctx, s, p, W, H) {
  const img = s.img, iw = img.width, ih = img.height;
  const base = Math.min(W / iw, H / ih);
  const e = ease(p);
  let sc = 1, dx = 0, dy = 0;
  switch (s.motion) {
    case 'zoomIn': sc = 1 + .14 * e; break;
    case 'zoomOut': sc = 1.14 - .14 * e; break;
    case 'panLeft': sc = 1.14; dx = (.5 - e) * .12 * W; break;
    case 'panRight': sc = 1.14; dx = (e - .5) * .12 * W; break;
    case 'panUp': sc = 1.14; dy = (.5 - e) * .12 * H; break;
    case 'panDown': sc = 1.14; dy = (e - .5) * .12 * H; break;
    case 'kenBurns': sc = 1.04 + .18 * e; dx = (.5 - s.fx) * W * .22 * e; dy = (.5 - s.fy) * H * .22 * e; break;
  }
  const w = iw * base * sc, hh = ih * base * sc;
  ctx.drawImage(img, (W - w) / 2 + dx, (H - hh) / 2 + dy, w, hh);
  if (s.caption) {
    const fs = Math.round(H * .055);
    ctx.font = `800 ${fs}px "Baloo Bhaijaan 2","Nunito",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.direction = /[؀-ۿ]/.test(s.caption) ? 'rtl' : 'ltr';
    const tw = Math.min(W * .9, ctx.measureText(s.caption).width + fs * 1.4);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect((W - tw) / 2, H - fs * 2.3, tw, fs * 1.6);
    ctx.fillStyle = '#fff'; ctx.fillText(s.caption, W / 2, H - fs * 1.5, W * .88);
  }
}
function layer(ctx, W, H, fn) { ctx.save(); ctx.fillStyle = V.bg; ctx.fillRect(0, 0, W, H); fn(); ctx.restore(); }
function drawFrame(ctx, T, W, H) {
  const { tl, total } = timeline();
  ctx.save(); ctx.fillStyle = V.bg; ctx.fillRect(0, 0, W, H);
  if (!tl.length) { ctx.restore(); return; }
  T = clamp(T, 0, total - 1e-4);
  let i = tl.findIndex(e => T < e.end); if (i < 0) i = tl.length - 1;
  const A = tl[i], B = tl[i + 1];
  const td = B ? B.tdPrev : 0;
  const inTrans = B && td > 0 && T > A.end - td;
  if (!inTrans) layer(ctx, W, H, () => drawImage(ctx, A.s, mp(A, T), W, H));
  else {
    const p = clamp((T - (A.end - td)) / td, 0, 1), q = ease(p);
    const drawA = () => drawImage(ctx, A.s, mp(A, T), W, H), drawB = () => drawImage(ctx, B.s, mp(B, T), W, H);
    switch (A.s.trans) {
      case 'dipBlack': case 'dipWhite': {
        const col = A.s.trans === 'dipBlack' ? '0,0,0' : '255,255,255';
        if (p < .5) { layer(ctx, W, H, drawA); ctx.fillStyle = `rgba(${col},${p * 2})`; }
        else { layer(ctx, W, H, drawB); ctx.fillStyle = `rgba(${col},${(1 - p) * 2})`; }
        ctx.fillRect(0, 0, W, H); break;
      }
      case 'fade': layer(ctx, W, H, drawA); ctx.globalAlpha = q; layer(ctx, W, H, drawB); ctx.globalAlpha = 1; break;
      case 'slideLeft': case 'slideRight': {
        const d = A.s.trans === 'slideLeft' ? -1 : 1;
        ctx.save(); ctx.translate(d * q * W, 0); layer(ctx, W, H, drawA); ctx.restore();
        ctx.save(); ctx.translate(d * (q - 1) * W, 0); layer(ctx, W, H, drawB); ctx.restore(); break;
      }
      case 'slideUp':
        ctx.save(); ctx.translate(0, -q * H); layer(ctx, W, H, drawA); ctx.restore();
        ctx.save(); ctx.translate(0, (1 - q) * H); layer(ctx, W, H, drawB); ctx.restore(); break;
      case 'wipe':
        layer(ctx, W, H, drawA); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * q, H); ctx.clip(); layer(ctx, W, H, drawB); ctx.restore(); break;
      case 'circle':
        layer(ctx, W, H, drawA); ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, Math.hypot(W, H) / 2 * q, 0, Math.PI * 2); ctx.clip(); layer(ctx, W, H, drawB); ctx.restore(); break;
      case 'blinds': {
        layer(ctx, W, H, drawA); ctx.save(); ctx.beginPath(); const n = 8, bh = H / n;
        for (let k = 0; k < n; k++) ctx.rect(0, k * bh, W, bh * q); ctx.clip(); layer(ctx, W, H, drawB); ctx.restore(); break;
      }
      case 'zoom':
        ctx.save(); ctx.globalAlpha = 1 - q; ctx.translate(W / 2, H / 2); ctx.scale(1 + q * .5, 1 + q * .5); ctx.translate(-W / 2, -H / 2); layer(ctx, W, H, drawA); ctx.restore();
        ctx.save(); ctx.globalAlpha = q; ctx.translate(W / 2, H / 2); ctx.scale(.8 + .2 * q, .8 + .2 * q); ctx.translate(-W / 2, -H / 2); layer(ctx, W, H, drawB); ctx.restore(); break;
      default: layer(ctx, W, H, p < .5 ? drawA : drawB);
    }
  }
  if (V.fades) {
    const a = Math.max(T < .6 ? 1 - T / .6 : 0, T > total - .8 ? (T - (total - .8)) / .8 : 0);
    if (a > 0) { ctx.fillStyle = `rgba(0,0,0,${a})`; ctx.fillRect(0, 0, W, H); }
  }
  ctx.restore();
}

/* ── getting slides in ── */
async function fileToImg(f) { try { return await createImageBitmap(f); } catch (e) { return null; } }
async function addFiles(files) {
  const imgs = [...files].filter(f => f.type.startsWith('image/')).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  for (const f of imgs) { const im = await fileToImg(f); if (im) V.slides.push(newSlide(im, f.name)); }
}
// from a lesson: render each visible slide of that language
async function fromLesson(ls, lang) {
  const f = ls.files && ls.files[lang]; if (!f) return;
  try {
    busy(t('loading'));
    const P = L.pdf, doc = await P.docFromBytes(await P.getBytes(f.path)), hid = P.hiddenPages(f);
    V.slides = []; V.title = P.safeName(P.nameOf(ls.titles)) + ` (${lang.toUpperCase()})`;
    const pages = []; for (let p = 1; p <= doc.numPages; p++) if (!hid.has(p)) pages.push(p);
    for (let k = 0; k < pages.length; k++) {
      document.getElementById('busyText').textContent = t('vm_loading', k + 1, pages.length);
      const page = await doc.getPage(pages[k]), base = page.getViewport({ scale: 1 });
      const sc = 1920 / base.width, c = await P.renderPage(doc, pages[k], base.width * sc, base.height * sc, 1);
      V.slides.push(newSlide(c, `${k + 1}`));
    }
    doc.destroy();
  } catch (e) { toast(t('error') + e.message, true); }
  done();
  go('#/tools/video');
}
function randomize() {
  V.slides.forEach((s, i) => {
    s.motion = pickR(NICE_MOTIONS); s.trans = pickR(NICE_TRANS); s.tdur = [0.7, 0.8, 1, 1.2][i % 4];
    s.fx = .25 + Math.random() * .5; s.fy = .25 + Math.random() * .5;
  });
  // avoid the same transition twice in a row
  for (let i = 1; i < V.slides.length; i++) if (V.slides[i].trans === V.slides[i - 1].trans) V.slides[i].trans = pickR(NICE_TRANS.filter(x => x !== V.slides[i - 1].trans));
}

/* ── UI ── */
let player = null;
function render(root) {
  stopPreview();
  const sel = (val, list, prefix, on) => { const s = h('select', {}, list.map(k => h('option', { value: k, text: t(prefix + k) }))); s.value = val; s.onchange = () => on(s.value); return s; };
  const num = (val, min, max, step, on) => { const i = h('input', { type: 'number', min, max, step }); i.value = val; i.oninput = () => on(clamp(+i.value || min, min, max)); return i; };
  const redraw = () => { root.innerHTML = ''; render(root); };
  root.append(
    h('nav', { class: 'crumbs' }, h('a', { href: '#', 'data-go': 'home', text: t('allTopics') }), h('span', { text: '›' }), h('a', { href: '#/tools', text: t('tools') }), h('span', { text: '›' }), h('span', { text: t('vm_title') })),
    h('div', { class: 'view-head' }, h('div', {}, h('h1', {}, '🎞 ', t('vm_title')), h('p', { class: 'muted', text: t('vm_desc') }))));
  const form = h('div', { class: 'tool-form' }), side = h('div', { class: 'tool-preview' });
  root.append(h('div', { class: 'tool-layout vm-layout' }, form, side));
  // top actions
  const inp = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
  inp.onchange = async () => { await addFiles(inp.files); inp.value = ''; redraw(); };
  form.append(h('div', { class: 'vm-actions' },
    h('label', { class: 'btn small' }, '＋ ', t('vm_addPics'), inp),
    h('button', { type: 'button', class: 'btn small gold', title: t('vm_randomHint'), disabled: !V.slides.length, onclick: () => { randomize(); redraw(); } }, '🎲 ', t('vm_random')),
    V.slides.length ? h('button', { type: 'button', class: 'btn small danger', onclick: () => { V.slides = []; redraw(); } }, '🗑 ', t('vm_clear')) : null));
  if (!V.slides.length) {
    const drop = h('label', { class: 'maker-drop' }, h('span', { class: 'maker-drop-icon', text: '🎞' }), h('strong', { text: t('vm_empty') }));
    drop.addEventListener('click', () => inp.click());
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    drop.addEventListener('drop', async e => { e.preventDefault(); await addFiles(e.dataTransfer.files); redraw(); });
    form.append(drop);
  } else {
    // for all slides
    const a = V.all;
    form.append(h('h3', { class: 'tf-h', text: t('vm_all') }),
      h('div', { class: 'tf-row vm-all' },
        h('label', { class: 'tf' }, h('span', { text: t('vm_dur') }), num(a.dur, 1, 30, .5, v => { a.dur = v; })),
        h('label', { class: 'tf' }, h('span', { text: t('vm_motion') }), sel(a.motion, MOTIONS, 'm_', v => { a.motion = v; })),
        h('label', { class: 'tf' }, h('span', { text: t('vm_trans') }), sel(a.trans, TRANS, 'x_', v => { a.trans = v; })),
        h('label', { class: 'tf' }, h('span', { text: t('vm_tdur') }), num(a.tdur, .2, 3, .1, v => { a.tdur = v; })),
        h('button', { type: 'button', class: 'btn small primary', onclick: () => { V.slides.forEach(s => Object.assign(s, { dur: a.dur, motion: a.motion, trans: a.trans, tdur: a.tdur })); redraw(); } }, '✓ ', t('vm_apply'))));
    // per slide
    const list = h('div', { class: 'vm-list' });
    V.slides.forEach((s, i) => {
      const th = document.createElement('canvas'); th.width = 160; th.height = 90;
      const c = th.getContext('2d'); c.fillStyle = V.bg; c.fillRect(0, 0, 160, 90); const sc = Math.min(160 / s.img.width, 90 / s.img.height);
      c.drawImage(s.img, (160 - s.img.width * sc) / 2, (90 - s.img.height * sc) / 2, s.img.width * sc, s.img.height * sc);
      th.onclick = () => seekTo(timeline().tl[i].start + .01);
      const cap = h('input', { type: 'text', dir: 'auto', placeholder: t('vm_caption') }); cap.value = s.caption; cap.oninput = () => { s.caption = cap.value; drawStill(); };
      list.append(h('div', { class: 'vm-row', 'data-id': s.id },
        h('div', { class: 'vm-thumb' }, th, h('b', { text: i + 1 })),
        h('div', { class: 'vm-fields' },
          h('div', { class: 'tf-row four' },
            h('label', { class: 'tf' }, h('span', { text: t('vm_dur') }), num(s.dur, 1, 30, .5, v => { s.dur = v; updTotal(); })),
            h('label', { class: 'tf' }, h('span', { text: t('vm_motion') }), sel(s.motion, MOTIONS, 'm_', v => { s.motion = v; drawStill(); })),
            i < V.slides.length - 1 ? h('label', { class: 'tf' }, h('span', { text: t('vm_trans') }), sel(s.trans, TRANS, 'x_', v => { s.trans = v; updTotal(); })) : h('span'),
            i < V.slides.length - 1 ? h('label', { class: 'tf' }, h('span', { text: t('vm_tdur') }), num(s.tdur, .2, 3, .1, v => { s.tdur = v; })) : h('span')),
          cap),
        h('div', { class: 'vm-move' },
          h('button', { type: 'button', class: 'btn small', disabled: i === 0, onclick: () => { V.slides.splice(i - 1, 0, V.slides.splice(i, 1)[0]); redraw(); } }, '↑'),
          h('button', { type: 'button', class: 'btn small', disabled: i === V.slides.length - 1, onclick: () => { V.slides.splice(i + 1, 0, V.slides.splice(i, 1)[0]); redraw(); } }, '↓'),
          h('button', { type: 'button', class: 'btn small danger', onclick: () => { V.slides.splice(i, 1); redraw(); } }, '✕'))));
    });
    form.append(list);
    // video settings
    const music = h('input', { type: 'file', accept: 'audio/*', hidden: true });
    music.onchange = async () => {
      const f = music.files[0]; if (!f) return;
      try { const ac = new (window.AudioContext || window.webkitAudioContext)(); V.music = await ac.decodeAudioData(await f.arrayBuffer()); ac.close(); V.musicName = f.name; redraw(); }
      catch (e) { toast(t('error') + e.message, true); }
    };
    const fades = h('input', { type: 'checkbox' }); fades.checked = V.fades; fades.onchange = () => { V.fades = fades.checked; };
    const vol = h('input', { type: 'range', min: 0, max: 1, step: .05 }); vol.value = V.volume; vol.oninput = () => { V.volume = +vol.value; };
    form.append(h('h3', { class: 'tf-h', text: '⚙' }),
      h('div', { class: 'tf-row' },
        h('label', { class: 'tf' }, h('span', { text: t('vm_size') }), (() => { const s = h('select', {}, h('option', { value: 720, text: '1280 × 720 (HD)' }), h('option', { value: 1080, text: '1920 × 1080 (Full HD)' })); s.value = V.size; s.onchange = () => { V.size = +s.value; }; return s; })()),
        h('label', { class: 'tf' }, h('span', { text: t('vm_bg') }), (() => { const s = h('select', {}, h('option', { value: '#000000', text: t('vm_black') }), h('option', { value: '#ffffff', text: t('vm_white') })); s.value = V.bg; s.onchange = () => { V.bg = s.value; redraw(); }; return s; })())),
      h('label', { class: 'tcheck' }, fades, t('vm_fadeIn')),
      h('div', { class: 'tf-row' },
        h('div', { class: 'tdrop-wrap' }, h('label', { class: 'tdrop' + (V.music ? ' has' : '') }, h('b', { text: '🎵 ' + t('vm_music') }), h('span', { text: V.music ? '✓ ' + V.musicName : t('tl_choose') }), music),
          V.music ? h('button', { type: 'button', class: 'btn small danger', onclick: () => { V.music = null; V.musicName = ''; redraw(); } }, '✕') : null),
        V.music ? h('label', { class: 'tf' }, h('span', { text: t('vm_volume') }), vol) : h('span')));
  }
  // preview
  const cv = h('canvas', { class: 'vm-canvas', width: 1280, height: 720 });
  const time = h('span', { class: 'pg-n' }), totalEl = h('p', { class: 'tool-info' });
  const scrub = h('input', { type: 'range', min: 0, max: 1000, value: 0, class: 'vm-scrub' });
  const playBtn = h('button', { type: 'button', class: 'btn' }, '▶ ', t('vm_play'));
  const exp = h('button', { type: 'button', class: 'btn green wide', disabled: !V.slides.length }, '🎬 ', t('vm_export'));
  side.append(totalEl, h('div', { class: 'tool-canvas' }, cv), scrub, h('div', { class: 'pager' }, playBtn, time), exp, h('p', { class: 'muted small', text: t('vm_exportNote') }));
  const ctx = cv.getContext('2d');
  let cur = 0;
  const updTotal = () => { const { total } = timeline(); totalEl.textContent = t('vm_total', fmt(total)); time.textContent = `${fmt(cur)} / ${fmt(total)}`; };
  const drawStill = () => { drawFrame(ctx, cur, 1280, 720); updTotal(); scrub.value = timeline().total ? cur / timeline().total * 1000 : 0; };
  const seekTo = s => { cur = s; drawStill(); };
  scrub.oninput = () => { stopPreview(); cur = scrub.value / 1000 * timeline().total; drawStill(); };
  playBtn.onclick = () => {
    if (player) { stopPreview(); return; }
    const { total } = timeline(); if (!total) return;
    if (cur >= total - .05) cur = 0;
    const t0 = performance.now() - cur * 1000;
    let src = null, ac = null;
    if (V.music) { ac = new AudioContext(); src = ac.createBufferSource(); src.buffer = V.music; const g = ac.createGain(); g.gain.value = V.volume; src.connect(g).connect(ac.destination); src.start(0, cur % V.music.duration); }
    playBtn.textContent = '⏸ ' + t('vm_pause');
    const step = () => {
      cur = (performance.now() - t0) / 1000;
      if (cur >= total) { cur = total; drawStill(); stopPreview(); return; }
      drawStill(); player.raf = requestAnimationFrame(step);
    };
    player = { raf: requestAnimationFrame(step), stop: () => { cancelAnimationFrame(player.raf); try { src && src.stop(); ac && ac.close(); } catch (e) {} playBtn.textContent = '▶ ' + t('vm_play'); } };
  };
  exp.onclick = () => exportVideo();
  drawStill();
}
function stopPreview() { if (player) { player.stop(); player = null; } }

/* ── recording the video ── */
async function exportVideo() {
  stopPreview();
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { toast(t('vm_unsupported'), true); return; }
  const { total } = timeline(); if (!total) return;
  const H = V.size, W = Math.round(H * 16 / 9);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  drawFrame(ctx, 0, W, H);
  const stream = cv.captureStream(30);
  let ac = null, src = null;
  if (V.music) {
    ac = new AudioContext(); const dest = ac.createMediaStreamDestination();
    src = ac.createBufferSource(); src.buffer = V.music; src.loop = V.music.duration < total;
    const g = ac.createGain(); g.gain.setValueAtTime(V.volume, ac.currentTime); g.gain.setValueAtTime(V.volume, ac.currentTime + Math.max(0, total - 1.5)); g.gain.linearRampToValueAtTime(0, ac.currentTime + total);
    src.connect(g).connect(dest); dest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
  }
  const mime = ['video/mp4;codecs=avc1,mp4a', 'video/mp4;codecs=avc1', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(m => MediaRecorder.isTypeSupported(m)) || '';
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: H >= 1080 ? 8_000_000 : 5_000_000 } : undefined);
  const chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  let cancelled = false;
  busy(t('vm_exporting', fmt(0), fmt(total)));
  const stopBtn = h('button', { type: 'button', class: 'btn small danger', style: 'margin-top:10px', onclick: () => { cancelled = true; finish(); } }, '⏹ ', t('vm_stop'));
  document.querySelector('#busy .busy-card')?.append(stopBtn);
  let raf = 0, t0 = 0;
  const finish = () => { cancelAnimationFrame(raf); if (rec.state !== 'inactive') rec.stop(); };
  rec.onstop = () => {
    stopBtn.remove(); done();
    try { src && src.stop(); ac && ac.close(); } catch (e) {}
    stream.getTracks().forEach(tr => tr.stop());
    if (cancelled) return;
    const type = rec.mimeType || 'video/webm';
    saveBlob(new Blob(chunks, { type }), `${V.title || 'video'}.${type.includes('mp4') ? 'mp4' : 'webm'}`);
    toast(t('vm_ready'));
  };
  rec.start(500);
  if (src) src.start();
  t0 = performance.now();
  const step = () => {
    const T = (performance.now() - t0) / 1000;
    drawFrame(ctx, Math.min(T, total), W, H);
    const el = document.getElementById('busyText'); if (el) el.textContent = t('vm_exporting', fmt(Math.min(T, total)), fmt(total));
    if (T >= total + .3) { finish(); return; }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

window.LPT_VIDEO = { render, fromLesson, _V: V, _drawFrame: drawFrame };
})();
