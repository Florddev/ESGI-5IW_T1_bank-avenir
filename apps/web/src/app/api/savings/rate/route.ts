import '@/lib/di';
import { NextRequest } from 'next/server';
import { AdminController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AdminController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireAuth()(request);

  const currentRate = await controller.getCurrentSavingsRate();
  return successResponse(currentRate);
});

export const PATCH = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.DIRECTOR])(auth);

  const body = await parseBody<{ newRate: number; message?: string }>(request);

  const result = await controller.updateSavingsRate(body.newRate, body.message);
  return successResponse(result);
});

