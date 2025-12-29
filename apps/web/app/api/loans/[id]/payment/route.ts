import { NextRequest } from 'next/server';
import { LoansController } from '@workspace/adapter-next/controllers/loans.controller';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new LoansController();

export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  await requireAuth()(request);
  
  const payment = await controller.processPayment(params.id);
  return successResponse(payment);
});
