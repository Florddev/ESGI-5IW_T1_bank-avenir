import { UseCase, Inject, TOKENS } from '@workspace/shared/di';
import { IRealtimeService } from '../../ports';

@UseCase()
export class GetRealtimeStatsUseCase {
    constructor(
        @Inject(TOKENS.IRealtimeService)
        private readonly realtimeService: IRealtimeService
    ) {}

    async execute(userId: string): Promise<{
        isConnected: boolean;
        connectedClients: number;
        clientIds: string[];
    }> {
        const isConnected = this.realtimeService.isUserConnected(userId);
        const clientIds = this.realtimeService.getConnectedClients(userId);

        return {
            isConnected,
            connectedClients: clientIds.length,
            clientIds,
        };
    }
}
