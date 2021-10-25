import express from "express";
import Stripe from "stripe";
import "dotenv/config";

import ProductManagementService from "../products_management";

const router = express.Router();
const stripe = new Stripe(process.env.SECRET_KEY!, { apiVersion: '2020-08-27' });


router.get("/", async (req, res) => {
  try {
    const results = await ProductManagementService.getProducts();
    res.status(200).json(results);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/skus", async (req, res) => {
  try {
    const results = await ProductManagementService.getProductSkus();
    res.status(200).json(results);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    
    const product = req.body.product;
    const productImages = req.body.product_images;
    const prices = req.body.prices;
    const skus = req.body.skus;
    // TODO: Validate product, productImages, prices, skus

    const productId = await ProductManagementService.createFullProduct(product, skus, productImages, prices);
    res.status(200).json({ message: "Product created successfully.", productId });
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/inventory/:skuId", async (req, res) => {
  try {
    const skuId = req.params.skuId;
    const inventory = await ProductManagementService.getInventory(skuId);
    res.status(200).json(inventory);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err);
  }
});


// STRIPE ENDPOINTS (TO BE REMOVED ONCE LEGACY)

// get stripe product
router.get("/stripe/:prod_id", async (req, res) => {
  try {
    const product = await stripe.products.retrieve(req.params.prod_id);
    res.status(200).json(product);
  }
  catch(err: any) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// update stripe product
router.post("/stripe/:prod_id", async (req, res) => {
  try {
    const product = await stripe.products.update(
      req.params.prod_id,
      req.body
      );
    res.status(200).json(product);
  }
  catch(err: any) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// create stripe product
router.post("stripe/create", async (req, res) => {
  try {
    console.log(req.body);
    const product = await stripe.products.create(
      req.body
      );
    res.status(200).json(product);
  }
  catch(err: any) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// create stripe sku
router.post("/stripe/sku/create", async (req, res) => {
  try {
    const product = await stripe.skus.create(
      req.body
    );
    res.status(200).json(product);
  }
  catch(err: any) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

// get sku
router.get("/stripe/sku/:sku_id", async (req, res) => {
  try {
    const sku = await stripe.skus.retrieve(req.params.sku_id);
    res.status(200).json(sku);
  }
  catch(err: any) {
    console.error(err);
    res.status(err.statusCode).send(err);
  }
});

export default router;