import { getLanguage } from '../../lib/localization';
import { RA } from '../../lib/types';

// Localized month names
export const months = getMonthNames('long');

function getMonthNames(format: 'long' | 'short'): RA<string> {
  const months = new Intl.DateTimeFormat(getLanguage(), { month: format });
  return Array.from({ length: 12 }, (_, month) =>
    months.format(new Date(0, month, 2, 0, 0, 0)),
  );
}

// Localized week day names
export const weekDays = getWeekDays('long');

function getWeekDays(format: 'long' | 'short'): RA<string> {
  const weekDays = new Intl.DateTimeFormat(getLanguage(), { month: format });
  return Array.from({ length: 7 }, (_, weekDay) =>
    weekDays.format(new Date(2017, 0, 2 + weekDay, 0, 0, 0)),
  );
}
