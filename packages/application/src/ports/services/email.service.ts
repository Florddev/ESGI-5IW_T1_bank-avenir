export interface IEmailService {
    sendConfirmationEmail(email: string, token: string): Promise<void>;
    sendSavingsRateChangeNotification(
        email: string,
        oldRate: number,
        newRate: number
    ): Promise<void>;
    sendLoanPaymentReminder(email: string, amount: number, dueDate: Date): Promise<void>;
}
