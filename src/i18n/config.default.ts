const defaultNS = "common";

const getPath = (currentLanguage: string, currentNamespace: string): string => {
  return `i18n/locale/${currentLanguage}/${currentNamespace}.json`;
};

const getTranslationsPath = (languages: string[], ns: string[]) => {
  const currentLanguage = languages[0];
  const currentNamespace = ns[0];

  return getPath(currentLanguage, currentNamespace);
};

const _castArray = <T>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

export const i18nextDefaultConfig = {
  react: {
    // Turn off the use of React Suspense
    useSuspense: false,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  ns: [],
  defaultNS,
  fallbackNS: defaultNS,
  keySeparator: false,
  nsSeparator: false,
  backend: {
    loadPath: (languages: string[], ns: string[]) =>
      getTranslationsPath(_castArray(languages), _castArray(ns)),
  },
};
