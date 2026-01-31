import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import type { ArticleDto } from '@workspace/application/dtos';

@ApiClient()
export class ArticlesClient extends BaseClient {
    async getArticles(): Promise<ArticleDto[]> {
        return this.get<ArticleDto[]>('/api/articles');
    }

    async createArticle(data: { title: string; content: string }): Promise<ArticleDto> {
        return this.post<ArticleDto>('/api/articles', data);
    }
}

export function getArticlesClient(): ArticlesClient {
    return ArticlesClient.getInstance();
}
