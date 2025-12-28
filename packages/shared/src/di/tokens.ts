export const TOKENS = {
    IUserRepository: 'IUserRepository',
    IAccountRepository: 'IAccountRepository',
    ITransactionRepository: 'ITransactionRepository',
    IStockRepository: 'IStockRepository',
    IOrderRepository: 'IOrderRepository',
    IPortfolioRepository: 'IPortfolioRepository',
    ILoanRepository: 'ILoanRepository',
    IConversationRepository: 'IConversationRepository',
    IMessageRepository: 'IMessageRepository',
    INotificationRepository: 'INotificationRepository',

    IAuthService: 'IAuthService',
    IEmailService: 'IEmailService',
    IHashService: 'IHashService',
    ITokenService: 'ITokenService',
    INotificationService: 'INotificationService',
    IOrderMatchingService: 'IOrderMatchingService',
    IStorageService: 'IStorageService',
} as const;

export type Token = (typeof TOKENS)[keyof typeof TOKENS];
