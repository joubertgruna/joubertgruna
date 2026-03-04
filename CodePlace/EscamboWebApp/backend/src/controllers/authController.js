const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');
const { asyncHandler } = require('../utils/helpers');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  return ApiResponse.created(res, { user, token }, 'Cadastro realizado com sucesso.');
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  return ApiResponse.success(res, { user, token }, 'Login realizado com sucesso.');
});

module.exports = { register, login };
