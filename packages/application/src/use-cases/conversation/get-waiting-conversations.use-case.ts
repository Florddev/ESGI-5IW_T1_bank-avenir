import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IConversationRepository, IMessageRepository, IUserRepository } from '../../ports';
import { WaitingConversationsDto, WaitingConversationDto } from '../../dtos';

@UseCase()
export class GetWaitingConversationsUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @Inject(TOKENS.IMessageRepository)
    private messageRepository: IMessageRepository,
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(): Promise<WaitingConversationsDto> {
    const conversations = await this.conversationRepository.findWaitingConversations();

    const enrichedConversations: WaitingConversationDto[] = await Promise.all(
      conversations.map(async (conversation) => {
        const client = await this.userRepository.findById(conversation.clientId);
        const messages = await this.messageRepository.findByConversationId(conversation.id);
        const firstMessage = messages.length > 0 ? messages[0] : null;

        return {
          id: conversation.id,
          subject: conversation.subject,
          clientId: conversation.clientId,
          clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
          firstMessage: firstMessage?.content || '',
          createdAt: conversation.createdAt,
        };
      })
    );

    return {
      conversations: enrichedConversations,
      count: enrichedConversations.length,
    };
  }
}
