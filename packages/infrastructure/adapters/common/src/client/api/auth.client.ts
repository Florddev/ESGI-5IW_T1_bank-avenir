import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfig, RoutesConfigService, getRoute } from '../config/routes.config';
import type { 
    AuthResponseDto, 
    RegisterUserDto, 
    LoginDto, 
    ConfirmAccountDto 
} from '@workspace/application/dtos';

@ApiClient()
export class AuthClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: RoutesConfig['auth'] | undefined;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || new RoutesConfigService();
        this.routes = this.routesConfig.getAuthRoutes();
    }

    async register(data: RegisterUserDto): Promise<{ message: string }> {
        return this.post<{ message: string }>(
            getRoute(this.routes?.register, '/api/auth/register'),
            data
        );
    }

    async login(data: LoginDto): Promise<AuthResponseDto> {
        return this.post<AuthResponseDto>(
            getRoute(this.routes?.login, '/api/auth/login'),
            data
        );
    }

    async confirmAccount(data: ConfirmAccountDto): Promise<{ message: string }> {
        return this.post<{ message: string }>(
            getRoute(this.routes?.confirmAccount, '/api/auth/confirm'),
            data
        );
    }

    async logout(): Promise<{ message: string }> {
        return this.post<{ message: string }>(
            getRoute(this.routes?.logout, '/api/auth/logout')
        );
    }

    async getCurrentUser(): Promise<AuthResponseDto> {
        return this.get<AuthResponseDto>(
            getRoute(this.routes?.me, '/api/auth/me')
        );
    }
}

export function getAuthClient(): AuthClient {
    return AuthClient.getInstance();
}
