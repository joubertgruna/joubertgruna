const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/AuthService');
const { auth } = require('../middlewares/auth');

const router = express.Router();

/**
 * POST /auth/login
 * Login de usuário
 */
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;
    const result = await authService.login(email, senha);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/refresh
 * Refresh do token de acesso
 */
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token é obrigatório')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/logout
 * Logout - invalida refresh token
 */
router.post('/logout', auth, async (req, res, next) => {
  try {
    await authService.logout(req.user.id);
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/register
 * Registro de novo usuário (apenas admin/super_usuario)
 */
router.post('/register', [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role').optional().isIn(['empresa', 'admin', 'super_usuario'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await authService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/me
 * Retorna dados do usuário logado
 */
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
