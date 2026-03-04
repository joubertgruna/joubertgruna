const { Router } = require('express');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadMultiple } = require('../middlewares/uploadMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { createItemSchema, updateItemSchema } = require('../validators/itemValidator');

const router = Router();

// Public route - list available categories (must be before /:id)
router.get('/categories', itemController.getCategories);

router.use(authMiddleware);

router.post('/', uploadMultiple, validate(createItemSchema), itemController.create);
router.get('/', itemController.feed);
router.get('/mine', itemController.findMyItems);
router.get('/:id', itemController.findById);
router.put('/:id', validate(updateItemSchema), itemController.update);
router.delete('/:id', itemController.remove);
router.post('/:id/photos', uploadMultiple, itemController.addPhotos);
router.delete('/:id/photos/:photoId', itemController.deletePhoto);

module.exports = router;
