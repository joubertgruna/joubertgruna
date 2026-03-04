import { ref, onMounted, onUnmounted } from 'vue';

export function useSwipe(el, { onSwipeLeft, onSwipeRight, threshold = 80 } = {}) {
  const startX = ref(0);
  const startY = ref(0);
  const deltaX = ref(0);
  const swiping = ref(false);

  const handleTouchStart = (e) => {
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
    swiping.value = true;
    deltaX.value = 0;
  };

  const handleTouchMove = (e) => {
    if (!swiping.value) return;
    deltaX.value = e.touches[0].clientX - startX.value;
  };

  const handleTouchEnd = () => {
    if (!swiping.value) return;
    swiping.value = false;

    if (deltaX.value > threshold && onSwipeRight) {
      onSwipeRight();
    } else if (deltaX.value < -threshold && onSwipeLeft) {
      onSwipeLeft();
    }

    deltaX.value = 0;
  };

  onMounted(() => {
    const element = el.value;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: true });
      element.addEventListener('touchend', handleTouchEnd);
    }
  });

  onUnmounted(() => {
    const element = el.value;
    if (element) {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    }
  });

  return { deltaX, swiping };
}
