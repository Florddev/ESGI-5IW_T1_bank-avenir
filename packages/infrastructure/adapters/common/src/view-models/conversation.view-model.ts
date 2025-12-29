import type { ConversationDto, MessageDto } from '@workspace/application/dtos';
import { formatDateTime, truncate } from '../formatters';
import { CONVERSATION_STATUS_LABELS, CONVERSATION_STATUS_COLORS } from '../constants';
import { toViewModels, getLabel, getColor } from '../utils';

export interface ConversationViewModel {
  id: string;
  clientId: string;
  advisorId?: string;
  status: string;
  statusLabel: string;
  statusColor: 'success' | 'warning' | 'default';
  createdAt: Date;
  createdAtFormatted: string;
  updatedAt: Date;
  updatedAtFormatted: string;
}

export interface MessageViewModel {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  createdAtFormatted: string;
}

export function toConversationViewModel(dto: ConversationDto): ConversationViewModel {
  return {
    id: dto.id,
    clientId: dto.clientId,
    advisorId: dto.advisorId,
    status: dto.status,
    statusLabel: getLabel(dto.status, CONVERSATION_STATUS_LABELS),
    statusColor: getColor(dto.status, CONVERSATION_STATUS_COLORS, 'default'),
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
    updatedAt: dto.updatedAt,
    updatedAtFormatted: formatDateTime(dto.updatedAt),
  };
}

export function toMessageViewModel(dto: MessageDto): MessageViewModel {
  return {
    id: dto.id,
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    content: dto.content,
    isRead: dto.isRead,
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
  };
}

export function toConversationViewModels(dtos: ConversationDto[]): ConversationViewModel[] {
  return toViewModels(dtos, toConversationViewModel);
}

export function toMessageViewModels(dtos: MessageDto[]): MessageViewModel[] {
  return toViewModels(dtos, toMessageViewModel);
}
