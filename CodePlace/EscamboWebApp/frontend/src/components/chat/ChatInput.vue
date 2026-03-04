<template>
  <form @submit.prevent="send" class="chat-input">
    <input
      v-model="text"
      type="text"
      class="form-control"
      placeholder="Digite sua mensagem..."
      maxlength="1000"
      @input="onTyping"
    />
    <button type="submit" class="btn btn-escambo" :disabled="!text.trim()">
      ➤
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['send', 'typing']);

const text = ref('');
let typingTimeout = null;

const send = () => {
  const content = text.value.trim();
  if (!content) return;
  emit('send', content);
  text.value = '';
};

const onTyping = () => {
  clearTimeout(typingTimeout);
  emit('typing', true);
  typingTimeout = setTimeout(() => emit('typing', false), 1500);
};
</script>

<style scoped lang="scss">
.chat-input {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: white;
  border-top: 1px solid #eee;

  .form-control {
    border-radius: 20px;
    font-size: 0.9rem;
  }

  .btn {
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.1rem;
  }
}
</style>
