'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@workspace/adapter-next/features/auth';
import { I18nProvider } from '@workspace/ui-react/contexts';
import type { Locale } from '@/dictionaries';
import { configureClients } from '@workspace/adapter-next/client';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  translations: Record<string, any>;
}

export function Providers({ children, locale, translations }: ProvidersProps) {
  React.useEffect(() => {
    // ✅ Configure custom routes for your app
    configureClients({
      auth: {
        login: '/api/v1/auth/signin',        // Override default '/api/auth/login'
        register: '/api/v1/auth/signup',     // Override default '/api/auth/register'
        // logout: '/custom/logout',         // Optional: keep default if not specified
        // confirmAccount: '/custom/confirm',
        // me: '/custom/me',
      },
      // You can also override other domains:
      // accounts: {
      //   list: '/api/v2/accounts',
      // },
    });
  }, []);

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
