const express = require('express');
const { requireSignin, userMiddleware } = require('../common-middleware');
const { addToCart, getCartItems, removeCartItem } = require('../controllers/cart');

const router = express.Router();

router.post('/addToCart', requireSignin, userMiddleware, addToCart);
router.get('/getCartItems', requireSignin, userMiddleware, getCartItems);
router.post('/removeItem', requireSignin, userMiddleware, removeCartItem);

module.exports = router;
