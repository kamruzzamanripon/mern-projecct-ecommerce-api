const { Order } = require('../models/order')

//internal import
const { errorHandler } = require("../helper/dbErrorHandel.js");


//find order by id
exports.orderById = (req, res, next, id) => {

    Order.findById(id)
        .populate('products.product', "name price")
        .exec((err, result) => {
            if (err || !result) {
                return res.status(400).json({
                    error: errorHandler(err),
                })
            }
            req.order = result;
            next();
        })
}


//create new order 
exports.postCreateOrder = (req, res, next) => {
    req.body.order.user = req.profile;

    const order = new Order(req.body.order);
    order.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        } else {
            return res.json(result)
        }
    })
}

// get all order list for admin
exports.listOrder = (req, res, next) => {
    Order.find().populate('user', "_id name address").sort('-created').exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        } else {
            return res.json(order)
        }
    })
}

//update order status
exports.updateOrderStatus = (req, res, next) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        } else {
            return res.json(order)
        }
    })
}

//get  order status value
exports.getStatusValues = (req, res, next) => {
    return res.json(Order.schema.path('status').enumValues);
}
