#!/usr/bin/env python3
"""Parse III.A (PdC elettriche e a gas) PDF.
Columns: Tipologia | Tipologia funzionamento | Tipologia scambio | Denom Comm | Marca | Modello |
         ID est | ID int | Potenza [kW] | Eta_s | SCOP/SPER/COP | NOx
Splits into electric (PdC elettrica) and gas (PdC a gas).
Target DB format: [modello, pot_kw, cop, scambio, inverter] -- inverter not in PDF (set null)
"""
import pdfplumber, json, sys

PDF = '/tmp/III.A (1).pdf'
electric = {}
gas = {}

def num(v):
    if v is None: return None
    s = str(v).strip().replace(',', '.')
    if s in ('','-','n.d.','N/A'): return None
    try: return float(s)
    except: return None

with pdfplumber.open(PDF) as pdf:
    n = len(pdf.pages)
    for i, pg in enumerate(pdf.pages):
        if i % 20 == 0: print(f"  page {i+1}/{n}", file=sys.stderr)
        for t in pg.extract_tables():
            for row in t:
                if not row or len(row) < 11: continue
                cells = [(c or '').strip() for c in row]
                if not cells[0].startswith('III.A'): continue
                funz = cells[1].lower()
                scambio = cells[2]
                marca = cells[4].upper().strip()
                modello = cells[5].strip()
                pot = num(cells[8])
                cop = num(cells[10])
                if not marca or not modello: continue
                entry = [modello, pot, cop, scambio, None]
                if 'gas' in funz:
                    gas.setdefault(marca, []).append(entry)
                else:
                    electric.setdefault(marca, []).append(entry)

# Dedupe by modello
def dedupe(d):
    for m,items in d.items():
        seen=set(); ded=[]
        for it in items:
            k = it[0].lower()
            if k in seen: continue
            seen.add(k); ded.append(it)
        d[m]=ded
dedupe(electric); dedupe(gas)

print(f"ELECTRIC: {len(electric)} brands | {sum(len(v) for v in electric.values())} models", file=sys.stderr)
print(f"GAS:      {len(gas)} brands | {sum(len(v) for v in gas.values())} models", file=sys.stderr)
json.dump({'el': electric, 'gas': gas}, sys.stdout, ensure_ascii=False)
