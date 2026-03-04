<template>
  <div class="likes-view p-3">
    <h5 class="fw-bold mb-3">Curtidas Recebidas</h5>

    <div v-if="likesStore.loading" class="text-center py-5">
      <div class="spinner-border text-success"></div>
    </div>

    <div v-else-if="likesStore.receivedLikes.length === 0" class="text-center py-5">
      <p class="text-muted">Nenhuma curtida recebida ainda 💔</p>
      <p class="text-muted small">Continue publicando itens!</p>
    </div>

    <div v-else class="likes-list">
      <div
        v-for="like in likesStore.receivedLikes"
        :key="like.id"
        class="like-card escambo-card p-3 mb-2"
      >
        <div class="d-flex align-items-center gap-3">
          <!-- Foto do item -->
          <img
            :src="itemPhotoUrl(like.item)"
            :alt="like.item?.title"
            class="like-card__photo"
          />
          <div class="flex-grow-1">
            <h6 class="mb-0">{{ like.item?.title }}</h6>
            <p class="text-muted small mb-0">
              Curtido por <strong>{{ like.user?.name }}</strong>
            </p>
            <p class="text-muted small mb-0">
              {{ like.user?.city }}, {{ like.user?.state }}
            </p>
          </div>
          <button
            class="btn btn-sm btn-escambo"
            @click="$router.push(`/items/${like.item?.id}`)"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLikesStore } from '@/stores/likes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const likesStore = useLikesStore();

const itemPhotoUrl = (item) => {
  if (!item || !item.photos || item.photos.length === 0) {
    return '/default-item.png';
  }
  const photoUrl = item.photos[0].url;
  return photoUrl.startsWith('http') ? photoUrl : `${BASE_URL}${photoUrl}`;
};

const avatarUrl = (user) => {
  const url = user?.avatar_url;
  if (!url) return '/default-avatar.png';
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

onMounted(() => {
  likesStore.fetchReceivedLikes();
});
</script>

<style scoped lang="scss">
.likes-view {
  padding-bottom: 80px;
}

.like-card__photo {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e9ecef;
}
</style>
