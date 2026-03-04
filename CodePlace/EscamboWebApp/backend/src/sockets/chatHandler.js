const chatService = require('../services/chatService');
const matchRepository = require('../repositories/matchRepository');
const logger = require('../utils/logger');

module.exports = (io, socket) => {
  // Join a match chat room
  socket.on('chat:join', async (matchId) => {
    try {
      const isParticipant = await matchRepository.isParticipant(matchId, socket.userId);
      if (!isParticipant) {
        socket.emit('error', { message: 'Sem permissão.' });
        return;
      }
      socket.join(`match:${matchId}`);
      logger.info(`User ${socket.userId} joined chat room match:${matchId}`);
    } catch (err) {
      logger.error(`Error joining chat: ${err.message}`);
      socket.emit('error', { message: 'Erro ao entrar no chat.' });
    }
  });

  // Leave a match chat room
  socket.on('chat:leave', (matchId) => {
    socket.leave(`match:${matchId}`);
    logger.info(`User ${socket.userId} left chat room match:${matchId}`);
  });

  // Send a message
  socket.on('chat:message', async ({ matchId, content }) => {
    try {
      const message = await chatService.sendMessage(matchId, socket.userId, content);

      // Broadcast to all users in the match room
      io.to(`match:${matchId}`).emit('chat:message', {
        id: message.id,
        match_id: message.match_id,
        sender_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
      });

      // Also notify the other user if they're not in the room
      const match = await matchRepository.findById(matchId);
      const otherUserId = match.user_1_id === socket.userId
        ? match.user_2_id
        : match.user_1_id;

      io.to(`user:${otherUserId}`).emit('chat:notification', {
        matchId,
        message: content,
        senderId: socket.userId,
      });
    } catch (err) {
      logger.error(`Error sending message: ${err.message}`);
      socket.emit('error', { message: err.message });
    }
  });

  // Typing indicator
  socket.on('chat:typing', ({ matchId }) => {
    socket.to(`match:${matchId}`).emit('chat:typing', {
      userId: socket.userId,
    });
  });

  socket.on('chat:stop-typing', ({ matchId }) => {
    socket.to(`match:${matchId}`).emit('chat:stop-typing', {
      userId: socket.userId,
    });
  });
};
