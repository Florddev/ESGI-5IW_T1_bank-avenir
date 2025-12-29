import { z } from 'zod';

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Le message ne peut pas être vide')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});

export const transferConversationSchema = z.object({
  newAdvisorId: z.string().uuid('ID du conseiller invalide'),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
export type TransferConversationFormData = z.infer<typeof transferConversationSchema>;
