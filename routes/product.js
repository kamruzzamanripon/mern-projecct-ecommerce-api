const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const productController = require('../controllers/product');

//product create
router.route('/product/create/:userId')
    .post(authController.requireSignIn, authController.isAuth, authController.isAdmin, productController.create)  
    
router.route('/product/:productId/:userId')   
    .put(authController.requireSignIn, authController.isAuth, authController.isAdmin, productController.update) 


//find user by id
router.param('userId', userController.userById)  

//find product by id
router.param('productId', productController.productById)
    



module.exports = router;    