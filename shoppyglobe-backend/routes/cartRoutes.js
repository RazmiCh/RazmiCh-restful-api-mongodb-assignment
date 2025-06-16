const express = require('express');
const router = express.Router();
const { addToCart, updateCart, deleteFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, addToCart);
router.put('/:id', protect, updateCart);
router.delete('/:id', protect, deleteFromCart);

module.exports = router;
