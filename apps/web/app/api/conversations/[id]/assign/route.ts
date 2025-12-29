import { NextRequest } from 'next/server';
import { ConversationsController } from '@workspace/adapter-next/controllers/conversations.controller';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { requireRole, UserRole } from '@workspace/adapter-next/middleware/rbac.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new ConversationsController();

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);

  const conversation = await controller.assignConversation(params.id, auth.userId);
  return successResponse(conversation);
});
