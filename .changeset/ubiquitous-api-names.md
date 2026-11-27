---
'@mdgascar/words': minor
'@mdgascar/ariary': minor
'@mdgascar/utils': minor
'@mdgascar/phone': minor
'@mdgascar/date': minor
---

**Breaking:** the public API now uses the domain's words (spec 0.8.0). Rename your calls:

| Was                                                               | Now                                             |
| ----------------------------------------------------------------- | ----------------------------------------------- |
| `numberToWords`                                                   | `spell`                                         |
| `ariaryToWords`                                                   | `spellAriary`                                   |
| `parsePhoneNumber`, `safeParsePhoneNumber`, `tryParsePhoneNumber` | `parsePhone`, `safeParsePhone`, `tryParsePhone` |
| `isValidPhoneNumber`, `formatPhoneNumber`                         | `isValidPhone`, `formatPhone`                   |
| `getMonthName`, `getWeekdayName`                                  | `monthName`, `weekdayName`                      |

The options type `NumberToWordsOptions` is now `SpellOptions`. Behaviour is unchanged; the other types keep their names (`PhoneNumber`, `NumberSystem`, …).
