import { NextRequest } from 'next/server';
import { AuthController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { successResponse, errorResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AuthController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return errorResponse('Non authentifié', 401);
  }

  const user = await controller.getCurrentUser(token);
  return successResponse(user);
});

