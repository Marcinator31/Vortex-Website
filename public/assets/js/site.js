// Seite: Sprache, Navigation, Cheat-Wand und -Suche, Bots, Downloads, Trailer.
(function () {
  const t = (...a) => window.VX.t(...a);
  const M = window.VX_MODULES || {};
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- Navigation
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('#menuBtn').addEventListener('click', () => {
    const auf = !nav.classList.contains('open');
    nav.classList.toggle('open', auf); $('#menuBtn').setAttribute('aria-expanded', String(auf));
  });
  document.querySelectorAll('#navlinks a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => window.VX.setLang(b.dataset.lang)));

  // ---------------------------------------------------------------- Auftritt
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------------------------------------------------------------- Cheats
  const cheats = M.CHEATS || [];
  const risiko = (d) => {
    const m = /(extreme|very high|high|medium|low) ban risk/i.exec(d || '');
    if (m) { const r = m[1].toLowerCase(); return r === 'very high' ? 'high' : r; }
    if (/cannot detect|undetectable|nothing is sent/i.test(d || '')) return 'low';
    return 'none';
  };
  cheats.forEach((c) => { c.r = risiko(c.d); });

  // Wand: Reihen laufen gegeneinander, Favoriten sind eingeschaltet
  const STARS = new Set(['Kill Aura', 'Crystal Aura', 'Auto Totem', 'Xray', 'ESP', 'Freecam', 'Fly', 'Elytra Fly', 'Scaffold', 'Speed', 'Nuker', 'Aimbot', 'Surround', 'Reach', 'Auto Anchor']);
  const rows = $('#wallRows');
  const proReihe = 11;
  for (let r = 0; r < 6; r++) {
    const teil = [];
    for (let k = 0; k < proReihe; k++) teil.push(cheats[(r * proReihe + k) % cheats.length]);
    const pill = (c) => `<div class="pill${STARS.has(c.n) ? ' on' : ''}">${esc(c.n)}<span class="sw"></span></div>`;
    const html = teil.map(pill).join('');
    rows.insertAdjacentHTML('beforeend', `<div class="row" style="animation-delay:${-r * 7}s">${html}${html}</div>`);
  }
  // Zahl zaehlt hoch, wenn die Wand ins Bild kommt
  const wallNum = $('#wallNum');
  new IntersectionObserver((es, o) => es.forEach((e) => {
    if (!e.isIntersecting) return; o.disconnect();
    if (still) return;
    const start = performance.now();
    const step = (now) => { const k = Math.min(1, (now - start) / 1200); wallNum.textContent = Math.round(66 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.4 }).observe($('#wall'));

  let filter = 'all', q = '', alle = false;
  function liste() {
    const s = q.trim().toLowerCase();
    const treffer = cheats.filter((c) => (filter === 'all' || c.r === filter) && (!s || c.n.toLowerCase().includes(s) || (c.d || '').toLowerCase().includes(s)));
    const zeigen = alle || s || filter !== 'all' ? treffer : treffer.slice(0, 12);
    $('#cheatList').innerHTML = zeigen.length ? zeigen.map((c) => `<article class="mod risk-${c.r}"><h3>${esc(c.n)}${c.r !== 'none' ? `<span class="risk"><span class="dot"></span>${t('c.risk.' + c.r)}</span>` : ''}</h3><p>${esc(c.d)}</p></article>`).join('')
      : `<p style="color:var(--dim)">${esc(t('c.none', q))}</p>`;
    $('#cheatCount').textContent = `${t('c.count', treffer.length)} · ${t('c.descNote')}`;
    const more = $('#cheatMore');
    more.hidden = !!(s || filter !== 'all');
    more.textContent = alle ? t('c.less') : t('c.more');
  }
  $('#cheatSearch').addEventListener('input', (e) => { q = e.target.value; liste(); });
  $('#riskFilter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-risk]'); if (!b) return;
    filter = b.dataset.risk;
    document.querySelectorAll('#riskFilter [data-risk]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    liste();
  });
  $('#cheatMore').addEventListener('click', () => { alle = !alle; liste(); if (!alle) $('#cheats').scrollIntoView(); });

  // ---------------------------------------------------------------- Bots & PvP
  function botsUndPvp() {
    const order = ['Netherite Farmer', 'Crop Farmer', 'Tree Farmer', 'Elytra Autopilot', 'AFK Bot'];
    const b = (M.BOTS || []).slice().sort((x, y) => order.indexOf(x.n) - order.indexOf(y.n));
    $('#botList').innerHTML = b.map((x) => `<div class="bot${x.n === 'Netherite Farmer' ? ' star' : ''}"><h3>${esc(x.n)}</h3><p>${esc(x.d)}</p></div>`).join('');
    $('#pvpChips').innerHTML = (M.PVP || []).map((x) => `<span class="chip" title="${esc(x.d)}">${esc(x.n)}</span>`).join('');
  }

  // Netherite-Clip nur abspielen, wenn er zu sehen ist
  const nf = $('#nfVideo');
  if (nf) new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { if (nf.preload === 'none') nf.preload = 'auto'; if (!still) nf.play().catch(() => {}); } else nf.pause();
  }), { threshold: 0.35 }).observe(nf);

  // ---------------------------------------------------------------- Music-Karte
  const bar = $('#songBar'), now = $('#songNow');
  const dauer = 140, start0 = 46, t0 = performance.now();
  const song = () => {
    const s = (start0 + (performance.now() - t0) / 1000) % dauer;
    bar.style.width = `${(s / dauer) * 100}%`;
    now.textContent = `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };
  song(); setInterval(song, 500);

  // ---------------------------------------------------------------- Downloads
  let daten = null, mcGewaehlt = null;
  const mb = (b) => (b ? (b / 1048576).toFixed(b > 104857600 ? 0 : 1) : '');
  const datum = (iso) => { if (!iso) return ''; try { return new Date(iso).toLocaleDateString(window.VX.lang() === 'de' ? 'de-AT' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (_) { return iso.slice(0, 10); } };

  // Mini-Markdown fuer die Release-Notizen (nur Ueberschriften und Listen)
  function md(txt) {
    const out = []; let inList = false;
    for (const raw of String(txt).split('\n')) {
      const l = raw.trim(); if (!l) continue;
      if (/^#{1,3}\s/.test(l)) { if (inList) { out.push('</ul>'); inList = false; } out.push(`<h4>${esc(l.replace(/^#+\s*/, ''))}</h4>`); }
      else if (/^[-*]\s/.test(l)) { if (!inList) { out.push('<ul>'); inList = true; } out.push(`<li>${esc(l.slice(2))}</li>`); }
      else { if (inList) { out.push('</ul>'); inList = false; } out.push(`<p>${esc(l)}</p>`); }
    }
    if (inList) out.push('</ul>');
    return out.join('');
  }

  function zeile(f, art) {
    const ico = art === 'client' ? '<img src="assets/img/logo.png" alt="">' : '<span class="addon-ico">+</span>';
    const titel = art === 'client' ? 'Vortex Client' : 'Vortex Plus Addon';
    const was = art === 'client' ? t('d.clientDesc') : t('d.addonDesc');
    return `<div class="file">${ico}<div><b>${titel} ${esc(f.version)}</b><small>${was} · ${t('d.size', mb(f.size))}${f.date ? ' · ' + esc(datum(f.date)) : ''}</small>
      ${f.sha256 ? `<button class="sha" type="button" data-sha="${esc(f.sha256)}" title="${esc(f.sha256)}">${t('d.sha')}</button>` : ''}</div>
      <a class="btn btn-ghost btn-small" href="${esc(f.url)}" download>${t('d.get')}</a></div>`;
  }

  function mcAnzeigen() {
    if (!daten) return;
    const v = daten.versions.find((x) => x.mc === mcGewaehlt) || daten.versions[0];
    if (!v) return;
    document.querySelectorAll('#mcTabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mc === v.mc)));
    const req = v.mc === '1.8.9' ? t('d.req.legacy') : t('d.req.fabric', v.mc);
    $('#mcFiles').innerHTML = zeile(v.client, 'client') + (v.addon ? zeile(v.addon, 'addon') : '') +
      `<p class="req">${esc(req)}</p>` +
      (v.client.notes ? `<details class="notes"><summary>${t('d.notes')}</summary><div class="md">${md(v.client.notes)}</div></details>` : '');
  }

  function launcherAnzeigen(l) {
    if (!l) return;
    $('#dlSetup').href = l.setup.url;
    $('#dlSetupSub').textContent = `v${l.version} · ${t('d.size', mb(l.setup.size))}`;
    $('#dlPortable').href = l.portable.url;
    $('#dlRelease').href = l.releaseUrl;
    $('#heroDownload').href = l.setup.url;
    $('#heroDlSub').textContent = `Windows 10 / 11 · v${l.version}`;
    $('#launcherMeta').innerHTML = `<span>${t('d.version', esc(l.version))}</span>${l.date ? `<span>${t('d.released', esc(datum(l.date)))}</span>` : ''}${daten?.downloads ? `<span>${t('d.downloads', Number(daten.downloads).toLocaleString())}</span>` : ''}`;
  }

  function downloadsAnzeigen() {
    if (!daten) return;
    if (!mcGewaehlt) mcGewaehlt = daten.versions[0]?.mc;
    $('#mcTabs').innerHTML = daten.versions.map((v) => `<button role="tab" type="button" data-mc="${esc(v.mc)}">${esc(v.mc)}</button>`).join('');
    mcAnzeigen();
    launcherAnzeigen(daten.launcher);
    const c = daten.versions[0]?.client?.version;
    if (c) $('#factVersion').textContent = `Vortex ${c}`;
    $('#fresh').textContent = t('d.fresh', datum(daten.generatedAt));
  }

  $('#mcTabs').addEventListener('click', (e) => { const b = e.target.closest('[data-mc]'); if (b) { mcGewaehlt = b.dataset.mc; mcAnzeigen(); } });
  $('#mcFiles').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-sha]'); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.sha); } catch (_) { /* egal */ }
    const el = $('#toast'); el.textContent = t('d.copied'); el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800);
  });

  fetch('data/downloads.json', { cache: 'no-cache' }).then((r) => r.json()).then((d) => {
    daten = d; downloadsAnzeigen();
    // Neuerer Launcher seit dem letzten Bauen? Direkt bei GitHub nachsehen (CORS erlaubt).
    fetch('https://api.github.com/repos/Marcinator31/Vortex-Launcher/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : null)).then((rel) => {
        if (!rel || !rel.tag_name) return;
        const v = rel.tag_name.replace(/^v/, '');
        if (v === daten.launcher.version) return;
        const setup = (rel.assets || []).find((a) => /^Vortex-Client-Setup-.*\.exe$/.test(a.name));
        const port = (rel.assets || []).find((a) => /^Vortex-Client-Portable-.*\.exe$/.test(a.name));
        if (!setup) return;
        daten.launcher = { version: v, date: rel.published_at, releaseUrl: rel.html_url,
          setup: { url: setup.browser_download_url, size: setup.size }, portable: port ? { url: port.browser_download_url, size: port.size } : daten.launcher.portable };
        launcherAnzeigen(daten.launcher);
      }).catch(() => {});
  }).catch(() => { $('#fresh').textContent = ''; });

  // ---------------------------------------------------------------- Discord
  let dcInfo = null;
  const dcZeigen = () => {
    if (!dcInfo) return;
    const fmtN = (n) => Number(n).toLocaleString(window.VX.lang() === 'de' ? 'de-AT' : 'en-GB');
    $('#dcCounts').textContent = t('dc.counts', fmtN(dcInfo.online), fmtN(dcInfo.members));
    $('#dcLive').hidden = false;
  };
  // Oeffentliche Einladungs-Info von Discord (Name, Icon, Mitglieder); faellt sie aus, bleibt der Rest stehen
  fetch('https://discord.com/api/v10/invites/mrSa2Fu3yS?with_counts=true')
    .then((r) => (r.ok ? r.json() : null)).then((d) => {
      if (!d || !d.guild) return;
      dcInfo = { online: d.approximate_presence_count || 0, members: d.approximate_member_count || 0 };
      if (d.guild.name) $('#dcName').textContent = d.guild.name;
      if (d.guild.icon) $('#dcIcon').innerHTML = `<img src="https://cdn.discordapp.com/icons/${encodeURIComponent(d.guild.id)}/${encodeURIComponent(d.guild.icon)}.png?size=128" alt="" width="64" height="64">`;
      dcZeigen();
    }).catch(() => {});
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (_) { /* egal */ }
    const lbl = b.querySelector('span'); b.classList.add('done'); lbl.textContent = t('dc.done');
    setTimeout(() => { b.classList.remove('done'); lbl.textContent = t('dc.copy'); }, 1800);
  }));

  // ---------------------------------------------------------------- Trailer
  const dlg = $('#trailer'), vid = $('#trailerVideo');
  $('#trailerBtn').addEventListener('click', () => { dlg.showModal(); vid.play().catch(() => {}); });
  const zu = () => { vid.pause(); dlg.close(); };
  $('#trailerClose').addEventListener('click', zu);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) zu(); });
  dlg.addEventListener('close', () => vid.pause());

  // ---------------------------------------------------------------- Sprache
  document.addEventListener('vx-lang', () => { liste(); botsUndPvp(); downloadsAnzeigen(); dcZeigen(); });
  window.VX.applyLang();
})();
