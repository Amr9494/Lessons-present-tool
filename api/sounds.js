// Vercel serverless function: fast sound search via the Freesound API, and a small download proxy.
//   /api/sounds?q=door&page=1&kind=fx|music|all   → search (needs the FREESOUND_KEY environment variable in Vercel)
//   /api/sounds?dl=<sound file url>                → returns the file with CORS headers, so the site can copy it into its own storage
const ALLOWED = [/(^|\.)freesound\.org$/, /(^|\.)jamendo\.com$/, /(^|\.)wikimedia\.org$/, /(^|\.)ccmixter\.org$/];
const LIC = u => /zero/i.test(u) ? 'cc0' : /by-nc/i.test(u) ? 'by-nc' : /sampling/i.test(u) ? 'sampling+' : /\/by\//i.test(u) ? 'by' : 'cc';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const q = req.query || {};
  try {
    if (q.dl) {
      let u; try { u = new URL(String(q.dl)); } catch (e) { res.status(400).json({ error: 'bad url' }); return; }
      if (u.protocol !== 'https:' || !ALLOWED.some(r => r.test(u.hostname))) { res.status(403).json({ error: 'host not allowed' }); return; }
      const r = await fetch(u, { redirect: 'follow' });
      if (!r.ok) { res.status(502).json({ error: 'source ' + r.status }); return; }
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 15 * 1024 * 1024) { res.status(413).json({ error: 'too big' }); return; }
      res.setHeader('Content-Type', r.headers.get('content-type') || 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.status(200).send(buf); return;
    }
    const key = process.env.FREESOUND_KEY;
    if (!key) { res.status(501).json({ error: 'nokey' }); return; }
    const text = String(q.q || '').trim().slice(0, 100);
    if (!text) { res.status(400).json({ error: 'empty' }); return; }
    const p = new URLSearchParams({ query: text, page: String(Math.max(1, parseInt(q.page, 10) || 1)), page_size: '20',
      fields: 'id,name,username,license,duration,previews', token: key });
    if (q.kind === 'fx') p.set('filter', 'duration:[0 TO 30]');
    else if (q.kind === 'music') p.set('filter', 'tag:music duration:[10 TO *]');
    const r = await fetch('https://freesound.org/apiv2/search/text/?' + p);
    if (r.status === 429) { res.status(429).json({ error: 'busy' }); return; }
    if (!r.ok) { res.status(502).json({ error: 'freesound ' + r.status }); return; }
    const d = await r.json();
    const results = (d.results || []).map(s => {
      const license = LIC(s.license || '');
      return { id: 'fs' + s.id, title: s.name, url: (s.previews && (s.previews['preview-hq-mp3'] || s.previews['preview-lq-mp3'])) || '',
        creator: s.username, license, duration: Math.round((s.duration || 0) * 1000), source: 'freesound', filetype: 'mp3',
        attribution: `"${s.name}" by ${s.username} (freesound.org/s/${s.id}) — ${license.toUpperCase()}` };
    }).filter(x => x.url);
    res.setHeader('Cache-Control', 'public, s-maxage=3600');
    res.status(200).json({ results, page_count: Math.ceil((d.count || 0) / 20) });
  } catch (e) { res.status(500).json({ error: String(e.message || e) }); }
};
