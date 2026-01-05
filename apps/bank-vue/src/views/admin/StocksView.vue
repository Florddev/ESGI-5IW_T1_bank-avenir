<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Gestion des actions</h1>

    <!-- Stocks List -->
    <StocksList
      :stocks="stocks"
      :loading="isLoading"
      :error="error"
      @create="openCreateDialog"
      @edit="openEditDialog"
      @toggle-availability="handleToggle"
      @delete="openDeleteDialog"
    />

    <!-- Stock Form Dialog -->
    <StockFormDialog
      :show="showDialog && (dialogMode === 'create' || dialogMode === 'edit')"
      :stock="selectedStock"
      :loading="isLoading"
      :error="error"
      @close="closeDialog"
      @submit="handleStockFormSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDialog && dialogMode === 'delete'"
      type="delete"
      title="Supprimer l'action"
      :message="`Êtes-vous sûr de vouloir supprimer l'action ${selectedStock?.symbol} ?`"
      confirm-text="Supprimer"
      :loading="isLoading"
      :error="error"
      @close="closeDialog"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  StocksList,
  StockFormDialog,
  ConfirmDialog,
} from '@workspace/adapter-vue';
import { useStockManagement } from '@workspace/adapter-vue/composables';
import type { StockDto } from '@workspace/application/dtos';

const {
  stocks,
  isLoading,
  error,
  selectedStock,
  showDialog,
  dialogMode,
  loadStocks,
  openCreateDialog,
  openEditDialog,
  openDeleteDialog,
  closeDialog,
  handleCreateStock,
  handleUpdateStock,
  handleDeleteStock,
  handleToggleAvailability,
} = useStockManagement();

onMounted(() => {
  loadStocks();
});

async function handleStockFormSubmit(data: any) {
  try {
    if (dialogMode.value === 'create') {
      await handleCreateStock(data);
    } else if (dialogMode.value === 'edit' && selectedStock.value) {
      await handleUpdateStock(selectedStock.value.id, data);
    }
  } catch (err) {
    // Error is handled by the composable
  }
}

async function handleToggle(stock: StockDto) {
  try {
    const newAvailability = stock.status === 'AVAILABLE' ? false : true;
    await handleToggleAvailability(stock.id, newAvailability);
  } catch (err) {
    // Error is handled by the composable
  }
}

async function handleDeleteConfirm() {
  if (selectedStock.value) {
    try {
      await handleDeleteStock(selectedStock.value.id);
    } catch (err) {
      // Error is handled by the composable
    }
  }
}
</script>
