<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">Gestion du taux d'épargne</h2>
    </div>

    <div class="p-6 space-y-6">
      <!-- Update Rate Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Modifier le taux d'intérêt</h3>
        <p class="text-sm text-gray-600 mb-4">
          La modification du taux d'intérêt enverra une notification à tous les détenteurs de comptes épargne.
        </p>
        
        <button
          @click="$emit('updateRate')"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Modifier le taux
        </button>
      </div>

      <div class="border-t border-gray-200"></div>

      <!-- Apply Interest Section -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Appliquer les intérêts</h3>
        <p class="text-sm text-gray-600 mb-4">
          Appliquer les intérêts à tous les comptes épargne en fonction du taux actuel.
        </p>
        
        <button
          @click="$emit('applyInterest')"
          :disabled="loading"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'En cours...' : 'Appliquer les intérêts' }}
        </button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="p-4 bg-green-50 text-green-700 rounded-md">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  error?: string | null;
  successMessage?: string | null;
}>();

defineEmits<{
  updateRate: [];
  applyInterest: [];
}>();
</script>
