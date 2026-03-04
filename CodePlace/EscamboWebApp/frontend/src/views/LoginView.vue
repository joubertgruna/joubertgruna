<template>
  <div class="login-view">
    <div class="login-view__card">
      <h2 class="text-center mb-1">🔄 Escambo</h2>
      <p class="text-center text-muted mb-4">Entre na sua conta</p>

      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">E-mail</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Senha</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="Sua senha"
            required
            minlength="6"
          />
        </div>

        <button type="submit" class="btn btn-escambo w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Entrar
        </button>
      </form>

      <p class="text-center mt-3 mb-0">
        Não tem conta?
        <router-link to="/register" class="text-success fw-bold">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login(form);
    router.replace('/feed');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao fazer login';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  &__card {
    background: white;
    border-radius: 16px;
    padding: 32px 24px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
}
</style>
