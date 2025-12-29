import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['fr', 'en'] as const;
const DEFAULT_LOCALE = 'fr';

export function i18nMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) return NextResponse.next();

  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
