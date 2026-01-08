import '@/lib/di';
import { NextRequest } from 'next/server';
import { AccountsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireOwnership } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AccountsController();

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  const { id } = await params;

  const account = await controller.getAccount(id);

  await requireOwnership(account.userId)(auth);

  return successResponse(account);
});

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  const { id } = await params;

  const account = await controller.getAccount(id);
  await requireOwnership(account.userId)(auth);

  await controller.deleteAccount(id);
  return successResponse({ message: 'Account deleted successfully' });
});
