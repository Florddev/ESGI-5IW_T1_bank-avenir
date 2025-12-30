import { RoutesConfigService, type RoutesConfig } from './routes.config';
import { getRegisteredClients } from '../decorators';
import '../api';

export function configureClients(customRoutes?: Partial<RoutesConfig>): void {
    if (customRoutes) {
        RoutesConfigService.configureShared(customRoutes);
    }
    
    const sharedConfig = RoutesConfigService.getShared();

    const clients = getRegisteredClients();
    
    for (const ClientClass of clients) {
        (ClientClass as any).getInstance(sharedConfig);
    }
}
