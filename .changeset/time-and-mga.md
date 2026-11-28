---
'@mdgascar/words': minor
'@mdgascar/phone': minor
'@mdgascar/ariary': minor
'@mdgascar/date': minor
'@mdgascar/utils': minor
---

Spec 0.10.0.

- **date**: `spellTime` says the time of day in Malagasy: `spellTime('14:30')` →
  `amin'ny roa sy sasany tolakandro`, `spellTime('17:45')` → `amin'ny enina latsaka fahefany hariva`.
  `parseTime` / `safeParseTime` / `tryParseTime` read it back.
- **ariary**: `currencyDisplay: 'code'` writes the ISO code: `formatAriary(1500, { currencyDisplay: 'code' })`
  → `MGA 1 500` (`MGF` for old francs).
