import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IAccountRepository, INotificationRepository, IRealtimeService, ISettingsRepository } from '../../ports';
import { Notification, NotificationType, Percentage } from '@workspace/domain';

@UseCase()
export class UpdateGlobalSavingsRateUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository,
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository,
    @Inject(TOKENS.IRealtimeServiceNotifications)
    private realtimeService: IRealtimeService,
    @Inject(TOKENS.ISettingsRepository)
    private settingsRepository: ISettingsRepository
  ) {}

  async execute(newRate: number, customMessage?: string): Promise<{ accountsUpdated: number; notificationsSent: number }> {
    const rate = Percentage.fromDecimal(newRate / 100);

    const settings = await this.settingsRepository.get();
    settings.updateSavingsRate(rate);
    await this.settingsRepository.save(settings);

    const savingsAccounts = await this.accountRepository.findSavingsAccounts();

    let accountsUpdated = 0;
    let notificationsSent = 0;
    const userIds: string[] = [];

    for (const account of savingsAccounts) {
      try {
        account.updateSavingsRate(rate);
        await this.accountRepository.update(account);
        accountsUpdated++;
        if (userIds.indexOf(account.userId) === -1) {
          userIds.push(account.userId);
        }
      } catch (error) {
        console.error(`Failed to update savings rate for account ${account.id}:`, error);
      }
    }

    for (const userId of userIds) {
      try {
        const message = customMessage || `Le nouveau taux d'épargne est maintenant de ${newRate}% par an.`;
        const notification = Notification.create(
          userId,
          NotificationType.SAVINGS_RATE_CHANGE,
          'Changement de taux d\'épargne',
          message
        );
        await this.notificationRepository.save(notification);

        await this.realtimeService.sendEventToUser(userId, 'notification', {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        });

        notificationsSent++;
      } catch (error) {
        console.error(`Failed to send notification to user ${userId}:`, error);
      }
    }

    return {
      accountsUpdated,
      notificationsSent,
    };
  }
}
