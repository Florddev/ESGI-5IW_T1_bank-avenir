import { Injectable } from '@workspace/shared/di';
import { IEmailService } from '@workspace/application/ports';

@Injectable()
export class EmailConsoleService implements IEmailService {
    async sendConfirmationEmail(email: string, token: string): Promise<void> {
        console.log('=== Email de Confirmation ===');
        console.log(`À: ${email}`);
        console.log(`Sujet: Confirmez votre compte Avenir Bank`);
        console.log(`Lien de confirmation: http://localhost:3000/auth/confirm-email?token=${token}`);
        console.log('=============================\n');
    }

    async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
        console.log('=== Email de Bienvenue ===');
        console.log(`À: ${email}`);
        console.log(`Sujet: Bienvenue ${firstName} chez Avenir Bank`);
        console.log(`Contenu: Votre compte est maintenant actif !`);
        console.log('==========================\n');
    }

    async sendSavingsRateChangeNotification(email: string, oldRate: number, newRate: number): Promise<void> {
        console.log('=== Notification de changement de taux ===');
        console.log(`À: ${email}`);
        console.log(`Sujet: Changement du taux d'épargne`);
        console.log(`Ancien taux: ${(oldRate * 100).toFixed(2)}%`);
        console.log(`Nouveau taux: ${(newRate * 100).toFixed(2)}%`);
        console.log('==========================================\n');
    }

    async sendLoanPaymentReminder(email: string, amount: number, dueDate: Date): Promise<void> {
        console.log('=== Rappel de paiement de prêt ===');
        console.log(`À: ${email}`);
        console.log(`Sujet: Rappel de paiement`);
        console.log(`Montant: ${amount.toFixed(2)} EUR`);
        console.log(`Date d'échéance: ${dueDate.toLocaleDateString('fr-FR')}`);
        console.log('===================================\n');
    }
}
