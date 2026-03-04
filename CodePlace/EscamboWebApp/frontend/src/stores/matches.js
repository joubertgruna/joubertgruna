import { defineStore } from 'pinia';
import matchService from '@/services/matchService';

export const useMatchesStore = defineStore('matches', {
  state: () => ({
    matches: [],
    currentMatch: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMatches() {
      this.loading = true;
      try {
        const response = await matchService.getAll();
        this.matches = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar matches.';
      } finally {
        this.loading = false;
      }
    },

    async fetchMatch(id) {
      this.loading = true;
      try {
        const response = await matchService.getById(id);
        this.currentMatch = response.data.data;
        return this.currentMatch;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar match.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async markAdShown(id) {
      try {
        await matchService.markAdShown(id);
      } catch (err) {
        this.error = err.response?.data?.message;
        throw err;
      }
    },
  },
});
