const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000,
    },
    price: {
        type: Number,
        require: true,
    },
    category: {
        type: ObjectId,
        ref: "Category",
        require: true,
    },
    quantity: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contetType: String
    },
    shipping: {
        type: Boolean,
        require: false,
    }
  
}, { timestamps: true })




module.exports = mongoose.model("Product", productSchema)
