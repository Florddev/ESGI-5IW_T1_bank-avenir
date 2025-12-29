import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { Conversation, Message } from '@workspace/domain';
import { IConversationRepository, IMessageRepository, IUserRepository } from '../../ports';
import { ConversationDto } from '../../dtos';

@UseCase()
export class CreateConversationUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository,
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(clientId: string, subject: string, firstMessage: string): Promise<ConversationDto> {
    const conversation = Conversation.create(clientId, subject);
    const savedConversation = await this.conversationRepository.save(conversation);

    const message = Message.create(conversation.id, clientId, firstMessage);
    await this.messageRepository.save(message);

    const client = await this.userRepository.findById(clientId);

    return {
      id: savedConversation.id,
      subject: savedConversation.subject,
      clientId: savedConversation.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
      advisorId: savedConversation.advisorId,
      status: savedConversation.status,
      lastMessage: firstMessage,
      lastMessageAt: message.createdAt,
      unreadCount: 0,
      createdAt: savedConversation.createdAt,
      updatedAt: savedConversation.updatedAt,
    };
  }
}
