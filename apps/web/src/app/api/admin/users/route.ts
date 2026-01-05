import '@/lib/di';
import { NextRequest } from 'next/server';
import { AdminController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AdminController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.DIRECTOR])(auth);
  
  const body = await parseBody<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }>(request);

  const user = await controller.createUser(
    body.email,
    body.password,
    body.firstName,
    body.lastName,
    body.role
  );
  
  return successResponse(user, 201);
});

