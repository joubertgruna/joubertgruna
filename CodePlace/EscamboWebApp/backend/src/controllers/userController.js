const userService = require('../services/userService');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.userId);
  return ApiResponse.success(res, user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, city, state } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (bio !== undefined) updateData.bio = bio;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;

  const user = await userService.updateProfile(req.userId, updateData);
  return ApiResponse.success(res, user, 'Perfil atualizado com sucesso.');
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.badRequest(res, 'Nenhuma imagem enviada.');
  }
  const avatarUrl = `/uploads/${req.file.filename}`;
  const user = await userService.updateAvatar(req.userId, avatarUrl);
  return ApiResponse.success(res, user, 'Avatar atualizado com sucesso.');
});

module.exports = { getProfile, updateProfile, updateAvatar };
