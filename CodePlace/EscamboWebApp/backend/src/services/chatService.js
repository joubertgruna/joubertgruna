const messageRepository = require('../repositories/messageRepository');
const matchRepository = require('../repositories/matchRepository');

class ChatService {
  async getMessages(matchId, userId, pagination = {}) {
    const isParticipant = await matchRepository.isParticipant(matchId, userId);
    if (!isParticipant) {
      const error = new Error('Sem permissão para ver estas mensagens.');
      error.statusCode = 403;
      throw error;
    }

    // Auto-mark ad as shown when user enters chat (no longer requires manual ad viewing)
    const match = await matchRepository.findById(matchId);
    if (!match.ad_shown) {
      await matchRepository.updateAdShown(matchId);
    }

    // Mark messages as read
    await messageRepository.markAsRead(matchId, userId);

    return messageRepository.findByMatch(matchId, pagination);
  }

  async sendMessage(matchId, senderId, content) {
    const isParticipant = await matchRepository.isParticipant(matchId, senderId);
    if (!isParticipant) {
      const error = new Error('Sem permissão para enviar mensagens.');
      error.statusCode = 403;
      throw error;
    }

    // Auto-mark ad as shown when user sends message (no longer requires manual ad viewing)
    const match = await matchRepository.findById(matchId);
    if (!match.ad_shown) {
      await matchRepository.updateAdShown(matchId);
    }

    return messageRepository.create({
      match_id: matchId,
      sender_id: senderId,
      content,
    });
  }
}

module.exports = new ChatService();
