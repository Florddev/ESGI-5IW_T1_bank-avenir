import type { UserDto } from '@workspace/application/dtos';
import { formatDateTime } from '../formatters';
import {
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
} from '../constants';
import { toViewModels, getLabel, getColor } from '../utils';

export interface UserViewModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  roleLabel: string;
  roleColor: 'default' | 'primary' | 'secondary';
  status: string;
  statusLabel: string;
  statusColor: 'success' | 'error' | 'default';
  createdAt: Date;
  createdAtFormatted: string;
  updatedAt: Date;
  updatedAtFormatted: string;
}

export function toUserViewModel(dto: UserDto): UserViewModel {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: `${dto.firstName} ${dto.lastName}`,
    role: dto.role,
    roleLabel: getLabel(dto.role, USER_ROLE_LABELS),
    roleColor: getColor(dto.role, USER_ROLE_COLORS, 'default'),
    status: dto.status,
    statusLabel: getLabel(dto.status, USER_STATUS_LABELS),
    statusColor: getColor(dto.status, USER_STATUS_COLORS, 'default'),
    createdAt: dto.createdAt,
    createdAtFormatted: formatDateTime(dto.createdAt),
    updatedAt: dto.updatedAt,
    updatedAtFormatted: formatDateTime(dto.updatedAt),
  };
}

export function toUserViewModels(dtos: UserDto[]): UserViewModel[] {
  return toViewModels(dtos, toUserViewModel);
}
