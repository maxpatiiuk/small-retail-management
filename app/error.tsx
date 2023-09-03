'use client';

import React from 'react';

import { ErrorPage } from './components/ErrorPage';

export default function GlobalError({
  error,
}: {
  readonly error: Error;
}): JSX.Element {
  return (
    <html>
      <body>
        <ErrorPage error={error} />;
      </body>
    </html>
  );
}
