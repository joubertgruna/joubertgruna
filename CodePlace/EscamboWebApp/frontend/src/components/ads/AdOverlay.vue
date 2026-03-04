<template>
  <div v-if="ad" class="ad-overlay" @click.self="$emit('close')">
    <div class="ad-overlay__card">
      <button class="ad-overlay__close" @click="$emit('close')">✕</button>
      <a :href="ad.target_url" target="_blank" rel="noopener" @click="onAdClick">
        <img :src="ad.image_url" :alt="ad.title" class="ad-overlay__image" />
      </a>
      <div class="ad-overlay__info p-3">
        <h6>{{ ad.title }}</h6>
        <p class="text-muted small mb-0">{{ ad.description }}</p>
      </div>
      <div class="ad-overlay__footer text-center">
        <span class="text-muted" style="font-size: 0.7rem;">Publicidade</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdsStore } from '@/stores/ads';

const props = defineProps({
  ad: { type: Object, default: null },
});

const emit = defineEmits(['close']);
const adsStore = useAdsStore();

const onAdClick = () => {
  if (props.ad?.id) {
    adsStore.registerClick(props.ad.id);
  }
};
</script>

<style scoped lang="scss">
.ad-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  padding: 24px;

  &__card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    max-width: 360px;
    width: 100%;
    position: relative;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }

  &__image {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  &__info {
    h6 {
      font-weight: 600;
      margin-bottom: 4px;
    }
  }

  &__footer {
    padding: 8px;
    border-top: 1px solid #eee;
  }
}
</style>
