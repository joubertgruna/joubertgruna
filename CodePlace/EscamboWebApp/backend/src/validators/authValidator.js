const Joi = require('joi');

const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required()
      .messages({ 'any.required': 'Nome é obrigatório.' }),
    email: Joi.string().email().required()
      .messages({ 'any.required': 'E-mail é obrigatório.' }),
    phone: Joi.string().min(10).max(20).required()
      .messages({ 'any.required': 'Telefone é obrigatório.' }),
    password: Joi.string().min(6).max(100).required()
      .messages({ 'any.required': 'Senha é obrigatória.' }),
    city: Joi.string().max(100).allow('', null).optional(),
    state: Joi.string().max(50).allow('', null).optional(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required()
      .messages({ 'any.required': 'E-mail é obrigatório.' }),
    password: Joi.string().required()
      .messages({ 'any.required': 'Senha é obrigatória.' }),
  }),
};

module.exports = { registerSchema, loginSchema };
