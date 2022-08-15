const express = require('express');
const { requireSignin, userMiddleware, adminMiddleware } = require('../common-middleware');
const { addOrder, getOrder, getOrdersByUser, updateStatus, getAllOrders } = require('../controllers/order');

const router = express.Router();

router.post('/add', requireSignin, userMiddleware, addOrder);
router.post('/getOrderById', requireSignin, userMiddleware, getOrder);
router.post('/getOrdersByUser', requireSignin, userMiddleware, getOrdersByUser);
router.post('/updateStatus', requireSignin, updateStatus);
router.post('/getAllOrders', requireSignin, adminMiddleware, getAllOrders);

module.exports = router;
