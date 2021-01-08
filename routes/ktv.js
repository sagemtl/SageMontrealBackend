const express = require("express");
const router = express.Router();
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
require("dotenv/config");

// Database configuration
const uri =  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@sage.864ng.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200
}

// get all songs in ktv-songs
router.get("/songs", cors(corsOptions), async (req, res) =>{
  try{

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('ktv-songs').find().toArray();

    if(queryResult === `undefined`) throw "query unsuccesful";

    
    res.status(200).json(queryResult);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

// get one song info from ktv-songs
router.get("/song-info/:title_id", cors(corsOptions), async (req, res) =>{
  try{

    const title_id = req.params.title_id;
    const query = { title_id: title_id };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('ktv-songs').findOne(query);

    if(queryResult === `undefined`) throw "query unsuccesful";

    res.status(200).json(queryResult);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// get one lyrics from ktv-song-lyrics
router.get("/lyrics/:title_id", cors(corsOptions), async (req, res) =>{
  try{

    const title_id = req.params.title_id;
    const query = { title_id: title_id };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('ktv-song-lyrics').findOne(query);

    if(queryResult === `undefined`) throw "query unsuccesful";

    res.status(200).json(queryResult);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// get score based on original song audio data
router.post("/score/:title_id", cors(corsOptions), async (req, res) =>{
  try{
    const title_id = req.params.title_id;
    console.log(title_id);
    const audioData = JSON.parse(req.body.audioData);
    console.log(audioData);
    res.status(200).json(84);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
})

module.exports = router;