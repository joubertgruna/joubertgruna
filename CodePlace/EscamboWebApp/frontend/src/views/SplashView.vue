<template>
  <div class="splash-view">
    <div class="splash-view__content">
      <h1 class="splash-view__logo">🔄 Escambo</h1>
      <p class="splash-view__tagline">Troque o que tem pelo que quer</p>
      <div class="spinner-border text-light mt-4" role="status"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      router.replace('/feed');
    } else {
      router.replace('/login');
    }
  }, 2000);
});
</script>

<style scoped lang="scss">
.splash-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    text-align: center;
    color: white;
  }

  &__logo {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__tagline {
    font-size: 1.1rem;
    opacity: 0.7;
    margin-top: 8px;
  }
}
</style>
