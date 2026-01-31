import '@/lib/di';
import { NextRequest } from 'next/server';
import { NotificationsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new NotificationsController();

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await requireAuth()(request);

  const { id } = await params;
  await controller.markAsRead(id);
  return successResponse({ message: 'Notification marked as read' });
});
