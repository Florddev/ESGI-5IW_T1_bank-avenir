import { NextRequest } from 'next/server';
import { LoansController } from '@workspace/adapter-next/controllers/loans.controller';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireOwnership } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new LoansController();

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const auth = await requireAuth()(request);
  await requireOwnership(params.userId)(auth);
  
  const loans = await controller.getUserLoans(params.userId);
  return successResponse(loans);
});
