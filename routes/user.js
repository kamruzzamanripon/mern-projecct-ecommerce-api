const express = require('express');
const router = express.Router();

//get the controler
const authController = require('../controllers/auth.js');
const userController = require('../controllers/user.js');



// user sign up routing
router.route("/user/:userId")
    .get(authController.requireSignIn, authController.isAuth, userController.getUser)
    .put(authController.requireSignIn, authController.isAuth, userController.putUpdateUser)


// get user order list
router.route("/orders/by/user/:userId")
    .get(authController.requireSignIn, authController.isAuth, userController.orderHistory)



//find user by id
router.param('userId', userController.userById)



module.exports = router;    