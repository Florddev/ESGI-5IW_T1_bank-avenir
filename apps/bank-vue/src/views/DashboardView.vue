<script setup lang="ts">
// Dashboard administrateur
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Tableau de bord administrateur</h1>
      <p class="text-gray-600">Gérez les utilisateurs, les actions et les taux d'épargne de la banque.</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Users Card -->
      <router-link
        to="/admin/users"
        class="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Utilisateurs</h2>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <p class="text-blue-100">Créer, modifier et gérer les comptes utilisateurs</p>
      </router-link>

      <!-- Stocks Card -->
      <router-link
        to="/admin/stocks"
        class="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Actions</h2>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p class="text-purple-100">Gérer les actions disponibles pour les clients</p>
      </router-link>

      <!-- Savings Card -->
      <router-link
        to="/admin/savings"
        class="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Épargne</h2>
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-green-100">Modifier les taux d'intérêt et appliquer les intérêts</p>
      </router-link>
    </div>
  </div>
</template>
