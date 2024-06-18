const mongoose = require('mongoose');
const express = require('express');
const app = express();
const  ErrorHandler = require('./middleware/errorHandler')
const logger = require('./logger')
const cors = require('cors');
require('dotenv').config();
 
 
const port = process.env.PORT || 3000;


(async function connectdb () {
    try{
        logger.info("Connecting to MongoDB...");
        await mongoose.connect(process.env.DBURL, { autoIndex: false });
        logger.info("connected successfully!!!"); 
    }
    catch(e){
        console.log(e.message)
        logger.error(`DBerror: ${e.message}`);
    }
})();

app.get('/', (req,res) => {
    res.send( 'genres');
})
 
const corsOptions = {
    origin: 'https://editor.swagger.io', // Allow requests from this origin
    //credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Use the CORS middleware with the defined options
app.use(cors(corsOptions));



app.use(express.json());

const UserRouter = require('./route/consumer_route')
app.use('/consumers',UserRouter)

app.use(ErrorHandler)

 

app.listen(port , () => { logger.info(`port running on http://localhost:${port}`)})

module.exports = app