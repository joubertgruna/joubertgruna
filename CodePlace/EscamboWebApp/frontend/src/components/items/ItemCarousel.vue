<template>
  <div class="item-carousel">
    <div
      :id="carouselId"
      class="carousel slide"
      data-bs-ride="false"
    >
      <div class="carousel-indicators" v-if="photos.length > 1">
        <button
          v-for="(_, i) in photos"
          :key="i"
          type="button"
          :data-bs-target="`#${carouselId}`"
          :data-bs-slide-to="i"
          :class="{ active: i === 0 }"
        ></button>
      </div>

      <div class="carousel-inner">
        <div
          v-for="(photo, i) in photos"
          :key="photo.id || i"
          class="carousel-item"
          :class="{ active: i === 0 }"
        >
          <img
            :src="photoUrl(photo)"
            :alt="`Foto ${i + 1}`"
            class="d-block w-100 carousel-photo"
            loading="lazy"
            @click="openLightbox(i)"
          />
        </div>

        <div v-if="photos.length === 0" class="carousel-item active">
          <div class="placeholder-img d-flex align-items-center justify-content-center">
            <span class="text-muted">📷 Sem fotos</span>
          </div>
        </div>
      </div>

      <template v-if="photos.length > 1">
        <button
          class="carousel-control-prev"
          type="button"
          :data-bs-target="`#${carouselId}`"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          :data-bs-target="`#${carouselId}`"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon"></span>
        </button>
      </template>
    </div>

    <span class="photo-counter badge bg-dark" v-if="photos.length > 1">
      {{ photos.length }} fotos
    </span>

    <!-- Lightbox Modal -->
    <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-container" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">×</button>
        
        <button class="lightbox-nav lightbox-prev" @click="prevPhoto" v-if="photos.length > 1">
          ❮
        </button>
        
        <img 
          :src="photoUrl(photos[currentPhotoIndex])" 
          :alt="`Foto ${currentPhotoIndex + 1}`"
          class="lightbox-image"
        />
        
        <button class="lightbox-nav lightbox-next" @click="nextPhoto" v-if="photos.length > 1">
          ❯
        </button>

        <div class="lightbox-counter" v-if="photos.length > 1">
          {{ currentPhotoIndex + 1 }} / {{ photos.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  photos: { type: Array, default: () => [] },
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const carouselId = computed(() => `carousel-${Math.random().toString(36).slice(2, 9)}`);

// Lightbox state
const showLightbox = ref(false);
const currentPhotoIndex = ref(0);

const photoUrl = (photo) => {
  if (!photo.url) return '';
  return photo.url.startsWith('http') ? photo.url : `${BASE_URL}${photo.url}`;
};

const openLightbox = (index) => {
  currentPhotoIndex.value = index;
  showLightbox.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  showLightbox.value = false;
  document.body.style.overflow = 'auto';
};

const nextPhoto = () => {
  if (currentPhotoIndex.value < props.photos.length - 1) {
    currentPhotoIndex.value++;
  }
};

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
  }
};
</script>

<style scoped lang="scss">
.item-carousel {
  position: relative;
  background: #f0f0f0;

  .carousel-inner img {
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .carousel-photo {
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  .placeholder-img {
    aspect-ratio: 4 / 3;
    background: #e9e9e9;
    font-size: 1.1rem;
  }

  .photo-counter {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 0.7rem;
    opacity: 0.85;
  }

  /* Lightbox Styles */
  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.2s ease;
  }

  .lightbox-container {
    position: relative;
    width: 90vw;
    height: 90vh;
    max-width: 1200px;
    max-height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    animation: slideIn 0.3s ease;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2.5rem;
    cursor: pointer;
    padding: 0;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 10px 15px;
    border-radius: 4px;
    transition: background 0.2s ease;
    z-index: 10000;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }

  .lightbox-prev {
    left: 20px;
  }

  .lightbox-next {
    right: 20px;
  }

  .lightbox-counter {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    .lightbox-close {
      top: 10px;
      right: 10px;
    }

    .lightbox-nav {
      font-size: 1.5rem;
      padding: 8px 12px;
    }

    .lightbox-prev {
      left: 10px;
    }

    .lightbox-next {
      right: 10px;
    }

    .lightbox-counter {
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
