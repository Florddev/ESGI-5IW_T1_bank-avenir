export interface CreateAccountDto {
    userId: string;
    customName: string;
    type: 'CHECKING' | 'SAVINGS';
}

export interface UpdateAccountNameDto {
    accountId: string;
    customName: string;
}

export interface DeleteAccountDto {
    accountId: string;
    userId: string;
}

export interface AccountDto {
    id: string;
    userId: string;
    iban: string;
    customName: string;
    type: string;
    balance: number;
    savingsRate?: number;
    createdAt: Date;
}

export interface AccountListDto {
    accounts: AccountDto[];
}
