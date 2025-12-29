export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'fr-FR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const optionsMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'long', year: 'numeric' },
    long: { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' },
    full: { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' },
  };

  return new Intl.DateTimeFormat(locale, optionsMap[format]).format(dateObj);
}

export function formatDateTime(
  date: Date | string,
  locale: string = 'fr-FR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

export function formatPercentage(
  value: number,
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

export function formatNumber(
  value: number,
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function formatDuration(months: number): string {
  if (months < 12) {
    return `${months} mois`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} ${years > 1 ? 'ans' : 'an'}`;
  }
  
  return `${years} ${years > 1 ? 'ans' : 'an'} et ${remainingMonths} mois`;
}
