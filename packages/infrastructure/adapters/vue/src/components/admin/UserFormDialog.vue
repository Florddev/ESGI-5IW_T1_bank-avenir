<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ isEdit ? 'Modifier l\'utilisateur' : 'Créer un utilisateur' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            :disabled="isEdit"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
          />
        </div>

        <!-- Password (only for creation) -->
        <div v-if="!isEdit">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- First Name -->
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            id="firstName"
            v-model="formData.firstName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            id="lastName"
            v-model="formData.lastName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Role (only for creation) -->
        <div v-if="!isEdit">
          <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
            Rôle
          </label>
          <select
            id="role"
            v-model="formData.role"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="CLIENT">Client</option>
            <option value="DIRECTOR">Directeur</option>
          </select>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'En cours...' : isEdit ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { UserDto } from '@workspace/application/dtos';

const props = defineProps<{
  show: boolean;
  user?: UserDto | null;
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: any];
}>();

const isEdit = ref(false);
const formData = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'CLIENT',
});

watch(() => [props.show, props.user], () => {
  if (props.show) {
    if (props.user) {
      isEdit.value = true;
      formData.value = {
        email: props.user.email,
        password: '',
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        role: props.user.role,
      };
    } else {
      isEdit.value = false;
      formData.value = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'CLIENT',
      };
    }
  }
}, { immediate: true });

function handleSubmit() {
  const data = isEdit.value
    ? {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
      }
    : {
        email: formData.value.email,
        password: formData.value.password,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        role: formData.value.role,
      };

  emit('submit', data);
}
</script>
