import 'tailwindcss/tailwind.css';

import type { AppProps } from 'next/app';
import React from 'react';
import { ServiceWorker } from './components/ServiceWorker';
import { setLanguage } from './lib/localization';
import { localization } from './const/localization';
import { themeColor } from './const/siteConfig';
import { Auth } from './components/Auth';

export default function RootLayout({
  children,
  ...args
}: // router: { locale },
AppProps & { readonly children: React.ReactNode }): JSX.Element {
  console.log(args);
  let locale = 'en';
  setLanguage(locale as 'en');

  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="description" content={localization.siteDescription} />
        <meta
          property="og:description"
          content={localization.siteDescription}
        />
        <meta name="keywords" content={localization.siteKeywords} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content={themeColor} />
      </head>
      <body>
        <div id="root">
          <Auth>{children}</Auth>
          <ServiceWorker />
        </div>
      </body>
    </html>
  );
}
