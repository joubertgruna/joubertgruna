<template>
  <div class="loader-overlay" v-if="visible">
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
    <p v-if="message" class="loader-message mt-3">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: true },
  message: { type: String, default: '' },
});
</script>

<style scoped lang="scss">
.loader-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  z-index: 2000;
}

.loader-message {
  color: #333;
  font-size: 0.95rem;
}
</style>
