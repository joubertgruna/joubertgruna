const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const socketConfig = require('../config/socket');
const chatHandler = require('./chatHandler');
const logger = require('../utils/logger');

let io;

const initSocket = (server) => {
  io = new Server(server, socketConfig);

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token não fornecido.'));
    }
    try {
      const decoded = jwt.verify(token, authConfig.secret);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      return next();
    } catch (err) {
      return next(new Error('Token inválido.'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: user ${socket.userId}`);

    // Join user's personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Chat events
    chatHandler(io, socket);

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: user ${socket.userId}`);
    });
  });

  logger.info('Socket.io initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized.');
  }
  return io;
};

module.exports = { initSocket, getIO };
