const express = require('express')
const authRoutes = require('./auth');
const categoryRoutes = require('./category');
const brandRoutes = require('./brand');
const productRoutes = require('./product');
const deliveryInfoRoutes = require('./deliveryInfo');
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const sizeProductRoutes = require('./sizeProduct');
const sizeRoutes = require('./size');
const userRoutes = require('./user');

const router = express.Router()

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/brand", brandRoutes);
router.use("/product", productRoutes);
router.use("/deliveryInfo", deliveryInfoRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/sizeProduct", sizeProductRoutes);
router.use("/size", sizeRoutes);
router.use("/user", userRoutes);

module.exports = router