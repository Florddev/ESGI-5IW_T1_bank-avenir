<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@workspace/adapter-vue/stores';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav v-if="isAuthenticated" class="bg-slate-800 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div>
            <h1 class="text-xl font-bold">🏦 Avenir Bank - Administration</h1>
          </div>
          <div class="flex items-center gap-6">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
              active-class="bg-slate-700"
            >
              Dashboard
            </router-link>
            <router-link
              to="/admin/users"
              class="px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
              active-class="bg-slate-700"
            >
              Utilisateurs
            </router-link>
            <router-link
              to="/admin/stocks"
              class="px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
              active-class="bg-slate-700"
            >
              Actions
            </router-link>
            <router-link
              to="/admin/savings"
              class="px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
              active-class="bg-slate-700"
            >
              Épargne
            </router-link>
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>
