const express = require("express");
const router = express.Router();
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const similarityScore = require('../helpers/similarityScore');
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

// get leaderboard for one song based on title_id
router.get("/leaderboard/:title_id", cors(corsOptions), async (req, res) => {
  try{

    const title_id = req.params.title_id;
    const query = { title_id: title_id };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('ktv-leaderboard').findOne(query);

    if(queryResult === `undefined`) throw "query unsuccesful";

    const scoresJson = queryResult.scores.map(entry => JSON.parse(entry))
    res.status(200).json(scoresJson);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// add to leaderboard for one song
router.post("/leaderboard/:title_id", cors(corsOptions), async (req, res) => {
  try{

    const title_id = req.params.title_id;
    const name=req.body.name;
    const score=req.body.score;
    const query = { title_id: title_id };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('ktv-leaderboard').findOne(query);

    if(queryResult === `undefined`) throw "query unsuccesful";
    let scoresJson = queryResult.scores.map(entry => JSON.parse(entry))

    scoresJson.push({name:name,score:score});
    const sortedLeadboard = scoresJson.sort((a, b) => (a.score > b.score) ? -1 : 1);
    const rank = sortedLeadboard.findIndex((entry)=>(entry.name==name && entry.score==score)) + 1;
    const leaderboardString = sortedLeadboard.map(entry => JSON.stringify(entry))
    const queryResult2 = await db.collection('ktv-leaderboard').findOneAndUpdate(query, { $set : { "scores" : leaderboardString } });

    res.status(200).json({rank:rank, total:sortedLeadboard.length});
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

router.post("/score/:title_id", cors(corsOptions), async (req, res) =>{
  try{
    const title_id = req.params.title_id;
    const query = { title_id: title_id };

    const db = client.db(process.env.MONGODB_DBNAME);

    const queryResult = await db.collection('ktv-original-data').findOne(query);

    const parsedData = JSON.parse(queryResult.audio_data);
    /* FOR POSTMAN LOCAL DATA */
    // const audioData = req.body.audio_data;
    
    const audioData = JSON.parse(req.body.audioData);
    const finalScore = similarityScore(audioData, parsedData);

    res.status(200).json(finalScore);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});


module.exports = router;