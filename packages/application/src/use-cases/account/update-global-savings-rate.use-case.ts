import { Inject, TOKENS, UseCase } from '@workspace/shared/di';
import type { IAccountRepository, INotificationRepository } from '../../ports';
import { Notification, NotificationType, Percentage } from '@workspace/domain';

@UseCase()
export class UpdateGlobalSavingsRateUseCase {
  constructor(
    @Inject(TOKENS.IAccountRepository)
    private accountRepository: IAccountRepository,
    @Inject(TOKENS.INotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}

  async execute(newRate: number): Promise<{ accountsUpdated: number; notificationsSent: number }> {
    const rate = Percentage.fromDecimal(newRate / 100);

    // Récupérer tous les comptes d'épargne
    const savingsAccounts = await this.accountRepository.findSavingsAccounts();

    let accountsUpdated = 0;
    let notificationsSent = 0;
    const userIds: string[] = [];

    // Mettre à jour tous les comptes d'épargne
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

    // Envoyer une notification à chaque client concerné
    for (const userId of userIds) {
      try {
        const notification = Notification.create(
          userId,
          NotificationType.SAVINGS_RATE_CHANGE,
          'Changement de taux d\'épargne',
          `Le nouveau taux d'épargne est maintenant de ${newRate}% par an.`
        );
        await this.notificationRepository.save(notification);
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
