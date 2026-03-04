const { Router } = require('express');
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatch);
router.post('/:id/ad-shown', matchController.markAdShown);

module.exports = router;
