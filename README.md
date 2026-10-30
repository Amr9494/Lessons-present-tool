# Lectures Presenter — shared lesson library

A website where your team keeps all lesson PDFs in one place, in **Arabic, English and Finnish**, sorted into topic folders. Everyone opens the same site, so a change made once shows up on every computer.

- **Anyone** with the link can browse, present full-screen and download PDFs — no account needed.
- **Admins** sign in to add/rename/delete folders and lessons, upload PDFs, and drag slides into a new order.
- New folder or lesson names are **translated automatically** into the other two languages (you can correct them).
- **Record** button captures the screen + your microphone and saves a video file.
- Each folder is a **journey map**: lessons are stops on a winding path that grows as lessons are added. Finished lessons get a ⭐, the next one says *Next!*
- Each lesson can have a **YouTube video** per language.
- **Light and dark** themes (🌙 / ☀️ button).

## Updating the site without losing anything

Your folders, lessons and PDFs live in **Supabase**, not in these files — replacing the website files never touches them.

1. **Supabase → SQL Editor → New query**, paste `supabase/upgrade-v2.sql`, **Run** (skip if you already did). Then do the same with `supabase/upgrade-v3.sql` (adds quizzes and editable texts) `supabase/upgrade-v4.sql` (storage for pictures and sounds) and `supabase/upgrade-v5.sql` (drafts). They only add empty columns/tables and are safe to run more than once.
2. On GitHub, open your repository → **Add file → Upload files**. Drag in everything from this update **except `config.js`** (keep yours — it holds your keys). Press **Commit changes**.
3. Vercel republishes automatically in about a minute.

Kids' progress (stars / done lessons) is saved per computer in the browser, so each classroom computer keeps its own journey.

## Try it first (no setup)

Open `index.html` in Chrome. With `config.js` empty the site runs in **demo mode**: you are the admin and everything is saved only in that browser. Make a folder, upload a PDF, rearrange slides, present. When you're happy, go online with the steps below.

> Opening the file directly works in most browsers. If PDFs won't load, run `npx serve .` in this folder and open the address it prints.

---

## Put it online (about 20 minutes, free)

You need two free accounts: **Supabase** (stores PDFs, folders and admin logins) and **Vercel** (shows the website). GitHub is used to hand the files to Vercel.

### 1 · Create the Supabase project
1. Go to <https://supabase.com> → **Start your project** → sign in.
2. **New project**. Name it `hijra-lessons`, choose a strong database password, region **Europe (Stockholm or Frankfurt)**. Wait ~2 minutes.

### 2 · Create the tables and file storage
1. In the project, left menu → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this folder, copy everything, paste, press **Run**. You should see "Success".

### 3 · Copy your two keys into `config.js`
1. Left menu → **Project Settings** → **API** (or **Data API**).
2. Copy **Project URL** → paste into `SUPABASE_URL` in `config.js`.
3. Copy the **anon / public** key → paste into `SUPABASE_ANON_KEY`.
   (This key is meant to be public. Never paste the `service_role` key.)

### 4 · Create admin accounts
1. Left menu → **Authentication** → **Sign In / Providers** → turn **off** "Allow new users to sign up" (so strangers can't make accounts).
2. **Authentication → Users → Add user → Create new user**. Enter the admin's email and a password, tick **Auto confirm**.
3. Back in **SQL Editor**, run (with the real email):
   ```sql
   insert into public.admins (user_id)
     select id from auth.users where email = 'teacher@example.com'
   on conflict do nothing;
   ```
Repeat for each colleague who should edit. To remove an admin: `delete from public.admins where user_id = (select id from auth.users where email = '...');`

### 5 · Publish on Vercel
1. Create a free account on <https://github.com> → **New repository** → name `hijra-lessons` → **Create**.
2. On the new repo page click **uploading an existing file**, drag in **all files and the `supabase` folder** from this folder (including your edited `config.js`) → **Commit changes**.
3. Go to <https://vercel.com> → sign in with GitHub → **Add New… → Project** → pick `hijra-lessons` → **Deploy** (no settings to change).
4. You get an address like `https://hijra-lessons.vercel.app`. Share it with everyone. 🎉

Later, to change the site's code, edit the file on GitHub — Vercel republishes automatically. **Lessons themselves are edited inside the website**, not on GitHub.

*No-GitHub alternative:* <https://app.netlify.com/drop> — drag this whole folder onto the page and you get a link instantly.

---

## Using it

| Who | How |
|---|---|
| Everyone | Pick a language at the top (العربية / English / Suomi). The whole site — folder names, lesson names and the PDFs — switches language. |
| Everyone | Open a folder → **Present** (full screen) or **Download**. The small `AR · EN · FI` chips show which languages exist; click one to present that language. |
| Admin | **🔐 Admin** (top right) → sign in. Edit buttons appear. |
| Admin | **New topic** → type the name in one language → the other two fill in, then pick an icon. Drag **⠿** to reorder folders. |
| Admin | **New lesson** → name + up to 3 PDFs and 3 YouTube links (one per language). |
| Admin | In a folder, **⇅ Reorder** changes the order of stops on the journey. |
| Everyone | Tap a stop on the map → Present, Watch video, Download, or Mark as done. Reaching the last slide marks it done automatically. |
| Everyone | **🛠 Lesson maker** (top bar) → add or paste pictures, drag them into order, choose a page size → **Download PDF** or **Preview**. Pictures stay on that computer until you press Clear all. |
| Admin | **Drafts:** new folders and lessons (and imported ones) start as ✎ Draft — admins can fill and edit them, everyone else sees a grey “Coming soon”. Press **✅ Publish** (on the folder card or in the lesson window) to show it to everyone, or 🙈 to hide it again. |
| Admin | **✎ Edit mode** (top bar) → click any text, folder name or lesson name and type over it (Enter saves, Esc cancels). Changes are published for everyone, for the language you are viewing. **☰ All texts** lists everything, including messages that are not on screen. |
| Admin | **Arrange slides** → **＋ 🧠 Quiz slide** adds a question card; drag it between slides. While presenting it becomes an interactive quiz slide (click an answer, or press 1–4 / A–D). |
| Everyone | **🔤 Arabic letters journey** (big button on the start page) → a sea map of **islands** (units, following the Noor al-Bayan book). Each island has a route of lessons: 👀 learn cards, 📖 reading words, and 🎮 quiz games (🎯 listen & tap, 🦋 catch the running letters, 🎈 pop the balloons, 🧩 build the word, 🔷 letter shapes). Finished lessons get a ✓ and stars; nothing is locked. Progress is saved per device. |
| Admin | In the letters journey: **📦 Import starter pack** (replaces the journey), **＋ Add island**, **＋ Add lesson** (type + for quizzes the game and which lessons' cards/words to use), ⚙ settings / move / delete on islands and lessons, and ✎ on any card or word to change its text, picture or sound (upload a file or 🎙 record it right there). Stored in Supabase (`settings` table + `media` bucket), not in GitHub. Needs `supabase/upgrade-v4.sql`. |
| Everyone | **🧰 Teacher tools** → Lesson maker, Memorization booklet (built-in layout or your own PDF template), Certificates & name slides (from Excel, drag text on your design), Attendance sheets (from Excel). Everything runs in the browser; nothing is uploaded. |
| Admin | Folder and lesson names: open ✎ Edit — the three language boxes can all be corrected by hand; auto-translation only fills empty boxes. |
| Admin | On a lesson, **🧠 Quiz** → add multiple-choice questions per language (or write one language and press ⇄ Translate). |
| Everyone | **🧠 Take the quiz** on a lesson; **🏆 My achievements** (top bar) shows stars, badges and results. They are saved per device. |
| Admin | In the Lesson maker, **Save as lesson** sends the PDF straight into a new lesson — no download/upload needed. |
| Admin | Tap a stop → **Arrange slides** → pick a language tab → drag slides, remove with ✕, add pages from another PDF, then **Save**. Viewers' downloads use the new order. |

**Presenting keys:** → / Space / Page Down = next · ← / Page Up = back · Home / End · **F** = full screen · **Esc** = end. Presentation clickers work too. Click the right/left side of the screen to move.

**Recording:** press **Record** (top bar or presenter bar) → choose *This tab* (or the whole screen) → allow the microphone → present as usual → **Stop**. The video (`.webm`) lands in your Downloads. Works in Chrome/Edge/Firefox on a computer. Tip: start recording first, then press Present.

## Good to know
- Free Supabase: 1 GB of PDF storage, 50 MB max per PDF. Free projects pause after 1 week with **no visits** — opening the site wakes it.
- Automatic translation uses the free MyMemory service; if it's busy, just type the names yourself.
- Saving a slide order creates a new PDF and removes the old one; there is no undo after Save, so keep your original PDFs.
