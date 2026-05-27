#!/usr/bin/env python3
"""Merge III.E PDF data into CT3_DB_SCALDA.
Current format: [modello, pot_kw, cop, capacita]
PDF gives: [modello, pot_kw, capacita, tipologia, classe] (no COP)
Strategy:
  - if modello exists in cur: update pot_kw & capacita with PDF values, keep COP
  - if new: append [modello, pot_kw, null, capacita]
"""
import json
cur = json.load(open('/tmp/CT3_DB_SCALDA.json'))
new = json.load(open('/tmp/iiie.json'))

merged = {b: list(v) for b,v in cur.items()}
added_brands=[]; added_models={}; updated={}

def norm(s): return (s or '').strip().lower()

for brand, items in new.items():
    bu = brand.strip().upper()
    if bu not in merged:
        merged[bu] = [[it[0], it[1], None, it[2]] for it in items]
        added_brands.append(bu); continue
    idx = {norm(e[0]): i for i,e in enumerate(merged[bu])}
    for it in items:
        modello, pot, cap, tip, cls = it
        k = norm(modello)
        if k in idx:
            old = merged[bu][idx[k]]
            changed = False
            if pot is not None and (old[1] is None or abs((old[1] or 0)-pot)>0.05):
                old[1] = pot; changed=True
            if cap is not None and (old[3] is None or abs((old[3] or 0)-cap)>0.5):
                old[3] = cap; changed=True
            if changed: updated.setdefault(bu,0); updated[bu]+=1
        else:
            merged[bu].append([modello, pot, None, cap])
            added_models.setdefault(bu, []).append(modello)

print(f"Added brands: {len(added_brands)} {added_brands}")
print(f"Brands with new models: {len(added_models)}")
for b,m in added_models.items(): print(f"  {b}: +{len(m)} e.g. {m[:3]}")
print(f"Brands with updates: {len(updated)}")
for b,n in updated.items(): print(f"  {b}: {n} updated")
print(f"Final: {len(merged)} brands, {sum(len(v) for v in merged.values())} models")
json.dump(merged, open('/tmp/CT3_DB_SCALDA_merged.json','w'), ensure_ascii=False)
