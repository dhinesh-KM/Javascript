const express = require('express');
const app = express();
const Joi = require('joi');
const port = process.env.port || 3000;
app.use(express.json())

const genres = [
    { 'id':1, 'genre':'comedy'},
    { 'id':2, 'genre':'action'},
    { 'id':3, 'genre':'thriller'}
]


app.get('/api/genres', (req,res) => {
    res.send( genres);
})

app.post('/api/genres', (req,res) => {
    const genre = {
        id: genres.length +1,
        genre: req.body.genre
    };
    const {error} = validategenre(req.body)
    if (error) { res.status(400).json({"error": true, 'msg': error.details[0].message}) }
    else { 
        genres.push(genre); 
        res.json({"error": false, 'msg': 'genre added successfully', 'data': genre }) }
})

app.get('/api/genre/:id', (req,res) => {
    const genre = genrefind(genres,req.params.id);
    if(!genre) res.status(404).send({"error": true, 'msg':'genre with the given id not found'});
    res.send(genre);
})

app.put('/api/genre/:id', (req,res) => {
    const genre = genrefind(genres,req.params.id);
    if(!genre) res.status(404).send({"error": true, 'msg':'genre with the given id not found'});
    genre.genre = req.body.genre;
    res.json({"error": false, 'msg': 'genre updated successfully', 'data': genre });
})

app.delete('/api/genre/:id', (req,res) => {
    const genre = genrefind(genres,req.params.id);
    if(!genre) res.status(404).send({"error": true, 'msg':'genre with the given id not found'});
    genres.splice(genre.id,1)
    res.json({"error": true, 'msg': 'genre deleted successfully'});
})

app.listen(port , () => { console.log(`port running on http://localhost:${port}`)})

function validategenre(genre){
    const schema = Joi.object({
        genre: Joi.string().min(3).max(30).required(),
    }).unknown(true);
    return schema.validate(genre);
}

function genrefind(genres,id){
    return genres.find(c => c.id === parseInt(id));
}