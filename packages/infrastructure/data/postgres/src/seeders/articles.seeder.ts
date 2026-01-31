import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { articles } from '../schema';
import * as schema from '../schema';

export async function seedArticles(db: PostgresJsDatabase<typeof schema>) {
  console.log('🌱 Seeding articles...');

  const articlesData = [
    {
      id: '90000000-0000-0000-0000-000000000001',
      title: 'Bienvenue sur Avenir Bank',
      content: 'Nous sommes ravis de vous accueillir sur notre nouvelle plateforme bancaire en ligne. Avenir Bank vous propose une expérience bancaire moderne, sécurisée et accessible à tout moment. Découvrez nos services : gestion de comptes, épargne, investissements en bourse et bien plus encore.',
      authorId: '00000000-0000-0000-0000-000000000002', // Marie Conseiller
      authorName: 'Marie Conseiller',
      publishedAt: new Date('2024-01-10'),
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '90000000-0000-0000-0000-000000000002',
      title: 'Nouveaux taux d\'épargne attractifs',
      content: 'Avenir Bank revoit ses taux d\'épargne à la hausse ! À compter du 1er février, le taux du livret épargne passe à 3,25% annuel brut. Profitez de cette opportunité pour faire fructifier votre capital en toute sécurité. Rendez-vous dans votre espace épargne pour en savoir plus.',
      authorId: '00000000-0000-0000-0000-000000000001', // Jean Directeur
      authorName: 'Jean Directeur',
      publishedAt: new Date('2024-01-25'),
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '90000000-0000-0000-0000-000000000003',
      title: 'Lancement du service de bourse en ligne',
      content: 'Nous avons le plaisir de vous annoncer le lancement de notre service de bourse en ligne. Vous pouvez désormais acheter et vendre des actions directement depuis votre espace client. Suivez l\'évolution de vos investissements en temps réel et prenez des décisions éclairées grâce à nos outils d\'analyse.',
      authorId: '00000000-0000-0000-0000-000000000002', // Marie Conseiller
      authorName: 'Marie Conseiller',
      publishedAt: new Date('2024-02-05'),
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-02-05'),
    },
    {
      id: '90000000-0000-0000-0000-000000000004',
      title: 'Conseils pour sécuriser votre compte',
      content: 'La sécurité de vos données est notre priorité. Voici quelques bonnes pratiques : utilisez un mot de passe fort et unique, ne partagez jamais vos identifiants, vérifiez toujours l\'URL avant de vous connecter et activez les notifications pour surveiller l\'activité de votre compte en temps réel.',
      authorId: '00000000-0000-0000-0000-000000000003', // Pierre Durand
      authorName: 'Pierre Durand',
      publishedAt: new Date('2024-02-20'),
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-02-20'),
    },
    {
      id: '90000000-0000-0000-0000-000000000005',
      title: 'Offre spéciale prêt immobilier',
      content: 'Jusqu\'au 31 mars, bénéficiez de conditions exceptionnelles sur nos prêts immobiliers. Taux fixe à partir de 2,90% sur 20 ans, frais de dossier offerts pour toute demande validée avant la fin du mois. Contactez votre conseiller dès maintenant pour une simulation personnalisée.',
      authorId: '00000000-0000-0000-0000-000000000001', // Jean Directeur
      authorName: 'Jean Directeur',
      publishedAt: new Date('2024-03-01'),
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01'),
    },
  ];

  await db.insert(articles).values(articlesData).onConflictDoNothing();

  console.log(`✅ Seeded ${articlesData.length} articles`);
}
