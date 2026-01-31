import { Repository, TOKENS } from '@workspace/shared/di';
import type { IArticleRepository } from '@workspace/application/ports';
import { Article } from '@workspace/domain/entities';

@Repository(TOKENS.IArticleRepository)
export class InMemoryArticleRepository implements IArticleRepository {
    private articles: Map<string, Article> = new Map();

    async findById(id: string): Promise<Article | null> {
        return this.articles.get(id) || null;
    }

    async findAll(): Promise<Article[]> {
        return Array.from(this.articles.values())
            .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }

    async save(article: Article): Promise<Article> {
        this.articles.set(article.id, article);
        return article;
    }

    async delete(id: string): Promise<void> {
        this.articles.delete(id);
    }
}
