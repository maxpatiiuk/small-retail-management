'use client';

import { localization } from '../../const/localization';
import { Link } from '../../components/Atoms/Link';
import { H1 } from '../../components/Atoms';
import { icons } from '../../components/Atoms/Icons';
import React from 'react';

export default function MainPage(): JSX.Element {
  const [date, setDate] = React.useState(new Date());
  return (
    <>
      <header className="flex gap-2">
        <H1>{localization.siteTitle}</H1>
        <span className="-ml-2 flex-1" />
        <Link.Info href="./employees">{localization.editEmployees}</Link.Info>
      </header>
      <section className="flex flex-wrap gap-4 sm:gap-8 p-2 rounded bg-gray-200">
        <aside>
          <h2>{localization.viewNoun}</h2>
          <div className="flex gap-1">
            <Link.Info
              href=""
              aria-current="page"
              aria-label={localization.week}
              title={localization.week}
            >
              7
            </Link.Info>
            <Link.Info
              href=""
              aria-label={localization.month}
              title={localization.month}
            >
              30
            </Link.Info>
            <Link.Info
              href=""
              aria-label={localization.year}
              title={localization.year}
            >
              365
            </Link.Info>
            <Link.Info
              href=""
              aria-label={localization.all}
              title={localization.all}
            >
              *
            </Link.Info>
          </div>
        </aside>
        <aside>
          <h2>{localization.date}</h2>
          <div className="flex gap-1 items-center">
            <Link.Success href="">{localization.today}</Link.Success>
            <Link.Info
              href=""
              aria-label={localization.previous}
              title={localization.previous}
            >
              {icons.chevronLeft}
            </Link.Info>
            {date.toLocaleDateString()}
            <Link.Info
              href=""
              aria-label={localization.next}
              title={localization.next}
            >
              {icons.chevronRight}
            </Link.Info>
          </div>
        </aside>
      </section>
      <main className=""></main>
    </>
  );
}
