import { IR, RA, RR } from './types';
import { mappedFind } from './utils';

const languages = ['en', 'uk'] as const;
type Language = (typeof languages)[number];
let language: Language = 'en';
let detectedLanguage = false;

export function detectLanguage(): Language {
  if (detectedLanguage) return language;

  const parsedLanguage = mappedFind(
    globalThis.navigator?.languages ?? [],
    (userLanguage) =>
      languages.find(
        (appLanguage) =>
          userLanguage.startsWith(appLanguage) ||
          appLanguage.startsWith(userLanguage)
      )
  );

  detectedLanguage = true;
  language = parsedLanguage ?? language;
  return language;
}

/**
 * A tiny localization lib
 */
export const dictionary = <
  T extends IR<RR<Language, string | ((...args: RA<never>) => string)>>
>(
  dictionary: T
): {
  readonly [KEY in keyof T]: T[KEY][Language];
} =>
  new Proxy(
    {} as {
      readonly [KEY in keyof T]: T[KEY][Language];
    },
    {
      get: (target, key) =>
        typeof key === 'string'
          ? dictionary[key]?.[language] ?? target[key]
          : undefined,
    }
  );
