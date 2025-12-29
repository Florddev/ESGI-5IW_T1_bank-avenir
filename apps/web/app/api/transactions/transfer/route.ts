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
    fromAccountId: string;
    toAccountId: string;
    amount: number;
  }>(request);

  const fromAccount = await accountsController.getAccount(body.fromAccountId);
  await requireOwnership(fromAccount.userId)(auth);

  const transaction = await controller.transfer(
    body.fromAccountId,
    body.toAccountId,
    body.amount
  );
  
  return successResponse(transaction, 201);
});

