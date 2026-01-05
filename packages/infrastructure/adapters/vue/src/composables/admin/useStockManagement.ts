import { ref, computed } from 'vue';
import { useStocksAdminStore } from '../../stores/admin';
import type { StockDto } from '@workspace/application/dtos';

export function useStockManagement() {
  const stocksStore = useStocksAdminStore();
  const selectedStock = ref<StockDto | null>(null);
  const showDialog = ref(false);
  const dialogMode = ref<'create' | 'edit' | 'delete' | 'toggle'>('create');

  const isLoading = computed(() => stocksStore.loading);
  const error = computed(() => stocksStore.error);
  const stocks = computed(() => stocksStore.stocks);

  async function loadStocks() {
    try {
      await stocksStore.fetchStocks();
    } catch (err) {
      console.error('Erreur lors du chargement des actions:', err);
    }
  }

  function openCreateDialog() {
    selectedStock.value = null;
    dialogMode.value = 'create';
    showDialog.value = true;
  }

  function openEditDialog(stock: StockDto) {
    selectedStock.value = stock;
    dialogMode.value = 'edit';
    showDialog.value = true;
  }

  function openDeleteDialog(stock: StockDto) {
    selectedStock.value = stock;
    dialogMode.value = 'delete';
    showDialog.value = true;
  }

  function closeDialog() {
    showDialog.value = false;
    selectedStock.value = null;
    stocksStore.clearError();
  }

  async function handleCreateStock(data: {
    symbol: string;
    companyName: string;
  }) {
    try {
      await stocksStore.createStock(data);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  async function handleUpdateStock(
    stockId: string,
    data: {
      companyName?: string;
    },
  ) {
    try {
      await stocksStore.updateStock(stockId, data);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  async function handleDeleteStock(stockId: string) {
    try {
      await stocksStore.deleteStock(stockId);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  async function handleToggleAvailability(stockId: string, available: boolean) {
    try {
      await stocksStore.toggleStockAvailability(stockId, available);
    } catch (err) {
      throw err;
    }
  }

  return {
    // State
    stocks,
    isLoading,
    error,
    selectedStock,
    showDialog,
    dialogMode,

    // Methods
    loadStocks,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeDialog,
    handleCreateStock,
    handleUpdateStock,
    handleDeleteStock,
    handleToggleAvailability,
  };
}
