import Model from './model';
import { pool } from './pool';

class Product extends Model {
  constructor() {
    this.pool = pool;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  async getProducts() {
    this.pool.query('SELECT * FROM products', (error, results) => {
      if (error) {
        throw error;
      }
      return results.rows;
    })
  }
}

export default Product;