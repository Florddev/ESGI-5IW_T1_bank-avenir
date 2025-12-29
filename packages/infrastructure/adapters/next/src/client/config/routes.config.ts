export interface RoutesConfig {
    auth: {
        register: string;
        login: string;
        logout: string;
        confirmAccount: string;
        me: string;
    };
    accounts: {
        list: string;
        get: string;
        create: string;
        updateName: string;
        delete: string;
    };
    transactions: {
        list: string;
        deposit: string;
        withdraw: string;
        transfer: string;
    };
    loans: {
        userLoans: string;
        clientLoans: string;
        advisorLoans: string;
        create: string;
        payment: string;
        markDefault: string;
    };
    stocks: {
        list: string;
        get: string;
        portfolio: string;
        buy: string;
        sell: string;
    };
    notifications: {
        list: string;
        markAsRead: string;
    };
    conversations: {
        list: string;
        get: string;
        create: string;
        sendMessage: string;
        getMessages: string;
        assign: string;
        transfer: string;
        close: string;
        waiting: string;
    };
}

export const defaultRoutes: RoutesConfig = {
    auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        confirmAccount: '/api/auth/confirm',
        me: '/api/auth/me',
    },
    accounts: {
        list: '/api/accounts',
        get: '/api/accounts/:id',
        create: '/api/accounts',
        updateName: '/api/accounts/:id/name',
        delete: '/api/accounts/:id',
    },
    transactions: {
        list: '/api/transactions/account/:accountId',
        deposit: '/api/transactions/deposit',
        withdraw: '/api/transactions/withdraw',
        transfer: '/api/transactions/transfer',
    },
    loans: {
        userLoans: '/api/loans/user/:userId',
        clientLoans: '/api/loans/client/:clientId',
        advisorLoans: '/api/loans/advisor/:advisorId',
        create: '/api/loans',
        payment: '/api/loans/:id/payment',
        markDefault: '/api/loans/:id/default',
    },
    stocks: {
        list: '/api/stocks',
        get: '/api/stocks/:id',
        portfolio: '/api/stocks/portfolio/:userId',
        buy: '/api/stocks/:id/buy',
        sell: '/api/stocks/:id/sell',
    },
    notifications: {
        list: '/api/notifications',
        markAsRead: '/api/notifications/:id/read',
    },
    conversations: {
        list: '/api/conversations',
        get: '/api/conversations/:id',
        create: '/api/conversations',
        sendMessage: '/api/conversations/:id/messages',
        getMessages: '/api/conversations/:id/messages',
        assign: '/api/conversations/:id/assign',
        transfer: '/api/conversations/:id/transfer',
        close: '/api/conversations/:id/close',
        waiting: '/api/conversations/waiting',
    },
};

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target } as T;
    
    for (const key in source) {
        if (source[key] !== undefined) {
            if (typeof source[key] === 'object' && !Array.isArray(source[key]) && source[key] !== null) {
                result[key] = deepMerge((result[key] || {}) as any, source[key] as any) as T[Extract<keyof T, string>];
            } else {
                result[key] = source[key] as T[Extract<keyof T, string>];
            }
        }
    }
    
    return result;
}

export class RoutesConfigService {
    private static sharedInstance: RoutesConfigService | null = null;

    constructor(private config: RoutesConfig = defaultRoutes) {}

    static configureShared(customRoutes?: Partial<RoutesConfig>): void {
        const mergedConfig = customRoutes ? deepMerge(defaultRoutes, customRoutes) : defaultRoutes;
        RoutesConfigService.sharedInstance = new RoutesConfigService(mergedConfig);
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

    getRoutes(): RoutesConfig {
        return this.config;
    }

    getAuthRoutes() {
        return this.config.auth;
    }

    getAccountsRoutes() {
        return this.config.accounts;
    }

    getTransactionsRoutes() {
        return this.config.transactions;
    }

    getLoansRoutes() {
        return this.config.loans;
    }

    getStocksRoutes() {
        return this.config.stocks;
    }

    getNotificationsRoutes() {
        return this.config.notifications;
    }

    getConversationsRoutes() {
        return this.config.conversations;
    }
}
