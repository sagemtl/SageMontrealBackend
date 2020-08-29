const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const MongoClient = require('mongodb').MongoClient;
require("dotenv/config");
const fs = require('fs');
const nodemailer = require('nodemailer');

const stripe = require("stripe")(process.env.SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET_KEY;

// App Initialization
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database configuration
const uri =  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@sage.864ng.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200
}

app.post("/payment_intent", cors(corsOptions), async (req, res) => {
  const { price, receipt_email, shipping} = req.body;

  try {
    const order = await stripe.orders.create({
      currency: 'cad',
      items: [
        {type: 'sku', parent: 'sku_HufUprUXMS6JX6'},
      ],
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '1234 Main Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
          postal_code: '94111',
        },
      },
    });

    /*
    const charges = await stripe.charges.create(
      {
        amount: price,
        currency: 'cad',
        source: 'tok_visa',
        description: 'My First Test Charge (created for API docs)',
        order: order.id
      },
      function(err, charge) {
        // asynchronously called
      }
    );
    */

    const intent = await stripe.paymentIntents.create({
      amount: price,
      currency: "CAD",
      description: `Purchased Item`,
      receipt_email: receipt_email,
      metadata: {
        order_id: order.id,
      },
      shipping: shipping
    });

    res.status(200).json({ client_secret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

 // Callback when the shipping address is updated.
app.post("/calculateShipping", cors(corsOptions), async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    if (shippingAddress.country === 'CA') {
      res.status(200).json({ supportedShippingOptions: [
        {
          id: 'free-shipping',
          label: 'Mail',
          detail: 'Arrives in 4 to 10 business days',
          amount: 0,
        },
        {
          id: 'expedited-shipping',
          label: 'Expedited Parcel',
          detail: 'Arrives in 2 to 4 business days',
          amount: 500,
        },
      ]});
    }
    else if (shippingAddress.country === 'US') {
      res.status(200).json({ supportedShippingOptions: [
        {
          id: 'expedited-shipping-us',
          label: '"Expedited Parcel',
          detail: 'Arrives in 5 to 10 business days',
          amount: 1500,
        },
      ]});
    }
    else {
      res.status(200).json({ supportedShippingOptions: [
        {
          id: 'small-packet-shipping',
          label: 'Small Packet - Air',
          detail: 'Arrives in 6 to 12 business days',
          amount: 2000,
        },
      ]});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post('/webhook', cors(corsOptions), function(request, response) {
  const sig = request.headers['stripe-signature'];
  const body = request.body;

  let event = null;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    // invalid signature
    response.status(400).end();
    return;
  }

  let intent = null;
  switch (event['type']) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log("Succeeded:", intent.id);
      fs.appendFile('log.txt', JSON.stringify(intent), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      break;
    case 'payment_intent.payment_failed':
      intent = event.data.object;
      const message = intent.last_payment_error && intent.last_payment_error.message;
      console.log('Failed:', intent.id, message);
      break;
  }

  response.sendStatus(200);
});

// get stripe product
app.get("/product/:prod_id", cors(corsOptions), async (req, res) =>{
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
app.post("/product/:prod_id", cors(corsOptions), async (req, res) =>{
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
app.post("/create/product", cors(corsOptions), async (req, res) =>{
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
app.post("/create/sku", cors(corsOptions), async (req, res) =>{
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
app.get("/sku/:sku_id", cors(corsOptions), async (req, res) =>{
  try{
    const sku = await stripe.skus.retrieve(req.params.sku_id);
    res.status(200).json(sku);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

// get sku inventory
// app.get("/inventory/:sku_id", cors(corsOptions), async (req, res) =>{
//   try{
//     const sku = await stripe.skus.retrieve(req.params.sku_id);
//     var inventory = new Object;
//     inventory.sku_id = sku.id;
//     inventory.quantity = sku.inventory? (sku.inventory.quantity? sku.inventory.quantity : 0) : 0;
//     res.status(200).json(inventory);
//   }
//   catch(err){
//     console.error(err);
//     res.status(err.statusCode).send(err);
//   }

// });
app.get("/inventory/:sku_info", cors(corsOptions), async (req, res) =>{
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


// set inventory for skus
// app.post("/inventory/:sku_id", cors(corsOptions), async (req, res) =>{
//   try{
//     var inventory_info = new Object;
//     inventory_info.type = "finite";
//     inventory_info.quantity = req.body.quantity;

//     const product = await stripe.skus.update(
//       req.params.sku_id,
//       { inventory: inventory_info }
//     );
//     res.status(200).json(product);
//   }
//   catch(err){
//     console.error(err);
//     res.status(err.statusCode).send(err);
//   }
// });
app.post("/inventory/:sku_info", cors(corsOptions), async (req, res) =>{
  try{

    const info = req.params.sku_info.split("-");
    const query = { item: info[0], color: info[1], size: info[2] };

    const db = client.db(process.env.MONGODB_DBNAME);
    const queryResult = await db.collection('inventory').findOneAndUpdate(query, { $inc : { "qty" : req.body.quantity } });

    res.status(200);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});


let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  var content = `name: ${name} \n email: ${email} \n subject: ${subject} \n message: ${message}`;

  const mail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: subject,
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send({ message: 'Contact email sent successfully', data });
    }
  })
})

// PORT, Listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));
