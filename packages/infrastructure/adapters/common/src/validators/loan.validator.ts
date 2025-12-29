import { z } from 'zod';

export const createLoanSchema = z.object({
  userId: z.string().uuid('ID utilisateur invalide'),
  accountId: z.string().uuid('ID de compte invalide'),
  principal: z
    .number()
    .positive('Le montant du prêt doit être positif')
    .min(1000, 'Le montant minimum est de 1 000€')
    .max(500000, 'Le montant maximum est de 500 000€'),
  annualInterestRate: z
    .number()
    .min(0, 'Le taux d\'intérêt ne peut pas être négatif')
    .max(20, 'Le taux d\'intérêt ne peut pas dépasser 20%'),
  insuranceRate: z
    .number()
    .min(0, 'Le taux d\'assurance ne peut pas être négatif')
    .max(5, 'Le taux d\'assurance ne peut pas dépasser 5%'),
  durationMonths: z
    .number()
    .int('La durée doit être un nombre entier de mois')
    .min(12, 'La durée minimum est de 12 mois')
    .max(360, 'La durée maximum est de 360 mois (30 ans)'),
});

export type CreateLoanFormData = z.infer<typeof createLoanSchema>;
