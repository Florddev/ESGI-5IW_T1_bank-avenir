export interface CreateTransferDto {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
}

export interface TransactionDto {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: string;
    status: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionHistoryDto {
    transactions: TransactionDto[];
    total: number;
}
