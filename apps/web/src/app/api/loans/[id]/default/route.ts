import '@/lib/di';
import { NextRequest } from 'next/server';
import { LoansController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new LoansController();

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);

  const { id } = await params;
  const loan = await controller.markDefaulted(id);
  return successResponse(loan);
});
