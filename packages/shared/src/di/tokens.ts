export const TOKENS = {
    IUserRepository: Symbol('IUserRepository'),
    IAccountRepository: Symbol('IAccountRepository'),
    ITransactionRepository: Symbol('ITransactionRepository'),
    IStockRepository: Symbol('IStockRepository'),
    IOrderRepository: Symbol('IOrderRepository'),
    IPortfolioRepository: Symbol('IPortfolioRepository'),
    ILoanRepository: Symbol('ILoanRepository'),
    IConversationRepository: Symbol('IConversationRepository'),
    IMessageRepository: Symbol('IMessageRepository'),
    INotificationRepository: Symbol('INotificationRepository'),
    ISettingsRepository: Symbol('ISettingsRepository'),
    IArticleRepository: Symbol('IArticleRepository'),

    IAuthService: Symbol('IAuthService'),
    IEmailService: Symbol('IEmailService'),
    IHashService: Symbol('IHashService'),
    ITokenService: Symbol('ITokenService'),
    INotificationService: Symbol('INotificationService'),
    IOrderMatchingService: Symbol('IOrderMatchingService'),
    IStorageService: Symbol('IStorageService'),
    IRealtimeService: Symbol('IRealtimeService'),
    IRealtimeServiceMessages: Symbol('IRealtimeServiceMessages'),
    IRealtimeServiceNotifications: Symbol('IRealtimeServiceNotifications'), 
} as const;

export type Token = (typeof TOKENS)[keyof typeof TOKENS];
