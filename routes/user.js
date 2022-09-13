const express = require('express');
const router = express.Router();

//get the controller
const authController = require('../controllers/auth');
const userController = require('../controllers/user');


//user sing up routing
router.route('/user/:userId')
    .get(authController.requireSignIn, authController.isAuth,authController.isAdmin, (req, res, next) =>{
        return res.json({
            user: req.profile
        })
    })


//find user by id
router.param('userId', userController.userById)        



module.exports = router;    