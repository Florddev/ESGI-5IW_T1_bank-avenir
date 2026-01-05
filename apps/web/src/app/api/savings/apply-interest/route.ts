import '@/lib/di';
import { NextRequest } from 'next/server';
import { AdminController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AdminController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const result = await controller.applySavingsInterest();
  return successResponse(result);
});

