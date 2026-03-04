<template>
  <div
    class="swipeable-item"
    :style="cardStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="swipe-indicator swipe-like" :style="{ opacity: likeOpacity }">
      ❤️ QUERO
    </div>
    <div class="swipe-indicator swipe-nope" :style="{ opacity: nopeOpacity }">
      ✕ PASSO
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['swipe-left', 'swipe-right']);

const startX = ref(0);
const currentX = ref(0);
const isDragging = ref(false);
const threshold = 100;

const offset = computed(() => (isDragging.value ? currentX.value - startX.value : 0));
const likeOpacity = computed(() => Math.min(Math.max(offset.value / threshold, 0), 1));
const nopeOpacity = computed(() => Math.min(Math.max(-offset.value / threshold, 0), 1));

const cardStyle = computed(() => ({
  transform: `translateX(${offset.value}px) rotate(${offset.value * 0.05}deg)`,
  transition: isDragging.value ? 'none' : 'transform 0.4s ease',
}));

const onTouchStart = (e) => {
  startX.value = e.touches[0].clientX;
  isDragging.value = true;
};

const onTouchMove = (e) => {
  if (!isDragging.value) return;
  currentX.value = e.touches[0].clientX;
};

const onTouchEnd = () => {
  isDragging.value = false;
  if (offset.value > threshold) {
    emit('swipe-right');
  } else if (offset.value < -threshold) {
    emit('swipe-left');
  }
  startX.value = 0;
  currentX.value = 0;
};
</script>

<style scoped lang="scss">
.swipeable-item {
  position: relative;
  touch-action: pan-y;
  user-select: none;
}

.swipe-indicator {
  position: absolute;
  top: 20px;
  z-index: 10;
  font-size: 1.5rem;
  font-weight: 900;
  padding: 6px 16px;
  border-radius: 8px;
  border: 3px solid;
  pointer-events: none;

  &.swipe-like {
    right: 20px;
    color: #2ecc71;
    border-color: #2ecc71;
    transform: rotate(15deg);
  }

  &.swipe-nope {
    left: 20px;
    color: #e74c3c;
    border-color: #e74c3c;
    transform: rotate(-15deg);
  }
}
</style>
