---
'@mdgascar/words': minor
'@mdgascar/ariary': minor
'@mdgascar/utils': minor
'@mdgascar/phone': minor
'@mdgascar/date': minor
---

Implement spec 0.7.0: `numberToWords(value, { system: 'traditional' })` and
`ariaryToWords(amount, { system: 'traditional' })` name every power of ten
(`30 000 000` → `telo safatsiroa`). The standard system stays the default and its output is
unchanged. New types `NumberSystem` and `NumberToWordsOptions`.
