const itemService = require('../services/itemService');
const { VALID_CATEGORIES } = require('../validators/itemValidator');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler, parsePagination } = require('../utils/helpers');

const getCategories = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, { categories: VALID_CATEGORIES });
});

const create = asyncHandler(async (req, res) => {
  const item = await itemService.create(req.userId, req.body, req.files || []);
  return ApiResponse.created(res, item, 'Item criado com sucesso.');
});

const findById = asyncHandler(async (req, res) => {
  const item = await itemService.findById(req.params.id);
  return ApiResponse.success(res, item);
});

const findMyItems = asyncHandler(async (req, res) => {
  const items = await itemService.findByUser(req.userId);
  return ApiResponse.success(res, items);
});

const feed = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);
  const { items, total } = await itemService.findForFeed(req.userId, pagination);
  return ApiResponse.paginated(res, items, { ...pagination, total });
});

const update = asyncHandler(async (req, res) => {
  const item = await itemService.update(req.userId, req.params.id, req.body);
  return ApiResponse.success(res, item, 'Item atualizado com sucesso.');
});

const remove = asyncHandler(async (req, res) => {
  await itemService.delete(req.userId, req.params.id);
  return ApiResponse.success(res, null, 'Item removido com sucesso.');
});

const addPhotos = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return ApiResponse.badRequest(res, 'Nenhuma foto enviada.');
  }
  const photos = await itemService.addPhotos(req.userId, req.params.id, req.files);
  return ApiResponse.created(res, photos, 'Fotos adicionadas com sucesso.');
});

const deletePhoto = asyncHandler(async (req, res) => {
  const result = await itemService.deletePhoto(req.userId, req.params.id, req.params.photoId);
  return ApiResponse.success(res, result, 'Foto removida com sucesso.');
});

module.exports = { getCategories, create, findById, findMyItems, feed, update, remove, addPhotos, deletePhoto };
