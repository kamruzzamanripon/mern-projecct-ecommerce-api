const { errorHandler } = require("../helper/dbErrorHandel");
const { Order } = require("../models/Order");

//Find Order by id
exports.orderById = (req, res, next, id)=>{
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, result)=>{
            if(err || !result){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            req.ordeer = result;
            next()
        })
}


//Create new Order
exports.postCreateOrder = (req, res, next) =>{
    req.body.order.user = req.profile;

    const ordeer = new Order(req.body.order);

    order.save((err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json(result)
        }
    })
}

//Get all Order List for admin
exports.listOrder = (req, res, next)=>{
    Order.find().populate('user', '_id name address').sort('-created').exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json(order)
        }
    })
}

//Update Order Status
exports.updateOrderStatus = (req, res, next)=>{
    Order.updateOne({_id: req.body.orderId}, {$set: {status: req.body.status}}, (err, order)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            return res.json(order)
        }
    })
}

//Get Order Status value
exports.getStatusValues = (req, res, next)=>{
    return res.json(Order.schema.path('status').enumValues)
}