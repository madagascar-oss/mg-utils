# @mdgascar/date

Malagasy dates: `Alatsinainy 23 Novambra 2026`, month and weekday names, from Unicode CLDR.
Zero dependencies, ESM + CommonJS + types.

Implements spec 0.8.0.

```sh
npm install @mdgascar/date
```

```ts
import { formatDate, getMonthName, getWeekdayName } from '@mdgascar/date';

formatDate('2026-11-23'); // '23 Novambra 2026'
formatDate('2026-11-23', 'full'); // 'Alatsinainy 23 Novambra 2026'
formatDate('2026-11-23', 'short'); // '2026-11-23' (CLDR)
formatDate('2026-11-23', 'numeric'); // '23/11/2026'
formatDate({ year: 1960, month: 6, day: 26 }, 'full'); // 'Alahady 26 Jona 1960'

getMonthName(6); // 'Jona'
getWeekdayName(1); // 'Alatsinainy' (ISO 8601: Monday is 1)
```

Rules, sources and recorded decisions: [spec/date](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/date/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/date/](https://mdgascar.github.io/mdg-utils-docs/docs/date/).
