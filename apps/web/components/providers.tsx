'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@workspace/adapter-next/features/auth';
import { I18nProvider } from '@workspace/ui-react/contexts';
import type { Locale } from '@/dictionaries';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  translations: Record<string, any>;
}

export function Providers({ children, locale, translations }: ProvidersProps) {
  return (
    <I18nProvider locale={locale} translations={translations}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <AuthProvider>{children}</AuthProvider>
      </NextThemesProvider>
    </I18nProvider>
  );
}
