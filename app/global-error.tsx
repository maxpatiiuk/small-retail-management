'use client';

import React from 'react';

import { ErrorPage } from './components/ErrorPage';

export default function GlobalError({
  error,
}: {
  readonly error: Error;
}): JSX.Element {
  return <ErrorPage error={error} />;
}
