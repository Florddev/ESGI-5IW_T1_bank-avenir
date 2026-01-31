import { Article } from '@workspace/domain/entities';

export interface IArticleRepository {
    findById(id: string): Promise<Article | null>;
    findAll(): Promise<Article[]>;
    save(article: Article): Promise<Article>;
    delete(id: string): Promise<void>;
}
