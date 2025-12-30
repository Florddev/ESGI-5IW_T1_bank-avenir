export type Locale = 'fr' | 'en';
export const LOCALES: readonly Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';

const dictionaries = {
  en: () => import('@workspace/translations/dist/en.json').then((m) => m.default),
  fr: () => import('@workspace/translations/dist/fr.json').then((m) => m.default),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();