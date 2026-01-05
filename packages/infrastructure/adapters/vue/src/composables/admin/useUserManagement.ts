import { ref, computed } from 'vue';
import { useUsersAdminStore } from '../../stores/admin';
import type { UserDto } from '@workspace/application/dtos';

export function useUserManagement() {
  const usersStore = useUsersAdminStore();
  const selectedUser = ref<UserDto | null>(null);
  const showDialog = ref(false);
  const dialogMode = ref<'create' | 'edit' | 'delete' | 'ban'>('create');

  const isLoading = computed(() => usersStore.loading);
  const error = computed(() => usersStore.error);
  const users = computed(() => usersStore.users);

  async function loadUsers() {
    try {
      await usersStore.fetchUsers();
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    }
  }

  function openCreateDialog() {
    selectedUser.value = null;
    dialogMode.value = 'create';
    showDialog.value = true;
  }

  function openEditDialog(user: UserDto) {
    selectedUser.value = user;
    dialogMode.value = 'edit';
    showDialog.value = true;
  }

  function openDeleteDialog(user: UserDto) {
    selectedUser.value = user;
    dialogMode.value = 'delete';
    showDialog.value = true;
  }

  function openBanDialog(user: UserDto) {
    selectedUser.value = user;
    dialogMode.value = 'ban';
    showDialog.value = true;
  }

  function closeDialog() {
    showDialog.value = false;
    selectedUser.value = null;
    usersStore.clearError();
  }

  async function handleCreateUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    try {
      await usersStore.createUser(data);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  async function handleUpdateUser(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      email?: string;
    },
  ) {
    try {
      await usersStore.updateUser(userId, data);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  async function handleDeleteUser(userId: string) {
    try {
      await usersStore.deleteUser(userId);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  async function handleBanUser(userId: string, reason?: string) {
    try {
      await usersStore.banUser(userId, reason);
      closeDialog();
    } catch (err) {
      throw err;
    }
  }

  return {
    // State
    users,
    isLoading,
    error,
    selectedUser,
    showDialog,
    dialogMode,

    // Methods
    loadUsers,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    openBanDialog,
    closeDialog,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleBanUser,
  };
}
