// Nachbau des Right-Shift-Menues im Browser: Startmenue, Mod-Liste mit allen
// echten Modulen (Namen, Beschreibungen, Standard-Einstellungen aus dem
// Quellcode) und die Bots-Seite. Alles nur im Browser -- nichts wird gespeichert.
(function () {
  const M = window.VX_MODULES || {};
  const t = (...a) => window.VX.t(...a);
  const game = document.getElementById('game');
  const root = document.getElementById('vx');
  const hud = document.getElementById('vxHud');
  if (!game || !root) return;

  const KATS = [['HUD', 'HUD'], ['PVP', 'PvP'], ['CHEATS', 'Cheats'], ['PERFORMANCE', 'Performance'], ['MISC', 'Misc'], ['MUSIC', 'Music']];
  // Wie im Screenshot aus dem Spiel: 10 Module an
  const an = new Set(['AppleSkin', 'ArmorHUD', 'Bot Status', 'CPS', 'FPS', 'Keystrokes', 'Hit Color', 'Reach Display', 'Toggle Sprint', 'Spotify']);
  const offen = new Set();
  let suche = '';
  let ansicht = 'home';
  const laeuft = new Map();   // Bot -> { seit, zaehler }

  const icon = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const zahl = (v, s) => (s < 1 ? Number(v).toFixed(2) : String(Math.round(v)));
  const aktiv = () => [...an].filter((n) => !(M.BOTS || []).some((b) => b.n === n)).length;

  const TOOLS = [
    ['hud', 'i-hud'], ['presets', 'i-sliders'], ['way', 'i-pin'], ['macros', 'i-zap'],
    ['friends', 'i-users'], ['wardrobe', 'i-shirt'], ['bots', 'i-bot'], ['keys', 'i-keys'], ['music', 'i-music'],
  ];

  function kopf(titel, sub, zurueck) {
    return `<div class="vx-head">
      ${zurueck ? `<button class="vx-back" data-go="home" aria-label="Back">${icon('i-back')}</button>` : ''}
      <img src="assets/img/logo.png" alt="">
      <div><b>${titel}</b><small>${sub}</small></div>
      <button class="vx-x" data-close aria-label="Close">${icon('i-x')}</button></div>`;
  }

  function home() {
    return `<div class="vx-panel ${ansicht === 'home' ? 'active' : ''}" data-view="home">
      ${kopf('Vortex Client', `v4.27.0 · ${t('vx.sub')}`)}
      <button class="vx-mods" data-go="mods"><span class="ic">${icon('i-grid')}</span>
        <span><b>${t('vx.mods')}</b><small id="vxActive">${t('vx.active', aktiv())}</small></span>
        <span class="open">${t('vx.open')} ${icon('i-chev')}</span></button>
      <div class="vx-label">${t('vx.tools')}</div>
      <div class="vx-tools">
        ${TOOLS.map(([k, ic], i) => `<button class="vx-tool${k === 'music' ? ' wide' : ''}" style="--i:${i}" data-tool="${k}">
          <span class="ic">${icon(ic)}</span><span><b>${t('vx.t.' + k)}</b><small>${t('vx.s.' + k)}</small></span></button>`).join('')}
      </div>
      <div class="vx-foot"><span>${t('vx.esc')}</span>
        <button data-tool="settings">${icon('i-gear')} ${t('vx.settings')}</button>
        <button data-tool="community">${icon('i-globe')} ${t('vx.community')}</button>
        <button class="red" data-tool="restart">${icon('i-restart')} ${t('vx.restart')}</button></div>
    </div>`;
  }

  function einstellungen(m) {
    const s = (m.s || []).slice(0, 7);
    const zeilen = s.map((x, i) => {
      if (x.t === 'b') return `<div class="vx-s"><label>${esc(x.n)}</label><span class="sw${x.v ? ' on' : ''}" data-bool="${i}" role="switch" aria-checked="${x.v}"></span></div>`;
      if (x.t === 'n') return `<div class="vx-s"><label>${esc(x.n)}</label><input type="range" min="${x.min}" max="${x.max}" step="${x.s}" value="${x.v}" data-num="${i}" aria-label="${esc(x.n)}"><output>${zahl(x.v, x.s)}</output></div>`;
      if (x.t === 'm') return `<div class="vx-s"><label>${esc(x.n)}</label><span class="val">${esc(x.v)}</span></div>`;
      if (x.t === 'c') return `<div class="vx-s"><label>${esc(x.n)}</label><span style="width:1.1em;height:1.1em;border-radius:.25em;background:${x.v};border:1px solid rgba(255,255,255,.3)"></span></div>`;
      return '';
    }).join('');
    const mehr = (m.s || []).length > 7 ? `<div class="vx-s" style="color:rgba(255,255,255,.45)">${t('vx.moreInGame')}</div>` : '';
    return `<div class="vx-set"><p>${esc(m.d || '')}</p>
      <div class="vx-s"><label>${t('vx.toggleKey')}</label><span class="val">${t('vx.none')}</span></div>${zeilen}${mehr}</div>`;
  }

  function spalten() {
    const q = suche.trim().toLowerCase();
    let treffer = 0;
    const html = KATS.map(([k, name]) => {
      const alle = M[k] || [];
      const liste = q ? alle.filter((m) => m.n.toLowerCase().includes(q) || (m.d || '').toLowerCase().includes(q)) : alle;
      treffer += liste.length;
      if (q && !liste.length) return '';
      const zahlAn = alle.filter((m) => an.has(m.n)).length;
      return `<div class="vx-col"><h5>${name}<span>${zahlAn}/${alle.length}</span></h5><ul>
        ${liste.map((m) => `<li class="vx-row${an.has(m.n) ? ' on' : ''}${offen.has(m.n) ? ' expanded' : ''}" data-mod="${esc(m.n)}">
          <button type="button" data-toggle title="${esc(m.d || '')}"><span class="nm">${esc(m.n)}</span><span class="vx-plus" data-expand aria-label="Settings">+</span><span class="sw"></span></button>
          ${offen.has(m.n) ? einstellungen(m) : ''}</li>`).join('')}
      </ul></div>`;
    }).join('');
    return treffer ? html : `<div class="vx-empty">${t('vx.empty')}</div>`;
  }

  function mods() {
    return `<div class="vx-panel wide ${ansicht === 'mods' ? 'active' : ''}" data-view="mods">
      <div class="vx-bar"><button class="vx-back" data-go="home" aria-label="Back">${icon('i-back')}</button>
        <h4>${t('vx.mods')}</h4><span class="count" id="vxCount">${t('vx.active', aktiv())}</span>
        <label class="vx-find">${icon('i-search')}<input type="search" id="vxSearch" placeholder="${t('vx.search')}" value="${esc(suche)}" autocomplete="off"></label>
        <button class="vx-x" data-close aria-label="Close" style="margin-left:.4em">${icon('i-x')}</button></div>
      <div class="vx-cols" id="vxCols">${spalten()}</div>
    </div>`;
  }

  // Statuszeilen wie im Spiel (BotHud / getStatus der Bots)
  function botStatus(n) {
    const l = laeuft.get(n);
    if (!l) return t('vx.idle');
    const sek = Math.floor((Date.now() - l.seit) / 1000);
    const min = Math.floor(sek / 60);
    switch (n) {
      case 'Netherite Farmer': return `${sek % 9 < 3 ? 'Mining debris' : 'Tunneling'}  |  ${Math.floor(sek / 7)} debris  |  ${min} min`;
      case 'Crop Farmer': return `Harvesting  |  ${Math.floor(sek * 1.6)} harvested  |  ${min} min`;
      case 'Tree Farmer': return `${sek % 6 < 4 ? 'Chopping' : 'Replanting'}  |  ${Math.floor(sek / 4)} logs  |  ${min} min`;
      case 'AFK Bot': return `Anti idle  |  next move in ${45 - (sek % 45)} s`;
      case 'Elytra Autopilot': return `Cruising at Y 200  |  ${Math.max(0, 2400 - sek * 31)} blocks left`;
      default: return 'Running';
    }
  }

  function bots() {
    return `<div class="vx-panel wide ${ansicht === 'bots' ? 'active' : ''}" data-view="bots">
      <div class="vx-bar"><button class="vx-back" data-go="home" aria-label="Back">${icon('i-back')}</button><h4>${t('vx.bots')}</h4>
        <button class="vx-x" data-close aria-label="Close" style="margin-left:auto">${icon('i-x')}</button></div>
      <div class="vx-bots">${(M.BOTS || []).filter((b) => b.n !== 'Bot Status').map((b) => `<div class="vx-botc${laeuft.has(b.n) ? ' run' : ''}" data-bot="${esc(b.n)}">
        <header><b>${esc(b.n)}</b><button type="button" data-run>${laeuft.has(b.n) ? t('vx.stop') : t('vx.start')}</button></header>
        <p>${esc(b.d || '')}</p><div class="st">${esc(botStatus(b.n))}</div></div>`).join('')}</div>
    </div>`;
  }

  function zeichne() {
    root.innerHTML = home() + mods() + bots();
  }

  function zeichneHud() {
    hud.innerHTML = [...laeuft.keys()].map((n) => `<div><b>${esc(n)}</b>  ${esc(botStatus(n))}</div>`).join('');
  }

  function zeige(v) {
    ansicht = v;
    root.querySelectorAll('.vx-panel').forEach((p) => p.classList.toggle('active', p.dataset.view === v));
    if (v === 'mods') setTimeout(() => document.getElementById('vxSearch')?.focus({ preventScroll: true }), 250);
  }

  function oeffnen(auf) {
    const jetzt = auf ?? !game.classList.contains('open');
    game.classList.toggle('open', jetzt);
    if (jetzt) { ansicht = 'home'; zeichne(); requestAnimationFrame(() => zeige('home')); }
    document.getElementById('heroKey')?.classList.add('down');
    setTimeout(() => document.getElementById('heroKey')?.classList.remove('down'), 140);
  }
  window.VX = Object.assign(window.VX || {}, { openMenu: oeffnen });

  let toastZeit;
  function toast(text) {
    const el = document.getElementById('toast');
    el.textContent = text; el.classList.add('show');
    clearTimeout(toastZeit); toastZeit = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // --- Ereignisse ---------------------------------------------------------
  game.addEventListener('click', (e) => {
    if (!game.classList.contains('open')) { oeffnen(true); return; }
    const el = e.target.closest('[data-go],[data-close],[data-tool],[data-toggle],[data-run],[data-bool]');
    if (!el) { if (!e.target.closest('.vx-panel')) oeffnen(false); return; }
    if (el.dataset.go) { if (el.dataset.go === 'home') { zeichne(); } zeige(el.dataset.go); return; }
    if (el.hasAttribute('data-close')) { oeffnen(false); return; }
    if (el.dataset.tool) {
      if (el.dataset.tool === 'bots') { zeige('bots'); return; }
      const name = el.querySelector('b')?.textContent || el.textContent.trim();
      toast(t('vx.inGame', name));
      return;
    }
    if (el.hasAttribute('data-bool')) {
      el.classList.toggle('on'); el.setAttribute('aria-checked', String(el.classList.contains('on')));
      return;
    }
    if (el.hasAttribute('data-toggle')) {
      const li = el.closest('[data-mod]'); const n = li.dataset.mod;
      if (e.target.closest('[data-expand]')) {
        offen.has(n) ? offen.delete(n) : offen.add(n);
      } else {
        an.has(n) ? an.delete(n) : an.add(n);
      }
      const scroll = [...root.querySelectorAll('.vx-col ul')].map((u) => u.scrollTop);
      const cols = document.getElementById('vxCols'); const sx = cols.scrollLeft;
      cols.innerHTML = spalten(); cols.scrollLeft = sx;
      root.querySelectorAll('.vx-col ul').forEach((u, i) => { u.scrollTop = scroll[i] || 0; });
      document.getElementById('vxCount').textContent = t('vx.active', aktiv());
      return;
    }
    if (el.hasAttribute('data-run')) {
      const n = el.closest('[data-bot]').dataset.bot;
      if (laeuft.has(n)) laeuft.delete(n); else laeuft.set(n, { seit: Date.now() });
      const card = el.closest('[data-bot]');
      card.classList.toggle('run', laeuft.has(n));
      el.textContent = laeuft.has(n) ? t('vx.stop') : t('vx.start');
      card.querySelector('.st').textContent = botStatus(n);
      zeichneHud();
    }
  });

  root.addEventListener('input', (e) => {
    if (e.target.id === 'vxSearch') {
      suche = e.target.value;
      document.getElementById('vxCols').innerHTML = spalten();
    } else if (e.target.dataset.num !== undefined) {
      const out = e.target.nextElementSibling; const s = Number(e.target.step);
      out.textContent = zahl(e.target.value, s);
    }
  });

  // Echte Taste: Rechte Shift-Taste oeffnet/schliesst, Escape schliesst
  document.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftRight' && !e.repeat && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) { e.preventDefault(); oeffnen(); }
    else if (e.key === 'Escape' && game.classList.contains('open')) { oeffnen(false); }
  });
  const key = document.getElementById('heroKey');
  key?.addEventListener('click', () => oeffnen());
  key?.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); oeffnen(); } });

  // Bots laufen weiter: Status jede Sekunde neu
  setInterval(() => {
    if (!laeuft.size) return;
    zeichneHud();
    root.querySelectorAll('[data-bot]').forEach((c) => { c.querySelector('.st').textContent = botStatus(c.dataset.bot); });
  }, 1000);

  document.addEventListener('vx-lang', () => { if (game.classList.contains('open')) { zeichne(); zeige(ansicht); } else zeichne(); });

  zeichne();
  // Einmaliger Auftritt: nach dem Laden oeffnet sich das Menue von selbst
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(() => { if (!game.classList.contains('open')) oeffnen(true); }, still ? 0 : 1100);
})();
