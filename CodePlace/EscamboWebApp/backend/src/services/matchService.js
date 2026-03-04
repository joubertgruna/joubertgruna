const matchRepository = require('../repositories/matchRepository');

class MatchService {
  async getMatches(userId) {
    return matchRepository.findByUser(userId);
  }

  async getMatch(matchId, userId) {
    const isParticipant = await matchRepository.isParticipant(matchId, userId);
    if (!isParticipant) {
      const error = new Error('Sem permissão para visualizar este match.');
      error.statusCode = 403;
      throw error;
    }

    return matchRepository.findByIdWithDetails(matchId);
  }

  async markAdShown(matchId, userId) {
    const isParticipant = await matchRepository.isParticipant(matchId, userId);
    if (!isParticipant) {
      const error = new Error('Sem permissão.');
      error.statusCode = 403;
      throw error;
    }

    await matchRepository.updateAdShown(matchId);
    return true;
  }

  async hasSeenAd(matchId) {
    const match = await matchRepository.findById(matchId);
    return match ? match.ad_shown : false;
  }
}

module.exports = new MatchService();
