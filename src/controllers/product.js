const { Product, Category } = require("../models")
const shortid = require("shortid");
const slugify = require("slugify");

exports.addProduct = (req, res) => {
    const { name, price, description, category, discountPercent } = req.body
    const variants = JSON.parse(req.body.variants)
    let productPictures = []

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return file.path
        })
    }
    const product = new Product({
        name: name,
        slug: `${slugify(name)}-${shortid.generate()}`,
        price,
        description,
        productPictures,
        variants,
        discountPercent,
        category
    })
    product.save((error, product) => {
        if (error) return res.status(400).json({ error })
        if (product) {
            res.status(201).json({ product, files: req.files })
        } else {
            res.status(400).json({ error: "something went wrong" })
        }
    })
}

exports.addProducts = async (req, res) => {
    const items = req.body.items
    var count = 0;
    for (let i = 0; i < items.length; i++) {
        const { name, price, description, category, discountPercent, variants, productPictures } = items[i];
        const product = new Product({
            name: name,
            slug: `${slugify(name)}-${shortid.generate()}`,
            price,
            description,
            productPictures,
            variants,
            discountPercent,
            category
        })
        try{
            await product.save()
            count ++;
        }catch(error) {

        }
    }
    res.status(200).json({ count })
}

exports.updateDiscountPercentByCategory = (req, res) => {
    const { categoryId, discountPercent } = req.body
    Product.updateMany({ category: categoryId }, { $set: { discountPercent } }
    ).exec((error, result) => {
        if (error) return res.status(400).json({ error })
        res.status(202).json({ result })
    })
}

exports.updateQty = (req, res) => {
    const { productId, variantId, quantity } = req.body
    Product.findOne({ _id: productId })
        .exec((error, product) => {
            if (error) return res.status(400).json({ error })
            const foundVariant = product.variants.find(variant => variant._id == variantId)
            if (foundVariant) {
                foundVariant.quantity = quantity
                product.save((error, product) => {
                    if (error) return res.status(400).json({ error })
                    if (product) {
                        res.status(202).json({ product })
                    } else {
                        res.status(400).json({ error: "something went wrong" })
                    }
                })
            }
        })
}

exports.updateVariants = (req, res) => {
    const { productId, variants } = req.body
    Product.updateOne(
        { _id: productId },
        { variants })
        .exec(
            (error, result) => {
                if (error) return res.status(400).json({ error })
                res.status(202).json({ result })
            })
}


exports.getProductsByCategorySlug = (req, res) => {
    const { slug } = req.params
    if (slug === "all") {
        Product.find({ isDisabled: { $ne: true } })
            .populate({ path: "category", select: "_id name categoryImage" })
            .limit(100)
            .exec((error, products) => {
                if (error) return res.status(400).json({ error })
                if (products) {
                    res.status(200).json({ products: products, title: "Tất cả sản phẩm" })
                } else {
                    res.status(400).json({ error: "something went wrong" })
                }
            })
    }
    else if (slug) {
        Category.findOne({ slug, isDisabled: { $ne: true } }).exec((error, category) => {
            if (error) return res.status(400).json({ error })
            if (category) {
                const categoriesArr = [category]
                Category.find({ parentId: category._id })
                    .exec((error, categories) => {
                        if (error) {
                            return res.status(400).json({ error: "something went wrong" })
                        }
                        if (categories) {
                            categoriesArr.push(...categories)
                        }
                        Product.find({ category: { $in: categoriesArr } })
                            .populate({ path: "category", select: "_id name categoryImage" })
                            .limit(100)
                            .exec((error, products) => {
                                if (error) return res.status(400).json({ error })
                                if (products) {
                                    res.status(200).json({ products: products, title: category.name })
                                } else {
                                    res.status(400).json({ error: "something went wrong" })
                                }
                            })
                    })
            } else {
                res.status(400).json({ error: "something went wrong" })
            }
        })
    }
    else {
        return res.status(400).json({ error: "Params required" })
    }
}

exports.getProductById = (req, res) => {
    const { _id } = req.body
    if (_id) {
        Product.findOne({ _id, isDisabled: { $ne: true } })
            .populate({ path: "category", select: "_id name categoryImage" })
            .exec((error, product) => {
                if (error) return res.status(400).json({ error })
                if (product) {
                    res.status(200).json({ product })
                } else {
                    res.status(400).json({ error: "something went wrong" })
                }
            })
    } else {
        res.status(400).json({ error: "Params required" })
    }
}

exports.updateProduct = (req, res) => {
    let payload = { ...req.body }
    delete payload._id

    Product.findOneAndUpdate(
        { _id: req.body._id },
        payload, { new: true }).exec((error, product) => {
            if (error) return res.status(400).json({ error })
            if (product) {
                return res.status(202).json({ product })
            }
            res.status(400).json({ error: "Product does not exist" })
        })

}

exports.getProductDetailsBySlug = (req, res) => {
    const { slug } = req.params
    if (slug) {
        Product.findOne({ slug, isDisabled: { $ne: true } })
            .populate({ path: "category", select: "_id name categoryImage" })
            .populate('reviews')
            .populate({
                path: 'reviews', populate: {
                    path: "user", select: "_id name profilePicture"
                }
            })
            .exec((error, product) => {
                if (error) return res.status(400).json({ error })
                if (product) {
                    res.status(200).json({ product })
                } else {
                    res.status(400).json({ error: "something went wrong" })
                }
            })
    } else {
        res.status(400).json({ error: "Params required" })
    }
}


exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload
    if (productId) {
        Product.updateOne({ _id: productId }, { isDisabled: true })
            .exec((error, result) => {
                if (error) return res.status(400).json({ error })
                if (result) {
                    res.status(202).json({ result })
                } else {
                    res.status(400).json({ error: "something went wrong" })
                }
            })
    } else {
        return res.status(400).json({ error: "Params required" })
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDisabled: { $ne: true } })
            .populate({ path: "category", select: "_id name categoryImage" })
            .populate({
                path: 'reviews', populate: {
                    path: "user", select: "_id name profilePicture"
                }
            }).limit(100)
            .exec()

        if (products) {
            res.status(200).json({ products })
        } else {
            res.status(400).json({ error: "something went wrong" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.searchByProductName = async (req, res) => {
    const { text } = req.body
    const products = await Product.find({ $text: { $search: text }, isDisabled: { $ne: true } })
        .populate({ path: "category", select: "_id name categoryImage" })
        .exec()
    res.status(200).json({ products, title: `Kết quả tìm kiếm: ${text}` })
}

exports.addProductReview = (req, res) => {
    const { rating, comment, productId } = req.body
    Product.findOneAndUpdate({ _id: productId, "reviews.user": { $ne: req.user._id } },
        {
            $push: {
                "reviews": [
                    { rating, comment, user: req.user._id },
                ],

            },
        }
    ).exec((error, result) => {
        if (error) return res.status(400).json({ error })
        if (result) {
            res.status(202).json({ message: "update successfully" })
        } else {
            res.status(400).json({ error: "something went wrong" })
        }
    })
}

exports.getListProductByIds = (req, res) => {
    const { ids } = req.body
    Product.find({
        '_id': { $in: ids }
    }).exec((error, products) => {
        if (error) return res.status(400).json({ error })
        if (products) {
            res.status(200).json({ products })
        } else {
            res.status(400).json({ error: "Not found !" })
        }
    })
}