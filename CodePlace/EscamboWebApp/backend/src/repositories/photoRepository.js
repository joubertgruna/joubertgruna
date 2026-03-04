const db = require('../config/database');

class PhotoRepository {
  async create(photoData) {
    const [id] = await db('photos').insert(photoData);
    return db('photos').where({ id }).first();
  }

  async createMany(photos) {
    await db('photos').insert(photos);
    const itemId = photos[0].item_id;
    return db('photos').where({ item_id: itemId }).orderBy('order', 'asc');
  }

  async findByItem(itemId) {
    return db('photos').where({ item_id: itemId }).orderBy('order', 'asc');
  }

  async delete(id) {
    return db('photos').where({ id }).del();
  }

  async deleteByItem(itemId) {
    return db('photos').where({ item_id: itemId }).del();
  }

  async setPrimary(photoId, itemId) {
    await db('photos').where({ item_id: itemId }).update({ is_primary: false });
    await db('photos').where({ id: photoId, item_id: itemId }).update({ is_primary: true });
  }
}

module.exports = new PhotoRepository();
