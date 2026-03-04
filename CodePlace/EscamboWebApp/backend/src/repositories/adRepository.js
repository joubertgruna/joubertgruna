const db = require('../config/database');

class AdRepository {
  async create(adData) {
    const [id] = await db('ads').insert(adData);
    return db('ads').where({ id }).first();
  }

  async findById(id) {
    return db('ads').where({ id }).first();
  }

  async findActive() {
    return db('ads').where({ is_active: true });
  }

  async findNextAd() {
    // Return random active ad
    return db('ads')
      .where({ is_active: true })
      .orderByRaw('RAND()')
      .first();
  }

  async incrementImpressions(id) {
    return db('ads').where({ id }).increment('impressions', 1);
  }

  async incrementClicks(id) {
    return db('ads').where({ id }).increment('clicks', 1);
  }

  async update(id, data) {
    await db('ads').where({ id }).update({ ...data, updated_at: db.fn.now() });
    return db('ads').where({ id }).first();
  }

  async delete(id) {
    return db('ads').where({ id }).del();
  }

  async findAll() {
    return db('ads').orderBy('created_at', 'desc');
  }
}

module.exports = new AdRepository();
