#!/usr/bin/env python3
"""Merge III.A into CT3_DB_EL and CT3_DB_GAS. Preserve existing 'inverter' flag."""
import json
parsed = json.load(open('/tmp/iiia.json'))
cur_el = json.load(open('/tmp/CT3_DB_EL.json'))
cur_gas = json.load(open('/tmp/CT3_DB_GAS.json'))

def norm(s): return (s or '').strip().lower()

def do_merge(new, cur, name):
    merged = {b: list(v) for b,v in cur.items()}
    add_brands=[]; add_models={}; upd_count=0
    for brand, items in new.items():
        bu = brand.strip().upper()
        if bu not in merged:
            # Default inverter=False when unknown
            merged[bu] = [[it[0], it[1], it[2], it[3], False] for it in items]
            add_brands.append(bu); continue
        idx = {norm(e[0]): i for i,e in enumerate(merged[bu])}
        for it in items:
            k = norm(it[0])
            if k in idx:
                old = merged[bu][idx[k]]
                changed=False
                # Update pot, cop, scambio; keep inverter
                if it[1] is not None and (old[1] is None or abs((old[1] or 0)-it[1])>0.05):
                    old[1]=it[1]; changed=True
                if it[2] is not None and (old[2] is None or abs((old[2] or 0)-it[2])>0.02):
                    old[2]=it[2]; changed=True
                if it[3] and it[3] != old[3] and old[3] in (None,'','-'):
                    old[3]=it[3]; changed=True
                if changed: upd_count+=1
            else:
                # New model - default inverter=False
                merged[bu].append([it[0], it[1], it[2], it[3], False])
                add_models.setdefault(bu, []).append(it[0])
    print(f"== {name} ==")
    print(f"Added brands: {len(add_brands)}")
    print(f"New models: {sum(len(v) for v in add_models.values())} across {len(add_models)} brands")
    print(f"Updated entries: {upd_count}")
    print(f"Final: {len(merged)} brands, {sum(len(v) for v in merged.values())} models")
    return merged

m_el = do_merge(parsed['el'], cur_el, 'CT3_DB_EL')
m_gas = do_merge(parsed['gas'], cur_gas, 'CT3_DB_GAS')

json.dump(m_el, open('/tmp/CT3_DB_EL_merged.json','w'), ensure_ascii=False)
json.dump(m_gas, open('/tmp/CT3_DB_GAS_merged.json','w'), ensure_ascii=False)
