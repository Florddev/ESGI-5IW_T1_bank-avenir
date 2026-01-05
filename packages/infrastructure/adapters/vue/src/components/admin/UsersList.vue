<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Gestion des utilisateurs</h2>
      <button
        @click="$emit('create')"
        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Créer un utilisateur
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="px-6 py-8 text-center text-gray-500">
      Chargement...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-6 py-4 bg-red-50 text-red-700">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="px-6 py-8 text-center text-gray-500">
      Aucun utilisateur
    </div>

    <!-- Users Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rôle
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'DIRECTOR',
                  'bg-blue-100 text-blue-800': user.role === 'CLIENT',
                }"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': user.status === 'ACTIVE',
                  'bg-gray-100 text-gray-800': user.status === 'PENDING',
                  'bg-red-100 text-red-800': user.status === 'BANNED',
                }"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="$emit('edit', user)"
                class="text-blue-600 hover:text-blue-900"
              >
                Modifier
              </button>
              <button
                v-if="user.status !== 'BANNED'"
                @click="$emit('ban', user)"
                class="text-orange-600 hover:text-orange-900"
              >
                Bannir
              </button>
              <button
                @click="$emit('delete', user)"
                class="text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserDto } from '@workspace/application/dtos';

defineProps<{
  users: UserDto[];
  loading?: boolean;
  error?: string | null;
}>();

defineEmits<{
  create: [];
  edit: [user: UserDto];
  ban: [user: UserDto];
  delete: [user: UserDto];
}>();
</script>
