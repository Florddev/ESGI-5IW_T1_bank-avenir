import type { TransactionDto } from '@workspace/application/dtos';
import { formatCurrency, formatDateTime } from '../formatters';
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_COLORS,
} from '../constants';
import { toViewModels, getLabel, getColor } from '../utils';

export interface TransactionViewModel {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  amountFormatted: string;
  type: string;
  typeLabel: string;
  status: string;
  statusLabel: string;
  statusColor: 'success' | 'warning' | 'error' | 'default';
  description?: string;
  createdAt: Date;
  createdAtFormatted: string;
  updatedAt: Date;
  updatedAtFormatted: string;
}

const TYPE_LABELS: Record<string, string> = {
  TRANSFER: 'Virement',
  DEPOSIT: 'Dépôt',
  WITHDRAWAL: 'Retrait',
  LOAN_DISBURSEMENT: 'Décaissement prêt',
  LOAN_PAYMENT: 'Remboursement prêt',
  STOCK_PURCHASE: 'Achat action',
  STOCK_SALE: 'Vente action',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  COMPLETED: 'Complété',
  FAILED: 'Échoué',
  CANCELLED: 'Annulé',
};

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'error',
  CANCELLED: 'default',
};

export function toTransactionViewModel(dto: TransactionDto): TransactionViewModel {
  return {
    id: dto.id,
    fromAccountId: dto.fromAccountId,
    toAccountId: dto.toAccountId,
    amount: dto.amount,
    amountFormatted: formatCurrency(dto.amount),
    type: dto.type,
    typeLabel: TYPE_LABELS[dto.type] || dto.type,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status] || dto.status,
    statusColor: STATUS_COLORS[dto.status] || 'default',
    description: dto.description,
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
    updatedAt: dto.updatedAt,
    updatedAtFormatted: formatDateTime(dto.updatedAt),
  };
}

export function toTransactionViewModels(dtos: TransactionDto[]): TransactionViewModel[] {
  return toViewModels(dtos, toTransactionViewModel);
}
