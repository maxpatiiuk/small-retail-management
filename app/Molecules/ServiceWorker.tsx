'use client';

import React from 'react';

export function ServiceWorker(): null {
  React.useEffect(() => {
    if ('serviceWorker' in navigator)
      window.addEventListener(
        'load',
        () => void navigator.serviceWorker.register('/sw.js')
      );
  }, []);
  return null;
}
