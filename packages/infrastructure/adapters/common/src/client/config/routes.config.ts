export interface RoutesConfig {
    auth: {
        register: string | undefined;
        login: string | undefined;
        logout: string | undefined;
        confirmAccount: string | undefined;
        me: string | undefined;
    };
    accounts: {
        list: string | undefined;
        get: string | undefined;
        create: string | undefined;
        updateName: string | undefined;
        delete: string | undefined;
    };
    transactions: {
        list: string | undefined;
        deposit: string | undefined;
        withdraw: string | undefined;
        transfer: string | undefined;
    };
    loans: {
        userLoans: string | undefined;
        clientLoans: string | undefined;
        advisorLoans: string | undefined;
        create: string | undefined;
        payment: string | undefined;
        markDefault: string | undefined;
    };
    stocks: {
        list: string | undefined;
        get: string | undefined;
        portfolio: string | undefined;
        buy: string | undefined;
        sell: string | undefined;
    };
    notifications: {
        list: string | undefined;
        markAsRead: string | undefined;
    };
    conversations: {
        list: string | undefined;
        get: string | undefined;
        create: string | undefined;
        sendMessage: string | undefined;
        getMessages: string | undefined;
        assign: string | undefined;
        transfer: string | undefined;
        close: string | undefined;
        waiting: string | undefined;
    };
}

export function getRoute(customRoute: string | undefined, defaultRoute: string): string {
    return customRoute ?? defaultRoute;
}

export class RoutesConfigService {
    private static sharedInstance: RoutesConfigService | null = null;

    constructor(private config: Partial<RoutesConfig> = {}) {}

    static configureShared(customRoutes: Partial<RoutesConfig>): void {
        RoutesConfigService.sharedInstance = new RoutesConfigService(customRoutes);
    }

    static getShared(): RoutesConfigService {
        if (!RoutesConfigService.sharedInstance) {
            RoutesConfigService.sharedInstance = new RoutesConfigService();
        }
        return RoutesConfigService.sharedInstance;
    }

    static resetShared(): void {
        RoutesConfigService.sharedInstance = null;
    }

    getAllRoutes(): RoutesConfig | {} {
        return this.config || {};
    }

    getAuthRoutes(): RoutesConfig['auth'] | undefined {
        return this.config.auth;
    }

    getAccountsRoutes(): RoutesConfig['accounts'] | {} {
        return this.config.accounts || {};
    }

    getTransactionsRoutes(): RoutesConfig['transactions'] | {} {
        return this.config.transactions || {};
    }

    getLoansRoutes(): RoutesConfig['loans'] | {} {
        return this.config.loans || {};
    }

    getStocksRoutes(): RoutesConfig['stocks'] | {} {
        return this.config.stocks || {};
    }

    getNotificationsRoutes(): RoutesConfig['notifications'] | {} {
        return this.config.notifications || {};
    }

    getConversationsRoutes(): RoutesConfig['conversations'] | {} {
        return this.config.conversations || {};
    }
}
