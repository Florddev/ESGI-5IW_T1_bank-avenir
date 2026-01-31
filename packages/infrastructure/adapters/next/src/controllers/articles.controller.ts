import { container, TOKENS } from '@workspace/shared/di';
import { GetArticlesUseCase, CreateArticleUseCase } from '@workspace/application/use-cases';
import type { IUserRepository } from '@workspace/application/ports';

export class ArticlesController {
  async getArticles() {
    const useCase = container.resolve(GetArticlesUseCase);
    return await useCase.execute();
  }

  async createArticle(authorId: string, title: string, content: string) {
    const userRepository = container.resolve<IUserRepository>(TOKENS.IUserRepository);
    const user = await userRepository.findById(authorId);
    const authorName = user ? `${user.firstName} ${user.lastName}` : 'Conseiller';

    const useCase = container.resolve(CreateArticleUseCase);
    return await useCase.execute(authorId, authorName, title, content);
  }
}
