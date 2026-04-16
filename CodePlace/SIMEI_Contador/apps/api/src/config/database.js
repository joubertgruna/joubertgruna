const mysql = require('mysql2/promise');

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Aiven e outros provedores cloud exigem SSL em produção
  ...(isProduction && {
    ssl: { rejectUnauthorized: false },
  }),
});

// Converte undefined → null para evitar erro do mysql2
// "Bind parameters must not contain undefined. To pass SQL NULL specify JS null"
const n = (v) => (v === undefined ? null : v);

// Wrapper para executar queries
// Usa pool.query() (não prepared statements) para compatibilidade com LIMIT/OFFSET no MySQL 8
const query = async (sql, params = []) => {
  const safeParams = params.map(n);
  const [results] = await pool.query(sql, safeParams);
  return results;
};

// Wrapper para transações
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { pool, query, transaction };
