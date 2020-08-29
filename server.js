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

    console.log(intent);
    console.log(intent.client_secret);
    res.status(200).json({ client_secret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/calculateShipping", async (req, res) => {
  // console.log(req)
  console.log(req)
  const { shippingAddress } = req.body;

  try {
    if (shippingAddress.country === 'CA') {
      res.status(200).json({ supportedShippingOptions: [
        {
          id: 'free-shipping',
          label: 'FREE - Mail',
          detail: 'Arrives in 4 to 10 business days',
          amount: 0,
        },
        {
          id: 'expedited-shipping',
          label: 'Expedited Parcel',
          detail: 'Arrives in 2 to 4 business days',
          amount: 5,
        },
      ]});
    }
    else if (shippingAddress.country === 'US') {
      res.status(200).json({ supportedShippingOptions: [
        {
          id: 'expedited-shipping-us',
          label: '"Expedited Parcel',
          detail: 'Arrives in 5 to 10 business days',
          amount: 15,
        },
      ]});
    }
    else {
      res.status(200).json({ supportedShippingOptions: [
        {
          id: 'small-packet-shipping',
          label: 'Small Packet - Air',
          detail: 'Arrives in 6 to 12 business days',
          amount: 20,
        },
      ]});
    }
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
// PORT, Listen
const port = 5000;
app.listen(port, () => console.log(`App running on PORT ${port}`));
