import { defineStore } from 'pinia';
import chatApiService from '@/services/chatService';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
    retryQueue: [], // Fila de mensagens para retry
  }),

  actions: {
    async fetchMessages(matchId, page = 1) {
      this.loading = true;
      try {
        const response = await chatApiService.getMessages(matchId, page);
        this.messages = (response.data.data.messages || []).map((msg) => ({
          ...msg,
          status: 'sent', // 'pending', 'sent', 'failed'
          isNew: false, // Indicador de mensagem nova
        }));
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao carregar mensagens.';
      } finally {
        this.loading = false;
      }
    },

    async sendMessage(matchId, content, retryCount = 0) {
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        content,
        sender_id: null, // Será atualizado após sucesso
        created_at: new Date().toISOString(),
        status: 'pending',
        isNew: false,
        retryCount,
      };

      // Adiciona mensagem em estado pendente
      this.messages.push(tempMessage);

      try {
        const response = await chatApiService.sendMessage(matchId, content);
        const sentMessage = {
          ...response.data.data,
          status: 'sent',
          isNew: false,
        };

        // Substitui mensagem temporária pela real
        const index = this.messages.findIndex((m) => m.id === tempId);
        if (index !== -1) {
          this.messages[index] = sentMessage;
        }

        return sentMessage;
      } catch (err) {
        // Marca como falha e adiciona à fila de retry
        const failedMsg = this.messages.find((m) => m.id === tempId);
        if (failedMsg) {
          failedMsg.status = 'failed';
          failedMsg.error = err.response?.data?.message || 'Erro ao enviar';
        }

        this.error = err.response?.data?.message || 'Erro ao enviar mensagem.';

        // Retry automático (máximo 3 tentativas)
        if (retryCount < 3) {
          this.retryQueue.push({ matchId, content, retryCount: retryCount + 1, tempId });
        }

        throw err;
      }
    },

    async retryFailedMessage(matchId, content, retryCount, tempId) {
      try {
        const response = await chatApiService.sendMessage(matchId, content);
        const sentMessage = {
          ...response.data.data,
          status: 'sent',
          isNew: false,
        };

        const index = this.messages.findIndex((m) => m.id === tempId);
        if (index !== -1) {
          this.messages[index] = sentMessage;
        }

        return sentMessage;
      } catch (err) {
        if (retryCount < 3) {
          setTimeout(() => {
            this.retryQueue.push({ matchId, content, retryCount: retryCount + 1, tempId });
          }, 2000 * retryCount); // Backoff exponencial
        }
        throw err;
      }
    },

    addMessage(message) {
      const exists = this.messages.find((m) => m.id === message.id);
      if (!exists) {
        this.messages.push({
          ...message,
          status: 'sent',
          isNew: true, // Marca como nova para animação
        });

        // Remove animação após 500ms
        setTimeout(() => {
          const msg = this.messages.find((m) => m.id === message.id);
          if (msg) msg.isNew = false;
        }, 500);
      }
    },

    clearMessages() {
      this.messages = [];
      this.retryQueue = [];
    },

    updateMessageStatus(messageId, status) {
      const msg = this.messages.find((m) => m.id === messageId);
      if (msg) {
        msg.status = status;
      }
    },
  },
});
