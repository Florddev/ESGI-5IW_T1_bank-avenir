import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import { IConversationRepository, IUserRepository } from '../../ports';
import { ConversationDto } from '../../dtos';
import { ConversationNotFoundError } from '@workspace/domain';

@UseCase()
export class AssignConversationUseCase {
  constructor(
    @Inject(TOKENS.IConversationRepository)
    private conversationRepository: IConversationRepository,
    @Inject(TOKENS.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async execute(conversationId: string, advisorId: string): Promise<ConversationDto> {
    const conversation = await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError(conversationId);
    }

    conversation.assignToAdvisor(advisorId);
    const updatedConversation = await this.conversationRepository.update(conversation);

    const client = await this.userRepository.findById(updatedConversation.clientId);
    const advisor = await this.userRepository.findById(advisorId);

    return {
      id: updatedConversation.id,
      subject: updatedConversation.subject,
      clientId: updatedConversation.clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
      advisorId: updatedConversation.advisorId,
      advisorName: advisor ? `${advisor.firstName} ${advisor.lastName}` : undefined,
      status: updatedConversation.status,
      unreadCount: 0,
      createdAt: updatedConversation.createdAt,
      updatedAt: updatedConversation.updatedAt,
    };
  }
}
