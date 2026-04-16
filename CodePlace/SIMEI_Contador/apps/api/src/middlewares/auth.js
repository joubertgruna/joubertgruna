const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

/**
 * Middleware de autenticação JWT
 */
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expirado'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Token inválido'));
    }
    next(error);
  }
};

/**
 * Middleware para verificar roles
 * @param  {...string} roles - Roles permitidas
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Usuário não autenticado'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Você não tem permissão para acessar este recurso'));
    }

    next();
  };
};

module.exports = { auth, authorize };
