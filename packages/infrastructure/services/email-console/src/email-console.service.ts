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
}
