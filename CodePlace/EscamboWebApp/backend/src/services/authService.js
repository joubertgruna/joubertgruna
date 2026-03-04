const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register({ name, email, phone, password, city, state }) {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('E-mail já cadastrado.');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user
    const userData = { name, email, phone, password_hash };
    if (city) userData.city = city;
    if (state) userData.state = state;

    const user = await userRepository.create(userData);

    // Generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async login({ email, password }) {
    // Find user with password
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      const error = new Error('E-mail ou senha inválidos.');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const error = new Error('E-mail ou senha inválidos.');
      error.statusCode = 401;
      throw error;
    }

    // Remove password_hash from response
    const { password_hash, ...userData } = user;

    // Generate token
    const token = this.generateToken(userData);

    return { user: userData, token };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn },
    );
  }
}

module.exports = new AuthService();
