const db = require('../config/database');

class ItemRepository {
  async create(itemData) {
    const [id] = await db('items').insert(itemData);
    return this.findById(id);
  }

  async findById(id) {
    return db('items')
      .select('items.*')
      .where('items.id', id)
      .first();
  }

  async findByIdWithPhotos(id) {
    const item = await this.findById(id);
    if (!item) return null;

    const photos = await db('photos')
      .where({ item_id: id })
      .orderBy('order', 'asc');

    const user = await db('users')
      .select('id', 'name', 'avatar_url', 'city', 'state')
      .where({ id: item.user_id })
      .first();

    return { ...item, photos, user: user || null };
  }

  async findByUser(userId) {
    const items = await db('items')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');

    // Attach primary photo to each item
    const itemIds = items.map((i) => i.id);
    const photos = await db('photos')
      .whereIn('item_id', itemIds)
      .where({ is_primary: true });

    const photoMap = {};
    photos.forEach((p) => { photoMap[p.item_id] = p; });

    return items.map((item) => ({
      ...item,
      primary_photo: photoMap[item.id] || null,
    }));
  }

  async findForFeed(userId, { limit, offset }) {
    const items = await db('items')
      .where('status', 'active')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Attach primary photo
    const itemIds = items.map((i) => i.id);
    if (itemIds.length === 0) return { items: [], total: 0 };

    const photos = await db('photos')
      .whereIn('item_id', itemIds)
      .where({ is_primary: true });

    const photoMap = {};
    photos.forEach((p) => { photoMap[p.item_id] = p; });

    const [{ total }] = await db('items')
      .where('status', 'active')
      .count('* as total');

    return {
      items: items.map((item) => ({
        ...item,
        primary_photo: photoMap[item.id] || null,
      })),
      total,
    };
  }

  async update(id, data) {
    await db('items').where({ id }).update({ ...data, updated_at: db.fn.now() });
    return this.findById(id);
  }

  async delete(id) {
    return db('items').where({ id }).del();
  }

  async isOwner(itemId, userId) {
    const item = await db('items').where({ id: itemId, user_id: userId }).first();
    return !!item;
  }
}

module.exports = new ItemRepository();
