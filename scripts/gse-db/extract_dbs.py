#!/usr/bin/env python3
"""Extract the 5 CT3_DB_* dictionaries from calcolatore.html."""
import re, json, sys

src = open('/Users/samueleberetta/Desktop/sito-conto-termico-main/public/calcolatore.html').read()

def extract(name):
    # find `const NAME = {` and balance braces
    m = re.search(r'const\s+' + re.escape(name) + r'\s*=\s*', src)
    if not m: return None
    start = src.find('{', m.end())
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(src)):
        c = src[i]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': in_str = False
            continue
        if c == '"': in_str = True
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                blob = src[start:i+1]
                # convert JS true/false/null -> JSON
                blob_json = re.sub(r'\btrue\b', 'true', blob)
                blob_json = re.sub(r'\bfalse\b', 'false', blob_json)
                blob_json = re.sub(r'\bnull\b', 'null', blob_json)
                return json.loads(blob_json)
    return None

for name in ['CT3_DB_EL','CT3_DB_GAS','CT3_DB_SOLARE','CT3_DB_SCALDA','CT3_DB_IBRIDI']:
    d = extract(name)
    fn = f'/tmp/{name}.json'
    json.dump(d, open(fn,'w'), ensure_ascii=False)
    n = sum(len(v) for v in d.values()) if d else 0
    print(f'{name}: {len(d) if d else 0} brands, {n} models', file=sys.stderr)
