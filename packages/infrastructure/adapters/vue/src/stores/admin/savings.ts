import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAdminClient } from '@workspace/adapter-common/client/api';

export const useSavingsAdminStore = defineStore('admin-savings', () => {
  // State
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function updateSavingsRate(newRate: number): Promise<{ message: string }> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      const result = await adminClient.updateSavingsRate(newRate);
      return result;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la mise à jour du taux d'épargne";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function applySavingsInterest(): Promise<{ processed: number; message: string }> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      const result = await adminClient.applySavingsInterest();
      return result;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de l'application des intérêts";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError(): void {
    error.value = null;
  }

  return {
    // State
    loading,
    error,

    // Actions
    updateSavingsRate,
    applySavingsInterest,
    clearError,
  };
});
