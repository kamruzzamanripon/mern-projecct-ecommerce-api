//external import
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const expressValidator = require('express-validator')

require('dotenv').config();

const app = express();

//all routing file import
const authRouter = require('./routes/auth.js')
const userRouter = require('./routes/user.js')
const categoryRouter = require('./routes/category.js')
const productRouter = require('./routes/product')
const brainTreeRouter = require('./routes/braintree')
const orderRouter = require('./routes/order')

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(expressValidator());
app.use(cookieParser())



//connect to db
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected To DB");
})

//routing

app.use('/api', authRouter);
app.use('/api', userRouter)
app.use('/api', categoryRouter)
app.use('/api', productRouter)
app.use('/api', brainTreeRouter)
app.use('/api', orderRouter)

//run the app
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server is Runing on PORT: " + port);
})