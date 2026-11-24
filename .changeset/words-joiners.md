---
'@madagascar-oss/words': minor
'@madagascar-oss/ariary': minor
'@madagascar-oss/utils': minor
---

Implement spec 0.3.0 for number words (output changes):

- 200–900 join the smaller part with `sy` at every size: `205` → `dimy sy roanjato`, `348` → `valo amby efapolo sy telonjato`, `2 586` → `enina amby valopolo sy dimanjato sy roa arivo`. Exactly 100 keeps `amby` (`105` → `dimy amby zato`).
- A 1 before `sy` stays `iray`: `201` → `iray sy roanjato`.
- 11–19 are spelled `ambin'ny` (was `ambin' ny`): `11` → `iraika ambin'ny folo`.

`ariaryToWords` follows the same rules.
