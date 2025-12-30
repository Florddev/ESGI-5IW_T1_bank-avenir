import { NextRequest, NextResponse } from 'next/server';
import { i18nMiddleware } from './i18n.middleware';
import { routeGuardMiddleware } from './route-guard.middleware';

export async function createMiddleware(request: NextRequest): Promise<NextResponse> {
  const i18nResponse = i18nMiddleware(request);
  if (i18nResponse.status !== 200) return i18nResponse;

  return i18nResponse;
  return routeGuardMiddleware(request);
}