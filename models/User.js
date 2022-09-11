const mongoose = require('mongoose');
const uuidv1 = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlenght:32,
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    hashedPassword:{
        type:String,
        required: true,
    },
    about:{
        type:String,
        trim:true,
    },
    role:{
        type:String,
        dafult:0,
    },
    history:{
        type:String,
        dafult:[],
    },
    salt: String
}, {timestamps: true});

userSchema.virtual('password')
.set(function(password){
    this._password = password,
    this.salt = uuidv1.v1(),
    this.hashedPassword = this.encryptPassword(password)
})

userSchema.method = {
    encryptPassword: function (password){
        if(!password) return '';

        try{
            return crypto.createHmac("sha1", this.salt).update(password).digest('hex');
        }catch(err){
            return '';
        }
    }
}

