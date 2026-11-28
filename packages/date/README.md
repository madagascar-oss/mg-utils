# @mdgascar/date

Malagasy dates and times: write `23 Novambra 2026` and read it back, say the time
(`amin'ny roa sy sasany tolakandro`), month and weekday names.
Zero dependencies, ESM + CommonJS + types.

Implements spec 0.10.0.

```sh
npm install @mdgascar/date
```

```ts
import {
  formatDate,
  monthName,
  parseDate,
  parseTime,
  spellTime,
  weekdayName,
} from '@mdgascar/date';

formatDate('2026-11-23'); // '23 Novambra 2026'
formatDate('2026-11-23', 'full'); // 'Alatsinainy 23 Novambra 2026'
formatDate('2026-11-23', 'short'); // '2026-11-23' (CLDR)
formatDate('2026-11-23', 'numeric'); // '23/11/2026'
formatDate({ year: 1960, month: 6, day: 26 }, 'full'); // 'Alahady 26 Jona 1960'

parseDate('23 Novambra 2026'); // { year: 2026, month: 11, day: 23 }
parseDate('23/11/2026'); // { year: 2026, month: 11, day: 23 }

spellTime('14:30'); // "amin'ny roa sy sasany tolakandro"
spellTime('07:15'); // "amin'ny fito sy fahefany maraina"
parseTime("amin'ny roa sy sasany tolakandro"); // { hour: 14, minute: 30 }

monthName(6); // 'Jona'
weekdayName(1); // 'Alatsinainy' (ISO 8601: Monday is 1)
```

Rules, sources and recorded decisions: [spec/date](https://github.com/mdgascar/mdg-utils-spec/blob/dev/modules/date/README.md).

Docs, API reference and a live playground: [mdgascar.github.io/mdg-utils-docs/docs/date/](https://mdgascar.github.io/mdg-utils-docs/docs/date/).
