import React from 'react';

import { ErrorPage } from '../components/Molecules/ErrorPage';
import { localization } from '../const/localization';
import { H2 } from '../components/Atoms';

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
