const express = require("express");
const router = express.Router();

//get the controler
const authController = require("../controllers/auth.js");
const userController = require("../controllers/user.js");
const braintreeController = require('../controllers/braintree')


router.get('/brainterr/gettoken/:userId', authController.requireSignIn, authController.isAuth, braintreeController.generateToken)

router.post('/brainterr/payment/:userId', authController.requireSignIn, authController.isAuth, braintreeController.postProcessPayment)

//find user by id
router.param("userId", userController.userById);

module.exports = router;
