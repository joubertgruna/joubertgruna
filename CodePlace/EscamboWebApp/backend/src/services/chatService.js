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

    // Check if ad was shown (required before chat)
    const match = await matchRepository.findById(matchId);
    if (!match.ad_shown) {
      const error = new Error('É necessário visualizar o anúncio antes de acessar o chat.');
      error.statusCode = 403;
      throw error;
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

    const match = await matchRepository.findById(matchId);
    if (!match.ad_shown) {
      const error = new Error('É necessário visualizar o anúncio antes de enviar mensagens.');
      error.statusCode = 403;
      throw error;
    }

    return messageRepository.create({
      match_id: matchId,
      sender_id: senderId,
      content,
    });
  }
}

module.exports = new ChatService();
