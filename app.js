const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

//All routing file import
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const brainTreeRouter = require('./routes/braintree');

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors()); 
app.use(expressValidator());
app.use(cookieParser());


//connect to db
mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("Connect to DB");
})


//routing
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);
app.use('/api', brainTreeRouter);

//run the app
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log("Server is Running on PORT:" + port);
})
