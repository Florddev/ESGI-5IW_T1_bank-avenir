import type { AccountDto } from '@workspace/application/dtos';
import { formatCurrency, formatDate, formatIBAN } from '../formatters';
import { ACCOUNT_TYPE_LABELS } from '../constants';
import { toViewModels, getLabel } from '../utils';

export interface AccountViewModel {
  id: string;
  userId: string;
  iban: string;
  ibanFormatted: string;
  customName: string;
  type: string;
  typeLabel: string;
  balance: number;
  balanceFormatted: string;
  savingsRate?: number;
  savingsRateFormatted?: string;
  createdAt: Date;
  createdAtFormatted: string;
  updatedAt: Date;
  updatedAtFormatted: string;
}

export function toAccountViewModel(dto: AccountDto): AccountViewModel {
  return {
    id: dto.id,
    userId: dto.userId,
    iban: dto.iban,
    ibanFormatted: formatIBAN(dto.iban),
    customName: dto.customName,
    type: dto.type,
    typeLabel: getLabel(dto.type, ACCOUNT_TYPE_LABELS),
    balance: dto.balance,
    balanceFormatted: formatCurrency(dto.balance),
    savingsRate: dto.savingsRate,
    savingsRateFormatted: dto.savingsRate ? `${dto.savingsRate}%` : undefined,
    createdAt: dto.createdAt,
    createdAtFormatted: formatDate(dto.createdAt),
    updatedAt: dto.updatedAt,
    updatedAtFormatted: formatDate(dto.updatedAt),
  };
}

export function toAccountViewModels(dtos: AccountDto[]): AccountViewModel[] {
  return toViewModels(dtos, toAccountViewModel);
}
