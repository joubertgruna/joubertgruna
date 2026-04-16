require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const empresaRoutes = require('./routes/empresa.routes');
const lancamentoRoutes = require('./routes/lancamento.routes');
const relatorioRoutes = require('./routes/relatorio.routes');
const apuracaoRoutes = require('./routes/apuracao.routes');
const agenteRoutes = require('./routes/agente.routes');

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globais
app.use(helmet());

// CORS — em produção aceita apenas as origens configuradas em ALLOWED_ORIGINS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sem origin (curl, Postman, mobile)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      callback(new Error(`CORS: origem não permitida — ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/auth', authRoutes);
app.use('/empresas', empresaRoutes);
app.use('/lancamentos', lancamentoRoutes);
app.use('/relatorios', relatorioRoutes);
app.use('/apuracao', apuracaoRoutes);
app.use('/agente', agenteRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API rodando na porta ${PORT}`);
});

module.exports = app;
