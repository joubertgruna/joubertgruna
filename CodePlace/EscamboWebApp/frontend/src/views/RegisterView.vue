<template>
  <div class="register-view">
    <div class="register-view__card">
      <h2 class="text-center mb-1">🔄 Escambo</h2>
      <p class="text-center text-muted mb-4">Crie sua conta</p>

      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Nome</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Seu nome completo"
            required
            minlength="2"
            maxlength="100"
          />
        </div>

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
          <label class="form-label">Telefone</label>
          <input
            v-model="form.phone"
            type="tel"
            class="form-control"
            placeholder="(11) 99999-9999"
            required
            minlength="10"
            maxlength="20"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Senha</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Confirmar Senha</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            placeholder="Repita a senha"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Cidade</label>
          <input
            v-model="form.city"
            type="text"
            class="form-control"
            placeholder="Sua cidade"
            maxlength="100"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Estado</label>
          <select v-model="form.state" class="form-select">
            <option value="">Selecione</option>
            <option v-for="uf in ufs" :key="uf" :value="uf">{{ uf }}</option>
          </select>
        </div>

        <button type="submit" class="btn btn-escambo w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Cadastrar
        </button>
      </form>

      <p class="text-center mt-3 mb-0">
        Já tem conta?
        <router-link to="/login" class="text-success fw-bold">Entrar</router-link>
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

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  city: '',
  state: '',
});
const loading = ref(false);
const error = ref('');

const ufs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const handleRegister = async () => {
  error.value = '';
  if (form.password !== form.confirmPassword) {
    error.value = 'As senhas não coincidem';
    return;
  }
  loading.value = true;
  try {
    const { confirmPassword, ...data } = form;
    await authStore.register(data);
    router.replace('/feed');
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.register-view {
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
    max-width: 420px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>
