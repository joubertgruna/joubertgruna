const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const ApiResponse = require('../utils/apiResponse');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return ApiResponse.unauthorized(res, 'Token não fornecido.');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return ApiResponse.unauthorized(res, 'Token mal formatado.');
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    return next();
  } catch (err) {
    return ApiResponse.unauthorized(res, 'Token inválido ou expirado.');
  }
};

module.exports = authMiddleware;
