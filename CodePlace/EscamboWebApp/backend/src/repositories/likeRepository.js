const db = require('../config/database');

class LikeRepository {
  async create(likeData) {
    const [id] = await db('likes').insert(likeData);
    return db('likes').where({ id }).first();
  }

  async findByUserAndItem(userId, itemId) {
    return db('likes').where({ user_id: userId, item_id: itemId }).first();
  }

  async delete(id) {
    return db('likes').where({ id }).del();
  }

  async deleteByUserAndItem(userId, itemId) {
    return db('likes').where({ user_id: userId, item_id: itemId }).del();
  }

  /**
   * Get likes received on items belonging to a user
   */
  async findReceivedByUser(userId) {
    return db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .join('users', 'likes.user_id', '=', 'users.id')
      .where('items.user_id', userId)
      .select(
        'likes.id',
        'likes.created_at',
        'users.id as liker_id',
        'users.name as liker_name',
        'users.avatar_url as liker_avatar',
        'items.id as item_id',
        'items.title as item_title',
      )
      .orderBy('likes.created_at', 'desc');
  }

  /**
   * Check if there's a mutual like (for match detection)
   * User A liked an item of User B, and User B liked an item of User A
   */
  async findMutualLike(likerId, itemOwnerId) {
    // Find if itemOwner has liked any item of liker
    return db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .where('likes.user_id', itemOwnerId)
      .where('items.user_id', likerId)
      .select('likes.*', 'items.id as liked_item_id')
      .first();
  }

  /**
   * Get the item that was liked (to record in match)
   */
  async findLikedItemByUsers(likerId, itemOwnerId) {
    return db('likes')
      .join('items', 'likes.item_id', '=', 'items.id')
      .where('likes.user_id', likerId)
      .where('items.user_id', itemOwnerId)
      .select('items.id as item_id')
      .first();
  }
}

module.exports = new LikeRepository();
