import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfig, RoutesConfigService, getRoute } from '../config/routes.config';
import type { 
    ConversationDto, 
    ConversationDetailDto, 
    CreateConversationDto, 
    SendMessageDto,
    TransferConversationDto,
    WaitingConversationsDto
} from '@workspace/application/dtos';

@ApiClient()
export class ConversationsClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: RoutesConfig['conversations'] | undefined;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getConversationsRoutes();
    }

    async getUserConversations(): Promise<ConversationDto[]> {
        return this.get<ConversationDto[]>(getRoute(this.routes?.list, '/api/conversations'));
    }

    async getConversationById(id: string): Promise<ConversationDetailDto> {
        const route = getRoute(this.routes?.get, '/api/conversations/:id');
        return this.get<ConversationDetailDto>(route.replace(':id', id));
    }

    async createConversation(data: CreateConversationDto): Promise<ConversationDto> {
        return this.post<ConversationDto>(
            getRoute(this.routes?.create, '/api/conversations'),
            data
        );
    }

    async sendMessage(conversationId: string, data: Omit<SendMessageDto, 'conversationId'>): Promise<void> {
        const route = getRoute(this.routes?.sendMessage, '/api/conversations/:id/messages');
        await this.post(route.replace(':id', conversationId), {
            ...data,
            conversationId,
        });
    }

    async getMessages(conversationId: string): Promise<ConversationDetailDto> {
        const route = getRoute(this.routes?.getMessages, '/api/conversations/:id/messages');
        return this.get<ConversationDetailDto>(route.replace(':id', conversationId));
    }

    async assignConversation(conversationId: string, advisorId: string): Promise<void> {
        const route = getRoute(this.routes?.assign, '/api/conversations/:id/assign');
        await this.post(route.replace(':id', conversationId), { advisorId });
    }

    async transferConversation(conversationId: string, data: Omit<TransferConversationDto, 'conversationId'>): Promise<void> {
        const route = getRoute(this.routes?.transfer, '/api/conversations/:id/transfer');
        await this.post(route.replace(':id', conversationId), {
            ...data,
            conversationId,
        });
    }

    async closeConversation(conversationId: string): Promise<void> {
        const route = getRoute(this.routes?.close, '/api/conversations/:id/close');
        await this.post(route.replace(':id', conversationId), {});
    }

    async getWaitingConversations(): Promise<WaitingConversationsDto> {
        return this.get<WaitingConversationsDto>(getRoute(this.routes?.waiting, '/api/conversations/waiting'));
    }

    async markConversationRead(conversationId: string): Promise<void> {
        const route = getRoute(this.routes?.markRead, '/api/conversations/:id/read');
        await this.post(route.replace(':id', conversationId), {});
    }
}

export function getConversationsClient(): ConversationsClient {
    return ConversationsClient.getInstance();
}
