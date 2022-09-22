const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');


//user sing up routing
router.route('/user/:userId')
    .get(authController.requireSignIn, authController.isAuth, userController.getUser)
    .put(authController.requireSignIn, authController.isAuth, userController.putUpdateUser)
    
//get user order List
router.route('/orders/by/user/:userId')
    .get(authController.requireSignIn, authController.isAuth, userController.orderHistory)


//find user by id
router.param('userId', userController.userById)        



module.exports = router;    