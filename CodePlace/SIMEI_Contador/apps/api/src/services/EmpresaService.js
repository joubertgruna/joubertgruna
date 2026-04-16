const { query, transaction } = require('../config/database');
const ApiError = require('../utils/ApiError');
const { validarCNPJ } = require('../utils/validators');

class EmpresaService {
  /**
   * Cria nova empresa
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async create(data) {
    const {
      cnpj, razao_social,
      nome_fantasia = null, regime_tributario = null,
      cnae_principal = null, endereco = null
    } = data;

    // Validação CNPJ
    if (!validarCNPJ(cnpj)) {
      throw ApiError.badRequest('CNPJ inválido');
    }

    // Verifica duplicidade
    const [existing] = await query(
      'SELECT id FROM empresas WHERE cnpj = ? AND deleted_at IS NULL',
      [cnpj.replace(/[^\d]/g, '')]
    );

    if (existing) {
      throw ApiError.conflict('CNPJ já cadastrado');
    }

    const result = await query(
      `INSERT INTO empresas 
       (cnpj, razao_social, nome_fantasia, regime_tributario, cnae_principal, endereco, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        cnpj.replace(/[^\d]/g, ''),
        razao_social,
        nome_fantasia,
        regime_tributario || 'simples_nacional',
        cnae_principal,
        endereco || null
      ]
    );

    return this.findById(result.insertId);
  }

  /**
   * Busca empresa por ID
   * @param {number} id 
   * @returns {Promise<object>}
   */
  async findById(id) {
    const [empresa] = await query(
      'SELECT * FROM empresas WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!empresa) {
      throw ApiError.notFound('Empresa não encontrada');
    }

    // mysql2 retorna colunas JSON já parseadas como objeto JS.
    // Garante compatibilidade independente da versão do driver.
    if (empresa.endereco && typeof empresa.endereco === 'string') {
      try { empresa.endereco = JSON.parse(empresa.endereco); } catch { empresa.endereco = null; }
    }

    return empresa;
  }

  /**
   * Lista empresas com paginação
   * @param {object} options 
   * @returns {Promise<{data: array, total: number}>}
   */
  async findAll({ page = 1, limit = 10, search = '' }) {
    const pageInt = parseInt(page) || 1;
    const limitInt = parseInt(limit) || 10;
    const offset = (pageInt - 1) * limitInt;
    let whereClause = 'WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      whereClause += ' AND (razao_social LIKE ? OR cnpj LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM empresas ${whereClause}`,
      params
    );

    const empresas = await query(
      `SELECT * FROM empresas ${whereClause} ORDER BY razao_social LIMIT ? OFFSET ?`,
      [...params, limitInt, offset]
    );

    return {
      data: empresas.map(e => ({
        ...e,
        endereco: e.endereco && typeof e.endereco === 'string'
          ? (() => { try { return JSON.parse(e.endereco); } catch { return null; } })()
          : (e.endereco || null)
      })),
      total: countResult.total,
      page: pageInt,
      limit
    };
  }

  /**
   * Atualiza empresa
   * @param {number} id 
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async update(id, data) {
    await this.findById(id); // Verifica se existe

    const {
      razao_social = null, nome_fantasia = null,
      regime_tributario = null, cnae_principal = null,
      endereco = null
    } = data;

    await query(
      `UPDATE empresas SET 
        razao_social = COALESCE(?, razao_social),
        nome_fantasia = COALESCE(?, nome_fantasia),
        regime_tributario = COALESCE(?, regime_tributario),
        cnae_principal = COALESCE(?, cnae_principal),
        endereco = COALESCE(?, endereco),
        updated_at = NOW()
       WHERE id = ?`,
      [razao_social, nome_fantasia, regime_tributario, cnae_principal, endereco || null, id]
    );

    return this.findById(id);
  }

  /**
   * Soft delete de empresa
   * @param {number} id 
   */
  async delete(id) {
    await this.findById(id);
    await query('UPDATE empresas SET deleted_at = NOW() WHERE id = ?', [id]);
  }

  /**
   * Dashboard financeiro da empresa
   * @param {number} empresaId 
   * @param {string} periodo - Formato: 'YYYY-MM'
   * @returns {Promise<object>}
   */
  async getDashboard(empresaId, periodo) {
    const ano = periodo ? periodo.split('-')[0] : new Date().getFullYear();
    const mes = periodo ? periodo.split('-')[1] : new Date().getMonth() + 1;

    // Receitas do mês
    const [receitas] = await query(
      `SELECT COALESCE(SUM(valor), 0) as total FROM lancamentos 
       WHERE empresa_id = ? AND tipo = 'receita' 
       AND YEAR(data) = ? AND MONTH(data) = ? AND deleted_at IS NULL`,
      [empresaId, ano, mes]
    );

    // Despesas do mês
    const [despesas] = await query(
      `SELECT COALESCE(SUM(valor), 0) as total FROM lancamentos 
       WHERE empresa_id = ? AND tipo = 'despesa' 
       AND YEAR(data) = ? AND MONTH(data) = ? AND deleted_at IS NULL`,
      [empresaId, ano, mes]
    );

    // Faturamento últimos 12 meses (para Simples Nacional)
    const faturamento12m = await query(
      `SELECT DATE_FORMAT(data, '%Y-%m') as mes, SUM(valor) as total 
       FROM lancamentos 
       WHERE empresa_id = ? AND tipo = 'receita' 
       AND data >= DATE_SUB(NOW(), INTERVAL 12 MONTH) 
       AND deleted_at IS NULL
       GROUP BY DATE_FORMAT(data, '%Y-%m')
       ORDER BY mes`,
      [empresaId]
    );

    const totalFaturamento12m = faturamento12m.reduce((sum, m) => sum + Number(m.total), 0);

    return {
      periodo: `${ano}-${String(mes).padStart(2, '0')}`,
      receitas: Number(receitas.total),
      despesas: Number(despesas.total),
      resultado: Number(receitas.total) - Number(despesas.total),
      faturamento_acumulado_12m: totalFaturamento12m,
      historico_mensal: faturamento12m
    };
  }
}

module.exports = new EmpresaService();
