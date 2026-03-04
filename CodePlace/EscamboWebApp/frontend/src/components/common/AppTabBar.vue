<template>
  <nav class="tab-bar">
    <router-link v-for="tab in tabs" :key="tab.name" :to="tab.to" class="tab-item" :class="{ active: isActive(tab.to) }">
      <span class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const tabs = [
  { name: 'feed', to: '/feed', icon: '🏠', label: 'Feed' },
  { name: 'likes', to: '/likes', icon: '❤️', label: 'Curtidas' },
  { name: 'my-items', to: '/my-items', icon: '📦', label: 'Meus Itens' },
  { name: 'matches', to: '/matches', icon: '🔄', label: 'Matches' },
  { name: 'profile', to: '/profile', icon: '👤', label: 'Perfil' },
];

const isActive = (to) => route.path === to;
</script>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  font-size: 0.7rem;
  transition: color 0.2s;
  padding: 4px 12px;

  &.active {
    color: #2ecc71;
  }

  .tab-icon {
    font-size: 1.4rem;
    margin-bottom: 2px;
  }

  .tab-label {
    font-weight: 500;
  }
}
</style>
