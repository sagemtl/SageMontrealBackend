const express = require("express");
const router = express.Router();
const cors = require("cors");
const uuid = require("uuid");
require("dotenv/config");
const fs = require('fs');
const stripe = require("stripe")(process.env.SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET_KEY;



const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200
}

router.post("/payment_intent", cors(corsOptions), async (req, res) => {
  const { price, receipt_email, shipping, orderItems} = req.body;

  try {

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
      shipping: shipping
    });

    res.status(200).json({ client_secret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post("/create_order", cors(corsOptions), async (req, res) => {
  const { receipt_email, shipping, orderItems, metadata} = req.body;

  try {
    const order = await stripe.orders.create({
      currency: 'cad',
      email: receipt_email,
      items: orderItems,
      shipping: shipping,
      metadata: metadata,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

 // Callback when the shipping address is updated.
router.post("/calculateShipping", cors(corsOptions), async (req, res) => {
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
          amount: 2200,
        },
      ]});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post('/webhook', cors(corsOptions), function(request, response) {
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


module.exports = router;