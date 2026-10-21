/* Lesson Present Tool — shared lesson library
   Static site: works on Vercel / Netlify / GitHub Pages.
   Data: Supabase (online) or IndexedDB (demo mode, when config.js is empty). */
(() => {
'use strict';

const CFG = window.APP_CONFIG || {};
const LANGS = ['ar', 'en', 'fi'];
const LANG_NAMES = { ar: 'العربية', en: 'English', fi: 'Suomi' };
const BUCKET = 'lessons';
const BRAND = {
  name: { ar: 'أداة عرض الدروس', en: 'Lesson Present Tool', fi: 'Oppituntien esitystyökalu' },
  tagline: { ar: 'تعلّم واستكشف وانمُ — درسًا بعد درس', en: 'Learn, explore and grow — one lesson at a time', fi: 'Opi, tutki ja kasva – oppitunti kerrallaan' }
};
const TOPIC_COLORS = ['#5b4fe0', '#ff8a3d', '#22b573', '#ff6b9a', '#2aa8e0', '#e0a400', '#9b59d0', '#e2504a'];
const TOPIC_ICONS = ['🌙', '📜', '🕌', '🌿', '⭐', '🐪', '🤲', '📖', '💛', '🌍', '🦁', '🚀', '🌈', '🐳', '🏰', '🎨', '🔤', '🔢', '🌱', '🧕'];

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('vendor/pdf.worker.min.js', document.baseURI).href;
}

/* ───────────────────────── Interface text ───────────────────────── */
const T = {
  en: {
    record: 'Record', stop: 'Stop', demoTitle: 'Demo mode',
    demoText: 'Changes are saved only in this browser. Add your Supabase keys in config.js to put the site online.',
    topicsTitle: 'Lesson topics', topicsSub: 'Choose a folder to see its lessons.',
    newTopic: 'New topic', editTopic: 'Edit topic', noTopics: 'No topics yet.',
    noTopicsAdmin: 'Create the first folder, for example “Morals” or “Stories”.',
    allTopics: 'All topics', newLesson: 'New lesson', editLesson: 'Edit lesson',
    noLessons: 'No lessons in this folder yet.',
    editorSub: 'Drag slides to reorder them. Changes apply to everyone after you press Save.',
    present: 'Present', save: 'Save', addPages: 'Add pages from PDF', replacePdf: 'Replace PDF',
    removePdf: 'Remove this language', noPdfForLang: 'No PDF for this language yet.', uploadPdf: 'Upload PDF',
    translateHint: 'Type the name in one language — the other two are translated automatically. You can correct them.',
    cancel: 'Cancel', topic: 'Topic', pdfOptional: 'Each language PDF is optional — you can add the others later.',
    adminLogin: 'Admin sign in', email: 'Email', password: 'Password', signIn: 'Sign in', signOut: 'Sign out',
    admin: 'Admin', fullscreen: 'Full screen (F)', close: 'Close (Esc)', edit: 'Edit', editSlides: 'Arrange slides',
    delete: 'Delete', download: 'Download', translate: 'Translate', demoAdmin: 'Demo admin',
    lessons: n => n === 1 ? '1 lesson' : `${n} lessons`,
    slides: n => n === 1 ? '1 slide' : `${n} slides`,
    notIn: l => `Not available in ${LANG_NAMES[l]} yet`,
    confirmDeleteTopic: s => `Delete the folder “${s}” and all its lessons? This cannot be undone.`,
    confirmDeleteLesson: s => `Delete the lesson “${s}” in all languages? This cannot be undone.`,
    confirmRemovePdf: l => `Remove the ${LANG_NAMES[l]} PDF from this lesson?`,
    unsaved: 'Unsaved changes — press Save to publish them.',
    leaveUnsaved: 'You have unsaved slide changes. Leave without saving?',
    saved: 'Saved', saving: 'Saving…', uploading: 'Uploading PDF…', translating: 'Translating…', building: 'Building the PDF…',
    translateFailed: 'Automatic translation is unavailable right now — please type the other names yourself.',
    nameRequired: 'Please enter a name in at least one language.',
    recSaved: 'Recording saved to your downloads', recCancelled: 'Recording cancelled',
    recUnsupported: 'Screen recording works in Chrome, Edge or Firefox on a computer.',
    micDenied: 'Microphone not allowed — recording without your voice.',
    loading: 'Loading…', notPdf: 'That file is not a readable PDF.',
    dropPdf: 'Drop a PDF or click', currentPdf: n => `Current: ${n} slides — click to replace`,
    error: 'Something went wrong: ', signInFailed: 'Sign in failed. Check the email and password.',
    notAdmin: 'Signed in, but this account is not an admin.', deleted: 'Deleted', removeSlide: 'Remove slide',
    slide: 'Slide', added: 'new', slideStatus: (n, d) => `${n} slides` + (d ? ' · ' : ''),
    heroTitle: 'Let’s learn something new today!', heroSub: 'Pick an adventure and follow the path, one lesson at a time.',
    statTopics: 'adventures', statLessons: 'lessons', statDone: 'stars earned',
    continueTitle: 'Continue your journey', continueGo: 'Keep going', chooseAdventure: 'Choose your adventure',
    reorder: 'Reorder', reorderDone: 'Done', chooseIcon: 'Icon', videosTitle: 'YouTube videos (optional)',
    watchVideo: 'Watch video', markDone: 'Mark as done', markNotDone: 'Not done yet',
    doneOf: (d, n) => `${d} of ${n} done`, lessonN: n => `Lesson ${n}`,
    start: 'Start', finishAll: 'Journey complete! 🎉', finishMore: 'More adventures coming',
    nextUp: 'Next!', doneLabel: '✓ Done', soonIn: l => `Coming soon in ${LANG_NAMES[l]}`,
    ytInvalid: 'That doesn’t look like a YouTube link.', lessonComplete: 'Great job! ⭐',
    themeDark: 'Dark mode', themeLight: 'Light mode', availableIn: 'Available in:',
    needsUpgrade: 'To save video links, run supabase/upgrade-v2.sql once in Supabase (see README).',
    loadFailed: 'Could not load lessons. Check your internet connection.'
  },
  ar: {
    record: 'تسجيل', stop: 'إيقاف', demoTitle: 'وضع التجربة',
    demoText: 'التغييرات محفوظة في هذا المتصفح فقط. أضف مفاتيح Supabase في ملف config.js لنشر الموقع على الإنترنت.',
    topicsTitle: 'مواضيع الدروس', topicsSub: 'اختر مجلدًا لعرض دروسه.',
    newTopic: 'موضوع جديد', editTopic: 'تعديل الموضوع', noTopics: 'لا توجد مواضيع بعد.',
    noTopicsAdmin: 'أنشئ أول مجلد، مثل «الأخلاق» أو «القصص».',
    allTopics: 'كل المواضيع', newLesson: 'درس جديد', editLesson: 'تعديل الدرس',
    noLessons: 'لا توجد دروس في هذا المجلد بعد.',
    editorSub: 'اسحب الشرائح لإعادة ترتيبها. تظهر التغييرات للجميع بعد الضغط على حفظ.',
    present: 'عرض', save: 'حفظ', addPages: 'إضافة صفحات من PDF', replacePdf: 'استبدال الملف',
    removePdf: 'حذف هذه اللغة', noPdfForLang: 'لا يوجد ملف PDF لهذه اللغة بعد.', uploadPdf: 'رفع ملف PDF',
    translateHint: 'اكتب الاسم بلغة واحدة، وتُترجم اللغتان الأخريان تلقائيًا. يمكنك تصحيحهما.',
    cancel: 'إلغاء', topic: 'الموضوع', pdfOptional: 'ملف كل لغة اختياري، ويمكنك إضافة البقية لاحقًا.',
    adminLogin: 'دخول المشرفين', email: 'البريد الإلكتروني', password: 'كلمة المرور', signIn: 'دخول', signOut: 'خروج',
    admin: 'المشرف', fullscreen: 'ملء الشاشة (F)', close: 'إغلاق (Esc)', edit: 'تعديل', editSlides: 'ترتيب الشرائح',
    delete: 'حذف', download: 'تنزيل', translate: 'ترجمة', demoAdmin: 'مشرف تجريبي',
    lessons: n => n === 1 ? 'درس واحد' : n === 2 ? 'درسان' : (n >= 3 && n <= 10) ? `${n} دروس` : `${n} درسًا`,
    slides: n => n === 1 ? 'شريحة واحدة' : n === 2 ? 'شريحتان' : (n >= 3 && n <= 10) ? `${n} شرائح` : `${n} شريحة`,
    notIn: l => `غير متوفر بـ${LANG_NAMES[l]} بعد`,
    confirmDeleteTopic: s => `حذف المجلد «${s}» وكل دروسه؟ لا يمكن التراجع.`,
    confirmDeleteLesson: s => `حذف الدرس «${s}» بكل اللغات؟ لا يمكن التراجع.`,
    confirmRemovePdf: l => `حذف ملف ${LANG_NAMES[l]} من هذا الدرس؟`,
    unsaved: 'تغييرات غير محفوظة — اضغط حفظ لنشرها.',
    leaveUnsaved: 'لديك تغييرات غير محفوظة في الشرائح. هل تغادر دون حفظ؟',
    saved: 'تم الحفظ', saving: 'جارٍ الحفظ…', uploading: 'جارٍ رفع الملف…', translating: 'جارٍ الترجمة…', building: 'جارٍ إنشاء الملف…',
    translateFailed: 'الترجمة التلقائية غير متاحة الآن — اكتب الأسماء الأخرى بنفسك.',
    nameRequired: 'اكتب الاسم بلغة واحدة على الأقل.',
    recSaved: 'حُفظ التسجيل في مجلد التنزيلات', recCancelled: 'أُلغي التسجيل',
    recUnsupported: 'تسجيل الشاشة يعمل في Chrome أو Edge أو Firefox على الحاسوب.',
    micDenied: 'لم يُسمح بالميكروفون — يتم التسجيل بدون صوتك.',
    loading: 'جارٍ التحميل…', notPdf: 'هذا الملف ليس PDF صالحًا.',
    dropPdf: 'أفلت ملف PDF أو انقر', currentPdf: n => `الحالي: ${n} شريحة — انقر للاستبدال`,
    error: 'حدث خطأ: ', signInFailed: 'فشل الدخول. تحقق من البريد وكلمة المرور.',
    notAdmin: 'تم الدخول، لكن هذا الحساب ليس مشرفًا.', deleted: 'تم الحذف', removeSlide: 'حذف الشريحة',
    slide: 'شريحة', added: 'جديدة', slideStatus: () => '',
    heroTitle: 'هيا نتعلّم شيئًا جديدًا اليوم!', heroSub: 'اختر مغامرة واتبع الطريق، درسًا بعد درس.',
    statTopics: 'مغامرات', statLessons: 'دروس', statDone: 'نجوم مكتسبة',
    continueTitle: 'تابع رحلتك', continueGo: 'هيا نكمل', chooseAdventure: 'اختر مغامرتك',
    reorder: 'إعادة الترتيب', reorderDone: 'تم', chooseIcon: 'الأيقونة', videosTitle: 'فيديوهات يوتيوب (اختياري)',
    watchVideo: 'شاهد الفيديو', markDone: 'أكملتُ الدرس', markNotDone: 'لم يكتمل بعد',
    doneOf: (d, n) => `${d} من ${n} مكتمل`, lessonN: n => `الدرس ${n}`,
    start: 'البداية', finishAll: 'أحسنت! أكملت الرحلة 🎉', finishMore: 'مغامرات أخرى قريبًا',
    nextUp: 'التالي!', doneLabel: '✓ مكتمل', soonIn: l => `قريبًا بـ${LANG_NAMES[l]}`,
    ytInvalid: 'هذا لا يبدو رابط يوتيوب.', lessonComplete: 'أحسنت! ⭐',
    themeDark: 'الوضع الليلي', themeLight: 'الوضع النهاري', availableIn: 'متوفر بـ:',
    needsUpgrade: 'لحفظ روابط الفيديو، شغّل ملف supabase/upgrade-v2.sql مرة واحدة في Supabase (راجع README).',
    loadFailed: 'تعذّر تحميل الدروس. تحقق من اتصال الإنترنت.'
  },
  fi: {
    record: 'Tallenna', stop: 'Lopeta', demoTitle: 'Esittelytila',
    demoText: 'Muutokset tallentuvat vain tähän selaimeen. Lisää Supabase-avaimet config.js-tiedostoon, niin sivusto toimii verkossa.',
    topicsTitle: 'Oppituntien aiheet', topicsSub: 'Valitse kansio nähdäksesi sen oppitunnit.',
    newTopic: 'Uusi aihe', editTopic: 'Muokkaa aihetta', noTopics: 'Aiheita ei ole vielä.',
    noTopicsAdmin: 'Luo ensimmäinen kansio, esimerkiksi ”Tavat” tai ”Tarinat”.',
    allTopics: 'Kaikki aiheet', newLesson: 'Uusi oppitunti', editLesson: 'Muokkaa oppituntia',
    noLessons: 'Tässä kansiossa ei ole vielä oppitunteja.',
    editorSub: 'Järjestä dioja vetämällä. Muutokset näkyvät kaikille, kun painat Tallenna.',
    present: 'Esitä', save: 'Tallenna', addPages: 'Lisää sivuja PDF:stä', replacePdf: 'Vaihda PDF',
    removePdf: 'Poista tämä kieli', noPdfForLang: 'Tällä kielellä ei ole vielä PDF:ää.', uploadPdf: 'Lataa PDF',
    translateHint: 'Kirjoita nimi yhdellä kielellä — kaksi muuta käännetään automaattisesti. Voit korjata niitä.',
    cancel: 'Peruuta', topic: 'Aihe', pdfOptional: 'Jokaisen kielen PDF on vapaaehtoinen — voit lisätä muut myöhemmin.',
    adminLogin: 'Ylläpitäjän kirjautuminen', email: 'Sähköposti', password: 'Salasana', signIn: 'Kirjaudu', signOut: 'Kirjaudu ulos',
    admin: 'Ylläpito', fullscreen: 'Koko näyttö (F)', close: 'Sulje (Esc)', edit: 'Muokkaa', editSlides: 'Järjestä diat',
    delete: 'Poista', download: 'Lataa', translate: 'Käännä', demoAdmin: 'Esittelyn ylläpitäjä',
    lessons: n => n === 1 ? '1 oppitunti' : `${n} oppituntia`,
    slides: n => n === 1 ? '1 dia' : `${n} diaa`,
    notIn: l => `Ei vielä saatavilla kielellä ${LANG_NAMES[l]}`,
    confirmDeleteTopic: s => `Poistetaanko kansio ”${s}” ja kaikki sen oppitunnit? Tätä ei voi perua.`,
    confirmDeleteLesson: s => `Poistetaanko oppitunti ”${s}” kaikilla kielillä? Tätä ei voi perua.`,
    confirmRemovePdf: l => `Poistetaanko ${LANG_NAMES[l]}-PDF tästä oppitunnista?`,
    unsaved: 'Tallentamattomia muutoksia — julkaise ne painamalla Tallenna.',
    leaveUnsaved: 'Diojen muutokset ovat tallentamatta. Poistutaanko tallentamatta?',
    saved: 'Tallennettu', saving: 'Tallennetaan…', uploading: 'Ladataan PDF:ää…', translating: 'Käännetään…', building: 'Kootaan PDF:ää…',
    translateFailed: 'Automaattinen käännös ei ole nyt käytettävissä — kirjoita muut nimet itse.',
    nameRequired: 'Kirjoita nimi vähintään yhdellä kielellä.',
    recSaved: 'Tallenne tallennettiin latauksiin', recCancelled: 'Tallennus peruttiin',
    recUnsupported: 'Näytön tallennus toimii tietokoneella Chromessa, Edgessä tai Firefoxissa.',
    micDenied: 'Mikrofonia ei sallittu — tallennetaan ilman ääntäsi.',
    loading: 'Ladataan…', notPdf: 'Tiedosto ei ole luettava PDF.',
    dropPdf: 'Pudota PDF tai napsauta', currentPdf: n => `Nyt: ${n} diaa — napsauta vaihtaaksesi`,
    error: 'Jokin meni vikaan: ', signInFailed: 'Kirjautuminen epäonnistui. Tarkista sähköposti ja salasana.',
    notAdmin: 'Kirjauduttu, mutta tili ei ole ylläpitäjä.', deleted: 'Poistettu', removeSlide: 'Poista dia',
    slide: 'Dia', added: 'uusi', slideStatus: () => '',
    heroTitle: 'Opitaan tänään jotain uutta!', heroSub: 'Valitse seikkailu ja seuraa polkua oppitunti kerrallaan.',
    statTopics: 'seikkailua', statLessons: 'oppituntia', statDone: 'tähteä ansaittu',
    continueTitle: 'Jatka matkaasi', continueGo: 'Jatketaan', chooseAdventure: 'Valitse seikkailusi',
    reorder: 'Järjestä', reorderDone: 'Valmis', chooseIcon: 'Kuvake', videosTitle: 'YouTube-videot (vapaaehtoinen)',
    watchVideo: 'Katso video', markDone: 'Merkitse tehdyksi', markNotDone: 'Ei vielä tehty',
    doneOf: (d, n) => `${d}/${n} tehty`, lessonN: n => `Oppitunti ${n}`,
    start: 'Alku', finishAll: 'Matka suoritettu! 🎉', finishMore: 'Lisää seikkailuja tulossa',
    nextUp: 'Seuraava!', doneLabel: '✓ Tehty', soonIn: l => `Tulossa kielellä ${LANG_NAMES[l]}`,
    ytInvalid: 'Tämä ei näytä YouTube-linkiltä.', lessonComplete: 'Hienoa! ⭐',
    themeDark: 'Tumma teema', themeLight: 'Vaalea teema', availableIn: 'Saatavilla:',
    needsUpgrade: 'Videolinkkien tallentamiseksi suorita supabase/upgrade-v2.sql kerran Supabasessa (katso README).',
    loadFailed: 'Oppitunteja ei voitu ladata. Tarkista internetyhteys.'
  }
};

/* ───────────────────────── State ───────────────────────── */
const state = {
  lang: pickInitialLang(),
  topics: [],
  lessons: [],
  isAdmin: false,
  user: null,
  route: { view: 'home' },
  editor: null,
  reorderMode: false
};
/* Progress is kept per device (this browser): which lessons were finished here. */
const readJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
const doneSet = new Set(readJSON('lpt.done', []));
const isDone = id => doneSet.has(id);
function setDone(id, v) { v ? doneSet.add(id) : doneSet.delete(id); try { localStorage.setItem('lpt.done', JSON.stringify([...doneSet])); } catch (e) {} }
const readLast = () => readJSON('lpt.last', null);
function writeLast(id, lang) { try { localStorage.setItem('lpt.last', JSON.stringify({ id, lang })); } catch (e) {} }
const $ = id => document.getElementById(id);
const t = (key, ...a) => { const v = (T[state.lang] || T.en)[key] ?? T.en[key]; return typeof v === 'function' ? v(...a) : v; };

function pickInitialLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  try { const s = localStorage.getItem('lpt.lang') || localStorage.getItem('hijra.lang'); if (LANGS.includes(s)) return s; } catch (e) {}
  return LANGS.includes(CFG.DEFAULT_LANG) ? CFG.DEFAULT_LANG : 'en';
}
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const nameOf = (obj) => (obj && (obj[state.lang] || obj.en || obj.ar || obj.fi)) || '—';

/* ───────────────────────── Backends ───────────────────────── */
function makeSupabaseBackend() {
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  const must = ({ data, error }) => { if (error) throw new Error(error.message); return data; };
  return {
    mode: 'online',
    async listTopics() { return must(await sb.from('topics').select('*').order('sort').order('created_at')); },
    async listLessons() { return must(await sb.from('lessons').select('*').order('sort').order('created_at')); },
    async saveTopic(r) {
      const row = { id: r.id, names: r.names, sort: r.sort ?? 0 };
      if (r.icon) row.icon = r.icon;
      let res = await sb.from('topics').upsert(row).select().single();
      if (res.error && /icon/i.test(res.error.message)) { delete row.icon; res = await sb.from('topics').upsert(row).select().single(); }
      return must(res);
    },
    async deleteTopic(id) { must(await sb.from('topics').delete().eq('id', id)); },
    async saveLesson(r) {
      const row = { id: r.id, topic_id: r.topic_id, titles: r.titles, files: r.files || {}, sort: r.sort ?? 0, videos: r.videos || {}, updated_at: new Date().toISOString() };
      let res = await sb.from('lessons').upsert(row).select().single();
      if (res.error && /videos/i.test(res.error.message)) {
        if (Object.values(row.videos).some(Boolean)) throw new Error(t('needsUpgrade'));
        delete row.videos; res = await sb.from('lessons').upsert(row).select().single();
      }
      return must(res);
    },
    async deleteLesson(id) { must(await sb.from('lessons').delete().eq('id', id)); },
    async uploadPdf(lessonId, lang, bytes) {
      const path = `${lessonId}/${lang}-${Date.now()}.pdf`;
      must(await sb.storage.from(BUCKET).upload(path, new Blob([bytes], { type: 'application/pdf' }), { contentType: 'application/pdf', cacheControl: '31536000', upsert: false }));
      return path;
    },
    fileUrl(path) { return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl; },
    async getBytes(path) {
      const res = await fetch(this.fileUrl(path));
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.arrayBuffer();
    },
    async removeFiles(paths) { if (paths.length) await sb.storage.from(BUCKET).remove(paths); },
    async session() { const { data } = await sb.auth.getSession(); return data.session?.user || null; },
    async signIn(email, password) { must(await sb.auth.signInWithPassword({ email, password })); return this.session(); },
    async signOut() { await sb.auth.signOut(); },
    async checkAdmin(user) {
      if (!user) return false;
      const { data, error } = await sb.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
      return !error && !!data;
    }
  };
}

function makeLocalBackend() {
  let dbp = null;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open('hijra-lessons-demo', 1);
    r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('topics', { keyPath: 'id' }); d.createObjectStore('lessons', { keyPath: 'id' }); d.createObjectStore('files'); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const run = async (store, mode, fn) => {
    const d = await open();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, mode); const req = fn(tx.objectStore(store));
      tx.oncomplete = () => res(req && req.result); tx.onerror = () => rej(tx.error);
    });
  };
  const sortRows = rows => rows.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0) || String(a.created_at).localeCompare(String(b.created_at)));
  return {
    mode: 'demo',
    async listTopics() { return sortRows(await run('topics', 'readonly', s => s.getAll())); },
    async listLessons() { return sortRows(await run('lessons', 'readonly', s => s.getAll())); },
    async saveTopic(r) { const row = { created_at: new Date().toISOString(), ...r }; await run('topics', 'readwrite', s => s.put(row)); return row; },
    async deleteTopic(id) {
      await run('topics', 'readwrite', s => s.delete(id));
      for (const l of (await this.listLessons()).filter(l => l.topic_id === id)) await this.deleteLesson(l.id);
    },
    async saveLesson(r) { const row = { created_at: new Date().toISOString(), ...r, updated_at: new Date().toISOString() }; await run('lessons', 'readwrite', s => s.put(row)); return row; },
    async deleteLesson(id) { await run('lessons', 'readwrite', s => s.delete(id)); },
    async uploadPdf(lessonId, lang, bytes) {
      const path = `${lessonId}/${lang}-${Date.now()}.pdf`;
      await run('files', 'readwrite', s => s.put(new Blob([bytes], { type: 'application/pdf' }), path));
      return path;
    },
    fileUrl() { return null; },
    async getBytes(path) {
      const blob = await run('files', 'readonly', s => s.get(path));
      if (!blob) throw new Error('File missing');
      return blob.arrayBuffer();
    },
    async removeFiles(paths) { for (const p of paths) await run('files', 'readwrite', s => s.delete(p)); },
    async session() { return { id: 'demo', email: 'demo' }; },
    async signIn() { return this.session(); },
    async signOut() {},
    async checkAdmin() { return true; }
  };
}

const online = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
const api = online ? makeSupabaseBackend() : makeLocalBackend();

/* ───────────────────────── PDF helpers ───────────────────────── */
const bytesCache = new Map();   // path -> ArrayBuffer (full file)
const docCache = new Map();     // path -> Promise<PDFDocumentProxy>

async function getBytes(path) {
  if (!bytesCache.has(path)) bytesCache.set(path, api.getBytes(path));
  try { return await bytesCache.get(path); } catch (e) { bytesCache.delete(path); throw e; }
}
function getDoc(path) {
  if (!docCache.has(path)) {
    const url = api.fileUrl(path);
    const p = url
      ? pdfjsLib.getDocument({ url, disableAutoFetch: true, disableStream: false }).promise
      : getBytes(path).then(b => pdfjsLib.getDocument({ data: new Uint8Array(b.slice(0)) }).promise);
    p.catch(() => docCache.delete(path));
    docCache.set(path, p);
  }
  return docCache.get(path);
}
function docFromBytes(bytes) { return pdfjsLib.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise; }

async function renderPage(doc, pageNo, maxW, maxH, dpr = Math.min(window.devicePixelRatio || 1, 2)) {
  const page = await doc.getPage(pageNo);
  const base = page.getViewport({ scale: 1 });
  const scale = Math.min(maxW / base.width, maxH / base.height);
  const vp = page.getViewport({ scale: scale * dpr });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(vp.width); canvas.height = Math.ceil(vp.height);
  canvas.style.width = Math.round(vp.width / dpr) + 'px';
  canvas.style.height = Math.round(vp.height / dpr) + 'px';
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return canvas;
}

async function readPdfFile(file) {
  const bytes = await file.arrayBuffer();
  try {
    const doc = await docFromBytes(bytes);
    const n = doc.numPages; doc.destroy();
    return { bytes, pages: n };
  } catch (e) { throw new Error(t('notPdf')); }
}

/* ───────────────────────── Translation ───────────────────────── */
async function translate(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('translate');
  const j = await res.json();
  const out = j && j.responseData && j.responseData.translatedText;
  if (!out || Number(j.responseStatus) !== 200 || /MYMEMORY WARNING|INVALID/i.test(out)) throw new Error('translate');
  const txt = document.createElement('textarea'); txt.innerHTML = out; // decode entities
  return txt.value.trim();
}

/* Build three name inputs (ar/en/fi) with a Translate button each */
function buildTrio(container, values = {}) {
  container.innerHTML = '';
  const inputs = {};
  const order = [state.lang, ...LANGS.filter(l => l !== state.lang)];
  for (const l of order) {
    const row = document.createElement('div'); row.className = 'trio-row';
    const lab = document.createElement('label'); lab.textContent = LANG_NAMES[l]; lab.htmlFor = container.id + '-' + l;
    const inp = document.createElement('input'); inp.id = container.id + '-' + l; inp.lang = l; inp.dir = l === 'ar' ? 'rtl' : 'ltr';
    inp.value = values[l] || ''; inp.autocomplete = 'off';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn small'; btn.textContent = '⇄ ' + t('translate');
    btn.onclick = () => fillTranslations(inputs, l, true);
    inp.addEventListener('blur', () => {
      const others = LANGS.filter(x => x !== l);
      if (inp.value.trim() && others.every(x => !inputs[x].value.trim())) fillTranslations(inputs, l, false);
    });
    row.append(lab, inp, btn); container.append(row); inputs[l] = inp;
  }
  return inputs;
}
async function fillTranslations(inputs, from, overwrite) {
  const src = inputs[from].value.trim();
  if (!src) return;
  const targets = LANGS.filter(l => l !== from && (overwrite || !inputs[l].value.trim()));
  targets.forEach(l => { inputs[l].placeholder = t('translating'); });
  let failed = false;
  await Promise.all(targets.map(async l => {
    try { inputs[l].value = await translate(src, from, l); }
    catch (e) { failed = true; }
    finally { inputs[l].placeholder = ''; }
  }));
  if (failed) toast(t('translateFailed'), true);
}
async function collectNames(inputs) {
  const vals = {}; LANGS.forEach(l => vals[l] = inputs[l].value.trim());
  const source = [state.lang, ...LANGS].find(l => vals[l]);
  if (!source) throw new Error(t('nameRequired'));
  const missing = LANGS.filter(l => !vals[l]);
  if (missing.length) {
    await fillTranslations(inputs, source, false);
    LANGS.forEach(l => vals[l] = inputs[l].value.trim() || vals[source]);
  }
  return vals;
}

/* ───────────────────────── UI helpers ───────────────────────── */
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
function toast(msg, err = false) {
  const el = $('toast'); el.textContent = msg; el.classList.toggle('err', err); el.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), err ? 4200 : 2200);
}
function busy(msg) { $('busyText').textContent = msg || t('loading'); $('busy').hidden = false; }
function done() { $('busy').hidden = true; }
async function guard(fn, msg) {
  try { if (msg) busy(msg); return await fn(); }
  catch (e) { console.error(e); toast(e.message && !e.message.startsWith(t('error')) && e.message.length < 140 ? e.message : t('error') + (e.message || ''), true); }
  finally { if (msg) done(); }
}
function openModal(id) { $(id).hidden = false; setTimeout(() => $(id).querySelector('input:not([type=file]),select')?.focus(), 30); }
function closeModal(id) { $(id).hidden = true; }
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) closeModal(m.id); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('presenter').hidden) document.querySelectorAll('.modal:not([hidden])').forEach(m => closeModal(m.id));
});

function safeName(s) { return String(s || 'lesson').replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 90) || 'lesson'; }
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: filename }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/* ───────────────────────── Language / chrome ───────────────────────── */
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('themeBtn').textContent = dark ? '☀️' : '🌙';
  $('themeBtn').title = dark ? t('themeLight') : t('themeDark');
}
$('themeBtn').onclick = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('lpt.theme', next); } catch (e) {}
  updateThemeButton(); render();
};
function applyLang() {
  const L = state.lang;
  document.documentElement.lang = L;
  document.documentElement.dir = L === 'ar' ? 'rtl' : 'ltr';
  try { localStorage.setItem('lpt.lang', L); } catch (e) {}
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('.lang-switch button').forEach(b => b.classList.toggle('active', b.dataset.lang === L));
  $('siteName').textContent = (CFG.BRAND_NAME && CFG.BRAND_NAME[L]) || BRAND.name[L];
  $('siteTagline').textContent = (CFG.BRAND_TAGLINE && CFG.BRAND_TAGLINE[L]) || BRAND.tagline[L];
  updateThemeButton();
  document.title = $('siteName').textContent;
  $('recordBtn').title = t('record');
  $('pRecord').title = t('record');
  renderAdminButton();
}
function renderAdminButton() {
  const b = $('adminBtn');
  if (!online) { b.textContent = '🔓 ' + t('demoAdmin'); b.disabled = true; return; }
  b.disabled = false;
  b.textContent = state.user ? '⎋ ' + t('signOut') : '🔐 ' + t('admin');
}
document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', () => {
  if (state.lang === b.dataset.lang) return;
  state.lang = b.dataset.lang; applyLang(); render();
}));

/* ───────────────────────── Routing ───────────────────────── */
function parseHash() {
  const p = location.hash.replace(/^#\/?/, '').split('/');
  if (p[0] === 't' && p[1]) return { view: 'topic', topicId: p[1] };
  if (p[0] === 'e' && p[1]) return { view: 'editor', lessonId: p[1], lang: LANGS.includes(p[2]) ? p[2] : state.lang };
  return { view: 'home' };
}
function go(hash) { if (location.hash === hash) onRoute(); else location.hash = hash; }
let lastHash = location.hash;
function onRoute() {
  const next = parseHash();
  if (state.editor && state.editor.dirty && !(next.view === 'editor' && next.lessonId === state.editor.lessonId && next.lang === state.editor.lang)) {
    if (!confirm(t('leaveUnsaved'))) { history.replaceState(null, '', lastHash || '#'); return; }
  }
  if (next.view !== 'editor') state.editor = null;
  if (next.view !== 'topic' || next.topicId !== state.route.topicId) state.reorderMode = false;
  lastHash = location.hash;
  state.route = next; render(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', onRoute);
window.addEventListener('beforeunload', e => { if (state.editor && state.editor.dirty) { e.preventDefault(); e.returnValue = ''; } });
document.addEventListener('click', e => {
  const a = e.target.closest('[data-go="home"]'); if (a) { e.preventDefault(); go('#'); }
});
$('brandLink').addEventListener('click', e => { e.preventDefault(); go('#'); });

/* ───────────────────────── Rendering ───────────────────────── */

function render() {
  document.body.classList.toggle('is-admin', state.isAdmin);
  $('demoBanner').hidden = online;
  const r = state.route;
  $('homeView').hidden = r.view !== 'home';
  $('topicView').hidden = r.view !== 'topic';
  $('editorView').hidden = r.view !== 'editor';
  if (r.view === 'home') renderHome();
  else if (r.view === 'topic') renderTopic(r.topicId);
  else if (r.view === 'editor') {
    if (!state.isAdmin) { go('#'); return; }
    renderEditor(r.lessonId, r.lang);
  }
}

let topicSortable = null, reorderSortable = null;
const topicColor = (tp, i) => tp.color || TOPIC_COLORS[(i < 0 ? 0 : i) % TOPIC_COLORS.length];
const topicIcon = (tp, i) => tp.icon || TOPIC_ICONS[(i < 0 ? 0 : i) % TOPIC_ICONS.length];
const topicLessons = id => state.lessons.filter(l => l.topic_id === id);

function renderHome() {
  const grid = $('topicGrid'); grid.innerHTML = '';
  $('topicEmpty').hidden = state.topics.length > 0;
  const allDone = state.lessons.filter(l => isDone(l.id)).length;
  $('statTopics').textContent = state.topics.length;
  $('statLessons').textContent = state.lessons.length;
  $('statDone').textContent = allDone;

  // continue card
  const last = readLast();
  const lastLesson = last && state.lessons.find(l => l.id === last.id);
  $('continueCard').hidden = !lastLesson;
  if (lastLesson) {
    $('continueName').textContent = nameOf(lastLesson.titles);
    $('continueBtn').onclick = () => { pendingSheet = lastLesson.id; go('#/t/' + lastLesson.topic_id); };
  }

  state.topics.forEach((tp, i) => {
    const ls = topicLessons(tp.id);
    const d = ls.filter(l => isDone(l.id)).length;
    const pct = ls.length ? Math.round(d / ls.length * 100) : 0;
    const stars = ls.length ? '⭐'.repeat(Math.min(d, 8)) + (d > 8 ? ` +${d - 8}` : '') : '';
    const card = h('div', { class: 'folder', role: 'button', tabindex: '0', 'data-id': tp.id, style: `--c:${topicColor(tp, i)}` },
      h('div', { class: 'folder-top' },
        h('div', { class: 'folder-icon', text: topicIcon(tp, i) }),
        ls.length ? h('div', { class: 'ring', style: `--p:${pct}`, title: t('doneOf', d, ls.length) }, h('span', { text: `${d}/${ls.length}` })) : null
      ),
      h('h3', { text: nameOf(tp.names) }),
      h('div', { class: 'count', text: t('lessons', ls.length) }),
      h('div', { class: 'stars', text: stars }),
      state.isAdmin && h('div', { class: 'admin-row' },
        h('button', { class: 'btn small', type: 'button', onclick: e => { e.stopPropagation(); openTopicModal(tp); } }, '✎ ', t('edit')),
        h('button', { class: 'btn small danger', type: 'button', onclick: e => { e.stopPropagation(); deleteTopic(tp); } }, '🗑'),
        h('button', { class: 'drag-handle', type: 'button', title: '⇅', onclick: e => e.stopPropagation() }, '⠿')
      )
    );
    card.addEventListener('click', () => go('#/t/' + tp.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') go('#/t/' + tp.id); });
    grid.append(card);
  });
  if (topicSortable) { topicSortable.destroy(); topicSortable = null; }
  if (state.isAdmin && window.Sortable && state.topics.length > 1) {
    topicSortable = Sortable.create(grid, { handle: '.drag-handle', animation: 160, onEnd: () => persistOrder(grid, state.topics, api.saveTopic.bind(api)) });
  }
}

async function persistOrder(grid, list, saveFn) {
  const ids = [...grid.children].map(c => c.dataset.id).filter(Boolean);
  await guard(async () => {
    for (let i = 0; i < ids.length; i++) {
      const row = list.find(x => x.id === ids[i]);
      if (row && row.sort !== i) { row.sort = i; await saveFn(row); }
    }
    list.sort((a, b) => a.sort - b.sort);
  });
}

/* ── Journey map ── */
const DECO_DAY = ['🌳', '🌷', '⛰️', '🌲', '🏡', '🐑', '🌻', '🍄', '🦋', '🌵', '🐢', '🌴'];
const DECO_NIGHT = ['⭐', '🌙', '✨', '🪐', '☄️', '🌟', '🔭', '🛸', '🌠', '💫'];
let pendingSheet = null;

function renderTopic(topicId) {
  const tp = state.topics.find(x => x.id === topicId);
  if (!tp) { go('#'); return; }
  const idx = state.topics.indexOf(tp);
  const color = topicColor(tp, idx);
  const lessons = topicLessons(topicId);
  const d = lessons.filter(l => isDone(l.id)).length;
  $('topicView').style.setProperty('--c', color);
  $('topicTitle').textContent = nameOf(tp.names);
  $('topicCrumb').textContent = nameOf(tp.names);
  $('topicBadge').textContent = topicIcon(tp, idx);
  $('topicProgressFill').style.width = (lessons.length ? d / lessons.length * 100 : 0) + '%';
  $('topicProgressText').textContent = lessons.length ? t('doneOf', d, lessons.length) : t('lessons', 0);
  $('lessonEmpty').hidden = lessons.length > 0;
  $('reorderBtn').hidden = lessons.length < 2;
  $('reorderBtn').querySelector('span').textContent = state.reorderMode ? t('reorderDone') : t('reorder');

  if (state.reorderMode && state.isAdmin) {
    $('journey').hidden = true; $('reorderList').hidden = false;
    renderReorderList(lessons);
  } else {
    $('journey').hidden = lessons.length === 0; $('reorderList').hidden = true;
    if (lessons.length) renderJourney(lessons, color);
  }
  if (pendingSheet) {
    const ls = lessons.find(l => l.id === pendingSheet); pendingSheet = null;
    if (ls) openLessonSheet(ls);
  }
}

function renderJourney(lessons, color) {
  const wrap = $('journey'); wrap.innerHTML = '';
  wrap.style.setProperty('--c', color);
  const night = document.documentElement.dataset.theme === 'dark';
  const decos = night ? DECO_NIGHT : DECO_DAY;
  const STEP = 175, FIRST = 215;
  const X = [30, 52, 72, 50];               // winding left-right pattern (in %)
  const n = lessons.length;
  const start = { x: 50, y: 70 };
  const pts = lessons.map((_, i) => ({ x: X[i % 4], y: FIRST + i * STEP }));
  const end = { x: X[n % 4], y: FIRST + n * STEP - 25 };
  const H = end.y + 95;
  wrap.style.height = H + 'px';

  const nextIdx = lessons.findIndex(l => !isDone(l.id));
  const chain = [start, ...pts, end];
  const seg = (a, b) => { const dy = b.y - a.y; return `M${a.x} ${a.y} C${a.x} ${a.y + dy * .55} ${b.x} ${b.y - dy * .55} ${b.x} ${b.y}`; };
  let edge = '', dash = '', roads = '';
  for (let k = 0; k < chain.length - 1; k++) {
    const p = seg(chain[k], chain[k + 1]);
    edge += p + ' '; dash += p + ' ';
    const isDoneSeg = k < n ? isDone(lessons[k].id) : nextIdx === -1;
    roads += `<path class="road${isDoneSeg ? ' done' : ''}" d="${p}" vector-effect="non-scaling-stroke"/>`;
  }
  wrap.insertAdjacentHTML('beforeend',
    `<svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" height="${H}" aria-hidden="true">
      <path class="road-edge" d="${edge}" vector-effect="non-scaling-stroke"/>${roads}
      <path class="road-dash" d="${dash}" vector-effect="non-scaling-stroke"/></svg>`);

  // scenery on the empty side of each bend
  const deco = (x, y, i, small) => wrap.append(h('div', { class: 'deco' + (small ? ' sm' : ''), style: `left:${x}%;top:${y}px`, text: decos[i % decos.length] }));
  deco(16, 60, 3); deco(86, 90, 7, true);
  pts.forEach((p, i) => {
    const side = p.x < 45 ? 84 : p.x > 55 ? 14 : (i % 2 ? 88 : 12);
    deco(side, p.y + 10, i * 3 + 1);
    deco(side + (side > 50 ? -9 : 9), p.y + STEP * .5, i * 5 + 2, true);
  });

  // start + finish markers
  wrap.append(h('div', { class: 'milestone', style: `left:${start.x}%;top:${start.y}px` }, h('span', { class: 'mk', text: '🚩' }), h('span', { class: 'ml', text: t('start') })));
  wrap.append(h('div', { class: 'milestone', style: `left:${end.x}%;top:${end.y}px` },
    h('span', { class: 'mk', text: nextIdx === -1 ? '🏆' : '🏁' }), h('span', { class: 'ml', text: nextIdx === -1 ? t('finishAll') : t('finishMore') })));

  // lesson stops
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { io.unobserve(en.target); en.target._load(); } }), { rootMargin: '300px' });
  lessons.forEach((ls, i) => {
    const p = pts[i];
    const doneNow = isDone(ls.id);
    const file = ls.files[state.lang];
    const video = ls.videos[state.lang];
    const soon = !file && !video;
    const cls = 'stop' + (doneNow ? ' done' : '') + (i === nextIdx ? ' next' : '') + (soon ? ' soon' : '');
    const inner = h('div', { class: 'stop-inner', text: String(i + 1) });
    const btn = h('button', { class: 'stop-btn', type: 'button', 'aria-label': `${t('lessonN', i + 1)}: ${nameOf(ls.titles)}` },
      inner,
      h('span', { class: 'stop-num', text: i + 1 }),
      doneNow ? h('span', { class: 'stop-star', text: '★' }) : null
    );
    const sub = doneNow ? t('doneLabel') : soon ? t('soonIn', state.lang) : file ? t('slides', file.pages) + (video ? ' · 🎬' : '') : '🎬';
    const stop = h('div', { class: cls, style: `left:${p.x}%;top:${p.y}px` },
      i === nextIdx ? h('span', { class: 'next-flag', text: t('nextUp') }) : null,
      btn,
      h('div', { class: 'stop-label' }, nameOf(ls.titles), h('small', { text: sub }))
    );
    stop.querySelectorAll('.stop-btn,.stop-label').forEach(el => el.addEventListener('click', () => openLessonSheet(ls)));
    const coverFile = file || LANGS.map(l => ls.files[l]).find(Boolean);
    inner._load = async () => {
      if (!coverFile) return;
      try { const c = await renderPage(await getDoc(coverFile.path), 1, 200, 200); inner.textContent = ''; inner.append(c); } catch (e) {}
    };
    io.observe(inner);
    wrap.append(stop);
  });
}

function renderReorderList(lessons) {
  const list = $('reorderList'); list.innerHTML = '';
  lessons.forEach((ls, i) => list.append(h('div', { class: 'reorder-item', 'data-id': ls.id }, h('span', { class: 'n', text: i + 1 }), h('span', { text: '⠿' }), nameOf(ls.titles))));
  if (reorderSortable) reorderSortable.destroy();
  reorderSortable = window.Sortable ? Sortable.create(list, {
    animation: 160,
    onEnd: async () => {
      await persistOrder(list, state.lessons, api.saveLesson.bind(api));
      [...list.children].forEach((c, i) => { c.querySelector('.n').textContent = i + 1; });
    }
  }) : null;
}
$('reorderBtn').onclick = () => { state.reorderMode = !state.reorderMode; render(); };

/* ── Lesson sheet ── */
let sheetLesson = null;
function openLessonSheet(ls) {
  sheetLesson = ls;
  const list = topicLessons(ls.topic_id);
  const i = list.indexOf(ls);
  const L = state.lang;
  const file = ls.files[L], video = ls.videos[L];
  $('sheetStep').textContent = t('lessonN', i + 1) + (isDone(ls.id) ? '  ·  ' + t('doneLabel') : '');
  $('sheetTitle').textContent = nameOf(ls.titles);

  const cover = $('sheetCover'); cover.innerHTML = '';
  const coverFile = file || LANGS.map(l => ls.files[l]).find(Boolean);
  if (coverFile) {
    cover.append(h('div', { class: 'spinner' }));
    getDoc(coverFile.path).then(doc => renderPage(doc, 1, 560, 315)).then(c => { if (sheetLesson === ls) { cover.innerHTML = ''; cover.append(c); } }).catch(() => { cover.innerHTML = ''; });
  } else cover.append(h('div', { class: 'big-emoji', text: video ? '🎬' : '🧭' }));

  const langs = $('sheetLangs'); langs.innerHTML = '';
  LANGS.forEach(l => {
    const f = ls.files[l], v = ls.videos[l];
    langs.append(h('button', { class: 'chip' + (f ? ' on' : ''), type: 'button', title: f ? `${t('present')} · ${LANG_NAMES[l]}` : t('notIn', l), style: 'cursor:' + (f ? 'pointer' : 'default'), onclick: () => f && present(ls, l) },
      LANG_NAMES[l] + (f ? ` · ${f.pages}` : '')));
    if (v) langs.append(h('button', { class: 'chip video', type: 'button', title: t('watchVideo') + ' · ' + LANG_NAMES[l], onclick: () => openVideo(v) }, '🎬 ' + l.toUpperCase()));
  });

  const acts = $('sheetActions'); acts.innerHTML = '';
  if (file) acts.append(h('button', { class: 'btn primary wide', type: 'button', onclick: () => { closeModal('lessonSheet'); present(ls, L); } }, '▶ ', t('present')));
  if (video) acts.append(h('button', { class: 'btn orange' + (file ? '' : ' wide'), type: 'button', onclick: () => openVideo(video) }, '🎬 ', t('watchVideo')));
  if (file) acts.append(h('button', { class: 'btn', type: 'button', onclick: () => downloadLesson(ls, L) }, '⬇ ', t('download')));
  const dn = isDone(ls.id);
  acts.append(h('button', { class: 'btn ' + (dn ? '' : 'green'), type: 'button', onclick: () => { setDone(ls.id, !dn); openLessonSheet(ls); render(); } }, dn ? '↺ ' + t('markNotDone') : '✓ ' + t('markDone')));
  if (!file && !video) {
    const avail = LANGS.filter(l => ls.files[l] || ls.videos[l]);
    acts.prepend(h('p', { class: 'note-soon', style: 'grid-column:1/-1;margin:0' }, t('soonIn', L) + (avail.length ? ' — ' + t('availableIn') + ' ' + avail.map(l => LANG_NAMES[l]).join(', ') : '')));
  }

  const adm = $('sheetAdmin'); adm.innerHTML = '';
  if (state.isAdmin) {
    adm.append(
      h('button', { class: 'btn small gold', type: 'button', onclick: () => { closeModal('lessonSheet'); go(`#/e/${ls.id}/${L}`); } }, '⇅ ', t('editSlides')),
      h('button', { class: 'btn small', type: 'button', onclick: () => { closeModal('lessonSheet'); openLessonModal(ls); } }, '✎ ', t('edit')),
      h('button', { class: 'btn small danger', type: 'button', onclick: () => { closeModal('lessonSheet'); deleteLesson(ls); } }, '🗑 ', t('delete'))
    );
  }
  openModal('lessonSheet');
}

/* ── YouTube ── */
function ytId(u) {
  try {
    const url = new URL(String(u).trim());
    const host = url.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
    if (!/youtube(-nocookie)?\.com$/.test(host)) return null;
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    const m = url.pathname.match(/\/(embed|shorts|live|v)\/([\w-]{6,})/);
    return m ? m[2] : null;
  } catch (e) { return null; }
}
function openVideo(url) {
  const id = ytId(url);
  if (!id) { window.open(url, '_blank', 'noopener'); return; }
  $('videoFrame').src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
  $('videoModal').hidden = false;
}
new MutationObserver(() => { if ($('videoModal').hidden) $('videoFrame').src = 'about:blank'; }).observe($('videoModal'), { attributes: true, attributeFilter: ['hidden'] });

/* ───────────────────────── Topic & lesson CRUD ───────────────────────── */
let topicInputs = null, editingTopic = null, pickedIcon = null;
function openTopicModal(tp = null) {
  editingTopic = tp;
  $('topicModalTitle').textContent = tp ? t('editTopic') : t('newTopic');
  topicInputs = buildTrio($('topicNames'), tp ? tp.names : {});
  const idx = tp ? state.topics.indexOf(tp) : state.topics.length;
  pickedIcon = tp ? topicIcon(tp, idx) : TOPIC_ICONS[idx % TOPIC_ICONS.length];
  const pick = $('iconPick'); pick.innerHTML = '';
  TOPIC_ICONS.forEach(ic => pick.append(h('button', { type: 'button', class: ic === pickedIcon ? 'on' : '', text: ic, onclick: e => {
    pickedIcon = ic; pick.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === e.currentTarget));
  } })));
  openModal('topicModal');
}
$('newTopicBtn').onclick = () => openTopicModal();
$('topicForm').addEventListener('submit', async e => {
  e.preventDefault();
  await guard(async () => {
    const names = await collectNames(topicInputs);
    busy(t('saving'));
    const row = editingTopic ? { ...editingTopic, names, icon: pickedIcon } : { id: uid(), names, icon: pickedIcon, sort: state.topics.length };
    await api.saveTopic(row);
    closeModal('topicModal'); await reload(); toast(t('saved'));
  });
  done();
});
async function deleteTopic(tp) {
  if (!confirm(t('confirmDeleteTopic', nameOf(tp.names)))) return;
  await guard(async () => {
    const lessons = state.lessons.filter(l => l.topic_id === tp.id);
    const paths = lessons.flatMap(l => Object.values(l.files || {}).map(f => f.path));
    await api.removeFiles(paths).catch(() => {});
    await api.deleteTopic(tp.id);
    await reload(); toast(t('deleted'));
  }, t('saving'));
}

let lessonInputs = null, editingLesson = null, pendingPdfs = {}, videoInputs = {};
function openLessonModal(ls = null, topicId = null) {
  editingLesson = ls; pendingPdfs = {};
  $('lessonModalTitle').textContent = ls ? t('editLesson') : t('newLesson');
  const sel = $('lessonTopicSelect'); sel.innerHTML = '';
  state.topics.forEach(tp => sel.append(h('option', { value: tp.id, text: nameOf(tp.names) })));
  sel.value = ls ? ls.topic_id : (topicId || state.route.topicId || state.topics[0]?.id || '');
  lessonInputs = buildTrio($('lessonNames'), ls ? ls.titles : {});
  const vbox = $('lessonVideos'); vbox.innerHTML = ''; videoInputs = {};
  LANGS.forEach(l => {
    const inp = h('input', { type: 'url', id: 'lessonVideo-' + l, placeholder: 'https://youtube.com/watch?v=…', dir: 'ltr', autocomplete: 'off' });
    inp.value = (ls && ls.videos && ls.videos[l]) || '';
    inp.addEventListener('input', () => inp.classList.remove('bad'));
    vbox.append(h('div', { class: 'trio-row noact' }, h('label', { for: inp.id, text: '🎬 ' + LANG_NAMES[l] }), inp));
    videoInputs[l] = inp;
  });
  const box = $('lessonPdfs'); box.innerHTML = '';
  for (const l of LANGS) {
    const existing = ls && ls.files && ls.files[l];
    const input = h('input', { type: 'file', accept: 'application/pdf,.pdf', hidden: true });
    const info = h('span', { text: existing ? t('currentPdf', existing.pages) : t('dropPdf') });
    const drop = h('label', { class: 'pdf-drop' + (existing ? ' has' : '') }, h('strong', { text: 'PDF · ' + LANG_NAMES[l] }), info, input);
    const take = async file => {
      if (!file) return;
      const r = await guard(() => readPdfFile(file));
      if (!r) return;
      pendingPdfs[l] = { ...r, name: file.name };
      drop.classList.add('has'); info.textContent = `${file.name} · ${t('slides', r.pages)}`;
    };
    input.onchange = () => take(input.files[0]);
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => take(e.dataTransfer.files[0]));
    box.append(drop);
  }
  openModal('lessonModal');
}
$('newLessonBtn').onclick = () => openLessonModal(null, state.route.topicId);
$('lessonForm').addEventListener('submit', async e => {
  e.preventDefault();
  $('lessonSubmit').disabled = true;
  await guard(async () => {
    const topic_id = $('lessonTopicSelect').value;
    if (!topic_id) throw new Error(t('noTopics'));
    const videos = {};
    for (const l of LANGS) {
      const v = videoInputs[l].value.trim();
      if (v && !ytId(v)) { videoInputs[l].classList.add('bad'); videoInputs[l].focus(); throw new Error(t('ytInvalid')); }
      if (v) videos[l] = v;
    }
    const titles = await collectNames(lessonInputs);
    const row = editingLesson
      ? { ...editingLesson, titles, topic_id, videos, files: { ...(editingLesson.files || {}) } }
      : { id: uid(), topic_id, titles, videos, files: {}, sort: state.lessons.filter(l => l.topic_id === topic_id).length };
    const old = [];
    for (const l of Object.keys(pendingPdfs)) {
      busy(`${t('uploading')} (${LANG_NAMES[l]})`);
      const p = pendingPdfs[l];
      const path = await api.uploadPdf(row.id, l, p.bytes);
      bytesCache.set(path, Promise.resolve(p.bytes));
      if (row.files[l]) old.push(row.files[l].path);
      row.files[l] = { path, pages: p.pages };
    }
    busy(t('saving'));
    await api.saveLesson(row);
    await api.removeFiles(old).catch(() => {});
    closeModal('lessonModal'); await reload(); toast(t('saved'));
    if (state.route.view !== 'topic' || state.route.topicId !== topic_id) go('#/t/' + topic_id);
  });
  done();
  $('lessonSubmit').disabled = false;
});
async function deleteLesson(ls) {
  if (!confirm(t('confirmDeleteLesson', nameOf(ls.titles)))) return;
  await guard(async () => {
    await api.removeFiles(Object.values(ls.files || {}).map(f => f.path)).catch(() => {});
    await api.deleteLesson(ls.id);
    await reload(); toast(t('deleted'));
  }, t('saving'));
}
async function downloadLesson(ls, lang) {
  const f = ls.files && ls.files[lang]; if (!f) return;
  await guard(async () => {
    const b = await getBytes(f.path);
    saveBlob(new Blob([b], { type: 'application/pdf' }), `${safeName(nameOf(ls.titles))} (${lang.toUpperCase()}).pdf`);
  }, t('loading'));
}

/* ───────────────────────── Slide editor ───────────────────────── */
let slideSortable = null;
async function renderEditor(lessonId, lang) {
  const ls = state.lessons.find(x => x.id === lessonId);
  if (!ls) { go('#'); return; }
  const tp = state.topics.find(x => x.id === ls.topic_id);
  $('editorTitle').textContent = nameOf(ls.titles);
  $('editorLessonCrumb').textContent = nameOf(ls.titles);
  $('editorTopicCrumb').textContent = tp ? nameOf(tp.names) : '';
  $('editorTopicCrumb').href = tp ? '#/t/' + tp.id : '#';

  const tabs = $('editorLangTabs'); tabs.innerHTML = '';
  LANGS.forEach(l => tabs.append(h('button', { type: 'button', class: l === lang ? 'active' : '', role: 'tab', onclick: () => go(`#/e/${ls.id}/${l}`) },
    h('span', { class: 'dot' + (ls.files && ls.files[l] ? ' on' : '') }), LANG_NAMES[l])));

  const sameEditor = state.editor && state.editor.lessonId === lessonId && state.editor.lang === lang;
  if (!sameEditor) {
    state.editor = { lessonId, lang, sources: [], items: [], dirty: false, token: Symbol() };
    const f = ls.files && ls.files[lang];
    if (f) {
      const token = state.editor.token;
      $('slideGrid').innerHTML = ''; $('slideEmpty').hidden = true;
      setEditorStatus(t('loading'));
      try {
        const bytes = await getBytes(f.path);
        if (!state.editor || state.editor.token !== token) return;
        await addSource(bytes, false);
      } catch (e) { toast(t('error') + e.message, true); }
    }
  }
  drawSlides();
}

async function addSource(bytes, markNew) {
  const ed = state.editor;
  const doc = await docFromBytes(bytes);
  const srcIndex = ed.sources.push({ bytes, doc }) - 1;
  for (let p = 1; p <= doc.numPages; p++) ed.items.push({ key: uid(), src: srcIndex, page: p, isNew: markNew });
}

function setEditorStatus(msg, dirty = false) { const s = $('editorStatus'); s.textContent = msg; s.classList.toggle('dirty', dirty); }
function updateEditorChrome() {
  const ed = state.editor; if (!ed) return;
  const n = ed.items.length;
  $('saveSlidesBtn').disabled = !ed.dirty;
  $('removePdfBtn').hidden = !(state.lessons.find(l => l.id === ed.lessonId)?.files?.[ed.lang]);
  $('slideEmpty').hidden = n > 0;
  setEditorStatus(n ? t('slides', n) + (ed.dirty ? ' · ' + t('unsaved') : '') : '', ed.dirty);
  [...$('slideGrid').children].forEach((el, i) => { const num = el.querySelector('.num b'); if (num) num.textContent = `${t('slide')} ${i + 1}`; });
}

function drawSlides() {
  const ed = state.editor; const grid = $('slideGrid'); grid.innerHTML = '';
  const queue = [];
  ed.items.forEach((it, i) => {
    const thumb = h('div', { class: 'thumb' });
    const el = h('div', { class: 'slide' + (it.isNew ? ' new' : ''), 'data-key': it.key },
      thumb,
      h('div', { class: 'num' },
        h('b', { text: `${t('slide')} ${i + 1}` }),
        it.isNew ? h('span', { class: 'chip', text: t('added') }) : null,
        h('button', { class: 'del', type: 'button', title: t('removeSlide'), onclick: () => {
          ed.items = ed.items.filter(x => x.key !== it.key); ed.dirty = true; el.remove(); updateEditorChrome();
        } }, '✕')
      )
    );
    grid.append(el);
    queue.push({ it, thumb });
  });
  if (slideSortable) slideSortable.destroy();
  slideSortable = window.Sortable ? Sortable.create(grid, {
    animation: 170, ghostClass: 'sortable-ghost', filter: '.del', preventOnFilter: false,
    onEnd: () => {
      const keys = [...grid.children].map(c => c.dataset.key);
      const map = new Map(ed.items.map(x => [x.key, x]));
      const next = keys.map(k => map.get(k)).filter(Boolean);
      if (next.some((x, i) => x !== ed.items[i])) { ed.items = next; ed.dirty = true; }
      updateEditorChrome();
    }
  }) : null;
  updateEditorChrome();
  // render thumbnails progressively
  const token = ed.token;
  (async () => {
    for (const { it, thumb } of queue) {
      if (state.editor !== ed || ed.token !== token) return;
      if (!thumb.isConnected) continue;
      try { thumb.append(await renderPage(ed.sources[it.src].doc, it.page, 220, 138, 1.5)); } catch (e) {}
    }
  })();
}

async function loadPdfIntoEditor(file, replace) {
  if (!file || !state.editor) return;
  await guard(async () => {
    const bytes = await file.arrayBuffer();
    const ed = state.editor;
    if (replace) { ed.items = []; }
    try { await addSource(bytes, !replace && ed.items.length > 0); }
    catch (e) { throw new Error(t('notPdf')); }
    ed.dirty = true; drawSlides();
  }, t('loading'));
}
$('appendPdfInput').onchange = e => { loadPdfIntoEditor(e.target.files[0], false); e.target.value = ''; };
$('replacePdfInput').onchange = e => { loadPdfIntoEditor(e.target.files[0], true); e.target.value = ''; };
$('firstPdfInput').onchange = e => { loadPdfIntoEditor(e.target.files[0], true); e.target.value = ''; };

$('saveSlidesBtn').onclick = async () => {
  const ed = state.editor; if (!ed || !ed.dirty) return;
  const ls = state.lessons.find(l => l.id === ed.lessonId); if (!ls) return;
  await guard(async () => {
    const files = { ...(ls.files || {}) };
    const old = files[ed.lang] && files[ed.lang].path;
    if (!ed.items.length) {
      delete files[ed.lang];
    } else {
      busy(t('building'));
      const { PDFDocument } = PDFLib;
      const out = await PDFDocument.create();
      const loaded = [];
      for (const it of ed.items) {
        if (!loaded[it.src]) loaded[it.src] = await PDFDocument.load(ed.sources[it.src].bytes, { ignoreEncryption: true });
        const [pg] = await out.copyPages(loaded[it.src], [it.page - 1]);
        out.addPage(pg);
      }
      const bytes = (await out.save()).buffer;
      busy(t('uploading'));
      const path = await api.uploadPdf(ls.id, ed.lang, bytes);
      bytesCache.set(path, Promise.resolve(bytes));
      files[ed.lang] = { path, pages: ed.items.length };
    }
    busy(t('saving'));
    await api.saveLesson({ ...ls, files });
    if (old) { await api.removeFiles([old]).catch(() => {}); bytesCache.delete(old); docCache.delete(old); }
    state.editor = null;
    await reload(); toast(t('saved'));
  });
  done();
};
$('removePdfBtn').onclick = async () => {
  const ed = state.editor; if (!ed) return;
  const ls = state.lessons.find(l => l.id === ed.lessonId);
  if (!ls?.files?.[ed.lang] || !confirm(t('confirmRemovePdf', ed.lang))) return;
  await guard(async () => {
    const files = { ...ls.files }; const p = files[ed.lang].path; delete files[ed.lang];
    await api.saveLesson({ ...ls, files }); await api.removeFiles([p]).catch(() => {});
    state.editor = null; await reload(); toast(t('deleted'));
  }, t('saving'));
};
$('editorPresentBtn').onclick = () => {
  const ed = state.editor; if (!ed) return;
  const ls = state.lessons.find(l => l.id === ed.lessonId);
  if (ed.dirty || !ls?.files?.[ed.lang]) presentEditorDraft(ls);
  else present(ls, ed.lang);
};

/* ───────────────────────── Presenter ───────────────────────── */
const P = { pages: null, i: 0, cache: new Map(), token: 0, uiTimer: null, fs: false, keepOnFsExit: false };
// pages: array of {doc, page} so the editor draft can be previewed too

async function present(ls, lang) {
  const f = ls.files && ls.files[lang];
  if (!f) { toast(t('notIn', lang), true); return; }
  writeLast(ls.id, lang);
  openPresenter();
  P.lessonId = ls.id; P.celebrated = isDone(ls.id);
  showPresenterMessage(t('loading'));
  try {
    const doc = await getDoc(f.path);
    startDeck(Array.from({ length: doc.numPages }, (_, k) => ({ doc, page: k + 1 })));
  } catch (e) { closePresenter(); toast(t('error') + e.message, true); }
}
function presentEditorDraft() {
  const ed = state.editor; if (!ed || !ed.items.length) return;
  openPresenter();
  P.lessonId = null;
  startDeck(ed.items.map(it => ({ doc: ed.sources[it.src].doc, page: it.page })));
}
function openPresenter() {
  const el = $('presenter'); el.hidden = false; document.body.style.overflow = 'hidden';
  P.keepOnFsExit = false;
  if (el.requestFullscreen && !document.fullscreenElement) {
    el.requestFullscreen({ navigationUI: 'hide' }).then(() => { P.fs = true; }).catch(() => { P.fs = false; });
  }
  pokeUI();
}
function startDeck(pages) { P.pages = pages; P.i = 0; P.cache.clear(); P.token++; showSlide(0); }
function showPresenterMessage(msg) {
  const stage = $('stage'); stage.querySelector('.p-msg')?.remove();
  if (msg) stage.append(h('div', { class: 'p-msg', text: msg }));
}
function cacheKey(i) { return `${i}@${window.innerWidth}x${window.innerHeight}`; }
function renderSlideCanvas(i) {
  const key = cacheKey(i);
  if (!P.cache.has(key)) {
    const { doc, page } = P.pages[i];
    const pr = renderPage(doc, page, window.innerWidth, window.innerHeight);
    pr.catch(() => P.cache.delete(key));
    P.cache.set(key, pr);
    if (P.cache.size > 6) P.cache.delete(P.cache.keys().next().value);
  }
  return P.cache.get(key);
}
async function showSlide(i) {
  if (!P.pages || !P.pages.length) return;
  i = Math.max(0, Math.min(P.pages.length - 1, i));
  P.i = i;
  $('pCount').textContent = `${i + 1} / ${P.pages.length}`;
  const token = ++P.token;
  try {
    const src = await renderSlideCanvas(i);
    if (token !== P.token) return;
    showPresenterMessage(null);
    const c = $('slideCanvas');
    c.width = src.width; c.height = src.height; c.style.width = src.style.width; c.style.height = src.style.height;
    c.getContext('2d').drawImage(src, 0, 0);
    if (P.lessonId && i === P.pages.length - 1 && !P.celebrated) { P.celebrated = true; setDone(P.lessonId, true); celebrate(); }
    // warm up neighbours
    if (i + 1 < P.pages.length) renderSlideCanvas(i + 1);
    if (i > 0) renderSlideCanvas(i - 1);
  } catch (e) { showPresenterMessage(t('error') + e.message); }
}
function celebrate() {
  const box = $('celebrate'); box.innerHTML = ''; box.hidden = false;
  const bits = ['⭐', '🎉', '✨', '🌟', '🎈', '💛'];
  for (let k = 0; k < 28; k++) box.append(h('span', { text: bits[k % bits.length], style: `left:${Math.random() * 100}%;animation-delay:${Math.random() * .9}s;font-size:${22 + Math.random() * 22}px` }));
  box.append(h('div', { class: 'msg', text: t('lessonComplete') }));
  clearTimeout(celebrate.t); celebrate.t = setTimeout(() => { box.hidden = true; box.innerHTML = ''; }, 3200);
}
function closePresenter() {
  $('celebrate').hidden = true;
  const wasLesson = P.lessonId; P.lessonId = null;
  if (wasLesson && !$('presenter').hidden) setTimeout(render, 0);
  $('presenter').hidden = true; document.body.style.overflow = ''; P.pages = null; P.cache.clear(); P.token++;
  if (document.fullscreenElement) { P.keepOnFsExit = true; document.exitFullscreen().catch(() => {}); }
}
function pokeUI() {
  const el = $('presenter'); el.classList.add('show-ui');
  clearTimeout(P.uiTimer); P.uiTimer = setTimeout(() => el.classList.remove('show-ui'), 2600);
}
const isRtl = () => document.documentElement.dir === 'rtl';
$('pPrev').onclick = () => showSlide(P.i - 1);
$('pNext').onclick = () => showSlide(P.i + 1);
$('prevZone').onclick = () => showSlide(P.i + (isRtl() ? 1 : -1));
$('nextZone').onclick = () => showSlide(P.i + (isRtl() ? -1 : 1));
$('pClose').onclick = closePresenter;
$('pFull').onclick = () => {
  if (document.fullscreenElement) { P.keepOnFsExit = true; document.exitFullscreen(); }
  else $('presenter').requestFullscreen?.().catch(() => {});
};
$('pRecord').onclick = () => { P.keepOnFsExit = true; toggleRecording(); };
$('presenter').addEventListener('mousemove', pokeUI);
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && !$('presenter').hidden) {
    if (P.keepOnFsExit) { P.keepOnFsExit = false; return; }
    closePresenter(); // Esc in fullscreen ends the show, like PowerPoint
  }
});
document.addEventListener('keydown', e => {
  if ($('presenter').hidden) return;
  const k = e.key;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter', 'n', 'N'].includes(k)) { e.preventDefault(); showSlide(P.i + 1); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'p', 'P'].includes(k)) { e.preventDefault(); showSlide(P.i - 1); }
  else if (k === 'Home') { e.preventDefault(); showSlide(0); }
  else if (k === 'End') { e.preventDefault(); showSlide(P.pages ? P.pages.length - 1 : 0); }
  else if (k === 'Escape') { e.preventDefault(); closePresenter(); }
  else if (k === 'f' || k === 'F') { $('pFull').click(); }
});
let touchX = null;
$('presenter').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
$('presenter').addEventListener('touchend', e => {
  if (touchX == null) return; const dx = e.changedTouches[0].clientX - touchX; touchX = null;
  if (Math.abs(dx) > 50) showSlide(P.i + ((dx < 0) !== isRtl() ? 1 : -1));
});
let resizeT;
window.addEventListener('resize', () => { if (!P.pages) return; clearTimeout(resizeT); resizeT = setTimeout(() => { P.cache.clear(); showSlide(P.i); }, 150); });

/* ───────────────────────── Screen + voice recording ───────────────────────── */
const R = { rec: null, chunks: [], streams: [], ctx: null, start: 0, timer: null };
async function toggleRecording() {
  if (R.rec) { stopRecording(); return; }
  if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) { toast(t('recUnsupported'), true); return; }
  let display;
  try {
    display = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true, selfBrowserSurface: 'include', surfaceSwitching: 'include' });
  } catch (e) { toast(t('recCancelled')); return; }
  let mic = null;
  try { mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
  catch (e) { toast(t('micDenied'), true); }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const dest = ctx.createMediaStreamDestination();
  let hasAudio = false;
  for (const s of [display, mic]) {
    if (s && s.getAudioTracks().length) { ctx.createMediaStreamSource(new MediaStream(s.getAudioTracks())).connect(dest); hasAudio = true; }
  }
  const tracks = [...display.getVideoTracks(), ...(hasAudio ? dest.stream.getAudioTracks() : [])];
  const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(m => MediaRecorder.isTypeSupported(m)) || '';
  const rec = new MediaRecorder(new MediaStream(tracks), mime ? { mimeType: mime, videoBitsPerSecond: 3_500_000 } : undefined);
  Object.assign(R, { rec, chunks: [], streams: [display, mic].filter(Boolean), ctx, start: Date.now() });
  rec.ondataavailable = e => { if (e.data && e.data.size) R.chunks.push(e.data); };
  rec.onstop = () => {
    const type = rec.mimeType || 'video/webm';
    const blob = new Blob(R.chunks, { type });
    const d = new Date(); const stamp = d.toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
    if (blob.size) { saveBlob(blob, `lesson-recording_${stamp}.${type.includes('mp4') ? 'mp4' : 'webm'}`); toast(t('recSaved')); }
    R.streams.forEach(s => s.getTracks().forEach(tr => tr.stop()));
    R.ctx && R.ctx.close().catch(() => {});
    Object.assign(R, { rec: null, chunks: [], streams: [], ctx: null });
    clearInterval(R.timer); $('recBadge').hidden = true;
    document.querySelectorAll('#recordBtn .rec-dot, #pRecord .rec-dot').forEach(d => d.classList.remove('live'));
  };
  display.getVideoTracks()[0].addEventListener('ended', stopRecording);
  rec.start(1000);
  $('recBadge').hidden = false;
  document.querySelectorAll('#recordBtn .rec-dot, #pRecord .rec-dot').forEach(d => d.classList.add('live'));
  const tick = () => { const s = Math.floor((Date.now() - R.start) / 1000); $('recTime').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  tick(); R.timer = setInterval(tick, 500);
}
function stopRecording() { if (R.rec && R.rec.state !== 'inactive') R.rec.stop(); }
$('recordBtn').onclick = toggleRecording;
$('recStop').onclick = stopRecording;

/* ───────────────────────── Auth ───────────────────────── */
$('adminBtn').onclick = async () => {
  if (!online) return;
  if (state.user) { await api.signOut(); state.user = null; state.isAdmin = false; applyLang(); render(); return; }
  $('loginError').hidden = true; openModal('loginModal');
};
$('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  $('loginError').hidden = true;
  try {
    busy(t('loading'));
    const user = await api.signIn($('loginEmail').value.trim(), $('loginPassword').value);
    state.user = user; state.isAdmin = await api.checkAdmin(user);
    closeModal('loginModal'); $('loginPassword').value = '';
    if (!state.isAdmin) toast(t('notAdmin'), true);
    applyLang(); render();
  } catch (err) {
    $('loginError').textContent = t('signInFailed'); $('loginError').hidden = false;
  } finally { done(); }
});

/* ───────────────────────── Boot ───────────────────────── */
async function reload() {
  const [topics, lessons] = await Promise.all([api.listTopics(), api.listLessons()]);
  state.topics = topics || []; state.lessons = (lessons || []).map(l => ({ ...l, files: l.files || {}, titles: l.titles || {}, videos: l.videos || {} }));
  render();
}
async function boot() {
  applyLang();
  try {
    state.user = await api.session();
    state.isAdmin = await api.checkAdmin(state.user);
  } catch (e) { state.user = null; state.isAdmin = false; }
  applyLang();
  state.route = parseHash();
  try { await reload(); }
  catch (e) { console.error(e); render(); toast(t('loadFailed'), true); }
}
boot();
})();
