import '@/lib/di';
import { NextRequest } from 'next/server';
import { ArticlesController } from '@workspace/adapter-next/controllers';
import { withErrorHandler } from '@workspace/adapter-next/middleware';
import { requireAuth, requireRole } from '@workspace/adapter-next/middleware';
import { successResponse, errorResponse } from '@workspace/adapter-next/utils/api.helpers';
import { UserRole } from '@workspace/domain';
import { createArticleSchema } from '@workspace/adapter-common/validators';

const controller = new ArticlesController();

export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireAuth()(request);
  const articles = await controller.getArticles();
  return successResponse(articles);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const auth = await requireAuth()(request);
  await requireRole([UserRole.ADVISOR, UserRole.DIRECTOR])(auth);

  const body = await request.json();
  const parsed = createArticleSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, 400);
  }

  const article = await controller.createArticle(auth.userId, parsed.data.title, parsed.data.content);
  return successResponse(article, 201);
});
