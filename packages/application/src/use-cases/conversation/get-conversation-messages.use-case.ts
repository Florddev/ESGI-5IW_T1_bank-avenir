import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IConversationRepository, IMessageRepository, IUserRepository } from '../../ports';
import type { ConversationDetailDto, MessageDto } from '../../dtos';

@UseCase()
export class GetConversationMessagesUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository,
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(conversationId: string): Promise<ConversationDetailDto> {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const messages = await this.messageRepository.findByConversationId(conversationId);
    
    const enrichedMessages: MessageDto[] = await Promise.all(
      messages.map(async (message) => {
        const author = await this.userRepository.findById(message.senderId);
        return {
          id: message.id,
          conversationId: message.conversationId,
          authorId: message.senderId,
          authorName: author ? `${author.firstName} ${author.lastName}` : 'Unknown',
          content: message.content,
          isRead: message.isRead,
          createdAt: message.createdAt,
        };
      })
    );

    const client = await this.userRepository.findById(conversation.clientId);
    const advisor = conversation.advisorId
      ? await this.userRepository.findById(conversation.advisorId)
      : null;

    return {
      id: conversation.id,
      subject: conversation.subject,
      clientId: conversation.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
      advisorId: conversation.advisorId,
      advisorName: advisor ? `${advisor.firstName} ${advisor.lastName}` : undefined,
      status: conversation.status,
      messages: enrichedMessages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}
