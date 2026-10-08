# Vortex Website

Die Website für Vortex Client und Vortex Launcher – eine statische Seite (HTML, CSS, JavaScript, ohne Framework), gehostet als **Static Site auf Render**.

## Was die Seite kann

- **Interaktives Right-Shift-Menü:** Nachbau des Startmenüs aus dem Client. Echte Rechte-Shift-Taste öffnet und schließt es. Mod-Liste mit allen 143 Modulen (Namen, Beschreibungen und Standard-Einstellungen aus dem Quellcode), Suche, Schalter, aufklappbare Einstellungen, Bots-Seite mit START/STOPP und „Bot Status“-Zeile.
- **Downloads immer aktuell:** Launcher (Installer + Portable) und Mod-Dateien je Minecraft-Version mit Größe, Datum, SHA-256 und Änderungen. Es werden nur **freigegebene** Versionen angeboten (manifest.json), nie Betas.
- Cheat-Wand und durchsuchbare Cheat-Liste mit Bann-Risiko, Netherite-Farmer-Clip, HUD, Music-Karte, Cosmetics-Hinweis (ohne Modelle), FAQ, Trailer.
- Englisch und Deutsch (Umschalter oben, merkt sich die Wahl).
- Läuft auf Handy und Desktop, respektiert „Bewegung reduzieren“, Schriften liegen lokal (keine Google-Fonts-Anfragen).

## Aufbau

```
public/                 ← das wird veröffentlicht
  index.html
  assets/css/           site.css (Seite), preview.css (Client-Menü)
  assets/js/            i18n.js, preview.js, site.js, modules.js (erzeugt)
  assets/img, video, fonts
  data/downloads.json   ← wird beim Bauen auf Render neu erzeugt
scripts/
  build-data.mjs        holt Downloads (läuft auf Render, Node 18+, keine Pakete)
  gen-modules.py        erzeugt modules.js aus dem Client-/Addon-Quellcode
render.yaml             Render-Blueprint
.github/workflows/refresh.yml   stößt einen Neubau an, wenn sich Downloads ändern
```

## Auf Render veröffentlichen

1. Auf <https://dashboard.render.com> mit GitHub anmelden.
2. **New → Blueprint** wählen und dieses Repository verbinden. Render findet `render.yaml` und legt die Static Site `vortex-client` an. Auf **Apply** klicken.
   - Ohne Blueprint geht es auch: **New → Static Site**, Repo wählen, *Build Command* `node scripts/build-data.mjs`, *Publish Directory* `public`.
3. Nach ein bis zwei Minuten ist die Seite unter `https://vortex-client.onrender.com` (ist der Name schon vergeben, hängt Render ein paar Zeichen an) erreichbar. Jeder Push auf `main` baut sie neu.
4. **Downloads automatisch aktuell halten** (empfohlen):
   - In Render: Static Site → **Settings → Deploy Hook** → URL kopieren.
   - Im GitHub-Repo: **Settings → Secrets and variables → Actions**
     - *Secrets* → `RENDER_DEPLOY_HOOK` = die kopierte URL
     - *Variables* → `SITE_URL` = die Adresse der Seite (ohne `/` am Ende)
   - Ab dann prüft der Workflow „Downloads aktuell halten“ alle 30 Minuten, ob es neue freigegebene Dateien oder einen neuen Launcher gibt, und baut die Seite nur dann neu.
   - Die Deploy-Hook-URL ist ein Geheimnis: nur als Secret eintragen, nirgends posten.
5. Eigene Domain (optional): Static Site → **Settings → Custom Domains**, Domain eintragen und den angezeigten DNS-Eintrag beim Domain-Anbieter setzen. HTTPS macht Render automatisch.

## Lokal ansehen

```bash
node scripts/build-data.mjs        # optional: Downloads aktualisieren
cd public && python3 -m http.server 8080
# → http://localhost:8080
```

## Neue Module übernehmen

Wenn im Client oder Addon Module dazukommen oder sich Beschreibungen ändern:

```bash
python3 scripts/gen-modules.py ../Vortex-Client ../vortex-addon-v2
```

## Hinweise

- Kein offizielles Minecraft-Produkt; nicht von Mojang oder Microsoft genehmigt oder mit ihnen verbunden (steht auch im Fuß der Seite).
- Die Client-Vorschau läuft nur im Browser und speichert nichts.
