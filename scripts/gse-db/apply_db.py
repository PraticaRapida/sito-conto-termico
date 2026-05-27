#!/usr/bin/env python3
"""Replace a CT3_DB_* dict in calcolatore.html with the merged JSON contents."""
import sys, json, re

HTML = '/Users/samueleberetta/Desktop/sito-conto-termico-main/public/calcolatore.html'
db_name, json_file = sys.argv[1], sys.argv[2]

src = open(HTML).read()
new_dict = json.load(open(json_file))

# Find boundaries of the existing const NAME = {...};
m = re.search(r'const\s+' + re.escape(db_name) + r'\s*=\s*', src)
if not m: sys.exit(f'not found: {db_name}')
start_brace = src.find('{', m.end())
depth=0; in_str=False; esc=False
end=None
for i in range(start_brace,len(src)):
    c=src[i]
    if in_str:
        if esc: esc=False
        elif c=='\\': esc=True
        elif c=='"': in_str=False
        continue
    if c=='"': in_str=True
    elif c=='{': depth+=1
    elif c=='}':
        depth-=1
        if depth==0: end=i+1; break

# Generate JS dict literal (compact JSON works since keys are strings, values arrays of [str,num,num,num,str,str]/etc.)
# Sort by brand for readability
sorted_dict = {k: new_dict[k] for k in sorted(new_dict.keys())}
new_blob = json.dumps(sorted_dict, ensure_ascii=False, separators=(',', ':'))
out = src[:start_brace] + new_blob + src[end:]
open(HTML, 'w').write(out)
print(f'Replaced {db_name}: {len(new_dict)} brands, {sum(len(v) for v in new_dict.values())} models')
