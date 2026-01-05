import '@/lib/di';
import { NextRequest } from 'next/server';
import { StocksController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse, parseBody } from '@workspace/adapter-next/utils/api.helpers';

const controller = new StocksController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireAuth()(request);
  
  const stocks = await controller.getAllStocks();
  return successResponse(stocks);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  //await requireRole([UserRole.DIRECTOR])(auth);
  
  const body = await parseBody<{
    symbol: string;
    companyName: string;
  }>(request);

  const stock = await controller.createStock(body.symbol, body.companyName);
  return successResponse(stock, 201);
});

