/* Lectures Presenter — Arabic letters journey.
   Everything (stops, cards, words, pictures, sounds) lives in the database + "media" storage, not in GitHub,
   so admins can add, change and re-record anything from the website.
   Starter content: Quran-app by Safiul Alam, imported once with "Import starter pack". Progress is kept per device. */
(() => {
'use strict';
const L = window.LPT; if (!L) return;
const { t, h, T, go, api, toast, busy, done } = L;

const STR = {
  en: {
    ls_learn: 'Learn', ls_quiz: 'Quiz', ls_read: 'Read', ls_tapLearn: 'Tap a card to hear it.',
    ls_tapHear: 'Tap what you hear', ls_whichLetter: 'Which letter is this?', ls_listen: 'Listen again',
    ls_isolated: 'Alone', ls_initial: 'Beginning', ls_medial: 'Middle', ls_final: 'End', ls_noConnect: 'Does not join the next letter',
    ls_readHint: 'Tap a sound to hear it, or ▶ to hear the whole word. Read every word to finish this stop.',
    ls_readDone: 'You read them all! ⭐', ls_nextStop: 'Next stop', ls_again: 'Play again', ls_stageDone: 'Stop complete!',
    ls_progress: (d, n) => `${d} of ${n} stops`, ls_firstTry: (s, n) => `${s} of ${n} right on the first try`,
    ls_loadFail: 'Could not load the letters. Check the internet connection.', ls_empty: 'The letters journey is being prepared — come back soon!',
    ls_emptyAdmin: 'No content yet. Import the starter pack (.zip), or add your own stops.',
    ls_import: 'Import starter pack', ls_importConfirm: 'Importing replaces all stops of the letters journey. Continue?', ls_importing: (i, n) => `Uploading ${i} of ${n}…`, ls_imported: 'Letters journey imported',
    ls_addStop: 'Add stop', ls_kindCards: 'Cards (learn + quiz)', ls_kindForms: 'Letter shapes', ls_kindReading: 'Reading words',
    ls_stopSettings: 'Stop settings', ls_moveUp: 'Move earlier', ls_moveDown: 'Move later', ls_delStop: 'Delete stop', ls_confirmDelStop: 'Delete this stop with all its cards and sounds?',
    ls_addCard: 'Add card', ls_addRow: 'Add row', ls_addWord: 'Add word', ls_sound: 'Sound', ls_picture: 'Picture', ls_glyph: 'Letter / text', ls_name: 'Name',
    ls_sub: 'Small text (examples)', ls_color: 'Colour', ls_icon: 'Icon (letter or emoji)', ls_mark: 'Big mark (optional)', ls_kind: 'Type',
    ls_cells: 'Sounds, separated by spaces', ls_word: 'Whole word', ls_style: 'Row colour', ls_noJoin: 'Does not join the next letter',
    ls_record: 'Record', ls_stopRec: 'Stop recording', ls_upload: 'Upload file', ls_removeSound: 'Remove sound', ls_playCur: 'Play',
    ls_newSound: 'New sound ready — press Save', ls_noSound: 'No sound yet', ls_confirmDel: 'Delete this?', ls_saved: 'Saved', ls_needOnline: 'Sign in as admin to edit.'
  },
  ar: {
    ls_learn: 'تعلّم', ls_quiz: 'اختبار', ls_read: 'اقرأ', ls_tapLearn: 'اضغط على البطاقة لتسمعها.',
    ls_tapHear: 'اضغط على ما تسمعه', ls_whichLetter: 'ما هذا الحرف؟', ls_listen: 'استمع مرة أخرى',
    ls_isolated: 'منفرد', ls_initial: 'في الأول', ls_medial: 'في الوسط', ls_final: 'في الآخر', ls_noConnect: 'لا يتصل بما بعده',
    ls_readHint: 'اضغط على الصوت لتسمعه، أو ▶ لتسمع الكلمة كاملة. اقرأ كل الكلمات لتنهي هذه المحطة.',
    ls_readDone: 'قرأتها كلها! ⭐', ls_nextStop: 'المحطة التالية', ls_again: 'العب مرة أخرى', ls_stageDone: 'أنهيت المحطة!',
    ls_progress: (d, n) => `${d} من ${n} محطات`, ls_firstTry: (s, n) => `${s} من ${n} صحيحة من المحاولة الأولى`,
    ls_loadFail: 'تعذّر تحميل الحروف. تحقق من الاتصال بالإنترنت.', ls_empty: 'رحلة الحروف قيد التحضير — عد قريبًا!',
    ls_emptyAdmin: 'لا يوجد محتوى بعد. استورد الحزمة الأولية (.zip) أو أضف محطاتك الخاصة.',
    ls_import: 'استيراد الحزمة الأولية', ls_importConfirm: 'الاستيراد يستبدل كل محطات رحلة الحروف. المتابعة؟', ls_importing: (i, n) => `جارٍ رفع ${i} من ${n}…`, ls_imported: 'تم استيراد رحلة الحروف',
    ls_addStop: 'إضافة محطة', ls_kindCards: 'بطاقات (تعلّم + اختبار)', ls_kindForms: 'أشكال الحروف', ls_kindReading: 'قراءة كلمات',
    ls_stopSettings: 'إعدادات المحطة', ls_moveUp: 'نقل إلى الأمام', ls_moveDown: 'نقل إلى الخلف', ls_delStop: 'حذف المحطة', ls_confirmDelStop: 'حذف هذه المحطة بكل بطاقاتها وأصواتها؟',
    ls_addCard: 'إضافة بطاقة', ls_addRow: 'إضافة صف', ls_addWord: 'إضافة كلمة', ls_sound: 'الصوت', ls_picture: 'الصورة', ls_glyph: 'الحرف / النص', ls_name: 'الاسم',
    ls_sub: 'نص صغير (أمثلة)', ls_color: 'اللون', ls_icon: 'الأيقونة (حرف أو رمز)', ls_mark: 'علامة كبيرة (اختياري)', ls_kind: 'النوع',
    ls_cells: 'الأصوات مفصولة بمسافات', ls_word: 'الكلمة كاملة', ls_style: 'لون الصف', ls_noJoin: 'لا يتصل بما بعده',
    ls_record: 'تسجيل', ls_stopRec: 'إيقاف التسجيل', ls_upload: 'رفع ملف', ls_removeSound: 'حذف الصوت', ls_playCur: 'تشغيل',
    ls_newSound: 'الصوت الجديد جاهز — اضغط حفظ', ls_noSound: 'لا يوجد صوت بعد', ls_confirmDel: 'حذف هذا؟', ls_saved: 'تم الحفظ', ls_needOnline: 'سجّل الدخول كمشرف للتعديل.'
  },
  fi: {
    ls_learn: 'Opi', ls_quiz: 'Visa', ls_read: 'Lue', ls_tapLearn: 'Napauta korttia kuullaksesi sen.',
    ls_tapHear: 'Napauta sitä, minkä kuulet', ls_whichLetter: 'Mikä kirjain tämä on?', ls_listen: 'Kuuntele uudelleen',
    ls_isolated: 'Yksin', ls_initial: 'Alussa', ls_medial: 'Keskellä', ls_final: 'Lopussa', ls_noConnect: 'Ei liity seuraavaan kirjaimeen',
    ls_readHint: 'Napauta äännettä kuullaksesi sen tai ▶ kuullaksesi koko sanan. Lue kaikki sanat suorittaaksesi pysäkin.',
    ls_readDone: 'Luit ne kaikki! ⭐', ls_nextStop: 'Seuraava pysäkki', ls_again: 'Pelaa uudelleen', ls_stageDone: 'Pysäkki suoritettu!',
    ls_progress: (d, n) => `${d}/${n} pysäkkiä`, ls_firstTry: (s, n) => `${s}/${n} oikein ensimmäisellä yrityksellä`,
    ls_loadFail: 'Kirjaimia ei voitu ladata. Tarkista internetyhteys.', ls_empty: 'Kirjainmatkaa valmistellaan — tule pian takaisin!',
    ls_emptyAdmin: 'Ei vielä sisältöä. Tuo aloituspaketti (.zip) tai lisää omia pysäkkejä.',
    ls_import: 'Tuo aloituspaketti', ls_importConfirm: 'Tuonti korvaa kaikki kirjainmatkan pysäkit. Jatketaanko?', ls_importing: (i, n) => `Ladataan ${i}/${n}…`, ls_imported: 'Kirjainmatka tuotu',
    ls_addStop: 'Lisää pysäkki', ls_kindCards: 'Kortit (opi + visa)', ls_kindForms: 'Kirjainten muodot', ls_kindReading: 'Sanojen lukeminen',
    ls_stopSettings: 'Pysäkin asetukset', ls_moveUp: 'Siirrä aiemmaksi', ls_moveDown: 'Siirrä myöhemmäksi', ls_delStop: 'Poista pysäkki', ls_confirmDelStop: 'Poistetaanko pysäkki kaikkine kortteineen ja äänineen?',
    ls_addCard: 'Lisää kortti', ls_addRow: 'Lisää rivi', ls_addWord: 'Lisää sana', ls_sound: 'Ääni', ls_picture: 'Kuva', ls_glyph: 'Kirjain / teksti', ls_name: 'Nimi',
    ls_sub: 'Pieni teksti (esimerkit)', ls_color: 'Väri', ls_icon: 'Kuvake (kirjain tai emoji)', ls_mark: 'Iso merkki (valinnainen)', ls_kind: 'Tyyppi',
    ls_cells: 'Äänteet välilyönnein erotettuina', ls_word: 'Koko sana', ls_style: 'Rivin väri', ls_noJoin: 'Ei liity seuraavaan kirjaimeen',
    ls_record: 'Äänitä', ls_stopRec: 'Lopeta äänitys', ls_upload: 'Lataa tiedosto', ls_removeSound: 'Poista ääni', ls_playCur: 'Toista',
    ls_newSound: 'Uusi ääni valmis — paina Tallenna', ls_noSound: 'Ei vielä ääntä', ls_confirmDel: 'Poistetaanko?', ls_saved: 'Tallennettu', ls_needOnline: 'Kirjaudu ylläpitäjänä muokataksesi.'
  }
};
for (const l of Object.keys(STR)) Object.assign(T[l], STR[l]);

/* ───────── content (database) ───────── */
let C = null, loading = null;
const isAdmin = () => !!L.state.isAdmin;
const tx = o => (o && typeof o === 'object') ? (o[L.state.lang] || o.en || o.ar || o.fi || '') : (o || '');
async function loadContent(force) {
  if (C && !force) return C;
  if (!loading || force) loading = api.getSettings().then(st => { C = (st && st.letters && Array.isArray(st.letters.stops)) ? st.letters : { version: 1, stops: [], sfx: {} }; loading = null; return C; });
  return loading;
}
async function saveContent() { await api.saveSetting('letters', C); }
const uid = L.uid;
const urlCache = new Map();
async function mediaUrl(path) {
  if (!path) return '';
  if (!urlCache.has(path)) urlCache.set(path, api.mediaUrl(path));
  return urlCache.get(path);
}
const player = new Audio(), fx = new Audio();
async function playPath(path, el = player) {
  const u = await mediaUrl(path); if (!u) return;
  try { el.pause(); el.src = u; el.currentTime = 0; await el.play(); } catch (e) {}
}
const sfx = ok => C && C.sfx && playPath(ok ? C.sfx.correct : C.sfx.wrong, fx);
const NORM = s => String(s || '').normalize('NFC').replace(/\s+/g, '');
const baseOf = s => { const b = String(s).replace(/[ً-ْٰـ]/g, '').trim(); return ({ 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ء': 'ا', 'ى': 'ي', 'ة': 'ت', 'ؤ': 'و', 'ئ': 'ي' })[b] || b; };
function soundFor(cell) {   // find a recording for a reading cell: exact card match first, then the plain letter
  const n = NORM(cell); let fallback = null;
  for (const s of C.stops) for (const c of (s.cards || [])) {
    if (!c.audio) continue;
    if (NORM(c.glyph) === n) return c.audio;
    if (!fallback && NORM(c.glyph) === baseOf(cell)) fallback = c.audio;
  }
  return fallback;
}
function speak(text) {
  if (!('speechSynthesis' in window)) return false;
  try {
    const v = speechSynthesis.getVoices().find(x => /^ar/i.test(x.lang)); if (!v) return false;
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = v.lang; u.voice = v; u.rate = 0.7; speechSynthesis.speak(u); return true;
  } catch (e) { return false; }
}
async function playSequence(paths) {
  for (const p of paths) { if (!p) continue; await new Promise(res => { player.onended = res; player.onerror = res; playPath(p); setTimeout(res, 1600); }); }
  player.onended = null; player.onerror = null;
}

/* ───────── progress (per device) ───────── */
const PK = 'lpt.letters';
const prog = L.readJSON(PK, {});
const saveProg = () => { try { localStorage.setItem(PK, JSON.stringify(prog)); } catch (e) {} };
const starsFor = (s, n) => !n ? 0 : s / n >= .9 ? 3 : s / n >= .6 ? 2 : s > 0 ? 1 : 0;
function record(id, score, total) {
  const st = starsFor(score, total), r = prog[id] || {};
  if (!r.stars || st >= r.stars) prog[id] = { ...r, stars: st, best: score, total, done: st >= 1, date: new Date().toISOString() };
  saveProg();
}
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ───────── admin dialogs ───────── */
let dlg = null;
function dialog(title, build, onSave, wide) {
  if (!dlg) {
    dlg = h('div', { class: 'modal', hidden: true });
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-x]')) close(); });
    document.body.append(dlg);
  }
  const close = () => { dlg.hidden = true; dlg.innerHTML = ''; stopRec(); };
  const body = h('div');
  const form = h('form', { class: 'modal-card' + (wide ? ' wide' : '') }, h('h2', { text: title }), body,
    h('div', { class: 'modal-foot' }, h('button', { type: 'button', class: 'btn', 'data-x': '' }, t('cancel')), h('button', { type: 'submit', class: 'btn primary' }, t('save'))));
  form.onsubmit = async e => {
    e.preventDefault();
    try { busy(t('saving')); await onSave(); await saveContent(); close(); toast(t('ls_saved')); rerender(); }
    catch (err) { console.error(err); toast(err.message || String(err), true); }
    done();
  };
  dlg.innerHTML = ''; dlg.append(form); build(body); dlg.hidden = false;
  setTimeout(() => form.querySelector('input,textarea,select')?.focus(), 30);
}
const fieldRow = (label, el) => h('label', { class: 'field' }, h('span', { text: label }), el);
function textIn(v, attrs = {}) { const i = h('input', { type: 'text', dir: 'auto', ...attrs }); i.value = v || ''; return i; }
function trioIn(obj) {
  const box = h('div', { class: 'trio' }), ins = {};
  L.LANGS.forEach(l => { const i = textIn(obj && obj[l], { dir: l === 'ar' ? 'rtl' : 'ltr' }); ins[l] = i; box.append(h('div', { class: 'trio-row noact' }, h('label', { text: L.LANG_NAMES[l] }), i)); });
  return { box, val: () => { const o = {}; L.LANGS.forEach(l => { o[l] = ins[l].value.trim(); }); return o; } };
}
function colorIn(v) { const i = h('input', { type: 'color' }); i.value = v || '#5b4fe0'; return i; }
const extOf = (blob, name) => (name && /\.(\w+)$/.test(name) ? RegExp.$1 : (blob.type.split('/')[1] || 'bin').split(';')[0]).toLowerCase();

/* sound picker: play / upload / record (returns a getter for the new blob, or 'remove') */
let rec = null;
function stopRec() { if (rec && rec.state !== 'inactive') rec.stop(); rec = null; }
function soundPicker(curPath) {
  let next = null; // Blob | 'remove' | null
  const status = h('small', { class: 'muted', text: curPath ? '' : t('ls_noSound') });
  const prev = h('audio', { controls: true, class: 'ls-prev', hidden: !curPath });
  if (curPath) mediaUrl(curPath).then(u => { prev.src = u; });
  const file = h('input', { type: 'file', accept: 'audio/*', hidden: true });
  file.onchange = () => { const f = file.files[0]; if (!f) return; next = f; prev.src = URL.createObjectURL(f); prev.hidden = false; status.textContent = t('ls_newSound'); };
  const recBtn = h('button', { type: 'button', class: 'btn small' }, '🎙 ', t('ls_record'));
  recBtn.onclick = async () => {
    if (rec) { stopRec(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const chunks = []; rec = new MediaRecorder(stream);
      rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach(tr => tr.stop());
        next = new Blob(chunks, { type: (rec && rec.mimeType) || chunks[0]?.type || 'audio/webm' });
        prev.src = URL.createObjectURL(next); prev.hidden = false; status.textContent = t('ls_newSound');
        recBtn.textContent = '🎙 ' + t('ls_record'); recBtn.classList.remove('danger'); rec = null;
      };
      rec.start(); recBtn.textContent = '⏹ ' + t('ls_stopRec'); recBtn.classList.add('danger');
    } catch (e) { toast(t('micDenied'), true); }
  };
  const box = h('div', { class: 'ls-sound' }, prev,
    h('div', { class: 'row' }, recBtn, h('label', { class: 'btn small' }, '⬆ ', t('ls_upload'), file),
      curPath ? h('button', { type: 'button', class: 'btn small danger', onclick: () => { next = 'remove'; prev.hidden = true; status.textContent = t('ls_noSound'); } }, '🗑 ', t('ls_removeSound')) : null),
    status);
  return { box, get: () => next };
}
function picturePicker(curPath) {
  let next = null;
  const img = h('img', { class: 'ls-pic-prev', hidden: !curPath, alt: '' });
  if (curPath) mediaUrl(curPath).then(u => { img.src = u; });
  const file = h('input', { type: 'file', accept: 'image/*', hidden: true });
  file.onchange = () => { const f = file.files[0]; if (!f) return; next = f; img.src = URL.createObjectURL(f); img.hidden = false; };
  return { box: h('div', { class: 'ls-sound' }, img, h('div', { class: 'row' }, h('label', { class: 'btn small' }, '🖼 ', t('ls_upload'), file),
    curPath ? h('button', { type: 'button', class: 'btn small danger', onclick: () => { next = 'remove'; img.hidden = true; } }, '🗑') : null)), get: () => next };
}
// apply a picker result to obj[key]: upload new media, remove the old file
async function applyMedia(obj, key, val) {
  if (!val) return;
  const old = obj[key];
  if (val === 'remove') { delete obj[key]; }
  else { const path = `letters/u-${uid()}.${extOf(val, val.name)}`; await api.uploadMedia(path, val); obj[key] = path; }
  if (old && old !== obj[key]) { urlCache.delete(old); api.removeMedia([old]).catch(() => {}); }
}
function adminBtns(...btns) { return isAdmin() ? h('div', { class: 'ls-adm', onclick: e => e.stopPropagation() }, btns) : null; }
const aBtn = (label, title, fn, cls = '') => h('button', { type: 'button', class: 'ls-ab ' + cls, title, onclick: e => { e.stopPropagation(); fn(); } }, label);
async function quickSave(fn) { try { busy(t('saving')); await fn(); await saveContent(); rerender(); } catch (e) { toast(e.message, true); } done(); }

/* edit dialogs */
function editStop(s, isNew) {
  let title, icon, color, mark, kind;
  dialog(isNew ? t('ls_addStop') : t('ls_stopSettings'), body => {
    title = trioIn(s.title); icon = textIn(s.icon); color = colorIn(s.color); mark = textIn(s.mark);
    if (isNew) { kind = h('select', {}, ['cards', 'forms', 'reading'].map(k => h('option', { value: k, text: t('ls_kind' + k[0].toUpperCase() + k.slice(1)) }))); body.append(fieldRow(t('ls_kind'), kind)); }
    body.append(h('p', { class: 'muted small', text: t('ls_name') }), title.box, h('div', { class: 'tf-row' }, fieldRow(t('ls_icon'), icon), fieldRow(t('ls_color'), color), fieldRow(t('ls_mark'), mark)));
  }, async () => {
    s.title = title.val(); s.icon = icon.value.trim() || '⭐'; s.color = color.value; s.mark = mark.value.trim();
    if (isNew) { s.kind = kind.value; s.id = 's-' + uid().slice(0, 8); if (s.kind === 'cards') s.cards = []; else s.rows = []; C.stops.push(s); }
  });
}
function editCard(s, c, isNew) {
  let glyph, name, sub, color, snd, pic;
  dialog(isNew ? t('ls_addCard') : '✎ ' + (c.glyph || ''), body => {
    glyph = textIn(c.glyph, { class: 'ls-in-big' }); name = trioIn(c.name); sub = textIn(c.sub); color = colorIn(c.color || s.color);
    snd = soundPicker(c.audio); pic = picturePicker(c.img);
    body.append(fieldRow(t('ls_glyph'), glyph), h('p', { class: 'muted small', text: t('ls_name') }), name.box, fieldRow(t('ls_sub'), sub), fieldRow(t('ls_color'), color),
      h('h3', { class: 'sub-h', text: '🔊 ' + t('ls_sound') }), snd.box, h('h3', { class: 'sub-h', text: '🖼 ' + t('ls_picture') }), pic.box);
  }, async () => {
    if (!glyph.value.trim()) throw new Error(t('ls_glyph') + '?');
    c.glyph = glyph.value.trim(); c.name = name.val(); c.sub = sub.value.trim(); c.color = color.value;
    await applyMedia(c, 'audio', snd.get()); await applyMedia(c, 'img', pic.get());
    if (isNew) { c.id = uid(); s.cards.push(c); }
  }, true);
}
function editFormRow(s, r, isNew) {
  let glyph, name, f = {}, nj, color, snd;
  dialog(isNew ? t('ls_addRow') : '✎ ' + (r.glyph || ''), body => {
    glyph = textIn(r.glyph, { class: 'ls-in-big' }); name = trioIn(r.name); color = colorIn(r.color || s.color); snd = soundPicker(r.audio);
    ['isolated', 'initial', 'medial', 'final'].forEach(p => { f[p] = textIn((r.forms || {})[p], { class: 'ls-in-big', dir: 'rtl' }); });
    nj = h('input', { type: 'checkbox' }); nj.checked = !!r.noConnect;
    body.append(fieldRow(t('ls_glyph'), glyph), name.box,
      h('div', { class: 'tf-row four' }, ['isolated', 'initial', 'medial', 'final'].map(p => fieldRow(t('ls_' + p), f[p]))),
      h('label', { class: 'tcheck' }, nj, t('ls_noJoin')), fieldRow(t('ls_color'), color), h('h3', { class: 'sub-h', text: '🔊 ' + t('ls_sound') }), snd.box);
  }, async () => {
    if (!glyph.value.trim()) throw new Error(t('ls_glyph') + '?');
    r.glyph = glyph.value.trim(); r.name = name.val(); r.color = color.value; r.noConnect = nj.checked;
    r.forms = {}; Object.keys(f).forEach(p => { r.forms[p] = f[p].value.trim() || r.glyph; });
    await applyMedia(r, 'audio', snd.get());
    if (isNew) { r.id = uid(); s.rows.push(r); }
  }, true);
}
function editWord(row, g, isNew) {
  let cells, word, snd;
  dialog(isNew ? t('ls_addWord') : '✎ ' + (g.text || ''), body => {
    cells = textIn((g.cells || []).join(' '), { class: 'ls-in-big', dir: 'rtl' }); word = textIn(g.text, { class: 'ls-in-big', dir: 'rtl' }); snd = soundPicker(g.audio);
    body.append(fieldRow(t('ls_cells'), cells), fieldRow(t('ls_word'), word), h('h3', { class: 'sub-h', text: '🔊 ' + t('ls_sound') + ' (' + t('ls_word') + ')' }), snd.box);
  }, async () => {
    g.cells = cells.value.trim().split(/\s+/).filter(Boolean); g.text = word.value.trim() || g.cells.join('');
    if (!g.cells.length) throw new Error(t('ls_cells') + '?');
    await applyMedia(g, 'audio', snd.get());
    if (isNew) { g.id = uid(); row.groups.push(g); }
  }, true);
}
function importPack() {
  if (C.stops.length && !confirm(t('ls_importConfirm'))) return;
  const inp = h('input', { type: 'file', accept: '.zip,application/zip' });
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      busy(t('loading'));
      await loadScript('vendor/jszip.min.js');
      const zip = await JSZip.loadAsync(f);
      const cj = zip.file('content.json'); if (!cj) throw new Error('content.json missing');
      const content = JSON.parse(await cj.async('string'));
      const files = Object.values(zip.files).filter(z => !z.dir && z.name !== 'content.json');
      for (let i = 0; i < files.length; i++) {
        document.getElementById('busyText').textContent = t('ls_importing', i + 1, files.length);
        const z = files[i], ext = z.name.split('.').pop().toLowerCase();
        const type = { m4a: 'audio/mp4', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', webm: 'audio/webm', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }[ext] || 'application/octet-stream';
        await api.uploadMedia(z.name, new Blob([await z.async('arraybuffer')], { type }));
        urlCache.delete(z.name);
      }
      C = content; await saveContent();
      toast(t('ls_imported')); rerender();
    } catch (e) { console.error(e); toast(t('error') + e.message, true); }
    done();
  };
  inp.click();
}
const loadScript = src => new Promise((res, rej) => { if (window.JSZip) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.append(s); });

/* ═════════ journey map ═════════ */
function renderMap(root) {
  const S = C.stops, done = S.filter(s => prog[s.id] && prog[s.id].done).length;
  const nextIdx = S.findIndex(s => !(prog[s.id] && prog[s.id].done));
  root.append(
    h('nav', { class: 'crumbs' }, h('a', { href: '#', 'data-go': 'home', text: t('allTopics') }), h('span', { text: '›' }), h('span', { text: t('ls_big') })),
    h('div', { class: 'topic-head', style: '--c:#5b4fe0' },
      h('div', { class: 'topic-badge ls-glyph', text: 'أ' }),
      h('div', { class: 'topic-head-text' }, h('h1', { text: t('ls_big') }),
        S.length ? h('div', { class: 'progress-line' }, h('div', { class: 'pbar' }, h('div', { class: 'pbar-fill', style: `width:${done / S.length * 100}%` })), h('span', { text: t('ls_progress', done, S.length) })) : null),
      isAdmin() ? h('div', { class: 'topic-admin' },
        h('button', { type: 'button', class: 'btn', onclick: importPack }, '📦 ', t('ls_import')),
        h('button', { type: 'button', class: 'btn primary', onclick: () => editStop({ title: {}, icon: '⭐', color: '#5b4fe0' }, true) }, '＋ ', t('ls_addStop'))) : null));
  if (!S.length) { root.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '🔤' }), h('p', { text: isAdmin() ? t('ls_emptyAdmin') : t('ls_empty') }))); return; }
  const wrap = h('div', { class: 'journey', style: '--c:#5b4fe0' });
  root.append(wrap, C.credit ? h('p', { class: 'muted small ls-credit', text: C.credit }) : null);
  const night = document.documentElement.dataset.theme === 'dark';
  const decos = night ? ['⭐', '🌙', '✨', '🪐', '🌟'] : ['🌳', '🌷', '⛰️', '🌲', '🦋', '🌻'];
  const STEP = 165, FIRST = 200, X = [30, 52, 72, 50], n = S.length;
  const start = { x: 50, y: 70 }, pts = S.map((_, i) => ({ x: X[i % 4], y: FIRST + i * STEP })), end = { x: X[n % 4], y: FIRST + n * STEP - 25 };
  const H = end.y + 95; wrap.style.height = H + 'px';
  const chain = [start, ...pts, end];
  const seg = (a, b) => { const dy = b.y - a.y; return `M${a.x} ${a.y} C${a.x} ${a.y + dy * .55} ${b.x} ${b.y - dy * .55} ${b.x} ${b.y}`; };
  let edge = '', roads = '';
  for (let k = 0; k < chain.length - 1; k++) {
    const p = seg(chain[k], chain[k + 1]); edge += p + ' ';
    const ok = k < n ? !!(prog[S[k].id] && prog[S[k].id].done) : nextIdx === -1;
    roads += `<path class="road${ok ? ' done' : ''}" d="${p}" vector-effect="non-scaling-stroke"/>`;
  }
  wrap.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" height="${H}" aria-hidden="true"><path class="road-edge" d="${edge}" vector-effect="non-scaling-stroke"/>${roads}<path class="road-dash" d="${edge}" vector-effect="non-scaling-stroke"/></svg>`);
  pts.forEach((p, i) => { const side = p.x < 45 ? 84 : p.x > 55 ? 14 : (i % 2 ? 88 : 12); wrap.append(h('div', { class: 'deco', style: `left:${side}%;top:${p.y + 10}px`, text: decos[i % decos.length] })); });
  wrap.append(h('div', { class: 'milestone', style: `left:${start.x}%;top:${start.y}px` }, h('span', { class: 'mk', text: '🚩' }), h('span', { class: 'ml', text: t('start') })));
  wrap.append(h('div', { class: 'milestone', style: `left:${end.x}%;top:${end.y}px` }, h('span', { class: 'mk', text: nextIdx === -1 ? '🏆' : '📖' }), h('span', { class: 'ml', text: nextIdx === -1 ? t('finishAll') : '…' })));
  S.forEach((s, i) => {
    const p = pts[i], r = prog[s.id], dn = !!(r && r.done);
    wrap.append(h('div', { class: 'stop' + (dn ? ' done' : '') + (i === nextIdx ? ' next' : ''), style: `left:${p.x}%;top:${p.y}px;--c:${s.color}` },
      i === nextIdx ? h('span', { class: 'next-flag', text: t('nextUp') }) : null,
      h('button', { class: 'stop-btn', type: 'button', onclick: () => go('#/letters/' + s.id) },
        h('div', { class: 'stop-inner ls-glyph', text: s.icon }), h('span', { class: 'stop-num', text: i + 1 }), dn ? h('span', { class: 'stop-star', text: '★' }) : null),
      h('div', { class: 'stop-label', onclick: () => go('#/letters/' + s.id) }, h('span', { text: tx(s.title) }), h('small', { text: r ? '⭐'.repeat(r.stars || 0) || '·' : '' }))));
  });
}

/* ═════════ a stop ═════════ */
const view = {};
function renderStage(root, s) {
  const i = C.stops.indexOf(s);
  const tabs = s.kind === 'reading' ? ['read'] : ['learn', 'quiz'];
  const tab = tabs.includes(view[s.id]) ? view[s.id] : tabs[0];
  const move = d => quickSave(async () => { const j = i + d; if (j < 0 || j >= C.stops.length) return; C.stops.splice(i, 1); C.stops.splice(j, 0, s); });
  root.append(
    h('nav', { class: 'crumbs' }, h('a', { href: '#', 'data-go': 'home', text: t('allTopics') }), h('span', { text: '›' }), h('a', { href: '#/letters', text: t('ls_big') }), h('span', { text: '›' }), h('span', { text: tx(s.title) })),
    h('div', { class: 'topic-head', style: `--c:${s.color}` },
      h('div', { class: 'topic-badge ls-glyph', text: s.icon }),
      h('div', { class: 'topic-head-text' }, h('h1', { text: `${i + 1}. ${tx(s.title)}` }), s.mark ? h('div', { class: 'ls-mark', text: s.mark }) : null),
      tabs.length > 1 ? h('div', { class: 'tabs ls-tabs' }, tabs.map(k => h('button', { type: 'button', class: k === tab ? 'active' : '', onclick: () => { view[s.id] = k; rerender(); } }, k === 'learn' ? '👀 ' : '🎯 ', t('ls_' + k)))) : null),
    isAdmin() ? h('div', { class: 'ls-admin-bar' },
      h('button', { type: 'button', class: 'btn small', onclick: () => editStop(s) }, '⚙ ', t('ls_stopSettings')),
      h('button', { type: 'button', class: 'btn small', disabled: i === 0, onclick: () => move(-1) }, '↑ ', t('ls_moveUp')),
      h('button', { type: 'button', class: 'btn small', disabled: i === C.stops.length - 1, onclick: () => move(1) }, '↓ ', t('ls_moveDown')),
      h('button', { type: 'button', class: 'btn small danger', onclick: () => { if (confirm(t('ls_confirmDelStop'))) quickSave(async () => { C.stops.splice(i, 1); go('#/letters'); }); } }, '🗑 ', t('ls_delStop'))) : null);
  const body = h('div', { class: 'ls-body', style: `--c:${s.color}` });
  root.append(body);
  if (tab === 'learn') renderLearn(body, s);
  else if (tab === 'quiz') renderQuiz(body, s);
  else renderReading(body, s);
}
let rerender = () => {};

function cardEl(s, c, list) {
  const pic = c.img ? h('img', { class: 'ls-img', alt: '' }) : null;
  if (pic) mediaUrl(c.img).then(u => { pic.src = u; });
  const el = h('div', { class: 'ls-card' + (c.audio ? '' : ' mute'), role: 'button', tabindex: '0', style: `--lc:${c.color || s.color}` },
    pic, h('span', { class: 'ls-big', text: c.glyph }), tx(c.name) ? h('b', { text: tx(c.name) }) : null, c.sub ? h('small', { text: c.sub }) : null,
    adminBtns(aBtn('🎙', t('ls_sound'), () => editCard(s, c)), aBtn('✎', t('edit'), () => editCard(s, c)),
      aBtn('🗑', t('delete'), () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { list.splice(list.indexOf(c), 1); if (c.audio) api.removeMedia([c.audio]).catch(() => {}); }); }, 'danger')));
  const tap = () => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); if (c.audio) playPath(c.audio); };
  el.onclick = tap; el.onkeydown = e => { if (e.key === 'Enter') tap(); };
  return el;
}
function renderLearn(body, s) {
  body.append(h('p', { class: 'muted', text: t('ls_tapLearn') }));
  if (s.kind === 'cards') {
    body.append(h('div', { class: 'ls-grid' }, (s.cards || []).map(c => cardEl(s, c, s.cards)),
      isAdmin() ? h('button', { type: 'button', class: 'ls-card ls-add', onclick: () => editCard(s, { name: {} }, true) }, h('span', { class: 'ls-big', text: '＋' }), h('b', { text: t('ls_addCard') })) : null));
  } else if (s.kind === 'forms') {
    const POS = ['isolated', 'initial', 'medial', 'final'];
    body.append(h('div', { class: 'ls-forms' },
      h('div', { class: 'lf-row lf-head' }, h('span'), POS.map(p => h('span', { text: t('ls_' + p) }))),
      (s.rows || []).map(r => h('div', { class: 'lf-row', style: `--lc:${r.color || s.color}` },
        h('button', { type: 'button', class: 'lf-name', onclick: () => r.audio && playPath(r.audio) }, h('b', { text: r.glyph }), h('small', { text: tx(r.name) }),
          adminBtns(aBtn('✎', t('edit'), () => editFormRow(s, r)), aBtn('🗑', t('delete'), () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { s.rows.splice(s.rows.indexOf(r), 1); }); }, 'danger'))),
        POS.map(p => h('button', { type: 'button', class: 'lf-cell', onclick: () => r.audio && playPath(r.audio), text: (r.forms || {})[p] || '' })),
        r.noConnect ? h('em', { class: 'lf-note', text: '⛔ ' + t('ls_noConnect') }) : null)),
      isAdmin() ? h('button', { type: 'button', class: 'btn', onclick: () => editFormRow(s, { name: {}, forms: {} }, true) }, '＋ ', t('ls_addRow')) : null));
  }
}

function makeQuestions(s) {
  if (s.kind === 'cards') {
    const set = (s.cards || []).filter(c => c.glyph);
    if (set.length < 2) return [];
    return shuffle(set.filter(c => c.audio)).slice(0, 10).map(c => ({ audio: c.audio, opts: shuffle([c, ...shuffle(set.filter(x => x !== c)).slice(0, 3)]).map(x => ({ glyph: x.glyph, color: x.color || s.color, ok: x === c })) }));
  }
  const set = (s.rows || []).filter(r => r.forms && (r.forms.initial !== r.forms.isolated || r.forms.medial !== r.forms.isolated));
  if ((s.rows || []).length < 2) return [];
  return shuffle(set).slice(0, 10).map(r => {
    const pos = shuffle(['initial', 'medial', 'final'])[0];
    return { show: r.forms[pos], label: t('ls_' + pos), audio: r.audio, opts: shuffle([r, ...shuffle(s.rows.filter(x => x !== r)).slice(0, 3)]).map(x => ({ glyph: x.glyph, color: x.color || s.color, ok: x === r })) };
  });
}
function renderQuiz(body, s) {
  const qs = makeQuestions(s);
  if (!qs.length) { body.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '🎯' }), h('p', { text: isAdmin() ? t('ls_addCard') + ' (2+ 🔊)' : t('ls_empty') }))); return; }
  let i = 0, score = 0, missed = false;
  const box = h('div', { class: 'ls-quiz' }); body.append(box);
  const draw = () => {
    box.innerHTML = '';
    if (i >= qs.length) return finish();
    const q = qs[i]; missed = false;
    const head = q.show
      ? h('div', { class: 'ls-prompt' }, h('div', { class: 'ls-show', text: q.show }), h('small', { text: q.label }), h('p', { text: t('ls_whichLetter') }))
      : h('div', { class: 'ls-prompt' }, h('button', { type: 'button', class: 'ls-speaker', title: t('ls_listen'), onclick: () => playPath(q.audio) }, '🔊'), h('p', { text: t('ls_tapHear') }));
    const grid = h('div', { class: 'ls-opts' }, q.opts.map(o => {
      const b = h('button', { type: 'button', class: 'ls-opt', style: `--lc:${o.color}`, text: o.glyph });
      b.onclick = () => {
        if (box.classList.contains('locked')) return;
        if (o.ok) {
          if (!missed) score++;
          b.classList.add('right'); box.classList.add('locked'); sfx(true);
          if (q.show && q.audio) setTimeout(() => playPath(q.audio), 350);
          setTimeout(() => { box.classList.remove('locked'); i++; draw(); }, 1000);
        } else { missed = true; b.classList.add('wrong'); b.disabled = true; sfx(false); }
      };
      return b;
    }));
    box.append(h('div', { class: 'pbar ls-qbar' }, h('div', { class: 'pbar-fill', style: `width:${i / qs.length * 100}%` })), h('div', { class: 'ls-count', text: `${i + 1} / ${qs.length}` }), head, grid);
    if (!q.show) setTimeout(() => playPath(q.audio), 250);
  };
  const finish = () => {
    record(s.id, score, qs.length);
    const st = starsFor(score, qs.length), nxt = C.stops[C.stops.indexOf(s) + 1];
    box.append(h('div', { class: 'quiz-result' },
      h('div', { class: 'quiz-stars' }, [1, 2, 3].map(k => h('span', { class: k <= st ? 'on' : '', style: `animation-delay:${k * .18}s`, text: '★' }))),
      h('h3', { text: st ? t('ls_stageDone') : t('quizAgain') }), h('p', { class: 'muted', text: t('ls_firstTry', score, qs.length) }),
      h('div', { class: 'quiz-foot', style: 'justify-content:center' },
        h('button', { type: 'button', class: 'btn', onclick: () => { box.remove(); renderQuiz(body, s); } }, '↺ ', t('ls_again')),
        nxt ? h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/letters/' + nxt.id) }, t('ls_nextStop'), ' →') : h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/letters') }, '🏆'))));
  };
  draw();
}

function renderReading(body, s) {
  const rows = s.rows || [];
  const readSet = new Set((prog[s.id] && prog[s.id].read) || []);
  const total = rows.reduce((n, r) => n + r.groups.length, 0);
  const status = h('p', { class: 'tool-info' });
  const upd = () => {
    status.textContent = total && readSet.size >= total ? t('ls_readDone') : `${readSet.size} / ${total}`;
    const r = prog[s.id] || {}; r.read = [...readSet];
    if (total && readSet.size >= total && !r.done) { r.done = true; r.stars = 3; r.date = new Date().toISOString(); sfx(true); }
    prog[s.id] = r; saveProg();
  };
  body.append(h('p', { class: 'muted', text: t('ls_readHint') }), status);
  const STY = ['green', 'pink', 'gray'];
  rows.forEach(row => {
    body.append(h('div', { class: 'lr-row lr-' + (row.style || 'gray') },
      row.groups.map(g => {
        const blk = h('div', { class: 'lr-group' + (readSet.has(g.id) ? ' read' : '') });
        const mark = () => { readSet.add(g.id); blk.classList.add('read'); upd(); };
        blk.append(
          h('div', { class: 'lr-cells', dir: 'rtl' }, g.cells.map(c => h('button', { type: 'button', class: 'lr-cell', text: c, onclick: () => { const a = soundFor(c); if (a) playPath(a); mark(); } }))),
          h('button', { type: 'button', class: 'lr-word', onclick: () => {
            blk.classList.add('playing'); setTimeout(() => blk.classList.remove('playing'), 1400);
            if (g.audio) playPath(g.audio); else if (!speak(g.text)) playSequence(g.cells.map(soundFor));
            mark();
          } }, g.audio ? '🔊 ' : '▶ ', h('span', { text: g.text, dir: 'rtl' })),
          adminBtns(aBtn('✎', t('edit'), () => editWord(row, g)), aBtn('🗑', t('delete'), () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { row.groups.splice(row.groups.indexOf(g), 1); if (g.audio) api.removeMedia([g.audio]).catch(() => {}); }); }, 'danger')));
        return blk;
      }),
      isAdmin() ? h('div', { class: 'lr-adm' },
        h('button', { type: 'button', class: 'btn small', onclick: () => editWord(row, { cells: [] }, true) }, '＋ ', t('ls_addWord')),
        h('button', { type: 'button', class: 'btn small', title: t('ls_style'), onclick: () => quickSave(async () => { row.style = STY[(STY.indexOf(row.style) + 1) % STY.length]; }) }, '🎨'),
        h('button', { type: 'button', class: 'btn small danger', onclick: () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { rows.splice(rows.indexOf(row), 1); }); } }, '🗑')) : null));
  });
  if (isAdmin()) body.append(h('button', { type: 'button', class: 'btn', onclick: () => quickSave(async () => { s.rows = rows; rows.push({ id: uid(), style: STY[rows.length % 3], groups: [] }); }) }, '＋ ', t('ls_addRow')));
  const nxt = C.stops[C.stops.indexOf(s) + 1];
  body.append(h('div', { class: 'quiz-foot', style: 'justify-content:center' }, nxt ? h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/letters/' + nxt.id) }, t('ls_nextStop'), ' →') : h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/letters') }, '🏆')));
  upd();
}

/* ── entry point (app.js calls this for #/letters and #/letters/<stop>) ── */
window.LPT_LETTERS = {
  async render(root, stage, force) {
    const key = (stage || '') + '|' + L.state.lang + '|' + document.documentElement.dataset.theme + '|' + isAdmin();
    if (!force && root.dataset.key === key && root.childElementCount) return;   // keep a running quiz when the app re-renders
    root.dataset.key = key;
    rerender = () => window.LPT_LETTERS.render(root, L.state.route.stage, true);
    if (!C) { root.innerHTML = ''; root.append(h('div', { class: 'spinner' })); }
    try { await loadContent(); }
    catch (e) { root.innerHTML = ''; root.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '📡' }), h('p', { text: t('ls_loadFail') }))); return; }
    root.innerHTML = '';
    const s = C.stops.find(x => x.id === stage);
    if (s) renderStage(root, s); else renderMap(root);
  }
};
if (L.state.route && L.state.route.view === 'letters') window.LPT_LETTERS.render(document.getElementById('lettersView'), L.state.route.stage);
})();
