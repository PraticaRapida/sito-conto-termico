#!/usr/bin/env python3
"""Parse III.D PDF (solar thermal collectors GSE catalogue) -> JSON.

Columns observed (page header):
  Tipologia intervento | Tipologia di collettori | Utilizzo | N | Marca | Modello |
  Area AG [m2] | Area Aa [m2] | Energia Qcol (50°C) | Energia Qcol (75°C) | Energia Qsol (50°C) | (more cols off-screen)
"""
import pdfplumber, json, re, sys

PDF = '/tmp/III.D.pdf'
out = {}  # MARCA -> list of [modello, area_ag, area_aa, qcol_50, tipo_coll, utilizzo]

def num(v):
    if v is None: return None
    s = str(v).strip().replace(',', '.')
    if s in ('', '-', 'None'): return None
    try: return float(s)
    except: return None

with pdfplumber.open(PDF) as pdf:
    for pg in pdf.pages:
        # Try to find tables
        tables = pg.extract_tables()
        for t in tables:
            for row in t:
                if not row or len(row) < 7: continue
                cells = [c.strip() if c else '' for c in row]
                tipo_int = cells[0]
                if not tipo_int.startswith('III.D'): continue
                tipo_coll = cells[1]
                utilizzo = cells[2]
                # cells[3] = N
                marca = cells[4].upper()
                modello = cells[5]
                area_ag = num(cells[6])
                area_aa = num(cells[7]) if len(cells) > 7 else None
                qcol50 = num(cells[8]) if len(cells) > 8 else None
                if not marca or not modello: continue
                entry = [modello, area_ag, area_aa, qcol50, tipo_coll, utilizzo]
                out.setdefault(marca, []).append(entry)

# Dedupe within each brand (same modello+utilizzo+tipo_coll)
for marca, items in out.items():
    seen = set()
    deduped = []
    for it in items:
        k = (it[0], it[4], it[5])
        if k in seen: continue
        seen.add(k); deduped.append(it)
    out[marca] = deduped

print(f"Brands: {len(out)}", file=sys.stderr)
print(f"Total entries: {sum(len(v) for v in out.values())}", file=sys.stderr)
print(json.dumps(out, ensure_ascii=False))
