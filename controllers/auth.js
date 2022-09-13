const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

//internal import
const {errorHandler} = require('../helper/dbErrorHandel.js');

//require sign in
exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: ["auth"]
})

//check if the user is authenticate
exports.isAuth = (req, res, next)=>{
    let user = req.profile && req.auth && req.profile._id == req.auth.id;
    if(!user){
        return res.status(403).json({
            error: 'Access Denied',
        })
    }

    next();
}

//check if the user is Admin
exports.isAdmin = (req, res, next)=>{
    if(req.profile.role == 0){
        return res.status(403).json({
            error: "Admin Resource! Access Denied"
        })
    }

    next();
}

//create new User
exports.signUp = (req, res, next)=>{
    
    let user = new User(req.body);

    user.save((err, result)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }else{
            user.salt = undefined;
            user.hashedPassword = undefined;

            return res.json(user)
        }
    })
}

//login User
exports.singIn = (req, res, next)=>{
    const {email, password}  = req.body;

    User.findOne({email}, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "Email is not Registered! Please try Again"
            })
        }

        //user validation
        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email & Password don't match! Please try Again"
            })
        }

        //get new token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.cookie("t", token, {expire: new Date() + 9999});

        const {_id, name, email, role} = user;

        return res.status(200).json({
            token,
            user:{
                _id,
                name,
                email,
                role
            }
        })
    })
}