const mongoose = require('mongoose');
const cryto = require('crypto')
const uuidv1 = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        trim: true,
    },
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        defult: [],
    },
    salt: String,

}, { timestamps: true })


userSchema.virtual('password')
    .set(function (password) {
        this._password = password,
            this.salt = uuidv1.v1(),
            this.hashedPassword = this.encryptPassword(password)
    })



userSchema.methods = {

    authenticate: function (text) {
        return this.encryptPassword(text) === this.hashedPassword;
    },
    encryptPassword: function (password) {
        if (!password) return '';

        try {

            return cryto.createHmac("sha1", this.salt).update(password).digest('hex');

        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema)
