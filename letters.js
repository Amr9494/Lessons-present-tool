/* Lectures Presenter — Arabic letters journey (Noor al-Bayan path).
   Islands (units) on a sea map → each island has a route of lessons (learn, read, quiz games).
   Everything (islands, lessons, cards, words, pictures, sounds) is stored in the database + "media" storage,
   so admins can add, change and re-record anything from the website. Nothing is locked: the order is only a suggestion.
   Progress is kept per device. */
(() => {
'use strict';
const L = window.LPT; if (!L) return;
const { t, h, T, go, api, toast, busy, done } = L;

const STR = {
  en: {
    ls_learn: 'Learn', ls_read: 'Read', ls_quiz: 'Quiz', ls_tapLearn: 'Tap every card to hear it.', ls_learnedAll: 'You met them all! ⭐', ls_markLearned: 'I learned them',
    ls_tapHear: 'Tap what you hear', ls_findThis: 'Find this one', ls_whichLetter: 'Which letter is this?', ls_listen: 'Listen again',
    ls_catchIt: 'Catch it!', ls_popAll: 'Pop every balloon with', ls_buildWord: 'Build the word', ls_tapInOrder: 'Tap the pieces in order (right to left).',
    ls_isolated: 'Alone', ls_initial: 'Beginning', ls_medial: 'Middle', ls_final: 'End', ls_noConnect: 'Does not join the next letter',
    ls_readHint: 'Tap a piece to hear it, or ▶ for the whole word. Read every word to finish this lesson.',
    ls_readDone: 'You read them all! ⭐', ls_next: 'Next', ls_nextIsland: 'Next island', ls_again: 'Play again', ls_stageDone: 'Lesson complete!',
    ls_islands: 'Islands', ls_islandOf: (d, n) => `${d} of ${n} done`, ls_islandsDone: (d, n) => `${d} of ${n} islands complete`, ls_soon: 'Coming soon', ls_backMap: 'Map',
    ls_score: (s, n) => `${s} of ${n} right on the first try`, ls_lessonN: n => `Lesson ${n}`,
    ls_gListen: 'Listen & tap', ls_gCatch: 'Catch the running letters', ls_gBalloons: 'Pop the balloons', ls_gBuild: 'Build the word', ls_gShapes: 'Letter shapes quiz',
    ls_kCards: 'Learn (cards)', ls_kReading: 'Read (words)', ls_kForms: 'Letter shapes', ls_kQuiz: 'Quiz game',
    ls_loadFail: 'Could not load the letters. Check the internet connection.', ls_empty: 'The letters journey is being prepared — come back soon!',
    ls_emptyAdmin: 'No content yet. Import the starter pack (.zip), or add your own islands.', ls_oldFormat: 'This is the old letters journey. Import the new starter pack to get the islands.',
    ls_import: 'Import starter pack', ls_importConfirm: 'Importing replaces the whole letters journey. Continue?', ls_importing: (i, n) => `Uploading ${i} of ${n}…`, ls_imported: 'Letters journey imported',
    ls_addIsland: 'Add island', ls_islandSettings: 'Island settings', ls_delIsland: 'Delete island', ls_confirmDelIsland: 'Delete this island with all its lessons?',
    ls_addLesson: 'Add lesson', ls_lessonSettings: 'Lesson settings', ls_delLesson: 'Delete lesson', ls_moveUp: 'Move earlier', ls_moveDown: 'Move later',
    ls_kind: 'Type', ls_game: 'Game', ls_sources: 'Use cards / words from', ls_count: 'Questions', ls_soonFlag: 'Show as “coming soon”', ls_joined: 'Show words joined (not as separate letters)',
    ls_addCard: 'Add card', ls_addRow: 'Add row', ls_addWord: 'Add word', ls_sound: 'Sound', ls_picture: 'Picture', ls_glyph: 'Letter / text', ls_name: 'Name',
    ls_sub: 'Small text (examples)', ls_color: 'Colour', ls_icon: 'Icon (letter or emoji)', ls_mark: 'Big mark (optional)',
    ls_cells: 'Pieces, separated by spaces', ls_word: 'Whole word', ls_style: 'Row colour', ls_noJoin: 'Does not join the next letter',
    ls_record: 'Record', ls_stopRec: 'Stop recording', ls_upload: 'Upload file', ls_removeSound: 'Remove sound',
    ls_newSound: 'New sound ready — press Save', ls_noSound: 'No sound yet', ls_confirmDel: 'Delete this?', ls_saved: 'Saved', ls_needItems: 'Add at least 2 cards or words to the lessons this quiz uses.'
  },
  ar: {
    ls_learn: 'تعلّم', ls_read: 'اقرأ', ls_quiz: 'اختبار', ls_tapLearn: 'اضغط على كل بطاقة لتسمعها.', ls_learnedAll: 'تعرّفت عليها كلها! ⭐', ls_markLearned: 'تعلّمتها',
    ls_tapHear: 'اضغط على ما تسمعه', ls_findThis: 'ابحث عن هذا', ls_whichLetter: 'ما هذا الحرف؟', ls_listen: 'استمع مرة أخرى',
    ls_catchIt: 'امسكه!', ls_popAll: 'فرقع كل بالون عليه', ls_buildWord: 'كوّن الكلمة', ls_tapInOrder: 'اضغط على الأجزاء بالترتيب (من اليمين).',
    ls_isolated: 'منفرد', ls_initial: 'في الأول', ls_medial: 'في الوسط', ls_final: 'في الآخر', ls_noConnect: 'لا يتصل بما بعده',
    ls_readHint: 'اضغط على الجزء لتسمعه، أو ▶ لتسمع الكلمة كاملة. اقرأ كل الكلمات لتنهي الدرس.',
    ls_readDone: 'قرأتها كلها! ⭐', ls_next: 'التالي', ls_nextIsland: 'الجزيرة التالية', ls_again: 'العب مرة أخرى', ls_stageDone: 'أنهيت الدرس!',
    ls_islands: 'الجزر', ls_islandOf: (d, n) => `${d} من ${n}`, ls_islandsDone: (d, n) => `${d} من ${n} جزر مكتملة`, ls_soon: 'قريبًا', ls_backMap: 'الخريطة',
    ls_score: (s, n) => `${s} من ${n} صحيحة من المحاولة الأولى`, ls_lessonN: n => `الدرس ${n}`,
    ls_gListen: 'استمع واضغط', ls_gCatch: 'امسك الحروف الراكضة', ls_gBalloons: 'فرقع البالونات', ls_gBuild: 'كوّن الكلمة', ls_gShapes: 'اختبار أشكال الحروف',
    ls_kCards: 'تعلّم (بطاقات)', ls_kReading: 'اقرأ (كلمات)', ls_kForms: 'أشكال الحروف', ls_kQuiz: 'لعبة اختبار',
    ls_loadFail: 'تعذّر تحميل الحروف. تحقق من الاتصال بالإنترنت.', ls_empty: 'رحلة الحروف قيد التحضير — عد قريبًا!',
    ls_emptyAdmin: 'لا يوجد محتوى بعد. استورد الحزمة الأولية (.zip) أو أضف جزرك الخاصة.', ls_oldFormat: 'هذه رحلة الحروف القديمة. استورد الحزمة الأولية الجديدة للحصول على الجزر.',
    ls_import: 'استيراد الحزمة الأولية', ls_importConfirm: 'الاستيراد يستبدل رحلة الحروف كاملة. المتابعة؟', ls_importing: (i, n) => `جارٍ رفع ${i} من ${n}…`, ls_imported: 'تم استيراد رحلة الحروف',
    ls_addIsland: 'إضافة جزيرة', ls_islandSettings: 'إعدادات الجزيرة', ls_delIsland: 'حذف الجزيرة', ls_confirmDelIsland: 'حذف هذه الجزيرة بكل دروسها؟',
    ls_addLesson: 'إضافة درس', ls_lessonSettings: 'إعدادات الدرس', ls_delLesson: 'حذف الدرس', ls_moveUp: 'نقل إلى الأمام', ls_moveDown: 'نقل إلى الخلف',
    ls_kind: 'النوع', ls_game: 'اللعبة', ls_sources: 'استخدم البطاقات / الكلمات من', ls_count: 'عدد الأسئلة', ls_soonFlag: 'اعرضها كـ «قريبًا»', ls_joined: 'اعرض الكلمات متصلة (لا حروفًا منفصلة)',
    ls_addCard: 'إضافة بطاقة', ls_addRow: 'إضافة صف', ls_addWord: 'إضافة كلمة', ls_sound: 'الصوت', ls_picture: 'الصورة', ls_glyph: 'الحرف / النص', ls_name: 'الاسم',
    ls_sub: 'نص صغير (أمثلة)', ls_color: 'اللون', ls_icon: 'الأيقونة (حرف أو رمز)', ls_mark: 'علامة كبيرة (اختياري)',
    ls_cells: 'الأجزاء مفصولة بمسافات', ls_word: 'الكلمة كاملة', ls_style: 'لون الصف', ls_noJoin: 'لا يتصل بما بعده',
    ls_record: 'تسجيل', ls_stopRec: 'إيقاف التسجيل', ls_upload: 'رفع ملف', ls_removeSound: 'حذف الصوت',
    ls_newSound: 'الصوت الجديد جاهز — اضغط حفظ', ls_noSound: 'لا يوجد صوت بعد', ls_confirmDel: 'حذف هذا؟', ls_saved: 'تم الحفظ', ls_needItems: 'أضف بطاقتين أو كلمتين على الأقل في الدروس التي يستخدمها هذا الاختبار.'
  },
  fi: {
    ls_learn: 'Opi', ls_read: 'Lue', ls_quiz: 'Visa', ls_tapLearn: 'Napauta jokaista korttia kuullaksesi sen.', ls_learnedAll: 'Tapasit ne kaikki! ⭐', ls_markLearned: 'Opin ne',
    ls_tapHear: 'Napauta sitä, minkä kuulet', ls_findThis: 'Etsi tämä', ls_whichLetter: 'Mikä kirjain tämä on?', ls_listen: 'Kuuntele uudelleen',
    ls_catchIt: 'Nappaa se!', ls_popAll: 'Puhkaise jokainen ilmapallo, jossa on', ls_buildWord: 'Rakenna sana', ls_tapInOrder: 'Napauta palat järjestyksessä (oikealta vasemmalle).',
    ls_isolated: 'Yksin', ls_initial: 'Alussa', ls_medial: 'Keskellä', ls_final: 'Lopussa', ls_noConnect: 'Ei liity seuraavaan kirjaimeen',
    ls_readHint: 'Napauta palaa kuullaksesi sen tai ▶ koko sanalle. Lue kaikki sanat suorittaaksesi oppitunnin.',
    ls_readDone: 'Luit ne kaikki! ⭐', ls_next: 'Seuraava', ls_nextIsland: 'Seuraava saari', ls_again: 'Pelaa uudelleen', ls_stageDone: 'Oppitunti suoritettu!',
    ls_islands: 'Saaret', ls_islandOf: (d, n) => `${d}/${n} tehty`, ls_islandsDone: (d, n) => `${d}/${n} saarta valmiina`, ls_soon: 'Tulossa', ls_backMap: 'Kartta',
    ls_score: (s, n) => `${s}/${n} oikein ensimmäisellä yrityksellä`, ls_lessonN: n => `Oppitunti ${n}`,
    ls_gListen: 'Kuuntele ja napauta', ls_gCatch: 'Nappaa juoksevat kirjaimet', ls_gBalloons: 'Puhkaise ilmapallot', ls_gBuild: 'Rakenna sana', ls_gShapes: 'Kirjainmuotojen visa',
    ls_kCards: 'Opi (kortit)', ls_kReading: 'Lue (sanat)', ls_kForms: 'Kirjainten muodot', ls_kQuiz: 'Visapeli',
    ls_loadFail: 'Kirjaimia ei voitu ladata. Tarkista internetyhteys.', ls_empty: 'Kirjainmatkaa valmistellaan — tule pian takaisin!',
    ls_emptyAdmin: 'Ei vielä sisältöä. Tuo aloituspaketti (.zip) tai lisää omia saaria.', ls_oldFormat: 'Tämä on vanha kirjainmatka. Tuo uusi aloituspaketti saadaksesi saaret.',
    ls_import: 'Tuo aloituspaketti', ls_importConfirm: 'Tuonti korvaa koko kirjainmatkan. Jatketaanko?', ls_importing: (i, n) => `Ladataan ${i}/${n}…`, ls_imported: 'Kirjainmatka tuotu',
    ls_addIsland: 'Lisää saari', ls_islandSettings: 'Saaren asetukset', ls_delIsland: 'Poista saari', ls_confirmDelIsland: 'Poistetaanko saari kaikkine oppitunteineen?',
    ls_addLesson: 'Lisää oppitunti', ls_lessonSettings: 'Oppitunnin asetukset', ls_delLesson: 'Poista oppitunti', ls_moveUp: 'Siirrä aiemmaksi', ls_moveDown: 'Siirrä myöhemmäksi',
    ls_kind: 'Tyyppi', ls_game: 'Peli', ls_sources: 'Käytä kortteja / sanoja oppitunneista', ls_count: 'Kysymyksiä', ls_soonFlag: 'Näytä ”tulossa”', ls_joined: 'Näytä sanat yhdessä (ei erillisinä kirjaimina)',
    ls_addCard: 'Lisää kortti', ls_addRow: 'Lisää rivi', ls_addWord: 'Lisää sana', ls_sound: 'Ääni', ls_picture: 'Kuva', ls_glyph: 'Kirjain / teksti', ls_name: 'Nimi',
    ls_sub: 'Pieni teksti (esimerkit)', ls_color: 'Väri', ls_icon: 'Kuvake (kirjain tai emoji)', ls_mark: 'Iso merkki (valinnainen)',
    ls_cells: 'Palat välilyönnein erotettuina', ls_word: 'Koko sana', ls_style: 'Rivin väri', ls_noJoin: 'Ei liity seuraavaan kirjaimeen',
    ls_record: 'Äänitä', ls_stopRec: 'Lopeta äänitys', ls_upload: 'Lataa tiedosto', ls_removeSound: 'Poista ääni',
    ls_newSound: 'Uusi ääni valmis — paina Tallenna', ls_noSound: 'Ei vielä ääntä', ls_confirmDel: 'Poistetaanko?', ls_saved: 'Tallennettu', ls_needItems: 'Lisää vähintään 2 korttia tai sanaa oppitunteihin, joita tämä visa käyttää.'
  }
};
for (const l of Object.keys(STR)) Object.assign(T[l], STR[l]);

const GAMES = { listen: '🎯', catch: '🦋', balloons: '🎈', build: '🧩', shapes: '🔷' };
const KIND_ICON = { cards: '👀', reading: '📖', forms: '🔠', quiz: '🎮' };

/* ───────── content (database) ───────── */
let C = null, loading = null, legacy = false;
const isAdmin = () => !!L.state.isAdmin;
const tx = o => (o && typeof o === 'object') ? (o[L.state.lang] || o.en || o.ar || o.fi || '') : (o || '');
const uid = L.uid;
function migrate(c) {
  if (c && Array.isArray(c.islands)) return c;
  if (c && Array.isArray(c.stops) && c.stops.length) {   // first version: a flat list of stops → one island
    legacy = true;
    return { version: 2, credit: c.credit, sfx: c.sfx || {}, islands: [{ id: 'i-old', title: { en: 'Letters', ar: 'الحروف', fi: 'Kirjaimet' }, icon: 'ا', color: '#2aa8e0', lessons: c.stops.map(s => ({ ...s, icon: s.icon })) }] };
  }
  return { version: 2, islands: [], sfx: {} };
}
async function loadContent(force) {
  if (C && !force) return C;
  if (!loading || force) loading = api.getSettings().then(st => { legacy = false; C = migrate(st && st.letters); loading = null; return C; });
  return loading;
}
async function saveContent() { C.version = 2; delete C.stops; legacy = false; await api.saveSetting('letters', C); }
const allLessons = () => C.islands.flatMap(isl => isl.lessons.map(ls => ({ isl, ls })));
const findLesson = id => allLessons().find(x => x.ls.id === id);

/* ───────── media ───────── */
const urlCache = new Map();
async function mediaUrl(path) { if (!path) return ''; if (!urlCache.has(path)) urlCache.set(path, api.mediaUrl(path)); return urlCache.get(path); }
const player = new Audio(), fx = new Audio();
async function playPath(path, el = player) { const u = await mediaUrl(path); if (!u) return false; try { el.pause(); el.src = u; el.currentTime = 0; await el.play(); } catch (e) {} return true; }
const sfx = ok => C && C.sfx && playPath(ok ? C.sfx.correct : C.sfx.wrong, fx);
const MARKS = /[ً-ْٰ]/;
const NORM = s => String(s || '').normalize('NFC').replace(/[\sـ]+/g, '');
const baseOf = s => { const b = String(s).replace(/[ً-ْٰـ]/g, '').trim(); return ({ 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ء': 'ا', 'ى': 'ي', 'ة': 'ت', 'ؤ': 'و', 'ئ': 'ي' })[b] || b; };
const units = s => { const out = []; for (const ch of String(s).replace(/[\sـ]+/g, '')) { if (MARKS.test(ch) && out.length) out[out.length - 1] += ch; else out.push(ch); } return out; };
function soundIndex() {
  const exact = new Map(), plain = new Map();
  for (const { ls } of allLessons()) for (const c of [...(ls.cards || []), ...(ls.rows || []).filter(r => r.glyph)]) {
    if (!c.audio) continue;
    const n = NORM(c.glyph); if (!exact.has(n)) exact.set(n, c.audio);
    const b = baseOf(c.glyph); if (b.length === 1 && !MARKS.test(c.glyph.replace(/[ـ]/g, '')) && !plain.has(b)) plain.set(b, c.audio);
  }
  return { exact, plain };
}
let SI = null;
function soundsFor(piece) {   // a recording for a piece, or a list of recordings for its letters
  if (!SI) SI = soundIndex();
  const n = NORM(piece);
  if (SI.exact.has(n)) return [SI.exact.get(n)];
  const u = units(piece);
  if (u.length === 1) return [SI.exact.get(NORM(u[0])) || SI.plain.get(baseOf(u[0]))].filter(Boolean);
  return u.flatMap(x => soundsFor(x));
}
function speak(text) {
  if (!('speechSynthesis' in window)) return false;
  try { const v = speechSynthesis.getVoices().find(x => /^ar/i.test(x.lang)); if (!v) return false; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = v.lang; u.voice = v; u.rate = 0.7; speechSynthesis.speak(u); return true; } catch (e) { return false; }
}
async function playSequence(paths) {
  for (const p of paths) { if (!p) continue; await new Promise(res => { player.onended = res; player.onerror = res; playPath(p); setTimeout(res, 1500); }); }
  player.onended = null; player.onerror = null;
}
function playItem(it) {   // card / word / piece
  if (it.audio) return playPath(it.audio);
  if (it.cells && it.cells.length > 1 && speak(it.glyph)) return;
  const s = soundsFor(it.glyph); if (s.length === 1) return playPath(s[0]); if (s.length) return playSequence(s);
}

/* ───────── progress (per device) ───────── */
const PK = 'lpt.letters';
const prog = L.readJSON(PK, {});
const saveProg = () => { try { localStorage.setItem(PK, JSON.stringify(prog)); } catch (e) {} };
const starsFor = (s, n) => !n ? 0 : s / n >= .9 ? 3 : s / n >= .6 ? 2 : s > 0 ? 1 : 0;
const isDone = ls => !!(prog[ls.id] && prog[ls.id].done);
function markDone(ls, stars = 3) { const r = prog[ls.id] || {}; if (!r.done || (r.stars || 0) < stars) { prog[ls.id] = { ...r, done: true, stars: Math.max(stars, r.stars || 0), date: new Date().toISOString() }; saveProg(); } }
function record(ls, score, total) {
  const st = starsFor(score, total), r = prog[ls.id] || {};
  if (!r.stars || st >= r.stars) prog[ls.id] = { ...r, stars: st, best: score, total, done: st >= 1 || !!r.done, date: new Date().toISOString() };
  saveProg();
}
const islandDone = isl => isl.lessons.length > 0 && isl.lessons.every(isDone);
const islandCount = isl => isl.lessons.filter(isDone).length;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ───────── shared admin dialogs ───────── */
let dlg = null;
function dialog(title, build, onSave, wide) {
  if (!dlg) { dlg = h('div', { class: 'modal', hidden: true }); dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-x]')) close(); }); document.body.append(dlg); }
  const close = () => { dlg.hidden = true; dlg.innerHTML = ''; stopRec(); };
  const body = h('div');
  const form = h('form', { class: 'modal-card' + (wide ? ' wide' : '') }, h('h2', { text: title }), body,
    h('div', { class: 'modal-foot' }, h('button', { type: 'button', class: 'btn', 'data-x': '' }, t('cancel')), h('button', { type: 'submit', class: 'btn primary' }, t('save'))));
  form.onsubmit = async e => {
    e.preventDefault();
    try { busy(t('saving')); await onSave(); await saveContent(); SI = null; close(); toast(t('ls_saved')); rerender(); }
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
let rec = null;
function stopRec() { if (rec && rec.state !== 'inactive') rec.stop(); rec = null; }
function soundPicker(curPath) {
  let next = null;
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
async function applyMedia(obj, key, val) {
  if (!val) return;
  const old = obj[key];
  if (val === 'remove') delete obj[key];
  else { const path = `letters/u-${uid()}.${extOf(val, val.name)}`; await api.uploadMedia(path, val); obj[key] = path; }
  if (old && old !== obj[key]) { urlCache.delete(old); api.removeMedia([old]).catch(() => {}); }
}
function adminBtns(...btns) { return isAdmin() ? h('div', { class: 'ls-adm', onclick: e => e.stopPropagation() }, btns) : null; }
const aBtn = (label, title, fn, cls = '') => h('button', { type: 'button', class: 'ls-ab ' + cls, title, onclick: e => { e.stopPropagation(); fn(); } }, label);
async function quickSave(fn) { try { busy(t('saving')); await fn(); await saveContent(); SI = null; rerender(); } catch (e) { toast(e.message, true); } done(); }
function moveIn(list, item, d) { const i = list.indexOf(item), j = i + d; if (i < 0 || j < 0 || j >= list.length) return; list.splice(i, 1); list.splice(j, 0, item); }

function editIsland(isl, isNew) {
  let title, icon, color, soon;
  dialog(isNew ? t('ls_addIsland') : t('ls_islandSettings'), body => {
    title = trioIn(isl.title); icon = textIn(isl.icon); color = colorIn(isl.color); soon = h('input', { type: 'checkbox' }); soon.checked = !!isl.soon;
    body.append(h('p', { class: 'muted small', text: t('ls_name') }), title.box, h('div', { class: 'tf-row' }, fieldRow(t('ls_icon'), icon), fieldRow(t('ls_color'), color)), h('label', { class: 'tcheck' }, soon, t('ls_soonFlag')));
  }, async () => {
    isl.title = title.val(); isl.icon = icon.value.trim() || '🏝️'; isl.color = color.value; isl.soon = soon.checked;
    if (isNew) { isl.id = 'i-' + uid().slice(0, 8); isl.lessons = []; C.islands.push(isl); }
  });
}
function editLesson(isl, ls, isNew) {
  let title, icon, kind, game, count, joined, mark, srcBox;
  dialog(isNew ? t('ls_addLesson') : t('ls_lessonSettings'), body => {
    title = trioIn(ls.title); icon = textIn(ls.icon); mark = textIn(ls.mark);
    kind = h('select', { disabled: !isNew }, ['cards', 'reading', 'forms', 'quiz'].map(k => h('option', { value: k, text: t('ls_k' + k[0].toUpperCase() + k.slice(1)) }))); kind.value = ls.kind || 'cards';
    game = h('select', {}, Object.keys(GAMES).map(g => h('option', { value: g, text: GAMES[g] + ' ' + t('ls_g' + g[0].toUpperCase() + g.slice(1)) }))); game.value = ls.game || 'listen';
    count = h('input', { type: 'number', min: 3, max: 20 }); count.value = ls.count || 8;
    joined = h('input', { type: 'checkbox' }); joined.checked = !!ls.joined;
    const src = new Set(ls.source || []);
    srcBox = h('div', { class: 'chips' }, allLessons().filter(x => x.ls.kind !== 'quiz' && x.ls !== ls).map(x => {
      const cb = h('input', { type: 'checkbox', value: x.ls.id }); cb.checked = src.has(x.ls.id);
      return h('label', { class: 'tcheck chip-cb' }, cb, `${tx(x.isl.title)} › ${tx(x.ls.title)}`);
    }));
    const quizPart = h('div', {}, fieldRow(t('ls_game'), game), fieldRow(t('ls_count'), count), h('p', { class: 'muted small', text: t('ls_sources') }), srcBox);
    const readPart = h('label', { class: 'tcheck' }, joined, t('ls_joined'));
    const sync = () => { quizPart.hidden = kind.value !== 'quiz'; readPart.hidden = kind.value !== 'reading'; };
    kind.onchange = sync; sync();
    body.append(fieldRow(t('ls_kind'), kind), h('p', { class: 'muted small', text: t('ls_name') }), title.box,
      h('div', { class: 'tf-row' }, fieldRow(t('ls_icon'), icon), fieldRow(t('ls_mark'), mark)), readPart, quizPart);
  }, async () => {
    ls.title = title.val(); ls.icon = icon.value.trim(); ls.mark = mark.value.trim();
    if (isNew) { ls.kind = kind.value; ls.id = 'l-' + uid().slice(0, 8); if (ls.kind === 'cards') ls.cards = []; if (ls.kind === 'reading' || ls.kind === 'forms') ls.rows = []; isl.lessons.push(ls); }
    if (ls.kind === 'quiz') { ls.game = game.value; ls.count = Math.max(3, Math.min(20, +count.value || 8)); ls.source = [...srcBox.querySelectorAll('input:checked')].map(i => i.value); }
    if (ls.kind === 'reading') ls.joined = joined.checked;
  }, true);
}
function editCard(ls, c, isNew) {
  let glyph, name, sub, color, snd, pic;
  dialog(isNew ? t('ls_addCard') : '✎ ' + (c.glyph || ''), body => {
    glyph = textIn(c.glyph, { class: 'ls-in-big' }); name = trioIn(c.name); sub = textIn(c.sub); color = colorIn(c.color);
    snd = soundPicker(c.audio); pic = picturePicker(c.img);
    body.append(fieldRow(t('ls_glyph'), glyph), h('p', { class: 'muted small', text: t('ls_name') }), name.box, fieldRow(t('ls_sub'), sub), fieldRow(t('ls_color'), color),
      h('h3', { class: 'sub-h', text: '🔊 ' + t('ls_sound') }), snd.box, h('h3', { class: 'sub-h', text: '🖼 ' + t('ls_picture') }), pic.box);
  }, async () => {
    if (!glyph.value.trim()) throw new Error(t('ls_glyph') + '?');
    c.glyph = glyph.value.trim(); c.name = name.val(); c.sub = sub.value.trim(); c.color = color.value;
    await applyMedia(c, 'audio', snd.get()); await applyMedia(c, 'img', pic.get());
    if (isNew) { c.id = uid(); ls.cards.push(c); }
  }, true);
}
function editFormRow(ls, r, isNew) {
  let glyph, name, f = {}, nj, color, snd;
  dialog(isNew ? t('ls_addRow') : '✎ ' + (r.glyph || ''), body => {
    glyph = textIn(r.glyph, { class: 'ls-in-big' }); name = trioIn(r.name); color = colorIn(r.color); snd = soundPicker(r.audio);
    ['isolated', 'initial', 'medial', 'final'].forEach(p => { f[p] = textIn((r.forms || {})[p], { class: 'ls-in-big', dir: 'rtl' }); });
    nj = h('input', { type: 'checkbox' }); nj.checked = !!r.noConnect;
    body.append(fieldRow(t('ls_glyph'), glyph), name.box, h('div', { class: 'tf-row four' }, ['isolated', 'initial', 'medial', 'final'].map(p => fieldRow(t('ls_' + p), f[p]))),
      h('label', { class: 'tcheck' }, nj, t('ls_noJoin')), fieldRow(t('ls_color'), color), h('h3', { class: 'sub-h', text: '🔊 ' + t('ls_sound') }), snd.box);
  }, async () => {
    if (!glyph.value.trim()) throw new Error(t('ls_glyph') + '?');
    r.glyph = glyph.value.trim(); r.name = name.val(); r.color = color.value; r.noConnect = nj.checked;
    r.forms = {}; Object.keys(f).forEach(p => { r.forms[p] = f[p].value.trim() || r.glyph; });
    await applyMedia(r, 'audio', snd.get());
    if (isNew) { r.id = uid(); ls.rows.push(r); }
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
  if (C.islands.length && !legacy && !confirm(t('ls_importConfirm'))) return;
  const inp = h('input', { type: 'file', accept: '.zip,application/zip' });
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      busy(t('loading'));
      if (!window.JSZip) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'vendor/jszip.min.js'; s.onload = res; s.onerror = rej; document.head.append(s); });
      const zip = await JSZip.loadAsync(f);
      const cj = zip.file('content.json'); if (!cj) throw new Error('content.json missing');
      const content = migrate(JSON.parse(await cj.async('string')));
      const files = Object.values(zip.files).filter(z => !z.dir && z.name !== 'content.json');
      for (let i = 0; i < files.length; i++) {
        document.getElementById('busyText').textContent = t('ls_importing', i + 1, files.length);
        const z = files[i], ext = z.name.split('.').pop().toLowerCase();
        const type = { m4a: 'audio/mp4', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', webm: 'audio/webm', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' }[ext] || 'application/octet-stream';
        await api.uploadMedia(z.name, new Blob([await z.async('arraybuffer')], { type }));
        urlCache.delete(z.name);
      }
      C = content; await saveContent(); SI = null;
      toast(t('ls_imported')); go('#/letters'); rerender();
    } catch (e) { console.error(e); toast(t('error') + e.message, true); }
    done();
  };
  inp.click();
}

/* ═════════ 1) the sea map with islands ═════════ */
const crumbs = (...parts) => h('nav', { class: 'crumbs' }, h('a', { href: '#', 'data-go': 'home', text: t('allTopics') }), parts.flatMap(p => [h('span', { text: '›' }), p]));
function renderMap(root) {
  const real = C.islands.filter(i => !i.soon);
  const doneN = real.filter(islandDone).length;
  const nextIdx = C.islands.findIndex(i => !i.soon && !islandDone(i));
  root.append(crumbs(h('span', { text: t('ls_big') })),
    h('div', { class: 'topic-head', style: '--c:#2aa8e0' },
      h('div', { class: 'topic-badge', text: '🗺️' }),
      h('div', { class: 'topic-head-text' }, h('h1', { text: t('ls_big') }),
        real.length ? h('div', { class: 'progress-line' }, h('div', { class: 'pbar' }, h('div', { class: 'pbar-fill', style: `width:${doneN / real.length * 100}%` })), h('span', { text: t('ls_islandsDone', doneN, real.length) })) : null),
      isAdmin() ? h('div', { class: 'topic-admin' },
        h('button', { type: 'button', class: 'btn', onclick: importPack }, '📦 ', t('ls_import')),
        h('button', { type: 'button', class: 'btn primary', onclick: () => editIsland({ title: {}, icon: '🏝️', color: '#22b573' }, true) }, '＋ ', t('ls_addIsland'))) : null));
  if (legacy && isAdmin()) root.append(h('p', { class: 'ls-note', text: '📦 ' + t('ls_oldFormat') }));
  if (!C.islands.length) { root.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '🏝️' }), h('p', { text: isAdmin() ? t('ls_emptyAdmin') : t('ls_empty') }))); return; }
  const sea = h('div', { class: 'sea' });
  root.append(sea, C.credit ? h('p', { class: 'muted small ls-credit', text: C.credit }) : null);
  const n = C.islands.length, STEP = 230, FIRST = 150, X = [26, 70, 34, 74, 30, 66];
  const pts = C.islands.map((_, i) => ({ x: X[i % X.length], y: FIRST + i * STEP }));
  const H = FIRST + (n - 1) * STEP + 170; sea.style.height = H + 'px';
  let d = '';
  for (let i = 0; i < n - 1; i++) { const a = pts[i], b = pts[i + 1], dy = b.y - a.y; d += `M${a.x} ${a.y} C${a.x} ${a.y + dy * .6} ${b.x} ${b.y - dy * .6} ${b.x} ${b.y} `; }
  sea.insertAdjacentHTML('beforeend', `<svg class="sea-route" viewBox="0 0 100 ${H}" preserveAspectRatio="none" height="${H}" aria-hidden="true"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>`);
  ['🐟', '🐠', '🐬', '🦀', '🐚', '🐳', '🌊', '🐢'].forEach((e, i) => sea.append(h('span', { class: 'sea-deco', style: `left:${i % 2 ? 88 - (i * 7) % 20 : 6 + (i * 9) % 18}%;top:${80 + i * (H - 160) / 8}px;animation-delay:${i * .7}s`, text: e })));
  C.islands.forEach((isl, i) => {
    const p = pts[i], dn = islandDone(isl), cnt = islandCount(isl), tot = isl.lessons.length;
    const el = h('div', { class: 'isle' + (dn ? ' done' : '') + (i === nextIdx ? ' next' : '') + (isl.soon ? ' soon' : ''), style: `left:${p.x}%;top:${p.y}px;--c:${isl.color || '#22b573'}` },
      i === nextIdx ? h('span', { class: 'next-flag', text: '⛵ ' + t('nextUp') }) : null,
      h('button', { type: 'button', class: 'isle-land', onclick: () => go('#/letters/' + isl.id) },
        h('span', { class: 'isle-palm', text: ['🌴', '🌳', '🏰', '🌋', '⛰️', '🏝️'][i % 6] }),
        h('span', { class: 'isle-icon ls-glyph', text: isl.icon || '🏝️' }),
        dn ? h('span', { class: 'isle-check', text: '✓' }) : null,
        tot && !isl.soon ? h('span', { class: 'isle-ring', style: `--p:${cnt / tot * 100}` }, h('b', { text: `${cnt}/${tot}` })) : null),
      h('div', { class: 'isle-label', onclick: () => go('#/letters/' + isl.id) }, h('b', { text: `${i + 1}. ${tx(isl.title)}` }), h('small', { text: isl.soon ? '☁ ' + t('ls_soon') : dn ? '🏆 ' + t('finishAll').replace(/!.*$/, '!') : t('ls_islandOf', cnt, tot) })));
    sea.append(el);
  });
}

/* ═════════ 2) inside an island: the route of lessons ═════════ */
function lessonIcon(ls) { return ls.icon || (ls.kind === 'quiz' ? GAMES[ls.game] || '🎮' : KIND_ICON[ls.kind] || '⭐'); }
function renderIsland(root, isl) {
  const i = C.islands.indexOf(isl), next = C.islands.slice(i + 1).find(x => !x.soon);
  const nextIdx = isl.lessons.findIndex(l => !isDone(l));
  root.append(crumbs(h('a', { href: '#/letters', text: t('ls_big') }), h('span', { text: tx(isl.title) })),
    h('div', { class: 'topic-head', style: `--c:${isl.color}` },
      h('div', { class: 'topic-badge ls-glyph', text: isl.icon }),
      h('div', { class: 'topic-head-text' }, h('h1', { text: `${i + 1}. ${tx(isl.title)}` }),
        isl.lessons.length ? h('div', { class: 'progress-line' }, h('div', { class: 'pbar' }, h('div', { class: 'pbar-fill', style: `width:${islandCount(isl) / isl.lessons.length * 100}%` })), h('span', { text: t('ls_islandOf', islandCount(isl), isl.lessons.length) })) : null),
      isAdmin() ? h('div', { class: 'topic-admin' }, h('button', { type: 'button', class: 'btn primary', onclick: () => editLesson(isl, { title: {} }, true) }, '＋ ', t('ls_addLesson'))) : null),
    isAdmin() ? h('div', { class: 'ls-admin-bar' },
      h('button', { type: 'button', class: 'btn small', onclick: () => editIsland(isl) }, '⚙ ', t('ls_islandSettings')),
      h('button', { type: 'button', class: 'btn small', disabled: i === 0, onclick: () => quickSave(async () => moveIn(C.islands, isl, -1)) }, '↑ ', t('ls_moveUp')),
      h('button', { type: 'button', class: 'btn small', disabled: i === C.islands.length - 1, onclick: () => quickSave(async () => moveIn(C.islands, isl, 1)) }, '↓ ', t('ls_moveDown')),
      h('button', { type: 'button', class: 'btn small danger', onclick: () => { if (confirm(t('ls_confirmDelIsland'))) quickSave(async () => { C.islands.splice(i, 1); go('#/letters'); }); } }, '🗑 ', t('ls_delIsland'))) : null);
  if (isl.soon && !isl.lessons.length) { root.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '☁️' }), h('p', { text: t('ls_soon') }))); return; }
  const wrap = h('div', { class: 'journey isle-route', style: `--c:${isl.color}` });
  root.append(wrap);
  const n = isl.lessons.length, STEP = 160, FIRST = 190, X = [30, 52, 72, 50];
  const start = { x: 50, y: 70 }, pts = isl.lessons.map((_, k) => ({ x: X[k % 4], y: FIRST + k * STEP })), end = { x: X[n % 4], y: FIRST + n * STEP - 25 };
  const H = end.y + 95; wrap.style.height = H + 'px';
  const chain = [start, ...pts, end];
  const seg = (a, b) => { const dy = b.y - a.y; return `M${a.x} ${a.y} C${a.x} ${a.y + dy * .55} ${b.x} ${b.y - dy * .55} ${b.x} ${b.y}`; };
  let edge = '', roads = '';
  for (let k = 0; k < chain.length - 1; k++) {
    const p = seg(chain[k], chain[k + 1]); edge += p + ' ';
    roads += `<path class="road${(k < n ? isDone(isl.lessons[k]) : nextIdx === -1) ? ' done' : ''}" d="${p}" vector-effect="non-scaling-stroke"/>`;
  }
  wrap.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" height="${H}" aria-hidden="true"><path class="road-edge" d="${edge}" vector-effect="non-scaling-stroke"/>${roads}<path class="road-dash" d="${edge}" vector-effect="non-scaling-stroke"/></svg>`);
  const decos = document.documentElement.dataset.theme === 'dark' ? ['⭐', '🌙', '✨', '🪐'] : ['🌴', '🐚', '🌺', '🦜', '🥥', '🦀'];
  pts.forEach((p, k) => { const side = p.x < 45 ? 84 : p.x > 55 ? 14 : (k % 2 ? 88 : 12); wrap.append(h('div', { class: 'deco', style: `left:${side}%;top:${p.y + 10}px`, text: decos[k % decos.length] })); });
  wrap.append(h('div', { class: 'milestone', style: `left:${start.x}%;top:${start.y}px` }, h('span', { class: 'mk', text: '⛵' }), h('span', { class: 'ml', text: t('start') })));
  wrap.append(h('div', { class: 'milestone', style: `left:${end.x}%;top:${end.y}px` }, h('span', { class: 'mk', text: nextIdx === -1 ? '🏆' : '🏁' }), h('span', { class: 'ml', text: nextIdx === -1 ? t('finishAll') : '…' })));
  isl.lessons.forEach((ls, k) => {
    const p = pts[k], dn = isDone(ls), r = prog[ls.id];
    const open = () => go(`#/letters/${isl.id}/${ls.id}`);
    wrap.append(h('div', { class: 'stop' + (dn ? ' done' : '') + (k === nextIdx ? ' next' : '') + (ls.kind === 'quiz' ? ' is-game' : ''), style: `left:${p.x}%;top:${p.y}px` },
      k === nextIdx ? h('span', { class: 'next-flag', text: t('nextUp') }) : null,
      h('button', { class: 'stop-btn', type: 'button', onclick: open }, h('div', { class: 'stop-inner ls-glyph', text: lessonIcon(ls) }), h('span', { class: 'stop-num', text: k + 1 }), dn ? h('span', { class: 'stop-star', text: '✓' }) : null),
      h('div', { class: 'stop-label', onclick: open }, h('span', { text: tx(ls.title) }), h('small', { text: r && r.stars ? '⭐'.repeat(r.stars) : ls.kind === 'quiz' ? t('ls_quiz') : ls.kind === 'reading' ? t('ls_read') : t('ls_learn') }))));
  });
  if (next) root.append(h('div', { class: 'quiz-foot', style: 'justify-content:center' }, h('button', { type: 'button', class: 'btn primary', onclick: () => go('#/letters/' + next.id) }, '⛵ ', t('ls_nextIsland'), ': ', tx(next.title), ' →')));
}

/* ═════════ 3) a lesson ═════════ */
function renderLesson(root, isl, ls) {
  const k = isl.lessons.indexOf(ls);
  const nxt = isl.lessons[k + 1], nextIsl = C.islands.slice(C.islands.indexOf(isl) + 1).find(x => !x.soon);
  const goNext = () => go(nxt ? `#/letters/${isl.id}/${nxt.id}` : nextIsl ? '#/letters/' + nextIsl.id : '#/letters');
  const nextBtn = () => h('button', { type: 'button', class: 'btn primary', onclick: goNext }, nxt ? t('ls_next') + ': ' + tx(nxt.title) : nextIsl ? '⛵ ' + t('ls_nextIsland') : '🏆', ' →');
  root.append(crumbs(h('a', { href: '#/letters', text: t('ls_big') }), h('a', { href: '#/letters/' + isl.id, text: tx(isl.title) }), h('span', { text: tx(ls.title) })),
    h('div', { class: 'topic-head', style: `--c:${isl.color}` },
      h('div', { class: 'topic-badge ls-glyph', text: lessonIcon(ls) }),
      h('div', { class: 'topic-head-text' }, h('small', { class: 'ls-kicker', text: t('ls_lessonN', k + 1) + ' · ' + (ls.kind === 'quiz' ? t('ls_g' + (ls.game || 'listen')[0].toUpperCase() + (ls.game || 'listen').slice(1)) : ls.kind === 'reading' ? t('ls_read') : t('ls_learn')) }),
        h('h1', { text: tx(ls.title) }), ls.mark ? h('div', { class: 'ls-mark', text: ls.mark }) : null)),
    isAdmin() ? h('div', { class: 'ls-admin-bar' },
      h('button', { type: 'button', class: 'btn small', onclick: () => editLesson(isl, ls) }, '⚙ ', t('ls_lessonSettings')),
      h('button', { type: 'button', class: 'btn small', disabled: k === 0, onclick: () => quickSave(async () => moveIn(isl.lessons, ls, -1)) }, '↑ ', t('ls_moveUp')),
      h('button', { type: 'button', class: 'btn small', disabled: k === isl.lessons.length - 1, onclick: () => quickSave(async () => moveIn(isl.lessons, ls, 1)) }, '↓ ', t('ls_moveDown')),
      h('button', { type: 'button', class: 'btn small danger', onclick: () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { isl.lessons.splice(k, 1); go('#/letters/' + isl.id); }); } }, '🗑 ', t('ls_delLesson'))) : null);
  const body = h('div', { class: 'ls-body', style: `--c:${isl.color}` }); root.append(body);
  if (ls.kind === 'cards') renderCards(body, isl, ls);
  else if (ls.kind === 'forms') renderForms(body, isl, ls);
  else if (ls.kind === 'reading') renderReading(body, isl, ls);
  else renderGame(body, isl, ls, nextBtn);
  if (ls.kind !== 'quiz') body.append(h('div', { class: 'quiz-foot', style: 'justify-content:center' }, nextBtn()));
}

function cardEl(isl, ls, c, onTap) {
  const pic = c.img ? h('img', { class: 'ls-img', alt: '' }) : null;
  if (pic) mediaUrl(c.img).then(u => { pic.src = u; });
  const el = h('div', { class: 'ls-card' + (c.audio ? '' : ' mute'), role: 'button', tabindex: '0', style: `--lc:${c.color || isl.color}` },
    pic, h('span', { class: 'ls-big', text: c.glyph }), tx(c.name) ? h('b', { text: tx(c.name) }) : null, c.sub ? h('small', { text: c.sub }) : null,
    adminBtns(aBtn('✎', t('edit'), () => editCard(ls, c)),
      aBtn('🗑', t('delete'), () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { ls.cards.splice(ls.cards.indexOf(c), 1); if (c.audio) api.removeMedia([c.audio]).catch(() => {}); }); }, 'danger')));
  const tap = () => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); playItem(c); onTap && onTap(el); };
  el.onclick = tap; el.onkeydown = e => { if (e.key === 'Enter') tap(); };
  return el;
}
function renderCards(body, isl, ls) {
  const seen = new Set((prog[ls.id] && prog[ls.id].seen) || []);
  const status = h('p', { class: 'tool-info' });
  const upd = () => {
    const tot = (ls.cards || []).length;
    status.textContent = isDone(ls) ? t('ls_learnedAll') : `${[...seen].filter(id => ls.cards.some(c => c.id === id)).length} / ${tot}`;
    prog[ls.id] = { ...(prog[ls.id] || {}), seen: [...seen] };
    if (tot && ls.cards.every(c => seen.has(c.id)) && !isDone(ls)) { markDone(ls); sfx(true); status.textContent = t('ls_learnedAll'); }
    saveProg();
  };
  body.append(h('p', { class: 'muted', text: t('ls_tapLearn') }), status,
    h('div', { class: 'ls-grid' }, (ls.cards || []).map(c => { const el = cardEl(isl, ls, c, e => { seen.add(c.id); e.classList.add('seen'); upd(); }); if (seen.has(c.id)) el.classList.add('seen'); return el; }),
      isAdmin() ? h('button', { type: 'button', class: 'ls-card ls-add', onclick: () => editCard(ls, { name: {} }, true) }, h('span', { class: 'ls-big', text: '＋' }), h('b', { text: t('ls_addCard') })) : null),
    !isDone(ls) ? h('div', { style: 'text-align:center' }, h('button', { type: 'button', class: 'btn small', onclick: () => { markDone(ls); rerender(); } }, '✓ ', t('ls_markLearned'))) : null);
  upd();
}
function renderForms(body, isl, ls) {
  const POS = ['isolated', 'initial', 'medial', 'final'];
  body.append(h('p', { class: 'muted', text: t('ls_tapLearn') }), h('div', { class: 'ls-forms' },
    h('div', { class: 'lf-row lf-head' }, h('span'), POS.map(p => h('span', { text: t('ls_' + p) }))),
    (ls.rows || []).map(r => h('div', { class: 'lf-row', style: `--lc:${r.color || isl.color}` },
      h('button', { type: 'button', class: 'lf-name', onclick: () => playItem(r) }, h('b', { text: r.glyph }), h('small', { text: tx(r.name) }),
        adminBtns(aBtn('✎', t('edit'), () => editFormRow(ls, r)), aBtn('🗑', t('delete'), () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { ls.rows.splice(ls.rows.indexOf(r), 1); }); }, 'danger'))),
      POS.map(p => h('button', { type: 'button', class: 'lf-cell', onclick: () => playItem(r), text: (r.forms || {})[p] || '' })),
      r.noConnect ? h('em', { class: 'lf-note', text: '⛔ ' + t('ls_noConnect') }) : null)),
    isAdmin() ? h('button', { type: 'button', class: 'btn', onclick: () => editFormRow(ls, { name: {}, forms: {} }, true) }, '＋ ', t('ls_addRow')) : null),
    !isDone(ls) ? h('div', { style: 'text-align:center' }, h('button', { type: 'button', class: 'btn small', onclick: () => { markDone(ls); rerender(); } }, '✓ ', t('ls_markLearned'))) : null);
}
function renderReading(body, isl, ls) {
  const rows = ls.rows || (ls.rows = []);
  const readSet = new Set((prog[ls.id] && prog[ls.id].read) || []);
  const total = rows.reduce((n, r) => n + r.groups.length, 0);
  const status = h('p', { class: 'tool-info' });
  const upd = () => {
    status.textContent = total && readSet.size >= total ? t('ls_readDone') : `${[...readSet].length} / ${total}`;
    prog[ls.id] = { ...(prog[ls.id] || {}), read: [...readSet] };
    if (total && rows.every(r => r.groups.every(g => readSet.has(g.id))) && !isDone(ls)) { markDone(ls); sfx(true); }
    saveProg();
  };
  body.append(h('p', { class: 'muted', text: t('ls_readHint') }), status);
  const STY = ['green', 'pink', 'gray', 'blue'];
  rows.forEach(row => {
    body.append(h('div', { class: 'lr-row lr-' + (row.style || 'gray') + (ls.joined ? ' joined' : '') },
      row.groups.map(g => {
        const blk = h('div', { class: 'lr-group' + (readSet.has(g.id) ? ' read' : '') });
        const mark = () => { readSet.add(g.id); blk.classList.add('read'); upd(); };
        const word = h('button', { type: 'button', class: 'lr-word', onclick: () => { blk.classList.add('playing'); setTimeout(() => blk.classList.remove('playing'), 1400); playItem({ glyph: g.text, cells: g.cells, audio: g.audio }); mark(); } },
          g.audio ? '🔊 ' : '▶ ', h('span', { text: g.text, dir: 'rtl' }));
        const cells = h('div', { class: 'lr-cells', dir: 'rtl' }, g.cells.map(c => h('button', { type: 'button', class: 'lr-cell', text: c, onclick: () => { playItem({ glyph: c }); mark(); } })));
        blk.append(...(ls.joined ? [word, cells] : [cells, word]),
          adminBtns(aBtn('✎', t('edit'), () => editWord(row, g)), aBtn('🗑', t('delete'), () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { row.groups.splice(row.groups.indexOf(g), 1); if (g.audio) api.removeMedia([g.audio]).catch(() => {}); }); }, 'danger')));
        return blk;
      }),
      isAdmin() ? h('div', { class: 'lr-adm' },
        h('button', { type: 'button', class: 'btn small', onclick: () => editWord(row, { cells: [] }, true) }, '＋ ', t('ls_addWord')),
        h('button', { type: 'button', class: 'btn small', title: t('ls_style'), onclick: () => quickSave(async () => { row.style = STY[(STY.indexOf(row.style) + 1) % STY.length]; }) }, '🎨'),
        h('button', { type: 'button', class: 'btn small danger', onclick: () => { if (confirm(t('ls_confirmDel'))) quickSave(async () => { rows.splice(rows.indexOf(row), 1); }); } }, '🗑')) : null));
  });
  if (isAdmin()) body.append(h('button', { type: 'button', class: 'btn', onclick: () => quickSave(async () => { rows.push({ id: uid(), style: STY[rows.length % STY.length], groups: [] }); }) }, '＋ ', t('ls_addRow')));
  upd();
}

/* ═════════ 4) quiz games ═════════ */
function itemsOf(ls) {
  const out = [];
  for (const id of ls.source || []) {
    const f = findLesson(id); if (!f) continue;
    const col = f.isl.color;
    if (f.ls.kind === 'cards') (f.ls.cards || []).forEach(c => c.glyph && out.push({ glyph: c.glyph, audio: c.audio, color: c.color || col }));
    if (f.ls.kind === 'reading') (f.ls.rows || []).forEach(r => r.groups.forEach(g => out.push({ glyph: g.text, cells: g.cells, audio: g.audio, color: col })));
    if (f.ls.kind === 'forms') (f.ls.rows || []).forEach(r => out.push({ glyph: r.glyph, forms: r.forms, audio: r.audio, color: r.color || col }));
  }
  const seen = new Set(); return out.filter(x => { const k = NORM(x.glyph); if (seen.has(k)) return false; seen.add(k); return true; });
}
function renderGame(body, isl, ls, nextBtn) {
  let items = itemsOf(ls);
  const game = ls.game || 'listen';
  if (game === 'build') items = items.filter(x => x.cells && x.cells.length >= 2);
  if (game === 'shapes') items = items.filter(x => x.forms);
  if (items.length < 2) { body.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '🎮' }), h('p', { text: isAdmin() ? t('ls_needItems') : t('ls_empty') }))); return; }
  const rounds = Math.min(ls.count || 8, game === 'build' ? items.length : Math.max(items.length, 3));
  const box = h('div', { class: 'ls-quiz game-' + game }); body.append(box);
  let i = 0, firstTry = 0, missed = false;
  const targets = shuffle(items).concat(shuffle(items)).slice(0, rounds);
  const bar = () => h('div', { class: 'pbar ls-qbar' }, h('div', { class: 'pbar-fill', style: `width:${i / rounds * 100}%` }));
  const right = (fn) => { if (!missed) firstTry++; sfx(true); setTimeout(() => { i++; fn(); }, 900); };
  const wrong = el => { missed = true; sfx(false); if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake', 'wrong'); } };
  const opts = (q, n) => shuffle([q, ...shuffle(items.filter(x => NORM(x.glyph) !== NORM(q.glyph))).slice(0, n - 1)]);
  const promptFor = q => {
    const hasSound = !!(q.audio || soundsFor(q.glyph).length);
    return h('div', { class: 'ls-prompt' },
      hasSound ? h('button', { type: 'button', class: 'ls-speaker', title: t('ls_listen'), onclick: () => playItem(q) }, '🔊') : null,
      game === 'listen' && hasSound ? null : h('div', { class: 'ls-target ls-glyph', text: q.glyph }),
      h('p', { text: game === 'listen' ? (hasSound ? t('ls_tapHear') : t('ls_findThis')) : game === 'catch' ? t('ls_catchIt') : game === 'balloons' ? t('ls_popAll') : t('ls_buildWord') }));
  };
  const step = () => {
    box.innerHTML = ''; missed = false;
    if (i >= rounds) return finish();
    const q = targets[i];
    box.append(bar(), h('div', { class: 'ls-count', text: `${i + 1} / ${rounds}` }));
    if (game === 'listen') {
      box.append(promptFor(q), h('div', { class: 'ls-opts' }, opts(q, 4).map(o => {
        const b = h('button', { type: 'button', class: 'ls-opt', style: `--lc:${o.color}`, text: o.glyph });
        b.onclick = () => { if (box.classList.contains('locked')) return; if (o === q) { b.classList.add('right'); box.classList.add('locked'); right(() => { box.classList.remove('locked'); step(); }); } else { wrong(b); b.disabled = true; } };
        return b;
      })));
      setTimeout(() => playItem(q), 300);
    } else if (game === 'shapes') {
      const pos = shuffle(['initial', 'medial', 'final'])[0];
      box.append(h('div', { class: 'ls-prompt' }, h('div', { class: 'ls-show', text: q.forms[pos] }), h('small', { text: t('ls_' + pos) }), h('p', { text: t('ls_whichLetter') })),
        h('div', { class: 'ls-opts' }, opts(q, 4).map(o => {
          const b = h('button', { type: 'button', class: 'ls-opt', style: `--lc:${o.color}`, text: o.glyph });
          b.onclick = () => { if (box.classList.contains('locked')) return; if (o === q) { b.classList.add('right'); box.classList.add('locked'); playItem(q); right(() => { box.classList.remove('locked'); step(); }); } else { wrong(b); b.disabled = true; } };
          return b;
        })));
    } else if (game === 'catch' || game === 'balloons') {
      const area = h('div', { class: 'game-area ' + game });
      const want = game === 'balloons' ? 2 + Math.floor(Math.random() * 2) : 1;
      const decoys = opts(q, Math.min(game === 'balloons' ? 5 : 6, items.length)).filter(x => x !== q);
      const pool = shuffle([...Array(want).fill(q), ...decoys, ...(game === 'balloons' ? decoys.slice(0, 2) : [])]);
      let got = 0;
      pool.forEach((o, k) => {
        const dur = (game === 'catch' ? 6 : 7) + Math.random() * 4, lane = (k + .5) / pool.length * 100;
        const b = h('button', { type: 'button', class: 'runner', style: `--lc:${o.color};--d:${dur}s;--dl:${-Math.random() * dur}s;${game === 'catch' ? `top:${8 + (lane * .78)}%` : `left:${4 + lane * .88}%`}` },
          h('span', { class: 'ls-glyph', text: o.glyph }), game === 'catch' ? h('i', { text: ['🦶', '🐾', '💨'][k % 3] }) : h('i', { class: 'string' }));
        b.onclick = () => {
          if (b.classList.contains('popped')) return;
          if (o === q) { b.classList.add('popped'); sfx(true); got++; if (got >= want) { if (!missed) firstTry++; setTimeout(() => { i++; step(); }, 700); } }
          else wrong(b);
        };
        area.append(b);
      });
      box.append(promptFor(q), area);
      setTimeout(() => playItem(q), 300);
    } else if (game === 'build') {
      const slots = h('div', { class: 'build-slots', dir: 'rtl' }, q.cells.map(() => h('span', { class: 'slot' })));
      let pos = 0;
      const tiles = h('div', { class: 'build-tiles', dir: 'rtl' }, shuffle(q.cells.map((c, k) => ({ c, k }))).map(({ c, k }) => {
        const b = h('button', { type: 'button', class: 'ls-opt tile', style: `--lc:${q.color}`, text: c });
        b.onclick = () => {
          if (b.disabled) return;
          if (NORM(c) === NORM(q.cells[pos])) {
            slots.children[pos].textContent = c; slots.children[pos].classList.add('filled'); b.disabled = true; b.classList.add('used'); pos++;
            playItem({ glyph: c });
            if (pos >= q.cells.length) { box.querySelector('.ls-target')?.classList.add('win'); setTimeout(() => playItem(q), 400); right(step); }
          } else wrong(b);
        };
        return b;
      }));
      box.append(promptFor(q), h('p', { class: 'muted small', text: t('ls_tapInOrder') }), slots, tiles);
    }
  };
  const finish = () => {
    record(ls, firstTry, rounds);
    const st = starsFor(firstTry, rounds);
    box.append(h('div', { class: 'quiz-result' },
      h('div', { class: 'quiz-stars' }, [1, 2, 3].map(k => h('span', { class: k <= st ? 'on' : '', style: `animation-delay:${k * .18}s`, text: '★' }))),
      h('h3', { text: st ? t('ls_stageDone') : t('quizAgain') }), h('p', { class: 'muted', text: t('ls_score', firstTry, rounds) }),
      h('div', { class: 'quiz-foot', style: 'justify-content:center' },
        h('button', { type: 'button', class: 'btn', onclick: () => { box.remove(); renderGame(body, isl, ls, nextBtn); } }, '↺ ', t('ls_again')), nextBtn())));
    if (st >= 2) { const burst = h('div', { class: 'quiz-confetti' }); ['⭐', '🎉', '✨', '🌟', '🎈'].forEach((c, k) => { for (let j = 0; j < 5; j++) burst.append(h('span', { text: c, style: `left:${(k * 5 + j) * 4}%;animation-delay:${Math.random() * .8}s` })); }); box.append(burst); }
  };
  step();
}

/* ── entry point (app.js calls this for #/letters[/<island>[/<lesson>]]) ── */
let rerender = () => {};
window.LPT_LETTERS = {
  async render(root, stage, force, sub) {
    const r = L.state.route || {};
    stage = stage ?? r.stage; sub = sub ?? r.sub;
    const key = [stage || '', sub || '', L.state.lang, document.documentElement.dataset.theme, isAdmin()].join('|');
    if (!force && root.dataset.key === key && root.childElementCount) return;   // keep a running game when the app re-renders
    root.dataset.key = key;
    rerender = () => window.LPT_LETTERS.render(root, L.state.route.stage, true, L.state.route.sub);
    if (!C) { root.innerHTML = ''; root.append(h('div', { class: 'spinner' })); }
    try { await loadContent(); }
    catch (e) { root.innerHTML = ''; root.append(h('div', { class: 'empty' }, h('div', { class: 'empty-icon', text: '📡' }), h('p', { text: t('ls_loadFail') }))); return; }
    root.innerHTML = '';
    const isl = C.islands.find(x => x.id === stage);
    const ls = isl && isl.lessons.find(x => x.id === sub);
    if (isl && ls) renderLesson(root, isl, ls);
    else if (isl) renderIsland(root, isl);
    else { const f = stage && findLesson(stage); if (f) { go(`#/letters/${f.isl.id}/${f.ls.id}`); return; } renderMap(root); }
  }
};
if (L.state.route && L.state.route.view === 'letters') window.LPT_LETTERS.render(document.getElementById('lettersView'));
})();
