<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Gestion des actions</h2>
      <button
        @click="$emit('create')"
        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Créer une action
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-8 text-center text-gray-500">
      Chargement...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-6 py-4 bg-red-50 text-red-700">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="stocks.length === 0" class="px-6 py-8 text-center text-gray-500">
      Aucune action
    </div>

    <!-- Stocks Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symbole
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entreprise
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix actuel
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="stock in stocks" :key="stock.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ stock.symbol }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ stock.companyName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatPrice(stock.currentPrice) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': stock.status === 'AVAILABLE',
                  'bg-gray-100 text-gray-800': stock.status === 'UNAVAILABLE',
                }"
              >
                {{ stock.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="$emit('toggleAvailability', stock)"
                :class="[
                  'hover:underline',
                  stock.status === 'AVAILABLE' ? 'text-gray-600' : 'text-green-600'
                ]"
              >
                {{ stock.status === 'AVAILABLE' ? 'Désactiver' : 'Activer' }}
              </button>
              <button
                @click="$emit('edit', stock)"
                class="text-blue-600 hover:text-blue-900"
              >
                Modifier
              </button>
              <button
                @click="$emit('delete', stock)"
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StockDto } from '@workspace/application/dtos';

defineProps<{
  stocks: StockDto[];
  loading?: boolean;
  error?: string | null;
}>();

defineEmits<{
  create: [];
  edit: [stock: StockDto];
  toggleAvailability: [stock: StockDto];
  delete: [stock: StockDto];
}>();

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}
</script>
