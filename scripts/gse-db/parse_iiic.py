#!/usr/bin/env python3
"""Parse III.C (biomassa) PDF.
Columns: Tipologia | Marca | Modello | Tipologia Generatore (Stufa/Caldaia) | Potenza [kWt] |
         Alimentazione (Pellet/Legna) | Rendimento [%] | Emissioni PP [mg/Nm3] | Classe ambientale
DB format target: [modello, pot_kw, tipologia_gen, alimentazione, rendimento, emissioni, classe]
"""
import pdfplumber, json, sys

PDF = '/tmp/III.C.pdf'
out = {}

def num(v):
    if v is None: return None
    s = str(v).strip().replace(',', '.')
    if s in ('','-','n.d.','N/A'): return None
    try: return float(s)
    except: return None

with pdfplumber.open(PDF) as pdf:
    for pg in pdf.pages:
        for t in pg.extract_tables():
            for row in t:
                if not row or len(row) < 9: continue
                cells = [(c or '').strip() for c in row]
                if not cells[0].startswith('III.C'): continue
                marca = cells[1].upper().strip()
                modello = cells[2].strip()
                gen = cells[3]
                pot = num(cells[4])
                alim = cells[5]
                rend = num(cells[6])
                emis = num(cells[7])
                cls = cells[8]
                if not marca or not modello: continue
                out.setdefault(marca, []).append([modello, pot, gen, alim, rend, emis, cls])

# Dedupe by modello+alim
for m,items in out.items():
    seen=set(); ded=[]
    for it in items:
        k=(it[0].lower(), (it[3] or '').lower())
        if k in seen: continue
        seen.add(k); ded.append(it)
    out[m]=ded

print(f"Brands: {len(out)} | entries: {sum(len(v) for v in out.values())}", file=sys.stderr)
json.dump(out, sys.stdout, ensure_ascii=False)
