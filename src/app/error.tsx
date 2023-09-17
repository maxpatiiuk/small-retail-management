'use client';

import React from 'react';

import { ErrorPage } from '../components/Molecules/ErrorPage';

export default function GlobalError({
  error,
}: {
  readonly error: Error;
}): JSX.Element {
  return (
    <html>
      <body>
        <ErrorPage error={error.message} />;
      </body>
    </html>
  );
}
