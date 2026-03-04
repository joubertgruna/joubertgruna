<template>
  <div class="feed-view">
    <div class="feed-view__header p-3">
      <h5 class="mb-1">Descubra Itens</h5>
      <div class="d-flex gap-2 overflow-auto pb-2">
        <button
          v-for="cat in categories"
          :key="cat"
          class="btn btn-sm"
          :class="selectedCategory === cat ? 'btn-escambo' : 'btn-outline-secondary'"
          @click="filterByCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <FeedGrid
      :items="itemsStore.feedItems"
      :loading="itemsStore.loading"
      @select="goToItem"
    />

    <div v-if="itemsStore.hasMore" class="text-center py-3">
      <button class="btn btn-outline-success btn-sm" @click="loadMore">
        Carregar mais
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useItemsStore } from '@/stores/items';
import FeedGrid from '@/components/feed/FeedGrid.vue';

const router = useRouter();
const itemsStore = useItemsStore();
const selectedCategory = ref('Todos');

const categories = [
  'Todos', 'Eletrônicos', 'Roupas', 'Livros', 'Esportes',
  'Móveis', 'Games', 'Instrumentos', 'Veículos', 'Colecionáveis', 'Outros',
];

onMounted(() => {
  if (itemsStore.feedItems.length === 0) {
    itemsStore.fetchFeed();
  }
});

const filterByCategory = (cat) => {
  selectedCategory.value = cat;
  itemsStore.fetchFeed({ category: cat === 'Todos' ? undefined : cat });
};

const loadMore = () => {
  const nextPage = itemsStore.pagination.page + 1;
  itemsStore.fetchFeed({
    page: nextPage,
    category: selectedCategory.value === 'Todos' ? undefined : selectedCategory.value,
    append: true,
  });
};

const goToItem = (item) => {
  router.push(`/items/${item.id}`);
};
</script>

<style scoped lang="scss">
.feed-view {
  padding-bottom: 70px;
  &__header {
    background: white;
    position: sticky;
    top: 56px;
    z-index: 100;
    h5 { font-weight: 700; }
    .btn-sm { white-space: nowrap; font-size: 0.8rem; }
  }
}
</style>
