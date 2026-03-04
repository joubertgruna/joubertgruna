module.exports = {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
};
