import 'tailwindcss/tailwind.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { setLanguage } from '../lib/localization';

function App({
  Component,
  pageProps,
  router: { locale },
}: AppProps): JSX.Element {
  // Set locale even before app is rendered (useEffect may be too late)
  const previousLocale = React.useRef<string | undefined>(undefined);
  if (previousLocale.current !== locale) {
    setLanguage(locale as 'en');
    previousLocale.current = locale;
  }

  React.useEffect(() => {
    if ('serviceWorker' in navigator)
      window.addEventListener(
        'load',
        () => void navigator.serviceWorker.register('/sw.js')
      );
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

const app = App;
export default app;
