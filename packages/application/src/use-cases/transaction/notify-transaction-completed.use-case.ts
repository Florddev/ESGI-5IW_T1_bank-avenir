import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@workspace/shared/di';
import type { IRealtimeService } from '../../ports';
import type { RealtimeTransactionDto } from '../../dtos';

export interface NotifyTransactionCompletedInput {
    transactionId: string;
    accountId: string;
    userId: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
}

@injectable()
export class NotifyTransactionCompletedUseCase {
    constructor(
        @inject(TOKENS.IRealtimeService)
        private realtimeService: IRealtimeService
    ) {}

    async execute(input: NotifyTransactionCompletedInput): Promise<void> {
        const transactionDto: RealtimeTransactionDto = {
            id: input.transactionId,
            accountId: input.accountId,
            amount: input.amount,
            type: input.type,
            status: 'COMPLETED',
            createdAt: new Date().toISOString(),
        };

        await this.realtimeService.sendEventToUser(
            input.userId,
            'transaction_completed',
            transactionDto
        );

        console.log(`[UseCase] Transaction ${input.transactionId} notifiée à ${input.userId}`);
    }
}
