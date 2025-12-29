export const CACHE_TAGS = {
    ACCOUNTS: 'accounts',
    TRANSACTIONS: 'transactions',
    LOANS: 'loans',
    STOCKS: 'stocks',
    NOTIFICATIONS: 'notifications',
    CONVERSATIONS: 'conversations',
    USER: 'user',
    PORTFOLIO: 'portfolio',
} as const;

export const CACHE_REVALIDATE = {
    STATIC: false,
    SHORT: 30,
    MEDIUM: 60,
    LONG: 300,
    VERY_LONG: 3600,
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
