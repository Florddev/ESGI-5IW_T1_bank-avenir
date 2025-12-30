import { useRealtime } from './useRealtime';
import { RealtimeTransactionDto } from '@workspace/application/dtos';

/**
 * Hook spécialisé pour les transactions en temps réel
 */
export function useRealtimeTransactions(userId: string) {
    return useRealtime<RealtimeTransactionDto>({
        userId,
        events: ['transaction_created', 'transaction_completed', 'transaction_failed'],
        onEvent: (event, data) => {
            console.log(`[Transactions] ${event}:`, data);
            
            // Afficher une notification toast
            if (event === 'transaction_completed') {
                // toast.success(`Transaction de ${data.amount}€ réussie`);
            }
        },
    });
}
