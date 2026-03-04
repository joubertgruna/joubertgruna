const matchService = require('../services/matchService');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const getMatches = asyncHandler(async (req, res) => {
  const matches = await matchService.getMatches(req.userId);
  return ApiResponse.success(res, matches);
});

const getMatch = asyncHandler(async (req, res) => {
  const match = await matchService.getMatch(req.params.id, req.userId);
  return ApiResponse.success(res, match);
});

const markAdShown = asyncHandler(async (req, res) => {
  await matchService.markAdShown(req.params.id, req.userId);
  return ApiResponse.success(res, null, 'Anúncio registrado como visualizado.');
});

module.exports = { getMatches, getMatch, markAdShown };
