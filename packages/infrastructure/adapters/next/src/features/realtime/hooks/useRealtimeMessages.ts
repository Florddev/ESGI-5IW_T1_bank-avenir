import { useRealtime } from './useRealtime';
import { RealtimeMessageDto } from '@workspace/application/dtos';

/**
 * Hook spécialisé pour les messages en temps réel
 * Exemple d'utilisation du hook générique
 */
export function useRealtimeMessages(userId: string) {
    return useRealtime<RealtimeMessageDto>({
        userId,
        events: ['message_new', 'message_read', 'message_deleted', 'typing_start', 'typing_stop'],
        onEvent: (event, data) => {
            if (event === 'message_new') {
                // Jouer un son, afficher une notification, etc.
            }
        },
    });
}
