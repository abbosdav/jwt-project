const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const authMiddleware = require('./middlewares/auth-middleware')
require("dotenv").config()

const app = express();
const PORT = process.env.PORT || 5000; 
const URL = process.env.DB_URL

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', router);
app.use(errorMiddleware)
app.use(authMiddleware)


const start = async() =>{
    try{
        await mongoose.connect(URL).then(function(){
            console.log('MongoDB ga ulanish hosil qilindi...')
        })

        app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
    }catch(e){
        console.log(e)
    }
} 
start();