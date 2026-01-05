import { BaseClient, ApiClient } from '@workspace/adapter-common/client';
import { RoutesConfig, RoutesConfigService, getRoute } from '../config/routes.config';
import type { LoanDto, CreateLoanDto } from '@workspace/application/dtos';

@ApiClient()
export class LoansClient extends BaseClient {
    private routesConfig: RoutesConfigService;
    private routes: RoutesConfig['loans'] | undefined;

    constructor(routesConfig?: RoutesConfigService) {
        super();
        this.routesConfig = routesConfig || RoutesConfigService.getShared();
        this.routes = this.routesConfig.getLoansRoutes();
    }

    async getUserLoans(userId: string): Promise<LoanDto[]> {
        const route = getRoute(this.routes?.userLoans, '/api/loans/user/:userId');
        return this.get<LoanDto[]>(route.replace(':userId', userId));
    }

    async getClientLoans(clientId: string): Promise<LoanDto[]> {
        const route = getRoute(this.routes?.clientLoans, '/api/loans/client/:clientId');
        return this.get<LoanDto[]>(route.replace(':clientId', clientId));
    }

    async getAdvisorLoans(advisorId: string): Promise<LoanDto[]> {
        const route = getRoute(this.routes?.advisorLoans, '/api/loans/advisor/:advisorId');
        return this.get<LoanDto[]>(route.replace(':advisorId', advisorId));
    }

    async createLoan(data: CreateLoanDto): Promise<LoanDto> {
        return this.post<LoanDto>(
            getRoute(this.routes?.create, '/api/loans'),
            data
        );
    }

    async processPayment(loanId: string): Promise<{ message: string }> {
        const route = getRoute(this.routes?.payment, '/api/loans/:id/payment');
        return this.post<{ message: string }>(route.replace(':id', loanId));
    }

    async markDefaulted(loanId: string): Promise<LoanDto> {
        const route = getRoute(this.routes?.markDefault, '/api/loans/:id/default');
        return this.post<LoanDto>(route.replace(':id', loanId));
    }
}

export function getLoansClient(): LoansClient {
    return LoansClient.getInstance();
}
