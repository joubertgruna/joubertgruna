<template>
  <div class="profile-view p-3">
    <div class="text-center mb-4">
      <img
        :src="avatarUrl || '/default-avatar.png'"
        alt="Avatar"
        class="profile-view__avatar mb-3"
      />
      <h4 class="fw-bold mb-1">{{ authStore.user?.name }}</h4>
      <p class="text-muted mb-0">
        {{ authStore.user?.city }}{{ authStore.user?.state ? `, ${authStore.user.state}` : '' }}
      </p>
      <p class="text-muted small">{{ authStore.user?.email }}</p>
    </div>

    <div class="profile-view__stats d-flex justify-content-around mb-4">
      <div class="text-center">
        <h5 class="mb-0 text-success">{{ itemsStore.myItems.length }}</h5>
        <small class="text-muted">Itens</small>
      </div>
      <div class="text-center">
        <h5 class="mb-0 text-success">{{ matchesStore.matches.length }}</h5>
        <small class="text-muted">Matches</small>
      </div>
    </div>

    <div class="d-grid gap-2 mb-4">
      <router-link to="/profile/edit" class="btn btn-outline-success">
        ✏️ Editar Perfil
      </router-link>
      <router-link to="/items/new" class="btn btn-escambo">
        ➕ Publicar Item
      </router-link>
    </div>

    <div class="mb-3">
      <h6 class="fw-bold">Meus Itens</h6>
      <div v-if="itemsStore.myItems.length === 0" class="text-muted small">
        Nenhum item publicado
      </div>
      <div v-else class="row g-2">
        <div v-for="item in itemsStore.myItems" :key="item.id" class="col-6">
          <div
            class="escambo-card p-2 cursor-pointer"
            @click="$router.push(`/items/${item.id}`)"
          >
            <img
              :src="getItemPhoto(item) || '/placeholder-item.png'"
              alt=""
              class="w-100 rounded mb-1"
              style="aspect-ratio: 1; object-fit: cover;"
            />
            <small class="fw-bold d-block text-truncate">{{ item.title }}</small>
            <span class="badge" :class="item.status === 'active' ? 'bg-success' : 'bg-secondary'" style="font-size: 0.65rem;">
              {{ item.status === 'active' ? 'Ativo' : item.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-outline-danger w-100 mt-3" @click="handleLogout">
      Sair da Conta
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useItemsStore } from '@/stores/items';
import { useMatchesStore } from '@/stores/matches';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const router = useRouter();
const authStore = useAuthStore();
const itemsStore = useItemsStore();
const matchesStore = useMatchesStore();

const avatarUrl = computed(() => {
  const url = authStore.user?.avatar_url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
});

const getItemPhoto = (item) => {
  const url = item.primary_photo?.url || item.photos?.[0]?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

onMounted(() => {
  itemsStore.fetchMyItems();
  if (matchesStore.matches.length === 0) {
    matchesStore.fetchMatches();
  }
});

const handleLogout = () => {
  authStore.logout();
  router.replace('/login');
};
</script>

<style scoped lang="scss">
.profile-view {
  padding-bottom: 80px;

  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #2ecc71;
  }

  .cursor-pointer {
    cursor: pointer;
  }
}
</style>
