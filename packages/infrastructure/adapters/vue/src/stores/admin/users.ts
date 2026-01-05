import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAdminClient } from '@workspace/adapter-common/client/api';
import type { UserDto } from '@workspace/application/dtos';

export const useUsersAdminStore = defineStore('admin-users', () => {
  // State
  const users = ref<UserDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchUsers(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      users.value = await adminClient.getAllUsers();
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la récupération des utilisateurs';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }): Promise<UserDto> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      const newUser = await adminClient.createUser(data);
      users.value.push(newUser);
      return newUser;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la création de l'utilisateur";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
    },
  ): Promise<UserDto> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      const updatedUser = await adminClient.updateUser(userId, data);
      
      const index = users.value.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      
      return updatedUser;
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la mise à jour de l'utilisateur";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(userId: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      await adminClient.deleteUser(userId);
      
      users.value = users.value.filter((u) => u.id !== userId);
    } catch (err: any) {
      error.value = err.message || "Erreur lors de la suppression de l'utilisateur";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function banUser(userId: string, reason?: string): Promise<UserDto> {
    loading.value = true;
    error.value = null;

    try {
      const adminClient = getAdminClient();
      const bannedUser = await adminClient.banUser(userId, reason);
      
      const index = users.value.findIndex((u) => u.id === userId);
      if (index !== -1) {
        users.value[index] = bannedUser;
      }
      
      return bannedUser;
    } catch (err: any) {
      error.value = err.message || "Erreur lors du bannissement de l'utilisateur";
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
    users,
    loading,
    error,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    banUser,
    clearError,
  };
});
