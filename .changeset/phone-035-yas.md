---
'@mdgascar/phone': minor
'@mdgascar/utils': minor
---

Spec 0.6.0. **Breaking**: Telma is now Yas Madagascar, so the operator id `telma` is now `yas` (`OPERATOR_NAMES.yas` is `'Yas Madagascar'`). New prefix 035 for Airtel Madagascar (on sale since 22 June 2026): `parsePhoneNumber('035 12 345 67').operator` is `'airtel'`.
