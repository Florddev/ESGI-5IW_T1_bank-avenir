<script setup lang="ts">
import { LoginForm } from '@workspace/adapter-vue/components';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLoginSuccess = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen">
    <LoginForm @success="handleLoginSuccess" />
  </div>
</template>
