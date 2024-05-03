const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = process.env.port || 3000;




(async function connectdb () {
    try{
        await mongoose.connect('mongodb://localhost:27017/Blogapp');
        console.log("connected successfully!!!");
    }
    catch(e){
        console.log("error: ",e.message);
    }
})();

app.get('/', (req,res) => {
    res.send( 'genres');
})
 
// parsing request body
app.use(express.json());

const UserRouter = require('./routes/userroute')
app.use('/',UserRouter)

const PostRouter = require('./routes/postroute')
app.use('/',PostRouter)

app.listen(port , () => { console.log(`port running on http://localhost:${port}`)})

module.exports = app