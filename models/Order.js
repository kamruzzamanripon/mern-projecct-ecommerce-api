const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema


const CartItemSchema = new mongoose.Schema({
    product:{
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    price:Number,
    count:Number
    
}, {timestamps: true});
const CartItem = mongoose.model("CartItemSchema", categorySchema);

const OrderSchema = new mongoose.Schema({
    product:[categorySchema],
    transaction_id: {},
    amount:{
        type: Number
    },
    address: String,
    status:{
        type: String,
        default: "Not Processed",
        enum:["Not Processed", "Processing", "shipped", "Delivered", "Cancelled"]
    },
    updated: Date,
    user:{
        type: ObjectId,
        ref: "User"
    }
    
}, {timestamps: true});
const Order = mongoose.model("CartItemSchema", OrderSchema);


module.exports = {CartItem, Order};
