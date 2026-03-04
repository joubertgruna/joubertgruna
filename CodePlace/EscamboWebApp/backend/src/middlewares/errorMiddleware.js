const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack });

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return ApiResponse.badRequest(res, 'Arquivo muito grande. Máximo: 5MB.');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return ApiResponse.badRequest(res, 'Muitos arquivos. Máximo: 5.');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return ApiResponse.badRequest(res, 'Campo de upload inesperado.');
  }

  // Joi validation errors
  if (err.isJoi) {
    const errors = err.details.map((detail) => detail.message);
    return ApiResponse.badRequest(res, 'Erro de validação.', errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Token inválido.');
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.unauthorized(res, 'Token expirado.');
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return ApiResponse.conflict(res, 'Registro duplicado.');
  }

  // Default
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Erro interno do servidor.'
    : err.message;

  return ApiResponse.error(res, message, statusCode);
};

const notFoundHandler = (_req, res) => {
  return ApiResponse.notFound(res, 'Rota não encontrada.');
};

module.exports = { errorHandler, notFoundHandler };
