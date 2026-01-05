import '@/lib/di';
import { NextRequest } from 'next/server';
import { AccountsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new AccountsController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  
  const accounts = await controller.listUserAccounts(auth.userId);
  return successResponse(accounts);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  const body = await parseBody<{
    customName: string;
    type: string;
    savingsRate?: number;
  }>(request);

  const account = await controller.createAccount(
    auth.userId,
    body.customName,
    body.type,
    body.savingsRate
  );
  
  return successResponse(account, 201);
});

