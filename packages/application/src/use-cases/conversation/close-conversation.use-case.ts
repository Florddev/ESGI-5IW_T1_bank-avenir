import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IConversationRepository } from '../../ports';
import { ConversationDto } from '../../dtos';
import { ConversationNotFoundError } from '@workspace/domain';

@UseCase()
export class CloseConversationUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}

  async execute(conversationId: string): Promise<ConversationDto> {
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError(conversationId);
    }

    conversation.close();
    const updatedConversation = await this.conversationRepository.update(conversation);

    return {
      id: updatedConversation.id,
      clientId: updatedConversation.clientId,
      advisorId: updatedConversation.advisorId,
      status: updatedConversation.status,
      createdAt: updatedConversation.createdAt,
      updatedAt: updatedConversation.updatedAt,
    };
  }
}
