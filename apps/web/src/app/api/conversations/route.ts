import '@/lib/di';
import { NextRequest } from 'next/server';
import { ConversationsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new ConversationsController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  
  const conversations = await controller.getUserConversations(auth.userId);
  return successResponse(conversations);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  const body = await parseBody<{ subject: string; firstMessage: string }>(request);

  const conversation = await controller.createConversation(auth.userId, body.subject, body.firstMessage);
  return successResponse(conversation, 201);
});

