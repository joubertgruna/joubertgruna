const express = require('express');
const { query: queryValidator, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { auth } = require('../middlewares/auth');
const { arredondarMonetario } = require('../utils/validators');

const router = express.Router();

/**
 * GET /relatorios/dre
 * Demonstração do Resultado do Exercício
 */
router.get('/dre', auth, [
  queryValidator('empresa_id').isInt().withMessage('ID da empresa é obrigatório'),
  queryValidator('ano').optional().isInt({ min: 2000, max: 2100 }),
  queryValidator('mes').optional().isInt({ min: 1, max: 12 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresa_id, ano, mes } = req.query;
    const anoAtual = ano || new Date().getFullYear();
    const mesAtual = mes || new Date().getMonth() + 1;

    // Receitas por categoria
    const receitas = await query(
      `SELECT categoria, SUM(valor) as total 
       FROM lancamentos 
       WHERE empresa_id = ? AND tipo = 'receita' 
       AND YEAR(data) = ? AND MONTH(data) = ? AND deleted_at IS NULL
       GROUP BY categoria`,
      [empresa_id, anoAtual, mesAtual]
    );

    // Despesas por categoria
    const despesas = await query(
      `SELECT categoria, SUM(valor) as total 
       FROM lancamentos 
       WHERE empresa_id = ? AND tipo = 'despesa' 
       AND YEAR(data) = ? AND MONTH(data) = ? AND deleted_at IS NULL
       GROUP BY categoria`,
      [empresa_id, anoAtual, mesAtual]
    );

    const totalReceitas = receitas.reduce((sum, r) => sum + Number(r.total), 0);
    const totalDespesas = despesas.reduce((sum, d) => sum + Number(d.total), 0);

    res.json({
      periodo: `${anoAtual}-${String(mesAtual).padStart(2, '0')}`,
      receita_bruta: arredondarMonetario(totalReceitas),
      deducoes: 0,
      receita_liquida: arredondarMonetario(totalReceitas),
      custo_vendas: 0,
      lucro_bruto: arredondarMonetario(totalReceitas),
      despesas_operacionais: arredondarMonetario(totalDespesas),
      das: 0,
      resultado_liquido: arredondarMonetario(totalReceitas - totalDespesas),
      receitas: {
        items: receitas.map(r => ({ categoria: r.categoria, valor: Number(r.total) })),
        total: arredondarMonetario(totalReceitas)
      },
      despesas: {
        items: despesas.map(d => ({ categoria: d.categoria, valor: Number(d.total) })),
        total: arredondarMonetario(totalDespesas)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /relatorios/balancete
 * Balancete contábil simplificado
 */
router.get('/balancete', auth, [
  queryValidator('empresa_id').isInt().withMessage('ID da empresa é obrigatório'),
  queryValidator('dataInicio').optional().isDate(),
  queryValidator('dataFim').optional().isDate(),
  queryValidator('ano').optional().isInt({ min: 2000, max: 2100 }),
  queryValidator('mes').optional().isInt({ min: 1, max: 12 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresa_id, dataInicio, dataFim, ano, mes } = req.query;

    // Aceita dataInicio/dataFim ou ano/mes
    let inicio = dataInicio;
    let fim = dataFim;
    if (!inicio) {
      const a = ano || new Date().getFullYear();
      const m = mes || new Date().getMonth() + 1;
      inicio = `${a}-${String(m).padStart(2, '0')}-01`;
      // Último dia do mês
      fim = new Date(a, m, 0).toISOString().split('T')[0];
    }

    // Saldos por categoria
    const movimentacao = await query(
      `SELECT categoria, tipo, SUM(valor) as total 
       FROM lancamentos 
       WHERE empresa_id = ? AND data BETWEEN ? AND ? AND deleted_at IS NULL
       GROUP BY categoria, tipo
       ORDER BY categoria`,
      [empresa_id, inicio, fim]
    );

    // Agrupa por categoria
    const balancete = {};
    movimentacao.forEach(m => {
      if (!balancete[m.categoria]) {
        balancete[m.categoria] = { debito: 0, credito: 0 };
      }
      if (m.tipo === 'despesa') {
        balancete[m.categoria].debito = Number(m.total);
      } else {
        balancete[m.categoria].credito = Number(m.total);
      }
    });

    const contas = Object.entries(balancete).map(([categoria, valores]) => ({
      categoria,
      debito: arredondarMonetario(valores.debito),
      credito: arredondarMonetario(valores.credito),
      saldo: arredondarMonetario(valores.credito - valores.debito)
    }));

    const totalDebitos = contas.reduce((sum, c) => sum + c.debito, 0);
    const totalCreditos = contas.reduce((sum, c) => sum + c.credito, 0);

    res.json({
      periodo: { inicio, fim },
      linhas: contas,
      totais: {
        debitos: arredondarMonetario(totalDebitos),
        creditos: arredondarMonetario(totalCreditos),
        saldo: arredondarMonetario(totalCreditos - totalDebitos)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /relatorios/fluxo-caixa
 * Fluxo de caixa mensal
 */
router.get('/fluxo-caixa', auth, [
  queryValidator('empresa_id').isInt().withMessage('ID da empresa é obrigatório'),
  queryValidator('ano').optional().isInt({ min: 2000, max: 2100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { empresa_id, ano } = req.query;
    const anoAtual = ano || new Date().getFullYear();

    const fluxo = await query(
      `SELECT 
        MONTH(data) as mes,
        tipo,
        SUM(valor) as total
       FROM lancamentos 
       WHERE empresa_id = ? AND YEAR(data) = ? AND deleted_at IS NULL
       GROUP BY MONTH(data), tipo
       ORDER BY mes`,
      [empresa_id, anoAtual]
    );

    // Monta array de 12 meses
    const meses = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      receitas: 0,
      despesas: 0,
      saldo: 0
    }));

    fluxo.forEach(f => {
      const idx = f.mes - 1;
      if (f.tipo === 'receita') {
        meses[idx].receitas = Number(f.total);
      } else {
        meses[idx].despesas = Number(f.total);
      }
    });

    // Calcula saldo mensal e acumulado
    let saldoAcumulado = 0;
    meses.forEach(m => {
      m.saldo = arredondarMonetario(m.receitas - m.despesas);
      saldoAcumulado += m.saldo;
      m.saldoAcumulado = arredondarMonetario(saldoAcumulado);
    });

    res.json({
      ano: anoAtual,
      meses,
      fluxo: meses  // alias para compatibilidade
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
