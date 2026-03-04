<template>
  <div v-if="!isOnline" class="offline-bar">
    <span>📡 Sem conexão — modo offline</span>
  </div>
</template>

<script setup>
import { useOnline } from '@/composables/useOnline';

const { isOnline } = useOnline();
</script>

<style scoped lang="scss">
.offline-bar {
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  background: #e74c3c;
  color: white;
  text-align: center;
  padding: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 1050;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
