const likeService = require('../services/likeService');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const like = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  const result = await likeService.likeItem(req.userId, itemId);

  const message = result.match
    ? '🎉 Match! Vocês combinaram!'
    : 'Item curtido com sucesso.';

  return ApiResponse.created(res, result, message);
});

const unlike = asyncHandler(async (req, res) => {
  await likeService.unlikeItem(req.userId, parseInt(req.params.id, 10));
  return ApiResponse.success(res, null, 'Curtida removida.');
});

const received = asyncHandler(async (req, res) => {
  const likes = await likeService.getReceivedLikes(req.userId);
  return ApiResponse.success(res, likes);
});

module.exports = { like, unlike, received };
