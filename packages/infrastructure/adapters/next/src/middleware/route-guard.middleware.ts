import { NextRequest, NextResponse } from 'next/server';
import { extractAuth } from './auth.middleware';

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/confirm-email'];
const AUTH_ROUTES = ['/auth/login', '/auth/register'];

function matchRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '');
    return pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`);
  });
}

export async function routeGuardMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = await extractAuth(request);
  const locale = pathname.split('/')[1];

  if (auth && matchRoute(pathname, AUTH_ROUTES)) {
    request.nextUrl.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(request.nextUrl);
  }

  if (!auth && !matchRoute(pathname, PUBLIC_ROUTES)) {
    request.nextUrl.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(request.nextUrl);
  }

  const headers = new Headers(request.headers);
  headers.set('x-user-id', auth?.userId || '');
  headers.set('x-user-role', auth?.role || '');

  return NextResponse.next({ request: { headers } });
}