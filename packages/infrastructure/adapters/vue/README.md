# @workspace/adapter-vue

Adapter Vue.js pour l'application Avenir Bank. Ce package fournit des composants, stores Pinia et composables réutilisables pour les applications Vue.js.

## 📦 Installation

```bash
pnpm add @workspace/adapter-vue
```

## 🎯 Fonctionnalités

- **Stores Pinia** : Gestion d'état avec authentification
- **Composants Vue** : Composants d'authentification réutilisables
- **Composables** : Hooks Vue personnalisés
- **Intégration** : Utilise `@workspace/adapter-common` pour les appels API

## 🚀 Utilisation

### Configuration

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

### Store d'authentification

```typescript
import { useAuthStore } from '@workspace/adapter-vue/stores';

const authStore = useAuthStore();

// Login
await authStore.login('email@example.com', 'password');

// Register
await authStore.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password'
});

// Logout
await authStore.logout();

// Vérifier l'authentification
if (authStore.isAuthenticated) {
  console.log(authStore.user);
}
```

### Composants

```vue
<script setup lang="ts">
import { LoginForm, RegisterForm } from '@workspace/adapter-vue/components';
</script>

<template>
  <LoginForm @success="handleLoginSuccess" />
  <RegisterForm @success="handleRegisterSuccess" />
</template>
```

## 🏗️ Architecture

```
src/
├── stores/           # Stores Pinia
│   ├── auth.ts      # Store d'authentification
│   └── index.ts
├── components/       # Composants Vue
│   ├── LoginForm.vue
│   ├── RegisterForm.vue
│   └── index.ts
├── composables/      # Hooks Vue
│   └── index.ts
└── index.ts          # Point d'entrée principal
```

## 🔧 Dépendances

- **Vue 3** : Framework frontend
- **Pinia** : State management
- **@workspace/adapter-common** : Clients API
- **@workspace/application** : DTOs et types
