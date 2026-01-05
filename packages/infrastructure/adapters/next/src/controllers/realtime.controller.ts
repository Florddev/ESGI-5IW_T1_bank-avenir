import { container, TOKENS } from '@workspace/shared/di';
import { SendRealtimeNotificationUseCase } from '@workspace/application/use-cases';
import { IRealtimeService } from '@workspace/application/ports';

export class RealtimeController {
  async sendNotification(
    userId: string,
    type: string,
    title: string,
    message: string
  ) {
    const useCase = container.resolve(SendRealtimeNotificationUseCase);
    return await useCase.execute({
      userId,
      type,
      title,
      message,
    });
  }

  async getStats(userId?: string) {
    const realtimeService = container.resolve<IRealtimeService>(TOKENS.IRealtimeService);
    
    if (userId) {
      const isConnected = realtimeService.isUserConnected(userId);
      const clientIds = realtimeService.getConnectedClients(userId);
      
      return {
        userId,
        isConnected,
        connectedClients: clientIds.length,
        clientIds,
      };
    }
    
    // Pour les stats globales, on devrait avoir une méthode getStats dans le service
    // Pour l'instant, retournons un objet basique
    return {
      message: 'Stats endpoint - needs implementation in service',
    };
  }

  getRealtimeService() {
    return container.resolve<IRealtimeService>(TOKENS.IRealtimeService);
  }
}
