const express = require('express');
const { body, query: queryValidator, validationResult } = require('express-validator');
const simplesNacionalService = require('../services/SimplesNacionalService');
const empresaService = require('../services/EmpresaService');
const { auth } = require('../middlewares/auth');

const router = express.Router();

/**
 * POST /apuracao/das
 * Calcula DAS do Simples Nacional
 */
router.post('/das', auth, [
  body('empresa_id').optional().isInt(),
  body('faturamento_mensal').isFloat({ min: 0 }).withMessage('Faturamento mensal é obrigatório'),
  body('faturamento_12m').optional().isFloat({ min: 0 }),
  body('anexo').optional().isIn(['I', 'II', 'III', 'IV', 'V']),
  body('folha_pagamento_12m').optional().isFloat({ min: 0 }),
  body('folha_12m').optional().isFloat({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      empresa_id,
      faturamento_mensal,
      faturamento_12m,
      anexo,
      folha_pagamento_12m,
      folha_12m
    } = req.body;

    // Aceita folha_12m ou folha_pagamento_12m
    const folha = parseFloat(folha_pagamento_12m || folha_12m || 0);

    // Usa faturamento_12m do body se fornecido, senão busca do banco
    let fat12m = faturamento_12m ? parseFloat(faturamento_12m) : null;
    if (!fat12m && empresa_id) {
      const dashboard = await empresaService.getDashboard(empresa_id);
      fat12m = dashboard.faturamento_acumulado_12m || 0;
    }
    fat12m = fat12m || 0;

    // Determina anexo
    let anexoEfetivo = anexo;
    if (!anexoEfetivo && empresa_id) {
      const empresa = await empresaService.findById(empresa_id);
      anexoEfetivo = simplesNacionalService.getAnexoPorCNAE(empresa.cnae_principal || '47');
    }
    anexoEfetivo = anexoEfetivo || 'I';

    const resultado = simplesNacionalService.calcularDAS({
      faturamentoBrutoMensal: parseFloat(faturamento_mensal),
      faturamentoAcumulado12m: fat12m,
      anexo: anexoEfetivo,
      folhaPagamento12m: folha
    });

    if (resultado.erro) {
      return res.status(400).json({ error: resultado.mensagem });
    }

    // Retorna em snake_case para compatibilidade com o frontend
    res.json({
      empresa_id: empresa_id || null,
      competencia: new Date().toISOString().slice(0, 7),
      aliquota_efetiva: resultado.aliquotaEfetiva,
      valor_das: resultado.valorDAS,
      faixa: resultado.faixaNumero || null,
      fator_r: resultado.fatorR,
      anexo: resultado.anexo,
      nome_anexo: resultado.nomeAnexo,
      detalhamento: [
        { descricao: 'Faturamento Bruto do Mês', valor: parseFloat(faturamento_mensal) },
        { descricao: `Alíquota Nominal`, valor: resultado.faixaAtual?.aliquotaNominal || 0 },
        { descricao: 'Parcela a Deduzir', valor: resultado.faixaAtual?.parcelaADeduzir || 0 },
        { descricao: 'Valor do DAS', valor: resultado.valorDAS }
      ]
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /apuracao/simular
 * Simula DAS com valores informados
 */
router.get('/simular', auth, [
  queryValidator('faturamento_mensal').isFloat({ min: 0 }).withMessage('Faturamento mensal é obrigatório'),
  queryValidator('faturamento_12m').isFloat({ min: 0 }).withMessage('Faturamento 12 meses é obrigatório'),
  queryValidator('anexo').isIn(['I', 'II', 'III', 'IV', 'V']).withMessage('Anexo inválido'),
  queryValidator('folha_pagamento_12m').optional().isFloat({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { faturamento_mensal, faturamento_12m, anexo, folha_pagamento_12m } = req.query;

    const resultado = simplesNacionalService.calcularDAS({
      faturamentoBrutoMensal: parseFloat(faturamento_mensal),
      faturamentoAcumulado12m: parseFloat(faturamento_12m),
      anexo,
      folhaPagamento12m: parseFloat(folha_pagamento_12m) || 0
    });

    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /apuracao/tabelas
 * Retorna tabelas dos anexos do Simples Nacional
 */
router.get('/tabelas', (req, res) => {
  res.json(simplesNacionalService.getTabelasAnexos());
});

module.exports = router;
