'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { AuthProvider } from '@workspace/adapter-next/features/auth';
import { I18nProvider } from '@workspace/ui-react/contexts';
import type { Locale } from '@/dictionaries';

import 'reflect-metadata';
import { RealtimeConnectionFactory } from '@workspace/adapter-common/client';
import { SSEConnection } from '@workspace/service-realtime-sse';
import { WebSocketConnection } from '@workspace/service-realtime-websocket';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  translations: Record<string, any>;
}

let isRealtimeInitialized = false;

function initializeRealtimeFactory() {
  if (typeof window === 'undefined' || isRealtimeInitialized) {
    return;
  }

  try {
    RealtimeConnectionFactory.registerImplementations(
      SSEConnection,
      WebSocketConnection
    );

    const protocol = (process.env.NEXT_PUBLIC_REALTIME_PROTOCOL || 'sse') as 'sse' | 'websocket';
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws';
    const sseUrl = process.env.NEXT_PUBLIC_SSE_URL || '/api/realtime/sse';

    const testWs = () => {
      return new Promise<boolean>((resolve) => {
        try {
          const ws = new WebSocket(wsUrl);
          const timeout = setTimeout(() => {
            ws.close();
            resolve(false);
          }, 1000);
          ws.onopen = () => {
            clearTimeout(timeout);
            ws.close();
            resolve(true);
          };
          ws.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
        } catch {
          resolve(false);
        }
      });
    };

    testWs().then(wsAvailable => {
      const finalProtocol = protocol === 'websocket' || wsAvailable ? 'websocket' : 'sse';
      
      RealtimeConnectionFactory.configure({
        protocol: finalProtocol,
        wsUrl: finalProtocol === 'websocket' ? wsUrl : undefined,
        sseUrl: finalProtocol === 'sse' ? sseUrl : undefined,
      });

      console.log(`[Realtime] Using ${finalProtocol.toUpperCase()} (WS available: ${wsAvailable})`);
    });

    isRealtimeInitialized = true;
  } catch (error) {
    console.error('Failed to initialize RealtimeConnectionFactory:', error);
  }
}

export function Providers({ children, locale, translations }: ProvidersProps) {
  // Initialize on mount (client-side only)
  React.useEffect(() => {
    initializeRealtimeFactory();
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
