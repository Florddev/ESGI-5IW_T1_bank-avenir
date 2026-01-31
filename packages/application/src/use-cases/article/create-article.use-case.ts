import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import type { IArticleRepository, IRealtimeService } from '../../ports';
import { Article } from '@workspace/domain/entities';
import type { ArticleDto } from '../../dtos';

@UseCase()
export class CreateArticleUseCase {
    constructor(
        @Inject(TOKENS.IArticleRepository)
        private readonly articleRepository: IArticleRepository,
        @Inject(TOKENS.IRealtimeService)
        private readonly realtimeService: IRealtimeService
    ) {}

    async execute(authorId: string, authorName: string, title: string, content: string): Promise<ArticleDto> {
        const article = Article.create(authorId, authorName, title, content);
        const saved = await this.articleRepository.save(article);

        const dto: ArticleDto = {
            id: saved.id,
            title: saved.title,
            content: saved.content,
            authorId: saved.authorId,
            authorName: saved.authorName,
            publishedAt: saved.publishedAt,
            createdAt: saved.createdAt,
            updatedAt: saved.updatedAt,
        };

        await this.realtimeService.broadcastEvent('article_new', dto);

        return dto;
    }
}
