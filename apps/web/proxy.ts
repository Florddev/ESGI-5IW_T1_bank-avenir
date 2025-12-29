import type { NextRequest } from 'next/server';
import { createMiddleware } from '@workspace/adapter-next/middleware';

export function proxy(request: NextRequest) {
  return createMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
