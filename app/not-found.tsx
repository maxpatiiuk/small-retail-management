import React from 'react';

import { ErrorPage } from './Molecules/ErrorPage';
import { localization } from './const/localization';
import { H2 } from './Atoms';

export default function NotFound(): JSX.Element {
  return (
    <ErrorPage
      error={
        <>
          <H2>{localization.notFound}</H2>
          <p>{localization.notFoundDescription}</p>
        </>
      }
    />
  );
}
