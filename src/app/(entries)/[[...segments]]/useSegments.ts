import { f } from '../../../lib/functools';
import { RA } from '../../../lib/types';
import { dateUtils } from '../../../lib/dateUtils';
import React from 'react';

const views = ['day', 'week', 'month', 'year', 'all'] as const;
export type View = (typeof views)[number];

// FEATURE: default to 'day' view on mobile?
export function useSegments([
  rawDefaultView,
  defaultYear,
  defaultMonth,
  defaultDay,
]: RA<string>): {
  readonly view: View;
  readonly date: Date;
  readonly getUrl: (view: View, date: Date) => string;
} {
  const view = React.useMemo(
    () => (f.includes(views, rawDefaultView) ? rawDefaultView : 'week'),
    [rawDefaultView],
  );
  const date = React.useMemo(
    () =>
      dateUtils.date.parse([defaultYear, defaultMonth, defaultDay].join('-')) ??
      new Date(),
    [defaultYear, defaultMonth, defaultDay],
  );

  return {
    view,
    date,
    getUrl: React.useCallback(
      (view, date) =>
        ['', view, ...dateUtils.date.format(date).split('-')].join('/'),
      [],
    ),
  };
}
