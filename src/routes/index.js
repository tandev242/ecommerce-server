const express = require('express')
const authRoutes = require('./auth');
const categoryRoutes = require('./category');
const productRoutes = require('./product');
const deliveryInfoRoutes = require('./deliveryInfo');
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const userRoutes = require('./user');

const router = express.Router()

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/deliveryInfo", deliveryInfoRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/user", userRoutes);

module.exports = router