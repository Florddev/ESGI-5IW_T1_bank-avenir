import { NextRequest } from 'next/server';
import { ConversationsController } from '@workspace/adapter-next/controllers/conversations.controller';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new ConversationsController();

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  await requireAuth()(request);
  
  const messages = await controller.getMessages(params.id);
  return successResponse(messages);
});

export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = await requireAuth()(request);
  const body = await parseBody<{ content: string }>(request);

  const message = await controller.sendMessage(params.id, auth.userId, body.content);
  return successResponse(message, 201);
});
