import '@/lib/di';
import { NextRequest } from 'next/server';
import { NotificationsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new NotificationsController();

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  await requireAuth()(request);

  await controller.markAsRead(params.id);
  return successResponse({ message: 'Notification marked as read' });
});
