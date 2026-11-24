---
'@madagascar-oss/phone': minor
'@madagascar-oss/ariary': minor
'@madagascar-oss/utils': minor
---

Add `tryParsePhoneNumber` and `tryParseAriary`: they return the parsed value, or `undefined` instead of throwing, like `PhoneNumber::tryParse()` and `Ariary::tryParse()` in mg-utils-php. Use the `safeParse` functions when you need the error code.
