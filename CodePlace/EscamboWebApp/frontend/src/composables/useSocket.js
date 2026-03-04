import { ref, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export function useSocket() {
  const socket = ref(null);
  const connected = ref(false);

  const connect = () => {
    const token = localStorage.getItem('escambo_token');
    if (!token) return;

    socket.value = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.value.on('connect', () => {
      connected.value = true;
    });

    socket.value.on('disconnect', () => {
      connected.value = false;
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      connected.value = false;
    }
  };

  const joinChat = (matchId) => {
    socket.value?.emit('chat:join', matchId);
  };

  const leaveChat = (matchId) => {
    socket.value?.emit('chat:leave', matchId);
  };

  const sendMessage = (matchId, content) => {
    socket.value?.emit('chat:message', { matchId, content });
  };

  const onMessage = (callback) => {
    socket.value?.on('chat:message', callback);
  };

  const onNotification = (callback) => {
    socket.value?.on('chat:notification', callback);
  };

  const emitTyping = (matchId) => {
    socket.value?.emit('chat:typing', { matchId });
  };

  const onTyping = (callback) => {
    socket.value?.on('chat:typing', callback);
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    connected,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    onMessage,
    onNotification,
    emitTyping,
    onTyping,
  };
}
