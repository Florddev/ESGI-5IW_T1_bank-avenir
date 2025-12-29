import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { parseBody } from '@workspace/adapter-next/utils/api.helpers';
import type { LoginDto } from '@workspace/application/dtos';

const controller = new AuthController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseBody<LoginDto>(request);
  const authResponse = await controller.login(body);

  const response = NextResponse.json(authResponse, { status: 200 });
  response.cookies.set('auth_token', authResponse.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
});

