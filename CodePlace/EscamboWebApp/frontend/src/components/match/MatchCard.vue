<template>
  <div class="match-card escambo-card p-3" @click="$emit('click')">
    <div class="d-flex align-items-center gap-3">
      <img
        :src="avatarUrl"
        :alt="match.other_user?.name"
        class="match-card__avatar"
      />
      <div class="match-card__info flex-grow-1">
        <h6 class="mb-0">{{ match.other_user?.name }}</h6>
        <p class="text-muted small mb-0">
          {{ match.my_item?.title }} ↔ {{ match.their_item?.title }}
        </p>
      </div>
      <span class="text-muted small">{{ timeAgo }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const props = defineProps({
  match: { type: Object, required: true },
});

defineEmits(['click']);

const avatarUrl = computed(() => {
  const url = props.match.other_user?.avatar_url;
  if (!url) return '/default-avatar.png';
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
});

const timeAgo = computed(() => {
  const now = new Date();
  const created = new Date(props.match.created_at);
  const diffMs = now - created;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
});
</script>

<style scoped lang="scss">
.match-card {
  cursor: pointer;
  transition: background 0.15s;

  &:active {
    background: #f8f8f8;
  }

  &__avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__info {
    min-width: 0;

    h6 {
      font-weight: 600;
      font-size: 0.95rem;
    }

    p {
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
