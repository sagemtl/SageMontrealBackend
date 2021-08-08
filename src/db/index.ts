import { Pool } from 'pg';
import { Product } from './models/product';
import { Price } from './models/price';
import { ProductImage } from './models/product_image';
import { Sku } from './models/sku';

export {
  Product,
  Price,
  ProductImage,
  Sku
};

const pool = new Pool({
  ssl: { rejectUnauthorized: false }
});

class DAO {
  readonly pool: Pool;

  constructor() {
    this.pool = pool;
    this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
  }

  async query(text: string, params?: any) {
    const start = Date.now();
    const res = await this.pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  };
}

export default DAO;
