import '@/lib/di';
import { NextRequest } from 'next/server';
import { LoansController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new LoansController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);
  
  const body = await parseBody<{
    userId: string;
    accountId: string;
    principal: number;
    annualInterestRate: number;
    insuranceRate: number;
    durationMonths: number;
  }>(request);

  const loan = await controller.createLoan(
    body.userId,
    auth.userId,
    body.accountId,
    body.principal,
    body.annualInterestRate,
    body.insuranceRate,
    body.durationMonths
  );
  
  return successResponse(loan, 201);
});

