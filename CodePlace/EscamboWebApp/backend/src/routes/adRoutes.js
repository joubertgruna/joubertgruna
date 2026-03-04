const { Router } = require('express');
const adController = require('../controllers/adController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

// User endpoints
router.get('/next', adController.getNextAd);
router.post('/:id/click', adController.registerClick);

// Admin endpoints (TODO: add admin middleware)
router.get('/', adController.getAllAds);
router.post('/', adController.createAd);
router.put('/:id', adController.updateAd);
router.delete('/:id', adController.deleteAd);

module.exports = router;
