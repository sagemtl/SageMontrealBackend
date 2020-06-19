const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
require("dotenv/config");
const fs = require('fs');

const stripe = require("stripe")(process.env.SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET_KEY;

// App Initialization
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.post("/payment_intent", async (req, res) => {
  const { price, receipt_email } = req.body;

  try {
    const intent = await stripe.paymentIntents.create({
      amount: price,
      currency: "CAD",
      description: `Purchased Item`,
      receipt_email: receipt_email,
    });

    console.log(intent.client_secret);
    res.status(200).json({ client_secret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post('/webhook', function(request, response) {
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

app.get("/product/:prod_id", async (req, res) =>{
  try{
    const product = await stripe.products.retrieve(req.params.prod_id);
    res.status(200).json(product);
  }
  catch(err){
    console.error(err);
    res.status(err.statusCode).send(err);
  }

});

app.post("/product/:prod_id", async (req, res) =>{
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



// PORT, Listen
const port = 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));
