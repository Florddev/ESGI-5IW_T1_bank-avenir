<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        Modifier le taux d'épargne
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <p class="text-sm text-gray-600">
          Entrez le nouveau taux d'intérêt annuel pour les comptes épargne. Tous les détenteurs de comptes épargne seront notifiés de ce changement.
        </p>

        <!-- New Rate -->
        <div>
          <label for="newRate" class="block text-sm font-medium text-gray-700 mb-1">
            Nouveau taux d'intérêt (%)
          </label>
          <input
            id="newRate"
            v-model.number="newRate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            required
            placeholder="2.5"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p class="text-xs text-gray-500 mt-1">
            Exemple: 2.5 pour 2.5% par an
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {{ successMessage }}
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
            {{ loading ? 'En cours...' : 'Appliquer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  loading?: boolean;
  error?: string | null;
  successMessage?: string | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [rate: number];
}>();

const newRate = ref(0);

watch(() => props.show, (show) => {
  if (!show) {
    newRate.value = 0;
  }
});

function handleSubmit() {
  if (newRate.value > 0) {
    emit('submit', newRate.value);
  }
}
</script>
