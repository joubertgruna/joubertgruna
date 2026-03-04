const Joi = require('joi');

const sendMessageSchema = {
  body: Joi.object({
    content: Joi.string().min(1).max(2000).required()
      .messages({ 'any.required': 'Conteúdo da mensagem é obrigatório.' }),
  }),
  params: Joi.object({
    matchId: Joi.number().integer().positive().required(),
  }),
};

module.exports = { sendMessageSchema };
