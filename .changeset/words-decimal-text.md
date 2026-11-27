---
'@mdgascar/words': minor
'@mdgascar/ariary': minor
'@mdgascar/utils': minor
'@mdgascar/phone': minor
'@mdgascar/date': minor
---

Implement spec 0.8.0: `spell` and `spellAriary` also take plain decimal text, read
exactly with no floating-point rounding: `spell('2000000000000000.9')` →
`roa tapitrisa lavitrisa faingo sivy`. Text that is not plain decimal throws `INVALID_FORMAT`.
In the traditional system, a number of 10¹⁹ or more (text only) is written in the standard
system.
