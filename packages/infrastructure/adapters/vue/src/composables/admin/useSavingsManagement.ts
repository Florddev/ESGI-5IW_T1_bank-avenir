import { ref, computed } from 'vue';
import { useSavingsAdminStore } from '../../stores/admin';

export function useSavingsManagement() {
  const savingsStore = useSavingsAdminStore();
  const showRateDialog = ref(false);
  const successMessage = ref<string | null>(null);

  const isLoading = computed(() => savingsStore.loading);
  const error = computed(() => savingsStore.error);

  function openRateDialog() {
    showRateDialog.value = true;
    successMessage.value = null;
  }

  function closeRateDialog() {
    showRateDialog.value = false;
    savingsStore.clearError();
    successMessage.value = null;
  }

  async function handleUpdateRate(newRate: number) {
    try {
      const result = await savingsStore.updateSavingsRate(newRate);
      successMessage.value = result.message;
      setTimeout(() => {
        closeRateDialog();
      }, 2000);
    } catch (err) {
      throw err;
    }
  }

  async function handleApplyInterest() {
    try {
      const result = await savingsStore.applySavingsInterest();
      successMessage.value = `${result.processed} compte(s) traité(s). ${result.message}`;
      setTimeout(() => {
        successMessage.value = null;
      }, 3000);
    } catch (err) {
      throw err;
    }
  }

  return {
    // State
    isLoading,
    error,
    showRateDialog,
    successMessage,

    // Methods
    openRateDialog,
    closeRateDialog,
    handleUpdateRate,
    handleApplyInterest,
  };
}
