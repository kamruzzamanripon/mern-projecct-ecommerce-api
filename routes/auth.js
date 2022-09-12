const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');

//validator
const userValidator = require('../validator/userValidator')

//user sing up routing
router.route('/singup')
    .post(userValidator.userSignupValidator, authController.signUp)

//user sign in routing
router.route("/signin")
    .post(authController.singIn)    



module.exports = router;    