import { f } from '../../../lib/functools';
import { dateUtils } from '../../../lib/dateUtils';
import React from 'react';
import { useSearchParams } from 'next/navigation';

const views = ['day', 'week', 'month', 'year', 'all'] as const;
export type View = (typeof views)[number];

const queryStringName = 'date';

export function useSegments(rawDefaultView?: string): {
  readonly view: View;
  readonly date: Date;
  readonly getUrl: (view: View, date: Date) => string;
} {
  const searchParams = useSearchParams();
  const rawDate = searchParams.get(queryStringName);

  const view = React.useMemo(
    () => (f.includes(views, rawDefaultView) ? rawDefaultView : 'week'),
    [rawDefaultView],
  );
  const date = React.useMemo(
    () =>
      (typeof rawDate === 'string'
        ? dateUtils.date.parse(rawDate)
        : undefined) ?? new Date(),
    [rawDate],
  );

  return {
    view,
    date,
    getUrl: React.useCallback((view, date) => {
      const params = new URLSearchParams(searchParams);
      params.set(queryStringName, dateUtils.date.format(date));
      const queryString = params.toString();
      return `/${view}?${queryString}`;
    }, []),
  };
}
