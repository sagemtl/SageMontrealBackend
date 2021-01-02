const express = require("express");
const router = express.Router();
const cors = require("cors");
const uuid = require("uuid");
const MongoClient = require('mongodb').MongoClient;
require("dotenv/config");
const fs = require('fs');

const stripe = require("stripe")(process.env.SECRET_KEY);

// Database configuration
const uri =  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@sage.864ng.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200
}

// get all songs
router.get("/songs", cors(corsOptions), async (req, res) =>{
  try{

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('ktv-songs').find().toArray();

    if(queryResult === `undefined`) throw "query unsuccesful";

    console.log(queryResult);
    res.status(200).json(queryResult);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

module.exports = router;