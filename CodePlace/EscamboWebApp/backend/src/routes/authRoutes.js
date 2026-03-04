const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

module.exports = router;
