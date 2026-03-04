<template>
  <div class="item-detail-view" v-if="item">
    <ItemCard :item="item" />

    <div class="p-3">
      <div class="d-flex align-items-center gap-3 mb-3">
        <img
          :src="ownerAvatar || '/default-avatar.png'"
          alt="Dono"
          class="item-detail-view__avatar"
        />
        <div>
          <h6 class="mb-0">{{ item.user?.name }}</h6>
          <small class="text-muted">
            {{ item.user?.city }}{{ item.user?.state ? `, ${item.user.state}` : '' }}
          </small>
        </div>
      </div>

      <div class="d-flex gap-2">
        <!-- Owner actions -->
        <template v-if="isOwner">
          <button
            class="btn btn-escambo flex-grow-1"
            @click="router.push(`/items/${item.id}/edit`)"
          >
            ✏️ Editar Item
          </button>
        </template>

        <!-- Non-owner actions -->
        <template v-else>
          <button
            class="btn btn-escambo flex-grow-1"
            @click="handleLike"
            :disabled="liking"
          >
            <span v-if="liking" class="spinner-border spinner-border-sm me-1"></span>
            ❤️ Quero trocar!
          </button>
        </template>

        <button class="btn btn-outline-secondary" @click="$router.back()">
          Voltar
        </button>
      </div>
    </div>

    <MatchAnimation
      :visible="showMatch"
      :my-item="matchData?.myItem"
      :their-item="matchData?.theirItem"
      @chat="goToChat"
      @close="showMatch = false"
    />
  </div>

  <AppLoader v-else />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLikesStore } from '@/stores/likes';
import itemService from '@/services/itemService';
import ItemCard from '@/components/items/ItemCard.vue';
import MatchAnimation from '@/components/match/MatchAnimation.vue';
import AppLoader from '@/components/common/AppLoader.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const likesStore = useLikesStore();

const item = ref(null);
const liking = ref(false);
const showMatch = ref(false);
const matchData = ref(null);

const isOwner = computed(() => {
  if (!item.value || !authStore.user) return false;
  return Number(item.value.user_id) === Number(authStore.user.id);
});

const ownerAvatar = computed(() => {
  const url = item.value?.user?.avatar_url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
});

onMounted(async () => {
  try {
    const { data } = await itemService.getById(route.params.id);
    item.value = data.data;
  } catch {
    router.replace('/feed');
  }
});

const handleLike = async () => {
  liking.value = true;
  try {
    const result = await likesStore.likeItem(item.value.id);
    if (result?.match) {
      matchData.value = {
        myItem: result.match.my_item,
        theirItem: result.match.their_item,
      };
      showMatch.value = true;
    }
  } catch {
    // silently fail
  } finally {
    liking.value = false;
  }
};

const goToChat = () => {
  showMatch.value = false;
  if (matchData.value?.match?.id) {
    router.push(`/chat/${matchData.value.match.id}`);
  }
};
</script>

<style scoped lang="scss">
.item-detail-view {
  padding-bottom: 80px;

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
