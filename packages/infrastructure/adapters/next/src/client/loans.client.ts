import { BaseClient } from './base.client';
import { RoutesConfigService } from './config/routes.config';
import type { LoanDto, CreateLoanDto } from '@workspace/application/dtos';

export class LoansClient extends BaseClient {
    private routesConfig: RoutesConfigService;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
    }

    private static instance: LoansClient | null = null;

    static configure(routesConfig?: RoutesConfigService): void {
        if (LoansClient.instance) {
            throw new Error('LoansClient already initialized. Call configure() before first use.');
        }
        LoansClient.instance = new LoansClient(routesConfig);
    }

    static getInstance(): LoansClient {
        if (!LoansClient.instance) {
            LoansClient.instance = new LoansClient();
        }
        return LoansClient.instance;
    }

    static resetInstance(): void {
        LoansClient.instance = null;
    }

    async getUserLoans(userId: string): Promise<LoanDto[]> {
        const routes = this.routesConfig.getLoansRoutes();
        return this.get<LoanDto[]>(routes.userLoans.replace(':userId', userId));
    }

    async getClientLoans(clientId: string): Promise<LoanDto[]> {
        const routes = this.routesConfig.getLoansRoutes();
        return this.get<LoanDto[]>(routes.clientLoans.replace(':clientId', clientId));
    }

    async getAdvisorLoans(advisorId: string): Promise<LoanDto[]> {
        const routes = this.routesConfig.getLoansRoutes();
        return this.get<LoanDto[]>(routes.advisorLoans.replace(':advisorId', advisorId));
    }

    async createLoan(data: CreateLoanDto): Promise<LoanDto> {
        const routes = this.routesConfig.getLoansRoutes();
        return this.post<LoanDto>(routes.create, data);
    }

    async processPayment(loanId: string): Promise<{ message: string }> {
        const routes = this.routesConfig.getLoansRoutes();
        return this.post<{ message: string }>(routes.payment.replace(':id', loanId));
    }

    async markDefaulted(loanId: string): Promise<LoanDto> {
        const routes = this.routesConfig.getLoansRoutes();
        return this.post<LoanDto>(routes.markDefault.replace(':id', loanId));
    }
}

export function getLoansClient(): LoansClient {
    return LoansClient.getInstance();
}
