'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';

export type Locale = 'fr' | 'en';
export const LOCALES: readonly Locale[] = ['fr', 'en'];
export const DEFAULT_LOCALE: Locale = 'fr';

type Translations = Record<string, any>;

interface I18nContextValue {
  locale: Locale;
  translations: Translations;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  locale: Locale;
  translations: Translations;
  children: ReactNode;
}

export function I18nProvider({ locale, translations, children }: I18nProviderProps) {
  const t = useMemo(
    () => (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        if (value?.[k]) {
          value = value[k];
        } else {
          return key;
        }
      }

      if (typeof value !== 'string') return key;

      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k]?.toString() || '');
      }

      return value;
    },
    [translations]
  );

  return (
    <I18nContext.Provider value={{ locale, translations, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}

export function useTranslations() {
  return useI18n().t;
}
