const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');

//create new User
exports.signUp = (req, res, next)=>{
    
    let user = new User(req.body);

    user.save((err, result)=>{
        if(err){
            return err;
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