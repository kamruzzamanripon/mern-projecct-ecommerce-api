const express = require('express');
const router =  express.Router();

//get the controler
const authController = require('../controllers/auth.js');


//validator
const userValidator = require('../validator/userValidator.js')

// user sign up routing
router.route("/signup")
    .post(userValidator.userSignupValidator, authController.signUp)

// user sign in routing
router.route("/signin")
    .post( authController.signIn)   

// user sign in routing
router.route("/signout")
    .post( authController.signOut)       


module.exports = router;    