<template>
  <div class="chat-list">
    <router-link
      v-for="match in matches"
      :key="match.id"
      :to="`/chat/${match.id}`"
      class="chat-list__item"
    >
      <img
        :src="avatarUrl(match.other_user)"
        :alt="match.other_user?.name"
        class="chat-list__avatar"
      />
      <div class="chat-list__info">
        <h6 class="mb-0">{{ match.other_user?.name }}</h6>
        <p class="text-muted mb-0 small text-truncate">
          {{ match.last_message || 'Diga olá! 👋' }}
        </p>
      </div>
      <span v-if="match.unread_count" class="chat-list__badge badge bg-success">
        {{ match.unread_count }}
      </span>
    </router-link>

    <p v-if="matches.length === 0" class="text-center text-muted py-5">
      Nenhuma conversa ainda
    </p>
  </div>
</template>

<script setup>
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

defineProps({
  matches: { type: Array, default: () => [] },
});

const avatarUrl = (user) => {
  const url = user?.avatar_url;
  if (!url) return '/default-avatar.png';
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};
</script>

<style scoped lang="scss">
.chat-list {
  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.15s;

    &:active {
      background: #f8f8f8;
    }
  }

  &__avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;

    h6 {
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      font-size: 0.8rem;
      max-width: 200px;
    }
  }

  &__badge {
    font-size: 0.7rem;
    border-radius: 10px;
    min-width: 22px;
  }
}
</style>
