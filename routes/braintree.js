const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const brainTreeController = require('../controllers/braintree');


router.get('/braintree/gettoken/:userId',authController.requireSignIn, authController.isAuth, brainTreeController.generateToken)
router.get('/braintree/payment/:userId',authController.requireSignIn, authController.isAuth, brainTreeController.postProcessPayment)

 
 


//find user by id
router.param('userId', userController.userById)  



module.exports = router;    