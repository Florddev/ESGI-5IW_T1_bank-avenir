import '@/lib/di';
import { NextRequest } from 'next/server';
import { AdvisorController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware';
import { requireAuth, requireRole } from '@workspace/adapter-next/middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';
import { UserRole } from '@workspace/domain';

const controller = new AdvisorController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);

  const clients = await controller.getClients(auth.userId);
  return successResponse(clients);
});
