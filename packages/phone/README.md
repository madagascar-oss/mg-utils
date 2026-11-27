# @mdgascar/phone

Parse, validate and format Madagascar (+261) mobile phone numbers. Zero dependencies,
ESM + CommonJS + types.

Implements spec 0.7.0.

```sh
npm install @mdgascar/phone
```

```ts
import {
  OPERATOR_NAMES,
  formatPhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
  safeParsePhoneNumber,
  tryParsePhoneNumber,
} from '@mdgascar/phone';

parsePhoneNumber('034 12 345 67');
// { e164: '+261341234567', nationalNumber: '341234567', operator: 'yas' }

formatPhoneNumber('+261341234567', 'national'); // '034 12 345 67'
isValidPhoneNumber('031 12 345 67'); // false
tryParsePhoneNumber('031 12 345 67'); // undefined (never throws)

const result = safeParsePhoneNumber(userInput);
if (!result.success) console.log(result.error.code); // 'INVALID_FORMAT' | 'UNKNOWN_OPERATOR' | …

OPERATOR_NAMES.yas; // 'Yas Madagascar'
```

Rules, operator prefixes and sources: [spec/phone](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/phone/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/phone/](https://mdgascar.github.io/mdg-utils-docs/docs/phone/).
