# @mdgascar/phone

Parse, validate and format Madagascar (+261) phone numbers, mobile and fixed. Zero dependencies,
ESM + CommonJS + types.

Implements spec 0.9.0.

```sh
npm install @mdgascar/phone
```

```ts
import {
  OPERATOR_NAMES,
  formatPhone,
  isValidPhone,
  parsePhone,
  safeParsePhone,
  tryParsePhone,
} from '@mdgascar/phone';

parsePhone('034 12 345 67');
// { e164: '+261341234567', nationalNumber: '341234567', operator: 'yas', type: 'mobile', area: null }
parsePhone('020 22 421 19').area; // { name: 'Antananarivo', province: 'Antananarivo' }

formatPhone('+261341234567', 'national'); // '034 12 345 67'
isValidPhone('031 12 345 67'); // false
tryParsePhone('031 12 345 67'); // undefined (never throws)

const result = safeParsePhone(userInput);
if (!result.success) console.log(result.error.code); // 'INVALID_FORMAT' | 'UNKNOWN_OPERATOR' | …

OPERATOR_NAMES.yas; // 'Yas Madagascar'
```

Rules, operator prefixes and sources: [spec/phone](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/phone/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/phone/](https://mdgascar.github.io/mdg-utils-docs/docs/phone/).
