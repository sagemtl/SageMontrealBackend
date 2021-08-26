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

router.get('/productsFeatured', async (req, res) => {
  try {
    const results = await ProductManagementService.getProductsFeatured();
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/inventory/sku/:sku', async (req, res) => {
  try {
    let sku: any;
    sku = req.params.sku;
    const results = await ProductManagementService.getInventoryBySku(sku);
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

router.patch('/:id', async (req, res) => {
  try {
    let id: any = req.params.id;
    let product_type: any = req.body.product_type;
    let product_name: any = req.body.product_name;
    let description: any = req.body.description;
    let color: any = req.body.color;
    let model_info: any = req.body.model_info;
    let active: any = req.body.active;
    let featured: any = req.body.featured;
    const results = await ProductManagementService.updateProductInfo(
      id,
      product_type,
      product_name,
      description,
      color,
      model_info,
      active,
      featured
    );
    res.status(200).json({ message: 'Product updated successfully.', id });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch('/inventory/:sku', async (req, res) => {
  try {
    let sku: any = req.params.sku;
    let quantity: any = req.body.quantity;
    const results = await ProductManagementService.updateProductInventory(
      sku,
      quantity
    );
    res
      .status(200)
      .json({ message: 'Product inventory updated successfully.', sku });
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
