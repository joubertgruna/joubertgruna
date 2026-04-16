const logger = require('../utils/logger');

/**
 * Middleware global de tratamento de erros
 */
const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Erro customizado da API
  if (err.name === 'ApiError') {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
  }

  // Erro de validação do express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.array()
    });
  }

  // Erro do MySQL
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      error: 'Erro no banco de dados',
      code: err.code
    });
  }

  // Erro genérico
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
};

module.exports = errorHandler;
