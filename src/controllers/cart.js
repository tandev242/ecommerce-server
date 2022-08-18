const { Cart } = require("../models")

exports.addToCart = (req, res) => {
    const { cartItem } = req.body;
    if (cartItem) {
        Cart.findOne({ user: req.user._id }).exec((error, cart) => {
            if (error) return res.status(400).json({ error })
            if (cart) {
                const product = cartItem.product;
                const variant = cartItem.variant;
                const item = cart.cartItems.find(c => c.product == product && c.variant == variant);
                let condition, update;
                if (item) {
                    condition = { user: req.user._id, "cartItems.product": product, "cartItems.variant": variant };
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
                Cart.findOneAndUpdate(condition, update,
                    { new: true, upsert: true })
                    .exec((error, cart) => {
                        if (error) return res.status(400).json({ error })
                        if (cart) {
                            res.status(201).json({ cart });
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
                        res.status(201).json({ cart });
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
        .populate("cartItems.product")
        .exec((error, cart) => {
            if (error) return res.status(400).json({ error })
            if (cart) {
                return res.status(200).json({ cart });
            }
            res.status(400).json({ error: "Something went wrong" });
        })
}

exports.removeCartItem = (req, res) => {
    const { cartItem } = req.body;
    if (cartItem) {
        Cart.findOneAndUpdate({ user: req.user._id },
            {
                $pull: {
                    cartItems: {
                        product: cartItem.product,
                        variant: cartItem.variant
                    }
                }
            }).exec((error, cart) => {
                if (error) return res.status(400).json({ error });
                if (cart) {
                    return res.status(202).json({ message: "remove cartItem successfully"});
                }
                return res.status(400).json({ error: "something went wrong" });
            })
    } else {
        res.status(400).json({ error: "Item  is not allowed to be null" });
    }
}