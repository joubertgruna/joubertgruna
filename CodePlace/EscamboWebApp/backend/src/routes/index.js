const { Router } = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const itemRoutes = require('./itemRoutes');
const likeRoutes = require('./likeRoutes');
const matchRoutes = require('./matchRoutes');
const chatRoutes = require('./chatRoutes');
const adRoutes = require('./adRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/likes', likeRoutes);
router.use('/matches', matchRoutes);
router.use('/chat', chatRoutes);
router.use('/ads', adRoutes);

module.exports = router;
