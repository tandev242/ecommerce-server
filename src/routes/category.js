const express = require('express');
const { addCategory, getCategories, deleteCategories, updateCategories, getFlatCategories } = require('../controllers/category');
const { requireSignin, adminMiddleware, uploadCloud } = require('../common-middleware');
const router = express.Router();

router.post('/add', requireSignin, adminMiddleware, uploadCloud.single("categoryImage"), addCategory);
router.get('/getCategories', getCategories);
router.get('/getFlatCategories', getFlatCategories);
router.post('/delete', requireSignin, adminMiddleware, deleteCategories)
router.post('/update', requireSignin, adminMiddleware, uploadCloud.none(), updateCategories)

module.exports = router;
