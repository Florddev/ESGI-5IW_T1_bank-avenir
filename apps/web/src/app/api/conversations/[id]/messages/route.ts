import '@/lib/di';
import { NextRequest } from 'next/server';
import { ConversationsController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new ConversationsController();

export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await requireAuth()(request);

  const { id } = await params;
  const messages = await controller.getMessages(id);
  return successResponse(messages);
});

export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  const body = await parseBody<{ content: string }>(request);

  const { id } = await params;
  const message = await controller.sendMessage(id, auth.userId, body.content);
  return successResponse(message, 201);
});
