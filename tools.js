/* Lectures Presenter — Teacher tools.
   Everything here runs in the browser: Excel files, pictures and PDFs are never uploaded.
   Pages are drawn on a canvas (so Arabic is shaped correctly by the browser) and saved as PDF with pdf-lib. */
(() => {
'use strict';
const L = window.LPT; if (!L) return;
const { t, h, T, toast, busy, done, saveBlob, go } = L;

/* ───────────── texts (editable in Edit mode like every other text) ───────────── */
const STR = {
  en: {
    tl_open: 'Open', tl_makerDesc: 'Turn pictures into a lesson PDF — drag to sort, then download or save as a lesson.',
    tl_booklet: 'Memorization booklet', tl_bookletDesc: 'A weekly tracking booklet with one table per lesson day, ready to print and fold.',
    tl_cert: 'Certificates & name slides', tl_certDesc: 'Put names from Excel onto your certificate design — drag the text where you want it.',
    tl_att: 'Attendance sheets', tl_attDesc: 'Printable attendance lists from your Excel class list, one page per month.',
    tl_design: 'Design', tl_builtIn: 'Built-in layout', tl_myTemplate: 'My own PDF template', tl_templateFile: 'Template (1-page PDF)',
    tl_placeholders: 'Write these tags as text in your design: {{MONTH}}, {{DATE_1}}, {{DATE_2}}, {{DATE_3}} and optionally {{PAGE_NUM}}.',
    tl_title: 'Title', tl_start: 'Start date', tl_end: 'End date', tl_weekday: 'Day of the week', tl_perPage: 'Days per page',
    tl_textSize: 'Text size', tl_font: 'Font', tl_dateLang: 'Date language', tl_rowLabels: 'Row labels', tl_score: 'Score box',
    tl_notesTitle: 'Notes page title', tl_covers: 'Covers (optional)', tl_front: 'Front cover', tl_back: 'Back cover',
    tl_pad4: 'Make the page count a multiple of 4 (adds notes pages) — for folded booklets', tl_labelsRight: 'Labels on the right side',
    tl_page: 'Page', tl_totalPages: (n, m) => `${n} pages · ${m} lesson days`, tl_div4: 'ready to fold', tl_download: 'Download PDF',
    tl_noDates: 'No matching days in that date range.', tl_needTemplate: 'Upload your template PDF.',
    tl_uploadFont: 'Add my own font', tl_fontAdded: 'Font added', tl_choose: 'Choose file', tl_remove: 'Remove',
    tl_excel: 'Excel list', tl_excelHint: 'Drop an Excel file (.xlsx, .xls or .csv) here, or click to choose.',
    tl_sheet: 'Sheet', tl_sheets: 'Sheets', tl_rows: n => `${n} rows`, tl_templates: 'Certificate designs (pictures)',
    tl_male: 'Boys / main design', tl_female: 'Girls design (optional)', tl_genderCol: 'Boy / girl column', tl_idCol: 'Number column (for file names)',
    tl_none: '— none —', tl_fixedText: '✎ Type a text', tl_fields: 'Text on the certificate', tl_addField: 'Add text',
    tl_fieldCol: 'Column', tl_subCol: 'Second line (optional)', tl_suffix: 'Add after numbers', tl_size: 'Size', tl_subSize: '2nd line size',
    tl_maxW: 'Max width', tl_arFont: 'Arabic font', tl_enFont: 'Latin font', tl_color: 'Text colour',
    tl_dragHint: 'Drag the dashed boxes on the picture to move the text.', tl_preview: 'Preview', tl_row: 'Row',
    tl_generate: n => `Make all ${n}`, tl_zip: 'Download pictures (ZIP)', tl_pdfAll: 'Download one PDF', tl_making: (i, n) => `Making ${i} of ${n}…`,
    tl_needDesign: 'Add a certificate design picture to start.', tl_needExcel: 'Add your Excel file to start.',
    tl_nameCol: 'Names column', tl_headerRow: 'First row is a header', tl_perPageStudents: 'Students per page', tl_nameW: 'Name column width',
    tl_numbers: 'Number column (#)', tl_notesLabel: 'Header above the dates', tl_lineW: 'Line thickness', tl_showSheet: 'Show the sheet name on each page',
    tl_studentName: 'Student name', tl_text: 'Text', tl_fieldName: 'Name', tl_fieldLevel: 'Level', tl_fieldCity: 'City', tl_ready: 'Ready', tl_month: 'Month'
  },
  ar: {
    tl_open: 'فتح', tl_makerDesc: 'حوّل الصور إلى ملف PDF للدرس — رتّبها بالسحب ثم نزّلها أو احفظها كدرس.',
    tl_booklet: 'دفتر متابعة الحفظ', tl_bookletDesc: 'دفتر متابعة أسبوعي بجدول لكل يوم درس، جاهز للطباعة والطي.',
    tl_cert: 'الشهادات وشرائح الأسماء', tl_certDesc: 'ضع الأسماء من ملف Excel على تصميم الشهادة — واسحب النص إلى المكان الذي تريده.',
    tl_att: 'كشوف الحضور', tl_attDesc: 'كشوف حضور قابلة للطباعة من قائمة الطلاب في Excel، صفحة لكل شهر.',
    tl_design: 'التصميم', tl_builtIn: 'التصميم الجاهز', tl_myTemplate: 'قالب PDF خاص بي', tl_templateFile: 'القالب (PDF من صفحة واحدة)',
    tl_placeholders: 'اكتب هذه الوسوم كنص في تصميمك: {{MONTH}} و{{DATE_1}} و{{DATE_2}} و{{DATE_3}} واختياريًا {{PAGE_NUM}}.',
    tl_title: 'العنوان', tl_start: 'تاريخ البداية', tl_end: 'تاريخ النهاية', tl_weekday: 'يوم الأسبوع', tl_perPage: 'أيام في كل صفحة',
    tl_textSize: 'حجم النص', tl_font: 'الخط', tl_dateLang: 'لغة التاريخ', tl_rowLabels: 'عناوين الصفوف', tl_score: 'خانة الدرجة',
    tl_notesTitle: 'عنوان صفحة الملاحظات', tl_covers: 'الأغلفة (اختياري)', tl_front: 'الغلاف الأمامي', tl_back: 'الغلاف الخلفي',
    tl_pad4: 'اجعل عدد الصفحات من مضاعفات 4 (تُضاف صفحات ملاحظات) — للدفاتر المطوية', tl_labelsRight: 'العناوين على الجهة اليمنى',
    tl_page: 'صفحة', tl_totalPages: (n, m) => `${n} صفحة · ${m} يوم درس`, tl_div4: 'جاهز للطي', tl_download: 'تنزيل PDF',
    tl_noDates: 'لا توجد أيام مطابقة في هذه الفترة.', tl_needTemplate: 'ارفع قالب PDF الخاص بك.',
    tl_uploadFont: 'أضف خطًا خاصًا بي', tl_fontAdded: 'تمت إضافة الخط', tl_choose: 'اختر ملفًا', tl_remove: 'إزالة',
    tl_excel: 'قائمة Excel', tl_excelHint: 'أسقط ملف Excel ‏(.xlsx أو .xls أو .csv) هنا، أو اضغط للاختيار.',
    tl_sheet: 'الورقة', tl_sheets: 'الأوراق', tl_rows: n => `${n} صف`, tl_templates: 'تصاميم الشهادة (صور)',
    tl_male: 'تصميم البنين / الأساسي', tl_female: 'تصميم البنات (اختياري)', tl_genderCol: 'عمود ولد / بنت', tl_idCol: 'عمود الرقم (لأسماء الملفات)',
    tl_none: '— لا شيء —', tl_fixedText: '✎ اكتب نصًا', tl_fields: 'النصوص على الشهادة', tl_addField: 'إضافة نص',
    tl_fieldCol: 'العمود', tl_subCol: 'سطر ثانٍ (اختياري)', tl_suffix: 'يضاف بعد الأرقام', tl_size: 'الحجم', tl_subSize: 'حجم السطر الثاني',
    tl_maxW: 'أقصى عرض', tl_arFont: 'الخط العربي', tl_enFont: 'الخط اللاتيني', tl_color: 'لون النص',
    tl_dragHint: 'اسحب المربعات المنقطة على الصورة لتحريك النص.', tl_preview: 'معاينة', tl_row: 'الصف',
    tl_generate: n => `اصنع الكل (${n})`, tl_zip: 'تنزيل الصور (ZIP)', tl_pdfAll: 'تنزيل ملف PDF واحد', tl_making: (i, n) => `جارٍ صنع ${i} من ${n}…`,
    tl_needDesign: 'أضف صورة تصميم الشهادة للبدء.', tl_needExcel: 'أضف ملف Excel للبدء.',
    tl_nameCol: 'عمود الأسماء', tl_headerRow: 'الصف الأول عناوين', tl_perPageStudents: 'طلاب في كل صفحة', tl_nameW: 'عرض عمود الاسم',
    tl_numbers: 'عمود الترقيم (#)', tl_notesLabel: 'العنوان فوق التواريخ', tl_lineW: 'سُمك الخطوط', tl_showSheet: 'إظهار اسم الورقة في كل صفحة',
    tl_studentName: 'اسم الطالب', tl_text: 'نص', tl_fieldName: 'الاسم', tl_fieldLevel: 'المستوى', tl_fieldCity: 'المدينة', tl_ready: 'جاهز', tl_month: 'الشهر'
  },
  fi: {
    tl_open: 'Avaa', tl_makerDesc: 'Tee kuvista oppitunnin PDF — järjestä vetämällä, lataa tai tallenna oppitunniksi.',
    tl_booklet: 'Ulkoluvun seurantavihko', tl_bookletDesc: 'Viikoittainen seurantavihko, yksi taulukko per oppituntipäivä — valmis tulostettavaksi ja taitettavaksi.',
    tl_cert: 'Todistukset ja nimidiat', tl_certDesc: 'Lisää nimet Excelistä todistuspohjaan — vedä teksti haluamaasi kohtaan.',
    tl_att: 'Läsnäololistat', tl_attDesc: 'Tulostettavat läsnäololistat Excel-luokkalistasta, sivu kuukautta kohden.',
    tl_design: 'Ulkoasu', tl_builtIn: 'Valmis asettelu', tl_myTemplate: 'Oma PDF-pohja', tl_templateFile: 'Pohja (1-sivuinen PDF)',
    tl_placeholders: 'Kirjoita nämä tunnisteet tekstinä pohjaasi: {{MONTH}}, {{DATE_1}}, {{DATE_2}}, {{DATE_3}} ja halutessasi {{PAGE_NUM}}.',
    tl_title: 'Otsikko', tl_start: 'Alkupäivä', tl_end: 'Loppupäivä', tl_weekday: 'Viikonpäivä', tl_perPage: 'Päiviä per sivu',
    tl_textSize: 'Tekstin koko', tl_font: 'Fontti', tl_dateLang: 'Päivämäärän kieli', tl_rowLabels: 'Rivien otsikot', tl_score: 'Pistelaatikko',
    tl_notesTitle: 'Muistiinpanosivun otsikko', tl_covers: 'Kannet (valinnainen)', tl_front: 'Etukansi', tl_back: 'Takakansi',
    tl_pad4: 'Tee sivumäärästä neljällä jaollinen (lisää muistiinpanosivuja) — taitettaviin vihkoihin', tl_labelsRight: 'Otsikot oikealla puolella',
    tl_page: 'Sivu', tl_totalPages: (n, m) => `${n} sivua · ${m} oppituntipäivää`, tl_div4: 'valmis taitettavaksi', tl_download: 'Lataa PDF',
    tl_noDates: 'Valitulla aikavälillä ei ole sopivia päiviä.', tl_needTemplate: 'Lataa PDF-pohjasi.',
    tl_uploadFont: 'Lisää oma fontti', tl_fontAdded: 'Fontti lisätty', tl_choose: 'Valitse tiedosto', tl_remove: 'Poista',
    tl_excel: 'Excel-lista', tl_excelHint: 'Pudota Excel-tiedosto (.xlsx, .xls tai .csv) tähän tai valitse napsauttamalla.',
    tl_sheet: 'Taulukko', tl_sheets: 'Taulukot', tl_rows: n => `${n} riviä`, tl_templates: 'Todistuspohjat (kuvat)',
    tl_male: 'Poikien / pääpohja', tl_female: 'Tyttöjen pohja (valinnainen)', tl_genderCol: 'Poika / tyttö -sarake', tl_idCol: 'Numerosarake (tiedostonimiin)',
    tl_none: '— ei mitään —', tl_fixedText: '✎ Kirjoita teksti', tl_fields: 'Tekstit todistuksessa', tl_addField: 'Lisää teksti',
    tl_fieldCol: 'Sarake', tl_subCol: 'Toinen rivi (valinnainen)', tl_suffix: 'Lisää numeroiden perään', tl_size: 'Koko', tl_subSize: '2. rivin koko',
    tl_maxW: 'Enimmäisleveys', tl_arFont: 'Arabialainen fontti', tl_enFont: 'Latinalainen fontti', tl_color: 'Tekstin väri',
    tl_dragHint: 'Siirrä tekstiä vetämällä katkoviivalaatikoita kuvassa.', tl_preview: 'Esikatselu', tl_row: 'Rivi',
    tl_generate: n => `Tee kaikki ${n}`, tl_zip: 'Lataa kuvat (ZIP)', tl_pdfAll: 'Lataa yksi PDF', tl_making: (i, n) => `Tehdään ${i}/${n}…`,
    tl_needDesign: 'Lisää todistuspohjan kuva aloittaaksesi.', tl_needExcel: 'Lisää Excel-tiedosto aloittaaksesi.',
    tl_nameCol: 'Nimisarake', tl_headerRow: 'Ensimmäinen rivi on otsikko', tl_perPageStudents: 'Oppilaita per sivu', tl_nameW: 'Nimisarakkeen leveys',
    tl_numbers: 'Numerosarake (#)', tl_notesLabel: 'Otsikko päivämäärien yllä', tl_lineW: 'Viivan paksuus', tl_showSheet: 'Näytä taulukon nimi jokaisella sivulla',
    tl_studentName: 'Oppilaan nimi', tl_text: 'Teksti', tl_fieldName: 'Nimi', tl_fieldLevel: 'Taso', tl_fieldCity: 'Kaupunki', tl_ready: 'Valmis', tl_month: 'Kuukausi'
  }
};
for (const l of Object.keys(STR)) Object.assign(T[l], STR[l]);

/* ───────────── shared helpers ───────────── */
const A4 = { w: 595.28, h: 841.89 };
const K = 2;                                   // canvas pixels per PDF point (~144 dpi)
const LOCALE = { en: 'en-GB', ar: 'ar', fi: 'fi-FI' };
const FONT_LIST = ['Amiri', 'Baloo Bhaijaan 2', 'Cairo', 'Scheherazade New', 'Nunito', 'Baloo 2', 'Arial', 'Georgia', 'Times New Roman'];
const customFonts = [];
const fontStack = fam => `"${fam}", "Amiri", "Nunito", sans-serif`;
const isArabic = s => /[؀-ۿݐ-ݿࢠ-ࣿ]/.test(String(s));
const loadedScripts = {};
const need = src => loadedScripts[src] || (loadedScripts[src] = new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = src; s.onload = res;
  s.onerror = () => { delete loadedScripts[src]; rej(new Error('Could not load ' + src)); };
  document.head.append(s);
}));
async function ensureFonts(...fams) {
  try { await Promise.all(fams.flatMap(f => [document.fonts.load(`400 24px "${f}"`, 'aب'), document.fonts.load(`700 24px "${f}"`, 'aب')])); } catch (e) {}
}
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseISO = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
function weekdayDates(start, end, wd) {
  const out = []; let d = new Date(start);
  while (d.getDay() !== wd) d = addDays(d, 1);
  for (; d <= end; d = addDays(d, 7)) out.push(new Date(d));
  return out;
}
const weekdayNames = () => [1, 2, 3, 4, 5, 6, 0].map(wd => ({ wd, name: new Date(2024, 0, wd === 0 ? 7 : wd).toLocaleDateString(LOCALE[L.state.lang], { weekday: 'long' }) }));
const fmtDay = (d, lang) => d.toLocaleDateString(LOCALE[lang], { day: '2-digit', month: 'long' });
const fmtMonth = (d, lang) => d.toLocaleDateString(LOCALE[lang], { month: 'long', year: 'numeric' });
function newPage(w = A4.w, hgt = A4.h) {
  const c = document.createElement('canvas'); c.width = Math.round(w * K); c.height = Math.round(hgt * K);
  const ctx = c.getContext('2d'); ctx.scale(K, K); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, hgt);
  return { c, ctx, w, h: hgt };
}
const canvasJpeg = (c, q = 0.9) => new Promise(r => c.toBlob(b => b.arrayBuffer().then(a => r(new Uint8Array(a))), 'image/jpeg', q));
const canvasPng = c => new Promise(r => c.toBlob(r, 'image/png'));
async function fileInfo(file) {
  const bytes = await file.arrayBuffer();
  if (/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name)) return { name: file.name, kind: 'pdf', bytes };
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Not a picture')); i.src = URL.createObjectURL(file); });
  return { name: file.name, kind: 'img', img, bytes };
}
async function pdfToCanvas(bytes, width) {
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(bytes.slice(0)) }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const vp = page.getViewport({ scale: width / base.width });
  const c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  return { c, page, vp, base, doc };
}
function drawContain(ctx, img, w, hgt) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const s = Math.min(w / iw, hgt / ih), dw = iw * s, dh = ih * s;
  ctx.drawImage(img, (w - dw) / 2, (hgt - dh) / 2, dw, dh);
}
// pages: [{ canvas, w, h }] or [{ pdfBytes }] (copied as-is, vector)
async function buildPdf(pages, onStep) {
  const { PDFDocument } = PDFLib;
  const out = await PDFDocument.create();
  for (let i = 0; i < pages.length; i++) {
    const p = await pages[i]();
    if (onStep) onStep(i + 1, pages.length);
    if (p.pdfBytes) {
      const src = await PDFDocument.load(p.pdfBytes, { ignoreEncryption: true });
      const [pg] = await out.copyPages(src, [0]); out.addPage(pg);
    } else {
      const jpg = await out.embedJpg(await canvasJpeg(p.canvas));
      const pg = out.addPage([p.w, p.h]); pg.drawImage(jpg, { x: 0, y: 0, width: p.w, height: p.h });
    }
    await new Promise(r => setTimeout(r, 0));
  }
  return out.save();
}
function fitFont(ctx, text, weight, size, fam, maxW, min = 6) {
  let s = size;
  ctx.font = `${weight} ${s}px ${fontStack(fam)}`;
  while (s > min && ctx.measureText(text).width > maxW) { s -= 0.5; ctx.font = `${weight} ${s}px ${fontStack(fam)}`; }
  return s;
}
function wrapLines(ctx, text, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean); if (!words.length) return [''];
  const lines = []; let cur = words[0];
  for (const w of words.slice(1)) { const tr = cur + ' ' + w; if (ctx.measureText(tr).width <= maxW) cur = tr; else { lines.push(cur); cur = w; } }
  lines.push(cur); return lines;
}
async function readWorkbook(file) {
  await need('vendor/xlsx.full.min.js');
  const wb = XLSX.read(new Uint8Array(await file.arrayBuffer()), { type: 'array', cellDates: true });
  const sheets = {};
  wb.SheetNames.forEach(n => { sheets[n] = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '', raw: false }).filter(r => r.some(c => String(c).trim() !== '')); });
  return { names: wb.SheetNames, sheets, file: file.name };
}
const colLetter = i => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
const safe = s => String(s || '').replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 80) || 'file';

/* ───────────── small UI builders ───────────── */
function debounce(fn, ms = 180) { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), ms); }; }
function fld(labelKey, control, cls = '') { return h('label', { class: 'tf ' + cls }, h('span', { text: t(labelKey) }), control); }
function input(obj, key, attrs = {}, onch) {
  const el = h('input', { ...attrs });
  if (attrs.type === 'checkbox') { el.checked = !!obj[key]; el.onchange = () => { obj[key] = el.checked; onch && onch(); }; }
  else { el.value = obj[key] ?? ''; el.oninput = () => { obj[key] = attrs.type === 'number' || attrs.type === 'range' ? +el.value : el.value; onch && onch(); }; }
  return el;
}
function select(obj, key, options, onch, num = false) {
  const el = h('select', {}, options.map(o => h('option', { value: o.value, text: o.label })));
  el.value = String(obj[key]); el.onchange = () => { obj[key] = num ? +el.value : el.value; onch && onch(); };
  return el;
}
const fontOptions = () => [...customFonts, ...FONT_LIST].map(f => ({ value: f, label: f }));
function fontUpload(onAdded) {
  const inp = h('input', { type: 'file', accept: '.ttf,.otf,.woff,.woff2', hidden: true });
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      const fam = f.name.replace(/\.[^.]+$/, '');
      const ff = new FontFace(fam, await f.arrayBuffer()); await ff.load(); document.fonts.add(ff);
      if (!customFonts.includes(fam)) customFonts.unshift(fam);
      toast(t('tl_fontAdded') + ': ' + fam); onAdded && onAdded(fam);
    } catch (e) { toast(t('error') + e.message, true); }
  };
  return h('label', { class: 'btn small' }, '🔤 ', t('tl_uploadFont'), inp);
}
function fileDrop(labelKey, accept, current, onFile, onRemove) {
  const inp = h('input', { type: 'file', accept, hidden: true });
  inp.onchange = () => { if (inp.files[0]) onFile(inp.files[0]); inp.value = ''; };
  const lab = h('label', { class: 'tdrop' + (current ? ' has' : '') }, h('b', { text: t(labelKey) }), h('span', { text: current ? '✓ ' + current : t('tl_choose') }), inp);
  ['dragenter', 'dragover'].forEach(ev => lab.addEventListener(ev, e => { e.preventDefault(); lab.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => lab.addEventListener(ev, e => { e.preventDefault(); lab.classList.remove('over'); }));
  lab.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; if (f) onFile(f); });
  const wrap = h('div', { class: 'tdrop-wrap' }, lab);
  if (current && onRemove) wrap.append(h('button', { type: 'button', class: 'btn small danger', title: t('tl_remove'), onclick: onRemove }, '✕'));
  return wrap;
}
function pager(state, total, onChange) {
  const n = h('span', { class: 'pg-n', text: `${t('tl_page')} ${state.page + 1} / ${total}` });
  return h('div', { class: 'pager' },
    h('button', { type: 'button', class: 'btn small', disabled: state.page <= 0, onclick: () => { state.page--; onChange(); } }, '‹'), n,
    h('button', { type: 'button', class: 'btn small', disabled: state.page >= total - 1, onclick: () => { state.page++; onChange(); } }, '›'));
}
function shell(root, icon, titleKey, descKey) {
  root.append(
    h('nav', { class: 'crumbs' }, h('a', { href: '#', 'data-go': 'home', text: t('allTopics') }), h('span', { text: '›' }), h('a', { href: '#/tools', text: t('tools') }), h('span', { text: '›' }), h('span', { text: t(titleKey) })),
    h('div', { class: 'view-head' }, h('div', {}, h('h1', {}, icon + ' ', t(titleKey)), h('p', { class: 'muted', text: t(descKey) }))));
  const form = h('div', { class: 'tool-form' }), side = h('div', { class: 'tool-preview' });
  root.append(h('div', { class: 'tool-layout' }, form, side));
  return { form, side };
}

/* ═════════════ Hub ═════════════ */
function renderHub(root) {
  root.append(
    h('nav', { class: 'crumbs' }, h('a', { href: '#', 'data-go': 'home', text: t('allTopics') }), h('span', { text: '›' }), h('span', { text: t('tools') })),
    h('div', { class: 'view-head' }, h('div', {}, h('h1', {}, '🧰 ', t('tools')), h('p', { class: 'muted', text: t('toolsSub') }))));
  const cards = [
    ['🛠', 'maker', 'tl_makerDesc', '#/maker', '#5b4fe0'],
    ['📖', 'tl_booklet', 'tl_bookletDesc', '#/tools/booklet', '#22b573'],
    ['🏅', 'tl_cert', 'tl_certDesc', '#/tools/certificates', '#ff8a3d'],
    ['📋', 'tl_att', 'tl_attDesc', '#/tools/attendance', '#2aa8e0']
  ];
  root.append(h('div', { class: 'tool-grid' }, cards.map(([ic, tk, dk, href, c]) =>
    h('a', { class: 'tool-card', href, style: `--c:${c}` }, h('span', { class: 'tc-ic', text: ic }), h('b', { text: t(tk) }), h('small', { text: t(dk) }), h('span', { class: 'tc-go', text: t('tl_open') + ' →' })))));
}

/* ═════════════ 1) Memorization booklet ═════════════ */
const today = new Date();
const B = {
  mode: 'builtin', title: 'دَفْتَرُ مُتَابَعَةِ حِفْظِ القُرْآنِ الكَرِيم', start: iso(today), end: iso(addDays(today, 90)), weekday: 0,
  perPage: 2, scale: 1.3, font: 'Amiri', dateLang: 'en', pad4: true, labelsRight: false, score: '/5', notesTitle: 'ملاحظات / Notes',
  labels: [['الحفظ الجديد', 'New practice'], ['الماضي - المراجعة', 'Revision'], ['الملاحظات', 'Notes'], ['إمضاء ولي الأمر', 'Parent signature']],
  front: null, back: null, template: null, tplScale: 1, page: 0, tpl: null
};
const ROWS = { 1: [1.2, 4.8, 4.8, 4.2, 3.5], 2: [0.9, 2.5, 2.5, 1.8, 1.8], 3: [0.7, 1.6, 1.6, 1.1, 1.1] };
const BASE = { 1: [14, 10], 2: [11, 8.5], 3: [9.5, 7.5] };
const CM = 28.3465;

function bookletPlan() {
  const dates = weekdayDates(parseISO(B.start), parseISO(B.end), +B.weekday);
  const per = Math.max(1, Math.min(3, +B.perPage || 2));
  const chunks = []; for (let i = 0; i < dates.length; i += per) chunks.push(dates.slice(i, i + per));
  const breaks = [];
  for (let i = 0; i < chunks.length - 1; i++) if (chunks[i][0].getMonth() !== chunks[i + 1][0].getMonth()) breaks.push(i);
  const covers = (B.front ? 1 : 0) + (B.back ? 1 : 0);
  let needed = B.pad4 ? (4 - ((chunks.length + covers) % 4)) % 4 : 0;
  const blankAfter = [];
  for (const b of breaks) if (needed > 0) { blankAfter.push(b); needed--; }
  while (needed-- > 0) blankAfter.push(chunks.length - 1);
  const pages = []; let num = 1;
  if (B.front) pages.push({ type: 'cover', file: B.front });
  chunks.forEach((c, i) => {
    pages.push({ type: 'content', dates: c, num: num++ });
    blankAfter.filter(x => x === i).forEach(() => pages.push({ type: 'notes', num: num++ }));
  });
  if (B.back) pages.push({ type: 'cover', file: B.back });
  return { pages, dates };
}
function pageSize() { return B.mode === 'template' && B.tpl ? { w: B.tpl.w, h: B.tpl.h } : A4; }

function drawCentered(ctx, text, x, y, size, weight = 400, fam = B.font, maxW = 9999) {
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = isArabic(text) ? 'rtl' : 'ltr';
  fitFont(ctx, text, weight, size, fam, maxW);
  ctx.fillText(text, x, y);
}
function drawFooter(ctx, w, hgt, num) {
  ctx.fillStyle = '#666'; drawCentered(ctx, `—— [ ${num} ] ——`, w / 2, hgt - 18, 10, 400, 'Nunito');
}
function drawDayTable(ctx, d, x0, y0) {
  const per = +B.perPage, s = +B.scale;
  const rh = ROWS[per].map(v => v * CM), [arB, enB] = BASE[per];
  const ar = Math.max(6, Math.floor(arB * s)), en = Math.max(5, Math.floor(enB * s));
  let cw = [4.8 * CM, 10.7 * CM, 2.5 * CM];
  const total = cw.reduce((a, b) => a + b, 0);
  // x positions of label / writing / score columns (mirrored when labels are on the right)
  const colX = B.labelsRight ? [x0 + cw[2] + cw[1], x0 + cw[2], x0] : [x0, x0 + cw[0], x0 + cw[0] + cw[1]];
  let y = y0;
  ctx.strokeStyle = '#2C3E50'; ctx.lineWidth = 1;
  // header
  ctx.fillStyle = '#D8EDF8'; ctx.fillRect(x0, y, total, rh[0]); ctx.strokeRect(x0, y, total, rh[0]);
  ctx.fillStyle = '#1d2b38'; drawCentered(ctx, fmtDay(d, B.dateLang), x0 + total / 2, y + rh[0] / 2, ar + 1, 700);
  y += rh[0];
  for (let r = 1; r <= 4; r++) {
    const hgt = rh[r], [la, le] = B.labels[r - 1];
    ctx.strokeRect(colX[0], y, cw[0], hgt);
    if (r <= 2) { ctx.strokeRect(colX[1], y, cw[1], hgt); ctx.strokeRect(colX[2], y, cw[2], hgt); }
    else ctx.strokeRect(Math.min(colX[1], colX[2]), y, cw[1] + cw[2], hgt);
    ctx.fillStyle = '#1d2b38';
    const cx = colX[0] + cw[0] / 2, my = y + hgt / 2;
    if (la && le) { drawCentered(ctx, la, cx, my - ar * 0.55, ar, 700, B.font, cw[0] - 8); drawCentered(ctx, le, cx, my + en * 0.75, en, 400, B.font, cw[0] - 8); }
    else drawCentered(ctx, la || le, cx, my, ar, 700, B.font, cw[0] - 8);
    if (r <= 2 && B.score) drawCentered(ctx, B.score, colX[2] + cw[2] / 2, my, ar, 700);
    y += hgt;
  }
  return y - y0;
}
function drawContentPage(pg) {
  const { ctx, w, h: H } = newPage();
  const s = +B.scale; let y = 1.0 * CM;
  ctx.fillStyle = '#1d2b38';
  const ts = Math.floor(16 * s);
  drawCentered(ctx, B.title, w / 2, y + ts * 0.6, ts, 700, B.font, w - 3 * CM); y += ts * 1.35;
  ctx.strokeStyle = '#999'; ctx.lineWidth = 0.8; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(1.5 * CM, y); ctx.lineTo(w - 1.5 * CM, y); ctx.stroke(); ctx.setLineDash([]);
  y += 6;
  const bw = 18 * CM, bh = 0.75 * CM, bx = (w - bw) / 2;
  ctx.fillStyle = '#A8E6CF'; ctx.fillRect(bx, y, bw, bh);
  ctx.fillStyle = '#1d2b38'; drawCentered(ctx, fmtMonth(pg.dates[0], B.dateLang), w / 2, y + bh / 2, Math.floor(12 * s), 700);
  y += bh + 0.4 * CM;
  for (const d of pg.dates) { y += drawDayTable(ctx, d, bx, y) + 0.4 * CM; }
  drawFooter(ctx, w, H, pg.num);
  return { canvas: ctx.canvas, w, h: H };
}
function drawNotesPage(pg, size = A4) {
  const { ctx, w, h: H } = newPage(size.w, size.h);
  const s = +B.scale;
  ctx.fillStyle = '#222'; drawCentered(ctx, B.notesTitle, w / 2, 40, Math.floor(14 * s), 700);
  ctx.strokeStyle = '#999'; ctx.lineWidth = 0.8; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(42, 62); ctx.lineTo(w - 42, 62); ctx.stroke();
  ctx.strokeStyle = '#B0BEC5'; ctx.lineWidth = 0.5; ctx.setLineDash([1, 3]);
  const step = (H - 140) / 16;
  for (let i = 1; i <= 16; i++) { const yy = 62 + i * step; ctx.beginPath(); ctx.moveTo(42, yy); ctx.lineTo(w - 42, yy); ctx.stroke(); }
  ctx.setLineDash([]);
  drawFooter(ctx, w, H, pg.num);
  return { canvas: ctx.canvas, w, h: H };
}
async function prepareTemplate() {
  if (!B.template) { B.tpl = null; return; }
  if (B.tpl && B.tpl.src === B.template) return;
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(B.template.bytes.slice(0)) }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const vp = page.getViewport({ scale: K });
  const c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
  const cx = c.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: cx, viewport: vp }).promise;
  const tc = await page.getTextContent();
  const tags = []; const re = /\{\{\s*(MONTH|DATE_[1-4]|PAGE_NUM)\s*\}\}/g;
  for (const it of tc.items) {
    if (!it.str || !it.str.includes('{{')) continue;
    const tr = pdfjsLib.Util.transform(base.transform, it.transform);   // PDF points, top-left origin
    const fh = Math.hypot(tr[2], tr[3]), x0 = tr[4], yb = tr[5], wAll = it.width;
    let m; re.lastIndex = 0;
    while ((m = re.exec(it.str))) {
      const a = m.index / it.str.length, b = (m.index + m[0].length) / it.str.length;
      tags.push({ tag: m[1], x: x0 + wAll * a, w: wAll * (b - a), y: yb - fh * 0.85, h: fh * 1.1, fs: fh });
    }
  }
  B.tpl = { src: B.template, c, w: base.width, h: base.height, tags };
}
function drawTemplatePage(pg) {
  const T0 = B.tpl, { ctx, w, h: H } = newPage(T0.w, T0.h);
  ctx.drawImage(T0.c, 0, 0, T0.w, T0.h);
  const vals = { MONTH: fmtMonth(pg.dates[0], B.dateLang), PAGE_NUM: String(pg.num) };
  for (let i = 1; i <= 4; i++) vals['DATE_' + i] = pg.dates[i - 1] ? fmtDay(pg.dates[i - 1], B.dateLang) : '';
  const tctx = T0.c.getContext('2d');
  for (const tg of T0.tags) {
    // cover the tag with the background colour found just above / below it (the brightest sample wins)
    let bg = [255, 255, 255], best = -1;
    for (const [sx, sy] of [[tg.x + tg.w / 2, tg.y - 3], [tg.x + tg.w / 2, tg.y + tg.h + 3], [tg.x + tg.w + 4, tg.y + tg.h / 2]]) {
      try { const d = tctx.getImageData(Math.round(sx * K), Math.round(sy * K), 1, 1).data; const lum = d[0] + d[1] + d[2]; if (lum > best) { best = lum; bg = d; } } catch (e) {}
    }
    ctx.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`; ctx.fillRect(tg.x - 3, tg.y - 1, tg.w + 6, tg.h + 2);
    const v = vals[tg.tag]; if (!v) continue;
    ctx.fillStyle = '#26333f'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
    ctx.font = `700 ${tg.fs * B.tplScale}px ${fontStack(B.font)}`;
    ctx.fillText(v, tg.x, tg.y + tg.h / 2);
  }
  if (!T0.tags.some(x => x.tag === 'PAGE_NUM')) drawFooter(ctx, w, H, pg.num);
  return { canvas: ctx.canvas, w, h: H };
}
async function drawCoverPage(file, size) {
  if (file.kind === 'pdf') return { pdfBytes: file.bytes };
  const { ctx, w, h: H } = newPage(size.w, size.h);
  drawContain(ctx, file.img, w, H);
  return { canvas: ctx.canvas, w, h: H };
}
async function renderBookletPage(pg) {
  if (pg.type === 'cover') return drawCoverPage(pg.file, pageSize());
  if (pg.type === 'notes') return drawNotesPage(pg, pageSize());
  return B.mode === 'template' ? drawTemplatePage(pg) : drawContentPage(pg);
}

function renderBooklet(root) {
  const { form, side } = shell(root, '📖', 'tl_booklet', 'tl_bookletDesc');
  const refresh = debounce(() => updatePreview(), 200);
  const redraw = () => { root.innerHTML = ''; renderBooklet(root); };
  const modeSel = select(B, 'mode', [{ value: 'builtin', label: t('tl_builtIn') }, { value: 'template', label: t('tl_myTemplate') }], redraw);
  form.append(h('h3', { class: 'tf-h', text: t('tl_design') }), fld('tl_design', modeSel));
  if (B.mode === 'template') {
    form.append(fileDrop('tl_templateFile', 'application/pdf,.pdf', B.template && B.template.name, async f => {
      try { B.template = await fileInfo(f); if (B.template.kind !== 'pdf') throw new Error(t('notPdf')); B.tpl = null; redraw(); } catch (e) { B.template = null; toast(e.message, true); }
    }, () => { B.template = null; B.tpl = null; redraw(); }),
    h('p', { class: 'muted small', text: t('tl_placeholders') }),
    fld('tl_textSize', input(B, 'tplScale', { type: 'range', min: 0.5, max: 2, step: 0.05 }, refresh)));
  } else {
    form.append(fld('tl_title', input(B, 'title', { type: 'text', dir: 'auto' }, refresh), 'wide'));
  }
  form.append(
    h('div', { class: 'tf-row' }, fld('tl_start', input(B, 'start', { type: 'date' }, refresh)), fld('tl_end', input(B, 'end', { type: 'date' }, refresh))),
    h('div', { class: 'tf-row' },
      fld('tl_weekday', select(B, 'weekday', weekdayNames().map(x => ({ value: x.wd, label: x.name })), refresh, true)),
      fld('tl_perPage', select(B, 'perPage', [1, 2, 3].map(n => ({ value: n, label: String(n) })), refresh, true))),
    h('div', { class: 'tf-row' },
      fld('tl_font', select(B, 'font', fontOptions(), refresh)),
      fld('tl_dateLang', select(B, 'dateLang', L.LANGS.map(l => ({ value: l, label: L.LANG_NAMES[l] })), refresh))),
    fontUpload(fam => { B.font = fam; redraw(); }));
  if (B.mode === 'builtin') {
    form.append(fld('tl_textSize', input(B, 'scale', { type: 'range', min: 1, max: 2, step: 0.05 }, refresh)),
      h('h3', { class: 'tf-h', text: t('tl_rowLabels') }),
      ...B.labels.map(pair => h('div', { class: 'tf-row' }, input(pair, 0, { type: 'text', dir: 'rtl' }, refresh), input(pair, 1, { type: 'text', dir: 'ltr' }, refresh))),
      h('div', { class: 'tf-row' }, fld('tl_score', input(B, 'score', { type: 'text' }, refresh)), fld('tl_notesTitle', input(B, 'notesTitle', { type: 'text', dir: 'auto' }, refresh))),
      h('label', { class: 'tcheck' }, input(B, 'labelsRight', { type: 'checkbox' }, refresh), t('tl_labelsRight')));
  }
  form.append(h('h3', { class: 'tf-h', text: t('tl_covers') }),
    h('div', { class: 'tf-row' },
      fileDrop('tl_front', 'image/*,application/pdf,.pdf', B.front && B.front.name, async f => { try { B.front = await fileInfo(f); redraw(); } catch (e) { toast(e.message, true); } }, () => { B.front = null; redraw(); }),
      fileDrop('tl_back', 'image/*,application/pdf,.pdf', B.back && B.back.name, async f => { try { B.back = await fileInfo(f); redraw(); } catch (e) { toast(e.message, true); } }, () => { B.back = null; redraw(); })),
    h('label', { class: 'tcheck' }, input(B, 'pad4', { type: 'checkbox' }, refresh), t('tl_pad4')));

  const info = h('p', { class: 'tool-info' }), canvasBox = h('div', { class: 'tool-canvas' }), nav = h('div');
  const dl = h('button', { type: 'button', class: 'btn green wide' }, '⬇ ', t('tl_download'));
  side.append(info, nav, canvasBox, dl);
  let tok = 0;
  async function updatePreview() {
    const my = ++tok;
    try {
      await ensureFonts(B.font, 'Nunito');
      if (B.mode === 'template') { if (!B.template) { info.textContent = t('tl_needTemplate'); canvasBox.innerHTML = ''; nav.innerHTML = ''; dl.disabled = true; return; } await prepareTemplate(); }
      const { pages, dates } = bookletPlan();
      if (!dates.length) { info.textContent = t('tl_noDates'); canvasBox.innerHTML = ''; nav.innerHTML = ''; dl.disabled = true; return; }
      dl.disabled = false;
      B.page = Math.max(0, Math.min(B.page, pages.length - 1));
      info.textContent = t('tl_totalPages', pages.length, dates.length) + (pages.length % 4 === 0 ? ' · ✓ ' + t('tl_div4') : '');
      nav.innerHTML = ''; nav.append(pager(B, pages.length, updatePreview));
      const p = await renderBookletPage(pages[B.page]);
      if (my !== tok) return;
      canvasBox.innerHTML = '';
      if (p.pdfBytes) canvasBox.append((await pdfToCanvas(p.pdfBytes, 900)).c); else canvasBox.append(p.canvas);
    } catch (e) { console.error(e); info.textContent = t('error') + e.message; }
  }
  dl.onclick = async () => {
    try {
      busy(t('building')); await ensureFonts(B.font, 'Nunito');
      if (B.mode === 'template') await prepareTemplate();
      const { pages } = bookletPlan();
      const bytes = await buildPdf(pages.map(pg => () => renderBookletPage(pg)), (i, n) => { $busy(t('tl_making', i, n)); });
      saveBlob(new Blob([bytes], { type: 'application/pdf' }), 'memorization-booklet.pdf');
      toast(t('pdfReady'));
    } catch (e) { console.error(e); toast(t('error') + e.message, true); }
    done();
  };
  updatePreview();
}
const $busy = msg => { const el = document.getElementById('busyText'); if (el) el.textContent = msg; };

/* ═════════════ 2) Certificates & name slides ═════════════ */
const C = {
  book: null, sheet: '', male: null, female: null, genderCol: -1, idCol: -1, row: 0, sel: 0,
  arFont: 'Amiri', enFont: 'Nunito', color: '#785014', fields: null, results: null
};
const FIXED = -2;
function certRows() {
  if (!C.book) return { header: [], rows: [] };
  const all = C.book.sheets[C.sheet] || [];
  return { header: (all[0] || []).map(String), rows: all.slice(1) };
}
function guessCol(header, pats) {
  for (const p of pats) { const i = header.findIndex(hd => hd.toLowerCase().includes(p)); if (i >= 0) return i; }
  return -1;
}
function initFields() {
  const { header } = certRows();
  const img = C.male ? C.male.img : null, W = img ? img.naturalWidth : 1500, H = img ? img.naturalHeight : 1000;
  C.fields = [
    { label: t('tl_fieldName'), col: guessCol(header, ['name', 'اسم', 'nimi', 'trophies', 'torphies']), sub: -1, suffix: '', fixed: '', x: W * 0.5, y: H * 0.5, size: Math.round(H * 0.06), subSize: Math.round(H * 0.03), maxW: Math.round(W * 0.4) },
    { label: t('tl_fieldLevel'), col: guessCol(header, ['juz', 'level', 'mark', 'مستوى', 'جزء']), sub: guessCol(header, ['which', 'tajwid', 'age']), suffix: ' Juz', fixed: '', x: W * 0.3, y: H * 0.62, size: Math.round(H * 0.045), subSize: Math.round(H * 0.028), maxW: Math.round(W * 0.25) },
    { label: t('tl_fieldCity'), col: guessCol(header, ['city', 'مدينة', 'kaupunki']), sub: -1, suffix: '', fixed: '', x: W * 0.7, y: H * 0.7, size: Math.round(H * 0.045), subSize: Math.round(H * 0.028), maxW: Math.round(W * 0.25) }
  ];
}
const cellVal = (row, i) => i >= 0 && row && row[i] != null ? String(row[i]).trim() : '';
function isGirl(row) {
  if (C.genderCol < 0) return false;
  const g = cellVal(row, C.genderCol).toLowerCase();
  return /^f|female|girl|tyttö|nainen|أنثى|بنت|انثى/.test(g);
}
function fieldText(f, row) {
  if (f.col === FIXED) return { main: f.fixed || '', sub: '' };
  let main = cellVal(row, f.col);
  if (main && f.suffix && /^\d+(\.\d+)?$/.test(main)) main += f.suffix;
  return { main, sub: cellVal(row, f.sub) };
}
function drawCertText(ctx, f, row) {
  const { main, sub } = fieldText(f, row);
  if (!main && !sub) return;
  ctx.fillStyle = C.color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const famOf = s => isArabic(s) ? C.arFont : C.enFont;
  let ms = 0, subLines = [], ss = 0;
  if (main) { ctx.direction = isArabic(main) ? 'rtl' : 'ltr'; ms = fitFont(ctx, main, 700, +f.size, famOf(main), +f.maxW, 10); }
  if (sub) {
    ss = +f.subSize;
    while (true) {
      ctx.font = `400 ${ss}px ${fontStack(famOf(sub))}`; subLines = wrapLines(ctx, sub, +f.maxW);
      if ((subLines.length <= 2 && subLines.every(l => ctx.measureText(l).width <= +f.maxW)) || ss <= 10) break; ss -= 1;
    }
  }
  const mh = ms * 1.2, sh = ss * 1.2, tot = (main ? mh : 0) + subLines.length * sh;
  let y = +f.y - tot / 2;
  if (main) { ctx.direction = isArabic(main) ? 'rtl' : 'ltr'; ctx.font = `700 ${ms}px ${fontStack(famOf(main))}`; ctx.fillText(main, +f.x, y + mh / 2); y += mh; }
  ctx.direction = isArabic(sub) ? 'rtl' : 'ltr'; ctx.font = `400 ${ss}px ${fontStack(famOf(sub))}`;
  subLines.forEach(l => { ctx.fillText(l, +f.x, y + sh / 2); y += sh; });
}
function certCanvas(row, guides = false) {
  const tpl = (isGirl(row) && C.female) ? C.female : (C.male || C.female);
  const img = tpl.img, c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  C.fields.forEach((f, i) => {
    drawCertText(ctx, f, row);
    if (guides) {
      const bh = Math.max(+f.size * 1.4, 20);
      ctx.save(); ctx.setLineDash([10, 6]); ctx.lineWidth = Math.max(2, c.width / 600);
      ctx.strokeStyle = i === C.sel ? '#ff3d7f' : 'rgba(91,79,224,.8)';
      ctx.strokeRect(+f.x - f.maxW / 2, +f.y - bh / 2, +f.maxW, bh); ctx.restore();
    }
  });
  return c;
}
function renderCert(root) {
  const { form, side } = shell(root, '🏅', 'tl_cert', 'tl_certDesc');
  const redraw = () => { root.innerHTML = ''; renderCert(root); };
  const refresh = debounce(() => updatePreview(), 120);
  // 1. Excel
  form.append(h('h3', { class: 'tf-h', text: '1 · ' + t('tl_excel') }),
    fileDrop('tl_excel', '.xlsx,.xls,.csv,.ods', C.book && C.book.file, async f => {
      try { busy(t('loading')); C.book = await readWorkbook(f); C.sheet = C.book.names[0]; C.fields = null; C.results = null; C.row = 0; const { header } = certRows(); C.genderCol = guessCol(header, ['gender', 'sex', 'جنس', 'sukupuoli']); C.idCol = guessCol(header, ['id', 'number', 'رقم', 'numero']); }
      catch (e) { toast(t('error') + e.message, true); }
      done(); redraw();
    }, () => { C.book = null; C.results = null; redraw(); }),
    h('p', { class: 'muted small', text: t('tl_excelHint') }));
  const { header, rows } = certRows();
  const colOpts = [{ value: -1, label: t('tl_none') }, ...header.map((hd, i) => ({ value: i, label: `${colLetter(i)} · ${hd || '…'}` }))];
  if (C.book) {
    form.append(h('div', { class: 'tf-row' },
      fld('tl_sheet', select(C, 'sheet', C.book.names.map(n => ({ value: n, label: `${n} (${Math.max(0, (C.book.sheets[n] || []).length - 1)})` })), () => { C.fields = null; C.row = 0; C.results = null; redraw(); })),
      fld('tl_genderCol', select(C, 'genderCol', colOpts, () => { C.results = null; refresh(); }, true))),
      fld('tl_idCol', select(C, 'idCol', colOpts, null, true)));
  }
  // 2. designs
  form.append(h('h3', { class: 'tf-h', text: '2 · ' + t('tl_templates') }),
    h('div', { class: 'tf-row' },
      fileDrop('tl_male', 'image/*', C.male && C.male.name, async f => { try { C.male = await fileInfo(f); if (C.male.kind !== 'img') throw new Error('PNG / JPG'); if (!C.fields) initFields(); C.results = null; redraw(); } catch (e) { C.male = null; toast(e.message, true); } }, () => { C.male = null; C.results = null; redraw(); }),
      fileDrop('tl_female', 'image/*', C.female && C.female.name, async f => { try { C.female = await fileInfo(f); if (C.female.kind !== 'img') throw new Error('PNG / JPG'); C.results = null; redraw(); } catch (e) { C.female = null; toast(e.message, true); } }, () => { C.female = null; C.results = null; redraw(); })));
  if (!C.male && C.female) { C.male = C.female; C.female = null; }
  if (C.male && !C.fields) initFields();
  // 3. fields
  if (C.fields) {
    const fontRow = h('div', { class: 'tf-row' },
      fld('tl_arFont', select(C, 'arFont', fontOptions(), refresh)), fld('tl_enFont', select(C, 'enFont', fontOptions(), refresh)),
      fld('tl_color', input(C, 'color', { type: 'color' }, refresh)));
    form.append(h('h3', { class: 'tf-h', text: '3 · ' + t('tl_fields') }), fontRow, fontUpload(() => redraw()));
    const fcOpts = [...colOpts, { value: FIXED, label: t('tl_fixedText') }];
    C.fields.forEach((f, i) => {
      const card = h('div', { class: 'fcard' + (i === C.sel ? ' sel' : ''), onclick: () => { if (C.sel !== i) { C.sel = i; form.querySelectorAll('.fcard').forEach((c, k) => c.classList.toggle('sel', k === i)); refresh(); } } },
        h('div', { class: 'fhead' }, input(f, 'label', { type: 'text', class: 'flabel' }),
          h('button', { type: 'button', class: 'btn small danger', onclick: e => { e.stopPropagation(); C.fields.splice(i, 1); C.sel = 0; redraw(); } }, '🗑')),
        h('div', { class: 'tf-row' }, fld('tl_fieldCol', select(f, 'col', fcOpts, () => redraw(), true)),
          f.col === FIXED ? fld('tl_text', input(f, 'fixed', { type: 'text', dir: 'auto' }, refresh)) : fld('tl_subCol', select(f, 'sub', colOpts, refresh, true))),
        h('div', { class: 'tf-row four' },
          fld('tl_size', input(f, 'size', { type: 'number', min: 8, max: 600 }, refresh)),
          fld('tl_subSize', input(f, 'subSize', { type: 'number', min: 8, max: 400 }, refresh)),
          fld('tl_maxW', input(f, 'maxW', { type: 'number', min: 20, max: 8000, step: 10 }, refresh)),
          fld('tl_suffix', input(f, 'suffix', { type: 'text' }, refresh))));
      form.append(card);
    });
    form.append(h('button', { type: 'button', class: 'btn small', onclick: () => {
      const img = C.male.img; C.fields.push({ label: t('tl_text'), col: FIXED, sub: -1, suffix: '', fixed: t('tl_text'), x: img.naturalWidth / 2, y: img.naturalHeight * 0.3, size: Math.round(img.naturalHeight * 0.04), subSize: 24, maxW: Math.round(img.naturalWidth * 0.4) });
      C.sel = C.fields.length - 1; redraw();
    } }, '＋ ', t('tl_addField')));
  }
  // preview side
  const info = h('p', { class: 'tool-info' }), box = h('div', { class: 'tool-canvas cert' }), nav = h('div', { class: 'pager' });
  const gen = h('button', { type: 'button', class: 'btn primary wide' }), outs = h('div', { class: 'tool-outs' });
  side.append(info, nav, box, h('p', { class: 'muted small', text: t('tl_dragHint') }), gen, outs);
  let cv = null;
  function updatePreview() {
    if (!C.book) { info.textContent = t('tl_needExcel'); gen.hidden = true; }
    if (!C.male) { info.textContent = C.book ? t('tl_needDesign') : t('tl_needExcel'); box.innerHTML = ''; gen.hidden = true; return; }
    const n = rows.length;
    C.row = Math.max(0, Math.min(C.row, Math.max(0, n - 1)));
    info.textContent = C.book ? t('tl_rows', n) : t('tl_needExcel');
    nav.innerHTML = '';
    if (n > 1) nav.append(
      h('button', { type: 'button', class: 'btn small', disabled: C.row <= 0, onclick: () => { C.row--; updatePreview(); } }, '‹'),
      h('span', { class: 'pg-n', text: `${t('tl_row')} ${C.row + 1} / ${n}` }),
      h('button', { type: 'button', class: 'btn small', disabled: C.row >= n - 1, onclick: () => { C.row++; updatePreview(); } }, '›'));
    gen.hidden = !n; gen.textContent = '⚙ ' + t('tl_generate', n);
    ensureFonts(C.arFont, C.enFont).then(() => {
      cv = certCanvas(rows[C.row] || [], true);
      box.innerHTML = ''; box.append(cv);
    });
  }
  // dragging fields on the preview
  let drag = null;
  box.addEventListener('pointerdown', e => {
    if (!cv || !C.fields) return;
    const r = cv.getBoundingClientRect(), sx = cv.width / r.width, x = (e.clientX - r.left) * sx, y = (e.clientY - r.top) * sx;
    let hit = -1;
    C.fields.forEach((f, i) => { const bh = Math.max(+f.size * 1.4, 20); if (Math.abs(x - f.x) <= f.maxW / 2 && Math.abs(y - f.y) <= bh / 2 + 10) hit = i; });
    if (hit < 0) return;
    C.sel = hit; drag = { dx: x - C.fields[hit].x, dy: y - C.fields[hit].y, sx };
    form.querySelectorAll('.fcard').forEach((c, k) => c.classList.toggle('sel', k === hit));
    box.setPointerCapture(e.pointerId); e.preventDefault();
  });
  box.addEventListener('pointermove', e => {
    if (!drag) return;
    const r = cv.getBoundingClientRect(), f = C.fields[C.sel];
    f.x = Math.round((e.clientX - r.left) * drag.sx - drag.dx); f.y = Math.round((e.clientY - r.top) * drag.sx - drag.dy);
    const c2 = certCanvas(rows[C.row] || [], true); cv.getContext('2d').drawImage(c2, 0, 0);
  });
  box.addEventListener('pointerup', () => { if (drag) { drag = null; C.results = null; outs.innerHTML = ''; } });
  gen.onclick = async () => {
    try {
      busy(t('loading')); await ensureFonts(C.arFont, C.enFont); await need('vendor/jszip.min.js');
      const zip = new JSZip(), pages = [];
      for (let i = 0; i < rows.length; i++) {
        $busy(t('tl_making', i + 1, rows.length));
        const c = certCanvas(rows[i]);
        const nameF = C.fields.find(f => f.col >= 0);
        const nm = nameF ? cellVal(rows[i], nameF.col) : '';
        zip.file(`${safe(cellVal(rows[i], C.idCol) || String(i + 1))}_${safe(nm || 'slide')}.png`, await canvasPng(c));
        pages.push({ canvas: c, w: c.width * 0.75, h: c.height * 0.75 });
        await new Promise(r => setTimeout(r, 0));
      }
      $busy(t('building'));
      const pdf = await buildPdf(pages.map(p => () => p));
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      C.results = { zip: zipBlob, pdf: new Blob([pdf], { type: 'application/pdf' }) };
      showOuts();
    } catch (e) { console.error(e); toast(t('error') + e.message, true); }
    done();
  };
  function showOuts() {
    outs.innerHTML = '';
    if (!C.results) return;
    outs.append(
      h('button', { type: 'button', class: 'btn green', onclick: () => saveBlob(C.results.pdf, 'certificates.pdf') }, '⬇ ', t('tl_pdfAll')),
      h('button', { type: 'button', class: 'btn', onclick: () => saveBlob(C.results.zip, 'certificates.zip') }, '🗂 ', t('tl_zip')));
  }
  updatePreview(); showOuts();
}

/* ═════════════ 3) Attendance sheets ═════════════ */
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const AT = {
  book: null, sheets: [], nameCol: 0, headerRow: true, title: 'Quran Memorization Sheet',
  start: iso(firstOfMonth), end: iso(new Date(today.getFullYear(), today.getMonth() + 4, 0)), weekday: 0,
  perPage: 12, nameW: 120, numbers: true, notesLabel: 'Attendance + Notes', lineW: 1.5, showSheet: true, dateLang: 'en', font: 'Nunito', page: 0
};
function attStudents() {
  const out = [];
  if (!AT.book) return out;
  for (const sn of AT.sheets) {
    const rows = (AT.book.sheets[sn] || []).slice(AT.headerRow ? 1 : 0);
    const names = rows.map(r => String(r[AT.nameCol] ?? '').trim()).filter(Boolean);
    if (names.length) out.push({ sheet: sn, names });
  }
  return out;
}
function attPlan() {
  const dates = weekdayDates(parseISO(AT.start), parseISO(AT.end), +AT.weekday);
  const months = [];
  dates.forEach(d => { const k = d.getFullYear() * 12 + d.getMonth(); let m = months.find(x => x.k === k); if (!m) months.push(m = { k, dates: [] }); m.dates.push(d); });
  const pages = [];
  for (const g of attStudents()) for (const m of months) for (let i = 0; i < g.names.length; i += AT.perPage) pages.push({ sheet: g.sheet, month: m, names: g.names.slice(i, i + AT.perPage), start: i });
  return { pages, dates };
}
function drawAttPage(pg) {
  const { ctx, w } = newPage();
  const M = 28, PW = w - 2 * M, fam = AT.font, lw = +AT.lineW;
  let y = 22;
  ctx.fillStyle = '#000';
  drawCentered(ctx, AT.title, w / 2, y + 12, 20, 700, fam, PW); y += 30;
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(M, y); ctx.lineTo(w - M, y); ctx.stroke(); y += 10;
  // month banner
  ctx.fillStyle = '#D1E7DD'; ctx.fillRect(M, y, PW, 30); ctx.strokeRect(M, y, PW, 30);
  ctx.fillStyle = '#000';
  const banner = fmtMonth(pg.month.dates[0], AT.dateLang) + (AT.showSheet && AT.sheets.length > 1 ? '  ·  ' + pg.sheet : '');
  drawCentered(ctx, banner, w / 2, y + 15, 16, 700, fam, PW - 10); y += 40;
  // table
  const nd = pg.month.dates.length, numW = AT.numbers ? 25 : 0, nameW = +AT.nameW, dayW = (PW - numW - nameW) / Math.max(1, nd);
  const hr = 25, rowH = (620 - 2 * hr) / AT.perPage, x0 = M;
  const cols = []; let cx = x0;
  if (numW) { cols.push(cx); cx += numW; } const nameX = cx; cx += nameW; const dayX = cx;
  ctx.fillStyle = '#CCCCCC'; ctx.fillRect(dayX, y, dayW * nd, hr);
  ctx.fillStyle = '#000';
  if (numW) drawCentered(ctx, '#', x0 + numW / 2, y + hr, 11, 700, fam);
  drawCentered(ctx, t('tl_studentName'), nameX + nameW / 2, y + hr, 11, 700, fam, nameW - 6);
  drawCentered(ctx, AT.notesLabel, dayX + dayW * nd / 2, y + hr / 2, 12, 700, fam, dayW * nd - 6);
  pg.month.dates.forEach((d, i) => drawCentered(ctx, d.toLocaleDateString(LOCALE[AT.dateLang], { day: 'numeric', month: 'short' }), dayX + dayW * (i + 0.5), y + hr * 1.5, 11, 700, fam, dayW - 4));
  const top = y, bottom = y + 2 * hr + rowH * AT.perPage;
  for (let r = 0; r < AT.perPage; r++) {
    const ry = y + 2 * hr + r * rowH, nm = pg.names[r];
    if (!nm) continue;
    if (numW) drawCentered(ctx, String(pg.start + r + 1), x0 + numW / 2, ry + rowH / 2, 10, 700, fam);
    ctx.font = `700 10px ${fontStack(fam)}`;
    const lines = wrapLines(ctx, nm, nameW - 8).slice(0, 2);
    const ar = isArabic(nm);
    ctx.textAlign = ar ? 'right' : 'left'; ctx.direction = ar ? 'rtl' : 'ltr'; ctx.textBaseline = 'middle';
    lines.forEach((ln, k) => ctx.fillText(ln, ar ? nameX + nameW - 4 : nameX + 4, ry + rowH / 2 + (k - (lines.length - 1) / 2) * 12));
  }
  // grid
  ctx.strokeStyle = '#000'; ctx.lineWidth = lw;
  const hl = yy => { ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + PW, yy); ctx.stroke(); };
  const vl = (xx, y1) => { ctx.beginPath(); ctx.moveTo(xx, y1); ctx.lineTo(xx, bottom); ctx.stroke(); };
  hl(top); ctx.beginPath(); ctx.moveTo(dayX, top + hr); ctx.lineTo(x0 + PW, top + hr); ctx.stroke();
  for (let r = 0; r <= AT.perPage; r++) hl(top + 2 * hr + r * rowH);
  vl(x0, top); if (numW) vl(nameX, top); vl(dayX, top); vl(x0 + PW, top);
  for (let i = 1; i < nd; i++) vl(dayX + dayW * i, top + hr);
  return { canvas: ctx.canvas, w, h: A4.h };
}
function renderAtt(root) {
  const { form, side } = shell(root, '📋', 'tl_att', 'tl_attDesc');
  const redraw = () => { root.innerHTML = ''; renderAtt(root); };
  const refresh = debounce(() => updatePreview(), 200);
  form.append(h('h3', { class: 'tf-h', text: t('tl_excel') }),
    fileDrop('tl_excel', '.xlsx,.xls,.csv,.ods', AT.book && AT.book.file, async f => {
      try { busy(t('loading')); AT.book = await readWorkbook(f); AT.sheets = [AT.book.names[0]]; AT.nameCol = 0; AT.page = 0; } catch (e) { toast(t('error') + e.message, true); }
      done(); redraw();
    }, () => { AT.book = null; redraw(); }),
    h('p', { class: 'muted small', text: t('tl_excelHint') }));
  if (AT.book) {
    const sheetBox = h('div', { class: 'chips' }, AT.book.names.map(n => {
      const cb = h('input', { type: 'checkbox' }); cb.checked = AT.sheets.includes(n);
      cb.onchange = () => { AT.sheets = AT.book.names.filter(x => x === n ? cb.checked : AT.sheets.includes(x)); AT.page = 0; refresh(); };
      return h('label', { class: 'tcheck chip-cb' }, cb, `${n} (${Math.max(0, (AT.book.sheets[n] || []).length - (AT.headerRow ? 1 : 0))})`);
    }));
    const first = AT.book.sheets[AT.sheets[0] || AT.book.names[0]] || [];
    const hdr = first[0] || [];
    const ncols = Math.max(1, ...first.slice(0, 20).map(r => r.length));
    form.append(fld('tl_sheets', sheetBox, 'wide'),
      h('div', { class: 'tf-row' },
        fld('tl_nameCol', select(AT, 'nameCol', Array.from({ length: ncols }, (_, i) => ({ value: i, label: `${colLetter(i)}${AT.headerRow && hdr[i] ? ' · ' + hdr[i] : ''}` })), refresh, true)),
        h('label', { class: 'tcheck' }, input(AT, 'headerRow', { type: 'checkbox' }, redraw), t('tl_headerRow'))));
  }
  form.append(
    fld('tl_title', input(AT, 'title', { type: 'text', dir: 'auto' }, refresh), 'wide'),
    h('div', { class: 'tf-row' }, fld('tl_start', input(AT, 'start', { type: 'date' }, refresh)), fld('tl_end', input(AT, 'end', { type: 'date' }, refresh))),
    h('div', { class: 'tf-row' },
      fld('tl_weekday', select(AT, 'weekday', weekdayNames().map(x => ({ value: x.wd, label: x.name })), refresh, true)),
      fld('tl_dateLang', select(AT, 'dateLang', L.LANGS.map(l => ({ value: l, label: L.LANG_NAMES[l] })), refresh))),
    h('div', { class: 'tf-row' },
      fld('tl_perPageStudents', input(AT, 'perPage', { type: 'number', min: 5, max: 30 }, refresh)),
      fld('tl_nameW', input(AT, 'nameW', { type: 'number', min: 60, max: 260, step: 5 }, refresh))),
    h('div', { class: 'tf-row' },
      fld('tl_notesLabel', input(AT, 'notesLabel', { type: 'text', dir: 'auto' }, refresh)),
      fld('tl_font', select(AT, 'font', fontOptions(), refresh))),
    fld('tl_lineW', input(AT, 'lineW', { type: 'range', min: 0.5, max: 4, step: 0.25 }, refresh)),
    h('label', { class: 'tcheck' }, input(AT, 'numbers', { type: 'checkbox' }, refresh), t('tl_numbers')),
    h('label', { class: 'tcheck' }, input(AT, 'showSheet', { type: 'checkbox' }, refresh), t('tl_showSheet')));
  const info = h('p', { class: 'tool-info' }), nav = h('div'), box = h('div', { class: 'tool-canvas' });
  const dl = h('button', { type: 'button', class: 'btn green wide' }, '⬇ ', t('tl_download'));
  side.append(info, nav, box, dl);
  async function updatePreview() {
    AT.perPage = Math.max(5, Math.min(30, +AT.perPage || 12));
    if (!AT.book) { info.textContent = t('tl_needExcel'); dl.disabled = true; box.innerHTML = ''; nav.innerHTML = ''; return; }
    await ensureFonts(AT.font, 'Amiri');
    const { pages, dates } = attPlan();
    if (!dates.length) { info.textContent = t('tl_noDates'); dl.disabled = true; box.innerHTML = ''; nav.innerHTML = ''; return; }
    if (!pages.length) { info.textContent = t('tl_needExcel'); dl.disabled = true; box.innerHTML = ''; nav.innerHTML = ''; return; }
    dl.disabled = false;
    AT.page = Math.max(0, Math.min(AT.page, pages.length - 1));
    info.textContent = t('tl_totalPages', pages.length, dates.length);
    nav.innerHTML = ''; nav.append(pager(AT, pages.length, updatePreview));
    box.innerHTML = ''; box.append(drawAttPage(pages[AT.page]).canvas);
  }
  dl.onclick = async () => {
    try {
      busy(t('building')); await ensureFonts(AT.font, 'Amiri');
      const { pages } = attPlan();
      const bytes = await buildPdf(pages.map(p => () => drawAttPage(p)), (i, n) => $busy(t('tl_making', i, n)));
      saveBlob(new Blob([bytes], { type: 'application/pdf' }), 'attendance-sheets.pdf'); toast(t('pdfReady'));
    } catch (e) { console.error(e); toast(t('error') + e.message, true); }
    done();
  };
  updatePreview();
}

/* ───────────── entry point (called by app.js on #/tools/…) ───────────── */
window.LPT_TOOLS = {
  render(root, tool) {
    // don't rebuild while someone is typing in a tool field (app re-renders on many events)
    if (root.dataset.tool === tool && root.childElementCount && root.contains(document.activeElement) && document.activeElement !== document.body) return;
    root.dataset.tool = tool; root.innerHTML = '';
    if (tool === 'booklet') renderBooklet(root);
    else if (tool === 'certificates') renderCert(root);
    else if (tool === 'attendance') renderAtt(root);
    else renderHub(root);
  }
};
if (L.state.route && L.state.route.view === 'tools') window.LPT_TOOLS.render(document.getElementById('toolsView'), L.state.route.tool);
})();
