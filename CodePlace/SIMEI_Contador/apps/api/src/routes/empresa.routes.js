const express = require('express');
const { body, query: queryValidator, param, validationResult } = require('express-validator');
const empresaService = require('../services/EmpresaService');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * POST /empresas
 * Cria nova empresa
 */
router.post('/', auth, [
  body('cnpj').notEmpty().withMessage('CNPJ é obrigatório'),
  body('razao_social').notEmpty().withMessage('Razão social é obrigatória'),
  body('regime_tributario').optional().isIn(['simples_nacional', 'lucro_presumido', 'lucro_real'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const empresa = await empresaService.create(req.body);
    res.status(201).json(empresa);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /empresas
 * Lista empresas com paginação
 */
router.get('/', auth, [
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 }),
  queryValidator('search').optional().isString()
], async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await empresaService.findAll({ 
      page: parseInt(page) || 1, 
      limit: parseInt(limit) || 10,
      search 
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /empresas/:id
 * Busca empresa por ID
 */
router.get('/:id', auth, [
  param('id').isInt().withMessage('ID inválido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const empresa = await empresaService.findById(parseInt(req.params.id));
    res.json(empresa);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /empresas/:id
 * Atualiza empresa
 */
router.put('/:id', auth, [
  param('id').isInt().withMessage('ID inválido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const empresa = await empresaService.update(parseInt(req.params.id), req.body);
    res.json(empresa);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /empresas/:id
 * Remove empresa (soft delete)
 */
router.delete('/:id', auth, authorize('admin', 'super_usuario'), [
  param('id').isInt().withMessage('ID inválido')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await empresaService.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * GET /empresas/:id/dashboard
 * Dashboard financeiro da empresa
 */
router.get('/:id/dashboard', auth, [
  param('id').isInt().withMessage('ID inválido'),
  queryValidator('periodo').optional().matches(/^\d{4}-\d{2}$/).withMessage('Período deve ser no formato YYYY-MM')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dashboard = await empresaService.getDashboard(
      parseInt(req.params.id),
      req.query.periodo
    );
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
