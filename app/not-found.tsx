import React from 'react';

import { ErrorPage } from './Molecules/ErrorPage';
import { localization } from './const/localization';

export default function NotFound(): JSX.Element {
  return (
    <ErrorPage
      error={
        <>
          <h2 className="text-2xl">{localization.notFound}</h2>
          <p>{localization.notFoundDescription}</p>
        </>
      }
    />
  );
}
