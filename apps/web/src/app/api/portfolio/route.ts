import '@/lib/di';
import { NextRequest } from 'next/server';
import { StocksController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware/error.middleware';
import { requireAuth } from '@workspace/adapter-next/middleware/auth.middleware';
import { successResponse } from '@workspace/adapter-next/utils/api.helpers';

const controller = new StocksController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  
  const portfolio = await controller.getUserPortfolio(auth.userId);
  return successResponse(portfolio);
});

