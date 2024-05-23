const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();
 
const port = process.env.PORT || 3000;


(async function connectdb () {
    try{
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DBURL);
        console.log("connected successfully!!!"); 
    }
    catch(e){
        console.log("DBerror: ",e.message);
    }
})();

app.get('/', (req,res) => {
    res.send( 'genres');
})
 

app.use(express.json());

const UserRouter = require('./route/consumer_route')
app.use('/consumer',UserRouter)

 

app.listen(port , () => { console.log(`port running on http://localhost:${port}`)})

module.exports = app