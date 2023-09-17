'use client';

import 'tailwindcss/tailwind.css';

import React from 'react';
import { ServiceWorker } from './Molecules/ServiceWorker';
import { detectLanguage } from './lib/localization';
import { localization } from './const/localization';
import { themeColor } from './const/siteConfig';
import { Auth } from './Molecules/Auth';
import { EmployeesProvider } from './employees';

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): JSX.Element {
  // Set locale even before app is rendered (useEffect may be too late)
  const locale = detectLanguage();

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
      {/* Fixes https://stackoverflow.com/questions/75337953/what-causes-nextjs-warning-extra-attributes-from-the-server-data-new-gr-c-s-c */}
      <body suppressHydrationWarning={true}>
        <div id="root" className="flex min-h-screen flex-col gap-4 p-4">
          <Auth>
            <EmployeesProvider>{children}</EmployeesProvider>
          </Auth>
          <ServiceWorker />
        </div>
      </body>
    </html>
  );
}
