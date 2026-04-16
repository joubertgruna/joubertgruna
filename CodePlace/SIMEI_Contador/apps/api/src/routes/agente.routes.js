const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middlewares/auth');
const { chat } = require('../services/AgenteService');
const logger = require('../utils/logger');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(auth);

/**
 * POST /agente/chat
 * Envia mensagens ao agente e recebe a resposta.
 *
 * Body:
 *   messages   - array de {role: 'user'|'assistant', content: string}
 *   empresa_id - (opcional) ID da empresa no contexto
 */
router.post(
  '/chat',
  [
    body('messages')
      .isArray({ min: 1 })
      .withMessage('messages deve ser um array com ao menos uma mensagem'),
    body('messages.*.role')
      .isIn(['user', 'assistant'])
      .withMessage('role deve ser user ou assistant'),
    body('messages.*.content')
      .isString()
      .notEmpty()
      .withMessage('content não pode ser vazio'),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { messages, empresa_id } = req.body;
      const usuario_id = req.user?.id;
      const is_admin = ['admin', 'super_usuario'].includes(req.user?.role);

      // Limita histórico a 20 mensagens para evitar contexto enorme
      const historico = messages.slice(-20);

      logger.info(`[Agente] Chat - usuario ${usuario_id}, empresa ${empresa_id}, msgs: ${historico.length}`);

      const resultado = await chat({
        messages: historico,
        empresa_id: empresa_id || req.user?.empresa_id || null,
        usuario_id,
        is_admin,
      });

      return res.json({
        role: 'assistant',
        content: resultado.content,
        ferramentas_usadas: resultado.ferramentas_usadas,
        tokens: resultado.tokens,
      });
    } catch (err) {
      logger.error('[Agente] Erro no chat:', err);

      // Erros de token / autenticação GitHub
      if (err?.status === 401 || err?.code === 'invalid_api_key') {
        return res.status(503).json({
          error: 'Serviço de IA indisponível. Verifique a configuração do GITHUB_TOKEN.',
        });
      }
      if (err?.status === 429) {
        return res.status(429).json({
          error: 'Limite de requisições atingido. Aguarde alguns instantes e tente novamente.',
        });
      }

      next(err);
    }
  }
);

/**
 * GET /agente/status
 * Verifica se o agente está configurado e operacional.
 */
router.get('/status', (req, res) => {
  const configurado = !!process.env.GITHUB_TOKEN;
  res.json({
    configurado,
    provedor: 'GitHub Models (github.com/marketplace/models)',
    modelo: process.env.GITHUB_MODEL || 'gpt-4o-mini',
    mensagem: configurado
      ? 'Agente pronto para uso via GitHub Models.'
      : 'GITHUB_TOKEN não configurado. Adicione no arquivo .env da API.',
  });
});

module.exports = router;
