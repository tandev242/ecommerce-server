const { Order, DeliveryInfo, Cart } = require("../models")

exports.addOrder = (req, res) => {
    const { items, address, totalAmount, paymentStatus, paymentType } = req.body;
    const orderStatus = [
        {
            type: 'ordered',
            date: new Date(),
            isCompleted: true,
        },
        {
            type: 'packed',
            isCompleted: false,
        },
        {
            type: 'shipped',
            isCompleted: false,
        },
        {
            type: 'delivered',
            isCompleted: false,
        },
    ]

    items.forEach((item) => {
        if (product) {
            Cart.updateOne(
                { user: req.user._id },
                {
                    $pull: {
                        cartItems: {
                            product: item.product,
                            size: item.size
                        },
                    },
                }
            ).exec((error, result) => {
                if (error)
                    return res.status(400).json({ error });
            });
        }
    })

    const order = new Order({
        user: req.user._id,
        address,
        totalAmount,
        items,
        paymentStatus,
        paymentType,
        orderStatus
    })
    order.save((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
            res.status(201).json({ order });
        }
    });
}

exports.getOrder = (req, res) => {
    const { orderId } = req.body;
    Order.findOne({ _id: orderId })
        .populate("items.product", "_id name slug price discountPercent productPictures")
        .populate("items.variant")
        .lean()
        .exec((error, order) => {
            if (error) return res.status(400).json({ error });
            if (order) {
                DeliveryInfo.findOne({ user: req.user._id })
                    .exec((error, dI) => {
                        if (error) return res.status(400).json({ error });
                        order.address = dI.address.find(address => address._id == order.address);
                        res.status(200).json({ order });
                    })
            }
        })
}

exports.updateStatus = (req, res) => {
    const { orderId, type } = req.body;
    if (req.user.role === 'admin') {
        Order.findOneAndUpdate({ _id: orderId, "orderStatus.type": type },
            {
                $set: {
                    "orderStatus.$": [
                        { type, date: new Date(), isCompleted: true },
                    ],

                },
            }
        ).exec((error, order) => {
            if (error) return res.status(400).json({ error });
            if (order) {
                res.status(202).json({ order });
            } else {
                res.status(400).json({ error: "something went wrong" });
            }
        });
    } else {
        Order.findOneAndUpdate({ _id: orderId }, { paymentStatus: type })
            .exec((error, order) => {
                if (error) return res.status(400).json({ error });
                if (order) {
                    res.status(202).json({ order });
                } else {
                    res.status(400).json({ error: "something went wrong" });
                }
            });
    }
}


exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ paymentStatus: { "$ne": "cancelled" } })
            .populate("items.product", "_id name slug price discountPercent productPictures")
            .sort({ createdAt: -1 })
            .exec();
        res.status(200).json({ orders });
    } catch (error) {
        res.status(400).json({ error });
    }
};


exports.getOrdersByUser = (req, res) => {
    Order.find({ user: req.user._id })
        .populate("items.product", "_id name slug price discountPercent productPictures")
        .populate("items.variant")
        .sort({ createdAt: -1 })
        .exec((error, orders) => {
            if (error) return res.status(400).json({ error });
            if (orders) {
                return res.status(200).json({ orders });
            }
            res.status(400).json({ error: "something went wrong" });
        })
}
