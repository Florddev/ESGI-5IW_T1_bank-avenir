<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import type { RegisterUserDto } from '@workspace/application/dtos';

const emit = defineEmits<{
  success: [];
}>();

const authStore = useAuthStore();

const form = ref<RegisterUserDto>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
});

const success = ref(false);
const localLoading = ref(false);
const localError = ref<string | null>(null);

const handleSubmit = async () => {
  localLoading.value = true;
  localError.value = null;
  success.value = false;

  try {
    await authStore.register(form.value);
    success.value = true;
    
    // Émettre l'événement de succès après 2 secondes
    setTimeout(() => {
      emit('success');
    }, 2000);
  } catch (error: any) {
    localError.value = error.message || "Une erreur est survenue lors de l'inscription";
  } finally {
    localLoading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-purple-900">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Inscription</h2>

      <div v-if="success" class="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm">
        Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            required
            :disabled="localLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            required
            :disabled="localLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="localLoading"
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
            minlength="6"
            :disabled="localLoading"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div v-if="localError" class="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm">
          {{ localError }}
        </div>

        <button
          type="submit"
          :disabled="localLoading"
          class="w-full bg-purple-600 text-white py-2 px-4 rounded-md font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {{ localLoading ? 'Inscription...' : "S'inscrire" }}
        </button>
      </form>
    </div>
  </div>
</template>
