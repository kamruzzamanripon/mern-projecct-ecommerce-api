const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlenght:32
    },
    description:{
        type: String,
        trim: true,
        required: true,
        maxlenght:2000
    },
    price:{
        type: String,
        required: true,
    },
    category:{
        type: ObjectId,
        ref: "Category",
        required: true
    },
    quantity:{
        type: Number
    },
    sold:{
        type: Number,
        default:0
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    shipping:{
        type: Boolean,
        required: false
    }
    
}, {timestamps: true});



module.exports = mongoose.model("Product", productSchema);
