import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfigService, getRoute } from '../config/routes.config';

@ApiClient()
export class MessagesClient extends BaseClient {
    private routes: ReturnType<RoutesConfigService['getMessagesRoutes']>;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routes = routesConfig?.getMessagesRoutes();
    }

    async sendMessage(conversationId: string, senderId: string, recipientId: string, content: string): Promise<any> {
        const route = getRoute(this.routes?.send, '/api/messages/send');
        return this.post<any>(route, {
            conversationId,
            senderId,
            recipientId,
            content,
        });
    }

    async notifyTyping(conversationId: string, userId: string, recipientId: string, isTyping: boolean): Promise<any> {
        const route = getRoute(this.routes?.typing, '/api/messages/typing');
        return this.post<any>(route, {
            conversationId,
            userId,
            recipientId,
            isTyping,
        });
    }
}

export function getMessagesClient(): MessagesClient {
    return MessagesClient.getInstance();
}
