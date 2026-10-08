// Sprachen: Englisch steht im HTML, Deutsch hier. Dynamische Texte (Downloads,
// Client-Vorschau) holen sich ihre Woerter ueber VX.t('schluessel').
(function () {
  const DE = {
    'nav.launcher': 'Launcher', 'nav.cheats': 'Cheats', 'nav.bots': 'Bots', 'nav.pvp': 'PvP & HUD', 'nav.download': 'Download', 'nav.get': 'Vortex holen',
    'hero.press': 'Drück',
    'hero.lead': 'Diese eine Taste öffnet alles in <b>Vortex</b>: 143 Module, 66 Cheats, 5 Bots, dein HUD und deine Musik. Kostenlos, für jede Minecraft-Version von 1.8.9 bis 26.2.',
    'hero.dl': 'Launcher herunterladen', 'hero.trailer': 'Trailer ansehen', 'hero.f2': 'Minecraft 1.8.9 – 26.2', 'hero.f3': 'Kostenlos',
    'hero.hint': 'Drück <kbd>Rechte Shift-Taste</kbd> oder klick, um das Menü zu öffnen', 'hero.sim': 'Vorschau im Browser',
    'l.h': 'Ein Launcher für jede Version',
    'l.p': 'Mit Microsoft anmelden, Minecraft-Version wählen, Play drücken. Der Launcher installiert Fabric, Vortex und das Plus Addon für dich und hält alles aktuell.',
    'l.c1t': 'Immer das neueste Vortex', 'l.c1': 'Updates kommen von selbst – keine Jar-Dateien kopieren.',
    'l.p1t': 'Jede Version, ein Klick', 'l.p1': '26.2, 26.1.2, 26.1.1, 1.21.11 und 1.8.9 – jede mit eigenem Ordner für Mods, Welten und Einstellungen.',
    'l.p2t': 'Mod-Profile', 'l.p2': 'Ein PvP-Setup und ein Survival-Setup nebeneinander – mit einem Klick wechseln.',
    'l.p3t': 'Mods, Shader, Server, Hosting', 'l.p3': 'Mods auf Modrinth finden, Iris für Shader installieren, Servern beitreten und deine Welt für Freunde hosten.',
    'c.h': '66 Cheats, einen Klick entfernt',
    'c.p': 'Das Plus Addon packt jeden Cheat ins selbe Menü wie den Rest von Vortex. Bei jedem steht, wie riskant er auf einem Server ist.',
    'c.cheats': 'CHEATS', 'c.searchLabel': 'Cheats durchsuchen', 'c.search': '66 Cheats durchsuchen – z. B. „aura“ oder „elytra“',
    'c.all': 'Alle', 'c.low': 'Gering', 'c.medium': 'Mittel', 'c.high': 'Hoch', 'c.extreme': 'Extrem', 'c.more': 'Alle zeigen', 'c.less': 'Weniger zeigen',
    'c.note': '<b>Cheats können zum Bann führen.</b> Nutz sie nur, wo der Server es erlaubt. Ein Schalter – „Clean Modules“ in den Einstellungen – schaltet alle Cheats und Bots aus und blendet sie aus, z. B. vor einem Screenshare.',
    'c.count': '{0} von 66 Cheats', 'c.none': 'Kein Cheat passt zu „{0}“.', 'c.risk.low': 'Geringes Risiko', 'c.risk.medium': 'Mittleres Risiko', 'c.risk.high': 'Hohes Risiko', 'c.risk.extreme': 'Extremes Risiko', 'c.risk.none': 'Nicht erkennbar', 'c.descNote': 'Beschreibungen wie im Spiel (Englisch).',
    'b.h': 'Bots, die weiterspielen',
    'b.p': 'Bot starten, Controller weglegen. Der Netherite Farmer gräbt auf Y 15, baut jedes Ancient Debris ab, isst, hält ein Totem in der Off-Hand und weicht Lava aus.',
    'b.speed': '2× schneller · im Spiel aufgenommen',
    'p.h': 'Ein HUD, das du selbst anordnest',
    'p.p': '28 HUD-Elemente und 15 PvP-Werkzeuge. Keystrokes, Rüstung, Effekte, Koordinaten und den Rest im HUD-Editor dahin ziehen, wo du sie willst.',
    'p.c1t': 'Keystrokes & CPS', 'p.c1': 'Jede Taste und jeden Klick sehen.', 'p.c2t': 'Rüstung auf einen Blick', 'p.c2': 'Haltbarkeit in Prozent, Effekte mit Restzeit.',
    'm.h': 'Dein Song über deinem Kopf',
    'm.p': 'Verbinde Spotify, und Vortex zeigt Cover, Titel und Fortschritt in deinem HUD. Andere Vortex-Spieler sehen, was du hörst – und können mit einem Klick mithören.',
    'k.h': 'Animierte Capes, 3D-Hüte und Emotes', 'k.p': 'Die bleiben eine Überraschung. Öffne im Spiel die Wardrobe und probier sie an.', 'k.cta': 'Im Spiel ausprobieren',
    'd.h': 'Download',
    'd.p': 'Am einfachsten mit dem Launcher: Er richtet alles ein und hält es aktuell. Lieber selbst einrichten? Dann nimm die Mod-Dateien für deine Version.',
    'd.lt': 'Vortex Launcher', 'd.ld': 'Windows 10 und 11. Mit Client, Plus Addon und Fabric.',
    'd.setup': 'Installer herunterladen', 'd.portable': 'Portable-Version (ohne Installation)', 'd.release': 'Release auf GitHub',
    'd.b1': 'Richtet Fabric, Vortex und das Plus Addon in einem Rutsch ein', 'd.b2': 'Aktualisiert sich selbst und jede Mod, die er installiert hat', 'd.b3': 'Microsoft-Anmeldung, Skins, Welten, Server und Hosting',
    'd.mt': 'Mod-Dateien', 'd.md': 'Für deine eigene Fabric-Installation. Wähl deine Minecraft-Version:',
    'd.version': 'Version {0}', 'd.released': 'veröffentlicht {0}', 'd.get': 'Laden', 'd.sha': 'SHA-256 kopieren', 'd.copied': 'SHA-256 kopiert',
    'd.req.fabric': 'Braucht Fabric Loader und Fabric API für Minecraft {0}. Das Plus Addon braucht den Vortex Client derselben Version.',
    'd.req.legacy': 'Braucht Legacy Fabric für Minecraft 1.8.9. Für 1.8.9 gibt es kein Plus Addon.',
    'd.notes': 'Was ist neu', 'd.fresh': 'Stand der Downloads: {0}. Es werden nur freigegebene Versionen angeboten, keine Betas.',
    'd.clientDesc': 'HUD, PvP, Performance, Music', 'd.addonDesc': 'Cheats und Bots', 'd.size': '{0} MB', 'd.downloads': '{0} Downloads',
    'dc.h': 'Komm auf den Vortex-Discord', 'dc.p': 'Hol dir Hilfe beim Einrichten, melde Bugs, schlag neue Module vor und erfahr als Erster von neuen Versionen.',
    'dc.join': 'Discord beitreten', 'dc.team': 'Gemacht von', 'dc.role': 'Entwickler · Discord', 'dc.role2': 'Entwickler · Discord',
    'dc.hint': 'Klick auf einen Namen, um ihn zu kopieren, und füg ihn in Discord als Freund hinzu.', 'dc.copied': '„{0}“ kopiert – in Discord unter „Freund hinzufügen“ einfügen.',
    'dc.counts': '{0} online · {1} Mitglieder',
    'f.q7': 'Wo bekomme ich Hilfe?', 'f.a7': 'Auf unserem <a href="https://discord.gg/mrSa2Fu3yS" target="_blank" rel="noopener">Discord-Server</a>. Stell deine Frage dort – mit Screenshot oder dem Launcher-Log, wenn etwas nicht startet.',
    'f.h': 'Fragen',
    'f.q1': 'Ist Vortex kostenlos?', 'f.a1': 'Ja. Client, Plus Addon und Launcher sind kostenlos.',
    'f.q2': 'Welche Minecraft-Versionen gehen?', 'f.a2': '26.2, 26.1.2, 26.1.1 und 1.21.11 mit Fabric, 1.8.9 mit Legacy Fabric. Das Plus Addon (Cheats und Bots) gibt es für alle Versionen außer 1.8.9.',
    'f.q3': 'Kann ich gebannt werden?', 'f.a3': 'Mit Cheats: ja, auf den meisten Servern. Bei jedem Cheat steht das Bann-Risiko. Die normalen Client-Funktionen – HUD, PvP-Werkzeuge, Performance, Music – sind fürs normale Spielen gemacht.',
    'f.q4': 'Windows sagt, der Installer ist unbekannt. Ist das sicher?', 'f.a4': 'Windows SmartScreen warnt bei jedem neuen Programm, das nicht mit einem bezahlten Zertifikat signiert ist. Lade nur hier oder von unseren GitHub-Releases; jede Mod-Datei kannst du mit ihrer SHA-256 oben prüfen.',
    'f.q5': 'Geht es auf Mac oder Linux?', 'f.a5': 'Der Launcher ist für Windows. Auf Mac und Linux installierst du Fabric selbst und legst die Mod-Dateien aus dem Download-Bereich dazu.',
    'f.q6': 'Geht es mit Sodium und Iris?', 'f.a6': 'Ja. Der Launcher kann Iris und Sodium für Shader installieren. Spinnt ein Vortex-Modul mit Sodium, schalte beide im Launcher wieder aus.',
    'foot.legal': 'Kein offizielles Minecraft-Produkt. Nicht von Mojang oder Microsoft genehmigt oder mit ihnen verbunden.',
    't.close': 'Schließen',
    // Client-Vorschau
    'vx.sub': 'Right-Shift-Menü', 'vx.active': '{0} von 143 aktiv', 'vx.open': 'Öffnen', 'vx.tools': 'WERKZEUGE', 'vx.esc': 'ESC zum Schließen',
    'vx.settings': 'Einstellungen', 'vx.community': 'Community', 'vx.restart': 'Neustart', 'vx.search': 'Suchen…', 'vx.mods': 'Mods', 'vx.bots': 'Bots',
    'vx.start': 'START', 'vx.stop': 'STOPP', 'vx.idle': 'Untätig', 'vx.empty': 'Nichts gefunden.', 'vx.inGame': '„{0}“ öffnet sich im Spiel.',
    'vx.t.hud': 'HUD Editor', 'vx.s.hud': 'Layout ändern', 'vx.t.presets': 'Presets', 'vx.s.presets': 'Preset 1', 'vx.t.way': 'Waypoints', 'vx.s.way': 'Noch keine',
    'vx.t.macros': 'Macros', 'vx.s.macros': 'Noch keine', 'vx.t.friends': 'Friends', 'vx.s.friends': 'Chat, Einladungen', 'vx.t.wardrobe': 'Wardrobe', 'vx.s.wardrobe': 'Skins, Capes',
    'vx.t.bots': 'Bots', 'vx.s.bots': '5 Bots', 'vx.t.keys': 'Keybinds', 'vx.s.keys': 'Alle Tasten', 'vx.t.music': 'Music', 'vx.s.music': 'Spotify',
    'vx.toggleKey': 'Taste', 'vx.none': 'Keine', 'vx.moreInGame': 'Weitere Einstellungen im Spiel.',
  };
  const EN = {
    'c.less': 'Show less', 'c.count': '{0} of 66 cheats', 'c.none': 'No cheat matches “{0}”.', 'c.risk.low': 'Low risk', 'c.risk.medium': 'Medium risk', 'c.risk.high': 'High risk', 'c.risk.extreme': 'Extreme risk', 'c.risk.none': 'Undetectable', 'c.descNote': 'Descriptions as shown in game.',
    'd.version': 'Version {0}', 'd.released': 'released {0}', 'd.get': 'Download', 'd.sha': 'Copy SHA-256', 'd.copied': 'SHA-256 copied',
    'd.req.fabric': 'Needs Fabric Loader and Fabric API for Minecraft {0}. The Plus Addon needs the Vortex Client of the same version.',
    'd.req.legacy': 'Needs Legacy Fabric for Minecraft 1.8.9. There is no Plus Addon for 1.8.9.',
    'd.notes': 'What’s new (written in German)', 'd.fresh': 'Downloads as of {0}. Only released versions are offered here, never betas.',
    'd.clientDesc': 'HUD, PvP, performance, music', 'd.addonDesc': 'Cheats and bots', 'd.size': '{0} MB', 'd.downloads': '{0} downloads',
    'dc.copied': '“{0}” copied – paste it under “Add Friend” in Discord.', 'dc.counts': '{0} online · {1} members',
    'vx.sub': 'Right Shift menu', 'vx.active': '{0} of 143 active', 'vx.open': 'Open', 'vx.tools': 'TOOLS', 'vx.esc': 'ESC to close',
    'vx.settings': 'Settings', 'vx.community': 'Community', 'vx.restart': 'Restart', 'vx.search': 'Search…', 'vx.mods': 'Mods', 'vx.bots': 'Bots',
    'vx.start': 'START', 'vx.stop': 'STOP', 'vx.idle': 'Idle', 'vx.empty': 'Nothing found.', 'vx.inGame': '“{0}” opens in game.',
    'vx.t.hud': 'HUD Editor', 'vx.s.hud': 'Edit layout', 'vx.t.presets': 'Presets', 'vx.s.presets': 'Preset 1', 'vx.t.way': 'Waypoints', 'vx.s.way': 'None yet',
    'vx.t.macros': 'Macros', 'vx.s.macros': 'None yet', 'vx.t.friends': 'Friends', 'vx.s.friends': 'Chat, invites', 'vx.t.wardrobe': 'Wardrobe', 'vx.s.wardrobe': 'Skins, capes',
    'vx.t.bots': 'Bots', 'vx.s.bots': '5 bots', 'vx.t.keys': 'Keybinds', 'vx.s.keys': 'All keys', 'vx.t.music': 'Music', 'vx.s.music': 'Spotify',
    'vx.toggleKey': 'Toggle Key', 'vx.none': 'None', 'vx.moreInGame': 'More settings in game.',
  };

  const html = {};   // Englische Originale aus dem HTML
  let lang = 'en';
  try { lang = localStorage.getItem('vx-lang') || ''; } catch (_) { lang = ''; }
  if (lang !== 'de' && lang !== 'en') lang = (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';

  const fmt = (s, args) => String(s).replace(/\{(\d)\}/g, (_, i) => (args[i] ?? ''));
  const t = (k, ...args) => fmt((lang === 'de' ? (DE[k] ?? EN[k] ?? html[k]) : (EN[k] ?? html[k])) ?? k, args);

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.dataset.i18n;
      if (!(k in html)) html[k] = el.textContent;
      el.textContent = lang === 'de' && DE[k] ? DE[k] : html[k];
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const k = el.dataset.i18nHtml;
      if (!(k in html)) html[k] = el.innerHTML;
      el.innerHTML = lang === 'de' && DE[k] ? DE[k] : html[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const k = el.dataset.i18nPh;
      if (!(k in html)) html[k] = el.placeholder;
      el.placeholder = lang === 'de' && DE[k] ? DE[k] : html[k];
    });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.dispatchEvent(new CustomEvent('vx-lang', { detail: lang }));
  }

  function set(l) {
    lang = l;
    try { localStorage.setItem('vx-lang', l); } catch (_) { /* privat */ }
    apply();
  }

  window.VX = Object.assign(window.VX || {}, { t, setLang: set, lang: () => lang, applyLang: apply });
})();
