import { f } from '../../lib/functools';
import { currencies, getLanguage } from '../../lib/localization';
import { RA } from '../../lib/types';
import { DAY, MONTH, WEEK, YEAR } from './timeUnits';

// Localized month names
export const months = getMonthNames('long');

function getMonthNames(format: 'long' | 'short'): RA<string> {
  const months = new Intl.DateTimeFormat(getLanguage(), { month: format });
  return f.between(0, YEAR / MONTH, (month) =>
    months.format(new Date(0, month, 2, 0, 0, 0)),
  );
}

// Localized week day names
export const weekDays = getWeekDays('long');

function getWeekDays(format: 'long' | 'short'): RA<string> {
  const weekDays = new Intl.DateTimeFormat(getLanguage(), { weekday: format });
  return f.between(1, WEEK / DAY + 1, (weekDay) =>
    weekDays.format(new Date(2017, 0, weekDay, 0, 0, 0)),
  );
}

const locale = new Intl.Locale(getLanguage());

/* This is an incomplete definition. For complete, see MDN Docs */
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  class Locale {
    public constructor(locales?: RA<string> | string);

    public weekInfo: {
      readonly firstDay: 1 | 7;
    };
  }

  class DateTimeFormat {
    public constructor(
      locales?: RA<string> | string,
      options?: {
        readonly dateStyle?: 'full' | 'long' | 'medium' | 'short';
        readonly timeStyle?: 'full' | 'long' | 'medium' | 'short';
        readonly month?: 'long' | 'short';
        readonly weekday?: 'long' | 'short';
      },
    );

    public format(value: Readonly<Date>): string;
  }

  class NumberFormat {
    public constructor(
      locales?: RA<string> | string,
      options?: {
        readonly style: 'currency';
        readonly currency: string;
        readonly currencyDisplay: 'narrowSymbol';
        readonly roundingMode: 'halfEven';
        readonly trailingZeroDisplay: 'stripIfInteger';
      },
    );

    public format(value: number): string;
  }
}

export function getFirstDayOfWeek(originalDate: Date): Date {
  const date = new Date(originalDate);
  const day = date.getDay();
  const difference =
    date.getDate() - day + (locale.weekInfo.firstDay ? 0 : day == 0 ? -6 : 1);
  return new Date(date.setDate(difference));
}

const numberFormatter = new Intl.NumberFormat(getLanguage(), {
  style: 'currency',
  currency: currencies[getLanguage()],
  currencyDisplay: 'narrowSymbol',
  roundingMode: 'halfEven',
  trailingZeroDisplay: 'stripIfInteger',
});
export const formatCurrency = (number: number): string =>
  numberFormatter.format(number);
