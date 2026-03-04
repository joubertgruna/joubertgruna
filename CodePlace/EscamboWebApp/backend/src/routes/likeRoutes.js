const { Router } = require('express');
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.use(authMiddleware);

router.post('/', likeController.like);
router.delete('/:id', likeController.unlike);
router.get('/received', likeController.received);

module.exports = router;
