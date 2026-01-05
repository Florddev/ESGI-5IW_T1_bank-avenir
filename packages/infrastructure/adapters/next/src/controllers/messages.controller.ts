import { container } from '@workspace/shared/di';
import {
  SendRealtimeMessageUseCase,
  NotifyTypingUseCase,
} from '@workspace/application/use-cases';

export class MessagesController {
  async sendRealtimeMessage(
    conversationId: string,
    senderId: string,
    recipientId: string,
    content: string
  ) {
    const useCase = container.resolve(SendRealtimeMessageUseCase);
    return await useCase.execute({
      conversationId,
      senderId,
      recipientId,
      content,
    });
  }

  async notifyTyping(
    conversationId: string,
    userId: string,
    recipientId: string,
    isTyping: boolean
  ) {
    const useCase = container.resolve(NotifyTypingUseCase);
    return await useCase.execute({
      conversationId,
      userId,
      recipientId,
      isTyping,
    });
  }
}
