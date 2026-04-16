const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Login de usuário
   * @param {string} email 
   * @param {string} senha 
   * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
   */
  async login(email, senha) {
    const [user] = await query(
      'SELECT * FROM usuarios WHERE email = ? AND deleted_at IS NULL',
      [email]
    );

    if (!user) {
      throw ApiError.unauthorized('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      throw ApiError.unauthorized('Credenciais inválidas');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salva refresh token no banco
    await query(
      'UPDATE usuarios SET refresh_token = ? WHERE id = ?',
      [refreshToken, user.id]
    );

    // Não retorna senha
    delete user.senha_hash;
    delete user.refresh_token;

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh do token de acesso
   * @param {string} refreshToken 
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      const [user] = await query(
        'SELECT * FROM usuarios WHERE id = ? AND refresh_token = ? AND deleted_at IS NULL',
        [decoded.id, refreshToken]
      );

      if (!user) {
        throw ApiError.unauthorized('Refresh token inválido');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      await query(
        'UPDATE usuarios SET refresh_token = ? WHERE id = ?',
        [newRefreshToken, user.id]
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw ApiError.unauthorized('Refresh token expirado ou inválido');
    }
  }

  /**
   * Logout - invalida refresh token
   * @param {number} userId 
   */
  async logout(userId) {
    await query('UPDATE usuarios SET refresh_token = NULL WHERE id = ?', [userId]);
  }

  /**
   * Cria usuário
   * @param {object} userData 
   * @returns {Promise<object>}
   */
  async createUser({ nome, email, senha, role, empresa_id }) {
    const [existing] = await query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing) {
      throw ApiError.conflict('Email já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const result = await query(
      `INSERT INTO usuarios (nome, email, senha_hash, role, empresa_id, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nome, email, senhaHash, role || 'empresa', empresa_id]
    );

    return { id: result.insertId, nome, email, role: role || 'empresa' };
  }

  generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, empresa_id: user.empresa_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = new AuthService();
