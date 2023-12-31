'use client';

import { localization } from '../../../const/localization';
import { Link } from '../../../components/Atoms/Link';
import { H1 } from '../../../components/Atoms';
import { icons } from '../../../components/Atoms/Icons';
import React from 'react';
import { Input } from '../../../components/Atoms/Input';
import { View, useSegments } from './useSegments';
import { RA } from '../../../lib/types';
import { useRouter } from 'next/navigation';
import { useNeighboringDates } from './useNeighboringDates';
import { ColumnsContent } from '../../../components/WeekDay/ColumnsContent';
import { useToday } from '../../../components/Hooks/useToday';
import { MonthStats } from '../../../components/Stats/MonthStats';
import { YearStats } from '../../../components/Stats/YearStats';
import { AllStats } from '../../../components/Stats/AllStats';
import { UtcDate } from '../../../lib/UtcDate';

export default function MainPage({
  params: { segments = [] },
}: {
  readonly params: { readonly segments?: RA<string> };
}): JSX.Element {
  const { date, view, getUrl } = useSegments(segments[0]);
  const canOverflow = ['month', 'year', 'all'].includes(view);
  return (
    <>
      <header className="flex gap-2">
        <H1>{localization.siteTitle}</H1>
        <span className="-ml-2 flex-1" />
        <Link.Info href="/employees">{localization.editEmployees}</Link.Info>
      </header>
      <section className="flex flex-wrap gap-4 sm:gap-8 p-2 rounded bg-gray-200">
        <ViewSelect view={view} date={date} getUrl={getUrl} />
        {view !== 'all' && (
          <DateSelect view={view} date={date} getUrl={getUrl} />
        )}
      </section>
      <main
        className={`
          flex-1 flex flex-col gap-2 sm:gap-4
          ${canOverflow ? 'overflow-auto' : 'overflow-hidden'}
        `}
      >
        {view === 'day' || view === 'week' ? (
          <ColumnsContent date={date} view={view} />
        ) : view === 'month' ? (
          <MonthStats date={date} />
        ) : view === 'year' ? (
          <YearStats date={date} />
        ) : (
          <AllStats />
        )}
      </main>
    </>
  );
}

function ViewSelect({
  view,
  date,
  getUrl,
}: {
  readonly view: View;
  readonly date: UtcDate;
  readonly getUrl: (view: View, date: UtcDate) => string;
}): JSX.Element {
  return (
    <aside>
      <h2>{localization.viewNoun}</h2>
      <div className="flex gap-1">
        {views.map(([name, localized, label]) => (
          <Link.Info
            key={name}
            href={getUrl(name, date)}
            aria-current={name === view ? 'page' : undefined}
            aria-label={localized}
            title={localized}
          >
            {label}
          </Link.Info>
        ))}
      </div>
    </aside>
  );
}

const views = [
  ['day', localization.day, '1'],
  ['week', localization.week, '7'],
  ['month', localization.month, '30'],
  ['year', localization.year, '365'],
  ['all', localization.all, '*'],
] as const;

function DateSelect({
  view,
  date,
  getUrl,
}: {
  readonly view: View;
  readonly date: UtcDate;
  readonly getUrl: (view: View, date: UtcDate) => string;
}): JSX.Element {
  const navigate = useRouter();
  const { previousDate, nextDate } = useNeighboringDates(view, date);
  const today = useToday();
  return (
    <aside>
      <h2>{localization.date}</h2>
      <div className="flex gap-1 items-center">
        <Link.Success href={getUrl(view, today)}>
          {localization.today}
        </Link.Success>
        <Link.Info
          href={getUrl(view, previousDate)}
          aria-label={localization.previous}
          title={localization.previous}
        >
          {icons.chevronLeft}
        </Link.Info>
        {view === 'day' ? (
          <Input.Date
            min="2000-01-01"
            date={date}
            onDateChange={(date): void => navigate.push(getUrl(view, date))}
          />
        ) : view === 'week' ? (
          <Input.Week
            min="2000-W01"
            date={date}
            onDateChange={(date): void => navigate.push(getUrl(view, date))}
          />
        ) : view === 'month' ? (
          <Input.Month
            min="2000-01"
            date={date}
            onDateChange={(date): void => navigate.push(getUrl(view, date))}
          />
        ) : (
          <Input.Year
            min={2000}
            date={date}
            onDateChange={(date): void => navigate.push(getUrl(view, date))}
          />
        )}
        <Link.Info
          href={getUrl(view, nextDate)}
          aria-label={localization.next}
          title={localization.next}
        >
          {icons.chevronRight}
        </Link.Info>
      </div>
    </aside>
  );
}
