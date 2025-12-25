export interface INotificationService {
    notifyUser(userId: string, type: string, title: string, message: string): Promise<void>;
    notifySavingsRateChange(userIds: string[], oldRate: number, newRate: number): Promise<void>;
}
