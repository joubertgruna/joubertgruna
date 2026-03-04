const userRepository = require('../repositories/userRepository');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.statusCode = 404;
      throw error;
    }

    return userRepository.update(userId, data);
  }

  async updateAvatar(userId, avatarUrl) {
    return userRepository.update(userId, { avatar_url: avatarUrl });
  }
}

module.exports = new UserService();
