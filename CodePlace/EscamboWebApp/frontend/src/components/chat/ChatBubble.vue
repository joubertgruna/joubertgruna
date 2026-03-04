<template>
  <div class="chat-bubble" :class="{ 'chat-bubble--mine': isMine }">
    <p class="chat-bubble__text mb-0">{{ message.content }}</p>
    <span class="chat-bubble__time">{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: { type: Object, required: true },
  currentUserId: { type: Number, required: true },
});

const isMine = computed(() => props.message.sender_id === props.currentUserId);

const formattedTime = computed(() => {
  const d = new Date(props.message.created_at);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
});
</script>

<style scoped lang="scss">
.chat-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px;
  margin-bottom: 6px;
  background: #e9ecef;
  align-self: flex-start;
  position: relative;

  &--mine {
    background: #2ecc71;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;

    .chat-bubble__time {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &:not(.chat-bubble--mine) {
    border-bottom-left-radius: 4px;
  }

  &__text {
    font-size: 0.92rem;
    line-height: 1.3;
    word-break: break-word;
  }

  &__time {
    font-size: 0.65rem;
    color: #999;
    display: block;
    text-align: right;
    margin-top: 3px;
  }
}
</style>
