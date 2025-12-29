export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: 'Compte courant',
  SAVINGS: 'Compte épargne',
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  TRANSFER: 'Virement',
  DEPOSIT: 'Dépôt',
  WITHDRAWAL: 'Retrait',
};

export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  COMPLETED: 'Complété',
  FAILED: 'Échoué',
};

export const TRANSACTION_STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'error',
};

export const LOAN_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  ACTIVE: 'Actif',
  PAID: 'Remboursé',
  DEFAULTED: 'En défaut',
};

export const LOAN_STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  PENDING: 'warning',
  ACTIVE: 'success',
  PAID: 'default',
  DEFAULTED: 'error',
};

export const STOCK_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Disponible',
  UNAVAILABLE: 'Indisponible',
};

export const STOCK_STATUS_COLORS: Record<string, 'success' | 'default'> = {
  AVAILABLE: 'success',
  UNAVAILABLE: 'default',
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  BUY: 'Achat',
  SELL: 'Vente',
};

export const ORDER_TYPE_COLORS: Record<string, 'success' | 'error'> = {
  BUY: 'success',
  SELL: 'error',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  EXECUTED: 'Exécuté',
  CANCELLED: 'Annulé',
};

export const ORDER_STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  PENDING: 'warning',
  EXECUTED: 'success',
  CANCELLED: 'error',
};

export const CONVERSATION_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Ouverte',
  ASSIGNED: 'Assignée',
  CLOSED: 'Fermée',
};

export const CONVERSATION_STATUS_COLORS: Record<string, 'success' | 'warning' | 'default'> = {
  OPEN: 'warning',
  ASSIGNED: 'success',
  CLOSED: 'default',
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  ACCOUNT_CREATED: 'Compte créé',
  TRANSACTION: 'Transaction',
  LOAN_APPROVED: 'Prêt approuvé',
  LOAN_REJECTED: 'Prêt rejeté',
  MESSAGE: 'Message',
  ALERT: 'Alerte',
};

export const NOTIFICATION_TYPE_COLORS: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  ACCOUNT_CREATED: 'success',
  TRANSACTION: 'info',
  LOAN_APPROVED: 'success',
  LOAN_REJECTED: 'error',
  MESSAGE: 'info',
  ALERT: 'warning',
};

export const USER_ROLE_LABELS: Record<string, string> = {
  CLIENT: 'Client',
  ADVISOR: 'Conseiller',
  DIRECTOR: 'Directeur',
};

export const USER_ROLE_COLORS: Record<string, 'default' | 'primary' | 'secondary'> = {
  CLIENT: 'default',
  ADVISOR: 'primary',
  DIRECTOR: 'secondary',
};

export const USER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  BANNED: 'Banni',
};

export const USER_STATUS_COLORS: Record<string, 'success' | 'error' | 'default'> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  BANNED: 'error',
};
