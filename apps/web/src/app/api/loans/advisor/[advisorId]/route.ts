import '@/lib/di';
import { NextRequest } from 'next/server';
import { LoansController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new LoansController();

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { advisorId: string } }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);
  
  const loans = await controller.getAdvisorLoans(params.advisorId);
  return successResponse(loans);
});
