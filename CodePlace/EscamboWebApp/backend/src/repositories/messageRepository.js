const db = require('../config/database');

class MessageRepository {
  async create(messageData) {
    const [id] = await db('messages').insert(messageData);
    return db('messages').where({ id }).first();
  }

  async findByMatch(matchId, { limit = 50, offset = 0 } = {}) {
    const messages = await db('messages')
      .where({ match_id: matchId })
      .join('users', 'messages.sender_id', '=', 'users.id')
      .select(
        'messages.*',
        'users.name as sender_name',
        'users.avatar_url as sender_avatar',
      )
      .orderBy('messages.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('messages')
      .where({ match_id: matchId })
      .count('* as total');

    return {
      messages: messages.reverse(), // Return in chronological order
      total,
    };
  }

  async markAsRead(matchId, userId) {
    return db('messages')
      .where({ match_id: matchId })
      .where('sender_id', '!=', userId)
      .whereNull('read_at')
      .update({ read_at: db.fn.now() });
  }
}

module.exports = new MessageRepository();
