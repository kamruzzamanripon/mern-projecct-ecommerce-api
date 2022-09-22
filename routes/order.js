const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const productController = require('../controllers/product');
const orderController = require('../controllers/order');


//user sing up routing
router.route('/order/create/:userId').post(
    authController.requireSignIn,
    authController.isAuth,
    userController.addOrderToHistory,
    productController.decreaseQnt,
    orderController.postCreateOrder
)

//Get all order List for admin
router.route('/order/list/:userId').get(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    orderController.listOrder
)

//update order Status
router.route('/order/:orderId/status/:userId').put(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    orderController.updateOrderStatus
)

//Get Order Status
router.route('/order/status-values/:userId').get(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    orderController.getStatusValues
)
//find user by id
router.param('userId', userController.userById)   

//find Order by id
router.param('orderId', orderController.orderById)



module.exports = router;    