<template>
  <div class="chat-view" v-if="matchId">
    <div class="chat-view__header p-3 d-flex align-items-center gap-3">
      <button class="btn btn-sm btn-outline-secondary" @click="$router.back()">←</button>
      <img
        :src="otherUserAvatar"
        alt="Avatar"
        class="chat-view__avatar"
      />
      <div>
        <h6 class="mb-0">{{ otherUser?.name || 'Carregando...' }}</h6>
        <small v-if="isTyping" class="text-success">digitando...</small>
      </div>
    </div>

    <div class="chat-view__messages" ref="messagesContainer">
      <div v-if="chatStore.loading" class="text-center py-4">
        <div class="spinner-border spinner-border-sm text-success"></div>
      </div>

      <ChatBubble
        v-for="msg in chatStore.messages"
        :key="msg.id"
        :message="msg"
        :current-user-id="authStore.user?.id"
        @retry="() => handleRetry(msg)"
      />

      <p v-if="!chatStore.loading && chatStore.messages.length === 0" class="text-center text-muted py-4">
        Nenhuma mensagem ainda. Diga olá! 👋
      </p>
    </div>

    <ChatInput
      @send="handleSend"
      @typing="handleTyping"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { useMatchesStore } from '@/stores/matches';
import { useSocket } from '@/composables/useSocket';
import ChatBubble from '@/components/chat/ChatBubble.vue';
import ChatInput from '@/components/chat/ChatInput.vue';

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();
const matchesStore = useMatchesStore();
const { joinChat, leaveChat, sendMessage: socketSend, onMessage, emitTyping } = useSocket();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const matchId = computed(() => route.params.matchId);
const messagesContainer = ref(null);
const isTyping = ref(false);
const otherUser = ref(null);

const otherUserAvatar = computed(() => {
  const url = otherUser.value?.avatar_url;
  if (!url) return '/default-avatar.png';
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
});

let typingTimer = null;

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(async () => {
  try {
    const match = await matchesStore.fetchMatch(matchId.value);
    const myId = authStore.user?.id;
    otherUser.value = match.user1?.id === myId ? match.user2 : match.user1;
  } catch {
    // fallback
  }

  await chatStore.fetchMessages(matchId.value);
  joinChat(matchId.value);
  scrollToBottom();

  onMessage((msg) => {
    chatStore.addMessage(msg);
    scrollToBottom();
  });
});

onUnmounted(() => {
  leaveChat(matchId.value);
});

watch(() => chatStore.messages.length, scrollToBottom);

const handleSend = async (content) => {
  await chatStore.sendMessage(matchId.value, content);
  socketSend(matchId.value, content);
  scrollToBottom();
};

const handleTyping = (typing) => {
  emitTyping(matchId.value, typing);
  if (typing) {
    isTyping.value = true;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => { isTyping.value = false; }, 2000);
  } else {
    isTyping.value = false;
  }
};

const handleRetry = async (message) => {
  if (message.status === 'failed') {
    try {
      chatStore.updateMessageStatus(message.id, 'pending');
      const retryCount = (message.retryCount || 0) + 1;
      await chatStore.retryFailedMessage(matchId.value, message.content, retryCount, message.id);
      scrollToBottom();
    } catch (err) {
      console.error('Retry failed:', err);
    }
  }
};
</script>

<style scoped lang="scss">
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    background: white;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }

  &__avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #f8f9fa;
  }
}
</style>
