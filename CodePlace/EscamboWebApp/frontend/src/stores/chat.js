import { defineStore } from 'pinia';
import chatApiService from '@/services/chatService';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMessages(matchId, page = 1) {
      this.loading = true;
      try {
        const response = await chatApiService.getMessages(matchId, page);
        this.messages = response.data.data.messages || [];
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar mensagens.';
      } finally {
        this.loading = false;
      }
    },

    async sendMessage(matchId, content) {
      try {
        const response = await chatApiService.sendMessage(matchId, content);
        this.messages.push(response.data.data);
        return response.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao enviar mensagem.';
        throw err;
      }
    },

    addMessage(message) {
      const exists = this.messages.find((m) => m.id === message.id);
      if (!exists) {
        this.messages.push(message);
      }
    },

    clearMessages() {
      this.messages = [];
    },
  },
});
