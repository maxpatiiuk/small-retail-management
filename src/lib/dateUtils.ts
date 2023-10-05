import { f } from './functools';

export const dateUtils = {
  date: {
    format: (date: Date): string =>
      [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0'),
      ].join('-'),
    parse(rawDate: string): Date | undefined {
      const [year, month, day] = rawDate.split('-').map(f.parseInt);
      return year !== undefined &&
        month !== undefined &&
        day !== undefined &&
        year > 2000 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= 31
        ? new Date(year, month - 1, day)
        : undefined;
    },
  },
  week: {
    format: (date: Date): string =>
      [date.getFullYear(), getWeek(date).toString().padStart(2, '0')].join(
        '-W',
      ),
    parse(weekString: string): Date | undefined {
      const [year, week] = weekString.split('-W').map(f.parseInt);
      return year === undefined || week === undefined
        ? undefined
        : getDateFromWeek(year, week);
    },
  },
  month: {
    format: (date: Date): string =>
      [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
      ].join('-'),
    parse(monthString: string): Date | undefined {
      const [year, month] = monthString.split('-').map(f.parseInt);
      return year === undefined || month === undefined
        ? undefined
        : new Date(year, month - 1, 1);
    },
  },
  year: {
    format: (date: Date): string => date.getFullYear().toString(),
    parse(yearString: string): Date | undefined {
      const year = f.parseInt(yearString);
      return year === undefined ? undefined : new Date(year, 0, 1);
    },
  },
} as const;

/** Adapted from https://weeknumber.com/how-to/javascript */
function getWeek(rawDate: Date): number {
  const date = new Date(rawDate);
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
}

/** Adapted from https://stackoverflow.com/a/16591175/8584605 */
function getDateFromWeek(year: number, week: number): Date | undefined {
  if (week < 1 || week > 53) return undefined;

  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const isoWeekStart = simple;

  // Get the Monday past, and add a week if the day was Friday, Saturday or Sunday
  isoWeekStart.setDate(simple.getDate() - dayOfWeek + 1);
  if (dayOfWeek > 4) isoWeekStart.setDate(isoWeekStart.getDate() + 7);

  // The latest possible ISO week starts on December 28 of the current year
  return isoWeekStart.getFullYear() > year ||
    (isoWeekStart.getFullYear() == year &&
      isoWeekStart.getMonth() == 11 &&
      isoWeekStart.getDate() > 28)
    ? undefined
    : isoWeekStart;
}
