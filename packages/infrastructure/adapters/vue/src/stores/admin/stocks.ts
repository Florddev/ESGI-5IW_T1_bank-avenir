import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getStocksClient } from '@workspace/adapter-common/client/api';
import type { StockDto } from '@workspace/application/dtos';

export const useStocksAdminStore = defineStore('admin-stocks', () => {
  // State
  const stocks = ref<StockDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchStocks(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const stocksClient = getStocksClient();
      stocks.value = await stocksClient.getAllStocks();
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des actions';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createStock(data: {
    symbol: string;
    companyName: string;
  }): Promise<StockDto> {
    loading.value = true;
    error.value = null;

    try {
      const stocksClient = getStocksClient();
      const newStock = await stocksClient.createStock(data);
      stocks.value.push(newStock);
      return newStock;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la création de l'action";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStock(
    stockId: string,
    data: {
      companyName?: string;
    },
  ): Promise<StockDto> {
    loading.value = true;
    error.value = null;

    try {
      const stocksClient = getStocksClient();
      const updatedStock = await stocksClient.updateStock(stockId, data);
      
      const index = stocks.value.findIndex((s) => s.id === stockId);
      if (index !== -1) {
        stocks.value[index] = updatedStock;
      }
      
      return updatedStock;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la mise à jour de l'action";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteStock(stockId: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const stocksClient = getStocksClient();
      await stocksClient.deleteStock(stockId);
      
      stocks.value = stocks.value.filter((s) => s.id !== stockId);
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la suppression de l'action";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function toggleStockAvailability(stockId: string, available: boolean): Promise<StockDto> {
    loading.value = true;
    error.value = null;

    try {
      const stocksClient = getStocksClient();
      const updatedStock = await stocksClient.toggleStockAvailability(stockId, { available });
      
      const index = stocks.value.findIndex((s) => s.id === stockId);
      if (index !== -1) {
        stocks.value[index] = updatedStock;
      }
      
      return updatedStock;
    } catch (err: any) {
      error.value = err.message || "Erreur lors du changement de disponibilité de l'action";
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
    stocks,
    loading,
    error,

    // Actions
    fetchStocks,
    createStock,
    updateStock,
    deleteStock,
    toggleStockAvailability,
    clearError,
  };
});
