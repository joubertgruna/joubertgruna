const db = require('../config/database');

class MatchRepository {
  async create(matchData) {
    const [id] = await db('matches').insert(matchData);
    return this.findById(id);
  }

  async findById(id) {
    return db('matches').where({ id }).first();
  }

  async findByIdWithDetails(id) {
    const match = await this.findById(id);
    if (!match) return null;

    const [user1, user2, item1, item2] = await Promise.all([
      db('users').select('id', 'name', 'avatar_url').where({ id: match.user_1_id }).first(),
      db('users').select('id', 'name', 'avatar_url').where({ id: match.user_2_id }).first(),
      db('items').where({ id: match.item_1_id }).first(),
      db('items').where({ id: match.item_2_id }).first(),
    ]);

    return {
      ...match,
      user_1: user1,
      user_2: user2,
      item_1: item1,
      item_2: item2,
    };
  }

  async findByUser(userId) {
    const matches = await db('matches')
      .where('user_1_id', userId)
      .orWhere('user_2_id', userId)
      .where('status', 'active')
      .orderBy('created_at', 'desc');

    // Enrich with user and item data + last message
    const enriched = await Promise.all(matches.map(async (match) => {
      const otherUserId = match.user_1_id === userId ? match.user_2_id : match.user_1_id;
      const otherUser = await db('users')
        .select('id', 'name', 'avatar_url')
        .where({ id: otherUserId })
        .first();

      const lastMessage = await db('messages')
        .where({ match_id: match.id })
        .orderBy('created_at', 'desc')
        .first();

      const unreadCount = await db('messages')
        .where({ match_id: match.id })
        .where('sender_id', '!=', userId)
        .whereNull('read_at')
        .count('* as count')
        .first();

      return {
        ...match,
        other_user: otherUser,
        last_message: lastMessage || null,
        unread_count: unreadCount ? unreadCount.count : 0,
      };
    }));

    return enriched;
  }

  async findExisting(user1Id, user2Id) {
    return db('matches')
      .where(function () {
        this.where({ user_1_id: user1Id, user_2_id: user2Id });
      })
      .orWhere(function () {
        this.where({ user_1_id: user2Id, user_2_id: user1Id });
      })
      .first();
  }

  async updateAdShown(matchId) {
    return db('matches')
      .where({ id: matchId })
      .update({ ad_shown: true, updated_at: db.fn.now() });
  }

  async update(id, data) {
    await db('matches').where({ id }).update({ ...data, updated_at: db.fn.now() });
    return this.findById(id);
  }

  async isParticipant(matchId, userId) {
    const match = await db('matches')
      .where({ id: matchId })
      .where(function () {
        this.where({ user_1_id: userId }).orWhere({ user_2_id: userId });
      })
      .first();
    return !!match;
  }
}

module.exports = new MatchRepository();
