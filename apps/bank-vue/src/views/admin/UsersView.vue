<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Gestion des utilisateurs</h1>

    <!-- Users List -->
    <UsersList
      :users="users"
      :loading="isLoading"
      :error="error"
      @create="openCreateDialog"
      @edit="openEditDialog"
      @ban="openBanDialog"
      @delete="openDeleteDialog"
    />

    <!-- User Form Dialog -->
    <UserFormDialog
      :show="showDialog && (dialogMode === 'create' || dialogMode === 'edit')"
      :user="selectedUser"
      :loading="isLoading"
      :error="error"
      @close="closeDialog"
      @submit="handleUserFormSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDialog && dialogMode === 'delete'"
      type="delete"
      title="Supprimer l'utilisateur"
      :message="`Êtes-vous sûr de vouloir supprimer ${selectedUser?.firstName} ${selectedUser?.lastName} ?`"
      confirm-text="Supprimer"
      :loading="isLoading"
      :error="error"
      @close="closeDialog"
      @confirm="handleDeleteConfirm"
    />

    <!-- Ban Confirmation Dialog -->
    <ConfirmDialog
      :show="showDialog && dialogMode === 'ban'"
      type="ban"
      title="Bannir l'utilisateur"
      :message="`Êtes-vous sûr de vouloir bannir ${selectedUser?.firstName} ${selectedUser?.lastName} ?`"
      confirm-text="Bannir"
      :loading="isLoading"
      :error="error"
      @close="closeDialog"
      @confirm="handleBanConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  UsersList,
  UserFormDialog,
  ConfirmDialog,
} from '@workspace/adapter-vue';
import { useUserManagement } from '@workspace/adapter-vue/composables';

const {
  users,
  isLoading,
  error,
  selectedUser,
  showDialog,
  dialogMode,
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
} = useUserManagement();

onMounted(() => {
  loadUsers();
});

async function handleUserFormSubmit(data: any) {
  try {
    if (dialogMode.value === 'create') {
      await handleCreateUser(data);
    } else if (dialogMode.value === 'edit' && selectedUser.value) {
      await handleUpdateUser(selectedUser.value.id, data);
    }
  } catch (err) {
    // Error is handled by the composable
  }
}

async function handleDeleteConfirm() {
  if (selectedUser.value) {
    try {
      await handleDeleteUser(selectedUser.value.id);
    } catch (err) {
      // Error is handled by the composable
    }
  }
}

async function handleBanConfirm(reason?: string) {
  if (selectedUser.value) {
    try {
      await handleBanUser(selectedUser.value.id, reason);
    } catch (err) {
      // Error is handled by the composable
    }
  }
}
</script>
