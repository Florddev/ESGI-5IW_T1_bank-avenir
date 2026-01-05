import '@/lib/di';
import { NextRequest } from 'next/server';
import { AdminController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AdminController();

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.DIRECTOR])(auth);
  
  const body = await parseBody<{
    firstName: string;
    lastName: string;
  }>(request);

  const user = await controller.updateUser(params.id, body.firstName, body.lastName);
  return successResponse(user);
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.DIRECTOR])(auth);

  await controller.deleteUser(params.id);
  return successResponse({ message: 'User deleted successfully' });
});
