import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IConversationRepository, IMessageRepository, IUserRepository } from '../../ports';
import { ConversationDto } from '../../dtos';

@UseCase()
export class GetUserConversationsUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository,
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<ConversationDto[]> {
    const conversations = await this.conversationRepository.findByUserId(userId);

    const enrichedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const client = await this.userRepository.findById(conversation.clientId);
        const advisor = conversation.advisorId
          ? await this.userRepository.findById(conversation.advisorId)
          : null;
        
        const messages = await this.messageRepository.findByConversationId(conversation.id);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        const unreadMessages = await this.messageRepository.findUnreadByConversationId(
          conversation.id,
          userId
        );

        return {
          id: conversation.id,
          subject: conversation.subject,
          clientId: conversation.clientId,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
          advisorId: conversation.advisorId,
          advisorName: advisor ? `${advisor.firstName} ${advisor.lastName}` : undefined,
          status: conversation.status,
          lastMessage: lastMessage?.content,
          lastMessageAt: lastMessage?.createdAt,
          unreadCount: unreadMessages.length,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt,
        };
      })
    );

    return enrichedConversations;
  }
}
