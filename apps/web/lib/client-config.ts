import { RoutesConfigService, type RoutesConfig } from '@workspace/adapter-next/client/config/routes.config';
import { AuthClient } from '@workspace/adapter-next/client/auth.client';
import { AccountsClient } from '@workspace/adapter-next/client/accounts.client';
import { TransactionsClient } from '@workspace/adapter-next/client/transactions.client';
import { LoansClient } from '@workspace/adapter-next/client/loans.client';
import { StocksClient } from '@workspace/adapter-next/client/stocks.client';
import { NotificationsClient } from '@workspace/adapter-next/client/notifications.client';
import { ConversationsClient } from '@workspace/adapter-next/client/conversations.client';

export function configureClients(customRoutes?: Partial<RoutesConfig>) {
    RoutesConfigService.configureShared(customRoutes);
    
    const sharedConfig = RoutesConfigService.getShared();

    AuthClient.configure(sharedConfig);
    AccountsClient.configure(sharedConfig);
    TransactionsClient.configure(sharedConfig);
    LoansClient.configure(sharedConfig);
    StocksClient.configure(sharedConfig);
    NotificationsClient.configure(sharedConfig);
    ConversationsClient.configure(sharedConfig);
}

