import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAuthClient } from '@workspace/adapter-common/client/api';
import type { AuthResponseDto, RegisterUserDto, LoginDto } from '@workspace/application/dtos';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthResponseDto | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => user.value !== null);

  // Actions
  async function login(email: string, password: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const authClient = getAuthClient();
      const loginData: LoginDto = { email, password };
      const response = await authClient.login(loginData);
      user.value = response;
    } catch (err: any) {
      error.value = err.message || 'Une erreur est survenue lors de la connexion';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterUserDto): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const authClient = getAuthClient();
      await authClient.register(data);
      // Ne pas définir user ici car l'utilisateur doit confirmer son compte
    } catch (err: any) {
      error.value = err.message || "Une erreur est survenue lors de l'inscription";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const authClient = getAuthClient();
      const response = await authClient.getCurrentUser();
      user.value = response;
    } catch (err: any) {
      error.value = err.message || 'Impossible de récupérer les informations utilisateur';
      user.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const authClient = getAuthClient();
      await authClient.logout();
      user.value = null;
    } catch (err: any) {
      error.value = err.message || 'Une erreur est survenue lors de la déconnexion';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    user,
    loading,
    error,
    
    // Computed
    isAuthenticated,
    
    // Actions
    login,
    register,
    fetchCurrentUser,
    logout,
  };
});
