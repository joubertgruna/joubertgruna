const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { compressAvatar } = require('../middlewares/compressionMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.put('/me/avatar', uploadSingle, compressAvatar, userController.updateAvatar);

module.exports = router;
