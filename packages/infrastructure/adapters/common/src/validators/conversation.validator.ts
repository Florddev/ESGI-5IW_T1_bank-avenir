import { z } from 'zod';

export const createConversationSchema = z.object({
  subject: z
    .string()
    .min(3, 'Le sujet doit contenir au moins 3 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Le message ne peut pas être vide')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
});

export const transferConversationSchema = z.object({
  newAdvisorId: z.string().uuid('ID du conseiller invalide'),
});

export type CreateConversationFormData = z.infer<typeof createConversationSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
export type TransferConversationFormData = z.infer<typeof transferConversationSchema>;
