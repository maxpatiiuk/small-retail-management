import React from 'react';

import { localization } from '../const/localization';
import { icons } from '../Atoms/Icons';
import { Link } from '../Atoms/Link';
import { Centered } from '../Atoms';

export function ErrorPage({
  error,
}: {
  readonly error: string | JSX.Element;
}): JSX.Element {
  return (
    <Centered>
      <div className="text-center">
        <h1 className="py-2 text-9xl text-indigo-300">{localization.error}</h1>
        {typeof error === 'string' ? <p>{error}</p> : error}
        <p>
          <Link.Default href="/" className="items-center pt-10">
            {icons.chevronLeft}
            {localization.returnToHomePage}
          </Link.Default>
        </p>
      </div>
    </Centered>
  );
}
