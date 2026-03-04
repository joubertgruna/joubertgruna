import { defineStore } from 'pinia';
import itemService from '@/services/itemService';

export const useItemsStore = defineStore('items', {
  state: () => ({
    feedItems: [],
    myItems: [],
    currentItem: null,
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    loading: false,
    error: null,
  }),

  getters: {
    hasMore: (state) => state.pagination.page < state.pagination.totalPages,
  },

  actions: {
    async fetchFeed({ page = 1, category, append = false } = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await itemService.getFeed(page, 20, category);
        const { data, pagination } = response.data;
        if (append && page > 1) {
          this.feedItems.push(...data);
        } else {
          this.feedItems = data;
        }
        this.pagination = pagination;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar feed.';
      } finally {
        this.loading = false;
      }
    },

    async fetchMyItems() {
      this.loading = true;
      try {
        const response = await itemService.getMyItems();
        this.myItems = response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar itens.';
      } finally {
        this.loading = false;
      }
    },

    async fetchItem(id) {
      this.loading = true;
      try {
        const response = await itemService.getById(id);
        this.currentItem = response.data.data;
        return this.currentItem;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar item.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createItem(formData) {
      this.loading = true;
      try {
        const response = await itemService.create(formData);
        return response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao criar item.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(id) {
      try {
        await itemService.delete(id);
        this.myItems = this.myItems.filter((item) => item.id !== id);
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao remover item.';
        throw err;
      }
    },
  },
});
