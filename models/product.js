import Model from './model';
import { pool } from './pool';

class Product extends Model {
  constructor() {
    super("products");
    this.pool = pool;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  async getProducts() {
    return this.pool.query('SELECT * FROM products');
  }
}

export default Product;