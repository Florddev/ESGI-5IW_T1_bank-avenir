<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits<{
  success: [];
}>();

const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});

const handleSubmit = async () => {
  try {
    await authStore.login(form.value.email, form.value.password);
    emit('success');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="authStore.loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="authStore.loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div v-if="authStore.error" class="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
          {{ authStore.error }}
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </div>
</template>
