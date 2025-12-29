import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Message } from '@workspace/domain';
import { IMessageRepository } from '../../ports';
import { MessageDto } from '../../dtos';

@UseCase()
export class SendMessageUseCase {
  constructor(
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository
  ) {}

  async execute(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<MessageDto> {
    const message = Message.create(conversationId, senderId, content);

    const savedMessage = await this.messageRepository.save(message);

    return {
      id: savedMessage.id,
      conversationId: savedMessage.conversationId,
      senderId: savedMessage.senderId,
      content: savedMessage.content,
      isRead: savedMessage.isRead,
      createdAt: savedMessage.createdAt,
    };
  }
}
