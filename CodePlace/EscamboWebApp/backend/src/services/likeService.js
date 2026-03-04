const likeRepository = require('../repositories/likeRepository');
const matchRepository = require('../repositories/matchRepository');
const itemRepository = require('../repositories/itemRepository');

class LikeService {
  /**
   * Like an item and check for match
   * @returns {{ like, match }} - The like and optional match
   */
  async likeItem(userId, itemId) {
    // Get the item to find its owner
    const item = await itemRepository.findById(itemId);
    if (!item) {
      const error = new Error('Item não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    // Can't like own item
    if (item.user_id === userId) {
      const error = new Error('Não é possível curtir o próprio item.');
      error.statusCode = 400;
      throw error;
    }

    // Check if already liked
    const existingLike = await likeRepository.findByUserAndItem(userId, itemId);
    if (existingLike) {
      const error = new Error('Item já foi curtido.');
      error.statusCode = 409;
      throw error;
    }

    // Create the like
    const like = await likeRepository.create({
      user_id: userId,
      item_id: itemId,
    });

    // Check for mutual like (match algorithm)
    const match = await this.checkForMatch(userId, item.user_id);

    return { like, match };
  }

  /**
   * Match algorithm: checks if both users have liked each other's items
   */
  async checkForMatch(likerId, itemOwnerId) {
    // Check if itemOwner already liked any item of the liker
    const mutualLike = await likeRepository.findMutualLike(likerId, itemOwnerId);

    if (!mutualLike) {
      return null; // No match
    }

    // Check if match already exists
    const existingMatch = await matchRepository.findExisting(likerId, itemOwnerId);
    if (existingMatch) {
      return null; // Match already exists
    }

    // Find which items were involved
    const likerLikedItem = await likeRepository.findLikedItemByUsers(likerId, itemOwnerId);
    const ownerLikedItem = await likeRepository.findLikedItemByUsers(itemOwnerId, likerId);

    // Create the match!
    const match = await matchRepository.create({
      user_1_id: likerId,
      user_2_id: itemOwnerId,
      item_1_id: ownerLikedItem ? ownerLikedItem.item_id : null,
      item_2_id: likerLikedItem ? likerLikedItem.item_id : null,
    });

    return match;
  }

  async unlikeItem(userId, itemId) {
    const like = await likeRepository.findByUserAndItem(userId, itemId);
    if (!like) {
      const error = new Error('Curtida não encontrada.');
      error.statusCode = 404;
      throw error;
    }

    await likeRepository.delete(like.id);
    return true;
  }

  async getReceivedLikes(userId) {
    return likeRepository.findReceivedByUser(userId);
  }
}

module.exports = new LikeService();
