import React from 'react';

import { ErrorPage } from './components/ErrorPage';

const error = new Error('Page not Found');

export default function NotFound(): JSX.Element {
  return <ErrorPage error={error} />;
}
