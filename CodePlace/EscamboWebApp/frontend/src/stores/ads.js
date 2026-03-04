import { defineStore } from 'pinia';
import adService from '@/services/adService';

export const useAdsStore = defineStore('ads', {
  state: () => ({
    currentAd: null,
    loading: false,
  }),

  actions: {
    async fetchNextAd() {
      this.loading = true;
      try {
        const response = await adService.getNext();
        this.currentAd = response.data.data;
        return this.currentAd;
      } catch {
        this.currentAd = null;
      } finally {
        this.loading = false;
      }
    },

    async registerClick(adId) {
      try {
        await adService.registerClick(adId);
      } catch {
        // Silently fail
      }
    },
  },
});
