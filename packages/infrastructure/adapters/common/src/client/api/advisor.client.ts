import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import type { AdvisorClientDto } from '@workspace/application/use-cases';

@ApiClient()
export class AdvisorClient extends BaseClient {
    async getClients(): Promise<AdvisorClientDto[]> {
        return this.get<AdvisorClientDto[]>('/api/advisor/clients');
    }
}

export function getAdvisorClient(): AdvisorClient {
    return AdvisorClient.getInstance();
}
