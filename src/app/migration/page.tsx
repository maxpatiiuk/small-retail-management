'use client';

import React from 'react';
import { useAsyncState } from '../../components/Hooks/useAsyncState';

export default function Migration(): JSX.Element | null {
  const [Component] = useAsyncState(
    React.useCallback(
      () =>
        process.env.NODE_ENV === 'development'
          ? import('./Migration').then(({ Migration }) => Migration)
          : undefined,
      [],
    ),
    true,
  );
  return typeof Component === 'function' ? <Component /> : null;
}
