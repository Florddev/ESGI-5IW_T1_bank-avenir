import { NextRequest } from 'next/server';
import { TransactionsController } from '@workspace/adapter-next/controllers';
import { AccountsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireOwnership } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new TransactionsController();
const accountsController = new AccountsController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  const body = await parseBody<{
    accountId: string;
    amount: number;
  }>(request);

  const account = await accountsController.getAccount(body.accountId);
  await requireOwnership(account.userId)(auth);

  const transaction = await controller.deposit(body.accountId, body.amount);
  return successResponse(transaction, 201);
});

