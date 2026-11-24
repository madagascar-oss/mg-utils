# @madagascar-oss/phone

Parse, validate and format Madagascar (+261) mobile phone numbers. Zero dependencies,
ESM + CommonJS + types.

Implements spec 0.3.0.

```sh
npm install @madagascar-oss/phone
```

```ts
import {
  OPERATOR_NAMES,
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
  safeParsePhoneNumber,
  tryParsePhoneNumber,
} from '@madagascar-oss/phone';

parsePhoneNumber('034 12 345 67');
// { e164: '+261341234567', nationalNumber: '341234567', operator: 'telma' }

formatPhoneNumber('+261341234567', 'national'); // '034 12 345 67'
isValidPhoneNumber('035 12 345 67'); // false
tryParsePhoneNumber('035 12 345 67'); // undefined (never throws)

const result = safeParsePhoneNumber(userInput);
if (!result.success) console.log(result.error.code); // 'INVALID_FORMAT' | 'UNKNOWN_OPERATOR' | …

OPERATOR_NAMES.telma; // 'Telma'
```

Rules, operator prefixes and sources: [spec/phone](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/modules/phone/README.md).

Docs, API reference and a live playground: [madagascar-oss.github.io/mg-utils-docs/docs/phone/](https://madagascar-oss.github.io/mg-utils-docs/docs/phone/).
