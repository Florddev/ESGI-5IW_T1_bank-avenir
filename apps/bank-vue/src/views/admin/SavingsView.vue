<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Gestion de l'épargne</h1>

    <!-- Savings Manager -->
    <SavingsManager
      :loading="isLoading"
      :error="error"
      :success-message="successMessage"
      @update-rate="openRateDialog"
      @apply-interest="handleApplyInterest"
    />

    <!-- Savings Rate Dialog -->
    <SavingsRateDialog
      :show="showRateDialog"
      :loading="isLoading"
      :error="error"
      :success-message="successMessage"
      @close="closeRateDialog"
      @submit="handleUpdateRate"
    />
  </div>
</template>

<script setup lang="ts">
import {
  SavingsManager,
  SavingsRateDialog,
} from '@workspace/adapter-vue';
import { useSavingsManagement } from '@workspace/adapter-vue/composables';

const {
  isLoading,
  error,
  showRateDialog,
  successMessage,
  openRateDialog,
  closeRateDialog,
  handleUpdateRate,
  handleApplyInterest,
} = useSavingsManagement();
</script>
