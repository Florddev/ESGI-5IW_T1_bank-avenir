import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (request: NextRequest, context?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error: any) {
      console.error('API Error:', error);

      const status = error.status || error.statusCode || 500;
      const message = error.message || 'Internal Server Error';

      return NextResponse.json(
        { error: message },
        { status }
      );
    }
  };
}
