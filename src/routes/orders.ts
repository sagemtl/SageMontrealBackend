import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';

import OrderManagementService from '../orders_management';

const router = express.Router();
const stripe = new Stripe(process.env.SECRET_KEY!, {
  apiVersion: '2020-08-27',
});
const endpointSecret = process.env.ENDPOINT_SECRET_KEY;

router.get('/', async (req, res) => {
  try {
    const results = await OrderManagementService.getOrders();
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const results = await OrderManagementService.getOrderDetailsById(orderId);
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const orderInfo = req.body.orderInfo;
    const orderItems = req.body.orderItems;
    const orderId = await OrderManagementService.createOrder(
      orderInfo,
      orderItems
    );
    res.status(200).json({ message: 'Order created successfully.', orderId });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch('/:orderId/status', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderState = req.body.order_state;
    await OrderManagementService.updateOrderState(orderId, orderState);
    res
      .status(200)
      .json({
        message: 'Order state updated successfully.',
        orderId,
        orderState,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch('/:orderId/tracking', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const trackingNumber = req.body.tracking_number;
    await OrderManagementService.updateTrackingNumber(orderId, trackingNumber);
    res
      .status(200)
      .json({
        message: 'Order state updated successfully.',
        orderId,
        trackingNumber,
      });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Old endpoints

router.post('/payment_intent', async (req, res) => {
  const { price, receipt_email, shipping, orderItems, currency } = req.body;

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
      shipping: shipping,
    });

    res.status(200).json({ client_secret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Callback when the shipping address is updated.
router.post('/calculate_shipping', async (req, res) => {
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
      } else if (shippingAddress.country === 'US') {
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
      } else {
        res.status(200).json({
          supportedShippingOptions: [
            {
              id: 'tracked-parcel-intl',
              label: 'Tracked Parcel',
              detail: 'Arrives in 7 to 21 business days',
              amount: 4000,
            },
          ],
        });
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
      } else if (shippingAddress.country === 'US') {
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
      } else {
        res.status(200).json({
          supportedShippingOptions: [
            {
              id: 'tracked-parcel-intl',
              label: 'Tracked Parcel',
              detail: 'Arrives in 7 to 21 business days',
              amount: 3200,
            },
          ],
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// router.post('/webhook', function(request, response) {
//   const sig = request.headers['stripe-signature'];
//   const body = request.body;

//   let event = null;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     // invalid signature
//     response.status(400).end();
//     return;
//   }

//   let intent = null;
//   switch (event['type']) {
//     case 'payment_intent.succeeded':
//       intent = event.data.object;
//       console.log("Succeeded:", intent.id);
//       fs.appendFile('log.txt', JSON.stringify(intent), function (err) {
//         if (err) throw err;
//         console.log('Saved!');
//       });
//       break;
//     case 'payment_intent.payment_failed':
//       intent = event.data.object;
//       const message = intent.last_payment_error && intent.last_payment_error.message;
//       console.log('Failed:', intent.id, message);
//       break;
//   }

//   response.sendStatus(200);
// });

export default router;
