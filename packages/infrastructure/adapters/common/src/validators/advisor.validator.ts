import { z } from 'zod';

export const sendAdvisorNotificationSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(500, 'Le message ne peut pas dépasser 500 caractères'),
});

export type SendAdvisorNotificationFormData = z.infer<typeof sendAdvisorNotificationSchema>;
