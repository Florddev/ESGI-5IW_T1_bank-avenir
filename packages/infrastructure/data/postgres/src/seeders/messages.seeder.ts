import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { messages } from '../schema';
import * as schema from '../schema';

export async function seedMessages(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding messages...');

  const messagesData = [
    {
      id: '70000000-0000-0000-0000-000000000001',
      conversationId: '60000000-0000-0000-0000-000000000001',
      senderId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      content: 'Bonjour, j\'aimerais avoir des informations sur les conditions de remboursement anticipé de mon prêt immobilier.',
      isRead: true,
      createdAt: new Date('2024-01-10T10:30:00'),
      updatedAt: new Date('2024-01-10T10:30:00'),
    },
    {
      id: '70000000-0000-0000-0000-000000000002',
      conversationId: '60000000-0000-0000-0000-000000000001',
      senderId: '00000000-0000-0000-0000-000000000002', // Marie Conseiller
      content: 'Bonjour Madame Martin, bien sûr. Pour un remboursement anticipé, des indemnités peuvent s\'appliquer selon les conditions de votre contrat. Pouvez-vous me préciser si vous souhaitez un remboursement total ou partiel ?',
      isRead: true,
      createdAt: new Date('2024-01-10T14:15:00'),
      updatedAt: new Date('2024-01-10T14:15:00'),
    },
    {
      id: '70000000-0000-0000-0000-000000000003',
      conversationId: '60000000-0000-0000-0000-000000000001',
      senderId: '00000000-0000-0000-0000-000000000004', // Sophie Martin
      content: 'Je pense à un remboursement partiel d\'environ 10 000€.',
      isRead: true,
      createdAt: new Date('2024-01-12T09:20:00'),
      updatedAt: new Date('2024-01-12T09:20:00'),
    },
    {
      id: '70000000-0000-0000-0000-000000000004',
      conversationId: '60000000-0000-0000-0000-000000000002',
      senderId: '00000000-0000-0000-0000-000000000005', // Thomas Bernard
      content: 'Bonjour, je souhaiterais diversifier mon portefeuille. Que pensez-vous des actions technologiques actuellement ?',
      isRead: true,
      createdAt: new Date('2024-02-05T11:00:00'),
      updatedAt: new Date('2024-02-05T11:00:00'),
    },
    {
      id: '70000000-0000-0000-0000-000000000005',
      conversationId: '60000000-0000-0000-0000-000000000002',
      senderId: '00000000-0000-0000-0000-000000000003', // Pierre Durand
      content: 'Bonjour Monsieur Bernard, les actions technologiques peuvent être intéressantes mais comportent des risques. Je vous recommande de diversifier avec d\'autres secteurs également.',
      isRead: true,
      createdAt: new Date('2024-02-06T10:30:00'),
      updatedAt: new Date('2024-02-06T10:30:00'),
    },
    {
      id: '70000000-0000-0000-0000-000000000006',
      conversationId: '60000000-0000-0000-0000-000000000003',
      senderId: '00000000-0000-0000-0000-000000000006', // Emma Petit
      content: 'Bonjour, j\'aimerais ouvrir un compte épargne. Quels sont les taux actuels ?',
      isRead: false,
      createdAt: new Date('2024-03-01T15:45:00'),
      updatedAt: new Date('2024-03-01T15:45:00'),
    },
  ];

  await db.insert(messages).values(messagesData).onConflictDoNothing();

  console.log(`✅ Seeded ${messagesData.length} messages`);
}
