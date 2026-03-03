<template>
  <div
    ref="feedItemEl"
    class="feed-item escambo-card"
    @click="handleClick"
    :style="{ transform: `translateX(${deltaX}px)` }"
  >
    <!-- Swipe Feedback Layer -->
    <div class="feed-item__swipe-layer feed-item__swipe-layer--left" v-if="deltaX < -30">
      <span class="swipe-icon">✗</span>
    </div>
    <div class="feed-item__swipe-layer feed-item__swipe-layer--right" v-if="deltaX > 30">
      <span class="swipe-icon">♥</span>
    </div>

    <div class="feed-item__image">
      <img 
        v-if="primaryPhoto" 
        :src="primaryPhoto" 
        :alt="item.title" 
        class="img-fluid"
      />
      <div v-else class="feed-item__placeholder">📦</div>
      <span class="feed-item__badge badge bg-success">
        {{ item.category }}
      </span>
    </div>
    <div class="feed-item__info p-2">
      <h6 class="feed-item__title mb-1">{{ item.title }}</h6>
      <p class="feed-item__condition text-muted mb-0">
        {{ conditionLabel }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useLikesStore } from '@/stores/likes';
import { useSwipe } from '@/composables/useSwipe';

const props = defineProps({
  item: { type: Object, required: true },
});

const emit = defineEmits(['click']);

const feedItemEl = ref(null);
const likesStore = useLikesStore();

const conditions = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
  desgastado: 'Desgastado',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const primaryPhoto = computed(() => {
  if (props.item.primary_photo?.url) {
    return `${BASE_URL}${props.item.primary_photo.url}`;
  }
  if (props.item.photos?.length > 0) {
    const primary = props.item.photos.find((p) => p.is_primary) || props.item.photos[0];
    return `${BASE_URL}${primary.url}`;
  }
  return null;
});

const conditionLabel = computed(() => conditions[props.item.condition] || props.item.condition);

// Swipe Handlers
const { deltaX, swiping } = useSwipe(feedItemEl, {
  onSwipeRight: handleSwipeRight,
  onSwipeLeft: handleSwipeLeft,
  threshold: 80,
});

function handleClick(e) {
  // Só emitir click se não for swipe
  if (!swiping.value && Math.abs(deltaX.value) < 30) {
    emit('click');
  }
}

async function handleSwipeRight() {
  // Swipe direita = LIKE (♥)
  try {
    await likesStore.likeItem(props.item.id);
    // Emit evento de sucesso se necessário
  } catch (err) {
    console.error('Erro ao curtir:', err);
  }
}

async function handleSwipeLeft() {
  // Swipe esquerda = UNLIKE (✗)
  try {
    await likesStore.unlikeItem(props.item.id);
    // Emit evento de sucesso se necessário
  } catch (err) {
    console.error('Erro ao descurtir:', err);
  }
}
</script>

<style scoped lang="scss">
.feed-item {
  cursor: pointer;
  overflow: visible;
  transition: transform 0.1s ease-out;
  position: relative;
  user-select: none;

  &:active { transform: scale(0.97); }

  &__swipe-layer {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    opacity: 0.8;
    transition: opacity 0.15s;

    &--left {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.5), transparent);
    }

    &--right {
      background: linear-gradient(135deg, transparent, rgba(28, 184, 65, 0.5));
    }

    .swipe-icon {
      font-size: 3rem;
      font-weight: bold;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  &__image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: #f0f0f0;
    img { 
      width: 100%; 
      height: 100%; 
      object-fit: cover;
      transition: transform 0.2s;
    }
  }

  &:active &__image img {
    transform: scale(0.98);
  }

  &__badge {
    position: absolute;
    top: 6px;
    left: 6px;
    font-size: 0.65rem;
    z-index: 10;
  }

  &__title {
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__condition { font-size: 0.75rem; }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    background: #e9ecef;
  }
}
</style>
