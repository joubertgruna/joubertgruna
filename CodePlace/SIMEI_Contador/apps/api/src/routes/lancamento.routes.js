const express = require('express');
const { body, query: queryValidator, param, validationResult } = require('express-validator');
const lancamentoService = require('../services/LancamentoService');
const { auth } = require('../middlewares/auth');

const router = express.Router();

/**
 * POST /lancamentos
 * Cria novo lançamento
 */
router.post('/', auth, [
  body('empresa_id').isInt().withMessage('ID da empresa é obrigatório'),
  body('tipo').isIn(['receita', 'despesa']).withMessage('Tipo deve ser receita ou despesa'),
  body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
  body('valor').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
  body('data').isDate().withMessage('Data inválida'),
  body('descricao').optional().isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lancamento = await lancamentoService.create({
      ...req.body,
      usuario_id: req.user.id
    });
    res.status(201).json(lancamento);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /lancamentos
 * Lista lançamentos por empresa
 */
router.get('/', auth, [
  queryValidator('empresa_id').isInt().withMessage('ID da empresa é obrigatório'),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
  queryValidator('tipo').optional().isIn(['receita', 'despesa']),
  queryValidator('dataInicio').optional().isDate(),
  queryValidator('dataFim').optional().isDate()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresa_id, page, limit, tipo, categoria, dataInicio, dataFim } = req.query;
    const result = await lancamentoService.findByEmpresa(parseInt(empresa_id), {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      tipo,
      categoria,
      dataInicio,
      dataFim
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /lancamentos/:id
 * Busca lançamento por ID
 */
router.get('/:id', auth, [
  param('id').isInt().withMessage('ID inválido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lancamento = await lancamentoService.findById(parseInt(req.params.id));
    res.json(lancamento);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /lancamentos/:id
 * Atualiza lançamento
 */
router.put('/:id', auth, [
  param('id').isInt().withMessage('ID inválido'),
  body('tipo').optional().isIn(['receita', 'despesa']),
  body('valor').optional().isFloat({ min: 0.01 }),
  body('data').optional().isDate()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lancamento = await lancamentoService.update(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );
    res.json(lancamento);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /lancamentos/:id
 * Remove lançamento (soft delete)
 */
router.delete('/:id', auth, [
  param('id').isInt().withMessage('ID inválido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await lancamentoService.delete(parseInt(req.params.id), req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * POST /lancamentos/importar
 * Importa lançamentos de CSV
 */
router.post('/importar', auth, [
  body('empresa_id').isInt().withMessage('ID da empresa é obrigatório'),
  body('lancamentos').isArray({ min: 1 }).withMessage('Lista de lançamentos é obrigatória')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresa_id, lancamentos } = req.body;
    const result = await lancamentoService.importarCSV(
      empresa_id,
      lancamentos,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
