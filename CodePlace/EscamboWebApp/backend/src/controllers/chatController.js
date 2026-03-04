const chatService = require('../services/chatService');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler, parsePagination } = require('../utils/helpers');

const getMessages = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);
  const result = await chatService.getMessages(
    parseInt(req.params.matchId, 10),
    req.userId,
    pagination,
  );
  return ApiResponse.success(res, result);
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await chatService.sendMessage(
    parseInt(req.params.matchId, 10),
    req.userId,
    req.body.content,
  );
  return ApiResponse.created(res, message, 'Mensagem enviada.');
});

module.exports = { getMessages, sendMessage };
