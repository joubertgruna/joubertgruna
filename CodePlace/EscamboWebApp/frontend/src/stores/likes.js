import { defineStore } from 'pinia';
import likeService from '@/services/likeService';

export const useLikesStore = defineStore('likes', {
  state: () => ({
    receivedLikes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async likeItem(itemId) {
      try {
        const response = await likeService.like(itemId);
        return response.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao curtir.';
        throw err;
      }
    },

    async unlikeItem(itemId) {
      try {
        await likeService.unlike(itemId);
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao descurtir.';
        throw err;
      }
    },

    async fetchReceivedLikes() {
      this.loading = true;
      try {
        const response = await likeService.getReceived();
        this.receivedLikes = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar curtidas.';
      } finally {
        this.loading = false;
      }
    },
  },
});
