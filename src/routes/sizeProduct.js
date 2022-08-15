const express = require('express');
const { requireSignin , adminMiddleware } = require('../common-middleware');
const { addSizeProduct, updateQtyBySizeProduct } = require('../controllers/sizeProduct');


const router = express.Router();

router.post('/add', requireSignin, adminMiddleware, addSizeProduct);
router.post('/updateQuantity', requireSignin, adminMiddleware, updateQtyBySizeProduct);

module.exports = router;
