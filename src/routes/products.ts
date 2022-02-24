import express from 'express';
import Stripe from 'stripe';
import 'dotenv/config';

import ProductManagementService from '../products_management';

const router = express.Router();
const stripe = new Stripe(process.env.SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

router.get('/', async (req, res) => {
  try {
    const results = await ProductManagementService.getProducts();
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const product = req.body.product;
    const productImages = req.body.product_images;
    const prices = req.body.prices;
    const skus = req.body.skus;
    // TODO: Validate product, productImages, prices, skus

    const productId = await ProductManagementService.createFullProduct(
      product,
      skus,
      productImages,
      prices
    );
    res
      .status(200)
      .json({ message: 'Product created successfully.', productId });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// OLD ENDPOINTS

// get stripe product
router.get('/product/:prod_id', async (req, res) => {
  try {
    const product = await stripe.products.retrieve(req.params.prod_id);
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// update stripe product
router.post('/product/:prod_id', async (req, res) => {
  try {
    const product = await stripe.products.update(req.params.prod_id, req.body);
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// create stripe product
router.post('/create/product', async (req, res) => {
  try {
    const product = await stripe.products.create(req.body);
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// create stripe sku
router.post('/create/sku', async (req, res) => {
  try {
    const product = await stripe.skus.create(req.body);
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// get sku
router.get('/sku/:sku_id', async (req, res) => {
  try {
    const sku = await stripe.skus.retrieve(req.params.sku_id);
    res.status(200).json(sku);
  } catch (err) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

export default router;
