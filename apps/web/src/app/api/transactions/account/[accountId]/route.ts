import { NextRequest } from 'next/server';
import { TransactionsController, AccountsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
//import { requireOwnership } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new TransactionsController();
const accountsController = new AccountsController();

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) => {
  const auth = await requireAuth()(request);
  const { accountId } = await params;

  const account = await accountsController.getAccount(accountId);
  //await requireOwnership(account.userId)(auth);

  const transactions = await controller.getAccountTransactions(accountId);
  return successResponse(transactions);
});
