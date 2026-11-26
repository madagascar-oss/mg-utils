---
'@madagascar-oss/ariary': minor
'@madagascar-oss/utils': minor
---

Implement spec 0.5.0 for Ariary amounts.

- No more 999 999 999 999 cap: amounts go up to `Number.MAX_SAFE_INTEGER`, so `ariaryToWords(1_000_000_000_000)` → `arivo lavitrisa ariary`.
- Decimal amounts, after a comma: `formatAriary(1500.5)` → `Ar 1 500,5`, `parseAriary('1 500,50 Ar')` → `1500.5`, `ariaryToWords(1500.5)` → `dimanjato sy arivo faingo dimy ariary`.
- **Behaviour change:** `parseAriary('1,500')` now returns `1.5` instead of throwing `INVALID_FORMAT`. For English-style text pass `{ grouping: 'comma', decimal: 'dot' }`.
- New `grouping: 'comma'` and `decimal: 'comma' | 'dot'` options for formatting and for the three parsers. The defaults stay Malagasy.
- FMG conversion is exact decimal arithmetic and accepts any francs: `fmgToAriary(7501)` → `1500.2`, `ariaryToFmg(0.07)` → `0.35`.
