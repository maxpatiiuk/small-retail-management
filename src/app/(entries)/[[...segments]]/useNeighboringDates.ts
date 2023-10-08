import React from 'react';
import { View } from './useSegments';
import { UtcDate } from '../../../lib/UtcDate';

export function useNeighboringDates(
  view: View,
  date: UtcDate,
): { readonly previousDate: UtcDate; readonly nextDate: UtcDate } {
  return {
    previousDate: React.useMemo(
      () => getNeighboringDate(view, date, -1),
      [view, date],
    ),
    nextDate: React.useMemo(
      () => getNeighboringDate(view, date, 1),
      [view, date],
    ),
  };
}

function getNeighboringDate(
  view: View,
  date: UtcDate,
  direction: -1 | 1,
): UtcDate {
  const newDate = date.clone();
  if (view === 'day') newDate.day += direction;
  else if (view === 'week') newDate.day += 7 * direction;
  else if (view === 'month') newDate.month += direction;
  else if (view === 'year') newDate.year += direction;
  return newDate;
}
