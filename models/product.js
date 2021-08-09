import Model from './model';
import { pool } from './pool';

class Product extends Model {
  constructor() {
    super('products');
    this.pool = pool;
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  async getProducts() {
    return this.pool.query('SELECT * FROM products');
  }

  async getProductsFeatured() {
    return this.pool.query(
      'SELECT product_images.link, products.product_name, prices.value FROM product_images inner JOIN products ON product_images.product_id = id inner JOIN prices ON product_images.product_id = prices.product_id WHERE featured = TRUE'
    );
  }

  async getInventoryBySku(sku) {
    console.log(sku)
    return this.pool.query(
      `SELECT skus.inventory FROM skus WHERE id = ${sku};`
    );
  }
}

export default Product;
