import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@workspace/adapter-vue/stores';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresDirector: true },
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/UsersView.vue'),
      meta: { requiresAuth: true, requiresDirector: true },
    },
    {
      path: '/admin/stocks',
      name: 'AdminStocks',
      component: () => import('@/views/admin/StocksView.vue'),
      meta: { requiresAuth: true, requiresDirector: true },
    },
    {
      path: '/admin/savings',
      name: 'AdminSavings',
      component: () => import('@/views/admin/SavingsView.vue'),
      meta: { requiresAuth: true, requiresDirector: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Try to fetch user if not loaded
  if (!authStore.user && to.meta.requiresAuth) {
    try {
      await authStore.fetchCurrentUser();
    } catch (e) {
      // User not authenticated, will be redirected to login
      console.error('User not authenticated');
    }
  }

  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login page
    next('/login');
    return;
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (to.path === '/login' && authStore.isAuthenticated && authStore.user?.role === 'DIRECTOR') {
    next('/');
    return;
  }

  // Check Director role for admin routes
  if (to.meta.requiresDirector && authStore.user?.role !== 'DIRECTOR') {
    console.error('Access denied: Director role required');
    next('/');
    return;
  }

  next();
});

export default router;
