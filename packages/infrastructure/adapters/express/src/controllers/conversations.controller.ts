import { container } from 'tsyringe';
import {
  CreateConversationUseCase,
  GetUserConversationsUseCase,
  SendMessageUseCase,
  GetConversationMessagesUseCase,
  AssignConversationUseCase,
  TransferConversationUseCase,
  CloseConversationUseCase,
  GetWaitingConversationsUseCase,
} from '@workspace/application/use-cases';

export class ConversationsController {
  async createConversation(clientId: string, subject: string, firstMessage: string) {
    const useCase = container.resolve(CreateConversationUseCase);
    return await useCase.execute(clientId, subject, firstMessage);
  }

  async getUserConversations(userId: string) {
    const useCase = container.resolve(GetUserConversationsUseCase);
    return await useCase.execute(userId);
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const useCase = container.resolve(SendMessageUseCase);
    return await useCase.execute(conversationId, senderId, content);
  }

  async getMessages(conversationId: string) {
    const useCase = container.resolve(GetConversationMessagesUseCase);
    return await useCase.execute(conversationId);
  }

  async assignConversation(conversationId: string, advisorId: string) {
    const useCase = container.resolve(AssignConversationUseCase);
    return await useCase.execute(conversationId, advisorId);
  }

  async transferConversation(conversationId: string, newAdvisorId: string) {
    const useCase = container.resolve(TransferConversationUseCase);
    return await useCase.execute(conversationId, newAdvisorId);
  }

  async closeConversation(conversationId: string) {
    const useCase = container.resolve(CloseConversationUseCase);
    return await useCase.execute(conversationId);
  }

  async getWaitingConversations() {
    const useCase = container.resolve(GetWaitingConversationsUseCase);
    return await useCase.execute();
  }
}
