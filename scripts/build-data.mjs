// Holt beim Bauen (Render) die aktuellen Downloads und schreibt public/data/downloads.json.
//
// Quelle fuer die Mods ist das STABILE Manifest des Launchers (manifest.json im
// Release "vortex-files") -- also genau das, was im Launcher-Admin fuer alle
// freigegeben wurde. Beta-Builds (manifest-beta.json) erscheinen hier nie.
//
// Der Launcher selbst kommt aus latest.yml des neuesten Launcher-Releases.
// Faellt GitHub beim Bauen aus, bleibt die zuletzt eingecheckte Datei stehen
// und der Build bricht NICHT ab (die Seite zeigt dann den letzten Stand).
//
// Optional: GITHUB_TOKEN (nur Lesezugriff) fuer die Download-Zaehler, falls
// das Rate-Limit fuer anonyme Anfragen auf dem Build-Server erreicht ist.

import { writeFile, readFile } from 'node:fs/promises';

const OWNER = 'Marcinator31';
const REPO = 'Vortex-Launcher';
const FILES_TAG = 'vortex-files';
const OUT = new URL('../public/data/downloads.json', import.meta.url);
const base = `https://github.com/${OWNER}/${REPO}/releases`;

const headers = { 'User-Agent': 'vortex-website-build' };
const apiHeaders = { ...headers, Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) apiHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(url, h = headers, art = 'json') {
  const res = await fetch(url, { headers: h, redirect: 'follow', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return art === 'json' ? res.json() : res.text();
}

/** "4.27.0+26.2" -> "4.27.0" */
const clean = (v) => String(v || '').split('+')[0];

/** Minecraft-Versionen absteigend sortieren (26.2 vor 26.1.2 vor 1.21.11 vor 1.8.9). */
const mcOrder = (a, b) => {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pb[i] || 0) - (pa[i] || 0);
    if (d) return d;
  }
  return 0;
};

/** latest.yml von electron-builder: nur die paar Felder, die wir brauchen. */
function parseLatestYml(txt) {
  const feld = (k) => (txt.match(new RegExp(`^${k}:\\s*'?([^'\\n]+)'?`, 'm')) || [])[1];
  const size = Number((txt.match(/^\s+size:\s*(\d+)/m) || [])[1] || 0);
  return { version: feld('version'), path: feld('path'), releaseDate: feld('releaseDate'), size };
}

async function main() {
  let alt = null;
  try { alt = JSON.parse(await readFile(OUT, 'utf8')); } catch (_) { /* erster Build */ }

  const manifest = await get(`${base}/download/${FILES_TAG}/manifest.json`);
  const yml = parseLatestYml(await get(`${base}/latest/download/latest.yml`, headers, 'text'));
  if (!yml.version || !yml.path) throw new Error('latest.yml ohne version/path');

  // Download-Zaehler (optional, darf fehlen)
  let zaehler = {};
  let launcherAssets = [];
  try {
    const files = await get(`https://api.github.com/repos/${OWNER}/${REPO}/releases/tags/${FILES_TAG}`, apiHeaders);
    for (const a of files.assets || []) zaehler[a.name] = a.download_count;
    const rel = await get(`https://api.github.com/repos/${OWNER}/${REPO}/releases/tags/v${yml.version}`, apiHeaders);
    launcherAssets = rel.assets || [];
  } catch (e) {
    console.warn('Download-Zaehler nicht verfuegbar:', e.message);
  }

  const portableName = `Vortex-Client-Portable-${yml.version}.exe`;
  const portable = launcherAssets.find((a) => a.name === portableName);
  const setup = launcherAssets.find((a) => a.name === yml.path);
  const launcher = {
    version: yml.version,
    date: yml.releaseDate || null,
    setup: { file: yml.path, url: `${base}/download/v${yml.version}/${yml.path}`, size: yml.size || setup?.size || 0 },
    portable: { file: portableName, url: `${base}/download/v${yml.version}/${portableName}`, size: portable?.size || 0 },
    releaseUrl: `${base}/tag/v${yml.version}`,
  };

  const versionen = Object.keys(manifest.versions || {}).sort(mcOrder).map((mc) => {
    const files = manifest.versions[mc].files || {};
    const eintrag = (id) => {
      const f = files[id];
      if (!f) return null;
      return {
        name: f.name, version: clean(f.version), file: f.file, size: f.size || 0, sha256: f.sha256 || '',
        date: f.uploadedAt || null, url: `${base}/download/${FILES_TAG}/${encodeURIComponent(f.file)}`,
        notes: f.notes || '',
      };
    };
    return { mc, client: eintrag('vortexclient'), addon: eintrag('vortexplusaddon') };
  }).filter((v) => v.client);

  // Groesse der Portable-Datei notfalls per HEAD (folgt der Weiterleitung)
  if (!launcher.portable.size) {
    try {
      const r = await fetch(launcher.portable.url, { method: 'HEAD', headers, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      launcher.portable.size = Number(r.headers.get('content-length') || 0);
    } catch (_) { /* egal */ }
  }

  let gesamt = 0;
  for (const n of Object.values(zaehler)) gesamt += n || 0;
  for (const a of launcherAssets) if (a.name.endsWith('.exe')) gesamt += a.download_count || 0;

  const daten = {
    generatedAt: new Date().toISOString(),
    launcher,
    versions: versionen,
    downloads: gesamt || alt?.downloads || 0,
  };
  await writeFile(OUT, JSON.stringify(daten, null, 1) + '\n');
  console.log(`downloads.json: Launcher ${launcher.version}, ${versionen.length} Minecraft-Versionen, Client ${versionen[0]?.client?.version}`);
}

// Versionsmarke an CSS/JS in index.html, damit Browser nach jedem Deploy die
// neuen Dateien laden (die Assets werden einen Tag lang zwischengespeichert).
async function stempeln() {
  const datei = new URL('../public/index.html', import.meta.url);
  const v = (process.env.RENDER_GIT_COMMIT || '').slice(0, 10) || Date.now().toString(36);
  const html = await readFile(datei, 'utf8');
  await writeFile(datei, html.replace(/\?v=[\w-]+"/g, `?v=${v}"`));
  console.log('Versionsmarke:', v);
}

main().catch((e) => {
  // Build nicht scheitern lassen: die eingecheckte downloads.json bleibt.
  console.warn('Konnte Downloads nicht aktualisieren, nehme den letzten Stand:', e.message);
});
stempeln().catch((e) => console.warn('Versionsmarke nicht gesetzt:', e.message));
