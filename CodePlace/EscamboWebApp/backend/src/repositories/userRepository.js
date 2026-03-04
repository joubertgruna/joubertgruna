const db = require('../config/database');

class UserRepository {
  async create(userData) {
    const [id] = await db('users').insert(userData);
    return this.findById(id);
  }

  async findById(id) {
    return db('users')
      .select('id', 'name', 'email', 'phone', 'avatar_url', 'bio', 'city', 'state', 'created_at', 'updated_at')
      .where({ id })
      .first();
  }

  async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  async findByEmailWithPassword(email) {
    return db('users')
      .select('id', 'name', 'email', 'phone', 'avatar_url', 'bio', 'city', 'state', 'password_hash')
      .where({ email })
      .first();
  }

  async update(id, data) {
    await db('users').where({ id }).update({ ...data, updated_at: db.fn.now() });
    return this.findById(id);
  }

  async delete(id) {
    return db('users').where({ id }).del();
  }
}

module.exports = new UserRepository();
