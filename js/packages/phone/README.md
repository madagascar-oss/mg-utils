# @madagascar-oss/phone

Parse, validate and format Madagascar (+261) mobile phone numbers. Zero dependencies,
ESM + CommonJS + types.

Implements spec 0.1.0.

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
} from '@madagascar-oss/phone';

parsePhoneNumber('034 12 345 67');
// { e164: '+261341234567', nationalNumber: '341234567', operator: 'telma' }

formatPhoneNumber('+261341234567', 'national'); // '034 12 345 67'
isValidPhoneNumber('035 12 345 67'); // false

const result = safeParsePhoneNumber(userInput);
if (!result.success) console.log(result.error.code); // 'INVALID_FORMAT' | 'UNKNOWN_OPERATOR' | …

OPERATOR_NAMES.telma; // 'Telma'
```

Rules, operator prefixes and sources: [spec/phone](https://github.com/madagascar-oss/mg-utils-spec/blob/dev/phone/README.md).
