export interface CreateNotificationDto {
    userId: string;
    type: string;
    title: string;
    message: string;
}

export interface NotificationDto {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationListDto {
    notifications: NotificationDto[];
    unreadCount: number;
}

export interface MarkNotificationAsReadDto {
    notificationId: string;
}

export interface RealtimeNotificationDto {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}
