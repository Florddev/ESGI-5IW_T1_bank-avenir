'use client';

import { useI18n, LOCALES, type Locale } from '../contexts/locale-context';
import { Button } from './button';

export function LocaleSwitcher() {
  const { locale, t } = useI18n();

  const switchLocale = (newLocale: Locale) => {
    const path = window.location.pathname.replace(/^\/(en|fr)/, `/${newLocale}`);
    window.location.href = path;
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{t('common.labels.language')}:</span>
      <div className="flex gap-1">
        {LOCALES.map((l) => (
          <Button
            key={l}
            variant={locale === l ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchLocale(l)}
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
