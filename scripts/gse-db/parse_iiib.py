#!/usr/bin/env python3
"""Parse III.B (ibridi) PDF.
Columns: Tipologia | Marca | Modello PdC | ID esterna | ID interna | Alim PdC | Scambio |
         Pot PdC kW | Efficienza eta_s | SCOP/SPER/COP | NOx | Tipologia caldaia |
         Modello caldaia | Pot Caldaia | Rendimento caldaia
Target DB: [modello_pdc, pot_kw, cop]  (current format)
"""
import pdfplumber, json, sys

PDF = '/tmp/III.B.pdf'
out = {}

def num(v):
    if v is None: return None
    s = str(v).strip().replace(',', '.')
    if s in ('','-','n.d.','N/A'): return None
    try: return float(s)
    except: return None

with pdfplumber.open(PDF) as pdf:
    for i, pg in enumerate(pdf.pages):
        for t in pg.extract_tables():
            for row in t:
                if not row or len(row) < 10: continue
                cells = [(c or '').strip() for c in row]
                if not cells[0].startswith('III.B'): continue
                marca = cells[1].upper().strip()
                modello = cells[2].strip()
                pot = num(cells[7])
                cop = num(cells[9])
                if not marca or not modello: continue
                out.setdefault(marca, []).append([modello, pot, cop])

# Dedupe by modello (keep first)
for m,items in out.items():
    seen=set(); ded=[]
    for it in items:
        k = it[0].lower()
        if k in seen: continue
        seen.add(k); ded.append(it)
    out[m]=ded

print(f"Brands: {len(out)} | entries: {sum(len(v) for v in out.values())}", file=sys.stderr)
json.dump(out, sys.stdout, ensure_ascii=False)
