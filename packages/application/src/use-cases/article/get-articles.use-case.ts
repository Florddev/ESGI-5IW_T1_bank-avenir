import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IArticleRepository } from '../../ports';
import type { ArticleDto } from '../../dtos';

@UseCase()
export class GetArticlesUseCase {
    constructor(
        @Inject(TOKENS.IArticleRepository)
        private readonly articleRepository: IArticleRepository
    ) {}

    async execute(): Promise<ArticleDto[]> {
        const articles = await this.articleRepository.findAll();

        return articles
            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
            .map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                authorId: article.authorId,
                authorName: article.authorName,
                publishedAt: article.publishedAt,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
            }));
    }
}
