'use client';

import { useI18n } from '@workspace/ui-react/contexts';

/**
 * Hook to create localized links that preserve the current locale
 * @returns Function to create localized paths
 */
export function useLocalizedPath() {
  const { locale } = useI18n();
  
  return (path: string): string => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${locale}/${cleanPath}`;
  };
}

/**
 * Hook to get the current locale
 * @returns Current locale
 */
export function useLocale() {
  const { locale } = useI18n();
  return locale;
}
