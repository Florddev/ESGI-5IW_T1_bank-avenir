# Bank-Vue - Administration de la banque

Application Vue.js dédiée à l'administration de la banque Avenir Bank. Cette application permet aux directeurs de banque de se connecter et gérer les utilisateurs, les actions et les taux d'épargne.

## 🎯 Fonctionnalités

### Authentification
- Connexion directe dans l'application (réservée aux directeurs)
- Vérification du rôle DIRECTOR
- Session persistante avec JWT

### Gestion des utilisateurs
- Créer de nouveaux utilisateurs (clients ou directeurs)
- Modifier les informations des utilisateurs
- Supprimer des utilisateurs
- Bannir des utilisateurs

### Gestion des actions
- Créer de nouvelles actions disponibles
- Modifier les informations des entreprises
- Activer/désactiver la disponibilité des actions
- Supprimer des actions

### Gestion de l'épargne
- Modifier le taux d'intérêt des comptes épargne
- Notifier automatiquement tous les détenteurs de comptes épargne lors d'un changement de taux
- Appliquer les intérêts à tous les comptes épargne

## 🏗️ Architecture

L'application suit les principes de la **Clean Architecture** :

### Layers utilisés

```
@workspace/application         → DTOs (Data Transfer Objects)
@workspace/adapter-common      → AdminClient, StocksClient (API clients)
@workspace/adapter-vue         → Stores, Composables, Components
bank-vue                       → Views (présentation uniquement)
```

### Structure du code

```
packages/infrastructure/adapters/
├── common/
│   └── src/client/api/
│       └── admin.client.ts           ← Client HTTP pour l'API admin
│
└── vue/
    └── src/
        ├── stores/
        │   ├── auth.ts               ← Store d'authentification
        │   └── admin/                ← Gestion d'état Pinia
        │       ├── users.ts          ← Store pour la gestion des utilisateurs
        │       ├── stocks.ts         ← Store pour la gestion des actions
        │       └── savings.ts        ← Store pour la gestion de l'épargne
        │
        ├── composables/admin/        ← Logique métier réutilisable
        │   ├── useUserManagement.ts  ← Composable pour les utilisateurs
        │   ├── useStockManagement.ts ← Composable pour les actions
        │   └── useSavingsManagement.ts ← Composable pour l'épargne
        │
        └── components/
            ├── LoginForm.vue         ← Formulaire de connexion
            └── admin/                ← Composants Vue réutilisables
                ├── UsersList.vue         ← Table des utilisateurs
                ├── UserFormDialog.vue    ← Formulaire utilisateur
                ├── StocksList.vue        ← Table des actions
                ├── StockFormDialog.vue   ← Formulaire action
                ├── SavingsManager.vue    ← Gestion de l'épargne
                ├── SavingsRateDialog.vue ← Formulaire taux d'épargne
                └── ConfirmDialog.vue     ← Dialog de confirmation

apps/bank-vue/
└── src/
    └── views/
        ├── LoginView.vue             ← Page de connexion
        ├── DashboardView.vue         ← Dashboard administrateur
        └── admin/                    ← Vues de l'application
            ├── UsersView.vue         ← Vue gestion utilisateurs
            ├── StocksView.vue        ← Vue gestion actions
            └── SavingsView.vue       ← Vue gestion épargne
```

## 🔐 Authentification

L'application bank-vue gère l'authentification directement via la page `/login`. 

### Accès
- Seuls les utilisateurs avec le rôle **DIRECTOR** peuvent accéder à l'application
- Les clients qui tentent de se connecter seront refusés
- La session est maintenue via JWT stocké dans le localStorage

### Routes
- `/login` - Page de connexion (accessible sans authentification)
- `/` - Dashboard (nécessite authentification + rôle DIRECTOR)
- `/admin/*` - Routes d'administration (nécessite authentification + rôle DIRECTOR)

## 🚀 Démarrage

```bash
# Installation des dépendances
pnpm install

# Développement
pnpm dev

# L'application sera accessible sur http://localhost:5174
```

## 📡 API Routes utilisées

L'application communique avec le backend via les endpoints suivants :

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Récupérer l'utilisateur courant
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/admin/users` - Liste des utilisateurs
- `POST /api/admin/users` - Créer un utilisateur
- `PUT /api/admin/users/:id` - Modifier un utilisateur
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur
- `POST /api/admin/users/:id/ban` - Bannir un utilisateur

### Épargne
- `PATCH /api/admin/savings/rate` - Modifier le taux d'épargne
- `POST /api/admin/savings/apply-interest` - Appliquer les intérêts

### Actions
- `GET /api/stocks` - Liste des actions
- `POST /api/stocks` - Créer une action
- `PUT /api/stocks/:id` - Modifier une action
- `DELETE /api/stocks/:id` - Supprimer une action

Toutes les routes `/api/admin/*` et `/api/stocks` (sauf GET) nécessitent le rôle **DIRECTOR**.

## 🎨 Style

L'application utilise **Tailwind CSS v4** avec PostCSS pour le styling.

Les composants de `@workspace/adapter-vue` sont également stylés avec Tailwind et peuvent être réutilisés dans d'autres applications Vue.

## 📝 Exemples d'utilisation

### Utiliser le composable useUserManagement

```vue
<script setup>
import { useUserManagement } from '@workspace/adapter-vue/composables';
import { onMounted } from 'vue';

const {
  users,
  isLoading,
  error,
  loadUsers,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} = useUserManagement();

onMounted(() => {
  loadUsers();
});
</script>
```

### Utiliser les composants admin

```vue
<template>
  <UsersList
    :users="users"
    :loading="isLoading"
    :error="error"
    @create="openCreateDialog"
    @edit="openEditDialog"
    @delete="openDeleteDialog"
  />
</template>

<script setup>
import { UsersList } from '@workspace/adapter-vue';
</script>
```

## 🔄 Flux de données

1. **Vue** appelle une méthode du **Composable**
2. **Composable** appelle une action du **Store**
3. **Store** utilise le **Client** pour faire l'appel API
4. **Client** communique avec le **Backend**
5. La réponse remonte la chaîne et met à jour la vue

```
Vue → Composable → Store → Client → Backend
                                ↓
                             Response
```

## 🛡️ Sécurité

- Authentification requise sur toutes les routes sauf `/login`
- Vérification du rôle DIRECTOR avant d'accéder aux routes admin
- JWT stocké de manière sécurisée
- Redirection automatique vers `/login` si non authentifié
- Redirection automatique vers `/` si déjà authentifié et tentative d'accès à `/login`

## 🧪 Testing

Les stores, composables et composants sont isolés et testables unitairement grâce à l'architecture en couches.

## 📚 Technologies

- **Vue 3** avec Composition API
- **TypeScript** pour le typage
- **Pinia** pour la gestion d'état
- **Vue Router** pour le routing
- **Tailwind CSS v4** pour le styling
- **Vite** comme bundler

## 🔑 Credentials de test

Pour tester l'application, vous devez avoir un compte avec le rôle **DIRECTOR**. Contactez un administrateur système pour obtenir des identifiants de test.
