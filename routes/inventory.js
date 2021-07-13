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


// get stripe product
router.get("/product/:prod_id", cors(corsOptions), async (req, res) =>{
  try{
    const product = await stripe.products.retrieve(req.params.prod_id);
    res.status(200).json(product);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

// update stripe product
router.post("/product/:prod_id", cors(corsOptions), async (req, res) =>{
  try{
    const product = await stripe.products.update(
      req.params.prod_id,
      req.body
      );
    res.status(200).json(product);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

// create stripe product
router.post("/create/product", cors(corsOptions), async (req, res) =>{
  try{
    const product = await stripe.products.create(
      req.body
      );
    res.status(200).json(product);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

// create stripe sku
router.post("/create/sku", cors(corsOptions), async (req, res) =>{
  try{
    const product = await stripe.skus.create(
      req.body
    );
    res.status(200).json(product);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

// get sku
router.get("/sku/:sku_id", cors(corsOptions), async (req, res) =>{
  try{
    const sku = await stripe.skus.retrieve(req.params.sku_id);
    res.status(200).json(sku);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

router.get("/inventory/:sku_info", cors(corsOptions), async (req, res) =>{
  try{
    const info = req.params.sku_info.split("-");
    const query = { item: info[0], color: info[1], size: info[2] };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('inventory').findOne(query);

    if(queryResult === `undefined`) throw "query unsuccesful";
    var inventory = new Object;
    inventory.quantity = queryResult.qty;
    res.status(200).json(inventory);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

router.post("/inventory/:sku_info", cors(corsOptions), async (req, res) =>{
  try{

    const info = req.params.sku_info.split("-");
    const query = { item: info[0], color: info[1], size: info[2] };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('inventory').findOne(query);

    if(queryResult === `undefined`) throw "query unsuccesful";
    var qty = queryResult.qty;

    const queryResult2 = await db.collection('inventory').findOneAndUpdate(query, { $inc : { "qty" : -req.body.quantity } });
    res.status(200).json({});
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

module.exports = router;