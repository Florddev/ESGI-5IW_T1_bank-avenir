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
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  initialPrice: z
    .number()
    .positive('Le prix initial doit être positif')
    .min(0.01, 'Le prix minimum est de 0.01€')
    .max(100000, 'Le prix maximum est de 100 000€'),
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
