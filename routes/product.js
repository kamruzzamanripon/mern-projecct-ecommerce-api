const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const productController = require('../controllers/product');

//product create
router.route('/product/create/:userId')
    .post(authController.requireSignIn, authController.isAuth, authController.isAdmin, productController.create)  

//product update and delete    
router.route('/product/:productId/:userId')   
    .put(authController.requireSignIn, authController.isAuth, authController.isAdmin, productController.update) 
    .delete(authController.requireSignIn, authController.isAuth, authController.isAdmin, productController.delete) 

//read single product info
router.route("/product/:productId")
    .get(productController.read) 
    
//Read all Product
router.route("/products")
    .get(productController.readAll)    

//get Product Photo
router.route("/product/photo/:productId")
    .get(productController.getPhoto)       

//get Product Categories
router.route("/product/categories")
    .get(productController.getCategories)   
    
//Show related Product
router.route("/products/related/:productId")
    .get(productController.getRelatedProducts)     

    

//find user by id
router.param('userId', userController.userById)  
//find product by id
router.param('productId', productController.productById)
    



module.exports = router;    