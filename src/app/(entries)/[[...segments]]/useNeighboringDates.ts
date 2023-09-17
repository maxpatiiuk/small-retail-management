import React from 'react';
import { View } from './useSegments';

export function useNeighboringDates(
  view: View,
  date: Date,
): { readonly previousDate: Date; readonly nextDate: Date } {
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

function getNeighboringDate(view: View, date: Date, direction: -1 | 1): Date {
  const newDate = new Date(date);
  if (view === 'day') newDate.setDate(newDate.getDate() + direction);
  else if (view === 'week') newDate.setDate(newDate.getDate() + 7 * direction);
  else if (view === 'month') newDate.setMonth(newDate.getMonth() + direction);
  else if (view === 'year')
    newDate.setFullYear(newDate.getFullYear() + direction);
  return newDate;
}
