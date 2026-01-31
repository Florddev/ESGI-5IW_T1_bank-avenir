import '@/lib/di';
import { NextRequest } from 'next/server';
import { StocksController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new StocksController();

export const POST = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const auth = await requireAuth()(request);
  const { id } = await params;
  const body = await parseBody<{ quantity: number }>(request);

  const order = await controller.buyStock(auth.userId, id, body.quantity);
  return successResponse(order, 201);
});
