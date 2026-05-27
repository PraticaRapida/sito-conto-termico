# GSE Database Update Pipeline

Script per estrarre i cataloghi PDF GSE (Conto Termico 3.0) e fonderli nei database del calcolatore (`public/calcolatore.html`).

## Cosa contiene il calcolatore

`public/calcolatore.html` espone 6 database JS:

| Categoria GSE | Variabile JS | Formato entry |
|---|---|---|
| III.A — PdC elettriche | `CT3_DB_EL` | `[modello, pot_kw, cop, scambio, inverter]` |
| III.A — PdC a gas | `CT3_DB_GAS` | `[modello, pot_kw, cop, scambio, inverter]` |
| III.B — Ibridi | `CT3_DB_IBRIDI` | `[modello, pot_kw, cop]` |
| III.C — Biomassa | `CT3_DB_BIOMASSA` | `[modello, pot_kw, tipo_gen, alim, rendimento, emissioni, classe]` |
| III.D — Solare termico | `CT3_DB_SOLARE` | `[modello, area_ag, area_aa, qcol_50, tipo_coll, utilizzo]` |
| III.E — Scaldacqua PdC | `CT3_DB_SCALDA` | `[modello, pot_kw, cop, capacita_litri]` |

## Prerequisiti

```bash
pip3 install pdfplumber
```

## Workflow di aggiornamento

Quando GSE pubblica un nuovo catalogo (PDF):

1. **Scarica i 5 PDF** (uno per categoria) e mettili in `/tmp/` con i nomi `III.A.pdf`, `III.B.pdf`, `III.C.pdf`, `III.D.pdf`, `III.E.pdf` (o aggiorna i path nei parser).

2. **Estrai i DB attuali** dal calcolatore in JSON:
   ```bash
   python3 extract_dbs.py
   # → /tmp/CT3_DB_{EL,GAS,SOLARE,SCALDA,IBRIDI}.json
   ```

3. **Esegui i parser PDF** per generare i JSON aggiornati:
   ```bash
   python3 parse_iiia.py > /tmp/iiia.json    # ~5 min (227 pagine)
   python3 parse_iiib.py > /tmp/iiib.json    # ~3 min (152 pagine)
   python3 parse_iiic.py > /tmp/iiic.json
   python3 parse_iiid.py > /tmp/iiid.json
   python3 parse_iiie.py > /tmp/iiie.json
   ```

4. **Esegui i merge** (uniscono parsed + current, mantenendo COP esistenti dove i PDF non li forniscono):
   ```bash
   python3 merge_pdc.py     # III.A → CT3_DB_EL + CT3_DB_GAS
   python3 merge_ibridi.py  # III.B → CT3_DB_IBRIDI
   python3 merge_scalda.py  # III.E → CT3_DB_SCALDA
   python3 diff_solare.py   # III.D → CT3_DB_SOLARE
   ```

5. **Applica i merge** a `calcolatore.html`:
   ```bash
   python3 apply_db.py CT3_DB_EL     /tmp/CT3_DB_EL_merged.json
   python3 apply_db.py CT3_DB_GAS    /tmp/CT3_DB_GAS_merged.json
   python3 apply_db.py CT3_DB_SOLARE /tmp/CT3_DB_SOLARE_merged.json
   python3 apply_db.py CT3_DB_SCALDA /tmp/CT3_DB_SCALDA_merged.json
   python3 apply_db.py CT3_DB_IBRIDI /tmp/CT3_DB_IBRIDI_merged.json
   python3 add_biomassa_db.py        # III.C → CT3_DB_BIOMASSA
   ```

6. **Verifica nel browser** (`npm run dev`) → apri `/preventivo`, prova i selettori marca/modello per i tipi 1, 3, 4, 5, 6, 7, 8.

## Note sulla strategia di merge

- I PDF GSE sono **autoritativi** per: potenza, area, Qcol, capacità, rendimento.
- I PDF GSE **non forniscono COP**, quindi i COP esistenti vengono **preservati** (per le entries già nel DB) o lasciati `null` (per le nuove).
- Il campo `inverter` non è nei PDF; preservato dal DB esistente, default `false` per le nuove entries.
- La de-duplicazione usa `(modello)` normalizzato lowercase come chiave (per Solare e Biomassa anche `tipo_coll`/`alimentazione`).

## File

- `parse_iii{a,b,c,d,e}.py` — parser PDF per categoria
- `extract_dbs.py` — estrae i DB JS in JSON
- `merge_*.py` / `diff_solare.py` — logica di merge
- `apply_db.py NOME_DB file.json` — sostituisce un DB nel file HTML
- `add_biomassa_db.py` — inserisce/aggiorna `CT3_DB_BIOMASSA` (caso speciale: DB non preesistente)
