import { z } from 'zod';

export const updateSavingsRateSchema = z.object({
  newRate: z
    .number()
    .min(0, 'Le taux ne peut pas être négatif')
    .max(20, 'Le taux ne peut pas dépasser 20%'),
  notificationMessage: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(500, 'Le message ne peut pas dépasser 500 caractères'),
});

export type UpdateSavingsRateFormData = z.infer<typeof updateSavingsRateSchema>;
