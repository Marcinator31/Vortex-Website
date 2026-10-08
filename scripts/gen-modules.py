"""Erzeugt public/assets/js/modules.js aus dem Quellcode von Client und Addon.

Aufruf (Repos nebeneinander ausgecheckt):
    python3 scripts/gen-modules.py ../Vortex-Client ../vortex-addon-v2

Liest je Modul: Name und Kategorie (super("Name", Category.X)), die Beschreibung
(ModuleInfo.put im Client bzw. register(..., "Text") im Addon) und die
Standard-Einstellungen (Boolean/Number/Mode/Color-Setting). Nur noetig, wenn
neue Module dazukommen -- die Website selbst braucht Python nicht.
"""
import glob, json, re, sys, os

client, addon = sys.argv[1], sys.argv[2]
dateien = glob.glob(f'{client}/src/client/java/**/*.java', recursive=True) + glob.glob(f'{addon}/src/client/java/**/*.java', recursive=True)

module, klasse, settings = {}, {}, {}
for f in dateien:
    s = open(f, encoding='utf-8').read()
    m = re.search(r'super\("([^"]+)",\s*Category\.(\w+)', s)
    if not m:
        continue
    name = m.group(1)
    module[name] = m.group(2)
    k = re.search(r'public\s+(?:final\s+)?class\s+(\w+)', s)
    if k:
        klasse[k.group(1)] = name
    liste, gesehen = [], set()
    for sm in re.finditer(r'new (Boolean|Number|Mode|Color)Setting\(\s*"([^"]+)"\s*,(.*?)\)\s*[;.]', s, re.S):
        typ, n, args = sm.groups()
        if n in gesehen:
            continue
        args = ' '.join(args.split())
        try:
            if typ == 'Boolean':
                liste.append({'t': 'b', 'n': n, 'v': args.strip().startswith('true')})
            elif typ == 'Number':
                w = [float(re.sub(r'[fFdD]$', '', x.strip())) for x in args.split(',')[:4]]
                liste.append({'t': 'n', 'n': n, 'v': w[0], 'min': w[1], 'max': w[2], 's': w[3]})
            elif typ == 'Mode':
                idx = int(args.split(',')[0]); opts = re.findall(r'"([^"]*)"', args)
                if opts:
                    liste.append({'t': 'm', 'n': n, 'v': opts[min(idx, len(opts) - 1)]})
            elif typ == 'Color':
                c = re.search(r'0x([0-9A-Fa-f]{8})', args)
                if c:
                    liste.append({'t': 'c', 'n': n, 'v': '#' + c.group(1)[2:]})
            gesehen.add(n)
        except (ValueError, IndexError):
            pass
    if liste:
        settings[name] = liste

beschr = {}
info = open(f'{client}/src/client/java/com/vortex/client/gui/ModuleInfo.java', encoding='utf-8').read()
for m in re.finditer(r'put\("((?:[^"\\]|\\.)+)",\s*"((?:[^"\\]|\\.)*)"\s*\)', info):
    beschr[m.group(1)] = m.group(2).replace('\\"', '"')
for f in glob.glob(f'{addon}/src/client/java/**/VortexPlusAddon.java', recursive=True):
    src = open(f, encoding='utf-8').read()
    for m in re.finditer(r'register\(new\s+[\w.]*?(\w+)\(\)\s*,\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+)\)', src):
        if m.group(1) in klasse:
            beschr.setdefault(klasse[m.group(1)], ''.join(re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(2))).replace('\\"', '"'))
beschr.setdefault('Spotify', 'Connects Spotify: cover, title, controls, and your song above your head for other Vortex players.')
beschr.setdefault('Now Playing', 'HUD card with the current song, cover and progress.')

reihe = ['HUD', 'PVP', 'CHEATS', 'PERFORMANCE', 'MISC', 'MUSIC', 'BOTS']
out = {k: [] for k in reihe}
for n, kat in module.items():
    e = {'n': n, 'd': beschr.get(n, '')}
    if n in settings:
        e['s'] = settings[n]
    out.setdefault(kat, []).append(e)
for k in out:
    out[k].sort(key=lambda e: e['n'].lower())

ziel = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'js', 'modules.js')
with open(ziel, 'w', encoding='utf-8') as f:
    f.write('// Erzeugt aus dem Quellcode von Client und Addon (Namen, Beschreibungen, Einstellungen). Nicht von Hand pflegen.\n')
    f.write('window.VX_MODULES = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print({k: len(v) for k, v in out.items()})
