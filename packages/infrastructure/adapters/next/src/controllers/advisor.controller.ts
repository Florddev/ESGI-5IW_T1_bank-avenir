import { container } from '@workspace/shared/di';
import { GetAdvisorClientsUseCase, SendAdvisorNotificationUseCase } from '@workspace/application/use-cases';

export class AdvisorController {
  async getClients(advisorId: string) {
    const useCase = container.resolve(GetAdvisorClientsUseCase);
    return await useCase.execute(advisorId);
  }

  async notifyClients(advisorId: string, title: string, message: string) {
    const useCase = container.resolve(SendAdvisorNotificationUseCase);
    return await useCase.execute(advisorId, title, message);
  }
}
