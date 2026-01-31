import '@/lib/di';
import { NextRequest } from 'next/server';
import { AdvisorController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware';
import { requireAuth, requireRole } from '@workspace/adapter-next/middleware';
import { successResponse, errorResponse } from '@workspace/adapter-next/utils/api.helpers';
import { UserRole } from '@workspace/domain';
import { sendAdvisorNotificationSchema } from '@workspace/adapter-common/validators';

const controller = new AdvisorController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);

  const body = await request.json();
  const parsed = sendAdvisorNotificationSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, 400);
  }

  const result = await controller.notifyClients(auth.userId, parsed.data.title, parsed.data.message);
  return successResponse(result);
});
