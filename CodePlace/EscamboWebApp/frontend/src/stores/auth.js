import { defineStore } from 'pinia';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('escambo_user') || 'null'),
    token: localStorage.getItem('escambo_token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async register(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(data);
        const { user, token } = response.data.data;
        this.user = user;
        this.token = token;
        localStorage.setItem('escambo_token', token);
        localStorage.setItem('escambo_user', JSON.stringify(user));
        return user;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro no cadastro.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(data) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(data);
        const { user, token } = response.data.data;
        this.user = user;
        this.token = token;
        localStorage.setItem('escambo_token', token);
        localStorage.setItem('escambo_user', JSON.stringify(user));
        return user;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro no login.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('escambo_token');
      localStorage.removeItem('escambo_user');
    },
  },
});
