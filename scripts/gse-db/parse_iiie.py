#!/usr/bin/env python3
"""Parse III.E (scaldacqua a PdC) PDF.
Columns: Tipologia intervento | Marca | Modello | Potenza [Wt] | Tipologia | Classe | Capacità [litri]
Current DB format: [modello, potenza_kw, cop, capacita_litri] -> COP not in PDF, preserve from old.
"""
import pdfplumber, json, sys

PDF = '/tmp/III.E.pdf'
out = {}

def num(v):
    if v is None: return None
    s = str(v).strip().replace(',', '.')
    if s in ('', '-', 'n.d.', 'N/A', 'n/a'): return None
    try: return float(s)
    except: return None

with pdfplumber.open(PDF) as pdf:
    for pg in pdf.pages:
        for t in pg.extract_tables():
            for row in t:
                if not row or len(row) < 7: continue
                cells = [(c or '').strip() for c in row]
                if not cells[0].startswith('III.E'): continue
                marca = cells[1].upper().strip()
                modello = cells[2].strip()
                pot_w = num(cells[3])
                tipologia = cells[4]
                classe = cells[5]
                cap = num(cells[6])
                pot_kw = round(pot_w/1000, 3) if pot_w is not None else None
                if not marca or not modello: continue
                out.setdefault(marca, []).append([modello, pot_kw, cap, tipologia, classe])

# Dedupe
for m,items in out.items():
    seen=set(); ded=[]
    for it in items:
        k=(it[0].lower(), it[3])
        if k in seen: continue
        seen.add(k); ded.append(it)
    out[m]=ded

print(f"Brands: {len(out)} | entries: {sum(len(v) for v in out.values())}", file=sys.stderr)
json.dump(out, sys.stdout, ensure_ascii=False)
