import { IR, RA, RR } from "./utilities";

const languages = ['en', 'uk'] as const;
type Language = (typeof languages)[number];
let language: Language = 'en';

export function setLanguage(newLanguage: Language): void {
  const parsedLanguage = languages.find(
    (language) =>
      newLanguage.startsWith(language) || language.startsWith(newLanguage)
  );
  if (typeof parsedLanguage === 'string') language = parsedLanguage;
  else console.error('Unknown language');
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