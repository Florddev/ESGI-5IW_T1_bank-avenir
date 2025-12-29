import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { AuthResponseDto } from '@workspace/application/dtos';

export interface RegisterInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface ConfirmAccountInput {
    token: string;
}

export class AuthClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || new RoutesConfigService();
    }

    private static instance: AuthClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (AuthClient.instance) {
            throw new Error('AuthClient already initialized. Call configure() before first use.');
        }
        AuthClient.instance = new AuthClient(routesConfig);
    }

    static getInstance(): AuthClient {
        if (!AuthClient.instance) {
            AuthClient.instance = new AuthClient();
        }
        return AuthClient.instance;
    }

    static resetInstance(): void {
        AuthClient.instance = null;
    }

    async register(data: RegisterInput): Promise<{ message: string }> {
        const routes = this.routesConfig.getAuthRoutes();
        return this.post<{ message: string }>(routes.register, data);
    }

    async login(data: LoginInput): Promise<AuthResponseDto> {
        const routes = this.routesConfig.getAuthRoutes();
        return this.post<AuthResponseDto>(routes.login, data);
    }

    async confirmAccount(data: ConfirmAccountInput): Promise<{ message: string }> {
        const routes = this.routesConfig.getAuthRoutes();
        return this.post<{ message: string }>(routes.confirmAccount, data);
    }

    async logout(): Promise<{ message: string }> {
        const routes = this.routesConfig.getAuthRoutes();
        return this.post<{ message: string }>(routes.logout);
    }

    async getCurrentUser(): Promise<AuthResponseDto> {
        const routes = this.routesConfig.getAuthRoutes();
        return this.get<AuthResponseDto>(routes.me);
    }
}

export function getAuthClient(): AuthClient {
    return AuthClient.getInstance();
}
