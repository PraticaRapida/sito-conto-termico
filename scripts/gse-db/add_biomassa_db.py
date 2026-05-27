#!/usr/bin/env python3
"""Insert CT3_DB_BIOMASSA into calcolatore.html before ct3GetDB."""
import json, re

HTML = '/Users/samueleberetta/Desktop/sito-conto-termico-main/public/calcolatore.html'
src = open(HTML).read()
bio = json.load(open('/tmp/iiic.json'))
sorted_bio = {k: bio[k] for k in sorted(bio.keys())}
blob = json.dumps(sorted_bio, ensure_ascii=False, separators=(',',':'))

# Check if CT3_DB_BIOMASSA already exists
if 'CT3_DB_BIOMASSA' in src:
    # Replace existing
    pat = re.compile(r'const\s+CT3_DB_BIOMASSA\s*=\s*\{')
    m = pat.search(src)
    start = m.start(); end_brace = src.find('{', m.end()-1)
    depth=0; in_str=False; esc=False
    for i in range(end_brace,len(src)):
        c=src[i]
        if in_str:
            if esc:esc=False
            elif c=='\\':esc=True
            elif c=='"':in_str=False
            continue
        if c=='"':in_str=True
        elif c=='{':depth+=1
        elif c=='}':
            depth-=1
            if depth==0:
                end=i+1; break
    src = src[:end_brace] + blob + src[end:]
else:
    # Insert before ct3GetDB
    marker = '// Restituisce il database corretto per tipo intervento\nfunction ct3GetDB(tipo) {'
    insertion = (
      '// ═══════════════════════════════════════════════════════════════\n'
      '//  DATABASE PRODOTTI GSE – Biomassa (interventi 4 e 5)\n'
      '//  Formato: { MARCA: [[modello, pot_kw, tipologia_gen, alimentazione, rendimento, emissioni, classe_amb], ...] }\n'
      '// ═══════════════════════════════════════════════════════════════\n'
      'const CT3_DB_BIOMASSA = ' + blob + ';\n\n'
    )
    src = src.replace(marker, insertion + marker)
open(HTML,'w').write(src)
print(f"CT3_DB_BIOMASSA: {len(bio)} brands, {sum(len(v) for v in bio.values())} models")
