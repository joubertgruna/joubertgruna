const { Router } = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { sendMessageSchema } = require('../validators/chatValidator');

const router = Router();

router.use(authMiddleware);

router.get('/:matchId', chatController.getMessages);
router.post('/:matchId', validate(sendMessageSchema), chatController.sendMessage);

module.exports = router;
