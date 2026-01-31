import '@/lib/di';
import { NextRequest } from 'next/server';
import { StocksController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new StocksController();

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.DIRECTOR])(auth);

  const { id } = await params;
  const body = await parseBody<{
    companyName?: string;
    makeAvailable?: boolean;
  }>(request);

  const stock = await controller.updateStock(id, body.companyName, body.makeAvailable);
  return successResponse(stock);
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.DIRECTOR])(auth);

  const { id } = await params;
  await controller.deleteStock(id);
  return successResponse({ message: 'Stock deleted successfully' });
});
