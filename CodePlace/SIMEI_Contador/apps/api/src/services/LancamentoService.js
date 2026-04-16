const { query, transaction } = require('../config/database');
const ApiError = require('../utils/ApiError');
const { arredondarMonetario } = require('../utils/validators');

class LancamentoService {
  /**
   * Cria novo lançamento
   * @param {object} data 
   * @returns {Promise<object>}
   */
  async create(data) {
    const {
      empresa_id, tipo, categoria,
      descricao = null, valor, data: dataLanc,
      documento = null, usuario_id = null
    } = data;

    const result = await query(
      `INSERT INTO lancamentos 
       (empresa_id, tipo, categoria, descricao, valor, data, documento, created_by, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [empresa_id, tipo, categoria, descricao, arredondarMonetario(valor), dataLanc, documento, usuario_id]
    );

    // Log de auditoria
    await this.logAuditoria(result.insertId, 'CREATE', usuario_id, null, data);

    return this.findById(result.insertId);
  }

  /**
   * Busca lançamento por ID
   * @param {number} id 
   * @returns {Promise<object>}
   */
  async findById(id) {
    const [lancamento] = await query(
      'SELECT * FROM lancamentos WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!lancamento) {
      throw ApiError.notFound('Lançamento não encontrado');
    }

    return lancamento;
  }

  /**
   * Lista lançamentos por empresa com filtros
   * @param {number} empresaId 
   * @param {object} filtros 
   * @returns {Promise<{data: array, total: number}>}
   */
  async findByEmpresa(empresaId, { page = 1, limit = 20, tipo, categoria, dataInicio, dataFim }) {
    const pageInt = parseInt(page) || 1;
    const limitInt = parseInt(limit) || 20;
    const offset = (pageInt - 1) * limitInt;
    let whereClause = 'WHERE empresa_id = ? AND deleted_at IS NULL';
    const params = [empresaId];

    if (tipo) {
      whereClause += ' AND tipo = ?';
      params.push(tipo);
    }

    if (categoria) {
      whereClause += ' AND categoria = ?';
      params.push(categoria);
    }

    if (dataInicio) {
      whereClause += ' AND data >= ?';
      params.push(dataInicio);
    }

    if (dataFim) {
      whereClause += ' AND data <= ?';
      params.push(dataFim);
    }

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM lancamentos ${whereClause}`,
      params
    );

    const lancamentos = await query(
      `SELECT * FROM lancamentos ${whereClause} ORDER BY data DESC, id DESC LIMIT ? OFFSET ?`,
      [...params, limitInt, offset]
    );

    return {
      data: lancamentos,
      total: countResult.total,
      page: pageInt,
      limit: limitInt
    };
  }

  /**
   * Atualiza lançamento
   * @param {number} id 
   * @param {object} data 
   * @param {number} usuarioId 
   * @returns {Promise<object>}
   */
  async update(id, data, usuarioId) {
    const anterior = await this.findById(id);

    const {
      tipo = null, categoria = null, descricao = null,
      valor, data: dataLanc = null, documento = null
    } = data;

    await query(
      `UPDATE lancamentos SET 
        tipo = COALESCE(?, tipo),
        categoria = COALESCE(?, categoria),
        descricao = COALESCE(?, descricao),
        valor = COALESCE(?, valor),
        data = COALESCE(?, data),
        documento = COALESCE(?, documento),
        updated_at = NOW()
       WHERE id = ?`,
      [tipo, categoria, descricao, valor ? arredondarMonetario(valor) : null, dataLanc, documento, id]
    );

    // Log de auditoria
    await this.logAuditoria(id, 'UPDATE', usuarioId, anterior, data);

    return this.findById(id);
  }

  /**
   * Soft delete de lançamento
   * @param {number} id 
   * @param {number} usuarioId 
   */
  async delete(id, usuarioId) {
    const anterior = await this.findById(id);
    await query('UPDATE lancamentos SET deleted_at = NOW() WHERE id = ?', [id]);
    await this.logAuditoria(id, 'DELETE', usuarioId, anterior, null);
  }

  /**
   * Importa lançamentos de CSV
   * @param {number} empresaId 
   * @param {array} lancamentos 
   * @param {number} usuarioId 
   * @returns {Promise<{importados: number, erros: array}>}
   */
  async importarCSV(empresaId, lancamentos, usuarioId) {
    const resultados = { importados: 0, erros: [] };

    for (const [index, lanc] of lancamentos.entries()) {
      try {
        await this.create({
          ...lanc,
          empresa_id: empresaId,
          usuario_id: usuarioId
        });
        resultados.importados++;
      } catch (error) {
        resultados.erros.push({ linha: index + 1, erro: error.message });
      }
    }

    return resultados;
  }

  /**
   * Log de auditoria para alterações
   */
  async logAuditoria(lancamentoId, acao, usuarioId, dadosAnteriores, dadosNovos) {
    await query(
      `INSERT INTO logs_auditoria (entidade, entidade_id, acao, usuario_id, dados_anteriores, dados_novos, created_at)
       VALUES ('lancamento', ?, ?, ?, ?, ?, NOW())`,
      [
        lancamentoId,
        acao,
        usuarioId,
        dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
        dadosNovos ? JSON.stringify(dadosNovos) : null
      ]
    );
  }
}

module.exports = new LancamentoService();
