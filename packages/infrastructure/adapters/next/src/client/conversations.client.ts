import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { 
    ConversationDto, 
    ConversationDetailDto, 
    CreateConversationDto, 
    SendMessageDto,
    AssignConversationDto,
    TransferConversationDto,
    WaitingConversationsDto
} from '@workspace/application/dtos';

export class ConversationsClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
    }

    private static instance: ConversationsClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (ConversationsClient.instance) {
            throw new Error('ConversationsClient already initialized. Call configure() before first use.');
        }
        ConversationsClient.instance = new ConversationsClient(routesConfig);
    }

    static getInstance(): ConversationsClient {
        if (!ConversationsClient.instance) {
            ConversationsClient.instance = new ConversationsClient();
        }
        return ConversationsClient.instance;
    }

    static resetInstance(): void {
        ConversationsClient.instance = null;
    }

    async getUserConversations(): Promise<ConversationDto[]> {
        const routes = this.routesConfig.getConversationsRoutes();
        return this.get<ConversationDto[]>(routes.list);
    }

    async getConversationById(id: string): Promise<ConversationDetailDto> {
        const routes = this.routesConfig.getConversationsRoutes();
        return this.get<ConversationDetailDto>(routes.get.replace(':id', id));
    }

    async createConversation(data: CreateConversationDto): Promise<ConversationDto> {
        const routes = this.routesConfig.getConversationsRoutes();
        return this.post<ConversationDto>(routes.create, data);
    }

    async sendMessage(conversationId: string, data: Omit<SendMessageDto, 'conversationId'>): Promise<void> {
        const routes = this.routesConfig.getConversationsRoutes();
        await this.post(routes.sendMessage.replace(':id', conversationId), {
            ...data,
            conversationId,
        });
    }

    async getMessages(conversationId: string): Promise<ConversationDetailDto> {
        const routes = this.routesConfig.getConversationsRoutes();
        return this.get<ConversationDetailDto>(routes.getMessages.replace(':id', conversationId));
    }

    async assignConversation(conversationId: string, advisorId: string): Promise<void> {
        const routes = this.routesConfig.getConversationsRoutes();
        await this.post(routes.assign.replace(':id', conversationId), { advisorId });
    }

    async transferConversation(conversationId: string, data: Omit<TransferConversationDto, 'conversationId'>): Promise<void> {
        const routes = this.routesConfig.getConversationsRoutes();
        await this.post(routes.transfer.replace(':id', conversationId), {
            ...data,
            conversationId,
        });
    }

    async closeConversation(conversationId: string): Promise<void> {
        const routes = this.routesConfig.getConversationsRoutes();
        await this.post(routes.close.replace(':id', conversationId), {});
    }

    async getWaitingConversations(): Promise<WaitingConversationsDto> {
        const routes = this.routesConfig.getConversationsRoutes();
        return this.get<WaitingConversationsDto>(routes.waiting);
    }
}

export function getConversationsClient(): ConversationsClient {
    return ConversationsClient.getInstance();
}
