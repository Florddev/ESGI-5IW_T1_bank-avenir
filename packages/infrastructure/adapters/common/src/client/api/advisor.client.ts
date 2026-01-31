import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import type { AdvisorClientDto } from '@workspace/application/use-cases';

@ApiClient()
export class AdvisorClient extends BaseClient {
    async getClients(): Promise<AdvisorClientDto[]> {
        return this.get<AdvisorClientDto[]>('/api/advisor/clients');
    }

    async notifyClients(data: { title: string; message: string }): Promise<{ notifiedCount: number }> {
        return this.post<{ notifiedCount: number }>('/api/advisor/notifications', data);
    }
}

export function getAdvisorClient(): AdvisorClient {
    return AdvisorClient.getInstance();
}
