import { z } from 'zod';

export const transferSchema = z.object({
  fromAccountId: z.string().uuid('ID de compte source invalide'),
  toAccountId: z.string().uuid('ID de compte destination invalide'),
  amount: z
    .number()
    .positive('Le montant doit être positif')
    .max(1000000, 'Le montant ne peut pas dépasser 1 000 000'),
  description: z.string().max(200, 'La description ne peut pas dépasser 200 caractères').optional(),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: 'Les comptes source et destination doivent être différents',
  path: ['toAccountId'],
});

export const depositSchema = z.object({
  accountId: z.string().uuid('ID de compte invalide'),
  amount: z
    .number()
    .positive('Le montant doit être positif')
    .max(1000000, 'Le montant ne peut pas dépasser 1 000 000'),
});

export const withdrawSchema = z.object({
  accountId: z.string().uuid('ID de compte invalide'),
  amount: z
    .number()
    .positive('Le montant doit être positif')
    .max(100000, 'Le montant de retrait ne peut pas dépasser 100 000'),
});

export type TransferFormData = z.infer<typeof transferSchema>;
export type DepositFormData = z.infer<typeof depositSchema>;
export type WithdrawFormData = z.infer<typeof withdrawSchema>;
