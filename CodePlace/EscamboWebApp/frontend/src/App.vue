<template>
  <div id="escambo-app">
    <AppNavbar v-if="isAuthenticated && !isSplash" />
    <main class="app-main" :class="{ 'with-navbar': isAuthenticated && !isSplash, 'with-tabbar': isAuthenticated && !isSplash }">
      <Transition name="fade-slide" mode="out-in">
        <router-view :key="$route.fullPath" />
      </Transition>
    </main>
    <AppTabBar v-if="isAuthenticated && !isSplash" />
    <OfflineIndicator />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppNavbar from '@/components/common/AppNavbar.vue';
import AppTabBar from '@/components/common/AppTabBar.vue';
import OfflineIndicator from '@/components/common/OfflineIndicator.vue';

const route = useRoute();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isSplash = computed(() => route.name === 'splash');
</script>

<style lang="scss">
#escambo-app {
  min-height: 100vh;
  background-color: #fafafa;
}

.app-main {
  min-height: 100vh;

  &.with-navbar {
    padding-top: 56px;
  }

  &.with-tabbar {
    padding-bottom: 60px;
  }
}

/* Route Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
