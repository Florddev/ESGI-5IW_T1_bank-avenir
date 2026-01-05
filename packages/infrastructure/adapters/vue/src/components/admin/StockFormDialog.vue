<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">
        {{ isEdit ? 'Modifier l\'action' : 'Créer une action' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Symbol -->
        <div>
          <label for="symbol" class="block text-sm font-medium text-gray-700 mb-1">
            Symbole
          </label>
          <input
            id="symbol"
            v-model="formData.symbol"
            type="text"
            required
            :disabled="isEdit"
            placeholder="AAPL"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 uppercase"
          />
        </div>

        <!-- Company Name -->
        <div>
          <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">
            Nom de l'entreprise
          </label>
          <input
            id="companyName"
            v-model="formData.companyName"
            type="text"
            required
            placeholder="Apple Inc."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
import type { StockDto } from '@workspace/application/dtos';

const props = defineProps<{
  show: boolean;
  stock?: StockDto | null;
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  close: [];
  submit: [data: any];
}>();

const isEdit = ref(false);
const formData = ref({
  symbol: '',
  companyName: '',
});

watch(() => [props.show, props.stock], () => {
  if (props.show) {
    if (props.stock) {
      isEdit.value = true;
      formData.value = {
        symbol: props.stock.symbol,
        companyName: props.stock.companyName,
      };
    } else {
      isEdit.value = false;
      formData.value = {
        symbol: '',
        companyName: '',
      };
    }
  }
}, { immediate: true });

function handleSubmit() {
  const data = isEdit.value
    ? {
        companyName: formData.value.companyName,
      }
    : {
        symbol: formData.value.symbol.toUpperCase(),
        companyName: formData.value.companyName,
      };

  emit('submit', data);
}
</script>
