const ApiResponse = require('../utils/apiResponse');

/**
 * Creates a validation middleware using a Joi schema
 * @param {object} schema - Joi schema object { body, params, query }
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  if (schema.body) {
    const { error } = schema.body.validate(req.body, { abortEarly: false });
    if (error) {
      errors.push(...error.details.map((d) => d.message));
    }
  }

  if (schema.params) {
    const { error } = schema.params.validate(req.params, { abortEarly: false });
    if (error) {
      errors.push(...error.details.map((d) => d.message));
    }
  }

  if (schema.query) {
    const { error } = schema.query.validate(req.query, { abortEarly: false });
    if (error) {
      errors.push(...error.details.map((d) => d.message));
    }
  }

  if (errors.length > 0) {
    return ApiResponse.badRequest(res, 'Erro de validação.', errors);
  }

  return next();
};

module.exports = validate;
