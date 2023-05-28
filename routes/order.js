const express = require('express');
const router = express.Router();

//get the controler
const authController = require('../controllers/auth.js');
const userController = require('../controllers/user.js');
const prodcutController = require('../controllers/product.js');
const orderController = require('../controllers/order')

//create a new order
router.route('/order/create/:userId').post(
    authController.requireSignIn,
    authController.isAuth,
    userController.addOrderToHistory,
    prodcutController.decreaseQnt,
    orderController.postCreateOrder
)

// get all order list for admin
router.route('/order/list/:userId').get(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    orderController.listOrder
)


//update order status
router.route('/order/:orderId/status/:userId').put(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    orderController.updateOrderStatus
)


//get order status
router.route('/order/status-values/:userId').get(
    authController.requireSignIn,
    authController.isAuth,
    authController.isAdmin,
    orderController.getStatusValues
)


//find user by id
router.param('userId', userController.userById)

//find order by id
router.param('orderId', orderController.orderById)



module.exports = router;    