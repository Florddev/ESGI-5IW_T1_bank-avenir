import { z } from 'zod';

export const createStockSchema = z.object({
  symbol: z
    .string()
    .min(1, 'Le symbole est requis')
    .max(10, 'Le symbole ne peut pas dépasser 10 caractères')
    .regex(/^[A-Z]+$/, 'Le symbole doit contenir uniquement des lettres majuscules'),
  companyName: z
    .string()
    .min(2, 'Le nom de la société doit contenir au moins 2 caractères')
    .max(100, 'Le nom de la société ne peut pas dépasser 100 caractères'),
});

export const updateStockSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Le nom de la société doit contenir au moins 2 caractères')
    .max(100, 'Le nom de la société ne peut pas dépasser 100 caractères')
    .optional(),
  makeAvailable: z.boolean().optional(),
});

export const buyStockSchema = z.object({
  quantity: z
    .number()
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .max(10000, 'La quantité ne peut pas dépasser 10 000'),
});

export const sellStockSchema = z.object({
  quantity: z
    .number()
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .max(10000, 'La quantité ne peut pas dépasser 10 000'),
});

export type CreateStockFormData = z.infer<typeof createStockSchema>;
export type UpdateStockFormData = z.infer<typeof updateStockSchema>;
export type BuyStockFormData = z.infer<typeof buyStockSchema>;
export type SellStockFormData = z.infer<typeof sellStockSchema>;
