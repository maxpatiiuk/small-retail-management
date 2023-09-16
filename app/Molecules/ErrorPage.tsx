import React from 'react';

import { localization } from '../const/localization';
import { icons } from '../Atoms/Icons';
import { Link } from '../Atoms/Link';
import { Centered, H1 } from '../Atoms';

export function ErrorPage({
  error,
}: {
  readonly error: string | JSX.Element;
}): JSX.Element {
  return (
    <Centered>
      <H1>{localization.error}</H1>
      {typeof error === 'string' ? <p>{error}</p> : error}
      <p>
        <Link.Default href="/" className="items-center pt-10">
          {icons.chevronLeft}
          {localization.returnToHomePage}
        </Link.Default>
      </p>
    </Centered>
  );
}
