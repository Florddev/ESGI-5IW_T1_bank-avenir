import { z } from 'zod';

export const createAccountSchema = z.object({
  customName: z
    .string()
    .min(3, 'Le nom du compte doit contenir au moins 3 caractères')
    .max(50, 'Le nom du compte ne peut pas dépasser 50 caractères'),
  type: z.enum(['CHECKING', 'SAVINGS'], {
    errorMap: () => ({ message: 'Type de compte invalide' }),
  }),
  savingsRate: z
    .number()
    .min(0, 'Le taux d\'épargne ne peut pas être négatif')
    .max(100, 'Le taux d\'épargne ne peut pas dépasser 100%')
    .optional(),
});

export const updateAccountNameSchema = z.object({
  customName: z
    .string()
    .min(3, 'Le nom du compte doit contenir au moins 3 caractères')
    .max(50, 'Le nom du compte ne peut pas dépasser 50 caractères'),
});

export const updateSavingsRateSchema = z.object({
  newRate: z
    .number()
    .min(0, 'Le taux d\'épargne ne peut pas être négatif')
    .max(100, 'Le taux d\'épargne ne peut pas dépasser 100%'),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type UpdateAccountNameFormData = z.infer<typeof updateAccountNameSchema>;
export type UpdateSavingsRateFormData = z.infer<typeof updateSavingsRateSchema>;
