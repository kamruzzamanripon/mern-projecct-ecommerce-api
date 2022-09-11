const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());


//connect to db
mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log("Connect to DB");
})


//routing

//run the app
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log("Server is Running on PORT:" + port);
})
