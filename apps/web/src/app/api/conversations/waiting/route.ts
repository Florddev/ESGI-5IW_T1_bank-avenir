import '@/lib/di';
import { NextRequest } from 'next/server';
import { ConversationsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new ConversationsController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  //const auth = await requireAuth()(request);
  //await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);
  
  const conversations = await controller.getWaitingConversations();
  return successResponse(conversations);
});

