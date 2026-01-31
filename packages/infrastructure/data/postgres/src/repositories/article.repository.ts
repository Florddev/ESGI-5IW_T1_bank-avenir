import { eq, desc } from 'drizzle-orm';
import { Repository, TOKENS } from '@workspace/shared/di';
import type { IArticleRepository } from '@workspace/application/ports';
import { Article } from '@workspace/domain/entities';
import { getDatabase } from '../database';
import { articles } from '../schema';

@Repository(TOKENS.IArticleRepository)
export class PostgresArticleRepository implements IArticleRepository {
    private get db() {
        return getDatabase();
    }

    async findById(id: string): Promise<Article | null> {
        const result = await this.db.select().from(articles).where(eq(articles.id, id)).limit(1);
        if (result.length === 0) return null;
        return this.rowToEntity(result[0]!);
    }

    async findAll(): Promise<Article[]> {
        const result = await this.db.select().from(articles).orderBy(desc(articles.publishedAt));
        return result.map((row) => this.rowToEntity(row));
    }

    async save(article: Article): Promise<Article> {
        const values = {
            id: article.id,
            title: article.title,
            content: article.content,
            authorId: article.authorId,
            authorName: article.authorName,
            publishedAt: article.publishedAt,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
        };

        await this.db
            .insert(articles)
            .values(values)
            .onConflictDoUpdate({
                target: articles.id,
                set: values,
            });

        return article;
    }

    async delete(id: string): Promise<void> {
        await this.db.delete(articles).where(eq(articles.id, id));
    }

    private rowToEntity(row: typeof articles.$inferSelect): Article {
        return Article.fromPersistence({
            id: row.id,
            title: row.title,
            content: row.content,
            authorId: row.authorId,
            authorName: row.authorName,
            publishedAt: row.publishedAt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }
}
