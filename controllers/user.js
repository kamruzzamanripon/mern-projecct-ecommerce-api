const User = require("../models/User");
const { Order } = require('../models/order')


//internal import
const { errorHandler } = require("../helper/dbErrorHandel.js");

//find user by id
exports.userById = (req, res, next, id) => {

    User.findById(id)
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not Found"
                })
            }

            req.profile = user;
            next();
        })
}

// add order to history
exports.addOrderToHistory = (req, res, next) => {
    let history = [];
    req.body.order.products.forEach((item) => {
        history.push({
            id: item._id,
            name: item.name,
            description: item.description,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })

    User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true }, (err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Can't Update the User History"
            })
        } else {
            next();
        }
    })
}

//get user order history
exports.orderHistory = (req, res, next) => {
    Order.find({ user: req.profile._id }).populate("user", "_id name").sort("-created").exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        } else {
            return res.json(result)
        }
    })
}

//read user info
exports.getUser = (req, res, next) => {
    req.profile.hashedPassword = undefined;
    return res.json(req.profile);
}

//update user
exports.putUpdateUser = (req, res, next) => {
    User.findOneAndUpdate({
        _id: req.profile._id,
    }, {
        $set: req.body
    }, {
        new: true
    }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        user.hashedPassword = undefined;
        return res.json(user)
    })
}