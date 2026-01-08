import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { notifications } from '../schema';
import * as schema from '../schema';

export async function seedNotifications(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding notifications...');

  const notificationsData = [
    {
      id: '80000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      type: 'SAVINGS_RATE_CHANGE' as const,
      title: 'Nouveau taux d\'épargne',
      message: 'Le taux de votre livret épargne est passé à 3,25%',
      isRead: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-06'),
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      type: 'TRANSACTION' as const,
      title: 'Nouvelle transaction',
      message: 'Transfert de 1 000,00 € vers votre compte épargne',
      isRead: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '80000000-0000-0000-0000-000000000003',
      userId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      type: 'LOAN_PAYMENT_DUE' as const,
      title: 'Échéance de prêt',
      message: 'Votre mensualité de prêt de 930,00 € sera prélevée le 15/02/2026',
      isRead: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10'),
    },
    {
      id: '80000000-0000-0000-0000-000000000004',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      type: 'ORDER_FILLED' as const,
      title: 'Ordre exécuté',
      message: 'Votre ordre d\'achat de 8 actions TSLA a été exécuté',
      isRead: true,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
    {
      id: '80000000-0000-0000-0000-000000000005',
      userId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      type: 'MESSAGE_RECEIVED' as const,
      title: 'Nouveau message',
      message: 'Vous avez reçu un nouveau message de votre conseiller',
      isRead: true,
      createdAt: new Date('2024-02-06'),
      updatedAt: new Date('2024-02-06'),
    },
    {
      id: '80000000-0000-0000-0000-000000000006',
      userId: '00000000-0000-0000-0000-000000000006', // Emma Petit
      type: 'MESSAGE_RECEIVED' as const,
      title: 'Bienvenue',
      message: 'Bienvenue chez Avenir Bank ! Votre compte est en cours de validation.',
      isRead: false,
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
  ];

  await db.insert(notifications).values(notificationsData).onConflictDoNothing();

  console.log(`✅ Seeded ${notificationsData.length} notifications`);
}
