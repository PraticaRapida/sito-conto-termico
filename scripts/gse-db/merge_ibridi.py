#!/usr/bin/env python3
import json
cur = json.load(open('/tmp/CT3_DB_IBRIDI.json'))
new = json.load(open('/tmp/iiib.json'))

merged = {b: list(v) for b,v in cur.items()}
added_brands=[]; added_models={}; updated={}
def norm(s): return (s or '').strip().lower()

for brand, items in new.items():
    bu = brand.strip().upper()
    if bu not in merged:
        merged[bu] = items
        added_brands.append(bu); continue
    idx = {norm(e[0]): i for i,e in enumerate(merged[bu])}
    for it in items:
        k = norm(it[0])
        if k in idx:
            old = merged[bu][idx[k]]
            changed=False
            for p in (1,2):
                if it[p] is not None and (old[p] is None or abs((old[p] or 0)-it[p])>0.05):
                    old[p]=it[p]; changed=True
            if changed: updated[bu]=updated.get(bu,0)+1
        else:
            merged[bu].append(it)
            added_models.setdefault(bu,[]).append(it[0])

print(f"Added brands: {len(added_brands)} {added_brands}")
print(f"New models in existing brands: {sum(len(v) for v in added_models.values())}")
for b,m in added_models.items(): print(f"  {b}: +{len(m)} e.g. {m[:2]}")
print(f"Updated entries: {sum(updated.values())}")
print(f"Final: {len(merged)} brands, {sum(len(v) for v in merged.values())} models")
json.dump(merged, open('/tmp/CT3_DB_IBRIDI_merged.json','w'), ensure_ascii=False)
