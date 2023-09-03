import Link from 'next/link';
import React from 'react';

import { localization } from '../const/localization';
import { icons } from './icons';
import { Centered } from './UI';

export function ErrorPage({ error }: { readonly error: Error }): JSX.Element {
  return (
    <Centered>
      <div className="text-center">
        <h1 className="py-2 text-9xl text-indigo-300">{error.message}</h1>
        <h2>{localization.notFound}</h2>
        <p>
          {localization.notFoundDescription}
          <Link
            href="/"
            className={`
                flex items-center justify-center pt-10 text-red-400 transition
                hover:text-black
              `}
          >
            {icons.chevronLeft}
            {localization.returnToHomePage}
          </Link>
        </p>
      </div>
    </Centered>
  );
}
