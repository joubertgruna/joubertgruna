const adService = require('../services/adService');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const getNextAd = asyncHandler(async (req, res) => {
  const ad = await adService.getNextAd();
  if (!ad) {
    return ApiResponse.success(res, null, 'Nenhum anúncio disponível.');
  }
  return ApiResponse.success(res, ad);
});

const registerClick = asyncHandler(async (req, res) => {
  await adService.registerClick(parseInt(req.params.id, 10));
  return ApiResponse.success(res, null, 'Clique registrado.');
});

// Admin endpoints
const createAd = asyncHandler(async (req, res) => {
  const ad = await adService.createAd(req.body);
  return ApiResponse.created(res, ad, 'Anúncio criado com sucesso.');
});

const updateAd = asyncHandler(async (req, res) => {
  const ad = await adService.updateAd(parseInt(req.params.id, 10), req.body);
  return ApiResponse.success(res, ad, 'Anúncio atualizado.');
});

const deleteAd = asyncHandler(async (req, res) => {
  await adService.deleteAd(parseInt(req.params.id, 10));
  return ApiResponse.success(res, null, 'Anúncio removido.');
});

const getAllAds = asyncHandler(async (req, res) => {
  const ads = await adService.getAllAds();
  return ApiResponse.success(res, ads);
});

module.exports = { getNextAd, registerClick, createAd, updateAd, deleteAd, getAllAds };
