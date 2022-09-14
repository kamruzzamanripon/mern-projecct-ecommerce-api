const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const categoryController = require('../controllers/category');

//Create 
router.route('/category/create/:userId')
    .post(authController.requireSignIn, authController.isAuth, authController.isAdmin, categoryController.create)

// Update and delete    
router.route('/category/:categoryId/:userId')
    .put(authController.requireSignIn, authController.isAuth, authController.isAdmin, categoryController.update)
    .delete(authController.requireSignIn, authController.isAuth, authController.isAdmin, categoryController.delete)

//get single category
router.route('/category/:categoryId')
    .get(categoryController.read)    

//get All category
router.route('/categories')
    .get(categoryController.readAll)      


//find user by id
router.param('userId', userController.userById)  
//find Catetgory by id
router.param('categoryId', categoryController.categoryById)        



module.exports = router;    