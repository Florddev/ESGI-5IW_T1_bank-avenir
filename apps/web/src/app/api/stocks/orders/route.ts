import '@/lib/di';
import { NextRequest } from 'next/server';
import { StocksController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new StocksController();

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);

  const body = await parseBody<{
    stockId: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    pricePerShare: number;
  }>(request);

  let order;
  if (body.type === 'BUY') {
    order = await controller.placeBuyOrder(auth.userId, body.stockId, body.quantity, body.pricePerShare);
  } else {
    order = await controller.placeSellOrder(auth.userId, body.stockId, body.quantity, body.pricePerShare);
  }

  return successResponse(order, 201);
});
