import type { StockDto, OrderDto } from '@workspace/application/dtos';
import { formatCurrency, formatDateTime } from '../formatters';
import {
  STOCK_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  ORDER_TYPE_COLORS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '../constants';
import { toViewModels, getLabel, getColor } from '../utils';

export interface StockViewModel {
  id: string;
  symbol: string;
  companyName: string;
  currentPrice?: number;
  currentPriceFormatted?: string;
  status: string;
  statusLabel: string;
  statusColor: 'success' | 'default';
  createdAt: Date;
  createdAtFormatted: string;
}

export interface OrderViewModel {
  id: string;
  userId: string;
  stockId: string;
  type: string;
  typeLabel: string;
  typeColor: 'success' | 'error';
  quantity: number;
  remainingQuantity: number;
  pricePerShare: number;
  pricePerShareFormatted: string;
  totalAmount: number;
  totalAmountFormatted: string;
  fees: number;
  feesFormatted: string;
  status: string;
  statusLabel: string;
  statusColor: 'success' | 'warning' | 'error' | 'default';
  createdAt: Date;
  createdAtFormatted: string;
}

export function toStockViewModel(dto: StockDto): StockViewModel {
  return {
    id: dto.id,
    symbol: dto.symbol,
    companyName: dto.companyName,
    currentPrice: dto.currentPrice,
    currentPriceFormatted: dto.currentPrice ? formatCurrency(dto.currentPrice) : undefined,
    status: dto.status,
    statusLabel: getLabel(dto.status, STOCK_STATUS_LABELS),
    statusColor: dto.status === 'AVAILABLE' ? 'success' : 'default',
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
  };
}

export function toOrderViewModel(dto: OrderDto): OrderViewModel {
  const totalAmount = dto.quantity * dto.pricePerShare + dto.fees;
  return {
    id: dto.id,
    userId: dto.userId,
    stockId: dto.stockId,
    type: dto.type,
    typeLabel: getLabel(dto.type, ORDER_TYPE_LABELS),
    typeColor: getColor(dto.type, ORDER_TYPE_COLORS, 'success'),
    quantity: dto.quantity,
    remainingQuantity: dto.remainingQuantity,
    pricePerShare: dto.pricePerShare,
    pricePerShareFormatted: formatCurrency(dto.pricePerShare),
    totalAmount: totalAmount,
    totalAmountFormatted: formatCurrency(totalAmount),
    fees: dto.fees,
    feesFormatted: formatCurrency(dto.fees),
    status: dto.status,
    statusLabel: getLabel(dto.status, ORDER_STATUS_LABELS),
    statusColor: getColor(dto.status, ORDER_STATUS_COLORS, 'default'),
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
  };
}

export function toStockViewModels(dtos: StockDto[]): StockViewModel[] {
  return toViewModels(dtos, toStockViewModel);
}

export function toOrderViewModels(dtos: OrderDto[]): OrderViewModel[] {
  return toViewModels(dtos, toOrderViewModel);
}
