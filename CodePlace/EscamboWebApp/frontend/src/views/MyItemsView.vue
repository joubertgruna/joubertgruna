<template>
  <div class="my-items-view">
    <div class="my-items-view__header p-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Meus Itens</h5>
      <router-link to="/items/new" class="btn btn-sm btn-escambo">
        ➕ Novo
      </router-link>
    </div>

    <div v-if="itemsStore.loading" class="text-center py-5">
      <div class="spinner-border text-escambo" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <div v-else-if="itemsStore.myItems.length === 0" class="text-center py-5 text-muted">
      <p class="mb-2">📦</p>
      <p>Nenhum item criado ainda</p>
      <router-link to="/items/new" class="btn btn-sm btn-escambo mt-3">
        Criar primeiro item
      </router-link>
    </div>

    <div v-else class="my-items-view__grid p-3">
      <div v-for="item in itemsStore.myItems" :key="item.id" class="my-item-card escambo-card">
        <div class="my-item-card__image">
          <img
            v-if="getPrimaryPhoto(item)"
            :src="getPrimaryPhoto(item)"
            :alt="item.title"
            class="img-fluid"
          />
          <div v-else class="my-item-card__placeholder">📦</div>
          <span class="my-item-card__badge badge bg-success">
            {{ item.category }}
          </span>
        </div>

        <div class="my-item-card__info p-2">
          <h6 class="my-item-card__title mb-1">{{ item.title }}</h6>
          <p class="my-item-card__condition text-muted mb-2">
            {{ getConditionLabel(item.condition) }}
          </p>

          <div class="my-item-card__actions btn-group btn-group-sm w-100">
            <router-link
              :to="`/items/${item.id}`"
              class="btn btn-outline-primary"
              title="Ver detalhes"
            >
              👁️
            </router-link>
            <router-link
              :to="`/items/${item.id}/edit`"
              class="btn btn-outline-warning"
              title="Editar"
            >
              ✏️
            </router-link>
            <button
              class="btn btn-outline-danger"
              @click="deleteItem(item.id)"
              title="Deletar"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useItemsStore } from '@/stores/items';

const itemsStore = useItemsStore();

const conditions = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
  desgastado: 'Desgastado',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const getPrimaryPhoto = (item) => {
  if (item.primary_photo?.url) {
    return `${BASE_URL}${item.primary_photo.url}`;
  }
  if (item.photos?.length > 0) {
    const primary = item.photos.find((p) => p.is_primary) || item.photos[0];
    return `${BASE_URL}${primary.url}`;
  }
  return null;
};

const getConditionLabel = (condition) => conditions[condition] || condition;

const deleteItem = async (id) => {
  if (confirm('Tem certeza que deseja deletar este item?')) {
    try {
      await itemsStore.deleteItem(id);
      alert('Item deletado com sucesso!');
    } catch (err) {
      alert('Erro ao deletar item: ' + err.message);
    }
  }
};

onMounted(() => {
  itemsStore.fetchMyItems();
});
</script>

<style scoped lang="scss">
.my-items-view {
  padding-bottom: 70px;

  &__header {
    background: white;
    position: sticky;
    top: 56px;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    h5 {
      font-weight: 700;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}

.my-item-card {
  overflow: hidden;
  cursor: pointer;

  &__image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background: #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__badge {
    position: absolute;
    top: 6px;
    left: 6px;
    font-size: 0.65rem;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    background: #e9ecef;
  }

  &__info {
    background: white;
  }

  &__title {
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__condition {
    font-size: 0.75rem;
  }

  &__actions {
    gap: 4px;

    .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
  }
}
</style>
