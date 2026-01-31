import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IConversationRepository } from '../../ports';
import { Conversation } from '@workspace/domain/entities';

@UseCase()
export class GetOrCreateStaffGroupChatUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository
  ) {}

  async execute(): Promise<{ id: string }> {
    let conversation = await this.conversationRepository.findGroupChat();

    if (!conversation) {
      conversation = Conversation.createGroupChat('Staff Group Chat');
      await this.conversationRepository.save(conversation);
    }

    return { id: conversation.id };
  }
}
