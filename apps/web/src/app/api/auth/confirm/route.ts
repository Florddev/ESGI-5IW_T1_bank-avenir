import { NextRequest } from 'next/server';
import { AuthController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';
import type { ConfirmAccountDto } from '@workspace/application/dtos';

const controller = new AuthController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseBody<ConfirmAccountDto>(request);
  const result = await controller.confirmAccount(body);
  return successResponse(result);
});

