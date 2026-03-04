<template>
  <div class="edit-item-view p-3">
    <div class="d-flex align-items-center mb-3">
      <button class="btn btn-sm btn-outline-secondary me-2" @click="$router.back()">←</button>
      <h5 class="fw-bold mb-0">Editar Item</h5>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success"></div>
    </div>

    <template v-else-if="item">
      <!-- Photos Section -->
      <div class="escambo-card p-3 mb-3">
        <h6 class="fw-bold mb-2">📷 Fotos</h6>

        <div class="photos-grid mb-3">
          <div
            v-for="photo in (item.photos || [])"
            :key="photo.id"
            class="photo-item"
          >
            <img :src="photoUrl(photo)" :alt="item.title" />
            <span v-if="photo.is_primary" class="photo-badge badge bg-success">Principal</span>
            <button
              class="photo-remove btn btn-sm btn-danger"
              @click="removePhoto(photo.id)"
              :disabled="removingPhoto === photo.id"
            >
              <span v-if="removingPhoto === photo.id" class="spinner-border spinner-border-sm"></span>
              <span v-else>✕</span>
            </button>
          </div>

          <!-- Add photo button -->
          <label class="photo-add">
            <input
              type="file"
              accept="image/*"
              multiple
              class="d-none"
              @change="handleAddPhotos"
              :disabled="addingPhotos"
            />
            <div v-if="addingPhotos" class="spinner-border spinner-border-sm text-success"></div>
            <template v-else>
              <span class="fs-4">+</span>
              <small>Adicionar</small>
            </template>
          </label>
        </div>

        <p v-if="item.photos.length === 0" class="text-muted small mb-0">
          Nenhuma foto. Adicione fotos ao seu item!
        </p>
      </div>

      <!-- Item Form -->
      <form @submit.prevent="handleSave" class="escambo-card p-3">
        <h6 class="fw-bold mb-3">✏️ Informações</h6>

        <div class="mb-3">
          <label class="form-label">Título *</label>
          <input
            v-model="form.title"
            type="text"
            class="form-control"
            placeholder="Ex: Violão Yamaha"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Descrição</label>
          <textarea
            v-model="form.description"
            class="form-control"
            rows="3"
            placeholder="Descreva seu item..."
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Categoria *</label>
          <select v-model="form.category" class="form-select" required>
            <option value="" disabled>Selecione</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Roupas">Roupas</option>
            <option value="Livros">Livros</option>
            <option value="Esportes">Esportes</option>
            <option value="Móveis">Móveis</option>
            <option value="Instrumentos">Instrumentos</option>
            <option value="Games">Games</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Condição *</label>
          <select v-model="form.condition" class="form-select" required>
            <option value="" disabled>Selecione</option>
            <option value="novo">Novo</option>
            <option value="seminovo">Seminovo</option>
            <option value="usado">Usado</option>
            <option value="desgastado">Desgastado</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Troca por</label>
          <input
            v-model="form.trade_for"
            type="text"
            class="form-control"
            placeholder="O que aceita em troca?"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Status</label>
          <select v-model="form.status" class="form-select">
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="traded">Trocado</option>
          </select>
        </div>

        <div v-if="error" class="alert alert-danger small">{{ error }}</div>
        <div v-if="success" class="alert alert-success small">{{ success }}</div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-escambo flex-grow-1" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            Salvar Alterações
          </button>
          <button type="button" class="btn btn-outline-danger" @click="confirmDelete">
            🗑️ Excluir
          </button>
        </div>
      </form>
    </template>

    <div v-else class="text-center py-5">
      <p class="text-muted">Item não encontrado ou sem permissão.</p>
      <button class="btn btn-escambo" @click="$router.push('/feed')">Voltar ao Feed</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import itemService from '@/services/itemService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');
console.log('EditItemView carregado - API_URL:', API_URL, 'BASE_URL:', BASE_URL);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const item = ref(null);
const loading = ref(true);
const saving = ref(false);
const addingPhotos = ref(false);
const removingPhoto = ref(null);
const error = ref('');
const success = ref('');

const form = reactive({
  title: '',
  description: '',
  category: '',
  condition: '',
  trade_for: '',
  status: 'active',
});

const photoUrl = (photo) => {
  if (!photo) {
    console.warn('photoUrl: photo é null/undefined');
    return '';
  }
  const url = photo?.url;
  if (!url) {
    console.warn('Foto sem URL:', photo);
    return '';
  }
  const finalUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  console.log('URL construída:', { photoId: photo.id, originalUrl: url, finalUrl, baseUrl: BASE_URL });
  return finalUrl;
};

onMounted(async () => {
  try {
    const { data } = await itemService.getById(route.params.id);
    const loaded = data.data;
    console.log('Item carregado:', loaded);

    // Check ownership
    console.log('Verificando ownership:', loaded.user_id, 'vs', authStore.user?.id);
    if (loaded.user_id !== authStore.user?.id) {
      console.warn('Usuário não é proprietário, redirecionando...');
      router.replace(`/items/${route.params.id}`);
      return;
    }

    console.log('Proprietário verificado, inicializando item');
    item.value = loaded;
    console.log('item.value.photos após atribuição:', item.value.photos);
    form.title = loaded.title || '';
    form.description = loaded.description || '';
    form.category = loaded.category || '';
    form.condition = loaded.condition || '';
    form.trade_for = loaded.trade_for || '';
    form.status = loaded.status || 'active';
  } catch (err) {
    console.error('Erro ao carregar item:', err);
    item.value = null;
  } finally {
    loading.value = false;
  }
});

const handleSave = async () => {
  saving.value = true;
  error.value = '';
  success.value = '';
  try {
    await itemService.update(route.params.id, {
      title: form.title,
      description: form.description || null,
      category: form.category,
      condition: form.condition,
      trade_for: form.trade_for || null,
      status: form.status,
    });
    success.value = 'Item atualizado com sucesso!';
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao salvar.';
  } finally {
    saving.value = false;
  }
};

const handleAddPhotos = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  addingPhotos.value = true;
  error.value = '';
  success.value = '';
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    const { data } = await itemService.addPhotos(route.params.id, formData);
    console.log('Fotos adicionadas:', data);
    
    // Aguarda um pouco para garantir que o backend processou tudo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Reload item to get updated photos
    const res = await itemService.getById(route.params.id);
    console.log('Item recarregado:', res.data.data);
    console.log('Fotos antes:', item.value.photos);
    
    // Atualizar item com as novas fotos
    if (res.data.data && Array.isArray(res.data.data.photos)) {
      console.log('Atualizando fotos:', res.data.data.photos);
      item.value.photos = res.data.data.photos;
      console.log('Fotos depois:', item.value.photos);
    } else {
      console.warn('Resposta não contém fotos válidas:', res.data.data);
    }
    
    success.value = `${files.length} foto(s) adicionada(s) com sucesso!`;
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    console.error('Erro ao adicionar fotos:', err);
    error.value = err.response?.data?.message || 'Erro ao adicionar fotos.';
  } finally {
    addingPhotos.value = false;
    event.target.value = '';
  }
};

const removePhoto = async (photoId) => {
  removingPhoto.value = photoId;
  error.value = '';
  try {
    await itemService.deletePhoto(route.params.id, photoId);
    item.value.photos = item.value.photos.filter((p) => p.id !== photoId);
    success.value = 'Foto removida!';
    setTimeout(() => { success.value = ''; }, 3000);
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao remover foto.';
  } finally {
    removingPhoto.value = null;
  }
};

const confirmDelete = async () => {
  if (!confirm('Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.')) return;

  saving.value = true;
  error.value = '';
  try {
    await itemService.delete(route.params.id);
    router.replace('/profile');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao excluir item.';
    saving.value = false;
  }
};
</script>

<style scoped lang="scss">
.edit-item-view {
  padding-bottom: 100px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.photo-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 0.6rem;
}

.photo-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.7rem;
}

.photo-add {
  aspect-ratio: 1;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  transition: border-color 0.2s;

  &:hover {
    border-color: #2ecc71;
    color: #2ecc71;
  }
}
</style>
