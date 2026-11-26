---
'@madagascar-oss/words': minor
'@madagascar-oss/ariary': minor
'@madagascar-oss/utils': minor
---

Implement spec 0.5.0 for number words. `numberToWords` now spells any number up to `Number.MAX_SAFE_INTEGER`: `lavitrisa` takes any count, so `10¹²` → `arivo lavitrisa` and `1 999 999 999 999` → `… sy sivy amby sivifolo sy sivinjato sy arivo lavitrisa`. It also reads decimals with `faingo`: `3.14` → `telo faingo efatra ambin'ny folo`, `0.008` → `aotra faingo aotra aotra valo`. Numbers above 999 999 999 999 and decimals no longer throw.
