import '@/lib/di';
import { NextRequest } from 'next/server';
import { AuthController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';
import type { RegisterUserDto } from '@workspace/application/dtos';

const controller = new AuthController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  console.log('Register route called');
  const body = await parseBody<RegisterUserDto>(request);
  const result = await controller.register(body);
  return successResponse(result, 201);
});

