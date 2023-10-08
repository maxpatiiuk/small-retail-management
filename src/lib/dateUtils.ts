import { UtcDate } from './UtcDate';
import { f } from './functools';

// These dates are coming from user, or shown to user, thus use local time zone
export const dateUtils = {
  date: {
    format: (date: UtcDate): string =>
      [
        date.year,
        date.month.toString().padStart(2, '0'),
        date.day.toString().padStart(2, '0'),
      ].join('-'),
    parse(rawDate: string): UtcDate | undefined {
      const [year, month, day] = rawDate.split('-').map(f.parseInt);
      return year !== undefined &&
        month !== undefined &&
        day !== undefined &&
        year > 2000 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
        ? UtcDate.fromDate(year, month, day)
        : undefined;
    },
  },
  week: {
    format: (date: UtcDate): string =>
      [date.year, date.week.toString().padStart(2, '0')].join('-W'),
    parse(weekString: string): UtcDate | undefined {
      const [year, week] = weekString.split('-W').map(f.parseInt);
      if (year === undefined || week === undefined || week < 1 || week > 53)
        return undefined;
      const date = UtcDate.fromNow();
      date.year = year;
      date.week = week;
      return date;
    },
  },
  month: {
    format: (date: UtcDate): string =>
      [date.year, date.month.toString().padStart(2, '0')].join('-'),
    parse(monthString: string): UtcDate | undefined {
      const [year, month] = monthString.split('-').map(f.parseInt);
      if (year === undefined || month === undefined) return undefined;
      const date = UtcDate.fromNow();
      date.year = year;
      date.month = month;
      // Happens if current month has more days than parsed month
      if (date.month + 1 === month) {
        // Set to last day of previous month
        date.day = 0;
      }
      return date;
    },
  },
  year: {
    format: (date: UtcDate): string => date.year.toString(),
    parse(yearString: string): UtcDate | undefined {
      const year = f.parseInt(yearString);
      if (year === undefined) return undefined;
      const date = UtcDate.fromNow();
      date.year = year;
      return date;
    },
  },
} as const;
