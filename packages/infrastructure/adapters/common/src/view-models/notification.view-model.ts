import type { NotificationDto } from '@workspace/application/dtos';
import { formatDateTime } from '../formatters';
import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_COLORS } from '../constants';
import { toViewModels, getLabel, getColor } from '../utils';

export interface NotificationViewModel {
  id: string;
  userId: string;
  type: string;
  typeLabel: string;
  typeColor: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  createdAtFormatted: string;
  updatedAt: Date;
  updatedAtFormatted: string;
}

export function toNotificationViewModel(dto: NotificationDto): NotificationViewModel {
  return {
    id: dto.id,
    userId: dto.userId,
    type: dto.type,
    typeLabel: getLabel(dto.type, NOTIFICATION_TYPE_LABELS),
    typeColor: getColor(dto.type, NOTIFICATION_TYPE_COLORS, 'info'),
    title: dto.title,
    message: dto.message,
    isRead: dto.isRead,
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
    updatedAt: dto.updatedAt,
    updatedAtFormatted: formatDateTime(dto.updatedAt),
  };
}

export function toNotificationViewModels(dtos: NotificationDto[]): NotificationViewModel[] {
  return toViewModels(dtos, toNotificationViewModel);
}
