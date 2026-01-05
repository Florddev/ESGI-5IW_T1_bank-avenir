<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ title }}
      </h3>

      <p class="text-gray-600 mb-6">
        {{ message }}
      </p>

      <!-- Reason input for ban action -->
      <div v-if="type === 'ban'" class="mb-6">
        <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
          Raison (optionnel)
        </label>
        <textarea
          id="reason"
          v-model="reason"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Expliquez pourquoi cet utilisateur est banni..."
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="handleConfirm"
          :disabled="loading"
          :class="[
            'px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50',
            type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
          ]"
        >
          {{ loading ? 'En cours...' : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  type: 'delete' | 'ban';
  title: string;
  message: string;
  confirmText: string;
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [reason?: string];
}>();

const reason = ref('');

watch(() => props.show, (newShow) => {
  if (!newShow) {
    reason.value = '';
  }
});

function handleConfirm() {
  if (props.type === 'ban') {
    emit('confirm', reason.value || undefined);
  } else {
    emit('confirm');
  }
}
</script>
