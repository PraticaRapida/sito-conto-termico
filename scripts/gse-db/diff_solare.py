#!/usr/bin/env python3
"""Diff III.D extracted vs current CT3_DB_SOLARE and produce merged DB."""
import json

cur = json.load(open('/tmp/CT3_DB_SOLARE.json'))
new = json.load(open('/tmp/iiid.json'))

# Normalize: uppercase brand, strip; key by (modello, tipo_coll, utilizzo)
def norm(s):
    return (s or '').strip().lower()

def key(entry):
    return (norm(entry[0]), norm(entry[4]), norm(entry[5]))

added_brands = []
new_models_in_existing = {}  # brand -> [models]
diff_models = {}  # brand -> [(model, old, new)]
identical = 0

merged = {b: list(v) for b,v in cur.items()}

for brand, entries in new.items():
    bup = brand.strip().upper()
    if bup not in merged:
        merged[bup] = entries
        added_brands.append(bup)
        continue
    existing = {key(e): i for i,e in enumerate(merged[bup])}
    for e in entries:
        k = key(e)
        if k not in existing:
            merged[bup].append(e)
            new_models_in_existing.setdefault(bup, []).append(e[0])
        else:
            old = merged[bup][existing[k]]
            # Compare numeric fields (1..3)
            changed = False
            for idx in (1,2,3):
                a,b = old[idx], e[idx]
                if a is None and b is None: continue
                if a is None or b is None or abs((a or 0)-(b or 0))>0.05:
                    changed = True; break
            if changed:
                diff_models.setdefault(bup, []).append((e[0], old, e))
                merged[bup][existing[k]] = e  # prefer new from GSE
            else:
                identical += 1

print(f"== DIFF CT3_DB_SOLARE vs III.D ==")
print(f"Current: {sum(len(v) for v in cur.values())} models in {len(cur)} brands")
print(f"New PDF: {sum(len(v) for v in new.values())} models in {len(new)} brands")
print(f"Merged:  {sum(len(v) for v in merged.values())} models in {len(merged)} brands")
print(f"Identical entries: {identical}")
print(f"New brands added: {len(added_brands)} -> {added_brands}")
print(f"\nNew models added to existing brands:")
for b, ms in new_models_in_existing.items():
    print(f"  {b}: +{len(ms)}  e.g. {ms[:3]}")
print(f"\nModified entries:")
for b, lst in diff_models.items():
    print(f"  {b}: {len(lst)} modified, e.g. {lst[0]}")

json.dump(merged, open('/tmp/CT3_DB_SOLARE_merged.json','w'), ensure_ascii=False)
