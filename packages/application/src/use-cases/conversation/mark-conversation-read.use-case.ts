import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IMessageRepository } from '@workspace/application/ports/repositories';

@UseCase()
export class MarkConversationReadUseCase {
  constructor(
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository
  ) {}

  async execute(conversationId: string): Promise<void> {
    await this.messageRepository.markAllAsRead(conversationId);
  }
}
