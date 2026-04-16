/**
 * Script de migração standalone — roda as migrations SQL no banco de dados.
 * Usado no deploy do Render via "Build Command".
 *
 * Uso:
 *   node db/migrate.js             → apenas migrations
 *   node db/migrate.js --seed      → migrations + seed de desenvolvimento
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const runSeed = process.argv.includes('--seed');

const MIGRATIONS_DIR = path.join(__dirname, '../../..', 'db', 'migrations');
const SEEDS_DIR = path.join(__dirname, '../../..', 'db', 'seeds');

async function getConnection() {
  return mysql.createConnection({
    uri: process.env.DATABASE_URL,
    multipleStatements: true,
    ...(isProduction && { ssl: { rejectUnauthorized: false } }),
  });
}

async function runSQLFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  // Remove comentários de linha e divide em statements
  await connection.query(sql);
  console.log(`  ✅ ${path.basename(filePath)}`);
}

async function runFiles(connection, dir, label) {
  if (!fs.existsSync(dir)) {
    console.log(`  ⚠️  Diretório ${label} não encontrado: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log(`  ℹ️  Nenhum arquivo SQL em ${label}`);
    return;
  }

  for (const file of files) {
    await runSQLFile(connection, path.join(dir, file));
  }
}

async function main() {
  console.log('🗄️  SIMEI Contador — Migrações do banco de dados');
  console.log(`   Ambiente: ${isProduction ? 'produção' : 'desenvolvimento'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':***@')}\n`);

  let connection;
  try {
    connection = await getConnection();
    console.log('🔗 Conectado ao banco de dados.\n');

    console.log('📦 Rodando migrations...');
    await runFiles(connection, MIGRATIONS_DIR, 'migrations');

    if (runSeed && !isProduction) {
      console.log('\n🌱 Rodando seeds...');
      await runFiles(connection, SEEDS_DIR, 'seeds');
    } else if (runSeed && isProduction) {
      console.log('\n⚠️  Seeds ignorados em produção.');
    }

    console.log('\n✅ Concluído com sucesso!');
  } catch (err) {
    console.error('\n❌ Erro durante migração:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

main();
