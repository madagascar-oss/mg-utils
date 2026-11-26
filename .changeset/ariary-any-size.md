---
'@madagascar-oss/ariary': minor
'@madagascar-oss/utils': minor
---

Implement spec 0.5.0 for Ariary amounts: no more 999 999 999 999 cap. Amounts go up to `Number.MAX_SAFE_INTEGER`, so `formatAriary(1_000_000_000_000)` → `Ar 1 000 000 000 000`, `parseAriary` reads it back, and `ariaryToWords(1_000_000_000_000)` → `arivo lavitrisa ariary`. `ariaryToFmg` throws `OUT_OF_RANGE` only when the francs would exceed `Number.MAX_SAFE_INTEGER`.
