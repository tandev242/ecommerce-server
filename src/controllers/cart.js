const { Cart } = require("../models")

exports.addToCart = (req, res) => {
    const { cartItem } = req.body;
    if (cartItem) {
        Cart.findOne({ user: req.user._id }).exec((error, cart) => {
            if (error) return res.status(400).json({ error })
            if (cart) {
                const product = cartItem.product;
                const size = cartItem.size;
                const item = cart.cartItems.find(c => c.product == product && c.size == size);
                let condition, update;
                if (item) {
                    condition = { user: req.user._id, "cartItems.product": product, "cartItems.size": size };
                    update = {
                        $set: {
                            "cartItems.$": cartItem
                        }
                    }
                } else {
                    condition = { user: req.user._id };
                    update = {
                        $push: {
                            cartItems: cartItem
                        }
                    }
                }
                Cart.findOneAndUpdate(condition, updateData, { upsert: true })
                    .exec((error, cart) => {
                        if (error) return res.status(400).json({ error })
                        if (cart) {
                            res.status(201).json({ message: "add to cart successfully" });
                        }
                    })
            } else {
                const cart = new Cart({
                    user: req.user._id,
                    cartItems: [cartItem]
                });
                cart.save((error, cart) => {
                    if (error) return res.status(400).json({ error });
                    if (cart) {
                        res.status(201).json({ message: "add to cart successfully" });
                    }
                })
            }
        })
    } else {
        return res.status(400).json({ error: "CartItem is not allowed to be null" });
    }
}

exports.getCartItems = (req, res) => {
    Cart.findOne({ user: req.user._id })
        .populate("cartItems.product", "_id name slug price discountPercent productPictures")
        .populate("cartItems.size", "_id size")
        .exec((error, cart) => {
            if (error) return res.status(400).json({ error })
            if (cart) {
                let cartItems = [];
                cart.cartItems.forEach((item) => {
                    cartItems.push({
                        product: item.product,
                        size: item.size,
                        quantity: item.quantity
                    })
                })
                return res.status(200).json({ cartItems });
            }
            res.status(400).json({ error: "Something went wrong" });
        })
}

exports.removeCartItem = (req, res) => {
    const { cartItem } = req.body;
    if (cartItem) {
        Cart.updateOne({ user: req.user._id },
            {
                $pull: {
                    cartItems: {
                        product: cartItem.product,
                        size: cartItem.size
                    }
                }
            }).exec((error, result) => {
                if (error) return res.status(400).json({ error });
                if (result) {
                    return res.status(202).json({ result });
                }
                return res.status(400).json({ error: "something went wrong" });
            })
    } else {
        res.status(400).json({ error: "Item  is not allowed to be null" });
    }
}