<template>
  <div v-if="visible" class="match-animation" @click="$emit('close')">
      <div class="match-animation__content">
        <h1 class="match-animation__title">🎉 Match!</h1>
        <p class="match-animation__subtitle">Vocês querem trocar itens!</p>
        <div class="match-animation__items">
          <div class="match-animation__item">
            <img :src="myItem?.photo || '/placeholder-item.png'" alt="Meu item" />
            <span>{{ myItem?.title }}</span>
          </div>
          <span class="match-animation__swap">🔄</span>
          <div class="match-animation__item">
            <img :src="theirItem?.photo || '/placeholder-item.png'" alt="Item do outro" />
            <span>{{ theirItem?.title }}</span>
          </div>
        </div>
        <button class="btn btn-escambo btn-lg mt-4" @click="$emit('chat')">
          💬 Conversar
        </button>
        <button class="btn btn-outline-light mt-2" @click="$emit('close')">
          Continuar
        </button>
      </div>
    </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  myItem: { type: Object, default: null },
  theirItem: { type: Object, default: null },
});

defineEmits(['close', 'chat']);
</script>

<style scoped lang="scss">
.match-animation {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 46, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: zoom-in 0.4s ease;

  &__content {
    text-align: center;
    color: white;
    padding: 24px;
  }

  &__title {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: pulse 1s ease-in-out infinite alternate;
  }

  &__subtitle {
    font-size: 1.1rem;
    opacity: 0.8;
    margin-bottom: 24px;
  }

  &__items {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  &__item {
    text-align: center;

    img {
      width: 90px;
      height: 90px;
      border-radius: 16px;
      object-fit: cover;
      border: 3px solid #2ecc71;
    }

    span {
      display: block;
      margin-top: 6px;
      font-size: 0.8rem;
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__swap {
    font-size: 2rem;
    animation: spin 2s linear infinite;
  }
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
</style>
