const express = require("express");
const router = express.Router();
const cors = require("cors");
const uuid = require("uuid");
const { GoogleSpreadsheet } = require('google-spreadsheet');
require("dotenv/config");
const fs = require('fs');
const stripe = require("stripe")(process.env.SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET_KEY;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

router.post("/payment_intent", cors(corsOptions), async (req, res) => {
  const { price, receipt_email, shipping, orderItems, currency} = req.body;

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
      currency: currency,
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
  const { receipt_email, shipping, orderItems, metadata, currency} = req.body;
  try {
    const order = await stripe.orders.create({
      currency: 'cad',
      email: receipt_email,
      items: orderItems,
      shipping: shipping,
      metadata: metadata,
    });

    const doc = new GoogleSpreadsheet('1MUf9i0TeStKA_4wMaieuc8e_msuhhMLQPpTP4cTVo78');

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const today = new Date().toLocaleDateString();

    const sheet = doc.sheetsByTitle['Sale Logs'];

    for (var i = 0; i < orderItems.length; i++) {
      [size, design, color, item] = orderItems[i].description.split('/');

      for (var j = 0; j < orderItems[i].quantity; j++) {
        const newRow = await sheet.addRow({
          Date: today, 
          Name: shipping.name,
          Address: `${shipping.address.line1}, ${shipping.address.city}, ${shipping.address.state}, ${shipping.address.country}, ${shipping.address.postal_code}`,
          Inventory: item,
          Quantity: 1,
          Design: design,
          Color: color,
          Size: size,
          Shipping: metadata['Shipping Method'],
          Price: `${orderItems[i].amount / 100}`,
          Email: receipt_email,
          Currency: `${currency}`,
        });
      }
    }

    const emptyRow = await sheet.addRow({ Date: '------------------------' });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

 // Callback when the shipping address is updated.
router.post("/calculate_shipping", cors(corsOptions), async (req, res) => {
  const { shippingAddress, total, shipByMail, currency } = req.body;
  try {
    if (currency === 'CAD') {
      if (shippingAddress.country === 'CA') {
        const options = [];
        if (shipByMail) {
          options.push({
            id: 'mail-shipping',
            label: 'Mail',
            detail: 'Arrives in 5 to 10 business days',
            amount: 500,
          });
        }
        if (total >= 70) {
          options.push({
            id: 'free-shipping',
            label: 'Tracked Parcel',
            detail: 'Arrives in 2 to 4 business days',
            amount: 0,
          });
        } else {
          options.push({
            id: 'tracked-parcel',
            label: 'Tracked Parcel',
            detail: 'Arrives in 2 to 4 business days',
            amount: 1000,
          });
        }
        res.status(200).json({ supportedShippingOptions: options });
      }
      else if (shippingAddress.country === 'US') {
        const options = [];
        if (total >= 90) {
          options.push({
            id: 'free-shipping-us',
            label: 'Tracked Parcel',
            detail: 'Arrives in 7 to 14 business days',
            amount: 0,
          });
        } else {
          options.push({
            id: 'tracked-parcel-us',
            label: 'Tracked Parcel',
            detail: 'Arrives in 7 to 14 business days',
            amount: 600,
          });
        }
        res.status(200).json({ supportedShippingOptions: options });
      }
      else {
        res.status(200).json({ supportedShippingOptions: [
          {
            id: 'tracked-parcel-intl',
            label: 'Tracked Parcel',
            detail: 'Arrives in 7 to 21 business days',
            amount: 4000,
          },
        ]});
      }
    // US SHIPPING
    } else {
      if (shippingAddress.country === 'CA') {
        const options = [];
        if (shipByMail) {
          options.push({
            id: 'mail-shipping',
            label: 'Mail',
            detail: 'Arrives in 5 to 10 business days',
            amount: 400,
          });
        }
        if (total >= 55) {
          options.push({
            id: 'free-shipping',
            label: 'Tracked Parcel',
            detail: 'Arrives in 2 to 4 business days',
            amount: 0,
          });
        } else {
          options.push({
            id: 'tracked-parcel',
            label: 'Tracked Parcel',
            detail: 'Arrives in 2 to 4 business days',
            amount: 800,
          });
        }
        res.status(200).json({ supportedShippingOptions: options });
      }
      else if (shippingAddress.country === 'US') {
        const options = [];
        if (total >= 75) {
          options.push({
            id: 'free-shipping-us',
            label: 'Tracked Parcel',
            detail: 'Arrives in 7 to 14 business days',
            amount: 0,
          });
        } else {
          options.push({
            id: 'tracked-parcel-us',
            label: 'Tracked Parcel',
            detail: 'Arrives in 7 to 14 business days',
            amount: 500,
          });
        }
        res.status(200).json({ supportedShippingOptions: options });
      }
      else {
        res.status(200).json({ supportedShippingOptions: [
          {
            id: 'tracked-parcel-intl',
            label: 'Tracked Parcel',
            detail: 'Arrives in 7 to 21 business days',
            amount: 3200,
          },
        ]});
      }

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