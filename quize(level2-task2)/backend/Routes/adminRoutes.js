const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/category', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.addCategory);
router.post('/question', authMiddleware.verifyToken, authMiddleware.isAdmin, adminController.addQuestion);
router.post('/getCategory', authMiddleware.verifyToken, authMiddleware.any, adminController.getCategory);
router.post('/getQuestion', authMiddleware.verifyToken, authMiddleware.any, adminController.getQuestion);

module.exports = router;