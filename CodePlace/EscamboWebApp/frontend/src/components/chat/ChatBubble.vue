<template>
  <transition name="bubble-slide" mode="out-in">
    <div 
      :key="message.id" 
      class="chat-bubble" 
      :class="{ 
        'chat-bubble--mine': isMine,
        'chat-bubble--new': message.isNew,
        'chat-bubble--failed': message.status === 'failed',
        'chat-bubble--pending': message.status === 'pending',
      }"
    >
      <p class="chat-bubble__text mb-0">{{ message.content }}</p>
      <div class="chat-bubble__footer d-flex align-items-center justify-content-between gap-2">
        <span class="chat-bubble__time">{{ formattedTime }}</span>
        
        <!-- Status indicators -->
        <div v-if="isMine" class="chat-bubble__status">
          <!-- Pendente -->
          <svg v-if="message.status === 'pending'" class="chat-bubble__icon pending" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/>
            <path d="M12 2v3m0 14v3M5 12H2m14 0h3M5.88 5.88l-2.12-2.12M18.24 18.24l-2.12-2.12M5.88 18.12l-2.12 2.12M18.24 5.76l-2.12 2.12" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          
          <!-- Enviada (✓) -->
          <svg v-else-if="message.status === 'sent'" class="chat-bubble__icon sent" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- Falha (✗) -->
          <svg v-else-if="message.status === 'failed'" class="chat-bubble__icon failed" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      
      <!-- Mensagem de erro com retry -->
      <div v-if="message.status === 'failed'" class="chat-bubble__error">
        <small>{{ message.error || 'Falha ao enviar' }}</small>
        <button class="btn btn-link btn-sm" @click="$emit('retry')">Tentar novamente</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: { type: Object, required: true },
  currentUserId: { type: Number, required: true },
});

const emit = defineEmits(['retry']);

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
  transition: all 0.3s ease;

  &--mine {
    background: #2ecc71;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;

    .chat-bubble__time {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &--pending {
    opacity: 0.7;
  }

  &--failed {
    border: 1px solid #e74c3c;
    background: rgba(231, 76, 60, 0.1);
  }

  &--new {
    animation: bubble-pulse 0.5s ease-out;
  }

  &:not(.chat-bubble--mine) {
    border-bottom-left-radius: 4px;
  }

  &__text {
    font-size: 0.92rem;
    line-height: 1.3;
    word-break: break-word;
  }

  &__footer {
    font-size: 0.65rem;
    margin-top: 3px;
  }

  &__time {
    color: #999;
    flex-shrink: 0;

    .chat-bubble--mine & {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &__status {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &__icon {
    width: 16px;
    height: 16px;

    &.pending {
      color: #f39c12;
      animation: spin 1.5s linear infinite;
    }

    &.sent {
      color: #2ecc71;
    }

    &.failed {
      color: #e74c3c;
    }
  }

  &__error {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid rgba(231, 76, 60, 0.3);
    display: flex;
    flex-direction: column;
    gap: 4px;

    small {
      color: #e74c3c;
      font-weight: 500;
    }

    .btn-link {
      padding: 0;
      font-size: 0.75rem;
      text-decoration: underline;
      color: #e74c3c;

      &:hover {
        color: #c0392b;
      }
    }
  }
}

// Animações
@keyframes bubble-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Transição de slide
.bubble-slide-enter-active,
.bubble-slide-leave-active {
  transition: all 0.3s ease;
}

.bubble-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.bubble-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
