export interface RoutesConfig {
    auth: {
        register: string;
        login: string;
        logout: string;
        confirmAccount: string;
        me: string;
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
};

export class RoutesConfigService {
    constructor(private config: RoutesConfig = defaultRoutes) {}

    getRoutes(): RoutesConfig {
        return this.config;
    }

    getAuthRoutes() {
        return this.config.auth;
    }
}
