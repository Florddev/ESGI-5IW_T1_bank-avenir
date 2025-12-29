import type { LoanDto } from '@workspace/application/dtos';
import { formatCurrency, formatDate, formatDuration } from '../formatters';
import { LOAN_STATUS_LABELS, LOAN_STATUS_COLORS } from '../constants';
import { toViewModels, getLabel, getColor } from '../utils';

export interface LoanViewModel {
  id: string;
  userId: string;
  advisorId: string;
  accountId: string;
  principal: number;
  principalFormatted: string;
  remainingPrincipal: number;
  remainingPrincipalFormatted: string;
  annualInterestRate: number;
  annualInterestRateFormatted: string;
  insuranceRate: number;
  insuranceRateFormatted: string;
  monthlyPayment: number;
  monthlyPaymentFormatted: string;
  durationMonths: number;
  durationFormatted: string;
  remainingMonths: number;
  remainingMonthsFormatted: string;
  status: string;
  statusLabel: string;
  statusColor: 'success' | 'warning' | 'error' | 'default';
  nextPaymentDate: Date;
  nextPaymentDateFormatted: string;
  createdAt: Date;
  createdAtFormatted: string;
}

export function toLoanViewModel(dto: LoanDto): LoanViewModel {
  return {
    id: dto.id,
    userId: dto.userId,
    advisorId: dto.advisorId,
    accountId: dto.accountId,
    principal: dto.principal,
    principalFormatted: formatCurrency(dto.principal),
    remainingPrincipal: dto.remainingPrincipal,
    remainingPrincipalFormatted: formatCurrency(dto.remainingPrincipal),
    annualInterestRate: dto.annualInterestRate,
    annualInterestRateFormatted: `${dto.annualInterestRate}%`,
    insuranceRate: dto.insuranceRate,
    insuranceRateFormatted: `${dto.insuranceRate}%`,
    monthlyPayment: dto.monthlyPayment,
    monthlyPaymentFormatted: formatCurrency(dto.monthlyPayment),
    durationMonths: dto.durationMonths,
    durationFormatted: formatDuration(dto.durationMonths),
    remainingMonths: dto.remainingMonths,
    remainingMonthsFormatted: formatDuration(dto.remainingMonths),
    status: dto.status,
    statusLabel: getLabel(dto.status, LOAN_STATUS_LABELS),
    statusColor: getColor(dto.status, LOAN_STATUS_COLORS, 'default'),
    nextPaymentDate: dto.nextPaymentDate,
    nextPaymentDateFormatted: formatDate(dto.nextPaymentDate),
    createdAt: dto.createdAt,
    createdAtFormatted: formatDate(dto.createdAt),
  };
}

export function toLoanViewModels(dtos: LoanDto[]): LoanViewModel[] {
  return toViewModels(dtos, toLoanViewModel);
}
