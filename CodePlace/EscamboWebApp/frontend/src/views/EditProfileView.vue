<template>
  <div class="edit-profile-view p-3">
    <h5 class="fw-bold mb-3">Editar Perfil</h5>

    <div v-if="success" class="alert alert-success py-2">Perfil atualizado!</div>
    <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

    <div class="text-center mb-4">
      <label class="edit-profile-view__avatar-wrapper">
        <img
          :src="avatarPreview || currentAvatar || '/default-avatar.png'"
          alt="Avatar"
          class="edit-profile-view__avatar"
        />
        <span class="edit-profile-view__avatar-edit">📷</span>
        <input type="file" accept="image/*" hidden @change="onAvatarChange" />
      </label>
    </div>

    <form @submit.prevent="handleSave">
      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input v-model="form.name" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Bio</label>
        <textarea v-model="form.bio" class="form-control" rows="3" maxlength="500"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Cidade</label>
        <input v-model="form.city" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Estado</label>
        <select v-model="form.state" class="form-select">
          <option value="">Selecione</option>
          <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
        </select>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-escambo flex-grow-1" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          Salvar
        </button>
        <button type="button" class="btn btn-outline-secondary" @click="$router.back()">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const authStore = useAuthStore();

const currentAvatar = computed(() => {
  const url = authStore.user?.avatar_url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
});

const form = reactive({
  name: '',
  bio: '',
  city: '',
  state: '',
});
const avatarFile = ref(null);
const avatarPreview = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const ufs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

onMounted(() => {
  const u = authStore.user;
  if (u) {
    form.name = u.name || '';
    form.bio = u.bio || '';
    form.city = u.city || '';
    form.state = u.state || '';
  }
});

const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const handleSave = async () => {
  error.value = '';
  success.value = false;
  loading.value = true;
  try {
    // Update profile data (JSON)
    await authService.updateProfile({
      name: form.name,
      bio: form.bio,
      city: form.city,
      state: form.state,
    });

    // Upload avatar separately if selected
    if (avatarFile.value) {
      const formData = new FormData();
      formData.append('avatar', avatarFile.value);
      await authService.updateAvatar(formData);
    }

    // Refresh user data in store
    const res = await authService.getProfile();
    authStore.user = res.data.data;
    localStorage.setItem('escambo_user', JSON.stringify(res.data.data));

    success.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao atualizar perfil';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.edit-profile-view {
  padding-bottom: 80px;
  max-width: 500px;
  margin: 0 auto;

  &__avatar-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  &__avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #2ecc71;
  }

  &__avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #2ecc71;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
  }
}
</style>
