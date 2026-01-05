import { container } from '@workspace/shared/di';
import { GetAdvisorClientsUseCase } from '@workspace/application/use-cases';

export class AdvisorController {
  async getClients(advisorId: string) {
    const useCase = container.resolve(GetAdvisorClientsUseCase);
    return await useCase.execute(advisorId);
  }
}
